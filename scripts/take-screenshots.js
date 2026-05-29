/**
 * Takes App Store screenshots of the South Australia Marine Cams app
 * iPhone 6.5" — 1284×2778
 * Run: node scripts/take-screenshots.js
 */

const puppeteer = require('puppeteer-core');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const STORE_WIDTH  = 1284;
const STORE_HEIGHT = 2778;
const VIEWPORT_W   = 390;
const VIEWPORT_H   = 844;
const DPR          = 3;
const BASE_URL     = 'http://localhost:8084';
const OUT_DIR      = path.join(__dirname, '../app-store-assets/screenshots');
const CHROME_PATH  = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SCREENS = [
  {
    name: '1-home',
    description: 'Home — region filters & camera list',
    waitFor: 3000,
  },
  {
    name: '2-region',
    description: 'Yorke Peninsula filter — filtered camera list',
    waitFor: 2000,
    action: async (page) => {
      // Click the Yorke Peninsula filter tab
      await page.evaluate(() => {
        const tabs = [...document.querySelectorAll('div, span, button')];
        const tab = tabs.find(el =>
          el.textContent.trim() === 'Yorke Peninsula' && el.children.length <= 2
        );
        if (tab) tab.click();
      });
      await new Promise(r => setTimeout(r, 2000));
    },
  },
  {
    name: '3-explore',
    description: 'Explore — interactive map',
    waitFor: 3000,
    action: async (page) => {
      await page.evaluate(() => {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        tabs.find(t => t.textContent.includes('Explore'))?.click();
      });
      await new Promise(r => setTimeout(r, 3500));
    },
  },
  {
    name: '4-favourites',
    description: 'Favourites — saved cameras',
    waitFor: 2000,
    action: async (page) => {
      // Star several cameras
      await page.evaluate(() => {
        const stars = [...document.querySelectorAll('div')]
          .filter(d => d.textContent.trim() === '☆' && d.children.length === 0);
        [0, 1, 2, 3].forEach(i => stars[i]?.click());
      });
      await new Promise(r => setTimeout(r, 400));
      // Navigate to Favourites tab
      await page.evaluate(() => {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        tabs.find(t => t.textContent.includes('Favourites'))?.click();
      });
      await new Promise(r => setTimeout(r, 2000));
    },
  },
];

async function resizeToAppStore(inputPath, outputPath) {
  const img = await Jimp.read(inputPath);
  img.cover(STORE_WIDTH, STORE_HEIGHT).quality(95).write(outputPath);
  console.log(`  ✅ ${path.basename(outputPath)}  (${STORE_WIDTH}×${STORE_HEIGHT})`);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox'],
    defaultViewport: { width: VIEWPORT_W, height: VIEWPORT_H, deviceScaleFactor: DPR },
  });

  for (const screen of SCREENS) {
    console.log(`\n📸 Capturing: ${screen.description}`);
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, screen.waitFor));

    if (screen.action) await screen.action(page);

    const rawPath  = path.join(OUT_DIR, `${screen.name}-raw.png`);
    const finalPath = path.join(OUT_DIR, `${screen.name}.jpg`);

    await page.screenshot({ path: rawPath, fullPage: false });
    await resizeToAppStore(rawPath, finalPath);
    fs.unlinkSync(rawPath);
    await page.close();
  }

  await browser.close();
  console.log(`\n✅ iPhone screenshots saved to: ${OUT_DIR}`);
  fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.jpg')).forEach(f => console.log(`  • ${f}`));
})();
