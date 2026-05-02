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

## 12. Reactive runtime / observer map

Axonyx reactive updates should work like an observer graph, not like full-page rerendering.

Core idea:

```txt
signal count
  -> dependency map
  -> count maps to exact patch targets
  -> update only those targets when count changes
```

When a signal changes, the runtime should ask:

```txt
Who listens to this signal?
What exact DOM target needs to change?
```

Then patch only those targets.

### Example

```ax
<Copy>Count: {count}</Copy>
<Button disabled={count == 0}>Reset</Button>
```

The compiler/runtime can produce a dependency map like:

```txt
count -> [
  { node: copy_text_1, target: Text },
  { node: reset_button, target: Attribute("disabled") }
]
```

When `count` changes from `0` to `1`, Axonyx should not rerender the whole page. It should do targeted patches:

```txt
copy_text_1.textContent = "Count: 1"
reset_button.removeAttribute("disabled")
```

### Runtime model

Every reactive value gets a signal id:

```rust
SignalId(42)
```

Every rendered node or patchable region gets a node id:

```html
<span data-ax-id="node_12">0</span>
```

Subscriptions should not only point to a node. They should point to a patch target:

```rust
struct Subscription {
    node_id: NodeId,
    target: PatchTarget,
    render_fn: RenderFnId,
}

enum PatchTarget {
    Text,
    Attribute(String),
    Class,
    Style(String),
    Fragment,
}
```

### MVP levels

Recommended implementation order:

1. Signal -> text node updates
2. Signal -> attributes/classes/styles
3. Signal -> conditional fragments
4. Signal -> keyed lists

### Design principle

Axonyx should not become a React clone.

The preferred model is:

```txt
compile .ax
  -> static HTML with stable node ids
  -> dependency graph
  -> small runtime patcher
```

Do not send updates to whole components when a text node or attribute patch is enough.

The strongest phrasing:

```txt
Axonyx does not rerender components by default.
Axonyx patches exact targets produced by the compiler.
```

## 13. Binding model: storage vs binding

Axonyx should separate where state lives from how it is bound to UI.

Core rule:

```txt
global/state = storage model
hard/soft = binding model
```

Do not define `global` as automatically hard or `state` as automatically soft.

### Storage model

`global` means app-level state. It can be read by multiple routes or components.

```ax
global count: u32 = 0
```

`state` means scoped state. It belongs to a component, route, or local island.

```ax
state modal_open: bool = false
```

Both should internally behave like reactive cells with stable signal identity when they are used reactively.

### Binding model

Hard binding means a live UI binding. The compiler connects a signal directly to exact DOM patch targets.

```ax
<Text>{count}</Text>
<Button disabled={count == 0}>Reset</Button>
```

This should compile into something like:

```txt
count -> TextNode
count -> Button.disabled
```

Soft binding means logic/event/app flow. It can change state, but it does not directly imply a UI patch until that state is used in a hard binding somewhere.

```ax
<Button onClick={modal_open.toggle}>Open</Button>
```

The UI updates only where the state is actually bound:

```ax
<Modal open={modal_open}>...</Modal>
```

### Snapshot vs live handle

Axonyx can support both patterns:

```txt
soft/value binding = snapshot value
hard/signal binding = live handle
```

If a component receives a plain value, it receives a snapshot.

```ax
<Counter value={count.value} />
```

If a component receives a signal, it receives a live handle / SignalId.

```ax
<Counter value={count} />
```

Public terminology can be:

```txt
Value binding = soft/static data flow
Signal binding = hard/live reactive data flow
```

Internal terminology can be:

```txt
Soft = snapshot
Hard = live handle
```

### Example model

```ax
global count: u32 = 0
state modal_open: bool = false

component App {
  <Text>{count}</Text>
  <Button onClick={modal_open.toggle}>Open</Button>
  <Modal open={modal_open}>...</Modal>
}
```

Expected interpretation:

```txt
count is global storage
modal_open is scoped storage
<Text>{count}</Text> is a hard/live binding
onClick={modal_open.toggle} is soft/event logic
<Modal open={modal_open}> is a hard/live binding to modal state
```

### Runtime principle

Avoid saying "zero runtime". More accurate:

```txt
minimal runtime
compiler-generated runtime
no virtual DOM
no component rerender by default
```

The runtime still needs to receive events, update cells, read the dependency map, and patch DOM targets.

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
