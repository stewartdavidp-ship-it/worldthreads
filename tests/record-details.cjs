const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8772');
 await page.click('[data-start-story=harvests]');await page.click('.story-next');await page.click('[data-story-evidence]');
 assert(await page.locator('.record-boundary').isVisible());
 assert.equal(await page.locator('.record-provenance[open]').count(),0);
 await page.locator('.record-provenance summary').click();assert(await page.locator('.record-provenance p').first().isVisible());
 await page.locator('.evidence-source summary').first().click();assert(await page.locator('.evidence-source[open] a').first().isVisible());
 await page.click('[data-inspector-tab=facts]');assert(await page.locator('.record-context').isVisible());assert.equal(await page.locator('.record-metadata[open]').count(),0);
 await page.locator('.record-metadata summary').press('Enter');assert(await page.locator('.record-metadata dd').first().isVisible());
 const data=await page.evaluate(async()=>await(await fetch('data/1816/observations.json')).json());
 for(const o of data){
  await page.evaluate(id=>openDetail(obs(id)),o.id);
  assert.equal(await page.locator('.selected-fact').textContent(),o.observation);
  assert.equal(await page.locator('.record-boundary p').textContent(),o.uncertainty||'No record-specific uncertainty note has been added. The confidence rating does not establish certainty.');
  await page.click('[data-inspector-tab=facts]');assert.equal(await page.locator('.record-metadata[open]').count(),0);
  await page.locator('.record-metadata summary').click();assert((await page.locator('.record-metadata').innerText()).includes(o.id));
  await page.click('[data-inspector-tab=evidence]');assert.equal(await page.locator('.record-provenance[open]').count(),0);
  await page.locator('.record-provenance summary').click();assert((await page.locator('.record-provenance').innerText()).includes(o.sourceLocator||'A specific source location has not yet been recorded.'));
 }
 await page.evaluate(()=>{openDetail(obs('WT-1816-0045'));inspector.tab='evidence';renderInspector(true)});
 await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads record evidence desktop.png')});
 await page.setViewportSize({width:390,height:844});assert(await page.locator('#detailDialog').evaluate(e=>e.scrollWidth<=e.clientWidth));
 await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads record evidence mobile.png')});
 await page.evaluate(()=>document.documentElement.dataset.theme='light');
 await page.click('[data-inspector-tab=facts]');await page.locator('.record-metadata summary').click();assert(await page.locator('#detailDialog').evaluate(e=>e.scrollWidth<=e.clientWidth));
 await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads record context light.png')});
 const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js',{paths:[path.join(__dirname,'..','work','a11y'),process.cwd()]}),'utf8');await page.addScriptTag({content:axe});
 for(const theme of ['light','dark']){await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);const result=await page.evaluate(()=>axe.run(document.getElementById('detailDialog'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(result.violations.map(x=>x.id),[],theme+' record accessibility');}
 assert.deepEqual(errors,[]);console.log(`PASS: ${data.length} records preserve findings, uncertainty and locators; source and metadata expansions, keyboard, mobile, and light theme.`);
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
