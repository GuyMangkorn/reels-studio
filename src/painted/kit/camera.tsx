import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import type {Brush} from '../BrushCanvas';
import type {Pt} from './painter';

/**
 * Picture-stage camera of one painted shot: push `s` about the focus (fx, fy), then drift (dx, dy), in composition
 * pixels. The canvas (`applyCamera`) and every Remotion glow layer (`CameraLayer`) use the same value, so light stays
 * attached to the painted world. Screen-space marks (rain, particles, labels, captions) ignore it.
 */
export type Camera = {s: number; fx: number; fy: number; dx: number; dy: number};
export const STILL_CAMERA: Camera = {s: 1, fx: 540, fy: 960, dx: 0, dy: 0};

/** Eased 0..1 progress over [0, len] seconds (sine in-out), clamped at both ends. */
export const easeOver = (tl: number, len: number) => interpolate(tl, [0, len], [0, 1], {easing: Easing.inOut(Easing.sin), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** A push from s0 to s1 about a fixed focus over `len` seconds, with an optional drift. */
export const pushCamera = (tl: number, len: number, o: {s0: number; s1: number; fx: number; fy: number; dx?: number; dy?: number}): Camera => {
  const e = easeOver(tl, len);
  return {s: o.s0 + (o.s1 - o.s0) * e, fx: o.fx, fy: o.fy, dx: (o.dx ?? 0) * e, dy: (o.dy ?? 0) * e};
};

export const toScreen = (c: Camera, [x, y]: Pt): Pt => [(x - c.fx) * c.s + c.fx + c.dx, (y - c.fy) * c.s + c.fy + c.dy];

export const applyCamera = (brush: Brush, c: Camera) => {
  brush.translate(c.fx + c.dx, c.fy + c.dy);
  brush.scale(c.s);
  brush.translate(-c.fx, -c.fy);
};

/** SVG transform string equal to `applyCamera`. */
export const cameraTransform = (c: Camera) => `translate(${c.fx + c.dx} ${c.fy + c.dy}) scale(${c.s}) translate(${-c.fx} ${-c.fy})`;

/** A full-frame SVG whose children are drawn in painted-world coordinates and follow the shot camera. */
export const CameraLayer = ({camera, width, height, blend = 'screen', opacity = 1, children}: {
  camera: Camera; width: number; height: number; blend?: 'screen' | 'normal' | 'multiply'; opacity?: number; children: ReactNode;
}) => (
  <AbsoluteFill style={{mixBlendMode: blend, opacity, pointerEvents: 'none'}}>
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <g transform={cameraTransform(camera)}>{children}</g>
    </svg>
  </AbsoluteFill>
);
