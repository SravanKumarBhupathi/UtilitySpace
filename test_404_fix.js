const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000/blog/ai-skills-everyone-should-learn-2026', { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'blog_404_fix_verification.png', fullPage: true });

  await browser.close();
})();
