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
