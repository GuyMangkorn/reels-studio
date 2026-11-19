import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill} from 'remotion';

// Newsreel screen layer (EDU-EP30 VD30-01, Film W3 look asset 2026-11-19; `missing capability` in the kit: Boss hardens it into kit/screen.tsx,
// shared with C112). Screen space, plate-owned (DF-20261030-painted-screen-layers-overlay): it wraps the painted canvas and sits under the
// titles, captions, mark and label. Pieces: an amber tinted-print grade (CSS filter on the canvas: grey, then sepia, then a warm or cool
// shift), seeded luma flicker, a low-frequency gate weave (the canvas only), thin vertical scratches and dust specks, a soft vignette.
// `strength` 0..1 drives everything (B07 burns it out over about 10 frames). No perforations, no 4:3 box, no fake archive captions.

export type NewsreelTint = 'warm' | 'cool';
export type NewsreelOpts = {
  frame: number; strength?: number; tint?: NewsreelTint;
  /** tint amount 0..1 at full strength: 1 = full tinted print (near monochrome), 0.6 = light (a trace of the painted colour) */
  tintAmount?: number; seed?: number;
};

const hh = (n: number) => { const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

/** CSS filter for the painted canvas. */
export const newsreelFilter = ({frame, strength = 1, tint = 'warm', tintAmount = 1, seed = 30}: NewsreelOpts): string => {
  const s = Math.max(0, Math.min(1, strength)), k = s * tintAmount;
  const flick = 1 + s * (hh(seed + frame * 1.7) - 0.5) * 0.06;
  return tint === 'warm'
    ? `grayscale(${k * 0.92}) sepia(${k * 0.78}) saturate(${1 + k * 0.25}) contrast(${1 + s * 0.1}) brightness(${flick * (1 - s * 0.02)})`
    : `grayscale(${k * 0.95}) sepia(${k * 0.42}) hue-rotate(${k * -12}deg) saturate(${1 - k * 0.2}) contrast(${1 + s * 0.06}) brightness(${flick * (1 - s * 0.08)})`;
};

/** Gate weave: a sub-pixel-to-2 px slow drift of the picture (canvas only, never captions or chrome). */
export const newsreelWeave = ({frame, strength = 1, seed = 30}: NewsreelOpts): CSSProperties => {
  const s = Math.max(0, Math.min(1, strength)), t = frame / 30;
  const dx = s * (1.2 * Math.sin(t * 2.1 + seed) + 0.6 * Math.sin(t * 5.3 + seed * 2)), dy = s * (1.6 * Math.sin(t * 1.7 + seed * 3) + 0.5 * (hh(seed + Math.floor(frame / 3)) - 0.5));
  return {transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${1 + s * 0.006})`};
};

/** The canvas wrapper: grade and weave applied to its children (the BrushCanvas). */
export const NewsreelPicture = ({children, ...o}: NewsreelOpts & {children: ReactNode}) => (
  <AbsoluteFill style={{filter: newsreelFilter(o), ...newsreelWeave(o)}}>{children}</AbsoluteFill>
);

/** Scratches, dust and vignette over the picture (under titles and captions). */
export const NewsreelOverlay = ({frame, strength = 1, seed = 30, tint = 'warm'}: NewsreelOpts) => {
  const s = Math.max(0, Math.min(1, strength));
  if (s <= 0.001) return null;
  const scratches = [0, 1, 2].filter((i) => hh(seed + frame * 3 + i * 17) < 0.55 - i * 0.15).map((i) => {
    const x = 60 + hh(seed * 7 + Math.floor(frame / 4) * 5 + i * 31) * 960, y0 = -20 + hh(seed + frame + i) * 600, len = 700 + hh(seed + frame * 2 + i) * 1300;
    return {x, y0, y1: y0 + len, w: 0.8 + hh(i + frame) * 1.4, light: hh(frame * 5 + i) > 0.4};
  });
  const dust = Array.from({length: 9}, (_, i) => i).filter((i) => hh(seed + frame * 11 + i * 3) < 0.45).map((i) => ({
    x: hh(seed + frame * 13 + i * 7) * 1080, y: hh(seed + frame * 17 + i * 5) * 1920, r: 1.5 + hh(frame + i * 9) * 4.5, dark: hh(frame * 3 + i) > 0.35, rx: 1 + hh(i + frame * 2) * 1.6,
  }));
  const vig = tint === 'warm' ? '40,24,10' : '16,18,22';
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: s}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 62% at 50% 46%, rgba(${vig},0) 58%, rgba(${vig},0.42) 100%)`}} />
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0}}>
        {scratches.map((q, i) => <line key={`s${i}`} x1={q.x} y1={q.y0} x2={q.x + 3} y2={q.y1} stroke={q.light ? 'rgba(250,240,215,0.4)' : 'rgba(30,20,10,0.32)'} strokeWidth={q.w * 0.8} />)}
        {dust.map((d, i) => <ellipse key={`d${i}`} cx={d.x} cy={d.y} rx={d.r * d.rx} ry={d.r} fill={d.dark ? 'rgba(25,16,8,0.65)' : 'rgba(250,242,220,0.6)'} />)}
      </svg>
    </AbsoluteFill>
  );
};
