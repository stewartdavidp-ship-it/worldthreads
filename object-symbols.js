// Type cues for existing object identities; no portraits or historical reconstructions.
const objectSymbolPaths={
 PERSON:'<circle cx="32" cy="19" r="10"/><path d="M12 56v-8c0-18 40-18 40 0v8"/>',
 MOVEMENT:'<path d="M16 57V8m0 0h34l-7 11 7 11H16"/><circle cx="38" cy="47" r="4"/><path d="M29 59v-3c0-8 18-8 18 0v3"/>',
 POLITY:'<path d="M9 55h46M14 55V29h36v26M9 29l23-13 23 13M32 16V4h17l-4 5 4 5H32M24 36v12m16-12v12"/>',
 INSTITUTION:'<path d="M6 57h52M10 22h44L32 7ZM15 27v23m17-23v23m17-23v23M10 51h44"/>',
 PLACE:'<path d="M32 58S12 37 12 23a20 20 0 0 1 40 0c0 14-20 35-20 35Z"/><circle cx="32" cy="23" r="7"/>',
 NATURAL_FEATURE:'<path d="M4 55 24 16l13 24 8-14 15 29ZM17 30l7 5 6-5M5 60h54"/>',
 ENVIRONMENTAL_EPISODE:'<path d="M15 34a10 10 0 0 1 0-20 16 16 0 0 1 29 0 10 10 0 0 1 4 20ZM17 43l-4 9m20-9-4 9m20-9-4 9"/>',
 BIOLOGICAL_SYSTEM:'<path d="M13 53C3 23 21 8 53 8c0 32-15 50-40 45ZM12 55l30-34M25 42V28m0 14h15"/>',
 TECHNOLOGY:'<path d="M26 6h12l2 8 8-2 8 9-5 7 7 5-3 12-9-1-3 9H31l-4-8-9 2-8-9 5-8-7-4 4-12 8 1Z"/><circle cx="33" cy="30" r="10"/>',
 WORK:'<path d="M32 15C22 8 11 8 5 11v40c10-3 19-2 27 4 8-6 17-7 27-4V11c-6-3-17-3-27 4v40M12 21l12 2m-12 8 12 2m16-10 12-2m-12 12 12-2"/>',
 EVENT:'<rect x="8" y="12" width="48" height="44" rx="5"/><path d="M8 26h48M20 6v13M44 6v13m-26 17h7m14 0h7m-28 10h7m14 0h7"/>',
 POLICY:'<path d="M15 8h33v43c0 9-25 9-25 0V16c0-11-16-11-16 0h16M23 49h31c0 11-6 11-6 11M30 23h11m-11 9h11m-11 9h7"/>',
 PROCESS:'<path d="M9 27A24 24 0 0 1 50 13l6 8M56 8v13H43M55 37A24 24 0 0 1 14 51l-6-8M8 56V43h13"/>',
 CONDITION:'<path d="M8 49a26 26 0 1 1 48 0ZM32 37l13-16M14 29l5 3m5-20 2 5m18-5-2 5M45 33l5-2"/><circle cx="32" cy="38" r="3"/>'
};
function objectSymbol(type){return `<svg class="object-symbol" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${objectSymbolPaths[type]||objectSymbolPaths.CONDITION}</svg>`;}
function objectEvidenceCounts(o){const connections=state.objectRelationships.filter(r=>(r.subjectId===o.id||r.objectId===o.id)&&r.relationshipKind!=='CONTEXT').length;return `<div class="object-count-chips"><span title="Evidence records linked to this object" aria-label="${o.observationIds.length} linked evidence ${o.observationIds.length===1?'record':'records'}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h12v15H7ZM4 7v14h12M10 7h6m-6 4h6"/></svg><span><strong>${o.observationIds.length}</strong> ${o.observationIds.length===1?'record':'records'}</span></span><span title="Documented roles and registered change connections; not a measure of influence" aria-label="${connections} documented roles or registered change connections"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h7m0 0 7-7m-7 7 7 7"/><circle cx="4" cy="12" r="2"/><circle cx="19" cy="4" r="2"/><circle cx="19" cy="20" r="2"/></svg><span><strong>${connections}</strong> ${connections===1?'connection':'connections'}</span></span></div>`;}
