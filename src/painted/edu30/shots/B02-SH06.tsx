import {hardFill, inkLine} from '../../kit/draw';
import {mixColor} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {wFill} from '../../kit/world';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import {GUNNER1, GUNNER2, LOADER_AT, MEREDITH, PAN_R, loaderLift, paintCrew, paintCrewPose, paintGunnerFists, paintSeatedGunner} from '../cast';
import {paintBeast} from '../../survival/beast';
import {EMU_POSES, blinkLid, buildEmu, emuLensYaw, emuLookTurn, emuNod, talkBeak} from '../emu';
import {HEADS_HERO, headsField, paintEmu, scaled, type EmuMember} from '../flock';
import {PAD, SUN, WHEAT_H, paintPaddockScene, paintWheatRidges} from '../paddock';
import {GUN_PX, buildLewisGun, lewisAnchors, lewisRecoil, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, DEFAULT_REEL, makeShot, stackCam, type Shot30} from '../shot';

// B02-SH06 (Boss T22, 2026-11-20): over EMU-HERO's shoulder, "สามคนเหรอ…": the hero counts the crew with three nods (T07 `nod`, L 7, 17, 23), talks (T07 `talkBeak`,
// L 7, 17, 51, 60), looks back over its LEFT shoulder to the lens (L 30-44, blink from 33), then the camera cranes up and back (L 48-74) while the 36-bird heads field (T08)
// rises in six groups. Wheat is painted per distance band so only necks and heads leave the stalks (T22 r7). The crew: MEREDITH P30, GUNNER-1 seated front, GUNNER-2
// loader seating the pan, G1.
const N = 75;
const CAM0 = camLine({eye: [2.2, 1.55, -10.6], yaw: 190, pitch: -2, f: 1000, hy: 860});
const CAM1 = camLine({eye: [2.4, 3.2, -12.2], yaw: 190, pitch: -16, f: 950, hy: 860});
const ease = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const camAt = (L: number): YCam => { const u = ease((L - 48) / 26); return {x: mix(CAM0.x, CAM1.x, u), y: mix(CAM0.y, CAM1.y, u), z: mix(CAM0.z, CAM1.z, u), yaw: CAM0.yaw, pitch: mix(CAM0.pitch ?? 0, CAM1.pitch ?? 0, u), f: mix(CAM0.f, CAM1.f, u), hy: mix(CAM0.hy, CAM1.hy, u)}; };

const sh = (a: number) => { const v = Math.sin(a * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };
/** Near stalks under the lens: x 1.2..3.4, z -10.4..-9.0 (sheet Depth). */
const STALKS: V3[] = Array.from({length: 16}, (_, i) => [1.2 + 2.2 * sh(i * 2.3), 0, -10.4 + 1.4 * sh(i * 5.1 + 1)] as V3);

const G1: V3 = [0, 0, 0], GH = -Math.PI / 2, SEAT1: V3 = [0, 0, 0.85], MER: V3 = [-0.6, 0, 1.05];
const NODS = [7, 17, 23], ONSETS = [7, 17, 51, 60];
const LOOK_YAW = emuLensYaw(HEADS_HERO, Math.PI / 2, CAM0);

/** EMU-HERO's pose at local L (stand, nods, talk, look back over the left shoulder, blink). */
export const heroPose = (L: number) => {
  const yaw = emuLookTurn(L, 30, 44, 0, LOOK_YAW), base = 0.3 * Math.max(0, Math.min(1, (L - 30) / 4));
  return EMU_POSES.stand({headYaw: yaw, lid: blinkLid(L - 33, base), nod: emuNod(L, NODS), beak: talkBeak(L, ONSETS)});
};

/** A few ear strokes at the wheat top round a seated bird's base, drawn over its body (T22 local wheat-top pass). */
const topStrokes = (p: Parameters<Shot30['paint']>[0], c: YCam, m: EmuMember, i: number) => {
  for (let k = 0; k < 6; k++) {
    const a = sh(i * 17 + k * 3.1) * 6.283, r = 0.6 * Math.sqrt(sh(i * 7 + k * 1.7)), x = m.at[0] + r * Math.cos(a), z = m.at[2] + r * Math.sin(a);
    const b = camPoint(c, [x, WHEAT_H - 0.18, z]), t = camPoint(c, [x + 0.03, WHEAT_H + 0.06, z]);
    if (!b || !t) continue;
    inkLine(p, 36900 + i * 40 + k, [b, t], {closed: false, weight: Math.max(0.6, Math.min(2.2, camUnit(c, [x, 0, z]) * 0.012)), color: mixColor(sh(i + k * 9.1) > 0.5 ? PAD.wheatEar : PAD.wheatShade, '#d8bd76', 0), still: true});
  }
};

/** The loose pan the loader holds (T12 proof `paintHeldPan`): a flat drum of radius `PAN_R`, 0.044 thick, top face at `top`, painted over the seated pan while L < 30. */
const heldPan = (p: Parameters<Shot30['paint']>[0], c: YCam, top: V3) => {
  const ring = (y: number, r: number): V3[] => Array.from({length: 20}, (_, i) => [top[0] + r * Math.cos((i / 20) * Math.PI * 2), y, top[2] + r * Math.sin((i / 20) * Math.PI * 2)]);
  const lo = ring(top[1] - 0.044, PAN_R), hi = ring(top[1], PAN_R);
  for (let i = 0; i < 20; i++) { const j = (i + 1) % 20; wFill(p, c, 34800 + i, GUN_PX.magRim, [lo[i], lo[j], hi[j], hi[i]]); }
  wFill(p, c, 34830, GUN_PX.magRim, hi);
  wFill(p, c, 34831, GUN_PX.mag, ring(top[1] + 0.001, PAN_R * 0.86));
};

/** A field bird sits on its hocks with its back 0.45 m up, under the 0.85 m wheat: only its neck and head are ever seen, so the mop and wing flats are dropped and the far level of detail
 *  (as `flock.ts` `farBuild`) is used (the body, mop and legs sit under the stalks; 36 full birds exceed the stills timeout, T22 r7). Same build, pose, scale and seed as `paintEmu`. */
const paintHeadOnly = (p: Parameters<Shot30['paint']>[0], c: YCam, m: EmuMember, sun: V3) => {
  const B = buildEmu({...m.pose, hero: m.hero}), H = {...B, parts: B.parts.filter((q) => q.bone !== 'body').map((q) => ({...q, tex: undefined})), flats: B.flats.filter((q) => q.bone !== 'body'), look: {sub: 0, ring: 1, edge: 0.3, far: 0.2}};
  paintBeast(p, c, scaled(H, m.scale), {at: [m.at[0], m.at[2]], heading: m.heading, ground: m.at[1], seed: m.seed, sun, shadowOp: 0});
};

/** T22 r8 F1: the loader kneels upright (lean 0) until L 14, leans in over L 14-20 (T18 `loaderLean`). */
const easeIO = ease;
const seg = (L: number, a: number, b: number) => Math.max(0, Math.min(1, (L - a) / (b - a)));
const leanK = (L: number) => (L <= 14 ? 0 : L < 20 ? easeIO((L - 14) / 6) : 1);
/** T22 r8 F1b: the held pan sits 0.18 m toward the loader (+x) until L 14 and slides onto the seat over L 14-20. */
const HELD_OFF = 0.18;
const heldAt = (L: number, pan: V3): V3 => [pan[0] + HELD_OFF * (1 - easeIO(seg(L, 14, 20))), pan[1], pan[2]];

/** The near stalks under the lens: `paintNearStalks` (paddock.ts) with the same positions, count and weights, the stroke colour fading to `PAD.wheatLit` over L 48-64 (T22 r8 F2). */
const paintStalks = (p: Parameters<Shot30['paint']>[0], c: YCam, seed: number, spots: V3[], L: number) => {
  const hh0 = (n: number) => { const q = Math.sin(n * 91.345 + 47.123) * 43758.5453; return q - Math.floor(q); };
  const col = mixColor(mixColor(PAD.wheatShade, '#4a3a22', 0.45), PAD.wheatLit, easeIO(seg(L, 48, 64)));
  spots.forEach((s, i) => {
    for (let k = 0; k < 9; k++) {
      const x = s[0] + (hh0(i * 11 + k) - 0.5) * 0.5, z = s[2] + (hh0(i * 7 + k * 3) - 0.5) * 0.3, hh = WHEAT_H * (0.85 + 0.25 * hh0(i + k * 5)), lean = (hh0(k * 2 + i) - 0.5) * 0.12;
      const b = camPoint(c, [x, 0, z]), t = camPoint(c, [x + lean, hh, z]), ear = camPoint(c, [x + lean * 1.25, hh + 0.13, z]);
      if (!b || !t || !ear) continue;
      const w = camUnit(c, [x, hh, z]);
      inkLine(p, seed + i * 40 + k, [b, t], {closed: false, weight: Math.max(1, w * 0.008), color: col, still: true});
      const ex = ear[0] - t[0], ey = ear[1] - t[1], wd = Math.max(3, w * 0.014);
      hardFill(p, seed + i * 40 + 20 + k, mixColor(PAD.wheatEar, '#5a4528', 0.4), [[t[0] - wd, t[1]], [t[0] + ex * 0.5 - wd * 1.1, t[1] + ey * 0.5], [ear[0], ear[1]], [t[0] + ex * 0.5 + wd * 1.1, t[1] + ey * 0.5], [t[0] + wd, t[1]]]);
    }
  });
};

/** T42 r2 H1r2: birds whose ground point projects below y 1450 at the L 74 camera are dropped from every frame (same set, no popping). */
let nearDrop: Set<number> | undefined;
const dropped = (): Set<number> => {
  if (nearDrop) return nearDrop;
  const c = stackCam({cam: camAt}, 74), set = new Set<number>();
  headsField(74).forEach((m, i) => { const g = camPoint(c, [m.at[0], 0, m.at[2]]); if (g && g[1] > 1450) set.add(i); });
  return (nearDrop = set);
};

const dist = (c: YCam, m: {at: V3}) => Math.hypot(m.at[0] - c.x, m.at[2] - c.z);

export const def: Shot30 = {
  id: 'B02-SH06', N, paper: '#efe6d0',
  cam: camAt,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning;
    // the set first; the camera is north of the fence, so the paddock paints the clearing after its `cast` callback and would cover birds painted there: the birds follow it
    paintPaddockScene(p, c, {light: 0, eaten: 0.4, far: {n: 160, x: [-120, 120], z: [30, 200]}});
    {
      // field members and the hero far to near in distance bands; after each band the wheat ridges between it and the next nearer band hide the bodies and legs
      const hero: EmuMember = {at: HEADS_HERO, heading: Math.PI / 2, pose: heroPose(L), scale: 1, seed: 36000, hero: true};
      const field = headsField(L);
      const drop = dropped(), items = [...field.map((m, i) => ({m, i})).filter((q) => !drop.has(q.i)), {m: hero, i: -1}].sort((a, b) => dist(c, b.m) - dist(c, a.m));
      const bands: {m: EmuMember; i: number}[][] = [];
      items.forEach((it) => { const last = bands[bands.length - 1]; if (last && !it.m.hero && !last.some((q) => q.m.hero) && dist(c, last[0].m) - dist(c, it.m) < 1.6) last.push(it); else bands.push([it]); });
      bands.forEach((b, k) => {
        b.forEach((q) => (q.m.hero ? paintEmu(p, c, q.m, {sun, lod: 'near'}) : paintHeadOnly(p, c, q.m, sun)));
        b.forEach((q) => { if (!q.m.hero) topStrokes(p, c, q.m, q.i); });
        const dMin = Math.min(...b.map((q) => dist(c, q.m))), nxt = bands[k + 1], dNext = nxt ? Math.min(...nxt.map((q) => dist(c, q.m))) : 0.3;
        paintWheatRidges(p, c, 30600 + k * 5, {r0: Math.max(0.3, dNext - 0.2), r1: dMin + 0.1, rows: 3, eaten: 0.4, tone: 'even'});
      });
      const hb = paintEmu(null, c, hero, {sun, lod: 'near'});
      pr?.lead('EMU-HERO', {top: hb.top, bottom: hb.bottom, x: (hb.left + hb.right) / 2});
    }
    // the crew (space P clearing), far to near: MEREDITH, GUNNER-1 (front, head down to the sights), GUNNER-2 (loader), G1
    const rec = lewisRecoil(0, [1]), o = {recoil: rec}, a = lewisAnchors(G1, GH, o), pan = lewisAnchors(G1, GH, {recoil: lewisRecoil(0, [1])}).pan;
    const m = paintCrew(p, c, MEREDITH, MER, {pose: 'P30', t: 1.2, seed: 34400, hat: 'slouch', upLeft: true, faceState: {look: [0, -0.2]}});
    if (m) pr?.lead('MEREDITH', {top: m.top, bottom: m.bottom, x: m.head[0]});
    const g1 = paintSeatedGunner(p, c, GUNNER1, SEAT1, {view: 'front', grip: a.grip, stock: a.stock, jolt: 0, t: 1.2, seed: 33200});
    if (g1) pr?.lead('GUNNER-1', {top: g1.top, bottom: g1.bottom, x: g1.head[0]});
    const fists: ((q: typeof p) => void)[] = [];
    const g2 = paintCrewPose(p, c, GUNNER2, LOADER_AT, {pose: 'loader', L, seed: 34700, pan: heldAt(L, pan), loaderLean: leanK(L), onFists: (r) => fists.push(r)});
    if (g2) pr?.lead('GUNNER-2', {top: g2.top, bottom: g2.bottom, x: g2.head[0]});
    placeBuild(p, c, buildLewisGun(o), G1, GH, {seed: 33300});
    paintLewisPanTicks(p, c, 33400, G1, GH, 0, o);
    if (loaderLift(L) > 0.002) { const hp = heldAt(L, pan); heldPan(p, c, [hp[0], hp[1] + loaderLift(L), hp[2]]); };
    fists.forEach((r) => r(p));
    paintGunnerFists(p, c, GUNNER1, SEAT1, {view: 'front', grip: a.grip, stock: a.stock, jolt: 0, t: 1.2, seed: 33200});
    // the near stalks under the lens, last
    paintStalks(p, c, 31800, STALKS, L);
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
