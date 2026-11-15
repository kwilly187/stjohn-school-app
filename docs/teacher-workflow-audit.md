# Teacher workflow audit

Reviewed November 14, 2026. Source-level walkthrough of the public app, not a signed-in teacher test. No production changes or school data access occurred.

## Principal finding

The current app is a parent/public resource hub. `/staff` is a searchable contact directory, not a staff workspace. There is no teacher session, class roster, class-specific authorization or provider write integration. Showing the parent interface with a different role label would not fulfill the teacher workflow.

## Daily teacher walkthrough

| Task | Current experience | Required experience |
|---|---|---|
| Start the day | Public Home, notices and calendar | Today: assigned classes, next class, important notices and real unread messages. No fabricated counters. |
| Find a class | No class selector or roster | My Classes, with a single class selector preserved across assignments, grades and communications. Only actual assigned classes. |
| Review or assign work | My Students points to Alma | Existing authoritative assignment source first; show due dates, class and status. Supported provider writes or a direct source action, never a second unofficial gradebook. |
| Enter grades or attendance | No native actions | Keep the authoritative school system. In-app writes only after verifying provider support, staff permissions, validation, audit history and retry behavior. |
| Send a class announcement | No publishing workflow | Choose class/team/club, preview exact recipients, draft, publish/schedule, edit/correct and expire. Preserve provider delivery status; submission is not proof of delivery. |
| Reply to a parent | Directory email or Alma link | Contextual authorized thread, student/class context, real delivery state. Never expose a class-wide recipient list to other families. |
| Manage a team or club | Public athletics information | Assigned team/club roster and dates. Grade eligibility is not membership. Teacher access to a class must not grant coach access to other students. |
| Change an event | Public calendar reading/export | Source-managed change/cancellation reflected in the app and subscribed feeds. Do not create a second calendar entry for the same event. |
| Find resources | Public directory, forms, FAQ and resources | Reuse these functioning pages. Teacher-specific documents need an approved source and actual access rules. |
| End the day | No staff task view | Due/overdue items and drafts from real sources, not generic productivity scores or synthetic work lists. |

## Compact interface recommendation

Teacher navigation: **Today · Classes · Messages · Calendar**, with Resources in a secondary menu. Show a class selector at the top, not a long list of separate dashboards. Assignment/grade actions belong inside the selected class. Keep parent My Students and teacher My Classes separate. A person who is both guardian and teacher needs an explicit context switch backed by authenticated grants, not a browser role toggle.

## Reuse instead of rebuilding

- Reuse calendar presentation, public information, directory, FAQ and existing visual components.
- Keep school systems authoritative for assignments, grades, attendance and official messages.
- Do not introduce a second teacher publishing process merely to populate the parent app.
- Use one normalized update stream for class, academic, athletics and club updates, with explicit source, audience and lifecycle. Do not relabel every grade or assignment record as an announcement; distinguish notice versus task/change.

## Authorization and data boundaries

The current `loadStudentData` seam is guardian-specific and not connected to any route. It requires guardian-to-child grants; it must not be treated as teacher authorization. Teacher access needs school, employment status, assigned class/team/club and field capability checks. UI filters are not permission checks. Public school notices may remain public; private student work and messages must not be placed in the public announcement feed.

## Acceptance before real teacher use

1. Verify the school's actual systems and supported read/write operations; the Alma URL alone does not prove API availability.
2. Test with school-approved teacher and parent accounts, including a teacher with no assigned classes and a teacher who is also a parent.
3. Ensure cross-class access, removed staff, unassigned clubs and other students are denied server-side.
4. Test announcement audience preview, drafts, scheduling, corrections, expiry, repeated submission and provider outage recovery.
5. Prove assignment/grade changes reach the authoritative source exactly once and become visible only to authorized families.
6. Verify keyboard, phone layout and interrupted navigation with real role-specific views.

## Work safe to do now

Design and test teacher page structure, reusable status/empty states, provider-neutral contracts and synthetic authorization tests. Keep disconnected editing actions out of the public preview. The current public pages may be demonstrated, but a working teacher portal cannot be claimed yet.
