'use client';
import {useState} from 'react';
import {eventCalendarFile,eventCalendarFilename} from './event-export.mjs';
import styles from './calendar.module.css';
import {publicCalendarShareUrl} from './share-event.mjs';
type Event={id:string,title:string,start:string,end:string,allDay:boolean,location:string|null};
export default function SaveEvent({event,source}:{event:Event,source:string}){
 const [error,setError]=useState(false);
 const [shareMessage,setShareMessage]=useState('');
 const [copyLink,setCopyLink]=useState('');
 const [sharing,setSharing]=useState(false);
 const share=async()=>{
  if(sharing)return;
  setSharing(true);setShareMessage('');setCopyLink('');
  let url='';
  try{
   url=publicCalendarShareUrl(window.location.href);
   if(navigator.share){
    try{await navigator.share({title:event.title,url});return;}
    catch(error){if(error instanceof Error&&error.name==='AbortError')return;}
   }
   try{await navigator.clipboard.writeText(url);setShareMessage('Event link copied.');}
   catch{setCopyLink(url);setShareMessage('Copy the event link below.');}
  }catch{setShareMessage('Event link couldn’t be prepared. Please reopen the event.');}
  finally{setSharing(false);}
 };
 const save=()=>{let url:string|undefined;try{const file=eventCalendarFile(event,{source});url=URL.createObjectURL(new Blob([file],{type:'text/calendar;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=eventCalendarFilename(event.title);document.body.appendChild(link);link.click();link.remove();setError(false);const used=url;setTimeout(()=>URL.revokeObjectURL(used),60000);}catch{if(url)URL.revokeObjectURL(url);setError(true);}};
 return <div className={styles.saveEvent}><button onClick={save}>Save to calendar</button><button className={styles.shareAction} type="button" disabled={sharing} onClick={share}>Share event</button><span>Saved copy · doesn’t update automatically</span><p className={styles.shareStatus} role="status" aria-live="polite">{shareMessage}</p>{copyLink&&<label className={styles.copyLink}>Event link<input readOnly value={copyLink} onFocus={event=>event.currentTarget.select()}/></label>}{error&&<p role="alert">Calendar file couldn’t be prepared. Please try again.</p>}</div>;
}
