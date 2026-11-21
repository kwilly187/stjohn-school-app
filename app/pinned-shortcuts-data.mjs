// Browser preference only: stored values are allowlisted shortcut IDs.
export const PINNED_SHORTCUTS_KEY='saints-parent.pinned-shortcuts.v1';
export const PIN_LIMIT=3;

export function normalizePins(value,knownIds){
 if(!Array.isArray(value))return [];
 const known=new Set(knownIds);
 return [...new Set(value.filter(id=>typeof id==='string'&&known.has(id)))].slice(0,PIN_LIMIT);
}

export function readPins(storage,knownIds){
 try{
  const raw=storage.getItem(PINNED_SHORTCUTS_KEY);
  return raw&&raw.length<=256?normalizePins(JSON.parse(raw),knownIds):[];
 }catch{return [];}
}

export function writePins(storage,value,knownIds){
 try{
  storage.setItem(PINNED_SHORTCUTS_KEY,JSON.stringify(normalizePins(value,knownIds)));
  return true;
 }catch{return false;}
}

export function togglePin(value,id,knownIds){
 const pins=normalizePins(value,knownIds);
 if(!knownIds.includes(id))return pins;
 if(pins.includes(id))return pins.filter(pin=>pin!==id);
 return pins.length<PIN_LIMIT?[...pins,id]:pins;
}

export function shortcutOrder(defaultIds,pins,knownIds){
 return [...new Set([...normalizePins(pins,knownIds),...defaultIds])];
}
