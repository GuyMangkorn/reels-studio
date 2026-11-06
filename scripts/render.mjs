// Usage: node scripts/render.mjs <CompositionId>... [--stills] [--frames=90,210] [--endings=A_fade,B_loop,C_seamless]
//        [--gl=angle|egl|swiftshader|swangle|vulkan|angle-egl] [--timeout=<ms per frame>] [--concurrency=<n, default 4>]
//        [--covers] [--preview] [--draft] [--range=<from>-<to>] [--no-cache] [--keep-pinned | --repaint=<shot,...|all>]
// Without --endings, only the ending selected in the episode registry (VideoDefinition.ending) is rendered.
// ANGLE is the default; --gl overrides it. Painted episodes may need --timeout=180000 for heavy frames.
// Per-run backend, stage/cache timing and result: out/logs/render-*.jsonl (printed on start and finish).
// Videos render one scene at a time and keep each scene in the asset store (scripts/segments.mjs): a later render
// re-renders only the scenes whose inputs changed. --no-cache renders every scene again.
// --preview: half-size quick look (output and p5.brush canvas) in out/<id>/preview/, not archived; not for line-weight review.
// --draft: blocking draft, full size, scene-cached, in out/<id>/draft/, not archived (same flat fills as a final since 6 Nov 2026).
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
// Cover candidates (docs/cover-principles.md): a delivery render of <id> also renders `<id>-COVERS`, when registered
// (src/videos/covers/), as stills into out/<id>/covers/ (scene frame 15 of each 1 s scene, named <id>_cover-A.png ...),
// so they are archived beside the MP4. --covers renders only those stills, for a deliverable rendered earlier.
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
import {withRenderLog} from './render-log.mjs';

const {ids, stills, covers: coversOnly, frames, endings: requestedEndings, gl, timeoutInMilliseconds, concurrency, preview, draft, noCache, range, keepPinned, repaint} = parseRenderArgs(process.argv.slice(2));
if (!ids.length) throw new Error('Name at least one composition ID, e.g. npm run render -- CATBOX-C01-Short');

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const chromiumOptions = gl ? {gl} : {};
const shared = {browserExecutable, chromiumOptions, timeoutInMilliseconds};
const scale = preview ? 0.5 : 1;
const renderProps = {...(preview ? {paintScale: 0.5} : {}), ...(draft ? {paintDraft: true} : {})};
await withRenderLog({tool: 'render', ids, gl, stills, draft, preview, range, concurrency, scale}, async (metrics) => {
const serveUrl = await metrics.time('bundle', () => bundle({entryPoint: path.resolve('src/index.ts')}));
const browser = await metrics.time('browser', () => openBrowser('chrome', {browserExecutable, chromiumOptions}));
try {
  for (const id of ids) {
    const dir = `out/${id}`;
    await mkdir(dir, {recursive: true});
    const renderCovers = async (id) => {
      const covers = await selectComposition({serveUrl, id: `${id}-COVERS`, puppeteerInstance: browser, ...shared}).catch(() => null);
      if (!covers) return;
      await mkdir(`${dir}/covers`, {recursive: true});
      const coverFrames = Array.from({length: Math.floor(covers.durationInFrames / covers.fps)}, (_, i) => i * covers.fps + 15);
      await metrics.time('covers', () => renderStills({serveUrl, composition: covers, inputProps: {}, puppeteerInstance: browser, ...shared, frames: coverFrames,
        outputFor: (frame) => `${dir}/covers/${id}_cover-${String.fromCharCode(65 + Math.floor(frame / covers.fps))}.png`}), {id});
      console.log(`Covers ${id}: ${coverFrames.length} stills in ${dir}/covers/`);
    };
    if (coversOnly) {
      await renderCovers(id);
      continue;
    }
    if (stills) {
      // --draft reaches stills too (a draft still used to be painted at final grade); --preview stays out: stills are full size.
      const stillProps = draft ? {paintDraft: true} : {};
      const composition = await selectComposition({serveUrl, id, inputProps: stillProps, puppeteerInstance: browser, ...shared});
      await mkdir(`${dir}/stills`, {recursive: true});
      metrics.event('composition', {id, width: composition.width, height: composition.height, fps: composition.fps, frames});
      await metrics.time('stills', () => renderStills({serveUrl, composition, inputProps: stillProps, puppeteerInstance: browser, ...shared, frames, outputFor: (frame) => `${dir}/stills/${frame}.png`, onStill: (frame) => console.log(`Checked ${id} frame ${frame}`)}), {id});
      continue;
    }
    const endings = endingsFor(requestedEndings, (await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared})).props);
    const outDir = range ? `${dir}/range` : preview ? `${dir}/preview` : draft ? `${dir}/draft` : dir;
    await mkdir(outDir, {recursive: true});
    for (const ending of endings) {
      const inputProps = {ending, ...renderProps};
      const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared, inputProps});
      metrics.event('composition', {id, ending, width: composition.width, height: composition.height, fps: composition.fps, frames: composition.durationInFrames});
      const output = `${outDir}/${id}_${ending}${range ? `${draft ? '_draft' : ''}${preview ? '_preview' : ''}_f${range[0]}-${range[1]}` : ''}.mp4`;
      const render = {serveUrl, composition, puppeteerInstance: browser, ...shared, scale, concurrency, inputProps};
      if (noCache) {
        let last = -1;
        await metrics.time('uncached', () => renderMedia({...render, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, ...(range ? {frameRange: range} : {}), outputLocation: output,
          onProgress: ({progress}) => {const percent = Math.floor(progress * 10) * 10; if (percent !== last) {console.log(`${id} ${ending}: ${percent}%`); last = percent;}}
        }), {id, ending});
      } else {
        await renderSegmented({render, options: {gl, scale, crf: 18}, workDir: `${dir}/segments-work`, output, frameRange: range, pinOptions: {keep: keepPinned, repaint}, metrics, log: (line) => console.log(`${id} ${ending}: ${line}`)});
      }
      console.log(`Exported ${output}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`);
      console.log(`Loudness ${output}: ${describeLoudness(await metrics.time('loudness', () => normalizeLoudness(output), {id, output}))}`);
      if (ending === endings.at(-1)) await copyFile(output, `${outDir}/${id}.mp4`);
    }
    if (preview || draft || range) continue;
    await renderCovers(id);
    try {
      const archived = await metrics.time('archive', () => {
        const result = spawnSync('python3', ['-I', 'scripts/store.py', 'archive', id], {encoding: 'utf8'});
        if (result.status !== 0) {
          const error = new Error(result.error?.message ?? result.stderr?.trim() ?? `archive exited ${result.status}`);
          error.exitCode = result.status;
          throw error;
        }
        return result;
      }, {id});
      console.log(`Archive ${id}: ${archived.stdout.trim()}`);
    } catch (error) {
      metrics.event('warning', {id, stage: 'archive', exitCode: error.exitCode, error: String(error.message ?? error)});
      console.log(`WARNING archive failed for ${id}: ${error.message ?? error}`);
    }
  }
} finally {await metrics.time('browser-close', () => browser.close({silent: true}));}
});
