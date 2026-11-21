'use client';
import Link from 'next/link';
import {calendarHref} from './calendar/calendar-state.mjs';
import type {getSchoolDayPlan} from './school-day-plan-data.mjs';
import useDeviceStudent from './home-device-student-hook';
import styles from './public-dates.module.css';
export default function SchoolDayPlanView({plan}:{plan:Awaited<ReturnType<typeof getSchoolDayPlan>>}){
 const student=useDeviceStudent();
 return <section className={`${styles.section} ${styles.featuredSection}`} aria-labelledby="school-day-plan-heading">
  <div className={styles.heading}><div>{student&&<p className={styles.studentLabel}>Grade {student.grade} · This device</p>}<h2 id="school-day-plan-heading">{student?`${student.name}’s day`:'Today & Tomorrow'}</h2></div><Link href="/calendar">Full calendar</Link></div>
  {student&&<p className={styles.planSubheading}>Today &amp; Tomorrow · Public school calendar, not student records</p>}
  {plan.status==='unavailable'?<p className={styles.note}>The school calendar couldn’t be loaded right now.</p>:plan.events.length?<div className={styles.list}>
   {plan.events.map(event=><div className={styles.event} key={event.id}>
    <div className={styles.date}>{event.label}</div>
    <div>{student&&<span className={styles.scope}>{event.scope}</span>}<h3><Link href={calendarHref({source:'activities',view:'MONTH',month:event.day.slice(0,7),event:event.id,from:'today'})}>{event.title}</Link></h3>
     {(event.time||event.location)&&<p>{[event.time,event.location].filter(Boolean).join(' · ')}</p>}
    </div>
   </div>)}
  </div>:<p className={styles.note}>{plan.hasHeadsUp?'No other school events are listed for today or tomorrow.':'No school events are listed for today or tomorrow.'}</p>}
  {student&&student.grade>=6&&student.grade<=12&&<p className={styles.pickupNote}><Link href="/pickup">Front pickup map</Link><span>School guidance for grades 6–12</span></p>}
 </section>;
}
