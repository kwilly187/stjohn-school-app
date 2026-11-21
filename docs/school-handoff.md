# St. John school handoff

This is the operational checklist for a school pilot, not a record of school approval. Keep the current presentation preview and a known-good revision until a replacement passes review. Do not enable live school connections, change production, or transfer accounts as part of a demo.

## Before the pilot

1. Name a school decision owner and an IT operator/backup. Confirm who maintains the [sources and public snapshots](content-ownership.md), who handles incidents, and where families go for help.
2. Agree school-controlled repository, hosting and URL ownership. Keep credentials in the school-controlled secret store, not in the repository. Review access, billing, contact links, canonical metadata and rollback with school IT. A school website link or subdomain is sufficient; a nested path is a separate migration.
3. Use only reviewed public or fictional content during acceptance. A presentation-only profile is not an authenticated family. Before a pilot with real family data, the school must approve provider access and validate guardian-to-student assignment, revocation, and separation between families. Start by showing one school-linked student using school test identities. Parents should not manually search for their child or re-enter a school roster.
4. Review public navigation, dates, official fallback links, the Alma destination and device-local sharing on phone and desktop. Verify the installed iPhone experience separately. Run `npm ci`, `npm test`, and `npm run build` for the candidate revision.

## One change, one source, one recovery test

- Have a school operator change or cancel a **fictional** practice in a school-approved test feed once. It should update in the affected public calendar views without staff posting again. Check that it appears once, or disappears if canceled, and that the official source agrees.
- Separately fail only Athletics in a test setup while Activities stays healthy. Confirm Calendar shows the correct fallback rather than an empty result. The operator opens hosting runtime logs for the correct environment and filters for `school_calendar_unavailable`. Identify `source`, `phase` (fetch or parse), and `lastSuccessfulFetch`. A null value means the current instance has no earlier successful retrieval; it does not mean the provider has never worked.
- Using school-held access, the operator compares the public Google calendar against the official school page, restores the fixture and checks the recovered schedule once. For an unavailable source, do not add events manually to the app or tell families nothing is scheduled.
- Confirm how a named operator will learn about a failure. Page uptime is not feed health. The app warning is emitted on demand when a read fails; alert routing, external checks, staff access and recovery by school IT must still be proven before a pilot.
- If the school later approves private roster-based notifications, use separate fictional rostered and voluntary-follow families to verify what each can see and receive. Following alone must not enroll a student or grant private access. This is not a current feature.

## Release gate

School IT can own and recover the approved sources without a developer entering duplicate information; the school signs off on content, support ownership and rollout. School-governed private access, live alerts and payments are not established by this public preview. Production promotion or rollback is a separate approved action.
