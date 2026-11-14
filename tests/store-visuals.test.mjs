import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const art=readFileSync(new URL('../app/store/product-art.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../app/store/store.module.css',import.meta.url),'utf8');
test('Store concept art uses genuine school crest and labels illustration accurately',()=>{assert.match(art,/\/stjohn-logo\.png/);assert.match(art,/concept illustration/);assert.match(art,/role="img"/);});
test('Store visual controls provide touch targets and clear keyboard focus',()=>{assert.match(css,/\.swatch button\{height:44px;width:44px/);assert.match(css,/\.sizes select\{min-height:44px/);assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/)});
