/** Preserve selection across public-date and example views; never grants access. */
export function studentModeHref(selection, examples) {
 const query=new URLSearchParams();
 if(selection && selection!=='all') query.set('student',selection);
 if(examples) query.set('mode','examples');
 return '/students'+(query.size?'?'+query.toString():'');
}
