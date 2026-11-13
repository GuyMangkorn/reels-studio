import {paintFigureAt, viewAtCam} from '../kit/figure-at';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-VIEW-ORBIT plate (motion check, not an episode): the camera makes one full orbit around a standing figure with a fixed world facing,
// with the default view cues (eight views, `quarterFollow` to 75 deg, the cut to the profile at 82.5 deg). Watch the three-quarter turn into
// the profile and the back three-quarter into the back. Rows: a skirted and a trousered person.
// Video: src/videos/kit-view-orbit/index.ts. Render: `node scripts/render.mjs KIT-VIEW-ORBIT --draft`.

export const VIEW_ORBIT_SEC = 8;
const ROW_PEOPLE = ['woman-curly', 'man-parted'] as const;
const CH = 1920 / ROW_PEOPLE.length, R = 4, F = 1300, AIM = 0.85, EYE = 0.85;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];

const azAt = (tl: number) => (360 * Math.min(1, tl / VIEW_ORBIT_SEC)) % 360;
const rowCam = (row: number, azDeg: number): YCam => {
  const az = (azDeg * Math.PI) / 180;
  return {x: AT[0] + R * Math.sin(az), y: EYE, z: AT[2] + R * Math.cos(az), yaw: -az, pitch: Math.atan2(AIM - EYE, R), f: F, hy: row * CH + CH / 2 + 60, cx: 0};
};

const paint = (p: Painter, {tl}: ShotContext) => {
  ROW_PEOPLE.forEach((person, row) => paintFigureAt(p, rowCam(row, azAt(tl)), PEOPLE[person], {at: AT, facing: FACING, pose: 'P01', t: tl, seed: 500 + row}));
};

const Labels = ({width, tl}: ShotContext) => {
  const az = azAt(tl);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
      {ROW_PEOPLE.map((person, row) => {
        const vf = viewAtCam(rowCam(row, az), {at: AT, facing: FACING});
        return (
          <div key={person} style={{position: 'absolute', left: 0, top: row * CH, width, height: CH, boxSizing: 'border-box', borderBottom: '1px solid #cbbfa9', padding: 16, fontSize: 34}}>
            camera {Math.round(az)}° · {vf.quarter ? `${az > 90 && az < 270 ? 'back' : 'front'}-${vf.quarter} ${Math.round(vf.quarterDeg ?? 45)}°` : vf.view} · {person}
          </div>
        );
      })}
    </div>
  );
};

export const viewOrbitShots: PaintedShot[] = [{
  id: 'kit-view-orbit',
  serves: ['KIT-VIEW-ORBIT'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint,
  Overlay: (props) => <Labels {...props} />,
}];
