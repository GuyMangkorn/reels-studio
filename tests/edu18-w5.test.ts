import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rig, HIPPO3D_GAPE} from '../src/painted/edu18/hippo3d-sdf';
import {chargeSpeed, HIPPO_SHOTS, RIVER_HIPPO_KEY, snoutAhead, surfaceYawn, tipAboveWater, worldFromView} from '../src/painted/edu18/hippo-shots';
import {cLF01} from '../src/painted/edu18/looks-cams';
import {DOG18_LICK, SNAKE_DIVE_X, SNAKE_SHOTS} from '../src/painted/edu18/path-shots';
import {postViewBox, POST_500_BOX, SCREEN_H, SCREEN_W, shareAt, shareLabel, SHARE_STEPS_B06} from '../src/painted/edu18/Post';
import {fpovPushTo500, fpovScreenQuad, line500Box} from '../src/painted/edu18/fpov';

// EDU-EP18-SHORT W5 Boss items (sheet EDU-EP18-SHEETS-R1.0 B1-B5): movement marks and screen states as pure functions of the shot frame.
const deg = (r: number) => (r * 180) / Math.PI;

test('B1 B01-SH01: under at L0, head out L1, gape peaks by L14 and holds about 137-140 deg, lazy half-close by L118', () => {
  assert.ok(tipAboveWater(surfaceYawn(0)) < 0, 'L0 all under');
  assert.ok(tipAboveWater(surfaceYawn(14)) > 1.35, 'tip about 1.4 m at the peak');
  assert.ok(Math.abs(rig(surfaceYawn(14)).gape - HIPPO3D_GAPE) < 0.02, 'full gape on L14');
  for (const L of [20, 40, 60, 80, 96]) { const g = deg(rig(surfaceYawn(L)).gape); assert.ok(g > 133 && g <= 140.5, `L${L} gape ${g.toFixed(1)}`); }
  const end = deg(rig(surfaceYawn(118)).gape);
  assert.ok(end > 40 && end < 90, `half-close ${end.toFixed(0)}`);
});

test('B1 B01-SH03: snout x -2 at L0, about 7 m/s, stops on 3.75 at L30 after an 8-frame halt and stays', () => {
  const sx = (L: number) => { const s = HIPPO_SHOTS['B01-SH03'](L, 163 + L); return s.at[0] + snoutAhead(s.pose); };
  assert.ok(Math.abs(sx(0) + 2) < 0.02, `start ${sx(0)}`);
  assert.ok(Math.abs(sx(30) - 3.75) < 0.02, `stop ${sx(30)}`);
  assert.ok(Math.abs(sx(31) - sx(30)) < 0.005, 'still after the halt');
  const v = chargeSpeed();
  assert.ok(v > 6.5 && v < 8, `speed ${v.toFixed(2)}`);
  assert.ok(sx(22) < sx(26) && sx(26) < sx(30), 'decelerates forward through the halt');
  for (let L = 0; L < 32; L++) assert.ok(sx(L) <= 3.76, `never past the stop mark (L${L})`);
});

test('B1 hippo states are pure (same frame, same state) and the river key is the LF01 light', () => {
  for (const id of Object.keys(HIPPO_SHOTS)) assert.deepEqual(HIPPO_SHOTS[id](17, 400), HIPPO_SHOTS[id](17, 400));
  const w = worldFromView(cLF01, [-0.55, 0.7, 0.55]);
  assert.deepEqual(w, RIVER_HIPPO_KEY);
  assert.ok(Math.abs(Math.hypot(...w) - 1) < 1e-9);
});

test('B2 snake: B04-SH04 tail leaves the bund top by about L62 and the snake is under the water before the cut', () => {
  const tail = (L: number) => { const s = SNAKE_SHOTS['B04-SH04'](L); return s.place.at[0] + Math.min(...s.build.parts[0].keys.map((k) => k.p[0])); };
  assert.ok(tail(20) < -0.6, 'still at L20');
  assert.ok(tail(64) > SNAKE_DIVE_X, `tail ${tail(64).toFixed(2)} at L64`);
  assert.equal(SNAKE_SHOTS['B04-SH04'](89).visible, false);
  assert.ok(SNAKE_SHOTS['B04-SH04'](62).ripples.length > 0, 'ripples from the entry');
  const lift = (L: number) => SNAKE_SHOTS['B04-SH03'](L).pose.lift ?? 0;
  assert.ok(lift(20) > 0.55 && lift(0) < 0.2, 'head lift L6-20');
});

test('B2 dog lick: tongue out only L2-8, full L4-6', () => {
  for (const L of [0, 1, 2, 8, 9, 20]) assert.equal(DOG18_LICK(L), 0, `L${L}`);
  for (const L of [4, 5, 6]) assert.ok(DOG18_LICK(L) > 0.99, `L${L}`);
});

test('B4 SHARE_STEPS_B06 rises across a thousand in B06-SH02 (58K -> 59K about L41)', () => {
  const labels = Array.from({length: 55}, (_, f) => shareLabel(shareAt(SHARE_STEPS_B06, f / 30, 55 / 30)));
  assert.equal(labels[0], '58K');
  assert.equal(labels[54], '59K');
  const first59 = labels.indexOf('59K') + 14;
  assert.ok(first59 >= 38 && first59 <= 46, `59K from L${first59}`);
  for (let i = 1; i < SHARE_STEPS_B06.length; i++) assert.ok(SHARE_STEPS_B06[i] > SHARE_STEPS_B06[i - 1]);
});

test('B3 zoom state: the 500 line spans at least 80 % of the screen width, same aspect as the screen', () => {
  const vb = postViewBox(1);
  assert.ok(POST_500_BOX.w / vb.w >= 0.8);
  assert.ok(Math.abs(vb.w / vb.h - SCREEN_W / SCREEN_H) < 1e-9);
  assert.ok(vb.x >= 0 && vb.y >= 0 && vb.x + vb.w <= SCREEN_W && vb.y + vb.h <= SCREEN_H);
  assert.deepEqual(postViewBox(0), {x: 0, y: 0, w: SCREEN_W, h: SCREEN_H});
});

test('B5 FPOV quad: 1700 -> 1780 px tall, bottom 1176 -> 1150; the B06-SH03 push ends with the 500 line across x 60-1020 at y 860', () => {
  const a = fpovScreenQuad(0), b = fpovScreenQuad(1);
  assert.equal(Math.round(a[3][1] - a[0][1]), 1700); assert.equal(Math.round(a[3][1]), 1176);
  assert.equal(Math.round(b[3][1] - b[0][1]), 1780); assert.equal(Math.round(b[3][1]), 1150);
  assert.ok(Math.abs((a[0][0] + a[1][0]) / 2 - 540) < 1e-9);
  const e = line500Box(fpovPushTo500(1));
  assert.ok(Math.abs(e.x0 - 60) < 0.5 && Math.abs(e.x1 - 1020) < 0.5 && Math.abs((e.y0 + e.y1) / 2 - 860) < 0.5);
  fpovPushTo500(0).forEach((pt, i) => pt.forEach((v, j) => assert.ok(Math.abs(v - fpovScreenQuad(1)[i][j]) < 1e-6, 'the push starts on the B06-SH02 end quad')));
});
