import Link from 'next/link';
import SectionBanner from '../section-banner';
import ResourceFinder from './resource-finder';
import storeStyles from './store.module.css';
import styles from './resources.module.css';
import {ResourceCard,Icon} from '../components';
import {resources,resourceGroups} from '../school-data.mjs';
export const metadata={title:'Resources'};
function SchoolStore(){return <div className={storeStyles.store}><Link href="/store" className="resource-card"><span className="icon-tile"><Icon name="shirt"/></span><span><strong>The Saints Store</strong><span className="resource-detail">Spirit wear & senior design preview</span></span></Link></div>;}
const groups=['School accounts','Pickup',...resourceGroups.filter(group=>group!=='School accounts')];
export default function Resources(){return <div className={`resources-page ${styles.page}`}>
 <SectionBanner title="Family resources" description="School accounts, everyday essentials and helpful information." image="/campus/library.webp"/>
 <ResourceFinder shortcuts={<nav className={styles.help} aria-label="Related parent tools"><Link href="/parent-actions">Parent actions</Link><Link href="/faq">Parent FAQ</Link><Link href="/updates#help-tasks">Contact & help</Link></nav>}>
  <div className={styles.groups}>{groups.map(group=>group==='Pickup'?<section className="resource-section" key={group} aria-labelledby="pickup-resource"><h2 id="pickup-resource">Pickup</h2><Link href="/pickup" className="resource-card"><span className="icon-tile"><Icon name="clock"/></span><span><strong>Pickup & dismissal</strong><span className="resource-detail">Entrances by grade, maps & school contacts</span></span></Link></section>:<section className="resource-section" key={group} id={group==='School store'?'school-store':group==='School accounts'?'school-accounts':undefined}><h2>{group==='Everyday essentials'?'Meals':group==='School information'?'Forms & dress code':group}</h2>{group==='School accounts'&&<p className="fine-print">These services open outside the app. Sign in with the account you use for each provider.</p>}{group==='School store'?<SchoolStore/>:<div className="resource-grid">{resources.filter(r=>r.group===group&&!['meal-info','supplies','staff'].includes(r.id)).map(resource=><ResourceCard key={resource.id} resource={resource.id==='forms'?{...resource,title:'Forms & school supplies',detail:'Ask the office for current forms and supply lists.'}:resource}/>)}</div>}</section>)}</div>
 </ResourceFinder>
 <section className={styles.campusRow} aria-labelledby="library-heading"><div><h2 id="library-heading">School library</h2><p>Find a book in the school’s library catalog.</p><a href="https://stjohnocala.follettdestiny.com/">Search the library catalog</a></div></section>
</div>}
