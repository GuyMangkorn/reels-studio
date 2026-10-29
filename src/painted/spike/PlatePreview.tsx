import {useCallback} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import type {PaintedShot} from '../shot';

/** Review-page time of a composition-global frame (`0:46.9`). */
export const reviewTime = (G: number, fps = 30) => {
  const s = G / fps;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};

/**
 * Burned-in preview label (docs/boss-asset-workflow.md#preview-labels): shot ID, deliverable, review-page time,
 * then the shot-local frame in brackets. Top strip, outside the caption-safe box.
 */
export const PreviewLabel = ({shot, deliverable, G, f, note}: {shot: string; deliverable: string; G: number; f: number; note: string}) => (
  <div style={{position: 'absolute', left: 24, top: 18, right: 24, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 24, lineHeight: 1.25, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke fill'}}>
    <b>{shot}</b> · {deliverable} · {reviewTime(G)} [f{f}]
    <br />
    <span style={{fontSize: 20}}>{note}</span>
  </div>
);

/** One painted plate on its own canvas with its Overlay, outside the timeline (spike previews only). */
export const PlatePreview = ({shot, G0, label, note, children}: {shot: PaintedShot; G0: number; label: boolean; note: string; children?: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const tl = frame / fps;
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl: frame / fps, fps, width, height}), [shot, frame, fps, width, height]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={width} height={height} camera={shot.camera(tl)} opacity={1} />}
      {children}
      {label && <PreviewLabel shot={shot.serves.join(', ')} deliverable="WFOG-EP01-SHORT" G={G0 + frame} f={frame} note={note} />}
    </AbsoluteFill>
  );
};
