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
  const art = panorama.locator('.andes-panorama-art');
  const evidence = panorama.locator('[data-story-evidence]');
  const artTop = () => art.evaluate(element => element.getBoundingClientRect().top);
  await evidence.scrollIntoViewIfNeeded();
  const beforeRecord = await artTop();
  await evidence.click();
  assert.match(await page.locator('#detailTitle').innerText(), /Mendoza workshops/);
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  assert(Math.abs((await artTop()) - beforeRecord) <= 2, 'Closing the evidence should keep the panorama in place');
  assert(await evidence.evaluate(element => element === document.activeElement));
  await stop(1).scrollIntoViewIfNeeded();
  const beforeNext = await artTop();
  await stop(1).press('Enter');
  assert.equal(await panorama.getAttribute('data-panorama-step'), '1');
  assert(await panorama.locator('.andes-camera').evaluate(camera => camera.getAnimations().length > 0));
  assert(Math.abs((await artTop()) - beforeNext) <= 2, 'The next scene should animate at the same viewport position');
  assert(await panorama.evaluate(element => element.contains(document.activeElement)));
  await panorama.locator('.andes-camera').evaluate(camera =>
   Promise.all(camera.getAnimations().map(animation => animation.finished)));
  assert(Math.abs((await artTop()) - beforeNext) <= 2, 'The panorama should stay in place through the end of the animation');
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
  const caseGoal = page.locator('.case-goal');
  await caseGoal.getByRole('button', {name:/Open the Chacabuco record/}).click();
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  assert(await caseGoal.getByRole('button', {name:/Open the Chacabuco record/}).isVisible(), 'Opening the record alone does not complete the source check');
  await caseGoal.getByRole('button', {name:/Open the Chacabuco record/}).click();
  await page.locator('.evidence-source > summary').first().click();
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  await caseGoal.getByText('Named source card opened.', {exact:true}).waitFor({state:'visible',timeout:5000});
  await caseGoal.getByRole('button', {name:/Check how the crossing and battle are linked/}).click();
  await page.click('#closeDialog');
  await page.waitForFunction(() => !pendingInspectorClose && !restoringNavigation);
  await caseGoal.getByRole('button', {name:'Present my case'}).waitFor({state:'visible',timeout:5000});
  await page.setViewportSize({width: 320, height: 700});
  await page.evaluate(() => { document.documentElement.style.fontSize = '140%'; });
  await stop(0).click();
  assert.equal(await panorama.getAttribute('data-panorama-step'), '0');
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert(await art.evaluate(element => {
   const {top, bottom} = element.getBoundingClientRect();
   const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
   return Math.min(innerHeight, bottom) - Math.max(headerBottom, top) >= 100;
  }), 'Selecting a scene from the phone rail should bring the illustration into view');
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
