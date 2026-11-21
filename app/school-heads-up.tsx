import Link from 'next/link';
import {calendarHref} from './calendar/calendar-state.mjs';
import type {getSchoolHeadsUp} from './school-heads-up-data.mjs';
import styles from './school-heads-up.module.css';

export default async function SchoolHeadsUp({result}:{result:ReturnType<typeof getSchoolHeadsUp>}){
 const item=await result;
 if(!item)return null;
 const href=calendarHref({source:'activities',view:'MONTH',month:item.month,event:item.eventId,from:'today'});
 return <div className={styles.headsUp}><Link href={href}><strong>{item.kind} {item.label}</strong>{item.reason ? <span> · {item.reason}</span> : null}</Link></div>;
}
