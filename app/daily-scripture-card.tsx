import {dailyScripture} from './daily-scripture-data.mjs';
import styles from './daily-scripture.module.css';
export default function DailyScriptureCard({initialDate,compact=false}:{initialDate:string,compact?:boolean}){
 const reading=dailyScripture(new Date(initialDate));
 return <section className={`${styles.card} ${compact?styles.compact:''}`} aria-labelledby="daily-scripture-title">
  <div className={styles.heading}><h2 id="daily-scripture-title">Daily Scripture</h2>{!compact&&<span>World English Bible</span>}</div>
  <blockquote>{reading.text}{compact&&<> <a href={reading.source} target="_blank" rel="noreferrer" aria-label={`Read ${reading.reference} in the World English Bible`}>{reading.reference} (WEB)</a></>}</blockquote>
  {!compact&&<a href={reading.source} target="_blank" rel="noreferrer" aria-label={`Read ${reading.reference} in context`}>{reading.reference}</a>}
 </section>;
}
