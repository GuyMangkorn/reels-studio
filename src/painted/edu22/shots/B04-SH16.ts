import {hardFill, inkLine} from '../../kit/draw';
import {mixColor, type Painter, type Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {hull} from '../../kit/world';
import {camPoint, camPoly, camUnit, type YCam} from '../../kit/ycam';
import {CUP_AT, demoCam, gripOf, lerpStrip, paintDemo, paintMitten, STRIP_B_CUP, type StripPose} from '../demo';
import {clipPolyPainter, lerp, lerp3, ramp, smooth, track} from '../motion22';
import {DEMO} from '../palette';
import {DEMO_PAPER, makeShot, type Shot22} from '../shot';
import {sine01} from '../stage';
import {paintBlots, repaintMitten} from '../sulfur';

// B04-SH16 · G 1144-1220 (76 f) · silver stays bright (EDU-EP22-SCENES-R2). Truck right to the cup (hy 1040). R2: the mitten lays strip A (SH15's
// exit tarnish: front 0.60 plus the 12 sulfur blots) on the paper between the dish and the cup, tarnished tip toward the cup, l 0-6 (from 0.02 m above its rest);
// moves to strip B l 6-10, lifts it 2.5 cm l 10-11 and dips it back by l 12 (G 1156) as R1; lifts strip B +0.04 m out of the liquid l 24-34
// (G 1168-1178) and holds it there in front of the child's navy vest; a white highlight band (0.9, 25 % of the strip) runs tip -> top l 46-58
// (G 1190-1202, "เงินก็เฉย"). The CHILD (front-left 30 deg card behind the top's far edge, scaled, skullcap) leans in l 20-40 `suspicious`,
// -> `surprised` l 46-52, hold; face anchor about (0.14, 0.15-0.30, -0.21).
const N = 76;
// R2 deviation (Boss): the sheet's rest pose (tip (0.075, 0.002, -0.06), top (0.02, 0.002, -0.04)) puts the top end inside the dish (r 0.06) under
// egg R (0.03, -0.026); strip A lies instead on the paper between the dish and the cup, a little behind both (in front of the cup it fell in the
// caption band, y 1182-1282), clear of the dish rim and the cup, tarnished tip toward the cup.
const A_REST: StripPose = {tip: [0.088, 0.002, -0.072], top: [0.033, 0.002, -0.093], side: [-0.357, 0, 0.934]};
const up = (q: StripPose, h: number): StripPose => ({tip: [q.tip[0], q.tip[1] + h, q.tip[2]], top: [q.top[0], q.top[1] + h, q.top[2]], side: q.side});
const A_START = up(A_REST, 0.02);
// R2: the child 0.02 m further +x (the sheet's allowance) to bring his navy vest toward strip B's lifted pose.
const CH0: V3 = [0.17, -0.21, -0.27], CH1: V3 = [0.16, -0.21, -0.22];
/** Strip B at frame L: in the cup, the R1 lift-and-dip l 10-12, then lifted +0.04 m l 24-34 and held. */
const stripB = (L: number): StripPose => {
  if (L < 10) return STRIP_B_CUP;
  if (L < 11) return up(STRIP_B_CUP, 0.025 * (L - 10));
  if (L < 24) return lerpStrip(up(STRIP_B_CUP, 0.025), STRIP_B_CUP, ramp(L, 11, 12));
  return up(STRIP_B_CUP, 0.04 * smooth(ramp(L, 24, 34)));
};
// R2b (W6.2 viewer check H-C, "strip B is only a pale outline on pale grey"): a dark ground behind the cup, shot-local. A navy-grey demo card
// #3a4658 (the vest colour family) stands upright on the top just behind the cup (world x 0.095-0.235, z -0.076, h 0.118 m: wider than the
// child's torso and below his shoulders so it reads as a board, not his body; its left edge clears strip A; on from l 0, so it is part of the
// set, not an event), with a soft contact shadow, a lit top edge and a lighter inset border that keeps it apart from the vest. Over the card the cup's glass, liquid, rim ink and glint are
// laid again (demo.ts `paintCup` values, clipped to the card, so the cup reads as glass in front of it); strip B is then repainted bright
// #f4f6f8 with a thin #2a3140 outline (the cup's washes over the card thinner, so the board stays dark through the glass), and a white four-point glint opens on its upper part as it clears the liquid (l 30-46). demo.ts unchanged.
const CARD = {x0: 0.095, x1: 0.235, z: CUP_AT[2] - 0.036, h: 0.118, color: '#3a4658', edge: '#6b7890'};
const cupRing = (c: YCam, r: number, y: number, n = 20): Pt[] =>
  Array.from({length: n}, (_, i) => camPoint(c, [CUP_AT[0] + r * Math.cos((i / n) * 6.283), y, CUP_AT[2] + r * Math.sin((i / n) * 6.283)])).filter((q): q is Pt => !!q);
const cupSolid = (c: YCam, prof: [number, number][]): Pt[] => hull(prof.flatMap(([r, h]) => cupRing(c, r, h)));
const fillIf = (p: Painter, seed: number, color: string, pts: Pt[]) => { if (pts.length >= 3) hardFill(p, seed, color, pts); };
const stripQuad = (c: YCam, b: StripPose, u0 = 0, u1 = 1, s0 = -1, s1 = 1): Pt[] | null => {
  const P = (u: number, s: number): V3 => [b.tip[0] + (b.top[0] - b.tip[0]) * u + b.side[0] * 0.0075 * s, b.tip[1] + (b.top[1] - b.tip[1]) * u, b.tip[2] + (b.top[2] - b.tip[2]) * u + b.side[2] * 0.0075 * s];
  const q = [P(u0, s0), P(u1, s0), P(u1, s1), P(u0, s1)].map((v) => camPoint(c, v));
  return q.every(Boolean) ? (q as Pt[]) : null;
};
/** The card, the cup laid again over it, and strip B restyled (see R2b above). */
const paintCardAndStripB = (p: Painter, c: YCam, b: StripPose, L: number) => {
  const {x0, x1, z, h} = CARD;
  const sh = camPoly(c, [[x0 - 0.004, 0.0005, z], [x1 + 0.004, 0.0005, z], [x1 + 0.01, 0.0005, z + 0.022], [x0 + 0.002, 0.0005, z + 0.022]]);
  fillIf(p.layer(0.22, 29960 * 3), 29960, '#4a5058', sh);
  const card = camPoly(c, [[x0, 0, z], [x1, 0, z], [x1, h, z], [x0, h, z]]);
  if (card.length < 3) return;
  fillIf(p, 29961, CARD.color, card);
  const e0 = camPoint(c, [x0, h, z]), e1 = camPoint(c, [x1, h, z]);
  if (e0 && e1) inkLine(p, 29962, [e0, e1], {closed: false, weight: 1.2, color: CARD.edge, still: true});
  inkLine(p, 29963, card, {weight: 0.8, color: '#262d38', still: true});
  const m = 0.006, border = camPoly(c, [[x0 + m, m, z], [x1 - m, m, z], [x1 - m, h - m, z], [x0 + m, h - m, z]]);
  if (border.length >= 3) inkLine(p, 29969, border, {weight: 0.9, color: CARD.edge, still: true});
  // the cup over the card (paintCup's layers and colours, clipped to the card; clear glass and water in front of a dark board stay dark,
  // so the glass, water, surface and veil washes there are thinner: 0.16 / 0.12 / 0.25 / 0.12 for paintCup's 0.55 / 0.5 / 0.6 / 0.35)
  const q = clipPolyPainter(p, card), body = cupSolid(c, [[0.026, 0], [0.03, 0.05]]);
  fillIf(q.layer(0.16, 29301 * 3), 29301, DEMO.glass, body);
  fillIf(q.layer(0.12, 29302 * 3), 29302, DEMO.liquid, cupSolid(c, [[0.0255, 0.002], [0.0285, 0.034]]));
  fillIf(q.layer(0.25, 29303 * 3), 29303, mixColor(DEMO.liquid, '#ffffff', 0.4), cupRing(c, 0.0285, 0.034, 24));
  // strip B: bright face, a cool shade along its lower edge, thin dark outline
  const face = stripQuad(c, b), shade = stripQuad(c, b, 0, 1, -1, -0.45);
  if (face) fillIf(p, 29964, '#f4f6f8', face);
  if (shade) fillIf(p.layer(0.6, 29965 * 3), 29965, '#c3cbd3', shade);
  // the liquid's front veil over the part still in it (over the card's glass too), then rim and body ink and the cup glint
  const veil = cupSolid(c, [[0.0255, 0.002], [0.0285, 0.033]]);
  fillIf(q.layer(0.12, 29330 * 3), 29330, DEMO.liquid, veil);
  if (face) fillIf(clipPolyPainter(p, face).layer(0.35, 29966 * 3), 29966, DEMO.liquid, veil);
  if (face) inkLine(p, 29967, face, {weight: 1.0, color: '#2a3140', still: true});
  const rim = cupRing(c, 0.03, 0.05, 28);
  if (rim.length >= 3) inkLine(q, 29331, rim, {weight: 0.9, color: '#8a949c', still: true});
  if (body.length >= 3) inkLine(q, 29332, body, {weight: 0.8, color: '#8a949c', still: true});
  const g = camPoint(c, [CUP_AT[0] + 0.02, 0.03, CUP_AT[2] + 0.025]), u = camUnit(c, CUP_AT);
  if (g) fillIf(q, 29333, '#ffffff', [[g[0] - 0.002 * u, g[1] - 0.012 * u], [g[0] + 0.002 * u, g[1] - 0.012 * u], [g[0] + 0.003 * u, g[1] + 0.012 * u], [g[0] - 0.001 * u, g[1] + 0.012 * u]]);
  // the glint at the lift: grows l 30-34, holds with a slow pulse, fades l 42-46 (before the l 46-58 highlight sweep)
  const k = smooth(ramp(L, 30, 34)) * (1 - smooth(ramp(L, 42, 46)));
  if (k > 0.01) {
    const w: V3 = [b.tip[0] + (b.top[0] - b.tip[0]) * 0.72 + b.side[0] * 0.003, b.tip[1] + (b.top[1] - b.tip[1]) * 0.72, b.tip[2] + (b.top[2] - b.tip[2]) * 0.72 + b.side[2] * 0.003];
    const gp = camPoint(c, w), gu = camUnit(c, w);
    if (gp) {
      const a = 0.011 * gu * k * (1 + 0.08 * Math.sin(L * 0.7)), r = a * 0.3, [x, y] = gp;
      fillIf(p.layer(0.95, 29968 * 3), 29968, '#ffffff', [[x, y - a], [x + r, y - r], [x + a, y], [x + r, y + r], [x, y + a], [x - r, y + r], [x - a, y], [x - r, y - r]]);
    }
  }
};
export const def: Shot22 = {
  id: 'B04-SH16', N, paper: DEMO_PAPER,
  cam: (L) => { const u = sine01(L / (N - 1)); return demoCam([0.12, 0.03, -0.04], lerp(0, -4, u), lerp(0.36, 0.32, u), -30, 1100, 1040, 0.05); },
  paint: (p, L, c) => {
    const lean = ramp(L, 20, 40);
    const child = {at: lerp3(CH0, CH1, lean), scale: 0.55, face: L < 46 ? 'suspicious' as const : 'surprised' as const, look: [0.25, 0.55] as [number, number], t: L / 30};
    const b = stripB(L);
    if (L < 6) {
      const a = lerpStrip(A_START, A_REST, smooth(ramp(L, 0, 6)));
      paintDemo(p, c, {stripA: a, tarnish: 0.6, child});
      paintCardAndStripB(p, c, b, L);
      paintBlots(p, c, a);
      repaintMitten(p, c, a);
      return;
    }
    const hand = L < 10 ? {at: track(L, [[6, gripOf(A_REST)], [10, gripOf(STRIP_B_CUP)]]), dir: 0.5} : {on: 'B' as const, dir: 0.45};
    paintDemo(p, c, {stripA: A_REST, tarnish: 0.6, stripB: b, hand, child});
    paintCardAndStripB(p, c, b, L);
    paintBlots(p, c, A_REST);
    if (L >= 46 && L <= 58) {
      // the highlight sweep: a white band 25 % of the strip long running tip -> top
      const x = 0.75 * ((L - 46) / 12), P = (u: number, s: number): V3 => [b.tip[0] + (b.top[0] - b.tip[0]) * u + b.side[0] * 0.0075 * s, b.tip[1] + (b.top[1] - b.tip[1]) * u, b.tip[2] + (b.top[2] - b.tip[2]) * u + b.side[2] * 0.0075 * s];
      const band = [P(x, -1), P(x + 0.25, -1), P(x + 0.25, 1), P(x, 1)].map((v) => camPoint(c, v));
      if (band.every(Boolean)) hardFill(p.layer(0.9, 29980 * 3), 29980, '#ffffff', band as Pt[]);
    }
    if (L >= 10) repaintMitten(p, c, b, 0.45);
    else if ('at' in hand && hand.at) { const pin = camPoint(c, hand.at); if (pin) paintMitten(p, pin, camUnit(c, hand.at), 0.5); }
  },
};
export const shot = makeShot(def);
