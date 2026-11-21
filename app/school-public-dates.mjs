import {calendarFeedSources,getCalendarFeed} from './calendar/calendar-feed.mjs';
import {shiftMonth} from './calendar/calendar-state.mjs';
import {formatEventDate,publicEventScope,SCHOOL_TIME_ZONE} from './public-calendar.mjs';

const WINDOW_MS = 45*24*60*60*1000;
const localDate = new Intl.DateTimeFormat('en-CA',{timeZone:SCHOOL_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'});

/** Add the conservative student date window on top of the same Activities feed used by Calendar.
 * @param {{grades?:number[],allPublic?:boolean,now?:Date,readCalendar?:typeof getCalendarFeed}} [options]
 */
export async function getSchoolPublicDates({grades=[],allPublic=false,now=new Date(),readCalendar=getCalendarFeed}={}){
 const source='activities',sourceUrl=calendarFeedSources[source];
 const unavailable=error=>({status:'unavailable',retrievedAt:null,sourceUrl,events:[],error});
 if(!Number.isFinite(now.getTime()))return unavailable('Invalid calendar reference time');
 const end=new Date(now.getTime()+WINDOW_MS),today=localDate.format(now),lastDay=localDate.format(end);
 const lastMonth=lastDay.slice(0,7),events=new Map();
 let retrievedAt=null;
 for(let month=today.slice(0,7);month<=lastMonth;month=shiftMonth(month,1)){
  let result;
  try{result=await readCalendar({source,month,now});}
  catch{return unavailable('Calendar unavailable');}
  if(result.status!=='ok')return unavailable(result.error||'Calendar unavailable');
  // Read the months in order so the normal canonical cache can reuse its raw Activities feed.
  if(result.retrievedAt&&(!retrievedAt||result.retrievedAt<retrievedAt))retrievedAt=result.retrievedAt;
  for(const event of result.events){
   const scope=allPublic?'School calendar':publicEventScope(event.title);
   if(!scope||(scope==='Grades 6–8'&&!grades.some(grade=>[6,7,8].includes(grade))))continue;
   if(event.allDay?(event.end<=today||event.start>lastDay):(Date.parse(event.end)<=now.getTime()||Date.parse(event.start)>end.getTime()))continue;
   if(events.has(event.id))continue;
   // Existing publicEventHref adds the Activities source prefix when opening the detail.
   const id=event.id.slice('activities:'.length);
   const {title,start,end:finish,allDay}=event;
   events.set(event.id,{id,title,start,end:finish,allDay,scope,sourceUrl:event.sourceUrl,dateText:formatEventDate(event)});
  }
 }
 return {status:'ok',retrievedAt,sourceUrl,events:[...events.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.title.localeCompare(b.title))};
}
