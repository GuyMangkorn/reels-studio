import {Freeze} from 'remotion';
import type {PaintedShot} from '../../painted/shot';
import {STILL_CAMERA} from '../../painted/kit/camera';
import {FPS} from './clock';
import {ShotFrame, edu18Plates} from './shots';

// EDU-EP18 plate inventory (Editor, 14 Nov 2026): `EDU18-<shot>` plates mount `ShotFrame` in a Freeze at the shot-local frame L = round(tl * 30), the same way as the EDU-EP15 plates, so a frame
// is the same in Studio, random seek and the scene render. The plate clock of a dissolve plate starts at `fromSec` (the shot-local time of its cue), so the picture continues.
export const edu18Shots: PaintedShot[] = edu18Plates.map(({plate, def, par, serves}) => ({
  id: plate, serves, paper: '#151a2a', camera: () => STILL_CAMERA, paint: () => {},
  Overlay: ({tl, opacity}) => (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Freeze frame={Math.round(tl * FPS)}><ShotFrame id={def} par={par} /></Freeze>
    </div>
  ),
}));
