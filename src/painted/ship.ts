import {lerp, range, rot, type Painter, type Pt} from './painter';

export type ShipLook = {hull: string; sail: string; sailShade: string; ink: string; rim?: string};

/** Local height of the mast top above the waterline, in hull units (s). Used to frame the >=480 px lead. */
export const SHIP_MAST_TOP = -1.5;

/**
 * VD03 generic small cargo boat (reconstruction, rig c. 2500 BC uncertain): long low hull with high curved posts,
 * a single mast with a SMALL, partly torn square sail (user decision Q2, 29 Oct 2026), a stern steering oar and at
 * most two distant crew silhouettes. No deck rail pattern and no readable cargo jars.
 * (cx, cy) is mid-hull at the waterline; `s` is half the hull length in px; `heel` in radians.
 * `torn` 0..1 grows the missing lower leeward corner and the flapping strips.
 */
export const drawShip = (p: Painter, id: number, cx: number, cy: number, s: number, heel: number, o: ShipLook & {torn?: number}) => {
  const {brush, t} = p;
  const f = rot(cx, cy, s, heel);
  const sheer = (x: number) => -0.16 - 0.07 * Math.pow(Math.abs(x) / 0.78, 2.4);
  const hull: Pt[] = [
    [-1.1, -0.72], [-1.04, -0.78], [-0.98, -0.66], [-0.9, -0.42], [-0.8, -0.24],
    ...range(14, (u) => [-0.78 + u * 1.56, sheer(-0.78 + u * 1.56)] as Pt),
    [0.86, -0.3], [0.95, -0.5], [1.0, -0.68], [1.08, -0.74], [1.1, -0.66], [1.04, -0.4], [0.94, -0.12], [0.84, 0.03],
    ...range(10, (u) => [0.8 - u * 1.6, 0.03 + 0.07 * (1 - Math.pow((0.8 - u * 1.6) / 0.85, 2))] as Pt),
    [-0.92, 0.0], [-1.04, -0.22], [-1.12, -0.5],
  ];
  // Silhouette hull: two passes, because watercolour fills are translucent.
  p.wash(o.hull, 245, hull.map(f), 0.04, 0.35);
  p.wash(o.hull, 210, hull.map(f), 0.03, 0.5);
  // Steering oar on the stern quarter.
  p.wash(o.hull, 240, ([[-0.8, -0.38], [-0.77, -0.36], [-1.08, 0.06], [-1.16, 0.1], [-1.13, 0.02]] as Pt[]).map(f), 0.05, 0.3);
  const top = SHIP_MAST_TOP;
  // Small square sail: yard at -1.28, foot at -0.78, half-width 0.38 (the spike's was 0.64 wide and reached the boom).
  const yardY = -1.28, footY = -0.78, half = 0.38;
  const torn = Math.max(0, Math.min(1, o.torn ?? 0));
  const belly = 0.03 * Math.sin(t * 1.3);
  // Leeward lower corner torn away: the cut runs from the leech down to the foot, deeper as `torn` grows.
  const tearX = lerp(half, 0.02, torn), tearY = lerp(footY, -1.12, torn);
  const sail: Pt[] = [
    [-half, yardY], [0, yardY - 0.04], [half, yardY],
    ...(torn > 0 ? ([[half - 0.02, tearY], [lerp(half, 0.2, 0.5) , lerp(tearY, footY, 0.45)], [tearX + 0.1, lerp(tearY, footY, 0.7)], [tearX, footY + 0.01]] as Pt[]) : ([[half + belly, -1.03], [half - 0.02, footY]] as Pt[])),
    [0, footY + 0.02 - belly], [-half + 0.02, footY], [-half + belly, -1.03],
  ];
  // Mast first, sail over it.
  p.ink(id + 1, '2B', o.ink, 2.4);
  brush.line(...f([0, sheer(0)]), ...f([0, top]));
  p.wash(o.sail, 235, sail.map(f), 0.08, 0.5);
  p.wash(o.sailShade, 150, ([[-half + 0.02, -1.2], [-0.12, -1.22], [-0.06, footY + 0.02], [-half + 0.04, footY]] as Pt[]).map(f), 0.2, 0.5);
  p.ink(id + 2, '2B', o.ink, 1.6);
  brush.spline(([[-half - 0.04, yardY], [0, yardY - 0.05], [half + 0.04, yardY]] as Pt[]).map(f), 0.5);
  brush.noFill();
  brush.polygon(sail.map(f));
  // Rigging: forestay, backstay and the two lifts, thin pen lines.
  p.ink(id + 3, 'HB', o.ink, 1.1);
  brush.line(...f([0, top]), ...f([1.0, -0.66]));
  brush.line(...f([0, top]), ...f([-0.98, -0.66]));
  brush.line(...f([0, top]), ...f([-half - 0.04, yardY]));
  brush.line(...f([0, top]), ...f([half + 0.04, yardY]));
  // Hull outline and one wale; no rail pattern.
  p.ink(id + 4, '2B', o.ink, 1.5);
  brush.noFill();
  brush.polygon(hull.map(f));
  brush.spline(range(10, (u) => f([-0.82 + u * 1.64, sheer(-0.82 + u * 1.64) + 0.07])), 0.4);
  if (torn > 0) {
    // Strips of the torn corner flapping to leeward.
    p.ink(id + 5, 'HB', o.ink, 1.2);
    const strips = Math.round(1 + 2 * torn);
    for (let k = 0; k < strips; k++) {
      const ax = lerp(half - 0.02, tearX, (k + 0.5) / strips), ay = lerp(tearY, footY, (k + 0.5) / strips);
      const sw = 0.07 * Math.sin(t * 9 + k * 1.9);
      brush.spline([f([ax, ay]), f([ax + 0.12, ay + 0.06 + sw]), f([ax + 0.24, ay + 0.03 - sw]), f([ax + 0.32, ay + 0.08 + sw])], 0.6);
    }
  }
  // Distant crew: two silhouettes, no faces. Helmsman at the oar, one figure amidships.
  for (const [hx, lean] of [[-0.74, -0.2], [0.3, 0.1]] as [number, number][]) {
    const b = sheer(hx) - 0.04;
    p.wash(o.ink, 245, ([[hx - 0.03, b], [hx + 0.03, b], [hx + 0.025 + lean * 0.1, b - 0.18], [hx - 0.025 + lean * 0.1, b - 0.18]] as Pt[]).map(f), 0.02, 0.2);
    p.wash(o.ink, 245, range(8, (u) => [hx + lean * 0.12 + 0.03 * Math.cos(u * 6.283), b - 0.22 + 0.034 * Math.sin(u * 6.283)] as Pt).map(f), 0.02, 0.2);
  }
  if (o.rim) {
    p.ink(id + 6, 'HB', o.rim, 1.2);
    brush.spline([f([-1.04, -0.78]), f([-0.95, -0.6]), f([-0.82, -0.3])], 0.5);
    brush.spline([f([-half, yardY]), f([-half + 0.01, -1.03]), f([-half + 0.02, footY])], 0.5);
  }
};
