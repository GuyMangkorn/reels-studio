// SET-DINING (brief EDU-EP09-BRIEF-R1.2 set plan, metres): origin on the floor under the table centre, +x right from the main camera side,
// +y up, +z toward the camera side; BOY and ELDER sit on the -z side facing +z. A Thai home after dinner, about 19:30: one warm pendant lamp,
// a cream wall, an evening-blue window. Look-frame code for LF02 (S01-B01-SH02); the scene sheets reuse it at W5.
import {drawFigure, type CastDef, type FigAnchors} from '../kit/cast';
import {drawChair} from '../kit/props';
import {ell, hardFill, inkLine} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {poseFor} from '../kit/poses';
import type {V3} from '../kit/space';
import {flatCircle, hull, paintBox, qy, qz, wFill, wInk} from '../kit/world';
import {camPoint, camPoly, camUnit, type YCam} from '../kit/ycam';
import {paintHandMacro, macroHand, type HandPoseId, type MacroTone} from '../kit/hands';
import {BOY_TONE, C, ELDER_TONE} from './palette';

export const BOY: CastDef = PEOPLE['boy-school'];
export const ELDER: CastDef = PEOPLE['man-elder'];
export const TABLE_Y = 0.72;
/** Ground points of the seated rigs; y lifts the P31 rig to the brief's seated heights (BOY on a cushion: chin about 0.83; ELDER chin about 0.86). */
export const SEAT = {boy: [-0.26, 0.17, -0.62] as V3, elder: [0.3, 0.06, -0.7] as V3};

const ink = (p: Painter, c: YCam, id: number, pts: V3[], w = 1.1, color: string = C.ink, closed = true) => {
  const q = pts.map((v) => camPoint(c, v));
  if (q.every(Boolean)) inkLine(p, id, q as Pt[], {color, weight: w, closed, still: true});
};

/** Back wall, window, clock, calendar, shelf, fan, floor (everything behind the sitters). */
export const paintRoomBack = (p: Painter, c: YCam) => {
  const Z = -1.5;
  hardFill(p, 300, C.wall, [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  wFill(p, c, 301, C.floor, qy(0, -2, 2, Z, 1));
  for (let i = -5; i <= 5; i++) ink(p, c, 310 + i + 5, [[i * 0.4, 0.001, Z], [i * 0.4, 0.001, 1]], 0.8, C.grout, false);
  for (let k = 0; k < 6; k++) ink(p, c, 330 + k, [[-2, 0.001, Z + k * 0.4], [2, 0.001, Z + k * 0.4]], 0.8, C.grout, false);
  wFill(p, c, 302, C.wall, qz(Z, -2, 2, 0, 2.6));
  // soft wall stains and the lamp's warm wash high on the wall behind the sitters
  wFill(p.layer(0.25, 3000), c, 303, C.wallShade, [[-2, 0.06, Z], [2, 0.06, Z], [2, 0.42, Z], [0.6, 0.3, Z], [-0.8, 0.38, Z], [-2, 0.3, Z]]);
  wFill(p.layer(0.18, 3010), c, 304, C.wallShade, [[-2, 2.6, Z], [2, 2.6, Z], [2, 2.25, Z], [-2, 2.3, Z]]);
  wFill(p, c, 305, C.skirting, qz(Z + 0.002, -2, 2, 0, 0.1));
  // window: evening blue, a pale curtain on its right half, one far streetlight
  wFill(p, c, 320, '#e0d3ba', qz(Z + 0.003, 0.4, 1.4, 0.95, 2.0));
  wFill(p, c, 321, C.winA, qz(Z + 0.004, 0.45, 1.35, 1.0, 1.95));
  wFill(p, c, 322, mixColor(C.winA, C.winB, 0.55), qz(Z + 0.005, 0.45, 1.35, 1.0, 1.35));
  wFill(p.layer(0.5, 3020), c, 323, C.winB, qz(Z + 0.006, 0.45, 1.35, 1.0, 1.12));
  const sl = camPoint(c, [0.62, 1.22, Z + 0.007]);
  if (sl) hardFill(p, 324, '#ffe7a8', ell(sl[0], sl[1], 3.5 * camUnit(c, [0.62, 1.22, Z]) / 300, 3.5 * camUnit(c, [0.62, 1.22, Z]) / 300, 10));
  wFill(p, c, 325, '#f1e6d2', [[0.95, 2.0, Z + 0.02], [1.38, 2.0, Z + 0.02], [1.42, 0.96, Z + 0.02], [1.05, 0.96, Z + 0.02], [1.0, 1.5, Z + 0.02]]);
  ink(p, c, 326, [[1.1, 1.95, Z + 0.021], [1.12, 1.0, Z + 0.021]], 0.7, '#cdbfa3', false);
  ink(p, c, 327, [[1.25, 1.95, Z + 0.021], [1.3, 1.0, Z + 0.021]], 0.7, '#cdbfa3', false);
  ink(p, c, 328, [[0.45, 1.0, Z + 0.006], [1.35, 1.0, Z + 0.006], [1.35, 1.95, Z + 0.006], [0.45, 1.95, Z + 0.006]], 1.4, '#8a7a62');
  ink(p, c, 329, [[0.9, 1.0, Z + 0.006], [0.9, 1.95, Z + 0.006]], 1.2, '#8a7a62', false);
  // wall clock (white face, hands at about 19:32, no digits)
  const ck: V3 = [-0.6, 1.95, Z + 0.01], cp = camPoint(c, ck), cu = camUnit(c, ck);
  if (cp) {
    hardFill(p, 340, '#5a4636', ell(cp[0], cp[1], 0.15 * cu, 0.15 * cu, 24));
    hardFill(p, 341, '#fbf8f0', ell(cp[0], cp[1], 0.128 * cu, 0.128 * cu, 24));
    for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2, r0 = 0.105 * cu, r1 = (k % 3 ? 0.115 : 0.12) * cu; inkLine(p, 342 + k, [[cp[0] + r0 * Math.sin(a), cp[1] - r0 * Math.cos(a)], [cp[0] + r1 * Math.sin(a), cp[1] - r1 * Math.cos(a)]], {weight: 1, closed: false, still: true}); }
    const hand = (id: number, a: number, l: number, w: number) => inkLine(p, id, [cp, [cp[0] + l * cu * Math.sin(a), cp[1] - l * cu * Math.cos(a)]], {weight: w, closed: false, still: true});
    hand(356, ((7 + 32 / 60) / 12) * Math.PI * 2, 0.06, 2.4); hand(357, (32 / 60) * Math.PI * 2, 0.095, 1.6);
  }
  // calendar (picture block + grid wash, no readable text)
  wFill(p, c, 360, '#f6f1e6', qz(Z + 0.01, -1.3, -1.0, 1.28, 1.73));
  wFill(p, c, 361, '#7fa2a8', qz(Z + 0.011, -1.27, -1.03, 1.5, 1.7));
  wFill(p, c, 362, '#e3dccd', qz(Z + 0.011, -1.27, -1.03, 1.31, 1.47));
  ink(p, c, 363, qz(Z + 0.012, -1.3, -1.0, 1.28, 1.73), 0.9, '#8a7a62');
  // shelf with rice cooker, thermos and a family photo (no readable faces)
  paintBox(p, c, 370, {x0: -1.7, x1: -0.95, y0: 1.08, y1: 1.11, z0: Z, z1: Z + 0.24}, '#8a6040', {}, {ink: true});
  paintBox(p, c, 372, {x0: -1.6, x1: -1.36, y0: 1.11, y1: 1.33, z0: Z + 0.03, z1: Z + 0.22}, '#e9e4da', {}, {ink: true});
  paintBox(p, c, 374, {x0: -1.27, x1: -1.18, y0: 1.11, y1: 1.4, z0: Z + 0.07, z1: Z + 0.16}, '#c0473a', {}, {ink: true});
  paintBox(p, c, 376, {x0: -1.12, x1: -0.98, y0: 1.11, y1: 1.29, z0: Z + 0.12, z1: Z + 0.14}, '#6a4a32', {}, {ink: true});
  // brush texture on the wall: soft vertical streaks and a few stains (UT12)
  for (let i = 0; i < 14; i++) {
    const x = -1.9 + i * 0.29 + ((i * 17) % 5) * 0.03, y0 = 0.15 + ((i * 7) % 4) * 0.2, y1 = y0 + 0.8 + ((i * 5) % 3) * 0.3;
    wFill(p.layer(0.07, 3030 + i), c, 390 + i, i % 3 ? C.wallShade : '#f4ead6', qz(Z + 0.001, x, x + 0.07 + (i % 2) * 0.05, y0, Math.min(2.55, y1)));
  }
  wFill(p.layer(0.12, 3050), c, 389, '#b9a585', [[-0.2, 0.55, Z + 0.001], [0.15, 0.62, Z + 0.001], [0.22, 0.45, Z + 0.001], [-0.1, 0.4, Z + 0.001]]);
  // shadow pool on the floor under the table
  wFill(p.layer(0.35, 3060), c, 388, '#5a4636', qy(0.002, -0.85, 0.85, -0.55, 0.5));
  // stand fan (off)
  const fan: V3 = [1.6, 1.08, -1.15], fp = camPoint(c, fan), fu = camUnit(c, fan);
  ink(p, c, 380, [[1.6, 0, -1.15], [1.6, 1.0, -1.15]], 3, '#6f7378', false);
  if (fp) { hardFill(p, 381, '#9fb6bf', ell(fp[0], fp[1], 0.2 * fu, 0.2 * fu, 22)); inkLine(p, 382, ell(fp[0], fp[1], 0.2 * fu, 0.2 * fu, 22), {weight: 1.1, still: true}); }
};

/** Chair backs behind a sitter (wood, two posts and a top rail), at the seat point. */
const paintChairBack = (p: Painter, c: YCam, id: number, at: V3, w = 0.42) => {
  paintBox(p, c, id, {x0: at[0] - w / 2, x1: at[0] - w / 2 + 0.04, y0: 0, y1: 0.95, z0: at[2] - 0.2, z1: at[2] - 0.16}, '#7a5034', {}, {ink: true});
  paintBox(p, c, id + 2, {x0: at[0] + w / 2 - 0.04, x1: at[0] + w / 2, y0: 0, y1: 0.95, z0: at[2] - 0.2, z1: at[2] - 0.16}, '#7a5034', {}, {ink: true});
  paintBox(p, c, id + 4, {x0: at[0] - w / 2, x1: at[0] + w / 2, y0: 0.82, y1: 0.95, z0: at[2] - 0.2, z1: at[2] - 0.16}, '#86583a', {}, {ink: true});
};

export type Sitter = {face?: FaceState; t: number; lHand?: V3; rHand?: V3; lPose?: HandPoseId; rPose?: HandPoseId; lElbow?: V3; rElbow?: V3; look?: Pt};

/** Elbow resting on the wood just inside the back edge (z -0.40): BOY's 0.025 m inside the hand's x (under the shoulder; his hands lie a little wider), ELDER's 0.03 m outside. */
const ELBOW_Z = -0.37;
const elbowFor = (hand: V3, side: 1 | -1, def: CastDef): V3 => [hand[0] + side * (def === ELDER ? 0.03 : -0.025), TABLE_Y + 0.026, ELBOW_Z];

/** A seated person at the table: P31 on the seat, front view squared to the lens. Each arm resting on the table is drawn in two parts that meet at
 * the elbow (fix round 1, LF02): the rig draws the upper arm and sleeve from the shoulder down to the elbow on the wood (`via`), its forearm and
 * mitten fold down behind the table top (hidden); `paintTableArm` then draws the forearm on the wood from that elbow and the macro hand. */
const paintSitter = (p: Painter, c: YCam, def: CastDef, at: V3, s: Sitter, seed: number): FigAnchors | null => {
  const g = camPoint(c, at), u = camUnit(c, at);
  if (!g) return null;
  const pose = poseFor('P31', def, g as Pt, u, 'front');
  const face = s.face ?? EXPRESSIONS.neutral;
  // character's left = screen right (+x) in the front view
  const arm = (hand: V3 | undefined, elbow: V3 | undefined, side: 1 | -1) => {
    if (!hand) return null;
    const e = elbow ?? elbowFor(hand, side, def), ep = camPoint(c, e), down = camPoint(c, [e[0], e[1] - 0.25, e[2] - 0.02]);
    return ep && down ? {to: down, via: ep} : null;
  };
  const l = arm(s.lHand, s.lElbow, 1), r = arm(s.rHand, s.rElbow, -1);
  return drawFigure(p, def, g as Pt, u, {...pose, view: 'front', face, noShadow: true, ...(l ? {lArm: l} : {}), ...(r ? {rArm: r} : {})}, s.t, seed);
};
void drawChair;

/** Forearm on the wood from the elbow to the wrist, and the five-finger macro hand (kit `paintHandMacro`, metre set: unit 0.01, yaw so the
 * fingers continue the forearm). Five fingers here, not body-scale mittens: the hand is about 100 px wide (fingers about 20 px) and it is the
 * same left hand that ends SH01 in `ring-strain`, so the try reads across the cut (Film decision, fix round 1). `hand` is the middle MCP. */
const paintTableArm = (p: Painter, c: YCam, base: number, hand: V3, elbow: V3, side: 1 | -1, pose: HandPoseId, size: number, tone: MacroTone, sleeve?: {color: string; shade: string}) => {
  const fwd0 = [hand[0] - elbow[0], hand[2] - elbow[2]], L = Math.hypot(fwd0[0], fwd0[1]) || 1, fx = fwd0[0] / L, fz = fwd0[1] / L;
  const back = 0.065 * size, wrist: [number, number] = [hand[0] - fx * back, hand[2] - fz * back];
  const yaw = (Math.atan2(fx, -fz) * 180) / Math.PI;
  const h = macroHand(pose, {side, size, unit: 0.01, base, tone, plane: TABLE_Y, at: wrist, yaw, elbow, shadowDir: [-0.1, -0.9, 0.25], shadowAlpha: 0.3, shadowColor: '#3a2212',
    ...(pose === 'ring-strain' ? {tremble: {finger: 'ring' as const, amp: 0.0008, hz: 10}} : {})});
  const out = paintHandMacro(p, c, h);
  if (sleeve) paintCuffSleeve(p, c, base + 400, h.wrist, [elbow[0] - fx * 0.03, elbow[1], elbow[2] - fz * 0.03], 0.024 * size, sleeve);
  return out;
};

/** Fix round 2 (LF02): ELDER's cardigan sleeve over the forearm as a soft tube instead of the macro's flat-ended sleeve (it read as a box):
 * world rings at the cuff and the elbow, hulled; a ribbed knit cuff band with a wobbly rim over the wrist, two creases toward the elbow and
 * a round elbow end. `r` is the wrist radius (m); the cuff edge sits halfway wrist -> elbow. */
const paintCuffSleeve = (p: Painter, c: YCam, id: number, wrist: V3, end: V3, r: number, s: {color: string; shade: string}) => {
  const ax = [end[0] - wrist[0], end[1] - wrist[1], end[2] - wrist[2]], al = Math.hypot(ax[0], ax[1], ax[2]) || 1, a: V3 = [ax[0] / al, ax[1] / al, ax[2] / al];
  // basis across the arm: u level (toward +x for an arm along z), v up
  const ul = Math.hypot(a[2], a[0]) || 1, u: V3 = [-a[2] / ul, 0, a[0] / ul], v: V3 = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  const at = (t: number): V3 => [wrist[0] + ax[0] * t, wrist[1] + ax[1] * t, wrist[2] + ax[2] * t];
  const ring = (o: V3, rr: number, wob = 0, n = 28): V3[] => Array.from({length: n}, (_, i) => { const th = (i / n) * Math.PI * 2, k = rr * (1 + wob * Math.sin(th * 5 + 0.7) + wob * 0.6 * Math.sin(th * 3)); return [o[0] + k * (Math.cos(th) * u[0] + Math.sin(th) * v[0]), o[1] + k * (Math.cos(th) * u[1] + Math.sin(th) * v[1]) + 0.004, o[2] + k * (Math.cos(th) * u[2] + Math.sin(th) * v[2])]; });
  const cuff = at(0.5), rc = r * 1.22, re = r * 1.36;
  const cuffRing = ring(cuff, rc, 0.05), body = hull([...camPoly(c, cuffRing), ...camPoly(c, ring(end, re))]);
  if (body.length < 3) return;
  hardFill(p, id, s.color, body);
  // shade: the half away from the lamp (lamp over the table centre, x 0), i.e. the +u side for an arm right of centre
  const sg = wrist[0] >= 0 ? 1 : -1, half = (pts: V3[]) => pts.filter((q) => ((q[0] - cuff[0]) * u[0] + (q[2] - cuff[2]) * u[2]) * sg > -0.15 * r);
  const sh = hull([...camPoly(c, half(cuffRing)), ...camPoly(c, half(ring(end, re)))]);
  if (sh.length > 2) hardFill(p, id + 1, s.shade, sh);
  inkLine(p, id + 2, body, {weight: 1.1, still: true, color: mixColor(s.shade, '#2a1a10', 0.4)});
  // creases where the sleeve bunches toward the elbow (upper side only)
  [0.74, 0.86].forEach((t, k) => {
    const arc = ring(at(t), re * (1 + k * 0.02), 0.03, 28).slice(3 + k * 2, 11 + k);
    const pts = camPoly(c, arc);
    if (pts.length > 1) inkLine(p, id + 3 + k, pts, {weight: 1, closed: false, still: true, color: mixColor(s.shade, '#2a1a10', 0.3)});
  });
  // ribbed knit cuff: a darker band 2.2 cm deep from the cuff edge back, rib strokes along the arm, a soft wobbly rim over the wrist
  const dt = 0.022 / al, edge = ring(cuff, rc * 1.03, 0.05), back = ring(at(0.5 + dt), rc * 1.0, 0.03);
  const band = hull([...camPoly(c, edge), ...camPoly(c, back)]);
  if (band.length > 2) hardFill(p, id + 5, mixColor(s.color, s.shade, 0.55), band);
  const lo = (i: number) => Math.sin((i / 28) * Math.PI * 2) < 0.25;
  for (let i = 0; i < 28; i += 2) {
    if (!lo(i)) continue;
    const q0 = camPoint(c, edge[i]), q1 = camPoint(c, back[i]);
    if (q0 && q1) inkLine(p, id + 10 + i, [q0, q1], {weight: 0.9, closed: false, still: true, color: mixColor(s.shade, '#2a1a10', 0.25)});
  }
  const rim = camPoly(c, edge.filter((_, i) => lo(i)));
  if (rim.length > 1) inkLine(p, id + 7, rim, {weight: 1.4, closed: false, still: true, color: mixColor(s.shade, '#2a1a10', 0.45)});
};

/** Pendant lamp (W3: shade centre lowered to y 1.45 (0.73 m over the table) so its rim enters the top of the close-ups): cord, a cream cone shade, the lit opening. */
export const LAMP: V3 = [0, 1.45, -0.15];
const paintLamp = (p: Painter, c: YCam) => {
  const [x, y, z] = LAMP;
  ink(p, c, 800, [[x, y + 0.1, z], [x, 2.6, z]], 1.4, '#3a2f28', false);
  const ring = (yy: number, r: number, n = 24): V3[] => Array.from({length: n}, (_, i) => { const t = (i / n) * Math.PI * 2; return [x + r * Math.cos(t), yy, z + r * Math.sin(t)]; });
  const top = camPoly(c, ring(y + 0.1, 0.06)), bot = camPoly(c, ring(y - 0.08, 0.18));
  if (top.length < 3 || bot.length < 3) return;
  const all = [...top, ...bot], xs = all.map((q) => q[0]);
  const lx = Math.min(...xs), rx = Math.max(...xs);
  const pick = (pts: Pt[], left: boolean) => pts.reduce((a, q) => (left ? (q[0] < a[0] ? q : a) : q[0] > a[0] ? q : a));
  const tl = pick(top, true), tr = pick(top, false), bl = pick(bot, true), br = pick(bot, false);
  hardFill(p, 801, '#e9d9b8', [tl, tr, br, bl]);
  hardFill(p, 802, '#cdb58c', [[(tl[0] + tr[0]) / 2 + (tr[0] - tl[0]) * 0.15, tl[1]], tr, br, [(bl[0] + br[0]) / 2 + (br[0] - bl[0]) * 0.2, bl[1]]]);
  hardFill(p, 803, '#fff6dc', bot);
  inkLine(p, 804, [tl, tr, br, bl], {weight: 1.2, still: true});
  inkLine(p, 805, bot, {weight: 1.0, still: true, color: '#b89a68'});
  void lx; void rx;
};

export type DiningOpts = {t: number; boy?: Sitter; elder?: Sitter; dim?: number};
export type DiningOut = {boy: FigAnchors | null; elder: FigAnchors | null};

/** The table (top, edge, legs) and its props; the props sit on the top in their brief positions. */
const paintTable = (p: Painter, c: YCam) => {
  const y = TABLE_Y;
  for (const [x, z] of [[-0.64, 0.34], [0.6, 0.34]] as const) paintBox(p, c, 402 + (x > 0 ? 1 : 0) * 2, {x0: x, x1: x + 0.05, y0: 0, y1: y - 0.04, z0: z, z1: z + 0.05}, C.woodShade, {front: -0.1}, {ink: true});
  paintBox(p, c, 400, {x0: -0.7, x1: 0.7, y0: y - 0.04, y1: y, z0: -0.4, z1: 0.4}, C.wood, {front: -0.25, left: -0.3, right: -0.3}, {ink: true});
  // grain on the top, along x
  for (let i = 0; i < 18; i++) {
    const z = -0.38 + i * 0.045, x0 = -0.68 + ((i * 37) % 11) * 0.03, x1 = x0 + 0.5 + ((i * 13) % 7) * 0.09;
    ink(p, c, 410 + i, [[x0, y + 0.0005, z], [Math.min(0.68, x1), y + 0.0005, z + 0.004]], 0.7, i % 2 ? C.grain : '#97603c', false);
  }
};

/** Props on the table (UT12): glasses, jug, mango plate, notebook + pencil, tissue box, each with a contact shadow. */
const paintProps = (p: Painter, c: YCam) => {
  const y = TABLE_Y;
  const shadow = (id: number, v: V3, r: number) => { const q = flatCircle(c, [v[0] + 0.015, y + 0.001, v[2] - 0.01], r, 18); if (q.length > 2) hardFill(p.layer(0.3, 3100 + id), id, '#3a2212', q); };
  const glass = (id: number, v: V3) => {
    shadow(id, v, 0.04);
    const a = camPoint(c, [v[0], y, v[2]]), b = camPoint(c, [v[0], y + 0.12, v[2]]), u = camUnit(c, v);
    if (!a || !b) return;
    const r = 0.033 * u, rb = 0.028 * u;
    const body: Pt[] = [[b[0] - r, b[1]], [b[0] + r, b[1]], [a[0] + rb, a[1]], [a[0] - rb, a[1]]];
    hardFill(p.layer(0.55, 3200 + id), id + 1, '#dfe9ec', body);
    hardFill(p.layer(0.6, 3210 + id), id + 2, '#bcd2d8', [[b[0] - r * 0.9, b[1] + (a[1] - b[1]) * 0.35], [b[0] + r * 0.9, b[1] + (a[1] - b[1]) * 0.35], [a[0] + rb * 0.95, a[1]], [a[0] - rb * 0.95, a[1]]]);
    inkLine(p, id + 3, ell(b[0], b[1], r, r * 0.3, 16), {weight: 0.9, still: true, color: '#6c7f86'});
    inkLine(p, id + 4, [[b[0] - r, b[1]], [a[0] - rb, a[1]]], {weight: 0.9, closed: false, still: true, color: '#6c7f86'});
    inkLine(p, id + 5, [[b[0] + r, b[1]], [a[0] + rb, a[1]]], {weight: 0.9, closed: false, still: true, color: '#6c7f86'});
    inkLine(p, id + 6, [[b[0] - r * 0.5, b[1] + 6], [a[0] - rb * 0.5, a[1] - 6]], {weight: 1.6, closed: false, still: true, color: '#ffffff'});
  };
  glass(500, [0.52, y, -0.08]); glass(520, [-0.58, y, -0.1]);
  // jug (behind the hands)
  shadow(540, [0.05, y, -0.34], 0.07);
  paintBox(p, c, 541, {x0: 0.0, x1: 0.1, y0: y, y1: y + 0.2, z0: -0.39, z1: -0.29}, '#e6efe9', {front: -0.06, left: -0.12, right: -0.12}, {ink: true});
  paintBox(p, c, 543, {x0: 0.002, x1: 0.098, y0: y, y1: y + 0.12, z0: -0.388, z1: -0.292}, '#b9d4d8', {front: -0.08, left: -0.14, right: -0.14}, {});
  paintBox(p, c, 545, {x0: 0.1, x1: 0.125, y0: y + 0.06, y1: y + 0.17, z0: -0.35, z1: -0.33}, '#d4ddd8', {}, {ink: true});
  // mango plate with a fork
  shadow(550, [0.48, y, 0.2], 0.11);
  const pl = flatCircle(c, [0.48, y + 0.006, 0.2], 0.1, 24);
  if (pl.length > 2) { hardFill(p, 551, '#f7f4ec', pl); inkLine(p, 552, pl, {weight: 0.9, still: true, color: '#9a8f80'}); }
  for (let k = 0; k < 5; k++) { const q = flatCircle(c, [0.45 + (k % 3) * 0.03, y + 0.014, 0.18 + Math.floor(k / 3) * 0.04], 0.018, 10); if (q.length > 2) { hardFill(p, 553 + k, '#f5b52e', q); } }
  // notebook (open, pushed aside) and pencil
  shadow(560, [-0.48, y, 0.12], 0.12);
  wFill(p, c, 561, '#fbfaf5', [[-0.62, y + 0.004, 0.02], [-0.36, y + 0.004, 0.04], [-0.35, y + 0.004, 0.22], [-0.61, y + 0.004, 0.2]]);
  ink(p, c, 562, [[-0.62, y + 0.004, 0.02], [-0.36, y + 0.004, 0.04], [-0.35, y + 0.004, 0.22], [-0.61, y + 0.004, 0.2]], 0.9, '#8a8172');
  ink(p, c, 563, [[-0.49, y + 0.005, 0.03], [-0.48, y + 0.005, 0.21]], 0.9, '#b8b0a0', false);
  for (let k = 0; k < 5; k++) ink(p, c, 564 + k, [[-0.6, y + 0.005, 0.05 + k * 0.03], [-0.5, y + 0.005, 0.055 + k * 0.03]], 0.6, '#9fb3c8', false);
  ink(p, c, 570, [[-0.42, y + 0.008, 0.27], [-0.3, y + 0.008, 0.24]], 3, '#e8b33a', false);
  // tissue box
  paintBox(p, c, 580, {x0: 0.55, x1: 0.69, y0: y, y1: y + 0.09, z0: -0.36, z1: -0.24}, '#f0d9e2', {front: -0.08, left: -0.14, right: -0.14}, {ink: true});
  wFill(p, c, 582, '#ffffff', [[0.6, y + 0.09, -0.31], [0.64, y + 0.13, -0.3], [0.65, y + 0.09, -0.29]]);
};

/** The whole room through `c`: back wall and props behind, ELDER and BOY seated, the table, their forearms on it, props. */
export const paintDining = (p: Painter, c: YCam, o: DiningOpts): DiningOut => {
  paintRoomBack(p, c);
  paintChairBack(p, c, 600, [SEAT.elder[0], 0, SEAT.elder[2]]);
  const elder = o.elder ? paintSitter(p, c, ELDER, SEAT.elder, o.elder, ELDER.seed) : null;
  paintChairBack(p, c, 620, [SEAT.boy[0], 0, SEAT.boy[2]], 0.36);
  const boy = o.boy ? paintSitter(p, c, BOY, SEAT.boy, o.boy, BOY.seed) : null;
  paintTable(p, c);
  // arms resting on the wood (character's left = +x); ELDER wears the cardigan's long sleeve to the cuff
  const elderSleeve = {color: ELDER_TONE.sleeve, shade: ELDER_TONE.sleeveShade};
  const arms: [Sitter | undefined, FigAnchors | null, CastDef, number, MacroTone, typeof elderSleeve | undefined][] = [[o.boy, boy, BOY, 1, BOY_TONE, undefined], [o.elder, elder, ELDER, 1.25, ELDER_TONE, elderSleeve]];
  arms.forEach(([s, fig, def, size, tone, sleeve], k) => {
    if (!s || !fig) return;
    if (s.lHand) paintTableArm(p, c, 2000 + k * 480, s.lHand, s.lElbow ?? elbowFor(s.lHand, 1, def), -1, s.lPose ?? 'flat', size, tone, sleeve);
    if (s.rHand) paintTableArm(p, c, 2240 + k * 480, s.rHand, s.rElbow ?? elbowFor(s.rHand, -1, def), 1, s.rPose ?? 'flat', size, tone, sleeve);
  });
  paintProps(p, c);
  paintLamp(p, c);
  void qz; void wInk; void camPoly;
  return {boy, elder};
};
