import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const baselineRef = process.env.AXONYX_UI_BASELINE_REF;
function stylesheet(ref) {
  const read = file => ref
    ? execFileSync('git', ['show', `${ref}:src/css/${file}`], { cwd: root, encoding: 'utf8' })
    : readFileSync(resolve(root, 'src/css', file), 'utf8');
  return read('index.css').replace(/@import '\.\/([^']+)';/g, (_, file) => read(file));
}
const css = stylesheet();
const baselineCss = baselineRef ? stylesheet(baselineRef) : null;
const markup = size => `<form id="fixture" style="max-width:560px;margin:auto">
  <div class="ax-field"><label for="name">Name</label><input class="ax-input" id="name" name="name" data-size="${size}"></div>
  <div class="ax-field"><label for="status">Status</label><select class="ax-select" id="status" name="status" data-size="${size}">
    <option value="draft">Draft</option><option value="published">Published</option><option value="locked" disabled>Locked</option>
  </select></div>
  <div class="ax-field"><label for="summary">Summary</label><textarea class="ax-textarea" id="summary" name="summary" data-size="${size}"></textarea></div>
</form>`;

async function geometry(page) {
  return page.evaluate(() => Object.fromEntries(['name', 'status', 'summary'].map(id => {
    const node = document.getElementById(id);
    const css = getComputedStyle(node);
    return [id, { height: node.getBoundingClientRect().height, padding: css.padding,
      radius: css.borderRadius, font: css.font, resize: css.resize }];
  })));
}

const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const style of ['plain', 'classic', 'alloy', 'forge']) {
      for (const palette of ['bronze', 'silver', 'gold']) {
        for (const size of ['sm', 'md', 'lg']) {
          const boundary = style === 'plain' ? '' : `data-foundry="${palette}" data-foundry-style="${style}"`;
          const html = styles => `<html ${boundary}><head><style>${styles}</style></head><body>${markup(size)}</body></html>`;
          let baseline;
          if (baselineCss) {
            await page.setContent(html(baselineCss));
            baseline = await geometry(page);
          }
          await page.setContent(html(css));
          if (baseline) assert.deepEqual(await geometry(page), baseline, `default changed: ${style}/${size}`);
          await page.locator('#fixture').evaluate(node => {
            node.style.cssText += ';--ax-input-min-height:44px;--ax-input-padding:0 12px;--ax-input-radius:6px;'
              + '--ax-select-min-height:48px;--ax-select-padding:0 36px 0 12px;--ax-select-radius:8px;'
              + '--ax-textarea-min-height:140px;--ax-textarea-padding:12px;--ax-textarea-radius:10px;--ax-textarea-resize:none';
          });
          const result = await geometry(page);
          assert.equal(result.name.height, 44);
          assert.equal(result.name.radius, '6px');
          assert.equal(result.status.height, 48);
          assert.equal(result.status.radius, '8px');
          assert.equal(result.status.padding, '0px 36px 0px 12px');
          assert.equal(result.summary.height, 140);
          assert.equal(result.summary.radius, '10px');
          assert.equal(result.summary.padding, '12px');
          assert.equal(result.summary.resize, 'none');
          await page.locator('#fixture').evaluate(node => {
            for (const key of ['--ax-select-min-height', '--ax-select-padding', '--ax-select-radius',
              '--ax-textarea-min-height', '--ax-textarea-padding', '--ax-textarea-radius', '--ax-textarea-resize']) {
              node.style.removeProperty(key);
            }
          });
          const inherited = await geometry(page);
          assert.equal(inherited.status.radius, '6px');
          assert.equal(inherited.status.padding, '0px 12px');
          assert.equal(inherited.summary.radius, '6px');
          assert.equal(inherited.summary.padding, '0px 12px');
          assert.equal(inherited.summary.resize, 'vertical');
          assert.deepEqual(await page.evaluate(() => ['status', 'summary'].map(id =>
            getComputedStyle(document.getElementById(id)).minHeight)), ['44px', '44px']);
          for (const id of ['name', 'status', 'summary']) {
            await page.locator(`label[for="${id}"]`).click();
            assert.equal(await page.locator(`#${id}`).evaluate(node => node === document.activeElement), true);
          }
          await page.locator('#name').fill('Foundry');
          await page.locator('#summary').fill('Editable summary');
          await page.locator('#status').selectOption('published');
          assert.deepEqual(await page.locator('#fixture').evaluate(node => Object.fromEntries(new FormData(node))),
            { name: 'Foundry', status: 'published', summary: 'Editable summary' });
          assert.equal(await page.locator('#status option[value="locked"]').evaluate(node => node.disabled), true);
          await page.locator('#summary').evaluate(node => { node.disabled = true; });
          assert.equal(await page.locator('#fixture').evaluate(node => new FormData(node).has('summary')), false);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          console.log(`PASS form geometry ${width}px ${style}/${palette}/${size}${baseline ? ' + baseline' : ''}`);
        }
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally {
  await browser.close();
}
