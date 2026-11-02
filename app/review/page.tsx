import Link from 'next/link';
import {reviewViews,pickupSteps,parentTasks,schoolWorkflows,reviewState,reviewHref} from './review-data.mjs';
import styles from './review.module.css';
export const metadata={title:'School review'};
export default async function SchoolReview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const state=reviewState(await searchParams);const stepIndex=pickupSteps.findIndex(item=>item.id===state.step);const step=pickupSteps[stepIndex];
 return <div className={styles.page}>
  <Link className={styles.secondaryButton} href="/">← Parent app</Link>
  <header className={styles.header}><div><span className={styles.eyebrow}>SCHOOL REVIEW</span><h1>A simpler school day.</h1><p>A practical parent hub, built around the school’s existing systems.</p></div><span className={styles.status}>Independent proposal · Approval pending</span></header>
  <nav className={styles.tabs} aria-label="Review views">{reviewViews.map(view=><Link key={view.id} href={reviewHref(view.id)} aria-current={state.view===view.id?'page':undefined}>{view.title}</Link>)}</nav>
  {state.warning&&<p className={styles.note} role="status">That review selection is unavailable. Choose a view above.</p>}
  <section className={styles.panel} aria-labelledby="review-panel-title">
  {state.view==='parent'?<>
   <div className={styles.panelHeading}><div><span className={styles.eyebrow}>AVAILABLE IN THIS PREVIEW</span><h2 id="review-panel-title">Try the parent experience</h2></div><span className={styles.status}>No app sign-in</span></div>
   <div className={styles.taskGrid}>{parentTasks.map(task=><Link key={task.href} className={styles.task} href={task.href}><h3>{task.title}</h3><p>{task.detail}</p><strong>{task.label} <span aria-hidden="true">→</span></strong></Link>)}</div>
   <p className={styles.note}>Email opens the parent’s email app. Private accounts and purchases stay with their providers.</p>
  </>:state.view==='school'?<>
   <div className={styles.panelHeading}><div><span className={styles.eyebrow}>UPDATE ONCE</span><h2 id="review-panel-title">Staff keep their existing apps</h2></div></div>
   <p className={styles.note}>Plan around Alma as the primary school system, pending school confirmation. Staff publish once; the parent app receives supported, authorized information—not a second staff inbox.</p>
   <div className={styles.sourceList}>{schoolWorkflows.map(flow=><article className={styles.sourceRow} key={flow.title}><div className={styles.sourceTitle}><h3>{flow.title}</h3><span className={styles.status}>{flow.status}</span><p className={styles.sourceMeta}>{flow.owner}</p></div><div><p><strong>School workflow</strong><br/>{flow.action}</p><p><strong>Parent experience</strong><br/>{flow.result}</p></div></article>)}</div>
   <div className={styles.proposal}><h3>Fewer sign-ins, without sharing passwords</h3><p>Keep public tasks open. For private services, use a persistent school-approved family account and provider-supported single sign-on where available. Shared sign-in has not been connected or confirmed.</p></div>
  </>:<>
   <div className={styles.panelHeading}><div><span className={styles.eyebrow}>PROPOSED DISMISSAL CONNECTION</span><h2 id="review-panel-title">A coordinated pickup experience</h2></div><span className={styles.status}>Proposed integration · Not live</span></div>
   <p className={styles.note}>Walk through the proposed process. No arrival or release is recorded.</p>
   <nav className={styles.steps} aria-label="Proposed pickup steps">{pickupSteps.map((item,index)=><Link className={styles.step} key={item.id} href={reviewHref('pickup',item.id)+'#pickup-step-title'} aria-current={state.step===item.id?'step':undefined}><span className={styles.stepNumber}>{index+1}</span><span>{item.title}</span></Link>)}</nav>
   <section id="pickup-step" className={styles.stepBody} aria-labelledby="pickup-step-title"><h3 id="pickup-step-title" tabIndex={-1}>{stepIndex+1}. {step.title}</h3><div className={styles.taskGrid}><div><h4>Parent experience</h4><p>{step.parent}</p></div><div><h4>Staff responsibility</h4><p>{step.staff}</p></div></div></section>
   <div className={styles.actions}>{stepIndex>0&&<Link className={styles.secondaryButton} href={reviewHref('pickup',pickupSteps[stepIndex-1].id)+'#pickup-step-title'}>← Previous step</Link>}<Link className={styles.primaryButton} href={reviewHref('pickup',pickupSteps[(stepIndex+1)%pickupSteps.length].id)+'#pickup-step-title'}>{stepIndex===pickupSteps.length-1?'Review from the start':'View next step →'}</Link></div>
   <div className={styles.proposal}><h3>School decisions before a pilot</h3><ul><li>Confirm the dismissal product, supported connection and responsible staff.</li><li>Approve guardian verification, pickup restrictions and the school’s handoff policy.</li><li>Test staff access, exceptions, offline fallback and the release audit trail.</li></ul></div>
  </>}
  </section>
 </div>;
}
