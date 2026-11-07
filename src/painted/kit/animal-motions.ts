import {animalCycleLength, animalGaitPeriod, animalWalkSpeed, ANIMALS, type AnimalDef, type AnimalGait, type AnimalId, type AnimalPose, type AnimalView} from './animals';

// Motion presets for the kit animals (animals.ts): a motion is a PURE function of shot-local time that returns the animal's pose
// and a root offset, like the people motions (motions.ts). Added 2 Nov 2026 (user request). Reel: `KIT-ANIMAL-MOTIONS`.
//
//   const m = animalMotion('sit-down', t, {animal: 'dog-golden', view: 'right'});
//   drawAnimal(p, seed, ANIMALS['dog-golden'], [g[0] + m.offset[0] * unit, g[1] - m.offset[1] * unit], unit, m.pose, t);
//
// - Non-looping motions hold their last frame past `animalMotionDuration`; looping ones are periodic (`loop` in the info).
// - Walks and runs pick their profile view (`from-left` faces right); the rest keep the caller's view.
// - Offsets are metres from the rest point (x right, y up). The gait clock follows the distance travelled, so planted paws do
//   not skate; a walk-in eases to a stop over its last half second with the stride shrinking to zero.

export const ANIMAL_MOTION_IDS = [
  'idle', 'happy-wag', 'speak', 'sniff', 'startle-hop',
  'walk-in-from-left', 'walk-in-from-right', 'walk-out-to-left', 'walk-out-to-right', 'run-left-to-right', 'run-right-to-left',
  'sit-down', 'stand-up', 'lie-down', 'get-up',
  'step-up', 'head-rub',
] as const;
export type AnimalMotionId = (typeof ANIMAL_MOTION_IDS)[number];

export type AnimalMotionCtx = {
  animal: AnimalId | AnimalDef;
  /** The caller's view for motions that keep it (default `right`). */
  view?: AnimalView;
  /** Walk / run distance, m (default: a walk 1.2 m or 4 shoulder heights, a run 1.5 m each side of the rest point). */
  distance?: number;
  /** `step-up`: height of the higher surface above the one it leaves, m (negative = a step DOWN of that depth; default 0.18: SET-LIVINGROOM sofa arm 0.48 over the armchair seat 0.30), and the distance across to it, m (default 0.28). */
  rise?: number; across?: number;
  /** `head-rub`: how far the skull dips into the hand at the push of each rub, m (default 0.012). */
  press?: number;
  /** `head-rub`: the contact point [forward m, up m] from the rest point where the skull top meets the hand (default [0.2, 0.3]). */
  target?: [number, number];
};
export type AnimalMotionFrame = {pose: AnimalPose; offset: [number, number]};

export const ANIMAL_MOTION_INFO: Record<AnimalMotionId, {description: string; loop?: boolean}> = {
  'idle': {description: 'Standing still: breathing, blinking, a cat\'s tail sways.', loop: true},
  'happy-wag': {description: 'Excited: tail wags hard, a dog pants, small bounces.', loop: true},
  'speak': {description: 'Two barks (dog) or one long meow (cat).'},
  'sniff': {description: 'Lowers the head to the ground, sniffs, looks up again.'},
  'startle-hop': {description: 'A startled hop straight up with the mouth open, then lands.'},
  'walk-in-from-left': {description: 'Walks in from frame left and stops at the rest point, facing right.'},
  'walk-in-from-right': {description: 'Walks in from frame right and stops at the rest point, facing left.'},
  'walk-out-to-left': {description: 'Starts walking from the rest point and leaves frame left.'},
  'walk-out-to-right': {description: 'Starts walking from the rest point and leaves frame right.'},
  'run-left-to-right': {description: 'Gallops across the frame left to right.'},
  'run-right-to-left': {description: 'Gallops across the frame right to left.'},
  'sit-down': {description: 'Stand to sit.'},
  'stand-up': {description: 'Sit to stand.'},
  'lie-down': {description: 'Stand to lying down.'},
  'get-up': {description: 'Lying down to stand.'},
  'step-up': {description: 'A small hop onto a higher surface (0.18 m rise by default, over 0.33 s = 10 frames; the arc clears the edge by 0.06 m), landing mid-stride so a walk can follow. Offset carries the rise. A negative `rise` is a step DOWN: no arc, the drop accelerates and lands on the contact frame.'},
  'head-rub': {description: 'Neck stretches, skull top meets a hand point; head tilt and two cheek-pushes along it, eyes at half-close (lid 0.5); releases.'},
};

const defOf = (c: AnimalMotionCtx) => (typeof c.animal === 'string' ? ANIMALS[c.animal] : c.animal);
const STOP = 0.5;
const walkDistance = (def: AnimalDef, c: AnimalMotionCtx) => c.distance ?? Math.max(1.2, 4 * def.height);
const runDistance = (c: AnimalMotionCtx) => c.distance ?? 1.5;
const TRANSITION: Partial<Record<AnimalMotionId, number>> = {'sit-down': 0.8, 'stand-up': 0.7, 'lie-down': 1.1, 'get-up': 0.9, 'step-up': 0.7, 'head-rub': 2.6};
/** `step-up`: the hop lasts this long (10 frames at 30 fps); the rest of the motion is the landing hold. */
export const STEP_UP_HOP = 1 / 3;

export const animalMotionDuration = (id: AnimalMotionId, c: AnimalMotionCtx): number => {
  const def = defOf(c), v = animalWalkSpeed(def);
  if (id.startsWith('walk-in')) return walkDistance(def, c) / v + STOP / 2;
  if (id.startsWith('walk-out')) return walkDistance(def, c) / v + STOP / 2;
  if (id.startsWith('run-')) return (2 * runDistance(c)) / animalWalkSpeed(def, 'run');
  if (TRANSITION[id]) return TRANSITION[id]!;
  return {idle: 3, 'happy-wag': 2, speak: 1.4, sniff: 3.6, 'startle-hop': 1.0}[id as string] ?? 2;
};

/** Distance travelled (m) and stride 0..1 at time t of a walk that cruises at v and eases to a stop over STOP s. */
const arrive = (t: number, d: number, v: number): [number, number] => {
  const tc = (d - (v * STOP) / 2) / v;
  if (t <= tc) return [v * Math.max(0, t), 1];
  const u = Math.min(1, (t - tc) / STOP);
  return [d - (v * STOP) / 2 + v * STOP * (u - (u * u) / 2), 1 - u];
};
/** A walk that starts from rest, speeding up over STOP s, then cruising. */
const depart = (t: number, v: number): [number, number] => {
  if (t <= STOP) { const u = Math.max(0, t / STOP); return [(v * STOP * u * u) / 2, u]; }
  return [(v * STOP) / 2 + v * (t - STOP), 1];
};
const gaitClock = (def: AnimalDef, s: number, gait: AnimalGait) => (s / animalCycleLength(def, gait)) * animalGaitPeriod(def, gait);
const ease = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
const bump = (t: number, a: number, b: number) => (t <= a || t >= b ? 0 : Math.sin((Math.PI * (t - a)) / (b - a)));

export const animalMotion = (id: AnimalMotionId, t: number, c: AnimalMotionCtx): AnimalMotionFrame => {
  const def = defOf(c), view = c.view ?? 'right', isCat = def.kind === 'cat';
  const dur = animalMotionDuration(id, c), info = ANIMAL_MOTION_INFO[id];
  const tt = info.loop ? ((t % dur) + dur) % dur : Math.min(Math.max(0, t), dur);
  const still = (pose: Partial<AnimalPose> = {}, offset: [number, number] = [0, 0]): AnimalMotionFrame => ({pose: {view, state: 'stand', ...pose}, offset});
  switch (id) {
    case 'idle': return still();
    case 'happy-wag': return still({wag: 1, mouth: isCat ? 'closed' : 'open'}, [0, 0.03 * def.height * Math.abs(Math.sin(2 * Math.PI * tt * 1.5))]);
    case 'speak': {
      const open = isCat ? tt > 0.3 && tt < 1.0 : (tt > 0.2 && tt < 0.4) || (tt > 0.7 && tt < 0.9);
      return still({mouth: open ? 'open' : 'closed', wag: isCat ? 0 : 0.3});
    }
    case 'sniff': {
      // Head lowers over 1 s, two slow sniff dips (1.2 Hz), rises over 1 s (user: the first cut moved too fast, 2 Nov 2026).
      const down = ease(tt / 1.0) * ease((dur - tt) / 1.0);
      return still({sniff: down * (0.94 + 0.06 * Math.cos(2 * Math.PI * Math.max(0, tt - 1.0) * 1.2))});
    }
    case 'startle-hop': return still({mouth: tt > 0.08 && tt < 0.6 ? 'open' : 'closed'}, [0, 0.35 * def.height * bump(tt, 0.1, 0.5)]);
    case 'walk-in-from-left':
    case 'walk-in-from-right': {
      const d = walkDistance(def, c), sgn = id === 'walk-in-from-left' ? 1 : -1;
      const [s, stride] = arrive(tt, d, animalWalkSpeed(def));
      return {pose: {view: sgn > 0 ? 'right' : 'left', state: 'stand', walk: gaitClock(def, s, 'walk'), stride}, offset: [-sgn * (d - s), 0]};
    }
    case 'walk-out-to-left':
    case 'walk-out-to-right': {
      const sgn = id === 'walk-out-to-right' ? 1 : -1;
      const [s, stride] = depart(tt, animalWalkSpeed(def));
      return {pose: {view: sgn > 0 ? 'right' : 'left', state: 'stand', walk: gaitClock(def, s, 'walk'), stride}, offset: [sgn * s, 0]};
    }
    case 'run-left-to-right':
    case 'run-right-to-left': {
      const d = runDistance(c), sgn = id === 'run-left-to-right' ? 1 : -1, s = animalWalkSpeed(def, 'run') * tt;
      return {pose: {view: sgn > 0 ? 'right' : 'left', state: 'stand', walk: gaitClock(def, s, 'run'), gait: 'run'}, offset: [sgn * (s - d), 0]};
    }
    case 'sit-down': return still({from: 'stand', state: 'sit', blend: tt / dur});
    case 'stand-up': return still({from: 'sit', state: 'stand', blend: tt / dur});
    case 'lie-down': return still({from: 'stand', state: 'lie', blend: tt / dur});
    case 'get-up': return still({from: 'lie', state: 'stand', blend: tt / dur});
    case 'step-up': {
      // K7: crouch-free hop; x travels `across`, y follows the rise plus a small arc so the paws clear the edge; the gait clock follows the
      // distance so the landing is mid-stride and a following walk picks the clock up (stride 0 on the ground before, 1 after landing).
      // A negative `rise` is the step DOWN (EDU-EP06 BOSS-1): no arc over an edge; the body stays level while the front paws reach out, then the drop
      // accelerates (gravity, quadratic) and lands at the end of the hop with the contact flag. A positive `rise` is unchanged.
      const rise = c.rise ?? 0.18, across = c.across ?? 0.28, sgn = view === 'left' ? -1 : 1, u = ease(tt / STEP_UP_HOP), hop = Math.min(1, tt / STEP_UP_HOP);
      const arc = rise < 0 ? 0 : 0.06 * bump(tt, 0, STEP_UP_HOP), v = rise < 0 ? hop * hop : u;
      const stride = ease((tt - 0.04) / (STEP_UP_HOP * 0.7)) * 0.8 + 0.2 * ease((tt - STEP_UP_HOP) / 0.3);
      return {pose: {view: sgn > 0 ? 'right' : 'left', state: 'stand', walk: gaitClock(def, across * u, 'walk'), stride, contact: tt >= STEP_UP_HOP ? 1 : 0}, offset: [sgn * across * u, rise * v + arc]};
    }
    case 'head-rub': {
      // K5: lean in over 0.5 s, two rubs (0.7 s each) pushing the skull top along the hand, release over 0.4 s. `tilt` follows the push.
      const to = c.target ?? [0.2, 0.3], lean = ease(tt / 0.5) * ease((dur - tt) / 0.4), ph = Math.max(0, Math.min(1, (tt - 0.6) / 1.4)), rub = Math.sin(2 * Math.PI * 2 * ph) * Math.sin(Math.PI * ph) ** 0.5;
      return still({lean, leanTo: [to[0] + 0.03 * rub, to[1] - (c.press ?? 0.012) * Math.abs(rub)], leanAnchor: 'top', tilt: 6 + 8 * rub * lean, lid: 0.5, contact: 1});
    }
  }
};

// ------------------------------------------------------------------------------------------------- KIT-ANIMAL-MOTIONS reel data
// One motion per timeline scene: a dog on the far lane and a cat on the near lane. Plain data so the video
// (`src/videos/kit-animal-motions/index.ts`) and the plates (`src/painted/shots/kit-animal-motions.tsx`) agree on scene lengths.

export type AnimalReelCast = {animal: AnimalId; view?: AnimalView; x: number; ground: number};
export type AnimalReelEntry = {motion: AnimalMotionId; cast: AnimalReelCast[]};
export const ANIMAL_REEL_FPS = 30;
export const ANIMAL_REEL_UNIT = 600;
const DOG_LANE = 1180, CAT_LANE = 1580;
const lanes = (dogView: AnimalView = 'right', catView: AnimalView = 'front', dog: AnimalId = 'dog-golden', cat: AnimalId = 'cat-orange-tabby'): AnimalReelCast[] =>
  [{animal: dog, view: dogView, x: 540, ground: DOG_LANE}, {animal: cat, view: catView, x: 540, ground: CAT_LANE}];

export const ANIMAL_REEL: AnimalReelEntry[] = [
  {motion: 'idle', cast: lanes('right', 'front')},
  {motion: 'happy-wag', cast: lanes('left', 'right', 'dog-thai')},
  {motion: 'speak', cast: lanes('right', 'front', 'dog-chihuahua', 'cat-siamese')},
  {motion: 'sniff', cast: lanes('right', 'left', 'dog-black-lab', 'cat-gray-tabby')},
  {motion: 'startle-hop', cast: lanes('right', 'front', 'dog-pom', 'cat-black')},
  {motion: 'walk-in-from-left', cast: lanes()},
  {motion: 'walk-in-from-right', cast: lanes('left', 'left', 'dog-thai', 'cat-calico')},
  {motion: 'walk-out-to-left', cast: lanes('left', 'left', 'dog-black-lab', 'cat-tuxedo')},
  {motion: 'walk-out-to-right', cast: lanes('right', 'right', 'dog-golden', 'cat-white')},
  {motion: 'run-left-to-right', cast: lanes('right', 'right', 'dog-golden', 'cat-orange-tabby')},
  {motion: 'run-right-to-left', cast: lanes('left', 'left', 'dog-thai', 'cat-black')},
  {motion: 'sit-down', cast: lanes('right', 'front')},
  {motion: 'stand-up', cast: lanes('right', 'front')},
  {motion: 'lie-down', cast: lanes('right', 'front', 'dog-black-lab', 'cat-calico')},
  {motion: 'get-up', cast: lanes('right', 'front', 'dog-black-lab', 'cat-calico')},
  {motion: 'step-up', cast: lanes('right', 'right', 'dog-thai', 'cat-orange-tabby')},
  {motion: 'head-rub', cast: lanes('right', 'right', 'dog-pom', 'cat-orange-tabby')},
];
export const ANIMAL_REEL_HOLD = 0.5;
export const animalReelSceneSec = (e: AnimalReelEntry): number => {
  const sec = Math.max(...e.cast.map((c) => animalMotionDuration(e.motion, {animal: c.animal}))) + ANIMAL_REEL_HOLD;
  return Math.ceil(sec * ANIMAL_REEL_FPS - 1e-6) / ANIMAL_REEL_FPS;
};
export const animalReelShotId = (m: AnimalMotionId) => `kit-animal-motion-${m}`;
