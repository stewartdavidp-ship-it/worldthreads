/* Cooperative investigation notes stay separate from public historical claims. */
(function(){
 const API='https://worldthreads-community.stewartd.workers.dev',storage='worldthreads-group-session-v1';
 const $=id=>document.getElementById(id);
 const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 let access=null,room=null,timer=null,initialized=false,joinCase=null,foundCode='',extensionKey='';
 const cases=()=>window.WorldThreadsGroupCases;
 const current=()=>cases()[room?.caseId||$('sessionCase').value];
 const lead=id=>current()?.leads.find(l=>l.id===id);
 async function request(path,body){
  const response=await fetch(API+'/api/rooms'+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(access?{Authorization:'Bearer '+access.token}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();if(!response.ok)throw Error(data.error||'Could not connect. Your notes remain in the form.');return data;
 }
 function status(message){$('sessionStatus').textContent=message;}
 function button(text,action){const b=el('button',text,'nav-btn');b.type='button';b.onclick=action;return b;}
 function remember(value){access=value;try{localStorage.setItem(storage,JSON.stringify(value));}catch{}const url=new URL(location.href);url.hash='session='+value.id+'.'+value.token;history.replaceState(null,'',url);}
 function options(select,c,counts={},preferred){
  const selected=preferred||select.value;select.replaceChildren();
  for(const l of c.leads){const o=el('option',l.title+(counts[l.id]?` · ${counts[l.id]} investigating`:' · uncovered'));o.value=l.id;select.append(o);}
  select.value=c.leads.some(l=>l.id===selected)?selected:c.leads.find(l=>!counts[l.id])?.id||c.leads[0].id;
 }
 function sourceCard(l,root){
  root.replaceChildren();if(!l)return;root.append(el('h4',l.title));
  if(l.type)root.append(el('span',l.type,'session-source-type'));
  root.append(el('p',l.date));
  if(l.quote)root.append(el('blockquote',l.quote));else root.append(el('p',l.summary,'session-source-summary'),el('small','Source summary · not a quotation'));
  root.append(el('p','Locator: '+l.locator),el('p','Limit: '+l.limits));
  if(l.question)root.append(el('p',l.question,'session-clue-question'));
  const link=el('a','Inspect the source ↗');link.href=l.sourceUrl||current().sourceUrl;link.target='_blank';link.rel='noopener noreferrer';root.append(link);
 }
 function occupancy(members){const counts={};for(const m of members.filter(m=>m.active))counts[m.leadId]=(counts[m.leadId]||0)+1;return counts;}
 function render(){
  $('sessionLobby').hidden=!!room;$('sessionBoard').hidden=!room;
  if(!room){$('sessionTitle').textContent='Choose a case with your friends';return;}
  const c=current(),me=room.members.find(m=>m.id===room.you);if(!c||!me){status('This case is unavailable. Refresh the page for the current release.');return;}
  $('sessionTitle').textContent=c.title;$('sessionBoundary').textContent=c.claim+' '+c.boundary;
  const map=$('sessionQuestionMap');map.replaceChildren();if(c.questionMap){map.append(el('p','Possible connections to investigate · not established findings','scope-note'));const path=el('div',undefined,'session-question-map');for(const question of c.questionMap)path.append(el('span',question));map.append(path);}
  $('sessionCode').textContent=room.code;const invite=new URL(location.href);invite.hash='join='+room.code;$('sessionInvite').value=invite.href;
  $('sessionPhase').textContent=room.phase==='compare'?'Comparison is open':'Your friends’ leads';
  const members=$('sessionMembers');members.replaceChildren();
  for(const m of room.members){const state=!m.active?'withdrew':m.ready?'ready':room.phase==='compare'?'did not contribute yet':'investigating';members.append(el('li',m.alias+(m.isHost?' · host':'')+' · '+(lead(m.leadId)?.title||m.leadId)+' · '+state));}
  const counts=occupancy(room.members),uncovered=c.leads.filter(l=>!counts[l.id]);
  $('sessionCoordination').textContent=uncovered.length?'Uncovered leads: '+uncovered.map(l=>l.title).join(' · ')+'. Choose one to widen your group’s investigation.':'Every lead has an investigator. Duplicate readings can test whether you interpret the same clue differently.';
  $('sessionYourName').textContent='Your investigation · '+me.alias+(room.phase==='compare'?' · inspect or revise':'');
  const first=$('sessionLead').dataset.member!==me.id;
  options($('sessionLead'),c,counts,first?me.leadId:$('sessionLead').value);
  if(first){$('sessionLead').dataset.member=me.id;for(const [field,key]of [['sessionSupports','supports'],['sessionUncertain','uncertain'],['sessionNextEvidence','nextEvidence'],['sessionNextQuestion','followUp']])$(field).value=me.notes?.[key]||'';sourceCard(lead(me.leadId),$('sessionPassage'));}
  const active=room.members.filter(m=>m.active),ready=active.filter(m=>m.ready),unfinished=active.some(m=>!m.ready),comparing=room.phase==='compare';
  $('sessionCompare').hidden=!room.isHost||comparing;$('sessionCompare').disabled=ready.length<2||unfinished;
  $('sessionProceed').hidden=!room.isHost||comparing||!unfinished||ready.length<2;
  $('sessionProceedButton').disabled=ready.length<2||!$('sessionProceedConsent').checked;
  $('sessionOwnWork').hidden=!me.active;if($('sessionOwnWork').dataset.phase!==room.phase){$('sessionOwnWork').dataset.phase=room.phase;$('sessionOwnWork').open=!comparing;}$('sessionWithdraw').hidden=room.isHost||!me.active;
  $('sessionWaiting').hidden=comparing;$('sessionComparison').hidden=!comparing;
  $('sessionWaiting').textContent=me.ready?'Your interpretation is ready. Ask a friend what record they would look for next while you wait. Peer notes stay hidden until comparison.':'Read the clue and jot three short notes. Discuss in person or on your call after the reveal.';
  if(comparing){
   $('sessionDiscussion').textContent=c.comparisonPrompt;$('sessionSourcesNote').textContent=c.sourcesNote;
   const board=$('sessionEvidenceBoard');board.replaceChildren();
   for(const m of room.members.filter(m=>m.contributed&&m.notes)){
    const card=el('article',undefined,'session-evidence-card');card.append(el('h4',m.alias));const excerpt=el('div');sourceCard(lead(m.leadId),excerpt);card.append(excerpt);
    for(const [key,label]of [['supports','What this supports'],['uncertain','What remains uncertain'],['nextEvidence','Evidence to look for'],['followUp','Next investigation']])if(m.notes[key])card.append(el('strong',label),el('p',m.notes[key]));board.append(card);
   }
   $('sessionExtension').hidden=!c.extension;
   if(c.extension){$('sessionExtensionTitle').textContent=c.extension.title;$('sessionExtensionIntro').textContent=c.extension.intro;if(extensionKey!==room.id){extensionKey=room.id;$('sessionExtensionCards').hidden=true;$('sessionOpenExtension').hidden=false;const cards=$('sessionExtensionCards');cards.replaceChildren();for(const l of c.extension.cards){const card=el('article',undefined,'session-evidence-card');sourceCard(l,card);cards.append(card);}}}
   const next=$('sessionNextSteps');next.replaceChildren();for(const question of c.nextQuestions)next.append(button(question,()=>{$('sessionNextQuestion').value=question;}));
   $('sessionSaveNext').disabled=!me.active;
  }
 }
 async function refresh(){if(!access)return;const identity=access;try{const updated=await request('/'+identity.id);if(access!==identity)return;room=updated;render();status('Connected. Shared work refreshes every 10 seconds while this page is open.');}catch(e){status(e.message);}finally{clearTimeout(timer);if(access===identity&&!document.hidden&&!$('groupView').hidden)timer=setTimeout(refresh,10000);}}
 async function enter(result){remember({id:result.id,token:result.token});extensionKey='';await refresh();}
 async function busy(b,fn){b.disabled=true;try{await fn();}catch(e){status(e.message);}finally{b.disabled=false;if(room)render();}}
 function lobby(){clearTimeout(timer);room=null;access=null;joinCase=null;foundCode='';extensionKey='';try{localStorage.removeItem(storage);}catch{}history.replaceState(null,'',location.pathname+location.search);$('sessionJoin').disabled=true;$('sessionJoinLead').disabled=true;render();status('Choose a new case or enter an invitation code. Bookmark a private rejoin link before leaving a session.');}
 function hostCase(){const c=cases()[$('sessionCase').value];options($('sessionHostLead'),c);$('sessionCasePreview').textContent=c.claim+' '+c.boundary;}
 const code=()=>$('sessionJoinCode').value.replace(/\s/g,'').toUpperCase();
 async function findSession(){
  joinCase=null;foundCode='';$('sessionJoin').disabled=true;$('sessionJoinLead').disabled=true;
  const requestedCode=code();const data=await request('/lookup?code='+encodeURIComponent(requestedCode));if(code()!==requestedCode)throw Error('The code changed. Find the session again.');const c=cases()[data.caseId];if(!c)throw Error('This case requires the current app release. Refresh and try again.');
  $('sessionJoinPreview').textContent=c.title+' · '+data.activeCount+(data.activeCount===1?' friend joined.':' friends joined.')+' '+c.boundary;
  options($('sessionJoinLead'),c,data.leadOccupancy,c.leads.find(l=>!data.leadOccupancy[l.id])?.id);
  if(data.phase!=='investigating')throw Error('Comparison has already opened. Ask the host to create the next session.');if(data.activeCount>=6)throw Error('Six friends are already in this session.');
  joinCase=c;foundCode=code();$('sessionJoinLead').disabled=false;$('sessionJoin').disabled=false;status('Choose an uncovered lead, or read an existing lead from a different perspective.');
 }
 function initialize(){
  if(initialized||!window.WorldThreadsExplore||!window.WorldThreadsApp?.state.observations.length||!cases())return;initialized=true;
  for(const c of Object.values(cases())){const o=el('option',c.title);o.value=c.id;$('sessionCase').append(o);}
  $('sessionCase').value='CASE-FISHERIES';hostCase();$('sessionCase').onchange=hostCase;
  $('sessionCreate').onclick=()=>busy($('sessionCreate'),async()=>{status('Creating your session…');await enter(await request('',{caseId:$('sessionCase').value,alias:$('sessionHostAlias').value,leadId:$('sessionHostLead').value}));});
  $('sessionFind').onclick=()=>busy($('sessionFind'),findSession);
  $('sessionJoinCode').oninput=()=>{joinCase=null;foundCode='';$('sessionJoin').disabled=true;$('sessionJoinLead').disabled=true;$('sessionJoinPreview').textContent='Find this session to see its case and leads.';};
  $('sessionJoin').onclick=()=>busy($('sessionJoin'),async()=>{if(!joinCase||foundCode!==code())throw Error('Find the session before joining.');await enter(await request('/join',{code:code(),alias:$('sessionJoinAlias').value,leadId:$('sessionJoinLead').value}));});
  $('sessionLead').onchange=()=>sourceCard(lead($('sessionLead').value),$('sessionPassage'));
  $('sessionSave').onclick=()=>busy($('sessionSave'),async()=>{await request('/'+access.id+'/notes',{leadId:$('sessionLead').value,supports:$('sessionSupports').value,uncertain:$('sessionUncertain').value,nextEvidence:$('sessionNextEvidence').value});await refresh();status('Interpretation recorded for this group. It has not become a historical claim.');});
  $('sessionCompare').onclick=()=>busy($('sessionCompare'),async()=>{await request('/'+access.id+'/compare',{});await refresh();});
  $('sessionProceedConsent').onchange=render;
  $('sessionProceedButton').onclick=()=>busy($('sessionProceedButton'),async()=>{if(!$('sessionProceedConsent').checked)throw Error('Confirm proceeding with ready participants.');await request('/'+access.id+'/compare',{proceedWithReady:true});await refresh();});
  $('sessionSaveNext').onclick=()=>busy($('sessionSaveNext'),async()=>{await request('/'+access.id+'/next',{question:$('sessionNextQuestion').value});await refresh();status('Your next investigation is saved in the group board.');});
  $('sessionOpenExtension').onclick=()=>{$('sessionExtensionCards').hidden=false;$('sessionOpenExtension').hidden=true;status('New clues are open. Take one each and explain what changes your interpretation.');};
  $('sessionWithdraw').onclick=()=>busy($('sessionWithdraw'),async()=>{await request('/'+access.id+'/withdraw',{});await refresh();status('You withdrew from this round. Your friends can continue; your notes remain private.');});
  $('sessionCopyInvite').onclick=async()=>{try{await navigator.clipboard.writeText($('sessionInvite').value);status('Invitation copied. Send it yourself, or share the room code.');}catch{status('Copy the invitation field, or share the room code.');}};
  $('sessionRefresh').onclick=refresh;$('sessionLeave').onclick=lobby;$('sessionAnotherCase').onclick=lobby;
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else if(access&&!$('groupView').hidden)refresh();});
  document.querySelectorAll('[data-view="group"]').forEach(b=>b.addEventListener('click',()=>{if(access)refresh();}));
  const joining=location.hash.match(/^#join=([A-Z2-9]{8})$/),saved=location.hash.match(/^#session=([a-f0-9]{32})\.([a-f0-9]{64})$/);
  if(joining){$('sessionJoinCode').value=joining[1];WorldThreadsExplore.show('group');findSession().catch(e=>status(e.message));}
  else{if(saved)access={id:saved[1],token:saved[2]};else try{access=JSON.parse(localStorage.getItem(storage)||'null');}catch{}if(access){WorldThreadsExplore.show('group');refresh();}}
 }
 window.addEventListener('worldthreads-ready',initialize);initialize();
})();
