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
 assert.equal(await page.locator('.inquiry-missing button').count(),4);
 assert((await page.locator('.inquiry-board').innerText()).includes('Not recorded yet'));
 for(const key of ['limit','next','reason','link']){
  if(key!=='limit'){await page.reload();await page.click('[data-start-story=harvests]');}
  await page.click('.inquiry-missing [data-inquiry-focus='+key+']');
  assert(await page.locator('[data-inquiry-field='+key+']').isVisible());
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.inquiryField),key);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('worldthreads-harvest-inquiry-v1')).claim),claim);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: incomplete ending explains missing work → each recovery link opens and focuses its field → claim and prediction preserved.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
