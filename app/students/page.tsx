import Link from 'next/link';
import {Suspense} from 'react';
import {school} from '../school-data.mjs';
import {sampleStudents, sampleNotices, selectSampleStudents, sampleFamilyFeed} from './sample-family.mjs';
import styles from './students.module.css';
import PublicDates from '../public-dates';

export const metadata = {title:'My Students'};
type SampleNotice = typeof sampleNotices[number] & {relevantStudents: typeof sampleStudents; schoolwide: boolean};

export default async function Students({searchParams}:{searchParams:Promise<{student?:string|string[],mode?:string|string[]}>}) {
  const {student,mode} = await searchParams;
  const examples=mode==='examples';
  const selection = student === undefined ? 'all' : typeof student === 'string' ? student : 'invalid';
  const students = selectSampleStudents(selection);
  const notices = sampleFamilyFeed(sampleNotices, students);
  const selected = students.length === 1 ? students[0] : null;
  return <div className={styles.page}>
    <Link className={styles.back} href="/updates">← School updates</Link>
    <header className={styles.heading}>
      <span className={styles.eyebrow}>YOUR FAMILY, AT A GLANCE</span>
      <h1>My Students</h1>
      <p>Updates for your children, together or one at a time.</p>
    </header>
    <nav className={styles.selector} aria-label="Choose a sample student">
      <Link href={examples?'/students?mode=examples':'/students'} scroll={false} aria-current={selection === 'all' ? 'page' : undefined} className={styles.choice}>
        <span className={styles.avatar} aria-hidden="true">2</span><span><strong>All My Students</strong><span>Both children, one view</span></span>
      </Link>
      {sampleStudents.map(child => <Link key={child.id} href={`/students?student=${child.id}${examples?'&mode=examples':''}`} scroll={false} aria-current={selection === child.id ? 'page' : undefined} className={styles.choice}>
        <span className={styles.avatar} aria-hidden="true">{child.name[0]}</span><span><strong>{child.name}</strong><span>Grade {child.grade}{child.id === 'taylor-example' ? ' · Sample sibling' : ''}</span></span>
      </Link>)}
    </nav>
    {!examples&&students.length>0&&<Suspense fallback={<p role="status">Loading school dates…</p>}><PublicDates grades={students.map(child=>child.grade)} title={selected?`School dates for ${selected.name}`:'School dates for your family'}/></Suspense>}
    {!examples&&students.length===0&&<p>That student isn’t available. <Link href="/students">View all students</Link></p>}
    {examples&&<section aria-labelledby="family-feed-heading">
      <div className={styles.feedHeading}><div><span className={styles.eyebrow}>Sample notices</span><h2 id="family-feed-heading">{selected ? `For ${selected.name}` : students.length ? 'For your family' : 'Choose a sample student'}</h2></div>{students.length > 0 && <span className={styles.count}>{notices.length} examples</span>}</div>
      {students.length > 0 ? <>
        <p className={styles.feedIntro}>{selected ? `Schoolwide, grade and group updates relevant to ${selected.name}, plus any notes addressed just to this student.` : 'Schoolwide updates appear once. Each example is labeled so you can see who it belongs to.'}</p>
        <div className={styles.feed}>{notices.map((notice:SampleNotice) => <article className={styles.notice} key={notice.id}>
          <div className={styles.noticeMeta}><span>{notice.category}</span><span className={styles.example}>Example</span></div>
          <h3>{notice.title}</h3><p>{notice.body}</p>
          <div className={styles.badges} aria-label="Applies to">{notice.schoolwide ? <span>{selected ? `${selected.name} · Schoolwide` : 'Both students · Schoolwide'}</span> : notice.relevantStudents.map((child:typeof sampleStudents[number]) => <span key={child.id}>{child.name} · Grade {child.grade}</span>)}</div>
        </article>)}</div>
      </> : <div className={styles.empty}><p>That sample student isn’t available. No student updates are shown.</p><Link href="/students">View All My Students →</Link></div>}
    </section>}
    <p className={styles.feedIntro}>{examples?<Link href="/students">Return to school dates →</Link>:<Link href="/students?mode=examples">View sample announcement examples →</Link>}</p>
    <div className={styles.closing}><div><h2>School announcements</h2><p>Read current messages from school in {school.portalLabel}.</p></div><Link href="/updates">View school updates →</Link></div>
    <Link className={styles.back} href="/">← Back to Today</Link>
  </div>;
}
