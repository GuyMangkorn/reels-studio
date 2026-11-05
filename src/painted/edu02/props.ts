import {blob, ell, hardFill, inkLine, washAt} from '../kit/draw';
import {paintHalo} from '../kit/fog';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {flatCircle, hull, paintBox, qx, qy, qz, sphereAt, wFill, wInk, wp, wWash, type Item} from './world';

// EDU-EP02-SHORT B05 props (Boss W5.2 group G-D; scene sheet s01-b05.md SS-R2, brief EDU-BRIEF-R1.5): N8 bread slice and candle
// with match and matchbox, N4 frost on the chilled onion, N2 the fridge interior seen from inside (B05-SH04). World metres in the
// SET-KITCHEN frame (kitchen.ts); every painter is a pure function of its inputs (shot-local frame, seconds), so frames seek.

const dk = (c: string, u: number) => mixColor(c, '#3a2418', u);

// ------------------------------------------------------------------ N8 bread slice held in the mouth (B05-SH02)

/**
 * Bread slice side (m). SS-R2 gives 0.11 m (a real slice); Boss W5.2 feasibility change (for Film): 0.17 m, scaled to the stylised
 * 4-head rig (head 0.425 m, about twice a real head) as the R1.5 onion was, so the slice reads at about half her face width.
 */
export const BREAD_M = 0.17;
/**
 * A slice of white bread held in the teeth by its top edge (`BREAD_M` square): it hangs in front of the mouth and chin, facing the
 * lens. `mouth` is the rig's mouth centre (px), `u` px per metre at the cook, `ang` a small tilt (rad), `skin` the cook's lit skin
 * for the upper lip that closes over the crust. Crust, crumb with pores, a toasted top dome, then the lip and two cheek creases.
 */
export const paintBreadInMouth = (p: Painter, seed: number, mouth: Pt, u: number, ang: number, skin: string) => {
  const S = BREAD_M * u, ca = Math.cos(ang), sa = Math.sin(ang);
  // Local frame: x right, y down from the bitten edge (the slice's dome is in the mouth, its square foot hangs below the chin).
  const P = (x: number, y: number): Pt => [mouth[0] + (x * ca - y * sa) * S, mouth[1] - 0.02 * S + (x * sa + y * ca) * S];
  const outline: Pt[] = [];
  for (let k = 0; k <= 12; k++) { const a = Math.PI + (k / 12) * Math.PI; outline.push(P(-0.27 + 0.25 * Math.cos(a), 0.14 + 0.16 * Math.sin(a))); }
  for (let k = 0; k <= 12; k++) { const a = Math.PI + (k / 12) * Math.PI; outline.push(P(0.27 + 0.25 * Math.cos(a), 0.14 + 0.16 * Math.sin(a))); }
  outline.push(P(0.5, 0.92), P(0.46, 1.0), P(-0.46, 1.0), P(-0.5, 0.92));
  const crumb = outline.map(([x, y]): Pt => {
    const cx = mouth[0], cy = mouth[1] + 0.5 * S;
    return [cx + (x - cx) * 0.86, cy + (y - cy) * 0.88];
  });
  washAt(p, seed, '#3a2014', 110, outline.map(([x, y]): Pt => [x + 0.04 * S, y + 0.05 * S]), 0.1, 0.2); // shadow on the chin and neck
  hardFill(p, seed + 1, '#c98a4a', outline);
  hardFill(p, seed + 2, '#f6e6c0', crumb);
  washAt(p, seed + 3, '#d9b77e', 90, crumb.slice(crumb.length - 6), 0.2, 0.5); // the foot of the crumb a little darker (lit from above)
  for (let k = 0; k < 16; k++) {
    const x = (hash(seed + k * 2.1) - 0.5) * 0.7, y = 0.25 + 0.65 * hash(seed + k * 3.7), r = (0.012 + 0.014 * hash(seed + k)) * S;
    const q = P(x, y);
    hardFill(p, seed + 10 + k, '#d8bd8a', ell(q[0], q[1], r * 1.4, r, 8, hash(k) * 3));
  }
  inkLine(p, seed + 30, crumb, {weight: Math.max(0.8, S * 0.012), color: '#d0a25e'});
  inkLine(p, seed + 31, outline, {weight: Math.max(1, S * 0.02), color: '#7a4a24'});
  // Upper lip over the crust (she bites it) and the mouth corners pulled wide on either side.
  const lip: Pt[] = [P(-0.3, -0.02), P(-0.12, -0.06), P(0.12, -0.06), P(0.3, -0.02), P(0.24, 0.05), P(-0.24, 0.05)];
  hardFill(p, seed + 32, skin, lip);
  inkLine(p, seed + 33, [P(-0.32, 0.04), P(-0.1, 0.06), P(0.1, 0.06), P(0.32, 0.04)], {closed: false, weight: Math.max(1, S * 0.022), color: '#6a3020', curve: 0.5});
  for (const sd of [-1, 1]) inkLine(p, seed + 35 + sd, [P(sd * 0.36, -0.02), P(sd * 0.42, 0.06)], {closed: false, weight: Math.max(0.8, S * 0.016), color: '#6a3020', curve: 0.4});
};

// ------------------------------------------------------------------ N8 swim goggles (B06-SH02, SH03)

/** Goggles colours (brief R1.5 N8: cyan `#2fa6d9` frame and strap, pale blue lenses with a low sheen). */
export const GOGGLES = {frame: '#2fa6d9', dark: '#1d6f99', light: '#9adcf5', glass: '#cfeaf7', glassLow: '#5aa0c8'};
/**
 * Swim goggles on the 4-head rig's face (W5.2 G-E, N8), painted after the figure in its front head frame: `P(x, y)` maps head units
 * (x right, y down; the kit eyes sit at (+-0.4, 0.05)) to px, `Kpx` px per head unit. Two oval lenses each in a cyan ring (outer
 * side a little fuller), a bridge, and the strap: pulled up and back over the curls while she stretches it (`held` 1), else round
 * the head to the curl cloud's edge `edge` (head units) at the temples, where two hair-coloured curls bulge either side of it (the squash;
 * `bounce` moves them). The glass is a pale blue veil at 0.2 with a thin low sheen streak in the upper-left (window side) only, so
 * the eyes behind read (DF-20261030-painted-glass-sheen-veil: a pane wash lifts the darks behind it). `lift` raises the goggles
 * by head units (being pulled down over the face); `squash` flattens the lenses on the snap.
 */
export const paintGoggles = (
  p: Painter, seed: number, P: (x: number, y: number) => Pt, Kpx: number,
  o: {lift: number; held?: number; squash?: number; bounce?: number; edge: number; hair: string},
) => {
  const y0 = 0.05 + o.lift, sq = 1 - 0.14 * Math.max(0, Math.min(1, o.squash ?? 0)), held = Math.max(0, Math.min(1, o.held ?? 0)), N = 20;
  const lens = (side: number, rx: number, ry: number): Pt[] => Array.from({length: N}, (_, k) => {
    const th = (k / N) * Math.PI * 2, c = Math.cos(th);
    return P(side * 0.4 + side * rx * c * (1 + 0.12 * c), y0 + ry * sq * Math.sin(th) * (1 + 0.1 * c));
  });
  const ln = (q: Pt[], w: number, color: string, id: number, closed = false) => inkLine(p, id, q, {closed, weight: Math.max(0.8, w * Kpx), color, curve: 0.5});
  // Strap first (the frames sit over its ends).
  for (const side of [-1, 1]) {
    const i = side < 0 ? 0 : 1, a = P(side * 0.7, y0 - 0.01), tEdge = P(side * o.edge, y0 - 0.08 + (o.bounce ?? 0));
    // Held: pulled up and back over the curls toward her hands (behind the head, P23): the end rises along the cloud's edge.
    const hEnd = P(side * (o.edge + 0.04), y0 - 0.08 - 0.42), end: Pt = held > 0 ? [tEdge[0] + (hEnd[0] - tEdge[0]) * held, tEdge[1] + (hEnd[1] - tEdge[1]) * held] : tEdge;
    const d = Math.hypot(end[0] - a[0], end[1] - a[1]) || 1, n: Pt = [-(end[1] - a[1]) / d, (end[0] - a[0]) / d], w0 = 0.075 * Kpx, w1 = (0.08 - 0.02 * held) * Kpx;
    const band: Pt[] = [[a[0] + n[0] * w0, a[1] + n[1] * w0], [end[0] + n[0] * w1, end[1] + n[1] * w1], [end[0] - n[0] * w1, end[1] - n[1] * w1], [a[0] - n[0] * w0, a[1] - n[1] * w0]];
    washAt(p, seed + 2 + i, '#3a2014', 70, band.map(([x, y]): Pt => [x + 0.02 * Kpx, y + 0.04 * Kpx]), 0.1, 0.2);
    hardFill(p, seed + 4 + i, GOGGLES.frame, band);
    ln([band[3], band[2]], 0.02, GOGGLES.dark, seed + 6 + i);
    ln([band[0], band[1]], 0.012, GOGGLES.light, seed + 8 + i);
    // The curls bulging over and under the strap at the temple (round the head only).
    if (held < 0.5) for (const up of [-1, 1]) {
      const q = P(side * (o.edge - 0.05), y0 - 0.08 + up * 0.13 + (o.bounce ?? 0) * (up < 0 ? 1.4 : 0.6)), r = 0.085 * Kpx;
      hardFill(p, seed + 10 + i * 2 + (up + 1) / 2, o.hair, ell(q[0], q[1], r, r * 0.85, 12));
      ln(ell(q[0], q[1], r, r * 0.85, 12).slice(up < 0 ? 0 : 6, up < 0 ? 7 : 13), 0.018, mixColor(o.hair, '#000000', 0.45), seed + 14 + i * 2 + (up + 1) / 2);
    }
  }
  // Soft shadow of the frames on the skin, the bridge, then each lens: ring (lit upper-left, darker lower-right), glass, sheen.
  for (const side of [-1, 1]) washAt(p, seed + 20 + (side + 1) / 2, '#3a2014', 60, lens(side, 0.35, 0.29).map(([x, y]): Pt => [x + 0.025 * Kpx, y + 0.04 * Kpx]), 0.1, 0.2);
  hardFill(p, seed + 22, GOGGLES.frame, [P(-0.17, y0 - 0.04), P(0.17, y0 - 0.04), P(0.15, y0 + 0.03), P(-0.15, y0 + 0.03)]);
  ln([P(-0.15, y0 + 0.03), P(0.15, y0 + 0.03)], 0.014, GOGGLES.dark, seed + 23);
  for (const side of [-1, 1]) {
    const s = seed + 30 + (side + 1) * 20, out = lens(side, 0.34, 0.28), inn = lens(side, 0.24, 0.19);
    for (let k = 0; k < N; k++) {
      const k1 = (k + 1) % N, quad = [out[k], out[k1], inn[k1], inn[k]], th = ((k + 0.5) / N) * Math.PI * 2;
      // Light from the window (upper left): the ring's upper-left arc lighter, lower-right darker.
      const lit = -Math.cos(th) * 0.6 - Math.sin(th) * 0.8;
      hardFill(p, s + k, lit > 0.35 ? mixColor(GOGGLES.frame, GOGGLES.light, 0.35) : lit < -0.35 ? mixColor(GOGGLES.frame, GOGGLES.dark, 0.45) : GOGGLES.frame, quad);
    }
    hardFill(p.layer(0.24, s + 25), s + 25, GOGGLES.glass, inn);
    hardFill(p.layer(0.12, s + 26), s + 26, GOGGLES.glassLow, inn.slice(1, N / 2));
    const sheen = [P(side * 0.4 - 0.17, y0 - 0.02), P(side * 0.4 - 0.06, y0 - 0.15), P(side * 0.4 - 0.02, y0 - 0.13), P(side * 0.4 - 0.13, y0 + 0.01)];
    hardFill(p.layer(0.3, s + 27), s + 27, '#ffffff', sheen);
    ln(out, 0.016, GOGGLES.dark, s + 28, true);
    ln(inn, 0.012, GOGGLES.dark, s + 29, true);
  }
};

// ------------------------------------------------------------------ N8 candle, saucer, matchbox, match (B05-SH03)

/**
 * SS-R2 (candle moved off the enlarged board): candle Ø 0.05 on a saucer Ø 0.10 at (-0.02, 0.92, 0.04), matchbox at (0.06, 0.92, 0.10).
 * SS-R3 (Film, viewer check Draft r1 "candle a speck"): pillar Ø 0.08 x 0.16 (top 1.075, wick 1.09) on a saucer Ø 0.13 at
 * (0.00, 0.90, 0.12), matchbox (0.10, 0.90, 0.18).
 */
export const CANDLE = {at: [0.0, 0.9, 0.12] as V3, r: 0.04, y0: 0.915, y1: 1.075, wick: 1.09, saucerR: 0.065, box: [0.1, 0.9, 0.18] as V3};
/** `lit` 0..1 candle flame; `match`: the struck stick from its fingers end to its head (world), `flame` 0..2 (flare > 1); `burnt`: the spent match lies in the saucer. */
export type CandleState = {lit: number; t: number; match?: {from: V3; to: V3; flame: number}; burnt?: boolean};

/** A flame standing on `b` (px), `h` px tall, as a teardrop with a blue foot, a gold body and a white core; `lean` px at the tip. */
export const paintFlame = (p: Painter, seed: number, b: Pt, h: number, lean: number) => {
  if (h < 2) return;
  const shape = (k: number, dy: number): Pt[] => {
    const L: Pt[] = [], R: Pt[] = [];
    for (let i = 0; i <= 10; i++) {
      const s = i / 10, r = 0.36 * h * k * Math.sin(Math.PI * Math.pow(s, 0.55)), y = b[1] + dy - s * h * k, x = b[0] + lean * s * s * k;
      L.push([x - r, y]);
      R.push([x + r, y]);
    }
    return [...L, ...R.reverse()];
  };
  hardFill(p.layer(0.45, seed), seed, '#ffb04a', shape(1.35, 0.1 * h));
  hardFill(p.layer(0.95, seed + 1), seed + 1, '#ffd060', shape(1, 0));
  hardFill(p.layer(0.95, seed + 2), seed + 2, '#fff7da', shape(0.55, -0.02 * h));
  hardFill(p.layer(0.55, seed + 3), seed + 3, '#7a8cff', ell(b[0], b[1] - 0.08 * h, 0.12 * h, 0.08 * h, 10));
};

/** The candle on its saucer and the matchbox as depth-sorted items; the flame (and halo) is painted with the candle. */
export const candleItems = (o: CandleState): Item[] => {
  const C = CANDLE, [cx, , cz] = C.at;
  return [
    {
      at: C.box, bias: -0.04,
      draw: (p, c) => {
        const [x, , z] = C.box;
        const sh = wp(c, qy(0.9005, x - 0.022, x + 0.032, z - 0.014, z + 0.024));
        if (sh.length >= 3) washAt(p, 46000, '#3a2014', 100, sh, 0.1, 0.2);
        paintBox(p, c, 46001, {x0: x - 0.025, x1: x + 0.025, y0: 0.9, y1: 0.915, z0: z - 0.018, z1: z + 0.018}, '#d2463a', {front: 0.2, left: 0.25, top: -0.05}, {ink: true});
        wFill(p, c, 46010, '#f2c64a', qy(0.9152, x - 0.016, x + 0.016, z - 0.01, z + 0.01)); // label
        wFill(p, c, 46011, '#7a3a24', qz(z + 0.0182, x - 0.024, x + 0.024, 0.903, 0.912)); // striker strip
      },
    },
    {
      at: C.at, bias: -0.04,
      draw: (p, c) => {
        // Saucer: shadow, rim thickness, top and a ring line.
        const sh = flatCircle(c, [cx + 0.006, 0.9005, cz + 0.006], C.saucerR, 22);
        if (sh.length >= 3) washAt(p, 46100, '#3a2014', 110, sh, 0.12, 0.2);
        const rim = hull([...flatCircle(c, [cx, 0.9, cz], C.saucerR * 0.9, 22), ...flatCircle(c, [cx, 0.912, cz], C.saucerR, 22)]);
        if (rim.length >= 3) hardFill(p, 46101, '#d8d2c4', rim);
        const top = flatCircle(c, [cx, 0.912, cz], C.saucerR, 22);
        if (top.length >= 3) { hardFill(p, 46102, '#f4efe4', top); inkLine(p, 46103, top, {weight: 0.8, color: '#9a9080'}); }
        const well = flatCircle(c, [cx, 0.9125, cz], C.saucerR * 0.6, 18);
        if (well.length >= 3) inkLine(p, 46104, well, {weight: 0.6, color: '#c8c0b0'});
        if (o.burnt) {
          // The spent match lying in the saucer: pale stick, charred head.
          const a = camPoint(c, [cx + 0.03, 0.914, cz + 0.022]), b = camPoint(c, [cx - 0.005, 0.914, cz + 0.036]);
          if (a && b) {
            inkLine(p, 46105, [a, b], {closed: false, weight: Math.max(1.5, 0.004 * camUnit(c, C.at)), color: '#d9bd86'});
            hardFill(p, 46106, '#2a2018', ell(b[0], b[1], 0.004 * camUnit(c, C.at), 0.003 * camUnit(c, C.at), 8));
          }
        }
        // Candle: a cylinder (hull of its end circles), shade on the far side from the window, a melted top and a wick.
        const body = hull([...flatCircle(c, [cx, C.y0, cz], C.r, 20), ...flatCircle(c, [cx, C.y1, cz], C.r, 20)]);
        if (body.length < 3) return;
        hardFill(p, 46110, '#f4ecd6', body);
        const u = camUnit(c, [cx, C.y1, cz]), q0 = camPoint(c, [cx, C.y0, cz]), q1 = camPoint(c, [cx, C.y1, cz]);
        if (!q0 || !q1) return;
        const R = C.r * u;
        washAt(p, 46111, '#c9b48a', 130, [[q1[0] + R * 0.2, q1[1]], [q1[0] + R, q1[1]], [q0[0] + R, q0[1]], [q0[0] + R * 0.2, q0[1]]], 0.15, 0.3);
        const lit = Math.max(0, Math.min(1, o.lit));
        if (lit > 0) washAt(p.layer(0.5 * lit, 46112), 46112, '#ffd890', 120, [[q1[0] - R, q1[1]], [q1[0] + R * 0.4, q1[1]], [q1[0] + R * 0.4, q1[1] + R * 1.6], [q1[0] - R, q1[1] + R * 1.2]], 0.2, 0.2);
        const cap = flatCircle(c, [cx, C.y1, cz], C.r, 20);
        if (cap.length >= 3) { hardFill(p, 46113, '#fbf5e4', cap); inkLine(p, 46114, cap, {weight: 0.7, color: '#b8a888'}); }
        // One wax drip down the lit side.
        inkLine(p, 46115, [[q1[0] - R * 0.55, q1[1] + R * 0.1], [q1[0] - R * 0.6, q1[1] + R * 0.9], [q1[0] - R * 0.55, q1[1] + R * 1.2]], {closed: false, weight: Math.max(1.2, R * 0.12), color: '#fbf5e4', curve: 0.4});
        inkLine(p, 46116, body, {weight: 0.9, color: '#8a7a60'});
        const w0 = camPoint(c, [cx, C.y1, cz]), w1 = camPoint(c, [cx + 0.002, C.wick, cz]);
        if (w0 && w1) inkLine(p, 46117, [w0, w1], {closed: false, weight: Math.max(1.2, 0.003 * u), color: '#2a1e18'});
        if (lit > 0 && w1) {
          const t = o.t, h = 0.042 * u * lit * (1 + 0.08 * Math.sin(t * 23) + 0.05 * Math.sin(t * 37 + 1));
          // ENV-GLOW halo at most 0.3 (sheet).
          paintHalo(p, {x: w1[0], y: w1[1] - h * 0.5, r: 0.2 * u, color: '#ffd28a', level: 0.3 * lit, squash: 1, t, seed: 46120});
          paintFlame(p, 46130, w1, h, 0.12 * h * Math.sin(t * 11));
        }
      },
    },
  ];
};

/** The struck match in her fingers (painted after the cook): a pale stick, a red (or charred) head and its flame, `flame` > 1 the strike flare. */
export const paintMatch = (p: Painter, c: YCam, m: {from: V3; to: V3; flame: number}, t: number) => {
  const a = camPoint(c, m.from), b = camPoint(c, m.to);
  if (!a || !b) return;
  const u = camUnit(c, m.to);
  inkLine(p, 46200, [a, b], {closed: false, weight: Math.max(1.5, 0.0045 * u), color: '#e2c48c'});
  hardFill(p, 46201, m.flame > 0.05 ? '#3a2018' : '#b23a2a', ell(b[0], b[1], 0.0045 * u, 0.0035 * u, 8, Math.atan2(b[1] - a[1], b[0] - a[0])));
  if (m.flame > 0.05) {
    const h = 0.03 * u * m.flame * (1 + 0.1 * Math.sin(t * 29));
    if (m.flame > 1) paintHalo(p, {x: b[0], y: b[1] - h * 0.4, r: 0.12 * u * m.flame, color: '#ffe0a0', level: Math.min(0.3, 0.2 * m.flame), squash: 1, t, seed: 46210});
    paintFlame(p, 46220, [b[0], b[1] + 0.002 * u], h, 0.1 * h * Math.sin(t * 13));
  }
};

// ------------------------------------------------------------------ N4 frost on the chilled onion (B05-SH04, SH05)

/**
 * Frost over a bulb of picture centre (x, y) and radius R px. W5.3 fix round 1 (viewer check r1: the W5.2 ice tint plus specks and
 * twinkling crosses read as a grey glass ornament): the onion keeps its own colour (no tint at the source) and the frost is white
 * rime: a lacy cap along the upper contour and sixteen thin flat crusts (stretched along the bulb's curve) thickest on the shoulders and round the neck, thinning down the
 * sides, each with a pale halo and a few crystals at its edge, plus fine specks. Static (rime does not twinkle).
 */
export const paintFrost = (p: Painter, seed: number, x: number, y: number, R: number, frost: number) => {
  if (frost <= 0 || R < 3) return;
  const RIME = '#f7fbfd', HALO = '#e4eef3';
  // A rime cap along the upper contour (the shoulders): a band just inside the outline, its lower edge lacy.
  const cap: Pt[] = [];
  for (let k = 0; k <= 20; k++) { const a = Math.PI * (1.08 + 0.84 * (k / 20)); cap.push([x + 0.97 * R * Math.cos(a), y + 0.9 * R * Math.sin(a)]); }
  for (let k = 20; k >= 0; k--) {
    const a = Math.PI * (1.08 + 0.84 * (k / 20)), d = 0.97 - (0.12 + 0.14 * hash(seed + 200 + k)) * Math.sin((Math.PI * k) / 20) - 0.04;
    cap.push([x + d * R * Math.cos(a), y + d * 0.9 * R * Math.sin(a)]);
  }
  washAt(p, seed + 98, HALO, 110 * frost, cap, 0.35, 0.3);
  hardFill(p.layer(0.8 * frost, seed + 99), seed + 99, RIME, cap);
  for (let k = 0; k < 16; k++) {
    // Angles over the upper half (shoulders and neck) for 12 patches, four lower down the sides; thin flat crusts, not clumps.
    const up = k < 12, a = up ? Math.PI * (1.06 + 0.88 * ((k + 0.6 * hash(seed + k)) / 12)) : Math.PI * (0.12 + 0.25 * (k - 12) + 0.08 * hash(seed + k));
    const rr = (up ? 0.55 + 0.38 * hash(seed + k * 2.3) : 0.7 + 0.2 * hash(seed + k * 2.3)) * R;
    const cx = x + rr * Math.cos(a), cy = y + rr * Math.sin(a) * 0.92, s = (up ? 0.13 + 0.09 * hash(seed + k * 4.1) : 0.07 + 0.05 * hash(seed + k * 4.1)) * R;
    const tang = a + Math.PI / 2, flat = (q: Pt[]): Pt[] => q.map(([qx0, qy0]): Pt => {
      const dx = qx0 - cx, dy = qy0 - cy, al = Math.cos(tang) * dx + Math.sin(tang) * dy, ac = -Math.sin(tang) * dx + Math.cos(tang) * dy;
      return [cx + Math.cos(tang) * al * 1.5 - Math.sin(tang) * ac * 0.55, cy + Math.sin(tang) * al * 1.5 + Math.cos(tang) * ac * 0.55];
    });
    washAt(p, seed + 100 + k, HALO, 90 * frost, flat(blob(seed + 100 + k, cx, cy, s * 1.5, s * 1.3, 0)), 0.45, 0.3);
    hardFill(p.layer(0.85 * frost, seed + 120 + k), seed + 120 + k, RIME, flat(blob(seed + 120 + k, cx, cy, s, s, 0)));
    for (let j = 0; j < 3; j++) {
      const b = hash(seed + k * 7 + j) * Math.PI * 2, cr = s * (0.14 + 0.1 * hash(seed + k * 9 + j));
      hardFill(p.layer(0.85 * frost, seed + 140 + k * 3 + j), seed + 140 + k * 3 + j, RIME, ell(cx + s * 1.5 * Math.cos(b), cy + s * 0.9 * Math.sin(b), cr, cr, 6));
    }
  }
  // Fine specks over the whole bulb.
  for (let k = 0; k < 24; k++) {
    const a = hash(seed + k * 1.3) * Math.PI * 2, rr = Math.sqrt(hash(seed + k * 2.9)) * R * 0.95, sz = (0.012 + 0.016 * hash(seed + k * 4.1)) * R;
    hardFill(p.layer(0.85 * frost, seed + 10 + k), seed + 10 + k, '#ffffff', ell(x + rr * Math.cos(a), y + rr * Math.sin(a) * 0.9, sz, sz, 6));
  }
};

// ------------------------------------------------------------------ N2 fridge interior, seen from inside (B05-SH04)

type FridgeBox = {x0: number; x1: number; y0: number; y1: number; z0: number; z1: number};
/** Shelf tops inside the fridge (m): the lower glass shelf carries O3 at its front edge (SS-R2 (1.88, 1.02, -1.00)). */
export const FRIDGE_SHELVES = {low: 0.955, high: 1.52, front: -0.975, liner: 0.035};
const LINER = '#e8eef0', COLD = '#cfe3f2';

/**
 * The fridge seen from inside (DF-20261030-zcpaint-persp-floor-clip-behind-camera: every inner surface exists round the lens, clipped
 * at the near plane): the glass shelves above and below the lens with their white front lips, a milk carton, a jam jar, an egg tray
 * and a cheese box on the lower shelf, the frosted crisper front under it (her legs show through it as a haze), and the door
 * swinging open on its hinge at x1 (`door` 0..1 = 0..125 deg). Darkness before the light comes on is `paintFridgeDark`. Returns the items; the door's own item sorts in front of the cook while it covers her
 * (< 50 deg) and behind her after (it swings out past her shoulder line).
 */
export const fridgePovItems = (F: FridgeBox, door: number, light: number, t: number): Item[] => {
  const S = FRIDGE_SHELVES, xi0 = F.x0 + S.liner, xi1 = F.x1 - S.liner, zb = F.z0 + S.liner;
  const shelf = (y: number, seed: number): Item => ({
    at: [(xi0 + xi1) / 2, 0, S.front - 0.05], bias: -0.6,
    draw: (q, c) => {
      const p = q;
      const top = wp(c, qy(y, xi0, xi1, zb, S.front));
      if (top.length >= 3) hardFill(p.layer(0.32, seed), seed, COLD, top);
      // Glass streaks and the front lip (white plastic, 0.02 m deep).
      for (let k = 0; k < 3; k++) {
        const x = xi0 + 0.12 + 0.18 * k, s = wp(c, [[x, y + 0.0005, S.front - 0.02], [x + 0.03, y + 0.0005, S.front - 0.02], [x - 0.1, y + 0.0005, zb + 0.3], [x - 0.13, y + 0.0005, zb + 0.3]]);
        if (s.length >= 3) hardFill(p.layer(0.25, seed + 1 + k), seed + 1 + k, '#ffffff', s);
      }
      const lip = wp(c, qz(S.front, xi0, xi1, y - 0.022, y + 0.002));
      if (lip.length >= 3) { hardFill(p, seed + 5, '#f4f8f9', lip); inkLine(p, seed + 6, lip, {weight: 0.9, color: '#8a9aa4'}); }
      const lipTop = wp(c, qy(y + 0.002, xi0, xi1, S.front - 0.012, S.front));
      if (lipTop.length >= 3) hardFill(p, seed + 7, '#ffffff', lipTop);
    },
  });
  const onShelf = (at: V3, seed: number, draw: (p: Painter, c: YCam) => void): Item => ({at, bias: -0.62, draw});
  const y = S.low;
  const items: Item[] = [
    // Inner side walls and back liner (mostly outside the frame at f 900; painted so nothing is missing at the edges).
    {at: [(xi0 + xi1) / 2, 0, zb], bias: 0.5, draw: (q, c) => {
      const p = q;
      wFill(p, c, 46300, mixColor(LINER, COLD, 0.3), qx(xi0, F.y0 + 0.05, F.y1 - 0.05, zb, F.z1));
      wFill(p, c, 46301, mixColor(LINER, COLD, 0.3), qx(xi1, F.y0 + 0.05, F.y1 - 0.05, zb, F.z1));
      wFill(p, c, 46302, mixColor(LINER, COLD, 0.15), qy(F.y1 - 0.05, xi0, xi1, zb, F.z1));
    }},
    shelf(S.high, 46310),
    shelf(y, 46320),
    {at: [(xi0 + xi1) / 2, 0, S.front - 0.04], bias: -0.58, draw: (p, c) => {
      // Crisper drawer under the lower shelf: its front panel (frosted plastic, seen from inside) from the floor of the liner to the
      // shelf, a lid line and a pull groove; a lettuce and two carrots inside it near the lens.
      const panel = wp(c, qz(S.front + 0.002, xi0, xi1, F.y0 + 0.06, y - 0.025));
      if (panel.length >= 3) { hardFill(p.layer(0.72, 46330), 46330, '#e6eff3', panel); washAt(p, 46331, '#b8cad4', 70, panel, 0.1, 0.5); }
      const rim = wp(c, qz(S.front + 0.001, xi0, xi1, y - 0.045, y - 0.025));
      if (rim.length >= 3) hardFill(p, 46332, '#f6fafb', rim);
      const groove = wp(c, qz(S.front + 0.0005, xi0 + 0.2, xi1 - 0.2, y - 0.1, y - 0.085));
      if (groove.length >= 3) hardFill(p.layer(0.6, 46333), 46333, '#9aaab4', groove);
      const lt = sphereAt(c, [1.98, y - 0.12, -1.06], 0.07);
      if (lt) for (let k = 0; k < 4; k++) hardFill(p, 46334 + k, ['#8ab35a', '#a6c86a', '#7aa04a', '#b8d47a'][k], ell(lt.x + (k - 1.5) * lt.r * 0.35, lt.y - (k % 2) * lt.r * 0.2, lt.r * (0.8 - 0.1 * k), lt.r * 0.7, 14, k));
      ([[1.62, -1.08, 0.5], [1.66, -1.1, 0.3]] as const).forEach(([x, z, a], k) => {
        const b0 = camPoint(c, [x, y - 0.1, z]), b1 = camPoint(c, [x + 0.12 * Math.cos(a), y - 0.06, z - 0.12 * Math.sin(a)]);
        if (b0 && b1) inkLine(p, 46340 + k, [b0, b1], {closed: false, weight: Math.max(3, 0.022 * camUnit(c, [x, y, z])), color: '#e8823a'});
      });
    }},
    onShelf([1.57, y, -1.03], 46340, (p, c) => {
      // Milk carton 0.07 x 0.20 x 0.07 with a gable top and a blue band.
      const x = 1.57, z = -1.03, h = 0.2;
      paintBox(p, c, 46340, {x0: x - 0.035, x1: x + 0.035, y0: y, y1: y + h, z0: z - 0.035, z1: z + 0.035}, '#f6f4ee', {front: 0.05, left: 0.2, top: -0.05}, {ink: true});
      wFill(p, c, 46345, '#4a7ac8', qz(z + 0.036, x - 0.035, x + 0.035, y + 0.08, y + 0.13));
      wFill(p, c, 46346, '#4a7ac8', qx(x - 0.036, y + 0.08, y + 0.13, z - 0.035, z + 0.035));
      const g = wp(c, [[x - 0.035, y + h, z + 0.035], [x + 0.035, y + h, z + 0.035], [x + 0.035, y + h + 0.04, z], [x - 0.035, y + h + 0.04, z]]);
      if (g.length >= 3) { hardFill(p, 46347, '#e4e2dc', g); inkLine(p, 46348, g, {weight: 0.8, color: '#7a7a74'}); }
    }),
    onShelf([2.03, y, -1.02], 46350, (p, c) => {
      // Jam jar Ø 0.08 x 0.10: red body, glass highlight, gold lid.
      const x = 2.03, z = -1.02;
      const body = hull([...flatCircle(c, [x, y, z], 0.04, 18), ...flatCircle(c, [x, y + 0.085, z], 0.04, 18)]);
      if (body.length >= 3) { hardFill(p, 46350, '#b8324a', body); inkLine(p, 46351, body, {weight: 0.9, color: '#5a1a24'}); }
      const lid = hull([...flatCircle(c, [x, y + 0.085, z], 0.042, 18), ...flatCircle(c, [x, y + 0.105, z], 0.042, 18)]);
      if (lid.length >= 3) { hardFill(p, 46352, '#d9b24a', lid); inkLine(p, 46353, lid, {weight: 0.8, color: '#7a5a20'}); }
      const hi = camPoint(c, [x + 0.022, y + 0.05, z - 0.03]);
      if (hi) hardFill(p.layer(0.6, 46354), 46354, '#ffffff', ell(hi[0], hi[1], 0.006 * camUnit(c, [x, y, z]), 0.025 * camUnit(c, [x, y, z]), 8));
    }),
    onShelf([1.66, y, -1.22], 46360, (p, c) => {
      // Egg tray near the lens (bottom right): a pale pulp tray with three eggs.
      const x = 1.66, z = -1.22;
      paintBox(p, c, 46360, {x0: x - 0.06, x1: x + 0.06, y0: y, y1: y + 0.025, z0: z - 0.08, z1: z + 0.08}, '#d8cdb8', {front: 0.1, left: 0.15}, {ink: true});
      [[-0.03, -0.04], [0.03, -0.04], [0.0, 0.03]].forEach(([dx, dz], k) => {
        const e = sphereAt(c, [x + dx, y + 0.045, z + dz], 0.024);
        if (!e) return;
        hardFill(p, 46365 + k * 3, '#f2e4cc', ell(e.x, e.y, e.r * 0.85, e.r * 1.05, 16));
        washAt(p, 46366 + k * 3, '#c8b08a', 110, ell(e.x + e.r * 0.25, e.y + e.r * 0.2, e.r * 0.55, e.r * 0.8, 12), 0.2, 0.3);
        inkLine(p, 46367 + k * 3, ell(e.x, e.y, e.r * 0.85, e.r * 1.05, 16), {weight: 0.9, color: '#9a8a6a'});
      });
    }),
    onShelf([2.0, y, -1.25], 46380, (p, c) => {
      // Cheese box near the lens (bottom left).
      const x = 2.0, z = -1.25;
      paintBox(p, c, 46380, {x0: x - 0.06, x1: x + 0.06, y0: y, y1: y + 0.05, z0: z - 0.06, z1: z + 0.06}, '#f2c84a', {front: 0.1, left: 0.2, top: -0.05}, {ink: true});
      wFill(p, c, 46385, '#d2463a', qy(y + 0.0505, x - 0.04, x + 0.04, z - 0.02, z + 0.02));
    }),
  ];
  // The door: inner liner with two bins (a ketchup bottle and a water bottle), hinged at x1, swinging out toward +z.
  const th = (125 * Math.PI / 180) * Math.max(0, Math.min(1, door)), W = F.x1 - F.x0;
  const D = (s: number, yy: number, dz = 0): V3 => [F.x1 - s * W * Math.cos(th) + dz * Math.sin(th), yy, F.z1 - 0.02 + s * W * Math.sin(th) - dz * Math.cos(th)];
  items.push({
    at: th < (50 * Math.PI) / 180 ? [1.8, 0, F.z1 - 0.01] : [1.8, 0, -0.3], bias: th < (50 * Math.PI) / 180 ? -0.7 : 0,
    draw: (q, c) => {
      const p = q;
      const face = wp(c, [D(0, F.y0 + 0.02), D(1, F.y0 + 0.02), D(1, F.y1 - 0.02), D(0, F.y1 - 0.02)]);
      if (face.length < 3) return;
      hardFill(p, 46400, LINER, face);
      washAt(p, 46401, '#9aa8b0', 90, face, 0.1, 0.4);
      for (const [k, yy] of [[0, 0.55], [1, 1.12]] as const) {
        const bin = wp(c, [D(0.08, yy), D(0.92, yy), D(0.92, yy + 0.09, 0.08), D(0.08, yy + 0.09, 0.08)]);
        if (bin.length >= 3) { hardFill(p.layer(0.8, 46410 + k * 4), 46410 + k * 4, '#dbe9f0', bin); inkLine(p, 46411 + k * 4, bin, {weight: 1, color: '#8a9aa4'}); }
        const b0 = camPoint(c, D(0.3 + 0.35 * k, yy + 0.02, 0.04)), b1 = camPoint(c, D(0.3 + 0.35 * k, yy + 0.24, 0.04));
        if (b0 && b1) {
          const w = 0.03 * camUnit(c, D(0.3 + 0.35 * k, yy, 0.04));
          const bottle: Pt[] = [[b0[0] - w, b0[1]], [b0[0] + w, b0[1]], [b1[0] + w * 0.8, b1[1] + w], [b1[0] + w * 0.35, b1[1]], [b1[0] - w * 0.35, b1[1]], [b1[0] - w * 0.8, b1[1] + w]];
          hardFill(p, 46412 + k * 4, k ? '#bfe0ec' : '#c8323a', bottle);
          inkLine(p, 46413 + k * 4, bottle, {weight: 0.9, color: k ? '#5a8aa0' : '#5a1418'});
        }
      }
      inkLine(p, 46420, face, {weight: 1.2, color: '#6a7a84'});
      // The door's thickness on the free edge (the gasket strip), once it turns.
      if (th > 0.2) {
        const e = wp(c, [D(1, F.y0 + 0.02), D(1, F.y0 + 0.02, -0.06), D(1, F.y1 - 0.02, -0.06), D(1, F.y1 - 0.02)]);
        if (e.length >= 3) hardFill(p, 46421, '#b8bcbc', e);
      }
    },
  });
  void t;
  return items;
};

/** The front wall of the kitchen (+z side, behind the B05-SH04 fridge camera): cream plaster, a doorway to a darker hall, a calendar. */
export const paintFrontWall = (p: Painter, c: YCam, z: number, x0: number, x1: number, h: number, wall: string) => {
  wFill(p, c, 46500, wall, qz(z, x0, x1, 0, h));
  wWash(p, c, 46501, dk(wall, 0.12), 60, qz(z - 0.001, x0, x1, 0, h), 0.3, 0.6);
  wFill(p, c, 46502, '#8a6a52', qz(z - 0.002, -0.6, 0.3, 0, 2.05)); // doorway into the hall
  wFill(p, c, 46503, '#6e5240', qz(z - 0.003, -0.5, 0.2, 0, 1.95));
  wInk(p, c, 46504, qz(z - 0.004, -0.6, 0.3, 0, 2.05), {color: '#5a3a28', weight: 1});
  wFill(p, c, 46505, '#fbf6ea', qz(z - 0.002, 0.9, 1.25, 1.3, 1.75)); // calendar
  wFill(p, c, 46506, '#d2463a', qz(z - 0.003, 0.9, 1.25, 1.62, 1.75));
  wFill(p, c, 46507, dk(wall, 0.3), qz(z - 0.002, x0, x1, 0, 0.08)); // skirting
};

/** The closed fridge is dark: a blue-black veil over the whole picture, gone as the light comes on (`light` 0..1, B05-SH04 l 1-4). */
export const paintFridgeDark = (p: Painter, light: number) => {
  if (light < 1) hardFill(p.layer(0.82 * (1 - light), 46600), 46600, '#141c26', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
};

export {COLD as FRIDGE_COLD};
