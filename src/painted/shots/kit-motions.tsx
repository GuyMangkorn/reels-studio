import amplitude from '../../amplitude.json';
import {mouthAt} from '../../rig/drivers';
import {drawFigure} from '../kit/cast';
import {hipAnchor, withRoll} from '../kit/figure-at';
import {rectPts, washAt} from '../kit/draw';
import {layerMotion, motionDuration, MOTION_INFO} from '../kit/motions';
import {MOTION_REEL, REEL_FPS, REEL_GROUND, REEL_UNIT, reelSceneSec, reelShotId, type ReelEntry} from '../kit/motion-reel';
import {PEOPLE} from '../kit/people';
import type {Painter} from '../kit/painter';
import {drawChair} from '../kit/props';
import type {PaintedShot, ShotContext} from '../shot';

// KIT-MOTIONS plates: one per motion preset (`kit/motions.ts`), a labelled proof of the motion on two people. Scene lengths and
// the cast per scene: `kit/motion-reel.ts`. Video: src/videos/kit-motions/index.ts.

/** The narration envelope's first burst (src/amplitude.json frames 126-186) drives the `talk` adult. */
const A_OFFSET = 126;

const paintReel = (e: ReelEntry) => (p: Painter, {tl}: ShotContext) => {
  washAt(p, 1, '#d8cbb0', 200, rectPts(-200, -200, 1280, REEL_GROUND - 6), 0.3, 0.4);
  washAt(p, 2, '#b3a384', 215, rectPts(-200, REEL_GROUND - 6, 1280, 2200), 0.3, 0.4);
  [...e.cast].reverse().forEach((c, ri) => {
    const i = e.cast.length - 1 - ri;
    const f = layerMotion({
      person: c.person, outfit: c.outfit, motion: e.motion, t: tl, g: [c.x, REEL_GROUND], unit: REEL_UNIT, view: c.view, pose: c.pose,
      expression: c.expression, distance: c.distance, seed: c.seed, amp: c.narration ? (t) => mouthAt(amplitude, t * REEL_FPS, -A_OFFSET) : undefined,
    });
    if (e.chair) drawChair(p, 7100 + i, [c.x, REEL_GROUND], REEL_UNIT, f.def, f.view);
    withRoll(p, f.roll ? hipAnchor(f.def, f.g, REEL_UNIT, f.pose) : f.g, f.roll, () => drawFigure(p, f.def, f.g, REEL_UNIT, f.pose, tl, f.seed));
  });
};

const Label = ({e, tl, width, height, opacity}: {e: ReelEntry} & ShotContext & {opacity: number}) => {
  const info = MOTION_INFO[e.motion], dur = Math.max(...e.cast.map((c) => motionDuration(e.motion, {distance: c.distance, height: PEOPLE[c.person].height})));
  const font = 'Noto Sans Thai, Helvetica, Arial, sans-serif';
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width, height, opacity, fontFamily: font, color: '#2b211c'}}>
      <div style={{position: 'absolute', left: 60, top: 150, width: width - 120, fontSize: 56, fontWeight: 700, lineHeight: 1.1}}>{e.motion}</div>
      <div style={{position: 'absolute', left: 60, top: 230, width: width - 120, fontSize: 30, lineHeight: 1.3, color: '#4a3f38'}}>{info.description}</div>
      <div style={{position: 'absolute', left: 60, top: height - 330, width: width - 120, fontSize: 28, color: '#4a3f38'}}>
        {`t = ${Math.min(tl, dur).toFixed(2)} s of ${dur.toFixed(2)} s${info.loop ? ' (loop)' : ''}  |  ${e.cast.map((c) => c.person + (c.view ? ` ${c.view}` : '')).join('  +  ')}`}
      </div>
    </div>
  );
};

export const motionShots: PaintedShot[] = MOTION_REEL.map((e) => ({
  id: reelShotId(e.motion),
  serves: ['KIT-MOTIONS'],
  paper: '#efe6d2',
  camera: () => ({s: 1, fx: 540, fy: 960, dx: 0, dy: 0}),
  paint: paintReel(e),
  Overlay: (props) => <Label e={e} {...props} />,
}));

/** Scene seconds of each reel scene, for tests and the video file. */
export const motionSceneSecs = MOTION_REEL.map(reelSceneSec);
