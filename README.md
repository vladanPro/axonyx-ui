# Axonyx UI

Axonyx UI is the design-system layer for the Axonyx ecosystem.

Website: https://axonyx.dev

It is built on the **Foundry** design language: a system-oriented visual language for builders, with engineered surfaces, signal-driven states, and metal-inspired themes.

## Purpose

Axonyx UI defines the visual contract for Axonyx primitives so projects like `axonyx-site`, static HTML pages, and React adapters can import a stable, reusable UI layer instead of carrying page-specific styling.

```txt
axonyx-ui       = CSS tokens, themes, component styles, JS islands, .ax Foundry components
@axonyx/react   = React wrappers around the same shared CSS/data-attribute contract
axonyx-site     = Axonyx-native app routes that consume the Foundry components
```

## Install

### npm

```bash
npm install @axonyx/ui
```

Load the stylesheet once in your shell/layout:

```html
<link rel="stylesheet" href="/css/axonyx-ui/index.css" />
```

React apps usually import it once from the app root:

```tsx
import "@axonyx/ui/css/index.css";
```

### Cargo

`axonyx-ui` is also published as a Cargo asset crate for Axonyx-native tooling:

```toml
[dependencies]
axonyx-ui = "0.1.0"
```

The Cargo crate embeds the same Foundry assets that the npm package ships.

## Foundry

Foundry is the design language behind Axonyx UI.

Core ideas:

- engineered surfaces instead of floating paper
- signal-driven accent color instead of decorative color usage
- structured dark foundations for serious interfaces
- semantic primitives that map cleanly from `.ax`
- theme finishes inspired by metal: Bronze, Silver, and Gold
- industrial controls such as status lamps and machine-style switches, used sparingly where state matters

## Initial Scope

The stable primitive set is growing around:

- `Container`, `Grid`, `Section`, `Stack`, `Cluster`
- `Card`, `Copy`, `Button`, `ButtonGroup`, `Badge`, `Chip`, `Avatar`, `Divider`
- `Alert`, `StatusLamp`, `Stat`, `Progress`, `Skeleton`, `EmptyState`
- `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`
- `Breadcrumbs`, `Tabs`, `Accordion`, `Dropdown`, `Dialog`, `Tooltip`
- `CodeBlock`, `CommandList`, `PropsTable`, `Table`, `List`, `Pagination`
- `Icon`, `ThemeSwitcher`, `MachineSwitch`

The first themes are:

- `bronze`
- `silver`
- `gold`

## Theme Model

Themes do not change component structure.

They only change token values such as:

- background
- surface
- border
- text
- accent
- link
- panel treatment

Theme is applied at the document root:

```html
<html data-theme="silver">
```

Projects should load one global stylesheet in the shell or layout, not inside each page body.

## Rendering Contract

The first stable Foundry contract for `.ax` primitives is:

- `Container max: "xl"` -> `<div class="ax-container" data-max="xl">`
- `Grid cols: 2, gap: "lg"` -> `<div class="ax-grid" data-cols="2" data-gap="lg">`
- `Card title: "..."` -> `<article class="ax-card"><h2 class="ax-card__title">...</h2>...`
- `Copy tone: "lead"` -> `<p class="ax-copy" data-tone="lead">...</p>`
- `Copy -> "..."` -> `<p class="ax-copy">...</p>`

## CSS Files

`src/css/index.css` currently imports:

```text
src/css/
  tokens.css
  themes.css
  layout.css
  section.css
  card.css
  copy.css
  links.css
  stack.css
  nav.css
  button.css
  button-group.css
  badge.css
  chip.css
  avatar.css
  divider.css
  workspace.css
  cluster.css
  form.css
  field.css
  select.css
  theme-switcher.css
  choice.css
  radio.css
  breadcrumbs.css
  command.css
  code-block.css
  tabs.css
  accordion.css
  dropdown.css
  tooltip.css
  overlay.css
  component-preview.css
  props-table.css
  data.css
  alert.css
  dialog.css
  icons.css
  machine-switch.css
  status-lamp.css
  stat.css
  list.css
  pagination.css
  index.css
```

## MachineSwitch CSS contract

`MachineSwitch` is an industrial red/green control for feature flags, deploy state, maintenance mode, and runtime demos.

The CSS contract can be used directly by Axonyx-native or static HTML output:

```html
<button class="ax-machine-switch" data-state="on">
  <span class="ax-machine-switch__lamp" data-tone="danger"></span>
  <span class="ax-machine-switch__track">
    <span class="ax-machine-switch__knob"></span>
  </span>
  <span class="ax-machine-switch__lamp" data-tone="success"></span>
</button>
```

React users should use `MachineSwitch` from `@axonyx/react/client`.

## Foundry .ax Components

The package also exposes importable `.ax` components for Axonyx apps. Source files live in `src/foundry/` and are copied to `dist/foundry/` during `npm run build`, so published packages can be imported through the same public namespace:

```text
src/foundry/
  Container.ax
  Grid.ax
  Badge.ax
  Chip.ax
  Avatar.ax
  Divider.ax
  Field.ax
  Input.ax
  Textarea.ax
  Select.ax
  Option.ax
  Checkbox.ax
  Radio.ax
  Switch.ax
  Breadcrumbs.ax
  ButtonGroup.ax
  LinkButton.ax
  IconButton.ax
  Section.ax
  Cluster.ax
  AppShell.ax
  Table.ax
  List.ax
  ListItem.ax
  EmptyState.ax
  Skeleton.ax
  Progress.ax
  StatusLamp.ax
  Stat.ax
  Pagination.ax
  Tooltip.ax
  SiteShell.ax
  HeroCard.ax
  ContentGrid.ax
  Stack.ax
  SectionCard.ax
  Button.ax
  TextLink.ax
  FeatureSection.ax
  PageHeader.ax
  DocsSection.ax
  DocsCallout.ax
  DocsNav.ax
  DocsCodeBlock.ax
  CommandList.ax
```

Example import:

```ax
import { SectionCard } from "@axonyx/ui/foundry/SectionCard.ax"
```

Cargo consumers also get this namespace contract through `Axonyx.package.toml`.
Axonyx tooling reads that metadata to map `@axonyx/ui` to the packaged `src/` export root.

## Cargo Package

`axonyx-ui` is also shaped as a Cargo asset crate for Axonyx-native tooling. The crate embeds the same Foundry assets that the npm package ships:

- `css/*` for the global Foundry stylesheet contract
- `js/*` for optional progressive-enhancement helpers
- `foundry/*.ax` for Axonyx-native UI components

Build tools can read these through `css_assets()`, `js_assets()`, `foundry_assets()`, or `asset("foundry/Button.ax")` without requiring npm.

React to Axonyx adapter coverage lives in:

```text
docs/react-ax-adapter-map.md
```

Named slot example:

```ax
import { FeatureSection } from "@axonyx/ui/foundry/FeatureSection.ax"

<FeatureSection title="Build with slots">
  <Copy slot="eyebrow">Foundry</Copy>
  <Copy>Default body content still flows through the main slot.</Copy>
  <a slot="actions" href="/docs">Open docs</a>
</FeatureSection>
```

## Links

- npm: https://www.npmjs.com/package/@axonyx/ui
- crates.io: https://crates.io/crates/axonyx-ui
- GitHub: https://github.com/vladanPro/axonyx-ui
