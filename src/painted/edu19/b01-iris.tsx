import type {ReactNode} from 'react';
import {Spot} from '../kit/glow';
import type {Painter} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {GLOW_COLOR, GlowLayer, type GlowSpot} from './glow';
import {dogClock, ease, frac, lerp, lerp3} from './motion19';
import {clipPainter, paintSoi, SOI, VIG} from './soi';
import {paintFieldShot, sheetCam, sheetMove, type FieldShotDef} from './stage';
import {glowRamp, printZ, ROUND1_FIVE, trailPrints} from './trail';

// EDU-EP19 B01 iris chain (Boss W5.3, 2026-11-15; EDU-EP19-SHEETS-R3, brief N8): B01-SH04 (the glow ladder, iris-in l 71-80) -> B01-SH05 (the L03b soi
// inset, iris-out l 58-67) -> B01-SH06 (the trot). Each shot is its own plate with a hard cut; the irises are painted inside the plates with the
// in-canvas circle mask (`clipPainter`, one canvas per page), so B01-SH05 needs SH04's held end frame and SH06's first frame. Those two field
// shots therefore live here (shared by the three shot files, so a change to them repaints all three: honest, since SH05 shows both).

// ------------------------------------------------------------------------------------------------ B01-SH04 · G 252-332 (80 f)
// Raised three-quarter over the five lit prints (R2, VD17/FR4: eye 1.2, pitch -10, yaw -34 -> -26), the ladder climbing far-left S1 -> near-right S5;
// on "น่าจะจางกว่า" (l 44) every halo swells one notch (+15 %). The dog: head low sniffing (front, `headLow`) to l 50, lifts its head l 50-58, turns
// its head toward the tree l 58-66, cut-on-turn to right profile at l 66, first step toward the tree l 74-80 (0.15 m on the gait clock).
const N4 = 80;
const M4 = sheetMove([[0.1, 0.25, -0.1], [0.2, 0.25, -0.1]], [-34, -26], [2.7, 2.45], 1.2, {f: 1100, hy: 690, pitch: [-10, -10]});
const DOG4: V3 = [0.25, 0, -0.12];
export const B01_SH04: FieldShotDef = {
  id: 'B01-SH04', N: N4,
  cam: (L) => sheetCam(M4, L, N4),
  state: (L) => {
    const lift = ease(frac(L, 50, 58)), turn = ease(frac(L, 58, 66)), s = 0.15 * ease(frac(L, 74, 80));
    const pose = L >= 66
      ? {view: 'right' as const, state: 'stand' as const, ...(L >= 74 ? {walk: dogClock(s), stride: Math.sin(Math.PI * Math.min(1, frac(L, 74, 80) * 1.2))} : {})}
      : {view: 'front' as const, state: 'stand' as const, sniff: 0.85 * (1 - lift), headLow: lift < 0.5, look: 0.7 * turn};
    return {sun: 'B01', t: L / 30, prints: trailPrints(), stack: false, dog: {at: [DOG4[0] + s, 0, DOG4[2]], pose}, line: [1.8, 1.4, -2.2]};
  },
  // Round-1 size ladder S1-S5; on "น่าจะจางกว่า" (l 44) every halo swells one notch, +15 % radius, order kept (sheet R2).
  glow: (L) => ROUND1_FIVE.map(({x, level}, k) => ({at: [x, 0, printZ(x)], level, k: L >= 44 ? 1.15 : 1, seed: k})),
};

// ------------------------------------------------------------------------------------------------ B01-SH06 · G 399-446 (47 f)
// Truck with the dog (R2: eye 1.1, pitch -7, f 1200). The dog trots in right profile from (1.0, 0, 0) to (4.9, 0, 0.2) (2.5 m/s; R3: 47 f, path
// unchanged) off the line, on the run gait's distance clock (the planted paws hold). Prints ahead light within 1.3 m of the nose as it passes, at
// the top step S5 (continuing the ladder); the round-1 five stay lit behind. GIRL's shoulder at GP, pulls back behind the trunk at l 27.
const N6 = 47;
const M6 = sheetMove([[1.8, 0.4, 0], [5.2, 0.4, 0]], [66, 72], [3.4, 2.7], 1.1, {f: 1200, hy: 720, pitch: [-7, -7]});
const dogX6 = (L: number) => 1.0 + (3.9 * Math.min(N6, Math.max(0, L))) / N6;
/** Nose ahead of the ground point in the trot (head up), m. */
const TROT_NOSE = 0.55;
const PEEK: V3 = [6.45, 0, -0.05], HIDE: V3 = [6.75, 0, -0.75];
const AHEAD = trailPrints().filter((q) => q.at[0] > 1.25);
export const B01_SH06: FieldShotDef = {
  id: 'B01-SH06', N: N6,
  cam: (L) => sheetCam(M6, L, N6),
  state: (L) => {
    const s = dogX6(L) - 1.0, z = 0.2 * (L / N6);
    return {sun: 'B01', t: L / 30, prints: trailPrints(), stack: false,
      dog: {at: [dogX6(L), 0, z], pose: {view: 'right', state: 'stand', gait: 'run', walk: dogClock(s, 'run'), wag: 0.6}},
      girl: {at: lerp3(PEEK, HIDE, ease(frac(L, 27, 35))), view: 'front', pose: 'P43', face: 'smug', bias: 0.2, fig: {head: 'front'}}};
  },
  glow: (L) => [
    ...ROUND1_FIVE.map(({x, level}, k): GlowSpot => ({at: [x, 0, printZ(x)], level, k: 1, seed: k})),
    ...AHEAD.map((q): GlowSpot => {
      // The nose reaches 1.3 m short of the print at frame Lon (linear path); ramp in 6 f from there (VD04).
      const Lon = ((q.at[0] - 1.3 - TROT_NOSE - 1.0) / 3.9) * N6;
      return {at: q.at, level: 0.3, k: glowRamp(L / 30, Lon / 30, 1), seed: 20 + q.i};
    }),
  ],
};

// ------------------------------------------------------------------------------------------------ B01-SH05 soi inset (space S)
/** The soi camera (trucking behind YOU toward the stall) at SH05 frame L of 67. */
const N5 = 67;
const M5 = sheetMove([[0, 0.9, 0], [2.2, 0.9, 0]], [90, 86], [2.4, 2.2], 1.3, {f: 900, hy: 760});
export const soiCam = (L: number) => sheetCam(M5, L, N5);
const walkX = (L: number) => 2.2 * Math.min(1, Math.max(0, L) / N5);
export const paintSoiAt = (p: Painter, L: number, r: number) =>
  paintSoi(clipPainter(p, VIG.cx, VIG.cy, r), soiCam(L), {t: Math.max(0, L) / 30, walkX: walkX(L), sniff: Math.min(1, Math.max(0, (L - 52) / 6))});
/** SH04's frame held behind the inset (sheet: the SH04 end frame, dimmed to 55 %). */
export const BACK_L = 79;
/** Radius that covers the whole 1080 x 1920 frame from the vignette centre (540, 760). */
export const FULL_R = Math.ceil(Math.hypot(540, 1920 - VIG.cy)) + 12;

/** Dim the whole frame to `1 - a` (a dark flat at alpha `a`, VIG.dim at full). */
export const dimFrame = (p: Painter, a: number) => { if (a > 0.001) p.layer(a, 77000).flat('#14161e', [[-10, -10], [1090, -10], [1090, 1930], [-10, 1930]]); };

/** Field painted inside the circle `r` (iris-out into SH06). */
export const paintFieldInCircle = (p: Painter, def: FieldShotDef, L: number, r: number) => paintFieldShot(clipPainter(p, VIG.cx, VIG.cy, r), def.cam(L), def.state(L));

/** The smell curl from the wok to YOU's head (same drawing as the print curls), doubled in width from l 55 (the measured anchor), and the bulb glow. */
export const Curl = ({L}: {L: number}) => {
  const c = soiCam(L), w = camPoint(c, SOI.wok), u = camUnit(c, SOI.wok);
  const head = camPoint(c, [walkX(L) + 0.1, 1.62, 0.05]);
  if (!w || !head) return null;
  const thick = L >= 55 ? 2 : 1 + Math.max(0, (L - 40) / 15) * 0.6, sw = Math.max(2.5, 0.02 * u) * thick;
  const d = (k: number) => {
    const ox = k * 0.06 * u, oy = k * 0.05 * u;
    return `M ${w[0] + ox} ${w[1] - 4} C ${w[0] - 0.3 * u + ox} ${w[1] - 0.5 * u}, ${w[0] + 0.25 * u} ${w[1] - 0.9 * u + oy}, ${(w[0] + head[0]) / 2} ${Math.min(w[1], head[1]) - 0.35 * u + oy} S ${head[0] + 40} ${head[1] - 30 + oy}, ${head[0] + 6} ${head[1] + 10 + oy}`;
  };
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <Spot x={camPoint(c, SOI.bulb)?.[0] ?? 0} y={camPoint(c, SOI.bulb)?.[1] ?? 0} r={0.9 * camUnit(c, SOI.bulb)} level={0.3} color="#ffd58a" />
      {[-1, 0, 1].map((k) => <path key={k} d={d(k)} stroke={GLOW_COLOR} strokeOpacity={0.55 - Math.abs(k) * 0.15} strokeWidth={sw * (1 - Math.abs(k) * 0.3)} strokeLinecap="round" fill="none" />)}
    </g>
  );
};

const mask = (r: number, outside: boolean) => {
  const g = outside ? `radial-gradient(circle at ${VIG.cx}px ${VIG.cy}px, transparent ${r}px, black ${r + 1}px)` : `radial-gradient(circle at ${VIG.cx}px ${VIG.cy}px, black ${r}px, transparent ${r + 1}px)`;
  return {WebkitMaskImage: g, maskImage: g};
};
/**
 * Iris overlay: `outside` glow layer (masked to outside the circle, at opacity `outOp`), `inside` SVG content clipped to the circle, an `insideGlow`
 * layer masked to the inside, and the cream ring (10 px) at radius r. `id` keeps the clip id unique per shot.
 */
export const IrisOverlay = ({id, r, outside, outOp = 1, inside, insideGlow}: {id: string; r: number; outside?: {cam: YCam; spots: GlowSpot[]}; outOp?: number; inside?: ReactNode; insideGlow?: {cam: YCam; spots: GlowSpot[]}}) => (
  <>
    {outside && <div style={{position: 'absolute', inset: 0, opacity: outOp, ...mask(r + VIG.ring, true)}}><GlowLayer cam={outside.cam} spots={outside.spots} /></div>}
    {insideGlow && r > 1 && <div style={{position: 'absolute', inset: 0, ...mask(r, false)}}><GlowLayer cam={insideGlow.cam} spots={insideGlow.spots} /></div>}
    {r > 1 && (
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs><clipPath id={`edu19-vig-${id}`}><circle cx={VIG.cx} cy={VIG.cy} r={r} /></clipPath></defs>
        {inside && <g clipPath={`url(#edu19-vig-${id})`}>{inside}</g>}
        {r < FULL_R - 12 && <circle cx={VIG.cx} cy={VIG.cy} r={r + VIG.ring / 2} fill="none" stroke="#f4ead2" strokeWidth={VIG.ring} />}
      </svg>
    )}
  </>
);

/** Iris-in radius over SH04 l 71-80 (9 f, ease-out): 0 -> VIG.r, reached at SH05 l 0. */
export const irisIn = (L: number) => VIG.r * (1 - (1 - frac(L, 71, 80)) ** 2);
/** Iris-out radius over SH05 l 58-67 (9 f, ease-in): VIG.r -> FULL_R, the hard cut to SH06 at l 67. */
export const irisOut = (L: number) => lerp(VIG.r, FULL_R, frac(L, 58, 66) ** 2);
