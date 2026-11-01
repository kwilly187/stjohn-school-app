import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('four dock destinations use Home, Calendar, Contacts, Resources without changing routes',async()=>{
 const nav=await source('app/navigation.tsx');
 for(const [href,label] of [['/','Home'],['/calendar','Calendar'],['/updates','Contacts'],['/resources','Resources']])assert.ok(nav.includes(`href:'${href}',label:'${label}'`));
 assert.equal((nav.match(/href:'/g)||[]).length,4);assert.doesNotMatch(nav,/label:'Today'/);
});
test('staff belongs to Contacts and student context belongs to Home',async()=>{
 const nav=await source('app/navigation.tsx');
 assert.ok(nav.includes("tab.href==='/updates'&&pathname==='/staff'"));
 assert.ok(nav.includes("tab.href==='/'&&pathname==='/students'"));
 assert.doesNotMatch(nav,/\['\/lunch','\/staff'/);
 assert.ok(nav.includes("['/lunch','/athletics','/dress-code']"));
});
test('staff return link returns to Contacts without changing saved-contact tools',async()=>{
 const page=await source('app/staff/page.tsx');assert.match(page,/href="\/updates" className=\{styles.back\}>← Contacts/);assert.match(page,/<StaffView staff=\{staffDirectory\} departments=\{staffDepartments\}/);
});
