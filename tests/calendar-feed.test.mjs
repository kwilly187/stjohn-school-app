import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCalendarFeed,getCalendarFeed,calendarFeedRange,calendarFeedSources} from '../app/calendar/calendar-feed.mjs';
const event=lines=>`BEGIN:VEVENT\n${lines.join('\n')}\nEND:VEVENT`;
const cal=events=>`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Synthetic tests//EN\n${events.join('\n')}\nEND:VCALENDAR\n`;
const base=(extra=[])=>event(['UID:synthetic','DTSTART;VALUE=DATE:20261102','DTEND;VALUE=DATE:20261103','SUMMARY:Public test event',...extra]);
const opts={source:'activities',month:'2026-11',now:new Date('2026-11-01T12:00:00Z')};
const tz=`BEGIN:VTIMEZONE\nTZID:America/New_York\nBEGIN:DAYLIGHT\nTZOFFSETFROM:-0500\nTZOFFSETTO:-0400\nDTSTART:19700308T020000\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU\nEND:DAYLIGHT\nBEGIN:STANDARD\nTZOFFSETFROM:-0400\nTZOFFSETTO:-0500\nDTSTART:19701101T020000\nRRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU\nEND:STANDARD\nEND:VTIMEZONE`;
test('month overlap and all-day exclusive end are preserved with clipped day keys',()=>{
 const text=cal([event(['UID:overlap','DTSTART;VALUE=DATE:20261030','DTEND;VALUE=DATE:20261103','SUMMARY:Public multi-day event'])]);
 const [e]=parseCalendarFeed(text,opts);assert.equal(e.startDay,'2026-10-30');assert.equal(e.endDay,'2026-11-02');assert.deepEqual(e.dayKeys,['2026-11-01','2026-11-02']);assert.match(e.dateText,/Nov 2, 2026/);
});
test('timed midnight endings exclude following school day and UTC renders Eastern',()=>{
 const text=cal([event(['UID:timed','DTSTART:20261112T210000Z','DTEND:20261113T050000Z','SUMMARY:Evening event','LOCATION:Published gym'])]);
 const [e]=parseCalendarFeed(text,opts);assert.deepEqual(e.dayKeys,['2026-11-12']);assert.equal(e.location,'Published gym');assert.match(e.dateText,/4:00 PM EST/);
});
test('school-time recurrence keeps local hour through DST',()=>{
 const text=cal([tz,event(['UID:dst','DTSTART;TZID=America/New_York:20261031T090000','DTEND;TZID=America/New_York:20261031T100000','RRULE:FREQ=DAILY;COUNT=3','SUMMARY:Test recurring event'])]);
 const values=parseCalendarFeed(text,{...opts,month:'2026-10',view:'AGENDA',now:new Date('2026-10-31T12:00:00Z')});
 assert.deepEqual(values.map(e=>e.start),['2026-10-31T13:00:00.000Z','2026-11-01T14:00:00.000Z','2026-11-02T14:00:00.000Z']);
});
test('EXDATE, moved override and cancelled override do not duplicate original occurrences',()=>{
 const text=cal([base(['RRULE:FREQ=DAILY;COUNT=5','EXDATE;VALUE=DATE:20261103']),event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261104','DTSTART;VALUE=DATE:20261108','DTEND;VALUE=DATE:20261109','SUMMARY:Moved public event']),event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261105','DTSTART;VALUE=DATE:20261105','DTEND;VALUE=DATE:20261106','STATUS:CANCELLED','SUMMARY:Cancelled'])]);
 assert.deepEqual(parseCalendarFeed(text,opts).map(e=>e.start),['2026-11-02','2026-11-06','2026-11-08']);
});
test('RDATE includes DTSTART and moved-in exception is visible',()=>{
 assert.deepEqual(parseCalendarFeed(cal([base(['RDATE;VALUE=DATE:20261108'])]),opts).map(e=>e.start),['2026-11-02','2026-11-08']);
 const text=cal([event(['UID:move','DTSTART;VALUE=DATE:20260101','DTEND;VALUE=DATE:20260102','RRULE:FREQ=DAILY;COUNT=2','SUMMARY:Original']),event(['UID:move','RECURRENCE-ID;VALUE=DATE:20260102','DTSTART;VALUE=DATE:20261110','DTEND;VALUE=DATE:20261111','SUMMARY:Moved in'])]);
 assert.deepEqual(parseCalendarFeed(text,opts).map(e=>e.title),['Moved in']);
});
test('cancelled master suppresses exception and explicitly private items never render',()=>{
 const text=cal([base(['STATUS:CANCELLED','RRULE:FREQ=DAILY;COUNT=2']),event(['UID:synthetic','RECURRENCE-ID;VALUE=DATE:20261103','DTSTART;VALUE=DATE:20261110','DTEND;VALUE=DATE:20261111','SUMMARY:Override'])]);
 assert.deepEqual(parseCalendarFeed(text,opts),[]);
 for(const kind of ['PRIVATE','CONFIDENTIAL'])assert.deepEqual(parseCalendarFeed(cal([base([`CLASS:${kind}`])]),opts),[]);
});
test('source-isolated IDs, duplicates/revisions and minimal fields',()=>{
 const text=cal([base(['SEQUENCE:2','LOCATION:Main gym','DESCRIPTION:Not returned','ATTENDEE:mailto:fake@example.invalid']),base(['SEQUENCE:1'])]);
 const [a]=parseCalendarFeed(text,opts),[b]=parseCalendarFeed(text,{...opts,source:'athletics'});
 assert.notEqual(a.id,b.id);assert.equal(a.location,'Main gym');assert.equal(parseCalendarFeed(text,opts).length,1);
 assert.deepEqual(Object.keys(a).sort(),['allDay','dateText','dayKeys','end','endDay','id','location','start','startDay','title','startText','sourceUrl'].sort());
});
test('Agenda begins school-local today in current month and covers 45 calendar days',()=>{
 assert.deepEqual(calendarFeedRange({...opts,month:'2026-10',view:'AGENDA',now:new Date('2026-11-01T01:00:00Z')}),{start:'2026-10-31',end:'2026-12-15'});
 assert.deepEqual(calendarFeedRange({...opts,month:'2026-12',view:'AGENDA'}),{start:'2026-12-01',end:'2027-01-15'});
 assert.deepEqual(calendarFeedRange(opts),{start:'2026-11-01',end:'2026-12-01'});
});
test('unknown source/month/view, malformed source, byte and recurrence bounds fail explicitly',()=>{
 for(const patch of [{source:'https://example.com'},{source:'__proto__'},{month:'2026-13'},{month:'2026-1'},{view:'bad'}])assert.throws(()=>parseCalendarFeed(cal([]),{...opts,...patch}));
 assert.throws(()=>parseCalendarFeed('x'.repeat(2_000_001),opts),/size/);
 assert.throws(()=>parseCalendarFeed('no calendar',opts),/Invalid/);
 assert.throws(()=>parseCalendarFeed(cal([base(['RRULE:FREQ=SECONDLY'])]),opts),/frequency/);
});
test('unknown timezone fails; no successful partial calendar is returned',()=>{
 const text=cal([base(),event(['UID:bad-zone','DTSTART;TZID=Unknown/Zone:20261102T090000','DTEND;TZID=Unknown/Zone:20261102T100000','SUMMARY:Bad timezone'])]);
 assert.throws(()=>parseCalendarFeed(text,opts),/timezone/);
});
test('fetch failures/timeouts/oversize are unavailable, not a successful empty source',async()=>{
 for(const fetchImpl of [async()=>{throw new DOMException('Timeout','TimeoutError');},async()=>new Response('',{status:503}),async()=>new Response('bad'),async()=>new Response('x',{headers:{'content-length':'2000001'}})]){
  const r=await getCalendarFeed({...opts,fetchImpl});assert.equal(r.status,'unavailable');assert.equal(r.retrievedAt,null);assert.deepEqual(r.events,[]);assert.ok(r.error);
 }
});
test('each requested source uses its fixed URL with timeout/no redirects and provenance',async()=>{
 for(const source of ['activities','athletics']){let request;const r=await getCalendarFeed({...opts,source,fetchImpl:async(url,options)=>{request={url,options};return new Response(cal([base()]));}});assert.equal(r.status,'ok');assert.equal(request.url,calendarFeedSources[source]);assert.equal(request.options.redirect,'error');assert.equal(request.options.cache,'no-store');assert.ok(request.options.signal);assert.equal(r.events.length,1);assert.ok(Date.parse(r.retrievedAt));assert.equal(r.rangeStart,'2026-11-01');}
});
test('out-of-range month never fetches and legitimate empty month is distinguished',async()=>{
 let fetched=false;const r=await getCalendarFeed({...opts,month:'2028-11',fetchImpl:async()=>{fetched=true;return new Response(cal([]));}});assert.equal(r.status,'unavailable');assert.equal(fetched,false);
 const empty=await getCalendarFeed({...opts,fetchImpl:async()=>new Response(cal([]))});assert.equal(empty.status,'ok');assert.deepEqual(empty.events,[]);
});
test('multiday event crossing next month appears in both month views, never on exclusive last day',()=>{
 const text=cal([event(['UID:across','DTSTART;VALUE=DATE:20261129','DTEND;VALUE=DATE:20261203','SUMMARY:Across month boundary'])]);
 const [nov]=parseCalendarFeed(text,opts),[dec]=parseCalendarFeed(text,{...opts,month:'2026-12'});
 assert.equal(nov.endDay,'2026-12-02');assert.equal(dec.endDay,'2026-12-02');assert.deepEqual(nov.dayKeys,['2026-11-29','2026-11-30']);assert.deepEqual(dec.dayKeys,['2026-12-01','2026-12-02']);assert.equal(nov.id,dec.id);
});
test('source failure does not silently reuse another source or a prior successful response',async()=>{
 const good=await getCalendarFeed({...opts,source:'activities',fetchImpl:async()=>new Response(cal([base()]))});
 const bad=await getCalendarFeed({...opts,source:'athletics',fetchImpl:async()=>new Response('error',{status:503})});
 assert.equal(good.status,'ok');assert.equal(bad.status,'unavailable');assert.deepEqual(bad.events,[]);assert.equal(bad.sourceUrl,calendarFeedSources.athletics);
});
test('athletics card startText does not imply the structured end is every team end time',()=>{
 const text=cal([event(['UID:synthetic-start','DTSTART:20261110T210000Z','DTEND:20261110T213000Z','SUMMARY:MS Basketball at DCA'])]);
 const [e]=parseCalendarFeed(text,{...opts,source:'athletics'});assert.match(e.startText,/4:00 PM EST/);assert.doesNotMatch(e.startText,/4:30/);assert.match(e.dateText,/4:30 PM EST/);assert.equal(e.sourceUrl,'https://stjohnocala.org/calendar/');
});

test('date-only early release never implies an all-day closure',()=>{
 const [e]=parseCalendarFeed(cal([event(['UID:early','DTSTART;VALUE=DATE:20261111','DTEND;VALUE=DATE:20261112','SUMMARY:Early Release- All grades'])]),opts);
 assert.match(e.dateText,/Nov 11/);assert.doesNotMatch(e.dateText,/All day/);assert.equal(e.allDay,true);
});
