# Public calendar dates

The app reads only the school's existing, published Activities Google Calendar public iCal export. No OAuth, API key, private calendar or student portal is accessed. School staff continue editing that calendar once; the adapter refreshes on a bounded cache and displays the last successful retrieval time. Existing Google embed and source link remain the fallback.

The native list is deliberately conservative: explicit all-grade early release, school closure, and the published grades 6–8 youth gathering. Grade eligibility is not participation or permission to attend. Unknown, class-specific and team-specific items remain in the full calendar rather than being assigned to a child. No dismissal time is invented for date-only early release. All-day end dates are exclusive; Thanksgiving November 23 through exclusive November 28 displays November 23–27.

Default My Students displays real public dates. Invented announcements are isolated behind an explicit Example notices view; their counts and student/team assignments are not mixed with public facts. No authenticated school announcement publishing, private records, guardian authorization or message delivery is implemented.

Verification references: official school calendar https://stjohnocala.org/calendar/ and middle-school page https://stjohnocala.org/academics/middle-school/ (grades 6, 7 and 8). Actual calendar UI and public ICS independently corroborated the priority November 2026 event titles/dates. A successful fetch is a retrieval-time claim, not confirmation that school staff have reviewed every entry or that events cannot change.
