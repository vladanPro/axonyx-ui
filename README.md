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