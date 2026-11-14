import {hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor} from '../kit/painter';
import {wp} from '../kit/world';
import {camPoint, camUnit} from '../kit/ycam';
import {cardAt, cell, cps, type Card, type Painter, type V3, type YCam} from './core';

// ENV-FIRE (N16-12, N17-*): the open wood fire of the series, promoted from the EP17 look-frame code (the zcpaint balcony flame is a flat-plate
// blaze for a night wall and does not fit a ground fire in a yard; this one stands on the ground in the yaw-camera world). Flat-colour tongues that
// change shape on every 15 fps step (painted flicker, no smooth morph), ember logs and hearth stones on the ground, warm ground pools, a thin
// smoke ribbon drifting east, sparks and a stacked air glow. `at` is the ground point, `t` seconds, `scale` stretches the flames and glow (1 = 1.1 m flames);
// `seed` offsets the shape ids (give a second fire in one plate its own seed, e.g. +200).
// The matching light on a creature is `paintSpino({fire: at, ...})`; people take the fire as a tint, not a light.

/** Flicker factor 0.84..1.12 of a fire at second `t` (stepped at 15 fps), the one the creature and ground light share. */
export const fireFlicker = (t: number, seed = 23000) => 0.84 + 0.28 * hash(seed - 3500 + Math.floor(t * 15) * 7);

/** One fire (nothing is drawn when the fire is behind the lens). */
export const paintFire = (p: Painter, c: YCam, FIRE: V3, t: number, o: {seed?: number; scale?: number} = {}) => {
  const B = o.seed ?? 23000, S = o.scale ?? 1, g = camPoint(c, FIRE), u = camUnit(c, FIRE) * S;
  if (!g) return;
  const step = Math.floor(t * 15), fk = 0.84 + 0.28 * hash(B - 3500 + step * 7);   // same stepped flicker as the creature's light
  // ground light: soft concentric warm pools (no hard edge), breathing with the flicker
  for (let i = 0; i < 6; i++) {
    const r = (2.4 - i * 0.35) * (0.96 + 0.06 * fk);
    const pool = wp(c, Array.from({length: 28}, (_, j): V3 => [FIRE[0] + r * Math.cos(j / 28 * 6.283), 0.01, FIRE[2] + r * 0.9 * Math.sin(j / 28 * 6.283)]));
    if (pool.length > 2) washAt(p, B + i, mixColor('#a8461c', '#ffae52', i / 6), Math.round((10 + i * 6) * fk), pool, 0.7, 0.12);
  }
  const k: Card = {g, u, s: 1};
  // ring of hearth stones, lit on the fire side
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; const kk = cardAt(c, [FIRE[0] + 0.5 * Math.cos(a), 0, FIRE[2] + 0.5 * Math.sin(a)]); if (kk) { hardFill(p, B + 10 + i, mixColor('#2a221c', '#d07a40', (0.35 + 0.45 * Math.max(0, -Math.cos(a))) * fk), cell(kk, 0, 0.06, 0.11, 0.07, 9)); hardFill(p, B + 20 + i, mixColor('#2a221c', '#ffb060', 0.5 * fk), cell(kk, 0, 0.1, 0.07, 0.025, 7)); } }
  // crossed logs with glowing ends and an ember bed
  hardFill(p, B + 30, '#2e1c12', cps(k, [[-0.45, 0.02], [0.4, 0.14], [0.42, 0.22], [-0.43, 0.1]]));
  hardFill(p, B + 31, '#3a2416', cps(k, [[-0.35, 0.18], [0.45, 0.04], [0.43, 0.12], [-0.33, 0.26]]));
  hardFill(p, B + 32, mixColor('#c0401a', '#ff9a3a', fk - 0.8), cell(k, 0.02, 0.12, 0.3, 0.06, 12));
  for (let i = 0; i < 7; i++) hardFill(p, B + 33 + i, '#ffd27a', cell(k, -0.25 + i * 0.08, 0.12 + 0.03 * hash(i + step), 0.018, 0.012, 6));
  // flames: three layers of tongues that change shape on every 15 fps step (no smooth morph: the painted-look flicker)
  const tongue = (x: number, h: number, w: number, col: string, id: number) => {
    const sw = (hash(id + step) - 0.5) * 0.16, hh = h * (0.78 + 0.4 * hash(id * 3 + step)), lean = (hash(id * 5 + step) - 0.5) * 0.1;
    hardFill(p, id, col, cps(k, [[x - w, 0.12], [x - w * 0.75 + lean, 0.12 + hh * 0.35], [x - w * 0.3 + lean * 2, 0.12 + hh * 0.7], [x + sw + lean * 3, 0.12 + hh], [x + w * 0.35 + lean, 0.12 + hh * 0.55], [x + w, 0.12]]));
  };
  [[-0.28, 0.6, 0.13], [-0.1, 0.85, 0.17], [0.08, 1.05, 0.19], [0.26, 0.72, 0.15], [0.38, 0.45, 0.1]].forEach(([x, h, w], i) => tongue(x, h, w, '#d9561f', B + 40 + i));
  [[-0.2, 0.48, 0.11], [0.0, 0.7, 0.14], [0.18, 0.55, 0.11]].forEach(([x, h, w], i) => tongue(x, h, w, '#ffa733', B + 50 + i));
  [[-0.06, 0.38, 0.08], [0.08, 0.3, 0.06]].forEach(([x, h, w], i) => tongue(x, h, w, '#fff0a0', B + 60 + i));
  // sparks rising and a thin smoke ribbon drifting east toward the snout (what it sniffs)
  for (let i = 0; i < 10; i++) { const sx = (hash(i + step * 0.1) - 0.5) * 0.7 + 0.15 * ((hash(i * 7) + t * 0.6) % 1), sy = 1.0 + 1.6 * ((hash(i * 7) + t * 0.6) % 1); hardFill(p, B + 70 + i, i % 3 ? '#ffd27a' : '#ff9a3a', cell(k, sx, sy, 0.014, 0.014, 6)); }
  const sm = (j: number) => [0.1 + 0.55 * j + 0.08 * Math.sin(t * 2 + j * 3), 1.15 + 0.45 * j] as [number, number];
  washAt(p, B + 90, '#5a5a66', 46, cps(k, [[-0.05, 1.1], [0.25, 1.1], ...Array.from({length: 5}, (_, j) => { const [x, y] = sm(j + 1); return [x + 0.18, y] as [number, number]; }), ...Array.from({length: 5}, (_, j) => { const [x, y] = sm(5 - j); return [x - 0.16, y + 0.1] as [number, number]; })]), 0.7, 0.35);
  // air glow round the flames: soft stacked washes, warm core, flickering size
  for (let i = 0; i < 5; i++) { const r = (1.5 - i * 0.26) * u * (0.95 + 0.08 * fk); washAt(p, B + 100 + i, mixColor('#ff7a2a', '#ffd890', i / 5), Math.round((12 + i * 7) * fk), cell({g: [g[0] + 0.02 * u, g[1] - 0.5 * u], u: 1, s: 1}, 0, 0, r, r * 0.85, 24), 0.8, 0.1); }
};

/**
 * N17-08 smoke look (EP17 sh18, green leaves on the fire): thick white-grey smoke that boils up from the fire and rolls east over the yard. Not the thin dark ribbon of
 * `paintFire` (that stays the fire's own wisp): billows of three overlapping soft puffs that grow and pale with age, a lit top edge on each, and a low bank
 * that drifts along the ground. `amount` 0..1 is how much is burning (0 = nothing; the shot's 0 -> 1 at the leaf drop); `t` seconds (ambient clock, seekable).
 */
export const paintGreenSmoke = (p: Painter, c: YCam, FIRE: V3, t: number, o: {amount?: number; seed?: number; scale?: number; wind?: number} = {}) => {
  const amount = o.amount ?? 1, B = o.seed ?? 23500, S = o.scale ?? 1, wind = o.wind ?? 1;
  if (amount <= 0) return;
  const n = Math.round(10 + 22 * amount), puffs: {a: number; i: number}[] = [];
  for (let i = 0; i < n; i++) puffs.push({i, a: (hash(B + i * 3.1) + t * (0.16 + 0.07 * hash(B + i * 5.3))) % 1});
  puffs.sort((q, r) => r.a - q.a);                       // oldest (largest) first
  for (const {i, a} of puffs) {
    const sway = Math.sin(t * 1.3 + i) * 0.18 * a;
    const at: V3 = [FIRE[0] + (0.12 + 3.4 * Math.pow(a, 1.35)) * wind * S + sway, FIRE[1] + (0.55 + 3.0 * Math.pow(a, 0.85)) * S, FIRE[2] + (hash(B + i * 7.7) - 0.5) * 1.1 * a * S];
    const q = camPoint(c, at); if (!q) continue;
    const u = camUnit(c, at), r = (0.22 + 0.95 * a) * S * u, op = amount * Math.pow(Math.sin(Math.PI * Math.min(0.98, a)), 0.75) * 120;
    const col = mixColor('#f2f4f2', '#a8aeae', Math.min(1, a * 0.9)), k = {g: q, u: 1, s: 1 as number};
    for (let j = 0; j < 3; j++) {
      const dx = (hash(B + i * 9 + j) - 0.5) * r * 0.9, dy = (hash(B + i * 11 + j) - 0.5) * r * 0.5;
      washAt(p, B + 100 + i * 6 + j, col, op, cell({...k, g: [q[0] + dx, q[1] + dy]}, 0, 0, r * (0.62 + 0.18 * j * 0.4), r * 0.5, 12), 0.6, 0.15);
    }
    washAt(p, B + 400 + i, '#ffffff', op * 0.45, cell({...k, g: [q[0] - r * 0.12, q[1] - r * 0.28]}, 0, 0, r * 0.42, r * 0.2, 10), 0.5, 0.1);   // lit top edge
  }
  // low bank rolling over the yard
  const g = camPoint(c, [FIRE[0] + 2.5 * wind * S, 0.1, FIRE[2]]), ug = camUnit(c, FIRE);
  if (g) for (let i = 0; i < 4; i++) washAt(p, B + 500 + i, '#e6eae8', amount * (26 - i * 4), cell({g: [g[0] + (i - 1.5) * 0.9 * ug + 12 * Math.sin(t * 0.6 + i), g[1] - 0.2 * ug * i * 0.4], u: 1, s: 1}, 0, 0, (1.6 + i * 0.35) * ug, 0.3 * ug, 14), 0.8, 0.1);
};
