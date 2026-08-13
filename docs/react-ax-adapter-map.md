# React to AX Adapter Map

This map tracks how `@axonyx/react` component names map to `.asx` Foundry files.

## Covered

- `Button` -> `src/foundry/Button.asx`
- `LinkButton` -> `src/foundry/LinkButton.asx`
- `IconButton` -> `src/foundry/IconButton.asx`
- `Container` -> `src/foundry/Container.asx`
- `Grid` -> `src/foundry/Grid.asx`
- `Card` -> `src/foundry/SectionCard.asx`
- `Badge` -> `src/foundry/Badge.asx`
- `Chip` -> `src/foundry/Chip.asx`
- `Avatar` -> `src/foundry/Avatar.asx`
- `Divider` -> `src/foundry/Divider.asx`
- `Field` -> `src/foundry/Field.asx`
- `Input` -> `src/foundry/Input.asx`
- `Textarea` -> `src/foundry/Textarea.asx`
- `Select` -> `src/foundry/Select.asx`
- `Option` -> `src/foundry/Option.asx`
- `Checkbox` -> `src/foundry/Checkbox.asx`
- `Radio` -> `src/foundry/Radio.asx`
- `Switch` -> `src/foundry/Switch.asx`
- `Breadcrumbs` -> `src/foundry/Breadcrumbs.asx`
- `ButtonGroup` -> `src/foundry/ButtonGroup.asx`
- `Spinner` -> `src/foundry/Spinner.asx`
- `Toggle` -> `src/foundry/Toggle.asx`
- `ToggleGroup` -> `src/foundry/ToggleGroup.asx`
- `InputGroup` -> `src/foundry/InputGroup.asx`
- `InputAddon` -> `src/foundry/InputAddon.asx`
- `Combobox`, `ComboboxOption` -> `src/foundry/Combobox.asx`, `src/foundry/ComboboxOption.asx`
- `AlertDialog` -> `src/foundry/AlertDialog.asx`
- `NavigationMenu`, `NavigationMenuList`, `NavigationMenuLink` -> `src/foundry/NavigationMenu*.asx`
- `ScrollArea` -> `src/foundry/ScrollArea.asx`
- `Section` -> `src/foundry/Section.asx`
- `Stack` -> `src/foundry/Stack.asx`
- `Cluster` -> `src/foundry/Cluster.asx`
- `Navbar` -> `src/foundry/Navbar.asx`
- `Footer` -> `src/foundry/Footer.asx`
- `AppShell` -> `src/foundry/AppShell.asx`
- `Table` -> `src/foundry/Table.asx`
- `List` -> `src/foundry/List.asx`
- `EmptyState` -> `src/foundry/EmptyState.asx`
- `Skeleton` -> `src/foundry/Skeleton.asx`
- `Progress` -> `src/foundry/Progress.asx`
- `StatusLamp` -> `src/foundry/StatusLamp.asx`
- `Stat` -> `src/foundry/Stat.asx`
- `Pagination` -> `src/foundry/Pagination.asx`
- `Tooltip` -> `src/foundry/Tooltip.asx`
- `CodeBlock` -> `src/foundry/CodeBlock.asx`
- `Command` -> `src/foundry/CommandList.asx`
- `PropsTable` -> `src/foundry/PropsTable.asx`

## Notes

- Adapter components intentionally stay thin and map to existing CSS contract classes.
- For some React components, the AX equivalent is a semantic sibling, not always a 1:1 API clone.
- This map is the source of truth for authoring migration from React JSX to Axonyx `.asx`.
