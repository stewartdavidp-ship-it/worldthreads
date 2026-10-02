const cases={'CASE-FRANKENSTEIN':new Set(['rain','challenge','science','choice','serene']),'CASE-FISHERIES':new Set(['temperature','species','effort','adaptation'])};
const hasLead=(caseId,leadId)=>Object.hasOwn(cases,caseId)&&cases[caseId].has(leadId);
const id=()=>crypto.randomUUID().replaceAll('-','');
const token=()=>id()+id();
const at=()=>new Date().toISOString();
const statement=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const digest=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function body(request){const reader=request.body?.getReader();if(!reader)throw Error('Missing input');let text='',size=0;const decoder=new TextDecoder();try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>9000)throw Error('Input too large');text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{await reader.cancel().catch(()=>{});}return JSON.parse(text);}
function identity(p,caseId){return typeof p.alias==='string'&&p.alias.trim().length>=1&&p.alias.trim().length<=40&&hasLead(caseId,p.leadId);}
async function limited(env,request,kind,max){const hour=at().slice(0,13),address=request.headers.get('CF-Connecting-IP')||'local',key='room-'+kind+':'+hour+':'+await digest(hour+address);return !!await statement(env,'INSERT INTO quota(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count',key,new Date(Date.now()+7200000).toISOString(),max).first();}
export async function roomRoute(request,env,reply){
 const path=new URL(request.url).pathname;
 if(!path.startsWith('/api/rooms'))return null;
 if(request.method==='POST'&&path==='/api/rooms'){
  const p=await body(request);const caseId=p.caseId||'CASE-FRANKENSTEIN';if(!identity(p,caseId))return reply({error:'Choose a nickname and a lead.'},422);
  if(!await limited(env,request,'create',4))return reply({error:'Session creation limit reached. Try later.'},429);
  const room=id(),member=id(),secret=token(),code=[...crypto.getRandomValues(new Uint8Array(8))].map(x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join(''),time=at();
  await env.DB.batch([statement(env,'INSERT INTO investigation_room(id,code,case_id,created_at,updated_at) VALUES(?,?,?,?,?)',room,code,caseId,time,time),statement(env,'INSERT INTO investigation_member(id,room_id,token_hash,alias,is_host,lead_id,joined_at,updated_at) VALUES(?,?,?,?,1,?,?,?)',member,room,await digest(secret),p.alias.trim(),p.leadId,time,time)]);
  return reply({id:room,token:secret,code},201);
 }
 if(request.method==='POST'&&path==='/api/rooms/join'){
  const p=await body(request);if(typeof p.alias!=='string'||p.alias.trim().length<1||p.alias.trim().length>40||typeof p.code!=='string'||!/^[A-Z2-9]{8}$/.test(p.code))return reply({error:'Enter the eight-character code, a nickname and a lead.'},422);
  if(!await limited(env,request,'join',20))return reply({error:'Join limit reached. Try later.'},429);
  const room=await statement(env,'SELECT * FROM investigation_room WHERE code=?',p.code).first();if(!room)return reply({error:'Session not found. Check the code.'},404);
  if(!identity(p,room.case_id))return reply({error:'Choose a lead for this session’s case.'},422);
  if(room.phase!=='investigating')return reply({error:'This session has already opened comparison.'},409);
  const member=id(),secret=token(),time=at();
  const result=await statement(env,"INSERT INTO investigation_member(id,room_id,token_hash,alias,lead_id,joined_at,updated_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT count(*) FROM investigation_member WHERE room_id=? AND active=1)<6 AND (SELECT phase FROM investigation_room WHERE id=?)='investigating' RETURNING id",member,room.id,await digest(secret),p.alias.trim(),p.leadId,time,time,room.id,room.id).first();
  if(!result)return reply({error:'Session is full or comparison has started.'},409);
  return reply({id:room.id,token:secret},201);
 }
 if(request.method==='GET'&&path==='/api/rooms/lookup'){
  const code=new URL(request.url).searchParams.get('code');if(!code||!/^[A-Z2-9]{8}$/.test(code))return reply({error:'Enter the eight-character session code.'},422);
  if(!await limited(env,request,'lookup',60))return reply({error:'Session lookup limit reached. Try later.'},429);
  const room=await statement(env,'SELECT case_id,phase FROM investigation_room WHERE code=?',code).first();if(!room)return reply({error:'Session not found. Check the code.'},404);
  const counts=await statement(env,'SELECT lead_id,count(*) AS count FROM investigation_member WHERE room_id=(SELECT id FROM investigation_room WHERE code=?) AND active=1 GROUP BY lead_id',code).all();
  return reply({caseId:room.case_id,phase:room.phase,activeCount:counts.results.reduce((sum,m)=>sum+m.count,0),leadOccupancy:Object.fromEntries(counts.results.map(m=>[m.lead_id,m.count]))},200);
 }
 const match=path.match(/^\/api\/rooms\/([a-f0-9]{32})(?:\/(notes|compare|next|withdraw))?$/);if(!match)return reply({error:'Session route not found.'},404);
 const secret=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!secret||!/^[a-f0-9]{64}$/.test(secret))return reply({error:'Use your private session link to rejoin.'},404);
 const member=await statement(env,'SELECT * FROM investigation_member WHERE room_id=? AND token_hash=?',match[1],await digest(secret)).first();if(!member)return reply({error:'Session not found.'},404);
 const room=await statement(env,'SELECT * FROM investigation_room WHERE id=?',match[1]).first();const action=match[2];
 if(request.method==='POST'&&!member.active)return reply({error:'You withdrew from this session. Join an open session again to contribute.'},409);
 if(request.method==='POST'&&action==='withdraw'){if(member.is_host)return reply({error:'The host must stay available to open comparison. You can continue with at least two ready investigators.'},409);await statement(env,'UPDATE investigation_member SET active=0,updated_at=? WHERE id=?',at(),member.id).run();return reply({withdrawn:true},200);}
 if(request.method==='POST'&&action==='notes'){
  const p=await body(request);if(!hasLead(room.case_id,p.leadId)||!['supports','uncertain','nextEvidence'].every(k=>typeof p[k]==='string'&&p[k].trim().length>=5&&p[k].length<=1600))return reply({error:'Choose a lead and record support, uncertainty and next evidence (5–1600 characters each).'},422);
  await statement(env,"UPDATE investigation_member SET lead_id=?,notes=json_set(COALESCE(notes,'{}'),'$.supports',?,'$.uncertain',?,'$.nextEvidence',?),ready=1,updated_at=? WHERE id=?",p.leadId,p.supports.trim(),p.uncertain.trim(),p.nextEvidence.trim(),at(),member.id).run();
  return reply({saved:true},200);
 }
 if(request.method==='POST'&&action==='compare'){
  if(!member.is_host)return reply({error:'Only the host can open comparison.'},403);
  const p=await body(request);const proceed=p.proceedWithReady===true;
  const opened=await statement(env,"UPDATE investigation_room SET phase='compare',updated_at=? WHERE id=? AND (SELECT count(*) FROM investigation_member WHERE room_id=? AND active=1 AND ready=1)>=2 AND (?=1 OR NOT EXISTS (SELECT 1 FROM investigation_member WHERE room_id=? AND active=1 AND ready=0)) RETURNING id",at(),room.id,room.id,proceed?1:0,room.id).first();if(!opened)return reply({error:'At least two active investigators must record an interpretation. If others are unfinished, explicitly choose to continue with ready investigators.'},409);return reply({opened:true},200);
 }
 if(request.method==='POST'&&action==='next'){
  if(room.phase!=='compare')return reply({error:'Open comparison first.'},409);const p=await body(request);if(typeof p.question!=='string'||p.question.trim().length<10||p.question.length>1400)return reply({error:'Write a specific next investigation (10–1400 characters).'},422);
  // Each member records their own next question; disagreement need not be resolved by a vote.
  await statement(env,"UPDATE investigation_member SET notes=json_set(COALESCE(notes,'{}'),'$.followUp',?),updated_at=? WHERE id=?",p.question.trim(),at(),member.id).run();return reply({saved:true},200);
 }
 if(request.method==='GET'&&!action){
  const rows=await statement(env,'SELECT id,alias,is_host,lead_id,notes,ready,active,updated_at FROM investigation_member WHERE room_id=? ORDER BY joined_at,id',room.id).all();
  return reply({id:room.id,code:room.code,caseId:room.case_id,phase:room.phase,you:member.id,isHost:!!member.is_host,members:rows.results.map(m=>({id:m.id,alias:m.alias,isHost:!!m.is_host,leadId:m.lead_id,ready:!!m.ready,active:!!m.active,contributed:!!m.active&&!!m.ready,notes:(m.id===member.id||(room.phase==='compare'&&m.active&&m.ready))&&m.notes?JSON.parse(m.notes):null})),updatedAt:room.updated_at},200);
 }
 return reply({error:'Session route not found.'},404);
}
