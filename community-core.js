/* Shared community protocol. Structural validation is distinct from historical review. */
(function(root){
  const MAX_BYTES=80000;
  const pending='Contributor draft; independent review pending';
  const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const normalize=text=>String(text||'').normalize('NFKC').toLowerCase().replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\s+/g,' ').trim();
  function publicSourceUrl(value){
    try{const u=new URL(value),h=u.hostname.toLowerCase();return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&!/^(localhost|.*\.(local|internal|localhost|invalid|test)|example\.(org|com|net))$/.test(h)&&!h.includes(':')&&!/^\d+(\.\d+){3}$/.test(h)&&h.includes('.');}catch{return false;}
  }
  function validateCommunity(p,existing,intake){
    const errors=[];
    if(!plain(p))return ['Submit a research object.'];
    if(JSON.stringify(p).length>MAX_BYTES)return ['Keep each submission under 80 KB.'];
    if(!['research','evidence'].includes(p.kind))return ['Choose research or supporting/counterevidence.'];
    if(p.consent!==true)errors.push('Confirm that your research and chosen alias may be published.');
    if(p.honeypot)errors.push('Submission could not be accepted.');
    if(p.kind==='research'){
      if(!plain(p.draft))return [...errors,'Include your structured research output.'];
      for(const [name,max]of Object.entries({observations:6,relationships:6,sources:6,evidence:16,searchLog:12})){
        if(!Array.isArray(p.draft[name])||p.draft[name].length>max)errors.push(`Include a ${name} array with no more than ${max} records.`);
      }
      if(errors.length)return errors;
      if(p.draft.observations.length+p.draft.relationships.length>8)errors.push('Submit up to eight facts and relationships at a time so every claim can receive a complete review.');
      try{errors.push(...intake.validateSubmission(p.draft,existing));}catch{errors.push('Some records have invalid fields. Use the research template.');}
      for(const list of ['sources','observations','relationships','evidence'])for(const r of p.draft[list])if(!/^[A-Za-z0-9_-]{1,80}$/.test(r?.id||''))errors.push('Record IDs must contain only letters, numbers, underscores or hyphens.');
      for(const e of p.draft.evidence)if(typeof e?.quote!=='string'||e.quote.trim().length<20||e.quote.length>500)errors.push(`${e?.id||'Evidence'}: include a short exact source quote (20–500 characters) for automatic passage checking.`);
      for(const s of p.draft.sources)if(!publicSourceUrl(s?.url))errors.push(`${s?.id||'Source'}: use a public https source page, without credentials or private addresses.`);
      if(p.draft.contributor?.name?.length>80)errors.push('Keep your public alias under 80 characters.');
      const nodes=new Set(p.draft.proposedThread?.nodeIds||[]);
      if(p.draft.context?.direction==='new_thread'&&(!nodes.size||!p.draft.relationships.length))errors.push('A new thread needs facts and at least one evidenced relationship.');
      if(p.draft.context?.direction==='new_thread'&&p.draft.relationships.some(r=>!nodes.has(r.subjectId)||!nodes.has(r.objectId)))errors.push('Include both endpoints of every relationship in the proposed thread.');
    }else{
      const all=[...existing.observations,...existing.relationships];
      if(!all.some(c=>c.id===p.claimId))errors.push('Select an existing fact or relationship.');
      if(!['supports','counterevidence'].includes(p.stance))errors.push('Choose supporting evidence or counterevidence.');
      for(const [key,min,max]of [['alias',1,80],['sourceTitle',3,250],['locator',3,200],['quote',20,500],['relevance',30,1600],['limitations',10,700]])if(typeof p[key]!=='string'||p[key].trim().length<min||p[key].length>max)errors.push(`Include ${key} (${min}–${max} characters).`);
      if(!publicSourceUrl(p.sourceUrl))errors.push('Use a public https source page.');
    }
    return errors;
  }
  function claimsFor(p){return p.kind==='research'?[...p.draft.observations,...p.draft.relationships]:[{id:p.claimId,observation:p.relevance,stance:p.stance}];}
  function materialFor(p,existing){
    if(p.kind==='evidence')return {sources:[{id:'submitted-source',title:p.sourceTitle,url:p.sourceUrl}],evidence:[{id:'submitted-evidence',claimId:p.claimId,sourceId:'submitted-source',quote:p.quote,locator:p.locator,limitations:p.limitations}]};
    const ids=new Set(p.draft.evidence.map(e=>e.sourceId));
    return {sources:[...p.draft.sources,...existing.sources.filter(s=>ids.has(s.id))],evidence:p.draft.evidence};
  }
  function auditReviews(payload,reports,checks){
    const claims=claimsFor(payload),results=[];
    if(reports.length!==2)reports=[{},{}];
    for(const c of claims){
      const answers=reports.map(r=>r.claims?.find(x=>x.id===c.id));
      const passages=checks.filter(e=>e.claimId===c.id);
      const confirmed=passages.length>0&&passages.every(e=>e.matched);
      const wellFormed=reports.every(r=>r.factual===true&&r.civil===true)&&answers.every(a=>a&&['supports','contradicts','unclear'].includes(a.verdict)&&typeof a.reason==='string'&&a.reason.trim()&&Array.isArray(a.limitations)&&Array.isArray(a.alternatives)&&Array.isArray(a.evidenceIds)&&a.evidenceIds.length&&a.evidenceIds.every(id=>passages.some(e=>e.id===id&&e.matched)));
      const unanimous=wellFormed&&answers[0].verdict===answers[1].verdict;
      let status='provisional';
      if(confirmed&&unanimous&&answers[0].verdict==='supports')status='automated_support';
      if(confirmed&&unanimous&&answers[0].verdict==='contradicts')status='automated_counterevidence';
      // A causal edge needs explicit alternatives review in both passes.
      if(payload.kind==='evidence'&&status==='automated_support'&&answers.some(a=>a.targetEffect!==(payload.stance==='counterevidence'?'weakens':'supports')))status='provisional';
      if(c.subjectId&&['CAUSAL','CONTRIBUTORY','CONTESTED'].includes(c.causalStatus)&&answers.some(a=>!a?.alternatives?.length))status='provisional';
      results.push({claimId:c.id,status,passageMatched:confirmed,reasons:answers.map(a=>a?.reason||'Automatic reviewer could not return a complete assessment.'),limitations:[...new Set(answers.flatMap(a=>a?.limitations||[]))],alternatives:[...new Set(answers.flatMap(a=>a?.alternatives||[]))],targetEffects:answers.map(a=>a?.targetEffect||'unclear'),evidenceIds:passages.map(e=>e.id)});
    }
    return results;
  }
  function graphPatch(payload,id,review,existing){
    if(payload.kind!=='research')return null;
    const draft=structuredClone(payload.draft),prefix='C-'+id+'-',remap=new Map();
    for(const category of ['sources','observations','relationships','evidence'])for(const r of draft[category])remap.set(r.id,prefix+r.id);
    // Preserve the canonical identity of a source already in the registry.
    for(const s of draft.sources){const same=existing.sources.find(x=>normalize(x.url)===normalize(s.url));if(same)remap.set(s.id,same.id);}
    const ref=x=>remap.get(x)||x;
    for(const category of ['sources','observations','relationships','evidence'])for(const r of draft[category]){
      const old=r.id;r.id=ref(old);for(const field of ['subjectId','objectId','claimId','sourceId'])if(r[field])r[field]=ref(r[field]);
      for(const field of ['sourceRefs','evidenceRefs'])if(r[field])r[field]=r[field].map(ref);
      if(r.causalReview){for(const a of r.causalReview.alternatives||[])if(a.sourceRefs)a.sourceRefs=a.sourceRefs.map(ref);for(const e of r.causalReview.counterevidence||[])if(e.sourceRefs)e.sourceRefs=e.sourceRefs.map(ref);}
      if(category==='relationships'&&r.causalReview){
        const c=r.causalReview,pick=(x,keys)=>Object.fromEntries(keys.filter(k=>x?.[k]!==undefined).map(k=>[k,x[k]]));
        r.causalReview=pick(c,['primaryExplanation','assessment','priorConditions','distinguishingEvidence','searchStatus','reviewStatus']);
        r.causalReview.alternatives=(c.alternatives||[]).map(a=>pick(a,['id','explanation','kind','assessment','sourceRefs','locator','evidenceNote','distinguishingEvidence']));
        r.causalReview.counterevidence=(c.counterevidence||[]).map(e=>pick(e,['description','sourceRefs','locator']));
      }
      if(category==='observations'||category==='relationships'){
        const result=review.find(x=>x.claimId===old);r.communityStatus=result?.status||'provisional';r.researchStatus=r.communityStatus==='automated_support'?'Passed automated source and assessment checks':'Provisional community research';r.confidence=r.communityStatus==='automated_support'?'Medium':'Low';r.submissionId=id;r.contributor=draft.contributor.name;
      }
      if(category==='evidence'){r.reviewStatus='automated_assessment';r.independentReviewer=null;r.submissionId=id;}
    }
    const fields={
      observations:['id','title','startDate','endDate','datePrecision','continent','region','historicalEntity','place','observation','coverageType','system','topic','analyticalRole','evidenceType','confidence','sourceRefs','researchStatus','evidenceRefs','value','unit','baseline','anomaly','communityStatus','submissionId','contributor'],
      relationships:['id','subjectId','objectId','predicate','causalStatus','explanation','lag','confidence','sourceRefs','evidenceRefs','researchStatus','causalReview','communityStatus','submissionId','contributor'],
      sources:['id','title','type','authorOrOrg','year','url','quality','topics','notes','dependencyGroup'],
      evidence:['id','claimId','sourceId','locator','accessedAt','provenance','limitations','reviewer','reviewStatus','accessScope','quote','submissionId']
    };
    for(const category of Object.keys(fields))draft[category]=draft[category].map(r=>Object.fromEntries(fields[category].filter(k=>r[k]!==undefined).map(k=>[k,r[k]])));
    draft.sources=draft.sources.filter(s=>!existing.sources.some(x=>x.id===s.id));
    // A contradicted new claim is retained in the receipt/history, not added as a graph fact.
    draft.observations=draft.observations.filter(o=>o.communityStatus!=='automated_counterevidence');
    const nodeIds=new Set([...existing.observations.map(o=>o.id),...draft.observations.map(o=>o.id)]);
    draft.relationships=draft.relationships.filter(r=>r.communityStatus!=='automated_counterevidence'&&nodeIds.has(r.subjectId)&&nodeIds.has(r.objectId));
    const claimed=new Set([...draft.observations,...draft.relationships].map(c=>c.id));
    draft.evidence=draft.evidence.filter(e=>claimed.has(e.claimId));
    const thread=draft.context.direction==='new_thread'?{id:prefix+'THREAD',title:draft.proposedThread.title,description:draft.proposedThread.perspective,subtitle:'Community branch · 1816',nodeIds:draft.proposedThread.nodeIds.map(ref).filter(x=>nodeIds.has(x)),relationshipIds:draft.relationships.map(r=>r.id),community:true}:null;
    return {observations:draft.observations,relationships:draft.relationships,sources:draft.sources,evidence:draft.evidence,thread,extension:thread?null:{threadId:draft.context.threadId,nodeIds:draft.observations.map(o=>o.id),relationshipIds:draft.relationships.map(r=>r.id)}};
  }
  function recognitionFor(payload,review,patch){
    if(!review.length||review.some(r=>r.status!=='automated_support'))return [];
    const awards=[];
    if(patch?.thread&&patch.relationships.length)awards.push({id:'THREAD_FINDER',title:'Thread Finder',claimRefs:[...patch.observations,...patch.relationships].map(c=>c.id)});
    if(patch?.relationships.some(r=>['CAUSAL','CONTRIBUTORY'].includes(r.causalStatus)))awards.push({id:'CAUSALITY_EXPLORER',title:'Causality Explorer',claimRefs:patch.relationships.filter(r=>['CAUSAL','CONTRIBUTORY'].includes(r.causalStatus)).map(r=>r.id)});
    if(payload.kind==='evidence'&&payload.stance==='counterevidence')awards.push({id:'THEORY_CHALLENGER',title:'Theory Challenger',claimRefs:[payload.claimId]});
    return awards.map(a=>({...a,basis:'Automated source and assessment checks; subject to new evidence.'}));
  }
  const api={recognitionFor,MAX_BYTES,pending,normalize,publicSourceUrl,validateCommunity,claimsFor,materialFor,auditReviews,graphPatch};
  if(typeof module!=='undefined')module.exports=api;else root.WorldThreadsCommunity=api;
})(typeof window!=='undefined'?window:this);
