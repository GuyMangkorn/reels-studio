import {useId} from 'react';
import {GLOW_PEAK} from '../kit/glow';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';

// EDU-EP22-SHORT N7 checkpoint glints (brief VD08; scene sheet EDU-EP22-SCENES-R1 B03-SH12, B04-SH17; Boss W5.1, 2026-11-16). Three world-anchored
// SVG glints over the painted frame, projected every frame through the shot camera (so they ride the push exactly: 0 px drift by construction):
// a warm gold four-point sparkle (core 12 px across at full size) inside a soft halo (opacity <= GLOW_PEAK 0.3), screen blend. `k` 0..1 is the
// pop (6 f grow, then steady); `dim` 0..1 turns a glint into the L13 state: core warm gold -> grey #9a9a9a, size -40 %, halo off.
// Additive light, never text, ticks or icons (VD12).

/** Glint anchors (scene sheet "Glint anchors"; G-COVER is the rim of A05's removed cover, R1). */
export const G_TAG: V3 = [-3.35, 0.9, 1.68];
export const G_SPOON: V3 = [-3.3, 0.84, 2.24];
export const G_COVER: V3 = [-3.35, 0.86, 0.77];
export type Glint = {id: 'G-TAG' | 'G-SPOON' | 'G-COVER'; at: V3; k: number; dim?: number};

export const GOLD = '#ffd36a';
export const GREY = '#9a9a9a';
const mix = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};
/** The pop: 0 before `t0`, smooth grow over 6 f with a 12 % overshoot at 4 f, steady 1 after. */
export const glintPop = (L: number, t0: number) => {
  const x = (L - t0) / 6;
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return Math.sin(x * Math.PI * 0.5) * (1 + 0.12 * Math.sin(x * Math.PI));
};

/** Picture centre, core half-size (px) and colour of a glint at full frame size; null when it is behind the camera or not popped. */
export const glintGeom = (cam: YCam, g: Glint) => {
  const q = camPoint(cam, g.at);
  if (!q || g.k <= 0) return null;
  const d = g.dim ?? 0, r = 6 * g.k * (1 - 0.4 * d);
  return {x: q[0], y: q[1], r, color: mix(GOLD, GREY, d), halo: (1 - d) * g.k};
};

const Sparkle = ({x, y, r, color}: {x: number; y: number; r: number; color: string}) => {
  const a = r * 2.1, b = r * 0.42;
  return (
    <g>
      <path d={`M ${x} ${y - a} L ${x + b} ${y - b} L ${x + a} ${y} L ${x + b} ${y + b} L ${x} ${y + a} L ${x - b} ${y + b} L ${x - a} ${y} L ${x - b} ${y - b} Z`} fill={color} />
      <circle cx={x} cy={y} r={r} fill={color} />
      <circle cx={x} cy={y} r={r * 0.45} fill="#fffaf0" opacity={0.9} />
    </g>
  );
};

/** The glint layer: one sparkle per glint with its halo, projected with the shot camera `cam`. */
export const GlintLayer = ({cam, glints}: {cam: YCam; glints: Glint[]}) => {
  const id = useId();
  const geoms = glints.map((g) => ({g, q: glintGeom(cam, g)})).filter((o) => o.q);
  if (!geoms.length) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={GOLD} stopOpacity={GLOW_PEAK} />
          <stop offset="0.45" stopColor={GOLD} stopOpacity={GLOW_PEAK * 0.45} />
          <stop offset="1" stopColor={GOLD} stopOpacity={0} />
        </radialGradient>
      </defs>
      {geoms.map(({g, q}) => (
        <g key={g.id}>
          {q!.halo > 0.01 && <circle cx={q!.x} cy={q!.y} r={34 * g.k} fill={`url(#${id})`} opacity={q!.halo} style={{mixBlendMode: 'screen'}} />}
          <Sparkle x={q!.x} y={q!.y} r={q!.r} color={q!.color} />
        </g>
      ))}
    </svg>
  );
};
