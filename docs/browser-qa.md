# Foundry browser QA: overlays and basic forms

The targeted browser suite runs against a live Axonyx UI catalog. It substitutes
the local `src/js/index.js` for the catalog's installed behavior bundle so UI
behavior changes can be tested before a package release. It does not substitute
native `.asx` markup or CSS, and is not a full component certification.

```bash
# In axonyx-site-ui
cargo ax run dev --host 127.0.0.1 --port 3105

# In axonyx-ui
npm ci
npm run test:browser
```

Set `AXONYX_UI_BASE_URL` if the catalog uses another address. Playwright's
Chromium browser must be installed for the local developer environment.

| Component | Verified in the browser | Still open |
| --- | --- | --- |
| Dialog | Open, focus close button, Escape, restore trigger focus at desktop and mobile widths | Full screen-reader review and nested dialogs |
| Drawer | Plain ID and CSS-selector triggers, close button, Escape, focus restoration at both widths | Full focus trap and nested drawers |
| Popover | Keyboard open, `aria-expanded`, Escape, focus restoration at both widths | Rich interactive content and positioning at viewport edges |
| Checkbox | Native checkbox toggles at both widths | Disabled/checked props in a released catalog package |
| Select | Native selection changes at both widths | Disabled/invalid states and long option lists |

Separately, a temporary Axonyx route proved that boolean expressions emit
`checked` and `disabled` HTML attributes only when true. The route was removed
after verification. `Switch` and `Radio` now use that mechanism in their source,
but their complete rendered components still need a browser pass after the next
UI package release. The [coverage inventory](component-coverage.md) keeps QA
columns unknown until that broader pass is recorded.
