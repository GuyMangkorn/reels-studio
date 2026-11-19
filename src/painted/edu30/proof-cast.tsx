// Standalone proof entry for EDU-EP30 asset tickets, topic `cast` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-cast.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import type {YCam} from '../kit/ycam';
import {GUNNER1, paintGunnerFists, paintSeatedGunner, type GunnerView} from './cast';
import {CAM_LF01} from './looks';
import {buildLewisGun, lewisAnchors, lewisRecoil, paintLewisPanTicks, placeBuild} from './props';
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

const gunnerProof = (d: GunnerProof): ProofDef => ({id: d.id, N: 2, cam: () => d.cam, reel: OFF, paint: (p: Painter, L, c) => {
  stubPaint(p, c);
  const {o, a, jolt} = gunnerProofAt(d, L);
  const gun = () => { placeBuild(p, c, buildLewisGun(o), d.gun, d.heading, {seed: 33300}); paintLewisPanTicks(p, c, 33400, d.gun, d.heading, 0, o); };
  const man = () => paintSeatedGunner(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
  const fists = () => paintGunnerFists(p, c, GUNNER1, d.seat, {view: d.view, grip: a.grip, stock: a.stock, jolt, t: 1.2, seed: 33200});
  // T36 r2: the front gun is nearer the lens than the gunner, so the fists are repainted over the grip and stock.
  if (d.gunFirst) { gun(); man(); } else { man(); gun(); if (d.view === 'front') fists(); }
}});

const PROOFS: ProofDef[] = GUNNER_PROOFS.map(gunnerProof);

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
