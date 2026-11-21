import {Heading} from '../components';
import CalendarView from './view';
import styles from './calendar.module.css';
import {calendarState} from './calendar-state.mjs';
import {getCalendarFeed} from './calendar-feed.mjs';
export const metadata={title:'Calendar'};
export default async function Calendar({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const state=calendarState(await searchParams);
 const {status,retrievedAt,sourceUrl,events,rangeStart,rangeEnd}=await getCalendarFeed({source:state.source,month:state.month,view:state.view});
 // The client needs the public calendar view, not the provider's internal failure diagnostics.
 return <div className={styles.page}><Heading eyebrow="YOUR SCHOOL SCHEDULE" title="School calendar">School activities and athletics, together in your app.</Heading><CalendarView state={state} result={{status,retrievedAt,sourceUrl,events,rangeStart,rangeEnd}}/></div>;
}
