import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sampleStudents, sampleNotices, sampleFamilyFeed, selectSampleStudents} from '../app/students/sample-family.mjs';
const ids = selection => sampleFamilyFeed(sampleNotices,selectSampleStudents(selection)).map(n=>n.id);
test('all sample students combine seven examples and schoolwide appears once',()=>{
  assert.deepEqual(ids('all'),['welcome','grade-six','grade-nine','science','team','middle-school-team','personal']);
  const feed=sampleFamilyFeed([...sampleNotices,sampleNotices[0]],sampleStudents);
  assert.equal(feed.length,7); assert.equal(feed[0].relevantStudents.length,2);
});
test('grade six selection excludes high-school and unrelated team notices',()=>assert.deepEqual(ids('jordan-example'),['welcome','grade-six','science','middle-school-team','personal']));
test('grade nine selection excludes grade six, class and another student personal note',()=>assert.deepEqual(ids('taylor-example'),['welcome','grade-nine','team']));
test('unknown, repeated or empty selection never broadens the family feed',()=>{
  for(const selection of ['unknown','', ['jordan-example','taylor-example']]) assert.deepEqual(ids(selection),[]);
  assert.equal(ids(undefined).length,7);
});
test('draft, future, expired, invalid publication, wrong school and wrong student are excluded',()=>{
  const base=sampleNotices[0];
  const bad=[{status:'draft'},{publishedAt:'2099-01-01'},{expiresAt:'2026-01-15T12:00:00Z'},{publishedAt:'bad'},{expiresAt:'bad'},{schoolId:'other'},{audience:{studentIds:['other'],schoolwide:true}},{audience:null}];
  assert.deepEqual(sampleFamilyFeed(bad.map((patch,i)=>({...base,id:`bad-${i}`,...patch})),sampleStudents),[]);
  assert.deepEqual(sampleFamilyFeed(sampleNotices,sampleStudents,'bad'),[]);
});
test('personal targeting takes priority over accidental broad metadata',()=>{
  const notice={...sampleNotices.find(n=>n.id==='personal'),audience:{studentIds:['jordan-example'],grades:[9],schoolwide:true}};
  assert.deepEqual(sampleFamilyFeed([notice],[sampleStudents[1]]),[]);
  assert.deepEqual(sampleFamilyFeed([notice],sampleStudents)[0].relevantStudents.map(s=>s.id),['jordan-example']);
});
test('unknown class and team scopes match nothing',()=>{
  for(const audience of [{classIds:['other']},{teamIds:['other']},{grades:[12]}]) assert.deepEqual(sampleFamilyFeed([{...sampleNotices[0],audience}],sampleStudents),[]);
});
test('student screen uses real public dates and URL-backed profile selection',async()=>{
 const source=await readFile(new URL('../app/students/page.tsx',import.meta.url),'utf8');
 for(const text of ['aria-current','searchParams','/students?student=','href="/updates"','href="/"','PublicDates'])assert.ok(source.includes(text));
 assert.doesNotMatch(source,/sampleNotices|Sample sibling|mode===|localStorage|signIn|signUp/);
});
