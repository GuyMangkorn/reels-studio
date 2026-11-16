import {useId} from 'react';
import {Spot, GLOW_PEAK} from '../kit/glow';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';

// EDU-EP19 scent glow (brief N3, VD04 R2): a world-anchored warm-white halo on a print or mat plus scent curls; the order is the halo SIZE
// (steps S1-S5) at one opacity 0.26 (<= GLOW_PEAK). SVG, screen blend in the scene. `PrintGlow` (opacity = level) is the W2.4 comp-card swatch;
// the nose-driven ramp (6 f in, 12 f out, reading radius) is W5. Kit promotion on a second use (ENV-P01).

export const GLOW_COLOR = '#fff1c8';

/** One print's glow: halo radius `r` px at (x, y), `rise` px = 0.15 m in the shot, `level` 0..GLOW_PEAK, `seed` varies the curl. */
export const PrintGlow = ({x, y, r, rise, level, seed = 0}: {x: number; y: number; r: number; rise: number; level: number; seed?: number}) => {
  const a = Math.min(level, GLOW_PEAK), sway = (seed % 2 ? 1 : -1) * r * 0.22;
  const curl = (dx: number, k: number) => `M ${x + dx} ${y} C ${x + dx + sway} ${y - rise * 0.35}, ${x + dx - sway} ${y - rise * 0.65}, ${x + dx + sway * 0.6 * k} ${y - rise}`;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      <Spot x={x} y={y} r={r} level={a} color={GLOW_COLOR} />
      <Spot x={x} y={y} r={r * 0.45} level={a} color={GLOW_COLOR} />
      {[-0.25, 0.2].map((f, i) => (
        <path key={i} d={curl(r * f, i ? -1 : 1)} stroke={GLOW_COLOR} strokeOpacity={Math.min(1, a * 2.6)} strokeWidth={Math.max(1.5, r * 0.06)} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------ world-anchored layer (W3, LF02 / LF05)
/** VD04 R2 size ladder (user, 2026-11-15: size, not opacity): halo radius = r0 x step, S1..S5. */
export const GLOW_STEPS = [0.4, 0.55, 0.7, 0.85, 1] as const;
/** The one opacity every lit spot draws at (VD04 R2), under GLOW_PEAK. */
export const GLOW_OPACITY = 0.26;
/** Ground pool for the size ladder: flat at `level` to 55 % of `r`, then fading to 0 at `r`, so the pool has a readable edge and its SIZE
 *  carries the step (a linear kit `Spot` fades from the centre and its size does not read at 270 px; W3.3 crop check). */
const Pool = ({r, level}: {r: number; level: number}) => {
  const id = useId(), a = Math.min(level, GLOW_PEAK);
  return (
    <>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={r}>
          <stop offset="0" stopColor={GLOW_COLOR} stopOpacity={a} />
          <stop offset="0.55" stopColor={GLOW_COLOR} stopOpacity={a * 0.85} />
          <stop offset="1" stopColor={GLOW_COLOR} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={0} cy={0} r={r} fill={`url(#${id})`} />
    </>
  );
};
/** Sheet level -> size step index 0..4 (S1..S5): 0.08 -> S1, 0.10-0.12 -> S2, 0.14-0.17 -> S3, 0.23-0.26 -> S4, 0.28-0.30 -> S5. */
export const glowStep = (level: number): number => (level < 0.09 ? 0 : level < 0.13 ? 1 : level < 0.2 ? 2 : level < 0.27 ? 3 : 4);
/** One glowing spot in space F: ground centre, the sheet level (sets the size step), base radius r0 in metres (print 0.22, mat 0.4), and
 * `k` 0..1+ the radius ramp (6 f in, 12 f out) times any swell (B01-SH04 +15 %); absent = 1. */
export type GlowSpot = {at: V3; level: number; r?: number; k?: number; seed?: number};
/**
 * The scent-glow layer over the painted frame (VD04 R2): each spot is a foreshortened ground halo plus an upright core and two scent curls,
 * projected with the shot camera `cam`. The order is carried by SIZE: radius r0 x GLOW_STEPS[step] x k, curl height 0.06-0.15 m with the step,
 * at the one opacity GLOW_OPACITY. Screen blend.
 */
export const GlowLayer = ({cam, spots}: {cam: YCam; spots: GlowSpot[]}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {spots.map((s, i) => {
      const k = s.k ?? 1;
      if (s.level <= 0.001 || k <= 0.01) return null;
      const q = camPoint(cam, s.at);
      if (!q) return null;
      const st = glowStep(s.level), r0 = s.r ?? 0.22, rw = r0 * GLOW_STEPS[st] * k, u = camUnit(cam, s.at), r = rw * u;
      const a = camPoint(cam, [s.at[0], 0, s.at[2] - rw]), b = camPoint(cam, [s.at[0], 0, s.at[2] + rw]);
      const squash = a && b ? Math.max(0.28, Math.min(1, Math.abs(b[1] - a[1]) / (2 * rw * u))) : 0.4;
      return (
        <g key={i} style={{mixBlendMode: 'screen'}}>
          <g transform={`translate(${q[0]} ${q[1]}) scale(1 ${squash})`}><Pool r={r * 1.3} level={GLOW_OPACITY} /></g>
          <PrintGlow x={q[0]} y={q[1]} r={r * 0.75} rise={(0.06 + 0.0225 * st) * k * u} level={GLOW_OPACITY} seed={s.seed ?? i} />
        </g>
      );
    })}
  </svg>
);
