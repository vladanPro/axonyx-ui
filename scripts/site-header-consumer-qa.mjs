// Browser plugin not available; reuse existing test-only Playwright tooling.
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = process.env.AX_HEADER_QA_URL;
const flavor = process.env.AX_HEADER_QA_SITE;
assert.ok(base, 'AX_HEADER_QA_URL is required');
const scenarios = {
  react: [['/', null], ['/docs/getting-started', 'Docs'], ['/components/button', 'Docs'], ['/donate', 'Donate']],
  main: [['/', null], ['/docs/getting-started', 'Docs'], ['/roadmap', 'Roadmap'], ['/donate', 'Donate']],
  ui: [['/', null], ['/docs/installation', 'Docs'], ['/components/button', 'Components'], ['/blocks/docs-01', 'Blocks']],
}[flavor];
assert.ok(scenarios, 'AX_HEADER_QA_SITE must be react, main or ui');
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 820, 1024, 1440]) {
    for (const javaScriptEnabled of [true, false]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        for (const [route, label] of scenarios) {
          assert.equal((await page.goto(base + route)).status(), 200);
          const header = page.locator('header.ax-site-header');
          assert.equal(await header.count(), 1);
          const toggle = header.locator('.ax-site-header__toggle');
          const nav = header.locator('.ax-site-header__links');
          if (javaScriptEnabled) {
            await page.waitForFunction(() => document.querySelector('.ax-site-header__toggle')?.dataset.ready === 'true');
          }
          if (javaScriptEnabled && width <= 820) {
            assert.equal(await nav.isVisible(), false);
            await toggle.click();
            assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
          }
          assert.ok(await nav.isVisible());
          const active = nav.locator('a:is([aria-current="page"], [aria-current="true"])');
          assert.equal(await active.count(), label ? 1 : 0, `${flavor} ${route}: selected link count`);
          if (label) {
            assert.equal((await active.innerText()).trim(), label);
            const style = await active.evaluate(node => {
              const css = getComputedStyle(node);
              return { radius: css.borderRadius, weight: css.fontWeight, shadow: css.boxShadow,
                signal: getComputedStyle(node, '::after').height };
            });
            assert.equal(style.radius, '11px');
            assert.equal(style.weight, '800');
            assert.equal(style.signal, '2px');
            assert.notEqual(style.shadow, 'none');
          }
          const logo = header.locator('.ax-site-header__logo');
          assert.equal(await logo.evaluate(node => getComputedStyle(node).width), '32px');
          assert.equal(await header.evaluate(node => getComputedStyle(node).position), 'sticky');
          assert.ok(await header.evaluate(node => {
            const rect = node.getBoundingClientRect();
            return rect.left >= 0 && rect.right <= innerWidth && node.scrollWidth <= innerWidth;
          }), `${flavor} ${route} ${width}px: header overflow`);
          if (route.includes('/docs/') && javaScriptEnabled && [390, 1440].includes(width)) {
            await page.screenshot({ path: resolve(tmpdir(), `axonyx-header-${flavor}-${width}.png`) });
          }
          if (javaScriptEnabled && width <= 820) {
            await nav.locator('a').first().focus();
            await page.keyboard.press('Escape');
            assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
            assert.equal(await nav.isVisible(), false);
            assert.ok(await toggle.evaluate(node => node === document.activeElement));
          }
          assert.deepEqual(errors, []);
          console.log(`PASS ${flavor} header ${route} ${width}px ${javaScriptEnabled ? 'JS' : 'no-JS'}`);
        }
      } finally { await page.close(); }
    }
  }
} finally { await browser.close(); }
