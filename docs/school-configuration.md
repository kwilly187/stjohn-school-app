# School configuration boundary

`app/school-data.mjs` is the public school configuration: name, app title, mascot, local logo path, primary brand colors, contacts, provider labels/links, calendar IDs/timezone and resource cards. Place a school's approved logo in `public/` and set its path there. Shared page structure and navigation stay in `app/`; Seagull attribution is discreet and school identity stays primary.

For another school, begin with a separate deployment and reviewed configuration, confirm its actual sources and resource copy, and repeat parent/admin acceptance checks. Provider descriptions and source-check date must be reviewed too; don't copy St. John's integrations or imply access to them.

This is a reusable single-school front end, not a multi-tenant service. No tenant authentication, student database, billing/licensing platform or cross-school isolation guarantee is implemented or claimed. School permissions, data ownership, branding/licensing and operational responsibilities require separate agreement before onboarding another school. No credentials belong in this public configuration.

See `content-ownership.md` for update ownership and what has not been tested.
