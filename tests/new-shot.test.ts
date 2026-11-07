import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {sourceInputs} from '../scripts/segments.mjs';

// A scaffolded episode must come out shot-own: each shot's file keys only the scenes showing it.
test('new-shot.mjs scaffolds shot files that the scene cache keys per shot', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'reels-new-shot-'));
  const put = (file: string, text: string) => {
    mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
    writeFileSync(path.join(root, file), text);
  };
  const run = (...args: string[]) => spawnSync(process.execPath, ['scripts/new-shot.mjs', ...args, `--root=${root}`], {encoding: 'utf8'});
  try {
    put('package.json', '{}');
    put('package-lock.json', '{}');
    put('src/index.ts', "import './painted/registry';");
    put('src/painted/shot.ts', 'export type PaintedShot = {id: string; serves: string[]};');
    put('src/painted/kit/camera.tsx', 'export const STILL_CAMERA = {s: 1};');
    put('src/painted/shots/old.ts', "export const oldShots = [{id:'OLD-SH01', serves: []}];");
    put('src/painted/registry.ts', "import type {PaintedShot} from './shot';\nimport {oldShots} from './shots/old';\n\nconst all: PaintedShot[] = [...oldShots];\nexport const paintedShots = Object.fromEntries(all.map(s=>[s.id,s]));\n");
    put('src/videos/ep/index.ts', "export default {episode:'ep', videos:[{id:'EP'}]};");

    assert.equal(run('ep-two', 'S01-SH01', 'S01-SH02').status, 0);
    const second = run('ep-two', 'S01-SH03');
    assert.equal(second.status, 0, second.stderr);
    assert.notEqual(run('ep-two', 'S01-SH03').status, 0, 'an existing shot file is never overwritten');
    assert.match(readFileSync(path.join(root, 'src/painted/registry.ts'), 'utf8'), /\[\.\.\.epTwoShots, \.\.\.oldShots\]/);

    const timeline = ['S01-SH01', 'S01-SH02', 'S01-SH03'].map(shot => ({durationSec: 1, painted: {shots: [{shot, atSec: 0}]}}));
    const composition = {id: 'EP', width: 1080, height: 1920, fps: 30, durationInFrames: 90, props: {timeline}};
    const inputs = sourceInputs(root, composition) ?? assert.fail('known inputs must not bypass');
    assert.deepEqual(inputs.warnings, []);
    assert.deepEqual(inputs.own, ['S01-SH01', 'S01-SH02', 'S01-SH03'].map(id => [`src/painted/ep-two/shots/${id}.tsx`]));
    assert.ok(inputs.scenes.every(Boolean));
  } finally {rmSync(root, {recursive: true, force: true});}
});
