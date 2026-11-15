import {school} from './school-data.mjs';
import {devotionRecords,devotionOverrides} from './devotion-data.mjs';
import {selectDailyDevotion} from './devotion-selection.mjs';
export default function DevotionCard(){
 const selected=selectDailyDevotion({records:devotionRecords,overrides:devotionOverrides,date:new Date(),timeZone:school.timeZone});
 if(!selected?.record)return null;
 const devotion=selected.record;
 return <section className="devotion-card" aria-labelledby="devotion-heading"><div className="devotion-top"><h2 id="devotion-heading">Daily devotion</h2></div><div className="devotion-title"><h3>{devotion.title}</h3><span>{devotion.scriptureReference}</span></div><p>{devotion.reflection}</p><p className="devotion-prayer"><strong>Prayer</strong> {devotion.prayer}</p></section>;
}
