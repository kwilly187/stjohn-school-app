import {school} from './school-data.mjs';
import {devotionRecords,devotionOverrides,draftDevotion} from './devotion-data.mjs';
import {selectDailyDevotion} from './devotion-selection.mjs';
export default function DevotionCard(){
 const selected=selectDailyDevotion({records:devotionRecords,overrides:devotionOverrides,date:new Date(),timeZone:school.timeZone});
 const devotion=selected?.record||draftDevotion;
 return <section className="devotion-card" aria-labelledby="devotion-heading"><div className="devotion-top"><h2 id="devotion-heading">Daily devotion</h2>{!selected&&<span className="devotion-status">Preview · awaiting school review</span>}</div><div className="devotion-title"><h3>{devotion.title}</h3><span>{devotion.scriptureReference}</span></div><p>{devotion.reflection}</p><p className="devotion-prayer"><strong>Prayer</strong> {devotion.prayer}</p></section>;
}
