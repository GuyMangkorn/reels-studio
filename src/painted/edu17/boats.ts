import {hardFill, inkLine} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {C} from './palette';

// N2 boats, W3 THUMBNAIL grade (Film, 2026-11-15): side-profile cards in the boat's vertical plane (world metres), so a yaw camera sees them
// foreshorten. Finished grade (and the kit copy `kit/boats.ts` the brief names) is built after the thumbnail pick. Heading `hd` in degrees,
// the sheets' look-yaw convention (0 = bow toward -z, 90 = bow toward +x).

export type BoatKind = 'longtailR' | 'longtailY' | 'cabin' | 'trawler';
type Spec = {len: number; hull: string; band: string; free: number};
const SPEC: Record<BoatKind, Spec> = {
  longtailR: {len: 9, hull: C.b1Blue, band: C.b1Red, free: 0.7},
  longtailY: {len: 8, hull: C.b1Blue, band: C.b3Yellow, free: 0.65},
  cabin: {len: 10, hull: C.b2Hull, band: C.cabin, free: 1.0},
  trawler: {len: 18, hull: C.trHull, band: '#c9c5b8', free: 1.8},
};

export const paintBoat = (p: Painter, c: YCam, seed: number, kind: BoatKind, at: V3, hd: number, o: {anchor?: boolean; bob?: number; scale?: number} = {}) => {
  const k0 = o.scale ?? 1, s = SPEC[kind], a = (hd * Math.PI) / 180, ax: V3 = [Math.sin(a), 0, -Math.cos(a)], side: V3 = [Math.cos(a), 0, Math.sin(a)];
  // `scale` shrinks the whole boat about its waterline centre (cutaway miniatures: block units)
  const W = (u: number, h: number, v = 0): V3 => [at[0] + k0 * (ax[0] * u + side[0] * v), at[1] + k0 * (h + (o.bob ?? 0)), at[2] + k0 * (ax[2] * u + side[2] * v)];
  const P = (u: number, h: number, v = 0) => camPoint(c, W(u, h, v));
  const poly = (pts: [number, number][], v = 0) => { const q = pts.map(([u, h]) => P(u, h, v)); return q.some((x) => !x) ? null : (q as Pt[]); };
  const L = s.len / 2, f = s.free, isLong = kind.startsWith('longtail');
  // hull profile: stern (u -L) to bow (u +L); longtail prow sweeps up
  const hullPts: [number, number][] = isLong
    ? [[-L, f * 0.9], [-L * 0.3, f], [L * 0.5, f * 1.1], [L * 0.85, f * 1.6], [L * 1.02, f * 2.5], [L * 0.92, f * 1.2], [L * 0.7, 0], [-L * 0.85, 0]]
    : [[-L, f], [L * 0.6, f * 1.05], [L, f * 1.25], [L * 0.8, 0], [-L * 0.92, 0]];
  const hull = poly(hullPts);
  if (!hull) return;
  // dark water shadow under the hull
  const sh = poly([[-L * 1.05, 0.02], [L * 0.95, 0.02], [L * 0.8, -0.25], [-L * 0.9, -0.25]]);
  if (sh) hardFill(p, seed, mixColor(C.openSea, '#0d2230', 0.35), sh);
  hardFill(p, seed + 1, s.hull, hull);
  const band = poly(isLong ? [[-L, f * 0.9], [-L * 0.3, f], [L * 0.5, f * 1.1], [L * 0.85, f * 1.6], [L * 0.8, f * 1.25], [L * 0.45, f * 0.8], [-L * 0.3, f * 0.7], [-L, f * 0.62]]
    : [[-L, f], [L * 0.6, f * 1.05], [L, f * 1.25], [L * 0.95, f * 1.05], [L * 0.55, f * 0.82], [-L, f * 0.8]]);
  if (band) hardFill(p, seed + 2, s.band, band);
  if (isLong) {
    // canopy roof on two posts, long-tail engine and shaft at the stern
    const roof = poly([[-L * 0.55, f + 1.6], [L * 0.2, f + 1.6], [L * 0.2, f + 1.45], [-L * 0.55, f + 1.45]]);
    if (roof) hardFill(p, seed + 3, mixColor(C.b1Blue, '#d8d2c0', 0.5), roof);
    [-0.5, 0.15].forEach((u, i) => { const q0 = P(L * u, f), q1 = P(L * u, f + 1.5); if (q0 && q1) inkLine(p, seed + 4 + i, [q0, q1], {closed: false, color: '#3a3020', weight: 0.7, still: true}); });
    const eng = poly([[-L * 0.95, f + 0.15], [-L * 0.8, f + 0.15], [-L * 0.8, f + 0.55], [-L * 0.95, f + 0.55]]);
    if (eng) hardFill(p, seed + 6, '#5a5550', eng);
    const s0 = P(-L * 0.9, f + 0.3), s1 = P(-L * 1.45, -0.05);
    if (s0 && s1) inkLine(p, seed + 7, [s0, s1], {closed: false, color: '#3a3530', weight: 0.8, still: true});
  } else if (kind === 'cabin') {
    const cab = poly([[-L * 0.75, f], [-L * 0.1, f], [-L * 0.1, f + 1.7], [-L * 0.7, f + 1.8]]);
    if (cab) hardFill(p, seed + 3, C.cabin, cab);
    const win = poly([[-L * 0.55, f + 1.0], [-L * 0.2, f + 1.0], [-L * 0.2, f + 1.4], [-L * 0.55, f + 1.4]]);
    if (win) hardFill(p, seed + 4, '#3a4a5a', win);
    const m0 = P(L * 0.25, f), m1 = P(L * 0.25, f + 4.2);
    if (m0 && m1) inkLine(p, seed + 5, [m0, m1], {closed: false, color: '#4a3a2a', weight: 0.8, still: true});
  } else {
    const house = poly([[L * 0.1, f], [L * 0.6, f], [L * 0.55, f + 2.6], [L * 0.12, f + 2.8]]);
    if (house) hardFill(p, seed + 3, C.trHouse, house);
    const win = poly([[L * 0.2, f + 1.8], [L * 0.52, f + 1.8], [L * 0.5, f + 2.3], [L * 0.2, f + 2.35]]);
    if (win) hardFill(p, seed + 4, '#2f3a48', win);
    // outrigger booms up in a V across the beam, and two warps astern into the water
    const base = P(-L * 0.05, f + 0.5);
    [-1, 1].forEach((sg, i) => { const tip = P(-L * 0.05, f + 8, sg * 6); if (base && tip) inkLine(p, seed + 5 + i, [base, tip], {closed: false, color: C.boom, weight: 1.0, still: true}); });
    const mast = [P(-L * 0.05, f), P(-L * 0.05, f + 9)];
    if (mast[0] && mast[1]) inkLine(p, seed + 8, mast as Pt[], {closed: false, color: C.boom, weight: 1.1, still: true});
    [-1, 1].forEach((sg, i) => { const w0 = P(-L, f, sg * 0.8), w1 = P(-L - 14, 0, sg * 2.5); if (w0 && w1) inkLine(p, seed + 9 + i, [w0, w1], {closed: false, color: '#3a3a3a', weight: 0.5, still: true}); });
  }
  // anchor line from the bow into the water ahead (30 deg)
  if (o.anchor !== false && kind !== 'trawler') {
    const b0 = P(L * 0.95, f * 1.1), b1 = P(L * 0.95 + 1.6, 0);
    if (b0 && b1) inkLine(p, seed + 12, [b0, b1], {closed: false, color: '#2a2a28', weight: 0.6, still: true});
  }
};
