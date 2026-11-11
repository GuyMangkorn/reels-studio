import {Freeze} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOT_TABLE} from '../edu18/clock';
import {ShotFrame} from '../edu18/shots';

// EDU-EP18 inventory (Boss W5.2 blockout): one plate per shot, ID `EDU18-<shot id>`. `ShotFrame` (src/painted/edu18/shots.tsx) is a pure function of its composition frame; the plate mounts it in a `Freeze`
// at the shot-local frame `L = round(tl * 30)`, so the draw is the same in Studio, random seek and the scene render. Hard cuts only; captions and the channel mark come from the timeline (Editor).
export const edu18PlateId = (id: string) => `EDU18-${id}`;
export const edu18Shots: PaintedShot[] = SHOT_TABLE.map(([id]) => ({
  id: edu18PlateId(id), serves: [id], paper: '#46515e', camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={id} /></Freeze>
    </div>
  ),
}));
