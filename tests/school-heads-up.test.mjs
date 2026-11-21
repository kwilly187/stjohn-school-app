import test from 'node:test';
import assert from 'node:assert/strict';
import {headsUpDays,getSchoolHeadsUp} from '../app/school-heads-up-data.mjs';
import {getCalendarFeed,calendarFeedSources} from '../app/calendar/calendar-feed.mjs';

const saturday=new Date('2026-11-21T17:00:00Z');
const monday=new Date('2026-11-23T15:00:00Z');
const weekday=(...values)=>values.map(day=>({day:'2026-11-'+day,label:day==='23'?'Monday':'Tuesday'}));
const calendar=(...events)=>['BEGIN:VCALENDAR','VERSION:2.0',...events.flatMap(event=>['BEGIN:VEVENT',...event,'END:VEVENT']),'END:VCALENDAR',''].join('\r\n');
const event=(uid,title,start='20261123',end='20261128',...extra)=>['UID:'+uid,'SUMMARY:'+title,'DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end,...extra];
const breakEvent=event('break','Thanksgiving Break | No School');
function feed(text,calls=[]){
 return ({month,source,now})=>getCalendarFeed({month,source,now,fetchImpl:async url=>{
  calls.push({source,month,url});return new Response(text);
 }});
}

test('uses school timezone and looks ahead only to the next weekday',()=>{
 assert.deepEqual(headsUpDays(saturday),weekday('23'));
 assert.deepEqual(headsUpDays(new Date('2026-11-23T02:00:00Z')),weekday('23'));
 assert.deepEqual(headsUpDays(monday),[{day:'2026-11-23',label:'today'},...weekday('24')]);
});
test('shows the school-published Thanksgiving break on weekend and through its exclusive end',async()=>{
 const read=feed(calendar(breakEvent));
 assert.deepEqual(await getSchoolHeadsUp(saturday,read),{
  label:'Monday',kind:'No school',reason:'Thanksgiving Break',month:'2026-11',eventId:'activities:break/2026-11-23',
 });
 assert.equal((await getSchoolHeadsUp(monday,read)).label,'today');
 assert.equal((await getSchoolHeadsUp(new Date('2026-11-27T16:00:00Z'),read)).label,'today');
 assert.equal(await getSchoolHeadsUp(new Date('2026-11-28T16:00:00Z'),read),null);
});
test('uses the school activities source, with no repeated month read',async()=>{
 const calls=[];
 assert.equal(await getSchoolHeadsUp(monday,feed(calendar(),calls)),null);
 assert.deepEqual(calls,[{source:'activities',month:'2026-11',url:calendarFeedSources.activities}]);
 const boundaryCalls=[];
 const data=calendar(event('x','No School','20261201','20261202'));
 assert.equal((await getSchoolHeadsUp(new Date('2026-11-30T16:00:00Z'),feed(data,boundaryCalls))).label,'Tuesday');
 assert.deepEqual(boundaryCalls.map(call=>call.month),['2026-11','2026-12']);
});
test('reports all-grades early release without using its event time as dismissal time',async()=>{
 const early=['UID:early','SUMMARY:Early Release- All grades','DTSTART:20261123T220000Z','DTEND:20261123T230000Z'];
 assert.deepEqual(await getSchoolHeadsUp(monday,feed(calendar(early))),{
  label:'today',kind:'Early dismissal',month:'2026-11',eventId:'activities:early/2026-11-23T22:00:00.000Z',
 });
 assert.equal((await getSchoolHeadsUp(monday,feed(calendar(early,breakEvent)))).kind,'No school');
});
test('hides unavailable, private, cancelled, exceptional-but-not-schoolwide, and distant events',async()=>{
 assert.equal(await getSchoolHeadsUp(monday,feed('invalid HTML')),null);
 assert.equal(await getSchoolHeadsUp(monday,feed(calendar(
  event('private','No School','20261123','20261124','CLASS:PRIVATE'),
  event('cancelled','No School','20261123','20261124','STATUS:CANCELLED'),
  event('aftercare','No Aftercare'),
  event('grade','Middle School | No School'),
  event('release','Early Release - 4th Grade'),
  event('distant','No School','20261125','20261126'),
 ))),null);
});
