const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });

  // Verify going to blog doesn't redirect
  await page.goto('http://localhost:3000/blog', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_listing_page.png', fullPage: true });

  await browser.close();
})();
