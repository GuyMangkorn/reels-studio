import {camMove, camMoveK, camOf} from '../../kit/cam-moves';
import {hardFill, washAt} from '../../kit/draw';
import type {Painter, Pt} from '../../kit/painter';
import {wp} from '../../kit/world';
import {camPoint, type YCam} from '../../kit/ycam';
import {CAR, FR_DONE, SAG_FULL, sagCam, windowPolys} from '../car';
import {box, paintBlock, paintWheelUnit} from '../cabin';
import {HANDS, paintDriverAt} from '../driver';
import {paintExterior, paintRain} from '../exterior';
import {Chip, EXPLAIN_TUFTS, flankFloorFor, paintFlankShade, paintNearShade, plateGlow, sm, wetPolys} from '../explain';
import {BranchLight, GlowLight, paintRouteGlow, type GlowPlate, type GlowStage} from '../glow';
import {TONE_EXPLAIN} from '../road';
import {makeShot} from '../shot';

// B04-SH10 · G822-930 · some gets in (L09). EDU-EP21-SHEETS-R1 shot block (SD02, SD13); Boss W5.2 BG3, 2026-11-16.
// Camera `camMove(at (0.4, 0.7, 0) -> (0.45, 0.95, 0.30), yaw 36->28 (R2), r 4.1->2.3, eye 0.65->1.25, f 880, hy 940, ease [0.25, 1])` over
// L0-107 (u = L / 107): starts exactly on SH06's end camera, holds to L27, then pushes in to the dash through the door glass.
// Hard cut into `TONE_EXPLAIN`, chip on at L0 (text final 2026-11-17); coat recall top-down L0-10 to SH06's full state (ridges, sill), pool full by
// L18. Cluster and radio drawn lit (diagram state, cyan 80 % since R2) L0-60, flicker L61-62 and L67-68, dark from L69 (SD13: a re-enactment inside
// the labelled explanatory state; the live dash stays dark). Inner branch (thin, <= 25 % of the coat's rim width) leaves the cowl at the windscreen
// base on "บางส่วน" L30, runs inward along the dash top to the cluster wiring by L51 ("เข้าไป"), fades L78-102. The outer coat stays on.
// DRIVER `facing +x`, view `right` held (as SH06), `neutral`, hands on the thighs, unlit. CAR21 sag 0.06 m and the FR damage as SH08 left
// it (Boss W5.2 BG4 opt-in, SD12): the body, glass, dash, DRIVER and the coat on the metal are drawn through the sagged camera `cb`
// (car.ts `sagCam`); the road, the near shade, the pool tint and the fresnel line stay on the road camera `c`. The sagged nose brought the
// lit bonnet into the caption band at L102-107 (p95 0.59), so the coat is cut at y 1165 for the whole shot (`GlowPlate.coatMaxY`).
// Boss W5.2f FX2 (EDU-EP21-SHEETS-R2 SD16, D-Q13, D-Q14): end yaw 34 -> 28 (measured with fx2-measure.ts: the cluster face centre sits 9-15 px
// clear of the A-pillar over L51-78 at 28, 2-5 px at 34; the sheet's fallback `at` +x moves it behind the pillar, so not used). The route
// still crosses the pillar's foot from every candidate (open question FX2-Q1 in build-notes).
// The branch is its own screen layer (glow.tsx `BranchLight`): the coat's hue at >= 0.7 of the coat's peak value, 5 px, clipped to the
// glass, with an arrival bloom r 20 px at the cluster L51-60. The diagram cluster and radio are cyan at 80 % with a bloom r 30 px on the
// dash top and the glass base that the flicker switches; she stays unlit.

export const CAM = camMove([[0.4, 0.7, 0], [0.45, 0.95, 0.3]], [36, 28], [4.1, 2.3], [0.65, 1.25], {f: 880, hy: 940, ease: [0.25, 1]});
const N = 108;
const camAt = (L: number): YCam => camOf(CAM, L / (N - 1));
/** Push progress 0..1 (the camera's own ease). */
const pushK = (L: number) => camMoveK(CAM, L / (N - 1));
/** Plate design along the push (Boss, recorded deviation): the push carries the lit flank and the pool through the caption band. The near
 *  flank under the height that projects at y 1120 falls into shade (coat cut softly there, `flankFloor`; 0 at L0-27, so the cut from SH06
 *  matches), and the pool's fresnel is pulled up to the band top over L27-52, the first half of the push (SH06's values to L27). */
const plateAt = (c: YCam, L: number): GlowPlate => {
  const g = plateGlow(c, pushK(L)), [f0, f1] = g.fresnel!, k = sm(L, 27, 52);
  return {...g, fresnel: [Math.min(f0, f0 + (1110 - f0) * k), f1 + (Math.min(f1, 1160) - f1) * k], flankFloor: flankFloorFor(sagCam(c, SAG_FULL), 1120), coatMaxY: 1165};
};

const stageAt = (L: number): GlowStage => ({roof: sm(L, 0, 5), run: sm(L, 0, 10), flank: sm(L, 3, 10), ridge: sm(L, 3, 10), sill: sm(L, 3, 10), pool: sm(L, 0, 18)});
/** Diagram light of the cluster and radio, 0..1 (1 = cyan 80 %, SHEETS-R2): lit L0-60, flicker L61-62 / L67-68, dark from L69. */
export const clusterLit = (L: number) => (L <= 60 ? 1 : L <= 62 ? 0.15 : L <= 66 ? 0.85 : L <= 68 ? 0.1 : 0);
/** Inner branch travel (L30-51) and level (fades L78-102). */
const branchAt = (L: number) => ({k: Math.min(1, Math.max(0, (L - 30) / 21)), level: 1 - sm(L, 78, 102), arrive: sm(L, 50, 53) * (1 - sm(L, 57, 61))});

const CLUSTER: [number, number, number][] = [[0.519, 0.9, 0.24], [0.519, 0.9, 0.52], [0.519, 1.04, 0.52], [0.519, 1.04, 0.24]];
const RADIO: [number, number, number][] = [[0.519, 0.82, -0.1], [0.519, 0.82, 0.1], [0.519, 0.94, 0.1], [0.519, 0.94, -0.1]];

/** The dash seen from outside through the glass: dash top, cluster hood, wheel, then the diagram light on the cluster and the radio. */
const paintDash = (p: Painter, c: YCam, lit: number) => {
  const T = TONE_EXPLAIN, S = 46000;
  const top = wp(c, [[0.52, 1.0, -0.79], [1.03, 0.93, -0.79], [1.03, 0.93, 0.79], [0.52, 1.0, 0.79]]);
  if (top.length >= 3) hardFill(p, S, T('#3a4048'), top);
  paintBlock(p, c, S + 10, box(0.5, 0.7, 1.0, 1.075, 0.22, 0.54), CAR.dash, T);
  paintWheelUnit(p, c, S + 20, T);
  if (lit <= 0) return;
  // diagram state: the instruments drawn lit over the hood (an x-ray read inside the labelled explanatory state, SD13)
  [CLUSTER, RADIO].forEach((k, i) => {
    const q = wp(c, k);
    if (q.length >= 3) washAt(p, S + 40 + i, CAR.dashGlow, 204 * lit, q, 0.25, 0.2);
  });
};

/** Screen part of the diagram light: a soft cyan bloom r 30 px on the dash top at the cluster (it spills onto the inside of the glass base)
 *  and a smaller one on the radio, seen through the glass only (clipped to the near side windows and the windscreen, so it does not whiten
 *  the lit door top or the pillar). SHEETS-R2 D-Q14: the flicker L61-68 switches it (it follows `lit`). */
const DashBloom = ({c, lit}: {c: YCam; lit: number}) => {
  if (lit <= 0) return null;
  const m = camPoint(c, [0.519, 1.0, 0.38]), r = camPoint(c, [0.519, 0.9, 0]);
  if (!m) return null;
  const glass = [...windowPolys('glassR'), ...windowPolys('windscreen')].map((w) => wp(c, w)).filter((q) => q.length >= 3);
  const d = (q: Pt[]) => `M${q.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`;
  const rg = (id: string, [x, y]: Pt, rad: number) => <radialGradient id={id} cx={x} cy={y} r={rad} gradientUnits="userSpaceOnUse">
    <stop offset="0" stopColor={CAR.dashGlow} stopOpacity={1} /><stop offset="0.45" stopColor={CAR.dashGlow} stopOpacity={0.55} /><stop offset="1" stopColor={CAR.dashGlow} stopOpacity={0} /></radialGradient>;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity: 0.85 * lit}}>
      <defs><clipPath id="ep21-sh10-gl">{glass.map((q, i) => <path key={i} d={d(q)} />)}</clipPath>
        {rg('ep21-sh10-bm', m, 30)}{r && rg('ep21-sh10-br', r, 18)}</defs>
      <g clipPath="url(#ep21-sh10-gl)">
        <circle cx={m[0]} cy={m[1]} r={30} fill="url(#ep21-sh10-bm)" />
        {r && <circle cx={r[0]} cy={r[1]} r={18} fill="url(#ep21-sh10-br)" opacity={0.7} />}
      </g>
    </svg>
  );
};

export const shot = makeShot({
  id: 'B04-SH10', N, paper: '#2c333c',
  paint: (p, L, G) => {
    const c = camAt(L), cb = sagCam(c, SAG_FULL), t = G / 30, st = stageAt(L), PLATE = plateAt(c, L), lit = clusterLit(L);
    paintExterior(p, c, {t, tone: TONE_EXPLAIN, puddles: true, tufts: EXPLAIN_TUFTS,
      car: {bonnetBehind: true, sag: SAG_FULL, frDamage: FR_DONE, inside: (q, cc) => { paintDash(q, cc, lit); paintDriverAt(q, cc, {face: 'neutral', hands: HANDS.thighs}, {t, view: 'right'}); }},
      underCar: (q, cc) => paintRouteGlow(q, cc, {phase: 'road', under: true, stage: st, plate: PLATE}),
      overCar: (q, cc) => paintRouteGlow(q, sagCam(cc, SAG_FULL), {phase: 'road', stage: st, plate: PLATE})});
    paintFlankShade(p, cb, 1, flankFloorFor(cb, 1120));
    paintNearShade(p, c, 1);
    paintRain(p, t, {count: 150, color: '#9aa6b0'});
  },
  overlay: (L) => {
    const c = camAt(L), cb = sagCam(c, SAG_FULL);
    return <>
      <DashBloom c={cb} lit={clusterLit(L)} />
      <GlowLight c={cb} wet={wetPolys(c)} stage={stageAt(L)} plate={plateAt(c, L)} />
      <BranchLight c={cb} {...branchAt(L)} />
      <Chip o={1} />
    </>;
  },
});
