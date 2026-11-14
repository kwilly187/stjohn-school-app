const fs=require('fs');
const sharp=require('sharp');
const crest='data:image/png;base64,'+fs.readFileSync('public/stjohn-logo.png').toString('base64');
const svg=(w,h,body)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
(async()=>{
 const card=svg(1200,630,`<rect width="1200" height="630" fill="#f9fafc"/><rect y="510" width="1200" height="120" fill="#2a3695"/><rect y="504" width="1200" height="6" fill="#edbc0d"/><image href="${crest}" x="70" y="80" width="350" height="350"/><text x="470" y="215" font-family="DejaVu Sans,sans-serif" font-size="62" font-weight="bold" letter-spacing="-2" fill="#2a3695">Saints Parent</text><text x="474" y="276" font-family="DejaVu Sans,sans-serif" font-size="30" fill="#26344e">St. John Lutheran School</text><text x="474" y="327" font-family="DejaVu Sans,sans-serif" font-size="24" fill="#57647a">Your school day, in one place.</text><text x="80" y="580" font-family="DejaVu Sans,sans-serif" font-size="25" fill="#ffffff">School life. Family connection. Saints community.</text>`);
 await sharp(card).png().toFile('public/brand/saints-parent-share.png');
 const icon=svg(512,512,`<rect width="512" height="512" fill="#ffffff"/><image href="${crest}" x="44" y="44" width="424" height="424"/>`);
 for(const size of [180,192,512])await sharp(icon).resize(size,size).png().toFile(`public/brand/saints-parent-${size}.png`);
 await sharp(icon).resize(32,32).png().toFile('public/brand/favicon-32.png');
})();
