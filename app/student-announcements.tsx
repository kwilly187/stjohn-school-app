'use client';
import {useState} from 'react';
import {school} from './school-data.mjs';
import {studentAnnouncementCategories,filterStudentAnnouncements} from './student-announcements-policy.mjs';
import styles from './announcements.module.css';
type Notice={id:string,title:string,body:string,publishedAt:string,important?:boolean,category?:string};
export default function StudentAnnouncements({items,status}:{items:Notice[],status:string}){
 const [category,setCategory]=useState('all');const [query,setQuery]=useState('');
 const filtered:Notice[]=filterStudentAnnouncements(items,category,query);
 return <section className={styles.section} aria-labelledby="student-announcements">
  <div className={styles.heading}><h2 id="student-announcements">Student announcements</h2><a href={school.portal}>Open Alma</a></div>
  <div className={styles.filters} role="group" aria-label="Announcement category">{studentAnnouncementCategories.map(([id,label])=><button type="button" key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{label}</button>)}</div>
  {status==='connected'&&<label className={styles.search}>Find an announcement<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search announcements"/></label>}
  <div aria-live="polite">{status!=='connected'?<p className={styles.empty}>Student updates aren’t connected yet. Check Alma or your school’s messages.</p>:filtered.length?filtered.map(item=><article className={styles.notice} key={item.id}><div className={styles.meta}>{item.important&&<span>Important</span>}<span>{studentAnnouncementCategories.find(([id])=>id===item.category)?.[1]||'School'}</span><time dateTime={item.publishedAt}>{new Date(item.publishedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/New_York'})}</time></div><h3>{item.title}</h3><p>{item.body}</p></article>):<p className={styles.empty}>No announcements match this filter.{(query||category!=='all')&&<button className={styles.reset} onClick={()=>{setQuery('');setCategory('all')}}>Clear filters</button>}</p>}</div>
 </section>
}
