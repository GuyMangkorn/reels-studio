import {animalMotion} from '../kit/animal-motions';
import {washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, mixYCam, type YCam} from '../kit/ycam';
import {CAT_SCALE, MANNEQUIN_L, MANNEQUIN_R, TRENCH, catDef, paintRealCat, paintSeatedMannequin} from './cast';
import {SF, paintFieldBack, paintFieldBenchBack, paintFieldBenchSeat, paintFieldTree, paintNearLawn} from './field';
import {BENCH_P, lead, paintParkPopUp, type LookDef} from './looks';

// EDU-EP32-SHORT B03-SH01, the bridge "dive into the plan" (EDU-EP32-BRIEF-R2 VD32-18, storyboard BOARD-R2; Boss W3 gate LF-BR, 2026-11-21).
// One shot, two plates on one camera function of the shot frame F (0..BRIDGE_N-1): plate PA = Space D page P' (paper pop-up, the LF02 set) and
// plate PB = Space F (the real field), laid 1:1 on the same coordinates, so the bench, the seated coats and the cat coincide through the dissolve.
// Both registered plates (src/painted/shots/edu32.tsx) run on the shot-global clock: PA's cue at the shot start, PB's cue at F 24 with
// `fromSec` 0.8 and `dissolveSec` 16/30 (`PaintedShot.crossfade`), so PB's plate frame equals the shot frame. Frame counts are the brief's
// estimate (72 f); the timed pass fits them to L06.

export const BRIDGE_N = 72;
/** Frame map (brief bridge spec): tree cards fold f20-f40, crossfade f24-f40, dive f0-f62, the real cat's look from f40. */
export const BRIDGE = {foldFrom: 20, foldTo: 40, fadeFrom: 24, fadeTo: 40, diveTo: 62, lookFrom: 40, foldDeg: 75} as const;
const DEG = Math.PI / 180;
/** f0 = the gate camera (VD32-25); f62 = the cat's eye height in front of the bench (Space D and Space F numbers are identical; hy 820 = R3 camera key). */
export const BRIDGE_CAM0: YCam = {x: 1.45, y: 1.0, z: 2.7, yaw: -28 * DEG, pitch: -17 * DEG, f: 1100, hy: 700};
export const BRIDGE_CAM1: YCam = {x: 0.35, y: 0.62, z: 1.55, yaw: -10 * DEG, pitch: -2 * DEG, f: 1000, hy: 820};
const CAT_AT: V3 = [0, BENCH_P.seat, -0.3];
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(x));

/** The one camera of B03-SH01 at shot frame F: eased in-out dive f0 -> f62, then a drift to the cut (push 0.05 m toward the cat, yaw -10 -> -8). */
export const bridgeCam = (F: number): YCam => {
  if (F <= BRIDGE.diveTo) return mixYCam(BRIDGE_CAM0, BRIDGE_CAM1, easeInOut(F / BRIDGE.diveTo));
  const u = clamp01((F - BRIDGE.diveTo) / (BRIDGE_N - 1 - BRIDGE.diveTo)), c = BRIDGE_CAM1;
  const dx = CAT_AT[0] - c.x, dy = CAT_AT[1] - c.y, dz = CAT_AT[2] - c.z, l = Math.hypot(dx, dy, dz), k = (0.05 * u) / l;
  return {...c, x: c.x + dx * k, y: c.y + dy * k, z: c.z + dz * k, yaw: (-10 + 2 * u) * DEG};
};
/** Tree-card fold angle (radians) at F: 0 -> 75 deg, eased, f20 -> f40. */
export const bridgeFold = (F: number) => BRIDGE.foldDeg * DEG * easeInOut((F - BRIDGE.foldFrom) / (BRIDGE.foldTo - BRIDGE.foldFrom));

/** Caption-band light (G3, 21 Nov 2026; caption-zone limits mean 0.25 / p95 0.40 on y 1230-1344): a soft shade on the near ground, nested
 *  glazes whose back edges are wavy world lines on the ground (x -6..6 at depth z) filled down past the frame bottom, darkest nearest the camera.
 *  PB: the two canopies' shade on the lawn from under the bench forward (overcast), painted on the lawn before the trunks, bench and figures, so
 *  the lawn behind the bench stays light behind the cat. PA: the desk lamp's pool falling off on the near page, painted last over the pop-up
 *  (its steps start in front of the paper men's feet) and ramped in over f0-f10 so f0 stays the LF02 entry frame. */
export const NEAR_SHADE = {
  pa: {color: '#1c1820', steps: [[0.1, 60], [0.25, 70], [0.4, 80], [0.55, 90]] as [number, number][]},
  pb: {color: '#1f2c24', steps: [[-0.35, 45], [-0.2, 55], [-0.06, 65], [0.04, 75], [0.12, 85]] as [number, number][]},
  paRamp: 10,
};
const paintNearShade = (p: Painter, c: YCam, seed: number, {color, steps}: {color: string; steps: [number, number][]}, k: number) => {
  if (k <= 0) return;
  steps.forEach(([z, op], i) => {
    const edge = Array.from({length: 49}, (_, j) => {
      const x = -6 + j * 0.25;
      return camPoint(c, [x, 0.002, z + 0.035 * Math.sin(x * 2.3 + i * 1.7) + 0.02 * Math.sin(x * 5.9 + i)]);
    }).filter((q): q is Pt => q !== null);
    if (edge.length < 2) return;
    washAt(p, seed + i, color, op * k, [...edge, [edge[edge.length - 1][0], 2300], [edge[0][0], 2300]], 0.2, 0.2);
  });
};

/** Plate PA (paper, Space D page P'): the LF02 pop-up seen through the bridge camera, the men talking, the tree cards folding down outward. */
export const paintBridgePA = (p: Painter, F: number, id = 'B03-SH01-PA') => {
  paintParkPopUp(p, bridgeCam(F), id, 1.2 + F / 30, bridgeFold(F));
  paintNearShade(p, bridgeCam(F), 36000, NEAR_SHADE.pa, easeInOut(F / NEAR_SHADE.paRamp));
};

/** Plate PB (real, Space F, overcast): real trees where the cards stood, the bench, the mannequins in the same coats, the real cat at the paper
 *  cat's anchor and size (same `catDef`); from f40 the cat looks around once (head only, first half of the kit `look-left-right`). */
export const paintBridgePB = (p: Painter, F: number, id = 'B03-SH01-PB') => {
  const c = bridgeCam(F), t = 2.0 + F / 30;
  paintFieldBack(p, c, 'overcast');
  paintNearShade(p, c, 36100, NEAR_SHADE.pb, 1);
  paintFieldTree(p, c, SF.treeR, 35000, 'overcast');
  paintFieldTree(p, c, SF.treeL, 35100, 'overcast');
  paintFieldBenchBack(p, c, 'overcast');
  paintFieldBenchSeat(p, c, 'overcast');
  const tt = Math.min(0.45, Math.max(0, (F - BRIDGE.lookFrom) / 30));
  const look = F >= BRIDGE.lookFrom ? animalMotion('look-left-right', tt, {animal: catDef(CAT_SCALE.diorama), view: 'front'}).pose.look : undefined;
  lead(id, 'CAT real x1.6 (sit)', paintRealCat(p, c, {at: SF.catSeat, t, pose: look === undefined ? {} : {look}}));
  lead(id, 'MANNEQUIN L', paintSeatedMannequin(p, c, MANNEQUIN_L, {at: SF.manL, t, seed: 34100, coat: TRENCH.tan, shade: 0.04}));
  lead(id, 'MANNEQUIN R', paintSeatedMannequin(p, c, MANNEQUIN_R, {at: SF.manR, t, seed: 34200, coat: TRENCH.grey, hat: true, shade: 0.04}));
  paintNearLawn(p, c, 'overcast');
};

/** Picture points that must coincide between the plates (brief: bench line, seat line, cat foot anchor), at F. Same world points, same camera. */
export const bridgeMarks = (F: number) => {
  const c = bridgeCam(F), P = (v: V3) => camPoint(c, v);
  return {seatL: P([BENCH_P.x0, BENCH_P.seat, BENCH_P.zf]), seatR: P([BENCH_P.x1, BENCH_P.seat, BENCH_P.zf]), benchFootL: P([BENCH_P.x0, 0, BENCH_P.zf]),
    benchFootR: P([BENCH_P.x1, 0, BENCH_P.zf]), catFoot: P(CAT_AT)};
};

/** QA look frames: each plate alone at a bridge frame (`BR-PA-<F>`, `BR-PB-<F>`), for the per-plate alignment and the desk / sky area checks.
 *  The mixed frames come from the registered plates through the QA composition EDU32-LF-BR (src/videos/edu32-gates). */
export const BRIDGE_CAPTION = 'แต่พอปล่อยลงสนามทดสอบ…';
export const BRIDGE_LOOKS: Record<string, () => LookDef> = Object.fromEntries([0, 4, 8, 16, 20, 24, 28, 32, 36, 40, 62, 71].flatMap((F) => [
  [`BR-PA-${F}`, (): LookDef => ({shot: 'B03-SH01', cam: bridgeCam(F), t: 1.2 + F / 30, paper: '#2c2630', caption: BRIDGE_CAPTION, paint: (p) => paintBridgePA(p, F, `BR-PA-${F}`)})],
  [`BR-PB-${F}`, (): LookDef => ({shot: 'B03-SH01', cam: bridgeCam(F), t: 2.0 + F / 30, paper: '#c9cfc4', caption: BRIDGE_CAPTION, paint: (p) => paintBridgePB(p, F, `BR-PB-${F}`)})],
]));
