import {camMove, camOf} from '../../painted/kit/cam-moves';
import {hardFill} from '../../painted/kit/draw';
import {paintFigureAt} from '../../painted/kit/figure-at';
import {PEOPLE} from '../../painted/kit/people';
import type {Item} from '../../painted/kit/world';
import {wFill, wInk} from '../../painted/kit/world';
import type {Painter} from '../../painted/kit/painter';
import {camPoint, camUnit, type YCam} from '../../painted/kit/ycam';
import {dressIsan, paintCast} from '../../painted/survival/cast';
import type {V3} from '../../painted/survival/core';
import {paintHeldProp} from '../../painted/survival/props';
import {paintRiver} from '../../painted/survival/river';
import {B1, boulderItem, fernRowItems, impulseRingsItem, reedBedItems, riverLightAt, shadeAt, shimmerJit, type Impulse} from '../../painted/survival/river-r3';
import {flockItems} from '../../painted/survival/flock';
import {beastSlabs} from '../../painted/survival/beast-sort';
import {paintBeast, type BeastPlace, type Build} from '../../painted/survival/beast';
import {buildPterosaur, PTERO_POSES, type PteroKitPose} from '../../painted/survival/beast-pterosaur';
import {buildTRex, trexSunSlice, trexWalkPhase, TREX_POSES, TREX_STALK, type TRexPose} from '../../painted/survival/beast-trex';
import {vapourItem} from '../../painted/survival/trex-fx';
import {kneeLevel, waterlineItem} from '../../painted/survival/water';
import {laughFig, safeLean} from '../../painted/survival/poses';
import {FPS} from '../../painted/survival/frame';
import {lin, mix, sm} from './clock';
import {toWorldOf} from './beasts';
import type {Env, Shot} from './shot-types';

// EDU-EP16 river shots 16A-16D and 16 (Editor, R1.5b draft, 14 Nov 2026). Geometry (cameras, T. rex marks, walk phases from distance, Keng marks) is Film's R1.5b look-frame
// geometry (scripts/edu-series/ep16/looks-r15/shots.ts) copied as numbers; the creatures, river set (B1, RD, FC), shade state, impulse rings, flock and waterline sheet are Boss's kit.
// Each plate is a pure function of the shot-local frame `L` (global `g`); no text and no voice on 16A-16D (Boat RV-23..33).
const G0 = {A: 1350, B: 1390, C: 1412, D: 1460, S: 1504} as const;
const V = (x: number, y: number, z: number): V3 => [x, y, z];
const mixP = (a: [number, number], b: [number, number], k: number): [number, number] => [mix(a[0], b[0], k), mix(a[1], b[1], k)];
const unit = (x: number, z: number): [number, number] => { const l = Math.hypot(x, z) || 1; return [x / l, z / l]; };
const KP: V3 = [0.6, -0.3, -0.5];
const RIVER_X0 = -74;
const G1: V3 = [9.0, 0, -8.0];

// ---- T. rex marks (Film R1.5b)
const TX = {c0: [-2.7, -13.75] as [number, number], c1: [-1.6, -13.35] as [number, number], d1: [-0.5, -12.25] as [number, number], d2: [0.05, -12.6] as [number, number], head16C: 0.33, head16D: 0.85, off: -0.45};
const dist = (a: [number, number], b: [number, number]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const PH = {c0: 0.6 - trexWalkPhase(dist(TX.c0, TX.c1)), c1: 0.6, d1: 0.6 + trexWalkPhase(dist(TX.c1, TX.d1)), d2: 0.6 + trexWalkPhase(dist(TX.c1, TX.d1)) + trexWalkPhase(dist(TX.d1, TX.d2))};
const hold = (ph: number): TRexPose => ({walk: ph, stride: TREX_STALK.stride});
const hd16D = (ph: number): number => (ph <= PH.d1 ? mix(TX.head16C, TX.head16D, lin(PH.c1, PH.d1, ph)) : mix(TX.head16D, TX.off, sm(0, 12 / 14, lin(PH.d1, PH.d2, ph))));
type Rex = {B: Build; place: BeastPlace};
const rexAt = (at: [number, number], heading: number, pose: TRexPose, k: number, haze: number): Rex => {
  const B = buildTRex(pose);
  return {B, place: {at, heading, amb: '#3f4a44', ambK: Math.max(k, 0.42), haze, hazeCol: '#dfe8d4', seed: 71000, sun: [0.55, 0.75, 0.6], glow: trexSunSlice(B)}};
};

// ---- cameras
const CAM_A = camMove([0, 0, -3], [-6, -12], [5.5, 5.0], 1.5, {f: 850, hy: 860, pitch: [4, 4], ease: [0, 1]});
const CAM_B = camMove([0.62, 0, -0.95], [10, 10], 0.75, 0.42, {f: 1000, hy: 700, pitch: [-30, -30]});
const CAM_C = camMove([0.6, 0, -0.5], [9.5, 9.0], [8.6, 8.0], 1.45, {f: 2600, hy: 1010, pitch: [0, 0], cx: -280});
const CAM_D = camMove([0.7, 0, -0.75], [-12, -9], [2.7, 2.5], 0.95, {f: 1300, hy: 730, pitch: [2, 2], cx: 140});
const CAM_S = camMove([0.8, 1.3, -0.6], [-8, -14], [2.7, 2.5], 1.0, {f: 900, hy: 800, pitch: [12, 12], ease: [0, 1]});

// ---- people
type Who = 'K' | 'Y';
const castItem = (who: Who, at: V3, o: Parameters<typeof paintCast>[3], level?: number, k = 0.1, t = 0): Item[] => [
  {at, draw: (q: Painter, cc: YCam) => { paintCast(q, cc, who, o); }},
  ...(level !== undefined ? [waterlineItem(at, level, {L: {amb: '#d6e2c8', k}, t})] : []),
];
const dress = (id: 'man-elder' | 'woman-curly') => dressIsan(PEOPLE[id], id.startsWith('woman') ? 'isan-home-woman' : 'isan-home-man');
const villagerItem = (id: 'man-elder' | 'woman-curly', at: V3, o: {facing: [number, number]; pose: string; face: string; t: number; activity?: string; fig?: Record<string, number>; held?: (q: Painter, a: any, u: number) => void}): Item => ({at, draw: (q: Painter, cc: YCam) => {
  paintFigureAt(q, cc, dress(id), {at, shadow: false, ...o} as any);
}});
const netHeld = (ang: number, fish: boolean, f: number) => (qq: Painter, a: any, u: number) => {
  paintHeldProp(qq, 'hand-net', a.rHand, u, {ang});
  if (fish) paintHeldProp(qq, 'fish', [a.rHand[0] + 0.1 * u, a.rHand[1] - 0.68 * u], u, {ang: -0.5 + 0.4 * Math.sin(f * 1.3), swing: Math.sin(f * 1.7)});
};

const river = (p: Painter, c: YCam, e: Env, items: Item[], o: {jit?: number; part?: number; shake?: number; centre?: number; reeds?: boolean} = {}) => {
  const L = riverLightAt(shadeAt(e.g));
  paintRiver(p, c, {t: e.t, light: L, x0: RIVER_X0, jit: o.jit, extra: [boulderItem(L), ...reedBedItems(L, {t: e.t}), ...fernRowItems(L, {t: e.t, shake: o.shake ?? 0.15, part: o.part ?? 0, centre: o.centre ?? -0.4}), ...items]});
  return L;
};

// ---- 16A: the quiet falls
const SC = {y0: V(-0.9, 0, 0.4), y1: V(-1.8, 0, 0.5), v10: V(-1.6, 0, -0.9), v11: V(-2.2, 0, -0.2), v20: V(2.2, -0.1, -1.4), v21: V(3.4, -0.1, -0.6)};
const S16A: Shot = {cam: CAM_A, paper: '#cfdcc4', vig: 0.2, draw: (p, c, e) => {
  const L = e.L, f = e.g, tk = e.t, k = riverLightAt(shadeAt(f)).k;
  const turn = sm(24, 34, L), face = L < 24 ? 'happy' : 'worried';
  const kf = unit(mix(0.35, 0, turn), mix(1, -1, turn));
  const sc = sm(28, 40, L), crouch = sc > 0.05, bob = 0.03 * Math.sin(L * 1.4) * sc;
  const yAt = L < 28 ? SC.y0 : V(mix(SC.y0[0], SC.y1[0], sc), 0 + bob, mix(SC.y0[2], SC.y1[2], sc));
  const v1At = V(mix(SC.v10[0], SC.v11[0], sc), 0 + bob, mix(SC.v10[2], SC.v11[2], sc));
  const v2At = V(mix(SC.v20[0], SC.v21[0], sc), -0.1 + bob, mix(SC.v20[2], SC.v21[2], sc));
  const frozen = L >= 24, talk = L < 24 ? 'talk' : crouch ? 'surprise' : undefined;
  const lookF = (from: [number, number], to: [number, number]) => unit(mix(from[0], to[0], turn), mix(from[1], to[1], turn));
  const items: Item[] = [
    ...castItem('K', KP, {at: KP, facing: kf, pose: 'P07', face, t: tk, shadow: false, held: netHeld(0.12, true, f)} as any, 0, k, tk),
    villagerItem('man-elder', v1At, {facing: crouch ? unit(-1, 0.4) : lookF([1, 0.4], [0.2, -1]), pose: crouch ? 'P35' : 'P01', face: crouch ? 'scared' : L < 24 ? 'happy' : 'worried', t: tk, activity: talk}),
    waterlineItem(v1At, 0.42, {L: riverLightAt(shadeAt(f)), t: tk, w: 0.3}),
    villagerItem('woman-curly', v2At, {facing: crouch ? unit(1, 0.4) : lookF([-1, 0.4], [-0.3, -1]), pose: crouch ? 'P35' : 'P01', face: crouch ? 'scared' : L < 24 ? 'happy' : 'worried', t: tk, activity: talk}),
    waterlineItem(v2At, 0.4, {L: riverLightAt(shadeAt(f)), t: tk, w: 0.3}),
    ...castItem('Y', yAt, {at: yAt, facing: crouch ? unit(-1, 0.3) : lookF([0.3, 1], [0.2, -1]), pose: crouch ? 'P35' : 'P01', face: crouch ? 'scared' : L < 24 ? 'happy' : 'worried', t: tk, shadow: false, ...(talk ? {activity: talk} : {})} as any),
    ...(L >= 18 && L < 36 ? flockItems(lin(18, 34, L), f) : []),
  ];
  river(p, c, e, items, {shake: L >= 34 && L < 42 ? 0.35 : 0.1});
}};

// ---- 16B: the water (insert; impulse rings around every solid in the water)
const IMPS: Impulse[] = [{f: G0.B + 4, amp: 1.0}, {f: G0.B + 16, amp: 1.4}];
const RING_PTS: V3[] = [V(0.5, 0, -0.55), V(0.72, 0, -0.52), V(0.95, 0, -0.4), V(0.2, 0, -0.9), V(1.0, 0, -0.95)];
const S16B: Shot = {cam: CAM_B, paper: '#cfdcc4', vig: 0.2, draw: (p, c, e) => {
  const f = e.g, L = riverLightAt(shadeAt(f)), tk = e.t;
  const hang = e.L >= 8, fx = 0.85, fz = -0.72, hoop = Array.from({length: 18}, (_, j): V3 => [fx + 0.22 * Math.cos((j / 18) * 6.2832), 0.3, fz + 0.1 * Math.sin((j / 18) * 6.2832)]);
  const netItem: Item = {at: V(fx, 0.1, fz + 0.2), bias: 1, draw: (q: Painter, c2: YCam) => {
    wFill(q, c2, 75000, '#e8e2c8', hoop.map((h): V3 => [h[0], h[1] - 0.14, h[2]]));
    wInk(q, c2, 75001, hoop, {color: '#6a5a3a', weight: 3, closed: true});
    const fw = hang ? 0 : 0.03 * Math.sin(f * 1.7), fy = 0.27 + (hang ? -0.02 : 0.015 * Math.sin(f * 1.3));
    wFill(q, c2, 75002, '#b8c8d0', [[fx - 0.16 + fw, fy, fz], [fx - 0.02, fy + 0.05, fz], [fx + 0.15 + fw, fy + 0.01, fz], [fx - 0.02, fy - 0.05, fz]]);
    wFill(q, c2, 75003, '#8a9aa4', [[fx + 0.15 + fw, fy + 0.01, fz], [fx + 0.22 + fw, fy + 0.05, fz], [fx + 0.22 + fw, fy - 0.04, fz]]);
  }};
  const items: Item[] = [
    impulseRingsItem(RING_PTS, f, IMPS, L), netItem,
    ...castItem('K', KP, {at: KP, facing: [0, -1], pose: 'P07', face: 'worried', t: tk, shadow: false, held: netHeld(0.12, e.L < 8, f)} as any, 0, L.k, tk),
  ];
  river(p, c, e, items, {jit: shimmerJit(f, IMPS)});
}};

// ---- 16C / 16D: the T. rex
const sniffAt = (L: number): number => { for (const s of [28, 40]) { const a = L - s; if (a >= 0 && a < 12) return Math.max(0.3, a / 12); } return -1; };
const vapItem = (c: YCam, r: Rex, v: number): Item[] => {
  if (v < 0) return [];
  const n = toWorldOf(c, r.B, r.place, r.B.joints['nostril.L.pivot']), dx = G1[0] - n[0], dz = G1[2] - n[2], d = Math.hypot(dx, dz);
  return [vapourItem(n, [dx / d, dz / d], v, {scale: 1.4})];
};
const S16C: Shot = {cam: CAM_C, paper: '#cfdcc4', vig: 0.2, draw: (p, c, e) => {
  const L = e.L, f = e.g, tk = e.t, Lt = riverLightAt(shadeAt(f));
  const k = sm(6, 26, L), at = mixP(TX.c0, TX.c1, k), walking = L < 26;
  const sn = TREX_POSES.sniff(Math.max(0, L / 48));
  const pose: TRexPose = walking ? {...TREX_POSES.stalk(mix(PH.c0, PH.c1, k)), drop: 2.0, neck: 0, yaw: 0.25 * k} : {...sn, ...hold(PH.c1), yaw: 0.25 + (sn.yaw ?? 0)};
  const rex = rexAt(at, TX.head16C, pose, Lt.k, 0.3 * (1 - sm(6, 22, L)));
  const ks = L < 22 ? 0 : sm(28, 36, L), kAt = V(0.6, -0.3, -0.5);
  const items: Item[] = [
    ...beastSlabs(c, rex.B, rex.place, 4), ...vapItem(c, rex, sniffAt(L)),
    ...castItem('K', kAt, {at: kAt, facing: [0, -1], pose: ks > 0.5 ? 'P35' : 'P07', face: 'scared', t: tk, shadow: false} as any, 0, Lt.k, tk),
  ];
  river(p, c, e, items, {part: sm(10, 18, L), shake: L >= 4 && L < 20 ? 0.9 : 0.2});
  void f;
}};
const S16D: Shot = {cam: CAM_D, paper: '#cfdcc4', vig: 0.2, draw: (p, c, e) => {
  const L = e.L, tk = e.t, Lt = riverLightAt(shadeAt(e.g));
  let at: [number, number], heading: number, pose: TRexPose;
  if (L < 16) { const k = sm(0, 16, L); at = mixP(TX.c1, TX.d1, k); heading = mix(TX.head16C, TX.head16D, k); pose = {...TREX_POSES.stalk(mix(PH.c1, PH.d1, k)), drop: 2.0, neck: 0, yaw: -0.1, hd: hd16D}; }
  else if (L < 30) { at = TX.d1; heading = TX.head16D; const u = lin(24, 30, L); pose = L < 24 ? {...TREX_POSES.sniff(0.25 + 0.5 * lin(16, 24, L)), ...hold(PH.d1), yaw: -0.15} : {...TREX_POSES.turn(u, -0.15, -0.6), ...hold(PH.d1)}; }
  else { const k = lin(30, 44, L); at = mixP(TX.d1, TX.d2, k); heading = mix(TX.head16D, TX.off, sm(30, 42, L)); pose = {...TREX_POSES.stalk(mix(PH.d1, PH.d2, k)), neck: 0.3, drop: 0.8, yaw: -0.3 * (1 - k), hd: hd16D}; }
  const rex = rexAt(at, heading, pose, Lt.k, 0.12);
  const kAt = V(0.7, -0.12, -0.75);
  const items: Item[] = [
    ...beastSlabs(c, rex.B, rex.place, 4),
    ...castItem('K', kAt, {at: kAt, facing: [0.25, 1], pose: 'P35', face: 'scared', t: tk, shadow: false, activity: L < 32 ? 'clench' : 'pant'} as any, 0, Lt.k, tk),
  ];
  river(p, c, e, items, {part: 1, shake: L < 16 ? 0.9 : 0.15});
}};

// ---- 16: relief, the pterosaur snatches the fish, the villagers laugh
const SNAG: V3 = [-0.4, 2.0, -4.2];
const GRAB: V3 = [1.0, 1.0, -0.5];
type Fly = {at: V3; heading: number; pose: PteroKitPose};
/** Path of the pterosaur's feet (RIV) by shot-local frame: top-right dive to the net rim at +28, climb past the lens, glide to the snag. */
const feetPath = (L: number): V3 => {
  const P: [number, V3][] = [[10, V(7, 6.5, -9)], [28, GRAB], [42, V(-0.4, 1.8, 1.2)], [56, V(-3.2, 3.0, -2.0)], [72, SNAG]];
  if (L <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (L <= P[i][0]) { const k = lin(P[i - 1][0], P[i][0], L), e = i === 2 || i === 3 ? k : k * k * (3 - 2 * k); return V(mix(P[i - 1][1][0], P[i][1][0], e), mix(P[i - 1][1][1], P[i][1][1], k), mix(P[i - 1][1][2], P[i][1][2], e)); }
  return SNAG;
};
const flyAt = (L: number): Fly => {
  let pose: PteroKitPose;
  if (L < 26) pose = PTERO_POSES.dive(lin(10, 26, L));
  else if (L < 36) pose = PTERO_POSES.grab(lin(24, 36, L));
  else if (L < 58) pose = PTERO_POSES.climb(lin(36, 58, L));
  else if (L < 64) pose = PTERO_POSES.flap((L - 58) / 7.5);
  else if (L < 76) pose = PTERO_POSES.land(lin(64, 76, L));
  else if (L < 82) pose = PTERO_POSES.stand();
  else if (L < 96) pose = PTERO_POSES.gulp(lin(82, 96, L));
  else if (L >= 100 && L < 116) pose = PTERO_POSES.preen(lin(100, 116, L));
  else pose = PTERO_POSES.stand();
  const a = feetPath(L), b = feetPath(L + 1), h = Math.atan2(b[2] - a[2], b[0] - a[0]);
  return {at: a, heading: L < 28 ? Math.atan2(GRAB[2] - a[2], GRAB[0] - a[0]) : L < 70 ? h : mix(h, 1.0, sm(70, 78, L)), pose};
};
const pteroItem = (L: number): Item[] => {
  if (L < 10) return [];
  const fl = flyAt(L), B = buildPterosaur(fl.pose);
  const dummy = (c: YCam) => {
    const place: BeastPlace = {at: [fl.at[0], fl.at[2]], heading: fl.heading, ground: fl.at[1], haze: 0.05, hazeCol: '#dfe8d4', seed: 73000, shadowOp: 0};
    const feet = toWorldOf(c, B, place, B.anchors.feet);
    return {place: {...place, at: [place.at[0] + fl.at[0] - feet[0], place.at[1] + fl.at[2] - feet[2]] as [number, number], ground: fl.at[1] + (fl.at[1] - feet[1])}};
  };
  return [{at: fl.at, bias: 3, draw: (p: Painter, c: YCam) => {
    const {place} = dummy(c);
    paintBeast(p, c, B, place);
    if (L >= 28 && L < 92) {
      const w = toWorldOf(c, B, place, B.anchors.feet), g = camPoint(c, w);
      if (g) paintHeldProp(p, 'fish', g, camUnit(c, w), {ang: 1.2, swing: Math.sin(L * 1.4)});
    }
  }}];
};
/** The dead snag the pterosaur lands on (standing in the river, 4.2 m out): a bare trunk with a fork, set dressing for the perch. */
const snagItem = (): Item => ({at: V(SNAG[0], 0, SNAG[2] - 0.2), draw: (p: Painter, c: YCam) => {
  const [x, , z] = SNAG, top = SNAG[1] - 0.25;
  wFill(p, c, 77000, '#4a3a2c', [[x - 0.1, -0.3, z], [x + 0.1, -0.3, z], [x + 0.05, top, z], [x - 0.05, top, z]]);
  wFill(p, c, 77001, '#4a3a2c', [[x + 0.02, top - 0.5, z], [x + 0.08, top - 0.5, z], [x + 0.5, top + 0.1, z], [x + 0.42, top + 0.12, z]]);
  wFill(p, c, 77002, '#4a3a2c', [[x - 0.02, top - 0.2, z], [x - 0.06, top - 0.2, z], [x - 0.45, top + 0.15, z], [x - 0.38, top + 0.18, z]]);
}});
const waterShadow = (L: number): Item[] => {
  if (L < 6 || L >= 30) return [];
  const u = lin(6, 28, L), x = mix(5.5, GRAB[0] + 0.3, u), z = mix(-7, -0.6, u), r = 0.5 + 0.4 * u;
  return [{at: V(x, 0, z), bias: -0.05, draw: (p: Painter, c: YCam) => { wFill(p, c, 74000, '#4f6a66', [[x - r, 0.015, z], [x, 0.015, z - r * 0.5], [x + r, 0.015, z], [x, 0.015, z + r * 0.5]]); }}];
};
const S16: Shot = {cam: CAM_S, paper: '#cfdcc4', vig: 0.2, draw: (p, c, e) => {
  const L = e.L, f = e.g, tk = e.t, Lt = riverLightAt(shadeAt(f));
  const rise = sm(0, 12, L), kAt = V(mix(0.7, 0.6, rise), -0.3 + 0.18 * (1 - rise), mix(-0.75, -0.5, rise));
  const grabbed = L >= 28, face = L < 12 ? 'surprised' : L < 36 ? (L < 24 ? 'happy' : 'surprised') : 'angry';
  const shaking = L >= 40 && L < 64, talkOn = L >= 36 && L < 88;
  const laugh = L >= 60 && L < 110, lt = Math.max(0, (L - 60) / FPS);
  const lf = (ph: number) => { const q = laughFig(lt + ph, {amp: 6, hz: 1.5}); return {lean: safeLean(q.lean), rise: q.rise}; };
  const items: Item[] = [
    snagItem(), ...waterShadow(L),
    ...castItem('K', kAt, {at: kAt, facing: [0, -1], pose: L < 12 ? 'P35' : 'P07', face, t: tk, shadow: false, ...(talkOn ? {activity: 'talk'} : {}),
      held: netHeld(shaking ? 0.3 + 0.25 * Math.sin(L * 0.9) : 0.12, !grabbed && L >= 6, f)} as any, 0, Lt.k, tk),
    villagerItem('man-elder', V(-0.5, 0, -1.4), {facing: [0.5, -0.6], pose: L < 8 ? 'P35' : 'P01', face: laugh ? 'laugh' : 'scared', t: tk, fig: laugh ? lf(0) : undefined}),
    waterlineItem(V(-0.5, 0, -1.4), 0.42, {L: Lt, t: tk, w: 0.3}),
    villagerItem('woman-curly', V(-1.0, 0, -1.0), {facing: [0.6, -0.5], pose: L < 14 ? 'P35' : 'P01', face: laugh ? 'laugh' : 'scared', t: tk, fig: laugh ? lf(0.3) : undefined}),
    waterlineItem(V(-1.0, 0, -1.0), 0.4, {L: Lt, t: tk, w: 0.3}),
    villagerItem('woman-curly', V(2.4 - 0.3 * sm(0, 14, L), -0.1, -1.0), {facing: [-0.6, -0.5], pose: 'P01', face: laugh ? 'laugh' : 'surprised', t: tk, fig: laugh ? lf(0.6) : undefined}),
    waterlineItem(V(2.4 - 0.3 * sm(0, 14, L), -0.1, -1.0), 0.4, {L: Lt, t: tk, w: 0.3}),
  ];
  river(p, c, e, items, {centre: 1.0, shake: L < 10 ? 0.8 * Math.sin(Math.PI * L / 10) : 0.1});
  pteroItem(L).forEach((it) => it.draw(p, c));   // the flier is the top layer: it passes the lens and perches before the forest wall
  void hardFill; void B1; void kneeLevel; void camOf;
}};

export const RIVER_SHOTS: Record<string, Shot> = {'16A': S16A, '16B': S16B, '16C': S16C, '16D': S16D, '16': S16};
