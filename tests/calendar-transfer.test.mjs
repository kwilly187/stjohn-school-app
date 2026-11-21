import test from 'node:test';import assert from 'node:assert/strict';import ICAL from 'ical.js';
import {calendarSubscription,calendarSnapshot} from '../app/calendar/calendar-transfer.mjs';
import {readFileSync} from 'node:fs';
const events=[{id:'a',title:'Break',start:'2026-11-20',end:'2026-11-21',allDay:true},{id:'b',title:'Practice',start:'2026-11-20T20:00:00Z',end:'2026-11-20T21:00:00Z',allDay:false}];
test('subscription uses only configured public school feed',()=>{
 for(const source of ['activities','athletics']){const links=calendarSubscription(source);assert.ok(links.https.startsWith('https://calendar.google.com/calendar/ical/'));assert.ok(links.https.endsWith('/public/basic.ics'));assert.equal(links.webcal,links.https.replace('https:','webcal:'));}
 assert.throws(()=>calendarSubscription('child-a'));
});
test('bulk export is a valid calendar with all selected public dates and stable IDs',()=>{
 const file=calendarSnapshot([...events,events[0]],{now:new Date('2026-11-14T00:00:00Z')});const calendar=new ICAL.Component(ICAL.parse(file));const rows=calendar.getAllSubcomponents('vevent');assert.equal(rows.length,2);assert.equal(rows[0].getFirstPropertyValue('dtstart').isDate,true);assert.equal(rows[1].getFirstPropertyValue('dtstart').isDate,false);assert.match(rows[0].getFirstPropertyValue('description'),/does not update automatically/);assert.ok(!file.includes('ATTENDEE'));
});
test('bulk export rejects empty or invalid snapshots instead of generating incomplete files',()=>{assert.throws(()=>calendarSnapshot([]));assert.throws(()=>calendarSnapshot([{...events[0],end:'bad'}]));});
test('parent UI distinguishes full subscription from snapshot and child-specific data',()=>{
 const ui=readFileSync(new URL('../app/calendar/calendar-transfer-panel.tsx',import.meta.url),'utf8');for(const label of ['not a child-specific schedule','One-time copy','will not sync','Copy subscription link','readOnly value={subscription.https}'])assert.ok(ui.includes(label));
 const studentDates=readFileSync(new URL('../app/public-dates.tsx',import.meta.url),'utf8');assert.ok(studentDates.includes("origin==='students'&&<CalendarTransfer events={result.events}"));
});
test('calendar UI imports an unambiguous component module',()=>{
 for(const file of ['../app/calendar/view.tsx','../app/public-dates.tsx']) {
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.ok(source.includes('calendar-transfer-panel'));
 }
});
