import {useId} from 'react';
import type {V3} from '../kit/space';
import {Grain} from '../kit/screen';
import {camPoint, type YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import type {Shot22} from './shot';
import {FPS} from './shots/index';

// EDU-EP22-SHORT glint style GS2 and the G-TAG dim DIM2 (scene sheet EDU-EP22-SCENES-R2 B03-SH12 / B04-SH17, fix list items 3 and 6; Boss
// W6.2, 2026-11-17). Imported only by B03-SH12 and B04-SH17, which swap their plate's Overlay for `gs2Overlay` (glints.tsx and shot.tsx, which
// every EP22 shot imports, stay unchanged). Sizes in px at 1080 x 1920 for scale 1: a four-point star, core r 16, arm tips 2.6 r from the centre,
// body #ffd36a, hot centre #fffaf0 at 0.55 r, a 3 px #5a3c0a outline at 0.75 round the star; halo r 90, centre opacity 0.5 -> 0, normal blend
// (above the kit GLOW_PEAK 0.3 for these hero glints only, UT02); a pop = R1's 6 f grow plus one ring r 16 -> 80 over 10 f (stroke 5 -> 1 px
// #fff2c0 with a 1.5 px #5a3c0a outer line, opacity 0.9 -> 0); live scale 1 +- 0.06 at 20 f, phases 7 f apart. Additive light, never text,
// ticks or icons (VD12). World-locked through the shot camera every frame.

export const GS2_GOLD = '#ffd36a';
export const DIM2_GREY = '#8f8a80';
const OUTLINE = '#5a3c0a';

/** One GS2 glint at a frame: anchor, pop grow `k` 0..1, frames since its pop (ring; null = no ring), live phase index, DIM2 values. */
export type GS2 = {id: string; at: V3; k: number; ringAge: number | null; phase: number; live: boolean;
  /** DIM2: brightness 1 (warm) .. 0 and dim 0 (warm) .. 1 (grey dot). */
  bright?: number; dim?: number;
  /** The dim state's grey (default DIM2_GREY; B04-SH17 R2b #8a8f96). */
  grey?: string};

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b), u = Math.max(0, Math.min(1, t));
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * u).toString(16).padStart(2, '0')).join('')}`;
};
const smooth = (x: number) => { const u = Math.max(0, Math.min(1, x)); return u * u * (3 - 2 * u); };

/** DIM2 (sheet SH17): l 12-14 brightness 1 -> 0.4, l 15-16 back to 0.8 (one sputter), l 17-24 smoothstep to the dim state. `L` shot-local. */
export const dim2 = (L: number, t0 = 12): {bright: number; dim: number} => {
  const x = L - t0;
  if (x < 0) return {bright: 1, dim: 0};
  if (x <= 2) return {bright: 1 - 0.3 * x, dim: 0};
  if (x <= 4) return {bright: 0.8, dim: 0};
  const d = smooth((x - 4) / 8);
  return {bright: 0.8 * (1 - d), dim: d};
};

/** Picture geometry of a GS2 glint at full size (px at 1080), or null when behind the camera / not popped. Exported for the QA measure. */
export const gs2Geom = (cam: YCam, g: GS2, L: number, scale = 1) => {
  const q = camPoint(cam, g.at);
  if (!q || g.k <= 0) return null;
  const d = g.dim ?? 0, b = g.bright ?? 1;
  const live = g.live ? 1 + 0.06 * (1 - d) * Math.sin((2 * Math.PI * (L - 7 * g.phase)) / 20) : 1;
  const r = 16 * scale * g.k * live * (1 - 0.4 * d);
  return {x: q[0], y: q[1], r, arm: r * (2.6 - 1.4 * d), color: mix(GS2_GOLD, g.grey ?? DIM2_GREY, 1 - b), hot: 0.9 * b * (1 - d), halo: b * g.k * (1 - d), haloR: 90 * scale};
};

/** The GS2 layer: halos (normal blend), pop rings, then the outlined stars. */
export const GS2Layer = ({cam, glints, L, scale = 1}: {cam: YCam; glints: GS2[]; L: number; scale?: number}) => {
  const id = useId();
  const geoms = glints.map((g) => ({g, q: gs2Geom(cam, g, L, scale)})).filter((o) => o.q);
  if (!geoms.length) return null;
  const star = (x: number, y: number, a: number, r: number) => {
    const w = r * 0.42;
    return `M ${x} ${y - a} L ${x + w} ${y - w} L ${x + a} ${y} L ${x + w} ${y + w} L ${x} ${y + a} L ${x - w} ${y + w} L ${x - a} ${y} L ${x - w} ${y - w} Z`;
  };
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={GS2_GOLD} stopOpacity={0.5} />
          <stop offset="0.45" stopColor={GS2_GOLD} stopOpacity={0.2} />
          <stop offset="1" stopColor={GS2_GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>
      {geoms.map(({g, q}) => q!.halo > 0.01 && <circle key={`h${g.id}`} cx={q!.x} cy={q!.y} r={q!.haloR} fill={`url(#${id})`} opacity={q!.halo} />)}
      {geoms.map(({g, q}) => {
        if (g.ringAge === null || g.ringAge < 0 || g.ringAge >= 10) return null;
        const u = g.ringAge / 10, rr = (16 + 64 * u) * scale, sw = (5 - 4 * u) * scale, op = 0.9 * (1 - u);
        return (
          <g key={`r${g.id}`} opacity={op}>
            <circle cx={q!.x} cy={q!.y} r={rr + sw / 2 + 0.75} fill="none" stroke={OUTLINE} strokeWidth={1.5} />
            <circle cx={q!.x} cy={q!.y} r={rr} fill="none" stroke="#fff2c0" strokeWidth={sw} />
          </g>
        );
      })}
      {geoms.map(({g, q}) => {
        const {x, y, r, arm, color, hot} = q!, path = star(x, y, arm, r);
        return (
          <g key={`s${g.id}`}>
            <g opacity={0.75}>
              <path d={path} fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
              <circle cx={x} cy={y} r={r + 3} fill={OUTLINE} />
            </g>
            <path d={path} fill={color} />
            <circle cx={x} cy={y} r={r} fill={color} />
            {hot > 0.01 && <circle cx={x} cy={y} r={r * 0.55} fill="#fffaf0" opacity={hot} />}
          </g>
        );
      })}
    </svg>
  );
};

/** A shot plate whose Overlay draws GS2 glints (and the W3 grain, as shot.tsx) instead of the R1 glint layer. */
export const gs2Overlay = (base: PaintedShot, def: Shot22, glints: (L: number) => GS2[], scale = 1): PaintedShot => {
  const frameOf = (tl: number) => Math.max(0, Math.min(def.N - 1, Math.round(tl * FPS)));
  return {
    ...base,
    Overlay: ({opacity, tl}) => {
      const L = frameOf(tl);
      return (
        <div style={{position: 'absolute', inset: 0, opacity}}>
          <GS2Layer cam={def.cam(L)} glints={glints(L)} L={L} scale={scale} />
          <Grain opacity={0.04} />
        </div>
      );
    },
  };
};
