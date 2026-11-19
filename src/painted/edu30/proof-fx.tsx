// Standalone proof entry for EDU-EP30 asset tickets, topic `fx` (Boss T03, 2026-11-19). Each ticket that owns this topic adds its compositions to
// `PROOFS` (names from its own Proof section) and nothing else, so asset tickets never share an entry file with a plate ticket. Props `guides` and
// `tag` as in shots-index.tsx.
//   printf '<ID> <frame> out/edu30-T<nn>/<name>.png\n' | node scripts/stills.mjs src/painted/edu30/proof-fx.tsx --gl=angle
import {createElement, Fragment} from 'react';
import {registerRoot} from 'remotion';
import {GUNFIRE_PRESETS, paintBlast, paintMuzzleFlash, paintSmoke, popFor, roundFrames} from '../kit/gunfire';
import type {YCam} from '../kit/ycam';
import {MEREDITH, paintCrew} from './cast';
import {EMU_POSES} from './emu';
import {paintEmu} from './flock';
import {paintPadGround, paintPadSky, setNoClearing, SUN} from './paddock';
import {buildLewisGun, placeBuild} from './props';
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
];

registerRoot(() => createElement(Fragment, null, ...PROOFS.map(Proof30)));
