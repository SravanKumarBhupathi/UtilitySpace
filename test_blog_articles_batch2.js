const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3001/blog/why-you-feel-busy-but-accomplish-nothing', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'blog_article3_test.png', fullPage: true });

  await browser.close();
})();
