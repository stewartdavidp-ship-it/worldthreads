const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sample=require('./fixtures/harvest-playthrough.json');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.WORLDTHREADS_URL||'http://127.0.0.1:8772');
 await page.click('[data-start-story=harvests]');await page.click('.story-next');
 await page.locator('[data-story-evidence]:visible').first().click();await page.locator('.evidence-source summary').first().click();await page.click('#closeDialog');
 await page.locator('[data-story-claim]:visible').first().click();await page.click('#closeDialog');await page.click('.story-next');
 await page.click('[data-harvest-landmark="2"]');await page.selectOption('[data-inquiry-field=link]','contributes');await page.click('.inquiry-writing summary');
 await page.fill('[data-inquiry-field=reason]','Regional weather and grain-price chronology support a contribution; timing alone does not isolate trade or household access.');await page.click('.story-next');
 const prediction='If the shock alone determines harvests, Korean reports should show widespread failure.';
 await page.fill('[data-inquiry-field=prediction]',prediction);await page.click('[data-story-choice=universal]');await page.click('.story-next');await page.click('[data-inquiry-reveal]');
 await page.selectOption('[data-inquiry-field=decision]','narrow');await page.fill('[data-inquiry-field=claim]',sample.argumentRevisions[0].before);await page.click('.inquiry-writing summary');
 await page.fill('[data-inquiry-field=limit]',sample.counterargument);await page.fill('[data-inquiry-field=next]',sample.researchQuestion);await page.click('.story-next');
 await page.locator('.ending-alternatives>summary').click();await page.getByText('Build the guided case and earn its milestone',{exact:true}).click();
 for(const id of ['WT-1816-0006','WT-1816-0045'])await page.check('#caseFileForm input[value="'+id+'"]');await page.selectOption('#caseFileForm [name=limit]','0');await page.selectOption('#caseFileForm [name=next]','0');await page.locator('#caseFileForm button[type=submit]').click();
 await page.click('[data-inquiry-thesis]');assert.equal(await page.inputValue('[name=argument]'),sample.argumentRevisions[0].before);assert.equal(await page.inputValue('[name=role0]'),'');
 await page.getByText('My story: prediction → evidence → revised claim',{exact:true}).click();assert((await page.locator('.thesis-workspace').innerText()).includes(prediction));
 for(const summary of ['1. Frame the question and argument','2. Define scope and method','4. Test the argument and plan the document']){const loc=page.getByText(summary,{exact:true});if(!(await loc.evaluate(e=>e.closest('details').open)))await loc.click();}
 for(const name of ['title','question','historiography','scope','method','counterargument','response','revision','chapters','schedule'])await page.fill('[name='+name+']',sample[name]);
 await page.click('[data-thesis-stage=research]');for(const name of ['researchQuestion','researchSource','researchPlan'])await page.fill('[name='+name+']',sample[name]);
 await page.getByText('Take this question to an AI research assistant',{exact:true}).click();await page.click('[data-build-ai-brief]');assert((await page.inputValue('#aiResearchBrief')).includes(sample.argumentRevisions[0].before));
 await page.click('[data-thesis-stage=evidence]');await page.click('[data-thesis-table]');for(let i=0;i<3;i++)await page.fill('[name=locator'+i+']',sample['locator'+i]);
 await page.click('[data-thesis-stage=defense]');await page.click('[data-reframe-examiner]');for(const name of ['testRival','testOwnPrediction','testRivalPrediction','testDiscriminator','testReason','testRevisedArgument'])await page.fill('[name='+name+']',sample[name]);await page.selectOption('[name=testResult]','pending');await page.selectOption('[name=testDecision]','narrow');await page.click('[data-apply-examiner]');
 await page.click('[data-thesis-stage=evidence]');for(let i=0;i<3;i++){await page.click('[data-board-record="'+i+'"]');await page.click('[data-board-role='+sample['role'+i]+']');await page.fill('#boardReason',sample['claim'+i]);}
 await page.getByText('Rehearse your defense · three challenges',{exact:true}).click();for(const name of ['defenseGap','defenseRival','defenseRevision'])await page.fill('[name='+name+']',sample[name]);
 await page.click('[data-thesis-stage=present]');assert.equal(await page.locator('#portfolioChecklist').getByText(/^○/).count(),0);await page.click('[data-file-portfolio]');assert((await page.locator('#portfolioStatus').innerText()).includes('Research round completed'));
 const out=path.resolve(__dirname,'../../../outputs');await page.locator('#thesisPortfolio').screenshot({path:path.join(out,'WorldThreads full story ending.png')});
 let event=page.waitForEvent('download');await page.click('[data-download-thesis]');let dl=await event;const text=fs.readFileSync(await dl.path(),'utf8');assert(text.includes(prediction));assert(text.includes(sample.argument));assert(text.includes('Evidence unavailable or not yet checked'));await dl.saveAs(path.join(out,'WorldThreads first story thesis.md'));
 event=page.waitForEvent('download');await page.click('[data-download-portfolio]');dl=await event;const packet=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.equal(packet.draft.storyPrediction,prediction);assert.equal(packet.draft.argumentRevisions[0].after,sample.argument);await dl.saveAs(path.join(out,'WorldThreads first story portfolio.json'));
 await page.reload();await page.getByRole('button',{name:'Resume my thesis →'}).click();assert.equal(await page.inputValue('[name=argument]'),sample.argument);await page.getByText('My story: prediction → evidence → revised claim',{exact:true}).click();assert((await page.locator('.thesis-workspace').innerText()).includes(prediction));
 // Reentering the story must preserve the independently revised thesis and its evidence roles.
 await page.click('[data-story-home]');await page.click('[data-start-story=harvests]');await page.click('[data-inquiry-thesis]');assert.equal(await page.inputValue('[name=argument]'),sample.argument);assert((await page.locator('#thesisStatus').innerText()).includes('preserved'));
 await page.click('[data-thesis-stage=present]');assert((await page.locator('#portfolioHistory').innerText()).includes('matches'));await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log('PASS: fresh harvest story → prediction → counterexample → own argument → earned case → thesis handoff → research brief → pending rival test → revised thesis → evidence reassessment → filed portfolio → history export → reload → existing thesis preserved → mobile.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
