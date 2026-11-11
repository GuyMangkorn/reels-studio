// EDU-EP15 N1 walk state: a diagonal (trot) gait on the ceiling, a pure function of the shot-local frame `L` (seekable: every foot's world anchor is recomputed from the body
// path at its landing frame, no state). The body goes from mark A to mark B (position and heading eased), the feet land at the `steps` frames (pair A = fl+hr on even
// steps, pair B = fr+hl on odd steps), each foot is planted for one step and then swings (toe roll up and back, palm lifted) to its next anchor. Also gives the dust
// launch points (N11) and the lifted-foot measures.
import {hash} from '../kit/hash';
import type {V3} from '../kit/space';
import {sm} from './clock';
import {CEIL} from './palette';
import {ceilingFrame, restLegs, type FootId, type Frame, type Leg, type TokayPose} from './tokay';

const DEG = Math.PI / 180;
const FEET: FootId[] = ['fl', 'fr', 'hl', 'hr'];
const PAIR_A = new Set<FootId>(['fl', 'hr']);
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mixV = (a: V3, b: V3, e: number): V3 => [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e];

export type Mark = {at: V3; heading: number};
export type WalkCfg = {
  from: Mark; to: Mark;
  /** Body motion frames (eased in-out). */
  m0: number; m1: number;
  /** Landing frames of steps 0..n (pair A on even, pair B on odd); a foot swings from the previous landing of its pair + `stance` to its next landing. */
  steps: number[];
  stance?: number;
  /** Peel strength of the lifted toes 0..1 (default 0.85). */
  peel?: number;
  /** Lead of a landing foot ahead of the body, in units of half a step of body travel (default 1.6; 0 for a lunge whose body arrives before the feet land). */
  leadK?: number;
  /** Max palm lift in metres (default 0.014). */
  lift?: number;
};
export type WalkState = {frame: Frame; pose: TokayPose; palms: Record<FootId, V3>; toes: Record<FootId, V3>; moving: number; landed: number};

const REST = restLegs();
/** Walk state at shot-local frame `L`. */
export const walkAt = (cfg: WalkCfg, L: number, o: {tips?: Partial<Record<FootId, number>>} = {}): WalkState => {
  const stance = cfg.stance ?? 9, peel = cfg.peel ?? 0.85, lift = cfg.lift ?? 0.014;
  const frameAt = (k: number): Frame => {
    const e = sm(cfg.m0, cfg.m1, k), at = mixV(cfg.from.at, cfg.to.at, e);
    return ceilingFrame([at[0], CEIL, at[2]], cfg.from.heading + (cfg.to.heading - cfg.from.heading) * e);
  };
  const toW = (f: Frame, l: V3): V3 => [f.o[0] + f.U[0] * l[0] + f.V[0] * l[1] + f.N[0] * l[2], f.o[1] + f.U[1] * l[0] + f.V[1] * l[1] + f.N[1] * l[2], f.o[2] + f.U[2] * l[0] + f.V[2] * l[1] + f.N[2] * l[2]];
  const toL = (f: Frame, w: V3): V3 => { const d = sub(w, f.o); return [dot(d, f.U), dot(d, f.V), dot(d, f.N)]; };
  const dirW = (f: Frame, d: V3): V3 => [f.U[0] * d[0] + f.V[0] * d[1], f.U[1] * d[0] + f.V[1] * d[1], f.U[2] * d[0] + f.V[2] * d[1]];
  const f = frameAt(L);
  const speed = Math.hypot(cfg.to.at[0] - cfg.from.at[0], cfg.to.at[2] - cfg.from.at[2]) / Math.max(1, cfg.m1 - cfg.m0);
  const lead = 0.5 * speed * stance * (cfg.leadK ?? 1.6);
  const legs = {} as Record<FootId, Leg>, roll: Partial<Record<FootId, number>> = {}, palms = {} as Record<FootId, V3>, toes = {} as Record<FootId, V3>;
  const n = cfg.steps.length;
  for (const id of FEET) {
    const par = PAIR_A.has(id) ? 0 : 1, r = REST[id];
    // landings of this foot: step indices with the same parity; anchor of landing k = nominal palm (+ lead) in the body frame at that frame
    const idx: number[] = []; for (let k = par; k < n; k += 2) idx.push(k);
    const anchor = (k: number): {w: V3; d: V3} => {
      if (k < 0) { const f0 = frameAt(cfg.steps[0] - stance - 1); return {w: toW(f0, r.palm), d: dirW(f0, r.dir)}; }
      const fk = frameAt(cfg.steps[k]);
      return {w: toW(fk, [r.palm[0] + lead, r.palm[1], 0]), d: dirW(fk, r.dir)};
    };
    // the last landing at or before L (or -1 = idle at rest) and the next one
    let li = -1; for (const k of idx) if (cfg.steps[k] <= L) li = k;
    const ni = li < 0 ? idx[0] : idx.find((k) => k > li);
    const a = anchor(li);
    let w = a.w, d = a.d, lifted = 0, ph = 0;
    if (ni !== undefined) {
      const tn = cfg.steps[ni], ts = Math.max(li < 0 ? -1e9 : cfg.steps[li] + stance, tn - stance);
      if (L >= ts) {
        ph = (L - ts) / Math.max(1, tn - ts);
        const b = anchor(ni), e = ph * ph * (3 - 2 * ph);
        w = mixV(a.w, b.w, e); d = mixV(a.d, b.d, e);
        lifted = Math.sin(Math.PI * Math.min(1, ph));
      }
    }
    const lp = toL(f, w); lp[2] = lift * lifted;
    const dl = toL(f, [f.o[0] + d[0], f.o[1] + d[1], f.o[2] + d[2]]); const dn = Math.hypot(dl[0], dl[1]) || 1;
    const s = id === 'fl' || id === 'hl' ? 1 : -1;
    const hip = r.hip, mid: V3 = [(hip[0] + lp[0]) / 2, (hip[1] + lp[1]) / 2 + 0.018 * s, 0.028 + lp[2] * 0.7];
    legs[id] = {...r, palm: lp, knee: mid, dir: [dl[0] / dn, dl[1] / dn, 0]};
    roll[id] = peel * Math.pow(Math.sin(Math.PI * Math.min(1, ph)), 0.8) * (lifted > 0 ? 1 : 0);
    palms[id] = w;
    toes[id] = [w[0] + d[0] * 0.011, CEIL - lp[2], w[2] + d[2] * 0.011];
  }
  void hash;
  const moving = sm(cfg.steps[0] - stance, cfg.steps[0], L) * (1 - sm(cfg.steps[n - 1], cfg.steps[n - 1] + 8, L));
  const landed = cfg.steps.filter((t) => t <= L).length;
  const tips = o.tips ?? {hl: 0.6, hr: 0.6, fl: 0.15, fr: 0.15};
  const pose: TokayPose = {legs, roll, tips: Object.fromEntries(FEET.map((id) => [id, (tips[id] ?? 0) * (1 - moving)])) as Partial<Record<FootId, number>>,
    headYaw: moving * 9 * Math.sin(((L - cfg.steps[0]) / stance) * Math.PI), tail: [moving * 0.02 * Math.sin(((L - cfg.steps[0]) / stance) * Math.PI + 1.2), 0]};
  void DEG;
  return {frame: f, pose, palms, toes, moving, landed};
};
