import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('K5 carline preserves supplied map and existing approved pickup guide',()=>{
 const page=readFileSync('app/pickup/page.tsx','utf8');
 assert.match(page,/K5 carline/);
 assert.match(page,/aria-label="Open full-size K5 carline map"/);
 assert.match(page,/st-john-parent-pickup-guide.svg/);
 assert.match(page,/st-john-parent-pickup-guide.pdf/);
 const image=readFileSync('public/pickup/k5-carline.jpeg');
 assert.equal(image.readUInt16BE(0),0xffd8);
 assert.equal(image.length,535980);
});
