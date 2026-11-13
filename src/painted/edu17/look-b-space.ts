import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {EARTH_COL} from '../kit/earth';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import {mixColor} from '../kit/painter';

// EDU-EP17 look frames, set B (W3, Film): the `D` fixed-plane space diagrams of LF04: the hero atom with the speck ring (shot 13 @ +72) and
// the balance at its stop (shot 14 @ +30). Brief: Set plan - diagrams, colour key (Space and Earth, Atom, Balance). Pixels, y down.

export const SP = {space0: '#0b1430', space1: '#1d2c54', star: '#e8eefc', cloudIn: '#cfe3ff', cloudOut: '#7fa8e0', glint: '#fff4dc', ring: '#ffd34a', speck: '#2b211c', brass: '#c9a24a', brassSh: '#8a6a2a', brassHi: '#f2dca0'};

/** Space backdrop: navy that lifts toward `lift` (not flat black, UT03) and 1-2 px stars, none inside `clear` rects. */
export const paintSpace = (p: Painter, lift: Pt = [540, 1200], o: {stars?: number} = {}) => {
  hardFill(p, 1, SP.space0, [[-40, -40], [1120, -40], [1120, 1960], [-40, 1960]]);
  for (let i = 0; i < 7; i++) washAt(p, 2 + i, mixColor(SP.space0, SP.space1, (i + 1) / 7), 255, ell(lift[0], lift[1], 1300 - i * 150, 1500 - i * 170, 28), 0, 0);
  for (let i = 0; i < (o.stars ?? 160); i++) {
    const x = hash(i * 3.1) * 1080, y = hash(i * 7.7 + 1) * 1920, r = hash(i * 1.3 + 2) < 0.15 ? 1.6 : 0.9;
    hardFill(p, 100 + i, mixColor(SP.space0, SP.star, 0.45 + 0.55 * hash(i + 0.5)), ell(x, y, r, r, 6));
  }
};

/** A soft electron-cloud ball (concentric washes, soft edge) with the nucleus glint at its centre. */
export const paintAtom = (p: Painter, seed: number, cx: number, cy: number, r: number, dim = 0) => {
  const out = mixColor(SP.cloudOut, SP.space0, dim), inn = mixColor(SP.cloudIn, SP.space1, dim);
  washAt(p, seed, out, 40, ell(cx, cy, r * 1.1, r * 1.1, 40), 0, 0);
  for (let i = 0; i < 14; i++) { const k = i / 13; washAt(p, seed + 1 + i, mixColor(out, inn, k * k), 60 + 6 * i, ell(cx - r * 0.1 * k, cy - r * 0.12 * k, r * (1 - 0.068 * i), r * (1 - 0.068 * i), 40), 0, 0); }
  if (r > 40) hardFill(p, seed + 9, SP.glint, ell(cx, cy, Math.max(1.2, r * 0.012), Math.max(1.2, r * 0.012), 8));
};

export type AtomOpt = 'A' | 'B' | 'C';
/** LF04 atom: shot 13 @ +72, inside the loupe at full frame. Surface line y 940, hero atom 360 px at (540, 760), speck 3 px at (612, 932), marker ring 44 px, leader to (700, 560).
 * Push 6 % from +38 (eased) about the ring side. A = sheet values (2 px ring); B = 4 px ring with a dark keyline (reads at 270 px); C = 64 px ring, 4 px. */
export const paintLf04Atom = (p: Painter, f: number, opt: AtomOpt) => {
  const u = Math.min(1, Math.max(0, (f - 38) / 54)), e = u * u * (3 - 2 * u), s = 1 + 0.06 * e, o: Pt = [600, 900];
  const T = ([x, y]: Pt): Pt => [o[0] + (x - o[0]) * s, o[1] + (y - o[1]) * s];
  paintSpace(p, [540, 980], {stars: 90});
  // the ground at atom scale: packed rows under the surface line, darker with depth
  for (let row = 3; row >= 1; row--) for (let i = -2; i <= 3; i++) {
    const x = 540 + (i - (row % 2) * 0.5) * 340 + (hash(row * 9 + i) - 0.5) * 30, y = 760 + row * 300;
    const c = T([x, y]); paintAtom(p, 200 + row * 40 + (i + 2) * 6, c[0], c[1], 180 * s, 0.45 + 0.17 * row);
  }
  // the surface row: neighbours either side, then the hero atom
  for (const i of [-1, 1]) { const c = T([540 + i * 360, 772 + i * 6]); paintAtom(p, 400 + i * 10, c[0], c[1], 176 * s, 0.3); }
  const h = T([540, 760]); paintAtom(p, 450, h[0], h[1], 180 * s, 0);
  // the speck on the hero atom's lower edge, its marker ring and leader
  const sp = T([612, 932]), rr = (opt === 'C' ? 32 : 22) * s, w = opt === 'A' ? 2 : 5;
  hardFill(p, 500, SP.speck, ell(sp[0], sp[1], 1.6 * s, 1.6 * s, 8));
  // the ring as an exact-width annulus (px), with a dark keyline either side in B and C so it reads on the pale cloud at 270 px
  const ann = (r0: number, r1: number): Pt[] => [...ell(sp[0], sp[1], r1, r1, 48), ...ell(sp[0], sp[1], r0, r0, 48).reverse()];
  if (opt !== 'A') { washAt(p, 504, SP.ring, 70, ann(rr + w / 2, rr + w / 2 + 6), 0, 0); hardFill(p, 501, '#1a2140', ann(rr - w / 2 - 2, rr + w / 2 + 2)); }
  hardFill(p, 502, SP.ring, ann(rr - w / 2, rr + w / 2));
  const lt = T([700, 560]), dir = Math.atan2(lt[1] - sp[1], lt[0] - sp[0]);
  inkLine(p, 503, [[sp[0] + rr * Math.cos(dir), sp[1] + rr * Math.sin(dir)], lt], {color: SP.ring, weight: opt === 'A' ? 0.5 : 0.9, closed: false, still: true});
  return {speck: sp, ring: rr * 2, hero: h};
};

/** A small painted Earth (kit EARTH_COL palette): ocean, land, clouds, limb darkening and glow; fully lit (brief: no terminator). */
export const paintEarthBall = (p: Painter, seed: number, cx: number, cy: number, r: number) => {
  washAt(p, seed, EARTH_COL.limbOut, 90, ell(cx, cy, r * 1.07, r * 1.07, 40), 0, 0);
  hardFill(p, seed + 1, EARTH_COL.ocean, ell(cx, cy, r, r, 48));
  washAt(p, seed + 2, EARTH_COL.ocean2, 200, ell(cx - r * 0.2, cy - r * 0.22, r * 0.72, r * 0.72, 36), 0, 0);
  // land (Asia and Australia-ish blobs, clipped to the disc by construction)
  const blob = (k: number, bx: number, by: number, rx: number, ry: number, col: string) => {
    const pts: Pt[] = [];
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, w = 0.75 + 0.5 * hash(k * 17 + i); let x = bx + rx * w * Math.cos(a), y = by + ry * w * Math.sin(a); const d = Math.hypot(x - cx, y - cy); if (d > r * 0.97) { x = cx + ((x - cx) * r * 0.97) / d; y = cy + ((y - cy) * r * 0.97) / d; } pts.push([x, y]); }
    hardFill(p, seed + 10 + k, col, pts);
  };
  blob(1, cx - r * 0.1, cy - r * 0.35, r * 0.55, r * 0.35, EARTH_COL.land);
  blob(2, cx + r * 0.3, cy - r * 0.05, r * 0.25, r * 0.3, EARTH_COL.land2);
  blob(3, cx + r * 0.25, cy + r * 0.55, r * 0.3, r * 0.18, EARTH_COL.land2);
  blob(4, cx - r * 0.45, cy - r * 0.05, r * 0.2, r * 0.25, EARTH_COL.land);
  for (let i = 0; i < 7; i++) { const a = hash(seed + i) * 6.28, d = r * (0.2 + 0.6 * hash(seed + i + 0.5)); washAt(p, seed + 30 + i, EARTH_COL.cloud, 200, ell(cx + d * Math.cos(a), cy + d * Math.sin(a), r * 0.22, r * 0.06, 14, (hash(i) - 0.5) * 0.6), 0, 0); }
  // limb darkening ring and the sun highlight upper left
  for (let i = 0; i < 3; i++) washAt(p, seed + 40 + i, '#0e2a5a', 40, [...ell(cx, cy, r, r, 48), ...ell(cx, cy, r * (0.9 - 0.04 * i), r * (0.9 - 0.04 * i), 48).reverse()], 0, 0);
  washAt(p, seed + 45, '#ffffff', 40, ell(cx - r * 0.38, cy - r * 0.4, r * 0.3, r * 0.22, 20), 0, 0);
  inkLine(p, seed + 46, ell(cx, cy, r, r, 48), {color: EARTH_COL.limbOut, weight: 1.0, still: true});
};

export type BalOpt = 'A' | 'B';
/** LF04 balance: shot 14 @ +30 (beam at the 28 deg stop, crowd pan's chains still wobbling). Pivot (560, 560), beam 760 px, pans 300 px wide hanging 270 px under each end,
 * Earth r 165 in the left pan, the crowd speck (4 px) with its ring in the right pan, column down to the base at y 1520. A = sheet; B = warm key from upper left + a cool rim and a shadowed column. */
export const paintLf04Balance = (p: Painter, f: number, opt: BalOpt) => {
  paintSpace(p, [300, 1000], {stars: 140});
  const piv: Pt = [560, 560], tilt = (28 * Math.PI) / 180, L = 380, ca = Math.cos(tilt), sa = Math.sin(tilt);
  const le: Pt = [piv[0] - L * ca, piv[1] + L * sa], re: Pt = [piv[0] + L * ca, piv[1] - L * sa];
  const hi = opt === 'B' ? '#ffe6a8' : SP.brassHi;
  // column and base (the base sits under the caption band)
  hardFill(p, 10, SP.brassSh, [[piv[0] - 14, piv[1] + 10], [piv[0] + 14, piv[1] + 10], [piv[0] + 20, 1500], [piv[0] - 20, 1500]]);
  hardFill(p, 11, SP.brass, [[piv[0] - 10, piv[1] + 10], [piv[0] + 2, piv[1] + 10], [piv[0] + 4, 1500], [piv[0] - 14, 1500]]);
  hardFill(p, 12, SP.brassSh, ell(piv[0], 1530, 190, 34, 30));
  hardFill(p, 13, SP.brass, ell(piv[0], 1518, 186, 30, 30));
  washAt(p, 14, hi, 150, ell(piv[0] - 70, 1512, 80, 10, 16), 0, 0);
  // pans: chains (three per pan, from the beam end to the rim), a shallow bowl
  const pan = (end: Pt, k: number, wob: number) => {
    const py = end[1] + 270, sway = wob * 6 * Math.sin(f * 0.9 + k);
    const rim: Pt[] = [[end[0] - 150 + sway, py], [end[0] + sway, py + 8], [end[0] + 150 + sway, py]];
    rim.forEach((q, i) => inkLine(p, 30 + k * 4 + i, [end, q], {color: i === 1 ? SP.brassSh : SP.brass, weight: 1.1, closed: false, still: true}));
    hardFill(p, 40 + k * 5, SP.brassSh, [[end[0] - 150 + sway, py], [end[0] + 150 + sway, py], [end[0] + 110 + sway, py + 34], [end[0] - 110 + sway, py + 34]]);
    hardFill(p, 41 + k * 5, SP.brass, ell(end[0] + sway, py, 150, 16, 30));
    washAt(p, 42 + k * 5, hi, 160, ell(end[0] - 60 + sway, py + 18, 50, 6, 12), 0, 0);
    return [end[0] + sway, py] as Pt;
  };
  const lp = pan(le, 0, 0);
  // the Earth rests in the left pan (bottom at the pan floor)
  paintEarthBall(p, 600, lp[0], lp[1] - 165 - 4, 165);
  hardFill(p, 47, SP.brass, [[lp[0] - 150, lp[1]], [lp[0] - 120, lp[1] + 6], [lp[0] + 120, lp[1] + 6], [lp[0] + 150, lp[1]], [lp[0] + 130, lp[1] + 14], [lp[0] - 130, lp[1] + 14]]); // pan front lip over the Earth
  const wob = Math.max(0, 1 - (f - 10) / 30);
  const rp = pan(re, 1, wob);
  // beam with the pointer and the pivot boss
  const bw = 16, nx = sa * bw, ny = ca * bw;
  hardFill(p, 50, SP.brassSh, [[le[0] - nx, le[1] - ny], [re[0] - nx, re[1] - ny], [re[0] + nx, re[1] + ny], [le[0] + nx, le[1] + ny]]);
  hardFill(p, 51, SP.brass, [[le[0] - nx, le[1] - ny], [re[0] - nx, re[1] - ny], [re[0], re[1]], [le[0], le[1]]]);
  inkLine(p, 52, [[le[0] - nx * 0.7, le[1] - ny * 0.7], [re[0] - nx * 0.7, re[1] - ny * 0.7]], {color: hi, weight: 0.8, closed: false, still: true});
  hardFill(p, 53, SP.brassSh, [[piv[0] - 6, piv[1]], [piv[0] + 6, piv[1]], [piv[0] + 6 * ca + 130 * sa, piv[1] + 130 * ca], [piv[0] - 6 * ca + 130 * sa, piv[1] + 130 * ca]]);
  hardFill(p, 54, SP.brass, ell(piv[0], piv[1], 30, 30, 20));
  washAt(p, 55, hi, 200, ell(piv[0] - 9, piv[1] - 10, 11, 8, 10), 0, 0);
  for (const e of [le, re]) hardFill(p, 56 + e[0], SP.brassSh, ell(e[0], e[1], 12, 12, 12));
  if (opt === 'B') {
    washAt(p, 60, '#8fd0ff', 60, [[re[0] + 6, re[1] - 14], [re[0] + 10, re[1] + 14], [le[0] + 10, le[1] + 14], [le[0] + 6, le[1] - 14]], 0, 0);
  }
  // the crowd: a 4 px grey speck in the right pan with the marker ring
  const sp: Pt = [rp[0], rp[1] - 6];
  hardFill(p, 70, '#6b6560', ell(sp[0], sp[1], 2.2, 2, 8));
  inkLine(p, 71, ell(sp[0], sp[1], 26, 26, 36), {color: '#1a2140', weight: 3.4, still: true});
  inkLine(p, 72, ell(sp[0], sp[1], 26, 26, 36), {color: SP.ring, weight: 2.2, still: true});
  return {left: lp, right: rp, speck: sp, earth: [lp[0], lp[1] - 169] as Pt};
};
