# BLOOP-EP01-SHORT — storyboard index

Deliverable `BLOOP-EP01-SHORT`, Full tier. Handoff revision **`BLOOP-SHEETS-R4`** (Mark, 2026-10-30). Status: **ready-for-dev** (blockout; timing estimated). Evidence: runtime none · renders/samples none · audio/subtitle sync none (no TTS, `O-1`) · user approval none.
Inputs: script [short/script.md](../../../scripts/the-bloop/short/script.md) `BLOOP-SCRIPT-R5` (user-approved 2026-10-30) · fact-check [short/fact-check.md](../../../scripts/the-bloop/short/fact-check.md) `BLOOP-FACTCHECK-R6` (`ready-for-storyboard`) · brief [visual-brief.md](visual-brief.md) `BLOOP-BRIEF-R3` (`ready-for-mark`) · delivery record [scripts/the-bloop/delivery.md](../../../scripts/the-bloop/delivery.md).
Target: `claude/bloop-p5-svg-viz-c10597` @ `cab9833` · 30 fps · 1080×1920 · durationFrames **1782 (estimated)** · composition offset 0.

| Document | Revision | Status |
| --- | --- | --- |
| [visual-brief.md](visual-brief.md) | `BLOOP-BRIEF-R3` (Film, 2026-10-30) | ready-for-mark; looks L-A1, L-B2 (CRD-2), L-CP3; blockout pass 1 review FR01–FR11 |
| [sc01-b01-b03.md](sc01-b01-b03.md) | `BLOOP-SHEETS-R4` | ready-for-dev · SH01–SH04 |
| [sc01-b04-b06.md](sc01-b04-b06.md) | `BLOOP-SHEETS-R4` | ready-for-dev · SH05–SH08 |
| [sc01-b07-b08.md](sc01-b07-b08.md) | `BLOOP-SHEETS-R4` | ready-for-dev · SH09–SH12 |
| [sc01-b09-b10.md](sc01-b09-b10.md) | `BLOOP-SHEETS-R4` | ready-for-dev · SH13 |

**Readiness scope.** `ready-for-dev` permits Boss's plate scaffolding and Editor's blockout with placeholder art. It does not cover finished art. Look picks (user, 2026-10-30): **L-A1** (deep water, also `SET-COLD` and the diagram washes) and **L-B2 / CRD-2** (`CR-DREAM`); Film's look frames own their detail. **L-CP3** (`CR-REAL`, all painted, user 2026-10-30). The sheets fix bounds, anchors, paths and timing only, so every shot holds for any look the user picks. A look pick that moves an anchor beyond its stated tolerance, or that changes a medium, comes back to Mark (and Film, under brief "On revision").

## Scene order and sheets

One story scene, `BLOOP-EP01-SHORT-S01` (the script's single scene), split into four sheets by beat. Shot IDs are `BLOOP-EP01-SHORT-S01-SHnn` (short form `SHnn`); key states are `SHnn-Knn`. There are no legacy `BOARD`/`Pxx` IDs for this deliverable.

| Sheet | Beats | Scene-local range [start, endEx) | Shots |
| --- | --- | --- | --- |
| [sc01-b01-b03](sc01-b01-b03.md) | `B01`–`B03` | [0, 573) | SH01 [0,216) · SH02 [216,372) · SH03 [372,468) · SH04 [468,573) |
| [sc01-b04-b06](sc01-b04-b06.md) | `B04`–`B06` | [573, 1053) | SH05 [573,738) · SH06 [738,801) · SH07 [801,903) · SH08 [903,1053) |
| [sc01-b07-b08](sc01-b07-b08.md) | `B07`–`B08` | [1053, 1467) | SH09 [1053,1127) · SH10 [1127,1173) · SH11 [1173,1271) · SH12 [1271,1467) |
| [sc01-b09-b10](sc01-b09-b10.md) | `B09`–`B10` | [1467, 1782) | SH13 [1467,1782) |

Shots per beat: `B01` 1 (SH01, which also carries the first `B02` phrase) · `B02` 1 · `B03` 2 · `B04` 2 · `B05` 1 · `B06` 1 · `B07` 3 (SH11 runs into `B08` until the second phrase) · `B08` 1 · `B09`+`B10` 1 (one continuous camera view, no cut: the brief's "the `B09` frame is `B10`'s start frame"). 13 shots in all.

Clocks: one scene from frame 0, so scene-local = composition-global. Shot-local `tl` = frame − shot start. Sheets write `G<frame>` for composition frames and `L<frame>` for shot-local frames. Ranges are half-open.

## Phrase anchors (timing, estimated)

**Every event frame in the sheets is tied to one of these anchors.** They come from the script's syllable estimate (≈5.5 syll/s, 5.45 frames per syllable, written pauses), not from a read. When Niwat's read exists (`O-1`), Editor replaces each onset with the measured one and shifts every event by the same delta as its anchor; offsets inside a phrase scale with the phrase length. If a beat moves by more than ±10 frames or the total leaves 1,740–1,800 frames, return to Mark.

| Anchor | Thai phrase (VO, verbatim) | Onset G | End G |
| --- | --- | --- | --- |
| `B01-a1` | เสียงนี้… | 9 | 20 |
| `B01-a2` | ไมค์ใต้ทะเลจับได้ปี 1997 | 30 | 106 |
| `B01-a3` | มันดังมาก | 108 | 124 |
| `B01-a4` | จนนักวิจัยไม่เคยได้ยินอะไรแบบนี้ | 124 | 190 |
| `B02-a1` | ไมค์พวกนี้ | 198 | 214 |
| `B02-a2` | โนอาหย่อนไว้ลึกใต้แปซิฟิก | 216 | 265 |
| `B02-a3` | เพื่อฟังแผ่นดินไหวใต้ทะเล ("แผ่นดินไหว" ≈ G278) | 267 | 311 |
| `B02-a4` | แต่ปีนั้น | 313 | 329 |
| `B02-a5` | มันได้ยินเสียงนี้ซ้ำหลายครั้ง ("ซ้ำ" ≈ G352) | 330 | 370 |
| `B03-a1` | เสียงบลูปของจริงต่ำมาก | 374 | 407 |
| `B03-a2` | ที่ได้ยินนี่ถูกเร่ง 16 เท่า… | 407 | 456 |
| `B03-a3` | เสียงจริงไต่สูงขึ้นอย่างรวดเร็ว | 468 | 512 |
| `B03-a4` | ตลอดราวหนึ่งนาที | 514 | 546 |
| `B03-a5` | ฟังคล้ายเสียงสัตว์ร้อง | 547 | 572 |
| `B04-a1` | มันดังจนไมค์หลายตัวได้ยิน | 575 | 617 |
| `B04-a2` | จากไกลกว่าห้าพันกิโลเมตร | 619 | 663 |
| `B04-a3` | นักวิทยาศาสตร์บางคนก็สงสัยว่าเป็นสัตว์ | 665 | 736 |
| `B04-a4` | ส่วนชาวเน็ต… | 738 | 754 |
| `B04-a5` | จินตนาการไปถึงสัตว์ยักษ์ | 766 | 800 |
| `B05-a1` | แต่ | 801 | 807 |
| `B05-a2` | ทิศของเสียง | 808 | 824 |
| `B05-a3` | ชี้ไกลลงไปทางใต้… | 828 | 861 |
| `B05-a4` | ทางขั้วโลกใต้ | 876 | 898 |
| `B06-a1` | เพราะทะเลลึกมี | 905 | 927 |
| `B06-a2` | "ช่องเสียง" | 927 | 938 |
| `B06-a3` | ที่พาเสียงต่ำไปได้ไกลมาก | 940 | 984 |
| `B06-a4` | ไมค์พวกนี้ถูกหย่อนไว้ในช่องนั้นพอดี | 988 | 1048 |
| `B07-a1` | หลายปีต่อมา | 1055 | 1077 |
| `B07-a2` | ไมค์ใกล้แอนตาร์กติกา… | 1079 | 1112 |
| `B07-a3` | เจอเสียงที่ลายคลื่นคล้ายกันมาก | 1127 | 1171 |
| `B07-a4` | จากภูเขาน้ำแข็งยักษ์ที่กำลัง | 1173 | 1222 |
| `B07-a5` | แตกร้าว | 1222 | 1233 |
| `B08-a1` | ราวปี 2012 | 1238 | 1271 |
| `B08-a2` | โนอาประกาศว่า | 1271 | 1298 |
| `B08-a3` | บลูปสอดคล้องกับเสียง | 1298 | 1325 |
| `B08-a4` | "แผ่นดินไหวน้ำแข็ง" | 1325 | 1352 |
| `B08-a5` | ไมค์ที่ฟังแผ่นดินไหว | 1356 | 1389 |
| `B08-a6` | ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ… | 1389 | 1444 |
| `B08-a7` | ของน้ำแข็ง | 1452 | 1467 |
| `B09-a1` | สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ | 1469 | 1529 |
| `B09-a2` | เสียงที่ไต่สูงเหมือนสัตว์ร้อง | 1531 | 1569 |
| `B09-a3` | สอดคล้องกับเสียงน้ำแข็งแตกร้าว… | 1569 | 1609 |
| `B10-a1` | คุณคิดว่ามันคืออะไรกันแน่? | 1629 | 1678 |

Non-VO anchors: `B09` pause [1609,1629) (0.67 s); `B10` silence [1678,1692) (0.47 s), rise [1692,1716) (0.8 s), rush [1716,1758) (1.4 s), fade [1758,1779) to the first full-black frame G1779; G1779–1781 black. If the read runs long, the script's trim order applies (step 2 shortens the tease to rise 21 / rush 36 / fade 18 frames, never less).

## Shared constants (all S01 sheets)

Film owns the baseline ([Scale baseline](visual-brief.md#scale-baseline), [Projection contract](visual-brief.md#projection-contract)). The sheets add only these named spaces. All positions are **plate world px at camera s = 1** (origin top-left, x right, y down, 1080×1920); `Camera {s, fx, fy, dx, dy}` maps world → screen by `screen = (p − f)·s + f + d` (`src/painted/camera.tsx` `toScreen`, line 23). Depth in every plate is a fixed plane with a layer order (brief: canvas → in-camera SVG → screen-space text); no plate has XYZ depth.

- **CAP-ZONE** (brief): y 840–1260 reserved for captions; caption-safe width x 120–888. Fact-label slot 1: x 120, y 300–350; slot 2 (DEP03): y 360–410.
- **`DEEP` space** (`SET-DEEP`, `SET-COLD`, `SET-DREAM` share it): `PROP-HYD` world anchors fixed for the whole video: `hyd.center` (540, 560), `hyd.top` (540, 430), `hyd.base` (540, 690); body 70 × 260 (brief); cable from `hyd.top` straight up off-frame. The hydrophone never moves in world; shots differ by camera only.
- **`MAP` space**: `mapXY(lonE, lat) = ((lonE − 145) × 9.4, 300 + (36 − lat) × 9.4)` (9.4 px/°, brief scale; plate carrée). Equator y 638. **`MAP-WIN`**: the map's land, dots, lines and arrow are clipped to the **screen-space** window y 280–840, feathered over 60 px at the bottom (780–840) and top (280–340); the painted ocean wash fills the whole frame. This keeps the caption zone plain and keeps Antarctica hidden until a pan brings it into the window. Equatorial dots (schematic, no east/west meaning, all within ±5° of the equator): D1 (330, 640), D2 (420, 690), D3 (500, 650), D4 (590, 700), D5 (680, 645), D6 (760, 685); D1–D6 = 430 px ≈ 45.7° ≈ 5,090 km at the equator. Hidden wavefront centre `WF0`: a point far south of the frame, used only to curve the fronts (radius ≥ 2,400 px at its first visible frame), never drawn.
- **`SECTION` space** (brief): world = screen at s = 1; x south (left) → north (right), unitless; surface y 300; channel band y 640–760 (centre 700); seafloor y 1500. Hydrophone glyph `glyph.center` (760, 700) when in the band.
- **`PANEL` space** (brief): a dark wash panel; line points in panel-local (0..1 time, 0..1 pitch), unlabelled. `PAT-BLOOP` polyline (Catmull-Rom through): (0, 0.08) (0.30, 0.12) (0.45, 0.30) (0.60, 0.62) (0.75, 0.85) (1.0, 0.92). `PAT-ICE` (similar, not identical): (0, 0.10) (0.28, 0.15) (0.46, 0.36) (0.62, 0.66) (0.78, 0.83) (1.0, 0.88).

**Pre-handoff projection check.** `scripts/shot-projection.py` is a pinhole tool and does not apply: painted plates have no metre projection (the validator rejects `projection` on painted scenes; brief Scale baseline). The equivalent 2D check pushed each shot's anchors through `toScreen` at its start and end camera (one-off scratch script; results are recorded in each shot block as "computed"). No shot has a character lead. `PROP-HYD` stays ≥ 240 px tall whenever it is the hero (brief), the creature leads stay ≥ 480 px, and no lead, face, reveal or `cr.mouthCenter` falls inside CAP-ZONE at its key frame. **Props and hands:** no character handles a prop. `PROP-HYD` hangs from its cable at the fixed world anchor in every water plate, and its SVG glyph only appears in diagrams. Each shot's entry → exit lines state its prop states.

## Assets and dependencies

The asset rows and DEP01–DEP07 are Film's ([runtime inventory](visual-brief.md#runtime-inventory-inspected-at-cab9833-2026-10-30), [Boss dependencies](visual-brief.md#boss-dependencies-order-and-interfaces-design-only)); Mark confirms them and adds M01–M04. Runtime status was inspected by Film at `cab9833`; Mark re-read `src/painted/camera.tsx` and the cue fields in `src/scenes/painted.ts` (`shot`, `atSec`, `fromSec`, `dissolveSec`, `label`) at the same commit.

| ID | Owner | Requirement / acceptance | Consumers | Status |
| --- | --- | --- | --- | --- |
| DEP01 | Boss | BLOOP plate module, **one painted shot key per Mark shot** (proposed `bloop-sh01` … `bloop-sh13`, sharing set helpers); each plate's camera is a pure function of `tl` as written in its shot block | all | missing (confirmed) |
| DEP02 | Boss | `PROP-HYD` (one outline), `FX-RING`, `FX-CRACK`, `mapXY` + Natural Earth path + NOTICE, `PATTERN`, `SECTION` | all | missing (confirmed) |
| DEP03 | Boss | Two concurrent fact labels (slot 2 at y 360–410) | SH11 [1222,1240) | missing (confirmed); fallback written in SH11 |
| DEP04 | Boss | Ending without the 3 s freeze; the black authored in the SH13 plate | SH13 | missing (confirmed) |
| DEP05 | Boss/Editor | 30 fps RMS envelope of the processed `bloop.wav` | SH01, SH03 | missing (confirmed); fallback hand-keyed rings in SH01 |
| DEP06 | Film | Look stills L-A/L-B/L-C | done 2026-10-30 (picks L-A1, L-B2, L-CP3); look frames per brief VD16 |
| DEP07 | Boss | `B10` screen-space black fade in the SH13 plate's `Overlay` (above Grade/Grain, below label and caption), opacity 0 → 1 over G1758–G1779 | SH13 | missing (brief R2) |
| **M01** | Boss | `MAP-WIN` screen-space clip with feathered edges (above), applied to land, dots, wavefronts, arrow and tags; wash unclipped. The camera now travels to (dx −1020, dy −560) in SH09, so the painted ocean wash must cover plate world x 0–2100, y 0–2480, and the baked Natural Earth path must cover lon 145° E → 340° E (to the Scotia Sea and South Georgia) | SH02, SH05, SH07, SH09 | new, design; extent revised R2 |
| **M02** | Boss | Map wavefront generator: arcs about a hidden centre (`WF0`), front position as a function of `tl`; dots light amber for 10 frames when a front crosses them. South-arriving fronts confirmed by the user (MK-O1) | SH02, SH05 | new, design (part of DEP02 `FX-RING`) |
| ~~M03~~ | — | Dropped in R3: `PROP-HYD` is painted after `CR-REAL` in the same canvas (brief VD11 R2) | — | closed |
| **M04** | Boss | Cold variant of `SET-DEEP` for SH11 (`SET-COLD`: same bands, cyan-shifted, value 10–30 %); `CR-DREAM` faded state and morph to `ICE` per SP02 | SH11 | brief names `SET-COLD`; not yet in the asset table |
| Editor | Editor | Niwat read and re-time by anchor (`O-1`); `bloop.wav` copy with NOTICE (`AUD-1`); `captionStyle.position: 'middle'`; measure the audible windows of the crack, tick and clip, which set the label windows | all | not started |
| Sound gaps | Editor | `NEEDS-GEN` cues, specified in the first shot that uses each: `water_deep-ocean-roomtone_01` (SH01), `quake_seafloor-rumble-muffled_01`, `pulse_underwater-soft-thump_01` (SH02), `hum_low-travelling-flat_01` (SH08), `ice_iceberg-crack-groan-underwater_01` (SH11), `creature_deep-swallow-gulp_01` (SH13). Library IDs used are present in `sound-library/INDEX.md` (checked 2026-10-30) | — | gaps confirmed (0 matches in INDEX) |

**Findings revalidated (2026-10-30, against brief Dev findings):** DF-20261029-painted-timeline-dissolve → dissolves in SH02 and SH06 use `dissolveSec`, ghost/creature fades by colour mix (SH07, SH11); DF-20261030-p5brush-large-fill-mottle → `SET-*` flat underlayers (all water plates); DF-20261030-painted-screen-layers-overlay → plate-owned Grain/Grade (all); DF-20261030-painted-straight-bars → map/section lines stay SVG (SH02, SH05, SH07–SH10, SH12); DF-20261030-render-run-noise → dissolve and morph acceptance by PSNR (SH02, SH06, SH11). Added: **DF-20261030-painted-glaze-pickup** applies to SH11, where `ICE` is painted over the area the creature occupied; the ice base needs opaque, texture-0 passes or the creature's ink will show through (SH11 acceptance).

## Planned runtime mapping (Editor confirms and updates)

Painted cues split wherever the fact label changes; a split keeps the same plate and sets `fromSec` to the elapsed plate time. The runtime scene split (for example one scene per beat for VO and captions) is Editor's choice.

| Shot | Plate key | Cues [G start, G endEx) → label |
| --- | --- | --- |
| SH01 | `bloop-sh01` | [0,186) เสียงจริง เร่ง 16 เท่า · [186,216) none |
| SH02 | `bloop-sh02` | [216,372) none, `dissolveSec` 0.6 |
| SH03 | `bloop-sh03` | [372,404) none · [404,460) เสียงจริง เร่ง 16 เท่า · [460,468) none |
| SH04 | `bloop-sh04` | [468,573) ภาพประกอบ |
| SH05 | `bloop-sh05` | [573,738) none |
| SH06 | `bloop-sh06` | [738,764) none, `dissolveSec` 0.6 · [764,801) จินตนาการ |
| SH07 | `bloop-sh07` | [801,903) จินตนาการ |
| SH08 | `bloop-sh08` | [903,1053) none |
| SH09 | `bloop-sh09` | [1053,1127) none |
| SH10 | `bloop-sh10` | [1127,1173) ภาพประกอบ |
| SH11 | `bloop-sh11` | [1173,1222) จินตนาการ · [1222,1240) จินตนาการ + เสียงจำลอง (DEP03) · [1240,1271) เสียงจำลอง |
| SH12 | `bloop-sh12` | [1271,1300) เสียงจำลอง · [1300,1450) none · [1450,1467) เสียงจำลอง |
| SH13 | `bloop-sh13` | [1467,1690) none · [1690,1779) จินตนาการ · [1779,1782) none (black) |

## Blockout brief

Editor assembles all 13 shots at the anchor timings with placeholder art (flat washes, plain SVG shapes at the stated bounds, a grey box for each creature at its bounds and anchors, sound IDs or silence where a gap is open). Film and Mark review the continuous blockout before polish for action, framing, scale, timing, information order and cuts, especially the brief's proof beats: SH03 ring spacing, SH07 map over ghost, SH11 creature → iceberg, SH13 rise and rush. Blockout status: not started.

## Element captures

None available. Every BLOOP element (`PROP-HYD`, `CR-DREAM`, `CR-REAL`, `ICE`, map, section, panel, sets) is `missing` at `cab9833`, and no preview exists to capture. Look stills come from DEP06 after the user's look pick.

## Open items

| ID | Owner | Item | Status |
| --- | --- | --- | --- |
| MK-O1 | User | SH02/SH05 wavefront direction | **closed 2026-10-30**: user keeps the fronts arriving from the south ("fair plant for B05"); sheets unchanged |
| MK-O2 | User | SH09 Antarctic dot placement | **closed 2026-10-30**: user chose a south-east pan to the Scotia Sea / Atlantic sector with dots at the real array regions (`SRC014`); SH09 revised in R2. Optional Boat check of the approximate region centres against `SRC014` Fig. 1 (non-blocking) |
| MK-O3 | Film | SH10 has no text tags on the two pattern lines; they are told apart by colour (amber = the `B03` line returning, cyan = ice) to avoid adding unscripted on-screen text. | open (non-blocking) |
| MK-O4 | — | Dropped in R3 (the depth seam is resolved by draw order) | closed |
| MK-O5 | Editor | `bloop.wav` length | **closed 2026-10-30**: 10.342 s (Boss DEP05); SH01 needs 6.2 s |
| O-1 | Editor | Niwat read; re-time by anchor | open |
| MK-O6 | Film | SH06 camera: FR03's s 1.04 about (380, 760) puts the head top at y 336, inside label slot 1. R4 uses s 1.02 about (380, 440). Accept, or let the head outline pass behind the slot | open |
| MK-O7 | Film | FR10 says the hydrophone leaves the frame left during the rush. At s 3 (R3 rush) it stays at x −85…125, y 320…1100 (`toScreen`), in front of the mouth until the black fade. Confirm that this is the intended read, or change the rush | open |
| VD16 | User/Film | Look pick: L-A1, L-B2 (CRD-2), L-CP3 picked 2026-10-30 | closed |

No user storyboard review page exists yet for `BLOOP-SHEETS-R4`; the coordinator publishes it.

## Change log

- 2026-10-30 `BLOOP-SHEETS-R1` (Mark): first scene handoff from `BLOOP-SCRIPT-R5` / `BLOOP-FACTCHECK-R6` / `BLOOP-BRIEF-R1`. Sheet split changed from the brief's suggestion (`sc01-b07-b09`, `sc01-b10`) to `sc01-b07-b08` and `sc01-b09-b10`, because `B09`→`B10` is one continuous camera view (SH13). The brief's starting `B02` map crop (lat +30…−38 inside y 380–1020) was moved to lat +36…−21 inside `MAP-WIN` y 280–840 at the same 9.4 px/°, because y 840–1020 is the caption zone. This is a crop refinement inside Film's projection contract.
- 2026-10-30 `BLOOP-SHEETS-R2` (Mark), from user answers relayed by the coordinator (structured reply, 2026-10-30):
  - **MK-O1, user's choice: keep** the south-arriving fronts in SH02/SH05 (a fair plant for `B05`). No value changed.
  - **MK-O2, user's choice: SH09 pans south-east** to the Scotia Sea / Atlantic sector, with dots at the real array regions (`SRC014`: Bransfield Strait, Scotia Sea). SH09 camera (0, −60) → (−1020, −560) over L0–L62; A1 Bransfield `mapXY(301.5, −62.8)`, A2 Scotia `mapXY(311, −58.3)`, A3 Scotia `mapXY(322, −58)`; Peninsula enters at G1091. Superseded: dy −60 → −600 over L7–L59, Pacific-sector dots at 175/205/235° E. This departs from the brief's "`B07` pans south" (VD06 framing note) by user direction; Film's file is not edited, and Film is informed through the coordinator. M01 wash/path extent widened.
  - **Looks:** L-A1 and L-B2 (CRD-2) recorded. L-C is open, and so is its engine: SH13 and M03 rewritten to be engine-agnostic. Anchors, timing, labels and sound are unchanged.
- 2026-10-30 `BLOOP-SHEETS-R3` (Mark), from `BLOOP-BRIEF-R2` (user picked **L-C = L-CP3**, all painted, "Paint CP3 ล้วน", 2026-10-30; VD16 fully closed). SH13 only (`sc01-b09-b10.md` → R3; the other sheets stay R2):
  - **Rush:** `s` 1 → 3 (was 1 → 7, then 7 → 10), quadratic ease-in about `cr.mouthCenter`, plus `dy` 0 → +270, so the mouth goes from screen (560, 620) to (560, 890). Hold at s 3; DEP07 screen-space black over L291–L312.
  - **Depth and checks:** `PROP-HYD` is painted after `CR-REAL`; M03 and MK-O4 dropped; DEP07 added. G1740 check moves to s ≈ 1.65 ("no breakup at phone size"); new G1758 coverage check.
  - **Coverage re-check with Mark's anchor (720, 620):** at L291 the mouth black covers 90.8 % of CAP-ZONE at full width (99.5 % of the caption-safe width) with the hydrophone subtracted. Film's figures came from the spike mouth at world ≈ (534, 650). The +270 drift therefore holds. New finding: the hydrophone stays in frame at the left edge (x ≤ 125) at s 3.
- 2026-10-30 `BLOOP-SHEETS-R4` (Mark), from `BLOOP-BRIEF-R3` (FR01–FR03) and Boss's blockout pass 1 returns (`scripts/the-bloop/build-notes.md`, Boss entry); all four sheets moved to R4:
  - **SH13:** four CP3 eye anchors replace `cr.eyeL`/`cr.eyeR`; head 960 ± 30, top ≈ y −116; `jawOpen` keys. Eye rings are inside the frame (top y 98) and outside slot 1 (13 px margin).
  - **SH06/SH07/SH11:** head left, drift −40/−10. The SH06 camera was cut to s 1.02 about (380, 440), keeping the head in y 350–840 (MK-O6). The SH07 ghost is drawn 60 px lower. The SH11 creature box is covered 88–89 % by the ice keel.
  - **SH01 (Boss item 3):** rings keyed by arrival, with a base train every 15 f plus a burst at G93/97/101; the L192 spike falls after the clip's fade-out and is ignored.
  - **SH03 (Boss item 4):** fixed 6 f train, in-point 2.20 s, spacing test G410 vs G440.
  - **Boss items 5 and 6** are covered by FR02 and the existing G1779 label end.
  - **Closed:** MK-O5. **Opened:** MK-O6 and MK-O7 (both to Film).
