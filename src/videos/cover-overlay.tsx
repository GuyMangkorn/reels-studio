import {useCurrentFrame} from 'remotion';
import type {Timeline} from '../scenes/types';
import type {VideoDefinition} from './types';

/**
 * Cover candidates (docs/cover-principles.md). A deliverable `<ID>` has `<ID>-COVERS` (registered in src/videos/covers/):
 * one 1 s scene per candidate holding an episode plate at a chosen shot-local frame, and the `covers` overlay, which draws
 * the cover text from `overlayProps` (data, so editing a cover changes only that composition's scene keys, never an
 * episode's pinned scenes). The cover is the still at scene frame COVER_STILL; `scripts/render.mjs` renders them with
 * every delivery render of `<ID>`.
 */
export const COVER_STILL = 15;
export const COVER_FPS = 30;

export type CoverLine = {text: string; y: number; size: number; accent?: boolean};
/** `scrim: false` drops the episode scrim for one cover (text placed on a clear area instead). */
export type Cover = {id: string; plate: string; local: number; lines: CoverLine[]; scrim?: false};
/** Text look per episode (CV05, CV08): accent colour, and an optional dark scrim from `scrimY` down for light pictures. */
export type CoverStyle = {accent: string; scrimY?: number};

export const coversTimeline = (covers: Cover[]): Timeline => covers.map(({plate, local}) => ({
  durationSec: 1, bg: 'none', actors: [], subtitle: '',
  painted: {shots: [{shot: plate, atSec: 0, fromSec: (local - COVER_STILL) / COVER_FPS}]},
}));

const font = {fontFamily: 'Noto Sans Thai, sans-serif', fontWeight: 800, paintOrder: 'stroke fill', stroke: '#0b0d16', strokeLinejoin: 'round'} as const;

export const CoverOverlay = ({covers, style: {accent, scrimY}}: {covers: Cover[]; style: CoverStyle}) => {
  const cover = covers[Math.min(covers.length - 1, Math.floor(useCurrentFrame() / COVER_FPS))];
  return <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} lang="th">
    {scrimY !== undefined && cover.scrim !== false && <>
      <defs><linearGradient id="cover-scrim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0d16" stopOpacity="0"/><stop offset="0.35" stopColor="#0b0d16" stopOpacity="0.72"/><stop offset="1" stopColor="#0b0d16" stopOpacity="0.85"/></linearGradient></defs>
      <rect x="0" y={scrimY} width="1080" height={1920 - scrimY} fill="url(#cover-scrim)"/>
    </>}
    {cover.lines.map(({text, y, size, accent: a}) => <text key={text} x="540" y={y} textAnchor="middle" fontSize={size} fill={a ? accent : '#f4efe6'} strokeWidth={size * 0.09} style={font}>{text}</text>)}
  </svg>;
};

/** `<ID>-COVERS` video definition for a deliverable `<ID>` (Short format). */
export const coversVideo = (id: string, covers: Cover[], style: CoverStyle): VideoDefinition => ({
  id: `${id}-COVERS`, format: 'short', timeline: coversTimeline(covers), ending: 'A_fade', endHoldSec: 0, endFadeSec: 0,
  chrome: {channelLabel: '@TamMaiLa', progressBar: false}, overlay: 'covers', overlayProps: {covers, style},
});
