/** Fictional UI demo only. Not identity, authorization, or a live school feed. */
export const sampleStudents = [
  {id:'jordan-example', name:'Jordan Example', grade:6, classIds:['sample-science-6'], teamIds:['sample-middle-school-team']},
  {id:'taylor-example', name:'Taylor Example', grade:9, classIds:[], teamIds:['sample-cross-country']},
];
export const sampleNow = '2026-01-15T12:00:00Z';
const base = {schoolId:'fictional-demo', status:'published', publishedAt:'2026-01-01T12:00:00Z'};
export const sampleNotices = [
  {...base,id:'welcome',category:'Schoolwide',title:'A place for the whole family',body:'An example schoolwide welcome, shown once even when it applies to both students.',audience:{schoolwide:true}},
  {...base,id:'grade-six',category:'Grade 6',title:'A look inside sixth grade',body:'An example grade-level note about classroom learning and routines.',audience:{grades:[6]}},
  {...base,id:'grade-nine',category:'Grade 9',title:'Getting settled in high school',body:'An example ninth-grade note about finding a rhythm in high school.',audience:{grades:[9]}},
  {...base,id:'science',category:'Science class',title:'Exploring the natural world',body:'An example classroom update about a science project. No supplies or action are needed.',audience:{classIds:['sample-science-6']}},
  {...base,id:'team',category:'Cross-country team',title:'Building team spirit',body:'An example team note about encouragement and teamwork, not a practice or event announcement.',audience:{teamIds:['sample-cross-country']}},
  {...base,id:'middle-school-team',category:'Sample athletics team',title:'Encouragement for our team',body:'A fictional athletics update for Jordan’s sample team, about supporting teammates. This is not a real team assignment, schedule or action request.',audience:{teamIds:['sample-middle-school-team']}},
  {...base,id:'personal',category:'Student-specific',title:'A note for Jordan’s family',body:'An example of a note addressed only to this fictional student’s family. It is not a real student message.',audience:{studentIds:['jordan-example']}},
];

/** Unknown query values match nobody; they never expand to the whole family. */
export function selectSampleStudents(selection) {
  if (selection === undefined || selection === 'all') return sampleStudents;
  return sampleStudents.filter(student => student.id === selection);
}

/** Relevance filtering for synthetic fixtures; never use as an access control. */
export function sampleFamilyFeed(notices, students, now = sampleNow) {
  const instant = Date.parse(now);
  if (!Number.isFinite(instant) || !students.length) return [];
  const seen = new Set();
  return notices.flatMap(notice => {
    const published = Date.parse(notice.publishedAt);
    if (notice.schoolId !== 'fictional-demo' || notice.status !== 'published' || !notice.id || seen.has(notice.id) || !Number.isFinite(published) || published > instant) return [];
    if (notice.expiresAt && (!Number.isFinite(Date.parse(notice.expiresAt)) || Date.parse(notice.expiresAt) <= instant)) return [];
    const audience = notice.audience;
    if (!audience) return [];
    // Explicit personal targeting stays personal, even with accidental broad metadata.
    const personal = Array.isArray(audience.studentIds) && audience.studentIds.length > 0;
    const relevantStudents = students.filter(student => personal
      ? audience.studentIds.includes(student.id)
      : audience.schoolwide === true || (audience.grades || []).includes(student.grade) ||
        (audience.classIds || []).some(id => student.classIds.includes(id)) ||
        (audience.teamIds || []).some(id => student.teamIds.includes(id)));
    if (!relevantStudents.length) return [];
    seen.add(notice.id);
    return [{...notice,relevantStudents,schoolwide:!personal && audience.schoolwide === true}];
  });
}
