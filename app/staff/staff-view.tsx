'use client';
import {useEffect,useMemo,useState,useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import {staffFilterState,staffFilterHref,staffPage} from './staff-state.mjs';
import {filterStaff} from './staff-data.mjs';
import Link from 'next/link';
import styles from './staff.module.css';
type Staff={id:string;name:string;roles:{role:string;department:string}[];departments:string[];email:string|null;contactNeedsConfirmation:boolean};
export default function StaffView({staff,departments}:{staff:Staff[];departments:string[]}){
  const params=useSearchParams();
  const urlState=staffFilterState({q:params.getAll('q').length===1?params.get('q'):undefined,department:params.getAll('department').length===1?params.get('department'):undefined,page:params.getAll('page').length===1?params.get('page'):undefined});
  const [query,setQuery]=useState(urlState.query);
  const department=urlState.department;
  const focusPage=useRef(false);
  useEffect(()=>setQuery(urlState.query),[urlState.query]);
  const update=(nextQuery:string,nextDepartment:string)=>{setQuery(nextQuery);window.history.replaceState(null,'',staffFilterHref({query:nextQuery,department:nextDepartment}));};
  const results=useMemo(()=>filterStaff(staff,query,department),[staff,query,department]);
  const pagination=staffPage(results.length,urlState.page);
  const visible=results.slice(pagination.start,pagination.end);
  useEffect(()=>{if(params.has('page')&&params.get('page')!==String(pagination.page)){window.history.replaceState(null,'',staffFilterHref({query,department,page:pagination.page}));}},[params,pagination.page,query,department]);
  useEffect(()=>{if(focusPage.current){focusPage.current=false;const heading=document.getElementById('staff-result-heading');heading?.focus();heading?.scrollIntoView({block:'start'});}},[pagination.page]);
  const goPage=(page:number)=>{focusPage.current=true;window.history.pushState(null,'',staffFilterHref({query,department,page}));};
  const pager=(label:string)=>pagination.pages>1?<nav className={styles.pager} aria-label={label}><button type="button" disabled={pagination.page===1} onClick={()=>goPage(pagination.page-1)}>Previous</button><span>Page {pagination.page} of {pagination.pages}</span><button type="button" disabled={pagination.page===pagination.pages} onClick={()=>goPage(pagination.page+1)}>Next</button></nav>:null;
  const reset=()=>{update('','all');document.getElementById('staff-search')?.focus();};
  return <section aria-label="Search the staff directory">
    <div className={styles.controls}>
      <div className={styles.search}><label htmlFor="staff-search">Search staff</label><input id="staff-search" type="search" value={query} maxLength={120} onChange={event=>update(event.target.value,department)} placeholder="Name or role" autoComplete="off" aria-controls="staff-results"/></div>
      {departments.length>0 && <div className={styles.department}><label htmlFor="staff-department">Department</label><select id="staff-department" value={department} onChange={event=>update(query,event.target.value)} aria-controls="staff-results"><option value="all">All departments</option>{departments.map(item=><option key={item} value={item}>{item}</option>)}</select></div>}
    </div>
    <div className={styles.resultsHeading} id="staff-result-heading" tabIndex={-1}><p role="status" aria-live="polite">{results.length>0?`${pagination.start+1}–${pagination.end} of ${results.length}`:'0'} {results.length===1?'staff contact':'staff contacts'}{department!=='all'?` · ${department}`:''}</p>{(query||department!=='all')&&<button onClick={reset} type="button">Clear filters</button>}</div>
    {pager('Staff pages')}
    <div id="staff-results" className={styles.list}>
      {results.length>0?visible.map((person:Staff)=><article className={styles.person} key={person.id}>
        <div className={styles.personHeading}><h2>{person.name}</h2></div>
        <ul className={styles.roles}>{person.roles.map(item=><li key={`${item.department}/${item.role}`}>{department!==item.department&&<span className={styles.group}>{item.department}</span>}<span className={styles.role}>{item.role}</span></li>)}</ul>
        {person.email&&!person.contactNeedsConfirmation?<a className={styles.email} href={`mailto:${person.email}`} aria-label={`Email ${person.name} at ${person.email}`}><span>{person.email}</span><span aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7M7 7h10v10"/></svg></span></a>:<p className={styles.noEmail}>{person.contactNeedsConfirmation?'Confirm this contact with the school office.':'Contact the school office for email information.'} <Link className={styles.officeLink} href="/updates#contact-heading">Contact office</Link></p>}
      </article>):<div className={styles.empty}><h2>No staff match those filters</h2><p>Try a different name or role, or see the full directory.</p><button onClick={reset} type="button">Show all staff</button></div>}
    </div>
    {pager('Staff pages below results')}
    <p className={styles.emailNote}>Email opens in your email app.</p>
  </section>;
}
