import type {Pt} from '../../kit/painter';
import type {V3} from '../../kit/space';
import {crouchSniff, ease, frac, girlRunPhase, kneelRise} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B02-SH04 · G 721-797 (76 f) · "ฟุดฟิด… หายเกลี้ยงแล้ว!" (V03; EDU-EP19-SHEETS-R3, camera R1 push l 0-45 then held). NO GLOW (the print is ordinary).
// GIRL `new: crouch-sniff` (motion19.ts) in left profile, knees at (4.85, 0, 0), nose ~5 cm over her print at (4.6, 0, 0): two exaggerated sniffs
// on "ฟุดฟิด" l 1-9 (the head dips twice), nose hovering with the eyes darting l 10-34, sits back up to kneeling l 36-44, the smug grin landing on
// "หายเกลี้ยงแล้ว!" (l 42); she is up at l 56 and dashes off screen right toward the tree l 60-76 (P38 right profile, no-slide run phase).
// Sheet note: "front three-quarter" for the crouch; the kit's kneel + bend reads only in profile, so the crouch is drawn in left profile (Film).
const N = 76;
const M = sheetMove([4.8, 0.4, 0], [-20, -12], [1.5, 1.35], 0.6, {f: 1000, hy: 720});
const AT: V3 = [4.85, 0, 0];
/** Dash: eases in from the knees' x, 2.4 m in 16 f (off frame right by ~l 72). */
const dashX = (L: number) => AT[0] + 2.4 * frac(L, 58, 76) ** 1.6;

export const B02_SH04: FieldShotDef = {
  id: 'B02-SH04', N,
  cam: (L) => sheetCam(M, Math.min(L, 45), 45),
  state: (L) => {
    const c = sheetCam(M, Math.min(L, 45), 45), base = {sun: 'B02' as const, t: L / 30, prints: trailPrints(), stack: false};
    if (L >= 58) {
      const x = dashX(L);
      return {...base, girl: {at: [x, 0, 0], view: 'right', pose: 'P38', face: 'laugh', fig: {run: girlRunPhase(x - AT[0])}}};
    }
    // Fix round 1 (user 2026-11-16: "stretching up / standing looks odd"; was a cut from the knees to a stiff upright stand at l 50): she gets up
    // through the kit kneel in reverse (hips up over the knees, the near foot steps forward into a lunge, then up) l 44-55 in the same left
    // profile, leaning into the push (bend), the hands leaving the thighs (`new: kneel-rise`); at l 55 she turns to the right profile and loads into a small crouch for the dash.
    if (L >= 55) return {...base, girl: {at: AT, view: 'right', pose: 'P01', face: 'smug', faceState: {mouth: 'grin'}, fig: {crouch: 0.3 * ease(frac(L, 55, 58)), bend: 0.15 * ease(frac(L, 55, 58))}}};
    if (L >= 44) return {...base, girl: {at: AT, view: 'left', pose: 'P01', face: 'smug', faceState: {mouth: 'grin'}, fig: kneelRise(c, AT, 'left', ease(frac(L, 44, 55)))}};
    const up = frac(L, 36, 44), cs = crouchSniff(c, AT, 'left', up);
    const dip = L <= 9 ? 0.06 * Math.max(0, Math.sin((Math.PI * 2 * (L - 1)) / 4)) : 0;
    const look: Pt = L >= 10 && L < 34 ? [Math.floor((L - 10) / 6) % 2 ? 0.7 : -0.7, 0.15] : [0, 0];
    const nod = cs.nod ?? [0, 0];
    return {...base, girl: {at: AT, view: 'left', pose: 'P01', face: L >= 40 ? 'smug' : 'neutral',
      faceState: {...(L >= 10 && L < 34 ? {look} : {}), ...(L >= 40 ? {mouth: 'grin' as const} : L <= 9 ? {mouth: 'o' as const} : {})},
      fig: {...cs, nod: [nod[0], nod[1] - dip * ease(1 - up)]}}};
  },
};
export const shot = makeShot(B02_SH04);
