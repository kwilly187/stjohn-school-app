import Link from 'next/link';
import {Heading} from '../components';
import FaqExplorer from './faq-explorer';
export const metadata={title:'Parent FAQ'};
export default function FaqPage(){return <><Link className="text-link" href="/resources">Resources</Link><Heading eyebrow="PARENT HELP" title="Frequently asked questions">Quick answers for school life.</Heading><FaqExplorer/></>}
