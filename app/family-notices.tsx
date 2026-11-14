import {announcementFeed} from './announcements-data.mjs';
import {familyNotices} from './family-notices-policy.mjs';
import {profiles} from './students/profile-config.mjs';
import {school} from './school-data.mjs';
import styles from './family-notices.module.css';
type Notice={id:string,title:string,body:string,children:{id:string,name:string}[],dueAt:string|null,dateOnly:boolean,overdue:boolean,action?:{href:string,label:string}};
function NoticeCard({item}:{item:Notice}){return <article><div className={styles.meta}><span>{item.children.length?item.children.map(child=>child.name).join(', '):'Schoolwide'}</span>{item.dueAt&&<time dateTime={item.dueAt}>{item.overdue?'Past deadline · ':'Due '}{new Intl.DateTimeFormat('en-US',item.dateOnly?{month:'short',day:'numeric',timeZone:'UTC'}:{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:school.timeZone,timeZoneName:'short'}).format(new Date(item.dueAt))}</time>}</div><h3>{item.title}</h3><p>{item.body}</p><div className={styles.links}>{item.action&&<a href={item.action.href}>{item.action.label}</a>}<span>School announcement</span></div></article>};
export default function FamilyNotices(){
 const result:{status:string,attention:Notice[],updates:Notice[],optional:Notice[]}=familyNotices(announcementFeed,{children:profiles});
 if(result.status!=='connected')return <section className={styles.unavailable} aria-labelledby="family-updates-heading"><div><h2 id="family-updates-heading">Family updates</h2><p>Read school announcements and requests in Alma.</p></div><a href={school.portal}>Open Alma</a></section>;
 const groups=[{key:'attention',title:'Needs attention',items:result.attention},{key:'updates',title:'Family updates',items:result.updates},{key:'optional',title:'Optional involvement',items:result.optional}];
 return <div className={styles.groups}>{groups.filter(group=>group.items.length>0).map(group=><section key={group.key} className={group.key==='attention'?styles.attention:styles.section} aria-labelledby={'family-'+group.key}><h2 id={'family-'+group.key}>{group.title}</h2>{group.items.slice(0,3).map(item=><NoticeCard key={item.id} item={item}/>)}{group.items.length>3&&<details className={styles.more}><summary>Show {group.items.length-3} more</summary>{group.items.slice(3).map(item=><NoticeCard key={item.id} item={item}/>)}</details>}</section>)}{groups.every(group=>group.items.length===0)&&<section className={styles.section}><h2>Family updates</h2><p>No current published updates in this feed.</p><a href={school.portal}>Open Alma</a></section>}</div>;
}
