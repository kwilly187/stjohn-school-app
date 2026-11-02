/** Normalized display data only. A server adapter must authorize every record first. */
export type StudentSectionKey='assignments'|'grades'|'teams'|'announcements';
export type StudentRecordBase={id:string;studentId:string};
export type StudentAssignment=StudentRecordBase&{title:string;course:string;dueAt:string};
export type StudentGrade=StudentRecordBase&{course:string;value:string;reportedAt:string};
export type StudentTeam=StudentRecordBase&{name:string;season?:string};
export type StudentAnnouncement=StudentRecordBase&{title:string;body:string;publishedAt:string;expiresAt?:string};
export type StudentRecordsBySection={assignments:StudentAssignment;grades:StudentGrade;teams:StudentTeam;announcements:StudentAnnouncement};
export type StudentSectionFor<K extends StudentSectionKey>=
 | {key:K;status:'not-connected'|'unavailable';retrievedAt:null;items:[]}
 | {key:K;status:'ready';retrievedAt:string;items:StudentRecordsBySection[K][]};
export type StudentSection={ [K in StudentSectionKey]:StudentSectionFor<K> }[StudentSectionKey];
export type NormalizedStudentSection=StudentSection;
/** Untrusted adapter input is intentionally unknown until normalized and scoped. */
export type StudentSectionsPayload=Partial<Record<StudentSectionKey,unknown>>;
