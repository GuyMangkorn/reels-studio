import {shoulderPoint, type Arm, type FigAnchors, type FigPose} from '../kit/cast';
import {ell, inkLine, solid} from '../kit/draw';
import {EXPRESSIONS, type ExpressionId} from '../kit/expressions';
import {paintFigureAt, rollPt, withRoll} from '../kit/figure-at';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {PEOPLE} from '../kit/people';
import {poseBody} from '../kit/poses';
import type {View4} from '../kit/views';
import type {V3} from '../kit/space';
import {camPoint, camUnit, type YCam} from '../kit/ycam';
import {clamp01, ease} from '../kit/space';

// WOMAN (`woman-curly`, kit person, own outfit: mustard blouse, plum skirt, flip-flops; brief D01) plus the three new looks the brief asks for:
// N3 `new: tote-bag` prop and `new: bag-over-head` arms, N4 `new: pressed-spread` (face-down view `below` against a surface above, arms and legs spread,
// hair fanned), N5 `new: slap-ankle` motion (bend, the right hand slaps the left ankle at +18, recover by +40). Episode-local until kit intake (W8, KIT-P01).
// Arm targets are metres from the shoulder (x toward the facing side, y up) as the kit tables write them; `L` is the shot-local EVENT frame.
export const WOMAN = PEOPLE['woman-curly'];
export const SKIN = WOMAN.head.skin;
export const NAMED = ['bag-over-head', 'pressed-spread', 'slap-ankle'] as const;
export type Named = (typeof NAMED)[number];
export const TOTE = {canvas: '#d9cbb0', stripe: '#3f6f55', shade: '#b4a589', w: 0.46, h: 0.34} as const;

type Spec = {to: Pt; via: Pt; behind?: Arm['behind']};
const BASE: Record<Named, 'P01' | 'P38' | 'P45' | 'P35'> = {'bag-over-head': 'P38', 'pressed-spread': 'P45', 'slap-ankle': 'P35'};
type Body = Partial<Pick<FigPose, 'crouch' | 'lean' | 'run' | 'rise' | 'nod' | 'bend'>>;

/** Slap-ankle phases on the event clock (brief N5): +0..+14 spot it and bend, +14..+18 strike, slap at +18, hold to +22, straighten +22..+40, palm look +30. */
export const SLAP = {bendTo: 14, strike: [14, 18] as const, hit: 18, hold: 22, straighten: [22, 40] as const, palm: 30};
export const slapPhase = (L: number) => {
  const bend = L < SLAP.bendTo ? ease(clamp01(L / SLAP.bendTo)) : L < SLAP.hold ? 1 : 1 - ease(clamp01((L - SLAP.straighten[0]) / (SLAP.straighten[1] - SLAP.straighten[0])));
  const strike = ease(clamp01((L - SLAP.strike[0]) / (SLAP.strike[1] - SLAP.strike[0])));
  const palm = L >= SLAP.palm ? ease(clamp01((L - SLAP.palm) / 4)) : 0;
  return {bend, strike, palm, hit: L >= SLAP.hit && L < SLAP.hold};
};

const hold = (to: Pt, via: Pt, behind?: Arm['behind']): Spec => ({to, via, ...(behind ? {behind} : {})});
/** Body fields and arm specs of a named pose at event frame `L`. */
export const namedSpec = (name: Named, L: number, view: 'front' | 'left' | 'right'): {body: Body; r: Spec; l: Spec; ankle?: boolean} => {
  switch (name) {
    case 'bag-over-head': { // both hands up at the bag's corners above the head (the run bounce is the figure's `run` phase)
      const run = view === 'front' ? {} : {run: 0.22 + 0.5 * ((L / 12) % 1) - 0.25};
      return view === 'front'
        ? {body: run, r: hold([-0.2, 0.5], [-0.34, 0.24], 'upper'), l: hold([0.2, 0.5], [0.34, 0.24], 'upper')}
        : {body: run, r: hold([0.08, 0.5], [0.2, 0.26], 'upper'), l: hold([-0.04, 0.5], [0.12, 0.28], 'upper')};
    }
    case 'pressed-spread': // starfish, arms up and out, fingers splayed; the whole card is rolled by the shot (`rollDeg`)
      return {body: {crouch: 0}, r: hold([-0.5, 0.3], [-0.26, 0.12]), l: hold([0.5, 0.3], [0.26, 0.12])};
    case 'slap-ankle': {
      const s = slapPhase(L);
      const body: Body = {crouch: 0.86 * s.bend, lean: 0.34 * s.bend, nod: [0.04 * s.bend, -0.12 * s.bend]};
      // the right arm (screen left in the front view) crosses to her left ankle; at the palm look it is held up in front of the chest
      const down: Pt = [0.18, -0.62], up: Pt = [0.12, 0.02];
      const rest: Spec = hold([-0.08, -0.5], [-0.12, -0.26]);
      const strikeTo: Pt = [down[0] * s.strike + (1 - s.strike) * -0.1, down[1] * s.strike + (1 - s.strike) * -0.5];
      const to: Pt = L >= SLAP.hold ? [strikeTo[0] + (up[0] - strikeTo[0]) * s.palm, strikeTo[1] + (up[1] - strikeTo[1]) * s.palm] : strikeTo;
      return {body, r: s.bend > 0.01 ? hold(to, [to[0] * 0.5 - 0.1, to[1] * 0.5 + 0.1]) : rest, l: hold([0.06, -0.5], [0.12, -0.26]), ankle: s.bend > 0.5};
    }
  }
};

export type WomanOpts = {
  at: V3; view?: View4; face?: ExpressionId; t: number;
  named?: {name: Named; L: number};
  /** Whole-card roll in degrees about the hips (`pressed-spread` lies along +x: -90 = head toward screen left). */
  roll?: number;
  fig?: Partial<FigPose>;
  /** Contact shadow (default true). */
  shadow?: boolean;
  scale?: number;
  tint?: {to: string; u: number; mul?: [number, number, number]};
  /** Draw the tote over the head from the hands (`bag-over-head`) and its slope in degrees (run bounce). Default true with that pose. */
  tote?: boolean;
  /** Props drawn after the figure (px per metre). */
  held?: (p: Painter, a: FigAnchors, u: number) => void;
};

const shoulderOf = (g: Pt, u: number, view: 'front' | 'left' | 'right', body: Body & Partial<FigPose>, base: keyof typeof poseBaseView, side: 'r' | 'l') =>
  shoulderPoint(WOMAN, g, u, {view, ...poseBody(base, view === 'front' ? 'front' : 'right'), ...body} as Parameters<typeof shoulderPoint>[3], side);
const poseBaseView = {P01: 1, P38: 1, P45: 1, P35: 1} as const;

/** WOMAN through the yaw camera: kit figure squared to the lens plus the named looks. Returns the anchors, or null behind the lens. */
export const paintWoman = (p: Painter, c: YCam, o: WomanOpts): FigAnchors | null => {
  const g = camPoint(c, o.at), u0 = camUnit(c, o.at);
  if (!g) return null;
  const u = u0 * (o.scale ?? 1);
  let fig: Partial<FigPose> = {...o.fig}, pose: 'P01' | 'P38' | 'P45' | 'P35' = 'P01', spec: ReturnType<typeof namedSpec> | undefined;
  // resolve the view the card will be drawn in, to hang the arms from the right shoulders
  const probe = paintViewOf(c, o);
  if (o.named) {
    pose = BASE[o.named.name];
    spec = namedSpec(o.named.name, o.named.L, probe);
    const body = {...spec.body, ...o.fig};
    const mk = (side: 'r' | 'l', s: Spec): Arm => {
      const sh = shoulderOf(g, u, probe, body, pose, side), dir = probe === 'left' ? -1 : 1;
      const px = (q: Pt): Pt => [sh[0] + dir * q[0] * u, sh[1] - q[1] * u];
      return {to: px(s.to), via: px(s.via), ...(s.behind ? {behind: s.behind} : {})};
    };
    fig = {...spec.body, rArm: mk('r', spec.r), lArm: mk('l', spec.l), ...o.fig};
  }
  let anchors: FigAnchors | null = null;
  const withTote = (o.tote ?? o.named?.name === 'bag-over-head') && o.named?.name === 'bag-over-head';
  anchors = paintFigureAt(p, c, WOMAN, {
    at: o.at, view: o.view ?? 'front', pose, face: o.face ?? 'neutral', t: o.t, fig, shadow: o.shadow === false ? false : undefined, scale: o.scale, tint: o.tint,
    roll: o.roll, held: (q, a, uu) => { if (withTote) paintTote(q, a.lHand, a.rHand, uu, o.named!.L); o.held?.(q, a, uu); },
  });
  return anchors;
};

/** The view (front / left / right) the camera resolves for a placement (back view falls to front for the arms; the tote is a front/side prop). */
const paintViewOf = (c: YCam, o: Pick<WomanOpts, 'at' | 'view'>): 'front' | 'left' | 'right' => {
  const v = o.view ?? 'front';
  // `view` is squared to the lens (View4): front/back face the lens, left/right side-on to it
  return v === 'left' ? 'left' : v === 'right' ? 'right' : 'front';
};
void EXPRESSIONS; void mixColor; void rollPt; void withRoll;

/** N3 `new: tote-bag`: a canvas tote held over the head by its two top corners (hands at `a` and `b`, screen px; `u` px per metre). The bag hangs as a
 * roof: its top edge between the hands, the body drooping 0.34 m behind/over, a green stripe and the strap loops. Seeds 61xx. */
export const paintTote = (p: Painter, a: Pt, b: Pt, u: number, L = 0) => {
  const l = a[0] <= b[0] ? a : b, r = a[0] <= b[0] ? b : a;
  const span = Math.max(Math.hypot(r[0] - l[0], r[1] - l[1]), 0.1 * u), w = Math.max(span * 1.25, TOTE.w * u), cx = (l[0] + r[0]) / 2, cy = (l[1] + r[1]) / 2 - 0.02 * u;
  const sag = 0.04 * u, h = TOTE.h * u * 0.78, tilt = (r[1] - l[1]) / Math.max(1, r[0] - l[0]);
  const top = (x: number): number => cy + tilt * (x - cx) + 0.01 * u; // the hand line; the bag stands ABOVE it (hands hold its two lower corners)
  const lo = (x: number) => top(x), hi = (x: number) => top(x) - h;
  const body: Pt[] = [[cx - w / 2, hi(cx - w / 2) + sag], [cx, hi(cx) - sag * 1.2], [cx + w / 2, hi(cx + w / 2) + sag], [cx + w / 2 - 0.02 * u, lo(cx + w / 2)], [cx, lo(cx) + 0.03 * u], [cx - w / 2 + 0.02 * u, lo(cx - w / 2)]];
  solid(p, 6101, TOTE.canvas, body, 3);
  solid(p, 6102, TOTE.shade, [body[3], body[4], body[5], [body[5][0] + 0.02 * u, body[5][1] - 0.07 * u], [body[3][0] - 0.02 * u, body[3][1] - 0.07 * u]], 2);
  // the green stripe 1/3 down, two thin lines
  const y1 = (x: number) => hi(x) + h * 0.4;
  solid(p, 6103, TOTE.stripe, [[cx - w / 2 + 0.01 * u, y1(cx - w / 2) - 0.02 * u], [cx + w / 2 - 0.01 * u, y1(cx + w / 2) - 0.02 * u], [cx + w / 2 - 0.012 * u, y1(cx + w / 2) + 0.025 * u], [cx - w / 2 + 0.012 * u, y1(cx - w / 2) + 0.025 * u]], 2);
  inkLine(p, 6104, body, {weight: 0.9, color: mixColor(TOTE.canvas, '#2b211c', 0.65), curve: 0.15});
  // top edge folds and the two strap loops up to the hands
  [l, r].forEach((q, i) => { const o = i === 0 ? -1 : 1; inkLine(p, 6105 + i, [[q[0] + o * 0.01 * u, q[1] + 0.02 * u], [q[0] + o * 0.05 * u, q[1] - 0.05 * u], [q[0] + o * 0.12 * u, lo(q[0] + o * 0.12 * u) - 0.04 * u]], {weight: 1.4, color: TOTE.stripe, closed: false, curve: 0.5}); });
  void L; void ell;
};

/** Screen position of her left ankle in the front view (the slap target): her feet point plus (0.09, -0.07) m in her frame, `u` px per metre. */
export const ankleOf = (feet: Pt, u: number): Pt => [feet[0] + 0.09 * u, feet[1] - 0.07 * u];

/** Scale everything `draw` paints by `s` about the picture point `about` (the shrink pop: the whole card, props and shadow, to the touch point). */
export const withShrink = (p: Painter, about: Pt, s: number, draw: () => void) => {
  if (s >= 0.9999) { draw(); return; }
  p.brush.push();
  p.brush.translate(about[0], about[1]);
  p.brush.scale(s);
  p.brush.translate(-about[0], -about[1]);
  draw();
  p.brush.pop();
};
