const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1200,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const draft={version:1,link:'sequence',reason:'Chronology warrants investigation, but does not isolate a cause.',prediction:'I expect widespread poor reports.',testedPrediction:'I expect widespread poor reports.',revealed:true,decision:'narrow',claim:'The reported contrast needs investigation; I cannot isolate its cause.',limit:'Different places, crops and records; household access remains unresolved.',next:'Compare the assessment rules and local crop records for matched seasons.'};
 await page.addInitScript(draft=>{localStorage.setItem('worldthreads-harvest-inquiry-v1',JSON.stringify(draft));localStorage.setItem('worldthreads-investigation-progress-v1',JSON.stringify({version:1,stories:{harvests:{last:5,visited:[0,1,2,3,4,5],choice:'regional'}},challenges:[]}));},draft);
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8772');await page.click('[data-start-story=harvests]');
 assert.equal(await page.locator('#storyJourney button:visible').count(),1,'The ending keeps one next action');
 await page.getByText('See how the records connect to my argument',{exact:true}).click();
 assert((await page.locator('.reasoning-interpretation').innerText()).includes(draft.claim));
 assert((await page.locator('.reasoning-interpretation').innerText()).includes('not automatically verified'));
 await page.locator('.reasoning-interpretation summary').click();assert((await page.locator('.reasoning-interpretation').innerText()).includes(draft.next));
 await page.locator('.reasoning-gap>summary').press('Enter');
 assert((await page.locator('.reasoning-gap').innerText()).includes('No cause of this contrast has been established here'));
 const before=await page.evaluate(()=>({draft:localStorage.getItem('worldthreads-harvest-inquiry-v1'),progress:localStorage.getItem('worldthreads-investigation-progress-v1')}));
 for(const direction of ['weather','reporting','access']){
  await page.click('[data-reasoning-direction='+direction+']');assert.equal(await page.locator('[data-reasoning-direction='+direction+']').getAttribute('aria-pressed'),'true');
  const after=await page.evaluate(()=>({draft:localStorage.getItem('worldthreads-harvest-inquiry-v1'),progress:localStorage.getItem('worldthreads-investigation-progress-v1')}));assert.deepEqual(after,before,'A research direction cannot change the draft or award progress');
  const expected=direction==='weather'?['WT-1816-0046','WT-1816-0079']:direction==='reporting'?['WT-1816-0006','WT-1816-0045']:['WT-1816-0045'];
  assert.deepEqual(await page.locator('.reasoning-record-links button').evaluateAll(es=>es.map(e=>e.dataset.storyEvidence)),expected);
  assert.equal((await page.locator('.reasoning-direction').innerText()).includes('same scholarly source'),direction==='weather');
 }
 await page.click('[data-reasoning-direction=reporting]');await page.locator('.reasoning-record-links button').last().click();assert((await page.locator('#detailTitle').textContent()).includes('Korean'));
 await page.locator('.evidence-source summary').first().click();await page.click('#closeDialog');await page.waitForFunction(()=>!pendingInspectorClose&&!restoringNavigation);assert(await page.locator('.reasoning-gap').evaluate(e=>e.open),'Closing a source preserves the expanded investigation');assert.equal(await page.locator('[data-reasoning-direction=reporting]').getAttribute('aria-pressed'),'true');
 await page.locator('.harvest-reasoning').scrollIntoViewIfNeeded();await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads explanation gap desktop.png')});
 await page.click('.reasoning-direction [data-inquiry-focus=next]');assert.equal(await page.evaluate(()=>document.activeElement.dataset.inquiryField),'next');assert.equal(await page.inputValue('[data-inquiry-field=next]'),draft.next);assert.equal(await page.inputValue('[data-inquiry-field=claim]'),draft.claim);
 await page.locator('.reasoning-gap>summary').click();assert.equal(await page.locator('[data-reasoning-direction=reporting]').getAttribute('aria-pressed'),'true','Direction survives the writing detour within this session');
 await page.click('[data-reasoning-direction=weather]');await page.locator('.reasoning-direction summary').click();assert((await page.locator('.reasoning-direction').innerText()).includes('Which local weather and crop records'));
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('.harvest-reasoning').scrollIntoViewIfNeeded();await page.screenshot({path:path.resolve(__dirname,'../../../outputs/WorldThreads explanation gap mobile.png'),fullPage:true});
 const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js',{paths:[path.join(__dirname,'..','work','a11y'),process.cwd()]}),'utf8');await page.addScriptTag({content:axe});
 for(const theme of ['dark','light']){await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);const result=await page.evaluate(()=>axe.run(document.querySelector('.harvest-reasoning'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.deepEqual(result.violations.map(x=>x.id),[],theme);}
 await page.evaluate(()=>{harvestInquiry.revealed=false;story.step=4;renderStory()});assert.equal(await page.locator('.harvest-reasoning').count(),0,'No comparison is shown before revealing evidence');
 assert.deepEqual(errors,[]);console.log('PASS: one-action ending → reports versus interpretation → unresolved gap → three evidence-led research directions → source detour → own writing preserved → no automatic progress/truth → mobile/keyboard/themes/accessibility → reveal gate.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
