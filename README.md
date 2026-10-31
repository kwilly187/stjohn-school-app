# St. John Saints Parent

A public, mobile-first school resource hub with Today, Calendar, Updates and Resources. Existing school/provider systems remain authoritative. No authentication, student database, custom admin platform or payment handling is added.

## Run and check

- `npm ci`
- `npm test`
- `npm run build` (includes Next.js TypeScript checks)
- `npm start`

See [content ownership and parent/admin walkthrough](docs/content-ownership.md) for publishing responsibilities and launch limitations. Public destinations are centralized in `app/school-data.mjs`. Real school notices and account details are not loaded into this app.

Production release is approval-gated. Develop on isolated branches and review previews first.

## Reuse for another school

School identity, colors, contacts, calendars and resource URLs are centralized in `app/school-data.mjs`. See [school configuration](docs/school-configuration.md). Start with separate reviewed deployments, not a shared student-data platform.
