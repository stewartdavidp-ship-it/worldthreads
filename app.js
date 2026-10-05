const state={observations:[],relationships:[],threads:[],sources:[],mechanisms:[],gaps:[],region:'ALL',query:'',period:'ALL',evidence:'ALL',sort:'date',system:'ALL',threadId:null};

async function load(){
  const [observations,relationships,threads,sources,mechanisms,gaps]=await Promise.all([
    fetch('data/1816/observations.json').then(r=>r.json()),
    fetch('data/1816/relationships.json').then(r=>r.json()),
    fetch('data/1816/threads.json').then(r=>r.json()),
    fetch('data/1816/sources.json').then(r=>r.json()),
    fetch('data/mechanisms.json').then(r=>r.json()),
    fetch('data/1816/research-gaps.json').then(r=>r.json())
  ]);
  Object.assign(state,{observations,relationships,threads,sources,mechanisms,gaps,threadId:threads[0]?.id||null});
  bind(); render();
}

function bind(){
  document.querySelectorAll('.filter[data-system]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter[data-system]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); state.system=btn.dataset.system; renderCards();
  }));
  document.querySelectorAll('.map-node').forEach(btn=>btn.addEventListener('click',()=>{
    state.region=btn.dataset.region; document.getElementById('regionSelect').value=state.region; renderCards(); document.getElementById('evidence').scrollIntoView({behavior:'smooth'});
  }));
  document.getElementById('threadSelect').addEventListener('change',e=>{state.threadId=e.target.value;renderThread();});
  document.getElementById('searchInput').addEventListener('input',e=>{state.query=e.target.value;renderCards();});
  document.getElementById('regionSelect').addEventListener('change',e=>{state.region=e.target.value;renderCards();});
  document.getElementById('clearFilters').addEventListener('click',()=>{state.query='';state.region='ALL';state.system='ALL';state.period='ALL';state.evidence='ALL';state.sort='date';document.getElementById('periodSelect').value='ALL';document.getElementById('evidenceSelect').value='ALL';document.getElementById('sortSelect').value='date';document.getElementById('searchInput').value='';document.getElementById('regionSelect').value='ALL';document.querySelectorAll('.filter[data-system]').forEach(b=>b.classList.toggle('active',b.dataset.system==='ALL'));renderCards();});
  document.getElementById('dialogContent').addEventListener('click',e=>{
    const o=e.target.closest('[data-observation]');if(o){openDetail(obs(o.dataset.observation));return;}
    const r=e.target.closest('[data-relationship]');if(r){openRelationship(state.relationships.find(x=>x.id===r.dataset.relationship));return;}
    const h=e.target.closest('[data-history]');if(h){const index=Number(h.dataset.history);if(index>=0&&index<=inspector.index){inspector.index=index;inspector.tab='connections';inspector.linkFilter='all';renderInspector(true);}return;}
    const tab=e.target.closest('[data-inspector-tab]');if(tab){inspector.tab=tab.dataset.inspectorTab;renderInspector();return;}
    const thread=e.target.closest('[data-thread]');if(thread){selectThread(thread.dataset.thread);document.getElementById('detailDialog').close();}
  });
  document.getElementById('dialogContent').addEventListener('change',e=>{if(e.target.id==='linkFilter'){inspector.linkFilter=e.target.value;renderInspector();document.getElementById('linkFilter').focus();}});
  for(const [id,key] of [['periodSelect','period'],['evidenceSelect','evidence'],['sortSelect','sort']])document.getElementById(id).addEventListener('change',e=>{state[key]=e.target.value;renderCards();});
  document.getElementById('researchGaps').addEventListener('click',e=>{const o=e.target.closest('[data-observation]');if(o)openDetail(obs(o.dataset.observation));const t=e.target.closest('[data-thread]');if(t)selectThread(t.dataset.thread);});
  document.getElementById('mechanismPanel').addEventListener('click',e=>{const o=e.target.closest('[data-observation]');if(o)openDetail(obs(o.dataset.observation));});
  document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('detailDialog').close());
}

function render(){
  renderStats(); renderThreadOptions(); renderThread(); renderCards();
  const select=document.getElementById('regionSelect');
  [...new Set(state.observations.map(o=>o.continent))].sort().forEach(region=>{const option=document.createElement('option');option.value=region;option.textContent=region;select.appendChild(option);});
  const evidenceSelect=document.getElementById('evidenceSelect');
  [...new Set(state.observations.flatMap(o=>o.evidenceType))].sort().forEach(type=>{const option=document.createElement('option');option.value=type;option.textContent=type;evidenceSelect.appendChild(option);});
  document.getElementById('researchGaps').innerHTML=state.gaps.map(g=>`<article class="relation-item"><h4>${escapeHtml(g.region)} · ${escapeHtml(g.status)}</h4><p>${escapeHtml(g.question)}</p><p>${escapeHtml(g.notes||'')}</p><details><summary>${g.observationIds?.length||0} linked records · evidence added</summary><div class="gap-links">${(g.observationIds||[]).map(id=>`<button class="filter" data-observation="${escapeAttr(id)}">${escapeHtml(obs(id)?.title||id)}</button>`).join('')}</div><div class="gap-links">${(g.threadIds||[]).map(id=>`<button class="filter" data-thread="${escapeAttr(id)}">Thread: ${escapeHtml(state.threads.find(t=>t.id===id)?.title||id)}</button>`).join('')}</div></details><h5>Still unresolved</h5><ul>${(g.remainingQuestions||[]).map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ul></article>`).join('');

}

function renderStats(){
  const high=state.observations.filter(o=>o.confidence==='High').length;
  const continents=new Set(state.observations.map(o=>o.continent));
  document.getElementById('statObservations').textContent=state.observations.length;
  document.getElementById('statThreads').textContent=state.threads.length;
  document.getElementById('statSources').textContent=state.sources.length;
  document.getElementById('statRelations').textContent=state.relationships.length;
  document.getElementById('highConfidence').textContent=high;
  document.getElementById('regionsCovered').textContent=[...continents].filter(c=>c!=='Oceans').length;
  document.getElementById('yearRecords').textContent=state.observations.filter(overlaps1816).length;
  document.getElementById('contextRecords').textContent=state.observations.filter(o=>!overlaps1816(o)).length;
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
  document.getElementById('threadDescription').textContent=(thread.description||'')+' Thread confidence: '+thread.confidence+'.';
  const root=document.getElementById('threadGraph'); root.innerHTML='';
  const makeNode=id=>{
    const o=obs(id); const node=document.createElement('button');node.className='thread-node active-node';
    node.innerHTML=`<span class="system">${escapeHtml(o.system)}</span><strong>${escapeHtml(o.title)}</strong><small>${escapeHtml(o.startDate)} · ${escapeHtml(o.place)}</small>`;
    node.addEventListener('click',()=>openDetail(o));return node;
  };
  // Each row uses actual endpoints: curated threads can branch or skip nodes.
  (thread.relationshipIds||[]).forEach(id=>{
    const r=state.relationships.find(r=>r.id===id); if(!r)return;
    const row=document.createElement('div');row.className='connection-row';
    row.appendChild(makeNode(r.subjectId));
    const edge=document.createElement('button');edge.className='edge-label '+r.causalStatus.toLowerCase();
    edge.innerHTML=`<span>${escapeHtml(r.predicate.replaceAll('_',' '))} →<br><b>${escapeHtml(r.causalStatus)}</b><br>${escapeHtml(r.confidence)} confidence · ${escapeHtml(r.lag||'')}</span>`;
    edge.addEventListener('click',()=>openRelationship(r));row.appendChild(edge);row.appendChild(makeNode(r.objectId));root.appendChild(row);
  });
  const connected=new Set((thread.relationshipIds||[]).flatMap(id=>{const r=state.relationships.find(r=>r.id===id);return r?[r.subjectId,r.objectId]:[]}));
  thread.nodeIds.filter(id=>!connected.has(id)).forEach(id=>root.appendChild(makeNode(id)));
  document.getElementById('mechanismPanel').innerHTML=(thread.mechanismIds||[]).map(id=>{
    const m=state.mechanisms.find(m=>m.id===id);if(!m)return '';
    const similar=state.threads.filter(t=>t.id!==thread.id&&(t.mechanismIds||[]).includes(id));
    return `<details><summary>${escapeHtml(m.name)} · ${escapeHtml(m.status)}</summary><p>${escapeHtml(m.description)}</p><p>Possible buffers: ${escapeHtml(m.resilienceFactors.join(', ')||'Not yet documented')}.</p><p>Counterexamples and limits: ${escapeHtml(m.counterexamples?.join('; ')||'Not yet documented; absence is not confirmation')}.</p><div class="gap-links">${(m.counterexampleObservationIds||[]).map(id=>`<button class="filter" data-observation="${escapeAttr(id)}">Inspect: ${escapeHtml(obs(id)?.title||id)}</button>`).join('')}</div>${similar.map(t=>`<button class="filter" data-thread="${escapeAttr(t.id)}">Compare: ${escapeHtml(t.title)}</button>`).join('')}</details>`;
  }).join('');
  document.getElementById('mechanismPanel').onclick=e=>{const b=e.target.closest('[data-thread]');if(b){state.threadId=b.dataset.thread;document.getElementById('threadSelect').value=state.threadId;renderThread();}};

}

function renderCards(){
  const root=document.getElementById('cards');
  const filtered=state.observations.filter(o=>(state.system==='ALL'||o.system===state.system)&&(state.region==='ALL'||o.continent===state.region)&&(!state.query||JSON.stringify(o).toLowerCase().includes(state.query.toLowerCase()))&&(state.period==='ALL'||(state.period==='YEAR'?overlaps1816(o):!overlaps1816(o)))&&(state.evidence==='ALL'||o.evidenceType.includes(state.evidence))).sort((a,b)=>state.sort==='title'?a.title.localeCompare(b.title):a.startDate.localeCompare(b.startDate)||a.title.localeCompare(b.title));
  document.getElementById('countLabel').textContent=`${filtered.length} of ${state.observations.length} shown`;
  root.innerHTML='';
  if(!filtered.length)root.innerHTML='<p>No matching evidence. Try clearing the filters.</p>';
  filtered.forEach(o=>{
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`<div class="card-top"><span class="pill">${escapeHtml(o.system)}</span><span class="confidence">${escapeHtml(o.confidence)}</span></div><h4>${escapeHtml(o.title)}</h4><p>${escapeHtml(o.observation)}</p><div class="meta"><span>${escapeHtml(o.startDate)}</span><span>${escapeHtml(o.continent)}</span><span>${escapeHtml(o.place)}</span><span>${escapeHtml(o.coverageType)}</span><span>${overlaps1816(o)?'1816 or overlapping window':'Antecedent / later context'}</span></div>`;
    el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(o);}});el.addEventListener('click',()=>openDetail(o)); root.appendChild(el);
  });
}

const inspector={history:[],index:-1,tab:'connections',linkFilter:'all'};

function openDetail(o){if(o)visitInspector({kind:'observation',id:o.id});}
function openRelationship(r){if(r)visitInspector({kind:'relationship',id:r.id});}
function visitInspector(item){
  const dlg=document.getElementById('detailDialog');
  if(!dlg.open){inspector.history=[];inspector.index=-1;}
  const current=inspector.history[inspector.index];
  if(!current||current.kind!==item.kind||current.id!==item.id){inspector.history=inspector.history.slice(0,inspector.index+1);inspector.history.push(item);inspector.index++;}
  inspector.tab=item.kind==='relationship'?'claim':'connections';inspector.linkFilter='all';renderInspector(true);
}
function inspectorLabel(item){return item.kind==='observation'?obs(item.id)?.title:'Connection: '+state.relationships.find(r=>r.id===item.id)?.predicate.replaceAll('_',' ').toLowerCase();}
function inspectorNavigation(){
  return `<div class="inspector-controls"><button class="inspector-back" data-history="${inspector.index-1}" ${inspector.index===0?'disabled':''}>← Back</button><p>Your exploration path <span>· navigation, not a causal claim</span></p></div><nav class="exploration-trail" aria-label="Exploration history">${inspector.history.slice(0,inspector.index+1).map((item,i)=>`<button data-history="${i}" ${i===inspector.index?'aria-current="step"':''}>${escapeHtml(inspectorLabel(item))}</button>`).join('<span aria-hidden="true">›</span>')}</nav>`;
}
function evidenceClass(o){
  const basis=o.evidenceType.join(' ').toLowerCase();
  return /simulat|model/.test(basis)?'Model estimate':/proxy|reconstruct/.test(basis)?'Reconstructed evidence':/forecast/.test(basis)?'Contemporary forecast':/retrospective/.test(basis)?'Retrospective account':'Documented observation';
}
function claimStatus(r){return {CAUSAL:'Causal claim',CONTRIBUTORY:'Contributing connection',ASSOCIATED:'Association · no causal claim',CONTESTED:'Disputed connection'}[r.causalStatus]||r.causalStatus;}
function predicateLabel(r){return r.predicate.replaceAll('_',' ').toLowerCase();}
function observationButton(o,cls='neighbor-node'){
  return `<button class="${cls}" data-observation="${escapeAttr(o.id)}"><span class="eyebrow">${escapeHtml(o.startDate)} · ${escapeHtml(o.system)}</span><strong>${escapeHtml(o.title)}</strong><small>${escapeHtml(o.place)}</small><span class="basis-label">${escapeHtml(evidenceClass(o))}</span></button>`;
}
function neighborHtml(r,o,incoming){
  const neighbor=obs(incoming?r.subjectId:r.objectId);
  return `<article class="neighbor-branch ${r.causalStatus.toLowerCase()}">${incoming?observationButton(neighbor):''}<button class="neighbor-edge ${r.causalStatus.toLowerCase()}" data-relationship="${escapeAttr(r.id)}"><span>${escapeHtml(predicateLabel(r))} ${incoming?'→':'→'}</span><small>${escapeHtml(claimStatus(r))}</small><em>Why linked? · ${escapeHtml(r.confidence)} confidence</em></button>${incoming?'':observationButton(neighbor)}</article>`;
}
function neighborhoodHtml(o){
  const rels=state.relationships.filter(r=>r.subjectId===o.id||r.objectId===o.id);
  const shown=rels.filter(r=>inspector.linkFilter==='all'||(inspector.linkFilter==='causal'?['CAUSAL','CONTRIBUTORY'].includes(r.causalStatus):['ASSOCIATED','CONTESTED'].includes(r.causalStatus)));
  const incoming=shown.filter(r=>r.objectId===o.id),outgoing=shown.filter(r=>r.subjectId===o.id);
  const threads=state.threads.filter(t=>t.nodeIds.includes(o.id));
  return `<div class="focus-heading"><div><h3>Follow a connection</h3><p>Choose a linked fact to move the focus. Choose a link to inspect its evidence.</p></div><label>Show <select id="linkFilter"><option value="all" ${inspector.linkFilter==='all'?'selected':''}>All ${rels.length} connections</option><option value="causal" ${inspector.linkFilter==='causal'?'selected':''}>Causal and contributing claims</option><option value="other" ${inspector.linkFilter==='other'?'selected':''}>Associations and disputes</option></select></label></div><div class="focus-map"><section class="neighbor-column"><h4>Links to this fact <span>${incoming.length}</span></h4>${incoming.map(r=>neighborHtml(r,o,true)).join('')||'<p class="empty-neighbors">No links in this direction for this filter.</p>'}</section><div class="focus-node"><span class="eyebrow">You are here</span><strong>${escapeHtml(o.title)}</strong><span>${escapeHtml(o.startDate)} · ${escapeHtml(o.place)}</span><small>${escapeHtml(evidenceClass(o))}</small></div><section class="neighbor-column"><h4>Links from this fact <span>${outgoing.length}</span></h4>${outgoing.map(r=>neighborHtml(r,o,false)).join('')||'<p class="empty-neighbors">No links in this direction for this filter.</p>'}</section></div><p class="graph-key">Solid links show causal or contributing claims. Dashed links show associations. Dotted links show disputes. Arrows read the relationship wording; “responded to” points from a response to its pressure.</p><div class="thread-choices"><h3>Explore a curated thread</h3>${threads.map(t=>`<button data-thread="${escapeAttr(t.id)}"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.scope)} · ${t.nodeIds.length} facts</small><span aria-hidden="true">↗</span></button>`).join('')||'<p>No curated thread includes this record yet.</p>'}</div>`;
}
function sourceHtml(refs){return (refs||[]).map(source).filter(Boolean).map(s=>`<details class="evidence-source"><summary><span>${escapeHtml(s.title)}</span><small>${escapeHtml(s.authorOrOrg)} · ${escapeHtml(s.year??'Undated')} · ${escapeHtml(s.type)}</small></summary><p>${escapeHtml(s.notes||'No additional source caveat recorded.')}</p><p>Source quality: ${escapeHtml(s.quality)}</p><a href="${escapeAttr(s.url)}" target="_blank" rel="noreferrer">Open source ↗</a>${s.alternateUrl?` · <a href="${escapeAttr(s.alternateUrl)}" target="_blank" rel="noreferrer">Alternate full text ↗</a>`:''}</details>`).join('');}
function factsHtml(o){
  const fields=[['Date',o.startDate+(o.endDate!==o.startDate?' → '+o.endDate:'')],['Date precision',o.datePrecision],['Date basis',o.dateBasis],['Place',o.place],['Region',o.region],['Historical entity',o.historicalEntity],['System',o.system],['Role',(o.analyticalRole||[]).join(', ')],['Coverage',o.coverageType],['Evidence basis',o.evidenceType.join('; ')],['Observation confidence',o.confidence],['Value',o.value!==undefined?o.value+' '+(o.unit||''):null],['Baseline',o.baseline],['Anomaly',o.anomaly],['Extended context',o.extendedContextReason],['Review',o.researchStatus]];
  return `<h3>About this record</h3><dl class="detail-grid">${fields.filter(([,v])=>v!==undefined&&v!==null&&v!=='').map(([k,v])=>`<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>`;
}
function observationEvidenceHtml(o){return `<section class="evidence-limits"><h3>What this evidence can establish</h3><p>${escapeHtml(o.uncertainty||'No record-specific uncertainty note has been added. The confidence rating does not establish certainty.')}</p><p><strong>Evidence basis:</strong> ${escapeHtml(o.evidenceType.join('; '))}</p><p><strong>Find the passage:</strong> ${escapeHtml(o.sourceLocator||'A specific source location has not yet been recorded.')}</p></section><h3>Inspect the sources</h3>${sourceHtml(o.sourceRefs)}`;}
function relationshipHtml(r){
  return `<div class="claim-route ${r.causalStatus.toLowerCase()}">${observationButton(obs(r.subjectId),'claim-endpoint')}<div class="claim-arrow"><span>${escapeHtml(predicateLabel(r))}</span><strong aria-hidden="true">→</strong></div>${observationButton(obs(r.objectId),'claim-endpoint')}</div><div class="claim-verdict ${r.causalStatus.toLowerCase()}"><span>${escapeHtml(claimStatus(r))}</span><strong>${escapeHtml(r.confidence)} relationship confidence</strong><small>Lag: ${escapeHtml(r.lag||'Not specified')}</small></div><section class="claim-reason"><h3>Why these facts are linked</h3><p>${escapeHtml(r.explanation)}</p></section><details class="claim-alternatives" open><summary>Alternatives and limits</summary><ul>${(r.alternatives?.length?r.alternatives:['No alternatives have been recorded. That does not establish a unique cause.']).map(a=>`<li>${escapeHtml(a)}</li>`).join('')}</ul></details><h3>Evidence for this connection</h3>${sourceHtml(r.sourceRefs)}<details><summary>Relationship identifiers</summary><p>${escapeHtml(r.id)} · ${escapeHtml(r.predicate)} · ${escapeHtml(r.causalStatus)}</p></details>`;
}
function renderInspector(focus=false){
  const item=inspector.history[inspector.index];if(!item)return;
  const dlg=document.getElementById('detailDialog'),content=document.getElementById('dialogContent');
  if(item.kind==='relationship'){
    const r=state.relationships.find(r=>r.id===item.id);
    content.innerHTML=`${inspectorNavigation()}<header class="inspector-heading"><p class="eyebrow">Assess one connection</p><h2 id="detailTitle" tabindex="-1">Why are these linked?</h2></header>${relationshipHtml(r)}`;
  }else{
    const o=obs(item.id),n=state.relationships.filter(r=>r.subjectId===o.id||r.objectId===o.id).length;
    content.innerHTML=`${inspectorNavigation()}<header class="inspector-heading"><p class="eyebrow">${escapeHtml(o.startDate)} · ${escapeHtml(o.place)}</p><h2 id="detailTitle" tabindex="-1">${escapeHtml(o.title)}</h2><div class="fact-badges"><span>${escapeHtml(evidenceClass(o))}</span><span>${escapeHtml(o.confidence)} observation confidence</span></div><p class="selected-fact">${escapeHtml(o.observation)}</p></header><nav class="inspector-tabs" aria-label="Record views">${[['connections',`Connections · ${n}`],['evidence',`Evidence · ${o.sourceRefs.length}`],['facts','Record details']].map(([id,label])=>`<button data-inspector-tab="${id}" aria-pressed="${inspector.tab===id}" ${inspector.tab===id?'class="selected"':''}>${label}</button>`).join('')}</nav><section id="inspectorBody" class="inspector-body" aria-live="polite">${inspector.tab==='connections'?neighborhoodHtml(o):inspector.tab==='evidence'?observationEvidenceHtml(o):factsHtml(o)}</section>`;
  }
  if(!dlg.open)dlg.showModal();
  if(focus){dlg.scrollTop=0;document.getElementById('detailTitle').focus();}
  else{const active=content.querySelector(`[data-inspector-tab="${inspector.tab}"]`);if(active)active.focus();}
}

function overlaps1816(o){return Number(o.startDate.slice(0,4))<=1816&&Number(o.endDate.slice(0,4))>=1816;}
function selectThread(id){state.threadId=id;document.getElementById('threadSelect').value=id;renderThread();document.getElementById('threads').scrollIntoView({behavior:'smooth'});}

function obs(id){return state.observations.find(o=>o.id===id)}
function source(id){return state.sources.find(s=>s.id===id)}
function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(str=''){return escapeHtml(str)}

load().catch(err=>{document.getElementById('cards').innerHTML=`<p>Could not load prototype data: ${escapeHtml(err.message)}</p>`;});
