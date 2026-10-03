# Foundry native component coverage

Generate this inventory with `node scripts/audit-component-coverage.mjs --write` from `axonyx-ui`.
Set `AXONYX_SITE_UI` and `AXONYX_REACT` when the sibling repositories live elsewhere.

This is a **source inventory**, not a completion certificate. A catalog import proves only that
a page references a component; a React export proves only that a named adapter is exported.
Neither proves correct behavior, accessibility, responsive layout, or native/React parity.
`?` means no component-specific browser QA evidence has been recorded in this inventory.

- Native Foundry source files: 126
- Registry component entries: 25; other files may be subcomponents or unregistered primitives
- Catalog source imports: 117 native components
- No direct catalog source import: 9 (DocsNav, DocsSection, DropdownLabel, DropdownSeparator, FeatureSection, HeroCard, PaginationEllipsis, Spacer, TableCaption)
- Registry previews with a direct component import: 25/25
- Named React exports: 83 native component names
- Blocks: 5 source files, 5 registry entries
- Catalog Aegis checks: 77 fast HTTP, 0 browser

| Native component | Registry | Catalog source import | React export | Interaction QA | Keyboard QA | Mobile QA |
| --- | --- | --- | --- | --- | --- | --- |
| Accordion | - | `/components/accordion` | client | ? | ? | ? |
| AccordionItem | - | `/components/accordion` | client | ? | ? | ? |
| Alert | - | `/components/alert` | server | ? | ? | ? |
| AlertDialog | yes | `/components/alert-dialog` | client | ? | ? | ? |
| AppShell | yes | `/components/app-shell` (+1) | server | ? | ? | ? |
| Avatar | - | `/components/avatar` | server | ? | ? | ? |
| Badge | - | `/components` (+37) | server | ? | ? | ? |
| Bleed | yes | `/components/bleed` (+1) | server | ? | ? | ? |
| Box | yes | `/components/box` (+4) | server | ? | ? | ? |
| BreadcrumbCurrent | - | `/components/breadcrumbs` | - | ? | ? | ? |
| BreadcrumbItem | - | `/components/breadcrumbs` | - | ? | ? | ? |
| Breadcrumbs | - | `/components/breadcrumbs` | server | ? | ? | ? |
| Button | yes | `/components/button` (+58) | server | ? | ? | ? |
| ButtonGroup | - | `/components/button-group` (+3) | server | ? | ? | ? |
| Card | yes | `/components/card` (+67) | server | ? | ? | ? |
| Center | yes | `/components/center` (+1) | server | ? | ? | ? |
| Checkbox | - | `/components/checkbox` (+1) | server | ? | ? | ? |
| Chip | - | `/components/chip` | server | ? | ? | ? |
| Cluster | yes | `/components/cluster` (+1) | server | ? | ? | ? |
| CodeBlock | - | `/components/code-block` | server | ? | ? | ? |
| Combobox | yes | `/components/combobox` | server | ? | ? | ? |
| ComboboxOption | - | `/components/combobox` | server | ? | ? | ? |
| Command | - | `/components/command` | server | ? | ? | ? |
| CommandList | - | `/components/command` | server | ? | ? | ? |
| ComponentExample | - | `/components/app-shell` (+2) | - | ? | ? | ? |
| ComponentInstall | - | `/components/app-shell` (+2) | - | ? | ? | ? |
| ComponentPage | - | `/components` (+74) | - | ? | ? | ? |
| ComponentPreview | - | `/components/component-page` (+1) | - | ? | ? | ? |
| Container | yes | `/components/container` | server | ? | ? | ? |
| ContentGrid | - | `/components` (+52) | - | ? | ? | ? |
| Copy | - | `/components` (+72) | - | ? | ? | ? |
| Dialog | - | `/components/dialog` | client | ? | ? | ? |
| Divider | - | `/components/layout` | server | ? | ? | ? |
| DocsCallout | - | `/components/docs-callout` | - | ? | ? | ? |
| DocsCodeBlock | - | `/components/accordion` (+73) | - | ? | ? | ? |
| DocsNav | - | - | - | ? | ? | ? |
| DocsSection | - | - | - | ? | ? | ? |
| Drawer | - | `/components/drawer` | client | ? | ? | ? |
| DropdownItem | - | `/components/dropdown-menu` | client | ? | ? | ? |
| DropdownLabel | - | - | client | ? | ? | ? |
| DropdownMenu | - | `/components/dropdown-menu` | client | ? | ? | ? |
| DropdownSeparator | - | - | client | ? | ? | ? |
| EmptyState | - | `/components/empty-state` | server | ? | ? | ? |
| FeatureSection | - | - | - | ? | ? | ? |
| Field | yes | `/components/field` (+5) | server | ? | ? | ? |
| FieldError | - | `/components/field` | - | ? | ? | ? |
| FieldHint | - | `/components/field` (+5) | - | ? | ? | ? |
| FieldLabel | - | `/components/field` (+5) | - | ? | ? | ? |
| Fieldset | - | `/components/forms` (+1) | - | ? | ? | ? |
| Flex | yes | `/components/flex` (+1) | server | ? | ? | ? |
| Footer | - | `/components/site-shell` | server | ? | ? | ? |
| Form | - | `/components/forms` | server | ? | ? | ? |
| FormGroup | - | `/components/forms` | - | ? | ? | ? |
| Grid | yes | `/components/grid` (+5) | server | ? | ? | ? |
| Header | - | `/components/site-shell` | - | ? | ? | ? |
| HeroCard | - | - | - | ? | ? | ? |
| IconButton | - | `/components/icon-button` | server | ? | ? | ? |
| Input | - | `/components/field` (+3) | server | ? | ? | ? |
| InputAddon | yes | `/components/input-group` | server | ? | ? | ? |
| InputGroup | yes | `/components/input-group` | server | ? | ? | ? |
| Inset | yes | `/components/inset` (+1) | server | ? | ? | ? |
| Legend | - | `/components/forms` (+1) | - | ? | ? | ? |
| LinkButton | - | `/components/link-button` | server | ? | ? | ? |
| List | - | `/components/list` | server | ? | ? | ? |
| ListItem | - | `/components/list` | server | ? | ? | ? |
| MachineSwitch | - | `/components/machine-switch` | client | ? | ? | ? |
| Main | - | `/components/site-shell` | server | ? | ? | ? |
| Menu | - | `/components/menu` | - | ? | ? | ? |
| MenuItem | - | `/components/menu` | - | ? | ? | ? |
| Modal | - | `/components/modal` | - | ? | ? | ? |
| Navbar | - | `/components/navbar` | server | ? | ? | ? |
| NavigationMenu | yes | `/components/navigation-menu` | server | ? | ? | ? |
| NavigationMenuLink | - | `/components/navigation-menu` | server | ? | ? | ? |
| NavigationMenuList | - | `/components/navigation-menu` | server | ? | ? | ? |
| Option | - | `/components/forms` (+1) | server | ? | ? | ? |
| PageHeader | - | `/components/page-header` | server | ? | ? | ? |
| Pagination | - | `/components/pagination` | server | ? | ? | ? |
| PaginationEllipsis | - | - | - | ? | ? | ? |
| PaginationItem | - | `/components/pagination` | - | ? | ? | ? |
| Popover | - | `/components/popover` | client | ? | ? | ? |
| Progress | - | `/components/progress` | server | ? | ? | ? |
| PropRow | - | `/components/props-table` | - | ? | ? | ? |
| PropsTable | - | `/components/props-table` | server | ? | ? | ? |
| Radio | - | `/components/radio` | server | ? | ? | ? |
| Rating | - | `/components/rating` | - | ? | ? | ? |
| ScrollArea | yes | `/components/scroll-area` | server | ? | ? | ? |
| Section | yes | `/components/section` (+1) | server | ? | ? | ? |
| SectionCard | - | `/components` | - | ? | ? | ? |
| Select | - | `/components/forms` (+1) | server | ? | ? | ? |
| Sidebar | yes | `/components/sidebar` (+1) | server | ? | ? | ? |
| SidebarFooter | - | `/components/sidebar` | - | ? | ? | ? |
| SidebarHeader | - | `/components/app-shell` (+1) | - | ? | ? | ? |
| SidebarItem | - | `/components/app-shell` (+1) | server | ? | ? | ? |
| SidebarSection | - | `/components/app-shell` (+1) | server | ? | ? | ? |
| SiteShell | - | `/components/site-shell` | - | ? | ? | ? |
| Skeleton | - | `/components/skeleton` | server | ? | ? | ? |
| Slider | - | `/components/slider` | - | ? | ? | ? |
| Spacer | - | - | - | ? | ? | ? |
| Spinner | yes | `/components/spinner` | server | ? | ? | ? |
| Stack | yes | `/components/stack` (+67) | server | ? | ? | ? |
| Stat | - | `/components/stat` | server | ? | ? | ? |
| StatusLamp | - | `/components/status-lamp` | server | ? | ? | ? |
| Step | - | `/components/stepper` (+1) | - | ? | ? | ? |
| Stepper | - | `/components/stepper` (+1) | - | ? | ? | ? |
| Surface | yes | `/components/surface` (+4) | server | ? | ? | ? |
| Switch | - | `/components/forms` (+1) | server | ? | ? | ? |
| Tab | - | `/components/tabs` | - | ? | ? | ? |
| Table | - | `/components/table` | server | ? | ? | ? |
| TableBody | - | `/components/table` | server | ? | ? | ? |
| TableCaption | - | - | - | ? | ? | ? |
| TableCell | - | `/components/table` | server | ? | ? | ? |
| TableHead | - | `/components/table` | server | ? | ? | ? |
| TableHeaderCell | - | `/components/table` | - | ? | ? | ? |
| TableRow | - | `/components/table` | server | ? | ? | ? |
| Tabs | - | `/components/tabs` | client | ? | ? | ? |
| Textarea | - | `/components/forms` (+1) | server | ? | ? | ? |
| TextLink | - | `/components/navbar` (+1) | - | ? | ? | ? |
| ThemeSwitcher | - | `/components/theme-switcher` | client | ? | ? | ? |
| Timeline | - | `/components/timeline` | - | ? | ? | ? |
| TimelineItem | - | `/components/timeline` | - | ? | ? | ? |
| Toast | - | `/components/toast` | client | ? | ? | ? |
| ToastViewport | - | `/components/toast` | - | ? | ? | ? |
| Toggle | yes | `/components/toggle` | server | ? | ? | ? |
| ToggleGroup | yes | `/components/toggle` | server | ? | ? | ? |
| Toolbar | - | `/components/icon-button` (+1) | server | ? | ? | ? |
| Tooltip | - | `/components/tooltip` | server | ? | ? | ? |

## Next audit pass

Prioritize forms and overlays used in the CMS path. For each public control, record actual
mouse/touch, keyboard, focus, open/close, disabled/error, and mobile results before changing
its QA columns from `?`. Add browser checks to the catalog; fast HTTP checks only prove
that routes respond and expected text is present.
