import {useId} from 'react';
import {hash} from './hash';

// Remotion glow layers for painted shots (VD02). p5.brush cannot glow, so light is SVG drawn inside a `CameraLayer`
// in painted-world coordinates (it follows the shot camera) with a screen blend. Peak opacity stays <= 0.3 except the
// lightning flash (<= 0.85 for a few frames). Every value is a function of the shot clock `tl`.

export const GLOW_PEAK = 0.3;

/** Slanted sun shafts from the surface, each breathing on its own phase, fading to 0 by `fadeY` (keep above the caption band). */
export const Shafts = ({tl, xs, fadeY = 820, peak = GLOW_PEAK, slant = 260, shift = 0}: {
  tl: number; xs: number[]; fadeY?: number; peak?: number; slant?: number; shift?: number;
}) => {
  const id = useId();
  return (
    <>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="-20" x2="0" y2={fadeY}>
          <stop offset="0" stopColor="#d8fff0" stopOpacity={peak} />
          <stop offset="0.55" stopColor="#9fe0d0" stopOpacity={peak * 0.3} />
          <stop offset="1" stopColor="#9fe0d0" stopOpacity={0} />
        </linearGradient>
      </defs>
      {xs.map((x, i) => {
        const o = 0.55 + 0.45 * Math.sin(tl * 1.1 + i * 2.3);
        const w = 50 + hash(i + 900) * 70;
        const sx = x + shift + 20 * Math.sin(tl * 0.5 + i);
        const k = slant * (fadeY + 20) / 1120;
        return <polygon key={x} points={`${sx},-20 ${sx + w},-20 ${sx + w + k},${fadeY} ${sx + k * 0.7},${fadeY}`} fill={`url(#${id})`} opacity={o} />;
      })}
    </>
  );
};

/** Lightning flash: bright at the top, <= 0.1 * level by `fadeY` (the caption band top), 0 beyond. */
export const Flash = ({level, fadeY = 860, width = 1080}: {level: number; fadeY?: number; width?: number}) => {
  const id = useId();
  if (level <= 0) return null;
  return (
    <>
      <defs>
        <linearGradient id={`${id}v`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={fadeY + 240}>
          <stop offset="0" stopColor="#dce8ff" stopOpacity={0.85 * level} />
          <stop offset={(fadeY * 0.55) / (fadeY + 240)} stopColor="#9fb6dc" stopOpacity={0.35 * level} />
          <stop offset={fadeY / (fadeY + 240)} stopColor="#7f9cc8" stopOpacity={0.1 * level} />
          <stop offset="1" stopColor="#3a4c70" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={width + 400} height={fadeY + 440} fill={`url(#${id}v)`} />
    </>
  );
};

/** Soft pool of light on a point (the B04 feature spot). */
export const Spot = ({x, y, r, level = GLOW_PEAK, color = '#fff2cc'}: {x: number; y: number; r: number; level?: number; color?: string}) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={r}>
          <stop offset="0" stopColor={color} stopOpacity={Math.min(level, GLOW_PEAK)} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
    </>
  );
};

/** Rising bubbles from a source point (regulator), deterministic per `seed`; SVG because small p5 circles render square. */
export const Bubbles = ({tl, x, y, seed = 0, count = 14, rise = 520, level = GLOW_PEAK}: {
  tl: number; x: number; y: number; seed?: number; count?: number; rise?: number; level?: number;
}) => (
  <g>
    {Array.from({length: count}, (_, i) => {
      const period = 2.2 + hash(seed + i * 3) * 1.4;
      const u = ((tl / period + hash(seed + i * 3 + 1)) % 1 + 1) % 1;
      const by = y - u * rise;
      const bx = x + 18 * Math.sin(u * 9 + i) + (hash(seed + i * 3 + 2) - 0.5) * 30;
      const r = 3 + 7 * hash(seed + i * 7) * (0.6 + u);
      return <circle key={i} cx={bx} cy={by} r={r} fill="none" stroke="#e8fff8" strokeWidth={2} opacity={level * Math.sin(u * Math.PI)} />;
    })}
  </g>
);

/** Darkening vignette into a point (the B09 jar mouth); use with `CameraLayer blend="normal"`. */
export const Vignette = ({x, y, r, strength = 0.6}: {x: number; y: number; r: number; strength?: number}) => {
  const id = useId();
  return (
    <>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={r}>
          <stop offset="0.35" stopColor="#050a0c" stopOpacity={0} />
          <stop offset="1" stopColor="#050a0c" stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={2000} height={2800} fill={`url(#${id})`} />
    </>
  );
};

// ------------------------------------------------------------------------------------------------------------------------ glow pass
// `new: glow-pass` (EDU-EP06 N5; Boss W5.2, 2026-11-07): a halo bloom at a point and 5-8 warm motes drifting in one screen direction. It is a
// pure function of the pass progress `u` (0..1, from the shot clock) and a seed, so it is deterministic on seek. Use the SAME `dir` and `seed`
// in two shots on either side of a cut and the motes keep their screen direction (the glow leaves frame left in one shot and enters from the
// right in the next). No shapes: no hearts, no stars. Peak opacity <= GLOW_PEAK (0.3). Draw inside an `<svg>` with a screen blend.
export const GLOW_DIR_LEFT: [number, number] = [-1, -0.12];
export type GlowPassOpts = {
  /** Source point (plate px) of the bloom and where the motes start. */
  x: number; y: number;
  /** Progress through the pass, 0..1. */
  u: number;
  /** Screen direction of the drift (normalised for you); default `GLOW_DIR_LEFT`. */
  dir?: [number, number];
  /** Number of motes, clamped to 5..8 (default 7). */
  count?: number;
  /** Total drift of the farthest mote, px (default 520). */
  travel?: number;
  /** Bloom radius, px (default 260); the bloom envelope peaks at u 0.4. */
  r?: number;
  level?: number;
  seed?: number;
  /** The motes already drift across the frame at u 0 (the second shot of a cut): start `lead` of the way along their path (default 0). */
  lead?: number;
};
export type GlowMote = {x: number; y: number; r: number; a: number};
const env = (u: number) => Math.sin(Math.PI * Math.max(0, Math.min(1, u))) ** 1.4;
/** Bloom opacity (<= level <= GLOW_PEAK) at progress u. */
export const glowBloom = (u: number, level = GLOW_PEAK) => Math.min(level, GLOW_PEAK) * env(u);
/** Mote positions, radii and opacities at progress u: a pure function (tests, QA, and the component share it). */
export const glowMotes = (o: GlowPassOpts): GlowMote[] => {
  const n = Math.max(5, Math.min(8, Math.round(o.count ?? 7))), [dx, dy] = o.dir ?? GLOW_DIR_LEFT, dl = Math.hypot(dx, dy) || 1, seed = o.seed ?? 0;
  const travel = o.travel ?? 520, lead = o.lead ?? 0, level = Math.min(o.level ?? GLOW_PEAK, GLOW_PEAK);
  return Array.from({length: n}, (_, i) => {
    const k = 0.55 + 0.45 * hash(seed + i * 5.3), v = Math.max(0, Math.min(1, lead + (1 - lead) * o.u));
    const along = travel * k * v, px = (hash(seed + i * 2.1) - 0.5) * 150, py = (hash(seed + i * 3.7) - 0.5) * 110;
    const life = Math.sin(Math.PI * Math.max(0, Math.min(1, (v - 0.05 * i / n) / 0.95)));
    return {x: o.x + px + (dx / dl) * along, y: o.y + py + (dy / dl) * along - 40 * v * hash(seed + i * 7.9), r: 6 + 9 * hash(seed + i * 9.7), a: level * Math.max(0, life)};
  });
};
export const GlowPass = (o: GlowPassOpts) => {
  const id = useId(), lv = glowBloom(o.u, o.level), r = o.r ?? 260;
  return (
    <g>
      <defs>
        <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={o.x} cy={o.y} r={r}>
          <stop offset="0" stopColor="#ffd9a0" stopOpacity={lv} />
          <stop offset="0.45" stopColor="#ffe6bc" stopOpacity={lv * 0.45} />
          <stop offset="1" stopColor="#fff1cf" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={o.x} cy={o.y} rx={r} ry={r * 0.8} fill={`url(#${id})`} />
      {glowMotes(o).map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={m.r * 2.4} fill="#ffe2b0" opacity={m.a * 0.35} />
          <circle cx={m.x} cy={m.y} r={m.r} fill="#fff1cf" opacity={m.a} />
        </g>
      ))}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------------------------------ glare veil
/** Edge darkening of the `glare-repaint` grade (kit/glare.ts) at grade `g` 0..1: a cool vignette, the screen-space half of the state. */
export const GlareVeil = ({g}: {g: number}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 95% 75% at 50% 42%, rgba(0,0,0,0) 55%, rgba(12,18,32,${(0.7 * Math.max(0, Math.min(1, g))).toFixed(3)}) 100%)`}} />
);
