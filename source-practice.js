// The learner's own reasoning is saved alongside the investigation.
const sourcePracticeFields = ['first', 'revision', 'transfer'];

function restoreSourcePractice(saved) {
 if (!saved || typeof saved !== 'object') return;
 const practice = harvestAI.sourcePractice;
 for (const field of sourcePracticeFields) {
  if (typeof saved[field] === 'string') practice[field] = saved[field].slice(0, 2000);
 }
 while (practice.stage < 3 && practice.stage < saved.stage &&
        practice[sourcePracticeFields[practice.stage]].trim()) {
  practice.stage++;
 }
}

function sourcePracticeHtml() {
 const practice = harvestAI.sourcePractice;
 const stages = [
  {
   scenario: 'Two blogs report that a school garden doubled its harvest. Neither tells you where its number came from.',
   question: 'What would you check before trusting the number? Explain why.',
   action: 'Save my first reasoning and reveal the source trail'
  },
  {
   scenario: 'Both blogs copied the same school newsletter. The newsletter gives no harvest weights or comparison dates. You have one underlying report. To check the claim, look for dated measurements or an independently gathered record.',
   question: 'What would you change about your first answer? If you would keep it, explain why.',
   action: 'Save my revision and try a new example'
  },
  {
   scenario: 'A museum label, a city brochure and a podcast say a bridge opened in 1906.',
   question: 'How would you decide how much confidence to put in that date? Explain your next move.',
   action: 'Save my answer and compare my reasoning'
  }
 ];
 const comparison = practice.stage === 3
  ? '<p>Check your new answer. Did you ask where each account got its date and look for a dated opening record or independently gathered evidence?</p>' +
    sourcePracticeFields.map((field, i) => `<h3>${['First reasoning','After checking the source trail','New example'][i]}</h3><p>${escapeHtml(practice[field])}</p>`).join('') +
    '<p>If your plan still relies on agreement alone, trace each account back to its source. If you already did that, practise finding an independent record that could change your mind.</p>' + harvestThesisActionHtml()
  : '';
 const stage = stages[practice.stage];
 const field = sourcePracticeFields[practice.stage];
 return `<details id="sourcePractice" ${practice.stage > 0 ? 'open' : ''}>
  <summary class="story-next">Practise checking independent sources · ${practice.stage}/3 saved</summary>
  <p class="hai-note">Hypothetical examples. Your answers save with this investigation in this browser.</p>
  ${stage ? `<p>${stage.scenario}</p>
   ${practice.stage === 1 ? `<p><strong>Your first reasoning:</strong> ${escapeHtml(practice.first)}</p>` : ''}
   <label class="hai-field">${stage.question}<textarea rows="2" maxlength="2000" data-source-practice-field>${escapeHtml(practice[field])}</textarea></label>
   <button type="button" class="story-back" data-source-practice-save ${practice[field].trim() ? '' : 'disabled'}>${stage.action}</button>` : comparison}
 </details>`;
}

document.addEventListener('input', event => {
 if (!event.target.matches('[data-source-practice-field]')) return;
 const practice = harvestAI.sourcePractice;
 const field = sourcePracticeFields[practice.stage];
 if (!field) return;
 practice[field] = event.target.value.slice(0, 2000);
 saveHarvestAI();
 document.querySelector('[data-source-practice-save]').disabled = !practice[field].trim();
 if (harvestAIWarning) document.querySelector('.hai-save').textContent = harvestAIWarning;
});

document.addEventListener('click', event => {
 if (!event.target.closest('[data-source-practice-save]')) return;
 const practice = harvestAI.sourcePractice;
 if (!practice[sourcePracticeFields[practice.stage]]?.trim()) return;
 practice.stage++;
 saveHarvestAI();
 renderHarvestAI(false);
 document.querySelector('#sourcePractice summary').focus();
});
