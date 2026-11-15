/**
 * TEST-ONLY relevance proof. Not imported by the app and NOT authorization.
 * A real server must first obtain an authorized source response for this viewer.
 * School/child scope here is synthetic input, not trusted identity or enrollment.
 */
export function matchRelevantAnnouncements(messages, scope, now) {
  if (!scope?.schoolId || !Number.isFinite(Date.parse(now))) return [];
  const instant = Date.parse(now);
  const matches = messages.flatMap(message => {
    if (message.schoolId !== scope.schoolId) return [];
    const published = Date.parse(message.publishedAt);
    if (!Number.isFinite(published) || published > instant) return [];
    if (message.expiresAt && (!Number.isFinite(Date.parse(message.expiresAt)) || Date.parse(message.expiresAt) <= instant)) return [];
    const audience = message.audience;
    if (!audience) return [];
    const children = (scope.children || []).filter(child =>
      audience.schoolwide === true ||
      (audience.studentIds || []).includes(child.id) ||
      (audience.grades || []).includes(child.grade) ||
      (audience.classIds || []).some(id => (child.classIds || []).includes(id)) ||
      (audience.teamIds || []).some(id => (child.teamIds || []).includes(id))
    );
    if (audience.schoolwide !== true && children.length === 0) return [];
    const relevantChildren = [...new Map(children.map(child => [child.id,{id:child.id,label:child.label}])).values()];
    return [{id:message.id,audienceLabel:audience.schoolwide === true ? 'Schoolwide' : relevantChildren.map(child=>child.label).join(' · '),relevantChildren}];
  });
  return [...new Map(matches.map(match => [match.id,match])).values()];
}
