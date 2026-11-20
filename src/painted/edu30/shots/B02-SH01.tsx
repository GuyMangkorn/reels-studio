import {paintPaddockScene, sunOf} from '../paddock';
import {EMU_POSES, gaitPhase, mixEmuPose} from '../emu';
import {buffetRow, flockIn, paintEmu, paintFlock, type EmuMember} from '../flock';
import {camLine, DEFAULT_REEL, makeShot, type Shot30} from '../shot';

// B02-SH01 (Boss T20, 2026-11-20): crane from the whole paddock down into the buffet row. Space P, light 0, eaten 0.4, stubble 0. Camera: every field eased
// (smoothstep of L/100) from the high wide to the row, then a 0.15 m linear drift along the view to L 154. The high-view wheat (T09) paints by itself
// while pitch <= -20 deg (L 0 to about 56), the ridges after. Buffet row: T08 `buffetRow(L)` (out-of-phase pecks, one dip at L 135). Flock F1: 40 seeded
// stand / peck / walk birds on the ambient clock (the frame's own L); far mass through the scene's `far` option.
const N = 155, LIGHT = 0, EATEN = 0.4, SEED = 31000;
const ease3 = (u: number) => u * u * (3 - 2 * u);
const mix = (a: number, b: number, e: number) => a + (b - a) * e;
const A = {eye: [0, 22, 12] as const, yaw: 0, pitch: -40, f: 820, hy: 960}, B = {eye: [-3.0, 1.3, -25.0] as const, yaw: 10, pitch: -4, f: 900, hy: 860};
const CAM = (L: number) => {
  const e = ease3(Math.max(0, Math.min(1, L / 100)));
  const cam = camLine({eye: [mix(A.eye[0], B.eye[0], e), mix(A.eye[1], B.eye[1], e), mix(A.eye[2], B.eye[2], e)], yaw: mix(A.yaw, B.yaw, e), pitch: mix(A.pitch, B.pitch, e), f: mix(A.f, B.f, e), hy: mix(A.hy, B.hy, e)});
  const d = (0.15 * Math.max(0, Math.min(54, L - 100))) / 54, pitch = cam.pitch ?? 0, cp = Math.cos(pitch);
  return d > 0 ? {...cam, x: cam.x + d * Math.sin(cam.yaw) * cp, y: cam.y + d * Math.sin(pitch), z: cam.z - d * Math.cos(cam.yaw) * cp} : cam;
};

const hs = (n: number) => { const s = Math.sin(n * 78.233 + 12.9898) * 43758.5453; return s - Math.floor(s); };
const q16 = (x: number) => Math.round(x * 16) / 16;
const q8 = (x: number) => Math.round(x * 8) / 8;   // pose keys are cached: eighths keep a 40-bird frame from rebuilding every bird
const peckU = (L: number, ph: number) => { const c = (((L + ph) % 15) + 15) % 15; return q8(c < 5 ? ease3(c / 5) : c < 8 ? 1 : 1 - ease3((c - 8) / 7)); };
const F1 = flockIn(SEED, 40, [-30, 30], [-60, -30]);
const WALK_STRIDE = EMU_POSES.walk(0).stride as number, WALK_V = 0.6;
const f1 = (L: number): EmuMember[] => F1.map((m, i) => {
  const r = hs(SEED + i * 3.7), ph = Math.floor(hs(SEED + i * 5.3) * 15);
  if (r < 0.5) return {...m, pose: mixEmuPose(EMU_POSES.stand(), EMU_POSES.peck(), peckU(L, ph))};
  if (r < 0.8) {
    const d = (WALK_V * L) / 30;
    return {...m, at: [m.at[0] + d * Math.cos(m.heading), m.at[1], m.at[2] + d * Math.sin(m.heading)], pose: EMU_POSES.walk(q16(gaitPhase(L, WALK_V, WALK_STRIDE, q16(hs(SEED + i * 2.1))) % 1))};
  }
  return {...m, pose: EMU_POSES.stand()};
});

export const def: Shot30 = {
  id: 'B02-SH01', N, paper: '#efe6d0',
  cam: CAM,
  paint: (p, L, c, pr) => {
    paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0, far: {n: 150, x: [-150, 150], z: [-200, -80]}}, () => {
      paintFlock(p, c, [...f1(L), ...buffetRow(L)], {sun: sunOf(LIGHT)});
    });
    if (pr) {   // nearest buffet bird, head-up pose (probe only: a null painter draws nothing)
      const a = paintEmu(null, c, {...buffetRow(L)[0], pose: EMU_POSES.stand()}, {sun: sunOf(LIGHT)});
      pr.lead('nearest buffet bird (head-up)', {top: a.top, bottom: a.bottom, x: (a.left + a.right) / 2});
    }
  },
  reel: () => DEFAULT_REEL,
};
export const shot = makeShot(def);
