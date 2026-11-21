import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {calendarState} from '../app/calendar/calendar-state.mjs';

const url=new URL('../app/calendar/page.tsx',import.meta.url);
const require=createRequire(url);
const code=ts.transpileModule(readFileSync(url,'utf8'),{
 compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true},
}).outputText;

test('Calendar passes an explicit public feed view to the client on both success and failure',async()=>{
 const CalendarView=()=>null;
 const fixtures=[
  {status:'ok',retrievedAt:'2026-11-21T15:00:00.000Z',rangeStart:'2026-11-01',rangeEnd:'2026-12-01',events:[{id:'synthetic'}]},
  {status:'unavailable',retrievedAt:null,rangeStart:null,rangeEnd:null,events:[],error:'Synthetic upstream diagnostic'},
 ];
 for(const fixture of fixtures){
  const sourceUrl='https://example.test/public.ics';
  const module={exports:{}};
  new Function('require','module','exports',code)(name=>{
   if(name==='../components')return {Heading:()=>null};
   if(name==='./view')return CalendarView;
   if(name==='./calendar.module.css')return {page:'calendar'};
   if(name==='./calendar-state.mjs')return {calendarState};
   if(name==='./calendar-feed.mjs')return {getCalendarFeed:async()=>({...fixture,sourceUrl,internalContext:'not public'})};
   return require(name);
  },module,module.exports);
  const page=await module.exports.default({searchParams:Promise.resolve({source:'activities'})});
  const props=page.props.children.find(element=>element.type===CalendarView).props;
  const {status,retrievedAt,events,rangeStart,rangeEnd}=fixture;
  assert.deepEqual(props.result,{status,retrievedAt,sourceUrl,events,rangeStart,rangeEnd});
 }
});
