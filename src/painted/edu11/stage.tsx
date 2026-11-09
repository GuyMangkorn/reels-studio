import {useCallback} from 'react';
import {AbsoluteFill} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {makePainter, type Painter} from '../kit/painter';
import {Grain} from '../kit/screen';

// EDU-EP11 spike stage: one BrushCanvas with a Painter, the caption band y 1176-1344 marked (dashed) for review stills only.
export const FPS = 30;
export const Painted = ({paint, paper = '#20262c', band = true, grain = 0.05, children, frame0}: {paint: (p: Painter, frame: number) => void; paper?: string; band?: boolean; grain?: number; children?: React.ReactNode; frame0?: number}) => {
  const fn = useCallback(({brush, frame}: PaintContext) => { const f = frame0 ?? frame; paint(makePainter(brush, {t: f / FPS, frame: f, fade: paper}), f); }, [paint, paper, frame0]);
  return (
    <AbsoluteFill style={{background: paper}}>
      <BrushCanvas paint={fn} paper={paper} />
      <Grain opacity={grain} />
      {children}
      {band && <div style={{position: 'absolute', left: 0, right: 0, top: 1176, height: 168, borderTop: '2px dashed rgba(255,255,255,0.6)', borderBottom: '2px dashed rgba(255,255,255,0.6)'}} />}
    </AbsoluteFill>
  );
};
