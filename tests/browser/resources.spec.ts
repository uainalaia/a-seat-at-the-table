import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('video lessons load only on request, stop on close, and keep source links',async({page})=>{
  const videoRequests:string[]=[];
  await page.route('https://www.youtube-nocookie.com/**',route=>{
    videoRequests.push(route.request().url());
    return route.fulfill({contentType:'text/html',body:'<html lang="en"><title>Player test double</title><body><p>Player loaded</p></body></html>'});
  });
  await page.goto('/resources/');
  const lessons=page.locator('.video-lesson');
  await expect(lessons).toHaveCount(6);
  expect(videoRequests).toEqual([]);
  for(let index=0;index<6;index++){
    const lesson=lessons.nth(index);
    await lesson.locator('summary').focus();await page.keyboard.press('Enter');
    await expect(lesson.locator('iframe')).toHaveAttribute('src',/youtube-nocookie\.com\/embed\//);
    await expect(lesson.getByRole('link',{name:'Open on YouTube',exact:true})).toHaveAttribute('href',/^https:\/\/www\.youtube\.com\/watch\?v=/);
    await expect(lesson.getByRole('link',{name:'Watch on the publisher’s page'})).toHaveAttribute('href',/^https:\/\/emilypost.com\//);
    await lesson.locator('summary').press('Enter');
    await expect(lesson.locator('iframe')).not.toHaveAttribute('src',/.+/);
  }
  expect(videoRequests).toHaveLength(6);
  await page.locator('.resource-credits summary').click();
  await expect(page.locator('.resource-credits')).toContainText('AI-generated editorial illustration');
  await expect(page.locator('.resource-credits')).toContainText('original instructional graphics');
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
});

test('video sources and reading references remain available without JavaScript',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});
  const page=await context.newPage();await page.goto('/resources/');
  await expect(page.locator('.lesson-links a')).toHaveCount(12);
  await expect(page.locator('.resource-list>li')).toHaveCount(7);
  await page.locator('.video-lesson summary').first().click();
  await expect(page.getByRole('link',{name:'Watch on the publisher’s page'}).first()).toBeVisible();
  await context.close();
});
