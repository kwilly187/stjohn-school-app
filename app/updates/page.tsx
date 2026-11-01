import Link from 'next/link';
import {Heading,Icon,ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import styles from './help.module.css';
export const metadata={title:'School contacts'};
export default function Updates(){return <>
  <Heading eyebrow="HERE TO HELP" title="School contacts">Find the right person. Get the help you need.</Heading>
  <div className={styles.savedAccess}><Link href="/staff?contacts=saved">Saved contacts <span aria-hidden="true">→</span></Link></div>
  <div className={styles.primary}>
    <Link href="/staff" className={styles.teacher}><span className={styles.symbol}><Icon name="people"/></span><span><strong>Find & email a teacher</strong><span>Search the staff directory</span></span><span aria-hidden="true">→</span></Link>
    <a href={school.phone} className={styles.call}><span className={styles.symbol}><Icon name="home"/></span><span><strong>Call the school office</strong><span>{school.phoneDisplay}</span></span><span aria-hidden="true">→</span></a>
  </div>
  <section className={styles.tasks} aria-labelledby="help-tasks"><h2 id="help-tasks">What do you need help with?</h2><div className={styles.taskGrid}>
    <Link href="#contact-heading" className={styles.task}><Icon name="clock"/><span><strong>Attendance questions</strong><span>Ask the school office</span></span><span aria-hidden="true">→</span></Link>
    <Link href="#contact-heading" className={styles.task}><Icon name="file"/><span><strong>Forms & paperwork</strong><span>Find the form or person you need</span></span><span aria-hidden="true">→</span></Link>
    <Link href="/athletics" className={styles.task}><Icon name="shirt"/><span><strong>Athletics</strong><span>Teams, requirements & contact</span></span><span aria-hidden="true">→</span></Link>
    <Link href="/lunch#meal-help" className={styles.task}><Icon name="lunch"/><span><strong>Lunch & meal help</strong><span>Food-service contact & meal accounts</span></span><span aria-hidden="true">→</span></Link>
  </div></section>
  <section className={styles.office} aria-labelledby="contact-heading"><div><span className="eyebrow">SCHOOL OFFICE</span><h2 id="contact-heading">A person who can help</h2><p>For attendance questions, forms or help finding the right person.</p><div className={styles.officeActions}><a className="button" href={`mailto:${school.officeEmail}`}>Email the office</a><a className="text-link" href={school.phone}>Call {school.phoneDisplay}</a></div></div><div className={styles.officeDetails}><p>{school.address}</p><p>{school.officeHours}</p></div></section>
  <div className={styles.secondary}><a href={`mailto:${school.athleticsEmail}`}>Email athletics</a><ExternalLink href={school.portal}>Alma · External sign-in</ExternalLink></div>
  <p className={styles.note}>Email opens in your email app. For a time-sensitive question, call the school office.</p>
</>}
