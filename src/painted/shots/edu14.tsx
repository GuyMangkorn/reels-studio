import {Freeze} from 'remotion';
import type {PaintedShot} from '../shot';
import {STILL_CAMERA} from '../kit/camera';
import {FPS, SHOT_TABLE} from '../edu14/clock';
import {ShotFrame} from '../edu14/frame';
import '../edu14/shots';

// EDU-EP14 inventory (Editor W5.3 Draft): one plate per shot, ID `EDU14-<shot id>` (the ids of Boss's standalone shot compositions). Boss's `ShotFrame` (src/painted/edu14/frame.tsx) is a pure
// function of its composition frame; the plate mounts it in a `Freeze` at the shot-local frame `L = round(tl * 30)`, so the draw is the same in Studio, random seek and the scene render.
// Hard cuts only; captions and the channel mark come from the timeline (chrome default @TamMaiLa, top-left). Boss's `Painted` draws a dashed caption-band guide unless the input prop
// `guides` is false and `render.mjs` passes no props, so the wrapper hides that one element by its inline dashed border (finding for Boss: a `band` option on `ShotFrame`).
const HIDE_GUIDE = '.edu14-plate [style*="dashed"]{display:none !important}';
export const edu14PlateId = (id: string) => `EDU14-${id}`;
export const edu14Shots: PaintedShot[] = SHOT_TABLE.map(([id]) => ({
  id: edu14PlateId(id), serves: [id], paper: '#6f7f86', camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div className="edu14-plate" style={{position: 'absolute', inset: 0, opacity}}>
      <style>{HIDE_GUIDE}</style>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={id} /></Freeze>
    </div>
  ),
}));
