import Link from 'next/link';
import storeStyles from './store.module.css';
import helpStyles from '../updates/help.module.css';
import {Heading,HelpCard,ResourceCard,ExternalLink,Icon} from '../components';
import {resources,resourceGroups} from '../school-data.mjs';
export const metadata={title:'Resources'};
function SchoolStore(){
 const spirit=resources.find(resource=>resource.id==='spirit')!;
 const uniforms=resources.find(resource=>resource.id==='uniforms')!;
 return <div className={storeStyles.store}>
  <article className={`${storeStyles.option} ${storeStyles.spirit}`}>
   <div className={storeStyles.heading}><Icon name="heart"/><div><h3>Spirit wear</h3><span className={storeStyles.provider}>BSN Sports</span></div></div>
   <p>Show your Saints spirit.</p>
   <div className={storeStyles.links}><ExternalLink href={spirit.url} className="text-link">Shop spirit wear</ExternalLink></div>
  </article>
  <article className={`${storeStyles.option} ${storeStyles.uniforms}`}>
   <div className={storeStyles.heading}><Icon name="shirt"/><div><h3>School uniforms</h3><span className={storeStyles.provider}>FlynnO’Hara</span></div></div>
   <p>Find the school’s uniform collection.</p>
   <div className={storeStyles.links}><ExternalLink href={uniforms.url} className="text-link">Shop uniforms</ExternalLink><Link href="/dress-code" className="text-link">Dress code →</Link></div>
  </article>
 </div>;
}
export default function Resources(){return <div className="resources-page"><Heading eyebrow="ONE PLACE TO START" title="Family resources">School information, everyday essentials and your school accounts.</Heading><div className={helpStyles.resourceHelp}><span>Questions about school life?</span><Link href="/updates#help-tasks">Find the right help →</Link></div>{resourceGroups.map(group=><section className="resource-section" key={group} id={group==='School store'?'school-store':group==='School accounts'?'school-accounts':undefined}><h2>{group}</h2>{group==='School accounts'&&<p className="fine-print">These services open outside the app. Sign in with the account you use for each provider.</p>}{group==='School store'?<SchoolStore/>:<div className="resource-grid">{resources.filter(r=>r.group===group).map(resource=><ResourceCard key={resource.id} resource={resource}/>)}</div>}</section>)}<HelpCard/></div>}

