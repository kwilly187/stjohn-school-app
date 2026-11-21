import {getCalendarFeed} from './calendar/calendar-feed.mjs';
import {SCHOOL_TIME_ZONE} from './public-calendar.mjs';

const schoolDate = new Intl.DateTimeFormat('en-CA', {
 timeZone:SCHOOL_TIME_ZONE, year:'numeric', month:'2-digit', day:'2-digit',
});
const weekday = new Intl.DateTimeFormat('en-US', {timeZone:'UTC', weekday:'long'});
const calendarDate = day => new Date(day+'T12:00:00Z');
const isWeekday = date => date.getUTCDay()!==0 && date.getUTCDay()!==6;

export function headsUpDays(now = new Date()) {
 const today=schoolDate.format(now);
 const next=calendarDate(today);
 do next.setUTCDate(next.getUTCDate()+1); while (!isWeekday(next));
 const day=next.toISOString().slice(0,10);
 return [
  ...(isWeekday(calendarDate(today)) ? [{day:today, label:'today'}] : []),
  {day, label:weekday.format(next)},
 ];
}

function schoolException(event, day) {
 if(!event?.dayKeys?.includes(day)||typeof event.title!=='string')return null;
 const title=event.title.trim();
 // Only the source's explicit no-school marker. "No aftercare", holidays,
 // grade-specific labels and timed events are not schoolwide closures.
 const noSchool=/^(?:(.{1,70})\s*\|\s*)?No School$/i.exec(title);
 if(event.allDay&&noSchool&&!/\b(?:grades?|kindergarten|elementary|middle school|high school|preschool|vpk|k[345])\b/i.test(noSchool[1]||'')) {
  return {kind:'No school', reason:noSchool[1]?.trim()};
 }
 if(event.startDay===day && /^Early (?:Release|Dismissal)\s*[-–|]\s*All grades$/i.test(title)) {
  // A calendar event's start time isn't a verified dismissal time.
  return {kind:'Early dismissal'};
 }
 return null;
}

/** @param {Date} [now] @param {typeof getCalendarFeed} [readCalendar] */
export async function getSchoolHeadsUp(now = new Date(), readCalendar = getCalendarFeed) {
 const days=headsUpDays(now);
 // A month read may cover both dates; do not refetch it or use an athletics/private feed.
 const months=new Map();
 for(const {day,label} of days) {
  const month=day.slice(0,7);
  if(!months.has(month))months.set(month, await readCalendar({source:'activities',month,now}));
  const result=months.get(month);
  if(result.status!=='ok')continue;
  const matches=result.events.map(event=>({event, exception:schoolException(event,day)})).filter(item=>item.exception);
  const match=matches.find(item=>item.exception.kind==='No school')||matches[0];
  if(match)return {...match.exception, label, month, eventId:match.event.id};
 }
 return null;
}
