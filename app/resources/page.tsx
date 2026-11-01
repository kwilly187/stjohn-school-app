import {Heading,HelpCard,ResourceCard,SourceNote} from '../components';
import {resources,resourceGroups} from '../school-data.mjs';
export const metadata={title:'Resources'};
export default function Resources(){return <div className="resources-page"><Heading eyebrow="ONE PLACE TO START" title="Family resources">School links and services. Use your existing accounts to sign in.</Heading>{resourceGroups.map(group=><section className="resource-section" key={group} id={group==='School store'?'school-store':undefined}><h2>{group}</h2><div className="resource-grid">{resources.filter(r=>r.group===group).map(resource=><ResourceCard key={resource.id} resource={resource}/>)}</div></section>)}<HelpCard/><SourceNote/></div>}
