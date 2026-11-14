import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {useCallback} from 'react';
import {AbsoluteFill, getInputProps, staticFile} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';

// Frame wrapper for the EDU-EP16..18 look stills (W3, Film): painted canvas, screen layers, the caption-band guide.

if (typeof document !== 'undefined') loadFont({family: 'Noto Sans Thai', url: staticFile('fonts/NotoSansThai.ttf'), weight: '100 900'});
export const FONT = "'Noto Sans Thai', sans-serif";
export const FPS = 30;

type PaintedProps = {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; frame?: number; children?: ReactNode; overlay?: ReactNode};
export const Painted = ({paint, paper = '#2a2a30', band = true, frame = 0, children, overlay}: PaintedProps) => {
  const fn = useCallback(({brush}: PaintContext) => paint(makePainter(brush, {t: frame / FPS, frame, fade: paper}), frame), [paint, paper, frame]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      {children}
      <Grain opacity={0.05} />
      {overlay}
      {band && (getInputProps() as {guides?: boolean}).guides !== false && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
export const Vignette = ({level, id, color = '#0f1216'}: {level: number; id: string; color?: string}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    <defs><radialGradient id={id} gradientUnits="userSpaceOnUse" cx={540} cy={860} r={1250}><stop offset={0.5} stopColor={color} stopOpacity={0} /><stop offset="1" stopColor={color} stopOpacity={level} /></radialGradient></defs>
    <rect width={1080} height={1920} fill={`url(#${id})`} />
  </svg>
);
/** Channel mark placeholder (the runtime `defaultChrome` draws the real one): shows the top-left area kept clear. */
export const Mark = () => <div style={{position: 'absolute', left: 36, top: 44, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: 'rgba(255,255,255,0.85)', WebkitTextStroke: '5px rgba(20,20,20,0.6)', paintOrder: 'stroke fill'}}>@TamMaiLa</div>;

export const label = (x: number, y: number, size = 40): CSSProperties => ({position: 'absolute', left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: size, color: '#2b211c'});
