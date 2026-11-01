// Scene-segment render cache for scripts/render.mjs. The picture is rendered one scene at a time into
// $REELS_STORE/cache/segments/<CompositionId>/<key>.mp4 (muted; outside every worktree, so other checkouts reuse it); the sound is rendered once for the whole video; both are joined.
// A segment is re-rendered only when its key changes. The key covers what that scene's frames can show: the scene, its
// range, the neighbours the renderer reads (actor poses and dissolves from the previous scene, the entry transition of
// the next one, the C_seamless/B_loop wrap to the first scene; see segmentKeys), the scene count and total length, every
// non-timeline prop except the sound beds, the selected project’s transitive runtime imports and picture media,
// applicable picture lock entries and render options. Project declarations reach frames as props. Unknown inputs
// bypass reuse. Editing a caption, overlay or SFX cue re-renders only that scene (plus a neighbour that reads it). A duration
// change re-renders every scene, because the total length is in every key; narration timing or shared code does too.
// Evidence: docs/dev-findings/DF-20261101-segment-cache-key.md.
import {renderMedia} from '@remotion/renderer';
import {createHash, randomUUID} from 'node:crypto';
import {existsSync, globSync} from 'node:fs';
import {mkdir, readFile, rename, rm, writeFile} from 'node:fs/promises';
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

/** Indexes of the scenes whose frames overlap the inclusive frame range [from, to]. */
export const scenesInRange = (ranges, [from, to]) => ranges.flatMap(([a, b], i) => (b >= from && a <= to ? [i] : []));

/**
 * Pinned finals (shot-by-shot review, T3). `pins.json` in the segment folder maps ending -> scene index ->
 * {key, range, shots, pinnedAt}: the segment the user approved. A scene can hold several shots; it stays pinned while any
 * of them is pinned. Pins apply to final renders only (no draft, no preview).
 */
export const pinsFile = (id) => path.join(segmentDir(id), 'pins.json');
export const manifestFile = (id) => path.join(segmentDir(id), 'manifest.json');
export const readJson = async (file, fallback) => (existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : fallback);
/** The render variant pins and the manifest are recorded for: the ending, plus draft/preview when set. */
export const variantOf = (composition, inputProps) => {
  const props = {...composition.props, ...inputProps};
  return [props.ending ?? 'A_fade', props.paintDraft ? 'draft' : '', props.paintScale && props.paintScale !== 1 ? `scale${props.paintScale}` : ''].filter(Boolean).join('|');
};

/**
 * Checks the picked scenes against their pins. A pinned scene whose key changed is `changed` (the user must choose),
 * unless `repaint` names it (render new, unpin) or `keep` is set (reuse the pinned segment). Returns the keys to use.
 * `repaint` holds shot IDs, scene indexes as strings, or 'all'.
 */
export const applyPins = (pins, picked, keys, {keep = false, repaint = []} = {}) => {
  const use = [...keys], changed = [], unpin = [], kept = [];
  picked.forEach((scene, j) => {
    const pin = pins?.[scene];
    if (!pin || pin.key === keys[j]) return;
    if (repaint.includes('all') || repaint.includes(String(scene)) || pin.shots.some((shot) => repaint.includes(shot))) unpin.push(scene);
    else if (keep) { use[j] = pin.key; kept.push(scene); }
    else changed.push({scene, shots: pin.shots, range: pin.range});
  });
  return {use, changed, unpin, kept};
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

/**
 * One key per scene, in timeline order. `options` are the render settings that change pixels. A neighbour enters a
 * scene's key only where the renderer reads it (src/scenes/SceneRenderer.tsx, painted.ts, endings.ts; evidence in
 * DF-20261101-segment-cache-key):
 *  - previous scene: actor poses carry over from it (SceneView `previous`, inside the actor maps), or the scene's first
 *    painted cue dissolves from its last painted plate (`platesAt`);
 *  - next scene: its entry transition (`transitionIn`) starts in this scene's last frames;
 *  - first scene: the last scene blends from it (C_seamless) or freezes on frame 0 (B_loop, landscape). A_fade does neither;
 *  - every scene: a global sceneTransitionFrames fades at every boundary (`transitionOpacityAt` reads the frame counts of
 *    all scenes, so they are hashed), and its neighbours are included as for a transition.
 * The scene count is hashed only while the progress bar (`chrome.progressBar`) is on: it is the one place SceneView reads it.
 */
export const segmentKeys = (composition, inputProps, options, source) => {
  const {timeline, narration, audio: _audio, ...rest} = {...composition.props, ...inputProps};
  const {src: _src, ...narrationPicture} = narration ?? {};
  const globalTransitions = (rest.sceneTransitionFrames ?? 0) > 0;
  const sceneCount = rest.chrome?.progressBar ? timeline.length : undefined;
  const frameCounts = globalTransitions ? timeline.map((s) => sceneFrames(s.durationSec, composition.fps)) : undefined;
  const shared = JSON.stringify({rest, narration: narrationPicture, options, source,
    size: [composition.width, composition.height, composition.fps, composition.durationInFrames, sceneCount], frameCounts});
  const ranges = sceneRanges(timeline, composition.fps);
  const sounds = (s) => s && {...s, sfx: undefined};
  return timeline.map((scene, i) => {
    const last = i === timeline.length - 1;
    const readsPrev = globalTransitions || (i > 0 && (Boolean(scene.actors?.length) || scene.painted?.shots?.[0]?.dissolveSec !== undefined));
    const readsNext = !last && (globalTransitions || Boolean(timeline[i + 1].transitionIn));
    const near = [
      readsPrev ? timeline[i - 1] : undefined,
      scene,
      readsNext ? timeline[i + 1] : undefined,
      last && rest.ending !== 'A_fade' ? timeline[0] : undefined,
    ].map(sounds);
    return createHash('sha256').update(shared).update(JSON.stringify({i, range: ranges[i], near})).digest('hex').slice(0, 16);
  });
};

const ffmpegBin = globSync('node_modules/@remotion/compositor-*/ffmpeg')[0] ?? 'ffmpeg';
export const ffmpeg = (args) => {
  const env = {...process.env, DYLD_LIBRARY_PATH: path.dirname(path.resolve(ffmpegBin))};
  const run = spawnSync(ffmpegBin, ['-v', 'error', '-y', ...args], {encoding: 'utf8', env});
  if (run.status !== 0) throw new Error(`ffmpeg failed: ${run.stderr}`);
};

/**
 * Renders `output` from cached scene segments plus one sound render. `render` holds the renderMedia options shared with
 * a plain render (serveUrl, composition, puppeteerInstance, inputProps, ...). Returns how many segments were rendered.
 * `frameRange` [from, to] (render.mjs --range) renders and caches only the whole scenes that overlap it, then cuts the
 * range out, so a reviewed range is reused by the later full render.
 */
export const renderSegmented = async ({render, options, workDir, output, log, frameRange, pinOptions = {}}) => {
  const {composition, inputProps} = render;
  const allKeys = segmentKeys(composition, inputProps, options, sourceHash('.', composition, inputProps));
  const allRanges = sceneRanges({...composition.props, ...inputProps}.timeline, composition.fps);
  const picked = frameRange ? scenesInRange(allRanges, frameRange) : allKeys.map((_, i) => i);
  if (!picked.length) throw new Error(`--range f${frameRange[0]}-${frameRange[1]} is outside the video (0-${composition.durationInFrames - 1})`);
  const ranges = picked.map((i) => allRanges[i]);
  const span = [ranges[0][0], ranges.at(-1)[1]];
  const segDir = segmentDir(composition.id);
  await mkdir(segDir, {recursive: true});
  const variant = variantOf(composition, inputProps);
  // The keys of the latest render per variant, so scripts/pin.mjs can pin what the user just saw.
  const manifest = await readJson(manifestFile(composition.id), {});
  manifest[variant] = {renderedAt: new Date().toISOString(), scenes: allRanges.map((range, i) => ({range, key: allKeys[i]}))};
  await writeFile(manifestFile(composition.id), JSON.stringify(manifest, null, 1));
  const allPins = await readJson(pinsFile(composition.id), {});
  const {use: keys, changed, unpin, kept} = applyPins(allPins[variant], picked, picked.map((i) => allKeys[i]), pinOptions);
  if (changed.length) {
    throw new Error(`pinned finals would change: ${changed.map((c) => `${c.shots.join('+')} (scene ${c.scene + 1}, f${c.range[0]}-${c.range[1]})`).join(', ')}. `
      + 'Re-run with --keep-pinned to keep the approved segments, or --repaint=<shot,...|all> to render them again for a new review.');
  }
  const lost = kept.filter((scene) => !existsSync(`${segDir}/${keys[picked.indexOf(scene)]}.mp4`));
  if (lost.length) throw new Error(`pinned segment file missing for scenes ${lost.map((i) => i + 1).join(', ')} in ${segDir}; use --repaint for them`);
  if (kept.length) log(`kept ${kept.length} pinned segment(s) whose inputs changed: scenes ${kept.map((i) => i + 1).join(', ')}`);
  if (unpin.length) {
    for (const scene of unpin) delete allPins[variant][scene];
    await writeFile(pinsFile(composition.id), JSON.stringify(allPins, null, 1));
    log(`unpinned for a new review: scenes ${unpin.map((i) => i + 1).join(', ')}`);
  }
  await mkdir(workDir, {recursive: true});
  let rendered = 0;
  for (const [i, key] of keys.entries()) {
    const file = `${segDir}/${key}.mp4`;
    if (existsSync(file)) continue;
    // Written under a temporary name first, so an interrupted render never leaves a cached segment behind.
    await renderMedia({...render, codec: 'h264', pixelFormat: 'yuv420p', crf: 18, muted: true, frameRange: ranges[i], outputLocation: `${file}.part.mp4`});
    await rename(`${file}.part.mp4`, file);
    rendered++;
    log(`segment ${picked[i] + 1}/${allKeys.length} f${ranges[i][0]}-${ranges[i][1]} rendered`);
  }
  log(`${rendered} of ${keys.length} segments rendered, ${keys.length - rendered} reused`);
  const sound = `${workDir}/sound.wav`;
  // soundOnly skips p5.brush painting (src/painted/BrushCanvas.tsx); the sound tree is unchanged.
  await renderMedia({...render, inputProps: {...inputProps, soundOnly: true}, codec: 'wav', outputLocation: sound, ...(frameRange ? {frameRange: span} : {})});
  const list = `${workDir}/concat.txt`;
  await writeFile(list, keys.map((key) => `file '${path.resolve(segDir, key)}.mp4'`).join('\n'));
  const joined = frameRange ? `${workDir}/joined.mp4` : output;
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-i', sound, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
    '-movflags', '+faststart', joined]);
  if (frameRange) {
    // Frame-exact cut from the joined scenes: the range's offset inside them, re-encoded at the segments' quality.
    const from = frameRange[0] - span[0], count = Math.min(frameRange[1], span[1]) - frameRange[0] + 1, fps = composition.fps;
    // Output-side -ss decodes up to the start, so the cut is frame-exact (this ffmpeg build has no setpts/asetpts filters).
    ffmpeg(['-i', joined, '-ss', String(Math.max(0, from) / fps), '-t', String(count / fps), '-frames:v', String(count),
      '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart', output]);
  }
  await rm(workDir, {recursive: true, force: true});
  return rendered;
};
