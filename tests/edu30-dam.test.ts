import {test} from 'node:test';
import assert from 'node:assert/strict';
import {B04_EYES, DAM, DAM_CAMS, G1_AIM, QUEUE_LEN, QUEUE_PATH, SHORE, bankTop, overWater, queuePoint, queueTangent, reflect, reflectClip, STONE_AT, sAtRimX, southBankY} from '../src/painted/edu30/dam';
import {camPoint} from '../src/painted/kit/ycam';

// EDU-EP30-SHORT ticket T10 r1: east approach, queue path, reflect helper, jam stone, clearance of the B04 lenses over the ground.
const near = (a: number, b: number, tol: number, msg?: string) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} vs ${b} (+-${tol})`);

test('queuePoint(sAtRimX(4.6)) is (4.6, 0.33, -4.9) and x 1.6 is s 4.6', () => {
  const q = queuePoint(sAtRimX(4.6));
  near(q[0], 4.6, 0.01); near(q[1], 0.33, 0.01); near(q[2], -4.9, 0.01);
  near(sAtRimX(1.6), 4.6, 1e-9); near(sAtRimX(4.6), 7.6, 1e-9);
  assert.deepEqual(queuePoint(0), [-3.0, 0.33, -4.9]);
});

test('the path is continuous, ends at both ends of QUEUE_PATH, tangents are unit', () => {
  let prev = queuePoint(0);
  for (let s = 0.05; s <= QUEUE_LEN; s += 0.05) { const q = queuePoint(s); assert.ok(Math.hypot(q[0] - prev[0], q[2] - prev[2]) < 0.06 && Math.abs(q[1] - prev[1]) <= 0.02); prev = q; const t = queueTangent(s); near(Math.hypot(...t), 1, 1e-9); }
  const end = queuePoint(QUEUE_LEN); near(end[0], 70, 1e-6); near(end[2], -70, 1e-6);
  assert.equal(QUEUE_PATH.length, 7);
  assert.deepEqual(queuePoint(-5), queuePoint(0));
});

test('reflect mirrors in the water (y 0.30) and the clip test follows the waterline', () => {
  assert.deepEqual(reflect([0, 1.0, -6]), [0, -0.4, -6]);
  assert.ok(reflectClip(reflect([0, 1.0, -6])) && overWater(0, -10));
  assert.ok(!overWater(0, -3) && !overWater(40, -10));
  assert.ok(SHORE.length > 0);
});

test('the east approach: 1.2 m crest to x 10.5, 0.5 m between x 12 and 16, ramps 1.5 m each side', () => {
  near(bankTop(10.5), 1.2, 1e-9); near(bankTop(12), 0.5, 1e-9); near(bankTop(16), 0.5, 1e-9); near(bankTop(17.5), 0, 1e-9); near(bankTop(11.25), 0.85, 1e-9);
});

test('r3 wading y: 0.30 where the leg is over water, the bank height where it is not', () => {
  const a = queuePoint(25); assert.ok(overWater(a[0], a[2])); near(a[0], 14.53, 0.02); near(a[2], -12.69, 0.02); near(a[1], 0.30, 1e-9);
  const b = queuePoint(20); assert.ok(!overWater(b[0], b[2])); near(b[2], -7.69, 0.02); assert.ok(b[1] > 0.30 && b[1] < 0.41, 'r4 eased ' + b[1]);
  const c = queuePoint(18); assert.ok(!overWater(c[0], c[2])); assert.ok(c[1] > 0.38 && c[1] < 0.46, String(c[1]));
  near(STONE_AT[0], -5.63, 1e-9); near(B04_EYES['B04-SH04'][0][0], -5.68, 1e-9); near(DAM_CAMS.jam.x, -5.68, 1e-9);
});

test('r4 ease: the step at each waterline crossing is <= 0.15 m (expected <= 0.01)', () => {
  let n = 0, prev = queuePoint(0), pw = overWater(prev[0], prev[2]);
  for (let s = 0.01; s <= QUEUE_LEN; s += 0.01) { const q = queuePoint(s), w = overWater(q[0], q[2]); if (w !== pw) { n++; assert.ok(Math.abs(q[1] - prev[1]) <= 0.15, String(q[1] - prev[1])); assert.ok(Math.abs(q[1] - prev[1]) <= 0.01); } prev = q; pw = w; }
  assert.ok(n >= 2, 'crossings ' + n);
});

test('G1 aim values are exported', () => { assert.equal(G1_AIM.sh01, 0.55); assert.deepEqual(G1_AIM.fire, [1, 0, 0]); });

test('clearance: eye y - southBankY(eye z) >= 0.3 m for every B04 camera start and end (table)', () => {
  const want: Record<string, number[]> = {'B04-SH06': [0.70, 0.72], 'B04-SH05': [0.75], 'B04-SH02': [0.49], 'B04-SH04': [0.47], 'B04-SH01': [0.55, 0.55], 'B04-SH03': [0.62]};
  for (const [id, eyes] of Object.entries(B04_EYES)) eyes.forEach((e, i) => { const c = e[1] - southBankY(e[2]); assert.ok(c >= 0.3, `${id}[${i}] ${c}`); near(c, want[id][i], 0.011, id); });
  assert.equal(DAM.crest, 1.2);
});

test('proof cameras project the corner of the path in frame', () => {
  const p = camPoint(DAM_CAMS.queue, [14.5, 0.4, -5.2]); assert.ok(p && p[0] > 0 && p[0] < 1080);
});
