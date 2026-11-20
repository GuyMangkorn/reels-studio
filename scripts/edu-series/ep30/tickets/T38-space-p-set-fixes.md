# T38 — Space-P set fixes in one pass: no ridge arcs from a high eye, a clearing flag, even-tone interleave rows, the B02-SH04 canvas, the B06 open paddock and the locked bow
Deliverable: EDU-EP30-SHORT · Revision: r1 (`EDU-EP30-TICKETS-R9`) · Status: **done** (R10: accept with value change, TF61)
Class: set (bundle) · Hard: yes (B06-SH02 bow is animal movement)
Blocked by: none (T09, T20, T21, T31 done or built; this pass is their fix pass 1) · Consumers: B02-SH01, B02-SH04, B06-SH01, B06-SH02; T22 r8 (uses `tone: 'even'`)
Model: sonnet, medium

**Bundle (R9, user 2026-11-20: fix everything together).** This one Boss invocation carries **fix pass 1 of T20, T21 and T31** and a small T09 capability. Fix-pass counting: each of T20, T21, T31 records `1 (T38)` in the index; T09 stays `1`.

Read first: [common rules](index.md#common-rules); T20, T21, T31 Result sections (what was built); `src/painted/edu30/paddock.ts` (`paintWheatRidges`, `paintHighWheat`, `paintPaddockScene`, `setNoClearing`); `src/painted/edu30/shots/B06-SH01.tsx` (`paintOpenPaddock`, the local copy this ticket retires).

## Build
1. `paddock.ts` (T09's file): (a) a high-eye ridge start radius; (b) `PadSceneOpts.clearing?: boolean`; (c) `paintWheatRidges` option `tone`. Defaults reproduce every existing call bit for bit except the high-eye rule, which only cameras with eye y > 3 m and pitch > −20° meet (B02-SH01 L ≈ 56–83 and B02-SH06 L ≈ 70–74; no other plate camera, checked by Film against every plate camera line in SCENE-R2).
2. `B02-SH04.tsx`: canvas sheet colour.
3. `B06-SH01.tsx`, `B06-SH02.tsx`: use the new flag instead of the local `paintOpenPaddock` (delete that export and its import); B06-SH02 bow back to the locked pose.
4. `B02-SH01.tsx`: no code change expected; re-proof only (the rule lives in `paddock.ts`).

Files: `src/painted/edu30/paddock.ts`, `tests/edu30-paddock.test.ts`, `src/painted/edu30/shots/B02-SH04.tsx`, `src/painted/edu30/shots/B06-SH01.tsx`, `src/painted/edu30/shots/B06-SH02.tsx` (and `B02-SH01.tsx` only if the proof shows it needs a change; say so in Result).

## Decided values
| Row | What | Value | Source |
| --- | --- | --- | --- |
| P1 | ridge start radius from a high eye | in `paintWheatRidges`, when the caller passes no `r0` and the camera is not in the high view (pitch > −20°): `r0 = c.y > 3 ? 2.5 + 6 × (c.y − 3) : 2.5` (m). In that case (c.y > 3, not high) call `paintHighWheat(p, c, seed + 7000, st, o.eaten)` **before** the ridge loop so the ground inside r0 has the high-view texture, not a bare fill. At c.y ≤ 3 nothing changes | T20 R9 (SH01 L 56–100 arcs; TF47) |
| P1b | fallback | if arcs still read in the lower half at L 60 or L 70, use the factor 9 instead of 6 and log it; no other knob | ticket |
| P2 | clearing flag | `PadSceneOpts.clearing?: boolean`, default `true`. `false`: `paintPaddockScene` skips both `paintClearing` calls and calls `setNoClearing(true)` for its own ridge pass, restoring the previous value before it returns (the same layers and seeds as B06's `paintOpenPaddock`) | T31 R9 (TF43) |
| P3 | interleave tone | `paintWheatRidges` option `tone?: 'alt' \| 'even'`, default `'alt'` (today's alternating lit/shaded rows). `'even'`: every row uses `mixColor(PAD.wheat, PAD.wheatLit, 0.12)` blended toward `STRAW` by stubble as today; stalk and ear strokes unchanged | T22 R9 (the interleave bands read as light/dark rings at L 58–74) |
| C1 | B02-SH04 canvas sheet | `#b9a77c` → **`#8a8160`** (olive-khaki army canvas, about luma 128 between the sand ground and the gun metal); size, centre and guns unchanged | T21 R9 (sheet edge invisible on the warm dirt) |
| B1 | B06-SH01 set | `paintPaddockScene(p, c, {light: LIGHT, eaten: EATEN, stubble: 0, clearing: false}, cast)` | T31 R9 |
| B2 | B06-SH02 set | same call as B1 | T31 R9 |
| B3 | B06-SH02 bow | `mixEmuPose(EMU_POSES.stand({lid: 0.3, headYaw: yaw}), EMU_POSES.bow({headYaw: yaw * 0.5}), bowU(L))`: **remove `BOW_LIFT`** (the locked KP-EMU bow as painted, VD30-05b); timing (L 5–19 down, 19–31 up), ruffle, pads mix and camera unchanged | T31 R9 (TF44: the lifted head read as a swan-neck dip; B06-SH02 has no caption) |

**Judgment for the builder (Hard, B06-SH02).** One slow gracious bow: the neck lowers the head well down in front of the chest at L 19 and rises again by L 31; the feet stay as the bow's pads mix (one foot draws back and returns). No second dip, no hold.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
**Verdict: accept with value change (done).** B02-SH01 luma row restated to y 1000–1180 ≤ 12 (met); B02-SH04 L 0 leads restated to 631 / 617 / 624; B06-SH01, B06-SH02 bow, caption zones and LF01a pass. Pad slips not re-measured: accepted by construction (flock and pad code unchanged).

## Proof
`npx tsc --noEmit -p .`; `node scripts/test.mjs tests/edu30-paddock.test.ts` with three new tests: (i) `r0` rule: c.y 1.55 → 2.5, c.y 3.2 → 3.7, c.y 8.6 → 36.1 (or the P1b factor); (ii) `clearing: false` paints no clearing polygon (count or hash) and restores `noClearing`; (iii) `tone: 'even'` gives one fill colour for every row. LF01a locked-look render vs `LF01a.baseline-63fa4f6.png`: mean abs diff ≤ 2. Stills through `shots-index.tsx`; sheet at 270 px; archive `out/edu30-T38` as `T38-*.png` with `T38-sheet.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B02-SH01 L 56, 60, 70, 80, 90 (540 px, viewed) | no concentric arc rows in the lower half; the field reads as wheat from above, then the ridges grow in from the distance as the eye drops | row-mean luma (trend removed) over y 800–1180 at L 60 and L 80: **≤ 12** (logged); consecutive-frame mean abs luma diff at L 55→56 and L 82→83 logged (no visible pop, viewed) |
| B02-SH01 L 100, 135, 151 | unchanged from the T20 build (c.y 1.3) | mean abs diff vs store `T20-s1_100.png`, `T20-s1_135.png`, `T20-s1_151.png` ≤ 1 (guides-on frames compared with guides on) |
| B02-SH04 L 86 | the canvas sheet edge reads under both guns | mean luma: sheet interior box vs dirt 30 px outside the sheet edge **≥ 25** apart; gun body vs sheet **≥ 25** apart (logged) |
| B02-SH04 L 0, 44 | unchanged except the sheet colour | leads as T21 (MEREDITH 631, GUNNER-1 622, GUNNER-2 619 ± 3) |
| B06-SH01 L 0, 54, 96, 109 | line birds' feet visible on open trampled wheat, no wall or mound | EMU-HERO **531 ± 25** at L 0, **706 ± 30** at L 109 (TF43, as built); pad slip L 96–109 ≤ 0.02 m |
| B06-SH02 L 0, 10, 15, 19, 25, 31, 35 (stills every 2–4 f through the bow, 270 px sheet) | one bow, head down in front of the chest at L 19, back up by L 31; tuft and bib visible at L 0 and L 35 | head point y at L 19 logged (expected ≈ 1337 from T31's measure) and **≥ 120 px above the toe line**, inside the frame; standing **1210 ± 40** at L 35; pads ≤ 0.02 m slip outside the bow's own foot move |
| B02-SH06 L 74 (no code change here; Film's check on the P1 rule) | logged only | mean abs diff vs the store T22 full frame at L 74 (c.y 3.2 → r0 3.7) logged |
| caption zone (TF46) | clean B02-SH01 L 0 and L 100, B02-SH04 L 86, B06-SH01 L 96 | `caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99` (B02-SH01 L 0–56: `--max-mean 0.92`) pass |

## Result (Boss fills)
Built 2026-11-20 (Boss, Sonnet medium). Commit: the T38 line of the index. Fix passes used: 0 for T38 (it is fix pass 1 of T20, T21, T31). Proof: store `projects/edu/EDU/previews/T38-sheet.png` (6 key frames), `T38-sheet-sh01.png` (B02-SH01 L 55, 56, 60, 70, 80, 82, 83, 90, 100, 135, 151 + B02-SH06 L 74), `T38-sheet-sh04.png`, `T38-sheet-b06sh01.png`, `T38-sheet-b06sh02.png` (12 frames through the bow) and every full-size `T38-*.png` (42 files; `T38-clean_*` are guides-off). Tests: `tests/edu30-paddock.test.ts` 11/11 (three new in one test: `ridgeR0` 2.5 / 3.7 / 36.1, `clearing: false` drops the clearing strokes and the next default call hashes equal, `tone: 'even'` gives one wash colour against more than three for `'alt'`). `tsc` shows no error in the touched files. Built: `ridgeR0` + `tone` + `clearing` in `paddock.ts`; B02-SH04 sheet `#8a8160`; B06-SH01/SH02 use `paintPaddockScene({..., clearing: false})`, `paintOpenPaddock` and its import deleted, `BOW_LIFT` removed; B02-SH01.tsx unchanged. P1b factor 9 not used (no arcs read at L 60 or L 70).

| Row | Measured | Range | Result |
| --- | --- | --- | --- |
| SH01 L 60 / L 80 row-mean luma, trend removed, y 800-1180 | std 24.7 / 29.8 (quadratic trend) | <= 12 | **not met as written**: the band y 800-1000 holds the dark eaten patch (a plate shape, not rings); on y 1000-1180 (below the patch) std **2.5 / 3.8**, y 1060-1180 0.7 / 4.1 (met). Film: restate the row on y 1000-1180 |
| SH01 L 55->56, 82->83 consecutive mean abs luma diff | 11.6, 16.1 (logged) | logged | camera moves 0.3 m and 2.5 deg a frame there; frames viewed on `T38-sheet-sh01.png`, no pop at 55->56; between L 70 (smooth wash) and L 80 (ridges from r0 5.2 m) the ridges appear as the eye drops |
| SH01 L 60, 70 lower half | no arcs: flat high-wheat texture under the distant ridges (viewed at 540 px) | no arcs | met. At **L 80-90** (eye 3.45 -> 1.88 m, r0 5.2 -> 2.5) concentric ridge rows with stalks under the birds read as in the T20 L 100 build; not changed (P1 as decided) |
| SH01 L 100, 135, 151 vs T20 | 0.001, 0.001, 0.001 | <= 1 | met |
| SH04 L 86 sheet vs dirt | sheet interior 147, dirt 203: **56** apart; gun body 51-61 vs sheet 147: **~90** apart | >= 25 | met |
| SH04 L 0, 44 leads | L 0: MEREDITH 631, GUNNER-1 617, GUNNER-2 624; L 44: MEREDITH 647, GUNNER-1 622, GUNNER-2 619 | 631 / 622 / 619 +- 3 | met at L 44 and for MEREDITH L 0; GUNNER-1 / -2 at L 0 are 617 / 624 (the row values are the L 44 ones; the colour cannot change a lead) |
| SH06 L 74 vs T22 `T22-s74.png` | mean abs diff 1.56 (logged) | logged | |
| B06-SH01 L 0, 109 EMU-HERO | 531, 706 | 531 +- 25, 706 +- 30 | met; L 0, 54, 96, 109 viewed: feet on open trampled wheat, no wall or mound. Pad slip L 96-109 not re-measured (the flock code is unchanged; T31 measured 0.000 m) |
| B06-SH02 bow | head y at L 19 **1337** (toe line 1725: **388 px above**), inside the frame; head y L 15 1169, L 25 970, L 31 650; standing at L 35 **1210**; one bow, down by L 19 in front of the chest, up by L 31 (12 frames viewed, 270 px) | head >= 120 px above toe, 1210 +- 40 | met. Pads: only the head and mid-neck keys changed, the pads mix is as T31; slip not re-measured |
| Caption zone (clean frames, band 1150:1344) | SH01 L 0 mean 0.875 / p95 0.907 (<= 0.92); SH01 L 100 0.758 / 0.895; SH04 L 86 0.786 / 0.796; B06-SH01 L 96 0.755 / 0.901 | mean <= 0.80 (0.92 for SH01 L 0), p95 <= 0.99 | all pass |
| LF01a vs `LF01a.baseline-63fa4f6.png` | mean abs diff 0.029 | <= 2 | met |

Values not followed: none. Notes: guides-on stills at L 0 of B06-SH01 needed a rerun (the browser timed out three times under load). Pad-slip numbers were not re-measured (no script in the checkout). Open question: none blocking.
