import {paintAnchor, paintChain, paintFurrow, paintPlume, paintTrawl} from '../kit/anchors';
import {ell, hardFill, inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';
import {bedY, cableAt, ribbon, waterAt} from './sea';

// EDU-EP17 under-water staging in space W (Boss W5): the bay boats seen from below (W = R + (0, 1.5, 14)), their anchor chains, the shallow cable as a
// buried ridge with the bared stretch z -52 -> -58 around the snag point K, and the B04-SH04 anchor run (N7 kit draws in kit/anchors.ts).

/** Boats in W (from the yard bay, R + (0, 1.5, 14)): kind, centre on the surface, heading (deg, look-yaw convention), hull length, draft. */
export const HULLS: {id: string; at: V3; hd: number; len: number; beam: number; draft: number}[] = [
  {id: 'B1', at: [-9, 0, -28], hd: 110, len: 9, beam: 1.4, draft: 0.5},
  {id: 'B2', at: [6, 0, -46], hd: 70, len: 10, beam: 2.4, draft: 0.8},
  {id: 'B3', at: [-2, 0, -71], hd: 75, len: 8, beam: 1.3, draft: 0.45},
];
export const K: V3 = cableAt(-53.5);

/** Hull silhouettes on the surface seen from below, with a light rim where the sun wraps round them; `t` bobs them. */
export const paintHullsBelow = (p: Painter, c: YCam, t: number) => {
  HULLS.forEach((h, i) => {
    const a = (h.hd * Math.PI) / 180, ax: V3 = [Math.sin(a), 0, -Math.cos(a)], sd: V3 = [Math.cos(a), 0, Math.sin(a)], bob = 0.04 * Math.sin(t * 1.6 + i * 1.3);
    const W = (u: number, v: number, y: number): V3 => [h.at[0] + ax[0] * u + sd[0] * v, y + bob, h.at[2] + ax[2] * u + sd[2] * v];
    const ring: V3[] = [];
    for (let j = 0; j <= 20; j++) { const q = (j / 20) * Math.PI * 2, u = Math.cos(q) * h.len / 2, v = Math.sin(q) * h.beam / 2 * (u > 0 ? 1 - (u / (h.len / 2)) ** 2 * 0.6 : 1); ring.push(W(u, v, -h.draft * (0.6 + 0.4 * Math.abs(Math.sin(q))))); }
    const q = ring.map((v) => camPoint(c, v));
    if (q.some((x) => !x)) return;
    const col = mixColor('#0e2a36', waterAt(-1, {amb: 0}), 0.25);
    washAt(p, 7900 + i * 4, '#e8f7e0', 70, (q as Pt[]).map(([x, y]) => [x, y] as Pt), 0.35, 0);
    hardFill(p, 7901 + i * 4, col, q as Pt[]);
    const keel = [W(-h.len * 0.45, 0, -h.draft), W(h.len * 0.45, 0, -h.draft)].map((v) => camPoint(c, v));
    if (keel[0] && keel[1]) inkLine(p, 7902 + i * 4, keel as Pt[], {closed: false, color: mixColor(col, '#000000', 0.3), weight: Math.max(1, 0.05 * camUnit(c, h.at)), still: true});
  });
};
/** Where each hull's anchor rests on the bed (W7, fix list item 3): B1 lies off its bow on the far side of K (it rested 54 px above K in the
 *  B04-SH02 arrival frame); B2's is the anchor that later drags (B04-SH04 entry point K.x + 2.4, at K's z); B3 as before. */
export const hullAnchorAt = (id: string, bow: V3, i: number): V3 => {
  if (id === 'B2') return [K[0] + 2.4, bedY(K[2]) + 0.05, K[2]];
  const z = id === 'B1' ? bow[2] - 4 : bow[2] - 5 - i * 1.5, x = id === 'B1' ? bow[0] - 2.2 : bow[0] + 2.5;
  return [x, bedY(z) + 0.05, z];
};
/**
 * Anchor chains hanging from the hulls to the sand (B04-SH02 from L80, B04-SH04 background): bow -> a resting anchor on the bed. W7: every chain is a
 * dark line at least `minPx` wide under the kit links (it read as nothing at 30-40 m), in a tone darker than the water around it; `link` (m, per hull)
 * lets a far chain keep visible links (staging exaggeration, fixed per shot so the link count does not crawl with the camera); `b2` paints B2's own
 * resting chain (B04-SH02; B04-SH04 draws it as the dragging anchor run instead).
 */
export const paintHullChains = (p: Painter, c: YCam, t: number, skip?: string, o: {link?: Record<string, number>; minPx?: number; b2?: boolean} = {}) => {
  HULLS.forEach((h, i) => {
    if (h.id === skip || (h.id === 'B2' && o.b2 === false)) return;
    const a = (h.hd * Math.PI) / 180, bow: V3 = [h.at[0] + Math.sin(a) * h.len * 0.45, -h.draft * 0.5, h.at[2] - Math.cos(a) * h.len * 0.45];
    const rest = hullAnchorAt(h.id, bow, i), bed: V3 = [rest[0] + (h.id === 'B2' ? 0 : 0.1 * Math.sin(t * 0.8 + i)), rest[1], rest[2]];
    const water = waterAt(bed[1], {amb: 0}), dark = mixColor(mixColor(C.chain, water, 0.2), '#071419', 0.35), ring: V3 = [bed[0], bed[1] + 0.35, bed[2]];
    const link = o.link?.[h.id] ?? 0.09, sag = 0.4;
    const mid: V3 = [(bow[0] + ring[0]) / 2, (bow[1] + ring[1]) / 2 - sag, (bow[2] + ring[2]) / 2], km = camUnit(c, mid);
    const line: Pt[] = [];
    for (let j = 0; j <= 24; j++) { const u = j / 24, q = camPoint(c, [bow[0] + (ring[0] - bow[0]) * u, bow[1] + (ring[1] - bow[1]) * u - sag * 4 * u * (1 - u), bow[2] + (ring[2] - bow[2]) * u]); if (q) line.push(q); }
    if (line.length > 1) inkLine(p, 7948 + i * 300, line, {closed: false, color: dark, weight: Math.max(o.minPx ?? 3, link * 0.5 * km), still: true, curve: 0.3});
    paintChain(p, c, 7950 + i * 300, bow, ring, {sag, link, color: dark, hi: mixColor(dark, water, 0.35)});
    paintAnchor(p, c, 7930 + i * 10, bed, [-0.4, 0.9, 0.1], [0, 0, 1], 0.6, {steel: mixColor(C.steel, water, 0.2), hi: mixColor('#9aa0a4', water, 0.3)});
  });
};

/** The shallow cable z zFar..zNear: a buried ridge (sand lip and shadow) except the bared stretch z -58 -> -52, drawn as the armoured cable.
 *  `lift(z)` raises it (m, the snag), `brk` true parts it at K (the shore side goes dark). */
export const paintShallowCable = (p: Painter, c: YCam, zFar: number, zNear: number, o: {lift?: (z: number) => [number, number]; brk?: number; glow?: number} = {}) => {
  const ridge: Pt[] = [], rw: number[] = [];
  for (let z = zNear; z >= zFar; z -= 0.25) {
    if (z < -52 && z > -58) { if (ridge.length > 1) flushRidge(p, c, ridge, rw, z); ridge.length = 0; rw.length = 0; continue; }
    const v = cableAt(z), q = camPoint(c, [v[0], bedY(z) + 0.03, z]);
    if (q) { ridge.push(q); rw.push(Math.max(1, 0.07 * camUnit(c, v))); }
  }
  if (ridge.length > 1) flushRidge(p, c, ridge, rw, zFar);
  // bared stretch (pieces either side of a break)
  const brk = o.brk ?? 0, parts: [number, number][] = brk > 0 ? [[-58, K[2] - 0.06 - 0.25 * brk], [K[2] + 0.06 + 0.25 * brk, -52]] : [[-58, -52]];
  parts.forEach(([z0, z1], pi) => {
    const P: Pt[] = [], W: number[] = [];
    for (let z = z1; z >= z0; z -= 0.05) {
      const v = cableAt(z), [dx, dy] = o.lift ? o.lift(z) : [0, 0], base = bedY(z) + 0.02, q = camPoint(c, [v[0] + dx, base + dy, z]);
      if (q) { P.push(q); W.push(Math.max(0.8, 0.0175 * camUnit(c, v))); }
    }
    if (P.length < 2) return;
    const lit = pi === 0 || brk === 0 ? (o.glow ?? 1) : 0;
    if (lit > 0) hardFill(p, 7980 + pi, mixColor(C.glow, C.shallow1, 0.55), ribbon(P, W.map((w) => w * 2.4 + 1)));
    hardFill(p, 7982 + pi, mixColor(C.armour, C.cable, 0.3), ribbon(P, W));
    inkLine(p, 7984 + pi, P, {closed: false, color: lit > 0 ? mixColor(C.glow, '#ffffff', 0.4) : C.cableHi, weight: Math.max(0.6, W[0] * 0.35), still: true, curve: 0});
  });
};
const flushRidge = (p: Painter, c: YCam, P: Pt[], W: number[], z: number) => {
  const sand = mixColor(C.seaSand, waterAt(bedY(z), {amb: 0}), 0.35);
  hardFill(p, 7970 + (Math.round(-z) % 7), mixColor(sand, '#4a5a50', 0.25), ribbon(P.map(([x, y]) => [x, y + 2] as Pt), W.map((w) => w * 0.6)));
  hardFill(p, 7977 + (Math.round(-z) % 3), mixColor(sand, '#ffffff', 0.12), ribbon(P, W.map((w) => w * 0.45)));
};

/** B04-SH04 anchor run on the shot clock L (sheet: enters L44, fluke at K L97, lifts the cable 0.4 m L97-111, parts L113, drags on 0.3 m to L127). */
export const anchorRun = (L: number) => {
  const sm = (a: number, b: number) => { const k = Math.max(0, Math.min(1, (L - a) / (b - a))); return k * k * (3 - 2 * k); };
  const x = L < 97 ? K[0] + 2.4 - 2.4 * Math.max(0, Math.min(1, (L - 44) / 53)) : K[0] - 0.3 * sm(113, 127);
  const lift = L < 97 ? 0 : L < 113 ? 0.4 * sm(97, 111) : 0.4 * (1 - sm(113, 120));
  return {x, lift, broke: L >= 113, brk: sm(113, 118), puff: L >= 113 ? Math.min(0.99, (L - 113) / 14) : 0, on: L >= 44};
};
export const paintAnchorRun = (p: Painter, c: YCam, L: number) => {
  const r = anchorRun(L), z = K[2], crown: V3 = [r.x, bedY(z) + 0.06 + (L >= 97 && L < 113 ? r.lift * 0.6 : 0), z];
  // furrow from the entry point to the anchor
  const path: V3[] = []; for (let i = 0; i <= 12; i++) { const x = K[0] + 2.6 - (K[0] + 2.6 - r.x) * (i / 12); path.push([x, bedY(z) + 0.002, z]); }
  if (r.on) paintFurrow(p, c, 7700, path, 1, {w: 0.12, floor: mixColor(C.fsFurrow, C.shallow1, 0.3), lip: mixColor(C.seaSand, '#ffffff', 0.1)});
  paintShallowCable(p, c, -62, -45, {lift: (zz) => [L >= 97 ? (r.x - K[0]) * Math.exp(-(((zz - z) / 0.9) ** 2)) : 0, r.lift * Math.exp(-(((zz - z) / 1.1) ** 2))], brk: r.brk});
  if (!r.on) return;
  // chain from the ring up and ahead (the pull: the anchor drags toward its chain), off frame top
  const a = paintAnchor(p, c, 7720, crown, [-0.75, 0.66, 0], [0, 0, 1], 0.6, {steel: C.steel, hi: '#9aa0a4', rust: C.rust});
  paintChain(p, c, 7740, a.ring, [r.x - 5, -0.6, z + 3], {sag: 0.25, link: 0.07, color: C.chain});
  // sand kicked off the fluke while it ploughs, and the puff at the break
  if (L < 113) paintPlume(p, c, 7800, [r.x - 0.15, bedY(z), z], ((L - 44) / 9) % 1, {size: 0.35, col: mixColor(C.seaSand, C.shallow1, 0.3)});
  if (r.puff > 0) paintPlume(p, c, 7820, [K[0], bedY(z) + 0.1, z], r.puff, {size: 0.9, col: mixColor(C.seaSand, '#ffffff', 0.15)});
};
/** The trawl passing behind at z -47.5, L63-95, moving -x (the anchor's screen direction). */
export const paintTrawlPass = (p: Painter, c: YCam, L: number) => {
  if (L < 60 || L > 98) return;
  const u = (L - 63) / 32, x = 4.5 - 9 * u, z = -47.5;
  paintTrawl(p, c, 7600, [x, bedY(z), z], [-1, 0, 0], {wood: mixColor('#6a4a30', C.shallow1, 0.35), steel: mixColor(C.steel, C.shallow1, 0.3), net: mixColor(C.net, C.shallow1, 0.35), bag: 4});
  paintPlume(p, c, 7640, [x + 0.6, bedY(z), z], (u * 3) % 1, {size: 0.8, col: mixColor(C.seaSand, C.shallow1, 0.4)});
};
/** Rising bubbles (B01-SH03 entry): world column near `at`, shot seconds `t`. */
export const paintBubbles = (p: Painter, c: YCam, at: V3, t: number, n = 24) => {
  for (let i = 0; i < n; i++) {
    const y = at[1] + ((t * (0.8 + hash(7500 + i)) + hash(7530 + i) * 4) % 4), v: V3 = [at[0] + (hash(7560 + i) - 0.5) * 1.5, y, at[2] + (hash(7590 + i) - 0.5) * 1.5], q = camPoint(c, v);
    if (!q) continue;
    const r = Math.max(1.5, (0.02 + 0.03 * hash(7620 + i)) * camUnit(c, v));
    inkLine(p, 7650 + i, ell(q[0], q[1], r, r, 10), {color: '#e8fbff', weight: Math.max(0.6, r * 0.25), still: true});
  }
};
