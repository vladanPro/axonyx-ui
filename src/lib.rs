//! Axonyx UI asset crate.
//!
//! This crate is the Cargo-side package for the same Foundry contract that is
//! published to npm as `@axonyx/ui`. Build tools can depend on this crate to
//! copy CSS, JavaScript helpers, and Axonyx-native `.ax` components without
//! shelling out to npm or cloning the UI repository.

/// An embedded Axonyx UI source asset.
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct Asset {
    /// Package-relative path without the leading `src/`.
    ///
    /// Examples: `css/index.css`, `foundry/Button.ax`, `js/dialog.js`.
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

/// Iterates through every embedded asset in a stable package order.
pub fn all_assets() -> impl Iterator<Item = &'static Asset> {
    CSS_ASSETS.iter().chain(JS_ASSETS).chain(FOUNDRY_ASSETS)
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
        assert!(button.contents.contains("page Button"));
    }
}
