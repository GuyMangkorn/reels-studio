import {lerp, mixColor, type Painter, type Pt} from '../kit/painter';
import {asmPoseAt, assemblyParts, paintAssembly, type AsmPose} from './assembly';
import {blob, clipHalf, ell, inkLine, projectPoly, rectPts, solid, washAt} from './draw';
import {cardProjector, ease, seg, type Proj, type V3} from './space';

// S01 sets (MK-WF-DEP-06; brief VD08; sheet sc01 SS-R3): the car interior plate of S01-SH01 (fixed-plane layers in
// PLATE px: L1 exterior road view with the far shape, L2 windshield tint, L3 interior, L4 the narrator is a cast
// figure) and the right-hand-drive sedan for S01-SH02 (real scale, WORLD-SHOP projection).

// ------------------------------------------------------------------ S01-SH01: car interior (fixed plane, PLATE px)

export const WINDSHIELD: Pt[] = [[0, 180], [520, 120], [470, 1120], [0, 1160]];
/** Exterior pan +260 px eased f10-f120 and scale 1.00 -> 1.06 about (300, 700): the car's turn and approach. */
export const carPanAt = (f: number) => ({dx: 260 * ease(seg(f, 10, 120)), s: lerp(1, 1.06, seg(f, 0, 125))});
/**
 * The far shape (SS-R3.2 S01-SH01; plate px, after the L1 pan): ground (190, 780) at f0 -> (486, 788) at f108 -> (492, 790)
 * at f125. Distance 16 m -> 11 m linear over f0-f125; k = 1104 / d px per metre (69 px/m at 16 m, 100 px/m at 11 m,
 * ST-09 scale constant), height 1.95 m x k (134 px at f0, 195 px at f125).
 */
export const farShapeAt = (f: number) => {
  const x = f <= 108 ? lerp(190, 486, seg(f, 0, 108)) : lerp(486, 492, seg(f, 108, 125));
  const y = f <= 108 ? lerp(780, 788, seg(f, 0, 108)) : lerp(788, 790, seg(f, 108, 125));
  const d = lerp(16, 11, seg(f, 0, 125));
  const k = 1104 / d;
  return {g: [x, y] as Pt, h: 1.95 * k, k};
};

/** L1: night forecourt seen from the main-road side through the windshield (FS0), the far shape walking on the shoulder. */
export const paintCarExterior = (p: Painter, f: number) => {
  const {brush} = p;
  const pan = carPanAt(f);
  brush.push();
  brush.translate(300, 700);
  brush.scale(pan.s);
  brush.translate(-300 + pan.dx, -700);
  p.group(100);
  p.wash('#3c4447', 250, rectPts(-500, -200, 1200, 1400), 0.3, 0.45);
  p.wash('#5b5f59', 200, rectPts(-500, 300, 1200, 760), 0.5, 0.5); // fog-lit sky over the station
  // Station canopy far ahead: a long lit slab with four warm lamps, pumps under it, the shop glow at its back.
  p.wash('#2d3233', 230, [[-260, 520], [520, 505], [520, 540], [-260, 560]], 0.15, 0.4);
  p.wash('#d6c49a', 150, [[-250, 556], [515, 538], [515, 548], [-250, 568]], 0.15, 0.3);
  [-180, 0, 180, 360].forEach((x, i) => p.wash('#ffd58a', 220, blob(130 + i, x, 548, 22, 8, 0), 0.2, 0.3));
  p.wash('#9fae9f', 120, rectPts(-80, 600, 120, 690), 0.3, 0.4); // shop window glow
  [-150, 40, 230].forEach((x) => p.wash('#cfcab8', 170, rectPts(x - 10, 600, x + 10, 690), 0.15, 0.35)); // pumps
  [-235, 495].forEach((x) => p.wash('#565b56', 220, rectPts(x - 6, 545, x + 6, 700), 0.1, 0.3));
  // Ground: forecourt apron, access lane toward the car, road shoulder in the foreground with a kerb line.
  p.wash('#3e4544', 230, [[-500, 700], [1200, 690], [1200, 1400], [-500, 1400]], 0.3, 0.45);
  p.wash('#4b5150', 200, [[120, 700], [330, 700], [700, 1400], [-300, 1400]], 0.3, 0.45); // lane
  p.wash('#bdb59a', 120, [[230, 705], [236, 705], [300, 1400], [270, 1400]], 0.1, 0.3); // lane centre line
  p.wash('#8d8b80', 160, [[-500, 760], [180, 748], [-60, 1400], [-500, 1400]], 0.3, 0.4); // shoulder
  // Warm canopy halos on the wet ground.
  [-180, 0, 180, 360].forEach((x, i) => p.wash('#a58c62', 90, blob(150 + i, x, 735, 26, 60, 0), 0.4, 0.35));
  // Thin FS0 fog: a veil and a low bank that leave the lane and the canopy readable.
  p.wash('#7c8079', 70, rectPts(-500, 380, 1200, 820), 0.5, 0.5);
  p.wash('#878b83', 60, blob(160, 200 + 12 * (f / 30), 700, 600, 50, f / 30), 0.5, 0.45);
  brush.pop();
};

/** The far shape on the shoulder: the assembly front view on a fixed-plane card, PUSH with lurch sway, FW-A scaled. */
export const paintFarShape = (p: Painter, f: number) => {
  const {g, h, k} = farShapeAt(f);
  // Backlight (sheet S01-SH01 Look): the canopy halo sits behind the upper half, so the shape is a dark silhouette with a
  // bright 24 px ring; the halo is the warm canopy light, not a stroke around the figure.
  // Stacked washes give a falloff: brightest at the silhouette, fading out above the feet. One flat wash of 230 read as an
  // amber disc with a hard edge (r2 defect, Boss r3); the centre sits higher so the halo stays behind the upper half.
  const hx = g[0] + 10, hy = g[1] - 0.6 * h;
  for (let i = 0; i < 10; i++) washAt(p, 1880 + i, '#e6b067', 128 - 11 * i, ell(hx, hy, (0.46 + 0.07 * i) * h, 0.9 * (0.46 + 0.07 * i) * h, 22), 0.9, 0.4);
  const pose: AsmPose = {...asmPoseAt(540 + (f % 60)), S: {xs: 0, zs: 0}, warp: 1, g: f, light: 0, travel: 0};
  // Re-key the PUSH pose to the card origin (the shape walks far from WORLD-SHOP; only its silhouette matters here).
  const base = asmPoseAt(540 + (f % 60));
  const shift = (v: V3): V3 => [v[0] - base.S.xs, v[1], v[2] - base.S.zs];
  pose.helmet = {c: shift(base.helmet.c), a: base.helmet.a};
  pose.rHand = shift(base.rHand);
  pose.lHand = shift(base.lHand);
  pose.umbrella = {...base.umbrella, tip: shift(base.umbrella.tip), handle: base.umbrella.handle ? shift(base.umbrella.handle) : undefined, hand: null};
  const proj: Proj = cardProjector(g, k, 0);
  const parts = assemblyParts(proj, pose, k / 370);
  p.group(1900);
  washAt(p, 1890, '#1f2526', 80, ell(g[0] + 0.1 * k, g[1] + 2, 0.5 * k, 0.07 * k, 14), 0.4, 0.3);
  paintAssembly(p, parts, 0, 21000);
};

/** L2-L3: windshield tint, A-pillar, roof liner, dash, side window, steering wheel (hands are the figure's). */
export const WHEEL = {c: [620, 1500] as Pt, rx: 190, ry: 330};
export const wheelAngle = (f: number) => (-40 * ease(seg(f, 20, 80)) + 40 * ease(seg(f, 80, 120))) * (Math.PI / 180);
/** Rim point at clock position `a` (radians from 12 o'clock, clockwise) after the wheel's turn. */
export const rimAt = (a: number, f: number): Pt => {
  const t = a + wheelAngle(f);
  return [WHEEL.c[0] + WHEEL.rx * Math.sin(t), WHEEL.c[1] - WHEEL.ry * Math.cos(t)];
};

export const paintCarInterior = (p: Painter, f: number, layer: 'back' | 'front') => {
  if (layer === 'back') {
    // Windshield tint (L2) over the exterior, darker at the top edge.
    washAt(p, 3001, '#2a3438', 60, WINDSHIELD, 0.3, 0.4);
    washAt(p, 3002, '#1b2224', 120, [[0, 180], [520, 120], [515, 220], [0, 270]], 0.4, 0.4);
    // Roof liner, B-pillar side window behind her (dark night), door panel.
    solid(p, 3003, '#2b2f31', [[-20, -20], [1100, -20], [1100, 250], [520, 120], [0, 180], [-20, 180]], 6, 0.08);
    solid(p, 3004, '#151a1c', [[540, 140], [1100, 120], [1100, 980], [520, 1000]], 6, 0.06);
    washAt(p, 3005, '#4a5a5e', 70, [[600, 260], [1080, 240], [1080, 700], [620, 760]], 0.5, 0.4); // fog glow in the side glass
    solid(p, 3006, '#2a2e30', [[520, 1000], [1100, 980], [1100, 1950], [480, 1950]], 6, 0.08);
    // A-pillar: 90 px dark band along (520, 120) -> (470, 1120) (SS-R3.2: wide enough for the 11 m shape, x 446-536 at y 700).
    solid(p, 3007, '#1a1e20', [[475, 112], [565, 120], [515, 1122], [425, 1120]], 8, 0.05);
    inkLine(p, 300, [[475, 112], [565, 120], [515, 1122], [425, 1120]], {weight: 0.9});
    return;
  }
  // Dash top y 1140 across the bottom, with the instrument hood; steering column; the wheel rim (L3).
  solid(p, 3010, '#24292b', [[-20, 1160], [470, 1120], [700, 1150], [700, 1950], [-20, 1950]], 8, 0.06);
  solid(p, 3011, '#3a4144', [[-20, 1150], [470, 1112], [480, 1135], [-20, 1175]], 4, 0.06);
  solid(p, 3012, '#1c2022', [[560, 1320], [700, 1300], [760, 1950], [600, 1950]], 6, 0.05);
  const rim = (r: number) => Array.from({length: 40}, (_, i): Pt => {
    const t = (i / 40) * Math.PI * 2;
    return [WHEEL.c[0] + WHEEL.rx * r * Math.sin(t), WHEEL.c[1] - WHEEL.ry * r * Math.cos(t)];
  });
  const outer = rim(1.06), inner = rim(0.92);
  solid(p, 3013, '#191c1e', [...outer, outer[0], ...[...inner].reverse(), inner[inner.length - 1]], 8, 0.04);
  inkLine(p, 301, outer, {weight: 1.0});
  inkLine(p, 302, inner, {weight: 0.9});
  // Spokes and hub turn with the wheel.
  const hub = WHEEL.c;
  for (const a of [Math.PI / 2, -Math.PI / 2, Math.PI]) {
    const q = rimAt(a, f);
    solid(p, 3020 + Math.round(a * 10), '#202426', [[hub[0] - 12, hub[1]], [q[0], q[1] - 10], [q[0], q[1] + 10], [hub[0] + 12, hub[1]]], 6, 0.04);
  }
  solid(p, 3030, '#2b3032', ell(hub[0], hub[1], 60, 95, 18, 0), 6, 0.05);
};

// ------------------------------------------------------------------ S01-SH02: right-hand-drive sedan (WORLD-SHOP m, SS-R3.3)

// Sedan table of sc01 S01-SH02 (SS-R3.3; estimated real proportions of a 4.5 m saloon). The side profile lies on the
// shop-side face z 4.2 in x-at-rest metres; `dx` moves the car while it rolls in (-3.0 -> 0). At rest the body spans
// x -4.15..+0.35 (ST-01). The plate draws the car in two calls around the narrator: `paintSedanBody` (body, wheels,
// glass, and the cabin seen through the open door) and `paintSedanDoor` (the open driver door, in front of her f48-f69).

const SIDE_Z = 4.2;
// Body: the sheet's #6b7276 has luma 0.45 and the overlay stack keeps it at 0.44 at G156, above the sheet's side range
// 0.30-0.42; #5f676b (luma 0.40, same hue) meets the range. Far door inner panel: #353d40 for the same reason (opening 0.15-0.28).
const BODY = '#5f676b', GLASS = '#2c3437', DOOR_EDGE = '#5d6466';
/** Side silhouette, nose to tail (x at rest, y m): bumper, bonnet line, raked screen, roof 1.45, rear glass, boot, rocker. */
const SIDE: Pt[] = [[0.33, 0.25], [0.35, 0.55], [0.35, 0.80], [-0.80, 0.95], [-1.60, 1.45], [-2.80, 1.45], [-3.40, 1.00],
  [-4.05, 1.00], [-4.15, 0.95], [-4.15, 0.35], [-3.95, 0.22], [-3.55, 0.18], [0.10, 0.18], [0.25, 0.20]];
/** Side glass: the front door (rake to the B-pillar at x -1.92) and the rear door (to the rear-glass slope). */
const GLASS_FRONT: Pt[] = [[-0.95, 0.98], [-1.60, 1.40], [-1.92, 1.40], [-1.92, 0.98]];
const GLASS_REAR: Pt[] = [[-1.98, 0.98], [-1.98, 1.40], [-2.62, 1.40], [-2.80, 1.25], [-3.40, 1.00], [-2.75, 0.98]];
/** The driver-door opening in the side panel: sill top 0.40, top along the glass line to the B-pillar. */
const OPENING: Pt[] = [[-0.90, 0.40], [-1.90, 0.40], [-1.92, 1.40], [-1.60, 1.40], [-0.95, 0.98], [-0.90, 0.98]];
/** Lamp reflection streak in the front glass (`#a9b2ad`, opacity 90). */
const STREAK: Pt[] = [[-1.20, 1.00], [-1.25, 1.00], [-1.52, 1.17], [-1.47, 1.17]];
/** Driver door: 1.0 m, hinge at its +x edge (x -0.90), 55 deg (0.96 rad) open at most, free edge at x -1.90 when shut. */
const DOOR_LEN = 1.0, DOOR_OPEN = 0.96;
export const SEDAN_DOOR = {hingeX: -0.90, len: DOOR_LEN, open: DOOR_OPEN};

/** A side-profile point list at depth z, as 3D (x at rest + dx). */
const onSide = (pts: Pt[], dx: number, z = SIDE_Z): V3[] => pts.map(([x, y]): V3 => [x + dx, y, z]);
/** The 2D outline clipped to a horizontal band lo <= y <= hi (Sutherland-Hodgman, one half-plane at a time). */
const bandY = (pts: Pt[], lo: number, hi: number): Pt[] => clipHalf(clipHalf(pts, [0, 1], lo), [0, -1], -hi);

/** The door's hinge at depth z, its free edge at `s` (0..1 of the door length) and height y, for opening angle th. */
export const doorPt = (dx: number, th: number, s: number, y: number, z = SIDE_Z): V3 => [SEDAN_DOOR.hingeX + dx - s * DOOR_LEN * Math.cos(th), y, z - s * DOOR_LEN * Math.sin(th)];

/**
 * The cabin seen through the opening (behind the body plane, z 4.5-5.0): far door panel, seat cushion and seatback,
 * headrest, steering-wheel rim, dash line, the far-door armrest/trim line at 0.70 m (SS-R3.5) and the courtesy (dome) light glaze
 * on the far-door upper third and the seat tops.
 */
const paintCabin = (p: Painter, proj: Proj, dx: number, seed: number, courtesy: number) => {
  const open = projectPoly(proj, onSide(OPENING, dx));
  if (!open.length) return;
  solid(p, seed + 330, '#353d40', open, 6, 0.04, 0.1);
  const box = (y0: number, y1: number, x0: number, x1: number, z: number) => projectPoly(proj, [[dx + x0, y0, z], [dx + x1, y0, z], [dx + x1, y1, z], [dx + x0, y1, z]] as V3[]);
  // Seat: cushion top 0.55 m (lit), seatback to 1.15 m, headrest 1.18-1.32 m (x -1.25..-1.75 at z 4.5).
  const cushion = projectPoly(proj, [[dx - 1.75, 0.55, 4.5], [dx - 1.25, 0.55, 4.5], [dx - 1.25, 0.55, 5.0], [dx - 1.75, 0.55, 5.0]] as V3[]);
  if (cushion.length) solid(p, seed + 331, '#4a5254', cushion, 4, 0.04, 0.08);
  const back = box(0.40, 1.15, -1.75, -1.25, 4.5);
  if (back.length) solid(p, seed + 332, '#343b3e', back, 4, 0.04, 0.08);
  const head = box(1.18, 1.32, -1.75, -1.25, 4.5);
  if (head.length) {
    solid(p, seed + 333, '#2b3133', head, 4, 0.04, 0.08);
    const topEdge = projectPoly(proj, [[dx - 1.75, 1.32, 4.5], [dx - 1.25, 1.32, 4.5]] as V3[]);
    if (topEdge.length > 1) inkLine(p, seed + 334, topEdge, {closed: false, weight: 1.0, color: '#4a5254'});
  }
  // Steering-wheel rim (r 0.19 m about (-1.00, 1.02) at z 4.55), drawn only where it lies inside the opening (x <= -0.93).
  const rim = Array.from({length: 40}, (_, i): V3 => {
    const t = (i / 40) * Math.PI * 2;
    return [dx - 1.0 + 0.19 * Math.cos(t), 1.02 + 0.19 * Math.sin(t), 4.55];
  }).filter((q) => q[0] <= dx - 0.93);
  if (rim.length > 2) {
    const pts = projectPoly(proj, rim);
    if (pts.length > 2) inkLine(p, seed + 335, pts, {closed: false, weight: 2, color: '#15191a'});
  }
  const dash = projectPoly(proj, [[dx - 1.90, 1.0, 4.6], [dx - 0.95, 1.0, 4.6]] as V3[]);
  if (dash.length > 1) inkLine(p, seed + 336, dash, {closed: false, weight: 1.5, color: '#3a4144'});
  // Far-door armrest / trim line at 0.70 m (SS-R3.5), across the inner panel from the B-pillar side to the free edge. A 2-point
  // line: `projectPoly` needs 3 vertices and would drop it, so the points are projected one by one.
  const trim = onSide([[-1.88, 0.70], [-0.93, 0.70]], dx).map((q): Pt => proj.P(q));
  inkLine(p, seed + 337, trim, {closed: false, weight: 1.0, color: '#23292b'});
  // Courtesy light (dome, warm #d8b878 at most 0.30) while the door is open: the far-door upper third (1.07-1.40 m, which holds
  // the headliner band; SS-R3.5 widens the 1.20-1.40 m wash to one band so the glaze never stacks above 0.30) and the seat tops.
  if (courtesy > 0) {
    const upper = projectPoly(proj, onSide(bandY(OPENING, 1.07, 1.4), dx));
    if (upper.length) washAt(p, seed + 340, '#d8b878', 77 * courtesy, upper, 0.2, 0.2);
    if (cushion.length) washAt(p, seed + 341, '#d8b878', 77 * courtesy, cushion, 0.2, 0.2);
  }
};

/**
 * The sedan body: contact shadow, lit top faces (bonnet 0.80-0.95 m, roof sliver), the side panel with the body colour above
 * the 0.62 m crease and darker below, the glass, the wheels in their arches, and either the closed door's seams or, when
 * the door is open, the opening with the cabin in it. `door` 0..1 (0 shut); `courtesy` 0..1 (dome light on).
 */
export const paintSedanBody = (p: Painter, proj: Proj, dx: number, door: number, travel: number, courtesy = 0, seed = 40000) => {
  const z = SIDE_Z;
  let n = 0;
  const face = (q: V3[], color: string, passes = 6, ink = true) => {
    const pts = projectPoly(proj, q);
    if (!pts.length) return;
    solid(p, seed + ++n, color, pts, passes, 0.06, 0.15);
    if (ink) inkLine(p, seed + n, pts, {weight: 0.9});
  };
  // Contact shadow under the car (x -4.35..+0.55).
  const sh = projectPoly(proj, [[dx - 4.35, 0, z - 0.05], [dx + 0.55, 0, z - 0.05], [dx + 0.55, 0, z + 1.8], [dx - 4.35, 0, z + 1.8]]);
  if (sh.length) washAt(p, seed + 302, '#1d2223', 140, sh, 0.4, 0.3);
  // Lit top faces: the body colour mixed 25% toward the cream top colour (bonnet band seen from the 1.5 m eye, roof).
  const lit = mixColor(BODY, '#f3efe2', 0.25);
  face([[dx + 0.35, 0.80, z], [dx - 0.80, 0.95, z], [dx - 0.80, 0.95, z + 1.8], [dx + 0.35, 0.80, z + 1.8]], lit, 6, true);
  face([[dx - 1.60, 1.45, z], [dx - 2.80, 1.45, z], [dx - 2.80, 1.45, z + 1.8], [dx - 1.60, 1.45, z + 1.8]], lit, 6, false);
  // Side panel: body colour, a darker lower body under the crease (0.62 m) and the rocker falling off toward the sill.
  face(onSide(SIDE, dx), BODY, 6, true);
  face(onSide(bandY(SIDE, 0, 0.62), dx), mixColor(BODY, '#4a5154', 0.35), 4, false);
  face(onSide(bandY(SIDE, 0, 0.30), dx), '#4a5154', 4, false);
  const crease = projectPoly(proj, onSide([[-3.40, 0.62], [0.25, 0.62]], dx));
  if (crease.length) inkLine(p, seed + 430, crease, {closed: false, weight: 0.8, color: '#4d5457'});
  const chrome = projectPoly(proj, onSide([[-3.30, 0.91], [0.25, 0.91]], dx));
  if (chrome.length) inkLine(p, seed + 431, chrome, {closed: false, weight: 0.8, color: '#a6acae'});
  // Side glass with one reflection streak.
  face(onSide(GLASS_FRONT, dx, z + 0.01), GLASS, 6, false);
  face(onSide(GLASS_REAR, dx, z + 0.01), GLASS, 6, false);
  const streak = projectPoly(proj, onSide(STREAK, dx, z + 0.012));
  if (streak.length) washAt(p, seed + 310, '#a9b2ad', 90, streak, 0.2, 0.2);
  // Wheels (r 0.32 m, touching the ground) in arches cut into the side panel; front -0.55, rear -3.25 (x at rest).
  for (const wx of [-0.55, -3.25]) {
    const c = proj.P([wx + dx, 0.32, z - 0.02]), k = proj.k([wx + dx, 0, z]);
    const gy = proj.P([wx + dx, 0, z])[1];
    solid(p, seed + ++n, '#0f1314', clipHalf(ell(c[0], c[1], 0.36 * k, 0.36 * k, 20), [0, -1], -gy), 6, 0.04);
    solid(p, seed + ++n, '#16191a', clipHalf(ell(c[0], c[1], 0.32 * k, 0.32 * k, 20), [0, -1], -gy), 8, 0.04);
    solid(p, seed + ++n, '#6b7174', ell(c[0], c[1], 0.15 * k, 0.15 * k, 14), 4, 0.04);
    const a = travel / 0.32;
    inkLine(p, seed + 200 + Math.round(wx * 10), [[c[0] - 0.13 * k * Math.cos(a), c[1] - 0.13 * k * Math.sin(a)], [c[0] + 0.13 * k * Math.cos(a), c[1] + 0.13 * k * Math.sin(a)]], {closed: false, weight: 1.0, color: '#2a2e30'});
  }
  if (door > 0.01) {
    // Open door: the opening (never a flat quad) shows the cabin; the door panel itself is `paintSedanDoor`.
    paintCabin(p, proj, dx, seed, courtesy);
  } else {
    // Shut door: its seams at the hinge and the B-pillar.
    const seamF = projectPoly(proj, onSide([[-0.90, 0.30], [-0.90, 0.98]], dx));
    if (seamF.length) inkLine(p, seed + 420, seamF, {closed: false, weight: 0.8, color: '#23292b'});
    const seamB = projectPoly(proj, onSide([[-1.92, 0.30], [-1.92, 1.40]], dx));
    if (seamB.length) inkLine(p, seed + 421, seamB, {closed: false, weight: 0.8, color: '#23292b'});
  }
  // Lamps: warm headlamp at the nose, red tail.
  const head = proj.P([dx + 0.30, 0.65, z]), tail = proj.P([dx - 4.10, 0.65, z]);
  washAt(p, seed + 300, '#f3e2b2', 200, ell(head[0], head[1], 18, 12, 12), 0.2, 0.3);
  washAt(p, seed + 301, '#a8443a', 200, ell(tail[0], tail[1], 14, 10, 12), 0.2, 0.3);
};

/**
 * The open driver door (1.0 m, 55 deg at most): body-colour panel, window frame and dark glass with one reflection,
 * a 0.07 m edge strip along the free edge and the handle tick 0.15 m from it. Drawn only while open (door > 0).
 */
export const paintSedanDoor = (p: Painter, proj: Proj, dx: number, door: number, seed = 40000) => {
  if (door <= 0.01) return;
  const th = door * DOOR_OPEN;
  let n = 0;
  const quad = (s0: number, s1: number, y0: number, y1: number): V3[] => [doorPt(dx, th, s0, y0), doorPt(dx, th, s1, y0), doorPt(dx, th, s1, y1), doorPt(dx, th, s0, y1)];
  const face = (q: V3[], color: string, passes = 6, ink = true) => {
    const pts = projectPoly(proj, q);
    if (!pts.length) return;
    solid(p, seed + 500 + ++n, color, pts, passes, 0.06, 0.15);
    if (ink) inkLine(p, seed + 500 + n, pts, {weight: 0.9});
  };
  face(quad(0, 1, 0.30, 0.95), BODY, 6, true);
  face(quad(0, 1, 0.95, 1.38), '#23292b', 6, true);
  face(quad(0.04, 0.96, 0.99, 1.34), GLASS, 6, false);
  const streak = projectPoly(proj, [doorPt(dx, th, 0.2, 1.22), doorPt(dx, th, 0.26, 1.22), doorPt(dx, th, 0.5, 1.30), doorPt(dx, th, 0.44, 1.30)]);
  if (streak.length) washAt(p, seed + 510, '#a9b2ad', 90, streak, 0.2, 0.2);
  face(quad(0.93, 1, 0.30, 1.38), DOOR_EDGE, 6, true);
  const handle = projectPoly(proj, [doorPt(dx, th, 0.80, 0.85), doorPt(dx, th, 0.84, 0.85), doorPt(dx, th, 0.84, 0.87), doorPt(dx, th, 0.80, 0.87)]);
  if (handle.length) solid(p, seed + 520, '#23292b', handle, 2, 0.02, 0.05);
};

export {rectPts};
