// Usage: node scripts/render.mjs <CompositionId>... [--stills] [--frames=90,210] [--endings=A_fade,B_loop,C_seamless]
//        [--gl=angle|egl|swiftshader|swangle|vulkan|angle-egl] [--timeout=<ms per frame>] [--concurrency=<n, default 4>]
// Without --endings, only the ending selected in the episode registry (VideoDefinition.ending) is rendered.
// Painted (p5.brush) or WebGL episodes: --gl=angle --timeout=180000, so a slow frame does not stall at the 30 s default.
// Each run bundles into its own temp directory, lets Remotion pick a free port and writes only under
// out/<CompositionId>/, so renders of different videos can run at the same time.
// Each exported MP4 is loudness-normalized in place (scripts/loudness.mjs) and its before/after levels are logged.
// After the MP4s are exported, out/<CompositionId>/ is copied into the permanent render folder ($REELS_RENDER_DIR, default
// ~/Movies/ReelsCreator/renders/<PROJECT>/...) by scripts/archive-renders.py, outside every worktree.
// Set BROWSER_EXECUTABLE to use an installed Chromium instead of Remotion's download.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition, renderStill, renderMedia} from '@remotion/renderer';
import path from 'node:path';
import {mkdir, copyFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {describeLoudness, normalizeLoudness} from './loudness.mjs';
import {endingsFor, parseRenderArgs} from './render-options.mjs';

const {ids, stills, frames, endings: requestedEndings, gl, timeoutInMilliseconds, concurrency} = parseRenderArgs(process.argv.slice(2));
if (!ids.length) throw new Error('Name at least one composition ID, e.g. npm run render -- CATBOX-C01-Short');

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const chromiumOptions = gl ? {gl} : {};
const shared = {browserExecutable, chromiumOptions, timeoutInMilliseconds};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
try {
  for (const id of ids) {
    const dir = `out/${id}`;
    await mkdir(dir, {recursive: true});
    if (stills) {
      const composition = await selectComposition({serveUrl, id, browserInstance: browser, ...shared});
      await mkdir(`${dir}/stills`, {recursive: true});
      for (const frame of frames) {
        await renderStill({serveUrl, composition, browserInstance: browser, ...shared, frame, output: `${dir}/stills/${frame}.png`, imageFormat: 'png'});
        console.log(`Checked ${id} frame ${frame}`);
      }
      continue;
    }
    const endings = endingsFor(requestedEndings, (await selectComposition({serveUrl, id, browserInstance: browser, ...shared})).props);
    for (const ending of endings) {
      const inputProps = {ending};
      const composition = await selectComposition({serveUrl, id, browserInstance: browser, ...shared, inputProps});
      const output = `${dir}/${id}_${ending}.mp4`;
      let last = -1;
      await renderMedia({serveUrl, composition, browserInstance: browser, ...shared, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, concurrency, inputProps, outputLocation: output,
        onProgress: ({progress}) => {const percent = Math.floor(progress * 10) * 10; if (percent !== last) {console.log(`${id} ${ending}: ${percent}%`); last = percent;}}
      });
      console.log(`Exported ${output}: ${composition.width}x${composition.height}, ${composition.fps}fps, ${composition.durationInFrames} frames`);
      console.log(`Loudness ${output}: ${describeLoudness(await normalizeLoudness(output))}`);
      if (ending === endings.at(-1)) await copyFile(output, `${dir}/${id}.mp4`);
    }
    const archived = spawnSync('python3', ['-I', 'scripts/archive-renders.py', '--only', id], {encoding: 'utf8'});
    console.log(archived.status === 0 ? `Archive ${id}: ${archived.stdout.trim()}` : `WARNING archive failed for ${id}: ${archived.stderr.trim()}`);
  }
} finally {await browser.close({silent: true});}
