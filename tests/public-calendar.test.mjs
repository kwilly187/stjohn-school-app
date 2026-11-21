import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarFeedSources,getCalendarFeed} from '../app/calendar/calendar-feed.mjs';
import {publicEventHref} from '../app/calendar/calendar-state.mjs';
import {formatEventDate,publicEventScope} from '../app/public-calendar.mjs';
import {getSchoolPublicDates} from '../app/school-public-dates.mjs';

const allGrades='Early Release- All grades';
const middleGrades='Florida-Georgia District Youth Gathering for Grades 6-8';
const noSchool='Thanksgiving Break | No School';
const event=(lines)=>`BEGIN:VEVENT\n${lines.join('\n')}\nEND:VEVENT`;
const calendar=(events)=>`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Synthetic test//EN\n${events.join('\n')}\nEND:VCALENDAR\n`;
const allDay=(id,title,start,end,extra=[])=>event(['UID:'+id,'DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end,'SUMMARY:'+title,...extra]);
const options={grades:[6],now:new Date('2026-11-01T12:00:00Z')};
const fetchCalendar=fetchImpl=>args=>getCalendarFeed({...args,fetchImpl});
const readText=(text,overrides)=>getSchoolPublicDates({...options,...overrides,readCalendar:fetchCalendar(async()=>new Response(text))});

test('canonical Activities feed preserves the explicit verified student audience policy',async()=>{
  for(const title of ['Steam Fair','Dress Down Day','No Aftercare'])assert.equal(publicEventScope(title),null);
  const text=calendar([
    allDay('school',allGrades,'20261102','20261103'),
    allDay('grades',middleGrades,'20261107','20261108'),
    allDay('unscoped','Steam Fair','20261109','20261110'),
  ]);
  for(const grades of [[6],[7],[8]]){
    const result=await readText(text,{grades});
    assert.equal(result.status,'ok');assert.deepEqual(result.events.map(e=>e.scope),['Schoolwide','Grades 6–8']);
  }
  for(const grades of [[],[9],[5]])assert.deepEqual((await readText(text,{grades})).events.map(e=>e.scope),['Schoolwide']);
});

test('shared parser suppresses nonpublic, cancelled and superseded relevant events',async()=>{
  const text=calendar([
    allDay('private',allGrades,'20261103','20261104',['CLASS:PRIVATE']),
    allDay('confidential',noSchool,'20261104','20261105',['CLASS:CONFIDENTIAL']),
    allDay('revised',allGrades,'20261105','20261106',['SEQUENCE:1']),
    allDay('revised',allGrades,'20261106','20261107',['SEQUENCE:2']),
    allDay('cancelled',allGrades,'20261107','20261108',['STATUS:CANCELLED']),
  ]);
  assert.deepEqual((await readText(text)).events.map(e=>e.start),['2026-11-06']);
});

test('dates retain the 45-day window, omit finished events, and deduplicate one multi-month event',async()=>{
  const now=new Date('2026-10-31T15:00:00Z');
  const text=calendar([
    allDay('ended',allGrades,'20261029','20261031'),
    allDay('cross',noSchool,'20261030','20261102'),
    allDay('limit',allGrades,'20261215','20261216'),
    allDay('outside',allGrades,'20261216','20261217'),
    event(['UID:finished','DTSTART:20261031T130000Z','DTEND:20261031T140000Z','SUMMARY:'+allGrades]),
    event(['UID:after-limit','DTSTART:20261215T150001Z','DTEND:20261215T160000Z','SUMMARY:'+allGrades]),
    event(['UID:near-limit','DTSTART:20261215T150000Z','DTEND:20261215T160000Z','SUMMARY:'+allGrades]),
  ]);
  const result=await readText(text,{now});
  assert.equal(result.status,'ok');
  assert.deepEqual(result.events.map(e=>e.start),['2026-10-30','2026-12-15','2026-12-15T15:00:00.000Z']);
});

test('all-day ranges keep exclusive end dates and timed events use Eastern time',async()=>{
  const text=calendar([
    allDay('break',noSchool,'20261123','20261128'),
    event(['UID:timed','DTSTART:20261112T210000Z','DTEND:20261112T230000Z','SUMMARY:'+allGrades]),
  ]);
  const [timed,all]= (await readText(text)).events;
  assert.match(timed.dateText,/Nov 12, 4:00 PM EST – Nov 12, 6:00 PM EST/);
  assert.equal(all.start,'2026-11-23');assert.equal(all.end,'2026-11-28');
  assert.equal(all.dateText,'Nov 23, 2026 – Nov 27, 2026 · All day');
  assert.equal(formatEventDate({allDay:true,start:'2026-11-01',end:'2026-11-02'}),'Nov 1, 2026 · All day');
});

test('source app detail retains the canonical event ID and student return context',async()=>{
  const raw=calendar([allDay('synthetic',allGrades,'20261102','20261103')]);
  const readCalendar=fetchCalendar(async()=>new Response(raw));
  const [details,dateList]=await Promise.all([readCalendar({source:'activities',month:'2026-11',now:options.now}),getSchoolPublicDates({...options,readCalendar})]);
  const url=new URL(publicEventHref(dateList.events[0],{from:'students',returnStudent:'student-1'}),'https://example.test');
  assert.equal(url.searchParams.get('event'),details.events[0].id);
  assert.equal(url.searchParams.get('month'),'2026-11');
  assert.equal(url.searchParams.get('returnStudent'),'student-1');
});

test('moved exceptions, cancellations, EXDATE, and RDATE keep the canonical occurrence behavior',async()=>{
  const text=calendar([
    allDay('recurring',allGrades,'20261102','20261103',['RRULE:FREQ=DAILY;COUNT=5','EXDATE;VALUE=DATE:20261103','RDATE;VALUE=DATE:20261112']),
    allDay('recurring',allGrades,'20261108','20261109',['RECURRENCE-ID;VALUE=DATE:20261104']),
    allDay('recurring',allGrades,'20261105','20261106',['RECURRENCE-ID;VALUE=DATE:20261105','STATUS:CANCELLED']),
    allDay('moved',allGrades,'20260101','20260102',['RRULE:FREQ=DAILY;COUNT=2']),
    allDay('moved',allGrades,'20261110','20261111',['RECURRENCE-ID;VALUE=DATE:20260102']),
  ]);
  const result=await readText(text);
  assert.equal(result.status,'ok');
  assert.deepEqual(result.events.map(e=>e.start),['2026-11-02','2026-11-06','2026-11-08','2026-11-10','2026-11-12']);
  assert.equal(new Set(result.events.map(e=>e.id)).size,5);
});

test('Activities is the sole upstream and successful emptiness carries retrieval provenance',async()=>{
  const requests=[];
  const result=await getSchoolPublicDates({...options,readCalendar:fetchCalendar(async(url,request)=>{requests.push({url,request});return new Response(calendar([]));})});
  assert.equal(result.status,'ok');
  assert.deepEqual(result.events,[]);
  assert.equal(result.sourceUrl,calendarFeedSources.activities);
  assert.ok(Number.isFinite(Date.parse(result.retrievedAt)));
  assert.ok(requests.length>0);
  assert.ok(requests.every(({url,request})=>url===calendarFeedSources.activities&&request.cache==='no-store'&&request.redirect==='error'&&request.signal));
});

test('unavailable, partial coverage, and invalid date are never reported as an empty success',async()=>{
  for(const fetchImpl of [async()=>new Response('denied',{status:503}),async()=>{throw new Error('timeout');},async()=>new Response('invalid'),async()=>new Response('x',{headers:{'content-length':'2000001'}})]) {
    const result=await getSchoolPublicDates({...options,readCalendar:fetchCalendar(fetchImpl)});
    assert.equal(result.status,'unavailable');assert.equal(result.retrievedAt,null);assert.ok(result.error);assert.deepEqual(result.events,[]);
  }
  const goodMonth=fetchCalendar(async()=>new Response(calendar([allDay('school',allGrades,'20261102','20261103')])));
  const partial=await getSchoolPublicDates({...options,readCalendar:args=>args.month==='2026-11'?goodMonth(args):Promise.reject(new Error('unavailable'))});
  assert.equal(partial.status,'unavailable');assert.deepEqual(partial.events,[]);
  assert.equal((await getSchoolPublicDates({now:new Date('invalid')})).status,'unavailable');
});

test('optional unfiltered view marks events as public school calendar, never student participation',async()=>{
  const text=calendar([allDay('unscoped','Shadow Day','20261117','20261118'),allDay('school',noSchool,'20261123','20261128')]);
  const result=await readText(text,{allPublic:true});
  assert.deepEqual(result.events.map(e=>e.scope),['School calendar','School calendar']);
});
