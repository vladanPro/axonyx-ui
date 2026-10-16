# Axonyx UI 0.0.87 Candidate

Shared border-only focus for native ax-select controls, including standalone
appearance/theme pickers, form fields and forged surfaces. Foundry selects use
the same focus recipe as inputs; the base recipe no longer adds a focus halo.
Invalid states preserve their danger border. Keyboard focus stays visible through
the border, without changing control geometry or removing button focus indicators.

Form geometry/focus QA is now a required package CI step. It covers standalone
and field selects, default/forged surfaces, error states, all Foundry finishes and
palettes, three sizes and desktop/mobile viewports. Existing color-mode and package
checks remain mandatory. No HTML, component API, JS behavior or dependency changes.

The content-editor focus correction is a separate legura-editor Git package
change (PR16); this UI version does not publish that editor crate or adopt it in
Legura. Consumer updates must be explicit. Private rehearsal CSS previews are
temporary and must be removed when those package changes are adopted.

The candidate also includes progressive DataTable composition with search,
sorting and pagination, native examples and package assets. It does not add a
new React adapter API. Native sources use the shared compiler formatting rules;
source-format CI is separate from behavior tests. These source-only changes do
not change component semantics.

The release branch now includes the current dev baseline rather than only the
earlier focus patch. Both form-geometry and DataTable browser checks remain in
package CI alongside the color-mode checks.

Cargo and npm publication are independent. This file records a candidate,
not a claim that either registry already contains version 0.0.87. Consumers,
including the catalog's Git preview dependency, must be updated only after
the corresponding registry publication is verified.
