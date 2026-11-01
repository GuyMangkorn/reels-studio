import {H, type CastDef} from '../kit/cast';
import {capsule, ell, glaze, inkLine, lineOf, limb, toneOf, VD18, type InteriorLight} from '../kit/draw';
import {CHIN, HEAD_SPAN, paintHeadSide, type FaceState} from '../kit/head';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {backFill, paintBackHead} from './narrator-back';

// The narrator seen from behind on the street (S02-B01-SH01 and SH02, user note 1 Nov 2026: she walks away from the camera,
// bottom of the frame up the street, on the same perspective axis as LF02). The kit rig has no back view
// (DF-20261101-kso-look-stills), so this is new episode art built from the rig's own levels like `narrator-back.ts` (which supplies the
// back of the head, hair and nape): walking legs (the kit front-view gait: heel lift, hip bob), swinging arms, the jacket back.
// At `turn` > 0.5 the head shows in profile (kit `paintHeadSide`) while the body stays from behind: the curious side glance of
// SH02 (instead of a full look back). Pure in its arguments.

const K = H / HEAD_SPAN;

/** Paint the walker at ground point `g` (plate px, `unit` px per metre). `walk` is the gait phase in cycles (undefined = standing), `turn` 0..1 the head turn to screen left. */
export const paintWalkerBack = (p: Painter, def: CastDef, g: Pt, unit: number, L: InteriorLight, t: number, o: {walk?: number; turn?: number; face?: FaceState} = {}) => {
  const od = def.outfit;
  const jacket = od.jacket ?? od.shirt;
  const chin = def.height - H, shV = chin - 0.16 * H;
  const hip0 = shV - (chin - 0.068) * 0.44 + 0.034, crotch0 = hip0 - 0.0425, ankleV = 0.038;
  const sw = od.shoulder * H, hw = 0.3 * H;
  const walking = o.walk !== undefined, ph = (o.walk ?? 0) * Math.PI * 2;
  const bob = walking ? 0.018 * Math.abs(Math.sin(ph)) : 0;
  const sway = walking ? 0.012 * Math.sin(ph) : 0;
  const hipV = hip0 - bob;
  const at = ([u, y]: Pt): Pt => [g[0] + u * unit, g[1] - y * unit];
  const upper = ([u, y]: Pt): Pt => at([u + sway, y - bob]); // the upper body sways and drops with the hips
  const base = def.seed * 1000 + 500;
  const fill = backFill(p, base, L);

  glaze(p, base + 900, '#0e1213', 120, ell(g[0], g[1] + 0.01 * unit, 0.26 * 1.15 * unit, 0.07 * unit, 16), {border: 0.1, bleed: 0.15});
  glaze(p, base + 901, '#07090a', 160, ell(g[0], g[1] + 0.005 * unit, 0.2 * unit, 0.03 * unit, 16), {border: 0.1, bleed: 0.08});

  // Legs (the far-stepping heel lifts: the sole shows as a darker sliver), shoes from behind.
  for (const s of [-1, 1] as const) {
    const lift = walking ? 0.06 * Math.max(0, Math.sin(ph + (s > 0 ? Math.PI : 0))) : 0;
    const hip: Pt = [s * 0.0725 + sway, hipV], ankle: Pt = [s * 0.08, ankleV + lift], knee: Pt = [s * 0.077, (hipV + ankle[1]) / 2 + lift * 0.4];
    const leg = mixColor(od.pants, '#000000', s > 0 ? 0 : 0.06);
    fill(leg, limb(hip, knee, 0.11, 0.095).map(at));
    fill(leg, limb(knee, ankle, 0.095, 0.08).map(at));
    const shoe = od.shoes;
    fill(shoe, ell(ankle[0] + s * 0.017, ankle[1] - 0.017, 0.068, 0.03, 14).map((q) => at(q as Pt)));
    if (lift > 0.01) inkLine(p, base + 910 + (s > 0 ? 1 : 0), [at([ankle[0] + s * 0.017 - 0.05, ankle[1] - 0.03]), at([ankle[0] + s * 0.017 + 0.05, ankle[1] - 0.03])], {closed: false, weight: 1.2, color: lineOf(toneOf(shoe, L), L)});
  }
  // Hips and the jacket back with its seam, yoke and hem.
  fill(od.pants, [upper([-hw - 0.0085, hip0 + 0.0255]), upper([hw + 0.0085, hip0 + 0.0255]), at([hw, crotch0 - bob]), at([-hw, crotch0 - bob])], false);
  // Arms swing from the shoulders; seen from behind the swing shows as the hand rising and falling, a little out and in.
  for (const s of [-1, 1] as const) {
    const swing = walking ? 0.5 * Math.sin(ph + (s > 0 ? 0 : Math.PI)) : 0;
    const S = upper([s * (sw - 0.02), shV - 0.03]);
    const lenA = 0.52 * Math.cos(swing);
    const T = upper([s * (sw + 0.02 - 0.03 * Math.abs(swing)), shV - 0.03 - lenA + 0.02]);
    const E = upper([s * (sw + 0.025), shV - 0.03 - lenA * 0.52]);
    fill(od.sleeve, capsule(S, E, 0.075 * unit, 0.065 * unit));
    fill(od.sleeve, capsule(E, T, 0.065 * unit, 0.055 * unit));
    fill(mixColor(def.head.skin, VD18.shadow, 0.2), ell(T[0], T[1], 0.03 * unit, 0.035 * unit, 14), true, 4);
  }
  fill(jacket, [upper([-sw + 0.017, shV - 0.03]), upper([-0.07, shV - 0.01]), upper([0.07, shV - 0.01]), upper([sw - 0.017, shV - 0.03]), upper([sw, shV - 0.06]), upper([hw + 0.013, hip0 - 0.03]), upper([-hw - 0.013, hip0 - 0.03]), upper([-sw, shV - 0.06])]);
  fill(od.shirt, [upper([-0.07, shV - 0.01]), upper([0.07, shV - 0.01]), upper([0.075, shV + 0.012]), upper([-0.075, shV + 0.012])], true, 4);
  const jl = lineOf(toneOf(jacket, L), L);
  inkLine(p, base + 761, [upper([0, shV - 0.01]), upper([0, hip0 - 0.02])], {closed: false, weight: 1.0, curve: 0.1, color: jl});
  for (const s of [-1, 1]) inkLine(p, base + 762 + (s > 0 ? 1 : 0), [upper([s * (sw - 0.03), shV - 0.05]), upper([s * 0.09, shV - 0.02])], {closed: false, weight: 0.9, curve: 0.3, color: jl});

  // Head: from behind (hair, nape), or turned to profile (screen left) at `turn` > 0.5.
  const turn = o.turn ?? 0;
  const hc = upper([0, chin + CHIN * K]), k = K * unit;
  if (turn <= 0.5) {
    const sx = Math.max(0.3, Math.cos(turn * Math.PI));
    paintBackHead(p, def, ([u, v]: Pt): Pt => [hc[0] + u * k * sx, hc[1] + v * k], L, base, fill);
  } else {
    const skinShade = mixColor(def.head.skin, VD18.shadow, 0.3);
    fill(skinShade, [upper([-0.045, shV - 0.01]), upper([0.045, shV - 0.01]), upper([0.04, chin + 0.03]), upper([-0.04, chin + 0.03])], false, 4);
    paintHeadSide(p, def.seed + 1, hc[0] - 0.02 * unit, hc[1], k, o.face ?? {brow: 'worry', eyes: 'wide', look: [-0.6, 0], mouth: 'flat'}, def.head, -1, t, 0, L);
  }
};
