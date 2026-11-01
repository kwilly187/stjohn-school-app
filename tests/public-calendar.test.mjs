import test from 'node:test';
import assert from 'node:assert/strict';
import {parsePublicCalendar,formatEventDate,publicEventScope,getPublicCalendar,PUBLIC_CALENDAR_URL} from '../app/public-calendar.mjs';
const title='Early Release- All grades';
const event=(lines)=>`BEGIN:VEVENT\n${lines.join('\n')}\nEND:VEVENT`;
const calendar=(events)=>`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Synthetic test//EN\n${events.join('\n')}\nEND:VCALENDAR\n`;
const base=(extra=[])=>event(['UID:synthetic','DTSTART;VALUE=DATE:20261102','DTEND;VALUE=DATE:20261103',`SUMMARY:${title}`,...extra]);
const opts={grades:[6],now:new Date('2026-11-01T12:00:00Z')};
test('only explicit verified public audiences enter relevant dates',()=>{
  assert.equal(publicEventScope('Steam Fair'),null);assert.equal(publicEventScope('Dress Down Day'),null);assert.equal(publicEventScope('No Aftercare'),null);
  const text=calendar([base(),event(['UID:grade','DTSTART;VALUE=DATE:20261107','DTEND;VALUE=DATE:20261108','SUMMARY:Florida-Georgia District Youth Gathering for Grades 6-8'])]);
  assert.equal(parsePublicCalendar(text,opts).length,2);
  for(const grades of [[],[9],[5]])assert.equal(parsePublicCalendar(text,{...opts,grades}).length,1);
});
test('all-day exclusive DTEND presents the final included day without a timezone shift',()=>{
  const text=calendar([event(['UID:break','DTSTART;VALUE=DATE:20261123','DTEND;VALUE=DATE:20261128','SUMMARY:Thanksgiving Break | No School'])]);
  const [value]=parsePublicCalendar(text,opts);
  assert.equal(value.start,'2026-11-23');assert.equal(value.end,'2026-11-28');assert.equal(value.dateText,'Nov 23, 2026 – Nov 27, 2026 · All day');
  assert.equal(formatEventDate({allDay:true,start:'2026-11-01',end:'2026-11-02'}),'Nov 1, 2026 · All day');
});
test('UTC timed events display school Eastern time after DST transition',()=>{
  const text=calendar([event(['UID:timed','DTSTART:20261112T210000Z','DTEND:20261112T230000Z',`SUMMARY:${title}`])]);
  assert.match(parsePublicCalendar(text,opts)[0].dateText,/Nov 12, 4:00 PM EST – Nov 12, 6:00 PM EST/);
});
test('recurrences honor EXDATE, moved override, cancellation and unique IDs',()=>{
  const text=calendar([base(['RRULE:FREQ=DAILY;COUNT=5','EXDATE;VALUE=DATE:20261103']),
    event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261104','DTSTART;VALUE=DATE:20261108','DTEND;VALUE=DATE:20261109',`SUMMARY:${title}`]),
    event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261105','DTSTART;VALUE=DATE:20261105','DTEND;VALUE=DATE:20261106','STATUS:CANCELLED',`SUMMARY:${title}`])]);
  const values=parsePublicCalendar(text,opts);
  assert.deepEqual(values.map(e=>e.start),['2026-11-02','2026-11-06','2026-11-08']);
  assert.equal(new Set(values.map(e=>e.id)).size,3);
});
test('moved occurrence from outside the window is retained at its new in-window time',()=>{
  const text=calendar([event(['UID:move','DTSTART;VALUE=DATE:20260101','DTEND;VALUE=DATE:20260102','RRULE:FREQ=DAILY;COUNT=2',`SUMMARY:${title}`]),event(['UID:move','RECURRENCE-ID;VALUE=DATE:20260102','DTSTART;VALUE=DATE:20261110','DTEND;VALUE=DATE:20261111',`SUMMARY:${title}`])]);
  assert.deepEqual(parsePublicCalendar(text,opts).map(e=>e.start),['2026-11-10']);
});
test('past events, cancelled events and dates beyond 45-day window are excluded',()=>{
  const text=calendar([base(['STATUS:CANCELLED']),event(['UID:past','DTSTART;VALUE=DATE:20261030','DTEND;VALUE=DATE:20261031',`SUMMARY:${title}`]),event(['UID:far','DTSTART;VALUE=DATE:20261220','DTEND;VALUE=DATE:20261221',`SUMMARY:${title}`])]);
  assert.deepEqual(parsePublicCalendar(text,opts),[]);
});
test('unbounded high-frequency recurrences and invalid/oversized sources fail explicitly',()=>{
  assert.throws(()=>parsePublicCalendar(calendar([base(['RRULE:FREQ=SECONDLY'])]),opts),/frequency/);
  assert.throws(()=>parsePublicCalendar('<html>Error</html>',opts),/Invalid/);
  assert.throws(()=>parsePublicCalendar('x'.repeat(2_000_001),opts),/size/);
});
test('fetch errors return unavailable rather than successful empty results',async()=>{
  for(const fetchImpl of [async()=>new Response('denied',{status:503}),async()=>{throw new Error('timeout');},async()=>new Response('invalid'),async()=>new Response('x',{headers:{'content-length':'2000001'}})]) {
    const result=await getPublicCalendar({...opts,fetchImpl});assert.equal(result.status,'unavailable');assert.equal(result.retrievedAt,null);assert.ok(result.error);assert.deepEqual(result.events,[]);
  }
});
test('successful public fetch exposes retrieval provenance and a true empty window separately',async()=>{
  let request;
  const result=await getPublicCalendar({...opts,fetchImpl:async(url,options)=>{request={url,options};return new Response(calendar([base()]));}});
  assert.equal(result.status,'ok');assert.equal(result.events.length,1);assert.ok(Number.isFinite(Date.parse(result.retrievedAt)));assert.equal(result.sourceUrl,PUBLIC_CALENDAR_URL);
  assert.equal(request.url,PUBLIC_CALENDAR_URL);assert.equal(request.options.cache,'no-store');assert.ok(request.options.signal);assert.equal(request.options.redirect,'error');
  const empty=await getPublicCalendar({...opts,fetchImpl:async()=>new Response(calendar([]))});assert.equal(empty.status,'ok');assert.deepEqual(empty.events,[]);
});
test('New York recurrence keeps 9am local across the autumn DST change',()=>{
  const tz=`BEGIN:VTIMEZONE\nTZID:America/New_York\nBEGIN:DAYLIGHT\nTZOFFSETFROM:-0500\nTZOFFSETTO:-0400\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:-0400\nTZOFFSETTO:-0500\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD\nEND:VTIMEZONE`;
  const text=calendar([tz,event(['UID:dst','DTSTART;TZID=America/New_York:20261031T090000','DTEND;TZID=America/New_York:20261031T100000','RRULE:FREQ=DAILY;COUNT=3',`SUMMARY:${title}`])]);
  const values=parsePublicCalendar(text,{...opts,now:new Date('2026-10-31T00:00:00Z')});
  assert.deepEqual(values.map(e=>e.start),['2026-10-31T13:00:00.000Z','2026-11-01T14:00:00.000Z','2026-11-02T14:00:00.000Z']);
  assert.match(values[0].dateText,/9:00 AM EDT/);assert.match(values[1].dateText,/9:00 AM EST/);
});
test('only independently verified event identity/title pairs receive event deep links',()=>{
  const text=calendar([event(['UID:2lgqj6h14uk1i2t6t2rbn0hctq@google.com','DTSTART;VALUE=DATE:20261111','DTEND;VALUE=DATE:20261112',`SUMMARY:${title}`]),base()]);
  const values=parsePublicCalendar(text,opts);
  assert.equal(values[0].sourceUrl,'https://stjohnocala.org/calendar/');
  assert.match(values[1].sourceUrl,/^https:\/\/calendar.google.com\/calendar\/u\/0\/event\?eid=/);
});
test('cancelled series does not leak still-listed exception events',()=>{
  const text=calendar([base(['RRULE:FREQ=DAILY;COUNT=2','STATUS:CANCELLED']),event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261103','DTSTART;VALUE=DATE:20261110','DTEND;VALUE=DATE:20261111',`SUMMARY:${title}`])]);
  assert.deepEqual(parsePublicCalendar(text,opts),[]);
});
test('RDATE is included and unknown TZID fails instead of silently shifting time',()=>{
  const text=calendar([base(['RDATE;VALUE=DATE:20261108'])]);
  assert.deepEqual(parsePublicCalendar(text,opts).map(e=>e.start),['2026-11-02','2026-11-08']);
  const bad=calendar([event(['UID:unknown-zone','DTSTART;TZID=Unknown/Zone:20261102T090000','DTEND;TZID=Unknown/Zone:20261102T100000',`SUMMARY:${title}`])]);
  assert.throws(()=>parsePublicCalendar(bad,opts),/time zone/);
});
