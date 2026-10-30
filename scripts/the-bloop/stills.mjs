// BLOOP-EP01-SHORT plate QA stills (Boss, DEP01). Bundles one spike entry once, then renders each requested frame as a
// direct seek (fresh still per frame, --gl=angle as docs/boss-asset-workflow.md requires) into <out>/<ID>_f<frame>.png.
// Usage: node scripts/the-bloop/stills.mjs <outDir> <ID>@<f1,f2,...> [<ID>@<frames> ...] [--entry=src/painted/spike/bloop-plates-index.ts]
//        node scripts/the-bloop/stills.mjs <outDir> --seq=<ID>@<start>-<end>   (sequential PNG run, for seek parity)
// Logs and frames stay under out/ (git-ignored). Set BROWSER_EXECUTABLE to use an installed Chromium.
import {bundle} from '@remotion/bundler';
import {openBrowser, renderFrames, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=') ?? fallback;
const [outDir, ...tasks] = args.filter((a) => !a.startsWith('--'));
const entry = flag('entry', 'src/painted/spike/bloop-plates-index.ts');
const seq = flag('seq', null);
if (!outDir || (tasks.length === 0 && !seq)) throw new Error('usage: stills.mjs <outDir> <ID>@<frames> ... | --seq=<ID>@<start>-<end>');
const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;

await mkdir(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve(entry)});
const browser = await openBrowser('chrome', {browserExecutable});
const chromiumOptions = {gl: 'angle'};
try {
  if (seq) {
    const [id, range] = seq.split('@');
    const [start, end] = range.split('-').map(Number);
    const composition = await selectComposition({serveUrl, id, browserInstance: browser, browserExecutable});
    await renderFrames({serveUrl, composition, browserInstance: browser, browserExecutable, chromiumOptions, imageFormat: 'png', frameRange: [start, end], outputDir: outDir});
    console.log(`sequence ${id} frames ${start}-${end} -> ${outDir}`);
  } else {
    for (const task of tasks) {
      const [id, list] = task.split('@');
      const composition = await selectComposition({serveUrl, id, browserInstance: browser, browserExecutable});
      for (const frame of list.split(',').map(Number)) {
        const output = path.join(outDir, `${id}_f${frame}.png`);
        await renderStill({serveUrl, composition, browserInstance: browser, browserExecutable, chromiumOptions, frame, output, imageFormat: 'png'});
        console.log(`still ${output}`);
      }
    }
  }
} finally {
  await browser.close({silent: true});
}
