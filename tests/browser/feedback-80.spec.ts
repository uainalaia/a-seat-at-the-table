import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('header provides resources without duplicating the four learning stages',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});await page.goto('/');
    const header=page.locator('.site-header');
    await expect(header.getByRole('link')).toHaveCount(2);
    await expect(header.getByRole('link',{name:'Resources',exact:true})).toBeVisible();
    expect(await header.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    await expect(page.getByRole('navigation',{name:'Your learning journey'}).getByRole('link')).toHaveCount(4);
  }
});

test('chapter descriptions are centered beneath their illustrations on both directory routes',async({page})=>{
  for(const width of [390,1440])for(const route of ['/','/chapters/']){
    await page.setViewportSize({width,height:1050});await page.goto(route);
    for(let i=0;i<6;i++){
      await page.locator('.directory-list a').nth(i).focus();
      const note=page.locator('[data-preview-note]:visible');
      await expect(note).toHaveCSS('text-align','center');
      const a=(await note.boundingBox())!,b=(await page.locator('.directory-gallery').boundingBox())!;
      expect(Math.abs(a.x+a.width/2-(b.x+b.width/2))).toBeLessThan(2);
    }
  }
});

test('resource index stays in view and every section anchor clears the fixed navigation',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1050});await page.goto('/resources/');
    const index=page.locator('.resource-index');
    for(const id of ['watch','educational-sources','resource-context','carreno-foundation']){
      await index.locator(`a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(index).toBeInViewport();
      await expect(index.locator('[aria-current="location"]')).toHaveAttribute('href',`#${id}`);
      const target=(await page.locator(`#${id}`).boundingBox())!;
      const obstruction=width<=1100?(await index.boundingBox())!:(await page.locator('.site-wayfinding').boundingBox())!;
      expect(target.y,`${width}px: #${id} must clear navigation`).toBeGreaterThanOrEqual(obstruction.y+obstruction.height-2);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
  }
});

test('resources and its index remain usable without JavaScript',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL,viewport:{width:390,height:1050}});
  const page=await context.newPage();await page.goto('/resources/');
  await page.locator('.resource-index a[href="#educational-sources"]').click();
  await expect(page.locator('#educational-sources')).toBeInViewport();
  await expect(page.locator('.resource-index')).toBeInViewport();
  await expect(page.locator('.resource-list>li')).toHaveCount(7);
  await expect(page.locator('.watch-lesson')).toHaveCount(6);
  await context.close();
});
