const fs=require('fs');
const sharp=require('sharp');
const crest='data:image/png;base64,'+fs.readFileSync('public/stjohn-logo.png').toString('base64');
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
(async()=>{
 const card=svg(1200,630,`<defs><radialGradient id="royal"><stop offset="0" stop-color="#3b49aa"/><stop offset="1" stop-color="#232e82"/></radialGradient></defs><rect width="1200" height="630" fill="url(#royal)"/><rect x="28" y="28" width="1144" height="574" rx="4" fill="none" stroke="#edbc0d" stroke-width="2" opacity=".65"/><path d="M70 315h200M930 315h200" stroke="#edbc0d" stroke-width="2" opacity=".6"/><image href="${crest}" x="345" y="60" width="510" height="510"/>`);
 await sharp(card).png().toFile('public/brand/saints-parent-share.png');
 const icon=svg(512,512,`<rect width="512" height="512" fill="#ffffff"/><image href="${crest}" x="44" y="44" width="424" height="424"/>`);
 for(const size of [180,192,512])await sharp(icon).resize(size,size).png().toFile(`public/brand/saints-parent-${size}.png`);
 await sharp(icon).resize(32,32).png().toFile('public/brand/favicon-32.png');
})();
