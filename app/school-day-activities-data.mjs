import {schoolPlanDays} from './school-day-plan-data.mjs';
import {SCHOOL_TIME_ZONE} from './public-calendar.mjs';
import {matchDeviceActivity} from './device-activity-matching.mjs';
const time=new Intl.DateTimeFormat('en-US',{timeZone:SCHOOL_TIME_ZONE,hour:'numeric',minute:'2-digit',timeZoneName:'short'});
/** @param {Date} now @param {typeof import('./calendar/calendar-feed.mjs').getCalendarFeed} readCalendar */
export async function getPublicDayActivities(now,readCalendar){
 const days=schoolPlanDays(now),months=[...new Set(days.map(day=>day.slice(0,7)))];
 const reads=await Promise.all(months.flatMap(month=>['activities','athletics'].map(async source=>({source,...await readCalendar({source,month,now})}))));
 const events=new Map();
 for(const read of reads){if(read.status!=='ok')continue;
  for(const event of read.events){
   if(!Array.from({length:12},(_,i)=>i+1).some(grade=>matchDeviceActivity(event.title,grade)))continue;
   const day=days.find(day=>event.dayKeys.includes(day));if(!day||!event.allDay&&Date.parse(event.end)<=now.getTime())continue;
   const duplicate=[event.title.toLowerCase(),event.start,event.location||''].join('\u0000');
   if(!events.has(duplicate))events.set(duplicate,{id:event.id,title:event.title,day,source:read.source,start:event.start,label:day===days[0]?'Today':'Tomorrow',location:event.location||null,time:!event.allDay&&event.startDay===day&&Number.isFinite(Date.parse(event.start))?time.format(new Date(event.start)):null});
  }
 }
 return {complete:reads.every(read=>read.status==='ok'),events:[...events.values()].sort((a,b)=>a.day.localeCompare(b.day)||a.start.localeCompare(b.start))};
}
