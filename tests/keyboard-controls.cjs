// Activate and enter text through keyboard APIs; no mouse clicks or script-opened details.
module.exports=async function keyboardControls(page){
 const prototype=Object.getPrototypeOf(page.locator('body'));
 prototype.click=async function(){await this.focus();await this.press('Enter');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
 page.click=async selector=>page.locator(selector).first().click();
 page.check=async selector=>{const target=page.locator(selector);await target.focus();if(!await target.isChecked())await target.press('Space');};
 page.fill=async(selector,text)=>{const target=page.locator(selector);await target.focus();await target.press(process.platform==='darwin'?'Meta+A':'Control+A');await page.keyboard.insertText(text);};
 page.selectOption=async(selector,value)=>{const target=page.locator(selector);const label=await target.evaluate((select,id)=>[...select.options].find(o=>o.value===id)?.textContent,value);if(label===undefined)throw Error('No option '+value);await target.focus();await target.press('Tab');await target.focus();await page.keyboard.type(label);await target.press('Tab');if(await target.inputValue()!==value)throw Error('Keyboard selection failed: '+selector+' expected '+value+' got '+await target.inputValue());};
};
