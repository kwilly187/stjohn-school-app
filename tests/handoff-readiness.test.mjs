import test from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resources,school} from '../app/school-data.mjs';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('discontinued Saints Spirit preview is not a parent destination',()=>{
 assert.ok(resources.every(r=>!r.url.includes('saints-spirit')));
 const events=resources.find(r=>r.id==='events');
 assert.equal(events.appPath,'/updates#contact-heading');
 assert.equal(events.url,school.contact);
});
test('student overview provides existing school account access without pretending to connect',async()=>{
 const source=await read('app/students/page.tsx');
 assert.match(source,/href=\{school.portal\}/);
 assert.match(source,/Open Alma/);
 assert.match(source,/School sign-in/);
 assert.match(source,/normalizeStudentSections\(\{\},/);
});
test('calendar navigation keeps explicit accessible labels and pending protection',async()=>{
 const source=await read('app/calendar/view.tsx');
 assert.match(source,/aria-label="Previous month" disabled=\{pending/);
 assert.match(source,/>Previous<\/button>/);
 assert.match(source,/aria-label="Next month" disabled=\{pending/);
 assert.match(source,/>Next<\/button>/);
});
test('parent and review screens do not render decorative arrow glyphs',async()=>{
 async function walk(path){for(const entry of await readdir(new URL('../'+path,import.meta.url),{withFileTypes:true})){const file=path+'/'+entry.name;if(entry.isDirectory())await walk(file);else if(file.endsWith('.tsx'))assert.doesNotMatch(await read(file),/[←→↗]/,file);}}
 await walk('app');
 assert.doesNotMatch(await read('app/components.tsx'),/<svg className="external-arrow"/);
});

test('unexpected errors and missing pages provide simple recovery without technical details',()=>{
 const error=readFileSync(new URL('../app/error.tsx',import.meta.url),'utf8');
 const missing=readFileSync(new URL('../app/not-found.tsx',import.meta.url),'utf8');
 assert.match(error,/onClick=\{reset\}/);
 assert.match(error,/Try again/);
 assert.doesNotMatch(error,/error\.(message|stack|digest)/);
 assert.match(missing,/href="\/resources"/);
 for(const page of [error,missing])assert.match(page,/href="\/"/);
});

test('student page consolidates wholly disconnected records without hiding partial results',async()=>{
 const page=await read('app/students/page.tsx');
 assert.match(page,/sections\.some\(section=>section\.status!=='not-connected'\)\&\&<StudentRecords/);
 assert.match(page,/Open Alma/);
 assert.equal(resources.filter(resource=>resource.group===school.communityLabel&&resource.appPath==='/updates#contact-heading').length,1);
});

test('parent screens omit development labels and simulated pickup flows',async()=>{
 const paths=['app/layout.tsx','app/page.tsx','app/resources/page.tsx','app/pickup/page.tsx','app/students/page.tsx'];
 for(const path of paths)assert.doesNotMatch(await read(path),/PREVIEW|Proposed ·|proposed pickup|being prepared|View next step/);
 const devotion=await read('app/devotion-card.tsx');assert.match(devotion,/if\(!selected\?.record\)return null/);assert.doesNotMatch(devotion,/draftDevotion|awaiting school review/);
});
