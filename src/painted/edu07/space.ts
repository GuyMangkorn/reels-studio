import {clipHalf, ell, hardFill, INK, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {clip, type Rect} from '../kit/world';
import {camDist, camPoint, camUnit, type YCam} from '../kit/ycam';
import {paintStars} from './stars';

// SET-SPACE (brief EDU-EP07-BRIEF-R1 set plan, W3 look frames): schematic units (1 su = Earth's orbit radius, body sizes stylised), seen through
// the kit yaw camera so the orbit is a tilted ellipse. Origin = the Sun's centre (the empty spot after the vanish); the orbital plane is y 0;
// angle phi: x = R cos phi, z = -R sin phi. `rect` confines every mark to a panel (the split frame's top panel).
const DEG = Math.PI / 180;

/** Camera looking down at `at` from elevation `el` degrees, azimuth `az` degrees (0 = on +z), distance `r` su. */
export const spaceCam = (at: V3, azDeg: number, elDeg: number, r: number, f: number, hy: number): YCam => {
  const az = azDeg * DEG, el = elDeg * DEG;
  return {x: at[0] + r * Math.sin(az) * Math.cos(el), y: at[1] + r * Math.sin(el), z: at[2] + r * Math.cos(az) * Math.cos(el), yaw: -az, pitch: -el, f, hy};
};
export const T_SPACE: V3 = [0.3, 0, 0.3];

export const SP = {bg: '#070b1a', neb1: '#141a3a', neb2: '#23204a', orbit: '#e9dcb8', ring: '#f5e7c0', dash: '#ffe08a', sunCore: '#fff4c2', sunHalo: '#ffb347',
  ocean: '#3f7fbf', land: '#6fae5a', cloud: '#f4f6f8', night: '#0f1a2e', city: '#ffd37a', rim: '#7fb2ff', star: '#fff6e0'};
export const SUN_R = 0.2, EARTH_R = 0.11;
export const earthAt = (phiDeg: number, R = 1): V3 => [R * Math.cos(phiDeg * DEG), 0, -R * Math.sin(phiDeg * DEG)];

export type SpaceOpts = {
  rect?: Rect; t: number;
  /** Sun brightness 0..1 (0 = gone, the empty spot). */
  sun?: number;
  /** Earth's orbital angle (deg). */
  earthPhi?: number;
  /** News-front ring radius in su (absent = none); the dash stream's tail follows it. */
  ring?: number;
  /** Earth disc scale (look frame LF04 v2: 1.4). */
  earthK?: number;
  /** Light dashes stream toward Earth: inner end radius in su (0 = from the Sun). */
  beamFrom?: number;
  /** Radial sparse dashes in other directions (pre-vanish, diagram of "light everywhere"). */
  spray?: boolean;
  /** Earth's day side darkening 0..1 (1 = dark, city specks). */
  dark?: number;
  /** Nebula wash level (0..1). */
  nebula?: number;
  seed?: number;
  /** Earth's centre in su, overriding `earthPhi` (the straight departure of B04-SH03). */
  earthPos?: V3;
  /** Ring colour level 0..1 (fade-out) and drawing it over Earth's disc (the day-side wipe at 00:00). */
  ringAlpha?: number;
  ringOver?: boolean;
  /** Exact inner end of the dash stream in su (the stream's tail sits on the ring); with `beamFrom` unset the stream is not drawn. */
  beamTail?: number;
  /** Phase 0..1 of the dash flow (dashes slide toward Earth). */
  flow?: number;
  /** Extra marks painted after Earth (trail, Jupiter, replay streams) in the same panel. */
  after?: (p: Painter, c: YCam, rect: Rect) => void;
  /** Extra marks painted before the Sun and Earth (behind them). */
  before?: (p: Painter, c: YCam, rect: Rect) => void;
};

const inside = (q: Pt | null, [x0, y0, x1, y1]: Rect, pad = 0): q is Pt => !!q && q[0] > x0 + pad && q[0] < x1 - pad && q[1] > y0 + pad && q[1] < y1 - pad;

/** The Sun (W5.3 G3): a painted disc, not a flat circle: a corona of tapered rays that breathe slowly, a deeper orange limb, a lit body, a hot core with an off-centre highlight, a few granulation blots and a thin warm outline. `lvl` 0..1 mixes everything toward the sky. */
const paintSun = (p: Painter, sp: Pt, r: number, lvl: number, bg: string, t: number) => {
  const m = (c: string, k = 1) => mixColor(bg, c, Math.min(1, lvl * k));
  const rays = 16;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + 0.2 + 0.03 * Math.sin(t * 0.8 + i), long = i % 2 === 0, br = 1 + 0.07 * Math.sin(t * 1.6 + i * 2.3);
    const r0 = r * 0.92, r1 = r * (long ? 1.62 : 1.32) * br, hw = long ? 0.11 : 0.085, c = Math.cos(a), sn = Math.sin(a), cp = Math.cos(a + Math.PI / 2), sp2 = Math.sin(a + Math.PI / 2);
    const base = (k: number): Pt => [sp[0] + c * r0 + cp * r * hw * k, sp[1] + sn * r0 + sp2 * r * hw * k];
    hardFill(p, 832 + i, m(long ? '#ffcf6b' : '#ffb347', long ? 0.8 : 0.6), [base(-1), [sp[0] + c * r1, sp[1] + sn * r1], base(1)]);
  }
  hardFill(p, 849, m('#f0862a'), ell(sp[0], sp[1], r, r, 36));
  hardFill(p, 850, m('#ffbd4f'), ell(sp[0] - r * 0.03, sp[1] - r * 0.03, r * 0.9, r * 0.9, 36));
  hardFill(p, 841, m(SP.sunCore), ell(sp[0] - r * 0.07, sp[1] - r * 0.07, r * 0.68, r * 0.68, 30));
  hardFill(p, 851, m('#fffbe6'), ell(sp[0] - r * 0.2, sp[1] - r * 0.22, r * 0.26, r * 0.22, 18));
  const blots: [number, number, number][] = [[0.42, 0.55, 0.12], [-0.5, 0.2, 0.1], [0.12, -0.6, 0.09], [-0.2, 0.64, 0.08], [0.6, -0.15, 0.07]];
  blots.forEach(([bx, by, br2], i) => hardFill(p, 852 + i, m('#ffb347'), ell(sp[0] + bx * r, sp[1] + by * r, br2 * r * 1.3, br2 * r, 12)));
  const rim = ell(sp[0], sp[1], r, r, 36);
  p.ink(860, 'rotring', m('#d9741f', 0.8), 0.8); p.brush.spline([...rim, rim[0]], 0.1);
};

/** A planet disc with its day/night terminator toward the Sun (px frame): ocean, land, cloud, night half, city specks, thin rim. */
export const paintEarth = (p: Painter, cx: number, cy: number, r: number, sun: Pt, o: {dark?: number; seed?: number; rect?: Rect} = {}) => {
  const seed = o.seed ?? 1, dk = o.dark ?? 0;
  const dir: Pt = [sun[0] - cx, sun[1] - cy], dl = Math.hypot(dir[0], dir[1]) || 1, d: Pt = [dir[0] / dl, dir[1] / dl];
  washAt(p, 700 + seed, SP.rim, 60, ell(cx, cy, r * 1.22, r * 1.22, 22), 0.6, 0.3);
  hardFill(p, 710 + seed, SP.ocean, ell(cx, cy, r, r, 30));
  // land and cloud inside 0.7 r
  const land: [number, number, number, number, number][] = [[-0.25, -0.15, 0.32, 0.22, 0.3], [0.3, 0.2, 0.26, 0.2, -0.5], [-0.1, 0.42, 0.2, 0.1, 0.1], [0.38, -0.38, 0.14, 0.1, 0.4]];
  land.forEach(([x, y, rx, ry, a], i) => hardFill(p, 720 + seed * 10 + i, SP.land, ell(cx + x * r, cy + y * r, rx * r, ry * r, 12, a)));
  [[-0.35, 0.3, 0.3, 0.07, -0.2], [0.2, -0.1, 0.34, 0.07, 0.3]].forEach(([x, y, rx, ry, a], i) => hardFill(p, 740 + seed * 10 + i, mixColor(SP.ocean, SP.cloud, 0.8), ell(cx + x * r, cy + y * r, rx * r, ry * r, 12, a)));
  // night half: the side facing away from the Sun, bulging toward it by (0.25 + dk) of the radius
  const disc = ell(cx, cy, r, r, 40);
  const side = clipHalf(disc, [-d[0], -d[1]], -(d[0] * cx + d[1] * cy) - dk * r * 1.05);
  if (side.length) hardFill(p, 760 + seed, mixColor(SP.ocean, SP.night, 0.85), side);
  if (side.length) { // city specks on the night side
    for (let i = 0; i < 7; i++) {
      const a = 0.9 + i * 0.7, rr = r * (0.25 + 0.45 * ((i * 37) % 10) / 10), q: Pt = [cx - d[0] * rr * 0.7 + Math.cos(a) * rr * 0.55, cy - d[1] * rr * 0.7 + Math.sin(a) * rr * 0.55];
      if (Math.hypot(q[0] - cx, q[1] - cy) < r * 0.82 && (q[0] - cx) * -d[0] + (q[1] - cy) * -d[1] > -r * 0.05) hardFill(p, 770 + seed * 10 + i, SP.city, ell(q[0], q[1], Math.max(1.3, r * 0.04), Math.max(1.3, r * 0.04), 6));
    }
  }
  p.ink(780 + seed, 'rotring', mixColor(SP.rim, SP.bg, 0.2), 0.8);
  p.brush.spline([...disc, disc[0]], 0.1);
};

/** A dashed 3-point stroke along a straight world segment (≥3 points per stroke, DF-20261030-projectpoly-two-point-line). */
export const dashAlong = (p: Painter, c: YCam, id: number, a: V3, b: V3, col: string, w: number, rect: Rect) => {
  const m: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], qs = [a, m, b].map((v) => camPoint(c, v));
  if (qs.every((q) => inside(q, rect, 2))) inkLine(p, id, qs as Pt[], {closed: false, weight: w, color: col, curve: 0.02, still: true});
};

export const paintSpace = (p: Painter, c: YCam, o: SpaceOpts): {earth: Pt | null; sun: Pt | null; sunR: number; earthR: number; ring: Pt[] | null} => {
  const rect: Rect = o.rect ?? [0, 0, 1080, 1920], [x0, y0, x1, y1] = rect, sun = o.sun ?? 1, phi = o.earthPhi ?? -60;
  const bg = SP.bg;
  // panel base (exact rect, hard edges) + nebula washes kept inside the panel
  hardFill(p, 800, bg, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
  paintStars(p, c, mixColor(bg, SP.neb1, 0.5), {seed: o.seed ?? 21, count: 230, t: o.t, rect, big: 0.07});
  const S: V3 = [0, 0, 0], E = o.earthPos ?? earthAt(phi), sp = camPoint(c, S), ep = camPoint(c, E);
  const orbitCol = mixColor(bg, SP.orbit, 0.62), beamCol = SP.dash;
  const orbit = (back: boolean) => {
    for (let i = 0; i < 72; i += 2) {
      const a = (i / 72) * 360, v = (j: number): V3 => earthAt(a + j * 5);
      if ((v(0.5)[2] < 0) !== back) continue;
      const qs = [v(0), v(0.5), v(1)].map((w) => camPoint(c, w));
      if (qs.every((q) => inside(q, rect, 2))) inkLine(p, 820 + i, qs as Pt[], {closed: false, weight: 1.7, color: orbitCol, curve: 0.02, still: true});
    }
  };
  const ringPts = (R: number, back: boolean) => Array.from({length: 73}, (_, i) => earthAt((i / 72) * 360, R)).filter((v) => (v[2] < 0) === back);
  orbit(true);
  // news-front ring (back arc, then front arc after the Sun)
  const ringBack = (R: number) => {
    const pts = Array.from({length: 73}, (_, i) => earthAt((i / 72) * 360, R)), qs: (Pt | null)[] = pts.map((w) => camPoint(c, w));
    return {pts, qs};
  };
  void ringPts;
  // sun (halo + disc), drawn before the front half of everything
  if (sun > 0.01 && sp) {
    const r = SUN_R * camUnit(c, S);
    paintSun(p, sp, r, sun, SP.bg, o.t ?? 0);
  }
  // light dashes toward Earth (beam) and sparse radial ones
  const dashStream = (dir: V3, from: number, to: number, count: number, id: number, lvl: number) => {
    for (let i = 0; i < count; i++) {
      const u0 = from + ((to - from) * i) / count, u1 = u0 + ((to - from) / count) * 0.45;
      dashAlong(p, c, id + i, [dir[0] * u0, 0, dir[2] * u0], [dir[0] * u1, 0, dir[2] * u1], mixColor(bg, beamCol, lvl), 3.0, rect);
    }
  };
  const eLen = Math.hypot(E[0], E[2]), eDir: V3 = [E[0] / eLen, 0, E[2] / eLen];
  if (o.spray) for (let k = 0; k < 9; k += 2) { const a = phi + 40 * (k - 4) + 12; if (Math.abs(((a - phi) % 360 + 360) % 360) < 6) continue; dashStream(earthAt(a), Math.max(0.32, (o.ring ?? 0) + 0.04), 0.9, 4, 900 + k * 10, 0.42); }
  if (o.beamTail !== undefined) {
    // dashes flow toward Earth between the tail (on the ring) and 0.9 su; pitch 0.12 su, dash 0.05 su, phase slides them outward
    const tail = o.beamTail, pitch = 0.12, ph = (o.flow ?? 0) * pitch;
    for (let i = -1; i < 12; i++) {
      const u0 = tail + i * pitch + ph, u1 = u0 + 0.05;
      if (u1 < tail || u0 > 0.9) continue;
      const a = Math.max(u0, tail), b = Math.min(u1, 0.9);
      if (b - a < 0.012) continue;
      const fade = Math.min(1, (a - tail) / 0.06 + 0.35);
      dashAlong(p, c, 1000 + (i + 1), [eDir[0] * a, 0, eDir[2] * a], [eDir[0] * b, 0, eDir[2] * b], mixColor(bg, beamCol, 0.95 * fade), 3.0, rect);
    }
  } else if (o.beamFrom !== undefined) dashStream(eDir, Math.max(o.beamFrom, SUN_R + 0.1), 0.9, 7, 1000, 0.95);
  o.before?.(p, c, rect);
  // ring: radius R, drawn as one polyline (2 px, soft)
  let ringOut: Pt[] | null = null;
  const drawRing = () => {
    if (o.ring === undefined || o.ring <= 0 || (o.ringAlpha ?? 1) <= 0.01) return;
    const {qs} = ringBack(o.ring), ok = qs.filter((q): q is Pt => inside(q, rect, 2));
    if (ok.length > 3) { ringOut = ok; p.ink(1100, 'rotring', mixColor(bg, SP.ring, 0.85 * (o.ringAlpha ?? 1)), 2.4); p.brush.spline([...ok], 0.1); }
  };
  if (!o.ringOver) drawRing();
  orbit(false);
  // Earth
  let eR = 0;
  if (ep) {
    eR = EARTH_R * (o.earthK ?? 1) * camUnit(c, E);
    const sp2 = sp ?? [540, 0];
    paintEarth(p, ep[0], ep[1], eR, sp2, {dark: o.dark ?? 0});
  }
  if (o.ringOver) drawRing();
  o.after?.(p, c, rect);
  void camDist; void clip; void INK;
  return {earth: ep, sun: sp, sunR: SUN_R * camUnit(c, S), earthR: eR, ring: ringOut};
};

/** Dashes along a straight world segment a -> b between distances s0..s1 (su) from a, pitch `pitch`, dash length `len`: the replay streams of B04-SH06 and the Earth trail. */
export const dashRun = (p: Painter, c: YCam, rect: Rect, id: number, a: V3, b: V3, s0: number, s1: number, o: {pitch?: number; len?: number; col?: string; w?: number; lvl?: number} = {}) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) || 1, pitch = o.pitch ?? 0.12, len = o.len ?? 0.05, d: V3 = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, (b[2] - a[2]) / L];
  const col = mixColor(SP.bg, o.col ?? SP.dash, o.lvl ?? 0.95);
  const k0 = Math.ceil((s0 - len) / pitch), k1 = Math.floor(s1 / pitch);
  for (let k = k0; k <= k1; k++) {
    const u0 = Math.max(k * pitch, s0), u1 = Math.min(k * pitch + len, s1);
    if (u1 - u0 < 0.012) continue;
    dashAlong(p, c, id + (k - k0), [a[0] + d[0] * u0, a[1] + d[1] * u0, a[2] + d[2] * u0], [a[0] + d[0] * u1, a[1] + d[1] * u1, a[2] + d[2] * u1], col, o.w ?? 3.0, rect);
  }
};

/** Jupiter as a banded disc lit only on its Sun-facing half (`lit` 0..1 fades the lit half to the dark disc). Sun at `sunPx`. */
export const paintJupiter = (p: Painter, cx: number, cy: number, r: number, sunPx: Pt, lit: number) => {
  const dir: Pt = [sunPx[0] - cx, sunPx[1] - cy], dl = Math.hypot(dir[0], dir[1]) || 1, d: Pt = [dir[0] / dl, dir[1] / dl];
  const darkC = '#2a2740', litC = '#e0c39a', band = '#b98a62', band2 = '#cfa478';
  const disc = ell(cx, cy, r, r, 36);
  hardFill(p, 6100, darkC, disc);
  const half = clipHalf(disc, d, d[0] * cx + d[1] * cy);
  if (half.length > 2) {
    hardFill(p, 6101, mixColor(darkC, litC, lit), half);
    // bands: horizontal strips clipped to the lit half
    [[-0.45, -0.22, band], [0.05, 0.28, band2], [0.5, 0.64, band]].forEach(([y0, y1, col], i) => {
      const strip = clipHalf(clipHalf(half, [0, 1], cy + (y0 as number) * r), [0, -1], -(cy + (y1 as number) * r));
      if (strip.length > 2) hardFill(p, 6110 + i, mixColor(darkC, col as string, lit), strip);
    });
  }
  p.ink(6120, 'rotring', mixColor(SP.bg, '#e0c39a', 0.35 + 0.2 * lit), 0.8);
  p.brush.spline([...disc, disc[0]], 0.1);
};
