'use client';
import {useMemo,useState} from 'react';
import {filterStaff} from './staff-data.mjs';
import Link from 'next/link';
import styles from './staff.module.css';
type Staff={id:string;name:string;roles:{role:string;department:string}[];departments:string[];email:string|null;contactNeedsConfirmation:boolean};
export default function StaffView({staff,departments}:{staff:Staff[];departments:string[]}){
  const [query,setQuery]=useState('');
  const [department,setDepartment]=useState('all');
  const results=useMemo(()=>filterStaff(staff,query,department),[staff,query,department]);
  const reset=()=>{setQuery('');setDepartment('all');};
  return <section aria-label="Search the staff directory">
    <div className={styles.controls}>
      <div className={styles.search}><label htmlFor="staff-search">Search staff</label><input id="staff-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Name or role" autoComplete="off" aria-controls="staff-results"/></div>
      {departments.length>0 && <div className={styles.department}><label htmlFor="staff-department">Department</label><select id="staff-department" value={department} onChange={event=>setDepartment(event.target.value)} aria-controls="staff-results"><option value="all">All departments</option>{departments.map(item=><option key={item} value={item}>{item}</option>)}</select></div>}
    </div>
    <div className={styles.resultsHeading}><p role="status" aria-live="polite">{results.length} {results.length===1?'staff contact':'staff contacts'}{department!=='all'?` · ${department}`:''}</p>{(query||department!=='all')&&<button onClick={reset} type="button">Clear filters</button>}</div>
    <div id="staff-results" className={styles.list}>
      {results.length>0?results.map((person:Staff)=><article className={styles.person} key={person.id}>
        <div className={styles.personHeading}><h2>{person.name}</h2></div>
        <ul className={styles.roles}>{person.roles.map(item=><li key={`${item.department}/${item.role}`}><span className={styles.group}>{item.department}</span><span className={styles.role}>{item.role}</span></li>)}</ul>
        {person.email&&!person.contactNeedsConfirmation?<a className={styles.email} href={`mailto:${person.email}`} aria-label={`Email ${person.name} at ${person.email}`}><span>{person.email}</span><span aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7M7 7h10v10"/></svg></span></a>:<p className={styles.noEmail}>{person.contactNeedsConfirmation?'Confirm this contact with the school office.':'Contact the school office for email information.'} <Link className={styles.officeLink} href="/updates#contact-heading">Contact office</Link></p>}
      </article>):<div className={styles.empty}><h2>No staff match those filters</h2><p>Try a different name or role, or see the full directory.</p><button onClick={reset} type="button">Show all staff</button></div>}
    </div>
    <p className={styles.emailNote}>Email opens in your email app.</p>
  </section>;
}
