'use client';
import {useEffect,useRef} from 'react';
import {useRouter} from 'next/navigation';
import {schoolDate,TIME_ZONE} from './school-weather-data.mjs';
import {schoolDateKey} from './devotion-selection.mjs';
export default function SchoolDayDate({initialDate}:{initialDate:string}){
 const router=useRouter(),requestedDay=useRef<string|null>(null);
 const renderedDay=schoolDateKey(new Date(initialDate),TIME_ZONE);
 useEffect(()=>{
  const update=()=>{
   if(document.visibilityState==='hidden')return;
   const today=schoolDateKey(new Date(),TIME_ZONE);
   if(today<=renderedDay||requestedDay.current===today)return;
   requestedDay.current=today;
   router.refresh();
  };
  const retryOnline=()=>{requestedDay.current=null;update();};
  update();
  const timer=window.setInterval(update,60000);
  document.addEventListener('visibilitychange',update);
  window.addEventListener('pageshow',update);
  window.addEventListener('online',retryOnline);
  return ()=>{
   window.clearInterval(timer);
   document.removeEventListener('visibilitychange',update);
   window.removeEventListener('pageshow',update);
   window.removeEventListener('online',retryOnline);
  };
 },[renderedDay,router]);
 // Keep the date in step with the server-rendered agenda, not ahead of it.
 return <time dateTime={initialDate} title="School date · Eastern Time">{schoolDate(initialDate)}</time>;
}
