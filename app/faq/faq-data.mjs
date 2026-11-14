import {school,resources} from '../school-data.mjs';
const parents=school.parents;
const resource=id=>resources.find(item=>item.id===id).url;
export const faqChecked='2026-11-14';
export const faqItems=[
 {id:'grades',category:'School accounts',question:'Where can I see grades and attendance?',answer:'Alma is the school’s parent portal for grades, attendance and school updates.',keywords:'report card progress student',action:{label:'Open Alma',href:school.portal},source:parents},
 {id:'fees',category:'School accounts',question:'Where do I pay tuition and school fees?',answer:'The school uses Blackbaud (Smartcart) for tuition balances and payments.',keywords:'billing bill money account',action:{label:'Open tuition account',href:resource('tuition')},source:parents},
 {id:'lunch',category:'Daily life',question:'Where can I find the lunch menu?',answer:'Maschio’s provides school meals. See the menu in Lunch.',keywords:'food cafeteria meal eat',action:{label:'View lunch menu',href:'/lunch'},source:parents},
 {id:'lunch-account',category:'School accounts',question:'How do I manage my child’s lunch account?',answer:'Use PaySchools for the lunch account. For meal help, contact the school office or jstonecypher@maschiofood.com.',keywords:'balance food payment money cafeteria',action:{label:'Open lunch account',href:resource('lunch-account')},source:parents},
 {id:'aftercare',category:'Daily life',question:'Does the school offer aftercare?',answer:'Yes. The school offers aftercare and links to Brightwheel for signup.',keywords:'after school care childcare registration',action:{label:'Aftercare signup',href:resource('aftercare')},source:parents},
 {id:'dates',category:'Activities',question:'Where are school events and sports dates?',answer:'The Calendar includes school activities and athletics. Check the event for current details.',keywords:'schedule games holidays calendar',action:{label:'View calendar',href:'/calendar'},source:parents},
 {id:'uniforms',category:'Daily life',question:'Where can I buy uniforms?',answer:'FlynnO’Hara is the school’s uniform provider. The school store also has a separate spirit-wear option.',keywords:'clothes clothing shopping shirt store',action:{label:'School store',href:'/resources#school-store'},source:'https://stjohnocala.org/for-parents/school-uniform/'},
 {id:'dress-code',category:'Daily life',question:'What should my child wear to school?',answer:'Students need a collared shirt, including under sweaters, and a belt. Hats, Crocs, boots, slides and athletic shorts are not permitted. Check the full dress code for all requirements.',keywords:'uniform clothes clothing shoes rules',action:{label:'Dress code',href:'/dress-code'},source:'https://stjohnocala.org/for-parents/school-uniform/'},
 {id:'sports',category:'Activities',question:'What is required before sports participation?',answer:'Before conditioning, tryouts or practice, students must be enrolled with registration fees paid and submit eligibility paperwork to the athletic director. The school lists EL2 physical, EL3 consent, GA4 for new high-school students, and concussion/cardiac course requirements.',keywords:'athletics tryout physical permission forms football volleyball basketball',action:{label:'Athletics & forms',href:'/athletics'},source:school.athletics},
 {id:'sports-help',category:'Activities',question:'Who can help with athletics questions?',answer:'Contact the athletic director at bobby.anderson@stjohnocala.org for sports-program questions.',keywords:'coach team athletics tryouts',action:{label:'Email athletics',href:`mailto:${school.athleticsEmail}`},source:school.athletics},
 {id:'office',category:'Contact',question:'How do I reach the school office?',answer:'Call 352-622-7275. The school is at 1915 SE Lake Weir Avenue, Ocala, Florida 34471.',keywords:'phone telephone address directions help contact',action:{label:'Call the school',href:school.phone},source:'https://stjohnocala.org/'},
];
export const faqCategories=['All',...new Set(faqItems.map(item=>item.category))];
const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function searchFaq(query='',category='All'){
 const words=normalize(query).split(' ').filter(Boolean);
 return faqItems.filter(item=>(category==='All'||item.category===category)&&words.every(word=>normalize(`${item.question} ${item.answer} ${item.keywords}`).includes(word)));
}
