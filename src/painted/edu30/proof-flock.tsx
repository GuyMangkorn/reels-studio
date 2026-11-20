// Standalone proof entry for EDU-EP30 asset tickets, topic `flock` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-flock.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {Proof30, type ProofDef} from './shot';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import {paintEmu, paintFlock, paintFarFlock, buffetRow, headsField, scatter, burst, paintBurstDust, halves, halvesDust, fenceBirds, slowLine, slowDust, HEADS_HERO} from './flock';
import {EMU_POSES, emuHop} from './emu';
import {KP_AT, KP_EYE} from './looks';
import {SUN, paintGum, paintKpPatch, paintPadGround, paintPadSky, paintScrub, paintWheatRidges, paintPaddockScene, setNoClearing} from './paddock';
import {camLine} from './shot';

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

// T08 (flock motion in the paddock, 2026-11-20): FL30-buffet, FL30-heads, FL30-scatter, FL30-burst, FL30-halves, FL30-fence, FL30-slow, FL30-cost on the sheet cameras.
// Newsreel off. The set is `paintPaddockScene`; birds go in its `cast` callback (far to near). Camera moves follow the shot blocks (ease-in-out).
const ei = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const sun = {sun: SUN.morning};
const FAR = {n: 200, x: [-90, 90] as [number, number], z: [-200, -62] as [number, number]};
const BUFFET_CAM = camLine({eye: [-3.0, 1.3, -25.0], yaw: 10, pitch: -4, f: 900, hy: 860});
const headsCam = (L: number) => { const u = ei((L - 48) / 26); return camLine({eye: [lerp(2.2, 2.4, u), lerp(1.55, 3.2, u), lerp(-10.6, -12.2, u)], yaw: 190, pitch: lerp(-2, -16, u), f: lerp(1000, 950, u), hy: 860}); };
const SCATTER_CAM = camLine({eye: [0.4, 1.0, 1.65], yaw: -3, pitch: 0, f: 900, hy: 860});
const burstCam = (L: number) => camLine({eye: [0, lerp(18, 20, L / 45), 10], yaw: 0, pitch: -48, f: 800, hy: 860});
const HALVES_CAM = (L: number) => { const u = ei(L / 40); return camLine({eye: [12.0, 1.1, lerp(-29.0, -29.3, u)], yaw: lerp(0, -2, u), pitch: 0, f: 900, hy: 860}); };
const FENCE_CAM = camLine({eye: [-0.2, 1.35, 7.9], yaw: -6.6, pitch: 0, f: 950, hy: 860});
const slowCam = (L: number) => camLine({eye: [-1.6, 0.6, -1.0], yaw: lerp(-6, 0, ei(L / 109)), pitch: 6, f: 1020, hy: 900});
const world = (p: Painter, c: YCam, o: Parameters<typeof paintPaddockScene>[2], cast: () => void) => paintPaddockScene(p, c, {eaten: 0.4, ...o}, cast);
const FLOCK_PROOFS: ProofDef[] = [
  {id: 'FL30-buffet', N: 146, cam: () => BUFFET_CAM, reel: NO_REEL, paint: (p, L, c) => world(p, c, {}, () => paintFlock(p, c, buffetRow(L), sun))},
  {id: 'FL30-heads', N: 75, cam: headsCam, reel: NO_REEL, paint: (p, L, c) => world(p, c, {}, () => {
    // bands far to near: paint a z band of heads, then the wheat ridges between that band and the next nearer one so the necks come out of the stalks
    const ms = headsField(L), dist = (x: number, z: number) => Math.hypot(x - c.x, z - c.z), groups = [5, 4, 3, 2, 1, 0].map((g) => ms.filter((m) => Math.min(5, Math.floor(m.at[2] + 11)) === g));
    groups.forEach((gm, k) => {
      paintFlock(p, c, gm, {...sun, lod: 'far'});
      const dMin = Math.min(...gm.map((m) => dist(m.at[0], m.at[2]))), nxt = groups[k + 1], dNext = nxt ? Math.min(...nxt.map((m) => dist(m.at[0], m.at[2]))) : 0.3;
      paintWheatRidges(p, c, 30600 + k * 5, {r0: Math.max(0.3, dNext - 0.2), r1: dMin + 0.1, rows: 5, eaten: 0.4});
    });
    paintEmu(p, c, {at: HEADS_HERO, heading: Math.PI / 2, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}, sun);
  })},
  {id: 'FL30-scatter', N: 72, cam: () => SCATTER_CAM, reel: NO_REEL, paint: (p, L, c) => world(p, c, {far: FAR}, () => paintFlock(p, c, scatter(L), sun))},
  {id: 'FL30-burst', N: 50, cam: burstCam, reel: NO_REEL, paint: (p, L, c) => world(p, c, {far: FAR}, () => { paintBurstDust(p, c, L); paintFlock(p, c, burst(L), sun); })},
  {id: 'FL30-halves', N: 40, cam: HALVES_CAM, reel: NO_REEL, paint: (p, L, c) => world(p, c, {}, () => {
    paintFlock(p, c, [...halves(L), {at: [12, 0, -32], heading: Math.PI / 2, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}], sun); halvesDust(p, c, L);
  })},
  {id: 'FL30-fence', N: 1, cam: () => FENCE_CAM, reel: NO_REEL, paint: (p, _L, c) => world(p, c, {light: 1, eaten: 0.7, stubble: 0.4, verge: true, wire: {wireW: 2.5, wireCol: '#3e3226'}}, () => paintFlock(p, c, fenceBirds({n: 5, truck: [-8, 0, 9.5]}), sun))},
  {id: 'FL30-slow', N: 110, cam: slowCam, reel: NO_REEL, paint: (p, L, c) => world(p, c, {}, () => { paintFlock(p, c, slowLine(L), sun); slowDust(p, c, L); })},
  {id: 'FL30-cost', N: 1, cam: () => SCATTER_CAM, reel: NO_REEL, paint: (p, _L, c) => world(p, c, {far: FAR}, () => { paintFarFlock(p, c, 30510, 20, [-40, 40], [-110, -62]); paintFlock(p, c, scatter(44), sun); })},
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30), ...FLOCK_PROOFS.map(Proof30)));
