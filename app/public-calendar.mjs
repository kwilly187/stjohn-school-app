// Public calendar display and verified audience policy. The provider reader lives in calendar/calendar-feed.mjs.
import {school} from './school-data.mjs';

export const SCHOOL_TIME_ZONE = school.timeZone;

// Only explicit audiences verified against the school's public calendar.
// General public events remain in the full calendar, not a personalized feed.
export function publicEventScope(title) {
  if (['Early Release- All grades','Thanksgiving Break | No School'].includes(title.trim())) return 'Schoolwide';
  if (title.trim() === 'Florida-Georgia District Youth Gathering for Grades 6-8') return 'Grades 6–8';
  return null;
}
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
