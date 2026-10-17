// Browser plugin not available; use the existing test-only Playwright dependency.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const css = readFileSync('src/css/index.css', 'utf8').replace(/@import '\.\/([^']+)';/g,
  (_, file) => readFileSync(resolve('src/css', file), 'utf8'));
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
    try {
      for (const palette of ['bronze', 'silver', 'gold']) {
        for (const style of ['classic', 'alloy', 'forge']) {
          for (const mode of ['light', 'dark']) {
            await page.setContent(`<html data-theme="${palette}" data-foundry="${palette}" data-foundry-style="${style}" data-foundry-mode="${mode}">
              <head><style>${css}</style></head><body>
              <nav class="ax-sidebar-nav" aria-label="Docs" style="width:200px">
                <a id="page" href="#page" aria-current="page">Page</a>
                <a id="location" href="#location" aria-current="location">Section</a>
                <a id="native" href="#native" aria-current="true">Native</a>
                <a id="data" href="#data" data-active="true">Data</a>
                <a id="legacy" href="#legacy" class="is-active">Legacy</a>
                <a id="inactive" href="#inactive" aria-current="false" data-active="false">Inactive</a>
              </nav><a class="ax-sidebar-item" href="#dashboard" data-active="true">Dashboard</a>
              </body></html>`);
            const styles = await page.locator('.ax-sidebar-nav a').evaluateAll(nodes => nodes.map(node => {
              const css = getComputedStyle(node);
              return { radius: css.borderRadius, padding: css.padding, background: css.backgroundColor,
                left: css.borderLeftColor, top: css.borderTopColor, shadow: css.boxShadow };
            }));
            for (const selected of styles.slice(0, 5)) {
              assert.deepEqual(selected, styles[0]);
              assert.equal(selected.radius, '5px');
              assert.equal(selected.padding, '6px 10px');
              assert.equal(selected.top, 'rgba(0, 0, 0, 0)');
              assert.equal(selected.shadow, 'none');
              assert.notEqual(selected.left, selected.top);
            }
            assert.equal(styles[5].left, 'rgba(0, 0, 0, 0)');
            assert.notEqual(styles[5].background, styles[0].background);
            await page.locator('.ax-sidebar-nav').evaluate(node => node.style.setProperty('--ax-sidebar-nav-item-radius', '9px'));
            assert.equal(await page.locator('#page').evaluate(node => getComputedStyle(node).borderRadius), '9px');
            await page.keyboard.press('Tab');
            assert.equal(await page.locator('#page').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            console.log(`PASS sidebar nav ${width}px ${palette}/${style}/${mode} no-JS`);
          }
        }
      }
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
