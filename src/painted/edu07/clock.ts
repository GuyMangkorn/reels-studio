// EDU-EP07-SHORT clocks (scene sheets EDU-EP07-SHEETS-R1.1 "Story clock and derived values"). Every function is a pure function of the composition
// frame G (or of an integer numerator), so any shot seeks without state. Shot-local L = G - start. Ranges are half-open [start, end).

export const FPS = 30;
export const SHOT_RANGES = [
  ['S01-B01-SH01', 0, 33], ['S01-B01-SH02', 33, 170], ['S01-B02-SH01', 170, 272], ['S01-B02-SH02', 272, 342], ['S01-B02-SH03', 342, 395],
  ['S01-B03-SH01', 395, 578], ['S01-B03-SH02', 578, 751], ['S01-B03-SH03', 751, 903], ['S01-B03-SH04', 903, 978],
  ['S01-B04-SH01', 978, 1055], ['S01-B04-SH02', 1055, 1160], ['S01-B04-SH03', 1160, 1245], ['S01-B04-SH04', 1245, 1331], ['S01-B04-SH05', 1331, 1430], ['S01-B04-SH06', 1430, 1518],
  ['S01-B05-SH01', 1518, 1618], ['S01-B05-SH02', 1618, 1681], ['S01-B05-SH03', 1681, 1798],
] as const;
export type ShotId = (typeof SHOT_RANGES)[number][0];
export const TOTAL = 1798;
export const startOf = (id: ShotId): number => SHOT_RANGES.find(([k]) => k === id)![1];
export const lenOf = (id: ShotId): number => { const r = SHOT_RANGES.find(([k]) => k === id)!; return r[2] - r[1]; };

// ---- named frames (G)
export const G_BLINK = 45;       // "ตอนนี้": the Sun goes out (B01-SH02 L12)
export const G_ZERO = 1002;      // "ศูนย์": 00:00
export const G_SEAM = 1797;      // the last frame: ambient clocks run on G - 1797 in B05-SH02/SH03 so it equals G0

/** Eased 0..1 over [a, b] (cosine in-out), clamped. */
export const ease = (x: number, a: number, b: number): number => { const u = Math.max(0, Math.min(1, (x - a) / (b - a))); return 0.5 - 0.5 * Math.cos(Math.PI * u); };
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const ramp = (x: number, a: number, b: number): number => clamp01((x - a) / (b - a));
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

// ---- story clock: story seconds x 99 as an integer numerator (exact), so the displayed `ceil` is never off by float error
/** 99 * clk(G): visible 9.09x on G [170, 578), hidden linear on [578, 903), visible again from 00:30 on [903, 1002]. */
export const clk99 = (G: number): number => {
  if (G <= 170) return 499 * 99;
  if (G < 578) return 499 * 99 - 30 * (G - 170);
  if (G < 903) { const a = 499 * 99 - 30 * 408, b = 30 * 99; return a + (b - a) * ((G - 578) / 325); }
  if (G < 1002) return 30 * (1002 - G);
  return 0;
};
export const clk = (G: number): number => clk99(G) / 99;
/** Seconds shown on the card: ceil of the story clock (integer arithmetic on the numerator). */
export const shownSec = (G: number): number => Math.ceil(Math.round(clk99(G) * 1000) / 1000 / 99);
export const cardText = (G: number): string => { const s = shownSec(G); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
/** Progress q(G) = (499 - clk) / 499: 0 at G170, 0.2477 at G577, 0.9399 at G903, 1 at G1002. */
export const qOf = (G: number): number => (499 - clk(G)) / 499;

// ---- ring and Earth (SET-SPACE su)
export const EARTH_R = 0.11;
export const R_MEET = 1 - EARTH_R; // earthK 1 in the split: the ring front meets Earth's near limb on G1002
/** News-front radius: 0 -> 0.10 linear from the blink to G170; then 0.10 -> R_MEET on q; 0.89 -> 1.11 over G1002-1012 (crossing the disc). */
export const ringR = (G: number): number => {
  if (G < G_BLINK + 2) return 0;
  if (G <= 170) return 0.10 * ((G - (G_BLINK + 2)) / (170 - (G_BLINK + 2)));
  if (G <= G_ZERO) return 0.10 + (R_MEET - 0.10) * qOf(G);
  return R_MEET + (1.11 - R_MEET) * clamp01((G - G_ZERO) / 10);
};
/** Ring opacity: full to G1012, fading out over G1012-1022. */
export const ringAlpha = (G: number): number => 1 - ramp(G, 1012, 1022);
/** Earth's orbital angle (deg): -60 until G170, -60 + 15 q after, the tangent (-45) from G1002. */
export const earthPhi = (G: number): number => -60 + 15 * qOf(Math.max(170, Math.min(G, G_ZERO)));

// ---- ambient clocks
/** Pestle: P(G) = frac((G + 12.8) / 18); stroke 0 = tip in the mortar, 1 = raised. Period 18 f = 100 bpm. Negative G (seam) wraps cleanly. */
export const pestleStroke = (G: number): number => { const x = (G + 12.8) / 18, P = x - Math.floor(x); return 0.5 - 0.5 * Math.cos(2 * Math.PI * P); };
/** The pestle stops on "ศูนย์": stroke 0.86 on G1002, rises to 1.0 by G1004 and stays. Before that the ambient cycle. */
export const pestleStrokeAt = (G: number): number => (G >= G_ZERO + 2 ? 1 : G >= G_ZERO ? mix(0.86, 1, (G - G_ZERO) / 2) : pestleStroke(G));
/** Ambient seconds of the street figures: composition time, except B05-SH02/SH03 which run on G - 1797 so the last frame equals G0. */
export const ambientT = (G: number): number => (G >= 1618 ? (G - G_SEAM) / FPS : G / FPS);
