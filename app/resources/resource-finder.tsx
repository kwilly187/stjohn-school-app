'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ResourceCard} from '../components';
import {resources} from '../school-data.mjs';
import {searchResources,nativeResourceActions} from './resource-search.mjs';
import styles from './resource-finder.module.css';
export default function ResourceFinder({children}:{children:React.ReactNode}){
 const [query,setQuery]=useState('');
 const searching=query.trim().length>0;
 const matches:typeof resources=searchResources([...resources,...nativeResourceActions],query);
 const clear=()=>{setQuery('');document.getElementById('resource-search')?.focus();};
 return <><div className={styles.search}><label htmlFor="resource-search">Find a resource</label><div className={styles.row}><input id="resource-search" type="search" value={query} maxLength={120} onChange={event=>setQuery(event.target.value)} placeholder="Lunch, grades, uniforms…" aria-controls="resource-results" autoComplete="off"/>{query&&<button type="button" onClick={clear}>Clear</button>}</div></div><div id="resource-results">{searching?<section aria-label="Matching resources"><p className={styles.count} role="status" aria-live="polite">{matches.length} {matches.length===1?'resource':'resources'} found</p>{matches.length?<div className="resource-grid">{matches.map(resource=><ResourceCard key={resource.id} resource={resource}/>)}</div>:<div className={styles.empty}><h2>No matching resources</h2><p>Try another word or ask the school office.</p><div className={styles.actions}><button type="button" className="button" onClick={clear}>Show all resources</button><Link className="text-link" href="/updates#contact-heading">Contact the school</Link></div></div>}</section>:children}</div></>;
}
