import Link from 'next/link';
import {Heading,ExternalLink,Icon} from '../components';
import {resources,school} from '../school-data.mjs';
import styles from './lunch.module.css';
export const metadata={title:'Lunch menu'};
export default function Lunch(){
 const menu=resources.find(resource=>resource.id==='lunch')!;
 const information=resources.find(resource=>resource.id==='meal-info')!;
 const account=resources.find(resource=>resource.id==='lunch-account')!;
 return <>
  <Link href="/resources" className="text-link lunch-back">← All resources</Link>
  <Heading eyebrow="LUNCH AT SCHOOL" title="What’s for lunch?">Menu, meal account and a little help when you need it.</Heading>
  <section className={styles.menu}>
   <div className={styles.menuTitle}><Icon name="lunch"/><div><h2>School lunch menu</h2><p>View the menu on Nutrislice.</p></div></div>
   <div className={styles.menuAction}><a href={menu.url} target="_blank" rel="noopener noreferrer" className="button">Open official menu <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17 17 7M7 7h10v10"/></svg></a><span>Opens Nutrislice in a new tab.</span></div>
  </section>
  <div className={styles.support}>
   <section><h2><Icon name="wallet"/>Meal account</h2><p>Use your existing PaySchools account for meal-account information.</p><ExternalLink href={account.url} className="text-link">Open PaySchools · Sign-in required</ExternalLink></section>
   <section id="meal-help"><h2><Icon name="people"/>Food-service help</h2><p>Menu, ingredient or meal-service questions? Contact Maschio’s food-service team.</p><div className={styles.links}><a className="text-link" href={`mailto:${school.mealHelpEmail}`}>Email food service</a><ExternalLink href={information.url} className="text-link">Meal program information</ExternalLink></div></section>
  </div>
  <p className={styles.note}>Menus are provided by Nutrislice. For ingredient or allergy questions, confirm directly with food-service staff.</p>
 </>;
}
