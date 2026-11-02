import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {calendarUrl,calendarSources,resources,school} from '../app/school-data.mjs';
const source = path => readFile(new URL('../'+path,import.meta.url),'utf8');
test('school calendars preserve published identities and Eastern time in both views',()=>{for(const name of Object.keys(calendarSources))for(const mode of ['AGENDA','MONTH']){const url=new URL(calendarUrl(name,mode));assert.equal(url.origin,'https://calendar.google.com');assert.equal(url.searchParams.get('src'),calendarSources[name]);assert.equal(url.searchParams.get('ctz'),'America/New_York');assert.equal(url.searchParams.get('mode'),mode)}});
test('calendar defaults reject unknown modes and sources',()=>{assert.equal(calendarUrl('not-real','not-real'),calendarUrl('activities','AGENDA'))});
test('resource IDs are unique; all destinations are secure external links',()=>{assert.equal(new Set(resources.map(r=>r.id)).size,resources.length);for(const r of resources){assert.equal(new URL(r.url).protocol,'https:');assert.ok(r.title&&r.detail&&r.group)}});
test('school services are linked directly rather than fake local balances',()=>{assert.equal(resources.find(r=>r.id==='alma').url,school.portal);assert.equal(new URL(resources.find(r=>r.id==='tuition').url).hostname,'parent.blackbaud.school');assert.equal(new URL(resources.find(r=>r.id==='lunch-account').url).hostname,'payschoolscentral.com');assert.match(resources.find(r=>r.id==='aftercare').title,/signup/);assert.match(resources.find(r=>r.id==='events').detail,/not active/)});
test('primary navigation uses four real routes and active page semantics',async()=>{const nav=await source('app/navigation.tsx');for(const href of ['/','/calendar','/updates','/resources'])assert.ok(nav.includes(`href:'${href}'`));assert.match(nav,/usePathname/);assert.match(nav,/aria-current/);assert.doesNotMatch(nav,/setPage|Store|Family/)});
test('Today and Updates disclose missing live information, not zero notices',async()=>{const today=await source('app/page.tsx'),updates=await source('app/updates/page.tsx');const components=await source('app/components.tsx');assert.doesNotMatch(today,/<SourceNote/);assert.match(updates,/Find the right person. Get the help you need./);assert.doesNotMatch(today+updates,/cart|setCart|products|\$150|\$250|\$600/)});
test('calendar has reload, source selection, load/error handling and a persistent direct fallback',async()=>{const view=await source('app/calendar/view.tsx');for(const text of ['aria-pressed','aria-live','Reload calendar','Official calendar','result.status','Calendar unavailable'])assert.ok(view.includes(text))});
test('school ownership and admin acceptance journey are documented without claiming authenticated testing',async()=>{const doc=await source('docs/content-ownership.md');for(const text of ['Google Calendar','Alma','Not performed','No duplicate entry','Production'])assert.ok(doc.includes(text))});

test('calendar selection is reflected in URL for refresh, sharing and browser history',async()=>{const view=await source('app/calendar/view.tsx');assert.match(view,/router.push/);assert.match(view,/calendarHref/);assert.match(view,/router.replace/);});

test('contact choices use public school destinations without an in-app messaging system',async()=>{const updates=await source('app/updates/page.tsx');for(const text of ['school.officeEmail','school.athleticsEmail','Find & email a teacher','Email opens in your email app'])assert.ok(updates.includes(text));});

test('school identity and contacts are centralized; Seagull attribution is discreet',async()=>{const layout=await source('app/layout.tsx');for(const key of ['name','logo','theme','officeEmail','athleticsEmail','timeZone'])assert.ok(school[key]);assert.match(layout,/school.appName/);assert.match(layout,/Powered by/);assert.doesNotMatch(layout,/ST\. JOHN|stjohn-logo/);});

test('school store separates real spirit wear and uniforms with provider checkout',()=>{const items=resources.filter(item=>item.group==='School store');assert.deepEqual(items.map(item=>item.id).sort(),['spirit','uniforms']);assert.equal(new URL(items.find(item=>item.id==='spirit').url).hostname,'sideline.bsnsports.com');assert.equal(new URL(items.find(item=>item.id==='uniforms').url).hostname,'flynnohara.com');});

test('lunch points to the school-linked menu app and keeps provider information secondary',()=>{assert.equal(resources.find(item=>item.id==='lunch').url,'https://sjlof.nutrislice.com/');assert.equal(resources.find(item=>item.id==='meal-info').url,'https://maschiofood.com/stjohnlutheran/');assert.match(resources.find(item=>item.id==='supplies').detail,/Confirm the current year/);});

test('lunch keeps clear official-menu and account links without an unverified blank embed',async()=>{assert.equal(resources.find(item=>item.id==='lunch').appPath,'/lunch');const page=await source('app/lunch/page.tsx');for(const text of ['Open official menu','Open PaySchools','Meal program information','Opens Nutrislice in a new tab.'])assert.ok(page.includes(text));assert.doesNotMatch(page,/<iframe/);const nav=await source('app/navigation.tsx');assert.match(nav,/\['\/lunch','\/athletics','\/dress-code'\].includes\(pathname\)/)});

test('student dates remain reachable from Home and keep four-tab navigation',async()=>{const page=await source('app/page.tsx'),nav=await source('app/navigation.tsx');assert.match(page,/href="\/students"/);assert.match(page,/Student overview/);assert.match(nav,/pathname==='\/students'/);assert.equal((nav.match(/href:'/g)||[]).length,4)});

test('calendar recovery is before the viewer and athletics guidance is source-specific',async()=>{const view=await source('app/calendar/view.tsx'),page=await source('app/calendar/page.tsx');assert.doesNotMatch(view,/<iframe/);assert.ok(view.indexOf('Official calendar')<view.indexOf('Calendar agenda'));assert.match(view,/state.source==='athletics'&&/)});
test('Updates prioritizes usable destinations without oversized development notices',async()=>{const page=await source('app/updates/page.tsx');for(const text of ['styles.primary','What do you need help with?','Find & email a teacher'])assert.ok(page.includes(text));assert.doesNotMatch(page,/updates-empty|public announcement feed|<HelpCard/)});

test('private school services disclose sign-in and are grouped separately from public resources',async()=>{for(const id of ['alma','tuition','lunch-account','aftercare']){const item=resources.find(r=>r.id===id);assert.equal(item.group,'School accounts');assert.match(item.detail,/Sign-in required/)}for(const id of ['lunch','spirit','uniforms'])assert.notEqual(resources.find(r=>r.id===id).group,'School accounts');const page=await source('app/resources/page.tsx');assert.match(page,/school-accounts/);assert.match(page,/open outside the app/);const updates=await source('app/updates/page.tsx'),lunch=await source('app/lunch/page.tsx');assert.doesNotMatch(updates,/School announcements/);assert.match(updates,/Alma · External sign-in/);assert.match(lunch,/Open PaySchools · Sign-in required/)});


test('curated dates open native details without raw-feed exits and Contacts keeps only secondary Alma access',async()=>{
 const dates=await source('app/public-dates.tsx'),updates=await source('app/updates/page.tsx');
 assert.match(dates,/<Link href={publicEventHref\(event,/);assert.doesNotMatch(dates,/href={event.sourceUrl}|href={result.sourceUrl}/);
 assert.equal((updates.match(/href={school.portal}/g)||[]).length,1);
});

test('student context returns Home and does not promote a duplicate contact dashboard',async()=>{const page=await source('app/students/page.tsx');assert.match(page,/href="\/">← Home/);assert.match(page,/Schoolwork, activities and updates/);assert.doesNotMatch(page,/styles.closing|Announcements and school contacts/)});
