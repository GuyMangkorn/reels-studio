import type {CastDef, FigAnchors} from '../../kit/cast';
import type {V3} from '../../kit/space';
import {paintSorted} from '../../kit/world';
import {CCTV_STILL} from '../looks';
import {CCTV_FILTER, cctvHold} from '../screen31';
import {BANK_TEXT, bankFurniture, FRIEND, paintBankShell, TELLER, WHEELER} from '../set31';
import {makeShot, type Shot31} from '../shot';
import {camOf, eout, ez, fig, lin, mix, mix3} from '../stage31';

// B04-SH02 · F [959, 1026) · CCTV vantage: the truth, step zoom and freeze (SCENE-R1 b04, LF02). The lobby seen by its own corner camera
// (CCTV-CAM (6.37, 2.9, 0.62), aimed at his head at the stop: LF02's camera, so the last zoom step lands on CCTV-STILL-01). VD31-08 CCTV preset
// (screen31.tsx): grey-green grade and softness on the canvas and the DOM signage, scanlines, rolling noise band, timestamp JAN 06 1995 (row
// y 1440-1500, outside the caption band), REC + CAM 2. Stutter: the picture's motion (walks, head turn) advances every 3rd frame (10 fps, ambient
// clock `cctvHold`); the zoom steps and the freeze land on their exact story frames: f 1000 L0-29 -> f 2600 L30 (F989) -> f 4600 L37 (F996) ->
// freeze L45-66 (F1004) = the CCTV-STILL-01 file itself (`public/edu31/cctv-still-01.png`, its own overlay baked in). WHEELER walks in from
// (+0.5, +4.4) to the stop (+0.8, +3.4) at L24 and turns body and head to the lens L22-30 (`turn-head-to-camera`; the sheet turns only the head:
// the body turns too so L44 meets the front-view still), `neutral`, no smile (F011); beard and buzz cut in the middle value (LF02's R2 plate
// colours). FRIEND small behind, walking, never looks up. TELLER at W1, head down (out of this frame).
const N = 67, SHOT = 'B04-SH02';
const CCAM: V3 = [6.37, 2.9, 0.62], HEAD: V3 = [0.8, 1.6, 3.4];
const yawTo = (a: V3, b: V3) => Math.atan2(b[0] - a[0], -(b[2] - a[2])) * 180 / Math.PI;
const pitchTo = (a: V3, b: V3) => Math.atan2(b[1] - a[1], Math.hypot(b[0] - a[0], b[2] - a[2])) * 180 / Math.PI;
export const zoomF = (L: number) => L < 30 ? 1000 : L < 37 ? 2600 : L < 45 ? 4600 : 7000;
const CAM = (L: number) => camOf({eye: CCAM, yaw: yawTo(CCAM, HEAD), pitch: pitchTo(CCAM, HEAD), f: zoomF(L), hy: 620});
/** LF02 R2/VD31-14 beard mitigation in the plate only: beard and buzz cut in the middle value under the grade. */
const WHEELER_CCTV: CastDef = {...WHEELER, head: {...WHEELER.head, hair: '#5a4a3e', skin: '#c8956a'}};
const STEP = 1.1 * 1.78 / 1.7;
const W0: V3 = [0.5, 0, 4.4], W1: V3 = [0.8, 0, 3.4], F0: V3 = [-0.6, 0, 6.6], F1: V3 = [-0.2, 0, 5.6];
const WALK_LEN = Math.hypot(W1[0] - W0[0], W1[2] - W0[2]);
/** Wheeler on the motion clock m: position (ease-out into the stop at m 24), walk phase, stride, facing [x, z]. */
const wheelerAt = (m: number) => {
  const k = eout(lin(m, 0, 24)) * 0.35 + lin(m, 0, 24) * 0.65, at = mix3(W0, W1, k);
  const dir: [number, number] = [(W1[0] - W0[0]) / WALK_LEN, (W1[2] - W0[2]) / WALK_LEN];
  const toCam = [CCAM[0] - W1[0], CCAM[2] - W1[2]], tl = Math.hypot(toCam[0], toCam[1]);
  const turn = ez(m, 22, 30), a0 = Math.atan2(dir[1], dir[0]), a1 = Math.atan2(toCam[1] / tl, toCam[0] / tl);
  let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
  const a = a0 + da * turn;
  return {at, walk: (k * WALK_LEN) / STEP, stride: 1 - ez(m, 18, 24), facing: [Math.cos(a), Math.sin(a)] as [number, number], turn};
};
const friendAt = (m: number): V3 => { const k = m / 30; return [mix(F0[0], F1[0], k), 0, mix(F0[2], F1[2], k)]; };

export const def: Shot31 = {
  id: SHOT, N, paper: '#c9c3b0',
  cam: CAM,
  texts: BANK_TEXT,
  filter: (L) => (L < 45 ? CCTV_FILTER : undefined),
  domFilter: (L) => (L < 45 ? CCTV_FILTER : undefined),
  cctv: (L) => (L < 45 ? {t: cctvHold(L)} : null),
  freeze: (L) => (L >= 45 ? CCTV_STILL : null),
  grain: (L) => (L < 45 ? 0.12 : 0),
  paint: (p, L, c, pr) => {
    const m = cctvHold(L), t = m / 30, w = wheelerAt(m), fa = friendAt(m);
    paintBankShell(p, c);
    const out: {a?: FigAnchors | null} = {};
    paintSorted(p, c, [
      ...bankFurniture(),
      fig(TELLER, {at: [-3.0, 0, -0.7], view: 'front', face: 'neutral', faceState: {look: [0, 0.9]}, seed: 3103, t}),
      fig(FRIEND, {at: fa, facing: [0.37, -0.93], face: 'neutral', faceState: {look: [0, 0.3]}, seed: 3102, t, fig: {walk: Math.hypot(fa[0] - F0[0], fa[2] - F0[2]) / STEP, stride: 1}}),
      fig(WHEELER_CCTV, {at: w.at, facing: w.facing, face: 'neutral', seed: 3101, t: t + 2, // rig clock +2 s: his blink falls after the shot (eyes open into the lens)
         faceState: {look: [0, -0.15 * w.turn]}, fig: {walk: w.walk, stride: w.stride}}, false, out),
    ]);
    if (pr && out.a) { pr.lead('WHEELER', {top: out.a.top, bottom: out.a.bottom, x: out.a.head[0]}); pr.lead('HEAD', {top: out.a.headTop, bottom: out.a.chin, x: out.a.head[0]}); }
  },
};
export const shot = makeShot(def);
