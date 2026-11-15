import {parentActions} from '../parent-actions/actions.mjs';
import {faqItems} from '../faq/faq-data.mjs';
import {resources} from '../school-data.mjs';
import {staffDirectory} from '../staff/staff-data.mjs';
const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const searchKinds=['All','Actions','Answers','Contacts','Resources'];
export const parentSearchIndex=[
 ...parentActions.map(item=>({id:'action:'+item.id,kind:'Actions',title:item.title,description:item.detail,href:item.href,label:item.label,keywords:item.category})),
 ...faqItems.map(item=>({id:'answer:'+item.id,kind:'Answers',title:item.question,description:item.answer,href:item.action.href,label:item.action.label,keywords:item.keywords})),
 ...resources.map(item=>({id:'resource:'+item.id,kind:'Resources',title:item.title,description:item.detail,href:item.appPath||item.url,label:'Open resource',keywords:item.group})),
 ...staffDirectory.map(item=>({id:'contact:'+item.id,kind:'Contacts',title:item.name,description:item.roles.map(role=>role.role+' · '+role.department).join('; '),href:'/staff?q='+encodeURIComponent(item.name),label:'View contact',keywords:'teacher staff contact'})),
];
export function searchParentPortal(query='',kind='All'){
 const words=normalize(String(query).slice(0,120)).split(' ').filter(Boolean);
 if(!words.length)return [];
 const selected=searchKinds.includes(kind)?kind:'All';
 return parentSearchIndex.filter(item=>(selected==='All'||item.kind===selected)&&words.every(word=>normalize(item.title+' '+item.description+' '+item.keywords).includes(word))).map(item=>({item,score:words.reduce((score,word)=>score+(normalize(item.title).includes(word)?4:1),0)})).sort((a,b)=>b.score-a.score||searchKinds.indexOf(a.item.kind)-searchKinds.indexOf(b.item.kind)||a.item.title.localeCompare(b.item.title)).map(result=>result.item);
}
