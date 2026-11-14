import Link from 'next/link';
import FamilyNotices from './family-notices';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import styles from './home.module.css';
import DailyScriptureCard from './daily-scripture-card';
export const dynamic='force-dynamic';
export default async function Today(){return <div className={styles.home}>
 <header className={styles.heading}><div><span className={styles.kicker}>ST. JOHN LUTHERAN SCHOOL</span><h1>St. John Parent Portal</h1><p>School life. Within reach.</p></div><div className={styles.campus}><img src="/stjohn-church.png" alt="St. John church on the school campus" width="414" height="276"/></div></header>
 <Link href="/search" className={styles.search}><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><span>Find what you need</span><span>Search</span></Link>
 <FamilyNotices/>
 <div className={styles.overview}>
  <div className={styles.dates}><Suspense fallback={<p className={styles.loading} role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={2} title="Upcoming at St. John" featured/></Suspense></div>
  <aside className={styles.actions} aria-label="Parent actions"><span className={styles.actionLabel}>HOW CAN WE HELP?</span><h2>A few things<br/>made simpler.</h2><Link href="/parent-actions" className={styles.actionPrimary}><Icon name="file"/><span>Parent actions<small>Payments, forms & registration</small></span></Link><Link href="/staff?contacts=saved"><Icon name="people"/><span>Saved contacts</span></Link><Link href="/faq" className={styles.faq}><Icon name="book"/><span>Parent FAQ</span></Link></aside>
 </div>
 <section className={styles.tasks} aria-labelledby="home-tasks-heading"><div className={styles.sectionHeading}><span className={styles.kicker}>THE SCHOOL DAY</span><h2 id="home-tasks-heading">Everyday essentials</h2></div>
 <nav className={styles.taskGrid} aria-label="Everyday school tasks">
 <Link href="/lunch"><span className={styles.taskIcon}><Icon name="lunch"/></span><span><strong>Lunch</strong><span>Nutrislice & PaySchools</span></span></Link>
 <Link href="/athletics"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>Athletics</strong><span>Saints teams & eligibility forms</span></span></Link>
 <Link href="/store"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>School store</strong><span>Saints spirit wear & family essentials</span></span></Link>
 <Link href="/resources"><span className={styles.taskIcon}><Icon name="resources"/></span><span><strong>Resources</strong><span>Tuition, aftercare & school forms</span></span></Link>
 </nav></section>
 <DailyScriptureCard initialDate={new Date().toISOString()}/>
 <section className={styles.contact} aria-label="School contacts"><div><Icon name="people"/><div><h2>St. John contacts</h2><p>Teachers, staff and the school office.</p></div></div><Link href="/updates">School contacts</Link></section>
 </div>}
