'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){
 return <section className="page-heading" aria-labelledby="error-heading"><span className="eyebrow">PLEASE TRY AGAIN</span><h1 id="error-heading">This page couldn’t load.</h1><p>Your school accounts haven’t changed. Try again or return home.</p><div className="help-actions"><button className="button" type="button" onClick={reset}>Try again</button><Link className="text-link" href="/">Back to home</Link></div></section>;
}
