'use client';
import Link from 'next/link';
import {calendarHref} from './calendar/calendar-state.mjs';
import {matchDeviceActivity} from './device-activity-matching.mjs';
import useLinkedFamilyStudent from './use-linked-family-student';
import type {getLocalLinkedFamily} from './linked-family.server.mjs';
import type {getPublicDayActivities} from './school-day-activities-data.mjs';
import styles from './public-dates.module.css';
export default function SchoolActivitiesView({result,linkedStudents}:{result:Awaited<ReturnType<typeof getPublicDayActivities>>,linkedStudents:ReturnType<typeof getLocalLinkedFamily>}){
 const student=useLinkedFamilyStudent(linkedStudents);
 if(!student?.activities.length)return null;
 const events=result.events.filter(event=>{const match=matchDeviceActivity(event.title,student.grade);return match&&student.activities.includes(match);}).slice(0,3);
 return <div className={styles.activityPlan}>
  <h3>Selected activities</h3>
  <p className={styles.note}>Public school schedules, not a team roster or private schedule.</p>
  {events.length>0&&<ul>{events.map(event=><li key={event.id}><span>{event.label}{event.time?` · ${event.time}`:''}</span><Link href={calendarHref({source:event.source,view:'MONTH',month:event.day.slice(0,7),event:event.id,from:'today'})}>{event.title}</Link>{event.location&&<span>{event.location}</span>}</li>)}</ul>}
  {!result.complete?<p className={styles.note}>Some public schedules couldn’t be checked right now.</p>:events.length===0&&<p className={styles.note}>No matching public events are listed for today or tomorrow.</p>}
 </div>;
}
