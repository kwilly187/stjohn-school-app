'use client';

import {useEffect,useRef,useState,type ReactNode} from 'react';
import {PIN_LIMIT,readPins,shortcutOrder,togglePin,writePins} from './pinned-shortcuts-data.mjs';
import homeStyles from './home.module.css';
import styles from './pinned-shortcuts.module.css';

type Shortcut={id:string;label:string;card:ReactNode;optional?:boolean};

function deviceStorage(){
 try{return window.localStorage;}catch{return undefined;}
}

export default function PinnedShortcuts({heading,items}:{heading:ReactNode;items:Shortcut[]}){
 const [pins,setPins]=useState<string[]>([]);
 const [draft,setDraft]=useState<string[]>([]);
 const [editing,setEditing]=useState(false);
 const [status,setStatus]=useState('');
 const trigger=useRef<HTMLButtonElement>(null);
 const knownIds=items.map(item=>item.id);
 useEffect(()=>{setPins(readPins(deviceStorage(),items.map(item=>item.id)));},[items]);

 function close(){
  setEditing(false);
  trigger.current?.focus();
 }
 function save(){
  const saved=writePins(deviceStorage(),draft,knownIds);
  setPins(draft);
  setStatus(saved?(draft.length?'Shortcuts saved on this device.':'Pins cleared on this device.'):'This browser couldn’t save your pins. These changes apply for this visit only.');
  close();
 }

 const ordered=shortcutOrder(items.filter(item=>!item.optional).map(item=>item.id),pins,knownIds);
 return <>
  <div className={`${homeStyles.sectionHeading} ${styles.heading}`}>
   {heading}
   <button ref={trigger} type="button" aria-expanded={editing} aria-controls="shortcut-editor" onClick={()=>{if(editing){close();return;}setDraft(pins);setStatus('');setEditing(true);}}>{pins.length?'Edit pins':'Pin shortcuts'}</button>
  </div>
  <div id="shortcut-editor" className={styles.editor} hidden={!editing} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close();}}}>
   <fieldset>
    <legend>Choose up to three shortcuts</legend>
    <p>Pinned shortcuts appear first on this device.</p>
    <div className={styles.choices}>
     {items.map(item=>{
      const selected=draft.includes(item.id);
      return <label key={item.id}><input type="checkbox" checked={selected} disabled={!selected&&draft.length>=PIN_LIMIT} onChange={()=>setDraft(value=>togglePin(value,item.id,knownIds))}/>{item.label}</label>;
     })}
    </div>
   </fieldset>
   <div className={styles.controls}><span role="status">{draft.length} of {PIN_LIMIT} selected</span><button type="button" onClick={close}>Cancel</button><button type="button" className={styles.save} onClick={save}>Save</button></div>
  </div>
  <p className={styles.status} role="status">{status}</p>
  <nav className={homeStyles.taskGrid} aria-label="Everyday school tasks">
   {ordered.map(id=>{
    const item=items.find(shortcut=>shortcut.id===id);
    if(!item)return null;
    return <div className={styles.card} key={id}>{item.card}{pins.includes(id)&&<span className={styles.badge} title="Pinned"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 3 6 6-4 1-3 5 1 2-2 2-8-8 2-2 2 1 5-3 1-4ZM9 15l-6 6"/></svg><span className={styles.srOnly}>Pinned</span></span>}</div>;
   })}
  </nav>
 </>;
}
