import {useId} from 'react';
import {AbsoluteFill} from 'remotion';
import {Grade, Grain} from '../screen';
import {bez} from './creatures';
import {hydParts, PAT_BLOOP, PAT_ICE} from './geometry';
import {AMBER, ICE} from './sets';
import type {Pt} from '../painter';

// Thai text uses the Noto Sans Thai face that `scenes/Subtitles` loads for every captioned composition (no load here, so
// importing the plates in tests has no side effect).

// BLOOP SVG layers (DEP02, VD01/VD05/VD07/VD09/VD10/VD12). Drawn inside a plate's Overlay: in-camera layers take the
// plate camera through `CameraLayer`; screen-space pieces ignore it. Glows are capped at 0.3 (demo-lighting rule).
// Every layer is pure in its inputs, and SVG filter ids come from `useId`.

/** Plate-owned screen layers (DF-20261030-painted-screen-layers-overlay): Grade (water plates) then Grain. */
export const ScreenLayers = ({opacity = 1, grade = true}: {opacity?: number; grade?: boolean}) => (
  <>
    {grade && <AbsoluteFill style={{opacity}}><Grade /></AbsoluteFill>}
    <Grain opacity={0.09 * opacity} />
  </>
);

/** FX-RING (VD05): one thin amber ring with a blurred twin; glow <= 0.3; contracts onto the receiver, never from a point. */
export const Ring = ({cx, cy, r, opacity}: {cx: number; cy: number; r: number; opacity: number}) => {
  const id = useId();
  if (opacity <= 0 || r <= 0) return null;
  return (
    <g>
      <defs><filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={9} /></filter></defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={AMBER} strokeWidth={10} opacity={0.3 * opacity} filter={`url(#${id})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={AMBER} strokeWidth={3} opacity={0.95 * opacity} />
    </g>
  );
};

/** FX-CRACK (VD10): bright fissures drawn on from `from` across a polyline set; `progress` 0..1 per line; cyan-white glow <= 0.3. */
export const Fissures = ({lines, progress, opacity = 1}: {lines: Pt[][]; progress: number[]; opacity?: number}) => {
  const id = useId();
  return (
    <g opacity={opacity}>
      <defs><filter id={id} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={6} /></filter></defs>
      {lines.map((pts, i) => {
        const p = Math.max(0, Math.min(1, progress[i] ?? 0));
        if (p <= 0) return null;
        const n = Math.max(1, Math.round((pts.length - 1) * p));
        const d = `M${pts.slice(0, n + 1).map(([x, y]) => `${x},${y}`).join(' L')}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={ICE} strokeWidth={10} opacity={0.3} filter={`url(#${id})`} />
            <path d={d} fill="none" stroke="#f4feff" strokeWidth={2.5} opacity={0.95} />
          </g>
        );
      })}
    </g>
  );
};

/** PROP-HYD SVG glyph (VD04): the same outline as the painted prop (`hydParts`), used in diagrams only. */
export const HydGlyph = ({cx, cy, k = 1, opacity = 1, flash = 0}: {cx: number; cy: number; k?: number; opacity?: number; flash?: number}) => {
  const hp = hydParts(cx, cy, k);
  const d = `M${hp.body.map(([x, y]) => `${x},${y}`).join(' L')} Z`;
  return (
    <g opacity={opacity}>
      <path d={`M${hp.top[0]},${hp.top[1]} L${hp.top[0]},${hp.top[1] - 90 * k}`} stroke="#04080d" strokeWidth={2} />
      <path d={d} fill="#4d6379" stroke="#04080d" strokeWidth={2} />
      <path d={`M${hp.cap.map(([x, y]) => `${x},${y}`).join(' L')} Z`} fill="#566d82" stroke="#04080d" strokeWidth={2} />
      {hp.hoops.map((y) => <path key={y} d={`M${cx - hp.cageW},${y} Q${cx},${y + 10 * k} ${cx + hp.cageW},${y}`} stroke="#0a1118" strokeWidth={2} fill="none" />)}
      {flash > 0 && <circle cx={cx} cy={cy} r={hp.h + 20} fill="none" stroke={AMBER} strokeWidth={6} opacity={0.3 * flash} />}
    </g>
  );
};

/**
 * PATTERN line (VD07): a panel-local curve (0..1 time, 0..1 pitch) placed in plate world, drawn on by `reveal` 0..1 in t.
 * `box` = [x0, y0, x1, y1] of the panel; `kind` picks the curve. Unlabelled: no axes, ticks, numbers or grid.
 */
export const PatternLine = ({box, kind, reveal, color = AMBER, glow = 0}: {box: [number, number, number, number]; kind: 'bloop' | 'ice'; reveal: number; color?: string; glow?: number}) => {
  const [x0, y0, x1, y1] = box;
  const pts = bez((kind === 'bloop' ? PAT_BLOOP : PAT_ICE).map(([t, p]) => [t, p] as Pt), 60);
  const visible = pts.filter(([t]) => t <= Math.max(0, Math.min(1, reveal)) + 1e-9);
  if (visible.length < 2) return null;
  const world = visible.map(([t, p]) => [x0 + (x1 - x0) * t, y1 - (y1 - y0) * p] as Pt);
  const d = `M${world.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}`;
  return (
    <g>
      {glow > 0 && <path d={d} fill="none" stroke={color} strokeWidth={16} opacity={0.3 * glow} />}
      <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/** Diagram tag (VD12): SVG Thai text inside the camera, outlined so it reads on any wash; left-aligned at its baseline. */
export const DiagramTag = ({x, y, text, opacity = 1, anchor = 'start'}: {x: number; y: number; text: string; opacity?: number; anchor?: 'start' | 'middle'}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily="Noto Sans Thai, sans-serif" fontWeight={600} fontSize={28} fill="#ffffff" stroke="#111" strokeWidth={6} paintOrder="stroke fill" opacity={opacity} lang="th">
    {text}
  </text>
);

/**
 * Channel glow (FR08, VD09): the sound channel as a soft amber band, feathered top and bottom, not a flat bar. `opacity` is
 * the band's peak (<= 0.3, the glow cap). Draw it in a `screen` layer.
 */
export const ChannelGlow = ({y0, y1, opacity}: {y0: number; y1: number; opacity: number}) => {
  const id = useId();
  if (opacity <= 0) return null;
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
          <stop offset="0" stopColor={AMBER} stopOpacity={0} />
          <stop offset="0.5" stopColor={AMBER} stopOpacity={1} />
          <stop offset="1" stopColor={AMBER} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-200} y={y0} width={1480} height={y1 - y0} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
};
