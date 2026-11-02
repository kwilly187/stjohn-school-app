import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resources} from '../app/school-data.mjs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('native front door names the actual tasks without replacing provider accounts',async()=>{
 const today=await read('app/page.tsx'),nav=await read('app/navigation.tsx'),contacts=await read('app/updates/page.tsx'),students=await read('app/students/page.tsx');
 assert.match(today,/My students/);assert.match(today,/Student overview/);
 assert.match(today,/Sports, forms & participation/);assert.match(today,/href="\/resources#school-store"/);assert.match(today,/href="\/resources"/);
 assert.match(nav,/href:'\/updates',label:'Contacts'/);assert.equal((nav.match(/href:'/g)||[]).length,4);
 assert.match(contacts,/title="School contacts"/);assert.match(students,/← Home/);
 assert.match(contacts,/Alma · External sign-in/);assert.ok(contacts.indexOf('styles.secondary')<contacts.indexOf('href={school.portal}'));
 assert.match(resources.find(x=>x.id==='alma').title,/school updates/);assert.match(resources.find(x=>x.id==='alma').detail,/Sign-in required/);
});
test('provider help distinguishes separate accounts and does not imply native balances',async()=>{
 assert.match(await read('app/resources/page.tsx'),/account you use for each provider/);
 assert.doesNotMatch(await read('app/lunch/page.tsx'),/in one place/);
 assert.equal(resources.some(x=>x.id==='ptl'),false);
});

test('Home prioritizes tasks with compact configured identity and subordinate real dates',async()=>{
 const today=await read('app/page.tsx'),dates=await read('app/public-dates.tsx'),profile=await read('app/students/profile-config.mjs');
 assert.match(today,/className="home-family"/);assert.match(today,/profiles\[0\]\.photo/);assert.match(today,/profiles\[0\]\.name/);
 assert.match(today,/limit=\{2\}/);assert.ok(today.indexOf('home-tasks')<today.indexOf('home-dates'));assert.doesNotMatch(today,/<PublicDates[^>]+featured/);
 assert.match(today,/href="\/athletics"/);assert.match(today,/href="\/staff\?contacts=saved"/);
 assert.match(profile,/profiles=\[\]/);assert.doesNotMatch(today,/Aubrey|test-profile\.jpeg/);
 assert.match(dates,/featured&&index===0/);assert.match(dates,/participation is not confirmed/);assert.match(dates,/Dismissal time is not listed/);assert.match(dates,/publicEventHref/);
 assert.doesNotMatch(today+dates,/urgent|required action|your game/i);
});
