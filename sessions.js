/* Account-free cooperative case sessions. Room interpretations never publish graph claims. */
(function(){
 const API='https://worldthreads-community.stewartd.workers.dev',storage='worldthreads-group-session-v1';
 const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
 let access=null,room=null,timer=null,initialized=false;
 const lead=id=>WorldThreadsInvestigation.leads.find(l=>l.id===id);
 async function request(path,body){const response=await fetch(API+'/api/rooms'+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(access?{Authorization:'Bearer '+access.token}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not connect to the session. Your notes remain in the form.');return data;}
 function status(message){$('sessionStatus').textContent=message;}
 function button(text,action){const b=el('button',text,'nav-btn');b.type='button';b.onclick=action;return b;}
 function remember(value){access=value;try{localStorage.setItem(storage,JSON.stringify(value));}catch{}const url=new URL(location.href);url.hash='session='+value.id+'.'+value.token;history.replaceState(null,'',url);}
 function source(id,root){root.replaceChildren();const l=lead(id);if(!l)return;root.append(el('h4',l.title),el('p',l.date),el('blockquote',l.quote),el('p',l.locator),el('p','Limit: '+l.limits));const link=el('a','Read the full source ↗');link.href=WorldThreadsInvestigation.sourceUrl;link.target='_blank';link.rel='noopener noreferrer';root.append(link);}
 function render(){
  $('sessionLobby').hidden=!!room;$('sessionBoard').hidden=!room;if(!room)return;
  $('sessionCode').textContent=room.code;const invite=new URL(location.href);invite.hash='join='+room.code;$('sessionInvite').value=invite.href;
  $('sessionPhase').textContent=room.phase==='compare'?'Comparison is open':'Investigate separately, then compare';
  const members=$('sessionMembers');members.replaceChildren();for(const m of room.members){const row=el('li',m.alias+(m.isHost?' · host':'')+' · '+lead(m.leadId).title+' · '+(m.ready?'interpretation recorded':'investigating'));members.append(row);}
  const me=room.members.find(m=>m.id===room.you);$('sessionYourName').textContent='Your investigation · '+me.alias;
  if($('sessionLead').dataset.member!==me.id){$('sessionLead').value=me.leadId;$('sessionLead').dataset.member=me.id;for(const [field,key]of [['sessionSupports','supports'],['sessionUncertain','uncertain'],['sessionNextEvidence','nextEvidence'],['sessionNextQuestion','followUp']])$(field).value=me.notes?.[key]||'';source(me.leadId,$('sessionPassage'));}
  $('sessionCompare').hidden=!room.isHost||room.phase==='compare';$('sessionCompare').disabled=room.members.length<2||room.members.some(m=>!m.ready);
  $('sessionWaiting').hidden=room.phase==='compare';$('sessionComparison').hidden=room.phase!=='compare';
  $('sessionWaiting').textContent=me.ready?'Your interpretation is recorded. Others cannot read it until the host opens comparison.':'Choose a lead, inspect the passage and record your interpretation. Peer notes stay hidden until comparison opens.';
  if(room.phase==='compare'){
   const board=$('sessionEvidenceBoard');board.replaceChildren();for(const m of room.members){const card=el('article',undefined,'session-evidence-card');card.append(el('h4',m.alias+' · '+lead(m.leadId).title));const excerpt=el('div');source(m.leadId,excerpt);card.append(excerpt);for(const [key,label]of [['supports','What this supports'],['uncertain','What remains uncertain'],['nextEvidence','Next discriminating evidence'],['followUp','Next investigation']])if(m.notes?.[key])card.append(el('strong',label),el('p',m.notes[key]));board.append(card);}
   const next=$('sessionNextSteps');next.replaceChildren();for(const [question,id]of [['Did the ghost-story challenge precede the idea?','challenge'],['Did scientific conversations shape the story’s subject?','science'],['When did drafting continue after the weather improved?','serene']])next.append(button(question,()=>{$('sessionNextQuestion').value=question;source(id,$('sessionNextLead'));}));
  }
 }
 async function refresh(){if(!access)return;try{room=await request('/'+access.id);render();status('Session connected. Shared work refreshes every 10 seconds while this page is open.');}catch(e){status(e.message);}finally{clearTimeout(timer);if(!document.hidden&&!$('groupView').hidden)timer=setTimeout(refresh,10000);}}
 async function enter(result){remember({id:result.id,token:result.token});await refresh();}
 async function busy(b,fn){b.disabled=true;try{await fn();}catch(e){status(e.message);}finally{b.disabled=false;}}
 function initialize(){if(initialized||!window.WorldThreadsExplore||!window.WorldThreadsApp?.state.observations.length)return;initialized=true;
  for(const id of ['sessionHostLead','sessionJoinLead','sessionLead'])for(const l of WorldThreadsInvestigation.leads){const option=el('option',l.title);option.value=l.id;$(id).append(option);} $('sessionJoinLead').value='challenge';
  $('sessionCreate').onclick=()=>busy($('sessionCreate'),async()=>{status('Creating your session…');await enter(await request('',{alias:$('sessionHostAlias').value,leadId:$('sessionHostLead').value}));});
  $('sessionJoin').onclick=()=>busy($('sessionJoin'),async()=>{await enter(await request('/join',{code:$('sessionJoinCode').value.replace(/\s/g,'').toUpperCase(),alias:$('sessionJoinAlias').value,leadId:$('sessionJoinLead').value}));});
  $('sessionLead').onchange=()=>source($('sessionLead').value,$('sessionPassage'));
  $('sessionSave').onclick=()=>busy($('sessionSave'),async()=>{await request('/'+access.id+'/notes',{leadId:$('sessionLead').value,supports:$('sessionSupports').value,uncertain:$('sessionUncertain').value,nextEvidence:$('sessionNextEvidence').value});await refresh();status('Interpretation recorded for this group. It has not been published as a historical claim.');});
  $('sessionCompare').onclick=()=>busy($('sessionCompare'),async()=>{await request('/'+access.id+'/compare',{});await refresh();});
  $('sessionSaveNext').onclick=()=>busy($('sessionSaveNext'),async()=>{await request('/'+access.id+'/next',{question:$('sessionNextQuestion').value});await refresh();status('Your next investigation is saved in the group board.');});
  $('sessionCopyInvite').onclick=async()=>{try{await navigator.clipboard.writeText($('sessionInvite').value);status('Invitation copied. Send it yourself, or share the room code.');}catch{status('Copy the invitation link from the field, or share the room code.');}};
  $('sessionRefresh').onclick=refresh;
  $('sessionLeave').onclick=()=>{clearTimeout(timer);room=null;access=null;try{localStorage.removeItem(storage);}catch{}history.replaceState(null,'',location.pathname+location.search);render();status('You left this browser’s session view. Keep your private rejoin link to return.');};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearTimeout(timer);else if(access&&!$('groupView').hidden)refresh();});
  document.querySelectorAll('[data-view="group"]').forEach(b=>b.addEventListener('click',()=>{if(access)refresh();}));
  const joining=location.hash.match(/^#join=([A-Z2-9]{8})$/),saved=location.hash.match(/^#session=([a-f0-9]{32})\.([a-f0-9]{64})$/);
  if(joining){$('sessionJoinCode').value=joining[1];WorldThreadsExplore.show('group');status('Choose a nickname and a lead to join this group.');}
  else{if(saved)access={id:saved[1],token:saved[2]};else try{access=JSON.parse(localStorage.getItem(storage)||'null');}catch{}if(access){WorldThreadsExplore.show('group');refresh();}}
 }
 window.addEventListener('worldthreads-ready',initialize);initialize();
})();
