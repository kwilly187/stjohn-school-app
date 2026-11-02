import {staffDepartments} from './staff-data.mjs';
/** @param {{q?:unknown,department?:unknown,page?:unknown}} params */
export function staffFilterState(params={}){
 const query=typeof params.q==='string'?params.q.slice(0,120):'';
 const department=typeof params.department==='string'&&staffDepartments.includes(params.department)?params.department:'all';
 const page=typeof params.page==='string'&&/^[1-9]\d{0,5}$/.test(params.page)?Number(params.page):1;
 return {query,department,page};
}
/** @param {{query?:string,department?:string,page?:number}} state */
export function staffFilterHref(state={}){
 const {query,department}=staffFilterState({q:state.query,department:state.department});
 const params=new URLSearchParams();if(query)params.set('q',query);if(department!=='all')params.set('department',department);if(Number.isSafeInteger(state.page)&&state.page>1)params.set('page',String(state.page));
 return '/staff'+(params.size?'?'+params.toString():'');
}

export const STAFF_PAGE_SIZE=6;
export function staffPage(total,requested=1){const pages=Math.max(1,Math.ceil(total/STAFF_PAGE_SIZE));const page=Math.min(pages,Math.max(1,Number.isSafeInteger(requested)?requested:1));const start=(page-1)*STAFF_PAGE_SIZE;return {page,pages,start,end:Math.min(total,start+STAFF_PAGE_SIZE)};}
