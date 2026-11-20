import {EMU_POSES, emuLensYaw, mixEmuPose, type EmuPose} from '../emu';
import {emuBuild, scaled} from '../flock';
import {paintBeast, type BeastAnchors} from '../../survival/beast';
import {paintPaddockScene, sunOf} from '../paddock';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';
import type {YCam} from '../../kit/ycam';

// B06-SH02 (Boss T31, 2026-11-20): EMU-HERO's silent bow (L15 mime, VD30-05b). Space P, light 0, eaten 0.7. Hero at (0, 0, -5.0) facing +z.
// L 0-4 still (stand, eyes to the lens, lid 0.30); bow u 0 -> 1 over L 5-19 (ease-in-out), 1 -> 0 over L 19-31; L 31-35 upright and still. Exactly one bow.
// Feather ruffle L 5-15: the body bone's keys and flats jitter by up to 0.01 m, seeded per plume and per frame (a pure function of L, story clock).
const N = 36, LIGHT = 0, EATEN = 0.7, AT: [number, number, number] = [0, 0, -5.0], HEADING = Math.PI / 2, SEED = 36000;
const ease = (u: number) => { const x = Math.max(0, Math.min(1, u)); return x * x * (3 - 2 * x); };
const A = camLine({eye: [0.3, 1.5, -3.15], yaw: -12.2, pitch: -2, f: 1000, hy: 760}), B = camLine({eye: [0.3, 1.5, -3.3], yaw: -7, pitch: -2, f: 1000, hy: 760});
const CAM = (L: number): YCam => { const u = ease(L / 35), m = (a: number, b: number) => a + (b - a) * u; return {...A, z: m(A.z, B.z), yaw: m(A.yaw, B.yaw)}; };
const rnd = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };

/** The locked KP-EMU bow as painted (T38 B3, VD30-05b), no lift. */
/** Bow amount u (0 upright, 1 bottom): rises over L 5-19, returns over L 19-31. */
export const bowU = (L: number) => (L < 5 ? 0 : L < 19 ? ease((L - 5) / 14) : 1 - ease((L - 19) / 12));
const ruffleAmp = (L: number) => (L < 5 || L > 15 ? 0 : 0.01 * Math.sin((Math.PI * (L - 5)) / 10));
const poseAt = (L: number, cam: YCam): EmuPose => {
  const yaw = emuLensYaw(AT, HEADING, cam);
  return mixEmuPose(EMU_POSES.stand({lid: 0.3, headYaw: yaw}), EMU_POSES.bow({headYaw: yaw * 0.5}), bowU(L));
};
type V = [number, number, number];
const ruffled = (L: number, pose: EmuPose) => {
  const B0 = emuBuild({...pose, hero: true}), a = ruffleAmp(L);
  if (a === 0) return B0;
  const j = (k: number, ax: number) => (rnd(SEED + k * 3.1 + ax * 17.7 + L * 101) - 0.5) * 2 * a;
  const jv = (v: V, k: number): V => [v[0] + j(k, 0), v[1] + j(k, 1), v[2] + j(k, 2)];
  const parts = B0.parts.map((q, qi) => (q.bone !== 'body' ? q : {...q, keys: q.keys.map((k, ki) => ({...k, p: jv(k.p as V, qi * 53 + ki)}))}));
  const flats = B0.flats.map((f, fi) => (f.bone !== 'body' ? f : {...f, pts: f.pts.map((v, vi) => jv(v as V, 9000 + fi * 29 + vi))}));
  return {...B0, parts, flats};
};

export const def: Shot30 = {
  id: 'B06-SH02', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    const sun = sunOf(LIGHT), Bd = scaled(ruffled(L, poseAt(L, c)), 1);
    let an: BeastAnchors | null = null;
    paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0, clearing: false}, () => {
      an = paintBeast(p, c, Bd, {at: [AT[0], AT[2]], heading: HEADING, ground: 0, seed: SEED, sun, shadowOp: 80});
    });
    const a = an as BeastAnchors | null;
    if (a && pr) {
      pr.lead('EMU-HERO', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
      const h = a.pt('head');
      if (h) pr.lead('head', {top: h[1], bottom: h[1], x: h[0]});
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
