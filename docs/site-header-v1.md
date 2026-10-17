# Shared Site Header V1

Opt-in chrome shared by native Axonyx and React sites. The package owns the
geometry, brand dimensions, link/selected/focus appearance and responsive menu.
Applications own destinations, labels, appearance controls and route matching.

Use a `header.ax-site-header` with `.ax-site-header__inner`. Children are a brand
link (`__brand`, image `__logo`), optional button (`__toggle`, `aria-controls`
pointing to a unique nav id), `nav.__links` and `div.__appearance`.
Use the full `ax-site-header` prefix on each child class.

Selected links use `aria-current="page"` (native boolean `true` is also accepted).
External links must not become selected just because their pathname matches.
The selected surface preserves the main Axonyx site's tinted plate, rim and
bottom signal. Palettes and light/dark mode come from semantic Foundry tokens.

The native package runtime progressively enhances mobile disclosure, closes it
on navigation/Escape and restores trigger focus on Escape. Without JavaScript,
links remain visible and the inert toggle is hidden. React can own the same
state/attributes without loading the native DOM runtime or making pages client
components. Mark `data-ready="true"` on the toggle only after binding handlers.

Header width defaults to 1324px; `--ax-site-header-max` and
`--ax-site-header-link-radius` are explicit customization hooks. Keep the header
outside a constrained page container so it spans the viewport without overflow.
