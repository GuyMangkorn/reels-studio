import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hash} from '../src/painted/kit/hash';
import {LEAD_X} from '../src/painted/edu14/bus';
import {wobble} from '../src/painted/edu14/bubble';
import {palmDrops, palmHandAt} from '../src/painted/edu14/palm';
import {macroSkeleton, HAND_POSES, MACRO_TONES} from '../src/painted/kit/hands';
import {dropEyeAltitude, riderX, scrollOffset} from '../src/painted/edu14/clock';

// EDU-EP14 W5.2 assets: the lead pendant, the wobble, the palm drops, the palm-up hand, rider path.
test('LEAD_X is the lip bead nearest x 0.25 in the seeded sequence (paintLipDrips)', () => {
  let x = -2 + 0.02, i = 0, best = 9;
  while (x < 2) { if (Math.abs(x - 0.25) < Math.abs(best - 0.25)) best = x; x += 0.025 + 0.015 * hash(16500 + i); i++; }
  assert.ok(Math.abs(best - LEAD_X) < 0.002, `${best} vs ${LEAD_X}`);
});

test('thought-bubble wobble: three damped wobbles from +72, still before', () => {
  assert.equal(wobble(66).squash, 0);
  assert.ok(Math.abs(wobble(72).bob) > 5);
  assert.ok(Math.abs(wobble(106).bob) < Math.abs(wobble(76).bob));
});

test('palm drops: 3-5 per second from +5, irregular, inside the palm disc', () => {
  const d = palmDrops();
  assert.ok(d[0].t >= 5);
  const gaps = d.slice(1).map((q, i) => q.t - d[i].t);
  gaps.forEach((g) => assert.ok(g >= 5.5 && g <= 10.5));
  d.forEach((q) => assert.ok(Math.hypot(q.x, q.z) <= 2.4));
});

test('palm-up-open: palm faces up, girl tone, palm centre lands where asked', () => {
  assert.equal(HAND_POSES['palm-up-open'].roll, 180);
  assert.ok(MACRO_TONES.girl.skin);
  const h = palmHandAt([0.43, 0.8, 0.63], 0.01, 1);
  const c = macroSkeleton(h).palmCentre;
  assert.ok(Math.hypot(c[0] - 0.43, c[2] - 0.63) < 1e-6);
  assert.ok(macroSkeleton(h).normal[1] < -0.9, 'back of the hand faces down');
});

test('rider crosses the centre on +54 moving to -x; drop eye reaches the lip; scroll monotonic', () => {
  assert.ok(Math.abs(riderX(54)) < 1e-9 && riderX(35) > 0 && riderX(75) < 0);
  assert.ok(Math.abs(dropEyeAltitude(95) - 2.4) < 0.01);
  assert.ok(scrollOffset(60) > scrollOffset(30));
});

test('SH07 girl (user, third round 10 Nov 2026): one camera-projected standing body to the lip, no card; the roof lip line clears her; the plan stands out from under the lip', async () => {
  const {eyeCam, girlHeadTilt, girlFacing, girlFaceAlpha, girlHeadBounds, svd2, PLAN_EXTENT, PLAN_LEAN, SH07_GIRL_AT} = await import('../src/painted/edu14/lod');
  const {camPoint, camUnit} = await import('../src/painted/kit/ycam');
  const {SHELTER} = await import('../src/painted/edu14/busstop');
  // the head turns up into the lens continuously: monotonic, at most 9 deg per frame, crown to the lens until +84, face up 70 deg at the lip
  let prev = girlHeadTilt(dropEyeAltitude(76)), prevB = girlHeadBounds(eyeCam(76));
  for (let L = 77; L <= 95; L++) {
    const t = girlHeadTilt(dropEyeAltitude(L)), b = girlHeadBounds(eyeCam(L)), pb = prevB;
    assert.ok(t >= prev - 1e-9 && t - prev <= (9 * Math.PI) / 180, `+${L}: tilt step ${((t - prev) * 57.3).toFixed(1)} deg`);
    // no 2D scale trick: the head grows only with the camera's approach (<= 1.3x per frame) and its centre drifts < 6 px
    assert.ok((b.y1 - b.y0) / (pb.y1 - pb.y0) <= 1.3, `+${L}: head grows ${((b.y1 - b.y0) / (pb.y1 - pb.y0)).toFixed(2)}x`);
    assert.ok(Math.abs((b.y0 + b.y1) / 2 - (pb.y0 + pb.y1) / 2) < 6 && Math.abs((b.x0 + b.x1) / 2 - 540) < 2, `+${L}: head centre drift`);
    prev = t; prevB = b;
  }
  assert.ok(Math.abs(girlHeadTilt(dropEyeAltitude(84)) - (15 * Math.PI) / 180) < 0.01);
  assert.ok(Math.abs(girlHeadTilt(2.4) - (70 * Math.PI) / 180) < 1e-9);
  // the kit face decal appears only as the face turns into the lens: none to +87, full from +92
  for (let L = 76; L <= 87; L++) assert.equal(girlFaceAlpha(girlFacing(eyeCam(L), dropEyeAltitude(L))), 0, `no face at +${L}`);
  for (let L = 92; L <= 95; L++) assert.equal(girlFaceAlpha(girlFacing(eyeCam(L), dropEyeAltitude(L))), 1, `face at +${L}`);
  // the lip frame: head (crown to chin) about 250 px (storyboard SH07, 0.30 m head at ~1.4 m)
  const b95 = girlHeadBounds(eyeCam(95));
  assert.ok(b95.y1 - b95.y0 >= 225 && b95.y1 - b95.y0 <= 275, `+95 head ${(b95.y1 - b95.y0).toFixed(0)} px tall`);
  // the decal affine: the SVD rebuilds the matrix
  const m = [0.9, 0.2, -0.1, 0.7], d = svd2(m[0], m[1], m[2], m[3]);
  const R = (a: number) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];
  const mul = (A: number[], B: number[]) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
  mul(mul(R(d.phi), [d.s1, 0, 0, d.s2]), R(d.theta)).forEach((v, i) => assert.ok(Math.abs(v - m[i]) < 1e-9, `svd ${i}`));
  // the roof: from straight above, the crown and shoulders (z >= mark - 0.13) are in front of the lip's sight line at 30 m and 6.5 m
  for (const L of [76, 88]) {
    const c = eyeCam(L), zSeen = c.z - (c.z - SHELTER.zLip) * (c.y - 1.0) / (c.y - SHELTER.yLip);
    assert.ok(SH07_GIRL_AT[2] - 0.13 > zSeen, `+${L}: shoulders back edge ${(SH07_GIRL_AT[2] - 0.13).toFixed(2)} vs lip line ${zSeen.toFixed(3)}`);
    assert.ok(camUnit(c, [SH07_GIRL_AT[0], 1.2, SH07_GIRL_AT[2]]) * 0.25 >= 9, `+${L}: crown at least 9 px across`);
  }
  // the face at the lip is not behind the roof: its sight line to the drop crosses the roof height in front of the lip (z >= 0.10)
  for (let L = 91; L <= 95; L++) {
    const c = eyeCam(L);
    if (c.y <= SHELTER.yLip) continue;
    const b = girlHeadBounds(c), mid = (b.y0 + b.y1) / 2, top = camPoint(c, [SH07_GIRL_AT[0], SHELTER.yLip, SHELTER.zLip]);
    assert.ok(!top || top[1] < mid, `+${L}: lip line y ${top?.[1].toFixed(0)} above the head centre ${mid.toFixed(0)}`);
  }
  // the plan reads standing: its screen footprint is taller than wide (user, 10 Nov 2026)
  assert.ok(Math.abs(PLAN_EXTENT.z[1] - (0.035 + PLAN_LEAN * 0.97 + 0.044)) < 0.01, 'footprint reaches the shoe tips');
  for (const L of [76, 84, 88, 90]) {
    const c = eyeCam(L), [x, , z] = SH07_GIRL_AT;
    const w = camPoint(c, [x + PLAN_EXTENT.x[1], 1.0, z])![0] - camPoint(c, [x + PLAN_EXTENT.x[0], 1.0, z])![0];
    const hgt = camPoint(c, [x, 0.03, z + PLAN_EXTENT.z[1]])![1] - camPoint(c, [x, 1.0, z + PLAN_EXTENT.z[0]])![1];
    assert.ok(hgt >= 1.5 * w, `+${L}: plan ${w.toFixed(1)} px wide x ${hgt.toFixed(1)} px tall`);
  }
});
