// EDU-EP14-SHORT clocks (storyboard EDU-EP14-ROWS-R4.1, 30 fps, 1815 f). Pure functions of the shot-local frame `L` (= global f - shot start): the shot table,
// the drop-eye altitude (SP2), the gauge needles (N9) and the diagram timings. Seek-safe: no state, no random. Screen layers and painted shots read these.

export const FPS = 30;
export const TOTAL_FRAMES = 1815;
export const SHOT_TABLE = [
  ['S01-B01-SH01', 0, 68], ['S01-B01-SH02', 68, 129], ['S01-B01-SH03', 197, 88], ['S01-B01-SH04', 285, 46], ['S01-B01-SH05', 331, 61], ['S01-B01-SH06', 392, 66],
  ['S01-B01-SH07', 458, 107], ['S01-B01-SH08', 565, 79], ['S01-B01-SH09', 644, 42], ['S01-B02-SH01', 686, 65], ['S01-B02-SH02', 751, 178], ['S01-B02-SH03', 929, 110],
  ['S01-B03-SH01', 1039, 37], ['S01-B03-SH02', 1076, 37], ['S01-B03-SH03', 1113, 108], ['S01-B04-SH01', 1221, 111], ['S01-B04-SH02', 1332, 100], ['S01-B04-SH03', 1432, 88],
  ['S01-B05-SH01', 1520, 85], ['S01-B05-SH02', 1605, 137], ['S01-B05-SH03', 1742, 73],
] as const;
export type ShotId = (typeof SHOT_TABLE)[number][0];
export const shotAt = (f: number): {id: ShotId; L: number; len: number; start: number} | undefined => {
  const s = SHOT_TABLE.find(([, a, n]) => f >= a && f < a + n);
  return s ? {id: s[0], L: f - s[1], len: s[2], start: s[1]} : undefined;
};

export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep of `L` between frames a and b. */
export const sm = (a: number, b: number, L: number) => smooth(clamp01((L - a) / (b - a)));
/** Linear 0..1 between frames a and b. */
export const lin = (a: number, b: number, L: number) => clamp01((L - a) / (b - a));

// ---- SP2: B01-SH07 drop-eye altitude. h(+0) = 1150 m, h(+26) = 1000 m ("1 กม." marker), h(+76) ~ 30 m (LF04), h(+95) = 2.40 m (the lip). Log-style:
// h = 1150 * (2.40 / 1150)^e(u), e monotonic through the three anchors (pchip on log h).
const H_KEYS: [number, number][] = [[0, 1150], [26, 1000], [76, 30], [95, 2.4]];
const logH = H_KEYS.map(([l, h]) => [l, Math.log(h)] as [number, number]);
export const dropEyeAltitude = (L: number): number => {
  const x = Math.max(0, Math.min(95, L));
  let i = 0;
  while (i < logH.length - 2 && x > logH[i + 1][0]) i++;
  const [x0, y0] = logH[i], [x1, y1] = logH[i + 1];
  const d = (k: number) => { // Fritsch-Carlson tangent at key k
    const sl = (a: number, b: number) => (logH[b][1] - logH[a][1]) / (logH[b][0] - logH[a][0]);
    if (k === 0) return sl(0, 1);
    if (k === logH.length - 1) return sl(k - 1, k);
    const a = sl(k - 1, k), b = sl(k, k + 1);
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  };
  const h = x1 - x0, t = (x - x0) / h, t2 = t * t, t3 = t2 * t;
  const y = (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * d(i) + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * d(i + 1);
  return Math.exp(y);
};

// ---- N9 gauges. The no-air dial (0-700 km/h, "แบบจำลอง") in G1; the real dial (0-50) in G1 then G2 split needles.
/** B01-SH02: dial in at +10 reading 0; snaps 0 -> 700 in 4 f on "เจ็ดร้อย" (+76-+80), holds to +90, rewinds to 0 by +103. */
export const noairSH02 = (L: number) => 700 * (lin(76, 80, L) * (1 - sm(90, 103, L)));
/** B01-SH06: 0 -> 350 linear over +0..+65, never slowing (178 at +30). */
export const noairSH06 = (L: number) => (350 * Math.min(L, 65)) / 65;
/** B01-SH07: 357 at +0, 500 at +43 ("ห้าร้อย"), 700 at +95 (slam), then held. */
export const noairSH07 = (L: number) => (L <= 43 ? 357 + (143 * L) / 43 : 500 + 200 * lin(43, 95, L));
/** SH07 dial scale-up at the slam (+95): ×1 -> ×1.5 toward the frame centre over 4 f, held to the cut. */
export const slamScale = (L: number) => sm(95, 99, L);
/** B02-SH02 real dial: climbs fast, then slower, holds 32 from "เลิกเร่ง" (+148). */
export const realSH11 = (L: number) => 32 * (1 - (1 - lin(0, 148, L)) ** 3);
/** B02-SH03 split dial (G2): needle A from +5, 32 at +54; needle B +65..+98 to about 20. */
export const splitA = (L: number) => 32 * sm(5, 54, L);
export const splitB = (L: number) => 20 * sm(65, 98, L);

// ---- diagram timings (shot-local frames; word onsets measured, storyboard "Per-shot staging")
export const SH05 = {bracket: [8, 18] as const, dotted: [18, 29] as const, pin: 29, label: 33, ringTo: 60};
/** Fraction of the bracket / dotted line drawn at `L` in B01-SH05. */
export const sh05Draw = (L: number) => ({bracket: lin(...SH05.bracket, L), dotted: lin(...SH05.dotted, L), pin: L >= SH05.pin, label: L >= SH05.label, ring: lin(0, SH05.ringTo, L) * 0.1});
/** B02-SH02: the up-arrow grows with the speed (strong by +41), "น้ำหนัก" down arrow in at +101, up equals down at +119 (arrow length px). */
export const SH11 = {weightAt: 101, equalAt: 119, holdAt: 148};
export const upArrow = (L: number) => 140 * Math.min(1, 0.12 + 0.88 * sm(0, 119, L) ** 0.8);
export const downArrow = (L: number) => (L >= SH11.weightAt ? 140 * sm(SH11.weightAt, SH11.weightAt + 6, L) : 0);
/** Façade scroll speed (storeys per frame fraction, 0..1): slow at +0, fast at +67, then constant from +119. */
export const scrollSpeed = (L: number) => 0.18 + 0.82 * sm(0, 67, L);
/** 0 -> 1 -> 0 hump of `L` between frames a and b. */
export const hump = (L: number, a: number, b: number) => Math.sin(Math.PI * lin(a, b, L));

/** B02-SH02 facade scroll offset in metres: the integral of the speed (0.3 m/f = 9 m/s at full speed), so the same storeys move up. */
export const scrollOffset = (L: number) => { let s = 0.9; for (let f = 0; f < L; f++) s += 0.3 * scrollSpeed(f); return s; };
/** B02-SH03 rider world x (m) along the near lane: 9.7 m/s (35 km/h by eye), x 0 on +54 (the centre of frame), moving toward -x: looking at the road (+z) world +x is screen-left, so he crosses left -> right. */
export const riderX = (L: number) => (-9.7 * (L - 54)) / FPS;
