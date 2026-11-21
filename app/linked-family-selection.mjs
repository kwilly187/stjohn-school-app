let selected='';
const listeners=new Set();
export function linkedFamilySnapshot(){return selected;}
export function subscribeLinkedFamily(listener){listeners.add(listener);return()=>{listeners.delete(listener);};}
export function selectLinkedFamilyStudent(id){if(selected===id)return;selected=id;for(const listener of listeners)listener();}
export function resolveLinkedFamilyStudent(students,id){return students.find(child=>child.id===id)??students[0]??null;}
