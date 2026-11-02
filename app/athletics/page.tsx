import Link from 'next/link';
import {Heading, ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import {sportsSeasons, athleticsForms, publicInfoChecked, publicInfoSources} from '../public-info-data.mjs';
import styles from '../school-info.module.css';
import athleticStyles from './athletics.module.css';
export const metadata = {title:'Saints athletics'};
export default function Athletics(){ return <>
  <Link href="/resources" className={styles.back}>← All resources</Link>
  <Heading eyebrow="GO SAINTS" title="Saints athletics">Explore school programs and find what you need to take part.</Heading>
  <section aria-labelledby="sports-heading" className={styles.section}><h2 id="sports-heading">Find a program</h2><p>Explore the school’s published sports by season.</p><div className={athleticStyles.seasons}>{sportsSeasons.map(({season,sports})=><details key={season} className={athleticStyles.season}><summary><span>{season}</span><span className={athleticStyles.count}>{sports.length} programs</span></summary><ul>{sports.map(sport=><li key={sport}>{sport}</li>)}</ul></details>)}</div></section>
  <section className={styles.section}><h2>Before your student participates</h2><p>Before conditioning, tryouts or the first practice:</p><ol className={styles.steps}><li>Complete school registration and enrollment, and pay registration fees.</li><li>Submit eligibility paperwork to the athletic director.</li></ol><div className={styles.forms}>{athleticsForms.map(form=><ExternalLink key={form.url} href={form.url}>{form.title}<small>PDF</small></ExternalLink>)}</div><p>New high school students also need GA4. Ask athletics for current GA4 forms and concussion and cardiac course instructions.</p></section>
  <section className={styles.contact}><div><h2>Ask about a program</h2><p>Bobby Anderson · Athletics</p></div><a className="button" href={`mailto:${school.athleticsEmail}`}>Email athletics</a></section>
  <div className={athleticStyles.calendarLink}><Link href="/calendar?source=athletics">All athletics dates <span aria-hidden="true">→</span></Link><span>Games, practices and program-wide events</span></div>
  <p className={styles.source}>Summary of <a href={publicInfoSources.athletics}>official school athletics information</a> · Checked {publicInfoChecked}. Confirm team availability and requirements with athletics.</p>
</>}
