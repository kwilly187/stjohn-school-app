import Link from 'next/link';
import {Heading,ExternalLink} from '../components';
import {resources} from '../school-data.mjs';
import LunchMenu from './view';
export const metadata={title:'Lunch menu'};
export default function Lunch(){const menu=resources.find(resource=>resource.id==='lunch')!;const information=resources.find(resource=>resource.id==='meal-info')!;return <><Link href="/resources" className="text-link lunch-back">← All resources</Link><Heading eyebrow="LUNCH AT SCHOOL" title="What’s for lunch?">The school’s menu, right here.</Heading><LunchMenu menuUrl={menu.url}/><div className="calendar-note"><strong>Menu information comes from Nutrislice.</strong><p>Select an available menu and date in the viewer. For ingredient, allergy or meal-program questions, confirm with the food-service provider.</p><ExternalLink href={information.url} className="text-link">Meal program information</ExternalLink></div></>}
