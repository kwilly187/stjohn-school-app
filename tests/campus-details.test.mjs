import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Two authentic lightweight campus photos support specific parent actions',()=>{
 const athletics=read('app/athletics/page.tsx'),resources=read('app/resources/page.tsx');
 assert.match(athletics,/image="\/campus\/gym.webp"/);assert.match(athletics,/href="\/calendar\?source=athletics"/);
 assert.match(resources,/image="\/campus\/library.webp"/);assert.match(resources,/href="https:\/\/stjohnocala.follettdestiny.com\/"/);
 for(const file of ['gym','library'])assert.ok(statSync(new URL('../public/campus/'+file+'.webp',import.meta.url)).size<100000);
 for(const source of [athletics,resources])assert.match(source,/<SectionBanner/);
});
test('Home keeps community photography outside consistent icon-only essentials',()=>{const home=read('app/page.tsx');const essentials=home.slice(home.indexOf('aria-label="Everyday school tasks"'),home.indexOf('</nav></section>'));assert.doesNotMatch(essentials,/<img|photoTask/);assert.equal((essentials.match(/styles.taskIcon/g)||[]).length,4);assert.match(home,/className=\{styles.communityPhoto\}/);assert.ok(statSync(new URL('../public/campus/courtyard.webp',import.meta.url)).size<100000);});

test('Community alone gets royal photo overlay and original crest with readable text',()=>{const page=read('app/page.tsx'),css=read('app/home.module.css');assert.match(page,/className=\{styles.communityBanner\}/);assert.match(page,/<CommunitySurprise className=\{styles.communityCrest\}/);assert.match(read('app/community-surprise.tsx'),/src="\/stjohn-logo.png"/);assert.match(css,/communityBanner:after\{[^}]*rgba\(30,43,128,.94\)/);assert.match(css,/communityBanner .communityIntro h2\{color:#fff/);});
