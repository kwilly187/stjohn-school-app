import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const art=readFileSync(new URL('../app/store/product-art.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/store/store.module.css',import.meta.url),'utf8');
test('Store concept art uses genuine school crest and labels illustration accurately',()=>{assert.match(art,/\/stjohn-logo\.png/);assert.match(art,/concept illustration/);assert.match(art,/role="img"/);});
test('Store visual controls provide touch targets and clear keyboard focus',()=>{assert.match(css,/min-height:44px/);assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/)});

test('Store uses editorial concept imagery and progressive product details',()=>{const ui=readFileSync(new URL('../app/store/store.tsx',import.meta.url),'utf8');assert.match(ui,/saints-editorial\.webp/);assert.match(ui,/Images are illustrative mockups/);assert.match(ui,/<ProductDetail/);assert.match(art,/saints-collection\.webp/);});


test('Store imagery describes only the pictured Royal variant',()=>{assert.match(art,/Royal concept shown/);assert.doesNotMatch(art,/Navy|Natural|senior-athlete/);});

test('Store supporting typography remains legible at every breakpoint',()=>{assert.doesNotMatch(css,/font-size:(?:[8-9]|1[0-3])px/);assert.doesNotMatch(art,/fontSize:10/);assert.match(css,/font-size:16px/)});
