// Public destinations verified against stjohnocala.org on 2026-10-31.
// No student records, balances, notices or event details are stored here.
export const sourceChecked = 'October 31, 2026';
export const platform = {name:'Seagull',url:'https://www.seagullmgmt.com'};
export const school = {
  name:'St. John Lutheran School',
  brandName:'ST. JOHN LUTHERAN',
  appName:'Saints Parent',
  mascot:'Saints',
  location:'Ocala, Florida',
  logo:'/stjohn-logo.png',
  communityLabel:'Saints community',
  networkName:'Saints Network',
  portalLabel:'Alma',
  officeEmail:'aly.kirby@stjohnocala.org',
  address:'1915 SE Lake Weir Avenue, Ocala, FL 34471',
  officeHours:'Monday–Friday · August–May: 7:30 am–3:30 pm · June–July: 9 am–2 pm',
  mealHelpEmail:'jstonecypher@maschiofood.com',
  athleticsEmail:'bobby.anderson@stjohnocala.org',
  phoneDisplay:'352-622-7275',
  staff:'https://stjohnocala.org/about/for-parents/',
  athletics:'https://stjohnocala.org/home-2/',
  timeZone:'America/New_York',
  timeZoneLabel:'Eastern Time',
  theme:{'--blue':'#173e93','--navy':'#12274b','--gold':'#d4a746'},
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
  return 'https://calendar.google.com/calendar/embed?' + new URLSearchParams({ctz:school.timeZone,mode:mode === 'MONTH' ? 'MONTH' : 'AGENDA',src:id,showTitle:'0',showPrint:'0',showCalendars:'0'});
}
export const resources = [
  {id:'athletics',appPath:'/athletics',group:'Athletics',title:'Teams & participation',detail:'School athletics · Teams & requirements. Use Calendar for current dates.',url:school.athletics,icon:'people'},
  {id:'alma',group:'School accounts',title:'Grades, attendance & school updates',detail:'Alma · Sign-in required',url:school.portal,icon:'book'},
  {id:'lunch',appPath:'/lunch',group:'Everyday essentials',title:'Lunch menu',detail:'Nutrislice · School lunch menus',url:'https://sjlof.nutrislice.com/',icon:'lunch'},
  {id:'meal-info',appPath:'/lunch#meal-help',group:'Everyday essentials',title:'Meal program information',detail:'Maschio’s · Food service & account help',url:'https://maschiofood.com/stjohnlutheran/',icon:'lunch'},
  {id:'lunch-account',group:'School accounts',title:'Lunch account',detail:'PaySchools · Sign-in required',url:'https://payschoolscentral.com/',icon:'wallet'},
  {id:'tuition',group:'School accounts',title:'Tuition & school fees',detail:'Blackbaud (Smartcart) · Sign-in required',url:'https://parent.blackbaud.school/Login.aspx',icon:'wallet'},
  {id:'aftercare',group:'School accounts',title:'Aftercare signup',detail:'Brightwheel · Sign-in required',url:'https://schools.mybrightwheel.com/sign-in?redirect_path=%2Fadmissions%2Fpacket%2F1bf8a8d3-a105-4322-b65a-f46977903ad5%2Ffill%3Fschool_id%3Da2cb0179-7e6a-4435-bd66-fa3b9340b80a',icon:'clock'},
  {id:'staff',appPath:'/staff',group:'School information',title:'Staff directory',detail:'Teachers & school staff',url:school.staff,icon:'people'},
  {id:'supplies',appPath:'/updates#contact-heading',group:'School information',title:'School supplies help',detail:'Confirm the current year’s list with the school office.',url:'https://stjohnocala.org/for-parents/school-supplies/',icon:'book'},
  {id:'forms',appPath:'/updates#contact-heading',group:'School information',title:'Forms & office help',detail:'Ask the school office for the form you need.',url:school.parents,icon:'file'},
  {id:'dress-code',appPath:'/dress-code',group:'School information',title:'Dress code',detail:'School uniform requirements',url:'https://stjohnocala.org/for-parents/school-uniform/',icon:'shirt'},
  {id:'uniforms',group:'School store',title:'Buy uniforms',detail:'FlynnO’Hara · St. John Lutheran School.',url:'https://flynnohara.com/shop/saint-john-lutheran-school-fl045/',icon:'shirt'},
  {id:'spirit',group:'School store',title:'Spirit wear',detail:'BSN Sports · School spirit wear',url:'https://sideline.bsnsports.com/schools/florida/ocala/saint-john-lutheran-high-school',icon:'shirt'},
  {id:'events',group:school.communityLabel,title:'Events & fundraising',detail:'SaintsSpirit preview · Online giving is not active.',url:'https://saints-spirit-approved-preview.vercel.app/',icon:'heart'},
  {id:'community',appPath:'/updates#contact-heading',group:school.communityLabel,title:'Get involved',detail:'Ask the school office about ways to help.',url:'https://stjohnocala.org/',icon:'people'},
];

export const resourceGroups=['Everyday essentials','School accounts','School store','Athletics','School information',school.communityLabel];

