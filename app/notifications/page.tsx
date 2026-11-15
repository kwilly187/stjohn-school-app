import Link from 'next/link';
import {Heading,ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import styles from '../communication.module.css';
export const metadata={title:'Notifications'};
export default function Notifications(){return <div className={styles.page}>
 <Heading eyebrow="ST. JOHN LUTHERAN SCHOOL" title="Notifications">School notices and alerts.</Heading>
 <section className={styles.primary} aria-labelledby="school-notifications"><h2 id="school-notifications">Check with the school</h2><p>School alerts are not connected to this app. Check Alma and the messages sent directly by St. John.</p><ExternalLink href={school.portal} className="button">Open Alma</ExternalLink><small>School sign-in required.</small></section>
 <section className={styles.action}><h2>Need an immediate answer?</h2><p>Call the school office for time-sensitive questions.</p><a href={school.phone}>Call {school.phoneDisplay}</a></section><Link href="/messages" className={styles.back}>Messages & contacts</Link>
 </div>}
