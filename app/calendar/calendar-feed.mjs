// Server-only reader for the two school-published calendars. Never an enrollment feed.
// ICAL.js API: https://kewisch.github.io/ical.js/api/ICAL.Event.html
import ICAL from 'ical.js';
import {calendarSources, school} from '../school-data.mjs';
import {formatEventDate} from '../public-calendar.mjs';

const MAX_BYTES=2_000_000, MAX_STEPS=100_000, CACHE_MS=300_000;
const caches=new Map();
// Only these five deep links were checked in the public source event popups.
const verifiedAthleticsLinks={
  "1v6ipvfhkntdgbovsm1h3kiedg@google.com": {
    "title": "MS Basketball at DCA",
    "date": "2026-11-10",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MXY2aXB2ZmhrbnRkZ2JvdnNtMWgza2llZGcgYXRobGV0aWMuZGlyZWN0b3JAc3Rqb2hub2NhbGEub3Jn"
  },
  "35rbei126hnu8f99pi77ldimgc@google.com": {
    "title": "7/8 Boys Basketball at Faith Eustis",
    "date": "2026-11-12",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MzVyYmVpMTI2aG51OGY5OXBpNzdsZGltZ2MgYXRobGV0aWMuZGlyZWN0b3JAc3Rqb2hub2NhbGEub3Jn"
  },
  "31u87ragv8gkt0s919874gjtc7@google.com": {
    "title": "HS Boys basketball PreSeason classic",
    "date": "2026-11-13",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MzF1ODdyYWd2OGdrdDBzOTE5ODc0Z2p0YzcgYXRobGV0aWMuZGlyZWN0b3JAc3Rqb2hub2NhbGEub3Jn"
  },
  "2dkuc5em5eqqr14297c1tgsso9@google.com": {
    "title": "Middle School basketball v Seven Rivers",
    "date": "2026-11-17",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MmRrdWM1ZW01ZXFxcjE0Mjk3YzF0Z3NzbzkgYXRobGV0aWMuZGlyZWN0b3JAc3Rqb2hub2NhbGEub3Jn"
  },
  "17gn1tu06im6btuuflj4g6e71t@google.com": {
    "title": "MS Basketball at Oak Hall",
    "date": "2026-11-19",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MTdnbjF0dTA2aW02YnR1dWZsajRnNmU3MXQgYXRobGV0aWMuZGlyZWN0b3JAc3Rqb2hub2NhbGEub3Jn"
  }
};
const localDay=date=>new Intl.DateTimeFormat('en-CA',{timeZone:school.timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const addDay=day=>{const d=new Date(`${day}T00:00:00Z`);d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);};
const previousDay=day=>{const d=new Date(`${day}T00:00:00Z`);d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10);};
export const calendarFeedSources={
  activities:`https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarSources.activities)}/public/basic.ics`,
  athletics:`https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarSources.athletics)}/public/basic.ics`,
};
function validate(source,month) {
  if (!Object.hasOwn(calendarFeedSources,source)) throw new Error('Unknown calendar source');
  if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Invalid calendar month');
  const start=`${month}-01`;
  const end=new Date(`${start}T00:00:00Z`);end.setUTCMonth(end.getUTCMonth()+1);
  return {start,end:end.toISOString().slice(0,10)};
}
/** @param {{source?:string,month:string,view?:string,now?:Date}} options */
export function calendarFeedRange({source='activities',month,view='MONTH',now=new Date()}) {
  const window=validate(source,month);
  if(!['MONTH','AGENDA'].includes(view))throw new Error('Invalid calendar view');
  if(!Number.isFinite(now.getTime()))throw new Error('Invalid calendar reference time');
  if(view==='AGENDA') {
    const today=localDay(now);
    window.start=today.startsWith(month)?today:window.start;
    let end=window.start;for(let i=0;i<45;i++)end=addDay(end);window.end=end;
  }
  return window;
}
export function formatCalendarStart(event) {
  if(event.allDay)return formatEventDate(event);
  return new Intl.DateTimeFormat('en-US',{timeZone:school.timeZone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(event.start));
}
const isPublic=component=>!['PRIVATE','CONFIDENTIAL'].includes(String(component.getFirstPropertyValue('class')||'').toUpperCase());

/** Read public title/date/location only. Throws on incomplete/unsupported parsing, never returns a partial success.
 * @param {string} text
 * @param {{source?:string,month:string,view?:string,now?:Date}} options
 */
export function parseCalendarFeed(text,{source='activities',month,view='MONTH',now=new Date()}) {
  const window=calendarFeedRange({source,month,view,now});
  if (Buffer.byteLength(text,'utf8')>MAX_BYTES) throw new Error('Calendar exceeds size limit');
  if (!/^BEGIN:VCALENDAR\r?\n/.test(text)||!/END:VCALENDAR\s*$/.test(text)) throw new Error('Invalid calendar response');
  const started=Date.now();let steps=0;
  const bound=()=>{if(++steps>MAX_STEPS||Date.now()-started>2500)throw new Error('Calendar expansion limit exceeded');};
  const root=new ICAL.Component(ICAL.parse(text));
  if(root.name!=='vcalendar')throw new Error('Invalid calendar component');
  const zones=new Set(['UTC','Z']);
  for(const component of root.getAllSubcomponents('vtimezone')) {const zone=new ICAL.Timezone(component);ICAL.TimezoneService.register(zone.tzid,zone);zones.add(zone.tzid);}
  const raw=root.getAllSubcomponents('vevent');
  if(raw.length>10_000)throw new Error('Calendar event limit exceeded');
  // Published revisions share a UID/recurrence key. Pick highest sequence, then latest revision.
  const unique=new Map();
  const rank=component=>[Number(component.getFirstPropertyValue('sequence')||0),String(component.getFirstPropertyValue('last-modified')||component.getFirstPropertyValue('dtstamp')||'')];
  for(const component of raw) {
    bound();const uid=component.getFirstPropertyValue('uid');
    if(!uid)throw new Error('Calendar event missing identity');
    const key=`${uid}/${component.getFirstPropertyValue('recurrence-id')||''}`;
    const prior=unique.get(key),nextRank=rank(component),priorRank=prior?rank(prior):[-1,''];
    if(!prior||nextRank[0]>priorRank[0]||(nextRank[0]===priorRank[0]&&nextRank[1]>=priorRank[1]))unique.set(key,component);
  }
  const components=[...unique.values()];
  const suppressed=new Set(components.filter(c=>!c.hasProperty('recurrence-id')&&(c.getFirstPropertyValue('status')==='CANCELLED'||!isPublic(c))).map(c=>c.getFirstPropertyValue('uid')));
  const exceptions=new Map();
  for(const component of components)if(component.hasProperty('recurrence-id')){const uid=component.getFirstPropertyValue('uid');exceptions.set(uid,[...(exceptions.get(uid)||[]),component]);}
  const output=new Map();
  const serialize=time=>{
    if(time.isDate)return time.toString();
    if(time.zone.tzid==='floating') {
      if(!zones.has(school.timeZone))throw new Error('Missing school timezone');
      time=time.clone();time.zone=ICAL.TimezoneService.get(school.timeZone);
    }
    return time.toJSDate().toISOString();
  };
  const emit=(event,startTime,endTime,recurrenceId)=>{
    if(!isPublic(event.component)||event.component.getFirstPropertyValue('status')==='CANCELLED')return;
    for(const prop of ['dtstart','dtend']){const tzid=event.component.getFirstProperty(prop)?.getParameter('tzid');if(tzid&&!zones.has(tzid))throw new Error('Unsupported calendar timezone');}
    if(!startTime||!endTime)throw new Error('Calendar event missing date');
    const allDay=startTime.isDate,start=serialize(startTime),end=serialize(endTime);
    if(end<start)throw new Error('Invalid calendar range');
    const startDay=allDay?start:localDay(new Date(start));
    const endDay=allDay?previousDay(end):localDay(new Date(Math.max(Date.parse(start),Date.parse(end)-1)));
    if(endDay<window.start||startDay>=window.end)return;
    const dayKeys=[];
    for(let day=startDay<window.start?window.start:startDay;day<=endDay&&day<window.end;day=addDay(day))dayKeys.push(day);
    const result={id:`${source}:${event.uid}/${recurrenceId||start}`,title:(event.summary||'Untitled calendar event').trim(),start,end,allDay,location:event.location?.trim()||null,startDay,endDay,dayKeys};
    const verified=source==='athletics'?verifiedAthleticsLinks[event.uid]:null;
    const sourceUrl=verified?.title===result.title&&verified.date===startDay?verified.url:'https://stjohnocala.org/calendar/';
    const dateText=formatEventDate(result).replace(allDay&&/early release/i.test(result.title)?/ · All day$/:/$^/,'');
    output.set(result.id,{...result,dateText,startText:formatCalendarStart(result),sourceUrl});
    if(output.size>2000)throw new Error('Calendar output limit exceeded');
  };
  for(const component of components) {
    bound();const uid=component.getFirstPropertyValue('uid');
    if(suppressed.has(uid)||!isPublic(component)||component.getFirstPropertyValue('status')==='CANCELLED')continue;
    const event=new ICAL.Event(component,{strictExceptions:true,exceptions:component.hasProperty('recurrence-id')?[]:(exceptions.get(uid)||[])});
    if(component.getFirstProperty('recurrence-id')?.getParameter('range'))throw new Error('Unsupported ranged calendar exception');
    if(!event.startDate)throw new Error('Calendar event missing start');
    if(event.isRecurrenceException()){emit(event,event.startDate,event.endDate,event.recurrenceId.toString());continue;}
    if(!event.isRecurring()){emit(event,event.startDate,event.endDate);continue;}
    for(const rule of component.getAllProperties('rrule'))if(['SECONDLY','MINUTELY','HOURLY'].includes(rule.getFirstValue().freq))throw new Error('Calendar recurrence frequency exceeds limit');
    if(!component.hasProperty('rrule'))component.addPropertyWithValue('rdate',event.startDate.clone());
    const iterator=event.iterator();
    for(let occurrence=iterator.next();occurrence;occurrence=iterator.next()) {
      bound();const serialized=serialize(occurrence),day=occurrence.isDate?serialized:localDay(new Date(serialized));
      if(day>=window.end)break;
      const detail=event.getOccurrenceDetails(occurrence);
      if(detail.item===event)emit(event,detail.startDate,detail.endDate,occurrence.toString());
    }
  }
  return [...output.values()].sort((a,b)=>a.startDay.localeCompare(b.startDay)||(Number(b.allDay)-Number(a.allDay))||a.start.localeCompare(b.start)||a.title.localeCompare(b.title));
}

async function retrieve(source,fetchImpl) {
  const response=await fetchImpl(calendarFeedSources[source],{signal:AbortSignal.timeout(8000),cache:'no-store',redirect:'error'});
  if(!response.ok)throw new Error(`Calendar source returned HTTP ${response.status}`);
  if(Number(response.headers.get('content-length'))>MAX_BYTES)throw new Error('Calendar exceeds size limit');
  if(!response.body)throw new Error('Calendar returned no body');
  const reader=response.body.getReader(),chunks=[];let bytes=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>MAX_BYTES)throw new Error('Calendar exceeds size limit');chunks.push(value);}}
  catch(error){await reader.cancel().catch(()=>{});throw error;}
  return {text:Buffer.concat(chunks).toString('utf8'),retrievedAt:new Date().toISOString()};
}

/** @param {{source?:string,month:string,view?:string,now?:Date,fetchImpl?:typeof fetch}} options */
export async function getCalendarFeed({source='activities',month,view='MONTH',now=new Date(),fetchImpl=fetch}) {
  try {
    const range=calendarFeedRange({source,month,view,now});
    if(!Number.isFinite(now.getTime()))throw new Error('Invalid calendar reference time');
    const current=localDay(now).slice(0,7),index=value=>Number(value.slice(0,4))*12+Number(value.slice(5,7));
    if(Math.abs(index(month)-index(current))>12)throw new Error('Calendar month outside supported range');
    let data=caches.get(source);
    if(fetchImpl!==fetch||!data||Date.now()-Date.parse(data.retrievedAt)>=CACHE_MS)data=await retrieve(source,fetchImpl);
    const events=parseCalendarFeed(data.text,{source,month,view,now});
    if(fetchImpl===fetch)caches.set(source,data);
    return {status:'ok',source,month,view,rangeStart:range.start,rangeEnd:range.end,retrievedAt:data.retrievedAt,sourceUrl:calendarFeedSources[source],events};
  } catch(error) {
    return {status:'unavailable',source,month,view,rangeStart:null,rangeEnd:null,retrievedAt:null,sourceUrl:Object.hasOwn(calendarFeedSources,source)?calendarFeedSources[source]:'https://stjohnocala.org/calendar/',events:[],error:error instanceof Error?error.message:'Calendar unavailable'};
  }
}
