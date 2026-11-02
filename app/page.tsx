import Link from 'next/link';
import {Suspense} from 'react';
import PublicDates from './public-dates';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import {school} from './school-data.mjs';
export const dynamic='force-dynamic';

export default async function Today(){return <div className="today-page today-companion parent-home">
  <header className="companion-heading"><div><span className="eyebrow">{school.brandName}</span><h1>Your school day</h1></div><span className="companion-greeting">Hello, {school.mascot} families.</span></header>
  <Link href="/students" className="home-family">
    <span className="family-portrait" aria-hidden="true">{profiles.length===1?(profiles[0].photo?<img src={profiles[0].photo} alt="" width="52" height="52"/>:profiles[0].name[0]):<Icon name="people"/>}</span>
    <span className="home-family-copy"><strong>{profiles.length===1?profiles[0].name:'My students'}</strong><span>{profiles.length===1?`Grade ${profiles[0].grade} · Student overview`:'Student overview'}</span></span>
    <span className="home-arrow" aria-hidden="true">→</span>
  </Link>
  <section className="home-tasks" aria-labelledby="home-tasks-heading">
    <h2 id="home-tasks-heading">What do you need?</h2>
    <div className="home-help">
      <Link href="/updates" className="home-help-main"><Icon name="people"/><span><strong>Communication & help</strong><span>Find a teacher, reach the office or ask a question.</span></span><span className="home-arrow" aria-hidden="true">→</span></Link>
      <Link href="/staff?contacts=saved" className="home-saved"><Icon name="updates"/>Saved contacts <span aria-hidden="true">→</span></Link>
    </div>
    <nav className="home-task-links" aria-label="Everyday school tasks">
      <Link href="/lunch"><Icon name="lunch"/><span><strong>Lunch</strong><span>Menu, meal account & help</span></span><span className="home-arrow" aria-hidden="true">→</span></Link>
      <Link href="/athletics"><Icon name="shirt"/><span><strong>Athletics</strong><span>Sports, forms & participation</span></span><span className="home-arrow" aria-hidden="true">→</span></Link>
      <Link href="/resources#school-store"><Icon name="heart"/><span><strong>School store</strong><span>Spirit wear & uniforms</span></span><span className="home-arrow" aria-hidden="true">→</span></Link>
      <Link href="/resources"><Icon name="resources"/><span><strong>School essentials</strong><span>Dress code, accounts & resources</span></span><span className="home-arrow" aria-hidden="true">→</span></Link>
    </nav>
    <Link href="/pickup" className="text-link">Pickup <small>Proposed connection</small><span aria-hidden="true">→</span></Link>
  </section>
  <div className="home-dates"><Suspense fallback={<p className="home-dates-loading" role="status">Loading school dates…</p>}><PublicDates grades={profiles.map(profile=>profile.grade)} limit={2} title="Key school dates"/></Suspense></div>
</div>}
