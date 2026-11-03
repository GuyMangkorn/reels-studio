#!/usr/bin/env node
// Pins approved finals in the scene cache (shot-by-shot review, T3). A pinned scene keeps the segment the user approved:
// a later render that would change it stops and asks for --keep-pinned or --repaint (scripts/segments.mjs).
//
//   node scripts/pin.mjs <CompositionId> pin <shotId> <from>-<to> [--ending=A_fade]   pin every scene the shot's frames touch
//   node scripts/pin.mjs <CompositionId> pin-rows <review-rows.json> [--shots=a,b] [--ending=A_fade]   pin every shot
//        of the rows (or the listed ones) on its start..end-1 frames: the Final tab's full cut, passed in one round
//   node scripts/pin.mjs <CompositionId> unpin <shotId|all> [--ending=A_fade]
//   node scripts/pin.mjs <CompositionId> list [--ending=A_fade]
//
// <from>-<to> are the shot's frames (inclusive) as on the review page. A scene holding several shots is pinned as one
// segment and stays pinned while any of its shots is. The keys come from the latest final render of
// that ending (manifest.json, written by every scene-cached render), so render the shot first; a draft or preview
// render cannot be pinned. Pins live in $REELS_STORE/cache/segments/<CompositionId>/pins.json. Prints one line per action.
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {manifestFile, pinsFile, readJson, scenesInRange, segmentDir} from './segments.mjs';

const argv = process.argv.slice(2);
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [id, action, shot, frames] = argv.filter((a) => !a.startsWith('--'));
const usage = 'usage: pin.mjs <CompositionId> pin <shotId> <from>-<to> | pin-rows <review-rows.json> [--shots=a,b] | unpin <shotId|all> | list  [--ending=A_fade]';
if (!id || !['pin', 'pin-rows', 'unpin', 'list'].includes(action)) throw new Error(usage);
const ending = flags.ending ?? 'A_fade';
const pins = await readJson(pinsFile(id), {});
const mine = (pins[ending] ??= {});

if (action === 'list') {
  const rows = Object.entries(mine).sort((a, b) => a[0] - b[0]);
  console.log(rows.length ? rows.map(([scene, p]) => `${id} ${ending} scene ${+scene + 1} f${p.range[0]}-${p.range[1]} ${p.shots.join('+')} ${p.key} ${p.pinnedAt}`).join('\n') : `${id} ${ending}: no pins`);
} else if (action === 'unpin') {
  if (!shot) throw new Error(usage);
  const gone = [];
  for (const scene of Object.keys(mine)) {
    mine[scene].shots = shot === 'all' ? [] : mine[scene].shots.filter((s) => s !== shot);
    if (!mine[scene].shots.length) { delete mine[scene]; gone.push(scene); }
  }
  await writeFile(pinsFile(id), JSON.stringify(pins, null, 1));
  console.log(`${id} ${ending}: ${shot} unpinned; ${gone.length} scene(s) no longer pinned`);
} else {
  // pin: one shot on the given frames; pin-rows: every shot of Film's review rows (or --shots) on its own frames.
  let todo;
  if (action === 'pin') {
    const range = /^(\d+)-(\d+)$/.exec(frames ?? '');
    if (!shot || !range) throw new Error(usage);
    todo = [[shot, +range[1], +range[2]]];
  } else {
    if (!shot) throw new Error(usage);
    const rows = JSON.parse(await readFile(shot, 'utf8')).shots;
    const only = flags.shots ? flags.shots.split(',') : null;
    todo = rows.filter((s) => !only || only.includes(s.id)).map((s) => [s.id, s.start, s.end - 1]);
    if (only && todo.length !== only.length) throw new Error(`shots not in ${shot}: ${only.filter((o) => !todo.some(([s]) => s === o)).join(', ')}`);
  }
  const last = (await readJson(manifestFile(id), {}))[ending];
  if (!last) throw new Error(`no final render of ${id} ${ending} in ${manifestFile(id)}; render the shot first (render.mjs --range)`);
  const pinnedAt = new Date().toISOString();
  for (const [name, from, to] of todo) {
    const scenes = scenesInRange(last.scenes.map((s) => s.range), [from, to]);
    const missing = scenes.filter((i) => !existsSync(`${segmentDir(id)}/${last.scenes[i].key}.mp4`));
    if (missing.length) throw new Error(`${name}: scenes ${missing.map((i) => i + 1).join(', ')} have no rendered segment for the latest ${ending} render; render the shot first`);
    for (const i of scenes) {
      // Another shot of the same scene may already be pinned on this segment; a different key means a new approval.
      const shots = mine[i]?.key === last.scenes[i].key ? mine[i].shots.filter((s) => s !== name) : [];
      mine[i] = {key: last.scenes[i].key, range: last.scenes[i].range, shots: [...shots, name], pinnedAt};
    }
    console.log(`${id} ${ending}: pinned ${name} -> scene(s) ${scenes.map((i) => i + 1).join(', ')} (render ${last.renderedAt})`);
  }
  await writeFile(pinsFile(id), JSON.stringify(pins, null, 1));
}
