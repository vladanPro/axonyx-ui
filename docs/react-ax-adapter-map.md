# React to AX Adapter Map

This map tracks how `@axonyx/react` component names map to `.ax` Foundry files.

## Covered

- `Button` -> `src/foundry/Button.ax`
- `LinkButton` -> `src/foundry/LinkButton.ax`
- `IconButton` -> `src/foundry/IconButton.ax`
- `Container` -> `src/foundry/Container.ax`
- `Grid` -> `src/foundry/Grid.ax`
- `Card` -> `src/foundry/SectionCard.ax`
- `Badge` -> `src/foundry/Badge.ax`
- `Chip` -> `src/foundry/Chip.ax`
- `Avatar` -> `src/foundry/Avatar.ax`
- `Divider` -> `src/foundry/Divider.ax`
- `Field` -> `src/foundry/Field.ax`
- `Input` -> `src/foundry/Input.ax`
- `Textarea` -> `src/foundry/Textarea.ax`
- `Select` -> `src/foundry/Select.ax`
- `Option` -> `src/foundry/Option.ax`
- `Checkbox` -> `src/foundry/Checkbox.ax`
- `Radio` -> `src/foundry/Radio.ax`
- `Switch` -> `src/foundry/Switch.ax`
- `Breadcrumbs` -> `src/foundry/Breadcrumbs.ax`
- `ButtonGroup` -> `src/foundry/ButtonGroup.ax`
- `Section` -> `src/foundry/Section.ax`
- `Stack` -> `src/foundry/Stack.ax`
- `Cluster` -> `src/foundry/Cluster.ax`
- `Navbar` -> `src/foundry/Navbar.ax`
- `Footer` -> `src/foundry/Footer.ax`
- `AppShell` -> `src/foundry/AppShell.ax`
- `Table` -> `src/foundry/Table.ax`
- `List` -> `src/foundry/List.ax`
- `EmptyState` -> `src/foundry/EmptyState.ax`
- `Skeleton` -> `src/foundry/Skeleton.ax`
- `Progress` -> `src/foundry/Progress.ax`
- `StatusLamp` -> `src/foundry/StatusLamp.ax`
- `Stat` -> `src/foundry/Stat.ax`
- `Pagination` -> `src/foundry/Pagination.ax`
- `Tooltip` -> `src/foundry/Tooltip.ax`
- `CodeBlock` -> `src/foundry/CodeBlock.ax`
- `Command` -> `src/foundry/CommandList.ax`
- `PropsTable` -> `src/foundry/PropsTable.ax`

## Notes

- Adapter components intentionally stay thin and map to existing CSS contract classes.
- For some React components, the AX equivalent is a semantic sibling, not always a 1:1 API clone.
- This map is the source of truth for authoring migration from React JSX to Axonyx `.ax`.
