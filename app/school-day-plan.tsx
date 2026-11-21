import SchoolDayPlanView from './school-day-plan-view';
import type {getSchoolDayPlan} from './school-day-plan-data.mjs';
export default async function SchoolDayPlan({result}:{result:ReturnType<typeof getSchoolDayPlan>}){return <SchoolDayPlanView plan={await result}/>;}
