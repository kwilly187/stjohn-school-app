import {getCalendarFeed} from './calendar/calendar-feed.mjs';
import {publicEventScope,SCHOOL_TIME_ZONE} from './public-calendar.mjs';
const localDate = new Intl.DateTimeFormat('en-CA',{timeZone:SCHOOL_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'});
const localTime = new Intl.DateTimeFormat('en-US',{timeZone:SCHOOL_TIME_ZONE,hour:'numeric',minute:'2-digit',timeZoneName:'short'});

/** @param {Date} now @param {typeof getCalendarFeed} [fetchCalendar] */
export function schoolHomeCalendar(now,fetchCalendar=getCalendarFeed){
 const months=new Map();
 /** @type {typeof getCalendarFeed} */
 const read=({source='activities',month})=>{
  const key=source+':'+month;
  if(!months.has(key))months.set(key,fetchCalendar({source,month,now}));
  return months.get(key);
 };
 return read;
}
export function schoolPlanDays(now){
 const today=localDate.format(now), tomorrow=new Date(today+'T12:00:00Z');
 tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
 return [today,tomorrow.toISOString().slice(0,10)];
}
/** @param {Date} now @param {typeof getCalendarFeed} readCalendar @param {Promise<{eventId:string}|null>} headsUp */
export async function getSchoolDayPlan(now,readCalendar,headsUp){
 const days=schoolPlanDays(now);
 const months=[...new Set(days.map(day=>day.slice(0,7)))];
 const [results,exception]=await Promise.all([Promise.all(months.map(month=>readCalendar({source:'activities',month,now}))),headsUp]);
 if(results.some(result=>result.status!=='ok'))return {status:'unavailable',events:[],hasHeadsUp:false};
 const unique=new Map();
 for(const result of results)for(const event of result.events){
  if(event.title==='Untitled calendar event'||!event.title||!Array.isArray(event.dayKeys))continue;
  const day=days.find(day=>event.dayKeys.includes(day));
  if(!day||unique.has(event.id))continue;
  if(!event.allDay&&Date.parse(event.end)<=now.getTime())continue;
  unique.set(event.id,{event,day});
 }
 const hasHeadsUp=Boolean(exception&&unique.delete(exception.eventId));
 const dayEvents=[...unique.values()].sort((a,b)=>a.day.localeCompare(b.day)||Number(b.event.allDay)-Number(a.event.allDay)||a.event.start.localeCompare(b.event.start));
 const events=dayEvents.slice(0,2).map(({event,day})=>({
  id:event.id, title:event.title, day, label:day===days[0]?'Today':'Tomorrow',
  time:!event.allDay&&event.startDay===day&&!/early (?:release|dismissal)/i.test(event.title)&&Number.isFinite(Date.parse(event.start))?localTime.format(new Date(event.start)):null,
  location:event.location||null, scope:publicEventScope(event.title)||'Public school calendar',
 }));
 return {status:'ok',events,hasHeadsUp};
}
