import test from 'node:test';import assert from 'node:assert/strict';import {school} from '../app/school-data.mjs';import {existsSync,readFileSync} from 'node:fs';
test('school identity retains existing crest and uses its sampled blue/gold accents',()=>{
 assert.equal(school.logo,'/stjohn-logo.png');assert.ok(existsSync(new URL('../public/stjohn-logo.png',import.meta.url)));
 assert.equal(school.theme['--blue'],'#2a3695');assert.equal(school.theme['--gold'],'#edbc0d');
 const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');assert.ok(layout.includes('src={school.logo}'));assert.ok(layout.includes('style={school.theme'));
});
test('school primary blue remains legible for white button text',()=>{
 const channels=school.theme['--blue'].slice(1).match(/../g).map(hex=>parseInt(hex,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 const luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;assert.ok(1.05/(luminance+.05)>=4.5);
});
