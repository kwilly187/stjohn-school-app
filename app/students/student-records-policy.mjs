const keys=['assignments','grades','teams','announcements'];
const inactive=new Set(['draft','withdrawn','deleted','inactive','completed']);
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const text=(value,max=200)=>typeof value==='string'&&value.trim().length>0&&value.length<=max?value.trim():null;
function dateOnly(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const date=new Date(value+'T00:00:00Z');return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}
function instant(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)||!dateOnly(value.slice(0,10)))return false;
 const parts=value.match(/T(\d{2}):(\d{2}):(\d{2})/);if(+parts[1]>23||+parts[2]>59||+parts[3]>59)return false;
 const offset=value.match(/[+-](\d{2}):(\d{2})$/);if(offset&&(+offset[1]>23||+offset[2]>59))return false;
 return Number.isFinite(Date.parse(value));
}
function record(key,item,now){
 const id=text(item.id,128),studentId=text(item.studentId,128);if(!id||!studentId)return null;
 const base={id,studentId};
 if(key==='assignments'){
  const title=text(item.title),course=text(item.course);if(!title||!course||(!dateOnly(item.dueAt)&&!instant(item.dueAt)))return null;
  return {...base,title,course,dueAt:item.dueAt};
 }
 if(key==='grades'){
  const course=text(item.course),value=text(item.value,80);if(!course||!value||!instant(item.reportedAt)||Date.parse(item.reportedAt)>now)return null;
  return {...base,course,value,reportedAt:item.reportedAt};
 }
 if(key==='teams'){
  const name=text(item.name),season=item.season===undefined?undefined:text(item.season,100);if(!name||season===null)return null;
  return {...base,name,...(season?{season}:{})};
 }
 const title=text(item.title),body=text(item.body,10000);if(!title||!body||!instant(item.publishedAt))return null;
 if(item.expiresAt!==undefined&&(!instant(item.expiresAt)||Date.parse(item.expiresAt)<=Date.parse(item.publishedAt)))return null;
 if(Date.parse(item.publishedAt)>now||(item.expiresAt!==undefined&&Date.parse(item.expiresAt)<=now))return false;
 return {...base,title,body,publishedAt:item.publishedAt,...(item.expiresAt?{expiresAt:item.expiresAt}:{})};
}
/**
 * Display validation/narrowing ONLY, never guardian authorization. A trusted server
 * must authenticate and enforce school, guardian, student and field permissions
 * before constructing this payload. No private source is connected by this helper.
 * @param {unknown} payload
 * @param {string[]} selectedIds
 * @param {Date|string|number} [now]
 * @returns {import('./student-records.types').NormalizedStudentSection[]}
 */
export function normalizeStudentSections(payload,selectedIds,now=new Date()){
 const at=new Date(now).getTime();const selected=new Set(Array.isArray(selectedIds)?selectedIds.filter(id=>text(id,128)===id):[]);
 return keys.map(key=>{
  const empty=status=>({key,status,retrievedAt:null,items:[]});
  const section=object(payload)?payload[key]:undefined;
  if(section===undefined||section?.status==='not-connected')return empty('not-connected');
  if(!object(section)||section.status!=='ready'||!instant(section.retrievedAt)||!Number.isFinite(at)||Date.parse(section.retrievedAt)>at||!Array.isArray(section.items)||section.items.length>1000)return empty('unavailable');
  const items=[],seen=new Set();
  for(const item of section.items){
   // Ignore records belonging to unselected children without exposing their fields.
   if(!selected.size)continue;
   if(!object(item)||!text(item.studentId,128))return empty('unavailable');
   if(!selected.has(item.studentId))continue;
   if(inactive.has(item.status))continue;
   if(item.status!==(key==='announcements'?'published':'active'))return empty('unavailable');
   const normalized=record(key,item,at);if(normalized===false)continue;if(!normalized)return empty('unavailable');
   const identity=normalized.studentId+'\u0000'+normalized.id;if(seen.has(identity))return empty('unavailable');seen.add(identity);items.push(normalized);
  }
  return {key,status:'ready',retrievedAt:section.retrievedAt,items};
 });
}
