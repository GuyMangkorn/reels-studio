import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';
import {C} from './palette';

// EDU-EP17 still frame (W3 thumbnails and look frames, Film): one painted canvas, grade and screen layers. The dashed band marks the caption band
// y 1176-1344 on guided stills (off with --props='{"guides":false}' for the caption-zone measure).

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});

const FPS = 30;
const FONT = "'Noto Sans Thai', sans-serif";
const edu = (size: number, color = '#ffffff', stroke = 8): CSSProperties => ({fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, WebkitTextStroke: `${stroke}px ${C.ink}`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'});
/** LBL slot (816-1020 x 148-204): "ภาพจำลอง". */
export const Lbl = () => <div lang="th" style={{position: 'absolute', left: 816, top: 148, width: 204, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', ...edu(40, '#ffffff', 6)}}>ภาพจำลอง</div>;
/** CARD slot (60-620 x 168-236): "2024 · ทะเลแดง". */
export const Card = () => <div lang="th" style={{position: 'absolute', left: 60, top: 168, height: 68, display: 'flex', alignItems: 'center', ...edu(52, '#ffffff', 8)}}>2024 · ทะเลแดง</div>;

/** Reconstruction grade (brief: saturation 45 %, cool grey tint `#9aa6ad` 15 %, soft vignette). */
const Recon = ({children}: {children: ReactNode}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', inset: 0, filter: 'saturate(0.45)'}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, background: '#9aa6ad', mixBlendMode: 'color', opacity: 0.15}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, rgba(15,18,22,0) 55%, rgba(15,18,22,0.4) 100%)'}} />
  </div>
);

type Props = {paint: (p: Painter) => void; paper?: string; recon?: boolean; overlay?: ReactNode};
export const Still = ({paint, paper = '#3a332c', recon, overlay}: Props) => {
  const fn = useCallback(({brush, frame}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper})), [paint, paper]);
  const pic = <BrushCanvas paint={fn} paper={paper} />;
  return (
    <AbsoluteFill style={{background: paper}}>
      {recon ? <Recon>{pic}</Recon> : pic}
      <Grain opacity={0.05} />
      {overlay}
      {(getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
