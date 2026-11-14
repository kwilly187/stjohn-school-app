// Search already-public events in the loaded range; never issue extra queries or store terms.
const normalize=value=>String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function filterCalendarEvents(events,query=''){
 const terms=normalize(query).slice(0,120).split(/\s+/).filter(Boolean);
 if(!terms.length)return events;
 return events.filter(event=>{
  const text=normalize(`${event.title??''} ${event.location??''}`);
  return terms.every(term=>text.includes(term));
 });
}
