// Public destinations verified against stjohnocala.org on 2026-10-31.
// No student records, balances, notices or event details are stored here.
export const sourceChecked = 'October 31, 2026';
export const school = {
  parents: 'https://stjohnocala.org/for-parents/',
  calendar: 'https://stjohnocala.org/calendar/',
  portal: 'https://stjohnocala.getalma.com/',
  contact: 'https://stjohnocala.org/about/contact-us/',
  phone: 'tel:+13526227275',
};
export const calendarSources = {
  activities: 'stjohnocala.org_g86bu9pdkp3rcalk3c8jf5ejc0@group.calendar.google.com',
  athletics: 'athletic.director@stjohnocala.org',
};
export function calendarUrl(source = 'activities', mode = 'AGENDA') {
  const id = calendarSources[source] || calendarSources.activities;
  return 'https://calendar.google.com/calendar/embed?' + new URLSearchParams({ctz:'America/New_York',mode:mode === 'MONTH' ? 'MONTH' : 'AGENDA',src:id,showTitle:'0',showPrint:'0',showCalendars:'0'});
}
export const resources = [
  {id:'athletics',group:'Athletics',title:'Teams & participation',detail:'School athletics information and requirements. Use the live calendar for current dates; older PDFs may be listed.',url:'https://stjohnocala.org/home-2/',icon:'people'},
  {id:'alma',group:'Everyday essentials',title:'Grades & attendance',detail:'Alma parent portal · School messages and student information.',url:school.portal,icon:'book'},
  {id:'lunch',group:'Everyday essentials',title:'Lunch menu',detail:'Maschio’s · Menus and food-service information.',url:'https://maschiofood.com/stjohnlutheran/',icon:'lunch'},
  {id:'lunch-account',group:'Everyday essentials',title:'Lunch account',detail:'PaySchools Central · Manage your lunch account.',url:'https://payschoolscentral.com/',icon:'wallet'},
  {id:'tuition',group:'Everyday essentials',title:'Tuition & school fees',detail:'Blackbaud · Listed as “Smartcart” by the school.',url:'https://parent.blackbaud.school/Login.aspx',icon:'wallet'},
  {id:'aftercare',group:'Everyday essentials',title:'Aftercare signup',detail:'Brightwheel · The school’s enrollment form, not a pickup request.',url:'https://schools.mybrightwheel.com/sign-in?redirect_path=%2Fadmissions%2Fpacket%2F1bf8a8d3-a105-4322-b65a-f46977903ad5%2Ffill%3Fschool_id%3Da2cb0179-7e6a-4435-bd66-fa3b9340b80a',icon:'clock'},
  {id:'staff',group:'School information',title:'Staff directory',detail:'Find teachers and school staff on the school website.',url:'https://stjohnocala.org/about/for-parents/',icon:'people'},
  {id:'supplies',group:'School information',title:'School supply lists',detail:'Find the school’s supply information by grade.',url:'https://stjohnocala.org/for-parents/school-supplies/',icon:'book'},
  {id:'forms',group:'School information',title:'Forms & parent information',detail:'Visit the parent page. Ask the office for forms not listed there.',url:school.parents,icon:'file'},
  {id:'dress-code',group:'School information',title:'Dress code',detail:'Check school uniform requirements before you shop.',url:'https://stjohnocala.org/for-parents/school-uniform/',icon:'shirt'},
  {id:'uniforms',group:'School information',title:'Buy uniforms',detail:'FlynnO’Hara · St. John Lutheran School.',url:'https://flynnohara.com/shop/saint-john-lutheran-school-fl045/',icon:'shirt'},
  {id:'spirit',group:'Saints community',title:'Spirit wear',detail:'Shop the school-linked BSN Sports store.',url:'https://sideline.bsnsports.com/schools/florida/ocala/saint-john-lutheran-high-school',icon:'shirt'},
  {id:'events',group:'Saints community',title:'Events & fundraising',detail:'SaintsSpirit · Explore the separate events website preview. Online giving is not active.',url:'https://saints-spirit-approved-preview.vercel.app/',icon:'heart'},
  {id:'community',group:'Saints community',title:'Parent connection & school support',detail:'School-published ways to get involved and support classrooms.',url:'https://stjohnocala.org/',icon:'people'},
];
