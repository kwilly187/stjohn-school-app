'use client';
import {useEffect,useState} from 'react';
import {dailyScripture} from './daily-scripture-data.mjs';
import styles from './daily-scripture.module.css';
export default function DailyScriptureCard({initialDate}:{initialDate:string}){
 const [reading,setReading]=useState(()=>dailyScripture(new Date(initialDate)));
 useEffect(()=>{
  const refresh=()=>setReading(dailyScripture());
  refresh();
  const timer=window.setInterval(refresh,60000);
  document.addEventListener('visibilitychange',refresh);
  return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',refresh)};
 },[]);
 return <section className={styles.card} aria-labelledby="daily-scripture-title">
  <div className={styles.heading}><h2 id="daily-scripture-title">Daily Scripture</h2><span>World English Bible</span></div>
  <blockquote>{reading.text}</blockquote>
  <a href={reading.source} target="_blank" rel="noreferrer" aria-label={`Read ${reading.reference} in context`}>{reading.reference}</a>
 </section>;
}
