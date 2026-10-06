import {validateFeedback,MAX_BYTES} from '../feedback-core.mjs';
const stmt=(env,sql,...values)=>env.DB.prepare(sql).bind(...values);
const hex=bytes=>[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');
async function hash(text){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));}
async function connectionKey(secret,address,hour){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(hour+'|'+address)));}
async function readBody(request){const reader=request.body?.getReader();if(!reader)throw Error('Empty message.');let length=0,chunks=[];try{while(true){const r=await reader.read();if(r.done)break;length+=r.value.byteLength;if(length>MAX_BYTES)throw Error('too-large');chunks.push(r.value);}}finally{await reader.cancel().catch(()=>{});}const out=new Uint8Array(length);let offset=0;for(const c of chunks){out.set(c,offset);offset+=c.length;}return new TextDecoder().decode(out);}
function response(data,status=200,origin=''){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin',...(origin?{'Access-Control-Allow-Origin':origin}:{})}});}
export async function purge(env){await env.DB.batch([stmt(env,"DELETE FROM player_feedback WHERE (resolved_at IS NOT NULL AND resolved_at < datetime('now','-180 days')) OR created_at < datetime('now','-365 days')"),stmt(env,"DELETE FROM feedback_quota WHERE expires_at < unixepoch()")]);}
export default {
 async fetch(request,env){const url=new URL(request.url),origin=request.headers.get('Origin')||'',allowed=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(url.pathname==='/api/health'&&request.method==='GET')return response({ok:!!(env.DB&&env.FEEDBACK_RATE_SECRET)},env.DB&&env.FEEDBACK_RATE_SECRET?200:503);
  if(url.pathname!=='/api/feedback')return response({error:'Not found.'},404);
  if(!origin||!allowed.includes(origin))return response({error:'This page is not permitted to send feedback.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}});
  if(request.method!=='POST')return response({error:'Use the feedback form to send a message.'},405,origin);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return response({error:'Send JSON feedback.'},415,origin);
  if(!env.DB||!env.FEEDBACK_RATE_SECRET)return response({error:'Feedback is temporarily unavailable. Your message has not been cleared.'},503,origin);
  let data;try{data=validateFeedback(JSON.parse(await readBody(request)));}catch(e){return response({error:e.message==='too-large'?'Keep feedback under 32 KB.':e instanceof SyntaxError?'Send one valid feedback object.':e.message},e.message==='too-large'?413:400,origin);}
  try{const fingerprint=await hash(JSON.stringify(data)),existing=await stmt(env,'SELECT fingerprint FROM player_feedback WHERE id=?',data.requestId).first();
   if(existing)return existing.fingerprint===fingerprint?response({ok:true,receipt:data.requestId},200,origin):response({error:'This feedback changed. Reopen the form and try again.'},409,origin);
   const hour=Math.floor(Date.now()/3600000),day=Math.floor(Date.now()/86400000),key=await connectionKey(env.FEEDBACK_RATE_SECRET,request.headers.get('CF-Connecting-IP')||'unknown',hour);
   const take=async(k,max,expires)=>!!await stmt(env,'INSERT INTO feedback_quota(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count < ? RETURNING count',k,expires,max).first();
   if(!await take('hour:'+key,8,(hour+2)*3600)||!await take('day:'+day,200,(day+2)*86400))return response({error:'Feedback limit reached. Please try later; your message is still here.'},429,origin);
   await stmt(env,"INSERT INTO player_feedback(id,kind,note,email,page,version,context_json,diagnostics_json,fingerprint) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING",data.requestId,data.kind,data.note,data.email,data.page,data.version,JSON.stringify(data.context),data.diagnostics?JSON.stringify(data.diagnostics):null,fingerprint).run();
   const saved=await stmt(env,'SELECT fingerprint FROM player_feedback WHERE id=?',data.requestId).first();if(saved?.fingerprint!==fingerprint)return response({error:'This feedback changed. Reopen the form and try again.'},409,origin);
   return response({ok:true,receipt:data.requestId},201,origin);
  }catch{return response({error:'Feedback could not be saved. Please retry; your message is still here.'},503,origin);}
 },
 async scheduled(event,env,ctx){ctx.waitUntil(purge(env));}
};
