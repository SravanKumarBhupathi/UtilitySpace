const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });

  // Test category filtering and UI changes
  await page.screenshot({ path: 'blog_listing_expanded.png', fullPage: true });

  await browser.close();
})();
