import {Freeze} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOT_TABLE} from '../edu15/clock';
import {ShotFrame} from '../edu15/frame';
import '../edu15/shots';

// EDU-EP15 inventory (Editor W5.3 Draft): one plate per shot, ID `EDU15-<shot id>` (the ids of Boss's standalone shot compositions). Boss's `ShotFrame` (src/painted/edu15/frame.tsx) is a pure
// function of its composition frame; the plate mounts it in a `Freeze` at the shot-local frame `L = round(tl * 30)`, so the draw is the same in Studio, random seek and the scene render.
// Hard cuts only; captions and the channel mark come from the timeline (chrome default @TamMaiLa, top-left). `band={false}` hides Boss's dashed caption-band guide.
export const edu15PlateId = (id: string) => `EDU15-${id}`;
export const edu15Shots: PaintedShot[] = SHOT_TABLE.map(([id]) => ({
  id: edu15PlateId(id), serves: [id], paper: '#6f7f86', camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={id} band={false} /></Freeze>
    </div>
  ),
}));
