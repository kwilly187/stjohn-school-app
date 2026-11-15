import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('messages provides real school destinations without a fabricated inbox',async()=>{
 const s=await read('app/messages/page.tsx');
 for(const text of ['school.portal','href="/staff"','school.officeEmail','not connected','Email opens in your email app'])assert.ok(s.includes(text));
 assert.doesNotMatch(s,/unread|No new messages|sendMessage|setTimeout|messageCount|notificationCount/);
});
test('notifications has no fake feed, calendar-derived alerts or permission prompt',async()=>{
 const s=await read('app/notifications/page.tsx');
 assert.match(s,/School alerts are not connected/);assert.match(s,/school.portal/);assert.match(s,/school.phone/);
 assert.doesNotMatch(s,/PublicDates|calendar|requestPermission|Notification\(|No new|unread|badge|subscribe/);
});
