import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import {RoomLight} from './room-light';
import {camLF01, LOOK_FRAME, paintCF1, paintCF2, paintCF3, paintCFa, paintLF01, paintLF02, paintLF03, paintLF04} from './scenes';

export {LF_FRAMES, LOOK_FRAME} from './scenes';

// EDU-EP06-SHORT look frames (W3): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption
// or channel mark; `band` marks the caption band y 1176-1344 (VD17) on the cat-face look-check stills.
// Render: printf 'EDU6-LF01 27 out/edu06/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu06/look-index.ts

const FPS = 30;
const PAPER = '#3a2f2a';

const Painted = ({paint, band = false, vignette = 'rgba(30,22,18,0.35)', lamp}: {paint: (p: Painter, frame: number) => void; band?: boolean; vignette?: string; lamp?: YCam | null}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: PAPER}), frame), [paint]);
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <BrushCanvas paint={fn} paper={PAPER} />
      <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 95% 75% at 50% 42%, rgba(0,0,0,0) 55%, ${vignette} 100%)`}} />
      {lamp && <RoomLight cam={lamp} />}
      <Grain opacity={0.08} />
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};

export const LF01 = () => <Painted paint={paintLF01} lamp={camLF01(LOOK_FRAME.LF01)} />;
export const LF02 = () => <Painted paint={paintLF02} />;
export const LF03 = () => <Painted paint={paintLF03} />;
export const LF04 = () => <Painted paint={paintLF04} vignette="rgba(12,18,32,0.7)" />;
export const CF1 = () => <Painted paint={paintCF1} band />;
export const CF2 = () => <Painted paint={paintCF2} band />;
export const CF3 = () => <Painted paint={paintCF3} band />;
export const CFa = () => <Painted paint={paintCFa} band />;
