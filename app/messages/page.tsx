import Link from 'next/link';
import {Heading,ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import styles from '../communication.module.css';
export const metadata={title:'Messages'};
export default function Messages(){return <div className={styles.page}>
 <Heading eyebrow="ST. JOHN LUTHERAN SCHOOL" title="Messages">School conversations and contacts.</Heading>
 <section className={styles.primary} aria-labelledby="school-messages"><h2 id="school-messages">Check school messages in Alma</h2><p>School messages are not connected here. School sign-in is required.</p><ExternalLink href={school.portal} className="button">Open Alma</ExternalLink></section>
 <section className={styles.contactLinks} aria-labelledby="message-contacts"><h2 id="message-contacts">Contact the school</h2><Link href="/staff">Find a teacher</Link><Link href="/updates#contact-heading">School office</Link></section>
 </div>}
