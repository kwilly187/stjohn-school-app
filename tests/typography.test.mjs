import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('school typography is self-hosted and licensed with no Google font network dependency',async()=>{
 const css=await read('app/style.css');
 assert.match(css,/--font-school:'Josefin Sans'/);
 assert.doesNotMatch(css,/fonts.googleapis|DM Sans|Manrope/);
 for(const weight of [400,500,600,700])assert.ok((await stat(new URL('../public/fonts/josefin-sans-latin-'+weight+'-normal.woff2',import.meta.url))).size>1000);
 assert.match(await read('public/fonts/OFL-JosefinSans.txt'),/SIL OPEN FONT LICENSE/);
});
test('resource headings and Scripture use the shared school font',async()=>{
 for(const file of ['app/resources/resources.module.css','app/daily-scripture.module.css']){
  const css=await read(file);assert.match(css,/var\(--font-school\)/);assert.doesNotMatch(css,/Manrope|Georgia/);
 }
});
test('licensed script is restricted to Scripture heading, not the verse',async()=>{
 const css=await read('app/daily-scripture.module.css');
 assert.match(css,/\.heading h2\{font-family:'Allura',cursive/);
 assert.match(css,/\.card blockquote\{[^}]*font-family:var\(--font-school\)/);
 assert.match(await read('public/fonts/OFL-Allura.txt'),/SIL OPEN FONT LICENSE/);
 assert.ok((await stat(new URL('../public/fonts/allura-latin-400-normal.woff2',import.meta.url))).size>1000);
});
