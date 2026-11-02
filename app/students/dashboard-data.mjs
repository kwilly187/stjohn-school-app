/**
 * Presentation-only profile selection. This is not identity, enrollment, or authorization.
 * A future private-data adapter must run on an authenticated server, verify guardian
 * relationships and school/student scopes, and provide per-student source freshness
 * and availability. No private records may come from this profile configuration.
 * @template {{id:string}} Profile
 * @param {Profile[]} profiles
 * @param {unknown} rawStudent
 * @returns {{selection:string,selected:Profile[],valid:boolean}}
 */
export function resolveDashboardSelection(profiles,rawStudent) {
  if(rawStudent===undefined||rawStudent==='all')return {selection:'all',selected:[...profiles],valid:true};
  if(typeof rawStudent!=='string'||rawStudent.length===0)return {selection:'invalid',selected:[],valid:false};
  const matches=profiles.filter(profile=>profile.id===rawStudent);
  return matches.length===1
    ? {selection:rawStudent,selected:matches,valid:true}
    : {selection:rawStudent,selected:[],valid:false};
}

/**
 * Local dashboard foundation only. Selection never fabricates private information.
 * Empty items with not-connected status do NOT mean no work, no grades, no teams,
 * or no announcements. A future verified server adapter must distinguish source
 * failures/staleness from an authorized, successfully fetched empty result.
 * @param {Array<{id:string}>} selectedProfiles
 * @returns {Array<{key:'assignments'|'grades'|'teams'|'announcements',status:'not-connected',items:never[]}>}
 */
export function getStudentDashboard(selectedProfiles) {
  void selectedProfiles;
  return [
    {key:'assignments',status:'not-connected',items:[]},
    {key:'grades',status:'not-connected',items:[]},
    {key:'teams',status:'not-connected',items:[]},
    {key:'announcements',status:'not-connected',items:[]},
  ];
}
