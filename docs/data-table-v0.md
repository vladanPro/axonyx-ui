# DataTable V0

An optional client-side composition around the existing semantic `Table`.
No TanStack, React, Node application runtime, or new dependency is required.
`use "@axonyx/ui"` loads the package stylesheet and behavior in Axonyx.

See `examples/data-table/page.asx` for a runnable page. Import `DataTable` from
`@axonyx/ui/foundry/DataTable`, then compose normal Table primitives inside it.
Add a caption to describe the table and `sort="text"` to plain-text header cells
that should offer ascending/descending, locale-aware natural-text sorting.
Rich headers containing controls are intentionally left unchanged.

## Contract

- `label`: accessible region name, default `Records`.
- `pageSize`: positive integer, default/fallback `10`.
- `searchLabel`: visible and accessible search label, default `Search records`.
- `emptyLabel`: no-match message, default `No matching records.`.
- Default slot: exactly one Table, one TableHead row and one TableBody; no nested tables or spanning cells.
- Search matches cell text, case-insensitively, across the loaded records.
- Filtering and sorting reset to the first page. Sorting moves the existing row
  elements, preserving row actions, input values and registered listeners.
- Keyboard-operable sort buttons expose `aria-sort` on their header cell;
  the live result count reports pagination and empty results. Native disabled
  pagination buttons prevent out-of-range navigation.
- Without JavaScript the controls remain hidden and all server-rendered rows
  remain readable. The table scrolls horizontally inside its existing wrapper.

## Boundaries

This is not a virtualized grid or a remote database query engine. It must receive
the complete bounded dataset: do not wrap one server-paginated page and imply
that search covers the whole database. For large datasets keep search, ordering
and pagination in the loader/URL on the server, using the base Table primitives.
Do not put confidential data in hidden rows: pagination does not protect data.

V0 does not provide selection, bulk actions, editable cells, typed date/number
comparators, column visibility or automatic rebinding after dynamic replacement.
React integration is a separate adapter task; this change does not add a React
export. Advanced grid and charts can later be independent installable products.

## Verification

`npm run test:data-table` tests package-owned runtime behavior at desktop/mobile
sizes and with JS disabled. Set `AXONYX_UI_DATA_TABLE_HTML` to a compiled example
HTML path to run the same checks against native Axonyx output instead of the
isolated HTML behavior fixture. Cargo tests verify embedded assets.
