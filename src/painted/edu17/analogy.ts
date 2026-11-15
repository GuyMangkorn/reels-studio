import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {C} from './palette';

// N9 thought bubble + toy helicopter (B02-SH03 L05 key state), W3 THUMBNAIL grade (Film, 2026-11-15). Screen-plane (space B, px). The series
// bubble (edu15/bubble.ts method: cloud edge, rising dots); the kit promotion is Boss's at build.

/** Cloud-edged bubble centred `at`, half-size `rx`/`ry`, with three rising dots from `tail` (his head). Returns the interior ellipse. */
export const paintBubble = (p: Painter, at: Pt, rx: number, ry: number, tail: Pt, o: {pop?: number} = {}) => {
  // `pop` 0..1 (B02-SH03 ui pop, Boss W5): the three dots come first, then the cloud grows with a small overshoot; undefined = fully open (LF04)
  const pop = o.pop ?? 1;
  if (pop <= 0) return;
  const grow = pop >= 1 ? 1 : (() => { const k = Math.max(0, Math.min(1, (pop - 0.3) / 0.7)); return k <= 0 ? 0 : 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2; })();
  [[0.12, 14], [0.26, 22], [0.42, 32]].forEach(([k, r], i) => {
    if (pop < 1 && pop * 3.3 < i + 0.2) return;
    const x = tail[0] + (at[0] - tail[0]) * k, y = tail[1] + (at[1] + ry * 0.9 - tail[1]) * k;
    hardFill(p, 9000 + i, C.bubFill, ell(x, y, r, r, 14));
    inkLine(p, 9004 + i, ell(x, y, r, r, 14), {color: C.bubEdge, weight: 1.6, still: true, curve: 0.1});
  });
  if (grow <= 0.02) return;
  rx *= grow; ry *= grow;
  const pts: Pt[] = Array.from({length: 120}, (_, i): Pt => { const a = (i / 120) * Math.PI * 2, sc = 1 + 0.045 * Math.abs(Math.sin(a * 7)); return [at[0] + rx * sc * Math.cos(a), at[1] + ry * sc * Math.sin(a)]; });
  hardFill(p, 9010, C.bubFill, pts);
  // pale sky inside, in soft horizontal bands
  for (let i = 0; i < 6; i++) { const y0 = at[1] - ry * 0.85 + (i * ry * 1.7) / 6; hardFill(p, 9020 + i, mixColor(C.bubSky, C.bubFill, i / 5), ell(at[0], y0 + ry * 0.14, rx * 0.86 * Math.sqrt(Math.max(0.05, 1 - ((y0 + ry * 0.14 - at[1]) / ry) ** 2)), ry * 0.16, 30)); }
  inkLine(p, 9030, pts, {color: C.bubEdge, weight: 2.4, still: true, curve: 0.2});
};

/** Toy helicopter lifting one crate of four glowing cubes on a sling. `at` the rotor hub, `s` px per 0.1 of the body. */
export const paintHeli = (p: Painter, at: Pt, s: number, swing = 0) => {
  const [x, y] = at;
  // tail boom and fin
  hardFill(p, 9100, mixColor(C.heli, '#7a2a18', 0.2), [[x - s * 0.3, y + s * 0.55], [x - s * 2.1, y + s * 0.45], [x - s * 2.1, y + s * 0.62], [x - s * 0.3, y + s * 0.85]]);
  hardFill(p, 9101, C.heli, [[x - s * 2.0, y + s * 0.5], [x - s * 2.35, y + s * 0.05], [x - s * 2.2, y + s * 0.05], [x - s * 1.85, y + s * 0.5]]);
  hardFill(p, 9102, '#f2efe8', ell(x - s * 2.2, y + s * 0.45, s * 0.22, s * 0.22, 12));
  // body and canopy (no pilot face)
  hardFill(p, 9103, C.heli, ell(x, y + s * 0.75, s * 0.85, s * 0.55, 20));
  hardFill(p, 9104, mixColor(C.heli, '#7a2a18', 0.3), ell(x + s * 0.05, y + s * 0.95, s * 0.7, s * 0.3, 18));
  hardFill(p, 9105, '#bfe3ee', ell(x + s * 0.4, y + s * 0.62, s * 0.4, s * 0.34, 16));
  hardFill(p, 9106, '#ffffff', ell(x + s * 0.48, y + s * 0.52, s * 0.12, s * 0.07, 10));
  // skids, mast, rotor disc blur
  inkLine(p, 9107, [[x - s * 0.6, y + s * 1.45], [x + s * 0.75, y + s * 1.45]], {closed: false, color: '#3a3a3a', weight: 1.6, still: true});
  [-0.35, 0.4].forEach((k, i) => inkLine(p, 9108 + i, [[x + s * k, y + s * 1.2], [x + s * k, y + s * 1.45]], {closed: false, color: '#3a3a3a', weight: 1.2, still: true}));
  inkLine(p, 9110, [[x, y + s * 0.22], [x, y]], {closed: false, color: '#3a3a3a', weight: 1.6, still: true});
  washAt(p, 9111, '#ffffff', 150, ell(x, y, s * 1.9, s * 0.16, 24), 0.1, 0);
  // sling and crate of four glowing cubes
  const cx = x + swing * s * 0.4, cy = y + s * 3.0;
  inkLine(p, 9112, [[x, y + s * 1.3], [cx - s * 0.35, cy - s * 0.4]], {closed: false, color: '#5a4a3a', weight: 1, still: true});
  inkLine(p, 9113, [[x, y + s * 1.3], [cx + s * 0.35, cy - s * 0.4]], {closed: false, color: '#5a4a3a', weight: 1, still: true});
  hardFill(p, 9114, C.crate, [[cx - s * 0.5, cy - s * 0.4], [cx + s * 0.5, cy - s * 0.4], [cx + s * 0.5, cy + s * 0.25], [cx - s * 0.5, cy + s * 0.25]]);
  [[-0.27, -0.55], [0.0, -0.55], [0.27, -0.55], [-0.13, -0.8]].forEach(([dx, dy], i) => {
    washAt(p, 9120 + i, C.cube, 120, ell(cx + dx * s, cy + dy * s, s * 0.2, s * 0.2, 10), 0.1, 0);
    hardFill(p, 9124 + i, mixColor(C.cube, '#ffffff', 0.4), [[cx + (dx - 0.11) * s, cy + (dy - 0.11) * s], [cx + (dx + 0.11) * s, cy + (dy - 0.11) * s], [cx + (dx + 0.11) * s, cy + (dy + 0.11) * s], [cx + (dx - 0.11) * s, cy + (dy + 0.11) * s]]);
  });
  inkLine(p, 9130, [[cx - s * 0.5, cy - s * 0.08], [cx + s * 0.5, cy - s * 0.08]], {closed: false, color: mixColor(C.crate, '#3a2414', 0.4), weight: 1, still: true});
};

/** Polygon of the horizontal band y0..y1 inside the ellipse (at, rx, ry), cut to x in [xa, xb] (B02-SH03 contents stay inside the bubble). */
export const ellBand = (at: Pt, rx: number, ry: number, y0: number, y1: number, xa = -1e9, xb = 1e9): Pt[] => {
  const a = Math.max(y0, at[1] - ry + 0.5), b = Math.min(y1, at[1] + ry - 0.5);
  if (b <= a) return [];
  const n = Math.max(2, Math.ceil((b - a) / 6)), L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const y = a + ((b - a) * i) / n, hw = rx * Math.sqrt(Math.max(0, 1 - ((y - at[1]) / ry) ** 2)), xl = Math.max(xa, at[0] - hw), xr = Math.min(xb, at[0] + hw);
    if (xr > xl) { L.push([xl, y]); R.push([xr, y]); }
  }
  return L.length > 1 ? [...L, ...R.reverse()] : [];
};

/**
 * N9 motorway that folds into one cable, inside the bubble interior ellipse (at, rx, ry), right of `xFrom` (the page-turn edge). `n` lanes stacked
 * across the bubble (top-down), light streaks running left to right (`t` s); `squeeze` 0..1 pulls the lanes to the centre line, `roll` 0..1 turns the
 * thin band into one glowing cable; `k` picture-stage push about the centre.
 */
export const paintMotorway = (p: Painter, at: Pt, rx: number, ry: number, o: {t: number; squeeze: number; roll: number; k?: number; xFrom?: number; n?: number}) => {
  const n = o.n ?? 20, k = o.k ?? 1, xa = o.xFrom ?? -1e9, sq = o.squeeze, roll = o.roll;
  // verge (grass) behind the road, then the carriageway band
  const verge = ellBand(at, rx, ry, at[1] - ry, at[1] + ry, xa);
  if (verge.length) hardFill(p, 9200, mixColor('#9ab27a', C.bubSky, 0.35), verge);
  const half = ry * 0.62 * k * (1 - 0.985 * sq), y0 = at[1] - half, y1 = at[1] + half;
  const band = ellBand(at, rx, ry, y0, y1, xa);
  if (band.length && roll < 1) hardFill(p, 9201, mixColor(C.asphalt, C.cable, roll), band);
  if (roll < 0.8) {
    // lane lines and streaks; they merge as the band squeezes
    for (let i = 1; i < n; i++) {
      const y = y0 + ((y1 - y0) * i) / n, seg = ellBand(at, rx, ry, y - 0.6, y + 0.6, xa);
      if (seg.length && i % 2 === 0 && half > 20) hardFill(p, 9210 + i, mixColor(C.lane, C.asphalt, 0.35 + 0.5 * sq), seg);
    }
    for (let i = 0; i < n; i++) {
      const y = y0 + ((y1 - y0) * (i + 0.5)) / n, hw = rx * Math.sqrt(Math.max(0, 1 - ((y - at[1]) / ry) ** 2));
      for (let j = 0; j < 2; j++) {
        const spd = 0.35 + 0.25 * ((i * 7 + j * 3) % 5) / 5, u = ((o.t * spd + (i * 0.37 + j * 0.5)) % 1), x = at[0] - hw + 2 * hw * u, len = 26 * k;
        if (x - len < Math.max(xa, at[0] - hw) || x > at[0] + hw) continue;
        const h = Math.max(1.2, ((y1 - y0) / n) * 0.35);
        hardFill(p, 9240 + i * 2 + j, mixColor(i % 3 ? C.streakA : '#ffffff', C.glow, sq), [[x - len, y - h], [x, y - h * 0.6], [x, y + h * 0.6], [x - len, y + h]]);
      }
    }
  }
  if (roll > 0) {
    // the cable: glow halo then dark core with a bright line, across the bubble
    const w = 7 * roll, g = ellBand(at, rx, ry, at[1] - w * 2.4, at[1] + w * 2.4, xa), core = ellBand(at, rx, ry, at[1] - w * 0.8, at[1] + w * 0.8, xa);
    if (g.length) washAt(p, 9290, C.glow, 170 * roll, g, 0.15, 0);
    if (core.length) hardFill(p, 9291, C.cable, core);
    const hi = ellBand(at, rx, ry, at[1] - 0.8, at[1] + 0.8, xa);
    if (hi.length) hardFill(p, 9292, mixColor(C.glow, C.core, 0.4), hi);
  }
};
