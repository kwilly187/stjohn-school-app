import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../app/style.css',import.meta.url),'utf8');
test('Campus background is decorative, quiet and cannot obscure controls',()=>{
 assert.match(css,/main\{position:relative;isolation:isolate\}/);
 assert.match(css,/main::before\{[^}]*z-index:-1;pointer-events:none/);
 assert.match(css,/main::before\{[^}]*url\('\/stjohn-church.png'\)[^}]*opacity:\.18/);
 assert.match(css,/@media\(max-width:999px\)\{main::before\{[^}]*opacity:\.14/);
 assert.match(css,/@media\(prefers-contrast:more\)\{main::before\{display:none\}\}/);
 assert.match(css,/@media print\{main::before\{display:none\}\}/);
});
