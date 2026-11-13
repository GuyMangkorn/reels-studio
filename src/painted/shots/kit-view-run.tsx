import {paintFigureAt, viewAtCam} from '../kit/figure-at';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-VIEW-RUN plate (VA02 motion check, not an episode): the P38 run cycle seen from behind and the back three-quarters, so a turned run
// can be checked in motion (legs alternating, feet on the ground, skirt). Columns: camera azimuth 180, 210, 240 deg around a figure with a
// fixed world facing (as KIT-VIEW-AUDIT, with `quarterFollow` and `backQuarter` on); rows: a skirted and a trousered person.
// Video: src/videos/kit-view-run/index.ts. Render: `node scripts/render.mjs KIT-VIEW-RUN --draft`.

export const VIEW_RUN_SEC = 3;
/** Run cadence (cycles per second; one cycle = two steps). */
const CADENCE = 1.4;
const AZ = [180, 210, 240], ROW_PEOPLE = ['woman-curly', 'man-parted'] as const;
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
    paintFigureAt(p, cellCam(col, row), PEOPLE[person], {at: AT, facing: FACING, pose: 'P38', t: tl, seed: 400 + i, quarterFollow: true, backQuarter: true, fig: {run: tl * CADENCE}});
  });
};

const Labels = ({width}: ShotContext) => (
  <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
    {cells.map(({person, row, col}) => {
      const vf = viewAtCam(cellCam(col, row), {at: AT, facing: FACING, quarterFollow: true, backQuarter: true});
      return (
        <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', padding: 10, fontSize: 24}}>
          {AZ[col]}° {vf.quarter ? `${vf.quarter} ${Math.round(vf.quarterDeg ?? 45)}°` : 'back'} · {person}
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 0, width, bottom: 12, textAlign: 'center', fontSize: 28, color: '#7a2e1d'}}>P38 run · back three-quarter (VA02)</div>
  </div>
);

export const viewRunShots: PaintedShot[] = [{
  id: 'kit-view-run',
  serves: ['KIT-VIEW-RUN'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: (props) => <Labels {...props} />,
}];
