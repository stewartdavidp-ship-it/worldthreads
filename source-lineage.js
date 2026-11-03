// Render only provenance captured in the selected filed snapshot, never inferred from live metadata.
function defenseSourceLineage(entry){
 const selected=[0,1,2].map(i=>entry.draft['record'+i]),records=entry.records.filter(r=>selected.includes(r.id)),refs=entry.references,byId=new Map(refs.map(s=>[s.id,s])),trails=[];
 for(const parent of refs)for(const dep of Array.isArray(parent.sourceDependencies)?parent.sourceDependencies:[]){
  if(!dep||typeof dep!=='object'||dep.kind!=='CITES_COMPILATION'||!Array.isArray(dep.observationIds)||!['scope','locator','limits'].every(k=>typeof dep[k]==='string'&&dep[k].trim()))continue;
  const origin=byId.get(dep.sourceId),relevant=records.filter(r=>dep.observationIds.includes(r.id)&&(r.sourceRefs||[]).includes(parent.id)&&(r.sourceRefs||[]).includes(dep.sourceId));
  if(!origin||!relevant.length)continue;
  trails.push({parent,origin,dep,relevant});
 }
 if(!trails.length)return '';
 const node=(s,role)=>{const inner=`<svg viewBox="0 0 48 52" aria-hidden="true" focusable="false"><path d="M10 4h20l9 9v35H10ZM30 4v11h9M17 24h15M17 32h15M17 40h10"/></svg><strong>${escapeHtml(String(s.year||'Date not supplied'))}<span class="lineage-open" aria-hidden="true">↗</span></strong><span>${role}</span>`;return panelUrl(s.url)?`<a class="lineage-publication" href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeAttr(String(s.year||''))} ${role}: ${escapeAttr(String(s.title||s.id))}" title="${escapeAttr(String(s.title||s.id))}">${inner}</a>`:`<div class="lineage-publication">${inner}</div>`;};
 return `<details class="filed-source-lineage"><summary>Do these citations share a price source?</summary>${trails.map(({parent,origin,dep,relevant})=>`<section aria-label="Filed publication provenance"><p class="eyebrow">Publication years</p><div class="publication-trail">${node(origin,'Compilation')}<div class="publication-reuse"><svg viewBox="0 0 90 30" aria-hidden="true"><path d="M5 15h76M71 6l10 9-10 9"/></svg><span>Cited by</span></div>${node(parent,parent.type==='Peer-reviewed article'?'Study':'Citing work')}</div><p class="lineage-scope">${escapeHtml(dep.scope)}</p><p>These are not independent price witnesses.</p><details><summary>Titles, passages and limits</summary><p><strong>Compilation:</strong> ${escapeHtml(origin.title||origin.id)}</p><p><strong>Citing work:</strong> ${escapeHtml(parent.title||parent.id)}</p><p>${escapeHtml(dep.locator)}</p><p>${escapeHtml(dep.limits)}</p><p>Filed record: ${relevant.map(r=>escapeHtml(r.title||r.id)).join(' · ')}</p><p>This describes citation transmission in this filed version, not a causal link between historical events. Missing provenance metadata does not establish independence.</p></details></section>`).join('')}</details>`;
}

// Reveal the compact diagram inside its scrolling dialog without moving keyboard focus.
document.addEventListener('toggle',event=>{const el=event.target;if(el instanceof HTMLDetailsElement&&el.matches('.filed-source-lineage')&&el.open)requestAnimationFrame(()=>el.querySelector('.publication-trail')?.scrollIntoView({block:'center',behavior:'instant'}));},true);
