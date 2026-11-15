# School handoff checklist

## Current scope

A parent-first school resource hub. Home, Calendar, Contacts and Resources work from public school information. Families can open the school's existing Alma portal. The app does not yet authenticate guardians or retrieve private student records. Existing school systems remain authoritative; staff should not duplicate announcements in a second system.

## School decisions before release

- Name a school owner for public contacts, links, calendars and corrections.
- Confirm the official calendar and each linked provider.
- Confirm the intended audience and approve the published school identity and content.
- For private records, approve a supported provider connection and guardian-to-student access rules before implementation. A configured display or mock payload is not a live connection.
- Keep pickup limited to school-office contact until the school selects and authorizes its dismissal provider. The app must not record arrivals or authorize student release in its current form. Development walkthroughs have been removed from parent pages.

## Staff ownership

Update centralized public configuration in `app/school-data.mjs`. Calendar parsing and provider behavior must be retested when a feed changes. Credentials and private student data must not be committed to source. Use the school's existing platforms for official student records, approvals and dismissal.

## Release acceptance

1. Run `npm ci`, `npm test` and `npm run build` from the proposed commit.
2. Check the published preview on phone and desktop: navigation, calendar controls, contacts, Alma link and all resource links.
3. Verify empty/error states and ensure no demo student profile or misleading connected status is published.
4. Obtain school approval before production promotion. Retain the previous deployment for rollback.
5. Give the school repository/deployment ownership, content instructions and a named support contact through an approved handoff. No ownership transfer is performed by this checklist.

## Latest local checkpoint: November 14, 2026

- Removed the discontinued Saints Spirit preview from parent resources; events questions now lead to school contact options.
- Added an explicit Alma action on the student page while private integration is unavailable.
- Replaced decorative arrows with plain links; calendar controls use Previous and Next labels.
- Consolidated disconnected student sections into the Alma access card and combined duplicate community resource actions.
- Added everyday-language resource search while preserving normal browsing and existing native destinations.
- Added an unconnected, synthetic-tested server orchestration seam for future authorized student integrations; see `unified-parent-integration.md`.
- Matched restrained blue/gold accents to the existing official crest, enlarged the mobile crest and corrected the school-store icon. These colors are sampled from the asset, not claimed as a formal brand guide.
- Strengthened future student integration with per-child capability grants; assignments sort earliest first and announcements newest first.
- Added Add to my calendar: public full-calendar subscriptions and one-time bulk snapshots from Calendar and selected public student dates. No private child feed exists.
- Added public-event sharing with phone share, copy-link and manual-copy fallbacks. Shared links omit student-return context. Native sharing and clipboard behavior still need device acceptance.
- Added event/location search across Agenda and Month views, with explicit range counts and clear/reset controls. Search stays on-device and resets when the source or month changes.
- Automated checks: 192 tests passed; production build and TypeScript checks passed.
- Added plain-language recovery for unexpected page errors and missing links.
- Phone/desktop visual acceptance remains pending: Chromium is blocked by the workspace socket restrictions, including after an escalated test attempt. No visual acceptance is claimed.
- Publication and hosted validation are tracked separately; local checks are not a claim of school readiness.

### Publication candidate

Parent pages now omit development badges and simulated pickup steps. Pickup provides real office-help actions, and the historical review URL opens Home. Unapproved devotion content is hidden. Parent FAQ adds 11 official-source questions with search and categories. School phone, seasonal hours and account destinations were rechecked against the official parents/contact pages; the office email now uses the published contact-page address.

## School website entry point
Kyle's intended long-term placement is a link from the school's own website to this parent portal. No school domain or DNS changes have been made. The current stable preview remains on Seagull's Vercel account. At school handoff, agree the school-controlled URL and ownership first; then update canonical/social metadata and test sign-in callbacks and deep links. A link to a hosted portal needs no application path rewrite. Hosting under a nested path would require a deliberate base-path, asset, API, manifest and callback migration, not merely changing the public link.
