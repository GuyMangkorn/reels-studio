import {paintFall} from '../../kit/fall';
import type {V3} from '../../kit/space';
import {emuWingFlick} from '../emu';
import {halves, halvesDust, HALVES_HERO, paintEmu, paintFlock} from '../flock';
import {paintPaddockScene, SUN} from '../paddock';
import {camLine, makeShot, type Shot30} from '../shot';

// B03-SH03 (Boss T25, 2026-11-20): front medium, EMU-HERO's silent wing signal (L07 mime). Space P, light 0, eaten 0.4, no shake, no overscan, no caption or overlay.
// EMU-HERO (12, 0, -32) facing +z: T15 `emuWingFlick(L)` (right wing L 4-16, left wing L 20-32, blink L 44); its group of ten: T08 `halves(L)` with footfall dust.
// Camera eye (12, 1.1, -29 -> -29.3), yaw 0 -> -2, ease-in-out over L 0-56. Dust left from B03-SH02 settles: `paintFall` dust, density 0.3 -> 0 over L 0-30.
const N = 57;
const ease = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
const CAM = (L: number) => { const e = ease(L / 56); return camLine({eye: [12.0, 1.1, -29.0 - 0.3 * e], yaw: -2 * e, pitch: 0, f: 900, hy: 860}); };
const STALKS: V3[] = Array.from({length: 14}, (_, i) => [3 + 1.9 * i + ((i * 7) % 5) * 0.12, 0, -26 - ((i * 5) % 7) * 0.9] as V3);

export const def: Shot30 = {
  id: 'B03-SH03', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning;
    paintPaddockScene(p, c, {light: 0, eaten: 0.4, stubble: 0.6, stalks: STALKS}, () => {
      paintFlock(p, c, halves(L), {sun});
      halvesDust(p, c, L);
    });
    const a = paintEmu(p, c, {at: HALVES_HERO, heading: Math.PI / 2, pose: emuWingFlick(L), scale: 1, seed: 36000, hero: true}, {sun});
    pr?.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
    const d = 0.3 * (1 - Math.min(1, L / 30));
    if (d > 0) paintFall(p, 'dust', {width: 1080, height: 1920, t: L / 30, seed: 300, style: {count: Math.round((80 * d) / 0.3)}, captionBand: [1150, 1344]});
  },
  reel: () => ({strength: 1, tint: 'warm', tintAmount: 1}),
};
export const shot = makeShot(def);
