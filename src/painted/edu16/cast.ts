import {ell, hardFill, inkLine} from '../kit/draw';
import type {CastDef, FigAnchors} from '../kit/cast';
import {MACRO_TONES, type MacroTone} from '../kit/hands';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';

// EDU-EP16-SHORT cast (brief EDU-EP16-BRIEF-R2: casting `woman-bob, P31`, N2 aged states, headphones gear; Film W3 group 2, 2026-11-14; Boss hardens).
// WOMAN = kit `woman-bob` unchanged (coral cardigan base outfit, VD03). Aged states are head/outfit overrides only (no kit change): hair colour,
// `HeadStyle.lines`, a darker brow on grey hair, cardigan faded toward dusty rose, and a stoop (shoulders down, head forward-down).

export const WOMAN: CastDef = PEOPLE['woman-bob'];

export type AgeKey = 'a21' | 'a50' | 'a81';
/** Aged WOMAN (VD07): 21 = the template; ~50 salt-and-pepper, lines on; ~81 grey `#d4cfc8`, lines, faded cardigan, stoop. The bob cut stays (identity). */
export const AGED: Record<AgeKey, {def: CastDef; stoop: number; label: string}> = {
  a21: {def: WOMAN, stoop: 0, label: '21'},
  a50: {def: {...WOMAN, head: {...WOMAN.head, hair: '#5e5751', lines: true, brows: '#3a332e'}, outfit: {...WOMAN.outfit, jacket: '#bd776a', sleeve: '#bd776a'}}, stoop: 0.35, label: '~50'},
  a81: {def: {...WOMAN, head: {...WOMAN.head, hair: '#d4cfc8', lines: true, brows: '#8f8880'}, outfit: {...WOMAN.outfit, jacket: '#b48c88', sleeve: '#b48c88', shirt: '#e6e1d6'}}, stoop: 1, label: '~81'},
};
/** Body fields for a stoop 0..1 (front view): shoulders drop, the head comes forward and down. */
export const stoopFig = (k: number) => (k ? {rise: -0.03 * k, nod: [0, 0.07 * k] as Pt} : {});
/** Headphones are kit gear since W5.2 (`kit/headphones.ts`); re-exported for the W3 look modules. */
export {paintHeadphones} from '../kit/headphones';


/** Her hand for the macro shots (SH03, SH17, SH19, SH20): `woman-bob` skin (#f2d2b0), coral cardigan cuff. Episode-local; kit lacks it (N9). */
export const HAND16: MacroTone = {...MACRO_TONES.girl, skin: '#f2d2b0', shade: '#d9b28c', deep: '#c49c78', nail: '#f8e6da', crease: '#ad8a6a', sleeve: '#c46a5a', sleeveShade: '#9a4e42'};

/**
 * W3 v8 (user "the hands need fixing"): a UT14 mitten over the rig's oval hand at small scale. `point` = a round fist with one index lobe toward the
 * target (the press), the thumb an ink curve across the front; `rest` = an open mitten lying flat, the thumb a lobe on the `side` edge. Local u runs
 * from the wrist along the forearm (elbow -> hand), v across; sizes in metres x `unit` px/m, drawn a little larger than the rig oval
 * (0.045 x 0.052 U at wrist + 0.03 U) so it covers it. Episode-local; Boss may harden it into the kit (no `Arm.fist` outside `InteriorLight.shaped`).
 */
export type MittKind = 'point' | 'rest' | 'fist';
export const paintMitten = (p: Painter, a: FigAnchors, o: {hand: 'r' | 'l'; kind: MittKind; unit: number; skin: string; side: 1 | -1; seed: number; ink?: string; rim?: {color: string; dx: number}[]; lobe?: number; aim?: Pt}) => {
  const hand = o.hand === 'r' ? a.rHand : a.lHand, sh = o.hand === 'r' ? a.rShoulder : a.lShoulder, up = o.hand === 'r' ? a.rUpper : a.lUpper;
  // W5.2 round 2 hardening (open item 3): a non-finite or degenerate aim (closer than 0.02 U to the hand) falls back to the forearm direction; the
  // forearm direction falls back to pointing down-forward when the rig's elbow and hand coincide; an explicit `lobe` is clamped to 0.015-0.08 U
  const k = Math.max(1e-3, o.unit), fin = (v?: Pt): v is Pt => !!v && Number.isFinite(v[0]) && Number.isFinite(v[1]);
  const E: Pt = [2 * up[0] - sh[0], 2 * up[1] - sh[1]], aim = fin(o.aim) && o.kind === 'point' && Math.hypot(o.aim[0] - hand[0], o.aim[1] - hand[1]) > 0.02 * k ? o.aim : undefined;
  const fore = Math.hypot(hand[0] - E[0], hand[1] - E[1]) > 1 ? Math.atan2(hand[1] - E[1], hand[0] - E[0]) : Math.PI / 2;
  const ang = aim ? Math.atan2(aim[1] - hand[1], aim[0] - hand[0]) : fore, c = Math.cos(ang), s = Math.sin(ang);
  // `aim` (plate px, `point` only): the fist turns at the wrist toward the target; the mitten is then centred on the rig hand so it still covers the oval
  const T: Pt = aim ? [hand[0] - c * 0.045 * k, hand[1] - s * 0.045 * k] : [hand[0] - c * 0.03 * k, hand[1] - s * 0.03 * k];
  const P = ([u, v]: Pt, dx = 0): Pt => [T[0] + (u * c - v * o.side * s) * k + dx, T[1] + (u * s + v * o.side * c) * k];
  const smooth = (pts: Pt[]) => { let q = pts; for (let r = 0; r < 2; r++) q = q.flatMap((m, i): Pt[] => { const n = q[(i + 1) % q.length]; return [[m[0] * 0.75 + n[0] * 0.25, m[1] * 0.75 + n[1] * 0.25], [m[0] * 0.25 + n[0] * 0.75, m[1] * 0.25 + n[1] * 0.75]]; }); return q; };
  // with `aim` and no `lobe`, the finger stops just short of the target (the hover: tip about 0.012 U above it on screen)
  const L = Number.isFinite(o.lobe) ? Math.max(0.015, Math.min(0.08, o.lobe!)) : aim ? Math.max(0.02, Math.min(0.07, Math.hypot(aim[0] - hand[0], aim[1] - hand[1]) / k - 0.053 - 0.012)) : 0.05;
  const outline: Pt[] = o.kind === 'point'
    ? [[-0.008, -0.044], [0.02, -0.058], [0.05, -0.062], [0.076, -0.055], [0.088, -0.034], [0.088 + L, -0.03], [0.098 + L, -0.017], [0.09 + L, -0.004], [0.096, 0.0], [0.098, 0.016], [0.09, 0.04], [0.072, 0.058], [0.045, 0.064], [0.02, 0.058], [-0.008, 0.044]]
    : o.kind === 'fist' // W5.2 round 2: a closed round fist (withdraw-to-chest, SH20/SH21 left hand), UT14: no fingers, the thumb across, two strokes
      ? [[-0.008, -0.04], [0.02, -0.056], [0.05, -0.062], [0.076, -0.056], [0.094, -0.036], [0.1, -0.01], [0.098, 0.016], [0.088, 0.04], [0.07, 0.056], [0.045, 0.062], [0.02, 0.056], [-0.008, 0.042]]
      : [[-0.008, -0.044], [0.03, -0.058], [0.07, -0.058], [0.105, -0.05], [0.126, -0.032], [0.134, -0.008], [0.129, 0.014], [0.114, 0.03], [0.09, 0.038], [0.078, 0.044], [0.088, 0.062], [0.078, 0.074], [0.058, 0.072], [0.032, 0.062], [-0.008, 0.046]];
  const ink = o.ink ?? '#2a2326', dark = mixColor(o.skin, '#3a2a2a', 0.28);
  (o.rim ?? []).forEach((r, i) => hardFill(p, o.seed + 10 + i, r.color, smooth(outline.map((v) => P(v, r.dx)))));
  const body = smooth(outline.map((v) => P(v)));
  hardFill(p, o.seed, o.skin, body);
  // the side away from the lamp a shade darker (the thumb edge of the far half), so the mitten has a form, not a flat cut-out
  const shadeSide: Pt[] = o.kind !== 'rest' ? [[0.0, 0.03], [0.04, 0.05], [0.07, 0.048], [0.088, 0.03], [0.094, 0.012], [0.07, 0.022], [0.035, 0.026]] : [[0.0, 0.032], [0.05, 0.046], [0.1, 0.03], [0.126, 0.012], [0.1, 0.018], [0.05, 0.03]];
  hardFill(p, o.seed + 1, dark, smooth(shadeSide.map((v) => P(v))));
  inkLine(p, o.seed + 2, body, {color: ink, weight: 1.3, closed: true, curve: 0.3});
  if (o.kind !== 'rest') {
    inkLine(p, o.seed + 3, [[0.034, 0.05], [0.054, 0.034], [0.074, 0.018]].map((v) => P(v as Pt)), {color: dark, weight: 1.1, closed: false, curve: 0.5}); // the thumb across the fist
    (o.kind === 'fist' ? [-0.03, -0.01, 0.01] : [0.006, 0.026]).forEach((v, i) => inkLine(p, o.seed + 4 + i, [[o.kind === 'fist' ? 0.084 : 0.08, v], [o.kind === 'fist' ? 0.096 : 0.09, v + 0.002]].map((w) => P(w as Pt)), {color: dark, weight: 1.0, closed: false, curve: 0.3})); // the curled fingers
  } else {
    [-0.03, -0.012, 0.006].forEach((v, i) => inkLine(p, o.seed + 4 + i, [[0.106, v], [0.124, v + 0.001]].map((w) => P(w as Pt)), {color: dark, weight: 1.0, closed: false, curve: 0.3}));
    inkLine(p, o.seed + 3, [[0.056, 0.04], [0.04, 0.038], [0.026, 0.032]].map((v) => P(v as Pt)), {color: dark, weight: 1.0, closed: false, curve: 0.5}); // thumb root crease
  }
};
