import Link from 'next/link';
import type {NormalizedStudentSection as StudentSection} from './student-records.types';
import styles from './students.module.css';
const content={
 assignments:{title:'Assignments',disconnected:'Assignments and due dates aren’t connected yet.',empty:'No assignments shared for this selection.'},
 grades:{title:'Current grades',disconnected:'Class grades aren’t connected yet.',empty:'No class grades shared for this selection.'},
 teams:{title:'Teams & activities',disconnected:'Student team and activity memberships aren’t connected yet.',empty:'No memberships shared for this selection.'},
 announcements:{title:'School updates',disconnected:'Student-specific announcements aren’t connected yet.',empty:'No current updates shared for this selection.'}
};
function dateText(value:string){
 const dateOnly=/^\d{4}-\d{2}-\d{2}$/.test(value);
 return new Intl.DateTimeFormat('en-US',dateOnly?{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}:{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/New_York',timeZoneName:'short'}).format(new Date(dateOnly?value+'T12:00:00Z':value));
}
/** Display only: the future server adapter must authorize every record before supplying it. */
export default function StudentRecords({sections,studentNames}:{sections:StudentSection[],studentNames:Record<string,string>}){
 const childLabel=(id:string)=>Object.keys(studentNames).length>1?<span className={styles.recordChild}>{studentNames[id]}</span>:null;
 return <div className={styles.dashboard} aria-label="Student overview">{sections.map(section=><section key={section.key} className={styles.section} aria-labelledby={`student-${section.key}`}>
 <div className={styles.sectionTop}><span className={styles.availability}>{section.status==='ready'?'School information':section.status==='unavailable'?'Unavailable':'Not connected'}</span></div>
 <h2 id={`student-${section.key}`} className={styles.sectionTitle}>{content[section.key].title}</h2>
 {section.status!=='ready'?<p className={styles.sectionCopy}>{section.status==='not-connected'?content[section.key].disconnected:'This information couldn’t be loaded. Try again later.'}</p>:<>
 {section.items.length===0?<p className={styles.sectionCopy}>{content[section.key].empty}</p>:<ul className={styles.records}>
 {section.key==='assignments'&&section.items.map(item=><li key={`${item.studentId}:${item.id}`}>{childLabel(item.studentId)}<strong>{item.title}</strong><span>{item.course}</span><span>Due <time dateTime={item.dueAt}>{dateText(item.dueAt)}</time></span></li>)}
 {section.key==='grades'&&section.items.map(item=><li key={`${item.studentId}:${item.id}`}>{childLabel(item.studentId)}<strong>{item.course}</strong><span className={styles.gradeValue}>{item.value}</span><span>Reported <time dateTime={item.reportedAt}>{dateText(item.reportedAt)}</time></span></li>)}
 {section.key==='teams'&&section.items.map(item=><li key={`${item.studentId}:${item.id}`}>{childLabel(item.studentId)}<strong>{item.name}</strong>{item.season&&<span>{item.season}</span>}</li>)}
 {section.key==='announcements'&&section.items.map(item=><li key={`${item.studentId}:${item.id}`}>{childLabel(item.studentId)}<strong>{item.title}</strong><p className={styles.recordBody}>{item.body}</p><span><time dateTime={item.publishedAt}>{dateText(item.publishedAt)}</time></span></li>)}
 </ul>}
 {section.retrievedAt&&<p className={styles.recordFreshness}>Checked <time dateTime={section.retrievedAt}>{dateText(section.retrievedAt)}</time></p>}
 </>}
 {section.key==='teams'&&<Link className={styles.secondaryLink} href="/athletics">Explore school sports</Link>}
 {section.key==='announcements'&&<Link className={styles.secondaryLink} href="/updates">Contact the school</Link>}
 </section>)}</div>;
}
