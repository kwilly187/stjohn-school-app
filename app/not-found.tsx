import Link from 'next/link';
export default function NotFound(){
 return <section className="page-heading" aria-labelledby="not-found-heading"><span className="eyebrow">PAGE NOT FOUND</span><h1 id="not-found-heading">Let’s get you back.</h1><p>This link may have changed. Find school information from Home or Resources.</p><div className="help-actions"><Link className="button" href="/">Back to home</Link><Link className="text-link" href="/resources">School resources</Link></div></section>;
}
