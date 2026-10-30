# DF-20261030-zcpaint-section-floor-cast — figure and box cast shadows on section plates are projected in 3D

- Owner: Boss; first observed: 30 Oct 2026 (pass 8, S-P11 light kit); last checked: 30 Oct 2026
- Status: workaround (pass 8: floor-only cast, `RK-26` fallback)
- Type: technique (projection) and measure
- Tags: 2D / light / cast shadow / section projection / RK-26
- Scope: `src/painted/zcpaint/light.ts` (`castBy`, `secFloorCast`, `boxFloorCast`, `roomFloorQuad`, `keyFaces`), `body6.ts` (`figCast`, `sectionCast`, `drawFig` option `screenCast`), `sets.ts` (`castFloor`), `rooms.ts` (`CASTERS`, `UnitExtra.casts`), `b09.ts`, `zcpaint.tsx` (`truck`, `FigSpec`)
- Consumers: B04-SH01, B06-SH01, B07-SH02, B09-SH01/SH03 (section plates); B10-SH01 uses the same `castBy` through the perspective

## Symptoms and evidence
- The sheet's floor cast (`floorCast` / `castPolys`, local px with a fixed 0.26 floor factor) is a skew in the figure frame. It is correct for the elevation sheet but not for a section plate, where depth maps through `S.P` (`s(d) = 1 / (1 + d / 6)`).
- Pass 8 projects each figure part point by point: local px → metres (447 px/m), lifted to 3D with a 0.24 m body depth (`d ± 0.12` for a profile, `Y ± 0.12` for a front or back view), projected along the key to z = 0, then through the section or perspective projection. The part hulls are clipped to the room's floor quad.
- Boxes (fridge, counter, basin, cistern, bucket, can stacks, phone, sofa, side table, plant pot) cast the hull of their eight projected corners, clipped the same way.
- Key travel is data: `KEY_SEC_DAY` (L = (-0.4, -0.65, 0.5) in ZC-UNIT) and `KEY_B10` (-0.5, -0.6, 0.3). Face tones (`keyFaces`): top and +Y side lit, camera-facing front in cel (`LT-02`); day three uses the half step.

## Decision (RK-26 fallback, floor only)
- Receivers are the room's floor only. Partitions (Y 1.5 and 3.3) and the back wall are not receivers: a cast is clipped to the figure's room (`roomOf` / `ROOMS`), so a cast stops at a partition.
- Wall-hung items (mirror cabinet, towel, shoe shelf, jacket, switch) cast no shadow; a `RK-26` wall receiver was not built.
- Not measured: a walking figure crosses Y 1.5 around pf 35 of B04-SH01; the cast stop at the partition is unverified on a full-resolution crop.

## Implication for Mark and Film
- Keep figures and floor props inside one room so their cast reads; a shadow reaching a partition is cut there.
- Wall-hung props need their shadow written off the wall (no shadow in the plates).
