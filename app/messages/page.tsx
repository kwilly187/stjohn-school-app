import Link from 'next/link';
import {Heading,ExternalLink} from '../components';
import {school} from '../school-data.mjs';
import styles from '../communication.module.css';
export const metadata={title:'Messages'};
export default function Messages(){return <div className={styles.page}>
 <Heading eyebrow="ST. JOHN LUTHERAN SCHOOL" title="Messages">School updates and conversations.</Heading>
 <section className={styles.primary} aria-labelledby="school-messages"><h2 id="school-messages">Your school account</h2><p>School messages are not connected to this app. Open Alma to check your school account.</p><ExternalLink href={school.portal} className="button">Open Alma</ExternalLink><small>School sign-in required.</small></section>
 <div className={styles.actions}><section className={styles.action}><h2>Contact a teacher</h2><p>Find a teacher in the St. John staff directory and email them directly.</p><Link href="/staff">Find a teacher</Link></section><section className={styles.action}><h2>Contact the school office</h2><p>For attendance questions, forms or help reaching the right person.</p><a href={`mailto:${school.officeEmail}`}>Email the school office</a></section></div>
 <p>Email opens in your email app.</p><Link href="/updates" className={styles.back}>All school contacts</Link>
 </div>}
