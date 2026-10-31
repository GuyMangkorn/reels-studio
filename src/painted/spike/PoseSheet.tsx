import {STILL_CAMERA} from '../kit/camera';
import {POSE_IDS, POSES, poseArms} from '../kit/poses';
import type {Pt} from '../kit/painter';
import type {PaintedShot} from '../shot';
import {VD18_LIGHT} from '../shots/worldfog';
import {CAST, drawFigure} from '../worldfog/cast';
import {PlatePreview} from './PlatePreview';

// Pose sheet review (user sheet P01-P30, 31 Oct 2026): every pose from the shared library (kit/poses.ts) on the narrator,
// six per row, each labelled with its pose ID. Spike: serves no shot; it checks the converted hand targets only.
// Labels name the pose ID and any prop the kit lacks (cup, notebook, laptop, box).
export const POSE_SHEET_SIZE = {width: 1800, height: 2560};
const UNIT = 220, COL = 300, ROW = 500;
const CELLS = POSE_IDS.map((id, i) => {
  const c = i % 6, r = Math.floor(i / 6);
  return {id, x: c * COL, y: r * ROW + 4, g: [c * COL + 150, r * ROW + 488] as Pt};
});

const sheet: PaintedShot = {
  id: 'WFOG-POSE-SHEET',
  serves: ['pose sheet P01-P30 review (spike, no shot)'],
  paper: '#5b6463',
  camera: () => STILL_CAMERA,
  paint: (p, {tl}) => {
    for (const c of CELLS) {
      drawFigure(p, 'narrator', c.g, UNIT, {
        view: 'front', light: VD18_LIGHT['CAM-INT-REV'], face: {brow: 'flat', eyes: 'dot', look: [0, 0], mouth: 'flat'},
        ...poseArms(c.id, CAST.narrator, c.g, UNIT),
      }, tl);
    }
  },
  Overlay: () => (
    <>
      {CELLS.map((c) => (
        <div key={c.id} style={{position: 'absolute', left: c.x, top: c.y, width: 300, textAlign: 'center', fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 22, lineHeight: 1.15, color: '#fff', WebkitTextStroke: '5px #111', paintOrder: 'stroke'}}>
          {c.id} {POSES[c.id].name}
          {POSES[c.id].missing && <div style={{fontSize: 20, color: '#ffd27a'}}>prop missing: {POSES[c.id].missing}</div>}
        </div>
      ))}
      <div style={{position: 'absolute', left: 20, top: 2500, width: 1760, fontFamily: 'Noto Sans Thai, sans-serif', fontSize: 24, color: '#fff', WebkitTextStroke: '4px #111', paintOrder: 'stroke'}}>
        POSE-SHEET P01-P30 · spike WFOG-POSE-SHEET · serves no shot · narrator (CAST) · hand targets src/painted/kit/poses.ts
      </div>
    </>
  ),
};

export const PoseSheet = () => <PlatePreview shot={sheet} G0={0} label={false} note="" />;
