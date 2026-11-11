import {test,expect} from '@playwright/test';

for(const [name,path,selector] of [
 ['dinner','/practice/','.dinner-option'],
 ['survey','/reflection/','#q1 input'],
 ['invitation','/','.room-enter'],
])test(`${name} protects the first action while its scripts are still loading`,async({page})=>{
 let release!:()=>void;
 const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route('**/_astro/*.js',async route=>{await gate;await route.continue();});
 try{
  await page.goto(path,{waitUntil:'commit'});
  const control=page.locator(selector).first();
  await expect(control).toBeVisible();
  await expect(control).toBeDisabled();
  release();
  await expect(control).toBeEnabled();
  if(name==='dinner'){
   await control.click();await expect(page.locator('.dinner-feedback')).toContainText('A thoughtful choice.');
  }else if(name==='survey'){
   await page.locator('#q1 input').nth(1).check();await expect(page.locator('#knowledge-progress')).toHaveAttribute('value','1');
  }else{
   await control.click();await expect(page.locator('.room-guide')).toBeVisible();
  }
 }finally{release();}
});
