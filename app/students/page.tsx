import Link from 'next/link';
import {Suspense} from 'react';
import {profiles,selectProfiles} from './profile-config.mjs';
import styles from './students.module.css';
import PublicDates from '../public-dates';
export const metadata={title:'My Students'};
export default async function Students({searchParams}:{searchParams:Promise<{student?:string|string[],mode?:string|string[]}>}){
 const {student}=await searchParams;
 const selection=student===undefined?'all':typeof student==='string'?student:'invalid';
 const selected=selectProfiles(selection);
 const valid=selection==='all'||selected.length>0;
 return <div className={styles.page}>
 <Link className={styles.back} href="/updates">← School updates</Link>
 <header className={styles.heading}><span className={styles.eyebrow}>YOUR SCHOOL DAY</span><h1>My Students</h1><p>School dates that matter to your family.</p></header>
 {profiles.length>0&&<nav className={styles.selector} aria-label="Choose a student">
 {profiles.length>1&&<Link href="/students" scroll={false} className={styles.choice} aria-current={selection==='all'?'page':undefined}><span className={styles.avatar} aria-hidden="true">{profiles.length}</span><span><strong>All My Students</strong><span>Your family, together</span></span></Link>}
 {profiles.map(child=><Link key={child.id} href={`/students?student=${child.id}`} scroll={false} className={styles.choice} aria-current={selected.some(item=>item.id===child.id)?'page':undefined}><span className={styles.avatar} aria-hidden="true">{child.photo?<img src={child.photo} alt=""/>:child.name[0]}</span><span><strong>{child.name}</strong><span>Grade {child.grade}</span></span></Link>)}
 </nav>}
 {valid?<Suspense fallback={<p role="status">Loading school dates…</p>}><PublicDates origin="students" returnStudent={selection==='all'?undefined:selection} grades={selected.map(child=>child.grade)} title={selected.length===1?`School dates for ${selected[0].name}`:'School dates'}/></Suspense>:<p>That student isn’t available. <Link href="/students">Return to My Students</Link></p>}
 <div className={styles.closing}><div><h2>School updates</h2><p>School dates and contacts.</p></div><Link href="/updates">View school updates →</Link></div>
 <Link className={styles.back} href="/">← Back to Today</Link>
 </div>;
}
