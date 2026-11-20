import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Ending, EndingOptions} from '../scenes/endings';
import {crossfadeOf, paintedStateAt} from '../scenes/painted';
import type {PaintedLabel, Timeline} from '../scenes/types';
import {BrushCanvas, type PaintContext} from './BrushCanvas';
import {type LabelSide, PaintedItemView, PaintedLabel as LabelText} from './Label';
import {paintedShots} from './registry';
import {drawPlate} from './plate';
import {stageCanvasStyle} from './shot';

/**
 * Fact-label slots of one frame: slot 0 (y 300, or the cue's `labelTop`) and slot 1 (y 360, DEP03). Texts are merged
 * per slot, first come first kept (with the top of the plate that brought them).
 */
const labelSlots = (labels: {label: PaintedLabel; top?: number; side?: LabelSide}[]): {text: string; top?: number; side?: LabelSide}[][] => {
  const slots: {text: string; top?: number; side?: LabelSide}[][] = [[], []];
  for (const {label, top, side} of labels) {
    const texts = typeof label === 'string' ? [label] : label;
    texts.forEach((text, i) => {
      if (text && i < slots.length && !slots[i].some((x) => x.text === text)) slots[i].push({text, top, side});
    });
  }
  return slots;
};

/**
 * The one p5.brush canvas of a composition (p5.brush has a single global WebGL runtime, and premounted scene
 * sequences would otherwise mount a second canvas). It paints the plates of the current frame, as resolved by
 * `paintedStateAt`, then their glow layers and labels. Painted scenes render transparent above it, so captions and
 * chrome stay Remotion. Nothing here keeps state between frames.
 */
export const PaintedStage = ({timeline, ending, loopBlendFrames, endingOptions}: {timeline: Timeline; ending: Ending; loopBlendFrames: number; endingOptions?: EndingOptions}) => {
  const frame = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  const state = paintedStateAt(timeline, frame, fps, {ending, durationInFrames, loopBlendFrames, endingOptions});
  if (!state) return null;
  const plates = state.plates.map((plate) => {
    const shot = paintedShots[plate.shot];
    const tl = shot.clock ? shot.clock(plate.tl) : plate.tl;
    const alpha = plate.alpha * (shot.alpha ? shot.alpha(plate.tl) : 1);
    return {plate, shot, tl, alpha, camera: shot.camera(tl)};
  });
  // A dissolve into a `crossfade` plate: the incoming plate is painted whole on the canvas layer and mixed as a picture.
  const fadeIn = crossfadeOf(state.plates, (id) => Boolean(paintedShots[id]?.crossfade));
  const paint = ({brush}: PaintContext) => {
    state.plates.forEach((plate, i) => {
      if (plate.incoming && plate.alpha < 1 && paintedShots[plate.shot].loopExact) return;
      if (fadeIn && i === fadeIn.index) return;
      drawPlate(brush, paintedShots[plate.shot], {tl: plate.tl, fps, width, height, alpha: plate.alpha, paper: i > 0, fade: plates[0].shot.paper});
    });
  };
  const layer = fadeIn && {
    opacity: fadeIn.plate.alpha,
    paper: paintedShots[fadeIn.plate.shot].paper,
    paint: ({brush}: PaintContext) => drawPlate(brush, paintedShots[fadeIn.plate.shot], {tl: fadeIn.plate.tl, fps, width, height, alpha: 1, paper: true}),
  };
  const visible = plates.filter((x) => x.alpha > 0 || x.plate.overlayOpacity > 0);
  const slots = labelSlots(visible.flatMap(({plate}) => (plate.label !== undefined ? [{label: plate.label, top: plate.labelTop, side: plate.labelSide}] : [])));
  return (
    <AbsoluteFill style={{opacity: state.opacity}}>
      <div style={{position: 'absolute', inset: 0, ...stageCanvasStyle(visible, Boolean(fadeIn), {width, height, fps})}}>
        <BrushCanvas paint={paint} paper={plates[0].shot.paper} layer={layer || undefined} />
      </div>
      {plates.map(({shot, tl, alpha, camera, plate}, i) => {
        const opacity = plate.overlayOpacity * (alpha > 0 ? Math.min(1, alpha / plate.alpha) : 0);
        if (!shot.Overlay || opacity <= 0) return null;
        const Overlay = shot.Overlay;
        return <Overlay key={`${shot.id}-${i}`} tl={tl} width={width} height={height} camera={camera} opacity={opacity} />;
      })}
      {slots.map((texts, slot) => texts.map(({text, top, side}) => <LabelText key={`${slot}-${text}`} text={text} slot={slot} top={top} side={side} />))}
      {visible.flatMap(({plate}, i) => (plate.items ?? []).map((item, k) => <PaintedItemView key={`item-${i}-${k}`} item={item} l={plate.frame} />))}
    </AbsoluteFill>
  );
};
