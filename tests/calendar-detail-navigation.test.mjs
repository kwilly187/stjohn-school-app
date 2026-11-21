import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calendarHref} from '../app/calendar/calendar-state.mjs';
const source=()=>readFile(new URL('../app/calendar/view.tsx',import.meta.url),'utf8');
test('calendar details reuse loaded events with native history and live query state',async()=>{
 const s=await source();
 assert.match(s,/useSearchParams/);
 assert.match(s,/selectedEventId=searchParams.get\('event'\)/);
 assert.match(s,/window.history.pushState\(null,'',calendarHref\(state,\{event:event.id\}\)\)/);
 assert.match(s,/window.history.replaceState\(null,'',calendarHref\(state,\{event:null\}\)\)/);
 assert.doesNotMatch(s,/move\(\{event:event.id\}\)/);
 assert.match(s,/if\(pending\)return/);
 assert.match(s,/restoreEventFocus.current=true/);
 assert.match(s,/router.push\(returnHref\)/);
});
test('event links remain safely encoded and shareable without losing selected calendar',()=>{
 const state={source:'athletics',view:'MONTH',month:'2026-11',from:null,returnStudent:null};
 const href=calendarHref(state,{event:'athletics:abc@google.com/2026-11-14'});
 const url=new URL(href,'https://school.example');
 assert.equal(url.pathname,'/calendar');
 assert.equal(url.searchParams.get('source'),'athletics');
 assert.equal(url.searchParams.get('event'),'athletics:abc@google.com/2026-11-14');
 assert.equal(new URL(calendarHref(state,{event:null}),'https://school.example').searchParams.has('event'),false);
});
