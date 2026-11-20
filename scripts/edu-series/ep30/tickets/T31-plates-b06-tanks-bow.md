# T31 — plates B06-SH01 (emus advance like tanks over MEREDITH's back) and B06-SH02 (the silent bow, L15 mime) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: built (Film look check pending) · r2: Film notes added (TICKETS-R8)
Class: set (plates) · Hard: yes (slow-motion walk contacts, bow on the story clock)
Blocked by: T03, T06, T07, T08, T09, T12 · Consumers: B06-SH01, B06-SH02 (global 1434–1579)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b06.md](../short/scene-sheets/b06.md) B06-SH01 and B06-SH02 (authoritative); brief VD30-05b (bow as painted) and [R3 changes](../short/film-brief.md#r3-changes) (one bow, no smirk, no victory pose, cut before L16).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B06-SH01.tsx`, `src/painted/edu30/shots/B06-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0 (morning NE sun, rim light on the birds), eaten 0.7, stubble 0, newsreel warm strength 1 | T09 schedule |
| B06-SH01 camera | eye (−1.6, 0.6, −1.0), yaw −6 → 0, pitch 6, f 1020, hy 900, ease-in-out L 0–109 (pan only) | b06 B06-SH01 Camera |
| B06-SH01 MEREDITH | T12 D (`new: P44-back`) at (−2.4, 0, −2.2) facing −z, still; only shoulder and hat in frame at the top left (partial silhouette, intended); mouth never visible | b06 B06-SH01 |
| B06-SH01 line | T08 `slowLine(L)`: EMU-HERO footfall on L 96 (global 1530, "ถัง"), stop at L 109; dust puff per footfall (0.3 m, `paintPlume`) | T08 |
| B06-SH02 camera | eye (0.3, 1.5, −3.15) → (0.3, 1.5, −3.3), yaw −12.2 → −7, pitch −2, f 1000, hy 760, ease-in-out L 0–35 | b06 B06-SH02 Camera |
| B06-SH02 EMU-HERO | (0, 0, −5.0) facing +z (heading π/2; a cheat from B06-SH01's x −1.4 across the cut, accepted: different lens and size); L 0–4 still (stand, eyes to the lens, lid 0.30); bow = `mixEmuPose(stand, EMU_POSES.bow(), u)`: u 0 → 1 over **L 5–19** (ease-in-out, bottom at L 19 = global 1563), 1 → 0 over **L 19–31**; feather ruffle L 5–15 (body plume jitter ± 0.01 m, seeded per plume, on the story clock); L 31–35 upright and still, neutral (no smirk); feet: the bow's `pads` mix in and out with u (one foot draws back and returns) | b06 B06-SH02 Staging; VD30-05b |
| B06-SH02 one bow | exactly one bow; no hold of the bow into L16; cut at 1580 | FACTCHECK-R3 |
| Probe leads | B06-SH01 EMU-HERO L 0 and 109; B06-SH02 head point at L 19 | T03 probe |

**Judgment for the builder (Hard).** B06-SH01: slow, heavy, inevitable: each stance foot planted, the line advancing like armour. B06-SH02: a beat of stillness, then one slow gracious bow (the locked bow as painted) and back up, deadpan.

## r2 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`)
These override any older value in this ticket that they name.
- **Slow line (T08 r5, TF26).** B06-SH01 reads `slow(L)` as built: 84 f cycle, hero contacts L 12 / 54 / 96 on alternate feet, hero frozen from L 100 with both feet down at z −3.87. The proof camera was too small to judge the walk: at the plate size view stills L 0, 12, 33, 54, 75, 96 and say in Result whether the slow steps read as walking (yes / no, with the hero's lead height); a "no" comes back to Film, not a change here.

## Proof
- Stills (`out/edu30-T31/`): SH01 L 0, 54, 96, 109; SH02 L 0, 5, 12, 19, 25, 31, 35.
- `scripts/qa-sheet.sh out/edu30-T31/sheet.png --cols 6 --width 270 out/edu30-T31/s*.png`; `measure-shots.ts B06-SH01 0,109`; clean SH01 L 96 and SH02 L 19 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 / 109 | line abreast, EMU-HERO centre, MEREDITH's shoulder and hat top left | EMU-HERO 485 ± 25 → 615 ± 30 px |
| SH01 L 96 | EMU-HERO's foot just planted | the stance pad's world position equal at L 96 and L 100 (slip ≤ 0.02 m) |
| SH02 L 19 | bottom of the bow, head above y 1100 | bow head near (549 → 436, 993 → 1024) ± 40 px |
| SH02 L 35 | upright, eyes to the lens, no smirk | tuft and bib visible |

## Result (Boss fills)
Built 2026-11-20 (Boss, Sonnet medium). Commit: see the T31 line of the index. Fix passes used: 0. Proof sheet: store `projects/edu/EDU/previews/T31-sheet.png` (14 frames, 7 x 2) and `T31-s1_<L>.png` / `T31-s2_<L>.png` (clean, full size); logs `out/logs/T31-*.log`.

| Frame | Measured (`measure-shots.ts`, head top to toe line) | Row | Result |
| --- | --- | --- | --- |
| SH01 L 0 | EMU-HERO 531 px, x 705, top 663 | 485 ± 25 | **not met** (+46 px, 1.09 x) |
| SH01 L 109 | 706 px, x 610, top 559 | 615 ± 30 | **not met** (+91 px, 1.15 x); L 96 697 px, L 54 622 px |
| SH01 L 96 vs L 100 | both stance pads equal at L 96, 98, 100 and 109 (world (-1.29, 0, -3.651) and (-1.51, 0, -3.959)) | slip <= 0.02 m | met (0.000 m) |
| SH02 L 19 | head point (418, 1029) | (549 -> 436, 993 -> 1024) ± 40 | y met (1029); x 418 vs 436 met (18 px) |
| SH02 L 35 | upright, eyes to the lens, no smirk; tuft and bib visible; head top (420, 559), standing 1210 px | standing 909-986 | height **not met** (rig is 1.2 x the sheet figure) |

Slow-line read at plate size (r2 note): stills L 0, 12, 33, 54, 75, 96 (and 109) viewed on the sheet. **Yes, the slow steps read as walking:** the hero's lead height grows 531 -> 565 -> 622 -> 697 px (L 0 / 12 / 54 / 96) and the stance legs change between frames; the line advances heavily, each foot planted, MEREDITH leaving frame left as the camera pans. Only two line birds sit inside the 1080 px frame (hero and the left bird); the others are beyond the edges.

Decisions where a value could not be followed as written:
1. **Gun clearing.** `paintPaddockScene` always paints the clearing's 0.85 m wheat wall (r 3.7 about (-0.3, -0.4)) after the cast. The sheet stages the line at z -4.6 to -3.8 (beyond that wall) with feet visible, so the first stills showed only the necks over a wall (SH01) and the hero's feet under a mound (SH02). Both plates paint the set through `paintOpenPaddock` (exported from `B06-SH01.tsx`, imported by SH02): the same layers and seeds as `paintPaddockScene` without `paintClearing`, with `setNoClearing(true)` so the ridges fill the clearing area. `paddock.ts` is not edited (T09's file). Film: confirm B06 has no clearing wall, or add a `clearing: false` flag to T09.
2. **Bow head.** The locked `EMU_POSES.bow()` puts the head at about y 1337 px at L 19 (below the caption band and the y 1100 line), against the sheet's world point (0, 1.1, -4.6) = (436, 1024). The bow is `bow({head: [0.72, 1.20, 0], neckMid: [0.58, 1.44, 0]})` mixed from `stand`, so pads, lid 0.55, headDir and body pitch stay locked; only head and mid-neck are lifted to the sheet point. Reads as a swan-neck dip at 270 px (W3.2 limit accepted).
3. **Bird size.** The sheet projection numbers were computed for a smaller bird; the built hero is 1.09-1.15 x (SH01) and 1.2 x (SH02) those heights. The cast is never scaled (common rules); camera and positions are as the sheet, so SH01 EMU-HERO >= 480 px (acceptance) holds and the SH02 bow stays above y 1100 only with the lifted head. Film: restate the row numbers for the built rig or accept.
4. **Ruffle.** The rig has no ruffle input: the SH02 feather ruffle jitters the `body` bone's keys and flats up to 0.01 m (sine envelope over L 5-15, seeded per plume and per frame, a pure function of L).

Caption zone (`caption-zone.py`, clean frames): SH01 L 96 mean 0.672 / p95 0.989 and SH02 L 19 p95 0.932, both `pass: false`: the band y 1150-1344 is pale sand and sky-lit ground in both plates (shared set look, not a plate choice). Editor's caption stroke carries the contrast; Film to judge.
Hand lines: none (MEREDITH's arms hang in the T12 P44-back pose, no hand close-up; thumb and arm checks N/A). Open question: none blocking.
