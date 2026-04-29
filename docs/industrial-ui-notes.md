# Axonyx Industrial UI Notes

Working direction for strengthening the Axonyx industrial / foundry product look without turning the system into steampunk or game UI.

Axonyx should feel like:

- industrial product UI
- forged metal surfaces
- developer tooling
- dashboards and docs
- precise, engineered, readable

Avoid:

- heavy skeuomorphism
- noisy textures
- fantasy / steampunk visuals
- game HUD overload

## 1. Rivet / forged details

Restore and formalize the signature rivet button.

Example API:

```tsx
<Button border="forged" surface="forged">
  Deploy
</Button>
```

Expected visual:

- reinforced border
- small rivet dots left and right
- slightly heavier surface
- still readable and product-safe

Potential extension:

```tsx
<Card border="forged" />
<Badge border="forged" />
<CodeBlock border="forged" />
```

Suggested CSS direction:

```css
.ax-button[data-border='forged'] {
  position: relative;
  padding-inline: 1.15rem;
  border-color: var(--ax-border-strong);
}

.ax-button[data-border='forged']::before,
.ax-button[data-border='forged']::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.42;
  transform: translateY(-50%);
}

.ax-button[data-border='forged']::before {
  left: 0.45rem;
}

.ax-button[data-border='forged']::after {
  right: 0.45rem;
}
```

## 2. Industrial separators / cut lines

Create a reusable cut line utility for section breaks.

```css
.ax-cutline {
  position: relative;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--ax-border-strong),
    transparent
  );
}

.ax-cutline::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: var(--ax-primary);
  transform: translate(-50%, -50%);
  opacity: 0.65;
}
```

Use for docs sections, landing sections, and component examples.

## 3. Plate headers

Cards can optionally have a metal plate header.

Concept:

```text
┌────────────────────┐
│  STATUS / BUILD    │
├────────────────────┤
│ content            │
└────────────────────┘
```

Possible API:

```tsx
<Card surface="forged">
  <CardHeader eyebrow="Build status" title="Ready to deploy" />
</Card>
```

Alternative lighter API:

```tsx
<Card surface="forged" title="Ready to deploy" eyebrow="Build status" />
```

Visual rules:

- uppercase eyebrow
- compact header strip
- stronger bottom border
- optional rivet/node detail

## 4. Status lamps

Small industrial indicator lights add a strong dashboard/product feel.

Use tones:

- success = ready / stable
- warning = beta / attention
- danger = blocked / destructive
- info = neutral information

Possible API:

```tsx
<StatusLamp tone="success" />

<Badge tone="success">
  <StatusLamp tone="success" />
  Stable
</Badge>
```

Use in:

- Alert
- Badge
- package status
- docs beta notices
- deployment / build cards

## 5. Machined corners

Use clipped corners sparingly on forged surfaces.

```css
.ax-machined-corners {
  clip-path: polygon(
    0 8px,
    8px 0,
    100% 0,
    100% calc(100% - 8px),
    calc(100% - 8px) 100%,
    0 100%
  );
}
```

Best for:

- hero preview panels
- forged cards
- code blocks
- inspection panels

Avoid applying to every component.

## 6. Engraved labels / plate badges

Formalize uppercase industrial labels.

Possible API:

```tsx
<Badge variant="plate">PUBLIC BETA</Badge>
```

Visual direction:

- uppercase
- letter spacing
- low-contrast metal plate background
- border or inset shadow

Use for:

- beta labels
- package labels
- surface names
- docs section labels

## 7. Blueprint grid / foundry ambiance

The web currently has subtle blueprint/grid background styling. Consider moving reusable utilities into `@axonyx/ui`.

Possible utilities:

```css
.ax-blueprint-grid
.ax-radial-glow
.ax-foundry-backdrop
```

Use only at page / shell level, not inside every component.

## 8. Inspection panel component

Signature Axonyx component idea.

```tsx
<InspectionPanel
  title="Package status"
  rows={[
    ["@axonyx/ui", "0.0.x"],
    ["@axonyx/react", "0.0.x"],
    ["Runtime", "Server-safe"],
  ]}
/>
```

Visual direction:

- instrument panel
- compact rows
- monospaced values
- status lamps
- forged border
- optional plate header

## 9. CodeBlock as terminal / workbench

Upgrade CodeBlock with industrial top bar.

Ideas:

- top bar with rivet dots
- copy button as metal tab
- language plate on the right
- subtle inset surface
- optional terminal prompt style

This is important for docs because CodeBlock appears frequently.

## 10. Minimal motion

Motion should be precise and mechanical, not playful.

Possible effects:

- button press: `translateY(1px)`
- rivet glow on hover
- surface highlight sweep on CTA
- icon core/node glow
- copy button quick flash

Avoid animating everything.

## Priority batch

Recommended implementation order:

1. Restore forged/rivet button
2. Add `StatusLamp`
3. Add `CardHeader` / plate header pattern
4. Upgrade `CodeBlock` with industrial top bar
5. Add clipped forged surface utility
6. Add `InspectionPanel`
7. Add icon color/size polish

## Design principle

Industrial details should be concentrated on components where they communicate structure or state:

- actions
- status
- panels
- code/examples
- docs navigation

Keep base typography and layout clean so the system remains usable for real product interfaces.
