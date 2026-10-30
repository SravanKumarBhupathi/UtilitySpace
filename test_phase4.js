const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test the new hero search interaction
  await page.click('input[placeholder="Search tools, calculators, and guides..."]');
  await page.type('input[placeholder="Search tools, calculators, and guides..."]', 'compress');

  // Wait for dropdown
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'homepage_phase4_search.png', fullPage: false });

  // Go to about page
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'about_page_phase4.png', fullPage: true });

  await browser.close();
})();
