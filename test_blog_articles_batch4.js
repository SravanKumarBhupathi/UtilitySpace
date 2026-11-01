const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000/blog/why-brain-prefers-short-videos-over-studying', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_article7_test.png', fullPage: true });

  await page.goto('http://localhost:3000/blog/learn-new-skills-faster-80-20-rule', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_article8_test.png', fullPage: true });

  await browser.close();
})();
