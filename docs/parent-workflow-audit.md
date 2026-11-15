# Parent portal workflow review — November 14, 2026

Scope: parent-only. This is a public preview, not a connected private school account.

## Page coverage
- Home: school identity, current public dates, school-account announcement fallback, parent shortcuts and scripture. No invented notices.
- My Students: profile selection only for configured profiles; Alma action; announcement categories; public dates. Private grades, assignments and guardian mapping remain unconnected.
- Calendar: school/athletics sources, agenda/month, event detail, browser history, search, individual and multi-event export. Exports are saved copies; public feed subscription is separate. No private student feed.
- Parent actions: category and text search, empty-state recovery, verified provider destinations. Athletics action now reaches paperwork directly.
- Staff: name/role/department search, pagination, local saved contacts, email action. Saved contacts do not sync between devices.
- Messages / Notifications: honest disconnected states and real account/contact actions. No fake inbox, unread count, delivery, or push.
- Resources / FAQ: categorized links and search; official school answers, not invented dismissal or attendance policy.
- Lunch: official Nutrislice menu, PaySchools and food-service contact; no unverified balance/allergy assurances.
- Athletics: programs and official forms, athletic director contact, calendar. Native expandable sections remain accessible.
- Dress code: school-sourced information and existing uniform provider links.
- Pickup: phone-first time-sensitive changes; no fake arrival or dismissal submission.
- Contact/help: real school contacts; email opens the user's mail client, not an in-app sent message.
- Historical review route redirects to parent Home; error/not-found routes provide recovery.

## Improvements in this pass
Searchable parent actions with combined category filters and explicit empty-state recovery. Direct athletics paperwork anchor. Visual consistency pass for My Students, Lunch, Athletics and Dress Code by design agent.

## Remaining integration requirements
School-authorized identity/guardian scope, private SIS and communication data, forms/signature provider and completion callbacks, registration/payment provider confirmations. Do not display an item as completed because a parent clicked an external action. School services remain authoritative.

## Verification boundary
Automated tests cover source contracts, parsing and synthetic policies; production build validates compilation. Hosted browser checks cover selected real navigation and filters, not every external authenticated provider transaction. No payments, registrations, signatures or messages were submitted.

## Second pass
Hosted route checks confirmed every public page renders and historical review redirects to Home. Browser interface does not expose mobile viewport emulation; responsive CSS is reviewed, not device-certified.

Added unified parent search across real public staff, FAQ answers, resource links and action destinations. Searches stay in the page rather than being sent to an AI or third-party search service. No private student data is indexed. Search result links preserve original school-provider destinations. Resources and Home expose search.

Fixed Resources navigation context for Parent actions/Search, and reset calendar transfer feedback when the source or event selection changes so a prior copy/download success does not describe a different calendar.
