import {drawFigure, type FigAnchors} from '../kit/cast';
import {blob, ell, glaze, hardFill, inkLine, INK, rectPts, solid, toneOf, washAt, type InteriorLight} from '../kit/draw';
import {EXPRESSIONS} from '../kit/expressions';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {poseFor} from '../kit/poses';
import {chairSpec} from '../kit/props';
import {paintSkyDisc} from '../kit/sky';
import {DOCTOR, SLEEPER} from './cast';

// EDU-EP01-SHORT sets (brief EDU-BRIEF-R1 VD03, VD04, VD07, VD08, VD09; look frames LF01-LF05, workflow W3.1). Look-defining
// assets written by Film; Boss hardens them into shot plates at W5.2. Plate px, origin top-left, x right, y down, 1080x1920.
// Units: `U` px per metre of the cast rig at that location (estimates confirmed by the look frames, see build notes).

export const W = 1080, HGT = 1920;
const mix = mixColor;
const wide = (y0: number, y1: number): Pt[] => rectPts(-120, y0, W + 120, y1);
/** An opaque painted object: solid passes, then a textured glaze of a slightly darker tone (keeps the watercolour grain). */
export const body = (p: Painter, seed: number, color: string, pts: Pt[], glazeOp = 90) => {
  p.flat(color, pts);
  solid(p, seed, color, pts, 2, 0.08, 0.2);
  glaze(p, seed + 5000, mix(color, '#101828', 0.12), glazeOp, pts, {border: 0.5});
};

// ------------------------------------------------------------------ palette (brief colour and value key)

export const NIGHT = {
  wallTop: '#1f2f52', wall: '#2b4270', wallLit: '#3d5a8c', floor: '#2a3456', floorLine: '#1c2440', base: '#1d2846',
  sky: '#1a2d5c', skyLow: '#33528c', moon: '#e6eefa', moonGlow: '#bcd2f0', frame: '#6a7cab', curtain: '#4a5888',
  wood: '#4a3f5e', woodDark: '#2f2a44', linen: '#c9d0ea', linenHi: '#e1e5f5', sheet: '#a9b2d6',
  blanket: '#5a70a8', blanketHi: '#8d9fd0', fold: '#c9d1ee', clock: '#e8a35c', clockBody: '#2a2840',
} as const;
export const DREAM = {top: '#f3e9f0', cloud: '#f1e6ee', lilac: '#8c7bc4', lilacDeep: '#6a5aa6', rose: '#e7a8a0', peach: '#f0c6b4', cliff: '#c98c86', cliffDark: '#a06d72'} as const;
export const IDEA = {paper: '#efe6d6', paperShade: '#e2d6c0', violet: '#5f5bb0', violetSoft: '#9a95d6', bubble: '#c9c6ec', mattress: '#b9b4dc', blanket: '#8d9fd0'} as const;

/** Bedroom key light: the moon window upper right (travels down-left), cool rim from the window. */
export const MOON_LIGHT: InteriorLight = {key: [-0.55, 1], rim: [-0.9, 0.5], rimScale: 0.6};
/** Paper locations: soft top light from upper left. */
export const PAPER_LIGHT: InteriorLight = {key: [0.35, 1], rim: [0.8, 0.6], rimScale: 0.4};

// ------------------------------------------------------------------ LF01 bedroom (VD03; first shot S01-B01-SH01)

/**
 * Bedroom layout numbers (plate px, est): mattress top, headboard, nightstand, window. B01, B02, B03-SH05, B04, B07, B08 reuse it.
 * v2 (viewer check LF01 v1): pushed in and lowered so the bed sits at y ~900-1300, the rug takes <= 25 % of the frame, the
 * window and moon stay in frame; U 520 -> 640 (est).
 */
export const ROOM = {
  U: 640, mattressTop: 1010, mattressSide: 1100, railBottom: 1160, legFloor: 1300, wallBase: 1250,
  headboard: {x0: 150, x1: 205, top: 760}, pillow: {x: 320, y: 985},
  stand: {x0: 14, x1: 140, top: 1070}, clock: {x: 78, y: 1040},
  window: {x0: 590, x1: 990, y0: 150, y1: 720}, moon: {x: 880, y: 300, r: 56},
  rugTop: 1470,
} as const;

const paintRoomWallAndWindow = (p: Painter, wallSoft: number) => {
  const N = NIGHT, R = ROOM, w = R.window;
  p.flat(N.wall, wide(-120, R.wallBase + 10));
  [0, 1, 2].forEach((i) => glaze(p, 105 + i, mix(N.wall, N.wallTop, 0.5 + 0.25 * i), 120, wide(-120, 420 - i * 150), {bleed: 0.02, border: 0.05}));
  washAt(p, 102, N.wallLit, 95, blob(102, 760, 760, 470, 520, 0), 0.6, 0.4);
  // Wall softness (VD02 `w`): extra wet lilac washes that later become the cloud bleed (B03-SH01); 0.25 at the seam frame.
  if (wallSoft > 0) {
    washAt(p, 103, '#3a4f86', 90 * wallSoft, blob(103, 330, 480, 300, 220, 0), 0.35, 0.5);
    washAt(p, 104, '#46578f', 70 * wallSoft, blob(104, 470, 700, 220, 120, 0), 0.35, 0.5);
    // W5.2: past the seam state (0.25) the wall turns to mist: wide lilac washes over the upper wall (VD02 `w` up to 0.40, then the bleed)
    const mist = Math.max(0, wallSoft - 0.25);
    if (mist > 0) {
      washAt(p, 106, '#6a5fa6', 560 * mist, blob(106, 360, 330, 520, 330, 0), 0.5, 0.6);
      washAt(p, 107, '#7d6aa8', 460 * mist, blob(107, 820, 560, 420, 300, 0), 0.5, 0.6);
    }
  }
  // window: frame, night glass, moon, mullions, sill
  hardFill(p, 110, N.frame, rectPts(w.x0, w.y0, w.x1, w.y1));
  p.flat(N.sky, rectPts(w.x0 + 24, w.y0 + 24, w.x1 - 24, w.y1 - 24));
  washAt(p, 111, N.skyLow, 150, rectPts(w.x0 + 24, (w.y0 + w.y1) / 2, w.x1 - 24, w.y1 - 24), 0.3, 0.3);
  paintSkyDisc(p, {x: R.moon.x, y: R.moon.y, r: R.moon.r, color: N.moon, glow: 0.45, glowColor: N.moonGlow, seed: 7210});
  // a few far rooftops under the moon so the window reads as outside at night
  const ry = w.y1 - 120;
  washAt(p, 112, '#22325a', 220, [[w.x0 + 24, ry + 12], [680, ry], [690, ry - 28], [750, ry - 28], [760, ry + 7], [850, ry - 8], [860, ry - 43], [905, ry - 43], [912, ry - 8], [w.x1 - 24, ry], [w.x1 - 24, w.y1 - 24], [w.x0 + 24, w.y1 - 24]], 0.05, 0.2);
  const mx = (w.x0 + w.x1) / 2, my = (w.y0 + w.y1) / 2 + 20;
  hardFill(p, 113, N.frame, rectPts(mx - 7, w.y0 + 20, mx + 7, w.y1 - 20));
  hardFill(p, 114, N.frame, rectPts(w.x0 + 20, my - 7, w.x1 - 20, my + 7));
  hardFill(p, 115, '#7f90bc', rectPts(w.x0 - 20, w.y1 - 4, w.x1 + 20, w.y1 + 20));
  inkLine(p, 116, rectPts(w.x0, w.y0, w.x1, w.y1), {color: mix(INK, N.frame, 0.4), weight: 0.6, still: true});
  // curtains, gathered at both sides
  const curtain = (seed: number, x0: number, x1: number, sway: number) => {
    const pts: Pt[] = [[x0, w.y0 - 40], [x1, w.y0 - 40], [x1 + sway, w.y1 + 40], [x1 + sway * 0.6, w.y1 + 170], [x0 + sway * 0.3, w.y1 + 180], [x0, w.y1 + 60]];
    body(p, seed, N.curtain, pts, 110);
    for (let i = 1; i < 4; i++) {
      const u = i / 4;
      inkLine(p, seed + i, [[x0 + (x1 - x0) * u, w.y0 - 30], [x0 + (x1 - x0) * u + sway * 0.6 * u, w.y1 + 150]], {color: mix(N.curtain, '#121a30', 0.5), weight: 0.45, closed: false, still: true});
    }
  };
  curtain(120, w.x0 - 70, w.x0 + 34, -10);
  curtain(130, w.x1 - 34, w.x1 + 70, 14);
  hardFill(p, 140, NIGHT.woodDark, rectPts(w.x0 - 100, w.y0 - 52, w.x1 + 100, w.y0 - 40)); // curtain rod
};

const paintRoomFloor = (p: Painter) => {
  const N = NIGHT, R = ROOM;
  p.flat(N.floor, wide(R.wallBase, HGT + 120));
  hardFill(p, 150, N.base, rectPts(-120, R.wallBase - 26, W + 120, R.wallBase + 4));
  // plank seams spread toward the camera (floor seen from bed height, est)
  [1276, 1310, 1352, 1406, 1476, 1566, 1680, 1830].forEach((y, i) =>
    inkLine(p, 151 + i, [[-40, y], [W + 40, y + 6 * (i % 2 ? 1 : -1)]], {color: N.floorLine, weight: 0.5 + i * 0.06, closed: false, still: true}),
  );
  washAt(p, 165, '#1e2542', 130, wide(1700, HGT + 120), 0.5, 0.3);
  // rug in front of the bed, muted dusty rose; top edge at R.rugTop so it takes <= 25 % of the frame (viewer check v1)
  const rug: Pt[] = [[90, R.rugTop + 10], [1120, R.rugTop], [1200, HGT + 80], [-40, HGT + 80]];
  body(p, 166, '#5e5276', rug, 100);
  inkLine(p, 168, [[130, R.rugTop + 36], [1080, R.rugTop + 26], [1140, HGT + 60]], {color: '#86769e', weight: 1.1, closed: false, still: true});
  inkLine(p, 167, rug, {color: mix('#5e5276', INK, 0.5), weight: 0.5, still: true});
  // slippers by the bed (she took them off: someone lives here)
  [[300, 1560], [400, 1580]].forEach(([x, y], i) => {
    const sl = ell(x, y, 54, 19, 16);
    body(p, 171 + i * 2, '#c9b6dc', sl, 60);
    inkLine(p, 175 + i, sl, {color: mix(INK, '#c9b6dc', 0.4), weight: 0.5, still: true});
  });
};

/** Moon light: a pale shaft from the window across the bed and a pool on the floor and rug (UT04). Off the face. */
const paintMoonLight = (p: Painter, level: number) => {
  glaze(p, 170, NIGHT.moonGlow, 30 * level, [[608, 730], [976, 730], [900, 1250], [600, 1250]], {bleed: 0.1, border: 0.1});
  // pool of moonlight on the floor in front of the bed (window shape, mullion cross in shadow)
  const pool: Pt[] = [[560, 1360], [900, 1354], [860, 1700], [450, 1712]];
  glaze(p, 171, '#8ea4d6', 90 * level, pool, {bleed: 0.03, border: 0.15});
  glaze(p, 172, '#5e5276', 120 * level, [[724, 1358], [738, 1358], [668, 1708], [652, 1708]], {bleed: 0.02});
  glaze(p, 173, '#5e5276', 120 * level, [[510, 1524], [876, 1518], [874, 1532], [506, 1538]], {bleed: 0.02});
};

const paintNightstand = (p: Painter, clockLevel: number) => {
  const N = NIGHT, R = ROOM, s = R.stand, c = R.clock;
  const box = rectPts(s.x0, s.top, s.x1, R.legFloor - 40);
  body(p, 180, N.woodDark, box, 80);
  // the table top catches the clock: clean warm amber on the wood (no amber over the blue wall: it reads green, v1 note)
  hardFill(p, 181, mix(N.wood, N.clock, 0.45 * clockLevel), rectPts(s.x0 - 8, s.top - 14, s.x1 + 8, s.top + 4));
  glaze(p, 179, mix(N.woodDark, N.clock, 0.35 * clockLevel), 140, [[s.x0, s.top + 4], [s.x1, s.top + 4], [s.x1, s.top + 50], [s.x0, s.top + 70]], {bleed: 0.15, border: 0.1});
  hardFill(p, 182, mix(N.woodDark, '#000000', 0.25), rectPts(s.x0 + 14, R.legFloor - 40, s.x0 + 30, R.legFloor));
  hardFill(p, 183, mix(N.woodDark, '#000000', 0.25), rectPts(s.x1 - 30, R.legFloor - 40, s.x1 - 14, R.legFloor));
  inkLine(p, 184, [[s.x0 + 12, s.top + 80], [s.x1 - 12, s.top + 80]], {color: mix(INK, N.wood, 0.3), weight: 0.5, closed: false, still: true});
  hardFill(p, 185, '#8a7a9a', rectPts((s.x0 + s.x1) / 2 - 14, s.top + 44, (s.x0 + s.x1) / 2 + 14, s.top + 54)); // drawer knob
  // small digital clock: dark body, warm screen (bars, no numerals: the hour is read from the glow, B07-SH02)
  hardFill(p, 186, N.clockBody, rectPts(c.x - 46, c.y - 38, c.x + 46, s.top - 14));
  hardFill(p, 187, mix(N.clock, '#2a2840', 1 - clockLevel), rectPts(c.x - 34, c.y - 26, c.x + 34, c.y + 2));
  for (let i = 0; i < 3; i++) hardFill(p, 188 + i, mix('#fff0d8', N.clock, 0.4), rectPts(c.x - 26 + i * 20, c.y - 18, c.x - 14 + i * 20, c.y - 6));
};

/** Bed behind the sleeper: headboard, rail, legs, mattress, sheet, pillow. */
const paintBedBack = (p: Painter, hidePillow = false) => {
  const N = NIGHT, R = ROOM, hb = R.headboard;
  const head: Pt[] = [[hb.x0, R.legFloor], [hb.x0, hb.top + 30], [hb.x0 + 12, hb.top], [hb.x1 - 12, hb.top], [hb.x1, hb.top + 30], [hb.x1, R.legFloor]];
  body(p, 200, N.wood, head, 80);
  washAt(p, 201, N.woodDark, 160, [[hb.x0, hb.top + 60], [hb.x0 + 18, hb.top + 60], [hb.x0 + 18, R.legFloor], [hb.x0, R.legFloor]], 0.05, 0.3);
  inkLine(p, 202, head, {color: mix(INK, N.wood, 0.3), weight: 0.6, still: true});
  hardFill(p, 203, N.woodDark, rectPts(hb.x1, R.mattressSide, W + 140, R.railBottom));
  hardFill(p, 204, mix(N.woodDark, '#000000', 0.2), rectPts(hb.x1 + 10, R.railBottom, hb.x1 + 40, R.legFloor));
  hardFill(p, 205, mix(N.woodDark, '#000000', 0.2), rectPts(W - 50, R.railBottom, W - 20, R.legFloor + 6));
  // under-bed shadow on the floor
  washAt(p, 206, '#151b30', 170, [[hb.x1 - 20, R.legFloor - 6], [W + 120, R.legFloor - 6], [W + 120, R.legFloor + 34], [hb.x1 - 20, R.legFloor + 28]], 0.4, 0.3);
  washAt(p, 207, '#171d34', 150, rectPts(hb.x1, R.railBottom, W + 120, R.legFloor - 4), 0.1, 0.3);
  // mattress and sheet
  const mat: Pt[] = [[hb.x1, R.mattressTop + 6], [hb.x1 + 30, R.mattressTop], [W + 140, R.mattressTop], [W + 140, R.mattressSide], [hb.x1, R.mattressSide]];
  body(p, 208, N.sheet, mat, 60);
  washAt(p, 209, N.linenHi, 120, rectPts(hb.x1 + 30, R.mattressTop, W + 140, R.mattressTop + 22), 0.1, 0.3);
  // pillow (W5.2: taken off the bed when she hugs it, B07-SH01)
  if (hidePillow) return;
  const pl = R.pillow;
  const pillow = blob(210, pl.x, pl.y, 140, 46, 0);
  body(p, 211, N.linen, pillow, 50);
  washAt(p, 212, mix(N.linen, '#5a6ea8', 0.45), 150, [[pl.x - 130, pl.y + 8], [pl.x + 132, pl.y + 4], [pl.x + 124, pl.y + 38], [pl.x - 120, pl.y + 40]], 0.3, 0.4);
  inkLine(p, 213, pillow, {color: mix(INK, N.linen, 0.4), weight: 0.55, still: true});
};

/** The sleeper's head lying face up on the pillow, in profile (crown to screen left, chin right). Episode-local look asset
 * (viewer check LF01 v1: the rig's rotated profile read as a bald, staring head with a helmet of hair). Head units as head.ts
 * (`K` px; profile frame u toward the face, v down the head; eye level v 0.05, top -1.17, chin 1.22), mapped face-up:
 * screen = hc + (v K, -u K). `lid` 0 open .. 1 shut (0.6 at the seam frame: half-closed). Returns the chin and nape points. */
export type HeadOpts = {
  /** Screen transform applied after the lying map (the sit-up pivot and the jolt lift, see `sleeperXf`). Default identity. */
  xf?: (pt: Pt) => Pt;
  /** 0 lying .. 1 upright: the bob fanned on the pillow folds back to hang behind the head. */
  rot?: number;
  /** Eyes wide open (the jolt, `shock`): white, iris, raised brow. */
  wide?: boolean;
  /** 0..1 small rueful smile: a crease at the mouth corner. */
  smile?: number;
  /** Open eye looks out of the picture at the viewer (iris centred in the eye, not along the face): B01-SH02 "looking at the lens". */
  lens?: boolean;
  /** 1 = the lying head with its pillow pieces (hair fan, neck plate, pillow-side shade); 0 = the seated head: just skull, bob cap, ear, face, one
   *  neck painted by the caller. Drops 1 -> 0 over about 3 frames once the head lifts off the pillow (`paintBedroom`). Default 1. */
  lyingMix?: number;
};

export const paintLyingHead = (p: Painter, hc: Pt, K: number, lid: number, light = 1, o: HeadOpts = {}) => {
  const sk = SLEEPER.head.skin, hair = SLEEPER.head.hair;
  const xf = o.xf ?? ((q: Pt) => q), rot = o.rot ?? 0, lm = o.lyingMix ?? 1;
  const M = ([u, v]: Pt): Pt => xf([hc[0] + v * K, hc[1] - u * K]);
  const Q = (pts: Pt[]) => pts.map(M);
  const skin = mix(sk, '#6a7ab0', 0.28); // moonlit night skin, still warm
  const hairLit = mix(hair, '#6a7cab', 0.3);
  const fill = (seed: number, color: string, pts: Pt[]) => solid(p, seed, color, Q(pts), 6, 0.04, 0.2);
  const ink = (id: number, pts: Pt[], weight = 1.0, closed = true, color = mix(INK, skin, 0.35), curve = 0.3) => inkLine(p, id, Q(pts), {weight, curve, closed, color, still: true});
  // 1. bob fanned on the pillow behind and beyond the crown (drawn first: under the head)
  // W5.2: upright (`rot` 1) the part of the fan beyond the crown folds away (v < -1.17 shrinks to the crown line), leaving the bob hanging behind
  // round 3: it also draws in toward the head (a bob behind the head, not a second dark head-shaped layer coming up with her)
  // round 4: the fan belongs to the lying head only; it shrinks to nothing (`lm`) as the head lifts and is not drawn once it is gone
  const fold = ([u0, v0]: Pt): Pt => {
    const u = u0 * lm, v = -0.2 + (v0 + 0.2) * lm;
    return [u, v];
  };
  const fan: Pt[] = ([[0.55, -1.0], [0.2, -1.38], [-0.3, -1.62], [-0.7, -1.7], [-1.05, -1.45], [-1.25, -0.9], [-1.3, -0.2], [-1.25, 0.45], [-1.05, 0.85], [-0.6, 0.7], [-0.2, 0.2], [0.3, -0.5]] as Pt[]).map(fold);
  const fanCol = mix(hairLit, hair, 0.75 * rot); // sitting up it hangs in shade behind her: dark hair, not a grey panel
  if (lm > 0.02) {
    p.flat(fanCol, Q(fan));
    fill(7300, fanCol, fan);
    ink(7301, fan, 0.8, true, mix(INK, hair, 0.3));
    [[[0.1, -1.2], [-0.3, -1.5], [-0.6, -1.64]], [[-0.3, -1.0], [-0.75, -1.3], [-1.0, -1.4]], [[-0.6, -0.6], [-1.0, -0.8], [-1.2, -0.78]], [[-0.7, 0.0], [-1.05, 0.1], [-1.22, 0.3]], [[0.3, -1.3], [-0.1, -1.55], [-0.35, -1.66]]].forEach((pts, i) =>
      ink(7302 + i, (pts as Pt[]).map(fold), 0.9, false, mix(hairLit, '#c8d2f0', 0.45), 0.5),
    );
  }
  // 2. neck, then the head
  if (lm > 0.02) fill(7310, mix(skin, '#2a3460', 0.28), [[-0.4, 0.62], [0.35, 0.9], [0.3, 1.3], [-0.42, 1.3]]);
  const head: Pt[] = [[0.0, -1.17], [0.45, -1.06], [0.78, -0.8], [0.93, -0.38], [0.95, -0.05], [0.9, 0.42], [0.95, 0.52], [0.9, 0.62], [0.92, 0.72], [0.86, 0.92], [0.7, 1.04], [0.5, 1.05], [0.0, 0.86], [-0.25, 0.68], [-0.7, 0.45], [-0.98, 0.0], [-1.0, -0.4], [-0.85, -0.85], [-0.5, -1.08]];
  fill(7311, skin, head);
  // shade the side of the head turned toward the pillow (lower on screen): volume, so the head reads lying, not a flat disc
  if (lm > 0.02) glaze(p, 7319, mix(skin, '#26305a', 0.55), 210 * lm, Q([[0.15, -1.1], [-0.5, -1.08], [-0.95, -0.4], [-0.95, 0.3], [-0.5, 0.75], [0.0, 1.05], [0.3, 1.1], [0.1, 0.4], [0.2, -0.4]]), {bleed: 0.25, border: 0.1});
  // moon rim along the face (light from the window, upper right)
  glaze(p, 7312, mix(skin, '#dfe6fa', 0.5), 70 * light, Q([[0.5, -0.9], [0.88, -0.4], [0.9, 0.9], [0.6, 1.1], [0.6, -0.2]]), {bleed: 0.2, border: 0.1});
  // nose, lips, cheek blush
  const nose: Pt[] = [[0.93, -0.08], [1.24, 0.3], [1.1, 0.38], [0.95, 0.42]];
  fill(7313, skin, nose);
  fill(7314, mix(sk, '#b0505a', 0.6), [[0.92, 0.48], [1.03, 0.54], [0.97, 0.62], [1.03, 0.7], [0.92, 0.78], [0.86, 0.62]]);
  ink(7309, [[1.08, 0.34], [1.02, 0.37]], 0.9, false); // nostril
  washAt(p, 7315, '#d98a92', 90, ell(...M([0.6, 0.4]), 0.12 * K, 0.16 * K, 12), 0.4, 0.3);
  ink(7316, head, 1.0);
  ink(7317, nose, 1.0, false);
  ink(7318, [[0.92, 0.62], [0.85, 0.62]], 0.8, false);
  // 3. hair over the skull: the crown, behind the ear, and a fringe falling back off the forehead
  const cap: Pt[] = [[0.78, -0.82], [0.5, -1.12], [0.0, -1.26], [-0.55, -1.12], [-0.95, -0.75], [-1.08, -0.2], [-1.02, 0.35], [-0.78, 0.68], [-0.45, 0.74], [-0.36, 0.45], [-0.34, 0.1], [-0.1, -0.25], [0.3, -0.5], [0.6, -0.6]];
  p.flat(hair, Q(cap));
  fill(7320, hair, cap);
  glaze(p, 7321, hairLit, 120, Q([[0.6, -0.95], [0.1, -1.2], [-0.2, -1.1], [0.35, -0.85]]), {bleed: 0.1, border: 0.1}); // sheen
  ink(7322, cap, 0.9, true, mix(INK, hair, 0.3));
  // fringe: a short fringe over the forehead, its tips sliding back off the brow toward the pillow (gravity, face up)
  const fringe: Pt[] = [[0.8, -0.86], [0.92, -0.62], [0.86, -0.52], [0.78, -0.46], [0.74, -0.52], [0.64, -0.4], [0.58, -0.48], [0.46, -0.38], [0.4, -0.5], [0.45, -0.7]];
  fill(7323, hair, fringe);
  ink(7324, fringe, 0.8, true, mix(INK, hair, 0.3));
  // ear
  fill(7326, skin, ell(-0.12, 0.14, 0.15, 0.22, 14).map(([x, y]): Pt => [x, y]));
  ink(7327, [[-0.08, 0.02], [-0.17, 0.12], [-0.08, 0.24]], 0.8, false);
  // 4. eye. Half-lid / shut (`lid` >= 0.6, the locked look): a heavy upper-lid arc with lashes; the iris sliver shrinks as `lid` closes.
  // W5.2: below 0.6, or `wide`, the eye is an open almond (white, iris, highlight) looking along the face (up at the ceiling when lying).
  const ey = 0.06, ex0 = 0.52, ex1 = 0.8;
  if (lid >= 0.6 && !o.wide) {
    const open = Math.max(0, 1 - lid) * 0.09;
    if (open > 0.005) fill(7330, '#2a2230', [[ex0 + 0.04, ey], [ex1 - 0.02, ey + 0.02], [ex1 - 0.06, ey + 0.02 + open], [ex0 + 0.1, ey + open * 0.8]].map(([u, v]): Pt => [u + 0.0, v]));
    const lidArc: Pt[] = [[ex0, ey - 0.02], [(ex0 + ex1) / 2, ey + 0.05 + 0.04 * lid], [ex1, ey + 0.02]];
    ink(7331, lidArc, 3.0, false, mix(INK, '#2a2230', 0.2), 0.6);
    [0.3, 0.55, 0.8, 1.0].forEach((f, i) => {
      const [u0, v0] = [ex0 + (ex1 - ex0) * f, ey + 0.03 + 0.05 * lid * Math.sin(Math.PI * f)];
      ink(7332 + i, [[u0 - 0.02, v0], [u0 + 0.06, v0 + 0.1]], 1.5, false, mix(INK, '#2a2230', 0.2), 0);
    });
    ink(7336, [[0.46, -0.24], [0.64, -0.3], [0.82, -0.22]], 2.2, false, mix(hair, skin, 0.15), 0.5); // brow
  } else {
    const h = o.wide ? 0.15 : 0.04 + (0.6 - lid) * 0.17; // half-height of the almond
    const upper: Pt[] = [0, 0.25, 0.5, 0.75, 1].map((f): Pt => [ex0 - 0.02 + (ex1 - ex0 + 0.06) * f, ey - h * Math.sin(Math.PI * f) * 0.95]);
    const lower: Pt[] = [1, 0.75, 0.5, 0.25, 0].map((f): Pt => [ex0 - 0.02 + (ex1 - ex0 + 0.06) * f, ey + h * 0.55 * Math.sin(Math.PI * f)]);
    fill(7337, '#eceaf2', [...upper, ...lower]);
    const ir = Math.min(h * 0.95, 0.1), ic: Pt = o.lens ? [(ex0 + ex1) / 2 + 0.03, ey + h * 0.05] : [ex1 - 0.1, ey - h * 0.1];
    fill(7338, '#2a2230', ell(ic[0], ic[1], ir, ir, 14).map(([x, y]): Pt => [x, y]));
    fill(7339, '#f4f2fa', ell(ic[0] + ir * 0.35, ic[1] - ir * 0.35, ir * 0.28, ir * 0.28, 8).map(([x, y]): Pt => [x, y]));
    ink(7331, upper, 2.6, false, mix(INK, '#2a2230', 0.2), 0.6);
    ink(7340, lower, 0.8, false, mix(INK, skin, 0.3), 0.6);
    [0.35, 0.65, 0.95].forEach((f, i) => {
      const [u0, v0] = [ex0 + (ex1 - ex0) * f, ey - h * Math.sin(Math.PI * f) * 0.95];
      ink(7332 + i, [[u0 - 0.02, v0], [u0 + 0.02, v0 - 0.1]], 1.3, false, mix(INK, '#2a2230', 0.2), 0);
    });
    ink(7336, [[0.46, -0.24 - (o.wide ? 0.14 : 0)], [0.64, -0.3 - (o.wide ? 0.16 : 0)], [0.82, -0.22 - (o.wide ? 0.12 : 0)]], 2.2, false, mix(hair, skin, 0.15), 0.5); // brow, raised when wide
  }
  if (o.smile && o.smile > 0) {
    const sm = o.smile;
    ink(7341, [[0.96, 0.78 + 0.02 * sm], [0.9, 0.84 + 0.06 * sm], [0.8, 0.86 + 0.07 * sm]], 0.9, false, mix(INK, '#a4504a', 0.3), 0.5);
  }
  return {chin: M([0.55, 1.18]), nape: M([-0.6, 0.85])};
};

/** Blanket over the sleeper, from the chest to off-frame right; the near side folds down the mattress side only (v2). */
const paintBlanket = (p: Painter, chestX: number, bodyTop: number, feetX: number, jump = 0, knee = 0, band = 1) => {
  const N = NIGHT, R = ROOM;
  const top: Pt[] = [];
  const x1 = W + 140;
  top.push([chestX - 30, R.mattressTop + 6], [chestX - 18, bodyTop + 22]);
  for (let i = 0; i <= 24; i++) {
    const x = chestX + ((x1 - chestX) * i) / 24;
    // chest, a soft dip over the belly, the knees, then the tent over the toes (shape est from the 1.58 m figure at U 640)
    const y = bodyTop + 30 * Math.exp(-(((x - (chestX + 0.62 * (feetX - chestX))) / 140) ** 2)) - 10 * Math.exp(-(((x - (chestX + 0.75 * (feetX - chestX))) / 70) ** 2)) - 24 * Math.exp(-(((x - feetX + 20) / 54) ** 2)) + (x > feetX + 40 ? Math.min(60, (x - feetX - 40) * 0.8) : 0) - jump * Math.min(1, (x - chestX + 40) / 120) - knee * Math.exp(-(((x - (chestX + 250)) / 130) ** 2));
    top.push([x, y]);
  }
  // near side: the duvet ends a little below the mattress edge, with a gentle wave (no mound over the rug, viewer check v1)
  const hem: Pt[] = [[x1, R.mattressSide + 34], [960, R.mattressSide + 44], [860, R.mattressSide + 28], [740, R.mattressSide + 46], [620, R.mattressSide + 26], [chestX + 40, R.mattressSide + 10], [chestX - 20, R.mattressTop + 60]];
  const pts = [...top, ...hem];
  body(p, 220, N.blanket, pts, 70);
  // the fold down the side: a darker band below the mattress line, fold shadows, moon light on the top
  glaze(p, 221, mix(N.blanket, '#141c38', 0.5), 200, [[chestX + 30, R.mattressTop + 40], [x1, R.mattressTop + 40], ...hem.slice(0, 6)], {bleed: 0.15, border: 0.1});
  glaze(p, 222, N.blanketHi, 170, [[620, bodyTop + 14], [720, bodyTop + 10], [900, bodyTop + 30], [860, R.mattressTop + 20], [600, R.mattressTop + 20]], {bleed: 0.3, border: 0.05});
  [[700, 720], [880, 900]].forEach(([x, xb], i) => glaze(p, 229 + i, mix(N.blanket, '#141c38', 0.4), 150, [[x - 30, R.mattressTop + 46], [x + 20, R.mattressTop + 46], [xb + 26, R.mattressSide + 30], [xb - 34, R.mattressSide + 36]], {bleed: 0.2, border: 0.05}));
  // the mattress edge under the cloth: a soft crease line where the duvet turns down
  inkLine(p, 223, [[chestX + 20, R.mattressTop + 34], [x1, R.mattressTop + 30]], {color: mix(N.blanket, INK, 0.45), weight: 0.5, closed: false, still: true});
  // turned-down sheet band at the chest (gone once she sits up: the blanket then pools over her lap)
  const bandPts: Pt[] = [[chestX - 26, R.mattressTop + 10], [chestX - 22, bodyTop + 16], [chestX - 6, bodyTop - 4], [chestX + 40, bodyTop - 2], [chestX + 30, bodyTop + 80], [chestX + 36, R.mattressTop + 30], [chestX - 18, R.mattressTop + 30]];
  if (band > 0.01) {
    const pb = band >= 0.999 ? p : p.layer(band, 9300);
    body(pb, 226, mix(N.fold, N.blanket, 0.3), bandPts, 50);
    if (band >= 0.999) inkLine(p, 227, bandPts, {color: mix(INK, N.fold, 0.4), weight: 0.5, still: true});
  }
  inkLine(p, 228, [...top, ...hem.slice(0, 6)], {color: mix(INK, N.blanket, 0.35), weight: 0.6, closed: false, still: true});
};

export type RoomState = {
  wallSoft: number; moon: number; clock: number; face: keyof typeof EXPRESSIONS; lid?: number;
  /** W5.2 (all optional; absent = the locked LF01 look). `rot` 0 lying .. 1 sitting up in bed (hip `HIP_LYING` -> `HIP_SIT`). */
  rot?: number;
  /** Head and shoulders lifted off the pillow, px (the jolt). */
  lift?: number;
  /** Blanket pushed up, px (the jolt). */
  jump?: number;
  /** Chest rise, px (the breath; the plate passes a sine of the ambient clock). */
  breath?: number;
  wide?: boolean;
  smile?: number;
  /** Open eye looks at the lens (B01-SH02). */
  lens?: boolean;
  /** Forearm: 0 hand in the lap .. 1 hand on the chest. */
  hand?: number;
  /** Arms visible 0..1 (fades in as she rises). */
  arms?: number;
  /** 0..1 she holds the bed pillow against her chest (the pillow leaves the bed). */
  hug?: number;
  /** Sinks into the mattress, px (B02-SH02). */
  sink?: number;
};

/** Sleeper placement in the bed (plate px, est): head centre on the pillow, K px per head unit (rig head 0.425 m = 2.39 K). */
export const SLEEPER_BED = {hc: [372, 846] as Pt, K: (0.425 * ROOM.U) / 2.39, feetX: 230 + 1.58 * ROOM.U} as const;
/**
 * Sit-up placement (`new: sit on bed edge`, W5.2 repaint). The lying figure turns clockwise about her hip while the hip scoots from
 * under the blanket (`HIP_LYING`, real hip: chin 352 px away) to where she sits (`HIP_SIT`, on the mattress, upright spine, head clear
 * of the moon). Torso frame (a up the spine from the hip, b toward the front) maps to the lying plate by `[HIP_LYING.x - a, HIP_LYING.y - b]`.
 */
export const HIP_LYING: Pt = [863, 916];
export const HIP_SIT: Pt = [670, 985];

/** The lying figure's screen transform at `rot` (0 lying, 1 upright) with the jolt `lift` weighted toward the head end. */
export const sleeperXf = (rot: number, lift = 0, sink = 0) => {
  const th = (rot * Math.PI) / 2, c = Math.cos(th), sn = Math.sin(th);
  const hx = HIP_LYING[0] + (HIP_SIT[0] - HIP_LYING[0]) * rot, hy = HIP_LYING[1] + (HIP_SIT[1] - HIP_LYING[1]) * rot;
  return ([x, y]: Pt, w?: number): Pt => {
    const wt = w ?? Math.max(0, Math.min(1, (720 - x - 20) / 200));
    const dx = x - HIP_LYING[0], dy = y - lift * wt + sink * wt - HIP_LYING[1];
    return [hx + dx * c - dy * sn, hy + dx * sn + dy * c];
  };
};

/** Torso frame (a up the spine, b to the front) of the sitting-up figure: new contour (N) and the lying shirt's contour (O), point for point. */
const TORSO_N: Pt[] = [[312, 32], [298, 60], [270, 80], [235, 88], [200, 90], [150, 72], [110, 62], [60, 78], [20, 84], [-20, 80], [-50, 40], [-50, -40], [-30, -80], [30, -84], [90, -66], [150, -70], [210, -86], [270, -82], [306, -48], [312, -12]];
const TORSO_O: Pt[] = [[371.5, 64], [320, 104], [270, 104], [235, 104], [200, 104], [150, 94], [110, 85], [60, 76], [20, 72], [-20, 70], [-50, 70], [-50, -104], [-30, -104], [30, -104], [90, -104], [150, -104], [210, -104], [270, -104], [306, -104], [383, -104]];
const lerp2 = (u: Pt[], v: Pt[], w: number): Pt[] => u.map(([a, b], i): Pt => [a + (v[i][0] - a) * w, b + (v[i][1] - b) * w]);
const smoothstep = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
/** Hand targets of the near arm in the torso frame: in the lap, on the chest, round the pillow. */
const ARM = {shoulder: [285, -6] as Pt, lap: [115, 135] as Pt, chest: [232, 70] as Pt, hug: [190, 160] as Pt, bone: 166};
/** Two-bone IK in the torso frame: the elbow below the shoulder-hand line (smaller a). */
const elbowOf = (S: Pt, T: Pt, L: number): Pt => {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.min(Math.hypot(dx, dy), 2 * L - 1), h = Math.sqrt(L * L - (d / 2) ** 2);
  const m: Pt = [S[0] + dx / 2, S[1] + dy / 2], n: Pt = [dy / (Math.hypot(dx, dy) || 1), -dx / (Math.hypot(dx, dy) || 1)];
  const e1: Pt = [m[0] + n[0] * h, m[1] + n[1] * h], e2: Pt = [m[0] - n[0] * h, m[1] - n[1] * h];
  return e1[0] < e2[0] ? e1 : e2;
};

/** LF01: the bedroom at the seam frame (VD02): she lies on her back, head on the pillow at screen left, face up, lids half-closed. */
export const paintBedroom = (p: Painter, t: number, s: RoomState) => {
  const R = ROOM, B = SLEEPER_BED;
  const rot = s.rot ?? 0, lift = s.lift ?? 0, sink = s.sink ?? 0, breath = s.breath ?? 0;
  const xf = sleeperXf(rot, lift, sink);
  const T = (a: number, b: number): Pt => xf([HIP_LYING[0] - a, HIP_LYING[1] - b], 1);
  const TT = (pts: Pt[]) => pts.map(([a, b]) => T(a, b));
  const skinTone = mix(SLEEPER.head.skin, '#6a7ab0', 0.22);
  const shirt = mix(SLEEPER.outfit.shirt, '#3a4a80', 0.3);
  paintRoomWallAndWindow(p, s.wallSoft);
  paintRoomFloor(p);
  paintMoonLight(p, s.moon);
  paintNightstand(p, s.clock);
  paintBedBack(p, (s.hug ?? 0) > 0);
  // shoulder in the pyjama top under the head, then the head (episode-local lying head), then the blanket over the chest
  // W5.2 repaint: lying (rot 0) = the locked shoulder panel. Sitting up the torso is a real seated body in the torso frame (neck, rounded
  // back, chest, waist, hips; `TORSO_N`), mixed from the lying panel (`TORSO_O`) over the first 20 % of the rise so nothing pops.
  const w = smoothstep(clamp01(rot * 10)), lyingMix = 1 - smoothstep(clamp01((rot - 0.03) / 0.1));
  if (rot === 0) {
    const shoulder: Pt[] = [[B.hc[0] + 0.95 * B.K, R.mattressTop + 10], [B.hc[0] + 1.05 * B.K, B.hc[1] + 0.05 * B.K], [B.hc[0] + 1.5 * B.K, B.hc[1] - 0.3 * B.K], [B.hc[0] + 2.6 * B.K, B.hc[1] - 0.3 * B.K], [780, 838], [860, 846], [860, R.mattressTop + 10]];
    const torsoPts = lift === 0 && sink === 0 ? shoulder : shoulder.map((q) => xf(q));
    body(p, 7290, shirt, torsoPts, 60);
    inkLine(p, 7291, torsoPts, {color: mix(INK, SLEEPER.outfit.shirt, 0.4), weight: 0.6, still: true});
  } else {
    // neck: skin from the collar up under the jaw (the shirt is painted over its foot)
    body(p, 7285, mix(mix(SLEEPER.head.skin, '#6a7ab0', 0.28), '#3a3460', 0.12), TT([[380, -10], [335, 26], [294, 36], [274, 6], [286, -40]]), 40);
    const torso = TT(lerp2(TORSO_O, TORSO_N, w));
    body(p, 7290, shirt, torso, 60);
    if (w > 0.01) {
      // lit front (moon from the window, upper right), shade down the back, waist and bust folds, so the torso is a body, not a panel
      glaze(p, 7293, mix(shirt, '#d8def4', 0.55), 90 * w, TT([[270, 80], [235, 88], [200, 90], [150, 72], [180, 54], [240, 62]]), {bleed: 0.3, border: 0.1});
      glaze(p, 7294, mix(shirt, '#1c2448', 0.5), 150 * w, TT([[-30, -80], [30, -84], [90, -66], [150, -70], [210, -86], [215, -40], [120, -30], [30, -30]]), {bleed: 0.25, border: 0.1});
      inkLine(p, 7295, TT([[150, -52], [128, -20], [118, 20]]), {color: mix(INK, SLEEPER.outfit.shirt, 0.5), weight: 0.4 * w, closed: false, curve: 0.5, still: true});
      inkLine(p, 7296, TT([[100, 40], [70, 55], [30, 62]]), {color: mix(INK, SLEEPER.outfit.shirt, 0.5), weight: 0.4 * w, closed: false, curve: 0.5, still: true});
    }
    inkLine(p, 7291, torso, {color: mix(INK, SLEEPER.outfit.shirt, 0.4), weight: 0.6, still: true});
  }
  paintLyingHead(p, B.hc, B.K, s.lid ?? (s.face === 'asleep' ? 1 : 0.6), s.moon, {xf: (q) => xf([q[0] + 66 * rot, q[1] + 38 * rot], 1), rot, wide: s.wide, smile: s.smile, lens: s.lens, lyingMix});
  // pale V collar of the pyjama at the throat (lying: at the chin; sitting: the neckline of the shirt)
  const collar = rot === 0 ? [[B.hc[0] + 1.1 * B.K, B.hc[1] - 0.0 * B.K], [B.hc[0] + 1.5 * B.K, B.hc[1] + 0.2 * B.K], [B.hc[0] + 1.6 * B.K, B.hc[1] - 0.28 * B.K]].map((q) => xf(q as Pt, 1)) : TT(lerp2([[366, 70], [321, 47], [309, 102]], [[304, 54], [258, 14], [300, -44]], w));
  inkLine(p, 7292, collar, {color: '#efe6f6', weight: 1.4, closed: false, still: true});
  const bTop = B.hc[1] - 0.2 * B.K + (R.mattressTop - 120 - (B.hc[1] - 0.2 * B.K)) * rot * 0.9;
  const bX = B.hc[0] + 2.2 * B.K + (590 - (B.hc[0] + 2.2 * B.K)) * rot;
  // arms (W5.2 round 2): always opaque. Rising or lying down (rot < 0.8) the arm is painted before the blanket so the cloth covers it;
  // its hand goes from "at her side" (lying) to the lap as she sits up. Sat up, it is painted after the blanket and the pillow (in front).
  const hug = Math.min(1, s.hug ?? 0), e = hug * hug * (3 - 2 * hug);
  const paintArm = () => {
    if (!(rot > 0.001 || (s.arms ?? 0) > 0.01)) return;
    const pa = p;
    const h = s.hand ?? 0, Sh = ARM.shoulder, side = smoothstep(clamp01((rot - 0.25) / 0.55));
    const lap: Pt = [ARM.lap[0], 35 + (ARM.lap[1] - 35) * side];
    const base: Pt = [lap[0] + (ARM.chest[0] - lap[0]) * h, lap[1] + (ARM.chest[1] - lap[1]) * h];
    const Tg: Pt = [base[0] + (ARM.hug[0] - base[0]) * e, base[1] + (ARM.hug[1] - base[1]) * e];
    const El = elbowOf(Sh, Tg, ARM.bone);
    const sleeve = mix(mix(SLEEPER.outfit.sleeve, '#3a4a80', 0.2), '#ffffff', 0.1), edge = mix(INK, SLEEPER.outfit.sleeve, 0.4);
    const J = T(Sh[0], Sh[1]), E = T(El[0], El[1]);
    const wr = T(El[0] + (Tg[0] - El[0]) * 0.82, El[1] + (Tg[1] - El[1]) * 0.82), Hd = T(Tg[0], Tg[1]);
    const limb = (id: number, p0: Pt, p1: Pt, w0: number, w1: number, col: string) => {
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      const q: Pt[] = [[p0[0] + nx * w0, p0[1] + ny * w0], [p1[0] + nx * w1, p1[1] + ny * w1], [p1[0] - nx * w1, p1[1] - ny * w1], [p0[0] - nx * w0, p0[1] - ny * w0]];
      body(pa, id, col, q, 60);
      inkLine(pa, id + 1, q, {color: edge, weight: 0.5, still: true});
    };
    body(pa, 7406, sleeve, ell(J[0], J[1], 40, 40, 16), 60);
    limb(7401, J, E, 36, 28, sleeve);
    body(pa, 7407, sleeve, ell(E[0], E[1], 29, 29, 14), 60);
    limb(7403, E, wr, 28, 23, sleeve);
    limb(7408, [wr[0] + (E[0] - wr[0]) * 0.1, wr[1] + (E[1] - wr[1]) * 0.1], wr, 25, 24, mix(sleeve, '#ffffff', 0.35));
    const ang = Math.atan2(Hd[1] - wr[1], Hd[0] - wr[0]), dl = Math.hypot(Hd[0] - wr[0], Hd[1] - wr[1]);
    const hc2: Pt = [wr[0] + Math.cos(ang) * (dl * 0.5 + 12), wr[1] + Math.sin(ang) * (dl * 0.5 + 12)];
    body(pa, 7405, skinTone, ell(hc2[0], hc2[1], dl * 0.5 + 24, 21, 14, ang), 40);
    inkLine(pa, 7409, ell(hc2[0], hc2[1], dl * 0.5 + 24, 21, 14, ang), {color: mix(INK, SLEEPER.head.skin, 0.4), weight: 0.45, still: true});
    const th: Pt = [hc2[0] + Math.cos(ang - 0.7) * 16 - Math.sin(ang - 0.7) * 2, hc2[1] + Math.sin(ang - 0.7) * 16 + Math.cos(ang - 0.7) * 2];
    body(pa, 7412, skinTone, ell(th[0], th[1], 15, 8, 10, ang - 0.5), 40);
  };
  if (rot < 0.8) paintArm();
  paintBlanket(p, bX, bTop - breath + sink * 0.5, B.feetX, s.jump ?? 0, 70 * rot, 1 - clamp01(rot * 2));
  // the bed pillow comes up against her chest (arm over it is painted below)
  const pc = T(185, 128);
  if (hug > 0) {
    const px = R.pillow.x + (pc[0] - R.pillow.x) * e, py = R.pillow.y + (pc[1] - R.pillow.y) * e;
    const rx = 140 - 78 * e, ry = 46 + 52 * e;
    const pil = blob(210, px, py, rx, ry, 0);
    body(p, 211, NIGHT.linen, pil, 50);
    // modelled so it reads as a pillow, not a plate: shade low and on the far side, squeezed corners, a seam and creases where the arm presses
    glaze(p, 7420, mix(NIGHT.linen, '#5a6ea8', 0.55), 170 * e, [[px - rx * 0.9, py + ry * 0.2], [px + rx * 0.9, py + ry * 0.1], [px + rx * 0.7, py + ry * 0.85], [px - rx * 0.7, py + ry * 0.9]], {bleed: 0.3, border: 0.1});
    glaze(p, 7421, mix(NIGHT.linen, '#fff8ee', 0.6), 120 * e, [[px - rx * 0.5, py - ry * 0.8], [px + rx * 0.2, py - ry * 0.85], [px + rx * 0.1, py - ry * 0.3], [px - rx * 0.5, py - ry * 0.3]], {bleed: 0.3, border: 0.1});
    inkLine(p, 213, pil, {color: mix(INK, NIGHT.linen, 0.45), weight: 0.55, still: true});
    if (e > 0.5) {
      inkLine(p, 7422, [[px - rx * 0.1, py - ry * 0.9], [px + rx * 0.05, py - ry * 0.3], [px - rx * 0.12, py + ry * 0.35]], {color: mix(INK, NIGHT.linen, 0.55), weight: 0.45, closed: false, curve: 0.5, still: true});
      inkLine(p, 7423, [[px + rx * 0.45, py - ry * 0.7], [px + rx * 0.3, py - ry * 0.45]], {color: mix(INK, NIGHT.linen, 0.55), weight: 0.4, closed: false, still: true});
    }
  }
  if (rot >= 0.8) paintArm();
};

// ------------------------------------------------------------------ LF02 dream cliff (VD04; first shot S01-B03-SH02)

export const CLIFF = {U: 280, lipY: 790, lipX: 640, figX: 560} as const;

const cloudPuff = (p: Painter, seed: number, x: number, y: number, rx: number, ry: number, color: string, op: number) =>
  washAt(p, seed, color, op, blob(seed, x, y, rx, ry, 0), 0.65, 0.45);

/** LF02 v2 depth colours: cool, pale far clouds below and the dark gap straight under the ledge (viewer check v1 fix 3). */
const DEPTH = {abyss: '#7d78b4', gap: '#4a4488', far: '#c9cbe6', farHi: '#e4e4f2'} as const;

/** A pencil construction line (HB, still): the drawing under the paint. */
const pencil = (p: Painter, id: number, pts: Pt[], weight = 1.3, color = '#8a6f86') => {
  p.inkStill(id, 'HB', color, weight);
  p.brush.spline(pts, 0.45);
};

/** Dry-brush drag: broken strokes of `color` along a contour, offset across it (`offsets`, px), with bare paper between them
 * (lengths and gaps from `hash`, so they hold still). `weight` is the marker weight. */
const dryBrush = (p: Painter, id: number, color: string, pts: Pt[], weight: number, offsets: number[]) =>
  offsets.forEach((o, i) => {
    const n = 3;
    for (let j = 0; j < n; j++) {
      const u0 = j / n + 0.08 * hash(id * 31 + i * 7 + j), u1 = u0 + (0.45 + 0.45 * hash(id * 17 + i * 5 + j)) / n;
      const at = (u: number): Pt => {
        const f = Math.min(0.999, u) * (pts.length - 1), k = Math.floor(f), r = f - k;
        return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * r, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * r + o];
      };
      p.inkStill(id * 50 + i * 10 + j, 'marker', color, weight * (0.7 + 0.5 * hash(id + i * 13 + j)));
      p.brush.spline([at(u0), at((u0 + Math.min(1, u1)) / 2), at(Math.min(1, u1))], 0.5);
    }
  });

/** Back of a bowed head, LF02 v3 (v5 fixes from viewer-check-lf-v3), from the construction sheet in build notes ("LF02 v3 bowed-head
 * construction sheet"): the skull tilted forward seen from behind. The crown sits inside the mass and the strands radiate from it (no
 * dot); the side hair falls forward as two curtains closed to an inner edge of ±0.3 K and hanging lower than the back hair, which ends
 * at a short, slightly uneven nape hem; under it only deep hair shadow (no skin read). v5: the whole head is rolled `ROLL` toward the
 * cliff edge about the nape and its top flattened, so the crown takes more of the shape. Shoulders nearer the camera than the head
 * overlap the curtain ends; a crew collar band and a centre back seam say "back of a shirt". Draws the whole head over the rig's
 * back-view head (an underlay hidden by it, `a.head` 0.15 K below this head's centre) and neck. `K` px per head unit. */
const paintBowedHeadBack = (p: Painter, a: FigAnchors, K: number, shirt: string, hair: string, o: {roll?: number; dip?: number} = {}) => {
  const hc: Pt = [a.head[0], a.head[1] - 0.15 * K + (o.dip ?? 0) * K];
  const shY = (a.rShoulder[1] + a.lShoulder[1]) / 2, sx = Math.abs(a.rShoulder[0] - a.lShoulder[0]) / 2;
  const ROLL = ((o.roll ?? 6) * Math.PI) / 180, piv: Pt = [0, 0.95], cR = Math.cos(ROLL), sR = Math.sin(ROLL);
  const P = ([u, v]: Pt): Pt => {
    const du = u - piv[0], dv = v - piv[1];
    return [hc[0] + (piv[0] + du * cR - dv * sR) * K, hc[1] + (piv[1] + du * sR + dv * cR) * K];
  };
  const Q = (pts: Pt[]) => pts.map(P);
  const shade = mix(hair, '#4a3c64', 0.26); // deep shadow under the hair: neck in shade, never skin-pink
  // the notch under the nape hem, filled in the shadow tone from the hair down to the collar
  hardFill(p, 381, shade, Q([[-0.42, 0.62], [0.42, 0.62], [0.36, 1.0], [0.36, 1.38], [-0.36, 1.38], [-0.36, 1.0]]));
  // hair silhouette: a flatter dome (head tipped forward), widening sides, curtains hanging low to an inner edge of ±0.3 K, and a short,
  // slightly uneven back hem between them
  const dome: Pt[] = Array.from({length: 17}, (_, i): Pt => {
    const ang = Math.PI + (i / 16) * Math.PI;
    return [1.14 * Math.cos(ang), -0.04 + 1.0 * Math.sin(ang)];
  });
  const right: Pt[] = [[1.2, 0.3], [1.19, 0.8], [1.08, 1.1], [0.76, 1.15], [0.44, 1.1], [0.3, 1.0]];
  const left = right.slice().reverse().map(([u, v]): Pt => [-u, v + (u > 1 ? 0 : 0.02)]);
  const hem: Pt[] = [[0.24, 0.88], [0.15, 0.91], [0.06, 0.85], [-0.03, 0.9], [-0.13, 0.86], [-0.23, 0.91]];
  const hairPts: Pt[] = [...dome, ...right, ...hem, ...left];
  hardFill(p, 382, hair, Q(hairPts));
  // the curtains' inner edges catch a little light where they fall in front of the shaded nape
  inkLine(p, 383, Q([[0.62, 0.5], [0.4, 0.86], [0.3, 1.0]]), {color: mix(hair, '#d2c4e2', 0.2), weight: 0.6, curve: 0.5, closed: false, still: true});
  inkLine(p, 388, Q([[-0.62, 0.5], [-0.4, 0.88], [-0.3, 1.02]]), {color: mix(hair, '#857c9e', 0.2), weight: 0.6, curve: 0.5, closed: false, still: true});
  // strands radiate from the crown, which sits lower inside the mass than in v3: up and over the top edge, sideways then down the
  // curtains, down to the nape hem; lighter on the lit (right) half
  const cr: Pt = [0.08, -0.24];
  for (let i = 0; i < 18; i++) {
    const ang = -Math.PI / 2 + (i / 18) * 2 * Math.PI + 0.1, c = Math.cos(ang), sn = Math.sin(ang);
    let m: Pt, e: Pt;
    if (sn > 0.35) { m = [cr[0] + 0.32 * c, 0.3]; e = [cr[0] + 0.3 * c, 0.84]; }
    else if (sn < -0.35) { m = [cr[0] + 0.5 * c, -0.66]; e = [cr[0] + 0.85 * c, -0.9 + 0.2 * c * c]; }
    else { const sd = c > 0 ? 1 : -1; m = [sd * 0.92, -0.05 + 0.3 * sn]; e = [sd * (0.84 + 0.1 * hash(396 + i)), 1.04]; }
    const p0: Pt = [cr[0] + 0.1 * c, cr[1] + 0.08 * sn], lit = (p0[0] + e[0]) / 2 > 0.05;
    inkLine(p, 400 + i, Q([p0, m, e]), {color: mix(hair, lit ? '#d2c4e2' : '#857c9e', lit ? 0.4 : 0.26), weight: lit ? 0.8 : 0.6, curve: 0.5, closed: false, still: true});
  }
  // the uneven nape hem: a few short lighter strand tips at the bottom of the back hair, over the shade
  hem.forEach(([u, v], i) => inkLine(p, 393 + i, Q([[u + 0.03, v - 0.26], [u + 0.01, v - 0.1], [u, v + 0.01]]), {color: mix(hair, '#d2c4e2', u > 0 ? 0.45 : 0.3), weight: 0.8, curve: 0.5, closed: false, still: true}));
  inkLine(p, 389, Q(hairPts), {color: mix(INK, hair, 0.3), weight: 0.8, still: true});
  // shoulders and collar (sheet 7): nearer the camera than the head, over the curtain ends; shallow U collar; slope into the arms.
  const w = sx + 0.42 * K, hx = hc[0];
  const S = (u: number, dy: number): Pt => [hx + u * K, shY + dy * K];
  const sw = w / K, cyv = (hc[1] + 1.2 * K - shY) / K; // collar dip below the shoulder line
  const back: Pt[] = [
    S(-0.55, 1.9), S(-(sw - 0.1), 0.55), S(-(sw - 0.05), 0.5), S(-(sw - 0.22), 0.28), S(-0.98, 0.08), S(-0.7, 0.1), S(-0.34, cyv - 0.04), S(0, cyv),
    S(0.34, cyv - 0.04), S(0.7, 0.1), S(0.98, 0.08), S(sw - 0.22, 0.28), S(sw - 0.05, 0.5), S(sw - 0.1, 0.55), S(0.55, 1.9),
  ];
  const tone = toneOf(shirt, PAPER_LIGHT);
  // v5 (viewer check v3 fix 4): opaque only across the shoulder tops (it must hide the rig neck); below, a wash that lets the rig's
  // painted shirt through and fades out, with the light from the upper right and a cool shadow down the left side
  const cap: Pt[] = [S(-(sw - 0.14), 1.05), ...back.slice(1, 14), S(sw - 0.14, 1.05)];
  p.flat(tone, cap);
  solid(p, 385, tone, cap, 3, 0.08, 0.25);
  washAt(p, 390, tone, 150, back, 0.08, 0.5);
  washAt(p, 391, mix(tone, '#4a3c70', 0.35), 95, [S(-(sw - 0.05), 0.5), S(-0.2, 0.3), S(-0.1, 1.9), S(-0.55, 1.9)], 0.08, 0.5);
  // the hair's shadow on the shoulder tops beside the neck
  washAt(p, 386, mix(tone, '#3a3060', 0.35), 120, [S(-0.98, 0.06), S(-0.42, cyv - 0.06), S(0.42, cyv - 0.06), S(0.98, 0.06), S(0.9, 0.34), S(-0.9, 0.34)], 0.2, 0.3);
  inkLine(p, 387, back.slice(1, 6), {color: mix(INK, tone, 0.5), weight: 0.8, curve: 0.5, closed: false, still: true});
  inkLine(p, 384, back.slice(9, 14), {color: mix(INK, tone, 0.5), weight: 0.8, curve: 0.5, closed: false, still: true});
  // crew collar band: the pale rib line and a darker stitch line just under it, then the centre back seam running down from it
  inkLine(p, 379, back.slice(5, 10), {color: '#efe6f6', weight: 1.4, curve: 0.6, closed: false, still: true});
  inkLine(p, 378, back.slice(5, 10).map(([x, y]): Pt => [x, y + 0.09 * K]), {color: mix(tone, INK, 0.3), weight: 0.6, curve: 0.6, closed: false, still: true});
  inkLine(p, 377, [S(0, cyv + 0.12), S(0.01, cyv + 0.6), S(0.02, 1.15)], {color: mix(tone, INK, 0.4), weight: 0.8, curve: 0.5, closed: false, still: true});
  inkLine(p, 376, [S(0.02, 1.3), S(0.03, 1.7)], {color: mix(tone, INK, 0.3), weight: 0.6, curve: 0.5, closed: false, still: true});
};

/** The sleeper from behind at the lip, head bowed to look down into the drop (back view, P01 arms, slight lean; LF02 v3 head). */
export type DreamerOpts = {lean?: number; roll?: number; dip?: number};
const paintDreamer = (p: Painter, t: number, g: Pt, o: DreamerOpts = {}): FigAnchors => {
  // construction sheet 7: shoulders wider than the hair for this shot (cast shoulder 0.34 -> 0.42)
  const fig = {...SLEEPER, outfit: {...SLEEPER.outfit, shoulder: 0.42}};
  const a = drawFigure(p, fig, g, CLIFF.U, {...poseFor('P01', fig, g, CLIFF.U, 'front'), view: 'back', lean: o.lean ?? 0.1, nod: [-0.18, -1.02], face: EXPRESSIONS.neutral, light: PAPER_LIGHT}, t);
  const K = (a.head[1] - a.headTop) / 1.17;
  paintBowedHeadBack(p, a, K, fig.outfit.shirt, fig.head.hair, {roll: o.roll, dip: o.dip});
  // v5 (viewer check v3, feet): seen from behind, the trouser hems fall over the feet and only two narrow heels show under them. The
  // rig's front-view foot ovals are first painted out in the ledge's local tone (sampled on the v3 render), then a contact shadow, the
  // heel and the hem. Foot centres measured on the v3 render: ±0.46 K from `a.feet`, 0.13 K above it.
  const pants = toneOf(fig.outfit.pants, PAPER_LIGHT);
  ([-1, 1] as const).forEach((sd, i) => {
    const x = a.feet[0] + sd * 0.46 * K, y = a.feet[1] - 0.13 * K;
    const ground = sd < 0 ? '#dcc4c3' : '#dcd2d2', cover = ell(x, y + 0.01 * K, 0.39 * K, 0.21 * K, 16);
    p.flat(ground, cover);
    washAt(p, 420 + i, ground, 120, ell(x, y + 0.01 * K, 0.4 * K, 0.23 * K, 16), 0.1, 0.4);
    washAt(p, 428 + i, mix(DEPTH.far, DEPTH.abyss, 0.5), 120, ell(x + 0.04 * K, y + 0.16 * K, 0.3 * K, 0.07 * K, 14), 0.1, 0.3);
    hardFill(p, 422 + i, mix(fig.head.skin, '#8a7090', 0.15), ell(x, y + 0.07 * K, 0.17 * K, 0.1 * K, 14));
    hardFill(p, 424 + i, mix(pants, '#4a3c70', 0.08), [[x - 0.23 * K, y - 0.3 * K], [x + 0.23 * K, y - 0.3 * K], [x + 0.26 * K, y + 0.03 * K], [x - 0.26 * K, y + 0.03 * K]]);
    inkLine(p, 426 + i, [[x - 0.26 * K, y + 0.03 * K], [x + 0.26 * K, y + 0.03 * K]], {color: mix(INK, pants, 0.5), weight: 0.6, closed: false, still: true});
  });
  return a;
};

/** LF02 v2: the cloud world, made of the same paint as the bedroom wall; a half-painted cliff ledge whose near end and lip break
 * into dry brush, bare paper and the pencil drawing under it; a long drop to small, pale, cool clouds far below. */
export type CliffOpts = DreamerOpts & {figure?: boolean; dy?: number; /** 0..1 strength of the ledge and its pencil drawing (B03-SH01: the cliff edge shows in the cloud late). Default full. */ ledge?: number};
export const paintDreamCliff = (p: Painter, t: number, o: CliffOpts = {}): FigAnchors | undefined => {
  const D = DREAM, C = CLIFF;
  p.flat(D.top, wide(-120, HGT + 120));
  // sky above the horizon (y ~760): pale top, rose-peach band; below it the drop cools to lilac, darkest under the ledge
  washAt(p, 300, D.peach, 120, wide(260, 700), 0.6, 0.4);
  washAt(p, 301, D.rose, 100, wide(560, 900), 0.6, 0.45);
  washAt(p, 302, DEPTH.far, 150, wide(820, 1300), 0.6, 0.45);
  washAt(p, 303, DEPTH.abyss, 130, wide(1150, HGT + 120), 0.6, 0.45);
  washAt(p, 304, mix(DEPTH.abyss, DEPTH.gap, 0.5), 110, wide(1550, HGT + 120), 0.6, 0.4);
  // far cloud banks behind her, warm, at the horizon
  [[160, 300, 260, 70], [820, 240, 300, 80], [520, 470, 380, 70], [960, 640, 260, 90]].forEach(([x, y, rx, ry], i) => cloudPuff(p, 310 + i, x, y, rx, ry, D.cloud, 200));
  [[880, 760, 240, 50], [300, 770, 200, 40]].forEach(([x, y, rx, ry], i) => cloudPuff(p, 316 + i, x, y, rx, ry, mix(D.rose, D.cloud, 0.5), 130));
  // the dark gap straight under the ledge: a cool shadowed column beside the cliff face
  washAt(p, 318, DEPTH.gap, 120, [[C.lipX - 20, C.lipY + 20], [C.lipX + 200, C.lipY + 50], [C.lipX + 230, C.lipY + 420], [C.lipX + 100, C.lipY + 640], [C.lipX - 120, C.lipY + 560]], 0.2, 0.4);
  washAt(p, 319, mix(DEPTH.gap, '#2e2a60', 0.4), 90, [[C.lipX, C.lipY + 40], [C.lipX + 110, C.lipY + 70], [C.lipX + 130, C.lipY + 320], [C.lipX + 20, C.lipY + 420]], 0.2, 0.35);
  // the cloud sea far below: small, pale, cool puffs, smaller and paler toward the horizon line (rows est by depth)
  const rows: [number, number, number, number][] = [[880, 70, 16, 210], [960, 90, 20, 190], [1080, 120, 26, 170], [1260, 150, 32, 150], [1520, 190, 40, 130], [1800, 230, 48, 120]];
  rows.forEach(([y, rx, ry, op], r) => {
    const n = Math.ceil(1300 / (rx * 2.4));
    for (let i = 0; i < n; i++) {
      const x = -100 + (i + 0.5 * (r % 2)) * rx * 2.4 + (hash(390 + r * 40 + i) - 0.5) * rx;
      // keep the gap under the ledge clear in the near rows
      if (r < 4 && x > C.lipX - 80 && x < C.lipX + 260) continue;
      const k = 0.7 + 0.5 * hash(391 + r * 40 + i);
      const cy = y + (hash(392 + r * 40 + i) - 0.5) * ry, sd = 400 + r * 40 + i;
      // a small cumulus: a flat base and two or three bumps, lit pale on top, cooler underneath
      washAt(p, sd, mix(DEPTH.far, DEPTH.abyss, 0.25), op, ell(x, cy + 0.25 * ry * k, rx * k, 0.45 * ry * k, 14), 0.15, 0.3);
      [[-0.45, 0.55], [0.05, 0.75], [0.5, 0.5]].forEach(([dx, s2], j) => washAt(p, sd + 2000 + j, r < 2 ? DEPTH.farHi : mix(DEPTH.farHi, DEPTH.far, 0.4), op + 30, ell(x + dx * rx * k, cy - 0.1 * ry * k, s2 * rx * k * 0.6, s2 * ry * k * 1.1, 12), 0.12, 0.3));
    }
  });
  const q = o.ledge === undefined ? p : p.layer(o.ledge, 9100);
  // ink does not follow a layer's alpha, so the pencil lines wait until the ledge is half there and fade in toward the paper (W5.2 repaint)
  const la = o.ledge ?? 1, penOn = la >= 0.25, penTone = mix(D.top, '#8a6f86', Math.min(1, (la - 0.2) / 0.5));
  // ---- the ledge. The whole rock is first bare paper (its unpainted part stays paper against the drop), fading out at the bottom.
  const rock: Pt[] = [[-140, C.lipY - 30], [200, C.lipY - 40], [460, C.lipY - 26], [C.lipX, C.lipY - 6], [C.lipX + 18, C.lipY + 8], [C.lipX - 10, C.lipY + 120], [C.lipX - 60, C.lipY + 260], [480, C.lipY + 420], [330, C.lipY + 620], [160, C.lipY + 760], [-60, C.lipY + 860], [-140, C.lipY + 880]];
  q.flat(D.top, rock);
  // the lower rock fades into the drop: cool washes over the paper, stronger toward the bottom (no hard bottom edge)
  washAt(q, 338, DEPTH.far, 150, [[-140, C.lipY + 480], [420, C.lipY + 470], [480, C.lipY + 420], [330, C.lipY + 620], [160, C.lipY + 760], [-60, C.lipY + 860], [-140, C.lipY + 880]], 0.35, 0.4);
  washAt(q, 337, mix(DEPTH.far, DEPTH.abyss, 0.4), 190, [[-140, C.lipY + 640], [300, C.lipY + 650], [160, C.lipY + 760], [-60, C.lipY + 860], [-140, C.lipY + 880]], 0.4, 0.4);
  // Painted part: the far (left) end of the top face and the upper cliff face.
  const topPaint: Pt[] = [[-140, C.lipY - 30], [200, C.lipY - 40], [380, C.lipY - 30], [430, C.lipY - 18], [400, C.lipY + 6], [-140, C.lipY + 20]];
  washAt(q, 340, mix(D.cliff, '#ffffff', 0.25), 250, topPaint, 0.05, 0.4);
  const face: Pt[] = [[-140, C.lipY + 10], [400, C.lipY + 6], [430, C.lipY + 90], [380, C.lipY + 260], [300, C.lipY + 400], [200, C.lipY + 450], [120, C.lipY + 540], [40, C.lipY + 500], [-40, C.lipY + 600], [-140, C.lipY + 580]];
  washAt(q, 341, D.cliff, 235, face, 0.2, 0.6);
  washAt(q, 342, D.cliffDark, 160, [[-140, C.lipY + 30], [300, C.lipY + 40], [380, C.lipY + 70], [340, C.lipY + 240], [200, C.lipY + 380], [-140, C.lipY + 420]], 0.3, 0.5);
  // the paint thins out toward the lip: dry-brush drags along the top face and down the face, bare paper between them
  dryBrush(q, 343, mix(D.cliff, '#ffffff', 0.2), [[360, C.lipY - 26], [470, C.lipY - 22], [560, C.lipY - 14]], 2.8, [-8, 6, 20]);
  dryBrush(q, 346, D.cliff, [[400, C.lipY + 30], [480, C.lipY + 40], [560, C.lipY + 36]], 2.8, [0, 20, 42]);
  dryBrush(q, 349, D.cliff, [[420, C.lipY + 120], [470, C.lipY + 140], [520, C.lipY + 130]], 2.6, [0, 22]);
  dryBrush(q, 351, D.cliffDark, [[300, C.lipY + 330], [360, C.lipY + 300], [410, C.lipY + 230]], 2.6, [0, 20]);
  dryBrush(q, 353, D.cliff, [[150, C.lipY + 560], [240, C.lipY + 500], [300, C.lipY + 440]], 2.6, [0, 22]);
  // ---- the pencil drawing under the paint: the lip and the cliff face carry on past the paint as construction lines
  const lip: Pt[] = [[-140, C.lipY - 30], [200, C.lipY - 40], [460, C.lipY - 26], [C.lipX, C.lipY - 6], [C.lipX + 18, C.lipY + 8]];
  const edge: Pt[] = [[C.lipX + 18, C.lipY + 8], [C.lipX - 10, C.lipY + 120], [C.lipX - 60, C.lipY + 260], [480, C.lipY + 420], [330, C.lipY + 620], [160, C.lipY + 760], [-60, C.lipY + 860]];
  if (penOn) inkLine(q, 360, lip.slice(0, 3), {color: mix(penTone, mix(INK, D.cliff, 0.5), la >= 0.99 ? 1 : 0), weight: 0.6, closed: false, still: true}); // inked only where painted
  const pen = (id: number, pts: Pt[], w: number) => void (penOn && pencil(q, id, pts, w, penTone));
  pen(361, lip.slice(2), 1.5);
  pen(362, edge, 1.4);
  pen(363, edge.map(([x, y]): Pt => [x - 6, y + 4]), 0.9); // the second, searching line of a sketch
  // strata (v3, viewer check v2 fix 4): no ruled dashes; three broken contours that follow the cliff face, each bending down toward the
  // edge like the rock turning away, different lengths, a gap in each, fading out lower down
  ([[C.lipY + 70, 1.0, 0], [C.lipY + 200, 0.85, 1], [C.lipY + 350, 0.7, 2]] as const).forEach(([y, w, i]) => {
    const x1 = C.lipX - 40 - i * 75, x0 = x1 - 210 + i * 30;
    const curve = (u0: number, u1: number): Pt[] => [0, 0.5, 1].map((f): Pt => {
      const u = u0 + (u1 - u0) * f;
      return [x0 + (x1 - x0) * u, y - 18 * Math.sin(Math.PI * u * 0.8) + 34 * u * u + 10 * (hash(364 + i) - 0.5)];
    });
    pen(374 + i * 2, curve(0, 0.42 + 0.1 * i), w);
    pen(375 + i * 2, curve(0.58 + 0.08 * i, 1), w * 0.8);
  });
  // the near lip from above: the front edge of the top face, drawn only
  pen(369, [[460, C.lipY - 10], [C.lipX - 10, C.lipY + 4], [C.lipX + 16, C.lipY + 10]], 1.1);
  const a = o.figure === false ? undefined : paintDreamer(p, t, [C.figX, C.lipY - 14 + (o.dy ?? 0)], o);
  // a thin wisp drifting past far below the lip (small: it is far away)
  cloudPuff(p, 370, 860, 1180, 120, 26, DEPTH.farHi, 120);
  return a;
};

// ------------------------------------------------------------------ paper ground shared by LF03, LF04, LF05

export const paintPaperGround = (p: Painter, seed: number, tint?: string) => {
  p.flat(IDEA.paper, wide(-120, HGT + 120));
  washAt(p, seed, IDEA.paperShade, 110, blob(seed, 540, 1400, 760, 600, 0), 0.7, 0.55);
  washAt(p, seed + 1, '#f6efe2', 140, blob(seed + 1, 520, 620, 520, 460, 0), 0.7, 0.5);
  if (tint) washAt(p, seed + 2, tint, 70, blob(seed + 2, 540, 900, 700, 900, 0), 0.7, 0.5);
};

/** A brush "?" (the one glyph the brief allows): hook, stem and dot, scale `s` px per unit. */
export const paintQuestion = (p: Painter, seed: number, x: number, y: number, s: number, color: string, weight: number) => {
  // hook: an arc from the left (160 deg) over the top to the lower right (-50 deg), then the neck curving into a short stem
  const r = 0.3 * s, cy = y - 0.52 * s;
  const hook: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = (Math.PI / 180) * (160 - 210 * (i / 12));
    hook.push([x + r * Math.cos(a), cy - r * Math.sin(a)]);
  }
  hook.push([x + 0.04 * s, y - 0.12 * s], [x, y + 0.02 * s], [x, y + 0.12 * s]);
  p.inkStill(seed, 'marker', color, weight);
  p.brush.spline(hook, 0.5);
  washAt(p, seed + 1, color, 230, ell(x, y + 0.34 * s, 0.07 * s, 0.07 * s, 14), 0.1, 0.3);
};

/** LF03: the idea space (VD07; first shot S01-B05-SH01): she sits on the bed edge on warm paper, head tilted; a big "?" behind her. */
export type IdeaOpts = {
  /** Big "?" behind her, 0 (absent) .. 1 (look frame). Default 1. */
  q?: number;
  /** Head tilt to think, 0..1 (1 = LF03). Default 1. */
  tilt?: number;
  /** Ground point and px per metre; default the look frame (480, 1360) and 520. The wide shots use a smaller figure. */
  g?: Pt;
  U?: number;
};
export const paintIdeaSpace = (p: Painter, t: number, o: IdeaOpts = {}): FigAnchors => {
  const I = IDEA;
  paintPaperGround(p, 400);
  const U = o.U ?? 520;
  const g: Pt = o.g ?? [480, 1360];
  const q = o.q ?? 1, tilt = o.tilt ?? 1;
  const seat = chairSpec(SLEEPER, 'front').seatV;
  const seatY = g[1] - seat * U;
  // the big "?" behind her, upper right: a soft violet wash under the brush mark (above her eye line, clear of the head)
  if (q > 0.02) {
    washAt(p, 410, I.violetSoft, 80 * q, blob(410, 800, 420 - 80 * q, 200 * q, 220 * q, 0), 0.6, 0.5);
    paintQuestion(p, 411, 800, 420 + 90 * (1 - q), 380 * q, I.violet, 8 * Math.max(0.4, q));
  }
  // bed edge vignette (a set reduced to the bed): pillow and mattress top behind her, mattress side, base; both ends wash into paper
  const top = seatY - 54;
  const matTop: Pt[] = [[40, top + 10], [70, top], [1010, top], [1040, top + 10], [1040, seatY + 4], [40, seatY + 4]];
  body(p, 420, mix(I.mattress, '#ffffff', 0.25), matTop, 50);
  const side: Pt[] = [[40, seatY], [1040, seatY], [1040, seatY + 96], [40, seatY + 96]];
  body(p, 421, I.mattress, side, 70);
  body(p, 422, '#8a7fa8', rectPts(60, seatY + 96, 1020, g[1] - 6), 70);
  const pillow = blob(426, 170, top - 18, 120, 40, 0);
  body(p, 427, '#e4e0f2', pillow, 40);
  inkLine(p, 428, pillow, {color: mix(INK, '#e4e0f2', 0.45), weight: 0.5, still: true});
  // the blanket thrown back at the right end, spilling over the side
  const bl: Pt[] = [[720, top + 4], [800, top - 8], [940, top - 14], [1040, top - 8], [1040, seatY + 150], [960, seatY + 172], [880, seatY + 120], [820, seatY + 40], [760, seatY + 6]];
  body(p, 429, I.blanket, bl, 70);
  inkLine(p, 430, bl, {color: mix(INK, I.blanket, 0.4), weight: 0.5, still: true});
  inkLine(p, 424, [[60, seatY], [1020, seatY]], {color: mix(INK, I.mattress, 0.45), weight: 0.55, closed: false, still: true});
  washAt(p, 425, I.paper, 230, [[-160, top - 80], [90, top - 60], [130, g[1] + 20], [-160, g[1] + 40]], 0.7, 0.5);
  washAt(p, 431, I.paper, 230, [[1000, top - 80], [1240, top - 80], [1240, g[1] + 40], [960, g[1] + 40]], 0.7, 0.5);
  washAt(p, 432, '#cbbfa8', 130, blob(432, g[0], g[1] + 6, 260, 22, 0), 0.4, 0.4); // floor shadow under the feet
  // P31 sit, hands in lap (front), head tilted (nod) and eyes up: thinking
  const pose = poseFor('P31', SLEEPER, g, U, 'front');
  const a = drawFigure(p, SLEEPER, g, U, {...pose, nod: [0.12 * tilt, 0.04 * tilt], face: {...EXPRESSIONS.worried, look: [0.5 * tilt, -0.5 * tilt]}, light: PAPER_LIGHT}, t);
  return a;
};

// ------------------------------------------------------------------ LF04 trigger icons (VD08; S01-B06-SH01 + SH02 end state)

const iconCup = (p: Painter, x: number, y: number) => {
  const body: Pt[] = [[x - 80, y - 60], [x + 80, y - 60], [x + 66, y + 70], [x - 66, y + 70]];
  washAt(p, 500, '#b58466', 240, ell(x, y + 82, 130, 22, 20), 0.2, 0.4); // saucer
  washAt(p, 501, '#e6dccb', 250, body, 0.05, 0.35);
  washAt(p, 502, '#a87a5c', 180, [[x - 80, y - 60], [x + 80, y - 60], [x + 76, y - 18], [x - 76, y - 18]], 0.1, 0.4);
  washAt(p, 503, '#cfbea4', 150, [[x + 20, y - 50], [x + 70, y - 50], [x + 60, y + 64], [x + 30, y + 64]], 0.3, 0.4);
  const handle = ell(x + 92, y - 4, 24, 32, 16);
  inkLine(p, 504, handle, {color: mix(INK, '#e6dccb', 0.3), weight: 1.1, still: true});
  inkLine(p, 505, body, {color: mix(INK, '#e6dccb', 0.25), weight: 0.8, still: true});
  hardFill(p, 506, '#5b3a2a', ell(x, y - 60, 80, 12, 18)); // coffee surface
  for (let i = 0; i < 3; i++) {
    const sx = x - 36 + i * 36;
    p.inkStill(507 + i, 'HB', '#9a8c7c', 1.6);
    p.brush.spline([[sx, y - 84], [sx + 14, y - 118], [sx - 8, y - 150], [sx + 8, y - 184]], 0.6);
  }
};

const iconScribble = (p: Painter, x: number, y: number) => {
  washAt(p, 520, '#d9a9a0', 120, ell(x, y, 110, 104, 20), 0.6, 0.5);
  const pts: Pt[] = [];
  for (let i = 0; i < 70; i++) {
    const a = i * 0.83 + 1.7 * Math.sin(i * 0.37), r = 30 + 70 * (0.5 + 0.5 * Math.sin(i * 1.31 + 0.4)) * (0.6 + 0.4 * hash(520 + i));
    pts.push([x + r * Math.cos(a), y + 0.94 * r * Math.sin(a)]);
  }
  p.inkStill(521, 'rotring', '#8a4d4a', 1.4);
  p.brush.spline(pts, 0.7);
  p.inkStill(522, 'rotring', '#8a4d4a', 1.2);
  p.brush.spline([[x + 90, y + 40], [x + 124, y + 86], [x + 112, y + 130]], 0.6); // loose end
};

const iconMoonClock = (p: Painter, x: number, y: number) => {
  // crescent: a pale disc, then a paper disc bites it
  washAt(p, 540, '#e8d79a', 250, ell(x - 40, y - 40, 74, 74, 24), 0.05, 0.3);
  hardFill(p, 541, IDEA.paper, ell(x - 6, y - 64, 66, 66, 24));
  // clock past midnight: face, rim, hour hand near 2, minute hand at 10 (1:50, no numerals)
  const cx = x + 40, cy = y + 40;
  washAt(p, 542, '#f4ede0', 250, ell(cx, cy, 70, 70, 24), 0.05, 0.3);
  washAt(p, 543, '#7a86b8', 220, [...ell(cx, cy, 82, 82, 24)], 0.05, 0.3);
  washAt(p, 544, '#f4ede0', 255, ell(cx, cy, 66, 66, 24), 0.02, 0.2);
  inkLine(p, 545, ell(cx, cy, 82, 82, 24), {color: mix(INK, '#7a86b8', 0.3), weight: 0.8, still: true});
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    hardFill(p, 546 + i, '#4a4a6a', ell(cx + 54 * Math.sin(a), cy - 54 * Math.cos(a), 4, 4, 8));
  }
  const hand = (seed: number, ang: number, len: number, w: number) => {
    p.inkStill(seed, 'rotring', INK, w);
    p.brush.line(cx, cy, cx + len * Math.sin(ang), cy - len * Math.cos(ang));
  };
  hand(560, (1.83 / 12) * Math.PI * 2, 34, 2.2);
  hand(561, (50 / 60) * Math.PI * 2, 50, 1.5);
};

/** Dumbbell v2 (viewer check LF04 note): round plates seen at a three-quarter angle, a grip bar between them and a floor shadow,
 * so it no longer reads as the letter "H". */
const iconDumbbell = (p: Painter, x: number, y: number) => {
  const steel = '#5f6a86', steelHi = '#9aa3bd', steelDark = '#3f475e';
  washAt(p, 590, '#cbbfa8', 150, ell(x + 16, y + 60, 178, 16, 20), 0.2, 0.4); // floor shadow under the plates' bottom rims (v3: seated, no gap)
  // grip bar first (behind the near plate), a slight tilt
  const bar: Pt[] = [[x - 92, y - 10], [x + 92, y - 16], [x + 92, y + 8], [x - 92, y + 14]];
  hardFill(p, 580, '#a9afbe', bar);
  washAt(p, 581, '#7d8496', 160, [[x - 92, y + 4], [x + 92, y - 2], [x + 92, y + 8], [x - 92, y + 14]], 0.05, 0.3);
  inkLine(p, 582, bar, {color: mix(INK, '#9aa0b0', 0.3), weight: 0.6, still: true});
  // a plate: the rim band (thickness toward screen left) and the round face (an ellipse foreshortened by the 3/4 angle)
  const plate = (seed: number, px: number, py: number) => {
    const rx = 24, ry = 56, th = 22;
    const back = ell(px - th, py, rx, ry, 24), face = ell(px, py, rx, ry, 24);
    hardFill(p, seed, steelDark, back);
    hardFill(p, seed + 1, steelDark, [[px - th, py - ry], [px, py - ry], [px, py + ry], [px - th, py + ry]]);
    hardFill(p, seed + 2, steel, face);
    washAt(p, seed + 3, steelHi, 170, ell(px - 6, py - 18, rx * 0.55, ry * 0.55, 18), 0.2, 0.4); // light on the face
    hardFill(p, seed + 4, steelDark, ell(px + 2, py, 8, 16, 12)); // hub
    inkLine(p, seed + 5, face, {color: mix(INK, steel, 0.3), weight: 0.7, still: true});
    inkLine(p, seed + 6, [[px - th, py - ry], [px, py - ry]], {color: mix(INK, steel, 0.3), weight: 0.6, closed: false, still: true});
    inkLine(p, seed + 7, [[px - th, py + ry], [px, py + ry]], {color: mix(INK, steel, 0.3), weight: 0.6, closed: false, still: true});
    inkLine(p, seed + 8, ell(px - th, py, rx, ry, 24).filter(([qx]) => qx < px - th), {color: mix(INK, steel, 0.3), weight: 0.6, closed: false, still: true});
  };
  plate(583, x - 70, y + 2);
  plate(593, x + 100, y - 3);
  // knurled grip in the middle of the bar
  for (let i = 0; i < 6; i++) inkLine(p, 603 + i, [[x - 22 + i * 9, y - 10], [x - 25 + i * 9, y + 10]], {color: '#7d8496', weight: 0.5, closed: false, still: true});
};

export type IconState = {
  /** Pop progress per icon, 0 (absent) .. 1 (settled); a plate drives it with an overshoot. */
  cup?: number; scribble?: number; moon?: number; dumbbell?: number;
  /** Strength of the first three once the dumbbell arrives (B06-SH02: 1 -> 0.6). */
  dim?: number;
};
const ICON_AT: [number, number, number][] = [[225, 600, 1.3], [545, 590, 1.3], [860, 600, 1.3], [300, 1460, 1.4]];

/** LF04: the trigger icons on the paper ground: three in a row (SH01) and the dumbbell below-left (SH02). Default: all four at full strength. W5.2: each pops by `IconState`. */
export const paintTriggerIcons = (p: Painter, st: IconState = {}) => {
  paintPaperGround(p, 490);
  const at = (i: number, k: number, alpha: number, draw: (q: Painter) => void) => {
    if (k <= 0.001 || alpha <= 0.001) return;
    const [x, y, k0] = ICON_AT[i];
    const q = p.layer(alpha, 5000 + i * 100);
    q.brush.push();
    q.brush.translate(x, y);
    q.brush.scale(k0 * k);
    draw(q);
    q.brush.pop();
  };
  const dim = st.dim ?? 1;
  const cup = st.cup ?? 1, scr = st.scribble ?? 1, mo = st.moon ?? 1, db = st.dumbbell ?? 1;
  // alpha rides the pop: it is full by 60 % of the pop
  const a = (u: number) => Math.min(1, u / 0.6);
  at(0, cup, a(cup) * dim, (q) => iconCup(q, 0, 0));
  at(1, scr, a(scr) * dim, (q) => iconScribble(q, 0, 0));
  at(2, mo, a(mo) * dim, (q) => iconMoonClock(q, 0, 0));
  at(3, db, a(db), (q) => iconDumbbell(q, 0, 0));
};

// ------------------------------------------------------------------ LF05 doctor vignette (VD09; S01-B07-SH03)

/** LF05 v2 window and its light patch on the wall (plate px). */
export const DOC_WIN = {x0: 40, x1: 330, y0: 170, y1: 640} as const;

/** Stethoscope around the neck, both ends hanging down the chest inside the coat (painted from the rig anchors; Boss: kit gear). */
const paintStethoscope = (p: Painter, a: FigAnchors, U: number) => {
  const hx = a.head[0], sy = (a.rShoulder[1] + a.lShoulder[1]) / 2;
  // a teal tube: dark slate vanished on the black hair in v2 draft 1; teal reads on hair, blouse and coat alike
  const tube = '#2a5f78', metal = '#c9ced8';
  const strand = (id: number, pts: Pt[]) => {
    p.inkStill(id, 'rotring', tube, 9);
    p.brush.spline(pts, 0.6);
    p.inkStill(id + 20, 'HB', mix(tube, '#ffffff', 0.45), 1.2);
    p.brush.spline(pts.map(([x, y]): Pt => [x - 2, y - 1]), 0.6);
  };
  // the loop lies over the collar behind the neck; the two ends hang down the blouse
  strand(649, [[hx - 0.075 * U, sy - 0.035 * U], [hx - 0.03 * U, sy - 0.05 * U], [hx + 0.03 * U, sy - 0.05 * U], [hx + 0.075 * U, sy - 0.035 * U]]);
  strand(650, [[hx - 0.075 * U, sy - 0.035 * U], [hx - 0.1 * U, sy + 0.02 * U], [hx - 0.085 * U, sy + 0.14 * U], [hx - 0.06 * U, sy + 0.24 * U]]);
  strand(651, [[hx + 0.075 * U, sy - 0.035 * U], [hx + 0.1 * U, sy + 0.02 * U], [hx + 0.085 * U, sy + 0.12 * U], [hx + 0.065 * U, sy + 0.18 * U]]);
  const cp: Pt = [hx - 0.06 * U, sy + 0.27 * U];
  hardFill(p, 652, metal, ell(cp[0], cp[1], 0.032 * U, 0.032 * U, 18));
  washAt(p, 653, '#f4f6fa', 220, ell(cp[0] - 0.008 * U, cp[1] - 0.01 * U, 0.014 * U, 0.012 * U, 12), 0.05, 0.2);
  inkLine(p, 654, ell(cp[0], cp[1], 0.032 * U, 0.032 * U, 18), {color: mix(INK, metal, 0.35), weight: 0.9, still: true});
  // ear tubes: a short metal Y with two dark tips
  const y0: Pt = [hx + 0.065 * U, sy + 0.18 * U];
  [[-1, 0.03], [1, 0.035]].forEach(([d, len], i) => {
    const tip: Pt = [y0[0] + d * len * U, y0[1] + 0.075 * U];
    p.inkStill(655 + i, 'rotring', mix(metal, INK, 0.35), 2.8);
    p.brush.spline([y0, [y0[0] + d * 0.012 * U, y0[1] + 0.035 * U], tip], 0.5);
    washAt(p, 657 + i, '#2a2f3a', 250, ell(tip[0], tip[1], 0.009 * U, 0.009 * U, 10), 0.02, 0.1);
  });
};

/** Female torso cues on the open coat (UT08): bust shading on the blouse, the coat fronts pinched at the waist, a belt. */
const paintDoctorTorso = (p: Painter, a: FigAnchors, U: number) => {
  const hx = a.head[0], cy = a.chin;
  const blouse = '#d9a3a6', coat = '#f2f0ea';
  const bustY = cy + 0.33 * U;
  // soft under-bust shade (two crescents) and a light top on the blouse strip
  [-1, 1].forEach((d, i) => {
    glaze(p, 660 + i, mix(blouse, '#6a3a44', 0.35), 160, [[hx + d * 0.005 * U, bustY - 0.01 * U], [hx + d * 0.06 * U, bustY - 0.025 * U], [hx + d * 0.075 * U, bustY + 0.01 * U], [hx + d * 0.04 * U, bustY + 0.03 * U], [hx + d * 0.005 * U, bustY + 0.02 * U]], {bleed: 0.25, border: 0.1});
    p.inkStill(662 + i, 'HB', mix(blouse, INK, 0.5), 1.6);
    p.brush.spline([[hx + d * 0.075 * U, bustY - 0.04 * U], [hx + d * 0.06 * U, bustY + 0.005 * U], [hx + d * 0.02 * U, bustY + 0.012 * U]], 0.6);
  });
  // waist: the coat fronts fall in over the blouse at the waist (hourglass gap), a thin belt where the blouse is tucked in
  const wy = cy + 0.5 * U;
  [-1, 1].forEach((d, i) => {
    const pts: Pt[] = [[hx + d * 0.1 * U, bustY + 0.04 * U], [hx + d * 0.07 * U, bustY + 0.06 * U], [hx + d * 0.035 * U, wy], [hx + d * 0.06 * U, wy + 0.14 * U], [hx + d * 0.1 * U, wy + 0.16 * U]];
    washAt(p, 664 + i, coat, 245, pts, 0.03, 0.2);
    inkLine(p, 666 + i, pts.slice(0, 4), {color: mix(INK, coat, 0.6), weight: 0.5, closed: false, still: true});
  });
};

/** LF05 v2: the doctor in a pale vignette with soft window light from the upper left; medium front, knees up. */
export const paintDoctor = (p: Painter, t: number, o: {nod?: number; rise?: number} = {}): FigAnchors => {
  paintPaperGround(p, 600, '#d9e6e2');
  const w = DOC_WIN;
  // soft daylight patch thrown on the wall to the right of the window, two panes, falling toward her shoulder (UT04)
  const patch: Pt[] = [[w.x1 + 30, w.y0 + 90], [w.x1 + 250, w.y0 + 160], [w.x1 + 300, w.y1 + 240], [w.x1 + 70, w.y1 + 150]];
  glaze(p, 617, '#fdf6e2', 200, patch, {bleed: 0.25, border: 0.1});
  glaze(p, 618, mix('#d9e6e2', '#9fb4ae', 0.4), 70, [[w.x1 + 150, w.y0 + 130], [w.x1 + 166, w.y0 + 134], [w.x1 + 196, w.y1 + 196], [w.x1 + 180, w.y1 + 192]], {bleed: 0.1});
  // window: frame, bright morning glass with a pale sky, a sheer curtain at the left, mullions, sill
  hardFill(p, 609, '#c9d3cf', rectPts(w.x0 - 16, w.y0 - 20, w.x1 + 16, w.y1 + 6));
  body(p, 610, '#f6f3e6', rectPts(w.x0 + 4, w.y0, w.x1 - 4, w.y1 - 4), 30);
  washAt(p, 615, '#cfe2ea', 170, rectPts(w.x0 + 4, w.y0, w.x1 - 4, w.y0 + 220), 0.1, 0.3);
  washAt(p, 619, '#b9d0a8', 120, [[w.x0 + 4, w.y1 - 120], [120, w.y1 - 150], [220, w.y1 - 130], [w.x1 - 4, w.y1 - 160], [w.x1 - 4, w.y1 - 4], [w.x0 + 4, w.y1 - 4]], 0.2, 0.4); // far trees
  hardFill(p, 611, '#c9d3cf', rectPts((w.x0 + w.x1) / 2 - 7, w.y0, (w.x0 + w.x1) / 2 + 7, w.y1));
  hardFill(p, 612, '#c9d3cf', rectPts(w.x0, (w.y0 + w.y1) / 2 - 7, w.x1, (w.y0 + w.y1) / 2 + 7));
  hardFill(p, 616, '#bfc9c5', rectPts(w.x0 - 30, w.y1 + 4, w.x1 + 30, w.y1 + 26));
  washAt(p, 630, '#f4efe4', 170, [[w.x0 - 10, w.y0 - 30], [w.x0 + 90, w.y0 - 30], [w.x0 + 60, w.y1 + 10], [w.x0 - 30, w.y1 + 30]], 0.3, 0.3); // sheer curtain
  // light fall across the floor and the figure from the window (very faint)
  washAt(p, 613, '#fbf7ea', 80, [[w.x0, w.y1], [w.x1, w.y1], [900, 1700], [420, 1760]], 0.6, 0.4);
  // a plant on a shelf at the right: a friendly clinic, not an emergency
  washAt(p, 620, '#c7b79c', 220, rectPts(800, 760, 1100, 784), 0.1, 0.3);
  washAt(p, 621, '#b9866a', 240, [[880, 690], [960, 690], [950, 760], [890, 760]], 0.1, 0.35);
  [[-0.6, 90], [-0.2, 120], [0.3, 110], [0.7, 80]].forEach(([a, len], i) =>
    washAt(p, 622 + i, i % 2 ? '#86a888' : '#9dbaa0', 230, ell(920 + Math.sin(a) * len * 0.6, 690 - Math.cos(a) * len * 0.6, 22, len * 0.45, 12, a), 0.2, 0.4),
  );
  const U = 980;
  const g: Pt = [540, 1940];
  // soft smile: closed full lips (kit `full` look mouth draws on a flat mouth), lifted at the corners below
  const a = drawFigure(p, DOCTOR, g, U, {...poseFor('P01', DOCTOR, g, U, 'front'), nod: [0, -(o.nod ?? 0)], rise: o.rise, face: {...EXPRESSIONS.happy, mouth: 'flat'}, light: PAPER_LIGHT}, t);
  const [hx, hy] = a.head;
  const K = (hy - a.headTop) / 1.17;
  const F = ([u, v]: Pt): Pt => [hx + u * K, hy + v * K];
  [-1, 1].forEach((d, i) => inkLine(p, 640 + i, [F([d * 0.21, 0.6]), F([d * 0.26, 0.565]), F([d * 0.29, 0.53])], {color: mix(INK, '#a4504a', 0.3), weight: 1.1, closed: false, still: true}));
  [-1, 1].forEach((d, i) => washAt(p, 642 + i, '#e79a8f', 70, ell(...F([d * 0.52, 0.42]), 0.16 * K, 0.1 * K, 12), 0.4, 0.3)); // cheek blush
  paintDoctorTorso(p, a, U);
  paintStethoscope(p, a, U);
  // window light on her screen-left shoulder and hair
  glaze(p, 646, '#fff6e4', 90, ell(a.lShoulder[0] - 0.02 * U, a.lShoulder[1] - 0.02 * U, 0.12 * U, 0.08 * U, 16), {bleed: 0.4, border: 0.1});
  return a;
};
