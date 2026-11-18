// Mid-shot hand kit (KIT-MID-HANDS, 18 Nov 2026): a rig figure about 1.3 m from the camera (thigh-up) with five-finger macro hands instead
// of the mitten (user, 18 Nov 2026: at 1-1.5 m the fingers read; at 2-3 m they shrink to ~11 px, so full-figure shots keep the UT14 mitten). Each action places the wrists in the
// character's own body frame (x = their right, y = up, z = their forward), solves the elbows, draws the rig arm to that wrist with
// `noHand`, and paints the macro hand on it. The same action works facing the camera and back to it, so the right arm lands on the screen
// side the view gives and the thumb follows the 3D hand. Rules: .claude/skills/hand-drawing/SKILL.md. No Remotion import.
import {BONE, type Arm, type CastDef} from './cast';
import {paintFigureAt} from './figure-at';
import {type ExpressionId} from './expressions';
import {type GestureId, type HandSide} from './hand-gestures';
import {blinking} from './head';
import {PROPS, frameOf, type Frame3} from './hand-props';
import {LANDMARKS, cross3, dist3, dot3, elbowIK, forwardFor, norm3, specHand, toneFromSkin, type HandSpec, type Sk} from './hand-place';
import {macroSkeleton, paintHandMacro, type HandMacro} from './hands';
import {type Occluder3D} from './hand3d';
import {type Painter, type Pt} from './painter';
import {PEOPLE, type PersonId} from './people';
import {shoulderAnchors} from './poses';
import {add3, scale3, sub3, type V3} from './space';
import {camDepth, camPoint, type YCam} from './ycam';
import {type KitProp} from './pov-hands';

/** Body frame of a figure in world: `x` their right, `y` up, `z` their forward. */
export type Body = {at: V3; x: V3; y: V3; z: V3; def: CastDef; view: 'front' | 'back'};
/** World point from body-frame metres measured from the ground point. */
export const bodyAt = (b: Body, [x, y, z]: V3): V3 => add3(add3(add3(b.at, scale3(b.x, x)), scale3(b.y, y)), scale3(b.z, z));
export const bodyDir = (b: Body, [x, y, z]: V3): V3 => norm3(add3(add3(scale3(b.x, x), scale3(b.y, y)), scale3(b.z, z)));
/** Shoulder joint (world) the rig draws the arm from: `shoulderAnchors` turned into the body frame. */
export const bodyShoulder = (b: Body, side: HandSide): V3 => {
  const s = shoulderAnchors(b.def).r;
  return bodyAt(b, [(side === 'right' ? 1 : -1) * Math.abs(s[0]), s[1], 0]);
};
/** A figure at `at` squared to camera `cam`, facing it (`front`) or turned away (`back`). */
export const bodyFor = (cam: YCam, def: CastDef, at: V3, view: 'front' | 'back'): Body => {
  const R: V3 = [Math.cos(cam.yaw), 0, Math.sin(cam.yaw)], T: V3 = [-Math.sin(cam.yaw), 0, Math.cos(cam.yaw)];
  return view === 'front' ? {at, x: scale3(R, -1), y: [0, 1, 0], z: T, def, view} : {at, x: R, y: [0, 1, 0], z: scale3(T, -1), def, view};
};

/** One hand of a mid action, body frame. `w`: wrist from the shoulder (x outward from the body for this side, y up, z forward); a `put` places a landmark instead. */
type MidHand = {gesture: GestureId; w?: V3; put?: {landmark: (sk: Sk) => V3; at: V3}; f?: V3; b?: V3; thumb?: V3};
type MidProp = {id: KitProp['id']; frame: (sk: Sk, b: Body) => Frame3; front?: boolean};
export type MidAction = {verb: string; th: string; r?: MidHand; l?: MidHand; prop?: MidProp & {hand: 'r' | 'l'}};
/** The face each action reads with (`EXPRESSIONS`); unlisted actions keep `neutral`. */
export const MID_FACE: Partial<Record<string, ExpressionId>> = {
  wave: 'happy', stop: 'angry', 'point-up': 'surprised', 'point-camera': 'smug', 'thumbs-up': 'happy', ok: 'happy', peace: 'happy', 'fist-pump': 'happy',
  'hand-on-chest': 'relieved', 'phone-call': 'talk', 'offer-apple': 'happy', 'hands-on-hips': 'smug', wai: 'happy', shrug: 'worried', clap: 'happy',
  present: 'happy', 'scratch-head': 'worried', 'chin-think': 'suspicious',
  facepalm: 'worried', 'cover-mouth': 'surprised', 'hands-on-head': 'surprised', 'arms-crossed': 'smug', 'wait-finger': 'talk', beckon: 'smug',
  'point-down': 'talk', 'count-on-fingers': 'talk', 'hold-money': 'happy',
};
/** A clock time with the eyes open (the rig blinks on its own clock; a still at a blink reads as asleep). */
export const openEyesT = (seed: number) => { for (let t = 0.4; t < 4; t += 0.1) if (!blinking(t, seed) && !blinking(t + 0.2, seed)) return t; return 1; };
// Body-frame points from the ground: chest centre, mouth, ear (right), for a 1.75 m adult; `bodyAt` scales nothing, so actions use `hScale`.
const HANG: MidHand = {gesture: 'relaxed', w: [0.03, -0.53, 0.03], f: [0, -1, 0.06], b: [0.85, 0, 0.5]};

/** Mid actions. Hands not named hang relaxed. Directions and offsets: x outward for that hand's side, y up, z forward. */
export const MID_ACTIONS = {
  idle: {verb: 'arms hanging, relaxed hands', th: 'ยืนปล่อยแขน'},
  wave: {verb: 'wave hello', th: 'โบกมือทักทาย', r: {gesture: 'open-spread', w: [0.2, 0.18, 0.1], f: [0.2, 1, 0], b: [0, 0, -1]}},
  stop: {verb: 'stop! palm out', th: 'ยกมือห้าม', r: {gesture: 'stop', w: [-0.02, -0.04, 0.42], f: [-0.05, 1, 0.1], b: [0, 0, -1]}},
  'point-side': {verb: 'point to the side', th: 'ชี้ไปด้านข้าง', r: {gesture: 'point', w: [0.26, 0.06, 0.26], f: [0.6, 0.08, 0.8], b: [0, 1, 0]}},
  'point-up': {verb: 'point up', th: 'ชี้ขึ้นฟ้า', r: {gesture: 'point', w: [0.16, 0.24, 0.12], f: [0, 1, 0], b: [0.3, 0, -1]}},
  'point-camera': {verb: 'point at the camera (you!)', th: 'ชี้มาที่คนดู', r: {gesture: 'point', w: [-0.02, -0.08, 0.44], f: [-0.1, 0.1, 1], b: [0, 1, 0]}},
  'thumbs-up': {verb: 'thumbs up', th: 'ยกนิ้วโป้ง', r: {gesture: 'thumbs-up', w: [0.06, -0.14, 0.34], thumb: [0, 1, 0], b: [1, 0, 0.3]}},
  ok: {verb: 'OK sign', th: 'โอเค', r: {gesture: 'ok', w: [0.06, -0.02, 0.32], f: [0, 1, 0.15], b: [0, 0, -1]}},
  peace: {verb: 'peace sign', th: 'ชูสองนิ้ว', r: {gesture: 'peace', w: [0.14, 0.14, 0.22], f: [0.1, 1, 0], b: [0, 0, -1]}},
  'count-three': {verb: 'count three', th: 'นับสาม', r: {gesture: 'three', w: [0.04, 0.0, 0.32], f: [0, 1, 0.1], b: [0, 0, -1]}},
  'fist-pump': {verb: 'fist pump, yes!', th: 'กำหมัดดีใจ', r: {gesture: 'fist', w: [0.14, 0.06, 0.1], f: [0, 1, 0.05], b: [0.3, 0, 1]}}, // knuckles to the front: reads as a fist
  'hand-on-chest': {verb: 'hand on the chest', th: 'มือแตะอก', r: {gesture: 'relaxed', w: [-0.12, -0.27, 0.13], f: [-1, 0.35, 0], b: [0, 0, 1]}},
  'hold-cup': {verb: 'hold a cup', th: 'ถือแก้ว', r: {gesture: 'grip', w: [0.02, -0.3, 0.3], thumb: [0, 1, 0], b: [1, 0, 0.3]},
    prop: {hand: 'r', id: 'cup', frame: (sk) => frameOf(LANDMARKS.grip(sk, 0.04), sk.toThumb, sk.forward)}},
  'phone-look': {verb: 'look at a phone', th: 'ดูมือถือ', r: {gesture: 'relaxed', w: [-0.06, -0.22, 0.27], f: [-0.25, 0.55, 0.6], b: [0, -0.7, 0.45]},
    prop: {hand: 'r', id: 'phone', front: true, frame: (sk) => { const face = scale3(sk.normal, -1); return frameOf(add3(sk.at(-0.4, -1.2 - 2.2, 4), [0, 0, 0]), sk.forward, face); }}},
  'phone-call': {verb: 'phone at the ear', th: 'คุยโทรศัพท์', r: {gesture: 'relaxed', w: [0.09, 0.15, -0.06], f: [-0.25, 1, 0.05], b: [1, 0, 0]},
    prop: {hand: 'r', id: 'phone', frame: (sk) => frameOf(sk.at(-0.4, -1.2 - 0.6, 4), sk.forward, scale3(sk.normal, -1))}},
  'offer-apple': {verb: 'offer an apple, palm up', th: 'ยื่นแอปเปิล', r: {gesture: 'cupped', w: [0.02, -0.25, 0.38], f: [-0.1, 0.1, 1], b: [0, -1, 0]},
    prop: {hand: 'r', id: 'apple', front: true, frame: (sk) => frameOf(LANDMARKS.rest(sk, 0.04), [0, 1, 0], [0, 0, 1])}},
  'hands-on-hips': {verb: 'hands on hips', th: 'เท้าสะเอว', r: {gesture: 'fist', w: [0.05, -0.45, -0.02], f: [-0.6, -0.4, 0.3], b: [1, 0, 0.4]}, l: {gesture: 'fist', w: [0.05, -0.45, -0.02], f: [-0.6, -0.4, 0.3], b: [1, 0, 0.4]}},
  wai: {verb: 'wai (palms together)', th: 'ไหว้', r: {gesture: 'stop', w: [-0.13, -0.16, 0.2], f: [0, 1, 0.3], b: [1, 0, 0]}, l: {gesture: 'stop', w: [-0.13, -0.16, 0.2], f: [0, 1, 0.3], b: [1, 0, 0]}}, // flat palms together, tips tilted to the front
  shrug: {verb: 'shrug, palms up', th: 'ยักไหล่ ไม่รู้สิ', r: {gesture: 'open-spread', w: [0.26, -0.28, 0.08], f: [1, 0.05, 0.15], b: [0, -1, -0.4]}, l: {gesture: 'open-spread', w: [0.26, -0.28, 0.08], f: [1, 0.05, 0.15], b: [0, -1, -0.4]}}, // fingers out to the side: same length front and back
  clap: {verb: 'clap', th: 'ปรบมือ', r: {gesture: 'stop', w: [-0.12, -0.2, 0.3], f: [-0.25, 0.6, 0.75], b: [1, 0, 0]}, l: {gesture: 'stop', w: [-0.12, -0.2, 0.3], f: [-0.25, 0.6, 0.75], b: [1, 0, 0]}},
  present: {verb: 'present to the side, open palm', th: 'ผายมือแนะนำ', r: {gesture: 'open-spread', w: [0.26, -0.2, 0.12], f: [1, 0.12, 0.15], b: [0, -1, -0.6]}}, // fingers to the side, not at the lens (perspective made them huge in front, stubs from behind)
  'scratch-head': {verb: 'scratch the head', th: 'เกาหัว', r: {gesture: 'claw', w: [0.02, 0.42, -0.02], f: [-0.75, 0.45, 0], b: [0.45, 1, 0]}},
  'chin-think': {verb: 'hand under the chin, thinking', th: 'เท้าคางคิด', r: {gesture: 'fist', w: [-0.1, 0.0, 0.14], f: [-0.25, 1, 0.2], b: [0, 0.1, 1]}},
  'hold-book': {verb: 'hold a book open to read', th: 'ถือหนังสืออ่าน', r: {gesture: 'relaxed', w: [-0.04, -0.24, 0.3], f: [-0.4, 0.5, 0.5], b: [0.2, -0.5, 0.6]},
    prop: {hand: 'r', id: 'book', frame: (sk) => frameOf(sk.at(-1.2, -1.2 - 1.8, 4.5), sk.forward, scale3(sk.normal, -1))}},
  // Added 18 Nov 2026 (kit extension, user): reactions, talking gestures, money.
  facepalm: {verb: 'facepalm', th: 'กุมหน้าผาก', r: {gesture: 'relaxed', w: [-0.12, 0.25, 0.24], f: [-0.25, 1, -0.15], b: [0, 0, 1]}},
  'cover-mouth': {verb: 'cover the mouth, shocked', th: 'ปิดปากตกใจ', r: {gesture: 'relaxed', w: [-0.1, 0.11, 0.23], f: [-0.8, 0.55, -0.1], b: [0, 0, 1]}},
  'hands-on-head': {verb: 'both hands on the head, oh no', th: 'จับหัวสองมือ', r: {gesture: 'relaxed', w: [0.06, 0.5, -0.04], f: [-0.8, 0.4, 0.1], b: [0.4, 1, 0]}, l: {gesture: 'relaxed', w: [0.06, 0.5, -0.04], f: [-0.8, 0.4, 0.1], b: [0.4, 1, 0]}}, // palms on the crown, not the forehead
  'arms-crossed': {verb: 'arms crossed', th: 'กอดอก', r: {gesture: 'fist', w: [-0.24, -0.24, 0.14], f: [-1, 0.15, 0], b: [0, 0, 1]}, l: {gesture: 'relaxed', w: [-0.22, -0.18, 0.1], f: [-1, 0.2, -0.1], b: [0, 0.2, 1]}},
  'wait-finger': {verb: 'one moment (index up, palm out)', th: 'เดี๋ยวก่อน', r: {gesture: 'point', w: [0.2, 0.0, 0.2], f: [0, 1, 0.05], b: [0.2, 0, -1]}}, // out by the shoulder: the finger reads from behind too
  beckon: {verb: 'come here (palm up, fingers curl)', th: 'กวักมือเรียก', r: {gesture: 'claw', w: [0.08, -0.24, 0.3], f: [-0.1, 0.25, 1], b: [0, -1, 0.2]}},
  'point-down': {verb: 'point down (right here)', th: 'ชี้ลง', r: {gesture: 'point', w: [0.12, -0.3, 0.26], f: [0, -1, 0.3], b: [0.3, 0, 1]}},
  'count-on-fingers': {verb: 'count on the fingers', th: 'นับนิ้ว', r: {gesture: 'point', w: [-0.1, -0.16, 0.32], f: [-0.85, 0.5, 0.1], b: [0, 0, 1]}, l: {gesture: 'open-spread', w: [-0.06, -0.2, 0.3], f: [0.25, 1, 0], b: [0, 0, 1]}},
  'hold-money': {verb: 'hold up a banknote', th: 'ถือธนบัตร', r: {gesture: 'pinch', w: [0.22, -0.02, 0.2], f: [0, 1, 0.15], b: [0.3, 0, -1]},
    prop: {hand: 'r', id: 'bill', frame: (sk) => { // the note lies across, its lower edge in the pinch, so the fingers hold an edge and the face shows
      const z = norm3(sub3(sk.fingers.index.joints[3], sk.fingers.thumb.joints[3])), up = norm3(sub3(sk.forward, scale3(z, dot3(sk.forward, z)))), y = cross3(z, up);
      return frameOf(add3(add3(LANDMARKS.pinch(sk), scale3(up, 0.03)), scale3(y, 0.05)), y, z); }}},
  'hands-clasped': {verb: 'hands clasped at the chest (hoping)', th: 'ประสานมือ', r: {gesture: 'fist', w: [-0.12, -0.28, 0.24], f: [-0.9, 0.45, 0], b: [0, 0.2, 1]}, l: {gesture: 'claw', w: [-0.1, -0.3, 0.27], f: [-0.9, 0.4, 0], b: [0, 0.2, 1]}}, // one hand wraps the other fist at chest height
} satisfies Record<string, MidAction>;
export type MidActionId = keyof typeof MID_ACTIONS;
export const MID_ACTION_IDS = Object.keys(MID_ACTIONS) as MidActionId[];

/** Hand size against the 4-head cast: a real-size hand (1.05) looks tiny beside the rig's big head, so the kit matches the rig's own hand scale. */
export const MID_HAND_SIZE = 1.5;
/** A hand of an action in world: the macro hand, its shoulder and elbow. */
export type MidPlaced = {hand: HandMacro; S: V3; E: V3; side: HandSide};
export const placeMidHand = (b: Body, side: HandSide, m: MidHand, base: number): MidPlaced => {
  const s = side === 'right' ? 1 : -1, v = (q: V3): V3 => [s * q[0], q[1], q[2]];
  const S = bodyShoulder(b, side), k = b.def.height / 1.75, tone = toneFromSkin(b.def.head.skin);
  const o = m.thumb ? forwardFor(side, bodyDir(b, v(m.thumb)), bodyDir(b, v(m.b ?? [1, 0, 0]))) : {forward: bodyDir(b, v(m.f ?? [0, -1, 0])), back: bodyDir(b, v(m.b ?? [1, 0, 0]))};
  const spec: HandSpec = {gesture: m.gesture, side, ...o, base, tone, size: MID_HAND_SIZE * k, ...(m.put ? {put: m.put} : {wrist: add3(S, sub3(bodyAt(b, scale3(v(m.w ?? [0, -0.5, 0]), k)), b.at))})};
  const hand = specHand(spec), l = BONE * (b.def.armScale ?? 1);
  const E = elbowIK(S, hand.wrist, bodyDir(b, v([0.6, -1, -0.35])), l * 1.08, l * 1.05);
  return {hand, S, E, side};
};

export const MID_VIEWS = ['front', 'back'] as const;
export type MidView = (typeof MID_VIEWS)[number];
/** One sheet cell: a 1080 x 830 box (front on top, back below; a 50 px label strip under each), the figure 1.3 m away, thigh-up, camera at chest height looking level. */
export type MidCell = {face: ExpressionId; view: MidView; cam: YCam; body: Body; placed: MidPlaced[]; hands: HandMacro[]; props: KitProp[]; box: [number, number, number, number]};
export const MID_DIST = 1.3;
export const midCell = (action: MidActionId, view: MidView, k: number, person: PersonId = 'man-crop'): MidCell => {
  const box: [number, number, number, number] = [0, 160 + k * 880, 1080, 830];
  // Thigh-up: hands at rest stay in the frame (storyboard rule: never crop through hands or wrists).
  const cam: YCam = {x: 0, y: 1.13, z: MID_DIST, yaw: 0, f: 760, hy: box[1] + 415, near: 0.1};
  const def = PEOPLE[person] as CastDef, body = bodyFor(cam, def, [0, 0, 0], view);
  const a = MID_ACTIONS[action] as MidAction;
  const placed = (['right', 'left'] as const).map((side, j) => placeMidHand(body, side, (side === 'right' ? a.r : a.l) ?? HANG, 5000 + k * 600 + j * 240));
  const props: KitProp[] = a.prop ? [{id: a.prop.id, front: a.prop.front, frame: a.prop.frame(macroSkeleton(placed[a.prop.hand === 'r' ? 0 : 1].hand), body)}] : [];
  return {face: MID_FACE[action] ?? 'neutral', view, cam, body, placed, hands: placed.map((q) => q.hand), props, box};
};

const mirrorX = (g: Pt, q: Pt): Pt => [2 * g[0] - q[0], q[1]];
/** The rig arm that reaches a placed hand: wrist and elbow projected; the back view mirrors its targets (back.ts mirrors them again). */
export const midArm = (c: MidCell, q: MidPlaced): Arm => {
  const g = camPoint(c.cam, c.body.at)!, to = camPoint(c.cam, q.hand.wrist)!, via = camPoint(c.cam, q.E)!;
  return c.view === 'back' ? {to: mirrorX(g, to), via: mirrorX(g, via), noHand: true} : {to, via, noHand: true};
};

/** Paint a mid cell: hands behind the torso first, the figure with hand-less arms to the wrists, then the near hands and props.
 * `hands: false` paints the figure only, for the 3D hands (`midHands3D`) laid over it. */
export const paintMidCell = (p: Painter, c: MidCell, {hands = true}: {hands?: boolean} = {}) => {
  const torso = camDepth(c.cam, bodyAt(c.body, [0, c.body.def.height * 0.62, 0]));
  const behind = (h: HandMacro) => camDepth(c.cam, macroSkeleton(h).palmCentre) > torso + 0.06;
  const props = (front: boolean, hidden: boolean) => c.props.forEach((q, k) => { if (!!q.front === front && behind(c.hands[0]) === hidden) PROPS[q.id].paint(p, c.cam, 20000 + c.box[0] + k * 300 + (front ? 150 : 0), q.frame); });
  if (hands) { props(false, true); c.hands.filter(behind).forEach((h) => paintHandMacro(p, c.cam, {...h, crisp: false})); props(true, true); }
  const [r, l] = c.placed;
  paintFigureAt(p, c.cam, c.body.def, {at: c.body.at, view: c.view, t: openEyesT(c.body.def.seed), face: c.face, shadow: false, fig: {rArm: midArm(c, r), lArm: midArm(c, l)}});
  if (hands) { props(false, false); c.hands.filter((h) => !behind(h)).forEach((h) => paintHandMacro(p, c.cam, {...h, crisp: false})); props(true, false); }
};


/**
 * The cell's hands and props for the 3D layers (hand3d.tsx `Hands3D`, user 18 Nov 2026), split as `paintMidCell` splits them: `front` hands
 * go over the painted figure; `behind` hands (behind the torso, as the back view puts most of them) come with depth-only stand-ins for the
 * painted torso, head and both arms, so the figure hides them exactly where the painted order would. Arms are hand-only (the rig arm runs to
 * the wrist).
 */
export const midHands3D = (c: MidCell) => {
  const torso = camDepth(c.cam, bodyAt(c.body, [0, c.body.def.height * 0.62, 0]));
  const isBehind = (h: HandMacro) => camDepth(c.cam, macroSkeleton(h).palmCentre) > torso + 0.06;
  const [r, l] = c.placed, h = c.body.def.height, sy = (r.S[1] + l.S[1]) / 2 - c.body.at[1], hw = dist3(r.S, l.S) / 2, k = h / 1.75;
  const frame = {o: bodyAt(c.body, [0, (sy + h * 0.38) / 2, 0]), x: c.body.x, y: c.body.y, z: c.body.z};
  const occluders: Occluder3D[] = [
    {frame, half: [hw * 1.02, (sy - h * 0.38) / 2 + 0.02, 0.1] as V3},
    {frame: {...frame, o: bodyAt(c.body, [0, sy + MID_HEAD.y * k, 0.01])}, half: [MID_HEAD.rx * k, MID_HEAD.ry * k, MID_HEAD.rz * k] as V3, shape: 'ellipsoid'},
    ...c.placed.flatMap((q) => [{capsule: [q.S, q.E] as [V3, V3], r: 0.05 * k}, {capsule: [q.E, q.hand.wrist] as [V3, V3], r: 0.04 * k}]),
  ];
  const pick = (back: boolean) => ({
    arms: c.placed.filter((q) => isBehind(q.hand) === back).map((q) => ({hand: q.hand, elbow: q.E, handOnly: true})),
    props: c.props.filter(() => isBehind(c.hands[0]) === back).map((q) => ({id: q.id, frame: q.frame})),
  });
  return {front: pick(false), behind: {...pick(true), occluders}};
};
/** The painted head as an ellipsoid in metres for a 1.75 m figure, from the shoulder line (fitted by eye with `debugOccluders`). */
export const MID_HEAD = {y: 0.28, rx: 0.17, ry: 0.22, rz: 0.16};
