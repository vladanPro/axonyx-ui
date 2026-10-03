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

    await run(`AlertDialog ${label}`, viewport, async (page) => {
      await visit(page, '/components/alert-dialog');
      const trigger = page.getByRole('button', { name: 'Delete project' }).first();
      const dialog = page.locator('#delete-project-dialog');
      await trigger.click();
      assert.equal(await dialog.getAttribute('data-open'), 'true');
      assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()), 'Cancel');
      await dialog.locator('.ax-dialog__backdrop').click({ force: true });
      assert.equal(await dialog.getAttribute('data-open'), 'true', 'backdrop must not dismiss a destructive confirmation');
      await page.keyboard.press('Escape');
      assert.equal(await dialog.getAttribute('data-open'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
    });

    await run(`DropdownMenu ${label}`, viewport, async (page) => {
      await visit(page, '/components/dropdown-menu');
      const menu = page.locator('.ax-dropdown').first();
      const trigger = menu.locator('button').first();
      await trigger.focus();
      await page.keyboard.press('Enter');
      assert.equal(await menu.getAttribute('data-open'), 'true');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      assert.equal(await menu.locator('a[href="/components"]').count(), 1);
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('data-open'), 'false');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
    });

    await run(`Combobox ${label}`, viewport, async (page) => {
      await visit(page, '/components/combobox');
      const input = page.getByRole('combobox', { name: 'Project environment' });
      assert.equal(await input.getAttribute('list'), 'environment-options');
      assert.equal(await page.locator('#environment-options option').count(), 3);
      await input.fill('Production');
      assert.equal(await input.inputValue(), 'Production');
    });

    await run(`Native form controls ${label}`, viewport, async (page) => {
      await visit(page, '/components/checkbox');
      const checkbox = page.locator('input[name="deploy_preview"]');
      assert.equal(await checkbox.isChecked(), false);
      await checkbox.check();
      assert.equal(await checkbox.isChecked(), true);
      const checks = page.locator('input[name="run_checks"]');
      const notify = page.locator('input[name="notify_team"]');
      assert.equal(await checks.isChecked(), true);
      assert.equal(await notify.isDisabled(), true);
      await notify.focus();
      assert.equal(await notify.evaluate((node) => node === document.activeElement), false, 'disabled checkbox must not receive focus');
      await notify.evaluate((node) => node.parentElement.click());
      assert.equal(await notify.isChecked(), false, 'disabled checkbox must not toggle from its label');
      await visit(page, '/components/select');
      const select = page.locator('select[name="theme"]');
      await select.selectOption('gold');
      assert.equal(await select.inputValue(), 'gold');
    });

    await run(`Form contract ${label}`, viewport, async (page) => {
      await visit(page, '/components/forms');
      const name = page.locator('input[name="name"]');
      const label = page.locator('label[for="name"]');
      assert.equal(await page.locator('.ax-field').first().evaluate((node) => node.tagName), 'DIV');
      assert.equal(await page.locator('label label').count(), 0, 'form labels must not be nested');
      assert.equal(await name.getAttribute('aria-describedby'), 'name-hint');
      assert.equal(await page.locator('#name-hint').textContent(), 'Required for the project.');
      assert.equal(await name.evaluate((node) => node.required), true);
      assert.equal(await name.evaluate((node) => node.checkValidity()), false);
      await label.click();
      assert.equal(await name.evaluate((node) => node === document.activeElement), true);
      await name.fill('Blockbit');
      assert.equal(await name.evaluate((node) => node.checkValidity()), true);
      assert.equal(await page.locator('textarea[name="notes"]').isDisabled(), true);
      assert.equal(await page.locator('select[name="type"]').evaluate((node) => node.required), true);
      assert.equal(await page.locator('select[name="region"]').isDisabled(), true);
      await visit(page, '/components/input');
      assert.equal(await page.locator('input[name="build_id"]').isDisabled(), true);
    });

    await run(`Switch ${label}`, viewport, async (page) => {
      await visit(page, '/components/switch');
      const streaming = page.locator('input[name="streaming"]');
      const drafts = page.locator('input[name="drafts"]');
      const notifications = page.locator('input[name="notifications"]');
      assert.equal(await streaming.isChecked(), true, 'checked prop should reach the native input');
      assert.equal(await drafts.isChecked(), false);
      await streaming.click();
      assert.equal(await streaming.isChecked(), false);
      await drafts.focus();
      await page.keyboard.press('Space');
      assert.equal(await drafts.isChecked(), true, 'Space should toggle a focused switch');
      assert.equal(await notifications.isDisabled(), true);
      await notifications.focus();
      assert.equal(await notifications.evaluate((node) => node === document.activeElement), false, 'disabled switch must not receive focus');
      await notifications.evaluate((node) => node.parentElement.click());
      assert.equal(await notifications.isChecked(), false, 'disabled switch must not toggle from its label');
    });

    await run(`Radio ${label}`, viewport, async (page) => {
      await visit(page, '/components/radio');
      const site = page.locator('input[name="template"][value="site"]');
      const docs = page.locator('input[name="template"][value="docs"]');
      const blog = page.locator('input[name="template"][value="blog"]');
      const portfolio = page.locator('input[name="template"][value="portfolio"]');
      assert.equal(await site.isChecked(), true, 'checked prop should select the initial radio');
      assert.equal(await portfolio.isDisabled(), true);
      await blog.click();
      assert.equal(await blog.isChecked(), true);
      assert.equal(await site.isChecked(), false, 'radio group should be mutually exclusive');
      await docs.focus();
      await page.keyboard.press('Space');
      assert.equal(await docs.isChecked(), true, 'Space should select a focused radio');
      assert.equal(await blog.isChecked(), false);
      await page.keyboard.press('ArrowRight');
      assert.equal(await blog.isChecked(), true, 'arrow key should move within the radio group');
      await page.keyboard.press('ArrowRight');
      assert.equal(await site.isChecked(), true, 'arrow key should skip disabled radio and wrap');
      assert.equal(await portfolio.isChecked(), false);
    });
  }
} finally {
  await browser.close();
}
