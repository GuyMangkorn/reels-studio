// Standalone proof entry for EDU-EP30 asset tickets, topic `flock` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-flock.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {Proof30, type ProofDef} from './shot';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {paintEmu} from './flock';
import {EMU_POSES, emuHop} from './emu';
import {KP_AT, KP_EYE} from './looks';
import {SUN, paintGum, paintKpPatch, paintPadGround, paintPadSky, paintScrub, paintWheatRidges, setNoClearing} from './paddock';

// T35 FL30-hop: the KP camera and set as looks.ts `kp`, newsreel off (strength 0); one EMU-HERO per frame. Frames 0-9 of emuHop with offset[1] as `air`; the ground
// point moves by the hop's lateral offset (heading PI, so the offset is +z). FL30-stand is the single air-0 frame used for the unchanged-look diff.
const KP_CAM: YCam = {x: KP_EYE[0], y: KP_EYE[1], z: KP_EYE[2], yaw: 0, pitch: 0, f: 1000, hy: 760};
const kpSet = (p: Painter, c: YCam) => {
  setNoClearing(true);
  paintPadSky(p, c);
  paintScrub(p, c, 30100, 300);
  paintPadGround(p, c, 30300, {eaten: 0});
  paintKpPatch(p, c, 30650);
  paintWheatRidges(p, c, 30600, {r0: 6});
  paintGum(p, c, 30700, [16, 0, -60], 14);
};
const NO_REEL = () => ({strength: 0, tint: 'warm' as const, tintAmount: 1, pop: 0});
const PROOFS: ProofDef[] = [
  {id: 'FL30-hop', N: 10, cam: () => KP_CAM, reel: NO_REEL, paint: (p, L, c) => {
    kpSet(p, c);
    const {pose, offset} = emuHop(L, {side: 1, dist: 0.6});
    paintEmu(p, c, {at: [KP_AT[0] + offset[0], KP_AT[1], KP_AT[2] + offset[2]], air: offset[1], heading: Math.PI, pose, scale: 1, seed: 36000, hero: true}, {sun: SUN.morning});
    setNoClearing(false);
  }},
  {id: 'FL30-stand', N: 1, cam: () => KP_CAM, reel: NO_REEL, paint: (p, _L, c) => {
    kpSet(p, c);
    paintEmu(p, c, {at: KP_AT, heading: Math.PI, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}, {sun: SUN.morning});
    setNoClearing(false);
  }},
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
