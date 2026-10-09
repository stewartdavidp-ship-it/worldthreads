const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const saved={version:1,stories:{harvests:{sources:['SRC-003'],connections:['REL-0005'],visited:[]}},challenges:[]};
 await page.addInitScript(saved=>{if(!localStorage.getItem('badge-test-seeded')){localStorage.setItem('worldthreads-investigation-progress-v1',JSON.stringify(saved));localStorage.setItem('badge-test-seeded','yes')}},saved);
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8772');await page.locator('#investigationProgress>details>summary').click();
 const before=await page.evaluate(()=>localStorage.getItem('worldthreads-investigation-progress-v1'));
 assert.equal(await page.locator('.badge-token').count(),10);assert.equal(await page.locator('.badge-token.earned').count(),2);assert.equal(await page.locator('.badge-token.locked .badge-state svg').count(),8);
 const scout=page.getByRole('button',{name:'Source scout · Earned',exact:true});await scout.hover();assert((await page.locator('#badgeExplanation').innerText()).includes('Opening it does not establish'));
 assert((await scout.getAttribute('title')).includes('Source scout'));assert((await scout.getAttribute('title')).includes('Expand a relevant source'));
 const challenge=page.getByRole('button',{name:'Claim challenger · Not earned yet',exact:true});await challenge.focus();assert((await page.locator('#badgeExplanation').innerText()).includes('first case file'));
 await challenge.press('Enter');assert.equal(await page.locator('.badge-token.earned').count(),2);
 assert.equal(await page.evaluate(()=>localStorage.getItem('worldthreads-investigation-progress-v1')),before);
 await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads badge icons desktop.png'),fullPage:true});
 await page.reload();await page.locator('#investigationProgress>details>summary').click();assert.equal(await page.locator('.badge-token.earned').count(),2);
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'1816 Investigator · Not earned yet',exact:true}).click();assert((await page.locator('#badgeExplanation').innerText()).includes('all three case files'));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads badge icons mobile.png'),fullPage:true});
 const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js',{paths:[path.join(__dirname,'..','work','a11y'),process.cwd()]}),'utf8');await page.addScriptTag({content:axe});
 for(const theme of ['dark','light']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);const result=await page.evaluate(()=>axe.run(document.querySelector('#investigationProgress'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(result.violations.map(x=>x.id),[],theme);}
 assert.deepEqual(errors,[]);console.log('PASS: ten distinct accessible badge icons, earned/locked shapes, hover/focus/tap explanations, unchanged saved rewards, reload, mobile, light/dark accessibility.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
