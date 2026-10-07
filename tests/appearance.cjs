const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch();const audits=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const url=process.env.WORLDTHREADS_URL||'http://127.0.0.1:8765';
 const open=()=>page.getByRole('button',{name:'Display settings: theme and text size'}).click();
 await page.goto(url);await page.locator('[data-start-story]').first().waitFor();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Fresh prototype preserves dark mode');
 await open();await page.getByRole('button',{name:'Auto',exact:true}).click();
 await page.emulateMedia({colorScheme:'light'});await page.waitForFunction(()=>document.documentElement.dataset.theme==='light');
 await page.emulateMedia({colorScheme:'dark'});await page.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
 await page.getByRole('button',{name:'Light',exact:true}).click();
 await page.emulateMedia({colorScheme:'dark'});assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 for(const [name,size] of [['Normal',16],['Large',18],['Extra-large',20],['Largest',22.4]]){
  await page.getByRole('button',{name:name+' text size',exact:true}).click();
  assert(Math.abs(await page.locator('html').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))-size)<.01);
 }
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'dispBtn');
 await page.reload();await page.locator('[data-start-story]').first().waitFor();
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
 assert.equal(await page.locator('html').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),22.4);
 await page.click('[data-start-story=harvests]');await page.click('.story-next');
 const largeNarrative=await page.locator('.story-narrative').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
 await open();await page.getByRole('button',{name:'Normal text size',exact:true}).click();await page.keyboard.press('Escape');
 const normalNarrative=await page.locator('.story-narrative').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
 assert(Math.abs(largeNarrative/normalNarrative-1.4)<.01,'Story text must grow, not just the setting icon');
 await open();await page.getByRole('button',{name:'Largest text size',exact:true}).click();await page.keyboard.press('Escape');
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js',{paths:[path.join(__dirname,'..','work','a11y'),process.cwd()]})});
 const audit=async(screen)=>{
  const fits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
  if(!fits){const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(e=>({tag:e.tagName,id:e.id,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})));assert.fail(screen+' must reflow: '+JSON.stringify(overflow));}
  const report=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  audits.push({screen,violations:report.violations,incomplete:report.incomplete});
  console.log(screen+': '+report.violations.length+' violations');
 };
 await audit('light largest story');await page.click('[data-story-evidence]');await audit('light largest evidence');
 await page.click('#closeDialog');await page.waitForFunction(()=>!history.state?.inspector);
 await page.click('#researchMode');await audit('light largest research library');
 await page.selectOption('#threadSelect','THREAD-BRAZIL-PATRONAGE');await page.click('#threadThesis');
 for(const stage of ['topic','evidence','defense','research','present']){await page.click('[data-thesis-stage='+stage+']');await audit('light largest thesis '+stage);}
 await page.setViewportSize({width:320,height:720});await page.click('[data-thesis-stage=topic]');await audit('light largest 320px thesis');
 await open();await audit('light largest 320px display settings');await page.keyboard.press('Escape');
 await page.click('#storyMode');await audit('light largest 320px story shelf');
 await open();await page.getByRole('button',{name:'Dark',exact:true}).click();await page.keyboard.press('Escape');await audit('dark largest 320px story shelf');
 // Preferences still work in memory when storage is denied.
 const denied=await browser.newContext();await denied.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new DOMException('Denied','SecurityError')};Storage.prototype.setItem=()=>{throw new DOMException('Denied','SecurityError')};});
 const blocked=await denied.newPage();blocked.on('pageerror',e=>errors.push(e.message));await blocked.goto(url);
 await blocked.getByRole('button',{name:'Display settings: theme and text size'}).click();await blocked.getByRole('button',{name:'Light',exact:true}).click();await blocked.getByRole('button',{name:'Largest text size',exact:true}).click();
 assert.match(await blocked.locator('.disp-note').innerText(),/For this visit/);assert.equal(await blocked.locator('html').getAttribute('data-theme'),'light');assert.equal(await blocked.locator('html').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),22.4);await denied.close();
 if(process.env.WORLDTHREADS_APPEARANCE_OUTPUT)fs.writeFileSync(process.env.WORLDTHREADS_APPEARANCE_OUTPUT,JSON.stringify({scope:'Display preferences, actual content scaling, reflow and sampled axe rules; not a screen-reader certification',audits},null,2));
 const failures=audits.flatMap(x=>x.violations.map(v=>({screen:x.screen,id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
 assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);
 console.log('PASS: theme and all four text sizes, actual story scaling, persistence, Auto device changes, keyboard close, largest-size reflow and storage-denied fallback.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
