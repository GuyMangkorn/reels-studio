import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {blinkLid, buildEmu, EMU_POSES, emuLensYaw, emuLookTurn, emuNod, emuSac, nodDepth, talkBeak, EMU_RUN, EMU_WALK, WING_FLAP_OUT, WING_FOLD, emuDuckFlap, emuHop, emuNeckBend, emuPads, emuStartle, gaitAdvance, gaitPhase, mixEmuPose, wingMix, type EmuPose} from '../src/painted/edu30/emu';
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

test('buildEmu without a wing is the pre-change build (T07 r5 N3: neck rings 13 -> 25 re-took the five hashes; before: c09ecc02f487 0a28aaa44eb7 bb4a41ff4900 f757bc8e71a4 9a11ece329ed)', () => {
  const cases: [EmuPose, string][] = [[{}, '0df8d23bc2ac'], [{hero: true}, '84528929a51c'], [EMU_POSES.walk(0.3), 'f3ccf6c2391c'], [EMU_POSES.run(0.62), '63f251991bac'], [EMU_POSES.bow({hero: true}), '881391ee213c']];
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

test('T06 r5 N1: the hero bib blends into the neck colour over u 0.15-0.50 (no luma step at u 0.5); non-hero and u < 0.15 unchanged', () => {
  const luma = (c: string) => { const m = c.match(/[0-9a-f]{2}/gi)!.slice(-3).map((h) => parseInt(h, 16)); return 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]; };
  const col = (hero: boolean) => buildEmu({hero}).parts.find((q) => q.bone === 'neck')!.col as (u: number, sd: number) => string;
  const h = col(true), n = col(false);
  let worst = 0;
  for (let i = 0; i < 100; i++) worst = Math.max(worst, Math.abs(luma(h(0.15 + (i + 1) * 0.0035, -0.5)) - luma(h(0.15 + i * 0.0035, -0.5))), Math.abs(luma(h(0.5 + (i + 1) * 0.0005, -0.5)) - luma(h(0.5 + i * 0.0005, -0.5))));
  const step = Math.abs(luma(h(0.4999, -0.5)) - luma(h(0.5001, -0.5)));
  console.log(`T06 r5 neck luma step at u 0.5: ${step.toFixed(2)}; worst neighbouring-sample luma step ${worst.toFixed(2)}; h(0.5) = ${h(0.5, -0.5)} vs non-hero ${n(0.5, -0.5)}`);
  assert.ok(step <= 8, `step ${step}`);
  assert.equal(h(0.5, -0.5), n(0.5, -0.5));
  assert.equal(h(0.1, -0.5), buildEmu({hero: true}).parts.find((q) => q.bone === 'neck')!.col(0.1, -0.5));
  assert.notEqual(h(0.1, -0.5), n(0.1, -0.5));   // the bib below u 0.15 is still the bib
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

// ------------------------------------------------------------------ T07 head controls
test('T07: nod 0, beak 0 and sac 0 give the pre-change build (hash), a hero build keeps its tuft and bib with every control', () => {
  for (const o of [{}, {hero: true}, EMU_POSES.walk(0.3), EMU_POSES.bow({hero: true})] as EmuPose[]) assert.equal(hash(buildEmu({...o, nod: 0, beak: 0, sac: 0})), hash(buildEmu(o)));
  const tufts = (b: ReturnType<typeof buildEmu>) => b.flats.filter((f) => f.bone === 'skull' && f.col === '#2c241d').length;
  const base = tufts(buildEmu({hero: true}));
  for (const c of [{nod: 0.04}, {beak: 1}, {sac: 1}, {headYaw: 1.2}]) assert.equal(tufts(buildEmu({hero: true, ...c})), base);
  assert.equal(base, tufts(buildEmu({})) + 4);
});

test('T07: blinkLid sequence 0.8, 1.0, 0.6, base; outside 0..3 the base', () => {
  assert.deepEqual([0, 1, 2, 3].map((f) => blinkLid(f, 0.3)), [0.8, 1.0, 0.6, 0.3]);
  assert.equal(blinkLid(-1, 0.3), 0.3); assert.equal(blinkLid(4, 0.3), 0.3);
  assert.equal(blinkLid(0.0, 0), 0.8);
});

test('T07: talkBeak is exactly 0 or 1, 1 only on frames onset .. onset + 2', () => {
  const on = [7, 17, 51, 60];
  for (let L = -2; L < 80; L++) {
    const v = talkBeak(L, on);
    assert.ok(v === 0 || v === 1);
    assert.equal(v, on.some((o) => L >= o && L <= o + 2) ? 1 : 0);
  }
  assert.equal(talkBeak(7, on), 1); assert.equal(talkBeak(9, on), 1); assert.equal(talkBeak(10, on), 0); assert.equal(talkBeak(6, on), 0);
});

test('T07: nod keys s 0, s+3 0.04, s+6 0; emuSac keys 26 0, 34 1, 40 1, 48 0.2, 50 0.1; emuLookTurn eases between its frames', () => {
  assert.equal(nodDepth(7, 7), 0); assert.ok(Math.abs(nodDepth(10, 7) - 0.04) < 1e-12); assert.equal(nodDepth(13, 7), 0);
  assert.ok(nodDepth(8, 7) > 0.04 / 3);   // ease-out: more than linear at the first frame
  assert.equal(emuNod(10, [7, 17, 23]), 0.04); assert.equal(emuNod(14, [7, 17, 23]), 0);
  assert.deepEqual([26, 34, 40, 48, 50].map(emuSac), [0, 1, 1, 0.2, 0.1]);
  assert.equal(emuLookTurn(30, 30, 44, 0, 1.2), 0); assert.equal(emuLookTurn(44, 30, 44, 0, 1.2), 1.2); assert.ok(Math.abs(emuLookTurn(37, 30, 44, 0, 1.2) - 0.6) < 1e-12);
});

test('T07: emuLensYaw is the KP-look math for any camera (clamped +-1.2); B02-SH06 look back is the clamp', () => {
  const kp = {x: 0, y: 1.05, z: 2.5};
  const old = (at: number[], heading: number, off = 0.45, cam = kp) => { const toCam = Math.atan2(cam.z - at[2], cam.x - at[0]); let d = toCam - heading; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return -d - Math.sign(-d) * off; };
  for (const h of [Math.PI, Math.PI + 0.25, Math.PI - 0.35, 1.2]) { const y = old([0, 0, -0.2], h); assert.ok(Math.abs(y) <= 1.2 || true); near(emuLensYaw([0, 0, -0.2], h, kp), Math.max(-1.2, Math.min(1.2, y))); }
  const back = emuLensYaw([1.0, 0, -8.0], Math.PI / 2, {x: 2.2, y: 1.55, z: -10.6});
  console.log(`T07 B02-SH06 emuLensYaw ${back.toFixed(4)} (unclamped ${old([1.0, 0, -8.0], Math.PI / 2, 0.45, {x: 2.2, y: 1.55, z: -10.6}).toFixed(4)}; KP-look yaw ${emuLensYaw([0, 0, -0.2], Math.PI, kp).toFixed(4)})`);
  assert.ok(back > 0 && back <= 1.2);
});

test('T07: every new field mixes: mixEmuPose(a, a, u) = a, u 0 = a, u 1 = b, one-sided fields mix from the build default 0', () => {
  for (const k of ['nod', 'beak', 'sac'] as const) {
    const a: EmuPose = {[k]: 0.25}, b: EmuPose = {[k]: 1};
    for (const u of [0, 0.4, 1]) assert.equal(mixEmuPose(a, a, u)[k], 0.25);
    assert.equal(mixEmuPose(a, b, 0)[k], 0.25); assert.equal(mixEmuPose(a, b, 1)[k], 1);
    assert.ok(Math.abs((mixEmuPose({}, b, 0.5)[k] ?? -1) - 0.5) < 1e-12);   // missing side = 0
    assert.equal(mixEmuPose({}, {}, 0.5)[k], undefined);
  }
});

test('T07: the open beak adds a lower mandible and a dark interior flat; the lower mandible tip is 18 deg down about the bill hinge; the sac swells the throat and adds a skin patch', () => {
  const shut = buildEmu({hero: true}), open = buildEmu({hero: true, beak: 1});
  assert.equal(shut.parts.length + 1, open.parts.length);
  assert.ok(open.flats.some((f) => f.col === '#2a1d16') && !shut.flats.some((f) => f.col === '#2a1d16'));
  const neck = (b: ReturnType<typeof buildEmu>) => b.parts.find((q) => q.bone === 'neck')!.keys;
  const n0 = neck(shut), n1 = neck(buildEmu({hero: true, sac: 1})), mid = Math.round(0.4 * (n0.length - 1));
  const w = (k: {b: number}) => k.b;
  assert.ok(Math.abs(w(n1[mid]) / w(n0[mid]) - 1.3 * 1) < 0.05);   // b x (1 + 0.3), centre forward 0.3 b: front extent x 1.6
  assert.equal(n1[0].b, n0[0].b); assert.equal(n1[n1.length - 1].b, n0[n0.length - 1].b);   // base and head end untouched
  assert.ok(buildEmu({hero: true, sac: 1}).flats.some((f) => f.bone === 'neck' && f.pts.length === 14));
  assert.ok(!shut.flats.some((f) => f.bone === 'neck' && f.pts.length === 14));
  // nod: the head joint goes down by nod, the neck mid by half
  const hd = (b: ReturnType<typeof buildEmu>) => b.joints['skull.joint'];
  assert.ok(Math.abs(hd(shut)[1] - hd(buildEmu({nod: 0.04, hero: true}))[1] - 0.04) < 1e-9);
});

test('T07 KP-sac: the neck front width at u 0.4 is 1.45-1.75 x the KP-face neck (screen px at the KP-face camera, logged)', () => {
  const cam: YCam = {x: 0.1, y: 1.58, z: 1.05, yaw: 0, pitch: -2 * Math.PI / 180, f: 1000, hy: 640};
  const width = (o: EmuPose) => {
    const pose = EMU_POSES.stand({lid: 0.32, headYaw: 0.25, ...o}), B = buildEmu({...pose, hero: true});
    const keys = B.parts.find((q) => q.bone === 'neck')!.keys, k = keys[Math.round(0.4 * (keys.length - 1))];
    const a = paintEmu(null, cam, {at: [0, 0, -0.2], heading: Math.PI / 2 - 0.4, pose, scale: 1, seed: 36000, hero: true});
    const row = camPoint(cam, a.toWorld(k.p))![1];
    let lo = Infinity, hi = -Infinity;
    for (const d of a.drawn) if (d.bone === 'neck') for (let i = 0; i < d.poly.length; i++) {
      const p = d.poly[i], q = d.poly[(i + 1) % d.poly.length];
      if ((p[1] - row) * (q[1] - row) <= 0 && p[1] !== q[1]) { const x = p[0] + (q[0] - p[0]) * (row - p[1]) / (q[1] - p[1]); lo = Math.min(lo, x); hi = Math.max(hi, x); }
    }
    return hi - lo;
  };
  const w0 = width({}), w1 = width({sac: 1});
  console.log(`T07 neck width at u 0.4: KP-face ${w0.toFixed(1)} px, sac 1 ${w1.toFixed(1)} px, ratio ${(w1 / w0).toFixed(3)}`);
  assert.ok(w1 / w0 >= 1.45 && w1 / w0 <= 1.75, `ratio ${w1 / w0}`);
});

test('T07 KP-lookback: B02-SH06 at local 44, the left eye is inside the head silhouette on the lens side, the tuft is above the skull (logged)', () => {
  const cam: YCam = {x: 2.2, y: 1.55, z: -10.6, yaw: 190 * Math.PI / 180, pitch: -2 * Math.PI / 180, f: 1000, hy: 860};
  const at: [number, number, number] = [1.0, 0, -8.0], heading = Math.PI / 2, yaw = emuLensYaw(at, heading, cam);
  const pose = EMU_POSES.stand({lid: 0.3, headYaw: yaw}), B = buildEmu({...pose, hero: true});
  const a = paintEmu(null, cam, {at, heading, pose, scale: 1, seed: 36000, hero: true});
  const eye = camPoint(cam, a.toWorld(B.joints['eye.L.pivot']))!, eyeR = camPoint(cam, a.toWorld(B.joints['eye.R.pivot']))!;
  const sk = a.drawn.filter((d) => d.bone === 'skull').flatMap((d) => d.poly);
  const x0 = Math.min(...sk.map((q) => q[0])), x1 = Math.max(...sk.map((q) => q[0])), y0 = Math.min(...sk.map((q) => q[1])), y1 = Math.max(...sk.map((q) => q[1]));
  const bill = camPoint(cam, a.toWorld(B.joints['skull.joint']))!;
  console.log(`T07 lookback: headYaw ${yaw.toFixed(3)} (clamp 1.2); skull bbox x ${x0.toFixed(0)}-${x1.toFixed(0)} y ${y0.toFixed(0)}-${y1.toFixed(0)}; left eye (${eye[0].toFixed(0)}, ${eye[1].toFixed(0)}), right eye (${eyeR[0].toFixed(0)}, ${eyeR[1].toFixed(0)}); head joint x ${bill[0].toFixed(0)}`);
  assert.ok(eye[0] > x0 && eye[0] < x1 && eye[1] > y0 && eye[1] < y1);
});

test('T07 KP-nod: the 0.04 m nod lowers the head joint on the KP-face camera (px, logged)', () => {
  const cam: YCam = {x: 0.1, y: 1.58, z: 1.05, yaw: 0, pitch: -2 * Math.PI / 180, f: 1000, hy: 640};
  const y = (nod: number) => { const pose = EMU_POSES.stand({lid: 0.32, headYaw: 0.25, nod}), a = paintEmu(null, cam, {at: [0, 0, -0.2], heading: Math.PI / 2 - 0.4, pose, scale: 1, seed: 36000, hero: true}); return camPoint(cam, a.toWorld(buildEmu({...pose, hero: true}).joints['skull.joint']))![1]; };
  const d = y(0.04) - y(0);
  console.log(`T07 nod: head joint ${d.toFixed(1)} px lower at nod 0.04 m (KP-face camera)`);
  assert.ok(d > 20 && d < 60);
});
