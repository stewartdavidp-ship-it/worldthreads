// Original vector explanatory artwork. Geometry and particle counts are illustrative, not measured.
function eruptionScene(){
 const haze=Array.from({length:70},(_,i)=>{const x=290+(i*83%550),y=100+(i*37%64)+Math.sin(i)*9;return `<circle cx="${x}" cy="${y}" r="${1.1+i%4*.65}" opacity="${.2+(i%5)*.12}"/>`;}).join('');
 return `<div class="eruption-scene"><div class="eruption-scene-note"><span class="eruption-scene-rule"></span>Atmospheric mechanism <span>Conceptual · not to scale</span></div><svg viewBox="0 0 960 500" role="img" aria-label="Conceptual atmospheric cutaway: a volcanic plume rises above layered terrain, gases form an aerosol veil, and some incoming sunlight is scattered back to space. Not an 1815 reconstruction."><defs>
 <linearGradient id="er-sky" x2=".2" y2="1"><stop stop-color="#08141f"/><stop offset=".6" stop-color="#153444"/><stop offset="1" stop-color="#497179"/></linearGradient>
 <linearGradient id="er-space" x2="0" y2="1"><stop stop-color="#0a1821"/><stop offset="1" stop-color="#10242e"/></linearGradient>
 <linearGradient id="er-rock" x1="0" x2="1" y2=".8"><stop stop-color="#b9a78e"/><stop offset=".42" stop-color="#786a60"/><stop offset="1" stop-color="#293d40"/></linearGradient>
 <linearGradient id="er-face" x2=".8" y2="1"><stop stop-color="#9a8872"/><stop offset="1" stop-color="#263b3d"/></linearGradient>
 <linearGradient id="er-plume" x1="0" x2=".7" y2="1"><stop stop-color="#dedbd2" stop-opacity=".8"/><stop offset=".6" stop-color="#b0b8b5" stop-opacity=".75"/><stop offset="1" stop-color="#817f76" stop-opacity=".9"/></linearGradient>
 <linearGradient id="er-veil"><stop stop-color="#b4dad9" stop-opacity="0"/><stop offset=".3" stop-color="#cae5dd" stop-opacity=".35"/><stop offset=".8" stop-color="#b4d8d7" stop-opacity=".12"/><stop offset="1" stop-color="#b4dad9" stop-opacity="0"/></linearGradient>
 <radialGradient id="er-glow"><stop stop-color="#ffe3a4" stop-opacity=".7"/><stop offset=".25" stop-color="#ffe3a4" stop-opacity=".12"/><stop offset="1" stop-color="#ffe3a4" stop-opacity="0"/></radialGradient>
 <radialGradient id="er-crater"><stop stop-color="#ffd29a"/><stop offset=".45" stop-color="#b77b51"/><stop offset="1" stop-color="#78604e" stop-opacity="0"/></radialGradient>
 <filter id="er-soft"><feGaussianBlur stdDeviation="7"/></filter>
 <pattern id="er-grain" width="130" height="90" patternUnits="userSpaceOnUse"><circle cx="13" cy="12" r=".7" fill="#eef4e6" opacity=".12"/><circle cx="76" cy="52" r=".6" fill="#fff" opacity=".1"/><path d="M20 75l18-2M100 22l8-1" stroke="#fff" opacity=".04"/></pattern>
 <marker id="er-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1l7 4-7 4" fill="none" stroke="#f5d495" stroke-width="1.5"/></marker>
 </defs>
 <rect width="960" height="500" fill="url(#er-space)"/>
 <path d="M0 278Q440 82 960 205V500H0Z" fill="url(#er-sky)"/>
 <path d="M0 276Q440 80 960 203" fill="none" stroke="#8bb9bc" stroke-opacity=".35"/>
 <path d="M0 300Q440 103 960 228" fill="none" stroke="#c4e3dd" stroke-opacity=".08"/>
 <ellipse cx="952" cy="23" rx="155" ry="155" fill="url(#er-glow)"/>
 <g class="eruption-terrain"><path d="M0 419L78 377L150 399L219 365L301 386L364 345L429 382L501 364L596 400L673 384L764 401L855 380L960 408V500H0Z" fill="#345052"/>
 <path d="M0 467L77 422L126 432L173 379L213 350L239 307L254 290L267 297L279 287L295 304L321 351L354 368L393 412L443 439L523 466L629 444L734 473L849 449L960 467V500H0Z" fill="url(#er-rock)"/>
 <path d="M279 287L295 304L321 351L354 368L393 412L443 439L523 466L650 500H304L290 427L266 390L279 340L266 316Z" fill="url(#er-face)"/>
 <path d="M252 301L219 353L210 389L171 432M263 311L247 357L252 383L228 429M289 309L301 354L333 398L346 449M304 344L316 384L360 427M217 363L190 390L175 421" fill="none" stroke="#d3b998" stroke-width="1.2" opacity=".4"/>
 <path d="M0 481Q159 451 292 477T605 482T960 479V500H0Z" fill="#162c33"/>
 <path d="M0 488Q159 459 292 485T605 490T960 487" fill="none" stroke="#a8b7a8" stroke-width="1" opacity=".3"/>
 <ellipse cx="270" cy="299" rx="23" ry="11" fill="url(#er-crater)"/>
 <path d="M251 301Q264 308 280 296" fill="none" stroke="#e1b387" stroke-width="2"/>
 </g>
 <g class="film-plume eruption-plume"><path d="M260 299C253 271 277 256 260 236C239 215 256 208 240 186C219 160 235 151 256 156C235 125 251 111 280 120C283 96 313 94 326 111C349 93 376 104 372 123C405 118 419 142 394 155C422 163 410 184 388 186C357 203 322 185 303 203C288 224 295 238 283 254C276 270 283 282 276 301Z" fill="url(#er-plume)"/>
 <path d="M264 286C272 259 252 248 271 226C292 201 274 189 266 178C246 154 273 138 291 151C283 130 302 122 318 137C333 122 359 132 352 147C382 139 397 159 374 169C344 186 313 170 297 187" fill="none" stroke="#edf0e6" stroke-width="14" stroke-linecap="round" opacity=".18"/>
 <path d="M276 282C285 253 272 233 294 211C312 191 303 176 322 166" fill="none" stroke="#6e7b7d" stroke-width="9" stroke-linecap="round" opacity=".24"/>
 </g>
 <g class="film-aerosols eruption-veil"><path d="M279 134Q501 56 893 143L902 192Q540 112 299 184Z" fill="url(#er-veil)" filter="url(#er-soft)"/><path d="M306 144Q538 93 884 160" fill="none" stroke="#d5ede3" stroke-width="1" opacity=".27"/><g fill="#d8f0e6">${haze}</g></g>
 <g class="film-ray eruption-rays incoming"><path d="M833 25L675 148M862 31L703 156M891 37L731 164" marker-end="url(#er-arrow)"/></g>
 <g class="film-ray eruption-rays reflected"><path d="M684 149L622 55M714 158L654 63" marker-end="url(#er-arrow)"/></g>
 <g class="film-ray eruption-rays surface-ray"><path d="M708 176L501 339" marker-end="url(#er-arrow)"/></g>
 <g class="eruption-scene-guides" fill="none" stroke="#c1d7d4" stroke-width="1" opacity=".5"><path d="M124 290h64l57 12"/><path class="veil-guide" d="M475 109v-27h85"/><path class="light-guide" d="M752 267h50v-55"/></g>
 <g class="eruption-art-labels"><text x="46" y="286">ERUPTION</text><text class="veil-guide" x="568" y="86">AEROSOL VEIL</text><text class="light-guide" x="745" y="290">LESS LIGHT</text><text class="light-guide" x="745" y="308">AT THE SURFACE</text></g>
 <rect width="960" height="500" fill="url(#er-grain)" pointer-events="none"/>
 </svg><span class="eruption-scene-credit">Beyond the Reply · explanatory illustration</span></div>`;
}
