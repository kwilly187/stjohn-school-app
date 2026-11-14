import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {products,findProducts,collections,colors} from '../app/store/catalog.mjs';
test('original store collection has unique products and valid selectable options',()=>{assert.equal(products.length,6);assert.equal(new Set(products.map(p=>p.id)).size,6);for(const p of products){assert.ok(p.sizes.length);assert.ok(collections.includes(p.collection));for(const c of p.colors)assert.ok(colors[c]);assert.equal('price' in p,false);assert.equal('stock' in p,false)}});
test('store discovery combines search with collection',()=>{assert.equal(findProducts('hoodie','Sideline').length,1);assert.equal(findProducts('hoodie','Everyday').length,0);assert.equal(findProducts('  SAINTS  ').length,4);assert.equal(findProducts('unknown').length,0)});
test('store separates local favorites from real ordering',async()=>{const s=await readFile('app/store/store.tsx','utf8');for(const t of ['Not available to order','not approved school uniforms','Nothing is submitted','Save selection','aria-pressed','Remove '])assert.ok(s.includes(t));assert.doesNotMatch(s,/fetch\(|localStorage|checkout|Add to cart/)});
test('removed vendors do not remain in rendered app sources',async()=>{for(const path of ['app/page.tsx','app/resources/page.tsx','app/school-data.mjs','app/dress-code/page.tsx','app/faq/faq-data.mjs'])assert.doesNotMatch(await readFile(path,'utf8'),/BSN|Flynn|bsnsports|flynnohara/i)});
