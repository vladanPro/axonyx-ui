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

## Site synchronization

Run `axonyx-site-ui/scripts/sync-foundry-theme.ps1` after editing this file.
It copies the foundation to the site's public assets and versions the CSS/JS
references. This avoids requiring an unpublished sibling Cargo dependency on
the deployed site. Do not hand-edit the generated site copy.

After releasing the package, the site can use its packaged foundation directly
and remove the interim snapshot.
