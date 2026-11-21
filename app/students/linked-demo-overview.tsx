import Link from 'next/link';
import {Suspense} from 'react';
import {calendarHref} from '../calendar/calendar-state.mjs';
import {DEVICE_ACTIVITIES,matchDeviceActivity} from '../device-activity-matching.mjs';
import type {getPreviewDemoFamily} from '../linked-family.server.mjs';
import type {getPublicDayActivities} from '../school-day-activities-data.mjs';
import styles from './students.module.css';

type Student=ReturnType<typeof getPreviewDemoFamily>[number];
type OverviewProps={student:Student,publicActivities:ReturnType<typeof getPublicDayActivities>};
async function PublicDatesForDemo({student,publicActivities}:OverviewProps){
 const result=await publicActivities;
 const upcoming=result.events.filter(event=>{const match=matchDeviceActivity(event.title,student.grade);return match&&student.activities.includes(match);}).slice(0,2);
 return <>
  {upcoming.length>0&&<ul className={styles.linkedSchedule}>{upcoming.map(event=><li key={event.id}><Link href={calendarHref({source:event.source,view:'MONTH',month:event.day.slice(0,7),event:event.id,from:'students'})}>{event.title}</Link><span>{[event.label,event.time,event.location].filter(Boolean).join(' · ')}</span></li>)}</ul>}
  {!result.complete?<p>Some public calendars couldn’t be checked right now.</p>:upcoming.length===0&&<p>No matching public events are listed for today or tomorrow.</p>}
 </>;
}
export default function LinkedDemoOverview({student,publicActivities}:OverviewProps){
 const activities=DEVICE_ACTIVITIES.filter(activity=>student.activities.includes(activity.id));
 return <article className={styles.linkedOverview} aria-labelledby={`student-overview-${student.id}`}>
  <header className={styles.linkedHeading}><div><p>Linked demo student</p><h2 id={`student-overview-${student.id}`}>{student.name}</h2></div><span>Grade {student.grade}</span></header>
  <div className={styles.linkedSection}><h3>Activities</h3><ul className={styles.linkedActivityList}>{activities.map(activity=><li key={activity.id}>{activity.label}</li>)}</ul><p>Public school schedules only. These selections don’t imply enrollment.</p></div>
  <div className={styles.linkedSection}><h3>Today &amp; tomorrow</h3><Suspense fallback={<p role="status">Checking public calendars…</p>}><PublicDatesForDemo student={student} publicActivities={publicActivities}/></Suspense></div>
  {student.grade>=6&&student.grade<=12&&<p className={styles.linkedUtility}><Link href="/pickup" className={styles.linkedPickup}>Front pickup map</Link><span>Grades 6–12</span></p>}
 </article>;
}
