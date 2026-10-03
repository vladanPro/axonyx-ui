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
| Checkbox | Native toggle, checked initial value, and disabled input at both widths | Assistive-technology review |
| Select | Native selection changes at both widths | Disabled/invalid states and long option lists |
| Form contract | Field/label structure, required input validation, hint association, and disabled textarea at both widths | Backend action submission and assistive-technology review |
| Switch | Initial checked state, pointer and Space toggles, and disabled input at both widths | Assistive-technology review |
| Radio | Initial selection, exclusive group behavior, pointer and Space selection, disabled option, and arrow-key navigation at both widths | Assistive-technology review |

Separately, a temporary Axonyx route proved that boolean expressions emit
`checked` and `disabled` HTML attributes only when true. The route was removed
after verification. `Switch` and `Radio` use that mechanism in their source,
and the 0.0.75 catalog was covered by the browser checks above. The native form
contract additions are exercised against the 0.0.76 catalog pilot. The
[coverage inventory](component-coverage.md) is a source inventory rather than
a completion certificate; untested accessibility and edge states remain open.
