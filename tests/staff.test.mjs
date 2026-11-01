import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {staffDirectory,staffListings,staffDepartments,staffSource,filterStaff} from '../app/staff/staff-data.mjs';
test('complete checked public snapshot preserves published role listings and department groups',()=>{
 assert.equal(staffListings.length,82);assert.equal(staffDirectory.length,70);assert.equal(staffDepartments.length,8);assert.equal(new Set(staffDirectory.map(p=>p.id)).size,70);
 assert.equal(staffSource.url,'https://stjohnocala.org/about/for-parents/');assert.ok(Number.isFinite(Date.parse(staffSource.checkedAt)));
 for(const person of staffListings){assert.ok(person.name&&person.role&&person.department);assert.ok(staffDepartments.includes(person.department));if(person.email)assert.match(person.email,/^[^\s@]+@stjohnocala\.org$/i);assert.equal('imageURL' in person,false);assert.equal('phone' in person,false);}
});
test('name and role searches are case-insensitive and combine tokens',()=>{
 assert.ok(filterStaff(staffDirectory,'JIM KNOEPFEL').every(p=>p.name==='Jim Knoepfel'));assert.ok(filterStaff(staffDirectory,'JIM KNOEPFEL').length>0);
 const principals=filterStaff(staffDirectory,'principal');assert.ok(principals.length>=2);assert.ok(principals.every(p=>p.roles.some(role=>role.role.toLowerCase().includes('principal'))));
 assert.deepEqual(filterStaff(staffDirectory,'a name that does not exist'),[]);assert.equal(filterStaff(staffDirectory,'   ').length,70);
});
test('department filters use only exact verified groups and intersect search',()=>{
 for(const department of staffDepartments){const results=filterStaff(staffDirectory,'',department);assert.ok(results.length>0);assert.ok(results.every(p=>p.departments.includes(department)));}
 assert.deepEqual(filterStaff(staffDirectory,'','Not a department'),[]);
 assert.ok(filterStaff(staffDirectory,'jim','School Administration').every(p=>p.name.toLowerCase().includes('jim')&&p.departments.includes('School Administration')));
});
test('source spelling/contact discrepancy is retained and flagged, not silently merged or corrected',()=>{
 const conflicts=staffDirectory.filter(p=>p.contactNeedsConfirmation);assert.equal(conflicts.length,2);
 assert.ok(conflicts.some(p=>p.name==='Marie Tillis'&&p.email==='marie.tillis@stjohnocala.org'));
 assert.ok(conflicts.some(p=>p.name==='Marie Tills'&&p.email==='marie.tills@stjohnocala.org'));
});
test('native view has labeled search, keyboard-native filter/reset, live results and verified email actions',async()=>{
 const source=await readFile(new URL('../app/staff/staff-view.tsx',import.meta.url),'utf8');
 for(const text of ['htmlFor="staff-search"','type="search"','htmlFor="staff-department"','<select','aria-live="polite"','Clear filters','Show all staff','mailto:${person.email}','!person.contactNeedsConfirmation','staff contacts'])assert.ok(source.includes(text),text);
 assert.doesNotMatch(source,/dangerouslySetInnerHTML|<img|localStorage|fetch\(/);
});
test('directory page has official source provenance, office fallback and no student assignment claims',async()=>{
 const source=await readFile(new URL('../app/staff/page.tsx',import.meta.url),'utf8');
 for(const text of ['school.officeEmail','school.phone','staffSource.url','staffSource.checkedLabel','href="/resources"'])assert.ok(source.includes(text),text);
 assert.doesNotMatch(source,/your child.s teacher|assigned teacher|live staff feed is connected/i);
});

test('exact-name-and-email normalization preserves every published role and separates conflicts',()=>{
 assert.equal(new Set(staffDirectory.map(p=>JSON.stringify([p.name,p.email]))).size,70);
 for(const listing of staffListings){const person=staffDirectory.find(p=>p.name===listing.name&&p.email===listing.email);assert.ok(person);assert.ok(person.roles.some(role=>role.role===listing.role&&role.department===listing.department));}
 assert.ok(staffDirectory.some(p=>p.roles.length>1));
});
