import {camMove, camOf} from '../../kit/cam-moves';
import {washAt} from '../../kit/draw';
import {Flash} from '../../kit/glow';
import type {V3} from '../../kit/space';
import {wp} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {Bolt, BONNET_EDGE, boltEnv, boltFull, boltPaths, paintStrikeRim, ROOF_EDGE_NEAR, type BoltEnv, type BoltOpts} from '../bolt';
import {beltLipPts, FR_DONE, ghQuad, SAG_FULL, sagCam} from '../car';
import {HANDS, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {Chip, flankFloorFor, paintFlankShade, paintNearShade, plateGlow, sm} from '../explain';
import {flankPart, GLOW, GlowLight, paintRouteGlow, type GlowPlate, type GlowStage} from '../glow';
import {toneMix} from '../road';
import {makeShot} from '../shot';

// B05-SH13 · G1105-1320 · the metal is the route (L12 + hold). EDU-EP21-SHEETS-R1 shot block (SD09); Boss W5.2 BG3, 2026-11-16.
// Camera, two segments (one lens, f 1000, hy 800): A `camMove(at (0.42, 1.40, 0.70) -> (0.2, 0.7, 0.2), yaw 30->42, r 0.9->4.0,
// eye 1.5->0.9, pitch -8->-2, ease [0.023, 0.58])` on u = L / 215 (the ease runs L5-125, over L12); B L125-215 r 4.0 -> 4.08 linear (a 2 %
// settle), the rest held. Close on the wet roof edge and A-pillar with her face through the glass, pulling back to the whole car.
// Glow echo on "ทางให้ไฟผ่านรอบตัวคุณ": `TONE_EXPLAIN` at 40 % L73-135 (6 f ramps), chip L73-135 (text final 2026-11-17), a faint coat (SH06's
// coat at 0.5 since SHEETS-R2 D-Q15; was 0.25) runs once roof -> sill L76-110 and fades by L130 (no pool).
// SHEETS-R4 (D-U2, SD20; Boss FX4, 2026-11-17): two live end strikes after the echo and chip are gone, through `cb`: E1 `single` at L143
// (G1248) on the near rear roof edge, E2 `double` at L161 (G1266, restrike L164-165) on the bonnet top; kit Flash under each bolt; cold rim
// and lit rain on the full frames only (D-U3); DRIVER flinch (shoulders up 3 cm, head back 1.5 cm) on each, `surprised` L143-158 and
// L161-178, `neutral` from L179 with one breath out (shoulders down 2 cm L179-191, held). Rain 100 % -> 55 % and the low horizon band to
// #b8a48a (road.ts `warm`) L167-215 (R3: both from L95). DRIVER `facing +x`, view `right` held (as SH06/SH10), `neutral`, hands on the thighs; she never smiles.
// CAR21 sag 0.06 m and the FR damage as SH08 left it (Boss W5.2 BG4 opt-in, SD12): the body, glass, DRIVER, the coat and the body shades
// are drawn through the sagged camera `cb` (car.ts `sagCam`); the road, the near-ground and wheel shades stay on the road camera `c`.

const A = camMove([[0.42, 1.4, 0.7], [0.2, 0.7, 0.2]], [30, 42], [0.9, 4.0], [1.5, 0.9], {f: 1000, hy: 800, pitch: [-8, -2], ease: [0.023, 0.58]});
const B = camMove([0.2, 0.7, 0.2], [42, 42], [4.0, 4.08], 0.9, {f: 1000, hy: 800, pitch: [-2, -2]});
const N = 215;
const HOLD = 125;
export const camAt = (L: number): YCam => (L < HOLD ? camOf(A, L / N) : camOf(B, (L - HOLD) / (N - 1 - HOLD)));

/** Echo envelope 0..1: in L73-79, out L129-135. */
const echo = (L: number) => sm(L, 73, 79) * (1 - sm(L, 129, 135));
/** The faint coat's run, roof -> sill L76-110, at 0.5 of SH06's coat (SHEETS-R2 D-Q15, Boss FX2; was 0.25), faded out L110-130. */
const stageAt = (L: number): GlowStage => ({roof: sm(L, 76, 86), run: sm(L, 76, 100), flank: sm(L, 86, 104), sill: sm(L, 100, 110), pool: 0});
const coatLevel = (L: number) => 0.5 * GLOW.level * (1 - sm(L, 110, 130));
/** Plate design (Boss, as SH10): the near flank under the height that projects at y FLOOR_Y is in shade, so the close door of the opening and
 *  the wheels of the pull-back stay out of the caption band; the near verge from z 2.2 in shade (the hold's verge sat at the band limit). */
const FLOOR_Y = 1140;
const plateAt = (c: YCam): GlowPlate => ({...plateGlow(c), flankFloor: flankFloorFor(sagCam(c, SAG_FULL), FLOOR_Y)});
/** The close opening (L0-45): the near door top (its lip and the upper door with the wet stripe) fills the caption band, so it sits in the
 *  shade of the roof edge, easing out as the pull-back lifts it clear (band p95 0.61-0.81 without). */
const OPEN_SHADE = (L: number) => 1 - sm(L, 25, 45);
/** The near window's bottom frame and white trim (the greenhouse below the glass, v 0-0.07): in the band at L0-20. */
const SILL_TRIM = ghQuad('glassR', 0, 1, 0, 0.07);
/** The near wheels below the flank face (rims in the band around L73, p95 0.57). */
const WHEELS: [number, number, number][] = [[-2.3, 0, 0.87], [2.3, 0, 0.87], [2.3, 0.4, 0.87], [-2.3, 0.4, 0.87]];

// R4 end strikes (car body coordinates; projected through `cb`). T1: the roof's near edge is z 0.64 at y 1.49, T1 0.02 m inside it. T2: the
// bonnet top runs (1.05, 0.92) -> (1.98, 0.84) (car.ts PROF), so at x 1.60 it is y 0.873; z 0.70 (sheet est 0.55): 0.15 m inside the near
// bonnet edge, so the flare core (r 18) overlaps the painted edge by >= 6 px (at z 0.55 it was 5.8 px; the bonnet top is a ~5 px sliver here).
const W = (...p: [number, number, number][]): V3[] => p;
export const E1 = 143, E2 = 161;
export const T1: V3 = [-0.75, 1.49, 0.62];
export const T2: V3 = [1.6, 0.873, 0.7];
export const BOLT1: BoltOpts = {
  top: 70, seed: 43100,
  path: W(T1, [-0.66, 1.95, 0.6], [-0.84, 2.45, 0.55], [-0.55, 2.95, 0.5], [-0.66, 3.45, 0.4], [-0.35, 4.0, 0.3], [-0.45, 4.6, 0.2], [-0.2, 5.4, 0.1]),
  branches: [W([-0.55, 2.95, 0.5], [-1.2, 2.25, 0.55], [-1.4, 1.95, 0.5]), W([-0.45, 4.6, 0.2], [-0.9, 3.85, 0.3], [-1.25, 3.55, 0.3])],
};
export const BOLT2: BoltOpts = {
  top: 70, seed: 43600,
  path: W(T2, [1.7, 1.3, 0.55], [1.55, 1.75, 0.5], [1.85, 2.25, 0.45], [1.75, 2.8, 0.4], [2.05, 3.4, 0.3], [1.95, 4.0, 0.2], [2.3, 4.8, 0.1]),
  branches: [W([1.85, 2.25, 0.45], [2.25, 2.05, 0.45], [2.55, 1.9, 0.4]), W([2.05, 3.4, 0.3], [2.5, 3.15, 0.3], [2.8, 3.05, 0.25]), W([1.95, 4.0, 0.2], [2.45, 3.95, 0.2], [2.85, 3.75, 0.15])],
};
export const env1 = (L: number): BoltEnv => boltEnv('single', L - E1);
export const env2 = (L: number): BoltEnv => boltEnv('double', L - E2);
/** Kit Flash (R4): 0.30 on E1 L143-144 -> 0 by L148; 0.35 on E2 L161-162, 0.12 L163, 0.30 L164-165 -> 0 by L170. */
export const flashLevel = (L: number) => (L >= E1 && L < 148 ? (L <= 144 ? 0.3 : (0.3 * (148 - L)) / 4)
  : L >= E2 && L < 170 ? (L <= 162 ? 0.35 : L === 163 ? 0.12 : L <= 165 ? 0.3 : (0.3 * (170 - L)) / 5) : 0);
/** One flinch: rise over 3 frames from `at`, eased back to rest by `back`. */
const flinch = (L: number, at: number, back: number) => (L < at ? 0 : L <= at + 3 ? sm(L, at, at + 3) : 1 - sm(L, at + 3, back));
/** DRIVER in the hold (R4): flinch on E1 (L143-146, back by L155) and E2 (L161-164, back by L181); breath out L179-191. */
export const driverAt = (L: number) => {
  const k = Math.max(flinch(L, E1, 155), flinch(L, E2, 181));
  const face = (L >= E1 && L <= 158) || (L >= E2 && L <= 178) ? 'surprised' as const : 'neutral' as const;
  return {face, hands: HANDS.thighs, lift: 0.03 * k - 0.02 * sm(L, 179, 191), back: 0.015 * k};
};

export const shot = makeShot({
  id: 'B05-SH13', N, paper: '#262e38',
  paint: (p, L, G) => {
    const c = camAt(L), cb = sagCam(c, SAG_FULL), t = G / 30, T = toneMix(0.4 * echo(L)), st = stageAt(L), lv = coatLevel(L), warm = sm(L, 167, 215), plate = plateAt(c);
    const lit1 = boltFull(env1(L)), lit2 = boltFull(env2(L));
    paintExterior(p, c, {t, tone: T, warm,
      car: {bonnetBehind: true, sag: SAG_FULL, frDamage: FR_DONE, inside: (q, cc) => paintDriverAt(q, cc, driverAt(L), {t, view: 'right'})},
      ...(L >= 76 && lv > 0 ? {overCar: (q: Parameters<typeof paintRouteGlow>[0], cc: YCam) => paintRouteGlow(q, sagCam(cc, SAG_FULL), {phase: 'road', stage: st, plate, level: lv})} : {})});
    const o = OPEN_SHADE(L);
    if (o > 0) [flankPart(cb, 0.96, false), beltLipPts(1), SILL_TRIM].forEach((q, i) => { const w = wp(cb, q); if (w.length >= 3) washAt(p, 35430 + i, '#12161c', (i === 2 ? 190 : 150) * o, w, i === 2 ? 0.04 : 0.12, 0.25); });
    paintFlankShade(p, cb, 1.6, flankFloorFor(cb, FLOOR_Y));
    { const w = wp(c, WHEELS); if (w.length >= 3) washAt(p, 35435, '#12161c', 144, w, 0.12, 0.25); }
    paintNearShade(p, c, 1, 2.2);
    if (lit1) paintStrikeRim(p, cb, camPoint(cb, T1), 1, ROOF_EDGE_NEAR);
    if (lit2) paintStrikeRim(p, cb, camPoint(cb, T2), 1, BONNET_EDGE);
    const rain = Math.round(220 * (1 - 0.45 * sm(L, 167, 215)));
    paintRain(p, t, lit1 || lit2 ? {count: rain, color: '#eef4ff'} : {count: rain});
  },
  overlay: (L) => {
    const c = camAt(L), cb = sagCam(c, SAG_FULL), lv = coatLevel(L), f = flashLevel(L), e1 = env1(L), e2 = env2(L);
    return <>
      {L >= 76 && lv > 0 && <GlowLight c={cb} stage={stageAt(L)} plate={plateAt(c)} level={lv} ids="ep21-sh13" />}
      <Chip o={echo(L)} />
      {f > 0 && <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}><Flash level={f} /></svg>}
      {(e1.leader > 0 || e1.stroke > 0) && <Bolt b={boltPaths(cb, BOLT1)} env={e1} w={{core: [7, 5], body: 19, halo: 50, bCore: [3, 1], bBody: 8, bHalo: 24}} flare={{r: 16, glow: 70}} id="ep21-sh13-e1" />}
      {(e2.leader > 0 || e2.stroke > 0) && <Bolt b={boltPaths(cb, BOLT2)} env={e2} w={{core: [8, 6], body: 20, halo: 56, bCore: [3, 1], bBody: 8, bHalo: 24}} flare={{r: 18, glow: 80}} id="ep21-sh13-e2" />}
    </>;
  },
});
