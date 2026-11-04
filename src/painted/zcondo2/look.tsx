import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {clipHalf, ell, finite, formDir, hardFill, planeBand, solid, washAt} from '../kit/draw';
import {makePainter, mixColor, type Painter, type Pt} from '../kit/painter';
import {Grain} from '../kit/screen';
import {BAG, CAB, H, HEAD, HEAD_PIVOT, HEAD_ROLL, HEAD_SHIFT, headToFrame, KEY, MAN, SET, SUN, W} from './freeze';

// ZCONDO2-SHORT-TH W3.1 look thumbnails of ZC2-B02-SH05 (brief VB-ZC2-SHORT-R1.1): one drawing (freeze.ts), three media.
//   LK-A gouache film still: opaque fills, two-value form, warm sun panes against cool shadow, almost no line.
//   LK-B ink and wash, one accent: sepia-grey washes on warm paper, brown-black contour, pen hatching in the shadows.
//   LK-C coloured pencil on grey paper: hatched local colour, light added with white pencil, graphite contour.
// Thumbnails are full size but not finished grade: no camera drift, no caption, no grade beyond paper grain.

export type Line = {w?: number; color?: string; closed?: boolean; curve?: number};
/** One medium: how a part's base, shadow, lit plane, deep accent and contour are put down. */
export type Medium = {
  paper: string;
  base: (seed: number, color: string, pts: Pt[]) => void;
  shade: (seed: number, color: string, pts: Pt[]) => void;
  light: (seed: number, color: string, pts: Pt[]) => void;
  line: (id: number, pts: Pt[], o?: Line) => void;
  /** Large flat set areas (wall, floor, door): never a textured fill (DF-20261030-p5brush-large-fill-mottle). */
  flat: (seed: number, color: string, pts: Pt[]) => void;
  /** Sun patch on the set (a flat by default; LK-C keeps it a soft flat tone, no hatching, so it never reads as rain). */
  sun?: (seed: number, color: string, pts: Pt[]) => void;
  /** Shade for the head group (no hatch); defaults to shade. */
  shadeFace?: (seed: number, color: string, pts: Pt[]) => void;
  /** Hue a figure's form shadow is mixed toward (default cool blue-grey; the mixed look uses the set's sepia shadow). */
  shadowTint?: string;
};
export type Palette = Record<
  'wall' | 'wallSun' | 'door' | 'doorSun' | 'jamb' | 'cab' | 'cabSun' | 'bay' | 'floor' | 'grout' | 'bag' | 'bagHi' |
  'skin' | 'skinShade' | 'skinLight' | 'hair' | 'shirt' | 'pants' | 'slipper' | 'eyeWhite' | 'iris' | 'ink' | 'metal' | 'shoe' | 'box',
  string
>;

/** Clip a polygon to a convex polygon (Sutherland-Hodgman, inward normals from the clip centroid). */
export const clipConvex = (pts: Pt[], clip: Pt[]): Pt[] => {
  const cx = clip.reduce((a, q) => a + q[0], 0) / clip.length, cy = clip.reduce((a, q) => a + q[1], 0) / clip.length;
  let out = pts;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length];
    let n: Pt = [-(b[1] - a[1]), b[0] - a[0]];
    if ((cx - a[0]) * n[0] + (cy - a[1]) * n[1] < 0) n = [-n[0], -n[1]];
    out = clipHalf(out, n, a[0] * n[0] + a[1] * n[1]);
  }
  return out;
};
/** Polygon area (px^2), to keep texture strokes off small parts. */
export const area = (pts: Pt[]) => Math.abs(pts.reduce((a, q, i) => {
  const r = pts[(i + 1) % pts.length];
  return a + q[0] * r[1] - r[0] * q[1];
}, 0)) / 2;
/** Form shadow / lit plane along the sun, across the long axis for limbs (formDir), so a limb shades like a cylinder. */
const shadeBand = (pts: Pt[], from = 0.58) => planeBand(pts, formDir(pts, KEY), from);
const litBand = (pts: Pt[], to = 0.24) => planeBand(pts, formDir(pts, KEY), 0, to);

/**
 * Arm and hand as ONE outline (viewer round 2: "wrist seam"): the forearm's points past the wrist line x < cut are replaced
 * by the hand's open edge, so one base, one form band set and one contour cover arm and hand.
 */
const mergeHand = (arm: Pt[], hand: Pt[], cut: number): Pt[] => {
  const n = arm.length;
  const inside = arm.map(([x]) => x < cut);
  const start = inside.findIndex((v, i) => v && !inside[(i - 1 + n) % n]);
  if (start < 0) return arm;
  let end = start;
  while (inside[(end + 1) % n]) end = (end + 1) % n;
  const before = arm[(start - 1 + n) % n];
  const d0 = Math.hypot(hand[0][0] - before[0], hand[0][1] - before[1]);
  const d1 = Math.hypot(hand[hand.length - 1][0] - before[0], hand[hand.length - 1][1] - before[1]);
  const h = d0 <= d1 ? hand : hand.slice().reverse();
  const out: Pt[] = [];
  for (let k = (end + 1) % n; k !== start; k = (k + 1) % n) out.push(arm[k]);
  return [...out, ...h];
};
/** Hatch a polygon with any brush (held still). */
export const hatchWith = (p: Painter, seed: number, pts: Pt[], name: string, color: string, weight: number, dist: number, angle: number, rand = 0.2) => {
  if (!finite(pts)) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.noFill();
  brush.hatch(dist, angle, {rand, continuous: false, gradient: 0.1});
  brush.hatchStyle(name, color, weight);
  brush.polygon(pts);
  brush.noHatch();
};
export const strokeWith = (p: Painter, id: number, pts: Pt[], name: string, color: string, weight: number, closed = false, curve = 0.4) => {
  if (pts.length < 2) return;
  p.inkStill(id, name, color, weight);
  p.brush.spline(closed ? [...pts, pts[0]] : pts, curve);
};

// ------------------------------------------------------------------ the drawing (shared by all three media)

const drawSet = (p: Painter, M: Medium, C: Palette, sunOn: boolean) => {
  M.flat(10, C.wall, SET.wall);
  M.flat(11, C.floor, SET.floor);
  // Floor tiles: grout lines to the vanishing point, tile rows at 0.6 m.
  const [vx, vy] = SET.vp;
  for (let k = -3; k <= 3; k++) {
    const x0 = vx + k * 606, y0 = 1658;
    const u = (1960 - vy) / (y0 - vy);
    M.line(20 + k + 3, [[x0, y0], [vx + (x0 - vx) * u, 1960]], {w: 0.6, color: C.grout, curve: 0});
  }
  M.line(30, [[-40, 1740], [1120, 1740]], {w: 0.6, color: C.grout, curve: 0});
  M.flat(12, C.jamb, SET.skirting);
  // Door and jambs (solid door, lever, deadbolt thumb-turn, no peephole: CL05).
  M.flat(13, C.door, SET.door);
  M.flat(14, C.jamb, SET.jambL);
  M.flat(15, C.jamb, SET.jambR);
  M.flat(18, mixColor(C.wall, '#ffffff', 0.25), SET.switchPlate);
  const panes = sunOn ? [SUN.paneA, SUN.paneB] : [];
  panes.forEach((pane, i) => {
    const sun = M.sun ?? M.flat;
    sun(40 + i, C.wallSun, clipConvex([[-40, -40], [58, -40], [58, 1670], [-40, 1670]], pane));
    sun(42 + i, C.doorSun, clipConvex(SET.door, pane));
    sun(44 + i, mixColor(C.jamb, C.wallSun, 0.6), clipConvex(SET.jambL, pane));
    sun(46 + i, mixColor(C.jamb, C.wallSun, 0.6), clipConvex(SET.jambR, pane));
  });
  M.line(50, SET.door, {w: 0.7, closed: true, curve: 0, color: mixColor(C.door, C.ink, 0.45)});
  // Routed panel and stile groove (round 10, viewer: "the heavy black panel rectangle carries all the black weight"): a
  // thin warm groove line with a lit lip on the sun side; no dark band.
  const [[px0, py0], , [px1, py1]] = SET.doorPanel;
  const groove = mixColor(C.door, C.ink, 0.22);
  [[[px0, py0], [px1, py0], [px1, py0 + 5], [px0, py0 + 5]], [[px0, py0], [px0 + 5, py0], [px0 + 5, py1], [px0, py1]]].forEach((g, i) => M.flat(114 + i, groove, g as Pt[]));
  M.line(51, SET.doorPanel, {w: 0.55, closed: true, curve: 0, color: mixColor(C.door, C.ink, 0.3)});
  M.line(49, [[200, 474], [960, 474], [960, 44]], {w: 0.9, curve: 0, color: mixColor(C.doorSun, '#ffffff', 0.3)});
  M.line(48, [[1004, 540], [1004, 1560]], {w: 0.6, curve: 0, color: mixColor(C.door, C.ink, 0.35)});
  // Lever and deadbolt: the lever tip runs behind the cabinet's right edge (drawn before the cabinet so it is cut).
  M.base(52, C.metal, ell(SET.rose[0], SET.rose[1], 25, 25, 14));
  M.base(53, C.metal, SET.lever);
  M.shade(54, mixColor(C.metal, C.ink, 0.5), [[972, 656], [890, 656], [894, 664], [972, 664]]);
  M.base(55, C.metal, ell(SET.boltRose[0], SET.boltRose[1], 30, 30, 16));
  M.base(56, mixColor(C.metal, C.ink, 0.35), SET.boltTurn);
  M.light(57, mixColor(C.metal, '#ffffff', 0.5), ell(SET.boltRose[0] - 10, SET.boltRose[1] - 12, 8, 6, 8));
  M.line(58, SET.lever, {w: 0.8, closed: true, color: C.ink});
  M.line(59, ell(SET.boltRose[0], SET.boltRose[1], 30, 30, 16), {w: 0.8, closed: true, color: C.ink});
  M.light(46, mixColor(C.metal, '#ffffff', 0.55), [[972, 640], [920, 638], [920, 645], [972, 646]]);
  M.line(47, ell(SET.rose[0], SET.rose[1], 25, 25, 14), {w: 0.8, closed: true, color: C.ink});
  // Cast shadow of the cabinet's right end on the door: it is jammed against the door, not beside it.
  M.flat(62, mixColor(C.door, C.ink, 0.45), CAB.edgeShadow);
  // The cabinet, turned 26 deg (round 10): front face, the lit left side panel swung toward camera, the floor gap behind it.
  M.flat(88, mixColor(C.floor, C.ink, 0.55), CAB.sideShadow);
  M.flat(61, mixColor(C.cab, C.cabSun, 0.55), CAB.side);
  M.flat(60, C.cab, CAB.body);
  panes.forEach((pane, i) => (M.sun ?? M.flat)(72 + i, C.cabSun, clipConvex(CAB.body, pane)));
  CAB.bays.forEach((b, i) => {
    M.flat(64 + i, C.bay, b);
    // Seen through the opening: the shelf top (below eye level) and the inner face of the right side panel.
    M.flat(140 + i, mixColor(C.bay, C.cab, 0.34), clipConvex(CAB.shelfTops[i], b));
    M.flat(143 + i, mixColor(C.bay, C.cab, 0.5), clipConvex(CAB.bayWalls[i], b));
    panes.forEach((pane, j) => (M.sun ?? M.flat)(100 + i * 2 + j, mixColor(C.bay, C.cabSun, 0.3), clipConvex(b, pane)));
  });
  M.flat(70, mixColor(C.cab, '#ffffff', 0.12), CAB.top);
  CAB.shelves.forEach((l, i) => M.line(110 + i, l, {w: 0.6, curve: 0, color: mixColor(C.cab, '#ffffff', 0.45)}));
  M.base(76, C.shoe, CAB.sneaker);
  M.base(77, mixColor(C.shoe, '#ffffff', 0.55), CAB.sneakerSole);
  M.line(78, CAB.sneaker, {w: 0.8, closed: true, color: C.ink});
  M.flat(79, C.box, CAB.box);
  M.flat(80, mixColor(C.box, '#ffffff', 0.15), CAB.boxLid);
  M.flat(81, mixColor(C.box, C.ink, 0.35), planeBand(CAB.box, [1, 0], 0.64));
  M.line(82, CAB.box, {w: 0.7, closed: true, color: C.ink, curve: 0});
  M.base(83, mixColor(C.metal, C.ink, 0.2), CAB.bowl);
  M.line(84, CAB.body, {w: 1.0, closed: true, curve: 0, color: mixColor(C.cab, C.ink, 0.65)});
  M.line(87, CAB.side, {w: 0.9, closed: true, curve: 0, color: mixColor(C.cab, C.ink, 0.6)});
  CAB.bays.forEach((b, i) => M.line(85 + i, b, {w: 0.6, closed: true, curve: 0, color: mixColor(C.cab, C.ink, 0.5)}));
  M.flat(89, mixColor(C.floor, C.ink, 0.5), CAB.baseShadow);
  // Drag evidence: rubber scuff streaks from where it stood (frame right, past the bag) and a sneaker knocked to the floor.
  CAB.scuffs.forEach((sc, i) => {
    M.line(130 + i, sc, {w: 1.6, color: mixColor(C.floor, C.ink, 0.62)});
    M.line(150 + i, sc.map(([x, y]): Pt => [x + 4, y + 7]), {w: 0.7, color: mixColor(C.floor, '#ffffff', 0.45)});
  });
  M.flat(137, mixColor(C.floor, C.ink, 0.5), CAB.fallen.map(([x, y]): Pt => [x + 14, y + 12]));
  M.base(134, C.shoe, CAB.fallen);
  M.base(135, mixColor(C.shoe, '#ffffff', 0.55), CAB.fallenSole);
  M.shade(138, mixColor(C.shoe, C.ink, 0.3), planeBand(CAB.fallen, formDir(CAB.fallen, KEY), 0.6));
  M.line(136, CAB.fallen, {w: 0.8, closed: true, color: C.ink});
  M.base(139, mixColor(C.bay, C.ink, 0.2), CAB.fallenCollar);
  CAB.fallenLace.forEach((l, i) => M.line(146 + i, l, {w: 0.7, color: C.ink}));
  M.line(149, CAB.fallenToe, {w: 0.6, color: mixColor(C.shoe, C.ink, 0.6)});
  M.line(153, [CAB.fallenSole[0], CAB.fallenSole[1]], {w: 0.6, curve: 0, color: mixColor(C.shoe, C.ink, 0.6)});
  // His cast shadow (head and shoulder) on the sunlit cabinet front: the unlit colour back inside the sun.
  // Offset copies of his head, hair and shirt along the sun (estimate: 0.05 m stand-off), so it hugs his silhouette.
  // Each surface gets its own unlit colour back (laminate on the frame, dark interior in the bays), never one grey ghost.
  const castOf = (pts: Pt[]) => pts.map(([x, y]): Pt => [x + 44, y + 20]);
  const casts = [castOf(HEAD.hair.map(headToFrame)), castOf(HEAD.head.map(headToFrame)), castOf(MAN.shirt)];
  panes.forEach((pane, i) => casts.forEach((poly, k) => {
    const c = clipConvex(clipConvex(poly, pane), CAB.body);
    M.flat(92 + i * 3 + k, mixColor(C.cab, C.ink, 0.12), c);
    CAB.bays.forEach((b, j) => M.flat(120 + i * 12 + k * 4 + j, mixColor(C.bay, C.ink, 0.15), clipConvex(c, b)));
  }));
  // The trash bag dropped at B02-SH01, still by the door, against the cabinet corner.
  M.base(95, C.bag, BAG.body);
  M.base(96, C.bag, BAG.knot);
  M.light(97, C.bagHi, litBand(BAG.body, 0.18));
  M.shade(98, mixColor(C.bag, C.ink, 0.5), shadeBand(BAG.body, 0.62));
  BAG.folds.forEach((f, i) => M.line(99 + i, f, {w: 0.8, color: mixColor(C.bagHi, C.ink, 0.2)}));
  M.line(102, BAG.body, {w: 1.0, closed: true, color: C.ink});
};

/** A body part: base, form shadow on the far side of the sun, lit plane on the near side, contour. */
const part = (M: Medium, seed: number, color: string, pts: Pt[], C: Palette, o: {from?: number; litTo?: number; line?: number; noLit?: boolean; shadePts?: Pt[]} = {}) => {
  M.base(seed, color, pts);
  M.shade(seed + 1, mixColor(color, M.shadowTint ?? '#2a3440', 0.42), o.shadePts ?? shadeBand(pts, o.from ?? 0.58));
  if (!o.noLit) M.light(seed + 2, mixColor(color, '#fff1d8', 0.22), litBand(pts, o.litTo ?? 0.24));
  M.line(seed + 3, pts, {w: o.line ?? 1.1, closed: true, color: mixColor(color, C.ink, 0.75)});
};

/** T-shirt sleeve tube over the upper arm: no closed contour (a closed cap read as a shoulder pad), only hem and outer side. */
const sleeve = (M: Medium, seed: number, C: Palette, pts: Pt[], hem: Pt[], outer: Pt[]) => {
  const shirtLine = mixColor(C.shirt, C.ink, 0.7);
  M.base(seed, C.shirt, pts);
  (M.shadeFace ?? M.shade)(seed + 1, mixColor(C.shirt, M.shadowTint ?? '#2a3440', 0.32), shadeBand(pts, 0.66));
  M.light(seed + 2, mixColor(C.shirt, '#fff1d8', 0.22), litBand(pts, 0.28));
  M.line(seed + 3, hem, {w: 0.9, color: shirtLine});
  M.line(seed + 4, outer, {w: 0.9, color: shirtLine});
};

/** Iris clipped to the eye white, so it can sit under the upper lid (the look up). */
const iris = (M: Medium, seed: number, C: Palette, eye: Pt[], [x, y, r]: [number, number, number]) => {
  M.base(seed, C.iris, clipConvex(ell(x, y, r, r, 14), eye));
  M.base(seed + 1, mixColor(C.iris, '#000000', 0.6), clipConvex(ell(x + 1, y - 1, 5.5, 5.5, 10), eye));
  M.light(seed + 2, '#fbf6ec', ell(x - 4, y + 2, 2.6, 2.6, 8));
};

const HAND_TOP = HEAD.hand.slice(0, 31);
const HAND_TOP_SHADOW: Pt[] = [...HAND_TOP.map(([x, y]): Pt => [x - 2, y - 10]), ...HAND_TOP.slice().reverse().map(([x, y]): Pt => [x, y + 3])];
const HAND_TOP_RIM: Pt[] = [...HAND_TOP.map(([x, y]): Pt => [x, y + 1]), ...HAND_TOP.slice().reverse().map(([x, y]): Pt => [x + 2, y + 11])];

/** Head group in head space (freeze.ts HEAD): placed with HEAD_SHIFT and rolled HEAD_ROLL about HEAD_PIVOT. */
const drawHead = (p: Painter, M0: Medium, C: Palette) => {
  const b = p.brush;
  // Face shading is a clean wash (round 10, viewer: "muddy cheek hatching"): no pen hatch inside the head group.
  const M: Medium = {...M0, shade: M0.shadeFace ?? M0.shade};
  b.push();
  b.translate(HEAD_SHIFT[0], HEAD_SHIFT[1]);
  b.translate(HEAD_PIVOT[0], HEAD_PIVOT[1]);
  b.rotate(HEAD_ROLL);
  b.translate(-HEAD_PIVOT[0], -HEAD_PIVOT[1]);
  const skinLine = mixColor(C.skin, C.ink, 0.72);
  M.base(205, mixColor(C.shirt, C.ink, 0.15), HEAD.collar);
  M.base(206, C.skin, HEAD.neck);
  M.shade(207, mixColor(C.skin, C.skinShade, 0.7), HEAD.neckShade);
  M.line(208, HEAD.neck, {w: 0.9, closed: false, color: skinLine});
  M.base(220, C.skin, HEAD.head);
  M.shade(222, C.skinShade, HEAD.faceShade);
  M.shade(223, mixColor(C.skin, C.skinShade, 0.6), HEAD.socketL);
  M.shade(224, mixColor(C.skin, C.skinShade, 0.75), HEAD.socketR);
  M.shade(225, mixColor(C.skin, C.skinShade, 0.45), HEAD.noseSide);
  M.shade(226, mixColor(C.skin, C.skinShade, 0.8), HEAD.nostril);
  M.base(226, C.skin, HEAD.ear);
  M.shade(227, C.skinShade, [...HEAD.earInner, [390, 720]]);
  M.line(228, HEAD.ear, {w: 1.0, closed: true, color: skinLine});
  M.line(229, HEAD.earInner, {w: 0.8, color: skinLine});
  M.line(230, HEAD.head, {w: 1.2, closed: true, color: skinLine});
  M.base(231, C.hair, HEAD.hair);
  HEAD.strands.forEach((s, i) => M.line(233 + i, s, {w: 1.2, color: C.hair}));
  // Fear: brows up and in, forehead creases, eyes wide with the irises cut up to the lock.
  M.base(240, C.hair, HEAD.browL);
  M.base(241, C.hair, HEAD.browR);
  HEAD.creases.forEach((c, i) => M.line(242 + i, c, {w: 0.6, color: mixColor(C.skin, C.ink, 0.45)}));
  M.base(245, C.eyeWhite, HEAD.eyeL);
  M.base(246, mixColor(C.eyeWhite, C.skinShade, 0.25), HEAD.eyeR);
  iris(M, 247, C, HEAD.eyeL, HEAD.irisL);
  iris(M, 250, C, HEAD.eyeR, HEAD.irisR);
  M.line(253, HEAD.lidL, {w: 1.9, color: C.ink});
  M.line(254, HEAD.lidR, {w: 1.9, color: C.ink});
  M.line(255, HEAD.lowerL, {w: 0.6, color: skinLine});
  M.line(256, HEAD.lowerR, {w: 0.6, color: skinLine});
  M.line(257, HEAD.bagL, {w: 0.5, color: mixColor(C.skin, C.ink, 0.4)});
  M.line(258, HEAD.bagR, {w: 0.5, color: mixColor(C.skin, C.ink, 0.4)});
  M.line(259, HEAD.noseLine, {w: 0.5, color: mixColor(C.skin, C.ink, 0.35)});
  M.line(260, HEAD.noseWing, {w: 0.9, color: skinLine});
  M.line(261, HEAD.jawLine, {w: 1.0, color: skinLine});
  // Where the hand presses the face: a thin darker band on the cheek and nose along the hand's top edge (round 10: the hand
  // and the face were one skin mass), so the lit top of the hand reads against it.
  M.shade(262, mixColor(C.skin, C.skinShade, 0.85), HAND_TOP_SHADOW);
  // Right hand over the mouth: one hand (back, pressed fingers, tips round the far cheek), thumb up the near cheek.
  M.base(340, C.skin, HEAD.thumb);
  M.shade(341, C.skinShade, planeBand(HEAD.thumb, [1, 0.2], 0.55));
  M.line(343, HEAD.thumb, {w: 1.0, closed: true, color: skinLine});
  b.pop();
};

/** His contact shadow on the floor, painted in the SET medium and palette (it belongs to the floor, not to him). */
const drawContact = (S: Medium, CS: Palette) => S.shade(198, mixColor(CS.floor, CS.ink, 0.55), MAN.floorShadow);

const drawMan = (p: Painter, M: Medium, C: Palette) => {
  const skinLine = mixColor(C.skin, C.ink, 0.72);
  const shirtLine = mixColor(C.shirt, C.ink, 0.7);
  const pantsLine = mixColor(C.pants, C.ink, 0.75);
  // The seat/thighs behind the shins, the torso (the floor shadow is drawContact, before this).
  // Seat on the floor: lit pants on the buttock at screen left (a mass of its own, viewer round 2 "no seat").
  part(M, 196, mixColor(C.pants, C.ink, 0.12), MAN.seat, C, {from: 0.7, line: 0.9});
  part(M, 200, C.shirt, MAN.shirt, C, {from: 0.62});
  MAN.shirtFolds.forEach((f, i) => M.line(210 + i, f, {w: 0.8, color: mixColor(C.shirt, C.ink, 0.6)}));
  drawHead(p, M, C);
  // His left thigh (outer side, screen right) from the knee down to the hip: the turned, shadowed plane that breaks the leg.
  M.base(266, mixColor(C.pants, M.shadowTint ?? '#2a3440', 0.32), MAN.thighL);
  M.line(267, MAN.thighL, {w: 1.0, closed: true, color: pantsLine});
  MAN.thighLines.forEach((f, i) => M.line(262 + i, f, {w: 0.8, color: pantsLine}));
  // Legs pulled up: the dark gap between the shins (knees together, feet apart), shins, ankles, slippers.
  M.base(270, mixColor(C.pants, C.ink, 0.65), MAN.gap);
  part(M, 272, C.pants, MAN.legR, C, {shadePts: MAN.shinShadeR, litTo: 0.3});
  part(M, 276, C.pants, MAN.legL, C, {shadePts: MAN.shinShadeL, litTo: 0.26});
  MAN.folds.forEach((f, i) => M.line(280 + i, f, {w: 0.8, color: pantsLine}));
  [MAN.ankleR, MAN.ankleL].forEach((a, i) => {
    M.base(290 + i * 2, mixColor(C.skin, C.skinShade, 0.35), a);
    M.line(291 + i * 2, [a[0], a[3]], {w: 0.8, color: skinLine});
  });
  [[MAN.slipperR, MAN.footR, MAN.strapR, MAN.toesR], [MAN.slipperL, MAN.footL, MAN.strapL, MAN.toesL]].forEach(([s, f, st, toes], i) => {
    M.base(300 + i * 8, C.slipper, s as Pt[]);
    M.line(301 + i * 8, s as Pt[], {w: 0.9, closed: true, color: C.ink});
    part(M, 302 + i * 8, C.skin, f as Pt[], C, {from: 0.64, line: 1.0});
    (toes as Pt[][]).forEach((t, k) => M.line(380 + i * 4 + k, t, {w: 0.8, color: skinLine}));
    [MAN.nailsR, MAN.nailsL][i].forEach((n, k) => M.light(388 + i * 2 + k, mixColor(C.skin, '#fff1d8', 0.45), n));
    M.line(307 + i * 8, st as Pt[], {w: 1.3, color: mixColor(C.slipper, C.ink, 0.2)});
  });
  // Left arm wraps the shins: sleeve, upper arm outside the left knee, forearm across both shins, hand round the right shin.
  const armHandL = mergeHand(MAN.armL, MAN.handLEdge, 466);
  part(M, 330, C.skin, armHandL, C, {from: 0.64});
  sleeve(M, 320, C, MAN.sleeveL, MAN.sleeveLHem, MAN.sleeveLOuter);
  // Hand over the forearm end, open contour (no line across the wrist), so arm and hand are one form; fingers hooked
  // round the shin edge with the pants pinched under them.
  MAN.pinch.forEach((f, i) => M.line(374 + i, f, {w: 0.8, color: pantsLine}));
  M.shade(338, C.skinShade, MAN.handLShade);
  MAN.handLLines.forEach((f, i) => M.line(366 + i, f, {w: 0.7, color: skinLine}));
  MAN.handLKnuckles.forEach((f, i) => M.line(370 + i, f, {w: 0.5, color: mixColor(C.skin, C.ink, 0.5)}));
  M.base(334, C.skin, MAN.thumbL);
  M.line(335, MAN.thumbL, {w: 0.9, closed: true, color: skinLine});
  // Right arm (round 10): upper arm down to the elbow against the right knee, forearm up to the hand over the mouth.
  M.base(394, C.skin, MAN.armR);
  MAN.armRShade.forEach((sh, i) => (M.shadeFace ?? M.shade)(395 + i * 10, C.skinShade, sh));
  M.line(397, MAN.armR, {w: 1.1, closed: true, color: skinLine});
  M.line(399, MAN.elbowR, {w: 0.8, color: skinLine});
  sleeve(M, 390, C, MAN.sleeveR, MAN.sleeveRHem, MAN.sleeveROuter);
  // The hand over the mouth sits on top of the forearm: redraw the head group's hand last.
  drawHand(p, M, C);
};

/** The right hand alone (head space), drawn after the forearm so the wrist joins under it. */
const drawHand = (p: Painter, M0: Medium, C: Palette) => {
  const b = p.brush;
  const M: Medium = {...M0, shade: M0.shadeFace ?? M0.shade};
  const skinLine = mixColor(C.skin, C.ink, 0.72);
  b.push();
  b.translate(HEAD_SHIFT[0], HEAD_SHIFT[1]);
  b.translate(HEAD_PIVOT[0], HEAD_PIVOT[1]);
  b.rotate(HEAD_ROLL);
  b.translate(-HEAD_PIVOT[0], -HEAD_PIVOT[1]);
  M.base(400, C.skin, HEAD.hand);
  M.light(401, mixColor(C.skin, '#fff1d8', 0.25), planeBand(HEAD.hand, [0.6, 0.8], 0, 0.3));
  M.shade(402, C.skinShade, HEAD.handShade);
  // Per-finger form (viewer round 2: "a flat paddle"): lit top plane and dark underside on each finger, PIP wrinkles.
  HEAD.fingerLights.forEach((f, i) => M.light(420 + i, mixColor(C.skin, '#fff1d8', 0.3), f));
  // Lit rim along the hand's top edge, against the shadow band on the face (drawHead).
  M.light(429, mixColor(C.skin, '#fff6e6', 0.5), HAND_TOP_RIM);
  HEAD.fingerShades.forEach((f, i) => M.shade(424 + i, mixColor(C.skin, C.skinShade, 0.7), f));
  M.line(403, HEAD.hand, {w: 1.1, closed: true, color: skinLine});
  HEAD.fingerLines.forEach((f, i) => M.line(404 + i, f, {w: 1.0, color: skinLine}));
  M.line(428, HEAD.cheekPress, {w: 0.8, color: skinLine});
  HEAD.knuckles.forEach((k, i) => M.line(408 + i, k, {w: 0.6, color: mixColor(C.skin, C.ink, 0.5)}));
  HEAD.tendons.forEach((k, i) => M.line(412 + i, k, {w: 0.4, color: mixColor(C.skin, C.ink, 0.35)}));
  b.pop();
};

// ------------------------------------------------------------------ the three media

const LK_A_PAL: Palette = {
  wall: '#a9a296', wallSun: '#e9cf9e', door: '#6b5646', doorSun: '#a7835f', jamb: '#bdb4a4', cab: '#c4bdb0', cabSun: '#efdcb4',
  bay: '#4b443e', floor: '#a8a092', grout: '#8c8478', bag: '#2f3136', bagHi: '#6a6e76',
  skin: '#c99c79', skinShade: '#8a6553', skinLight: '#e6bc92', hair: '#1f1b1a', shirt: '#8394a0', pants: '#5c6069', slipper: '#2f4a66',
  eyeWhite: '#e8e0d3', iris: '#3a2618', ink: '#2a211d', metal: '#9a978f', shoe: '#d8d3c8', box: '#a98d6a',
};
/** LK-A gouache: opaque passes with a little texture; light over dark works because gouache covers. */
const gouache = (p: Painter): Medium => ({
  paper: '#2b2724',
  // Opaque underlayer, then the textured gouache passes (solid() alone lets the set show through, DF-20261031-painted-opaque-cast).
  base: (s, c, pts) => {
    hardFill(p, 1500 + s, c, pts);
    solid(p, 1000 + s, c, pts, 2, 0.08, 0.12);
  },
  shade: (s, c, pts) => solid(p, 1000 + s, c, pts, 3, 0.1, 0.2),
  light: (s, c, pts) => solid(p, 1000 + s, c, pts, 3, 0.1, 0.2),
  line: (id, pts, o = {}) => strokeWith(p, 1000 + id, pts, 'rotring', o.color ?? '#2a211d', (o.w ?? 1) * 0.55, o.closed, o.curve ?? 0.4),
  // Large areas: opaque flat, then sparse dry-brush gouache strokes a shade either side of it, so walls, door and cabinet
  // carry the brush instead of a vector-flat field (viewer check 3 Nov 2026, UT11).
  flat: (s, c, pts) => {
    hardFill(p, 1000 + s, c, pts);
    if (area(pts) < 15000) return;
    const ang = s === 11 || s === 12 ? 2 : 84 + (s % 3) * 4;
    hatchWith(p, 1700 + s, pts, 'marker', mixColor(c, '#fff4e0', 0.08), 2.2, 13, ang, 0.5);
    hatchWith(p, 1800 + s, pts, 'marker', mixColor(c, '#1c1a18', 0.07), 1.8, 19, ang + 3, 0.5);
  },
});

export const LK_B_PAL: Palette = {
  // Round 8: the room is a mid sepia wash so the sun panes read as bare paper and the face is the warm accent (was washed out).
  wall: '#b3a58e', wallSun: '#f1e8d4', door: '#6e5f51', doorSun: '#d2c2a6', jamb: '#c0b39d', cab: '#bfb19b', cabSun: '#efe4cc',
  bay: '#3f3732', floor: '#a99b85', grout: '#7a6e60', bag: '#3a3a3c', bagHi: '#8a8886',
  skin: '#d2a582', skinShade: '#94694f', skinLight: '#ecd2b4', hair: '#1f1a18', shirt: '#9aa0a4', pants: '#5c5853', slipper: '#4a5866',
  eyeWhite: '#f1ead9', iris: '#2a211d', ink: '#241a15', metal: '#b0aaa0', shoe: '#e6dfd0', box: '#b9ab96',
};
/** LK-B ink and wash: sepia washes on paper (subtractive, so shadow = a second wash), pen hatching in the shadows, firm contour. */
export const inkWash = (p: Painter): Medium => ({
  paper: '#efe6d2',
  // Opaque paper-tone underlayer first (DF-20261031-painted-opaque-cast), so the cabinet never shows through the figure.
  base: (s, c, pts) => {
    hardFill(p, 2300 + s, mixColor(c, '#efe6d2', 0.1), pts);
    washAt(p, 2000 + s, c, 220, pts, 0.04, 0.3);
  },
  shade: (s, c, pts) => {
    washAt(p, 2000 + s, c, 190, pts, 0.05, 0.3);
    hatchWith(p, 2500 + s, pts, 'pen', '#3a2c24', 0.45, 8, 50, 0.25);
  },
  light: () => {},
  line: (id, pts, o = {}) => strokeWith(p, 2000 + id, pts, 'pen', '#241a15', (o.w ?? 1) * 1.9, o.closed, o.curve ?? 0.4),
  flat: (s, c, pts) => hardFill(p, 2000 + s, c, pts),
});

const LK_C_PAL: Palette = {
  wall: '#8e8a84', wallSun: '#e8dcc2', door: '#5f5146', doorSun: '#b49a7a', jamb: '#a7a299', cab: '#b8b2a7', cabSun: '#ece2cc',
  bay: '#3c3834', floor: '#9a9388', grout: '#6c665e', bag: '#2c2d31', bagHi: '#77797e',
  skin: '#c49a7c', skinShade: '#8c6a58', skinLight: '#f0d6b8', hair: '#1f1c1b', shirt: '#7f909c', pants: '#5a5d64', slipper: '#34506e',
  eyeWhite: '#ece6da', iris: '#3a2618', ink: '#26211e', metal: '#a4a199', shoe: '#ddd7cc', box: '#a68b6a',
};
/** LK-C coloured pencil on toned paper: a flat tone underlayer, then hatched pencil; light is white pencil on top. */
const pencil = (p: Painter): Medium => ({
  paper: '#8e8a84',
  base: (s, c, pts) => {
    hardFill(p, 3000 + s, mixColor(c, '#8e8a84', 0.35), pts);
    hatchWith(p, 3200 + s, pts, 'cpencil', c, 0.9, 4.5, 35 + (s % 5) * 6, 0.3);
  },
  shade: (s, c, pts) => hatchWith(p, 3400 + s, pts, 'cpencil', c, 0.9, 4, 115, 0.3),
  light: (s, c, pts) => hatchWith(p, 3600 + s, pts, 'cpencil', mixColor(c, '#fbf7ee', 0.55), 0.9, 4, 30, 0.3),
  line: (id, pts, o = {}) => strokeWith(p, 3000 + id, pts, '2B', o.color ?? '#26211e', (o.w ?? 1) * 1.1, o.closed, o.curve ?? 0.4),
  // Large areas: flat tone plus sparse pencil strokes (the medium's grain without a textured fill).
  flat: (s, c, pts) => {
    hardFill(p, 3000 + s, c, pts);
    hatchWith(p, 3900 + s, pts, 'cpencil', mixColor(c, '#26211e', 0.18), 0.7, 10, 72, 0.35);
  },
  // Sun: a soft flat light tone only; the earlier white-pencil hatching inside the panes read as scratches or rain.
  sun: (s, c, pts) => hardFill(p, 3000 + s, c, pts),
});

/**
 * Mixed look LK-M (user, 3 Nov 2026): LK-A gouache for the figures, LK-B ink and wash for the set. The seam is deliberate:
 *  1. one light: the figure's lit plane and form shadow follow the same KEY and sun panes the set's paper-light panes show;
 *  2. one shadow family: the figure's form shadow mixes toward the set's sepia shadow, not LK-A's blue-grey, and his floor
 *     contact shadow and cast shadow on the cabinet are painted by the SET medium (wash + pen hatch), so he sits in the wash;
 *  3. one line: the gouache figure keeps a thin contour in the set's brown-black pen (lighter than the set's line), so the
 *     figure is drawn by the same hand instead of floating as a line-less cut-out on an inked room.
 */
export const LK_M_FIG: Palette = {
  ...LK_A_PAL,
  // Value-keyed to the sepia set: skin is the warm accent and lightest figure value; clothes sit a step under the set mid-tones.
  skin: '#cf9f7a', skinShade: '#8c6450', skinLight: '#ecc39a', shirt: '#8a98a2', pants: '#55585e', slipper: '#34506c',
  ink: '#241a15',
};
const gouacheFig = (p: Painter): Medium => ({
  ...gouache(p),
  line: (id, pts, o = {}) => strokeWith(p, 1000 + id, pts, 'pen', mixColor(o.color ?? '#241a15', '#241a15', 0.5), (o.w ?? 1) * 1.15, o.closed, o.curve ?? 0.4),
  shadowTint: '#3a2c24',
});

/**
 * LK-B soft outline (user, 3 Nov 2026: likes LK-B but wants less black contour on the characters). The figure keeps the
 * LK-B wash and hatching, but its line is warm dark-wash brown instead of black, thinner, broken, and only where the form
 * turns away from the key (outward normal along KEY); lit edges are lost into the set. Features (lids, w >= 1.5) stay whole.
 */
const softLine = (p: Painter) => (id: number, pts: Pt[], o: Line = {}) => {
  if (pts.length < 2) return;
  const color = mixColor(o.color ?? '#5a3e2e', '#7a5640', 0.35);
  const w = (o.w ?? 1) * 1.0;
  if (!o.closed) {
    if ((o.w ?? 1) >= 1.5) return strokeWith(p, 4000 + id, pts, 'pen', mixColor(o.color ?? '#3a2a20', '#3a2a20', 0.4), (o.w ?? 1) * 1.2, false, o.curve ?? 0.4);
    // Interior form lines (folds, creases): broken into two thirds.
    const n = pts.length;
    if (n < 4) return strokeWith(p, 4000 + id, pts, 'pen', color, w, false, o.curve ?? 0.4);
    strokeWith(p, 4000 + id, pts.slice(0, Math.ceil(n * 0.7)), 'pen', color, w, false, o.curve ?? 0.4);
    return;
  }
  // Closed contour: keep runs on the shadow side only (outward normal . KEY > 0.2), with a gap every ~140 px.
  const sgn = pts.reduce((acc, q, i) => {
    const r = pts[(i + 1) % pts.length];
    return acc + q[0] * r[1] - r[0] * q[1];
  }, 0) > 0 ? 1 : -1;
  const runs: Pt[][] = [];
  let cur: Pt[] = [], len = 0;
  for (let i = 0; i < pts.length; i++) {
    const a0 = pts[i], b0 = pts[(i + 1) % pts.length];
    const dx = b0[0] - a0[0], dy = b0[1] - a0[1], l = Math.hypot(dx, dy) || 1;
    // Outward normal for screen coordinates (y down): (dy, -dx) * orientation.
    const nx = (dy / l) * sgn, ny = (-dx / l) * sgn;
    const shadow = nx * KEY[0] + ny * KEY[1] > 0.2;
    len += l;
    const gap = len % 140 > 118;
    if (shadow && !gap) {
      if (!cur.length) cur.push(a0);
      cur.push(b0);
    } else if (cur.length) {
      runs.push(cur);
      cur = [];
    }
  }
  if (cur.length) runs.push(cur);
  runs.filter((r) => r.length >= 2).forEach((r, k) => strokeWith(p, 4000 + id * 7 + k, r, 'pen', color, w, false, o.curve ?? 0.4));
};
export const inkWashSoft = (p: Painter): Medium => ({
  ...inkWash(p),
  line: softLine(p),
  // Round 10: less texture in the figure washes (brown blotches in the skin at full size).
  base: (s, c, pts) => {
    hardFill(p, 2300 + s, mixColor(c, '#efe6d2', 0.1), pts);
    washAt(p, 2000 + s, c, 220, pts, 0.03, 0.14);
  },
  // Lit planes are lifted with a light wash, so lit edges separate (hand from face, shin from shin) without a black line.
  light: (s, c, pts) => washAt(p, 2600 + s, c, 175, pts, 0.03, 0.12),
  // Flat translucent wash, no texture or bleed: textured small shades blotched brown on the face and hand.
  shadeFace: (s, c, pts) => {
    if (!finite(pts)) return;
    p.brush.seed(2700 + s);
    p.brush.noStroke();
    p.brush.noFill();
    p.brush.wash(c, 205 * p.alpha);
    p.brush.polygon(pts);
    p.brush.noWash();
  },
});

const LOOKS = {
  A: {pal: LK_A_PAL, medium: gouache, fig: LK_A_PAL, figMedium: gouache, sun: true},
  B: {pal: LK_B_PAL, medium: inkWash, fig: LK_B_PAL, figMedium: inkWash, sun: true},
  C: {pal: LK_C_PAL, medium: pencil, fig: LK_C_PAL, figMedium: pencil, sun: true},
  M: {pal: LK_B_PAL, medium: inkWash, fig: LK_M_FIG, figMedium: gouacheFig, sun: true},
  S: {pal: LK_B_PAL, medium: inkWash, fig: LK_B_PAL, figMedium: inkWashSoft, sun: true},
} as const;
export type LookId = keyof typeof LOOKS;
const PAPER: Record<LookId, string> = {A: '#2b2724', B: '#efe6d2', C: '#8e8a84', M: '#efe6d2', S: '#efe6d2'};

const paintLook = (id: LookId) => ({brush, frame}: PaintContext) => {
  const L = LOOKS[id];
  const p = makePainter(brush, {t: frame / 30, frame, fade: PAPER[id]});
  const M = L.medium(p);
  drawSet(p, M, L.pal, L.sun);
  drawContact(M, L.pal);
  drawMan(p, L.figMedium(p), L.fig);
  if (id === 'B' || id === 'M' || id === 'S') {
    // Ink-and-wash shadow side of the room: a hatched band down the frame's right and the floor under the cabinet.
    hatchWith(p, 2900, [[0, 1700], [1080, 1680], [1080, 1920], [0, 1920]], 'pen', '#3a2c24', 0.4, 11, 20, 0.3);
  }
};

const Look = ({id}: {id: LookId}) => {
  const paint = useCallback(paintLook(id), [id]);
  const paper = PAPER[id];
  return (
    <AbsoluteFill style={{background: paper, width: W, height: H}}>
      <BrushCanvas paint={paint} paper={paper} />
      <Grain opacity={id === 'A' ? 0.06 : id === 'M' ? 0.08 : 0.1} />
    </AbsoluteFill>
  );
};

export const LKA = () => <Look id="A" />;
export const LKB = () => <Look id="B" />;
export const LKC = () => <Look id="C" />;
export const LKM = () => <Look id="M" />;
export const LKS = () => <Look id="S" />;
