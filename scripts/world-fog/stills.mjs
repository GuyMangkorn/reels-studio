// WFOG-EP01-SHORT stills for QA: one bundle, one browser, --gl=angle, many frames.
// Usage: node scripts/world-fog/stills.mjs --out=DIR [--entry=src/index.ts] [--id=WFOG-EP01-SHORT] [--frames=0,40,108-110,G-G:step]
// Files are named <shot ID>_G<frame>.png (shot from the SS-R3.2 G ranges in src/painted/worldfog/space.ts SHOT_ROWS).
// Labelled previews: --entry=src/painted/worldfog/qa.tsx --id=WFOG-QA (burned-in shot ID, TH time, G and f).
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';

const opt = (name, fallback) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const out = opt('out');
if (!out) throw new Error('--out=DIR is required');
const entry = opt('entry', 'src/index.ts'), id = opt('id', 'WFOG-EP01-SHORT');
const frames = opt('frames', '0').split(',').flatMap((s) => {
  const m = /^(\d+)-(\d+)(?::(\d+))?$/.exec(s);
  if (!m) return [Number(s)];
  const [a, b, step] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 1)];
  return Array.from({length: Math.floor((b - a) / step) + 1}, (_, i) => a + i * step);
});
const rows = [...(await readFile('src/painted/worldfog/space.ts', 'utf8')).matchAll(/\{id: '(S\d\d-SH\d\d[A-Z]?)', g0: (\d+)/g)].map((m) => ({id: m[1], g0: Number(m[2])}));
const shotOf = (G) => [...rows].reverse().find((r) => G >= r.g0)?.id ?? 'S00';
await mkdir(out, {recursive: true});
const t0 = Date.now();
const serveUrl = await bundle({entryPoint: path.resolve(entry)});
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {chromiumOptions});
try {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
  for (const frame of frames) {
    const file = `${out}/${shotOf(frame)}_G${frame}.png`;
    await renderStill({serveUrl, composition, puppeteerInstance: browser, chromiumOptions, frame, output: file, imageFormat: 'png'});
    console.log(file);
  }
} finally {
  await browser.close({silent: true});
}
console.log(`done ${frames.length} stills in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
