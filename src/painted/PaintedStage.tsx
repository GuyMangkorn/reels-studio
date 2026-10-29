import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Ending} from '../scenes/endings';
import {paintedStateAt} from '../scenes/painted';
import type {Timeline} from '../scenes/types';
import {BrushCanvas, type PaintContext} from './BrushCanvas';
import {PaintedLabel} from './Label';
import {paintedShots} from './registry';
import {drawPlate} from './plate';

/**
 * The one p5.brush canvas of a composition (p5.brush has a single global WebGL runtime, and premounted scene
 * sequences would otherwise mount a second canvas). It paints the plates of the current frame, as resolved by
 * `paintedStateAt`, then their glow layers and labels. Painted scenes render transparent above it, so captions and
 * chrome stay Remotion. Nothing here keeps state between frames.
 */
export const PaintedStage = ({timeline, ending, loopBlendFrames}: {timeline: Timeline; ending: Ending; loopBlendFrames: number}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const state = paintedStateAt(timeline, frame, fps, {ending, durationInFrames, loopBlendFrames});
  if (!state) return null;
  const plates = state.plates.map((plate) => {
    const shot = paintedShots[plate.shot];
    const tl = shot.clock ? shot.clock(plate.tl) : plate.tl;
    const alpha = plate.alpha * (shot.alpha ? shot.alpha(plate.tl) : 1);
    return {plate, shot, tl, alpha, camera: shot.camera(tl)};
  });
  const paint = ({brush}: PaintContext) => {
    state.plates.forEach((plate, i) => drawPlate(brush, paintedShots[plate.shot], {tl: plate.tl, fps, width, height, alpha: plate.alpha, paper: i > 0, fade: plates[0].shot.paper}));
  };
  const labels = [...new Set(plates.filter((x) => x.alpha > 0 || x.plate.overlayOpacity > 0).map((x) => x.plate.label).filter((l): l is string => Boolean(l)))];
  return (
    <AbsoluteFill style={{opacity: state.opacity}}>
      <BrushCanvas paint={paint} paper={plates[0].shot.paper} />
      {plates.map(({shot, tl, alpha, camera, plate}, i) => {
        const opacity = plate.overlayOpacity * (alpha > 0 ? Math.min(1, alpha / plate.alpha) : 0);
        if (!shot.Overlay || opacity <= 0) return null;
        const Overlay = shot.Overlay;
        return <Overlay key={`${shot.id}-${i}`} tl={tl} width={width} height={height} camera={camera} opacity={opacity} />;
      })}
      {labels.map((text) => <PaintedLabel key={text} text={text} />)}
    </AbsoluteFill>
  );
};
