import {hash} from './hash';
import {range, type Painter, type Pt} from './painter';

// Sea, storm and seabed sets. Lesson from the spike (scripts/oldest-shipwreck/p5-feasibility.md): bleed scales with
// polygon size, so large areas are horizontal bands with bleed 0.03-0.06 over a flat underlayer of the same hue.
// Background marks are washes or still ink (no boil): only leads, jars and the ship boil (brief VD intent).

export const waveY = (x: number, base: number, amp: number, t: number, k: number) =>
  base + amp * (Math.sin(x * 0.006 * k + t * 0.9) * 0.6 + Math.sin(x * 0.013 * k - t * 1.3 + 1.7) * 0.4);

const PAD = 160;

/** A full-width rectangle in world pixels, padded so a camera push or drift never exposes its edge. */
export const span = (W: number, y0: number, y1: number): Pt[] => [[-PAD, y0], [W + PAD, y0], [W + PAD, y1], [-PAD, y1]];

/** Flat underlayer plus overlapping watercolour bands from y0 to y1, one colour per band. */
export const bands = (p: Painter, W: number, under: string, colors: string[], y0: number, y1: number, o: {opacity?: number; bleed?: number; texture?: number} = {}) => {
  p.flat(under, span(W, y0, y1));
  const step = (y1 - y0) / colors.length;
  colors.forEach((c, i) => p.wash(c, o.opacity ?? 220, span(W, y0 + i * step - step * 0.3, y0 + (i + 1) * step + step * 0.3), o.bleed ?? 0.04, o.texture ?? 0.45));
};

// ---------------------------------------------------------------- seabed (present-day site)

export type SeabedLayout = {
  /** Haze line where the slope meets the water column, at the left and right edges (slope falls to the right). */
  hazeLeft: number; hazeRight: number;
  /** Top of the rock shelves that fill the lower frame (keep >= the jar sand lines, <= the caption band top 860). */
  shelfTop: number;
};
export const SITE_LAYOUT: SeabedLayout = {hazeLeft: 330, hazeRight: 480, shelfTop: 850};

export const SAND = {far: '#6f7f6c', mid: '#76826a', near: '#6c7862'};
const ROCK = {under: '#1c2828', body: ['#26372f', '#223230', '#2a3c36', '#1f2e2c', '#243530'], top: '#3e544b', crevice: '#121b1c'};

export const hazeAt = (L: SeabedLayout, W: number, x: number) => L.hazeLeft + ((L.hazeRight - L.hazeLeft) * (x + PAD)) / (W + 2 * PAD);

/** Water column from the surface to below the haze line: lighter blue-green above, deep teal toward the bed. */
export const paintWater = (p: Painter, W: number, bottom: number, colors = ['#78b8b0', '#5aa3a2', '#418b90', '#30747e', '#2a6670']) => {
  bands(p, W, '#3f8a90', colors, -PAD, bottom);
};

/**
 * Sloped sand bed between the haze line and the shelf top, then stepped dark rock shelves to the bottom of the frame
 * (VD05). The shelves keep the caption band (y 860-1248) dark: measured with scripts/caption-zone.py.
 */
export const paintSeabed = (p: Painter, W: number, H: number, L: SeabedLayout, t: number) => {
  const haze = (x: number) => hazeAt(L, W, x);
  // Sand slope: bands that follow the haze line, darkening toward the viewer.
  p.flat('#66745f', [[-PAD, haze(-PAD) - 20], [W + PAD, haze(W + PAD) - 20], [W + PAD, L.shelfTop + 60], [-PAD, L.shelfTop + 60]]);
  const sand = ['#6a7c6c', '#748470', '#7b876f', '#76826a', '#6e7a63', '#66725c'];
  sand.forEach((c, i) => {
    const u0 = i / sand.length, u1 = (i + 1.4) / sand.length;
    const yy = (x: number, u: number) => haze(x) + (L.shelfTop + 40 - haze(x)) * u;
    p.wash(c, 210, [[-PAD, yy(-PAD, u0)], [W + PAD, yy(W + PAD, u0)], [W + PAD, yy(W + PAD, u1)], [-PAD, yy(-PAD, u1)]], 0.03, 0.4);
  });
  // Haze where the slope meets the water.
  p.wash('#4f8582', 170, [[-PAD, haze(-PAD) - 40], [W + PAD, haze(W + PAD) - 40], [W + PAD, haze(W + PAD) + 30], [-PAD, haze(-PAD) + 30]], 0.05, 0.4);
  // Low boulders on the slope (upper left and right edges) that break the sand.
  boulder(p, 30, haze(30) + 120, 120, 70, 3, '#3c5551');
  boulder(p, W - 20, haze(W - 20) + 90, 110, 64, 5, '#3d5752');
  paintRockShelves(p, W, H, L.shelfTop, t);
};

/** A rounded rock with a lit top and a shaded base; `seed` varies the outline. */
export const boulder = (p: Painter, cx: number, cy: number, rx: number, ry: number, seed: number, color: string, top = '#4e655d') => {
  const r = (u: number) => 1 + 0.12 * Math.sin(u * 6.283 * 2 + seed) + 0.06 * Math.sin(u * 6.283 * 5 + seed * 3);
  const outline = range(20, (u) => [cx + rx * r(u) * Math.cos(u * 6.283), cy + ry * r(u) * Math.sin(u * 6.283) * (Math.sin(u * 6.283) > 0 ? 0.6 : 1)] as Pt);
  p.wash(color, 235, outline, 0.04, 0.55);
  p.wash(top, 170, range(10, (u) => [cx - rx * 0.8 + u * rx * 1.6, cy - ry * 0.95 * Math.sin(0.15 + u * 2.84) + (u === 0 || u === 1 ? 10 : 0)] as Pt).concat(range(10, (u) => [cx + rx * 0.8 - u * rx * 1.6, cy - ry * 0.55 * Math.sin(0.15 + (1 - u) * 2.84)] as Pt)), 0.05, 0.5);
};

/**
 * Stepped rock ledges from `top` to the bottom of the frame: staggered rounded ledges per row, each with a lit top
 * face and an under-lip shade; back rows first. Dark enough that the caption band (y 860-1248) measures mean <= 0.25.
 */
export const paintRockShelves = (p: Painter, W: number, H: number, top: number, t: number) => {
  const {brush} = p;
  p.flat(ROCK.under, span(W, top + 30, H + PAD));
  const rows = [0, 230, 500, 780, 1070].map((dy) => top + dy).filter((y) => y < H + 100);
  const tops: [number, number, number][] = [];
  rows.forEach((rowTop, k) => {
    const n = 3;
    for (let j = -1; j < n; j++) {
      const w = W * (0.5 + 0.12 * hash(k * 11 + j + 40));
      const x0 = (j + 0.5 * (k % 2) + 0.2 * (hash(k * 11 + j + 41) - 0.5)) * (W / n) - w * 0.1;
      const x1 = x0 + w;
      const y = rowTop + (k === 0 ? 0 : 36 * (hash(k * 11 + j + 42) - 0.5));
      const edge = range(14, (u) => [x0 + u * (x1 - x0), y + 10 * Math.sin(u * 7 + k + j) + 46 * Math.pow(Math.abs(u * 2 - 1), 4)] as Pt);
      const bottom = Math.min(H + PAD, rowTop + 520);
      p.wash(ROCK.body[(k + j + 5) % ROCK.body.length], 235, [...edge, [x1, bottom], [x0, bottom]], 0.03, 0.55);
      p.wash(ROCK.top, 170, [...edge, ...edge.slice().reverse().map(([x, yy], i) => [x, yy + 16 + 10 * hash(k * 17 + j + i)] as Pt)], 0.04, 0.5);
      p.wash(ROCK.crevice, 90, [...edge.map(([x, yy]) => [x, yy + 30] as Pt), ...edge.slice().reverse().map(([x, yy]) => [x, yy + 78] as Pt)], 0.05, 0.6);
      tops.push([x0, x1, y]);
    }
  });
  // Seagrass clumps on the ledge tops, swaying; still ink (backgrounds do not boil).
  p.inkStill(44, 'HB', '#5d7d55', 1.5);
  tops.forEach(([x0, x1, y], c) => {
    if (hash(c + 160) < 0.35) return;
    const bx = x0 + (0.2 + 0.6 * hash(c + 161)) * (x1 - x0);
    for (let b = 0; b < 5; b++) {
      const h = 40 + hash(c * 7 + b + 142) * 70;
      const sw = 12 * Math.sin(t * 1.6 + c + b * 0.7);
      const x = bx + (b - 2) * 7;
      brush.spline([[x, y + 14], [x + sw * 0.5 + (b - 2) * 4, y + 14 - h * 0.5], [x + sw + (b - 2) * 9, y + 14 - h]], 0.6);
    }
  });
};

/** Caustic net: wavy pale lines that drift with time, kept between y0 and y1 (above the caption band). */
export const paintCaustics = (p: Painter, W: number, y0: number, y1: number, t: number, color = '#cfe0c0', count = 18) => {
  p.inkStill(30, 'HB', color, 1.1);
  for (let i = 0; i < count; i++) {
    const yy = y0 + hash(i + 40) * (y1 - y0);
    const x0 = hash(i + 41) * W;
    p.brush.spline(range(4, (u) => [x0 - 90 + u * 180, yy + 14 * Math.sin(u * 5 + t * 1.4 + i)] as Pt), 0.7);
  }
};

/** Screen-space suspended particles (after the camera pop), dimmer below `dimBelow` so the caption band stays dark. */
export const paintParticles = (p: Painter, W: number, H: number, t: number, count = 90, dimBelow = 860) => {
  p.inkStill(51, 'pen', '#cfe4dc', 1);
  for (let i = 0; i < count; i++) {
    const x = (hash(i + 500) * W + t * (6 + hash(i + 501) * 10)) % W;
    const y = (hash(i + 502) * H - t * (8 + hash(i + 503) * 12) + H) % H;
    if (y > dimBelow && i % 3) continue;
    p.brush.line(x, y, x + 3, y + 3);
  }
};

// ---------------------------------------------------------------- storm (B03 reconstruction)

export const paintStormSky = (p: Painter, W: number) => {
  bands(p, W, '#262e38', ['#262e38', '#2f3945', '#3c4855', '#4a5664'], -PAD, 760, {opacity: 210, bleed: 0.05, texture: 0.6});
  p.wash('#171c24', 210, [[-PAD, 120], [300, 60], [640, 160], [W + PAD, 90], [W + PAD, 300], [620, 360], [260, 300], [-PAD, 360]], 0.06, 0.6);
};

/** Far swell behind the ship, base y ~700. */
export const paintStormFarSea = (p: Painter, W: number, H: number, t: number) => {
  p.flat('#1e2c36', [...range(20, (u) => [-PAD + u * (W + 2 * PAD), waveY(-PAD + u * (W + 2 * PAD), 712, 50, t * 2, 1)] as Pt), [W + PAD, H + PAD], [-PAD, H + PAD]]);
  p.wash('#24343e', 230, [...range(20, (u) => [-PAD + u * (W + 2 * PAD), waveY(-PAD + u * (W + 2 * PAD), 700, 50, t * 2, 1)] as Pt), [W + PAD, 980], [-PAD, 980]], 0.05, 0.5);
};

/** Front swell crest at `base` that hides the hull bottom, then near-water ridges and foam to the bottom of the frame. */
export const paintStormNearSea = (p: Painter, W: number, H: number, t: number, base = 800) => {
  const {brush} = p;
  const crest = (x: number) => waveY(x, base, 38, t * 2.4, 1.6) - 30 * Math.exp(-Math.pow((x - 260) / 180, 2));
  const crestPts = range(24, (u) => [-PAD + u * (W + 2 * PAD), crest(-PAD + u * (W + 2 * PAD))] as Pt);
  p.flat('#192832', [...crestPts, [W + PAD, H + PAD], [-PAD, H + PAD]]);
  p.wash('#1f303a', 235, [...crestPts, [W + PAD, base + 260], [-PAD, base + 260]], 0.05, 0.5);
  // Near ridges: each a darker trough band under a lit face, phases from hash so they roll without jumping.
  const ridges = [base + 230, base + 470, base + 720, base + 980];
  ridges.forEach((ry, k) => {
    const amp = 26 + 10 * k, kk = 1.1 - 0.15 * k;
    const ridge = (x: number) => waveY(x + 200 * hash(k + 3), ry, amp, t * (2 - 0.2 * k), kk);
    const pts = range(24, (u) => [-PAD + u * (W + 2 * PAD), ridge(-PAD + u * (W + 2 * PAD))] as Pt);
    p.wash(['#22343e', '#1a2a33', '#203039', '#16242c'][k], 230, [...pts, [W + PAD, ry + 300], [-PAD, ry + 300]], 0.04, 0.55);
    p.wash('#2c424c', 160, [...pts, ...pts.slice().reverse().map(([x, y]) => [x, y + 26] as Pt)], 0.04, 0.5);
  });
  // Foam on the crest and on the ridges, long streaks on the faces: still ink, motion comes from t.
  // Broken foam: irregular runs along the crest (gaps, lengths and offsets from hash, drifting with the swell).
  p.inkStill(21, 'charcoal', '#a9b8ba', 1.1);
  for (let k = 0; k < 16; k++) {
    if (hash(k + 72) < 0.3) continue;
    const x0 = -80 + k * 76 + 50 * hash(k + 70);
    const len = 20 + 90 * hash(k + 71);
    brush.spline(range(4, (u) => [x0 + u * len, crest(x0 + u * len) + 3 + 6 * hash(k + 73)] as Pt), 0.5);
  }
  p.inkStill(22, 'HB', '#8fa2a8', 1.2);
  for (let i = 0; i < 42; i++) {
    const y = base + 60 + hash(i + 11) * (H - base);
    const x = ((hash(i + 13) * (W + 400) - t * (60 + hash(i) * 50)) % (W + 400) + W + 400) % (W + 400) - 200;
    const len = 60 + hash(i + 17) * 160;
    brush.line(x, y, x + len, y - len * 0.12);
  }
  return crest;
};

/** Screen-space rain (after the camera pop). */
export const paintRain = (p: Painter, W: number, H: number, t: number, count = 170, color = '#b4c2cc') => {
  p.inkStill(50, 'pen', color, 1);
  for (let i = 0; i < count; i++) {
    const speed = 1900 + hash(i + 300) * 700;
    const x0 = hash(i + 200) * (W + 500) - 100;
    const y = ((hash(i + 400) * (H + 200) + t * speed) % (H + 200)) - 100;
    const x = x0 - (y / H) * 420;
    p.brush.line(x, y, x - 24, y + 80);
  }
};
