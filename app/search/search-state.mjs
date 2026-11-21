import {searchKinds} from './search-data.mjs';
export function portalSearchState(query,kind){return {query:typeof query==='string'?query.slice(0,120):'',kind:typeof kind==='string'&&searchKinds.includes(kind)?kind:'All'}}
export function portalSearchHref(query,kind='All'){const state=portalSearchState(query,kind);const params=new URLSearchParams();if(state.query)params.set('q',state.query);if(state.kind!=='All')params.set('kind',state.kind);return '/search'+(params.size?'?'+params.toString():'')}
