# School announcements

Home renders important school-wide announcements; My Students renders grade notices matching selected configured grades. The current feed is explicitly not connected and contains no notices. The public preview directs parents to their school account rather than claiming that there are no announcements.

`announcements-data.mjs` is an approved-public-content adapter boundary. Only published, public notices are eligible. Future publication dates, expired notices and malformed dates are excluded. Schoolwide notices require the important flag. Grade selection is presentation filtering, not authorization. No private records or children’s information may be added to this public configuration.

A real school feed needs school/provider approval and authenticated guardian scope for private messages. Private announcements must come from a separately authorized server adapter; do not expose them through this public feed or static profile configuration. There is no staff editor, message ingestion, push notification system or automatic Alma sync implemented by this change.

Tests use synthetic notices only; none ship in the feed.
