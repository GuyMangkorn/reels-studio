// Standalone proof entry for EDU-EP30 asset tickets, topic `paddock` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-paddock.tsx --gl=angle
// T09 (paddock states, 2026-11-19): P30-LF01, P30-P2, P30-P3-m0/m05/m1, P30-ruts, P30-fence-rev, P30-lean. Newsreel off (strength 0).
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {paintBox} from '../kit/world';
import type {YCam} from '../kit/ycam';
import {camLine, Proof30, type ProofDef} from './shot';
import {paintFarFlock} from './flock';
import {CAM_LF01, paintPaddock} from './looks';
import {
  paintCamp, paintClearing, paintFarmhouse, paintFence, paintGum, paintNearStalks, paintPadGround, paintPadSky, paintScrub, paintVerge, paintWheatRidges, type PadLightArg,
} from './paddock';

const OFF = () => ({strength: 0, tint: 'warm' as const, tintAmount: 0});

/** The paddock stack of `paintPaddock` with the T09 options (light mix, stubble, eaten ridges); `fence: false` leaves the fence to the caller. */
export type StateOpts = {light?: PadLightArg; eaten?: number; stubble?: number; far?: {n: number; x: [number, number]; z: [number, number]}; fence?: boolean; verge?: boolean};
export const paintPaddockStates = (p: Painter, c: YCam, o: StateOpts, cast: () => void = () => {}) => {
  const light = o.light ?? 'morning';
  paintPadSky(p, c, light);
  paintScrub(p, c, 30100, 300);
  paintScrub(p, c, 30200, 170, '#7a8264');
  paintPadGround(p, c, 30300, {eaten: o.eaten, light});
  paintFarmhouse(p, c, 30400, [-90, 0, -160]);
  if (o.far) paintFarFlock(p, c, 30500, o.far.n, o.far.x, o.far.z);
  paintWheatRidges(p, c, 30600, {light, stubble: o.stubble, eaten: o.eaten});
  paintGum(p, c, 30700, [-22, 0, -38], 14, light);
  paintGum(p, c, 30720, [36, 0, -70], 12, light);
  paintGum(p, c, 30740, [18, 0, 22], 10, light);
  paintCamp(p, c, 30800, light);
  if (o.verge) paintVerge(p, c, 30850);
  // seen from the track (camera z > 6) the fence is nearer than the clearing, so the clearing goes first; from the paddock side it goes last
  const fromTrack = c.z > 6;
  if (fromTrack) paintClearing(p, c, 31200);
  cast();
  if (o.fence !== false) paintFence(p, c, 31000, -60, 60, light);
  if (!fromTrack) paintClearing(p, c, 31200);
};

const P2: YCam = camLine({eye: [0, 22, 12], yaw: 0, pitch: -40, f: 820, hy: 960});
const P3: YCam = camLine({eye: [-1.0, 1.55, 2.4], yaw: 160, pitch: 0, f: 900, hy: 820});
const RUTS: YCam = camLine({eye: [-2, 1.5, 14], yaw: 0, pitch: -10, f: 900, hy: 860});
const REV: YCam = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
/** B05-SH04 fence birds F2, HERO, F3, F4 at their sheet x (the ticket asks for five posts; the fifth x is not decided there). */
const BIRDS_X = [-1.4, -0.5, 0.5, 1.4];

const one = (id: string, cam: YCam, paint: ProofDef['paint']): ProofDef => ({id, N: 1, cam: () => cam, reel: OFF, paint});
const P3_PROOF = (id: string, m: number, stubble: number) => one(id, P3, (p, _L, c) => paintPaddockStates(p, c, {light: m, eaten: 0.7, stubble}));

const PROOFS: ProofDef[] = [
  one('P30-LF01', CAM_LF01, (p, _L, c) => paintPaddock(p, c, {eaten: 0.3, truck: [-7, 0, 9.5], far: {n: 0, x: [0, 0], z: [0, 0]}}, () => {})),
  one('P30-P2', P2, (p, _L, c) => paintPaddockStates(p, c, {eaten: 0.4, far: {n: 200, x: [-90, 90], z: [-200, -62]}})),
  P3_PROOF('P30-P3-m0', 0, 0.4), P3_PROOF('P30-P3-m05', 0.5, 0.7), P3_PROOF('P30-P3-m1', 1, 1.0),
  one('P30-ruts', RUTS, (p, _L, c) => paintPaddockStates(p, c, {eaten: 0.4})),
  one('P30-fence-rev', REV, (p, _L, c) => paintPaddockStates(p, c, {light: 1, eaten: 0.7, stubble: 0.4, verge: true, fence: false}, () => {
    BIRDS_X.forEach((x, i) => paintBox(p, c, 32000 + i, {x0: x - 0.15, x1: x + 0.15, y0: 0, y1: 1.0, z0: 5.2, z1: 5.5}, '#3a2f24', {}, {ink: true}));
    paintFence(p, c, 31000, -60, 60, 1);
  })),
  // lean check (not a ticket row): stalks 1-3 m ahead of a muzzle at (0, 0.72, -1.1) tilt away from it, tilt 0.5 rad at 1 m falling to 0 at 3 m
  one('P30-lean', camLine({eye: [0.6, 0.9, 1.2], yaw: 0, pitch: 4, f: 1100, hy: 900}), (p, _L, c) => {
    paintPaddockStates(p, c, {eaten: 0.2});
    const spots: V3[] = Array.from({length: 14}, (_, i) => [-1.4 + 0.22 * i, 0, -2.2 - 0.25 * (i % 4)] as V3);
    paintNearStalks(p, c, 31800, spots, {lean: (x, z) => Math.max(0, 0.5 * (1 - (Math.hypot(x, z + 1.1) - 1) / 2)), leanFrom: [0, 0.72, -1.1]});
  }),
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
