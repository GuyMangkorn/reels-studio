import {inkLine, washAt} from '../kit/draw';
import {hash} from '../kit/hash';
import type {Painter, Pt} from '../kit/painter';
import type {V3} from '../kit/space';
import {camPoint, type YCam} from '../kit/ycam';
import {carSilhouette} from './car';

// N5 `new: lightning bolt`, near (brief N5; Boss W5.2 BG1, 2026-11-16; rebuilt Boss FX4, 2026-11-17, EDU-EP21-SHEETS-R4 D-U1..D-U3).
// A world-metre channel in space R, tip first, given as explicit waypoints (`path`) and branches (fork point + points), each segment split
// in three with a seeded perpendicular jitter <= 0.05 m (the old random walk stays only as the default when no path is given). Projected
// through the shot's one camera (one projection owner: the shot's YCam, the sagged `cb` in SH13) and drawn as screen layers ABOVE the kit
// `Flash`: halo (screen, blurred), body, white core tapering tip -> frame top, then `BoltFlare` on the projected tip, so the line is seen to
// touch the metal (no tip pool: BRIEF-R5 truth limit 2 amended for the live strikes). Levels are pure functions of d = L - strike
// (`boltEnv`: `single` and `double` envelopes with a stepped leader on d -2/-1). `paintStrikeRim` is the live strike's 2-frame cold rim on
// the car (silhouette outline + wash, the struck edge lit near the contact); nothing travels along the body (D-U3). The far fork (N5 far)
// stays `paintFarFork` in road.ts.

export type BoltWidths = {
  /** White core width at the tip and at the frame top (px at 1080). */ core: [number, number];
  /** Pale body and blurred halo widths (px). */ body: number; halo: number;
  /** Branch core taper (fork -> end), body and halo (px). */ bCore: [number, number]; bBody: number; bHalo: number;
};
/** SH01 defaults (sheet B01-SH01 bolt look R4). */
export const BOLT_W: BoltWidths = {core: [8, 6], body: 20, halo: 56, bCore: [3, 1], bBody: 8, bHalo: 24};

export type BoltOpts = {
  /** World channel, tip first (m). The last point is continued straight up to the cloud base `top`. */ path?: V3[];
  /** Branches: fork point then points (m). */ branches?: V3[][];
  /** Default random-walk tip (only when no `path`). */ tip?: V3;
  /** Cloud base height (m). */ top?: number; seed?: number;
};
export type BoltPaths = {channel: Pt[]; branches: Pt[][]; tip: Pt | null};

const JITTER = 0.05;
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit = (v: V3): V3 => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const crs = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Each segment split in three; the two inner points pushed perpendicular to the segment by a seeded offset (|offset| <= JITTER m). */
export const jitterPath = (pts: V3[], seed: number): V3[] => {
  const out: V3[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], d = sub(b, a);
    let n1 = crs(d, [0, 0, 1]);
    if (Math.hypot(...n1) < 1e-6) n1 = [1, 0, 0];
    n1 = unit(n1);
    const n2 = unit(crs(d, n1)), k = JITTER / Math.SQRT2;
    for (const u of [1 / 3, 2 / 3]) {
      const s = seed + i * 7 + u * 3, j1 = (hash(s) * 2 - 1) * k, j2 = (hash(s + 101) * 2 - 1) * k;
      out.push([a[0] + d[0] * u + n1[0] * j1 + n2[0] * j2, a[1] + d[1] * u + n1[1] * j1 + n2[1] * j2, a[2] + d[2] * u + n1[2] * j1 + n2[2] * j2]);
    }
    out.push(b);
  }
  return out;
};

/** The default random walk (BG1) when no explicit path is given. */
const walk = (tip: V3, top: number, S: number): {world: V3[]; branches: V3[][]} => {
  const n = 22, world: V3[] = [];
  let [x, , z] = tip;
  for (let i = 0; i <= n; i++) {
    const u = i / n, y = tip[1] + (top - tip[1]) * u * u;
    if (i > 0) { const w = 0.25 + 3.2 * u; x += (hash(S + i) - 0.5) * w; z += (hash(S + 50 + i) - 0.5) * w * 0.6; }
    world.push([x, y, z]);
  }
  const branches = [[4, 1, 2.2], [9, -1, 3.4], [14, 1, 4.0]].map(([k, s, L], j) => {
    const [bx, by, bz] = world[k], pts: V3[] = [[bx, by, bz]];
    for (let m = 1; m <= 5; m++) pts.push([bx + s * L * (m / 5) + (hash(S + 200 + j * 10 + m) - 0.5) * 0.6, by - L * 0.8 * (m / 5) * (0.8 + 0.4 * hash(S + 260 + j * 10 + m)), bz + (hash(S + 300 + j * 10 + m) - 0.5) * 0.5]);
    return pts;
  });
  return {world, branches};
};

/** The projected channel (tip first) and branches (picture px). Points behind the lens are dropped. */
export const boltPaths = (c: YCam, o: BoltOpts): BoltPaths => {
  const S = o.seed ?? 41000, top = o.top ?? 70;
  let world: V3[], brW: V3[][];
  if (o.path && o.path.length >= 2) {
    const last = o.path[o.path.length - 1];
    world = jitterPath([...o.path, [last[0], top, last[2]]], S);
    brW = (o.branches ?? []).map((b, j) => jitterPath(b, S + 500 + j * 37));
  } else {
    const w = walk(o.tip ?? [0, 4, 0], top, S);
    world = w.world; brW = w.branches;
  }
  const P = (v: V3) => camPoint(c, v), keep = (q: (Pt | null)[]) => q.filter((v): v is Pt => !!v);
  return {channel: keep(world.map(P)), branches: brW.map((b) => keep(b.map(P))).filter((q) => q.length > 1), tip: P(world[0])};
};

/** Strike state for one frame. `leader` > 0: only the stepped leader, drawn to that fraction of the visible channel from the frame top. */
export type BoltEnv = {leader: number; leaderOp: number; stroke: number; core: boolean; branches: number; flare: number};
const OFF: BoltEnv = {leader: 0, leaderOp: 0, stroke: 0, core: false, branches: 0, flare: 0};
const lead = (d: number): BoltEnv => (d === -2 ? {...OFF, leader: 0.45, leaderOp: 0.5} : d === -1 ? {...OFF, leader: 0.85, leaderOp: 0.6} : OFF);
const on = (stroke: number, branches: number, flare: number, core = true): BoltEnv => ({...OFF, stroke, core, branches, flare});
/** Envelopes as pure functions of d = L - strike (FX4 brief): `single` leader, 1, 1, 0.5, 0.2, 0; `double` leader, 1, 1, 0.30 (no core,
 *  branches 0), 1, 1 (branches 0.35), 0.55, 0.30, 0.12, 0 (flare 0 from d +6). */
export const boltEnv = (kind: 'single' | 'double', d: number): BoltEnv => {
  if (d < 0) return lead(d);
  if (kind === 'single') return d <= 1 ? on(1, 1, 1) : d === 2 ? on(0.5, 0.5, 0.5) : d === 3 ? on(0.2, 0.2, 0) : OFF;
  return d <= 1 ? on(1, 1, 1) : d === 2 ? on(0.3, 0, 0.3, false) : d <= 4 ? on(1, 0.35, 1) : d === 5 ? on(0.55, 0.35, 0.55) : d === 6 ? on(0.3, 0.35, 0) : d === 7 ? on(0.12, 0.35, 0) : OFF;
};
/** Frames of full stroke (the rim, lit-rain frames): stroke 1 with the core. */
export const boltFull = (e: BoltEnv) => e.stroke >= 1 && e.core;

const len = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
/** The channel from the tip up to where it leaves the frame top (y 0), clipped there. */
export const visibleChannel = (q: Pt[]): Pt[] => {
  const out: Pt[] = q.length ? [q[0]] : [];
  for (let i = 1; i < q.length; i++) {
    const a = q[i - 1], b = q[i];
    if (b[1] >= 0) { out.push(b); continue; }
    const u = a[1] / (a[1] - b[1]);
    out.push([a[0] + (b[0] - a[0]) * u, 0]);
    break;
  }
  return out;
};
const polyLen = (q: Pt[]) => q.reduce((s, p, i) => (i ? s + len(q[i - 1], p) : 0), 0);
/** Prefix of a polyline of picture length `L`. */
const prefix = (q: Pt[], L: number): Pt[] => {
  const out: Pt[] = [q[0]];
  let s = 0;
  for (let i = 1; i < q.length; i++) {
    const l = len(q[i - 1], q[i]);
    if (s + l >= L) { const u = (L - s) / (l || 1); out.push([q[i - 1][0] + (q[i][0] - q[i - 1][0]) * u, q[i - 1][1] + (q[i][1] - q[i - 1][1]) * u]); return out; }
    s += l; out.push(q[i]);
  }
  return out;
};
const dPath = (q: Pt[]) => `M${q.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}`;
/** Segments of a polyline with a width tapering w0 (first point) -> w1 (at picture length `span`, held beyond). */
const taper = (q: Pt[], w0: number, w1: number, span: number) => {
  const segs: {d: string; w: number}[] = [];
  let s = 0;
  for (let i = 1; i < q.length; i++) {
    const l = len(q[i - 1], q[i]), u = Math.min(1, (s + l / 2) / (span || 1));
    segs.push({d: dPath([q[i - 1], q[i]]), w: w0 + (w1 - w0) * u});
    s += l;
  }
  return segs;
};

const SVG = {position: 'absolute', left: 0, top: 0} as const;

/** Contact flare on the projected tip: white core disc `r`, a #e6eeff screen glow to `glow`, four seeded spark rays 30-50 px. */
export const BoltFlare = ({at, level, r = 18, glow = 80, seed = 41900, id}: {at: Pt | null; level: number; r?: number; glow?: number; seed?: number; id: string}) => {
  if (!at || level <= 0) return null;
  const [x, y] = at;
  return <>
    <svg width={1080} height={1920} style={{...SVG, mixBlendMode: 'screen', opacity: Math.min(1, level)}}>
      <defs><radialGradient id={`${id}-fg`} gradientUnits="userSpaceOnUse" cx={x} cy={y} r={glow}>
        <stop offset="0" stopColor="#e6eeff" stopOpacity={0.95} /><stop offset="0.3" stopColor="#e6eeff" stopOpacity={0.55} />
        <stop offset="0.65" stopColor="#b9ccff" stopOpacity={0.16} /><stop offset="1" stopColor="#b9ccff" stopOpacity={0} />
      </radialGradient></defs>
      <circle cx={x} cy={y} r={glow} fill={`url(#${id}-fg)`} />
    </svg>
    <svg width={1080} height={1920} style={{...SVG, opacity: Math.min(1, level)}}>
      {[0, 1, 2, 3].map((k) => {
        const a = ((25 + k * 90 + (hash(seed + k) - 0.5) * 30) * Math.PI) / 180, L = 30 + 20 * hash(seed + 10 + k);
        return <line key={k} x1={x} y1={y} x2={x + Math.cos(a) * (r + L)} y2={y + Math.sin(a) * (r + L)} stroke="#ffffff" strokeWidth={2.4} strokeLinecap="round" />;
      })}
      <circle cx={x} cy={y} r={r} fill="#ffffff" />
    </svg>
  </>;
};

/** The bolt for one frame (screen layers, drawn after the kit `Flash`): leader, or halo / body / core with branches, then the flare. */
export const Bolt = ({b, env, w = BOLT_W, flare = {r: 18, glow: 80}, haloOpacity = 0.7, id}: {
  b: BoltPaths; env: BoltEnv; w?: BoltWidths; flare?: {r: number; glow: number}; haloOpacity?: number; id: string;
}) => {
  if (b.channel.length < 2) return null;
  const vis = visibleChannel(b.channel), visLen = polyLen(vis);
  if (env.leader > 0) {
    const down = prefix([...vis].reverse(), env.leader * visLen), reach = down[down.length - 1][1];
    // 2-3 short stubs: the first 30 % of each branch whose fork point lies on the drawn part
    const stubs = b.branches.filter((q) => q[0][1] >= 0 && q[0][1] <= reach).slice(0, 3).map((q) => prefix(q, 0.3 * polyLen(q)));
    return <svg width={1080} height={1920} style={{...SVG, opacity: env.leaderOp}}>
      <g fill="none" stroke="#c9d6ff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d={dPath(down)} />{stubs.map((q, i) => <path key={i} d={dPath(q)} strokeWidth={2} />)}
      </g>
    </svg>;
  }
  if (env.stroke <= 0) return null;
  const br = env.branches;
  return <>
    <svg width={1080} height={1920} style={{...SVG, mixBlendMode: 'screen', opacity: env.stroke * haloOpacity}}>
      <defs><filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter></defs>
      <g filter={`url(#${id}-blur)`} fill="none" stroke="#b9ccff" strokeLinecap="round" strokeLinejoin="round">
        <path d={dPath(b.channel)} strokeWidth={w.halo} />
        {br > 0 && b.branches.map((q, i) => <path key={i} d={dPath(q)} strokeWidth={w.bHalo} opacity={br} />)}
      </g>
    </svg>
    <svg width={1080} height={1920} style={{...SVG, opacity: env.stroke}}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {br > 0 && b.branches.map((q, i) => <path key={i} d={dPath(q)} stroke="#e6eeff" strokeWidth={w.bBody} opacity={br} />)}
        <path d={dPath(b.channel)} stroke="#e6eeff" strokeWidth={w.body} />
        {env.core && br > 0 && b.branches.map((q, i) => <g key={i} opacity={br}>
          {taper(q, w.bCore[0], w.bCore[1], polyLen(q)).map((s, k) => <path key={k} d={s.d} stroke="#ffffff" strokeWidth={s.w} />)}
        </g>)}
        {env.core && taper(b.channel, w.core[0], w.core[1], visLen).map((s, k) => <path key={k} d={s.d} stroke="#ffffff" strokeWidth={s.w} />)}
      </g>
    </svg>
    <BoltFlare at={b.tip} level={env.flare} r={flare.r} glow={flare.glow} id={id} />
  </>;
};

/** World edges for the struck-edge light: the near roof edge (z +0.64, x 0.40 -> -0.98) and the bonnet top's outline. */
export const ROOF_EDGE_NEAR: V3[] = [[0.4, 1.49, 0.64], [-0.98, 1.49, 0.64]];
export const BONNET_EDGE: V3[] = [[1.05, 0.92, 0.85], [1.98, 0.84, 0.85], [1.98, 0.84, -0.85], [1.05, 0.92, -0.85]];

/** The live strike's cold rim on the car at `level` (0..1): the silhouette outline `#f4f8ff` 3.2 px and a 0.2 wash, and the struck edge
 *  `#ffffff` 5 px, full within 120 px of the picture contact `contactPx` and 0 by 300 px. Painted through the car's camera. */
export const paintStrikeRim = (p: Painter, c: YCam, contactPx: Pt | null, level: number, edge: V3[] = ROOF_EDGE_NEAR) => {
  if (level <= 0) return;
  const q = level < 1 ? p.layer(level, 41690) : p;
  const sil = carSilhouette(c);
  washAt(q, 41700, '#dfe8ff', 40, sil, 0.05, 0.2);
  inkLine(q, 41701, sil, {color: '#f4f8ff', weight: 3.2, still: true});
  if (!contactPx) return;
  // the edge, split into ~12 px pieces, each at its own fade by picture distance to the contact
  const pts = edge.map((v) => camPoint(c, v)).filter((v): v is Pt => !!v);
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(len(a, b) / 12));
    for (let k = 0; k < n; k++) {
      const u0 = k / n, u1 = (k + 1) / n, m: Pt = [a[0] + (b[0] - a[0]) * (u0 + u1) / 2, a[1] + (b[1] - a[1]) * (u0 + u1) / 2];
      const f = 1 - Math.min(1, Math.max(0, (len(m, contactPx) - 120) / 180));
      if (f <= 0) continue;
      inkLine(q.layer(f, 41710 + i * 100 + k), 41710, [[a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0], [a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1]], {color: '#ffffff', weight: 5, still: true, closed: false, curve: 0});
    }
  }
};
