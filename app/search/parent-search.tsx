'use client';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {portalSearchState,portalSearchHref} from './search-state.mjs';
import Link from 'next/link';
import {searchKinds,searchParentPortal} from './search-data.mjs';
import styles from './search.module.css';
export default function ParentSearch(){
 const params=useSearchParams();const {query,kind}=portalSearchState(params.getAll('q').length===1?params.get('q'):null,params.getAll('kind').length===1?params.get('kind'):null);const input=useRef<HTMLInputElement>(null);const update=(q:string,k:string)=>window.history.replaceState(null,'',portalSearchHref(q,k));const setQuery=(q:string)=>update(q,kind);const setKind=(k:string)=>update(query,k);
 const [visibleCount,setVisibleCount]=useState(20);useEffect(()=>setVisibleCount(20),[query,kind]);
 const matches=searchParentPortal(query,kind);const clear=()=>{update('','All');input.current?.focus()};
 return <section aria-label="Search the parent portal">
 <div className={styles.search}><label htmlFor="parent-search">What do you need?</label><div><input ref={input} id="parent-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} maxLength={120} autoComplete="off" placeholder="Lunch, tuition, a teacher’s name…" aria-controls="parent-search-results"/>{query&&<button type="button" onClick={clear}>Clear</button>}</div></div>
 {!query.trim()?<div className={styles.topics}><h2>Common needs</h2>{['Lunch','Tuition','Uniforms','Aftercare','Sports','Forms','Volunteering'].map(topic=><button key={topic} type="button" onClick={()=>{setQuery(topic);input.current?.focus()}}>{topic}</button>)}</div>:<>
 <div className={styles.filters} role="group" aria-label="Result type">{searchKinds.map(value=><button type="button" key={value} aria-pressed={kind===value} onClick={()=>setKind(value)}>{value}</button>)}</div>
 <p className={styles.count} role="status">{matches.length} {matches.length===1?'result':'results'}{matches.length>visibleCount?` · Showing ${visibleCount}`:''}</p>
 <div id="parent-search-results" className={styles.results}>{matches.slice(0,visibleCount).map(item=><article key={item.id}><span>{item.kind}</span><h2>{item.title}</h2><p>{item.description}</p>{item.href.startsWith('/')?<Link href={item.href}>{item.label}</Link>:<a href={item.href}>{item.label}</a>}</article>)}</div>
 {matches.length>visibleCount&&<button type="button" className="button" onClick={()=>setVisibleCount(count=>count+20)}>Show more results</button>}
 {!matches.length&&<div className={styles.empty}><h2>No matches</h2><p>Try a shorter search, a different category or contact the school office.</p><button type="button" onClick={clear}>Start again</button><Link href="/updates#contact-heading">Contact the office</Link></div>}
 </>}
 <p className={styles.note}>Search covers school information and public contacts. Check Alma for private student records.</p>
 </section>;
}
