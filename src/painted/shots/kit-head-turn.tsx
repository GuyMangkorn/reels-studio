import {paintFigureAt, viewAtCam} from '../kit/figure-at';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import {smoothstep} from '../kit/space';
import type {YCam} from '../kit/ycam';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-HEAD-TURN plate (motion check, not an episode; user 18 Nov 2026): a close head-and-shoulders camera swings front -> right profile
// -> front -> left profile -> front around two people with `HeadStyle.sideDetail`, with the default view cues, to check that the head
// keeps its height and reads as the same face from front to profile. Dashed guides mark the front head's top and chin.
// KIT-HEAD-TALK-TURN: the same two people talking through a continuous turn. Videos: src/videos/kit-head-turn/index.ts. Render: `node scripts/render.mjs KIT-HEAD-TURN --draft`.

export const HEAD_TURN_SEC = 10;
/** KIT-HEAD-TALK-TURN (user 18 Nov 2026): both people talk the whole time while the camera turns without holds, front -> left -> front -> right, one 6 s cycle, twice. */
export const HEAD_TALK_TURN_SEC = 12;
const ROW_PEOPLE = ['woman-bob', 'man-parted'] as const;
const CW = 1080 / ROW_PEOPLE.length, R = 3, F = 2600, HY = 900;
const AT: [number, number, number] = [0, 0, 0];
const FACING: [number, number] = [0, 1];
/** Camera azimuth keys (seconds, degrees): holds at front and at each profile. */
const KEYS: [number, number][] = [[0, 0], [1, 0], [2.5, 90], [3.5, 90], [5, 0], [5.5, 0], [7, -90], [8, -90], [9.5, 0], [10, 0]];
const azAt = (tl: number): number => {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [t0, a0] = KEYS[i], [t1, a1] = KEYS[i + 1];
    if (tl <= t1) return a0 + (a1 - a0) * smoothstep(t0, t1, tl);
  }
  return 0;
};
/** Head centre height of a person (m): the eye line sits about 0.06 of the height below the top. */
const headY = (person: (typeof ROW_PEOPLE)[number]) => PEOPLE[person].height * 0.94;
const rowCam = (row: number, azDeg: number): YCam => {
  const az = (azDeg * Math.PI) / 180, y = headY(ROW_PEOPLE[row]);
  return {x: AT[0] + R * Math.sin(az), y, z: AT[2] + R * Math.cos(az), yaw: -az, pitch: 0, f: F, hy: HY, cx: (row - 0.5) * CW};
};

const talkAzAt = (tl: number) => 90 * Math.sin((2 * Math.PI * tl) / 6);
/** Synthetic speech: syllables at about 4.5 per second with a short pause every 1.7 s; each row is offset so the two do not move in step. */
const talkOpen = (tl: number, row: number) => {
  const t = tl + row * 0.37, pause = (t % 1.7) > 1.35 ? 0 : 1;
  return pause * Math.max(0, Math.sin(2 * Math.PI * 4.5 * t)) * (0.55 + 0.45 * Math.abs(Math.sin(1.3 * t + row)));
};
const paintWith = (az: (tl: number) => number, talk: boolean) => (p: Painter, {tl}: ShotContext) => {
  ROW_PEOPLE.forEach((person, row) => paintFigureAt(p, rowCam(row, az(tl)), {...PEOPLE[person], head: {...PEOPLE[person].head, sideDetail: true}}, {
    at: AT, facing: FACING, pose: 'P01', t: tl, seed: 500 + row, ...(talk ? {faceState: {mouth: 'talk', open: talkOpen(tl, row)}} : {}),
  }));
};

/** Front-view head top and chin of each column, screen px (measured on frame 0, 18 Nov 2026). */
export const HEAD_GUIDES: [number, number][] = [[797, 1153], [782, 1143]];

const Labels = ({tl, az: azFn = azAt}: ShotContext & {az?: (tl: number) => number}) => {
  const az = azFn(tl);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: 'Helvetica, Arial, sans-serif', color: '#3b3226'}}>
      {ROW_PEOPLE.map((person, row) => {
        const vf = viewAtCam(rowCam(row, az), {at: AT, facing: FACING});
        return (
          <div key={person} style={{position: 'absolute', left: row * CW, top: 0, width: CW, height: 1920, boxSizing: 'border-box', borderRight: '1px solid #cbbfa9', padding: 16, fontSize: 30}}>
            camera {Math.round(az)}° · {vf.quarter ? `${vf.quarter} ${Math.round(vf.quarterDeg ?? 45)}°` : vf.view} · {person}
            {HEAD_GUIDES[row][1] > 0 && HEAD_GUIDES[row].map((y) => <div key={y} style={{position: 'absolute', left: 0, right: 0, top: y, borderTop: '3px dashed #c0503f', opacity: 0.7}} />)}
          </div>
        );
      })}
    </div>
  );
};

export const headTurnShots: PaintedShot[] = [{
  id: 'kit-head-turn',
  serves: ['KIT-HEAD-TURN'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint: paintWith(azAt, false),
  Overlay: (props) => <Labels {...props} />,
}, {
  id: 'kit-head-talk-turn',
  serves: ['KIT-HEAD-TALK-TURN'],
  paper: '#efe8dc',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint: paintWith(talkAzAt, true),
  Overlay: (props) => <Labels {...props} az={talkAzAt} />,
}];
