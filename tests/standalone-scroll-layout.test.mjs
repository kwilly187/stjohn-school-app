import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=name=>readFile(new URL('../app/'+name,import.meta.url),'utf8');
test('standalone tab row is outside the scrolling shell; normal layout remains transparent',async()=>{
 const layout=await load('layout.tsx'),css=await load('style.css');
 assert.match(layout,/viewportFit:'cover'/);
 assert.match(layout,/<div className="app-content"><header[\s\S]+<main id="main">[\s\S]+<footer[\s\S]+<\/footer><\/div><Navigation\/>/);
 assert.match(css,/\.app-content\{display:contents\}/);
 assert.match(css,/@supports \(-webkit-touch-callout:none\)\{\s*@media screen and \(display-mode:standalone\) and \(max-width:999px\)/);
 assert.match(css,/grid-template-rows:minmax\(0,1fr\) auto;height:100vh;height:100dvh;min-height:0;padding:env\(safe-area-inset-top,0px\)/);
 assert.match(css,/\.app-content\{display:block;min-height:0;min-width:0;overflow:auto/);
 assert.match(css,/\.bottom-nav\{position:relative;inset:auto;transform:none;[\s\S]+safe-area-inset-bottom,0px/);
});
