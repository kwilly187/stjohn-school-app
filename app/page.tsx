import Link from 'next/link';
import {Suspense} from 'react';
import DevotionCard from './devotion-card';
import PublicDates from './public-dates';
export const dynamic='force-dynamic';
import {HelpCard,Icon,ResourceCard,SourceNote} from './components';
import {resources,school} from './school-data.mjs';

export default async function Today(){return <div className="today-page today-companion">
  <header className="companion-heading"><div><span className="eyebrow">{school.brandName}</span><h1>Today</h1></div><span className="companion-greeting">Hello, {school.mascot} families.</span></header>
  <nav className="daily-actions" aria-label="Your school day">
    <Link href="/students" className="daily-action family-action"><span className="action-symbol"><Icon name="people"/></span><span className="action-copy"><strong>My students</strong><span>Your family, together</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
    <Link href="/calendar" className="daily-action"><span className="action-symbol"><Icon name="calendar"/></span><span className="action-copy"><strong>Calendar</strong><span>School & activities</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
    <Link href="/calendar?source=athletics" className="daily-action"><span className="action-symbol"><Icon name="shirt"/></span><span className="action-copy"><strong>Athletics</strong><span>Go {school.mascot}!</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
  </nav>
  <div className="devotion-feature"><DevotionCard/><figure className="devotion-campus"><img src="/stjohn-church.png" alt="St. John Lutheran church on the school campus" width="414" height="276"/><figcaption><img src="/stjohn-fleur-divider.png" alt="" width="60" height="176"/><span>Faith at the heart<br/>of our school.</span></figcaption></figure></div>
  <Suspense fallback={<p role="status">Loading school dates…</p>}><PublicDates limit={3}/></Suspense>
  <section className="companion-essentials" aria-labelledby="quick-heading"><div className="section-heading"><h2 id="quick-heading">For your school day</h2><Link href="/resources" className="text-link">All resources <span aria-hidden="true">→</span></Link></div><div className="companion-public-links">{['lunch','spirit'].map(id=><ResourceCard compact key={id} resource={{...resources.find(r=>r.id===id)!,...(id==='spirit'?{title:'School store'}:{})}}/>)}</div>
    <Link href="/resources#school-accounts" className="school-accounts-link"><span className="accounts-symbol"><Icon name="wallet"/></span><span><strong>School accounts</strong><span>Grades, payments & aftercare · Provider sign-in required</span></span><span className="action-arrow" aria-hidden="true">→</span></Link>
  </section>
  <HelpCard/><SourceNote/>
</div>}
