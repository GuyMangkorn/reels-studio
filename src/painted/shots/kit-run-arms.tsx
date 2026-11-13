import {paintFigureAt, viewAtCam} from '../kit/figure-at';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-RUN-ARMS-CLIP plate (motion check, not an episode): the P38 run cycle seen from the front and both front three-quarters, so the arm
// pump (elbow low, fist to the chest) and the turned side of the jacket can be checked in motion (KIT-RUN-ARMS, 13 Nov 2026). Columns: camera
// azimuth 0, 45, 315 deg round a figure with a fixed world facing; rows: a jacketed man and a woman in a skirt. Stills: `kit/run-arms-sheet.tsx`.
// Video: src/videos/kit-run-arms/index.ts. Render: `node scripts/render.mjs KIT-RUN-ARMS-CLIP --draft`.

export const RUN_ARMS_SEC = 3;
/** Run cadence (cycles per second; one cycle = two steps), as KIT-VIEW-RUN. */
const CADENCE = 1.4;
const AZ = [0, 45, 315], ROW_PEOPLE = ['man-parted', 'woman-curly'] as const;
const CW = 1080 / AZ.length, CH = 1920 / ROW_PEOPLE.length, R = 4, F = 1100, AIM = 0.85, EYE = 0.85;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];

const cellCam = (col: number, row: number): YCam => {
  const az = (AZ[col] * Math.PI) / 180;
  return {x: AT[0] + R * Math.sin(az), y: EYE, z: AT[2] + R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2 + 40, cx: col * CW + CW / 2 - 540};
};
const cells = ROW_PEOPLE.flatMap((person, row) => AZ.map((_, col) => ({person, row, col})));

const paint = (p: Painter, {tl}: ShotContext) => {
  cells.forEach(({person, row, col}, i) => {
    paintFigureAt(p, cellCam(col, row), PEOPLE[person], {at: AT, facing: FACING, pose: 'P38', t: tl, seed: 450 + i, fig: {run: tl * CADENCE}});
  });
};

const Labels = ({width}: ShotContext) => (
  <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
    {cells.map(({person, row, col}) => {
      const vf = viewAtCam(cellCam(col, row), {at: AT, facing: FACING});
      return (
        <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', padding: 10, fontSize: 24}}>
          {AZ[col]}° {vf.quarter ? `${vf.quarter} ${Math.round(vf.quarterDeg ?? 45)}°` : 'front'} · {person}
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 0, width, bottom: 12, textAlign: 'center', fontSize: 28, color: '#7a2e1d'}}>P38 run · arm pump and turned side (KIT-RUN-ARMS)</div>
  </div>
);

export const runArmsShots: PaintedShot[] = [{
  id: 'kit-run-arms',
  serves: ['KIT-RUN-ARMS-CLIP'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: (props) => <Labels {...props} />,
}];
