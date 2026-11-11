import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/chapters/', '/chapters/before-you-arrive/', '/chapters/taking-your-seat/', '/chapters/reading-the-table/', '/chapters/ordering-with-confidence/', '/chapters/conversation-and-courtesy/', '/chapters/closing-the-meal/', '/table/', '/practice/', '/reflection/', '/resources/', '/submission/'];

test('every route loads without browser errors, overflow, or serious accessibility violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(audit.violations, route).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('all seventeen table items work by keyboard and touch-compatible buttons', async ({ page }) => {
  await page.goto('/table/');
  await expect(page.getByRole('group', { name: 'Choose a table element' })).toBeVisible();
  const tableAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(tableAudit.incomplete.filter(item => item.id === 'aria-prohibited-attr')).toEqual([]);
  const buttons = page.locator('.table-item-list button');
  await expect(buttons).toHaveCount(17);
  for (let i = 0; i < 17; i++) {
    await buttons.nth(i).focus();
    await page.keyboard.press('Enter');
    await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.table-detail h2')).toContainText((await buttons.nth(i).innerText()).replace(/^\d+\s*/, ''));
  }
  await page.getByRole('button', { name: 'Explore dinner plate', exact: true }).click();
  await expect(page.locator('.table-detail h2')).toHaveText('Dinner plate');
});

test('dinner choices, explanations, score, focus, and replay work', async ({ page }) => {
  await page.goto('/practice/');
  for (const answer of [0, 1, 2, 0, 1, 2]) {
    await page.locator('.dinner-option').nth(answer).click();
    await expect(page.locator('.dinner-feedback')).toContainText('A thoughtful choice.');
    await page.getByRole('button', { name: /Continue the evening|Reflect on the evening/ }).click();
    await expect(page.locator('.dinner-scene > h2')).toBeFocused();
  }
  await expect(page.locator('.dinner-score')).toHaveText('6 of 6 recommended choices');
  await expect(page.locator('.dinner-review > li')).toHaveCount(6);
  await page.getByRole('button', { name: 'Try the evening again' }).click();
  await expect(page.locator('.scene-position')).toHaveText('Decision 1 of 6');
  await page.locator('.dinner-option').nth(2).click();
  await expect(page.locator('.dinner-feedback')).toContainText('A more considerate approach:');
});

test('survey handles missing answers, evaluates, clears, and sends no responses', async ({ page }) => {
  await page.goto('/reflection/');
  const sent: string[] = [];
  page.on('request', request => { if (request.method() !== 'GET') sent.push(request.url()); });
  await expect(page.locator('fieldset')).toHaveCount(10);
  await page.getByRole('button', { name: 'Check my understanding' }).click();
  await expect(page.locator('.form-message')).toBeFocused();
  await expect(page.locator('.form-message a')).toHaveCount(6);
  await page.locator('#q1 input').nth(1).check();
  await expect(page.locator('#knowledge-progress')).toHaveAttribute('value', '1');
  await expect(page.locator('.form-message a')).toHaveCount(5);
  await expect(page.locator('fieldset[aria-invalid="true"]')).toHaveCount(5);
  await expect(page.locator('#q2 input').first()).toHaveAttribute('aria-describedby', 'q2-error');
  await page.locator('.form-message a').first().click();
  await expect(page.locator('#q2-option-0')).toBeFocused();
  const errorAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(errorAudit.violations).toEqual([]);
  for (const [i, answer] of [0, 2, 1, 2, 0].entries()) await page.locator(`#q${i + 2} input`).nth(answer).check();
  await expect(page.locator('.form-message')).toHaveCount(0);
  await page.locator('#q9 textarea').fill('I will ask thoughtful questions and include others.');
  await page.getByRole('button', { name: 'Check my understanding' }).click();
  await expect(page.locator('.survey-summary')).toContainText('6 of 6');
  await expect(page.locator('.survey-summary')).toBeFocused();
  await page.getByRole('button', { name: 'Clear my answers' }).click();
  await expect(page.locator('input:checked')).toHaveCount(0);
  await expect(page.locator('#knowledge-progress')).toHaveAttribute('value', '0');
  await expect(page.locator('#q9 textarea')).toHaveValue('');
  expect(sent).toEqual([]);
});

test('chapter previews follow keyboard focus and the reading index reaches its section', async ({ page }) => {
  await page.goto('/chapters/');
  const chapter = page.locator('chapter-directory a[data-chapter="reading-the-table"]');
  await chapter.focus();
  await expect(page.locator('[data-preview="reading-the-table"]')).toHaveClass('is-active');
  await page.keyboard.press('Enter');
  await expect(page.locator('.chapter-cover h1')).toHaveText('Reading the table');
  const section = page.getByRole('navigation', { name: 'On this page' }).getByRole('link').first();
  const fragment = await section.getAttribute('href');
  await section.click();
  await expect(page.locator(fragment!)).toBeInViewport();
});

test('mobile reference link stays available and contextual shortcuts open without JavaScript', async ({ page, browser, baseURL }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('navigation',{name:'Reference library',exact:true}).getByRole('link',{name:'Resources',exact:true}).click();
  await expect(page).toHaveURL(/\/resources\/$/);
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const staticPage = await context.newPage();
  await staticPage.goto('/');
  const moment = staticPage.locator('.moment-questions details').nth(1);
  await moment.locator('summary').click();
  await expect(moment.getByRole('link', { name: 'Learn to include the table' })).toBeVisible();
  await context.close();
});

test('mobile layouts and learning links work at each acceptance width', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/table/', '/practice/', '/reflection/', '/resources/']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} at ${width}`).toBe(true);
    }
    if (width <= 768) {
      await page.getByRole('navigation',{name:'Your learning journey',exact:true}).getByRole('link', { name: /^Explore/ }).click();
      await expect(page).toHaveURL(/\/table\/$/);
    }
  }
});

test('educational content and all questions remain readable with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('/chapters/reading-the-table/');
  await expect(page.getByRole('heading', { name: 'Let the menu explain the utensils' })).toBeVisible();
  await page.goto('/reflection/');
  await expect(page.locator('fieldset')).toHaveCount(10);
  await page.goto('/table/');
  await page.getByText('Read the complete table guide', { exact: true }).click();
  await expect(page.locator('dl > div')).toHaveCount(17);
  await expect(page).toHaveURL(new URL('/table/', baseURL).href);
  await context.close();
});

test('submission rejects local URLs and prints all six fields on one A4 page', async ({ page }, testInfo) => {
  await page.goto('/submission/');
  const url = page.getByLabel('Your website’s URL');
  const current = new URL(page.url());
  if (['localhost', '127.0.0.1', '[::1]'].includes(current.hostname) || current.protocol !== 'https:') {
    await expect(url).toHaveValue('');
    await expect(page.locator('#url-help')).toContainText('Publication pending');
  }
  await page.evaluate(() => { window.print = () => document.documentElement.setAttribute('data-print-requested', 'true'); });
  for (const value of ['', 'http://example.edu/', 'https://127.0.0.1:4321/', 'https://localhost/']) {
    await url.fill(value);
    await page.getByRole('button', { name: 'Print / save as PDF' }).click();
    await expect(url).toBeFocused();
    await expect(url).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#url-error')).toBeVisible();
    await expect(page.locator('html')).not.toHaveAttribute('data-print-requested', 'true');
  }
  const invalidAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(invalidAudit.violations).toEqual([]);
  await url.fill('https://example.edu/dining/');
  await expect(page.locator('#url-error')).toBeHidden();
  await page.getByRole('button', { name: 'Print / save as PDF' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-print-requested', 'true');
  await expect(page.locator('.submission-print-value')).toHaveCount(6);
  const values = await page.locator('.submission-print-value').allTextContents();
  expect(values).toContain('Omar Quispe Avalos');
  expect(values).toContain('https://example.edu/dining/');
  expect(values.join(' ')).toContain('Western Michigan University');
  expect(values.join(' ')).toContain('two open reflections');
  const pdf = await page.pdf({ path: testInfo.outputPath('submission-a4.pdf'), format: 'A4', preferCSSPageSize: true, printBackground: true });
  expect(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)).toHaveLength(1);
});
