// EDU-EP07-SHORT clocks (scene sheets EDU-EP07-SHEETS-R1.2 "Story clock and derived values"). Every function is a pure function of the composition
// frame G (or of an integer numerator), so any shot seeks without state. Shot-local L = G - start. Ranges are half-open [start, end).

export const FPS = 30;
export const SHOT_RANGES = [
  ['S01-B01-SH01', 0, 33], ['S01-B01-SH02', 33, 170], ['S01-B02-SH01', 170, 272], ['S01-B02-SH02', 272, 342], ['S01-B02-SH03', 342, 395],
  ['S01-B03-SH01', 395, 559], ['S01-B03-SH05', 559, 647], ['S01-B03-SH04', 647, 760],
  ['S01-B04-SH01', 760, 837], ['S01-B04-SH02', 837, 942], ['S01-B04-SH03', 942, 1027], ['S01-B04-SH04', 1027, 1113], ['S01-B04-SH05', 1113, 1212], ['S01-B04-SH06', 1212, 1300],
  ['S01-B05-SH01', 1300, 1400], ['S01-B05-SH02', 1400, 1463], ['S01-B05-SH03', 1463, 1580],
] as const;
export type ShotId = (typeof SHOT_RANGES)[number][0];
export const TOTAL = 1580;
export const startOf = (id: ShotId): number => SHOT_RANGES.find(([k]) => k === id)![1];
export const lenOf = (id: ShotId): number => { const r = SHOT_RANGES.find(([k]) => k === id)!; return r[2] - r[1]; };

// ---- named frames (G)
export const G_BLINK = 45;       // "ตอนนี้": the Sun goes out (B01-SH02 L12)
export const G_ZERO = 784;       // "ศูนย์": 00:00 (R1.2)
export const G_SEAM = 1579;      // the last frame: ambient clocks run on G - 1579 in B05-SH02/SH03 so it equals G0

/** Eased 0..1 over [a, b] (cosine in-out), clamped. */
export const ease = (x: number, a: number, b: number): number => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return 0.5 - 0.5 * Math.cos(Math.PI * u); };
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const ramp = (x: number, a: number, b: number): number => clamp01((x - a) / (b - a));
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

// ---- story clock: story seconds x 99 as an integer numerator (exact), so the displayed `ceil` is never off by float error
/** 99 * clk(G), four visible rates (SD08, R1.2): A [170, 395) 9.09x (R1.1, unchanged); B [395, 559) 56.9x, 07:11 -> 02:00; C [559, 749) 14.2x, 02:00 -> 00:30; D [749, G_ZERO] 25.7x, the race 00:30 -> 00:00. */
export const clk99 = (G: number): number => {
  if (G <= 170) return 499 * 99;
  if (G < 395) return 499 * 99 - 30 * (G - 170);
  if (G < 559) return 120 * 99 + (30770 * (559 - G)) / 164;
  if (G < 749) return 30 * 99 + (90 * 99 * (749 - G)) / 190;
  if (G < G_ZERO) return (30 * 99 * (G_ZERO - G)) / (G_ZERO - 749);
  return 0;
};
export const clk = (G: number): number => clk99(G) / 99;
/** Seconds shown on the card: ceil of the story clock (integer arithmetic on the numerator). */
export const shownSec = (G: number): number => Math.ceil(Math.round(clk99(G) * 1000) / 1000 / 99);
export const cardText = (G: number): string => { const s = shownSec(G); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
/** Progress q(G) = (499 - clk) / 499: 0 at G170, 0.1366 at G395, 0.7595 at G559, 0.9399 at G749, 1 at G784. */
export const qOf = (G: number): number => (499 - clk(G)) / 499;

// ---- ring and Earth (SET-SPACE su)
export const EARTH_R = 0.11;
export const R_MEET = 1 - EARTH_R; // earthK 1 in the split: the ring front meets Earth's near limb on G_ZERO
/** News-front radius: 0 -> 0.10 linear from the blink to G170; then 0.10 -> R_MEET on q; 0.89 -> 1.11 over G784-794 (crossing the disc). */
export const ringR = (G: number): number => {
  if (G < G_BLINK + 2) return 0;
  if (G <= 170) return 0.10 * ((G - (G_BLINK + 2)) / (170 - (G_BLINK + 2)));
  if (G <= G_ZERO) return 0.10 + (R_MEET - 0.10) * qOf(G);
  return R_MEET + (1.11 - R_MEET) * clamp01((G - G_ZERO) / 10);
};
/** Ring opacity: full to G794, fading out over G794-804. */
export const ringAlpha = (G: number): number => 1 - ramp(G, G_ZERO + 10, G_ZERO + 20);
/** Earth's orbital angle (deg): -60 until G170, -60 + 15 q after, the tangent (-45) from G784. */
export const earthPhi = (G: number): number => -60 + 15 * qOf(Math.max(170, Math.min(G, G_ZERO)));

// ---- ambient clocks
/** Pestle: P(G) = frac((G + 12.8) / 18); stroke 0 = tip in the mortar, 1 = raised. Period 18 f = 100 bpm. Negative G (seam) wraps cleanly. */
export const pestleStroke = (G: number): number => { const x = (G + 12.8) / 18, P = x - Math.floor(x); return 0.5 - 0.5 * Math.cos(2 * Math.PI * P); };
/** Pestle with the R1.2 warp (SD12): the ambient cycle to G721 (the music is out from "แม้แต่ข่าวร้าย"), then 6 % faster (period 16.9 f) so the top (stroke 1) lands exactly on G_ZERO and stays frozen there (LF03). */
export const WARP_FROM = 721;
export const pestleStrokeAt = (G: number): number => {
  if (G >= G_ZERO) return 1;
  if (G < WARP_FROM) return pestleStroke(G);
  const x = (WARP_FROM + 12.8) / 18 + ((G - WARP_FROM) * 3.7333) / 63, P = x - Math.floor(x);
  return 0.5 - 0.5 * Math.cos(2 * Math.PI * P);
};
/** Ambient seconds of the street figures: composition time, except B05-SH02/SH03 which run on G - G_SEAM so the last frame equals G0. */
export const ambientT = (G: number): number => (G >= 1400 ? (G - G_SEAM) / FPS : G / FPS);
