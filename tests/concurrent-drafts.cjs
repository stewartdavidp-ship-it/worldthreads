const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const KEY='worldthreads-thesis-draft-v1';
const url=process.env.WORLDTHREADS_URL||'http://127.0.0.1:8765';
(async()=>{const browser=await chromium.launch();const errors=[];try{
 const pair=async()=>{
  const context=await browser.newContext({acceptDownloads:true}),one=await context.newPage(),two=await context.newPage();
  for(const page of [one,two])page.on('pageerror',e=>errors.push(e.message));
  await one.goto(url);await one.click('#researchMode');await one.selectOption('#threadSelect','THREAD-BRAZIL-PATRONAGE');await one.click('#threadThesis');await one.fill('[name=argument]','Brazil investigation retained in the first tab.');
  await two.goto(url);await two.getByRole('button',{name:'Resume my thesis →',exact:true}).click();
  return {context,one,two};
 };
 const openDutch=async(page)=>{await page.click('#researchMode');await page.selectOption('#threadSelect','THREAD-DUTCH-RELIEF');await page.click('#threadThesis');};
 const switchDutch=async(page)=>{await openDutch(page);await page.fill('[name=argument]','Dutch investigation saved by the second tab.');};
 // Choosing this page's version must preserve a different investigation saved elsewhere.
 {
  const {context,one,two}=await pair();await switchDutch(two);await one.locator('#draftRecovery').waitFor({state:'visible'});
  await one.fill('[name=argument]','My revised Brazil argument during the conflict.');
  const event=one.waitForEvent('download');await one.click('[data-recover-download]');assert(fs.readFileSync(await(await event).path(),'utf8').includes('My revised Brazil argument during the conflict.'));
  await one.click('[data-keep-this-draft]');
  const remoteArchive=await one.evaluate(k=>JSON.parse(localStorage.getItem(k+'-archive-THREAD-DUTCH-RELIEF')||'null'),KEY);
  assert.equal(remoteArchive?.argument,'Dutch investigation saved by the second tab.','Resolving Brazil must not discard the other tab’s Dutch investigation');
  await two.close();await openDutch(one);assert.equal(await one.locator('[name=argument]').inputValue(),'Dutch investigation saved by the second tab.');
  await context.close();console.log('PASS: cross-investigation conflict preserves the other saved investigation and local recovery download.');
 }
 // A failed protective archive must block replacing the remote investigation.
 {
  const {context,one,two}=await pair();await switchDutch(two);await one.locator('#draftRecovery').waitFor({state:'visible'});
  await one.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.endsWith('-archive-THREAD-DUTCH-RELIEF'))throw new DOMException('Test quota','QuotaExceededError');return set.call(this,k,v);};});
  await one.click('[data-keep-this-draft]');
  assert.equal(await one.evaluate(k=>JSON.parse(localStorage.getItem(k)).threadId,KEY),'THREAD-DUTCH-RELIEF');
  assert(await one.locator('#draftRecovery').isVisible());assert.match(await one.locator('#draftRecovery').innerText(),/archiv|preserv|save/i);
  await context.close();console.log('PASS: failed archive blocks destructive conflict resolution.');
 }
 // Use the latest saved version, including edits made after the conflict first appeared.
 {
  const {context,one,two}=await pair();await two.fill('[name=argument]','Other tab, first version.');await one.locator('#draftRecovery').waitFor({state:'visible'});await two.fill('[name=argument]','Other tab, later version.');await one.click('[data-use-other-draft]');
  assert.equal(await one.locator('[name=argument]').inputValue(),'Other tab, later version.');
  await one.reload();await one.getByRole('button',{name:'Resume my thesis →',exact:true}).click();assert.equal(await one.locator('[name=argument]').inputValue(),'Other tab, later version.');
  await context.close();console.log('PASS: use-other resolution reads the latest saved version and survives reload.');
 }
 // Conflict detection must compare current storage even before its storage event arrives.
 {
  const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.click('#researchMode');await page.selectOption('#threadSelect','THREAD-BRAZIL-PATRONAGE');await page.click('#threadThesis');await page.fill('[name=argument]','Visible local draft before an unseen write.');
  await page.evaluate(k=>localStorage.setItem(k,JSON.stringify({threadId:'THREAD-DUTCH-RELIEF',argument:'Remote saved draft changed before notification.'})),KEY);
  await page.click('[data-thesis-stage=present]');await page.click('[data-file-portfolio]');assert.match(await page.locator('#portfolioStatus').innerText(),/not filed.*sav/i);
  assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).argument,KEY),'Remote saved draft changed before notification.');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('worldthreads-thesis-portfolios-v1')||'[]').length),0);
  await context.close();console.log('PASS: an unseen storage change blocks stale filing without overwriting the saved draft.');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
