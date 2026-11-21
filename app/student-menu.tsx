'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {profiles} from './students/profile-config.mjs';
import {Icon} from './components';
import {selectLinkedFamilyStudent} from './linked-family-selection.mjs';
import type {getLocalLinkedFamily} from './linked-family.server.mjs';
export default function StudentMenu({linkedStudents=[]}:{linkedStudents?:ReturnType<typeof getLocalLinkedFamily>}){
 const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);const path=usePathname();
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)};const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus()}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}},[open]);
 return <div className="student-menu" ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false)}}>
  <button ref={trigger} className="student-menu-trigger" type="button" aria-expanded={open} aria-controls="student-navigation" onClick={()=>setOpen(!open)}><Icon name="people"/><span>My Students</span><span className="student-menu-symbol" aria-hidden="true">{open?'−':'+'}</span></button>
  {open&&<nav className="student-menu-panel" id="student-navigation" aria-label="My students" onClick={()=>setOpen(false)}>
    <Link href="/students"><strong>{profiles.length>1?'All My Students':'Student overview'}</strong><span>School account & dates</span></Link>
    {linkedStudents.length>1&&linkedStudents.map(child=><Link key={`linked-${child.id}`} href="/" onClick={()=>selectLinkedFamilyStudent(child.id)}><strong>{child.name}’s day</strong><span>Grade {child.grade}</span></Link>)}
    {profiles.map(child=><Link key={child.id} href={`/students?student=${encodeURIComponent(child.id)}`}><strong>{child.name}</strong><span>Grade {child.grade}</span></Link>)}
    <Link href="/pickup"><strong>Pickup help</strong></Link>
  </nav>}
 </div>
}
