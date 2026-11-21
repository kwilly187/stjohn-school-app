'use client';
import {useEffect,useState} from 'react';
import {schoolDate} from './school-weather-data.mjs';
export default function SchoolDayDate({initialDate}:{initialDate:string}){
 const [date,setDate]=useState(initialDate);
 useEffect(()=>{const update=()=>setDate(new Date().toISOString());update();const timer=setInterval(update,60000);document.addEventListener('visibilitychange',update);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',update);};},[]);
 return <time dateTime={date} title="School date · Eastern Time">{schoolDate(date)}</time>;
}
