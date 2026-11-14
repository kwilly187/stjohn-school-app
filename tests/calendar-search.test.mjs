import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterCalendarEvents} from '../app/calendar/event-search.mjs';
const events=[{id:'1',title:'Parent Night',location:'School Library'},{id:'2',title:'Soccer',location:'North Field'},{id:'3',title:'Café Morning',location:null}];
test('calendar search matches titles or locations and requires all words',()=>{
 assert.deepEqual(filterCalendarEvents(events,'PARENT library').map(e=>e.id),['1']);
 assert.deepEqual(filterCalendarEvents(events,'field').map(e=>e.id),['2']);
 assert.deepEqual(filterCalendarEvents(events,'parent field'),[]);
});
test('calendar search handles accents, blank searches and literal punctuation',()=>{
 assert.deepEqual(filterCalendarEvents(events,'cafe').map(e=>e.id),['3']);
 assert.equal(filterCalendarEvents(events,'   '),events);
 assert.deepEqual(filterCalendarEvents(events,'[.*'),[]);
});
test('calendar filtering preserves order and does not mutate school events',()=>{
 const before=JSON.stringify(events);assert.deepEqual(filterCalendarEvents(events,'o').map(e=>e.id),['1','2','3']);assert.equal(JSON.stringify(events),before);
});
test('calendar search controls both views and resets when date or source changes',()=>{
 const view=readFileSync(new URL('../app/calendar/view.tsx',import.meta.url),'utf8');
 assert.match(view,/visibleEvents\.map/);assert.match(view,/visibleEvents\.filter/);
 assert.match(view,/setSearch\(''\),\[state.month,state.source\]/);
 assert.match(view,/aria-controls="calendar-results"/);assert.match(view,/No matching events/);
});
