/* Account-free research submissions and graph overlays. */
(function(){
 const API='https://worldthreads-community.stewartd.workers.dev';
 const core=window.WorldThreadsCommunity;
 let app=null,baseline=null,loaded=false,receipt=null,pollTimer=null,graphVersion='',updates=[];
 const $=id=>document.getElementById(id);
 const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
 function statusLabel(status){return {queued:'Saved · waiting for automatic review',reviewing:'Automatic source review running',retry:'Saved · automatic retry scheduled',automated_support:'Passed automated checks',automated_counterevidence:'Counterevidence found',disputed:'Conflicting or contrary evidence',provisional:'Provisional · unresolved evidence',needs_correction:'Correction needed · factual evidence and civil wording required',review_unavailable:'Saved privately · automatic review unavailable'}[status]||status;}
 async function api(path,options={}){
  const response=await fetch(API+path,options);const result=await response.json();if(!response.ok)throw Error(result.errors?.join('\n')||result.error||'The research service is temporarily unavailable.');return result;
 }
 function saveReceipt(value){receipt=value;try{localStorage.setItem('worldthreads-receipt',JSON.stringify(value));}catch{}renderReceipt();}
 function receiptURL(value){const u=new URL(location.href);u.hash='receipt='+value.id+'.'+value.receipt;return u.href;}
 function loadReceipt(){
  const m=location.hash.match(/^#receipt=([a-f0-9]{32})\.([a-f0-9]{64})$/);
  if(m)return {id:m[1],receipt:m[2]};
  try{return JSON.parse(localStorage.getItem('worldthreads-receipt')||'null');}catch{return null;}
 }
 function renderReceipt(){
  $('receiptPanel').hidden=!receipt;if(!receipt)return;
  $('receiptLink').href=receiptURL(receipt);$('receiptLink').textContent='Keep this private progress link';
  $('receiptId').textContent='Submission '+receipt.id.slice(0,12);
 }
 function publicLink(label,url){const a=el('a',label);try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return el('span',label);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a;}catch{return el('span',label);}}
 async function publicData(path,fallback){
  try{return await api(path);}catch{const response=await fetch(fallback);if(!response.ok)throw Error('No saved snapshot available.');return response.json();}
 }
 async function refreshGraph(){
  try{
   const result=await publicData('/api/graph','data/community/graph.json'),version=JSON.stringify(result);
   if(version===graphVersion)return;graphVersion=version;updates=result.evidenceUpdates||[];
   const selected=app.state.threadId;
   for(const category of ['observations','relationships','sources','evidence','threads'])app.state[category]=structuredClone(baseline[category]);
   for(const patch of result.patches||[]){
    for(const category of ['observations','relationships','sources','evidence']){
     const ids=new Set(app.state[category].map(r=>r.id));for(const r of patch[category]||[])if(!ids.has(r.id)){app.state[category].push(r);ids.add(r.id);}
    }
    if(patch.thread&&!app.state.threads.some(t=>t.id===patch.thread.id))app.state.threads.push(patch.thread);
    const t=app.state.threads.find(t=>t.id===patch.extension?.threadId);
    if(t){t.nodeIds=[...new Set([...t.nodeIds,...patch.extension.nodeIds])];t.relationshipIds=[...new Set([...t.relationshipIds,...patch.extension.relationshipIds])];}
   }
   for(const c of [...app.state.observations,...app.state.relationships]){
    c.communityEvidence=updates.filter(e=>e.claimId===c.id);
    if(c.communityEvidence.some(e=>e.stance==='counterevidence'&&e.assessment==='automated_support'))c.communityStatus='disputed';
   }
   app.state.threadId=app.state.threads.some(t=>t.id===selected)?selected:app.state.threads[0]?.id;
   app.render();populateClaims();
   $('communityService').textContent='Direct submissions are available. No account required.';
  }catch(error){$('communityService').textContent='The research service is temporarily unavailable. You can still prepare and download your research.';}
 }
 function populateClaims(){
  const select=$('evidenceClaim'),previous=select.value;select.replaceChildren();
  for(const [label,records]of [['Facts',app.state.observations],['Relationships',app.state.relationships]]){
   const group=document.createElement('optgroup');group.label=label;
   for(const c of records){const option=el('option',c.title||`${app.obs(c.subjectId)?.title||c.subjectId} → ${app.obs(c.objectId)?.title||c.objectId}`);option.value=c.id;group.appendChild(option);}select.appendChild(group);
  }
  if([...select.options].some(o=>o.value===previous))select.value=previous;
 }
 function reviewSummary(review,parent){
  if(!review)return;
  for(const c of review.claims||[]){
   const article=el('article',undefined,'review-result');article.append(el('strong',`${c.claimId} · ${statusLabel(c.status)}`));
   const reasons=el('ul');for(const reason of c.reasons||[])reasons.appendChild(el('li',reason));article.appendChild(reasons);
   if(c.limitations?.length)article.appendChild(el('p','Limits: '+c.limitations.join(' ')));
   if(c.alternatives?.length)article.appendChild(el('p','Other explanations to test: '+c.alternatives.join(' ')));
   parent.appendChild(article);
  }
 }
 async function checkReceipt(){
  if(!receipt)return;
  try{
   const result=await api('/api/submissions/'+receipt.id,{headers:{Authorization:'Bearer '+receipt.receipt}});
   $('receiptStatus').textContent=statusLabel(result.status);const log=$('receiptEvents');log.replaceChildren();
   for(const e of result.events||[]){const entry=el('li',`${e.phase.replaceAll('_',' ')}: ${e.message||e.status||'Complete'}`);log.appendChild(entry);}
   $('receiptReview').replaceChildren();if(result.review?.message)$('receiptReview').appendChild(el('p',result.review.message));reviewSummary(result.review,$('receiptReview'));if(result.status==='needs_correction')$('receiptReview').appendChild(Object.assign(el('button','Revise these findings','nav-btn'),{onclick:()=>window.WorldThreadsExplore?.showReturn()}));
   if(['queued','reviewing','retry'].includes(result.status)){
    clearTimeout(pollTimer);if(document.visibilityState!=='hidden')pollTimer=setTimeout(checkReceipt,15000);
   }else{clearTimeout(pollTimer);await refreshGraph();await refreshActivity();if(['automated_support','automated_counterevidence','provisional'].includes(result.status)){const record=[...app.state.observations,...app.state.relationships].find(r=>r.submissionId===receipt.id||r.communityEvidence?.some(e=>e.submissionId===receipt.id));if(record)$('receiptReview').appendChild(Object.assign(el('button',result.status==='provisional'?'Explore the unresolved finding':'See your contribution in the thread','nav-btn'),{onclick:()=>window.WorldThreadsExplore?.showRecord(record.id)}));}}
  }catch(error){$('receiptStatus').textContent=error.message;}
 }
 async function refreshActivity(){
  try{
   const records=await publicData('/api/activity','data/community/activity.json');const root=$('communityActivity');root.replaceChildren();
   if(!records.length){root.appendChild(el('p','No community findings yet. Start with a place or a thread that interests you.'));return;}
   for(const r of records){
    const article=el('article',undefined,'review-result');article.append(el('h4',r.title),el('p',`${r.alias} · ${statusLabel(r.status)} · ${r.at.slice(0,10)}`));
    for(const badge of r.recognition||[])article.appendChild(el('p',badge.title+' · '+(badge.status==='questioned'?'New counterevidence questions its supporting records. ':badge.basis),'review-label'));
    const details=el('details'),summary=el('summary','Sources, checks and open questions');details.appendChild(summary);reviewSummary(r.review,details);
    for(const check of r.review?.sourceChecks||[])details.appendChild(el('p',`${check.locator}: ${check.reason}`));
    if(r.review?.search?.leads?.length){details.appendChild(el('p','Further research leads (not corroborating evidence):'));for(const lead of r.review.search.leads)details.appendChild(publicLink(lead.title||lead.doi,lead.url));}
    article.appendChild(details);historyButton(r.id,article);root.appendChild(article);
   }
  }catch{$('communityActivity').textContent='Community findings will appear here when the research service is reachable.';}
 }
 function errorList(errors){const root=$('communityErrors');root.replaceChildren();for(const error of errors)root.appendChild(el('li',error));}
 function readDraft(){const text=$('researchOutput').value.trim();if(!text)throw Error('Paste your research output or choose its JSON file first.');return JSON.parse(text);}
 function previewDraft(forSubmission=false){
  const root=$('graphPreview');root.replaceChildren();
  try{
   const draft=readDraft();$('researchConsent').closest('label').hidden=draft.kind==='research_note';$('submitResearch').hidden=draft.kind==='research_note';if(draft.kind==='research_note'){root.appendChild(el('h4','Research notes · no proposed graph changes'));root.appendChild(el('p',draft.conclusion||'No supported finding recorded.'));$('communitySubmitStatus').textContent='These notes are saved on this device. Download them or continue investigating; they are not published as a finding.';errorList([]);return null;}const payload=draft.kind==='evidence'?{...draft,consent:$('researchConsent').checked}:{kind:'research',draft,consent:$('researchConsent').checked};
   const errors=core.validateCommunity(forSubmission?payload:{...payload,consent:true},app.state,WorldThreadsIntake);errorList(errors);
   if(errors.length){$('communitySubmitStatus').textContent='Please correct the listed items.';return null;}
   if(payload.kind==='evidence'){root.appendChild(el('h4','Evidence for an existing claim'));root.appendChild(el('p',payload.claimId+' · '+payload.stance));root.appendChild(el('blockquote',payload.quote));root.appendChild(el('p',payload.relevance));$('communitySubmitStatus').textContent='Evidence structure checks passed. Automatic review will assess the passage against the recorded claim.';return payload;}root.appendChild(el('h4','Proposed graph changes'));
   for(const o of draft.observations)root.appendChild(el('p',`New fact: ${o.title} · ${o.startDate} · ${o.place}`));
   const find=id=>draft.observations.find(o=>o.id===id)||app.obs(id);
   for(const r of draft.relationships)root.appendChild(el('p',`${find(r.subjectId)?.title||r.subjectId} → ${r.predicate.replaceAll('_',' ')} → ${find(r.objectId)?.title||r.objectId}`));
   root.appendChild(el('p',draft.proposedThread?'New branch: '+draft.proposedThread.title:'Extend: '+(app.state.threads.find(t=>t.id===draft.context.threadId)?.title||'research findings')));
   root.appendChild(el('p','Source review sets the status of each fact and relationship. Contradicted new claims stay in the review history.'));
   $('communitySubmitStatus').textContent='Structure checks passed. Review the proposed changes, then submit for automatic assessment.';return payload;
  }catch(error){errorList([error instanceof SyntaxError?'The output is not valid JSON. Use the prescribed research template.':error.message]);return null;}
 }
 async function submit(payload,button,status){
  button.disabled=true;status.textContent='Saving your research…';errorList([]);
  try{
   // Keep the receipt stable across a network retry so duplicate submissions can recover it.
   const fingerprint=JSON.stringify(payload);let capability;
   try{const previous=JSON.parse(sessionStorage.getItem('worldthreads-pending-request')||'null');if(previous?.fingerprint===fingerprint)capability=previous.capability;}catch{}
   if(!capability)capability=[...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join('');
   try{sessionStorage.setItem('worldthreads-pending-request',JSON.stringify({fingerprint,capability}));}catch{}
   const result=await api('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,receipt:capability})});
   saveReceipt({id:result.id,receipt:result.receipt});status.textContent='Saved. Automatic review is running; keep your private receipt to follow progress.';
   window.WorldThreadsExplore?.showProgress();await checkReceipt();$('receiptPanel').scrollIntoView({behavior:'smooth'});
  }catch(error){status.textContent=error.message;}finally{button.disabled=false;}
 }
 function bind(){
  $('contributionFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;if(file.size>core.MAX_BYTES){$('communitySubmitStatus').textContent='Keep submissions under 80 KB.';return;}try{$('researchOutput').value=await file.text();$('researchOutput').dispatchEvent(new Event('input')); $('communitySubmitStatus').textContent='Research loaded. Confirm public publication, preview the graph changes, then submit.';}catch{$('communitySubmitStatus').textContent='Could not read this file.';}});
  $('researchOutput').addEventListener('input',()=>{$('researchConsent').closest('label').hidden=false;$('submitResearch').hidden=false;});
  $('previewResearch').addEventListener('click',()=>previewDraft());
  $('submitResearch').addEventListener('click',()=>{const payload=previewDraft(true);if(payload)submit(payload,$('submitResearch'),$('communitySubmitStatus'));});
  $('downloadResearchOutput').addEventListener('click',()=>app.downloadText('worldthreads-research-draft.json',$('researchOutput').value,'application/json'));
  $('evidenceForm').addEventListener('submit',e=>{e.preventDefault();const payload={kind:'evidence',claimId:$('evidenceClaim').value,stance:$('evidenceStance').value,alias:$('evidenceAlias').value.trim(),sourceTitle:$('evidenceTitle').value.trim(),sourceUrl:$('evidenceUrl').value.trim(),locator:$('evidenceLocator').value.trim(),quote:$('evidenceQuote').value.trim(),relevance:$('evidenceRelevance').value.trim(),limitations:$('evidenceLimits').value.trim(),consent:$('evidenceConsent').checked,honeypot:$('evidenceWebsite').value};const errors=core.validateCommunity(payload,app.state,WorldThreadsIntake);if(errors.length){$('evidenceSubmitStatus').textContent=errors.join(' ');return;}submit(payload,$('submitEvidence'),$('evidenceSubmitStatus'));});
  $('checkReceipt').addEventListener('click',checkReceipt);
  $('refreshCommunity').addEventListener('click',async()=>{await refreshGraph();await refreshActivity();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkReceipt();else clearTimeout(pollTimer);});
 }
 function chooseClaim(id,stance){$('evidenceClaim').value=id;$('evidenceStance').value=stance;app.closeDialog();window.WorldThreadsExplore?.showEvidence();$('evidenceForm').scrollIntoView({behavior:'smooth'});$('evidenceQuote').focus();}
 async function appendHistory(id,parent,button){
  button.disabled=true;
  try{const result=await api('/api/reviews/'+id);const section=el('section',undefined,'review-result');section.append(el('h4','Recorded review history'));const list=el('ol');for(const event of result.events){const entry=el('li',`${event.at.slice(0,19).replace('T',' ')} UTC · ${event.phase.replaceAll('_',' ')}: ${event.message||event.status||'Recorded'}`);list.appendChild(entry);}section.append(list);reviewSummary(result.summary.review,section);parent.append(section);button.textContent='Review history shown';}catch(error){parent.append(el('p',error.message));button.disabled=false;}
 }
 function historyButton(id,parent){const button=el('button','Show recorded review history','nav-btn');button.type='button';button.addEventListener('click',()=>appendHistory(id,parent,button));parent.append(button);}
 function attachActions(claim,parent){
  if(claim.communityStatus)parent.appendChild(el('p','Community assessment: '+statusLabel(claim.communityStatus),'review-label'));
  const group=el('div',undefined,'evidence-actions');
  for(const [label,stance]of [['Submit supporting evidence','supports'],['Submit counterevidence','counterevidence']]){const button=el('button',label,'nav-btn');button.type='button';button.addEventListener('click',()=>chooseClaim(claim.id,stance));group.appendChild(button);}parent.appendChild(group);if(claim.submissionId)historyButton(claim.submissionId,parent);
  for(const e of updates.filter(e=>e.claimId===claim.id)){
   const card=el('article',undefined,'review-result');card.append(el('strong',`${e.stance==='supports'?'Supporting evidence':'Counterevidence'} · ${statusLabel(e.assessment)}`),el('p',e.relevance),publicLink(e.sourceTitle,e.sourceUrl),el('p',e.locator),el('blockquote',e.quote),el('p','Limits: '+e.limitations));historyButton(e.submissionId,card);parent.appendChild(card);
  }
 }
 async function initialize(){
  if(loaded||!window.WorldThreadsApp?.state.threads.length)return;loaded=true;app=window.WorldThreadsApp;
  baseline={};for(const c of ['observations','relationships','sources','evidence','threads'])baseline[c]=structuredClone(app.state[c]);
  bind();populateClaims();receipt=loadReceipt();renderReceipt();await refreshGraph();await refreshActivity();await checkReceipt();
 }
 window.WorldThreadsCommunityUI={attachActions,statusLabel,chooseClaim,refreshGraph};
 window.addEventListener('worldthreads-ready',initialize);initialize();
})();
