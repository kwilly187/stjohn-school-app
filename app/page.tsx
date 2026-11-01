import Link from 'next/link';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
export const dynamic='force-dynamic';
import {HelpCard,Icon,ResourceCard} from './components';
import {resources,school} from './school-data.mjs';

export default async function Today(){return <div className="today-page today-companion">
  <header className="companion-heading"><div><span className="eyebrow">{school.brandName}</span><h1>Today</h1></div><span className="companion-greeting">Hello, {school.mascot} families.</span></header>
  <section className="family-day" aria-label="Your family’s school dates">
    <Link href="/students" className="family-day-heading">
      <span className="family-portrait" aria-hidden="true">{profiles.length===1?(profiles[0].photo?<img src={profiles[0].photo} alt="" width="68" height="68"/>:profiles[0].name[0]):<Icon name="people"/>}</span>
      <span className="family-day-copy"><span className="eyebrow">My students</span><strong>{profiles.length===1?profiles[0].name:'Your school day'}</strong><span>{profiles.length===1?`Grade ${profiles[0].grade}`:'School & grade-level dates'}</span></span>
      <span className="family-day-open">View <span aria-hidden="true">→</span></span>
    </Link>
    <Suspense fallback={<p className="family-dates-loading" role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={3} featured/></Suspense>
  </section>
  <nav className="daily-actions schedule-actions" aria-label="Your school day">
    <Link href="/calendar" className="daily-action"><span className="action-symbol"><Icon name="calendar"/></span><span className="action-copy"><strong>Calendar</strong><span>School & activities</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
    <Link href="/calendar?source=athletics" className="daily-action athletics-action"><img className="athletics-crest" src={school.logo} alt="" width="46" height="54"/><span className="action-copy"><strong>Athletics</strong><span>Game schedules</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
  </nav>

  <section className="companion-essentials" aria-labelledby="quick-heading"><div className="section-heading"><h2 id="quick-heading">For your school day</h2><Link href="/resources" className="text-link">All resources <span aria-hidden="true">→</span></Link></div><div className="companion-public-links">{['lunch','spirit'].map(id=><ResourceCard compact key={id} resource={{...resources.find(r=>r.id===id)!,...(id==='spirit'?{title:'School store',detail:'Spirit wear & uniforms',appPath:'/resources#school-store'}:{})}}/>)}</div>
    <Link href="/resources#school-accounts" className="school-accounts-link"><span className="accounts-symbol"><Icon name="wallet"/></span><span><strong>School accounts</strong><span>Grades, payments & aftercare · Provider sign-in required</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
  </section>
  <HelpCard/>
</div>}

