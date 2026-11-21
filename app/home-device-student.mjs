export const STORAGE_KEY='stjohn:home-device-student:v1';
export const CHANGE_EVENT='stjohn:home-device-student-change';
const validName=/^[\p{L}][\p{L}\p{M}'’ -]*$/u;
export function normalizeDeviceStudent(name,grade){
 const clean=typeof name==='string'?name.trim().replace(/ +/g,' '):'';
 return clean.length<=28&&validName.test(clean)&&Number.isInteger(grade)&&grade>=1&&grade<=12?{name:clean,grade}:null;
}
export function parseDeviceStudent(raw){
 try{const value=JSON.parse(raw||'null');return value?normalizeDeviceStudent(value.name,value.grade):null;}catch{return null;}
}
export function readDeviceStudentSnapshot(){try{return window.localStorage.getItem(STORAGE_KEY)||'';}catch{return '';}}
export function subscribeDeviceStudent(notify){
 const fromStorage=event=>{if(event.key===STORAGE_KEY||event.key===null)notify();};
 window.addEventListener('storage',fromStorage);window.addEventListener(CHANGE_EVENT,notify);
 return()=>{window.removeEventListener('storage',fromStorage);window.removeEventListener(CHANGE_EVENT,notify);};
}
export function saveDeviceStudent(value){
 try{
  if(value){const normalized=normalizeDeviceStudent(value.name,value.grade);if(!normalized)return false;window.localStorage.setItem(STORAGE_KEY,JSON.stringify(normalized));}
  else window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));return true;
 }catch{return false;}
}
