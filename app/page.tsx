import CommunitySurprise from './community-surprise';
import Link from 'next/link';
import HomeSearch from './search/home-search';
import FamilyNotices from './family-notices';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import styles from './home.module.css';
import DailyScriptureCard from './daily-scripture-card';
export const dynamic='force-dynamic';
export default async function Today(){return <div className={styles.home}>
 <header className={styles.heading}><div><h1>St. John Parent Portal</h1><p>Your school day, in one place.</p></div></header>
 <HomeSearch/>
 <DailyScriptureCard initialDate={new Date().toISOString()} compact/>
 <FamilyNotices/>
 <div className={styles.overview}>
  <div className={styles.dates}><Suspense fallback={<p className={styles.loading} role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={2} title="Upcoming at St. John" featured/></Suspense></div>

 </div>
 <section className={styles.tasks} aria-labelledby="home-tasks-heading"><div className={styles.sectionHeading}><h2 id="home-tasks-heading">Everyday essentials</h2></div>
 <nav className={styles.taskGrid} aria-label="Everyday school tasks">
 <Link href="/lunch"><span className={styles.taskIcon}><Icon name="lunch"/></span><span><strong>Lunch</strong><span>Nutrislice & PaySchools</span></span></Link>
 <Link href="/athletics"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>Athletics</strong><span>Saints teams & eligibility forms</span></span></Link>
 <Link href="/pickup"><span className={styles.taskIcon}><Icon name="clock"/></span><span><strong>Pickup</strong><span>Dismissal & transportation help</span></span></Link>
 <Link href="/resources"><span className={styles.taskIcon}><Icon name="resources"/></span><span><strong>Resources</strong><span>Tuition, aftercare & school forms</span></span></Link>
 </nav></section>
 <section className={styles.community} aria-labelledby="community-heading">
  <div className={styles.communityBanner}>
   <img className={styles.communityPhoto} src="/campus/courtyard.webp" alt="" width="438" height="288" loading="lazy"/>
   <div className={styles.communityIntro}><CommunitySurprise className={styles.communityCrest}/><div><h2 id="community-heading">Saints Community</h2><p>Stay connected. Get involved. Show your school spirit.</p></div></div>
  </div>
  <nav className={styles.communityLinks} aria-label="Saints Community">
   <Link href="/calendar"><Icon name="calendar"/><span><strong>School events</strong><span>See what's coming up</span></span></Link>
   <Link href="/parent-actions?category=Get%20involved"><Icon name="heart"/><span><strong>Get involved</strong><span>Volunteer & support St. John</span></span></Link>
   <Link href="/store"><Icon name="shirt"/><span><strong>The Saints Store</strong><span>Explore school spirit wear</span></span></Link>
  </nav>
 </section>
 <aside className={styles.actions} aria-label="Parent actions"><h2>Parent actions</h2><Link href="/parent-actions" className={styles.actionPrimary}><Icon name="file"/><span>Payments, forms & registration</span></Link><Link href="/staff?contacts=saved"><Icon name="people"/><span>Saved contacts</span></Link><Link href="/faq" className={styles.faq}><Icon name="book"/><span>Parent FAQ</span></Link><Link href="/updates"><Icon name="people"/><span>School contacts</span></Link></aside>
 </div>}
