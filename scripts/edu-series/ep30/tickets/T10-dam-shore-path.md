# T10 — the farm dam has its east approach, the queue path along the shore, a reflection helper and the jam stone
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set · Hard: no
Blocked by: none · Consumers: B04-SH01 … B04-SH05 (and T08 `queue`)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), brief [lf02-r4](../short/film-brief.md#lf02-r4) and [set plans, space D](../short/film-brief.md#set-plans-metres-estimates), sheet [b04 Space D continuity (SD06)](../short/scene-sheets/b04.md), [dam.ts](../../../../src/painted/edu30/dam.ts) (`DAM`, `southBankY`, `SHORE`, `paintDam`, `DAM_TREES`), looks.ts `LF02_DAM`, `LF02_MARKS`, `onBank`.

## Build
Extend the locked dam (LF02 R4) for the reverse and queue angles: the low east approach, the queue path polyline with arc-length lookup, a water-mirror helper for anything a plate adds (flashes, spouts, birds), and the small stone the jam casing lands on.
Files: `src/painted/edu30/dam.ts`, `src/painted/edu30/proof-dam.tsx` (new standalone still entry, compositions `D30-<name>`), `tests/edu30-dam.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| East approach | the inner bank lowers to y 0.5 between x 12 and 16 (ramp over 1.5 m each side), a trodden track 2.5 m wide from (40, 0, −45) down to (14.8, 0.5, −20), bare mud `#6e5a44` with hoof/claw-mark dashes | brief space D (low east approach x +12..+16, bank y 0.5) |
| `QUEUE_PATH: V3[]` | (70, 0, −70) → (40, 0, −45) → (14.8, 0.5, −20) → (14.5, 0.45, −12) → (14.5, 0.40, −5.2) → (8.0, 0.33, −4.9) → (−3.0, 0.33, −4.9) | b04 Space D continuity (SD06) |
| `queuePoint(s)` / `queueTangent(s)` | position and unit tangent at arc length s measured from the **gun end** (−3.0, 0.33, −4.9) backwards along the path, so s = 4.6 − (−3.0) = 7.6 is the queue head at x 4.6; export `sAtRimX(x)` = x + 3.0 for x on the rim segment | ticket (T08 queue uses s from the head) |
| Wet rim | keep the R4 thin dark wet rim along the south waterline; extend it along the east shore to the corner (14.5, 0.4, −5.2); width 0.25 m, colour as R4 | lf02-r4 |
| `reflect(v: V3): V3` | `[v[0], 2 × DAM.water − v[1], v[2]]` (water plane y 0.30); reflections are toned toward `DAM.reflection` as in R4 and drawn only where the projected point lies over water | lf02-r4 reflection rules |
| `paintStone(p, c, at, seed)` | one flat stone 0.14 × 0.10 × 0.05 m, `#8d806d` lit / `#5f5547` shade, at (−5.4, 0.33, −4.9) for B04-SH04 | b04 B04-SH04 Staging (SD07) |
| Crew withdrawal marks | not painted (no frame shows them); export `CREW_WITHDRAWN = {meredith: (−7.2, 0.9, −3.6), gunner2: (−6.4, 0.7, −4.0)}` for the record | b04 Space D continuity |
| G1 aims | `G1_AIM = {sh01: 0.55 rad (as LF02), sh03: barrel along +x}`; export | b04 Space D continuity |
| Defaults | `paintDam` with no new option equals the locked LF02 R4 painter | look lock |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (LF02 R4, locked), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TD2.png` (D2: the queue from the east bank, kept as B04-SH02's reference).

## Proof
- `node scripts/test.mjs tests/edu30-dam.test.ts`: `queuePoint(sAtRimX(4.6))` = (4.6, 0.33, −4.9) ± 0.01; path continuous; `reflect` of (0, 1.0, −6) = (0, −0.4, −6).
- `proof-dam.tsx` (newsreel off): `D30-LF02` (CAM_LF02, default options), `D30-queue` (B04-SH02 camera `eye (1.5, 1.1, −4.25), yaw 75, pitch 0, f 900, hy 820`, with a 0.3 m dot every 1.4 m along `QUEUE_PATH` from s 7.6), `D30-sh05` (B04-SH05 camera `eye (−1.6, 1.15, −4.75), yaw 89.3, pitch −2, f 950, hy 860`), `D30-jam` (B04-SH04 camera `eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100, hy 860`, the stone).
- Stills through `node scripts/stills.mjs src/painted/edu30/proof-dam.tsx`, sheet with `scripts/qa-sheet.sh --cols 4 --width 270`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| D30-LF02 | the locked LF02 | mean abs pixel difference vs a pre-change render ≤ 2 |
| D30-queue | dots along the rim to the corner, then up the east shore and out of frame left; the east approach ramp | corner dot at (712 ± 25, 869 ± 25) px (sheet projection) |
| D30-sh05 | rim and shallows running away from the lens toward the corner | dot at s 4.6 (x 1.6) projects at x 507 ± 25 px |
| D30-jam | stone below the caption band | stone centre (674 ± 25, 1361 ± 25) px (SD07) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
