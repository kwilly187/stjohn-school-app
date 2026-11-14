'use client';
import {useState} from 'react';
import Link from 'next/link';
import {faqCategories,searchFaq} from './faq-data.mjs';
import styles from './faq.module.css';
export default function FaqExplorer(){
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('All');
 const matches=searchFaq(query,category);
 const clear=()=>{setQuery('');setCategory('All');document.getElementById('faq-search')?.focus();};
 return <section aria-label="Parent questions"><div className={styles.search}><label htmlFor="faq-search">Find an answer</label><div className={styles.searchRow}><input id="faq-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} maxLength={120} placeholder="Lunch, uniforms, sports…" autoComplete="off" aria-controls="faq-results"/>{query&&<button type="button" onClick={()=>setQuery('')}>Clear search</button>}</div></div><div className={styles.categories} aria-label="FAQ topics">{faqCategories.map(topic=><button key={topic} type="button" aria-pressed={category===topic} onClick={()=>setCategory(topic)}>{topic}</button>)}</div><p className={styles.count} role="status">{matches.length} {matches.length===1?'answer':'answers'}</p><div id="faq-results" className={styles.results}>{matches.map(item=><details key={`${category}:${query}:${item.id}`} className={styles.item}><summary>{item.question}<span className={styles.indicator} aria-hidden="true"/></summary><div className={styles.answer}><p>{item.answer}</p><div className={styles.actions}>{item.action.href.startsWith('/')?<Link className="button" href={item.action.href}>{item.action.label}</Link>:<a className="button" href={item.action.href}>{item.action.label}</a>}<a className="text-link" href={item.source}>School details</a></div></div></details>)}</div>{!matches.length&&<div className={styles.empty}><h2>No matching answers</h2><p>Try another topic or contact the school.</p><button className="button" type="button" onClick={clear}>Show all questions</button></div>}<div className={styles.help}><div><h2>Still need help?</h2><p>The school office can point you in the right direction.</p></div><Link href="/updates#contact-heading" className="text-link">Contact the school</Link></div></section>
}
