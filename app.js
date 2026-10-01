const state={observations:[],relationships:[],threads:[],sources:[],evidence:[],gaps:[],badges:[],system:'ALL',threadId:null};

async function load(){
  const [observations,relationships,threads,sources,evidence,gaps,badges]=await Promise.all([
    fetch('data/1816/observations.json').then(r=>r.json()),
    fetch('data/1816/relationships.json').then(r=>r.json()),
    fetch('data/1816/threads.json').then(r=>r.json()),
    fetch('data/1816/sources.json').then(r=>r.json()),
    fetch('data/1816/evidence.json').then(r=>r.json()),
    fetch('data/1816/research-gaps.json').then(r=>r.json()),
    fetch('data/contribution-badges.json').then(r=>r.json())
  ]);
  Object.assign(state,{observations,relationships,threads,sources,evidence,gaps,badges,threadId:threads[0]?.id||null});
  bind(); render(); bindContributions();
}

function bind(){
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); state.system=btn.dataset.system; renderCards();
  }));
  document.querySelectorAll('.map-node').forEach(btn=>btn.addEventListener('click',()=>{
    const first=state.observations.find(o=>o.continent===btn.dataset.region && !o.contextNode) || state.observations.find(o=>o.continent===btn.dataset.region);
    if(first) openDetail(first);
  }));
  document.getElementById('threadSelect').addEventListener('change',e=>{state.threadId=e.target.value;renderThread();});
  document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('detailDialog').close());
}

function render(){ renderStats(); renderThreadOptions(); renderThread(); renderCards(); }

function renderStats(){
  const high=state.observations.filter(o=>o.confidence==='High').length;
  const continents=new Set(state.observations.map(o=>o.continent));
  document.getElementById('statObservations').textContent=state.observations.length;
  document.getElementById('statThreads').textContent=state.threads.length;
  document.getElementById('statSources').textContent=state.sources.length;
  document.getElementById('statRelations').textContent=state.relationships.length;
  document.getElementById('highConfidence').textContent=high;
  document.getElementById('regionsCovered').textContent=continents.size;
}

function renderThreadOptions(){
  const select=document.getElementById('threadSelect'); select.innerHTML='';
  state.threads.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.textContent=t.title;select.appendChild(o);});
  if(state.threadId) select.value=state.threadId;
}

function renderThread(){
  const thread=state.threads.find(t=>t.id===state.threadId)||state.threads[0]; if(!thread)return;
  document.getElementById('threadTitle').textContent=thread.title;
  document.getElementById('threadSubtitle').textContent=thread.subtitle||'';
  document.getElementById('threadDescription').textContent=thread.description||'';
  const root=document.getElementById('threadGraph'); root.innerHTML='';
  document.querySelector('.thread-connections')?.remove();
  thread.nodeIds.forEach(id=>{
    const o=obs(id); if(!o)return;
    const node=document.createElement('button'); node.className='thread-node active-node';
    node.innerHTML=`<span class="system">${escapeHtml(o.system)}</span><strong>${escapeHtml(o.title)}</strong><small>${escapeHtml(o.place||'')}</small>`;
    node.addEventListener('click',()=>openDetail(o)); root.appendChild(node);

  });
  const connections=document.createElement('section'); connections.className='thread-connections';
  const extend=document.createElement('button');extend.className='nav-btn';extend.textContent='Research beyond this thread';extend.addEventListener('click',()=>{const region=thread.scope||'';const gap=state.gaps.find(g=>g.region===region||g.region.includes(region));if(gap){const select=document.getElementById('researchGap');select.value=gap.id;select.dispatchEvent(new Event('change'));}document.getElementById('contribute').scrollIntoView({behavior:'smooth'});document.getElementById('researchGap').focus();});connections.appendChild(extend);
  const heading=document.createElement('h4'); heading.textContent='Connections and hypotheses'; connections.appendChild(heading);
  (thread.relationshipIds||[]).forEach(id=>{
    const r=state.relationships.find(r=>r.id===id); if(!r)return;
    const el=document.createElement('div'); el.className='relation-item';
    [r.subjectId,r.objectId].forEach((nodeId,i)=>{
      if(i){const label=document.createElement('span');label.textContent=` → ${r.predicate.replaceAll('_',' ')} → `;el.appendChild(label);}
      const button=document.createElement('button');button.className='connection-node';button.textContent=obs(nodeId)?.title||nodeId;button.addEventListener('click',()=>openDetail(obs(nodeId)));el.appendChild(button);
    });
    const detail=document.createElement('p'); detail.textContent=`${r.causalStatus} · ${r.confidence} confidence · ${r.lag||'Lag unknown'} — ${r.explanation}`;el.appendChild(detail);connections.appendChild(el);
  });
  root.after(connections);

}

function renderCards(){
  const root=document.getElementById('cards');
  const filtered=state.observations.filter(o=>(state.system==='ALL'||o.system===state.system));
  document.getElementById('countLabel').textContent=`${filtered.length} of ${state.observations.length} shown`;
  root.innerHTML='';
  filtered.forEach(o=>{
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`<div class="card-top"><span class="pill">${escapeHtml(o.system)}</span><span class="confidence">${escapeHtml(o.confidence)}</span></div><h4>${escapeHtml(o.title)}</h4><p>${escapeHtml(o.observation)}</p><div class="meta"><span>${escapeHtml(o.startDate)}</span><span>${escapeHtml(o.continent)}</span><span>${escapeHtml(o.place)}</span><span>${escapeHtml(o.coverageType)}</span></div>`;
    el.addEventListener('click',()=>openDetail(o)); root.appendChild(el);
  });
}

function openDetail(o){
  const dlg=document.getElementById('detailDialog'); const content=document.getElementById('dialogContent');
  const rels=state.relationships.filter(r=>r.subjectId===o.id||r.objectId===o.id);
  const sourceLinks=(o.sourceRefs||[]).map(id=>source(id)).filter(Boolean).map(s=>`<a class="source-badge" href="${escapeAttr(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.id)} · ${escapeHtml(s.authorOrOrg)}</a>`).join('');
  const relHtml=rels.map(r=>{const other=obs(r.subjectId===o.id?r.objectId:r.subjectId);const direction=r.subjectId===o.id?'→':'←';return `<div class="relation-item"><b>${direction} ${escapeHtml(r.predicate.replaceAll('_',' '))}</b> ${escapeHtml(other?.title||'Unknown node')}<br><span>${escapeHtml(r.explanation||'')} · ${escapeHtml(r.confidence)} confidence</span>${renderCausalReview(r)}${renderEvidence(r)}</div>`}).join('');
  content.innerHTML=`<p class="eyebrow">${escapeHtml(o.id)}</p><h2>${escapeHtml(o.title)}</h2><p>${escapeHtml(o.observation)}</p><dl class="detail-grid"><dt>Date</dt><dd>${escapeHtml(o.startDate)}${o.endDate&&o.endDate!==o.startDate?' → '+escapeHtml(o.endDate):''}</dd><dt>System</dt><dd>${escapeHtml(o.system)}</dd><dt>Role</dt><dd>${escapeHtml((o.analyticalRole||[]).join(', '))}</dd><dt>Coverage</dt><dd>${escapeHtml(o.coverageType)}</dd><dt>Region</dt><dd>${escapeHtml(o.region)}</dd><dt>Entity</dt><dd>${escapeHtml(o.historicalEntity)}</dd><dt>Place</dt><dd>${escapeHtml(o.place)}</dd><dt>Review status</dt><dd>${escapeHtml(o.researchStatus)}</dd><dt>Confidence</dt><dd>${escapeHtml(o.confidence)}</dd><dt>Evidence</dt><dd>${escapeHtml((o.evidenceType||[]).join(', '))}</dd>${o.value?`<dt>Value</dt><dd>${escapeHtml(o.value)} ${escapeHtml(o.unit||'')}</dd>`:''}${o.baseline?`<dt>Baseline</dt><dd>${escapeHtml(o.baseline)}</dd>`:''}${o.anomaly?`<dt>Anomaly</dt><dd>${escapeHtml(o.anomaly)}</dd>`:''}</dl><h3>Sources</h3><div class="source-badges">${sourceLinks||'No source registry entries yet.'}</div>${renderEvidence(o)}<h3>Connections</h3><div class="relation-list">${relHtml||'<div class="relation-item">No explicit graph relationships added yet.</div>'}</div>`;
  dlg.showModal();
}

function renderEvidence(claim){
  const records=(claim.evidenceRefs||[]).map(id=>state.evidence.find(e=>e.id===id)).filter(Boolean);
  if(!records.length)return '<p class="review-note">Passage-level evidence not yet registered.</p>';
  return '<div class="evidence-records">'+records.map(e=>{
    const source=state.sources.find(s=>s.id===e.sourceId);
    const url=source?.fullTextUrl||source?.url;
    const label=`${escapeHtml(e.sourceId)} · ${escapeHtml(e.locator)}`;
    return `<p><strong>${url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`:label}</strong><br>${escapeHtml(e.provenance)}<br>${escapeHtml(e.limitations)}<br>Review: ${escapeHtml(e.reviewStatus.replaceAll('_',' '))}</p>`;
  }).join('')+'</div>';
}
function renderCausalReview(r){
  const c=r.causalReview;
  if(!c)return '<p class="review-note">Competing explanations have not yet been systematically reviewed.</p>';
  const alternatives=(c.alternatives||[]).map(a=>`<li><strong>${escapeHtml(a.assessment)} · ${escapeHtml(a.kind.replaceAll('_',' '))}</strong>: ${escapeHtml(a.explanation)}<br>${escapeHtml(a.evidenceNote||'')} ${escapeHtml((a.sourceRefs||[]).join(', '))} ${escapeHtml(a.locator||'')}<br>Evidence to seek: ${escapeHtml((a.distinguishingEvidence||[]).join(' '))}</li>`).join('');
  return `<details class="causal-review"><summary>Other explanations and open questions</summary><p>${escapeHtml(c.searchStatus)}</p>${alternatives?'<ul>'+alternatives+'</ul>':'<p>No alternatives registered yet; review remains open.</p>'}<p>Counterevidence: ${escapeHtml((c.counterevidence||[]).map(e=>e.description).join(' ')||'Not yet registered.')}</p><p>Next evidence: ${escapeHtml((c.distinguishingEvidence||[]).join(' '))}</p></details>`;
}
function obs(id){return state.observations.find(o=>o.id===id)}
function source(id){return state.sources.find(s=>s.id===id)}
function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(str=''){return escapeHtml(str)}

load().catch(err=>{document.getElementById('cards').innerHTML=`<p>Could not load prototype data: ${escapeHtml(err.message)}</p>`;});

let pendingContribution=null;
function researchTemplate(gap,thread){
  return {schemaVersion:1,context:{gapId:gap.id,threadId:thread.id,question:gap.question},contributor:{name:'Your name or alias'},review:{status:'pending'},sources:[{id:'C-SRC-001',type:'Source type',authorOrOrg:'Author or institution',title:'Source title',year:null,url:'https://example.org/replace-with-inspected-source',quality:'Unassessed',topics:[],notes:'Record publication version and dependence on other sources.'}],observations:[{id:'C-OBS-001',title:'Bounded proposed observation',startDate:'1816',endDate:'1816',datePrecision:'YEAR',continent:gap.region,region:gap.region,historicalEntity:'Specify historical entity',place:'Specify locality',observation:'Replace with a claim supported by the inspected passage.',coverageType:'EVENT',system:'HUMAN SYSTEMS',topic:gap.domain,analyticalRole:['OUTCOME'],evidenceType:['Specify evidence type'],confidence:'Low',sourceRefs:['C-SRC-001'],researchStatus:'Contributor draft; independent review pending',evidenceRefs:['C-EV-001']}],relationships:[],evidence:[{id:'C-EV-001',claimId:'C-OBS-001',sourceId:'C-SRC-001',locator:'Page, section or dated entry',accessedAt:new Date().toISOString().slice(0,10),provenance:'Describe exactly what was inspected',limitations:'State source limits and uninspected originals',reviewer:'Your name or alias',reviewStatus:'pending_independent_review',accessScope:'full_text'}],searchLog:[{query:'Search for rival causes, vulnerabilities, counterexamples and resilience',result:'Record inspected sources, findings and unsuccessful searches.'}]};
}
function downloadText(name,text,type='text/plain'){
  const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function bindContributions(){
  const badgeRoot=document.getElementById('contributionBadges');
  state.badges.forEach(b=>{const card=document.createElement('article');card.className='badge-card';const title=document.createElement('h4');title.textContent=b.title;const description=document.createElement('p');description.textContent=b.description;card.append(title,description);badgeRoot.appendChild(card);});
  const select=document.getElementById('researchGap');
  state.gaps.forEach(g=>{const option=document.createElement('option');option.value=g.id;option.textContent=`${g.region} · ${g.status}`;select.appendChild(option);});
  const selected=()=>state.gaps.find(g=>g.id===select.value);
  const update=()=>{document.getElementById('gapQuestion').textContent=selected()?.question||'';document.getElementById('researchKit').hidden=true;};update();select.addEventListener('change',update);
  let kit=null,prompt='';
  document.getElementById('makeResearchPrompt').addEventListener('click',()=>{
    const gap=selected(),thread=state.threads.find(t=>t.id===state.threadId);if(!gap||!thread)return;
    kit=researchTemplate(gap,thread);
    prompt=`Research contribution for WorldThreads\n\nStarting thread: ${thread.title} (${thread.id})\nOpen question: ${gap.question} (${gap.id})\nCore window: 1814–1818; label later context explicitly.\n\nFollow research → review → audit → fix:\n1. Bound the place, dates and question. Inspect relevant original or scholarly passages. Record source title, author, URL, version, access date and precise page/section locator. Say when only an abstract, transcription or retelling was accessible.\n2. Make the smallest supported observations. Separate measurements, reported expectations and later inferences. Preserve historical names and source bias. Do not invent missing figures.\n3. Review every proposed connection separately. Search for rival explanations, prior conditions, interacting cofactors, counterevidence and resilience. Record failed searches. Chronology alone is not causation. Several retellings of one text are not independent corroboration.\n4. Return a JSON file using the output template below. Use unique local IDs; connect each claim to passage-level evidence. For causal or contested relationships include causalReview with primaryExplanation, assessment, priorConditions, alternatives (id, explanation, kind, assessment, sourceRefs, locator, evidenceNote, distinguishingEvidence), counterevidence, distinguishingEvidence, searchStatus and reviewStatus.\n5. Fix unsupported wording and unresolved references before returning. Leave all records as contributor drafts pending independent review. Include uncertainty and what evidence could change your conclusion. Do not claim approval or publish directly.\n\nExisting observation IDs that may be referenced: ${thread.nodeIds.join(', ')}.\nAn empty relationships array is valid when no connection is supported.\nReplace all template placeholders; do not submit them as findings.\n\nOUTPUT TEMPLATE\n${JSON.stringify(kit,null,2)}`;
    document.getElementById('researchPrompt').value=prompt;document.getElementById('researchKit').hidden=false;
  });
  document.getElementById('downloadResearchPrompt').addEventListener('click',()=>downloadText('worldthreads-research-prompt.txt',prompt));
  document.getElementById('downloadResearchTemplate').addEventListener('click',()=>downloadText('worldthreads-output-template.json',JSON.stringify(kit,null,2),'application/json'));
  document.getElementById('contributionFile').addEventListener('change',async e=>{
    pendingContribution=null;const status=document.getElementById('contributionStatus'),list=document.getElementById('contributionErrors'),button=document.getElementById('downloadSubmission');list.replaceChildren();button.hidden=true;
    const file=e.target.files[0];if(!file)return;status.textContent='Checking your draft…';
    try{
      if(file.size>2*1024*1024)throw Error('Please keep each contribution under 2 MB.');
      const draft=JSON.parse(await file.text());const errors=WorldThreadsIntake.validateSubmission(draft,state);
      if(errors.length){status.textContent='Please fix these items before review.';for(const error of errors){const li=document.createElement('li');li.textContent=error;list.appendChild(li);}return;}
      pendingContribution=draft;status.textContent=`Structure checks passed: ${draft.observations.length} proposed observations and ${draft.relationships.length} connections. Historical verification is still pending. Nothing has been added to the graph.`;button.hidden=false;
    }catch(error){status.textContent=`Could not check the draft: ${error.message}`;}
  });
  document.getElementById('downloadSubmission').addEventListener('click',()=>{if(pendingContribution)downloadText('worldthreads-pending-review.json',JSON.stringify(pendingContribution,null,2),'application/json');});
}
