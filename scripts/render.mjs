// Usage: node scripts/render.mjs <CompositionId>... [--stills] [--frames=90,210] [--endings=A_fade,B_loop,C_seamless]
//        [--gl=angle|egl|swiftshader|swangle|vulkan|angle-egl] [--timeout=<ms per frame>] [--concurrency=<n, default 4>]
//        [--covers] [--draft] [--preview = --draft] [--range=<from>-<to>] [--no-cache] [--keep-pinned | --repaint=<shot,...|all>]
// Without --endings, only the ending selected in the episode registry (VideoDefinition.ending) is rendered.
// ANGLE is the default; --gl overrides it. Painted episodes may need --timeout=180000 for heavy frames.
// Per-run backend, stage/cache timing and result: out/logs/render-*.jsonl (printed on start and finish).
// Videos render one scene at a time and keep each scene in the asset store (scripts/segments.mjs): a later render
// re-renders only the scenes whose inputs changed. --no-cache renders every scene again.
// --draft: half-size draft (paintScale 0.5 + paintDraft), scene-cached under its own variant (shared with the
// storyboard page's draft cut, clips.mjs --full --draft), in out/<id>/draft/, not archived, never reused for delivery;
// not for line-weight review. --preview is the same render under its old name.
// --range=<from>-<to>: those frames only, in out/<id>/range/, not archived. The whole scenes they touch are rendered
// into the scene cache first, so a later full render reuses them.
// Pinned finals (scripts/pin.mjs): a render stops when a pinned scene would change; --keep-pinned reuses the approved
// segment, --repaint=<shot,...|all> renders it again and unpins it for a new review.
// Delivery gate (docs/render-rules.md#render-stage): a delivery render (no --range, --draft, --stills or --covers)
// stops before painting while any scene of the ending is unpinned, unless --rows=<review-rows.json> shows every
// shot's draft passed (storyboard-page/verdicts.py --drafts-passed): that render is the file the Final tab shows, and
// its path is written to the rows as finalCut. After the user passes it, pin.mjs pin-rows pins every scene.
// --unreviewed="<reason>" renders anyway, only after the user chose to skip the review; the reason is logged.
// Measurements: docs/dev-findings/DF-20261031-render-speed.md.
// Each run bundles into its own temp directory, lets Remotion pick a free port and writes only under
// out/<CompositionId>/, so renders of different videos can run at the same time.
// Each exported MP4 is loudness-normalized in place (scripts/loudness.mjs) and its before/after levels are logged.
// After the MP4s are exported, out/<CompositionId>/ is copied into the asset store ($REELS_STORE, default
// ~/ReelsStore/projects/<channel>/<PROJECT>/renders/<CompositionId>/<commit>/) by scripts/store.py archive, outside every worktree.
// Cover candidates (docs/cover-principles.md): a delivery render of <id> also renders `<id>-COVERS`, when registered
// (src/videos/covers/), as stills into out/<id>/covers/ (scene frame 15 of each 1 s scene, named <id>_cover-A.png ...),
// so they are archived beside the MP4. --covers renders only those stills, for a deliverable rendered earlier.
// Set BROWSER_EXECUTABLE to use an installed Chromium instead of Remotion's download.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderMedia} from '@remotion/renderer';
import {renderStills} from './stills.mjs';
import path from 'node:path';
import {mkdir, copyFile, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {describeLoudness, normalizeLoudness} from './loudness.mjs';
import {endingsFor, parseRenderArgs} from './render-options.mjs';
import {pinsFile, readJson, renderSegmented, unpinnedScenes, variantOf} from './segments.mjs';
import {withRenderLog} from './render-log.mjs';

const {ids, stills, covers: coversOnly, frames, endings: requestedEndings, gl, timeoutInMilliseconds, concurrency, draft, noCache, range, keepPinned, repaint, unreviewed, rows: rowsPath} = parseRenderArgs(process.argv.slice(2));
if (!ids.length) throw new Error('Name at least one composition ID, e.g. npm run render -- CATBOX-C01-Short');

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const chromiumOptions = gl ? {gl} : {};
const shared = {browserExecutable, chromiumOptions, timeoutInMilliseconds};
const scale = draft ? 0.5 : 1;
const renderProps = draft ? {paintScale: 0.5, paintDraft: true} : {};
await withRenderLog({tool: 'render', ids, gl, stills, draft, range, concurrency, scale}, async (metrics) => {
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
      // --draft reaches stills too (a draft still used to be painted at final grade); stills stay full size.
      const stillProps = draft ? {paintDraft: true} : {};
      const composition = await selectComposition({serveUrl, id, inputProps: stillProps, puppeteerInstance: browser, ...shared});
      await mkdir(`${dir}/stills`, {recursive: true});
      metrics.event('composition', {id, width: composition.width, height: composition.height, fps: composition.fps, frames});
      await metrics.time('stills', () => renderStills({serveUrl, composition, inputProps: stillProps, puppeteerInstance: browser, ...shared, frames, outputFor: (frame) => `${dir}/stills/${frame}.png`, onStill: (frame) => console.log(`Checked ${id} frame ${frame}`)}), {id});
      continue;
    }
    const base = await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared});
    const endings = endingsFor(requestedEndings, base.props);
    if (!draft && !range) {
      const pins = await readJson(pinsFile(id), {});
      const sceneCount = base.props.timeline?.length ?? 0;
      for (const ending of endings) {
        const open = unpinnedScenes(pins[variantOf(base, {ending})], sceneCount);
        if (!open.length) continue;
        if (rowsPath) {
          const check = spawnSync('python3', ['-I', 'scripts/storyboard-page/verdicts.py', rowsPath, '--drafts-passed'], {encoding: 'utf8'});
          const line = (check.stdout || check.stderr || '').trim();
          if (check.status === 0) { console.log(`Final review render: ${open.length} scenes not pinned yet; ${line} (${rowsPath})`); continue; }
          console.log(`Final review render not allowed: ${line}`);
        }
        const list = open.slice(0, 12).map((i) => i + 1).join(', ') + (open.length > 12 ? ', ...' : '');
        const summary = `${id} ${ending}: ${open.length} of ${sceneCount} scenes are not pinned (scenes ${list})`;
        if (!unreviewed) {
          throw new Error(`delivery render stopped: ${summary}. Stages (docs/render-rules.md#render-stage): the half-size draft cut `
            + '(storyboard-page/clips.mjs --full --draft) passed shot by shot, then this render with --rows=<review-rows.json> for the Final tab, then pins (pin.mjs pin-rows). '
            + 'For a review render use --range or --draft. Only if the user chose to skip the review: --unreviewed="<reason>".');
        }
        metrics.event('unreviewed', {id, ending, unpinned: open.length, scenes: sceneCount, reason: unreviewed});
        console.log(`WARNING unreviewed delivery render: ${summary}; reason: ${unreviewed}`);
      }
    }
    const outDir = range ? `${dir}/range` : draft ? `${dir}/draft` : dir;
    await mkdir(outDir, {recursive: true});
    for (const ending of endings) {
      const inputProps = {ending, ...renderProps};
      const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, ...shared, inputProps});
      metrics.event('composition', {id, ending, width: composition.width, height: composition.height, fps: composition.fps, frames: composition.durationInFrames});
      const output = `${outDir}/${id}_${ending}${range ? `${draft ? '_draft' : ''}_f${range[0]}-${range[1]}` : ''}.mp4`;
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
    if (draft || range) continue;
    if (rowsPath) {
      const rows = JSON.parse(await readFile(rowsPath, 'utf8'));
      rows.finalCut = {src: `${outDir}/${id}.mp4`};
      await writeFile(rowsPath, JSON.stringify(rows, null, 1) + '\n');
      console.log(`Final tab: ${rowsPath} finalCut = ${outDir}/${id}.mp4; build: python3 -I scripts/storyboard-page/build.py ${rowsPath}`);
    }
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
