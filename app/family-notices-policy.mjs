import {selectAnnouncements} from './announcements-data.mjs';
import {getParentAction} from './parent-actions/actions.mjs';
/** Public feed only. Family membership must come from an authorized school adapter;
 * grade never implies class, team or club membership. Private records use a separate authorized service.
 * @param {any} feed
 * @param {{children?:Array<{id:string,name:string,grade:number,groupIds?:string[]}>,now?:Date|string}} options
 */
export function familyNotices(feed,{children=[],now=new Date()}={}){
 if(feed?.status!=='connected')return {status:'not-connected',attention:[],updates:[],optional:[]};
 const scoped=selectAnnouncements(feed,{scope:'student',grades:children.map(child=>child.grade),groupIds:children.flatMap(child=>Array.isArray(child.groupIds)?child.groupIds:[]),now});
 const result={status:'connected',attention:[],updates:[],optional:[]};const seen=new Set();
 for(const item of scoped.items){
  if(seen.has(item.id))continue;seen.add(item.id);
  const relevant=children.filter(child=>item.audience==='school'||item.audience==='grades'&&item.grades?.includes(child.grade)||item.audience==='groups'&&item.groupIds?.some(group=>child.groupIds?.includes(group)));
  const action=getParentAction(item.actionId);
  const dateOnly=typeof item.dueAt==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(item.dueAt)&&Number.isFinite(Date.parse(item.dueAt))&&new Date(item.dueAt).toISOString().slice(0,10)===item.dueAt;
  const due=dateOnly?item.dueAt:typeof item.dueAt==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(item.dueAt)&&Number.isFinite(Date.parse(item.dueAt))?item.dueAt:null;
  const optional=item.optional===true||['fundraising','volunteering','giving'].includes(item.category);
  const notice={...item,children:relevant.map(child=>({id:child.id,name:child.name})),action,dueAt:due,dateOnly,overdue:!!due&&(dateOnly?due<new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now)):Date.parse(due)<new Date(now).getTime())};
  if(optional)result.optional.push(notice);
  else if(item.requiresAction===true&&action)result.attention.push(notice);
  else result.updates.push(notice);
 }
 result.attention.sort((a,b)=>(a.dueAt?Date.parse(a.dueAt):Infinity)-(b.dueAt?Date.parse(b.dueAt):Infinity));
 return result;
}
