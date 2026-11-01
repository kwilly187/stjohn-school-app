import Link from 'next/link';
import {Heading} from '../components';
import {school} from '../school-data.mjs';
import StaffView from './staff-view';
import {staffDirectory,staffDepartments,staffSource} from './staff-data.mjs';
import styles from './staff.module.css';
export const metadata={title:'Staff directory'};
export default function StaffDirectory(){return <div className={styles.page}>
  <Link href="/resources" className={styles.back}>← Resources</Link>
  <Heading eyebrow="PEOPLE AT ST. JOHN" title="Staff directory">Find a name, a role, or the right person to ask.</Heading>
  <StaffView staff={staffDirectory} departments={staffDepartments}/>
  <aside className={styles.office}><div><h2>Not sure who to contact?</h2><p>The school office can help you find the right person.</p></div><div className={styles.officeActions}><a href={`mailto:${school.officeEmail}`}>Email the school office →</a><a href={school.phone}>Call {school.phoneDisplay}</a></div></aside>
  <p className={styles.source}>Public staff directory · Checked {staffSource.checkedLabel}. <a href={staffSource.url}>View the school’s directory</a>.</p>
</div>}
