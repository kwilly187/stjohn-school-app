# Official St. John visual assets

Reviewed 2026-11-01 for the parent-app whitespace/identity refinement, at the user's request to use the official website as inspiration.

- `public/stjohn-church.png`: original public church exterior, no people visible. Source: https://stjohnocala.org/wp-content/uploads/2025/01/da3f59a20633085fb01c1560ee04aa56.png . Displayed in the Church section of https://stjohnocala.org/about/our-campus/ . Downloaded unchanged; the responsive display uses object-fit, without retouching or invented additions.
- `public/stjohn-fleur-divider.png`: official gold fleur-de-lis divider. Source: https://stjohnocala.org/wp-content/uploads/2025/01/divider.png . Observed on the official homepage and campus page. Downloaded unchanged, rendered at a smaller proportional size.
- Existing `public/stjohn-logo.png` remains the official school crest; it has not been replaced by an invented logo.

Design inspiration: the official site's blue headings, gold fleur-de-lis and crest, plus real campus architecture. The parent app intentionally does not reproduce the promotional video hero, accreditation claims, or identifiable student photographs. White canvas and compact parent actions take priority.

## November 14 reference refinement
The owner supplied three mobile screenshots of the official website and one of the earlier app. The website screenshots show neutral sans-serif text, regular-weight royal-blue headings, open white sections, and a faint gold fleur-de-lis motif. The app reflects that hierarchy using locally licensed Inter, not an unverified claim of an exact school font match. The earlier geometric Josefin app styling is intentionally not restored. Allura remains restricted to the Daily Scripture title. No promotional statistics or identifiable student photos were added.

## Saints Store merchandise concepts
- `public/store/saints-editorial.webp` and `saints-collection.webp`: original AI-generated concept mockups using the existing authentic St. John crest as a visual reference, created November 14, 2026. Not actual product photographs, inventory, approved uniforms or school-approved designs. Rendered interface clearly identifies concepts; navy/natural images are not claimed to match alternative selected colors.
- Product images use CSS viewport positions on the original six-panel image. No student likenesses or third-party merchandise photos.
- `public/store/senior-athlete.webp`: original generated navy senior-athlete crewneck front/back concept, authentic crest reference on front, cream/gold collegiate lettering on back. No year, named athlete, real edition quantity or availability claim. November 14, 2026.

### Store palette correction
Dominant opaque colors sampled from the school's original `stjohn-logo.png` are blue **#2a3695** (239,929 pixels) and gold **#edbc0d** (69,849 pixels). These are verified asset colors, not a claimed published brand manual. November 14: core store mockups were regenerated in royal blue/gold, replacing navy/natural concepts. All displayed merchandise now has only the pictured Royal variant. Senior-athlete artwork was removed from the active store following clarification that the senior item is a design contest open to all seniors, with winning design undecided.
- `public/store/senior-design-example.webp`: original example senior class contest-winning design mockup, November 14, 2026. All-seniors concept, royal blue/gold with school crest and fleur-de-lis. Hypothetical example only, not a selected winner, actual student work, approved product or active contest entry.

## Restrained campus detail photographs — November 14
Two additional authentic photographs were retrieved from the school's public Our Campus page https://stjohnocala.org/about/our-campus/ and visually checked: neither depicts people. These are existing campus illustrations, not claims of current event coverage or newly photographed conditions. No faces or student records are republished. Original imagery is only WebP-encoded, not generated or retouched.
- `public/campus/gym.webp`: empty Saints gymnasium, official Gymnasium section. Source https://stjohnocala.org/wp-content/uploads/2025/01/988b2bf84a3599d0030bb447273a9985.png . Used beside the athletics calendar destination.
- `public/campus/library.webp`: empty library reading/book area, official Library section. Source https://stjohnocala.org/wp-content/uploads/2025/01/84c092d63131ccc27064768b96db206c.png . Used beside the school-published Follett library catalog destination.
The courtyard photograph was reviewed but not added, to avoid excessive imagery. The existing church background remains discreet. Public availability is not represented as a transferable ownership license or school endorsement.

### Visible parent-home campus photographs
The Saints gym and school library photographs now also identify their corresponding Home destinations, so parents encounter real school imagery without having to visit secondary pages. A third photo, `public/campus/courtyard.webp`, shows the empty Middle School Courtyard in the community section. Source https://stjohnocala.org/wp-content/uploads/2025/01/8157e77d26fc8170334ce1b8ac23a91b.png (official Our Campus page). Visually reviewed November 14: no people. Only WebP encoding and responsive display cropping; no generated scenery or identity claims. Existing church background remains unchanged. No event/student photographs were used without established photo permission.

### Link-sharing and installation identity
`public/brand/saints-parent-share.png` is a 1200×630 original branded layout using the exact existing school crest, royal blue, gold, and readable parent-app title. Apple touch icon180×180, standard app icons192×192/512×512, and favicon32×32 reuse that same unmodified crest on an opaque white canvas. Reproducible vector layout in `scripts/build-brand-assets.cjs`, rasterized via Sharp; the crest is not AI-generated. Assets visually inspected at full size and180px. Apple/iMessage cache and actual home-screen appearance require device verification, not implied by asset generation.
- Share-card refinement: owner requested the school logo centered, not a photograph or side-by-side title. The1200×630 card now contains only the exact crest centered on white, with no additional caption. App icon assets unchanged.
- Final owner-directed share treatment: centered original crest on an intentional royal-blue field with restrained gold framing; no added slogan or small text. The white-block version was superseded. Visually inspected as rendered1200×630 PNG; native message preview may cache older artwork.
