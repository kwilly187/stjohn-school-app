import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync('app/'+p,'utf8');
test('Selective school banners preserve real page identity, crest and compact responsive layout',()=>{
 const component=read('section-banner.tsx'),css=read('section-banner.module.css');assert.match(component,/<h1>\{title\}<\/h1>/);assert.match(component,/src="\/stjohn-logo.png"/);assert.match(css,/min-height:156px/);assert.match(css,/content h1\{color:white/);assert.match(css,/pointer-events:none/);
 for(const page of ['athletics/page.tsx','resources/page.tsx'])assert.match(read(page),/<SectionBanner/);
 assert.doesNotMatch(read('store/store.tsx'),/SectionBanner/);
});
