import {STILL_CAMERA} from '../kit/camera';
import {Grade, Grain} from '../kit/screen';
import type {YCam} from '../kit/ycam';
import type {PaintedShot} from '../shot';
import {paintB01Band, paintB01Desk, paintHeroCat} from './b01-set';
import {b01Sh02Act} from './b01-sh02';

// EDU-EP32-SHORT-PIC-COVERS cover-only plates (Film, 2026-11-21; cover-design skill pick 1, CV07). Not imported by the episode inventory
// (src/painted/shots/edu32.tsx). Every subject and event is in the film.
//   EDU32-COVER-EAR  B01-SH02 (the hero cat in profile on page BP, the mic in the ear, L01 hook): camera-only push-in on the head and ear.
//                    The ear-mic circle is a cover-layout element (graphic cue), not painted.
const EAR_CAM: YCam = {x: -0.06, y: 1.24, z: 0.42, yaw: 0, pitch: 0, f: 900, hy: 800};
const MIC_CAM: YCam = {x: 0.018, y: 1.37, z: 0.17, yaw: 0, pitch: 0, f: 900, hy: 800};
const cover = (id: string, cam: YCam): PaintedShot => ({id, serves: ['B01-SH02'], paper: '#2c2630', camera: () => STILL_CAMERA,
  paint: (p) => {
    paintB01Desk(p, cam); paintB01Band(p, cam);
    paintHeroCat(p, cam, 'B01-SH02', 2.7 + 30 / 30, b01Sh02Act(30));
  },
  Overlay: ({opacity}) => <div style={{position: 'absolute', inset: 0, opacity}}><Grade /><Grain opacity={0.08} /></div>});
//   EDU32-COVER-MIC  the same shot pushed to the ear alone (the mic and its wire fill the frame), subject-close idea.
export const edu32CoverShots: PaintedShot[] = [cover('EDU32-COVER-EAR', EAR_CAM), cover('EDU32-COVER-MIC', MIC_CAM)];
