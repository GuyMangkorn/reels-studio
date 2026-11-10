// Small paint helpers for the EDU-EP14 modules.
import {inkLine} from '../kit/draw';
import type {Painter, Pt} from '../kit/painter';

/** A closed ink outline. */
export const ink = (p: Painter, id: number, pts: Pt[], weight: number, color: string) => inkLine(p, id, pts, {weight, color, curve: 0.1, still: true});
/** A thick straight ink stroke from a to b of width `w` px (a filled capsule edge with an ink edge). */
export const line = (p: Painter, id: number, a: Pt, b: Pt, w: number, color: string) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2);
  inkLine(p, id, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], {weight: Math.max(0.8, w / 6), color, curve: 0, still: true});
  p.flat(color, [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]);
};
