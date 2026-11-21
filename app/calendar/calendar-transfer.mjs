import {calendarSources} from '../school-data.mjs';
import {eventCalendarFile} from './event-export.mjs';
export function calendarSubscription(source='activities'){
 if(!Object.hasOwn(calendarSources,source))throw new Error('Unknown calendar');
 const https=`https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarSources[source])}/public/basic.ics`;
 return {https,webcal:https.replace(/^https:/,'webcal:')};
}
// One-time snapshot of normalized public events only; never a child-specific public feed.
export function calendarSnapshot(events,{source='activities',now=new Date()}={}){
 if(!Array.isArray(events)||events.length===0||events.length>1000)throw new Error('Invalid event selection');
 const seen=new Set();const blocks=[];
 for(const event of events){
  if(seen.has(event.id))continue;seen.add(event.id);
  const file=eventCalendarFile(event,{source,now});
  blocks.push(file.slice(file.indexOf('BEGIN:VEVENT\r\n'),file.indexOf('END:VEVENT\r\n')+'END:VEVENT\r\n'.length));
 }
 return 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Seagull//School Calendar Export//EN\r\nCALSCALE:GREGORIAN\r\n'+blocks.join('')+'END:VCALENDAR\r\n';
}
