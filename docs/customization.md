# Foundry Customization V1

This pilot covers Button, Card, and Field/Input. It is not a promise that every
component supports every CSS property through a token. Package styles never
require !important for these tokens.

## Three layers

1. Palette/style and semantic tokens establish the visual identity.
2. Component tokens set dimensions without replacing markup or behavior.
3. A custom class or inline style handles a particular instance.

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
| Input/Textarea | --ax-input-min-height, --ax-input-padding, --ax-input-radius | Control geometry; field-level tokens inherit |

The Foundry input recipe shares these geometry tokens with Select. Size recipes
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
