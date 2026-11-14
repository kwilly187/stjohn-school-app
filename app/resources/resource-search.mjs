// Search the configured public destinations, not private school records.
export const nativeResourceActions=[
 {id:'faq',group:'School information',title:'Parent FAQ',detail:'Answers to questions about school life',url:'/faq',appPath:'/faq',icon:'book'},
 {id:'calendar',group:'School information',title:'School calendar',detail:'School dates and athletics schedules',url:'/calendar',appPath:'/calendar',icon:'calendar'},
 {id:'pickup',group:'School information',title:'Pickup & dismissal',detail:'School office help with pickup questions or changes',url:'/pickup',appPath:'/pickup',icon:'clock'}
];
const aliases={alma:'homework assignments report card absence absent',staff:'teacher contact email',lunch:'food meals cafeteria', 'lunch-account':'food meals balance payment',tuition:'bill billing payments fees',aftercare:'after school childcare child care',uniforms:'clothes clothing shop', 'dress-code':'clothes clothing rules',spirit:'shirts shop clothing',forms:'paperwork documents',supplies:'supply list books',events:'volunteer volunteering help community',athletics:'sports sport teams registration'};
const normalize=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'');
export function searchResources(resources,query=''){
 const words=normalize(query).trim().slice(0,120).split(/\s+/).filter(Boolean);
 if(!words.length)return resources;
 return resources.filter(item=>{const text=normalize([item.title,item.detail,item.group,aliases[item.id]||''].join(' '));return words.every(word=>text.includes(word));});
}
