// Measures Thai caption text width in Chrome (Noto Sans Thai 700, 14 px stroke not included). Usage (Node 22): node scripts/edu-series/ep26/short/caption-width.mjs FONT_PX TEXT... -> JSON [[text, px]]. Box x120-888 centred at 540 allows 696 px incl. stroke.
import {openBrowser} from '@remotion/renderer';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
const [size, ...texts] = process.argv.slice(2);
const html = path.resolve('out/ep26-cap/m.html');
writeFileSync(html, `<style>@font-face{font-family:NT;src:url(file://${path.resolve('public/fonts/NotoSansThai.ttf')});font-weight:100 900}span{font:700 ${size}px NT;white-space:pre;-webkit-text-stroke:14px #000;paint-order:stroke fill;position:absolute}</style><body></body>`);
const browser = await openBrowser('chrome', {chromiumOptions: {gl: 'angle'}});
const page = await browser.newPage({context: () => null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {}});
await page.goto({url: 'file://' + html, timeout: 20000});
const out = await page.evaluate(async (texts) => { await document.fonts.load('700 50px NT','ก'); const r = []; for (const t of texts) { const s = document.createElement('span'); s.textContent = t; document.body.appendChild(s); r.push([t, Math.round(s.getBoundingClientRect().width)]); } return r; }, texts);
console.log(JSON.stringify(out));
await browser.close({silent: true});
