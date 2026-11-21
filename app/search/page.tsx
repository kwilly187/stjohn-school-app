import {Suspense} from 'react';
import {Heading} from '../components';
import ParentSearch from './parent-search';
export const metadata={title:'Find what you need'};
export default function SearchPage(){return <><Heading eyebrow="ST. JOHN PARENT PORTAL" title="Find what you need">School actions, answers, resources and contacts in one place.</Heading><Suspense fallback={<p role="status">Loading search…</p>}><ParentSearch/></Suspense></>}
