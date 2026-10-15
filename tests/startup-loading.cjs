const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const url=process.env.WORLDTHREADS_URL||'http://127.0.0.1:8775',key='worldthreads-thesis-draft-v1',saved=JSON.stringify({threadId:'THREAD-CLIMATE-CULTURE',question:'Keep my own question.',argument:'Keep my interpretation.'});
 for(const mode of ['one-reset','persistent-reset','invalid-json','wrong-shape','http-error']){
  const context=await browser.newContext();await context.addInitScript(({key,saved})=>{if(!localStorage.getItem(key))localStorage.setItem(key,saved);},{key,saved});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));let requests=0,recovered=false;
  await page.route('**/data/objects.json*',async route=>{
   requests++;if(recovered||mode==='one-reset'&&requests>1)return route.continue();
   if(mode==='one-reset'||mode==='persistent-reset')return route.abort('connectionreset');
   return route.fulfill({status:mode==='http-error'?503:200,contentType:'application/json',body:mode==='invalid-json'?'not JSON':'{}'});
  });
  await page.goto(url);
  if(mode==='one-reset'){
   await page.locator('[data-start-story]').first().waitFor();assert.equal(requests,2);assert.equal(await page.locator('#retryLoad').count(),0);assert.equal(await page.evaluate(()=>state.objects.length),177);assert.equal(await page.evaluate(()=>state.observations.length),81);
  }else{
   await page.locator('#retryLoad').waitFor();assert.equal(requests,mode==='persistent-reset'?2:1);assert(await page.locator('#researchMode').isDisabled());assert.equal(await page.evaluate(()=>appLoaded),false);assert.equal(await page.evaluate(()=>state.observations.length),0);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
   recovered=true;await page.click('#retryLoad');await page.locator('[data-start-story]').first().waitFor();assert.equal(await page.evaluate(()=>state.objects.length),177);assert(await page.locator('#researchMode').isEnabled());assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
  }
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: one connection reset retried once → complete collection; persistent reset stops after two attempts → explicit retry with saved writing intact; invalid JSON, wrong collection shape and HTTP errors are not silently retried or accepted; deliberate recovery succeeds.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
