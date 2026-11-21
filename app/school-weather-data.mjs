export const OBSERVATION_URL='https://api.weather.gov/stations/KOCF/observations/latest';
export const TIME_ZONE='America/New_York';
export function schoolDate(value){return new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,weekday:'short',month:'short',day:'numeric'}).format(new Date(value));}
export function parseObservation(data,now=Date.now()){
 const p=data?.properties,t=p?.temperature,at=Date.parse(p?.timestamp),age=now-at;
 if(!Number.isFinite(at)||age>2*60*60*1000||age< -5*60*1000||typeof t?.value!=='number'||!Number.isFinite(t.value)||t.value< -60||t.value>60||t.unitCode!=='wmoUnit:degC')return null;
 if(typeof p.textDescription!=='string'||!p.textDescription.trim()||p.textDescription.length>100)return null;
 return {temperature:Math.round(t.value*9/5+32),condition:p.textDescription.trim(),observedAt:new Date(at).toISOString()};
}
export async function loadOcalaWeather(fetcher=fetch,now=Date.now()){
 try{
  const r=await fetcher(OBSERVATION_URL,{headers:{Accept:'application/geo+json','User-Agent':'SaintsParentPortal (https://www.seagullmgmt.com)'},signal:AbortSignal.timeout(3000),next:{revalidate:600}});
  if(!r.ok)return null;
  return parseObservation(await r.json(),now);
 }catch{return null;}
}
