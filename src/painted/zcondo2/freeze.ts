import type {Pt} from '../kit/painter';

// ZCONDO2-SHORT-TH look-candidate shot ZC2-B02-SH05 (brief VB-ZC2-SHORT-R1.1, W3.1 thumbnails): the man sits on the floor
// with his back to the barricade cabinet, knees pulled up, left forearm wrapped round his shins, right hand clamped over his
// mouth, eyes cut UP to the deadbolt and lever behind him. One set of screen-space drawings (1080x1920, top-left px) shared
// by the three looks LK-A/B/C (look.tsx); only medium, line and shading change between looks.
//
// Round 8 (viewer check 3 Nov 2026): the cabinet now covers the door (wider than the opening, over the left jamb, its right
// edge cutting the lever), the deadbolt and the upper door leaf show above it, the sun panes cross door and cabinet; the
// man is seated full figure (shins, feet, slippers) with his eyes on the horizon so the lock is clearly above his gaze.
//
// Staging (estimated, brief scale baseline): crouch eye height 0.85 m, horizon y 800; man plane ~1300 px/m (head 0.25 m =
// 330 px), cabinet front ~1150 px/m, door plane ~1010 px/m. Door 0.90 m (x 122-1028), lever 1.00 m (y 652), deadbolt
// thumb-turn 1.15 m (y 500), no peephole. Cabinet (revised, estimate) 0.77 w x 0.35 d x 1.06 h m, open shelves (CL02),
// pushed flush against the door (x 40-930, y 560-1778). Seat contact y ~1800, feet y ~1900 (the floor is cheated a little
// high so the slippers stay in frame: estimate). Trash bag from B02-SH01 on the floor at the lever side. Key light: morning
// sun from the balcony behind camera-left, travelling to screen right and down.

/** Closed Catmull-Rom outline through control points (n samples per span), so fills and lines share one smooth edge. */
export const smooth = (c: Pt[], n = 6, closed = true): Pt[] => {
  const out: Pt[] = [];
  const m = c.length;
  const at = (i: number) => (closed ? c[(i + m) % m] : c[Math.max(0, Math.min(m - 1, i))]);
  const spans = closed ? m : m - 1;
  for (let i = 0; i < spans; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, cc: number, d: number) =>
        0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  if (!closed) out.push(c[m - 1]);
  return out;
};

export const W = 1080, H = 1920;
/** Direction the key light travels in screen px (sun from behind camera-left). */
export const KEY: Pt = [0.82, 0.38];

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Tapered limb as a closed outline with round ends (a -> b, widths wa, wb). */
export const limbShape = (a: Pt, b: Pt, wa: number, wb: number): Pt[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l, ny = dx / l, ux = dx / l, uy = dy / l;
  const ha = wa / 2, hb = wb / 2;
  return smooth([
    [a[0] + nx * ha, a[1] + ny * ha],
    [lerp(a[0], b[0], 0.5) + nx * (ha + hb) * 0.52, lerp(a[1], b[1], 0.5) + ny * (ha + hb) * 0.52],
    [b[0] + nx * hb, b[1] + ny * hb],
    [b[0] + ux * hb * 0.8, b[1] + uy * hb * 0.8],
    [b[0] - nx * hb, b[1] - ny * hb],
    [lerp(a[0], b[0], 0.5) - nx * (ha + hb) * 0.52, lerp(a[1], b[1], 0.5) - ny * (ha + hb) * 0.52],
    [a[0] - nx * ha, a[1] - ny * ha],
    [a[0] - ux * ha * 0.8, a[1] - uy * ha * 0.8],
  ], 4);
};
/**
 * Bent limb (shoulder a, elbow e, wrist b) as ONE outline: the elbow is a rounded outer corner and an inner crease, so the
 * arm does not read as two puppet tubes joined at a seam.
 */
export const bentLimb = (a: Pt, e: Pt, b: Pt, wa: number, we: number, wb: number): Pt[] => {
  const nrm = (p: Pt, q: Pt): Pt => {
    const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l];
  };
  const n1 = nrm(a, e), n2 = nrm(e, b);
  // Outer side of the bend: the side the two segments turn away from.
  const turn = (e[0] - a[0]) * (b[1] - e[1]) - (e[1] - a[1]) * (b[0] - e[0]);
  const sgn = turn > 0 ? -1 : 1;
  const nm: Pt = [(n1[0] + n2[0]) / 2, (n1[1] + n2[1]) / 2];
  const ml = Math.hypot(nm[0], nm[1]) || 1;
  const no: Pt = [(nm[0] / ml) * sgn, (nm[1] / ml) * sgn];
  const off = (p: Pt, n: Pt, w: number, side: number): Pt => [p[0] + n[0] * w * side, p[1] + n[1] * w * side];
  const m1: Pt = [lerp(a[0], e[0], 0.5), lerp(a[1], e[1], 0.5)], m2: Pt = [lerp(e[0], b[0], 0.5), lerp(e[1], b[1], 0.5)];
  const u2 = [b[0] - e[0], b[1] - e[1]], l2 = Math.hypot(u2[0], u2[1]) || 1;
  const u1 = [e[0] - a[0], e[1] - a[1]], l1 = Math.hypot(u1[0], u1[1]) || 1;
  return smooth([
    off(a, n1, wa / 2, sgn), off(m1, n1, (wa + we) / 4 + 3, sgn), off(e, no, we * 0.56, 1), off(m2, n2, (we + wb) / 4 + 2, sgn),
    off(b, n2, wb / 2, sgn), [b[0] + (u2[0] / l2) * wb * 0.4, b[1] + (u2[1] / l2) * wb * 0.4], off(b, n2, wb / 2, -sgn),
    off(m2, n2, (we + wb) / 4, -sgn), off(e, no, we * 0.3, -1), off(m1, n1, (wa + we) / 4, -sgn), off(a, n1, wa / 2, -sgn),
    [a[0] - (u1[0] / l1) * wa * 0.3, a[1] - (u1[1] / l1) * wa * 0.3],
  ], 4);
};
/** A pulled-up leg seen from the front: knee dome (centre k, radius r), shin tapering to the pants hem at the ankle a. */
const legShape = (k: Pt, r: number, a: Pt, w: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= 6; i++) {
    const t = Math.PI + (i / 6) * Math.PI;
    pts.push([k[0] + r * Math.cos(t), k[1] + r * 0.78 * Math.sin(t)]);
  }
  pts.push([lerp(k[0] + r, a[0] + w, 0.4) + 6, lerp(k[1], a[1], 0.4)]);
  pts.push([a[0] + w, a[1]], [a[0] - w, a[1] + 4]);
  pts.push([lerp(k[0] - r, a[0] - w, 0.4) - 6, lerp(k[1], a[1], 0.4)]);
  return smooth(pts, 5);
};

// ------------------------------------------------------------------ set

export const SET = {
  wall: [[-40, -40], [1120, -40], [1120, 1670], [-40, 1670]] as Pt[],
  floor: [[-40, 1655], [1120, 1655], [1120, 1960], [-40, 1960]] as Pt[],
  /** Skirting board along the wall foot. */
  skirting: [[-40, 1625], [1120, 1625], [1120, 1660], [-40, 1660]] as Pt[],
  jambL: [[58, -40], [122, -40], [122, 1660], [58, 1660]] as Pt[],
  jambR: [[1028, -40], [1092, -40], [1092, 1660], [1028, 1660]] as Pt[],
  door: [[122, -40], [1028, -40], [1028, 1655], [122, 1655]] as Pt[],
  /** Routed panel on the upper door leaf (visible above the cabinet) and the stile strip right of the cabinet. */
  doorPanel: [[196, 40], [956, 40], [956, 470], [196, 470]] as Pt[],
  doorStrip: [[948, 540], [1004, 540], [1004, 1560], [948, 1560]] as Pt[],
  /** Lever rose and lever (1.00 m; the lever tip runs behind the cabinet's right edge) and the deadbolt thumb-turn (1.15 m). */
  rose: [976, 652] as Pt,
  lever: smooth([[972, 640], [890, 636], [882, 650], [894, 664], [972, 664]], 4),
  boltRose: [976, 500] as Pt,
  boltTurn: [[970, 470], [982, 470], [984, 530], [968, 530]] as Pt[],
  /** Floor tile grout lines converge on the vanishing point (540, 800). */
  vp: [540, 800] as Pt,
  /** Light switch on the wall left of the door. */
  switchPlate: [[-10, 380], [40, 380], [40, 466], [-10, 466]] as Pt[],
};

/**
 * Open-shelf shoe cabinet (CL02) dragged across the door. Round 10 (viewer round 9, confirmed by the coordinator: "still
 * square to the camera, no drag trail, no dropped shoe"): the cabinet is now a real box projected from W-UNIT metres
 * (brief spaces: origin floor at the door centre, +x right facing the door, +y up, +z into the room) with the SH05 camera
 * (estimate): eye (-0.036, 0.85, 2.70) looking -z, f = 2727 px, horizon y 800, so the door plane is 1010 px/m. The cabinet
 * (0.77 w x 0.35 d x 1.06 h m) is turned 26 deg about its back-right corner, which is jammed on the door at x 0.15 m (lever
 * side); its left end swings out toward camera beside him (~1330 px/m at the front-left corner). Visible cues: converging
 * shelf lines, the lit left side panel, the inner right walls and shelf tops seen inside the bays, the floor scuffs from where
 * it stood (out of frame right, past the bag) and a sneaker that fell off on the floor.
 */
const CAM_Z = 2.7, CAM_X = -0.036, EYE_H = 0.85, FOC = 1010 * CAM_Z;
/** W-UNIT metres to screen px for ZC2-B02-SH05 (estimate, see above). */
export const p3 = ([x, y, z]: [number, number, number]): Pt => {
  const d = CAM_Z - z;
  return [540 + (FOC * (x - CAM_X)) / d, 800 + (FOC * (EYE_H - y)) / d];
};
const CAB_W = 0.77, CAB_D = 0.35, CAB_H = 1.06, CAB_YAW = (26 * Math.PI) / 180, CAB_BR_X = 0.15;
const cw: [number, number] = [-Math.cos(CAB_YAW), Math.sin(CAB_YAW)]; // along the front, right -> left (x, z)
const cb: [number, number] = [-Math.sin(CAB_YAW), -Math.cos(CAB_YAW)]; // front -> back (x, z)
const FR0: [number, number] = [CAB_BR_X - CAB_D * cb[0], -CAB_D * cb[1]]; // front-right foot (x, z)
/** Cabinet-local point: X m from the front-left edge, h m up, dd m behind the front face. */
export const cab = (X: number, h: number, dd = 0): Pt => {
  const s = CAB_W - X;
  return p3([FR0[0] + s * cw[0] + dd * cb[0], h, FR0[1] + s * cw[1] + dd * cb[1]]);
};
const quadFace = (x0: number, x1: number, h0: number, h1: number, dd = 0): Pt[] => [cab(x0, h1, dd), cab(x1, h1, dd), cab(x1, h0, dd), cab(x0, h0, dd)];
/** Round-9 screen shapes (drawn on the old flat front, x 40-930 at ~1150 px/m) re-placed on the angled face. */
const onFace = (pts: Pt[], dd = 0.04): Pt[] => pts.map(([x, y]) => cab(((x - 40) / 890) * CAB_W, EYE_H - (y - 800) / 1150, dd));
/** Shelf boards (bay bottoms/tops, m): bay 1 [0.667, 0.874], bay 2 [0.346, 0.645], bay 3 [0.022, 0.323]. */
const BAYS: [number, number][] = [[0.667, 0.874], [0.346, 0.645], [0.022, 0.323]];
const IN0 = 0.02, IN1 = CAB_W - 0.02, BACK = 0.33;
export const CAB = {
  body: quadFace(0, CAB_W, 0, CAB_H),
  /** Left side panel: faces left and toward camera, so it catches the sun (lighter than the front). */
  side: [cab(0, CAB_H, 0), cab(0, CAB_H, CAB_D), cab(0, 0, CAB_D), cab(0, 0, 0)],
  /** Top board lip on the front face (above eye level: the top surface itself is not seen). */
  top: quadFace(-0.01, CAB_W + 0.01, CAB_H - 0.02, CAB_H + 0.005),
  /** Open compartments (dark interior) between the shelf boards. */
  bays: BAYS.map(([h0, h1]) => quadFace(IN0, IN1, h0, h1)),
  /** Inside each bay: the inner face of the right side panel (seen because the cabinet is turned) and the shelf top. */
  bayWalls: BAYS.map(([h0, h1]) => [cab(IN1, h1, 0), cab(IN1, h1, BACK), cab(IN1, h0, BACK), cab(IN1, h0, 0)]),
  shelfTops: BAYS.map(([h0]) => [cab(IN0, h0, 0), cab(IN1, h0, 0), cab(IN1, h0, BACK), cab(IN0, h0, BACK)]),
  /** Shelf front edges (thin lighter lines) as point pairs. */
  shelves: [CAB_H - 0.02, 0.667, 0.346, 0.022].map((h) => [cab(0.005, h, 0), cab(CAB_W - 0.005, h, 0)]),
  /** Sneaker on the top shelf, knocked over on its side by the drag; a shoebox slid half out over the middle shelf edge. */
  sneaker: onFace(smooth([[700, 1010], [712, 984], [760, 972], [830, 966], [880, 984], [890, 1010]], 4)),
  sneakerSole: onFace([[700, 1000], [890, 1000], [890, 1012], [700, 1012]]),
  box: onFace([[724, 1250], [884, 1232], [902, 1380], [742, 1398]], -0.02),
  boxLid: onFace([[716, 1236], [890, 1216], [894, 1240], [720, 1260]], -0.02),
  /** A key bowl on the cabinet top (only its side shows above the top edge). */
  bowl: onFace(smooth([[748, 548], [754, 528], [808, 522], [860, 528], [866, 548]], 4), 0.15),
  /** Cast shadow of the cabinet's right end on the door and on the floor strip between its foot and the door. */
  edgeShadow: [cab(CAB_W, CAB_H, 0), [cab(CAB_W, CAB_H, 0)[0] + 30, cab(CAB_W, CAB_H, 0)[1] + 34], [cab(CAB_W, 0, 0)[0] + 30, 1655], cab(CAB_W, 0.2, 0)] as Pt[],
  baseShadow: [cab(-0.02, 0.01, 0), cab(CAB_W, 0.01, 0), [cab(CAB_W, 0, 0)[0] + 46, 1655], [cab(CAB_W, 0, 0)[0] + 70, 1700], [cab(CAB_W, 0, 0)[0] + 30, cab(CAB_W, 0, 0)[1] + 34], [cab(-0.02, 0, 0)[0], cab(-0.02, 0, 0)[1] + 40]] as Pt[],
  /** Floor under and behind the swung-out left end (the gap it left on the wall side), in shadow. */
  sideShadow: [cab(0, 0, 0), cab(0, 0, CAB_D), [cab(0, 0, CAB_D)[0] - 60, cab(0, 0, CAB_D)[1] + 30], [cab(0, 0, 0)[0] - 50, 1960]] as Pt[],
  /**
   * Drag scuffs (dark rubber streaks with a pale scratch beside each) on the floor strip right of him: the cabinet stood
   * against the wall right of the door (out of frame) and was dragged left across the tiles, its feet leaving these arcs.
   */
  scuffs: [
    [[1110, 1828], [1040, 1806], [980, 1792], [936, 1784]],
    [[1110, 1900], [1020, 1868], [950, 1846], [880, 1826], [820, 1812]],
    [[1110, 1932], [1030, 1910], [960, 1890]],
  ] as Pt[][],
  /** One sneaker knocked off the top shelf in the drag, lying on its side on the floor between him and the bag. */
  fallen: smooth([[744, 1890], [748, 1868], [776, 1852], [812, 1846], [852, 1834], [880, 1826], [906, 1830], [920, 1856], [918, 1890]], 4),
  fallenSole: [[738, 1886], [922, 1886], [920, 1906], [744, 1910]] as Pt[],
  /** Collar opening near the heel, lace crossings over the instep, toe-cap seam. */
  fallenCollar: smooth([[858, 1838], [878, 1828], [902, 1830], [896, 1840], [872, 1844]], 3),
  fallenLace: [[[800, 1856], [812, 1846]], [[818, 1852], [830, 1842]], [[836, 1848], [848, 1838]]] as Pt[][],
  fallenToe: [[746, 1880], [758, 1862], [786, 1856]] as Pt[],
};

export const BAG = {
  body: smooth([[910, 1800], [898, 1710], [922, 1622], [976, 1582], [1022, 1570], [1074, 1588], [1116, 1650], [1130, 1730], [1120, 1800]], 5),
  knot: smooth([[996, 1584], [984, 1530], [1008, 1510], [1032, 1526], [1042, 1570]], 4),
  folds: [
    [[944, 1650], [994, 1710], [1010, 1790]],
    [[1064, 1610], [1076, 1700], [1094, 1780]],
  ] as Pt[][],
};

/** Sun through the balcony glass (two panes, one mullion shadow) crossing the door, the cabinet and the lock. */
export const SUN = {
  paneA: [[200, -40], [470, -40], [900, 1260], [630, 1260]] as Pt[],
  paneB: [[540, -40], [860, -40], [1120, 748], [1120, 1180], [956, 1220]] as Pt[],
};

// ------------------------------------------------------------------ the man (lead, seated full figure)

export const SKIN = '#c79a78';
export const SKIN_SHADE = '#8f6650';
export const HAIR = '#1d1a19';
export const SHIRT = '#8b97a0'; // faded dusty blue-grey oversized T-shirt
export const PANTS = '#4c4f55'; // loose charcoal cotton pants
export const SLIPPER = '#33465c';

/**
 * Head group (head, face, neck, collar and the right hand over the mouth) is authored in head space and placed with
 * HEAD_SHIFT plus a small roll HEAD_ROLL about HEAD_PIVOT (head space): chin up, face turned up toward the lock.
 * Eyes land on the horizon (frame y ~800). Everything else in MAN is frame space.
 */
export const HEAD_SHIFT: Pt = [-110, 140];
export const HEAD_PIVOT: Pt = [510, 880];
export const HEAD_ROLL = -0.07;
export const headToFrame = ([x, y]: Pt): Pt => {
  const dx = x - HEAD_PIVOT[0], dy = y - HEAD_PIVOT[1], c = Math.cos(HEAD_ROLL), s = Math.sin(HEAD_ROLL);
  return [HEAD_PIVOT[0] + dx * c - dy * s + HEAD_SHIFT[0], HEAD_PIVOT[1] + dx * s + dy * c + HEAD_SHIFT[1]];
};

export const HEAD = {
  collar: smooth([[422, 896], [470, 924], [560, 928], [620, 898], [608, 916], [560, 944], [470, 940], [430, 914]], 4),
  neck: smooth([[452, 800], [600, 806], [606, 910], [560, 930], [470, 926], [440, 900]], 4),
  /** Neck shadow under the jaw. */
  neckShade: smooth([[452, 846], [604, 850], [606, 906], [560, 922], [470, 918], [446, 894]], 4),
  /** Head: 3/4 front, turned a little to screen right, tilted back against the cabinet. */
  head: smooth([[505, 536], [578, 546], [628, 582], [652, 640], [656, 702], [646, 766], [622, 822], [574, 858], [516, 866], [462, 846], [420, 806], [396, 752], [386, 690], [392, 622], [420, 570], [460, 544]], 6),
  ear: smooth([[394, 672], [372, 664], [360, 690], [364, 728], [378, 752], [398, 748]], 4),
  earInner: [[382, 684], [374, 704], [380, 730]] as Pt[],
  hair: smooth([[384, 668], [370, 612], [380, 560], [410, 524], [446, 500], [480, 480], [512, 490], [540, 470], [566, 486], [600, 482], [618, 506], [648, 526], [664, 566], [672, 618], [664, 656], [650, 628], [640, 600], [618, 588], [600, 598], [584, 584], [560, 594], [536, 584], [514, 598], [494, 590], [470, 604], [448, 602], [424, 622], [408, 650], [402, 676]], 5),
  strands: [
    [[520, 584], [506, 610], [498, 628]],
    [[562, 590], [570, 612]],
    [[470, 592], [452, 620]],
  ] as Pt[][],
  /** Brows: fear (inner ends raised high and pulled together; lifted further for the upward look). */
  browL: smooth([[424, 632], [446, 618], [474, 608], [500, 594], [504, 602], [478, 618], [448, 630], [428, 640]], 3),
  browR: smooth([[554, 592], [584, 600], [612, 610], [634, 624], [632, 632], [608, 622], [580, 612], [556, 602]], 3),
  creases: [
    [[488, 580], [520, 572], [548, 576]],
    [[494, 590], [522, 586]],
  ] as Pt[][],
  /** Eyes: whites wide; irises pushed into the upper-right corner under the upper lid, white showing below (looking up). */
  eyeL: smooth([[434, 674], [450, 654], [478, 646], [502, 652], [513, 668], [494, 686], [462, 689]], 4),
  eyeR: smooth([[554, 668], [570, 650], [594, 644], [618, 650], [629, 666], [608, 682], [576, 685]], 4),
  irisL: [496, 656, 11.5] as [number, number, number],
  irisR: [613, 652, 11] as [number, number, number],
  lidL: [[432, 674], [448, 651], [478, 642], [504, 648], [515, 666]] as Pt[],
  lidR: [[552, 668], [569, 647], [594, 640], [620, 646], [631, 664]] as Pt[],
  lowerL: [[446, 690], [470, 694], [498, 687]] as Pt[],
  lowerR: [[566, 688], [592, 690], [614, 683]] as Pt[],
  bagL: [[448, 702], [474, 708], [498, 702]] as Pt[],
  bagR: [[568, 700], [592, 704], [612, 698]] as Pt[],
  /** Round 9: softer nose (viewer: a hard wedge): a slim shadow down the far side of the bridge and a small nostril shadow. */
  noseSide: smooth([[542, 688], [550, 716], [560, 738], [552, 748], [542, 744], [540, 716]], 4),
  nostril: smooth([[540, 748], [552, 744], [560, 750], [550, 755]], 3),
  noseLine: [[528, 668], [534, 706], [540, 732]] as Pt[],
  noseWing: [[514, 742], [526, 752], [544, 754], [562, 748], [568, 738]] as Pt[],
  faceShade: smooth([[600, 586], [636, 610], [654, 660], [656, 720], [646, 770], [630, 800], [622, 760], [622, 700], [612, 650], [590, 612]], 5),
  socketL: smooth([[440, 648], [470, 636], [504, 642], [510, 666], [500, 652], [470, 648], [446, 658]], 3),
  socketR: smooth([[556, 644], [590, 636], [622, 644], [628, 662], [612, 652], [584, 646], [560, 654]], 3),
  /** Jaw below the hand (visible chin and jaw line). */
  jawLine: [[420, 806], [462, 846], [516, 866], [574, 858], [622, 822]] as Pt[],
  /**
   * Right hand clamped over the mouth, back of the hand to camera: one silhouette (hand back + four fingers pressed
   * together, index under the nose, pinky at the chin, tips curling round the far cheek and shortening toward the pinky),
   * thumb up the near cheek. Finger separations are short tapered lines from the tips, not separate shapes.
   */
  /**
   * Right hand clamped over the mouth, back of the hand to camera (round 9, viewer: "a flat paddle"): one silhouette with
   * knuckle bumps on the top contour (MCP, PIP), four fingers of different length, the tips curling round the far cheek;
   * each finger gets its own form (lit top, dark underside along the next finger), PIP wrinkles, and the cheek bulges
   * past the pressing fingertips.
   */
  hand: smooth([
    [408, 816], [438, 784], [480, 764], [518, 752], [548, 744], [578, 748], [604, 744], [628, 750], [644, 758], [648, 770], [638, 780],
    [622, 783], [640, 790], [645, 802], [634, 811], [614, 813], [626, 822], [624, 832], [610, 837], [594, 838], [600, 847],
    [594, 856], [578, 860], [544, 862], [498, 866], [452, 876], [418, 872],
  ], 3),
  thumb: smooth([[420, 812], [414, 776], [426, 744], [444, 732], [460, 738], [462, 760], [452, 790], [442, 812]], 4),
  /** Form shadow along the lower (pinky) edge and the curled tips (they turn away from the key). */
  handShade: smooth([[470, 858], [540, 850], [590, 842], [610, 837], [624, 832], [626, 822], [614, 813], [634, 811], [645, 802], [640, 790], [622, 783], [638, 780], [648, 770], [628, 774], [612, 806], [590, 830], [544, 850], [498, 862], [452, 876]], 3),
  /** Finger separations, full length from the tips to the knuckle row (thin near the knuckles: see look.tsx). */
  fingerLines: [
    [[622, 783], [592, 784], [556, 782], [524, 778]],
    [[614, 813], [586, 812], [552, 810], [526, 806]],
    [[594, 838], [570, 838], [546, 836], [526, 832]],
  ] as Pt[][],
  /** Dark undersides of the index, middle and ring fingers (a thin shadow strip above each separation). */
  fingerShades: [
    smooth([[620, 783], [590, 784], [554, 782], [526, 778], [556, 776], [592, 776], [622, 774]], 3),
    smooth([[612, 813], [584, 812], [552, 810], [528, 806], [554, 803], [586, 804], [614, 804]], 3),
    smooth([[592, 838], [568, 838], [546, 836], [528, 832], [548, 829], [570, 830], [596, 830]], 3),
  ] as Pt[][],
  /** Lit top plane of each finger. */
  fingerLights: [
    smooth([[560, 752], [604, 750], [630, 756], [604, 760], [560, 760]], 3),
    smooth([[560, 788], [604, 790], [628, 796], [604, 798], [560, 796]], 3),
    smooth([[560, 816], [596, 818], [612, 822], [596, 825], [560, 822]], 3),
    smooth([[556, 842], [584, 843], [592, 848], [580, 850], [556, 849]], 3),
  ] as Pt[][],
  /** PIP wrinkles across each finger. */
  knuckles: [
    [[594, 754], [598, 766], [596, 776]],
    [[592, 788], [596, 798], [594, 808]],
    [[586, 816], [590, 825], [588, 834]],
    [[574, 842], [577, 850], [575, 857]],
    [[506, 762], [520, 756], [534, 758]],
    [[512, 790], [524, 786], [536, 789]],
    [[514, 815], [526, 812], [538, 815]],
  ] as Pt[][],
  tendons: [
    [[430, 838], [470, 812], [500, 790]],
    [[440, 852], [480, 836], [506, 820]],
  ] as Pt[][],
  /** Far cheek bulging past the pressed fingertips. */
  cheekPress: [[650, 744], [658, 770], [654, 800]] as Pt[],
};

/**
 * Round 9 lower body (viewer round 2: "two columns, no thigh/shin break, no seat on the floor"). Knees pulled up but fallen a
 * little to screen right, feet to the left: the shins lean down-left from the knees, his left thigh shows as a darker wedge
 * from the knee down to the hip on the floor (screen right), and the right buttock and shirt hem sit on the tiles at screen
 * left, so knee, shin, thigh and seat read as separate masses.
 */
const KNEE_R: Pt = [430, 1262], KNEE_L: Pt = [628, 1238];
const ANKLE_R: Pt = [300, 1790], ANKLE_L: Pt = [540, 1790];
/** Far-side (screen-right) form shadow strip down a shin. */
const shinShade = (k: Pt, r: number, a: Pt, w: number, t = 34): Pt[] => {
  const top: Pt = [k[0] + r * 0.62, k[1] - r * 0.52], bot: Pt = [a[0] + w, a[1]];
  const mid: Pt = [lerp(top[0], bot[0], 0.45) + 8, lerp(top[1], bot[1], 0.45)];
  return smooth([top, [k[0] + r, k[1] + 10], mid, bot, [bot[0] - t, bot[1]], [mid[0] - t, mid[1]], [k[0] + r - t, k[1] + 16]], 4);
};
/**
 * Foot from the front on a thong slipper, foreshortened: instep under the hem widening to the ball, then a scalloped toe row
 * (big toe on the inner side `dir`, toes shrinking outward). Returns the outline, toe separations and toenails.
 */
const foot = (cx: number, top: number, dir: 1 | -1) => {
  const yb = top + 90;
  const toes = [[-48, 8], [-31, 9.5], [-13, 10.5], [7, 11.5], [34, 16]] as const; // [x offset toward inner, radius]
  const X = (o: number) => cx + o * dir;
  const pts: Pt[] = [[X(-30), top], [X(30), top], [X(52), top + 40], [X(52), yb - 16]];
  for (let i = toes.length - 1; i >= 0; i--) {
    const [o, r] = toes[i];
    // Rounded toe pad with shallow valleys between toes (pointed V's read as teeth).
    pts.push([X(o + r), yb - 4], [X(o + r * 0.7), yb + r * 0.3], [X(o), yb + r * 0.45], [X(o - r * 0.7), yb + r * 0.3], [X(o - r), yb - 4]);
  }
  pts.push([X(-60), yb - 20], [X(-50), top + 40]);
  const outline = smooth(dir === 1 ? pts : pts.slice().reverse(), 3);
  const seps = toes.slice(0, 4).map(([o, r], i): Pt[] => {
    const x = X(o + r * 0.95 + (toes[i + 1][1] - r) * 0.2);
    return [[x, yb - 12], [x, yb - 1]];
  });
  const nails = [ell(X(34), yb - 3, 8, 5, 8), ell(X(7), yb - 2, 5, 3.5, 8)];
  return {outline, seps, nails, sole: smooth([[X(-84), yb - 12], [X(4), yb - 20], [X(86), yb - 14], [X(90), yb + 22], [X(4), yb + 30], [X(-86), yb + 24]], 4),
    strap: [[X(-56), top + 44], [X(20), yb - 12], [X(58), top + 44]] as Pt[]};
};
const ell = (cx: number, cy: number, rx: number, ry: number, n: number): Pt[] =>
  Array.from({length: n}, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)] as Pt);
const FOOT_R = foot(300, 1796, 1), FOOT_L = foot(540, 1796, -1);

/**
 * Sleeve of the oversized T-shirt as a tube over the top of the upper arm (shoulder a -> elbow e, hem at fraction u): the top
 * runs up into the shirt (no round cap: separate caps read as shoulder pads, round 8/9), the hem is a shallow arc across the
 * arm, a little wider than the arm. sleeveHem is the hem line, sleeveSide one open side line (side -1 / 1).
 */
/** Strip along the side of a limb (a -> b, widths wa, wb) that faces away from the key, t px deep. */
const farStrip = (a: Pt, b: Pt, wa: number, wb: number, t: number): Pt[] => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
  let n: Pt = [-dy / l, dx / l];
  if (n[0] * KEY[0] + n[1] * KEY[1] < 0) n = [-n[0], -n[1]];
  const o = (p: Pt, w: number): Pt => [p[0] + n[0] * w, p[1] + n[1] * w];
  return [o(a, wa / 2), o(b, wb / 2), o(b, wb / 2 - t), o(a, wa / 2 - t)];
};
const sleeveFrame = (a: Pt, e: Pt) => {
  const dx = e[0] - a[0], dy = e[1] - a[1], l = Math.hypot(dx, dy) || 1;
  return {u: [dx / l, dy / l] as Pt, n: [-dy / l, dx / l] as Pt, l};
};
const sleeveTube = (a: Pt, e: Pt, u: number, wTop: number, wHem: number): Pt[] => {
  const {u: d, n, l} = sleeveFrame(a, e);
  const at = (t: number, side: number, w: number, push = 0): Pt => [a[0] + d[0] * (t * l + push) + n[0] * side * w / 2, a[1] + d[1] * (t * l + push) + n[1] * side * w / 2];
  return smooth([at(-0.12, -1, wTop * 0.8), at(0, -1, wTop), at(u * 0.55, -1, (wTop + wHem) / 2 + 4), at(u, -1, wHem), at(u, 0, 0, 10), at(u, 1, wHem),
    at(u * 0.55, 1, (wTop + wHem) / 2 + 4), at(0, 1, wTop), at(-0.12, 1, wTop * 0.8), at(-0.2, 0, 0)], 4);
};
const sleeveHem = (a: Pt, e: Pt, u: number, wHem: number): Pt[] => {
  const {u: d, n, l} = sleeveFrame(a, e);
  const at = (side: number, push: number): Pt => [a[0] + d[0] * (u * l + push) + n[0] * side * wHem / 2, a[1] + d[1] * (u * l + push) + n[1] * side * wHem / 2];
  return [at(-1, 0), at(-0.5, 7), at(0, 10), at(0.5, 7), at(1, 0)];
};
const sleeveSide = (a: Pt, e: Pt, u: number, wTop: number, wHem: number, side: number): Pt[] => {
  const {u: d, n, l} = sleeveFrame(a, e);
  const at = (t: number, w: number): Pt => [a[0] + d[0] * t * l + n[0] * side * w / 2, a[1] + d[1] * t * l + n[1] * side * w / 2];
  return [at(0.04, wTop), at(u * 0.55, (wTop + wHem) / 2 + 4), at(u, wHem)];
};

export const MAN = {
  /** Shirt: hunched shoulders, oversized drop shoulder; the hem drapes down his left side to the floor (screen left). */
  shirt: smooth([[328, 1034], [370, 1052], [420, 1056], [468, 1046], [504, 1030], [560, 1046], [620, 1070], [668, 1104], [700, 1170], [706, 1260], [700, 1420], [560, 1500], [320, 1640], [214, 1672], [140, 1656], [112, 1520], [110, 1400], [116, 1250], [126, 1170], [154, 1110], [214, 1066], [272, 1046]], 5),
  shirtFolds: [
    [[200, 1110], [240, 1090], [270, 1082]],
    [[600, 1080], [632, 1100], [656, 1124]],
    [[452, 1090], [470, 1150]],
    [[560, 1100], [586, 1170]],
    [[132, 1600], [176, 1624], [236, 1630]],
  ] as Pt[][],
  /** Hips and buttocks on the floor (pants) behind the shins and under the shirt hem. */
  seat: smooth([[112, 1640], [300, 1610], [700, 1600], [706, 1780], [650, 1816], [300, 1820], [140, 1816], [106, 1770]], 4),
  /** His left thigh, outer side (screen right): from the knee down to the hip on the floor, in shadow. */
  thighL: smooth([[612, 1166], [684, 1178], [728, 1232], [732, 1310], [720, 1440], [706, 1580], [700, 1700], [694, 1780], [660, 1812], [560, 1814], [530, 1500], [560, 1250]], 4),
  /** Crease where the thigh turns into the knee, and the buttock contour on the floor. */
  thighLines: [
    [[728, 1290], [712, 1330], [700, 1372]],
    [[700, 1700], [684, 1760], [650, 1800]],
    [[150, 1690], [130, 1740], [140, 1800]],
  ] as Pt[][],
  /** Dark wedge between the shins (knees together, feet apart). */
  gap: [[524, 1290], [532, 1290], [488, 1800], [356, 1800]] as Pt[],
  /** His shadow on the floor (seat and feet). */
  floorShadow: smooth([[100, 1810], [400, 1800], [730, 1810], [760, 1860], [690, 1918], [150, 1918], [90, 1866]], 4),
  legR: legShape(KNEE_R, 88, ANKLE_R, 56),
  legL: legShape(KNEE_L, 92, ANKLE_L, 56),
  shinShadeR: shinShade(KNEE_R, 88, ANKLE_R, 56),
  shinShadeL: shinShade(KNEE_L, 92, ANKLE_L, 56),
  /** Fabric folds: knee break arcs under each knee, shin drape, the hem bunching on the instep. */
  folds: [
    [[372, 1318], [404, 1334], [438, 1330]],
    [[384, 1350], [420, 1360]],
    [[330, 1560], [320, 1650], [306, 1730]],
    [[268, 1752], [292, 1766], [320, 1760]],
    [[570, 1300], [606, 1316], [646, 1310]],
    [[578, 1336], [618, 1344]],
    [[586, 1580], [570, 1660], [556, 1730]],
    [[508, 1754], [534, 1768], [562, 1760]],
  ] as Pt[][],
  /** Bare ankles under the hems. */
  ankleR: [[252, 1784], [348, 1784], [346, 1806], [254, 1806]] as Pt[],
  ankleL: [[492, 1784], [588, 1784], [586, 1806], [494, 1806]] as Pt[],
  footR: FOOT_R.outline,
  footL: FOOT_L.outline,
  toesR: FOOT_R.seps,
  toesL: FOOT_L.seps,
  nailsR: FOOT_R.nails,
  nailsL: FOOT_L.nails,
  slipperR: FOOT_R.sole,
  slipperL: FOOT_L.sole,
  strapR: FOOT_R.strap,
  strapL: FOOT_L.strap,
  /**
   * Right arm (round 10, viewer: "needs a visible upper arm and elbow"; UT06): the upper arm hangs down and forward from the
   * shoulder to the elbow, which rests against the outer side of the right knee; the forearm rises from there to the hand on
   * the mouth (a narrow V). The sleeve covers only the top of the upper arm, as a tube with a hem, part of the shirt.
   */
  sleeveR: sleeveTube([196, 1092], [296, 1318], 0.46, 118, 104),
  sleeveRHem: sleeveHem([196, 1092], [296, 1318], 0.46, 104),
  sleeveROuter: sleeveSide([196, 1092], [296, 1318], 0.46, 118, 104, -1),
  armR: bentLimb([196, 1092], [296, 1318], [312, 1000], 90, 80, 64),
  /** Form shadow strips on the far side (from the key) of the forearm and the upper arm (one band over the V misread). */
  armRShade: [farStrip([300, 1300], [314, 1010], 80, 64, 24), farStrip([210, 1110], [292, 1300], 88, 80, 22)],
  /** Elbow point: a small crease and the lit bump where the bone shows. */
  elbowR: [[262, 1336], [284, 1350], [306, 1346]] as Pt[],
  /** Left arm: sleeve, upper arm down outside the left knee, forearm across the front of both shins. */
  sleeveL: sleeveTube([668, 1150], [756, 1402], 0.4, 112, 100),
  sleeveLHem: sleeveHem([668, 1150], [756, 1402], 0.4, 100),
  sleeveLOuter: sleeveSide([668, 1150], [756, 1402], 0.4, 112, 100, 1),
  armL: bentLimb([668, 1150], [756, 1402], [446, 1446], 92, 84, 62),
  /**
   * Left hand gripping the right shin (round 9, viewer: "not gripping, wrist seam"): back of the hand on the shin front, the
   * fingers hooked round the shin's outer edge (their bent knuckles stand past the silhouette, the tips are behind it), thumb
   * along the top. The hand overlaps the forearm end and has no contour across the wrist (open outline), so arm and hand are
   * one form.
   */
  handL: smooth([[470, 1414], [420, 1404], [368, 1400], [330, 1404], [306, 1410], [294, 1420], [300, 1428], [290, 1438], [296, 1447], [290, 1457], [298, 1465], [312, 1476], [344, 1482], [404, 1480], [470, 1478]], 3),
  /** Open contour of the hand (skips the wrist side). */
  handLEdge: [[470, 1414], [420, 1404], [368, 1400], [330, 1404], [306, 1410], [294, 1420], [300, 1428], [290, 1438], [296, 1447], [290, 1457], [298, 1465], [312, 1476], [344, 1482], [404, 1480], [470, 1478]] as Pt[],
  thumbL: smooth([[432, 1410], [396, 1396], [356, 1390], [338, 1396], [352, 1406], [396, 1414]], 4),
  /** Shade on the hooked fingers and the lower edge of the hand. */
  handLShade: smooth([[300, 1428], [290, 1438], [296, 1447], [290, 1457], [298, 1465], [312, 1476], [344, 1482], [404, 1480], [470, 1478], [470, 1466], [404, 1468], [344, 1468], [318, 1458], [310, 1436]], 3),
  /** Bent finger knuckles where they turn round the shin edge, and short separations. */
  handLLines: [
    [[300, 1428], [318, 1427]],
    [[296, 1447], [316, 1446]],
    [[298, 1465], [318, 1464]],
  ] as Pt[][],
  handLKnuckles: [
    [[330, 1408], [334, 1420]],
    [[328, 1428], [332, 1442]],
    [[328, 1448], [332, 1462]],
  ] as Pt[][],
  /** Pants fabric pinched by the gripping fingers (folds radiating from the fingertips). */
  pinch: [
    [[294, 1404], [282, 1390]],
    [[292, 1478], [280, 1496]],
  ] as Pt[][],
};
