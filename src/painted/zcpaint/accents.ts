import {mixColor} from '../kit/painter';
import {ell, INK} from './ctx';
import {dim, type Flat, type Lights} from './sets';
import type {Section} from './space';

// ZCPAINT room accents (S-P13, `VD-ZCP-ROOM` RM-02 colour and RM-04 props, Boss pass 8). One desaturated accent per room, never brighter
// than his face, and 3-5 readable props per room. Wall-hung items stand off the wall, but their shadow is not painted (floor-only
// fallback, `RK-26`); floor items (the mat, the pot, the plant) cast their floor shadow through `rooms.ts` casters. Flat fills, no texture.

const BACK = 3.19;
const GROUT = '#a9c4bf';

/** Bathroom wainscot to 1.2 m on the back wall (RM-02 pale aqua tile, RM-05 light grout lines); drawn before the fixtures. */
export const wainscot = (f: Flat, S: Section, L: Lights) => {
  const {P} = S, light = L.bath, tile = dim('#bfd9d4', light), grout = mixColor(dim('#bfd9d4', light), GROUT, 0.6);
  f.fill(tile, [P(1.6, 1.2, BACK), P(3.3, 1.2, BACK), P(3.3, 0, BACK), P(1.6, 0, BACK)]);
  for (let y = 1.9; y < 3.3; y += 0.3) f.line([P(y, 0, BACK), P(y, 1.2, BACK)], 0.4, grout, false);
  f.line([P(1.6, 0.6, BACK), P(3.3, 0.6, BACK)], 0.4, grout, false);
  f.line([P(1.6, 1.2, BACK), P(3.3, 1.2, BACK)], 0.6, mixColor(tile, INK, 0.3), false);
};

/** RM-02 accents and RM-04 props per room, after the fixtures. */
export const roomAccents = (f: Flat, S: Section, L: Lights) => {
  const {P} = S;
  // Entry (navy): a jacket on a hook on the door wall, above the shoe shelf (the shoe shelf and its pairs are in `entryWall`).
  const navy = dim('#2f3d55', L.entry);
  f.fill(navy, [P(0.18, 1.78, 2.4), P(0.18, 1.78, 2.62), P(0.18, 1.12, 2.62), P(0.18, 1.12, 2.4)]);
  f.line([P(0.18, 1.78, 2.4), P(0.18, 1.78, 2.62), P(0.18, 1.12, 2.62), P(0.18, 1.12, 2.4)], 0.5, INK, true);
  f.line([P(0.18, 1.72, 2.4), P(0.18, 1.72, 2.62)], 0.4, mixColor(navy, INK, 0.3), false);
  f.line([P(0.18, 1.88, 2.51), P(0.18, 1.8, 2.51)], 0.6, INK, false);

  // Bathroom (pale aqua wainscot, RM-02): a wood mirror cabinet over the basin, a mustard towel, a terracotta mat, a plant on the vanity.
  const L_B = L.bath;
  f.fill(dim('#b99c72', L_B), [P(1.72, 1.86, BACK), P(2.02, 1.86, BACK), P(2.02, 1.46, BACK), P(1.72, 1.46, BACK)]);
  f.fill(dim('#c3d3d2', L_B), [P(1.78, 1.8, BACK), P(1.96, 1.8, BACK), P(1.96, 1.52, BACK), P(1.78, 1.52, BACK)]);
  f.line([P(1.78, 1.8, BACK), P(1.96, 1.8, BACK), P(1.96, 1.52, BACK), P(1.78, 1.52, BACK)], 0.5, INK, true);
  f.line([P(1.84, 1.74, BACK), P(1.9, 1.62, BACK)], 0.5, '#eef4f3', false);
  const towel = dim('#c9a04a', L_B);
  f.fill(towel, [P(2.44, 1.36, BACK), P(2.6, 1.36, BACK), P(2.6, 0.95, BACK), P(2.44, 0.95, BACK)]);
  for (const y of [2.49, 2.55]) f.line([P(y, 1.3, BACK), P(y, 1.0, BACK)], 0.45, mixColor(towel, INK, 0.35), false);
  f.line([P(2.4, 1.38, BACK), P(2.64, 1.38, BACK)], 0.6, INK, false);
  const mat = dim('#b5653f', L_B);
  f.fill(mat, [P(2.0, 0, 0.45), P(2.9, 0, 0.45), P(2.9, 0, 1.15), P(2.0, 0, 1.15)]);
  f.line([P(2.0, 0, 0.45), P(2.9, 0, 0.45), P(2.9, 0, 1.15), P(2.0, 0, 1.15)], 0.5, mixColor(mat, INK, 0.4), true);
  const pot = dim('#a65a3a', L_B), herb = dim('#5b8a4e', L_B);
  f.fill(pot, [P(1.8, 0.97, 2.95), P(1.92, 0.97, 2.95), P(1.92, 0.85, 2.95), P(1.8, 0.85, 2.95)]);
  const c = P(1.86, 1.08, 2.95);
  f.fill(herb, ell(c[0], c[1], 11, 11, 10));
  f.fill(mixColor(herb, '#ffffff', 0.12), ell(c[0] - 4, c[1] - 6, 6, 6, 8));

  // Kitchenette (warm wood, RM-02): a terracotta herb pot and a red-capped bottle on the counter (the counter top is z 0.9).
  const L_K = L.kitchen;
  const pot2 = dim('#a65a3a', L_K), leaf = dim('#6f9a58', L_K);
  f.fill(pot2, [P(4.35, 1.0, 2.95), P(4.48, 1.0, 2.95), P(4.48, 0.9, 2.95), P(4.35, 0.9, 2.95)]);
  const h = P(4.42, 1.1, 2.95);
  f.fill(leaf, ell(h[0], h[1], 12, 12, 10));
  f.fill(mixColor(leaf, '#ffffff', 0.1), ell(h[0] + 5, h[1] - 3, 6, 7, 8));
  const glass = dim('#5d7a4e', L_K);
  f.fill(glass, [P(5.15, 1.12, 2.85), P(5.25, 1.12, 2.85), P(5.25, 0.9, 2.85), P(5.15, 0.9, 2.85)]);
  f.fill(dim('#a23a2e', L_K), [P(5.165, 1.16, 2.85), P(5.235, 1.16, 2.85), P(5.235, 1.12, 2.85), P(5.165, 1.12, 2.85)]);

  // Living room (mustard cushion, green plant): a cushion leaning on the sofa's back against the seat, and a potted plant by the glazing.
  const L_L = L.living;
  const cushion = dim('#c9a03f', L_L);
  f.fill(cushion, [P(7.4, 0.8, 0.7), P(7.52, 0.8, 0.7), P(7.52, 0.45, 0.7), P(7.4, 0.45, 0.7)]);
  f.line([P(7.4, 0.8, 0.7), P(7.52, 0.8, 0.7), P(7.52, 0.45, 0.7), P(7.4, 0.45, 0.7)], 0.4, mixColor(cushion, INK, 0.3), true);
  const pot3 = dim('#a65a3a', L_L), leaf3 = dim('#4f7f4a', L_L);
  f.fill(pot3, [P(8.92, 0.22, 0.22), P(9.1, 0.22, 0.22), P(9.1, 0, 0.22), P(8.92, 0, 0.22)]);
  const p3 = P(9.01, 0.46, 0.32);
  f.fill(leaf3, ell(p3[0], p3[1], 13, 15, 10));
  f.fill(mixColor(leaf3, '#ffffff', 0.1), ell(p3[0] + 4, p3[1] - 6, 6, 7, 8));
};
