// Browser plugin not available; reuse the existing test-only Playwright tooling.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const css = readFileSync('src/css/index.css', 'utf8').replace(/@import '\.\/([^']+)';/g,
  (_, file) => readFileSync(resolve('src/css', file), 'utf8'));
const runtime = readFileSync('src/js/index.js', 'utf8');
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 820, 1024, 1440]) {
    for (const palette of ['bronze', 'silver', 'gold']) {
      for (const mode of ['light', 'dark']) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: false });
        try {
          await page.setContent(`<html data-theme="${palette}" data-foundry="${palette}" data-foundry-mode="${mode}">
            <style>${css}</style><body style="margin:0"><header class="ax-site-header"><div class="ax-site-header__inner">
            <a class="ax-site-header__brand" href="#home">Axonyx</a>
            <button class="ax-site-header__toggle" aria-controls="nav" aria-expanded="false">Menu</button>
            <nav id="nav" class="ax-site-header__links" aria-label="Primary">
            <a href="#docs" aria-current="page">Docs</a><a href="#ui">UI</a><a href="#react">React Adapter</a>
            </nav><div class="ax-site-header__appearance">Appearance</div></div></header></body></html>`);
          const current = page.locator('[aria-current=page]');
          assert.ok(await current.isVisible());
          assert.equal(await page.locator('.ax-site-header__toggle').isVisible(), false);
          const shape = await current.evaluate(node => {
            const style = getComputedStyle(node);
            return { radius: style.borderRadius, weight: style.fontWeight, edge: style.borderTopColor,
              signal: getComputedStyle(node, '::after').height, shadow: style.boxShadow };
          });
          assert.equal(shape.radius, '11px');
          assert.equal(shape.weight, '800');
          assert.equal(shape.signal, '2px');
          assert.notEqual(shape.edge, 'rgba(0, 0, 0, 0)');
          assert.notEqual(shape.shadow, 'none');
          await page.keyboard.press('Tab');
          assert.equal(await page.locator('.ax-site-header__brand').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          console.log(`PASS header ${width}px ${palette}/${mode} no-JS`);
        } finally { await page.close(); }
      }
    }
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    try {
      await page.setContent(`<style>${css}</style><header class="ax-site-header"><div class="ax-site-header__inner">
        <a class="ax-site-header__brand" href="#home">Axonyx</a>
        <button class="ax-site-header__toggle" aria-controls="nav" aria-expanded="false">Menu</button>
        <nav class="ax-site-header__links" id="nav"><a href="#docs">Docs</a></nav></div></header>`);
      await page.addScriptTag({ content: runtime });
      const toggle = page.locator('.ax-site-header__toggle');
      const nav = page.locator('#nav');
      await page.waitForFunction(() => document.querySelector('.ax-site-header__toggle').dataset.ready === 'true');
      if (width <= 820) {
        assert.equal(await nav.isVisible(), false);
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.ok(await nav.isVisible());
        await nav.locator('a').focus();
        await page.keyboard.press('Escape');
        assert.equal(await nav.isVisible(), false);
        assert.ok(await toggle.evaluate(node => document.activeElement === node));
        await toggle.click();
        await nav.locator('a').click();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      } else { assert.ok(await nav.isVisible()); }
      console.log(`PASS header disclosure ${width}px`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
