const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const claim='The reported outcomes differ; the sources do not yet explain the local causes.';
 await page.addInitScript(claim=>{
  localStorage.setItem('worldthreads-harvest-inquiry-v1',JSON.stringify({version:1,link:'',reason:'',prediction:'I expect broadly similar harvest reports.',testedPrediction:'I expect broadly similar harvest reports.',revealed:true,decision:'narrow',claim,limit:'',next:''}));
  localStorage.setItem('worldthreads-investigation-progress-v1',JSON.stringify({version:1,stories:{harvests:{last:5,visited:[0,1,2,3,4,5],choice:'regional'}},challenges:[]}));
 },claim);
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8772');await page.click('[data-start-story=harvests]');
 assert.equal(await page.locator('[data-inquiry-thesis]').isEnabled(),false);
 assert.equal(await page.locator('.inquiry-missing [data-inquiry-focus]').count(),4);
 assert.equal(await page.locator('#storyJourney button:visible').count(),1);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'../../outputs/first-story-ending-simplified.png',fullPage:true});
 assert((await page.locator('.inquiry-board').textContent()).includes('Not recorded yet'));
 for(const key of ['limit','next','reason','link']){
  if(key!=='limit'){await page.reload();await page.click('[data-start-story=harvests]');}
  const target=page.locator('.inquiry-missing [data-inquiry-focus='+key+']');if(!await target.isVisible())await page.locator('.inquiry-missing summary').click();
  await page.click('.inquiry-missing [data-inquiry-focus='+key+']');
  assert(await page.locator('[data-inquiry-field='+key+']').isVisible());
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.inquiryField),key);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('worldthreads-harvest-inquiry-v1')).claim),claim);
 }
 await page.reload();await page.click('[data-start-story=harvests]');await page.locator('.ending-evidence>summary').click();await page.locator('.story-route>summary').click();await page.click('[data-story-frontier]');assert(await page.locator('#proposalClaim').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.id),'proposalClaim');
 assert.deepEqual(errors,[]);
 console.log('PASS: incomplete ending explains missing work → each recovery link opens and focuses its field → claim and prediction preserved.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
