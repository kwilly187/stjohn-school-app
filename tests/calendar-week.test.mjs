import test from 'node:test';
import assert from 'node:assert/strict';
import {calendarWeeks,weekLabel,weekText,weekWindow} from '../app/calendar/calendar-week.mjs';
import {calendarFeedRange,parseCalendarFeed} from '../app/calendar/calendar-feed.mjs';

test('marks the current Eastern week as the selected default at UTC midnight',()=>{
 const now=new Date('2026-11-22T03:00:00Z');
 assert.equal(calendarWeeks('2026-11',now).find(week=>week.current).start,'2026-11-15');
 assert.equal(calendarWeeks('2026-11',new Date('2026-11-22T05:00:00Z')).find(week=>week.current).start,'2026-11-22');
});

test('lists whole weeks overlapping the visible calendar month',()=>{
 const weeks=calendarWeeks('2026-12',new Date('2026-11-22T03:00:00Z'));
 assert.deepEqual(weeks.map(week=>week.start),['2026-11-29','2026-12-06','2026-12-13','2026-12-20','2026-12-27']);
 assert.equal(weekLabel('2026-12-27'),'Dec 27, 2026 to Jan 2, 2027');
 assert.equal(weeks.some(week=>week.current),false);
});

test('rejects invalid dates, non-Sundays, and weeks unrelated to the selected month',()=>{
 for(const start of ['2026-02-30','2026-11-30','2026-13-01','x'])assert.throws(()=>weekWindow(start),/Invalid calendar week/);
 assert.throws(()=>calendarFeedRange({month:'2026-11',weekStart:'2026-12-06'}),/Week outside selected month/);
 assert.deepEqual(calendarFeedRange({month:'2026-11',weekStart:'2026-11-29'}),{start:'2026-11-29',end:'2026-12-06'});
});

test('week feed spans crossed months, excludes cancellations/PRIVATE entries, and leaves normal month behavior intact',()=>{
 const event=(id,start,end,extra=[])=>['BEGIN:VEVENT',`UID:${id}`,`DTSTART;VALUE=DATE:${start}`,`DTEND;VALUE=DATE:${end}`,`SUMMARY:${id}`,...extra,'END:VEVENT'].join('\n');
 const raw=['BEGIN:VCALENDAR','VERSION:2.0',event('Earlier','20261128','20261129'),event('November','20261130','20261201'),event('December','20261205','20261206'),event('Next week','20261206','20261207'),event('Private','20261201','20261202',['CLASS:PRIVATE']),event('Cancelled','20261203','20261204',['STATUS:CANCELLED']),'END:VCALENDAR'].join('\n');
 const list=(args)=>parseCalendarFeed(raw,args).map(event=>event.title);
 assert.deepEqual(list({month:'2026-11',source:'athletics',weekStart:'2026-11-29'}),['November','December']);
 assert.deepEqual(list({month:'2026-11',source:'athletics'}),['Earlier','November']);
});

test('text uses only selected public details and flattens embedded newlines',()=>{
 const text=weekText({start:'2026-11-29',source:'athletics',events:[{title:'Basketball\nAway',dateText:'Dec 1, 2026 · 4:00 PM EST',location:'School gym',privateStudent:'not output'}]});
 assert.equal(text,'St. John | Nov 29 to Dec 5, 2026 (Athletics, Eastern time)\n\nDec 1, 2026 · 4:00 PM EST: Basketball Away | School gym');
});
