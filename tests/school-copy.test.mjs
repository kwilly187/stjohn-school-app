import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(`../app/${p}`,import.meta.url),'utf8');
test('parent home uses school-specific tasks rather than marketing filler',()=>{const page=read('page.tsx');for(const label of ['St. John Parent Portal','Upcoming at St. John','Nutrislice & PaySchools','BSN spirit wear','FlynnO’Hara'])assert.ok(page.includes(label));assert.doesNotMatch(page,/The everyday, made easy|School life, simplified|Stay connected to school life/)});
test('student intro identifies actual existing service instead of promising native records',()=>{assert.match(read('students/page.tsx'),/Access St. John student records in Alma/)});
