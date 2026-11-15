import test from 'node:test';
import assert from 'node:assert/strict';
import {schoolMonth,shiftMonth,calendarState,calendarHref,monthCells} from '../app/calendar/calendar-state.mjs';
const now=new Date('2026-11-01T01:00:00Z');
test('calendar default month uses school timezone across UTC midnight',()=>assert.equal(schoolMonth(now),'2026-10'));
test('source/view/month/detail are deep-linkable and calendar changes can clear details',()=>{const s=calendarState({source:'athletics',view:'MONTH',month:'2026-11',event:'athletics/a&b'},now);assert.equal(calendarHref(s),'/calendar?source=athletics&view=MONTH&month=2026-11&event=athletics%2Fa%26b');assert.equal(calendarHref(s,{source:'activities',event:null}),'/calendar?source=activities&view=MONTH&month=2026-11')});
test('invalid or out-of-range calendar navigation is bounded and explicitly warned',()=>{for(const month of ['2026-13','1900-01','2028-01',['2026-11']]){const s=calendarState({month},now);assert.equal(s.month,'2026-10');assert.equal(s.warning,true)}assert.equal(calendarState({source:'private',view:'other'},now).warning,true)});
test('calendar month grid includes every actual day including past days and leap day',()=>{assert.equal(monthCells('2026-11').filter(Boolean).length,30);assert.equal(monthCells('2028-02').filter(Boolean).length,29);assert.equal(shiftMonth('2026-12',1),'2027-01');assert.equal(shiftMonth('2026-01',-1),'2025-12')});

test('curated event links retain exact occurrence IDs in native source/month details',async()=>{
 const {publicEventHref}=await import('../app/calendar/calendar-state.mjs');
 for(const start of ['2026-11-07','2026-11-11','2026-11-23']){
  const id=`synthetic@example.invalid/${start}`;
  const url=new URL(publicEventHref({id,start,allDay:true}),'https://example.invalid');
  assert.equal(url.pathname,'/calendar');assert.equal(url.searchParams.get('source'),'activities');assert.equal(url.searchParams.get('view'),'MONTH');assert.equal(url.searchParams.get('month'),'2026-11');assert.equal(url.searchParams.get('event'),`activities:${id}`);
 }
 const url=new URL(publicEventHref({id:'timed/instance',start:'2026-11-01T01:00:00Z',allDay:false}),'https://example.invalid');assert.equal(url.searchParams.get('month'),'2026-10');
});

test('event return context accepts only internal parent destinations and safe student IDs',async()=>{
 const {publicEventHref,calendarReturnHref}=await import('../app/calendar/calendar-state.mjs');
 const event={id:'synthetic/2026-11-07',start:'2026-11-07',allDay:true};
 const url=new URL(publicEventHref(event,{from:'students',returnStudent:'student-1'}),'https://example.invalid');
 const state=calendarState(Object.fromEntries(url.searchParams),now);
 assert.equal(calendarReturnHref(state),'/students?student=student-1');assert.match(calendarHref(state,{view:'AGENDA'}),/returnStudent=student-1/);
 assert.equal(calendarReturnHref(calendarState({from:'today'},now)),'/');
 for(const from of ['https://example.invalid','//example.invalid',['students']])assert.equal(calendarReturnHref(calendarState({from,returnStudent:'student-1'},now)),null);
 for(const returnStudent of ['//example.invalid','x&from=https://bad','', ['student-1']])assert.equal(calendarReturnHref(calendarState({from:'students',returnStudent},now)),'/students');
});
