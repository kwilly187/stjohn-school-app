# Who updates what

**Update once, at the source.** This app gathers public information and opens the school's existing accounts. It does not give the school a second publishing system, mirror private records, or replace an existing provider.

| Information parents see | Where the owner makes changes | What this app does |
| --- | --- | --- |
| School events and athletics | School office/activities staff and athletics staff update their existing public Google calendars | Calendar, Home and public student dates read the school calendars. No app edit for a calendar event. Public grade/activity matches do not establish team enrollment. |
| School notices, grades, assignments, attendance and official student links | School and teachers use their existing approved systems, including Alma | Opens Alma for school sign-in. No inbox, private records, roster sync, notification delivery or verified guardian-to-student relationship is connected. |
| Forms, permissions and registration | Office, teachers and the school's existing forms or communications | Links families to the correct provider or office; does not collect submissions on their behalf. |
| Tuition and fees | School finance office and its existing payment provider | Links to the existing account. No local balance or payment processing. |
| Lunch menu, lunch account and aftercare signup | Nutrislice / food service, PaySchools and Brightwheel respectively | Links to the existing menu, account and signup. Aftercare signup is not pickup changes or an existing-family inbox. |
| Contacts, staff directory, public guidance, provider links and pickup maps | Office or school website owner confirms the change; the named app maintainer updates the public configuration or snapshot | These are reviewed links and local snapshots, **not** a live sync from the school website. Pickup is a reference; call the office for urgent changes. No arrival check-in or student release. |
| Uniforms and spirit wear | School confirms approved uniform and merchandise vendors | Approved vendor links remain separate. The Saints Store concepts and device-local favorites are not inventory, checkout, or an order. |
| Daily Scripture | App maintainer maintains sourced World English Bible readings; school confirms use at launch | Rotates by Eastern school date. Not a separate daily staff posting task or a school-authored devotion feed. |
| Pins, saved contacts and Text the Week | The parent on their device | Device-local preferences or a draft the parent chooses to copy or share. No school operation, audience list or automatic sends. |

Most public links and contact settings live in `app/school-data.mjs`; staff snapshots are in `app/staff/staff-data.mjs`; the pickup maps are in `public/pickup/`. This app is not yet owned or operated by the school. For operational acceptance, access and recovery see [school handoff](school-handoff.md).
