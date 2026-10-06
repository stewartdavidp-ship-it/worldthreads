/* Capture locations early; never buffer error messages, request contents or private URL parts. */
(function(){
 'use strict';
 const log=window.WorldThreadsFeedbackLog={errors:[],requests:[]};
 const add=(list,value,max)=>{list.push(value);if(list.length>max)list.shift();};
 const source=value=>{try{const name=new URL(value,location.href).pathname.split('/').pop();return /^[\w.-]{1,100}\.(?:js|mjs|css)$/.test(name)?name:'[resource]';}catch{return '[resource]';}};
 const requestLocation=value=>{try{const path=new URL(value,location.href).pathname;if(/^\/api\/(?:health|graph|activity|feedback|submissions|rooms)(?:\/|$)/.test(path))return path.split('/').slice(0,3).join('/');const file=path.split('/').pop();return ['observations.json','relationships.json','threads.json','sources.json','mechanisms.json','research-gaps.json','objects.json','object-relationships.json','object-types.json','evidence.json','research-missions.json','graph.json','activity.json','badges.json'].includes(file)?'data/'+file:'[request]';}catch{return '[request]';}};
 addEventListener('error',event=>add(log.errors,{kind:event.target!==window?'resource':'script',source:source(event.filename||event.target?.src||event.target?.href||''),line:event.lineno||0,column:event.colno||0},20),true);
 addEventListener('unhandledrejection',()=>add(log.errors,{kind:'promise',source:'[resource]',line:0,column:0},20));
 const originalFetch=window.fetch;
 if(originalFetch)window.fetch=function(input,...options){const url=typeof input==='string'?input:input?.url||String(input),resource=requestLocation(url);return originalFetch.call(this,input,...options).then(response=>{if(!response.ok&&resource!=='/api/feedback')add(log.requests,{resource,status:response.status},10);return response;},error=>{if(resource!=='/api/feedback')add(log.requests,{resource,status:0},10);throw error;});};
})();
