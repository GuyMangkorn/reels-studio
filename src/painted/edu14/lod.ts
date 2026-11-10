// SET-CITY-TOPDOWN LODs and the drop-eye shot (N6, SP2; B01-SH07, straight down from the falling drop, altitude 1,150 m -> 2.40 m). Three plates cross-faded in the
// canvas (alpha layers, no pop) by altitude `h`:
//   LOD1 city blocks plate (h >= ~150 m): roofs and roads on world y 0, towers lean with the lens; alpha 1 at h >= 500 m -> 0 at h <= 150 m (log blend).
//   LOD2 the metre-scale set from above (`paintCityTopdown`: shelter roof, shophouse roofs, road, school court), the base layer from h <= 500 m.
//   LOD3 the girl (h <= 80 m), drawn between ground and roof: ONE standing body of world-metre volumes projected through the drop camera on every frame,
//   from the round dark crown at altitude to her upturned face at the lip (+95); no card swap, no 2D scaling, no cross-dissolve (user, 10 Nov 2026, third round).
// Plus the "1 กม." ring at altitude 1,000 m (screen ring from the altitude, flicks past at +25).
import {hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {EXPRESSIONS} from '../kit/expressions';
import {paintHeadFront, type FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {qy, wFill, wp} from '../kit/world';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {dropEyeAltitude, sm} from './clock';
import {GIRL, GIRL_AT} from './palette';
import {paintCityTopdown, topdownCam} from './topdown';

export const LOD_BLEND = {lod1: [150, 500] as const, girlBelow: 80};
/** Alpha of LOD1 at altitude h (log blend). */
export const lod1Alpha = (h: number) => sm(0, 1, (Math.log(h) - Math.log(LOD_BLEND.lod1[0])) / (Math.log(LOD_BLEND.lod1[1]) - Math.log(LOD_BLEND.lod1[0])));
export const eyeCam = (L: number): YCam => topdownCam(dropEyeAltitude(Math.min(95, L)));

const ROOFS = ['#a2afb1', '#b3afa4', '#bfb3a0', '#98a4a8', '#a9a699'];
/** LOD1: the city on y 0: a block grid with roads, towers, a park and the river, centred on the bus-stop block (kept clear for LOD2). */
export const paintCityLod1 = (p: Painter, c: YCam) => {
  hardFill(p, 31000, '#4a5155', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]); // roads under everything
  const P = 80, W = 62, blocks: {x: number; z: number; w: number; d: number; h: number; col: string; i: number}[] = [];
  let i = 0;
  for (let ix = -9; ix <= 9; ix++) for (let iz = -14; iz <= 14; iz++, i++) {
    const x = ix * P + (ix > 0 ? 8 : 0), z = iz * P + (iz > 0 ? 8 : 0); // two wider avenues through the centre
    if (Math.abs(ix) <= 0 && Math.abs(iz) <= 0) continue; // the bus-stop block is LOD2's
    const tower = hash(31100 + i) > 0.8 && (Math.abs(ix) + Math.abs(iz) > 2);
    blocks.push({x: x - W / 2, z: z - W / 2, w: W * (0.8 + 0.2 * hash(31200 + i)), d: W * (0.8 + 0.2 * hash(31300 + i)), h: tower ? 45 + hash(31400 + i) * 70 : 11 + hash(31500 + i) * 6, col: ROOFS[i % ROOFS.length], i});
  }
  // river: a pale ribbon across the plan (z 340-390 with a bend), under the buildings it does not touch
  const river = (x0: number, x1: number) => [[x0, 0, 330 + 0.05 * x0], [x1, 0, 330 + 0.05 * x1], [x1, 0, 392 + 0.05 * x1], [x0, 0, 392 + 0.05 * x1 - 6]] as [number, number, number][];
  for (let x = -760; x < 760; x += 120) wFill(p, c, 31600 + x, '#c4cfd1', river(x, x + 124));
  // a park: green courts to the north-east
  wFill(p, c, 31700, '#8aa07f', qy(0, 160, 330, -520, -330));
  wFill(p, c, 31701, '#9cb08f', qy(0, 190, 300, -490, -360));
  // far to near (distance from the camera axis), so a tower's lean covers its neighbours
  blocks.sort((a, b) => Math.hypot(b.x - c.x, b.z - c.z) - Math.hypot(a.x - c.x, a.z - c.z));
  blocks.forEach((b) => {
    wFill(p, c, 32000 + b.i * 4, mixColor(b.col, '#6f7a7e', b.h > 30 ? 0.0 : 0.05), qy(b.h, b.x, b.x + b.w, b.z, b.z + b.d));
    wFill(p, c, 32001 + b.i * 4, mixColor(b.col, '#4a5155', 0.25), qy(b.h, b.x + b.w * 0.1, b.x + b.w * 0.35, b.z + b.d * 0.1, b.z + b.d * 0.9)); // a rooftop plant/water tank strip
    if (b.h > 30) wFill(p, c, 32002 + b.i * 4, '#d6dcdc', qy(b.h + 0.5, b.x + b.w * 0.3, b.x + b.w * 0.7, b.z + b.d * 0.3, b.z + b.d * 0.7));
  });
};

const HAIR = '#1a1716', SKIN = '#efc39a', BLOUSE = '#f4f1ea', NAVY = '#26334d', INK = '#2b211c';
const disc = (c: YCam, v: V3, r: number, sx = 1, sz = 1, n = 22): Pt[] => wp(c, Array.from({length: n}, (_, i): V3 => [v[0] + sx * r * Math.cos((i / n) * 6.283), v[1], v[2] + sz * r * Math.sin((i / n) * 6.283)]));

/** SH07 mark: the girl half a step out from under the lip (z 0.30, the sheet's mark is z 0.02) so the falling drop's line (camera z 0.20) lands on her and the roof,
 * which covers z < 0.10 from straight above, does not hide her head, shoulders and pack. Only this top-down shot uses it (user fix, 10 Nov 2026). */
export const SH07_GIRL_AT: [number, number, number] = [GIRL_AT[0], 0, 0.3];

/** Oblique lean of the body (metres of +z per metre below y 1.0), a world-space model of the accepted plan look: the vertical body is set a little toward
 * the screen bottom, so from high above the skirt, legs and shoe tips peep out below the head and she reads as standing (user, 10 Nov 2026). It is applied
 * to the rig in world metres before the shot's camera projects it, the same on every frame. */
export const PLAN_LEAN = 0.3;
/** Plan-view footprint (metres, relative to the mark, +z = screen down): narrower than it is long, so no frame reads as a figure lying across the screen. */
export const PLAN_EXTENT = {x: [-0.145, 0.135] as const, z: [-0.2, 0.37] as const};

/** Girl rig measures (metres; `girl-school`, 1.24 m, about 4 heads, head 0.30 m so the +95 head is ~250 px at 1.35 m: storyboard SH07). */
export const GIRL_RIG = {head: 0.3, neck: 0.93, shoulder: 0.86, shoulderHalf: 0.14, waist: 0.62, hem: 0.4} as const;
/** Kit head units per metre (`head.ts`: outline v -1.05 .. 1.22 = HEAD_SPAN 2.27 units = the head height). */
const KU = GIRL_RIG.head / 2.27;
/** Head tilt back (rad, face up toward the falling drop): 15 deg (looking ahead, the crown toward the lens) above 12 m (+83), easing to 70 deg (face up into the lens) evenly in log altitude (about even per frame) at
 * the lip (2.40 m). One continuous head turn: the face appears only as it turns toward the camera. */
export const girlHeadTilt = (h: number) => ((15 + 55 * sm(0, 1, Math.log(12 / h) / Math.log(12 / 2.4))) * Math.PI) / 180;

type V = V3;
const add = (a: V, ...bs: [V, number][]): V => bs.reduce<V>((s, [b, k]) => [s[0] + b[0] * k, s[1] + b[1] * k, s[2] + b[2] * k], a);
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unitV = (a: V): V => { const n = Math.hypot(...a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };

/** The head frame at altitude h (world metres): neck pivot, head centre, the kit face origin (v 0, between the eyes) and the axes (X right, U up the face, N out of it). */
export const girlHead = (h: number, at: V3 = SH07_GIRL_AT) => {
  const th = girlHeadTilt(h), [x, , z] = at;
  const X: V = [1, 0, 0], U: V = [0, Math.cos(th), -Math.sin(th)], N: V = [0, Math.sin(th), Math.cos(th)];
  const neck: V = [x, GIRL_RIG.neck, z + PLAN_LEAN * (1 - GIRL_RIG.neck)];
  const centre = add(neck, [U, 0.15]);
  const face = add(centre, [U, 0.085 * KU], [N, 0.07]); // kit v 0 sits 0.085 units above the outline centre; the decal plane 7 cm in front of the centre
  return {th, X, U, N, neck, centre, face, axes: [0.135, 0.15, 0.14] as const};
};
/** How squarely the face looks into the lens (1 = straight at it): N against the line from the face to the camera. */
export const girlFacing = (c: YCam, h: number, at: V3 = SH07_GIRL_AT) => {
  const g = girlHead(h, at);
  return dot(g.N, unitV([c.x - g.face[0], c.y - g.face[1], c.z - g.face[2]]));
};
/** Kit face decal opacity by facing: none while she looks ahead (the crown faces the lens), full once the face looks into it. */
export const girlFaceAlpha = (f: number) => sm(0, 1, (f - 0.45) / 0.4);

/** Convex hull (monotone chain) of picture points. */
const hull = (pts: Pt[]): Pt[] => {
  const q = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (q.length < 3) return q;
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of q.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
/** Unit-sphere sample directions (local s = [sx, su, sn]). */
const SPHERE: V[] = (() => {
  const out: V[] = [];
  for (let i = 0; i <= 10; i++) for (let j = 0; j < 20; j++) {
    const a = (i / 10) * Math.PI, b = (j / 20) * 2 * Math.PI;
    out.push([Math.sin(a) * Math.cos(b), Math.cos(a), Math.sin(a) * Math.sin(b)]);
  }
  return out;
})();
type Frame = {o: V; X: V; U: V; N: V; r: readonly [number, number, number]};
const onEll = (e: Frame, [sx, su, sn]: V): V => add(e.o, [e.X, e.r[0] * sx], [e.U, e.r[1] * su], [e.N, e.r[2] * sn]);
const proj = (c: YCam, pts: V[]): Pt[] => pts.map((v) => camPoint(c, v)).filter((q): q is Pt => !!q);
/** Picture outline of a world ellipsoid: the hull of its projected surface samples (an ellipsoid projects to a convex outline under any pinhole). */
const ellOutline = (c: YCam, e: Frame): Pt[] => hull(proj(c, SPHERE.map((s) => onEll(e, s))));
const AX: V = [1, 0, 0], AY: V = [0, 1, 0], AZ: V = [0, 0, 1];
const ball = (o: V, rx: number, ry = rx, rz = rx): Frame => ({o, X: AX, U: AY, N: AZ, r: [rx, ry, rz]});
/** A capsule a -> b of radius r (hull of the two end balls). */
const capOutline = (c: YCam, a: V, b: V, r: number, rb = r): Pt[] => hull([...proj(c, SPHERE.map((s) => onEll(ball(a, r), s))), ...proj(c, SPHERE.map((s) => onEll(ball(b, rb), s)))]);
/** A frustum between two horizontal elliptical rings (torso, skirt). */
const ringPts = (o: V, rx: number, rz: number, n = 20): V[] => Array.from({length: n}, (_, i): V => [o[0] + rx * Math.cos((i / n) * 6.283), o[1], o[2] + rz * Math.sin((i / n) * 6.283)]);

/** Picture bounds of the girl's head volume (crown to chin) through camera `c` (tests, measures). */
export const girlHeadBounds = (c: YCam, at: V3 = SH07_GIRL_AT) => {
  const g = girlHead(c.y, at), o = ellOutline(c, {o: g.centre, X: g.X, U: g.U, N: g.N, r: g.axes});
  const xs = o.map((q) => q[0]), ys = o.map((q) => q[1]);
  return {x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys)};
};

/** 2x2 SVD: M = R(phi) diag(s1, s2) R(theta), M = [[a, b], [c, d]] acting on column (u, v). */
export const svd2 = (a: number, b: number, c: number, d: number) => {
  const E = (a + d) / 2, F = (a - d) / 2, G = (c + b) / 2, H = (c - b) / 2;
  const Q = Math.hypot(E, H), R = Math.hypot(F, G), a1 = Math.atan2(G, F), a2 = Math.atan2(H, E);
  return {s1: Q + R, s2: Q - R, theta: (a2 - a1) / 2, phi: (a2 + a1) / 2};
};

/** Tired P30 face looking into the lens (EXPRESSIONS.tired without the sweat bead: it is raining). */
const FACE: FaceState = {...EXPRESSIONS.tired, sweat: false, look: [0, 0]};

/** The GIRL as ONE standing body seen through the drop camera on every frame (no card, no 2D scale): each part is a world-metre volume (ellipsoid, capsule,
 * frustum, box) at her 1.24 m proportions, leaned by `PLAN_LEAN`, projected with the shot's own camera and painted far to near (the camera is always above
 * her head top, looking nearly straight down, so the order runs from the ground up: shoes, legs, skirt, pack, torso, head, the visor forearm and hand last).
 * The head tilts back as the drop nears (`girlHeadTilt`); the face is a skin patch of the head volume's visible front, and the kit front face
 * (`paintHeadFront`, girl-school) is laid on that head as a decal through the camera's local affine at the face, so it foreshortens with the facing and
 * fades in only as the face turns into the lens. P30: the left hand is a flat pad on the brow. */
export const paintGirlPlan = (p: Painter, c: YCam, at: V3 = SH07_GIRL_AT) => {
  const [x, , z] = at, h = c.y;
  const fill = (seed: number, col: string, pts: Pt[]) => { if (pts.length >= 3) hardFill(p, seed, col, pts); };
  const ink = (id: number, pts: Pt[], w = 0.9, closed = true) => { if (pts.length >= 2) inkLine(p, id, pts, {color: INK, weight: w, closed, still: true}); };
  /** a body point: below y 1 it shifts +z by the lean */
  const P = (dx: number, y: number, dz: number): V3 => [x + dx, y, z + dz + PLAN_LEAN * Math.max(0, 1 - y)];
  const shadow = disc(c, [x, 0.003, z + 0.1], 0.17, 1, 1.1);
  if (shadow.length >= 3) washAt(p, 34000, '#14191b', 120, shadow, 0.2, 0.2);
  // shoes, socks and legs
  for (const [k, s] of [-1, 1].entries()) {
    fill(34001 + k, SKIN, capOutline(c, P(s * 0.05, 0.42, 0.01), P(s * 0.05, 0.12, 0.02), 0.034, 0.03));
    fill(34003 + k, '#e9e6de', capOutline(c, P(s * 0.05, 0.16, 0.02), P(s * 0.05, 0.06, 0.02), 0.033));
    const shoe = ellOutline(c, ball(P(s * 0.055, 0.035, 0.045), 0.042, 0.03, 0.068));
    fill(34005 + k, '#1d1b1d', shoe);
  }
  // skirt: a navy frustum flaring to the hem
  const skirt = hull(proj(c, [...ringPts(P(0, GIRL_RIG.waist, 0), 0.11, 0.075), ...ringPts(P(0, GIRL_RIG.hem, 0.01), 0.14, 0.1)]));
  fill(34010, NAVY, skirt);
  ink(34011, skirt, 0.6);
  // right arm hanging at her side (sleeve, then skin) and the hand
  fill(34015, SKIN, capOutline(c, P(-0.15, 0.78, 0), P(-0.16, 0.57, 0.01), 0.03, 0.026));
  fill(34014, BLOUSE, capOutline(c, P(-0.145, 0.85, 0), P(-0.15, 0.75, 0), 0.036));
  fill(34016, SKIN, ellOutline(c, ball(P(-0.16, 0.55, 0.012), 0.03)));
  // the backpack on her back (-z): a leaned box (hull of its corners), the top face a shade lighter
  const pk = (dx: number, y: number, dz: number) => P(dx, y, dz);
  const pack = hull(proj(c, [-0.1, 0.1].flatMap((dx) => [0.55, 0.92].flatMap((y) => [-0.21, -0.07].map((dz) => pk(dx, y, dz))))));
  fill(34020, '#b8483c', pack);
  const packTop = proj(c, [pk(-0.1, 0.92, -0.21), pk(0.1, 0.92, -0.21), pk(0.1, 0.92, -0.07), pk(-0.1, 0.92, -0.07)]);
  fill(34021, mixColor('#b8483c', '#fff4dc', 0.1), packTop);
  ink(34022, pack, 0.7);
  // torso (blouse): shoulders to waist, the shoulder line a rounded ring
  const torso = hull(proj(c, [...ringPts(P(0, GIRL_RIG.shoulder, 0), GIRL_RIG.shoulderHalf, 0.075), ...ringPts(P(0, GIRL_RIG.shoulder + 0.03, 0), GIRL_RIG.shoulderHalf - 0.03, 0.06), ...ringPts(P(0, GIRL_RIG.waist + 0.02, 0), 0.11, 0.07)]));
  fill(34012, BLOUSE, torso);
  ink(34013, torso, 0.8);
  for (const [k, dx] of [-0.075, 0.075].entries()) fill(34035 + k, '#8f342c', capOutline(c, P(dx, 0.9, -0.08), P(dx, 0.89, 0.02), 0.016)); // straps over the shoulders
  // P30 visor arm (her left, +x): upper arm from the shoulder out and up to the elbow beside the head (sleeve, then skin)
  const g = girlHead(h, at);
  const brow = add(g.face, [g.X, 0.38 * KU], [g.U, 0.62 * KU], [g.N, 0.045]);
  const sho = P(0.135, 0.85, 0.0), elbow = P(0.25, 0.98, 0.05), wrist = add(brow, [g.X, 0.075], [g.N, 0.01]);
  fill(34040, SKIN, capOutline(c, sho, elbow, 0.03, 0.027));
  fill(34039, BLOUSE, capOutline(c, sho, add(sho, [unitV([elbow[0] - sho[0], elbow[1] - sho[1], elbow[2] - sho[2]]), 0.07]), 0.037));
  // pigtails: short tails out at the sides of the head with red ties
  for (const [k, s] of [-1, 1].entries()) {
    const root = add(g.centre, [g.X, s * 0.13], [g.U, 0.02], [g.N, -0.03]);
    fill(34050 + k * 3, HAIR, capOutline(c, root, add(root, [g.X, s * 0.05], [g.U, -0.06]), 0.033, 0.026));
    fill(34051 + k * 3, '#b8483c', ellOutline(c, ball(root, 0.02)));
  }
  // neck
  fill(34059, SKIN, capOutline(c, P(0, 0.84, 0.0), g.neck, 0.045));
  // the head volume: a dark crown ellipsoid, the visible front of it skin (face patch), a cool sheen on the crown
  const head: Frame = {o: g.centre, X: g.X, U: g.U, N: g.N, r: g.axes};
  const outline = ellOutline(c, head);
  fill(34061, HAIR, outline);
  const eye: V = [c.x, c.y, c.z];
  const seen = (s: V) => { const v = onEll(head, s), n = add([0, 0, 0], [g.X, s[0] / g.axes[0]], [g.U, s[1] / g.axes[1]], [g.N, s[2] / g.axes[2]]); return dot(n, [eye[0] - v[0], eye[1] - v[1], eye[2] - v[2]]) > 0; };
  const faceSet = SPHERE.filter((s) => s[2] > 0.3 && s[1] < 0.42 && s[1] > -0.92 && seen(s));
  if (faceSet.length >= 3) fill(34060, SKIN, hull(proj(c, faceSet.map((s) => onEll(head, s)))));
  // cool sky sheen on the crown (upper back of the skull, toward her right) and a cool rim, so the black hair separates from the dark wet paving under the lip
  const sheenSet = SPHERE.filter((s) => s[1] > 0.45 && s[0] < 0.1 && s[0] > -0.6 && s[2] < 0.25 && s[2] > -0.7 && seen(s));
  if (sheenSet.length >= 3) fill(34064, '#5d6a72', hull(proj(c, sheenSet.map((s) => onEll(head, s)))));
  inkLine(p, 34063, outline, {color: '#8a989f', weight: 2.2, closed: true, still: true});
  ink(34062, outline, 0.9);
  // the kit face decal (girl-school front head) on the face plane, through the camera's affine there, fading in with the facing
  const fa = girlFaceAlpha(girlFacing(c, h, at));
  const pa = camPoint(c, g.face), pu = camPoint(c, add(g.face, [g.X, KU])), pv = camPoint(c, add(g.face, [g.U, -KU]));
  if (fa > 0.002 && pa && pu && pv) {
    const K = Math.hypot(pu[0] - pa[0], pu[1] - pa[1]);
    const {s1, s2, theta, phi} = svd2((pu[0] - pa[0]) / K, (pv[0] - pa[0]) / K, (pu[1] - pa[1]) / K, (pv[1] - pa[1]) / K);
    const q = fa < 0.999 ? p.layer(fa, 36000) : p, b = p.brush;
    b.push(); b.translate(pa[0], pa[1]); b.rotate(phi); b.scale(s1, s2); b.rotate(theta);
    paintHeadFront(q, GIRL.seed, 0, 0, K, FACE, GIRL.head, 0.4);
    b.pop();
  }
  // the visor forearm up to the brow and the flat hand on it (palm on the brow, fingers across toward her right)
  fill(34041, SKIN, capOutline(c, elbow, wrist, 0.026, 0.022));
  const hand = ellOutline(c, {o: add(brow, [g.X, 0.02]), X: g.X, U: g.U, N: g.N, r: [0.055, 0.036, 0.016]});
  fill(34042, SKIN, hand);
  ink(34043, hand, 0.6);
};

/** The drop-eye shot. The girl is one camera-projected body (`paintGirlPlan`) from 80 m down to the lip, drawn inside the set between the ground and the
 * shelter roof so the roof covers what it covers from the drop's eye. */
export const paintDropEye = (p: Painter, L: number) => {
  const h = dropEyeAltitude(Math.min(95, L)), c = eyeCam(L), a1 = lod1Alpha(h), world = {world: 'noair' as const, t: 0.4};
  // LOD2 is the base from the moment LOD1 starts to thin (and always below it); its far extent is hidden by LOD1 above 500 m
  paintCityTopdown(p, c, {...world, mid: h <= LOD_BLEND.girlBelow ? (q, cc) => paintGirlPlan(q, cc) : undefined});
  if (a1 > 0.002) paintCityLod1(p.layer(a1, 31000), c);
};

/** The "1 กม." ring (altitude 1,000 m, radius 14 m): screen radius, or null once it has passed the lens. */
export const kmRing = (L: number): {r: number} | null => {
  const d = dropEyeAltitude(Math.min(95, L)) - 1000;
  return d > 0.8 ? {r: Math.min(5000, (1100 * 14) / d)} : null;
};
