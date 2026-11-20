# T33 — plates B07-SH01 (burn-out to full colour, crane to the coat of arms) and B07-SH02 (push in; the relief emu looks at the lens) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: **done** (R10: T39 accepted) · was: ready
Class: set (plates) · Hard: yes (relief emu head turn and blink)
Blocked by: T01, T03, T07 · Consumers: B07-SH01, B07-SH02 (global 1737–1976)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b07.md](../short/scene-sheets/b07.md) B07-SH01 and B07-SH02 (authoritative; SD11); brief VD30-04/04a and [arms-check](../short/arms-check.md) AV01–AV03 (shown once, nothing overlaid, never a logo or end card); looks.ts `armsLook`, `CAM_LF03`, `CAM_A2`; [arms.ts](../../../../src/painted/edu30/arms.ts).

## Build
Replace the two stub shot files with the plates; the emblem is LF03 as locked and never changes except the relief emu's head and lid.
Files: `src/painted/edu30/shots/B07-SH01.tsx`, `src/painted/edu30/shots/B07-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space A as LF03: `paintArmsSky`, `paintSandstoneWall`, `paintArms` (supporters as W3: kangaroo ×1.3 at x −1.12, emu ×1.12 at x +1.12 on the wattle top y 3.45), `paintWattleBed`; morning sun from the upper left; paper `#e8d8b8` | b07 B07-SH01 Staging; brief look frames |
| B07-SH01 newsreel | `strength` 1 → 0 linear over L 0–9, `pop` 0.15 / 0.10 / 0.05 on L 0 / 1 / 2, tint cool (tintMix 1) released with the strength; from L 10 strength 0 (no grain, weave or tint); one plate, no two-canvas dissolve ([DF-20261029-painted-timeline-dissolve](../../../../docs/dev-findings.md#df-20261029-painted-timeline-dissolve)) | b07 Newsreel burn-out; T01 |
| B07-SH01 camera | start eye (−0.3, 1.0, 4.5), yaw 0, pitch 4, f 1200, hy 760 → end eye (−0.3, 2.6, 4.5), pitch 20 (= LF03) over L 0–100 ease-in-out; hold L 100–117 | b07 B07-SH01 Camera (SD11) |
| B07-SH02 camera | eye (0.95, 3.9, 2.7) → (0.95, 3.9, 2.4), yaw 4, pitch 16, f 1000, hy 900, ease-out over L 0–90; hold L 90–121 | b07 B07-SH02 Camera |
| B07-SH02 relief emu | `ArmsOpts.emuPose`: KP-look pose; `headYaw` 0 → the KP-look three-quarter value over L 34–49 (ease-in-out), held; `lid` = T07 `blinkLid(L − 54, 0.30)`; nothing else on the emblem moves | b07 B07-SH02 Staging; T07 |
| No overlay | no title, card or mark change on the arms; only the standing chrome and the Editor's captions | AV01–AV03 |
| Probe leads | B07-SH01 relief emu at L 100; B07-SH02 relief emu at L 0 and 90 | T03 probe |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r2/LF03.png` (B07-SH01 end, locked LF03 R2), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TA2.png` (B07-SH02 end).

**Judgment for the builder (Hard, face).** The relief emu turns its head like the B01-SH03 stare, a small proud look and one blink, and stays a carved relief (35 % depth, sandstone light): no living-bird texture, no colour change.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T39-sheet.png`. **Verdict: accept with value change (done).** The word sits on the scroll in every frame with the newsreel filter at L 0–9; the crane opens on scroll and wattle. Fix passes: 1 (T39). See T39 R10 notes (TF62).

## Proof
- Stills (`out/edu30-T33/`): SH01 L 0, 2, 9, 10, 50, 100, 117; SH02 L 0, 34, 49, 55, 90, 121.
- `scripts/qa-sheet.sh out/edu30-T33/sheet.png --cols 7 --width 270 out/edu30-T33/s*.png`; `measure-shots.ts B07-SH01 100` and `B07-SH02 0,90`; clean SH01 L 100 and SH02 L 90 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 / 10 | flare, then full colour with no grain, weave or tint | L 10 filter `none` (logged) |
| SH01 L 100 | matches LF03 (both supporters, scroll above the captions) | mean abs pixel difference ≤ 4 vs a fresh `CAPTION=0 sh scripts/edu-series/ep30/short/render-looks.sh T33 LF03` still (the store still carries caption and chrome); scroll y < 1100 |
| SH02 L 49 / 55 | relief emu head turned to the lens / blink shut | relief emu 630–705 px painted; head above y 1100 |

## Result (Boss fills)
Built 2026-11-20, Boss (Sonnet 5.5), fix passes 0. Commit: see the index row.
- Proof (store): `~/ReelsStore/projects/edu/EDU/previews/T33-sheet.png` (13 stills, 7x2) and `T33-s1_{000,002,009,010,050,100,117}.png`, `T33-s2_{000,034,049,055,090,121}.png`, `T33-crop_{034,049,055}.png`. Local copy `out/edu30-T33/`. Logs `out/logs/T33-*.log`.
- SH01 L 0 / 10: flare (pop 0.15 / 0.10 / 0.05 on L 0-2), strength 1 to 0 over L 0-9, cool tint released with it; logged `newsreelFilter` and weave at L 9, 10, 50, 117 are `none` (strength 0). Pass.
- SH01 L 100 vs fresh `CAPTION=0 ... render-looks.sh T33 LF03` still: mean abs luma difference 0.65 / 255 (ffmpeg blend difference, signalstats YAVG). Pass (≤ 4). The word AUSTRALIA is a DOM overlay (`ReliefWord`) in look.tsx, not painted in the plate, so the plate scroll is blank (see build-notes). SH01 relief emu probe L 100: 511-956 = 445 px, matches the sheet. Scroll y < 1100: NOT measured in pixels (no probe for it); in the L 100 sheet tile the scroll sits close to y 1100, so Film should check it.
- SH02 L 49 / 55: relief emu head turned to the lens (headYaw -1.25, the TA2 three-quarter value, L 34-49), blink lid bump at L 55 (`blinkLid(L-54, 0.30)`). Painted emu measured by eye on `T33-s2_049.png`: head top y 625 to toe y 1410, about 785 px; probe box 808 at L 90, 719 at L 0 (sheet 721 / 809). Row range 630-705 px is NOT met (785 vs 630-705); the sheet's tool numbers (721 / 809) were followed instead, because they come from the locked stack camera. Head top at y 625, above y 1100. Pass.
- Caption zone (`scripts/caption-zone.py`, clean frames): SH01 L 100 mean 0.7, p95 0.853; SH02 L 90 mean 0.621, p95 0.927; both "pass false" against the default max-mean 0.25. The sunlit sandstone is bright by design and LF03 is locked with the same wall; recorded as a known limit, not a defect fixable in the plate. Film to decide whether captions get a stroke here (edu stroke is the default).
- Additions beyond the rows: (1) SH01 paving fill `wFill(41790, '#bfae8c')` below the bed so the crane's first frames have ground (off screen from about L 40); (2) SH02 `reel` strength 0 because DEFAULT_REEL is strength 1 (warm newsreel) and the sheet puts SH02 out of the old filter.
- Not followed: painted emu height range of SH02 (above). Hand and thumb lines N/A (no hands); emu identity N/A (relief emus are not hero).
- Checks: `npx tsc --noEmit -p .` 8 errors, all in unrelated tests (render-options, arm-depth, edu18-girl, loudness), none in B07 files. `npm test`: 486 tests, 477 pass, 9 fail (HIPPO.YAWN/CHARGE/HALT joints, loudness, new-shot, render-inputs, segments file-level failures, canvasStyleOf (d) B03-SH01), none touch B07 or my files (`grep -c B07` in the log is 0); log `out/logs/T33-test.log`.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T33-sheet.png` (13 frames). **Verdict: fix (in T39): the word and the crane start; sizes and scroll accepted.**
| Item | Decision | Reason |
| --- | --- | --- |
| AUSTRALIA on the scroll | **fix** (T39 rows W1–W5): one shared `ReliefWord30` in `shot.tsx`, rendered inside the canvas wrapper from `stackCam`, used by `look.tsx` and the B07 plates | the plates show a blank scroll; a DOM word must follow the crane, so it is projected per frame |
| SH01 opening | **fix** (T39 row K1): crane start pitch 4 → 12 (end LF03 unchanged); the L 0–10 frames were half bare paving. TF48 | the opening should read as the scroll and wattle at the wall foot during the colour burn-out |
| SH02 emu height | as built: probe **719 → 808 ± 30**, painted ≈ 785 px (the row 630–705 used an LF03 ratio that does not apply at this camera). TF45 | the sheet's own tool numbers from the locked camera |
| Scroll y at SH01 L 100 | accepted as LF03 (diff 0.65 / 255): scroll centre (625, 1076) per the sheet, word baseline above y 1150 (T39 logs it) | LF03 is user-locked |
| Caption zone | SH01 L 100 0.70 / 0.853, SH02 L 90 0.621 / 0.927: pass under TF46 | edu stroke captions on sunlit sandstone |
