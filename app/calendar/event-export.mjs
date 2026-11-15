// RFC 5545 export of a single already-normalized public occurrence.
// UTC instants preserve the school's America/New_York DST conversion; DATE ends stay exclusive.
import {school} from '../school-data.mjs';
const encoder=new TextEncoder();
const escapeText=value=>String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const utc=value=>{const date=new Date(value);if(!Number.isFinite(date.getTime()))throw new Error('Invalid calendar time');return date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');};
const date=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value)throw new Error('Invalid calendar date');return value.replace(/-/g,'');};
export function foldCalendarLine(line){let result='',part='',bytes=0;for(const character of line){const size=encoder.encode(character).length;if(bytes+size>75){result+=part+'\r\n';part=' ';bytes=1;}part+=character;bytes+=size;}return result+part;}
/** @param {{id:string,title:string,start:string,end:string,allDay:boolean,location?:string|null,sourceUrl?:string}} event @param {{now?:Date,source?:string}} options */
export function eventCalendarFile(event,{now=new Date(),source='activities'}={}){
 if(!event.id||!event.title||!['activities','athletics'].includes(source))throw new Error('Invalid calendar event');
 const start=event.allDay?date(event.start):utc(event.start),end=event.allDay?date(event.end):utc(event.end);
 if(end<=start)throw new Error('Invalid calendar range');
 let description='Saved copy of a school-published event. This copy does not update automatically.';
 if(/early release/i.test(event.title))description+=' Dismissal time is not listed; confirm with the school.';
 if(source==='athletics')description+=' Calendar start/end may not include all team times. Check the school calendar for team schedules.';
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Seagull//School Calendar Export//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${encodeURIComponent(event.id)}@school-calendar.seagullmgmt.com`,`DTSTAMP:${utc(now.toISOString())}`,`DTSTART${event.allDay?';VALUE=DATE':''}:${start}`,`DTEND${event.allDay?';VALUE=DATE':''}:${end}`,`SUMMARY:${escapeText(event.title)}`,`DESCRIPTION:${escapeText(description)}`];
 if(event.location)lines.push(`LOCATION:${escapeText(event.location)}`);
 // No descriptions, attendees, reminders, organizer or scheduling METHOD are imported.
 lines.push(`URL:${school.calendar}`,'END:VEVENT','END:VCALENDAR');
 return lines.map(foldCalendarLine).join('\r\n')+'\r\n';
}
export function eventCalendarFilename(title){return 'school-'+String(title).normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70).toLowerCase()+'.ics';}
