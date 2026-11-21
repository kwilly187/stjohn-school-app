import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../app/'+p,import.meta.url),'utf8');
test('Secondary pages omit redundant Home links while retaining accessible global navigation',()=>{
 for(const page of ['pickup/page.tsx','students/page.tsx'])assert.doesNotMatch(read(page),/<Link[^>]+href="\/"[^>]*>Home<\/Link>/);
 assert.match(read('layout.tsx'),/<Navigation\/>/);
 assert.match(read('navigation.tsx'),/Primary navigation/);
 assert.match(read('navigation.tsx'),/Home/);
 assert.match(read('style.css'),/:focus-visible/);
 for(const page of ['error.tsx','not-found.tsx'])assert.match(read(page),/Back to home/);
});

test('Resources and Contacts remain in persistent navigation instead of repeated page-top links',()=>{for(const page of ['dress-code/page.tsx','athletics/page.tsx','lunch/page.tsx','faq/page.tsx','staff/page.tsx'])assert.doesNotMatch(read(page),/<Link[^>]+href="\/(resources|updates)"[^>]*>(All resources|Resources|Contacts)<\/Link>/);assert.match(read('navigation.tsx'),/label:'Resources'/);assert.match(read('navigation.tsx'),/label:'Contacts'/);});
