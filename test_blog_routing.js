const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/blog/ai-skills-everyone-should-learn-2026', { waitUntil: 'networkidle' });
  const title1 = await page.title();

  await page.goto('http://localhost:3000/blog/identify-ai-generated-scams-and-deepfake-videos', { waitUntil: 'networkidle' });
  const title2 = await page.title();

  await page.goto('http://localhost:3000/blog/why-you-feel-busy-but-accomplish-nothing', { waitUntil: 'networkidle' });
  const title3 = await page.title();

  await page.goto('http://localhost:3000/blog/emergency-fund-how-much-to-save', { waitUntil: 'networkidle' });
  const title4 = await page.title();

  console.log("Title 1: ", title1);
  console.log("Title 2: ", title2);
  console.log("Title 3: ", title3);
  console.log("Title 4: ", title4);

  await browser.close();
})();
