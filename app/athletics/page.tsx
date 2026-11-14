import Link from 'next/link';
import {Heading, ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import {sportsSeasons, athleticsForms} from '../public-info-data.mjs';
import styles from '../school-info.module.css';
import athleticStyles from './athletics.module.css';
export const metadata = {title:'Saints athletics'};
export default function Athletics(){ return <>
  <Link href="/resources" className={styles.back}>All resources</Link>
  <Heading eyebrow="GO SAINTS" title="Saints athletics">St. John teams, eligibility forms and athletics contacts.</Heading>
  <section aria-labelledby="sports-heading" className={styles.section}><h2 id="sports-heading">Find a program</h2><p>St. John sports by season.</p><div className={athleticStyles.seasons}>{sportsSeasons.map(({season,sports})=><details key={season} className={athleticStyles.season}><summary><span>{season}</span><span className={athleticStyles.count}>{sports.length} programs</span></summary><ul>{sports.map(sport=><li key={sport}>{sport}</li>)}</ul></details>)}</div></section>
  <section id="participation-forms" className={styles.section}><h2>Before your student participates</h2><p>Before conditioning, tryouts or the first practice:</p><ol className={styles.steps}><li>Complete school registration and enrollment, and pay registration fees.</li><li>Submit eligibility paperwork to the athletic director.</li></ol><div className={styles.forms}>{athleticsForms.map(form=><ExternalLink key={form.url} href={form.url}>{form.title}<small>PDF</small></ExternalLink>)}</div><p>New high school students also need GA4. Ask athletics for current GA4 forms and concussion and cardiac course instructions.</p></section>
  <section className={styles.contact}><div><h2>Ask about a program</h2><p>Bobby Anderson · Athletics</p></div><a className="button" href={`mailto:${school.athleticsEmail}`}>Email athletics</a></section>
  <div className={athleticStyles.campusRow}><img src="/campus/gym.webp" alt="The empty Saints gymnasium at St. John" width="429" height="286" loading="lazy"/><div><h2>Home of the Saints</h2><p>Games, practices and school athletics.</p><Link href="/calendar?source=athletics">All athletics dates</Link></div></div>
</>}
