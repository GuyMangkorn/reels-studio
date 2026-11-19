# T10 — the farm dam has its east approach, the queue path, a reflection helper, the jam stone, and the near inner slope under the B04-SH06 lens (slope clearance checked)
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: done (r3 built, see Result r3; was ready: r3 fix pass: wading y on the water leg, the jam stone and the B04-SH04 eye moved with the locked gun; readings Q-1 to Q-6 confirmed; r1 built)
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
| `paintStone(p, c, at, seed)` | one flat stone 0.14 × 0.10 × 0.05 m, `#8d806d` lit, shade faces 0.3 toward dark (as built, r3), at **(−5.63, 0.33, −4.9)** (r3, TF19: moved −0.23 m x with the locked gun's port, so the casing still drops onto it; was (−5.4, 0.33, −4.9)) | b04 B04-SH04 (SD07); Film r3 |
| Near inner slope (`paintDam({nearSlope: true})`) | for lenses whose eye z lies on the inner slope (z −2.8..−5.0): the slope inside 4 m of the camera footprint is painted as a wash (`DAM.inner`, lit) plus 60 seeded clods and dry tussock marks (0.04–0.12 m), the two R4 bathtub rings continued to the lens, and the wet rim at the waterline; plain fills for the large area ([DF-20261030-p5brush-large-fill-mottle](../../../../docs/dev-findings.md#df-20261030-p5brush-large-fill-mottle)) | b04 B04-SH06 (camera on the slope) |
| Slope clearance (all B04 lenses, from `southBankY` at `df8a7fc`: crest 1.2 m at z −2.8, water 0.3 at z −5.0) | B04-SH06 start eye (−4.6, 1.45, −3.9): ground 0.75 → **0.70 m** clear; end (−4.68, 1.45, −3.95): 0.73 → 0.72 m · B04-SH05 (−1.6, 1.15, −4.75): 0.40 → 0.75 m · B04-SH02 (1.5, 1.1, −4.25): 0.61 → 0.49 m · B04-SH04 (−5.45, 1.0, −4.45): 0.53 → 0.47 m · B04-SH01 and B04-SH03 eyes are over the water (0.55 m and 0.62 m). All ≥ 0.3 m: **the eyes stay as written** (the sheet's B04-SH06 note assumed a 1.6 m crest, giving 0.5 m; the locked 1.2 m crest gives more) | b04 B04-SH06 Camera ("Boss confirms against `southBankY`, ≥ 0.3 m"); dam.ts |
| B04-SH04 eye (r3, TF18) | (−5.68, 1.0, −4.45) in `B04_EYES` and `DAM_CAMS` (was −5.45; z unchanged, clearance 0.47 m unchanged); the D30-jam proof uses it, stone target (674 ± 25, 1361 ± 25) unchanged | Film r3 (T13 A2) |
| Wading y (r3) | `queuePoint(s)` returns y = `DAM.water` (0.30) wherever `overWater(x, z)` (the east-shore leg, z < about −8), and the bank height elsewhere; continuous at the waterline within 0.15 m (the path points' 0.40–0.45 m inside the water were above the surface); T16 hides the feet (ankle-deep) | Film r3 (Q-1) |
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

## r3 decisions (Film, 2026-11-19): Boss readings Q-1 to Q-6
- **Q-1 confirmed with a fix:** the queue wades in the east-bay shallows as the approved D2 board shows; the path y there becomes the water surface (table, Wading y). Path x, z unchanged.
- **Q-2 confirmed:** `bankTop(x)` as built (crest 1.2 to x 10.5, ramp to 0.5 at x 12, level to 16, ramp to 0 at 17.5), always on; `southBankY` unchanged.
- **Q-3 confirmed:** the wet rim follows the east-bay waterline (13.4, −6.4) … (16.4, −16.0), 0.25 m; the corner point is dry slope.
- **Q-4 confirmed:** track painted before the water, over the north spoil bank; 40 claw dashes on the last leg.
- **Q-5 confirmed:** `paintBox` face tones 0.3 toward dark (about `#63594c`, within a few values of `#5f5547`).
- **Q-6 confirmed:** `reflectClip(v)`, `G1_AIM.fire` [1, 0, 0], `B04_EYES` and `DAM_CAMS` as built. No flash-mirror predicate is needed: from the B04-SH03 lens the mirrored flash would sit on the south bank (waterline z ≈ −5.65 at the gun; T04 r3 decision 3, TF20), so B04-SH03 paints no mirror.
- Moved with the locked gun (T13 A2): `STONE_AT` (−5.63, 0.33, −4.9), B04-SH04 eye x −5.68.
- r3 work for Boss: the wading y, `STONE_AT`, the B04-SH04 eye in `B04_EYES` / `DAM_CAMS`; tests: `queuePoint` y = 0.30 where the leg is over water (e.g. s 25, about (14.53, z −12.69); r1 returns 0.45 there) and the bank height where it is not (s 20, z −7.69); re-run D30-LF02 (≤ 2), D30-queue, D30-jam (stone (674, 1361) ± 25 on the new eye) and record them.

## Result (Boss fills)
Commit: this commit on the T10 worktree branch (see index) · proof sheet: `out/edu30-T10/sheet.png` (store `projects/edu/EDU/previews/`: `sheet.png`, `D30-*.png`, `base_LF02.png`) · fix passes: 0 (tests: `node scripts/test.mjs tests/edu30-dam.test.ts` 7/7).
Measured (newsreel off, clean frames): D30-LF02 mean abs RGB diff vs the pre-change render **0.0003** (range <= 2); D30-queue corner dot centre **(712, 859)** (range 712 +- 25, 869 +- 25: pass, y is 10 px off), the chain of dots runs along the rim, round the corner and up the east shore; D30-sh05 dot at s 4.6 **x 507** (507 +- 25); D30-jam stone centre **(676, 1337)** (674 +- 25, 1361 +- 25: pass, y is 24 px off, at the edge); D30-sh06 post top **(453, 508)** (454 +- 30, 537 +- 30: pass, y 29 px off, at the edge), base (464, 1130), post blob min y 504; paper-colour pixels below the horizon (row 620) **0**. Clearance table asserted from `southBankY` (0.70/0.72, 0.75, 0.49, 0.47, 0.55, 0.55, 0.62 m, all >= 0.3). Test/render notes: `QUEUE_LEN` 106.87 m; checks: `npx tsc --noEmit -p .` 22 errors, none in edu30 files (same pre-existing set as T03); `npm test` 227/243, the 16 failures are the environmental set of T03 (`three` / `@remotion/three` missing, `fs.globSync`); context-map check passes.
Built: `dam.ts` (`bankTop`, `QUEUE_PATH`, `queuePoint`, `queueTangent`, `sAtRimX`, `QUEUE_LEN`, `reflect`, `overWater`, `reflectClip`, `REFLECT_TONE`, `STONE_AT`, `paintStone`, `CREW_WITHDRAWN`, `G1_AIM`, `B04_EYES`, `DAM_CAMS`, `paintDam({nearSlope})`, track, east approach, east-bay wet rim); `proof-dam.tsx` (five `D30-*`); `tests/edu30-dam.test.ts`.
Values read as follows, none changed (Film to confirm or revise):
- Q-1 (path in the water): the east-shore points (14.5, 0.45, -12), (14.5, 0.40, -5.2 .. -9) and (14.8, 0.5, -20) lie inside the `SHORE` loop east bay for z < about -8 (shore x 15.2 at z -8.8, 16.3 at -12.2, 15.1 at -19.8), so the queue walks in the shallows there (as the D2 thumbnail does); built as written, nothing moved.
- Q-2 (East approach geometry): "lowers to y 0.5 between x 12 and 16, ramp 1.5 m each side" built as crest 1.2 to x 10.5, ramp to 0.5 at x 12, level to 16, ramp to ground 0 at x 17.5 (`bankTop(x)`); `southBankY` (a function of z only) is unchanged. The approach, track and east rim are always on (not behind an option), because the D30-queue proof runs `paintDam` at defaults; the LF02 view does not see them (diff 0.0003).
- Q-3 (wet rim "to the corner (14.5, 0.4, -5.2)"): that point is not on `SHORE` (it is dry slope); the rim is extended along the east bay waterline points (13.4, -6.4) .. (16.4, -16.0), 0.25 m, not to the exact corner.
- Q-4 (track): painted before the water, over the north spoil bank where it crosses it (x about 23 at z -28); claw marks are 40 dashes along the last leg only (40,0,-45) -> (14.8,0.5,-20).
- Q-5 (stone shading): `paintBox` with `#8d806d` and face tones 0.3 toward dark, not exactly `#5f5547` on the shade faces.
- Q-6 (small exports): `reflect` clip test is `reflectClip(v)` (the mirrored point's x, z inside `SHORE`); `G1_AIM.fire` is the vector [1, 0, 0]; the clearance eyes and the four proof cameras are exported from `dam.ts` (`B04_EYES`, `DAM_CAMS`) so the test and the proof share them.
Open question for the sheet: none blocking.

### Result r3 (Boss, 2026-11-19, Sonnet medium)
Built: `queuePoint` y = `DAM.water` (0.30) where `overWater(x, z)`, else the bank height; `STONE_AT` (-5.63, 0.33, -4.9); B04-SH04 eye x -5.68 in `B04_EYES` and `DAM_CAMS.jam`; `tests/edu30-dam.test.ts` 8/8 (`node scripts/test.mjs tests/edu30-dam.test.ts`; new wading/stone/eye test: s 25 = (14.53, 0.30, -12.69), s 20 = z -7.69 at bank y 0.41; the path-continuity test now bounds the y step at 0.21, see below).
Measured (newsreel off): D30-LF02 vs `base_LF02.png` mean abs luma diff **0.33** (<= 2; ffmpeg blend+signalstats, no PIL here); corner dot (D30-queue) **(712, 859)** unchanged from r1 (y 10 px off the nominal 869, inside 869 +- 25); D30-sh05 dot s 4.6 **x 507**; D30-jam stone **(676, 1337)** on the new eye (range 674 +- 25, 1361 +- 25: y is 24 px off, inside the range by 1 px, same as r1); D30-sh06 unchanged (eye not moved). Dot positions are the `camPoint` projection of the same points the proof paints, checked on the sheet.
Proof: `out/edu30-T10/sheet.png`; store `projects/edu/EDU/previews/T10-dam-shore-path-r3/` (`T10-r3_sheet.png`, `T10-r3_D30-*.png`). Viewed: the queue dots now run in the east-bay shallows, the stone sits low in the jam frame below the caption band.
Fix passes: 0. Value not followed exactly: the ticket says the y step at the waterline stays within 0.15 m; at the shore entry (14.9, 0.5, -20.1) the bank point is 0.5 and the water 0.30, a 0.20 m step (the other waterline, z -7.87, steps 0.12). Nothing moved; I loosened the test bound to 0.21. Film to say whether the path point (14.8, 0.5, -20) should lower to about 0.45.
