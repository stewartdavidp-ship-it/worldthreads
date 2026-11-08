function hideJourneyHeader() {
 document.getElementById('journeyHeader')?.setAttribute('hidden','');
 document.body.classList.remove('focused-story');
 const panel = document.getElementById('journeyPanel');
 if (panel?.open) panel.close();
}
// Presentation only: scene position is separate from earned case requirements.
function syncJourneyHeader() {
 const header = document.querySelector('.site-header');
 let bar = document.getElementById('journeyHeader');
 if (!bar) {
  bar = document.createElement('div');
  bar.id = 'journeyHeader';
  bar.className = 'journey-header';
  header.append(bar);
 }
 let panel = document.getElementById('journeyPanel');
 if (!panel) {
  panel = document.createElement('dialog');
  panel.id = 'journeyPanel';
  panel.className = 'journey-panel';
  panel.setAttribute('aria-labelledby', 'journeyPanelTitle');
  panel.innerHTML = '<div class="journey-panel-heading"><h2 id="journeyPanelTitle">Your journey</h2><button type="button" data-close-journey aria-label="Close your journey">×</button></div><div id="journeyCurrent"></div><div id="journeyRequirements"></div><div id="journeyJournal"></div>';
  document.body.append(panel);
  panel.querySelector('[data-close-journey]').addEventListener('click', () => panel.close());
  panel.addEventListener('click', event => {
   if (event.target.closest('[data-story-home]')) document.getElementById('storyMode').click();
  });
  panel.addEventListener('close', () => document.querySelector('[data-open-journey]')?.setAttribute('aria-expanded', 'false'));
 }
 const journey = document.getElementById('storyJourney');
 const active = story.id && !journey.hidden && journey.querySelector('.story-scene') && !learningPathOpen && !quotlePracticeOpen && !harvestAIActive;
 const config = active ? storyCatalog.find(s => s.id === story.id) : null;
 const chapters = config ? config.chapters || storyChapters : [];
 const progress = document.getElementById('investigationProgress');
 document.getElementById('journeyJournal').append(progress);
 const current = document.getElementById('journeyCurrent');
 const requirements = document.getElementById('journeyRequirements');
 if (config) {
  const readiness = document.getElementById('storyCaseReadiness');
  const method = journey.querySelector('.story-method');
  if (readiness && !requirements.contains(readiness)) {
   requirements.replaceChildren(readiness);
   if (method) requirements.append(method);
  }
  const back = journey.querySelector(':scope > [data-story-home]');
  if (back) back.remove();
  journey.querySelector(':scope > .story-progress')?.remove();
  header.append(bar);
  const chapter = chapters[story.step];
  current.innerHTML = `<p class="eyebrow">Current investigation</p><h3>${escapeHtml(config.short)}</h3><p>Scene ${story.step + 1} of ${chapters.length} · ${escapeHtml(chapter.label)}</p>${chapters[story.step + 1] ? `<p><strong>Next in the story:</strong> ${escapeHtml(chapters[story.step + 1].title)}</p>` : '<p>The last scene is open. Your case and further research have their own requirements below.</p>'}<p class="media-note">The bar shows your place in the story. Case requirements below track recorded activities, not verified findings.</p><button type="button" class="story-link" data-story-home>← Choose another story</button>`;
  bar.innerHTML = `<div class="journey-location"><span>${escapeHtml(config.short)}</span><strong>Scene ${story.step + 1} of ${chapters.length}</strong></div><progress max="${chapters.length}" value="${story.step + 1}" aria-label="Position in this story: scene ${story.step + 1} of ${chapters.length}"></progress><button type="button" data-open-journey aria-haspopup="dialog" aria-controls="journeyPanel" aria-expanded="${panel.open}">Your journey <span aria-hidden="true">⌄</span></button>`;
 } else {
  header.querySelector('nav').append(bar);
  requirements.replaceChildren();
  current.replaceChildren();
  bar.innerHTML = '<span class="journey-saved">Your investigations</span><button type="button" data-open-journey aria-haspopup="dialog" aria-controls="journeyPanel" aria-expanded="false">Your journey <span aria-hidden="true">⌄</span></button>';
 }
 bar.hidden = learningPathOpen || quotlePracticeOpen || harvestAIActive || Boolean(journey.querySelector('.story-1816'));
 document.body.classList.toggle('focused-story', Boolean(config));
 journey.style.scrollMarginTop = (header.getBoundingClientRect().height + 24) + 'px';
 if (!progressStored) bar.querySelector('[data-open-journey]').textContent = 'Your journey · Not saved';
 bar.querySelector('[data-open-journey]').addEventListener('click', () => {
  progress.hidden = false;
  panel.showModal();
  bar.querySelector('[data-open-journey]').setAttribute('aria-expanded', 'true');
 });
}
// Close before a destination action opens its own inspector or changes the scene.
document.addEventListener('click', event => {
 const action = event.target.closest('[data-check-source],[data-check-connection],[data-check-case],[data-story-home],.story-method button');
 const panel = document.getElementById('journeyPanel');
 if (action && panel?.contains(action) && panel.open) panel.close();
}, true);
