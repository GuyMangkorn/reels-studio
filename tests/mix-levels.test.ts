import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

const dir = mkdtempSync(path.join(tmpdir(), 'mix-levels-'));
// 7.5 s tones: the voice speaks 0-3 s and 4.5-7.5 s; gains in dB relative to the voice.
const tone = (name: string, freq: number, gainDb: number, when = '1') => {
  const file = path.join(dir, `${name}.wav`);
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', `sine=f=${freq}:d=7.5:sample_rate=48000`,
    '-af', `volume=${-20 + gainDb}dB,volume='${when}':eval=frame`, file]);
  assert.equal(r.status, 0, String(r.stderr));
  return file;
};
const voice = tone('voice', 1000, 0, 'not(between(t,3,4.5))');
const bed = tone('bed', 1200, -18);
const loud = tone('loud', 1200, 8);
const accent = tone('accent', 1500, 0, 'between(t,3.6,3.9)');
const run = (...args: string[]) => spawnSync('python3', ['-I', path.resolve('scripts/mix-levels.py'), ...args], {encoding: 'utf8'});
const sheet = (checks: object[], stems: object = {voice, bed, accent}) => {
  const file = path.join(dir, `cues-${Math.random()}.json`);
  writeFileSync(file, JSON.stringify({levels: {stems, checks}}));
  return file;
};

test('mix-levels reports the bed about 18 LU under the voice while it speaks', () => {
  const r = run('--voice', voice, '--layer', `bed=${bed}`);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const dv = Number(r.stdout.match(/^bed\s+(-?[\d.]+)/m)?.[1]);
  assert.ok(Math.abs(dv - 18) < 1, r.stdout);
});

test('mix-levels fails a bed check below its minimum and only warns above warnAbove', () => {
  const fail = run(sheet([{beat: 'B01', layer: 'bed', when: 'speech', min: 22}]));
  assert.equal(fail.status, 1, fail.stdout);
  assert.match(fail.stdout, /FAIL B01 bed speech/);
  const warn = run(sheet([{beat: 'B01', layer: 'bed', when: 'speech', min: 15, warnAbove: 16}]));
  assert.equal(warn.status, 0, warn.stdout);
  assert.match(warn.stdout, /warn B01 bed speech .*may vanish/);
});

test('mix-levels judges an accent in a gap by its momentary peak', () => {
  const r = run(sheet([{beat: 'B02', layer: 'accent', when: 'peak', min: -6, max: 3, fromSec: 3, toSec: 4.5},
    {beat: 'B02', layer: 'accent', when: 'speech', min: 12, fromSec: 0, toSec: 3}]));
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /ok {3}B02 accent peak/);
  assert.match(r.stdout, /ok {3}B02 accent speech .*silent/);
});

test('mix-levels measures a whispered line against the whisper itself', () => {
  const whisper = tone('whisper', 1000, 0, 'if(lt(t,3),1,if(gt(t,4.5),0.08,0))');
  const r = run(sheet([{beat: 'B04', layer: 'bed', when: 'speech', min: 15, fromSec: 4.5, toSec: 7.5}], {voice: whisper, bed}));
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /FAIL B04 bed speech dV -?\d/);
});

test('mix-levels marks a scare hit from the brief as an exception', () => {
  const scare = tone('scare', 1500, 8, 'between(t,3.6,3.9)');
  const r = run(sheet([{beat: 'B05', layer: 'accent', when: 'peak', min: -10, max: 3, fromSec: 3, toSec: 4.5, exception: 'brief SH07 scare hit'}],
    {voice, accent: scare}));
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /ok\* {2}B05 accent peak .*brief SH07 scare hit/);
});

test('mix-levels fails a mix more than 5 LU above the voice', () => {
  const r = run('--voice', voice, '--layer', `bed=${loud}`);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /FAIL mix minus voice/);
});

test('mix-levels judges a drop row by the bed\'s loudest step in its window', () => {
  const pass = run(sheet([{beat: 'B03', layer: 'bed', when: 'drop', min: 10, fromSec: 3, toSec: 4.5}]));
  assert.equal(pass.status, 0, pass.stdout);
  assert.match(pass.stdout, /ok {3}B03 bed drop/);
  const fail = run(sheet([{beat: 'B03', layer: 'bed', when: 'drop', min: 30, fromSec: 0, toSec: 3}]));
  assert.equal(fail.status, 1, fail.stdout);
  assert.match(fail.stdout, /FAIL B03 bed drop/);
});
