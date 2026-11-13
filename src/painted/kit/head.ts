import {hairFront, hairSide, isNewCut, type NewCut} from './hair';
import {hash} from './hash';
import {lerp, mixColor, type Painter, type Pt} from './painter';
import {INK, palOf, ell, glaze, hardFill, inkLine, lineOf, modelPart, planeBand, rimScaleOf, solid, toneOf, type InteriorLight} from './draw';
import {densify, polarUnion, quarterLate, simplify, smooth01, splitByCurve} from './quarter';

// Flat-face decal heads (front and profile) for the WFOG cast (brief VD03; user-approved look 29 Oct 2026), ported
// from the spike sheets `FaceSheet.tsx` / `SideSheet.tsx` into the plate Painter: egg head, cap of hair, almond eyes
// with a look vector, bar brows, line/filled mouth, periodic blink, and age lines (older occupant, front and profile).

export type Brow = 'flat' | 'up' | 'worry' | 'angry' | 'quirk';
/** `none` draws no eye at all (the shot paints its own eyes over a plain face, e.g. a blind-white infected). */
export type Eyes = 'dot' | 'wide' | 'half' | 'shut' | 'none';
/**
 * `grin`, `smirk` and `shout` were added for the expression presets (`expressions.ts`, 1 Nov 2026); the first seven are the WFOG/ZC set.
 * `gape` (an open oval whose height follows `open`: panting, a gasp) and `clench` (gritted teeth) are the activity mouths (`activity-mouths.ts`, 13 Nov 2026).
 */
export type Mouth = 'flat' | 'smile' | 'o' | 'wavy' | 'frown' | 'gasp' | 'talk' | 'grin' | 'smirk' | 'shout' | 'gape' | 'clench';
/**
 * `open` 0..1 opens a `talk` mouth (pose tracks drive it; TTS amplitude can replace it later) or sizes a `shout` mouth;
 * `squint` closes the lids.
 * `browTo` with `browMix` 0..1 moves the brow line continuously from `brow` toward `browTo` (SS-R4 RT-2 occupant relax).
 * `tears` 0..1 paints tear streams under the eyes (0 or absent = none); `sweat` adds a sweat drop beside the forehead.
 * `bags` 0..1 paints dark under-eye bags (the `tired` expression, 2 Nov 2026).
 */
export type FaceState = {brow: Brow; eyes: Eyes; look: Pt; mouth: Mouth; open?: number; squint?: number; browTo?: Brow; browMix?: number; tears?: number; sweat?: boolean; bags?: number; /** Near cheek bulge 0..1 (eating, chewing): profile and turned heads only, a soft push of the cheek and a short crease. */ chew?: number; /** Jaw drop scale 0..1 of profile and turned heads (default 1). 0 keeps the chin line still through a turn: the turned `talk` mouth then opens inside the face as in the front view. */ jaw?: number};
/** The cuts of the WFOG/ZC cast (`short|tied|bob|hood|long`) and the people-library cuts (`hair.ts`, `NewCut`). */
export type Cut = 'short' | 'tied' | 'bob' | 'hood' | 'long' | NewCut;
/**
 * `long`: loose shoulder-length hair (the narrator, brief VD03 R2). `lines`: age lines (older occupant, user Q3).
 * People library only (`people.ts`, all optional, absent = the cast look): `accent` colours hair ties on `ponytail` and `pigtails`;
 * `facial` adds stubble, a moustache or a full beard in the hair colour; `glasses` adds dark round frames; `brows` overrides the
 * brow colour (the hair colour by default; grey hair needs a darker brow). `look` (front view only, sheets
 * `KIT-FACE-LOOKS`, `KIT-FACE-CAST`) swaps the eye, nose, brow and closed-mouth drawing; absent = the legacy round eyes, no nose, bar brows (episode casts
 * only; every PEOPLE entry has a look).
 */
export type HeadStyle = {skin: string; hair: string; cut: Cut; hood?: string; /** Profile hood only: a wide opening that leaves the whole face visible (set by the hood-up state, `back.ts` `hoodUpHead`); absent = the WFOG hood. */ hoodOpen?: boolean; lines?: boolean; accent?: string; facial?: 'stubble' | 'mustache' | 'beard'; glasses?: boolean; brows?: string; look?: FaceLook;
  /** Profile views only (`paintHeadSide`): hair strands with a lit edge, an iris eye with lid line, crease, lash and catch-light, a nose wing and nostril (no drawn lips in profile). Follows `look` (iris colour, `lash: false`). Default absent = the plain WFOG profile; front, back and turned views ignore it. */
  sideDetail?: boolean;
  /** `long` hair, front view only (EDU-EP11 N5 `hair-float`, spike SP1): 0..1 lifts the shoulder-length hair off the shoulders and fans it up round the head (free fall); 0 or absent = as before. */
  hairRise?: number;
  /** With `hairRise`: a calm fan (3 broad soft waves instead of 6 spikes, wider and lower), the weightless read (EDU-EP11 LF01b fix round 1). Absent = the spiky fan. */
  hairCalm?: boolean};

/**
 * Front-view face drawing (user-approved for PEOPLE, 2 Nov 2026). `eye`: `almond` pointed corners with a lash line, `lidded` almond with a lid
 * crease, `hooded` a heavy upper lid with an outer wing (`wing: false` drops the wing); each has a coloured iris clipped to the eye and a catch-light.
 * `lash: false` draws the upper lid as a thin plain line with no wing, so the eye reads without lashes (every male PEOPLE entry, 2 Nov 2026).
 * `nose`: `hook` a small side curve, `ell` a bridge shadow ending in the nose base, `nostrils` two marks with a soft shadow.
 * `round` is a large child eye. `nose`: `hook` a small side curve, `ell` a bridge shadow ending in the nose base, `nostrils`
 * two marks with a soft shadow, `broad` wide nostrils with the wings drawn, `button` a small child nose.
 * `brow`: `arch`, `tapered` (thick head, thin tail) or `thick`; `browDrop` lowers every brow toward the eye (head units).
 * `mouth` redraws the closed mouths (`flat`, closed `talk`, `frown`): `line` a soft line with lifted corners, `lip` a lip line
 * with a lower-lip shadow, `full` tinted upper and lower lips, `thin` a short line with corner ticks; absent = the bare line.
 */
export type FaceLook = {eye: 'almond' | 'lidded' | 'hooded' | 'round'; wing?: boolean; lash?: false; nose: 'hook' | 'ell' | 'nostrils' | 'broad' | 'button'; brow: 'arch' | 'tapered' | 'thick'; browDrop: number; mouth?: 'line' | 'lip' | 'full' | 'thin'; iris?: string};

/** Head height (forehead top to chin) in head units K; chin below the centre. */
export const HEAD_SPAN = 2.27;
export const CHIN = 1.22;
/**
 * Jaw opening 0..1 of a face (profile and turned heads, 7 Nov 2026): how far the lower jaw drops. `talk` and `shout` follow `open`; `o`, `gasp`
 * and an open `smile` are a fixed fraction of it; `grin` is a wide laugh. Closed mouths (flat, frown, smirk, wavy, small talk) are 0.
 * `jawOpenOf` scales it by `face.jaw` when set.
 */
const jawOf = (face: FaceState): number => {
  const o = face.open, m = face.mouth;
  if (m === 'talk') return Math.max(0, Math.min(1, o ?? 0));
  if (m === 'shout') return Math.min(1, o ?? 1);
  if (m === 'o') return 0.4 * Math.min(1, o ?? 1);
  if (m === 'gasp') return 0.6 * Math.min(1, o ?? 1);
  if (m === 'gape') return 0.15 + 0.55 * Math.max(0, Math.min(1, o ?? 1));
  if (m === 'grin') return 0.5;
  if (m === 'smile') return o === undefined || o >= 0.3 ? 0.2 : 0;
  return 0;
};
export const jawOpenOf = (face: FaceState): number => (face.jaw === undefined ? jawOf(face) : Math.max(0, Math.min(1, face.jaw)) * jawOf(face));
/** Chin drop in head units at full jaw opening. */
const JAW_DROP = 0.24;
/** Profile jaw: the point `[x, y]` of the head egg after the lower jaw drops by `jaw` (0..1): below the lip line it drops and swings back a little. */
const jawSide = (jaw: number, [x, y]: Pt): Pt => {
  if (jaw <= 0) return [x, y];
  const w = smooth01(0.55, 0.75, y);
  return [x - 0.05 * jaw * w, y + JAW_DROP * jaw * w];
};
export const BROW_Y: Record<Brow, [number, number]> = {flat: [-0.24, -0.24], up: [-0.33, -0.31], worry: [-0.34, -0.2], angry: [-0.16, -0.32], quirk: [-0.24, -0.24]};
/** Brow line heights of a face: the `brow` table entry, blended toward `browTo` by `browMix` when both are set. */
const browY = (face: FaceState): [number, number] => {
  const a = BROW_Y[face.brow];
  if (!face.browTo || !face.browMix) return a;
  const b = BROW_Y[face.browTo], u = face.browMix;
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
};
const WHITE = '#fbf7ee', MOUTH = '#3b2a24', AGE = '#8a5a43';
const TEAR = '#a9d6f0', TEAR_INK = '#5f9bc4', BAGS = '#6a4a5c';
/** A teardrop (point up) centred at (x, y), `s` head units tall 0.28. */
const sweatDrop = (x: number, y: number, s: number): Pt[] => [[x, y - 0.16 * s], [x + 0.06 * s, y - 0.02 * s], [x + 0.08 * s, y + 0.05 * s], [x + 0.04 * s, y + 0.11 * s], [x - 0.04 * s, y + 0.11 * s], [x - 0.08 * s, y + 0.05 * s], [x - 0.06 * s, y - 0.02 * s]];

export const headOutline = (n = 40): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * 6.283, s = Math.sin(a);
    return [Math.cos(a) * (1 - 0.07 * Math.max(0, s)), s < 0 ? 1.05 * s : 1.22 * s];
  });

/**
 * Head turned about the vertical axis by `theta` radians (+ = the face turns toward screen right; 0 = the front decal). Used by
 * `paintHeadFront` for the three-quarter views (`FigPose.quarter`): the front decal is read as the front half of a sphere (half width
 * `rho(v)` at height v), each point is rotated about the vertical axis and projected, so features shift toward the turn and
 * foreshorten away from it, the far eye narrows, the far ear disappears. Points outside the head (hair volume) keep their excess.
 */
const headRho = (v: number): number => {
  const s = v < 0 ? v / 1.05 : v / 1.22;
  return Math.abs(s) >= 1 ? 0.3 : Math.max(0.3, Math.sqrt(1 - s * s) * (1 - 0.07 * Math.max(0, s)));
};
export const turnU = (theta: number, u: number, v: number): number => {
  const r = headRho(v), a = u / r, al = Math.asin(Math.max(-1, Math.min(1, a))) + theta;
  const up = r * Math.sin(Math.max(-Math.PI / 2, Math.min(Math.PI / 2, al)));
  return Math.abs(a) > 1 ? up + Math.sign(a) * (Math.abs(u) - r) : up;
};
/**
 * Head seen from above or below (KIT-VIEW-AUDIT VA03, 13 Nov 2026): `e` radians of camera elevation (+ = seen from above). A point on
 * the face is moved along the vertical as if the head were a sphere tipped toward the lens: features near the centre slide down from
 * above (more crown, fringe lower) and up from below (more under the chin); the outline and anything outside it (hair volume) stay, so
 * the silhouette is unchanged. `e` 0 returns `v`.
 */
export const pitchV = (e: number, u: number, v: number): number => {
  if (!e) return v;
  // Depth on the egg at (u, v): zero on the outline (half width r at height v, the same egg as `headOutline`), 1 at the centre.
  const s = v < 0 ? v / 1.05 : v / 1.22, r = Math.sqrt(Math.max(0, 1 - s * s)) * (1 - 0.07 * Math.max(0, s));
  const z = Math.sqrt(Math.max(0, r * r - u * u));
  return v + z * (v * (Math.cos(e) - 1) + 1.12 * Math.sin(e));
};
/** False when the point is on the hidden side of the turned head. */
export const turnVisible = (theta: number, u: number, v: number): boolean => {
  const r = headRho(v), a = u / r;
  if (Math.abs(a) > 1) return true;
  return Math.cos(Math.asin(a) + theta) > 0.03;
};

/** Face outline point at angle `a` (same egg as `headOutline`) and the outline angle at height `v` on side `side`. */
const faceAt = (a: number): Pt => {
  const s = Math.sin(a);
  return [Math.cos(a) * (1 - 0.07 * Math.max(0, s)), s < 0 ? 1.05 * s : 1.22 * s];
};
const faceAngle = (v: number, side: number) => {
  const a = Math.asin(Math.max(-1, Math.min(1, v < 0 ? v / 1.05 : v / 1.22)));
  return side > 0 ? a : Math.PI - a;
};
/** The hairline of a front hair cap: its longest run of points inside the face, screen right to left; null when the shape is not a cap. */
const hairlineOf = (hair: Pt[]): Pt[] | null => {
  const ins = hair.map(([u, v]) => v > -1.0 && Math.abs(u) < headRho(v) - 0.005), n = hair.length, start = ins.findIndex((x) => !x);
  if (start < 0) return null;
  let best: Pt[] = [], cur: Pt[] = [];
  for (let k = 1; k <= n; k++) {
    const i = (start + k) % n;
    if (ins[i]) cur.push(hair[i]);
    else {
      if (cur.length > best.length) best = cur;
      cur = [];
    }
  }
  if (cur.length > best.length) best = cur;
  if (best.length < 2) return null;
  if (best[0][0] < best[best.length - 1][0]) best = best.slice().reverse();
  return best[0][0] > 0.4 && best[best.length - 1][0] < -0.4 ? best : null;
};
/** The skin of the front decal under a hairline (right to left): the hairline, then the face outline from the left end round the chin. */
const faceWindow = (hl: Pt[]): Pt[] => {
  // The outline part is sampled on the egg itself (no chords): `turnU` is steep at the face edge, so a chord point just inside it would
  // jump inward and zigzag the turned jaw line.
  const aL = faceAngle(hl[hl.length - 1][1], -1), aR = faceAngle(hl[0][1], 1), m = 64;
  return [...densify(hl, 0.03, false), ...Array.from({length: m + 1}, (_, i) => faceAt(aL + ((aR - aL) * i) / m))];
};

/** Periodic blink: shut for 4 frames once every 2.5-4 s, phase from the character seed. */
export const blinking = (t: number, seed: number) => {
  const per = 2.5 + 1.5 * hash(seed + 3);
  const ph = (t + hash(seed + 5) * per) % per;
  return ph < 0.13;
};

const skinOf = (style: HeadStyle, warm: number) => (warm > 0 ? mixColor(style.skin, '#f6c27a', 0.35 * warm) : style.skin);

/**
 * VD18 face planes on a skin fill (plate px points): mottled glaze, cool side plane away from the key, under-jaw core,
 * cheek warmth. `cheeks` are plate-px ellipse centres with radii.
 */
const faceModel = (p: Painter, seed: number, skin: string, head: Pt[], L: InteriorLight, cheeks: [number, number, number, number][]) => {
  const s = 7_500_000 + seed * 40;
  glaze(p, s, mixColor(skin, '#000000', 0.05), 55, head, {texture: 0.45, border: 0.5, bleed: 0.02});
  // Form shadow as a crescent on the far side: shade the far half, then repaint a lit oval shifted toward the key, so
  // the shadow keeps the head's round edge instead of a straight cut across the face.
  const side = planeBand(head, L.key, 0.4);
  if (side.length) glaze(p, s + 1, mixColor(skin, palOf(L).shadow, 0.46), 205, side, {texture: 0.35, border: 0.45, bleed: 0.08});
  const xs = head.map((q) => q[0]), ys = head.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const rx = (Math.max(...xs) - Math.min(...xs)) / 2, ry = (Math.max(...ys) - Math.min(...ys)) / 2;
  const k = Math.hypot(L.key[0], L.key[1]) || 1, kx = L.key[0] / k, ky = L.key[1] / k;
  const lit = head.map(([x, y]): Pt => [cx + (x - cx) * 0.84 - kx * 0.18 * rx, cy + (y - cy) * 0.84 - ky * 0.12 * ry]);
  solid(p, s + 7, skin, lit, 3, 0, 0.05); // texture 0: granulation would show what the head base holds (glaze rule)
  glaze(p, s + 8, skin, 160, head.map(([x, y]): Pt => [cx + (x - cx) * 0.93 - kx * 0.08 * rx, cy + (y - cy) * 0.93 - ky * 0.05 * ry]), {texture: 0.2, border: 0, bleed: 0.12});
  const jaw = planeBand(head, [0, 1], 0.86);
  if (jaw.length) glaze(p, s + 2, mixColor(skin, palOf(L).shadow, 0.3), 100, jaw, {texture: 0.3, border: 0.3, bleed: 0.06});
  cheeks.forEach(([x, y, rx, ry], i) => glaze(p, s + 3 + i, '#cf7a68', 42, ell(x, y, rx, ry, 16), {texture: 0.3, border: 0.1, bleed: 0.12}));
  const rim = planeBand(head, L.rim, 0, 0.07);
  if (rim.length) solid(p, s + 6, mixColor(skin, palOf(L).rimColor, 0.3 * rimScaleOf(L)), rim, 3, 0, 0.15);
};
/** VD18 hair sheen: a few strokes along the crown on the key side, a cool highlight from the tube lights. */
const sheen = (p: Painter, id: number, hair: string, strokes: Pt[][]) =>
  strokes.forEach((pts, i) => inkLine(p, id + i, pts, {closed: false, weight: 2.0, curve: 0.5, color: mixColor(hair, '#b9c3c5', hair === '#8f8a84' ? 0.5 : 0.45)}));

const GLASSES = '#2c2622';
/** Brow colour: `style.brows`, else the hair colour (grey hair `#8f8a84` gets a darker brow). */
const browColor = (style: HeadStyle) => style.brows ?? (style.hair === '#8f8a84' ? '#6f6a64' : style.hair);

type FacialCtx = {
  p: Painter; seed: number; Q: (pts: Pt[]) => Pt[]; color: string; skin: string; L?: InteriorLight;
  fill: (color: string, pts: Pt[], passes?: number) => void;
  ink: (pts: Pt[], weight?: number, curve?: number, closed?: boolean, color?: string) => void;
};
/** Lower egg outline between angles a0..a1 (rad, 0 = right of the face, pi/2 = chin), head units. */
const lowerEgg = (a0: number, a1: number, n: number): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = a0 + ((a1 - a0) * i) / n, s = Math.sin(a);
    return [Math.cos(a) * (1 - 0.07 * Math.max(0, s)), 1.22 * s];
  });
/** Facial hair on the front decal: stubble (a soft glaze), a moustache bar, or a full beard around a skin patch for the mouth. */
const paintFacialFront = (kind: 'stubble' | 'mustache' | 'beard', c: FacialCtx) => {
  const {p, seed, Q, color, skin, L, fill, ink} = c;
  if (kind === 'mustache') {
    const m: Pt[] = [[-0.34, 0.5], [-0.18, 0.44], [0, 0.46], [0.18, 0.44], [0.34, 0.5], [0.3, 0.57], [0.12, 0.52], [0, 0.54], [-0.12, 0.52], [-0.3, 0.57]];
    fill(color, m, 6);
    ink(m, 0.9, 0.3, true, lineOf(color, L));
    return;
  }
  const outer = lowerEgg(0.2, Math.PI - 0.2, 16);
  if (kind === 'stubble') {
    glaze(p, 7_700_000 + seed, color, 95, Q([...outer, [-0.78, 0.2], [-0.55, 0.34], [-0.25, 0.42], [0, 0.44], [0.25, 0.42], [0.55, 0.34], [0.78, 0.2]]), {texture: 0.6, border: 0.2, bleed: 0.1});
    return;
  }
  const beard: Pt[] = [...outer, [-0.78, 0.2], [-0.62, 0.4], [-0.34, 0.45], [0, 0.4], [0.34, 0.45], [0.62, 0.4], [0.78, 0.2]];
  fill(color, beard, 6);
  ink(beard, 1.0, 0.3, true, lineOf(color, L));
  fill(skin, ell(0, 0.65, 0.33, 0.15, 18), 4); // the mouth stays on skin
};
/** The same on the profile decal (face toward +x). */
const paintFacialSide = (kind: 'stubble' | 'mustache' | 'beard', c: FacialCtx) => {
  const {p, seed, Q, color, skin, L, fill, ink} = c;
  if (kind === 'mustache') {
    const m: Pt[] = [[0.76, 0.47], [0.98, 0.45], [1.03, 0.53], [0.84, 0.58], [0.74, 0.55]];
    fill(color, m, 6);
    ink(m, 0.9, 0.2, true, lineOf(color, L));
    return;
  }
  const jaw = lowerEgg(0.3, 2.0, 14); // front cheek, chin, up to under the ear
  if (kind === 'stubble') {
    glaze(p, 7_700_000 + seed, color, 95, Q([...jaw, [-0.3, 0.8], [-0.15, 0.4], [0.25, 0.38], [0.6, 0.42], [0.9, 0.42]]), {texture: 0.6, border: 0.2, bleed: 0.1});
    return;
  }
  const beard: Pt[] = [...jaw, [-0.3, 0.8], [-0.15, 0.42], [0.25, 0.46], [0.58, 0.5], [0.92, 0.5]];
  fill(color, beard, 6);
  ink(beard, 1.0, 0.2, true, lineOf(color, L));
  fill(skin, ell(0.84, 0.64, 0.15, 0.1, 14), 4);
};

/** Front hair polygon of the WFOG/ZC cuts (`short|tied|bob|hood|long`): skull arc, temples, then the cut's edge right to left. */
const legacyFrontHair = (cut: Cut): Pt[] => {
  const hair: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    hair.push([1.07 * Math.cos(a), 1.12 * Math.sin(a) - 0.04]);
  }
  hair.push([0.92, 0.04], [0.86, -0.36]);
  if (cut === 'tied') for (let i = 0; i <= 12; i++) hair.push([0.86 - (1.72 * i) / 12, -0.62 + 0.22 * (i / 12) ** 2]);
  else if (cut === 'bob') hair.push([0.84, -0.42], [-0.84, -0.42]);
  else if (cut === 'long') {
    // Side parting with a soft sweep to the right of her face; strands stay above the eyes so the gaze reads.
    for (let i = 0; i <= 12; i++) hair.push([0.86 - (1.72 * i) / 12, -0.42 - 0.2 * Math.sin((i / 12) * Math.PI * 0.9) + 0.06 * (i / 12)]);
  } else if (cut !== 'hood') {
    for (let i = 0; i <= 24; i++) hair.push([0.86 - (1.72 * i) / 24, -0.5 + 0.09 * Math.abs(Math.sin((i / 24) * 4 * Math.PI))]);
  } else hair.push([0.6, -0.55], [0, -0.68], [-0.6, -0.55]); // fringe under the hood
  hair.push([-0.86, -0.36], [-0.92, 0.04]);
  return hair;
};

/** Back hair of the `long` cut as one polygon (skull arc then the lower edge). `rise` 0..1 (`HeadStyle.hairRise`, free fall): the arc grows into a fan of tapered strands
 * standing up and out from the head (radius profile `fanR`, tips swaying slowly with `t`) and the shoulder-length tail lifts to the neck; 0 = the hanging hair as always. */
const LONG_REST: Pt[] = [[1.2, 0.6], [1.26, 1.3], [1.12, 1.72], [0.72, 1.62], [-0.72, 1.62], [-1.12, 1.72], [-1.26, 1.3], [-1.2, 0.6]];
const LONG_LIFTED: Pt[] = [[1.55, 0.35], [1.2, 0.95], [0.9, 1.05], [0.5, 1.02], [-0.5, 1.02], [-0.9, 1.05], [-1.2, 0.95], [-1.55, 0.35]];
const longBack = (rise: number, t: number, calm = false): Pt[] => {
  const e = Math.min(1, Math.max(0, rise));
  if (e <= 0) return [...Array.from({length: 17}, (_, i): Pt => [1.16 * Math.cos(Math.PI + (i / 16) * Math.PI), 1.18 * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]), ...LONG_REST];
  const N = 56, K = calm ? 3 : 6;
  const cap = Array.from({length: N + 1}, (_, i): Pt => {
    const phi = (i / N) * Math.PI, th = Math.PI + phi;
    const ph = phi * K / Math.PI + 0.35 * Math.sin(t * 1.4);
    const tri0 = Math.sqrt(Math.sin(Math.PI * (((ph % 1) + 1) % 1))); // 0 at the valleys, 1 at the tips: rounded strand ends, narrow valleys
    const tri = calm ? 0.6 + 0.4 * tri0 : tri0;
    const side = Math.cos(2 * phi) ** 2; // longer toward the horizontal: hair streams out sideways
    const amp = (0.9 + 0.3 * Math.sin(phi * 1.7 + 0.8) + 0.25 * side) * (0.55 + 0.45 * Math.sin(t * 1.1 + i * 0.7) ** 2);
    const r = calm ? 1.17 + e * (0.5 + 0.55 * amp * tri) : 1.17 + e * (0.35 + amp * tri);
    return [r * Math.cos(th), r * 1.03 * Math.sin(th) - 0.02];
  });
  const tail = LONG_REST.map(([x, y], i): Pt => [x + (LONG_LIFTED[i][0] - x) * e, y + (LONG_LIFTED[i][1] - y) * e]);
  return [...cap, ...tail];
};

/**
 * Front decal head centred on (cx, cy), K px per head unit. `seed` keeps its fills apart from other heads; `t` is the
 * plate clock (blink); `warm` 0..1 tints the skin with the torch light.
 */
type Fill = (color: string, pts: Pt[], passes?: number, texture?: number) => void;
type Ink = (pts: Pt[], weight?: number, curve?: number, closed?: boolean, color?: string) => void;
const IRIS = '#4a3226', LID = '#2b1f1a';

/** Upper and lower lid curves of a `look` eye across u 0..1 (inner to outer corner), in head units. */
const lidAt = (lk: FaceLook, side: number, ex: number, ey: number, eyes: Eyes, sq: number) => {
  const hu = (lk.eye === 'round' ? 0.16 : lk.eye === 'hooded' ? 0.12 : lk.eye === 'lidded' ? 0.135 : 0.145) * (eyes === 'wide' ? 1.3 : eyes === 'half' ? 0.55 : 1) * sq;
  const hl = lk.eye === 'round' ? 0.12 : lk.eye === 'hooded' ? 0.075 : 0.08;
  const tilt = lk.eye === 'round' ? 0 : 0.025; // outer corner sits a little higher
  const x = (u: number) => ex + side * (-0.21 + 0.42 * u);
  const yc = (u: number) => ey - tilt * u + 0.01;
  // Upper lid peaks inner of centre (u 0.42), lower lid lowest outer of centre (u 0.58): the asymmetry reads as almond.
  const up = (u: number): Pt => [x(u), yc(u) - hu * Math.sin(Math.PI * u ** 0.85)];
  const lo = (u: number): Pt => [x(u), yc(u) + hl * Math.sin(Math.PI * u ** 1.2)];
  return {up, lo, hu};
};

const lookEye = (lk: FaceLook, side: number, ex: number, ey: number, eyes: Eyes, sq: number, look: Pt, fill: Fill, ink: Ink, skin: string) => {
  const {up, lo, hu} = lidAt(lk, side, ex, ey, eyes, sq);
  const n = 16, us = Array.from({length: n + 1}, (_, i) => i / n);
  const upper = us.map(up), lower = us.map(lo);
  const white: Pt[] = [...upper, ...[...lower].reverse()];
  fill(WHITE, white, 3);
  // Iris: a circle clamped between the lids (each point's y held inside the eye at its x), so lids crop it.
  const r = lk.eye === 'round' ? 0.1 : 0.085, icx = ex + look[0] * 0.08, icy = ey + look[1] * 0.04 - 0.005;
  const yAt = (curve: Pt[], px: number) => {
    let best = curve[0];
    for (const c of curve) if (Math.abs(c[0] - px) < Math.abs(best[0] - px)) best = c;
    return best[1];
  };
  const iris = Array.from({length: 20}, (_, i): Pt => {
    const a = (i / 20) * Math.PI * 2, px = icx + r * Math.cos(a), py = icy + r * 1.05 * Math.sin(a);
    return [px, Math.min(Math.max(py, yAt(upper, px)), yAt(lower, px))];
  });
  fill(lk.iris ?? IRIS, iris, 5);
  fill(INK, iris.map(([px, py]): Pt => [icx + (px - icx) * 0.45, icy + (py - icy) * 0.45]), 4);
  if (hu > 0.05) fill(WHITE, ell(icx - 0.025, icy - 0.03, 0.018, 0.018, 8), 3);
  // Lash line: heavier upper lid, light partial lower lid. `lash: false` keeps a plain thin upper lid (men).
  ink(upper, lk.lash === false ? 1.0 : lk.eye === 'hooded' ? 2.4 : 1.8, 0.4, false, LID);
  ink(lower.slice(5), 0.7, 0.4, false);
  if (lk.eye === 'hooded' && lk.wing !== false && lk.lash !== false) {
    const o = up(1);
    ink([up(0.8), o, [o[0] + side * 0.07, o[1] - 0.05]], 2.4, 0.3, false, LID); // outer wing
  }
  if (lk.eye === 'lidded' || lk.eye === 'hooded') {
    const lift = lk.eye === 'hooded' ? 0.035 : 0.055;
    ink(us.slice(3, 15).map((u): Pt => { const [px, py] = up(u); return [px, py - lift]; }), 0.8, 0.5, false, mixColor(skin, LID, 0.5)); // lid crease
  }
};

/** Brow polygon of a `look` brow from inner x 0.17 to outer x 0.62, inner and outer heights given. */
const lookBrow = (lk: FaceLook, side: number, inner: number, outer: number): Pt[] => {
  const n = 10, top: Pt[] = [], bot: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = side * (0.17 + 0.45 * u);
    const arc = lk.brow === 'arch' ? 0.06 * Math.sin(Math.PI * Math.min(1, u / 0.7) * 0.5) * (u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3 * 0.9) : lk.brow === 'tapered' ? 0.02 * Math.sin(Math.PI * u) : 0;
    const y = inner + (outer - inner) * u - arc + (lk.brow === 'tapered' && u > 0.75 ? (u - 0.75) * 0.12 : 0);
    const w = lk.brow === 'thick' ? 0.065 - 0.015 * u : lk.brow === 'tapered' ? 0.062 * (1 - u) + 0.01 : 0.055 * (1 - u * 0.7);
    top.push([x, y - w * 0.55]);
    bot.push([x, y + w * 0.45]);
  }
  return [...top, ...bot.reverse()];
};

/** Front nose marks; shadow side is screen-right. */
const lookNose = (lk: FaceLook, fill: Fill, ink: Ink, skin: string, line: string) => {
  const shade = mixColor(skin, '#7a4a38', 0.28);
  if (lk.nose === 'hook') {
    fill(shade, [[0.02, 0.22], [0.08, 0.34], [0.05, 0.4], [-0.02, 0.4], [0.04, 0.34]], 3, 0.1);
    ink([[0.04, 0.24], [0.08, 0.34], [0.05, 0.39], [-0.03, 0.4]], 1.1, 0.6, false, line);
  }
  if (lk.nose === 'ell') {
    fill(shade, [[0.03, 0.06], [0.08, 0.08], [0.09, 0.36], [0.03, 0.34]], 3, 0.1);
    ink([[0.05, 0.1], [0.07, 0.3], [0.06, 0.37]], 0.9, 0.5, false, line);
    ink([[0.08, 0.37], [-0.02, 0.4], [-0.07, 0.38]], 1.1, 0.5, false, line);
  }
  if (lk.nose === 'nostrils') {
    fill(shade, ell(0.0, 0.42, 0.11, 0.035, 12), 3, 0.1);
    ink([[-0.09, 0.36], [-0.06, 0.39], [-0.03, 0.385]], 1.0, 0.5, false, line);
    ink([[0.03, 0.385], [0.06, 0.39], [0.09, 0.36]], 1.0, 0.5, false, line);
  }
  if (lk.nose === 'broad') {
    fill(shade, ell(0.0, 0.43, 0.16, 0.04, 12), 3, 0.1);
    for (const side of [-1, 1]) {
      ink([[side * 0.07, 0.3], [side * 0.15, 0.36], [side * 0.14, 0.41], [side * 0.09, 0.42]], 1.0, 0.6, false, line); // wing
      ink([[side * 0.08, 0.4], [side * 0.04, 0.415]], 1.0, 0.4, false, line); // nostril
    }
  }
  if (lk.nose === 'button') {
    fill(shade, ell(0.01, 0.37, 0.06, 0.03, 10), 3, 0.1);
    ink([[-0.04, 0.37], [0.0, 0.385], [0.04, 0.37]], 0.9, 0.5, false, line);
  }
};

/** Closed `look` mouths centred on y `my`; returns false when the mouth keeps its legacy drawing. */
const lookMouth = (lk: FaceLook, m: Mouth, open: number, my: number, fill: Fill, ink: Ink, skin: string, line: string) => {
  const closed = m === 'flat' || m === 'frown' || (m === 'talk' && open < 0.08);
  if (!lk.mouth || !closed) return false;
  const lip = mixColor(skin, '#a4504a', 0.32), shade = mixColor(skin, '#7a4a38', 0.25);
  const sag = m === 'frown' ? 0.05 : 0; // frown pulls the corners down
  if (lk.mouth === 'line') ink([[-0.2, my - 0.02 + sag], [-0.1, my + 0.01], [0.1, my + 0.01], [0.2, my - 0.02 + sag]], 1.3, 0.6);
  if (lk.mouth === 'thin') {
    ink([[-0.15, my + sag * 0.5], [0, my - 0.01], [0.15, my + sag * 0.5]], 1.2, 0.5);
    for (const side of [-1, 1]) ink([[side * 0.17, my - 0.01 + sag], [side * 0.2, my + 0.03 + sag]], 0.8, 0);
  }
  if (lk.mouth === 'lip') {
    ink([[-0.21, my + sag], [-0.06, my - 0.005], [0, my + 0.01], [0.06, my - 0.005], [0.21, my + sag]], 1.3, 0.5);
    fill(shade, [[-0.09, my + 0.07], [0.09, my + 0.07], [0.06, my + 0.1], [-0.06, my + 0.1]], 3, 0.1);
    ink([[-0.07, my + 0.085], [0.07, my + 0.085]], 0.8, 0.5, false, line);
  }
  if (lk.mouth === 'full') {
    const up: Pt[] = [[-0.23, my + sag], [-0.11, my - 0.055], [-0.03, my - 0.045], [0, my - 0.03], [0.03, my - 0.045], [0.11, my - 0.055], [0.23, my + sag], [0, my + 0.005]];
    const lo: Pt[] = [[-0.21, my + sag], [0, my + 0.005], [0.21, my + sag], [0.12, my + 0.08], [0, my + 0.1], [-0.12, my + 0.08]];
    fill(lip, up, 4);
    fill(mixColor(lip, '#ffffff', 0.08), lo, 4);
    ink([[-0.23, my + sag], [-0.1, my + 0.005], [0, my + 0.01], [0.1, my + 0.005], [0.23, my + sag]], 1.3, 0.5);
    ink(lo.slice(2), 0.7, 0.5, false, line);
  }
  return true;
};

export const paintHeadFront = (p: Painter, seed: number, cx: number, cy: number, K: number, face: FaceState, style: HeadStyle, t: number, warm = 0, L?: InteriorLight, turn = 0, pitch = 0) => {
  const P0 = turn ? ([u, v]: Pt): Pt => [cx + turnU(turn, u, v) * K, cy + v * K] : ([u, v]: Pt): Pt => [cx + u * K, cy + v * K];
  // `pitch` (VA03): the vertical sphere shift on top of the turn; 0 = the old mapping exactly.
  const P = pitch ? ([u, v]: Pt): Pt => { const q = P0([u, v]); return [q[0], cy + pitchV(pitch, u, v) * K]; } : P0;
  /** Turned head: a mark with every point on the hidden side is not drawn. */
  const hidden = (pts: Pt[]) => turn !== 0 && !pts.some(([u, v]) => turnVisible(turn, u, v));
  const Q = (pts: Pt[]) => pts.map(P);
  let part = 0;
  const fill = (color: string, pts: Pt[], passes = 3, texture = 0.06) => {
    const k = part++;
    if (hidden(pts)) return;
    if (L?.under) hardFill(p, seed * 100 + k + 5000, color, Q(pts));
    solid(p, seed * 100 + part, color, Q(pts), passes, L ? 0 : texture, 0.2);
  };
  let line = 0;
  const ink = (pts: Pt[], weight = 1.1, curve = 0.5, closed = false, color?: string) => {
    ++line;
    if (!hidden(pts)) inkLine(p, seed * 100 + line, Q(pts), {weight, curve, closed, color});
  };
  const skin = toneOf(skinOf(style, warm), L);
  const hairC = toneOf(style.hair, L);
  const eyes: Eyes = face.eyes !== 'none' && blinking(t, seed) ? 'shut' : face.eyes;
  const [lx, ly] = face.look;
  const {cut} = style;
  const nc = isNewCut(cut) ? hairFront(cut) : null;

  // Behind the head: hood, bob to the jaw, long hair to the shoulders, or a bun on top.
  const back: Pt[] | null =
    cut === 'hood' ? ell(0, 0.0, 1.3, 1.42, 28)
    : cut === 'bob' ? [...Array.from({length: 17}, (_, i): Pt => [1.14 * Math.cos(Math.PI + (i / 16) * Math.PI), 1.16 * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]), [1.16, 0.7], [0.86, 0.78], [-0.86, 0.78], [-1.16, 0.7]]
    : cut === 'long' ? longBack(style.hairRise ?? 0, t, style.hairCalm)
    : cut === 'tied' ? ell(0.05, -1.12, 0.32, 0.22, 18)
    : null;
  // Turned head (7 Nov 2026): the lower jaw drops with `open` (the chin of the skull and of the face window move down), and `chew` bulges the near cheek.
  const jawT = turn ? jawOpenOf(face) : 0, jawDown = (pts: Pt[]): Pt[] => (jawT > 0 ? pts.map(([u, v]): Pt => [u, v + JAW_DROP * 0.8 * jawT * smooth01(0.45, 1.05, v)]) : pts);
  const hairs: Pt[][] = nc ? nc.hair : [legacyFrontHair(cut)];
  const hairFill = nc?.tone ? mixColor(hairC, skin, nc.tone) : hairC;
  // Three-quarter head (pass 4, 4 Nov 2026; user: the r3 hair read as a wig sliding off the skull). Skull and hair are one solid: the
  // silhouette is the union of the unturned skull, hair cap and hair volume (`polarUnion`), split by a curved side hairline into hair
  // (above) and skin (below: jaw, behind the ear). Only the face window (the skin under the fringe, `faceWindow`), the hairline and the
  // features turn (`turnU`), so the face slides toward the facing side inside a head that keeps its outline, the far side shows more hair
  // and the ear, and nothing is clipped by a straight edge.
  const paintTurnedShell = () => {
    const sg = Math.sign(turn), ct = Math.cos(Math.abs(turn));
    const R = (pts: Pt[]) => pts.map(([u, v]): Pt => [cx + u * K, cy + v * K]);
    const shellFill = (id: number, color: string, pts: Pt[], passes: number) => {
      solid(p, seed * 100 + id, color, R(pts), passes, L ? 0 : 0.06, 0.2);
      if (L) modelPart(p, seed * 100 + id, color, R(pts), L);
    };
    // Inks are simplified first (`simplify`): a few hundred spline points drift off the fill.
    const shellInk = (id: number, pts: Pt[], color: string, closed: boolean) => inkLine(p, seed * 100 + id, R(simplify(closed ? [...pts, pts[0]] : pts, 0.006)), {weight: 1.0, curve: 0.3, closed: false, color});
    const turnedInk = (pts: Pt[], weight: number, closed: boolean, color: string) => {
      const q = (closed ? [...pts, pts[0]] : pts).map(([u, v]): Pt => [turnU(turn, u, v), v]);
      inkLine(p, seed * 100 + ++line, R(simplify(q, 0.006)), {weight, curve: 0.3, closed: false, color});
    };
    // Tails hang behind the head: a ponytail shows on the far side (the back of the head turns there), pigtails stay at the sides.
    const tailFlip = (pts: Pt[]) => (cut === 'ponytail' && sg > 0 ? pts.map(([u, v]): Pt => [-u, v]).reverse() : pts);
    const tails = cut === 'ponytail' || cut === 'pigtails' ? (nc?.back ?? []).map(tailFlip) : [];
    tails.forEach((poly, i) => {
      shellFill(2 + i, hairC, poly, 6);
      shellInk(2 + i, poly, lineOf(hairC, L), true);
    });
    const volume = cut === 'curly' || cut === 'perm' ? nc?.back ?? [] : [];
    const bald = cut === 'balding';
    const shell = polarUnion([jawDown(headOutline(60)), ...(back ? [back] : []), ...volume, ...(bald ? [] : hairs)], [0, -0.1]);
    // The face window: skin below the hairline of the cap (the whole face for the hood opening and a bald crown).
    const hl = cut === 'hood' || bald ? null : hairs.map(hairlineOf).find((r) => r) ?? null;
    const win = jawDown(hl ? faceWindow(hl) : headOutline(96));
    const vT = hl ? (sg > 0 ? hl[hl.length - 1][1] : hl[0][1]) : 0.02;
    // Side hairline (x = position toward the facing side): at the face window's far edge (the ear line, -cos theta) it is the temple, at
    // the far silhouette the nape height behind the ear. Bob, curly and perm end at their cut; long hair and the hood cover the head.
    // Late turn (60..75 deg, `quarterLate`): the hair drops to the nape just behind the ear, as in the profile it cuts to (at 75 deg the slow
    // ramp left the back of the head bare skin; 13 Nov 2026).
    const xw = -0.99 * ct, xn = lerp(-1.02, xw - 0.22, quarterLate((turn * 180) / Math.PI));
    const hSide = (u: number) => vT + (0.45 - vT) * smooth01(xw, xn, sg * u);
    const h = cut === 'hood' || cut === 'long' ? () => 9
      : cut === 'bob' ? (u: number) => 0.7 + 0.08 * Math.max(0, Math.min(1, (1.16 - Math.abs(u)) / 0.3))
      : cut === 'curly' ? (u: number) => 0.8 + 0.2 * Math.max(0, Math.min(1, (1.15 - Math.abs(u)) / 0.25))
      : cut === 'perm' ? () => 0.7
      : hSide;
    const hairPart = bald ? {poly: [] as Pt[], outer: [] as Pt[][]} : splitByCurve(shell, h, 'above');
    const skinPart = bald ? {poly: shell, outer: [[...shell, shell[0]]]} : splitByCurve(shell, h, 'below');
    const top = cut === 'hood' ? toneOf(style.hood ?? style.hair, L) : cut === 'shaved' ? skin : hairFill;
    if (skinPart.poly.length > 2) {
      shellFill(6, skin, skinPart.poly, 8);
      skinPart.outer.forEach((run, i) => run.length > 1 && shellInk(60 + i, run, lineOf(skin, L), false));
    }
    if (hairPart.poly.length > 2) {
      shellFill(8, top, hairPart.poly, 6);
      // A shaved crown is skin-toned: ink only its outline, not the hairline behind the ear.
      if (cut === 'shaved') hairPart.outer.forEach((run, i) => run.length > 1 && shellInk(80 + i, run, lineOf(top, L), false));
      else shellInk(8, hairPart.poly, lineOf(top, L), true);
    }
    if (bald) {
      // The fringe of hair round the back: a crescent on the far side from above the ear to the nape, thinning to nothing at the ear line.
      const band = splitByCurve(splitByCurve(shell, hSide, 'above').poly, (u) => -0.42 + (vT + 0.42) * smooth01(-1.02, xw, sg * u), 'below').poly;
      if (band.length > 2) {
        shellFill(9, hairFill, band, 6);
        shellInk(9, band, lineOf(hairFill, L), true);
      }
    }
    // Face window and the turned marks on it.
    part = 12;
    const winT = win;
    fill(skin, winT, 8);
    if (L) faceModel(p, seed, skin, Q(winT), L, [[cx + turnU(turn, -0.52, 0.34) * K, cy + 0.34 * K, 0.2 * K, 0.11 * K], [cx + turnU(turn, 0.52, 0.34) * K, cy + 0.34 * K, 0.2 * K, 0.11 * K]]);
    if (L && hl) {
      const band = densify(hl, 0.03, false);
      glaze(p, 7_600_000 + seed, mixColor(skin, palOf(L).shadow, 0.36), 140, Q([...band, ...band.map(([u, v]): Pt => [u, v + 0.12]).reverse()]), {texture: 0.3, border: 0.3, bleed: 0.06});
    }
    part = 20;
    if (cut === 'hood') hairs.forEach((hair) => fill(hairFill, densify(hair, 0.03), 6));
    if (bald) for (const tuft of hairs) if (Math.sign(tuft.reduce((a, q) => a + q[0], 0)) === sg) fill(hairFill, densify(tuft, 0.03), 6);
    if (L && cut !== 'hood' && (!nc || nc.sheen)) sheen(p, seed * 100 + 90, hairC, [
      Q(Array.from({length: 7}, (_, i): Pt => [-0.15 - 0.6 * Math.cos(Math.PI / 2 * (i / 6)), -0.95 + 0.55 * Math.sin(Math.PI / 2 * (i / 6))])),
      Q(Array.from({length: 6}, (_, i): Pt => [0.05 - 0.45 * (i / 5), -1.02 + 0.12 * (i / 5) ** 2])),
    ]);
    line = 12;
    // Bald and shaved crowns continue the skull above the face, so only the jaw part of the window is inked there.
    if (bald || cut === 'shaved') turnedInk(winT.filter(([, v]) => v > 0.05), 1.1, false, lineOf(skin, L));
    else turnedInk(winT, 1.1, true, lineOf(skin, L));
    if (hl) turnedInk(densify(hl, 0.03, false), 1.0, false, lineOf(hairFill, L));
    if (cut === 'hood') hairs.forEach((hair) => turnedInk(densify(hair, 0.03), 1.0, true, lineOf(hairFill, L)));
    if (bald) for (const tuft of hairs) if (Math.sign(tuft.reduce((a, q) => a + q[0], 0)) === sg) turnedInk(densify(tuft, 0.03), 1.0, true, lineOf(hairFill, L));
    if (nc?.part) turnedInk(densify(nc.part, 0.03, false), 0.9, false, lineOf(hairC, L));
    // The ear on the far side sits on the ear line over the window edge (the facing one has turned out of sight).
    if (cut === 'short' || cut === 'tied' || nc?.ears.includes(-sg as -1 | 1)) {
      const ear = ell(-sg * 0.99 * ct, 0.12, 0.12, 0.21, 16);
      solid(p, seed * 100 + 10, skin, R(ear), 4, L ? 0 : 0.06, 0.2);
      inkLine(p, seed * 100 + 10, R(ear), {weight: 0.9, curve: 0.3, closed: true, color: lineOf(skin, L)});
    }
    // Ties and bands over the hair: with their tail (ponytail) or at the sides (pigtails).
    nc?.accent?.forEach((poly, i) => {
      const q = cut === 'ponytail' ? tailFlip(poly) : poly;
      shellFill(40 + i, toneOf(style.accent ?? '#b8483c', L), q, 4);
      shellInk(40 + i, q, lineOf(hairC, L), true);
    });
    // A shade on the cheek away from the turn gives the face a far side, and the nose tip breaks the facing cheek line (a hint at 45
    // degrees, clearly out at 60). Marks in plate px, not through the decal map.
    const sn = Math.sin(Math.abs(turn));
    const vs = [-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.12];
    const far = vs.map((v): Pt => [turnU(turn, -sg * headRho(v) * 0.995, v), v]);
    const inn = vs.map((v, i): Pt => [far[i][0] + sg * 0.36 * sn * Math.max(0.06, 1 - ((v - 0.45) / 0.85) ** 2), v]).reverse();
    // Late turn: the far cheek edge has swung to the middle of the head and the shade read as a stripe down it; it fades out by 75 deg.
    const cheekOp = 95 * (1 - quarterLate((turn * 180) / Math.PI));
    if (cheekOp > 1) glaze(p, 7_650_000 + seed, mixColor(skin, '#6a3f2c', 0.3), cheekOp, R([...far, ...inn]), {border: 0.3, bleed: 0.1});
    // Chewing: the facing cheek swells (a warm round shade over the cheek and a short crease round its lower edge).
    const chewT = Math.min(1, face.chew ?? 0);
    if (chewT > 0) {
      const cc = turnU(turn, sg * 0.1, 0.52), bulge = ell(cc, 0.52, 0.15 + 0.05 * chewT, 0.14 + 0.04 * chewT, 16);
      glaze(p, 7_660_000 + seed, mixColor(skin, '#d9806a', 0.4), 70 + 60 * chewT, R(bulge), {border: 0.3, bleed: 0.08});
      inkLine(p, seed * 100 + 97, R(Array.from({length: 7}, (_, i): Pt => [cc + sg * (0.04 + 0.17 * Math.cos(0.4 + (i / 6) * 1.7)), 0.52 + 0.17 * Math.sin(0.4 + (i / 6) * 1.7)])), {weight: 0.7 + 0.3 * chewT, curve: 0.5, closed: false, color: mixColor(lineOf(skin, L), '#a4504a', 0.3)});
    }
    // The tip stands at most 0.09 past the cheek line (0.14 past 50 deg, where it is the only nose; VA04): unchanged up to 45 deg, no beak at 60.
    const u0 = turnU(turn, 0, 0.3), tip = sg * Math.min(Math.abs(u0 + sg * (0.2 + 0.2 * sn)), headRho(0.36) + (Math.abs(turn) > (50 * Math.PI) / 180 ? 0.14 : 0.09));
    const nose: Pt[] = [[u0, 0.14], [tip, 0.36], [tip - sg * 0.05, 0.42], [u0 + sg * 0.04, 0.45]];
    solid(p, seed * 100 + 98, skin, R(nose), 3, L ? 0 : 0.04, 0.2);
    inkLine(p, seed * 100 + 98, R(nose.slice(1)), {weight: 0.9, curve: 0.3, closed: false, color: lineOf(skin, L)});
    // Past 50 deg the front nose marks are off (above): the turned nose carries a nostril, as the profile nose does.
    if (Math.abs(turn) > (50 * Math.PI) / 180) inkLine(p, seed * 100 + 99, R([[tip - sg * 0.1, 0.39], [tip - sg * 0.18, 0.415]]), {weight: 0.9, curve: 0.3, closed: false, color: lineOf(skin, L)});
  };
  if (turn) {
    paintTurnedShell();
  } else {
    if (back) {
      const bc = toneOf(cut === 'hood' ? style.hood ?? style.hair : style.hair, L);
      fill(bc, back, 6);
      if (L) modelPart(p, seed * 100 + part, bc, Q(back), L);
      ink(back, 1.0, 0.3, true, lineOf(bc, L));
    }
    nc?.back?.forEach((poly) => {
      const bc = toneOf(style.hair, L);
      fill(bc, poly, 6);
      if (L) modelPart(p, seed * 100 + part, bc, Q(poly), L);
      ink(poly, 1.0, 0.3, true, lineOf(bc, L));
    });
    part = 10;
    if (cut === 'short' || cut === 'tied') for (const side of [-1, 1]) fill(skin, ell(side * 1.0, 0.12, 0.14, 0.21, 16), 3);
    else if (nc) for (const side of nc.ears) fill(skin, ell(side * 1.0, 0.12, 0.14, 0.21, 16), 3);
    part = 12;
    const head = headOutline();
    fill(skin, head, back || nc?.back ? 8 : 4);
    if (L) faceModel(p, seed, skin, Q(head), L, [[cx - 0.52 * K, cy + 0.34 * K, 0.2 * K, 0.11 * K], [cx + 0.52 * K, cy + 0.34 * K, 0.2 * K, 0.11 * K]]);
    // VD18: the fringe casts a soft band of shadow on the forehead (the hair shape, shifted down, under the hair fill).
    if (L && cut !== 'hood') hairs.forEach((hair, i) => glaze(p, 7_600_000 + seed + i, mixColor(skin, palOf(L).shadow, 0.36), 140, Q(hair.map(([u, v]): Pt => [u * 0.97, v + 0.12])), {texture: 0.3, border: 0.3, bleed: 0.06}));
    hairs.forEach((hair) => {
      fill(hairFill, hair, 6);
      if (L) modelPart(p, seed * 100 + part, hairFill, Q(hair), L);
    });
    if (L && cut !== 'hood' && (!nc || nc.sheen)) sheen(p, seed * 100 + 90, hairC, [
      Q(Array.from({length: 7}, (_, i): Pt => [-0.15 - 0.6 * Math.cos(Math.PI / 2 * (i / 6)), -0.95 + 0.55 * Math.sin(Math.PI / 2 * (i / 6))])),
      Q(Array.from({length: 6}, (_, i): Pt => [0.05 - 0.45 * (i / 5), -1.02 + 0.12 * (i / 5) ** 2])),
    ]);
    nc?.accent?.forEach((poly) => {
      fill(toneOf(style.accent ?? '#b8483c', L), poly, 4);
      ink(poly, 0.9, 0.2, true, lineOf(hairC, L));
    });
    ink(head, 1.1, 0.3, true, lineOf(skin, L));
    hairs.forEach((hair) => ink(hair, 1.0, 0.3, true, lineOf(hairFill, L)));
    if (nc?.part) ink(nc.part, 0.9, 0.3, false, lineOf(hairC, L));
  }

  // Eyes: white almond + pupil offset by the look vector; squint lowers the upper lid.
  part = 30;
  line = 30;
  const sq = 1 - 0.6 * (face.squint ?? 0);
  const lk = style.look;
  for (const side of [-1, 1]) {
    const ex = side * 0.4, ey = 0.05;
    if (eyes === 'none') continue;
    if (eyes === 'shut') {
      ink(lk ? [[ex - 0.2, ey - 0.01], [ex, ey + 0.05], [ex + 0.2, ey - 0.01 - side * 0.02]] : [[ex - 0.18, ey], [ex, ey + 0.05], [ex + 0.18, ey]], lk ? 1.8 : 1.5);
      continue;
    }
    if (lk) {
      lookEye(lk, side, ex, ey, eyes, sq, [lx, ly], fill, ink, skin);
      continue;
    }
    const ry = (eyes === 'wide' ? 0.15 : 0.12) * sq;
    const white = eyes === 'half' || sq < 1
      ? Array.from({length: 13}, (_, i): Pt => [ex + 0.2 * Math.cos((i / 12) * Math.PI), ey + (eyes === 'half' ? 0.12 : ry) * Math.sin((i / 12) * Math.PI)])
      : ell(ex, ey, 0.2, ry, 22);
    fill(WHITE, white, 3);
    const pr = eyes === 'wide' ? 0.05 : 0.065;
    fill(INK, ell(ex + lx * 0.1, ey + ly * 0.055 + (eyes === 'half' || sq < 1 ? 0.05 : 0), pr, pr, 14), 6);
    ink(white, 1.0, 0.4, true);
  }
  // Fixed bases after the eyes (their mark count changes on a blink), so brows and mouth never re-randomise.
  part = 50;
  line = 50;
  for (const side of [-1, 1]) {
    let [inner, outer] = browY(face);
    if (face.brow === 'quirk' && side === 1) [inner, outer] = [-0.34, -0.36];
    if (lk) fill(browColor(style), lookBrow(lk, side, inner + lk.browDrop, outer + lk.browDrop), 6);
    else fill(browColor(style), [[side * 0.22, inner - 0.03], [side * 0.6, outer - 0.03], [side * 0.6, outer + 0.03], [side * 0.22, inner + 0.03]], 6);
  }
  if (lk) {
    part = 56;
    line = 56;
    // Past 50 deg the turned nose at the cheek line is the nose (VA04): the front marks would sit inside it as a second nose.
    if (Math.abs(turn) <= (50 * Math.PI) / 180) lookNose(lk, fill, ink, skin, lineOf(skin, L));
    line = 50;
  }
  if (style.facial) {
    const sp = part, sl = line;
    part = 60;
    line = 60;
    paintFacialFront(style.facial, {p, seed, Q: (pts) => Q(jawDown(pts)), color: toneOf(style.hair, L), skin, L, fill, ink});
    part = sp;
    line = sl;
  }
  const my = 0.6;
  const m = face.mouth;
  const lookShut = lk ? lookMouth(lk, m, face.open ?? 0, my, fill, ink, skin, lineOf(skin, L)) : false;
  if (!lookShut && (m === 'flat' || (m === 'talk' && (face.open ?? 0) < 0.08))) ink([[-0.2, my], [0.2, my]], 1.3, 0);
  if (!lookShut && m === 'frown') ink([[-0.18, my + 0.05], [0, my - 0.03], [0.18, my + 0.05]], 1.4, 0.8);
  if (m === 'wavy') ink(Array.from({length: 9}, (_, i): Pt => [-0.24 + i * 0.06, my + (i % 2 ? 0.035 : -0.01)]), 1.2, 0.6);
  // `smile` with `open` 0..0.3 set is the closed-lip small smile (a shallow upturned arc, no mouth fill); absent `open` = the D smile.
  const softSmile = m === 'smile' && face.open !== undefined && face.open < 0.3;
  if (softSmile) ink(Array.from({length: 9}, (_, i): Pt => { const x = -0.24 + i * 0.06; return [x, my + 0.045 - 0.09 * (x / 0.24) ** 2]; }), 1.4, 0.7);
  if (m === 'smile' && !softSmile) {
    const pts: Pt[] = [[-0.3, my - 0.06], [0.3, my - 0.06]];
    for (let i = 1; i < 12; i++) pts.push([0.3 * Math.cos((i / 12) * Math.PI), my - 0.06 + 0.2 * Math.sin((i / 12) * Math.PI)]);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.2, true);
  }
  if (m === 'o' || m === 'gasp' || (m === 'talk' && (face.open ?? 0) >= 0.08)) {
    const o = face.open ?? 1;
    const dj = turn ? JAW_DROP * 0.8 * jawT : 0; // turned head: the upper lip stays, the lower lip goes down with the chin
    const pts = m === 'o' ? ell(0, my + 0.03 + dj / 2, 0.11, 0.13, 16) : m === 'gasp' ? ell(0, my + 0.02 + dj / 2, 0.15, 0.07, 16) : turn ? ell(0, my + 0.01 + 0.025 + dj / 2, 0.13, 0.025 + dj / 2 + (face.jaw === undefined ? 0 : 0.08 * o * (1 - Math.max(0, Math.min(1, face.jaw)))), 16) : ell(0, my + 0.02, 0.13, 0.02 + 0.08 * o, 16);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.4, true);
  }
  if (m === 'gape') {
    // Activity mouth (13 Nov 2026): an open oval, wider than tall, whose height follows `open` (a pant cycle, a gasp); the turned head drops the lower edge with the jaw.
    const o = Math.max(0, Math.min(1, face.open ?? 1)), dj = turn ? JAW_DROP * 0.8 * jawT : 0;
    const pts = ell(0, my + 0.03 + dj / 2, 0.17, 0.035 + (turn ? 0.05 : 0.11) * o + dj / 2, 16);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.4, true);
  }
  if (m === 'clench') {
    // Activity mouth (13 Nov 2026): gritted teeth, a wide flat band of teeth with the corners pulled down, the bite line across and three tooth gaps.
    const pts: Pt[] = [[-0.25, my + 0.03], [-0.19, my - 0.045], [0, my - 0.055], [0.19, my - 0.045], [0.25, my + 0.03], [0.17, my + 0.065], [0, my + 0.07], [-0.17, my + 0.065]];
    fill(WHITE, pts, 4);
    ink(pts, 1.1, 0.4, true);
    ink([[-0.22, my + 0.012], [0, my + 0.008], [0.22, my + 0.012]], 0.8, 0.3);
    for (const x of [-0.1, 0, 0.1]) ink([[x, my - 0.04], [x, my + 0.055]], 0.6, 0);
  }
  if (m === 'grin') {
    // Wide open laugh: a deep D with a strip of teeth along the top.
    const pts: Pt[] = [[-0.42, my - 0.1], [0.42, my - 0.1]];
    for (let i = 1; i < 14; i++) pts.push([0.42 * Math.cos((i / 14) * Math.PI), my - 0.1 + 0.36 * Math.sin((i / 14) * Math.PI)]);
    fill(MOUTH, pts, 4);
    fill(WHITE, [[-0.37, my - 0.09], [0.37, my - 0.09], [0.35, my - 0.01], [-0.35, my - 0.01]], 3);
    ink(pts, 1.0, 0.2, true);
  }
  if (m === 'smirk') {
    ink([[-0.2, my + 0.03], [0.04, my + 0.04], [0.24, my - 0.05]], 1.3, 0.6);
    ink([[0.24, my - 0.05], [0.29, my - 0.11]], 1.1, 0);
  }
  if (m === 'shout') {
    const pts = ell(0, my + 0.1 + (turn ? JAW_DROP * 0.4 * jawT : 0), 0.2, 0.08 + 0.12 * (face.open ?? 1), 20);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.4, true);
  }
  if (style.glasses) {
    line = 70;
    for (const side of [-1, 1]) {
      ink(ell(side * 0.4, 0.05, 0.3, 0.23, 22), 1.5, 0.3, true, GLASSES);
      ink([[side * 0.69, 0.0], [side * 0.98, -0.02]], 1.3, 0.2, false, GLASSES);
    }
    ink([[-0.12, 0.0], [0, -0.05], [0.12, 0.0]], 1.3, 0.4, false, GLASSES);
  }
  if (style.lines) {
    line = 80;
    const age = (pts: Pt[], curve = 0.5) => inkLine(p, seed * 100 + ++line, Q(pts), {color: AGE, weight: 0.8, curve, closed: false});
    for (const side of [-1, 1]) {
      for (const dy of [-0.06, 0.02, 0.1]) age([[side * 0.64, 0.05 + dy * 0.6], [side * 0.76, 0.05 + dy]], 0);
      age([[side * 0.24, 0.22], [side * 0.4, 0.27], [side * 0.56, 0.22]]);
      age([[side * 0.22, 0.3], [side * 0.3, 0.46], [side * 0.3, 0.6]]);
      age([[side * 0.27, 0.66], [side * 0.29, 0.76]], 0);
    }
    age([[-0.3, -0.62], [0, -0.66], [0.3, -0.62]]); // forehead line under the fringe
  }
  // Under-eye bags, tear streams and a sweat drop (expressions.ts); drawn only when the face asks, ids above every other part.
  if (face.bags) {
    part = 88;
    line = 88;
    const b = Math.min(1, face.bags);
    for (const side of [-1, 1]) {
      const x = side * 0.4;
      fill(mixColor(skin, BAGS, 0.3 * b), [[x - 0.2, 0.15], [x, 0.2], [x + 0.2, 0.15], [x + 0.12, 0.25], [x, 0.28], [x - 0.12, 0.25]], 3);
      ink([[x - 0.16, 0.24], [x, 0.29], [x + 0.16, 0.24]], 0.8, 0.6, false, mixColor(skin, BAGS, 0.6 * b));
    }
  }
  if (face.tears) {
    part = 92;
    line = 92;
    for (const side of [-1, 1]) {
      const x = side * 0.42, len = 0.18 + 0.5 * Math.min(1, face.tears);
      const stream: Pt[] = [[x - 0.035, 0.17], [x + 0.035, 0.17], [x + side * 0.04 + 0.04, 0.17 + len], [x + side * 0.04 - 0.04, 0.17 + len]];
      fill(TEAR, stream, 4);
      fill(TEAR, ell(x + side * 0.04, 0.17 + len + 0.03, 0.06, 0.07, 10), 4);
      ink(stream, 0.8, 0.3, true, TEAR_INK);
    }
  }
  if (face.sweat) {
    part = 96;
    line = 96;
    const drop = sweatDrop(1.02, -0.5, 1);
    fill(TEAR, drop, 4);
    ink(drop, 0.9, 0.4, true, TEAR_INK);
  }
};

/**
 * Profile head centred on (cx, cy), facing `dir` (+1 screen-right, -1 screen-left); same egg, one eye and brow, nose,
 * ear. Hood, bob, long and bun variants; age lines for the older occupant.
 */
export const paintHeadSide = (p: Painter, seed: number, cx: number, cy: number, K: number, face: FaceState, style: HeadStyle, dir: 1 | -1, t: number, warm = 0, L?: InteriorLight) => {
  const Q = (pts: Pt[]): Pt[] => pts.map(([u, v]) => [cx + dir * u * K, cy + v * K]);
  let part = 0;
  const fill = (color: string, pts: Pt[], passes = 4) => {
    if (L?.under) hardFill(p, seed * 100 + part + 5000, color, Q(pts));
    solid(p, seed * 100 + ++part, color, Q(pts), passes, L ? 0 : 0.06, 0.2);
  };
  let line = 0;
  const ink = (pts: Pt[], weight = 1.0, curve = 0.15, closed = true, color?: string) => inkLine(p, seed * 100 + ++line, Q(pts), {weight, curve, closed, color});
  const skin = toneOf(skinOf(style, warm), L);
  const hairC = toneOf(style.hair, L);
  const {cut} = style;
  const nc = isNewCut(cut) ? hairSide(cut) : null;
  const arc = (r: number, a0: number, a1: number, n = 20): Pt[] =>
    Array.from({length: n + 1}, (_, i): Pt => {
      const a = a0 + ((a1 - a0) * i) / n;
      return [r * Math.cos(a), r * 1.05 * Math.sin(a) - 0.02];
    });
  if (cut === 'tied') fill(hairC, ell(-0.74, -0.9, 0.3, 0.22, 16), 6);
  if (cut === 'long') {
    const back: Pt[] = [[0.1, -0.9], [-0.7, -0.8], [-1.12, -0.2], [-1.2, 0.7], [-1.0, 1.55], [-0.45, 1.6], [-0.3, 0.9], [-0.1, 0.3]];
    fill(hairC, back, 6);
    if (L) modelPart(p, seed * 100 + part, hairC, Q(back), L);
  }
  nc?.back?.forEach((poly) => {
    fill(hairC, poly, 6);
    if (L) modelPart(p, seed * 100 + part, hairC, Q(poly), L);
    ink(poly, 1.0, 0.15, true, lineOf(hairC, L));
  });
  part = 6;
  // The jaw follows `open` (the chin outline moves down and back with the lower lip), the near cheek bulges with `chew`.
  const jaw = jawOpenOf(face), chewK = Math.min(1, face.chew ?? 0);
  const jawQ = (pts: Pt[]): Pt[] => pts.map((q) => jawSide(jaw, q));
  const head = headOutline(120).map(([x, y]): Pt => {
    const [jx, jy] = jawSide(jaw, [x, y]);
    if (chewK <= 0) return [jx, jy];
    const d = Math.hypot(jx - 0.8, jy - 0.5), g = Math.max(0, 1 - d / 0.38), push = chewK * 0.09 * g * g * (3 - 2 * g), nx = jx + 0.1, ny = jy - 0.2, nl = Math.hypot(nx, ny) || 1;
    return [jx + (nx / nl) * push, jy + (ny / nl) * push];
  });
  fill(skin, head, 8);
  if (L) faceModel(p, seed, skin, Q(head), L, [[cx + dir * 0.55 * K, cy + 0.36 * K, 0.2 * K, 0.11 * K]]);
  fill(skin, [[0.9, 0.1], [1.13, 0.34], [0.95, 0.43]], 4); // nose
  ink(head, 1.0, 0.15, true, lineOf(skin, L));
  ink([[0.9, 0.1], [1.13, 0.34], [0.95, 0.43]], 1.0, 0.15, false, lineOf(skin, L));
  const det = style.sideDetail === true, lk = style.look, skinLine = lineOf(skin, L);
  part = 12;
  line = 10;
  if (cut === 'hood') {
    const hood: Pt[] = [...Array.from({length: 25}, (_, i): Pt => {
      const a = 1.25 + ((5.08 - 1.25) * i) / 24;
      return [-0.12 + 1.14 * Math.cos(a), 1.3 * Math.sin(a)];
    }), ...(style.hoodOpen ? [[0.62, -1.06], [0.5, -0.7], [0.3, -0.25], [0.22, 0.35], [0.3, 0.95]] as Pt[] : [[0.5, -1.0], [0.66, -0.55], [0.62, 0.25], [0.45, 0.95]] as Pt[])];
    fill(style.hood ?? style.hair, hood, 6);
    ink(hood);
    fill(style.hair, [[0.58, -0.78], [0.88, -0.5], [0.72, -0.42], [0.6, -0.42]], 6);
  } else if (cut === 'bob') {
    // `sideDetail`: bangs cover the forehead down to the brow (the plain cap leaves a bare sliver that reads as a receding hairline).
    const bangs: Pt[] = [[0.55, -0.4], [0.72, -0.43], [0.88, -0.45], [0.97, -0.39], [0.96, -0.5], [0.9, -0.65], [0.81, -0.8], [0.71, -0.92]]; // front edge eases out onto the crown arc
    const bob: Pt[] = [...(det ? bangs : [[0.8, -0.42]] as Pt[]), ...arc(1.12, -1.0, -Math.PI), [-1.14, 0.6], [-1.0, 0.8], [0.1, 0.8], [0.22, 0.3], [0.3, -0.3]];
    fill(hairC, bob, 6);
    if (L) modelPart(p, seed * 100 + part, hairC, Q(bob), L);
    ink(bob, 1.0, 0.15, true, lineOf(hairC, L));
  } else if (cut === 'long') {
    // Cap from a low front hairline over the skull, down behind the ear; strands frame the face and stay off the eye.
    const cap: Pt[] = [[0.9, -0.36], [0.98, -0.55], ...arc(1.12, -0.7, -Math.PI - 0.5), [-0.95, 0.75], [-0.62, 0.62], [-0.3, 0.2], [0.05, -0.12], [0.4, -0.3], [0.7, -0.33]];
    fill(hairC, cap, 6);
    if (L) {
      modelPart(p, seed * 100 + part, hairC, Q(cap), L);
      sheen(p, seed * 100 + 90, hairC, [Q(Array.from({length: 7}, (_, i): Pt => [0.6 - 1.1 * (i / 6), -1.0 + 0.15 * Math.sin(Math.PI * (i / 6))]))]);
    }
    ink(cap, 1.0, 0.15, true, lineOf(hairC, L));
  } else if (nc) {
    const hairFill = nc.tone ? mixColor(hairC, skin, nc.tone) : hairC;
    nc.hair.forEach((poly) => {
      fill(hairFill, poly, 6);
      if (L) modelPart(p, seed * 100 + part, hairFill, Q(poly), L);
      ink(poly, 1.0, 0.15, true, lineOf(hairFill, L));
    });
    if (L && nc.sheen) sheen(p, seed * 100 + 90, hairC, [Q(Array.from({length: 7}, (_, i): Pt => [0.6 - 1.1 * (i / 6), -1.0 + 0.15 * Math.sin(Math.PI * (i / 6))]))]);
    nc.accent?.forEach((poly) => {
      fill(toneOf(style.accent ?? '#b8483c', L), poly, 4);
      ink(poly, 0.9, 0.2, true, lineOf(hairC, L));
    });
    if (nc.ear) {
      fill(skin, ell(-0.12, 0.12, 0.15, 0.22, 16), 8);
      ink([[-0.08, 0.0], [-0.17, 0.1], [-0.08, 0.22]], 0.9, 0.6, false);
    }
  } else {
    const fringe = Array.from({length: 9}, (_, i): Pt => [0.2 + (0.62 * i) / 8, -0.4 - (0.08 * i) / 8 + 0.05 * Math.abs(Math.sin((i / 8) * 2 * Math.PI))]);
    const cap: Pt[] = [...arc(1.08, -1.0, -Math.PI - 0.55), [-0.62, 0.5], [-0.36, 0.06], [-0.12, -0.14], [0.18, -0.34], ...fringe];
    fill(style.hair, cap, 6);
    ink(cap);
    fill(skin, ell(-0.12, 0.12, 0.15, 0.22, 16), 8);
    ink([[-0.08, 0.0], [-0.17, 0.1], [-0.08, 0.22]], 0.9, 0.6, false);
  }
  part = 30;
  line = 30;
  const eyes: Eyes = face.eyes !== 'none' && blinking(t, seed) ? 'shut' : face.eyes;
  const [lx, ly] = face.look;
  const lash = det && lk !== undefined && lk.lash !== false;
  if (eyes === 'none') { /* the shot paints its own eye */ }
  else if (eyes === 'shut') {
    ink([[0.5, 0.05], [0.62, 0.1], [0.74, 0.05]], 1.4, 0.5, false);
    if (lash) ink([[0.7, 0.08], [0.75, 0.13]], 1.1, 0.3, false, LID);
  } else if (det) {
    // Profile eye: white, coloured iris, pupil, catch-light, heavier upper lid, lid crease, lower lid, front lash (looks with lashes).
    const sq = 1 - 0.6 * (face.squint ?? 0), ry = (eyes === 'wide' ? 0.15 : 0.12) * sq;
    const white = ell(0.62, 0.05, 0.13, ry, 16), icx = 0.67 + 0.03 * lx, icy = 0.05 + 0.05 * ly;
    fill(WHITE, white, 3);
    fill(lk?.iris ?? IRIS, ell(icx, icy, 0.06, Math.min(0.085 * sq, ry - 0.012), 12), 5);
    fill(INK, ell(icx + 0.005, icy, 0.032, 0.045 * sq, 10), 4);
    if (sq > 0.6) fill(WHITE, ell(icx - 0.015, icy - 0.03 * sq, 0.016, 0.016, 8), 3);
    ink(white, 1.0, 0.4);
    const lid = (k: number, dy: number, a0: number, a1: number): Pt[] => Array.from({length: 9}, (_, i): Pt => {
      const a = a0 + ((a1 - a0) * i) / 8;
      return [0.62 + 0.13 * k * Math.cos(a), 0.05 + dy + ry * Math.sin(a)];
    });
    ink(lid(1, 0, Math.PI, 2 * Math.PI), lash ? 1.8 : 1.2, 0.4, false, LID);
    if (lk?.eye !== 'round') ink(lid(0.9, -0.05, Math.PI + 0.45, 2 * Math.PI - 0.35), 0.8, 0.5, false, mixColor(skin, LID, 0.5));
    ink([[0.58, 0.05 + ry + 0.025], [0.7, 0.05 + ry + 0.012]], 0.6, 0.4, false, skinLine);
    if (lash) {
      ink([[0.72, 0.05 - ry * 0.75], [0.78, 0.05 - ry * 1.05], [0.82, 0.05 - ry * 1.05]], 1.5, 0.4, false, LID);
      ink([[0.68, 0.05 - ry * 0.95], [0.72, 0.05 - ry * 1.4]], 1.1, 0.3, false, LID);
    }
  } else {
    const sq = 1 - 0.6 * (face.squint ?? 0);
    const white = ell(0.62, 0.05, 0.13, (eyes === 'wide' ? 0.15 : 0.12) * sq, 16);
    fill(WHITE, white, 3);
    fill(INK, ell(0.67 + 0.03 * lx, 0.05 + 0.05 * ly, 0.055, 0.065 * sq, 12), 6);
    ink(white, 1.0, 0.4);
  }
  part = 50;
  line = 50;
  const [inner, outer] = browY(face);
  fill(browColor(style), [[0.46, outer - 0.03], [0.8, inner - 0.03], [0.8, inner + 0.03], [0.46, outer + 0.03]], 6);
  if (style.facial) {
    const sp = part, sl = line;
    part = 60;
    line = 60;
    paintFacialSide(style.facial, {p, seed, Q: (pts) => Q(jawQ(pts)), color: toneOf(style.hair, L), skin, L, fill, ink: (pts, w, c, closed, col) => ink(pts, w, c, closed, col)});
    part = sp;
    line = sl;
  }
  // Mouth (7 Nov 2026): the plain profile mouth shapes, no drawn lips (user: no shaped/cupid's-bow lips in profile). The jaw drops with
  // `open` (`jawSide`), so every mouth point below the lip line moves down and back with the chin.
  {
    const m = face.mouth, o = face.open ?? 0, J = (pts: Pt[]) => pts.map((q) => jawSide(jaw, q));
    part = 40;
    line = 40;
    if (m === 'smile') fill(MOUTH, J([[0.66, 0.56], [0.95, 0.54], [0.9, 0.66], [0.78, 0.7], [0.7, 0.64]]), 4);
    else if (m === 'grin') {
      fill(MOUTH, J([[0.58, 0.52], [0.94, 0.5], [0.9, 0.7], [0.78, 0.8], [0.64, 0.74]]), 4);
      fill(WHITE, [[0.62, 0.53], [0.92, 0.51], [0.91, 0.6], [0.64, 0.62]], 3);
    } else if (m === 'smirk') ink([[0.7, 0.66], [0.84, 0.66], [0.96, 0.58]], 1.3, 0.5, false);
    else if (m === 'gape') fill(MOUTH, J(ell(0.83, 0.61, 0.095, 0.03 + 0.05 * Math.max(0, Math.min(1, face.open ?? 1)), 12)), 4); // the jaw adds the height
    else if (m === 'clench') {
      // Gritted teeth in profile: a plain strip of teeth with the bite line, no drawn lips (7 Nov 2026 rule); the jaw stays shut.
      const pts: Pt[] = [[0.72, 0.6], [0.95, 0.59], [0.94, 0.655], [0.73, 0.665]];
      fill(WHITE, pts, 4);
      ink(pts, 1.1, 0.3, true);
      ink([[0.73, 0.628], [0.945, 0.622]], 0.8, 0, false);
    }
    else if (m === 'shout') fill(MOUTH, J(ell(0.76, 0.64, 0.07 + 0.03 * (face.open ?? 1), 0.08, 14)), 4); // the jaw adds the height
    else if (m === 'frown') ink([[0.7, 0.66], [0.8, 0.6], [0.92, 0.64]], 1.4, 0.6, false);
    else if (m === 'wavy') ink([[0.7, 0.62], [0.76, 0.59], [0.82, 0.63], [0.88, 0.59], [0.93, 0.62]], 1.1, 0.5, false);
    else if (m === 'o' || m === 'gasp' || (m === 'talk' && (o >= 0.08 || jaw > 0.03))) {
      // Open mouth: a dark gap whose lower edge rides the dropped jaw.
      const h = m === 'talk' ? 0.02 + 0.03 * o : 0.06;
      fill(MOUTH, J(ell(0.84, 0.6, 0.08, h, 12)), 4);
    } else ink([[0.72, 0.62], [0.93, 0.62]], 1.2, 0, false);
    if (chewK > 0) ink([[0.5, 0.52], [0.58, 0.6], [0.55, 0.7]], 0.8 + 0.4 * chewK, 0.6, false, mixColor(skinLine, '#a4504a', 0.3)); // bulging cheek: a short crease round it
  }
  if (style.glasses) {
    line = 70;
    ink(ell(0.62, 0.05, 0.22, 0.22, 22), 1.5, 0.3, true, GLASSES);
    ink([[0.42, 0.0], [-0.1, -0.02]], 1.3, 0.2, false, GLASSES);
    ink([[0.82, 0.03], [1.0, 0.1]], 1.3, 0.2, false, GLASSES);
  }
  if (style.lines) {
    line = 80;
    const age = (pts: Pt[], curve = 0.5) => inkLine(p, seed * 100 + ++line, Q(pts), {color: AGE, weight: 0.8, curve, closed: false});
    for (const dy of [-0.05, 0.03, 0.11]) age([[0.38, 0.05 + dy * 0.6], [0.26, 0.05 + dy]], 0); // crow's feet
    age([[0.5, 0.22], [0.62, 0.27], [0.74, 0.23]]);
    age([[0.9, 0.42], [0.8, 0.52], [0.76, 0.66]]); // nasolabial
    age([[0.7, 0.68], [0.68, 0.78]], 0);
    age([[0.35, -0.62], [0.6, -0.6]], 0.2); // forehead
  }
  if (face.bags) {
    part = 88;
    line = 88;
    const b = Math.min(1, face.bags);
    fill(mixColor(skin, BAGS, 0.3 * b), [[0.48, 0.15], [0.62, 0.2], [0.76, 0.15], [0.7, 0.25], [0.6, 0.27], [0.52, 0.23]], 3);
    ink([[0.5, 0.23], [0.62, 0.28], [0.74, 0.23]], 0.8, 0.6, false, mixColor(skin, BAGS, 0.6 * b));
  }
  if (face.tears) {
    part = 92;
    line = 92;
    const len = 0.18 + 0.5 * Math.min(1, face.tears);
    const stream: Pt[] = [[0.58, 0.17], [0.68, 0.17], [0.7, 0.17 + len], [0.6, 0.17 + len]];
    fill(TEAR, stream, 4);
    fill(TEAR, ell(0.65, 0.17 + len + 0.03, 0.06, 0.07, 10), 4);
    ink(stream, 0.8, 0.3, true, TEAR_INK);
  }
  if (face.sweat) {
    part = 96;
    line = 96;
    const drop = sweatDrop(1.18, -0.42, 1);
    fill(TEAR, drop, 4);
    ink(drop, 0.9, 0.4, true, TEAR_INK);
  }
};
