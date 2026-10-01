const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const boot=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function load({theme,size,dark=false,blocked=false}={}){
 const root={style:{},setAttribute(k,v){this[k]=v;}};
 vm.runInNewContext(boot,{document:{documentElement:root},window:{matchMedia:()=>({matches:dark})},localStorage:{getItem(k){if(blocked)throw Error('disabled');return k.endsWith('theme')?theme:size;}}});return root;
}
test('auto follows device, explicit themes override it',()=>{
 assert.equal(load({dark:true})['data-theme'],'dark');assert.equal(load({dark:false})['data-theme'],'light');
 assert.equal(load({theme:'light',dark:true})['data-theme'],'light');assert.equal(load({theme:'dark'})['data-theme'],'dark');
});
test('saved text size applies before first paint and invalid sizes reset',()=>{
 assert.equal(load({size:'xxl'}).style.fontSize,'140%');assert.equal(load({size:'bogus'}).style.fontSize,'100%');
});
test('disabled storage still follows device settings',()=>{assert.equal(load({blocked:true,dark:false})['data-theme'],'light');});
