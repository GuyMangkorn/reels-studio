import type {CSSProperties} from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from './palette';

// EDU-EP16 species tag (N8, W5.2; brief VD25, storyboard "On-screen text", user Q-F2): "อีกาอเมริกัน · ภาพจำลอง" once, in the LBL slot widened to x 520-1020,
// y 148-204 (edu caption stroke, DOM above the painted canvas), on the GLOBAL frames [150, 278) = shots 3 (+0) to 4 (end) and nowhere else.
// `frame` is the composition frame (scene offset 0). `fade` frames of opacity ramp at each end (default 0 = a hard appearance, as the sheet's one continuous range).

export const TAG_TEXT = 'อีกาอเมริกัน · ภาพจำลอง';
export const TAG_RANGE: [number, number] = [150, 278];
const FONT = "'Noto Sans Thai', sans-serif";
const edu = (size: number, stroke = 6): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#ffffff', lineHeight: 1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});

/** Opacity of the tag at global frame `f` (0 outside the range). */
export const tagOpacity = (f: number, fade = 0): number => {
  const [a, b] = TAG_RANGE;
  if (f < a || f >= b) return 0;
  if (fade <= 0) return 1;
  return Math.min(1, (f - a + 1) / fade, (b - f) / fade);
};

export const SpeciesTagAt = ({frame, fade = 0}: {frame: number; fade?: number}) => {
  const o = tagOpacity(frame, fade);
  if (o <= 0) return null;
  return <div lang="th" style={{position: 'absolute', left: 520, top: 148, width: 500, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o, ...edu(40)}}>{TAG_TEXT}</div>;
};
/** Inside a Remotion composition: reads the frame itself. */
export const SpeciesTag = ({fade = 0}: {fade?: number}) => <SpeciesTagAt frame={useCurrentFrame()} fade={fade} />;
