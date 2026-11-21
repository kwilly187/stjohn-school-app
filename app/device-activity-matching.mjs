export const DEVICE_ACTIVITIES=[{id:'beach-volleyball',label:'Beach volleyball'},{id:'indoor-56-volleyball',label:'5th/6th grade indoor volleyball'},{id:'track',label:'Track'}];
const clean=text=>text.normalize('NFKC').toLowerCase().replace(/[‐‑–—−]/g,'-').replace(/\s+/g,' ').trim();
const pair56=/\b(?:grades?\s+5(?:th)?\s*(?:[/&-]|and|to)\s*6(?:th)?\b|5th\s*(?:[/&-]|and|to)\s*6th\b|5\s*[/&-]\s*6\s+(?:(?:girls?|boys?|indoor)\s+){0,3}volleyball\b)/;
const hardExclude=/\b(?:varsity|jv|high school|hs|adult|alumni|club only|boys only)\b/;
const middle=/\b(?:middle school|ms)\b/;
const division=/\b(?:grades?\s*(\d{1,2})(?:st|nd|rd|th)?(?:\s*(?:[/&-]|and|to)\s*(\d{1,2})(?:st|nd|rd|th)?)?|(\d{1,2})(?:st|nd|rd|th)\s*grade)\b/;
const shorthand=/\b(\d{1,2})\s*[/&-]\s*(\d{1,2})\s+(?:(?:girls?|boys?|indoor|beach|sand)\s+){0,3}(?:volleyball|track)\b/;
const schoolAge=/\b(?:u\s*\d{1,2}|\d{1,2}\s*u)\b/;
export function matchDeviceActivity(title,grade){
 if(typeof title!=='string'||!Number.isInteger(grade)||grade<1||grade>12)return null;
 const text=clean(title);if(hardExclude.test(text)||schoolAge.test(text))return null;
 const div=division.exec(text), shorthandDiv=shorthand.exec(text);
 let first=Number(div?.[1]||div?.[3]||shorthandDiv?.[1]||0),last=Number(div?.[2]||shorthandDiv?.[2]||first);
 if(!first&&pair56.test(text)){first=5;last=6;}
 if(first&&(grade<first||grade<1||grade>last))return null;
 if(!first&&middle.test(text)&&!(grade>=6&&grade<=8))return null;
 if(/\bvolleyball\b/.test(text)){
  if(/\b(?:beach|sand)\s+volleyball\b/.test(text))return /\bindoor\b/.test(text)?null:'beach-volleyball';
  if(pair56.test(text)&&/\bindoor\b/.test(text)&&!(/\b(?:beach|sand|outdoor)\b/.test(text))&&grade>=5&&grade<=6)return 'indoor-56-volleyball';
  return null;
 }
 if(/\btrack\b/.test(text)&&(first||middle.test(text))&&!/\b(?:track your|track and trace)\b/.test(text))return 'track';
 return null;
}
