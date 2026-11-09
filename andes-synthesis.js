const andesSynthesisSources = [
 {id: 'WT-1816-0060', label: 'Workshop account', source: 'SRC-035, later heritage account'},
 {id: 'WT-1816-0030', label: 'Campaign chronology and dispatch', source: 'SRC-021, SRC-053, SRC-054'},
 {id: 'WT-1816-0083', label: 'Printed dispatch image and related report', source: 'SRC-056, Bertling’s 1908 edition, documents 18–19'},
 {id: 'WT-1816-0082', label: 'Report of captured food', source: 'SRC-054 and SRC-055, editions of the same dispatch'}
];
const andesSynthesisImage = 'assets/sources/bertling-1908-p21.png';

const andesReviewKey = 'worldthreads-andes-synthesis-review-v1';

function readAndesReview() {
 try {
  return JSON.parse(localStorage.getItem(andesReviewKey)) || {};
 } catch {
  return {};
 }
}

function andesSynthesisPrompt() {
 const records = andesSynthesisSources.map(({id, label, source}) => {
  const record = obs(id);
  return [
   id + ' | ' + label,
   'Source: ' + source,
   'Recorded date or interval: ' + record.startDate + ' to ' + record.endDate,
   'Record summary: ' + record.observation,
   'Limits: ' + record.uncertainty,
   'Source locator: ' + record.sourceLocator
  ].join('\n');
 });
 return [
  'Research question: Can these records trace supplies from Mendoza to Las Heras’s troops during the crossing?',
  'If the image is attached, read the relevant passage and dateline on printed p. 21, document 18. Identify what you can see directly and flag uncertain readings. If the image is missing or unreadable, say so and use the supplied record summary.',
  'Build a compact comparison table with one row per distinct historical report or observation. Include the record ID, date and what it dates, reporter or institution, unit or recipient, item, reported action, and what can be checked. Separate plan, output, capture and reported receipt. Label unknown fields.',
  'Use the table to compare what the sources jointly establish with what would need matching records. Check whether the dates, people, items and units actually line up. If two editions reproduce the same report, count them as one account. Show any arithmetic with its units and explain its limits.',
  'Give one supported synthesis and one tempting but unsupported link, citing the record IDs for both. Name a specific missing document and the fields it would need to connect the relevant events. Do not invent a reading, source, route, delivery or explanation for a gap.',
  ...records
 ].join('\n\n');
}

function andesSynthesisHtml() {
 const review = readAndesReview();
 return `<details class="andes-synthesis">
  <summary>Combine an image, a chronology and accounts with AI</summary>
  <h3>Can we trace supplies to the troops?</h3>
  <p>Ask AI to organize the sources by date, reporter, unit, item and action. Then verify the connections it finds against the evidence.</p>
  <div class="andes-synthesis-sources">
   <figure>
    <a href="${andesSynthesisImage}" target="_blank" rel="noopener"><img loading="lazy" src="${andesSynthesisImage}" alt="Printed page 21 of Bertling’s 1908 edition, including O’Higgins’s 6 February report in document 18."></a>
    <figcaption>Printed edition of a report attributed to O’Higgins · Biblioteca Nacional de Chile / Memoria Chilena.</figcaption>
    <a href="${andesSynthesisImage}" download>Download full page for your AI assistant</a>
   </figure>
   <div>
    <h4>Compare these records</h4>
    <ul>${andesSynthesisSources.map(({id, label}) => `<li><button type="button" class="story-link" data-story-evidence="${id}">${label} ↗</button><small>${id}</small></li>`).join('')}</ul>
   </div>
  </div>
  <h4>Run the comparison</h4>
  <p>Compare the records yourself, or paste the prompt into your AI assistant and attach the page image if it accepts images. Save the connections you can support.</p>
  <button type="button" class="story-back" data-copy-andes-synthesis>Copy source comparison prompt</button>
  <p class="media-note" role="status"></p>
  <details><summary>Read or copy the full prompt</summary>
   <textarea readonly rows="9" aria-label="Source comparison prompt">${escapeHtml(andesSynthesisPrompt())}</textarea>
  </details>
  <details class="andes-synthesis-return" ${review.reply || review.notes ? 'open' : ''}>
   <summary>Record your source check</summary>
   <p>Write which connections hold up and what remains uncertain. If you used AI, you can also save its reply.</p>
   <label for="andes-synthesis-notes">Evidence check notes</label>
   <textarea id="andes-synthesis-notes" rows="4" maxlength="8000">${escapeHtml(review.notes || '')}</textarea>
   <label for="andes-synthesis-reply">AI reply (optional)</label>
   <textarea id="andes-synthesis-reply" rows="7" maxlength="24000">${escapeHtml(review.reply || '')}</textarea>
   <button type="button" class="story-back" data-save-andes-review>Save my review</button>
   <p class="media-note" data-andes-review-status role="status">${review.reply || review.notes ? 'Saved in this browser.' : ''}</p>
  </details>
  <details class="andes-synthesis-check"><summary>Check the AI’s synthesis against the records</summary>
   <h4>Compare the records across four dimensions</h4>
   <dl>
    <dt>Action</dt><dd>Mendoza’s workforce estimate describes production capacity. Las Heras’s 1 February dispatch describes an intended march and provisioning. His 8 February report describes food captured. A matched issue and receipt would be needed to trace a delivery.</dd>
    <dt>Reporter and item</dt><dd>O’Higgins’s separate reports pair a transport shortfall with troops moving on foot. They concern mules in his division. Las Heras’s reports concern his own troops and food.</dd>
    <dt>Number and unit</dt><dd>Check the printed image for 130 mules sent and 124 received, as reported by O’Higgins. The difference is six mules. Their fate is unknown. The separate transfer of “400 y tantas” is a different count.</dd>
    <dt>Missing connection</dt><dd>Look for a dated issue record and receipt identifying the same item, quantity, unit and recipient. That would test a link from dispatch or capture to delivery.</dd>
   </dl>
   <p><strong>What emerges across the sources?</strong> The army’s preparations, transport shortfalls and attempts to provision troops appear in different records. The comparison shows where those accounts complement each other and where a proposed supply chain still lacks evidence.</p>
  </details>
 </details>`;
}

document.addEventListener('click', async event => {
 const button = event.target.closest('[data-copy-andes-synthesis]');
 if (!button) return;
 const exercise = button.closest('.andes-synthesis');
 const status = exercise.querySelector('[role="status"]');
 try {
  await navigator.clipboard.writeText(andesSynthesisPrompt());
  status.textContent = 'Prompt copied. Add the printed page image in your assistant if supported.';
 } catch {
  const field = exercise.querySelector('[aria-label="Source comparison prompt"]');
  field.closest('details').open = true;
  field.focus();
  field.select();
  status.textContent = 'The prompt is selected for manual copying.';
 }
});

document.addEventListener('click', event => {
 const button = event.target.closest('[data-save-andes-review]');
 if (!button) return;
 const panel = button.closest('.andes-synthesis-return');
 const reply = panel.querySelector('#andes-synthesis-reply');
 const notes = panel.querySelector('#andes-synthesis-notes');
 const status = panel.querySelector('[data-andes-review-status]');
 if (!reply.value.trim() && !notes.value.trim()) {
  status.textContent = 'Add evidence notes or an AI reply before saving.';
  notes.focus();
  return;
 }
 try {
  localStorage.setItem(andesReviewKey, JSON.stringify({reply: reply.value, notes: notes.value}));
  status.textContent = 'Saved in this browser.';
 } catch {
  status.textContent = 'The browser could not save this review. Copy your work before leaving.';
 }
});
