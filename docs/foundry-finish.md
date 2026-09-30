# Foundry finish

`src/css/foundry.css` is the shared source for the refined Bronze, Silver and
Gold finish. It skins the existing native and React-compatible class contracts;
it does not replace their markup, slots, events or application state.

The package index includes it, but styles only activate inside a
`data-foundry` container. Existing applications without that attribute retain
their current appearance. The npm subpath `@axonyx/ui/css/foundry.css` also
exports the foundation separately for consumers that need explicit ordering.

```asx
use "@axonyx/ui"
import { Button } from "@axonyx/ui/foundry/Button.asx"
import { Card } from "@axonyx/ui/foundry/Card.asx"

page Home() {
  return ASX {
    <div data-foundry="bronze">
      <Card title="Ready to ship">
        <Button variant="primary">Save changes</Button>
      </Card>
    </div>
  }
}
```

When loading the foundation separately, load it after the base UI styles.
The site pilot serves a generated copy of this exact source.
Changing to `silver` or `gold` changes the finish. Nested containers each own
their tokens, which allows all three finishes to appear on the same page.

## Customize

Load application CSS after the foundation. Use a brand class for a scoped
override with higher specificity than the preset:

```css
[data-foundry].my-brand {
  --ax-primary: #6e99e8;
  --ax-on-primary: #000000;
  --ax-radius-md: 12px;
  --ax-radius-lg: 14px;
  --ax-font-sans: 'Your Font', sans-serif;
}
```

Set `class="my-brand"` on the same container. Choose `--ax-on-primary` to
contrast with the accent. The homepage editor calculates black/white foreground
contrast automatically and exports the foundation with explicit overrides.
Always check text, border and focus contrast when replacing other tokens.

For a component recipe, target its class inside your brand scope, for example
`[data-foundry].my-brand .ax-card { padding: 32px; }`. Replace a component only
when its markup or behavior needs to change.

## Coverage

The initial recipe pass covers Button (primary, secondary, ghost, danger and
sizes), Card, Field labels/hints, Input, Select, Textarea, Switch, Checkbox and
Badge. Invalid fields, disabled controls, keyboard focus and reduced motion
are included. Existing behavior code continues to own interaction.

Complex overlay, navigation and data components inherit tokens but have not
received a complete individual visual/state audit in this pilot.

## Style and palette

Version 0.0.73 adds an independent style axis. Existing `data-foundry` containers
keep the Alloy appearance by default. Choose both on the same container:

```html
<div data-foundry="bronze" data-foundry-style="forge">
  <!-- Existing Foundry components -->
</div>
```

- **Alloy**: restrained borders, rounded corners, subtle surface depth (default).
- **Forge**: angular corners, stronger material borders, beveled buttons and inset fields.
- **Classic**: original Axonyx UI palette values, large corners and rich card surfaces, using the original base component recipes. Site layout stays the same.
- **Palette**: `bronze`, `silver`, or `gold`, independently of style.

Each nested `data-foundry` container resets to Alloy unless it explicitly selects
Forge or Classic. Styles never change component markup, events, slots, or behavior.
Load brand overrides after the foundation, using `[data-foundry].my-brand` as before.
Style tokens include `--ax-radius-md`, `--ax-radius-lg`, `--ax-card-shadow`,
`--ax-button-shadow`, `--ax-button-finish`, `--ax-input-shadow`,
`--ax-input-finish`, `--ax-badge-radius`, and `--ax-control-weight`.
The catalog's header selection persists locally; applications can choose their own
controls and persistence. This CSS API does not add a framework configuration key.

The foundation uses CSS `@scope` to isolate nested containers (Baseline 2025 browsers).
Use the complete package `css/index.css`, or load `css/foundry.css` after base UI CSS.
No catalog stylesheet or JavaScript is needed to render a selected style.

The foundation also styles PageHeader/HeroCard, code blocks, component previews,
and `.ax-appearance` controls, so documentation sites share the same finish.
