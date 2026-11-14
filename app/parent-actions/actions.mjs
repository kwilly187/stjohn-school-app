import {resources,school} from '../school-data.mjs';
const resource=id=>resources.find(item=>item.id===id).url;
export const parentActions=[
 {id:'tuition',category:'Payments',title:'Tuition & school fees',detail:'View your balance and pay through Blackbaud.',label:'Open tuition account',href:resource('tuition')},
 {id:'lunch',category:'Payments',title:'Lunch account',detail:'Manage your lunch balance through PaySchools.',label:'Open lunch account',href:resource('lunch-account')},
 {id:'aftercare',category:'Registration',title:'Aftercare registration',detail:'Complete the school’s Brightwheel signup.',label:'Register for aftercare',href:resource('aftercare')},
 {id:'message',category:'Messages',title:'Contact a teacher',detail:'Find your teacher and email them directly.',label:'Find a teacher',href:'/staff'},
 {id:'school-account',category:'Messages',title:'School account',detail:'Check St. John updates in Alma.',label:'Open Alma',href:school.portal},
 {id:'sports-forms',category:'Forms',title:'Athletics paperwork',detail:'Review required physical and consent forms.',label:'View participation forms',href:'/athletics#participation-forms'},
 {id:'form-help',category:'Forms',title:'Forms & signatures',detail:'Ask the office for the correct form and submission method.',label:'Request a form',href:`mailto:${school.officeEmail}?subject=${encodeURIComponent('School form request')}`},
 {id:'volunteer',category:'Get involved',title:'Volunteer at St. John',detail:'Ask about current opportunities for your family.',label:'Ask about volunteering',href:`mailto:${school.officeEmail}?subject=${encodeURIComponent('Parent volunteering opportunities')}`},
 {id:'support',category:'Get involved',title:'Sponsorships & giving',detail:'Contact the office about supporting the school.',label:'Ask about supporting St. John',href:`mailto:${school.officeEmail}?subject=${encodeURIComponent('School sponsorship and giving')}`},
];
/** Resolve only known approved destinations, never arbitrary notice URLs. */
export function getParentAction(id){return typeof id==='string'?parentActions.find(action=>action.id===id):undefined}

export function filterParentActions(category='All',query=''){
 const search=String(query).trim().toLowerCase();
 return parentActions.filter(action=>(category==='All'||action.category===category)&&(!search||[action.title,action.detail,action.category,action.label].join(' ').toLowerCase().includes(search)));
}

export const actionCategories=['All','Payments','Registration','Forms','Messages','Get involved'];
export function parentActionCategory(value){return typeof value==='string'&&actionCategories.includes(value)?value:'All'}
export function parentActionHref(category){const safe=parentActionCategory(category);return safe==='All'?'/parent-actions':`/parent-actions?category=${encodeURIComponent(safe)}`}
