// Standalone entry for the plate gallery stills (src/painted/kit/plates.ts): one composition per PLATES entry, named by
// its id, that paints the registered shot at the entry's time with its Overlay and no captions, labels or timeline.
// Kept out of src/Root.tsx; scripts/painted-kit/plates.ts renders it with scripts/stills.mjs.
import {createElement, Fragment, useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from './BrushCanvas';
import {PLATES, type PlateEntry} from './kit/plates';
import {drawPlate} from './plate';
import {paintedShots} from './registry';

const Plate = ({entry}: {entry: PlateEntry}) => {
  const {fps, width, height} = useVideoConfig();
  const shot = paintedShots[entry.shot], tl = entry.t;
  const paint = useCallback(({brush}: PaintContext) => drawPlate(brush, shot, {tl, fps, width, height}), [shot, tl, fps, width, height]);
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{backgroundColor: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={width} height={height} camera={shot.camera(tl)} opacity={1} />}
    </AbsoluteFill>
  );
};

// Remotion clamps every clock (a Freeze inside a shot too) to the composition range, so a plate whose Overlay freezes a shot at its local frame
// round(t x 30) (src/painted/shots/edu13.tsx) needs a composition at least that long; the still itself is frame 0.
const plateFrames = (t: number) => Math.max(1, Math.round(t * 30) + 1);

registerRoot(() =>
  createElement(Fragment, null, ...PLATES.map((entry) =>
    createElement(Composition, {key: entry.id, id: entry.id, component: () => createElement(Plate, {entry}), width: 1080, height: 1920, fps: 30, durationInFrames: plateFrames(entry.t)}),
  )),
);
