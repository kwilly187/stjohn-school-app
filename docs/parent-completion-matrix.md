# Parent app completion boundaries

This is an independent proposal; school approval is not yet in place. “Waiting on
connections” must not imply that a login or API key completes unbuilt workflows.
No fake student records are displayed in the public preview.

| Area | Built now | Still required |
| --- | --- | --- |
| Public school dates | Native agenda/month/detail, source freshness, history, individual ICS download | School calendar remains authoritative; source quality and cancellations belong to its editors |
| Contacts | Published directory, full search/filters/pagination, browser-local saved contacts, office and athletics email/call routing | No in-app messaging/delivery or inferred teacher assignment |
| Lunch/store/policies | Actual providers, school-specific stores, meal help, native policy/participation information | Provider account sign-in and transactions stay external; reliable native menu data not verified |
| Student overview | Profile selector, explicit source availability, separate real public dates | Private source authorization, real family identity, guardian/student mapping and source adapters; presentation profiles grant no access |
| Student record display | Typed normalized renderers for assignments, grades, memberships and announcements; empty/unavailable/freshness states and synthetic server-render tests | Verify vendor fields, permissions, actual course/assignment/grade semantics, freshness and integration behavior before activation |
| Announcements | Planned normalized read-only student view | Vendor feed/audience guarantees, corrections/expiry, source attribution; replies and notification delivery remain separate work |
| Pickup | Discoverable proposed parent walkthrough, navigation only | School chooses/confirms vendor; supported arrival mechanism, identity/restrictions, school policy, staff flow and fallback must be verified. A generic release system is not being built |
| Sign-in | Public tasks need no app sign-in | Approved authentication/session design, account recovery, verified family grants and provider-supported SSO; not universal or implemented |
| Integration setup | Configuration readiness contract and approval/test/activation checklist, not wired | School/vendor permission, supported endpoints, secure credentials, real authorization, adapter implementation, acceptance and rollout |

## Work that can proceed without school access

Reusable student display components and deterministic formatting/empty/error
states are now implemented locally using synthetic test-only data. Preserve source separation and test that
selected-child display never expands to other records. Improve verified public tasks.
These tests do not establish authentication, RLS, private storage or vendor compatibility.

## Work that cannot be promised as an access-only switch

Alma private fields/feeds and reply semantics, dismissal vendor arrival/staff protocols,
provider SSO and device push require confirmed contracts and adapter/platform work.
Do not create fake send/check-in/save controls while those contracts are unknown.
Staff should continue publishing in existing approved systems, not a second console.
