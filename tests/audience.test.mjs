import assert from 'node:assert/strict';
import test from 'node:test';
import {matchRelevantAnnouncements} from './support/audience-match.mjs';
// Entirely synthetic test data. No actual school message or child record.
const now='2026-10-31T12:00:00Z';
const message=(id,audience,extra={})=>({id,schoolId:'synthetic-school',publishedAt:'2026-10-30T12:00:00Z',audience,...extra});
const sixth={id:'synthetic-child-a',label:'Child A',grade:'6',classIds:['class-6a'],teamIds:['middle-volleyball']};
const high={id:'synthetic-child-b',label:'Child B',grade:'10',classIds:['class-10b'],teamIds:['high-football']};
const scope=(children=[sixth])=>({schoolId:'synthetic-school',children});
const fixtures=[message('schoolwide',{schoolwide:true}),message('grade-six',{grades:['6']}),message('high-school',{grades:['9','10','11','12']}),message('my-team',{teamIds:['middle-volleyball']}),message('other-team',{teamIds:['high-football']}),message('expired',{schoolwide:true},{expiresAt:'2026-10-31T12:00:00Z'})];
test('synthetic sixth-grade parent receives schoolwide, exact grade and own team; not high-school or other-team messages',()=>{assert.deepEqual(matchRelevantAnnouncements(fixtures,scope(),now).map(x=>x.id),['schoolwide','grade-six','my-team'])});
test('multiple children produce one combined feed with relevant child labels',()=>{const out=matchRelevantAnnouncements(fixtures,scope([sixth,high]),now);assert.equal(out.find(x=>x.id==='grade-six').audienceLabel,'Child A');assert.equal(out.find(x=>x.id==='high-school').audienceLabel,'Child B');assert.deepEqual(out.find(x=>x.id==='schoolwide').relevantChildren.map(c=>c.label),['Child A','Child B']);assert.equal(out.filter(x=>x.id==='schoolwide').length,1)});
test('one item relevant to both children is deduplicated and labeled for both',()=>{const out=matchRelevantAnnouncements([message('both',{grades:['6','10']})],scope([sixth,high]),now);assert.equal(out.length,1);assert.equal(out[0].audienceLabel,'Child A · Child B')});
test('class and team membership are exact identifiers, not grade-name guesses',()=>{const items=[message('class',{classIds:['class-6a']}),message('wrong-class',{classIds:['class-6b']}),message('grade-sixteen',{grades:['16']})];assert.deepEqual(matchRelevantAnnouncements(items,scope(),now).map(x=>x.id),['class'])});
test('unknown school, cross-school and unknown audiences produce no relevance results',()=>{assert.deepEqual(matchRelevantAnnouncements(fixtures,{},now),[]);assert.deepEqual(matchRelevantAnnouncements([message('other',{schoolwide:true},{schoolId:'different-school'}),message('unknown',{})],scope(),now),[])});
test('expired, future and invalid-date items are excluded',()=>{const items=[message('expired',{schoolwide:true},{expiresAt:now}),message('bad-expiry',{schoolwide:true},{expiresAt:'invalid'}),message('future',{schoolwide:true},{publishedAt:'2026-11-01T00:00:00Z'})];assert.deepEqual(matchRelevantAnnouncements(items,scope(),now),[]);assert.deepEqual(matchRelevantAnnouncements(fixtures,scope(),'invalid'),[])});

test('student-specific notices match only household children and keep child labels',()=>{const items=[message('for-a',{studentIds:['synthetic-child-a']}),message('for-b',{studentIds:['synthetic-child-b']}),message('not-our-child',{studentIds:['synthetic-child-c']})];const out=matchRelevantAnnouncements(items,scope([sixth,high]),now);assert.deepEqual(out.map(x=>[x.id,x.audienceLabel]),[['for-a','Child A'],['for-b','Child B']]);assert.deepEqual(matchRelevantAnnouncements(items,scope([sixth]),now).map(x=>x.id),['for-a']);});

test('schoolwide source copies are deduplicated by stable message ID across siblings',()=>{const item=message('same-school-notice',{schoolwide:true});const out=matchRelevantAnnouncements([item,item],scope([sixth,high]),now);assert.equal(out.length,1);assert.deepEqual(out[0].relevantChildren.map(c=>c.label),['Child A','Child B']);});
