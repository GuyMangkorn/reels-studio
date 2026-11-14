import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bodyFrame, type CastDef} from '../src/painted/kit/cast';
import {crouchLeg} from '../src/painted/kit/legs';
import {PEOPLE} from '../src/painted/kit/people';
import {KENG} from '../src/painted/survival/cast';
import type {Pt} from '../src/painted/kit/painter';

// EDU-EP16 R1.5b (Boss, 14 Nov 2026): Keng's legs looked deformed in P35 crouch_hide: the front/back crouch knee rose to a fixed 0.46 m, so the shin stretched to 1.6x its length
// (and the knee blobs sat beside the chest). `crouchLeg` keeps the shin at its true length and lets the thigh foreshorten toward the lens.
const len = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const people: CastDef[] = [...Object.values(PEOPLE), KENG];
const oldKnee = (hipV: number, ankleV: number, s: number, c: number, kp = 1): Pt => [s * (0.077 + 0.17 * c) * kp, (hipV + ankleV) / 2 + (0.46 - (hipV + ankleV) / 2) * c];

test('front/back crouch: thigh and shin never longer than the standing bones, knee above the ankle, feet on the ground (every person, c 0..1, quarter widths)', () => {
  for (const def of people) for (const c of [0, 0.25, 0.5, 0.7, 0.9, 1]) for (const kp of [1, 0.8, 0.6]) {
    const f = bodyFrame(def, {view: 'front', crouch: c}), L = (f.hip0 - 0.038) / 2;
    for (const s of [-1, 1]) {
      const l = crouchLeg(s, c, f.hipV, f.hip0, kp);
      assert.ok(len(l.hip, l.knee) <= L * 1.06, `thigh ${len(l.hip, l.knee).toFixed(3)} > ${L.toFixed(3)} (c ${c})`);
      assert.ok(len(l.knee, l.ankle) <= L * 1.02, `shin ${len(l.knee, l.ankle).toFixed(3)} > ${L.toFixed(3)} (c ${c})`);
      assert.ok(l.knee[1] > l.ankle[1] && l.ankle[1] === 0.038 && Math.sign(l.knee[0]) === s);
    }
  }
});

test('Keng crouch_hide (c 0.9): knees above the hips by a hand span, not the chest; thigh foreshortened (< 75% of the bone), shin full length', () => {
  const f = bodyFrame(KENG, {view: 'front', crouch: 0.9}), L = (f.hip0 - 0.038) / 2, l = crouchLeg(1, 0.9, f.hipV, f.hip0);
  assert.ok(l.knee[1] - f.hipV > 0.02 && l.knee[1] - f.hipV < 0.2, `knee ${(l.knee[1] - f.hipV).toFixed(3)} above hip`);
  assert.ok(len(l.hip, l.knee) < 0.75 * L, `thigh ${len(l.hip, l.knee).toFixed(3)} of ${L.toFixed(3)}`);
  assert.ok(Math.abs(len(l.knee, l.ankle) - L) < 0.02);
});

test('negative control: the old fixed 0.46 m knee stretched Keng\'s shin past 1.4x', () => {
  const f = bodyFrame(KENG, {view: 'front', crouch: 0.9}), L = (f.hip0 - 0.038) / 2, k = oldKnee(f.hipV, 0.038, 1, 0.9), a: Pt = [(0.08 + 0.05 * 0.9), 0.038];
  assert.ok(len(k, a) > 1.4 * L, `old shin ${len(k, a).toFixed(3)} vs ${L.toFixed(3)}`);
});

test('profile squat (P35 side): bones keep their lengths from both profile views', () => {
  for (const view of ['left', 'right'] as const) {
    const f = bodyFrame(KENG, {view, squat: 1, bend: 0.35}), L1 = (f.hip0 - 0.038) / 2;
    for (const l of f.mode!.legs) {
      assert.ok(Math.abs(len(l.hip, l.knee) - L1) < 0.02 && Math.abs(len(l.knee, l.ankle) - L1) < 0.03, `${view}: ${len(l.hip, l.knee).toFixed(3)} / ${len(l.knee, l.ankle).toFixed(3)}`);
      assert.ok(l.knee[1] > l.ankle[1] && l.ankle[1] <= 0.04);
    }
  }
});
