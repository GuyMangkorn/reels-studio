# T10 — the farm dam has its east approach, the queue path, a reflection helper, the jam stone, and the near inner slope under the B04-SH06 lens (slope clearance checked)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set · Hard: no
Blocked by: T03 (`proof-dam.tsx` exists) · Consumers: B04-SH01 … B04-SH06; T16 (queue path)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [lf02-r4](../short/film-brief.md#lf02-r4) and [set plans, space D](../short/film-brief.md#set-plans-metres-estimates); b04 Space D continuity (SD06) and B04-SH06 Camera; [dam.ts](../../../../src/painted/edu30/dam.ts) (`DAM`, `southBankY`, `SHORE`, `paintDam`, `DAM_TREES`); looks.ts `LF02_DAM`, `LF02_MARKS`, `onBank`.

## Build
Extend the locked dam (LF02 R4) for the queue, reverse and close angles: the low east approach, the queue path with arc-length lookup, a water-mirror helper for anything a plate adds (flashes, spouts, birds), the jam stone, and a near-slope option for lenses that sit on the inner bank (B04-SH06, B04-SH05, B04-SH02, B04-SH04).
Files: `src/painted/edu30/dam.ts`, `src/painted/edu30/proof-dam.tsx` (adds `D30-*` compositions), `tests/edu30-dam.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| East approach | the inner bank lowers to y 0.5 between x 12 and 16 (ramp over 1.5 m each side); a trodden track 2.5 m wide from (40, 0, −45) down to (14.8, 0.5, −20), bare mud `#6e5a44` with claw-mark dashes | brief space D |
| `QUEUE_PATH: V3[]` | (70, 0, −70) → (40, 0, −45) → (14.8, 0.5, −20) → (14.5, 0.45, −12) → (14.5, 0.40, −5.2) → (8.0, 0.33, −4.9) → (−3.0, 0.33, −4.9) | b04 Space D continuity (SD06) |
| `queuePoint(s)` / `queueTangent(s)` | position and unit tangent at arc length s from the **gun end** (−3.0, 0.33, −4.9) back along the path; `sAtRimX(x)` = x + 3.0 on the rim segment (x 4.6 → s 7.6; x 1.6 → s 4.6) | ticket (T16 uses s from the head) |
| Wet rim | the R4 thin dark wet rim along the south waterline, extended along the east shore to the corner (14.5, 0.4, −5.2); width 0.25 m, colour as R4 | lf02-r4 |
| `reflect(v: V3): V3` | `[v[0], 2 × DAM.water − v[1], v[2]]` (water y 0.30); reflections toned toward `DAM.reflection` as in R4, drawn only where the projected point lies over water; also exported as a `clip` test for T04's mirrored flash | lf02-r4 reflection rules |
| `paintStone(p, c, at, seed)` | one flat stone 0.14 × 0.10 × 0.05 m, `#8d806d` lit / `#5f5547` shade, at (−5.4, 0.33, −4.9) | b04 B04-SH04 (SD07) |
| Near inner slope (`paintDam({nearSlope: true})`) | for lenses whose eye z lies on the inner slope (z −2.8..−5.0): the slope inside 4 m of the camera footprint is painted as a wash (`DAM.inner`, lit) plus 60 seeded clods and dry tussock marks (0.04–0.12 m), the two R4 bathtub rings continued to the lens, and the wet rim at the waterline; plain fills for the large area ([DF-20261030-p5brush-large-fill-mottle](../../../../docs/dev-findings.md#df-20261030-p5brush-large-fill-mottle)) | b04 B04-SH06 (camera on the slope) |
| Slope clearance (all B04 lenses, from `southBankY` at `df8a7fc`: crest 1.2 m at z −2.8, water 0.3 at z −5.0) | B04-SH06 start eye (−4.6, 1.45, −3.9): ground 0.75 → **0.70 m** clear; end (−4.68, 1.45, −3.95): 0.73 → 0.72 m · B04-SH05 (−1.6, 1.15, −4.75): 0.40 → 0.75 m · B04-SH02 (1.5, 1.1, −4.25): 0.61 → 0.49 m · B04-SH04 (−5.45, 1.0, −4.45): 0.53 → 0.47 m · B04-SH01 and B04-SH03 eyes are over the water (0.55 m and 0.62 m). All ≥ 0.3 m: **the eyes stay as written** (the sheet's B04-SH06 note assumed a 1.6 m crest, giving 0.5 m; the locked 1.2 m crest gives more) | b04 B04-SH06 Camera ("Boss confirms against `southBankY`, ≥ 0.3 m"); dam.ts |
| Clearance test | `tests/edu30-dam.test.ts` asserts eye y − `southBankY(eye z)` ≥ 0.3 for every B04 camera start and end above | ticket |
| Crew withdrawal marks | not painted; export `CREW_WITHDRAWN = {meredith: (−7.2, 0.9, −3.6), gunner2: (−6.4, 0.7, −4.0)}` for the record (no B04-SH03/SH05/SH06 frame shows them) | b04 Space D continuity |
| G1 aims | export `G1_AIM = {sh01: 0.55 rad (as LF02), fire: barrel along +x}` (B04-SH03 … SH06) | b04 Space D continuity |
| Defaults | `paintDam` with no new option equals the locked LF02 R4 painter | look lock |

References (store): `projects/edu/EDU/previews/LF02.58933d6b.png` (LF02 R4, locked), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TD2.png` (D2, the queue from the east bank, B04-SH02 reference).

## Proof
- `node scripts/test.mjs tests/edu30-dam.test.ts`: `queuePoint(sAtRimX(4.6))` = (4.6, 0.33, −4.9) ± 0.01; path continuous; `reflect` of (0, 1.0, −6) = (0, −0.4, −6); the clearance table.
- `proof-dam.tsx` (newsreel off): `D30-LF02` (CAM_LF02, defaults), `D30-queue` (B04-SH02 camera `eye (1.5, 1.1, −4.25), yaw 75, pitch 0, f 900, hy 820`, a 0.3 m dot every 1.4 m along `QUEUE_PATH` from s 7.6), `D30-sh05` (B04-SH05 camera `eye (−1.6, 1.15, −4.75), yaw 89.3, pitch −2, f 950, hy 860`), `D30-jam` (B04-SH04 camera `eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100, hy 860`, the stone), `D30-sh06` (B04-SH06 start camera `eye (−4.6, 1.45, −3.9), yaw −57, pitch −12, f 950, hy 800`, `nearSlope`, a 1.25 m test post at the GUNNER-1 mark (−6.2, 0.36, −4.75)).
- Stills through `node scripts/stills.mjs src/painted/edu30/proof-dam.tsx --gl=angle`, sheet `scripts/qa-sheet.sh out/edu30-T10/sheet.png --cols 5 --width 270 out/edu30-T10/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| D30-LF02 | the locked LF02 | mean abs pixel difference vs a pre-change render ≤ 2 |
| D30-queue | dots along the rim to the corner, then up the east shore; the east approach ramp | corner dot at (712 ± 25, 869 ± 25) px |
| D30-sh05 | rim and shallows running away from the lens toward the corner | dot at s 4.6 (x 1.6) at x 507 ± 25 px |
| D30-jam | stone below the caption band | stone centre (674 ± 25, 1361 ± 25) px |
| D30-sh06 | lit slope in the lower frame falling to the wet rim, water and far bank beyond, test post at the gunner mark | post top near (454 ± 30, 537 ± 30) px; no unpainted ground pixel below the horizon |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
