export function schoolMonth(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit'}).formatToParts(now);
 return `${parts.find(p=>p.type==='year').value}-${parts.find(p=>p.type==='month').value}`;
}
export function shiftMonth(month,delta){const [year,value]=month.split('-').map(Number);return new Date(Date.UTC(year,value-1+delta,1)).toISOString().slice(0,7)}
export function calendarState(params={},now=new Date()){
 const current=schoolMonth(now),min=shiftMonth(current,-12),max=shiftMonth(current,12);
 const source=params.source==='athletics'?'athletics':'activities';
 const view=params.view==='MONTH'?'MONTH':'AGENDA';
 const validMonth=typeof params.month==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(params.month)&&params.month>=min&&params.month<=max;
 const month=validMonth?params.month:current;
 const warning=(params.month!==undefined&&!validMonth)||(params.source!==undefined&&!['activities','athletics'].includes(params.source))||(params.view!==undefined&&!['AGENDA','MONTH'].includes(params.view));
 const event=typeof params.event==='string'&&params.event.length<=1000?params.event:null;
 return {source,view,month,current,min,max,event,warning};
}
export function calendarHref(state,patch={}){const next={...state,...patch};const query=new URLSearchParams({source:next.source,view:next.view,month:next.month});if(next.event)query.set('event',next.event);return '/calendar?'+query.toString()}
export function monthCells(month){const [year,value]=month.split('-').map(Number);const first=new Date(Date.UTC(year,value-1,1));const days=new Date(Date.UTC(year,value,0)).getUTCDate();return [...Array(first.getUTCDay()).fill(null),...Array.from({length:days},(_,i)=>`${month}-${String(i+1).padStart(2,'0')}`)]}

export function publicEventHref(event){
 const month=event.allDay?event.start.slice(0,7):schoolMonth(new Date(event.start));
 return calendarHref({source:'activities',view:'MONTH',month,event:`activities:${event.id}`});
}
