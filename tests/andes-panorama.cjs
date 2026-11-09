const {chromium} = require('playwright');
const assert = require('node:assert/strict');

(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: 'no-preference'});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.WORLDTHREADS_URL || 'http://127.0.0.1:8792');
  await page.click('[data-start-story=andes]');
  const panorama = page.locator('.andes-panorama');
  const stop = index => panorama.locator(`[data-story-step="${index}"]`);
  assert.equal(await stop(0).getAttribute('aria-current'), 'step');
  assert(await stop(2).isDisabled());
  assert.match(await panorama.locator('.andes-panorama-evidence').innerText(), /≈371.*workers/s);
  await panorama.locator('[data-story-evidence]').click();
  assert.match(await page.locator('#detailTitle').innerText(), /Mendoza workshops/);
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  await stop(1).press('Enter');
  assert.equal(await panorama.getAttribute('data-panorama-step'), '1');
  assert(await panorama.locator('.andes-camera').evaluate(camera => camera.getAnimations().length > 0));
  await page.emulateMedia({reducedMotion: 'reduce'});
  await stop(2).click();
  assert.equal(await panorama.getAttribute('data-panorama-step'), '2');
  assert.equal(await panorama.locator('.andes-camera').evaluate(camera => camera.getAnimations().length), 0);
  if (process.env.WORLDTHREADS_PANORAMA_SCREENSHOT) {
   await panorama.screenshot({path: process.env.WORLDTHREADS_PANORAMA_SCREENSHOT});
  }
  await panorama.locator('button.andes-panorama-marker').press('Enter');
  assert(await page.locator('.andes-dispatch h3').evaluate(heading => heading === document.activeElement));
  await stop(3).click();
  assert.equal(await stop(3).getAttribute('aria-current'), 'step');
  await page.setViewportSize({width: 320, height: 700});
  await page.evaluate(() => { document.documentElement.style.fontSize = '140%'; });
  await stop(0).click();
  assert.equal(await panorama.getAttribute('data-panorama-step'), '0');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert(await stop(3).isEnabled());
  await page.reload();
  await page.click('[data-start-story=andes]');
  assert.equal(await panorama.getAttribute('data-panorama-step'), '0');
  assert.deepEqual(errors, []);
  console.log('PASS: visual chapter navigation, camera motion, reduced motion, field report focus, narrow layout and saved progress.');
 } finally {
  await browser.close();
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
