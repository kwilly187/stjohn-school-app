import Link from 'next/link';
import {Heading, ExternalLink} from '../components';
import {school,resources} from '../school-data.mjs';
import {dressCodeRules, publicInfoChecked, publicInfoSources} from '../public-info-data.mjs';
import styles from '../school-info.module.css';
export const metadata = {title:'Dress code'};
export default function DressCode(){const uniforms=resources.find(resource=>resource.id==='uniforms')!;return <>
  <Link href="/resources" className={styles.back}>← All resources</Link>
  <Heading eyebrow="READY FOR SCHOOL" title="Dress code">An everyday checklist from the school’s published policy.</Heading>
  <ul className={styles.rules}>{dressCodeRules.map(rule=><li key={rule.title}><h2>{rule.title}</h2><p>{rule.detail}</p></li>)}</ul>
  <section className={styles.lead}><div><h2>School uniforms</h2><p>Shop the school’s uniform provider, FlynnO’Hara.</p></div><ExternalLink href={uniforms.url} className="button">Buy uniforms</ExternalLink></section>
  <section className={styles.contact}><div><h2>Not sure what’s allowed?</h2><p>Check with the office before buying.</p></div><a className="text-link" href={school.phone}>Call {school.phoneDisplay}</a></section>
  <p className={styles.source}>Summary of the <a href={publicInfoSources.dressCode}>official school dress code</a> · Checked {publicInfoChecked}. The school’s policy is the authority.</p>
</>}
