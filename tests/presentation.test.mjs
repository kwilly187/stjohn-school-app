import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {profiles,selectProfiles} from '../app/students/profile-config.mjs';
test('public source has no presentation people and unknown profile selection stays empty',()=>{assert.deepEqual(profiles,[]);assert.deepEqual(selectProfiles('anything'),[])});
test('presentation renders real dates, not example notices or unapproved devotion',async()=>{
 const page=await readFile(new URL('../app/students/page.tsx',import.meta.url),'utf8');const today=await readFile(new URL('../app/page.tsx',import.meta.url),'utf8');
 assert.match(page,/PublicDates/);assert.doesNotMatch(page,/sampleNotices|sampleStudents|sampleFamilyFeed|mode===|Sample sibling|View sample/);assert.doesNotMatch(today,/DevotionCard|<SourceNote/);
});
