const state={observations:[],relationships:[],threads:[],sources:[],mechanisms:[],gaps:[],region:'ALL',query:'',system:'ALL',threadId:null};

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
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); state.system=btn.dataset.system; renderCards();
  }));
  document.querySelectorAll('.map-node').forEach(btn=>btn.addEventListener('click',()=>{
    state.region=btn.dataset.region; document.getElementById('regionSelect').value=state.region; renderCards(); document.getElementById('evidence').scrollIntoView({behavior:'smooth'});
  }));
  document.getElementById('threadSelect').addEventListener('change',e=>{state.threadId=e.target.value;renderThread();});
  document.getElementById('searchInput').addEventListener('input',e=>{state.query=e.target.value;renderCards();});
  document.getElementById('regionSelect').addEventListener('change',e=>{state.region=e.target.value;renderCards();});
  document.getElementById('clearFilters').addEventListener('click',()=>{state.query='';state.region='ALL';state.system='ALL';document.getElementById('searchInput').value='';document.getElementById('regionSelect').value='ALL';document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.system==='ALL'));renderCards();});
  document.getElementById('dialogContent').addEventListener('click',e=>{const button=e.target.closest('[data-observation]');if(button)openDetail(obs(button.dataset.observation));const thread=e.target.closest('[data-thread]');if(thread){state.threadId=thread.dataset.thread;document.getElementById('threadSelect').value=state.threadId;renderThread();document.getElementById('detailDialog').close();document.getElementById('threads').scrollIntoView({behavior:'smooth'});}});
  document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('detailDialog').close());
}

function render(){
  renderStats(); renderThreadOptions(); renderThread(); renderCards();
  const select=document.getElementById('regionSelect');
  [...new Set(state.observations.map(o=>o.continent))].sort().forEach(region=>{const option=document.createElement('option');option.value=region;option.textContent=region;select.appendChild(option);});
  document.getElementById('researchGaps').innerHTML=state.gaps.map(g=>`<article class="relation-item"><h4>${escapeHtml(g.region)} · ${escapeHtml(g.status)}</h4><p>${escapeHtml(g.question)}</p></article>`).join('');
}

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
    return `<details><summary>${escapeHtml(m.name)} · ${escapeHtml(m.status)}</summary><p>${escapeHtml(m.description)}</p><p>Possible buffers: ${escapeHtml(m.resilienceFactors.join(', ')||'Not yet documented')}.</p><p>Counterexamples: ${escapeHtml(m.counterexamples?.join(', ')||'Not yet documented; absence is not confirmation')}.</p>${similar.map(t=>`<button class="filter" data-thread="${escapeAttr(t.id)}">Compare: ${escapeHtml(t.title)}</button>`).join('')}</details>`;
  }).join('');
  document.getElementById('mechanismPanel').onclick=e=>{const b=e.target.closest('[data-thread]');if(b){state.threadId=b.dataset.thread;document.getElementById('threadSelect').value=state.threadId;renderThread();}};

}

function renderCards(){
  const root=document.getElementById('cards');
  const filtered=state.observations.filter(o=>(state.system==='ALL'||o.system===state.system)&&(state.region==='ALL'||o.continent===state.region)&&(!state.query||JSON.stringify(o).toLowerCase().includes(state.query.toLowerCase())));
  document.getElementById('countLabel').textContent=`${filtered.length} of ${state.observations.length} shown`;
  root.innerHTML='';
  if(!filtered.length)root.innerHTML='<p>No matching evidence. Try clearing the filters.</p>';
  filtered.forEach(o=>{
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`<div class="card-top"><span class="pill">${escapeHtml(o.system)}</span><span class="confidence">${escapeHtml(o.confidence)}</span></div><h4>${escapeHtml(o.title)}</h4><p>${escapeHtml(o.observation)}</p><div class="meta"><span>${escapeHtml(o.startDate)}</span><span>${escapeHtml(o.continent)}</span><span>${escapeHtml(o.place)}</span><span>${escapeHtml(o.coverageType)}</span></div>`;
    el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(o);}});el.addEventListener('click',()=>openDetail(o)); root.appendChild(el);
  });
}

function openDetail(o){
  const dlg=document.getElementById('detailDialog'); const content=document.getElementById('dialogContent');
  const rels=state.relationships.filter(r=>r.subjectId===o.id||r.objectId===o.id);
  const sourceLinks=sourceHtml(o.sourceRefs);
  const relHtml=rels.map(r=>relationshipHtml(r,o.id)).join('');
  const memberships=state.threads.filter(t=>t.nodeIds.includes(o.id)).map(t=>`<button class="filter" data-thread="${escapeAttr(t.id)}">${escapeHtml(t.title)}</button>`).join('');
  content.innerHTML=`<p class="eyebrow">${escapeHtml(o.id)}</p><h2 id="detailTitle" tabindex="-1">${escapeHtml(o.title)}</h2><p>${escapeHtml(o.observation)}</p><dl class="detail-grid"><dt>Date</dt><dd>${escapeHtml(o.startDate)}${o.endDate&&o.endDate!==o.startDate?' → '+escapeHtml(o.endDate):''}</dd><dt>System</dt><dd>${escapeHtml(o.system)}</dd><dt>Role</dt><dd>${escapeHtml((o.analyticalRole||[]).join(', '))}</dd><dt>Coverage</dt><dd>${escapeHtml(o.coverageType)}</dd><dt>Region</dt><dd>${escapeHtml(o.region)}</dd><dt>Entity</dt><dd>${escapeHtml(o.historicalEntity)}</dd><dt>Place</dt><dd>${escapeHtml(o.place)}</dd><dt>Confidence</dt><dd>${escapeHtml(o.confidence)}</dd><dt>Evidence</dt><dd>${escapeHtml((o.evidenceType||[]).join(', '))}</dd>${o.value?`<dt>Value</dt><dd>${escapeHtml(o.value)} ${escapeHtml(o.unit||'')}</dd>`:''}${o.baseline?`<dt>Baseline</dt><dd>${escapeHtml(o.baseline)}</dd>`:''}${o.anomaly?`<dt>Anomaly</dt><dd>${escapeHtml(o.anomaly)}</dd>`:''}<dt>Date precision</dt><dd>${escapeHtml(o.datePrecision)}</dd><dt>Review</dt><dd>${escapeHtml(o.researchStatus)}</dd><dt>Uncertainty</dt><dd>${escapeHtml(o.uncertainty||'No record-specific uncertainty note yet; confidence is not certainty.')}</dd><dt>Source location</dt><dd>${escapeHtml(o.sourceLocator||'Not yet recorded')}</dd></dl><h3>Sources</h3><div class="source-badges">${sourceLinks||'No source registry entries yet.'}</div><h3>Explore threads</h3>${memberships||'No curated thread yet.'}<h3>Trace causes and consequences</h3><div class="relation-list">${relHtml||'<div class="relation-item">No explicit graph relationships added yet.</div>'}</div>`;
  if(!dlg.open)dlg.showModal();document.getElementById('detailTitle').focus();
}

function sourceHtml(refs){return (refs||[]).map(source).filter(Boolean).map(s=>`<p><a href="${escapeAttr(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(s.title)}</a><br>${escapeHtml(s.authorOrOrg)} · ${escapeHtml(s.year??'Undated')} · ${escapeHtml(s.type)} · source quality: ${escapeHtml(s.quality)}<br>${escapeHtml(s.notes||'')}</p>`).join('');}
function relationshipHtml(r,current){
  const from=obs(r.subjectId),to=obs(r.objectId);
  return `<div class="relation-item ${r.causalStatus.toLowerCase()}"><p>${current?(r.subjectId===current?'Outgoing →':'Incoming ←'):''} <b>${escapeHtml(r.predicate.replaceAll('_',' '))}</b> · ${escapeHtml(r.causalStatus)} · ${escapeHtml(r.confidence)} confidence</p><button class="filter" data-observation="${escapeAttr(from.id)}">${escapeHtml(from.title)}</button> → <button class="filter" data-observation="${escapeAttr(to.id)}">${escapeHtml(to.title)}</button><p>${escapeHtml(r.explanation)}</p><p>Lag: ${escapeHtml(r.lag||'Unspecified')}</p><p>Alternatives / limits: ${escapeHtml((r.alternatives||[]).join('; ')||'No alternatives recorded; this is not proof of exclusivity.')}</p>${sourceHtml(r.sourceRefs)}</div>`;
}
function openRelationship(r){const dlg=document.getElementById('detailDialog');document.getElementById('dialogContent').innerHTML=`<p class="eyebrow">Relationship claim · ${escapeHtml(r.id)}</p><h2 id="detailTitle" tabindex="-1">Assess the connection</h2>${relationshipHtml(r)}`;if(!dlg.open)dlg.showModal();document.getElementById('detailTitle').focus();}

function obs(id){return state.observations.find(o=>o.id===id)}
function source(id){return state.sources.find(s=>s.id===id)}
function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(str=''){return escapeHtml(str)}

load().catch(err=>{document.getElementById('cards').innerHTML=`<p>Could not load prototype data: ${escapeHtml(err.message)}</p>`;});
