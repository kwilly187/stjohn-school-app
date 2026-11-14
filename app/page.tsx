import Link from 'next/link';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import styles from './home.module.css';
export const dynamic='force-dynamic';

export default async function Today(){return <div className={styles.home}>
  <header className={styles.heading}><div><span className={styles.kicker}>SAINTS PARENT</span><h1>School life, simplified.</h1><p>Your family’s everyday connection to St. John.</p></div><Link href="/faq" className={styles.faq}>Parent FAQ</Link></header>
  <div className={styles.overview}>
    <div className={styles.dates}><Suspense fallback={<p className={styles.loading} role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={2} title="Key school dates" featured/></Suspense></div>
    <aside className={styles.familyPanel}><h2 className={styles.familyTitle}>Your family</h2>
      <Link href="/students" className="home-family">
        <span className={styles.portrait} aria-hidden="true">{profiles.length===1?(profiles[0].photo?<img src={profiles[0].photo} alt="" width="44" height="44"/>:profiles[0].name[0]):<Icon name="people"/>}</span>
        <span><strong>{profiles.length===1?profiles[0].name:'My students'}</strong><span>{profiles.length===1?`Grade ${profiles[0].grade} · Student overview`:'Student overview'}</span></span>
      </Link>
      <div className={styles.familyLinks}><Link href="/pickup"><Icon name="clock"/>Pickup help</Link><Link href="/staff?contacts=saved"><Icon name="updates"/>Saved contacts</Link></div>
    </aside>
  </div>
  <section className={styles.tasks} aria-labelledby="home-tasks-heading">
    <div className={styles.sectionHeading}><h2 id="home-tasks-heading">School essentials</h2><span>The everyday, made easy</span></div>
    <nav className={styles.taskGrid} aria-label="Everyday school tasks">
      <Link href="/lunch"><span className={styles.taskIcon}><Icon name="lunch"/></span><span><strong>Lunch</strong><span>Menu & meal account</span></span></Link>
      <Link href="/athletics"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>Athletics</strong><span>Sports, forms & participation</span></span></Link>
      <Link href="/resources#school-store"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>School store</strong><span>Spirit wear & uniforms</span></span></Link>
      <Link href="/resources"><span className={styles.taskIcon}><Icon name="resources"/></span><span><strong>Resources</strong><span>Accounts, forms & dress code</span></span></Link>
    </nav>
  </section>
  <section className={styles.contact} aria-label="School contacts"><div><Icon name="people"/><div><h2>Stay in touch</h2><p>Find a teacher or reach the school office.</p></div></div><Link href="/updates">School contacts</Link></section>
</div>}
