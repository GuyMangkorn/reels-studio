import type {Build} from './beast';
import type {BeastPlace} from './beast';
import {buildRaptor, RAPTOR_POSES} from './beast-raptor';

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
};
