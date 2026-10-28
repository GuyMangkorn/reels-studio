import type {QuadText} from './types';

type Point = readonly [number, number];
export type Quad = readonly [Point, Point, Point, Point];

/** Solve the 8x8 system for the homography taking a w x h box (TL,TR,BR,BL) onto a screen quad (TL,TR,BR,BL). */
export function boxToQuadHomography(width: number, height: number, quad: Quad): number[] {
  const src: Point[] = [[0, 0], [width, 0], [width, height], [0, height]];
  const rows: number[][] = [];
  src.forEach(([x, y], i) => {
    const [u, v] = quad[i];
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  });
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let r = col + 1; r < 8; r++) if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r;
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    for (let r = 0; r < 8; r++) {
      if (r === col) continue;
      const k = rows[r][col] / rows[col][col];
      for (let c = col; c < 9; c++) rows[r][c] -= k * rows[col][c];
    }
  }
  return rows.map((row, i) => row[8] / row[i]);
}

/** CSS `matrix3d(...)` that maps the box's own pixel space onto the quad (use with `transform-origin: 0 0`). */
export function quadMatrix3d(width: number, height: number, quad: Quad): string {
  const [a, b, c, d, e, f, g, h] = boxToQuadHomography(width, height, quad);
  return `matrix3d(${[a, d, 0, g, b, e, 0, h, 0, 0, 1, 0, c, f, 0, 1].join(',')})`;
}

/** The quad for a scene-local frame; frames past the last key hold the last quad, so random seeks are stable. */
export const quadAt = (overlay: Pick<QuadText, 'quads'>, frame: number): Quad =>
  overlay.quads[Math.max(0, Math.min(overlay.quads.length - 1, Math.floor(frame)))] as unknown as Quad;

export const quadTextVisibleAt = (overlay: Pick<QuadText, 'startFrame' | 'endFrame'>, frame: number) =>
  frame >= (overlay.startFrame ?? 0) && (overlay.endFrame === undefined || frame < overlay.endFrame);
