import {range, rot, type Painter, type Pt} from './kit/painter';

// EBA storage jar profile: half-width along the axis from mouth (u 0) to flat base (u 1), as fractions of length.
const JAR: [number, number][] = [
  [0, 0.12], [0.04, 0.12], [0.06, 0.085], [0.12, 0.09], [0.22, 0.24], [0.34, 0.3], [0.5, 0.31], [0.66, 0.28], [0.82, 0.21], [0.94, 0.15], [1, 0.14],
];
export const jarHalf = (u: number) => {
  for (let i = 1; i < JAR.length; i++) {
    if (u <= JAR[i][0]) {
      const [u0, w0] = JAR[i - 1], [u1, w1] = JAR[i];
      return w0 + ((u - u0) / (u1 - u0)) * (w1 - w0);
    }
  }
  return JAR[JAR.length - 1][1];
};

export type JarLook = {body: string; shade: string; ink: string};
/** Hero features (VD06) and their trace progress, 0 = not traced, 1 = whole feature traced. */
export type JarTrace = {base?: number; handles?: number; lines?: number};
export type JarOptions = JarLook & {
  /** false draws the outline only (far haze jars). */
  detail?: boolean;
  /** Mouth and neck missing, with a jagged break. */
  broken?: boolean;
  /** Screen y of the sand line: everything below it is clipped, so the jar sits half-buried. */
  bury?: number;
  /** VD06 hero jar: raised clay belt at the widest part, two incised lines on the shoulder, zigzag in the middle. */
  hero?: boolean;
  /** Opaque flat underlayer under the body, so a background dissolve does not show through (match cuts). */
  solid?: boolean;
  /** Hold the ink still instead of boiling it (a frozen silhouette during a match). */
  stillInk?: boolean;
  /** Outline weight (default 1.3; close-ups read better around 2). */
  inkWeight?: number;
  /** Top-light highlight colour along the upper flank (close-ups). */
  highlight?: string;
  /** Per-feature trace lines (B04 demonstration), drawn in `traceColor` over the features. */
  trace?: JarTrace;
  traceColor?: string;
};

/** Partial polyline: the first `p` (0..1) of the path by arc length. */
const partial = (pts: Pt[], p: number): Pt[] => {
  if (p >= 1) return pts;
  if (p <= 0 || pts.length < 2) return [];
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let left = seg.reduce((a, b) => a + b, 0) * p;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (left >= seg[i]) {
      out.push(pts[i + 1]);
      left -= seg[i];
      continue;
    }
    const u = left / seg[i];
    out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]);
    break;
  }
  return out;
};

/**
 * Round-bellied storage jar with two side handles and a flat base. (cx, cy) is the jar centre; `angle` points
 * mouth -> base; `len` is the mouth-to-base length in px. Returns the screen-space outline (after burial clipping).
 */
export const drawJar = (p: Painter, id: number, cx: number, cy: number, len: number, angle: number, o: JarOptions): Pt[] => {
  const {brush} = p;
  const f = rot(cx, cy, len, angle);
  const cut = o.bury ?? Infinity;
  const clamp = ([x, y]: Pt): Pt => [x, Math.min(y, cut)];
  const at = (u: number, side: number): Pt => f([u - 0.5, side * jarHalf(u)]);
  const u0 = o.broken ? 0.3 : 0;
  const outline: Pt[] = [...range(14, (u) => at(u0 + u * (1 - u0), -1)), ...range(14, (u) => at(1 - u * (1 - u0), 1))];
  if (o.broken) outline.push(f([u0 - 0.5 + 0.07, 0.14]), f([u0 - 0.5 - 0.02, 0.03]), f([u0 - 0.5 + 0.06, -0.16]));
  const shape = outline.map(clamp);
  if (o.solid) p.flat(o.body, shape);
  p.wash(o.body, 240, shape, 0.05, 0.45);
  // Shade on whichever side faces down in screen space (light comes from above).
  const down = Math.cos(angle) >= 0 ? 1 : -1;
  if (o.detail !== false) {
    p.wash(o.shade, 180, [...range(8, (u) => at(u0 + 0.06 + u * (0.88 - u0), down * 0.1)), ...range(8, (u) => at(0.94 - u * (0.88 - u0), down * 0.97))].map(clamp), 0.1, 0.4);
  }
  if (o.highlight) {
    p.wash(o.highlight, 130, [...range(8, (u) => at(u0 + 0.12 + u * (0.78 - u0), -down * 0.9)), ...range(8, (u) => at(0.9 - u * (0.78 - u0), -down * 0.45))].map(clamp), 0.08, 0.5);
  }
  if (o.hero) {
    // Raised clay belt at the widest part: a lighter band with a shade edge.
    p.wash(o.body, 200, [...range(6, (u) => f([0.0 - 0.025, (u * 2 - 1) * jarHalf(0.5) * 0.98])), ...range(6, (u) => f([0.0 + 0.025, (1 - u * 2) * jarHalf(0.5) * 0.98]))].map(clamp), 0.04, 0.3);
  }
  const setInk = (k: number, name: string, color: string, weight: number) => (o.stillInk ? p.inkStill : p.ink)(k, name, color, weight);
  setInk(id, 'pen', o.ink, o.detail === false ? 1 : o.inkWeight ?? 1.3);
  brush.noFill();
  brush.polygon(shape);
  if (o.detail === false) return shape;
  // Side handles: loops at the shoulder on both sides, skipped where buried.
  const handles = [-1, 1].map((side) => [f([-0.2, side * 0.25]), f([-0.15, side * 0.38]), f([-0.03, side * 0.39]), f([0.02, side * 0.3])] as Pt[]);
  for (const h of handles) if (h.every(([, y]) => y < cut)) brush.spline(h, 0.6);
  // Cross-body lines bow slightly toward the viewer (a lying jar seen from above and the side).
  const across = (u: number, wobble = 0, n = 10): Pt[] => range(n, (v) => f([u - 0.5 + 0.03 * Math.sin(v * Math.PI) + wobble * Math.sin(v * n * Math.PI), (v * 2 - 1) * jarHalf(u) * 0.96]));
  const base = [at(1, -1), at(1, 1)];
  const lines = o.hero ? [across(0.22), across(0.27)] : [range(10, (u) => f([-0.24 + 0.012 * Math.sin(u * 18), (u * 2 - 1) * 0.25]))];
  const zigzag: Pt[] = range(12, (v, i) => f([0.4 - 0.5 + (i % 2 ? 0.035 : -0.035), (v * 2 - 1) * jarHalf(0.4) * 0.92]));
  if (!o.broken) {
    setInk(id + 500, 'HB', o.ink, 1);
    for (const l of lines) brush.spline(l.map(clamp), 0.5);
    brush.line(...clamp(at(0.04, -1)), ...clamp(at(0.04, 1)));
    if (o.hero) {
      brush.spline(zigzag.map(clamp), 0);
      setInk(id + 501, 'pen', o.ink, 1.1);
      brush.spline(across(0.475).map(clamp), 0.5);
      brush.spline(across(0.525).map(clamp), 0.5);
      brush.line(...clamp(base[0]), ...clamp(base[1]));
    }
  }
  if (o.trace) {
    // Demonstration traces: each feature line drawn progressively in the trace colour (boiling, even on a still jar).
    const traceInk = o.traceColor ?? '#f4e6b8';
    const feature = (k: number, progress: number | undefined, paths: Pt[][]) => {
      if (!progress || progress <= 0) return;
      p.ink(id + 600 + k, 'pen', traceInk, 2.2);
      for (const path of paths) {
        const part = partial(path, progress);
        if (part.length > 1) brush.spline(part.map(clamp), 0.3);
      }
    };
    feature(0, o.trace.base, [range(6, (u) => at(1 - 0.01, -1 + 2 * u))]);
    feature(1, o.trace.handles, handles);
    feature(2, o.trace.lines, o.hero ? [...lines, zigzag] : lines);
  }
  return shape;
};
