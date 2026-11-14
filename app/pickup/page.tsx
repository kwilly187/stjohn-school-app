import Link from 'next/link';
import {Heading} from '../components';
import {school} from '../school-data.mjs';
export const metadata={title:'Pickup'};
export default function Pickup(){return <><Link className="text-link" href="/">Home</Link><Heading eyebrow="END OF THE SCHOOL DAY" title="Pickup & dismissal">Contact the school office for pickup questions or changes.</Heading><section className="help-card"><div><h2>Need help with pickup?</h2><p>For a time-sensitive change, call the school office. Arrival check-in is not available here.</p></div><div className="help-actions"><a className="button" href={school.phone}>Call {school.phoneDisplay}</a><Link className="text-link" href="/updates#contact-heading">School contacts</Link></div></section></>}
