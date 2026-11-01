import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {navigateCalendarOnce} from '../app/calendar/navigation-lock.mjs';
import {calendarHref,calendarState} from '../app/calendar/calendar-state.mjs';
test('rapid Month then Next cannot queue a URL from stale Agenda state',()=>{
 const lock={current:false},urls=[];
 const old=calendarState({month:'2026-11',view:'AGENDA'},new Date('2026-11-01T13:00:00Z'));
 assert.equal(navigateCalendarOnce(lock,()=>urls.push(calendarHref(old,{view:'MONTH'}))),true);
 assert.equal(navigateCalendarOnce(lock,()=>urls.push(calendarHref(old,{month:'2026-12'}))),false);
 assert.equal(urls.length,1);assert.match(urls[0],/view=MONTH/);
 const committed={...old,view:'MONTH'};lock.current=false;
 assert.equal(navigateCalendarOnce(lock,()=>urls.push(calendarHref(committed,{month:'2026-12'}))),true);
 const final=new URL(urls[1],'https://example.test');assert.equal(final.searchParams.get('month'),'2026-12');assert.equal(final.searchParams.get('view'),'MONTH');
});
test('failed navigation releases guard and React transition owns completion',async()=>{
 const lock={current:false};assert.throws(()=>navigateCalendarOnce(lock,()=>{throw new Error('failure')}));assert.equal(lock.current,false);
 const view=await readFile(new URL('../app/calendar/view.tsx',import.meta.url),'utf8');
 assert.match(view,/if\(!pending\)navigationLock.current=false/);assert.match(view,/navigateCalendarOnce\(navigationLock/);
 assert.match(view,/disabled=\{pending\|\|state.month>=state.max\}/);assert.match(view,/key=\{view\} disabled=\{pending\}/);assert.match(view,/navigate\(\(\)=>router.refresh\(\)\)/);
});
