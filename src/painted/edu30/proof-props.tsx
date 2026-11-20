// Standalone proof entry for EDU-EP30 asset tickets, topic `props` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-props.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {ring, type Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {camLine, Proof30, stubPaint, type ProofDef} from './shot';
import {buildLewisGun, lewisAnchors, lewisCock, lewisJamNudge, lewisPanTurn, lewisRecoil, PAN_STEP, paintLewisPanTicks, paintLewisPuff, paintTruckDust, paintTruckRig, truckDustFor, placeBuild, truckCam, truckPoint, truckSetCam, truckState} from './props';
import {wFill, wInk} from '../kit/world';

// T13 (Boss, 2026-11-19): the Lewis gun at the three cameras of its sheet rows. Anchor dots in magenta (muzzle, port, pan, cock), newsreel off.
const rounds = (first: number, n: number, gap: number) => Array.from({length: n}, (_, i) => first + i * gap);
const OFF = () => ({strength: 0, tint: 'warm' as const, tintAmount: 1, pop: 0});
const dots = (p: Painter, c: YCam, pts: V3[]) => pts.forEach((v) => { const q = camPoint(c, v); if (q) p.flat('#ff00ff', ring(q[0], q[1], 5, 5, 12)); });

const FIRE = rounds(2, 23, 3), G1: V3 = [0, 0, 0];
const FIRE_CAM = camLine({eye: [0.4, 1.0, 1.65], yaw: -3, pitch: 0, f: 900, hy: 860});
const JAM_CAM = camLine({eye: [-5.45, 1.0, -4.45], yaw: -5, pitch: -32, f: 1100, hy: 860});
const RACK_CAM = camLine({eye: [-4.6, 1.45, -3.9], yaw: -57, pitch: -12, f: 950, hy: 800});
const G_DAM: V3 = [-5.6, 0.32, -5.0], JAM_BASE = lewisPanTurn(40, rounds(10, 11, 3));

const PROOFS: ProofDef[] = [
  {id: 'R30-gun-fire', N: 72, cam: () => FIRE_CAM, reel: OFF, paint: (p, L, c) => {
    stubPaint(p, c);
    const o = {recoil: lewisRecoil(L, FIRE), magTurn: lewisPanTurn(L, FIRE)};
    placeBuild(p, c, buildLewisGun(o), G1, -Math.PI / 2, {seed: 33300});
    paintLewisPanTicks(p, c, 33400, G1, -Math.PI / 2, o.magTurn, o);
    const a = lewisAnchors(G1, -Math.PI / 2, o);
    dots(p, c, [a.muzzle, a.port, a.pan]);
  }},
  {id: 'R30-gun-jam', N: 22, cam: () => JAM_CAM, reel: OFF, paint: (p, L, c) => {
    stubPaint(p, c);
    const o = {magTurn: JAM_BASE + lewisJamNudge(L)};
    placeBuild(p, c, buildLewisGun(), G_DAM, 0, {seed: 37300});
    paintLewisPanTicks(p, c, 37400, G_DAM, 0, o.magTurn);
    const a = lewisAnchors(G_DAM, 0);
    paintLewisPuff(p, c, a.port, 'B04-SH04', L);
    dots(p, c, [a.port, a.pan]);
  }},
  {id: 'R30-gun-rack', N: 24, cam: () => RACK_CAM, reel: OFF, paint: (p, L, c) => {
    stubPaint(p, c);
    const o = {magTurn: JAM_BASE + lewisJamNudge(99), cock: lewisCock(L)};
    placeBuild(p, c, buildLewisGun(o), G_DAM, 0, {seed: 37300});
    paintLewisPanTicks(p, c, 37400, G_DAM, 0, o.magTurn);
    const a = lewisAnchors(G_DAM, 0, o);
    paintLewisPuff(p, c, a.port, 'B04-SH06', L);
    dots(p, c, [a.cock]);
  }},
  // extra close view (not a ticket row): pan ticks at 0, 11 and 23 rounds (frames 0, 1, 2) and the handle at rest
  {id: 'R30-gun-pan', N: 3, cam: () => camLine({eye: [-0.2, 1.2, 0.75], yaw: 0, pitch: -38, f: 1600, hy: 900}), reel: OFF, paint: (p, L, c) => {
    stubPaint(p, c);
    const o = {magTurn: [0, 11, 23][L] * PAN_STEP, cock: 0};
    placeBuild(p, c, buildLewisGun(o), [0, 0, 0], 0, {seed: 33300});
    paintLewisPanTicks(p, c, 33400, [0, 0, 0], 0, o.magTurn);
  }},
];

// T14 (Boss, 2026-11-19): the truck rig at the cameras of its sheet rows. Stub set: sky, ground and wheat-row lines (so a tilting world shows), newsreel off.
const D = Math.PI / 180;
const stubSet = (p: Painter, c: YCam) => {
  stubPaint(p, c);
  wFill(p, c, 1300, '#8a7253', [[-600, 0, -600], [600, 0, -600], [600, 0, 600], [-600, 0, 600]]);   // ground quad: its far edge is the horizon, so a tilted body camera tilts it
  for (let z = -30; z <= 30; z += 3) wInk(p, c, 1400 + z, [[-80, 0, z], [80, 0, z]], {closed: false, weight: 1.2, color: '#6a5a3e'});
  for (let x = -60; x <= 60; x += 6) wInk(p, c, 1500 + x, [[x, 0, 6], [x, 0, 9]], {closed: false, weight: 1.2, color: '#6a5a3e'});
};
const STOP_CAM = camLine({eye: [-0.2, 0.4, 9.8], yaw: -85, pitch: 8, f: 850, hy: 1000});
const ease3 = (u: number) => u * u * (3 - 2 * u);
const SIDE_CAM = (L: number) => { const st = truckState('B05-SH02', L)!, e = ease3(Math.max(0, Math.min(1, (L - 60) / 23))); return truckCam(st.centre, {eye: [-0.7, 2.0, 2.1 + 0.3 * e], yaw: 0, f: 950, hy: 860}); };
const VANTAGE = (L: number): YCam => { const e = ease3(L / 93); return camLine({eye: [-1.0 + 0.05 * e, 1.55, 2.4 + 0.15 * e], yaw: 160 + 6 * e, pitch: 0, f: 900, hy: 820}); };
const rigAt = (shot: 'B02-SH03' | 'B05-SH01' | 'B05-SH02' | 'B05-SH03', L: number, o: {riders: 'silhouettes' | 'chase'; gear: 'cases' | 'pedestal' | 'none'}) => {
  const st = truckState(shot, L)!;
  return {st, args: {centre: st.centre, dir: st.dir, pitch: st.pitch, roll: st.roll, riders: o.riders, gear: o.gear, g2Elev: st.g2Elev, wheelTurn: st.wheelTurn, t: L / 30, seed: 14100}};
};
PROOFS.push(
  {id: 'R30-truck-stop', N: 54, cam: () => STOP_CAM, reel: OFF, paint: (p, L, c) => {
    stubSet(p, c);
    const {st, args} = rigAt('B02-SH03', L, {riders: 'silhouettes', gear: 'cases'}), at = truckPoint(st.centre, 1, 0, 0, 0), track = (l: number) => truckState('B02-SH03', l);
    paintTruckDust(p, c, L, track, {part: 'far', truckAt: at, ...truckDustFor('B02-SH03')});
    paintTruckRig(p, c, args);
    paintTruckDust(p, c, L, track, {part: 'near', truckAt: at, ...truckDustFor('B02-SH03')});
  }},
  {id: 'R30-truck-chase', N: 60, cam: (L) => truckCam(truckState('B05-SH01', L)!.centre, {eye: [-3.0, 2.4, 2.2], yaw: 60, pitch: -6, f: 1100, hy: 860}), reel: OFF, paint: (p, L, c) => {
    const {st, args} = rigAt('B05-SH01', L, {riders: 'chase', gear: 'pedestal'});
    stubSet(p, truckSetCam(c, st.centre, st.pitch, st.roll));
    paintTruckRig(p, c, {...args, pitch: 0, roll: 0});
  }},
  {id: 'R30-truck-side', N: 84, cam: SIDE_CAM, reel: OFF, paint: (p, L, c) => {
    stubSet(p, c);
    const {args} = rigAt('B05-SH02', L, {riders: 'chase', gear: 'pedestal'});
    paintTruckRig(p, c, args);
  }},
  {id: 'R30-truck-vantage', N: 94, cam: VANTAGE, reel: OFF, paint: (p, L, c) => {
    stubSet(p, c);
    const {st, args} = rigAt('B05-SH03', L, {riders: 'silhouettes', gear: 'pedestal'});
    paintTruckDust(p, c, L, (l) => truckState('B05-SH03', l), {part: 'far', truckAt: truckPoint(st.centre, 1, 0, 0, 0)});
    paintTruckRig(p, c, args);
  }},
);

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
