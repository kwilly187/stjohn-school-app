'use client';
import {useState} from 'react';
import Link from 'next/link';
import useDeviceStudent from '../home-device-student-hook';
import {normalizeDeviceStudent,saveDeviceStudent} from '../home-device-student.mjs';
import styles from './students.module.css';

export default function HomePersonalization(){
 const student=useDeviceStudent();
 const [name,setName]=useState('');
 const [grade,setGrade]=useState('');
 const [status,setStatus]=useState('');
 function save(){
  const candidate=normalizeDeviceStudent(name,Number(grade));
  if(!candidate){setStatus('Enter a first name or nickname and select a grade.');return;}
  if(!saveDeviceStudent(candidate)){setStatus('This browser could not save the preference.');return;}
  setStatus('Personalization saved on this device.');
 }
 function clear(){
  if(!saveDeviceStudent(null)){setStatus('This browser could not clear the preference.');return;}
  setName('');setGrade('');setStatus('Personalization cleared on this device.');
 }
 return <details className={styles.devicePersonalization} onToggle={event=>{if(event.currentTarget.open){setName(student?.name||'');setGrade(student?String(student.grade):'');}}}>
  <summary>Personalize this device</summary>
  <p>Choose a first name or nickname and grade to personalize Home. This stays in this browser, is visible to anyone using it, and does not connect to student records.</p>
  <form onSubmit={event=>{event.preventDefault();save();}}>
   <label>First name or nickname<input value={name} maxLength={28} autoComplete="off" onChange={event=>setName(event.target.value)} required/></label>
   <label>Grade<select value={grade} onChange={event=>setGrade(event.target.value)} required><option value="">Select a grade</option>{Array.from({length:12},(_,index)=>index+1).map(value=><option key={value} value={value}>Grade {value}</option>)}</select></label>
   <div className={styles.deviceActions}><button type="submit" className="button">Save on this device</button>{student&&<button type="button" onClick={clear}>Clear personalization</button>}</div>
  </form>
  <p role="status">{status}</p>
  {student&&<p><Link href="/">View Home</Link></p>}
 </details>;
}
