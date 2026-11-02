// Browser-only contact preferences. Persist IDs, never names, emails or inferred assignments.
import {staffFilterHref} from './staff-state.mjs';
export const SAVED_CONTACTS_KEY='saints-parent.saved-contacts.v1';
export function savedContactsView(value){return value==='saved'?'saved':'all';}
export function savedContactsHref(state={},view='all'){
 const url=new URL(staffFilterHref(state),'https://local.invalid');
 if(savedContactsView(view)==='saved')url.searchParams.set('contacts','saved');
 return url.pathname+url.search;
}
export function parseSavedContacts(raw,knownIds){
 if(raw===null)return [];
 if(typeof raw!=='string'||raw.length>12000)throw new Error('Invalid saved contacts');
 const value=JSON.parse(raw);
 if(value?.version!==1||!Array.isArray(value.ids)||value.ids.length>200)throw new Error('Invalid saved contacts');
 const known=new Set(knownIds);
 return [...new Set(value.ids.filter(id=>typeof id==='string'&&known.has(id)))];
}
export function readSavedContacts(knownIds,storage){
 try{return {ids:parseSavedContacts((storage||window.localStorage).getItem(SAVED_CONTACTS_KEY),knownIds),status:'ok'};}
 catch{return {ids:[],status:'unavailable'};}
}
export function writeSavedContacts(ids,knownIds,storage){
 try{const valid=parseSavedContacts(JSON.stringify({version:1,ids}),knownIds);(storage||window.localStorage).setItem(SAVED_CONTACTS_KEY,JSON.stringify({version:1,ids:valid}));return true;}
 catch{return false;}
}
export function toggleSavedContact(ids,id,knownIds){
 if(!knownIds.includes(id))return ids;
 return ids.includes(id)?ids.filter(item=>item!==id):[...ids,id];
}
