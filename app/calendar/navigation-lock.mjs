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

/** Same-period buttons must not claim the transition lock: Next.js can skip an
 * identical URL without ever rendering a pending transition.
 * @param {{current:boolean}} lock
 * @param {string} currentHref
 * @param {string} nextHref
 * @param {()=>void} navigate
 */
export function navigateCalendarTo(lock,currentHref,nextHref,navigate){
 if(currentHref===nextHref)return false;
 return navigateCalendarOnce(lock,navigate);
}
