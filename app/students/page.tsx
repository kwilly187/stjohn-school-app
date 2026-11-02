import Link from 'next/link';
import {Suspense} from 'react';
import {profiles} from './profile-config.mjs';
import {resolveDashboardSelection,getStudentDashboard} from './dashboard-data.mjs';
import styles from './students.module.css';
import PublicDates from '../public-dates';
export const metadata={title:'My Students'};
export default async function Students({searchParams}:{searchParams:Promise<{student?:string|string[],mode?:string|string[]}>}){
 const {student}=await searchParams;
 const {selection,selected,valid}=resolveDashboardSelection(profiles,student);
 const sections=getStudentDashboard(selected);
 const copy:Record<string,{title:string,description:string,href?:string,action?:string}>={
  assignments:{title:'Upcoming assignments',description:'Assignments and due dates aren’t connected yet.'},
  grades:{title:'Current grades',description:'Class grades aren’t connected yet.'},
  teams:{title:'Teams & activities',description:'Student team and activity memberships aren’t connected yet.',href:'/athletics',action:'Explore school sports'},
  announcements:{title:'School updates',description:'Student-specific announcements aren’t connected yet.',href:'/updates',action:'Contact the school'}
 };
 return <div className={styles.page}>
 <Link className={styles.back} href="/">← Home</Link>
 <header className={styles.heading}><span className={styles.eyebrow}>YOUR SCHOOL DAY</span><h1>My Students</h1><p>Schoolwork, activities and updates for your family.</p></header>
 {profiles.length>0&&<nav className={styles.selector} aria-label="Choose a student">
 {profiles.length>1&&<Link href="/students" scroll={false} className={styles.choice} aria-current={selection==='all'?'page':undefined}><span className={styles.avatar} aria-hidden="true">{profiles.length}</span><span><strong>All My Students</strong><span>Your family, together</span></span></Link>}
 {profiles.map(child=><Link key={child.id} href={`/students?student=${child.id}`} scroll={false} className={styles.choice} aria-current={(selection===child.id||(profiles.length===1&&selection==='all'))?'page':undefined}><span className={styles.avatar} aria-hidden="true">{child.photo?<img src={child.photo} alt=""/>:child.name[0]}</span><span><strong>{child.name}</strong><span>Grade {child.grade}</span></span></Link>)}
 </nav>}
 {valid&&<div className={styles.dashboard} aria-label="Student overview">
 {sections.map(section=><section key={section.key} className={styles.section} aria-labelledby={`student-${section.key}`}>
 <div className={styles.sectionTop}><span className={styles.availability}>Not connected</span></div>
 <h2 id={`student-${section.key}`} className={styles.sectionTitle}>{copy[section.key].title}</h2>
 <p className={styles.sectionCopy}>{copy[section.key].description}</p>
 {copy[section.key].href&&<Link className={styles.secondaryLink} href={copy[section.key].href!}>{copy[section.key].action}</Link>}
 </section>)}
 </div>}
 {valid?<Suspense fallback={<p role="status">Loading school dates…</p>}><PublicDates origin="students" returnStudent={selection==='all'?undefined:selection} grades={selected.map(child=>child.grade)} title={selected.length===1?`School dates for ${selected[0].name}`:'School dates'}/></Suspense>:<p>That student isn’t available. <Link href="/students">Return to My Students</Link></p>}

 </div>;
}
