import type {FigAnchors} from '../kit/cast';
import {blob, ell, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, orbitYCam, type YCam} from '../kit/ycam';
import {antItem} from './ant';
import {paintBalcony, steam} from './balcony';
import {paintMug, paintTiny, TINY, tinyItem} from './cast';
import {D1_CONTACT, paintGarden, paintPlanter, sweep} from './garden';
import {paintBlade, SHADE, type Blade} from './macro';

// EDU-EP05-SHORT look-frame scenes (brief EDU-BRIEF-R1.1, storyboard SS-R1, workflow W3.1): pure paint functions of the frame, kept
// apart from the React wrappers in look.tsx so a measure script can run them without a canvas. Painted 3D camera: world-unit sets
// (metres on the balcony, set metres `sm` k 320 in the macro sets) + the kit yaw camera. Camera revisions of the brief's `est`
// values are marked "W3.1" and listed in scripts/edu-series/ep05/look-frames.md.

const FPS = 30;
const DEG = Math.PI / 180;
export const LF_FRAMES = {ANT1: 60, ANT2: 60, ANT3: 60, LF01: 60, LF02: 60, LF03: 60, LF04: 60} as const;
/** Anchors of the lead written by each paint call (lead-height measure). */
export const MEASURE: Record<string, FigAnchors | null> = {};

const ease = (frame: number, n: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, frame / (n - 1)));
type Orbit = {yaw0: number; yaw1: number; r0: number; r1: number; eye: number; f: number; hy: number; pitch?: number; cx?: number};
const orbit = (at: V3, k: Orbit, e: number): YCam =>
  ({...orbitYCam(at, k.r0 + (k.r1 - k.r0) * e, (k.yaw0 + (k.yaw1 - k.yaw0) * e) * DEG, k.eye, k.f, k.hy), pitch: (k.pitch ?? 0) * DEG, cx: k.cx ?? 0});

// ---- Ant look check (VD20): A1 walking right with L1, A2 standing (left), A3 the glance at TINY. SET-GARDEN-GRASS, sunlit.
const ANT_AT: V3 = [1.2, 0, -2.0];
export const ANT_CAM: Orbit = {yaw0: -6, yaw1: -2, r0: 3.4, r1: 3.2, eye: 0.6, f: 1000, hy: 960};
export const paintANT1 = (p: Painter, frame: number) => {
  const c = orbit([1.0, 0.8, -2.0], ANT_CAM, ease(frame, 60)), t = frame / FPS, at: V3 = [ANT_AT[0] - 0.6 + frame * 0.012, 0, ANT_AT[2]];
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [170, 330], items: [antItem(at, {view: 'right', walk: frame / 18, sway: 3 * Math.sin((frame / 18) * 2 * Math.PI), t})],
    fore: [sweep([0.05, 0, 0.75], [1, -0.4], 8, 30, 9901, 0.9, 16)]});
};
export const paintANT2 = (p: Painter, frame: number) => {
  const c = orbit([1.0, 0.8, -2.0], {...ANT_CAM, yaw0: 14, yaw1: 18}, ease(frame, 60)), t = frame / FPS;
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [170, 330], items: [antItem(ANT_AT, {view: 'left', sway: 1.5 * Math.sin(t * 1.3), t})],
    fore: [sweep([2.3, 0, 1.0], [-1, -0.4], 10, 34, 9902, 0.9, 16)]});
};
export const A3_CAM: Orbit = {yaw0: 4, yaw1: 8, r0: 3.7, r1: 3.5, eye: 0.7, f: 1000, hy: 900};
export const paintANT3 = (p: Painter, frame: number) => {
  const c = orbit([0.25, 0.9, -1.8], A3_CAM, ease(frame, 60)), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [170, 330], items: [
    antItem([1.0, 0, -1.9], {view: 'right', glance: 1, lookSide: -1, sway: 1.5 * Math.sin(t * 1.3), t}),
    tinyItem({at: [-0.55, 0, -1.7], view: 'front', pose: 'P01', face: 'happy', faceState: {look: [0.8, 0]}, headCock: 5, t}, out),
  ]});
  MEASURE.ANT3 = out.a ?? null;
};

// ---- LF01 balcony at dawn, S01-B01-SH01 (L01). Brief `cam: T-TINY (-0.30, 1.40, +0.30), yaw -30 -> -22, r 2.4 -> 2.2, eye 1.45, f 1050, hy 640`.
// W3.1: TINY at (-0.40, 0, +0.20); `yaw -24 -> -18, r 2.0 -> 1.85, hy 600` (closer lead, the planter beside her shoulder).
export const T_TINY_B: V3 = [-0.4, 1.4, 0.2];
export const LF01_CAM: Orbit = {yaw0: -24, yaw1: -18, r0: 2.0, r1: 1.85, eye: 1.45, f: 1050, hy: 600};
export const paintLF01 = (p: Painter, frame: number) => {
  const c = orbit(T_TINY_B, LF01_CAM, ease(frame, LF_FRAMES.LF01)), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  // v2 (user note 2026-11-06, the mug hand looked odd): `new: mug-cradle` replaces P19's raised elbow. Elbow down at her side, forearm up
  // across the shirt, mitten wrapped round the mug just under the chin (about to sip). Arm authored in figure metres from the ground
  // point: shoulder ~(-0.12, 1.05), elbow (-0.14, 0.79), wrist (-0.01, 1.015) = both bones 0.26 m.
  const gp: V3 = [T_TINY_B[0], 0, T_TINY_B[2]], g = camPoint(c, gp), uu = camUnit(c, gp);
  const at = (x: number, y: number): Pt => (g ? [g[0] + x * uu, g[1] - y * uu] : [540, 900]);
  const held = (q: Painter, a: FigAnchors, u: number) => { const rim = paintMug(q, a.rHand, u, {handle: 1, from: -1, skin: TINY.head.skin}); steam(q, rim, u, t); };
  paintBalcony(p, c, {t, cast: [tinyItem({at: gp, view: 'front', pose: 'P19', face: 'sleepy', headCock: 4, t, held,
    fig: {rArm: {to: at(-0.01, 1.015), via: at(-0.14, 0.79)}}}, out)]});
  MEASURE.LF01 = out.a ?? null;
};

// ---- LF02 macro planter looking up, S01-B01-SH04 (V01). Brief `cam: T-TINY (0, 1.0, 0) sm, yaw 0 -> +8, r 2.6, crane eye 0.6 -> 2.4,
// pitch 0 -> +35, f 1000, hy 900`. The look frame is the crane's first third: TINY still in frame, blades towering.
export const LF02_CAM = {yaw0: 0, yaw1: 8, r: 2.6, eye0: 0.6, eye1: 2.4, p0: 0, p1: 35, f: 1000, hy: 820}; // W3.1: hy 820 (brief 900) keeps her feet clear of the band
export const camLF02 = (u: number): YCam => {
  const k = LF02_CAM;
  return {...orbitYCam([0, 1.0, 0], k.r, (k.yaw0 + (k.yaw1 - k.yaw0) * u) * DEG, k.eye0 + (k.eye1 - k.eye0) * u, k.f, k.hy), pitch: (k.p0 + (k.p1 - k.p0) * u) * DEG};
};
export const paintLF02 = (p: Painter, frame: number) => {
  const c = camLF02(0.2 + 0.1 * (frame / 59)), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  paintPlanter(p, c, {t, items: [tinyItem({at: [0, 0, 0], view: 'front', pose: 'P12', face: 'surprised', faceState: {look: [0.15, -0.9]}, headCock: -3, t}, out)],
    fore: [sweep([-1.0, 0, 1.75], [0.5, -1], 4, 26, 9911, 0.8, 22, '#2f4a22'), sweep([1.05, 0, 1.6], [-0.4, -1], 6, 20, 9912, 0.9, 24, '#2f4a22')]});
  MEASURE.LF02 = out.a ?? null;
};

// ---- LF03 macro garden backlit with D1 at rest, S01-B03-SH01 (L07). Brief `cam: T-DROP, yaw -25 -> -15, r 3.0 -> 2.6, eye 1.0, f 1050, hy 700`.
// W3.1: target between TINY and the drop (1.55, 1.0, -0.8), `yaw -12 -> -6, r 3.3 -> 3.1, hy 760` so both read (r1 cropped TINY at the edge).
export const LF03_CAM: Orbit = {yaw0: -12, yaw1: -6, r0: 3.3, r1: 3.1, eye: 1.0, f: 1050, hy: 760};
export const TINY_LF03: V3 = [0.95, 0, -0.55];
export const paintLF03 = (p: Painter, frame: number) => {
  const c = orbit([1.55, 1.0, -0.8], LF03_CAM, ease(frame, LF_FRAMES.LF03)), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  const g = camPoint(c, D1_CONTACT), u = camUnit(c, D1_CONTACT);
  const reach: Pt = g ? [g[0] - 0.6 * u, g[1] - 0.3 * u] : [700, 600];
  paintGarden(p, c, {t, mode: 'sun', sun: [150, 300], shadeEdge: -0.5,
    items: [tinyItem({at: TINY_LF03, view: 'right', pose: 'P01', face: 'surprised', faceState: {mouth: 'smile', look: [0.6, -0.3]}, t, fig: {rArm: {to: reach, out: -1}}}, out)],
    fore: [sweep([0.2, 0, 1.35], [0.6, -1], 10, 40, 9921, 0.9, 20)]});
  MEASURE.LF03 = out.a ?? null;
};

// ---- LF04 cool shade + warmth puff + far CL02 ant, S01-B04-SH02 (L12). Brief `cam: T-TINY, yaw +5 -> +15 arc, r 1.9, eye 1.0, f 1050, hy 720`.
// W3.1: `yaw -25 -> -15` (brief +5 -> +15 put the warm clearing out of frame; VD11 wants it glowing behind her), `hy 640` (feet at the
// caption band top); CL02 at z -14.5 through a gap at x -1.5 (brief z -10 gave a ~150 px ant).
export const T_TINY_SHADE: V3 = [-1.4, 1.4, -0.6];
export const LF04_CAM: Orbit = {yaw0: -25, yaw1: -15, r0: 1.9, r1: 1.9, eye: 1.0, f: 1050, hy: 640};
const PUFF = {core: '#f4a259', mid: '#f8b874', edge: '#ffd29a'} as const;
/** `new: warmth-puff`: a soft cosy orange cloud, no outline, off-centre warm core (not smoke: no grey; not breath: away from the mouth). */
export const paintPuff = (p: Painter, x: number, y: number, r: number, seed: number, t: number, a = 1) => {
  washAt(p, seed, PUFF.edge, 120 * a, blob(seed, x, y, r, r * 0.8, t * 0.6, 18), 0.2, 0.1);
  washAt(p, seed + 1, PUFF.edge, 110 * a, blob(seed + 1, x - r * 0.45, y + r * 0.15, r * 0.6, r * 0.5, t * 0.6, 14), 0.2, 0.1);
  washAt(p, seed + 2, PUFF.edge, 110 * a, blob(seed + 2, x + r * 0.5, y + r * 0.1, r * 0.55, r * 0.45, t * 0.6, 14), 0.2, 0.1);
  washAt(p, seed + 3, PUFF.mid, 130 * a, blob(seed + 3, x - r * 0.1, y + r * 0.05, r * 0.6, r * 0.45, t * 0.6, 14), 0.2, 0.1);
  washAt(p, seed + 4, PUFF.core, 120 * a, blob(seed + 4, x - r * 0.15, y + r * 0.12, r * 0.38, r * 0.28, t * 0.6, 12), 0.2, 0.1);
};
/** World point seen at picture (X, Y) at depth d by camera c (pitch 0): the inverse of `camToPicture`. */
const fromPicture = (c: YCam, X: number, Y: number, d: number): V3 => {
  const r = ((X - 540 - (c.cx ?? 0)) * d) / c.f, up = ((c.hy - Y) * d) / c.f, s = Math.sin(c.yaw), co = Math.cos(c.yaw);
  return [c.x + r * co + d * s, c.y + up, c.z + r * s - d * co];
};
/**
 * LF04 v5 canopy: twelve overhanging blades of the T-SHADE tuft (SHADE palette, the same blade painter as the garden), authored as
 * world centre lines. Each line is laid out once on the frame-30 camera as a picture-space curve (base above the frame, a mid control,
 * a drooping tip) at a depth that runs from d0 at the base to d1 at the tip, then fixed in the world, so it slides with the yaw move.
 * Tips: the left blades droop lowest (y <= 520 at x < 240), above the CL02 leaf (x 245-445, top ~y 500) the tips stay at y <= 350,
 * over her head (x 440-690, top y 308) at y <= 220.
 */
const CANOPY_SPEC: [base: Pt, ctrl: Pt, tip: Pt, d0: number, d1: number, w: number, seed: number][] = [
  [[-220, -220], [40, 120], [-10, 540], 4.0, 3.0, 1.0, 9801],
  [[-150, -260], [170, -60], [215, 440], 4.6, 3.4, 0.85, 9811],
  [[60, -260], [420, -40], [395, 330], 5.2, 4.2, 0.8, 9821],
  [[380, -260], [300, 10], [110, 300], 6.0, 4.8, 0.7, 9831],
  [[520, -260], [660, 30], [585, 215], 5.0, 4.0, 0.75, 9841],
  [[780, -260], [560, -50], [470, 160], 6.2, 5.2, 0.65, 9851],
  [[930, -260], [900, -10], [770, 200], 5.4, 4.4, 0.8, 9861],
  [[1180, -260], [1060, -30], [955, 120], 6.4, 5.4, 0.7, 9871],
  [[1300, -240], [1120, 40], [1110, 230], 5.8, 4.8, 0.8, 9881],
  [[300, -260], [170, -80], [250, 150], 6.4, 5.4, 0.6, 9891],
  [[640, -260], [430, -60], [330, 240], 6.8, 5.8, 0.55, 9901],
  [[700, -260], [770, -40], [690, 140], 6.2, 5.4, 0.6, 9911],
];
const LF04_CANOPY: Blade[] = (() => {
  const c0 = orbit(T_TINY_SHADE, LF04_CAM, ease(30, LF_FRAMES.LF04));
  return CANOPY_SPEC.map(([b, m, e, d0, d1, w, seed], i): Blade => {
    const line = Array.from({length: 13}, (_, k): V3 => {
      const s = k / 12, a = (1 - s) * (1 - s), bb = 2 * s * (1 - s), cc = s * s;
      return fromPicture(c0, a * b[0] + bb * m[0] + cc * e[0], a * b[1] + bb * m[1] + cc * e[1], d0 + (d1 - d0) * s);
    });
    const pal = i % 3 === 1 ? {...SHADE, body: '#4a7a62', edge: '#7aa08a'} : SHADE;
    return {root: line[0], h: 0, w, dir: [0, 1], lean: 0, curl: 0, pal, seed, line, taper: 0.7};
  });
})();
export const paintLF04 = (p: Painter, frame: number) => {
  const c = orbit(T_TINY_SHADE, LF04_CAM, ease(frame, LF_FRAMES.LF04)), t = frame / FPS, out: {a?: FigAnchors | null} = {};
  // LF04 v2: CL02 moved clear of the tuft blade (x -1.14 -> -0.2 at frame 30, just on the lit side of the shade edge x -0.5, z -14.5 -> -13.0, gap centre -1.5 -> -0.4) and walking
  // -x as the brief's CL02 path says (v1 walked +x), so it sits in the open gap upper middle and can be found at 270 px.
  // LF04 v3: gap half width 2.6 -> 1.2 so the dark far tuft returns behind her head.
  // LF04 v4: tint eased (mul [0.90, 0.91, 0.98] u 0.30 -> [0.95, 0.93, 0.97] u 0.27) so her skin is less pale, still cool.
  const antAt: V3 = [0.16 - frame * 0.012, 0, -13.0];
  paintGarden(p, c, {t, mode: 'sun', drop: false, sun: [900, 330], shadeEdge: -0.5, gap: {x: -0.4, w: 1.2},
    items: [antItem(antAt, {view: 'left', walk: frame / 18, sway: 2 * Math.sin((frame / 18) * 2 * Math.PI), tint: {to: '#6f8aa0', u: 0.4}, noInk: true, t})],
    after: (q, cc) => {
      // the shade: cool air over everything left of the shade edge (x < -0.5 sm); the clearing behind on the right stays warm
      const e0 = camPoint(cc, [-0.5, 0, -30]), e1 = camPoint(cc, [-0.5, 0, -0.2]);
      const a0: Pt = e0 ?? [300, 700], a1: Pt = e1 ?? [1100, 1200], k = (a1[0] - a0[0]) / Math.max(1, a1[1] - a0[1]);
      const xb = a0[0] + k * (1980 - a0[1]);
      // LF04 v4: the wedge's upright edge pulled 30 px left (a0 + 20 -> a0 - 10) so it no longer overlaps the CL02 leaf's left tip
      washAt(q, 9950, '#5f7fa4', 150, [[-60, -60], [a0[0] - 10, -60], [a0[0] - 10, a0[1]], [xb + 20, 1980], [-60, 1980]], 0.35, 0.1);
      // LF04 v5: the canopy is real world-space blades of the shade tuft leaning over the pocket (v4: a zigzag wash read as a pattern)
      LF04_CANOPY.forEach((b) => paintBlade(q, cc, b, t));
      const a = paintTiny(q, cc, {at: [T_TINY_SHADE[0], 0, T_TINY_SHADE[2]], view: 'front', pose: 'P42', face: 'worried', headCock: -4, t, fig: {wet: true}, tint: {to: '#4f6fb8', u: 0.27, mul: [0.95, 0.93, 0.97]}});
      out.a = a;
      if (a) {
        // LF04 v3: skin stays a healthy cool peach (light filter, not a mix toward grey-blue); the shadow side (screen left, away from
        // the warm clearing) takes a soft blue crescent on the face
        // (inside the skin window under the fringe: cy headTop + 0.66 head, rx 0.39, ry 0.35 head, measured on v2)
        const hh = a.chin - a.headTop, cy = a.headTop + 0.66 * hh, rx = 0.37 * hh, ry = 0.33 * hh;
        const arc = (x0: number, a0: number, a1: number): Pt[] => Array.from({length: 13}, (_, i) => { const th = a0 + ((a1 - a0) * i) / 12; return [x0 + rx * Math.cos(th), cy + ry * Math.sin(th)] as Pt; });
        washAt(q, 9955, '#7088d4', 55, [...arc(a.head[0], 0.58 * Math.PI, 1.3 * Math.PI), ...arc(a.head[0] + 0.12 * hh, 1.3 * Math.PI, 0.58 * Math.PI)], 0.15, 0.05);
        const u = camUnit(cc, [T_TINY_SHADE[0], 0, T_TINY_SHADE[2]]), dr = t * 0.3 * u * 0.4;
        // three puffs seeping from the head and shoulders, drifting left and up; one squeezing out between her arms
        paintPuff(q, a.head[0] - 0.38 * u - dr, a.headTop - 0.22 * u - dr * 0.6, 0.2 * u, 9960, t);
        paintPuff(q, a.lShoulder[0] + 0.12 * u - dr * 0.7, a.lShoulder[1] - 0.2 * u - dr * 0.4, 0.13 * u, 9975, t);
        paintPuff(q, a.rShoulder[0] - 0.5 * u - dr, a.rShoulder[1] - 0.42 * u - dr * 0.5, 0.15 * u, 9990, t, 0.9);
        paintPuff(q, (a.rHand[0] + a.lHand[0]) / 2 + 0.02 * u, (a.rHand[1] + a.lHand[1]) / 2 - 0.02 * u, 0.09 * u, 10005, t);
      }
    },
    fore: [sweep([-2.9, 0, 0.45], [0.8, -1], 12, 46, 9931, 0.8, 18, '#26383c')]});
  MEASURE.LF04 = out.a ?? null;
  void mixColor; void ell;
};
