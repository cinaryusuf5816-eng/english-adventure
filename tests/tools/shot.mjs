import { chromium } from 'playwright-core';
const [,, base, out, ...routes] = process.argv;
const w = Number(process.env.W || 1366), hgt = Number(process.env.H || 768);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: w, height: hgt } });
const errs = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('requestfailed', r => errs.push('reqfail: ' + r.url()));
for (const r of routes) {
  await page.goto(base + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const name = r.replace(/[^a-z0-9]+/gi, '_') || 'home';
  await page.screenshot({ path: `${out}/${name}_${w}.png`, fullPage: process.env.FULL === '1' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(r, 'overflowX=', overflow);
}
console.log(errs.join('\n') || 'no console errors');
await browser.close();
