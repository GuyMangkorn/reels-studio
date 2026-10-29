# Index — ZCONDO-SHORT (TH + EN)

Scene-handoff index for `ZCONDO-SHORT-TH` and `ZCONDO-SHORT-EN` (Short only, Full tier). One shared picture plan with separate per-language conforms (brief `VD-ZC-TL`). No sequence blockout or runtime timeline exists yet.

| Item | Path / revision | Status |
| --- | --- | --- |
| Delivery record | [../../../scripts/zombie-condo/delivery.md](../../../scripts/zombie-condo/delivery.md) | `ZCONDO-SHORT-TH`, `ZCONDO-SHORT-EN`; target 60–80 s (user override 28 Oct 2026) |
| Scripts | `ZCONDO-SHORT-TH-R3` ([script.md](../../../scripts/zombie-condo/short/script.md)), `ZCONDO-SHORT-EN-R3` ([script-en.md](../../../scripts/zombie-condo/short/script-en.md)) | user-approved 28 Oct 2026 (“อนุมัติ R3”) |
| Fact-check | [fact-check.md](../../../scripts/zombie-condo/short/fact-check.md#recheck-r3) R3 recheck | `ready-for-storyboard` (non-blocking advisories) |
| Visual brief | [visual-brief.md](visual-brief.md) `VB-ZCONDO-SHORT-R3.3` (29 Oct 2026, Film; point revision of R3.2: B10-SH01 camera reconciled with `ZC-WORLD`, him left / door right, bag out of frame in B10, cabinet 1.20 m held, clearances edge to edge; [handoff R3.3](visual-brief.md#mark-handoff-r33)); R3.2 (point revision of R3.1 adopting `SP02`: measured seated leads accepted, cut-plane ×1.117, B09-SH01 sliver camera y 0.78, B07-SH02 TH trim 9, phone side; [handoff R3.2](visual-brief.md#mark-handoff-r32)); R3.1 answered `MK-Q2`–`MK-Q5` ([verdicts](visual-brief.md#mark-handoff-r31)) | `ready-for-mark`; spikes `SP01` / `SP02` pass on blockout (Boss); sheets `SS-R2.4` apply R3.3 (B10-SH01 camera/layout, bag y 0.38); Boss re-measures B10 on the rigged `zc-you` and aligns the cabinet to 1.20 m |
| **Scene sheets** | `ZCONDO-SHORT-SS-R2.4` (Mark, 29 Oct 2026; supersedes SS-R2.3/R2.2/R2.1/R2/R1 of the same day; matches brief R3.3 and SP02 measurements; B10-SH01 camera reconciled, trash-bag continuity `MK-ZC-ST-07` at y 0.38): [sc01-b01-b03.md](sc01-b01-b03.md), [sc01-b04-b05.md](sc01-b04-b05.md), [sc01-b06-b08.md](sc01-b06-b08.md), [sc01-b09-b10.md](sc01-b09-b10.md) | **`ready-for-dev`** (B06 overlay text `pending-label-check`); timing `estimated` |
| User review page | [ZCONDO Short Storyboard](https://claude.ai/artifact/Q46BrR5mAQhSiqLytVkiZf) for `ZCONDO-SHORT-SS-R2.2` (TH view, republished 29 Oct 2026; **stale for B01-SH01, B02-SH01, B02-SH02, B03-SH01, B04-SH01, B09-SH01 after SS-R2.3 and B10-SH01 after SS-R2.4 (bag rest y 0.40 → 0.38; B10-SH01 camera, layout, labels and screen side changed: the user's earlier `ok` on B10 was for the mirrored SS-R1 layout and needs a fresh review), needs republishing**; [workflow](../../../docs/mark-storyboard-workflow.md#user-storyboard-review-page)); preview column links Boss blockout captures by shot ID ([preview labels](../../../docs/boss-asset-workflow.md#preview-labels)): B01-SH01 (SP01), B02-SH02 (re-rendered for SS-R2.3: `out/qa/zombie-condo/sp02/B02-SH02_end_c122.png`, `B02-SH02_start_c39.png`), B07-SH02, B09-SH01, B09-SH03 (SP02); B07-SH02 end (c95) and B09-SH01 (camera y 0.90) predate SS-R2.2 and are marked so on the page | published; user verdicts: all 23 shots `ok` and Q-R3-1 `no-music` on `SS-R1` (28 Oct 2026, read from the page store 29 Oct 2026; user approval of SS-R1 only). On `SS-R2.2`: B02-SH02 `change` (trash bag, see open items); other shots not yet reviewed, and the page shows their SS-R1 verdicts as history only |
| Sequence blockout / runtime | — | not started (Editor, after Boss plates or placeholders) |

Target checkout: `main` @ `e44adb4` (sheets uncommitted in the working tree). 30 fps, 1080×1920; TH 2124 frames (≈70.8 s), EN 2103 frames (≈70.1 s), both `estimated` from the R3 scripts and brief anchors; TH Botnoi and EN edge-tts audio not generated.

## Readiness

`ready-for-dev` means the written scope, shot direction, timing confidence, dependencies, entry/exit states and acceptance are complete enough for Boss plate production and Editor blockout. It is not user approval, not audio sync, not runtime or visual proof. Only `B01-SH01` has a rendered blockout plate (SP01). Plate trims and every event frame are estimates to be re-locked after measured audio (brief `VD-ZC-TL` rule 2; `RK-01`).

## Scene / shot order and timeline mapping

Story scene `S01` spans the whole composition (scene-local = composition frames, offset 0). Planned runtime: one `Scene` entry per shot per deliverable (23 entries); multi-clip shots use several `media` clips inside one entry. Runtime evidence: none yet (Editor fills).

| Shot (`ZCONDO-SHORT-S01-…`) | Sheet | TH frames | EN frames | Media |
| --- | --- | --- | --- | --- |
| B01-SH01 | [b01-b03](sc01-b01-b03.md#b01-sh01--ots-reveal-down-the-corridor) | [0, 105) | [0, 93) | video |
| B01-SH02 | b01-b03 | [105, 153) | [93, 141) | video |
| B02-SH01 | b01-b03 | [153, 180) | [141, 186) | video |
| B02-SH02 | b01-b03 | [180, 288) | [186, 318) | video (section, corridor open) |
| B02-SH03 | b01-b03 | [288, 351) | [318, 402) | still + `pictureMove` |
| B03-SH01 | b01-b03 | [351, 411) | [402, 465) | 5 stills |
| B04-SH01 | [b04-b05](sc01-b04-b05.md) | [411, 459) | [465, 522) | video |
| B04-SH02 | b04-b05 | [459, 666) | [522, 753) | still + diagram overlay |
| B04-SH03 | b04-b05 | [666, 729) | [753, 819) | 3 video inserts |
| B04-SH04 | b04-b05 | [729, 741) | [819, 852) | still + `pictureMove` |
| B05-SH01 | b04-b05 | [741, 792) | [852, 900) | still + `pictureMove` |
| B05-SH02 | b04-b05 | [792, 855) | [900, 993) | video |
| B05-SH03 | b04-b05 | [855, 1023) | [993, 1149) | video + 2 stills + overlays |
| B06-SH01 | [b06-b08](sc01-b06-b08.md) | [1023, 1194) | [1149, 1290) | video + overlay |
| B06-SH02 | b06-b08 | [1194, 1257) | [1290, 1335) | video + overlay |
| B06-SH03 | b06-b08 | [1257, 1293) | [1335, 1359) | 2 stills + overlay |
| B07-SH01 | b06-b08 | [1293, 1389) | [1359, 1428) | video |
| B07-SH02 | b06-b08 | [1389, 1470) | [1428, 1503) | video |
| B08-SH01 | b06-b08 | [1470, 1620) | [1503, 1638) | video |
| B09-SH01 | [b09-b10](sc01-b09-b10.md) | [1620, 1776) | [1638, 1740) | still + `pictureMove` + overlays |
| B09-SH02 | b09-b10 | [1776, 1860) | [1740, 1818) | video |
| B09-SH03 | b09-b10 | [1860, 1938) | [1818, 1902) | still + `pictureMove` |
| B10-SH01 | b09-b10 | [1938, 2124) | [1902, 2103) | video + overlay |

Shot ranges equal the brief's per-shot table except internal splits refined in the sheets (EN B05-SH03 bowl part). Boundaries: no neighbour scenes outside the composition; internal cut boundaries are written in each sheet's entry/exit lines.

<a id="shared-staging-constants-mk-zc-st"></a>
## Shared staging constants (`MK-ZC-ST`)

Design values within `PROJ-ZC-R3` / `SCALE-ZC-R2` (brief owns world, axes, units, camera classes). `S-03` builds the unit; where Boss's geometry differs, Boss reports the measured value and Mark revises the sheet.

- **`MK-ZC-ST-01` Unit zones along +Y (m, `ZC-WORLD`):** corridor y [−1.8, 0]; door wall [0, 0.18] (0.18 decided (VB R3.1); Boss aligns `zc-corridor`); entry [0.18, 1.50]; partition [1.50, 1.60]; bathroom [1.60, 3.30]; partition [3.30, 3.40]; kitchenette [3.40, 5.70]; living [5.70, 9.20] (open to the kitchenette); balcony glazing at y 9.20; balcony [9.20, 10.70]; railing at y 10.70, height 1.10. Interior x ∈ [−1.6, 1.6], back wall face x = −1.6, cut plane x = +1.78. Actor walking path x ≈ +0.3 to +0.6.
- **`MK-ZC-ST-02` Partition doorways** run from x 0.30 to the cut plane x +1.78 with the lintel at z 2.05, so walking actors are never sliced by a partition cap in section and the B10 camera sees the door through the bathroom doorway.
- **`MK-ZC-ST-03` Fixtures:** cabinet parked x [−0.4, 0.4], y [1.05, 1.45] → barricade y [0.18, 0.58] from B02-SH02 clip 84 on. Basin centre (−1.35, 1.95), counter z 0.85. Toilet bowl centre (−1.05, 2.40), rim z 0.40; cistern against the back wall, lid top z 0.80. Shower y [2.70, 3.30], tap (−1.55, 3.00, 1.00), frosted louvre window on the back wall z 1.9–2.4. Fridge against the bath/kitchen partition x [−1.60, −1.00], y [3.40, 4.05], door face y 4.05 facing +Y, hinge on the x −1.60 edge, handle (−1.05, 4.08, 1.00). Counter on the back wall x [−1.60, −1.00], y [4.15, 5.60], top z 0.90; shelf z 1.45; stove case (−1.35, 4.85, 1.51). Living side table x [−1.40, −0.90], y [7.00, 7.50], z 0.75.
- **`MK-ZC-ST-04` `CAM-SECTION` realisation:** camera x = +17.0, z = 1.70, looking −X, no tilt/roll; lens shift_y ≈ −0.32 at 6.4 m coverage (Boss solves the exact value so the unit floor at the character plane lands at y 860 ± 10 px). Coverage per shot 6.0–6.6 m (px/m at x = 0 = 1920 / coverage). Floor contact at depth x projects higher on screen; counted floor props sit at x ≤ −0.8 (contact y ≈ 836 or above, estimated).
- **`MK-ZC-ST-05` Lead size in section:** standing ≥ 505 px at ≤ 6.6 m coverage. Seated poses are allowed (user, 29 Oct 2026: “ท่า blender ทำท่านั่งแล้วไม่แปลกให้นั่งได้”) but measure ≈300–430 px at the brief's 5.8–6.8 m, so seated shots use [`CAM-SECTION-LL`](visual-brief.md#cam-section-ll) (recorded exception, brief R3.1): same camera x = +17.0, z = 1.70, −X view, no tilt/roll, Y-only moves, narrower vFOV, floor still at y ≈860 via lens shift. Coverage per seated shot: B07-SH02 sofa 4.6 m (vFOV ≈15.5°), B09-SH01/SH03 floor 3.4 m (vFOV ≈11.4°); lead measured 552 px (B07-SH02, 4.6 m) / 502–506 px (B09-SH01/SH03, 3.4 m; user accepted 29 Oct 2026) (`DF-20261029-zcondo-sp02-section-spike`). Tighten to 3.2 m only if the rigged pose measures under 480 px; SH01 camera y then ≤0.76 before push crop. Cap/door-wall screen arithmetic uses the cut-plane magnification ×1.117 (brief R3.2). **Condition:** Boss checks the seated pose reads natural (no float or interpenetration, believable weight); if it looks odd, that shot falls back to the SS-R1 standing staging recorded in its sheet's change log.
- **`MK-ZC-ST-06` Plate clock:** clip frame c = shot-local f + trim(language); `trimStartSec` = trim / 30; Blender frame = c + 1. Each sheet lists per-plate trims and event clip frames; one plate serves both languages.
- **`MK-ZC-ST-07` Trash bag continuity (SS-R2.3):** one prop, never duplicated. Right hand, z ≈0.45, B01-SH01 (to its last frame). Released at B02-SH01 f 0 (palm opens on the leaf), ground contact f 6, settled by f 14 at **(−0.75, 0.38, 0)** (SS-R2.4: was y 0.40; slumped footprint ≈0.40 × 0.28 m, so y ≈0.24–0.52, estimate; clear of the cabinet's x[−0.4, 0.4] path and ≈0.06 m **edge to edge** from the phone box (near edge y 0.58) in B09, [scale guide §2](../../../docs/scale-and-perspective-principles.md#2-ตั้งขนาดอ้างอิงก่อนจัดกล้อง); SS-R2.3's 0.041 m failed the 0.05 m rule). It does not move after f 14. Section shots: visible in B02-SH02 until the cabinet passes in front of it (clip ≈55–84), then hidden behind the cabinet (y [0.18, 0.58]) in B02-SH03 (out of frame), B03, B04-SH01 and B09 (cabinet `SCALE-ZC-R2` **1.20 m** vs bag ≈0.45 m; sight line clears by ≈0.65 m, estimate). **B10-SH01: out of frame** behind partition `p1` (hinge side, hidden from any bathroom camera; 0 of 515 vertices visible, Film's R3.3 measurement); not shown, not moved. Not in B01-SH02, B04-SH02–B08 (no entry in frame). Boss builds one `zc-bag` in `S-07` with the rest pose as a static mesh; the drop is B02-SH01 only. **Boss notes (`S-07`):** the `SP02` blockout cabinet is 1.75 m and must be aligned to the `SCALE-ZC-R2` 1.20 m (it covers the B10 plain band and hides the door centre); move the blockout bag to y 0.38 and re-check hiding and the phone gap. Boss builds one `zc-bag` in `S-07` with the rest pose as a static mesh; the drop is B02-SH01 only.

## Shared elements and dependencies

| ID | Need (brief) | Owner | Consumers | Status (`e44adb4`) |
| --- | --- | --- | --- | --- |
| SP01 | corridor plate spike | Boss | B01 | blockout pass (`DF-20261028-zcondo-sp01-corridor-plate`); open look note (silhouette contrast) |
| SP02 | section cutaway spike | Boss | B02–B09 section shots | pending; required before section plates |
| S-02…S-07 | sets, rigs, props | Boss | all | missing (`zc-corridor` blockout exists; S-07 `zc-bag` exists only as an `SP02` primitive blockout, static rest pose, no drop) |
| S-08 | screen-space overlays (diagram, cross/icons, order device, counters, labels) | Boss | B04–B06, B09–B10 | missing; PNG fallback without `pictureMove` |
| S-09 | captions: EN Latin font/lang; width inside x 120–888 | Boss | EN (a), both (b) | missing |
| S-10 | plate renders with handles per sheet trims | Boss | Editor | missing (B01-SH01 blockout only) |
| S-11 | drone + SFX + NOTICE; all `NEEDS-GEN` cues in the sheets | Editor | both | missing |

Findings consumed: `DF-20261028-zcondo-eevee-render-spike`, `DF-20261028-zcondo-sp01-corridor-plate`, `DF-20261028-zcondo-eevee-worstcase` (revalidated 29 Oct 2026 by reading `docs/dev-findings.md` and `assets/blender/zc-corridor/manifest.md` on `e44adb4`; they apply: Eevee 64 default, baked probes for interiors, authored fire rim), `DF-20261026-studio-emfile` (CLI evidence).

<a id="element-captures"></a>
## Element captures

Shared by both deliverables (stored once under the TH folder, local only, Git-ignored). Illustrative only; placeholders, not production look or final framing.

| File | Asset / view | Source | Limitations |
| --- | --- | --- | --- |
| `out/handoffs/zombie-condo/ZCONDO-SHORT-TH/elements/E01-B01-SH01-sp01-blockout-F0-F36-F104.png` | `zc-corridor` + placeholder `zc-you`/`zc-infected`, B01-SH01 camera, shot F0/F36/F104 with TH caption at `middle` | copy of `out/qa/zombie-condo/sp01/contact-TEST-F0-F36-F104.png` (Boss SP01, `assets/blender/zc-corridor/` @ `707bb32`) | primitive figures; infected reads grey, not hard silhouette |
| `…/E02-zc-infected-placeholder-close-F100.png` | placeholder infected, long-lens close, Eevee vs Cycles | `out/blender/zc-render-spike/worst/compare-charclose-F100.png` (`worstcase.py` @ `707bb32`) | cost test, facing camera, not the SH02 turn |
| `…/E03-B08-balcony-blockout-F104.png` | B08-like balcony/city blockout, Eevee tiles vs Cycles | `out/blender/zc-render-spike/worst/compare-b08-F104.png` | not the sheet's camera: figure sits at the frame edge, which the B08 sheet corrects |
Missing: unit section, bathroom, kitchen, props, day-3 character (Boss).

## Blockout brief (Editor)

Per deliverable, assemble all 23 shots at the listed ranges with placeholders (SP01 plate for B01-SH01; labelled solid cards with shot ID and frame counter elsewhere), captions `position: 'middle'`, chrome hidden, temporary TTS line clips. Review with Film/Mark before polish: F36 figure, B02 slam/bolt, B02-SH03 pulse cut, B03 cascade, B04 insert cuts vs words, B05 reveal, B06 hold, B07 stop, B08 cluster entry, B09 knock/silence/cut, B10 glance; compare neighbouring cuts in both languages. Review revision: none yet.

## Open items and questions

| ID | Item | Owner | Status |
| --- | --- | --- | --- |
| B06 labels | TH/EN cold-clock label wording | Preaw + Boat | open (from brief); layout fixed |
| B02 trash bag | User review of the `SP02` B02-SH02 still (29 Oct 2026, “มือควรปล่อยถุงขยะได้แล้วมั้ง ไม่งั้นจะลากตู้ยังไง”). **Decided in SS-R2.3 (`MK-ZC-ST-07`):** he holds the bag through B01 and drops it at the B02-SH01 slam (f 0); it rests at (−0.75, 0.40, 0) for B02–B10, hidden behind the cabinet in section shots from the cabinet's arrival. Boss re-poses the B02-SH02 still (hands free, bag on the floor) | Mark → Boss | **closed** 29 Oct 2026 (Mark); Boss re-pose done 29 Oct 2026 (`SP02` blockout `zc-bag`, hands free; hidden in B03/B09 as designed; B10-SH01 bag visibility was unjudgeable until its camera was reconciled: closed in SS-R2.4, out of frame, [finding](../../../docs/dev-findings.md#df-20261029-zcondo-sp02-section-spike) addendum; the 0.041 m phone gap closed in SS-R2.4 by moving the bag to y 0.38, ≈0.06 m) |
| Q-R3-1 | Real music in B02 instead of the non-musical pulse | User | **closed** 29 Oct 2026: keep the pulse, music from B03 (“ข้อ 1. เห็นด้วย”) |
| SP02 | Section cutaway spike | Boss | pending |
| RK-10 | YouTube graphic-content policy for B01–B02 blood | Coordinator/Boat | unverified |
| MK-Q1 | Seated vs standing in B07-SH02 and B09 | User | **closed** 29 Oct 2026: seated allowed if the Blender pose is not odd (“ท่า blender ทำท่านั่งแล้วไม่แปลกให้นั่งได้”); SS-R2 seated with long-lens coverage; Boss naturalness check, fallback SS-R1 standing |
| MK-Q2 | B02-SH01 latch-side camera (screen direction) | Film | accepted by Film (brief R3.1, `VD-ZC-02`); **closed**. **Exception (brief R3.3, SS-R2.4): B10-SH01 only** puts the door screen-right of him (he is left of centre); every other shot keeps the door screen-left |
| MK-Q3 | B01 door leaf out of frame; open carried by sound/step (SP01 note) | Film | accepted by Film (brief R3.1, `VD-ZC-01`); **closed** |
| MK-Q4 | Door-wall thickness 0.18 (brief) vs 0.20 (blockout) | Film → Boss | 0.18 m decided (brief R3.1); Boss aligns `zc-corridor`; **closed** |
| MK-Q5 | Long-lens `CAM-SECTION` coverage 3.4 m (B09-SH01/SH03) and 4.6 m (B07-SH02), outside `PROJ-ZC-R3`'s 5.8–6.8 m / vFOV 20–24° | Film | recorded as `CAM-SECTION-LL` (brief R3.1); **closed** |
| B01 look (SP01 note) | Infected reads grey, not a hard silhouette with rim | Film → Boss | target set 29 Oct 2026 in `VD-ZC-01` (R3.1): at F36 figure mean luminance ≤ about ¼ of the window pane's, rim on head/shoulders, by lighting; Boss verifies at S-02 |
| EN B05-SH03 bowl part | SS-R1 move to composition [1059, 1083) | Film | accepted 29 Oct 2026 (routine word-share refinement); brief timing rows updated |

## Change log
- 2026-10-29 `ZCONDO-SHORT-SS-R1` (Mark): first scene sheets (four files), shared constants `MK-ZC-ST-01`–`06`, shot → frame map, element captures, blockout brief. Previous index (28 Oct 2026) listed no sheets.
- 2026-10-29 `ZCONDO-SHORT-SS-R2` (Mark): user answers (29 Oct 2026, relayed by the coordinator) close Q-R3-1 and MK-Q1; B07-SH02 and B09 seated with long-lens coverage; `MK-ZC-ST-05` rewritten (was: "every section pose is standing"); `MK-Q5` added; review page marked stale for those shots.
- 2026-10-29 `VB-ZCONDO-SHORT-R3.1` (Film): verdicts on `MK-Q2`–`MK-Q5`, the B01 look note and the EN B05-SH03 bowl move recorded in the open-items table; sheets unchanged (Mark's follow-ups listed in the [brief](visual-brief.md#mark-handoff-r31)).
- 2026-10-29 `ZCONDO-SHORT-SS-R2.1` (Mark): applied Film's brief `VB-ZCONDO-SHORT-R3.1` verdicts; MK-Q2–Q5 closed; `MK-ZC-ST-01` door wall 0.18 decided; `MK-ZC-ST-05` points to `CAM-SECTION-LL`; no shot value changed.
- 2026-10-29 `VB-ZCONDO-SHORT-R3.2` (Film): adopted `SP02` (`DF-20261029-zcondo-sp02-section-spike`); user accepted the B09 seated lead at 502–506 px (3.4 m; 3.2 m only if the rigged pose measures <480 px); B09-SH01 camera y 0.90 → 0.78 with counters x 180–375; B07-SH02 TH trim 15 → 9; phone stays at (−0.80, 0.62) on his right. Sheets not edited; Mark's values in the [brief](visual-brief.md#mark-handoff-r32).
- 2026-10-29 `ZCONDO-SHORT-SS-R2.2` (Mark): applied brief `VB-ZCONDO-SHORT-R3.2` (SP02, `DF-20261029-zcondo-sp02-section-spike`): measured seated leads in `MK-ZC-ST-05`; B09-SH01 camera y 0.78 with ≥30 px sliver; B07-SH02 TH trim 9; B09 phone wording; B09-SH03 measured screen values. User “Accept + commit” (29 Oct 2026) accepts B09 seated at 502–506 px.
- 2026-10-29 `ZCONDO-SHORT-SS-R2.3` (Mark): closed the B02 trash-bag open item (user review of the SP02 B02-SH02 still): `MK-ZC-ST-07` added; B01-SH01 bag stays in hand, B02-SH01 release at f 0 with a soft-thump cue `NEEDS-GEN`, B02-SH02 bag row and acceptance, B03/B04-SH01/B09-SH01/B10-SH01 continuity lines; review page stale for the changed shots. No timing, frame, camera or shot-count change.
- 2026-10-29 `VB-ZCONDO-SHORT-R3.3` (Film): B10-SH01 camera reconciled after the `SP02` addendum (SS-R2.3 camera mirrored in `ZC-WORLD`, face in the caption zone): camera (1.300, 3.250, 1.580) → (0.25, 0.18, 1.58), vFOV 55°, shift_y −0.211, him at (0.80, 0.92) left of centre with the door face right, labels x 460–880, y 295–470; `MK-ZC-ST-07` bag out of frame in B10; cabinet 1.20 m held; B09 bag–phone gap measured edge to edge (0.041 m fails 0.05 m). Sheets not edited; Mark's values in the [brief](visual-brief.md#mark-handoff-r33).
- 2026-10-29 `ZCONDO-SHORT-SS-R2.4` (Mark): applied brief `VB-ZCONDO-SHORT-R3.3`: B10-SH01 camera (1.300, 3.250, 1.580) → (0.25, 0.18, 1.58), vFOV 55°, shift_y −0.211, baked dolly end (1.287, 3.212, 1.580), him at (0.80, 0.92) facing (0.0, 0.35), labels x 460–880, y 295–470, face box x 220–420, y 420–650, screen side mirrored (MK-Q2 exception recorded, fallback added); bag out of frame in B10; `MK-ZC-ST-07` rest y 0.40 → 0.38 (B09 bag–phone gap ≈0.06 m edge to edge) in all sheets; hidden-bag reasoning uses cabinet 1.20 m, Boss note to align the blockout in `S-07`. Review page marked stale for B10-SH01 and the shots with a changed bag position. No timing, frame range, shot-count, narration or ID change.
