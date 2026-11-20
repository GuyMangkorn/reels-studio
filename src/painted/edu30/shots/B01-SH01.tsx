import type {V3} from '../../kit/space';
import {camDist, type YCam} from '../../kit/ycam';
import {GUNNER1, GUNNER2, MEREDITH, paintCrew, paintGunnerFists, paintSeatedGunner} from '../cast';
import {EMU_POSES, emuLensYaw, emuLookTurn, mixEmuPose} from '../emu';
import {paintEmu, type EmuMember} from '../flock';
import {HERO_LF01} from '../looks';
import {paintPaddockScene, SUN} from '../paddock';
import {buildLewisGun, lewisAnchors, paintGear, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B01-SH01 (Boss T19, 2026-11-20): heroic low three-quarter, the LF01a crew over G1 (still), EMU-HERO inspecting the muzzle; local 70-80 its head rises to
// standing, local 80-88 it turns the head to the lens, feet planted at the LF01 pads. The camera arcs from the LF01a eye to the SD01 end eye (ease-in-out).
const N = 90;
const EASE = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const CAM = (L: number): YCam => { const e = EASE(L / 89); return camLine({eye: [lerp(-3.2, -3.27, e), 0.95, lerp(-3.4, -2.77, e)], yaw: lerp(134.5, 128.5, e), pitch: 6, f: 1450, hy: 640}); };

const T = 1.2, H = -Math.PI / 2, G1: V3 = [0, 0, 0], SEAT: V3 = [0, 0, 0.85], MER: V3 = [-0.6, 0, 1.05], G2P: V3 = [0.75, 0, 0.45];
const AN = lewisAnchors(G1, H);
const hero = (L: number, c: YCam): EmuMember => {
  const look = EMU_POSES.look(0, {lid: 0.3});
  let pose = HERO_LF01.pose;
  if (L >= 70) pose = mixEmuPose(HERO_LF01.pose, look, EASE((L - 70) / 10));
  if (L > 80) pose = {...pose, lid: 0.3, headYaw: emuLookTurn(L, 80, 88, 0, emuLensYaw(HERO_LF01.at, HERO_LF01.heading, c))};
  return {...HERO_LF01, pose};
};

export const def: Shot30 = {
  id: 'B01-SH01', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning;
    paintPaddockScene(p, c, {light: 0, eaten: 0.3, stubble: 0});
    {
      // the LF01a crew order (far to near), with the T11 fists and the T13 pan ticks added in the gun's slot
      const items: {at: V3; f: () => void}[] = [
        {at: MER, f: () => { const a = paintCrew(p, c, MEREDITH, MER, {view: 'front', pose: 'P30', t: T, seed: 33100, hat: 'slouch', upLeft: true}); if (a) pr?.lead('MEREDITH', {top: a.top, bottom: a.bottom, x: a.head[0]}); }},
        {at: SEAT, f: () => { paintSeatedGunner(p, c, GUNNER1, SEAT, {view: 'front', t: T, seed: 33200, grip: AN.grip, stock: AN.stock}); }},
        {at: G1, f: () => {
          placeBuild(p, c, buildLewisGun(), G1, H, {seed: 33300, sun});
          paintLewisPanTicks(p, c, 33350, G1, H, 0, {});
          paintGunnerFists(p, c, GUNNER1, SEAT, {view: 'front', t: T, seed: 33200, grip: AN.grip, stock: AN.stock});
        }},
        {at: G2P, f: () => { paintCrew(p, c, GUNNER2, G2P, {view: 'front', pose: 'P34', t: T, seed: 33400, hat: 'slouch'}); }},
        {at: HERO_LF01.at, f: () => { const a = paintEmu(p, c, hero(L, c), {sun}); pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2}); }},
        {at: [-1.3, 0, -1.8], f: () => paintGear(p, c, 33600, {sheet: [-1.3, 0, -1.8], box: [0.55, 0, 1.35], mags: [1.05, 0, 0.25], bag: [-0.95, 0, -2.25]})},
      ];
      items.sort((a, b) => camDist(c, b.at) - camDist(c, a.at)).forEach((it) => it.f());
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
