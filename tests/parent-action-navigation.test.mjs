import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {parentActions} from '../app/parent-actions/actions.mjs';
import {resources} from '../app/school-data.mjs';
test('parent actions can reset a partial filter and restore search focus',()=>{
 const source=readFileSync('app/parent-actions/action-finder.tsx','utf8');
 assert.ok(source.includes("query||category!=='All'"));
 assert.ok(source.includes('input.current?.focus()'));
 assert.ok(source.includes('<Link href={action.href}>'));
});
test('all native parent action and resource destinations resolve to real pages',()=>{
 for(const href of [...parentActions.map(item=>item.href),...resources.map(item=>item.appPath)].filter(item=>item?.startsWith('/'))){
  const route=href.split(/[?#]/)[0];
  assert.ok(existsSync(`app${route}/page.tsx`),href);
 }
});

test('community category has a safe shareable destination',async()=>{
 const {parentActionCategory,parentActionHref,filterParentActions}=await import('../app/parent-actions/actions.mjs');
 assert.equal(parentActionCategory('Get involved'),'Get involved');
 assert.equal(parentActionHref('Get involved'),'/parent-actions?category=Get%20involved');
 assert.equal(filterParentActions('Get involved').length,2);
 for(const invalid of [null,[],{},'javascript:alert(1)','Unknown'])assert.equal(parentActionCategory(invalid),'All');
 assert.equal(parentActionHref('bad'),'/parent-actions');
});
