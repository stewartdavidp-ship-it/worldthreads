export const KINDS=['problem','suggestion','question','history'];
export const VERSION='2026-10-06-feedback-2';
export const MAX_BYTES=32768;
const id=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(v)?v:null;
const choice=(v,values)=>values.includes(v)?v:null;
const number=(v,max)=>Number.isFinite(v)&&v>=0?Math.min(Math.round(v),max):null;
export function safePage(value){try{const u=new URL(value);if(!['http:','https:'].includes(u.protocol))return '';return u.origin+(/^\/(?:worldthreads\/)?(?:index\.html)?$/.test(u.pathname)?u.pathname:'/[other-page]');}catch{return '';}}
export function safeSource(value){try{const name=new URL(value,'https://example.invalid').pathname.split('/').pop();return /^[\w.-]{1,100}\.(?:js|mjs|css)$/.test(name)?name:'[resource]';}catch{return '[resource]';}}
export function safeRequest(value){try{const path=new URL(value,'https://example.invalid').pathname;if(/^\/api\/(?:health|graph|activity|feedback|submissions|rooms)(?:\/|$)/.test(path))return path.split('/').slice(0,3).join('/');const file=path.split('/').pop();return ['observations.json','relationships.json','threads.json','sources.json','mechanisms.json','research-gaps.json','objects.json','object-relationships.json','object-types.json','evidence.json','research-missions.json','graph.json','activity.json','badges.json'].includes(file)?'data/'+file:'[request]';}catch{return '[request]';}}
export function cleanContext(v={}){if(!v||typeof v!=='object'||Array.isArray(v))v={};return {
 appVersion:typeof v.appVersion==='string'&&/^[A-Za-z0-9._-]{1,80}$/.test(v.appVersion)?v.appVersion:null,view:choice(v.view,['story','research','objects','discover','explore','group','unknown'])||'unknown',dataStatus:choice(v.dataStatus,['loading','ready','unavailable']),stage:choice(v.stage,['topic','evidence','defense','research','present','prepare','return','progress']),
 selectionId:id(v.selectionId),storyId:id(v.storyId),step:number(v.step,100),threadId:id(v.threadId),objectId:id(v.objectId),
 inspector:v.inspector&&typeof v.inspector==='object'?{kind:choice(v.inspector.kind,['observation','relationship','object','objectLink','source']),id:id(v.inspector.id)}:null,
 caseState:v.caseState&&typeof v.caseState==='object'?{active:v.caseState.active===true,leadId:id(v.caseState.leadId),seen:Array.isArray(v.caseState.seen)?v.caseState.seen.slice(-20).map(id).filter(Boolean):[],pinned:Array.isArray(v.caseState.pinned)?v.caseState.pinned.slice(0,3).map(id).filter(Boolean):[],stance:id(v.caseState.stance),reasonEntered:v.caseState.reasonEntered===true,questionEntered:v.caseState.questionEntered===true,synthesisSaved:v.caseState.synthesisSaved===true}:null,
 evidence:Array.isArray(v.evidence)?v.evidence.slice(0,3).map(x=>({id:id(x?.id),role:choice(x?.role,['support','challenge','context','unresolved'])})):[],
 filters:{system:id(v.filters?.system),region:choice(v.filters?.region,['ALL','Europe','Asia','Africa','North America','South America','Oceania','Oceans']),period:id(v.filters?.period),objectType:id(v.filters?.objectType)},
 progress:{points:number(v.progress?.points,100000),cases:number(v.progress?.cases,1000),badges:number(v.progress?.badges,1000)}
};}
export function cleanDiagnostics(v={}){if(!v||typeof v!=='object'||Array.isArray(v))return null;return {
 viewport:{width:number(v.viewport?.width,20000),height:number(v.viewport?.height,20000),scale:number((v.viewport?.scale||1)*100,1000)/100},
 browser:typeof v.browser==='string'?v.browser.slice(0,300):'',
 errors:Array.isArray(v.errors)?v.errors.slice(-20).map(x=>({kind:choice(x?.kind,['script','promise','resource'])||'script',source:safeSource(x?.source),line:number(x?.line,1000000),column:number(x?.column,100000)})):[],
 requests:Array.isArray(v.requests)?v.requests.slice(-10).map(x=>({resource:safeRequest(x?.resource),status:number(x?.status,999)})):[],
 actions:Array.isArray(v.actions)?v.actions.slice(-12).filter(x=>id(x?.control)).map(x=>({control:id(x.control),value:id(x.value)})):[]
};}
export function validateFeedback(v){
 if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Send one feedback object.');
 if(!KINDS.includes(v.kind))throw Error('Choose a feedback type.');
 if(typeof v.note!=='string'||!v.note.trim())throw Error('Tell us what happened or what you would change.');
 if(v.note.length>4000)throw Error('Keep your message under 4,000 characters.');
 if(v.email!=null&&(typeof v.email!=='string'||v.email.length>200))throw Error('Check the optional email address.');
 const email=(v.email||'').trim();if(email&&!/^[^\s@,;]{1,64}@[^\s@,;]+\.[A-Za-z]{2,}$/.test(email))throw Error('Check the optional email address.');
 if(v.website!==undefined&&(typeof v.website!=='string'||v.website.trim()))throw Error('Feedback could not be accepted.');
 if(typeof v.requestId!=='string'||! /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v.requestId))throw Error('Reopen the feedback form and try again.');
 return {requestId:v.requestId.toLowerCase(),kind:v.kind,note:v.note.replace(/\r\n/g,'\n').trim(),email:email||null,page:safePage(v.page),version:VERSION,context:cleanContext(v.context),diagnostics:v.diagnostics==null?null:cleanDiagnostics(v.diagnostics)};
}
