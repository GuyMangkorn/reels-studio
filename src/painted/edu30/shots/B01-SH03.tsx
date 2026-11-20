import type {V3} from '../../kit/space';
import {camPoint, type YCam} from '../../kit/ycam';
import {EMU_POSES, blinkLid, buildEmu, emuLensYaw, emuSac} from '../emu';
import {paintEmu, type EmuMember} from '../flock';
import {paintPaddockScene, SUN} from '../paddock';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B01-SH03 (Boss T19, 2026-11-20): EMU-HERO's deadpan stare into the lens. Feet and head still; one blink (T07 `blinkLid`, local 6-9); the neck sac swells
// local 26-50 (T07 `emuSac`). Far flock as dark marks, near stalks off. The camera pushes 0.2 m, ease-in-out.
const N = 51;
const EASE = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const CAM = (L: number): YCam => camLine({eye: [4.1, 1.58, -24.6 + (-24.8 + 24.6) * EASE(L / 50)], yaw: 0, pitch: -2, f: 1000, hy: 640});
const AT: V3 = [4.0, 0, -26.0], HEADING = Math.PI / 2;
const hero = (L: number, c: YCam): EmuMember => ({
  at: AT, heading: HEADING, scale: 1, seed: 36000, hero: true,
  pose: EMU_POSES.look(emuLensYaw(AT, HEADING, c), {lid: blinkLid(L - 6, 0.32), sac: emuSac(L)}),
});

export const def: Shot30 = {
  id: 'B01-SH03', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    paintPaddockScene(p, c, {light: 0, eaten: 0.3, stubble: 0, far: {n: 200, x: [-30, 30], z: [-60, -150]}}, () => {
      const a = paintEmu(p, c, hero(L, c), {sun: SUN.morning});
      const nb = camPoint(c, a.toWorld(buildEmu({}).joints['neck.base'] as [number, number, number]));   // the neck.base joint (inside the chest top)
      pr?.lead('EMU-HERO head+neck', {top: a.top, bottom: nb ? nb[1] : a.bottom, x: (a.left + a.right) / 2});
    });
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
