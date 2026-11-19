import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {buildEmu, EMU_POSES, EMU_RUN, EMU_WALK, WING_FLAP_OUT, WING_FOLD, emuDuckFlap, emuHop, emuNeckBend, emuPads, emuStartle, gaitAdvance, gaitPhase, mixEmuPose, wingMix, type EmuPose} from '../src/painted/edu30/emu';
import {paintEmu} from '../src/painted/edu30/flock';
import {gaitFoot, type L3} from '../src/painted/survival/beast';
import type {YCam} from '../src/painted/kit/ycam';
import {camPoint} from '../src/painted/kit/ycam';

// EDU-EP30-SHORT ticket T06 r1: wing rig, pose mixer, gait contact, startle / duck-flap / hop.
const hash = (b: unknown) => createHash('sha1').update(JSON.stringify(b)).digest('hex').slice(0, 12);
const dist = (a: L3, b: L3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const near = (a: unknown, b: unknown, tol = 1e-9) => {
  if (typeof a === 'number') return assert.ok(Math.abs(a - (b as number)) <= tol, `${a} vs ${b}`);
  if (Array.isArray(a)) return a.forEach((v, i) => near(v, (b as unknown[])[i], tol));
  if (a && typeof a === 'object') { assert.deepEqual(Object.keys(a).sort(), Object.keys(b as object).sort()); return Object.keys(a).forEach((k) => near((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], tol)); }
  assert.equal(a, b);
};

const A: EmuPose = {pitch: -0.1, bob: 0.02, head: [0.5, 1.4, 0], headDir: [1, -0.2, 0], lid: 0.3, pads: [[0.1, 0, 0.12], [-0.1, 0, -0.12]], wing: WING_FOLD, hero: true, tone: 0.2};
const B: EmuPose = {pitch: 0.08, bob: -0.04, head: [0.3, 1.7, 0], neckMid: [0.22, 1.36, 0], headDir: [0.6, 0.3, 0], lid: 0, wing: WING_FLAP_OUT};

test('mixEmuPose: mix(a, a, u) = a, u 0 = a, u 1 = b (up to the direction renormalisation)', () => {
  for (const u of [0, 0.3, 1]) near(mixEmuPose(A, A, u), A);
  near(mixEmuPose(A, B, 0), {...A, neckMid: mixEmuPose(A, B, 0).neckMid}, 1e-9);
  const m1 = mixEmuPose(A, B, 1);
  near({...m1, hero: undefined, tone: undefined, pads: undefined}, {...B, hero: undefined, tone: undefined, pads: undefined, lid: 0}, 1e-9);
  assert.deepEqual(m1.pads, A.pads);   // a field one side lacks is taken whole
  assert.equal(mixEmuPose(A, B, 2).pitch, 0.08);   // u clamped
  assert.equal(mixEmuPose(A, B, 1).hero, true);   // hero and tone from a
});

test('mixEmuPose: a missing neckMid takes the build default, a missing wing takes FOLD', () => {
  const m = mixEmuPose(EMU_POSES.stand(), B, 0);
  assert.ok(m.neckMid && Math.abs(m.neckMid[1] - 1.18) < 0.2);   // the loft rig's mid-neck, about half way up
  near(mixEmuPose({}, {wing: WING_FLAP_OUT}, 0).wing, WING_FOLD);
  assert.equal(mixEmuPose({}, {}, 0.5).wing, undefined);
});

test('gaitAdvance: the stance foot slips <= 0.02 m over its stance frames (walk and run)', () => {
  for (const [S, duty, v] of [[EMU_WALK.stride, EMU_WALK.duty, 1.2], [EMU_RUN.stride, EMU_RUN.duty, 9]] as const) {
    const Adv = gaitAdvance(S);
    assert.ok(Math.abs(Adv - S / duty) < 1e-3);
    for (const ph0 of [0, 0.37]) {
      let worst = 0, lo = Infinity, hi = -Infinity, inStance = false;
      for (let f = 0; f < 120; f++) {
        const ph = gaitPhase(f, v, S, ph0), t = ((ph % 1) + 1) % 1, stance = t < duty;
        const x = (v * f) / 30 + gaitFoot(ph, S, duty, 0.12)[0];
        if (stance && !inStance) { lo = hi = x; }
        if (stance) { lo = Math.min(lo, x); hi = Math.max(hi, x); worst = Math.max(worst, hi - lo); }
        inStance = stance;
      }
      assert.ok(worst <= 0.02, `S ${S} v ${v} ph0 ${ph0}: slip ${worst}`);
    }
  }
});

test('buildEmu without a wing is the pre-change build (the locked looks)', () => {
  const cases: [EmuPose, string][] = [[{}, 'c09ecc02f487'], [{hero: true}, '0a28aaa44eb7'], [EMU_POSES.walk(0.3), 'bb4a41ff4900'], [EMU_POSES.run(0.62), 'f757bc8e71a4'], [EMU_POSES.bow({hero: true}), '9a11ece329ed']];
  for (const [o, h] of cases) assert.equal(hash(buildEmu(o)), h);
});

test('wing geometry: reach 0 = 0.24 m, reach 1 = 0.85 m, the right wing mirrors the left, FOLD tip stays inside the mop', () => {
  for (const [reach, len] of [[0, 0.24], [1, 0.85]] as const) {
    const a = buildEmu({wing: {...WING_FLAP_OUT, reach}}).anchors;
    for (const n of ['L', 'R']) assert.ok(Math.abs(dist(a[`wingRoot${n}`], a[`wingWrist${n}`]) + dist(a[`wingWrist${n}`], a[`wingTip${n}`]) - len) < 1e-6, `${n} ${reach}`);
    assert.ok(Math.abs(a.wingTipL[2] + a.wingTipR[2]) < 1e-9);
  }
  const f = buildEmu({wing: WING_FOLD}).anchors;
  assert.ok(f.wingTipL[1] > 0.7 && Math.abs(f.wingTipL[2]) < 0.25);
});

test('startle: head top >= 1.75 m, feet stay where they were; frame L alone equals the same frame in sequence', () => {
  const from = EMU_POSES.walk(0.3);
  for (const f of [0, 1, 2, 5]) near(emuStartle(f, from).pads, emuPads(from));
  const top = buildEmu(EMU_POSES.startle()).anchors.top[1];
  assert.ok(top >= 1.75, `top ${top}`);
  assert.deepEqual(emuStartle(4, from), emuStartle(4, from));
  near(emuStartle(2, from), emuStartle(5, from));   // held from f 2
});

test('duck-flap: pads planted f 0..16, wing w keys, ends on the walk pose', () => {
  const from = EMU_POSES.walk(0.3), to = EMU_POSES.walk(0.35);
  for (let f = 0; f <= 16; f++) near(emuDuckFlap(f, {from, to}).pads, emuPads(from));
  const reach = (f: number) => (emuDuckFlap(f, {from, to}).wing as {dir: L3}).dir[2];
  const w = (f: number) => (reach(f) - WING_FOLD.dir[2]) / (WING_FLAP_OUT.dir[2] - WING_FOLD.dir[2]);
  assert.ok(Math.abs(w(0)) < 1e-6 && Math.abs(w(10)) < 1e-6 && Math.abs(w(16)) < 1e-6);
  assert.ok(w(2) > 0.85 && w(4) < 0.3 && w(6) > 0.85 && w(8) < 0.2);
  near(emuDuckFlap(16, {from, to}).head, to.head);
});

test('hop: both feet planted before take-off and after landing, lowest pad >= 0.15 m at f 3, lands 0.6 m to the left', () => {
  const o = {side: 1 as const, dist: 0.6};
  const stand = EMU_POSES.stand();
  const world = (f: number) => { const h = emuHop(f, o); return h.pose.pads!.map((p) => [p[0] + h.offset[0], p[1] + h.offset[1], p[2] + h.offset[2]] as L3); };
  assert.deepEqual(world(0), emuPads(stand));
  for (const f of [6, 7, 8, 9, 12]) near(world(f), [[0.06, 0, 0.72], [0.06, 0, 0.48]]);   // both pads at the stand pads, shifted 0.6 m left
  const apex = world(3);
  assert.ok(Math.min(apex[0][1], apex[1][1]) >= 0.15, 'airborne');
  assert.ok(Math.abs(emuHop(3, o).offset[1] - 0.25) < 1e-9);
  for (const f of [1, 2, 3, 4, 5]) assert.ok(Math.min(...world(f).map((p) => p[1])) >= 0.15);
  assert.equal(emuHop(0, o).pose.bob, -0.08);
  assert.equal(emuHop(6, o).pose.bob, -0.06);
  assert.equal(emuHop(9, o).pose.bob, 0);
  near(emuHop(9, o).offset, [0, 0, 0.6]);
});

test('wing tuft at the KP camera: 0.24 m reads 80-110 px (logged)', () => {
  const cam: YCam = {x: 0, y: 1.05, z: 2.5, yaw: 0, pitch: 0, f: 1000, hy: 760};
  const pose = EMU_POSES.duck({wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.9)});
  const a = paintEmu(null, cam, {at: [0, 0, -0.2], heading: -Math.PI / 2, pose, scale: 1, seed: 36000, hero: true});
  const px = (n: string) => camPoint(cam, a.world(n))!;
  const seg = (a: string, b: string) => { const r = px(a), t = px(b); return Math.hypot(t[0] - r[0], t[1] - r[1]); };
  // the tuft's length is the drawn path root -> wrist -> tip (0.24 m); the root -> tip chord of the r3 drooping FLAP_OUT is logged too
  const len = (n: string) => seg(`wingRoot${n}`, `wingWrist${n}`) + seg(`wingWrist${n}`, `wingTip${n}`);
  console.log(`T06 tuft px (path): left ${len('L').toFixed(1)}, right ${len('R').toFixed(1)}; chord left ${seg('wingRootL', 'wingTipL').toFixed(1)}, right ${seg('wingRootR', 'wingTipR').toFixed(1)}`);
  for (const n of ['L', 'R']) assert.ok(len(n) >= 80 && len(n) <= 110, `${n} ${len(n)}`);
});

test('T06 r3: FLAP_OUT tip hangs >= 0.10 m below the root; startle wing mix 0.15; startle neck bend <= 25 deg (logged)', () => {
  const a = buildEmu({wing: WING_FLAP_OUT}).anchors;
  for (const n of ['L', 'R']) assert.ok(a[`wingTip${n}`][1] <= a[`wingRoot${n}`][1] - 0.10, `${n} ${a[`wingTip${n}`][1]} vs ${a[`wingRoot${n}`][1]}`);
  near(a.wingTipL, [0.010, 0.812, 0.319], 0.01);   // r4
  for (const n of ['L', 'R']) assert.ok(a[`wingTip${n}`][1] <= 0.82, `r4 tip y ${a[`wingTip${n}`][1]}`);
  near(EMU_POSES.startle().wing, wingMix(WING_FOLD, WING_FLAP_OUT, 0.15));
  const bend = emuNeckBend(EMU_POSES.startle());
  console.log(`T06 startle neck bend ${bend.toFixed(1)} deg (neckMid x moved 0.22 -> 0.28)`);
  assert.ok(bend <= 25, `bend ${bend}`);
});

test('T06 r3: a wing is drawn as seeded plumes (no solid flat), the same build twice is identical', () => {
  const o = {wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.6)};
  assert.equal(hash(buildEmu(o)), hash(buildEmu(o)));
  const flats = (b: ReturnType<typeof buildEmu>) => b.flats.length;
  assert.equal(flats(buildEmu(o)) - flats(buildEmu({})), 14);   // 7 plumes a wing, no solid flat, no tip fan
});

test('T06 r4: the hero bib blends into the neck colour over u 0.40-0.50 (no luma step at u 0.5); non-hero and u < 0.40 unchanged', () => {
  const luma = (c: string) => { const m = c.match(/[0-9a-f]{2}/gi)!.slice(-3).map((h) => parseInt(h, 16)); return 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]; };
  const col = (hero: boolean) => buildEmu({hero}).parts.find((q) => q.bone === 'neck')!.col as (u: number, sd: number) => string;
  const h = col(true), n = col(false);
  let worst = 0;
  for (let i = 0; i < 100; i++) worst = Math.max(worst, Math.abs(luma(h(0.4 + (i + 1) * 0.0015, -0.5)) - luma(h(0.4 + i * 0.0015, -0.5))), Math.abs(luma(h(0.5 + (i + 1) * 0.0005, -0.5)) - luma(h(0.5 + i * 0.0005, -0.5))));
  const step = Math.abs(luma(h(0.4999, -0.5)) - luma(h(0.5001, -0.5)));
  console.log(`T06 r4 neck luma step at u 0.5: ${step.toFixed(2)}; worst neighbouring-sample luma step ${worst.toFixed(2)}; h(0.5) = ${h(0.5, -0.5)} vs non-hero ${n(0.5, -0.5)}`);
  assert.ok(step <= 8, `step ${step}`);
  assert.equal(h(0.5, -0.5), n(0.5, -0.5));
  assert.equal(h(0.3, -0.5), buildEmu({hero: true}).parts.find((q) => q.bone === 'neck')!.col(0.3, -0.5));
  assert.notEqual(h(0.3, -0.5), n(0.3, -0.5));   // the bib below u 0.40 is still the bib
  assert.equal(h(0.45, 0.5), n(0.45, 0.5));       // the back of the neck was never the bib
});

test('T06 r4: from behind each tuft tip stands out <= 30 px beyond the body silhouette (geometric, logged)', () => {
  const b = buildEmu({hero: true, wing: wingMix(WING_FOLD, WING_FLAP_OUT, 0.9)});
  const body = b.parts.find((q) => q.bone === 'body')!.keys as unknown as {a: number; b: number}[];
  const half = Math.max(...body.map((k) => Math.max(k.a, k.b)));   // widest half-width of the body loft (m)
  const ext = Math.abs(b.anchors.wingTipL[2]) - half, px = (ext * 1000) / 2.5;   // KP camera: f 1000, d about 2.5 m
  console.log(`T06 r4 flap-back tip beyond body: ${ext.toFixed(3)} m = ${px.toFixed(1)} px (body half-width ${half.toFixed(2)} m, tip z ${b.anchors.wingTipL[2].toFixed(3)}, tip y ${b.anchors.wingTipL[1].toFixed(3)})`);
  assert.ok(px <= 30, `${px}`);
});
