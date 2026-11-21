import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('Touch search fields retain readable input sizing',async()=>{
 const css=await readFile('app/parent-actions/actions.module.css','utf8');
 assert.match(css,/\.search input\{font-size:16px;line-height:1\.5\}/);
});
test('FAQ keyboard focus stays inside clipped rows and clear control stays usable',async()=>{
 const css=await readFile('app/faq/faq.module.css','utf8');
 assert.match(css,/\.item summary:focus-visible\{outline-offset:-3px\}/);
 assert.match(css,/\.searchRow button\{flex-shrink:0;white-space:nowrap\}/);
 assert.match(css,/@media\(max-width:380px\)/);
});
test('Photo banner text may shrink and reflow without overflowing beside crest',async()=>{
 const banner=await readFile('app/section-banner.module.css','utf8');
 const home=await readFile('app/home.module.css','utf8');
 assert.match(banner,/\.content>div\{min-width:0;overflow-wrap:anywhere\}/);
 assert.match(home,/\.communityBanner \.communityIntro>div\{min-width:0;overflow-wrap:anywhere\}/);
});
