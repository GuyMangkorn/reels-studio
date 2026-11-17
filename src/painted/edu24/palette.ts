import type {Brush} from '../BrushCanvas';
import {mixColor, type Painter} from '../kit/painter';

// EDU-EP24-SHORT palette and light states (EDU-EP24-BRIEF-R2 "Colour and value key" and "Light"; Film W3 look frames, 2026-11-17).
// Three per-shot light states plus the B05 host patch: `warm` (B01, window sun), `cool` (B02-B03, fluorescent, sun behind a cloud),
// `payoff` (B05: cool room, one low warm patch on the host and the side table). B04 `sepia` is the B03 cool plate graded per plate
// (`sepiaPainter`: every colour the plate paints goes through `sepia`), so the DOM board text takes the same map (`sepia` on its colours).

export type Light = 'warm' | 'cool' | 'payoff';

export const PAL = {
  wall: '#e8dcc4', wallShade: '#b9ab92', ceiling: '#efe8da', ceilingGrid: '#cfc6b4', skirting: '#8a7a64',
  carpet: '#4a5a5e', carpetShade: '#344246',
  sun: '#ffd9a0', sky: '#bcd6e6', fluoro: '#e6f0f2',
  boardFace: '#f4f2ec', boardFrame: '#b8bcc0', flip: '#222326', digit: '#f6f4ee',
  tabYou: '#b4552e', tabRival: '#6f8296', label: '#fbfaf6', sum: '#f0d890', sumInk: '#2a2620', sumLit: '#ffd75e',
  note: '#c8323a', noteShade: '#8e1f26', noteOval: '#f3e6c8', noteInk: '#fff6e8',
  card: '#fbfaf6', cardInk: '#2a2a2a', flapBack: '#d9d4c8',
  wood: '#8a5a3a', chairWood: '#9a7a56', table: '#d8d2c6', tableLeg: '#6e6a64',
  plantPot: '#c9b79a', leaf: '#4f7a4a', leafDark: '#355a36', clockRim: '#3a3a3c',
} as const;

/** Wall / floor colours of a light state: the cool state pulls every set colour toward the fluorescent key with a slight green cast. */
export const setTone = (c: string, light: Light): string => (light === 'warm' ? c : mixColor(c, '#d3e6e2', 0.2));
/** Figure tint per light (paintFigureAt `tint`): cool and payoff wash the bidders toward the fluorescent key; YOU's rust stays the warmest colour. */
export const COOL_TINT = {to: '#c4dcda', u: 0.17};

// ---- B04 sepia grade (brief colour key: saturation 15 %, warm paper tint #e9dcc0, contrast -15 %)
const rgb = (c: string): [number, number, number] | null => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
};
const hex = (v: number[]) => `#${v.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('')}`;
const TINT = rgb('#e9dcc0')!;
/** One colour through the B04 grade: luma kept at 15 % saturation, contrast -15 % about mid-grey, then multiplied by the paper tint. */
export const sepia = (c: string): string => {
  const v = rgb(c);
  if (!v) return c;
  const l = 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2];
  return hex(v.map((x, i) => {
    const s = l + (x - l) * 0.15, k = 128 + (s - 128) * 0.85;
    return (k * TINT[i]) / 255 + 18;
  }));
};
const gradeBrush = (b: Brush, map: (c: string) => string): Brush => {
  const raw = b as unknown as Record<string | symbol, unknown>, mix = (c: unknown) => (typeof c === 'string' ? map(c) : c);
  return new Proxy(raw, {
    get: (t, k) => {
      const v = Reflect.get(t, k, t);
      if (typeof v !== 'function') return v;
      if (k === 'fill' || k === 'wash' || k === 'stroke') return (c: unknown, ...r: unknown[]) => v.call(t, mix(c), ...r);
      if (k === 'set') return (n: unknown, c: unknown, ...r: unknown[]) => v.call(t, n, mix(c), ...r);
      return v.bind(t);
    },
  }) as unknown as Brush;
};
/** The whole plate through `map` (washes, flats, ink and every direct brush fill): the B04 per-plate grade. */
export const gradePainter = (q: Painter, map: (c: string) => string = sepia): Painter => ({
  ...q,
  brush: gradeBrush(q.brush, map),
  wash: (c, op, pts, bleed, texture) => q.wash(map(c), op, pts, bleed, texture),
  flat: (c, pts) => q.flat(map(c), pts),
  ink: (id, name, c, w) => q.ink(id, name, map(c), w),
  inkStill: (id, name, c, w) => q.inkStill(id, name, map(c), w),
  layer: (a, base) => gradePainter(q.layer(a, base), map),
});
