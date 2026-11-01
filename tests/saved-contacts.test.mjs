import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {staffDirectory,filterStaff} from '../app/staff/staff-data.mjs';
import {staffPage,staffFilterState} from '../app/staff/staff-state.mjs';
import {SAVED_CONTACTS_KEY,parseSavedContacts,readSavedContacts,writeSavedContacts,toggleSavedContact,savedContactsHref,savedContactsView} from '../app/staff/saved-contacts.mjs';
const known=staffDirectory.map(p=>p.id);
const memory=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),values};};
test('save, reload and remove persist only known IDs, not names/email/assignments',()=>{
 const storage=memory();assert.deepEqual(readSavedContacts(known,storage),{ids:[],status:'ok'});
 const ids=toggleSavedContact([],known[0],known);assert.equal(writeSavedContacts(ids,known,storage),true);
 assert.deepEqual(readSavedContacts(known,storage).ids,[known[0]]);
 assert.deepEqual(JSON.parse(storage.getItem(SAVED_CONTACTS_KEY)),{version:1,ids:[known[0]]});
 assert.equal(writeSavedContacts(toggleSavedContact(ids,known[0],known),known,storage),true);
 assert.deepEqual(readSavedContacts(known,storage).ids,[]);
});
test('stale, duplicate, malformed and unbounded storage values cannot add unknown contacts',()=>{
 assert.deepEqual(parseSavedContacts(JSON.stringify({version:1,ids:[known[0],known[0],'unknown',null,{id:known[1]}]}),known),[known[0]]);
 for(const raw of ['bad',JSON.stringify({version:99,ids:[]}),JSON.stringify({version:1,ids:'oops'}),'x'.repeat(12001)])assert.throws(()=>parseSavedContacts(raw,known));
 assert.deepEqual(toggleSavedContact([], 'unknown',known),[]);
});
test('blocked reads and quota failures return explicit unavailable without throwing or pretending persistence',()=>{
 const blocked={getItem(){throw new Error('blocked');},setItem(){throw new Error('quota');}};
 assert.deepEqual(readSavedContacts(known,blocked),{ids:[],status:'unavailable'});assert.equal(writeSavedContacts([known[0]],known,blocked),false);
 const corrupt={getItem:()=>'{bad'};assert.equal(readSavedContacts(known,corrupt).status,'unavailable');
});
test('Saved URL preserves bounded search, exact department and pagination through history/reload',()=>{
 const href=savedContactsHref({query:'Marie',department:'Support Specialists',page:2},'saved');
 const url=new URL(href,'https://example.invalid');assert.equal(url.pathname,'/staff');assert.equal(url.searchParams.get('contacts'),'saved');
 assert.deepEqual(staffFilterState(Object.fromEntries(url.searchParams)),{query:'Marie',department:'Support Specialists',page:2});
 assert.equal(savedContactsView('unknown'),'all');assert.equal(savedContactsView(['saved','all']),'all');
 assert.equal(new URL(savedContactsHref({},'all'),'https://example.invalid').search,'');
});
test('Saved filtering intersects full-directory search/departments and keeps six per page',()=>{
 const saved=known.slice(0,10);const contacts=staffDirectory.filter(p=>saved.includes(p.id));
 assert.equal(staffPage(contacts.length,1).end,6);assert.equal(staffPage(contacts.length,2).start,6);
 assert.equal(staffPage(6,2).page,1);assert.equal(staffPage(0,2).page,1);
 assert.ok(filterStaff(contacts,'jim').every(p=>saved.includes(p.id)&&p.name.toLowerCase().includes('jim')));
});
test('view offers explicit saved toggle, empty/removal/failure states and keyboard focus recovery',async()=>{
 const source=await readFile(new URL('../app/staff/staff-view.tsx',import.meta.url),'utf8');
 for(const text of ['All contacts','No saved contacts yet','storageProblem','aria-pressed','focusRemoved','staff-result-heading','Loading saved contacts','window.addEventListener(\'storage\'','window.removeEventListener(\'storage\'','visible.map','Saved','readSavedContacts','writeSavedContacts'])assert.ok(source.includes(text),text);
 assert.doesNotMatch(source,/fetch\(|your child.s teacher|assigned teacher|cloud sync/i);
});
