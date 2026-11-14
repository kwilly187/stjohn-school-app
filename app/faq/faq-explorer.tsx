'use client';
import {useState} from 'react';
import Link from 'next/link';
import {faqCategories,searchFaq} from './faq-data.mjs';
import styles from './faq.module.css';
type Answer=ReturnType<typeof searchFaq>[number];
function Question({item,view}:{item:Answer,view:string}){return <details key={`${view}:${item.id}`} className={styles.item}><summary>{item.question}<span className={styles.indicator} aria-hidden="true"/></summary><div className={styles.answer}><p>{item.answer}</p><div className={styles.actions}>{item.action.href.startsWith('/')?<Link className="button" href={item.action.href}>{item.action.label}</Link>:<a className="button" href={item.action.href}>{item.action.label}</a>}{item.source!==item.action.href&&<a className="text-link" href={item.source}>More details</a>}</div></div></details>}
export default function FaqExplorer(){
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('All');
 const matches=searchFaq(query,category);
 const browsing=category==='All'&&!query.trim();
 const clear=()=>{setQuery('');setCategory('All');document.getElementById('faq-search')?.focus();};
 return <section aria-label="Parent questions"><div className={styles.search}><label htmlFor="faq-search">Find an answer</label><div className={styles.searchRow}><input id="faq-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} maxLength={120} placeholder="Lunch, uniforms, sports…" autoComplete="off" aria-controls="faq-results"/>{query&&<button type="button" onClick={()=>{setQuery('');document.getElementById('faq-search')?.focus()}}>Clear search</button>}</div></div><div className={styles.categories} aria-label="FAQ topics">{faqCategories.map(topic=><button key={topic} type="button" aria-pressed={category===topic} onClick={()=>setCategory(topic)}>{topic==='All'?'All topics':topic}</button>)}</div><p className={styles.count} role="status">{matches.length} {matches.length===1?'answer':'answers'}{browsing?' by topic':''}</p><div id="faq-results" className={browsing?styles.topicResults:styles.results}>
 {browsing?faqCategories.filter(topic=>topic!=='All').map(topic=>{const items=matches.filter(item=>item.category===topic);return <details key={topic} className={styles.topic}><summary><span>{topic}</span><span className={styles.topicCount}>{items.length} {items.length===1?'answer':'answers'}</span><span className={styles.indicator} aria-hidden="true"/></summary><div className={styles.topicQuestions}>{items.map(item=><Question key={item.id} item={item} view={topic}/>)}</div></details>}):matches.map(item=><Question key={`${category}:${query}:${item.id}`} item={item} view={`${category}:${query}`}/>)}
 </div>{!matches.length&&<div className={styles.empty}><h2>No matching answers</h2><p>Try another topic or contact the school.</p><button className="button" type="button" onClick={clear}>Show all questions</button></div>}<div className={styles.help}><div><h2>Still need help?</h2><p>The school office can point you in the right direction.</p></div><Link href="/updates#contact-heading" className="text-link">Contact the school</Link></div></section>
}
