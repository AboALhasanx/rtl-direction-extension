const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const extPath = __dirname;
  const browser = await chromium.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setContent(`
    <!DOCTYPE html>
    <html><body>
      <div id="test1">Hello World LTR</div>
      <div id="test2">Another paragraph</div>
    </body></html>
  `);

  const initialDir = await page.locator('#test1').getAttribute('dir');
  console.log('Before:', initialDir ?? '(none)');

  await page.evaluate(() => {
    document.getElementById('test1').style.direction = 'rtl';
  });

  const dir1 = await page.locator('#test1').evaluate(el => el.style.direction);
  const dir2 = await page.locator('#test2').evaluate(el => el.style.direction);
  console.log('After set on test1 - test1:', dir1, 'test2:', dir2);

  const bodyCheck = await page.evaluate(() => {
    document.body.style.direction = 'rtl';
    return document.body.style.direction;
  });
  console.log('Body direction:', bodyCheck);

  let passed = 0;
  if (dir1 === 'rtl') { console.log('PASS: test1 has rtl'); passed++; }
  else { console.log('FAIL: test1 expected rtl, got', dir1); }
  if (dir2 === '') { console.log('PASS: test2 has no direction'); passed++; }
  else { console.log('FAIL: test2 expected "", got', dir2); }
  if (bodyCheck === 'rtl') { console.log('PASS: body has rtl'); passed++; }
  else { console.log('FAIL: body expected rtl, got', bodyCheck); }

  console.log(`${passed}/3 tests passed`);
  await browser.close();
  process.exit(passed === 3 ? 0 : 1);
})().catch(err => { console.error(err); process.exit(1); });