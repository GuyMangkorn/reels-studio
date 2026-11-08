// Tendon diagram layer (`new: tendon-diagram`, brief EDU-EP09-BRIEF-R1.2 N2, VD14-VD17): a calm teaching diagram drawn over the see-through
// macro hand, riding its skeleton (HAND-CLOSE set-cm). Positions are illustrative, not measured (brief truth limits): one shared coral muscle
// on the back of the forearm splitting into four cream cords (index, middle, ring, little); index and little each have their own small muscle
// and cord; two coral ties (middle-ring, ring-little) behind the knuckles; the ring finger never gets its own cord. The thumb is not drawn.
// Look-frame code (Film W3, look-assets rule); Boss hardens it at W5.
import {hardFill, inkLine} from '../kit/draw';
import {macroSkeleton, type HandMacro} from '../kit/hands';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {C} from './palette';

type Long = 'index' | 'middle' | 'ring' | 'little';
const LONG: Long[] = ['index', 'middle', 'ring', 'little'];
/** Where each shared cord leaves the muscle (cm toward the thumb), spread so the four read apart over the wrist. */
const SPREAD = [1.25, 0.42, -0.42, -1.25];
/** Per-element state: 0 hidden .. 1 full. `lit` 0..1 swaps cream to the lit colour. */
export type TendonState = {
  shared?: number; sharedLit?: number; sharedColor?: string;
  cords?: number; cordLit?: Partial<Record<Long, number>>;
  own?: number; ownLit?: {index?: number; little?: number};
  ties?: [number, number];
  /** Pulse bead along the four shared cords, 0..1 from the wrist to the tips (VD14 "pulse once toward the fingers"). */
  pulse?: number;
  /** Puppet cross ghost over the shared muscle, 0..1 (VD14, 40 % at full). */
  cross?: number;
  taut?: Long;
  /** W5.2 hardening (SH04): 0..1 darkening of a cord (the middle cord at its folded knuckle, L3-12) and the middle-ring tie pulled toward the middle (L26-38). */
  cordDark?: Partial<Record<Long, number>>;
  tiePull?: number;
  /** Taut cord vibration in px (SH04 L89-95: 1-2 px); the sign follows the painter clock, so a seek repeats it. */
  tautShake?: number;
};

/** SP2 minimum drawn widths (px): every shared cord at least 6 px wide, a tie at least 20 px tall at the SD07 end frame. */
export const CORD_MIN_PX = 6;
export const TIE_MIN_PX = 20;

/** Catmull-Rom resample of a picture polyline, then a filled ribbon of width w with round caps (crisp, no brush lumps). */
const smooth = (P: Pt[], k = 5): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let j = 0; j < k; j++) {
      const t = j / k, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(P[P.length - 1]);
  return out;
};
export const ribbon = (P0: Pt[], w: number): Pt[] => {
  const P = smooth(P0), L: Pt[] = [], R: Pt[] = [], h = w / 2;
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    L.push([P[i][0] - (dy / n) * h, P[i][1] + (dx / n) * h]); R.push([P[i][0] + (dy / n) * h, P[i][1] - (dx / n) * h]);
  }
  const cap = (c: Pt, from: Pt, n = 6): Pt[] => { const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]); return Array.from({length: n}, (_, i) => [c[0] + h * Math.cos(a0 - (Math.PI * (i + 1)) / (n + 1)), c[1] + h * Math.sin(a0 - (Math.PI * (i + 1)) / (n + 1))] as Pt); };
  const end = P[P.length - 1], start = P[0];
  return [...L, ...cap(end, L[L.length - 1]), ...R.reverse(), ...cap(start, R[R.length - 1])];
};

const lerp3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

export const paintTendons = (p: Painter, cam: YCam, h: HandMacro, st: TendonState, base = 5000) => {
  const sk = macroSkeleton(h, p.t), S = sk.S, up = sk.normal;
  const wr = h.wrist, el = h.elbow ?? [wr[0] + 0.3 * S, wr[1] + 1.8 * S, wr[2] + 23.5 * S];
  /** A point on the back (top) of the forearm at fraction u from the wrist to the elbow, `side` cm toward the thumb (+x). */
  const fore = (u: number, side = 0, lift = 0): V3 => { const a = lerp3(wr, el, u); return [a[0] + side * S, a[1] + (2.0 + lift) * S - Math.abs(side) * 0.25 * S, a[2]]; };
  const px = (v: V3) => camPoint(cam, v);
  const pxPerCm = (v: V3) => camUnit(cam, v) * S;
  const zOf = (zcm: number) => (zcm * S - (wr[2] - 6.5 * S) - 6.5 * S) / (el[2] - wr[2]); // HAND-CLOSE z (cm, size 1) -> u on wrist..elbow
  void zOf;
  const uAt = (zc: number) => Math.max(0, Math.min(1, (zc * S - wr[2]) / (el[2] - wr[2])));

  // ---- muscles: a spindle on the forearm (z from..to in HAND-CLOSE cm), half-width w cm
  const spindle = (id: number, z0: number, z1: number, side: number, w: number, color: string, a: number, ink: string, glow = 0) => {
    if (a <= 0.01) return;
    const n = 14, L: Pt[] = [], R: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = uAt(z0 + (z1 - z0) * t), hw = w * Math.pow(Math.sin(Math.PI * t), 0.7) + 0.08;
      const l = px(fore(u, side + hw, 0.15)), r = px(fore(u, side - hw, 0.15));
      if (!l || !r) return;
      L.push(l); R.push(r);
    }
    const poly = [...L, ...R.reverse()];
    const q = p.layer(a, base * 4 + id);
    if (glow > 0) {
      const c = px(fore(uAt((z0 + z1) / 2), side, 0.2));
      if (c) {
        const g = pxPerCm(fore(uAt((z0 + z1) / 2), side)) * (w + 1.6);
        hardFill(p.layer(0.18 * glow * a, base * 4 + id + 1), base + id + 1, color, poly.map(([x, y]) => [c[0] + (x - c[0]) * 1.45, c[1] + (y - c[1]) * 1.12] as Pt));
        void g;
      }
    }
    hardFill(q, base + id, color, poly);
    // fibre strokes along the belly
    for (let k = -1; k <= 1; k++) {
      const pts = [0.18, 0.5, 0.82].map((t) => px(fore(uAt(z0 + (z1 - z0) * t), side + k * w * 0.45 * Math.sin(Math.PI * t), 0.2)));
      if (pts.every(Boolean)) inkLine(q, base + id + 2 + k + 1, pts as Pt[], {color: mixColor(color, '#ffffff', 0.35), weight: 1.1, closed: false, curve: 0.4, still: true});
    }
    inkLine(q, base + id + 6, poly, {color: ink, weight: 1.4, still: true});
  };

  // ---- cords: a polyline on the back of the hand from the forearm to near the fingertip
  const cordPath = (id: Long, startSide: number, startZ: number, offset = 0): V3[] => {
    const c = sk.fingers[id];
    const lat = (c.joints[0][0] - wr[0]) / S;
    const toThumb = sk.toThumb;
    const onFinger = (k: number, along = 0): V3 => {
      const j = k < 3 ? lerp3(c.joints[k], c.joints[k + 1], along) : c.joints[3];
      const d = c.dorsal[Math.min(2, Math.max(0, k === 0 ? 0 : k - 1))], r = c.radii[Math.min(3, k)];
      return add(add(j, d, r * 0.98), toThumb, offset * S);
    };
    const mcp = add(c.joints[0], up, c.radii[0] * 1.02);
    return [
      fore(uAt(startZ), startSide, 0.25), fore(uAt(9.5), startSide * 0.8 + lat * 0.12, 0.1),
      add([wr[0] + lat * 0.55 * S, wr[1] + 1.2 * S, wr[2] - 1.2 * S], toThumb, offset * S),
      add(add(mcp, sk.forward, 2.2 * S), toThumb, offset * S), add(mcp, toThumb, offset * S),
      onFinger(1), onFinger(2), lerp3(onFinger(2), onFinger(3), 0.55),
    ];
  };
  const drawCord = (id: number, path: V3[], color: string, a: number, wcm = 0.35, highlight = false, shake = 0) => {
    if (a <= 0.01) return;
    const jitter = shake ? shake * Math.sin(p.t * 2 * Math.PI * 15) : 0;
    const P = path.map(px).map((v, k) => (v && jitter && k > 1 ? ([v[0], v[1] + jitter] as Pt) : v));
    if (P.some((v) => !v)) return;
    const w = Math.max(wcm < 0.3 ? 4 : CORD_MIN_PX, pxPerCm(path[4]) * wcm);
    const q = p.layer(a, base * 4 + 200 + id);
    if (highlight) hardFill(p.layer(0.5 * a, base * 4 + 260 + id), base + 300 + id, C.taut, ribbon(P as Pt[], w * 2.8));
    const rb = ribbon(P as Pt[], w);
    hardFill(q, base + 340 + id, color, rb);
    inkLine(q, base + 320 + id, rb, {color: C.cordInk, weight: 1.3, curve: 0.1, still: true});
  };

  const shared = st.shared ?? 0, sharedCol = st.sharedColor ?? mixColor(C.muscle, C.muscleLit, st.sharedLit ?? 0);
  const own = st.own ?? 0;
  // own muscles first (they lie beside the shared one), then the shared muscle, then the cords on top
  spindle(20, 14, 20, 2.1, 0.55, mixColor(C.cord, C.own, st.ownLit?.index ?? 0), own, C.cordInk);
  spindle(40, 16, 22, -1.9, 0.55, mixColor(C.cord, C.own, st.ownLit?.little ?? 0), own, C.cordInk);
  spindle(0, 11, 24, 0.2, 1.25, sharedCol, shared, '#9a4a35', st.sharedLit !== undefined ? 1 : 0.6);

  const cords = st.cords ?? 0;
  LONG.forEach((id, i) => {
    const lit = st.cordLit?.[id] ?? 0;
    const col = mixColor(mixColor(C.cord, id === 'ring' ? C.taut : C.muscleLit, lit), C.cordInk, (st.cordDark?.[id] ?? 0) * 0.7);
    drawCord(i, cordPath(id, SPREAD[i], 14.5), col, cords, 0.42, st.taut === id, st.taut === id ? st.tautShake ?? 0 : 0);
  });
  if (own > 0.01) {
    drawCord(10, cordPath('index', 2.1, 15, -0.5), mixColor(C.cord, C.own, st.ownLit?.index ?? 0), own, 0.28);
    drawCord(11, cordPath('little', -1.9, 17, 0.5), mixColor(C.cord, C.own, st.ownLit?.little ?? 0), own, 0.28);
  }
  // pulse beads travelling toward the fingers along the four shared cords
  if (st.pulse !== undefined && cords > 0.5) {
    LONG.forEach((id, i) => {
      const path = cordPath(id, SPREAD[i], 14.5), seg = st.pulse! * (path.length - 1), k = Math.min(path.length - 2, Math.floor(seg));
      const v = lerp3(path[k], path[k + 1], seg - k), c = px(v);
      if (!c) return;
      const r = Math.max(4, pxPerCm(v) * 0.3);
      const ring: Pt[] = Array.from({length: 14}, (_, j) => [c[0] + r * Math.cos((j / 14) * 6.283), c[1] + r * Math.sin((j / 14) * 6.283)]);
      hardFill(p.layer(0.35, base * 4 + 400 + i), base + 400 + i, C.taut, ring.map(([x, y]) => [c[0] + (x - c[0]) * 2.2, c[1] + (y - c[1]) * 2.2] as Pt));
      hardFill(p, base + 410 + i, '#fffdf3', ring);
    });
  }
  // ties: middle-ring and ring-little, just behind the knuckles (coral-red bands)
  (st.ties ?? [0, 0]).forEach((a, i) => {
    if (a <= 0.01) return;
    const [f0, f1, z] = i === 0 ? (['middle', 'ring', 2.5] as const) : (['ring', 'little', 3.0] as const);
    const p0 = cordPath(f0, 0, 12), p1 = cordPath(f1, 0, 12);
    const at = (pp: V3[]) => lerp3(pp[2], pp[3], Math.max(0, Math.min(1, 1 - (z - 1.2) / 3)));
    const A0 = at(p0), B = at(p1), A = i === 0 && st.tiePull ? lerp3(A0, B, 0) : A0, mid = i === 0 && st.tiePull ? lerp3(A, B, 0.5 - 0.3 * st.tiePull) : lerp3(A, B, 0.5), half = lerp3(A, B, 0.5 * a);
    const ends = [lerp3(mid, A, a), lerp3(mid, B, a)].map(px), w = Math.max(TIE_MIN_PX * 0.5, pxPerCm(mid) * 0.5);
    if (!ends[0] || !ends[1]) return;
    inkLine(p, base + 500 + i, ends as Pt[], {color: '#7a3a2c', weight: w + 3, closed: false, still: true});
    inkLine(p, base + 510 + i, ends as Pt[], {color: C.tie, weight: w, closed: false, still: true});
    void half;
  });
  // puppet cross ghost: the muscle "holds" a marionette control: a wooden cross lying just over the belly, four short strings from its bar ends
  // to where the four cords leave the muscle (VD14; 40 % ghost at full)
  const cross = st.cross ?? 0;
  if (cross > 0.01) {
    const q = p.layer(0.55 * cross, base * 4 + 600), c0 = fore(uAt(19.5), 0.2, 2.2), wpx = pxPerCm(c0) * 0.55;
    const bar = (a: V3, b: V3, id: number) => { const P = [px(a), px(b)]; if (P.every(Boolean)) { const rb = ribbon(P as Pt[], wpx); hardFill(q, base + 600 + id, '#c99a6a', rb); inkLine(q, base + 610 + id, rb, {color: '#5a3a24', weight: 1.4, curve: 0.1, still: true}); } };
    const ends: V3[] = [add(c0, [1, 0, 0], 3.4 * S), add(c0, [1, 0, 0], -3.4 * S), add(c0, [0, 0, 1], -4.2 * S), add(c0, [0, 0, 1], 3.6 * S)];
    bar(ends[0], ends[1], 0); bar(ends[2], ends[3], 1);
    const tips = [ends[0], add(c0, [1, 0, 0], 1.2 * S), add(c0, [1, 0, 0], -1.2 * S), ends[1]].map((v, i) => (i === 1 || i === 2 ? add(v, [0, 0, 1], -4.2 * S) : v));
    tips.forEach((top, i) => {
      const bot = fore(uAt(14.5), SPREAD[i], 0.3), P = [px(top), px(bot)];
      if (P.every(Boolean)) inkLine(q, base + 620 + i, P as Pt[], {color: '#fffaf0', weight: 1.6, closed: false, still: true});
    });
  }
};

// ---- shot tracks (SHEETS-R2): TendonState at a shot-local frame. Colours are the state's own; `skinAlpha` is for the see-through hand (SH01 L0-17 fades to 28 %).
const ramp = (f: number, a: number, b: number) => { const k = Math.max(0, Math.min(1, (f - a) / (b - a))); return k * k * (3 - 2 * k); };
export type DiagramFrame = {state: TendonState; skinAlpha: number; ringLiftCm: number};
/** S01-B03-SH01 (105 f): skin to 28 % L0-17, shared muscle lit L56, four cords pulse once L74-94, puppet cross L80. */
export const diagramSH01 = (f: number): DiagramFrame => ({skinAlpha: 1 - 0.72 * ramp(f, 0, 17), ringLiftCm: 0, state: {shared: ramp(f, 4, 17), sharedLit: ramp(f, 56, 62), cords: ramp(f, 10, 20), pulse: f >= 74 && f <= 94 ? (f - 74) / 20 : undefined, cross: f >= 80 ? ramp(f, 80, 86) : 0}});
/** S01-B03-SH02 (91 f): index own L3-9, little own L20-26, ring cord cream (taut colour) L78-83 and held to the cut; no ring own cord, thumb never drawn. */
export const diagramSH02 = (f: number): DiagramFrame => ({skinAlpha: 0.28, ringLiftCm: 0, state: {shared: 1, sharedLit: 0, cords: 1, own: 1, ownLit: {index: ramp(f, 3, 9), little: ramp(f, 20, 26)}, cordLit: {ring: ramp(f, 78, 83)}}});
/** S01-B03-SH03 (138 f): shared + middle/ring/little amber L3-13, middle-ring tie draws in L84-92, ring-little tie L99-107, held to L137. */
export const diagramSH03 = (f: number): DiagramFrame => { const a = ramp(f, 3, 13); return {skinAlpha: 0.28, ringLiftCm: 0, state: {shared: 1, sharedLit: a, cords: 1, own: 1, ownLit: {index: 1, little: 1}, cordLit: {middle: a, ring: a, little: a}, ties: [ramp(f, 84, 92), ramp(f, 99, 107)]}}; };
/** S01-B03-SH04 (134 f): middle cord darkens L3-12 (held), middle-ring tie pulls L26-38, ring cord taut L89-95 with a 1-2 px vibration, ring tip rises 0.3 cm L92-101. */
export const diagramSH04 = (f: number): DiagramFrame => ({skinAlpha: 0.28, ringLiftCm: 0.3 * ramp(f, 92, 101), state: {shared: 1, sharedLit: 1, cords: 1, own: 1, ownLit: {index: 1, little: 1}, ties: [1, 1], cordDark: {middle: ramp(f, 3, 12)}, tiePull: ramp(f, 26, 38),
  taut: f >= 89 ? 'ring' : undefined, cordLit: {ring: ramp(f, 89, 95)}, tautShake: f >= 89 ? 1.5 : 0}});
