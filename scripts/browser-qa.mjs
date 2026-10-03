import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = process.env.AXONYX_UI_BASE_URL || 'http://127.0.0.1:3105';
const localBehavior = readFileSync(join(root, 'src', 'js', 'index.js'), 'utf8');
const browser = await chromium.launch({ headless: true });

async function run(name, viewport, check) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(/\/_ax\/pkg\/axonyx-ui\/js\/index\.[^/]+\.js$/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: localBehavior }));

  try {
    await check(page);
    assert.deepEqual(errors, [], `browser errors on ${name}`);
    console.log(`PASS ${name}`);
  } finally {
    await page.close();
  }
}

async function visit(page, route) {
  const response = await page.goto(`${baseUrl}${route}`);
  assert.equal(response?.status(), 200, `${route} should render`);
}

try {
  for (const [label, viewport] of [
    ['desktop', { width: 1280, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    await run(`Dialog ${label}`, viewport, async (page) => {
      await visit(page, '/components/dialog');
      const trigger = page.getByRole('button', { name: 'Open dialog' });
      const dialog = page.locator('#component-dialog');
      await trigger.click();
      assert.equal(await dialog.getAttribute('data-open'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close dialog');
      await page.keyboard.press('Escape');
      assert.equal(await dialog.getAttribute('data-open'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
    });

    await run(`Drawer ${label}`, viewport, async (page) => {
      await visit(page, '/components/drawer');
      const trigger = page.getByRole('button', { name: 'Open drawer' });
      const drawer = page.locator('#component-drawer');
      await trigger.click();
      assert.equal(await drawer.getAttribute('data-open'), 'true', 'plain drawer ID should open');
      assert.equal(await drawer.locator('[data-ax-drawer-close]').last().evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await drawer.getAttribute('data-open'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
      await trigger.evaluate((node) => node.setAttribute('data-ax-drawer-open', '#component-drawer'));
      await trigger.click();
      assert.equal(await drawer.getAttribute('data-open'), 'true', 'CSS selector should still open');
      await drawer.locator('[data-ax-drawer-close]').last().click();
      assert.equal(await drawer.getAttribute('data-open'), 'false');
    });

    await run(`Popover ${label}`, viewport, async (page) => {
      await visit(page, '/components/popover');
      const popover = page.locator('.ax-popover').first();
      const trigger = popover.locator('button').first();
      await trigger.focus();
      await page.keyboard.press('Enter');
      assert.equal(await popover.getAttribute('data-open'), 'true');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await popover.getAttribute('data-open'), 'false');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
    });

    await run(`Native form controls ${label}`, viewport, async (page) => {
      await visit(page, '/components/checkbox');
      const checkbox = page.locator('input[name="deploy_preview"]');
      assert.equal(await checkbox.isChecked(), false);
      await checkbox.check();
      assert.equal(await checkbox.isChecked(), true);
      await visit(page, '/components/select');
      const select = page.locator('select[name="theme"]');
      await select.selectOption('gold');
      assert.equal(await select.inputValue(), 'gold');
    });
  }
} finally {
  await browser.close();
}
