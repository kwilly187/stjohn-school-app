import Link from 'next/link';
import {Heading, ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import {sportsSeasons, athleticsForms, publicInfoChecked, publicInfoSources} from '../public-info-data.mjs';
import styles from '../school-info.module.css';
export const metadata = {title:'Saints athletics'};
export default function Athletics(){return <>
  <Link href="/resources" className={styles.back}>← All resources</Link>
  <Heading eyebrow="GO SAINTS" title="Saints athletics">Teams, participation essentials and the next game.</Heading>
  <section className={styles.lead}><div><h2>Game days & events</h2><p>Check the live athletics calendar before making plans.</p></div><Link className="button" href="/calendar?source=athletics">View athletics calendar →</Link></section>
  <section aria-labelledby="sports-heading" className={styles.section}><h2 id="sports-heading">Sports by season</h2><div className={styles.seasons}>{sportsSeasons.map(({season,sports})=><section key={season} className={styles.season}><h3>{season}</h3><ul>{sports.map(sport=><li key={sport}>{sport}</li>)}</ul></section>)}</div></section>
  <section className={styles.section}><h2>Before your student participates</h2><p>Before conditioning, tryouts or the first practice:</p><ol className={styles.steps}><li>Complete school registration and enrollment, and pay registration fees.</li><li>Submit eligibility paperwork to the athletic director.</li></ol><div className={styles.forms}>{athleticsForms.map(form=><ExternalLink key={form.url} href={form.url}>{form.title}<small>PDF</small></ExternalLink>)}</div><p>New high school students also need GA4. Ask athletics for current GA4 forms and concussion and cardiac course instructions.</p></section>
  <section className={styles.contact}><div><h2>Questions about joining?</h2><p>Bobby Anderson · Athletics</p></div><a className="button" href={`mailto:${school.athleticsEmail}`}>Email athletics</a></section>
  <p className={styles.source}>Summary of <a href={publicInfoSources.athletics}>official school athletics information</a> · Checked {publicInfoChecked}. Confirm team availability and requirements with athletics.</p>
</>}
