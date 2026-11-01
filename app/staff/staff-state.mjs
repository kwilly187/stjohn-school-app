import {staffDepartments} from './staff-data.mjs';
/** @param {{q?:unknown,department?:unknown}} params */
export function staffFilterState(params={}){
 const query=typeof params.q==='string'?params.q.slice(0,120):'';
 const department=typeof params.department==='string'&&staffDepartments.includes(params.department)?params.department:'all';
 return {query,department};
}
/** @param {{query?:string,department?:string}} state */
export function staffFilterHref(state={}){
 const {query,department}=staffFilterState({q:state.query,department:state.department});
 const params=new URLSearchParams();if(query)params.set('q',query);if(department!=='all')params.set('department',department);
 return '/staff'+(params.size?'?'+params.toString():'');
}
