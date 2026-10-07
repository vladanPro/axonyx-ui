//! Axonyx UI asset crate.
//!
//! This crate is the Cargo-side package for the same Foundry contract that is
//! published to npm as `@axonyx/ui`. Build tools can depend on this crate to
//! copy CSS, JavaScript helpers, Axonyx-native `.asx` components, and registry
//! blocks without shelling out to npm or cloning the UI repository.

/// An embedded Axonyx UI source asset.
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct Asset {
    /// Package-relative path without the leading `src/`.
    ///
    /// Examples: `css/index.css`, `foundry/Button.asx`, `blocks/marketing-01.asx`,
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

    fn has_explicit_return_asx(contents: &str) -> bool {
        contents
            .lines()
            .any(|line| line.trim_end_matches('\r') == "  return ASX {")
    }

    #[test]
    fn native_components_use_explicit_return_asx() {
        for asset in foundry_assets().iter().chain(block_assets()) {
            if asset.path.ends_with(".asx") {
                assert!(
                    has_explicit_return_asx(asset.contents),
                    "{} should use the explicit component render boundary",
                    asset.path
                );
            }
        }
    }

    #[test]
    fn explicit_return_asx_accepts_lf_and_crlf() {
        assert!(has_explicit_return_asx(
            "component Demo() {\n  return ASX {\n  }\n}"
        ));
        assert!(has_explicit_return_asx(
            "component Demo() {\r\n  return ASX {\r\n  }\r\n}"
        ));
    }

    #[test]
    fn exposes_core_css_asset() {
        let index = asset("css/index.css").expect("index css should be embedded");
        assert!(index.contents.contains("tokens.css"));
    }

    #[test]
    fn exposes_foundry_component_asset() {
        let button = asset("foundry/Button.asx").expect("button component should be embedded");
        let link_button =
            asset("foundry/LinkButton.asx").expect("link button component should be embedded");
        assert!(button.contents.contains("component Button"));
        assert!(button.contents.contains("<button"));
        assert!(button.contents.contains("type = \"button\""));
        assert!(!button.contents.contains("href = \"#\""));
        assert!(link_button.contents.contains("<a"));
        assert!(link_button.contents.contains("href={href}"));
    }

    #[test]
    fn exposes_form_composition_assets() {
        let spinner = asset("foundry/Spinner.asx").expect("spinner should be embedded");
        let toggle = asset("foundry/Toggle.asx").expect("toggle should be embedded");
        let toggle_group =
            asset("foundry/ToggleGroup.asx").expect("toggle group should be embedded");
        let input_group = asset("foundry/InputGroup.asx").expect("input group should be embedded");
        let input_addon = asset("foundry/InputAddon.asx").expect("input addon should be embedded");
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
        let combobox = asset("foundry/Combobox.asx").expect("combobox should be embedded");
        let alert_dialog =
            asset("foundry/AlertDialog.asx").expect("alert dialog should be embedded");
        let navigation =
            asset("foundry/NavigationMenu.asx").expect("navigation menu should be embedded");
        let scroll_area = asset("foundry/ScrollArea.asx").expect("scroll area should be embedded");
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
        let page = asset("foundry/ComponentPage.asx").expect("component page should be embedded");
        assert!(page.contents.contains("component ComponentPage"));
        assert!(page.contents.contains("ax-component-page"));
    }

    #[test]
    fn exposes_core_layout_contracts() {
        let container = asset("foundry/Container.asx").expect("container should be embedded");
        let grid = asset("foundry/Grid.asx").expect("grid should be embedded");
        let stack = asset("foundry/Stack.asx").expect("stack should be embedded");
        let flex = asset("foundry/Flex.asx").expect("flex should be embedded");
        let section = asset("foundry/Section.asx").expect("section should be embedded");
        let bleed = asset("foundry/Bleed.asx").expect("bleed should be embedded");
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
        assert!(bleed.contents.contains("data-mode={mode}"));
        assert!(tokens.contents.contains("--ax-space-xs"));
        assert!(layout.contents.contains(".ax-grid[data-gap='2xl']"));
        assert!(stack_css.contents.contains(".ax-stack[data-align='end']"));
        assert!(primitives.contents.contains(".ax-flex[data-gap='2xl']"));
        assert!(primitives
            .contents
            .contains(".ax-box[data-surface='inset']"));
        assert!(primitives.contents.contains(".ax-inset[data-size='2xl']"));
        assert!(primitives.contents.contains(".ax-bleed[data-padding='lg']"));
        assert!(primitives
            .contents
            .contains(".ax-bleed[data-mode='viewport']"));
    }

    #[test]
    fn exposes_collapsible_sidebar_contract() {
        let sidebar = asset("foundry/Sidebar.asx").expect("sidebar should be embedded");
        let section =
            asset("foundry/SidebarSection.asx").expect("sidebar section should be embedded");
        let item = asset("foundry/SidebarItem.asx").expect("sidebar item should be embedded");
        let header = asset("foundry/SidebarHeader.asx").expect("sidebar header should be embedded");
        let footer = asset("foundry/SidebarFooter.asx").expect("sidebar footer should be embedded");
        assert!(sidebar.contents.contains("data-ax-sidebar-toggle"));
        assert!(sidebar.contents.contains("collapsible"));
        assert!(sidebar.contents.contains("<Slot name=\"header\" />"));
        assert!(sidebar.contents.contains("<Slot name=\"footer\" />"));
        assert!(section.contents.contains("ax-sidebar-section__body"));
        assert!(item.contents.contains("aria-current={active}"));
        assert!(header.contents.contains("ax-layout-sidebar__header"));
        assert!(footer.contents.contains("ax-layout-sidebar__footer"));
    }

    #[test]
    fn exposes_interactive_component_example_contract() {
        let example =
            asset("foundry/ComponentExample.asx").expect("component example should be embedded");
        let style = asset("css/component-example.css")
            .expect("component example styles should be embedded");
        let index = asset("css/index.css").expect("index css should be embedded");

        assert!(example.contents.contains("<Slot name=\"preview\" />"));
        assert!(example.contents.contains("<Slot name=\"code\" />"));
        assert!(example.contents.contains("<details"));
        assert!(style
            .contents
            .contains(".ax-component-example__source-toggle"));
        assert!(index.contents.contains("component-example.css"));
    }

    #[test]
    fn exposes_component_install_contract() {
        let install =
            asset("foundry/ComponentInstall.asx").expect("component install should be embedded");
        let style = asset("css/component-install.css")
            .expect("component install styles should be embedded");
        let index = asset("css/index.css").expect("index css should be embedded");

        assert!(install.contents.contains("<DocsCodeBlock"));
        assert!(install.contents.contains("Manual setup"));
        assert!(style.contents.contains(".ax-component-install__manual"));
        assert!(index.contents.contains("component-install.css"));
    }

    #[test]
    fn exposes_block_asset() {
        let block = asset("blocks/marketing-01.asx").expect("marketing block should be embedded");
        assert!(block.contents.contains("component Marketing01"));
    }

    #[test]
    fn exposes_login_block_with_native_form_semantics() {
        let block = asset("blocks/login-01.asx").expect("login block should be embedded");
        assert!(block.contents.contains("component Login01"));
        assert!(block.contents.contains("type=\"submit\""));
        assert!(block.contents.contains("autocomplete=\"current-password\""));
    }

    #[test]
    fn exposes_settings_block_with_application_shell() {
        let block = asset("blocks/settings-01.asx").expect("settings block should be embedded");
        assert!(block.contents.contains("component Settings01"));
        assert!(block.contents.contains("<AppShell"));
        assert!(block.contents.contains("type=\"submit\""));
        assert!(block.contents.contains("Danger zone"));
        assert!(block.contents.contains("mode=\"embedded\""));
        assert!(block.contents.contains("method = \"get\""));
        assert!(block.contents.contains("<details"));
        assert!(block.contents.contains("data-ax-field-error=\"slug\""));
        assert!(block.contents.contains("data-state=\"complete\""));
        assert!(!block.contents.contains("Changes protected"));
        assert!(!block.contents.contains("<Main>"));
        assert!(asset("css/settings.css").is_some());
        let button = asset("foundry/Button.asx").expect("button should be embedded");
        assert!(button.contents.contains("disabled={disabled == \"true\"}"));
    }

    #[test]
    fn dashboard_block_uses_stat_slots() {
        let block = asset("blocks/dashboard-01.asx").expect("dashboard block should be embedded");
        assert!(block.contents.contains("slot=\"label\""));
        assert!(block.contents.contains("slot=\"value\""));
        assert!(!block.contents.contains("<Stat label="));
        assert!(block.contents.contains("submitAction = \"\""));
        assert!(block.contents.contains("<details"));
        assert!(block.contents.contains("<caption"));
        assert!(block.contents.contains("type=\"reset\""));
        assert!(block.contents.contains("method=\"get\""));
        assert!(asset("css/dashboard.css").is_some());
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
