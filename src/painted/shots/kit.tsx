import amplitude from '../../amplitude.json';
import {mouthAt} from '../../rig/drivers';
import {pushCamera} from '../kit/camera';
import {drawFigure, type Arm, type FigPose} from '../kit/cast';
import {rectPts, washAt} from '../kit/draw';
import type {FaceState} from '../kit/head';
import {PEOPLE} from '../kit/people';
import {lerp, type Painter, type Pt} from '../kit/painter';
import {poseArms} from '../kit/poses';
import {smoothstep} from '../kit/space';
import type {PaintedShot} from '../shot';
import {animalMotionShots} from './kit-animal-motions';
import {motionShots} from './kit-motions';
import {templateShots} from './kit-templates';

// Kit plates: not an episode, a proof clip for the people library (`kit/people.ts`). Registered so scripts/render.mjs can render it
// through the scene cache (video `KIT-PEOPLE-TALK`, src/videos/kit-people/index.ts).

const FPS = 30;
/** Syllable bursts of the existing narration envelope (src/amplitude.json, 30 fps): frames 126-186 and 246-299. */
const A_OFFSET = 126, B_OFFSET = 200, B_START = 46;
const pulse = (f: number, a0: number, a1: number, b0: number, b1: number) => smoothstep(a0, a1, f) * (1 - smoothstep(b0, b1, f));
const blendArm = (a: Arm, b: Arm, u: number): Arm => ({
  to: [lerp(a.to[0], b.to[0], u), lerp(a.to[1], b.to[1], u)], via: a.via && b.via ? [lerp(a.via[0], b.via[0], u), lerp(a.via[1], b.via[1], u)] : a.via,
  behind: u > 0.5 ? b.behind : a.behind,
});

/**
 * Three people talk. A `man-parted` (front) speaks first with the P15 palms-out gesture, then B `woman-ponytail` (profile) answers;
 * C `boy-school` (profile) listens. Mouths are `mouthAt()` of the narration envelope (A: frames 126+, B: frames 246+), eyes blink
 * on the rig's own clock, brows and nods follow the mouth. Front = P01 idle arms down / P15 stop_both_palms; profile arms hang.
 */
const talk = (p: Painter, {tl}: {tl: number}) => {
  const f = tl * FPS;
  const unit = 640, ground = 1600;
  washAt(p, 1, '#d8cbb0', 200, rectPts(-200, -200, 1280 + 200, ground - 6), 0.3, 0.4);
  washAt(p, 2, '#b3a384', 215, rectPts(-200, ground - 6, 1280 + 200, 2200), 0.3, 0.4);

  const mouthA = f < B_START ? mouthAt(amplitude, f, -A_OFFSET) : 0;
  const mouthB = f >= B_START ? mouthAt(amplitude, f, -B_OFFSET) : 0;
  const talkFace = (open: number, speaking: boolean, afterSmile = false): Pick<FaceState, 'mouth' | 'open'> =>
    speaking ? {mouth: 'talk', open} : {mouth: afterSmile ? 'smile' : 'flat'};

  // A: front, centre. P15 (stop_both_palms, compact so the arms stay clear of B and C) between 0.2 s and 1.4 s, brow lifts with the emphasis.
  const gA: Pt = [540, ground], defA = PEOPLE['man-parted'];
  const p01 = poseArms('P01', defA, gA, unit), p15 = poseArms('P15', defA, gA, unit);
  const gesture = pulse(f, 6, 14, 34, 44);
  const poseA: FigPose = {
    view: 'front', nod: [0, -0.07 * mouthA],
    face: {brow: 'flat', browTo: 'up', browMix: gesture, eyes: 'dot', look: [0, 0], ...talkFace(mouthA, f < B_START, f >= B_START)},
    rArm: blendArm(p01.rArm!, p15.rArm!, gesture), lArm: blendArm(p01.lArm!, p15.lArm!, gesture),
  };
  // B: profile facing right (toward A). Listens (worried brow as A gestures), answers from frame 46.
  const poseB: FigPose = {
    view: 'right', nod: [0, f < B_START ? -0.05 * pulse(f, 18, 24, 28, 36) : -0.06 * mouthB],
    face: {brow: f < B_START ? 'flat' : 'up', browTo: 'worry', browMix: f < B_START ? gesture * 0.8 : 0, eyes: 'dot', look: [0.6, 0], ...talkFace(mouthB, f >= B_START)},
  };
  // C: profile facing left (toward A). Wide-eyed while A talks, smiles when B answers.
  const poseC: FigPose = {
    view: 'left',
    face: {brow: 'up', eyes: f < 60 ? 'wide' : 'dot', look: [0.5, -0.3], mouth: f >= 70 ? 'smile' : 'flat'},
  };
  drawFigure(p, PEOPLE['woman-ponytail'], [195, ground], unit, poseB, tl);
  drawFigure(p, PEOPLE['boy-school'], [885, ground], unit, poseC, tl);
  drawFigure(p, defA, gA, unit, poseA, tl);
};

export const kitShots: PaintedShot[] = [{
  id: 'kit-people-talk',
  serves: ['KIT-PEOPLE-TALK'],
  paper: '#efe6d2',
  camera: (tl) => pushCamera(tl, 3.5, {s0: 1, s1: 1.04, fx: 540, fy: 1100}),
  paint: talk,
}, ...motionShots, ...templateShots, ...animalMotionShots];
