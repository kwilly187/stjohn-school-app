import {Suspense} from 'react';
import ActionFinder from './action-finder';
export const metadata={title:'Parent actions'};
export default function ParentActions(){return <><header className="page-heading"><h1>Parent actions</h1><p>Payments, registration, forms and ways to get involved.</p></header><Suspense fallback={<p role="status">Loading parent actions…</p>}><ActionFinder/></Suspense></>}
