import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import ts from 'typescript';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
import {normalizeStudentSections} from '../app/students/student-records-policy.mjs';
const require=createRequire(import.meta.url);
const source=fs.readFileSync(new URL('../app/students/student-records.tsx',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const module={exports:{}};
new Function('require','module','exports',compiled)(name=>name.endsWith('.module.css')?new Proxy({},{get:(_,key)=>String(key)}):require(name),module,module.exports);
const StudentRecords=module.exports.default;
const now=new Date('2026-11-02T17:00:00Z');
const section=items=>({status:'ready',retrievedAt:'2026-11-02T16:00:00Z',items});
const payload={
 assignments:section([{id:'a',studentId:'one',status:'active',title:'Synthetic science task',course:'Science',dueAt:'2026-11-03'}]),
 grades:section([{id:'g',studentId:'one',status:'active',course:'Synthetic math',value:'B+',reportedAt:'2026-11-02T15:00:00Z'}]),
 teams:section([{id:'t',studentId:'two',status:'active',name:'Synthetic activity',season:'Autumn'}]),
 announcements:section([{id:'n',studentId:'one',status:'published',title:'Synthetic update',body:'<script>not executable</script>',publishedAt:'2026-11-02T15:00:00Z'}])
};
const render=(input,ids=['one','two'])=>renderToStaticMarkup(React.createElement(StudentRecords,{sections:normalizeStudentSections(input,ids,now),studentNames:Object.fromEntries(ids.map(id=>[id,id==='one'?'Example One':'Example Two']))}));
test('normalized authorized-data display renders all four types with child labels and correct date-only semantics',()=>{
 const html=render(payload);for(const text of ['Synthetic science task','Science','Nov 3, 2026','Synthetic math','B+','Synthetic activity','Autumn','Synthetic update','Example One','Example Two','Checked'])assert.ok(html.includes(text));
 assert.ok(html.includes('&lt;script&gt;not executable&lt;/script&gt;'));assert.ok(!html.includes('<script>'));
});
test('selected child rendering never displays another selected-out child record or label',()=>{
 const html=render(payload,['one']);assert.ok(html.includes('Synthetic science task'));assert.ok(!html.includes('Synthetic activity'));assert.ok(!html.includes('Example Two'));assert.ok(html.includes('No memberships shared for this selection.'));
});
test('disconnected, unavailable and successful empty states remain distinct without false values',()=>{
 const disconnected=render({});assert.equal((disconnected.match(/Not connected/g)||[]).length,4);assert.ok(!disconnected.includes('No assignments shared'));
 const unavailable=render({assignments:{status:'unavailable'}});assert.ok(unavailable.includes('couldn’t be loaded'));assert.ok(!unavailable.includes('No assignments shared'));
 const empty=render({assignments:section([])});assert.ok(empty.includes('No assignments shared for this selection.'));assert.ok(empty.includes('Checked'));
});

test('overdue active work is retained under an honest Assignments heading',()=>{
 const input={assignments:section([{id:'past',studentId:'one',status:'active',title:'Synthetic overdue work',course:'Science',dueAt:'2026-10-01'}])};
 const html=render(input,['one']);assert.ok(html.includes('Synthetic overdue work'));assert.ok(html.includes('Oct 1, 2026'));assert.ok(html.includes('>Assignments</h2>'));assert.ok(!html.includes('Upcoming assignments'));
});
