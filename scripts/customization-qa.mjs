import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.AXONYX_UI_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch();
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${baseUrl}/docs/customization`);
    assert.equal(response.status(), 200);
    for (const style of ['classic', 'alloy', 'forge']) {
      for (const palette of ['bronze', 'silver', 'gold']) {
        await page.locator('.foundry-site').evaluate((node, values) => {
          node.dataset.foundryStyle = values.style;
          node.dataset.foundry = values.palette;
        }, { style, palette });
        const geometry = await page.evaluate(() => {
          const read = (id) => {
            const node = document.getElementById(id);
            const css = getComputedStyle(node);
            return { classes: [...node.classList], padding: css.paddingTop, gap: css.rowGap,
              radius: css.borderTopLeftRadius, height: node.getBoundingClientRect().height,
              font: css.fontSize, type: node.getAttribute('type') };
          };
          return { card: read('custom-card'), field: read('custom-field'),
            input: read('custom-name'), button: read('custom-button'),
            overflow: document.documentElement.scrollWidth > innerWidth };
        });
        assert.deepEqual(geometry.card.classes, ['ax-card', 'account-card']);
        assert.deepEqual(geometry.field.classes, ['ax-field', 'account-field']);
        assert.deepEqual(geometry.button.classes, ['ax-button', 'save-button']);
        assert.equal(geometry.card.padding, '32px');
        assert.equal(geometry.card.gap, '20px');
        assert.equal(geometry.card.radius, '12px');
        assert.equal(geometry.field.gap, '10px');
        assert.equal(geometry.input.radius, '6px');
        assert.equal(geometry.input.height, 44);
        assert.equal(geometry.button.height, 44);
        assert.equal(geometry.button.radius, '6px');
        assert.equal(geometry.button.font, '14px');
        assert.equal(geometry.button.type, 'button');
        assert.equal(geometry.overflow, false);
        await page.locator('label[for="custom-name"]').click();
        assert.equal(await page.locator('#custom-name').evaluate((node) => node === document.activeElement), true);
        await page.locator('#custom-name').fill('Foundry');
        assert.equal(await page.locator('#custom-name').inputValue(), 'Foundry');
        console.log(`PASS customization ${width}px ${style}/${palette}`);
      }
    }
    for (const toggle of await page.locator('.ax-component-example summary').all()) {
      await toggle.click();
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${process.env.TEMP}/axonyx-customization-${width}.png`, fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}
