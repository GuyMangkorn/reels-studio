import {blob, ell, hardFill, inkLine} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint as camPointRaw, type YCam} from '../kit/ycam';
import {wp as wpRaw} from './world';

// EDU-EP02-SHORT asset N6 `eye-macro plate + sparks + tear wave` (brief EDU-BRIEF-R1.4 VD06, shot S01-B04-SH02). Written by
// Film as the LF03 look frame (W3.1 v1-v4, src/painted/edu02/macro.ts until v4); hardened by Boss at W5.2 (v5) after the
// viewer checks r1-r4 (scripts/edu-series/ep02/viewer-check-look-r1.md).
//   EYE set: 1 set-m ~ 1 cm; globe radius 0.16 centred at z -0.04 (front of the cornea at z +0.12), skin plane at z +0.07,
//   eye opening +-0.11 wide; the cook's left eye (outer corner at screen right). Not an anatomy diagram: no labels.
// Reusable: `paintEyeMacro(p, cam, state, look?)` paints the whole plate from any yaw camera around the origin (LF03_CAM in
// look.tsx is the shot's arc); `look` swaps the skin and iris palette for another cast member. `state.u` 0..1 runs the beat:
// mist lands (0.05-0.45), the gold nerve sparks x3 (0.28-0.62), the tear wave (0.5-0.92), one drop (0.85-1).
// Painting order (back to front): skin form, brow, lid and socket, eyeball (sclera, iris, pupil, lid shadow, nerve, haze,
// tear sheet, catchlight), lid rims (lash line, wet lower rim), lashes, mist wisps, drop.

const mix = mixColor;
const W = 1080, HGT = 1920;
const full: Pt[] = [[-200, -200], [W + 200, -200], [W + 200, HGT + 200], [-200, HGT + 200]];
const bump = (u: number, a: number, b: number) => (u <= a || u >= b ? 0 : Math.sin((Math.PI * (u - a)) / (b - a)));
const ramp = (u: number, a: number, b: number) => Math.max(0, Math.min(1, (u - a) / (b - a)));

/** Palette of the plate. `skin*` and `iris*` are the cast-dependent entries (`look` overrides them). */
export const EYEC = {
  skin: '#8a5a3b', skinDark: '#5e3a26', skinHi: '#b07a52', skinWarm: '#a0553c', skinCool: '#5c4a4c',
  sclera: '#efe7dc', scleraShade: '#9fa2ad', rim: '#9a6152', rimWet: '#b98479',
  iris: '#4a2f1c', irisLit: '#8c5e36', pupil: '#0d0806', nerve: '#f2c66d', lilac: '#a070ff', lilacEdge: '#eee6ff', lash: '#1b120d',
} as const;
export type EyeLook = Partial<Pick<typeof EYEC, 'skin' | 'skinDark' | 'skinHi' | 'skinWarm' | 'skinCool' | 'iris' | 'irisLit'>>;
export type EyeState = {t: number; u: number};

const GR = 0.16, GZ = -0.04, SKINZ = 0.07, EW = 0.11, EUP = 0.06, EDN = 0.05;
/** A point on the globe surface over (x, y). */
const onGlobe = (x: number, y: number, lift = 0): V3 => {
  const d = GR * GR - x * x - y * y;
  return [x, y, GZ + Math.sqrt(Math.max(0, d)) + lift];
};
const upperAt = (x: number) => {
  const u = (x + EW) / (2 * EW), s = Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
  return EUP * Math.pow(s, 0.8) * (1 + 0.18 * (0.5 - u)) + 0.006 * (u - 0.5);
};
const lowerAt = (x: number) => {
  const u = (x + EW) / (2 * EW), s = Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
  return -EDN * Math.pow(s, 0.9) * (1 - 0.15 * (0.5 - u));
};
/** Eye opening outline in the skin plane (upper lid arc, lower lid arc), outer corner at +x. */
const lidPts = (n = 28): V3[] => {
  const up: V3[] = [], dn: V3[] = [];
  for (let k = 0; k <= n; k++) {
    const x = -EW + (2 * EW * k) / n;
    up.push([x, upperAt(x), SKINZ]);
    dn.push([x, lowerAt(x), SKINZ]);
  }
  return [...up, ...dn.reverse()];
};
/** Upper lash-line thickness (set-m) at x: thin at the inner corner, a soft wing toward the outer corner. */
const lashTh = (x: number) => {
  const s = Math.max(0, Math.min(1, (x + EW) / (2 * EW)));
  return (0.0009 + 0.0036 * Math.pow(s, 0.9)) * Math.min(1, 1.25 * Math.pow(Math.sin(Math.PI * Math.min(0.97, s)), 0.35));
};
/** Lower lid margin (wet rim) thickness at x. */
const rimTh = (x: number) => 0.0038 * Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, (x + EW) / (2 * EW)))), 0.55);

/** A band between two picture polylines of equal length (top, bottom). */
const bandOf = (a: Pt[], b: Pt[]): Pt[] => [...a, ...b.slice().reverse()];
/** A tapered ribbon around a picture polyline; `w(f)` is the half-width in px at f 0..1 along it. */
const ribbon = (line: Pt[], w: (f: number) => number, side: -1 | 0 | 1 = 0): Pt[] => {
  if (line.length < 2) return [];
  const L: Pt[] = [], R: Pt[] = [];
  line.forEach((v, q) => {
    const pa = line[Math.max(0, q - 1)], pb = line[Math.min(line.length - 1, q + 1)], dl = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
    const nx = -(pb[1] - pa[1]) / dl, ny = (pb[0] - pa[0]) / dl, ww = w(q / (line.length - 1));
    L.push(side < 0 ? v : [v[0] + nx * ww, v[1] + ny * ww]);
    R.push(side > 0 ? v : [v[0] - nx * ww, v[1] - ny * ww]);
  });
  return [...L, ...R.reverse()];
};

export const paintEyeMacro = (p: Painter, cam: YCam, s: EyeState, look: EyeLook = {}) => {
  const K = {...EYEC, ...look};
  // EYE set-m are tiny next to the yaw camera's 0.3 m near plane, so project through a copy of the scene scaled x10 (same picture).
  const c: YCam = {...cam, x: cam.x * 10, y: cam.y * 10, z: cam.z * 10};
  const sc = (v: V3): V3 => [v[0] * 10, v[1] * 10, v[2] * 10];
  const cp = (v: V3) => camPointRaw(c, sc(v));
  const wp = (pts: V3[]) => wpRaw(c, pts.map(sc));
  const line = (pts: V3[]) => pts.map(cp).filter(Boolean) as Pt[];
  const {u, t} = s;
  // Flat partial-opacity veil on a sub-layer (a wash only darkens: light colours over dark skin and the white are veils).
  const veil = (seed: number, color: string, a: number, q: Pt[]) => {
    if (a > 0.002 && q.length >= 3) hardFill(p.layer(a, seed), seed, color, q);
  };
  // Soft veil: the polygon stacked at shrinking sizes about its centre, so its edge fades out (no stain edge).
  const softVeil = (seed: number, color: string, a: number, q: Pt[], n = 6, shrink = 0.55) => {
    if (q.length < 3 || a <= 0.002) return;
    const [cx, cy] = centroid(q);
    for (let k = 0; k < n; k++) {
      const f = 1 - (shrink * k) / n;
      veil(seed + k, color, a / n, q.map(([x, y]): Pt => [cx + (x - cx) * f, cy + (y - cy) * f]));
    }
  };
  const oval = (cx: number, cy: number, rx: number, ry: number, a = 0, n = 20) => Array.from({length: n}, (_, k): V3 => {
    const v = (k / n) * 6.283, ex = rx * Math.cos(v), ey = ry * Math.sin(v);
    return [cx + ex * Math.cos(a) - ey * Math.sin(a), cy + ex * Math.sin(a) + ey * Math.cos(a), SKINZ];
  });
  const ov = (seed: number, color: string, a: number, o: V3[], n = 12) => softVeil(seed, color, a, wp(o), n);
  const sv = (seed: number, color: string, a: number, pts: [number, number][], n = 10) => softVeil(seed, color, a, wp(pts.map(([x, y]): V3 => [x, y, SKINZ])), n);
  /** A soft band along a set-space curve y = f(x) from x0 to x1, half-width h(f) set-m, stacked for a soft edge. */
  const curveBand = (seed: number, color: string, a: number, f: (x: number) => number, x0: number, x1: number, h: (q: number) => number, n = 5) => {
    const xs = Array.from({length: 17}, (_, k) => x0 + ((x1 - x0) * k) / 16);
    for (let i = 0; i < n; i++) {
      const g = 1 - (0.7 * i) / n;
      const top = xs.map((x, k): V3 => [x, f(x) + h(k / 16) * g, SKINZ]), bot = xs.map((x, k): V3 => [x, f(x) - h(k / 16) * g, SKINZ]);
      veil(seed + i, color, a / n, bandOf(wp(top), wp(bot)));
    }
  };
  const taperH = (peak: number, at = 0.5) => (q: number) => peak * Math.pow(Math.sin(Math.PI * q), 0.8) * (1 - 0.35 * Math.abs(q - at));

  // ---------------------------------------------------------------- skin form
  // v5 (viewer check r4: "near-flat orange-brown fill"): the same planes as v4 (brow ridge, nose side, tear trough,
  // cheekbone) plus warm/cool variation: thin redder skin on the lids, cooler grey-violet in the socket hollow and the tear
  // trough, golden light on the brow bone and cheekbone, and larger, higher-contrast cross-contour brush marks.
  hardFill(p, 60000, K.skin, full);
  ov(60011, '#a06c4a', 0.4, oval(0.02, 0.2, 0.24, 0.07));
  ov(60001, K.skinDark, 0.34, oval(0.0, 0.1, 0.3, 0.03), 14);
  sv(60003, '#3e2416', 0.8, [[-0.3, 0.1], [-0.128, 0.06], [-0.121, -0.02], [-0.108, -0.1], [-0.094, -0.18], [-0.084, -0.26], [-0.08, -0.36], [-0.3, -0.36]], 16);
  sv(60005, '#4a2b1c', 0.45, [[-0.122, 0.0], [-0.098, -0.06], [-0.075, -0.16], [-0.06, -0.28], [-0.066, -0.36], [-0.11, -0.36], [-0.118, -0.12]], 12);
  sv(60007, '#4e2c1c', 0.55, [[-0.118, -0.015], [-0.07, -0.058], [0.0, -0.074], [0.07, -0.07], [0.115, -0.05], [0.12, -0.08], [0.04, -0.1], [-0.04, -0.105], [-0.1, -0.08]], 14);
  ov(60020, K.skinCool, 0.32, oval(-0.06, -0.085, 0.07, 0.02, -0.25), 12); // cool tear trough, inner side
  ov(60006, '#a87450', 0.34, oval(0.005, -0.06, 0.09, 0.012, -0.03));
  ov(60004, '#c08a5e', 0.55, oval(0.05, -0.175, 0.13, 0.055, 0.28), 16);
  ov(60002, '#dcaa7c', 0.4, oval(0.075, -0.16, 0.065, 0.024, 0.28));
  ov(60021, K.skinWarm, 0.28, oval(0.02, -0.21, 0.12, 0.05, 0.2), 12); // warm flush below the cheekbone light
  sv(60010, '#54321f', 0.5, [[-0.08, -0.27], [0.05, -0.245], [0.18, -0.25], [0.18, -0.36], [-0.08, -0.36]], 14);
  ov(60022, '#c99a68', 0.3, oval(0.06, 0.142, 0.1, 0.014, -0.08), 12); // brow bone light above the outer half
  // Pores and freckles: tiny dark dots with a lit rim on a few, denser on the cheek.
  for (let k = 0; k < 520; k++) {
    const x = -0.135 + hash(k * 3.1 + 0.7) * 0.27, y = -0.34 + hash(k * 7.7 + 0.3) * (k < 420 ? 0.27 : 0.5);
    if (Math.abs(x) < EW && y > lowerAt(x) - 0.008 && y < upperAt(x) + 0.008) continue;
    const q = cp([x, y, SKINZ]);
    if (!q) continue;
    const r = 1.6 + 1.8 * hash(k * 1.9), fr = k % 23 === 0;
    veil(63000 + k, fr ? '#3e2416' : '#4e2e1e', fr ? 0.45 : 0.22 + 0.12 * hash(k * 5.3), ell(q[0], q[1], fr ? r * 2.2 : r, fr ? r * 1.8 : r * 0.8, 7));
    if (k % 4 === 0) veil(63600 + k, '#c89670', 0.16, ell(q[0] - 1.5, q[1] - 2, r * 0.8, r * 0.5, 6));
  }
  // Cross-contour brush marks tangent to an ellipse about the opening (soft lens shapes, not pen lines: thin ink lines on
  // skin read as fur, v4 trial 1). v5: longer and wider marks at 0.2-0.36 alpha so they read at 270 px; tone picks by zone:
  // lit (lid puff, brow bone, cheekbone), hollow (socket, under the lid fold), lid (redder), else mixed warm / cool.
  for (let k = 0; k < 520; k++) {
    const x = -0.13 + 0.26 * hash(k * 2.7 + 0.13), y = -0.24 + 0.47 * hash(k * 6.1 + 0.57);
    if (Math.abs(x) < EW + 0.008 && y > lowerAt(x) - 0.016 && y < upperAt(x) + lashTh(x) + 0.012) continue;
    const ax = EW * 1.35, by = 0.1, gx = (2 * x) / (ax * ax), gy = (2 * (y + 0.004)) / (by * by), gl = Math.hypot(gx, gy) || 1;
    const tx = -gy / gl, ty = gx / gl, L = 0.014 + 0.018 * hash(k * 3.3), bend = 0.45 * (hash(k * 8.9) - 0.5);
    const xc = Math.max(-EW, Math.min(EW, x)), crease = upperAt(xc) * 1.25 + 0.03;
    const lit = (y < -0.1 && x > 0.0) || (y > 0.13 && y < 0.16 && x > -0.02) || (y < -0.03 && y > -0.07 && Math.abs(x) < 0.08);
    const lid = Math.abs(x) < EW && y > upperAt(xc) && y < crease;
    const hollow = (y > crease && y < 0.118) || (y < -0.065 && y > -0.11) || x < -0.1;
    const h = hash(k * 4.1);
    const tone = lit ? (h < 0.7 ? '#c8925f' : '#6a4028') : lid ? (h < 0.5 ? '#9a5238' : h < 0.8 ? '#5e3524' : '#b27652') : hollow ? (h < 0.5 ? '#45291b' : h < 0.8 ? K.skinCool : '#a87450') : h < 0.35 ? '#5a3624' : h < 0.6 ? '#a97550' : h < 0.8 ? K.skinWarm : '#6a5650';
    const wd = 0.0014 + 0.0022 * hash(k * 5.9) ** 2, lens: V3[] = [];
    for (let q = 0; q <= 16; q++) {
      const f = q <= 8 ? -1 + q / 4 : 1 - (q - 8) / 4, side = q <= 8 ? 1 : -1, hw = side * wd * Math.sin((Math.PI * (f + 1)) / 2) ** 0.8;
      lens.push([x + L * f * tx - bend * L * f * f * ty - ty * hw, y + L * f * ty + bend * L * f * f * tx + tx * hw, SKINZ]);
    }
    veil(64800 + k, tone, 0.13 + 0.17 * hash(k * 9.7) ** 1.5, wp(lens));
  }

  // ---------------------------------------------------------------- brow (unchanged from v4: brush hairs over a soft underlay)
  const browAt = (x: number) => 0.106 + 0.024 * (1 - ((x - 0.03) / 0.19) ** 2);
  const browW = (x: number) => 0.012 * (1 - 0.7 * Math.max(0, Math.min(1, (x + 0.16) / 0.33)));
  const xs = Array.from({length: 16}, (_, k) => -0.17 + (0.34 * k) / 15);
  sv(60008, '#2e1c12', 0.32, [...xs.map((x): [number, number] => [x, browAt(x) + browW(x)]), ...xs.slice().reverse().map((x): [number, number] => [x, browAt(x) - browW(x)])], 10);
  for (let k = 0; k < 110; k++) {
    const x = -0.168 + 0.335 * hash(k * 4.9 + 0.2), y = browAt(x) + browW(x) * (hash(k * 4.3) * 2 - 1) * 0.9;
    const ang = 0.55 + 0.35 * hash(k * 2.1) - 1.7 * Math.max(0, x - 0.02), L = 0.012 + 0.01 * hash(k * 6.1);
    const pts = line([0, 0.5, 1].map((f): V3 => [x + L * f * Math.cos(ang + 0.15 * f), y + L * f * Math.sin(ang + 0.15 * f), SKINZ]));
    if (pts.length === 3) inkLine(p.layer(0.55 + 0.4 * hash(k * 8.3), 60700 + k), 60700 + k, pts, {closed: false, weight: 1.0 + 0.8 * hash(k * 3.7), color: k % 3 ? '#1f1410' : '#3a2418', curve: 0.5});
  }

  // ---------------------------------------------------------------- lid, crease, socket, under-eye fold
  // v5 (viewer check r4: no lid thickness, crease or socket shading): the upper lid is a lit, redder puff between the lash
  // line and the crease, darkening toward the lashes; the crease is a soft tapered shadow with the fold edge lit just
  // below it; the socket above the crease is a cool shadow, deepest at the inner corner; the lower lid has a lit puff, then
  // the under-eye fold as a soft tapered shadow.
  const creaseAt = (x: number) => upperAt(Math.max(-EW, Math.min(EW, x))) * 1.25 + 0.03;
  curveBand(60030, '#3c2418', 0.5, (x) => creaseAt(x) + 0.008, -EW * 1.1, EW * 1.05, taperH(0.009, 0.3), 6); // socket under the brow bone
  ov(60031, K.skinCool, 0.36, oval(-0.098, 0.075, 0.03, 0.045, 0.3), 10); // deep inner socket, cool
  ov(60032, '#9e5c40', 0.4, oval(0.008, 0.083, 0.085, 0.014, -0.03), 12); // lid puff, warm and lit over the cornea bulge
  ov(60033, '#bb8158', 0.26, oval(0.0, 0.088, 0.05, 0.007, -0.03), 8);
  curveBand(60040, '#4a2a1c', 0.42, (x) => upperAt(x) + lashTh(x) + 0.006, -EW * 0.95, EW * 0.98, taperH(0.0065, 0.6), 5); // lid darkening toward the lashes
  curveBand(60050, '#2e1a10', 0.62, creaseAt, -EW * 1.02, EW * 1.0, taperH(0.0034, 0.45), 6); // crease shadow
  curveBand(60058, '#b27a54', 0.32, (x) => creaseAt(x) - 0.005, -EW * 0.8, EW * 0.85, taperH(0.0018, 0.5), 3); // lit fold edge
  const foldAt = (x: number) => lowerAt(Math.max(-EW, Math.min(EW, x))) * 1.35 - 0.014;
  curveBand(60060, '#3a2216', 0.5, foldAt, -EW * 0.85, EW * 0.95, taperH(0.004, 0.55), 6); // under-eye fold
  curveBand(60068, '#b07a54', 0.26, (x) => foldAt(x) - 0.006, -EW * 0.6, EW * 0.8, taperH(0.0022, 0.6), 3); // its lit lower edge

  // ---------------------------------------------------------------- eyeball
  const open = wp(lidPts());
  if (open.length < 3) return;
  const inOpen = (q: Pt[]) => clipToOpen(q, open);
  // Sclera (viewer check r4: a flat white): a cool grey-blue base, lit to off-white toward the front of the globe on either
  // side of the iris, so it stays grey-blue in the corners and under both lids.
  hardFill(p, 60100, K.scleraShade, open);
  const blobV = (cx: number, cy: number, rx: number, ry: number, n = 16) => Array.from({length: n}, (_, k): V3 => onGlobe(cx + rx * Math.cos((k / n) * 6.283), cy + ry * Math.sin((k / n) * 6.283), 0.0004));
  softVeil(60102, '#d9d6d8', 0.9, inOpen(wp(blobV(0.0, -0.002, 0.1, 0.05, 20))), 6, 0.35);
  softVeil(60110, K.sclera, 0.9, inOpen(wp(blobV(-0.062, -0.004, 0.04, 0.03))), 8, 0.6);
  softVeil(60120, K.sclera, 0.9, inOpen(wp(blobV(0.066, -0.002, 0.044, 0.03))), 8, 0.6);
  // Corner vessel tint, caruncle and fine vessels (v4, kept: the r4 critic did not flag them).
  softVeil(61200, '#d08f82', 0.3, inOpen(wp(blobV(-EW + 0.018, 0.0, 0.024, 0.02))), 8);
  softVeil(61210, '#b8665c', 0.5, inOpen(wp(blobV(-EW + 0.006, -0.002, 0.008, 0.009))), 6);
  softVeil(61220, '#d29a8e', 0.18, inOpen(wp(blobV(EW - 0.016, 0.003, 0.022, 0.018))), 8);
  ([[-1, 0.004, 0.2], [-1, -0.012, -0.3], [-1, 0.016, 0.45], [1, 0.006, 2.9], [1, -0.01, 3.4]] as const).forEach(([side, y0, a0], k) => {
    const pts: Pt[] = [];
    let x = side * (EW - 0.006), y = y0, a = a0;
    for (let q = 0; q < 7; q++) {
      const v = cp(onGlobe(x, y, 0.0005));
      if (v) pts.push(v);
      a += 0.35 * (hash(k * 13 + q) - 0.5);
      x += 0.0042 * Math.cos(a);
      y += 0.0042 * Math.sin(a);
    }
    for (const run of runsIn(pts, open)) inkLine(p, 61240 + k, run, {closed: false, weight: 0.7 + 0.3 * (k % 2), color: mix(K.sclera, '#b8574e', 0.42 - 0.05 * k), curve: 0.5, still: true});
  });
  // Iris (v4, kept: the r4 critic's "best part"): dark base, warmer lit lower half, ~150 radial fibres, broken collarette,
  // dark soft limbal ring on the visible arcs.
  const ringG = (r: number, cx = 0.004, cy = 0.004, n = 30) => Array.from({length: n}, (_, k): V3 => onGlobe(cx + r * Math.cos((k / n) * 6.283), cy + r * Math.sin((k / n) * 6.283)));
  const iris = inOpen(wp(ringG(0.052)));
  if (iris.length >= 3) {
    hardFill(p, 60130, K.iris, iris);
    softVeil(60131, K.irisLit, 0.7, clipToOpen(wp(ringG(0.036, 0.006, -0.012)), iris), 8);
    softVeil(60138, '#a8784a', 0.35, clipToOpen(wp(ringG(0.02, 0.012, -0.024)), iris), 6);
    for (let k = 0; k < 150; k++) {
      const a = (k / 150) * 6.283 + 0.03 * hash(k * 1.7), r0 = 0.023 + 0.006 * hash(k * 2.9), r1 = 0.036 + 0.014 * hash(k * 4.3), w = 0.04 * (hash(k * 6.7) - 0.5);
      const pts = line([0, 0.5, 1].map((f) => {
        const r = r0 + (r1 - r0) * f, aa = a + w * Math.sin(Math.PI * f);
        return onGlobe(0.004 + r * Math.cos(aa), 0.004 + r * Math.sin(aa));
      }));
      const tone = k % 5 === 0 ? '#2a190e' : k % 3 === 0 ? '#c09060' : k % 2 ? '#9a6c42' : '#6e4a2c';
      for (const run of runsIn(pts, open)) inkLine(p, 61000 + k, run, {closed: false, weight: 0.5 + 0.6 * hash(k * 8.1), color: tone, curve: 0.4, still: true});
    }
    // v6 (viewer check r5: "the wavy ring around the pupil reads as a scratch"): the broken collarette line is gone; the
    // collarette is a soft warmer zone round the pupil (a stacked veil under the pupil's soft edge), no line.
    softVeil(60290, '#b8865a', 0.22, clipToOpen(wp(ringG(0.036)), iris), 12, 0.35);
    for (const run of runsIn(wp(ringG(0.0505, 0.004, 0.004, 48)), open)) {
      inkLine(p, 60140, run, {closed: false, weight: 7, color: mix('#1e120a', K.iris, 0.45), curve: 0.3, still: true});
      inkLine(p, 60142, run, {closed: false, weight: 3, color: '#1a0f08', curve: 0.3, still: true});
    }
  }
  // Pupil with a soft edge: shrinking veils from r 0.029 to a near-black core of r 0.0185.
  softVeil(61300, '#140b06', 0.92, inOpen(wp(ringG(0.029))), 14);
  const pup = inOpen(wp(ringG(0.0185)));
  if (pup.length >= 3) hardFill(p, 60143, K.pupil, pup);
  // Shadow of the upper lid on the eyeball (viewer check r4: no lid shadow on the iris/sclera): bands that follow the lid
  // curve (v4's were straight), deepest at the lid and fading with no edge over ~0.03 set-m; a thinner one under the lower lid.
  // v6 (viewer check r5: "sclera near-flat with faint upper-lid shadow"): 14 bands reaching ~0.028 set-m below the lid at
  // the centre (the top 20-25% of the 0.11 opening), alpha ~0.6 at the lid, warmer toward the lid, fading with no edge.
  for (let i = 0; i < 14; i++) {
    const d = 0.003 + 0.026 * Math.pow((i + 1) / 14, 1.25);
    const xsE = Array.from({length: 23}, (_, k) => -EW + (2 * EW * k) / 22);
    const top = wp(xsE.map((x): V3 => [x, upperAt(x) + 0.004, SKINZ])), bot = wp(xsE.map((x): V3 => [x, upperAt(x) - d * (0.6 + 0.4 * Math.sin((Math.PI * (x + EW)) / (2 * EW))), SKINZ]));
    veil(60150 + i * 2, i < 5 ? '#3a2428' : '#2c2430', 0.095, inOpen(bandOf(top, bot)));
  }
  for (let i = 0; i < 4; i++) {
    const d = 0.0015 + 0.006 * ((i + 1) / 4);
    const xsE = Array.from({length: 19}, (_, k) => -EW + (2 * EW * k) / 18);
    veil(60180 + i * 2, '#3a3038', 0.06, inOpen(bandOf(wp(xsE.map((x): V3 => onGlobe(x, lowerAt(x) + d, 0.0006))), wp(xsE.map((x): V3 => [x, lowerAt(x) - 0.003, SKINZ])))));
  }

  // ---------------------------------------------------------------- the gold nerve (one thread, only while it sparks)
  // v5 (viewer check r4: "short yellow scratches in the corners"): one longer thin curved thread under the surface of the
  // outer white, arcing up beside the iris; invisible at rest, it lights on each of the three flicks with a faint gold glow
  // (glow alpha <= 0.3, the demo-lighting glow cap), a brighter pulse travelling up the thread and a small bloom at its tip.
  const flicks = [bump(u, 0.28, 0.42), bump(u, 0.38, 0.52), bump(u, 0.48, 0.62)];
  const sp = Math.max(...flicks);
  if (sp > 0.04) {
    const pts: Pt[] = [];
    let x = 0.059, y = -0.025, a = 0.3;
    for (let q = 0; q < 19; q++) {
      const v = cp([x, y, SKINZ + 0.003]); // on the skin-plane opening: globe points project wider and the lids crop them
      if (v) pts.push(v);
      a += 0.055 + 0.04 * Math.sin(q * 0.8);
      x += 0.0036 * Math.cos(a);
      y += 0.0036 * Math.sin(a);
    }
    const run = runsIn(pts, open).sort((r1, r2) => r2.length - r1.length)[0];
    if (run && run.length >= 3) {
      // v6 (viewer check r5: "gold nerve crisp with no glow falloff"): uneven core width (thicker near the root, two swells,
      // pinched at a knot) and a soft halo 3-4x the core in five stacked widths, total alpha <= 0.3 (glow cap).
      const coreW = (g: number) => (1.3 + 0.9 * sp) * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(0.95, g + 0.06))) * (1 + 0.35 * Math.sin(g * 17 + 0.6) - 0.25 * Math.exp(-(((g - 0.55) / 0.06) ** 2)));
      [4, 3.3, 2.6, 2, 1.5].forEach((f, i) => veil(62000 + i, '#eea52e', (0.3 * sp) / 5, ribbon(run, (g) => coreW(g) * f + 2)));
      veil(62008, '#f2b440', 0.2 * sp, ribbon(run, (g) => coreW(g) * 1.7));
      veil(62010, mix(K.sclera, '#d9962c', 0.9), 0.55 + 0.4 * sp, ribbon(run, coreW));
      // The pulse: which flick is running sets how far up the thread it has travelled.
      const k = flicks.indexOf(sp), ph = ramp(u, [0.28, 0.38, 0.48][k], [0.42, 0.52, 0.62][k]);
      const e = run[Math.min(run.length - 1, Math.round(ph * (run.length - 1)))];
      softVeil(62020, '#ffe7a0', 0.3 * sp, inOpen(ell(e[0], e[1], 8 + 10 * sp, 8 + 10 * sp, 16)), 5);
      const tip = run[run.length - 1];
      softVeil(62030, '#ffe7a0', 0.22 * sp, inOpen(ell(tip[0], tip[1], 6 + 8 * sp, 6 + 8 * sp, 14)), 4);
    }
  }

  // ---------------------------------------------------------------- lilac haze on the surface, wiped by the tear wave
  const wave = ramp(u, 0.5, 0.92);
  const waveX = EW * 1.2 - 2.6 * EW * wave;
  const land = ramp(u, 0.05, 0.4);
  ([[-0.08, -0.004, 0.024, 0.022], [0.079, 0.0, 0.024, 0.02], [-0.064, -0.03, 0.012, 0.008], [0.066, -0.028, 0.012, 0.008]] as const).forEach(([mx, my, rx, ry], m) => {
    if (wave > 0 && mx > waveX) return;
    const q = wp(Array.from({length: 16}, (_, k): V3 => onGlobe(mx + rx * Math.cos(k * 0.393) * (0.85 + 0.3 * hash(m * 9 + k)), my + ry * Math.sin(k * 0.393), 0.004)));
    softVeil(62300 + m * 10, '#c8b8ff', 0.28 * land, inOpen(q), 6);
  });

  // ---------------------------------------------------------------- tear wave (translucent)
  // v5 (viewer check r1-r4: "an opaque grey band over the iris"): the v4 watercolour wash and the 0.4 light-blue band are
  // gone (a wash only darkens, so over the white it went grey). Water is shown by what it does to the light: a thin dark
  // refraction line on the leading edge, a clear bead body at 0.05 (a light veil greys the pupil above ~0.1: v5 trial) and a
  // broken white specular crest, so the iris, pupil and white stay visible through it.
  if (wave > 0 && wave < 1) {
    const front: V3[] = [], frontB: V3[] = [];
    for (let k = 0; k <= 12; k++) {
      const y = EUP + 0.012 - ((EUP + EDN + 0.024) * k) / 12, sk = 0.016 * Math.sin(k * 0.6 + t * 3) + 0.012 * (k / 12);
      const x = Math.max(-EW * 1.05, waveX + sk);
      front.push(onGlobe(x, y, 0.005));
      frontB.push(onGlobe(Math.min(EW * 1.1, x + 0.015), y, 0.005));
    }
    const fq = wp(front), bq = wp(frontB);
    if (fq.length === front.length && bq.length === frontB.length) {
      veil(60402, '#e4f3f8', 0.05, inOpen(bandOf(fq, bq)));
      veil(60403, '#ffffff', 0.04, inOpen(bandOf(fq.map(([x, y], k): Pt => [x + (bq[k][0] - x) * 0.15, y + (bq[k][1] - y) * 0.15]), fq.map(([x, y], k): Pt => [x + (bq[k][0] - x) * 0.55, y + (bq[k][1] - y) * 0.55]))));
      const lead = runsIn(fq, open);
      for (const r of lead) veil(60404, '#26323a', 0.16, ribbon(r, (g) => 1.3 * Math.sin(Math.PI * g)));
      const crest = runsIn(fq.map(([x, y], k): Pt => [x + (bq[k][0] - x) * 0.3, y + (bq[k][1] - y) * 0.3]), open);
      crest.forEach((r, ri) => {
        for (let j = 0; j + 1 < r.length; j++) {
          if (hash(ri * 31 + j * 7.3 + 0.4) < 0.18) continue;
          const f = j / Math.max(1, r.length - 2);
          veil(60410 + j, '#ffffff', 0.55 + 0.35 * Math.sin(Math.PI * f), ribbon([r[j], r[j + 1]], (g) => (1.2 + 1.4 * Math.sin(Math.PI * f)) * Math.sin(Math.PI * (0.08 + 0.84 * g))));
        }
      });
    }
  }

  // ---------------------------------------------------------------- wet cornea dome: catchlight (v4, kept)
  const hl = cp(onGlobe(-0.022, 0.024, 0.01)), hs = cp(onGlobe(0.03, -0.012, 0.01));
  if (hl) {
    softVeil(60501, '#fff8ee', 0.3, ell(hl[0] + 8, hl[1] + 6, 62, 38, 18, -0.5), 6);
    const piece = (id: number, dx: number, dy: number, rx: number, ry: number, a: number) => {
      const q = blob(id, hl[0] + dx, hl[1] + dy, rx, ry, 0, 16).map(([x, y]): Pt => {
        const ux = x - hl[0], uy = y - hl[1];
        return [hl[0] + ux * Math.cos(-0.45) - uy * Math.sin(-0.45), hl[1] + ux * Math.sin(-0.45) + uy * Math.cos(-0.45)];
      });
      veil(id, '#ffffff', a, q);
    };
    piece(60500, -9, -2, 15, 17, 0.9);
    piece(60503, 13, 1, 10, 15, 0.78);
    veil(60504, '#ffffff', 0.55, blob(60504, hl[0] - 13, hl[1] - 8, 6, 5, 0, 10));
  }
  if (hs) {
    softVeil(60502, '#ffffff', 0.5, blob(60502, hs[0], hs[1], 9, 6, 0, 12), 5);
    veil(60505, '#ffffff', 0.6, blob(60505, hs[0] - 2, hs[1] - 1, 3.5, 2.5, 0, 8));
  }

  // ---------------------------------------------------------------- lid rims
  // v5 (viewer check r4: "a hard even black outline ... no lid thickness, no wet lower rim"). Upper: a lash line that
  // tapers from a hairline at the inner corner to a soft wing at the outer corner, painted as three stacked bands (wide
  // soft brown, mid, dark core) that overlap the white so its cut edge never shows. Lower: the lid margin's top surface as
  // a pinkish-brown band of thickness, lighter and wet where it meets the eye, with a broken white wet highlight and a soft
  // darker lash line under it; the tear wave makes the wet line fuller.
  const xsR = Array.from({length: 29}, (_, k) => -EW + (2 * EW * k) / 28);
  ([[1.9, '#4a2c1e', 0.4], [1.15, '#2a1a12', 0.6], [0.6, K.lash, 0.85]] as const).forEach(([g, col, a], i) => {
    const top = wp(xsR.map((x): V3 => [x, upperAt(x) + lashTh(x) * g * 0.75, SKINZ + 0.001]));
    const bot = wp(xsR.map((x): V3 => [x, upperAt(x) - Math.min(0.0016, lashTh(x) * 0.5) * (i === 0 ? 1.3 : 1), SKINZ + 0.001]));
    veil(60520 + i, col, a, bandOf(top, bot));
  });
  const wetU = ramp(u, 0.6, 0.95);
  const rimTop = wp(xsR.map((x): V3 => [x, lowerAt(x) + 0.0007, SKINZ + 0.001]));
  const rimBot = wp(xsR.map((x): V3 => [x, lowerAt(x) - rimTh(x), SKINZ + 0.001]));
  const rimMid = wp(xsR.map((x): V3 => [x, lowerAt(x) - rimTh(x) * 0.45, SKINZ + 0.001]));
  veil(60530, K.rim, 0.92, bandOf(rimTop, rimBot));
  veil(60531, K.rimWet, 0.55, bandOf(rimTop, rimMid));
  const rimLow = wp(xsR.map((x): V3 => [x, lowerAt(x) - rimTh(x) - 0.0016 * Math.sin((Math.PI * (x + EW)) / (2 * EW)), SKINZ + 0.001]));
  veil(60532, '#4a2a1c', 0.45, bandOf(rimBot, rimLow));
  veil(60533, '#3a2016', 0.3, bandOf(wp(xsR.map((x): V3 => [x, lowerAt(x) - rimTh(x) * 0.85, SKINZ + 0.001])), rimBot));
  // Tear meniscus on the eye just above the rim, and the broken wet highlight along the rim's inner edge.
  const men = wp(xsR.map((x): V3 => onGlobe(x, lowerAt(x) + 0.0028 + 0.002 * wetU, 0.0008)));
  veil(60534, '#e8f2f4', 0.35 + 0.3 * wetU, inOpen(bandOf(men, rimTop)));
  const wetL = wp(xsR.map((x): V3 => [x, lowerAt(x) - 0.0004, SKINZ + 0.0015]));
  for (let j = 1; j + 2 < wetL.length; j++) {
    if (hash(j * 5.7 + 0.2) < 0.32 - 0.25 * wetU) continue;
    veil(60540 + j, '#ffffff', 0.62 + 0.3 * wetU, ribbon([wetL[j], wetL[j + 1]], (g) => (1.4 + 1.2 * wetU) * Math.sin(Math.PI * (0.1 + 0.8 * g))));
  }

  // ---------------------------------------------------------------- lashes
  // v5 (viewer check r4: "straight ticks detached from the lid line"): upper lashes grow from the lash line in clumps of
  // 2-4, each a tapered curved stroke that leaves the lid toward the lens and curls up and out, longer toward the outer
  // corner, the tips of a clump drawn together; lower lashes short, sparse and fine from under the wet rim.
  const lash = (seed: number, x: number, y: number, a0: number, curl: number, L: number, w0: number, pull: [number, number], alpha: number, zUp: number) => {
    const pts: V3[] = [];
    let px = x, py = y, a = a0;
    for (let q = 0; q <= 8; q++) {
      const f = q / 8;
      pts.push([px + pull[0] * f * f, py + pull[1] * f * f, SKINZ + 0.002 + zUp * f]);
      a += curl / 8;
      px += (L / 8) * Math.cos(a);
      py += (L / 8) * Math.sin(a);
    }
    const q2 = line(pts);
    if (q2.length >= 3) veil(seed, K.lash, alpha, ribbon(q2, (f) => w0 * Math.pow(1 - f, 0.85) + 0.25));
  };
  for (let k = 0; k < 22; k++) {
    const sN = 0.08 + (0.9 * (k + 0.6 * hash(k * 3.9))) / 21, xc = -EW + 2 * EW * sN, n = 1 + Math.floor(hash(k * 7.1) * 3.99);
    const L = 0.01 + 0.016 * Math.pow(sN, 1.2), a0 = 1.95 - 1.75 * sN, curl = -0.7 + 1.9 * sN;
    for (let j = 0; j < n; j++) {
      const dx = (j - (n - 1) / 2) * 0.0018 + 0.0012 * (hash(k * 11 + j) - 0.5);
      const x = xc + dx, Lj = L * (0.6 + 0.6 * hash(k * 5.3 + j));
      lash(60600 + k * 5 + j, x, upperAt(x) + lashTh(x) * 0.4, a0 + 0.3 * (hash(k * 9 + j * 3) - 0.5), curl * (0.8 + 0.4 * hash(k * 2 + j)), Lj, 1.3 + 1.1 * sN * hash(k * 4 + j * 1.7), [-dx * 0.35, 0], 0.6 + 0.3 * hash(k * 6.1 + j), 0.012);
    }
  }
  for (let k = 0; k < 13; k++) {
    const sN = 0.3 + (0.62 * (k + 0.5 * hash(k * 2.3))) / 12, x = -EW + 2 * EW * sN;
    lash(60720 + k, x, lowerAt(x) - rimTh(x) - 0.0008, -1.8 + 1.2 * sN, -0.25, 0.005 + 0.007 * sN * hash(k * 4.7 + 0.3) + 0.002, 1.3, [0, 0], 0.7, 0.006);
  }

  // ---------------------------------------------------------------- mist wisps rising from the cut onion
  // v6 (viewer check r5: "thin hard white arcs plus a flat lilac band up the left edge, reads as tube/finger"): three
  // narrower soft vapour ribbons, none near the frame edges. Each rises from below the frame on a swaying path and ends in a
  // tightening curl (a spiral of ~1.3 turns, tangent to the path). Body: nested soft purple veils whose alpha fades in from
  // the frame edge and thins toward the curl, a fainter second strand twisting round it (vapour, not a tube) and a slightly
  // deeper purple core on the shade side. Light: one soft pale-lilac edge only on the side that faces the key (upper left),
  // its width following how squarely that side faces the light, so it fades out where the ribbon turns away (no white line).
  const grow = 0.35 + 0.65 * land, mistA = 1 - 0.6 * ramp(u, 0.55, 0.95);
  const LDIR: Pt = [-0.6, -0.8]; // toward the key in the picture (y down)
  type Wisp = {p0: [number, number]; p1: [number, number]; sway: number; dir: 1 | -1; r0: number; w: number; a: number};
  const wisps: Wisp[] = [
    {p0: [-0.03, -0.29], p1: [-0.068, -0.12], sway: 0.018, dir: -1, r0: 0.026, w: 62, a: 1},
    {p0: [0.07, -0.29], p1: [0.084, -0.165], sway: -0.014, dir: 1, r0: 0.022, w: 54, a: 0.9},
    {p0: [0.005, -0.3], p1: [0.018, -0.225], sway: 0.008, dir: -1, r0: 0.015, w: 36, a: 0.65},
  ];
  wisps.forEach((wi, w) => {
    // Centre line in set metres: a swaying rise p0 -> p1, then the curl.
    const ph = t * 0.7 + w * 1.9, set: [number, number][] = [];
    const dx = wi.p1[0] - wi.p0[0], dy = wi.p1[1] - wi.p0[1], dl = Math.hypot(dx, dy), nx = -dy / dl, ny = dx / dl;
    for (let k = 0; k <= 28; k++) {
      const f = k / 28, sw = wi.sway * Math.sin(Math.PI * f * 1.4 + ph * 0.5) * Math.sin(Math.PI * f);
      set.push([wi.p0[0] + dx * f + nx * sw, wi.p0[1] + dy * f + ny * sw]);
    }
    const [ex, ey] = set[set.length - 1], [qx, qy] = set[set.length - 2], hl = Math.hypot(ex - qx, ey - qy) || 1;
    const hx = (ex - qx) / hl, hy = (ey - qy) / hl;
    const cx = ex - hy * wi.r0 * wi.dir, cy = ey + hx * wi.r0 * wi.dir, phi0 = Math.atan2(ey - cy, ex - cx);
    for (let k = 1; k <= 18; k++) {
      const th = (k / 18) * Math.PI * 1.9, r = wi.r0 * (1 - 0.6 * (k / 18));
      set.push([cx + r * Math.cos(phi0 + wi.dir * th), cy + r * Math.sin(phi0 + wi.dir * th)]);
    }
    const all = line(set.slice(0, Math.max(6, Math.round(set.length * grow))).map(([x, y]): V3 => [x, y, SKINZ + 0.03]));
    if (all.length < 6) return;
    const n = all.length - 1;
    // Spread (px) of the vapour about the centre line: narrow where it leaves the cheek's lower edge, opening as it rises
    // and rolls into the curl (smoke widens and thins as it climbs; a tapering ribbon read as a tube in v6 trial 1).
    const hwAt = (f: number) => wi.w * (0.4 + 0.6 * f) * (1 + 0.15 * Math.sin(f * 8 + w * 2.1 + t * 0.8));
    const env = (f: number) => Math.min(1, f / 0.25) * (1 - 0.45 * ramp(f, 0.6, 1)) * Math.pow(Math.min(1, (1 - f) / 0.14), 0.7); // fade in from the frame edge, taper into the curl's tip
    const A = mistA * wi.a;
    const nrm = all.map((_, k): Pt => {
      const pa = all[Math.max(0, k - 1)], pb = all[Math.min(n, k + 1)], d = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1;
      return [-(pb[1] - pa[1]) / d, (pb[0] - pa[0]) / d];
    });
    const off = (amp: (f: number) => number) => all.map((v, k): Pt => [v[0] + nrm[k][0] * amp(k / n), v[1] + nrm[k][1] * amp(k / n)]);
    // A faint broad haze holding the strands together.
    ([[1.3, 0.06], [0.95, 0.085], [0.6, 0.09]] as const).forEach(([gw, al], i) => veil(64200 + w * 100 + i, '#9a5cff', al * A, ribbon(all, (f) => hwAt(f) * gw * env(f))));
    // Five soft filaments that drift across one another (each its own phase), so the body has streaks of denser vapour
    // instead of one even band; each filament is three stacked widths for a soft edge.
    const lean = (k: number) => nrm[k][0] * LDIR[0] + nrm[k][1] * LDIR[1]; // left normal . light
    const fil = [-0.75, -0.38, 0, 0.38, 0.75].map((sj, j) => off((f) => hwAt(f) * (sj + 0.28 * Math.sin(f * 7 + j * 1.7 + t * (0.5 + 0.12 * j)))));
    fil.forEach((q, j) => {
      const fw = (f: number) => hwAt(f) * (0.2 + 0.08 * Math.sin(f * 5 + j * 2.3)) * env(f);
      ([[1.6, 0.075], [1.0, 0.125], [0.5, 0.14]] as const).forEach(([gw, al], i) => veil(64220 + w * 100 + j * 5 + i, j === 2 ? '#7c40f0' : '#9a5cff', al * A, ribbon(q, (f) => fw(f) * gw)));
    });
    // The lit edge: a soft pale-lilac line on the outermost filament on the key side only, its width following how squarely
    // that side faces the light, so it fades out where the vapour turns away (no hard white arc).
    const litSide = (k: number) => (lean(k) >= 0 ? 4 : 0);
    const edge = all.map((_, k): Pt => fil[litSide(k)][k]);
    const wl = (f: number) => {
      const k = Math.round(f * n);
      return (Math.max(0, Math.abs(lean(k)) - 0.3) / 0.7) * env(f);
    };
    veil(64295 + w * 100, mix(K.lilacEdge, K.lilac, 0.45), 0.12 * A, ribbon(edge, (f) => 7 * wl(f)));
    veil(64296 + w * 100, mix(K.lilacEdge, K.lilac, 0.35), 0.12 * A, ribbon(edge, (f) => 3 * wl(f)));
  });

  // ---------------------------------------------------------------- one drop falls from the lower lid at the outer side
  const drop = ramp(u, 0.85, 1);
  if (drop > 0) {
    const q = cp([0.06, lowerAt(0.06) - 0.01 - 0.12 * drop * drop, SKINZ + 0.01]);
    if (q) {
      const body: Pt[] = Array.from({length: 18}, (_, k) => {
        const v = (k / 18) * 6.283, r = 20 * (1 - 0.55 * Math.max(0, -Math.sin(v)) ** 2);
        return [q[0] + r * Math.cos(v), q[1] + 6 + (Math.sin(v) < 0 ? 44 : 18) * Math.sin(v)];
      });
      veil(60560, '#dcecf2', 0.32, body);
      veil(60562, '#26323a', 0.25, ribbon(body.slice(2, 9), () => 1.2));
      veil(60561, '#ffffff', 0.85, ell(q[0] - 6, q[1] - 4, 4, 7, 8));
    }
  }
};

/** Clip a convex-ish picture polygon to the eye opening (the opening is convex enough for Sutherland-Hodgman). */
const clipToOpen = (q: Pt[], open: Pt[]): Pt[] => {
  let out = q;
  for (let i = 0; i < open.length && out.length; i++) {
    const a = open[i], b = open[(i + 1) % open.length];
    const n: Pt = [a[1] - b[1], b[0] - a[0]];
    const inside = (p: Pt) => (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1];
    const sgn = Math.sign(inside(centroid(open))) || 1;
    const res: Pt[] = [];
    for (let k = 0; k < out.length; k++) {
      const P = out[k], Q = out[(k + 1) % out.length], dp = sgn * inside(P), dq = sgn * inside(Q);
      if (dp >= 0) res.push(P);
      if (dp >= 0 !== dq >= 0) {
        const s = dp / (dp - dq);
        res.push([P[0] + (Q[0] - P[0]) * s, P[1] + (Q[1] - P[1]) * s]);
      }
    }
    out = res;
  }
  return out;
};
/** Point inside a picture polygon (even-odd). */
const inPoly = ([x, y]: Pt, q: Pt[]) => {
  let inside = false;
  for (let i = 0, j = q.length - 1; i < q.length; j = i++) {
    const [xi, yi] = q[i], [xj, yj] = q[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
/** The runs of consecutive polyline points inside the opening (a ring cropped by the lids becomes its visible arcs). */
const runsIn = (q: Pt[], open: Pt[]): Pt[][] => {
  const out: Pt[][] = [];
  let cur: Pt[] = [];
  q.forEach((v) => {
    if (inPoly(v, open)) cur.push(v);
    else if (cur.length) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out.filter((r) => r.length >= 2);
};
const centroid = (q: Pt[]): Pt => [q.reduce((s, v) => s + v[0], 0) / q.length, q.reduce((s, v) => s + v[1], 0) / q.length];
