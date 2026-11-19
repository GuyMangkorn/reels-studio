// Standalone proof entry for EDU-EP30 asset tickets, topic `dam` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-dam.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {Proof30, type ProofDef} from './shot';
import {CAM_LF02, LF02_DAM, crewAtDam} from './looks';
import {DAM_CAMS, QUEUE_LEN, QUEUE_PATH, STONE_AT, paintDam, paintStone, queuePoint} from './dam';
import {hardFill} from '../kit/draw';
import {paintBox} from '../kit/world';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';

// T10 (dam: east approach, queue path, reflect, stone, near slope). Newsreel off (strength 0). Camera lines from the B04 sheets.
const CAM_D30_QUEUE = DAM_CAMS.queue, CAM_D30_SH05 = DAM_CAMS.sh05, CAM_D30_JAM = DAM_CAMS.jam, CAM_D30_SH06 = DAM_CAMS.sh06;
const OFF = () => ({strength: 0, tint: 'warm' as const, tintAmount: 1, pop: 0});
/** A flat test dot (0.3 m) at a world point, red, so it can be measured in the frame. */
const dot = (p: Painter, c: YCam, seed: number, at: V3, d = 0.3, col = '#d8261c') => {
  const s = camPoint(c, [at[0], at[1] + d / 2, at[2]]);
  if (!s) return;
  const r = (d / 2) * camUnit(c, at);
  hardFill(p, seed, col, Array.from({length: 16}, (_, k) => [s[0] + r * Math.cos((k / 16) * 6.283), s[1] + r * Math.sin((k / 16) * 6.283)] as Pt));
};
const PROOFS: ProofDef[] = [
  {id: 'D30-LF02', N: 30, reel: OFF, cam: () => CAM_LF02, paint: (p, _L, c) => { paintDam(p, c, 38000, {...LF02_DAM, reflect: () => crewAtDam(p, c, 'LF02', 2, true)}); crewAtDam(p, c, 'LF02', 2); }},
  {id: 'D30-queue', N: 30, reel: OFF, cam: () => CAM_D30_QUEUE, paint: (p, _L, c) => {
    paintDam(p, c, 38000);
    for (let k = 0; 7.6 + k * 1.4 <= QUEUE_LEN; k++) dot(p, c, 8000 + k, queuePoint(7.6 + k * 1.4));
    void QUEUE_PATH;
  }},
  {id: 'D30-sh05', N: 30, reel: OFF, cam: () => CAM_D30_SH05, paint: (p, _L, c) => {
    paintDam(p, c, 38000);
    for (let k = 0; k < 8; k++) dot(p, c, 8100 + k, queuePoint(4.6 + k * 1.4));
  }},
  {id: 'D30-jam', N: 30, reel: OFF, cam: () => CAM_D30_JAM, paint: (p, _L, c) => { paintDam(p, c, 38000); paintStone(p, c, STONE_AT, 8200); }},
  {id: 'D30-sh06', N: 30, reel: OFF, cam: () => CAM_D30_SH06, paint: (p, _L, c) => {
    paintDam(p, c, 38000, {nearSlope: true});
    paintBox(p, c, 8300, {x0: -6.25, x1: -6.15, y0: 0.36, y1: 1.61, z0: -4.8, z1: -4.7}, '#2a6fd0', {}, {});   // 1.25 m test post at the GUNNER-1 mark
  }},
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
