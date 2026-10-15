// Editorial prompts, not answers or additional historical claims.
const threadStartingQuestions={
 'THREAD-GULF-MAINE':'Did a food crisis change how Gulf of Maine fishers made a living after 1816? Which links can the records support?',
 'THREAD-CENTRAL-EUROPE-FOOD':'How far can bad weather explain the Czech food crisis of 1816–1817?',
 'THREAD-ALPINE-HYDRO':'Why did the Rhine and Lake Constance flood in 1817: stored snow, fresh snowfall, heavy rain, or a combination?',
 'THREAD-CLIMATE-CULTURE':'Did the bad summer help spark Frankenstein? What do surviving drafts and Shelley’s later recollection actually tell us?',
 'THREAD-CHINA-CLIMATE':'Was 1816 the same kind of bad year across China? Where do records of cold and rainfall agree or differ?',
 'THREAD-SUMBAWA':'After Tambora, what help reached people on Sumbawa, and what do the records leave unknown?',
 'THREAD-MONSOON':'Did the monsoon rains change after Tambora? How much can a regional reconstruction tell us about local consequences?',
 'THREAD-APPIN':'Whose story of Appin do the official records tell, and whose experiences are missing?',
 'THREAD-ANDES':'What made crossing the Andes possible in 1817, and how much can the 1816 preparations explain?',
 'THREAD-DUTCH-RELIEF':'Relief was ordered. Did food reach poorer Dutch households in time?',
 'THREAD-SWISS-VULNERABILITY':'How far did crop damage explain hunger in Switzerland, and what else would we need to investigate?',
 'THREAD-EUROPE-ATTRIBUTION':'Was Tambora responsible for both the cold and the rain? What do the European simulations actually test?',
 'THREAD-VIRGINIA-CROPS':'What did observers in Virginia know about the 1816 harvest, and what were they still predicting?',
 'THREAD-KOREA-RECOVERY':'Did reports of recovering rice harvests mean Korean households had enough to eat in 1816?',
 'THREAD-BENGAL-CHOLERA':'What can explain the Bengal epidemic, and what evidence would be needed before linking it to environmental change?',
 'THREAD-BALI-RECOVERY':'How did people on Bali fare after the ashfall? What can the records connect to the later food and health crisis?',
 'THREAD-IRISH-FEVER':'When scarcity and fever struck, whom did relief reach in Ireland?',
 'THREAD-BRAZIL-PATRONAGE':'Did royal backing mean the Brazilian arts project was teaching in 1816? What would show instruction actually taking place?',
 'THREAD-HAWKESBURY-FLOOD':'How much grain was lost in the Hawkesbury flood, and how much was only reported at risk?',
 'THREAD-PACIFIC-NETWORKS':'What changed when Pacific routes carried food and diplomatic objects, and whose perspectives are missing?',
 'THREAD-ASANTE-EXCHANGE':'Why did routes and prestige goods matter in Asante diplomacy, and how could the envoy’s explanation be checked?',
 'THREAD-MADAGASCAR-DIPLOMACY':'Did diplomatic promises and anti-slave-trade laws change what happened in Madagascar? What would evidence of enforcement show?',
 'THREAD-OCEAN-CONTRASTS':'Did every ocean cool alike after Tambora? What can different kinds of evidence really tell us?'
};
function investigationStarter(draft){
 const object=historicalObject(draft.objectId),thread=state.threads.find(t=>t.id===draft.threadId);
 if(!object&&!thread)return null;
 return {question:object?'What can the linked records establish about '+object.label+', and what would you need to investigate its influences?':threadStartingQuestions[thread.id],records:(object?.observationIds||thread.nodeIds).map(obs).filter(Boolean)};
}
function questionStarterHtml(draft,overview=false){
 const starter=investigationStarter(draft);if(!starter?.question||overview&&String(draft.question||'').trim())return '';
 const content=`<div class="question-starter"><p class="eyebrow">Suggested starting question</p><p class="starter-question">${escapeHtml(starter.question)}</p><button type="button" class="story-back" data-use-starting-question>${draft.question?.trim()?'Compare with my question':'Use and edit this question'} →</button><details class="starter-records"><summary>Inspect the ${starter.records.length} starting records</summary><p class="media-note">Check what each source can establish before proposing a connection. These records may differ in date, coverage or source type.</p>${starter.records.map(record=>`<button type="button" class="focus-record" data-story-evidence="${escapeAttr(record.id)}"><strong>${escapeHtml(record.title)}</strong><span>${escapeHtml(record.place)} · ${escapeHtml(record.startDate)}${record.endDate&&record.endDate!==record.startDate?' → '+escapeHtml(record.endDate):''}</span></button>`).join('')}</details><small>A starting point to question, narrow or rewrite.</small></div>`;
 return overview?content:`<details class="question-starter-help"><summary>Need a starting question?</summary>${content}</details>`;
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-use-starting-question]');if(!button)return;
 const form=document.getElementById('thesisForm'),draft=readThesisDraft(),starter=investigationStarter(draft);if(!form||!starter?.question)return;
 const field=form.elements.question,hasQuestion=!!field.value.trim();
 if(!hasQuestion){field.value=starter.question;saveThesisDraft({target:form,preventDefault(){}});}
 const target=document.getElementById('thesisTopic');revealThesisTarget(target,true);
 if(hasQuestion)target.querySelector('.question-starter-help').open=true;
 field.focus();field.scrollIntoView({block:'center',behavior:'instant'});
});
