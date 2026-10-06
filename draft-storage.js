// Keep the current draft recoverable without treating an in-memory edit as a durable save.
let currentDraft=null,draftBase=null,draftDirty=false,draftConflict=false;
const sessionArchives=new Map();
function normaliseDraft(value){if(!value||typeof value!=='object'||Array.isArray(value))return {};
 const result={};for(const [key,v] of Object.entries(value))if(typeof v==='string'||v===null)result[key]=v;
 result.argumentRevisions=Array.isArray(value.argumentRevisions)?value.argumentRevisions.filter(r=>r&&typeof r==='object'&&!Array.isArray(r)&&typeof r.before==='string'&&typeof r.after==='string').map(r=>Object.fromEntries(Object.entries(r).filter(([,v])=>typeof v==='string'))):[];
 return result;
}
function storedDraftRaw(){return localStorage.getItem(THESIS_KEY);}
function readCurrentDraft(){if(currentDraft===null){try{draftBase=storedDraftRaw();currentDraft=normaliseDraft(JSON.parse(draftBase||'{}'));}catch{currentDraft={};}}return currentDraft;}
function draftRecoveryMessage(){return draftConflict?'Another tab changed this draft. Your work is kept in this page; download it before choosing which version to keep.':'Browser storage is unavailable. Current work is kept in this page session, not saved. Download it before leaving.';}
function showDraftRecovery(){const root=document.getElementById('draftRecovery');if(!root)return;root.hidden=!draftDirty&&!draftConflict;if(root.hidden)return;root.querySelector('[role=status]').textContent=draftRecoveryMessage();root.querySelector('[data-use-other-draft]').hidden=!draftConflict;root.querySelector('[data-keep-this-draft]').hidden=!draftConflict;}
function writeCurrentDraft(values,{overwrite=false}={}){readCurrentDraft();currentDraft=normaliseDraft(values);draftDirty=true;
 try{const raw=storedDraftRaw();if(!overwrite&&raw!==draftBase){draftConflict=true;showDraftRecovery();return false;}localStorage.setItem(THESIS_KEY,JSON.stringify(currentDraft));draftBase=storedDraftRaw();draftDirty=false;draftConflict=false;showDraftRecovery();return true;}catch{showDraftRecovery();return false;}}
function archiveCurrentDraft(id){try{if(storedDraftRaw()!==draftBase)draftConflict=true;}catch{}if(draftConflict){showDraftRecovery();return false;}sessionArchives.set(id,structuredClone(readCurrentDraft()));try{localStorage.setItem(THESIS_KEY+'-archive-'+id,JSON.stringify(readCurrentDraft()));return true;}catch{return false;}}
function readArchivedDraft(id){if(sessionArchives.has(id))return structuredClone(sessionArchives.get(id));try{return normaliseDraft(JSON.parse(localStorage.getItem(THESIS_KEY+'-archive-'+id)||'{}'));}catch{return {};}}
function activateDraft(draft){currentDraft=normaliseDraft(draft);return writeCurrentDraft(currentDraft);}
function draftRecoveryHtml(){return '<aside id="draftRecovery" class="board-review" hidden><p role="status"></p><button type="button" class="story-back" data-recover-download>Download my current work</button><button type="button" class="story-back" data-use-other-draft>Use the other tab’s saved draft</button><button type="button" class="story-back" data-keep-this-draft>Save this page’s draft instead</button></aside>';}
window.addEventListener('storage',e=>{if(e.key!==THESIS_KEY&&e.key!==null)return;if(e.newValue===draftBase)return;draftConflict=true;showDraftRecovery();});
window.addEventListener('beforeunload',e=>{if(!draftDirty)return;e.preventDefault();e.returnValue='';});
document.addEventListener('click',e=>{if(e.target.closest('[data-recover-download]'))downloadThesisDraft();if(e.target.closest('[data-use-other-draft]')){currentDraft=null;draftBase=null;draftDirty=false;draftConflict=false;readCurrentDraft();openThesisWorkspace();}if(e.target.closest('[data-keep-this-draft]')){saveThesisDraft({target:document.getElementById('thesisForm'),preventDefault(){}});if(writeCurrentDraft(readCurrentDraft(),{overwrite:true}))openThesisWorkspace();}});
