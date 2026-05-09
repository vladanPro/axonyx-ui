# Axonyx UI

Axonyx UI is the design-system layer for the Axonyx ecosystem.

Website: https://axonyx.dev

It is built on the **Foundry** design language: a system-oriented visual language for builders, with engineered surfaces, signal-driven states, and metal-inspired themes.

## Purpose

Axonyx UI defines the visual contract for Axonyx primitives so projects like `axonyx-site` can import a stable, reusable UI layer instead of carrying page-specific styling.

## Foundry

Foundry is the design language behind Axonyx UI.

Core ideas:

- engineered surfaces instead of floating paper
- signal-driven accent color instead of decorative color usage
- structured dark foundations for serious interfaces
- semantic primitives that map cleanly from `.ax`
- theme finishes inspired by metal: Bronze, Silver, and Gold

## Initial Scope

The stable primitive set is growing around:

- `Container`
- `Grid`
- `Card`
- `Copy`
- `Button`
- `Badge`
- `Alert`
- `Field`, `Input`, `Textarea`, `Select`
- `Checkbox`, `Radio`, `Switch`
- `Breadcrumbs`
- `ButtonGroup`
- `Tabs`
- `Accordion`
- `Dropdown`
- `Dialog`
- `Tooltip`
- `CodeBlock`
- `PropsTable`
- `Icon`

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

Projects should load one global stylesheet in the shell or layout, not inside each page body:

```html
<link rel="stylesheet" href="/css/axonyx-ui/index.css" />
```

## Rendering Contract

The first stable Foundry contract for `.ax` primitives is:

- `Container max: "xl"` -> `<div class="ax-container" data-max="xl">`
- `Grid cols: 2, gap: "lg"` -> `<div class="ax-grid" data-cols="2" data-gap="lg">`
- `Card title: "..."` -> `<article class="ax-card"><h2 class="ax-card__title">...</h2>...`
- `Copy tone: "lead"` -> `<p class="ax-copy" data-tone="lead">...</p>`
- `Copy -> "..."` -> `<p class="ax-copy">...</p>`

## CSS Files

```text
src/css/
  tokens.css
  themes.css
  layout.css
  card.css
  copy.css
  links.css
  button.css
  button-group.css
  breadcrumbs.css
  radio.css
  icons.css
  index.css
```

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
Axonyx tooling reads that metadata to map `@axonyx/ui` to the packaged `src/`
export root.

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
