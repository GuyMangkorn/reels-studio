import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {cardSquash, headPerspective, headPitchOf, paintFigureAt} from '../src/painted/kit/figure-at';
import {headOutline, pitchV} from '../src/painted/kit/head';
import {makePainter} from '../src/painted/kit/painter';
import {PEOPLE} from '../src/painted/kit/people';
import type {YCam} from '../src/painted/kit/ycam';

// High and low camera cues (`FigureAtOpts.pitchCue`, KIT-VIEW-AUDIT VA03, 13 Nov 2026).
const DEG = Math.PI / 180;
const cam = (eye: number, pitchDeg: number): YCam => ({x: 0, y: eye, z: 4, yaw: 0, pitch: pitchDeg * DEG, f: 800, hy: 960});
const calls = (cue: boolean | undefined, c: YCam) => {
  const out: string[] = [];
  const brush = new Proxy({}, {get: (_, n) => (...a: unknown[]) => { out.push(`${String(n)}${JSON.stringify(a)}`); }}) as Brush;
  paintFigureAt(makePainter(brush, {t: 0, frame: 0}), c, PEOPLE['woman-curly'], {at: [0, 0, 0], t: 0, ...(cue === undefined ? {} : {pitchCue: cue})});
  return out.join('|');
};

test('pitchV keeps the head outline and moves the face centre down from above, up from below', () => {
  assert.equal(pitchV(0, 0.2, 0.3), 0.3);
  for (const [u, v] of headOutline(24)) assert.ok(Math.abs(pitchV(0.5, u, v) - v) < 1e-6, 'outline point unchanged');
  assert.ok(pitchV(0.4, 0, 0) > 0.3 && pitchV(-0.4, 0, 0) < -0.3);
});

test('head perspective: larger from above, smaller from below; squash only from above', () => {
  const high = cam(3.16, -30), low = cam(0.12, 20);
  assert.ok(headPerspective(high, [0, 0, 0], 1.6) > 1.05);
  assert.ok(headPerspective(low, [0, 0, 0], 1.6) < 0.97);
  assert.equal(cardSquash(low, [0, 0, 0], 1.6, [540, 1200], 200), 1);
  assert.equal(headPitchOf(5 * DEG), 0, 'inside the dead zone');
  assert.ok(headPitchOf(30 * DEG) > 0 && headPitchOf(-30 * DEG) < 0);
});

test('pitchCue is on by default (13 Nov 2026) and off changes a high shot', () => {
  const high = cam(3.16, -30);
  assert.equal(calls(true, high), calls(undefined, high));
  assert.notEqual(calls(false, high), calls(undefined, high));
});
