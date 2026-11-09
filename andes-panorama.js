// This landscape links story scenes. Its terrain and positions are illustrative.
function andesPanorama(step, record) {
 const date = (value, options) => new Intl.DateTimeFormat('en-GB', {
  ...options, timeZone: 'UTC'
 }).format(new Date(value + 'T00:00:00Z'));
 const month = {month: 'short'};
 const measure = [
  () => ['≈' + record.value, 'workers · later heritage estimate'],
  () => [date(record.startDate, month) + '–' + date(record.endDate, {...month, year: 'numeric'}), 'command and training'],
  () => [date(record.startDate, month) + '–' + date(record.endDate, {...month, year: 'numeric'}), 'several columns'],
  () => [date(record.startDate, {day: 'numeric', ...month, year: 'numeric'}), 'battle date']
 ][step]();
 const stops = ['Mendoza workshops', 'El Plumerillo', 'The mountain passes', 'Chacabuco'];
 const positions = [[16, 75], [37, 65], [61, 39], [84, 72]];
 const next = step + 1;
 const [x, y] = positions[step];
 const sequence = positions.slice(0, step + 1).map(([left, top]) => `${left * 9.6},${top * 4.1}`).join(' ');
 return `<figure class="andes-panorama" data-panorama-step="${step}" aria-label="Illustrated Andes story journey">
 <div class="andes-panorama-art">
  <div class="andes-camera">
  <svg viewBox="0 0 960 410" preserveAspectRatio="xMidYMid slice" aria-hidden="true" class="andes-landscape">
   <defs>
    <linearGradient id="andes-sky" x2="0" y2="1"><stop stop-color="#0a182c"/><stop offset=".64" stop-color="#6c6578"/><stop offset="1" stop-color="#e4a777"/></linearGradient>
    <linearGradient id="andes-earth" x2=".35" y2="1"><stop stop-color="#735764"/><stop offset="1" stop-color="#141f30"/></linearGradient>
    <radialGradient id="andes-dawn"><stop stop-color="#ffd69c" stop-opacity=".65"/><stop offset="1" stop-color="#f4ae81" stop-opacity="0"/></radialGradient>
    <pattern id="andes-lines" width="70" height="38" patternUnits="userSpaceOnUse"><path d="M-12 35Q22 15 70 19M10 44Q48 25 83 29" fill="none" stroke="#f5c3a5" stroke-opacity=".14"/></pattern>
   </defs>
   <path fill="url(#andes-sky)" d="M0 0h960v410H0z"/>
   <ellipse cx="190" cy="220" rx="340" ry="195" fill="url(#andes-dawn)"/>
   <circle cx="175" cy="165" r="31" fill="#ffdbab" opacity=".8"/>
   <path fill="#605770" d="M0 275 105 191 150 215 254 142 326 200 431 105 489 157 553 91 663 177 755 121 840 190 960 140V410H0Z"/>
   <path fill="#35425c" d="M0 320 123 254 212 269 308 200 384 229 462 118 515 164 583 53 629 112 651 107 747 231 823 207 901 257 960 231V410H0Z"/>
   <path fill="#b7bac9" d="m462 118 53 46-25-9-10 13-18-22-21 6Zm121-65 46 59 22-5 40 51-38-26-21 11-21-27-14 8-15-39-29 24-11 25-27 30Z"/>
   <path fill="#26384f" d="m583 53 46 59 22-5 96 124-66-32-45-25-39-50-15-39Z" opacity=".66"/>
   <path fill="none" stroke="#e9c9c5" stroke-opacity=".23" stroke-width="1.5" d="m462 149-45 92 36-29 26-38m76-60-42 106 46-45 25-64m31 13 57 96 51 27m-412-31-57 68m505-45 71 44"/>
   <path fill="url(#andes-earth)" d="M0 317Q94 280 204 319T371 299Q449 267 520 281T701 279Q800 259 960 301V410H0Z"/>
   <path fill="url(#andes-lines)" d="M0 317Q94 280 204 319T371 299Q449 267 520 281T701 279Q800 259 960 301V410H0Z"/>
   <path fill="#101b29" d="M0 366Q124 341 260 371T541 366Q772 343 960 371V410H0Z"/>
   <g fill="#253142" stroke="#f1ba8b" stroke-width="1.6" stroke-linejoin="round">
    <path d="M91 323v-26l22-15 22 15v26Zm44 0v-34l24-17 24 17v34Zm29-45v-16h8v21M104 323v-12h11v12m38-17h10m-5-5v10"/>
    <path d="m297 299 20-22 22 22Zm29-5 24-27 24 27Zm32 5 19-22 20 22Z"/>
    <path d="M827 319v-35m0 0 24 7-24 8m-22 20v-21m-20 21v-15"/>
   </g>
   <polyline points="${sequence}" fill="none" stroke="#ffe0b2" stroke-opacity=".75" stroke-width="2" stroke-dasharray="2 7" stroke-linecap="round"/>
  </svg>
  ${step === 2
   ? `<button type="button" class="andes-panorama-marker" style="--stop-x:${x}%;--stop-y:${y}%" data-panorama-dispatch aria-label="Open the 7 p.m. field report">3</button>`
   : `<span class="andes-panorama-marker" style="--stop-x:${x}%;--stop-y:${y}%" aria-hidden="true">${step + 1}</span>`}
  </div>
  <span class="andes-panorama-kicker">The Andes expedition · 1816–1817</span>
  <button type="button" class="andes-panorama-evidence" data-story-evidence="${escapeAttr(record.id)}">
   <span class="andes-panorama-evidence-label">Historical record ↗</span>
   <strong>${escapeHtml(measure[0])}</strong>
   <span>${escapeHtml(measure[1])}</span>
  </button>
  <div class="andes-panorama-location"><span>Scene ${step + 1} of 4</span><strong>${stops[step]}</strong></div>
 </div>
 <figcaption>
  <p>Terrain is schematic. The dotted line connects story scenes.</p>
  <ol class="andes-panorama-stops" aria-label="Andes story scenes">
   ${stops.map((label, index) => {
    const visited = storyProgress('andes').visited.includes(index);
    const current = index === step;
    return `<li><button type="button" data-story-step="${index}" ${current ? 'aria-current="step" aria-disabled="true"' : ''} ${!current && !visited && index !== next ? 'disabled' : ''}><span>${index + 1}</span>${label}${index === next ? '<small>Next →</small>' : ''}</button></li>`;
   }).join('')}
  </ol>
  ${step === 2 ? '<button type="button" class="story-back" data-panorama-dispatch>Open the 7 p.m. field report ↓</button>' : ''}
 </figcaption>
 </figure>`;
}

function animateAndesPanorama(panorama, previousStep, step) {
 const camera = panorama.querySelector('.andes-camera');
 const views = [
  'translateX(7%) scale(1.16)',
  'translateX(10%) scale(1.24)',
  'translateX(-15%) scale(1.42)',
  'translateX(-11%) scale(1.24)'
 ];
 camera.style.transform = views[step];
 if (previousStep === step || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 camera.animate([
  {transform: views[previousStep] || 'scale(1.02)'},
  {transform: views[step]}
 ], {duration: 1050, easing: 'cubic-bezier(.2,.7,.3,1)'});
}
