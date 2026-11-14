import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('Home keeps family data configured and real school calendar intact',async()=>{
 const page=await read('app/page.tsx');
 assert.match(page,/profiles\.map\(profile=>profile.grade\)/);
 assert.match(page,/limit=\{2\} title="Upcoming at St. John" featured/);
 for(const destination of ['/faq','/staff?contacts=saved','/lunch','/athletics','/resources#school-store','/resources','/updates'])assert.ok(page.includes('href="'+destination+'"'));
 assert.doesNotMatch(page,/mock|demo student|John Doe|→/i);
});
test('Home has school color hierarchy and accessible phone control sizing',async()=>{
 const css=await read('app/home.module.css');
 assert.match(css,/background:var\(--blue\)/);
 assert.match(css,/border-bottom:5px solid var\(--gold\)/);
 assert.match(css,/\.faq\{display:inline-flex;min-height:44px/);
 assert.match(css,/\.familyLinks a\{min-height:44px/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.taskGrid a>span>span\{font-size:13px\}/);
});

test('Home avoids mismatched icon highlights and keeps featured ranges next to event titles',async()=>{
 const css=await read('app/home.module.css'), dates=await read('app/public-dates.tsx');
 assert.doesNotMatch(css,/nth-child/);
 assert.match(dates,/featured&&<p className=\{styles.eventRange\}/);
 assert.match(css,/article h3 a\{text-decoration:none\}/);
});

test('Home uses the real campus photo and an open editorial layout',async()=>{
 const page=await read('app/page.tsx'),css=await read('app/home.module.css');
 assert.match(page,/src="\/stjohn-church.png"/);
 assert.match(page,/alt="St. John church on the school campus"/);
 assert.match(css,/\.familyPanel\{[^}]*border-left:1px solid var\(--line\)/);
 assert.ok(page.indexOf('home-tasks')<page.indexOf('<PublicDates'));
});

test('school screenshot styling retains readable interface type and uses existing school fleur',async()=>{
 const home=await read('app/home.module.css'),scripture=await read('app/daily-scripture.module.css'),global=await read('app/style.css');
 assert.match(home,/heading h1\{color:var\(--blue\);font-weight:400/);
 assert.match(scripture,/stjohn-fleur-divider.png/);
 assert.match(global,/--font-school:'Inter'/);
});
