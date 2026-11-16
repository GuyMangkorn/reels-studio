import {washAt} from './draw';
import {mixColor, type Painter, type Pt} from './painter';
import {camPoint, type YCam} from './ycam';
import type {V3} from './space';
import {add, ballKeys, clamp, mul, newRig, nrm, paintBeast, sub, type BeastAnchors, type BeastPlace, type Build, type Key, type L3} from '../survival/beast';

// `new: snake (generic)` AS-SNAKE-R1 (Boss, 15 Nov 2026; EDU-EP18-BRIEF-R1 N11 / VD09, pre-W3 comp-card pass, not user-approved). Designed from the brief: slim,
// olive-brown with darker irregular saddles and a pale belly, a plain round head (no hood, no bright colours, no cartoon eyes, a small dark eye with no highlight),
// not a recognisable species, not cute. 1.4 m long, 0.04 m thick, head 0.045 m wide. States: lie, head-lift + tongue, slither (body stays on the ground).
// Built on the creature-kit loft engine (survival/beast.ts) so the same build turns with the yaw camera; listed in BEAST_KIT as SNAKE (joint test, comp cards).
// Creature-local metres: s forward (toward the head), y up, l left. Two bones: body (root, tail to neck) -> skull [skull.joint].
// The body follows a planar path: P(tau) integrates the heading yaw(tau) = A sin(2 pi tau / lambda) (and a pitch for the lifted neck), so its length is exact in every pose.
// `paintSnake` adds the ground contact shadow under the body (the beast ground ellipse does not fit a curved body) and paints the build.

export const SNAKE = {/** body length (m) without the 0.056 m head: 1.4 m in all */ len: 1.344, r: 0.02, headW: 0.045, body: '#6e6a3e', saddle: '#3e3a24', belly: '#b5a878', eye: '#2a2418', tongue: '#3a1418', lambda: 0.62, yawAmp: 0.62} as const;
export type SnakePose = {
  /** distance (m) the body has slid along its path (slither); the path shape is fixed in the world, the wave travels back along the body */
  travel?: number;
  /** neck lift 0..1 (the front ~0.4 m rises ~0.12 m in an S, the head held level) */
  lift?: number;
  /** tongue out 0..1 (flick) */
  tongue?: number;
  /** head turn (rad, + toward the left flank), head pitch (rad, + nose up) */
  headYaw?: number; headPitch?: number;
  /** draw only the body from this fraction (0 tail .. 1 neck) forward: head-close cards and a snake entering frame */
  trim?: number;
  /** path amplitude scale (1 = the resting S, 1.25 = the tighter slither wave) */
  amp?: number;
};
const N = 90;
const sm = (a: number, b: number, t: number) => { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); };
/** radius along the body, f 0 = tail tip .. 1 = neck */
const radius = (f: number) => (f < 0.18 ? 0.003 + (SNAKE.r * 0.85 - 0.003) * Math.pow(f / 0.18, 0.8) : f > 0.93 ? SNAKE.r * (1 - 0.22 * sm(0.93, 1, f)) : SNAKE.r * (0.85 + 0.15 * Math.sin(Math.PI * Math.min(1, (f - 0.18) / 0.7))));
// irregular saddles: centres along the body (f), each with its own width, from a fixed hash
const SADDLES = Array.from({length: 17}, (_, i) => { const h = Math.sin(i * 91.7 + 3.1) * 43758.5453, r = h - Math.floor(h); return {c: 0.06 + i * 0.056 + (r - 0.5) * 0.018, w: 0.016 + 0.012 * r}; });
const saddleAt = (f: number) => SADDLES.some((s) => Math.abs(f - s.c) < s.w);

export const buildSnake = (o: SnakePose = {}): Build => {
  const R = newRig(), B = R.B, L = SNAKE.len, lam = SNAKE.lambda, A = SNAKE.yawAmp * (o.amp ?? 1), d = o.travel ?? 0, lift = clamp(o.lift ?? 0);
  // integrate the path from tau = d (tail) to d + L (neck); the drift of one wavelength is removed so a slither cycle loops
  const yaw = (tau: number) => A * Math.sin((2 * Math.PI * tau) / lam);
  const STEPS = 400, ds = L / STEPS, pts: L3[] = [];
  const pitch = (f: number) => lift * (0.95 * sm(0.66, 0.76, f) - 0.95 * sm(0.8, 0.92, f));   // neck S: rise, then level the head
  let p: L3 = [0, 0, 0];
  const drift = (() => { let x = 0; const n = 400; for (let i = 0; i < n; i++) x += Math.cos(yaw((i + 0.5) * (lam / n))); return x / n; })();   // mean forward speed per m of path
  // start point: the path integrated from 0 to d (only its forward drift is removed)
  { let q: L3 = [0, 0, 0]; const n = Math.max(1, Math.round(d / ds)); for (let i = 0; i < n; i++) { const tau = (i + 0.5) * (d / n), y0 = yaw(tau); q = add(q, [Math.cos(y0) * (d / n), 0, Math.sin(y0) * (d / n)]); } p = [q[0] - drift * d, 0, q[2]]; }
  for (let i = 0; i <= STEPS; i++) {
    pts.push(p);
    const f = (i + 0.5) / STEPS, tau = d + (i + 0.5) * ds, yv = yaw(tau) * (1 - 0.6 * lift * sm(0.7, 0.9, f)), pv = pitch(f);
    p = add(p, [Math.cos(pv) * Math.cos(yv) * ds, Math.sin(pv) * ds, Math.cos(pv) * Math.sin(yv) * ds]);
  }
  // centre: the body midpoint near the origin along s, every point raised by its radius so the belly rests on y 0
  const mid = pts[Math.floor(STEPS * 0.5)], keys: Key[] = [];
  for (let i = 0; i <= N; i++) { const f = i / N, q = pts[Math.round(f * STEPS)], r = radius(f); keys.push({p: [q[0] - mid[0], q[1] + r, q[2] - mid[2]], a: r, b: r * 0.92}); }
  const col = (u: number, sd: number) => (sd < -0.45 ? SNAKE.belly : saddleAt(u) && sd > -0.3 ? SNAKE.saddle : sd > 0.6 ? mixColor(SNAKE.body, '#8a8450', 0.25) : SNAKE.body);
  const root = R.bone('body', null);
  const tk = o.trim ? keys.slice(Math.floor(clamp(o.trim) * N)) : keys;
  R.loft(root, {m: 10, col: (u, sd) => col(o.trim ? o.trim + u * (1 - o.trim) : u, sd), cap: !!o.trim, keys: tk, ink: mixColor(SNAKE.saddle, '#14100a', 0.4)});
  // head: plain, round-snouted, a little wider than the neck, flat on top; held on the neck's heading, turned and pitched by headYaw / headPitch
  const nk = keys[N].p, prev = keys[N - 3].p, fw0 = nrm(sub(nk, prev)), hy = Math.atan2(fw0[2], fw0[0]) + (o.headYaw ?? 0), hpv = Math.atan2(fw0[1], Math.hypot(fw0[0], fw0[2])) * 0.3 + (o.headPitch ?? 0);
  const fw: L3 = [Math.cos(hpv) * Math.cos(hy), Math.sin(hpv), Math.cos(hpv) * Math.sin(hy)], lt: L3 = nrm([-Math.sin(hy), 0, Math.cos(hy)]), up = nrm(sub([0, 1, 0], mul(fw, fw[1])));
  const Hh = (u: number, v: number, w: number): L3 => add(add(add(nk, mul(fw, u)), mul(up, v)), mul(lt, w));
  const skull = R.bone('skull', root, 'skull.joint', nk), hw = SNAKE.headW / 2;
  R.loft(skull, {m: 12, cap: true, col: (u, sd) => (sd < -0.45 ? SNAKE.belly : u < 0.25 && sd > 0.3 ? SNAKE.saddle : sd > 0.5 ? mixColor(SNAKE.body, '#8a8450', 0.2) : SNAKE.body), ink: mixColor(SNAKE.saddle, '#14100a', 0.4),
    keys: [{p: Hh(0, 0, 0), a: radius(1), b: radius(1) * 0.9}, {p: Hh(0.012, 0.001, 0), a: hw * 0.85, b: hw * 0.62}, {p: Hh(0.03, 0.001, 0), a: hw, b: hw * 0.6}, {p: Hh(0.046, 0.0, 0), a: hw * 0.72, b: hw * 0.45}, {p: Hh(0.056, -0.001, 0), a: hw * 0.3, b: hw * 0.26}]});
  for (const g of [1, -1]) {
    const e = Hh(0.036, hw * 0.3, g * hw * 0.78);
    R.loft(skull, {m: 8, col: () => SNAKE.eye, keys: ballKeys(e, 0.0042, mul(lt, g))});   // small dark eye, no highlight
    R.flat(skull, {pts: [Hh(0.012, -hw * 0.28, g * hw * 0.86), Hh(0.05, -hw * 0.22, g * hw * 0.6), Hh(0.05, -hw * 0.3, g * hw * 0.6), Hh(0.012, -hw * 0.36, g * hw * 0.86)], col: '#2a2414', two: true});   // mouth line
  }
  const tg = clamp(o.tongue ?? 0);
  if (tg > 0.02) {   // forked tongue from the snout tip
    const t0 = Hh(0.054, -0.003, 0), tl = 0.045 * tg, t1 = add(t0, mul(fw, tl)), sp = 0.006 + 0.004 * tg, dn = mul(up, -0.004 * tg);
    R.flat(skull, {pts: [add(t0, mul(lt, 0.0015)), add(t1, mul(lt, 0.0012)), add(add(add(t1, mul(fw, 0.012 * tg)), mul(lt, sp)), dn), add(t1, [0, 0, 0]), add(add(add(t1, mul(fw, 0.012 * tg)), mul(lt, -sp)), dn), add(t1, mul(lt, -0.0012)), add(t0, mul(lt, -0.0015))], col: SNAKE.tongue, two: true});
  }
  B.shadow = {s: 0, l: 0, rs: 0, rl: 0};
  B.anchors = {head: Hh(0.03, 0, 0), snout: Hh(0.056, 0, 0), neck: nk, tail: keys[0].p, mid: keys[Math.floor(N / 2)].p};
  return B;
};

/** Paints the snake through the yaw camera: soft contact shadow under each grounded stretch of the body, then the build. */
export const paintSnake = (p: Painter | null, c: YCam, B: Build, o: BeastPlace): BeastAnchors => {
  if (p) {
    const h = o.heading, fx = Math.cos(h), fz = Math.sin(h), lx = Math.sin(h), lz = -Math.cos(h), gy = o.ground ?? 0;
    const W = ([s, , l]: L3, side: number, r: number): V3 => [o.at[0] + s * fx + (l + side * r) * lx, gy + 0.002, o.at[1] + s * fz + (l + side * r) * lz];
    const ks = B.parts[0].keys, lo = ks.filter((k) => k.p[1] < k.b * 1.6);
    const seg: Pt[] = [], back: Pt[] = [];
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i], nx = ks[Math.min(ks.length - 1, i + 1)].p, pv = ks[Math.max(0, i - 1)].p, t = nrm(sub(nx, pv)), n: L3 = [-t[2], 0, t[0]];
      if (k.p[1] > k.b * 1.6) continue;
      const a = camPoint(c, W(add(k.p, mul(n, k.a * 1.25)), 0, 0)), b = camPoint(c, W(add(k.p, mul(n, -k.a * 1.25)), 0, 0));
      if (a && b) { seg.push(a); back.unshift(b); }
    }
    if (lo.length > 2 && seg.length > 2) washAt(p, (o.seed ?? 70000) + 97, '#1e2016', o.shadowOp ?? 110, [...seg, ...back], 0.2, 0.2);
  }
  return paintBeast(p, c, B, {...o, shadowOp: 0});
};

/** Slither: one cycle slides the body one wavelength along its path; the world speed for planted contact is `SNAKE_SLITHER.speed` m/s. */
export const SNAKE_SLITHER = {sec: 1.6, get speed() { return SNAKE.lambda / this.sec; }} as const;
export const SNAKE_POSES = {
  lie: (t: number): SnakePose => ({headYaw: 0.12 * Math.sin(t * 6.283), tongue: 0}),
  /** head-lift + tongue: the neck rises (0-0.4), the head turns a little toward the camera side, the tongue flicks twice (0.5-0.65, 0.78-0.93) */
  headLift: (t: number): SnakePose => ({lift: sm(0, 0.4, t), headYaw: 0.15 * sm(0.3, 0.6, t), headPitch: -0.05, tongue: Math.max(Math.sin(Math.PI * clamp((t - 0.5) / 0.15)), Math.sin(Math.PI * clamp((t - 0.78) / 0.15)))}),
  slither: (t: number): SnakePose => ({travel: t * SNAKE.lambda, amp: 1.15, tongue: Math.sin(Math.PI * clamp((t - 0.55) / 0.2))}),
};
