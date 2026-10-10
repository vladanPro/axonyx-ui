# Foundry Customization V1

This pilot covers Button, Card, and Field/Input/Select/Textarea. It is not a promise that every
component supports every CSS property through a token. Package styles never
require !important for these tokens.

## Three layers

1. Palette/style and semantic tokens establish the visual identity.
2. Component tokens set dimensions without replacing markup or behavior.
3. A custom class or inline style handles a particular instance.

## Light and dark mode

Available in Axonyx UI 0.0.85. This release verifies the dashboard/form/overlay
pilot, not every specialized industrial component or browser engine.

Palette, finish and color mode are independent. The package stylesheet includes
the mode recipes; no extra JavaScript or duplicate components are needed:

```html
<div data-foundry="silver" data-foundry-style="classic" data-foundry-mode="light">
  <!-- Existing Axonyx UI components -->
</div>
```

Use `light` or `dark` with Bronze/Silver/Gold and Classic/Alloy/Forge.
Omitting mode preserves the existing dark appearance. Each nested Foundry
boundary resets to dark unless it explicitly opts into light; set all three
attributes on independent previews. Mode belongs on the same element as
`data-foundry`, not on an arbitrary ancestor. This does not yet add a persistent
mode picker or OS preference detection to the Theme component.

The standalone `src/showroom/light-dashboard.html` previews a Legura workspace
with ordinary cards, a table, fields and buttons. It is a visual pilot, not a
live CMS or a completed all-component light-mode accessibility audit.
Run `npm run test:modes` for the browser matrix and contrast checks.

The matrix also verifies menu keyboard navigation, popover bounds on resize,
tooltip focus, dialog/drawer dismissal and focus restoration, toast dismissal,
native checkbox/radio/switch/range interactions, and disabled controls. These
tests use package behavior with representative component HTML in Chromium;
they do not replace compiled application acceptance or cross-browser QA.

Load application CSS after the package stylesheet. For a nested Foundry boundary,
put overrides on that boundary, not its parent: palette/style tokens reset there.
Component geometry tokens inherit normally; reset them explicitly when needed.

```asx
<Card className="account-card" style="--ax-card-padding: 32px" title="Account">
  <Field style="--ax-field-gap: 10px; --ax-input-radius: 6px">
    <FieldLabel htmlFor="account-name">Name</FieldLabel>
    <Input id="account-name" name="name" />
  </Field>
  <Button className="save-button" style="--ax-button-min-height: 44px">Save</Button>
</Card>
```

The new core lowering appends class/className to existing classes on the first
rendered root element. Inline style declarations append to existing root styles,
so later declarations win. Do not pass class and className together. A fragment
is not a group-wide styling target: use a real wrapper when styling multiple roots.
No attributes go into children implicitly; tokens reach children by CSS inheritance.
This requires axonyx-core 0.6.2 and cargo-axonyx 0.6.4 or newer, alongside
axonyx-ui 0.0.81; merely updating the UI package is not sufficient.

## Pilot tokens

| Component | Tokens | Purpose |
| --- | --- | --- |
| Button | --ax-button-min-height, --ax-button-padding, --ax-button-radius, --ax-button-font-size | Minimum height, CSS padding, corners, typography |
| Card | --ax-card-padding, --ax-card-gap, --ax-card-radius | Root spacing and corners |
| Field | --ax-field-gap, --ax-field-label-font-size | Label/control rhythm and label typography |
| Input | --ax-input-min-height, --ax-input-padding, --ax-input-radius | Shared control geometry; field-level tokens inherit |
| Select | --ax-select-min-height, --ax-select-padding, --ax-select-radius | Select-specific geometry, falling back to shared input tokens |
| Textarea | --ax-textarea-min-height, --ax-textarea-padding, --ax-textarea-radius, --ax-textarea-resize | Multiline geometry and resize behavior, falling back to shared input tokens |

Select/Textarea-specific tokens require UI 0.0.82. They work with and without a
Foundry boundary, for sm/md/lg controls. Existing defaults stay unchanged when
no override is supplied. Shared input tokens still provide a form-wide baseline;
specific tokens win without changing neighboring inputs. For Select padding,
reserve room on the right for the arrow. Textarea minimum height is not fixed
height: rows, text metrics, padding, and user resizing can make it larger.

```css
.account-field {
  --ax-input-min-height: 44px;
  --ax-input-radius: 6px;
  --ax-select-padding: 0 36px 0 12px;
  --ax-textarea-min-height: 140px;
  --ax-textarea-padding: 12px;
  --ax-textarea-radius: 10px;
  --ax-textarea-resize: vertical;
}
```

Size recipes
and specialized surfaces still own their remaining details. Card recipes such as
page-header intentionally reset their layout; this pilot documents ordinary Card.

```css
.account-card {
  --ax-card-padding: 32px;
  --ax-card-gap: 20px;
  --ax-card-radius: 12px;
  --ax-field-gap: 10px;
  --ax-input-min-height: 44px;
  --ax-input-padding: 0 12px;
  --ax-input-radius: 6px;
}
.save-button {
  --ax-button-min-height: 44px;
  --ax-button-padding: 0 20px;
  --ax-button-radius: 6px;
  --ax-button-font-size: 14px;
}
```

For pixel-accurate Figma work, load the actual font and weights, match line-height
and box sizing, and check text wrapping, focus, error, disabled and mobile states.
A matching rectangle is not enough if keyboard access or contrast regresses.
Avoid selecting anonymous child positions; use the documented semantic classes
such as .ax-card__title, .ax-field__label and .ax-field__hint when a token is absent.
