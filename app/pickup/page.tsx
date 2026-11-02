import Link from 'next/link';
import {pickupSteps,reviewState} from '../review/review-data.mjs';
import styles from '../review/review.module.css';
export const metadata={title:'Pickup'};
const stepHref=(step:string)=>'/pickup?'+new URLSearchParams({step}).toString()+'#pickup-step-title';
export default async function Pickup({searchParams}:{searchParams:Promise<{step?:string|string[]}>}){
 const params=await searchParams;const state=reviewState({view:'pickup',step:params.step});
 const index=pickupSteps.findIndex(item=>item.id===state.step);const step=pickupSteps[index];
 return <div className={styles.page}>
 <Link href="/" className={styles.secondaryButton}>← Home</Link>
 <header className={styles.header}><div><span className={styles.eyebrow}>END OF THE SCHOOL DAY</span><h1>Pickup</h1><p>A look at the proposed pickup experience.</p></div><span className={styles.status}>Proposed · Not connected</span></header>
 <p className={styles.note}>This walkthrough does not record arrivals or authorize a student’s release.</p>
 {state.warning&&<p role="status" className={styles.note}>That step isn’t available. Start with Arrival below.</p>}
 <nav className={styles.steps} aria-label="Pickup walkthrough">{pickupSteps.map((item,i)=><Link key={item.id} className={styles.step} href={stepHref(item.id)} aria-current={state.step===item.id?'step':undefined}><span className={styles.stepNumber}>{i+1}</span><span>{item.title}</span></Link>)}</nav>
 <section className={styles.stepBody} aria-labelledby="pickup-step-title"><h2 id="pickup-step-title" tabIndex={-1}>{step.title}</h2><p>{step.parent}</p><p className={styles.note}>{step.staff}</p></section>
 <div className={styles.actions}>{index>0&&<Link className={styles.secondaryButton} href={stepHref(pickupSteps[index-1].id)}>← Previous step</Link>}<Link className={styles.primaryButton} href={stepHref(pickupSteps[(index+1)%pickupSteps.length].id)}>{index===pickupSteps.length-1?'Review from the start':'View next step →'}</Link></div>
 <Link className={styles.secondaryButton} href="/updates#contact-heading">Ask the school office about pickup →</Link>
 </div>;
}
