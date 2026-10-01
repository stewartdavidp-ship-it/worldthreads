const state={observations:[],system:'ALL'};
const threadIds=['WT-1816-0001','WT-1816-0002','WT-1816-0003','WT-1816-0004'];

async function load(){
  const res=await fetch('data/1816/observations.json');
  state.observations=await res.json();
  bind();
  render();
}

function bind(){
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.system=btn.dataset.system;
    renderCards();
  }));

  document.querySelectorAll('.map-node').forEach(btn=>btn.addEventListener('click',()=>{
    const region=btn.dataset.region;
    const first=state.observations.find(o=>o.continent===region);
    if(first) openDetail(first);
  }));

  document.getElementById('closeDialog').addEventListener('click',()=>document.getElementById('detailDialog').close());
}

function render(){
  renderThread();
  renderCards();
}

function renderThread(){
  const root=document.getElementById('threadGraph');
  root.innerHTML='';
  threadIds.map(id=>state.observations.find(o=>o.id===id)).filter(Boolean).forEach(o=>{
    const el=document.createElement('button');
    el.className='thread-node';
    el.innerHTML=`<span class="system">${escapeHtml(o.system)}</span><strong>${escapeHtml(shortTitle(o))}</strong><small>${escapeHtml(o.lag||'')}</small>`;
    el.addEventListener('click',()=>openDetail(o));
    root.appendChild(el);
  });
}

function renderCards(){
  const root=document.getElementById('cards');
  const filtered=state.observations.filter(o=>state.system==='ALL'||o.system===state.system);
  document.getElementById('countLabel').textContent=`${filtered.length} shown`;
  root.innerHTML='';
  filtered.forEach(o=>{
    const el=document.createElement('article');
    el.className='card';
    el.innerHTML=`
      <div class="card-top"><span class="pill">${escapeHtml(o.system)}</span><span class="confidence">${escapeHtml(o.confidence)}</span></div>
      <h4>${escapeHtml(shortTitle(o))}</h4>
      <p>${escapeHtml(o.observation)}</p>
      <div class="meta"><span>${escapeHtml(o.continent)}</span><span>${escapeHtml(o.place)}</span><span>${escapeHtml(o.coverageType)}</span></div>`;
    el.addEventListener('click',()=>openDetail(o));
    root.appendChild(el);
  });
}

function shortTitle(o){
  const map={
    'WT-1816-0001':'Temperature shock',
    'WT-1816-0002':'Fish populations respond',
    'WT-1816-0003':'Food pressure shifts fishing',
    'WT-1816-0004':'Adaptation becomes structural',
    'WT-1816-0005':'Cold summer in Central Europe',
    'WT-1816-0006':'Harvest losses become price pressure',
    'WT-1816-0007':'Eight weeks of persistent rain'
  };
  return map[o.id]||o.topic;
}

function openDetail(o){
  const dlg=document.getElementById('detailDialog');
  const content=document.getElementById('dialogContent');
  content.innerHTML=`
    <p class="eyebrow">${escapeHtml(o.id)}</p>
    <h2>${escapeHtml(shortTitle(o))}</h2>
    <p>${escapeHtml(o.observation)}</p>
    <dl class="detail-grid">
      <dt>System</dt><dd>${escapeHtml(o.system)}</dd>
      <dt>Role</dt><dd>${escapeHtml((o.analyticalRole||[]).join(', '))}</dd>
      <dt>Region</dt><dd>${escapeHtml(o.region)}</dd>
      <dt>Place</dt><dd>${escapeHtml(o.place)}</dd>
      <dt>Confidence</dt><dd>${escapeHtml(o.confidence)}</dd>
      <dt>Relationship</dt><dd>${escapeHtml(o.relationship||'')}</dd>
      <dt>Lag</dt><dd>${escapeHtml(o.lag||'')}</dd>
      <dt>Evidence</dt><dd>${escapeHtml((o.evidenceType||[]).join(', '))}</dd>
      <dt>Related</dt><dd>${escapeHtml((o.relatedIds||[]).join(', '))}</dd>
      <dt>Source</dt><dd><a class="source-link" href="${o.source}" target="_blank" rel="noreferrer">${escapeHtml(o.source)}</a></dd>
    </dl>`;
  dlg.showModal();
}

function escapeHtml(str=''){
  return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

load().catch(err=>{
  document.getElementById('cards').innerHTML=`<p>Could not load prototype data: ${escapeHtml(err.message)}</p>`;
});
