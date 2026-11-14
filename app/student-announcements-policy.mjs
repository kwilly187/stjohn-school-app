/** Categories describe updates, not a student's membership or source availability. */
export const studentAnnouncementCategories=[['all','All'],['school','School'],['classroom','Classroom'],['assignments','Assignments'],['grades','Grades'],['sports','Sports'],['clubs','Clubs']];
export function filterStudentAnnouncements(items,category='all',query=''){
 const allowed=studentAnnouncementCategories.some(([id])=>id===category)?category:'all';
 const search=query.trim().toLowerCase();
 return items.filter(item=>(allowed==='all'||item.category===allowed)&&(!search||`${item.title} ${item.body}`.toLowerCase().includes(search)));
}
