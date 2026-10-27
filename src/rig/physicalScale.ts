import type {Actor} from '../scenes/types';
import {CAT_SEATED_BODY_DROP_UNITS, HUMAN_HIP_FROM_ANCHOR} from './geometry';

export type ActorScaleSpec = {
  physicalEstimate: true;
  heightM: number;
  solidBoundsSource: 'authored-svg-path-extents';
  solidBounds: {left: number; top: number; right: number; bottom: number};
  floorAnchor: {x: number; y: number; source: string};
  bodyLengthM?: number;
  bodyBounds?: {left: number; right: number; source: string};
  seatedBodyDropUnits?: number;
};

/**
 * CATBOX-METER-R1 design estimates for the existing shared SVG cut-outs.
 * R5 sets the cat's shared height to one sixth of the owner's to meet the user-directed Short scale.
 * Solid vertical extents are source-path bounds (shadow excluded), not scanned measurements.
 * Keep this registry as the single conversion from an actor's authored height to rig units.
 */
export const PHYSICAL_ACTOR_SPECS: Partial<Record<Actor['type'], ActorScaleSpec>> = {
  narrator: {
    physicalEstimate: true,
    heightM: 1.70,
    solidBoundsSource: 'authored-svg-path-extents',
    solidBounds: {left: -65, top: -239, right: 65, bottom: 182},
    floorAnchor: {x: 0, y: HUMAN_HIP_FROM_ANCHOR, source: 'HUMAN_HIP_FROM_ANCHOR'},
  },
  cat: {
    physicalEstimate: true,
    // CATBOX Short baseline R2: a full standing floor-to-ear silhouette estimate.
    // At 1.70m for the owner, 0.2833m keeps the canonical height ratio close to 6:1.
    heightM: 1.70 / 6,
    bodyLengthM: 0.48,
    solidBoundsSource: 'authored-svg-path-extents',
    solidBounds: {left: -155, top: -179, right: 123, bottom: 29},
    bodyBounds: {left: -87, right: 123, source: 'body, head, muzzle; excludes tail'},
    floorAnchor: {x: 0, y: 30, source: 'Animal floor shadow center / paw baseline'},
    seatedBodyDropUnits: CAT_SEATED_BODY_DROP_UNITS,
  },
};
