// Keep original bytes before replacing an unreadable local record collection.
function storedListState(key,valid){
 const raw=localStorage.getItem(key);
 if(raw===null)return {raw,values:[],incompatible:false};
 try{const parsed=JSON.parse(raw);return {raw,values:Array.isArray(parsed)?parsed.filter(valid):[],incompatible:!Array.isArray(parsed)||parsed.some(x=>!valid(x))};}
 catch{return {raw,values:[],incompatible:true};}
}
function readStoredRecords(key,valid){try{return storedListState(key,valid).values;}catch{return [];}}
function recordRecoveryCopies(key){
 const raw=localStorage.getItem(key+'-recovery-v1');if(raw===null)return [];
 const copies=JSON.parse(raw);
 if(!Array.isArray(copies)||copies.some(x=>!x||typeof x.raw!=='string'||typeof x.at!=='string'))throw Error('Existing recovery copies could not be read. The saved records have been kept');
 return copies;
}
function writeStoredRecords(key,values,valid){
 if(!Array.isArray(values)||values.some(x=>!valid(x)))throw Error('The new records could not be validated');
 const original=storedListState(key,valid);
 if(original.incompatible){
  try{const copies=recordRecoveryCopies(key);if(!copies.some(x=>x.raw===original.raw))localStorage.setItem(key+'-recovery-v1',JSON.stringify([...copies,{at:new Date().toISOString(),raw:original.raw}]));}
  catch{throw Error('The original saved records could not be preserved. Download them before retrying; nothing has been replaced');}
 }
 if(localStorage.getItem(key)!==original.raw)throw Error('Another tab changed these records. Retry after reviewing its saved work');
 localStorage.setItem(key,JSON.stringify(values));
}
function recordRecoveryHtml(key,valid,label){
 try{
  const original=storedListState(key,valid);let copies=[];try{copies=recordRecoveryCopies(key);}catch{}
  if(!original.incompatible&&!copies.length)return '';
  return `<aside class="board-review"><details><summary>${escapeHtml(label)} · ${original.incompatible?'some saved records could not be read':'original records preserved'}</summary><p>${original.incompatible?'Only readable records are shown. Before a later save replaces this collection, the original must be preserved.':'A previous unreadable collection was preserved before saving new records.'} These copies are recovery files, not verified evidence or earned milestones.</p>${original.incompatible?`<button type="button" class="story-back" data-download-record-recovery="${escapeAttr(key)}" data-recovery-index="current">Download the original saved records</button>`:''}${copies.map((x,i)=>`<button type="button" class="story-back" data-download-record-recovery="${escapeAttr(key)}" data-recovery-index="${i}">Download preserved original ${i+1} · ${escapeHtml(x.at.slice(0,10))}</button>`).join('')}</details></aside>`;
 }catch{return '';}
}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-download-record-recovery]');if(!button)return;
 const key=button.dataset.downloadRecordRecovery;if(![LOCAL_RESEARCH_KEY,PORTFOLIO_KEY].includes(key))return;
 try{const index=button.dataset.recoveryIndex,raw=index==='current'?localStorage.getItem(key):recordRecoveryCopies(key)[Number(index)]?.raw;if(typeof raw!=='string')return;
 const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=key===LOCAL_RESEARCH_KEY?'worldthreads-original-research.json':'worldthreads-original-portfolios.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }catch{button.textContent='Recovery file unavailable. Your saved records have not been changed.';}
});
