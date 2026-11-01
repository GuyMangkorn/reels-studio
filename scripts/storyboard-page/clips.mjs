#!/usr/bin/env node
// Review clips for the storyboard page (shot-by-shot review, T4). For each named shot in Film's review rows it renders
// the shot plus about 1 s either side through the scene cache (the same cache keys as scripts/render.mjs, so an
// approved final is reused at delivery), writes a 360x640 proxy, and records it in the rows as the shot's clip.
//
//   node scripts/storyboard-page/clips.mjs <CompositionId> storyboards/<episode>/<variant>/review-rows.json \
//        --shots=B01-SH01,B01-SH02 | --missing [--draft] [--gl=angle] [--timeout=180000]
//
// --draft renders the blocking draft (BrushCanvas paintDraft) into the row's clips.draft; without it the clip is the
// final picture, in clips.final. --missing picks every shot that has no clip of that kind yet. Clips go to
// out/<CompositionId>/clips/<shot>_<draft|final>.mp4 (repository-relative, as build.py expects); each clip records
// src, in and out (seconds of the shot inside the padded clip).
// Prints one line per shot, then the build command.
import {bundle} from '@remotion/bundler';
import {openBrowser, selectComposition} from '@remotion/renderer';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {ffmpeg, renderSegmented} from '../segments.mjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')).map(([k, v]) => [k, v ?? true]));
const [id, rowsPath] = argv.filter((a) => !a.startsWith('--'));
if (!id || !rowsPath || !(flags.shots || flags.missing)) throw new Error('usage: clips.mjs <CompositionId> <review-rows.json> --shots=a,b | --missing [--draft] [--gl=angle]');
const draft = flags.draft === true;
const rows = JSON.parse(await readFile(rowsPath, 'utf8'));
const kind = draft ? 'draft' : 'final';
const wanted = flags.shots ? String(flags.shots).split(',') : rows.shots.filter((s) => !s.clips?.[kind]).map((s) => s.id);
const shots = wanted.map((sid) => rows.shots.find((s) => s.id === sid) ?? (() => { throw new Error(`shot ${sid} is not in ${rowsPath}`); })());
if (!shots.length) { console.log(`every shot already has a ${kind} clip`); process.exit(0); }

const gl = flags.gl === true ? undefined : flags.gl;
const chromiumOptions = gl ? {gl} : {};
const timeoutInMilliseconds = flags.timeout ? Number(flags.timeout) : undefined;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {chromiumOptions});
const dir = `out/${id}/clips`;
await mkdir(dir, {recursive: true});
try {
  const base = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions});
  const inputProps = {ending: base.props.ending ?? 'A_fade', ...(draft ? {paintDraft: true} : {})};
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser, chromiumOptions, inputProps});
  const fps = composition.fps, pad = fps, last = composition.durationInFrames - 1;
  for (const shot of shots) {
    const from = Math.max(0, shot.start - pad), to = Math.min(last, shot.end - 1 + pad);
    const full = `${dir}/${shot.id}_${kind}.full.mp4`, clip = `${dir}/${shot.id}_${kind}.mp4`;
    // Same render options as scripts/render.mjs ({gl, scale, crf}), so the cache keys match and segments are shared.
    const render = {serveUrl, composition, puppeteerInstance: browser, chromiumOptions, timeoutInMilliseconds, inputProps, scale: 1, concurrency: 4};
    await renderSegmented({render, options: {gl, scale: 1, crf: 18}, workDir: `out/${id}/segments-work`, output: full, frameRange: [from, to],
      pinOptions: {keep: true}, log: (line) => console.log(`${shot.id}: ${line}`)});
    ffmpeg(['-i', full, '-s', '360x640', '-c:v', 'libx264', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', clip]);
    shot.clips = {...shot.clips, [kind]: {src: clip, in: +((shot.start - from) / fps).toFixed(3), out: +((shot.end - from) / fps).toFixed(3)}};
    console.log(`${shot.id}: ${clip} f${from}-${to} (${kind})`);
  }
} finally { await browser.close({silent: true}); }
await writeFile(rowsPath, JSON.stringify(rows, null, 1) + '\n');
console.log(`updated ${rowsPath}; build: python3 -I scripts/storyboard-page/build.py ${rowsPath}`);
