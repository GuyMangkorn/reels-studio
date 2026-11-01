// Usage: node scripts/render.mjs <CompositionId>... [--stills] [--frames=90,210] [--endings=A_fade,B_loop,C_seamless]
//        [--gl=angle|egl|swiftshader|swangle|vulkan|angle-egl] [--timeout=<ms per frame>] [--concurrency=<n, default 4>]
//        [--preview] [--draft] [--range=<from>-<to>] [--no-cache] [--keep-pinned | --repaint=<shot,...|all>]
// Without --endings, only the ending selected in the episode registry (VideoDefinition.ending) is rendered.
// Painted (p5.brush) or WebGL episodes: --gl=angle --timeout=180000, so a slow frame does not stall at the 30 s default.
// Videos render one scene at a time and keep each scene in the asset store (scripts/segments.mjs): a later render
// re-renders only the scenes whose inputs changed. --no-cache renders every scene again.
// --preview: half-size quick look (output and p5.brush canvas) in out/<id>/preview/, not archived; not for line-weight review.
// --draft: blocking draft (textured fills as flat washes, no hatching), full size, scene-cached, in out/<id>/draft/, not archived.
// --range=<from>-<to>: those frames only, in out/<id>/range/, not archived. The whole scenes they touch are rendered
// into the scene cache first, so a later full render reuses them.
// Pinned finals (scripts/pin.mjs): a render stops when a pinned scene would change; --keep-pinned reuses the approved
// segment, --repaint=<shot,...|all> renders it again and unpins it for a new review.
// Measurements: docs/dev-findings/DF-20261031-render-speed.md.
// Each run bundles into its own temp directory, lets Remotion pick a free port and writes only under
// out/<CompositionId>/, so renders of different videos can run at the same time.
// Each exported MP4 is loudness-normalized in place (scripts/loudness.mjs) and its before/after levels are logged.
// After the MP4s are exported, out/<CompositionId>/ is copied into the asset store ($REELS_STORE, default
// ~/ReelsStore/projects/<PROJECT>/renders/<CompositionId>/<commit>/) by scripts/store.py archive, outside every worktree.
// Set BROWSER_EXECUTABLE to use an installed Chromium instead of Remotion's download.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia} from '@remotion/renderer';
import {renderStills} from './stills.mjs';
import path from 'node:path';
import {mkdir, copyFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {describeLoudness, normalizeLoudness} from './loudness.mjs';
import {endingsFor, parseRenderArgs} from './render-options.mjs';
import {renderSegmented} from './segments.mjs';

const {ids, stills, frames, endings: requestedEndings, gl, timeoutInMilliseconds, concurrency, preview, draft, noCache, range, keepPinned, repaint} = parseRenderArgs(process.argv.slice(2));
if (!ids.length) throw new Error('Name at least one composition ID, e.g. npm run render -- CATBOX-C01-Short');

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const chromiumOptions = gl ? {gl} : {};
const shared = {browserExecutable, chromiumOptions, timeoutInMilliseconds};
const scale = preview ? 0.5 : 1;
const renderProps = {...(preview ? {paintScale: 0.5} : {}), ...(draft ? {paintDraft: true} : {})};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
try {
  for (const id of ids) {
    const dir = `out/${id}`;
    await mkdir(dir, {recursive: true});
    if (stills) {
      // --draft reaches stills too (a draft still used to be painted at final grade); --preview stays out: stills are full size.
      const stillProps = draft ? {paintDraft: true} : {};
      const composition = await selectComposition({serveUrl, id, inputProps: stillProps, puppeteerInstance: browser, ...shared});
      await mkdir(`${dir}/stills`, {recursive: true});
      await renderStills({serveUrl, composition, inputProps: stillProps, puppeteerInstance: browser, ...shared, frames, outputFor: (frame) => `${dir}/stills/${frame}.png`, onStill: (frame) => console.log(`Checked ${id} frame ${frame}`)});
      continue;
    }
    const endings = endingsFor(requestedEndings, (await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared})).props);
    const outDir = range ? `${dir}/range` : preview ? `${dir}/preview` : draft ? `${dir}/draft` : dir;
    await mkdir(outDir, {recursive: true});
    for (const ending of endings) {
      const inputProps = {ending, ...renderProps};
      const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared, inputProps});
      const output = `${outDir}/${id}_${ending}${range ? `${draft ? '_draft' : ''}${preview ? '_preview' : ''}_f${range[0]}-${range[1]}` : ''}.mp4`;
      const render = {serveUrl, composition, puppeteerInstance: browser, ...shared, scale, concurrency, inputProps};
      if (noCache) {
        let last = -1;
        await renderMedia({...render, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, ...(range ? {frameRange: range} : {}), outputLocation: output,
          onProgress: ({progress}) => {const percent = Math.floor(progress * 10) * 10; if (percent !== last) {console.log(`${id} ${ending}: ${percent}%`); last = percent;}}
        });
      } else {
        await renderSegmented({render, options: {gl, scale, crf: 18}, workDir: `${dir}/segments-work`, output, frameRange: range, pinOptions: {keep: keepPinned, repaint}, log: (line) => console.log(`${id} ${ending}: ${line}`)});
      }
      console.log(`Exported ${output}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`);
      console.log(`Loudness ${output}: ${describeLoudness(await normalizeLoudness(output))}`);
      if (ending === endings.at(-1)) await copyFile(output, `${outDir}/${id}.mp4`);
    }
    if (preview || draft || range) continue;
    const archived = spawnSync('python3', ['-I', 'scripts/store.py', 'archive', id], {encoding: 'utf8'});
    console.log(archived.status === 0 ? `Archive ${id}: ${archived.stdout.trim()}` : `WARNING archive failed for ${id}: ${archived.stderr.trim()}`);
  }
} finally {await browser.close({silent: true});}
