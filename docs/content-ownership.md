# Parent app: ownership and update workflow

## Operating principle
No duplicate entry: staff keep using their existing school systems. This app is a public front door, not a student information system, payment processor or new CMS. Parents need no app login; provider accounts keep their own login. No private information is ingested or stored.

## Visible content and who changes it

| Visible content | Authoritative owner / source | How an authorized school administrator updates it | Parent result / verification |
| --- | --- | --- | --- |
| School & activities calendar | School's existing Google Calendar | Use the school's existing calendar editor and account; update the same event there | Calendar → School & activities. Verify title/time in Agenda and Month, and on the official school calendar page. No app redeployment for event edits. |
| Athletics information and contact | School athletics page / athletics office | Maintain the existing https://stjohnocala.org/home-2/ page and school contact | Parents use current Google Calendar for dates; older 2025 PDFs are not imported. Contact email is school-published. |
| Athletics calendar | Athletics staff's existing Google Calendar | Update the existing athletics calendar, not a duplicate app calendar | Calendar → Athletics. Verify Eastern Time and the correct event on the school's page. |
| Important notices and Updates | School/teachers in Alma and existing school communication channels | Publish through the existing approved Alma workflow | Parents open Alma from Today or Updates; the public app does not show or count private messages. No claim that announcements are synced here. |
| Forms, permission slips and child-specific actions | School office / teachers / existing school systems | Send through normal school channels and keep the public parent page current | Today directs families to school communications for anything due; portal and office links remain available. School supplies, dress code and general parent information open the authoritative website. |
| Grades and attendance | School/teachers in Alma | Maintain records in Alma | Resources → Grades & attendance. Login stays with Alma. |
| Tuition and school fees | School finance office / Blackbaud | Maintain existing Blackbaud accounts; school calls its link Smartcart | Resources → Tuition & school fees opens Blackbaud. No sample balance or local checkout. |
| Lunch menu | Maschio's | Vendor maintains the existing school menu page | Today or Resources → Lunch menu; app always opens source. |
| Lunch account | PaySchools / school food-service administration | Maintain existing PaySchools account workflows | Resources → Lunch account. No balances copied into app. |
| Aftercare signup | School aftercare staff / Brightwheel | Maintain the existing school enrollment packet | Opens school-linked signup packet. Not labeled as existing-family account management or a pickup-change form. |
| Easy contact choices on Updates | School-published office and athletics contacts / staff directory | School maintains contact pages; app maintainer updates mailto addresses if they change | Parents choose office, teacher or athletics. Email opens their email app; no in-app inbox and no automatic send. No test messages sent. |
| Staff directory, contact and school office | School website owner / office | Update school website contact/directory pages | Resource links open current source. Hard-coded phone must also be updated in app if it changes. |
| Uniforms and spirit wear | School-approved FlynnO'Hara and BSN stores | Vendors manage products, prices, stock and checkout | Links open vendor stores. No demo cart or inventory in the app. |
| Events & fundraising | Separate SaintsSpirit project owner | Update the separate event site | Resources opens its approved preview URL. Online giving is not active; app does not promise registration or payments. |
| Teacher wish lists & Saints Network | School/PTL; no approved live source supplied | Confirm owner and canonical source before adding links | A collapsed note preserves the concepts without publishing fictional listings or membership prices. |
| Powered by Seagull footer | Seagull product owner | Maintain platform attribution in app/school-data.mjs | Discreet footer link; school branding remains primary. |
| Navigation, preview labels and destination URLs | App maintainer | Update app/school-data.mjs or page copy in an isolated branch; test; review | Preview review first. Production changes require explicit approval. |
| Logo | School website asset | Reuse official supplied logo; don't redraw branding | Local public/stjohn-logo.png avoids an external-image dependency. |

## Parent acceptance journey
1. Open Today on a phone without logging in. Find important notice guidance, upcoming dates, daily links and office help.
2. Open Calendar; switch School & activities / Athletics and Agenda / Month. Follow the direct link if Google is blocked or blank. Never infer that a blank embed means no events.
3. Go to Updates and open Alma. Confirm private-message source is clear and there are no fabricated notices, notification counts or grade filters.
4. Open each resource. Verify provider identity, and return with browser Back. Use browser Forward and direct route reloads.
5. Find aftercare signup (not pickup changes), uniforms, staff contacts and the separate SaintsSpirit site. Do not enter student or payment data in testing.
6. At small screen widths and keyboard-only, verify no hidden actions, horizontal app overflow or inaccessible navigation.

## School administrator acceptance journey
1. Identify the owner and source for each row above before introducing this app to families.
2. In an authorized school test account, update a non-sensitive calendar test event, confirm the public embed and official school page match, then remove the test event.
3. Using approved school test identities, publish a test Alma notice and verify its recipient access. It will appear in Alma, not this public app.
4. Confirm current resource URLs and office contact with their owners. Check any changed destination from Resources.
5. Review the separate event website wording with its owner. Do not enable payments here.

**Not performed:** school-account calendar edits, Alma publishing/permissions, provider logins, child-specific records, transactions, account balances or notification delivery. No school credentials or publishing permission were supplied. The review here covers update-path design and public links, not authenticated school administration.

## Launch prerequisites
- School confirms the source owners, office contact and provider destinations.
- School confirms the actual calendar contents and public visibility; an iframe load event alone cannot prove Google returned events.
- School decides whether a public announcement source is needed. Reuse an approved existing feed if available; do not build a second staff publishing system without approval.
- Confirm the final SaintsSpirit URL when its project owner approves launch.
- Review preview and explicitly authorize production release.

## Source provenance
Public link map checked October 31, 2026 against https://stjohnocala.org/for-parents/ and https://stjohnocala.org/calendar/. Calendar IDs are the school's existing public embeds. This check date concerns link provenance, not live event/message freshness.
Official logo downloaded from https://stjohnocala.org/wp-content/uploads/2025/01/80137d10ddb323d6c10bef428e05a2d3.png and visually verified. No newly generated branding.
