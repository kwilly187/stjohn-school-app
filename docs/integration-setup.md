# School integration setup — preparation, not a live connection

The school has not approved this proposal. The current app reads only the school's
published website information and public calendars. Private student sections remain
not connected. There is no staff publishing console or second inbox.

## One source, minimal repeated sign-ins

Plan around Alma as the primary school system, subject to school confirmation.
Staff continue using their existing applications. The parent app should receive only
supported, authorized data; it must not require duplicate posting.

Alma's official [integration overview](https://www.getalma.com/alma-plays-nice/)
confirms APIs/custom integrations and its App Center. It does **not** establish our
access to assignments, grades, team membership, announcements, replies or generic
SSO. Confirm each capability separately with the school and vendor. Do not infer
membership from a public sports schedule. A calendar subscription is not a private
student integration. Data synchronization, replying, and device push notifications
are separate capabilities. Dismissal vendor selection is also unconfirmed.

## Approval-to-activation checklist

1. **School owner and scope:** obtain written school approval, identify the owner,
   primary system, permitted fields, retention and withdrawal requirements.
2. **Vendor capability check:** confirm actual endpoints, access terms, rate limits,
   sandbox/test access and supported sign-in method. Record supported read categories
   individually: assignments, grades, memberships and announcements. Unknown means off.
3. **Secure configuration:** keep school ID, provider, capability flags and connection
   status separate from UI. Keep credentials only in approved server-side secret
   storage, never source code, public browser configuration or chat. No secrets or
   endpoints have been provisioned by this preparation.
4. **Family mapping:** use school-confirmed active guardian-to-student relationships.
   A presentation profile, selected grade, child query parameter or household label
   is not authorization. Check school/guardian/student/field access on every request;
   revoke access immediately and prevent cross-family caching.
5. **Adapter validation:** normalize permitted fields per student, with source and
   last-success timestamps. Distinguish disconnected, unavailable/stale and a genuinely
   successful empty result. Test cross-school/child denial, revocation, dates, failure,
   correction and duplicate delivery using synthetic data first.
6. **School acceptance and activation:** authorized staff verify source updates appear
   correctly without double posting. Confirm reply routing and notification consent
   separately. Obtain explicit release approval before activation; retain a disable
   switch and a documented rollback/contact owner.

## Existing code and readiness boundary

- Public school destinations/branding are in `app/school-data.mjs`; public calendar
  sources remain fixed and separate from private connectors.
- `app/students/student-records-policy.mjs` validates normalized display payloads;
  `student-records.tsx` renders each section and its availability/freshness. The page
  deliberately passes an empty payload, so no private records are fetched or shown.
  Only an authorized server adapter may replace that input. Presentation selection
  in `dashboard-data.mjs` remains display context, not authentication.
- `app/integrations/connection-contract.mjs` is an **unwired configuration contract**.
  `configured` is not `verified`; verified capability plus explicit activation is
  only setup readiness, never permission to return a student's data. Its tests are
  not authentication, RLS, vendor integration or secure storage tests.
- The public repository's presentation profiles contain no people. The separately
  authorized hosting-only profile must never become an enrollment or access record.

Still required before private use: school/vendor authorization, real authentication,
server-side authorization, approved credential/storage setup, actual adapter and
school acceptance. No new account, paid resource, private fetch, push service or
operational pickup action is implemented here.
