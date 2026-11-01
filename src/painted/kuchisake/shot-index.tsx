import {useCallback} from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrushCanvas, type PaintContext} from '../BrushCanvas';
import {drawPlate} from '../plate';
import {kuchisakeShots, KSO_SHOT_INDEX} from '../shots/kuchisake';

// Standalone entry for the KSO-EP01-SHORT shot plates (W5 draft and W6 final stills). Kept out of src/Root.tsx and the episode
// registry, like look-index.ts: one composition per storyboard shot, `KSO-SH-<short shot ID>`, frame 0 = the shot's first frame.
// The picture runs through the same `drawPlate` path that PaintedStage uses for a timeline scene (one plate, no dissolve).
// Stills: printf 'KSO-SH-S02-B03-SH03 12 out/x.png\n' | node scripts/stills.mjs src/painted/kuchisake/shot-index.tsx
// Draft mode: add --props='{"paintDraft":true}' (BrushCanvas reads it).

const FPS = 30;

const Still = ({plateId}: {plateId: string}) => {
  const shot = kuchisakeShots.find((s) => s.id === plateId);
  const {width, height} = useVideoConfig();
  const frame = useCurrentFrame();
  if (!shot) throw new Error(`unknown KSO plate ${plateId}`);
  const paint = useCallback(({brush, frame: f}: PaintContext) => drawPlate(brush, shot, {tl: f / FPS, fps: FPS, width, height, paper: false}), [shot, width, height]);
  const tl = frame / FPS;
  const Overlay = shot.Overlay;
  return (
    <AbsoluteFill style={{background: shot.paper}}>
      <BrushCanvas paint={paint} paper={shot.paper} />
      {Overlay && <Overlay tl={tl} width={width} height={height} camera={shot.camera(tl)} opacity={1} />}
    </AbsoluteFill>
  );
};

const compositions = KSO_SHOT_INDEX.map(({id, plate, start, end}) => {
  const length = end - start;
  return <Composition key={id} id={`KSO-SH-${id}`} component={() => <Still plateId={plate} />} durationInFrames={length} fps={FPS} width={1080} height={1920} />;
});

registerRoot(() => <>{compositions}</>);
