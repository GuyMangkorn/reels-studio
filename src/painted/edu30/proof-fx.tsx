// Standalone proof entry for EDU-EP30 asset tickets, topic `fx` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-fx.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {hardFill} from '../kit/draw';
import {GUNFIRE_PRESETS, paintBlast, paintCasings, paintMuzzleFlash, paintSmoke, paintSplash, paintSpurts, popFor, roundFrames, strikePoints, type CasingSpec} from '../kit/gunfire';
import {camPoly, type YCam} from '../kit/ycam';
import {MEREDITH, paintCrew} from './cast';
import {EMU_POSES} from './emu';
import {paintEmu} from './flock';
import {paintPadGround, paintPadSky, setNoClearing, SUN} from './paddock';
import {buildLewisGun, lewisAnchors, lewisPanTurn, lewisRecoil, paintLewisPanTicks, placeBuild} from './props';
import {DEFAULT_REEL, Proof30, type ProofDef} from './shot';

// FX30-fire (T04, 80 f): the EDU30-CAL set and camera, G1 at (1.2, 0, 0) with the barrel along -x firing `roundFrames(2, 23, 3)`, newsreel strength 1
// warm with `pop`. Order: sky, ground, blast cloud, figures and gun, smoke, flash. The muzzle is read from the gun's own anchor.
const CAL_CAM: YCam = {x: 0, y: 0.9, z: 6.0, yaw: 0, pitch: 0, f: 1000, hy: 960};
const FIRE_ROUNDS = roundFrames(2, 23, 3), FIRE_DIR: [number, number, number] = [-1, 0, 0];
const SMOKE = {...GUNFIRE_PRESETS.B03_SH01.smoke, seed: 7100};

const PROOFS: ProofDef[] = [
  {
    id: 'FX30-fire', N: 80, cam: () => CAL_CAM,
    reel: (L) => ({...DEFAULT_REEL, pop: popFor(L, FIRE_ROUNDS)}),
    paint: (p, L, c) => {
      const sun = SUN.morning;
      setNoClearing(true);
      paintPadSky(p, c, 'morning');
      paintPadGround(p, c, 30300, {eaten: 0, light: 'morning'});
      const g = placeBuild(null, c, buildLewisGun(), [1.2, 0, 0], Math.PI, {seed: 35300, sun});   // probe only: the muzzle anchor in world metres
      const muzzle = g.world('muzzle');
      paintBlast(p, c, muzzle, FIRE_DIR, L, FIRE_ROUNDS, {ground: 'wheat', seed: 7200});
      paintCrew(p, c, MEREDITH, [-1.2, 0, 0], {view: 'front', pose: 'P01', t: 0, seed: 35100, hat: 'slouch'});
      paintEmu(p, c, {at: [0, 0, 0], heading: -Math.PI / 2, pose: EMU_POSES.stand(), scale: 1, seed: 36000, hero: true}, {sun});
      placeBuild(p, c, buildLewisGun(), [1.2, 0, 0], Math.PI, {seed: 35300, sun});
      paintSmoke(p, c, muzzle, L, FIRE_ROUNDS, SMOKE);
      paintMuzzleFlash(p, c, muzzle, FIRE_DIR, L, FIRE_ROUNDS, {halo: GUNFIRE_PRESETS.B03_SH01.halo, seed: 7300});
      setNoClearing(false);
    },
  },
  // FX30-debris (T05, 80 f): the FX30-fire set with G1 at the origin, barrel -z (the B03-SH01 paddock frame, receiver right = +x), casings into the
  // 0.8..1.5 / -0.2..0.4 box, dust spurts at the 23 B03 strike points, and on a flat water rectangle at y 0.3 in front of the camera (z 2.4..4.0) one spout (round at
  // L 12) and one splash (start L 12). Order: sky, ground, blast, strikes, crew, casings, gun, pan ticks, smoke, flash, water debris.
  {
    id: 'FX30-debris', N: 80, cam: () => CAL_CAM,
    reel: (L) => ({...DEFAULT_REEL, pop: popFor(L, FIRE_ROUNDS)}),
    paint: (p, L, c) => {
      const sun = SUN.morning, G1: [number, number, number] = [0, 0, 0], H = -Math.PI / 2;
      setNoClearing(true);
      paintPadSky(p, c, 'morning');
      paintPadGround(p, c, 30300, {eaten: 0, light: 'morning'});
      const rec = lewisRecoil(L, FIRE_ROUNDS), a = lewisAnchors(G1, H, {recoil: rec});
      hardFill(p, 7900, '#4f6a70', camPoly(c, [[-0.6, 0.3, 2.4], [1.6, 0.3, 2.4], [1.6, 0.3, 4.0], [-0.6, 0.3, 4.0]]));
      paintBlast(p, c, a.muzzle, [0, 0, -1], L, FIRE_ROUNDS, {ground: 'wheat', seed: 7200});
      const birds = [] as [number, number, number][];
      const sp = strikePoints({count: 23, seed: 9100, minDist: 4, x: [-6, 6], z: (i) => -14 - (12 * i) / 22, ground: () => 0, avoid: birds});
      paintSpurts(p, c, L, FIRE_ROUNDS, {points: sp.points, kind: 'dust', h: [0.6, 1.2], seed: 9200});
      paintCrew(p, c, MEREDITH, [-1.2, 0, 0], {view: 'front', pose: 'P01', t: 0, seed: 35100, hat: 'slouch'});
      const spec: CasingSpec = {port: lewisAnchors(G1, H).port, side: 1, seed: 8100, dir: [0, 0, -1], ground: () => 0, box: {x: [0.8, 1.5], z: [-0.2, 0.4]}};
      paintCasings(p, c, L, FIRE_ROUNDS, spec);
      placeBuild(p, c, buildLewisGun({recoil: rec}), G1, H, {seed: 35300, sun});
      paintLewisPanTicks(p, c, 35400, G1, H, lewisPanTurn(L, FIRE_ROUNDS), {recoil: rec});
      paintSmoke(p, c, a.muzzle, L, FIRE_ROUNDS, SMOKE);
      paintMuzzleFlash(p, c, a.muzzle, [0, 0, -1], L, FIRE_ROUNDS, {halo: GUNFIRE_PRESETS.B03_SH01.halo, seed: 7300});
      paintSpurts(p, c, L, [12], {points: [[0.9, 0.3, 3.0]], kind: 'spout', h: [0.4, 0.9], seed: 9300});
      paintSplash(p, c, L, [-0.1, 0.3, 3.2], 12, 9400);
      setNoClearing(false);
    },
  },
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
