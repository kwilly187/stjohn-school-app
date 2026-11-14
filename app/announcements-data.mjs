/** Public, school-approved announcements only. Never place private student data here. */
export const announcementFeed = {status:'not-connected',items:[]};
/** Select explicitly published public notices. Presentation grades are not authorization.
 * @param {{status:string,items:Array<{id:string,title:string,body:string,status:string,visibility:string,audience:string,important?:boolean,publishedAt:string,expiresAt?:string,grades?:number[],groupIds?:string[],category?:string,actionId?:string}>}} feed
 * @param {{scope?:string,grades?:number[],groupIds?:string[],now?:Date|string}} options
 */
export function selectAnnouncements(feed,{scope='school',grades=[],groupIds=[],now=new Date()}={}){
 if(feed?.status!=='connected')return {status:'not-connected',items:[]};
 const clock=new Date(now).getTime();
 const items=(Array.isArray(feed.items)?feed.items:[]).filter(item=>{
  if(item.visibility!=='public'||item.status!=='published'||!item.id||!item.title||!item.body)return false;
  const published=Date.parse(item.publishedAt);if(!Number.isFinite(published)||published>clock)return false;
  if(item.expiresAt&&(!Number.isFinite(Date.parse(item.expiresAt))||Date.parse(item.expiresAt)<=clock))return false;
  if(scope==='school')return item.audience==='school'&&item.important===true;
  if(scope==='student'&&item.audience==='school')return true;
  if(scope==='student'&&item.audience==='groups')return Array.isArray(item.groupIds)&&item.groupIds.some(id=>groupIds.includes(id));
  return item.audience==='grades'&&Array.isArray(item.grades)&&item.grades.some(grade=>grades.includes(grade));
 }).sort((a,b)=>Number(b.important===true)-Number(a.important===true)||Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
 return {status:'connected',items};
}
