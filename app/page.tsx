import SchoolDayDate from './school-day-date';
import SchoolHeadsUp from './school-heads-up';
import SchoolWeather from './school-weather';
import CommunitySurprise from './community-surprise';
import Link from 'next/link';
import HomeSearch from './search/home-search';
import FamilyNotices from './family-notices';
import {Suspense} from 'react';
import SchoolDayPlan from './school-day-plan';
import {getLocalLinkedFamily,getPreviewDemoFamily,hasPreviewDemoConfig} from './linked-family.server.mjs';
import {headers} from 'next/headers';
import SchoolDayActivities from './school-day-activities';
import {getPublicDayActivities} from './school-day-activities-data.mjs';
import {getSchoolDayPlan,schoolHomeCalendar} from './school-day-plan-data.mjs';
import {getSchoolHeadsUp} from './school-heads-up-data.mjs';
import {Icon} from './components';
import styles from './home.module.css';
import DailyScriptureCard from './daily-scripture-card';
import PinnedShortcuts from './pinned-shortcuts';
import {school} from './school-data.mjs';
export const dynamic='force-dynamic';
export default async function Today(){
 const now=new Date();
 const initialDate=now.toISOString();
 const readCalendar=schoolHomeCalendar(now);
 const headsUp=getSchoolHeadsUp(now,readCalendar);
 const linkedStudents=hasPreviewDemoConfig()?getPreviewDemoFamily((await headers()).get('host')):getLocalLinkedFamily();
 const dayPlan=getSchoolDayPlan(now,readCalendar,headsUp);
 return <div className={styles.home}>
 <header className={styles.heading}><div><h1>St. John Parent Portal</h1><div className={styles.schoolDay}><SchoolDayDate initialDate={initialDate}/><Suspense fallback={null}><SchoolWeather/></Suspense></div><Suspense fallback={null}><SchoolHeadsUp result={headsUp}/></Suspense></div></header>
 <HomeSearch/>
 <DailyScriptureCard initialDate={initialDate} compact/>
 <FamilyNotices/>
 <div className={styles.overview}>
  <div className={styles.dates}><Suspense fallback={<p className={styles.loading} role="status">Loading today and tomorrow…</p>}><SchoolDayPlan result={dayPlan} linkedStudents={linkedStudents}>{linkedStudents.length>0&&<Suspense fallback={null}><SchoolDayActivities result={getPublicDayActivities(now,readCalendar)} linkedStudents={linkedStudents}/></Suspense>}</SchoolDayPlan></Suspense></div>

 </div>
 <section className={styles.tasks} aria-labelledby="home-tasks-heading">
 <PinnedShortcuts heading={<h2 id="home-tasks-heading">Shortcuts</h2>} items={[
  {id:'lunch',label:'Lunch',card:<Link href="/lunch"><span className={styles.taskIcon}><Icon name="lunch"/></span><span><strong>Lunch</strong><span>Nutrislice & PaySchools</span></span></Link>},
  {id:'athletics',label:'Athletics',card:<Link href="/athletics"><span className={styles.taskIcon}><Icon name="shirt"/></span><span><strong>Athletics</strong><span>Saints teams & eligibility forms</span></span></Link>},
  {id:'pickup',label:'Pickup',card:<Link href="/pickup"><span className={styles.taskIcon}><Icon name="clock"/></span><span><strong>Pickup</strong><span>Dismissal & transportation help</span></span></Link>},
  {id:'resources',label:'Resources',card:<Link href="/resources"><span className={styles.taskIcon}><Icon name="resources"/></span><span><strong>Resources</strong><span>Tuition, aftercare & school forms</span></span></Link>},
  {id:'alma',label:'Alma',optional:true,card:<a href={school.portal}><span className={styles.taskIcon}><Icon name="book"/></span><span><strong>Alma</strong><span>School portal · Sign-in required</span></span></a>},
 ]}/>
 </section>
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
