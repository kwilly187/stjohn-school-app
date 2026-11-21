import test from 'node:test';import assert from 'node:assert/strict';
import {matchDeviceActivity as match} from '../app/device-activity-matching.mjs';
import {getPublicDayActivities} from '../app/school-day-activities-data.mjs';
test('only published titles with explicit sport and usable scope match',()=>{
 for(const [title,result] of [['Beach Volleyball practice','beach-volleyball'],['Grades 5–6 Indoor Volleyball','indoor-56-volleyball'],['5/6 Girls Indoor Volleyball','indoor-56-volleyball'],['MS Track Meet','track'],['Grade 6 Track and Field','track'],['Girls Volleyball',null],['5/6 Volleyball',null],['Indoor Volleyball',null],['JV Beach Volleyball',null],['Varsity Track',null],['Track Meet',null],['Grade 8 Track',null],['7/8 Girls Indoor Volleyball',null],['5th/6th Grade Outdoor Volleyball',null],['Beach Volleyball 16U',null]])assert.equal(match(title,6),result,title);
 assert.equal(match('MS Track',5),null);assert.equal(match('Grade 7 Beach Volleyball',6),null);
});
test('public reads fixed to both feeds, only today or tomorrow, duplicate merge and incomplete status',async()=>{
 const now=new Date('2026-11-21T15:00:00Z'), calls=[];const row=(title,day,options={})=>({id:title,title,dayKeys:[day],allDay:true,start:day,startDay:day,location:null,...options});
 const result=await getPublicDayActivities(now,async({source,month})=>{calls.push([source,month]);return source==='athletics'?{status:'unavailable',events:[]}:{status:'ok',events:[row('Beach Volleyball','2026-11-21'),row('Beach Volleyball','2026-11-21'),row('MS Track','2026-11-23'),row('Volleyball','2026-11-21'),row('5/6 Indoor Volleyball','2026-11-22')]};});
 assert.deepEqual(calls,[['activities','2026-11'],['athletics','2026-11']]);assert.equal(result.complete,false);assert.deepEqual(result.events.map(({title,label})=>[title,label]),[['Beach Volleyball','Today'],['5/6 Indoor Volleyball','Tomorrow']]);
});
