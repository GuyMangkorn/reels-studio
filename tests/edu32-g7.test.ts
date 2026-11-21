// EDU-EP32 G7 (Boss W5.2, 2026-11-21): B06-SH02 ear flick, camera keys and mirror; B06-SH03 stamp insert framing and the cat clear of the letters.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camPoint, type YCam} from '../src/painted/kit/ycam';
import {CAM_B06_KEY, CAT_SLEEP, MEMO, MEMO_STAMP, memoPt} from '../src/painted/edu32/office';
import {B06SH02, B06SH02_N, CAM_B06_START, b06Clock, b06sh02Cam, b06sh02Pose, paintB06SH02, paintSleepingCat} from '../src/painted/edu32/b06-sh02';
import {B06SH03_N, CAM_B06_SH03_0, CAM_B06_SH03_1, b06sh03Cam, bottomOf, paintB06SH03, recordFills} from '../src/painted/edu32/b06-sh03';
import {paintedShots} from '../src/painted/registry';

const noop = () => makePainter(new Proxy({}, {get: () => () => undefined}) as Brush, {t: 0, frame: 0});
const DEG = Math.PI / 180;
const KEYS = ['x', 'y', 'z', 'yaw', 'pitch', 'f', 'hy'] as const;
const same = (a: YCam, b: YCam, keys: readonly (typeof KEYS)[number][] = KEYS) => { for (const k of keys) assert.ok(Math.abs((a[k] ?? 0) - (b[k] ?? 0)) < 1e-9, `${k} ${a[k]} vs ${b[k]}`); };

test('timed frame counts: B06-SH02 68 f (G1583-G1650), B06-SH03 38 f (G1651-G1688, the clip end)', () => {
  assert.equal(B06SH02_N, 68);
  assert.equal(B06SH03_N, 38);
  assert.equal(1583 + B06SH02_N + B06SH03_N, 1689);
});

test('B06-SH02 camera: (-2.0, 2.0, +6.3) yaw 0 at L0 -> CAM_B06_KEY at L67, eased (still at both ends)', () => {
  same(b06sh02Cam(0), CAM_B06_START);
  assert.equal(CAM_B06_START.z, 6.3);
  assert.equal(CAM_B06_START.yaw, 0);
  const end = b06sh02Cam(B06SH02_N - 1);
  same(end, CAM_B06_KEY);
  assert.ok(Math.abs(b06sh02Cam(1).z - 6.3) < 0.002 && Math.abs(b06sh02Cam(B06SH02_N - 2).z - 5.7) < 0.002);
});

test('B06-SH02 ear flick only L27-L35 (on "เรียก" W1610), at rest at the exit; lids shut throughout; breath period 60 f', () => {
  for (let L = 0; L < B06SH02_N; L++) {
    const e = b06sh02Pose(L).ears ?? 0, inFlick = L > B06SH02.flick[0] && L < B06SH02.flick[1];
    assert.ok(inFlick ? e > 0 : e === 0, `L${L} ears ${e}`);
    assert.equal(b06sh02Pose(L).lid, CAT_SLEEP.lid);
  }
  assert.ok(Math.abs(b06sh02Pose(31).ears! - 0.5) < 1e-9);
  // the kit breath runs on 2.6 s of plate clock; 60 frames must advance it by exactly 2.6
  assert.ok(Math.abs(b06Clock(60) - b06Clock(0) - 2.6) < 1e-9);
});

test('B06-SH02 G1650 mirror: cat 508 px tall, y 223-731 (LF04 measured), stays above the caption band', () => {
  const r = paintB06SH02(noop(), B06SH02_N - 1)!;
  assert.ok(Math.abs(r.h - 508) <= 4 && Math.abs(r.top - 223) <= 4 && Math.abs(r.bottom - 731) <= 4, `${r.top}-${r.bottom}`);
  for (const L of [0, 31]) assert.ok(paintB06SH02(noop(), L)!.bottom < 1230);
});

test('B06-SH03 camera keys and the stamp framing (timed-projection: centre (539, 762) -> (524, 764); box about 670-820 px wide, above y 1000)', () => {
  same(b06sh03Cam(0), CAM_B06_SH03_0);
  const end = b06sh03Cam(B06SH03_N - 1);
  same(end, CAM_B06_SH03_1, ['x', 'y', 'z', 'yaw', 'pitch']);
  assert.ok(Math.abs((CAM_B06_SH03_1.pitch ?? 0) + 62 * DEG) < 1e-9 && CAM_B06_SH03_1.hy === 760);
  for (const [L, cx, cy] of [[0, 539, 762], [B06SH03_N - 1, 524, 764]] as const) {
    const c = b06sh03Cam(L), ctr = camPoint(c, memoPt(MEMO_STAMP.x, MEMO_STAMP.z, MEMO.y))!;
    assert.ok(Math.abs(ctr[0] - cx) <= 3 && Math.abs(ctr[1] - cy) <= 3, `L${L} ${ctr}`);
    const xs = [-1, 1].map((s) => camPoint(c, memoPt(MEMO_STAMP.x + (s * MEMO_STAMP.w) / 2, MEMO_STAMP.z))![0]);
    assert.ok(xs[1] - xs[0] > 600 && xs[1] - xs[0] < 820, `w ${xs[1] - xs[0]}`);
    assert.ok(camPoint(c, memoPt(MEMO_STAMP.x, MEMO_STAMP.z + MEMO_STAMP.h / 2))![1] < 1000);
  }
});

test('B06-SH03: the cat\'s drawn belly edge stays above the stamp\'s first-line caps (>= 60 px) at L0, L18, L30, L37', () => {
  const r = MEMO_STAMP.rot * DEG, cap = 0.716 * 0.3 * MEMO_STAMP.h, v = -0.04 * MEMO_STAMP.h - cap;
  for (const L of [0, 18, 30, 37]) {
    const c = b06sh03Cam(L), fills = recordFills((q) => paintSleepingCat(q, c, b06Clock(B06SH02_N + L), CAT_SLEEP, false));
    assert.ok(fills.length > 20, `L${L} fills ${fills.length}`);
    for (let k = 0; k <= 20; k++) {
      const u = -0.41 * MEMO_STAMP.w + (k / 20) * 0.82 * MEMO_STAMP.w;
      const q = camPoint(c, memoPt(MEMO_STAMP.x + u * Math.cos(r) - v * Math.sin(r), MEMO_STAMP.z + u * Math.sin(r) + v * Math.cos(r)))!;
      const d = bottomOf(fills, q[0]);
      if (d !== null) assert.ok(q[1] - d >= 60, `L${L} x ${q[0]} margin ${q[1] - d}`);
    }
  }
});

test('G7 plates paint every frame and are registered', () => {
  for (let L = 0; L < B06SH02_N; L += 7) paintB06SH02(noop(), L);
  for (let L = 0; L < B06SH03_N; L += 5) paintB06SH03(noop(), L);
  for (const id of ['EDU32-B06-SH02', 'EDU32-B06-SH03']) assert.ok(paintedShots[id], id);
});
