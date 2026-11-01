import Link from 'next/link';
import DevotionCard from './devotion-card';
export const dynamic='force-dynamic';
import {ExternalLink,HelpCard,Icon,ResourceCard,SourceNote} from './components';
import {resources,school} from './school-data.mjs';

export default function Today(){return <div className="today-page">
  <header className="today-welcome">
    <div><span className="eyebrow">HOME OF THE {school.mascot.toUpperCase()}</span><h1>Hello, {school.mascot} families.</h1><p>Your school day, simplified.</p><Link href="/students" className="family-shortcut" aria-label="My students">My students <span aria-hidden="true">→</span></Link></div>
    <figure className="welcome-campus"><img src="/stjohn-church.png" alt="St. John Lutheran church on the school campus" width="414" height="276"/><figcaption>Our school. Our community.</figcaption></figure>
  </header>
  <div className="today-overview">
    <DevotionCard/>
    <section className="school-day" aria-label="School calendars"><div className="school-day-heading"><span>Around St. John</span><img src="/stjohn-fleur-divider.png" alt="" width="60" height="176"/></div>
      <Link href="/calendar" className="day-link"><span className="day-icon"><Icon name="calendar"/></span><span><span className="eyebrow">PLAN YOUR DAY</span><strong>Calendar</strong><span className="day-description">School dates & activities</span></span><span className="day-arrow" aria-hidden="true">→</span></Link>
      <Link href="/calendar?source=athletics" className="day-link athletics-link"><span className="day-icon"><Icon name="people"/></span><span><span className="eyebrow">GO {school.mascot.toUpperCase()}</span><strong>Athletics</strong><span className="day-description">Games, teams & locations</span></span><span className="day-arrow" aria-hidden="true">→</span></Link>
    </section>
  </div>
  <section className="notice-card"><span className="notice-symbol"><Icon name="updates"/></span><div><h2>School notices</h2><p>Announcements and anything due, in {school.portalLabel}.</p></div><ExternalLink href={school.portal} className="text-link">Open {school.portalLabel}</ExternalLink></section>
  <section className="essentials" aria-labelledby="quick-heading"><div className="section-heading"><h2 id="quick-heading">Everyday essentials</h2><Link href="/resources" className="text-link">View all <span aria-hidden="true">→</span></Link></div><div className="school-store-shortcut"><ResourceCard compact resource={{...resources.find(r=>r.id==='spirit')!,title:'School store'}}/></div><div className="resource-grid quick-grid">{['lunch','alma','tuition','aftercare'].map(id=><ResourceCard compact key={id} resource={resources.find(r=>r.id===id)!}/>)}</div></section>
  <HelpCard/><SourceNote/>
</div>}
