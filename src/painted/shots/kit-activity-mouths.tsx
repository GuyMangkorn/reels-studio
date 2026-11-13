import {paintFigureAt, type FigureAtOpts} from '../kit/figure-at';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-ACTIVITY-CLIP plate (activity mouths check, 13 Nov 2026, not an episode): the activity mouths in motion, chest-up, front / 3/4 /
// profile. Rows: the P38 run cycle with its default panting mouth; P05 with the `talk` face on its default syllable cycle; the run
// again with a forced `surprise` landing at 2 s. Video: src/videos/kit-activity-mouths/index.ts.
// Render: `node scripts/render.mjs KIT-ACTIVITY-CLIP --range=0-119` (full size: the mouths are too small to judge in a draft).

export const ACTIVITY_CLIP_SEC = 4;
const CADENCE = 1.4;
const AZ = [0, 45, 90];
const ROWS: {label: string; o: Omit<FigureAtOpts, 'at' | 't'>; run?: boolean}[] = [
  {label: 'run · P38 · pant (default)', o: {pose: 'P38', face: 'neutral'}, run: true},
  {label: 'talk · P05 · talk cycle (default)', o: {pose: 'P05', face: 'talk'}},
  {label: 'run + surprise at 2 s (activity: surprise)', o: {pose: 'P38', face: 'neutral', activityAt: 2}, run: true},
];
const CW = 1080 / AZ.length, CH = 1920 / ROWS.length, R = 2.6, F = 900, AIM = 1.25, EYE = 1.45;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];

const cellCam = (col: number, row: number): YCam => {
  const az = (AZ[col] * Math.PI) / 180;
  return {x: AT[0] + R * Math.sin(az), y: EYE, z: AT[2] + R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2, cx: col * CW + CW / 2 - 540};
};

const paint = (p: Painter, {tl}: ShotContext) => {
  ROWS.forEach((r, row) => {
    AZ.forEach((_, col) => {
      const o: FigureAtOpts = {...r.o, at: AT, facing: FACING, t: tl, seed: 600 + row * 3 + col, shadow: false, ...(r.run ? {fig: {run: tl * CADENCE}} : {})};
      // Row 3 runs with the default pant until the surprise lands.
      if (r.o.activityAt !== undefined && tl >= r.o.activityAt) o.activity = 'surprise';
      paintFigureAt(p, cellCam(col, row), PEOPLE['man-parted'], o);
    });
    // p5.brush has no clip: a paper underlayer covers what spilled below the row before the next row paints.
    const y = (row + 1) * CH;
    p.flat('#efe8dc', [[0, y], [1080, y], [1080, 1920], [0, 1920]]);
  });
};

const Labels = ({tl}: ShotContext) => (
  <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
    {ROWS.map((r, row) => AZ.map((_, col) => (
      <div key={`${row}-${col}`} style={{position: 'absolute', left: col * CW, top: row * CH, width: CW, height: CH, boxSizing: 'border-box', border: '1px solid #cbbfa9', padding: 8, fontSize: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <span>{col === 0 ? r.label : ''}</span><span>{['front', '3/4', 'profile'][col]}</span>
      </div>
    )))}
    <div style={{position: 'absolute', right: 12, top: 8, fontSize: 24, color: '#7a2e1d'}}>{tl.toFixed(2)} s</div>
  </div>
);

export const activityMouthShots: PaintedShot[] = [{
  id: 'kit-activity-mouths',
  serves: ['KIT-ACTIVITY-CLIP'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: (props) => <Labels {...props} />,
}];
