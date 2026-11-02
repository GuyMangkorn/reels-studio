import {INK, ell, inkLine, solid} from './draw';
import {hash} from './hash';
import {mixColor, type Painter, type Pt} from './painter';

// Central animal library: dogs (small and big) and cats (several coats) for the painted kit, drawn with the same washes and
// rotring ink as the people rig, so a shot picks an id instead of designing a pet. Added 2 Nov 2026 (user request).
//
// How to use
// - `drawAnimal(p, seed, ANIMALS['dog-golden'], g, unit, {view: 'left', state: 'sit'}, t)`: `g` is the ground point under the
//   body centre in px, `unit` px per metre (the same `unit` drawFigure takes, so a dog stands at its true size beside a person).
// - Views `left`, `right` (profile) and `front`; states `stand`, `sit`, `lie`. Like the people rig each view is a flat card:
//   a turn is a cut or crossfade between views.
// - Walk: pass `walk` (seconds into the walk, profile `stand` only) and move `g` at `animalWalkSpeed(def)` m/s toward the facing
//   side; the planted paws then do not slide. `wag` 0..1 wags a dog's tail; cats sway the tail on their own clock.
// - `mouth: 'open'` pants (dog, tongue out) or meows (cat). Eyes blink on the animal's own clock (`animalBlink`).
// - Proportions are in shoulder heights (`height`, m), so one drawing serves a chihuahua and a retriever.
// - Motions: animal-motions.ts (`animalMotion`), reel KIT-ANIMAL-MOTIONS. Sheet: KIT-ANIMALS (animals-sheet.tsx). Seeds 900-990 are reserved for this library.

export type AnimalView = 'left' | 'right' | 'front';
export type AnimalState = 'stand' | 'sit' | 'lie';
/**
 * `state` the body state; with `from` and `blend` 0..1 the body moves from `from` to `state` (sit-down, lie-down, get-up).
 * `walk` seconds on the gait clock (stand only; `gait` 'walk' or 'run'), `stride` 0..1 scales the leg swing (a walk easing to a
 * stop). `sniff` 0..1 lowers the head to the ground. `wag` 0..1 wags a dog's tail. `mouth: 'open'` pants, barks or meows.
 */
export type AnimalPose = {
  view: AnimalView; state?: AnimalState; from?: AnimalState; blend?: number;
  walk?: number; gait?: AnimalGait; stride?: number; sniff?: number; wag?: number; mouth?: 'closed' | 'open';
};
export type AnimalGait = 'walk' | 'run';

export type AnimalDef = {
  kind: 'dog' | 'cat';
  /** Shoulder height, m. */
  height: number;
  coat: string;
  /** Chest, belly and muzzle colour (`chest`, `tuxedo`), or the base colour of a `calico`. */
  light?: string;
  /** Stripes (`tabby`), points (`points`), saddle-free patches (`calico`, second colour). */
  dark?: string;
  pattern: 'solid' | 'chest' | 'tabby' | 'points' | 'tuxedo' | 'calico';
  ears: 'prick' | 'big' | 'flop' | 'cat';
  tail: 'curl' | 'plume' | 'whip' | 'otter' | 'sickle' | 'cat';
  /** Muzzle length, 1 = a retriever. */
  muzzle: number;
  /** Head size relative to the body, 1 = a retriever (small breeds have big heads). */
  head: number;
  /** Body girth, 1 = normal. */
  build: number;
  fluffy?: boolean;
  /** Iris colour. */
  eye: string;
  seed: number;
};

export const ANIMAL_IDS = [
  'dog-chihuahua', 'dog-pom', 'dog-thai', 'dog-golden', 'dog-black-lab',
  'cat-orange-tabby', 'cat-gray-tabby', 'cat-black', 'cat-white', 'cat-siamese', 'cat-calico', 'cat-tuxedo',
] as const;
export type AnimalId = (typeof ANIMAL_IDS)[number];

const dog = (d: Omit<AnimalDef, 'kind'>): AnimalDef => ({kind: 'dog', ...d});
const cat = (d: Omit<AnimalDef, 'kind' | 'ears' | 'tail' | 'muzzle' | 'head' | 'build'> & Partial<AnimalDef>): AnimalDef =>
  ({kind: 'cat', ears: 'cat', tail: 'cat', muzzle: 0.4, head: 1, build: 1, ...d});

export const ANIMALS: Record<AnimalId, AnimalDef> = {
  'dog-chihuahua': dog({height: 0.2, coat: '#c99a62', light: '#ecd2a8', pattern: 'chest', ears: 'big', tail: 'whip', muzzle: 0.55, head: 1.45, build: 0.85, eye: '#2a1a12', seed: 901}),
  'dog-pom': dog({height: 0.22, coat: '#d98a3c', light: '#f1c48a', pattern: 'chest', ears: 'prick', tail: 'curl', muzzle: 0.45, head: 1.3, build: 1.2, fluffy: true, eye: '#2a1a12', seed: 902}),
  'dog-thai': dog({height: 0.5, coat: '#b8834f', light: '#e2c49a', pattern: 'chest', ears: 'prick', tail: 'sickle', muzzle: 0.95, head: 1, build: 0.85, eye: '#3a2414', seed: 903}),
  'dog-golden': dog({height: 0.58, coat: '#d9a957', light: '#efd29a', pattern: 'chest', ears: 'flop', tail: 'plume', muzzle: 1, head: 1, build: 1.05, fluffy: true, eye: '#3a2414', seed: 904}),
  'dog-black-lab': dog({height: 0.58, coat: '#2e2a2a', pattern: 'solid', ears: 'flop', tail: 'otter', muzzle: 1, head: 1, build: 1.1, eye: '#5a3a1a', seed: 905}),
  'cat-orange-tabby': cat({height: 0.25, coat: '#e09a4c', dark: '#b8632a', light: '#f4d6aa', pattern: 'tabby', eye: '#c9a43a', seed: 911}),
  'cat-gray-tabby': cat({height: 0.25, coat: '#9a9690', dark: '#4e4a48', light: '#d8d4cc', pattern: 'tabby', eye: '#8fae4a', seed: 912}),
  'cat-black': cat({height: 0.25, coat: '#26232a', pattern: 'solid', eye: '#d9b23a', seed: 913}),
  'cat-white': cat({height: 0.24, coat: '#f2eee6', pattern: 'solid', eye: '#6aa7d6', fluffy: true, seed: 914}),
  'cat-siamese': cat({height: 0.25, coat: '#eadcc4', dark: '#4a3428', pattern: 'points', eye: '#4f8fd0', build: 0.9, seed: 915}),
  'cat-calico': cat({height: 0.24, coat: '#d98a3c', dark: '#2e2a2a', light: '#f4efe6', pattern: 'calico', eye: '#c9a43a', seed: 916}),
  'cat-tuxedo': cat({height: 0.25, coat: '#26232a', light: '#f4efe6', pattern: 'tuxedo', eye: '#8fae4a', seed: 917}),
};

export type AnimalInfo = {description: string; use: string};

export const ANIMAL_INFO: Record<AnimalId, AnimalInfo> = {
  'dog-chihuahua': {description: 'Tiny tan chihuahua, big upright ears, short muzzle, thin tail (0.20 m).', use: 'Small house dog, a lap dog, comic nervous pet.'},
  'dog-pom': {description: 'Fluffy orange pomeranian, small ears, tail curled over the back (0.22 m).', use: 'Cute small pet, a condo dog, a gift puppy.'},
  'dog-thai': {description: 'Thai street dog (หมาไทย): lean tan body, upright ears, sickle tail (0.50 m).', use: 'Soi dog, temple dog, village guard dog.'},
  'dog-golden': {description: 'Golden retriever: big, feathered gold coat, floppy ears, plume tail (0.58 m).', use: 'Family dog, friendly big dog, rescue or guide dog.'},
  'dog-black-lab': {description: 'Black labrador: big, short black coat, floppy ears, thick otter tail (0.58 m).', use: 'Big dog in a night or mystery scene, a police or guard dog.'},
  'cat-orange-tabby': {description: 'Orange tabby cat with darker stripes and a pale chin, amber eyes.', use: 'Ordinary house cat, the default cat.'},
  'cat-gray-tabby': {description: 'Gray tabby cat with dark stripes, green eyes.', use: 'Street cat, a neighbour\'s cat.'},
  'cat-black': {description: 'All-black cat with yellow eyes.', use: 'Mystery, omen or ghost-story cat; night scenes.'},
  'cat-white': {description: 'Fluffy white cat with blue eyes.', use: 'Rich-house pet, a calm or elegant cat; a pale shape in the dark.'},
  'cat-siamese': {description: 'Siamese (วิเชียรมาศ): cream body, dark brown ears, face, legs and tail, blue eyes.', use: 'Thai heritage cat, a lucky cat, an older person\'s pet.'},
  'cat-calico': {description: 'Calico (three-colour) cat: white with orange and black patches.', use: 'Lucky shop cat, a colourful stray.'},
  'cat-tuxedo': {description: 'Tuxedo cat: black with a white chest, paws and muzzle.', use: 'Smart or cheeky cat, a café cat.'},
};

/**
 * Gaits in shoulder heights: `period` s per cycle (small animals step faster), `stride` paw travel, `stance` planted share of the
 * cycle, `lift` paw lift, `phases` per leg (far back, far front, near back, near front). The walk is a lateral-sequence walk;
 * the run a rotary gallop (hind pair, then fore pair) with the spine gathering and stretching.
 */
const GAITS: Record<AnimalGait, {period: (h: number) => number; stride: number; stance: number; lift: number; phases: [number, number, number, number]}> = {
  walk: {period: (h) => 0.45 + 0.7 * h, stride: 0.55, stance: 0.6, lift: 0.12, phases: [0, 0.25, 0.5, 0.75]},
  run: {period: (h) => 0.3 + 0.45 * h, stride: 1.0, stance: 0.35, lift: 0.2, phases: [0.08, 0.58, 0, 0.5]},
};
/** Seconds per gait cycle. */
export const animalGaitPeriod = (def: AnimalDef, gait: AnimalGait = 'walk') => GAITS[gait].period(def.height);
/** Metres the body travels per gait cycle. */
export const animalCycleLength = (def: AnimalDef, gait: AnimalGait = 'walk') => (GAITS[gait].stride * def.height) / GAITS[gait].stance;
/** Ground speed, m/s, of a gait (move `g` this fast so the planted paws hold still). */
export const animalWalkSpeed = (def: AnimalDef, gait: AnimalGait = 'walk') => animalCycleLength(def, gait) / animalGaitPeriod(def, gait);
/** True while the eyes are shut (about 0.12 s every 2.5-3.5 s). */
export const animalBlink = (t: number, seed: number) => (t / (2.5 + hash(seed) * 1.0) + hash(seed + 3)) % 1 < 0.04;

type UV = [number, number];
const add = (a: UV, b: UV): UV => [a[0] + b[0], a[1] + b[1]];
/** Paw offset (du, dv) of one leg at gait phase `ph` (cycles): planted and sliding back for the stance, then a lifted swing. */
const pawStep = (ph: number, gait: AnimalGait): UV => {
  const {stride: S, stance, lift} = GAITS[gait];
  const f = ((ph % 1) + 1) % 1;
  if (f < stance) return [S / 2 - S * (f / stance), 0];
  const s = (f - stance) / (1 - stance), e = s * s * (3 - 2 * s);
  return [-S / 2 + S * e, lift * Math.sin(Math.PI * s)];
};
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease01 = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const lerpUV = (a: UV, b: UV, u: number): UV => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
/** Linear blend of two rigs of the same shape (numbers, points, point lists). */
const lerpRig = <T,>(a: T, b: T, u: number): T => {
  if (typeof a === 'number') return (a + ((b as number) - a) * u) as T;
  if (Array.isArray(a)) return a.map((x, i) => lerpRig(x, (b as unknown[])[i], u)) as T;
  const o: Record<string, unknown> = {};
  for (const k of Object.keys(a as object)) o[k] = lerpRig((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], u);
  return o as T;
};
/** `n` points evenly spaced by arc length along a polyline (tails of different states blend point by point). */
const resample = (pts: UV[], n: number): UV[] => {
  const d = [0];
  for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[d.length - 1] || 1;
  return Array.from({length: n}, (_, j): UV => {
    const x = (L * j) / (n - 1);
    let i = 1;
    while (i < pts.length - 1 && d[i] < x) i++;
    const w = (x - d[i - 1]) / ((d[i] - d[i - 1]) || 1);
    return lerpUV(pts[i - 1], pts[i], Math.max(0, Math.min(1, w)));
  });
};
type ProfRig = {hip: UV; sh: UV; H: UV; tail: UV[]; fb: UV[]; ff: UV[]; nb: UV[]; nf: UV[]; haunch: number};
type FrontRig = {chest: UV; chestR: UV; H: UV; tail: UV[]; fl: UV[]; fr: UV[]; back: number; haunch: number};
/** A polygon around a centreline with a width per point (tapered legs and tails). */
const tube = (pts: UV[], widths: number[]): UV[] => {
  const n = pts.length, L: UV[] = [], R: UV[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, w = widths[Math.min(i, widths.length - 1)] / 2;
    L.push([pts[i][0] - (dy / len) * w, pts[i][1] + (dx / len) * w]);
    R.push([pts[i][0] + (dy / len) * w, pts[i][1] - (dx / len) * w]);
  }
  return [...L, ...R.reverse()];
};
const taper = (n: number, w0: number, w1: number) => Array.from({length: n}, (_, i) => w0 + (w1 - w0) * (i / Math.max(1, n - 1)));
const ellUV = (c: UV, rx: number, ry: number, a = 0, n = 18): UV[] => ell(c[0], c[1], rx, ry, n, a) as UV[];
/** Fur outline: every edge gets a tuft pushed out from the centroid. */
const fluff = (pts: UV[], amp: number, id: number): UV[] => {
  const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
  return pts.flatMap((q, i): UV[] => {
    const r = pts[(i + 1) % pts.length], m: UV = [(q[0] + r[0]) / 2, (q[1] + r[1]) / 2];
    const dx = m[0] - cx, dy = m[1] - cy, d = Math.hypot(dx, dy) || 1, k = amp * (0.6 + 0.8 * hash(id + i));
    return [q, [m[0] + (dx / d) * k, m[1] + (dy / d) * k]];
  });
};
const rotAbout = (o: UV, a: number) => ([u, v]: UV): UV => [o[0] + (u - o[0]) * Math.cos(a) - (v - o[1]) * Math.sin(a), o[1] + (u - o[0]) * Math.sin(a) + (v - o[1]) * Math.cos(a)];

/** Tail centrelines in shoulder heights from the tail root, for stand / sit / lie. */
const TAILS: Record<AnimalDef['tail'], {stand: UV[]; sit: UV[]; lie: UV[]; w: [number, number]}> = {
  curl: {stand: [[0, 0], [-0.1, 0.14], [-0.04, 0.3], [0.12, 0.33], [0.2, 0.24]], sit: [[0, 0], [-0.1, 0.12], [-0.04, 0.26], [0.1, 0.28]], lie: [[0, 0], [-0.1, 0.12], [-0.02, 0.24], [0.12, 0.22]], w: [0.12, 0.08]},
  plume: {stand: [[0, 0], [-0.16, -0.04], [-0.32, -0.08], [-0.46, -0.06], [-0.56, 0.02]], sit: [[0, 0], [-0.12, -0.1], [-0.26, -0.18], [-0.42, -0.2]], lie: [[0, 0], [-0.18, -0.06], [-0.36, -0.1], [-0.54, -0.1]], w: [0.11, 0.08]},
  whip: {stand: [[0, 0], [-0.14, 0.08], [-0.26, 0.16], [-0.34, 0.24]], sit: [[0, 0], [-0.1, -0.08], [-0.2, -0.14], [-0.32, -0.16]], lie: [[0, 0], [-0.14, -0.04], [-0.28, -0.06], [-0.4, -0.04]], w: [0.07, 0.02]},
  otter: {stand: [[0, 0], [-0.16, 0.02], [-0.32, 0.02], [-0.46, 0.06]], sit: [[0, 0], [-0.12, -0.1], [-0.26, -0.16], [-0.4, -0.18]], lie: [[0, 0], [-0.18, -0.04], [-0.36, -0.06], [-0.5, -0.04]], w: [0.13, 0.04]},
  sickle: {stand: [[0, 0], [-0.1, 0.14], [-0.12, 0.3], [-0.02, 0.42]], sit: [[0, 0], [-0.12, -0.08], [-0.26, -0.12], [-0.4, -0.1]], lie: [[0, 0], [-0.16, -0.04], [-0.32, -0.06], [-0.46, -0.02]], w: [0.09, 0.03]},
  cat: {stand: [[0, 0], [-0.16, 0], [-0.3, 0.08], [-0.38, 0.26], [-0.36, 0.46], [-0.28, 0.54]], sit: [[0, 0], [0, -0.16], [0.14, -0.26], [0.34, -0.28], [0.5, -0.24]], lie: [[0, 0], [-0.18, -0.06], [-0.36, -0.08], [-0.5, -0.02], [-0.56, 0.08]], w: [0.09, 0.06]},
};

/**
 * Paints one animal. `g` ground point (px) under the body centre, `unit` px per metre, `pose` view/state/walk/wag/mouth,
 * `t` the plate clock (breathing, blink, cat tail sway). Pure function of its arguments.
 */
export const drawAnimal = (p: Painter, seed: number, def: AnimalDef, g: Pt, unit: number, pose: AnimalPose, t: number) => {
  const s = def.height * unit, isCat = def.kind === 'cat';
  const state = pose.state ?? 'stand';
  const dir = pose.view === 'left' ? -1 : 1;
  const front = pose.view === 'front';
  const Q = (pts: UV[]): Pt[] => pts.map(([u, v]): Pt => [g[0] + (front ? u : dir * u) * s, g[1] - v * s]);
  let n = 0;
  const outline = (c: string) => mixColor(c, INK, 0.55);
  /** Legs and paws: a darker shade of the fur instead of the ink line (user, 2 Nov 2026). */
  const furLine = (c: string) => mixColor(c, INK, 0.28);
  const fill = (c: string, pts: UV[], passes = 4) => solid(p, seed * 1000 + ++n, c, Q(pts), passes, 0.07, 0.2);
  const ink = (pts: UV[], c: string, weight = 1.0, closed = true, curve = 0.15, soft = false) =>
    inkLine(p, seed * 1000 + 500 + ++n, Q(pts), {color: soft ? furLine(c) : outline(c), weight: weight * Math.min(1.4, Math.max(0.6, s / 120)), closed, curve});
  const part = (c: string, pts: UV[], fur = false, soft = false) => {
    const q = fur && def.fluffy ? fluff(pts, 0.035, seed + n) : pts;
    fill(c, q);
    ink(q, c, 1.0, true, 0.15, soft);
  };
  const leg = (c: string, pts: UV[], fur = false) => part(c, pts, fur, true);

  const coat = def.pattern === 'calico' ? def.light ?? '#f4efe6' : def.coat;
  const far = mixColor(coat, '#3a2a40', 0.28);
  const light = def.light ?? coat;
  const dark = def.dark ?? mixColor(def.coat, INK, 0.4);
  const points = def.pattern === 'points';
  const limbC = points ? dark : coat;
  const breathe = 1 + (pose.mouth === 'open' && !isCat ? 0.03 * Math.sin(t * 2 * Math.PI * 3) : 0.015 * Math.sin((t * 2 * Math.PI) / 2.6));
  const blink = animalBlink(t, seed);
  const wagA = isCat ? 0.12 * Math.sin((t * 2 * Math.PI) / 2.2 + hash(seed) * 6) : (pose.wag ?? 0) * 0.45 * Math.sin(t * 2 * Math.PI * 3.2);
  const hs = def.head * (isCat ? 1.05 : 1);

  // ------------------------------------------------------------------------------------------ head (both views share it)
  const headSide = (H: UV) => {
    const r: [number, number] = [0.2 * hs, 0.18 * hs];
    const ear = (farEar: boolean) => {
      const o: UV = farEar ? [0.05 * hs, 0] : [0, 0];
      const c = farEar ? mixColor(points ? dark : coat, '#3a2a40', 0.25) : points ? dark : coat;
      if (def.ears === 'flop') {
        if (!farEar) part(mixColor(coat, INK, 0.08), [add(H, [-0.06 * hs, 0.14 * hs]), add(H, [0.04 * hs, 0.12 * hs]), add(H, [0.0, -0.06 * hs]), add(H, [-0.08 * hs, -0.16 * hs]), add(H, [-0.14 * hs, -0.06 * hs])], true);
        return;
      }
      const k = def.ears === 'big' ? 1.7 : isCat ? 0.95 : 1;
      part(c, [add(H, add(o, [-0.13 * hs, 0.1 * hs])), add(H, add(o, [-0.08 * hs, (0.12 + 0.22 * k) * hs])), add(H, add(o, [0.04 * hs, 0.14 * hs]))]);
      if (!farEar) fill(mixColor(c, '#e8a0a0', 0.45), [add(H, [-0.1 * hs, 0.13 * hs]), add(H, [-0.08 * hs, (0.12 + 0.17 * k) * hs]), add(H, [0.0, 0.15 * hs])], 3);
    };
    ear(true);
    const mz = def.muzzle;
    const skull = ellUV(H, r[0], r[1]);
    const muzzle: UV[] = isCat
      ? ellUV(add(H, [0.15 * hs, -0.07 * hs]), 0.09 * hs, 0.07 * hs)
      : tube([add(H, [0.04 * hs, -0.04 * hs]), add(H, [(0.08 + 0.22 * mz) * hs, -0.07 * hs])], [0.2 * hs, 0.13 * hs]);
    part(points ? light : coat, skull, true);
    const mzC = points ? dark : def.pattern === 'chest' || def.pattern === 'tuxedo' || def.pattern === 'tabby' ? light : coat;
    part(mzC, muzzle);
    if (points) fill(dark, ellUV(add(H, [0.08 * hs, -0.03 * hs]), 0.12 * hs, 0.11 * hs), 3);
    if (def.pattern === 'tabby') for (const k of [0, 1, 2]) ink([add(H, [(-0.06 + 0.05 * k) * hs, 0.17 * hs]), add(H, [(-0.05 + 0.05 * k) * hs, 0.09 * hs])], dark, 1.2, false, 0);
    if (def.pattern === 'calico') fill(def.dark ?? INK, ellUV(add(H, [-0.06 * hs, 0.06 * hs]), 0.1 * hs, 0.09 * hs), 3);
    if (def.pattern === 'calico') fill(def.coat, ellUV(add(H, [0.06 * hs, 0.1 * hs]), 0.07 * hs, 0.06 * hs), 3);
    ear(false);
    // Nose, mouth, eye.
    const tip: UV = isCat ? add(H, [0.23 * hs, -0.04 * hs]) : add(H, [(0.12 + 0.22 * mz) * hs, -0.04 * hs]);
    fill(isCat ? '#d98a8a' : '#2a2224', ellUV(tip, (isCat ? 0.025 : 0.04) * hs, (isCat ? 0.02 : 0.035) * hs, 0, 10), 4);
    const mouthY = isCat ? -0.11 : -0.1;
    if (pose.mouth === 'open') {
      const m0 = add(tip, [-0.02 * hs, (mouthY + 0.04) * hs]);
      fill('#5a2a2a', [m0, add(m0, [-0.12 * hs, -0.02 * hs]), add(m0, [-0.04 * hs, -0.08 * hs])], 4);
      if (!isCat) part('#e0707a', tube([add(m0, [-0.05 * hs, -0.04 * hs]), add(m0, [-0.03 * hs, -0.14 * hs])], [0.07 * hs, 0.06 * hs]));
    } else ink([add(tip, [-0.01 * hs, -0.04 * hs]), add(tip, [-0.05 * hs, (mouthY + 0.02) * hs]), add(tip, [-0.12 * hs, (mouthY + 0.03) * hs])], INK, 1.0, false, 0.4);
    if (isCat) for (const dy of [-0.01, -0.04]) ink([add(tip, [-0.04 * hs, (dy - 0.02) * hs]), add(tip, [0.14 * hs, (dy + 0.01) * hs])], '#f4efe6', 0.7, false, 0.3);
    const E = add(H, [(isCat ? 0.08 : 0.06) * hs, 0.04 * hs]);
    if (blink) ink([add(E, [-0.04 * hs, 0]), add(E, [0.04 * hs, -0.005 * hs])], INK, 1.2, false, 0);
    else if (isCat) {
      const eye = ellUV(E, 0.045 * hs, 0.035 * hs, 0, 12);
      fill(def.eye, eye, 4);
      fill(INK, ellUV(add(E, [0.01 * hs, 0]), 0.01 * hs, 0.03 * hs, 0, 8), 4);
      ink(eye, INK, 1.0);
    } else {
      fill(INK, ellUV(E, 0.032 * hs, 0.03 * hs, 0, 10), 5);
      fill('#fbf7ee', ellUV(add(E, [0.01 * hs, 0.01 * hs]), 0.009 * hs, 0.009 * hs, 0, 6), 3);
    }
  };

  const headFront = (H: UV) => {
    const r: [number, number] = [0.21 * hs, 0.19 * hs];
    const earC = points ? dark : coat;
    for (const sd of [-1, 1]) {
      if (def.ears === 'flop') {
        part(mixColor(coat, INK, 0.08), [[H[0] + sd * 0.12 * hs, H[1] + 0.15 * hs], [H[0] + sd * 0.25 * hs, H[1] + 0.08 * hs], [H[0] + sd * 0.27 * hs, H[1] - 0.12 * hs], [H[0] + sd * 0.2 * hs, H[1] - 0.16 * hs], [H[0] + sd * 0.15 * hs, H[1] - 0.02 * hs]], true);
        continue;
      }
      const k = def.ears === 'big' ? 1.6 : isCat ? 0.9 : 1, spread = def.ears === 'big' ? 0.12 : 0.04;
      const ear: UV[] = [[H[0] + sd * 0.04 * hs, H[1] + 0.15 * hs], [H[0] + sd * (0.18 + spread) * hs, H[1] + (0.14 + 0.22 * k) * hs], [H[0] + sd * 0.21 * hs, H[1] + 0.06 * hs]];
      part(earC, ear);
      fill(mixColor(earC, '#e8a0a0', 0.45), [[H[0] + sd * 0.08 * hs, H[1] + 0.14 * hs], [H[0] + sd * (0.17 + spread) * hs, H[1] + (0.13 + 0.16 * k) * hs], [H[0] + sd * 0.18 * hs, H[1] + 0.09 * hs]], 3);
    }
    part(points ? light : coat, ellUV(H, r[0], r[1]), true);
    if (def.pattern === 'tabby') for (const dx of [-0.05, 0, 0.05]) ink([[H[0] + dx * hs, H[1] + 0.17 * hs], [H[0] + dx * 0.8 * hs, H[1] + 0.09 * hs]], dark, 1.2, false, 0);
    if (def.pattern === 'calico') fill(def.dark ?? INK, ellUV([H[0] - 0.09 * hs, H[1] + 0.08 * hs], 0.1 * hs, 0.09 * hs), 3);
    if (def.pattern === 'calico') fill(def.coat, ellUV([H[0] + 0.1 * hs, H[1] + 0.1 * hs], 0.08 * hs, 0.07 * hs), 3);
    const M: UV = [H[0], H[1] - (isCat ? 0.07 : 0.08) * hs];
    const mzC = points ? dark : def.pattern === 'solid' || def.pattern === 'calico' ? coat : light;
    const mzW = isCat ? 0.09 : 0.08 + 0.05 * Math.min(1, def.muzzle);
    if (points) fill(dark, ellUV([H[0], H[1] - 0.02 * hs], 0.14 * hs, 0.13 * hs), 3);
    if (mzC !== coat || !isCat) part(mzC, ellUV(M, mzW * hs, (isCat ? 0.06 : 0.08) * hs));
    const nose: UV = [M[0], M[1] + 0.03 * hs];
    fill(isCat ? '#d98a8a' : '#2a2224', isCat ? [[nose[0] - 0.025 * hs, nose[1] + 0.01 * hs], [nose[0] + 0.025 * hs, nose[1] + 0.01 * hs], [nose[0], nose[1] - 0.015 * hs]] : ellUV(nose, 0.045 * hs, 0.03 * hs, 0, 10), 4);
    if (pose.mouth === 'open') {
      fill('#5a2a2a', ellUV([M[0], M[1] - 0.05 * hs], 0.05 * hs, 0.035 * hs, 0, 10), 4);
      if (!isCat) part('#e0707a', tube([[M[0], M[1] - 0.05 * hs], [M[0], M[1] - 0.15 * hs]], [0.07 * hs, 0.06 * hs]));
    } else for (const sd of [-1, 1]) ink([[nose[0], nose[1] - 0.02 * hs], [nose[0] + sd * 0.01 * hs, nose[1] - 0.05 * hs], [nose[0] + sd * 0.05 * hs, nose[1] - 0.05 * hs]], INK, 1.0, false, 0.4);
    if (isCat) for (const sd of [-1, 1]) for (const dy of [0, -0.03]) ink([[M[0] + sd * 0.06 * hs, M[1] + dy * hs], [M[0] + sd * 0.24 * hs, M[1] + (dy + 0.02 + dy) * hs]], '#f4efe6', 0.7, false, 0.3);
    for (const sd of [-1, 1]) {
      const E: UV = [H[0] + sd * 0.085 * hs, H[1] + 0.04 * hs];
      if (blink) ink([[E[0] - 0.035 * hs, E[1]], [E[0] + 0.035 * hs, E[1]]], INK, 1.2, false, 0);
      else if (isCat) {
        const eye = ellUV(E, 0.045 * hs, 0.038 * hs, 0, 12);
        fill(def.eye, eye, 4);
        fill(INK, ellUV(E, 0.012 * hs, 0.032 * hs, 0, 8), 4);
        ink(eye, INK, 1.0);
      } else {
        fill(INK, ellUV(E, 0.032 * hs, 0.032 * hs, 0, 10), 5);
        fill('#fbf7ee', ellUV([E[0] + 0.01 * hs, E[1] + 0.01 * hs], 0.009 * hs, 0.009 * hs, 0, 6), 3);
      }
    }
  };

  const tailLine = (root: UV, st: AnimalState): UV[] => {
    const k = isCat ? 1 : def.tail === 'curl' ? 0.8 : 1;
    return resample(TAILS[def.tail][st].map(([u, v]): UV => [root[0] + u * k, root[1] + v * k]), 7);
  };
  const gait = pose.gait ?? 'walk', amp = clamp(pose.stride ?? 1), moving = pose.walk !== undefined;
  const ph = moving ? (pose.walk as number) / animalGaitPeriod(def, gait) : 0;
  const profRig = (st: AnimalState): ProfRig => {
    if (st === 'stand') {
      let hip: UV = [-0.42, isCat ? 0.8 : 0.78], sh: UV = [0.36, isCat ? 0.74 : 0.82];
      if (moving && gait === 'walk') {
        const bob = 0.02 * amp * Math.cos(ph * 4 * Math.PI);
        hip = add(hip, [0, bob]);
        sh = add(sh, [0, bob]);
      } else if (moving) {
        const a = 2 * Math.PI * ph;
        hip = add(hip, [-0.05 * amp * Math.cos(a), 0.06 * amp * Math.sin(a)]);
        sh = add(sh, [0.05 * amp * Math.cos(a), -0.06 * amp * Math.sin(a)]);
      }
      const step = (i: number): UV => { const [du, dv] = moving ? pawStep(ph + GAITS[gait].phases[i], gait) : [0, 0]; return [du * amp, dv * amp]; };
      const fore = ([du, dv]: UV): UV[] => [add(sh, [0.02, -0.12]), [sh[0] + 0.04 + du * 0.3, 0.42 + dv * 0.5], [sh[0] + 0.06 + du * 0.85, 0.1 + dv], [sh[0] + 0.06 + du, dv]];
      const hind = ([du, dv]: UV): UV[] => [add(hip, [0.04, -0.1]), [hip[0] + 0.14 + du * 0.3, 0.44 + dv * 0.4], [hip[0] - 0.06 + du * 0.8, 0.2 + dv], [hip[0] + du, dv]];
      return {hip, sh, H: add(sh, [0.34, isCat ? 0.34 : 0.4]), tail: tailLine(add(hip, [-0.2, 0.08]), 'stand'), fb: hind(step(0)), ff: fore(step(1)), nb: hind(step(2)), nf: fore(step(3)), haunch: 0};
    }
    if (st === 'sit') {
      const hip: UV = [-0.26, 0.32], sh: UV = [0.12, isCat ? 0.88 : 0.92];
      const fore: UV[] = [add(sh, [0.04, -0.12]), [sh[0] + 0.06, 0.4], [sh[0] + 0.07, 0.1], [sh[0] + 0.07, 0]];
      const hind: UV[] = [hip, [hip[0] + 0.2, 0.2], [hip[0] - 0.08, 0.05], [hip[0] + 0.2, 0]];
      return {hip, sh, H: add(sh, [0.2, isCat ? 0.34 : 0.4]), tail: tailLine(add(hip, [-0.2, -0.22]), 'sit'), fb: hind, ff: fore, nb: hind, nf: fore, haunch: 1};
    }
    const hip: UV = [-0.42, 0.26], sh: UV = [0.3, 0.3];
    const fore: UV[] = [add(sh, [-0.02, -0.12]), [sh[0] + 0.14, 0.07], [sh[0] + 0.3, 0.05], [sh[0] + 0.38, 0]];
    const hind: UV[] = [hip, [hip[0] + 0.22, 0.16], [hip[0] - 0.06, 0.05], [hip[0] + 0.2, 0]];
    return {hip, sh, H: add(sh, [0.26, isCat ? 0.28 : 0.32]), tail: tailLine(add(hip, [-0.24, -0.04]), 'lie'), fb: hind, ff: fore, nb: hind, nf: fore, haunch: 1};
  };
  const frontRig = (st: AnimalState): FrontRig => {
    const lift = (sd: number) => (moving && st === 'stand' ? amp * Math.max(0, 0.08 * Math.sin(2 * Math.PI * ph + (sd > 0 ? Math.PI : 0))) : 0);
    const legs = (top: number, mid: number, x0: number, x1: number) => [-1, 1].map((sd): UV[] => [[sd * x0, top], [sd * (x0 + x1) / 2, mid + lift(sd)], [sd * x1, lift(sd)]]);
    if (st === 'stand') {
      const [fl, fr] = legs(0.67, 0.3, 0.12, 0.12);
      return {chest: [0, 0.72], chestR: [0.28 * def.build, 0.27], H: [0, 1.18], tail: tailLine([0.14, 0.8], 'stand'), fl, fr, back: 1, haunch: 0};
    }
    if (st === 'sit') {
      const [fl, fr] = legs(0.55, 0.3, 0.12, 0.12);
      return {chest: [0, 0.6], chestR: [0.3 * def.build, 0.34], H: [0, isCat ? 1.06 : 1.12], tail: tailLine([0.28, 0.05], 'sit'), fl, fr, back: 0, haunch: 1};
    }
    const [fl, fr] = legs(0.14, 0.09, 0.13, 0.14);
    return {chest: [0, 0.26], chestR: [0.42 * def.build, 0.26], H: [0, 0.6], tail: tailLine([0.3, 0.06], 'lie'), fl, fr, back: 0, haunch: 0};
  };
  const tail = (line0: UV[]) => {
    const T = TAILS[def.tail];
    const line = line0.map(rotAbout(line0[0], -wagA)).map(([u, v]): UV => [u, Math.max(0.04, v)]); // a tail never dips under the ground
    const w = def.fluffy ? [T.w[0] * 1.5, T.w[1] * 1.6] : T.w;
    const poly = tube(line, taper(line.length, w[0], w[1]));
    part(points ? dark : def.pattern === 'tuxedo' || def.pattern === 'solid' ? def.coat : def.pattern === 'calico' ? def.coat : coat, poly, true);
    if (def.pattern === 'tabby') for (let i = 1; i < line.length - 1; i += 2) {
      const a = line[i], b = line[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, wv = w[0] * 0.45;
      ink([[a[0] - ((b[1] - a[1]) / d) * wv, a[1] + ((b[0] - a[0]) / d) * wv], [a[0] + ((b[1] - a[1]) / d) * wv, a[1] - ((b[0] - a[0]) / d) * wv]], dark, 1.4, false, 0);
    }
  };
  const from = pose.from ?? state, u = pose.from ? ease01(pose.blend ?? 1) : 1;
  const sniff = clamp(pose.sniff ?? 0);
  const paw = (c: string, at: UV, isFar: boolean) => leg(isFar ? far : def.pattern === 'tuxedo' ? light : c, ellUV(add(at, [0.04, 0.03]), 0.075, 0.04, 0, 12));

  // ------------------------------------------------------------------------------------------------------------- profile
  if (!front) {
    const wR = (isCat ? 0.4 : 0.44) * def.build * breathe, wC = (isCat ? 0.38 : 0.5) * def.build * breathe;
    const R = lerpRig(profRig(from), profRig(state), u);
    if (sniff) R.H = lerpUV(R.H, [R.sh[0] + 0.42, 0.2], sniff * 0.9);
    const {hip, sh, H} = R;

    // Far legs, tail, body, near back leg, haunch, near front leg, neck, head.
    const limb = (pts: UV[], isFront: boolean, isFar: boolean) => {
      const q = pts.map((x) => add(x, [isFar ? 0.05 : 0, 0]));
      leg(isFar ? far : limbC, tube(q, isFront ? [0.24, 0.13, 0.09, 0.09] : [0.32, 0.17, 0.09, 0.09]), true);
      paw(limbC, q[3], isFar);
    };
    limb(R.fb, false, true);
    limb(R.ff, true, true);
    tail(R.tail);

    const ang = Math.atan2(sh[1] - hip[1], sh[0] - hip[0]);
    const mid: UV = [(hip[0] + sh[0]) / 2, (hip[1] + sh[1]) / 2];
    const bodyLen = Math.hypot(sh[0] - hip[0], sh[1] - hip[1]);
    const body = fluff(ellUV(mid, bodyLen / 2 + Math.max(wR, wC) / 2, Math.max(wR, wC) / 2, ang, 22), def.fluffy ? 0.035 : 0, seed + 7);
    fill(coat, body, 4);
    // Under-side shade and pattern marks stay inside the body ellipse.
    const inBody = (k: number, du: number, dv: number): UV => add(mid, [Math.cos(ang) * du * k - Math.sin(ang) * dv, Math.sin(ang) * du * k + Math.cos(ang) * dv]);
    fill(mixColor(coat, '#3a2a40', 0.14), ellUV(inBody(1, 0, -0.12 * def.build), bodyLen / 2, 0.08 * def.build, ang, 16), 3);
    if (def.pattern === 'chest' || def.pattern === 'tuxedo') fill(light, ellUV(add(sh, [0.08, -0.06]), 0.14, 0.17 * def.build, ang, 14), 4);
    if (def.pattern === 'tabby') for (let i = -2; i <= 2; i++) {
      const a = inBody(1, i * bodyLen * 0.2, 0.16 * def.build), b = inBody(1, i * bodyLen * 0.2 - 0.03, -0.02);
      part(dark, tube([a, b], [0.06, 0.02]));
    }
    if (def.pattern === 'points') fill(mixColor(coat, dark, 0.25), ellUV(inBody(1, -0.05, 0.05), bodyLen / 2, 0.12, ang, 16), 3);
    if (def.pattern === 'calico') {
      fill(def.coat, ellUV(inBody(1, -bodyLen * 0.25, 0.06), 0.18, 0.12, ang, 14), 4);
      fill(def.dark ?? INK, ellUV(inBody(1, bodyLen * 0.12, 0.1), 0.14, 0.09, ang, 14), 4);
      fill(def.coat, ellUV(inBody(1, bodyLen * 0.35, 0.02), 0.08, 0.07, ang, 12), 4);
    }
    ink(body, coat, 1.0);

    limb(R.nb, false, false);
    if (R.haunch > 0.05) part(coat, ellUV(add(hip, [0.06, -0.02]), 0.24 * R.haunch, 0.23 * R.haunch, 0, 18), true);
    limb(R.nf, true, false);

    const neck = tube([add(sh, [0.06, 0.1]), add(H, [-0.04, -0.06])], [isCat ? 0.28 : 0.3 * def.build, 0.24 * hs]);
    part(coat, neck, true);
    if (def.pattern === 'chest' || def.pattern === 'tuxedo') fill(light, tube([add(sh, [0.14, 0.02]), add(H, [0.04, -0.12])], [0.14, 0.1]), 3);
    headSide(H);
    return;
  }

  // --------------------------------------------------------------------------------------------------------------- front
  const R = lerpRig(frontRig(from), frontRig(state), u);
  if (sniff) R.H = lerpUV(R.H, [0, 0.5], sniff * 0.85);
  const {chest, H} = R;
  const [crx, cry] = R.chestR;
  for (const sd of [-1, 1]) {
    if (R.back > 0.05) leg(far, tube([[sd * 0.18, 0.05 + 0.5 * R.back], [sd * 0.2, 0.05]], [0.12, 0.09]), true);
    if (R.haunch > 0.05) {
      part(coat, ellUV([sd * 0.26, 0.2], 0.18 * R.haunch, 0.2 * R.haunch, 0, 16), true);
      if (R.haunch > 0.4) leg(def.pattern === 'tuxedo' ? light : limbC, ellUV([sd * 0.32, 0.04], 0.08, 0.04, 0, 12));
    }
  }
  tail(R.tail);
  part(coat, fluff(ellUV(chest, crx, cry, 0, 20), def.fluffy ? 0.04 : 0, seed + 11));
  if (def.pattern === 'chest' || def.pattern === 'tuxedo') fill(light, ellUV([chest[0], chest[1] + 0.02], crx * 0.5, cry * 0.75, 0, 16), 4);
  if (def.pattern === 'tabby') for (const dy of [0.12, 0, -0.12]) ink([[-0.14, chest[1] + dy], [0, chest[1] + dy - 0.04], [0.14, chest[1] + dy]], dark, 1.3, false, 0.4);
  if (def.pattern === 'calico') {
    fill(def.coat, ellUV([chest[0] - 0.12, chest[1] + 0.06], 0.12, 0.1, 0, 14), 4);
    fill(def.dark ?? INK, ellUV([chest[0] + 0.13, chest[1] - 0.05], 0.1, 0.09, 0, 14), 4);
  }
  for (const pts of [R.fl, R.fr]) {
    leg(limbC, tube(pts, [0.13, 0.1, 0.09]), true);
    leg(def.pattern === 'tuxedo' ? light : limbC, ellUV(add(pts[2], [0, 0.03]), 0.075, 0.045, 0, 12));
  }
  part(coat, tube([[0, chest[1] + cry * 0.5], [0, H[1] - 0.1 * hs]], [isCat ? 0.26 : 0.3 * def.build, 0.26 * hs]), true);
  headFront(H);
};
