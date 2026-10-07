import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const base = process.env.AXONYX_UI_BASE_URL || 'http://127.0.0.1:3105';
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    for (const javaScriptEnabled of [true, false]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        const response = await page.goto(base + '/blocks/settings-01');
        assert.equal(response.status(), 200);
        assert.match(await page.title(), /Axonyx UI/);
        const block = page.locator('#catalog-settings');
        const form = block.getByRole('form', { name: 'Workspace settings form' });
        assert.equal(await block.locator('main').count(), 0);
        const nav = block.locator('details');
        await nav.locator('summary').click();
        assert.equal(await nav.locator('nav').isVisible(), false);
        await nav.locator('summary').click();
        assert.equal(await nav.locator('nav').isVisible(), true);
        await form.locator('[name="workspace"]').fill('');
        assert.equal(await form.evaluate(node => node.checkValidity()), false);
        await form.locator('[name="workspace"]').fill('Public sample');
        await form.locator('[name="email"]').fill('bad-email');
        assert.equal(await form.evaluate(node => node.checkValidity()), false);
        await form.getByRole('button', { name: 'Reset fields' }).click();
        assert.equal(await form.locator('[name="workspace"]').inputValue(), 'Axonyx Site');
        assert.equal(await form.locator('[name="email"]').inputValue(), 'builder@example.com');
        assert.equal(await block.getByRole('button', { name: 'Archive unavailable in demo' }).isDisabled(), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await form.locator('[name="slug"]').fill('admin');
        const rejected = page.waitForResponse(r => r.url().includes('/__axonyx/action') && r.request().method() === 'POST');
        await form.getByRole('button', { name: 'Validate settings' }).click();
        const invalid = await rejected;
        assert.equal(invalid.status(), 422);
        if (javaScriptEnabled) {
          await form.locator('[data-ax-field-error="slug"]').filter({ hasText: 'reserves the slug admin' }).waitFor();
          assert.equal(await form.locator('[name="slug"]').getAttribute('aria-invalid'), 'true');
          assert.equal(await form.locator('[name="slug"]').inputValue(), 'admin');
          await form.locator('[name="slug"]').fill('public-sample');
          const accepted = page.waitForResponse(r => r.url().includes('/__axonyx/action') && r.request().method() === 'POST');
          await form.getByRole('button', { name: 'Validate settings' }).click();
          assert.equal((await accepted).status(), 200);
          await form.locator('.ax-action-status[data-state="complete"]').waitFor();
          await page.getByText('Last accepted request: validated only, no data saved.', { exact: true }).waitFor();
          assert.equal(await form.locator('[data-ax-field-error="slug"]').textContent(), '');
          assert.notEqual(await form.locator('[name="slug"]').getAttribute('aria-invalid'), 'true');
          assert.equal(new URL(page.url()).pathname, '/blocks/settings-01');
          assert.equal(await form.getByRole('button', { name: 'Validate settings' }).isEnabled(), true);
        } else {
          await page.waitForLoadState();
          await page.getByText('The demo reserves the slug admin. Choose another slug.', { exact: true }).waitFor();
          assert.equal(await form.locator('[name="slug"]').getAttribute('aria-invalid'), 'true');
          await page.goto(base + '/blocks/settings-01');
          await form.locator('[name="slug"]').fill('public-sample');
          const accepted = page.waitForResponse(r => r.url().includes('/__axonyx/action') && r.request().method() === 'POST');
          await form.getByRole('button', { name: 'Validate settings' }).click();
          const ok = await accepted;
          assert.ok([200, 302, 303].includes(ok.status()), 'native POST should complete successfully');
          await page.waitForLoadState();
          await block.getByRole('heading', { name: 'Settings', exact: true }).waitFor();
          assert.equal(await form.locator('[data-ax-field-error="slug"]').textContent(), '');
        }
        for (const style of ['classic', 'alloy', 'forge']) {
          for (const palette of ['bronze', 'silver', 'gold']) {
            await page.locator('html').evaluate((node, values) => {
              node.dataset.foundryStyle = values.style;
              node.dataset.theme = values.palette;
            }, { style, palette });
            await block.evaluate(node => {
              node.closest('[data-foundry-style]').dataset.foundryStyle = document.documentElement.dataset.foundryStyle;
              node.closest('[data-foundry]').dataset.foundry = document.documentElement.dataset.theme;
            });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          }
        }
        await page.locator('html').evaluate(node => { node.dataset.theme = 'bronze'; node.dataset.foundryStyle = 'classic'; });
        await block.evaluate(node => {
          node.closest('[data-foundry-style]').dataset.foundryStyle = 'classic';
          node.closest('[data-foundry]').dataset.foundry = 'bronze';
        });
        await page.locator('.site-nav').evaluate(node => node.style.visibility = 'hidden');
        await block.screenshot({ path: join(tmpdir(), `axonyx-settings-${width}-${javaScriptEnabled ? 'js' : 'no-js'}.png`) });
        assert.deepEqual(errors, []);
        console.log(`PASS Settings ${width}px ${javaScriptEnabled ? 'JS' : 'no-JS'} validation -> error -> success`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
