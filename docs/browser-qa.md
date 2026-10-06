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
| DropdownMenu | Native link semantics, keyboard open, `aria-expanded`, ArrowUp/ArrowDown/Home/End navigation, Tab exit, Escape and focus restoration at both widths | Disabled items, type-ahead, and assistive-technology review |
| Combobox | Native datalist association, three options, typed value at both widths | Browser suggestion popup interaction and validation |
| Checkbox | Label/Space toggles, initial/false flags, checked disabled control, reset, FormData omission and actual GET submission at both widths with JS enabled and disabled | Assistive-technology review and required/indeterminate package APIs |
| Select | Native selection changes at both widths | Disabled/invalid states and long option lists |
| Option | Non-first initial selection, false flag omission, disabled keyboard skipping, reset, GET submission, and a required disabled placeholder at both widths with JS enabled and disabled | Native picker pointer interaction across operating systems and assistive-technology review |
| Form contract | Field/label structure, required input validation, hint association, and omitted disabled record ID at both widths | Backend action submission and assistive-technology review |
| Switch | Initial checked state, pointer and Space toggles, and disabled input at both widths | Assistive-technology review |
| Radio | Non-first default, exclusive and independent groups, label/Space selection, disabled keyboard skipping, reset, FormData and actual GET submission at both widths with JS enabled and disabled | Assistive-technology review and required package API |

Separately, a temporary Axonyx route proved that boolean expressions emit
`checked` and `disabled` HTML attributes only when true. The route was removed
after verification. `Switch` and `Radio` use that mechanism in their source,
and the 0.0.75 catalog was covered by the browser checks above. The native form
contract additions are exercised against the 0.0.76 catalog pilot. The
[coverage inventory](component-coverage.md) is a source inventory rather than
a completion certificate; untested accessibility and edge states remain open.

The 0.0.80 Select pilot uses actual native selected/disabled attributes. The suite
includes four Option scenarios (desktop/mobile, JS/no-JS) and is aligned with the
current Forms overview and CMS Form example. Before publication, the native
catalog was built against the local UI path; replacing only JS would not test
changes to the Option markup. The complete suite passed 24 browser scenarios.

On 2026-10-06, the Checkbox and Radio catalog pages added native form and reset
examples without changing the 0.0.80 package. Eight additional desktop/mobile,
JS/no-JS scenarios verify real submission and independent groups. The complete
suite passed 32 scenarios against installed package assets. Existing assertions
now match the non-first Radio default and check that a disabled Checkbox retains
its initial state rather than assuming that state is always unchecked.
