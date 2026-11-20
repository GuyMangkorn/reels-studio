import type {V3} from '../../kit/space';
import {wFill} from '../../kit/world';
import {camDist, type YCam} from '../../kit/ycam';
import {GUNNER1, GUNNER2, MEREDITH, PAN_R, paintCrewPose, paintGunnerFists, paintSeatedGunner} from '../cast';
import {EMU_POSES, mixEmuPose} from '../emu';
import {flockIn, paintFlock, type EmuMember} from '../flock';
import {SUN, paintPaddockScene} from '../paddock';
import {GUN_PX, buildLewisGun, lewisAnchors, lewisRecoil, paintLewisPanTicks, placeBuild} from '../props';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B03-SH05 (Boss T23, 2026-11-20): MEREDITH's order "ยิง!" on a low heroic three-quarter, war-film grammar played straight. Space P, the gun position: MEREDITH (T18 `chop`: arm raised L 0-4,
// chop L 4-7, hold, mouth open L 6-16), GUNNER-1 seated front with fists on G1 (T11, still), GUNNER-2 (P34) at the left edge holding the spare pan on his thighs, G1 loaded (still).
// The flock band beyond (F1, standing and pecking) is behind the lens at this yaw and clips out. Camera over L 0-20, ease-out.
const N = 21;
const CAM0 = {eye: [-2.0, 0.75, -1.2] as const, yaw: 148}, CAM1 = {eye: [-1.95, 0.75, -1.05] as const, yaw: 150};
const easeOut = (t: number) => { const x = Math.max(0, Math.min(1, t)); return 1 - (1 - x) * (1 - x); };
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const camAt = (L: number): YCam => { const u = easeOut(L / 20); return camLine({eye: [mix(CAM0.eye[0], CAM1.eye[0], u), 0.75, mix(CAM0.eye[2], CAM1.eye[2], u)], yaw: mix(CAM0.yaw, CAM1.yaw, u), pitch: 10, f: 1000, hy: 860}); };

const T = 1.2, G1: V3 = [0, 0, 0], GH = -Math.PI / 2, SEAT1: V3 = [0, 0, 0.85], MER: V3 = [-0.6, 0, 1.05], G2P: V3 = [0.75, 0, 0.45];
const SEED = 3705;
const hs = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };
const peckU = (L: number, ph: number) => { const c = (((L + ph) % 15) + 15) % 15, e = (x: number) => x * x * (3 - 2 * x); return Math.round((c < 5 ? e(c / 5) : c < 8 ? 1 : 1 - e((c - 8) / 7)) * 8) / 8; };
const F1 = flockIn(SEED, 40, [-30, 30], [-60, -30], {mix: [0.5, 0, 0.5]});
const f1 = (L: number): EmuMember[] => F1.map((m, i) => (hs(SEED + i * 5.3) < 0.5 ? {...m, pose: mixEmuPose(EMU_POSES.stand(), EMU_POSES.peck(), peckU(L, Math.floor(hs(SEED + i) * 15)))} : m));

/** The spare pan GUNNER-2 holds in both mittens on his thighs: a flat drum of radius `PAN_R`, 0.044 thick, top face at `top` (as the T12 `heldPan`). */
const heldPan = (p: Parameters<Shot30['paint']>[0], c: YCam, top: V3) => {
  const ring = (y: number, r: number): V3[] => Array.from({length: 20}, (_, i) => [top[0] + r * Math.cos((i / 20) * Math.PI * 2), y, top[2] + r * Math.sin((i / 20) * Math.PI * 2)]);
  const lo = ring(top[1] - 0.044, PAN_R), hi = ring(top[1], PAN_R);
  for (let i = 0; i < 20; i++) { const j = (i + 1) % 20; wFill(p, c, 37800 + i, GUN_PX.magRim, [lo[i], lo[j], hi[j], hi[i]]); }
  wFill(p, c, 37830, GUN_PX.magRim, hi);
  wFill(p, c, 37831, GUN_PX.mag, ring(top[1] + 0.001, PAN_R * 0.86));
};
const G2_PAN: V3 = [G2P[0], 0.5, G2P[2]];

export const def: Shot30 = {
  id: 'B03-SH05', N, paper: '#efe6d0',
  cam: camAt,
  paint: (p, L, c, pr) => {
    const sun = SUN.morning;
    paintPaddockScene(p, c, {light: 0, eaten: 0.4}, () => { paintFlock(p, c, f1(L), {sun}); });
    const o = {recoil: lewisRecoil(0, [1])}, a = lewisAnchors(G1, GH, o);
    // far to near: MEREDITH, GUNNER-1 + G1, GUNNER-2 (edge); sorted by distance so the near figure paints last
    const items: {at: V3; f: () => void}[] = [
      {at: MER, f: () => { const m = paintCrewPose(p, c, MEREDITH, MER, {pose: 'chop', L, seed: 35100}); if (m) pr?.lead('MEREDITH', {top: m.top, bottom: m.bottom, x: m.head[0]}); }},
      {at: SEAT1, f: () => { const g = paintSeatedGunner(p, c, GUNNER1, SEAT1, {view: 'front', grip: a.grip, stock: a.stock, jolt: 0, t: T, seed: 33200}); if (g) pr?.lead('GUNNER-1', {top: g.top, bottom: g.bottom, x: g.head[0]});
        placeBuild(p, c, buildLewisGun(o), G1, GH, {seed: 33300, sun}); paintLewisPanTicks(p, c, 33400, G1, GH, 0, o);
        paintGunnerFists(p, c, GUNNER1, SEAT1, {view: 'front', grip: a.grip, stock: a.stock, jolt: 0, t: T, seed: 33200}); }},
      {at: G2P, f: () => {
        const fists: ((q: typeof p) => void)[] = [];
        const g = paintCrewPose(p, c, GUNNER2, G2P, {pose: 'loader', L: 0, seed: 34700, pan: G2_PAN, onFists: (r) => fists.push(r)});
        if (g) pr?.lead('GUNNER-2', {top: g.top, bottom: g.bottom, x: g.head[0]});
        heldPan(p, c, [G2_PAN[0], G2_PAN[1] + 0.1, G2_PAN[2]]); fists.forEach((r) => r(p)); }},
    ];
    items.sort((x, y) => camDist(c, y.at) - camDist(c, x.at)).forEach((it) => it.f());
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
