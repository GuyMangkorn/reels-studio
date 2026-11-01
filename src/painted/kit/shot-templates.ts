import type {Camera} from './camera';
import {drawFigure, H} from './cast';
import type {ExpressionId} from './expressions';
import {CHIN, HEAD_SPAN} from './head';
import {layerMotion, seg, type Layered, type MotionId} from './motions';
import type {Painter, Pt} from './painter';
import {PEOPLE, type PersonId} from './people';
import type {AnyPoseId, View} from './poses';
import type {OutfitId} from './wardrobe';

// Shot templates for the painted kit: whole-shot arrangements (two-shot, three-shot, talking close-up, side walk, POV) built from the
// people library, expressions, wardrobe, poses and motion presets. Added 1 Nov 2026 (pass 3). Demo: KIT-SHOT-TEMPLATES
// (`shots/kit-templates.tsx`, scene list `kit/template-reel.ts`). Stable IDs: `SHOT_TEMPLATE_IDS`, `POV_POSES`.
//
// A template is a PURE function of shot-local time `t` (seconds, frame / fps). It returns the figures in back-to-front order, each
// exactly as `layerMotion` returns it plus the px per metre it is drawn at, and the shot camera for that moment:
//
//   const tpl = twoShot({cast: [{person: 'man-parted', outfit: 'office'}, {person: 'woman-ponytail'}], t, g: [540, 1560], unit: 540});
//   // in the shot's paint: drawShotTemplate(p, tpl, t);   in the shot's camera: tpl.camera
//
// Rules
// - No Math.random, no Date, no module state: the same arguments give the same output (tests/shot-templates.test.ts).
// - Figures are flat cards at one depth. A layout picks a profile view (face-off: facing each other) or the front; a turn is a cut.
// - `unit` is px per metre of a figure at its own height. Only a layout that puts a figure nearer the lens scales it (POV `closeness`),
//   and that apparent-size change is recorded (docs/scale-and-perspective-principles.md section 5), the height in metres is unchanged.
// - Two figures of one `PEOPLE` id get distinct seeds (`seedOf`), so their fills never match.
// - Camera: every template returns a camera with an intentional move (a push, a follow); `camAt` keeps a focus point on its screen point.

/** One cast member of a template. The same fields as a casting line (`casting.ts`: `man-parted + office, P15, scared`). */
export type CastMember = {
  /** A `PEOPLE` id (`people.ts`). */
  person: PersonId;
  /** A wardrobe outfit (`wardrobe.ts`); absent = the person's own clothes. */
  outfit?: OutfitId;
  /** An expression preset (`expressions.ts`); absent = neutral. */
  expression?: ExpressionId;
  /** A pose id P01-P45 (`poses.ts`); absent = the template's default (P01 idle, or P16 for POV). */
  pose?: AnyPoseId;
};

/** A figure placed by a template: `layerMotion`'s output (`def`, `g`, `pose`, `seed`, `view`, `frame`) and its px per metre. */
export type ShotLayer = Layered & {unit: number};

/** What a template returns at one time: figures back to front, and the shot camera. */
export type ShotTemplate = {
  layers: ShotLayer[];
  camera: Camera;
};

/** Inputs every template takes. */
export type TemplateArgs = {
  cast: CastMember[];
  /** Shot-local seconds. */
  t: number;
  /** Rest ground point of the shot's centre, plate px (x right, y down). Layouts place figures relative to it. */
  g: Pt;
  /** Px per metre of an unscaled figure (a 1080 px wide Short fits two people side by side at 540). */
  unit: number;
  /** Index into `cast` of the member who speaks: that member gets the `talk` motion (mouth open from `amp`). */
  speaker?: number;
  /** Mouth openness 0..1 of the speaker at shot time (lip-sync: `(t) => mouthAt(amplitude, t * fps, offset)`); seeded syllables when absent. */
  amp?: (t: number) => number;
};

export type TwoShotArgs = TemplateArgs & {
  /** `face-off`: the left figure faces right, the right figure faces left (profiles). `side-by-side`: both stand front on. */
  layout?: 'face-off' | 'side-by-side';
  /** Centre-to-centre distance, metres. Default 1.2 (face-off), 0.9 (side-by-side). */
  gap?: number;
};
export type ThreeShotArgs = TemplateArgs & {
  /** Metres from the middle figure to each outer figure. Default 0.95 (1.1 clipped the left figure at the frame edge in KIT-SHOT-TEMPLATES). */
  gap?: number;
};
export type CloseUpArgs = TemplateArgs & {
  /** The speaker's view. Default front. */
  view?: 'front' | 'left' | 'right';
  /** Zoom of the crop. Default 3.2 (head about 40% of a 1920 px frame, chest at the bottom edge). */
  zoom?: number;
  /** Screen point the head centre sits on, composition px. Default [540, 900]: head near the top third, chest at the bottom edge. */
  headAt?: Pt;
};
export type SideWalkArgs = TemplateArgs & {
  /** Direction of travel across the frame: `right` enters from the screen left and walks toward the right. Default right. */
  dir?: 'right' | 'left';
  /** Travel distance, metres (the walk brakes into standing at the rest point). Default 2. */
  distance?: number;
  /** Fraction of the walker's offset the camera follows (1 = the walker holds its screen place, 0 = a still camera). Default 1. */
  follow?: number;
};
export type PovArgs = TemplateArgs & {
  /** How much nearer the lens the other person stands: px per metre = `unit` x closeness. Default 1.35. */
  closeness?: number;
};

/** Poses that face the viewer (`poses.ts`, `poses-more.ts`): P13 punch, P14 point, P16 reach, P41 accuse. */
export const POV_POSES = ['P13', 'P14', 'P16', 'P41'] as const;

export const SHOT_TEMPLATE_IDS = ['two-shot', 'three-shot', 'talking-close-up', 'side-walk', 'pov'] as const;
export type ShotTemplateId = (typeof SHOT_TEMPLATE_IDS)[number];
export const SHOT_TEMPLATE_INFO: Record<ShotTemplateId, {cast: string; description: string; use: string}> = {
  'two-shot': {cast: '2', description: 'Two figures in one frame: face-off (profiles facing each other) or side by side (both front).', use: 'A conversation between two people; the speaker talks, the other listens.'},
  'three-shot': {cast: '3', description: 'Three figures: the middle one stands front on, the outer two in profile facing in.', use: 'A group in conversation; the middle person leads.'},
  'talking-close-up': {cast: '1', description: 'Head and shoulders crop of one speaker: the camera zooms about the head and pushes in slowly; the mouth follows `amp`.', use: 'A line spoken to the camera or to someone off screen.'},
  'side-walk': {cast: '1', description: 'Profile walk across the frame; the camera follows the walker, so the background slides past.', use: 'A person walks through the shot; the street shows the motion.'},
  pov: {cast: '1', description: 'Viewer-eye: one person stands toward the camera and reaches or points at the viewer (P13, P14, P16 or P41), drawn 1.35 times nearer, with a slow push-in.', use: 'The viewer is addressed: "you", a hand reaching toward the viewer.'},
};

/** Seed of cast member `i`: its person's seed, and +1000 for each earlier member of the same person. */
const seedOf = (cast: CastMember[], i: number): number => PEOPLE[cast[i].person].seed + 1000 * cast.slice(0, i).filter((m) => m.person === cast[i].person).length;

const FRAME_CENTRE: Pt = [540, 960];

/** The motion a member plays: `talk` for the speaker, `idle-breathe` (a held figure) for the rest. */
const motionFor = (a: TemplateArgs, i: number): MotionId => (a.speaker === i ? 'talk' : 'idle-breathe');

/** One figure: `layerMotion` on the member's person, outfit, expression and pose, with `amp` for the talking motion only. */
const figure = (a: TemplateArgs, i: number, g: Pt, unit: number, view: View, motion: MotionId, distance?: number): ShotLayer => {
  const m = a.cast[i];
  const f = layerMotion({
    person: m.person, outfit: m.outfit, motion, t: a.t, g, unit, view, pose: m.pose, expression: m.expression,
    seed: seedOf(a.cast, i), distance, amp: motion === 'talk' ? a.amp : undefined,
  });
  return {...f, unit};
};

/** A push from s0 to s1 over `len` seconds (smoothstep, as `seg`). */
const push = (t: number, len: number, s0: number, s1: number): number => s0 + (s1 - s0) * seg(t, 0, len);

/** A camera of zoom `s` that keeps `focus` on the screen point `screen` (default: the focus itself) at every zoom. */
const camAt = (s: number, focus: Pt, screen: Pt = focus): Camera => ({s, fx: focus[0], fy: focus[1], dx: screen[0] - focus[0], dy: screen[1] - focus[1]});

const want = (name: string, n: number, cast: CastMember[]): void => {
  if (cast.length !== n) throw new Error(`${name} takes ${n} cast member${n === 1 ? '' : 's'}, got ${cast.length}`);
};

/**
 * Head centre (plate px) of an upright standing figure at ground point `g`, front view, no nod or rise. The rig's own formula
 * (`drawFigure`: `hc` at the chin plus one head's CHIN units, the head scaled by `headScale`).
 */
export const headPoint = (person: PersonId, g: Pt, unit: number): Pt => {
  const def = PEOPLE[person], HD = H * (def.headScale ?? 1), K = HD / HEAD_SPAN;
  return [g[0], g[1] - (def.height - HD + CHIN * K) * unit];
};

/**
 * Two people. Face-off: the left figure in profile faces right, the right figure faces left. Side by side: both stand front on.
 * `g` is the centre between them. The frame pushes in 5% over 2 s about the frame centre.
 */
export const twoShot = (a: TwoShotArgs): ShotTemplate => {
  want('twoShot', 2, a.cast);
  const faceOff = (a.layout ?? 'face-off') === 'face-off';
  const half = ((a.gap ?? (faceOff ? 1.2 : 0.9)) * a.unit) / 2;
  const left = figure(a, 0, [a.g[0] - half, a.g[1]], a.unit, faceOff ? 'right' : 'front', motionFor(a, 0));
  const right = figure(a, 1, [a.g[0] + half, a.g[1]], a.unit, faceOff ? 'left' : 'front', motionFor(a, 1));
  return {layers: [left, right], camera: camAt(push(a.t, 2, 1, 1.05), FRAME_CENTRE)};
};

/**
 * Three people in an arc: the outer two stand in profile and face the middle one, who stands front on and is drawn last (in front).
 * `g` is the middle figure's ground point. The frame pushes in 4% over 2 s.
 */
export const threeShot = (a: ThreeShotArgs): ShotTemplate => {
  want('threeShot', 3, a.cast);
  const d = (a.gap ?? 0.95) * a.unit;
  const left = figure(a, 0, [a.g[0] - d, a.g[1]], a.unit, 'right', motionFor(a, 0));
  const right = figure(a, 2, [a.g[0] + d, a.g[1]], a.unit, 'left', motionFor(a, 2));
  const mid = figure(a, 1, a.g, a.unit, 'front', motionFor(a, 1));
  return {layers: [left, right, mid], camera: camAt(push(a.t, 2, 1, 1.04), FRAME_CENTRE)};
};

/**
 * Talking close-up: the one speaker (`talk` motion, mouth from `amp`) cropped to head and shoulders. The camera zooms about the head,
 * which stays on `headAt`, and pushes in 6% over 2 s.
 */
export const talkingCloseUp = (a: CloseUpArgs): ShotTemplate => {
  want('talkingCloseUp', 1, a.cast);
  const zoom = a.zoom ?? 3.2;
  const speaker = figure(a, 0, a.g, a.unit, a.view ?? 'front', 'talk');
  return {layers: [speaker], camera: camAt(push(a.t, 2, zoom, zoom * 1.06), headPoint(a.cast[0].person, a.g, a.unit), a.headAt ?? [540, 900])};
};

/**
 * Side walk: a profile walk across the frame (`walk-in-from-left` for `right`, `walk-in-from-right` for `left`) that brakes into
 * standing at `g`. The camera follows `follow` of the walker's offset, so with follow 1 the walker holds its screen place and the
 * painted street moves past. Draw the street in world space; it must extend `distance` plus half a frame beyond `g`.
 */
export const sideWalk = (a: SideWalkArgs): ShotTemplate => {
  want('sideWalk', 1, a.cast);
  const walker = figure(a, 0, a.g, a.unit, 'front', (a.dir ?? 'right') === 'right' ? 'walk-in-from-left' : 'walk-in-from-right', a.distance ?? 2);
  const dx = (a.follow ?? 1) * (a.g[0] - walker.g[0]); // screen x = world x + dx: the walker's offset is cancelled (+0 when it has none)
  return {layers: [walker], camera: {s: 1, fx: FRAME_CENTRE[0], fy: FRAME_CENTRE[1], dx, dy: 0}};
};

/**
 * POV (viewer-eye): one person stands toward the camera with a pose from `POV_POSES` (default P16, reach toward the viewer). The
 * figure is drawn `closeness` times the unit, so it reads as nearer the lens; its height in metres is unchanged. The camera pushes in
 * 6% over 2 s about the head, which does not move on screen (a larger push takes the feet off the bottom edge).
 */
export const povShot = (a: PovArgs): ShotTemplate => {
  want('povShot', 1, a.cast);
  const pose = a.cast[0].pose ?? 'P16';
  if (!(POV_POSES as readonly string[]).includes(pose)) throw new Error(`povShot: pose ${pose} does not face the viewer; use ${POV_POSES.join(', ')}`);
  const unit = a.unit * (a.closeness ?? 1.35), cast = [{...a.cast[0], pose}];
  const other = figure({...a, cast}, 0, a.g, unit, 'front', motionFor(a, 0));
  return {layers: [other], camera: camAt(push(a.t, 2, 1, 1.06), headPoint(cast[0].person, a.g, unit))};
};

/** Draws a template's figures back to front at shot time `t` (the plate clock: the rig's blink). */
export const drawShotTemplate = (p: Painter, tpl: ShotTemplate, t: number): void => {
  for (const l of tpl.layers) drawFigure(p, l.def, l.g, l.unit, l.pose, t, l.seed);
};
