import {blob, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camPoint as camPointRaw, camUnit, type YCam} from '../kit/ycam';
import {clip, wFill, wp, wp as wpRaw, wWash, wWash as wWashRaw} from './world';

// EDU-EP02-SHORT macro sets (brief EDU-BRIEF-R1 VD05, VD06; look frames LF02, LF03, workflow W3.1). Look-defining assets
// written by Film; Boss hardens them at W5.2. Both are labelled illustrations (`ภาพจำลอง`, VD08), not to scale, but built in
// set metres and seen through the kit yaw camera so the camera moves inside them.
//   CELL: 1 set-m ~ 0.1 mm (no size claim); brick-bond layer of cells 0.60 x 0.25 x 0.25, hero cell centred at the origin,
//         +x right, +y up, +z toward the camera. Simplified classic model (F004): no organelle names, no labels.
//   EYE:  1 set-m ~ 1 cm; globe radius 0.16 centred at z -0.04 (front of the cornea at z +0.12), skin plane at z +0.07,
//         eye opening +-0.11 wide; the cook's left eye (outer corner at screen right). Not an anatomy diagram.

const mix = mixColor;
const W = 1080, HGT = 1920;
const full: Pt[] = [[-200, -200], [W + 200, -200], [W + 200, HGT + 200], [-200, HGT + 200]];
const bump = (u: number, a: number, b: number) => (u <= a || u >= b ? 0 : Math.sin((Math.PI * (u - a)) / (b - a)));
const ramp = (u: number, a: number, b: number) => Math.max(0, Math.min(1, (u - a) / (b - a)));

// ================================================================== CELL (LF02, S01-B03-SH01)

export const CELLC = {
  back: '#c8913c', wall: '#d9b870', wallHi: '#f6e7b8', fluid: '#f7f0d8', fluidDeep: '#efdcaa', glow: '#fff3cf',
  bead: '#e8c43a', beadHi: '#fff6c4', sacMem: '#cfe9e2', sacInk: '#2f8a80', enzyme: '#3fa59a', orange: '#e8894a', violet: '#7d5bc4', lilac: '#b9a2e0',
  steel: '#9aa4ab', steelHi: '#e4ecf0',
} as const;
export type CellState = {t: number; beadGlint: number; sacPulse: number; burst?: number};

const CW = 0.6, CH = 0.25, GAP = 0.024, ZF = 0.06; // ZF: front veil / back of the chamber at +-0.06 (the 0.25 cell depth reads as a box seam at this camera distance)
/** Rounded rectangle in the plane z (world), corner radius rc. */
const rrect = (cx: number, cy: number, w: number, h: number, z: number, rc: number, wob = 0, seed = 0): V3[] => {
  const pts: V3[] = [];
  const corners: [number, number, number][] = [[cx + w / 2 - rc, cy + h / 2 - rc, 0], [cx - w / 2 + rc, cy + h / 2 - rc, 1], [cx - w / 2 + rc, cy - h / 2 + rc, 2], [cx + w / 2 - rc, cy - h / 2 + rc, 3]];
  corners.forEach(([x, y, q]) => {
    for (let k = 0; k <= 4; k++) {
      const a = (q * Math.PI) / 2 + (k / 4) * (Math.PI / 2), wv = wob * (hash(seed + q * 7 + k) - 0.5);
      pts.push([x + (rc + wv) * Math.cos(a), y + (rc + wv) * Math.sin(a), z]);
    }
  });
  return pts;
};
/** Cells of a brick-bond layer: row j at y = j*CH, odd rows offset half a cell. */
const cellsOf = (rows: number, cols: number) => {
  const out: {i: number; j: number; x: number; y: number}[] = [];
  for (let j = -rows; j <= rows; j++) for (let i = -cols; i <= cols; i++) out.push({i, j, x: i * CW + (Math.abs(j) % 2 ? CW / 2 : 0), y: j * CH});
  return out;
};
const sph = (c: YCam, v: V3, r: number) => {
  const q = camPoint(c, v);
  return q ? {x: q[0], y: q[1], r: r * camUnit(c, v)} : null;
};
/** Bead and sac layout of a cell (the hero is cell 0,0). Beads left, sac right; neighbours vary by hash. */
const contents = (i: number, j: number) => {
  const h = (k: number) => hash(i * 31.7 + j * 17.3 + k);
  const beads: V3[] = Array.from({length: 10}, (_, k): V3 => [-0.19 + 0.17 * h(k) + (k % 3) * 0.035, -0.07 + 0.14 * h(k + 20), -0.02 + 0.04 * h(k + 40)]);
  const sac: V3 = [0.14 + 0.03 * (h(60) - 0.5), 0.0 + 0.03 * (h(61) - 0.5), 0];
  return {beads, sac};
};
const pac = (x: number, y: number, r: number, a: number, n = 12): Pt[] => {
  const pts: Pt[] = [[x, y]];
  for (let k = 0; k <= n; k++) {
    const u = a + 0.55 + (k / n) * (Math.PI * 2 - 1.1);
    pts.push([x + r * Math.cos(u), y + r * Math.sin(u)]);
  }
  return pts;
};
const fourLobe = (x: number, y: number, r: number, a: number): Pt[] =>
  Array.from({length: 24}, (_, k) => {
    const u = (k / 24) * Math.PI * 2;
    const rr = r * (0.62 + 0.38 * Math.abs(Math.cos(2 * u)));
    return [x + rr * Math.cos(u + a), y + rr * Math.sin(u + a)];
  });

const paintCell = (p: Painter, c: YCam, s: CellState, cell: {i: number; j: number; x: number; y: number}, hero: boolean, seed: number) => {
  const {x, y} = cell, w = CW - GAP, h = CH - GAP;
  // Back of the chamber (deeper, warmer), then the contents, then the front membrane as a pale veil and a wall ring.
  const backF = wFill(p, c, seed, CELLC.fluidDeep, rrect(x, y, w, h, -ZF, 0.07, 0.01, seed));
  if (backF.length < 3) return;
  wWash(p, c, seed + 1, CELLC.fluid, 150, rrect(x - 0.02, y + 0.015, w * 0.82, h * 0.72, -ZF + 0.01, 0.05), 0.45, 0.35);
  const {beads, sac} = contents(cell.i, cell.j);
  const dim = hero ? 1 : 0.24;
  const burst = hero ? (s.burst ?? 0) : 0;
  // Sac: pale teal membrane holding 4-5 notched teal enzymes (kept apart from the beads until the cut).
  const sacC = sph(c, [x + sac[0], y + sac[1], sac[2]], 1);
  if (sacC) {
    const k = sacC.r, pulse = hero ? s.sacPulse : 0, rx = 0.085 * k * (1 + 0.06 * pulse), ry = 0.062 * k * (1 + 0.06 * pulse);
    if (!burst) {
      washAt(p, seed + 10, CELLC.sacMem, 150 * dim, ell(sacC.x, sacC.y, rx, ry, 22), 0.15, 0.3);
      for (let e = 0; e < 5; e++) {
        const ex = sacC.x + (-0.045 + 0.022 * e) * k, ey = sacC.y + (e % 2 ? 0.02 : -0.018) * k;
        hardFill(p, seed + 11 + e, mix(CELLC.enzyme, CELLC.fluid, 1 - dim), pac(ex, ey, 0.016 * k, e * 1.3));
      }
      inkLine(p, seed + 20, ell(sacC.x, sacC.y, rx, ry, 22), {weight: hero ? 1.4 + 1.2 * pulse : 0.7, color: mix(CELLC.sacInk, CELLC.fluid, 1 - dim)});
      if (hero && pulse > 0) washAt(p, seed + 21, '#8fe0d4', 90 * pulse, ell(sacC.x, sacC.y, rx * 1.25, ry * 1.3, 22), 0.5, 0.3);
    } else {
      // SH02 key state: the membrane torn open on the bead side; enzymes spill out and meet the beads.
      washAt(p, seed + 10, CELLC.sacMem, 90, ell(sacC.x + 0.01 * k, sacC.y, rx * 0.9, ry, 22), 0.25, 0.4);
      const arc = Array.from({length: 16}, (_, q): Pt => {
        const u = 0.9 + (q / 15) * 4.5;
        return [sacC.x + rx * Math.cos(u), sacC.y + ry * Math.sin(u)];
      });
      inkLine(p, seed + 20, arc, {closed: false, weight: 1.4, color: CELLC.sacInk});
      for (let e = 0; e < 5; e++) {
        const ex = sacC.x + (-0.08 - 0.03 * e) * k, ey = sacC.y + (-0.03 + 0.016 * e) * k;
        hardFill(p, seed + 11 + e, CELLC.enzyme, pac(ex, ey, 0.016 * k, e * 1.3 + 2));
      }
    }
  }
  // Sulfur-compound beads: yellow spheres with a highlight; glint on their word (hero only).
  beads.forEach((b, k) => {
    const q = sph(c, [x + b[0], y + b[1], b[2]], 0.014 + 0.003 * hash(k + cell.i));
    if (!q) return;
    const g = hero ? s.beadGlint : 0;
    const meet = burst && k < 5;
    const col = meet ? CELLC.orange : mix(CELLC.bead, CELLC.fluid, 1 - dim);
    if (g > 0) washAt(p, seed + 40 + k, CELLC.beadHi, 120 * g, ell(q.x, q.y, q.r * 2.1, q.r * 2.1, 14), 0.5, 0.2);
    hardFill(p, seed + 60 + k, col, ell(q.x, q.y, q.r, q.r, 14));
    washAt(p, seed + 80 + k, mix(col, '#7a4a10', 0.35), 120 * dim, ell(q.x + q.r * 0.3, q.y + q.r * 0.3, q.r * 0.6, q.r * 0.55, 10), 0.1, 0.2);
    hardFill(p, seed + 100 + k, mix(CELLC.beadHi, '#ffffff', g), ell(q.x - q.r * 0.35, q.y - q.r * 0.35, q.r * (0.28 + 0.15 * g), q.r * (0.24 + 0.12 * g), 8));
    if (hero) inkLine(p, seed + 120 + k, ell(q.x, q.y, q.r, q.r, 14), {weight: 0.6, color: meet ? '#a8501e' : '#a88a1a'});
  });
  if (burst) {
    // Orange meeting product, violet second enzymes and the lilac mist leaving the cell upward.
    const o = sph(c, [x - 0.08, y + 0.01, 0.01], 1);
    if (o) {
      for (let v = 0; v < 4; v++) hardFill(p, seed + 140 + v, CELLC.violet, fourLobe(o.x + (-0.06 + 0.04 * v) * o.r, o.y + (0.05 - 0.02 * (v % 2)) * o.r, 0.012 * o.r, v));
      for (let m = 0; m < 6; m++) {
        washAt(p, seed + 150 + m, '#a88ad8', 170 - m * 12, blob(seed + 150 + m, o.x + (-0.04 + 0.03 * Math.sin(m * 1.7)) * o.r, o.y - (0.08 + 0.07 * m) * o.r, (0.03 + 0.012 * m) * o.r, (0.024 + 0.01 * m) * o.r, s.t), 0.6, 0.4);
      }
    }
  }
  // Front membrane: a pale translucent veil, a light crescent along the top-left and the ink of the wall.
  const front = rrect(x, y, w, h, ZF, 0.07, 0.01, seed + 3);
  wWash(p, c, seed + 200, CELLC.glow, hero ? 34 : 50, front, 0.3, 0.3);
  const fq = wp(c, front);
  if (fq.length >= 3) {
    inkLine(p, seed + 201, fq, {weight: hero ? 1.6 : 1.0, color: mix('#a8782a', CELLC.wall, hero ? 0 : 0.4), curve: 0.25});
    const hi = wp(c, rrect(x - 0.01, y + 0.008, w * 0.92, h * 0.86, ZF + 0.002, 0.06)).slice(4, 13);
    if (hi.length >= 2) inkLine(p, seed + 202, hi, {closed: false, weight: hero ? 1.4 : 0.9, color: CELLC.wallHi, curve: 0.3});
  }
};

/** Paint the CELL set from `c`: backlight, far layer, wall plane, main layer of cells around the hero (0,0). */
export const paintCellMacro = (p: Painter, c: YCam, s: CellState) => {
  hardFill(p, 50000, CELLC.back, full);
  // Backlight: warm cream-gold glow behind the layer, brightest top-centre (the window light, magnified).
  for (let k = 0; k < 4; k++) washAt(p, 50001 + k, mix(CELLC.glow, CELLC.back, k * 0.25), 120 - k * 20, ell(560, 520 - k * 30, 520 + k * 260, 640 + k * 300, 24), 0.55, 0.35);
  // Far layer (z -0.55): soft cells, half a cell offset, for parallax against the main layer.
  cellsOf(9, 5).forEach((cl, n) => {
    const f = rrect(cl.x + 0.3, cl.y + 0.12, CW - GAP * 1.6, CH - GAP * 1.6, -0.55, 0.07);
    const q = wp(c, f);
    if (q.length >= 3) {
      washAt(p, 50100 + n, mix(CELLC.fluid, CELLC.back, 0.35), 120, q, 0.35, 0.4);
      inkLine(p, 50300 + n, q, {weight: 0.6, color: mix('#a8782a', CELLC.back, 0.5), curve: 0.25, still: true});
    }
  });
  // Wall plane between the main-layer cells (the double cell walls), a little behind the front.
  wWash(p, c, 50500, CELLC.wall, 160, [[-4, -3, -ZF - 0.005], [4, -3, -ZF - 0.005], [4, 3, -ZF - 0.005], [-4, 3, -ZF - 0.005]], 0.3, 0.5);
  // Main layer: cells sorted far to near from the camera (outer first, hero last).
  const cells = cellsOf(7, 3).filter((cl) => {
    const q = camPoint(c, [cl.x, cl.y, ZF]);
    return q && q[0] > -900 && q[0] < W + 900 && q[1] > -900 && q[1] < HGT + 900;
  });
  cells.sort((a, b) => Math.hypot(b.x - c.x, b.y - c.y) - Math.hypot(a.x - c.x, a.y - c.y));
  cells.forEach((cl) => paintCell(p, c, s, cl, cl.i === 0 && cl.j === 0, 51000 + (cl.i + 10) * 400 + (cl.j + 10) * 21 * 400));
  if (s.burst) {
    // The blade edge: a huge cool steel plane entering from the top left, its edge just through the hero cell's wall.
    const b: V3[] = [[-0.9, 0.9, 0.2], [-0.12, 0.9, 0.2], [-0.12, 0.13, 0.05], [-0.9, 0.0, 0.05]];
    const q = clip(wp(c, b));
    if (q.length >= 3) {
      hardFill(p, 59000, CELLC.steel, q);
      washAt(p, 59001, CELLC.steelHi, 120, [q[1], q[2], [q[2][0] - 40, q[2][1]], [q[1][0] - 40, q[1][1]]], 0.1, 0.3);
      inkLine(p, 59002, q, {weight: 1.2, color: '#5d666c'});
    }
  }
};

// ================================================================== EYE (LF03, S01-B04-SH02)

export const EYEC = {
  skin: '#8a5a3b', skinDark: '#5e3a26', skinHi: '#b07a52', lid: '#7a4c32', sclera: '#f4eee6', scleraShade: '#d8c2b2', pink: '#e2a79a',
  iris: '#5a3b24', irisRim: '#2e1d12', irisHi: '#8a6440', pupil: '#120a06', nerve: '#f2c66d', tear: '#d6ecf2', lilac: '#b9a2e0', lash: '#1f1612',
} as const;
const GR = 0.16, GZ = -0.04, SKINZ = 0.07, EW = 0.11, EUP = 0.06, EDN = 0.05;
/** A point on the globe surface over (x, y). */
const onGlobe = (x: number, y: number, lift = 0): V3 => {
  const d = GR * GR - x * x - y * y;
  return [x, y, GZ + Math.sqrt(Math.max(0, d)) + lift];
};
/** Eye opening outline in the skin plane (upper lid arc, lower lid arc), outer corner at +x. */
const lidPts = (n = 28): V3[] => {
  const up: V3[] = [], dn: V3[] = [];
  for (let k = 0; k <= n; k++) {
    const u = k / n, x = -EW + 2 * EW * u, s = Math.sin(Math.PI * u);
    up.push([x, EUP * Math.pow(s, 0.8) * (1 + 0.18 * (0.5 - u)) + 0.006 * (u - 0.5), SKINZ]);
    dn.push([x, -EDN * Math.pow(s, 0.9) * (1 - 0.15 * (0.5 - u)), SKINZ]);
  }
  return [...up, ...dn.reverse()];
};
const upperAt = (x: number) => {
  const u = (x + EW) / (2 * EW), s = Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
  return EUP * Math.pow(s, 0.8) * (1 + 0.18 * (0.5 - u)) + 0.006 * (u - 0.5);
};
const lowerAt = (x: number) => {
  const u = (x + EW) / (2 * EW), s = Math.sin(Math.PI * Math.max(0, Math.min(1, u)));
  return -EDN * Math.pow(s, 0.9) * (1 - 0.15 * (0.5 - u));
};

export type EyeState = {t: number; u: number};
/** Paint the EYE set from `c`. `u` 0..1 runs the shot: mist lands (0.05-0.45), gold sparks x3 (0.28-0.62), tear wave (0.5-0.92), one drop (0.85-1). */
export const paintEyeMacro = (p: Painter, cam: YCam, s: EyeState) => {
  // EYE set-m are tiny next to the yaw camera's 0.3 m near plane, so project through a copy of the scene scaled x10 (same picture).
  const c: YCam = {...cam, x: cam.x * 10, y: cam.y * 10, z: cam.z * 10};
  const sc = (v: V3): V3 => [v[0] * 10, v[1] * 10, v[2] * 10];
  const camPoint = (cc: YCam, v: V3) => camPointRaw(cc, sc(v));
  const wp = (cc: YCam, pts: V3[]) => wpRaw(cc, pts.map(sc));
  const wWash = (q: Painter, cc: YCam, seed: number, color: string, op: number, pts: V3[], bleed = 0.2, tex = 0.45) => wWashRaw(q, cc, seed, color, op, pts.map(sc), bleed, tex);
  const {u, t} = s;
  // Skin: flat base, form washes (brow ridge shadow, cheek light, nose side at screen left), pores and a few fine lines.
  hardFill(p, 60000, EYEC.skin, full);
  wWash(p, c, 60001, EYEC.skinDark, 90, [[-0.6, 0.15, SKINZ], [-0.1, 0.17, SKINZ], [0.25, 0.14, SKINZ], [0.6, 0.18, SKINZ], [0.6, 0.6, SKINZ], [-0.6, 0.6, SKINZ]], 0.7, 0.5);
  wWash(p, c, 60002, EYEC.skinHi, 90, [[-0.1, -0.1, SKINZ], [0.35, -0.08, SKINZ], [0.4, -0.45, SKINZ], [-0.05, -0.5, SKINZ]], 0.6, 0.5);
  wWash(p, c, 60003, EYEC.skinDark, 120, [[-0.6, 0.3, SKINZ], [-0.2, 0.1, SKINZ], [-0.19, -0.6, SKINZ], [-0.6, -0.6, SKINZ]], 0.6, 0.5);
  // Cheekbone light under the eye (form, so the lower frame is not a flat field) and a soft fold toward the nose.
  wWash(p, c, 60004, EYEC.skinHi, 35, [[0.0, -0.14, SKINZ], [0.3, -0.12, SKINZ], [0.32, -0.22, SKINZ], [0.02, -0.26, SKINZ]], 0.7, 0.5);
  wWash(p, c, 60005, EYEC.skinDark, 90, [[-0.2, -0.07, SKINZ], [-0.12, -0.1, SKINZ], [-0.1, -0.4, SKINZ], [-0.22, -0.45, SKINZ]], 0.6, 0.5);
  for (let k = 0; k < 40; k++) {
    const q = camPoint(c, [-0.5 + hash(k * 3.1) * 1.0, -0.55 + hash(k * 7.7) * 0.5, SKINZ]);
    if (q) washAt(p, 60010 + k, EYEC.skinDark, 70, ell(q[0], q[1], 3 + 3 * hash(k), 2.5, 6), 0.1, 0.2);
  }
  // Upper lid fold (crease) and its shadow; lower lid puff.
  const crease: V3[] = Array.from({length: 13}, (_, k): V3 => {
    const x = -EW * 1.05 + (2.15 * EW * k) / 12;
    return [x, upperAt(Math.max(-EW, Math.min(EW, x))) * 1.25 + 0.03, SKINZ];
  });
  const cq = crease.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  if (cq.length > 3) {
    washAt(p, 60060, '#6e4430', 60, [...cq, ...wp(c, lidPts()).slice(0, 29).reverse()], 0.2, 0.4);
    inkLine(p, 60061, cq, {closed: false, weight: 1.6, color: EYEC.skinDark, curve: 0.3});
  }
  const lowF: V3[] = Array.from({length: 11}, (_, k): V3 => {
    const x = -EW * 0.9 + (1.8 * EW * k) / 10;
    return [x, lowerAt(x) * 1.35 - 0.012, SKINZ];
  });
  const lq = lowF.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
  if (lq.length > 3) inkLine(p, 60062, lq, {closed: false, weight: 0.9, color: EYEC.skinDark, curve: 0.3});

  // The eyeball through the opening: sclera with lid shadow and corner pinks, iris and pupil on the globe, cornea highlight.
  const open = wp(c, lidPts());
  if (open.length < 3) return;
  hardFill(p, 60100, EYEC.sclera, open);
  washAt(p, 60101, EYEC.scleraShade, 150, clipToOpen(wp(c, [[-EW, 0.02, SKINZ], [EW, 0.02, SKINZ], [EW, EUP + 0.01, SKINZ], [-EW, EUP + 0.01, SKINZ]]), open), 0.3, 0.4);
  washAt(p, 60102, EYEC.pink, 140, wp(c, Array.from({length: 12}, (_, k): V3 => [-EW + 0.012 + 0.018 * Math.cos(k * 0.52), 0.002 + 0.016 * Math.sin(k * 0.52), SKINZ])), 0.3, 0.3);
  washAt(p, 60103, EYEC.pink, 90, wp(c, Array.from({length: 12}, (_, k): V3 => [EW - 0.015 + 0.02 * Math.cos(k * 0.52), 0.004 + 0.014 * Math.sin(k * 0.52), SKINZ])), 0.3, 0.3);
  const ring = (r: number, lift = 0, cx = 0.004, cy = 0.004, n = 30) => Array.from({length: n}, (_, k): V3 => onGlobe(cx + r * Math.cos((k / n) * 6.283), cy + r * Math.sin((k / n) * 6.283), lift));
  // Iris and pupil clipped to the opening (the lids cover the top and bottom of the iris).
  const irisQ = wp(c, ring(0.052)), pupQ = wp(c, ring(0.022));
  const inOpen = (q: Pt[]) => clipToOpen(q, open);
  const iris = inOpen(irisQ);
  if (iris.length >= 3) {
    hardFill(p, 60110, EYEC.iris, iris);
    for (let k = 0; k < 18; k++) {
      const a = (k / 18) * 6.283, v0 = camPoint(c, onGlobe(0.004 + 0.026 * Math.cos(a), 0.004 + 0.026 * Math.sin(a))), v1 = camPoint(c, onGlobe(0.004 + 0.049 * Math.cos(a + 0.08), 0.004 + 0.049 * Math.sin(a + 0.08)));
      if (v0 && v1) inkLine(p, 60120 + k, [v0, v1], {closed: false, weight: 0.6, color: k % 2 ? EYEC.irisHi : EYEC.irisRim, still: true});
    }
    inkLine(p, 60140, iris, {weight: 1.5, color: EYEC.irisRim, still: true});
    const pup = inOpen(pupQ);
    if (pup.length >= 3) hardFill(p, 60141, EYEC.pupil, pup);
  }
  // Shadow of the upper lid on the eyeball, then the gold nerve endings under the surface.
  washAt(p, 60150, '#6a4030', 120, inOpen(wp(c, [[-EW, 0.022, SKINZ], [EW, 0.028, SKINZ], [EW, EUP + 0.02, SKINZ], [-EW, EUP + 0.02, SKINZ]])), 0.2, 0.3);
  // Watercolour washes darken whatever they cover, so light colours over the dark skin and the white sclera (gas, sparks) are
  // laid as flat veils at partial opacity (`hardFill` on a sub-layer painter), stacked for a soft edge.
  const veil = (seed: number, color: string, a: number, pts: Pt[]) => {
    if (a > 0.002 && pts.length >= 3) hardFill(p.layer(a, seed), seed, color, pts);
  };
  const spark = [bump(u, 0.28, 0.42), bump(u, 0.38, 0.52), bump(u, 0.48, 0.62)];
  const nerves: [number, number, number][] = [[-0.072, 0.012, 0.4], [-0.06, -0.026, -0.5], [0.062, 0.02, 2.8], [0.074, -0.022, 3.5], [-0.088, -0.004, 0.1], [0.09, 0.0, 3.0]];
  nerves.forEach(([x, y, a], k) => {
    const sp = spark[k % 3];
    // A short branching gold line just under the surface (always faintly there), bright on its spark.
    const branch = (a0: number, n: number, x0: number, y0: number) => Array.from({length: n}, (_, q) => camPoint(c, onGlobe(x0 + Math.cos(a0 + 0.35 * Math.sin(q * 1.9)) * 0.007 * q, y0 + Math.sin(a0 + 0.35 * Math.sin(q * 1.9)) * 0.007 * q, 0.001))).filter(Boolean) as Pt[];
    const main = branch(a, 5, x, y), twig = branch(a + 0.7, 3, x + Math.cos(a) * 0.014, y + Math.sin(a) * 0.014);
    for (const [i, line] of [main, twig].entries()) {
      if (line.length < 2) continue;
      inkLine(p, 60160 + k * 2 + i, line, {closed: false, weight: 2.6 + 2.4 * sp, color: mix('#d49a3a', '#b8761c', sp), curve: 0.4});
      if (sp > 0.05) inkLine(p, 60172 + k * 2 + i, line, {closed: false, weight: 1.2 + 1.4 * sp, color: '#ffe9a6', curve: 0.4});
    }
    const tip = camPoint(c, onGlobe(x, y, 0.001));
    if (tip && sp > 0.05) {
      veil(60180 + k * 3, EYEC.nerve, 0.22 * sp, ell(tip[0], tip[1], 70 * sp + 10, 70 * sp + 10, 18));
      veil(60181 + k * 3, '#ffd97a', 0.4 * sp, ell(tip[0], tip[1], 36 * sp + 6, 36 * sp + 6, 16));
      veil(60182 + k * 3, '#fff6d8', 0.9 * sp, ell(tip[0], tip[1], 12 * sp + 3, 12 * sp + 3, 12));
      for (let r = 0; r < 4; r++) {
        const ang = r * 1.57 + 0.4, l0 = 10, l1 = 18 + 34 * sp;
        const seg: Pt[] = [[tip[0] + Math.cos(ang) * l0, tip[1] + Math.sin(ang) * l0], [tip[0] + Math.cos(ang) * l1, tip[1] + Math.sin(ang) * l1]];
        inkLine(p, 60200 + k * 4 + r, seg, {closed: false, weight: 3.2, color: '#c88a1e'});
        inkLine(p, 60230 + k * 4 + r, seg, {closed: false, weight: 1.4, color: '#fff3c0'});
      }
    }
  });
  // Lilac gas settling on the wet surface, wiped where the tear wave has passed (the wave sweeps outer -> inner corner).
  const wave = ramp(u, 0.5, 0.92);
  const waveX = EW * 1.2 - 2.6 * EW * wave;
  const land = ramp(u, 0.05, 0.4);
  const mist: Pt[][] = [];
  for (let m = 0; m < 9; m++) {
    const mx = -0.09 + 0.022 * m, my = -0.022 + 0.04 * hash(m * 5.3);
    if (wave > 0 && mx > waveX) continue;
    const q = camPoint(c, onGlobe(mx, my, 0.004));
    if (q) mist.push(blob(60300 + m, q[0], q[1], 40 + 16 * hash(m * 2), 26 + 10 * hash(m * 3), t));
  }
  mist.forEach((m, i) => veil(60260 + i, '#a890ff', 0.5 * land, inOpen(m)));
  // The gas rising to the eye from the cut onion below: a stream of lilac puffs in front of the cheek, thinning as it climbs.
  for (let m = 0; m < 12; m++) {
    const y = -0.62 + 0.05 * m + 0.03 * Math.sin(t * 0.8 + m), x = -0.02 + 0.06 * Math.sin(m * 1.3 + t * 0.4) + 0.004 * m;
    const q = camPoint(c, [x, y, SKINZ + 0.03]);
    if (!q) continue;
    for (let r = 0; r < 3; r++) veil(60600 + m * 3 + r, '#9a80ff', 0.3, blob(60320 + m, q[0], q[1] + r * 6, (190 - 9 * m) * (1 - 0.25 * r), (120 - 5 * m) * (1 - 0.25 * r), t));
  }
  // Tear wave: a clear water sheet from the upper-outer lid edge sweeping inward across the surface, edge light blue.
  if (wave > 0) {
    const front: V3[] = [], back: V3[] = [];
    for (let k = 0; k <= 10; k++) {
      const y = EUP + 0.01 - ((EUP + EDN + 0.02) * k) / 10, sk = 0.02 * Math.sin(k * 0.6 + t * 3);
      front.push(onGlobe(Math.max(-EW, waveX + sk + 0.012 * (k / 10)), y, 0.006));
      back.push(onGlobe(EW * 1.1, y, 0.006));
    }
    const sheet = inOpen(wp(c, [...front, ...back.reverse()]));
    if (sheet.length >= 3) {
      washAt(p, 60400, EYEC.tear, 32, sheet, 0.15, 0.2);
      // The wave front: a raised bead of water (light-blue band) with a bright crest, so the wash reads at 270 px.
      const band = inOpen(wp(c, [...front, ...front.map(([x, y, z]): V3 => [Math.min(EW * 1.1, x + 0.016), y, z]).reverse()]));
      if (band.length >= 3) hardFill(p.layer(0.4, 60403), 60403, '#bfe4f2', band);
      const fq = front.map((v) => camPoint(c, v)).filter(Boolean) as Pt[];
      inkLine(p, 60401, clipLine(fq, open), {closed: false, weight: 4, color: '#eaf6fa', curve: 0.3});
      inkLine(p, 60402, clipLine(fq.map(([x, y]) => [x + 6, y + 3] as Pt), open), {closed: false, weight: 1.0, color: '#9fc6d4', curve: 0.3});
    }
  }
  // Wet cornea dome: a big soft highlight upper left, a small sharp one, and the wet line along the lower lid.
  const hl = camPoint(c, onGlobe(-0.022, 0.024, 0.01)), hs = camPoint(c, onGlobe(0.03, -0.012, 0.01));
  if (hl) {
    hardFill(p, 60500, '#ffffff', ell(hl[0], hl[1], 26, 18, 14, -0.5));
    washAt(p, 60501, '#ffffff', 90, ell(hl[0] + 10, hl[1] + 8, 58, 34, 16, -0.5), 0.4, 0.3);
  }
  if (hs) hardFill(p, 60502, '#ffffff', ell(hs[0], hs[1], 8, 6, 10));
  const wet = Array.from({length: 15}, (_, k) => {
    const x = -EW * 0.92 + (1.84 * EW * k) / 14;
    return camPoint(c, [x, lowerAt(x) + 0.004, SKINZ + 0.002]);
  }).filter(Boolean) as Pt[];
  inkLine(p, 60510, wet, {closed: false, weight: 2.0 + 2.0 * ramp(u, 0.6, 1), color: '#f6fbfd', curve: 0.3});
  // Lid rims and lashes (a few, curled), lower lashes short.
  const up = wp(c, lidPts()).slice(0, 29);
  inkLine(p, 60520, up, {closed: false, weight: 3.2, color: EYEC.lash, curve: 0.25});
  inkLine(p, 60521, wp(c, lidPts()).slice(29), {closed: false, weight: 1.2, color: EYEC.skinDark, curve: 0.25});
  for (let k = 0; k < 9; k++) {
    const x = -EW * 0.45 + (1.38 * EW * k) / 8, y0 = upperAt(x);
    const out = (x + EW) / (2 * EW), L = 0.009 + 0.008 * out;
    const pts = [[x, y0 + 0.001, SKINZ + 0.002], [x + L * 0.5, y0 + L * 0.9, SKINZ + 0.008], [x + L * 1.3, y0 + L * 1.25, SKINZ + 0.012]].map((v) => camPoint(c, v as V3)).filter(Boolean) as Pt[];
    if (pts.length === 3) inkLine(p, 60530 + k, pts, {closed: false, weight: 2.4, color: EYEC.lash, curve: 0.5});
  }
  for (let k = 0; k < 6; k++) {
    const x = -EW * 0.4 + (1.2 * EW * k) / 5, y0 = lowerAt(x);
    const pts = [[x, y0, SKINZ + 0.002], [x + 0.008, y0 - 0.012, SKINZ + 0.008]].map((v) => camPoint(c, v as V3)).filter(Boolean) as Pt[];
    if (pts.length === 2) inkLine(p, 60550 + k, pts, {closed: false, weight: 1.0, color: EYEC.lash});
  }
  // One drop falls from the lower lid at the outer side at the end.
  const drop = ramp(u, 0.85, 1);
  if (drop > 0) {
    const q = camPoint(c, [0.06, lowerAt(0.06) - 0.01 - 0.12 * drop * drop, SKINZ + 0.01]);
    if (q) {
      hardFill(p, 60560, '#cfe6ee', [[q[0], q[1] - 26], [q[0] + 13, q[1]], [q[0], q[1] + 12], [q[0] - 13, q[1]]]);
      hardFill(p, 60561, '#ffffff', ell(q[0] - 4, q[1] - 2, 3, 4, 8));
    }
  }
};

/** Clip a convex-ish picture polygon to the eye opening (the opening is convex enough for Sutherland-Hodgman). */
const clipToOpen = (q: Pt[], open: Pt[]): Pt[] => {
  let out = q;
  for (let i = 0; i < open.length && out.length; i++) {
    const a = open[i], b = open[(i + 1) % open.length];
    const n: Pt = [a[1] - b[1], b[0] - a[0]]; // inward normal for a clockwise-on-screen outline is flipped below
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
const centroid = (q: Pt[]): Pt => [q.reduce((s, v) => s + v[0], 0) / q.length, q.reduce((s, v) => s + v[1], 0) / q.length];
/** Keep the points of a polyline that lie inside the opening (crude: by the opening's vertical span at that x). */
const clipLine = (q: Pt[], open: Pt[]): Pt[] => {
  const xs = open.map((v) => v[0]);
  const l = Math.min(...xs), r = Math.max(...xs);
  const half = Math.floor(open.length / 2);
  const ySpan = (x: number) => {
    const up = open.slice(0, half), dn = open.slice(half);
    const near = (arr: Pt[]) => arr.reduce((b, v) => (Math.abs(v[0] - x) < Math.abs(b[0] - x) ? v : b), arr[0])[1];
    return [near(up), near(dn)];
  };
  return q.filter(([x, y]) => {
    if (x < l || x > r) return false;
    const [a, b] = ySpan(x);
    return y > Math.min(a, b) && y < Math.max(a, b);
  });
};
