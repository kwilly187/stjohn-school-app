import Link from 'next/link';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import styles from './home.module.css';
import DailyScriptureCard from './daily-scripture-card';
export const dynamic='force-dynamic';

export default async function Today(){return <div className={styles.home}>
  <header className={styles.heading}><div><span className={styles.kicker}>ST. JOHN LUTHERAN SCHOOL</span><h1>St. John Parent Portal</h1><p>Calendars, school accounts and contacts for St. John families.</p><Link href="/faq" className={styles.faq}>Parent FAQ</Link></div><div className={styles.campus}><img src="/stjohn-church.png" alt="St. John church on the school campus" width="414" height="276"/></div></header>
  <section className={styles.tasks} aria-labelledby="home-tasks-heading">
    <div className={styles.sectionHeading}><h2 id="home-tasks-heading">Everyday essentials</h2></div>
    <nav className={styles.taskGrid} aria-label="Everyday school tasks">
      <Link href="/lunch"><span className={styles.taskIcon}><Icon name="lunch"/></span><span><strong>Lunch</strong><span>Nutrislice & PaySchools</span></span></Link>
      <Link href="/athletics"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>Athletics</strong><span>Saints teams & eligibility forms</span></span></Link>
      <Link href="/resources#school-store"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>School store</strong><span>BSN spirit wear & FlynnO’Hara uniforms</span></span></Link>
      <Link href="/resources"><span className={styles.taskIcon}><Icon name="resources"/></span><span><strong>Resources</strong><span>Tuition, aftercare & school forms</span></span></Link>
    </nav>
  </section>
  <div className={styles.overview}>
    <div className={styles.dates}><Suspense fallback={<p className={styles.loading} role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={2} title="Upcoming at St. John" featured/></Suspense></div>
    <aside className={styles.familyPanel}><h2 className={styles.familyTitle}>Your family</h2>
      <Link href="/students" className="home-family">
        <span className={styles.portrait} aria-hidden="true">{profiles.length===1?(profiles[0].photo?<img src={profiles[0].photo} alt="" width="44" height="44"/>:profiles[0].name[0]):<Icon name="people"/>}</span>
        <span><strong>{profiles.length===1?profiles[0].name:'My students'}</strong><span>{profiles.length===1?`Grade ${profiles[0].grade} · Student overview`:'Student overview'}</span></span>
      </Link>
      <div className={styles.familyLinks}><Link href="/pickup"><Icon name="clock"/>Pickup help</Link><Link href="/staff?contacts=saved"><Icon name="updates"/>Saved contacts</Link></div>
    </aside>
  </div>
  <DailyScriptureCard initialDate={new Date().toISOString()}/>
  <section className={styles.contact} aria-label="School contacts"><div><Icon name="people"/><div><h2>St. John contacts</h2><p>Teachers, staff and the school office.</p></div></div><Link href="/updates">School contacts</Link></section>
</div>}
