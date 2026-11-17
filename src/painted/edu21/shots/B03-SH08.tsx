import {camMove, camOf} from '../../kit/cam-moves';
import {blob, ell, inkLine, washAt} from '../../kit/draw';
import {hash} from '../../kit/hash';
import type {Painter} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {wp} from '../../kit/world';
import {camPoint, camUnit, type YCam} from '../../kit/ycam';
import {CAR, SAG_FULL, SCORCH} from '../car';
import {paintExterior, paintRain} from '../exterior';
import {sm} from '../explain';
import {makeShot} from '../shot';

// B03-SH08 · G636-765 · the damaged tyre (L07). EDU-EP21-SHEETS-R1 shot block (SD06, SD12); Boss W5.2 BG4, 2026-11-16.
// Camera `cam((1.30, 0.31, 0.85), 30->22, 1.2->1.05, 0.45, 1100, 700)` on u = L / 129 (the sheet's run: contact 1112 -> 1171 at L128), linear: the FR tyre close, no person.
// GD1: L0-10 image and hiss only, the damage reads with no caption. Sag 0.02 -> 0.06 m over L0-100 (ease-out; the body as one rigid
// transform, car.ts `sagCam`; the tread flattens and spreads on the road); the split blister's edge opens 1 cm L20-60; the scorch matte
// #3a2a22, no glow. Steam: thin seeded wisps rising from the split into the rain (#c9d0d6; SHEETS-R2 D-Q22: 45 % L0-60, 1.5x wider, to 0.45 m, 20 % by
// L128), thinning over the shot; never a column. SHEETS-R3 D-FX2-Q3 (Boss FX3, 2026-11-17): each wisp is born 0.06 m aft of the tyre's rear
// silhouette edge on the lens side and fades in from 0 over its first 0.12 m of rise, so no pale lump sits on the tread or sidewall.
// Puddle r 0.6 m round the tyre with rain rings (rings kept out of the caption band). Storm light (live tone).

export const CAM = camMove([1.3, 0.31, 0.85], [30, 22], [1.2, 1.05], 0.45, {f: 1100, hy: 700});
const N = 129;
export const camAt = (L: number): YCam => camOf(CAM, L / N);
/** Body sag at the FR corner (m): 0.02 -> 0.06 over L0-100, ease-out. */
export const sagAt = (L: number) => { const k = Math.min(1, L / 100); return 0.02 + (SAG_FULL - 0.02) * (1 - (1 - k) * (1 - k)); };
/** Split opening (m): the SH07 hairline (2 mm) opening to 1 cm L20-60. */
export const splitAt = (L: number) => 0.002 + 0.008 * sm(L, 20, 60);

const PUDDLE = {x: 1.3, z: 0.95, r: 0.6};
const disc = (r: number, n = 28): V3[] => Array.from({length: n}, (_, i) => [PUDDLE.x + r * Math.cos((i / n) * 6.283), 0.003, PUDDLE.z + r * 0.85 * Math.sin((i / n) * 6.283)] as V3);

/** The puddle round the tyre: dark water, a sky sheen on its far half, seeded rain rings on the composition clock (none in the band). */
const paintPuddle = (p: Painter, c: YCam, t: number) => {
  const w = wp(c, disc(PUDDLE.r));
  if (w.length >= 3) washAt(p, 47000, '#2a323c', 150, w, 0.25, 0.3);
  const s = wp(c, disc(PUDDLE.r * 0.7).filter(([, , z]) => z < PUDDLE.z + 0.05));
  if (s.length >= 3) washAt(p, 47001, '#55606c', 70, s, 0.4, 0.4);
  for (let i = 0; i < 14; i++) {
    const k = Math.floor(t * 7 + hash(47100 + i) * 7), a = hash(47200 + i * 13 + k) * 6.283, rr = PUDDLE.r * Math.sqrt(hash(47300 + i * 17 + k)) * 0.92;
    const v: V3 = [PUDDLE.x + rr * Math.cos(a), 0.004, PUDDLE.z + rr * 0.85 * Math.sin(a)];
    const q = camPoint(c, v);
    if (!q || q[1] > 1160) continue;
    const u = camUnit(c, v), ph = (t * 7 + hash(47100 + i) * 7) % 1;
    inkLine(p.layer(0.8 * (1 - ph), 47400 + i), 47500 + i, ell(q[0], q[1], (0.02 + 0.05 * ph) * u, (0.007 + 0.016 * ph) * u, 12), {color: '#a9b6c2', weight: 0.8, still: true});
  }
};

/** Where the steam leaves: the split on the outer sidewall (the hub drops with the sag). */
const splitPoint = (sag: number): V3 => {
  const cy = CAR.wheelR - sag, rm = (SCORCH.r0 + SCORCH.r1) / 2;
  return [CAR.wheelX + rm * Math.cos(SCORCH.a), cy + rm * Math.sin(SCORCH.a), 0.87];
};
/** Thin steam wisps (SHEETS-R2 D-Q22, Boss FX2): each rises 0.05 -> 0.45 m over its own 1.6 s cycle, drifting aft with the wind and
 *  swaying sideways by up to 0.1 m (so stacked wisps sit apart and never join into a column), widening and fading; 1.5x the R1 width.
 *  The whole steam peaks at 45 % over L0-60 and thins to 20 % by L128 (R1: 30 % thinning to 45 % of that). A pure function of G (seek-safe). */
const STEAM_PEAK = 115; // 45 % of 255
/** SHEETS-R3 D-FX2-Q3 (Boss FX3): the tyre's rear silhouette edge at height y (m), the lens-side sidewall (z 0.86) seen from this
 *  front-quarter lens, with car.ts `tyrePt`'s tread spread below the hub, so each wisp can be born clear of the tyre. */
export const tyreRearX = (y: number, sag: number) => {
  const r = CAR.wheelR, cy = r - sag, dy = Math.max(-r, Math.min(r, y - cy));
  let dx = Math.sqrt(r * r - dy * dy);
  if (sag > 0 && dy < 0) dx *= 1 + 0.26 * (sag / SAG_FULL) * Math.min(1, -dy / cy);
  return CAR.wheelX - dx;
};
const WISP_GAP = 0.06; // m aft of the rear silhouette edge at birth (D-FX2-Q3)
const WISP_FADE = 0.12; // m of rise over which a wisp fades in from 0 (D-FX2-Q3)
const steamEnv = (L: number) => 1 - (1 - 20 / 45) * sm(L, 60, 128);
/** The visible wisps at (L, G): picture centre, half-sizes (px) and alpha (0..1 of `STEAM_PEAK`). Exported for fx3-measure.ts. */
export const steamWisps = (c: YCam, L: number, G: number, sag: number) => {
  const o = splitPoint(sag), env = steamEnv(L), out: {i: number; cyc: number; ph: number; q: [number, number]; rx: number; ry: number; a: number}[] = [];
  for (let i = 0; i < 7; i++) {
    const ph = (G / 48 + hash(47600 + i)) % 1, cyc = Math.floor(G / 48 + hash(47600 + i));
    const sway = (hash(47700 + i * 7 + cyc) - 0.5) * 0.2;
    // FX3: born WISP_GAP aft of the tyre's rear outline at the split's height + 0.05 m, on the lens side (R2 was born on the sidewall at
    // the split, 0.02 m aft of it, so its first, densest part sat on the tread as a pale lump)
    const y0 = o[1] + 0.05, x0 = tyreRearX(y0, sag) - WISP_GAP;
    const v: V3 = [x0 - 0.12 * ph + sway * ph, y0 + 0.4 * ph, o[2] + 0.02 + 0.03 * ph];
    const q = camPoint(c, v);
    if (!q) continue;
    const fadeIn = Math.min(1, (0.4 * ph) / WISP_FADE); // alpha 0 at birth, full envelope from 0.12 m of rise
    const u = camUnit(c, v), a = fadeIn * env * Math.sin(Math.PI * ph) ** 0.8 * (1 - 0.45 * ph); // visible over the whole rise (R1 faded out by 0.33 m)
    if (a <= 0.01) continue;
    out.push({i, cyc, ph, q: [q[0], q[1]], rx: 1.5 * (0.012 + 0.03 * ph) * u, ry: (0.05 + 0.08 * ph) * u, a});
  }
  return out;
};
const paintSteam = (p: Painter, c: YCam, L: number, G: number, sag: number) => {
  // a slim, soft, tall wisp, widening as it rises; never a round puff
  for (const w of steamWisps(c, L, G, sag))
    washAt(p, 47800 + w.i * 3 + (w.cyc % 3), '#c9d0d6', STEAM_PEAK * w.a, blob(47900 + w.i + w.cyc * 11, w.q[0], w.q[1], w.rx, w.ry, 0, 14), 0.8, 0.6);
};

export const shot = makeShot({
  id: 'B03-SH08', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camAt(L), t = G / 30, sag = sagAt(L);
    paintExterior(p, c, {t, tufts: [], underCar: (q, cc) => paintPuddle(q, cc, t),
      car: {glassOp: 60, inkBreakWheels: true, sag, frDamage: {scorch: 1, split: splitAt(L)}}});
    paintSteam(p, c, L, G, sag);
    paintRain(p, t);
  },
});
