# Family-centered parent experience

Home remains parent-only, with school identity, quick search, family notices, actual public dates, parent actions and optional reference content.

## Notice contract
The currently deployed school announcement source is not connected; Home provides an Alma action, never an invented zero-task state. Synthetic examples exist only in tests, not the portal.

A connected public school feed can distinguish:
- Needs attention: explicitly required action plus a recognized action identifier.
- Family updates: schoolwide or exact grade/group audience.
- Optional involvement: fundraising, giving and volunteering never promoted into obligations.

Schoolwide notices appear once with relevant children; grade notices match grades. Class, team and club membership requires explicit authorized group IDs, never guessed from a grade. Private student content must enter through the authorized student service, not the public announcement configuration.

Dates are supplied, not inferred. Date-only deadlines stay date-only; timestamp deadlines show school Eastern time. Invalid dates are omitted. Required actions sort by deadline. Each section shows three items initially and expands to all remaining items, preserving information without flooding Home.

Clicking an action does NOT mark anything complete. Completion must come from the authoritative provider, with guardian authorization. No parallel teacher composer, duplicate staff entry, or unsupported checkout/signature flow was added.

## Current limitations
Live guardian/child mapping, private school updates and provider completion callbacks still need school-approved integration. Public calendars remain real; personalized team/class schedules cannot be claimed until those memberships are available.
