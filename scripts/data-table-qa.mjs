import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const read = path => readFileSync(resolve(path), 'utf8');
const css = read('src/css/index.css').replace(/@import '\.\/([^']+)';/g,
  (_, file) => read(`src/css/${file}`));
const behavior = read('src/js/index.js');
const records = [['Alpha', 'Published'], ['Echo', 'Draft'], ['Bravo', 'Published'], ['Delta', 'Draft'], ['Charlie', 'Published']];
const fixture = `<section class="ax-data-table" data-ax-data-table data-page-size="2" aria-label="Content inventory">
  <div data-ax-table-controls hidden><label>Search posts<input type="search" data-ax-table-search></label></div>
  <div class="ax-table-wrap"><table class="ax-table"><caption>Posts</caption>
    <thead><tr><th data-ax-sort="text">Title</th><th data-ax-sort="text">Status</th></tr></thead>
    <tbody>${records.map(([title, status]) => `<tr><td>${title === 'Alpha' ? '<a href="#alpha">Alpha</a>' : title}</td><td>${status}</td></tr>`).join('')}</tbody>
  </table></div><p data-ax-table-empty hidden>No matching records.</p>
  <div data-ax-table-controls hidden><span role="status" data-ax-table-status></span>
    <button type="button" data-ax-table-previous>Previous</button><button type="button" data-ax-table-next>Next</button>
  </div></section>`;
const html = process.env.AXONYX_UI_DATA_TABLE_HTML ? read(process.env.AXONYX_UI_DATA_TABLE_HTML) : fixture;
const browser = await chromium.launch();
try {
  for (const width of [1280, 390]) {
    for (const javaScriptEnabled of [true, false]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled });
      try {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        // Remove asset tags: inject current package CSS/runtime, not stale fixture assets.
        const clean = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<link\b[^>]*>/gi, '');
        await page.route('http://data-table.test/**', route => route.fulfill({
          contentType: 'text/html', body: `<style>${css}</style>${clean}`,
        }));
        await page.goto('http://data-table.test/');
        const root = page.locator('[data-ax-data-table]').first();
        const titles = () => root.locator('tbody tr:visible td:first-child').allTextContents();
        if (!javaScriptEnabled) {
          assert.equal(await root.locator('tbody tr:visible').count(), 5);
          assert.equal(await root.getByRole('button').count(), 0);
          assert.equal(await root.getByRole('searchbox').count(), 0);
        } else {
          await page.addScriptTag({ content: behavior });
          assert.deepEqual(await titles(), ['Alpha', 'Echo']);
          assert.equal(await root.getByRole('button', { name: 'Previous' }).isDisabled(), true);
          await root.getByRole('button', { name: 'Next', exact: true }).click();
          assert.deepEqual(await titles(), ['Bravo', 'Delta']);
          await root.getByRole('button', { name: 'Next', exact: true }).click();
          assert.deepEqual(await titles(), ['Charlie']);
          assert.equal(await root.getByRole('button', { name: 'Next', exact: true }).isDisabled(), true);
          await root.getByRole('button', { name: 'Title', exact: true }).focus();
          await page.keyboard.press('Enter');
          assert.deepEqual(await titles(), ['Alpha', 'Bravo']);
          assert.equal(await root.locator('th').first().getAttribute('aria-sort'), 'ascending');
          await page.keyboard.press('Space');
          assert.deepEqual(await titles(), ['Echo', 'Delta']);
          assert.equal(await root.locator('th').first().getAttribute('aria-sort'), 'descending');
          await root.getByRole('searchbox').fill('pUbLiShEd');
          assert.deepEqual(await titles(), ['Charlie', 'Bravo']);
          await root.getByRole('button', { name: 'Next', exact: true }).click();
          assert.deepEqual(await titles(), ['Alpha']);
          await root.getByRole('searchbox').fill('nothing matches');
          assert.deepEqual(await titles(), []);
          assert.equal(await root.locator('[data-ax-table-empty]').isVisible(), true);
          assert.match(await root.getByRole('status').textContent(), /0-0 of 0 records/);
          assert.equal(await root.getByRole('button', { name: 'Next', exact: true }).isDisabled(), true);
          await root.getByRole('searchbox').fill('Alpha');
          await root.getByRole('link', { name: 'Alpha' }).click();
          assert.match(page.url(), /#alpha$/);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          if (process.env.AXONYX_UI_DATA_TABLE_SCREENSHOT && width === 1280) {
            await root.getByRole('searchbox').fill('');
            await root.screenshot({ path: process.env.AXONYX_UI_DATA_TABLE_SCREENSHOT });
          }
        }
        assert.deepEqual(errors, []);
        console.log(`PASS DataTable ${width}px ${javaScriptEnabled ? 'JS' : 'no-JS'}`);
      } finally { await page.close(); }
    }
  }
  const page = await browser.newPage();
  try {
    await page.setContent(fixture + fixture.replace('data-page-size="2"', 'data-page-size="invalid"'));
    const roots = page.locator('[data-ax-data-table]');
    await page.evaluate(() => {
      const link = document.querySelector('tbody a');
      window.originalTableLink = link;
      window.tableLinkClicks = 0;
      link.addEventListener('click', event => { event.preventDefault(); window.tableLinkClicks++; });
    });
    await page.addScriptTag({ content: behavior });
    await roots.first().getByRole('searchbox').fill('Alpha');
    assert.equal(await roots.nth(1).locator('tbody tr:visible').count(), 5, 'instance isolation and invalid page size fallback');
    await roots.first().getByRole('button', { name: 'Title', exact: true }).click();
    await roots.first().getByRole('link', { name: 'Alpha' }).click();
    assert.equal(await page.evaluate(() => window.tableLinkClicks), 1);
    assert.equal(await page.evaluate(() => window.originalTableLink === document.querySelector('tbody a')), true);
    await page.addScriptTag({ content: behavior });
    assert.equal(await roots.first().locator('.ax-data-table__sort').count(), 2, 'repeat runtime load must not duplicate handlers');
    await page.goto('about:blank');
    await page.setContent(fixture.replace(/<tbody>[\s\S]*?<\/tbody>/, '<tbody></tbody>'));
    await page.addScriptTag({ content: behavior });
    assert.equal(await page.locator('[data-ax-table-empty]').isVisible(), true);
    assert.equal(await page.getByRole('button', { name: 'Previous', exact: true }).isDisabled(), true);
    assert.equal(await page.getByRole('button', { name: 'Next', exact: true }).isDisabled(), true);
    console.log('PASS DataTable isolation, fallback, DOM identity, repeat load and empty dataset');
  } finally { await page.close(); }
} finally { await browser.close(); }
