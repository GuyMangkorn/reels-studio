// SET-CLOUDMACRO (N4; B01-SH04 no-air, B02-SH01 real colour replay): the wet underside of the cloud at 48 px/mm (camera r 25 mm), mist dots at depth, and the hero drop
// swelling at its attachment point and letting go. Screen space (mm-scale sets have no ground); `L` is the shot-local frame, `shift` the replay offset (B02-SH01 = +7).
import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {clamp01, sm} from './clock';
import {paintDrop14, REFRACT_NOAIR, REFRACT_REAL} from './drop';
import type {World} from './busstop';

export const CM = {u: 48, attach: [540, 330] as Pt, swell: [0, 15] as const, release: 17, gone: 29};
/** The hero drop's diameter (mm), neck pinch (0..1 = thick..gone) and centre y at shot frame `Lc` (replay offset already subtracted). */
export const heroDrop = (Lc: number) => {
  const d = 1 + 4 * sm(CM.swell[0], CM.swell[1], Lc), fall = Math.max(0, Lc - CM.release);
  const neck = Lc < CM.release ? 1 - sm(10, CM.release, Lc) : 0;
  const rest = CM.attach[1] + (0.32 + 0.22 * neck) * d * CM.u + (d * CM.u) / 2;
  return {d, neck, y: rest + 23.6 * 0.5 * fall * fall * (fall > 0 ? 1 : 0) + 0 * fall};
};

export const paintCloudMacro = (p: Painter, o: {L: number; world: World; shift?: number; t?: number}) => {
  const {L, world} = o, Lc = L - (o.shift ?? 0), t = o.t ?? L / 30, yaw = 3 * clamp01(L / 42);
  // mid-grey haze below the cloud, a darker ceiling at the top
  const real = world === 'real';
  hardFill(p, 25000, real ? '#7c97a3' : '#8d999d', [[-20, -20], [1100, -20], [1100, 1940], [-20, 1940]]);
  hardFill(p, 25001, real ? '#587280' : '#7a878c', [[-20, 900], [1100, 900], [1100, 1940], [-20, 1940]]);
  washAt(p, 25002, real ? '#e8c98f' : '#a9b4b8', real ? 120 : 110, ell(540, 860, 620, 500, 24), 0.5, 0.4);
  // far mist dots (depth layers move opposite to the yaw, the nearer the more)
  for (let i = 0; i < 90; i++) {
    const dz = 0.25 + 0.75 * hash(25100 + i), x = hash(25200 + i) * 1300 - 110 - yaw * 14 * (1 - dz), y0 = 420 + hash(25300 + i) * 1500, drift = world === 'real' ? t * 30 * dz : 0;
    const y = 420 + ((y0 - 420 - drift + 4000) % 1500), r = 2 + 7 * dz * hash(25400 + i);
    washAt(p.layer(0.35 + 0.4 * dz, 25500 + i * 3), 25500 + i * 3, '#dfe7ea', 190, ell(x, y, r, r, 8), 0, 0);
  }
  // real world: other drops forming and falling at depth (soft, small)
  if (world === 'real') for (let i = 0; i < 7; i++) {
    const x = 70 + hash(25700 + i) * 940, d = 1 + 1.4 * hash(25710 + i), y = 520 + ((hash(25720 + i) * 1500 + t * (260 + 200 * hash(25730 + i)) * (1 + 0.5 * t)) % 1500);
    paintDrop14(p.layer(0.45, 25800 + i * 400), [x, y], 18, {kind: 'sphere', size: d}, {refract: REFRACT_REAL, seed: 25800 + i * 40});
  }
  // cloud underside: ragged ceiling, lobes, lit patches, wet sheen
  const lobes: Pt[] = [];
  for (let x = -40; x <= 1120; x += 30) lobes.push([x, 300 + 22 * Math.sin(x * 0.021 + 1) + 30 * hash(25900 + x) + (Math.abs(x - 540) < 130 ? 26 : 0)]);
  hardFill(p, 25950, real ? '#46586a' : '#4a565c', [[-40, -40], [1120, -40], ...lobes.slice().reverse()]);
  hardFill(p, 25951, real ? '#2f3f4f' : '#38434a', [[-40, -40], [1120, -40], [1120, 150], [-40, 150]]);
  for (let i = 0; i < 12; i++) washAt(p, 25960 + i, i % 3 ? '#697780' : '#8a979d', 120, ell(hash(25970 + i) * 1100, 120 + hash(25980 + i) * 160, 80 + hash(25990 + i) * 140, 18 + hash(25995 + i) * 24, 18), 0.4, 0.4);
  washAt(p, 25996, '#aeb9be', 90, ell(540, 318, 160, 14, 20), 0.2, 0.2);
  // the hero drop: neck, then the sphere
  const h = heroDrop(Lc);
  const refract = world === 'noair' ? REFRACT_NOAIR : REFRACT_REAL;
  if (h.neck > 0 && Lc < CM.release) {
    const w = 0.5 * h.d * CM.u * (0.22 + 0.5 * h.neck), top = CM.attach[1] - 6, bot = h.y - (h.d * CM.u) / 2 + 6;
    hardFill(p, 26000, '#d6e8ee', [[CM.attach[0] - w * 1.4, top], [CM.attach[0] + w * 1.4, top], [CM.attach[0] + w * 0.6, (top + bot) / 2], [CM.attach[0] + w, bot], [CM.attach[0] - w, bot], [CM.attach[0] - w * 0.6, (top + bot) / 2]]);
  }
  if (h.y < 2100 && Lc >= 0) paintDrop14(p, [CM.attach[0], h.y], CM.u, {kind: 'sphere', size: h.d}, {refract, seed: 26100});
  void mixColor;
};
