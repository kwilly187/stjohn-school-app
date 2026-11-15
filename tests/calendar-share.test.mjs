import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publicCalendarShareUrl} from '../app/calendar/share-event.mjs';
test('public event links retain calendar selection but omit family context and unknown parameters',()=>{
 const link=new URL(publicCalendarShareUrl('https://school.example/calendar?event=practice%231&source=athletics&view=MONTH&month=2026-11&from=students&returnStudent=child-123&student=child-123&token=secret#detail'));
 assert.equal(link.searchParams.get('event'),'practice#1');assert.equal(link.searchParams.get('source'),'athletics');
 assert.deepEqual([...link.searchParams.keys()],['source','view','month','event']);assert.equal(link.hash,'');
});
test('event sharing rejects other pages, unsafe protocols and missing selection',()=>{
 for(const value of ['https://school.example/students?event=1','file:///calendar?event=1','https://school.example/calendar'])assert.throws(()=>publicCalendarShareUrl(value));
});
test('event sharing includes native share, clipboard and manual copy fallbacks',()=>{
 const ui=readFileSync(new URL('../app/calendar/save-event.tsx',import.meta.url),'utf8');
 for(const value of ['navigator.share','navigator.clipboard.writeText','AbortError','readOnly value={copyLink}','aria-live="polite"','disabled={sharing}'])assert.ok(ui.includes(value));
});
