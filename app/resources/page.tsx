import {Heading,HelpCard,ResourceCard} from '../components';
import {resources,resourceGroups} from '../school-data.mjs';
export const metadata={title:'Resources'};
export default function Resources(){return <div className="resources-page"><Heading eyebrow="ONE PLACE TO START" title="Family resources">School information, everyday essentials and your school accounts.</Heading>{resourceGroups.map(group=><section className="resource-section" key={group} id={group==='School store'?'school-store':group==='School accounts'?'school-accounts':undefined}><h2>{group}</h2>{group==='School accounts'&&<p className="fine-print">These services open outside the app. Sign in with the account you use for each provider.</p>}<div className="resource-grid">{resources.filter(r=>r.group===group).map(resource=><ResourceCard key={resource.id} resource={resource}/>)}</div></section>)}<HelpCard/></div>}

