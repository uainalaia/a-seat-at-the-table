import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('learning stages persist across routes and identify the active stage',async({page})=>{
  await page.goto('/');
  const journey=page.getByRole('navigation',{name:'Your learning journey'});
  await expect(journey).toHaveCount(1);
  await page.getByRole('button',{name:'Take your seat',exact:true}).click();
  await expect(journey.locator('[aria-current="step"]')).toContainText('Explore');
  for(const [name,route] of [['Explore','/table/'],['Practice','/practice/'],['Reflect','/reflection/'],['Read','/chapters/']]){
    await journey.getByRole('link',{name:new RegExp(`^${name}`)}).click();
    await expect(page).toHaveURL(new RegExp(route));
    await expect(journey.locator('[aria-current="step"]')).toContainText(name);
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await expect(journey).toBeInViewport();
  }
  await expect(page.locator('footer nav')).toHaveCount(0);
  await expect(page.locator('footer a[href="/submission/"]')).toHaveCount(0);
});

test('chapter preview explains the focused chapter and the home moments disclose useful responses',async({page})=>{
  await page.goto('/');
  await page.locator('.directory-list a').nth(3).focus();
  await expect(page.locator('[data-preview-note]:visible')).toHaveCount(1);
  await expect(page.locator('[data-preview-note]:visible')).toContainText('Choose comfortably');
  await page.locator('.moment-questions summary').nth(1).click();
  await expect(page.locator('.moment-questions details[open]')).toContainText('What has your experience been?');
  await expect(page.locator('.moment-questions details[open] a[href="/resources/#carreno"]')).toBeVisible();
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('Carreño has a verified edition, precise chapter locators and contextual quiz explanations',async({page})=>{
  await page.goto('/resources/');
  await expect(page.locator('#carreno a')).toHaveAttribute('href','https://siise.bibliotecanacional.gov.co/BBCC/Documents/View/212');
  await page.goto('/chapters/reading-the-table/');
  await expect(page.locator('#historical-foundation')).toContainText('XII–XV');
  await page.goto('/reflection/');
  for(const [i,answer] of [1,0,2,1,2,0].entries())await page.locator(`#q${i+1} input`).nth(answer).check();
  await page.getByRole('button',{name:'Check my understanding'}).click();
  await expect(page.locator('#q2-feedback')).toContainText('§ XII');
  await expect(page.locator('#q4-feedback')).toContainText('XXXIV–XXXV');
  await expect(page.locator('#q1-feedback')).toContainText('Contemporary reference');
});

test('navigation, expanded map and source feature stay accessible on small screens',async({page})=>{
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:950});
    for(const route of ['/','/table/','/resources/']){
      await page.goto(route);
      if(route==='/table/'){
        await page.getByRole('button',{name:'Use the 2D map',exact:true}).click();
        const pins=page.locator('.flat-setting .table-hotspot');
        await expect(pins).toHaveCount(17);
        for(let index=0;index<17;index++){
          await pins.nth(index).click();
          await expect(pins.nth(index)).toHaveAttribute('aria-pressed','true');
        }
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      expect(audit.violations,`${route} at ${width}`).toEqual([]);
    }
  }
});
