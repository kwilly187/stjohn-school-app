# Unified parent experience

## Product direction

The app is the parent's main interface, not a directory of links. Existing approved school systems remain the source of truth. Staff should not re-enter assignments, grades, announcements, schedules or store products in a second console.

The current public preview does not fulfill this whole scope. External links are useful fallbacks while integrations are unbuilt or unavailable, not the final product architecture.

## Integration flow

1. A trusted server resolves a real session to the school and guardian identity.
2. Current school/guardian/student permissions are checked on every private read, including per-child capability grants. A parent allowed grades for one child does not automatically gain that field for every selected child.
3. An approved provider adapter fetches only supported fields for that scope.
4. The server normalizes and validates records; the parent interface renders a unified experience with source availability and freshness.
5. If one provider fails, its area is unavailable without hiding other working areas. Never replace failed private data with synthetic examples.

`app/integrations/student-data-service.server.mjs` provides a provider-neutral orchestration seam for assignments, grades, memberships and announcements. It checks exact requested-child grants, per-child field-capability permissions and school/capability readiness, invokes supplied adapters, isolates failures, bounds provider waits and applies the existing display validation. Synthetic tests exercise those boundaries. No page currently calls it. It is not a session implementation, a provider integration or proof of vendor compatibility.

Do not accept the authentication callbacks, connection settings or adapters from browser request bodies. A server integration must supply them from trusted code. Do not use presentation profiles as access grants. A real implementation must also enforce provider field permissions and protect credentials server-side.

## Capability work remaining

| Parent task | Native target | Needed before activation |
| --- | --- | --- |
| Grades and assignments | Grade-specific work and grades in the student's view | School-approved source, verified API fields, session and active guardian/student mapping |
| Sports and activities | Relevant teams, participation and schedules | Verified memberships plus authoritative schedules; grade eligibility alone is not enrollment |
| Communications | Read school/class/student messages in context | Confirm school platform, audience rules, corrections and retention; message sending/replies need separate supported write permissions and delivery status |
| Store | Browse real products and availability in the app | Provider-supported catalog, variant and inventory interface; checkout/payment integration and terms before any purchase control |
| Calendar | Native search, month/agenda, event details and sharing | Public feed currently used; private schedules need the same identity and scope controls |
| Pickup | Native experience backed by the school's chosen dismissal provider | School/vendor authorization, guardian restrictions and verified arrival/release protocol; no custom release workaround |

## Provider facts and limits

Alma advertises integration capability, but exact school entitlements, student fields, guardian mapping, SSO and write permissions are not verified here. The existing Alma destination does not prove API access. Do not assume another communications provider is in use or exposes a supported API.

Each provider needs an adapter acceptance suite using its confirmed contract, followed by school-approved test identities and data. No scraping of private portals or duplicated staff publishing is planned.

## Handoff acceptance

The school must see a clear distinction between public preview capabilities, synthetic-tested code and actual connected operations. Before release, verify real sign-in/account recovery, child isolation, revoked access, missing data, source outages, mobile behavior, accessibility and staff ownership. Only activate capabilities that pass the relevant checks.

## Parent calendar transfer

Parents can now subscribe to the configured public school activities or athletics feeds through their calendar app, or copy the subscription URL for a calendar that accepts URLs. Subscriptions follow school updates, subject to the receiving calendar app's refresh interval. They include the full public source, not a particular child's enrollment, grade or search filter.

The current Calendar selection and My Students public-date selection can also be exported as a multi-event ICS file. That is a one-time snapshot; it does not sync later changes or cancellations. My Students currently exposes only matched public school dates, not private assignments or confirmed team membership. Export filenames and URLs do not include a child's identity.

A genuine private child-calendar subscription remains unimplemented. It requires verified guardian access, authorized private sources and a revocable access mechanism with access-loss handling. Do not publish private records into a public school feed or assume the public subscription satisfies that requirement. Calendar-app/device subscription and import acceptance remains to be tested.
