/* Guided reading is the default; the original story stays visible while branching. */
(function(){
  const $=id=>document.getElementById(id),model=window.WorldThreadsJourney;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  let selected=null,currentThread=null,recent=[],arrivedVia=null,view='discover',stage='prepare',initialized=false,saved=null,engaged=false,caseMode=false,caseStance='',caseLead='',caseReason='',caseQuestion='',casePins=[],caseSeen=[],synthesis={supports:'',uncertain:'',next:''},synthesisSaved=false;
  const storageKey='worldthreads-journey-v1';
  const starterId='THREAD-CLIMATE-CULTURE';
  const names={
    'THREAD-CLIMATE-CULTURE':'Was weather the decisive influence on Frankenstein?',
    'THREAD-GULF-MAINE':'How did a cold summer change fishing?',
    'THREAD-CENTRAL-EUROPE-FOOD':'How did bad weather put food under pressure?',
    'THREAD-ALPINE-HYDRO':'How can a cold year store up flood risk?',
    'THREAD-CHINA-CLIMATE':'Why did the same climate shock look different in China?'
  };
  function button(text,action,cls='nav-btn'){const b=node('button',text,cls);b.type='button';b.onclick=action;return b;}
  function thread(){return WorldThreadsApp.state.threads.find(t=>t.id===WorldThreadsApp.state.threadId);}
  function title(t){return names[t.id]||t.title;}
  function remember(){
    if(!initialized||!engaged)return;
    const fields={};for(const id of ['researchPlace','researchDirection','personalQuestion','proposedThreadTitle','researchGap','researchPrompt','researchOutput','researchTarget'])fields[id]=$(id).value;
    saved={threadId:currentThread,selected,recent,view,stage,fields,startingFactId:WorldThreadsApp.researchStartId||null,challengeContext:WorldThreadsApp.challengeContext||null,caseStance,caseLead,caseReason,caseQuestion,casePins,caseSeen,synthesis,synthesisSaved,caseMode};
    try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch{}
  }
  function show(next){
    if(next!=='discover')engaged=true;view=next;for(const id of ['discover','explore','research'])$(id+'View').hidden=id!==next;
    document.querySelectorAll('.site-header [data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===next);b.setAttribute('aria-current',b.dataset.view===next?'page':'false');});
    $('evidenceLibrary').hidden=next!=='discover';
    if(next==='research')researchContext();
    if(next==='explore')renderNetwork();
    window.scrollTo({top:0,behavior:'smooth'});remember();
  }
  function tab(which){stage=which;renderInvestigationProgress();if($('emptyProgress'))$('emptyProgress').hidden=!$('receiptPanel').hidden;for(const [name,id]of [['prepare','prepareResearch'],['return','returnResearch'],['progress','progressResearch']])$(id).hidden=name!==which;document.querySelectorAll('[data-research-tab]').forEach(b=>b.classList.toggle('active',b.dataset.researchTab===which));remember();}
  function showEvidence(){show('research');tab('return');$('evidenceDisclosure').open=true;const target=$('researchTarget').value;if(target)$('evidenceClaim').value=target;}
  function chooseThread(t){
    WorldThreadsApp.state.threadId=t.id;selected=t.nodeIds[0];recent=[selected];currentThread=t.id;arrivedVia=null;caseMode=t.id===starterId;caseStance='';caseLead='';caseReason='';caseQuestion='';casePins=[];caseSeen=[];synthesis={supports:'',uncertain:'',next:''};synthesisSaved=false;
    $('connectionDepth').value='0';WorldThreadsApp.render();show('explore');
  }
  function selectFact(id,edge=null){
    selected=id;arrivedVia=edge;if(recent.at(-1)!==id)recent.push(id);renderNetwork();remember();
    if(matchMedia('(max-width:1000px)').matches){$('factReader').scrollIntoView({behavior:'smooth',block:'start'});$('factReader').focus({preventScroll:true});}
  }
  const factNames={'WT-1816-0008':'Tambora erupts in 1815','WT-1816-0009':'Geneva’s summer turns colder','WT-1816-0015':'Frankenstein begins in 1816'};
  const storySummaries={'WT-1816-0008':'An eruption in what is now Indonesia contributed to climate anomalies the following year. How could one event reach so far?', 'WT-1816-0009':'Geneva’s summer afternoons were roughly 3–4°C colder than the reference period. What might weather change in people’s lives?', 'WT-1816-0015':'Mary Shelley conceived Frankenstein near Geneva in the cold, rainy summer of 1816. Weather was part of the setting; ghost stories, scientific ideas and creative choices also mattered.'};
  function factTitle(o){return factNames[o?.id]||o?.title||'Historical fact';}
  function renderCase(){
    const c=WorldThreadsInvestigation,root=$('casePanel');
    if(root.dataset.caseId===c.id){updateCase();return;}
    root.dataset.caseId=c.id;root.replaceChildren();
    const intro=node('div',undefined,'case-intro');
    const claims=node('div',undefined,'claim-comparison');claims.append(node('p','CHALLENGE TO EXAMINE','eyebrow'),node('strong',c.claim),node('p',c.boundary,'scope-note'),node('p','CURRENT RECORDED CONNECTION','eyebrow'),node('span','Weather contributed to the setting; the record does not claim it was the decisive or sole cause.'),button('Inspect the recorded connection',()=>openRelationship(WorldThreadsApp.state.relationships.find(r=>r.id===c.targetClaimId)),'trail-link'));intro.append(claims);root.append(intro);
    const layout=node('div',undefined,'case-evidence-layout'),board=node('section',undefined,'case-board');board.append(node('h3','Follow a lead'),node('p','Dashed links below are possible influences to investigate, not newly established relationships.','scope-note'));
    const clues=node('div',undefined,'clue-board');clues.setAttribute('aria-label','Evidence leads around Frankenstein');const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 450');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('case-board-lines');
    for(const [x,y]of [[100,75],[300,75],[500,75],[100,345],[500,345]]){const p=document.createElementNS(ns,'path');p.setAttribute('d',`M ${x} ${y} L 300 220`);p.setAttribute('stroke','var(--border)');p.setAttribute('stroke-dasharray','5 7');p.setAttribute('fill','none');svg.append(p);}clues.append(svg);
    const center=node('div',undefined,'case-outcome');center.append(node('small','RECORDED FACT'),node('strong','Frankenstein begins in 1816'),button('Inspect this fact',()=>openDetail(WorldThreadsApp.obs(c.startingFactId)),'trail-link'));clues.append(center);
    c.leads.forEach((lead,i)=>{const b=button('',()=>{caseLead=lead.id;updateCase();remember();},'case-lead');b.dataset.leadId=lead.id;b.style.gridArea=['1 / 1','1 / 2','1 / 3','3 / 1','3 / 3'][i];b.append(node('small',i===4?'1817 preface · Percy attribution':'Mary Shelley · 1831 recollection'),node('strong',lead.title),node('span',['Possible setting','Possible trigger','Possible inspiration','Creative choice','Tests chronology'][i]),node('span','Inspect passage'));clues.append(b);});board.append(clues,button('Investigate another explanation →',()=>{$('rivalLeads').hidden=!$('rivalLeads').hidden;},'nav-btn alternative-lead'),node('p','Source groups: four passages from Mary Shelley’s 1831 recollection; one from the 1817 preface attributed to Percy Shelley. Five passages are not five independent witnesses.','source-warning'));
    const rivals=node('section',undefined,'rival-leads');rivals.id='rivalLeads';rivals.hidden=true;rivals.append(node('h4','Which explanation would you follow?'));for(const id of ['challenge','science','choice']){const lead=c.leads.find(l=>l.id===id);rivals.append(button(lead.title,()=>{caseLead=id;caseQuestion=lead.question;updateCase();remember();$('caseSource').scrollIntoView({behavior:'smooth',block:'start'});$('caseCluePicker').focus();}));}rivals.append(button('Ask about a different influence',()=>{$('caseQuestion').focus();$('caseQuestion').scrollIntoView({behavior:'smooth',block:'center'});},'trail-link'));board.append(rivals);
    const source=node('article',undefined,'case-source');source.id='caseSource';
    const controls=node('div',undefined,'clue-controls'),picker=node('select');picker.id='caseCluePicker';picker.setAttribute('aria-label','Choose a source passage');picker.append(node('option','Choose a clue'));picker.firstChild.value='';for(const lead of c.leads){const option=node('option',lead.title);option.value=lead.id;picker.append(option);}picker.onchange=()=>{caseLead=picker.value;updateCase();remember();};
    const move=step=>{const i=c.leads.findIndex(l=>l.id===caseLead);caseLead=c.leads[(Math.max(0,i)+step+c.leads.length)%c.leads.length].id;updateCase();remember();};controls.append(button('Previous clue',()=>move(-1)),picker,button('Next clue',()=>move(1)));source.append(controls);
    const passage=node('div');passage.id='casePassage';passage.setAttribute('aria-live','polite');source.append(passage);
    const pin=button('Pin this passage for comparison',()=>{if(!caseLead)return;const i=casePins.indexOf(caseLead);if(i>=0)casePins.splice(i,1);else if(casePins.length<2)casePins.push(caseLead);else{$('casePinStatus').textContent='Two passages are pinned. Unpin one before adding another.';return;}updateCase();remember();});pin.id='casePinCurrent';source.append(pin);const pinStatus=node('p',undefined,'scope-note');pinStatus.id='casePinStatus';pinStatus.setAttribute('role','status');source.append(pinStatus);layout.append(board,source);root.append(layout);
    const comparison=node('section',undefined,'pinned-comparison');comparison.id='casePinned';root.append(comparison);
    const synthesisPanel=node('section',undefined,'case-synthesis');synthesisPanel.append(node('h3','Make sense of your clues'),node('p','Build a private explanation before researching further. You can leave the history unresolved.'));for(const [key,label]of [['supports','What do the passages support?'],['uncertain','What remains uncertain?'],['next','What evidence would distinguish the explanations?']]){const input=node('textarea');input.id='synthesis-'+key;input.rows=2;input.maxLength=1600;input.value=synthesis[key];const lab=node('label',label);lab.htmlFor=input.id;input.oninput=()=>{synthesis[key]=input.value;synthesisSaved=false;$('synthesisStatus').textContent='Notes saved on this device; synthesis still in progress.';remember();};synthesisPanel.append(lab,input);}const feedback=node('p',undefined,'scope-note');feedback.id='synthesisStatus';feedback.textContent=synthesisSaved?'Evidence synthesis saved · private reasoning, not a verified historical finding.':'';feedback.setAttribute('role','status');synthesisPanel.append(button('Save my evidence synthesis',()=>{synthesisSaved=Object.values(synthesis).every(v=>v.trim());feedback.textContent=synthesisSaved?'Evidence synthesis saved · a private investigation milestone, not a verified historical finding.':'Notes saved. Add what is supported, what is uncertain and what to seek next to complete your synthesis.';remember();}),feedback);root.append(synthesisPanel);
    const response=node('section',undefined,'case-response');response.append(node('h3','What would you investigate next?'),node('p','Research means preparing instructions for your research assistant to find and inspect sources. You can preview the prompt now. Nothing is published by opening it. Findings may add a fact, propose a connection, or provide evidence about an existing connection; your working opinion is not published.'));
    const questionLabel=node('label','Your question');questionLabel.htmlFor='caseQuestion';const question=node('input');question.id='caseQuestion';question.type='text';question.maxLength=1400;question.placeholder='When did conception and drafting occur relative to the weather?';question.oninput=()=>{caseQuestion=question.value;remember();};response.append(questionLabel,question);
    const suggested=node('div',undefined,'case-question-suggestions');for(const q of ['Did weather trigger the ghost-story challenge?','What shaped the subject of the story?','When did conception and drafting happen relative to the weather?'])suggested.append(button(q,()=>{caseQuestion=q;$('caseQuestion').value=q;remember();},'trail-link'));response.append(suggested);
    const optional=node('details',undefined,'optional-explanation');optional.append(node('summary','Record a working explanation (optional, revisable)'));
    const positions=node('div',undefined,'case-positions');positions.setAttribute('role','group');positions.setAttribute('aria-label','Your optional working position');for(const [value,label]of [['supports','Tentatively support'],['counterevidence','Tentatively challenge'],['unresolved','Undetermined']]){const b=button(label,()=>{caseStance=value;updateCase();remember();});b.dataset.stance=value;positions.append(b);}optional.append(positions,node('p','After comparing passages, has your explanation changed? What is the strongest evidence against it?'));
    const label=node('label','Optional reasoning and missing evidence');label.htmlFor='caseReason';const reasoning=node('textarea');reasoning.id='caseReason';reasoning.rows=3;reasoning.maxLength=1600;reasoning.placeholder='This suggests… It cannot establish… I would look for…';reasoning.oninput=()=>{caseReason=reasoning.value;remember();};optional.append(label,reasoning);response.append(optional);
    response.append(button('Investigate this question →',()=>{const chosen=c.leads.find(l=>l.id===caseLead),passages=casePins.map(id=>c.leads.find(l=>l.id===id)).filter(Boolean);if(chosen&&!passages.some(l=>l.id===chosen.id))passages.push(chosen);selected=c.startingFactId;startResearch('continue_thread',caseQuestion.trim()||chosen?.question||'When did Shelley conceive and begin drafting Frankenstein relative to the weather, and what evidence distinguishes the possible influences?',{claim:c.claim,recordedClaim:'Weather contributed to the setting, not an established decisive cause.',targetClaimId:c.targetClaimId,sourceUrl:c.sourceUrl,workingPosition:caseStance||'not chosen',reasoning:caseReason,passages:passages.map(l=>({title:l.title,date:l.date,sourceUrl:c.sourceUrl,locator:l.locator,quote:l.quote,limits:l.limits})),synthesis:{...synthesis},sourceDependence:c.sourcesNote});$('makeResearchPrompt').click();},'nav-btn primary'));
    const contribution=node('section',undefined,'case-contribute');contribution.append(node('h4','Continue here with a source passage'),node('p','This submits evidence about the recorded weather-context connection. It does not turn your opinion about the stronger challenge into a finding. A source passage, relevance, limitations and publication consent are required.'));
    contribution.append(button('Add evidence to the weather-context connection',()=>{const chosen=c.leads.find(l=>l.id===caseLead);$('researchTarget').value=c.targetClaimId;showEvidence();$('evidenceClaim').value=c.targetClaimId;$('evidenceStance').value='';$('evidenceSubmitStatus').textContent='Target: weather contributed to the setting. Choose whether your passage supports or weakens that narrower relationship.';if(chosen){$('evidenceTitle').value='Frankenstein (1831): Introduction and reproduced 1817 Preface';$('evidenceUrl').value=c.sourceUrl;$('evidenceLocator').value=chosen.locator;$('evidenceQuote').value=chosen.quote;$('evidenceLimits').value=chosen.limits+' '+c.sourcesNote;}$('evidenceRelevance').value='';}));response.append(contribution,node('p','Your question and working explanation are saved on this device, not published as votes. They are included in the research prompt you choose to copy or submit.','scope-note'));root.append(response,button('Explore the recorded facts and relationships',()=>{caseMode=false;selected=c.startingFactId;renderNetwork();remember();}));updateCase();
  }
  function updateCase(){
    const c=WorldThreadsInvestigation,chosen=c.leads.find(l=>l.id===caseLead);if(chosen&&!caseSeen.includes(chosen.id))caseSeen.push(chosen.id);document.querySelectorAll('[data-lead-id]').forEach(b=>{const active=b.dataset.leadId===caseLead;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-stance]').forEach(b=>{const active=b.dataset.stance===caseStance;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('caseCluePicker').value=caseLead;$('caseQuestion').value=caseQuestion;$('caseReason').value=caseReason;
    const passage=$('casePassage');if(passage.dataset.lead!==caseLead){passage.dataset.lead=caseLead;passage.replaceChildren();if(chosen){passage.append(node('p',`CLUE ${c.leads.indexOf(chosen)+1} OF ${c.leads.length} · ${chosen.date}`,'eyebrow'),node('h3',chosen.title),node('blockquote',chosen.quote),node('p',chosen.locator));const link=node('a','Read the full source ↗');link.href=c.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';passage.append(link,node('h4','Question the connection'),node('p',chosen.question),node('h4','What this cannot establish'),node('p',chosen.limits));}else passage.append(node('h3','Pick a clue from the evidence board'),node('p','Read first; you do not have to choose a side. Pin two passages to compare what they can and cannot establish.'));}
    $('casePinCurrent').disabled=!chosen;$('casePinCurrent').textContent=casePins.includes(caseLead)?'Unpin this passage':'Pin this passage for comparison';$('casePinStatus').textContent=casePins.length+' of 2 comparison slots used.';
    const comparison=$('casePinned');comparison.replaceChildren();comparison.hidden=!casePins.length;if(casePins.length){comparison.append(node('h3','Your comparison board'),node('p',c.sourcesNote,'source-warning'));const cards=node('div',undefined,'pinned-cards');for(const id of casePins){const lead=c.leads.find(l=>l.id===id);if(!lead)continue;const card=node('article',undefined,'pinned-card');card.append(node('small',lead.date),node('h4',lead.title),node('blockquote',lead.quote),node('p',lead.limits),button('Inspect this clue',()=>{caseLead=id;updateCase();$('casePinCurrent').focus();remember();}),button('Unpin',()=>{casePins=casePins.filter(p=>p!==id);updateCase();remember();}));const full=node('a','Full source ↗');full.href=c.sourceUrl;full.target='_blank';full.rel='noopener noreferrer';card.append(node('p',lead.locator),full);cards.append(card);}comparison.append(cards,node('p','Do the passages concern the same stage—setting, trigger, content or later writing? What would an independent source add?'));}
  }
  function palette(o){return {EARTH:'#d99561',BIOSPHERE:'#65ad84','PRODUCTION & RESOURCES':'#c0a553','HUMAN SYSTEMS':'#739bcb','POWER & CULTURE':'#b48aca'}[o?.system]||'#8aa59a';}
  function gallery(){
    const root=$('threadGallery');root.replaceChildren();
    WorldThreadsApp.state.threads.forEach(t=>{
      const card=button('',()=>chooseThread(t),'thread-entry'),graphic=node('div',undefined,'entry-graphic');
      const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 300 90');svg.setAttribute('aria-hidden','true');
      const ids=t.nodeIds.slice(0,6),positions=new Map(ids.map((id,j)=>[id,{x:30+j*240/Math.max(1,ids.length-1),y:j%2?56:30}]));
      for(const r of model.storyEdges(t,WorldThreadsApp.state.relationships)){
        const a=positions.get(r.subjectId),b=positions.get(r.objectId);if(!a||!b)continue;
        const line=document.createElementNS(ns,'path');line.setAttribute('d',`M ${a.x} ${a.y} Q ${(a.x+b.x)/2} 12 ${b.x} ${b.y}`);line.setAttribute('stroke','var(--border)');line.setAttribute('fill','none');svg.append(line);
      }
      for(const id of ids){const p=positions.get(id),c=document.createElementNS(ns,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',id===ids[0]?10:7);c.setAttribute('fill',palette(WorldThreadsApp.obs(id)));svg.append(c);}
      graphic.append(svg);card.append(graphic,node('small',t.subtitle||t.scope||'1816'),node('h3',title(t)),node('p',`${t.nodeIds.length} facts · ${(t.relationshipIds||[]).length} recorded connections`),node('span','Start this story →','entry-link'));root.append(card);
    });
  }
  function renderNetwork(){
    if(!initialized)return;const app=WorldThreadsApp,s=app.state,t=thread();if(!t)return;
    if(currentThread!==t.id){currentThread=t.id;selected=t.nodeIds[0];recent=[selected];arrivedVia=null;caseMode=t.id===starterId;}
    if(!app.obs(selected))selected=t.nodeIds[0];
    $('casePanel').hidden=!caseMode;document.querySelector('.explorer-workspace').hidden=caseMode;
    if(caseMode){$('exploreTitle').textContent=WorldThreadsInvestigation.title;$('exploreDescription').textContent='Inspect the clues, compare explanations, and follow the question that makes you curious.';renderCase();return;}
    $('exploreTitle').textContent=title(t);$('exploreDescription').textContent='Each fact is a clue. Examine how it connects to the next, consider other explanations, and decide what you would investigate.';
    const depth=Number($('connectionDepth').value),ids=model.neighbourhood(t,selected,s.relationships,depth);
    const records=ids.map(id=>app.obs(id)).filter(Boolean),rels=s.relationships.filter(r=>ids.includes(r.subjectId)&&ids.includes(r.objectId)&&(depth||t.relationshipIds?.includes(r.id)||r.id===arrivedVia?.id));
    const canvas=$('networkCanvas');canvas.replaceChildren();const positions=new Map(),width=900,height=Math.max(240,Math.ceil(records.length/3)*160+80);canvas.style.minHeight=height+'px';
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('network-lines');canvas.append(svg);
    const defs=document.createElementNS(ns,'defs'),marker=document.createElementNS(ns,'marker');marker.id='network-direction';marker.setAttribute('viewBox','0 0 10 10');marker.setAttribute('refX','5');marker.setAttribute('refY','5');marker.setAttribute('markerWidth','8');marker.setAttribute('markerHeight','8');marker.setAttribute('orient','auto');
    const arrow=document.createElementNS(ns,'path');arrow.setAttribute('d','M 1 1 L 9 5 L 1 9 z');arrow.setAttribute('fill','var(--link)');marker.append(arrow);defs.append(marker);svg.append(defs);
    records.forEach((o,i)=>positions.set(o.id,{x:150+(i%3)*300,y:90+Math.floor(i/3)*160}));
    for(const r of rels){
      const a=positions.get(r.subjectId),b=positions.get(r.objectId);if(!a||!b)continue;
      const line=document.createElementNS(ns,'path'),mx=(a.x+b.x)/2,my=(a.y+b.y)/2+(a.y===b.y?70:0);
      line.setAttribute('d',`M ${a.x} ${a.y} Q ${a.x} ${my} ${mx} ${my} Q ${b.x} ${my} ${b.x} ${b.y}`);line.setAttribute('marker-mid','url(#network-direction)');line.setAttribute('fill','none');line.setAttribute('stroke','var(--link)');line.setAttribute('stroke-width',r.id===arrivedVia?.id?'4':'2');
      if(['provisional','disputed'].includes(r.communityStatus))line.setAttribute('stroke-dasharray','2 7');else if(['ASSOCIATED','CONTESTED'].includes(r.causalStatus))line.setAttribute('stroke-dasharray','8 6');line.addEventListener('click',()=>openRelationship(r));svg.append(line);
    }
    for(const o of records){
      const p=positions.get(o.id),inStory=t.nodeIds.includes(o.id),b=button('',()=>selectFact(o.id),'network-fact'+(o.id===selected?' selected':'')+(!inStory?' related-fact':''));b.style.left=p.x/width*100+'%';b.style.top=p.y+'px';b.style.setProperty('--node-color',palette(o));b.setAttribute('aria-pressed',String(o.id===selected));b.append(node('small',inStory?'Fact '+(t.nodeIds.indexOf(o.id)+1):'Related lead'),node('strong',factTitle(o)));canvas.append(b);
    }
    reader();
  }
  function connectionCard(r,destination,label){
    const row=node('div',undefined,'next-connection'),other=WorldThreadsApp.obs(destination);
    row.append(node('small',label),button(other?.title||destination,()=>selectFact(destination,r),'next-fact'),node('p',r.explanation),node('small',connectionStatus(r)),button('Inspect this connection’s evidence',()=>openRelationship(r),'trail-link'));return row;
  }
  function connectionStatus(r){
    const meanings={CAUSAL:'Claimed causal link',CONTRIBUTORY:'Contributing influence',ASSOCIATED:'Association, not established causation',CONTESTED:'Connection is contested'};
    return (meanings[r.causalStatus]||r.causalStatus)+' · '+r.confidence+' confidence'+(r.communityStatus?' · '+WorldThreadsCommunityUI?.statusLabel(r.communityStatus):'');
  }
  function startResearch(direction='continue_thread',question='',challengeContext=null){
    WorldThreadsApp.challengeContext=challengeContext;
    const o=WorldThreadsApp.obs(selected);if(!o)return;
    WorldThreadsApp.researchStartId=o.id;$('researchDirection').value=direction;
    $('researchPlace').value=o.place||'';$('personalQuestion').value=question||(direction==='new_thread'?'What other influences might explain '+o.title+'?':'What happened next, or what other influences mattered, around '+o.place+' in 1816?');
    $('proposedThreadTitle').value='';$('researchMission').value='';$('researchMission').dispatchEvent(new Event('change'));
    $('researchGap').value='GAP-010';$('researchGap').dispatchEvent(new Event('change'));
    show('research');tab('prepare');
  }
  function renderInvestigationProgress(){
    const diary=$('investigationProgress');if(!diary)return;diary.replaceChildren(node('h3','Your discovery journal'),node('p','Private exploration milestones do not change historical confidence.'));
    const list=node('ul');for(const id of caseSeen){const lead=WorldThreadsInvestigation.leads.find(l=>l.id===id);if(lead)list.append(node('li','Inspected: '+lead.title));}if(!caseSeen.length)list.append(node('li',recent.length+' recorded facts visited'));
    list.append(node('li',casePins.length+' passages pinned for comparison'));const q=caseQuestion||$('personalQuestion').value;if(q)list.append(node('li','Saved question: '+q));list.append(node('li',synthesisSaved?'Evidence synthesis completed — reasoning recorded, not historically verified':'Evidence synthesis is still open'));diary.append(list,button('Return to my investigation',()=>show('explore')));if(synthesisSaved)for(const [key,label]of [['supports','Supported'],['uncertain','Uncertain'],['next','Next evidence']])diary.append(node('strong',label),node('p',synthesis[key]));
  }
  function researchContext(){
    const target=$('researchTarget');if(!target.options.length)for(const record of [...WorldThreadsApp.state.observations,...WorldThreadsApp.state.relationships]){const option=node('option',record.title||`${WorldThreadsApp.obs(record.subjectId)?.title||record.subjectId} → ${record.predicate.replaceAll('_',' ')} → ${WorldThreadsApp.obs(record.objectId)?.title||record.objectId}`);option.value=record.id;target.append(option);}const start=WorldThreadsApp.researchStartId||selected;if(target.dataset.start!==start){target.value=WorldThreadsApp.challengeContext?.targetClaimId||start;target.dataset.start=start;}
    const t=thread(),o=WorldThreadsApp.obs(WorldThreadsApp.researchStartId||selected);$('researchContext').textContent='Story: '+(t?title(t):'1816');
    const root=$('researchStartingFact');root.replaceChildren();if(o)root.append(node('small','STARTING FROM THIS FACT'),node('strong',o.title),node('p',o.place+' · '+o.startDate),button('Return to this fact',()=>{caseMode=false;selectFact(o.id);show('explore');}));
    const clues=$('researchClues');clues.replaceChildren();const passages=WorldThreadsApp.challengeContext?.passages||[];clues.hidden=!passages.length;if(passages.length){clues.append(node('h3','Clues you are following'),node('p','Your question can test this connection, uncover another influence, or leave the evidence unresolved.','scope-note'));const cards=node('div',undefined,'research-clue-cards');for(const passage of passages){const card=node('article',undefined,'pinned-card');card.append(node('strong',passage.title),node('small',passage.date),node('blockquote',passage.quote),node('p',passage.limits));const link=node('a','Full source ↗');link.href=passage.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';card.append(link);cards.append(card);}clues.append(cards);}

  }
  function reader(){
    const app=WorldThreadsApp,t=thread(),o=app.obs(selected),root=$('factReader');root.replaceChildren();if(!o)return;
    const index=t.nodeIds.indexOf(selected),next=index>=0?model.nextConnection(t,selected,app.state.relationships):null;
    const connections=app.state.relationships.filter(r=>r.subjectId===selected||r.objectId===selected);
    root.append(node('p',index>=0?`CLUE ${index+1} OF ${t.nodeIds.length} · ${title(t)}`:'RELATED BRANCH · YOUR ORIGINAL STORY IS STILL ON THE MAP','eyebrow'),node('h3',factTitle(o)));const scene=node('div',undefined,'scene-context');scene.append(node('small','PLACE & TIME'),node('span',o.place+' · '+o.startDate));root.append(scene);if(storySummaries[o.id])root.append(node('p',storySummaries[o.id],'story-instruction'));
    if(index===0&&!storySummaries[o.id])root.append(node('p','Our story starts here. Follow the recorded connections to see how this fact relates to what happened next.','story-instruction'));
    if(next){
      const onward=node('div',undefined,'guided-next');onward.append(node('small','CONNECTION TO EXAMINE'),button('Next clue: '+factTitle(app.obs(next.objectId))+' →',()=>selectFact(next.objectId,next),'nav-btn primary'),node('p',next.explanation),node('small',connectionStatus(next)),button('Why this connection?',()=>openRelationship(next),'trail-link'));root.append(onward);
    }else{
      const end=node('div',undefined,'guided-next');end.append(node('strong',index>=0?'You’ve followed the recorded clues. What’s missing?':'You’re exploring beyond the original story.'),node('p','No further connection is recorded in this thread. The evidence does not settle every cause or consequence. What would you investigate next?'),button('Investigate an unanswered question',()=>startResearch(),'nav-btn primary'));root.append(end);
      if(index<0)root.append(button('Return to the original story',()=>selectFact(t.nodeIds[0])));
    }
    root.append(node('p',o.observation,'fact-observation'),node('p',o.place+' · '+o.startDate+' · '+(o.communityStatus?WorldThreadsCommunityUI?.statusLabel(o.communityStatus):o.confidence+' confidence'),'reader-meta'),button('Sources for this fact',()=>openDetail(o)));
    if(arrivedVia){const arrived=node('details',undefined,'arrived-connection');arrived.append(node('summary','The connection you just followed'),node('p',arrivedVia.explanation),node('small',connectionStatus(arrivedVia)),button('Inspect connection evidence',()=>openRelationship(arrivedVia)));root.append(arrived);}
    const otherOutgoing=connections.filter(r=>r.subjectId===selected&&r.id!==next?.id),incoming=connections.filter(r=>r.objectId===selected);
    if(otherOutgoing.length){const branches=node('details',undefined,'other-connections');branches.append(node('summary',`Explore ${otherOutgoing.length} other connection${otherOutgoing.length===1?'':'s'}`));for(const r of otherOutgoing)branches.append(connectionCard(r,r.objectId,'FOLLOW ANOTHER CONSEQUENCE OR ASSOCIATION'));root.append(branches);}
    if(incoming.length){const earlier=node('details',undefined,'other-connections');earlier.append(node('summary','What led here?'));for(const r of incoming)earlier.append(connectionCard(r,r.subjectId,'LOOK BACK AT AN EARLIER INFLUENCE'));root.append(earlier);}
    const suggestions={
      'WT-1816-0008':'Why did the same eruption affect places differently?',
      'WT-1816-0009':'Did the weather change what people did, or just the setting?',
      'WT-1816-0015':'How did ghost stories, scientific ideas and creative choices contribute alongside the weather?'
    };
    const wonder=node('section',undefined,'curiosity-card'),suggestion=suggestions[o.id]||'What other influences could explain this—and what evidence would help distinguish them?';
    wonder.append(node('h4','What would you investigate?'),node('p',suggestion),button('Investigate this question',()=>startResearch('continue_thread',suggestion),'trail-link'));
    const question=node('input');question.type='text';question.id='visitorQuestion';question.placeholder='What if…? How could I check?';question.maxLength=1200;
    const questionLabel=node('label','Ask your own question about the clues');questionLabel.htmlFor=question.id;wonder.append(questionLabel,question,button('Start my investigation →',()=>{if(!question.value.trim()){question.focus();return;}startResearch('continue_thread',question.value.trim());}));root.append(wonder);
    const investigation=node('details',undefined,'reader-research');investigation.append(node('summary','Want to add new evidence?'),node('p','Research a missing connection or test another explanation. This takes you to the research tools.'),button('Investigate an unanswered question',()=>startResearch()),button('Investigate another explanation',()=>startResearch('new_thread')));root.append(investigation);
    if(recent.length>1){const visits=node('details',undefined,'journey-trail');visits.append(node('summary','Recently viewed facts'));for(const id of [...new Set(recent.slice(-6))])visits.append(button(app.obs(id)?.title||id,()=>selectFact(id),'trail-link'));root.append(visits);}
  }
  function resume(){
    if(!saved)return;engaged=true;const s=WorldThreadsApp.state,t=s.threads.find(t=>t.id===saved.threadId);if(!t)return;
    caseSeen=(saved.caseSeen||[]).filter(id=>WorldThreadsInvestigation.leads.some(l=>l.id===id));synthesis={supports:'',uncertain:'',next:'',...(saved.synthesis||{})};synthesisSaved=!!saved.synthesisSaved;
    s.threadId=t.id;currentThread=t.id;caseMode=typeof saved.caseMode==='boolean'?saved.caseMode:t.id===starterId;caseQuestion=saved.caseQuestion||'';casePins=(saved.casePins||[]).filter(id=>WorldThreadsInvestigation.leads.some(l=>l.id===id)).slice(0,2);caseStance=saved.caseStance||'';caseLead=saved.caseLead||'';caseReason=saved.caseReason||'';selected=appFact(saved.selected)?saved.selected:t.nodeIds[0];recent=(saved.recent||[]).filter(appFact);WorldThreadsApp.researchStartId=appFact(saved.startingFactId)?saved.startingFactId:null;WorldThreadsApp.challengeContext=saved.challengeContext||null;
    for(const [id,value]of Object.entries(saved.fields||{}))if($(id))$(id).value=value;
    const target=saved.view==='research'?'research':'explore',savedStage=saved.stage;WorldThreadsApp.render();show(target);if(target==='research'&&$('researchPrompt').value)$('makeResearchPrompt').click();tab(['prepare','return','progress'].includes(savedStage)?savedStage:'prepare');
  }
  function appFact(id){return Boolean(WorldThreadsApp.obs(id));}
  function initialize(){
    if(initialized)return;initialized=true;
    try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{}
    $('originalThreadMount').append(document.querySelector('.thread-panel'));document.querySelector('.layout').remove();document.querySelector('.data-strip').remove();$('libraryMount').append(document.querySelector('.filters'),document.querySelector('.observations-panel'));
    const contribute=$('contribute'),prepare=node('section',undefined,'research-stage'),returned=node('section',undefined,'research-stage'),progress=node('section',undefined,'research-stage');prepare.id='prepareResearch';returned.id='returnResearch';progress.id='progressResearch';let returning=false;
    for(const child of [...contribute.children]){if(child.tagName==='H4'&&child.textContent==='Return your findings')returning=true;(returning?returned:prepare).append(child);}
    const empty=node('section',undefined,'review-result');empty.id='emptyProgress';empty.append(node('h3','Your investigation is saved on this device'),node('p','No submission is being tracked yet. Preparing a prompt does not submit research.'),button('Continue researching',()=>tab('prepare')),button('Return findings',()=>tab('return')));const diary=node('section',undefined,'review-result');diary.id='investigationProgress';progress.append(diary,empty,returned.querySelector('#receiptPanel')); contribute.replaceChildren(prepare,returned,progress);
    const evidence=$('evidenceContribute'),details=node('details',undefined,'evidence-disclosure');details.id='evidenceDisclosure';details.addEventListener('toggle',()=>{if(details.open&&$('researchTarget').value)$('evidenceClaim').value=$('researchTarget').value;});details.append(node('summary','Have a source that supports or questions an existing claim?'),evidence);returned.append(details);
    const activity=$('communityActivity').closest('section'),activityDisclosure=node('details',undefined,'collection-context');activityDisclosure.append(node('summary','Recent community findings'),activity);progress.append(activityDisclosure);$('researchMount').append(contribute);
    const badgeTitle=[...prepare.querySelectorAll('h4')].find(x=>x.textContent==='Recognition for discoveries'),badges=node('details',undefined,'collection-context');badges.append(node('summary','Recognition for discoveries'));if(badgeTitle){badges.append(badgeTitle.nextElementSibling,$('contributionBadges'));badgeTitle.remove();prepare.append(badges);}
    const optional=node('details',undefined,'collection-context');optional.append(node('summary','Choose a suggested mission or refine the research scope'));for(const id of ['researchDirection','proposedThreadTitle','researchMission','missionBrief','researchGap','gapQuestion']){const field=$(id),label=prepare.querySelector('label[for="'+id+'"]');if(label)optional.append(label);optional.append(field);}prepare.insertBefore(optional,$('makeResearchPrompt'));prepare.insertBefore(button('Contribute a source passage here · no research assistant needed',()=>{showEvidence();$('evidenceForm').scrollIntoView({behavior:'smooth',block:'start'});},'nav-btn primary'),$('makeResearchPrompt'));const direct=button('Contribute one source passage',()=>{showEvidence();$('evidenceForm').scrollIntoView({behavior:'smooth',block:'start'});},'nav-btn primary');returned.insertBefore(direct,returned.firstChild);
    document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll('[data-research-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.researchTab));$('connectionDepth').onchange=()=>{renderNetwork();remember();};$('resetJourney').onclick=()=>chooseThread(thread());
    $('startExploring').onclick=()=>chooseThread(WorldThreadsApp.state.threads.find(t=>t.id===starterId)||WorldThreadsApp.state.threads[0]);$('browseThreads').onclick=()=>$('threadGallery').scrollIntoView({behavior:'smooth'});
    $('resumeJourney').hidden=!saved?.threadId;$('resumeJourney').onclick=resume;
    $('factReader').tabIndex=-1;if(matchMedia('(max-width:1000px)').matches)$('mapDisclosure').open=false;
    $('copyResearchPrompt').onclick=async()=>{$('makeResearchPrompt').click();try{await navigator.clipboard.writeText($('researchPrompt').value);$('copyPromptStatus').textContent='Copied. Paste into your research assistant, then return its completed research file here.';}catch{$('copyPromptStatus').textContent='Copy is unavailable here. Open the prompt below, or download it.';document.querySelector('.prompt-detail').open=true;}};
    $('goReturnFindings').onclick=()=>tab('return');
    $('makeResearchPrompt').addEventListener('click',()=>{$('copyPromptStatus').textContent='';});
    $('researchMission').addEventListener('change',()=>{const mission=WorldThreadsApp.state.missions.find(m=>m.id===$('researchMission').value);if(mission){WorldThreadsApp.researchStartId=mission.claimRefs.find(appFact)||null;$('personalQuestion').value=mission.title;researchContext();remember();}});
    $('makeResearchPrompt').addEventListener('click',remember);
    for(const id of ['researchPlace','researchDirection','personalQuestion','proposedThreadTitle','researchGap','researchPrompt','researchOutput','researchTarget'])$(id).addEventListener('input',remember);
    const prior=saved;tab('prepare');gallery();renderNetwork();show('discover');saved=prior;if(prior)try{localStorage.setItem(storageKey,JSON.stringify(prior));}catch{}
    if(location.hash.startsWith('#receipt=')){show('research');tab('progress');}
  }
  window.WorldThreadsExplore={show,showEvidence,showProgress:()=>{show('research');tab('progress');},showRecord:id=>{const s=WorldThreadsApp.state,r=s.relationships.find(r=>r.id===id),fact=appFact(id)?id:r?.subjectId;if(!fact)return false;const t=s.threads.find(t=>t.nodeIds.includes(fact));if(t){s.threadId=t.id;currentThread=t.id;}caseMode=false;selected=fact;arrivedVia=r||null;show('explore');return true;},showReturn:()=>{show('research');tab('return');$('researchOutput').focus();},startingFact:()=>WorldThreadsApp.obs(WorldThreadsApp.researchStartId||selected)};
  if(window.WorldThreadsApp?.state.observations.length)initialize();window.addEventListener('worldthreads-ready',initialize);window.addEventListener('worldthreads-rendered',()=>{if(initialized){gallery();renderNetwork();}});
})();
