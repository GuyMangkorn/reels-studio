import {clipHalf, hardFill, inkLine, washAt} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {BOLLARD, BOLLARD_H, frontRect, groundQuad, POST, proj, SUN_DIR, SUN_K, type Cam} from './space';

// EG-EP01-SHORT soi + storefront set, daylight key (brief R1.2: VD02 look, VD04 stations, VD05 glass stack, VD13 shadows).
// Look-defining first version by Film (W3.1, 3 Nov 2026); Boss hardens it and lifts the generic parts to
// `src/painted/kit/street.ts` / `storefront.ts` as the brief's placement table says. Pure in (painter, camera, options).
// Paint order (VD05): far facades, storefront interior, reflection slot (street only, never the figure), sheen, frames,
// pavement and road, set cast shadows, standing props. The figure (figure-back.ts) is painted after this, with no shadow.

/** Palette: cool desaturated blue-grey and sand, warm only in the shop interior (VD02). */
export const EG_PAL = {
  sky: '#e9ecea', skyLow: '#f3f1ea',
  facadeA: '#c9cfd0', facadeB: '#d8cfbf', facadeC: '#b8c2c4', upperWin: '#7f8d95', grille: '#5f6d75',
  shutter: '#b3b8b6', shutterLine: '#8e9592',
  store: '#e4e1d9', fascia: '#bf6f5c', fasciaStripe: '#efe6d4', lowWall: '#cbc5b8',
  frame: '#9aa3a7', frameInk: '#4b555b',
  interior: '#f1e2c0', interiorDeep: '#e3cfa4', shelf: '#c8b48c', fridge: '#e7efef', ceilingLamp: '#fbf6e6',
  pavement: '#cdc6b7', pavementLine: '#aaa293', kerb: '#dcd6c9', road: '#a3a8aa', roadFar: '#a9aeaf',
  shadow: '#5c6b7c', post: '#6f7a80', postInk: '#3c454b', wire: '#3e474d',
  bike: '#56636d', bikeSeat: '#2f3439', tyre: '#2a2d30', bikeLight: '#b0574b',
} as const;

export type SetOpts = {
  /** Door opening 0..1 (VD06 doorOpen clock; 0 = shut). */
  door?: number;
  /** Draw the reflection slot (default true). It holds the street only (VD05, CL04). */
  reflection?: boolean;
};

type Rect = [number, number, number, number]; // x0, y0, x1, y1 (screen px)

/** Flat fill at an opacity (brush.wash: no bleed, no texture). */
const flatA = (p: Painter, seed: number, color: string, opacity: number, pts: Pt[]) => {
  if (pts.length < 3) return;
  const {brush} = p;
  brush.seed(seed);
  brush.noiseSeed(seed);
  brush.noStroke();
  brush.noFill();
  brush.wash(color, opacity * p.alpha);
  brush.polygon(pts);
  brush.noWash();
};
const rectOf = (pts: Pt[]): Rect => [Math.min(...pts.map((q) => q[0])), Math.min(...pts.map((q) => q[1])), Math.max(...pts.map((q) => q[0])), Math.max(...pts.map((q) => q[1]))];
const clipRect = (pts: Pt[], [x0, y0, x1, y1]: Rect): Pt[] => {
  let r = clipHalf(pts, [1, 0], x0);
  if (r.length) r = clipHalf(r, [-1, 0], -x1);
  if (r.length) r = clipHalf(r, [0, 1], y0);
  if (r.length) r = clipHalf(r, [0, -1], -y1);
  return r;
};
/**
 * Sun shadow fill (VD13): a flat cool layer (crisp edge, the low sun) plus a soft wash over it for paper texture. Plain
 * `washAt` alone reads far paler than its opacity on the light pavement (W3.1 look-frame check), so the flat layer carries it.
 */
export const shadowFill = (p: Painter, seed: number, pts: Pt[], opacity = 100) => {
  if (pts.length < 3) return;
  flatA(p, seed, EG_PAL.shadow, opacity, pts);
  washAt(p, seed + 0.5, EG_PAL.shadow, opacity * 0.6, pts, 0.06, 0.35);
};
/** Frame-safe cut (keeps every polygon inside a generous picture margin). */
const SAFE: Rect = [-400, -400, 1480, 2320];

/**
 * Ground shadow of a vertical object (footprint half-width `w`, height `h`) standing at (x, z): a strip along SUN_DIR on the
 * pavement, then straight up the storefront plane (z 0) for the height it has left.
 */
const castShadow = (p: Painter, c: Cam, seed: number, [x, , z]: V3, w: number, h: number, opacity = 120) => {
  const [dx, dz] = SUN_DIR, L = SUN_K * h;
  const tWall = dz < 0 ? z / -dz : Infinity;
  const tEnd = Math.min(L, tWall);
  const nx = -dz, nz = dx; // across the strip
  const a: V3 = [x - nx * w, 0, z - nz * w], b: V3 = [x + nx * w, 0, z + nz * w];
  const tip = (q: V3, s: number): V3 => [q[0] + dx * tEnd * s, 0, q[2] + dz * tEnd * s];
  const ground = [proj(c, a), proj(c, b), proj(c, tip(b, 1)), proj(c, tip(a, 0.97))];
  shadowFill(p, seed, clipRect(ground, SAFE), opacity);
  if (L > tWall) {
    const hx = x + dx * tWall, rest = (L - tWall) / SUN_K;
    // On the wall it stops under the canopy shade (2.55 m); above that the canopy and fascia already sit in shade, and a
    // full-height strip read as a second post in the W3.1 check.
    flatA(p, seed + 1, EG_PAL.shadow, opacity * 0.45, frontRect(c, 0.01, hx - w, hx + w, 0, Math.min(rest, 2.55)));
  }
};

/** Facade bays of a shophouse row (x0..x1 at depth z): upper floors with windows and grilles, a ledge per floor. */
const shophouses = (p: Painter, c: Cam, seed: number, z: number, x0: number, x1: number, top: number, tone: (i: number) => string, groundFloor: boolean) => {
  const bay = 4;
  let i = 0;
  for (let x = x0; x < x1 - 0.01; x += bay, i++) {
    const xe = Math.min(x1, x + bay);
    hardFill(p, seed + i * 20, tone(i), frontRect(c, z, x, xe, groundFloor ? 0 : 3.3, top - (i % 3 === 1 ? 0.6 : 0)));
    for (const [y0, y1] of [[4.1, 5.6], [7.1, 8.5]] as const) {
      if (y1 > top - 0.4) continue;
      hardFill(p, seed + i * 20 + 1 + y0, EG_PAL.upperWin, frontRect(c, z, x + 0.6, xe - 0.6, y0, y1));
      for (let k = 1; k < 6; k++) {
        const gx = x + 0.6 + ((xe - x - 1.2) * k) / 6;
        inkLine(p, seed + i * 20 + 4 + k + y0, [proj(c, [gx, y0, z]), proj(c, [gx, y1, z])], {color: EG_PAL.grille, weight: 0.8, closed: false, curve: 0, still: true});
      }
      hardFill(p, seed + i * 20 + 12 + y0, '#e9e6de', frontRect(c, z, x + 0.3, xe - 0.3, y0 - 0.22, y0 - 0.08));
    }
    if (groundFloor) {
      // Closed roller shutter (07:00: neighbours not yet open), corrugation lines.
      hardFill(p, seed + i * 20 + 15, EG_PAL.shutter, frontRect(c, z, x + 0.35, xe - 0.35, 0, 2.9));
      for (let k = 1; k < 14; k++) {
        const yy = (2.9 * k) / 14;
        inkLine(p, seed + i * 20 + 30 + k, [proj(c, [x + 0.35, yy, z]), proj(c, [xe - 0.35, yy, z])], {color: EG_PAL.shutterLine, weight: 0.6, closed: false, curve: 0, still: true});
      }
    }
  }
};

/** Door geometry (m): opening -0.9..0.9, 2.2 high, transom to 2.55; the sensor box sits centred on the transom. */
export const DOOR = {x0: -0.9, x1: 0.9, top: 2.2, transom: 2.55} as const;
const WIN_L = [-3.8, -1.1] as const, WIN_R = [1.1, 3.8] as const, WIN_Y = [0.45, 2.55] as const;

/** Glass rects on screen for camera `c`, after the door panels slide by `open` (panels slide outward behind the wall). */
const glassRects = (c: Cam, open: number) => {
  const slide = 0.86 * open;
  const panelL = frontRect(c, 0, DOOR.x0 - slide, -slide, 0, DOOR.top), panelR = frontRect(c, 0, slide, DOOR.x1 + slide, 0, DOOR.top);
  const opening = rectOf(frontRect(c, 0, DOOR.x0, DOOR.x1, 0, DOOR.top));
  const clipOpen = (r: Rect): Rect | null => {
    const x0 = Math.max(r[0], opening[0]), x1 = Math.min(r[2], opening[2]);
    return x1 - x0 > 1 ? [x0, r[1], x1, r[3]] : null;
  };
  const doors = [clipOpen(rectOf(panelL)), clipOpen(rectOf(panelR))].filter((r): r is Rect => !!r);
  return {
    doors,
    fixed: [rectOf(frontRect(c, 0, WIN_L[0], WIN_L[1], WIN_Y[0], WIN_Y[1])), rectOf(frontRect(c, 0, WIN_R[0], WIN_R[1], WIN_Y[0], WIN_Y[1])), rectOf(frontRect(c, 0, DOOR.x0, DOOR.x1, DOOR.top + 0.06, DOOR.transom))],
    opening,
  };
};

/** The lit shop interior seen through every glass rect (warm, the "someone just left" accent of VD02). */
const interior = (p: Painter, c: Cam, seed: number, rects: Rect[]) => {
  const box = (z: number, x0: number, x1: number, y0: number, y1: number) => rectOf(frontRect(c, z, x0, x1, y0, y1));
  rects.forEach((r, i) => {
    const s = seed + i * 100;
    const R = (pts: Pt[]) => clipRect(pts, r);
    hardFill(p, s, EG_PAL.interior, R([[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]]));
    // Floor (tiles, paler) and back wall depth.
    hardFill(p, s + 1, '#e9e2d2', R(groundQuad(c, -4, 4, -7, 0)));
    // Shelf rows at z -2.2 and -4.5 (frontal), product dabs; a cool fridge bank on the back wall.
    for (const [z, k] of [[-4.6, 0], [-2.3, 1]] as const) {
      for (const [x0, x1] of [[-3.4, -1.6], [-1.2, 0.6], [1.4, 3.4]] as const) {
        const b = box(z, x0, x1, 0, 1.55);
        hardFill(p, s + 10 + k * 10 + x0 * 2, EG_PAL.shelf, R([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]]));
        for (let row = 0; row < 4; row++) {
          const y0 = 0.25 + row * 0.35;
          const q = box(z + 0.01, x0 + 0.05, x1 - 0.05, y0, y0 + 0.2);
          const col = ['#d98f6e', '#8fb2a8', '#e0c46c', '#a7a0c0'][(row + k + Math.round(x0)) & 3];
          washAt(p, s + 40 + k * 20 + row + x0 * 3, col, 150, R([[q[0], q[1]], [q[2], q[1]], [q[2], q[3]], [q[0], q[3]]]), 0.05, 0.5);
        }
      }
    }
    const f = box(-6.9, 1.0, 3.9, 0, 2.1);
    hardFill(p, s + 80, EG_PAL.fridge, R([[f[0], f[1]], [f[2], f[1]], [f[2], f[3]], [f[0], f[3]]]));
    for (let k = 1; k < 4; k++) {
      const fx = proj(c, [1.0 + (2.9 * k) / 4, 0, -6.9])[0];
      const seg = R([[fx - 1, f[1]], [fx + 1, f[1]], [fx + 1, f[3]], [fx - 1, f[3]]]);
      if (seg.length) hardFill(p, s + 81 + k, '#b9c6c8', seg);
    }
    // Ceiling lamp strips (warm).
    for (const z of [-1.5, -3.5, -5.5]) {
      const l = box(z, -2.5, 2.5, 2.75, 2.8);
      hardFill(p, s + 90 + z, EG_PAL.ceilingLamp, R([[l[0], l[1]], [l[2], l[1]], [l[2], l[3]], [l[0], l[3]]]));
    }
  });
};

/**
 * Reflection slot (VD05): the street behind the camera mirrored in z (z -> -z), clipped to each glass rect, at `opacity`.
 * Holds the far shophouses, the road, the far pavement and the lamp post. **No figure is ever drawn here** (CL04).
 */
const reflection = (p: Painter, c: Cam, seed: number, rects: Rect[], opacity: number) => {
  const m = (x: number, y: number, z: number): Pt => proj(c, [x, y, -z]);
  rects.forEach((r, i) => {
    const s = seed + i * 60;
    const R = (pts: Pt[]) => clipRect(pts, r);
    const quad = (pts: Pt[], col: string, o: number, k: number) => {
      const q = R(pts);
      if (q.length) flatA(p, s + k, col, o, q);
    };
    // Sky behind the far row (milky, brightest), then the far facades (mirrored z 11) with window rows.
    quad([[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]], '#eef0ec', opacity * 0.9, 1);
    for (let b = -4; b < 4; b++) {
      const x0 = b * 4, x1 = x0 + 4;
      quad([m(x0, 0, 11), m(x1, 0, 11), m(x1, 9.5 - (b & 1) * 1.2, 11), m(x0, 9.5 - (b & 1) * 1.2, 11)], b & 1 ? '#c7c9c2' : '#b9c3c6', opacity, 2 + b + 4);
      for (const y0 of [1.0, 4.1, 7.1]) quad([m(x0 + 0.6, y0, 11), m(x1 - 0.6, y0, 11), m(x1 - 0.6, y0 + 1.4, 11), m(x0 + 0.6, y0 + 1.4, 11)], '#8d9aa0', opacity * 0.8, 20 + b * 3 + y0);
    }
    // Far pavement, road, our own pavement (mirrored ground: lighter toward the glass base).
    quad([m(-14, 0, 11), m(14, 0, 11), m(14, 0, 8.5), m(-14, 0, 8.5)], EG_PAL.pavement, opacity, 40);
    quad([m(-14, 0, 8.5), m(14, 0, 8.5), m(14, 0, 2.5), m(-14, 0, 2.5)], EG_PAL.road, opacity, 41);
    quad([m(-14, 0, 2.5), m(14, 0, 2.5), m(14, 0, 0.02), m(-14, 0, 0.02)], EG_PAL.pavement, opacity, 42);
    // The lamp post (a physical object: it reflects).
    quad([m(POST[0] - 0.08, 0, POST[2]), m(POST[0] + 0.08, 0, POST[2]), m(POST[0] + 0.08, 6, POST[2]), m(POST[0] - 0.08, 6, POST[2])], EG_PAL.post, opacity * 1.1, 43);
    quad([m(BOLLARD[0] - 0.06, 0, BOLLARD[2]), m(BOLLARD[0] + 0.06, 0, BOLLARD[2]), m(BOLLARD[0] + 0.06, BOLLARD_H, BOLLARD[2]), m(BOLLARD[0] - 0.06, BOLLARD_H, BOLLARD[2])], EG_PAL.post, opacity * 1.1, 44);
  });
};

/** Glass sheen (DF-20261030-painted-glass-sheen-veil: low, so the interior stays visible): two pale diagonal bands per rect. */
const sheen = (p: Painter, seed: number, rects: Rect[]) => {
  rects.forEach((r, i) => {
    const w = r[2] - r[0], h = r[3] - r[1];
    for (const [u, bw] of [[0.18, 0.12], [0.55, 0.05]] as const) {
      const x = r[0] + u * w, d = 0.35 * h;
      const band = clipRect([[x, r[3]], [x + bw * w, r[3]], [x + bw * w + d, r[1]], [x + d, r[1]]], r);
      if (band.length) flatA(p, seed + i * 4 + u * 10, '#ffffff', 34, band);
    }
  });
};

/** A parked scooter seen from behind (rear card at depth z): tyre, body, seat, tail light, handlebar and mirrors. */
const scooter = (p: Painter, c: Cam, seed: number, x: number, z: number) => {
  const P = (u: number, y: number): Pt => proj(c, [x + u, y, z]);
  hardFill(p, seed, EG_PAL.tyre, [P(-0.06, 0), P(0.06, 0), P(0.07, 0.42), P(-0.07, 0.42)]);
  hardFill(p, seed + 1, EG_PAL.bike, [P(-0.2, 0.3), P(0.2, 0.3), P(0.24, 0.62), P(0.2, 0.8), P(-0.2, 0.8), P(-0.24, 0.62)]);
  hardFill(p, seed + 9, '#8796a0', [P(-0.24, 0.62), P(-0.2, 0.3), P(-0.1, 0.3), P(-0.13, 0.78), P(-0.2, 0.8)]);
  hardFill(p, seed + 2, EG_PAL.bikeSeat, [P(-0.17, 0.8), P(0.17, 0.8), P(0.15, 0.88), P(-0.15, 0.88)]);
  hardFill(p, seed + 3, EG_PAL.bikeLight, [P(-0.1, 0.62), P(0.1, 0.62), P(0.1, 0.69), P(-0.1, 0.69)]);
  inkLine(p, seed + 4, [P(-0.36, 1.05), P(-0.1, 1.0), P(0.1, 1.0), P(0.36, 1.05)], {color: EG_PAL.postInk, weight: 1.4, closed: false, curve: 0.2});
  for (const s of [-1, 1]) inkLine(p, seed + 5 + s, [P(s * 0.26, 1.04), P(s * 0.3, 1.25)], {color: EG_PAL.postInk, weight: 1.1, closed: false, curve: 0});
  inkLine(p, seed + 8, [P(-0.2, 0.3), P(-0.24, 0.62), P(-0.2, 0.8), P(0.2, 0.8), P(0.24, 0.62), P(0.2, 0.3)], {color: EG_PAL.postInk, weight: 1.0, closed: false, curve: 0.3});
};

/** A plastic stool (frontal card, cool blue-grey: no warm accent outside the clue objects). */
export const stoolCard = (p: Painter, c: Cam, seed: number, x: number, z: number, col = '#7f97a6') => {
  const P = (u: number, y: number): Pt => proj(c, [x + u, y, z]);
  hardFill(p, seed, col, [P(-0.17, 0.45), P(0.17, 0.45), P(0.17, 0.4), P(-0.17, 0.4)]);
  hardFill(p, seed + 1, col, [P(-0.15, 0.4), P(0.15, 0.4), P(0.18, 0), P(0.1, 0), P(0.08, 0.3), P(-0.08, 0.3), P(-0.1, 0), P(-0.18, 0)]);
  hardFill(p, seed + 3, '#a9bcc7', [P(-0.15, 0.4), P(-0.06, 0.4), P(-0.1, 0), P(-0.18, 0)]);
  inkLine(p, seed + 2, [P(-0.17, 0.45), P(0.17, 0.45), P(0.18, 0), P(0.1, 0), P(0.08, 0.3), P(-0.08, 0.3), P(-0.1, 0), P(-0.18, 0)], {color: '#3d4d57', weight: 1.0, curve: 0.05});
};

/** Overhead wires sagging across the soi (screen ink, held still so the sky does not crawl). */
const wires = (p: Painter, c: Cam, seed: number) => {
  [[6.4, 0.5], [6.1, 0.65], [5.8, 0.8]].forEach(([h, sag], i) => {
    const pts: Pt[] = Array.from({length: 15}, (_, j) => {
      const u = j / 14;
      return proj(c, [POST[0] + (11 - POST[0]) * u, h - sag * Math.sin(Math.PI * u), POST[2] + (1.6 - POST[2]) * u]);
    });
    inkLine(p, seed + i, pts, {color: EG_PAL.wire, weight: 1.1, closed: false, curve: 0.4, still: true});
    const cross: Pt[] = Array.from({length: 15}, (_, j) => {
      const u = j / 14;
      return proj(c, [POST[0] + (-14 - POST[0]) * u, h - 0.1 - sag * 0.8 * Math.sin(Math.PI * u), POST[2] + (9.5 - POST[2]) * u]);
    });
    inkLine(p, seed + 10 + i, cross, {color: EG_PAL.wire, weight: 1.0, closed: false, curve: 0.4, still: true});
  });
};

/** Paint the soi + storefront for camera `c` (plate px). The figure is not part of the set. */
export const paintSoiStore = (p: Painter, c: Cam, o: SetOpts = {}) => {
  const open = o.door ?? 0;
  const S = 7_100_000;
  // Sky (milky, no sun disc): only shows above the rows in the wide (station C).
  washAt(p, S + 1, EG_PAL.sky, 255, [[-300, -300], [1380, -300], [1380, 1400], [-300, 1400]], 0.1, 0.25);
  washAt(p, S + 2, EG_PAL.skyLow, 140, [[-300, 300], [1380, 300], [1380, 1400], [-300, 1400]], 0.3, 0.3);

  // Neighbour rows left and right of the store, and the store's own upper floors.
  shophouses(p, c, S + 100, -0.25, -16, -4, 9.6, (i) => [EG_PAL.facadeB, EG_PAL.facadeC, EG_PAL.facadeA][i % 3], true);
  shophouses(p, c, S + 400, -0.25, 4, 16, 9.6, (i) => [EG_PAL.facadeA, EG_PAL.facadeB, EG_PAL.facadeC][i % 3], true);
  shophouses(p, c, S + 700, 0, -4, 4, 10.2, () => EG_PAL.facadeA, false);

  // Storefront ground floor: wall, fascia band (generic colour, no text, no logo), low wall under the windows.
  hardFill(p, S + 800, EG_PAL.store, frontRect(c, 0, -4, 4, 0, 3.3));
  hardFill(p, S + 801, EG_PAL.fascia, frontRect(c, 0.02, -4, 4, 2.75, 3.3));
  hardFill(p, S + 802, EG_PAL.fasciaStripe, frontRect(c, 0.03, -4, 4, 2.86, 2.93));
  hardFill(p, S + 803, EG_PAL.lowWall, frontRect(c, 0, -3.8, -1.1, 0, WIN_Y[0]));
  hardFill(p, S + 804, EG_PAL.lowWall, frontRect(c, 0, 1.1, 3.8, 0, WIN_Y[0]));

  // Glass: interior first, then the reflection slot, then the sheen (DF-20261030-painted-layer-order).
  const g = glassRects(c, open);
  const all = [...g.fixed, ...g.doors];
  // Interior through the open part of the doorway as well.
  const gap = open > 0.02 ? [rectOf(frontRect(c, 0, -0.86 * open, 0.86 * open, 0, DOOR.top))] : [];
  interior(p, c, S + 1000, [...all, ...gap]);
  if (o.reflection !== false) reflection(p, c, S + 3000, all, 118);
  sheen(p, S + 5000, all);

  // Frames: window mullions, door panel frames, transom bar, the sensor box above the door (VD07 push-in target).
  const bar = (seed: number, x0: number, x1: number, y0: number, y1: number, z = 0.02) => hardFill(p, seed, EG_PAL.frame, frontRect(c, z, x0, x1, y0, y1));
  for (const [x0, x1] of [WIN_L, WIN_R]) {
    bar(S + 5100 + x0, x0 - 0.05, x0, WIN_Y[0], WIN_Y[1]);
    bar(S + 5110 + x0, x1, x1 + 0.05, WIN_Y[0], WIN_Y[1]);
    bar(S + 5120 + x0, (x0 + x1) / 2 - 0.025, (x0 + x1) / 2 + 0.025, WIN_Y[0], WIN_Y[1]);
    bar(S + 5130 + x0, x0, x1, WIN_Y[0] - 0.05, WIN_Y[0]);
    bar(S + 5140 + x0, x0, x1, WIN_Y[1], WIN_Y[1] + 0.05);
  }
  bar(S + 5150, DOOR.x0 - 0.07, DOOR.x0, 0, DOOR.transom + 0.05);
  bar(S + 5151, DOOR.x1, DOOR.x1 + 0.07, 0, DOOR.transom + 0.05);
  bar(S + 5152, DOOR.x0, DOOR.x1, DOOR.top, DOOR.top + 0.06);
  bar(S + 5153, DOOR.x0 - 0.07, DOOR.x1 + 0.07, DOOR.transom, DOOR.transom + 0.05);
  const slide = 0.86 * open;
  for (const [side, x0, x1] of [[0, DOOR.x0 - slide, -slide], [1, slide, DOOR.x1 + slide]] as const) {
    const cx0 = Math.max(x0, DOOR.x0), cx1 = Math.min(x1, DOOR.x1);
    if (cx1 - cx0 < 0.03) continue;
    if (x0 >= DOOR.x0 - 1e-6) bar(S + 5160 + side * 4, x0, x0 + 0.045, 0, DOOR.top, 0.04);
    if (x1 <= DOOR.x1 + 1e-6) bar(S + 5161 + side * 4, x1 - 0.045, x1, 0, DOOR.top, 0.04);
    bar(S + 5162 + side * 4, cx0, cx1, 0, 0.1, 0.04);
  }
  hardFill(p, S + 5170, '#d7dbdc', frontRect(c, 0.08, -0.22, 0.22, 2.3, 2.45));
  hardFill(p, S + 5171, '#3f4a50', frontRect(c, 0.09, -0.1, 0.1, 2.34, 2.38));
  inkLine(p, S + 5172, frontRect(c, 0.08, -0.22, 0.22, 2.3, 2.45), {color: EG_PAL.frameInk, weight: 0.9, curve: 0});
  inkLine(p, S + 5173, frontRect(c, 0, DOOR.x0 - 0.07, DOOR.x1 + 0.07, 0, DOOR.transom + 0.05), {color: EG_PAL.frameInk, weight: 1.0, curve: 0});

  // Shallow canopy over the frontage (its shade band on the wall above the door).
  const cv = (x: number, z: number, y: number) => proj(c, [x, y, z]);
  hardFill(p, S + 5200, '#8e9aa1', [cv(-4, 0, 3.32), cv(4, 0, 3.32), cv(4, 0.9, 3.45), cv(-4, 0.9, 3.45)]);
  hardFill(p, S + 5202, '#b7c0c4', [cv(-4, 0.9, 3.45), cv(4, 0.9, 3.45), cv(4, 0.9, 3.52), cv(-4, 0.9, 3.52)]);
  flatA(p, S + 5201, EG_PAL.shadow, 60, frontRect(c, 0.01, -4, 4, 2.55, 2.75));

  // Pavement (z 0..2.5, raised 0.12), kerb, road (2.5..8.5), far pavement (8.5..11). Tile joints on our pavement.
  hardFill(p, S + 6000, EG_PAL.roadFar, groundQuad(c, -16, 16, 2.5, 8.5, 0));
  for (let k = 0; k < 6; k++) washAt(p, S + 6010 + k, '#9a9fa1', 70, groundQuad(c, -16, 16, 2.6 + k, 3.1 + k, 0), 0.2, 0.6);
  // Shade of the low camera-side row across the near road (its roofline steps), so the storefront side reads sunlit.
  const shade: Pt[] = [[-16, 3.3], [-6, 3.3], [-5, 3.8], [-1, 3.8], [0, 3.05], [5, 3.05], [6, 3.6], [16, 3.6], [16, 11], [-16, 11]].map(([x, z]) => proj(c, [x, 0, Math.min(z, c.z - 0.36)]));
  shadowFill(p, S + 6060, clipRect(shade, SAFE), 85);
  const mh = groundQuad(c, 1.1, 1.7, 5.2, 5.8, 0);
  if (c.z - 5.8 > 0.4) {
    flatA(p, S + 6070, '#7f8588', 200, mh);
    inkLine(p, S + 6071, mh, {color: '#5d6366', weight: 0.8, curve: 0, still: true});
  }
  for (let x = -16; x < 16; x += 0.9) flatA(p, S + 6080 + Math.round(x * 10), '#6d7477', 160, [proj(c, [x, 0, 2.55]), proj(c, [x + 0.5, 0, 2.55]), proj(c, [x + 0.5, 0, 2.7]), proj(c, [x, 0, 2.7])]);
  hardFill(p, S + 6001, EG_PAL.pavement, groundQuad(c, -16, 16, 8.5, 11, 0.12));
  hardFill(p, S + 6002, EG_PAL.pavement, groundQuad(c, -16, 16, -0.25, 2.5, 0.0));
  hardFill(p, S + 6003, EG_PAL.kerb, [proj(c, [-16, 0, 2.5]), proj(c, [16, 0, 2.5]), proj(c, [16, -0.12, 2.5]), proj(c, [-16, -0.12, 2.5])]);
  for (let k = 1; k < 5; k++) inkLine(p, S + 6020 + k, [proj(c, [-16, 0, k * 0.5]), proj(c, [16, 0, k * 0.5])], {color: EG_PAL.pavementLine, weight: 0.6, closed: false, curve: 0, still: true});
  for (let x = -16; x <= 16; x += 0.6) inkLine(p, S + 6040 + Math.round(x * 10), [proj(c, [x, 0, 0]), proj(c, [x, 0, Math.min(2.5, c.z - 0.4)])], {color: EG_PAL.pavementLine, weight: 0.5, closed: false, curve: 0, still: true});
  inkLine(p, S + 6030, [proj(c, [-16, 0, 2.5]), proj(c, [16, 0, 2.5])], {color: '#8a8478', weight: 1.0, closed: false, curve: 0, still: true});
  // Daylight on the pavement: a pale glaze where the sun lands (camera-left is brighter).
  washAt(p, S + 6050, '#f4efe2', 70, groundQuad(c, -16, 2, 0, 2.5, 0), 0.3, 0.4);

  // Set cast shadows (VD13): post, door frame jamb, scooters, bollard. Long, soft, right and away. Nothing for the figure.
  castShadow(p, c, S + 7000, POST, 0.075, 6.0, 130);
  castShadow(p, c, S + 7010, [DOOR.x0 - 0.035, 0, 0.06], 0.035, 2.6, 70);
  const bikes = [[1.7, 1.35], [2.45, 1.4], [3.2, 1.3], [-3.3, 1.35]] as const;
  bikes.forEach(([x, z], i) => castShadow(p, c, S + 7020 + i * 3, [x, 0, z], 0.24, 1.15, 110));
  castShadow(p, c, S + 7040, BOLLARD, 0.07, BOLLARD_H, 120);

  // Standing props, far to near: bollard, scooters, the lamp post.
  // Steel bollard (VD13 object 1.0 m from you): lit left side, a cap, grounded by a contact mark.
  const bo = (u: number, y: number): Pt => proj(c, [BOLLARD[0] + u, y, BOLLARD[2]]);
  flatA(p, S + 7100, '#3f4a55', 150, [bo(-0.09, -0.01), bo(0.09, -0.01), bo(0.09, 0.03), bo(-0.09, 0.03)]);
  hardFill(p, S + 7101, '#7d878c', [bo(-0.06, 0), bo(0.06, 0), bo(0.06, BOLLARD_H), bo(-0.06, BOLLARD_H)]);
  hardFill(p, S + 7102, '#c3cacd', [bo(-0.06, 0), bo(-0.02, 0), bo(-0.02, BOLLARD_H), bo(-0.06, BOLLARD_H)]);
  hardFill(p, S + 7103, '#5d676c', [bo(-0.065, BOLLARD_H), bo(0.065, BOLLARD_H), bo(0.05, BOLLARD_H + 0.04), bo(-0.05, BOLLARD_H + 0.04)]);
  inkLine(p, S + 7104, [bo(-0.06, 0), bo(-0.06, BOLLARD_H), bo(0.06, BOLLARD_H), bo(0.06, 0)], {color: EG_PAL.postInk, weight: 0.9, curve: 0, closed: false});
  // Contact darkening under the scooters' tyres and the post foot (props are grounded; the figure is not, VD13).
  for (const [x, z] of bikes) flatA(p, S + 7500 + x * 10, '#3f4a55', 150, [proj(c, [x - 0.09, 0, z - 0.04]), proj(c, [x + 0.09, 0, z - 0.04]), proj(c, [x + 0.09, 0, z + 0.04]), proj(c, [x - 0.09, 0, z + 0.04])]);
  [...bikes].sort((a, b) => a[1] - b[1]).forEach(([x, z], i) => scooter(p, c, S + 7200 + i * 12, x, z));
  const pw = 0.075;
  hardFill(p, S + 7300, EG_PAL.post, [proj(c, [POST[0] - pw, 0, POST[2]]), proj(c, [POST[0] + pw, 0, POST[2]]), proj(c, [POST[0] + pw * 0.7, 6.4, POST[2]]), proj(c, [POST[0] - pw * 0.7, 6.4, POST[2]])]);
  // Sunlit side of the post (camera-left), base collar.
  hardFill(p, S + 7301, '#a6b0b5', [proj(c, [POST[0] - pw, 0, POST[2]]), proj(c, [POST[0] - pw * 0.3, 0, POST[2]]), proj(c, [POST[0] - pw * 0.2, 6.4, POST[2]]), proj(c, [POST[0] - pw * 0.7, 6.4, POST[2]])]);
  hardFill(p, S + 7302, EG_PAL.postInk, frontRect(c, POST[2], POST[0] - pw * 1.3, POST[0] + pw * 1.3, 0, 0.35));
  inkLine(p, S + 7303, [proj(c, [POST[0] - pw, 0, POST[2]]), proj(c, [POST[0] - pw * 0.7, 6.4, POST[2]]), proj(c, [POST[0] + pw * 0.7, 6.4, POST[2]]), proj(c, [POST[0] + pw, 0, POST[2]])], {color: EG_PAL.postInk, weight: 1.0, curve: 0, closed: false});
  wires(p, c, S + 7400);
};
