import {F} from '../field';
import {ease, frac} from '../motion19';
import {makeShot} from '../shot';
import {sheetCam, sheetMove, type FieldShotDef} from '../stage';
import {trailPrints} from '../trail';

// B03-SH01 · G 1037-1100 (63 f) · "แต่ถ้ามันไล่ดมทีละรอย…" (L07a; EDU-EP19-SHEETS-R3, camera R1 arc). GIRL at G1, front, thinking (sly); on "ทีละรอย…"
// her eyes slide to screen left-back (toward the mat stack) l 36-46 and the head follows 15 deg (`headCock`); the grin spreads at l 50 (R3). The
// held glance is the eyeline match into SH02. Sun B03 (deep gold, 18 deg).
const N = 63;
const M = sheetMove([6.7, 1.0, -0.4], [-22, -30], [1.2, 1.1], 1.25, {f: 1000, hy: 600});

export const B03_SH01: FieldShotDef = {
  id: 'B03-SH01', N,
  cam: (L) => sheetCam(M, L, N),
  state: (L) => {
    const g = ease(frac(L, 36, 46));
    return {sun: 'B03', t: L / 30, prints: trailPrints(), stack: false,
      girl: {at: F.G1, view: 'front', pose: 'P01', face: L >= 50 ? 'smug' : 'suspicious',
        faceState: {look: [-0.85 * g, -0.2 * g], ...(L >= 50 ? {mouth: 'grin' as const} : {})}, fig: {headCock: -15 * g}}};
  },
};
export const shot = makeShot(B03_SH01);
