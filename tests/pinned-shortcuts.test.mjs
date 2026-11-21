import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PINNED_SHORTCUTS_KEY,normalizePins,readPins,writePins,togglePin,shortcutOrder} from '../app/pinned-shortcuts-data.mjs';
const defaults=['lunch','athletics','pickup','resources'];
const options=[...defaults,'alma'];
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};

test('default cards stay in their original order unless a parent pins a shortcut',()=>{
 assert.deepEqual(shortcutOrder(defaults,[],options),defaults);
 assert.deepEqual(shortcutOrder(defaults,['pickup','alma','lunch'],options),['pickup','alma','lunch','athletics','resources']);
 assert.deepEqual(shortcutOrder(defaults,['alma','pickup','bogus','alma'],options),['alma','pickup','lunch','athletics','resources']);
});

test('the fourth pin is rejected and clearing one frees a slot',()=>{
 const full=['lunch','athletics','pickup'];
 assert.deepEqual(togglePin(full,'alma',options),full);
 assert.deepEqual(togglePin(togglePin(full,'lunch',options),'alma',options),['athletics','pickup','alma']);
 assert.deepEqual(togglePin(['lunch'],'https://bad.example',options),['lunch']);
});

test('persisted values are only three allowlisted IDs; clearing works',()=>{
 const local=storage();
 assert.equal(writePins(local,['alma','alma','pickup','invalid','resources','lunch'],options),true);
 assert.equal(local.getItem(PINNED_SHORTCUTS_KEY),'["alma","pickup","resources"]');
 assert.deepEqual(readPins(local,options),['alma','pickup','resources']);
 assert.equal(writePins(local,[],options),true);
 assert.deepEqual(readPins(local,options),[]);
});

test('absent, malformed and unavailable storage falls back gracefully',()=>{
 const local=storage();
 assert.deepEqual(readPins(local,options),[]);
 for(const value of ['{','null','{}','["unknown"]','x'.repeat(257)]){local.setItem(PINNED_SHORTCUTS_KEY,value);assert.deepEqual(readPins(local,options),[]);}
 assert.deepEqual(normalizePins(['pickup',null,42,'pickup'],options),['pickup']);
 const unavailable={getItem(){throw Error('disabled');},setItem(){throw Error('quota');}};
 assert.deepEqual(readPins(unavailable,options),[]);
 assert.equal(writePins(unavailable,['alma'],options),false);
});

test('the editor stays inline, supports Cancel and does not add another nav section',()=>{
 const editor=readFileSync(new URL('../app/pinned-shortcuts.tsx',import.meta.url),'utf8');
 assert.match(editor,/aria-expanded=\{editing\}/);
 assert.match(editor,/aria-controls="shortcut-editor"/);
 assert.match(editor,/hidden=\{!editing\}/);
 assert.match(editor,/type="checkbox"/);
 assert.match(editor,/onClick=\{close\}>Cancel/);
 assert.match(editor,/onClick=\{save\}>Save/);
 assert.equal((editor.match(/<nav/g)||[]).length,1);
 assert.doesNotMatch(editor,/fetch\(|sessionStorage|document\.cookie/);
});
