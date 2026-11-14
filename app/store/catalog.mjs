export const collections=['All','Everyday','Sideline','Accessories'];
export const products=[
{id:'saints-tee',name:'Saints Everyday Tee',kind:'tee',collection:'Everyday',description:'A clean school-crest tee for the whole family.',sizes:['Youth S','Youth M','Youth L','Adult S','Adult M','Adult L','Adult XL','Adult 2XL'],colors:['Navy','Royal','White']},
{id:'crest-polo',name:'St. John Crest Polo',kind:'polo',collection:'Everyday',description:'A simple crest-led polo for school events and family gatherings.',sizes:['Adult S','Adult M','Adult L','Adult XL','Adult 2XL'],colors:['Navy','White']},
{id:'saints-hoodie',name:'Saints Sideline Hoodie',kind:'hoodie',collection:'Sideline',description:'A school-spirit layer for cooler evenings and game days.',sizes:['Youth M','Youth L','Adult S','Adult M','Adult L','Adult XL'],colors:['Navy','Royal']},
{id:'crest-cap',name:'Saints Crest Cap',kind:'cap',collection:'Sideline',description:'A classic cap with the St. John crest.',sizes:['One size'],colors:['Navy','White']},
{id:'family-tote',name:'St. John Family Tote',kind:'tote',collection:'Accessories',description:'An everyday carryall for books, activities and school events.',sizes:['One size'],colors:['Navy','Natural']},
{id:'saints-bottle',name:'Saints Water Bottle',kind:'bottle',collection:'Accessories',description:'A school-crest bottle concept for busy family days.',sizes:['One size'],colors:['Navy','White']}
];
export const colors={Navy:'#152d50',Royal:'#2a3695',White:'#ffffff',Natural:'#e7ddc9'};
export function findProducts(query='',collection='All'){const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);return products.filter(p=>(collection==='All'||p.collection===collection)&&terms.every(t=>`${p.name} ${p.description} ${p.collection}`.toLowerCase().includes(t)));}
export const productDetails={
 'saints-tee':{headline:'A little Saints pride, every day.',details:['St. John crest positioned at the chest','Three school-inspired color options','Youth and adult size selections'],occasion:'School events, weekends and family outings'},
 'crest-polo':{headline:'A polished way to show up for St. John.',details:['Clean collar and button-front concept','Small chest crest, without oversized graphics','Navy or white color direction'],occasion:'Family events and school celebrations'},
 'saints-hoodie':{headline:'Made for the sidelines in spirit.',details:['Pullover silhouette with front pocket','School crest at the chest','Navy and royal blue color directions'],occasion:'Game nights and cooler school mornings'},
 'crest-cap':{headline:'Saints pride, from the top down.',details:['Classic curved-brim silhouette','Front-facing St. John crest','Navy or white color direction'],occasion:'Outdoor games and everyday outings'},
 'family-tote':{headline:'Bring a little St. John along.',details:['Open-top carryall concept','Prominent school crest','Navy and natural color directions'],occasion:'Books, activity days and family essentials'},
 'saints-bottle':{headline:'School spirit on the move.',details:['Simple reusable bottle silhouette','School crest centered on the body','Navy or white color direction'],occasion:'School days, practices and family adventures'}
};
export function validSelection(selection){const p=products.find(p=>p.id===selection?.id);return !!p&&p.colors.includes(selection.color)&&p.sizes.includes(selection.size);}
export function cleanFavorites(value){if(!Array.isArray(value))return [];const seen=new Set();return value.filter(validSelection).filter(item=>{const key=JSON.stringify([item.id,item.color,item.size]);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,100).map(({id,color,size})=>({id,color,size}));}
