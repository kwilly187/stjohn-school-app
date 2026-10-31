# Announcement relevance: future adapter contract

Status: **design contract and synthetic test proof only**. No live feed, login, student database, school connection or public sample announcement has been added. The current Updates screen remains honest about its Alma handoff.

## Server boundary comes first

A future adapter must obtain source-approved data under the requesting user's verified school identity and guardian-to-student permissions. Unknown school, unknown account, unverified guardian relationship, revoked membership or source-access failure **denies the private feed at the server boundary**. Never fetch a school-wide private dataset into a browser and call client-side grade filtering security. A self-selected grade/team may filter only explicitly public content.

The pure matcher in `tests/support/audience-match.mjs` is **NOT authorization**. It is a test-only function, is not imported by the app and trusts its synthetic input. Its schoolId check is a relevance guard, not proof of account ownership. A real integration still needs separate authorization, revocation, audience enforcement and cross-school security tests before use.

## Minimum adapter output

- Source message: stable `id`, source and school identity, title/body, publication and optional expiry time, explicit visibility, and audience metadata supplied or approved by the school.
- Audience: `schoolwide`, exact `grades`, `classIds`, `teamIds`, explicitly targeted `studentIds` (or activity IDs under an approved equivalent schema). Explicit branches are OR matches; missing/unknown audience matches nothing.
- Verified viewer context: authorized school identity and children with stable IDs, display labels and school-confirmed enrollment/class/team scopes. Do not infer these from email address, typed child name or a grade picker.
- Feed result: authorized messages matching schoolwide OR any relevant child scope, deduplicated by message ID and labeled with relevant children. Expired/future/invalid-date messages are excluded.
- Source status: last successful fetch, source timestamp where provided, and explicit unavailable/stale state. Never replace a source error with “no announcements.”

Schoolwide means every authorized family **within that school**, not public visibility. Multiple-child families see a combined relevant feed; a sixth-grade-only family does not receive unrelated high-school or other-team messages. A message for both children appears once with both labels. Student-specific notices intersect only verified household student scopes; other students’ notices must not enter the authorized feed. A future All children / individual child view narrows the already authorized household feed, never broadens it. Do not expose real names or student IDs in public configuration, public fixtures or unauthenticated responses.

## Staff workflow

Staff choose the audience once in the existing authoritative publishing system. Reuse its audience controls if exposed by the approved integration. If that source cannot provide suitable audience metadata, resolve that with the school/vendor before launching personalized announcements; don't create a duplicate CMS or silently guess recipients.

## Safe demonstration

`npm test` runs wholly synthetic fixtures for schoolwide, sixth-grade versus high-school exclusion, exact team/class scope, multiple-child labels, deduplication, expiry and unknown scopes. No fixture is rendered publicly or represented as an actual school message. Passing these tests proves only relevance logic, not school integration, student-data security or message delivery.
