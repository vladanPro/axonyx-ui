//! Axonyx UI asset crate.
//!
//! This crate is the Cargo-side package for the same Foundry contract that is
//! published to npm as `@axonyx/ui`. Build tools can depend on this crate to
//! copy CSS, JavaScript helpers, Axonyx-native `.ax` components, and registry
//! blocks without shelling out to npm or cloning the UI repository.

/// An embedded Axonyx UI source asset.
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct Asset {
    /// Package-relative path without the leading `src/`.
    ///
    /// Examples: `css/index.css`, `foundry/Button.ax`, `blocks/marketing-01.ax`,
    /// `js/dialog.js`.
    pub path: &'static str,
    /// UTF-8 asset contents.
    pub contents: &'static str,
}

include!(concat!(env!("OUT_DIR"), "/assets.rs"));

/// Returns all Foundry CSS assets.
pub fn css_assets() -> &'static [Asset] {
    CSS_ASSETS
}

/// Returns optional JavaScript helpers used by interactive Foundry primitives.
pub fn js_assets() -> &'static [Asset] {
    JS_ASSETS
}

/// Returns Axonyx-native Foundry component assets.
pub fn foundry_assets() -> &'static [Asset] {
    FOUNDRY_ASSETS
}

/// Returns Axonyx-native Foundry block assets.
pub fn block_assets() -> &'static [Asset] {
    BLOCK_ASSETS
}

/// Returns the package registry manifest.
pub fn registry_manifest() -> &'static str {
    REGISTRY_MANIFEST
}

/// Iterates through every embedded asset in a stable package order.
pub fn all_assets() -> impl Iterator<Item = &'static Asset> {
    CSS_ASSETS
        .iter()
        .chain(JS_ASSETS)
        .chain(FOUNDRY_ASSETS)
        .chain(BLOCK_ASSETS)
}

/// Finds an embedded asset by package-relative path.
pub fn asset(path: &str) -> Option<&'static Asset> {
    all_assets().find(|asset| asset.path == path)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn exposes_core_css_asset() {
        let index = asset("css/index.css").expect("index css should be embedded");
        assert!(index.contents.contains("tokens.css"));
    }

    #[test]
    fn exposes_foundry_component_asset() {
        let button = asset("foundry/Button.ax").expect("button component should be embedded");
        assert!(button.contents.contains("component Button"));
    }

    #[test]
    fn exposes_form_composition_assets() {
        let spinner = asset("foundry/Spinner.ax").expect("spinner should be embedded");
        let toggle = asset("foundry/Toggle.ax").expect("toggle should be embedded");
        let toggle_group =
            asset("foundry/ToggleGroup.ax").expect("toggle group should be embedded");
        let input_group = asset("foundry/InputGroup.ax").expect("input group should be embedded");
        let input_addon = asset("foundry/InputAddon.ax").expect("input addon should be embedded");
        let index = asset("css/index.css").expect("index css should be embedded");

        assert!(spinner.contents.contains("component Spinner"));
        assert!(toggle.contents.contains("component Toggle"));
        assert!(toggle_group.contents.contains("component ToggleGroup"));
        assert!(input_group.contents.contains("component InputGroup"));
        assert!(input_addon.contents.contains("component InputAddon"));
        assert!(index.contents.contains("spinner.css"));
        assert!(index.contents.contains("toggle.css"));
        assert!(index.contents.contains("input-group.css"));
    }

    #[test]
    fn exposes_application_composition_assets() {
        let combobox = asset("foundry/Combobox.ax").expect("combobox should be embedded");
        let alert_dialog =
            asset("foundry/AlertDialog.ax").expect("alert dialog should be embedded");
        let navigation =
            asset("foundry/NavigationMenu.ax").expect("navigation menu should be embedded");
        let scroll_area = asset("foundry/ScrollArea.ax").expect("scroll area should be embedded");
        let index = asset("css/index.css").expect("index css should be embedded");
        let runtime = asset("js/index.js").expect("index runtime should be embedded");

        assert!(combobox.contents.contains("component Combobox"));
        assert!(combobox.contents.contains("<datalist"));
        assert!(alert_dialog.contents.contains("role=\"alertdialog\""));
        assert!(alert_dialog.contents.contains("data-ax-dialog-close"));
        assert!(alert_dialog.contents.contains("hidden=\"true\""));
        assert!(navigation.contents.contains("component NavigationMenu"));
        assert!(scroll_area.contents.contains("role=\"region\""));
        assert!(index.contents.contains("combobox.css"));
        assert!(index.contents.contains("alert-dialog.css"));
        assert!(index.contents.contains("navigation-menu.css"));
        assert!(index.contents.contains("scroll-area.css"));
        assert!(runtime.contents.contains("bootDialogs"));
        assert!(runtime.contents.contains("window.AxonyxDialog"));
    }

    #[test]
    fn exposes_component_page_contract() {
        let page = asset("foundry/ComponentPage.ax").expect("component page should be embedded");
        assert!(page.contents.contains("component ComponentPage"));
        assert!(page.contents.contains("ax-component-page"));
    }

    #[test]
    fn exposes_core_layout_contracts() {
        let container = asset("foundry/Container.ax").expect("container should be embedded");
        let grid = asset("foundry/Grid.ax").expect("grid should be embedded");
        let stack = asset("foundry/Stack.ax").expect("stack should be embedded");
        let flex = asset("foundry/Flex.ax").expect("flex should be embedded");
        let section = asset("foundry/Section.ax").expect("section should be embedded");
        let tokens = asset("css/tokens.css").expect("tokens should be embedded");
        let layout = asset("css/layout.css").expect("layout css should be embedded");
        let stack_css = asset("css/stack.css").expect("stack css should be embedded");
        let primitives = asset("css/primitives.css").expect("primitives css should be embedded");

        assert!(container.contents.contains("data-recipe={recipe}"));
        assert!(grid.contents.contains("data-min={min}"));
        assert!(stack.contents.contains("data-align={align}"));
        assert!(flex.contents.contains("data-collapse={collapse}"));
        assert!(section.contents.contains("data-spacing={spacing}"));
        assert!(section.contents.contains("ax-section__description"));
        assert!(tokens.contents.contains("--ax-space-xs"));
        assert!(layout.contents.contains(".ax-grid[data-gap='2xl']"));
        assert!(stack_css.contents.contains(".ax-stack[data-align='end']"));
        assert!(primitives.contents.contains(".ax-flex[data-gap='2xl']"));
        assert!(primitives
            .contents
            .contains(".ax-box[data-surface='inset']"));
        assert!(primitives.contents.contains(".ax-inset[data-size='2xl']"));
        assert!(primitives.contents.contains(".ax-bleed[data-padding='lg']"));
    }

    #[test]
    fn exposes_collapsible_sidebar_contract() {
        let sidebar = asset("foundry/Sidebar.ax").expect("sidebar should be embedded");
        assert!(sidebar.contents.contains("data-ax-sidebar-toggle"));
        assert!(sidebar.contents.contains("collapsible"));
    }

    #[test]
    fn exposes_block_asset() {
        let block = asset("blocks/marketing-01.ax").expect("marketing block should be embedded");
        assert!(block.contents.contains("component Marketing01"));
    }

    #[test]
    fn exposes_login_block_with_native_form_semantics() {
        let block = asset("blocks/login-01.ax").expect("login block should be embedded");
        assert!(block.contents.contains("component Login01"));
        assert!(block.contents.contains("type=\"submit\""));
        assert!(block.contents.contains("autocomplete=\"current-password\""));
    }

    #[test]
    fn exposes_settings_block_with_application_shell() {
        let block = asset("blocks/settings-01.ax").expect("settings block should be embedded");
        assert!(block.contents.contains("component Settings01"));
        assert!(block.contents.contains("<AppShell"));
        assert!(block.contents.contains("type=\"submit\""));
        assert!(block.contents.contains("Danger zone"));
        assert!(block.contents.contains("mode=\"embedded\""));
    }

    #[test]
    fn dashboard_block_uses_stat_slots() {
        let block = asset("blocks/dashboard-01.ax").expect("dashboard block should be embedded");
        assert!(block.contents.contains("slot=\"label\""));
        assert!(block.contents.contains("slot=\"value\""));
        assert!(!block.contents.contains("<Stat label="));
    }

    #[test]
    fn exposes_registry_manifest() {
        assert!(registry_manifest().contains("marketing-01"));
        assert!(registry_manifest().contains("login-01"));
        assert!(registry_manifest().contains("settings-01"));
        assert!(registry_manifest().contains("Button"));
        assert!(registry_manifest().contains("ToggleGroup"));
        assert!(registry_manifest().contains("InputGroup"));
        assert!(registry_manifest().contains("Spinner"));
        assert!(registry_manifest().contains("Combobox"));
        assert!(registry_manifest().contains("AlertDialog"));
        assert!(registry_manifest().contains("NavigationMenu"));
        assert!(registry_manifest().contains("ScrollArea"));
        assert!(registry_manifest().contains("Container"));
        assert!(registry_manifest().contains("Grid"));
        assert!(registry_manifest().contains("Stack"));
        assert!(registry_manifest().contains("Flex"));
        assert!(registry_manifest().contains("Cluster"));
        assert!(registry_manifest().contains("Box"));
        assert!(registry_manifest().contains("Surface"));
        assert!(registry_manifest().contains("Section"));
        assert!(registry_manifest().contains("Inset"));
        assert!(registry_manifest().contains("Bleed"));
        assert!(registry_manifest().contains("Center"));
    }
}
