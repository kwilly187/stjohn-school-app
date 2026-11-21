import type {getLocalLinkedFamily} from './linked-family.server.mjs';
import SchoolDayPlanView from './school-day-plan-view';
import type {getSchoolDayPlan} from './school-day-plan-data.mjs';
export default async function SchoolDayPlan({result,children,linkedStudents}:{result:ReturnType<typeof getSchoolDayPlan>,children:React.ReactNode,linkedStudents:ReturnType<typeof getLocalLinkedFamily>}){return <SchoolDayPlanView plan={await result} linkedStudents={linkedStudents}>{children}</SchoolDayPlanView>;}
