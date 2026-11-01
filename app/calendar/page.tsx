import {Heading} from '../components';
import CalendarView from './view';
import {calendarState} from './calendar-state.mjs';
import {getCalendarFeed} from './calendar-feed.mjs';
export const metadata={title:'Calendar'};
export default async function Calendar({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const state=calendarState(await searchParams);
 const result=await getCalendarFeed({source:state.source,month:state.month,view:state.view});
 return <><Heading eyebrow="YOUR SCHOOL SCHEDULE" title="School calendar">School activities and athletics, together in your app.</Heading><CalendarView state={state} result={result}/></>;
}
