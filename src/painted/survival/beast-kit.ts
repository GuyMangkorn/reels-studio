import type {Build} from './beast';
import type {BeastPlace} from './beast';
import {ANKYLO_POSES, ANKYLO_WATERLINE, buildAnkylosaur} from './beast-ankylo';
import {buildDragonfly, DRAGONFLY_FLYPAST_PLACE, DRAGONFLY_POSES} from './beast-dragonfly';
import {buildTRex, TREX_POSES} from './beast-trex';
import {buildLongNeck, LONGNECK_POSES} from './beast-longneck';
import {buildPterosaur, PTERO_POSES} from './beast-pterosaur';
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
  LONGNECK: {
    id: 'AS-LONGNECK-R2', label: 'Long-neck (brachiosaur-like) 22 m, N16-06 R2', size: 24, hc: 6, stand: () => buildLongNeck(LONGNECK_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildLongNeck(LONGNECK_POSES.stand()), note: 'stand (neck S, head 11 m)'},
      WALK: {cycle: true, side: true, build: (t) => buildLongNeck(LONGNECK_POSES.walk(t)), note: 'walk, 2.2 m stride'},
      BROWSE: {cycle: true, build: (t) => buildLongNeck(LONGNECK_POSES.browseHigh(t)), note: 'high browse, neck to a treetop 15 m, jaw working'},
      CHEW: {cycle: false, build: (t) => buildLongNeck(LONGNECK_POSES.chewLift(t)), note: 'chew and lift the head: mouthful at 5 m rising to 12.7 m'},
      EDGE: {cycle: true, side: true, build: (t) => buildLongNeck(LONGNECK_POSES.forestEdge(t)), note: 'step out at a forest edge, slow walk, head sweeping'},
    },
  },
  ANKYLO: {
    id: 'AS-ANKYLO-R2', label: 'Ankylosaur 6.5 m, hip 1.3 m, N16-15 R2', size: 7, hc: 0.9, stand: () => buildAnkylosaur(ANKYLO_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildAnkylosaur(ANKYLO_POSES.stand()), note: 'stand'},
      WALK: {cycle: true, side: true, build: (t) => buildAnkylosaur(ANKYLO_POSES.walk(t)), note: 'walk, 1.0 m stride, tail swaying'},
      WADE: {cycle: true, side: true, build: (t) => buildAnkylosaur(ANKYLO_POSES.wade(t)), place: {waterline: ANKYLO_WATERLINE}, note: `wade: legs clipped below the waterline at ${ANKYLO_WATERLINE} m (knees)`},
      SHAKE: {cycle: true, build: (t) => buildAnkylosaur(ANKYLO_POSES.headShake(t)), note: 'head shake (spray droplets are an effect: ankSpray)'},
      CLUB: {cycle: true, build: (t) => buildAnkylosaur(ANKYLO_POSES.tailClub(t)), note: 'tail club: wind up right, whip left and lift, recover'},
    },
  },
  DRAGONFLY: {
    id: 'AS-DRAGONFLY-R2', label: 'Giant dragonfly, body 0.42 m, span 0.7 m, N16-16', size: 0.8, hc: 0.05, stand: () => buildDragonfly(DRAGONFLY_POSES.hover(0.1)),
    anims: {
      HOVER: {cycle: true, build: (t) => buildDragonfly(DRAGONFLY_POSES.hover(t)), note: 'hover: one wing-beat, fore and hind pairs in opposition'},
      FLYPAST: {cycle: true, side: true, build: (t) => buildDragonfly(DRAGONFLY_POSES.flyPast(t)), place: {...DRAGONFLY_FLYPAST_PLACE}, note: 'fly past: shorter stroke, nose-down pitch and bank'},
    },
  },
  TREX: {
    id: 'AS-TREX-R2', label: 'T. rex 12 m, hip 3.6 m, N16-22 R2 (faded apparition only)', size: 14, hc: 3.4, stand: () => buildTRex(TREX_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildTRex(TREX_POSES.stand()), note: 'stand'},
      ROAR: {cycle: false, side: true, build: (t) => buildTRex(TREX_POSES.roar(t)), note: 'roar: head rises, jaw opens to 0.7 rad, holds, closes; tail sways'},
      STALK: {cycle: true, side: true, build: (t) => buildTRex(TREX_POSES.stalk(t)), note: 'N16-22 R3 stalk: 0.55 Hz, 2.4 m stride, head low, tail counter-sway'},
      SNIFF: {cycle: false, build: (t) => buildTRex(TREX_POSES.sniff(t)), note: 'N16-22 R3 sniff: two 0.15 m head lifts with flared nostrils (vapour puff: trex-fx.ts)'},
      TURN: {cycle: false, build: (t) => buildTRex(TREX_POSES.turn(t)), note: 'N16-22 R3 head lifts and turns by neck yaw 0 -> -0.5 rad'},
    },
  },
  PTERO: {
    id: 'AS-PTERO-R2', label: 'Pterosaur span 3 m, N16-07 R2 (circle, dive, grab, climb, land, gulp, preen)', size: 3.4, hc: 0, stand: () => buildPterosaur(PTERO_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildPterosaur(PTERO_POSES.stand()), note: 'perched on a snag, wings folded back'},
      FLAP: {cycle: true, build: (t) => buildPterosaur(PTERO_POSES.flap(t)), note: 'cruise wing beat'},
      CIRCLE: {cycle: true, build: (t) => buildPterosaur(PTERO_POSES.circle(t)), note: 'high circle: banked soar, head down (shot 16 +0..+20)'},
      DIVE: {cycle: false, build: (t) => buildPterosaur(PTERO_POSES.dive(t)), note: 'dive from top right: wings fold, nose down, feet drop (+20..+44)'},
      GRAB: {cycle: false, build: (t) => buildPterosaur(PTERO_POSES.grab(t)), note: 'pull out, flare, feet reach and close on the fish (+42..+44), feet anchor carries the fish'},
      CLIMB: {cycle: true, build: (t) => buildPterosaur(PTERO_POSES.climb(t)), note: 'climb past the lens with the fish, two beats'},
      LAND: {cycle: false, build: (t) => buildPterosaur(PTERO_POSES.land(t)), note: 'land on the snag: flare, fold 0 -> 0.85, feet forward'},
      GULP: {cycle: true, build: (t) => buildPterosaur(PTERO_POSES.gulp(t)), note: 'head toss and gulp (+112..+124)'},
      PREEN: {cycle: true, build: (t) => buildPterosaur(PTERO_POSES.preen(t)), note: 'preen: neck curls back to the folded wing, nibbles'},
    },
  },
  RAPTOR: {
    id: 'AS-RAPTOR-R1', label: 'Velociraptor-type dromaeosaur 2 m, back 0.53 m over the hips, feathered, kit test 14 Nov 2026', size: 2.2, hc: 0.4, stand: () => buildRaptor(RAPTOR_POSES.stand()),
    anims: {
      STAND: {cycle: false, build: () => buildRaptor(RAPTOR_POSES.stand()), note: 'stand, wings folded, mouth a little open'},
      WALK: {cycle: true, side: true, build: (t) => buildRaptor(RAPTOR_POSES.walk(t)), note: 'walk, 0.5 m stride, stiff tail swaying from its base'},
      POUNCE: {cycle: false, build: (t) => buildRaptor(RAPTOR_POSES.pounce(t)), note: 'pounce: crouch, push off, leap nose-up with the feet and sickle claws swung forward, wings spread'},
    },
  },
};
