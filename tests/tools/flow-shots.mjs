// Dev helper: opens each practice type and saves screenshots (not part of the test suite).
import { chromium } from 'playwright-core';
const [,, base, out] = process.argv;
const W = Number(process.env.W || 1366), H = Number(process.env.H || 768);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errs = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
const banks = (process.env.BANKS || 'mcq,jumbled,fill,change,fix,decide,dialogue,reading').split(',');
for (const b of banks) {
  await page.goto(`${base}#/week/week-01/practise/${b}`, { waitUntil: 'networkidle' });
  await page.click('button[type=submit]');
  await page.waitForSelector('.question-card');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/q_${b}_${W}.png`, fullPage: process.env.FULL === '1' });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(b, 'overflowX=', ov);
}
for (const r of (process.env.ROUTES || '').split(',').filter(Boolean)) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/r_${r.replace(/[^a-z0-9]+/gi, '_')}_${W}.png`, fullPage: process.env.FULL === '1' });
}
console.log(errs.join('\n') || 'no console errors');
await browser.close();
