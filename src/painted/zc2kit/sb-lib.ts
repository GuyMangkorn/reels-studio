import {BONE, drawFigure, ikElbow, shoulderPoint, type FigPose} from '../kit/cast';
import {ell, fistParts, hardFill, inkLine, openHandParts, shapedLimb, washAt, type InteriorLight} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {HAND_SCALE, LEAD, morning} from './frames';
import {affine, contact, doorLeaf, fillF, floorMap, glazeS, intercom, lightSwitch, plant, stroke, surface, tileFloor, tintS, umbrella, woodGrain, crack, type M} from './sets';

// ZCONDO2-SHORT-TH W3.3 storyboard stills (ZC2-SB-R3): shared set pieces, props and hands for the 25 shots that are not proof frames.
// Everything is kit-look p5 paint (flat hard fills, textured washes, pencil strokes). Staging numbers are estimates (Film), units screen px, y down.

export type V2 = Pt;
/** Draft clock (W5.2): the shot-local frame the current paint call draws; the draft sets it before `paint`. Stills read 0. */
export const cur = {f: 0};
export const seg = (f: number, a: number, b: number) => Math.min(1, Math.max(0, (f - a) / (b - a)));
export const ease = (u: number) => u * u * (3 - 2 * u);
/** Draw `fn` shifted by (dx, dy) px on the picture stage (a moving prop and its hand move as one piece). */
export const moved = (p: Painter, dx: number, dy: number, fn: () => void) => { p.brush.push(); p.brush.translate(dx, dy); fn(); p.brush.pop(); };
let EID = 9000;
export const resetE = (n = 9000) => { EID = n; };
export const E = (p: Painter, pts: Pt[], w = 0.9, closed = true, color = '#4b3d33') => inkLine(p, EID++, pts, {color, weight: w, closed, curve: 0.02, still: true});
export const poly = fillF;
export const shade = (p: Painter, c: string, a: number, pts: Pt[]) => tintS(p, c, a, pts);
export const R = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
export const shadowAt = (p: Painter, x: number, y: number, rx: number, ry = rx * 0.14, a = 90) => tintS(p, '#2d2119', a, ell(x, y, rx, ry, 16));
/** Filled rectangle with an ink edge, a light top strip and a dark bottom strip: the basic box. */
export const box = (p: Painter, x0: number, y0: number, x1: number, y1: number, c: string, o: {w?: number; lit?: number} = {}) => {
  poly(p, c, R(x0, y0, x1, y1));
  tintS(p, '#ffffff', 40, R(x0, y0, x1, y0 + Math.min(14, (y1 - y0) * 0.12)));
  tintS(p, '#1d140e', 45, R(x0, y1 - Math.min(18, (y1 - y0) * 0.15), x1, y1));
  if (o.lit) tintS(p, '#fff1c8', o.lit, R(x0, y0, x0 + (x1 - x0) * 0.35, y1));
  E(p, R(x0, y0, x1, y1), o.w ?? 0.9);
};

// ------------------------------------------------------------------ mood palettes (L2 unit)
export type Mood = 'morning' | 'dim' | 'grey';
export const MOOD = {
  morning: {wall: '#cdbf9f', floor: '#b3a487', door: '#8a6b4c', sun: '#f6d9a0', veil: '#000000', veilA: 0},
  dim: {wall: '#bcb6a4', floor: '#a59d8a', door: '#7f6a52', sun: '#d8d4c0', veil: '#4a5868', veilA: 38},
  grey: {wall: '#b3b3a8', floor: '#9b9c90', door: '#77705f', sun: '#cfd3d0', veil: '#56626e', veilA: 52},
} as const;
export const greyLight = (key: [number, number], o: Partial<InteriorLight> = {}): InteriorLight => ({
  ...morning(key), ink: '#34322e',
  pal: {ambient: '#8f9894', ambientMix: 0.16, shadow: '#3e4650', shadowMix: 0.5, shadowOpacity: 180, shadowFrom: 0.42, shadowBleed: 0.1, light: '#e6eadf', lightMix: 0.3, lightOpacity: 120, lightTo: 0.3, glazeOpacity: 60, glazeTexture: 0.7, glazeBorder: 0.6,
    lineMix: 0.55, lineOuter: 0.9, lineFold: 0.9, falloff: '#2e343a', falloffOpacity: 45, ground: '#2c3034', groundCore: '#1c2024'},
  ...o,
});
export const nightLight = (key: [number, number]): InteriorLight => ({
  ...morning(key), ink: '#1d1a24',
  pal: {ambient: '#3a4468', ambientMix: 0.22, shadow: '#161a2c', shadowMix: 0.55, shadowOpacity: 190, shadowFrom: 0.4, shadowBleed: 0.1, light: '#ff9a52', lightMix: 0.42, lightOpacity: 150, lightTo: 0.35, glazeOpacity: 60, glazeTexture: 0.7, glazeBorder: 0.6,
    lineMix: 0.55, lineOuter: 0.9, lineFold: 0.9, falloff: '#10121e', falloffOpacity: 45, ground: '#0e101a', groundCore: '#080a12'},
});
export const lightOf = (m: Mood, key: [number, number] = [0.75, 0.65]) => (m === 'morning' ? morning(key) : greyLight(key));

// ------------------------------------------------------------------ the door wall (L2), one plane
export type DoorWallOpts = {U: number; GY: number; DC: number; mood: Mood; cab?: 'across' | 'beside' | 'none'; bag?: boolean | 'deep'; seed?: number; sun?: boolean; lock?: boolean};
export type DoorWallOut = {dx0: number; dx1: number; cx0: number; cx1: number; cy0: number; fm: (x: number, z: number) => Pt};
/** Knotted black trash bag on the floor, base centre (bx, by), scale by wall U (0.4 U tall): glossy highlight, knot ears, fold lines, contact shadow. */
export const trashBag = (p: Painter, bx: number, by: number, U: number) => {
  const k = U / 820, P = (x: number, y: number): Pt => [bx + x * k, by + y * k];
  shadowAt(p, bx + 20 * k, by + 8 * k, 190 * k, 22 * k, 120);
  const bag = [P(-130, 0), P(140, -6), P(172, -110), P(136, -220), P(70, -280), P(-10, -290), P(-92, -240), P(-160, -120)];
  poly(p, '#2c2f36', bag); shade(p, '#b7c0d0', 75, [P(-110, -140), P(-40, -240), P(-30, -150), P(-120, -60)]); shade(p, '#05070a', 80, [P(90, -230), P(172, -110), P(140, -6), P(60, -10)]);
  stroke(p, '2B', '#14161a', 1.6, [P(-60, -200), P(-20, -110), P(-50, -20)], 0.3); stroke(p, '2B', '#14161a', 1.6, [P(60, -170), P(40, -90), P(80, -10)], 0.3);
  const knot = [P(-12, -288), P(-40, -350), P(-10, -330), P(14, -372), P(34, -322), P(66, -346), P(60, -280)];
  poly(p, '#2c2f36', knot); E(p, knot, 1.0, true, '#0d0f12'); E(p, bag, 1.2, true, '#0d0f12');
};
export const doorWall = (p: Painter, o: DoorWallOpts): DoorWallOut => {
  const {U, GY, DC, mood} = o, M0 = MOOD[mood], sd = o.seed ?? 1;
  surface(p, R(-20, -20, 1100, GY), M0.wall, {seed: sd, patches: 22, grain: 'h', grainN: 30, streaks: 3, wear: 6});
  const wm = affine(0, GY, U);
  crack(p, wm, 1.55, 1.4, 0.18, -0.55, 6, 11 + sd);
  glazeS(p, '#6b5a3c', 70, [[900, 0], [1100, 0], [1100, 300], [1020, 220], [950, 110]]);
  const fm = floorMap(540, GY - 1.2 * U, GY, U, 3.0);
  tileFloor(p, fm, -2.6, 2.8, 0, 2.4, 0.6, M0.floor, 2 + sd);
  poly(p, mixColor(M0.wall, '#3d2f25', 0.3), R(-20, GY - 0.065 * U, 1100, GY));
  stroke(p, 'HB', '#e8dcc0', 1.2, [[-20, GY - 0.063 * U], [1100, GY - 0.063 * U]], 0.01); stroke(p, '2B', '#4b3d33', 1.4, [[-20, GY - 1], [1100, GY - 1]], 0.01);
  const dx0 = DC - 0.45 * U, dx1 = DC + 0.45 * U, fw = 0.04 * U;
  poly(p, '#46372a', R(dx0 - fw, -20, dx1 + fw, GY));
  woodGrain(p, R(dx0 - fw, -20, dx0, GY), '#6a5642', 31 + sd, 'v', 6);
  woodGrain(p, R(dx1, -20, dx1 + fw, GY), '#6a5642', 32 + sd, 'v', 6);
  doorLeaf(p, R(dx0, -20, dx1, GY), M0.door, 33 + sd, {panels: true, grainN: 40});
  tintS(p, '#2d2119', 80, R(dx1, -20, dx1 + fw, GY));
  if (o.lock !== false) {
    const lx = dx0 + 0.12 * U, ly = GY - 1.0 * U, by = GY - 1.15 * U;
    tintS(p, '#2d2119', 90, ell(lx + 6, ly + 14, 0.04 * U, 0.04 * U, 14));
    poly(p, '#b69a58', ell(lx, ly, 0.036 * U, 0.036 * U, 14)); E(p, ell(lx, ly, 0.036 * U, 0.036 * U, 14), 1.1, true, '#4b3a1c');
    poly(p, '#6a6a6c', R(lx - 0.016 * U, ly - 0.012 * U, lx + 0.14 * U, ly + 0.012 * U)); tintS(p, '#ffffff', 90, R(lx - 0.01 * U, ly - 0.011 * U, lx + 0.135 * U, ly - 0.004 * U));
    poly(p, '#b69a58', ell(lx, by, 0.047 * U, 0.047 * U, 14)); E(p, ell(lx, by, 0.047 * U, 0.047 * U, 14), 1.1, true, '#4b3a1c');
    poly(p, '#2f2d2c', R(lx - 0.024 * U, by - 0.007 * U, lx + 0.024 * U, by + 0.007 * U));
  }
  if (dx1 + fw + 0.2 * U < 1100) { lightSwitch(p, affine(dx1 + 0.22 * U, GY - 0.98 * U, U)); intercom(p, affine(dx1 + 0.2 * U, GY - 1.13 * U, U)); }
  // cabinet 0.77 x 1.06 m
  const ch = 1.06 * U, cl = 0.02 * U, cy0 = GY - ch;
  const cx0 = o.cab === 'beside' ? dx1 + fw + 0.25 * U : dx0 + 0.03 * U, cx1 = cx0 + 0.77 * U;
  if (o.cab && o.cab !== 'none') {
    const cab = (x: number, y: number): Pt => [x + (o.cab === 'across' ? (GY - y) * 0.03 : 0), y];
    if (o.cab === 'across') tintS(p, '#2d2119', 70, [[cx0 - 20, GY - 60], [cx1 + 70, GY - 60], [cx1 + 80, cy0 + 30], [cx0, cy0 + 30]]);
    contact(p, affine(0, GY + 10, 1), (cx0 + cx1) / 2 + 10, 0.45 * U, 12, 110);
    const body: Pt[] = [cab(cx0, GY), cab(cx1, GY), cab(cx1, cy0), cab(cx0, cy0)];
    woodGrain(p, body, '#8f6c4b', 41 + sd, 'v', 36);
    const inner: Pt[] = [cab(cx0 + cl, GY - 0.024 * U), cab(cx1 - cl, GY - 0.024 * U), cab(cx1 - cl, cy0 + cl), cab(cx0 + cl, cy0 + cl)];
    poly(p, '#3d2f25', inner);
    tintS(p, '#1d140e', 80, [cab(cx0 + cl, cy0 + cl), cab(cx1 - cl, cy0 + cl), cab(cx1 - cl, cy0 + cl + 40), cab(cx0 + cl, cy0 + cl + 40)]);
    [0.34, 0.68].forEach((h, i) => { const y = GY - h * ch; woodGrain(p, [cab(cx0 + cl, y), cab(cx1 - cl, y), cab(cx1 - cl, y + 0.02 * U), cab(cx0 + cl, y + 0.02 * U)], '#a07b57', 50 + i, 'h', 4); });
    const shoe = (x: number, h: number, c: string) => {
      const y = GY - h * ch, w = 0.12 * U, hh = 0.055 * U;
      poly(p, c, [cab(x, y), cab(x + w, y), cab(x + w * 0.92, y - hh), cab(x + w * 0.15, y - hh * 1.2)]);
      E(p, [cab(x, y), cab(x + w, y), cab(x + w * 0.92, y - hh), cab(x + w * 0.15, y - hh * 1.2)], 0.8);
      poly(p, '#e8e0cc', [cab(x, y), cab(x + w, y), cab(x + w, y - 0.008 * U), cab(x, y - 0.008 * U)]);
    };
    const wd = 0.77 * U;
    shoe(cx0 + 0.07 * wd, 0.68, '#5d6f82'); shoe(cx0 + 0.3 * wd, 0.68, '#8a4a3a'); shoe(cx0 + 0.6 * wd, 0.34, '#34414f'); shoe(cx0 + 0.38 * wd, 0.34, '#c9b78f');
    E(p, body, 1.1); E(p, inner, 0.6);
  }
  if (o.bag === 'deep') trashBag(p, dx1 - 0.05 * U, GY + 0.18 * U, U); // ZC2-R2: bag on the floor beside the door foot, readable (B09-SH03, B10-SH01)
  else if (o.bag) { // the trash bag, dropped on the floor by the door (continuity)
    const bx = dx0 - 0.3 * U, by = GY + 0.28 * U;
    shadowAt(p, bx + 0.05 * U, by + 0.02 * U, 0.3 * U, 0.04 * U, 100);
    const bag: Pt[] = [[bx - 0.16 * U, by], [bx + 0.18 * U, by - 0.01 * U], [bx + 0.2 * U, by - 0.14 * U], [bx + 0.1 * U, by - 0.26 * U], [bx + 0.02 * U, by - 0.3 * U], [bx - 0.08 * U, by - 0.2 * U], [bx - 0.18 * U, by - 0.12 * U]];
    poly(p, '#3a3d44', bag); tintS(p, '#aab2c0', 55, [[bx - 0.1 * U, by - 0.22 * U], [bx + 0.02 * U, by - 0.28 * U], [bx + 0.04 * U, by - 0.12 * U]]);
    E(p, bag, 1.0); stroke(p, '2B', '#14161a', 1.2, [[bx - 0.02 * U, by - 0.3 * U], [bx + 0.06 * U, by - 0.36 * U], [bx + 0.1 * U, by - 0.3 * U]], 0.3); // knot
  }
  // plaster damp + lived-in wall: umbrella and a hook rail
  umbrella(p, affine(Math.min(1040, dx1 + fw + 0.62 * U), GY + 4, U * 0.7));
  if (o.sun !== false && M0.veilA === 0) [[-80, 200], [300, 520]].forEach(([a, b]) => { tintS(p, M0.sun, 52, [[a, -20], [b, -20], [b + 700, GY], [a + 700, GY]]); tintS(p, M0.sun, 60, [[a + 700, GY], [b + 700, GY], [b + 1100, 1940], [a + 1100, 1940]]); });
  return {dx0, dx1, cx0, cx1, cy0, fm};
};
/** Whole-frame cool veil for blackout daylight / day 3 grey, painted last over the set (not over a figure). */
export const veil = (p: Painter, mood: Mood) => { const M0 = MOOD[mood]; if (M0.veilA) tintS(p, M0.veil, M0.veilA, R(-20, -20, 1100, 1940)); };

// ------------------------------------------------------------------ people
export const SKIN = '#d4a073';
export const lead = (p: Painter, g: Pt, U: number, pose: FigPose, def = LEAD) => drawFigure(p, def, g, U, pose, 0.9);
/** Arm that grips a point: `to` is the wrist (fist reaches ~0.075 m past it). */
export const gripArm = (S: Pt, h: Pt, U: number, _drop: number, fist: 1 | -1 | 0 = 1, out = -1): {to: Pt; via: Pt; fist?: 1 | -1; open?: 1} => {
  // R3-fix: two-bone IK with the kit bone length (BONE x U), so upper arm and forearm stay equal and the elbow bends the right way; a target beyond reach is clamped (straight arm).
  const L = BONE * U, r = 0.075 * U, dx0 = h[0] - S[0], dy0 = h[1] - S[1], d0 = Math.hypot(dx0, dy0) || 1;
  const wd = Math.max(d0 - r, 0.3 * L), m = 2 * L - 1;
  const k = Math.min(wd, m) / d0, to: Pt = [S[0] + dx0 * k, S[1] + dy0 * k];
  const via = ikElbow(S, to, L, out);
  return fist ? {to, via, fist} : {to, via, open: 1};
};
export {shoulderPoint};

/** ZC2 hand scale (W5.3 third pass, user: hands too small "ตะมุตะมิ"), one number with the kit arms (frames.tsx HAND_SCALE). HL1 shapes (4 Nov 2026, kit/draw.ts): fist 0.093 x 0.064 m, mitten 0.125 x 0.064 m plus thumb lobe; x1.45 = fist 0.135 U long (0.5 forearm), about 1.5x the wrist wide. */
export const HS = HAND_SCALE;
/** A mitten hand with forearm and sleeve (hands-only shots; UT14: no drawn fingers). `wrist` plate px, `ang` points along the fingers. */
export const hand = (p: Painter, wrist: Pt, ang: number, k: number, kind: 'fist' | 'open', side: 1 | -1, o: {elbow?: Pt; sleeve?: string; skin?: string; seed?: number; tone?: string; noSleeve?: boolean; hs?: number} = {}) => {
  const hk = k * (o.hs ?? HS);
  const skin = o.skin ?? SKIN, dark = mixColor(skin, '#2a1e18', 0.5), sl = o.sleeve ?? '#5d7385', sd = (o.seed ?? 1) * 10 + 700;
  // ZC2-R2 fix (UT06): a given elbow is pulled in along its own line to a natural forearm (0.3 k, no overlong forearm) and the sleeve continues along the forearm direction (no detached sleeve)
  const el0: Pt = o.elbow ?? [wrist[0] - Math.cos(ang) * 0.27 * k, wrist[1] - Math.sin(ang) * 0.27 * k];
  const fl = Math.hypot(wrist[0] - el0[0], wrist[1] - el0[1]) || 1, fk = Math.min(1, 0.3 * k / fl);
  const el: Pt = [wrist[0] + (el0[0] - wrist[0]) * fk, wrist[1] + (el0[1] - wrist[1]) * fk];
  const ea = Math.atan2(wrist[1] - el[1], wrist[0] - el[0]);
  const sfrom: Pt = [el[0] - Math.cos(ea) * 0.5 * k, el[1] - Math.sin(ea) * 0.5 * k];
  if (!o.noSleeve) {
    const sleeve = shapedLimb(sfrom, [el[0] + Math.cos(ea) * 0.1 * k, el[1] + Math.sin(ea) * 0.1 * k], 0.12 * k, 0.09 * k, {capB: false, bulge: 0.01 * k, flare: 0.014 * k});
    poly(p, sl, sleeve); tintS(p, '#10161c', 55, sleeve.slice(0, Math.floor(sleeve.length / 3))); E(p, sleeve, 1.0, true, mixColor(sl, '#10161c', 0.6));
  }
  const arm = shapedLimb([el[0] + Math.cos(ea) * 0.05 * k, el[1] + Math.sin(ea) * 0.05 * k], wrist, 0.084 * k, wristW(k, o.hs ?? HS), {bulge: 0.016 * k, peak: 0.3, capB: false});
  poly(p, skin, arm); tintS(p, '#6a3d22', 60, arm.slice(0, Math.floor(arm.length / 2))); tintS(p, '#fff1d0', 40, arm.slice(Math.floor(arm.length / 2))); E(p, arm, 1.0, true, dark);
  handShape(p, wrist, ang, hk, kind, side, skin);
  void sd;
  return [wrist[0] + Math.cos(ang) * (kind === 'fist' ? 0.05 : 0.07) * hk, wrist[1] + Math.sin(ang) * (kind === 'fist' ? 0.05 : 0.07) * hk] as Pt;
};
/** HL1 forearm width at the wrist (px) for a hand drawn at `hs`: the same widening as the kit shaped arm (cast.ts), so wrist and hand base meet without a step. */
export const wristW = (k: number, hs: number) => 0.044 * k * (1 + (hs - 1) * 0.75);
/**
 * ZCONDO2 hand language HL1 (4 Nov 2026): the kit `fistParts` bean or `openHandParts` mitten in flat skin, a warm shade on the half away from the
 * light (`shadeSide` +1 / -1 across the hand, default the thumb's far side), one ink outline and short dark strokes. No separate thumb or finger shapes.
 */
export const handShape = (p: Painter, wrist: Pt, ang: number, hk: number, kind: 'fist' | 'open', side: 1 | -1, skin = SKIN, shadeSide: 1 | -1 = -side as 1 | -1) => {
  const dark = mixColor(skin, '#2a1e18', 0.5);
  const pts = kind === 'fist' ? fistParts(wrist, ang, hk, side).back : openHandParts(wrist, ang, hk, side).palm;
  const lines = kind === 'fist' ? (() => { const F = fistParts(wrist, ang, hk, side); return [...F.creases, F.thumbCrease]; })() : (() => { const H = openHandParts(wrist, ang, hk, side); return [...H.creases, H.thumbCrease]; })();
  poly(p, skin, pts);
  const nx = -Math.sin(ang) * shadeSide, ny = Math.cos(ang) * shadeSide, cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length;
  const half = pts.filter((q) => (q[0] - cx) * nx + (q[1] - cy) * ny > -0.004 * hk);
  if (half.length > 2) tintS(p, '#6a3d22', 55, half);
  E(p, pts, 1.0, true, dark);
  lines.forEach((c) => E(p, c, 1.4, false, dark));
};

// ------------------------------------------------------------------ props (elevation, origin bottom-centre in px)
export const canElev = (p: Painter, cx: number, gy: number, w: number, h: number, c = '#b8281f', label = '#efe6d2') => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.62, w * 0.09, 100);
  const x0 = cx - w / 2, x1 = cx + w / 2, ry = w * 0.12;
  poly(p, c, [[x0, gy - ry], [x0, gy - h + ry], ...ell(cx, gy - h + ry, w / 2, ry, 10).filter((q) => q[1] >= gy - h + ry), [x1, gy - h + ry], [x1, gy - ry], ...ell(cx, gy - ry, w / 2, ry, 10).filter((q) => q[1] >= gy - ry).reverse()]);
  tintS(p, '#fff1c8', 45, R(x0 + w * 0.1, gy - h + ry, x0 + w * 0.3, gy - ry)); tintS(p, '#1d0a08', 55, R(x1 - w * 0.25, gy - h + ry, x1, gy - ry));
  poly(p, label, R(x0, gy - h * 0.7, x1, gy - h * 0.34)); stroke(p, '2B', '#6a2a1c', 1.6, [[x0 + w * 0.12, gy - h * 0.55], [x1 - w * 0.12, gy - h * 0.55]], 0.01);
  poly(p, '#b9b4a6', ell(cx, gy - h + ry, w / 2, ry, 14)); E(p, ell(cx, gy - h + ry, w / 2, ry, 14), 1.0); E(p, ell(cx, gy - h + ry, w * 0.28, ry * 0.5, 10), 0.8);
  E(p, [[x0, gy - ry], [x0, gy - h + ry]], 1.0, false); E(p, [[x1, gy - ry], [x1, gy - h + ry]], 1.0, false);
  E(p, ell(cx, gy - ry, w / 2, ry, 14).filter((q) => q[1] >= gy - ry), 1.0, false);
};
export const bottleElev = (p: Painter, cx: number, gy: number, w: number, h: number, water = 0.85, cap = '#2f6fb0') => {
  shadowAt(p, cx + w * 0.15, gy + 2, w * 0.7, w * 0.1, 95);
  const x0 = cx - w / 2, x1 = cx + w / 2, nk = h * 0.78;
  const body: Pt[] = [[x0 + w * 0.05, gy], [x1 - w * 0.05, gy], [x1, gy - h * 0.12], [x1, gy - nk + 6], [cx + w * 0.2, gy - nk - h * 0.06], [cx + w * 0.17, gy - h + 8], [cx - w * 0.17, gy - h + 8], [cx - w * 0.2, gy - nk - h * 0.06], [x0, gy - nk + 6], [x0, gy - h * 0.12]];
  poly(p, '#dce9ee', body);
  poly(p, '#58b8d8', [[x0 + 2, gy - h * 0.12], [x0 + w * 0.05, gy], [x1 - w * 0.05, gy], [x1 - 2, gy - h * 0.12], [x1 - 2, gy - h * water * 0.9], [x0 + 2, gy - h * water * 0.9]]);
  tintS(p, '#ffffff', 70, R(x0 + w * 0.12, gy - h * water * 0.85, x0 + w * 0.26, gy - h * 0.1)); tintS(p, '#0b3a5a', 45, R(x1 - w * 0.22, gy - h * water * 0.9, x1 - 2, gy - h * 0.05));
  E(p, body, 1.0, true, '#35566a');
  poly(p, cap, R(cx - w * 0.17, gy - h, cx + w * 0.17, gy - h + 10)); E(p, R(cx - w * 0.17, gy - h, cx + w * 0.17, gy - h + 10), 0.9);
};
export const bucketElev = (p: Painter, cx: number, gy: number, w: number, h: number, c = '#c7352b', handle = true) => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.7, w * 0.07, 100);
  const tw = w, bw = w * 0.84, ry = w * 0.1;
  const body: Pt[] = [[cx - tw / 2, gy - h + ry], [cx + tw / 2, gy - h + ry], [cx + bw / 2, gy - ry], [cx - bw / 2, gy - ry]];
  // bail handle behind the rim: a thick grey arc built from two offset polylines (wide strokes render fuzzy)
  if (handle) {
    const arc = (r: number): Pt[] => Array.from({length: 13}, (_, i): Pt => { const a = Math.PI * (1 - i / 12); return [cx + Math.cos(a) * tw * 0.5 * r, gy - h + ry - Math.sin(a) * w * 0.5 * r]; });
    poly(p, '#7d8488', [...arc(1.0), ...arc(0.93).reverse()]); E(p, [...arc(1.0), ...arc(0.93).reverse()], 0.9);
  }
  const hull: Pt[] = [...body.slice(0, 3), ...Array.from({length: 9}, (_, i): Pt => { const a = (Math.PI * i) / 8; return [cx + Math.cos(a) * bw / 2, gy - ry + Math.sin(a) * ry]; }), body[3]]; // ZC2-R2 fix: solid hull (the old ellipse join crossed itself into a see-through cone)
  poly(p, c, hull);
  tintS(p, '#ffd0c0', 45, [[cx - tw / 2, gy - h + ry], [cx - tw * 0.28, gy - h + ry], [cx - bw * 0.28, gy - ry], [cx - bw / 2, gy - ry]]); tintS(p, '#2a0806', 55, [[cx + tw * 0.24, gy - h + ry], [cx + tw / 2, gy - h + ry], [cx + bw / 2, gy - ry], [cx + bw * 0.24, gy - ry]]);
  // two moulded rings round the body, a lighter rolled rim and the dark open mouth with the water inside
  [0.38, 0.7].forEach((t) => { const y = gy - h + ry + (h - 2 * ry) * t, hw = (tw + (bw - tw) * t) / 2; stroke(p, '2B', mixColor(c, '#1d0a08', 0.55), 1.4, [[cx - hw, y], [cx + hw, y]], 0.05); });
  poly(p, mixColor(c, '#ffffff', 0.25), ell(cx, gy - h + ry, tw / 2 + 4, ry + 3, 16)); E(p, ell(cx, gy - h + ry, tw / 2 + 4, ry + 3, 16), 1.1);
  poly(p, mixColor(c, '#1d0a08', 0.55), ell(cx, gy - h + ry, tw / 2 - 6, ry - 2, 16)); poly(p, '#58b8d8', ell(cx, gy - h + ry + 2, tw / 2 - 12, ry - 5, 16));
  E(p, body, 1.1);
};
/** Smooth thick tube (hose, wire) as a filled outline: Catmull-Rom through `pts`, width `w` px. Replaces wide `stroke` calls, which render as black scribble (ZC2-R2 fix). */
export const hose = (p: Painter, pts: Pt[], w: number, c: string) => {
  const sm: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) { const a = pts[Math.max(0, i - 1)], b = pts[i], d = pts[i + 1], e = pts[Math.min(pts.length - 1, i + 2)]; for (let t = 0; t < 1; t += 0.2) { const t2 = t * t, t3 = t2 * t; sm.push([0, 1].map((k) => 0.5 * (2 * b[k] + (-a[k] + d[k]) * t + (2 * a[k] - 5 * b[k] + 4 * d[k] - e[k]) * t2 + (-a[k] + 3 * b[k] - 3 * d[k] + e[k]) * t3)) as Pt); } }
  sm.push(pts[pts.length - 1]);
  const L: Pt[] = [], Rr: Pt[] = [];
  sm.forEach((q, i) => { const A = sm[Math.max(0, i - 1)], B = sm[Math.min(sm.length - 1, i + 1)], dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1; L.push([q[0] - (dy / l) * w / 2, q[1] + (dx / l) * w / 2]); Rr.push([q[0] + (dy / l) * w / 2, q[1] - (dx / l) * w / 2]); });
  const o = [...L, ...Rr.reverse()]; poly(p, c, o); E(p, o, 0.8, true, mixColor(c, '#10161c', 0.55));
};
export const potElev = (p: Painter, cx: number, gy: number, w: number, h: number) => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.7, w * 0.07, 100);
  poly(p, '#9aa0a6', R(cx - w / 2, gy - h, cx + w / 2, gy)); tintS(p, '#ffffff', 55, R(cx - w / 2 + 6, gy - h, cx - w * 0.2, gy)); tintS(p, '#10161c', 55, R(cx + w * 0.25, gy - h, cx + w / 2, gy));
  E(p, R(cx - w / 2, gy - h, cx + w / 2, gy), 1.1);
  poly(p, '#2c3034', ell(cx, gy - h, w / 2, w * 0.1, 14)); E(p, ell(cx, gy - h, w / 2, w * 0.1, 14), 1.0);
  poly(p, '#3b3f44', R(cx - w / 2 - w * 0.12, gy - h * 0.82, cx - w / 2, gy - h * 0.7)); poly(p, '#3b3f44', R(cx + w / 2, gy - h * 0.82, cx + w / 2 + w * 0.12, gy - h * 0.7));
};
export const milkBox = (p: Painter, cx: number, gy: number, w: number, h: number, c = '#e9e6dc', band = '#2f6fb0') => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.7, w * 0.08, 90);
  poly(p, c, R(cx - w / 2, gy - h, cx + w / 2, gy)); poly(p, band, R(cx - w / 2, gy - h * 0.62, cx + w / 2, gy - h * 0.3));
  poly(p, mixColor(c, '#9a9488', 0.3), [[cx - w / 2, gy - h], [cx, gy - h - w * 0.28], [cx + w / 2, gy - h], [cx, gy - h + w * 0.1]]);
  tintS(p, '#1d140e', 50, R(cx + w * 0.2, gy - h, cx + w / 2, gy)); E(p, R(cx - w / 2, gy - h, cx + w / 2, gy), 1.0);
};
export const yogurt = (p: Painter, cx: number, gy: number, w: number, h: number, c = '#c8587a') => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.6, w * 0.08, 90);
  poly(p, '#f1ede2', [[cx - w / 2, gy - h], [cx + w / 2, gy - h], [cx + w * 0.38, gy], [cx - w * 0.38, gy]]); poly(p, c, [[cx - w * 0.47, gy - h * 0.7], [cx + w * 0.47, gy - h * 0.7], [cx + w * 0.41, gy - h * 0.3], [cx - w * 0.41, gy - h * 0.3]]);
  poly(p, '#d9d4c8', ell(cx, gy - h, w / 2, w * 0.1, 12)); E(p, [[cx - w / 2, gy - h], [cx + w / 2, gy - h], [cx + w * 0.38, gy], [cx - w * 0.38, gy]], 1.0);
};
export const breadLoaf = (p: Painter, cx: number, gy: number, w: number, h: number) => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.6, w * 0.07, 90);
  poly(p, '#e9e0c6', R(cx - w / 2, gy - h, cx + w / 2, gy)); poly(p, '#c98c3d', ell(cx, gy - h * 0.62, w * 0.36, h * 0.3, 12)); tintS(p, '#ffffff', 55, R(cx - w / 2 + 4, gy - h, cx - w * 0.3, gy)); E(p, R(cx - w / 2, gy - h, cx + w / 2, gy), 1.0);
  poly(p, '#b8281f', R(cx - w / 2, gy - h, cx + w / 2, gy - h + 12));
};
export const lunchBox = (p: Painter, cx: number, gy: number, w: number, h: number) => {
  shadowAt(p, cx + w * 0.1, gy + 2, w * 0.65, w * 0.08, 90);
  poly(p, '#e8eef0', R(cx - w / 2, gy - h, cx + w / 2, gy)); poly(p, '#d7a02f', R(cx - w / 2, gy - h, cx + w / 2, gy - h + h * 0.22)); tintS(p, '#ffffff', 60, R(cx - w / 2, gy - h * 0.8, cx + w / 2, gy - h * 0.2)); tintS(p, '#1d140e', 40, R(cx + w * 0.3, gy - h, cx + w / 2, gy));
  stroke(p, 'HB', '#d98b3a', 2, [[cx - w * 0.3, gy - h * 0.45], [cx + w * 0.2, gy - h * 0.45]], 0.05); E(p, R(cx - w / 2, gy - h, cx + w / 2, gy), 1.0);
};
/** Plant in a pot, standing in the frame foreground (kit set plant). */
export const fgPlant = (p: Painter, x: number, y: number, s: number, variant = 0) => { tintS(p, '#2d2119', 70, ell(x, y, s * 0.2, s * 0.03, 16)); plant(p, affine(x, y, s), 0.6, variant); };
export {morning, affine, contact, doorLeaf, fillF, floorMap, glazeS, stroke, surface, tileFloor, tintS, umbrella, woodGrain, crack, washAt, hardFill, ell, hex2};
function hex2(a: string, b: string, k: number) { return mixColor(a, b, k); }
export type {M};

/** POV forearm rising from the frame's bottom edge: sleeve from `from` (off-frame) to 0.30k below the wrist, bare forearm to the wrist, mitten hand along the arm. */
export const povArm = (p: Painter, from: Pt, wrist: Pt, k: number, kind: 'fist' | 'open', side: 1 | -1, o: {sleeve?: string; tilt?: number; fore?: number; hs?: number} = {}) => {
  const hk = k * (o.hs ?? HS), skin = SKIN, dark = mixColor(skin, '#2a1e18', 0.5), sl = o.sleeve ?? '#5d7385';
  // R3-fix: POV arm with a real elbow (bowed outward), upper arm wide near the camera and narrowing (foreshortening), forearm a belly that tapers to the wrist.
  const ang = Math.atan2(wrist[1] - from[1], wrist[0] - from[0]), L = Math.hypot(wrist[0] - from[0], wrist[1] - from[1]);
  const ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy * -side, ny = ux * -side; // normal pointing outward (away from the body centre line)
  // ZC2-R2 fix: `fore` (x k) sets the bare forearm length from the wrist (natural ~0.27), so a long reach shows sleeve, not an overlong forearm
  const eAt = o.fore !== undefined ? Math.max(L - o.fore * k, L * 0.1) : L * 0.5;
  const el: Pt = [from[0] + ux * eAt + nx * 0.07 * k, from[1] + uy * eAt + ny * 0.07 * k];
  const ea = Math.atan2(wrist[1] - el[1], wrist[0] - el[0]);
  const sleeve = shapedLimb(from, [el[0] + Math.cos(ea) * 0.06 * k, el[1] + Math.sin(ea) * 0.06 * k], 0.17 * k, 0.1 * k, {bulge: 0.01 * k, peak: 0.35, capB: false, flare: 0.015 * k});
  const cut: Pt = [el[0] + Math.cos(ea) * 0.06 * k, el[1] + Math.sin(ea) * 0.06 * k];
  const arm = shapedLimb([cut[0] - Math.cos(ea) * 0.04 * k, cut[1] - Math.sin(ea) * 0.04 * k], wrist, 0.085 * k, wristW(k, o.hs ?? HS), {bulge: 0.016 * k, peak: 0.3, capB: false});
  poly(p, skin, arm); tintS(p, '#6a3d22', 55, arm.slice(0, Math.floor(arm.length / 2))); tintS(p, '#fff1d0', 40, arm.slice(Math.floor(arm.length / 2))); E(p, arm, 1.0, true, dark);
  poly(p, sl, sleeve); tintS(p, '#10161c', 50, sleeve.slice(Math.floor(sleeve.length / 2))); E(p, sleeve, 1.0, true, mixColor(sl, '#10161c', 0.6));
  // elbow fold wedges on the inner side of the bend
  E(p, [[el[0] - nx * 0.05 * k - ux * 0.05 * k, el[1] - ny * 0.05 * k - uy * 0.05 * k], [el[0] - nx * 0.02 * k, el[1] - ny * 0.02 * k], [el[0] - nx * 0.05 * k + ux * 0.05 * k, el[1] - ny * 0.05 * k + uy * 0.05 * k]], 1.2, false, mixColor(sl, '#10161c', 0.6));
  const a2 = ang + (o.tilt ?? 0);
  handShape(p, wrist, a2, hk, kind, side, skin);
  void L;
};

/** Day-3 face: visible stubble (dark glaze over the jaw and chin plus short flecks) and messy hair tufts, painted over a kit figure (`a` = its anchors). `turn` shifts the face toward the head turn (-1 left .. 1 right). */
export const stubbleOver = (p: Painter, a: {head: Pt; headTop: number; chin: number}, seed = 1, strength = 1, turn = 0) => {
  const ry = a.head[1] - a.headTop, hh = ry * 2, hw = hh * 0.36, cx = a.head[0] + turn * hw * 0.35, jy = a.head[1] + ry * 0.62;
  tintS(p, '#2a2220', Math.round(34 * strength), ell(cx, jy, hw * 0.8, ry * 0.3, 18));
  for (let i = 0; i < 46; i++) { const u = ((i * 37 + seed * 13) % 100) / 100, v = ((i * 61 + seed * 7) % 100) / 100; const x = cx + (u - 0.5) * hw * 1.6, y = jy - ry * 0.28 + v * ry * 0.55; if (((x - cx) / (hw * 0.86)) ** 2 + ((y - jy) / (ry * 0.34)) ** 2 > 1) continue; stroke(p, 'HB', '#2a2220', 1.3, [[x, y], [x + 1.5, y + ry * 0.05]], 0.02); }
};
export const messyHair = (p: Painter, a: {head: Pt; headTop: number; chin: number}, color = '#1d1b1a', seed = 1) => {
  const ry = a.head[1] - a.headTop, hh = ry * 2, rx = hh * 0.37, cx = a.head[0];
  for (let i = 0; i < 9; i++) {
    const th = -Math.PI * (0.1 + 0.8 * (i / 8)), hsh = ((i * 53 + seed * 29) % 100) / 100;
    const bx = cx + Math.cos(th) * rx * 0.97, by = a.head[1] + Math.sin(th) * ry * 0.97, nx = Math.cos(th), ny = Math.sin(th);
    const len = hh * (0.05 + 0.07 * hsh), sd = (hsh - 0.5) * 1.8, tx = bx + (nx + sd * -ny) * len, ty = by + (ny + sd * nx) * len, w = hh * (0.05 + 0.03 * hsh);
    poly(p, color, [[bx - ny * w - nx * 0.02 * hh, by + nx * w - ny * 0.02 * hh], [tx, ty], [bx + ny * w - nx * 0.02 * hh, by - nx * w - ny * 0.02 * hh]]);
  }
};
