#!/usr/bin/env node
// Review clips for the storyboard page (docs/sequence-workflow.md#painted-shot-by-shot, stages in
// docs/render-rules.md#render-stage). Renders go through the scene cache with the same keys as scripts/render.mjs.
//
//   node scripts/storyboard-page/clips.mjs <CompositionId> <review-rows.json> --full --draft   W5 draft cut
//   node scripts/storyboard-page/clips.mjs <CompositionId> <review-rows.json> --full [--keep-pinned]   full-size cut (no longer a
//     stage since 17 Nov 2026: the Final tab shows the delivery render, scripts/render.mjs --rows=<review-rows.json>)
//   node scripts/storyboard-page/clips.mjs <CompositionId> <review-rows.json> --shots=a,b | --missing [--draft]
//   common: [--gl=angle] [--timeout=180000]
//
// --full renders the whole video once to out/<CompositionId>/clips/_<draft|final>_cut.mp4 and gives every shot
// clips.<draft|final> on that cut, with "key" = the segment keys of the shot's scenes, so a re-cut repaints only the
// touched scenes and keeps the verdicts of shots whose scenes did not change. The page's tab shows that one cut.
// --draft paints at half size (paintScale 0.5, 540x960 for a 1080x1920 video; paintDraft set) for a fast, small
// review; its segments are cached under their own variant and never reused for delivery. The final cut is painted
// full size (reused at delivery; pinned scenes are reused when unchanged, --keep-pinned keeps changed ones) and
// proxied to 540x960.
// The final cut stops while any shot has no draft clip; --skip-draft="<reason>" renders anyway, only after the user
// chose to skip the draft stage.
// --shots / --missing render single shots ±1 s (360x640 proxies, <shot>_<draft|final>.mp4), e.g. to re-check one fix.
// Prints one line per shot, then the build command.
// Defaults to --gl=angle; per-run timings and cache counts are written to out/logs/render-clips-*.jsonl.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {ffmpeg, manifestFile, readJson, renderSegmented, scenesInRange, variantOf} from '../segments.mjs';
import {parseRenderArgs} from '../render-options.mjs';
import {withRenderLog} from '../render-log.mjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')).map(([k, v]) => [k, v ?? true]));
const [id, rowsPath] = argv.filter((a) => !a.startsWith('--'));
if (!id || !rowsPath || !(flags.shots || flags.missing || flags.full)) throw new Error('usage: clips.mjs <CompositionId> <review-rows.json> --shots=a,b | --missing | --full [--draft] [--gl=angle]');
const full = flags.full === true;
const draft = flags.draft === true;
const rows = JSON.parse(await readFile(rowsPath, 'utf8'));
const noDraft = full && !draft ? rows.shots.filter((s) => !s.clips?.draft).map((s) => s.id) : [];
const skipDraft = typeof flags['skip-draft'] === 'string' && flags['skip-draft'] ? flags['skip-draft'] : null;
if (noDraft.length && !skipDraft) {
  throw new Error(`final cut stopped: ${noDraft.length} of ${rows.shots.length} shots have no draft clip (${noDraft.slice(0, 12).join(', ')}${noDraft.length > 12 ? ', ...' : ''}). `
    + 'Render the draft cut first (--full --draft) and let the user pass them (docs/render-rules.md#render-stage). '
    + 'Only if the user chose to skip the draft stage: --skip-draft="<reason>".');
}
if (noDraft.length) console.log(`WARNING final cut without drafts for ${noDraft.length} shots; reason: ${skipDraft}`);
const kind = draft ? 'draft' : 'final';
const wanted = full ? rows.shots.map((s) => s.id) : flags.shots ? String(flags.shots).split(',') : rows.shots.filter((s) => !s.clips?.[kind]).map((s) => s.id);
const shots = wanted.map((sid) => rows.shots.find((s) => s.id === sid) ?? (() => { throw new Error(`shot ${sid} is not in ${rowsPath}`); })());
if (!shots.length) { console.log(`every shot already has a ${kind} clip`); process.exit(0); }

const {gl, timeoutInMilliseconds, concurrency} = parseRenderArgs(argv);
const scale = draft ? 0.5 : 1;
const chromiumOptions = gl ? {gl} : {};
await withRenderLog({tool: 'clips', ids: [id], gl, draft, full, shots: wanted, concurrency, scale, ...(noDraft.length ? {skipDraft, noDraft} : {})}, async (metrics) => {
const serveUrl = await metrics.time('bundle', () => bundle({entryPoint: path.resolve('src/index.ts')}));
const browser = await metrics.time('browser', () => openBrowser('chrome', {chromiumOptions}));
const dir = `out/${id}/clips`;
await mkdir(dir, {recursive: true});
try {
  const base = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
  const inputProps = {ending: base.props.ending ?? 'A_fade', ...(draft ? {paintDraft: true, paintScale: scale} : {})};
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions, inputProps});
  metrics.event('composition', {id, width: composition.width, height: composition.height, fps: composition.fps, frames: composition.durationInFrames});
  const fps = composition.fps, pad = fps, last = composition.durationInFrames - 1;
  if (full) {
    const whole = `${dir}/_${kind}_cut.full.mp4`, cut = `${dir}/_${kind}_cut.mp4`;
    const render = {serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds, inputProps, scale, concurrency};
    // The draft is already half size, so it is the cut itself; the full-size final gets a 540x960 proxy.
    await renderSegmented({render, options: {gl, scale, crf: 18}, workDir: `out/${id}/segments-work`, output: draft ? cut : whole, frameRange: [0, last],
      pinOptions: {keep: flags['keep-pinned'] === true}, metrics, log: (line) => console.log(`${kind} cut: ${line}`)});
    if (!draft) await metrics.time('proxy', () => ffmpeg(['-i', whole, '-s', '540x960', '-c:v', 'libx264', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', cut]), {id});
    const scenes = (await readJson(manifestFile(id), {}))[variantOf(composition, inputProps)]?.scenes ?? [];
    for (const shot of shots) {
      const keys = scenesInRange(scenes.map((s) => s.range), [shot.start, shot.end - 1]).map((i) => scenes[i].key).join('+');
      shot.clips = {...shot.clips, [kind]: {src: cut, in: +(shot.start / fps).toFixed(3), out: +(shot.end / fps).toFixed(3), cut: true, ...(keys ? {key: keys} : {})}};
    }
    rows[`${kind}Cut`] = {src: cut, frames: last + 1};
    console.log(`${kind} cut: ${cut} f0-${last}, ${shots.length} shots${scenes.length ? '' : ' (no scene keys: every shot asks again)'}`);
  }
  for (const shot of full ? [] : shots) {
    const from = Math.max(0, shot.start - pad), to = Math.min(last, shot.end - 1 + pad);
    const full = `${dir}/${shot.id}_${kind}.full.mp4`, clip = `${dir}/${shot.id}_${kind}.mp4`;
    // Same render options as scripts/render.mjs ({gl, scale, crf}), so the cache keys match and segments are shared.
    const render = {serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds, inputProps, scale, concurrency};
    await renderSegmented({render, options: {gl, scale, crf: 18}, workDir: `out/${id}/segments-work`, output: full, frameRange: [from, to],
      pinOptions: {keep: true}, metrics, log: (line) => console.log(`${shot.id}: ${line}`)});
    await metrics.time('proxy', () => ffmpeg(['-i', full, '-s', '360x640', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', clip]), {id, shot: shot.id});
    shot.clips = {...shot.clips, [kind]: {src: clip, in: +((shot.start - from) / fps).toFixed(3), out: +((shot.end - from) / fps).toFixed(3)}};
    console.log(`${shot.id}: ${clip} f${from}-${to} (${kind})`);
  }
} finally { await metrics.time('browser-close', () => browser.close({silent: true})); }
await writeFile(rowsPath, JSON.stringify(rows, null, 1) + '\n');
console.log(`updated ${rowsPath}; build: python3 -I scripts/storyboard-page/build.py ${rowsPath}`);
});
