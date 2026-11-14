import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {readFileSync} from 'node:fs';
test('Branded share and installation icons have platform-ready sizes and opaque backgrounds',async()=>{
 for(const [file,width,height] of [['saints-parent-share',1200,630],['saints-parent-180',180,180],['saints-parent-192',192,192],['saints-parent-512',512,512],['favicon-32',32,32]]){
  const path=new URL('../public/brand/'+file+'.png',import.meta.url).pathname;
  const meta=await sharp(path).metadata();assert.equal(meta.width,width);assert.equal(meta.height,height);
  const stats=await sharp(path).stats();assert.ok(stats.isOpaque);
 }
 const script=readFileSync(new URL('../scripts/build-brand-assets.cjs',import.meta.url),'utf8');assert.match(script,/public\/stjohn-logo.png/);assert.doesNotMatch(script,/href="https?:/);
});
