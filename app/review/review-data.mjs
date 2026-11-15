// Presentation-only content. No operational dismissal commands or student records.
export const reviewViews=[{id:'parent',title:'Parent experience'},{id:'school',title:'School operations'},{id:'pickup',title:'Pickup proposal'}];
export const pickupSteps=[
 {id:'arrival',title:'Arrival',parent:'Open the school’s approved dismissal service and follow its arrival process.',staff:'Receive an arrival indication in that service. Arrival alone does not authorize a child’s release.'},
 {id:'verify',title:'Authorization',parent:'Use the guardian identity and pickup permissions verified by the school.',staff:'Check the authorized pickup person and any restrictions in the school’s authoritative records. Resolve exceptions before proceeding.'},
 {id:'handoff',title:'Staff handoff',parent:'Follow the school’s directions and wait for staff confirmation.',staff:'Confirm the correct student, authorized adult and supervised handoff. Keep a staffed fallback for lost phones, outages or disputed authorization.'},
 {id:'release',title:'Release record',parent:'Complete pickup only when school staff authorize the handoff.',staff:'Record the completed release in the approved dismissal service, with an accountable staff action and the required audit history.'},
];
export const parentTasks=[
 {title:'Reach the right person',detail:'Search school staff, save a contact or find office help.',href:'/updates',label:'Open communication & help'},
 {title:'Prepare for the school day',detail:'Find meal help, school accounts and everyday resources.',href:'/resources',label:'Open school resources'},
 {title:'Explore participation',detail:'Browse published sports, eligibility forms and athletics contact.',href:'/athletics',label:'Open athletics'},
 {title:'Plan around school dates',detail:'Browse the public calendar and download an individual event.',href:'/calendar',label:'Open school calendar'},
];
export const schoolWorkflows=[
 {title:'School and athletics dates',owner:'Authorized calendar editors',action:'Update the existing school Google Calendar once.',result:'The parent calendar refreshes from the published source and shows when it was checked.',status:'Public connection available'},
 {title:'Staff contacts and school policies',owner:'School website owner + app maintainer',action:'Keep the official website current; the app maintainer reviews and refreshes the app’s published summaries.',result:'Parents find contacts and practical information without a second school publishing system.',status:'Reviewed public snapshots'},
 {title:'Announcements and student records',owner:'School staff in the existing approved system',action:'Continue using Alma and the school’s established communication channels.',result:'The app currently links to Alma. Delivering approved messages here needs confirmed source access, family permissions and reply routing; device notifications are a separate connection.',status:'Provider sign-in'},
 {title:'Dismissal and pickup',owner:'School-authorized dismissal staff',action:'Select or confirm an existing dismissal product and its supported connection.',result:'A proposed experience is shown here; no dismissal service or school records are connected.',status:'Proposed integration'},
];
export function reviewState(params={}){
 const view=typeof params.view==='string'&&reviewViews.some(item=>item.id===params.view)?params.view:'parent';
 const step=typeof params.step==='string'&&pickupSteps.some(item=>item.id===params.step)?params.step:'arrival';
 const warning=(params.view!==undefined&&params.view!==view)||(params.step!==undefined&&params.step!==step);
 return {view,step,warning};
}
export function reviewHref(view='parent',step='arrival'){
 const state=reviewState({view,step});const query=new URLSearchParams({view:state.view});if(state.view==='pickup')query.set('step',state.step);return '/review?'+query.toString();
}
