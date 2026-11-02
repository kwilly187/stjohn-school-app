/** Claim a navigation synchronously, before React can render pending controls.
 * @param {{current:boolean}} lock
 * @param {()=>void} navigate
 */
export function navigateCalendarOnce(lock,navigate){
 if(lock.current)return false;
 lock.current=true;
 try{navigate();}catch(error){lock.current=false;throw error;}
 return true;
}
