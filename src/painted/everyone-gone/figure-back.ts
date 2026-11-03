import {H, type CastDef} from '../kit/cast';
import {capsule, ell, inkLine, washAt, limb, lineOf, modelPart, solid, toneOf, VD18, type InteriorLight} from '../kit/draw';
import {CHIN, HEAD_SPAN, headOutline} from '../kit/head';
import {PEOPLE} from '../kit/people';
import {mixColor, type Painter, type Pt} from '../kit/painter';

// "คุณ" seen from behind (brief R1.2 VD03; casting line `man-crop (own outfit), back view`). Look-defining first version by
// Film (W3.1, 3 Nov 2026) for the user's stills check; Boss hardens it as `FigPose.view: 'back'` in kit `cast.ts`/`head.ts`
// (brief placement table). Built from the rig's own levels (head unit K = H / HEAD_SPAN, shoulders `outfit.shoulder * H`,
// the shoulder and hip lines of `drawFigure`), the same way `kuchisake/narrator-back.ts` builds its back view.
// **No ground shadow and no contact ellipse, ever** (VD13, clue CL07); the set never draws the figure into the glass (VD05).
// Poses: `idle` = P01 arms down; `wave` = P07 right arm raised beside the head (the character's right is screen right from
// behind); `reach` = P16 away-from-camera variant (proposed): the right arm goes forward toward the glass, so only the upper
// arm shows past the shoulder and the hand is hidden by the body's depth.

export const YOU_DEF: CastDef = PEOPLE['man-crop'];
export type BackPose = 'idle' | 'wave' | 'reach';

const K = H / HEAD_SPAN;
/** Daylight on the figure: the low sun from camera-left travels screen-right (VD02). No rim. */
export const SUN_LIGHT: InteriorLight = {key: [1, 0.3], rim: [0, 1], rimScale: 0};

const fillOf = (p: Painter, base: number, L: InteriorLight) => {
  let part = 0, line = 0;
  return (color: string, pts: Pt[], outline = true, passes = 4) => {
    const c = toneOf(color, L);
    solid(p, base + ++part, c, pts, passes, 0, 0.2);
    modelPart(p, base + part, c, pts, L);
    if (outline) inkLine(p, base + 700 + ++line, pts, {weight: VD18.lineOuter, color: lineOf(c, L)});
  };
};

/** Paint the figure from behind at ground point `g` (plate px), `unit` px per metre. `breath` 0..1 lifts the shoulders. */
export const paintYouBack = (p: Painter, g: Pt, unit: number, pose: BackPose = 'idle', o: {breath?: number; def?: CastDef; L?: InteriorLight; reachTo?: Pt; reachElbow?: Pt; reachHandPx?: number} = {}) => {
  const def = o.def ?? YOU_DEF, L = o.L ?? SUN_LIGHT, od = def.outfit;
  const rise = 0.008 * (o.breath ?? 0);
  const chin = def.height - H, shV = chin - 0.16 * H + rise;
  const hip0 = chin - 0.16 * H - (chin - 0.068) * 0.44 + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038;
  const sw = od.shoulder * H, hw = 0.3 * H;
  const at = ([u, y]: Pt): Pt => [g[0] + u * unit, g[1] - y * unit];
  const base = def.seed * 1000 + 600;
  const fill = fillOf(p, base, L);
  const skin = def.head.skin, skinShade = mixColor(skin, VD18.shadow, 0.28);

  // Away-reach: the right arm is behind the body's silhouette (painted first, only the upper arm shows past the shoulder).
  // `reachElbow` given = the arm is drawn in front of the torso further down (it sticks out past the shoulder and reads from behind).
  if (pose === 'reach' && !o.reachElbow) {
    // `reachTo` is the hand's picture point, projected by the caller from the world (the hand about 0.6 m ahead of the
    // shoulder, toward the glass): forward reads as up and inward on screen and the far hand is smaller.
    const S = at([sw - 0.03, shV - 0.03]), T = o.reachTo ?? at([sw + 0.25, shV + 0.05]);
    const E: Pt = [(S[0] + T[0]) / 2 + 0.02 * unit, (S[1] + T[1]) / 2 + 0.05 * unit];
    const M: Pt = [(S[0] + E[0]) / 2, (S[1] + E[1]) / 2];
    fill(od.sleeve, capsule(S, M, 0.078 * unit, 0.07 * unit));
    fill(mixColor(skin, VD18.shadow, 0.15), capsule(M, E, 0.052 * unit, 0.048 * unit), true, 4);
    fill(mixColor(skin, VD18.shadow, 0.25), capsule(E, T, 0.045 * unit, 0.036 * unit), true, 4);
    fill(mixColor(skin, VD18.shadow, 0.3), ell(T[0], T[1], 0.03 * unit, 0.036 * unit, 14), true, 4);
  }

  // Legs and heels (standing, weight even), trousers.
  for (const s of [-1, 1] as const) {
    const hip: Pt = [s * 0.0725, hip0], ankle: Pt = [s * 0.085, ankleV], knee: Pt = [s * 0.08, (hip0 + ankleV) / 2];
    fill(mixColor(od.pants, '#000000', s > 0 ? 0.05 : 0), limb(hip, knee, 0.11, 0.095).map(at));
    fill(mixColor(od.pants, '#000000', s > 0 ? 0.05 : 0), limb(knee, ankle, 0.095, 0.08).map(at));
    fill(od.shoes, ell(ankle[0] + s * 0.01, ankle[1] - 0.012, 0.062, 0.032, 14).map((q) => at(q as Pt)));
  }
  fill(od.pants, [at([-hw - 0.0085, hip0 + 0.03]), at([hw + 0.0085, hip0 + 0.03]), at([hw, crotch0]), at([-hw, crotch0])], false);

  // Arms that hang (left always; right unless it waves or reaches): sleeve, bare forearm (short sleeves), hand.
  const hangArm = (s: -1 | 1) => {
    const S = at([s * (sw - 0.02), shV - 0.03]), E = at([s * (sw + 0.03), shV - 0.29]), T = at([s * (sw + 0.015), shV - 0.53]);
    const M = at([s * (sw + 0.012), shV - 0.15]);
    fill(od.sleeve, capsule(S, M, 0.078 * unit, 0.07 * unit));
    fill(skin, capsule(M, E, 0.055 * unit, 0.05 * unit), true, 4);
    fill(skin, capsule(E, T, 0.05 * unit, 0.042 * unit), true, 4);
    fill(skinShade, ell(T[0], T[1] + 0.02 * unit, 0.035 * unit, 0.045 * unit, 14), true, 4);
  };
  hangArm(-1);
  if (pose === 'idle') hangArm(1);

  // Shirt back (grey-blue work shirt, tucked out), yoke seam, centre pleat; collar band; neck and nape.
  const shirt = od.shirt;
  fill(shirt, [at([-sw + 0.017, shV - 0.02]), at([-0.07, shV + 0.005]), at([0.07, shV + 0.005]), at([sw - 0.017, shV - 0.02]), at([sw + 0.005, shV - 0.07]), at([hw + 0.02, hip0 - 0.02]), at([hw + 0.024, hip0 - 0.07]), at([-hw - 0.024, hip0 - 0.07]), at([-hw - 0.02, hip0 - 0.02]), at([-sw - 0.005, shV - 0.07])]);
  const sl = lineOf(toneOf(shirt, L), L);
  inkLine(p, base + 760, [at([-sw + 0.03, shV - 0.08]), at([0, shV - 0.1]), at([sw - 0.03, shV - 0.08])], {closed: false, weight: 0.8, curve: 0.3, color: sl});
  inkLine(p, base + 761, [at([0, shV - 0.1]), at([0.004, hip0 - 0.05])], {closed: false, weight: 0.7, curve: 0.1, color: sl});
  inkLine(p, base + 762, [at([-hw + 0.02, hip0 - 0.01]), at([-0.05, hip0 + 0.02])], {closed: false, weight: 0.7, curve: 0.3, color: sl});

  // Raised arm for the wave (P07, from behind): upper arm out and up, forearm up beside the head, open hand.
  if (pose === 'wave') {
    const S = at([sw - 0.02, shV - 0.02]), M = at([sw + 0.1, shV + 0.05]), E = at([sw + 0.17, shV + 0.12]), T = at([sw + 0.13, shV + 0.4]);
    fill(od.sleeve, capsule(S, M, 0.078 * unit, 0.07 * unit));
    fill(skin, capsule(M, E, 0.055 * unit, 0.05 * unit), true, 4);
    fill(skin, capsule(E, T, 0.05 * unit, 0.044 * unit), true, 4);
    fill(skinShade, ell(T[0], T[1] - 0.03 * unit, 0.04 * unit, 0.055 * unit, 14, -0.15), true, 4);
  }

  // Reach seen from behind and to the side (S04-B01-SH04, P16): sleeve, forearm and a flat hand with the fingertips on the glass.
  if (pose === 'reach' && o.reachElbow) {
    const S = at([sw - 0.03, shV - 0.03]), E = o.reachElbow, T = o.reachTo ?? at([sw + 0.25, shV + 0.05]);
    const M: Pt = [(S[0] + E[0]) / 2, (S[1] + E[1]) / 2], hw2 = o.reachHandPx ?? 0.03 * unit;
    fill(od.sleeve, capsule(S, E, 0.078 * unit, 0.065 * unit));
    fill(mixColor(skin, VD18.shadow, 0.1), capsule(E, T, 0.05 * unit, 0.04 * unit), true, 4);
    // Back of the hand: palm ellipse behind the fingertips, four short fingers fanning up, thumb inward.
    const palm: Pt = [T[0] - (T[0] - E[0]) * 0.06, T[1] + hw2 * 0.9];
    fill(skinShade, ell(palm[0], palm[1], hw2 * 1.0, hw2 * 1.15, 14), true, 4);
    for (let i = 0; i < 4; i++) {
      const fx = palm[0] + (i - 1.5) * hw2 * 0.5;
      fill(skinShade, capsule([fx, palm[1] - hw2 * 0.5], [fx + (i - 1.5) * hw2 * 0.08, T[1] - hw2 * 0.9], hw2 * 0.22, hw2 * 0.18), true, 4);
    }
    fill(skinShade, capsule([palm[0] - hw2 * 0.8, palm[1]], [palm[0] - hw2 * 1.2, palm[1] - hw2 * 0.9], hw2 * 0.24, hw2 * 0.2), true, 4);
  }

  // Head from behind: neck under the nape, ears at the sides, the crop hair cap down to a low nape hairline. No face part.
  const hc = at([0, chin + CHIN * K]), k = K * unit;
  const head = ([u, v]: Pt): Pt => [hc[0] + u * k, hc[1] + v * k];
  const H2 = (pts: number[][]) => pts.map((q) => head(q as Pt));
  fill(skinShade, H2([[-0.5, 0.5], [0.5, 0.5], [0.46, 1.5], [-0.46, 1.5]]), true, 4);
  fill(mixColor(shirt, '#ffffff', 0.08), [at([-0.075, shV - 0.005]), at([0.075, shV - 0.005]), at([0.07, shV + 0.025]), at([-0.07, shV + 0.025])], true, 4);
  for (const s of [-1, 1]) fill(s < 0 ? skin : skinShade, ell(s * 0.98, 0.16, 0.17, 0.3, 12).map((q) => head(q as Pt)), true, 4);
  const cap = headOutline(56).map(([u, v]): Pt => [u * 0.98, v * 1.02 - 0.02]).filter(([, v]) => v < 0.6);
  const right = cap.filter(([u]) => u >= 0).sort((a, b) => b[1] - a[1]);
  const left = cap.filter(([u]) => u < 0).sort((a, b) => a[1] - b[1]);
  const hairline: Pt[] = [[-0.86, 0.6], [-0.74, 0.84], [-0.46, 0.98], [-0.16, 1.04], [0.16, 1.04], [0.46, 0.98], [0.74, 0.84], [0.86, 0.6]];
  fill(def.head.hair, [...right, ...left, ...hairline].map(head), true, 6);
  const hairC = toneOf(def.head.hair, L);
  // Sunlit side of the hair (camera-left), and short combed strokes from the crown (the crop's texture).
  washAt(p, base + 795, '#8e9ca6', 120, H2([[-0.9, 0.2], [-0.92, -0.3], [-0.6, -0.85], [-0.2, -1.0], [-0.35, -0.5], [-0.6, 0.1]]), 0.15, 0.4);
  const strokes = [[-0.62, -0.6, -0.8, 0.0], [-0.3, -0.75, -0.4, 0.1], [0.0, -0.8, 0.0, 0.2], [0.3, -0.75, 0.4, 0.1], [0.62, -0.6, 0.8, 0.0], [-0.45, 0.25, -0.38, 0.85], [0.45, 0.25, 0.38, 0.85], [-0.12, 0.3, -0.1, 0.95], [0.14, 0.3, 0.12, 0.95]];
  strokes.forEach(([u0, v0, u1, v1], i) => inkLine(p, base + 780 + i, H2([[u0, v0], [(u0 + u1) / 2 + 0.03, (v0 + v1) / 2], [u1, v1]]), {closed: false, weight: 0.7, curve: 0.4, color: mixColor(hairC, '#9aa7ae', 0.35)}));
  inkLine(p, base + 790, H2([[-0.55, -0.85], [-0.2, -1.0], [0.15, -0.98]]), {closed: false, weight: 2.0, curve: 0.5, color: mixColor(hairC, '#d8dde0', 0.45)});
};
