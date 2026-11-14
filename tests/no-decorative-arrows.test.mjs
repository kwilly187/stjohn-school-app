import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
const root=new URL('../app/',import.meta.url);
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(join(dir,entry.name)):entry.name.endsWith('.tsx')?[join(dir,entry.name)]:[]);}
test('parent interface has no decorative arrow text or outbound arrow icons',()=>{
 for(const path of files(root.pathname)) {
  const source=readFileSync(path,'utf8');
  assert.doesNotMatch(source,/[→↗➜➔]|M7 17 17 7M7 7h10v10|className=[^\n]*external-arrow/,path);
 }
});
test('calendar and resource layouts keep primary controls compact',()=>{
 const calendar=readFileSync(new URL('../app/calendar/view.tsx',import.meta.url),'utf8');
 assert.ok(calendar.includes('styles.tools'));
 const transfer=readFileSync(new URL('../app/calendar/transfer.module.css',import.meta.url),'utf8');
 assert.ok(transfer.includes('summary::-webkit-details-marker{display:none}'));
 const resources=readFileSync(new URL('../app/resources/page.tsx',import.meta.url),'utf8');
 assert.ok(resources.includes("['School accounts',...resourceGroups.filter"));
 assert.ok(resources.includes('styles.groups'));
 assert.ok(!resources.includes('name="heart"'));
});
