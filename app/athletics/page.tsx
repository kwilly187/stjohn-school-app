import Link from 'next/link';
import {Heading, ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import {sportsSeasons, athleticsForms, publicInfoChecked, publicInfoSources} from '../public-info-data.mjs';
import styles from '../school-info.module.css';
import athleticStyles from './athletics.module.css';
import {getCalendarFeed} from '../calendar/calendar-feed.mjs';
import {schoolMonth,calendarHref} from '../calendar/calendar-state.mjs';
export const metadata = {title:'Saints athletics'};
export const dynamic='force-dynamic';
export default async function Athletics(){
 const month=schoolMonth();const schedule=await getCalendarFeed({source:'athletics',month,view:'AGENDA'});
 const checked=schedule.retrievedAt?new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(schedule.retrievedAt)):null;
 return <>
  <Link href="/resources" className={styles.back}>← All resources</Link>
  <Heading eyebrow="GO SAINTS" title="Saints athletics">Teams, participation essentials and the next game.</Heading>
  <section className={athleticStyles.schedule} aria-labelledby="athletics-schedule"><div className={athleticStyles.scheduleHeading}><div><span className="eyebrow">FROM THE SCHOOL CALENDAR</span><h2 id="athletics-schedule">Upcoming athletics dates</h2></div><Link className="button" href="/calendar?source=athletics">Full athletics calendar →</Link></div>
  {schedule.status==='ok'?<>{schedule.events.length?<div className={athleticStyles.dates}>{schedule.events.slice(0,3).map(event=><Link key={event.id} href={calendarHref({source:'athletics',view:'MONTH',month:event.startDay.slice(0,7),event:event.id})} className={athleticStyles.date}><span>{event.startText||event.dateText}</span><strong>{event.title}</strong><span className={athleticStyles.arrow} aria-hidden="true">→</span></Link>)}</div>:<p>No published athletics events were returned for the next 45 days.</p>}<p className={athleticStyles.checked}>School-published schedule · Checked {checked} · Eastern time</p></>:<p className={athleticStyles.checked}>Athletics dates couldn’t be loaded. <Link href="/calendar?source=athletics">Open the calendar</Link> to try again.</p>}
  </section>
  <section aria-labelledby="sports-heading" className={styles.section}><h2 id="sports-heading">Sports by season</h2><div className={athleticStyles.seasons}>{sportsSeasons.map(({season,sports})=><details key={season} className={athleticStyles.season}><summary><span>{season}</span><span className={athleticStyles.count}>{sports.length} programs</span></summary><ul>{sports.map(sport=><li key={sport}>{sport}</li>)}</ul></details>)}</div></section>
  <section className={styles.section}><h2>Before your student participates</h2><p>Before conditioning, tryouts or the first practice:</p><ol className={styles.steps}><li>Complete school registration and enrollment, and pay registration fees.</li><li>Submit eligibility paperwork to the athletic director.</li></ol><div className={styles.forms}>{athleticsForms.map(form=><ExternalLink key={form.url} href={form.url}>{form.title}<small>PDF</small></ExternalLink>)}</div><p>New high school students also need GA4. Ask athletics for current GA4 forms and concussion and cardiac course instructions.</p></section>
  <section className={styles.contact}><div><h2>Questions about joining?</h2><p>Bobby Anderson · Athletics</p></div><a className="button" href={`mailto:${school.athleticsEmail}`}>Email athletics</a></section>
  <p className={styles.source}>Summary of <a href={publicInfoSources.athletics}>official school athletics information</a> · Checked {publicInfoChecked}. Confirm team availability and requirements with athletics.</p>
</>}
