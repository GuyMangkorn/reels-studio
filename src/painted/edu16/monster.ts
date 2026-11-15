import {capsule, ell, hardFill, washAt} from '../kit/draw';
import {mixColor, type Painter, type Pt} from '../kit/painter';
import {TH} from './palette';

// N1 `new: shadow-monster`, look A "long-arm shadow" (user pick 2026-11-14; brief EDU-EP16-BRIEF-R2 IM2/IM3/W-STRIKE; Film look, W3; Boss hardens).
// One painted silhouette card in screen px: a tall hunched shadow with a low head jutting forward, a crown of pinpoint eyes, two arms far too long
// ending in mitten claws (three long hooked points, no fingers, UT14 spirit) and a body that thins into a smoke tail instead of legs, because it is a
// thought-shape. Always an unlit opaque black (DF-20261031-painted-opaque-cast, Boat P7): no mouth, teeth or inner detail; only a 2-4 px rim of one light
// colour on the edge facing that light, and the eyes. Poses are arm targets (lean / frozen reach, giant arm-raise, strike-downstroke, planted) plus a
// body lean; the giant adds a low-camera keystone. Mirror with `facing`. Seeds 47000-47999.

export type MonsterOpts = {
  /** Tail-base point (bottom of the torso where the smoke tail starts), px. */
  base: Pt;
  /** Figure height in px (tail base to hump top), the size unit `u`. */
  h: number;
  /** +1 reaches to screen right, -1 to screen left (mirror). */
  facing: 1 | -1;
  /** Claw TIP target of the reaching (near) arm, px. */
  reachTo: Pt;
  /** Elbow bend side of the reaching arm: +1 elbow up / outward (default), -1 down. */
  elbow?: 1 | -1;
  /** Hand direction in the facing-right frame, radians (default: shoulder -> claw tip). */
  aim?: number;
  /** Claw tip of the hanging (far) arm; default: hangs long beside the tail. */
  hangTo?: Pt;
  /** Whole-body lean toward `facing`, radians (about the tail base). */
  lean?: number;
  /** Rim colour (the light the edge faces) and the direction of that light from the figure, picture px vector. */
  rim: string;
  rimDir: Pt;
  /** Rim width px (2-4 by default 3). `rimAll` adds a fainter rim on every side (giant backlit by its own glow). */
  rimW?: number;
  rimAll?: string;
  /** Eye colour (the crown) and eye count (5 default). `eyes` 0..1 opens them (0 = shut, the swallow). */
  eyeColor: string;
  eyeCount?: number;
  eyes?: number;
  /** Keystone for a low camera: 0 none; k > 0 narrows the figure toward the top (x scale 1 - k * height / h about the base x). */
  keystone?: number;
  /** 0..1 opacity of the card (a monster receding in the IM2 kind-figure beat). Mixed toward `fadeTo`. */
  level?: number;
  fadeTo?: string;
  seed?: number;
  t?: number;
};

// Body outline facing right, unit = h, origin at the tail base, y down (negative = up).
const BODY: Pt[] = [
  [-0.05, 0.0], [-0.08, -0.15], [-0.09, -0.32], [-0.08, -0.48], [-0.04, -0.62], [0.03, -0.74], [0.1, -0.81], [0.17, -0.835], [0.23, -0.815], [0.28, -0.78], // back, hump, neck
  [0.31, -0.82], [0.36, -0.855], [0.42, -0.85], [0.465, -0.81], [0.48, -0.765], [0.46, -0.72], [0.415, -0.7], [0.355, -0.705], [0.3, -0.7], // head (low, forward)
  [0.25, -0.68], [0.2, -0.62], [0.13, -0.52], [0.085, -0.4], [0.055, -0.28], [0.04, -0.16], [0.03, -0.06], [0.02, 0.0], // chest down to the tail
];
const SHOULDER_NEAR: Pt = [0.18, -0.7], SHOULDER_FAR: Pt = [0.1, -0.71];
const EYE_C: Pt = [0.405, -0.775];
const UPPER = 0.44, FORE = 0.47; // arm segments, too long on purpose

const rot = ([x, y]: Pt, a: number): Pt => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

/** Two-bone IK: elbow point for shoulder S, wrist target T, segment lengths a, b; `side` picks the bend. */
const ik = (S: Pt, T: Pt, a: number, b: number, side: number): Pt => {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.min(a + b - 1e-3, Math.max(Math.abs(a - b) + 1e-3, Math.hypot(dx, dy)));
  const ang = Math.atan2(dy, dx), cosA = (a * a + d * d - b * b) / (2 * a * d), A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const e = ang - side * A;
  return [S[0] + a * Math.cos(e), S[1] + a * Math.sin(e)];
};

/** A long hooked claw point from `root` along angle `ang`, length L, base width w, hooking toward `hook` (+1/-1). */
const clawPoint = (root: Pt, ang: number, L: number, w: number, hook: number): Pt[] => {
  const n = 8, left: Pt[] = [], right: Pt[] = [];
  let x = root[0], y = root[1], a = ang;
  for (let i = 0; i <= n; i++) {
    const k = i / n, half = (w / 2) * (1 - k) ** 0.9, nx = -Math.sin(a), ny = Math.cos(a);
    left.push([x + nx * half, y + ny * half]);
    right.push([x - nx * half, y - ny * half]);
    x += Math.cos(a) * (L / n);
    y += Math.sin(a) * (L / n);
    a += hook * (0.75 / n) * (0.4 + k);
  }
  return [...left, ...right.reverse()];
};

/** Mitten claw: a palm lobe at the wrist and three long hooked points spread about `ang`; returns the polygons. */
const clawHand = (wrist: Pt, ang: number, u: number, hook: number, spread = 0.42): Pt[][] => {
  const palm: Pt = [wrist[0] + Math.cos(ang) * 0.035 * u, wrist[1] + Math.sin(ang) * 0.035 * u];
  const parts: Pt[][] = [ell(palm[0], palm[1], 0.05 * u, 0.036 * u, 16, ang)];
  [-spread, 0, spread].forEach((da, i) => {
    const root: Pt = [palm[0] + Math.cos(ang + da) * 0.03 * u, palm[1] + Math.sin(ang + da) * 0.03 * u];
    parts.push(clawPoint(root, ang + da * 0.9, (i === 1 ? 0.17 : 0.145) * u, 0.03 * u, hook));
  });
  return parts;
};

/** Claw-tip offset from the wrist for a hand along `ang` (to aim the tip, not the wrist, at a target). */
const TIP_REACH = 0.035 + 0.03 + 0.17 * 0.93;

/**
 * Solve one reaching arm in a facing-right local frame: the hand aims along `aim` (radians, default shoulder -> target) and the wrist is moved until the
 * middle claw's real tip (hook included) lands on `tip`. Returns elbow, wrist, hand angle and the hand polygons.
 */
const solveArm = (sh: Pt, tip: Pt, u: number, side: number, aim?: number, hook = 0.45, spread = 0.3) => {
  const ang = aim ?? Math.atan2(tip[1] - sh[1], tip[0] - sh[0]);
  let wrist: Pt = [tip[0] - Math.cos(ang) * TIP_REACH * u, tip[1] - Math.sin(ang) * TIP_REACH * u], hand = clawHand(wrist, ang, u, hook, spread);
  for (let it = 0; it < 3; it++) {
    const mid = hand[2], real = mid[(mid.length / 2) - 1] ?? mid[8];
    wrist = [wrist[0] + tip[0] - real[0], wrist[1] + tip[1] - real[1]];
    hand = clawHand(wrist, ang, u, hook, spread);
  }
  return {elbow: ik(sh, wrist, UPPER * u, FORE * u, side), wrist, ang, hand};
};

/** Picture polygons of the monster plus its eye points and named anchors (claw tip, shoulder, eye crown centre). */
export const monsterShape = (o: MonsterOpts) => {
  const u = o.h, f = o.facing, lean = o.lean ?? 0, k = o.keystone ?? 0;
  const local = ([x, y]: Pt): Pt => rot([x * u, y * u], lean); // local px, facing right; lean tips the top forward
  const toPic = ([x, y]: Pt): Pt => {
    const sx = 1 - k * Math.max(0, -y) / u;
    return [o.base[0] + f * x * sx, o.base[1] + y];
  };
  const fromPic = ([x, y]: Pt): Pt => {
    const ly = y - o.base[1], sx = 1 - k * Math.max(0, -ly) / u;
    return [((x - o.base[0]) * f) / sx, ly];
  };
  const body = BODY.map((q) => toPic(local(q)));
  // smoke tail: a curling taper below the base
  const tailW: Pt[] = Array.from({length: 22}, (_, i): Pt => {
    const k2 = i < 11 ? i / 10 : (21 - i) / 10, side = i < 11 ? -1 : 1, w = 0.065 * (1 - k2) ** 1.3;
    return toPic(local([-0.015 + 0.11 * Math.sin(k2 * 2.6) * k2 + side * w, -0.08 + 0.3 * k2]));
  });
  // arms in local px (facing right), then to picture
  const sN = local(SHOULDER_NEAR), sF = local(SHOULDER_FAR);
  const tipL = fromPic(o.reachTo);
  const arm = solveArm(sN, tipL, u, o.elbow ?? 1, o.aim === undefined ? undefined : o.aim), wristL = arm.wrist, elbowL = arm.elbow;
  const hangL = o.hangTo ? fromPic(o.hangTo) : local([0.3, 0.04]);
  const hd = Math.atan2(hangL[1] - sF[1], hangL[0] - sF[0]);
  const hWrist: Pt = [hangL[0] - Math.cos(hd) * TIP_REACH * u, hangL[1] - Math.sin(hd) * TIP_REACH * u];
  const hElbow = ik(sF, hWrist, UPPER * u, FORE * u, -1);
  const pic = (q: Pt): Pt => toPic(q);
  const near = [capsule(pic(sN), pic(elbowL), 0.085 * u, 0.05 * u), capsule(pic(elbowL), pic(wristL), 0.05 * u, 0.034 * u), ...arm.hand.map((pp) => pp.map(pic))];
  const far = [capsule(pic(sF), pic(hElbow), 0.075 * u, 0.045 * u), capsule(pic(hElbow), pic(hWrist), 0.045 * u, 0.032 * u), ...clawHand(hWrist, hd, u, 1).map((pp) => pp.map(pic))];
  // eye crown: an arc of pinpoints across the brow
  const nE = o.eyeCount ?? 5;
  const eyes = Array.from({length: nE}, (_, i): Pt => {
    const a = -2.5 + (i / Math.max(1, nE - 1)) * 2.2, r = 0.052;
    return pic(local([EYE_C[0] + Math.cos(a) * r, EYE_C[1] + Math.sin(a) * r * 0.75 + 0.03]));
  });
  return {body, tailW, near, far, eyes, tip: o.reachTo, shoulder: pic(sN), eyeCrown: pic(local(EYE_C)), wrist: pic(wristL)};
};

/** Paint the monster: far arm, body + tail, near arm (each with its rim pass first), then the eye crown. Returns the anchors. */
export const paintMonster = (p: Painter, o: MonsterOpts) => {
  const s = o.seed ?? 47000, sh = monsterShape(o), lv = o.level ?? 1;
  const bodyCol = lv >= 1 ? TH.body : mixColor(o.fadeTo ?? TH.bubbleIn, TH.body, lv);
  const rimCol = mixColor(o.fadeTo ?? TH.void, o.rim, lv), rw = o.rimW ?? 3;
  const dl = Math.hypot(o.rimDir[0], o.rimDir[1]) || 1, rd: Pt = [(o.rimDir[0] / dl) * rw, (o.rimDir[1] / dl) * rw];
  const allCol = o.rimAll ? mixColor(o.fadeTo ?? TH.void, o.rimAll, lv * 0.8) : undefined;
  const fill = (seed: number, pts: Pt[]) => {
    if (allCol) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay], j) => hardFill(p, seed * 8 + 1 + j, allCol, pts.map(([x, y]): Pt => [x + ax * rw * 0.7, y + ay * rw * 0.7])));
    hardFill(p, seed * 8 + 5, rimCol, pts.map(([x, y]): Pt => [x + rd[0], y + rd[1]]));
  };
  const body = (seed: number, pts: Pt[]) => hardFill(p, seed * 8 + 6, bodyCol, pts);
  // rim passes first for everything, then the black on top, so rims never paint over a neighbouring black part
  const all: Pt[][] = [...sh.far, sh.tailW, sh.body, ...sh.near];
  all.forEach((pts, i) => fill(s + i, pts));
  all.forEach((pts, i) => body(s + i, pts));
  const ev = (o.eyes ?? 1) * lv;
  if (ev > 0) {
    const er = Math.max(2.6, 0.0065 * o.h);
    sh.eyes.forEach(([x, y], i) => {
      washAt(p, s * 8 + 300 + i, o.eyeColor, 55 * ev, ell(x, y, er * 2.3, er * 2.3, 12), 0, 0);
      hardFill(p, s * 8 + 320 + i, mixColor(bodyCol, mixColor(o.eyeColor, '#ffffff', 0.3), ev), ell(x, y, er, er, 10));
    });
  }
  return sh;
};

/**
 * The giant's arm alone (W-STRIKE cut-in SH15S, where the body is off frame): shoulder `shoulder` (may be off frame), claw tip at `reachTo`, size unit `u`
 * (the giant's h at this lens), elbow side, rims as `paintMonster`. Returns the wrist, palm direction and polygons for occlusion checks.
 */
export const paintMonsterArm = (p: Painter, o: {shoulder: Pt; reachTo: Pt; u: number; facing: 1 | -1; elbow?: 1 | -1; rim: string; rimDir: Pt; rimW?: number; rimAll?: string; seed?: number}) => {
  const s = o.seed ?? 47600, u = o.u, f = o.facing;
  // work in a facing-right local frame (x mirrored for facing -1) so the claw hooks the same way as the full figure
  const L = ([x, y]: Pt): Pt => [(x - o.shoulder[0]) * f, y - o.shoulder[1]], P = ([x, y]: Pt): Pt => [o.shoulder[0] + x * f, o.shoulder[1] + y];
  const sh: Pt = [0, 0], arm = solveArm(sh, L(o.reachTo), u, o.elbow ?? 1), {wrist, elbow} = arm, handAng = arm.ang;
  const parts = [capsule(P(sh), P(elbow), 0.085 * u, 0.05 * u), capsule(P(elbow), P(wrist), 0.05 * u, 0.034 * u), ...arm.hand.map((pp) => pp.map(P))];
  const rw = o.rimW ?? 3, dl = Math.hypot(o.rimDir[0], o.rimDir[1]) || 1, rd: Pt = [(o.rimDir[0] / dl) * rw, (o.rimDir[1] / dl) * rw];
  parts.forEach((pts, i) => {
    if (o.rimAll) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay], j) => hardFill(p, (s + i) * 8 + 1 + j, o.rimAll!, pts.map(([x, y]): Pt => [x + ax * rw * 0.7, y + ay * rw * 0.7])));
    hardFill(p, (s + i) * 8 + 5, o.rim, pts.map(([x, y]): Pt => [x + rd[0], y + rd[1]]));
  });
  parts.forEach((pts, i) => hardFill(p, (s + i) * 8 + 6, TH.body, pts));
  return {wrist: P(wrist), elbow: P(elbow), handAng: f > 0 ? handAng : Math.PI - handAng, parts};
};
