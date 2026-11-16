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
  'step-up', 'head-rub', 'head-lift-sigh',
  'sniff-track', 'look-left-right', 'head-tilt', 'lick',
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
  'head-lift-sigh': {description: 'A lying dog (EDU-EP13 N13b, `lie` state, any profile): eyes open (lid 0.2) and the nose up 5 degrees over 0.33 s, a slow nose-down sigh with the mouth open (0.2-1.4 s, 7 degrees), then eyes shut at the rest angle by 2 s. The head only rotates about the skull: no `lean`, no neck stretch, nothing leaves the body outline. Eyes start shut (lid 1).'},
  'sniff-track': {description: 'Tracking a trail (EDU-EP19 N5): profile views walk at half speed with the head low (sniff 0.85), a quick nose dip every 0.8 s, `distance` m (default 2.4, or 6 shoulder heights for a small animal) then stop nose-down; the front view stays planted, head low, the nose sweeping left and right (`look`) once per 1.6 s. Offset carries the walk.'},
  'look-left-right': {description: 'Front view (EDU-EP19 N5): a puzzled check: the head turns screen left at 0.13 s, right at 0.4 s, left at 0.67 s (8 frames apart at 30 fps), holding each turn briefly, then back to centre by 1.1 s.'},
  'head-tilt': {description: 'Front view (EDU-EP19 N5): the puzzled head tilt: crown rolls 14 deg toward screen right over 0.3 s with the flop ears lifting (`earLift`), held to the end (1.6 s).'},
  'lick': {description: 'Profile or front (EDU-EP19 N5): three quick licks over 0.75 s (tongue out and up toward the head side), tail wagging; ends mouth open, panting.'},
  'head-rub': {description: 'Neck stretches, skull top meets a hand point; head tilt and two cheek-pushes along it, eyes at half-close (lid 0.5); releases.'},
};

const defOf = (c: AnimalMotionCtx) => (typeof c.animal === 'string' ? ANIMALS[c.animal] : c.animal);
const STOP = 0.5;
const walkDistance = (def: AnimalDef, c: AnimalMotionCtx) => c.distance ?? Math.max(1.2, 4 * def.height);
const runDistance = (c: AnimalMotionCtx) => c.distance ?? 1.5;
const TRANSITION: Partial<Record<AnimalMotionId, number>> = {'sit-down': 0.8, 'stand-up': 0.7, 'lie-down': 1.1, 'get-up': 0.9, 'step-up': 0.7, 'head-rub': 2.6, 'head-lift-sigh': 2};
/** `step-up`: the hop lasts this long (10 frames at 30 fps); the rest of the motion is the landing hold. */
export const STEP_UP_HOP = 1 / 3;

export const animalMotionDuration = (id: AnimalMotionId, c: AnimalMotionCtx): number => {
  const def = defOf(c), v = animalWalkSpeed(def);
  if (id.startsWith('walk-in')) return walkDistance(def, c) / v + STOP / 2;
  if (id.startsWith('walk-out')) return walkDistance(def, c) / v + STOP / 2;
  if (id.startsWith('run-')) return (2 * runDistance(c)) / animalWalkSpeed(def, 'run');
  if (TRANSITION[id]) return TRANSITION[id]!;
  if (id === 'sniff-track') return c.view === 'front' ? 3.2 : (c.distance ?? Math.min(2.4, 6 * def.height)) / (0.5 * v);
  return {idle: 3, 'happy-wag': 2, speak: 1.4, sniff: 3.6, 'startle-hop': 1.0, 'look-left-right': 1.2, 'head-tilt': 1.6, lick: 0.75}[id as string] ?? 2;
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
    case 'head-lift-sigh': {
      // N13b: the dog lifts its head a little, eyes open, sighs and settles. Rotation about the skull only (a `lean` pulled the head back into the ruff).
      const d = ease(ease(tt / (10 / 30))) * (1 - ease(ease((tt - 1.6) / 0.4))), sigh = ease((tt - 0.2) / 1.2);
      return {pose: {view, state: 'lie', lid: d > 0.15 ? 0.2 : 1, tilt: -5 * d + 7 * Math.sin(Math.PI * sigh), mouth: tt >= 0.27 && tt < 1.07 ? 'open' : 'closed'}, offset: [0, 0]};
    }
    case 'sniff-track': {
      // N5: half-speed walk with the head low; the gait clock follows the distance so the paws stay planted. Front: planted, nose sweeping.
      const dip = 0.85 + 0.1 * Math.max(0, Math.sin(2 * Math.PI * tt / 0.8));
      if (view === 'front') return still({sniff: dip, headLow: true, look: Math.sin(2 * Math.PI * tt / 1.6)});
      const sgn = view === 'left' ? -1 : 1, s = 0.5 * animalWalkSpeed(def) * tt;
      return {pose: {view, state: 'stand', walk: gaitClock(def, s, 'walk'), sniff: dip}, offset: [sgn * s, 0]};
    }
    case 'look-left-right': {
      const k = (a: number, b: number) => ease((tt - a) / (b - a));
      const look = -k(0, 0.13) + 2 * k(0.2, 0.4) - 2 * k(0.47, 0.67) + k(0.8, 1.1);
      return still({view: 'front', look});
    }
    case 'head-tilt': {
      const u = ease(tt / 0.3);
      return still({view: 'front', roll: 14 * u, earLift: u});
    }
    case 'lick': {
      const l = Math.abs(Math.sin((3 * Math.PI * tt) / 0.75));
      return still({lick: tt < 0.75 ? l : 0, mouth: 'open', wag: 1});
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
  {motion: 'head-lift-sigh', cast: lanes('left', 'left', 'dog-golden', 'cat-calico')},
  {motion: 'sniff-track', cast: lanes('right', 'front', 'dog-black-lab', 'cat-gray-tabby')},
  {motion: 'look-left-right', cast: lanes('front', 'front', 'dog-black-lab', 'cat-orange-tabby')},
  {motion: 'head-tilt', cast: lanes('front', 'front', 'dog-black-lab', 'cat-white')},
  {motion: 'lick', cast: lanes('right', 'front', 'dog-golden', 'cat-tuxedo')},
];
export const ANIMAL_REEL_HOLD = 0.5;
export const animalReelSceneSec = (e: AnimalReelEntry): number => {
  const sec = Math.max(...e.cast.map((c) => animalMotionDuration(e.motion, {animal: c.animal}))) + ANIMAL_REEL_HOLD;
  return Math.ceil(sec * ANIMAL_REEL_FPS - 1e-6) / ANIMAL_REEL_FPS;
};
export const animalReelShotId = (m: AnimalMotionId) => `kit-animal-motion-${m}`;
