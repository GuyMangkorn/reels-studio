import type {Pt} from '../kit/painter';
import {range} from '../kit/painter';

// BLOOP-EP01-SHORT shared geometry (DEP02/M01/M02). Anchors, spaces and timing come from Mark's sheets
// (BLOOP-SHEETS-R3, index "Shared constants") and Film's brief (BLOOP-BRIEF-R2). Plate world px at camera s = 1,
// 1080x1920, origin top-left, y down. Shot-local frames: L = tl * 30. Constants only; no state.

export const FPS = 30;
export const W = 1080;
export const H = 1920;
/** Shot-local frame of a plate clock (sheets write `L<frame>`); rounded so `frame / 30 * 30` has no float residue. */
export const L = (tl: number) => Math.round(tl * FPS * 1e6) / 1e6;

/** Caption reserve (brief CAP-ZONE): y 840-1260; caption-safe width x 120-888. */
export const CAP_ZONE = {top: 840, bottom: 1260, left: 120, right: 888};

// ---------------------------------------------------------------- PROP-HYD (VD04): one outline source
/** Fixed world anchors of the hydrophone for every water plate (index: DEEP space). */
export const HYD = {cx: 540, cy: 560, top: [540, 430] as Pt, base: [540, 690] as Pt, glyphCentre: [760, 700] as Pt};

/** Hydrophone outline in world px: body 70 x 260 (k = 1) centred on (cx, cy), guard cage and cap. Painted and SVG copies share it. */
export const hydParts = (cx: number, cy: number, k = 1) => {
  const w = 35 * k, h = 130 * k, r = 26 * k;
  const body: Pt[] = [
    ...range(6, (u) => [cx - w + r - r * Math.cos(u * Math.PI / 2), cy - h + r - r * Math.sin(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx + w - r + r * Math.sin(u * Math.PI / 2), cy - h + r - r * Math.cos(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx + w - r + r * Math.cos(u * Math.PI / 2), cy + h - r + r * Math.sin(u * Math.PI / 2)] as Pt),
    ...range(6, (u) => [cx - w + r - r * Math.sin(u * Math.PI / 2), cy + h - r + r * Math.cos(u * Math.PI / 2)] as Pt),
  ];
  const cageW = 50 * k;
  const bars = [-1, -0.35, 0.35, 1].map((f) => [[cx + f * cageW, cy - h - 18 * k], [cx + f * cageW, cy + h + 18 * k]] as [Pt, Pt]);
  const hoops = [cy - h - 18 * k, cy, cy + h + 18 * k];
  const cap: Pt[] = [[cx - 14 * k, cy - h], [cx - 10 * k, cy - h - 34 * k], [cx + 10 * k, cy - h - 34 * k], [cx + 14 * k, cy - h]];
  return {body, bars, hoops, cageW, cap, top: [cx, cy - h - 34 * k] as Pt, w, h};
};

// ---------------------------------------------------------------- MAP (VD06, M01, M02)
/** Plate carree with central meridian 200 E: mapXY(lonE, lat) in plate world px (index: MAP space). */
export const mapXY = (lonE: number, lat: number): Pt => [(lonE - 145) * 9.4, 300 + (36 - lat) * 9.4];
export const EQUATOR_Y = mapXY(0, 0)[1];
/** Schematic equatorial hydrophone dots (no east/west meaning, within 5 deg of the equator); D1-D6 span 430 px. */
export const DOTS: Pt[] = [[330, 640], [420, 690], [500, 650], [590, 700], [680, 645], [760, 685]];
/** Hidden wavefront centre, far south of the frame: never drawn, only curves the fronts (M02). */
export const WF0: Pt = [540, 3200];
/** MAP-WIN (M01): map elements are clipped to the screen-space band y 280-840, feathered over 60 px at both ends. */
export const MAP_WIN = {top: 280, bottom: 840, feather: 60};

/**
 * Radius about WF0 of a wavefront that enters the screen at y 860 at shot-local frame `enter`, crosses the dot row
 * (y 660) 8 frames later and leaves at y 280 after 24 frames (sheets SH02 L121/L129/L145, computed at s 1).
 * Piecewise linear, so the front speed is a pure function of the clock.
 */
export const frontRadius = (f: number, enter: number) => {
  const r0 = WF0[1] - 860, r1 = WF0[1] - 660, r2 = WF0[1] - 280;
  const u = f - enter;
  if (u <= 0) return r0;
  if (u <= 8) return r0 + (r1 - r0) * (u / 8);
  return r1 + (r2 - r1) * Math.min(1, (u - 8) / 16);
};

/** Shot-local frame at which a front (entry `enter`) reaches a point at distance `d` from WF0 (inverse of frontRadius). */
export const frontCrossing = (d: number, enter: number) => {
  for (let f = enter; f <= enter + 40; f += 0.25) if (frontRadius(f, enter) >= d) return f;
  return Infinity;
};

// ---------------------------------------------------------------- SECTION (VD09)
export const SECTION = {surfaceY: 300, bandTop: 640, bandBottom: 760, bandCentre: 700, seafloorY: 1500};

// ---------------------------------------------------------------- PANEL (VD07): PAT-BLOOP / PAT-ICE, panel-local (0..1 time, 0..1 pitch)
export const PAT_BLOOP: Pt[] = [[0, 0.08], [0.3, 0.12], [0.45, 0.3], [0.6, 0.62], [0.75, 0.85], [1, 0.92]];
export const PAT_ICE: Pt[] = [[0, 0.1], [0.28, 0.15], [0.46, 0.36], [0.62, 0.66], [0.78, 0.83], [1, 0.88]];

// ---------------------------------------------------------------- FX-RING (VD05): radius of a ring from spawn, ease-in
/** Ring radius r0 -> r1 over `dur` frames of age (ease-in, quadratic); callers gate visibility by age. */
export const ringRadius = (age: number, r0: number, r1: number, dur: number) => {
  const u = Math.max(0, Math.min(1, age / dur));
  return r0 + (r1 - r0) * u * u;
};

/** Smooth ease-out 0..1 over [a, b] frames (sheet "ease-out"). */
export const easeOutRange = (f: number, a: number, b: number) => {
  const u = Math.max(0, Math.min(1, (f - a) / (b - a)));
  return 1 - (1 - u) * (1 - u);
};
