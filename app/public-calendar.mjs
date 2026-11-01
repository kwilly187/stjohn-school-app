// Server-side public calendar reader. No identity, private data, or authorization.
// Parser reference: https://kewisch.github.io/ical.js/api/ICAL.Event.html
import ICAL from 'ical.js';

export const PUBLIC_CALENDAR_URL = 'https://calendar.google.com/calendar/ical/stjohnocala.org_g86bu9pdkp3rcalk3c8jf5ejc0%40group.calendar.google.com/public/basic.ics';
export const SCHOOL_TIME_ZONE = 'America/New_York';
const MAX_BYTES = 2_000_000;
const WINDOW_DAYS = 45;
const CACHE_MS = 300_000;
const MAX_STEPS = 25_000;
let cached = null;
// Three public event links independently verified in the rendered source calendar.
const verifiedEventLinks = {
  "7huehno20f2h50sao8hqh13jet@google.com": {
    "title": "Florida-Georgia District Youth Gathering for Grades 6-8",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=N2h1ZWhubzIwZjJoNTBzYW84aHFoMTNqZXQgc3Rqb2hub2NhbGEub3JnX2c4NmJ1OXBka3AzcmNhbGszYzhqZjVlamMwQGc"
  },
  "2lgqj6h14uk1i2t6t2rbn0hctq@google.com": {
    "title": "Early Release- All grades",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MmxncWo2aDE0dWsxaTJ0NnQycmJuMGhjdHEgc3Rqb2hub2NhbGEub3JnX2c4NmJ1OXBka3AzcmNhbGszYzhqZjVlamMwQGc"
  },
  "2h12i82j8htkv24fuspkc3sule@google.com": {
    "title": "Thanksgiving Break | No School",
    "url": "https://calendar.google.com/calendar/u/0/event?eid=MmgxMmk4Mmo4aHRrdjI0ZnVzcGtjM3N1bGUgc3Rqb2hub2NhbGEub3JnX2c4NmJ1OXBka3AzcmNhbGszYzhqZjVlamMwQGc"
  }
};

// Only explicit audiences verified against the school's public calendar.
// General public events remain in the full calendar, not a personalized feed.
export function publicEventScope(title) {
  if (['Early Release- All grades','Thanksgiving Break | No School'].includes(title.trim())) return 'Schoolwide';
  if (title.trim() === 'Florida-Georgia District Youth Gathering for Grades 6-8') return 'Grades 6–8';
  return null;
}
const localDate = date => new Intl.DateTimeFormat('en-CA',{timeZone:SCHOOL_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const dayFormat = new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'});
const timeFormat = new Intl.DateTimeFormat('en-US',{timeZone:SCHOOL_TIME_ZONE,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});

export function formatEventDate(event) {
  if (!event.allDay) return `${timeFormat.format(new Date(event.start))} – ${timeFormat.format(new Date(event.end))}`;
  const first = new Date(`${event.start}T00:00:00Z`);
  // RFC5545 DATE DTEND is exclusive; subtract in UTC calendar-day space, not DST hours.
  const last = new Date(`${event.end}T00:00:00Z`);
  last.setUTCDate(last.getUTCDate()-1);
  return `${dayFormat.format(first)}${last > first ? ` – ${dayFormat.format(last)}` : ''} · All day`;
}

/** Pure parser for synthetic tests and read-only server use; throws rather than fabricating zero results.
 * @param {string} text
 * @param {{grades?: number[], now?: Date}} [options]
 */
export function parsePublicCalendar(text, {grades = [], now = new Date()} = {}) {
  const instant = new Date(now);
  if (!Number.isFinite(instant.getTime())) throw new Error('Invalid calendar reference time');
  if (Buffer.byteLength(text,'utf8') > MAX_BYTES) throw new Error('Calendar exceeds size limit');
  if (!/^BEGIN:VCALENDAR\r?\n/.test(text) || !/END:VCALENDAR\s*$/.test(text)) throw new Error('Invalid calendar response');
  const root = new ICAL.Component(ICAL.parse(text));
  if (root.name !== 'vcalendar') throw new Error('Invalid calendar component');
  for (const component of root.getAllSubcomponents('vtimezone')) {
    const timezone = new ICAL.Timezone(component);
    ICAL.TimezoneService.register(timezone.tzid,timezone);
  }
  const components = root.getAllSubcomponents('vevent');
  if (components.length > 10_000) throw new Error('Calendar exceeds event limit');
  const cancelledSeries = new Set(components.filter(component => !component.hasProperty('recurrence-id') && component.getFirstPropertyValue('status') === 'CANCELLED').map(component => component.getFirstPropertyValue('uid')));
  const exceptionsByUid = new Map();
  for (const component of components) {
    if (component.hasProperty('recurrence-id')) {
      const uid=component.getFirstPropertyValue('uid');
      exceptionsByUid.set(uid,[...(exceptionsByUid.get(uid)||[]),component]);
    }
  }
  if (components.length > 10_000) throw new Error('Calendar exceeds event limit');
  const end = new Date(instant.getTime()+WINDOW_DAYS*86400000);
  const today = localDate(instant), lastDate = localDate(end);
  const output = new Map();
  let steps = 0;
  const started = Date.now();
  const bound = () => {if (++steps > MAX_STEPS || Date.now()-started > 1500) throw new Error('Calendar recurrence limit exceeded');};
  const serialize = time => {
    if (time.isDate) return time.toString();
    if (time.zone.tzid === 'floating') {
      const zone=ICAL.TimezoneService.get(SCHOOL_TIME_ZONE);
      if (!zone) throw new Error('Missing school time zone');
      time=time.clone(); time.zone=zone;
    }
    return time.toJSDate().toISOString();
  };
  const emit = (event, startTime, endTime, recurrenceId) => {
    if (event.component.getFirstPropertyValue('status') === 'CANCELLED') return;
    const title=(event.summary || '').trim();
    const scope=publicEventScope(title);
    if (!scope || (scope === 'Grades 6–8' && !grades.some(grade=>[6,7,8].includes(grade)))) return;
    for (const property of ['dtstart','dtend']) {
      const tzid=event.component.getFirstProperty(property)?.getParameter('tzid');
      if (tzid && !ICAL.TimezoneService.has(tzid)) throw new Error('Unsupported calendar time zone');
    }
    const allDay=startTime.isDate;
    const start=serialize(startTime), finish=serialize(endTime);
    if (allDay ? (finish <= today || start > lastDate) : (Date.parse(finish) <= instant.getTime() || Date.parse(start) > end.getTime())) return;
    if (finish < start) throw new Error('Invalid calendar event range');
    const verifiedLink=verifiedEventLinks[event.uid];
    const sourceUrl=verifiedLink?.title === title ? verifiedLink.url : 'https://stjohnocala.org/calendar/';
    const result={id:`${event.uid}/${recurrenceId || start}`,title,start,end:finish,allDay,scope,sourceUrl};
    output.set(result.id,{...result,dateText:formatEventDate(result)});
  };
  for (const component of components) {
    bound();
    if (cancelledSeries.has(component.getFirstPropertyValue('uid'))) continue;
    const event=new ICAL.Event(component,{strictExceptions:true,exceptions:component.hasProperty('recurrence-id') ? [] : (exceptionsByUid.get(component.getFirstPropertyValue('uid')) || [])});
    if (component.getFirstPropertyValue('status') === 'CANCELLED') continue;
    if (event.isRecurrenceException()) {
      if (component.getFirstProperty('recurrence-id')?.getParameter('range')) throw new Error('Unsupported ranged calendar exception');
      if (event.startDate) emit(event,event.startDate,event.endDate,event.recurrenceId.toString());
      continue;
    }
    // No reason to expand a wholly unrelated public series.
    if (!publicEventScope(event.summary || '')) continue;
    if (!event.startDate) throw new Error('Calendar event missing start');
    for(const rule of component.getAllProperties('rrule')) {
      if (['SECONDLY','MINUTELY','HOURLY'].includes(rule.getFirstValue().freq)) throw new Error('Calendar recurrence frequency exceeds limit');
    }
    if (!event.isRecurring()) {emit(event,event.startDate,event.endDate);continue;}
    // ICAL.js RDATE-only expansion omits DTSTART unless it is an explicit RDATE.
    // Include it in the recurrence set; the iterator still applies EXDATE.
    if (!component.hasProperty('rrule')) component.addPropertyWithValue('rdate',event.startDate.clone());
    const iterator=event.iterator();
    for(let occurrence=iterator.next(); occurrence; occurrence=iterator.next()) {
      bound();
      const serialized=serialize(occurrence);
      if (occurrence.isDate ? serialized > lastDate : Date.parse(serialized) > end.getTime()) break;
      const detail=event.getOccurrenceDetails(occurrence);
      // Exceptions are emitted separately, also covering moves into the window.
      if (detail.item !== event) continue;
      emit(event,detail.startDate,detail.endDate,occurrence.toString());
    }
  }
  return [...output.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title));
}

async function retrieve(fetchImpl) {
  const response=await fetchImpl(PUBLIC_CALENDAR_URL,{signal:AbortSignal.timeout(8000),cache:'no-store',redirect:'error'});
  if (!response.ok) throw new Error(`Calendar source returned HTTP ${response.status}`);
  if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Calendar exceeds size limit');
  if (!response.body) throw new Error('Calendar source returned no body');
  const reader=response.body.getReader();
  const chunks=[];let size=0;
  try {
    for(;;) {const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BYTES)throw new Error('Calendar exceeds size limit');chunks.push(value);}
  } catch(error) {await reader.cancel().catch(()=>{});throw error;}
  return {text:Buffer.concat(chunks).toString('utf8'),retrievedAt:new Date().toISOString()};
}

/** Five-minute process cache; unavailable is distinct from a successful empty window.
 * @param {{grades?: number[], now?: Date, fetchImpl?: typeof fetch}} [options]
 */
export async function getPublicCalendar({grades = [], now = new Date(), fetchImpl = fetch} = {}) {
  try {
    let source=cached;
    // Test fetch functions do not populate or read the live cache.
    if (fetchImpl !== fetch || !source || Date.now()-Date.parse(source.retrievedAt)>=CACHE_MS) source=await retrieve(fetchImpl);
    const events=parsePublicCalendar(source.text,{grades,now});
    if (fetchImpl === fetch) cached=source;
    return {status:'ok',retrievedAt:source.retrievedAt,sourceUrl:PUBLIC_CALENDAR_URL,events};
  } catch(error) {
    return {status:'unavailable',retrievedAt:null,sourceUrl:PUBLIC_CALENDAR_URL,events:[],error:error instanceof Error ? error.message : 'Calendar unavailable'};
  }
}
