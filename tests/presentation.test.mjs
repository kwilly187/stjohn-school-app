import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {profiles,selectProfiles} from '../app/students/profile-config.mjs';
test('public source has no presentation people and unknown profile selection stays empty',()=>{assert.deepEqual(profiles,[]);assert.deepEqual(selectProfiles('anything'),[])});
test('presentation renders real dates, not example notices or unapproved devotion',async()=>{
 const page=await readFile(new URL('../app/students/page.tsx',import.meta.url),'utf8');const today=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8');
 assert.match(page,/PublicDates/);assert.doesNotMatch(page,/sampleNotices|sampleStudents|sampleFamilyFeed|mode===|Sample sibling|View sample/);assert.doesNotMatch(today,/DevotionCard|<SourceNote/);
});

test('parent dashboard reuses configured grades and obvious native contact/details',async()=>{
 const today=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8'),dates=await readFile(new URL('../app/public-dates.tsx',import.meta.url),'utf8'),components=await readFile(new URL('../app/components.tsx',import.meta.url),'utf8'),view=await readFile(new URL('../app/calendar/view.tsx',import.meta.url),'utf8');
 assert.match(today,/grades={profiles.map\(profile=>profile.grade\)}/);assert.match(dates,/Key school dates/);assert.match(components,/href="\/updates#contact-heading"/);assert.match(view,/scrollIntoView/);assert.match(view,/preventScroll:true/);assert.match(view,/Back to My Students/);
});

test('public information routes stay native and office/meal support are available directly',async()=>{
 const {resources,school}=await import('../app/school-data.mjs');
 for(const [id,path] of [['staff','/staff'],['athletics','/athletics'],['dress-code','/dress-code'],['forms','/updates#contact-heading'],['supplies','/updates#contact-heading'],['meal-info','/lunch#meal-help']])assert.equal(resources.find(item=>item.id===id).appPath,path);
 assert.equal(school.mealHelpEmail,'jstonecypher@maschiofood.com');assert.match(school.officeHours,/7:30 am–3:30 pm/);
 const updates=await readFile(new URL('../app/updates/page.tsx',import.meta.url),'utf8');assert.match(updates,/href="\/staff"/);assert.match(updates,/school.officeHours/);
});
