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
