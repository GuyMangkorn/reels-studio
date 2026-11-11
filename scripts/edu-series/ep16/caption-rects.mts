// EDU-EP14 caption rectangles (R4.3): for each shot and each of 12/50/88 % of its length where a caption shows, the compact quiet patch rectangle
// from src/painted/edu14/quiet.ts (text widths measured in Chrome with the caption font, as QuietPatches does), as JSON for caption-zone.py:
//   npx tsx scripts/edu-series/ep16/caption-rects.mts > out/qa/edu-ep16/cap/rects.json
import {openBrowser} from '@remotion/renderer';
import {pathToFileURL} from 'node:url';
const un = <T,>(m: T): T => ((m as {default?: T}).default ?? m);
const {SHOT_TABLE} = un(await import('../../../src/painted/edu16/clock'));
const {QUIET, quietRect} = un(await import('../../../src/painted/edu14/quiet'));
const {EDU16_CUES} = un(await import('../../../src/videos/edu-ep16/cues'));

const browser = await openBrowser('chrome');
const page = await browser.newPage({context: {} as never, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: undefined, onLog: () => {}});
const font = pathToFileURL('public/fonts/NotoSansThai.ttf'.replace(/^/, process.cwd() + '/')).href;
import {writeFileSync} from 'node:fs';
writeFileSync('out/qa/edu-ep16/cap/blank.html', '<html></html>');
await page.goto({url: pathToFileURL(process.cwd() + '/out/qa/edu-ep16/cap/blank.html').href, timeout: 15000, options: {}} as never);
await page.evaluate(async (family, url, w, px) => {
  const f = new FontFace(family, `url(${url})`, {weight: '100 900'});
  await f.load(); document.fonts.add(f);
  await document.fonts.load(`${w} ${px}px "${family}"`, 'ก');
}, QUIET.family, font, QUIET.weight, QUIET.font);
const width = async (line: string): Promise<number> => page.evaluate((t, family, px, w) => { const c = document.createElement('canvas').getContext('2d')!; c.font = `${w} ${px}px "${family}"`; return c.measureText(t).width; }, line, QUIET.family, QUIET.font, QUIET.weight);
const out: {shot: string; f: number; L: number; cue: string; x0: number; x1: number; y0: number; y1: number; lines: number}[] = [];
// R1 (F16): only frames where the text is fully on (cue.from + 3 .. cue.to - 3, so not the fade edges), 5 samples per shot and cue overlapping it (10/30/50/70/90 % of that span, deduplicated).
const seen = new Set<string>();
for (const [id, start, len] of SHOT_TABLE) for (const cue of EDU16_CUES.filter((c) => c.text && c.from < start + len && c.to > start)) for (const p of [0.1, 0.3, 0.5, 0.7, 0.9]) {
  const a = Math.max(start, cue.from + 3), b = Math.min(start + len - 1, cue.to - 4);
  if (b < a) continue;
  const f = Math.round(a + (b - a) * p), L = f - start, key = `${id}:${L}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const widths = new Map<string, number>(); for (const l of cue.text.split('\n')) widths.set(l, await width(l));
  const r = quietRect(cue.text, (l) => widths.get(l)!);
  const lh = QUIET.font * 1.65, textH = r.lines * lh;
  out.push({shot: id, f, L, cue: cue.id, x0: Math.round(540 - (r.w - 2 * QUIET.pad) / 2), x1: Math.round(540 + (r.w - 2 * QUIET.pad) / 2), y0: Math.round(QUIET.bottom - textH), y1: QUIET.bottom, lines: r.lines});
}
console.log(JSON.stringify(out, null, 1));
await browser.close(true, 'info' as never).catch(() => {});
