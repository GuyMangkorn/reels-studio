import {camMove, camOf} from '../kit/cam-moves';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';

// SP4: the two brakes (VD22 catch-1854, VD27 safety-jaws), drawn to be unlike each other: timber + bow spring + iron pawl in sepia vs a steel T-rail + wedge jaws in cool steel.
let n = 0;
const fill = (p: Painter, cam: YCam, color: string, pts: V3[]) => { const q = camPoly(cam, pts); if (q.length >= 3) hardFill(p, 15000 + n++, color, q); };
const outline = (p: Painter, cam: YCam, color: string, pts: V3[], w = 1.4) => { const q = camPoly(cam, pts); if (q.length >= 3) inkLine(p, 15500 + n++, q, {weight: w, color, still: true}); };
const quad = (x0: number, x1: number, y0: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

// ---------------------------------------------------------------- 1854 catch (B04-SH04)
export const SEPIA = {paper: '#efe2c4', mid: '#b89b6e', shadow: '#6e5a3e', ink: '#3d2f22', shaft: '#fff3d6', amber: '#ffb84d', iron: '#4b4136', ironHi: '#7a6a58'} as const;
/** Spike camera (r 0.90). */
export const CATCH_CAM: YCam = camOf(camMove([0.95, 2.35, 0.1], [-15, -15], [0.9, 0.9], 2.5, {f: 2000, hy: 930}), 0);
/** `bite` 0..1: the pawl's travel into the notch (B-P1-FIX-c: the rope has gone slack first, so `slack` is 1 whenever `bite` > 0). */
/** CAM-HALL-CATCH R1.2 (VD22), push eased at f1050: target (0.72, 2.65, 0.10), yaw -15, r 1.28, eye 2.80, f 2000, hy 760 as the TARGET's picture row (horizon row = 760 + f (target.y - eye) / r; the pawl tip then lands at the request's (915, 1098)). */
export const CATCH_CAM_R12 = (r = 1.28): YCam => camOf(camMove([0.72, 2.65, 0.1], [-15, -15], [r, r], 2.8, {f: 2000, hy: 760 + (2000 * (2.65 - 2.8)) / r}), 0);
export const paintCatch = (p: Painter, cam: YCam, bite = 1, o: {slack?: number; spring?: number} = {}) => {
  n = 0;
  const S = SEPIA, slack = o.slack ?? (bite > 0 ? 1 : 0), spring = o.spring ?? (bite > 0 ? 1 : 0);
  // hall behind: a warm wall with soft light shafts from the upper left
  fill(p, cam, mixColor(S.mid, S.paper, 0.35), quad(-3, 4, -1, 7, -1.5));
  for (const [x0, x1, op] of [[-0.6, 0.0, 22], [0.35, 0.85, 16], [1.2, 1.7, 12]] as const) { const q = camPoly(cam, [[x0, 5, -1.4], [x1, 5, -1.4], [x1 + 1.6, 0.5, -1.4], [x0 + 1.6, 0.5, -1.4]]); if (q.length >= 3) washAt(p, 15200 + Math.round(x0 * 10), S.shaft, op * 2, q, 0.3, 0.1); }
  // upright: timber, front face z +0.10 with the notched left edge (sawtooth; tooth tops face up), inner face x 0.90 seen at an angle
  const ux = 0.9, depth = 0.065, pts: V3[] = [[1.1, -1, 0.1], [1.1, 4.0, 0.1]];
  for (let k = 38; k >= -4; k--) { const yk = 0.1 * k; pts.push([ux, yk + 0.1, 0.1], [ux + depth, yk + 0.04, 0.1], [ux + depth, yk, 0.1], [ux, yk, 0.1]); }
  pts.push([0.9, -1, 0.1]);
  const front = pts.filter((q) => q[1] >= 0.9 && q[1] <= 4.0 || q[1] === -1 || false);
  void front;
  const clipped = pts.map((q): V3 => [q[0], Math.max(0.9, Math.min(4.0, q[1])), q[2]]);
  fill(p, cam, S.mid, clipped);
  fill(p, cam, S.shadow, [[ux, 0.9, 0.1], [ux, 4.0, 0.1], [ux, 4.0, -0.1], [ux, 0.9, -0.1]]); // inner face, in shade
  outline(p, cam, S.ink, clipped, 1.6);
  for (let k = 9; k <= 38; k++) fill(p, cam, mixColor(S.shadow, S.ink, 0.35), [[ux, 0.1 * k + 0.04, 0.1], [ux + depth, 0.1 * k + 0.04, 0.1], [ux + depth, 0.1 * k, 0.1], [ux, 0.1 * k, 0.1]].map((q): V3 => [q[0], q[1], 0.1]).slice(1, 3).concat([[ux + depth, 0.1 * k, -0.1], [ux + depth, 0.1 * k + 0.04, -0.1]] as V3[])); // notch pockets going into depth
  // timber grain on the front face
  for (let i = 0; i < 6; i++) fill(p, cam, mixColor(S.mid, S.shadow, 0.28), quad(0.99 + i * 0.018, 0.995 + i * 0.018, 0.9, 4.0, 0.101));
  // platform side frame: post x 0.62..0.80, deck beam below, frame top beam
  fill(p, cam, mixColor(S.mid, S.paper, 0.25), quad(0.62, 0.8, 1.9, 3.0, 0.12));
  outline(p, cam, S.ink, quad(0.62, 0.8, 1.9, 3.0, 0.12), 1.6);
  fill(p, cam, S.shadow, quad(0.28, 0.62, 2.4, 2.48, 0.12));
  fill(p, cam, mixColor(S.mid, S.paper, 0.1), quad(-0.4, 0.8, 2.9, 3.0, 0.12));
  outline(p, cam, S.ink, quad(-0.4, 0.8, 2.9, 3.0, 0.12), 1.4);
  // bow (wagon) spring: a leaf across the platform top, flat once the rope is slack, pressing on the pawl's tail
  // the camera (r 0.90, x >= 0.68 in frame) sees only the spring's end: a leaf from the platform top frame (0.50, 2.88) down to the pawl's tail (0.77, 2.72)
  const sag = 0.12 * (1 - spring), leaf: V3[] = [];
  for (let i = 0; i <= 12; i++) { const u = i / 12; leaf.push([0.5 + 0.27 * u, 2.88 - 0.16 * u + sag * Math.sin(Math.PI * u), 0.14]); }
  const leaf2 = leaf.slice().reverse().map(([x, y, z]): V3 => [x, y - 0.04, z]);
  fill(p, cam, S.iron, [...leaf, ...leaf2]);
  outline(p, cam, S.ink, [...leaf, ...leaf2], 1.2);
  // cut hoist rope draped slack (R1.2): from the platform frame top (0.37, 3.05) in a sag to the frayed cut end (0.55, 2.92); taut = rising line
  const rope: Pt[] = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16, w: V3 = [0.37 + 0.18 * u, 3.05 - 0.13 * u - 0.1 * slack * Math.sin(Math.PI * u) + (1 - slack) * 0.9 * u, 0.14]; const q = camPoint(cam, w); if (q) rope.push(q); }
  if (rope.length > 2) { // a rope ribbon 0.025 m thick (px by the lens), twist marks across it
    const ru = camUnit(cam, [0.45, 3.0, 0.14]), hw = 0.0125 * ru, top: Pt[] = rope.map(([x, y]) => [x, y - hw]), bot: Pt[] = rope.map(([x, y]) => [x, y + hw]);
    hardFill(p, 15900, mixColor(S.shadow, S.ink, 0.3), [...top, ...bot.slice().reverse()]);
    for (let i = 1; i < rope.length - 1; i += 2) inkLine(p, 15950 + i, [[rope[i][0] - 0.004 * ru, rope[i][1] + hw], [rope[i][0] + 0.006 * ru, rope[i][1] - hw]], {weight: 1.1, color: S.mid, closed: false, still: true});
  }
  const endp = rope[rope.length - 1], eu = camUnit(cam, [0.55, 2.92, 0.14]);
  if (endp && slack > 0.5) for (const [dx, dy] of [[0.012, 0.03], [0.0, 0.04], [-0.012, 0.03]] as const) inkLine(p, 15905 + dx * 100, [endp, [endp[0] + dx * eu, endp[1] + dy * eu]], {weight: 1.4, color: S.shadow, closed: false, still: true}); // frayed strands
  // iron pawl: pivot (0.77, 2.62) on the post, tip into the notch pocket (0.965, 2.43); tail up under the leaf spring
  const tipX = 0.77 + (0.965 - 0.77) * bite, tipY = 2.62 - (2.62 - 2.43) * bite;
  const pawl: V3[] = [[0.74, 2.70, 0.15], [0.80, 2.70, 0.15], [tipX + 0.0, tipY + 0.04, 0.15], [tipX, tipY - 0.0, 0.15], [0.76, 2.58, 0.15]];
  fill(p, cam, S.iron, pawl);
  outline(p, cam, S.amber, pawl, 2.6);
  const nq = camPoly(cam, [[ux, 2.5, 0.1], [ux + depth, 2.44, 0.1], [ux + depth, 2.4, 0.1], [ux, 2.4, 0.1]]);
  if (nq.length >= 3) inkLine(p, 15910, nq, {weight: 2.6, color: S.amber, still: true});
  const pv = camPoint(cam, [0.77, 2.63, 0.16]), u = camUnit(cam, [0.77, 2.63, 0.16]);
  if (pv) hardFill(p, 15920, S.ironHi, ell(pv[0], pv[1], 0.022 * u, 0.022 * u, 12));
  // warm vignette: sepia, darker at the frame edges
  const c = camPoint(cam, [0.95, 2.5, 0.1]) ?? [540, 900];
  washAt(p, 15930, S.shadow, 26, [[0, 0], [1080, 0], [1080, 1920], [0, 1920]], 0.2, 0.2);
  washAt(p, 15931, S.paper, 22, ell(c[0], c[1], 520, 640, 24), 0.3, 0.1);
};

// ---------------------------------------------------------------- modern safety jaws (B05-SH03)
export const STEEL = {rail: '#8f9aa5', railHi: '#dfe6ec', wedge: '#c9d1d8', block: '#6f7a84', blockDark: '#4a545e', car: '#c0c8cf', wall: '#6b6e72', flash: '#ffb84d'} as const;
/** CAM-JAWS (VD27): target (0.85, y_car + 0.95, 0.15), yaw -20, r 0.75, eye = target y, f 2600, hy 800; drawn in car-relative height (y_car = 0). */
export const JAWS_CAM: YCam = camOf(camMove([0.85, 0.95, 0.15], [-20, -20], [0.75, 0.75], 0.95, {f: 2600, hy: 800}), 0);
/** `slip` m: how far the rail has slid down past the shoe since the bite (f1405: 0.1); `bloom` 0..1 the one-frame bite flash. */
export const paintJaws = (p: Painter, cam: YCam, slip = 0.1, bloom = 0, scroll?: number) => {
  n = 100;
  const S = STEEL;
  fill(p, cam, mixColor(S.wall, '#101214', 0.35), quad(-2, 3, -3, 5, -0.6)); // shaft wall behind
  // wall bracket + fixings drawn with the slip so the rail reads as moving
  const sliding = (y: number) => (scroll === undefined ? ((y + slip) % 0.5 + 0.5) % 0.5 : -(((scroll) % 0.5) + 0.5) % 0.5); // with `scroll` the camera rides the car: the rail and its fixings stream UP the picture
  for (let k = -8; k <= 12; k++) fill(p, cam, mixColor(S.wall, '#101214', 0.55), quad(0.55, 1.2, k * 0.5 - sliding(0) + 0.0, k * 0.5 - sliding(0) + 0.02, -0.59));
  // car side (left): shell and frame, cool steel
  fill(p, cam, S.car, quad(-0.4, 0.62, -3, 5, 0.1));
  fill(p, cam, mixColor(S.car, '#10161c', 0.25), [[0.62, -3, 0.1], [0.62, 5, 0.1], [0.62, 5, -0.15], [0.62, -3, -0.15]]);
  outline(p, cam, '#2a2c30', quad(-0.4, 0.62, -3, 5, 0.1), 1.2);
  // T-rail: head and web, smooth (no teeth): front face z +0.05 and the left flank x 0.80 seen at an angle
  fill(p, cam, S.rail, quad(0.8, 0.9, -3, 5, 0.05));
  fill(p, cam, mixColor(S.rail, '#10161c', 0.35), [[0.8, -3, 0.05], [0.8, 5, 0.05], [0.8, 5, -0.05], [0.8, -3, -0.05]]);
  fill(p, cam, S.railHi, quad(0.835, 0.855, -3, 5, 0.051));
  // shoe block straddling the rail head, bolted to the car frame; two wedge jaws bite the flanks
  const y0 = 0.87, y1 = 1.04;
  fill(p, cam, S.block, quad(0.62, 1.02, y0, y1, 0.09));
  fill(p, cam, S.blockDark, [[0.62, y1, 0.09], [1.02, y1, 0.09], [1.02, y1, -0.08], [0.62, y1, -0.08]]);
  fill(p, cam, S.blockDark, [[0.62, y0, 0.09], [0.62, y1, 0.09], [0.62, y1, -0.08], [0.62, y0, -0.08]]);
  // slot the rail passes through (dark), then the wedge faces (bright) pressed on each flank, angled
  fill(p, cam, '#1b1f23', quad(0.78, 0.92, y0 - 0.001, y1 + 0.001, 0.091));
  fill(p, cam, S.wedge, [[0.70, y0 + 0.01, 0.092], [0.80, y0 + 0.03, 0.092], [0.80, y1 - 0.03, 0.092], [0.70, y1 - 0.005, 0.092]]);
  fill(p, cam, S.wedge, [[0.90, y0 + 0.03, 0.092], [1.0, y0 + 0.01, 0.092], [1.0, y1 - 0.005, 0.092], [0.90, y1 - 0.03, 0.092]]);
  fill(p, cam, mixColor(S.wedge, '#10161c', 0.35), [[0.70, y0 + 0.01, 0.092], [0.80, y0 + 0.03, 0.092], [0.80, y0 + 0.012, 0.092]]);
  for (const [x, y] of [[0.66, y0 + 0.04], [0.66, y1 - 0.04], [0.98, y0 + 0.04], [0.98, y1 - 0.04]] as const) { const c = camPoint(cam, [x, y, 0.095]), u = camUnit(cam, [x, y, 0.095]); if (c) { hardFill(p, 15990, '#2f353b', ell(c[0], c[1], 0.012 * u, 0.012 * u, 8)); } }
  outline(p, cam, '#2a2c30', quad(0.62, 1.02, y0, y1, 0.09), 1.6);
  outline(p, cam, '#2a2c30', [[0.70, y0 + 0.01, 0.092], [0.80, y0 + 0.03, 0.092], [0.80, y1 - 0.03, 0.092], [0.70, y1 - 0.005, 0.092]], 1.2);
  outline(p, cam, '#2a2c30', [[0.90, y0 + 0.03, 0.092], [1.0, y0 + 0.01, 0.092], [1.0, y1 - 0.005, 0.092], [0.90, y1 - 0.03, 0.092]], 1.2);
  if (bloom > 0) { const c = camPoint(cam, [0.85, (y0 + y1) / 2, 0.1]), u = camUnit(cam, [0.85, 1, 0.1]); if (c) for (const [r, op] of [[0.14, 30], [0.08, 50], [0.04, 80]] as const) washAt(p, 15995 + r * 100, S.flash, op * bloom, ell(c[0], c[1], r * u, r * u, 16), 0.3, 0.1); }
  // scratch marks on the rail head below the bite (the slide): short bright lines
  for (let i = 0; i < Math.round(slip * 40); i++) { const a = camPoint(cam, [0.84 + 0.004 * (i % 3), y0 - 0.02 - i * 0.012, 0.052]), b = camPoint(cam, [0.84 + 0.004 * (i % 3), y0 - 0.05 - i * 0.012, 0.052]); if (a && b) inkLine(p, 15996 + i, [a, b], {weight: 0.8, color: '#ffffff', closed: false, still: true}); }
};

// ---------------------------------------------------------------- production states (pure in G)
import {jawsDrop, lin, seg} from './clock';
/** B04-SH04 catch states: the cut rope's slack end settles G1134-1138, the bow spring flattens G1139-1147, the pawl swings out G1149-1155 and bites at G1155 ("จับ"). Order slack -> spring -> pawl (B-P1-FIX-c). */
export const catchAt = (g: number): {bite: number; slack: number; spring: number} => ({slack: 0.4 + 0.6 * seg(g, 1134, 1138), spring: seg(g, 1139, 1147), bite: g < 1149 ? 0 : seg(g, 1149, 1155)});
export const paintCatchAt = (p: Painter, cam: YCam, g: number) => { const s = catchAt(g); paintCatch(p, cam, s.bite, {slack: s.slack, spring: s.spring}); };
/** B05-SH03 jaws states: the car drops 0.40 m (G1485-1500), the jaws bite at G1500 (one amber bloom frame), slide 0.28 m to G1506, settle to G1510. */
export const jawsAt = (g: number): {scroll: number; slip: number; bloom: number} => ({scroll: jawsDrop(g), slip: Math.max(0, jawsDrop(g) - 0.4), bloom: g === 1500 ? 1 : 0});
export const paintJawsAt = (p: Painter, cam: YCam, g: number) => { const s = jawsAt(g); paintJaws(p, cam, s.slip, s.bloom, s.scroll); };
void lin;
