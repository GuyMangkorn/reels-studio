import {useId, type ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';
import {cameraTransform, type Camera} from '../kit/camera';
import type {Pt} from '../kit/painter';
import coast from './coast.json';
import land from './land.json';
import {EQUATOR_Y, frontRadius, MAP_WIN, WF0} from './geometry';
import {AMBER} from './sets';

// BLOOP map (M01, M02, VD06, FR05, FR06): the baked Natural Earth coastline and land fill, dots, equator, wavefront arcs
// about the hidden WF0, and the tapering SH07 arrow. `MapWindow` clips every map element to the screen-space band
// y 280-840 (MAP-WIN) with 60 px feathers; the painted ocean wash is not clipped (it is painted in the canvas). The mask is
// in screen space, outside the camera transform, so the window stays put while the map pans. The coastline stroke is
// `non-scaling-stroke`, so its width is constant on screen through pans and pushes (FR05).

/** Map elements clipped to MAP-WIN in screen space, with the plate camera applied inside. */
export const MapWindow = ({camera, width, height, children}: {camera: Camera; width: number; height: number; children: ReactNode}) => {
  const id = useId();
  const span = MAP_WIN.bottom - MAP_WIN.top, f = MAP_WIN.feather / span;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="0" y1={MAP_WIN.top} x2="0" y2={MAP_WIN.bottom}>
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset={f} stopColor="#fff" stopOpacity={1} />
            <stop offset={1 - f} stopColor="#fff" stopOpacity={1} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <rect x={0} y={MAP_WIN.top} width={width} height={span} fill={`url(#${id}g)`} />
          </mask>
        </defs>
        <g mask={`url(#${id})`}>
          <g transform={cameraTransform(camera)}>{children}</g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** SVG path of one flat [x, y, x, y, ...] polyline. */
const pathOf = (flat: number[], close = false) => {
  const parts: string[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) parts.push(`${flat[i]},${flat[i + 1]}`);
  return `M${parts.join(' L')}${close ? ' Z' : ''}`;
};
const COAST_D = coast.lines.map((line) => pathOf(line)).join(' ');
const LAND_D = land.rings.map((ring) => pathOf(ring, true)).join(' ');

/** Land mass (FR05): the baked Natural Earth 1:110m land, cream at 14 % so continents read as mass in SH09. */
export const LandFill = ({opacity = 1}: {opacity?: number}) => <path d={LAND_D} fill="#efe6d2" fillOpacity={0.14 * opacity} stroke="none" />;

/** The baked coastline (static import, `coast.json`; NOTICE beside it). Cream line work, constant width on screen (FR05). */
export const Coast = ({opacity = 1}: {opacity?: number}) => (
  <path d={COAST_D} opacity={opacity} fill="none" stroke="#f1e6c8" strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
);

/** Equatorial dashed line; `progress` 0..1 draws it left to right. */
export const Equator = ({progress, x0 = 60, x1 = 1020}: {progress: number; x0?: number; x1?: number}) => {
  if (progress <= 0) return null;
  const x = x0 + (x1 - x0) * Math.min(1, progress);
  return <line x1={x0} y1={EQUATOR_Y} x2={x} y2={EQUATOR_Y} stroke="#f1e6c8" strokeWidth={3} strokeDasharray="14 10" vectorEffect="non-scaling-stroke" />;
};

/** Map dots (18 px) at explicit world points: cream, amber while `flash[i]` > 0; `appear[i]` 0..1 pops them in. */
export const MapDots = ({points, flash, appear, halo = []}: {points: Pt[]; flash: number[]; appear: number[]; halo?: number[]}) => (
  <g>
    {points.map(([x, y], i) => {
      const a = appear[i] ?? 1;
      if (a <= 0) return null;
      const amber = Math.max(0, Math.min(1, flash[i] ?? 0));
      return (
        <g key={i} opacity={a}>
          {(halo[i] ?? 0) > 0 && <circle cx={x} cy={y} r={34} fill={AMBER} opacity={0.22 * (halo[i] ?? 0)} />}
          <circle cx={x} cy={y} r={11} fill={amber > 0.5 ? AMBER : '#f1e6c8'} stroke="#0b1622" strokeWidth={2} opacity={0.6 + 0.4 * a} />
        </g>
      );
    })}
  </g>
);

/**
 * Wavefront arcs (M02): the fronts are circles about the hidden WF0, radius from `frontRadius` for each entry frame.
 * Only the arc inside MAP-WIN shows; WF0 is never drawn. `f` is the shot-local frame.
 */
export const Wavefronts = ({enters, f, opacity = 1}: {enters: number[]; f: number; opacity?: number}) => {
  const id = useId();
  return (
    <g opacity={opacity}>
      <defs><filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={8} /></filter></defs>
      {enters.map((enter, k) => {
        if (f < enter || f > enter + 26) return null;
        const r = frontRadius(f, enter);
        return (
          <g key={k}>
            <circle cx={WF0[0]} cy={WF0[1]} r={r} fill="none" stroke={AMBER} strokeWidth={12} opacity={0.2} filter={`url(#${id})`} />
            <circle cx={WF0[0]} cy={WF0[1]} r={r} fill="none" stroke={AMBER} strokeWidth={3} opacity={0.85} />
          </g>
        );
      })}
    </g>
  );
};

/** Band width of the SH07 arrow at world y (FR06): ≈70 px at the dots (y 668), ≈36 px at the bottom edge (y 840), then held. */
export const arrowWidth = (y: number) => 70 - 34 * Math.max(0, Math.min(1, (y - 668) / (840 - 668)));

/**
 * SH07 south arrow (FR06): a broad amber band that tapers from ≈70 px at the dots to ≈36 px at the bottom edge, feathered
 * sides (a blurred copy under the core), a soft glow <= 0.3, opacity fading toward the bottom, and 2-3 chevrons travelling
 * down it to show direction. No head, no pin, no endpoint: it runs out through the bottom of MAP-WIN. `phase` is the
 * shot-local frame that moves the chevrons; `len` is the grown length (0 before L27).
 */
export const TaperArrow = ({root, len, swayDeg, phase, opacity = 1}: {root: Pt; len: number; swayDeg: number; phase: number; opacity?: number}) => {
  const id = useId();
  if (len <= 0) return null;
  const [x, y0] = root;
  const y1 = y0 + len;
  const edge = (yy: number, side: 1 | -1) => x + side * arrowWidth(yy) / 2;
  const samples = Array.from({length: 13}, (_, i) => y0 + (len * i) / 12);
  const outline = [...samples.map((yy) => [edge(yy, -1), yy] as Pt), ...samples.slice().reverse().map((yy) => [edge(yy, 1), yy] as Pt)];
  const d = `M${outline.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' L')} Z`;
  const chevrons = [0, 1, 2].map((i) => {
    const travel = ((phase * 2.2 + i * 220) % 300) - 40;
    const cy = y0 + travel;
    if (cy < y0 + 10 || cy > y1 - 10) return null;
    const hw = arrowWidth(cy) * 0.28;
    return <path key={i} d={`M${x - hw},${cy - 14} L${x},${cy} L${x + hw},${cy - 14}`} fill="none" stroke="#f1e6c8" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />;
  });
  return (
    <g transform={`rotate(${swayDeg} ${x} ${y0})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1={x} y1={y0} x2={x} y2={y0 + 300}>
          <stop offset="0" stopColor={AMBER} stopOpacity={0.95} />
          <stop offset="1" stopColor={AMBER} stopOpacity={0.35} />
        </linearGradient>
        <filter id={id} x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation={6} /></filter>
      </defs>
      <path d={d} fill={AMBER} opacity={0.3} filter={`url(#${id})`} />
      <path d={d} fill={`url(#${id}g)`} />
      {chevrons}
    </g>
  );
};
