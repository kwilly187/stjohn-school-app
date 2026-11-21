import {school} from '../school-data.mjs';

const civilDate=value=>new Date(`${value}T00:00:00Z`);
const iso=value=>value.toISOString().slice(0,10);
function addDays(day,count){const d=civilDate(day);d.setUTCDate(d.getUTCDate()+count);return iso(d);}
const schoolDayFormat=new Intl.DateTimeFormat('en-CA',{timeZone:school.timeZone,year:'numeric',month:'2-digit',day:'2-digit'});
const shortDayFormat=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'short',day:'numeric'});

export function weekWindow(start){
 if(typeof start!=='string'||!/^20\d{2}-\d{2}-\d{2}$/.test(start))throw new Error('Invalid calendar week');
 const date=civilDate(start);
 if(!Number.isFinite(date.getTime())||iso(date)!==start||date.getUTCDay()!==0)throw new Error('Invalid calendar week');
 return {start,end:addDays(start,7)};
}

export function weekLabel(start,includeYear=false){
 const end=addDays(weekWindow(start).end,-1);
 const startYear=start.slice(0,4),endYear=end.slice(0,4),crossesYear=startYear!==endYear;
 return `${shortDayFormat.format(civilDate(start))}${crossesYear?`, ${startYear}`:''} to ${shortDayFormat.format(civilDate(end))}${includeYear||crossesYear?`, ${endYear}`:''}`;
}

export function calendarWeeks(month,now=new Date()){
 const first=`${month}-01`,firstDate=civilDate(first),firstWeek=addDays(first,-firstDate.getUTCDay());
 const today=schoolDayFormat.format(now),weeks=[];
 for(let start=firstWeek;start.slice(0,7)<=month;start=addDays(start,7)){
  const {end}=weekWindow(start);
  weeks.push({start,label:weekLabel(start),current:start<=today&&today<end});
 }
 return weeks;
}

const line=value=>String(value??'').replace(/[\r\n\u2028\u2029\u0000-\u001f\u007f]+/g,' ').trim();
/** @param {{start:string,source:string,events:{title:string,dateText:string,location?:string|null}[]}} options */
export function weekText({start,source,events}){
 const calendar=source==='athletics'?'Athletics':'School & activities';
 return ['Would love for you to join.',`St. John | ${weekLabel(start,true)} (${calendar}, Eastern time)`,...events.map(event=>`${line(event.dateText)}: ${line(event.title)}${event.location?` | ${line(event.location)}`:''}`)].join('\n\n');
}
