import {BONE, H, ikElbow, type CastDef, type FigAnchors, type FigPose, type Outfit} from './cast';
import {INK, VD18, capsule, ell, glaze, inkLine, limb, lineOf, modelPart, solid, toneOf, washAt} from './draw';
import {hatFront} from './gear';
import {CHIN, HEAD_SPAN, headOutline, type HeadStyle} from './head';
import {hairFront, isNewCut} from './hair';
import {mixColor, type Painter, type Pt} from './painter';

// BACK view of the recurring cast (kit view `'back'`, added 3 Nov 2026 for EG-EP02 `คุณ`; generalised from the EP01 episode figure
// `everyone-gone/figure-back.ts`). `drawFigure` dispatches `pose.view === 'back'` here, so a back figure takes the same `CastDef`,
// `FigPose` and `FigAnchors` as the front and profile views: any PEOPLE entry, any WARDROBE outfit, the same `poseFor` arms.
//
// - Frame: u toward screen right, v up, metres, like the front view. The character's RIGHT side is on screen RIGHT (seen from behind),
//   so a front-view arm target (`FigPose.rArm` from `poseFor(id, ..., 'front')`) is mirrored about the figure's centre line
//   (`g[0]`): the same pose id reads correctly from behind.
// - Supported: standing, `walk`/`stride` (heel lift only), `lean`, `rise`, `nod`, both arms (IK, `via` elbows kept), hair of every
//   cut seen from behind, hood down (bunch on the upper back) and hood up (`FigPose.hoodUp`), hats (cap, helmet, nurse), pack,
//   belt, skirt, overcoat, `light`, `silhouette`. No face is drawn; `face`, `head` and holds are ignored.
// - Not supported (cut to front or profile for these): crouch, bend, sit, floorSit, kneel, squat, run, lie, props in hand.
// - The head is a decal on a round skull, so a "3/4 back" does not exist: the kit has front, left, right and back only.

const mirrorX = (g: Pt, q: Pt): Pt => [2 * g[0] - q[0], q[1]];

/** Hood colour of an outfit (`gear.collar` of kind `hood`), or undefined when the outfit has no hood. */
export const hoodColorOf = (o: Outfit): string | undefined => (o.gear?.collar?.kind === 'hood' ? o.gear.collar.color : undefined);

/** The head style a hood-up figure wears: cut `hood` in the hood colour (the hair is covered). Used by the front and profile views. */
export const hoodUpHead = (head: HeadStyle, o: Outfit): HeadStyle => ({...head, cut: 'hood', hoodOpen: true, hood: hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2)});

const cap = (rx: number, ry: number, cy: number, n = 18): Pt[] =>
  Array.from({length: n + 1}, (_, i): Pt => {
    const a = Math.PI + (i / n) * Math.PI;
    return [rx * Math.cos(a), ry * Math.sin(a) + cy];
  });
const NAPE = (hem: number): Pt[] => [[0.97, 0.3], [0.88, 0.7], [0.46, hem], [0, hem + 0.04], [-0.46, hem], [-0.88, 0.7], [-0.97, 0.3]];
const arcBack = (rx: number, ry: number): Pt[] => Array.from({length: 17}, (_, i): Pt => [rx * Math.cos(Math.PI + (i / 16) * Math.PI), ry * Math.sin(Math.PI + (i / 16) * Math.PI) - 0.02]);

export const drawFigureBack = (p: Painter, def: CastDef, g: Pt, unit: number, pose: FigPose, t: number, seed = def.seed): FigAnchors => {
  void t;
  const o = def.outfit, G = o.gear, Ht = def.height;
  const HD = H * (def.headScale ?? 1), AB = BONE * (def.armScale ?? 1), sc = HD / H;
  const chin = Ht - HD, shV0 = chin - 0.16 * HD;
  const torso = (chin - 0.068) * 0.44;
  const hip0 = shV0 - torso + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038, knee0 = (hip0 + ankleV) / 2;
  const sw = o.shoulder * HD, hw = 0.3 * HD, K = HD / HEAD_SPAN;
  const L = pose.light, sil = pose.silhouette;
  const rise = pose.rise ?? 0, lean = pose.lean ?? 0, stride = pose.stride ?? 1;
  const ph = (pose.walk ?? 0) * Math.PI * 2;
  const bob = pose.walk === undefined ? 0 : Math.abs(Math.sin(ph)) * 0.012 * stride;
  const shV = shV0 + rise;
  const skin = def.head.skin, skinShade = mixColor(skin, VD18.shadow, 0.2);

  const S = ([u, v]: Pt): Pt => [g[0] + u * unit, g[1] - (v + bob) * unit];
  /** Upper body: breath rise above the hip, then lean about the hip (toward screen right). */
  const U = ([u, v]: Pt): Pt => {
    const dv = (v - hip0) + rise * Math.max(0, Math.min(1, (v - hip0) / (shV0 - hip0))), a = lean;
    return S([u * Math.cos(a) + dv * Math.sin(a), hip0 + dv * Math.cos(a) - u * Math.sin(a)]);
  };
  const Uq = (pts: Pt[]) => pts.map(U), Sq = (pts: Pt[]) => pts.map(S);

  let part = 0, line = 0;
  const fill = (color: string, pts: Pt[], outline = true, passes = 4) => {
    const base = sil ?? toneOf(color, L);
    solid(p, seed * 1000 + ++part, base, pts, sil ? 8 : passes, sil ? 0.02 : L ? 0 : 0.07, sil ? 0.03 : 0.2);
    if (L && !sil) modelPart(p, seed * 1000 + part, base, pts, L);
    if (outline && !sil) inkLine(p, seed * 1000 + ++line, pts, {weight: L ? VD18.lineOuter : 1.0, color: lineOf(base, L)});
  };
  const stroke = (color: string, pts: Pt[], w = 0.8) => {
    if (!sil) inkLine(p, seed * 1000 + 400 + ++line, pts, {closed: false, weight: w, curve: 0.4, color: mixColor(toneOf(color, L), INK, 0.5)});
  };

  // Ground shadow like every figure (front and profile draw the same one).
  const sh = ell(g[0], g[1] + 0.01 * unit, 0.26 * (L ? 1.15 : 1) * unit, (L ? 0.07 : 0.06) * unit, 16);
  if (!pose.seated && !L) washAt(p, seed * 1000 + 999, sil ?? '#1e2324', 70, sh, 0.5, 0.3);
  if (!pose.seated && L) glaze(p, seed * 1000 + 999, '#0e1213', 120, sh, {border: 0.1, bleed: 0.15});

  // ------------------------------------------------------------------ legs, skirt, feet
  const bodyC = o.coat ?? o.jacket ?? o.shirt;
  const hemV = o.skirt ? o.skirtHem ?? knee0 + 0.04 : undefined;
  const wv = (s: number) => Math.max(0, Math.sin(ph + (s > 0 ? 0 : Math.PI))) * 0.05 * stride;
  for (const s of [-1, 1] as const) {
    const lift = pose.walk === undefined ? 0 : wv(s);
    const hip: Pt = [s * 0.0725 * sc, hip0], ankle: Pt = [s * 0.085 * sc, ankleV + lift], knee: Pt = [s * 0.08 * sc, (hip0 + ankleV) / 2 + lift / 2];
    const pc = mixColor(o.pants, '#000000', s > 0 ? 0.05 : 0);
    fill(pc, Sq(limb(hip, knee, 0.11 * sc, 0.095 * sc)));
    fill(pc, Sq(limb(knee, ankle, 0.095 * sc, 0.08 * sc)));
    const sc2 = o.boots ? mixColor(o.shoes, '#000000', 0.1) : o.shoes;
    if (o.boots) fill(sc2, Sq(limb([ankle[0], ankle[1] + 0.1], ankle, 0.085 * sc, 0.08 * sc)));
    fill(o.shoes, Sq(ell(ankle[0] + s * 0.01, ankle[1] - 0.012, 0.062 * sc, 0.032 * sc, 14).map((q) => q as Pt)));
  }
  fill(o.pants, Sq([[-hw - 0.0085, hip0 + 0.03], [hw + 0.0085, hip0 + 0.03], [hw, crotch0], [-hw, crotch0]]), false);

  // ------------------------------------------------------------------ arms
  // Right arm = screen right. Arms that stay below the shoulder line go under the torso and hood; raised ones are painted last.
  const shoulderOf = (s: -1 | 1): Pt => U([s * (sw - 0.02), shV0 - 0.03]);
  const armGeom = (s: -1 | 1, a?: FigPose['rArm']) => {
    const Sh = shoulderOf(s), Lpx = AB * unit;
    let T: Pt, E: Pt;
    if (a) {
      T = mirrorX(g, a.to);
      const d = Math.hypot(T[0] - Sh[0], T[1] - Sh[1]), m = 2 * Lpx - 0.5;
      if (d > m) T = [Sh[0] + ((T[0] - Sh[0]) * m) / d, Sh[1] + ((T[1] - Sh[1]) * m) / d];
      E = a.via ? mirrorX(g, a.via) : ikElbow(Sh, T, Lpx, s);
    } else {
      T = U([s * (sw + 0.015), shV0 - 0.49 * (AB / BONE)]);
      E = ikElbow(Sh, T, Lpx, s);
    }
    return {Sh, E, T, raised: T[1] < U([0, shV0])[1] - 0.12 * unit};
  };
  const paintArm = (s: -1 | 1, a: ReturnType<typeof armGeom>) => {
    const M: Pt = [(a.Sh[0] + a.E[0]) / 2, (a.Sh[1] + a.E[1]) / 2];
    fill(o.sleeve, capsule(a.Sh, a.E, 0.078 * unit * sc, 0.07 * unit * sc));
    fill(o.longSleeves ? o.sleeve : skin, capsule(a.E, a.T, 0.056 * unit * sc, 0.046 * unit * sc), true, 4);
    const dx = a.T[0] - a.E[0], dy = a.T[1] - a.E[1], d = Math.hypot(dx, dy) || 1;
    const hand: Pt = [a.T[0] + (dx / d) * 0.03 * unit * sc, a.T[1] + (dy / d) * 0.03 * unit * sc];
    fill(skinShade, ell(hand[0], hand[1], 0.036 * unit * sc, 0.046 * unit * sc, 14, Math.atan2(dy, dx) - Math.PI / 2), true, 4);
    void M;
    return hand;
  };
  const rG = armGeom(1, pose.rArm), lG = armGeom(-1, pose.lArm);
  let rHand: Pt = rG.T, lHand: Pt = lG.T;
  if (!rG.raised) rHand = paintArm(1, rG);
  if (!lG.raised) lHand = paintArm(-1, lG);

  // ------------------------------------------------------------------ torso back
  const bodyPts: Pt[] = [[-sw + 0.017, shV0 - 0.02], [-0.07, shV0 + 0.005], [0.07, shV0 + 0.005], [sw - 0.017, shV0 - 0.02], [sw + 0.005, shV0 - 0.07], [hw + 0.02, hip0 - 0.02], [hw + 0.024, hip0 - 0.07], [-hw - 0.024, hip0 - 0.07], [-hw - 0.02, hip0 - 0.02], [-sw - 0.005, shV0 - 0.07]];
  fill(bodyC, Uq(bodyPts));
  if (hemV !== undefined) fill(o.skirt!, [U([-hw - 0.02, hip0 + 0.02]), U([hw + 0.02, hip0 + 0.02]), S([hw + 0.1 * sc, hemV]), S([-hw - 0.1 * sc, hemV])]);
  stroke(bodyC, Uq([[-sw + 0.03, shV0 - 0.08], [0, shV0 - 0.1], [sw - 0.03, shV0 - 0.08]]));
  stroke(bodyC, Uq([[0, shV0 - 0.1], [0.004, hip0 - 0.05]]), 0.7);
  if (G?.overcoat) {
    const hem = Math.min(G.overcoat.hem, knee0 + 0.12);
    fill(G.overcoat.color, [...Uq([[-sw + 0.017, shV0 - 0.02], [sw - 0.017, shV0 - 0.02], [sw + 0.0085, shV0 - 0.0425]]), S([hw + 0.1, hem]), S([-hw - 0.1, hem]), U([-sw - 0.0085, shV0 - 0.0425])]);
    stroke(G.overcoat.color, [U([0, shV0 - 0.1]), S([0, hem])], 0.7);
  }
  if (G?.drape) fill(G.drape, Uq([[-sw + 0.017, shV0], [0.04, shV0 - 0.005], [sw - 0.017, shV0 - 0.05], [0.05, hip0 - 0.02], [-hw - 0.01, hip0 + 0.02]]));
  if (G?.belt) {
    const h = G.belt.h ?? 0.035, v0 = hip0 - 0.015 + h, v1 = hip0 - 0.015;
    fill(G.belt.color, Uq([[-hw - 0.012, v0], [hw + 0.012, v0], [hw + 0.012, v1], [-hw - 0.012, v1]]));
  }
  if (o.apron) stroke(o.apron, Uq([[-hw, hip0 + 0.01], [0, hip0 - 0.01], [hw, hip0 + 0.01]]), 1.2);
  if (G?.pack) fill(G.pack, Uq([[-0.2 * sc, shV0 - 0.02], [0.2 * sc, shV0 - 0.02], [0.2 * sc, shV0 - 0.3], [-0.2 * sc, shV0 - 0.3]]));
  // Neck, nape and collar band.
  const hcBase = U([0, chin + CHIN * K]);
  const nod = pose.nod ?? [0, 0];
  const hc: Pt = [hcBase[0] + nod[0] * K * unit, hcBase[1] - nod[1] * K * unit];
  const k = K * unit;
  const head = ([u, v]: Pt): Pt => [hc[0] + u * k, hc[1] + v * k];
  const H2 = (pts: Pt[]) => pts.map(head);
  fill(o.coat ?? skinShade, H2([[-0.5, 0.5], [0.5, 0.5], [0.46, 1.6], [-0.46, 1.6]]), true, 4);
  fill(mixColor(o.shirt, '#ffffff', 0.08), Uq([[-0.075, shV0 - 0.005], [0.075, shV0 - 0.005], [0.07, shV0 + 0.025], [-0.07, shV0 + 0.025]]), true, 4);

  // Hood down: the hood bunched on the upper back, seam down the middle.
  const col = G?.collar, hoodUp = !!pose.hoodUp;
  if (col?.kind === 'hood' && !hoodUp) {
    fill(col.color, Uq([[-0.115, shV0 + 0.03], [-0.15, shV0 - 0.06], [-0.1, shV0 - 0.19], [0, shV0 - 0.22], [0.1, shV0 - 0.19], [0.15, shV0 - 0.06], [0.115, shV0 + 0.03], [0.04, shV0 + 0.012], [-0.04, shV0 + 0.012]]), true, 6);
    stroke(col.color, Uq([[0, shV0 + 0.012], [0, shV0 - 0.2]]), 0.8);
  }

  // ------------------------------------------------------------------ head from behind
  const style = def.head, cut = style.cut;
  const nc = isNewCut(cut) ? hairFront(cut) : null;
  const coveredHair = hoodUp || cut === 'hood';
  const earSides: (-1 | 1)[] = coveredHair || cut === 'bob' || cut === 'long' ? [] : nc ? nc.ears : cut === 'short' || cut === 'tied' ? [-1, 1] : [];
  for (const s of earSides) fill(s < 0 ? skin : skinShade, H2(ell(s * 0.98, 0.16, 0.17, 0.3, 12).map((q) => q as Pt)), true, 4);
  fill(skin, H2(headOutline(40).map(([u, v]): Pt => [u * 0.99, v])), true, 8);
  const hairBase = nc?.tone ? mixColor(style.hair, skin, nc.tone) : style.hair;
  if (hoodUp) {
    const hc2 = hoodColorOf(o) ?? mixColor(o.shirt, INK, 0.2);
    const hood: Pt[] = [...arcBack(1.32, 1.46).map(([u, v]): Pt => [u, v - 0.02]), [1.3, 0.55], [1.16, 1.12], [0.7, 1.3], [0, 1.34], [-0.7, 1.3], [-1.16, 1.12], [-1.3, 0.55]];
    fill(hc2, H2(hood), true, 8);
    stroke(hc2, H2([[0, -1.4], [0.04, -0.4], [0, 0.5], [0, 1.28]]), 1.0);
    stroke(hc2, H2([[-1.1, 0.5], [-0.7, 1.1], [-0.3, 1.26]]), 0.8);
    stroke(hc2, H2([[1.1, 0.5], [0.7, 1.1], [0.3, 1.26]]), 0.8);
  } else if (cut === 'hood') {
    const hc2 = style.hood ?? style.hair;
    fill(hc2, H2([...arcBack(1.32, 1.46), [1.3, 0.55], [1.16, 1.12], [0.7, 1.3], [0, 1.34], [-0.7, 1.3], [-1.16, 1.12], [-1.3, 0.55]]), true, 8);
    stroke(hc2, H2([[0, -1.4], [0.04, -0.4], [0, 0.5], [0, 1.28]]), 1.0);
  } else if (cut === 'balding') {
    fill(style.hair, H2([[-0.98, -0.1], [-0.92, 0.5], [-0.5, 0.88], [0.5, 0.88], [0.92, 0.5], [0.98, -0.1], [0.84, 0.3], [0.5, 0.62], [-0.5, 0.62], [-0.84, 0.3]]), true, 6);
  } else if (cut === 'bob') {
    fill(style.hair, H2([...arcBack(1.14, 1.16), [1.16, 0.7], [0.86, 0.84], [0, 0.88], [-0.86, 0.84], [-1.16, 0.7]]), true, 6);
  } else if (cut === 'long') {
    fill(style.hair, H2([...arcBack(1.16, 1.18), [1.2, 0.6], [1.26, 1.3], [1.12, 1.72], [0.72, 1.62], [0, 1.66], [-0.72, 1.62], [-1.12, 1.72], [-1.26, 1.3], [-1.2, 0.6]]), true, 6);
  } else {
    // Cap over the skull down to a low nape hairline; big-volume cuts (curly, perm) use their own cloud outline; tails go on top.
    const volume = nc?.back && (cut === 'curly' || cut === 'perm') ? nc.back[0] : null;
    const crown: Pt[] = cut === 'bowl' ? [...cap(1.1, 1.14, -0.04), [0.99, 0.3], [0.8, 0.5], [0, 0.54], [-0.8, 0.5], [-0.99, 0.3]]
      : cut === 'pixie' ? [...cap(1.08, 1.13, -0.04), ...NAPE(0.9)]
      : [...cap(1.06, 1.1, -0.03), ...NAPE(1.0)];
    fill(hairBase, H2(volume ?? crown), true, 6);
    if (cut === 'tied') fill(style.hair, H2(ell(0.05, -1.12, 0.32, 0.22, 18).map((q) => q as Pt)), true, 6);
    if (cut === 'ponytail') {
      fill(style.hair, H2([[-0.28, 0.2], [0.28, 0.2], [0.42, 1.2], [0.22, 1.74], [0, 1.84], [-0.22, 1.74], [-0.42, 1.2]]), true, 6);
      if (nc?.accent) fill(style.accent ?? '#c8573e', H2(ell(0, 0.28, 0.3, 0.1, 12).map((q) => q as Pt)), true, 6);
    }
    if (cut === 'pigtails') {
      nc?.back?.forEach((poly) => fill(style.hair, H2(poly), true, 6));
      nc?.accent?.forEach((poly) => fill(style.accent ?? '#c8573e', H2(poly), true, 6));
    }
    if (!volume) {
      const hairC = toneOf(hairBase, L);
      const strokes: Pt[][] = [[[-0.62, -0.6], [-0.8, 0.0]], [[-0.3, -0.75], [-0.4, 0.1]], [[0, -0.8], [0, 0.2]], [[0.3, -0.75], [0.4, 0.1]], [[0.62, -0.6], [0.8, 0.0]], [[-0.45, 0.35], [-0.38, 0.88]], [[0.45, 0.35], [0.38, 0.88]]];
      strokes.forEach((s, i) => inkLine(p, seed * 1000 + 600 + i, H2(s), {closed: false, weight: 0.6, curve: 0.4, color: mixColor(hairC, '#9aa7ae', 0.3)}));
    }
  }
  // Headwear from behind: the same hat parts as the front, taken without face-side details (dome over the crown).
  if (G?.hat) {
    for (const {tone, pts} of hatFront(G.hat.kind)) {
      const c = tone === 'main' ? G.hat.color : tone === 'band' ? G.hat.band ?? mixColor(G.hat.color, INK, 0.55) : tone === 'dark' ? mixColor(G.hat.color, INK, 0.6) : '#e8dcb0';
      fill(c, H2(pts), true, 6);
    }
  }

  // Raised arms last (hands at the head, e.g. pulling the hood).
  if (rG.raised) rHand = paintArm(1, rG);
  if (lG.raised) lHand = paintArm(-1, lG);

  const headTop = hc[1] - (hoodUp || cut === 'hood' ? 1.46 : 1.17) * k;
  return {
    head: hc, headTop, chin: hc[1] + CHIN * k, feet: g, rHand, lHand, rShoulder: rG.Sh, lShoulder: lG.Sh,
    rUpper: [(rG.Sh[0] + rG.E[0]) / 2, (rG.Sh[1] + rG.E[1]) / 2], lUpper: [(lG.Sh[0] + lG.E[0]) / 2, (lG.Sh[1] + lG.E[1]) / 2],
    top: headTop, bottom: g[1],
  };
};
