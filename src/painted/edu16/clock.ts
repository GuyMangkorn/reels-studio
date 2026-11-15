// EDU-EP16-SHORT clocks (timed scene sheet EDU-EP16-SHEETS-R2, scripts/edu-series/ep16/storyboard.md; Boss W5.2, re-keyed to R2 in W5.5, 2026-11-15). Pure functions of the
// composition frame G (= scene-local, offset 0) or of the shot-local frame L = G - shot start; ranges are half-open [start, end). No state, no random,
// so every plate is direct-seekable. The blip clock is the one clock shared by picture and sound (sheet "Blip clock"; the same frames are written for
// Ton and Editor in scripts/edu-series/ep16/blip-clock.json, which this module reads).
import BLIP from '../../../scripts/edu-series/ep16/blip-clock.json';

export const FPS = 30;
export const TOTAL = 1800;
export const SHOT_RANGES = [
  ['S01-B01-SH01', 0, 30], ['S01-B01-SH02', 30, 119], ['S01-B01-SH03', 119, 163],
  ['S01-B02-SH04', 163, 234], ['S01-B02-SH05', 234, 316], ['S01-B02-SH06', 316, 400], ['S01-B02-SH07', 400, 489], ['S01-B02-SH08', 489, 571],
  ['S01-B03-SH09', 571, 636], ['S01-B03-SH10', 636, 675], ['S01-B03-SH11', 675, 731],
  ['S01-B04-SH12', 731, 803], ['S01-B04-SH13', 803, 907], ['S01-B04-SH14', 907, 959], ['S01-B04-SH15', 959, 1073], ['S01-B04-SH15S', 1073, 1097],
  ['S01-B05-SH16', 1097, 1125], ['S01-B05-SH17', 1125, 1171], ['S01-B05-SH18', 1171, 1323], ['S01-B05-SH19', 1323, 1450], ['S01-B05-SH20', 1450, 1472],
  ['S01-B05-SH21', 1472, 1495], ['S01-B05-SH22', 1495, 1628], ['S01-B05-SH23', 1628, 1800],
] as const;
export type ShotId = (typeof SHOT_RANGES)[number][0];
export const startOf = (id: ShotId): number => SHOT_RANGES.find(([k]) => k === id)![1];
export const lenOf = (id: ShotId): number => { const r = SHOT_RANGES.find(([k]) => k === id)!; return r[2] - r[1]; };
/** Short shot ID as the sheet and the review page write it in labels (`SH01`, `SH15S`). */
export const shortId = (id: ShotId) => id.slice(8);

export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const ramp = (x: number, a: number, b: number): number => clamp01((x - a) / (b - a));
/** Eased in-out (cubic, the sheet's default move) over [a, b]. */
export const ease = (x: number, a: number, b: number): number => { const u = ramp(x, a, b); return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2; };
export const easeIn = (x: number, a: number, b: number): number => { const u = ramp(x, a, b); return u * u; };
export const easeOut = (x: number, a: number, b: number): number => { const u = ramp(x, a, b); return 1 - (1 - u) * (1 - u); };
export const mix = (a: number, b: number, k: number): number => a + (b - a) * k;

// ---------- blip clock (picture and sound) ----------
/** Spike frames f = 21 n, n = 0..32 (f0 ... f672); the trace is flat from f675; f693 is the first missing blip (W-STOP). */
export const BLIP_PERIOD: number = BLIP.period, BLIP_FRAMES: readonly number[] = BLIP.spikes, FLAT_FROM: number = BLIP.flatFrom, MISSING_BLIP: number = BLIP.missing;
if (BLIP_FRAMES.length !== 33 || BLIP_FRAMES[32] !== 672 || BLIP_FRAMES.some((f, n) => f !== BLIP_PERIOD * n)) throw new Error('EDU16 blip clock: spikes must be 21 n, n = 0..32');
/** Spike height 0..1 at composition frame G: 3 f per spike (1, 0.62, 0.28), 0 between spikes and from FLAT_FROM. */
export const spikeAt = (G: number): number => {
  if (G >= FLAT_FROM || G < 0) return 0;
  const k = G % BLIP_PERIOD;
  return G - k > BLIP_FRAMES[BLIP_FRAMES.length - 1] ? 0 : ([1, 0.62, 0.28][k] ?? 0);
};
/** Phosphor level of the trace: 1 while blipping and on the flat line to the missing blip, then dims 30 % over f693-699 (SH11 +18..+24). */
export const traceLevelAt = (G: number): number => (G < MISSING_BLIP ? 1 : 1 - 0.3 * ramp(G, MISSING_BLIP, MISSING_BLIP + 6));
/** RoofState trace fields for composition frame G. */
export const traceAt = (G: number) => ({trace: (G < FLAT_FROM ? 'blip' : 'flat') as 'blip' | 'flat', spike: spikeAt(G), traceLv: traceLevelAt(G)});

// ---------- label and grade chapters ----------
/** "ภาพจำลอง" on [0, 163), off [163, 316), on [316, 1495), off [1495, 1800) (sheet "Label"). The timeline cue `label` carries it (Editor); QA stills show it from here. */
export const labelOn = (G: number): boolean => (G >= 0 && G < 163) || (G >= 316 && G < 1495);
/** `RoofState.cool` per roof shot (sheet "Grade chapters"). */
export const COOL: Partial<Record<ShotId, number>> = {
  'S01-B01-SH01': 0, 'S01-B01-SH02': 0, 'S01-B01-SH03': 0.25, 'S01-B02-SH04': 0.25, 'S01-B02-SH05': 0.25, 'S01-B02-SH08': 0.3,
  'S01-B03-SH09': 0.35, 'S01-B03-SH10': 0.35, 'S01-B03-SH11': 0.35, 'S01-B04-SH12': 0.5, 'S01-B05-SH16': 0.5, 'S01-B05-SH17': 0.5,
  'S01-B05-SH19': 0.6, 'S01-B05-SH20': 0.6, 'S01-B05-SH22': 0.8, 'S01-B05-SH23': 0.8,
};

// ---------- W-STRIKE (SH15S, shot-local) ----------
/** STK keys on SH15S's clock: contact +8 (f1081), flash +8..+13, ring +8..+15, bead death +9..+11, claw planted +16..+17, black +18..+23. */
export const STK_KEYS = {contact: 8, ringTo: 15, plantedFrom: 16, blackFrom: 18, len: 24} as const;
/** Bead progress on the thread: 0 at SH14 +12 (f919), 0.11 at SH14 +51 (f958), 0.40 at SH15S +0 (f1073) and SH15's end (D7). */
export const beadAt = (G: number): number => G < 919 ? 0 : G < 958 ? 0.11 * ramp(G, 919, 958) : G < 1073 ? mix(0.11, 0.4, ramp(G, 958, 1073)) : 0.4;
