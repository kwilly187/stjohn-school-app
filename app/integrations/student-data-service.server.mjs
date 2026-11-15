// Server-only integration seam. No route uses this module until real authentication,
// guardian grants and school-approved provider adapters have been implemented.
import {validateConnectionReadiness} from './connection-contract.mjs';
import {normalizeStudentSections} from '../students/student-records-policy.mjs';
const mapping={assignments:'assignments',grades:'grades',teams:'memberships',announcements:'announcements'};
const validId=value=>typeof value==='string'&&value.trim()===value&&value.length>0&&value.length<=128;
/**
 * All callbacks and connections are supplied by trusted server code, never request JSON.
 * authenticate() resolves the session to {schoolId,guardianId}; authorizeStudents(scope)
 * must recheck active school/guardian grants and return {allowed:true,studentIds}.
 * The grant must include capabilitiesByStudent (student ID to allowed capability names).
 * Adapters also enforce provider field permissions and return the normalized section envelope.
 * This orchestrator is not an authentication implementation or vendor connection.
 */
export async function loadStudentData({requestedStudentIds,authenticate,authorizeStudents,connections={},adapters={},now=new Date(),timeoutMs=8000}){
 const deny=status=>({status,sections:[]});
 if(!Array.isArray(requestedStudentIds)||!requestedStudentIds.length||requestedStudentIds.length>20||!requestedStudentIds.every(validId)||new Set(requestedStudentIds).size!==requestedStudentIds.length)return deny('invalid-selection');
 if(typeof authenticate!=='function'||typeof authorizeStudents!=='function')return deny('sign-in-required');
 let identity;
 try{identity=await authenticate();}catch{return deny('sign-in-required');}
 if(!identity||!validId(identity.schoolId)||!validId(identity.guardianId))return deny('sign-in-required');
 const scope=Object.freeze({schoolId:identity.schoolId,guardianId:identity.guardianId,studentIds:Object.freeze([...requestedStudentIds])});
 let grant;
 try{grant=await authorizeStudents(scope);}catch{return deny('access-unavailable');}
 if(grant?.allowed!==true||!Array.isArray(grant.studentIds)||grant.studentIds.length!==scope.studentIds.length||new Set(grant.studentIds).size!==scope.studentIds.length||!scope.studentIds.every(id=>grant.studentIds.includes(id)))return deny('access-denied');
 const payload={};
 await Promise.all(Object.entries(mapping).map(async([key,capability])=>{
  const connection=connections[capability];
  if(connection?.schoolId!==scope.schoolId||!validateConnectionReadiness(connection,capability).ready||typeof adapters[capability]!=='function')return;
  const allowedStudents=scope.studentIds.filter(id=>Object.hasOwn(grant.capabilitiesByStudent||{},id)&&Array.isArray(grant.capabilitiesByStudent[id])&&grant.capabilitiesByStudent[id].includes(capability));
  if(!allowedStudents.length){payload[key]={status:'unavailable'};return;}
  const capabilityScope=Object.freeze({...scope,studentIds:Object.freeze(allowedStudents),capability});
  const controller=new AbortController();let timer;
  const deadline=Number.isFinite(timeoutMs)?Math.max(1,Math.min(timeoutMs,30000)):8000;
  try{
   const response=await Promise.race([
    Promise.resolve().then(()=>adapters[capability]({...capabilityScope,signal:controller.signal})),
    new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('timeout'));},deadline);})
   ]);
   // Normalize against the narrower field grant before merging with the selected family.
   payload[key]=normalizeStudentSections({[key]:response},allowedStudents,now).find(section=>section.key===key);
   // The final normalizer expects source status fields on each item. Preserve only the
   // allowed original records, not other children accidentally returned by a provider.
   if(payload[key].status==='ready')payload[key]={...response,items:response.items.filter(item=>allowedStudents.includes(item.studentId))};
  }catch{payload[key]={status:'unavailable'};}
  finally{clearTimeout(timer);}
 }));
 return {status:'authorized',sections:normalizeStudentSections(payload,[...scope.studentIds],now)};
}
