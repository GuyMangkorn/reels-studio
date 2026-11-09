// EDU-EP11-SHORT shared clocks (Boss W5.2, scene sheets EDU-EP11-SHEETS-R1.3): shot ranges, the ONE fall clock (FC), HUD state, light, the rewind and
// the inset moves. Every function is pure in the composition frame G (30 fps), so any frame draws the same on a random seek.

export const FPS = 30;
export const DURATION = 1788;

/** Shot map (sheets "Shot map"): id, [start, end) in G. One shot = one timeline scene. */
export const SHOTS = [
  ['S01-B01-SH01', 0, 75], ['S01-B01-SH02', 75, 132], ['S01-B01-SH03', 132, 242], ['S01-B01-SH04', 242, 327],
  ['S01-B02-SH01', 327, 466], ['S01-B02-SH02', 466, 540], ['S01-B02-SH03', 540, 608], ['S01-B02-SH04', 608, 662],
  ['S01-B03-SH01', 662, 701], ['S01-B03-SH02', 701, 756], ['S01-B03-SH03', 756, 843], ['S01-B03-SH04', 843, 893], ['S01-B03-SH05', 893, 905],
  ['S01-B04-SH01', 905, 978], ['S01-B04-SH02', 978, 1091], ['S01-B04-SH03', 1091, 1134], ['S01-B04-SH04', 1134, 1180], ['S01-B04-SH05', 1180, 1210], ['S01-B04-SH06', 1210, 1316],
  ['S01-B05-SH01', 1316, 1385], ['S01-B05-SH02', 1385, 1485], ['S01-B05-SH03', 1485, 1520], ['S01-B05-SH04', 1520, 1600], ['S01-B05-SH05', 1600, 1728], ['S01-B05-SH06', 1728, 1788],
] as const;
export type ShotId = (typeof SHOTS)[number][0];
export const shotRange = (id: ShotId): [number, number] => { const s = SHOTS.find((q) => q[0] === id)!; return [s[1], s[2]]; };
export const shotAt = (g: number): ShotId => (SHOTS.find((q) => g >= q[1] && g < q[2]) ?? SHOTS[SHOTS.length - 1])[0];

export const clamp01 = (u: number) => Math.max(0, Math.min(1, u));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const smooth = (u: number) => u * u * (3 - 2 * u);
/** Smoothstep progress of `g` between `a` and `b`. */
export const seg = (g: number, a: number, b: number) => smooth(clamp01((g - a) / (b - a)));
/** Linear progress. */
export const lin = (g: number, a: number, b: number) => clamp01((g - a) / (b - a));
/** Piecewise linear through [frame, value] keys (clamped at the ends). */
export const keys = (g: number, k: readonly (readonly [number, number])[]): number => {
  if (g <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (g <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (g - k[i - 1][0]) / (k[i][0] - k[i - 1][0]));
  return k[k.length - 1][1];
};

// ---------------------------------------------------------------- the fall clock (FC)
/** Fall runs G39 ("ร่วง") to G893 (cut to black). */
export const FALL = {start: 39, end: 893, top: 57, bottom: 2.0, hold: 0.5} as const;
/** Car floor height (m, SHAFT space) at G: 57 until G39, `57 - 55 ((G-39)/854)^2` during the fall, 2.0 (frozen) from G893. The only place the height is computed. */
export const fallY = (g: number): number => (g <= FALL.start ? FALL.top : g >= FALL.end ? FALL.bottom : FALL.top - (FALL.top - FALL.bottom) * ((g - FALL.start) / (FALL.end - FALL.start)) ** 2);
/** Counter shown for a car height: holds 20 until the car has dropped 0.5 m, then floor(y / 3) + 1 (floor n sits at 3 (n - 1)), 1..20. */
export const counterOf = (y: number): number => (y > FALL.top - FALL.hold ? 20 : Math.max(1, Math.min(20, Math.floor(y / 3) + 1)));
/** Needle fraction of the dial: sqrt of the drop over the full drop (top tick at G893). */
export const needleOf = (y: number): number => Math.sqrt(Math.max(0, FALL.top - y) / (FALL.top - FALL.bottom));
/** HUD numbers at a fall-clock frame `s` (the rewind runs this backwards): counter, needle, the readout pill ("ราว 120 กม./ชม.", from G375). */
export const hudNumbers = (s: number) => { const y = fallY(s); return {counter: counterOf(y), needle: needleOf(y), pill: s >= PILL_AT}; };
export const PILL_AT = 375;
/** Frames at which the counter flips (each a tick sound), for the sheets' table and the test. */
export const counterFlips = (): [number, number][] => { const o: [number, number][] = []; let c = 20; for (let g = FALL.start; g <= FALL.end; g++) { const n = counterOf(fallY(g)); if (n !== c) { o.push([n, g]); c = n; } } return o; };

/** Interior light 0..1 (story frame `s`): 100 % to 30, flicker 30-42 (3 dips), 85 % after; `s` runs backwards in the rewind, so frame 0 is 100 %. */
export const lightAt = (s: number): number => (s < 30 ? 1 : s < 42 ? ((s - 30) % 4 < 2 ? 0.35 : 0.85) : 0.85);

// ---------------------------------------------------------------- the interior story frames (rewind, freeze)
/** Story frame of the frozen picture: the last frame of B03-SH03 (G842); the HUD stays at fall frame 892. */
export const FREEZE = {pose: 842, hud: 892, hudAfter: 54} as const;
/** Rewind G1325-1340: `u` eased 0 -> 1; pose story frame 842 -> 0, HUD fall frame 892 -> 54, camera and grade blend; at G1340 the picture is frame 0 + `hudNumbers(54)`. */
export const REWIND = {start: 1325, end: 1340, hudIn: [1325, 1328] as const, streakPeak: 0.15, streakBase: 0.05} as const;
export const rewindU = (g: number) => seg(g, REWIND.start, REWIND.end);
/** Pose story frame `s` for the interior shot at G: B01-B03 interior = G itself; frozen shots hold 842; the rewind runs 842 -> 0; after it, 0 (B05 shots use their own local clock). */
export const poseFrameAt = (g: number): number => (g < 905 ? Math.min(g, FREEZE.pose) : g < REWIND.start ? FREEZE.pose : Math.round((FREEZE.pose * (1 - rewindU(g))) * 1000) / 1000);
/** HUD fall-clock frame at G: the live fall, frozen at 892 (B04-SH01), the rewind 892 -> 54, then 54 (the fresh run). */
export const hudFrameAt = (g: number): number => (g < 893 ? g : g < REWIND.start ? FREEZE.hud : g < REWIND.end ? lerp(FREEZE.hud, FREEZE.hudAfter, rewindU(g)) : FREEZE.hudAfter);

export type HudState = {on: boolean; opacity: number; slide: number; counter: number; needle: number; pill: boolean; tag: boolean};
/** HUD (screen layer, slot HUD x 800-1040, y 224-600) at G. `slide` 0..1 is the slide-in from the right edge (G45-54); opacity carries the fades. Off in the black, the 1854/1857 shots and B05-SH05/06. */
export const hudStateAt = (g: number): HudState => {
  const off: HudState = {on: false, opacity: 0, slide: 0, counter: 20, needle: 0, pill: false, tag: false};
  if (g < 45 || (g >= 893 && g < 905) || (g >= 978 && g < REWIND.start) || g >= 1598) return off;
  if (g < 905) { const h = hudNumbers(g), sl = seg(g, 45, 54), tw = g >= 520 && g < 526 ? Math.sin(Math.PI * lin(g, 520, 526)) / 240 : 0; return {on: true, opacity: 1, slide: sl, ...h, needle: h.needle - tw, pill: h.pill && g >= PILL_AT, tag: true}; } // G520-526: the needle twitches back 1 degree
  if (g < 978) return {on: true, opacity: 1, slide: 1, ...hudNumbers(FREEZE.hud), tag: true}; // frozen frame; the inset shrink fades it with the frame (G966-978)
  const fade = lin(g, REWIND.hudIn[0], REWIND.hudIn[1]), n = hudNumbers(hudFrameAt(g));
  const bump = g >= 1485 ? modernNeedle(g) : n.needle;
  const out = g >= 1586 ? 1 - lin(g, 1586, 1598) : 1;
  return {on: true, opacity: fade * out, slide: 1, counter: n.counter, needle: bump, pill: n.pill && g < REWIND.end, tag: true};
};
/** B05-SH03: the car drops 0.40 m (ease-in G1485-1500) and the jaws bite at G1500: the needle rises from 2 % to 8.5 % and returns by G1510. */
export const modernNeedle = (g: number): number => { const base = needleOf(fallY(FREEZE.hudAfter)); return base + 0.065 * seg(g, 1485, 1500) * (1 - seg(g, 1500, 1510)); };
/** Car drop below its rest (m) in B05-SH03: ease-in 0.40 m to G1500, slows over 0.28 m to G1506 (the jaws' slide), settles 1 cm up and back to G1510. */
export const jawsDrop = (g: number): number => (g < 1485 ? 0 : g < 1500 ? 0.4 * ((g - 1485) / 15) ** 2 : g < 1506 ? 0.4 + 0.28 * (1 - (1 - (g - 1500) / 6) ** 2) : 0.68 - 0.01 * seg(g, 1506, 1510));

// ---------------------------------------------------------------- the inset (DOM raster in slot INSET)
export const INSET = {x: 760, y: 640, w: 280, h: 498, border: 6} as const;
/** The inset still is the B04-SH01 canvas at G977 (SD14); `frozenU` is the shot fraction of that frame (73 f shot from 905). */
export const INSET_STILL = {g: 977, file: 'edu11/inset-g977.png', frozenU: (977 - 905) / 73} as const;
export type InsetBox = {x: number; y: number; w: number; h: number; b: number};
const FULL: InsetBox = {x: 0, y: 0, w: 1080, h: 1920, b: 0}, SLOT: InsetBox = {...INSET, b: INSET.border};
const mixBox = (k: number): InsetBox => ({x: lerp(FULL.x, SLOT.x, k), y: lerp(FULL.y, SLOT.y, k), w: lerp(FULL.w, SLOT.w, k), h: lerp(FULL.h, SLOT.h, k), b: SLOT.b * k});
/** Inset phase at G: the live frozen frame shrinks G966-978, the raster rests in the slot (pulse 1 -> 1.08 -> 1 G1192-1207), grows G1316-1325. `k` 0 = full frame, 1 = slot. */
export const insetAt = (g: number): {kind: 'none' | 'live-shrink' | 'raster' | 'grow'; box: InsetBox; k: number; pulse: number} => {
  if (g < 966) return {kind: 'none', box: FULL, k: 0, pulse: 1};
  if (g < 978) { const k = seg(g, 966, 978); return {kind: 'live-shrink', box: mixBox(k), k, pulse: 1}; }
  if (g < 1316) { const p = 1 + 0.08 * Math.sin(Math.PI * lin(g, 1192, 1207)); return {kind: 'raster', box: SLOT, k: 1, pulse: p}; }
  if (g < 1325) { const k = 1 - seg(g, 1316, 1325); return {kind: 'grow', box: mixBox(k), k, pulse: 1}; }
  return {kind: 'none', box: FULL, k: 0, pulse: 1};
};

// ---------------------------------------------------------------- diagram layers (N8) and streak strength
/** Shaft speed streaks (screen layer, alpha 0..1) per sheet: 20-25 % B01-SH02, 25 -> 45 % B02-SH01, 45 % B02-SH02, 55 -> 65 % B03-SH04, none elsewhere. */
export const streakAlphaAt = (g: number): number => {
  if (g >= 75 && g < 132) return lerp(0.2, 0.25, lin(g, 75, 132));
  if (g >= 327 && g < 466) return lerp(0.25, 0.45, lin(g, 327, 466));
  if (g >= 466 && g < 540) return 0.45;
  if (g >= 843 && g < 893) return lerp(0.55, 0.65, lin(g, 843, 893));
  return 0;
};
/** Rewind streaks (full-frame, G1325-1340): 5 % base, 15 % at the peak; 0 outside. */
export const rewindStreakAt = (g: number): number => (g >= REWIND.start && g < REWIND.end ? REWIND.streakBase + REWIND.streakPeak * Math.sin(Math.PI * lin(g, REWIND.start, REWIND.end)) : 0);
/** Speed arrows of B02-SH01/SH02 (VD09): the shell's arrow grows from G402, hers from G430 (both 70 x 260 px), both pulse G448-458; hers shortens 8 % at G519. Values: lengths in px (0 = absent), pulse scale. */
export const arrowsAt = (g: number): {car: number; her: number; pulse: number} => {
  const grow = (a: number) => 260 * seg(g, a, a + 8);
  const pulse = 1 + 0.08 * Math.sin(Math.PI * lin(g, 448, 458));
  return {car: g >= 402 && g < 540 ? grow(402) : 0, her: g >= 430 && g < 540 ? grow(430) * (g >= 519 ? 0.92 : 1) : 0, pulse};
};
/** Ghost of B02-SH02: springs 0.4 m up from the crouch (G476-486) and holds; chip "-10 กม./ชม." from G519. */
export const ghostAt = (g: number): {lift: number; chip: boolean} => ({lift: g < 476 ? 0 : 0.4 * seg(g, 476, 486), chip: g >= 519 && g < 540});
/** Fall bracket of B02-SH03 (the tower wide): top floor 20 (y 57 m) sliding to floor 17 (y 48 m) over G593-599; pill text follows. */
export const bracketAt = (g: number): {top: number; floor: 20 | 17} => ({top: lerp(57, 48, seg(g, 593, 599)), floor: g >= 596 ? 17 : 20});
