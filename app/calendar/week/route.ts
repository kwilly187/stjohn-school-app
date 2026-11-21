import {getCalendarFeed} from '../calendar-feed.mjs';

export async function GET(request:Request){
 const query=new URL(request.url).searchParams;
 const source=query.get('source'),month=query.get('month'),weekStart=query.get('start');
 if((source!=='activities'&&source!=='athletics')||!month||!weekStart){
  return Response.json({status:'unavailable'},{status:400});
 }
 const result=await getCalendarFeed({source,month,weekStart});
 if(result.status!=='ok')return Response.json({status:'unavailable'},{status:503});
 return Response.json({status:'ok',events:result.events.map(({id,title,dateText,location})=>({id,title,dateText,location}))});
}
