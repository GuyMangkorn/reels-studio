import {hairFront, hairSide, isNewCut, type NewCut} from './hair';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';
import {INK, VD18, ell, glaze, inkLine, lineOf, modelPart, planeBand, rimScaleOf, solid, toneOf, type InteriorLight} from './draw';

// Flat-face decal heads (front and profile) for the WFOG cast (brief VD03; user-approved look 29 Oct 2026), ported
// from the spike sheets `FaceSheet.tsx` / `SideSheet.tsx` into the plate Painter: egg head, cap of hair, almond eyes
// with a look vector, bar brows, line/filled mouth, periodic blink, and age lines (older occupant, front and profile).

export type Brow = 'flat' | 'up' | 'worry' | 'angry' | 'quirk';
export type Eyes = 'dot' | 'wide' | 'half' | 'shut';
/** `grin`, `smirk` and `shout` were added for the expression presets (`expressions.ts`, 1 Nov 2026); the first seven are the WFOG/ZC set. */
export type Mouth = 'flat' | 'smile' | 'o' | 'wavy' | 'frown' | 'gasp' | 'talk' | 'grin' | 'smirk' | 'shout';
/**
 * `open` 0..1 opens a `talk` mouth (pose tracks drive it; TTS amplitude can replace it later) or sizes a `shout` mouth;
 * `squint` closes the lids.
 * `browTo` with `browMix` 0..1 moves the brow line continuously from `brow` toward `browTo` (SS-R4 RT-2 occupant relax).
 * `tears` 0..1 paints tear streams under the eyes (0 or absent = none); `sweat` adds a sweat drop beside the forehead.
 */
export type FaceState = {brow: Brow; eyes: Eyes; look: Pt; mouth: Mouth; open?: number; squint?: number; browTo?: Brow; browMix?: number; tears?: number; sweat?: boolean};
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
export type HeadStyle = {skin: string; hair: string; cut: Cut; hood?: string; lines?: boolean; accent?: string; facial?: 'stubble' | 'mustache' | 'beard'; glasses?: boolean; brows?: string; look?: FaceLook};

/**
 * Front-view face drawing (user-approved for PEOPLE, 2 Nov 2026). `eye`: `almond` pointed corners with a lash line, `lidded` almond with a lid
 * crease, `hooded` a heavy upper lid with an outer wing (`wing: false` drops the wing); each has a coloured iris clipped to the eye and a catch-light.
 * `nose`: `hook` a small side curve, `ell` a bridge shadow ending in the nose base, `nostrils` two marks with a soft shadow.
 * `round` is a large child eye. `nose`: `hook` a small side curve, `ell` a bridge shadow ending in the nose base, `nostrils`
 * two marks with a soft shadow, `broad` wide nostrils with the wings drawn, `button` a small child nose.
 * `brow`: `arch`, `tapered` (thick head, thin tail) or `thick`; `browDrop` lowers every brow toward the eye (head units).
 * `mouth` redraws the closed mouths (`flat`, closed `talk`, `frown`): `line` a soft line with lifted corners, `lip` a lip line
 * with a lower-lip shadow, `full` tinted upper and lower lips, `thin` a short line with corner ticks; absent = the bare line.
 */
export type FaceLook = {eye: 'almond' | 'lidded' | 'hooded' | 'round'; wing?: boolean; nose: 'hook' | 'ell' | 'nostrils' | 'broad' | 'button'; brow: 'arch' | 'tapered' | 'thick'; browDrop: number; mouth?: 'line' | 'lip' | 'full' | 'thin'; iris?: string};

/** Head height (forehead top to chin) in head units K; chin below the centre. */
export const HEAD_SPAN = 2.27;
export const CHIN = 1.22;
export const BROW_Y: Record<Brow, [number, number]> = {flat: [-0.24, -0.24], up: [-0.33, -0.31], worry: [-0.34, -0.2], angry: [-0.16, -0.32], quirk: [-0.24, -0.24]};
/** Brow line heights of a face: the `brow` table entry, blended toward `browTo` by `browMix` when both are set. */
const browY = (face: FaceState): [number, number] => {
  const a = BROW_Y[face.brow];
  if (!face.browTo || !face.browMix) return a;
  const b = BROW_Y[face.browTo], u = face.browMix;
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
};
const WHITE = '#fbf7ee', MOUTH = '#3b2a24', AGE = '#8a5a43';
const TEAR = '#a9d6f0', TEAR_INK = '#5f9bc4';
/** A teardrop (point up) centred at (x, y), `s` head units tall 0.28. */
const sweatDrop = (x: number, y: number, s: number): Pt[] => [[x, y - 0.16 * s], [x + 0.06 * s, y - 0.02 * s], [x + 0.08 * s, y + 0.05 * s], [x + 0.04 * s, y + 0.11 * s], [x - 0.04 * s, y + 0.11 * s], [x - 0.08 * s, y + 0.05 * s], [x - 0.06 * s, y - 0.02 * s]];

export const headOutline = (n = 40): Pt[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * 6.283, s = Math.sin(a);
    return [Math.cos(a) * (1 - 0.07 * Math.max(0, s)), s < 0 ? 1.05 * s : 1.22 * s];
  });

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
  if (side.length) glaze(p, s + 1, mixColor(skin, VD18.shadow, 0.46), 205, side, {texture: 0.35, border: 0.45, bleed: 0.08});
  const xs = head.map((q) => q[0]), ys = head.map((q) => q[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const rx = (Math.max(...xs) - Math.min(...xs)) / 2, ry = (Math.max(...ys) - Math.min(...ys)) / 2;
  const k = Math.hypot(L.key[0], L.key[1]) || 1, kx = L.key[0] / k, ky = L.key[1] / k;
  const lit = head.map(([x, y]): Pt => [cx + (x - cx) * 0.84 - kx * 0.18 * rx, cy + (y - cy) * 0.84 - ky * 0.12 * ry]);
  solid(p, s + 7, skin, lit, 3, 0, 0.05); // texture 0: granulation would show what the head base holds (glaze rule)
  glaze(p, s + 8, skin, 160, head.map(([x, y]): Pt => [cx + (x - cx) * 0.93 - kx * 0.08 * rx, cy + (y - cy) * 0.93 - ky * 0.05 * ry]), {texture: 0.2, border: 0, bleed: 0.12});
  const jaw = planeBand(head, [0, 1], 0.86);
  if (jaw.length) glaze(p, s + 2, mixColor(skin, VD18.shadow, 0.3), 100, jaw, {texture: 0.3, border: 0.3, bleed: 0.06});
  cheeks.forEach(([x, y, rx, ry], i) => glaze(p, s + 3 + i, '#cf7a68', 42, ell(x, y, rx, ry, 16), {texture: 0.3, border: 0.1, bleed: 0.12}));
  const rim = planeBand(head, L.rim, 0, 0.07);
  if (rim.length) solid(p, s + 6, mixColor(skin, VD18.rimColor, 0.3 * rimScaleOf(L)), rim, 3, 0, 0.15);
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
  // Lash line: heavier upper lid, light partial lower lid.
  ink(upper, lk.eye === 'hooded' ? 2.4 : 1.8, 0.4, false, LID);
  ink(lower.slice(5), 0.7, 0.4, false);
  if (lk.eye === 'hooded' && lk.wing !== false) {
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

export const paintHeadFront = (p: Painter, seed: number, cx: number, cy: number, K: number, face: FaceState, style: HeadStyle, t: number, warm = 0, L?: InteriorLight) => {
  const P = ([u, v]: Pt): Pt => [cx + u * K, cy + v * K];
  const Q = (pts: Pt[]) => pts.map(P);
  let part = 0;
  const fill = (color: string, pts: Pt[], passes = 3, texture = 0.06) => solid(p, seed * 100 + ++part, color, Q(pts), passes, L ? 0 : texture, 0.2);
  let line = 0;
  const ink = (pts: Pt[], weight = 1.1, curve = 0.5, closed = false, color?: string) => inkLine(p, seed * 100 + ++line, Q(pts), {weight, curve, closed, color});
  const skin = toneOf(skinOf(style, warm), L);
  const hairC = toneOf(style.hair, L);
  const eyes: Eyes = blinking(t, seed) ? 'shut' : face.eyes;
  const [lx, ly] = face.look;
  const {cut} = style;
  const nc = isNewCut(cut) ? hairFront(cut) : null;

  // Behind the head: hood, bob to the jaw, long hair to the shoulders, or a bun on top.
  const back: Pt[] | null =
    cut === 'hood' ? ell(0, 0.0, 1.3, 1.42, 28)
    : cut === 'bob' ? [...Array.from({length: 17}, (_, i): Pt => [1.14 * Math.cos(Math.PI + (i / 16) * Math.PI), 1.16 * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]), [1.16, 0.7], [0.86, 0.78], [-0.86, 0.78], [-1.16, 0.7]]
    : cut === 'long' ? [...Array.from({length: 17}, (_, i): Pt => [1.16 * Math.cos(Math.PI + (i / 16) * Math.PI), 1.18 * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]), [1.2, 0.6], [1.26, 1.3], [1.12, 1.72], [0.72, 1.62], [-0.72, 1.62], [-1.12, 1.72], [-1.26, 1.3], [-1.2, 0.6]]
    : cut === 'tied' ? ell(0.05, -1.12, 0.32, 0.22, 18)
    : null;
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
  const hairs: Pt[][] = nc ? nc.hair : [legacyFrontHair(cut)];
  const hairFill = nc?.tone ? mixColor(hairC, skin, nc.tone) : hairC;
  // VD18: the fringe casts a soft band of shadow on the forehead (the hair shape, shifted down, under the hair fill).
  if (L && cut !== 'hood') hairs.forEach((hair, i) => glaze(p, 7_600_000 + seed + i, mixColor(skin, VD18.shadow, 0.36), 140, Q(hair.map(([u, v]): Pt => [u * 0.97, v + 0.12])), {texture: 0.3, border: 0.3, bleed: 0.06}));
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

  // Eyes: white almond + pupil offset by the look vector; squint lowers the upper lid.
  part = 30;
  line = 30;
  const sq = 1 - 0.6 * (face.squint ?? 0);
  const lk = style.look;
  for (const side of [-1, 1]) {
    const ex = side * 0.4, ey = 0.05;
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
    lookNose(lk, fill, ink, skin, lineOf(skin, L));
    line = 50;
  }
  if (style.facial) {
    const sp = part, sl = line;
    part = 60;
    line = 60;
    paintFacialFront(style.facial, {p, seed, Q, color: toneOf(style.hair, L), skin, L, fill, ink});
    part = sp;
    line = sl;
  }
  const my = 0.6;
  const m = face.mouth;
  const lookShut = lk ? lookMouth(lk, m, face.open ?? 0, my, fill, ink, skin, lineOf(skin, L)) : false;
  if (!lookShut && (m === 'flat' || (m === 'talk' && (face.open ?? 0) < 0.08))) ink([[-0.2, my], [0.2, my]], 1.3, 0);
  if (!lookShut && m === 'frown') ink([[-0.18, my + 0.05], [0, my - 0.03], [0.18, my + 0.05]], 1.4, 0.8);
  if (m === 'wavy') ink(Array.from({length: 9}, (_, i): Pt => [-0.24 + i * 0.06, my + (i % 2 ? 0.035 : -0.01)]), 1.2, 0.6);
  if (m === 'smile') {
    const pts: Pt[] = [[-0.3, my - 0.06], [0.3, my - 0.06]];
    for (let i = 1; i < 12; i++) pts.push([0.3 * Math.cos((i / 12) * Math.PI), my - 0.06 + 0.2 * Math.sin((i / 12) * Math.PI)]);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.2, true);
  }
  if (m === 'o' || m === 'gasp' || (m === 'talk' && (face.open ?? 0) >= 0.08)) {
    const o = face.open ?? 1;
    const pts = m === 'o' ? ell(0, my + 0.03, 0.11, 0.13, 16) : m === 'gasp' ? ell(0, my + 0.02, 0.15, 0.07, 16) : ell(0, my + 0.02, 0.13, 0.02 + 0.08 * o, 16);
    fill(MOUTH, pts, 4);
    ink(pts, 1.0, 0.4, true);
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
    const pts = ell(0, my + 0.1, 0.2, 0.08 + 0.12 * (face.open ?? 1), 20);
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
  // Tear streams and a sweat drop (expressions.ts); drawn only when the face asks, ids above every other part.
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
  const fill = (color: string, pts: Pt[], passes = 4) => solid(p, seed * 100 + ++part, color, Q(pts), passes, L ? 0 : 0.06, 0.2);
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
  const head = headOutline();
  fill(skin, head, 8);
  if (L) faceModel(p, seed, skin, Q(head), L, [[cx + dir * 0.55 * K, cy + 0.36 * K, 0.2 * K, 0.11 * K]]);
  fill(skin, [[0.9, 0.1], [1.13, 0.34], [0.95, 0.43]], 4); // nose
  ink(head, 1.0, 0.15, true, lineOf(skin, L));
  ink([[0.9, 0.1], [1.13, 0.34], [0.95, 0.43]], 1.0, 0.15, false, lineOf(skin, L));
  part = 12;
  line = 10;
  if (cut === 'hood') {
    const hood: Pt[] = [...Array.from({length: 25}, (_, i): Pt => {
      const a = 1.25 + ((5.08 - 1.25) * i) / 24;
      return [-0.12 + 1.14 * Math.cos(a), 1.3 * Math.sin(a)];
    }), [0.5, -1.0], [0.66, -0.55], [0.62, 0.25], [0.45, 0.95]];
    fill(style.hood ?? style.hair, hood, 6);
    ink(hood);
    fill(style.hair, [[0.58, -0.78], [0.88, -0.5], [0.72, -0.42], [0.6, -0.42]], 6);
  } else if (cut === 'bob') {
    const bob: Pt[] = [[0.8, -0.42], ...arc(1.12, -1.0, -Math.PI), [-1.14, 0.6], [-1.0, 0.8], [0.1, 0.8], [0.22, 0.3], [0.3, -0.3]];
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
  const eyes: Eyes = blinking(t, seed) ? 'shut' : face.eyes;
  const [lx, ly] = face.look;
  if (eyes === 'shut') ink([[0.5, 0.05], [0.62, 0.1], [0.74, 0.05]], 1.4, 0.5, false);
  else {
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
    paintFacialSide(style.facial, {p, seed, Q, color: toneOf(style.hair, L), skin, L, fill, ink: (pts, w, c, closed, col) => ink(pts, w, c, closed, col)});
    part = sp;
    line = sl;
  }
  const m = face.mouth, o = face.open ?? 0;
  if (m === 'smile') fill(MOUTH, [[0.66, 0.56], [0.95, 0.54], [0.9, 0.66], [0.78, 0.7], [0.7, 0.64]], 4);
  else if (m === 'grin') {
    fill(MOUTH, [[0.58, 0.52], [0.94, 0.5], [0.9, 0.7], [0.78, 0.8], [0.64, 0.74]], 4);
    fill(WHITE, [[0.62, 0.53], [0.92, 0.51], [0.91, 0.6], [0.64, 0.62]], 3);
  } else if (m === 'smirk') ink([[0.7, 0.66], [0.84, 0.66], [0.96, 0.58]], 1.3, 0.5, false);
  else if (m === 'shout') fill(MOUTH, ell(0.76, 0.66, 0.07 + 0.03 * (face.open ?? 1), 0.08 + 0.1 * (face.open ?? 1), 14), 4);
  else if (m === 'frown') ink([[0.7, 0.66], [0.8, 0.6], [0.92, 0.64]], 1.4, 0.6, false);
  else if (m === 'wavy') ink([[0.7, 0.62], [0.76, 0.59], [0.82, 0.63], [0.88, 0.59], [0.93, 0.62]], 1.1, 0.5, false);
  else if (m === 'o' || m === 'gasp' || (m === 'talk' && o >= 0.08)) fill(MOUTH, ell(0.84, 0.62, 0.08, 0.03 + 0.06 * (m === 'talk' ? o : 1), 12), 4);
  else ink([[0.72, 0.62], [0.93, 0.62]], 1.2, 0, false);
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
