const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3001/blog/build-resume-with-no-work-experience', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'blog_article5_test.png', fullPage: true });

  await browser.close();
})();
