const storyCatalog=[
 {id:'harvests',short:'Shock, harvests and human consequences',title:'Why did the same year have different outcomes?',deck:'Follow the weather into food pressure, then challenge the explanation with Korea.',region:'Europe · Korea',thread:'THREAD-KOREA-RECOVERY',gap:'GAP-010',question:'Which local conditions explain Korea’s rice recovery, and who still faced hardship?',needed:'Provincial crop calendars, tax records and household food-access evidence for 1816–1817.',labels:['Question','Tambora','Food pressure','Hypothesis','Korean rice','Relief'],records:[null,'WT-1816-0008','WT-1816-0006',null,'WT-1816-0045','WT-1816-0035']},
 {id:'relief',short:'Food, delay and access',title:'Relief was ordered. Did it reach people?',deck:'Trace rising prices, stock monitoring, delayed imports and the limits of a decree.',region:'Netherlands · 1816–1817',thread:'THREAD-DUTCH-RELIEF',question:'Did the subsidized rye reach poorer Amsterdam households, in time to help?',needed:'Distribution ledgers, delivery dates, eligible households and local prices before and after the sales.',labels:['Price pressure','Stock check','Imports','Subsidy'],records:['WT-1816-0032','WT-1816-0033','WT-1816-0034','WT-1816-0035'],chapters:[
 {label:'The pressure',title:'Food gets harder to afford.',text:'Amsterdam rye prices more than doubled during the crisis. The question is no longer simply whether grain existed: could households obtain it?',record:'WT-1816-0032',next:'What did the stock check show?'},
 {label:'The response',title:'Counting stocks is a first step.',text:'Delft inventoried merchants’ and bakers’ grain stocks. This documents monitoring in another Dutch city; it does not tell us how much food reached Amsterdam households.',record:'WT-1816-0033',claim:'REL-0024',next:'When did the grain arrive?'},
 {label:'The delay',title:'Purchased grain is not yet available food.',text:'Public grain purchases used commercial networks. Much of the stock arrived only in late spring or summer 1817. Transport time could separate a policy response from the moment of need.',record:'WT-1816-0034',claim:'REL-0025',next:'Who was the rye reserved for?'},
 {label:'The evidence boundary',title:'A decree gives us a question, not an outcome.',text:'A royal decree reserved rye for reduced-price sales to poorer Amsterdam residents. We have evidence of authorization. We do not yet have the household-level evidence needed to show who benefited.',record:'WT-1816-0035',claim:'REL-0026',finish:true}
 ]},
 {id:'andes',short:'Production, preparation and a mountain crossing',title:'What made crossing the Andes possible?',deck:'Follow workshops and training into a military crossing—without mistaking sequence for a complete explanation.',region:'South America · 1816–1817',thread:'THREAD-ANDES',gap:'GAP-005',question:'How did equipment, food and transport reach the crossing columns, and what failed along the way?',needed:'Dated workshop accounts, provisioning lists, route journals and losses by column.',labels:['Workshops','Training','Crossing','Battle'],records:['WT-1816-0060','WT-1816-0029','WT-1816-0030','WT-1816-0031'],chapters:[
 {label:'The material foundation',title:'A mountain campaign starts in a workshop.',text:'Mendoza workshops supplied equipment, weapons and ammunition. A heritage account estimates about 371 workers around 1816. That is evidence of production capacity, not a complete delivery ledger.',record:'WT-1816-0060',claim:'REL-0046',next:'How did they prepare the army?'},
 {label:'The organization',title:'Equipment needs an organized army.',text:'San Martín became commander in August 1816; units entered the El Plumerillo training camp in September. Training and organization contributed to the later crossing.',record:'WT-1816-0029',claim:'REL-0022',next:'How did they cross the mountains?'},
 {label:'The crossing',title:'Multiple columns cross the passes.',text:'Columns departed Cuyo in January 1817 and assembled west of the mountains in February. The recorded crossing connects preparation to action, but the costs and supply problems need finer evidence.',record:'WT-1816-0030',next:'What happened after the crossing?'},
 {label:'The evidence boundary',title:'The crossing preceded victory. That is not the whole cause.',text:'The army won at Chacabuco. The recorded link from crossing to battle is chronological, not proof that preparation alone explains the victory. The next layer of the story needs logistics and competing military explanations.',record:'WT-1816-0031',claim:'REL-0023',finish:true}
 ]}
];
function render1816Entry(comparisonOpen = false) {hideJourneyHeader();
 document.getElementById('investigationProgress').hidden = true;
 document.getElementById('storyJourney').innerHTML = `<article class="story-1816">
  <p class="eyebrow">1816 · Weather and harvests</p>
  <h1 id="storyHeading" tabindex="-1">Why was 1816 the Year Without a Summer?</h1>
  <p>Much of Europe had an unusually cold summer in 1816. Mount Tambora erupted in April 1815. Sulfur from the eruption formed tiny particles that reduced sunlight and made the cold more likely.</p>
  <p><a href="https://www.research.ed.ac.uk/en/publications/disentangling-the-causes-of-the-1816-european-year-without-a-summ/" target="_blank" rel="noopener noreferrer">Climate study · Schurer et al. (2019) ↗</a></p>
  <details class="story-1816-comparison" ${comparisonOpen ? 'open' : ''}>
   <summary>Did crops fail everywhere? Compare two regions</summary>
   <h2>Two regions, different reports</h2>
   <div class="region-comparison"><section><h3>Czech Lands · grain and prices</h3><p> Weather records and historical accounts describe a cold summer and poor grain harvests. Grain prices rose widely in 1817. <a href="https://cp.copernicus.org/articles/12/1361/2016/index.html" target="_blank" rel="noopener noreferrer">Read the Czech Lands study ↗</a></p></section>
   <section><h3>Korea · rice reports</h3><p> Historical records describe a bumper rice crop in 1816. <a href="https://link.springer.com/article/10.1007/s10584-023-03480-w" target="_blank" rel="noopener noreferrer">Read the Korean study ↗</a></p></section></div>
   <p>A cold summer can help explain local harvest losses. The two studies use different crops and reporting methods. To explain who went hungry, you would also need evidence about food access.</p>
   <a class="story-next" href="?investigate=harvests">Try the guided investigation →</a>
  </details>
  <p><a href="./">Explore more 1816 stories →</a></p>
 </article>`;
}

function renderStoryShelf(focus){
 document.getElementById('storyJourney').innerHTML=`<header class="story-shelf-heading story-first"><div><p class="eyebrow">A story from 1816</p><h1 id="storyHeading" tabindex="-1">What made crossing the Andes possible?</h1><p>Before an army could cross the mountains, someone had to make its equipment. Follow the trail from a Mendoza workshop to the mountain passes.</p><button type="button" class="story-next" data-start-story="andes">${storyProgress('andes').caseFiled?'Revisit the Andes story':storyProgress('andes').visited.length?'Resume the Andes story':'Start the Andes story'} →</button></div><div class="story-first-art">${storySceneArt('andes')}</div></header><div class="story-shelf">${storyCatalog.filter(s=>s.id!=='andes').map(s=>s.id==='harvests'?`<article class="story-cover hai-cover">${storySceneArt(s.id)}<span class="eyebrow">1816 · Czech Lands and Korea</span><h2>Why was 1816 the Year Without a Summer?</h2><p>Find out what made the summer cold, then see why harvests differed.</p><a href="?story=1816">Read the 1816 story →</a><button type="button" class="story-next" data-ai-harvest-start>${harvestAI.step?'Resume AI investigation':'Start AI investigation'} →</button><button type="button" class="story-back" data-start-story="harvests">${storyProgress('harvests').visited.length?'Resume detailed historical notebook':'Open detailed historical notebook'} →</button></article>`:`<button class="story-cover" data-start-story="${s.id}">${storySceneArt(s.id)}<span class="eyebrow">${escapeHtml(s.region)}</span><h2>${escapeHtml(s.title)}</h2><span class="cover-end">${storyProgress(s.id).caseFiled?'✓ Case earned · ':completedStory(s)?'Story checks done · Case not earned · ':''}${(s.chapters||storyChapters).length} steps</span><strong>${storyProgress(s.id).caseFiled?'Revisit earned case →':storyProgress(s.id).visited.length?'Resume your investigation →':'Start this story →'}</strong></button>`).join('')}</div>${quotleEntryHtml()}${(validThread(readThesisDraft().threadId)||historicalObject(readThesisDraft().objectId))?`<section class="local-finding"><h2>Continue your research draft</h2><p>${escapeHtml(readThesisDraft().title||'Your investigation')}</p><button class="story-next" data-open-thesis>Resume my explanation →</button>${defenseResumeHtml()}<p>${draftDirty?'Kept in this page session; download before leaving':'Saved in this browser'} · your argument, evidence and decision history.</p></section>`:''}${expeditionHtml()}${challengesHtml()}<p class="story-footnote">Scene illustrations are not historical reconstructions. These are three guided starting points, not a complete history of 1816. Open Research library for all ${state.threads.length} threads.</p>`;
 if(focus)document.getElementById('storyHeading').focus();
}
function storyGraphic(config,chapters){
 const visited=new Set(storyProgress(config.id).visited.filter(i=>i>=0&&i<chapters.length));visited.add(story.step);const available=i=>visited.has(i)&&!(config.id==='harvests'&&i===4&&!harvestInquiry.revealed)&&!(config.id==='relief'&&!storyProgress(config.id).solved.includes(i));const revealed=config.records.filter((id,i)=>id&&available(i));
 const rels=state.relationships.filter(r=>revealed.includes(r.subjectId)&&revealed.includes(r.objectId));
 return `<details class="story-route"><summary>Explore the story so far · ${visited.size}/${chapters.length} steps visited</summary><section class="unfolding-map" aria-label="Story unfolding"><div class="map-caption"><strong>The story so far</strong><small>Tap a revealed stop to revisit it.</small></div><div class="story-stops">${config.labels.map((label,i)=>`<button data-story-step="${i}" ${visited.has(i)?'':'disabled'} class="story-stop ${visited.has(i)&&i!==story.step?'visited':''}" ${i===story.step?'aria-current="step"':''}><span>${i+1}</span>${escapeHtml(label)}<small>${!visited.has(i)?'Not reached':i===story.step?'You are here':available(i)?'Revisit this step':'Visited · evidence still to inspect'}</small></button>`).join('')}<button class="story-stop frontier-stop" data-story-frontier ${story.step===chapters.length-1&&(!currentInvestigation()||caseSolved())?'':'disabled'}><span>?</span>Evidence frontier<small>Unanswered · not a fact</small></button></div>${rels.length?`<details class="map-connections"><summary>${rels.length} sourced connections revealed</summary>${rels.map(r=>`<button class="map-connection ${r.causalStatus.toLowerCase()}" data-story-claim="${r.id}"><span>${escapeHtml(obs(r.subjectId).title)}</span><strong>${escapeHtml(predicateLabel(r))} →</strong><span>${escapeHtml(obs(r.objectId).title)}</span><small>${escapeHtml(claimStatus(r))} · inspect the claim</small></button>`).join('')}</details>`:''}<p class="map-note">Stops show the order of this story, not causal arrows. Only the labeled sourced connections make relationship claims.</p></section></details>`;
}
function proposalKey(){return 'worldthreads-proposal-'+story.id;}
function frontierHtml(config){
 let draft=null;try{draft=JSON.parse(localStorage.getItem(proposalKey())||'null');}catch{}
 return `<section class="evidence-frontier"><p class="eyebrow">Here the recorded evidence stops</p><h2>${escapeHtml(config.question)}</h2><p><strong>Evidence that could extend this story:</strong> ${escapeHtml(config.needed)}</p><details id="storyContribution"><summary>Help extend this story</summary><p>Propose a sourced fact or connection. Your draft is saved only in this browser and can be downloaded for review. It is not published or added to the evidence graph.</p><form id="proposalForm"><label>Proposed fact or connection<textarea id="proposalClaim" name="claim" required maxlength="4000">${escapeHtml(draft?.claim||'')}</textarea></label><label>Source URL<input name="url" type="url" required value="${escapeAttr(draft?.url||'')}" placeholder="https://…"></label><label>Page, passage or archival reference<input name="locator" required maxlength="1000" value="${escapeAttr(draft?.locator||'')}"></label><label>Date and place supported by the source<input name="datePlace" required maxlength="1000" value="${escapeAttr(draft?.datePlace||'')}"></label><label>What are you proposing?<select name="kind">${['Observation','Contributing connection','Association','Challenge to an existing claim'].map(k=>`<option ${draft?.kind===k?'selected':''}>${k}</option>`).join('')}</select></label><label>Limits, alternative explanations or conflicting evidence<textarea name="limits" required maxlength="4000">${escapeHtml(draft?.limits||'')}</textarea></label><button class="story-next" type="submit">Save draft in this browser</button></form><p id="proposalStatus" role="status">${draft?'A local draft is saved. It has not been submitted.':''}</p><button class="story-back" data-download-proposal ${draft?'':'hidden'}>Download proposal for review</button><p>Before this can become evidence: check the source, verify dates and scope, distinguish observation from inference, and assess competing explanations. A missing link is not permission to invent one.</p></details></section>`;
}
function saveProposal(e){
 if(e.target.id!=='proposalForm')return;e.preventDefault();
 const values=Object.fromEntries(new FormData(e.target));const url=new URL(values.url);
 if(!['https:','http:'].includes(url.protocol)){document.getElementById('proposalStatus').textContent='Use an http or https source URL.';return;}
 const config=storyCatalog.find(s=>s.id===story.id);const proposal={...values,storyId:story.id,threadId:config.thread,gapId:config.gap||null,question:config.question,status:'Unreviewed proposal',createdAt:new Date().toISOString()};
 try{localStorage.setItem(proposalKey(),JSON.stringify(proposal));recordProgress('draft',true);document.getElementById('proposalStatus').textContent='Draft saved in this browser. It has not been submitted or added as a fact.';document.querySelector('[data-download-proposal]').hidden=false;}catch{document.getElementById('proposalStatus').textContent='Browser storage is unavailable. The draft has not been saved.';}
}
function downloadProposal(){
 const draft=localStorage.getItem(proposalKey());if(!draft)return;
 const url=URL.createObjectURL(new Blob([draft],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='worldthreads-'+story.id+'-proposal.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function arrangeReliefScene(scene, chapter) {
 const lead = document.createElement('section');
 lead.className = 'relief-story-lead';
 const narrative = scene.querySelector('.story-narrative');
 narrative.textContent = chapter.text;
 const heading = scene.querySelector('h1');
 scene.prepend(lead);
 lead.append(heading, narrative);
 const actions = scene.querySelector(':scope > .story-actions');
 const workbench = scene.querySelector(':scope > .case-workbench');
 const revealed = scene.querySelector(':scope > .case-reveal');
 if (workbench) {
  const invitation = document.createElement('p');
  invitation.textContent = [
   'Which record can tell you whether food became harder to afford?',
   'Amsterdam prices and a Delft inventory describe different places. What can you connect?',
   'Buying grain and receiving it take place at different times. Check the dates.',
   'A decree can reserve food. Which record would show who received it?'
  ][story.step];
  const inspect = document.createElement('button');
  inspect.type = 'button';
  inspect.className = 'story-back';
  inspect.textContent = 'Examine the evidence →';
  inspect.addEventListener('click', () => {
   const clue = workbench.querySelector('[data-case-clue]');
   clue.focus({preventScroll:true});
   clue.scrollIntoView({block:'center',behavior:'instant'});
  });
  lead.append(invitation, inspect);
  const instruction = document.createElement('p');
  instruction.className = 'media-note';
  instruction.textContent = 'Inspect the relevant clues and choose an interpretation to continue the story.';
  lead.append(instruction);
 }
 if (actions) lead.append(actions);
 if (workbench || revealed) scene.classList.add('relief-desktop-scene');
}
