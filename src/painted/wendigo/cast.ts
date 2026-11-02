import {drawFigure, H, type CastDef, type FigAnchors} from '../kit/cast';
import {EXPRESSIONS} from '../kit/expressions';
import {CHIN, HEAD_SPAN, type FaceState} from '../kit/head';
import {ell, hardFill, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import {layerMotion, type Layered, type MotionId} from '../kit/motions';
import {clamp01, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import type {AnyPoseId, View} from '../kit/poses';

// WDG-EP01-SHORT cast (D05). The man of S01 is the kit person `man-parted` in a story-specific winter parka. The parka is a LOCAL
// outfit override (user decision, 2 Nov 2026, option A): `src/painted/kit` stays frozen, the override is a plain `CastDef` that
// `layerMotion` accepts in place of a `PEOPLE` id. Casting line of every S01 man shot: `man-parted + parka (override), P01, <expression>`.

/** Parka override of `man-parted` (D05): heavy dark closed winter parka to mid-thigh, hood down bunched at the neck with a pale ruff, belt, boots; gaunt, pale, stubble. */
export const WDG_MAN: CastDef = (() => {
  const base = PEOPLE['man-parted'];
  const parka = '#262d38';
  return {
    ...base,
    // the kit look of `man-parted` (lidded eye, ell nose, tapered brow, thin mouth) pushed to tired and hollow: hooded eye (smaller opening, heavy lid, `wing: false` = no upturned outer lash flick), thick dropped brow
    head: {...base.head, skin: '#e2bfa6', hair: '#2a2019', facial: 'stubble', lines: false, look: {...base.head.look!, eye: 'hooded', wing: false, brow: 'thick', browDrop: 0.09}},
    outfit: {
      shoulder: 0.42, shirt: parka, sleeve: parka, longSleeves: true, jacket: parka, pants: '#1e242d', shoes: '#16120f', boots: true,
      gear: {
        collar: {kind: 'hood', color: '#1d242e', trim: '#a8a190'},
        overcoat: {color: parka, hem: 0.7},
        belt: {color: '#151b23', h: 0.045},
      },
    },
  };
})();

/** A figure of the story at time `t` (pure): the layered rig of `WDG_MAN` with the face as given. */
export const manLayer = (a: {motion: MotionId; t: number; g: Pt; unit: number; view: View; pose?: AnyPoseId; face: FaceState; distance?: number; cast?: CastDef}): Layered =>
  layerMotion({person: a.cast ?? WDG_MAN, motion: a.motion, t: a.t, g: a.g, unit: a.unit, view: a.view, pose: a.pose ?? 'P01', expression: a.face, distance: a.distance});

/** A painter that records nothing: `drawFigure` against it returns the anchors (hands, head, visible top and bottom) of a pose without painting. */
const nullPainter = (): Painter => {
  const sink: unknown = new Proxy(function () {}, {get: (_t, k) => (k === 'alpha' || k === 't' || k === 'frame' ? 0 : sink), apply: () => sink});
  return sink as Painter;
};
/** The rig's anchors for a layer at the drawn scale (hands, head, visible top and bottom): the same arguments as the paint call, so an overlay can place light on a hand that the walk moves. */
export const anchorsAt = (l: Layered, unit: number, t: number): FigAnchors => drawFigure(nullPainter(), l.def, l.g, unit, l.pose, t, l.seed);

/** Mouth openness 0..1 over shot-local frames: a seeded syllable envelope inside the speech spans `[a, b)` and closed outside (the sheets' `talk` spans). */
export const talkEnv = (L: number, spans: [number, number][], seed = 0) => {
  for (const [a, b] of spans) {
    if (L < a || L >= b) continue;
    const edge = clamp01((L - a) / 3) * clamp01((b - L) / 4);
    const syl = Math.floor((L - a) / 5.5), ph = ((L - a) / 5.5) % 1;
    const amp = 0.35 + 0.65 * hash(seed + syl * 3 + 1);
    return edge * amp * Math.sin(Math.PI * Math.min(1, ph * 1.15)) ** 0.8;
  }
  return 0;
};

/**
 * Round 3 (user: the mouth flaps too much): mouth openness from the locked voice instead of a fixed 5.45 Hz cycle. Inside a talk span the openness follows
 * the narration amplitude `amp` (per composition frame, `g0` = the shot's start) smoothed with a 5-frame triangle (syllable rate, a mouth shape
 * holds for several frames), compressed and capped at 0.62 with a floor of 0.06 so it does not snap shut inside a phrase, and closed outside the span.
 * Pure function of the frame; without `amp` it falls back to `talkEnv`.
 */
export const talkVoiceEnv = (L: number, g0: number, spans: [number, number][], amp: readonly number[], seed = 0) => {
  const W = [1, 2, 3, 2, 1];
  const sm = (l: number) => { let t = 0; for (let k = -2; k <= 2; k++) t += W[k + 2] * (amp[Math.max(0, g0 + l + k)] ?? 0); return t / 9; };
  for (const [a, b] of spans) {
    if (L < a || L >= b) continue;
    let mx = 1e-6; for (let l = a; l < b; l++) mx = Math.max(mx, sm(l));
    const edge = clamp01((L - a) / 3) * clamp01((b - L) / 4);
    return edge * (0.06 + 0.56 * clamp01(sm(L) / mx) ** 0.7);
  }
  return seed < 0 ? talkEnv(L, spans, seed) : 0;
};

/** The whisper face (kit `whisper`: softened brows, dot eyes) with the mouth driven by `open` (closed flat when 0). */
export const whisperFace = (open: number): FaceState => ({...EXPRESSIONS.whisper, mouth: open > 0.02 ? 'talk' : 'flat', open});

/**
 * worried -> shock (S01-B03-SH03 sheet: `worried` L0 -> `shock` L60 hold, face still by L150): brows blend over L [52, 68], eyes switch at L60,
 * the mouth is the talk envelope while he speaks, the shock mouth (`shout`) is replaced by closed lips from L150 on.
 */
export const shockFace = (L: number, open: number): FaceState => {
  const w = EXPRESSIONS.worried, s = EXPRESSIONS.shock;
  const k = clamp01((L - 52) / 16);
  const eyes = L < 60 ? w.eyes : s.eyes;
  const look: Pt = L < 60 ? w.look : s.look;
  const base: FaceState = {brow: w.brow, browTo: s.brow, browMix: k, eyes, look, mouth: 'flat'};
  if (open > 0.02) return {...base, mouth: 'talk', open};
  return base;
};

/** Ground point that puts the head centre of an upright `def` at `head` (front or profile, no nod) at `unit` px per metre; the head is `H * unit` px tall. */
export const groundForHead = (def: CastDef, head: Pt, unit: number): Pt => {
  const HD = H * (def.headScale ?? 1), K = HD / HEAD_SPAN;
  return [head[0], head[1] + (def.height - HD + CHIN * K) * unit];
};

/** Parka mass behind the figure (D05, W5.2 fix 2): puffed shoulders wider than the kit body and the hood bunched behind the neck, dark. Call before `drawFigure`. `head` is the head centre, `hd` the head height in px. */
export const paintParkaBack = (p: Painter, head: Pt, hd: number, view: 'front' | 'left' | 'right') => {
  const chinY = head[1] + 0.537 * hd, shY = chinY + 0.19 * hd, dir = view === 'left' ? -1 : 1;
  const [x, y] = [head[0], head[1]];
  if (view === 'front') {
    hardFill(p, 7_300_001, '#1b212b', [[x - 0.2 * hd, shY - 0.1 * hd], [x - 0.5 * hd, shY - 0.02 * hd], [x - 0.66 * hd, shY + 0.2 * hd], [x - 0.7 * hd, shY + 1.6 * hd], [x + 0.7 * hd, shY + 1.6 * hd], [x + 0.66 * hd, shY + 0.2 * hd], [x + 0.5 * hd, shY - 0.02 * hd], [x + 0.2 * hd, shY - 0.1 * hd]]);
    hardFill(p, 7_300_002, '#161b23', ell(x, chinY - 0.02 * hd, 0.36 * hd, 0.24 * hd, 20)); // hood bunch behind the jaw
  } else {
    // profile: back of the parka and the hood lump behind the neck (the back is the side opposite the face)
    const b = -dir; // screen direction of the back
    hardFill(p, 7_300_001, '#1b212b', [[x - b * 0.1 * hd, shY - 0.12 * hd], [x + b * 0.5 * hd, shY - 0.02 * hd], [x + b * 0.64 * hd, shY + 0.25 * hd], [x + b * 0.6 * hd, shY + 1.6 * hd], [x - b * 0.5 * hd, shY + 1.6 * hd], [x - b * 0.5 * hd, shY + 0.2 * hd]]);
    hardFill(p, 7_300_002, '#161b23', ell(x + b * 0.3 * hd, chinY - 0.06 * hd, 0.3 * hd, 0.24 * hd, 20));
  }
  void y;
};

/**
 * Parka collar (D05, W5.2 fix 2): the collar edge and the bunched hood that hide most of the neck (the visible neck drops from about 0.19 head heights to
 * about 0.07), a pale fur-edge hint and a zip line. `head` is the head centre, `hd` the head height in px. Call after `drawFigure` and `paintGaunt`.
 */
export const paintParkaFront = (p: Painter, head: Pt, hd: number, view: 'front' | 'left' | 'right') => {
  const chinY = head[1] + 0.537 * hd, shY = chinY + 0.19 * hd, dir = view === 'left' ? -1 : 1, x = head[0];
  const poly = (id: number, color: string, op: number, pts: Pt[]) => (op >= 255 ? hardFill(p, 7_310_000 + id, color, pts) : washAt(p, 7_310_000 + id, color, op, pts, 0.08, 0.2));
  if (view === 'front') {
    // a standing collar: low at the throat, rising round the jaw
    for (const sd of [-1, 1]) {
      poly(sd + 2, '#252c37', 255, [[x, chinY + 0.09 * hd], [x + sd * 0.17 * hd, chinY + 0.04 * hd], [x + sd * 0.31 * hd, chinY - 0.1 * hd], [x + sd * 0.4 * hd, chinY - 0.06 * hd], [x + sd * 0.46 * hd, shY + 0.1 * hd], [x, shY + 0.22 * hd]]);
      poly(sd + 6, '#a8a190', 150, [[x + sd * 0.17 * hd, chinY + 0.04 * hd], [x + sd * 0.31 * hd, chinY - 0.1 * hd], [x + sd * 0.33 * hd, chinY - 0.07 * hd], [x + sd * 0.2 * hd, chinY + 0.07 * hd]]); // fur edge hint
    }
    poly(9, '#0f141b', 230, [[x - 0.02 * hd, shY + 0.1 * hd], [x + 0.02 * hd, shY + 0.1 * hd], [x + 0.02 * hd, shY + 0.9 * hd], [x - 0.02 * hd, shY + 0.9 * hd]]); // zip line
    p.inkStill(7_310_100, 'rotring', '#0a0e14', 1.8);
    p.brush.line(x, shY + 0.08 * hd, x, shY + 0.9 * hd);
    p.brush.line(x - 0.17 * hd, chinY + 0.04 * hd, x - 0.46 * hd, shY + 0.1 * hd);
    p.brush.line(x + 0.17 * hd, chinY + 0.04 * hd, x + 0.46 * hd, shY + 0.1 * hd);
  } else {
    const b = -dir;
    // collar round the neck (a sleeve of cloth from the jaw down to the shoulder) and the hood lump behind
    poly(2, '#252c37', 255, [[x + dir * 0.22 * hd, chinY + 0.1 * hd], [x + dir * 0.0 * hd, chinY + 0.05 * hd], [x + b * 0.3 * hd, chinY - 0.1 * hd], [x + b * 0.42 * hd, chinY + 0.02 * hd], [x + b * 0.4 * hd, shY + 0.16 * hd], [x + dir * 0.3 * hd, shY + 0.18 * hd]]);
    poly(3, '#a8a190', 140, [[x + dir * 0.22 * hd, chinY + 0.1 * hd], [x + dir * 0.0 * hd, chinY + 0.05 * hd], [x + b * 0.02 * hd, chinY + 0.09 * hd], [x + dir * 0.22 * hd, chinY + 0.13 * hd]]);
    p.inkStill(7_310_100, 'rotring', '#0a0e14', 1.6);
    p.brush.line(x + dir * 0.22 * hd, chinY + 0.11 * hd, x + b * 0.4 * hd, chinY + 0.04 * hd);
  }
};

/**
 * Gaunt face (D05, W5.2 fix 1; realigned to the kit 2 Nov 2026): hollow cheek (cool wash below the eye), jaw shadow, stubble grain on the profile jaw (the front view relies on the kit stubble glaze),
 * flat greasy hair. It never touches eye, brow or mouth geometry (the kit `EXPRESSIONS` own those; the kit also draws `facial: 'stubble'` and `lines`). `head` is the head centre and `hd` the head height in px (`H * unit`);
 * `view` is the head view. Seeded, pure; call after `drawFigure`. Tired, not frightening: values stay within about 15 % of the skin.
 */
export const paintGaunt = (p: Painter, head: Pt, hd: number, view: 'front' | 'left' | 'right') => {
  const K = hd / HEAD_SPAN;
  const at = (u: number, v: number): Pt => [head[0] + u * K, head[1] + v * K];
  const soft = (id: number, color: string, op: number, c: Pt, rx: number, ry: number, a = 0) => washAt(p, 7_100_000 + id, color, op, ell(c[0], c[1], rx * K, ry * K, 16, a), 0.7, 0.15);
  const dir = view === 'left' ? -1 : 1;
  const dot = (id: number, u: number, v: number, len: number, ang: number) => { const [x, y] = at(u, v); p.brush.line(x, y, x + Math.cos(ang) * len * K, y + Math.sin(ang) * len * K); };
  if (view === 'front') {
    for (const sd of [-1, 1]) {
      soft(10 + sd, '#b08c78', 80, at(sd * 0.5, 0.62), 0.17, 0.3, sd * 0.2); // cheek hollow under the cheekbone (v 0.3..0.92: stays below the kit eyes), a faint cool shade
    }
    for (const sd of [-1, 1]) soft(32 + sd, '#8c6c60', 80, at(sd * 0.6, 0.88), 0.1, 0.26, sd * -0.5); // jaw edge in shadow: the face narrows to the chin
    soft(30, '#b58a74', 70, at(0, 0.82), 0.34, 0.1); // under the lip
    // faint stubble over the cheeks and chin (below the cheek hollow, clear of eyes and mouth): a light glaze and a few very pale short ticks
    for (const sd of [-1, 1]) soft(60 + sd, '#7d6658', 38, at(sd * 0.42, 0.8), 0.2, 0.17, sd * -0.5);
    soft(62, '#7d6658', 34, at(0, 0.98), 0.26, 0.09);
    p.inkStill(7_200_001, 'rotring', '#8c7566', Math.max(1, hd / 420));
    for (let i = 0; i < 90; i++) {
      const u = (hash(8000 + i) * 2 - 1) * 0.62, v = 0.74 + hash(8200 + i) * 0.32;
      if (Math.abs(u) < 0.2 && v < 0.9) continue; // keep the mouth clear
      if (v > 0.74 + (0.66 - Math.abs(u)) * 0.9 + 0.1 + 0.12 && Math.abs(u) > 0.5) continue;
      dot(i, u, v, 0.02 + 0.02 * hash(8400 + i), 1.2 + (hash(8600 + i) - 0.5) * 1.2);
    }
    soft(50, '#1b1510', 150, at(0, -0.78), 0.74, 0.3); // hair: flat and greasy, dulled crown
  } else {
    soft(40, '#a98671', 170, at(dir * 0.1, 0.58), 0.24, 0.36, dir * -0.3); // cheek hollow (below the kit eye)
    soft(44, '#86675c', 190, at(dir * 0.05, 0.9), 0.45, 0.13, dir * 0.25); // jaw shadow under the cheek
    soft(45, '#a98671', 150, at(dir * 0.32, 0.42), 0.12, 0.2, dir * -0.6); // hollow at the mouth corner
    soft(50, '#1b1510', 150, at(0, -0.78), 0.74, 0.3); // hair: flat and greasy, dulled crown
    p.inkStill(7_200_000, 'rotring', '#4a382d', Math.max(1, hd / 300));
    for (let i = 0; i < 150; i++) {
      const u = dir * (hash(7000 + i) * 0.78 - 0.05), v = 0.48 + hash(7200 + i) * 0.7;
      if (v > 0.5 + (0.62 - Math.abs(u)) * 0.5 + 0.5 || Math.abs(u) < 0.0 || (Math.abs(u) > 0.34 && v < 0.78 && v > 0.52)) continue;
      dot(i, u, v, 0.025 + 0.03 * hash(7400 + i), 1.3 + (hash(7600 + i) - 0.5) * 1.4);
    }
  }
  // lank hair strands over the forehead
  p.inkStill(7_200_002, 'rotring', '#120d0a', Math.max(1, hd / 330));
  for (let i = 0; i < (view === 'front' ? 5 : 0); i++) {
    const u = view === 'front' ? (i - 2) * 0.24 : dir * (i * 0.12 - 0.1);
    const [x0, y0] = at(u, -0.64 + hash(7800 + i) * 0.04), [x1, y1] = at(u + (hash(7900 + i) - 0.5) * 0.1, -0.4 + hash(7950 + i) * 0.08);
    p.brush.line(x0, y0, x1, y1);
  }
};
