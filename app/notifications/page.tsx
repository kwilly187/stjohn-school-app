import Link from 'next/link';
import {Heading,ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import styles from '../communication.module.css';
export const metadata={title:'Notifications'};
export default function Notifications(){return <div className={styles.page}>
 <Heading eyebrow="ST. JOHN LUTHERAN SCHOOL" title="Notifications">School notices and alerts.</Heading>
 <section className={styles.primary} aria-labelledby="school-notifications"><h2 id="school-notifications">Check Alma for school alerts</h2><p>School alerts are not connected here. Check Alma and messages sent directly by St. John. School sign-in is required.</p><ExternalLink href={school.portal} className="button">Open Alma</ExternalLink></section>
 <section className={styles.contactLinks} aria-labelledby="notification-contacts"><h2 id="notification-contacts">Time-sensitive question?</h2><a href={school.phone}>Call {school.phoneDisplay}</a><Link href="/updates">School contacts</Link></section>
 </div>}
