// Scene-segment render cache for scripts/render.mjs. The picture is rendered one scene at a time into
// $REELS_STORE/cache/segments/<CompositionId>/<key>.mp4 (muted; outside every worktree, so other checkouts reuse it); the sound is rendered once for the whole video; both are joined.
// A segment is re-rendered only when its key changes. The key covers what that scene's frames can show: the scene and
// its neighbours (entry transitions, loop blend), its start and the video length, every non-timeline prop except the
// sound beds, the selected project's transitive runtime source and media (including shared art),
// its asset lock and the render options. Project declarations reach frames as props. Editing a caption or overlay
// re-renders that scene and its neighbours; changing a
// duration, the narration or shared code re-renders every scene after it, or all.
import {renderMedia} from '@remotion/renderer';
import {createHash, randomUUID} from 'node:crypto';
import {existsSync, globSync} from 'node:fs';
import {mkdir, rename, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

/** Segment folder of a composition in the asset store (same root as scripts/store.py). */
export const segmentDir = (id) => path.join(process.env.REELS_STORE || path.join(os.homedir(), 'ReelsStore'), 'cache', 'segments', id);

/** Same as src/scenes/timeline.ts `sceneFrames`. */
export const sceneFrames = (seconds, fps) => Math.max(1, Math.round(seconds * fps));

/** Inclusive frame ranges of the timeline's scenes. */
export const sceneRanges = (timeline, fps) => {
  let start = 0;
  return timeline.map((scene) => {
    const range = [start, start + sceneFrames(scene.durationSec, fps) - 1];
    start = range[1] + 1;
    return range;
  });
};

/** Content digest of this project's transitive inputs, including shared art. Unknown inputs bypass reuse. */
export const sourceHash = (root = '.', composition, inputProps = {}) => {
  const run = spawnSync(process.execPath, ['--import', 'tsx', fileURLToPath(new URL('./render-inputs.ts', import.meta.url))], {
    input: JSON.stringify({root: path.resolve(root), id: composition?.id, props: {...composition?.props, ...inputProps}}),
    encoding: 'utf8', timeout: 60000, maxBuffer: 1024 * 1024,
  });
  try {
    const result = JSON.parse(run.stdout);
    if (run.status === 0 && /^[a-f0-9]{64}$/.test(result.hash)) return result.hash;
    console.warn(`Scene cache reuse bypassed: ${result.error ?? 'render input discovery failed'}`);
  } catch {console.warn('Scene cache reuse bypassed: render input helper did not complete');}
  return createHash('sha256').update(randomUUID()).digest('hex');
};

/** One key per scene, in timeline order. `options` are the render settings that change pixels. */
export const segmentKeys = (composition, inputProps, options, source) => {
  const {timeline, narration, audio: _audio, ...rest} = {...composition.props, ...inputProps};
  const {src: _src, ...narrationPicture} = narration ?? {};
  const shared = JSON.stringify({rest, narration: narrationPicture, options, source,
    size: [composition.width, composition.height, composition.fps, composition.durationInFrames]});
  const ranges = sceneRanges(timeline, composition.fps);
  return timeline.map((scene, i) => {
    const sounds = (s) => s && {...s, sfx: undefined};
    // The last scene also shows the first one (B_loop freeze, C_seamless blend).
    const near = [timeline[i - 1], scene, timeline[i + 1], i === timeline.length - 1 ? timeline[0] : undefined].map(sounds);
    return createHash('sha256').update(shared).update(JSON.stringify({i, range: ranges[i], near})).digest('hex').slice(0, 16);
  });
};

const ffmpegBin = globSync('node_modules/@remotion/compositor-*/ffmpeg')[0] ?? 'ffmpeg';
const ffmpeg = (args) => {
  const env = {...process.env, DYLD_LIBRARY_PATH: path.dirname(path.resolve(ffmpegBin))};
  const run = spawnSync(ffmpegBin, ['-v', 'error', '-y', ...args], {encoding: 'utf8', env});
  if (run.status !== 0) throw new Error(`ffmpeg failed: ${run.stderr}`);
};

/**
 * Renders `output` from cached scene segments plus one sound render. `render` holds the renderMedia options shared with
 * a plain render (serveUrl, composition, browserInstance, inputProps, ...). Returns how many segments were rendered.
 */
export const renderSegmented = async ({render, options, workDir, output, log}) => {
  const {composition, inputProps} = render;
  const keys = segmentKeys(composition, inputProps, options, sourceHash('.', composition, inputProps));
  const ranges = sceneRanges({...composition.props, ...inputProps}.timeline, composition.fps);
  const segDir = segmentDir(composition.id);
  await mkdir(segDir, {recursive: true});
  await mkdir(workDir, {recursive: true});
  let rendered = 0;
  for (const [i, key] of keys.entries()) {
    const file = `${segDir}/${key}.mp4`;
    if (existsSync(file)) continue;
    // Written under a temporary name first, so an interrupted render never leaves a cached segment behind.
    await renderMedia({...render, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, muted: true, frameRange: ranges[i], outputLocation: `${file}.part.mp4`});
    await rename(`${file}.part.mp4`, file);
    rendered++;
    log(`segment ${i + 1}/${keys.length} f${ranges[i][0]}-${ranges[i][1]} rendered`);
  }
  log(`${rendered} of ${keys.length} segments rendered, ${keys.length - rendered} reused`);
  const sound = `${workDir}/sound.wav`;
  // soundOnly skips p5.brush painting (src/painted/BrushCanvas.tsx); the sound tree is unchanged.
  await renderMedia({...render, inputProps: {...inputProps, soundOnly: true}, codec: 'wav', outputLocation: sound});
  const list = `${workDir}/concat.txt`;
  await writeFile(list, keys.map((key) => `file '${path.resolve(segDir, key)}.mp4'`).join('\n'));
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-i', sound, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
    '-movflags', '+faststart', output]);
  await rm(workDir, {recursive: true, force: true});
  return rendered;
};
