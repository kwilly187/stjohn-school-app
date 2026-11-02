'use client';
import {useState} from 'react';
import {eventCalendarFile,eventCalendarFilename} from './event-export.mjs';
import styles from './calendar.module.css';
type Event={id:string,title:string,start:string,end:string,allDay:boolean,location:string|null};
export default function SaveEvent({event,source}:{event:Event,source:string}){
 const [error,setError]=useState(false);
 const save=()=>{let url:string|undefined;try{const file=eventCalendarFile(event,{source});url=URL.createObjectURL(new Blob([file],{type:'text/calendar;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=eventCalendarFilename(event.title);document.body.appendChild(link);link.click();link.remove();setError(false);const used=url;setTimeout(()=>URL.revokeObjectURL(used),60000);}catch{if(url)URL.revokeObjectURL(url);setError(true);}};
 return <div className={styles.saveEvent}><button onClick={save}>Save to calendar</button><span>Saved copy · doesn’t update automatically</span>{error&&<p role="alert">Calendar file couldn’t be prepared. Please try again.</p>}</div>;
}
