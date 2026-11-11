// Regenerate original scene artwork against the current production preview.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4321';
const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',headless:true});
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await mkdir('.qa/redesign',{recursive:true});
  await page.goto(base);
  await page.locator('.room-canvas.is-ready').waitFor({timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  const sceneOnly={style:'.room-shade,.room-invitation,.room-orientation,.room-view-controls,.room-caption,.invitation-bottom,.object-hover-label,.object-pin { display: none !important; }'};
  let buffer = await page.locator('.room-canvas').screenshot(sceneOnly);
  await sharp(buffer).resize(1440,1000,{fit:'cover'}).webp({quality:88}).toFile('public/images/dining-room-poster.webp');
  await sharp(buffer).resize(600,740,{fit:'cover',position:'right'}).webp({quality:88}).toFile('public/images/dining-room.webp');
  await page.screenshot({path:'.qa/redesign/home-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Take your seat',exact:true}).click();
  for (const [index,name] of [[2,'fork'],[7,'water']]) {
    const control=page.locator('.table-item-list button').nth(index);
    await control.focus();await page.keyboard.press('Enter');
    await page.locator(`.room-canvas[data-camera="item-${index}"][data-moving="false"]`).waitFor();
    buffer=await page.locator('.room-canvas').screenshot(sceneOnly);
    await sharp(buffer).resize(600,740,{fit:'cover'}).webp({quality:88}).toFile(`public/images/dining-${name}.webp`);
  }
  console.log('Four original dining-room stills generated.');
} finally { await browser.close(); }
