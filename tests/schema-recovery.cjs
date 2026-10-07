const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const key='worldthreads-investigation-progress-v1';
const url=process.env.WORLDTHREADS_URL||'http://127.0.0.1:8768';
(async()=>{const browser=await chromium.launch();const errors=[];try{
 for(const version of [2,0,'1',undefined]){
  const context=await browser.newContext({acceptDownloads:true});const saved=JSON.stringify({version,stories:{harvests:{caseFiled:true,visited:[0,1,2,3,4]}},challenges:['causation'],futureField:{notes:'Preserve this exact unknown data.'}});
  await context.addInitScript(({key,saved})=>{if(!localStorage.getItem(key))localStorage.setItem(key,saved);},{key,saved});
  const page=await context.newPage();page.setDefaultTimeout(5000);page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForSelector('[data-start-story]');
  await page.click('[data-start-story=harvests]');
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
  await page.reload();await page.waitForSelector('[data-start-story]');
  assert.match(await page.locator('#progressRecovery').innerText(),/unsupported.*version/i);
  assert.match(await page.locator('.progress-summary').innerText(),/0 investigation points/);
  if(version===2){await page.setViewportSize({width:320,height:720});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(process.env.WORLDTHREADS_AXE==='1'){await page.addScriptTag({path:require.resolve('axe-core/axe.min.js',{paths:[path.join(__dirname,'..','work','a11y'),process.cwd()]})});const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));assert.deepEqual(audit.violations.map(v=>v.id),[]);}if(process.env.WORLDTHREADS_RECOVERY_SCREENSHOT)await page.screenshot({path:process.env.WORLDTHREADS_RECOVERY_SCREENSHOT,fullPage:true});}
  const download=page.waitForEvent('download');await page.click('[data-download-progress-recovery]');assert.equal(fs.readFileSync(await(await download).path(),'utf8'),saved);
  await page.click('[data-start-story=harvests]');assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
  assert.match(await page.locator('#progressRecovery').innerText(),/session/i);
  await page.reload();await page.waitForSelector('[data-start-story]');assert.match(await page.locator('.progress-summary').innerText(),/0 investigation points/);await context.close();
 }
 console.log('PASS: newer, older, string-valued and missing progress versions are preserved exactly, downloadable, and never credited as earned work; new activities remain session-only.');
 {
  const context=await browser.newContext({acceptDownloads:true});const one=await context.newPage(),two=await context.newPage();for(const page of [one,two])page.on('pageerror',e=>errors.push(e.message));await one.goto(url);await two.goto(url);await one.click('[data-start-story=harvests]');
  const saved=JSON.stringify({version:7,stories:{},challenges:[],futureField:'Written by another tab'});await two.evaluate(({key,saved})=>localStorage.setItem(key,saved),{key,saved});await one.locator('#progressRecovery').waitFor({state:'visible'});await one.click('.story-next');assert.equal(await one.evaluate(k=>localStorage.getItem(k),key),saved);await context.close();
 }
 console.log('PASS: another tab’s unsupported version is protected before the next progress write.');
 {
  const context=await browser.newContext();await context.addInitScript(()=>{localStorage.setItem('worldthreads-investigation-progress-v1',JSON.stringify({version:1,stories:{harvests:{visited:[0]}},challenges:[]}));localStorage.setItem('worldthreads-thesis-draft-v1',JSON.stringify({threadId:'THREAD-BRAZIL-PATRONAGE',argument:'Legacy unversioned draft remains supported.'}));});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.getByRole('button',{name:'Resume my thesis →',exact:true}).click();assert.equal(await page.locator('[name=argument]').inputValue(),'Legacy unversioned draft remains supported.');assert.equal(await page.locator('#progressRecovery').count(),0);await context.close();
 }
 assert.deepEqual(errors,[]);console.log('PASS: supported progress and existing unversioned thesis drafts still load.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
