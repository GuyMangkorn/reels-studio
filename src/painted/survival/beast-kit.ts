import type {Build} from './beast';
import type {BeastPlace} from './beast';
import {buildRaptor, RAPTOR_POSES} from './beast-raptor';
import {buildHippo, HIPPO_POSES, HIPPO_WATER} from './beast-hippo';
import {buildSnake, SNAKE_POSES} from '../kit/snake';
import {buildMosquito, MOSQ_Y0, MOSQUITO_POSES} from '../kit/mosquito';

// EDU-EP16 creature kit registry (Boss, 14 Nov 2026): one entry per creature with its size, the animations a shot may use and how to build each pose. Comp cards
// (scripts/edu-series/ep16/creature-kit), the joint-integrity test (tests/beast-joints.test.ts) and shot code iterate this, so a new animation is checked the day it is listed.
export type BeastAnim = {
  /** true = `t` runs 0..1 around a loop (samples at i/n); false = a one-way range (samples at i/(n-1)). */
  cycle: boolean;
  /** Also render the comp-card strip side-on (walks: legs and tail read best there). */
  side?: boolean;
  build: (t: number) => Build;
  note: string;
  /** Placement extras the animation needs (e.g. the waterline of a wader); cards and tests pass it to `paintBeast`. */
  place?: Partial<BeastPlace>;
};
export type BeastKitEntry = {id: string; label: string; /** longest extent in m (comp-card scale, check camera) */ size: number; /** height of the look-at point in m */ hc: number; stand: () => Build; anims: Record<string, BeastAnim>};
export const ANIM_SAMPLES = 8;
export const animSamples = (a: BeastAnim, n = ANIM_SAMPLES): number[] => Array.from({length: n}, (_, i) => (a.cycle ? i / n : i / (n - 1)));

export const BEAST_KIT: Record<string, BeastKitEntry> = {
  RAPTOR: {
    id: 'AS-RAPTOR-R1', label: 'Velociraptor-type dromaeosaur 2 m, back 0.53 m over the hips, feathered, kit test 14 Nov 2026', size: 2.2, hc: 0.4, stand: () => buildRaptor(RAPTOR_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildRaptor(RAPTOR_POSES.stand()), note: 'stand, wings folded, mouth a little open'},
      WALK: {cycle: true, side: true, build: (t) => buildRaptor(RAPTOR_POSES.walk(t)), note: 'walk, 0.5 m stride, stiff tail swaying from its base'},
      POUNCE: {cycle: false, build: (t) => buildRaptor(RAPTOR_POSES.pounce(t)), note: 'pounce: crouch, push off, leap nose-up with the feet and sickle claws swung forward, wings spread'},
    },
  },
  HIPPO: {
    id: 'AS-HIPPO-R1', label: 'Hippopotamus 3.6 m, shoulder 1.5 m, head 0.95 x 0.7 m; EDU-EP18 N3 (comp cards 15 Nov 2026, not user-approved)', size: 3.8, hc: 0.9, stand: () => buildHippo(HIPPO_POSES.stand()),
    anims: {
      SURFACE: {cycle: false, build: (t) => buildHippo(HIPPO_POSES.surface(t)), note: 'rises from under the surface: head (eyes, ears, nostrils) first, then the back; ears flick', place: {waterline: HIPPO_WATER}},
      YAWN: {cycle: false, build: (t) => buildHippo(HIPPO_POSES.yawn(t)), note: 'yawn: chest up, head back, jaw to the full 140 deg gape (hold), closes', place: {waterline: HIPPO_WATER}},
      SWIM: {cycle: true, side: true, build: (t) => buildHippo(HIPPO_POSES.swim(t)), note: 'swim / bottom-walk at the surface, slow bob, legs paddling below', place: {waterline: HIPPO_WATER}},
      CHARGE: {cycle: true, side: true, build: (t) => buildHippo(HIPPO_POSES.charge(t)), note: 'charge: surging bounds, head high, chest pushing a bow wave (the scene paints the wave)', place: {waterline: HIPPO_WATER}},
      HALT: {cycle: false, build: (t) => buildHippo(HIPPO_POSES.halt(t)), note: 'halt: from the charge to a stop, head drops, mouth closes, last lurch', place: {waterline: HIPPO_WATER}},
      SNORT: {cycle: false, build: (t) => buildHippo(HIPPO_POSES.snort(t)), note: 'snort: nostrils flare and blow (the scene adds spray), ears flick', place: {waterline: HIPPO_WATER}},
      LURK: {cycle: true, build: (t) => buildHippo(HIPPO_POSES.lurk(t)), note: 'lurk: eyes, ears, nostrils and a thin line of head above the water', place: {waterline: HIPPO_WATER}},
    },
  },
  SNAKE: {
    id: 'AS-SNAKE-R1', label: 'Generic snake 1.4 m, 0.04 m thick, head 0.045 m wide, olive-brown with dark saddles; EDU-EP18 N11 (kit/snake.ts; comp cards 15 Nov 2026, not user-approved)', size: 1.5, hc: 0.05, stand: () => buildSnake(SNAKE_POSES.lie(0)),
    anims: {
      LIE: {cycle: true, build: (t) => buildSnake(SNAKE_POSES.lie(t)), note: 'lie: resting S on the ground, head turns slowly'},
      HEADLIFT: {cycle: false, build: (t) => buildSnake(SNAKE_POSES.headLift(t)), note: 'head-lift: the neck rises in an S, head level, tongue flicks twice'},
      SLITHER: {cycle: true, side: true, build: (t) => buildSnake(SNAKE_POSES.slither(t)), note: 'slither: the body slides one wavelength along a fixed path (move it at SNAKE_SLITHER.speed), belly on the ground'},
    },
  },
  MOSQUITO: {
    id: 'AS-MOSQUITO-R1', label: 'Mosquito macro in MILLIMETRES: body 6 mm, legs ~14 mm, black with pale bands, rim light; EDU-EP18 N13 (kit/mosquito.ts; comp cards 15 Nov 2026, not user-approved)', size: 14, hc: MOSQ_Y0 - 1, stand: () => buildMosquito(MOSQUITO_POSES.rest()),
    anims: {
      HOVER: {cycle: true, side: true, build: (t) => buildMosquito(MOSQUITO_POSES.hover(t)), note: 'hover: wing-beat blur fan, slow bob, legs dangle and sway'},
    },
  },
};
