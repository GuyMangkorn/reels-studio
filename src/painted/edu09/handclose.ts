// HAND-CLOSE close plate (brief EDU-EP09-BRIEF-R1.2): set-cm, origin on the table under BOY's left middle MCP, +y up, fingers -z, +x toward
// BOY's thumb. Table top y 0, BOY's table edge at z +32 (R1.2: his test hand sits 0.18 m further onto the table, dining z -0.08, so the whole forearm rests on
// the wood; dining = (-0.14 - x/100, 0.72 + y/100, -0.08 - z/100)), his lap below it. Lamp shade at (-14, 90, -11): upper left in CAM-POV.
import {hardFill, inkLine} from '../kit/draw';
import {macroHand, type HandMacro, type HandPoseId} from '../kit/hands';
import {camMove, camOf} from '../kit/cam-moves';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {hash} from '../kit/hash';
import type {V3} from '../kit/space';
import {camPoint, camPoly, type YCam} from '../kit/ycam';
import {BOY_TONE, C} from './palette';

const deg = (a: number) => (a * 180) / Math.PI;
/** One brief `cam:` line at its start or end: orbit target, azimuth, r, eye height (pitch looks at the target), lens, horizon. */
export const look = (at: V3, yaw: number, r: number, eye: number, f: number, hy: number): YCam =>
  camOf(camMove(at, [yaw, yaw], r, eye, {pitch: [-deg(Math.atan2(eye - at[1], r)), -deg(Math.atan2(eye - at[1], r))], f, hy}), 0);

/** CAM-POV R1.2 (user 8 Nov 2026: steeper, eye 36-40, r 26-30): SH01 `r 28 -> 26, eye 40 -> 38, f 3500, hy 750`. */
export const POV = {at: [0, 1.5, 1.0] as V3, r: [28, 26], eye: [40, 38], f: 3500, hy: 750};
export const povCam = (u: number): YCam => look(POV.at, 0, POV.r[0] + (POV.r[1] - POV.r[0]) * u, POV.eye[0] + (POV.eye[1] - POV.eye[0]) * u, POV.f, POV.hy);
/** DIAG-W R1.2 (W3: lens 2050 -> 2350, hy 700 -> 660, so the cords read; brief VD14 path unchanged): fingertips y about 240, shared muscle
 * y about 800-1000, elbow about 1220 (just under the caption band top, est). */
export const DIAG_W = {at: [0.3, 1.5, 12] as V3, r: [40, 37], eye: [58, 55], f: 2350, hy: 660};
export const diagCam = (u: number): YCam => look(DIAG_W.at, 0, DIAG_W.r[0] + (DIAG_W.r[1] - DIAG_W.r[0]) * u, DIAG_W.eye[0] + (DIAG_W.eye[1] - DIAG_W.eye[0]) * u, DIAG_W.f, DIAG_W.hy);

export const BOY_WRIST: [number, number] = [0.3, 6.5];
export const LAMP_SHADOW: V3 = [0.14, -0.9, 0.11];
/** BOY's left hand on HAND-CLOSE (seeds 1000-1239). */
export const boyHand = (pose: HandPoseId, o: Partial<HandMacro> & {lift?: Partial<Record<'thumb' | 'index' | 'little' | 'ring', number>>} = {}): HandMacro =>
  macroHand(pose, {side: -1, base: 1000, tone: BOY_TONE, plane: 0, at: BOY_WRIST, elbow: [0.6, 3.0, 30], shadowDir: LAMP_SHADOW, shadowAlpha: 0.34, shadowColor: '#3a2212', ...o});

const T = (x: number, z: number, y = 0): V3 => [x, y, z];
const EDGE_Z = 32;

/** Table, lamp pool and lap of HAND-CLOSE. `dim` 0..1 darkens toward the B03 70 % room. */
export const paintHandTable = (p: Painter, cam: YCam, o: {dim?: number} = {}) => {
  const dim = o.dim ?? 0, dk = (c: string) => mixColor(c, '#1c1410', dim * 0.3);
  // under the table: the dark room floor, then BOY's lap (navy trousers in shadow) just below his table edge
  hardFill(p, 10, dk('#3b2e27'), [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  hardFill(p, 11, dk(C.lapShade), camPoly(cam, [T(-40, 33, -17), T(40, 33, -17), T(44, 80, -19), T(-44, 80, -19)]));
  hardFill(p, 12, dk(C.lap), camPoly(cam, [T(-16, 36, -16), T(24, 36, -16), T(26, 80, -18), T(-18, 80, -18)]));
  // table top and its front edge (4 cm)
  hardFill(p, 13, dk(C.woodShade), camPoly(cam, [T(-200, EDGE_Z, 0), T(200, EDGE_Z, 0), T(200, EDGE_Z, -4), T(-200, EDGE_Z, -4)]));
  hardFill(p, 14, dk(C.wood), camPoly(cam, [T(-200, -200), T(200, -200), T(200, EDGE_Z), T(-200, EDGE_Z)]));
  // the far side of the table falls off out of the lamp pool (the lamp pool itself is the screen glow in look.tsx: soft, no ring edges)
  const far = (k: number, z: number, a: number) => { const q = camPoly(cam, [T(-200, -200), T(200, -200), T(200, z), T(-200, z)]); if (q.length > 2) hardFill(p.layer(a, 4000 + k), 40 + k, C.woodShade, q); };
  far(0, -40, 0.18); far(1, -60, 0.18); far(2, -85, 0.2);
  // plank seams (along the fingers) and grain strokes
  for (let i = -6; i <= 6; i++) {
    const x = i * 11 + 3.5;
    const a = camPoint(cam, T(x, -160)), b = camPoint(cam, T(x, EDGE_Z));
    if (a && b) inkLine(p, 60 + i + 6, [a, b], {color: dk('#74482b'), weight: 1.2, closed: false, still: true});
  }
  for (let i = 0; i < 70; i++) {
    const x = -60 + i * 1.75 + (hash(i * 13 + 1) - 0.5) * 1.8, z0 = -150 + hash(i * 7 + 5) * 60, z1 = Math.min(EDGE_Z - 0.5, z0 + 60 + hash(i * 3 + 9) * 110);
    const wob = (hash(i * 5 + 2) - 0.5) * 1.6;
    const pts = [T(x, z0), T(x + wob, (z0 + z1) / 2), T(x - wob * 0.4, z1)].map((v) => camPoint(cam, v));
    if (pts.every(Boolean)) inkLine(p, 80 + i, pts as Pt[], {color: dk(i % 3 ? C.grain : '#95603b'), weight: 1.0, curve: 0.3, closed: false, still: true});
  }
  // the edge highlight (lamp catches the rounded edge)
  const e0 = camPoint(cam, T(-200, EDGE_Z)), e1 = camPoint(cam, T(200, EDGE_Z));
  if (e0 && e1) inkLine(p, 140, [e0, e1], {color: dk('#c98d5a'), weight: 2.4, closed: false, still: true});
};
