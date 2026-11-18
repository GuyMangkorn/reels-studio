// SVG painter (KIT-POV-HANDS A/B, 18 Nov 2026): a Painter whose brush records the kit's draw calls (filled polygons, ink splines) and
// returns them as crisp SVG paths, so any kit drawing (the 3D hand macro, props, rooms) renders as vector art without new geometry.
// Project default: crisp Remotion SVG for close-ups and first-person inserts (docs/delivery-workflow.md#project-defaults).
// Only the brush calls the kit uses are recorded (polygon with fill or wash, spline with the ink set by `set`); the rest are no-ops.
import {type ReactElement} from 'react';
import {makePainter, type Painter, type Pt} from './painter';

export type SvgMark = {kind: 'fill'; d: string; color: string; opacity: number} | {kind: 'stroke'; d: string; color: string; width: number; opacity: number};
/** Ink weight (brush units) -> SVG stroke width (px), matched by eye to the rotring pen. */
export const SVG_INK_SCALE = 1.25;

const fmt = (n: number) => (Math.round(n * 10) / 10).toString();
const polyD = (pts: Pt[]) => `M${pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join('L')}Z`;
/** Catmull-Rom through the points as cubic Beziers; `curve` 0 = straight segments. */
const splineD = (pts: Pt[], curve: number) => {
  if (pts.length < 2) return '';
  const k = Math.max(0, Math.min(1, curve)) / 3;
  let d = `M${fmt(pts[0][0])},${fmt(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k], c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += `C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`;
  }
  return d;
};

/** A recording painter: paint into it with any kit function, then render `marks` with `<SvgMarks>`. */
export const svgPainter = ({t = 0, frame = 0}: {t?: number; frame?: number} = {}): {painter: Painter; marks: SvgMark[]} => {
  const marks: SvgMark[] = [];
  let fill: {color: string; a: number} | null = null, wash: {color: string; a: number} | null = null, ink: {color: string; w: number} | null = null;
  const brush = {
    fill: (color: string, a = 255) => { fill = {color, a}; },
    noFill: () => { fill = null; },
    wash: (color: string, a = 255) => { wash = {color, a}; },
    noWash: () => { wash = null; },
    set: (_name: string, color: string, w: number) => { ink = {color, w}; },
    noStroke: () => { ink = null; },
    polygon: (pts: Pt[]) => {
      const f = wash ?? fill;
      if (f && pts.length >= 3) marks.push({kind: 'fill', d: polyD(pts), color: f.color, opacity: Math.min(1, f.a / 255)});
    },
    spline: (pts: Pt[], curve = 0.5) => { if (ink && pts.length >= 2) marks.push({kind: 'stroke', d: splineD(pts, curve), color: ink.color, width: ink.w * SVG_INK_SCALE, opacity: 1}); },
  };
  const noop = () => undefined;
  const proxy = new Proxy(brush, {get: (o, k) => (k in o ? o[k as keyof typeof o] : noop)});
  return {painter: makePainter(proxy as unknown as Parameters<typeof makePainter>[0], {t, frame}), marks};
};

/** The recorded marks as one full-frame SVG (1080 x 1920 by default). */
export const SvgMarks = ({marks, width = 1080, height = 1920}: {marks: SvgMark[]; width?: number; height?: number}): ReactElement => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', left: 0, top: 0}}>
    {marks.map((m, i) => m.kind === 'fill'
      ? <path key={i} d={m.d} fill={m.color} fillOpacity={m.opacity} stroke={m.color} strokeWidth={0.6} strokeOpacity={m.opacity} strokeLinejoin="round" />
      : <path key={i} d={m.d} fill="none" stroke={m.color} strokeWidth={m.width} strokeOpacity={m.opacity} strokeLinecap="round" strokeLinejoin="round" />)}
  </svg>
);
