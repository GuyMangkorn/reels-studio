// Standalone proof entry for EDU-EP30 asset tickets, topic `cast` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-cast.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {wFill} from '../kit/world';
import {FARMER, GUNNER1, GUNNER2, LOADER_AT, MEREDITH, PAN_R, loaderLift, paintCrew, paintCrewPose, paintGunnerFists, paintSeatedGunner, rackGunnerOpts, type GunnerOpts, type GunnerView} from './cast';
import {paintDam} from './dam';
import {CAM_LF01} from './looks';
import {GUN_PX, buildLewisGun, lewisAnchors, lewisCock, lewisRecoil, paintLewisPanTicks, placeBuild} from './props';
import {camLine, Proof30, stubPaint, type ProofDef} from './shot';

const OFF = () => ({strength: 0, tint: 'warm' as const, tintAmount: 1, pop: 0});

// T11 (Boss, 2026-11-19): GUNNER-1 `new: seated-gunner` in four views, frame 0 = j 0 (no round), frame 1 = j 1 (round k 0: gunner jolt and gun recoil).
// Gun G1 and seat per the ticket; gun first or gunner first by depth (front and 3/4: gunner behind the gun; back and right: gunner nearer the lens).
export type GunnerProof = {id: string; cam: YCam; view: GunnerView; seat: V3; gun: V3; heading: number; gunFirst: boolean};
export const GUNNER_PROOFS: GunnerProof[] = [
  {id: 'C30-gunner-front', cam: CAM_LF01, view: 'front', seat: [0, 0, 0.85], gun: [0, 0, 0], heading: -Math.PI / 2, gunFirst: false},
  {id: 'C30-gunner-back', cam: camLine({eye: [0.4, 1.0, 1.65], yaw: -3, pitch: 0, f: 900, hy: 860}), view: 'back', seat: [0, 0, 0.85], gun: [0, 0, 0], heading: -Math.PI / 2, gunFirst: true},
  {id: 'C30-gunner-right', cam: camLine({eye: [-0.7, 2.0, 2.1], yaw: 0, pitch: 0, f: 950, hy: 860}), view: 'right', seat: [-1.2, 1.1, 0], gun: [-0.35, 1.1, 0], heading: 0, gunFirst: true},
  {id: 'C30-gunner-34', cam: camLine({eye: [-4.6, 1.45, -3.9], yaw: -57, pitch: -12, f: 950, hy: 800}), view: 'front34', seat: [-6.2, 0.36, -4.75], gun: [-5.6, 0.32, -5.0], heading: 0, gunFirst: false},
];

/** Gunner and gun anchors of a proof at frame L (L 1 = round k 0). */
export const gunnerProofAt = (d: GunnerProof, L: number) => {
  const o = {recoil: lewisRecoil(L === 1 ? 1 : 0, [1])};
  return {o, a: lewisAnchors(d.gun, d.heading, o), jolt: L === 1 ? 1 : 0};
};

export const gunnerProof = (d: GunnerProof): ProofDef => ({id: d.id, N: 2, cam: () => d.cam, reel: OFF, paint: (p: Painter, L, c) => {
  stubPaint(p, c);
  const {o, a, jolt} = gunnerProofAt(d, L);
  const gun = () => { placeBuild(p, c, buildLewisGun(o), d.gun, d.heading, {seed: 33300}); paintLewisPanTicks(p, c, 33400, d.gun, d.heading, 0, o); };
  const man = () => paintSeatedGunner(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
  const fists = () => paintGunnerFists(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
  // T36 r2 + T12 G0: in front and 3/4 the gun is nearer the lens than the gunner, so the fists are repainted over the grip and stock.
  if (d.gunFirst) { gun(); man(); } else { man(); gun(); fists(); }
}});

/** T12 G0 helper: the 3/4 view with the man and his fists but no gun, to measure that the gun never paints across the fist (pixel diff against `C30-gunner-34`). */
const gunner34NoGun = (d: GunnerProof): ProofDef => ({id: `${d.id}-nogun`, N: 2, cam: () => d.cam, reel: OFF, paint: (p: Painter, L, c) => {
  stubPaint(p, c);
  const {a, jolt} = gunnerProofAt(d, L);
  paintSeatedGunner(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
  paintGunnerFists(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
}});

// T12 (Boss, 2026-11-20): crew and farmer poses. Cameras as the ticket's Proof section (the P44 full test view looks -z, yaw 0: the ticket's yaw 180 faces away from the figure).
export const CAM_SALUTE = camLine({eye: [-8.5, 1.3, 15.2], yaw: 0, f: 900, hy: 860});
export const CAM_P44 = camLine({eye: [-1.6, 0.6, -1.0], yaw: -6, pitch: 6, f: 1020, hy: 900});
export const CAM_P44_FULL = camLine({eye: [-2.4, 1.2, 1.0], yaw: 0, f: 900, hy: 860});
export const CAM_LOADER = camLine({eye: [0.5, 1.2, -2.2], yaw: 180, pitch: -8, f: 1100, hy: 860});
export const CAM_FARMER = camLine({eye: [-2.2, 1.45, 7.6], yaw: -1, pitch: -2, f: 900, hy: 860});
export const AT = {meredith: [-8.5, 0, 12.6] as V3, gunner1: [-7.3, 0, 12.6] as V3, gunner2: [-6.1, 0, 12.6] as V3, p44: [-2.4, 0, -2.2] as V3, farmer: [-2.5, 0, 5.2] as V3, gun: [0, 0, 0] as V3, p30: [-0.6, 0, 1.05] as V3, kneel: [0.75, 0, 0.45] as V3};
export const GUN_HEADING = -Math.PI / 2;
/** Pan anchor (top face centre) of G1 at the origin, barrel -z (T13 `lewisAnchors`): (0, 0.650, 0.184). */
export const loaderPan = () => lewisAnchors(AT.gun, GUN_HEADING, {recoil: lewisRecoil(0, [1])}).pan;

/** The loose pan the loader holds: a flat drum (radius `PAN_R`, 0.044 thick, top face at `top`) of the gun's pan colours, painted in world space. */
const paintHeldPan = (p: Painter, c: YCam, seed: number, top: V3) => {
  const ring = (y: number, r: number): V3[] => Array.from({length: 20}, (_, i) => [top[0] + r * Math.cos((i / 20) * Math.PI * 2), y, top[2] + r * Math.sin((i / 20) * Math.PI * 2)]);
  const lo = ring(top[1] - 0.044, PAN_R), hi = ring(top[1], PAN_R);
  for (let i = 0; i < 20; i++) { const j = (i + 1) % 20; wFill(p, c, seed + i, GUN_PX.magRim, [lo[i], lo[j], hi[j], hi[i]]); }
  wFill(p, c, seed + 30, GUN_PX.magRim, hi);
  wFill(p, c, seed + 31, GUN_PX.mag, ring(top[1] + 0.001, PAN_R * 0.86));
};

export const CREW_PROOFS: ProofDef[] = [
  {id: 'C30-crew-salute', N: 29, cam: () => CAM_SALUTE, reel: OFF, paint: (p: Painter, L, c) => {
    stubPaint(p, c);
    paintCrew(p, c, GUNNER2, AT.gunner2, {pose: 'P01', t: 1.2, seed: 34300, hat: 'slouch', upLeft: true});
    paintCrew(p, c, GUNNER1, AT.gunner1, {pose: 'P01', t: 1.2, seed: 34200, hat: 'slouch', upLeft: true});
    paintCrewPose(p, c, MEREDITH, AT.meredith, {pose: 'salute', L, seed: 34100});
  }},
  {id: 'C30-crew-kit', N: 1, cam: () => CAM_LF01, reel: OFF, paint: (p: Painter, _L, c) => {
    stubPaint(p, c);
    paintCrew(p, c, GUNNER2, AT.kneel, {pose: 'P34', t: 1.2, seed: 34500, hat: 'slouch', upLeft: true});
    paintCrew(p, c, MEREDITH, AT.p30, {pose: 'P30', t: 1.2, seed: 34400, hat: 'slouch', upLeft: true, faceState: {look: [0, -0.2]}});
  }},
  {id: 'C30-crew-p44back', N: 1, cam: () => CAM_P44, reel: OFF, paint: (p: Painter, _L, c) => { stubPaint(p, c); paintCrewPose(p, c, MEREDITH, AT.p44, {pose: 'p44-back', L: 0, seed: 34600}); }},
  {id: 'C30-crew-p44back-full', N: 1, cam: () => CAM_P44_FULL, reel: OFF, paint: (p: Painter, _L, c) => { stubPaint(p, c); paintCrewPose(p, c, MEREDITH, AT.p44, {pose: 'p44-back', L: 0, seed: 34600}); }},
  {id: 'C30-crew-loader', N: 47, cam: () => CAM_LOADER, reel: OFF, paint: (p: Painter, L, c) => {
    stubPaint(p, c);
    const o = {recoil: lewisRecoil(0, [1])}, pan = loaderPan(), fists: ((q: Painter) => void)[] = [];
    paintCrewPose(p, c, GUNNER2, LOADER_AT, {pose: 'loader', L, seed: 34700, pan, onFists: (r) => fists.push(r)});
    placeBuild(p, c, buildLewisGun(o), AT.gun, GUN_HEADING, {seed: 33300});
    paintLewisPanTicks(p, c, 33400, AT.gun, GUN_HEADING, 0, o);
    if (loaderLift(L) > 0.002) paintHeldPan(p, c, 34800, [pan[0], pan[1] + loaderLift(L), pan[2]]);
    fists.forEach((r) => r(p));
  }},
  {id: 'C30-crew-farmer', N: 61, cam: () => CAM_FARMER, reel: OFF, paint: (p: Painter, L, c) => { stubPaint(p, c); paintCrewPose(p, c, FARMER, AT.farmer, {pose: 'farmer', L, seed: 34900}); }},
];

// T17 (Boss, 2026-11-20): GUNNER-1 racks the cocking handle and groans at the gun, B04-SH06 (local 0-23). Camera: the sheet line, eye (-4.6, 1.45, -3.9) yaw -57 -> eye (-4.68, 1.45, -3.95)
// yaw -55, pitch -12, f 950, hy 800, ease-in-out over the shot. Newsreel off; the T10 dam with `nearSlope`.
export const RACK = {seat: [-6.2, 0.36, -4.75] as V3, gun: [-5.6, 0.32, -5.0] as V3, heading: 0, N: 24};
const easeIOr = (t: number) => t * t * (3 - 2 * t);
export const rackCam = (L: number): YCam => { const u = easeIOr(Math.max(0, Math.min(1, L / (RACK.N - 1)))); return camLine({eye: [-4.6 - 0.08 * u, 1.45, -3.9 - 0.05 * u], yaw: -57 + 2 * u, pitch: -12, f: 950, hy: 800}); };
/** Gun anchors of the rack at frame L (cock drawn by `lewisCock`), the knob/grip/stock points and the GUNNER-1 options. */
export const rackAt = (L: number) => {
  const a = lewisAnchors(RACK.gun, RACK.heading, {cock: lewisCock(L)}), cock = (k: number) => lewisAnchors(RACK.gun, RACK.heading, {cock: k}).cock;
  return {a, opts: {...rackGunnerOpts(L, {cock, grip: a.grip, stock: a.stock}), view: 'front34', t: 1.2, seed: 33200} as GunnerOpts};
};
const rackProof: ProofDef = {id: 'C30-rack', N: RACK.N, cam: rackCam, reel: OFF, paint: (p: Painter, L, c) => {
  paintDam(p, c, 38000, {nearSlope: true});
  const {opts} = rackAt(L), co = {cock: lewisCock(L)};
  paintSeatedGunner(p, c, GUNNER1, RACK.seat, opts);
  placeBuild(p, c, buildLewisGun(co), RACK.gun, RACK.heading, {seed: 33300}); paintLewisPanTicks(p, c, 33400, RACK.gun, RACK.heading, 0);
  paintGunnerFists(p, c, GUNNER1, RACK.seat, opts);
}};

const PROOFS: ProofDef[] = [...GUNNER_PROOFS.map(gunnerProof), gunner34NoGun(GUNNER_PROOFS[3]), ...CREW_PROOFS, rackProof];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
