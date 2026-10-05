const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8765');await page.waitForFunction(()=>document.querySelectorAll('.card').length===31);
 assert.equal(await page.locator('#statThreads').innerText(),'9');
 await page.selectOption('#threadSelect','THREAD-CENTRAL-EUROPE-FOOD');

 const data=await page.evaluate(async()=>({threads:await(await fetch('data/1816/threads.json')).json(),rels:await(await fetch('data/1816/relationships.json')).json(),obs:await(await fetch('data/1816/observations.json')).json()}));
 for(const t of data.threads){await page.selectOption('#threadSelect',t.id);assert.equal(await page.locator('.connection-row').count(),t.relationshipIds.length);for(let i=0;i<t.relationshipIds.length;i++){const r=data.rels.find(r=>r.id===t.relationshipIds[i]);const row=page.locator('.connection-row').nth(i);assert.equal(await row.locator('.thread-node').first().locator('strong').innerText(),data.obs.find(o=>o.id===r.subjectId).title);assert.equal(await row.locator('.thread-node').last().locator('strong').innerText(),data.obs.find(o=>o.id===r.objectId).title);await row.locator('.edge-label').click();assert((await page.locator('#dialogContent').innerText()).includes(r.causalStatus));await page.click('#closeDialog');}}
 await page.selectOption('#regionSelect','Oceania');assert.equal(await page.locator('.card').count(),3);
 await page.locator('.card').first().press('Enter');assert((await page.locator('#dialogContent').innerText()).includes('Uncertainty'));await page.locator('[data-observation]').first().click();assert(await page.locator('#detailDialog').evaluate(x=>x.open));await page.click('#closeDialog');
 await page.click('#clearFilters');await page.fill('#searchInput','nonexistent evidence xyz');assert.equal(await page.locator('.card').count(),0);await page.click('#clearFilters');
 await page.setViewportSize({width:390,height:844});await page.selectOption('#threadSelect','THREAD-APPIN');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'../../worldthreads-mobile.png',fullPage:true});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all thread endpoints, relationship dialogs, filters, keyboard navigation, nested evidence and mobile width');
})().catch(e=>{console.error(e);process.exit(1)});
