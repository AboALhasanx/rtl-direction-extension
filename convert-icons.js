const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const sizes = {
  'icon16.png': 16,
  'icon48.png': 48,
  'icon128.png': 128,
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const [filename, size] of Object.entries(sizes)) {
    const svgPath = path.join(__dirname, 'icons', filename.replace('.png', '.svg'));
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const dataUri = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

    await page.setContent(`<html><body style="margin:0;padding:0;"><img src="${dataUri}" width="${size}" height="${size}"></body></html>`);
    await page.waitForTimeout(200);

    await page.screenshot({
      path: path.join(__dirname, 'icons', filename),
      clip: { x: 0, y: 0, width: size, height: size },
    });
    console.log(`Created ${filename} (${size}x${size})`);
  }

  await browser.close();
  console.log('Done');
})().catch(err => { console.error(err); process.exit(1); });