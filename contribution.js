/* Shared browser/CLI intake checks. These do not verify historical truth. */
(function(root){
  function validateSubmission(p, existing={}){
    const errors=[];const fail=s=>errors.push(s);
    if(!p||typeof p!=='object'||Array.isArray(p))return ['The output must be a JSON object.'];
    if(p.schemaVersion!==1)fail('Use schemaVersion 1.');
    if(typeof p.context?.question!=='string'||!p.context.question.trim())fail('Include the research question.');
    if(!p.context?.gapId&&!p.context?.threadId)fail('Link the research to a gap or thread.');
    if(p.context?.gapId && !(existing.gaps||[]).some(x=>x.id===p.context.gapId))fail('Unknown research gap.');
    if(p.context?.threadId && !(existing.threads||[]).some(x=>x.id===p.context.threadId))fail('Unknown historical thread.');
    if(typeof p.contributor?.name!=='string'||!p.contributor.name.trim())fail('Include a contributor name or alias.');
    if(p.review?.status!=='pending')fail('New contributions must have review status pending.');
    for(const n of ['sources','observations','relationships','evidence','searchLog'])if(!Array.isArray(p[n]))fail(`Include a ${n} array.`);
    if(errors.length)return errors;
    if(!p.observations.length)fail('Include at least one proposed observation.');
    if(!p.searchLog.length)fail('Record searches for other explanations and counterevidence.');
    const maps={};const ids=new Set();
    for(const n of ['sources','observations','relationships','evidence']){
      maps[n]=new Map();
      const accepted=new Set((existing[n]||[]).map(x=>x.id));
      for(const x of p[n]){
        if(!x||typeof x!=='object'||typeof x.id!=='string'||!x.id.trim()){fail(`${n}: each record needs an ID.`);continue;}
        if(ids.has(x.id)||accepted.has(x.id))fail(`ID collision: ${x.id}.`);
        ids.add(x.id);maps[n].set(x.id,x);
      }
    }
    if(p.contributor.name==='Your name or alias')fail('Replace the contributor placeholder.');
    if(p.sources.some(s=>s?.url?.includes('replace-with-inspected-source'))||p.observations.some(o=>o?.observation?.startsWith('Replace with')))fail('Replace template placeholders with researched findings.');
    const sourceIds=new Set([...maps.sources.keys(),...(existing.sources||[]).map(x=>x.id)]);
    const observationIds=new Set([...maps.observations.keys(),...(existing.observations||[]).map(x=>x.id)]);
    const claimMap=new Map([...maps.observations,...maps.relationships]);
    const text=(x,fields)=>fields.forEach(f=>{if(typeof x[f]!=='string'||!x[f].trim())fail(`${x.id}: include ${f}.`);});
    for(const s of p.sources){if(!s||!s.id)continue;text(s,['title','authorOrOrg','type','url']);try{if(!['https:','http:'].includes(new URL(s.url).protocol))throw Error();}catch{fail(`${s.id}: use an http or https source URL.`);}}
    for(const c of [...p.observations,...p.relationships]){
      if(!c||!c.id)continue;
      if(!Array.isArray(c.sourceRefs)||!c.sourceRefs.length)fail(`${c.id}: include sourceRefs.`);
      else for(const id of c.sourceRefs)if(!sourceIds.has(id))fail(`${c.id}: unknown source ${id}.`);
      if(!Array.isArray(c.evidenceRefs)||!c.evidenceRefs.length)fail(`${c.id}: include passage evidenceRefs.`);
      else for(const id of c.evidenceRefs)if(maps.evidence.get(id)?.claimId!==c.id)fail(`${c.id}: missing or wrongly owned evidence ${id}.`);
      text(c,['confidence','researchStatus']);
      if(!['Low','Medium','Medium-High','High'].includes(c.confidence))fail(`${c.id}: choose a supported confidence label.`);
      if(c.researchStatus!=='Contributor draft; independent review pending')fail(`${c.id}: keep contributor draft status.`);
    }
    for(const o of p.observations){if(!o||!o.id)continue;text(o,['title','observation','startDate','endDate','datePrecision','continent','region','place','historicalEntity','coverageType','system','topic']);for(const f of ['analyticalRole','evidenceType'])if(!Array.isArray(o[f])||!o[f].length)fail(`${o.id}: include ${f}.`);}
    for(const r of p.relationships){if(!r||!r.id)continue;text(r,['subjectId','objectId','predicate','causalStatus','explanation','lag']);if(!['CAUSAL','CONTRIBUTORY','ASSOCIATED','CONTESTED'].includes(r.causalStatus))fail(`${r.id}: invalid causal status.`);for(const f of ['subjectId','objectId'])if(!observationIds.has(r[f]))fail(`${r.id}: unknown ${f}.`);if(['CAUSAL','CONTRIBUTORY','CONTESTED'].includes(r.causalStatus)&&(!r.causalReview?.searchStatus||!Array.isArray(r.causalReview.alternatives)||!Array.isArray(r.causalReview.counterevidence)))fail(`${r.id}: record alternatives, counterevidence and search status.`);}
    const scopes=['full_text','scan','transcription','abstract','indexed_excerpt','publisher_excerpt','catalog_description','institutional_record'];
    for(const e of p.evidence){if(!e||!e.id)continue;text(e,['claimId','sourceId','locator','accessedAt','provenance','limitations','reviewer']);const c=claimMap.get(e.claimId);if(!c||!c.sourceRefs?.includes(e.sourceId)||!c.evidenceRefs?.includes(e.id))fail(`${e.id}: link to its proposed claim and source.`);if(!scopes.includes(e.accessScope))fail(`${e.id}: record actual accessScope.`);if(e.reviewStatus!=='pending_independent_review'||e.independentReviewer)fail(`${e.id}: independent approval cannot be supplied at intake.`);}
    for(const s of p.searchLog){if(!s||typeof s.query!=='string'||typeof s.result!=='string'||!s.query.trim()||!s.result.trim())fail('Each search log entry needs query and result, including unsuccessful searches.');}
    return errors;
  }
  if(typeof module!=='undefined')module.exports={validateSubmission};else root.WorldThreadsIntake={validateSubmission};
})(typeof window!=='undefined'?window:this);
