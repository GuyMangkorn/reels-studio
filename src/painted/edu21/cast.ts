import {bodyFrame, type CastDef} from '../kit/cast';
import {PEOPLE} from '../kit/people';

// EDU-EP21-SHORT cast (EDU-EP21-BRIEF-R1 VD02; casting approved by the user 2026-11-16, Q2 "as briefed").
// DRIVER: `woman-ponytail + new: commuter (mustard short-sleeve blouse, navy trousers, dark flats)`. The outfit is episode-side (brief N3),
// filed into kit/wardrobe.ts only at kit intake (W8.4). Head, height and face look are the kit person's, unchanged.

/** DRIVER `woman-ponytail + new: commuter`, 1.66 m. */
export const DRIVER: CastDef = {
  ...PEOPLE['woman-ponytail'],
  outfit: {shoulder: 0.36, shirt: '#d9a23a', sleeve: '#d9a23a', longSleeves: false, pants: '#2f3a55', shoes: '#2a2a2c'},
};

/**
 * Seated hip joint of DRIVER in space R (metres). W3 look-frame estimate, revised from BRIEF-R1's H (-0.30, 0.52, +0.38):
 * x moved forward to -0.15 so her head sits in the front door glass ahead of the B-pillar, and y lowered to 0.40 so the four-head card's
 * crown (hip + 0.97 m) clears the roof lining (y 1.44). To be confirmed in the W5.1 sheets.
 */
export const DRIVER_HIP: [number, number, number] = [-0.15, 0.4, 0.38];

/** Ground point to hand `paintFigureAt` so a `sit: 1` pose puts DRIVER's hip joint at `hip` (the feet fall below the cabin floor, hidden). */
export const seatedGround = (def: CastDef, hip: [number, number, number], view: 'front' | 'left' | 'right' = 'right'): [number, number, number] => {
  const f = bodyFrame(def, {view, sit: 1});
  return [hip[0], hip[1] - f.hipV, hip[2]];
};
