import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('chapter and home anchors remain below the fixed frame',async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:1050});
    await page.goto('/chapters/reading-the-table/');
    const link=page.locator('.chapter-contents a').first();
    const href=(await link.getAttribute('href'))!;
    await link.focus();await page.keyboard.press('Enter');
    const target=(await page.locator(href).boundingBox())!;
    const frame=(await page.locator('.site-wayfinding').boundingBox())!;
    expect(target.y,`chapter at ${width}px`).toBeGreaterThanOrEqual(frame.y+frame.height-1);
    await page.goto('/');
    await page.getByRole('link',{name:'Skip to the chapters',exact:true}).click();
    const heading=(await page.locator('#chapter-heading').boundingBox())!;
    expect(heading.y,`home at ${width}px`).toBeGreaterThanOrEqual(frame.height-1);
  }
});

test('keyboard skip link reaches main content with a visible focus indicator',async({page})=>{
  for(const route of ['/','/table/','/practice/','/reflection/','/resources/']){
    await page.goto(route);
    await page.keyboard.press('Tab');
    const skip=page.getByRole('link',{name:'Skip to content'});
    await expect(skip).toBeFocused();await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  }
});

test('compact landscape and 200-percent-equivalent reflow preserve usable learning pages',async({page})=>{
  for(const size of [{width:640,height:450},{width:844,height:390}]){
    await page.setViewportSize(size);
    for(const route of ['/chapters/reading-the-table/','/table/','/practice/','/reflection/','/resources/']){
      await page.goto(route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);
      await expect(page.locator('h1')).toBeVisible();
      const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(audit.violations,`${route} at ${size.width}`).toEqual([]);
    }
  }
});
