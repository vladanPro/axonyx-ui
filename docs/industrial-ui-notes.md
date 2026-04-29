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

## 2. Industrial separators / cut lines

Create a reusable cut line utility for section breaks.

Use for docs sections, landing sections, and component examples.

## 3. Plate headers

Cards can optionally have a metal plate header.

Possible API:

```tsx
<Card surface="forged">
  <CardHeader eyebrow="Build status" title="Ready to deploy" />
</Card>
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

## 5. Machined corners

Use clipped corners sparingly on forged surfaces.

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

## 11. MachineSwitch / industrial toggle

A signature Axonyx control inspired by physical machine controls in foundries and workshops.

This should not feel like a normal checkbox. It should feel like a small control panel with red/green machine buttons.

Possible names:

```txt
MachineSwitch
ToggleLever
PowerSwitch
IndustrialSwitch
```

Recommended public name:

```txt
MachineSwitch
```

### Behavior

OFF state:

- red side active
- red control visually raised / lit
- green side inactive
- switch feels safe/stopped/disabled

ON state:

- green side active
- green control visually pressed or locked in
- red side inactive/dimmed
- switch feels running/enabled/armed

### Possible API

Client controlled:

```tsx
<MachineSwitch checked={enabled} onCheckedChange={setEnabled} />
```

Uncontrolled:

```tsx
<MachineSwitch defaultChecked label="Foundry mode" />
```

With domain copy:

```tsx
<MachineSwitch
  label="Deploy pipeline"
  onLabel="Armed"
  offLabel="Stopped"
/>
```

### HTML contract idea

```html
<button class="ax-machine-switch" data-state="on">
  <span class="ax-machine-switch__lamp" data-tone="danger"></span>
  <span class="ax-machine-switch__track">
    <span class="ax-machine-switch__knob"></span>
  </span>
  <span class="ax-machine-switch__lamp" data-tone="success"></span>
</button>
```

### Visual direction

- small forged control housing
- red and green indicator lamps
- knob/button moves mechanically
- active lamp glows subtly
- ON state can press downward by 1px and glow green
- OFF state can raise the red control and dim the green side
- animation should be short and mechanical, not playful

### Use cases

- feature toggles
- deploy enabled/disabled
- maintenance mode
- public beta switch
- server/client mode demo
- theme or runtime controls

### Implementation note

Best fit is `@axonyx/react/client`, because it needs state and interaction. A static CSS/HTML contract can still exist in `@axonyx/ui`.

## Priority batch

Recommended implementation order:

1. Restore forged/rivet button
2. Add `StatusLamp`
3. Add `MachineSwitch`
4. Add `CardHeader` / plate header pattern
5. Upgrade `CodeBlock` with industrial top bar
6. Add clipped forged surface utility
7. Add `InspectionPanel`
8. Add icon color/size polish

## Design principle

Industrial details should be concentrated on components where they communicate structure or state:

- actions
- status
- panels
- code/examples
- docs navigation
- stateful controls

Keep base typography and layout clean so the system remains usable for real product interfaces.
