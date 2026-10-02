const leads=new Set(['rain','challenge','science','choice','serene']);
const id=()=>crypto.randomUUID().replaceAll('-','');
const token=()=>id()+id();
const at=()=>new Date().toISOString();
const statement=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const digest=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function body(request){const reader=request.body?.getReader();if(!reader)throw Error('Missing input');let text='',size=0;const decoder=new TextDecoder();try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>9000)throw Error('Input too large');text+=decoder.decode(value,{stream:true});}text+=decoder.decode();}finally{await reader.cancel().catch(()=>{});}return JSON.parse(text);}
function identity(p){return typeof p.alias==='string'&&p.alias.trim().length>=1&&p.alias.trim().length<=40&&leads.has(p.leadId);}
async function limited(env,request,kind,max){const hour=at().slice(0,13),address=request.headers.get('CF-Connecting-IP')||'local',key='room-'+kind+':'+hour+':'+await digest(hour+address);return !!await statement(env,'INSERT INTO quota(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<? RETURNING count',key,new Date(Date.now()+7200000).toISOString(),max).first();}
export async function roomRoute(request,env,reply){
 const path=new URL(request.url).pathname;
 if(!path.startsWith('/api/rooms'))return null;
 if(request.method==='POST'&&path==='/api/rooms'){
  const p=await body(request);if(!identity(p))return reply({error:'Choose a nickname and a lead.'},422);
  if(!await limited(env,request,'create',4))return reply({error:'Session creation limit reached. Try later.'},429);
  const room=id(),member=id(),secret=token(),code=[...crypto.getRandomValues(new Uint8Array(8))].map(x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join(''),time=at();
  await env.DB.batch([statement(env,'INSERT INTO investigation_room(id,code,case_id,created_at,updated_at) VALUES(?,?,?,?,?)',room,code,'CASE-FRANKENSTEIN',time,time),statement(env,'INSERT INTO investigation_member(id,room_id,token_hash,alias,is_host,lead_id,joined_at,updated_at) VALUES(?,?,?,?,1,?,?,?)',member,room,await digest(secret),p.alias.trim(),p.leadId,time,time)]);
  return reply({id:room,token:secret,code},201);
 }
 if(request.method==='POST'&&path==='/api/rooms/join'){
  const p=await body(request);if(!identity(p)||typeof p.code!=='string'||!/^[A-Z2-9]{8}$/.test(p.code))return reply({error:'Enter the eight-character code, a nickname and a lead.'},422);
  if(!await limited(env,request,'join',20))return reply({error:'Join limit reached. Try later.'},429);
  const room=await statement(env,'SELECT * FROM investigation_room WHERE code=?',p.code).first();if(!room)return reply({error:'Session not found. Check the code.'},404);
  if(room.phase!=='investigating')return reply({error:'This session has already opened comparison.'},409);
  const member=id(),secret=token(),time=at();
  const result=await statement(env,"INSERT INTO investigation_member(id,room_id,token_hash,alias,lead_id,joined_at,updated_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT count(*) FROM investigation_member WHERE room_id=?)<6 AND (SELECT phase FROM investigation_room WHERE id=?)='investigating' RETURNING id",member,room.id,await digest(secret),p.alias.trim(),p.leadId,time,time,room.id,room.id).first();
  if(!result)return reply({error:'Session is full or comparison has started.'},409);
  return reply({id:room.id,token:secret},201);
 }
 const match=path.match(/^\/api\/rooms\/([a-f0-9]{32})(?:\/(notes|compare|next))?$/);if(!match)return reply({error:'Session route not found.'},404);
 const secret=request.headers.get('Authorization')?.replace(/^Bearer /,'');if(!secret||!/^[a-f0-9]{64}$/.test(secret))return reply({error:'Use your private session link to rejoin.'},404);
 const member=await statement(env,'SELECT * FROM investigation_member WHERE room_id=? AND token_hash=?',match[1],await digest(secret)).first();if(!member)return reply({error:'Session not found.'},404);
 const room=await statement(env,'SELECT * FROM investigation_room WHERE id=?',match[1]).first();const action=match[2];
 if(request.method==='POST'&&action==='notes'){
  const p=await body(request);if(!leads.has(p.leadId)||!['supports','uncertain','nextEvidence'].every(k=>typeof p[k]==='string'&&p[k].trim().length>=5&&p[k].length<=1600))return reply({error:'Choose a lead and record support, uncertainty and next evidence (5–1600 characters each).'},422);
  await statement(env,'UPDATE investigation_member SET lead_id=?,notes=?,ready=1,updated_at=? WHERE id=?',p.leadId,JSON.stringify({supports:p.supports.trim(),uncertain:p.uncertain.trim(),nextEvidence:p.nextEvidence.trim()}),at(),member.id).run();
  return reply({saved:true},200);
 }
 if(request.method==='POST'&&action==='compare'){
  if(!member.is_host)return reply({error:'Only the host can open comparison.'},403);
  const count=await statement(env,'SELECT count(*) AS count FROM investigation_member WHERE room_id=? AND ready=1',room.id).first();const all=await statement(env,'SELECT count(*) AS count FROM investigation_member WHERE room_id=?',room.id).first();
  if(count.count<2||count.count!==all.count)return reply({error:'At least two investigators must join, and everyone must record their interpretation first.'},409);
  const opened=await statement(env,"UPDATE investigation_room SET phase='compare',updated_at=? WHERE id=? AND (SELECT count(*) FROM investigation_member WHERE room_id=?)>=2 AND NOT EXISTS (SELECT 1 FROM investigation_member WHERE room_id=? AND ready=0) RETURNING id",at(),room.id,room.id,room.id).first();if(!opened)return reply({error:'Someone is still investigating. Refresh before opening comparison.'},409);return reply({opened:true},200);
 }
 if(request.method==='POST'&&action==='next'){
  if(room.phase!=='compare')return reply({error:'Open comparison first.'},409);const p=await body(request);if(typeof p.question!=='string'||p.question.trim().length<10||p.question.length>1400)return reply({error:'Write a specific next investigation (10–1400 characters).'},422);
  // Each member records their own next question; disagreement need not be resolved by a vote.
  const notes=JSON.parse(member.notes||'{}');notes.followUp=p.question.trim();await statement(env,'UPDATE investigation_member SET notes=?,updated_at=? WHERE id=?',JSON.stringify(notes),at(),member.id).run();return reply({saved:true},200);
 }
 if(request.method==='GET'&&!action){
  const rows=await statement(env,'SELECT id,alias,is_host,lead_id,notes,ready,updated_at FROM investigation_member WHERE room_id=? ORDER BY joined_at,id',room.id).all();
  return reply({id:room.id,code:room.code,caseId:room.case_id,phase:room.phase,you:member.id,isHost:!!member.is_host,members:rows.results.map(m=>({id:m.id,alias:m.alias,isHost:!!m.is_host,leadId:m.lead_id,ready:!!m.ready,notes:(m.id===member.id||room.phase==='compare')&&m.notes?JSON.parse(m.notes):null})),updatedAt:room.updated_at},200);
 }
 return reply({error:'Session route not found.'},404);
}
