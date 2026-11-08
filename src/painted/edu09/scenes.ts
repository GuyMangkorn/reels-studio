import {paintHandMacro, type HandAnchors} from '../kit/hands';
import type {Painter} from '../kit/painter';
import {camMove, camOf} from '../kit/cam-moves';
import type {FigAnchors} from '../kit/cast';
import {EXPRESSIONS} from '../kit/expressions';
import type {FaceState} from '../kit/head';
import type {YCam} from '../kit/ycam';
import {paintDining, TABLE_Y} from './dining';
import {boyHand, diagCam, paintHandTable, povCam} from './handclose';
import {paintTendons} from './tendons';
import {keysOf, paintPianist, paintPiano, pianistHand, pianoCam, pressDepth, PIANO_TUNE, tuneAt, TUNE_END} from './piano';

// EDU-EP09-SHORT look frames (brief EDU-EP09-BRIEF-R1.2, rows EDU-EP09-ROWS-R1.2, workflow W3). LOOK-FRAME CODE: pure paint functions of the frame.
// LF01 HAND-CLOSE frame 0 (S01-B01-SH01, flat), LF01b the same shot's end (ring strain), LF02 SET-DINING (S01-B01-SH02), LF03 see-through
// diagram (S01-B03-SH01), LF04 PIANO-CLOSE (S01-B04-SH01).
export const LF_FRAMES = {LF01: 1, LF01m: 1, LF01b: 1, LF02: 1, LF03: 1, LF04: 1, QAPIANO: TUNE_END + 1, QAGRIN: 1} as const;
export const MEASURE: Record<string, {hand?: HandAnchors; boy?: FigAnchors | null; elder?: FigAnchors | null}> = {};

export const paintLF01 = (p: Painter) => {
  const cam = povCam(0);
  paintHandTable(p, cam);
  MEASURE.LF01 = {hand: paintHandMacro(p, cam, boyHand('flat'))};
};
/** End of S01-B01-SH01: TP (middle folded under), ring pressed and straining (tremble frozen at this frame). */
export const paintLF01b = (p: Painter) => {
  const cam = povCam(1);
  paintHandTable(p, cam);
  MEASURE.LF01b = {hand: paintHandMacro(p, cam, boyHand('ring-strain', {tremble: {finger: 'ring', amp: 0.08, hz: 10}}))};
};
/** Measure twin of LF01: the same hand and camera on plain paper, no table or shadows, so a colour mask gives the silhouette in px. */
export const paintLF01m = (p: Painter) => { paintHandMacro(p, povCam(0), {...boyHand('flat'), plane: undefined}); };

// ---- LF02: S01-B01-SH02 frame 0. brief `T-BOY: cam: (-0.26, 1.00, -0.62), yaw 10 -> 6, r 1.05 -> 1.00, eye 1.05, pitch -3, f 1100, hy 700`.
// W3 (R1.2): pulled back to r 1.60 with f 1650 (same head size) at eye 0.98, so the table reads as a strip with its props and the near edge.
// Fix round 1 (R1.3, viewer check): yaw 10 -> 6 narrowed to 7 -> 6 (inside the brief range; the near table edge tilts less) and a lens shift
// cx -130 px, so ELDER's laughing face is whole at the right while BOY stays the lead (camera position and target unchanged).
// Fix round 2 (R1.4): cx -245, so both of ELDER's ears are in (v2 still cut his right cheek and far ear).
export const LF02_MOVE = camMove([-0.26, 1.0, -0.62], [7, 6], [1.6, 1.52], 0.98, {pitch: [-2, -2], f: 1650, hy: 780, cx: -245});
export const camLF02: YCam = camOf(LF02_MOVE, 0);
/** BOY's comic strain (brief VD09/VD10): brows down, eyes squeezed shut, mouth clenched in a wavy line, a sweat drop; never pained. */
export const STRAIN: FaceState = {...EXPRESSIONS.neutral, brow: 'angry', eyes: 'shut', mouth: 'wavy', sweat: true, look: [0, 0]};
export const paintLF02 = (p: Painter, frame: number) => {
  const t = frame / 30, y = TABLE_Y;
  const out = paintDining(p, camLF02, {
    t,
    // Fix round 2 (R1.4): elbows on the wood outside the shoulders, forearms angled in toward the hands (a visible elbow bend, foreshortened
    // toward the lens, UT06); left and right paired but not mirrored (the strain hand 3 cm further forward and nearer the centre).
    // R1.8: right hand and elbow 1.5 cm further left, so the wider-opening kit thumb (847c064) keeps about 30 px clear of the strain hand's thumb.
    boy: {t: t + 0.4, face: STRAIN, lHand: [-0.2, y, -0.09], lElbow: [-0.13, y + 0.026, -0.32], lPose: 'ring-strain', rHand: [-0.33, y, -0.12], rElbow: [-0.405, y + 0.026, -0.33]},
    elder: {t: t + 1.1, face: {...EXPRESSIONS.happy, look: [-0.6, 0.2]}, lHand: [0.4, y, -0.16], lElbow: [0.47, y + 0.026, -0.38], rHand: [0.15, y, -0.15], rElbow: [0.16, y + 0.026, -0.37]},
  });
  MEASURE.LF02 = out;
};

// ---- LF03: S01-B03-SH01 at "สายเชิดหุ่น" (about 75 % of the shot): skin at 28 %, the shared muscle lit coral, four cords after their pulse,
// the puppet cross ghost on; own muscles and ties not yet (they come in SH02/SH03). DIAG-W `r 40 -> 37, eye 58 -> 55` at u 0.75. Room dimmed to 70 %.
export const camLF03 = diagCam(0.75);
export const paintLF03 = (p: Painter) => {
  paintHandTable(p, camLF03, {dim: 1});
  const h = {...boyHand('flat'), skinAlpha: 0.28, shadowAlpha: 0.14};
  const hand = paintHandMacro(p, camLF03, h);
  paintTendons(p, camLF03, h, {shared: 1, sharedLit: 0, cords: 1, own: 0, pulse: 0.42, cross: 1});
  MEASURE.LF03 = {hand};
};

// ---- LF04: S01-B04-SH01 mid-run: the middle finger presses E (thumb -> little run), PIANO `yaw 35 -> 28, r 34 -> 31` at u 0.4.
// The hand's key-contact pose is a placeholder (W5 builds the real piano poses).
export const camLF04 = pianoCam(0.4);
export const paintLF04 = (p: Painter) => {
  paintPiano(p, camLF04, {pressed: [2]});
  MEASURE.LF04 = {hand: paintPianist(p, camLF04, pianistHand('middle'))};
};

// ---- W5.2 QA stills (Boss, 8 Nov 2026): shot-local frame f of S01-B04-SH01 with the SD05 tune (dyad at L42-60, closing chord L108-140), and
// ELDER's grin face for S01-B05-SH04 (D01) at its camera. Not look frames: they check the new multi-finger press and the FaceState.
export const paintQAPiano = (p: Painter, frame: number) => {
  const cam = pianoCam(frame / TUNE_END), press = tuneAt(frame);
  const onset = [...PIANO_TUNE].reverse().find((n) => n.f <= frame)?.f ?? 0;
  paintPiano(p, cam, {pressed: keysOf(press)});
  MEASURE.QAPIANO = {hand: paintPianist(p, cam, pianistHand(press, 2000, press.length ? pressDepth(frame, onset) : 0))};
};
/** ELDER's grin (SHEETS-R2 SD09): brow up, eyes dot, mouth grin; a kit FaceState, no new asset. */
export const GRIN: FaceState = {brow: 'up', eyes: 'dot', look: [-0.6, 0.5], mouth: 'grin'};
export const D01_MOVE = camMove([-0.05, 0.86, -0.42], [-8, -7], [1.24, 1.22], 1.62, {pitch: [-30, -30], f: 1150, hy: 740});
/** Pendant raised from 1.45 m so its shade clears ELDER's eyes at this camera (at 1.45 the shade covers his eyes and brows; Film SD09 est did not include the lamp). */
export const D01_LAMP_Y = 1.85;
export const camD01: YCam = camOf(D01_MOVE, 1);
export const paintQAGrin = (p: Painter) => {
  const y = TABLE_Y;
  MEASURE.QAGRIN = paintDining(p, camD01, {
    t: 0.5, lampY: D01_LAMP_Y,
    boy: {t: 0.5, face: {...EXPRESSIONS.suspicious, look: [0.8, -0.1]}, lHand: [-0.2, y, -0.09], lElbow: [-0.13, y + 0.026, -0.32], lPose: 'flat', rHand: [-0.33, y, -0.12], rElbow: [-0.405, y + 0.026, -0.33]},
    elder: {t: 0.9, face: GRIN, rHand: [0.15, y, -0.15], rElbow: [0.16, y + 0.026, -0.37]},
  });
};
