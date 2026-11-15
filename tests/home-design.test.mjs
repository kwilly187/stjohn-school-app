import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('Home keeps family data configured and real school calendar intact',async()=>{
 const page=await read('app/page.tsx');
 assert.match(page,/profiles\.map\(profile=>profile.grade\)/);
 assert.match(page,/limit=\{2\} title="Upcoming at St. John" featured/);
 for(const destination of ['/faq','/staff?contacts=saved','/lunch','/athletics','/store','/resources','/updates'])assert.ok(page.includes('href="'+destination+'"'));
 assert.doesNotMatch(page,/mock|demo student|John Doe|→/i);
});
test('Home has school color hierarchy and accessible phone control sizing',async()=>{
 const css=await read('app/home.module.css');
 assert.match(css,/color:#2a3695/);
 assert.match(css,/border-bottom:3px solid var\(--gold\)/);
 assert.match(css,/\.faq\{display:inline-flex;min-height:44px/);
 assert.match(css,/\.actions a\{[^}]*min-height:58px/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.taskGrid a>span>span\{font-size:14px/);
});

test('Home avoids mismatched icon highlights and keeps featured ranges next to event titles',async()=>{
 const css=await read('app/home.module.css'), dates=await read('app/public-dates.tsx');
 assert.doesNotMatch(css,/nth-child/);
 assert.match(dates,/featured&&<p className=\{styles.eventRange\}/);
 assert.match(css,/article h3 a\{text-decoration:none\}/);
});

test('Home uses a quiet campus background rather than a repeated photo tile',async()=>{
 const page=await read('app/page.tsx'),css=await read('app/home.module.css');
 assert.doesNotMatch(page,/className=\{styles.campus\}/);
 assert.match(await read('app/style.css'),/url\('\/stjohn-church.png'\)/);
 assert.match(css,/\.overview\{display:grid/);
 assert.ok(page.indexOf('<PublicDates')<page.indexOf('home-tasks'));
});

test('school screenshot styling retains readable interface type and uses existing school fleur',async()=>{
 const home=await read('app/home.module.css'),scripture=await read('app/daily-scripture.module.css'),global=await read('app/style.css');
 assert.match(home,/heading h1\{color:var\(--blue\);font-weight:400/);
 assert.match(scripture,/stjohn-fleur-divider.png/);
 assert.match(global,/--font-school:'Inter'/);
});

test('Home actions use high contrast neutral rows without a decorative blue block',async()=>{const css=await read('app/home.module.css'),page=await read('app/page.tsx');assert.match(css,/\.actions\{background:#fff/);assert.doesNotMatch(css,/color:#ffe490/);assert.doesNotMatch(page,/HOW CAN WE HELP|A few things/);assert.match(page,/<span>Payments, forms & registration<\/span>/);});

test('Saints Community is a dedicated hub with real event, involvement and store destinations',async()=>{const page=await read('app/page.tsx'),css=await read('app/home.module.css');assert.ok(page.indexOf('id="community-heading"')>page.indexOf('home-tasks-heading'));assert.match(page,/href="\/parent-actions\?category=Get%20involved"/);assert.equal((page.match(/href="\/store"/g)||[]).length,1);assert.match(page,/href="\/pickup"/);assert.match(css,/\.communityLinks a\{[^}]*min-height:91px/);assert.match(css,/\.communityLinks\{grid-template-columns:1fr\}/);});

 test('Home follows the requested six-section order on every viewport',async()=>{const page=await read('app/page.tsx');const sections=['<DailyScriptureCard','<FamilyNotices','<PublicDates','id="home-tasks-heading"','id="community-heading"','aria-label="Parent actions"'];const positions=sections.map(section=>page.indexOf(section));assert.ok(positions.every((position,index)=>position>=0&&(index===0||position>positions[index-1])));assert.match(page,/<DailyScriptureCard[^>]+compact/);});
