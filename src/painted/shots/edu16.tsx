import {Freeze} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOT_TABLE} from '../edu16/clock';
import {ShotFrame} from '../edu16/frame';

// EDU-EP16 inventory (Editor W5.3 Draft): one plate per shot, ID `EDU16-<shot id>`. `ShotFrame` (src/painted/edu16/frame.tsx) is a pure function of its composition frame; the plate mounts it in a `Freeze`
// at the shot-local frame `L = round(tl * 30)`, so the draw is the same in Studio, random seek and the scene render. Hard cuts only; captions and the channel mark come from the timeline.
export const edu16PlateId = (id: string) => `EDU16-${id}`;
export const edu16Shots: PaintedShot[] = SHOT_TABLE.map(([id]) => ({
  id: edu16PlateId(id), serves: [id], paper: '#d9d4c4', camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={id} /></Freeze>
    </div>
  ),
}));
