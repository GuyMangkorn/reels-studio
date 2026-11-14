import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {Brush} from '../src/painted/BrushCanvas';
import {makePainter} from '../src/painted/kit/painter';
import {camMove, camOf} from '../src/painted/kit/cam-moves';
import {camPoint} from '../src/painted/kit/ycam';
import {checkJoints, type Build} from '../src/painted/survival/beast';
import {buildTRex, SNIFF_AT, TREX_POSES, TREX_STALK} from '../src/painted/survival/beast-trex';
import {FLOCK_SPAN, flockBird, flockItems, scaleBuild} from '../src/painted/survival/flock';
import {buildPterosaur, PTERO_POSES} from '../src/painted/survival/beast-pterosaur';
import {henPrintPx, henPrintScaleFor} from '../src/painted/survival/hen-print';
import {B1, boulderRings, fernRowX, fernShift, impulseRingsItem, reedBlades, RD, ringAge, ringRadius, RING_RADIUS, riverLightAt, RIVER_SHADE, shadeAt, shimmerJit} from '../src/painted/survival/river-r3';
import {RIVER_LIGHT} from '../src/painted/survival/river';
import {colorLuma, CYCLE_SPLIT, cycleAt, daylight, NIGHT_FLOOR, paddyHeight, skyColorsAt, SHOT12_CYCLES} from '../src/painted/survival/sky-cycle';
import {GRANARY, leafCorners, doorwayPoly} from '../src/painted/survival/granary';
import {SEED_CONE, propAnchor} from '../src/painted/survival/props';
import {laughFig, MAX_LEAN} from '../src/painted/survival/poses';
import {waterlineSheet, kneeLevel} from '../src/painted/survival/water';
import {vapourAge} from '../src/painted/survival/trex-fx';

// EDU-EP16 R1.4 remaining checks and R1.5 R3 assets (14 Nov 2026): river B1 / RD / FC / rings / shade, T. rex stalk / sniff / turn, hen print, flock, waterline on crouching figures.
const recorder = () => {
  const calls: string[] = [];
  return {calls, brush: new Proxy({}, {get: (_, name) => (...args: unknown[]) => { calls.push(`${String(name)}${JSON.stringify(args)}`); }}) as Brush};
};
const joint = (B: Build, n: string) => B.joints[n];

// ---- granary
test('granary: door leaves swing inward with `open`, hinged on the frame, and the doorway lies inside the wall', () => {
  const {x0, x1} = GRANARY.door;
  for (const k of [0, 0.5, 1]) for (const [hx, dir] of [[x0, 1], [x1, -1]] as const) {
    const q = leafCorners(hx, dir, k, (x1 - x0) / 2, GRANARY.floor, GRANARY.floor + GRANARY.door.h);
    assert.equal(q[0][0], hx, 'hinge stays on the frame'); assert.ok(q[1][2] <= GRANARY.z1 + 1e-9, 'leaf swings inward (toward -z)');
    assert.ok(Math.abs(Math.hypot(q[1][0] - q[0][0], q[1][2] - q[0][2]) - (x1 - x0) / 2) < 1e-9, 'leaf length is constant');
  }
  const shut = leafCorners(x0, 1, 0, (x1 - x0) / 2, 0, 1), open = leafCorners(x0, 1, 1, (x1 - x0) / 2, 0, 1);
  assert.ok(Math.abs(shut[1][2] - GRANARY.z1) < 1e-9 && open[1][2] < GRANARY.z1 - 0.3, 'open 1 is well inside, open 0 flush');
  assert.ok(doorwayPoly({x: 8, y: 1.5, z: -3, yaw: 0, f: 900, hy: 960, pitch: 0}).length >= 4);
});
test('granary negative control: a leaf hinged on the wrong side swings the wrong way', () => {
  const {x0, x1} = GRANARY.door, bad = leafCorners(x0, -1, 0, (x1 - x0) / 2, 0, 1);
  assert.ok(bad[1][0] < x0, 'control leaf goes outside the opening (left of the hinge)');
});

// ---- sky + paddy
test('sky cycle: split sums to 1, frames sum to 96, light and night floor hold', () => {
  assert.ok(Math.abs(Object.values(CYCLE_SPLIT).reduce((a, b) => a + b, 0) - 1) < 1e-9);
  assert.equal(SHOT12_CYCLES.reduce((a, b) => a + b, 0), 96);
  assert.equal(cycleAt(0).cycle, 0); assert.equal(cycleAt(95).cycle, SHOT12_CYCLES.length - 1);
  let prev = daylight(0);
  for (let i = 1; i <= 400; i++) { const d = daylight(i / 400); assert.ok(Math.abs(d - prev) < 0.05, `daylight jumps at ${i}`); prev = d; }
  for (let i = 0; i <= 20; i++) { const u = 0.65 + 0.25 * (i / 20) * 0.9, c = skyColorsAt(u); assert.ok(colorLuma(c.via) >= NIGHT_FLOOR - 0.03, `night mid band luma ${colorLuma(c.via).toFixed(2)} at ${u.toFixed(2)}`); }
});
test('paddy: stage height rises monotonically from mud to gold', () => {
  let prev = -1;
  for (let s = 0; s <= 4; s += 0.25) { const h = paddyHeight(s); assert.ok(h >= prev - 1e-9, `height drops at stage ${s}`); prev = h; }
  assert.ok(paddyHeight(4) > paddyHeight(1) + 0.3);
});

// ---- laugh
test('laugh: laughFig lean stays within +-0.16 rad, the old 5*sin (radians) did not', () => {
  for (let t = 0; t < 2; t += 0.02) assert.ok(Math.abs(laughFig(t).lean) <= MAX_LEAN + 1e-12);
  assert.ok(Math.abs(5 * Math.sin(1.4)) > 1.5 * MAX_LEAN * 10, 'negative control: the draft value is about 286 degrees');
});

// ---- seed cone
test('seed cone: nine seeds inside the cluster, stalk top inside it, mouth anchor at its centre; a displaced stalk fails the check', () => {
  const {cluster: cl, seeds, stalk} = SEED_CONE, inside = (x: number, y: number, r = 0) => ((x - cl.cx) / (cl.rx + r)) ** 2 + ((y - cl.cy) / (cl.ry + r)) ** 2 <= 1;
  assert.equal(seeds.length, 9);
  for (const [x, y, r] of seeds) assert.ok(inside(x, y, r * 0.5), `seed ${x},${y} outside the cluster`);
  assert.ok(inside(stalk.x, stalk.y1), 'stalk ends inside the cluster');
  assert.ok(!inside(stalk.x, stalk.y1 - 0.05 - 0.2), 'negative control: a stalk 0.25 m short ends outside it');
  const m = propAnchor('seed-cone', 'mouth', [500, 900], 1000), g = propAnchor('seed-cone', 'grip', [500, 900], 1000);
  assert.ok(m[1] < g[1], 'the mouth point is above the grip');
});

// ---- waterline on crouching figures
test('waterline: the sheet covers a foot standing below the plane (bed y -0.1) and hides to the level; a 0.1 m level control does not reach the knee', () => {
  const at: [number, number, number] = [0.6, -0.1, -0.5], lens = camOf(camMove([0.7, 0, -0.75], [18, 18], 1.25, 0.55, {f: 900, hy: 900, pitch: [8, 8]}), 0);
  const sheet = waterlineSheet(lens, at, kneeLevel('K')), foot = camPoint(lens, [at[0], at[1], at[2]])!, knee = camPoint(lens, [at[0], 0.28 * 1.1, at[2]])!;
  const ys = sheet.map((q) => q[1]), xs = sheet.map((q) => q[0]);
  assert.ok(Math.min(...ys) <= knee[1] + 1 && Math.max(...ys) >= foot[1] - 1, 'sheet spans the foot to the level');
  assert.ok(foot[0] >= Math.min(...xs) && foot[0] <= Math.max(...xs));
  const low = waterlineSheet(lens, at, 0.1), lys = low.map((q) => q[1]);
  assert.ok(Math.min(...lys) > Math.min(...ys) + 5, 'negative control: a shin-deep sheet stops well below the knee line');
});

// ---- R3 river
test('shade: ramps in 1364-1376, holds to 1504, out by 1514; the light is darker than day', () => {
  assert.equal(shadeAt(1350), 0); assert.equal(shadeAt(1376), 1); assert.equal(shadeAt(1500), 1); assert.equal(shadeAt(1514), 0);
  assert.ok(shadeAt(1370) > 0 && shadeAt(1370) < 1);
  const d = riverLightAt(0), s = riverLightAt(1);
  assert.deepEqual(d, RIVER_LIGHT.day); assert.deepEqual(s, RIVER_SHADE);
  assert.ok(s.k > d.k, 'shade pulls harder toward its darker ambient');
});
test('B1: 1.2 m wide, 0.9 m deep, top 0.95, base on the bed; a mis-placed boulder fails', () => {
  const R = boulderRings(), xs = R.flat().map((q) => q[0]), zs = R.flat().map((q) => q[2]), ys = R.flat().map((q) => q[1]);
  const w = Math.max(...xs) - Math.min(...xs), d = Math.max(...zs) - Math.min(...zs);
  assert.ok(w > 1.0 && w < 1.5, `width ${w.toFixed(2)}`); assert.ok(d > 0.75 && d < 1.2, `depth ${d.toFixed(2)}`);
  assert.equal(Math.max(...ys), B1.top); assert.equal(Math.min(...ys), B1.base);
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2; assert.ok(Math.abs(cx - B1.at[0]) < 0.1);
  const moved = boulderRings([3, 0, -1.35]).flat().map((q) => q[0]); assert.ok(Math.abs((Math.max(...moved) + Math.min(...moved)) / 2 - B1.at[0]) > 1, 'control sits elsewhere');
});
test('RD: blades stand in x -4..-1.5, z 0..0.9, at most 1.3 m', () => {
  for (const b of reedBlades()) { assert.ok(b.x >= RD.x0 && b.x <= RD.x1 && b.z >= RD.z0 && b.z <= RD.z1 && b.h <= RD.h + 1e-9 && b.h > 0.9); }
});
test('FC: part 0 leaves the row in place; part 1 opens a gap round the centre; the gap closes with distance', () => {
  const xs = fernRowX(), centre = -0.2, widest = (part: number) => { const px = xs.map((x) => x + fernShift(x, part, centre)).sort((a, b) => a - b); return Math.max(...px.slice(1).map((x, i) => x - px[i])); };
  for (const x of xs) assert.ok(fernShift(x, 0, centre) === 0);
  assert.ok(widest(1) > widest(0) + 0.8, `gap ${widest(1).toFixed(2)} vs ${widest(0).toFixed(2)}`);
  assert.ok(Math.abs(fernShift(xs[0], 1, centre)) < 0.35, 'the far ends barely move');
});
test('rings: radius grows to 0.35 m over 12 f; shimmer only for 4 f; every contact point gets two rings per live impulse', () => {
  const imp = {f: 10, amp: 1};
  assert.equal(ringAge(9, imp), -1); assert.equal(ringAge(22, imp), 1); assert.equal(ringAge(23, imp), 2);
  assert.equal(ringRadius(1), RING_RADIUS); assert.ok(ringRadius(0.5) < RING_RADIUS && ringRadius(0.5) > 0);
  assert.notEqual(shimmerJit(11, [imp]), 0); assert.equal(shimmerJit(14, [imp]), 0); assert.equal(shimmerJit(9, [imp]), 0);
  const pts: [number, number, number][] = [[0.5, 0, -0.98], [0.78, 0, -0.98], [1, 0, -0.8], [0.35, 0, -1.2]];
  const lens = camOf(camMove([0.62, 0, -0.95], [10, 10], 0.75, 0.42, {f: 1000, hy: 700, pitch: [-30, -30]}), 0);
  const count = (f: number, list = [imp]) => { const r = recorder(), p = makePainter(r.brush, {t: 0.3, frame: 9}); impulseRingsItem(pts, f, list, RIVER_LIGHT.day).draw(p, lens); return r.calls.length; };
  const live = count(16), dead = count(40), none = count(5);
  assert.equal(dead, 0, 'no rings after 12 f'); assert.equal(none, 0, 'no rings before the thud');
  const one = count(16, [imp]), two = count(16, [imp, {f: 12, amp: 1.4}]);
  assert.ok(live > 0 && two > one, 'a second live impulse adds rings');
  const single = (() => { const r = recorder(), p = makePainter(r.brush, {t: 0.3, frame: 9}); impulseRingsItem(pts.slice(0, 1), 16, [imp], RIVER_LIGHT.day).draw(p, lens); return r.calls.length; })();
  assert.ok(Math.abs(live - single * pts.length) <= pts.length * 2, `rings scale with contact points (${live} vs ${single} x ${pts.length})`);
});

// ---- T. rex
test('T. rex stalk: feet alternate with a 2.4 m stride at 0.55 Hz, joints stay attached in every frame', () => {
  assert.equal(TREX_STALK.stride, 2.4); assert.equal(TREX_STALK.hz, 0.55); assert.ok(Math.abs(TREX_STALK.speed - (0.55 * 2.4) / 0.62) < 1e-9);   // B-R15B-06: 1.32 m/s skated the feet; planted feet need stride / duty per cycle = 2.13 m/s
  const xsL: number[] = [], xsR: number[] = [];
  for (let i = 0; i < 24; i++) {
    const B = buildTRex(TREX_POSES.stalk(i / 24)), rows = checkJoints(B);
    for (const r of rows) assert.ok(r.attach <= 0.001, `${r.bone} detached ${r.attach}`);
    xsL.push(joint(B, 'LL.ankle')[0]); xsR.push(joint(B, 'LR.ankle')[0]);
  }
  const span = (a: number[]) => Math.max(...a) - Math.min(...a);
  assert.ok(span(xsL) > 1.8 && span(xsL) < 2.6, `left ankle travel ${span(xsL).toFixed(2)}`);
  assert.ok(Math.abs(xsL[0] - xsR[0]) > 0.5, 'feet are out of phase');
  const still = buildTRex(TREX_POSES.stand()); assert.ok(Math.abs(joint(still, 'LL.ankle')[0] - joint(still, 'LR.ankle')[0]) < 1e-6, 'negative control: the standing pose has both feet level');
});
test('T. rex sniff: the head hangs low and lifts 0.15 m at the two sniffs with the nostrils flared; the vapour follows them', () => {
  const sk = (t: number) => joint(buildTRex(TREX_POSES.sniff(t)), 'skull.joint')[1], rest = sk(0.1), top = sk(SNIFF_AT[0]), top2 = sk(SNIFF_AT[1]);
  assert.ok(top - rest > 0.1 && top - rest < 0.25, `lift ${(top - rest).toFixed(2)}`); assert.ok(Math.abs(top - top2) < 0.02);
  assert.ok(rest < joint(buildTRex(TREX_POSES.stand()), 'skull.joint')[1] - 1.5, 'carried low (>= 1.5 m under the standing head)');
  const nostril = (t: number) => buildTRex(TREX_POSES.sniff(t)).parts.filter((q) => q.bone.startsWith('nostril')).map((q) => Math.max(...q.keys.map((k) => k.a)));
  assert.ok(Math.max(...nostril(SNIFF_AT[0])) > Math.max(...nostril(0.1)) * 1.3, 'nostril bump swells at the sniff');
  assert.ok(vapourAge(SNIFF_AT[0], 48) === 0 && vapourAge(0.2, 48) === -1 && vapourAge(SNIFF_AT[1], 48) === 0 && vapourAge(SNIFF_AT[0] - 0.01, 48) === -1, 'puffs begin at each sniff only');
});
test('T. rex head turn: yaw rotates the head group about the neck base, keeping every joint attached; no turn leaves it in the plane', () => {
  const turn = buildTRex(TREX_POSES.turn(1, 0, -0.5)), flat = buildTRex(TREX_POSES.turn(1, 0, 0));
  for (const r of checkJoints(turn)) assert.ok(r.attach <= 0.001, `${r.bone} detached`);
  const dz = joint(turn, 'skull.joint')[2] - joint(flat, 'skull.joint')[2];
  assert.ok(Math.abs(dz) > 0.5, `skull swings sideways by ${dz.toFixed(2)} m`);
  const nb = joint(turn, 'neck.base'), a = Math.hypot(joint(turn, 'skull.joint')[0] - nb[0], joint(turn, 'skull.joint')[2] - nb[2]), b = Math.hypot(joint(flat, 'skull.joint')[0] - nb[0], joint(flat, 'skull.joint')[2] - nb[2]);
  assert.ok(Math.abs(a - b) < 0.01, 'a pure rotation: the horizontal reach is unchanged');
  assert.ok(Math.abs(joint(flat, 'skull.joint')[2]) < 1e-9, 'control: yaw 0 stays in the body plane');
});

// ---- hen print
test('hen print: grows to >= 80 px in the low lens; a real-size print there is below 80 px (negative control)', () => {
  const lens = camOf(camMove([3.0, 0, -8.6], [0, 0], 0.9, 0.5, {f: 1000, hy: 800, pitch: [-32, -32]}), 0), at: [number, number, number] = [3.0, 0, -8.5];
  const raw = henPrintPx(lens, at), k = henPrintScaleFor(lens, at, 80), scaled = henPrintPx(lens, at, {scale: k});
  assert.ok(raw < 80, `control ${raw.toFixed(0)} px`); assert.ok(scaled >= 79.5, `${scaled.toFixed(0)} px`);
});

// ---- flock
test('flock: the scaled pterosaur spans 0.9 m (a third of the kit), ten birds with distinct phases that leave the crowns to the right', () => {
  const span = (B: Build) => { const xs = B.flats.flatMap((f) => f.pts.map((q) => q[2])).concat(B.parts.flatMap((q) => q.keys.map((k) => k.p[2]))); return Math.max(...xs) - Math.min(...xs); };
  const kit = buildPterosaur(PTERO_POSES.flap(0.2)), small = scaleBuild(kit, FLOCK_SPAN / 3);
  assert.ok(Math.abs(span(small) / span(kit) - FLOCK_SPAN / 3) < 0.01);
  const phases = new Set(Array.from({length: 10}, (_, i) => flockBird(i, 0.5).phase.toFixed(3)));
  assert.equal(phases.size, 10);
  const x0 = Array.from({length: 10}, (_, i) => flockBird(i, 0).at[0]), x1 = Array.from({length: 10}, (_, i) => flockBird(i, 1).at[0]);
  assert.ok(x1.every((x, i) => x > x0[i] + 5), 'every bird has moved right by 5 m or more');
  assert.equal(flockItems(0.5, 1377).length, 10);
  for (const r of checkJoints(small).slice(0, 3)) assert.ok(r.attach <= 0.0011);
});
