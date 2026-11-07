#!/usr/bin/env node
// Review clips for the storyboard page (shot-by-shot review, T4). For each named shot in Film's review rows it renders
// the shot plus about 1 s either side through the scene cache (the same cache keys as scripts/render.mjs, so an
// approved final is reused at delivery), writes a 360x640 proxy, and records it in the rows as the shot's clip.
//
//   node scripts/storyboard-page/clips.mjs <CompositionId> storyboards/<episode>/<variant>/review-rows.json \
//        --shots=B01-SH01,B01-SH02 | --missing [--draft] [--gl=angle] [--timeout=180000]
//   node scripts/storyboard-page/clips.mjs <CompositionId> <review-rows.json> --full [--gl=angle] [--keep-pinned]
//
// --draft renders the blocking draft (BrushCanvas paintDraft) into the row's clips.draft; without it the clip is the
// final picture, in clips.final. --missing picks every shot that has no clip of that kind yet. Clips go to
// out/<CompositionId>/clips/<shot>_<draft|final>.mp4 (repository-relative, as build.py expects); each clip records
// src, in and out (seconds of the shot inside the padded clip).
// --full (Final tab, docs/sequence-workflow.md#painted-shot-by-shot): renders the whole final cut once through the
// scene cache to out/<CompositionId>/clips/_final_cut.mp4 (540x960) and gives every shot clips.final on that cut, with
// "key" = the segment keys of the shot's scenes, so a re-render keeps the verdicts of shots whose scenes did not change.
// Pinned scenes are reused when unchanged; --keep-pinned keeps changed pinned scenes as approved.
// --full stops while any shot has no draft clip (docs/render-rules.md#render-stage); --skip-draft="<reason>" renders
// anyway, only after the user chose to skip the draft stage.
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
if (full && draft) throw new Error('--full renders the final cut; draft clips stay per shot');
const rows = JSON.parse(await readFile(rowsPath, 'utf8'));
const noDraft = full ? rows.shots.filter((s) => !s.clips?.draft).map((s) => s.id) : [];
const skipDraft = typeof flags['skip-draft'] === 'string' && flags['skip-draft'] ? flags['skip-draft'] : null;
if (noDraft.length && !skipDraft) {
  throw new Error(`final cut stopped: ${noDraft.length} of ${rows.shots.length} shots have no draft clip (${noDraft.slice(0, 12).join(', ')}${noDraft.length > 12 ? ', ...' : ''}). `
    + 'Render them first (--draft --missing) and let the user pass them (docs/render-rules.md#render-stage). '
    + 'Only if the user chose to skip the draft stage: --skip-draft="<reason>".');
}
if (noDraft.length) console.log(`WARNING final cut without drafts for ${noDraft.length} shots; reason: ${skipDraft}`);
const kind = draft ? 'draft' : 'final';
const wanted = full ? rows.shots.map((s) => s.id) : flags.shots ? String(flags.shots).split(',') : rows.shots.filter((s) => !s.clips?.[kind]).map((s) => s.id);
const shots = wanted.map((sid) => rows.shots.find((s) => s.id === sid) ?? (() => { throw new Error(`shot ${sid} is not in ${rowsPath}`); })());
if (!shots.length) { console.log(`every shot already has a ${kind} clip`); process.exit(0); }

const {gl, timeoutInMilliseconds, concurrency} = parseRenderArgs(argv);
const chromiumOptions = gl ? {gl} : {};
await withRenderLog({tool: 'clips', ids: [id], gl, draft, full, shots: wanted, concurrency, scale: 1, ...(noDraft.length ? {skipDraft, noDraft} : {})}, async (metrics) => {
const serveUrl = await metrics.time('bundle', () => bundle({entryPoint: path.resolve('src/index.ts')}));
const browser = await metrics.time('browser', () => openBrowser('chrome', {chromiumOptions}));
const dir = `out/${id}/clips`;
await mkdir(dir, {recursive: true});
try {
  const base = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
  const inputProps = {ending: base.props.ending ?? 'A_fade', ...(draft ? {paintDraft: true} : {})};
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions, inputProps});
  metrics.event('composition', {id, width: composition.width, height: composition.height, fps: composition.fps, frames: composition.durationInFrames});
  const fps = composition.fps, pad = fps, last = composition.durationInFrames - 1;
  if (full) {
    const whole = `${dir}/_final_cut.full.mp4`, cut = `${dir}/_final_cut.mp4`;
    const render = {serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds, inputProps, scale: 1, concurrency};
    await renderSegmented({render, options: {gl, scale: 1, crf: 18}, workDir: `out/${id}/segments-work`, output: whole, frameRange: [0, last],
      pinOptions: {keep: flags['keep-pinned'] === true}, metrics, log: (line) => console.log(`final cut: ${line}`)});
    await metrics.time('proxy', () => ffmpeg(['-i', whole, '-s', '540x960', '-c:v', 'libx264', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', cut]), {id});
    const scenes = (await readJson(manifestFile(id), {}))[variantOf(composition, inputProps)]?.scenes ?? [];
    for (const shot of shots) {
      const keys = scenesInRange(scenes.map((s) => s.range), [shot.start, shot.end - 1]).map((i) => scenes[i].key).join('+');
      shot.clips = {...shot.clips, final: {src: cut, in: +(shot.start / fps).toFixed(3), out: +(shot.end / fps).toFixed(3), cut: true, ...(keys ? {key: keys} : {})}};
    }
    rows.finalCut = {src: cut, frames: last + 1};
    console.log(`final cut: ${cut} f0-${last}, ${shots.length} shots${scenes.length ? '' : ' (no scene keys: every shot asks again)'}`);
  }
  for (const shot of full ? [] : shots) {
    const from = Math.max(0, shot.start - pad), to = Math.min(last, shot.end - 1 + pad);
    const full = `${dir}/${shot.id}_${kind}.full.mp4`, clip = `${dir}/${shot.id}_${kind}.mp4`;
    // Same render options as scripts/render.mjs ({gl, scale, crf}), so the cache keys match and segments are shared.
    const render = {serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds, inputProps, scale: 1, concurrency};
    await renderSegmented({render, options: {gl, scale: 1, crf: 18}, workDir: `out/${id}/segments-work`, output: full, frameRange: [from, to],
      pinOptions: {keep: true}, metrics, log: (line) => console.log(`${shot.id}: ${line}`)});
    await metrics.time('proxy', () => ffmpeg(['-i', full, '-s', '360x640', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', clip]), {id, shot: shot.id});
    shot.clips = {...shot.clips, [kind]: {src: clip, in: +((shot.start - from) / fps).toFixed(3), out: +((shot.end - from) / fps).toFixed(3)}};
    console.log(`${shot.id}: ${clip} f${from}-${to} (${kind})`);
  }
} finally { await metrics.time('browser-close', () => browser.close({silent: true})); }
await writeFile(rowsPath, JSON.stringify(rows, null, 1) + '\n');
console.log(`updated ${rowsPath}; build: python3 -I scripts/storyboard-page/build.py ${rowsPath}`);
});
