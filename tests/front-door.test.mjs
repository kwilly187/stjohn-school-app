import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resources} from '../app/school-data.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('native front door names the actual tasks without replacing provider accounts',async()=>{
 const today=await read('app/page.tsx'),nav=await read('app/navigation.tsx'),contacts=await read('app/updates/page.tsx'),students=await read('app/students/page.tsx');
 assert.match(today,/My students/);assert.match(today,/School & grade-level dates/);
 assert.match(today,/Game schedules/);assert.match(today,/appPath:'\/resources#school-store'/);assert.match(today,/href="\/resources#school-accounts"/);
 assert.match(nav,/href:'\/updates',label:'Contacts'/);assert.equal((nav.match(/href:'/g)||[]).length,4);
 assert.match(contacts,/title="School contacts"/);assert.match(students,/Contact the school →/);
 assert.doesNotMatch(contacts,/href={school.portal}/);
 assert.match(resources.find(x=>x.id==='alma').title,/school updates/);assert.match(resources.find(x=>x.id==='alma').detail,/Sign-in required/);
});
test('provider help distinguishes separate accounts and does not imply native balances',async()=>{
 assert.match(await read('app/resources/page.tsx'),/account you use for each provider/);
 assert.doesNotMatch(await read('app/lunch/page.tsx'),/in one place/);
 assert.equal(resources.some(x=>x.id==='ptl'),false);
});

test('Today groups configured identity with real dates and accents only the first chronological selection',async()=>{
 const today=await read('app/page.tsx'),dates=await read('app/public-dates.tsx'),profile=await read('app/students/profile-config.mjs');
 assert.match(today,/className="family-day"/);assert.match(today,/profiles\[0\]\.photo/);assert.match(today,/profiles\[0\]\.name/);
 assert.match(today,/limit=\{3\} featured/);assert.ok(today.indexOf('family-day')<today.indexOf('schedule-actions'));
 assert.match(today,/src=\{school.logo\}/);assert.match(today,/href="\/calendar\?source=athletics"/);
 assert.match(profile,/profiles=\[\]/);assert.doesNotMatch(today,/Aubrey|test-profile\.jpeg/);
 assert.match(dates,/featured&&index===0/);assert.match(dates,/participation is not confirmed/);assert.match(dates,/Dismissal time is not listed/);assert.match(dates,/publicEventHref/);
 assert.doesNotMatch(today+dates,/urgent|required action|your game/i);
});
