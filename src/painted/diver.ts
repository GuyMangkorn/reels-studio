import {range, rot, type Painter, type Pt} from './kit/painter';

/** Local extents of the diver silhouette (units of `s`): fin tip at u -1.7, head top at u 0.94. */
export const DIVER_EXTENT = {back: 1.7, front: 0.94, up: 0.34, down: 0.56};

/**
 * Diver silhouette, no face (scuba, side view). (x, y) is the hip; the head points along local +x, `mirror` faces it
 * left; `s` is about 0.39 of the head-to-fin length (2.3 m in the brief's scale baseline). `kick` is the fin phase.
 * Returns the reaching hand, so a survey tape or lamp can attach to it.
 */
export const drawDiver = (p: Painter, x: number, y: number, s: number, a: number, kick: number, color: string, mirror: boolean): Pt => {
  const r = rot(x, y, s, a);
  const f = ([u, v]: Pt): Pt => r([mirror ? -u : u, v]);
  const part = (pts: Pt[]) => {
    p.wash(color, 245, pts.map(f), 0.02, 0.3);
    p.wash(color, 200, pts.map(f), 0.02, 0.5);
  };
  part([[-0.42, -0.34], [0.32, -0.3], [0.36, -0.16], [-0.42, -0.16]]); // tank
  part([[-0.6, -0.15], [0.38, -0.17], [0.62, -0.1], [0.62, 0.1], [0.38, 0.15], [-0.6, 0.12]]); // torso
  part(range(10, (u) => [0.8 + 0.14 * Math.cos(u * 6.283), 0.13 * Math.sin(u * 6.283)] as Pt)); // head
  part([[-0.6, -0.12], [-1.2, -0.12 + kick], [-1.65, -0.24 + 2 * kick], [-1.7, -0.08 + 2 * kick], [-1.2, -0.02 + kick], [-0.6, 0.0]]); // leg + fin
  part([[-0.6, 0.02], [-1.2, 0.08 - kick], [-1.62, 0.18 - 2 * kick], [-1.6, 0.3 - 2 * kick], [-1.2, 0.18 - kick], [-0.6, 0.12]]);
  part([[0.42, 0.06], [0.5, 0.14], [0.98, 0.5], [0.92, 0.56]]); // reaching arm
  part([[0.4, -0.04], [0.48, 0.04], [1.05, 0.1], [1.04, 0.02]]); // arm with lamp
  return f([0.96, 0.55]);
};

/** Screen-space bounding box of a diver drawn with the same arguments (fins included), for safe-box checks. */
export const diverBounds = (x: number, y: number, s: number, a: number, kick: number, mirror: boolean) => {
  const r = rot(x, y, s, a);
  const pts: Pt[] = ([[-1.7, -0.24 + 2 * kick], [-1.62, 0.3 - 2 * kick], [-1.7, -0.08 + 2 * kick], [0.94, 0], [1.05, 0.1], [0.98, 0.56], [-0.42, -0.34], [0.32, -0.3]] as Pt[]).map(([u, v]) => r([mirror ? -u : u, v]));
  const xs = pts.map(([px]) => px), ys = pts.map(([, py]) => py);
  return {left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys)};
};
