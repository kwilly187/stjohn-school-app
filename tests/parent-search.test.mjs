import test from 'node:test';import assert from 'node:assert/strict';import {parentSearchIndex,searchParentPortal} from '../app/search/search-data.mjs';
test('parent search combines authoritative actions answers resources and public contacts',()=>{assert.deepEqual([...new Set(parentSearchIndex.map(x=>x.kind))].sort(),['Actions','Answers','Contacts','Resources']);assert.ok(searchParentPortal('lunch').some(x=>x.kind==='Actions'));assert.ok(searchParentPortal('lunch').some(x=>x.kind==='Answers'));assert.ok(searchParentPortal('Jim Knoepfel','Contacts').some(x=>x.title==='Jim Knoepfel'))});
test('search is case insensitive multiword and filter scoped',()=>{assert.deepEqual(searchParentPortal('LUNCH'),searchParentPortal(' lunch '));assert.ok(searchParentPortal('school fees').length);assert.ok(searchParentPortal('lunch','Actions').every(x=>x.kind==='Actions'));assert.equal(searchParentPortal('notrealzzzz').length,0);assert.equal(searchParentPortal('   ').length,0)});
test('search destinations come from existing public registries only',()=>{assert.equal(new Set(parentSearchIndex.map(x=>x.id)).size,parentSearchIndex.length);assert.ok(parentSearchIndex.every(x=>/^(\/|https:\/\/|mailto:|tel:)/.test(x.href)));assert.ok(parentSearchIndex.filter(x=>x.kind==='Contacts').every(x=>x.href.startsWith('/staff?q=')))});

test('broad search can reveal every match rather than silently limiting to twenty',async()=>{
 const {readFileSync}=await import('node:fs');const ui=readFileSync('app/search/parent-search.tsx','utf8');
 assert.ok(searchParentPortal('school').length>20);
 assert.match(ui,/matches.slice\(0,visibleCount\)/);assert.match(ui,/Show more results/);assert.match(ui,/count=>count\+20/);assert.match(ui,/setVisibleCount\(20\),\[query,kind\]/);
});
