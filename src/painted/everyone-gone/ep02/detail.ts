import {ell, limb} from '../../kit/draw';
import {paintFogBank, paintHalo} from '../../kit/fog';
import {hash} from '../../kit/hash';
import type {Painter, Pt} from '../../kit/painter';
import {frontRect, groundQuad, proj, unitAt, type Cam} from '../space';
import {box} from './collide';
import {fillC, flatQuad, mix, sideQuad, washC} from './places';

// EG-EP02-SHORT set detail in three depth layers (scene sheets SS-R2.6 / EG2-SC-R2.5, set decisions SD01-SD05, guards SD00-G1..G5,
// Boss need B9). Every function here is plate paint: a pure function of the set's own state weight `w` (0 blue hour, 1 warm morning)
// and, for the one ambient item, the pier frame. The sets call the same function in both states, so a prop lands on the same pixels
// (PAIR201); only colour (mix by `w`) and the state-only props (awnings, racks, boards, lanterns, shutters up) differ.
//   fg  = soft, low-chroma washes close to the lens; no ink line (fills only); fg props sit at x<150, x>930, y<860 or y>1250
//         (the caption band is y 860-1248, `EG2_CAPTION_CENTRE_Y` 1214, SD00-G2);
//   mid = props on the set, tone-on-tone with their surround inside the band (within about 6 % luminance);
//   bg  = lower contrast than mid (haze mix), so the lead stays the highest-contrast point (SD00-G1).
// No text, glyph, banner, flag or tent (SD00-G4). Seeds 70000-74999 belong to this file (set bases: Yaowarat 70000, monument 71000,
// pier 72000, soi 73000, shrine/pole close-ups 74000).

const tint = (p: Painter, a: number): Painter => p.layer(a, 0);
const dot = (x: number, y: number, rx: number, ry = rx, n = 10): Pt[] => ell(x, y, rx, ry, n);
const strand = (a: Pt, b: Pt, w: number): Pt[] => limb(a, b, w, w);

/** A crescent (lit side left): the outer circle minus a circle shifted right by `d`, radius `r2`. */
const crescent = (cx: number, cy: number, r: number, d: number, r2: number): Pt[] => {
  const xs = (d * d + r * r - r2 * r2) / (2 * d), ys = Math.sqrt(Math.max(0, r * r - xs * xs));
  const a0 = Math.atan2(-ys, xs), a1 = Math.atan2(ys, xs) - 2 * Math.PI, b0 = Math.atan2(ys, xs - d), b1 = Math.atan2(-ys, xs - d) + 2 * Math.PI;
  const pts: Pt[] = [];
  for (let i = 0; i <= 14; i++) { const a = a0 + ((a1 - a0) * i) / 14; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  for (let i = 0; i <= 14; i++) { const b = b0 + ((b1 - b0) * i) / 14; pts.push([cx + d + r2 * Math.cos(b), cy + r2 * Math.sin(b)]); }
  return pts;
};

// =====================================================================================================================
// SD01 Yaowarat (S01-B01-SH01, S01-B02-SH01, S04-B01-SH04): the street camera `YW_CAM` only
// =====================================================================================================================

/** Tarp-covered motorbikes against the facades (static in both states): side, centre z. Solids for the VD13 test (x 6.2-6.95). */
export const YW_BIKES = [{s: -1, z: -9.6}, {s: 1, z: -14.8}, {s: -1, z: -23.4}] as const;
/** Goods racks and A-frame boards (crowd state only), against the facades. */
export const YW_RACKS = [{s: 1, z: -11.2}, {s: -1, z: -17.4}, {s: 1, z: -27}] as const;
export const YW_BOARDS = [{s: -1, z: -13.1}, {s: 1, z: -20.2}] as const;
export const YW_DETAIL_SOLIDS = [
  ...YW_BIKES.map((b, i) => ({id: `bike${i}`, box: box(b.s * 6.2, b.s * 6.95, 0, 1, b.z - 0.95, b.z + 0.95)})),
  ...YW_RACKS.map((b, i) => ({id: `rack${i}`, box: box(b.s * 6.2, b.s * 6.95, 0, 1.2, b.z - 0.75, b.z + 0.75)})),
  ...YW_BOARDS.map((b, i) => ({id: `board${i}`, box: box(b.s * 6.1, b.s * 6.55, 0, 0.85, b.z - 0.3, b.z + 0.3)})),
];

/** bg: hotel/condo skyline strip beyond the far haze block, pink horizon band, fading crescent moon (blue hour only). */
export const ywBg = (p: Painter, c: Cam, w: number) => {
  washC(p, 70001, mix('#e9bfc2', '#f6d9b4', w), 60, [[-20, 760], [1100, 760], [1100, 908], [-20, 908]], 0.3, 0.5);
  if (w < 1) {
    const q = tint(p, 0.8 * (1 - w));
    washC(q, 70002, '#e8eaee', 40, dot(470, 250, 74), 0.3, 0.3);
    fillC(q, 70003, '#dadee3', crescent(470, 250, 31, 14, 28));
  }
  const z = -205, T: [number, number, number][] = [[-30, 9, 44], [-21, 7, 66], [-13, 10, 50], [-6, 6, 82], [1, 9, 58], [9, 7, 90], [17, 10, 62], [26, 8, 48], [34, 9, 70]];
  T.forEach(([x, wd, h], k) => {
    fillC(p, 70010 + k, mix('#a7b3c1', '#d6c8b0', w), frontRect(c, z, x - wd / 2, x + wd / 2, 0, h));
    fillC(p, 70030 + k, mix('#9aa7b6', '#cbbba3', w), frontRect(c, z, x - wd / 2, x - wd / 2 + 1.1, 0, h)); // shaded edge
    if (w < 1) for (let j = 0; j < 14; j++) {
      const wx = x - wd / 2 + 1.2 + (j % 2) * (wd - 3.2), wy = 8 + Math.floor(j / 2) * 8 + 5 * hash(k * 9 + j);
      if (wy + 2 < h && hash(k * 31 + j * 7) > 0.55) fillC(tint(p, 1 - w), 70050 + k * 20 + j, '#f1e2bc', frontRect(c, z + 0.1, wx, wx + 1.3, wy, wy + 2.2));
    }
  });
};

const ywOffsets = (i: number, k: number, s: number) => hash(i * 7 + k * 3 + s * 11);

/** mid, per bay (far to near, after the shopfront): wall AC units with cable clusters, tarp motorbikes, and in the crowd state awnings, racks, boards, lanterns. */
export const ywBay = (p: Painter, c: Cam, b: {z0: number; z1: number; side: -1 | 1}, i: number, state: 'empty' | 'crowd' | 'mother', w: number, lead: Pt) => {
  const s = b.side, X = s * 7, d = -b.z1, len = b.z1 - b.z0, u = unitAt(c, b.z1 - len / 2), thin = Math.max(1, u * 0.03);
  if (d > 2.5 && d < 42) {
    for (let k = 0; k < 1 + (i % 2); k++) {
      const zc = b.z0 + len * (0.2 + 0.6 * ywOffsets(i, k, s)), y0 = 3.3 + 0.12 * hash(i + k), base = 70100 + i * 24 + k * 8;
      fillC(p, base, mix('#a4adb6', '#cdc3b2', w), sideQuad(c, X - s * 0.2, zc - 0.5, zc + 0.5, y0, y0 + 0.55));
      fillC(p, base + 1, mix('#8a949e', '#b0a695', w), sideQuad(c, X - s * 0.22, zc - 0.42, zc + 0.05, y0 + 0.12, y0 + 0.4));
      for (let j = 0; j < 3; j++) {
        const zz = zc - 0.3 + 0.28 * j, a = proj(c, [X - s * 0.22, y0, zz]), e = proj(c, [X - s * 0.3, y0 - 0.85 - 0.2 * j, zz + 0.1]);
        fillC(p, base + 2 + j, mix('#59636e', '#7a7064', w), strand(a, e, thin));
      }
    }
  }
  YW_BIKES.forEach((bk, k) => {
    if (bk.s !== s || bk.z < b.z0 || bk.z >= b.z1) return;
    const x = s * 6.5, P = (zz: number, y: number): Pt => proj(c, [x, y, bk.z + zz]), base = 70300 + k * 12;
    fillC(p, base, mix('#79848f', '#aa9f90', w), [P(-0.9, 0.04), P(-0.9, 0.5), P(-0.55, 0.8), P(-0.1, 0.96), P(0.4, 0.92), P(0.8, 0.62), P(0.9, 0.34), P(0.9, 0.04)]);
    fillC(p, base + 1, mix('#7f8a95', '#b1a698', w), [P(-0.9, 0.34), P(0.9, 0.3), P(0.9, 0.26), P(-0.9, 0.3)]); // the rope
    fillC(p, base + 2, mix('#6e7984', '#9c9182', w), [P(-0.1, 0.96), P(0.4, 0.92), P(0.5, 0.7), P(0.0, 0.74)]); // fold shadow
  });
  if (state !== 'crowd' || d < 3 || d > 36) return;
  const base = 70500 + i * 30, far = (x: number, y: number) => Math.hypot(x - lead[0], y - lead[1]) > 250;
  if (i % 3 === 0 && d > 5 && d < 24) {
    const col = ['#b37d72', '#d8cfba', '#7d9684'][(i / 3) % 3 | 0], za = b.z0 + 0.5, zb = b.z1 - 0.5;
    fillC(p, base, col, [proj(c, [X, 3.35, za]), proj(c, [X, 3.35, zb]), proj(c, [X - s * 1.15, 2.85, zb]), proj(c, [X - s * 1.15, 2.85, za])]);
    fillC(p, base + 1, '#8b857a', [proj(c, [X - s * 1.15, 2.85, za]), proj(c, [X - s * 1.15, 2.85, zb]), proj(c, [X - s * 1.15, 2.78, zb]), proj(c, [X - s * 1.15, 2.78, za])]);
    for (let k = 0; k < 3; k++) {
      const [lx, ly] = proj(c, [X - s * 0.9, 2.55, za + ((k + 0.5) * (zb - za)) / 3]), r = unitAt(c, zb) * 0.14;
      if (far(lx, ly)) { fillC(p, base + 2 + k, '#9a746c', dot(lx, ly, r, r * 1.2)); fillC(p, base + 6 + k, '#7d6a62', strand([lx, ly - r * 1.4], [lx, ly - r * 2.4], Math.max(1, r * 0.2))); }
    }
  }
  YW_RACKS.forEach((rk, k) => {
    if (rk.s !== s || rk.z < b.z0 || rk.z >= b.z1) return;
    const x = s * 6.55, R = (zz: number, y: number): Pt => proj(c, [x, y, rk.z + zz]), q = base + 12;
    for (const zz of [-0.7, 0.7]) fillC(p, q + (zz > 0 ? 1 : 0), '#7d7a74', strand(R(zz, 0), R(zz, 1.2), Math.max(1, thin)));
    [0.3, 0.7, 1.1].forEach((y, j) => {
      fillC(p, q + 2 + j, '#8f8b80', [R(-0.7, y), R(0.7, y), R(0.7, y - 0.04), R(-0.7, y - 0.04)]);
      for (let g = 0; g < 4; g++) fillC(p, q + 6 + j * 5 + g, ['#a4a08c', '#8c9a92', '#a89484', '#9a9aa4'][(g + j + k) % 4], [R(-0.62 + g * 0.34, y), R(-0.4 + g * 0.34, y), R(-0.4 + g * 0.34, y + 0.2), R(-0.62 + g * 0.34, y + 0.2)]);
    });
  });
  YW_BOARDS.forEach((bd) => {
    if (bd.s !== s || bd.z < b.z0 || bd.z >= b.z1) return;
    const x = bd.s * 6.35, B = (dz: number, y: number, dx = 0): Pt => proj(c, [x + bd.s * dx, y, bd.z + dz]);
    fillC(p, base + 20, '#cfc8b6', [B(-0.28, 0), B(0.28, 0), B(0.1, 0.8, 0.0), B(-0.1, 0.8, 0.0)]); // blank face, no glyph
    fillC(p, base + 21, '#8b857a', [B(-0.1, 0.8), B(0.1, 0.8), B(0.1, 0.84), B(-0.1, 0.84)]);
  });
};

/** mid, after the facades: thin ground mist along the vanishing road (ENV-FOG), blue-hour puddles under the lit signs. */
export const ywMid = (p: Painter, c: Cam, w: number) => {
  paintFogBank(p, {y: 905, height: 110, width: 1080, color: mix('#cfd6de', '#f3e6d0', w), density: 0.4, drift: 0, t: 0, puffs: 5, seed: 70700});
  if (w >= 1) return;
  const q = tint(p, 1 - w);
  [[-4.1, -9], [3.9, -14], [-4.3, -21], [4.2, -28], [-3.8, -35]].forEach(([x, z], k) => washC(q, 70720 + k, '#aebccb', 60, groundQuad(c, x - 0.7, x + 0.7, z - 1.4, z + 1.4), 0.25, 0.5));
};

/** fg: stools on a hand cart at the left kerb edge (below the band), power-line catenary with a junction box at the top edge. Soft, low chroma, no ink. */
export const ywFg = (p: Painter, w: number) => {
  const q = tint(p, 0.78), lo = (a: string, b: string) => mix(a, b, w);
  // cart bed, wheel and a tarp lump
  washC(q, 70800, lo('#4a525c', '#665f56'), 150, [[-30, 1612], [168, 1600], [176, 1646], [-30, 1664]], 0.1, 0.3);
  washC(q, 70801, lo('#3b434c', '#544d45'), 170, dot(150, 1650, 40, 40, 14), 0.1, 0.3);
  washC(q, 70802, lo('#6d7580', '#8b8274'), 110, [[40, 1560], [130, 1548], [170, 1600], [30, 1606]], 0.2, 0.4); // tarp
  // nested stools: tapered stack, seats as stacked ellipses
  washC(q, 70803, lo('#6a6770', '#857a72'), 120, [[16, 1330], [118, 1322], [138, 1556], [4, 1560]], 0.15, 0.35);
  [1340, 1392, 1440, 1486, 1530].forEach((y, k) => washC(q, 70804 + k, lo(['#7a7580', '#77808a', '#827a74', '#7a7d76', '#7b7480'][k], '#928677'), 130, dot(70 + 4 * k - 8, y, 62 - k, 13), 0.12, 0.3));
  [[24, 1346, 12, 1560], [56, 1346, 46, 1560], [96, 1340, 100, 1560], [124, 1334, 134, 1556]].forEach(([x0, y0, x1, y1], k) => fillC(tint(p, 0.55), 70870 + k, lo('#4b4f5a', '#665c54'), strand([x0, y0], [x1, y1], 7))); // legs
  // rope
  fillC(tint(p, 0.5), 70812, lo('#4d555e', '#6a6258'), strand([-10, 1600], [150, 1334], 5));
  // catenary: three sagging strands, none within the mark (y 130-160, x 120-250)
  const wire = (id: number, y0: number, y1: number, sag: number, x0 = -30, x1 = 1110) => {
    const pts: Pt[] = Array.from({length: 13}, (_, i): Pt => { const u = i / 12; return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + sag * 4 * u * (1 - u)]; });
    for (let i = 0; i < 12; i++) fillC(tint(p, 0.62), id + i, lo('#3f4852', '#58504a'), strand(pts[i], pts[i + 1], 3.4));
  };
  wire(70820, 24, 58, 70); wire(70840, 6, 30, 52); wire(70860, 70, 84, 36, 300, 1110);
  fillC(tint(p, 0.7), 70880, lo('#444c56', '#5c544c'), [[742, 104], [808, 104], [808, 168], [742, 168]]); // junction box
  fillC(tint(p, 0.7), 70881, lo('#5b6570', '#756c62'), [[742, 104], [808, 104], [808, 114], [742, 114]]);
  fillC(tint(p, 0.7), 70882, lo('#3a424b', '#524a42'), strand([775, 100], [775, 80], 3));
};

// ---- close shots on the Yaowarat world (SD05): `o.cam` is a CU_* camera --------------------------------------------------
export type CloseKind = 'garland' | 'incense' | 'pole';

/** bg: dawn street bokeh (ENV-GLOW halos), painted before the close shot's haze veil so it sits far behind. */
export const ywCloseBg = (p: Painter, kind: CloseKind, w: number) => {
  const dots: Record<CloseKind, [number, number, number, string][]> = {
    garland: [[60, 690, 36, '#f1dcb2'], [150, 726, 28, '#e9d3b0'], [214, 662, 30, '#f1dcb2']],
    incense: [[70, 560, 40, '#ecd8b4'], [190, 650, 32, '#e8d4b2'], [300, 600, 28, '#eddcba'], [120, 760, 26, '#e8d4b2']],
    pole: [[860, 770, 30, '#f1dcb2'], [950, 790, 24, '#e9d3b0'], [1030, 750, 28, '#f1dcb2'], [800, 700, 20, '#e8d4b2']],
  };
  dots[kind].forEach(([x, y, r, col], k) => paintHalo(p, {x, y, r, color: col, level: 0.4 * (1 - 0.6 * w), squash: 0.9, seed: 74000 + k * 4}));
};

/** mid (after the shrine and the pole): petals, glass and candle stub; ash and stubs; pole rust and sticker ghosts. */
export const ywCloseMid = (p: Painter, c: Cam, kind: CloseKind, w: number) => {
  if (kind === 'garland') {
    const u = unitAt(c, -6.5), at = (x: number, y: number): Pt => proj(c, [x, y, -6.49]);
    // fallen jasmine petals along the ledge top (y 1.1), left and right of the garland
    ([[5.9, 0], [5.95, 1], [6.0, 0], [6.18, 1], [6.21, 0], [6.28, 1]] as [number, number][]).forEach(([x, k], j) => {
      const [px, py] = at(x, 1.1);
      fillC(p, 74100 + j, k ? '#ece9dd' : '#f6f3ea', ell(px, py - u * 0.008, u * 0.014, u * 0.007, 8, 0.3 * j));
    });
    // red candle stub and a small glass of water, right of the garland on the ledge
    const [cx, cy] = at(6.19, 1.1), [gx, gy] = at(6.265, 1.1);
    fillC(p, 74110, '#a8625a', [[cx - u * 0.016, cy], [cx + u * 0.016, cy], [cx + u * 0.014, cy - u * 0.07], [cx - u * 0.014, cy - u * 0.07]]);
    fillC(p, 74111, '#d8c2b2', dot(cx, cy - u * 0.07, u * 0.014, u * 0.005));
    fillC(p, 74112, '#c4cfd6', [[gx - u * 0.022, gy], [gx + u * 0.022, gy], [gx + u * 0.03, gy - u * 0.09], [gx - u * 0.03, gy - u * 0.09]]);
    fillC(p, 74113, '#a3b3be', [[gx - u * 0.022, gy], [gx + u * 0.022, gy], [gx + u * 0.026, gy - u * 0.05], [gx - u * 0.026, gy - u * 0.05]]); // the water
  } else if (kind === 'incense') {
    const u = unitAt(c, -6.5), [px, py] = proj(c, [6.32, 1.1, -6.42]);
    fillC(p, 74120, '#cbc6bd', dot(px, py - u * 0.062, u * 0.055, u * 0.012, 12)); // ash in the pot
    ([[-0.1, 0.01], [-0.075, 0.005], [0.085, 0.008], [0.11, 0.012], [0.03, 0.018]] as [number, number][]).forEach(([dx, dy], k) => fillC(p, 74121 + k, '#4e4640', strand([px + dx * u, py - dy * u], [px + dx * u + u * 0.01 * (k - 2), py - dy * u - u * 0.035], Math.max(1.2, u * 0.006)))); // burnt stubs
    fillC(p, 74130, '#c9a572', ell(px + u * 0.2, py + u * 0.004, u * 0.034, u * 0.012, 10, -0.2)); // fallen petal (low chroma)
    fillC(p, 74131, '#b9916a', ell(px + u * 0.25, py + u * 0.006, u * 0.018, u * 0.008, 8, 0.4));
  } else {
    // pole: a rust streak down the left of the face, worn-paint patches, sticker-residue ghosts (rounded blobs, no text)
    const x0 = -5.2, z = -11.86, u = unitAt(c, z), P = (x: number, y: number): Pt => proj(c, [x0 + x, y, z]);
    washC(p, 74140, mix('#98887a', '#a99a88', w), 70, [P(-0.12, 1.34), P(-0.07, 1.34), P(-0.06, 0.4), P(-0.1, 0.1), P(-0.13, 0.5)], 0.35, 0.6);
    washC(p, 74141, mix('#9a8a7c', '#a99a88', w), 55, [P(0.06, 2.35), P(0.1, 2.35), P(0.09, 1.9), P(0.06, 2.0)], 0.2, 0.5);
    ([[-0.05, 2.15, 0.05, 0.04], [0.05, 2.5, 0.04, 0.06], [-0.04, 0.95, 0.05, 0.045], [0.06, 0.7, 0.04, 0.04], [0.0, 2.8, 0.05, 0.04]] as [number, number, number, number][]).forEach(([dx, y, rx, ry], k) => {
      const [gx, gy] = P(dx, y);
      washC(p, 74150 + k, k % 2 ? mix('#99a1a8', '#aba396', w) : mix('#b4bbc1', '#c4bcae', w), 55, ell(gx, gy, u * rx, u * ry, 8, 0.2 * k), 0.3, 0.5);
    });
    washC(p, 74160, mix('#8e969d', '#a49a8a', w), 80, [P(-0.13, 0.05), P(0.13, 0.05), P(0.13, 0.0), P(-0.13, 0.0)], 0.2, 0.4);
  }
};

/** fg of the close shots: ledge lip and a leaf (garland), a joss-stick bundle (incense), cable bundle and tape end (pole). All soft washes. */
export const ywCloseFg = (p: Painter, kind: CloseKind, w: number) => {
  const q = tint(p, 0.8);
  if (kind === 'garland') {
    washC(q, 74200, mix('#b3b9bd', '#cfc5b4', w), 70, [[-20, 1292], [1100, 1292], [1100, 1346], [-20, 1346]], 0.3, 0.4);
    washC(q, 74201, mix('#6b747c', '#8a8070', w), 60, [[-20, 1346], [1100, 1346], [1100, 1410], [-20, 1410]], 0.4, 0.4);
    washC(q, 74202, mix('#66826a', '#788f68', w), 150, ell(-34, 610, 150, 46, 16, -0.55), 0.35, 0.5);
    washC(q, 74203, mix('#58745e', '#6c855c', w), 110, ell(-10, 520, 110, 34, 14, -0.9), 0.35, 0.5);
  } else if (kind === 'incense') {
    // unlit joss sticks fanning in from the bottom-right corner (tips pale, ends reddish-brown)
    for (let k = 0; k < 8; k++) {
      const a = 3.72 + k * 0.05, len = 560 - 14 * k, tip: Pt = [1110 + len * Math.cos(a), 1960 + len * Math.sin(a) - 10 * k];
      washC(q, 74210 + k, k % 3 ? '#a2907a' : '#9a8672', 140, strand([1110 - 4 * k, 1960], tip, 11 - 0.6 * k), 0.25, 0.4);
    }
    washC(q, 74220, '#8e6a56', 140, [[1000, 1740], [1110, 1700], [1110, 1960], [980, 1960]], 0.3, 0.4); // the binding
  } else {
    const wire = (id: number, y0: number, y1: number, sag: number, wd: number) => {
      const pts: Pt[] = Array.from({length: 9}, (_, i): Pt => { const u = i / 8; return [-30 + 410 * u, y0 + (y1 - y0) * u + sag * 4 * u * (1 - u)]; });
      for (let i = 0; i < 8; i++) fillC(tint(p, 0.55), id + i, mix('#434b54', '#5a524a', w), strand(pts[i], pts[i + 1], wd));
    };
    wire(74240, 20, 40, 34, 9); wire(74250, 46, 70, 28, 7); wire(74260, 2, 16, 22, 6);
    fillC(tint(p, 0.55), 74270, '#d6cfb4', [[52, 70], [70, 70], [66, 190], [48, 186]]); // tape strip end
  }
};

// =====================================================================================================================
// SD02 Victory Monument (S01-B02-SH02, S04-B01-SH05)
// =====================================================================================================================

/** bg: ring of mid-rise buildings in haze behind the obelisk, mist over the circle. */
export const vmBg = (p: Painter, c: Cam, w: number) => {
  const z = -128;
  [[-62, 11, 30], [-50, 8, 22], [-41, 12, 36], [-28, 9, 26], [-16, 7, 20], [21, 8, 24], [31, 12, 34], [44, 9, 22], [54, 10, 30], [66, 8, 20]].forEach(([x, wd, h], k) => {
    fillC(p, 71000 + k * 3, mix('#a0abb8', '#cdbda4', w), frontRect(c, z, x - wd / 2, x + wd / 2, 0, h));
    fillC(p, 71001 + k * 3, mix('#95a1af', '#c2b199', w), frontRect(c, z, x - wd / 2, x - wd / 2 + 1, 0, h));
  });
};
export const vmMist = (p: Painter, w: number) => paintFogBank(p, {y: 910, height: 120, width: 1080, color: mix('#cfd6de', '#f3e6d0', w), density: 0.42, drift: 0, t: 0, puffs: 5, seed: 71100});

/** mid: kerb stripes, lane arrows, traffic-light pole (amber at blue hour, green in the morning), island planter. */
export const vmMid = (p: Painter, c: Cam, w: number) => {
  for (let k = 0; k < 40; k++) {
    const x = -16 + k * 0.8;
    washC(p, 71200 + k, k % 2 ? mix('#8f979f', '#a89f8e', w) : mix('#b2a878', '#c4b88a', w), 90, groundQuad(c, x, x + 0.8, -13.15, -12.9, 0.121), 0.1, 0.3);
  }
  [[2.6, -28], [5.4, -28], [-3.2, -34]].forEach(([x, z], k) => {
    const A = (dx: number, dz: number): Pt => proj(c, [x + dx, 0, z + dz]);
    washC(p, 71300 + k, mix('#8e99a6', '#cfc8b9', w), 80, [A(-0.07, 0), A(0.07, 0), A(0.07, -0.9), A(0.3, -0.9), A(0, -1.5), A(-0.3, -0.9), A(-0.07, -0.9)], 0.1, 0.3);
  });
  // traffic-light pole on the far side of the road, behind the shelter
  const [tx, ty] = proj(c, [6.8, 0, -16]), u = unitAt(c, -16), T = (dx: number, y: number): Pt => [tx + dx * u, ty - (y - 0) * u];
  fillC(p, 71320, mix('#6e7882', '#8d8578', w), [T(-0.05, 0), T(0.05, 0), T(0.05, 5.2), T(-0.05, 5.2)]);
  fillC(p, 71321, mix('#4a535d', '#665e54', w), [T(-0.16, 4.35), T(0.16, 4.35), T(0.16, 5.25), T(-0.16, 5.25)]);
  [5.05, 4.8, 4.55].forEach((y, k) => fillC(p, 71322 + k, k === (w < 1 ? 1 : 2) ? (w < 1 ? '#d7bd86' : '#8fb59d') : '#59636d', dot(...T(0, y), u * 0.075))); // amber at blue hour, green in the morning
  // island planter in the road
  const z0 = -22, z1 = -19;
  fillC(p, 71330, mix('#8e969e', '#bdb2a0', w), frontRect(c, z1, 3, 9, 0, 0.5));
  fillC(p, 71331, mix('#a3aab0', '#cfc4b0', w), flatQuad(c, 3, 9, z0, z1, 0.5));
  const [px, py] = proj(c, [6, 0.5, -20.5]), pu = unitAt(c, -20.5);
  for (let k = 0; k < 5; k++) washC(p, 71332 + k, mix('#6f8670', '#7f9468', w), 150, ell(px + (k - 2) * pu * 0.9, py - pu * (0.2 + 0.1 * (k % 2)), pu * 0.75, pu * 0.42, 12), 0.3, 0.5);
};

/** fg: rain-tree branch (top right) and the blurred back of a street-name sign on its pole (left edge). */
export const vmFg = (p: Painter, w: number) => {
  const q = tint(p, 0.8);
  washC(q, 71400, mix('#5e5348', '#6c5d4c', w), 150, [[990, 400], [990, 452], [820, 336], [660, 250], [680, 214], [840, 290]], 0.35, 0.5);
  [[900, 300, 130, 70], [770, 250, 110, 56], [980, 470, 90, 50], [690, 232, 80, 38]].forEach(([x, y, rx, ry], k) => washC(q, 71401 + k, mix('#6d8872', '#7c9270', w), 105, ell(x, y, rx, ry, 16, 0.2 * k), 0.4, 0.5));
  washC(q, 71410, mix('#707982', '#8f8a7e', w), 120, [[98, 470], [128, 470], [128, 1500], [98, 1500]], 0.3, 0.4);
  washC(q, 71411, mix('#78818a', '#979284', w), 140, [[98, 540], [300, 540], [300, 620], [98, 620]], 0.3, 0.4); // the sign's back: blank plate
};

// =====================================================================================================================
// SD03 Pier (S01-B02-SH03, S02-B01-SH04, S04-B01-SH06, S05-B01-SH01)
// =====================================================================================================================

/** Crate of life jackets and a bin against the wall (x 5.95-6.45), shuttered ticket kiosk at the hall end: solids, same in every state. */
export const PIER_CRATE = box(5.9, 6.45, 0, 0.75, -9.4, -8.4);
export const PIER_BIN = box(5.95, 6.4, 0, 0.8, -10.2, -9.65);
export const PIER_KIOSK = box(4.2, 6.45, 0, 2.5, -23.4, -21.6);

/** bg: far-bank shophouse roofline, a generic prang in haze, two moored long-tail boats, low sun glow, the hyacinth clump (the one ambient item). */
export const pierBg = (p: Painter, bankY: number, w: number, f: number) => {
  const tone = mix('#7d8a99', '#bda98d', w);
  for (let k = 0; k < 18; k++) {
    const x = 330 + k * 42, h = 14 + 10 * hash(k * 3.3);
    fillC(p, 72000 + k, mix('#8a97a6', '#c2af96', w), [[x, bankY + 4], [x, bankY - h], [x + 14, bankY - h - 9], [x + 28, bankY - h], [x + 28, bankY + 4]]);
  }
  const X = 252, Y = bankY + 2;
  fillC(p, 72030, tone, [[X - 20, Y], [X - 20, Y - 26], [X - 13, Y - 40], [X - 10, Y - 64], [X - 6, Y - 92], [X - 2.5, Y - 118], [X, Y - 146], [X + 2.5, Y - 118], [X + 6, Y - 92], [X + 10, Y - 64], [X + 13, Y - 40], [X + 20, Y - 26], [X + 20, Y]]);
  fillC(p, 72031, mix('#74818f', '#b49f84', w), [[X - 28, Y], [X - 28, Y - 14], [X + 28, Y - 14], [X + 28, Y]]);
  paintHalo(p, {x: 190, y: bankY + 14, r: 210, color: mix('#f2dcc0', '#f8e2b0', w), level: 0.36 + 0.3 * w, squash: 0.28, seed: 72040});
  // two long-tail boats, far (hull, raised prow, long shaft)
  [[96, bankY + 26, 1], [222, bankY + 38, -1]].forEach(([x, y, dir], k) => {
    const col = mix('#5d6b7a', '#8c8272', w), L = 62;
    fillC(p, 72050 + k * 4, col, [[x - dir * L, y - 6], [x - dir * (L - 10), y + 3], [x + dir * L * 0.75, y + 3], [x + dir * L * 0.95, y - 4], [x + dir * L, y - 12], [x + dir * (L * 0.85), y - 5]]);
    fillC(p, 72051 + k * 4, mix('#6f7d8c', '#9a8f7e', w), strand([x + dir * L * 0.75, y - 1], [x + dir * (L * 1.5), y - 22], 2.6)); // the long shaft
    fillC(p, 72052 + k * 4, mix('#8997a6', '#b4a690', w), [[x - dir * 10, y - 6], [x + dir * 24, y - 6], [x + dir * 20, y - 12], [x - dir * 4, y - 12]]); // canopy
  });
  // water-hyacinth clump: drifts 1.5 px/s to the right (<= 2 px between S01-B02-SH03 f150 and S02-B01-SH04 f0)
  const hx = 140 + 0.05 * f, hy = bankY + 112;
  for (let k = 0; k < 6; k++) fillC(p, 72070 + k, mix(k % 2 ? '#7b8f78' : '#6f8472', '#8e9a76', w), ell(hx + (k - 2.5) * 20, hy + 3 * Math.sin(k * 2.1), 20, 7.5, 10));
};

/** mid, on the deck before the people: wet patches with a soft reflection (blue hour). */
export const pierWet = (p: Painter, c: Cam, w: number) => {
  if (w >= 1) return;
  const q = tint(p, 1 - w);
  [[0.4, -6.5], [1.6, -9], [-0.4, -12], [2.4, -14.5], [0.2, -18]].forEach(([x, z], k) => washC(q, 72100 + k, '#a7b4c0', 50, groundQuad(c, x - 0.7, x + 0.7, z - 0.9, z + 0.9), 0.3, 0.5));
};

/** Items that stand on the wall side: life ring on the wall pillar at z -7 (drawn with the pillar), life-jacket crate and bin, ticket kiosk with a closed shutter. */
export const pierRing = (p: Painter, c: Cam, w: number) => {
  const [x, y] = proj(c, [6.2, 1.35, -6.8]), u = unitAt(c, -6.8), r = u * 0.36;
  fillC(p, 72200, mix('#b8967c', '#c7a283', w), dot(x, y, r, r, 14));
  fillC(p, 72201, mix('#9aa1a7', '#c8bba5', w), dot(x, y, r * 0.52, r * 0.52, 12));
  for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2 + 0.4; fillC(p, 72202 + k, '#e6dfd0', dot(x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76, r * 0.2, r * 0.2, 8)); }
};
export const paintCrate = (p: Painter, c: Cam, w: number) => {
  const B = PIER_CRATE, F = frontRect(c, B.z1, B.x0, B.x1, 0, 0.75);
  fillC(p, 72300, mix('#74808a', '#a89a82', w), F);
  fillC(p, 72301, mix('#6a757e', '#9c8e76', w), sideQuad(c, B.x0, B.z0, B.z1, 0, 0.75));
  [0.18, 0.42, 0.66].forEach((y, k) => fillC(p, 72302 + k, ['#b0a28c', '#9aa89a', '#b09886'][k], frontRect(c, B.z1 + 0.01, B.x0 + 0.04, B.x1 - 0.04, y, y + 0.18))); // stacked jackets (muted)
  const N = PIER_BIN;
  fillC(p, 72310, mix('#5f6a73', '#8a7d6a', w), frontRect(c, N.z1, N.x0, N.x1, 0, 0.8));
  fillC(p, 72311, mix('#4c565f', '#756858', w), frontRect(c, N.z1 + 0.01, N.x0 - 0.03, N.x1 + 0.03, 0.78, 0.86));
};
export const paintKiosk = (p: Painter, c: Cam, w: number) => {
  const B = PIER_KIOSK;
  fillC(p, 72400, mix('#7f8a93', '#b7a98e', w), frontRect(c, B.z1, B.x0, B.x1, 0, 2.5));
  fillC(p, 72401, mix('#6b7680', '#a19378', w), frontRect(c, B.z1 + 0.01, B.x0 + 0.2, B.x1 - 0.2, 0.2, 2.1)); // the shutter
  for (let k = 0; k < 9; k++) fillC(p, 72402 + k, mix('#79848e', '#ab9d82', w), frontRect(c, B.z1 + 0.02, B.x0 + 0.2, B.x1 - 0.2, 0.3 + 0.2 * k, 0.33 + 0.2 * k));
};

/** fg: ceiling tubes and a hanging wire at the top edge (out of focus), the blurred near pillar at the left edge, a coiled mooring rope below the band. */
export const pierFg = (p: Painter, w: number) => {
  const q = tint(p, 0.7);
  washC(q, 72501, mix('#6f7a85', '#8e8372', w), 150, [[660, 18], [950, 18], [950, 62], [660, 62]], 0.25, 0.4); // tube housing
  washC(q, 72500, mix('#e9eef0', '#f6eedb', w), 190, [[676, 30], [934, 30], [934, 50], [676, 50]], 0.25, 0.4); // the tube
  [[700, 0, 704, 18], [910, 0, 906, 18], [450, 0, 452, 120]].forEach(([x0, y0, x1, y1], k) => fillC(tint(p, 0.5), 72502 + k, mix('#3f4852', '#5a5248', w), strand([x0, y0], [x1, y1], 4.4)));
  fillC(tint(p, 0.45), 72520, mix('#a9b3b9', '#cdbfa7', w), [[-20, -20], [92, -20], [88, 1920], [-20, 1920]]); // the blurred near pillar (flat fill, no bleed)
  for (let k = 0; k < 4; k++) washC(q, 72530 + k, mix('#8f8a7c', '#9f927d', w), 150, dot(150 + k * 4, 1650 - k * 4, 140 - 24 * k, 42 - 7 * k, 16), 0.12, 0.3);
  washC(q, 72540, mix('#7f7a6c', '#8c806c', w), 160, [[150, 1608], [300, 1582], [330, 1604], [170, 1640]], 0.12, 0.3); // the free end
};

// =====================================================================================================================
// SD04 Soi (S03-B01-SH01, S04-B01-SH07)
// =====================================================================================================================

/** Pots along the walls, a school-bag stack by the shop (crowd only), as solids for the VD13 test. */
export const SOI_POTS = [[-3.0, -8.4], [-3.0, -9.3], [-3.0, -16.4], [3.0, -17.4], [3.0, -18.3]] as const;
export const SOI_BAGS = box(-3.15, -2.65, 0, 0.5, -19.4, -18.7);
export const SOI_DETAIL_SOLIDS = [
  ...SOI_POTS.map(([x, z], i) => ({id: `pot${i}`, box: box(x - 0.2, x + 0.2, 0, 0.9, z - 0.2, z + 0.2)})),
  {id: 'bags', box: SOI_BAGS},
];

/** bg: condo tower at the soi end, receding power poles, thin ENV-FOG over the end of the lane. */
export const soiBg = (p: Painter, c: Cam, w: number) => {
  const z = -130;
  fillC(p, 73000, mix('#aeb9c6', '#d8c9b2', w), frontRect(c, z, 1.0, 5.4, 0, 36));
  fillC(p, 73001, mix('#a2aebb', '#cdbea7', w), frontRect(c, z, 1.0, 1.7, 0, 36));
  if (w < 1) for (let j = 0; j < 26; j++) { const wy = 5 + 1.2 * j, wx = 1.6 + 1.5 * (j % 3); if (hash(j * 5.1) > 0.45 && wy < 34) fillC(tint(p, 1 - w), 73010 + j, '#f1e2bc', frontRect(c, z + 0.1, wx, wx + 0.7, wy, wy + 0.8)); }
  [-14, -26, -40, -56].forEach((zz, k) => [-1, 1].forEach((s) => {
    const x = s * 3.0, col = mix('#79848f', '#a39a8a', w);
    fillC(p, 73100 + k * 6 + s, col, frontRect(c, zz, x - 0.09, x + 0.09, 0, 7.6));
    fillC(p, 73103 + k * 6 + s, col, frontRect(c, zz, x - 0.8, x + 0.8, 7.0, 7.2));
  }));
  paintFogBank(p, {y: 898, height: 150, width: 1080, color: mix('#cdd5de', '#f3e6d0', w), density: 0.45, drift: 0, t: 0, puffs: 5, seed: 73200});
};

/** mid: balcony laundry, potted plants along the walls, the corner-shop shutter (closed at blue hour, raised in the morning), school bags (crowd). */
export const soiMid = (p: Painter, c: Cam, w: number) => {
  // balcony rails with hanging laundry on both facades (muted pastels)
  ([[1, -8.2, -14.2], [-1, -6.8, -10.4]] as [number, number, number][]).forEach(([s, za, zb], k) => {
    const X = s * 3.14;
    fillC(p, 73300 + k * 20, mix('#6d7782', '#9b9284', w), sideQuad(c, X, za, zb, 3.55, 3.62));
    fillC(p, 73301 + k * 20, mix('#6d7782', '#9b9284', w), sideQuad(c, X, za, zb, 3.0, 3.05));
    fillC(p, 73302 + k * 20, mix('#6d7782', '#9b9284', w), sideQuad(c, X, za, za + 0.06, 3.0, 3.62));
    fillC(p, 73303 + k * 20, mix('#6d7782', '#9b9284', w), sideQuad(c, X, zb - 0.06, zb, 3.0, 3.62));
    const n = Math.floor((za - zb) / 0.9);
    for (let j = 0; j < n; j++) {
      const z1 = za - 0.3 - j * 0.9, ya = 3.1 + 0.15 * hash(j + k * 9);
      fillC(p, 73310 + k * 20 + j, ['#b9c5d2', '#d9d3c5', '#aab6aa', '#cdbab2', '#bcc4cf'][(j + k) % 5], sideQuad(c, X - s * 0.02, z1, z1 - 0.55, ya, 3.55));
    }
  });
  // potted plants: pot, three leaf washes
  SOI_POTS.forEach(([x, z], k) => {
    const [px, py] = proj(c, [x, 0, z]), u = unitAt(c, z);
    fillC(p, 73400 + k * 6, mix('#8c9094', '#b3a894', w), [[px - u * 0.17, py - u * 0.3], [px + u * 0.17, py - u * 0.3], [px + u * 0.12, py], [px - u * 0.12, py]]);
    for (let j = 0; j < 3; j++) washC(p, 73401 + k * 6 + j, mix('#7e9784', '#8c9e72', w), 170, ell(px + (j - 1) * u * 0.16, py - u * (0.52 + 0.1 * (j % 2)), u * 0.2, u * 0.26, 10), 0.2, 0.4);
  });
  // corner shop on the left facade, far end
  const X = -3.19, za = -22.8, zb = -19.2;
  if (w < 1) {
    fillC(p, 73500, mix('#899499', '#a79a88', w), sideQuad(c, X, za, zb, 0, 2.5));
    for (let k = 0; k < 11; k++) fillC(p, 73501 + k, mix('#808b92', '#9d9080', w), sideQuad(c, X + 0.005, za, zb, 0.2 * k, 0.2 * k + 0.03));
  } else {
    fillC(p, 73500, '#8e8070', sideQuad(c, X, za, zb, 0, 2.2));
    fillC(p, 73501, '#a39b8c', sideQuad(c, X + 0.005, za, zb, 2.2, 2.5));
    [0.3, 0.9, 1.5].forEach((y, k) => fillC(p, 73502 + k, ['#a79c88', '#98a090', '#a99486'][k], sideQuad(c, X + 0.01, za + 0.4, zb - 0.4, y, y + 0.1)));
    const B = SOI_BAGS;
    ['#8f98a6', '#a8957d', '#8ea08e'].forEach((col, k) => {
      const [bx, by] = proj(c, [(B.x0 + B.x1) / 2, 0, B.z1 - 0.1 - 0.2 * k]), u = unitAt(c, B.z1);
      fillC(p, 73520 + k, col, ell(bx + (k - 1) * u * 0.12, by - u * (0.2 + 0.15 * k), u * 0.2, u * 0.2, 10));
    });
  }
};

/** fg: bougainvillea spray and an overhead cable bundle (top), a plastic stool and a water jug (bottom right, below the band). */
export const soiFg = (p: Painter, w: number) => {
  const q = tint(p, 0.75);
  ([[30, 270, 74, 34, 0.5], [112, 310, 62, 28, -0.3], [58, 372, 58, 26, 0.9], [186, 262, 54, 24, 0.2], [18, 440, 66, 30, 0.1], [132, 392, 50, 22, 0.7], [214, 336, 46, 20, -0.5], [88, 236, 40, 18, 0.0]] as [number, number, number, number, number][]).forEach(([x, y, rx, ry, a], k) => washC(q, 73600 + k, k % 3 === 1 ? mix('#a8939e', '#b09b8e', w) : mix('#6c8774', '#7c9270', w), 110, ell(x, y, rx, ry, 14, a), 0.25, 0.5)); // leaf clusters, a few muted pink bracts
  [[-20, 90, 1110, 150, 60], [-20, 40, 1110, 98, 80], [300, 10, 1110, 40, 30]].forEach(([x0, y0, x1, y1, sag], k) => {
    const pts: Pt[] = Array.from({length: 13}, (_, i): Pt => { const u = i / 12; return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + sag * 4 * u * (1 - u)]; });
    for (let i = 0; i < 12; i++) fillC(tint(p, 0.58), 73620 + k * 14 + i, mix('#3f4852', '#58504a', w), strand(pts[i], pts[i + 1], 6.5 - k));
  });
  washC(q, 73700, mix('#7d7a86', '#908474', w), 150, [[930, 1456], [1060, 1450], [1074, 1620], [920, 1626]], 0.15, 0.3); // stool seat and legs
  washC(q, 73701, mix('#6a6874', '#7d7264', w), 150, [[940, 1620], [962, 1620], [958, 1760], [940, 1760]], 0.15, 0.3);
  washC(q, 73702, mix('#6a6874', '#7d7264', w), 150, [[1034, 1620], [1056, 1620], [1062, 1760], [1040, 1760]], 0.15, 0.3);
  washC(q, 73703, mix('#9aa8b4', '#b0aa9a', w), 150, [[950, 1440], [1030, 1440], [1040, 1330], [1018, 1300], [962, 1300], [940, 1330]], 0.2, 0.4); // the water jug (above the stool seat)
};
