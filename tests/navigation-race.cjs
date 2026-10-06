const engines=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await engines[process.env.WORLDTHREADS_BROWSER||'chromium'].launch();try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8765');
 await page.click('[data-start-story=harvests]');await page.click('.story-next');
 await page.click('[data-story-evidence]');await page.waitForFunction(()=>!!history.state?.inspector);
 // Hold the actual history traversal until the player has already moved on.
 await page.evaluate(()=>{const back=history.back.bind(history);window.releaseEvidenceBack=()=>back();history.back=()=>{};});
 await page.click('#closeDialog');await page.click('.story-next');
 const heading=await page.locator('#storyHeading').innerText();
 assert.match(heading,/table/i);
 await page.evaluate(()=>new Promise(resolve=>{window.addEventListener('popstate',()=>setTimeout(resolve,0),{once:true});window.releaseEvidenceBack();}));
 assert(await page.locator('#detailDialog').isHidden(),'A delayed close must not reopen the evidence dialog');
 assert.equal(await page.locator('#storyHeading').innerText(),heading,'Closing evidence must not roll back a scene chosen before history settles');
 assert.equal(await page.evaluate(()=>history.state.step),2);
 await page.reload();await page.click('[data-start-story=harvests]');
 assert.equal(await page.locator('#storyHeading').innerText(),heading,'The later scene must remain the resume point');
 assert.deepEqual(errors,[]);
 console.log('PASS: evidence-close history race preserves the next scene, history route and reload resume point.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
