// Deployment-specific presentation profiles. The public repository contains no people.
/** @type {Array<{id:string,name:string,grade:number,photo?:string}>} */
export const profiles=[];
export function selectProfiles(selection){return selection===undefined||selection==='all'?profiles:profiles.filter(profile=>profile.id===selection)}
