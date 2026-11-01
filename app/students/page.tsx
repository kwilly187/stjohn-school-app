import Link from 'next/link';
import {school} from '../school-data.mjs';
import {sampleStudents, sampleNotices, selectSampleStudents, sampleFamilyFeed} from './sample-family.mjs';
import styles from './students.module.css';

export const metadata = {title:'My Students'};
type SampleNotice = typeof sampleNotices[number] & {relevantStudents: typeof sampleStudents; schoolwide: boolean};

export default async function Students({searchParams}:{searchParams:Promise<{student?:string|string[]}>}) {
  const {student} = await searchParams;
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
      <Link href="/students" scroll={false} aria-current={selection === 'all' ? 'page' : undefined} className={styles.choice}>
        <span className={styles.avatar} aria-hidden="true">2</span><span><strong>All My Students</strong><span>Both children, one view</span></span>
      </Link>
      {sampleStudents.map(child => <Link key={child.id} href={`/students?student=${child.id}`} scroll={false} aria-current={selection === child.id ? 'page' : undefined} className={styles.choice}>
        <span className={styles.avatar} aria-hidden="true">{child.name[0]}</span><span><strong>{child.name}</strong><span>Grade {child.grade}{child.id === 'taylor-example' ? ' · Sample sibling' : ''}</span></span>
      </Link>)}
    </nav>
    <section aria-labelledby="family-feed-heading">
      <div className={styles.feedHeading}><div><span className={styles.eyebrow}>Sample notices</span><h2 id="family-feed-heading">{selected ? `For ${selected.name}` : students.length ? 'For your family' : 'Choose a sample student'}</h2></div>{students.length > 0 && <span className={styles.count}>{notices.length} examples</span>}</div>
      {students.length > 0 ? <>
        <p className={styles.feedIntro}>{selected ? `Schoolwide, grade and group updates relevant to ${selected.name}, plus any notes addressed just to this student.` : 'Schoolwide updates appear once. Each example is labeled so you can see who it belongs to.'}</p>
        <div className={styles.feed}>{notices.map((notice:SampleNotice) => <article className={styles.notice} key={notice.id}>
          <div className={styles.noticeMeta}><span>{notice.category}</span><span className={styles.example}>Example</span></div>
          <h3>{notice.title}</h3><p>{notice.body}</p>
          <div className={styles.badges} aria-label="Applies to">{notice.schoolwide ? <span>{selected ? `${selected.name} · Schoolwide` : 'Both students · Schoolwide'}</span> : notice.relevantStudents.map((child:typeof sampleStudents[number]) => <span key={child.id}>{child.name} · Grade {child.grade}</span>)}</div>
        </article>)}</div>
      </> : <div className={styles.empty}><p>That sample student isn’t available. No student updates are shown.</p><Link href="/students">View All My Students →</Link></div>}
    </section>
    <div className={styles.closing}><div><h2>School announcements</h2><p>Read current messages from school in {school.portalLabel}.</p></div><Link href="/updates">View school updates →</Link></div>
    <Link className={styles.back} href="/">← Back to Today</Link>
  </div>;
}
