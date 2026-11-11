import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('guided camera, seventeen objects, deep links and map share the same learning content',async({page})=>{
  await page.goto('/table/');
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','table',{timeout:20000});
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  for(let index=0;index<17;index++) {
    await page.locator('.table-item-list button').nth(index).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera',`item-${index}`);
    await expect(page.locator('.room-canvas')).toHaveAttribute('data-moving','false');
  }
  await expect(page).toHaveURL(/#cup$/);
  await page.reload();
  await expect(page.locator('.table-detail h2')).toHaveText('Cup & saucer');
  await page.getByRole('button',{name:'Next table object',exact:true}).click();
  await expect(page.locator('.table-detail h2')).toHaveText('Dinner plate');
  await expect(page).toHaveURL(/#plate$/);
  await page.getByRole('button',{name:'Previous table object',exact:true}).click();
  await expect(page.locator('.table-detail h2')).toHaveText('Cup & saucer');
  await page.getByRole('button',{name:'Use the 2D map',exact:true}).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button',{name:'Explore salad fork',exact:true}).click();
  await expect(page.locator('.table-detail h2')).toHaveText('Salad fork');
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole('button',{name:'Return to the dining room',exact:true}).click();
  await expect(page.locator('.room-canvas.is-ready')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('mobile readers can move between an object and its explanation',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/table/#salad-fork');
  await expect(page.locator('.room-canvas.is-ready')).toBeVisible({timeout:20000});
  await page.getByRole('button',{name:'Read the details',exact:true}).click();
  await expect(page.locator('.table-detail')).toBeFocused();
  await expect(page.locator('.table-detail h2')).toHaveText('Salad fork');
  await page.getByRole('button',{name:'See this object',exact:true}).click();
  await expect(page.locator('.room-orientation h2')).toBeFocused();
  await expect(page.locator('.room-canvas')).toBeInViewport({ratio:0.8});
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-2');
});

test('pointer camera travel is interruptible; keyboard and reduced motion do not travel',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true',{timeout:20000});
  await page.getByRole('button',{name:'Take your seat',exact:true}).click();
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-moving','true');
  await page.locator('.table-item-list button').nth(7).click();
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-7');
  await page.locator('.table-item-list button').nth(2).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-moving','false');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.table-item-list button').nth(4).click();
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-4');
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-moving','false');
});

test('unavailable WebGL preserves a moving perspective 3D room and the complete guide',async({page})=>{
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null;});
  await page.goto('/table/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','vector',{timeout:20000});
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.vector-room')).toBeVisible();
  const before=await page.locator('.vector-room').innerHTML();
  await page.locator('.table-item-list button').nth(7).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.table-detail h2')).toHaveText('Water glass');
  expect(await page.locator('.vector-room').innerHTML()).not.toEqual(before);
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-7');
  await page.goto('/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','vector',{timeout:20000});
  await expect(page.locator('.room-invitation')).toBeVisible();
  await expect(page.locator('.cinematic-veil')).toBeVisible();
  await page.getByRole('button',{name:'Take your seat',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.room-invitation')).toHaveCount(0);
  await page.locator('.table-item-list button').nth(7).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.table-detail h2')).toHaveText('Water glass');
});

test('lost graphics context recovers to illustrated 3D and rendered mode can be retried',async({page})=>{
  await page.goto('/table/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  await page.locator('canvas').evaluate(canvas=>(canvas as HTMLCanvasElement).getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext());
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','vector');
  await expect(page.locator('.vector-room')).toBeVisible();
  await page.locator('.table-item-list button').nth(5).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-5');
  await page.getByRole('button',{name:'Retry rendered 3D',exact:true}).click();
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','webgl');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('.vector-room')).toHaveCount(0);
});

test('blocked canvas textures recover without leaving a blank GPU canvas over the room',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type==='2d')return null;
      return Reflect.apply(original,this,[type,...args]);
    } as typeof original;
  });
  await page.goto('/table/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-renderer','vector');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.room-canvas canvas')).toHaveCount(0);
  await expect(page.locator('.vector-room')).toHaveCount(1);
  await page.locator('.table-item-list button').nth(6).focus();await page.keyboard.press('Enter');
  await expect(page.locator('.room-canvas')).toHaveAttribute('data-camera','item-6');
});

test('reading and survey routes never request the 3D engine',async({page})=>{
  const requests:string[]=[];
  page.on('request',request=>requests.push(request.url()));
  for(const route of ['/chapters/reading-the-table/','/reflection/','/practice/'])await page.goto(route);
  expect(requests.filter(url=>/dining-scene.*\.js/.test(url))).toEqual([]);
});

test('selecting a modeled object directly opens its explanation',async({page})=>{
  await page.goto('/table/');
  await expect(page.locator('.dining-experience')).toHaveAttribute('data-ready','true',{timeout:20000});
  await page.getByRole('button',{name:'Explore dinner plate',exact:true}).click();
  const bounds=(await page.locator('canvas').boundingBox())!;
  let found=false;
  for(const y of [.42,.48,.54,.6]) {
    for(const x of [.46,.5,.54,.58]) {
      await page.mouse.move(bounds.x+bounds.width*x,bounds.y+bounds.height*y);
      if(await page.locator('.object-hover-label').textContent()==='Napkin') {
        await page.mouse.click(bounds.x+bounds.width*x,bounds.y+bounds.height*y);
        found=true;break;
      }
    }
    if(found)break;
  }
  expect(found,'The napkin can be selected on the actual 3D surface').toBe(true);
  await expect(page.locator('.table-detail h2')).toHaveText('Napkin');
  await expect(page).toHaveURL(/#napkin$/);
});
