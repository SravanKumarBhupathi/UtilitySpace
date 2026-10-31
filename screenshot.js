const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a standard desktop resolution
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to the local server
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Take screenshot of the homepage hero + header
  await page.screenshot({ path: 'homepage_hero.png', fullPage: false });

  // Click on the search box to trigger modal (using a more generic selector)
  await page.click('svg.text-secondary-text');

  // Wait a bit for modal animation
  await page.waitForTimeout(1000);

  // Take screenshot of the search modal open
  await page.screenshot({ path: 'search_modal.png', fullPage: false });

  await browser.close();
})();
