import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('active navigation hover keeps school blue on a light background',async()=>{
 const css=await readFile(new URL('../app/style.css',import.meta.url),'utf8');
 const rule='.bottom-nav a[aria-current=page]:hover,.bottom-nav a[aria-current=page]:focus-visible{background:#edf2fb;color:var(--blue)}';
 assert.ok(css.includes(rule));
 assert.ok(css.lastIndexOf(rule)>css.lastIndexOf('background:#203c68'));
 assert.ok(css.lastIndexOf('.bottom-nav a[aria-current=page]:before{display:block}')>css.lastIndexOf('.bottom-nav a[aria-current=page]:before{display:none}')); 
});
