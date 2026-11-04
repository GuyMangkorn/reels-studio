// EG-EP02-SHORT sheet states (Boss B4, scene sheets S03-B01-SH02 and S04-B01-SH01, brief VD07). Pure functions of the shot-local
// frame: no painting here. The top sheet on the lamp post hangs with its blank back to the lens, then one gust turns it about
// its left tape line (the hinge) to face out: its width goes through 0 (edge-on) and settles with a small overshoot.

/** Top-sheet pose at one frame: width factor of the sheet (0..1+, edge-on near 0), which side shows, droop and ambient stir. */
export type SheetState = {
  /** Horizontal scale about the tape line; the printed side shows when `face` is `front`. */
  width: number;
  face: 'front' | 'back';
  /** 0 = lies flat, 1 = hangs loose from the tape (bottom corner sags, sheet leans). */
  droop: number;
  /** Vertical stir in px (ambient clock, 0.6 Hz while it hangs). */
  dy: number;
  /** Amplitude in px of the flutter of the older layers (f 4-26 of the gust, then settled). */
  flutter: number;
};

/** Gust timing, shot-local frames of S04-B01-SH01 (index: flip f4-22, settle f22-30). */
export const FLIP = {start: 4, end: 22, settleEnd: 30, flutterEnd: 26} as const;
const ease = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Top sheet during S03-B01-SH02 / S04-B01-SH01. `f` = frames since the start of S04-B01-SH01 (negative values are the S03 hold,
 * where only the stir moves). `pw` = sheet width in px (overshoot is +-2 px of it).
 */
export const sheetFlip = (f: number, pw = 420): SheetState => {
  const u = clamp01((f - FLIP.start) / (FLIP.end - FLIP.start)), e = ease(u);
  const cos = Math.cos(Math.PI * e); // 1 (blank back out) -> 0 (edge-on) -> -1 (printed side out)
  const over = f > FLIP.end ? 2 * Math.exp(-(f - FLIP.end) / 3) * Math.sin((f - FLIP.end) * 1.3) : 0; // px, damped, +-2 px at most
  const settled = clamp01((f - FLIP.end) / (FLIP.settleEnd - FLIP.end));
  const stir = Math.sin((f / 30) * Math.PI * 2 * 0.6);
  return {
    width: Math.abs(cos) + over / pw,
    face: cos < 0 ? 'front' : 'back',
    droop: f < FLIP.start ? 1 : Math.max(0, 1 - e * 1.4),
    dy: (f < FLIP.end ? 1 - e : 1 - settled) * stir,
    flutter: f >= FLIP.start && f < FLIP.flutterEnd ? 3 * Math.sin(((f - FLIP.start) / (FLIP.flutterEnd - FLIP.start)) * Math.PI) : 0,
  };
};

// --- shot list and hood pull (pure data, importable without the painter) ------------------------------------------------
export const EG2_SHOTS = [
  ['S01-B01-SH01', 128], ['S01-B01-SH02', 78], ['S01-B02-SH01', 82], ['S01-B02-SH02', 108], ['S01-B02-SH03', 181],
  ['S02-B01-SH01', 86], ['S02-B01-SH02', 36], ['S02-B01-SH03', 107], ['S02-B01-SH04', 106],
  ['S03-B01-SH01', 148], ['S03-B01-SH02', 74],
  ['S04-B01-SH01', 89], ['S04-B01-SH02', 74], ['S04-B01-SH03', 120], ['S04-B01-SH04', 87], ['S04-B01-SH05', 63], ['S04-B01-SH06', 36], ['S04-B01-SH07', 37],
  ['S05-B01-SH01', 299],
] as const;
export type Eg2ShotId = (typeof EG2_SHOTS)[number][0];
export const EG2_FRAMES: Record<Eg2ShotId, number> = Object.fromEntries(EG2_SHOTS) as Record<Eg2ShotId, number>;


// --- hoodPull (B5, VD04; r1 3 Nov 2026) ---------------------------------------------------------------------------------
/**
 * `คุณ` pulls the hood up (S01-B01-SH02, back view) with the kit motion `hood-pull` (src/painted/kit/motions.ts): the hands reach the
 * hood at the neck, carry it up over the head (the hood rim travels with the hands), drop. The motion (1.5 s) starts
 * at f28, so the lift ends (hood on) at f59.5 = swap f60 (the rustle sound is timed to it) and the hands are down by f73. Pure function
 * of the shot-local frame; `t` is the motion time in seconds.
 */
export const HOOD_PULL_START = 28;
export const hoodPull = (f: number): {t: number; hoodUp: boolean} => ({t: Math.max(0, f - HOOD_PULL_START) / 30, hoodUp: f >= 60});
