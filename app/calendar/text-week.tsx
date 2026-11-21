'use client';
import {useEffect,useState} from 'react';
import {calendarWeeks,weekText} from './calendar-week.mjs';
import styles from './text-week.module.css';

type WeekEvent={id:string,title:string,dateText:string,location:string|null};
export default function TextWeek({month,source}:{month:string,source:string}){
 const [open,setOpen]=useState(false);
 const [weeks]=useState(()=>calendarWeeks(month));
 const [start,setStart]=useState(()=>weeks.find(week=>week.current)?.start??weeks[0].start);
 const [events,setEvents]=useState<WeekEvent[]>([]);
 const [selected,setSelected]=useState<string[]>([]);
 const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading');
 const [attempt,setAttempt]=useState(0);
 const [message,setMessage]=useState('');
 const [manual,setManual]=useState(false);
 const [sharing,setSharing]=useState(false);
 const picked=events.filter(event=>selected.includes(event.id));
 const draft=picked.length?weekText({start,source,events:picked}):'';
 const calendar=source==='athletics'?'Athletics':'School & activities';
 const selectWeek=(value:string)=>{setStart(value);setEvents([]);setSelected([]);setStatus('loading');setMessage('');setManual(false);};
 useEffect(()=>{
  if(!open)return;
  const controller=new AbortController();
  const query=new URLSearchParams({source,month,start});
  setStatus('loading');
  fetch(`/calendar/week?${query}`,{signal:controller.signal,cache:'no-store'})
   .then(async response=>{if(!response.ok)throw new Error('Calendar unavailable');return response.json();})
   .then(result=>{if(controller.signal.aborted)return;if(!Array.isArray(result.events))throw new Error('Calendar unavailable');setEvents(result.events);setStatus('ready');})
   .catch(()=>{if(!controller.signal.aborted)setStatus('unavailable');});
  return()=>controller.abort();
 },[open,month,source,start,attempt]);
 const toggle=(id:string)=>{setSelected(previous=>previous.includes(id)?previous.filter(value=>value!==id):[...previous,id]);setMessage('');setManual(false);};
 const copy=async()=>{
  try{await navigator.clipboard.writeText(draft);setManual(false);setMessage('Copied. Paste it into a text to share.');}
  catch{setManual(true);setMessage('Select and copy the preview text.');}
 };
 const share=async()=>{
  setSharing(true);setMessage('');
  try{
   if(navigator.share){await navigator.share({text:draft});return;}
   await copy();
  }catch(error){if(!(error instanceof Error&&error.name==='AbortError'))await copy();}
  finally{setSharing(false);}
 };
 return <details className={styles.panel} onToggle={event=>setOpen(event.currentTarget.open)}>
  <summary>Text the week</summary>
  {open&&<div className={styles.content}>
   <p>Pick events from <strong>{calendar}</strong> and share them in one text.</p>
   <label className={styles.week}>Week<select value={start} onChange={event=>selectWeek(event.target.value)} disabled={sharing}>{weeks.map(week=><option key={week.start} value={week.start}>{week.label}{week.current?' (This week)':''}</option>)}</select></label>
   {status==='loading'?<p role="status">Loading the week…</p>:status==='unavailable'?<div><p role="status">Couldn't load this week. Nothing was shared.</p><button type="button" onClick={()=>{setStatus('loading');setAttempt(count=>count+1);}}>Try again</button></div>:events.length===0?<p role="status">No published events this week.</p>:<fieldset className={styles.events}>
    <legend>Choose events</legend>
    {events.map(event=><label key={event.id}><input type="checkbox" checked={selected.includes(event.id)} onChange={()=>toggle(event.id)} disabled={sharing}/><span><strong>{event.title}</strong><small>{event.dateText}</small></span></label>)}
   </fieldset>}
   {status==='ready'&&draft&&<div className={styles.preview}>
    <label>Text preview<textarea rows={Math.min(9,Math.max(4,picked.length*2+1))} value={draft} readOnly onFocus={event=>{if(manual)event.currentTarget.select();}}/></label>
    <div className={styles.actions}><button type="button" onClick={share} disabled={sharing}>Share text</button><button type="button" onClick={copy} disabled={sharing}>Copy text</button></div>
    <p role="status" className={styles.status}>{message}</p>
   </div>}
  </div>}
 </details>;
}
