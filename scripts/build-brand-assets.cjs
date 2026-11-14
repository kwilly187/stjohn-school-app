const fs=require('fs');
const sharp=require('sharp');
const crest='data:image/png;base64,'+fs.readFileSync('public/stjohn-logo.png').toString('base64');
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
(async()=>{
 const card=svg(1200,630,`<rect width="1200" height="630" fill="#ffffff"/><image href="${crest}" x="335" y="50" width="530" height="530"/>`);
 await sharp(card).png().toFile('public/brand/saints-parent-share.png');
 const icon=svg(512,512,`<rect width="512" height="512" fill="#ffffff"/><image href="${crest}" x="44" y="44" width="424" height="424"/>`);
 for(const size of [180,192,512])await sharp(icon).resize(size,size).png().toFile(`public/brand/saints-parent-${size}.png`);
 await sharp(icon).resize(32,32).png().toFile('public/brand/favicon-32.png');
})();
