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
| AlertDialog | Open, Cancel focus, backdrop cannot dismiss, Escape and focus restoration at both widths | Screen-reader announcement and destructive action wiring |
| DropdownMenu | Keyboard open, `aria-expanded`, menu links, Escape and focus restoration at both widths | Arrow-key menu navigation and menu role semantics |
| Combobox | Native datalist association, three options, typed value at both widths | Browser suggestion popup interaction and validation |
| Checkbox | Native checkbox toggles at both widths | Disabled/checked props in a released catalog package |
| Select | Native selection changes at both widths | Disabled/invalid states and long option lists |
| Switch | Initial checked state, pointer toggle, and Space toggle at both widths | Disabled state and assistive-technology review |
| Radio | Initial selection, exclusive group behavior, pointer and Space selection at both widths | Disabled state and arrow-key navigation |

Separately, a temporary Axonyx route proved that boolean expressions emit
`checked` and `disabled` HTML attributes only when true. The route was removed
after verification. `Switch` and `Radio` use that mechanism in their source,
and the published 0.0.75 catalog is covered by the browser checks above. The
[coverage inventory](component-coverage.md) is a source inventory rather than
a completion certificate; untested accessibility and edge states remain open.
