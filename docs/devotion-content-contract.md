# Daily devotion: bounded content contract

The Today card currently shows **an original preview draft awaiting school review**, not today's official church/school devotion. It includes a Scripture reference only, no copyrighted translation quotation. `devotionRecords` and `devotionOverrides` are empty. The visible draft is separate from the approved-content selector and cannot enter automatic rotation.

## Future school workflow
- A pastor or delegated ministry reviewer, chosen by the school, approves theological content. No specific person has been assigned here.
- Staff maintain the approved collection and dated overrides in an existing approved content system through a future adapter. No staff editor, publishing account, credentials or CMS integration has been implemented.
- Record fields: stable ID, title, Scripture reference, brief reflection, prayer, author/source, approval status, approval owner/date, publishing status. Maintain audit history in the authoritative source.
- Only records explicitly **approved AND published** may rotate. Unpublished or draft content is excluded even when an override references it.
- A dated override referencing eligible content wins; otherwise approved items rotate deterministically by school-local date (`America/New_York` for St. John). Same-day selections remain stable; future public requests resolve the current local date on the server.
- With no eligible record, the selector returns null. This design preview deliberately shows the separately labeled draft for review; production must hide it or use a school-approved fallback, never silently treat it as approved.
- No unchecked AI generation, scraped third-party devotion feed, theology API, publishing automation account or new operating cost is introduced.

## Provenance and review
The school's linked church states LCMS affiliation: https://www.stjohnocalachurch.org/what-we-believe . This establishes context, **not approval of the draft**. The church media page links Lutheran Hour Ministries; its daily devotion page may be linked with school approval, but no republication license/feed was verified. The prototype does not import its content.

Synthetic tests cover approval/publishing gates, override precedence, no-content behavior, deterministic rotation and school-local dates across UTC midnight/daylight-saving boundaries. They do not prove a working staff publishing integration.
