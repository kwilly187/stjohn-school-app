import test from 'node:test';
import assert from 'node:assert/strict';
import {loadStudentData} from '../app/integrations/student-data-service.server.mjs';
const now='2026-11-14T10:00:00Z';
const ready=cap=>({schoolId:'school',state:'verified',schoolApproval:true,activated:true,verifiedReadCapabilities:[cap]});
const defaults=()=>({requestedStudentIds:['child-a'],authenticate:async()=>({schoolId:'school',guardianId:'parent-a'}),authorizeStudents:async()=>({allowed:true,studentIds:['child-a'],capabilitiesByStudent:{'child-a':['assignments','grades','memberships','announcements']}}),now});
const grade=(studentId='child-a')=>({id:'g',studentId,status:'active',course:'Math',value:'A',reportedAt:'2026-11-13T10:00:00Z'});
const envelope=items=>({status:'ready',retrievedAt:now,items});
test('no adapter read occurs without current identity and exact guardian grants',async()=>{
 let calls=0;const adapters={grades:async()=>{calls++;return envelope([grade()]);}};
 for(const patch of [{authenticate:undefined},{authenticate:async()=>null},{authorizeStudents:async()=>({allowed:true,studentIds:['child-b']})},{requestedStudentIds:['child-a','child-a']},{authorizeStudents:async()=>{throw Error('private detail')}}]){
  const result=await loadStudentData({...defaults(),connections:{grades:ready('grades')},adapters,...patch});assert.notEqual(result.status,'authorized');assert.deepEqual(result.sections,[]);
 }assert.equal(calls,0);
});
test('school/capability readiness is checked and unconfigured areas stay disconnected',async()=>{
 let calls=0;const result=await loadStudentData({...defaults(),connections:{grades:{...ready('grades'),schoolId:'other'}},adapters:{grades:async()=>{calls++;}}});
 assert.equal(calls,0);assert.ok(result.sections.every(s=>s.status==='not-connected'));
});
test('authorized adapter gets scoped identity; selected records are validated and unrelated children omitted',async()=>{
 let scope;const result=await loadStudentData({...defaults(),connections:{grades:ready('grades')},adapters:{grades:async s=>{scope=s;return envelope([grade(),grade('child-b')]);}}});
 assert.equal(scope.schoolId,'school');assert.equal(scope.guardianId,'parent-a');assert.deepEqual(scope.studentIds,['child-a']);assert.ok(Object.isFrozen(scope.studentIds));
 const grades=result.sections.find(s=>s.key==='grades');assert.equal(grades.status,'ready');assert.equal(grades.items.length,1);assert.equal(grades.items[0].studentId,'child-a');
});
test('provider errors are isolated and details never reach the parent payload',async()=>{
 const result=await loadStudentData({...defaults(),connections:{grades:ready('grades'),memberships:ready('memberships')},adapters:{grades:async()=>{throw Error('secret credential');},memberships:async()=>envelope([{id:'t',studentId:'child-a',status:'active',name:'Soccer'}])}});
 assert.equal(result.sections.find(s=>s.key==='grades').status,'unavailable');assert.equal(result.sections.find(s=>s.key==='teams').items[0].name,'Soccer');assert.ok(!JSON.stringify(result).includes('secret'));
});
test('slow provider is aborted and becomes unavailable rather than blocking all data',async()=>{
 let signal;const result=await loadStudentData({...defaults(),timeoutMs:5,connections:{grades:ready('grades')},adapters:{grades:({signal:s})=>{signal=s;return new Promise(()=>{});}}});
 assert.equal(signal.aborted,true);assert.equal(result.sections.find(s=>s.key==='grades').status,'unavailable');
});

test('field grants narrow each provider read and discard unauthorized sibling records',async()=>{
 let ids;const result=await loadStudentData({...defaults(),requestedStudentIds:['child-a','child-b'],authorizeStudents:async()=>({allowed:true,studentIds:['child-a','child-b'],capabilitiesByStudent:{'child-a':['grades'],'child-b':['memberships']}}),connections:{grades:ready('grades')},adapters:{grades:async scope=>{ids=scope.studentIds;return envelope([grade(),grade('child-b')]);}}});
 assert.deepEqual(ids,['child-a']);assert.deepEqual(result.sections.find(s=>s.key==='grades').items.map(item=>item.studentId),['child-a']);
});
test('missing field permission never invokes a configured provider',async()=>{
 let called=false;const result=await loadStudentData({...defaults(),authorizeStudents:async()=>({allowed:true,studentIds:['child-a']}),connections:{grades:ready('grades')},adapters:{grades:async()=>{called=true;return envelope([grade()]);}}});
 assert.equal(called,false);assert.equal(result.sections.find(s=>s.key==='grades').status,'unavailable');
});
