import test from 'node:test';
import assert from 'node:assert/strict';
import {getStudentDashboard,resolveDashboardSelection} from '../app/students/dashboard-data.mjs';
const profiles=[{id:'sample-a',name:'Jordan Example',grade:6},{id:'sample-b',name:'Taylor Example',grade:9}];
test('all and exact child selection remain deterministic without mutating configuration',()=>{
  for(const selection of [undefined,'all']){
    const result=resolveDashboardSelection(profiles,selection);
    assert.equal(result.selection,'all');assert.equal(result.valid,true);assert.deepEqual(result.selected,profiles);assert.notEqual(result.selected,profiles);
  }
  for(const profile of profiles)assert.deepEqual(resolveDashboardSelection(profiles,profile.id),{selection:profile.id,selected:[profile],valid:true});
  assert.equal(profiles.length,2);
});
test('repeated, empty, unknown and malformed queries never expand to other children',()=>{
  for(const query of [['sample-a'],['sample-a','sample-b'],'','unknown','SAMPLE-A',' sample-a ',null,42,{}]){
    const result=resolveDashboardSelection(profiles,query);assert.equal(result.valid,false);assert.deepEqual(result.selected,[]);
    const empty=resolveDashboardSelection([],query);assert.equal(empty.valid,false);assert.deepEqual(empty.selected,[]);
  }
});
test('generic empty all is valid, while ambiguous duplicate IDs are rejected',()=>{
  assert.deepEqual(resolveDashboardSelection([],undefined),{selection:'all',selected:[],valid:true});
  assert.equal(resolveDashboardSelection([],'sample-a').valid,false);
  assert.equal(resolveDashboardSelection([profiles[0],{...profiles[1],id:'sample-a'}],'sample-a').valid,false);
});
test('four stable dashboard sections never invent connected or successful-empty private data',()=>{
  for(const selected of [profiles,[profiles[0]],[profiles[1]],[]]){
    const sections=getStudentDashboard(selected);
    assert.deepEqual(sections.map(section=>section.key),['assignments','grades','teams','announcements']);
    for(const section of sections){assert.deepEqual(Object.keys(section),['key','status','items']);assert.equal(section.status,'not-connected');assert.deepEqual(section.items,[]);}
    assert.equal(JSON.stringify(sections).includes('sample-a'),false);
  }
});
test('sections and empty item arrays are fresh per call, never shared across child selections',()=>{
  const first=getStudentDashboard([profiles[0]]),second=getStudentDashboard([profiles[1]]);
  for(let index=0;index<first.length;index++){assert.notEqual(first[index],second[index]);assert.notEqual(first[index].items,second[index].items);}
  first[0].items.push({synthetic:true});
  assert.deepEqual(second[0].items,[]);assert.deepEqual(getStudentDashboard(profiles)[0].items,[]);
});

test('student dashboard keeps source availability separate from public calendar facts',async()=>{
 const {readFile}=await import('node:fs/promises');
 const page=await readFile(new URL('../app/students/page.tsx',import.meta.url),'utf8');
 for(const label of ['Upcoming assignments','Current grades','Teams & activities','School updates','Not connected'])assert.ok(page.includes(label));
 assert.ok(page.indexOf('styles.dashboard')<page.indexOf('<PublicDates'));
 assert.match(page,/valid&&<div/);assert.match(page,/valid\?<Suspense/);
 assert.doesNotMatch(page,/No assignments|No grades|No teams|sampleNotices|fetch\(|localStorage|PhotoPreview/);
});
