import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {sub3, type V3} from '../kit/space';
import {hull, wp} from '../kit/world';
import {camPoint, type YCam} from '../kit/ycam';
import {CAR, ghPt, ghQuad, greenhouseFaces, windowPolys, WINDOWS} from './car';
import {DRIVER_HIP} from './cast';
import {TONE_LIVE, type Tone} from './road';

// CAR21 cabin (brief N1 cabin part: seats, wheel, lining, pillars, cluster, radio screen with button, dash glow on/off), Film W3.1
// look-frame build 2026-11-16, rough prototype for the look lock; Boss hardens. Right-hand drive: DRIVER on +z. Painted from inside the
// greenhouse (every greenhouse face is seen from its back, so frames and lining paint with no culling), then far-to-near: doors, dash,
// cluster, wheel, console, the driver's seat cushion, DRIVER, then both seat backs and their headrests (passenger side a shade darker, UT12a).
// Estimates (revised for the four-head card with the exterior): wheel centre (+0.30, 0.95, +0.38) r 0.18 tilted 25 deg; cluster hood
// x 0.50-0.70, z 0.22-0.54; radio screen x 0.52, y 0.82-0.94, z -0.10..+0.10; seat backs to y 0.92 (front face x -0.30 at the hip line,
// 8 deg lean, 0.13 thick), headrests x -0.40..-0.52, y 0.98-1.14 (BRIEF-R3, round 2; R2 had y 0.86 / 0.90-0.99 and read as standing).

export type CabinOpts = {t: number; tone?: Tone; dashGlow?: boolean; driver?: (p: Painter, c: YCam) => void; seed?: number;
  // Boss W5.2 BG2 (2026-11-16), all opt-in so the locked LF02 still paints exactly as approved:
  /** Rain runs down the glass on `t` (seek-safe, a pure function of t); absent = the still streaks of the look frame. */
  rainRun?: boolean;
  /** Faint cool sheen on the roof lining and both A-pillars, 0..1 (1 = about +8 % value; B01-SH04 "รอบคุณ"). */
  sheen?: number;
  /** Lens family for the paint order. 'rear' (default, LF02/SH04/SH09): seat backs after DRIVER. 'side' (SH12, lens in the passenger
   *  seat): her seat back before her, the console after her, no passenger seat back (the lens sits in it). */
  lens?: 'rear' | 'side';
  /** Radio unit with its screen and power button (RADIO_BUTTON): screen light 0..1 (the SH09 flicker), button press 0..1. Absent = the
   *  look frame's plain dark radio. */
  radio?: {light: number; press: number};
  /** One-lens cheat (Boss, recorded per shot; `paintCabinFront` only): the dash front edge, the cluster hood and the wheel lowered by
   *  `dashDy` m (negative), so the four-head card's chest shows over the dash from a front lens (B02-SH05). */
  cheat?: {dashDy?: number};
};

/** Radio power button centre, space R (EDU-EP21-SHEETS-R1 units, est, new); the N4 reach target. Boss W5.2 BG2 measured the four-head
 *  reach to it with the sheet's 10 deg forward / 8 deg inboard lean (driver.ts `B04_DRIVER`), so the fallback (0.519, 0.86, +0.11) is not used. */
export const RADIO_BUTTON: V3 = [0.519, 0.85, 0.08];

const ok = (q: Pt[]) => q.length >= 3;
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** A six-faced block from 8 corners (bottom ring then top ring, same order); faces toward the lens painted, shaded by their normal (light from above). */
export const paintBlock = (p: Painter, c: YCam, seed: number, k: V3[], color: string, T: Tone = TONE_LIVE) => {
  const ctr = k.reduce<V3>((s, v) => [s[0] + v[0] / 8, s[1] + v[1] / 8, s[2] + v[2] / 8], [0, 0, 0]);
  const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]].map((ix) => ix.map((i) => k[i]));
  faces.forEach((f, i) => {
    const fc = f.reduce<V3>((s, v) => [s[0] + v[0] / 4, s[1] + v[1] / 4, s[2] + v[2] / 4], [0, 0, 0]);
    const a = sub3(f[1], f[0]), b = sub3(f[2], f[0]);
    let n: V3 = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const l = Math.hypot(...n) || 1; n = [n[0] / l, n[1] / l, n[2] / l];
    if (dot(n, sub3(fc, ctr)) < 0) n = [-n[0], -n[1], -n[2]];
    if (dot(n, sub3([c.x, c.y, c.z], fc)) <= 0) return;
    const q = wp(c, f);
    if (!ok(q)) return;
    hardFill(p, seed + i, T(mixColor(color, n[1] > 0.5 ? '#6f7c8a' : '#0c0e11', n[1] > 0.5 ? 0.22 : 0.25 * (1 - Math.abs(n[0])))), q);
  });
};
export const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): V3[] => [
  [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];

export const paintCabin = (p: Painter, c: YCam, o: CabinOpts) => {
  const T = o.tone ?? TONE_LIVE, S = (o.seed ?? 0) + 40000;
  const lining = T(CAR.lining);
  // glass first (world is already painted behind it): a faint tint and running rain on every pane
  greenhouseFaces().forEach((f, i) => {
    (WINDOWS[f.kind] ?? []).forEach(([s0, s1, v0, v1], j) => {
      const wq = wp(c, ghQuad(f.kind, s0, s1, v0, v1));
      if (!ok(wq)) return;
      washAt(p, S + 10 + i * 4 + j, T('#2f3a48'), 60, wq, 0.05, 0.2);
      for (let k = 0; k < 26; k++) {
        const s = s0 + (s1 - s0) * hash(S + 100 + k * 5 + i * 131 + j * 37), h = hash(S + 101 + k * 5 + i * 131 + j * 37);
        // running rain: each streak slides down the pane at its own speed and wraps (0.25-0.45 of the pane per second)
        const v = v0 + (v1 - v0) * (o.rainRun ? 0.2 + 0.8 * (1 - (((h + o.t * (0.25 + 0.2 * hash(S + 103 + k + i * 7))) % 1) + 1) % 1) : 0.2 + 0.8 * h);
        const len = 0.05 + 0.12 * hash(S + 102 + k + i * 7);
        const pts: Pt[] = [];
        for (let m = 0; m <= 4; m++) {
          const q = camPoint(c, ghPt(f.kind, s + 0.006 * Math.sin(m * 1.7 + k), Math.max(v0, v - (len * m) / 4 / 0.55)));
          if (q) pts.push(q);
        }
        if (pts.length >= 2) inkLine(p, S + 300 + i * 70 + j * 35 + k, pts, {closed: false, color: T('#a7b6c4'), weight: 1.3, still: true, curve: 0.4});
      }
    });
  });
  // pillars, rails and the roof lining (all greenhouse faces, seen from inside)
  greenhouseFaces().forEach((f, i) => {
    const wins = WINDOWS[f.kind] ?? [];
    if (f.kind === 'roof') {
      // the lining runs on over the rear seats to the rear screen header (x -1.6), above and behind a rear-seat lens
      const q = wp(c, [[0.4, 1.46, -0.64], [0.4, 1.46, 0.64], [-1.6, 1.46, 0.64], [-1.6, 1.46, -0.64]]);
      if (ok(q)) hardFill(p, S + 600, T(mixColor(CAR.lining, '#6f7c8a', 0.12)), q);
      // the lining turns: lighter toward the windscreen (the sky's light), darker over the rear seat, with soft fabric strokes (R3)
      const fr = wp(c, [[0.4, 1.459, -0.64], [0.4, 1.459, 0.64], [-0.3, 1.459, 0.64], [-0.3, 1.459, -0.64]]);
      if (ok(fr)) washAt(p, S + 590, T('#7a8696'), 70, fr, 0.5, 0.35);
      const rr = wp(c, [[-0.7, 1.459, -0.64], [-0.7, 1.459, 0.64], [-1.6, 1.459, 0.64], [-1.6, 1.459, -0.64]]);
      if (ok(rr)) washAt(p, S + 591, T('#1d2026'), 90, rr, 0.5, 0.35);
      for (let k = 0; k < 9; k++) {
        const x = -1.2 + 0.17 * k, a = camPoint(c, [x, 1.459, -0.55]), b = camPoint(c, [x + 0.05, 1.459, 0.55]);
        if (a && b) inkLine(p, S + 592 + k, [a, b], {closed: false, weight: 0.7, color: T(mixColor(CAR.lining, '#262a30', 0.5)), curve: 0.3});
      }
      for (const s of [1, -1]) {
        const rail = wp(c, [[0.4, 1.46, s * 0.64], [-1.6, 1.46, s * 0.64], [-1.6, 1.2, s * 0.74], [0.4, 1.2, s * 0.74]]);
        if (ok(rail)) hardFill(p, S + 601 + (s > 0 ? 0 : 1), T(CAR.lining), rail);
      }
      return;
    }
    const cuts = [0, ...wins.flatMap(([a, b]) => [a, b]), 1];
    for (let k = 0; k < cuts.length; k += 2) if (cuts[k + 1] - cuts[k] > 0.001) hardFill(p, S + 610 + i * 10 + k, lining, wp(c, ghQuad(f.kind, cuts[k], cuts[k + 1], 0, 1)));
    wins.forEach(([s0, s1, v0, v1], j) => {
      hardFill(p, S + 650 + i * 10 + j, lining, wp(c, ghQuad(f.kind, s0, s1, v1, 1)));
      hardFill(p, S + 670 + i * 10 + j, T('#2b2f36'), wp(c, ghQuad(f.kind, s0, s1, 0, v0)));
    });
  });
  // the shell catches a faint cool sheen (SH04 on "รอบคุณ"): the lining over the front seats and both A-pillars, no glow
  if (o.sheen && o.sheen > 0) {
    // opacities measured on the SH04 clean frames (Boss W5.2 BG2, l67 -> l76): lining Y 75.7 -> 81.8 (+8.1 %), pillar crop 73.0 -> 76.9
    const k = Math.min(1, o.sheen);
    const lin = wp(c, [[0.4, 1.458, -0.64], [0.4, 1.458, 0.64], [-0.9, 1.458, 0.64], [-0.9, 1.458, -0.64]]);
    if (ok(lin)) washAt(p, S + 595, T('#b9c6d6'), Math.round(38 * k), lin, 0.4, 0.3);
    (['glassR', 'glassL'] as const).forEach((kind, i) => {
      const q = wp(c, ghQuad(kind, 0, 0.06, 0, 1));
      if (ok(q)) washAt(p, S + 596 + i, T('#c3cfdc'), Math.round(46 * k), q, 0.2, 0.3);
    });
  }
  // door panels (below the beltline) both sides, with an armrest line and a cool sill catch-light
  for (const s of [1, -1]) {
    const z = s * 0.8;
    const door = wp(c, [[1.0, 0.22, z], [-1.5, 0.22, z], [-1.5, 0.965, z], [1.05, 0.925, z]]);
    if (ok(door)) hardFill(p, S + 700 + (s > 0 ? 0 : 1), T('#2a2e35'), door);
    const arm = wp(c, [[0.7, 0.62, z - s * 0.02], [-0.4, 0.62, z - s * 0.02], [-0.4, 0.68, z - s * 0.06], [0.7, 0.68, z - s * 0.06]]);
    if (ok(arm)) hardFill(p, S + 702 + (s > 0 ? 0 : 1), T('#353a42'), arm);
    const sill = wp(c, [[1.0, 0.93, z - s * 0.005], [-1.5, 0.96, z - s * 0.005], [-1.5, 0.975, z - s * 0.005], [1.0, 0.945, z - s * 0.005]]);
    if (ok(sill)) hardFill(p, S + 704 + (s > 0 ? 0 : 1), T('#5d6876'), sill);
  }
  // floor
  const floor = wp(c, [[1.0, 0.2, -0.8], [-1.5, 0.2, -0.8], [-1.5, 0.2, 0.8], [1.0, 0.2, 0.8]]);
  if (ok(floor)) hardFill(p, S + 710, T('#1b1e23'), floor);
  // dashboard: top (picks up the windscreen sky), face, cluster hood, radio screen
  const dashTop = wp(c, [[0.52, 1.0, -0.79], [1.03, 0.93, -0.79], [1.03, 0.93, 0.79], [0.52, 1.0, 0.79]]);
  if (ok(dashTop)) hardFill(p, S + 720, T(mixColor(CAR.dash, '#5d6876', 0.25)), dashTop);
  const dashFace = wp(c, [[0.52, 0.6, -0.79], [0.52, 0.6, 0.79], [0.52, 1.0, 0.79], [0.52, 1.0, -0.79]]);
  if (ok(dashFace)) hardFill(p, S + 721, T(CAR.dash), dashFace);
  paintBlock(p, c, S + 730, box(0.5, 0.7, 1.0, 1.075, 0.22, 0.54), CAR.dash, T);
  const cluster = wp(c, [[0.519, 0.9, 0.24], [0.519, 0.9, 0.52], [0.519, 1.04, 0.52], [0.519, 1.04, 0.24]]);
  if (ok(cluster)) {
    hardFill(p, S + 740, T(o.dashGlow ? CAR.dashGlow : '#15181c'), cluster);
    for (const z of [0.31, 0.45]) {
      const ringPts = Array.from({length: 17}, (_, i) => camPoint(c, [0.518, 0.97 + 0.045 * Math.sin((i / 16) * 6.283), z + 0.045 * Math.cos((i / 16) * 6.283)])).filter((q): q is Pt => !!q);
      if (ringPts.length > 3) inkLine(p, S + 741 + (z > 0.4 ? 1 : 0), ringPts, {closed: false, color: T(o.dashGlow ? '#e8fbff' : '#2e333a'), weight: 0.9});
    }
  }
  const radio = wp(c, [[0.519, 0.82, -0.1], [0.519, 0.82, 0.1], [0.519, 0.94, 0.1], [0.519, 0.94, -0.1]]);
  if (ok(radio)) { hardFill(p, S + 745, T(o.dashGlow ? '#4fb8cc' : '#121417'), radio); inkLine(p, S + 746, radio, {weight: 0.8, color: T('#3a4048')}); }
  if (o.radio && ok(radio)) paintRadio(p, c, S + 1000, o.radio, !!o.dashGlow, T);
  const vent = wp(c, [[0.519, 0.95, -0.32], [0.519, 0.95, -0.14], [0.519, 0.985, -0.14], [0.519, 0.985, -0.32]]);
  if (ok(vent)) hardFill(p, S + 747, T('#111316'), vent);
  paintWheelUnit(p, c, S, T);
  paintRoofFurniture(p, c, S, T);
  // centre console and the driver's seat cushion (soft, low contrast: no lit top edges, LF02 viewer check R3)
  const seatCol = '#3a3d44';
  if (o.lens === 'side') {
    // lens in the passenger seat looking +z (SH12): her seat back and headrest are behind her (painted first, their side and front
    // faces), the console is between the lens and her (painted after her), and the passenger seat back is under the lens (skipped)
    softSeat(p, c, S + 810, {x: [-0.48, 0.08], y: [0.22, 0.38], z: [0.13, 0.63]}, CAR.seat, T);
    paintSeatBack(p, c, S + 820, 0.13, 0.63, seatCol, T, 'front');
    o.driver?.(p, c);
    softSeat(p, c, S + 800, {x: [-0.2, 0.5], y: [0.2, 0.42], z: [-0.09, 0.09]}, '#24272c', T);
    return;
  }
  softSeat(p, c, S + 800, {x: [-0.2, 0.5], y: [0.2, 0.42], z: [-0.09, 0.09]}, '#24272c', T);
  softSeat(p, c, S + 810, {x: [-0.48, 0.08], y: [0.22, 0.38], z: [0.13, 0.63]}, CAR.seat, T);
  o.driver?.(p, c);
  // seat backs to the shoulder (y 0.92, leaning back 8 deg) with headrests at head height (y 0.98-1.16) on two short posts: from the rear
  // seat her seat back covers her torso and her headrest sits against the back of her head, so she reads seated (LF02 viewer check, R3)
  paintSeatBack(p, c, S + 820, 0.13, 0.63, seatCol, T);
  paintSeatBack(p, c, S + 840, -0.63, -0.13, mixColor(seatCol, '#000000', 0.18), T);
};

/** Radio unit (Boss W5.2 BG2): a screen panel in the upper part of the radio face and the power button RADIO_BUTTON on the control strip
 *  under it. `light` lifts the screen toward its lit cyan (the SH09 flicker, 0.2 = 20 %); `press` sinks the button 4 mm and darkens it. */
const paintRadio = (p: Painter, c: YCam, seed: number, r: {light: number; press: number}, glow: boolean, T: Tone) => {
  const x = 0.5185;
  const scr = wp(c, [[x, 0.875, -0.088], [x, 0.875, 0.088], [x, 0.932, 0.088], [x, 0.932, -0.088]]);
  const lit = glow ? 1 : Math.max(0, Math.min(1, r.light));
  if (ok(scr)) { hardFill(p, seed, T(mixColor('#181c21', '#7fd6e8', 0.85 * lit)), scr); inkLine(p, seed + 1, scr, {weight: 0.7, color: T('#2c3138')}); }
  if (lit > 0.05 && ok(scr)) washAt(p, seed + 2, '#7fd6e8', Math.round(60 * lit), scr.map(([a, b]) => [a, b] as Pt), 0.6, 0.3);
  const [, by, bz] = RADIO_BUTTON, h = 0.014, bx = x - 0.004 * Math.max(0, Math.min(1, r.press));
  const btn = wp(c, [[bx, by - h, bz - h], [bx, by - h, bz + h], [bx, by + h, bz + h], [bx, by + h, bz - h]]);
  if (ok(btn)) { hardFill(p, seed + 3, T(mixColor('#3b4048', '#16181c', 0.6 * r.press)), btn); inkLine(p, seed + 4, btn, {weight: 0.8, color: T('#5a616b')}); }
  for (const z of [-0.07, -0.035, 0.0, 0.035]) {
    const k = wp(c, [[x, 0.84, z - 0.01], [x, 0.84, z + 0.01], [x, 0.858, z + 0.01], [x, 0.858, z - 0.01]]);
    if (ok(k)) hardFill(p, seed + 10 + Math.round(z * 100), T('#262a30'), k);
  }
};

/** A rounded seat block (cushion/console): hull of a rounded box, one body tone and a soft darker underside, no lit edges. */
const softSeat = (p: Painter, c: YCam, seed: number, b: {x: [number, number]; y: [number, number]; z: [number, number]}, color: string, T: Tone) => {
  const r = 0.04, pts: V3[] = [];
  for (const x of b.x) for (const y of b.y) for (const z of b.z) pts.push([x + (x === b.x[0] ? r : -r), y, z], [x, y + (y === b.y[0] ? r : -r), z], [x, y, z + (z === b.z[0] ? r : -r)]);
  const q = hull(pts.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v));
  if (!ok(q)) return;
  hardFill(p, seed, T(color), q);
  washAt(p, seed + 1, T('#121418'), 70, q.map(([x, y]) => [x, y + 0.25 * (Math.max(...q.map((v) => v[1])) - y)] as Pt), 0.3, 0.3);
};

/** Rounded outline (n points per corner) of a seat-back face at depth x(y), across z0..z1 and y0..y1. */
const roundRect = (xAt: (y: number) => number, z0: number, z1: number, y0: number, y1: number, r: number, n = 5): V3[] => {
  const out: V3[] = [];
  const corner = (cz: number, cy: number, a0: number) => { for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * (Math.PI / 2), y = cy + r * Math.sin(a); out.push([xAt(y), y, cz + r * Math.cos(a)]); } };
  corner(z1 - r, y1 - r, 0); corner(z0 + r, y1 - r, Math.PI / 2); corner(z0 + r, y0 + r, Math.PI); corner(z1 - r, y0 + r, Math.PI * 1.5);
  return out;
};

/** Seat back (rounded, leaning back) and its headrest on two posts, across z0..z1: the side thickness as one soft hull, then the rear face. */
const paintSeatBack = (p: Painter, c: YCam, seed: number, z0: number, z1: number, color: string, T: Tone, face: 'rear' | 'front' = 'rear') => {
  const front = (y: number) => -0.3 - 0.14 * (y - 0.34), d = 0.13;
  const rear = (y: number) => front(y) - d;
  const zm = (z0 + z1) / 2;
  // headrest posts, then the headrest (x -0.40..-0.52, y 0.98-1.16, 0.24 wide)
  for (const s of [-1, 1]) {
    const a = camPoint(c, [rear(0.92) + 0.06, 0.9, zm + s * 0.07]), b = camPoint(c, [rear(0.92) + 0.06, 1.0, zm + s * 0.07]);
    if (a && b) inkLine(p, seed + 10 + (s > 0 ? 1 : 0), [a, b], {closed: false, weight: 2.4, color: T('#1c1e22'), still: true});
  }
  const hx = (y: number) => -0.4 - 0.05 * (y - 0.98) / 0.18;
  const hrF = roundRect(hx, zm - 0.11, zm + 0.11, 0.98, 1.14, 0.06), hrB = roundRect((y) => hx(y) - 0.1, zm - 0.11, zm + 0.11, 0.98, 1.14, 0.06);
  const backF = roundRect(front, z0, z1, 0.34, 0.92, 0.09), backB = roundRect(rear, z0, z1, 0.34, 0.92, 0.09);
  const fill = (k: number, a: V3[], b: V3[], face: V3[]) => {
    const body = hull([...a, ...b].map((v) => camPoint(c, v)).filter((v): v is Pt => !!v));
    if (ok(body)) hardFill(p, seed + k, T(mixColor(color, '#0c0e11', 0.3)), body);
    const f = wp(c, face);
    if (!ok(f)) return;
    hardFill(p, seed + k + 1, T(color), f);
    // soft value turn: lighter toward the upper middle, no edge highlight
    const ys = f.map((v) => v[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), xs = f.map((v) => v[0]), xm = (Math.min(...xs) + Math.max(...xs)) / 2;
    washAt(p, seed + k + 2, T(mixColor(color, '#6f7c8a', 0.35)), 55, ell(xm, y0 + 0.3 * (y1 - y0), 0.32 * (Math.max(...xs) - Math.min(...xs)), 0.22 * (y1 - y0), 18), 0.5, 0.3);
    washAt(p, seed + k + 3, T('#121418'), 60, f.map(([x, y]) => [x, y + 0.5 * (y1 - y)] as Pt), 0.4, 0.3);
  };
  fill(0, backF, backB, face === 'front' ? backF : backB);
  fill(5, hrF, hrB, face === 'front' ? hrF : hrB);
  if (face === 'front') return;
  // two soft stitch lines down the rear face
  [0.3, 0.7].forEach((u, i) => {
    const z = z0 + (z1 - z0) * u, a = camPoint(c, [rear(0.45) - 0.002, 0.45, z]), b = camPoint(c, [rear(0.84) - 0.002, 0.84, z]);
    if (a && b) inkLine(p, seed + 20 + i, [a, b], {closed: false, weight: 0.8, color: T(mixColor(color, '#000000', 0.25))});
  });
};

/** Steering wheel unit (column, three spokes, hub, rim), centre (+0.30, 0.95, +0.38) r 0.18 tilted 25 deg; `dy` lowers it for one lens (SH05 cheat). */
/** Steering wheel and column (exported for the BG3 SH10 dash seen through the door glass). */
export const paintWheelUnit = (p: Painter, c: YCam, S: number, T: Tone, dy = 0) => {
  // steering wheel: rim as a ring of quads, three spokes, the column
  const wc: V3 = [0.3, 0.95 + dy, DRIVER_HIP[2]], e1: V3 = [0, 0, 1], e2: V3 = [0.42, 0.9, 0];
  const at = (r: number, a: number): V3 => [wc[0] + r * (Math.cos(a) * e1[0] + Math.sin(a) * e2[0]), wc[1] + r * (Math.cos(a) * e1[1] + Math.sin(a) * e2[1]), wc[2] + r * (Math.cos(a) * e1[2] + Math.sin(a) * e2[2])];
  const col = wp(c, [[0.52, 0.86 + dy, wc[2] - 0.04], [0.32, 0.93 + dy, wc[2] - 0.04], [0.32, 0.97 + dy, wc[2] + 0.04], [0.52, 0.9 + dy, wc[2] + 0.04]]);
  if (ok(col)) hardFill(p, S + 750, T('#1a1c20'), col);
  [Math.PI * 1.5, Math.PI * 0.1, Math.PI * 0.9].forEach((a, i) => {
    const q = wp(c, [at(0.03, a - 0.4), at(0.155, a - 0.12), at(0.155, a + 0.12), at(0.03, a + 0.4)]);
    if (ok(q)) hardFill(p, S + 751 + i, T('#202328'), q);
  });
  const hub = wp(c, Array.from({length: 12}, (_, i) => at(0.055, (i / 12) * 6.283)));
  if (ok(hub)) hardFill(p, S + 755, T('#26292e'), hub);
  for (let i = 0; i < 24; i++) {
    const a0 = (i / 24) * 6.283, a1 = ((i + 1) / 24) * 6.283;
    const q = wp(c, [at(0.15, a0), at(0.18, a0), at(0.18, a1), at(0.15, a1)]);
    if (ok(q)) hardFill(p, S + 760 + i, T(i > 3 && i < 9 ? '#3a3f47' : '#1c1e22'), q);
  }
};

/** Roof furniture that says "car" at a glance (mirror, visors, grab handles, dome light, lining seam). */
const paintRoofFurniture = (p: Painter, c: YCam, S: number, T: Tone) => {
  // roof furniture that says "car" at a glance: rear-view mirror on its stalk, two sun visors folded up, the dome light, a seam
  const stalk = wp(c, [[0.36, 1.44, -0.015], [0.36, 1.44, 0.015], [0.33, 1.34, 0.015], [0.33, 1.34, -0.015]]);
  if (ok(stalk)) hardFill(p, S + 770, T('#1c1e22'), stalk);
  const mirror = wp(c, [[0.32, 1.27, -0.13], [0.32, 1.27, 0.13], [0.31, 1.345, 0.13], [0.31, 1.345, -0.13]]);
  if (ok(mirror)) { hardFill(p, S + 771, T('#202328'), mirror); }
  const glassM = wp(c, [[0.305, 1.28, -0.115], [0.305, 1.28, 0.115], [0.3, 1.335, 0.115], [0.3, 1.335, -0.115]]);
  if (ok(glassM)) hardFill(p, S + 772, T('#5a6676'), glassM);
  for (const s of [1, -1]) {
    const v = wp(c, [[0.36, 1.445, s * 0.12], [0.36, 1.445, s * 0.55], [0.12, 1.445, s * 0.55], [0.12, 1.445, s * 0.12]]);
    if (ok(v)) { hardFill(p, S + 773 + (s > 0 ? 0 : 1), T('#4a4f58'), v); inkLine(p, S + 775 + (s > 0 ? 0 : 1), v, {weight: 0.8, color: T('#2a2d33')}); }
  }
  for (const s of [1, -1]) {
    const g = [[0.15, 1.33, s * 0.7], [-0.12, 1.33, s * 0.7], [-0.1, 1.37, s * 0.67], [0.13, 1.37, s * 0.67]].map((v) => camPoint(c, v as V3)).filter((v): v is Pt => !!v);
    if (g.length === 4) inkLine(p, S + 779 + (s > 0 ? 0 : 1), g, {closed: true, weight: 2, color: T('#25282e')});
  }
  const dome = wp(c, [[0.05, 1.455, -0.07], [0.05, 1.455, 0.07], [-0.03, 1.455, 0.07], [-0.03, 1.455, -0.07]]);
  if (ok(dome)) hardFill(p, S + 777, T('#4c525b'), dome);
  const seam = [camPoint(c, [-1.4, 1.459, -0.45]), camPoint(c, [0.3, 1.459, -0.45])];
  if (seam[0] && seam[1]) inkLine(p, S + 778, seam as Pt[], {closed: false, weight: 0.7, color: T('#30343b')});
};

/**
 * The cabin seen from outside through the windscreen (Boss W5.2 BG2, B02-SH05: lens over the bonnet looking -x). Call it inside
 * `paintCarExterior`'s `inside` painter (clipped to the greenhouse); the car paints the lower body, the glass, the rain beads and the
 * frame over it. Far to near for that lens: the grey storm light in the side glass and the rear screen, the roof lining seen from below,
 * both seat backs and headrests (front faces), DRIVER, the wheel, the dash top and the cluster hood, the roof furniture.
 */
export const paintCabinFront = (p: Painter, c: YCam, o: CabinOpts) => {
  const T = o.tone ?? TONE_LIVE, S = (o.seed ?? 0) + 40000;
  (['rear', 'glassR', 'glassL'] as const).forEach((k, i) => windowPolys(k).forEach((w, j) => {
    const q = wp(c, w);
    if (ok(q)) { hardFill(p, S + 1200 + i * 4 + j, T('#3d4856'), q); washAt(p, S + 1210 + i * 4 + j, T('#5b6878'), 70, q.map(([x, y]) => [x, y] as Pt), 0.4, 0.3); }
  }));
  const roof = wp(c, [[0.4, 1.46, -0.64], [0.4, 1.46, 0.64], [-1.6, 1.46, 0.64], [-1.6, 1.46, -0.64]]);
  if (ok(roof)) hardFill(p, S + 1220, T(mixColor(CAR.lining, '#1d2026', 0.35)), roof);
  const seatCol = '#3a3d44';
  paintSeatBack(p, c, S + 840, -0.63, -0.13, mixColor(seatCol, '#000000', 0.18), T, 'front');
  paintSeatBack(p, c, S + 820, 0.13, 0.63, seatCol, T, 'front');
  o.driver?.(p, c);
  const dy = o.cheat?.dashDy ?? 0;
  paintWheelUnit(p, c, S, T, dy);
  const dashTop = wp(c, [[0.52, 1.0 + dy, -0.79], [1.03, 0.93, -0.79], [1.03, 0.93, 0.79], [0.52, 1.0 + dy, 0.79]]);
  if (ok(dashTop)) hardFill(p, S + 720, T(mixColor(CAR.dash, '#5d6876', 0.25)), dashTop);
  paintBlock(p, c, S + 730, box(0.5, 0.7, 1.0 + dy, 1.075 + dy, 0.22, 0.54), CAR.dash, T);
  paintRoofFurniture(p, c, S, T);
};
