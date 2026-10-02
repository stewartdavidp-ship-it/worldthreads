/* Guided reading is the default; the original story stays visible while branching. */
(function(){
  const $=id=>document.getElementById(id),model=window.WorldThreadsJourney;
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
  let selected=null,currentThread=null,recent=[],arrivedVia=null,view='discover',stage='prepare',initialized=false,saved=null,engaged=false,caseMode=false,caseStance='',caseLead='',caseReason='';
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
    const fields={};for(const id of ['researchPlace','researchDirection','personalQuestion','proposedThreadTitle','researchGap'])fields[id]=$(id).value;
    saved={threadId:currentThread,selected,recent,view,stage,fields,startingFactId:WorldThreadsApp.researchStartId||null,challengeContext:WorldThreadsApp.challengeContext||null,caseStance,caseLead,caseReason};
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
  function tab(which){stage=which;for(const [name,id]of [['prepare','prepareResearch'],['return','returnResearch'],['progress','progressResearch']])$(id).hidden=name!==which;document.querySelectorAll('[data-research-tab]').forEach(b=>b.classList.toggle('active',b.dataset.researchTab===which));remember();}
  function showEvidence(){show('research');tab('return');$('evidenceDisclosure').open=true;}
  function chooseThread(t){
    WorldThreadsApp.state.threadId=t.id;selected=t.nodeIds[0];recent=[selected];currentThread=t.id;arrivedVia=null;caseMode=t.id===starterId;caseStance='';caseLead='';caseReason='';
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
    const c=WorldThreadsInvestigation,root=$('casePanel');root.replaceChildren();
    const claim=node('div',undefined,'case-claim');claim.append(node('p','CLAIM TO TEST · GENEVA, 1816','eyebrow'),node('h3',c.claim),node('p',c.boundary));
    const positions=node('div',undefined,'case-positions');positions.setAttribute('role','group');positions.setAttribute('aria-label','Your working position');
    for(const [value,label]of [['supports','I lean toward agreeing'],['counterevidence','I’m not convinced'],['unresolved','I need more evidence']]){const b=button(label,()=>{caseStance=value;remember();renderCase();},'nav-btn'+(caseStance===value?' active':''));b.setAttribute('aria-pressed',String(caseStance===value));positions.append(b);}
    claim.append(node('p','1 · What is your working position? You can revise it after reading.'),positions,node('p','A position is a starting point. Only sourced evidence can strengthen or challenge the recorded relationships.','scope-note'));root.append(claim);
    const layout=node('div',undefined,'case-evidence-layout'),leads=node('div',undefined,'case-leads');leads.append(node('h3','2 · Examine the clues'),node('p','Pick a source passage. Look for what it establishes—and what it does not.'));
    for(const lead of c.leads){const b=button('',()=>{caseLead=lead.id;remember();renderCase();$('caseSource').scrollIntoView({behavior:'smooth',block:'nearest'});},'case-lead'+(caseLead===lead.id?' selected':''));b.setAttribute('aria-pressed',String(caseLead===lead.id));b.append(node('small',lead.date),node('strong',lead.title),node('span','Examine this passage →'));leads.append(b);}
    const source=node('article',undefined,'case-source');source.id='caseSource';source.setAttribute('aria-live','polite');const chosen=c.leads.find(l=>l.id===caseLead);
    if(chosen){source.append(node('p','SOURCE PASSAGE · '+chosen.date,'eyebrow'),node('h3',chosen.title),node('blockquote',chosen.quote),node('p',chosen.locator));const link=node('a','Read the passage in its full source ↗');link.href=c.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';source.append(link,node('h4','Question the connection'),node('p',chosen.question),node('h4','What this cannot establish'),node('p',chosen.limits));}
    else source.append(node('h3','Which clue would you inspect first?'),node('p','You do not need to read them in order. Start with the clue that might strengthen—or change—your explanation.'));
    source.append(node('p',c.sourcesNote,'source-warning'));layout.append(leads,source);root.append(layout);
    const response=node('section',undefined,'case-response');response.append(node('h3','3 · Make the case with evidence'),node('p','Explain what a passage supports or weakens. What additional evidence would distinguish weather, the challenge, scientific ideas and creative choices?'));
    const label=node('label','Your evidence-based reasoning and unanswered question');label.htmlFor='caseReason';const input=node('textarea');input.id='caseReason';input.rows=4;input.maxLength=1600;input.value=caseReason;input.placeholder='This passage suggests… But it cannot tell us… I would look for…';input.oninput=()=>{caseReason=input.value;remember();};response.append(label,input);
    const status=node('p',undefined,'scope-note');status.id='caseActionStatus';status.setAttribute('role','status');
    response.append(button('Research the missing evidence →',()=>{if(!caseStance||!chosen||caseReason.trim().length<30){status.textContent='Choose a working position, inspect a passage, and explain your reasoning (at least 30 characters).';return;}selected=c.startingFactId;startResearch('new_thread',`Test the claim: ${c.claim} My working position: ${caseStance==='supports'?'tentatively support':caseStance==='counterevidence'?'challenge':'unresolved'}. Inspected lead: ${chosen.title}. Reasoning and missing evidence: ${caseReason}. Seek evidence that could support or overturn this position; do not assume it is correct.`,{claim:c.claim,workingPosition:caseStance,sourceUrl:c.sourceUrl,locator:chosen.locator,quote:chosen.quote,limits:chosen.limits,sourceDependence:c.sourcesNote});},'nav-btn primary'));
    response.append(button('Contribute a passage about the recorded weather connection',()=>{if(!chosen){status.textContent='Inspect a source passage before preparing evidence.';return;}showEvidence();$('evidenceClaim').value=c.targetClaimId;$('evidenceStance').value='';$('evidenceSubmitStatus').textContent='The recorded relationship says weather was a contributing context—not the decisive cause. Choose whether this passage supports or weakens that narrower relationship, and explain its relevance.';$('evidenceTitle').value='Frankenstein (1831): Introduction and reproduced 1817 Preface';$('evidenceUrl').value=c.sourceUrl;$('evidenceLocator').value=chosen.locator;$('evidenceQuote').value=chosen.quote;$('evidenceRelevance').value='';$('evidenceLimits').value=chosen.limits+' '+c.sourcesNote;},'nav-btn'),status,node('p','Your working position stays on this device. It is not a vote, a published comment or a finding. Publishing requires cited evidence and automatic checks.','scope-note'));
    root.append(response,button('Explore the recorded facts and relationships',()=>{caseMode=false;selected=c.startingFactId;renderNetwork();},'nav-btn'));
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
    if(currentThread!==t.id){currentThread=t.id;selected=t.nodeIds[0];recent=[selected];arrivedVia=null;}
    if(!app.obs(selected))selected=t.nodeIds[0];
    $('casePanel').hidden=!caseMode;document.querySelector('.explorer-workspace').hidden=caseMode;
    if(caseMode){$('exploreTitle').textContent=WorldThreadsInvestigation.title;$('exploreDescription').textContent='Take a position, inspect the source passages, then decide what evidence you still need. You can change your view.';renderCase();return;}
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
  function researchContext(){
    const t=thread(),o=WorldThreadsApp.obs(WorldThreadsApp.researchStartId||selected);$('researchContext').textContent='Story: '+(t?title(t):'1816');
    const root=$('researchStartingFact');root.replaceChildren();if(o)root.append(node('small','STARTING FROM THIS FACT'),node('strong',o.title),node('p',o.place+' · '+o.startDate),button('Return to this fact',()=>{selectFact(o.id);show('explore');}));
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
    wonder.append(node('h4','What would you investigate?'),node('p',suggestion),button('Investigate this question',()=>startResearch('new_thread',suggestion),'trail-link'));
    const question=node('input');question.type='text';question.id='visitorQuestion';question.placeholder='What if…? How could I check?';question.maxLength=1200;
    const questionLabel=node('label','Ask your own question about the clues');questionLabel.htmlFor=question.id;wonder.append(questionLabel,question,button('Start my investigation →',()=>{if(!question.value.trim()){question.focus();return;}startResearch('new_thread',question.value.trim());}));root.append(wonder);
    const investigation=node('details',undefined,'reader-research');investigation.append(node('summary','Want to add new evidence?'),node('p','Research a missing connection or test another explanation. This takes you to the research tools.'),button('Investigate an unanswered question',()=>startResearch()),button('Investigate another explanation',()=>startResearch('new_thread')));root.append(investigation);
    if(recent.length>1){const visits=node('details',undefined,'journey-trail');visits.append(node('summary','Recently viewed facts'));for(const id of [...new Set(recent.slice(-6))])visits.append(button(app.obs(id)?.title||id,()=>selectFact(id),'trail-link'));root.append(visits);}
  }
  function resume(){
    if(!saved)return;engaged=true;const s=WorldThreadsApp.state,t=s.threads.find(t=>t.id===saved.threadId);if(!t)return;
    s.threadId=t.id;currentThread=t.id;caseMode=t.id===starterId;caseStance=saved.caseStance||'';caseLead=saved.caseLead||'';caseReason=saved.caseReason||'';selected=appFact(saved.selected)?saved.selected:t.nodeIds[0];recent=(saved.recent||[]).filter(appFact);WorldThreadsApp.researchStartId=appFact(saved.startingFactId)?saved.startingFactId:null;WorldThreadsApp.challengeContext=saved.challengeContext||null;
    for(const [id,value]of Object.entries(saved.fields||{}))if($(id))$(id).value=value;
    const target=saved.view==='research'?'research':'explore',savedStage=saved.stage;WorldThreadsApp.render();show(target);tab(['prepare','return','progress'].includes(savedStage)?savedStage:'prepare');
  }
  function appFact(id){return Boolean(WorldThreadsApp.obs(id));}
  function initialize(){
    if(initialized)return;initialized=true;
    try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{}
    $('originalThreadMount').append(document.querySelector('.thread-panel'));document.querySelector('.layout').remove();document.querySelector('.data-strip').remove();$('libraryMount').append(document.querySelector('.filters'),document.querySelector('.observations-panel'));
    const contribute=$('contribute'),prepare=node('section',undefined,'research-stage'),returned=node('section',undefined,'research-stage'),progress=node('section',undefined,'research-stage');prepare.id='prepareResearch';returned.id='returnResearch';progress.id='progressResearch';let returning=false;
    for(const child of [...contribute.children]){if(child.tagName==='H4'&&child.textContent==='Return your findings')returning=true;(returning?returned:prepare).append(child);}
    progress.append($('receiptPanel'));contribute.replaceChildren(prepare,returned,progress);
    const evidence=$('evidenceContribute'),details=node('details',undefined,'evidence-disclosure');details.id='evidenceDisclosure';details.append(node('summary','Have a source that supports or questions an existing claim?'),evidence);returned.append(details);
    const activity=$('communityActivity').closest('section'),activityDisclosure=node('details',undefined,'collection-context');activityDisclosure.append(node('summary','Recent community findings'),activity);progress.append(activityDisclosure);$('researchMount').append(contribute);
    const badgeTitle=[...prepare.querySelectorAll('h4')].find(x=>x.textContent==='Recognition for discoveries'),badges=node('details',undefined,'collection-context');badges.append(node('summary','Recognition for discoveries'));if(badgeTitle){badges.append(badgeTitle.nextElementSibling,$('contributionBadges'));badgeTitle.remove();prepare.append(badges);}
    const optional=node('details',undefined,'collection-context');optional.append(node('summary','Choose a suggested mission or refine the research scope'));for(const id of ['proposedThreadTitle','researchMission','missionBrief','researchGap','gapQuestion']){const field=$(id),label=prepare.querySelector('label[for="'+id+'"]');if(label)optional.append(label);optional.append(field);}prepare.insertBefore(optional,$('makeResearchPrompt'));
    document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));document.querySelectorAll('[data-research-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.researchTab));$('connectionDepth').onchange=()=>{renderNetwork();remember();};$('resetJourney').onclick=()=>chooseThread(thread());
    $('startExploring').onclick=()=>chooseThread(WorldThreadsApp.state.threads.find(t=>t.id===starterId)||WorldThreadsApp.state.threads[0]);$('browseThreads').onclick=()=>$('threadGallery').scrollIntoView({behavior:'smooth'});
    $('resumeJourney').hidden=!saved?.threadId;$('resumeJourney').onclick=resume;
    $('factReader').tabIndex=-1;if(matchMedia('(max-width:1000px)').matches)$('mapDisclosure').open=false;
    $('copyResearchPrompt').onclick=async()=>{try{await navigator.clipboard.writeText($('researchPrompt').value);$('copyPromptStatus').textContent='Copied. Paste into your research assistant, then return its completed research file here.';}catch{$('copyPromptStatus').textContent='Copy is unavailable here. Open the prompt below, or download it.';document.querySelector('.prompt-detail').open=true;}};
    $('goReturnFindings').onclick=()=>tab('return');
    $('makeResearchPrompt').addEventListener('click',()=>{$('copyPromptStatus').textContent='';});
    $('researchMission').addEventListener('change',()=>{const mission=WorldThreadsApp.state.missions.find(m=>m.id===$('researchMission').value);if(mission){WorldThreadsApp.researchStartId=mission.claimRefs.find(appFact)||null;$('personalQuestion').value=mission.title;researchContext();remember();}});
    for(const id of ['researchPlace','researchDirection','personalQuestion','proposedThreadTitle','researchGap'])$(id).addEventListener('input',remember);
    const prior=saved;tab('prepare');gallery();renderNetwork();show('discover');saved=prior;if(prior)try{localStorage.setItem(storageKey,JSON.stringify(prior));}catch{}
    if(location.hash.startsWith('#receipt=')){show('research');tab('progress');}
  }
  window.WorldThreadsExplore={show,showEvidence,showProgress:()=>{show('research');tab('progress');},startingFact:()=>WorldThreadsApp.obs(WorldThreadsApp.researchStartId||selected)};
  if(window.WorldThreadsApp?.state.observations.length)initialize();window.addEventListener('worldthreads-ready',initialize);window.addEventListener('worldthreads-rendered',()=>{if(initialized){gallery();renderNetwork();}});
})();
