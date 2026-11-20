// Standalone proof entry for EDU-EP30 asset tickets, topic `paddock` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-paddock.tsx --gl=angle
// T09 (paddock states, 2026-11-19; r3): P30-LF01, P30-P2, P30-P2-bare, P30-LF01-scene, P30-P3-m0/m05/m1, P30-ruts, P30-fence-rev, P30-lean. Newsreel off (strength 0).
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {camLine, Proof30, type ProofDef} from './shot';
import {CAM_LF01, paintPaddock} from './looks';
import {paintNearStalks, paintPaddockScene} from './paddock';

const OFF = () => ({strength: 0, tint: 'warm' as const, tintAmount: 0});

const P2: YCam = camLine({eye: [0, 22, 12], yaw: 0, pitch: -40, f: 820, hy: 960});
const P3: YCam = camLine({eye: [-1.0, 1.55, 2.4], yaw: 160, pitch: 0, f: 900, hy: 820});
const RUTS: YCam = camLine({eye: [-2, 1.5, 14], yaw: 0, pitch: -10, f: 900, hy: 860});
const REV: YCam = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
/** B05-SH04 fence birds F2, HERO, F3, F4 at their sheet x (the ticket asks for five posts; the fifth x is not decided there). */
const BIRDS_X = [-1.4, -0.5, 0.5, 1.4];

const one = (id: string, cam: YCam, paint: ProofDef['paint']): ProofDef => ({id, N: 1, cam: () => cam, reel: OFF, paint});
const P3_PROOF = (id: string, m: number, stubble: number) => one(id, P3, (p, _L, c) => paintPaddockScene(p, c, {light: m, eaten: 0.7, stubble}));

const PROOFS: ProofDef[] = [
  one('P30-LF01', CAM_LF01, (p, _L, c) => paintPaddock(p, c, {eaten: 0.3, truck: [-7, 0, 9.5], far: {n: 0, x: [0, 0], z: [0, 0]}}, () => {})),
  one('P30-P2', P2, (p, _L, c) => paintPaddockScene(p, c, {eaten: 0.4, far: {n: 200, x: [-90, 90], z: [-200, -62]}})),
  one('P30-P2-bare', P2, (p, _L, c) => paintPaddockScene(p, c, {eaten: 0, bare: true})),
  one('P30-LF01-scene', CAM_LF01, (p, _L, c) => paintPaddockScene(p, c, {eaten: 0.3, far: {n: 0, x: [0, 0], z: [0, 0]}})),
  one('P30-LF01-locked', CAM_LF01, (p, _L, c) => paintPaddock(p, c, {eaten: 0.3, truck: null, far: {n: 0, x: [0, 0], z: [0, 0]}}, () => {})),
  P3_PROOF('P30-P3-m0', 0, 0.4), P3_PROOF('P30-P3-m05', 0.5, 0.7), P3_PROOF('P30-P3-m1', 1, 1.0),
  one('P30-ruts', RUTS, (p, _L, c) => paintPaddockScene(p, c, {eaten: 0.4})),
  one('P30-fence-rev', REV, (p, _L, c) => paintPaddockScene(p, c, {light: 1, eaten: 0.7, stubble: 0.4, verge: true, wire: {wireW: 2.5, wireCol: '#3e3226'}}, () => {
    BIRDS_X.forEach((x, i) => paintBox(p, c, 32000 + i, {x0: x - 0.15, x1: x + 0.15, y0: 0, y1: 1.0, z0: 5.2, z1: 5.5}, '#3a2f24', {}, {ink: true}));
  })),
  // lean check (not a ticket row): stalks 1-3 m ahead of a muzzle at (0, 0.72, -1.1) tilt away from it, tilt 0.5 rad at 1 m falling to 0 at 3 m
  one('P30-lean', camLine({eye: [0.6, 0.9, 1.2], yaw: 0, pitch: 4, f: 1100, hy: 900}), (p, _L, c) => {
    paintPaddockScene(p, c, {eaten: 0.2});
    const spots: V3[] = Array.from({length: 14}, (_, i) => [-1.4 + 0.22 * i, 0, -2.2 - 0.25 * (i % 4)] as V3);
    paintNearStalks(p, c, 31800, spots, {lean: (x, z) => Math.max(0, 0.5 * (1 - (Math.hypot(x, z + 1.1) - 1) / 2)), leanFrom: [0, 0.72, -1.1]});
  }),
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
