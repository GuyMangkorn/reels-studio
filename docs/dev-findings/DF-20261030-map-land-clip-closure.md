# DF-20261030-map-land-clip-closure — a clipped continent polygon closes along the clip edge and draws a straight bar

- Owner: Boss; first observed: 2026-10-30 (BLOOP pass 2, FR05 land fill, SH09 at G1103: a grey horizontal bar across the map window); last checked: 2026-10-30 (Boss, working tree, base `3130527`)
- Status: fixed (uncommitted; a winding ring is closed through the pole row at lat −90, below the map window; the Antarctic fill is drawn)
- Type: implementation-bug (baking the land fill from the window-clipped Natural Earth rings)
- Tags: 2D / map / SVG / land / clipping / data
- Scope: `scripts/the-bloop/bake-land.py` (unwrap, clip to lon 145–340 E, project, simplify), `src/painted/bloop/land.json`, `src/painted/bloop/map.tsx` (`LandFill`)
- Consumers: BLOOP-EP01-SHORT SH02, SH05, SH07, SH09 (map plates); the coastline (`coast.json`) is a line path and is not affected

## Symptoms and evidence
- Desired: continents read as mass in SH09 (FR05), with no artefacts.
- Observed: the first land bake had the Antarctic ring with a horizontal edge at lat −64 (y 1241) running the full window width. In SH09 at the pan the edge sits at screen y ≈ 720 and reads as a grey rectangle.
- Reproduce: `python3 -I` on the rings of `src/painted/bloop/land.json` before the fix: ring 0 (Antarctica, y 1233–1484) and ring 1 (Antarctic peninsula, y 1241–1421) each contain a horizontal edge at y 1241.

## Attempts and results
- Unwrapping each ring and clipping to the window keeps the correct interior for rings that do not touch the pole. For the polar rings the clipped polygon closes along the clip boundary, which is the straight edge.
- Fix applied (pass 3): a ring that winds once around the pole (|last lon − first lon| > 180 after unwrapping) gets two closing points at lat −90 (world y 1484), so its closing edge lies below the window. `bake-land.py` no longer skips the Antarctic rings. Verified: long flat edges in `land.json` now lie only at y 1484; the bar scan (`scripts/the-bloop/bar-scan.py`) flags 0 of 74 SH09 frames, with a positive control (810 px edge caught) and a dashed-line control (rejected).
- Earlier (pass 2) workaround: Antarctic rings skipped; superseded.

## Planning impact
- Film: the Antarctic mass is filled to the pole row (below the window); it shows as the continent fill in SH09 when B07 pans in.
- Mark: none.
- Follow-up: any future land or region fill from clipped data must check for horizontal edges along clip boundaries (script check: long horizontal edges in the baked rings).

## Revalidation history
- 2026-10-30 (Boss, working tree, base `3130527`): SH09 frames before and after the fix; bar scan over all 74 SH09 frames → fixed. Merge status: not merged.
