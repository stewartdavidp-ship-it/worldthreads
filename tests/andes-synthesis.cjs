const {chromium} = require('playwright');
const assert = require('node:assert/strict');

(async () => {
 const browser = await chromium.launch();
 try {
  const context = await browser.newContext({permissions: ['clipboard-read', 'clipboard-write']});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.WORLDTHREADS_URL || 'http://127.0.0.1:8792');
  await page.click('[data-start-story=andes]');
  for (let scene = 0; scene < 2; scene++) await page.locator('.story-actions .story-next').click();
  const exercise = page.locator('.andes-synthesis');
  assert.equal(await exercise.evaluate(element => element.open), false);
  await exercise.locator(':scope > summary').press('Enter');
  const image = exercise.locator('img');
  await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.andes-synthesis img').naturalWidth > 0);
  assert.equal(await exercise.locator('[download]').getAttribute('href'), await image.getAttribute('src'));
  const prompt = await exercise.locator('textarea').inputValue();
  for (const value of ['WT-1816-0060', 'WT-1816-0030', 'WT-1816-0083', 'WT-1816-0082',
   '124 of 130 mules', '400 y tantas', 'If the image is missing', 'count them as one account',
   'one supported synthesis', 'one tempting but unsupported link']) assert(prompt.includes(value), value);
  const savedBefore = await page.evaluate(() => localStorage.getItem('worldthreads-investigation-progress-v1'));
  await exercise.locator('[data-copy-andes-synthesis]').click();
  await exercise.getByText(/Prompt copied/).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), prompt);
  await exercise.locator('.andes-synthesis-check summary').click();
  assert.match(await exercise.locator('.andes-synthesis-check').innerText(), /Their fate is unknown/);
  assert.equal(await page.evaluate(() => localStorage.getItem('worldthreads-investigation-progress-v1')), savedBefore);
  await page.evaluate(() => Object.defineProperty(navigator.clipboard, 'writeText', {
   value: async () => { throw new Error('Clipboard blocked for test'); }
  }));
  await exercise.locator('[data-copy-andes-synthesis]').click();
  await exercise.getByText(/selected for manual copying/).waitFor();
  assert(await exercise.locator('textarea').evaluate(field =>
   field === document.activeElement && field.selectionEnd === field.value.length));
  await exercise.locator('[data-story-evidence="WT-1816-0083"]').click();
  assert.match(await page.locator('#detailTitle').innerText(), /mule/i);
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  await page.setViewportSize({width: 320, height: 700});
  await page.evaluate(() => { document.documentElement.style.fontSize = '140%'; });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []);
  console.log('PASS: source image, four-record AI prompt, clipboard and manual fallback, verification, evidence detour and narrow layout.');
 } finally {
  await browser.close();
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
