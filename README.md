# Axonyx UI

Axonyx UI is the design-system layer for the Axonyx ecosystem.

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

The first stable primitives are:

- `Container`
- `Grid`
- `Card`
- `Copy`

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
  index.css
```

## Foundry .ax Components

The repo can also expose package-importable `.ax` components for Axonyx apps:

```text
src/ax/foundry/
  SiteShell.ax
  HeroCard.ax
  ContentGrid.ax
  SectionCard.ax
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

Named slot example:

```ax
import { FeatureSection } from "@axonyx/ui/foundry/FeatureSection.ax"

<FeatureSection title="Build with slots">
  <Copy slot="eyebrow">Foundry</Copy>
  <Copy>Default body content still flows through the main slot.</Copy>
  <a slot="actions" href="/docs">Open docs</a>
</FeatureSection>
```
