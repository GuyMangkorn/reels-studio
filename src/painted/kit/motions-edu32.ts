import {animalWalkSpeed, type AnimalDef, type AnimalPose} from './animals';
import {clamp01, lerp} from './painter';
import type {V3} from './space';
import {camPoint, camUnit, type YCam} from './ycam';

const smooth = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};

/** Profile cat rising from a loaf. Progress is 0..1, with the paws revealed before the body rises. */
export const catLoafGetUp = (progress: number, view: 'left' | 'right' = 'left', restLid = 0.45): AnimalPose => {
  const blend = clamp01(progress);
  return {view, from: 'lie', state: 'stand', blend, loaf: 1 - smooth(blend / 0.3), lid: lerp(restLid, 0, smooth(blend * 2))};
};

/**
 * Kit gait clock (`AnimalPose.walk`, seconds) for a profile walk along world path `path(L)` (shot frames) seen through `camAt(L)`: the cat's own
 * picture-x travel over the ground (both points through the same camera, so a camera move does not count) divided by its lens scale and the kit
 * walk speed, integrated in quarter frames from `L0`. A path that runs toward the lens shows less picture travel, so the drawn paws step slower
 * to reduce planted-foot slide in the profile rig. World-space contact still depends on staging.
 */
export const pictureGaitClock = (def: AnimalDef, path: (L: number) => V3, camAt: (L: number) => YCam, L0: number, L: number): number => {
  const v = animalWalkSpeed(def);
  let s = 0;
  for (let x = L0; x < L - 1e-9; x += 0.25) {
    const x1 = Math.min(L, x + 0.25), c = camAt((x + x1) / 2), a = path(x), b = path(x1), pa = camPoint(c, a), pb = camPoint(c, b);
    const midpoint: V3 = [lerp(a[0], b[0], 0.5), lerp(a[1], b[1], 0.5), lerp(a[2], b[2], 0.5)];
    if (pa && pb) s += Math.abs(pb[0] - pa[0]) / camUnit(c, midpoint);
  }
  return s / v;
};
