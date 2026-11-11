import{test,expect}from'@playwright/test';

test('illustrated room selects the napkin by clicking its actual rendered surface',async({page})=>{
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await page.goto('/table/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','vector');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  let found=false;
  const stage=(await page.locator('.room-canvas').boundingBox())!;
  for(const y of Array.from({length:15},(_,i)=>.35+i*.025)){
    for(const x of Array.from({length:13},(_,i)=>.35+i*.025)){
      await page.mouse.move(stage.x+stage.width*x,stage.y+stage.height*y);
      if(await page.locator('.room-canvas').getAttribute('data-hovered')==='1'){
        await page.mouse.click(stage.x+stage.width*x,stage.y+stage.height*y);found=true;break;
      }
    }
    if(found)break;
  }
  expect(found,'The visible napkin can be picked without using the side guide').toBe(true);
  await expect(page.locator('.table-detail h2')).toHaveText('Napkin');
  await expect(page).toHaveURL(/#napkin$/);
});

test('home fills wide and zoom-equivalent viewports symmetrically',async({page})=>{
  for(const width of [1920,2560]){
    await page.setViewportSize({width,height:1100});await page.goto('/');
    const rect=(await page.locator('.dining-hero').boundingBox())!;
    expect(Math.abs(rect.x-(width-rect.x-rect.width))).toBeLessThanOrEqual(2);
    expect(rect.width/width).toBeGreaterThan(.94);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
});
