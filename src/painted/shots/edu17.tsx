import {Freeze} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOT_TABLE} from '../../videos/edu-ep17/clock';
import {PAPER_OF, ShotFrame} from '../../videos/edu-ep17/frame';

// EDU-EP17 inventory (Editor W5.3 Draft): one plate per shot, ID `EDU17-<shot id>`. `ShotFrame` (src/videos/edu-ep17/frame.tsx) is a pure function of its composition frame; the plate mounts it in a `Freeze`
// at the shot-local frame `L = round(tl * 30)`, so the draw is the same in Studio, random seek and the scene render. Hard cuts only; captions and the channel mark come from the timeline.
export const edu17PlateId = (id: string) => `EDU17-${id}`;
export const edu17Shots: PaintedShot[] = SHOT_TABLE.map(([id]) => ({
  id: edu17PlateId(id), serves: [id], paper: PAPER_OF(id), camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={id} /></Freeze>
    </div>
  ),
}));
