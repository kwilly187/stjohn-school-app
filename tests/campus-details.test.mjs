import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Two authentic lightweight campus photos support specific parent actions',()=>{
 const athletics=read('app/athletics/page.tsx'),resources=read('app/resources/page.tsx');
 assert.match(athletics,/src="\/campus\/gym.webp"/);assert.match(athletics,/href="\/calendar\?source=athletics"/);
 assert.match(resources,/src="\/campus\/library.webp"/);assert.match(resources,/href="https:\/\/stjohnocala.follettdestiny.com\/"/);
 for(const file of ['gym','library'])assert.ok(statSync(new URL('../public/campus/'+file+'.webp',import.meta.url)).size<100000);
 for(const source of [athletics,resources])assert.match(source,/loading="lazy"/);
});
