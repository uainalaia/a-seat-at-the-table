import { test, expect } from '@playwright/test';

test('desktop story changes photographic scenes as its actual chapters are reached', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const story = page.locator('[data-story]');
  await expect(story).toHaveAttribute('data-enhanced', 'true', { timeout: 20000 });
  const chapters = page.locator('[data-story-chapter]');
  await expect(chapters).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    await chapters.nth(index).scrollIntoViewIfNeeded();
    await expect(story).toHaveAttribute('data-active', String(index));
    await expect(page.locator('[data-story-count]')).toHaveText(String(index + 1).padStart(2, '0'));
    if (index) await expect.poll(() => page.locator(`[data-story-image="${index}"]`).evaluate(node => parseFloat(getComputedStyle(node).clipPath.match(/inset\(([-.\d]+)/)?.[1] || '100'))).toBeLessThan(1);
  }
  await page.getByRole('link', { name: 'Rehearse the evening', exact: true }).click();
  await expect(page).toHaveURL(/\/practice\/$/);
});

test('motion preference changes restore the complete static story; no-JS has every scene', async ({ page, browser, baseURL }) => {
  await page.goto('/');
  const story = page.locator('[data-story]');
  await expect(story).not.toHaveAttribute('data-enhanced', 'true');
  await expect(page.locator('.story-static-image')).toHaveCount(3);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(story).toHaveAttribute('data-enhanced', 'true', { timeout: 20000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(story).not.toHaveAttribute('data-enhanced', 'true');
  for (const photo of await page.locator('.story-static-image').all()) await expect(photo).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticPage = await context.newPage();
  await staticPage.goto('/');
  await expect(staticPage.locator('.story-chapter')).toHaveCount(3);
  await expect(staticPage.getByRole('heading', { name: 'Room for conversation.', exact: true })).toBeVisible();
  await context.close();
});

test('chapter navigation starts a native view transition and remains usable on back', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/chapters/');
  await page.bringToFront();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await page.evaluate(() => window.addEventListener('pageswap', event => {
    sessionStorage.setItem('qa-view-transition', String(Boolean((event as Event & { viewTransition?: unknown }).viewTransition)));
  }, { once: true }));
  await page.locator('a[data-chapter="reading-the-table"]').click();
  await expect(page.locator('.chapter-cover h1')).toHaveText('Reading the table');
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('qa-view-transition'))).toBe('true');
  await page.goBack();
  await expect(page.locator('chapter-directory')).toBeVisible();
  await page.locator('a[data-chapter="before-you-arrive"]').focus();
  await expect(page.locator('[data-preview="before-you-arrive"]')).toHaveClass('is-active');
});
