const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 2500 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'homepage_phase2.png', fullPage: true });

  await browser.close();
})();
