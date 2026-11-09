import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const run = (sheet: object, timeline: string) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sound-cues-'));
  const video = path.join(dir, 'video');
  mkdirSync(video);
  writeFileSync(path.join(video, 'index.ts'), timeline);
  writeFileSync(path.join(video, 'assets.lock.json'), '{"public/audio/x/stale_01.wav": {}}');
  const file = path.join(dir, 'sound-cues.json');
  writeFileSync(file, JSON.stringify({video, ...sheet}));
  return spawnSync('python3', ['-I', path.resolve('scripts/sound-cues.py'), file], {encoding: 'utf8'});
};

const hit = {cue: 'SH01-hit', shot: 'SH01', frame: 12, brief: 'dull sub hit on the reveal', id: 'impact_sub-hit_01', origin: 'generated'};

test('sound-cues passes when the timeline plays the briefed sounds', () => {
  const r = run({cues: [hit]}, "const HIT = 'audio/impact/impact_sub-hit_01_lp400.wav';");
  assert.equal(r.status, 0, r.stdout);
});

test('sound-cues fails on a missing cue, an unbriefed sound and an open NEEDS-GEN', () => {
  const r = run({cues: [hit, {...hit, cue: 'SH02-door', id: 'NEEDS-GEN'}]}, "const OLD = 'audio/whoosh/whoosh_old_01.wav';");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /SH01-hit: impact_sub-hit_01 is not in the timeline/);
  assert.match(r.stdout, /timeline plays audio\/whoosh\/whoosh_old_01\.wav/);
  assert.match(r.stdout, /SH02-door: still NEEDS-GEN/);
});

test('sound-cues accepts a swap only with a reason and Film or user approval', () => {
  const timeline = "const HIT = 'audio/impact/impact_other_01.wav';";
  assert.equal(run({cues: [hit], swaps: [{cue: 'SH01-hit', to: 'impact_other_01', reason: 'brief cue masks the word', approvedBy: 'film'}]}, timeline).status, 0);
  const r = run({cues: [hit], swaps: [{cue: 'SH01-hit', to: 'impact_other_01'}]}, timeline);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /no reason/);
  assert.match(r.stdout, /approvedBy must be film or user/);
});

test('sound-cues reads the timeline as a baked stem plus the mix script that builds it', () => {
  const r = run({cues: [hit], exempt: [{src: 'audio/edu/stem-v2.wav', reason: 'stem baked by sound-mix.py'}]},
    "const STEM = 'audio/edu/stem-v2.wav'; const MIX = `cue('sfx/impact/impact_sub-hit_01.wav', 717, -20)`;");
  assert.equal(r.status, 0, r.stdout);
});

test('sound-cues needs a fit note for a library pick', () => {
  const r = run({cues: [{...hit, origin: 'library'}]}, "const HIT = 'audio/impact/impact_sub-hit_01.wav';");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /library pick without a fit note/);
});
