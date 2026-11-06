import {loadFont} from '@remotion/fonts';
import {useCallback} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {paintANT1, paintANT2, paintANT3, paintLF01, paintLF02, paintLF03, paintLF04} from './scenes';

export {LF_FRAMES} from './scenes';

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

// EDU-EP05-SHORT look frames (W3.1): React wrappers of the paint scenes in scenes.ts. Look stills only: no timeline, voice, caption
// or channel mark. Render: printf 'EDU5-LF01 30 out/edu05/look-frames/v1/LF01.png\n' | node scripts/stills.mjs src/painted/edu05/look-index.ts

const FPS = 30;
export const PAPER = '#ece6d6';

export const Painted = ({paint, paper = PAPER, band = false}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse 95% 75% at 50% 42%, rgba(255,255,255,0) 58%, rgba(60,70,80,0.18) 100%)'}} />
      <Grain opacity={0.08} />
      {band && (
        // caption band y 1176-1344 (VD19), marked on the ant look-check stills only
        <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />
      )}
    </AbsoluteFill>
  );
};

export const ANT1 = () => <Painted paint={paintANT1} band />;
export const ANT2 = () => <Painted paint={paintANT2} band />;
export const ANT3 = () => <Painted paint={paintANT3} band />;
export const LF01 = () => <Painted paint={paintLF01} />;
export const LF02 = () => <Painted paint={paintLF02} />;
export const LF03 = () => <Painted paint={paintLF03} />;
export const LF04 = () => <Painted paint={paintLF04} />;
