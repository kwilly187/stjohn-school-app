import {schoolDateKey} from './devotion-selection.mjs';
// Verbatim public-domain World English Bible Classic, verified with publisher 2026-11-14.
// Curated reading rotation, not the school's lectionary or an approved school devotion.
export const scriptureReadings = [
 {reference:'Psalm 23:1',text:'Yahweh is my shepherd; I shall lack nothing.',source:'https://ebible.org/eng-web/PSA023.htm'},
 {reference:'Psalm 118:24',text:'This is the day that Yahweh has made. We will rejoice and be glad in it!',source:'https://ebible.org/eng-web/PSA118.htm'},
 {reference:'Psalm 23:2–3',text:'He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He guides me in the paths of righteousness for his name’s sake.',source:'https://ebible.org/eng-web/PSA023.htm'},
 {reference:'Psalm 118:1',text:'Give thanks to Yahweh, for he is good, for his loving kindness endures forever.',source:'https://ebible.org/eng-web/PSA118.htm'},
 {reference:'Psalm 23:4',text:'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.',source:'https://ebible.org/eng-web/PSA023.htm'},
 {reference:'Psalm 118:6',text:'Yahweh is on my side. I will not be afraid. What can man do to me?',source:'https://ebible.org/eng-web/PSA118.htm'},
 {reference:'Psalm 23:6',text:'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.',source:'https://ebible.org/eng-web/PSA023.htm'},
];
export function dailyScripture(date=new Date(),timeZone='America/New_York'){
 const dateKey=schoolDateKey(date,timeZone);
 const day=Math.floor(Date.parse(`${dateKey}T00:00:00Z`)/86400000);
 return {...scriptureReadings[((day%scriptureReadings.length)+scriptureReadings.length)%scriptureReadings.length],dateKey};
}
