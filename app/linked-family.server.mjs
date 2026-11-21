// Hosting presentation overlay only; never infer membership from global profile-config.mjs.
// The upcoming real adapter must authenticate the parent and enforce the family relationship.
export const DEMO_HOST='stjohn-school-app-git-codex-parent-fi-342ea3-seagull-management.vercel.app';
export const DEMO_BRANCH='codex/parent-first-preview';
export const DEMO_ACTIVITIES=['beach-volleyball','indoor-56-volleyball','track'];
/** @typedef {{id:string,name:string,grade:number,activities:string[],demo?:boolean}} LinkedStudent */
/** @param {NodeJS.ProcessEnv} [env] @returns {LinkedStudent[]} */
export function getLocalLinkedFamily(env=process.env){
 // Developer fixture only; should run the dev server bound to loopback. No user data.
 if(env.NODE_ENV==='development'&&env.STJOHN_LOCAL_LINKED_FAMILY_FIXTURE==='1')return [
  {id:'test-grade-six',name:'Demo',grade:6,activities:DEMO_ACTIVITIES,demo:true},
  {id:'test-grade-eight',name:'Sample',grade:8,activities:['track'],demo:true},
 ];
 return [];
}
/** @param {NodeJS.ProcessEnv} [env] */
export function hasPreviewDemoConfig(env=process.env){return env.VERCEL_ENV==='preview'&&env.VERCEL_GIT_COMMIT_REF===DEMO_BRANCH&&typeof env.STJOHN_PREVIEW_LINKED_DEMO==='string';}
/** @param {string|null} host @param {NodeJS.ProcessEnv} [env] @returns {LinkedStudent[]} */
export function getPreviewDemoFamily(host,env=process.env){
 if(host!==DEMO_HOST||!hasPreviewDemoConfig(env))return [];
 try{
  const row=JSON.parse(env.STJOHN_PREVIEW_LINKED_DEMO||'');
  if(!row||Object.keys(row).sort().join(',')!=='activities,grade,name'||typeof row.name!=='string'||row.name.length>28||!/^\p{L}[\p{L}\p{M}'’-]*$/u.test(row.name)||row.grade!==6||!Array.isArray(row.activities)||row.activities.length!==DEMO_ACTIVITIES.length||!DEMO_ACTIVITIES.every(id=>row.activities.includes(id)))return [];
  return [{id:'preview-demo',name:row.name,grade:row.grade,activities:DEMO_ACTIVITIES,demo:true}];
 }catch{return [];}
}
