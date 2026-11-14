import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../app/'+p,import.meta.url),'utf8');
test('Parent pages omit audit provenance without hiding meaningful availability and safety',()=>{
 for(const page of ['athletics/page.tsx','dress-code/page.tsx','staff/page.tsx','calendar/view.tsx','students/student-records.tsx'])assert.doesNotMatch(read(page),/Summary of|Checked |publicInfoChecked|staffSource.checkedLabel/);
 assert.match(read('calendar/view.tsx'),/Calendar unavailable/);
 assert.match(read('students/student-records.tsx'),/Reported <time/);
 assert.match(read('dress-code/page.tsx'),/Full dress code/);
 assert.match(read('messages/page.tsx'),/not connected/);
 assert.match(read('pickup/page.tsx'),/Follow school staff directions/);
});
