// Share only public calendar selection; never include student context or unrelated query values.
export function publicCalendarShareUrl(currentUrl){
 const current=new URL(currentUrl);
 if(!['https:','http:'].includes(current.protocol)||current.pathname!=='/calendar')throw new Error('Not a calendar page');
 const event=current.searchParams.get('event');
 if(!event||event.length>600)throw new Error('No selected event');
 const url=new URL('/calendar',current.origin);
 for(const key of ['source','view','month','event']){
  const value=current.searchParams.get(key);
  if(value!==null)url.searchParams.set(key,value);
 }
 return url.href;
}
