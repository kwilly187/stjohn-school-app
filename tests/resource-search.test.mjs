import test from 'node:test';
import assert from 'node:assert/strict';
import {resources} from '../app/school-data.mjs';
import {searchResources,nativeResourceActions} from '../app/resources/resource-search.mjs';
import {readFileSync} from 'node:fs';
test('parents can find provider destinations using everyday tasks',()=>{
 for(const [term,id] of [['homework','alma'],['teacher','staff'],['after school','aftercare'],['supply list','supplies'],['clothing rules','dress-code'],['food payment','lunch-account']])assert.ok(searchResources(resources,term).some(item=>item.id===id),term);
});
test('resource search is case-insensitive, handles provider punctuation and returns no invented links',()=>{
 assert.ok(searchResources(resources,'SAINTS').some(item=>item.id==='spirit'));
 assert.deepEqual(searchResources(resources,'imaginary destination'),[]);
 assert.equal(searchResources(resources,'  '),resources);
 const before=JSON.stringify(resources);searchResources(resources,'school');assert.equal(JSON.stringify(resources),before);
});
test('resource finder preserves browse mode and offers recovery when searches are empty',()=>{
 const ui=readFileSync(new URL('../app/resources/resource-finder.tsx',import.meta.url),'utf8');
 for(const value of ['aria-controls="resource-results"','aria-live="polite"','Show all resources','Contact the school',':children'])assert.ok(ui.includes(value));
 assert.doesNotMatch(ui,/localStorage|fetch\(/);
});

test('calendar and pickup help searches stay in the app with truthful labels',()=>{
 const entries=[...resources,...nativeResourceActions];
 assert.equal(searchResources(entries,'calendar').find(item=>item.id==='calendar').appPath,'/calendar');
 const pickup=searchResources(entries,'pickup')[0];assert.equal(pickup.appPath,'/pickup');assert.match(pickup.detail,/School office/);
});

test('store search uses native parent portal navigation',()=>{const result=searchResources(resources,'store').find(item=>item.id==='spirit');assert.equal(result.appPath,'/store');assert.equal(result.url,'/store')});
