import {hash} from '../kit/hash';
import {lerp, mixColor, type Painter, type Pt} from '../kit/painter';
import {INK, ell, inkLine, limb, solid, washAt} from './draw';
import {BROW_Y, headOutline} from '../kit/head';
import {
  DEG, STOP, add3, asmAt, bump, clamp01, ease, hermite, len3, lensAt, lightAt, mix3, scale3, seg, smoothstep, sub3,
  type Proj, type V3,
} from './space';

// WFOG-ASSEMBLY (MK-WF-DEP-04; brief VD04, VD05, VD17; index ST-03, ST-04, ST-06, ST-09): worker + platform cart +
// carton stack + red helmet + closed umbrella as one geometry with a per-part `light` colour lerp (silhouette 0 ->
// lit 1), the R3 lean, the poses PUSH / BRACE-TAP / CATCH / MATCH / LIT-LOWER on the story clock, the flat-card cart in
// front views, the fog-lens warp FW-A, and a lit side view for the profile shots (S03-SH07). Promoted from the spike
// `src/painted/spike/WfogShop.tsx` (SP01/SP04 previews) and re-keyed to SS-R3.1.

// ------------------------------------------------------------------ palette (VD16)

export const SIL = '#21272a';
export const LIT = {
  coat: '#2f4a5e', coatShade: '#233848', boot: '#1c1e20', glove: '#26292c', skin: '#c48c5c', skinShade: '#a8724a', hair: '#1f1d1b',
  kraft: '#b98d58', kraftShade: '#93693c', tape: '#cfae7a', label: '#e4ddcd', helmet: '#b8392c', helmetShade: '#8e2a21',
  visor: '#2b3238', cart: '#6a7076', cartDark: '#3a3f44', wheel: '#121516', umbrella: '#30353b', white: '#f4efe4', mouth: '#3b2a24',
};

// ------------------------------------------------------------------ pose

export type Umbrella = {
  /** Holding hand (left glove drawn there) or null when hooked / leaning on the cart. */
  hand: V3 | null;
  tip: V3;
  /** Handle end when not held (hooked on the cart handle). */
  handle?: V3;
  /** Draw behind the carton stack (hooked / leaning). */
  behind?: boolean;
};

export type AsmPose = {
  S: {xs: number; zs: number};
  helmet: {c: V3; a: number};
  rHand: V3; lHand: V3;
  umbrella: Umbrella;
  /** Right glove layer: behind the stack (brace from S03-SH03 f56), under the helmet (catch) or over it (rim). */
  glove: 'under-stack' | 'under-helmet' | 'over-helmet';
  dip: number; light: number; lean: number; squint: number; gaze: number;
  /** VD17 amount A, and `g`: the ambient clock (story frame, continuous) of the lens ripple phase and the veil (= G unless held). */
  warp: number; g: number;
  /** Draw the worker (false: the cart, cargo, helmet and umbrella only, S04). */
  worker: boolean;
  /** Metres travelled (caster hubs turn; the jammed front-right caster does not). */
  travel: number;
  /** Vertical judder (m) of the jammed caster and the deck only (S03-SH06 squeak peaks; 0 elsewhere). */
  judder?: number;
  /** Held look (S03-SH06A, SS-R4 RT-1; undefined = 0): forward head tilt about the neck (rad), eyelids closed 0..1, pupils down 0..1. */
  bow?: number;
  blink?: number;
  gazeDown?: number;
};

/** Worker upper-body lean toward the stack (-x) about the hip pivot y 0.71 (ST-03 R3: 9 deg). */
export const LEAN = 9 * DEG;
const HIP = 0.71;

const seatOf = (xs: number, zs: number): V3 => [xs, 1.725, zs];
/** Helmet seated, rocked by `sway` about the top-carton seat (CL04 wobble). */
const swayHelmet = (xs: number, zs: number, sway: number) => ({c: [xs + 0.225 * Math.sin(sway), 1.5 + 0.225 * Math.cos(sway), zs] as V3, a: sway});
/** Umbrella handle continues the shaft beyond the hand, away from the tip (ST-03 SS-R3.1): hand + 0.10 m x unit(hand - tip). */
export const handleEnd = (hand: V3, tip: V3): V3 => {
  const d = sub3(hand, tip), l = len3(d) || 1;
  return add3(hand, scale3(d, 0.1 / l));
};

const PUSH_R = (xs: number, zs: number): V3 => [xs - 0.12, 0.97, zs + 0.38];
const PUSH_L = (xs: number, zs: number): V3 => [xs + 0.2, 0.97, zs + 0.38];
const HOOK_HANDLE = (xs: number, zs: number): V3 => [xs + 0.25, 0.99, zs + 0.38];
const HOOK_TIP = (xs: number, zs: number): V3 => [xs + 0.27, 0.1, zs + 0.38];

// SS-R3.1 keys at the stop S (-0.10, 0.62) (index ST-03; sc02-b04 S02-SH09; sc03 S03-SH03).
const {xs: X0, zs: Z0} = STOP;
const SEAT = seatOf(X0, Z0);
export const MATCH_HELMET = {c: [X0 + 0.01, 1.725, Z0] as V3, a: 12 * DEG};
export const MATCH_HAND: V3 = [X0 + 0.2, 1.55, Z0 + 0.18];
export const BRACE: V3 = [X0 + 0.25, 1.3, Z0 + 0.23];
export const CATCH_HAND: V3 = [X0 + 0.38, 0.86, Z0 + 0.18];
export const CATCH_HELMET: V3 = [X0 + 0.5, 0.98, Z0 + 0.16];
const REGRIP: V3 = [-0.05, -0.15, 0.18];
export const L_HAND_UP: V3 = [X0 + 0.55, 1.33, Z0 + 0.23];
export const TIP_REST: V3 = [X0 + 0.46, 1.6, 0.05];
const LIT_BRACE = (xs: number, zs: number): V3 => [xs + 0.25, 1.05, zs + 0.23];
const LIT_LHAND = (xs: number, zs: number): V3 => [xs + 0.55, 0.95, zs + 0.28];
const LIT_TIP = (xs: number, zs: number): V3 => [xs + 0.6, 0.02, zs + 0.2];

const turnOffset = ([dx, dy, dz]: V3, a0: number, a1: number): V3 => {
  const u = dx * Math.cos(a0) - dy * Math.sin(a0), v = dx * Math.sin(a0) + dy * Math.cos(a0);
  return [u * Math.cos(a1) + v * Math.sin(a1), -u * Math.sin(a1) + v * Math.cos(a1), dz];
};
/** Swing an umbrella about its hand from direction d0 (length l0) to d1 (l1): direction nlerp, no shrink mid-swing. */
const swing = (hand: V3, d0: V3, d1: V3, u: number): V3 => {
  const l0 = len3(d0), l1 = len3(d1);
  const dir = mix3(scale3(d0, 1 / l0), scale3(d1, 1 / l1), u);
  return add3(hand, scale3(dir, lerp(l0, l1, u) / len3(dir)));
};

const base = (G: number, S: {xs: number; zs: number}, travel: number): Omit<AsmPose, 'helmet' | 'rHand' | 'lHand' | 'umbrella' | 'glove'> => ({
  S, dip: 0, light: lightAt(G), lean: LEAN, squint: 0, gaze: 0, warp: lensAt(G, S.zs), g: G, worker: true, travel,
});

/** PUSH at S: both hands on the handle grip, umbrella hooked on the handle's right end, helmet seated (sway). */
const pushPose = (G: number): AsmPose => {
  const a = asmAt(G);
  return {
    ...base(G, a, a.travel), helmet: swayHelmet(a.xs, a.zs, a.sway), rHand: PUSH_R(a.xs, a.zs), lHand: PUSH_L(a.xs, a.zs),
    umbrella: {hand: null, handle: HOOK_HANDLE(a.xs, a.zs), tip: HOOK_TIP(a.xs, a.zs), behind: true}, glove: 'under-stack',
  };
};

/** Tip z on the S02-SH07 tap schedule: 12-frame approach from z 0.08, contact on f51/f69/f87, 6-frame retract, rest 0.05. */
export const TAP_FRAMES = [51, 69, 87];
const tapZ = (f: number) => {
  if (f >= 93) return 0.05;
  if (f >= 87) return lerp(0, 0.05, ease(seg(f, 87, 93)));
  for (const c of TAP_FRAMES) {
    if (f >= c - 12 && f <= c) return lerp(0.08, 0, seg(f, c - 12, c) ** 2);
    if (f > c && f < c + 6) return lerp(0, 0.08, ease(seg(f, c, c + 6)));
  }
  return 0.08;
};

/** S02-SH07 (f = G - 900): last lurch to the stop, brace f30-f42, umbrella unhooked and raised f30-f45, three taps. */
const poseSH07 = (G: number): AsmPose => {
  const f = G - 900;
  const a = asmAt(G);
  const p = pushPose(G);
  const brace = ease(seg(f, 30, 42)), raise = ease(seg(f, 30, 45));
  const rHand = mix3(PUSH_R(a.xs, a.zs), BRACE, brace);
  const dz = tapZ(f) - 0.08;
  const handUp: V3 = [L_HAND_UP[0], L_HAND_UP[1], L_HAND_UP[2] + dz];
  const tipUp: V3 = [TIP_REST[0], TIP_REST[1], 0.08 + dz];
  const glove = brace > 0.5 ? 'under-helmet' : 'under-stack';
  if (raise <= 0) return {...p, rHand, glove};
  const lHand = mix3(PUSH_L(a.xs, a.zs), handUp, raise);
  const hookDir = sub3(HOOK_TIP(a.xs, a.zs), PUSH_L(a.xs, a.zs));
  const tip = swing(lHand, hookDir, sub3(tipUp, handUp), raise);
  return {...p, rHand, lHand, umbrella: {hand: lHand, tip}, glove};
};

const rested = (G: number, rise: number): AsmPose => ({
  ...base(G, STOP, 2.4 - STOP.zs), helmet: {c: SEAT, a: 0}, rHand: BRACE, lHand: L_HAND_UP, umbrella: {hand: L_HAND_UP, tip: TIP_REST},
  glove: 'under-helmet', dip: rise,
});

/** S02-SH09 (f = G - 1230; sc02-b04 SS-R3.1): slide f24-32, tip f32-35, fall f35-45, catch f45, lift f84-117, MATCH. */
const LIFT: [number, V3][] = [[84, CATCH_HELMET], [100, [0.34, 1.62, 0.72]], [110, [0.1, 1.78, 0.66]], [117, MATCH_HELMET.c]];
const poseSH09 = (G: number): AsmPose => {
  const f = G - 1230;
  let c: V3 = SEAT, a = 0;
  const give = f >= 45 ? -0.03 * bump(f, 45, 58) : 0;
  if (f >= 24 && f < 32) {
    const u = seg(f, 24, 32) ** 1.6;
    c = mix3(SEAT, [0.1, 1.66, Z0], u);
    a = 35 * DEG * u;
  } else if (f >= 32 && f < 35) {
    const u = seg(f, 32, 35);
    c = mix3([0.1, 1.66, Z0], [0.33, 1.56, 0.68], u);
    a = lerp(35, 50, u) * DEG;
  } else if (f >= 35 && f < 45) {
    const u = seg(f, 35, 45);
    c = [lerp(0.33, CATCH_HELMET[0], u), lerp(1.56, CATCH_HELMET[1], u * u), lerp(0.68, CATCH_HELMET[2], u)];
    a = lerp(50, 22, ease(u)) * DEG;
  } else if (f >= 45 && f < 84) {
    c = add3(CATCH_HELMET, [0, give, 0]);
    a = lerp(22, 16, ease(seg(f, 45, 70))) * DEG;
  } else if (f >= 84 && f < 117) {
    c = hermite(LIFT, f);
    a = lerp(16, 12, ease(seg(f, 84, 117))) * DEG;
  } else if (f >= 117) {
    c = add3(MATCH_HELMET.c, [0, 0.006 * bump(f, 117, 121), 0]);
    a = MATCH_HELMET.a;
  }
  let rHand: V3 = BRACE;
  if (f >= 30 && f < 45) rHand = mix3(BRACE, CATCH_HAND, ease(seg(f, 30, 44)));
  else if (f >= 45 && f < 84) rHand = add3(CATCH_HAND, [0, give, 0]);
  else if (f >= 84 && f < 117) {
    const regrip = mix3(sub3(CATCH_HAND, CATCH_HELMET), REGRIP, ease(seg(f, 84, 88)));
    const onRim = turnOffset(sub3(MATCH_HAND, MATCH_HELMET.c), MATCH_HELMET.a, a);
    rHand = add3(c, mix3(regrip, onRim, ease(seg(f, 110, 117))));
  } else if (f >= 117) rHand = add3(MATCH_HAND, [0, 0.006 * bump(f, 117, 121), 0]);
  const dip = -0.03 * bump(f, 45, 60) + 0.015 * bump(f, 140, 165);
  return {...base(G, STOP, 2.4 - Z0), helmet: {c, a}, rHand, lHand: L_HAND_UP, umbrella: {hand: L_HAND_UP, tip: TIP_REST}, glove: f >= 117 ? 'over-helmet' : 'under-helmet', dip};
};

const matchPose = (G: number, dip: number): AsmPose => ({
  ...base(G, STOP, 2.4 - Z0), helmet: MATCH_HELMET, rHand: MATCH_HAND, lHand: L_HAND_UP, umbrella: {hand: L_HAND_UP, tip: TIP_REST}, glove: 'over-helmet', dip,
});

/**
 * S03-SH03 (f = G - 1800; sc03 SS-R3.1): MATCH held f0-f35 while the light comes up; f36-f54 the lean eases 9 -> 0 while
 * the hand on the rim presses the helmet level; right hand to the LIT-LOWER brace (0.15, 1.05, 0.85) f54-f66 through
 * (0.02, 1.30, 0.86) at f60, glove behind the stack from f56; umbrella lowered f66-f96; exhale f96-f110.
 */
const poseSH03 = (G: number): AsmPose => {
  const f = G - 1800;
  const press = ease(seg(f, 36, 54));
  const a = lerp(MATCH_HELMET.a, 0, press);
  const c = mix3(MATCH_HELMET.c, SEAT, press);
  const onRim = (k: number) => {
    const pk = ease(seg(k, 36, 54));
    return add3(mix3(MATCH_HELMET.c, SEAT, pk), turnOffset(sub3(MATCH_HAND, MATCH_HELMET.c), MATCH_HELMET.a, lerp(MATCH_HELMET.a, 0, pk)));
  };
  const rHand = f < 36 ? MATCH_HAND : f < 54 ? onRim(f) : hermite([[54, onRim(54)], [60, [0.02, 1.3, 0.86]], [66, LIT_BRACE(X0, Z0)]], Math.min(f, 66));
  const lower = ease(seg(f, 66, 96));
  const lHand = mix3(L_HAND_UP, LIT_LHAND(X0, Z0), lower);
  const tip = f <= 66 ? TIP_REST : swing(lHand, sub3(TIP_REST, L_HAND_UP), sub3(LIT_TIP(X0, Z0), LIT_LHAND(X0, Z0)), lower);
  return {
    ...base(G, STOP, 2.4 - Z0), helmet: f < 36 ? MATCH_HELMET : {c, a}, rHand, lHand, umbrella: {hand: lHand, tip},
    glove: f < 56 ? 'over-helmet' : 'under-stack', dip: f < 96 ? 0 : -0.015 * ease(seg(f, 96, 110)),
    lean: LEAN * (1 - press), squint: bump(f, 44, 56) * 0.8, gaze: ease(seg(f, 96, 104)),
  };
};

/**
 * S03-SH06A held look (SS-R4 RT-1, f = G - 2070; zero outside the shot): shoulders rise 0.012 m per breath (period 20 frames),
 * eyelids close f84-f88, pupils go down f48-f60 (to the ground outside the door). No head bow (SS-R4.1 R8-5): the 5 deg forward
 * tilt was sub-pixel in this view and read as a sideways tilt; the `bow` pose field stays available with identity at 0.
 */
const heldLook = (G: number, A: number) => {
  const f = G - 2070, fa = A - 2070;
  // SS-R5.1 (C-8): breath and the extra eyes-only blink f170–f174 run on the ambient clock A through the held look.
  const breath = fa < 0 || fa >= 216 ? 0 : 0.5 - 0.5 * Math.cos((2 * Math.PI * fa) / 20);
  const extraBlink = bump(fa, 170, 174);
  if (f < 0 || f >= 120) return {breath, bow: 0, blink: extraBlink, gazeDown: 0};
  return {breath, bow: 0, blink: bump(f, 84, 88) + extraBlink, gazeDown: ease(seg(f, 48, 60))};
};

/** LIT-LOWER at the current S (inserts, pull-back). S03-SH05: the hand shifts its grip f20-f30 (G1982-G1992). */
const litLower = (G: number, A: number): AsmPose => {
  const a = asmAt(G), hold = heldLook(G, A);
  const grip = 0.02 * bump(G, 1982, 1992);
  const lHand = add3(LIT_LHAND(a.xs, a.zs), [0, grip, 0]);
  return {
    ...base(G, a, a.travel), helmet: {c: seatOf(a.xs, a.zs), a: 0}, rHand: add3(LIT_BRACE(a.xs, a.zs), [0, 0.008 * bump(G, 1932, 1940), 0]), lHand,
    umbrella: {hand: lHand, tip: LIT_TIP(a.xs, a.zs)}, glove: 'under-stack', lean: 0, gaze: 1, dip: -0.015 + 0.012 * hold.breath,
    bow: hold.bow, blink: hold.blink, gazeDown: hold.gazeDown,
  };
};

/** The assembly's story pose at story frame G (front views); `A` is the ambient clock (breath only, see `heldLook`). */
const poseAt = (G: number, A: number): AsmPose => {
  if (G < 900) return pushPose(G);
  if (G < 1029) return poseSH07(G);
  if (G < 1230) return rested(G, 0.02 * (bump(G, 1124, 1144) + bump(G, 1184, 1204)));
  if (G < 1410) return poseSH09(G);
  if (G < 1800) return matchPose(G, 0.02 * (bump(G, 1530, 1548) + bump(G, 1578, 1596) + bump(G, 1608, 1626)));
  if (G < 1920) return poseSH03(G);
  return litLower(G, A);
};

/** S03-SH06 caster judder (SS-R3.3 Q4): 2 px on screen at s 3.0 (0.67 plate px), jammed caster and deck, on alternate 5-frame blocks f6-f30. */
export const JAM_JUDDER = 0.0018;
const judderAt = (G: number) => (G >= 2040 && G <= 2064 && Math.floor((G - 2040) / 5) % 2 === 0 ? JAM_JUDDER : 0);
/**
 * The pose at story frame G. `A` is the ambient clock (SS-R5.1; default G): the fog-lens ripple phase and veil (`pose.g`) and
 * the held breath run on it, so a held event clock never freezes them.
 */
export const asmPoseAt = (G: number, A = G): AsmPose => ({...poseAt(G, A), judder: judderAt(G), g: A});

/** S04: the cart inside at S (-0.10, -0.45), lit, no worker; umbrella leaning on the handle from S04-SH01 f18. */
export const cartOnlyPose = (G: number, umbrellaOn: boolean): AsmPose => {
  const a = asmAt(G);
  return {
    ...base(G, a, a.travel), light: 1, warp: 0, worker: false, helmet: {c: seatOf(a.xs, a.zs), a: 0},
    rHand: LIT_BRACE(a.xs, a.zs), lHand: LIT_LHAND(a.xs, a.zs),
    umbrella: umbrellaOn ? {hand: null, handle: [a.xs + 0.22, 0.99, a.zs + 0.38], tip: [a.xs + 0.4, 0.02, a.zs + 0.3], behind: true} : {hand: null, handle: [0, -9, 0], tip: [0, -9, 0]},
    glove: 'under-stack', lean: 0,
  };
};

// ------------------------------------------------------------------ front-view geometry (flat card, ST-03)

/** One fill of the assembly: `lit` colour at light 1, SIL at 0. `inner` parts sit inside the outline (light > 0 only). */
export type Part = {pts: Pt[]; lit: string; inner?: boolean; ink?: boolean; passes?: number;
  /** Colour at light 0 (default SIL): a part that must still read in the unlit silhouette (casters). */
  base?: string};

const CARTONS: [number, number, number][] = [[0.5, 0, -0.8], [0.46, 0.015, 1.2], [0.48, -0.012, -1.5], [0.43, 0.018, 1.0]];
const DECK_TOP = 0.17, BOX_H = (1.5 - DECK_TOP) / 4;
const HELMET_SHELL: Pt[] = [
  ...Array.from({length: 15}, (_, i): Pt => {
    const t = Math.PI * (i / 14);
    return [0.225 * Math.cos(t), 0.02 + 0.205 * Math.sin(t)];
  }),
  [-0.22, -0.08], [-0.19, -0.19], [-0.08, -0.225], [0.08, -0.225], [0.19, -0.19], [0.22, -0.08],
];
const HELMET_VISOR: Pt[] = [[-0.17, 0.05], [-0.1, 0.085], [0.1, 0.085], [0.17, 0.05], [0.165, -0.07], [0.08, -0.095], [-0.08, -0.095], [-0.165, -0.07]];
const HELMET_SHADE: Pt[] = [[0.12, 0.17], [0.2, 0.09], [0.215, -0.08], [0.18, -0.18], [0.12, -0.2]];
const HELMET_GLINT: Pt[] = [[-0.12, 0.06], [-0.04, 0.075], [-0.1, -0.02], [-0.14, -0.01]];

/** Geometry helpers bound to one projector. */
const geo = (proj: Proj) => {
  const P = proj.P;
  const kAt = (z: number, x = 0) => proj.k([x, 0, z]);
  const ellipse3 = (c: V3, rx: number, ry: number, n = 18, a = 0): Pt[] =>
    Array.from({length: n}, (_, i) => {
      const t = (i / n) * Math.PI * 2, u = rx * Math.cos(t), v = ry * Math.sin(t);
      return P([c[0] + u * Math.cos(a) - v * Math.sin(a), c[1] + u * Math.sin(a) + v * Math.cos(a), c[2]]);
    });
  const limb3 = (a: V3, b: V3, w0: number, w1: number): Pt[] => {
    const [ax, ay] = P(a), [bx, by] = P(b);
    const len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
    const h0 = (w0 * proj.k(a)) / 2, h1 = (w1 * proj.k(b)) / 2;
    return [[ax + nx * h0, ay + ny * h0], [bx + nx * h1, by + ny * h1], [bx - nx * h1, by - ny * h1], [ax - nx * h0, ay - ny * h0]];
  };
  const spindle = (a: V3, b: V3, w: (u: number) => number, n = 10): Pt[] => {
    const [ax, ay] = P(a), [bx, by] = P(b);
    const len = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / len, ny = (bx - ax) / len;
    const left: Pt[] = [], right: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const c = mix3(a, b, i / n), [x, y] = P(c), h = (w(i / n) * proj.k(c)) / 2;
      left.push([x + nx * h, y + ny * h]);
      right.unshift([x - nx * h, y - ny * h]);
    }
    return [...left, ...right];
  };
  return {P, kAt, ellipse3, limb3, spindle};
};

/** Elbow of a two-bone arm from shoulder S to hand H (metres), bending toward `side` and down. */
const elbow3 = (S: V3, H: V3, bone: number, side: number): V3 => {
  const m = mix3(S, H, 0.5);
  const d = Math.hypot(H[0] - S[0], H[1] - S[1], H[2] - S[2]);
  const bend = Math.sqrt(Math.max(0, bone * bone - (d / 2) ** 2));
  return [m[0] + side * bend * 0.55, m[1] - bend * 0.8, m[2] + bend * 0.2];
};

/**
 * Front view of the assembly at `pose`, back to front. Silhouette parts (no `inner`) define the outline and are the
 * same at every `light`; inner parts are drawn at light > 0 only and stay inside the outline (SP01 b). The cart is a
 * flat card on the stack plane z = zs (brief R3 scale table).
 */
export const assemblyRaw = (proj: Proj, pose: AsmPose): Part[] => {
  const {P, ellipse3, limb3, spindle} = geo(proj);
  const {xs, zs} = pose.S;
  const wx = xs + 0.3, wz = zs + 0.45;
  const dy = pose.dip;
  const W = (x: number, y: number): V3 => {
    if (y <= HIP) return [wx + x, y, wz];
    const r = y - HIP, l = pose.lean;
    return [wx + x * Math.cos(l) - r * Math.sin(l), HIP + x * Math.sin(l) + r * Math.cos(l), wz];
  };
  // Head points (hood, face): W tilted forward about the neck (y 1.17) by the S03-SH06A bow; W itself when there is no bow.
  const bowT = pose.bow ?? 0, cbow = Math.cos(bowT), sbow = Math.sin(bowT);
  const H = (x: number, y: number): V3 => {
    const p = W(x, y);
    if (!bowT) return p;
    const r = p[1] - 1.17;
    return [p[0], 1.17 + r * cbow, p[2] - r * sbow];
  };
  const parts: Part[] = [];
  const add = (pts: Pt[], lit: string, o: Partial<Part> = {}) => parts.push({pts, lit, ink: true, ...o});
  const deg = DEG;
  const boxPts = (cx: number, y0: number, w: number, h: number, tiltDeg: number, z: number, inset = 0): Pt[] => {
    const a = tiltDeg * deg, x0 = -w / 2 + inset, x1 = w / 2 - inset, b = inset, t = h - inset;
    return ([[x0, b], [x1, b], [x1, t], [x0, t]] as Pt[]).map(([u, v]): Pt => P([cx + u * Math.cos(a) - v * Math.sin(a), y0 + u * Math.sin(a) + v * Math.cos(a), z]));
  };
  const helmetPts = (c: V3, a: number, shape: Pt[]) =>
    shape.map(([u, v]): Pt => P([c[0] + u * Math.cos(a) + v * Math.sin(a), c[1] - u * Math.sin(a) + v * Math.cos(a), c[2]]));

  if (pose.worker) {
    for (const s of [-1, 1]) {
      add([P(W(s * 0.075 - 0.065, 0.3)), P(W(s * 0.075 + 0.065, 0.3)), P(W(s * 0.075 + 0.07, 0.02)), P(W(s * 0.075 + s * 0.04 + 0.07, 0)), P(W(s * 0.075 + s * 0.04 - 0.07, 0)), P(W(s * 0.075 - 0.07, 0.02))], LIT.boot);
    }
    add([P(W(-0.2, 1.17 + dy)), P(W(-0.14, 1.215 + dy)), P(W(0.14, 1.215 + dy)), P(W(0.2, 1.17 + dy)), P(W(0.25, 0.34)), P(W(0.12, 0.31)), P(W(-0.12, 0.31)), P(W(-0.25, 0.34))], LIT.coat);
    add([P(W(0.06, 1.15 + dy)), P(W(0.2, 1.17 + dy)), P(W(0.25, 0.34)), P(W(0.12, 0.31)), P(W(0.1, 0.6))], LIT.coatShade, {inner: true, ink: false});
    add([P(W(-0.004, 1.12 + dy)), P(W(0.004, 1.12 + dy)), P(W(0.004, 0.32)), P(W(-0.004, 0.32))], LIT.coatShade, {inner: true, ink: false});
    // Hood flaring into the shoulders (no neck notch): arc over the top, then down to the coat's shoulder line.
    add([
      ...Array.from({length: 21}, (_, i): Pt => {
        const a = (-25 + (230 * i) / 20) * deg;
        return P(H(0.235 * Math.cos(a), 1.49 + dy + 0.215 * Math.sin(a)));
      }),
      P(W(-0.215, 1.17 + dy)), P(W(0.215, 1.17 + dy)),
    ], LIT.coat);
    // Face in the hood opening (decal head, exhausted): half-lidded eyes, worry brows, open mouth. Lit only.
    const Kh = 0.165, fcy = 1.47 + dy;
    const FP = ([u, v]: Pt): Pt => P(H(u * Kh, fcy - v * Kh));
    add(headOutline(28).map(([u, v]) => FP([u * 0.92, v * 0.86])), LIT.skin, {inner: true, passes: 8});
    add([[-0.9, -0.62], [-0.6, -0.86], [0, -0.92], [0.6, -0.86], [0.9, -0.62], [0.86, -0.42], [0.3, -0.52], [-0.3, -0.5], [-0.86, -0.42]].map((q) => FP(q as Pt)), LIT.hair, {inner: true, passes: 6});
    add([[0.55, -0.2], [0.82, -0.3], [0.86, 0.5], [0.6, 0.8], [0.35, 0.86]].map((q) => FP(q as Pt)), LIT.skinShade, {inner: true, ink: false});
    for (const s of [-1, 1]) {
      const ex = s * 0.38, ey = 0.08;
      const sq = (1 - 0.6 * pose.squint) * (1 - (pose.blink ?? 0)), gx = -0.07 * pose.gaze, gy = -0.12 * (pose.gazeDown ?? 0);
      add(Array.from({length: 9}, (_, i): Pt => FP([ex + 0.19 * Math.cos(Math.PI * (i / 8)), ey + 0.1 * sq * Math.sin(Math.PI * (i / 8))])), LIT.white, {inner: true, passes: 4});
      add(Array.from({length: 10}, (_, i): Pt => FP([ex - 0.02 + gx + 0.06 * Math.cos((i / 10) * 6.283), ey + 0.06 * sq + gy + 0.055 * sq * Math.sin((i / 10) * 6.283)])), INK, {inner: true, ink: false, passes: 6});
      const [inner, outer] = BROW_Y.worry;
      add([FP([s * 0.2, inner - 0.03]), FP([s * 0.58, outer - 0.03]), FP([s * 0.58, outer + 0.03]), FP([s * 0.2, inner + 0.03])], LIT.hair, {inner: true, ink: false, passes: 6});
    }
    add(Array.from({length: 12}, (_, i): Pt => FP([0.1 * Math.cos((i / 12) * 6.283), 0.6 + 0.06 * Math.sin((i / 12) * 6.283)])), LIT.mouth, {inner: true, passes: 4});
  }

  const glove = ellipse3(pose.rHand, 0.065, 0.06, 14);
  if (pose.worker) {
    // Arms (drawn before the stack): the right arm reaches the brace / catch / rim; the left holds the umbrella.
    const rS = W(-0.15, 1.18 + dy), lS = W(0.15, 1.18 + dy);
    const rE = elbow3(rS, pose.rHand, 0.27, -1);
    add(limb3(rS, rE, 0.12, 0.105), LIT.coat);
    add(limb3(rE, pose.rHand, 0.105, 0.095), LIT.coat);
    const lE = elbow3(lS, pose.lHand, 0.27, 1);
    add(limb3(lS, lE, 0.12, 0.105), LIT.coat);
    add(limb3(lE, pose.lHand, 0.105, 0.095), LIT.coat);
    if (pose.glove === 'under-stack') add(glove, LIT.glove);
  }

  // Cart: handle (behind the stack), casters with hubs (the front-right one jammed), deck edge on the stack plane.
  for (const x of [xs - 0.23, xs + 0.23]) add(limb3([x, DECK_TOP, zs + 0.38], [x, 0.97, zs + 0.38], 0.03, 0.03), LIT.cart);
  add(limb3([xs - 0.25, 0.97, zs + 0.38], [xs + 0.25, 0.97, zs + 0.38], 0.035, 0.035), LIT.cart);
  const jit = pose.judder ?? 0; // the jammed front-right caster and the deck move together; the free casters do not
  const umb = pose.umbrella;
  const umbrellaParts = () => {
    const tip = umb.tip;
    const hand = umb.hand;
    const handle = hand ? handleEnd(hand, tip) : umb.handle!;
    const from = hand ?? handle;
    const along = (u: number): V3 => mix3(from, tip, u);
    add(limb3(handle, tip, 0.014, 0.01), LIT.umbrella);
    add(spindle(along(0.12), along(0.9), (u) => 0.022 + 0.022 * Math.sin(Math.PI * u ** 0.7)), LIT.umbrella);
    add(ellipse3(add3(handle, [0, -0.0, 0]), 0.03, 0.035, 10), LIT.umbrella); // crook: lowest point = handle y - 0.035
    if (hand) add(ellipse3(hand, 0.065, 0.06, 14), LIT.glove);
  };
  const showUmbrella = umb.tip[1] > -1;
  if (umb.behind && showUmbrella) umbrellaParts();
  // Caster (front view): a dark tyre, 11 cm tall. Its base colour keeps it readable in the unlit cart (r2: SIL on SIL,
  // invisible at light 0 in S02-SH05). The lit hub tick is paintHubs. No extra part: `paintAssembly` seeds each part by
  // its index, so an inserted part re-textured the cart (a hub part appended last also changed the whole lit frame).
  for (const [x, z] of [[xs - 0.2, zs + 0.12], [xs + 0.2, zs + 0.12], [xs - 0.2, zs], [xs + 0.2, zs]] as const) {
    const j = x > xs && z === zs ? jit : 0;
    add(limb3([x, 0.1 + j, z], [x, 0.055 + j, z], 0.05, 0.04), LIT.cartDark);
    add(ellipse3([x, 0.05 + j, z], 0.024, 0.056, 12), LIT.wheel, {base: '#15181a'});
  }
  add([P([xs - 0.25, DECK_TOP + 0.01 + jit, zs]), P([xs + 0.25, DECK_TOP + 0.01 + jit, zs]), P([xs + 0.25, 0.1 + jit, zs]), P([xs - 0.25, 0.1 + jit, zs])], LIT.cart);

  CARTONS.forEach(([w, ox, tilt], i) => {
    const y0 = DECK_TOP + i * BOX_H, cx = xs + ox;
    add(boxPts(cx, y0 - (i ? 0.015 : 0), w, BOX_H + (i ? 0.015 : 0), tilt, zs), LIT.kraft);
    add(boxPts(cx - w * 0.36, y0, w * 0.28, BOX_H, tilt, zs, 0.012), LIT.kraftShade, {inner: true, ink: false});
    add(boxPts(cx + 0.02 * (hash(i + 40) - 0.5), y0 + BOX_H * 0.62, 0.05, BOX_H * 0.36, tilt, zs, 0.004), LIT.tape, {inner: true, ink: false});
    if (i === 1 || i === 3) add(boxPts(cx + w * 0.18, y0 + BOX_H * 0.22, 0.13, 0.09, tilt + 2, zs, 0), LIT.label, {inner: true});
  });

  const {c, a} = pose.helmet;
  if (pose.worker && pose.glove === 'under-helmet') add(glove, LIT.glove);
  add(helmetPts(c, a, HELMET_SHELL), LIT.helmet);
  add(helmetPts(c, a, HELMET_SHADE), LIT.helmetShade, {inner: true, ink: false});
  add(helmetPts(c, a, HELMET_VISOR), LIT.visor, {inner: true, passes: 6});
  add(helmetPts(c, a, HELMET_GLINT), '#6d7a84', {inner: true, ink: false});
  if (pose.worker && pose.glove === 'over-helmet') add(glove, LIT.glove);
  if (!umb.behind && showUmbrella) umbrellaParts();
  return parts;
};

/** Hub mark points of the four casters (front view), for the caster rotation detail drawn after the fills. */
export const casterHubs = (proj: Proj, pose: AsmPose) => {
  const {xs, zs} = pose.S;
  const j = pose.judder ?? 0;
  return ([[xs - 0.2, zs + 0.12, false], [xs + 0.2, zs + 0.12, false], [xs - 0.2, zs, false], [xs + 0.2, zs, true]] as const).map(([x, z, jammed]) => ({c: proj.P([x, 0.05 + (jammed ? j : 0), z]), jammed}));
};

// ------------------------------------------------------------------ VD17 FW-A fog-lens warp

const resample = (pts: Pt[], step: number): Pt[] =>
  pts.flatMap((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const m = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    return Array.from({length: m}, (_, j): Pt => [lerp(a[0], b[0], j / m), lerp(a[1], b[1], j / m)]);
  });
/** VD17 FW-A field constants (brief R3), PLATE px at camera scale 1 (CAM-GLASS-OUT, stack at zs 0.62: k 370 px/m). */
export const FW = {ax: 14, ay: 5, stretch: 0.03, narrow: 0.035, breathe: 0.25, breathePeriod: 3.4, l1: 230, l2: 90, h0: 0.3, h1: 0.75, pinIn: 15, pinOut: 70};

/** Height weight frame of the field for one projector and S: ground line, 1.95 m height, axis x, tip (all plate px). */
export const fieldFrame = (proj: Proj, S: {xs: number; zs: number}, tip: V3) => {
  const yG = proj.P([S.xs, 0, S.zs])[1], H = yG - proj.P([S.xs, 1.95, S.zs])[1], xc = proj.P([S.xs + 0.1, 0, S.zs])[0];
  return {yG, H, xc, tip: proj.P(tip)};
};

/**
 * Fog-lens warp of every assembly part: a pure function of the plate point, the story clock G and the amount A.
 * Height-weighted (nothing below about 0.6 m moves: wheels, deck, boots stay honest for CL02), pinned at the umbrella tip
 * (glass contact, CL03); `scale` multiplies every px constant (S01-SH01 car plate: k / 370). At A = 0 the parts are
 * returned unchanged; parts the field does not reach are returned unresampled, so their fills match the warp-off render.
 */
export const fogWarp = (parts: Part[], proj: Proj, pose: AsmPose, scale = 1): Part[] => {
  const amp = pose.warp;
  if (amp <= 0) return parts;
  const t = pose.g / 30;
  const {yG, H, xc, tip} = fieldFrame(proj, pose.S, pose.umbrella.tip);
  const br = 1 + FW.breathe * Math.sin((2 * Math.PI * t) / FW.breathePeriod);
  const weight = ([x, y]: Pt) => amp * smoothstep(FW.h0, FW.h1, (yG - y) / H) * smoothstep(FW.pinIn * scale, FW.pinOut * scale, Math.hypot(x - tip[0], y - tip[1]));
  const warp = ([x, y]: Pt): Pt => {
    const h = (yG - y) / H;
    const w = weight([x, y]);
    const dx = FW.ax * scale * (0.65 * Math.sin((2 * Math.PI * y) / (FW.l1 * scale) + t * 1.3 + 0.7) + 0.35 * Math.sin((2 * Math.PI * y) / (FW.l2 * scale) - t * 2.1 + 2.1)) - FW.narrow * h * h * (x - xc);
    const dy = -FW.stretch * br * h * h * H + FW.ay * scale * Math.sin((2 * Math.PI * x) / (FW.l1 * scale) + t * 0.9);
    return [x + w * dx, y + w * dy];
  };
  return parts.map((part) => {
    const pts = resample(part.pts, 10 * Math.max(0.3, scale));
    return pts.some((q) => weight(q) > 0) ? {...part, pts: pts.map(warp)} : part;
  });
};

/** The parts as drawn (warp applied). */
export const assemblyParts = (proj: Proj, pose: AsmPose, scale = 1) => fogWarp(assemblyRaw(proj, pose), proj, pose, scale);

/**
 * Paint the parts: one merged mass at light 0 (texture-free opaque fills), per-part colour lerp to lit (VD04); ink
 * right after its own fill once the light passes 0.3, so nearer parts cover the lines of parts behind them.
 */
export const paintAssembly = (p: Painter, parts: Part[], light: number, seedBase = 20000) => {
  const {brush} = p;
  parts.forEach((x, i) => {
    if (x.inner && light <= 0) return;
    const color = mixColor(x.base ?? SIL, x.lit, light);
    const n = x.passes ?? (x.inner ? 6 : 9);
    for (let k = 0; k < n; k++) {
      brush.seed(seedBase + i * 16 + k);
      brush.noiseSeed(seedBase + i * 16 + k);
      brush.noStroke();
      brush.fill(color, 255 * p.alpha);
      brush.fillBleed(0);
      brush.fillTexture(x.inner ? 0.12 * light : 0, x.inner ? 0.15 * light : 0);
      brush.polygon(x.pts);
      brush.noFill();
    }
    if (light > 0.3 && x.ink) {
      p.ink(700 + i, 'rotring', mixColor(SIL, INK, light), 0.9);
      brush.spline([...x.pts, x.pts[0]], 0.15);
    }
  });
};

/** Caster hub ticks (lit only): the jammed front-right caster keeps its angle while the others turn with travel. */
export const paintHubs = (p: Painter, proj: Proj, pose: AsmPose) => {
  if (pose.light < 0.3) return;
  casterHubs(proj, pose).forEach(({c, jammed}, i) => {
    const k = proj.k([pose.S.xs, 0.05, pose.S.zs]);
    const a = jammed ? 0.4 : pose.travel / 0.05;
    inkLine(p, 760 + i, [[c[0], c[1] - 0.045 * k * Math.cos(a)], [c[0], c[1] + 0.045 * k * Math.cos(a)]], {closed: false, weight: 0.8, color: mixColor(SIL, '#8a9096', pose.light)});
  });
};

// ------------------------------------------------------------------ side view (lit, S03-SH07; camera looks -x)

/**
 * The cart, cargo and helmet in profile (the worker is a cast figure): deck along z, four casters seen face-on (hub
 * ticks; the jammed front-right one does not turn), handle at the +z end, cartons 0.40 m deep, helmet dome with its
 * visor toward -z. Lit colours; drawn on the plane x = xs (flat card).
 */
export const paintCartSide = (p: Painter, proj: Proj, S: {xs: number; zs: number}, travel: number, seed = 26000) => {
  const {P} = proj;
  const x = S.xs, z = S.zs;
  let n = 0;
  const fill = (color: string, pts: Pt[], ink = true, passes = 6) => {
    const id = seed + ++n;
    for (let k = 0; k < passes; k++) {
      p.brush.seed(id * 16 + k);
      p.brush.noiseSeed(id * 16 + k);
      p.brush.noStroke();
      p.brush.fill(color, 255 * p.alpha);
      p.brush.fillBleed(0);
      p.brush.fillTexture(0.08, 0.15);
      p.brush.polygon(pts);
      p.brush.noFill();
    }
    if (ink) inkLine(p, id, pts, {weight: 0.9});
  };
  const Q = (pts: [number, number][]) => pts.map(([y, zz]) => P([x, y, zz]));
  // Handle at the +z end, then casters, deck.
  fill(LIT.cart, limb(P([x, DECK_TOP, z + 0.36]), P([x, 0.97, z + 0.38]), 0.03 * proj.k([x, 0, z]), 0.03 * proj.k([x, 0, z])));
  fill(LIT.cart, ell(...P([x, 0.97, z + 0.38]), 0.022 * proj.k([x, 0, z]), 0.022 * proj.k([x, 0, z]), 10));
  const k = proj.k([x, 0, z]);
  for (const [zz, jammed] of [[z - 0.32, true], [z + 0.32, false]] as const) {
    fill(LIT.cartDark, limb(P([x, 0.1, zz]), P([x, 0.055, zz]), 0.04 * k, 0.03 * k));
    const c = P([x, 0.05, zz]);
    fill(LIT.wheel, ell(c[0], c[1], 0.05 * k, 0.05 * k, 14));
    const a = jammed ? 0.5 : travel / 0.05;
    inkLine(p, seed + 90 + (jammed ? 1 : 2), [[c[0] - 0.04 * k * Math.cos(a), c[1] - 0.04 * k * Math.sin(a)], [c[0] + 0.04 * k * Math.cos(a), c[1] + 0.04 * k * Math.sin(a)]], {closed: false, weight: 0.8, color: '#8a9096'});
  }
  fill(LIT.cart, Q([[0.1, z - 0.37], [0.1, z + 0.38], [DECK_TOP, z + 0.38], [DECK_TOP, z - 0.37]]));
  CARTONS.forEach(([, ox, tilt], i) => {
    const y0 = DECK_TOP + i * BOX_H, dz = 0.03 * (hash(i + 60) - 0.5) + ox * 0.5, a = tilt * 0.5 * DEG;
    const pts: [number, number][] = [[-0.2, 0], [0.2, 0], [0.2, BOX_H + (i ? 0.012 : 0)], [-0.2, BOX_H + (i ? 0.012 : 0)]];
    fill(LIT.kraft, pts.map(([u, v]) => P([x, y0 - (i ? 0.012 : 0) + u * Math.sin(a) + v * Math.cos(a), z + dz + u * Math.cos(a) - v * Math.sin(a)])));
    fill(LIT.kraftShade, pts.map(([u, v]) => P([x, y0 + v * 0.98, z + dz + 0.12 + (u + 0.2) * 0.2])), false, 4);
    fill(LIT.tape, Q([[y0 + BOX_H - 0.02, z + dz - 0.2], [y0 + BOX_H - 0.02, z + dz + 0.2], [y0 + BOX_H - 0.05, z + dz + 0.2], [y0 + BOX_H - 0.05, z + dz - 0.2]]), false, 4);
  });
  // Helmet in profile on the top carton: dome toward -z with the visor opening at the front.
  const hc: V3 = [x, 1.725, z];
  const dome = Array.from({length: 17}, (_, i): Pt => {
    const t = Math.PI * (i / 16);
    return P([x, hc[1] + 0.02 + 0.205 * Math.sin(t), z - 0.225 * Math.cos(t)]);
  });
  fill(LIT.helmet, [...dome, P([x, 1.52, z + 0.2]), P([x, 1.52, z - 0.16])]);
  fill(LIT.visor, Q([[1.76, z - 0.21], [1.76, z - 0.06], [1.62, z - 0.06], [1.6, z - 0.2]]), true, 6);
  fill(LIT.helmetShade, Q([[1.56, z + 0.05], [1.56, z + 0.2], [1.7, z + 0.22], [1.72, z + 0.06]]), false, 4);
};

// ------------------------------------------------------------------ S03-SH06 jammed-caster read (SS-R3.3 Q4; Boss r4)

/**
 * Ground under the jammed caster, drawn before the cart: a torch pool on the wet concrete around the contact (0.30 x 0.10 m
 * ellipse) and a 0.03 m wet scrape from the f0 contact to the current one. Explicit seeds, so no other wash order moves.
 */
export const paintJamGround = (p: Painter, proj: Proj, pose: AsmPose) => {
  const S0 = asmPoseAt(2034).S;
  const now = proj.P([pose.S.xs + 0.2, 0, pose.S.zs]), from = proj.P([S0.xs + 0.2, 0, S0.zs]);
  const k = proj.k([pose.S.xs, 0, pose.S.zs]);
  const dx = now[0] - from[0], dy = now[1] - from[1], len = Math.hypot(dx, dy);
  if (len > 0.01) {
    const nx = (-dy / len) * 0.015 * k, ny = (dx / len) * 0.015 * k;
    washAt(p, 9520, '#c3cac6', 70, [[from[0] + nx, from[1] + ny], [now[0] + nx, now[1] + ny], [now[0] - nx, now[1] - ny], [from[0] - nx, from[1] - ny]], 0.2, 0.2);
  }
  washAt(p, 9521, '#ecdcb0', 110, ell(now[0], now[1], 0.15 * k, 0.05 * k, 24), 0.3, 0.2);
};

/**
 * Marks on the jammed tyre, drawn over the cart: a fixed pale scuff on the tread face (the same place on the tyre f0-f35),
 * a warm torch rim on its upper-left edge (two opaque passes, about 3 screen px at s 3) and 2-3 spray ticks at the far
 * (leading) edge f6-f30.
 */
export const paintJamTyre = (p: Painter, proj: Proj, G: number, pose: AsmPose) => {
  const c = casterHubs(proj, pose)[3].c;
  const k = proj.k([pose.S.xs, 0, pose.S.zs]);
  const rx = 0.024 * k, ry = 0.056 * k;
  const arc = (r: number) => Array.from({length: 12}, (_, i): Pt => {
    const t = (170 + i * 8.2) * DEG;
    return [c[0] + (rx - r) * Math.cos(t), c[1] + (ry - r) * Math.sin(t)];
  });
  solid(p, 9530, '#e0b27a', [...arc(0), ...arc(1.1).reverse()], 2, 0.02, 0.05);
  solid(p, 9531, '#8a8f8c', ell(c[0] - 0.3 * rx, c[1] - 0.45 * ry, 1.7, 0.7, 10), 2, 0.02, 0.05);
  const f = G - 2034;
  if (f >= 6 && f <= 30) {
    const now = proj.P([pose.S.xs + 0.2, 0, pose.S.zs]);
    // Spray beside the tyre on the wet ground (not on its face): ticks at the far side of the contact.
    [[-(rx + 6), -4], [rx + 6, -2], [-(rx + 2), 5]].forEach(([dx, dy], i) => inkLine(p, 9540 + i, [[now[0] + dx, now[1] + dy], [now[0] + dx + (dx < 0 ? -1 : 1), now[1] + dy - 3]], {closed: false, weight: 1.2, color: '#d9ded9'}));
  }
};

export {clamp01};
