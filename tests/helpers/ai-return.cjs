exports.openAiReturn=async(page)=>{const entry=page.locator('#aiReturnEntry');if(!(await entry.evaluate(e=>e.open)))await entry.locator('summary').click();};
