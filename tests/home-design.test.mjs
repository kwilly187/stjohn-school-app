import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('Home keeps family data configured and real school calendar intact',async()=>{
 const page=await read('app/page.tsx');
 assert.match(page,/profiles\.map\(profile=>profile.grade\)/);
 assert.match(page,/limit=\{2\} title="Key school dates" featured/);
 for(const destination of ['/faq','/students','/pickup','/staff?contacts=saved','/lunch','/athletics','/resources#school-store','/resources','/updates'])assert.ok(page.includes('href="'+destination+'"'));
 assert.doesNotMatch(page,/mock|demo student|John Doe|→/i);
});
test('Home has school color hierarchy and accessible phone control sizing',async()=>{
 const css=await read('app/home.module.css');
 assert.match(css,/background:var\(--navy\)/);
 assert.match(css,/color:var\(--gold\)/);
 assert.match(css,/\.faq\{display:inline-flex;min-height:44px/);
 assert.match(css,/\.familyLinks a\{min-height:44px/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.taskGrid a>span>span\{font-size:13px\}/);
});
