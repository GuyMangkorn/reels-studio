# T38 — Space-P set fixes in one pass: no ridge arcs from a high eye, a clearing flag, even-tone interleave rows, the B02-SH04 canvas, the B06 open paddock and the locked bow
Deliverable: EDU-EP30-SHORT · Revision: r1 (`EDU-EP30-TICKETS-R9`) · Status: ready
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
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
