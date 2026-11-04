import {drawFigure, type FigAnchors} from '../kit/cast';
import {blob, ell, glaze, hardFill, inkLine, INK, rectPts, solid, washAt, type InteriorLight} from '../kit/draw';
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
const body = (p: Painter, seed: number, color: string, pts: Pt[], glazeOp = 90) => {
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

/** Bedroom layout numbers (plate px, est): mattress top, headboard, nightstand, window. B01, B02, B03-SH05, B04, B07, B08 reuse it. */
export const ROOM = {
  U: 520, mattressTop: 880, railBottom: 1010, legFloor: 1120, wallBase: 1040,
  headboard: {x0: 200, x1: 252, top: 640}, pillow: {x: 380, y: 856},
  stand: {x0: 26, x1: 184, top: 912}, clock: {x: 106, y: 884},
  window: {x0: 600, x1: 962, y0: 170, y1: 650}, moon: {x: 868, y: 300, r: 50},
} as const;

const paintRoomWallAndWindow = (p: Painter, wallSoft: number) => {
  const N = NIGHT, R = ROOM, w = R.window;
  p.flat(N.wall, wide(-120, R.wallBase + 10));
  [0, 1, 2].forEach((i) => glaze(p, 105 + i, mix(N.wall, N.wallTop, 0.5 + 0.25 * i), 120, wide(-120, 420 - i * 150), {bleed: 0.02, border: 0.05}));
  washAt(p, 102, N.wallLit, 95, blob(102, 760, 640, 470, 520, 0), 0.6, 0.4);
  // Wall softness (VD02 `w`): extra wet lilac washes that later become the cloud bleed (B03-SH01); 0.25 at the seam frame.
  if (wallSoft > 0) {
    washAt(p, 103, '#3a4f86', 90 * wallSoft, blob(103, 330, 430, 300, 220, 0), 0.35, 0.5);
    washAt(p, 104, '#46578f', 70 * wallSoft, blob(104, 470, 640, 220, 120, 0), 0.35, 0.5);
  }
  // window: frame, night glass, moon, mullions, sill
  hardFill(p, 110, N.frame, rectPts(w.x0, w.y0, w.x1, w.y1));
  p.flat(N.sky, rectPts(w.x0 + 24, w.y0 + 24, w.x1 - 24, w.y1 - 24));
  washAt(p, 111, N.skyLow, 150, rectPts(w.x0 + 24, (w.y0 + w.y1) / 2, w.x1 - 24, w.y1 - 24), 0.3, 0.3);
  paintSkyDisc(p, {x: R.moon.x, y: R.moon.y, r: R.moon.r, color: N.moon, glow: 0.45, glowColor: N.moonGlow, seed: 7210});
  // a few far rooftops under the moon so the window reads as outside at night
  washAt(p, 112, '#22325a', 220, [[w.x0 + 24, 560], [690, 548], [700, 520], [760, 520], [770, 555], [850, 540], [860, 505], [905, 505], [912, 540], [w.x1 - 24, 548], [w.x1 - 24, w.y1 - 24], [w.x0 + 24, w.y1 - 24]], 0.05, 0.2);
  const mx = (w.x0 + w.x1) / 2, my = (w.y0 + w.y1) / 2 + 20;
  hardFill(p, 113, N.frame, rectPts(mx - 7, w.y0 + 20, mx + 7, w.y1 - 20));
  hardFill(p, 114, N.frame, rectPts(w.x0 + 20, my - 7, w.x1 - 20, my + 7));
  hardFill(p, 115, '#7f90bc', rectPts(w.x0 - 20, w.y1 - 4, w.x1 + 20, w.y1 + 20));
  inkLine(p, 116, rectPts(w.x0, w.y0, w.x1, w.y1), {color: mix(INK, N.frame, 0.4), weight: 0.6, still: true});
  // curtains, gathered at both sides
  const curtain = (seed: number, x0: number, x1: number, sway: number) => {
    const pts: Pt[] = [[x0, w.y0 - 40], [x1, w.y0 - 40], [x1 + sway, w.y1 + 40], [x1 + sway * 0.6, 820], [x0 + sway * 0.3, 830], [x0, w.y1 + 60]];
    body(p, seed, N.curtain, pts, 110);
    for (let i = 1; i < 4; i++) {
      const u = i / 4;
      inkLine(p, seed + i, [[x0 + (x1 - x0) * u, w.y0 - 30], [x0 + (x1 - x0) * u + sway * 0.6 * u, 800]], {color: mix(N.curtain, '#121a30', 0.5), weight: 0.45, closed: false, still: true});
    }
  };
  curtain(120, w.x0 - 70, w.x0 + 34, -10);
  curtain(130, w.x1 - 34, w.x1 + 70, 14);
  // curtain rod
  hardFill(p, 140, NIGHT.woodDark, rectPts(w.x0 - 100, w.y0 - 52, w.x1 + 100, w.y0 - 40));
};

const paintRoomFloor = (p: Painter) => {
  const N = NIGHT, R = ROOM;
  p.flat(N.floor, wide(R.wallBase, HGT + 120));
  hardFill(p, 150, N.base, rectPts(-120, R.wallBase - 26, W + 120, R.wallBase + 4));
  // plank seams spread toward the camera (floor seen from bed height, est)
  [1068, 1104, 1150, 1212, 1292, 1394, 1524, 1690, 1890].forEach((y, i) =>
    inkLine(p, 151 + i, [[-40, y], [W + 40, y + 6 * (i % 2 ? 1 : -1)]], {color: N.floorLine, weight: 0.5 + i * 0.06, closed: false, still: true}),
  );
  washAt(p, 165, '#1e2542', 150, wide(1560, HGT + 120), 0.5, 0.3);
  // rug under the bed, muted dusty rose (the only warm-ish area low in frame, still cool-tinted)
  const rug: Pt[] = [[120, 1190], [1150, 1180], [1220, 1700], [30, 1740]];
  body(p, 166, '#5e5276', rug, 100);
  // woven border stripe inset from the rug edge
  const inset: Pt[] = [[160, 1216], [1110, 1206], [1170, 1676], [80, 1712]];
  inkLine(p, 168, inset, {color: '#86769e', weight: 1.1, still: true});
  inkLine(p, 167, rug, {color: mix('#5e5276', INK, 0.5), weight: 0.5, still: true});
  // slippers by the bed (she took them off: someone lives here)
  [[330, 1290], [420, 1306]].forEach(([x, y], i) => {
    const sl = ell(x, y, 46, 16, 16);
    body(p, 171 + i * 2, '#c9b6dc', sl, 60);
    inkLine(p, 175 + i, sl, {color: mix(INK, '#c9b6dc', 0.4), weight: 0.5, still: true});
  });
};

/** Moon light: a pale shaft from the window across the bed and a pool on the rug and floor (UT04). Off the face (x < 560 above y 900). */
const paintMoonLight = (p: Painter, level: number) => {
  // shaft across the bed: a faint glaze; never on the face (x < 560 above y 900)
  glaze(p, 170, NIGHT.moonGlow, 30 * level, [[618, 660], [946, 660], [860, 1150], [560, 1150]], {bleed: 0.1, border: 0.1});
  // pool of moonlight on the floor in front of the bed (window shape, mullion cross in shadow)
  const pool: Pt[] = [[520, 1330], [860, 1324], [800, 1640], [400, 1650]];
  glaze(p, 171, '#8ea4d6', 90 * level, pool, {bleed: 0.03, border: 0.15});
  glaze(p, 172, '#5e5276', 120 * level, [[682, 1328], [696, 1328], [612, 1646], [596, 1646]], {bleed: 0.02});
  glaze(p, 173, '#5e5276', 120 * level, [[470, 1484], [834, 1478], [832, 1492], [466, 1498]], {bleed: 0.02});
};

const paintNightstand = (p: Painter, clockLevel: number) => {
  const N = NIGHT, R = ROOM, s = R.stand, c = R.clock;
  // warm clock glow on the wall: wall colour mixed toward amber (a thin amber wash over blue reads green), plus the screen Spot in look.tsx
  glaze(p, 7410, mix(N.wall, N.clock, 0.22 * clockLevel), 200, blob(7410, c.x + 10, c.y - 20, 190, 150, 0), {bleed: 0.12, border: 0.05});
  glaze(p, 7411, mix(N.wall, N.clock, 0.4 * clockLevel), 200, blob(7411, c.x + 6, c.y - 10, 110, 86, 0), {bleed: 0.12, border: 0.05});
  const box = rectPts(s.x0, s.top, s.x1, R.legFloor - 40);
  body(p, 180, N.woodDark, box, 80);
  hardFill(p, 181, N.wood, rectPts(s.x0 - 8, s.top - 14, s.x1 + 8, s.top + 4));
  hardFill(p, 182, mix(N.woodDark, '#000000', 0.25), rectPts(s.x0 + 14, R.legFloor - 40, s.x0 + 30, R.legFloor));
  hardFill(p, 183, mix(N.woodDark, '#000000', 0.25), rectPts(s.x1 - 30, R.legFloor - 40, s.x1 - 14, R.legFloor));
  inkLine(p, 184, [[s.x0 + 12, s.top + 70], [s.x1 - 12, s.top + 70]], {color: mix(INK, N.wood, 0.3), weight: 0.5, closed: false, still: true});
  hardFill(p, 185, '#8a7a9a', rectPts((s.x0 + s.x1) / 2 - 14, s.top + 40, (s.x0 + s.x1) / 2 + 14, s.top + 50)); // drawer knob
  // small digital clock: dark body, warm screen (bars, no numerals: the hour is read from the glow, B07-SH02)
  hardFill(p, 186, N.clockBody, rectPts(c.x - 46, c.y - 38, c.x + 46, s.top - 14));
  hardFill(p, 187, mix(N.clock, '#2a2840', 1 - clockLevel), rectPts(c.x - 34, c.y - 26, c.x + 34, c.y + 2));
  for (let i = 0; i < 3; i++) hardFill(p, 188 + i, mix('#fff0d8', N.clock, 0.4), rectPts(c.x - 26 + i * 20, c.y - 18, c.x - 14 + i * 20, c.y - 6));
  // a book and a glass of water on the stand
  hardFill(p, 192, '#5c6a9a', rectPts(s.x0 + 2, s.top - 32, s.x0 + 46, s.top - 14));
};

/** Bed behind the sleeper: headboard, rail, legs, mattress, sheet, pillow. */
const paintBedBack = (p: Painter) => {
  const N = NIGHT, R = ROOM, hb = R.headboard;
  const head: Pt[] = [[hb.x0, R.legFloor], [hb.x0, hb.top + 30], [hb.x0 + 12, hb.top], [hb.x1 - 12, hb.top], [hb.x1, hb.top + 30], [hb.x1, R.legFloor]];
  body(p, 200, N.wood, head, 80);
  washAt(p, 201, N.woodDark, 160, [[hb.x0, hb.top + 60], [hb.x0 + 18, hb.top + 60], [hb.x0 + 18, R.legFloor], [hb.x0, R.legFloor]], 0.05, 0.3);
  inkLine(p, 202, head, {color: mix(INK, N.wood, 0.3), weight: 0.6, still: true});
  hardFill(p, 203, N.woodDark, rectPts(hb.x1, R.mattressTop + 70, W + 140, R.railBottom));
  hardFill(p, 204, mix(N.woodDark, '#000000', 0.2), rectPts(hb.x1 + 10, R.railBottom, hb.x1 + 40, R.legFloor));
  hardFill(p, 205, mix(N.woodDark, '#000000', 0.2), rectPts(W - 50, R.railBottom, W - 20, R.legFloor + 6));
  // under-bed shadow on the rug/floor
  washAt(p, 206, '#151b30', 170, [[hb.x1 - 20, R.legFloor - 6], [W + 120, R.legFloor - 6], [W + 120, R.legFloor + 34], [hb.x1 - 20, R.legFloor + 28]], 0.4, 0.3);
  // mattress and sheet
  const mat: Pt[] = [[hb.x1, R.mattressTop + 6], [hb.x1 + 30, R.mattressTop], [W + 140, R.mattressTop], [W + 140, R.mattressTop + 80], [hb.x1, R.mattressTop + 80]];
  body(p, 207, N.sheet, mat, 60);
  washAt(p, 208, N.linenHi, 120, rectPts(hb.x1 + 30, R.mattressTop, W + 140, R.mattressTop + 22), 0.1, 0.3);
  // pillow
  const pl = R.pillow;
  const pillow = blob(209, pl.x, pl.y, 118, 42, 0);
  body(p, 209, N.linen, pillow, 50);
  washAt(p, 210, mix(N.linen, '#5a6ea8', 0.45), 150, [[pl.x - 110, pl.y + 8], [pl.x + 112, pl.y + 4], [pl.x + 104, pl.y + 34], [pl.x - 100, pl.y + 36]], 0.3, 0.4);
  inkLine(p, 211, pillow, {color: mix(INK, N.linen, 0.4), weight: 0.55, still: true});
};

/** Blanket over the sleeper, from the chest to off-frame right; the near side hangs over the rail. Placed from the rig anchors. */
const paintBlanket = (p: Painter, chestX: number, bodyTop: number, feetX: number, hands: Pt[] = []) => {
  const N = NIGHT, R = ROOM;
  const top: Pt[] = [];
  const x1 = W + 140;
  top.push([chestX - 30, ROOM.mattressTop + 6], [chestX - 18, bodyTop + 22]);
  for (let i = 0; i <= 24; i++) {
    const x = chestX + ((x1 - chestX) * i) / 24;
    // chest, a soft dip over the belly, the knees, then the tent over the toes (shape est from the 1.58 m figure at U 520)
    const y = bodyTop + 26 * Math.exp(-(((x - (chestX + 0.62 * (feetX - chestX))) / 120) ** 2)) - 8 * Math.exp(-(((x - (chestX + 0.75 * (feetX - chestX))) / 60) ** 2)) - 20 * Math.exp(-(((x - feetX + 20) / 46) ** 2)) + (x > feetX + 40 ? Math.min(60, (x - feetX - 40) * 0.8) : 0);
    // keep both hands (lying along the body) under the cover
    const lift = hands.reduce((m, [hx, hy]) => Math.max(m, (y - (hy - 22)) * Math.exp(-(((x - hx) / 70) ** 2))), 0);
    top.push([x, y - Math.max(0, lift)]);
  }
  // the duvet spills over the near side of the bed almost to the floor (fills the lower frame with lit cloth, UT03)
  const hem: Pt[] = [[x1, R.legFloor + 70], [960, R.legFloor + 92], [860, R.legFloor + 60], [740, R.legFloor + 96], [620, R.legFloor + 52], [chestX + 40, R.legFloor - 10], [chestX - 20, R.railBottom - 10]];
  const pts = [...top, ...hem];
  body(p, 220, N.blanket, pts, 70);
  // the near side falls over the mattress edge: a darker band below the mattress line, a few fold lines, moon light on the top
  glaze(p, 221, mix(N.blanket, '#141c38', 0.55), 210, [[chestX + 30, R.railBottom + 10], [x1, R.railBottom], ...hem.slice(0, 6)], {bleed: 0.2, border: 0.1});
  glaze(p, 222, N.blanketHi, 170, [[640, bodyTop + 14], [720, bodyTop + 10], [880, bodyTop + 26], [840, R.mattressTop + 30], [600, R.mattressTop + 30]], {bleed: 0.3, border: 0.05});
  // two soft fold shadows down the drape
  [[700, 790], [880, 940]].forEach(([x, xb], i) => glaze(p, 229 + i, mix(N.blanket, '#141c38', 0.4), 150, [[x - 30, R.mattressTop + 60], [x + 20, R.mattressTop + 60], [xb + 26, R.legFloor + 60], [xb - 34, R.legFloor + 70]], {bleed: 0.2, border: 0.05}));
  [[660, 742], [800, 860], [930, 960]].forEach(([x, xb], i) => inkLine(p, 223 + i, [[x, R.mattressTop + 60], [xb, R.legFloor + 60]], {color: mix(N.blanket, INK, 0.5), weight: 0.45, closed: false, still: true}));
  // turned-down sheet band at the chest
  const band: Pt[] = [[chestX - 30, R.mattressTop + 10], [chestX - 22, bodyTop + 16], [chestX - 6, bodyTop - 4], [chestX + 64, bodyTop - 2], [chestX + 70, R.mattressTop + 36], [chestX - 20, R.mattressTop + 34]];
  body(p, 226, N.fold, band, 50);
  inkLine(p, 227, band, {color: mix(INK, N.fold, 0.4), weight: 0.5, still: true});
  inkLine(p, 228, [...top, ...hem.slice(0, 5)], {color: mix(INK, N.blanket, 0.35), weight: 0.6, closed: false, still: true});
};

export type RoomState = {wallSoft: number; moon: number; clock: number; face: keyof typeof EXPRESSIONS};

/** LF01: the bedroom at the seam frame (VD02): she lies on her back, head on the pillow at screen left (P36, facing right, lie +1). */
export const paintBedroom = (p: Painter, t: number, s: RoomState): FigAnchors => {
  const R = ROOM;
  paintRoomWallAndWindow(p, s.wallSoft);
  paintRoomFloor(p);
  paintMoonLight(p, s.moon);
  paintNightstand(p, s.clock);
  paintBedBack(p);
  // P36 lie_on_back: the profile card rotated about the ground point (the feet); head at the pillow (est numbers, LF01 fit)
  const g: Pt = [1060, R.mattressTop - 0.06 * R.U];
  const a = drawFigure(p, SLEEPER, g, R.U, {...poseFor('P36', SLEEPER, g, R.U, 'right'), face: EXPRESSIONS[s.face], light: MOON_LIGHT}, t);
  paintBlanket(p, a.head[0] + 0.24 * R.U, Math.min(a.rShoulder[1], a.lShoulder[1]) - 0.1 * R.U, a.feet[0], [a.rHand, a.lHand]);
  return a;
};

// ------------------------------------------------------------------ LF02 dream cliff (VD04; first shot S01-B03-SH02)

export const CLIFF = {U: 250, lipY: 790, lipX: 640, figX: 560} as const;

const cloudPuff = (p: Painter, seed: number, x: number, y: number, rx: number, ry: number, color: string, op: number) =>
  washAt(p, seed, color, op, blob(seed, x, y, rx, ry, 0), 0.65, 0.45);

/** LF02: the cloud world, made of the same paint as the bedroom wall; a half-painted cliff ledge whose edge dissolves into paper. */
export const paintDreamCliff = (p: Painter, t: number): FigAnchors => {
  const D = DREAM, C = CLIFF;
  p.flat(D.top, wide(-120, HGT + 120));
  // sky strata: pale top, rose-peach band, lilac deepening downward into the drop (the depth of the fall)
  washAt(p, 300, D.peach, 120, wide(260, 700), 0.6, 0.4);
  washAt(p, 301, D.rose, 110, wide(560, 1050), 0.6, 0.45);
  washAt(p, 302, D.lilac, 120, wide(900, 1500), 0.6, 0.45);
  washAt(p, 303, D.lilacDeep, 150, wide(1350, HGT + 120), 0.6, 0.45);
  washAt(p, 304, '#4c4290', 120, wide(1650, HGT + 120), 0.6, 0.4);
  // far cloud banks
  [[160, 300, 260, 70], [820, 240, 300, 80], [520, 470, 380, 70], [960, 640, 260, 90]].forEach(([x, y, rx, ry], i) => cloudPuff(p, 310 + i, x, y, rx, ry, D.cloud, 200));
  [[300, 1150, 330, 110], [880, 1060, 300, 100], [620, 1400, 420, 120], [140, 1560, 300, 100], [940, 1700, 320, 110]].forEach(([x, y, rx, ry], i) =>
    cloudPuff(p, 320 + i, x, y, rx, ry, i % 2 ? D.peach : D.rose, 150),
  );
  [[520, 1240, 260, 70], [820, 1520, 240, 60], [300, 1800, 260, 70]].forEach(([x, y, rx, ry], i) => cloudPuff(p, 330 + i, x, y, rx, ry, D.cloud, 120));
  // the ledge: top face, then the cliff face falling away and dissolving (fewer, paler strokes lower down, bare paper gaps)
  const top: Pt[] = [[-140, C.lipY - 30], [200, C.lipY - 40], [460, C.lipY - 26], [C.lipX, C.lipY - 6], [C.lipX + 18, C.lipY + 8], [-140, C.lipY + 20]];
  washAt(p, 340, mix(D.cliff, '#ffffff', 0.25), 250, top, 0.05, 0.4);
  const face: Pt[] = [[-140, C.lipY + 10], [C.lipX + 18, C.lipY + 8], [C.lipX - 10, C.lipY + 120], [C.lipX - 60, C.lipY + 260], [480, C.lipY + 420], [330, C.lipY + 620], [-140, C.lipY + 700]];
  washAt(p, 341, D.cliff, 235, face, 0.15, 0.5);
  washAt(p, 342, D.cliffDark, 160, [[-140, C.lipY + 30], [300, C.lipY + 40], [C.lipX - 20, C.lipY + 60], [C.lipX - 60, C.lipY + 250], [400, C.lipY + 380], [-140, C.lipY + 420]], 0.3, 0.5);
  // dissolve: paper-coloured washes eat the lower cliff, then loose dry strokes trail off
  washAt(p, 343, D.cloud, 210, [[-140, C.lipY + 520], [260, C.lipY + 470], [430, C.lipY + 520], [360, C.lipY + 760], [-140, C.lipY + 820]], 0.7, 0.5);
  washAt(p, 344, D.cloud, 160, [[420, C.lipY + 300], [560, C.lipY + 260], [600, C.lipY + 360], [470, C.lipY + 470]], 0.7, 0.5);
  // unfinished: the pencil under-drawing of the cliff face carries on below where the paint stops (CL02 "not real")
  const sketch: [number, Pt[]][] = [
    [346, [[C.lipX - 60, C.lipY + 260], [500, C.lipY + 420], [400, C.lipY + 600], [330, C.lipY + 800], [300, C.lipY + 920]]],
    [347, [[C.lipX - 40, C.lipY + 280], [520, C.lipY + 440], [440, C.lipY + 640], [380, C.lipY + 780]]],
    [348, [[250, C.lipY + 520], [210, C.lipY + 700], [150, C.lipY + 860]]],
    [349, [[60, C.lipY + 560], [40, C.lipY + 760], [10, C.lipY + 900]]],
    [350, [[380, C.lipY + 500], [430, C.lipY + 560], [400, C.lipY + 640]]],
  ];
  sketch.forEach(([id, pts]) => {
    p.inkStill(id, 'HB', mix(D.cliffDark, D.lilacDeep, 0.3), 1.3);
    p.brush.spline(pts, 0.4);
  });
  // a few loose drips where the wash ran off the bottom of the painted part
  [[120, 0.62], [260, 0.55], [400, 0.5]].forEach(([x, k], i) => washAt(p, 352 + i, D.cliff, 120 * k, [[x - 16, C.lipY + 560], [x + 16, C.lipY + 560], [x + 6, C.lipY + 660 + 40 * i], [x - 4, C.lipY + 680 + 40 * i]], 0.1, 0.4));
  // lip highlight and a few cracks (still ink, the only ink on the set: the ledge is a key prop)
  inkLine(p, 360, [[-140, C.lipY - 30], [200, C.lipY - 40], [460, C.lipY - 26], [C.lipX, C.lipY - 6], [C.lipX + 18, C.lipY + 8]], {color: mix(INK, D.cliff, 0.5), weight: 0.6, closed: false, still: true});
  inkLine(p, 361, [[C.lipX + 18, C.lipY + 8], [C.lipX - 10, C.lipY + 120], [C.lipX - 60, C.lipY + 260]], {color: mix(INK, D.cliff, 0.55), weight: 0.55, closed: false, still: true});
  // the sleeper from behind at the lip, head bowed to look down into the cloud (back view, P01 arms, slight lean)
  const g: Pt = [C.figX, C.lipY - 14];
  const a = drawFigure(p, SLEEPER, g, C.U, {...poseFor('P01', SLEEPER, g, C.U, 'front'), view: 'back', lean: 0.06, nod: [0, -0.25], face: EXPRESSIONS.neutral, light: PAPER_LIGHT}, t);
  // near cloud drifting past the lip, in front of the cliff base
  cloudPuff(p, 370, 860, 980, 280, 80, D.cloud, 150);
  return a;
};

// ------------------------------------------------------------------ paper ground shared by LF03, LF04, LF05

const paintPaperGround = (p: Painter, seed: number, tint?: string) => {
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
export const paintIdeaSpace = (p: Painter, t: number): FigAnchors => {
  const I = IDEA;
  paintPaperGround(p, 400);
  const U = 520;
  const g: Pt = [480, 1360];
  const seat = chairSpec(SLEEPER, 'front').seatV;
  const seatY = g[1] - seat * U;
  // the big "?" behind her, upper right: a soft violet wash under the brush mark (above her eye line, clear of the head)
  washAt(p, 410, I.violetSoft, 80, blob(410, 800, 340, 200, 220, 0), 0.6, 0.5);
  paintQuestion(p, 411, 800, 420, 380, I.violet, 8);
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
  const a = drawFigure(p, SLEEPER, g, U, {...pose, nod: [0.12, 0.04], face: {...EXPRESSIONS.worried, look: [0.5, -0.5]}, light: PAPER_LIGHT}, t);
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

const iconDumbbell = (p: Painter, x: number, y: number) => {
  const plate = (seed: number, px: number) => {
    washAt(p, seed, '#5f6a86', 250, [[px - 26, y - 70], [px + 26, y - 70], [px + 26, y + 70], [px - 26, y + 70]], 0.05, 0.35);
    washAt(p, seed + 1, '#8892ae', 140, [[px - 26, y - 70], [px - 4, y - 70], [px - 4, y + 70], [px - 26, y + 70]], 0.2, 0.4);
    inkLine(p, seed + 2, [[px - 26, y - 70], [px + 26, y - 70], [px + 26, y + 70], [px - 26, y + 70]], {color: mix(INK, '#5f6a86', 0.3), weight: 0.7, still: true});
  };
  hardFill(p, 580, '#9aa0b0', rectPts(x - 120, y - 12, x + 120, y + 12));
  inkLine(p, 581, rectPts(x - 120, y - 12, x + 120, y + 12), {color: mix(INK, '#9aa0b0', 0.3), weight: 0.6, still: true});
  plate(582, x - 92);
  plate(586, x + 92);
};

/** LF04: the trigger icons on the paper ground: three in a row (SH01) and the dumbbell below-left (SH02), all at full strength. */
export const paintTriggerIcons = (p: Painter) => {
  paintPaperGround(p, 490);
  const at = (x: number, y: number, k: number, draw: (x: number, y: number) => void) => {
    p.brush.push();
    p.brush.translate(x, y);
    p.brush.scale(k);
    draw(0, 0);
    p.brush.pop();
  };
  // row of three (SH01) above the caption band (y < 860) and the dumbbell bottom-left under it (SH02, bottom-left)
  at(225, 600, 1.3, (x, y) => iconCup(p, x, y));
  at(545, 590, 1.3, (x, y) => iconScribble(p, x, y));
  at(860, 600, 1.3, (x, y) => iconMoonClock(p, x, y));
  at(300, 1460, 1.4, (x, y) => iconDumbbell(p, x, y));
};

// ------------------------------------------------------------------ LF05 doctor vignette (VD09; S01-B07-SH03)

/** LF05: the doctor in a pale vignette with soft window light from the upper left; medium front, knees up. */
export const paintDoctor = (p: Painter, t: number): FigAnchors => {
  paintPaperGround(p, 600, '#d9e6e2');
  // window light: a pale window shape and two soft shafts falling right
  hardFill(p, 609, '#c9d3cf', rectPts(24, 144, 346, 636));
  body(p, 610, '#e6f0f2', rectPts(44, 164, 326, 616), 40);
  washAt(p, 615, '#cfe2ea', 160, rectPts(44, 164, 326, 400), 0.1, 0.3);
  hardFill(p, 611, '#c9d3cf', rectPts(178, 160, 192, 620));
  hardFill(p, 612, '#c9d3cf', rectPts(40, 384, 330, 398));
  hardFill(p, 616, '#bfc9c5', rectPts(10, 630, 360, 652));
  washAt(p, 613, '#fbf7ea', 90, [[40, 620], [330, 620], [900, 1700], [420, 1760]], 0.6, 0.4);
  washAt(p, 614, '#fbf7ea', 60, [[60, 160], [330, 160], [1100, 980], [800, 1180]], 0.6, 0.4);
  // a plant on a shelf at the right: a friendly clinic, not an emergency
  washAt(p, 620, '#c7b79c', 220, rectPts(800, 760, 1100, 784), 0.1, 0.3);
  washAt(p, 621, '#b9866a', 240, [[880, 690], [960, 690], [950, 760], [890, 760]], 0.1, 0.35);
  [[-0.6, 90], [-0.2, 120], [0.3, 110], [0.7, 80]].forEach(([a, len], i) =>
    washAt(p, 622 + i, i % 2 ? '#86a888' : '#9dbaa0', 230, ell(920 + Math.sin(a) * len * 0.6, 690 - Math.cos(a) * len * 0.6, 22, len * 0.45, 12, a), 0.2, 0.4),
  );
  const U = 980;
  const g: Pt = [540, 1940];
  return drawFigure(p, DOCTOR, g, U, {...poseFor('P01', DOCTOR, g, U, 'front'), face: EXPRESSIONS.happy, light: PAPER_LIGHT}, t);
};
