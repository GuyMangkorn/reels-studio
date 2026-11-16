// Filed from EDU-EP19-SHORT (KIT-P01, W8.4, 16 Nov 2026; a copy: the episode keeps src/painted/edu19/soi.ts unchanged). The in-canvas circle
// mask behind EP19's painted irises (`b01-iris`, B01-SH04 -> SH05 -> SH06): a `Painter` whose marks stay inside a circle, so an inset scene, a
// vignette or an iris-in / iris-out is painted inside one plate (one canvas per page) by growing `r`. Pair with an SVG ring / clip overlay for
// any layer drawn over the plate (EP19 `IrisOverlay` in src/painted/edu19/b01-iris.tsx).
import type {Brush} from '../BrushCanvas';
import type {Painter, Pt} from './painter';

/** Sutherland-Hodgman clip of a polygon to a convex polygon (counter-clockwise or clockwise; `cw` sign handles both). */
export const clipConvex = (pts: Pt[], clip: Pt[]): Pt[] => {
  let out = pts;
  const n = clip.length, sgn = Math.sign((clip[1][0] - clip[0][0]) * (clip[2][1] - clip[0][1]) - (clip[1][1] - clip[0][1]) * (clip[2][0] - clip[0][0])) || 1;
  for (let i = 0; i < n && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % n], inside = (q: Pt) => sgn * ((b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0])) >= 0;
    const src = out; out = [];
    for (let k = 0; k < src.length; k++) {
      const p = src[k], q = src[(k + 1) % src.length], ip = inside(p), iq = inside(q);
      if (ip) out.push(p);
      if (ip !== iq) {
        const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]), d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]), k2 = d1 / (d1 - d2);
        out.push([p[0] + (q[0] - p[0]) * k2, p[1] + (q[1] - p[1]) * k2]);
      }
    }
  }
  return out;
};

/** A painter whose marks stay inside the circle (cx, cy, r): polygons clipped, ink splines cut to their inside runs. */
export const clipPainter = (p: Painter, cx: number, cy: number, r: number): Painter => {
  const circle: Pt[] = Array.from({length: 72}, (_, i) => [cx + r * Math.cos((i / 72) * 6.283), cy + r * Math.sin((i / 72) * 6.283)]);
  const raw = p.brush as unknown as Record<string | symbol, unknown>;
  const brush = new Proxy(raw, {get: (t, k) => {
    const v = Reflect.get(t, k, t);
    if (typeof v !== 'function') return v;
    if (k === 'polygon') return (pts: Pt[]) => { const q = clipConvex(pts, circle); if (q.length >= 3) v.call(t, q); };
    if (k === 'spline') return (pts: Pt[], curv?: number) => {
      let run: Pt[] = [];
      const flush = () => { if (run.length >= 2) v.call(t, run, curv); run = []; };
      for (const q of pts) { if (Math.hypot(q[0] - cx, q[1] - cy) <= r) run.push(q); else flush(); }
      flush();
    };
    return v.bind(t);
  }}) as unknown as Brush;
  // Painter.wash / flat draw through makePainter's own brush, so they are clipped here too.
  const q: Painter = {...p, brush, layer: (a, base) => clipPainter(p.layer(a, base), cx, cy, r),
    wash: (col, op, pts, bleed, tex) => { const k = clipConvex(pts, circle); if (k.length >= 3) p.wash(col, op, k, bleed, tex); },
    flat: (col, pts) => { const k = clipConvex(pts, circle); if (k.length >= 3) p.flat(col, k); }};
  return q;
};
