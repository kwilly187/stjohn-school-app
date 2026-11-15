/**
 * @typedef {{id:string,title:string,scriptureReference:string,reflection:string,prayer:string,approvalStatus:string,publishStatus:string,authorSource?:string}} Devotion
 */
/** Selection only, not publishing permission. Records must come from an approved source. */
export function schoolDateKey(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
  const part = type => parts.find(value=>value.type===type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
/** @param {{records:Devotion[],overrides?:{date:string,devotionId:string}[],date:Date,timeZone:string}} options */
export function selectDailyDevotion({records,overrides=[],date,timeZone}) {
  const schoolDate = schoolDateKey(date,timeZone);
  const eligible = records.filter(record=>record.approvalStatus==='approved' && record.publishStatus==='published');
  if (!eligible.length) return null;
  // A dated staff override wins only when its referenced content is approved and published.
  const override = [...overrides].reverse().find(item=>item.date===schoolDate && eligible.some(record=>record.id===item.devotionId));
  if (override) return {record:eligible.find(record=>record.id===override.devotionId),schoolDate,selection:'override'};
  const dayNumber = Math.floor(Date.parse(`${schoolDate}T00:00:00Z`)/86400000);
  return {record:eligible[((dayNumber%eligible.length)+eligible.length)%eligible.length],schoolDate,selection:'rotation'};
}
