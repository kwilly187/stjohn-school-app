import type {getLocalLinkedFamily} from './linked-family.server.mjs';
import SchoolActivitiesView from './school-day-activities-view';
import type {getPublicDayActivities} from './school-day-activities-data.mjs';
export default async function SchoolDayActivities({result,linkedStudents}:{result:ReturnType<typeof getPublicDayActivities>,linkedStudents:ReturnType<typeof getLocalLinkedFamily>}){return <SchoolActivitiesView result={await result} linkedStudents={linkedStudents}/>;}
