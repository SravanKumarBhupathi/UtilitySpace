const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000/blog/practical-ways-to-save-money-low-salary', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_article9_test.png', fullPage: true });

  await page.goto('http://localhost:3000/blog/essential-skills-that-make-you-more-employable-2026', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_article10_test.png', fullPage: true });

  await browser.close();
})();
