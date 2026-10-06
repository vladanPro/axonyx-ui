import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = process.env.AXONYX_UI_BASE_URL || 'http://127.0.0.1:3105';
const localBehavior = readFileSync(join(root, 'src', 'js', 'index.js'), 'utf8');
const usePackageBehavior = process.env.AXONYX_UI_USE_PACKAGE_JS === '1';
const useSourceCss = process.env.AXONYX_UI_USE_SOURCE_CSS === '1';
const checkCssFix = process.env.AXONYX_UI_CHECK_CSS_FIX === '1';
const browser = await chromium.launch({ headless: true });

async function run(name, viewport, check, options = {}) {
  const page = await browser.newPage({ viewport, ...options });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  if (!usePackageBehavior) {
    await page.route(/\/_ax\/pkg\/axonyx-ui\/js\/index\.[^/]+\.js$/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: localBehavior }));
  }

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
  if (useSourceCss) {
    for (const file of ['component-example.css', 'dropdown.css', 'foundry.css']) {
      await page.addStyleTag({ content: readFileSync(join(root, 'src', 'css', file), 'utf8') });
    }
  }
}

try {
  for (const [label, viewport] of [
    ['desktop', { width: 1280, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    for (const javaScriptEnabled of [true, false]) {
      const mode = javaScriptEnabled ? 'JS' : 'no-JS';
      await run(`Checkbox form ${label} ${mode}`, viewport, async (page) => {
        await visit(page, '/components/checkbox');
        const form = page.locator('#checkbox-settings form');
        const preview = form.getByRole('checkbox', { name: 'Create a deploy preview', exact: true });
        const checks = form.getByRole('checkbox', { name: 'Run Foundry checks', exact: true });
        const unavailable = form.getByRole('checkbox', { name: 'Notify the project team (unavailable)', exact: true });
        assert.equal(await preview.isChecked(), false);
        assert.equal(await checks.isChecked(), true);
        assert.equal(await unavailable.isChecked(), true);
        assert.equal(await unavailable.isDisabled(), true);
        assert.equal(await preview.getAttribute('checked'), null);
        assert.equal(await preview.getAttribute('disabled'), null);
        assert.deepEqual(await form.evaluate((node) => [...new FormData(node)]), [['run_checks', 'on']]);
        await form.locator('label').filter({ hasText: 'Create a deploy preview' }).click();
        assert.equal(await preview.isChecked(), true, 'label should toggle its checkbox');
        await checks.focus();
        await page.keyboard.press('Space');
        assert.equal(await checks.isChecked(), false);
        assert.deepEqual(await form.evaluate((node) => [...new FormData(node)]), [['deploy_preview', 'on']]);
        await form.getByRole('button', { name: 'Reset settings' }).click();
        assert.equal(await preview.isChecked(), false);
        assert.equal(await checks.isChecked(), true);
        await preview.check();
        await checks.uncheck();
        const response = await Promise.all([
          page.waitForNavigation(),
          form.getByRole('button', { name: 'Preview settings' }).click(),
        ]);
        assert.equal(response[0]?.status(), 200);
        const url = new URL(page.url());
        assert.equal(url.pathname, '/components/checkbox');
        assert.equal(url.hash, '#checkbox-settings');
        assert.deepEqual([...url.searchParams], [['deploy_preview', 'on']]);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }, { javaScriptEnabled });

      await run(`Radio form ${label} ${mode}`, viewport, async (page) => {
        await visit(page, '/components/radio');
        const form = page.locator('#radio-settings form');
        const site = form.getByRole('radio', { name: 'Site', exact: true });
        const docs = form.getByRole('radio', { name: 'Docs', exact: true });
        const blog = form.getByRole('radio', { name: 'Blog', exact: true });
        assert.equal(await docs.isChecked(), true);
        assert.equal(await site.getAttribute('checked'), null);
        assert.equal(await site.getAttribute('disabled'), null);
        assert.equal(await form.getByRole('radio', { name: 'Portfolio (unavailable)', exact: true }).isDisabled(), true);
        await docs.focus();
        await page.keyboard.press('ArrowDown');
        assert.equal(await blog.isChecked(), true, 'arrow key should skip disabled Portfolio');
        assert.equal(await docs.isChecked(), false, 'group must remain exclusive');
        assert.equal(await blog.evaluate((node) => node === document.activeElement), true);
        await page.keyboard.press('ArrowUp');
        assert.equal(await docs.isChecked(), true);
        await form.locator('label').filter({ hasText: /^Site$/ }).click();
        assert.equal(await site.isChecked(), true, 'native label should select its radio');
        assert.deepEqual(await form.evaluate((node) => [...new FormData(node)]), [['template', 'site']]);
        await form.getByRole('button', { name: 'Reset template' }).click();
        assert.equal(await docs.isChecked(), true);
        assert.equal(await site.isChecked(), false);
        await page.getByRole('radio', { name: 'Compact', exact: true }).check();
        assert.equal(await page.getByRole('radio', { name: 'Left', exact: true }).isChecked(), true);
        assert.equal(await docs.isChecked(), true, 'other group choices must remain unchanged');
        await blog.check();
        const response = await Promise.all([
          page.waitForNavigation(),
          form.getByRole('button', { name: 'Preview template' }).click(),
        ]);
        assert.equal(response[0]?.status(), 200);
        const url = new URL(page.url());
        assert.equal(url.pathname, '/components/radio');
        assert.equal(url.hash, '#radio-settings');
        assert.deepEqual([...url.searchParams], [['template', 'blog']]);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }, { javaScriptEnabled });
    }
  }

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
      assert.equal(await menu.locator('[role="menu"]').count(), 0, 'navigation links must keep native link semantics');
      if (checkCssFix) {
        const bounds = await menu.locator('.ax-dropdown__menu').evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return { left: rect.left, right: rect.right, viewport: window.innerWidth };
        });
        assert.ok(bounds.left >= 7 && bounds.right <= bounds.viewport - 7, 'dropdown must stay inside the viewport');
      }
      if (checkCssFix) {
        await menu.locator('.ax-dropdown__menu').scrollIntoViewIfNeeded();
        assert.equal(await menu.locator('.ax-dropdown__menu').evaluate((node) => {
          const rect = node.getBoundingClientRect();
          return node.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.bottom - 8));
        }), true, 'open dropdown must be hit-testable beyond the preview boundary');
      }
      const items = menu.locator('.ax-dropdown__item');
      await page.keyboard.press('Tab');
      assert.equal(await items.first().evaluate((node) => node === document.activeElement), true, 'Tab should enter native links');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('ArrowDown');
      assert.equal(await items.nth(0).evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('ArrowDown');
      assert.equal(await items.nth(1).evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('ArrowUp');
      assert.equal(await items.first().evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('End');
      assert.equal(await items.last().evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('Home');
      assert.equal(await items.first().evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('data-open'), 'false');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('ArrowUp');
      assert.equal(await menu.getAttribute('data-open'), 'true');
      assert.equal(await items.last().evaluate((node) => node === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await menu.getAttribute('data-open'), 'false', 'leaving the dropdown should close it');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.evaluate((node) => node.contains(document.activeElement)), false);
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
      const initialNotifyChecked = await notify.isChecked();
      await notify.focus();
      assert.equal(await notify.evaluate((node) => node === document.activeElement), false, 'disabled checkbox must not receive focus');
      await notify.evaluate((node) => node.parentElement.click());
      assert.equal(await notify.isChecked(), initialNotifyChecked, 'disabled checkbox must not toggle from its label');
      await visit(page, '/components/select');
      const select = page.locator('select[name="theme"]');
      await select.selectOption('gold');
      assert.equal(await select.inputValue(), 'gold');
    });

    await run(`Form contract ${label}`, viewport, async (page) => {
      await visit(page, '/components/forms');
      const name = page.locator('input[name="project_name"]');
      const fieldLabel = page.locator('label[for="settings-name"]');
      assert.equal(await page.locator('.ax-field').first().evaluate((node) => node.tagName), 'DIV');
      assert.equal(await page.locator('label label').count(), 0, 'form labels must not be nested');
      assert.equal(await name.getAttribute('aria-describedby'), 'settings-name-hint');
      assert.equal(await page.locator('#settings-name-hint').textContent(), 'Required for the project.');
      assert.equal(await name.evaluate((node) => node.required), true);
      assert.equal(await name.evaluate((node) => node.checkValidity()), false);
      await fieldLabel.click();
      assert.equal(await name.evaluate((node) => node === document.activeElement), true);
      await name.fill('Blockbit');
      assert.equal(await name.evaluate((node) => node.checkValidity()), true);
      await visit(page, '/components/form');
      const editor = page.locator('#cms-editor form');
      assert.equal(await editor.locator('textarea[name="summary"]').isDisabled(), false);
      assert.equal(await editor.locator('input[name="post_id"]').isDisabled(), true);
      const values = await editor.evaluate((node) => Object.fromEntries(new FormData(node)));
      assert.equal('post_id' in values, false, 'disabled record ID must not be submitted');
      await visit(page, '/components/input');
      assert.equal(await page.locator('input[name="build_id"]').isDisabled(), true);
    });

    for (const javaScriptEnabled of [true, false]) {
      await run(`Select option flags ${label} ${javaScriptEnabled ? 'JS' : 'no JS'}`, viewport, async (page) => {
        await visit(page, '/components/select');
        const form = page.locator('#option-form form');
        const select = form.locator('select[name="status"]');
        assert.equal(await select.inputValue(), 'published', 'selected prop should choose a non-first option');
        assert.equal(await select.locator('option[value="published"]').evaluate((node) => node.defaultSelected), true);
        assert.equal(await select.locator('option[value="archived"]').evaluate((node) => node.disabled), true);
        const draft = select.locator('option[value="draft"]');
        assert.equal(await draft.getAttribute('selected'), null, 'selected=false must omit the boolean attribute');
        assert.equal(await draft.getAttribute('disabled'), null, 'disabled=false must omit the boolean attribute');
        await select.focus();
        await page.keyboard.press('ArrowDown');
        assert.equal(await select.inputValue(), 'scheduled', 'keyboard should skip the disabled archived option');
        await page.keyboard.press('ArrowUp');
        assert.equal(await select.inputValue(), 'published');
        await select.selectOption('draft');
        await form.getByRole('button', { name: 'Reset selection' }).click();
        assert.equal(await select.inputValue(), 'published', 'reset should restore the selected prop');
        await select.selectOption('scheduled');
        const values = await form.evaluate((node) => Object.fromEntries(new FormData(node)));
        assert.deepEqual(values, { status: 'scheduled' });
        const loaded = page.waitForResponse((response) => response.request().isNavigationRequest() && new URL(response.url()).pathname === '/components/select');
        await form.getByRole('button', { name: 'Preview selection' }).click();
        const response = await loaded;
        assert.equal(response.status(), 200);
        assert.equal(response.request().method(), 'GET');
        await page.waitForLoadState();
        assert.equal(new URL(page.url()).searchParams.get('status'), 'scheduled');

        const requiredForm = page.locator('#required-select-preview form');
        const category = requiredForm.locator('select[name="category"]');
        assert.equal(await category.inputValue(), '');
        assert.equal(await category.locator('option[value=""]').evaluate((node) => node.disabled && node.defaultSelected), true);
        assert.equal(await category.evaluate((node) => node.validity.valueMissing), true);
        const before = page.url();
        await requiredForm.getByRole('button', { name: 'Preview category' }).click();
        assert.equal(page.url(), before, 'disabled placeholder must not satisfy required validation');
        await category.selectOption('news');
        assert.equal(await category.evaluate((node) => node.checkValidity()), true);
        assert.equal(await requiredForm.locator('select[name="locale"]').isDisabled(), true);
        assert.deepEqual(await requiredForm.evaluate((node) => Object.fromEntries(new FormData(node))), { category: 'news' });
      }, { javaScriptEnabled });
    }

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
      assert.equal(await docs.isChecked(), true, 'checked prop should select the initial radio');
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

    if (checkCssFix) {
      await run(`Field focus ${label}`, viewport, async (page) => {
        await visit(page, '/components/field');
        for (const [id, token] of [['project-name', '--ax-primary'], ['email', '--ax-danger']]) {
          const input = page.locator(`#${id}`);
          await input.focus();
          const style = await input.evaluate((node, colorToken) => {
            const probe = document.createElement('span');
            probe.style.color = `var(${colorToken})`;
            document.body.append(probe);
            const result = {
              outline: getComputedStyle(node).outlineStyle,
              border: getComputedStyle(node).borderColor,
              expected: getComputedStyle(probe).color,
            };
            probe.remove();
            return result;
          }, token);
          assert.equal(style.outline, 'none', `${id} should not have an outer focus frame`);
          assert.equal(style.border, style.expected, `${id} should use its semantic focus border`);
        }
      });
    }
  }
} finally {
  await browser.close();
}
