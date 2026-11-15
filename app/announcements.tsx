import {getParentAction} from './parent-actions/actions.mjs';
import StudentAnnouncements from './student-announcements';
import {school} from './school-data.mjs';
import {announcementFeed,selectAnnouncements} from './announcements-data.mjs';
import styles from './announcements.module.css';
export default function Announcements({scope='school',grades=[]}:{scope?:'school'|'grades',grades?:number[]}){
 const {status,items}=selectAnnouncements(announcementFeed,{scope:scope==='grades'?'student':scope,grades});
 if(scope==='grades')return <StudentAnnouncements status={status} items={items}/>;
 const title='Important announcements';
 return <section className={styles.section} aria-labelledby={`${scope}-announcements`}>
  <div className={styles.heading}><h2 id={`${scope}-announcements`}>{title}</h2><a href={school.portal}>Open Alma</a></div>
  {status!=='connected'?<p className={styles.empty}>Read {scope==='school'?'school announcements':'your student’s grade announcements'} in your school account.</p>:items.length?items.map((item:{id:string,title:string,body:string,publishedAt:string,important?:boolean,actionId?:string})=><article className={styles.notice} key={item.id}>
   <div className={styles.meta}>{item.important&&<span>Important</span>}<time dateTime={item.publishedAt}>{new Date(item.publishedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'})}</time></div>
   <h3>{item.title}</h3><p>{item.body}</p>{getParentAction(item.actionId)&&<a className={styles.action} href={getParentAction(item.actionId)!.href}>{getParentAction(item.actionId)!.label}</a>}
  </article>):<p className={styles.empty}>{scope==='school'?'No current important announcements.':grades.length?'No current announcements for these grades.':'Choose a student to view grade announcements.'}</p>}
 </section>
}
