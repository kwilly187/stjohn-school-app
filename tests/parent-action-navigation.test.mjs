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
