'use client';
import {useEffect,useState} from 'react';
import {calendarSubscription,calendarSnapshot} from './calendar-transfer.mjs';
import styles from './transfer.module.css';
type Event={id:string;title:string;start:string;end:string;allDay:boolean;location?:string|null};
export default function CalendarTransfer({events,source='activities',selectionLabel='shown events'}:{events:Event[];source?:string;selectionLabel?:string}){
 const [message,setMessage]=useState('');const [manual,setManual]=useState(false);
 const eventSelection=events.map(event=>[event.id,event.start,event.end].join(':')).join('|');
 useEffect(()=>{setMessage('');setManual(false)},[source,eventSelection]);
 const subscription=calendarSubscription(source);
 const copy=async()=>{try{await navigator.clipboard.writeText(subscription.https);setManual(false);setMessage('Subscription link copied. Paste it into your calendar’s subscription or From URL option.');}catch{setManual(true);setMessage('Copy this subscription link into your calendar.');}};
 const download=()=>{let url:string|undefined;try{const file=calendarSnapshot(events,{source});url=URL.createObjectURL(new Blob([file],{type:'text/calendar;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`school-${source}-dates.ics`;document.body.appendChild(link);link.click();link.remove();const used=url;setTimeout(()=>URL.revokeObjectURL(used),60000);setMessage('Calendar file prepared. Import it into your calendar; it will not update automatically.');}catch{if(url)URL.revokeObjectURL(url);setMessage('Calendar file couldn’t be prepared. Please try again.');}};
 return <details className={styles.panel}><summary>Add to my calendar</summary><div className={styles.options}><section><h3>Subscribe to {source==='athletics'?'school athletics':'school activities'}</h3><p>Full public calendar. Updates come from the school; your calendar app controls refresh timing. This is not a child-specific schedule.</p><div className={styles.actions}><a href={subscription.webcal}>Open calendar subscription</a><button type="button" onClick={copy}>Copy subscription link</button></div></section><section><h3>Save {selectionLabel}</h3><p>One-time copy of {events.length} {events.length===1?'event':'events'}. Later changes and cancellations will not sync.</p><button type="button" disabled={!events.length} onClick={download}>Download calendar file</button></section></div><p className={styles.status} role="status" aria-live="polite">{message}</p>{manual&&<label className={styles.manual}>Public subscription link<input readOnly value={subscription.https} onFocus={event=>event.currentTarget.select()}/></label>}</details>;
}
