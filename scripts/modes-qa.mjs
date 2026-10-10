import assert from 'node:assert/strict';
import { resolve, extname, sep } from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

function luminance(color) {
  const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
    const channel = value / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}

const root = resolve('src');
const server = createServer(async (request, response) => {
  try {
    const path = resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    if (!path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(path);
    response.setHeader('Content-Type', { '.css': 'text/css', '.js': 'application/javascript' }[extname(path)] || 'text/html');
    response.end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/showroom/light-dashboard.html`);
    for (const style of ['classic', 'alloy', 'forge']) {
      for (const palette of ['silver', 'bronze', 'gold']) {
        await page.selectOption('#style', style);
        await page.selectOption('#palette', palette);
        for (const mode of ['light', 'dark']) {
          await page.selectOption('#mode', mode);
          const values = await page.evaluate(() => {
            const read = selector => {
              const node = document.querySelector(selector);
              const css = getComputedStyle(node);
              return { color: css.color, background: css.backgroundColor, scheme: css.colorScheme,
                radius: css.borderRadius, padding: css.padding, height: node.getBoundingClientRect().height };
            };
            return { root: read('.pilot'), card: read('.ax-card'), input: read('#title'),
              select: read('#status'), primary: read('[data-variant="primary"]'), danger: read('[data-variant="danger"]'),
              muted: read('.pilot-note'), overflow: document.documentElement.scrollWidth > innerWidth };
          });
          assert.equal(values.root.scheme, mode);
          assert.equal(values.select.scheme, mode);
          assert.equal(values.overflow, false, `${width}/${style}/${palette}/${mode} overflow`);
          if (mode === 'light') {
            for (const [name, foreground, background] of [
              ['body', values.root.color, values.root.background],
              ['input', values.input.color, values.input.background],
              ['muted', values.muted.color, values.root.background],
              ['primary', values.primary.color, values.primary.background],
              ['danger', values.danger.color, values.danger.background],
            ]) {
              assert.ok(contrast(foreground, background) >= 4.5, `${style}/${palette} ${name} contrast`);
            }
            assert.equal(values.input.background, 'rgb(255, 255, 255)');
            assert.equal(values.card.background, 'rgb(255, 255, 255)');
          } else {
            // An explicit dark mode must match the pre-existing package recipes.
            const baseline = await page.evaluate(() => {
              const imports = [...document.querySelector('link').sheet.cssRules];
              const modes = imports.find(rule => rule.href?.endsWith('modes.css')).styleSheet;
              modes.disabled = true;
              const selectors = ['.pilot', '.ax-card', '#title', '#status', '[data-variant="primary"]'];
              const read = () => selectors.map(selector => {
                const css = getComputedStyle(document.querySelector(selector));
                return [css.color, css.backgroundColor, css.backgroundImage, css.boxShadow, css.borderRadius, css.padding];
              });
              const before = read();
              modes.disabled = false;
              const after = read();
              document.querySelector('.pilot').removeAttribute('data-foundry-mode');
              const omitted = read();
              return { before, after, omitted };
            });
            assert.deepEqual(baseline.after, baseline.before);
            assert.deepEqual(baseline.omitted, baseline.before);
          }
          await page.fill('#title', 'Editable content');
          await page.selectOption('#status', 'Published');
          assert.equal(await page.inputValue('#title'), 'Editable content');
          assert.equal(await page.inputValue('#status'), 'Published');
          console.log(`PASS ${width}px ${style}/${palette}/${mode}`);
        }
      }
    }
    await page.selectOption('#style', 'classic');
    await page.selectOption('#palette', 'silver');
    await page.selectOption('#mode', 'light');
    await page.evaluate(() => {
      const nested = document.createElement('div');
      nested.id = 'nested';
      nested.dataset.foundry = 'gold';
      nested.dataset.foundryStyle = 'classic';
      nested.innerHTML = '<button class="ax-button" data-variant="primary">Nested dark</button>';
      document.querySelector('.pilot-main').append(nested);
    });
    assert.equal(await page.locator('#nested').evaluate(node => getComputedStyle(node).colorScheme), 'dark');
    assert.equal(await page.locator('#nested button').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(224, 185, 75)');
    await page.locator('#nested').evaluate(node => node.remove());
    assert.deepEqual(errors, []);
    const screenshot = resolve(tmpdir(), `legura-foundry-light-${width}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log(`Screenshot: ${screenshot}`);
    await page.close();
  }

  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const style of ['classic', 'alloy', 'forge']) {
      for (const palette of ['silver', 'bronze', 'gold']) {
        for (const mode of ['light', 'dark']) {
          await page.goto(`http://127.0.0.1:${server.address().port}/showroom/mode-controls.html`);
          await page.locator('main').evaluate((node, values) => {
            node.dataset.foundry = values.palette;
            node.dataset.foundryStyle = values.style;
            node.dataset.foundryMode = values.mode;
          }, { palette, style, mode });
          const assertSurface = async (selector) => {
            assert.equal(await page.locator(selector).isVisible(), true, selector);
            const values = await page.locator(selector).evaluate(node => {
              const css = getComputedStyle(node);
              const rect = node.getBoundingClientRect();
              return { color: css.color, background: css.backgroundColor, left: rect.left, right: rect.right };
            });
            assert.ok(values.left >= 0 && values.right <= width, `${selector} exceeds viewport`);
            if (mode === 'light') {
              assert.equal(values.background, 'rgb(255, 255, 255)', `${selector} light surface`);
              assert.ok(contrast(values.color, values.background) >= 4.5, `${selector} contrast`);
            }
          };
          await page.locator('#menu button').first().focus();
          await page.keyboard.press('ArrowDown');
          await assertSurface('.ax-dropdown__menu');
          assert.equal(await page.locator('.ax-dropdown__item').first().evaluate(node => node === document.activeElement), true);
          await page.keyboard.press('ArrowDown');
          assert.equal(await page.locator('.ax-dropdown__item').last().evaluate(node => node === document.activeElement), true);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.ax-dropdown__menu').isVisible(), false);
          assert.equal(await page.locator('.ax-dropdown__trigger').evaluate(node => node === document.activeElement), true);
          await page.locator('#popover > button').click();
          await assertSurface('.ax-popover__content');
          await page.setViewportSize({ width: width === 390 ? 320 : 1280, height: 1000 });
          await page.waitForFunction(() => {
            const rect = document.querySelector('.ax-popover__content').getBoundingClientRect();
            return rect.left >= 0 && rect.right <= innerWidth;
          });
          await page.setViewportSize({ width, height: 1000 });
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.ax-popover__content').isVisible(), false);
          await page.locator('#tooltip button').focus();
          assert.equal(await page.locator('.ax-tooltip__content').evaluate(node => getComputedStyle(node).opacity), '1');
          await assertSurface('.ax-tooltip__content');
          await page.locator('[data-ax-dialog-open]').click();
          await assertSurface('.ax-dialog__panel');
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('#confirm').isVisible(), false);
          assert.equal(await page.locator('[data-ax-dialog-open]').evaluate(node => node === document.activeElement), true);
          await page.locator('[data-ax-drawer-open]').click();
          await assertSurface('.ax-drawer__panel');
          await page.locator('#tools button').click();
          assert.equal(await page.locator('#tools').isVisible(), false);
          assert.equal(await page.locator('[data-ax-drawer-open]').evaluate(node => node === document.activeElement), true);
          await page.locator('#featured').check();
          assert.equal(await page.locator('#featured').isChecked(), true);
          await page.locator('input[value="private"]').check();
          assert.equal(await page.locator('input[value="public"]').isChecked(), false);
          await page.locator('#switch').focus();
          await page.keyboard.press('Space');
          assert.equal(await page.locator('#switch').isChecked(), true);
          if (mode === 'light') {
            await page.locator('.ax-alert').evaluate(node => {
              const css = getComputedStyle(node);
              if (css.backgroundColor !== 'rgb(255, 255, 255)') throw new Error('Alert surface must be light');
            });
            await page.locator('main').evaluate(node => {
              const nested = document.createElement('div');
              nested.dataset.foundry = 'silver';
              nested.dataset.foundryStyle = 'alloy';
              nested.innerHTML = '<button class="ax-button" data-variant="danger">Nested danger</button>';
              node.append(nested);
              const color = getComputedStyle(nested).getPropertyValue('--ax-danger').trim();
              nested.remove();
              if (color !== '#ff6b6b') throw new Error('Light status tokens leaked into nested dark boundary');
            });
          }
          await page.locator('#range').focus();
          await page.keyboard.press('ArrowRight');
          assert.equal(await page.locator('#range').inputValue(), '41');
          await page.locator('.ax-toast__close').click();
          assert.equal(await page.locator('#toast').count(), 0);
          assert.equal(await page.locator('button:disabled').last().isDisabled(), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          console.log(`PASS controls ${width}px ${style}/${palette}/${mode}`);
        }
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
