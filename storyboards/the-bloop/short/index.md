# BLOOP-EP01-SHORT — storyboard index

Deliverable `BLOOP-EP01-SHORT`, Full tier. Handoff revision **`BLOOP-SHEETS-R8`** (Mark, 2026-10-30). Status: **ready-for-dev**. Timing: checked-with-audio (frames on Editor's measured take 3 knots). Evidence: runtime/render of the re-time none yet · voice picked by the user (Gemini Charon take 3) · user accepted ≈ 67 s (`delivery.md`) · sheet approval none.
Inputs: script [short/script.md](../../../scripts/the-bloop/short/script.md) `BLOOP-SCRIPT-R5` (user-approved 2026-10-30) · fact-check [short/fact-check.md](../../../scripts/the-bloop/short/fact-check.md) `BLOOP-FACTCHECK-R6` (`ready-for-storyboard`) · brief [visual-brief.md](visual-brief.md) `BLOOP-BRIEF-R8` (`ready-for-mark`; B10 hero ending H01–H10, B04 hero dream creature H11–H13) · delivery record [scripts/the-bloop/delivery.md](../../../scripts/the-bloop/delivery.md).
Target: `claude/bloop-p5-svg-viz-c10597` @ `cab9833` · 30 fps · 1080×1920 · durationFrames **2127 (70.9 s: take 3 VO + the R7 B10 ending at H03 defaults; see Slack options)** · composition offset 0.

| Document | Revision | Status |
| --- | --- | --- |
| [visual-brief.md](visual-brief.md) | `BLOOP-BRIEF-R8` (Film, 2026-10-30) | ready-for-mark; looks L-A1, L-B2 (CRD-2), L-CP3; FR01–FR11; B10 hero ending H01–H10; B04 hero dream creature H11–H13 (R8, staging pending to Mark) |
| [sc01-b01-b03.md](sc01-b01-b03.md) | `BLOOP-SHEETS-R8` | ready-for-dev · SH01–SH04 |
| [sc01-b04-b06.md](sc01-b04-b06.md) | `BLOOP-SHEETS-R8` | ready-for-dev · SH05–SH08 |
| [sc01-b07-b08.md](sc01-b07-b08.md) | `BLOOP-SHEETS-R8` | ready-for-dev · SH09–SH12 |
| [sc01-b09-b10.md](sc01-b09-b10.md) | `BLOOP-SHEETS-R8` | ready-for-dev · SH13 |

**Readiness scope.** `ready-for-dev` permits Boss's plate scaffolding and Editor's blockout with placeholder art. It does not cover finished art. Look picks (user, 2026-10-30): **L-A1** (deep water, also `SET-COLD` and the diagram washes) and **L-B2 / CRD-2** (`CR-DREAM`); Film's look frames own their detail. **L-CP3** (`CR-REAL`, all painted, user 2026-10-30). The sheets fix bounds, anchors, paths and timing only, so every shot holds for any look the user picks. A look pick that moves an anchor beyond its stated tolerance, or that changes a medium, comes back to Mark (and Film, under brief "On revision").

## Scene order and sheets

One story scene, `BLOOP-EP01-SHORT-S01` (the script's single scene), split into four sheets by beat. Shot IDs are `BLOOP-EP01-SHORT-S01-SHnn` (short form `SHnn`); key states are `SHnn-Knn`. There are no legacy `BOARD`/`Pxx` IDs for this deliverable.

| Sheet | Beats | Scene-local range [start, endEx) | Shots |
| --- | --- | --- | --- |
| [sc01-b01-b03](sc01-b01-b03.md) | `B01`–`B03` | [0, 684) | SH01 [0,224) · SH02 [224,399) · SH03 [399,518) · SH04 [518,684) |
| [sc01-b04-b06](sc01-b04-b06.md) | `B04`–`B06` | [684, 1204) | SH05 [684,849) · SH06 [849,919) · SH07 [919,1033) · SH08 [1033,1204) |
| [sc01-b07-b08](sc01-b07-b08.md) | `B07`–`B08` | [1204, 1696) | SH09 [1204,1267) · SH10 [1267,1329) · SH11 [1329,1446) · SH12 [1446,1696) |
| [sc01-b09-b10](sc01-b09-b10.md) | `B09`–`B10` | [1696, 2127) | SH13 [1696,2127) (B10 phases VO-relative) |

Shots per beat: `B01` 1 (SH01, which also carries the first `B02` phrase) · `B02` 1 · `B03` 2 · `B04` 2 · `B05` 1 · `B06` 1 · `B07` 3 (SH11 runs into `B08` until the second phrase) · `B08` 1 · `B09`+`B10` 1 (one continuous camera view, no cut: the brief's "the `B09` frame is `B10`'s start frame"). 13 shots in all.

Clocks: one scene from frame 0, so scene-local = composition-global. Shot-local `tl` = frame − shot start. Sheets write `G<frame>` for composition frames and `L<frame>` for shot-local frames. Ranges are half-open.

## Phrase anchors (timing, measured: Gemini Charon take 3)

**Every event frame in the sheets is tied to one of these anchors.** Since `BLOOP-SHEETS-R8` they are Editor's measured knots for the user-picked voice (Gemini Charon, take 2 B01–B06 + var1 B07–B10; `scripts/the-bloop/short/timing-gemini-take3.json`, `narration-timeline-gemini-take3.json`, `gemini-measure-take3.json`; whisper word times aligned to the R5 VO, so about ±2 f). Beat starts (Editor): B01 0, B02 198, B03 399, B04 684, B05 915, B06 1033, B07 1204, B08 1402, B09 1696, B10 1910. Shot cuts sit on Editor's beat starts or on phrase onsets as each shot block states. If the read changes again, Editor sends new knots and Mark re-times.

| Anchor | Thai phrase (VO, verbatim) | Onset G (measured) | End G (measured) | R7 estimate onset |
| --- | --- | --- | --- | --- |
| `B01-a1` | เสียงนี้… | 12 | 28 | 9 |
| `B01-a2` | ไมค์ใต้ทะเลจับได้ปี 1997 | 38 | 84 | 30 |
| `B01-a3` | มันดังมาก | 84 | 135 | 108 |
| `B01-a4` | จนนักวิจัยไม่เคยได้ยินอะไรแบบนี้ | 142 | 189 | 124 |
| `B02-a1` | ไมค์พวกนี้ | 204 | 221 | 198 |
| `B02-a2` | โนอาหย่อนไว้ลึกใต้แปซิฟิก | 224 | 258 | 216 |
| `B02-a3` | เพื่อฟังแผ่นดินไหวใต้ทะเล ("แผ่นดินไหว" ≈ G278) | 267 | 313 | 267 |
| `B02-a4` | แต่ปีนั้น | 323 | 341 | 313 |
| `B02-a5` | มันได้ยินเสียงนี้ซ้ำหลายครั้ง ("ซ้ำ" ≈ G352) | 341 | 391 | 330 |
| `B03-a1` | เสียงบลูปของจริงต่ำมาก | 403 | 453 | 374 |
| `B03-a2` | ที่ได้ยินนี่ถูกเร่ง 16 เท่า… | 464 | 506 | 407 |
| `B03-a3` | เสียงจริงไต่สูงขึ้นอย่างรวดเร็ว | 518 | 575 | 468 |
| `B03-a4` | ตลอดราวหนึ่งนาที | 575 | 616 | 514 |
| `B03-a5` | ฟังคล้ายเสียงสัตว์ร้อง | 630 | 672 | 547 |
| `B04-a1` | มันดังจนไมค์หลายตัวได้ยิน | 688 | 730 | 575 |
| `B04-a2` | จากไกลกว่าห้าพันกิโลเมตร | 730 | 777 | 619 |
| `B04-a3` | นักวิทยาศาสตร์บางคนก็สงสัยว่าเป็นสัตว์ | 787 | 843 | 665 |
| `B04-a4` | ส่วนชาวเน็ต… | 849 | 867 | 738 |
| `B04-a5` | จินตนาการไปถึงสัตว์ยักษ์ | 873 | 907 | 766 |
| `B05-a1` | แต่ | 919 | 924 | 801 |
| `B05-a2` | ทิศของเสียง | 924 | 947 | 808 |
| `B05-a3` | ชี้ไกลลงไปทางใต้… | 947 | 994 | 828 |
| `B05-a4` | ทางขั้วโลกใต้ | 998 | 1025 | 876 |
| `B06-a1` | เพราะทะเลลึกมี | 1037 | 1059 | 905 |
| `B06-a2` | "ช่องเสียง" | 1059 | 1080 | 927 |
| `B06-a3` | ที่พาเสียงต่ำไปได้ไกลมาก | 1080 | 1125 | 940 |
| `B06-a4` | ไมค์พวกนี้ถูกหย่อนไว้ในช่องนั้นพอดี | 1137 | 1195 | 988 |
| `B07-a1` | หลายปีต่อมา | 1208 | 1230 | 1055 |
| `B07-a2` | ไมค์ใกล้แอนตาร์กติกา… | 1237 | 1267 | 1079 |
| `B07-a3` | เจอเสียงที่ลายคลื่นคล้ายกันมาก | 1267 | 1323 | 1127 |
| `B07-a4` | จากภูเขาน้ำแข็งยักษ์ที่กำลัง | 1329 | 1369 | 1173 |
| `B07-a5` | แตกร้าว | 1369 | 1387 | 1222 |
| `B08-a1` | ราวปี 2012 | 1407 | 1424 | 1238 |
| `B08-a2` | โนอาประกาศว่า | 1446 | 1474 | 1271 |
| `B08-a3` | บลูปสอดคล้องกับเสียง | 1497 | 1524 | 1298 |
| `B08-a4` | "แผ่นดินไหวน้ำแข็ง" | 1524 | 1561 | 1325 |
| `B08-a5` | ไมค์ที่ฟังแผ่นดินไหว | 1582 | 1617 | 1356 |
| `B08-a6` | ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ… | 1617 | 1658 | 1389 |
| `B08-a7` | ของน้ำแข็ง | 1661 | 1679 | 1452 |
| `B09-a1` | สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ | 1700 | 1762 | 1469 |
| `B09-a2` | เสียงที่ไต่สูงเหมือนสัตว์ร้อง | 1773 | 1819 | 1531 |
| `B09-a3` | สอดคล้องกับเสียงน้ำแข็งแตกร้าว… | 1822 | 1888 | 1569 |
| `B10-a1` | คุณคิดว่ามันคืออะไรกันแน่? | 1914 | 1965 | 1629 |

Non-VO anchors: `B09` pause K02 = [`B09-a3` end, Qs) = [1888,1914) (26 f). `B10` (brief H03, `BLOOP-FACTCHECK-R7` `R7-R2`) stays **VO-relative**: P1 = [Qs, Qe + 9) with the first creature frame at Qs + 2, then P2 36 f (27–60), P3 21 f (15–30), P4 30 f (24–42), P5 36 f (30–42; the black reaches RGB 0 at its end), P6 30 f. Resolved on take 3 (Qs 1914, Qe 1965): P1 [1914,1974), P2 [1974,2010), P3 [2010,2031), P4 [2031,2061), P5 [2061,2097), P6 [2097,2127). Stretch/shrink rules: [sc01-b09-b10](sc01-b09-b10.md).

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
| Editor | Editor | Gemini Charon take 3 knots delivered (O-1 closed); Mark re-timed in R8; `bloop.wav` copy with NOTICE (`AUD-1`); `captionStyle.position: 'middle'`; measure the audible windows of the crack, tick and clip, which set the label windows | all | not started |
| Sound gaps | Editor | `NEEDS-GEN` cues, specified in the first shot that uses each: `water_deep-ocean-roomtone_01` (SH01), `quake_seafloor-rumble-muffled_01`, `pulse_underwater-soft-thump_01` (SH02), `hum_low-travelling-flat_01` (SH08), `ice_iceberg-crack-groan-underwater_01` (SH11), `creature_deep-swallow-gulp_01` (SH13). Library IDs used are present in `sound-library/INDEX.md` (checked 2026-10-30) | — | gaps confirmed (0 matches in INDEX) |

**Findings revalidated (2026-10-30, against brief Dev findings):** DF-20261029-painted-timeline-dissolve → dissolves in SH02 and SH06 use `dissolveSec`, ghost/creature fades by colour mix (SH07, SH11); DF-20261030-p5brush-large-fill-mottle → `SET-*` flat underlayers (all water plates); DF-20261030-painted-screen-layers-overlay → plate-owned Grain/Grade (all); DF-20261030-painted-straight-bars → map/section lines stay SVG (SH02, SH05, SH07–SH10, SH12); DF-20261030-render-run-noise → dissolve and morph acceptance by PSNR (SH02, SH06, SH11). Added: **DF-20261030-painted-glaze-pickup** applies to SH11, where `ICE` is painted over the area the creature occupied; the ice base needs opaque, texture-0 passes or the creature's ink will show through (SH11 acceptance).

## Planned runtime mapping (Editor confirms and updates)

Painted cues split wherever the fact label changes; a split keeps the same plate and sets `fromSec` to the elapsed plate time. The runtime scene split (for example one scene per beat for VO and captions) is Editor's choice.

| Shot | Plate key | Cues [G start, G endEx) → label |
| --- | --- | --- |
| SH01 | `bloop-sh01` | [0,186) เสียงจริง เร่ง 16 เท่า · [186,224) none |
| SH02 | `bloop-sh02` | [224,399) none, `dissolveSec` 0.6 |
| SH03 | `bloop-sh03` | [399,461) none · [461,510) เสียงจริง เร่ง 16 เท่า · [510,518) none |
| SH04 | `bloop-sh04` | [518,684) ภาพประกอบ |
| SH05 | `bloop-sh05` | [684,849) none |
| SH06 | `bloop-sh06` | [849,871) none, `dissolveSec` 0.6 · [871,919) จินตนาการ |
| SH07 | `bloop-sh07` | [919,1033) จินตนาการ |
| SH08 | `bloop-sh08` | [1033,1204) none |
| SH09 | `bloop-sh09` | [1204,1267) none |
| SH10 | `bloop-sh10` | [1267,1329) ภาพประกอบ |
| SH11 | `bloop-sh11` | [1329,1369) จินตนาการ · [1369,1387) จินตนาการ + เสียงจำลอง (DEP03) · [1387,1446) เสียงจำลอง |
| SH12 | `bloop-sh12` | [1446,≈1447) เสียงจำลอง (crack tail, measured) · [≈1447,1659) none · [1659,1679) เสียงจำลอง · [1679,1696) none |
| SH13 | `bloop-sh13` | [1696, Qs) none · [Qs, P5 end) จินตนาการ · [P5 end, end) none (black, silent). Take 3: [1696,1914) · [1914,2097) · [2097,2127) |

## Blockout brief

Editor assembles all 13 shots at the anchor timings with placeholder art (flat washes, plain SVG shapes at the stated bounds, a grey box for each creature at its bounds and anchors, sound IDs or silence where a gap is open). Film and Mark review the continuous blockout before polish for action, framing, scale, timing, information order and cuts, especially the brief's proof beats: SH03 ring spacing, SH07 map over ghost, SH11 creature → iceberg, SH13 rise and rush. Blockout status: not started.

## Element captures

None available. Every BLOOP element (`PROP-HYD`, `CR-DREAM`, `CR-REAL`, `ICE`, map, section, panel, sets) is `missing` at `cab9833`, and no preview exists to capture. Look stills come from DEP06 after the user's look pick.

## Slack options (not applied)

The take 3 total is **2,127 f = 70.9 s**. Editor's 2,069 f assumed the R1 tease (≈ 104 f after the last VO); the R7 hero ending needs 162 f after Qe (9 + 36 + 21 + 30 + 36 + 30), so the user-accepted ≈ 67 s (≈ 2,010 f) is about 117 f away. Nothing below is free enough to apply without a decision:

| Option | Saves | Cost / owner |
| --- | --- | --- |
| S1 H03 minimums: P2 36 → 27, P4 30 → 24 | 15 f | Allowed by H03's shrink rule; tighter approach and swallow. Film confirms the read |
| S2 B09 pause K02 26 → 20 f (script asks 0.6–0.7 s) | 6 f | Within the script's range; Editor moves Qs |
| S3 Inter-beat gaps: Editor's 0.2 s tail + 0.12 s head at 9 boundaries (gaps now 12–21 f) trimmed by ≈ 3 f each | ≈ 27 f | Editor; slightly less air between beats |
| S4 B01 lead 12 → 9 f before "เสียงนี้…" | 3 f | Editor; the clip still leads |
| Total S1–S4 | ≈ 51 f → ≈ 2,076 f (69.2 s) | Still ≈ 2 s over 67 s |
| S5 Trim pauses inside the read (B08 a1→a2 22 f, a2→a3 23 f; B09 a1→a2 11 f) | up to ≈ 45 f | Changes the user-picked performance; user decision |
| S6 P6 black 30 → 21 f | 9 f | Reverses the user's H04 pick; user decision |

## Open items

| ID | Owner | Item | Status |
| --- | --- | --- | --- |
| MK-O1 | User | SH02/SH05 wavefront direction | **closed 2026-10-30**: user keeps the fronts arriving from the south ("fair plant for B05"); sheets unchanged |
| MK-O2 | User | SH09 Antarctic dot placement | **closed 2026-10-30**: user chose a south-east pan to the Scotia Sea / Atlantic sector with dots at the real array regions (`SRC014`); SH09 revised in R2. Optional Boat check of the approximate region centres against `SRC014` Fig. 1 (non-blocking) |
| MK-O3 | Film | SH10 has no text tags on the two pattern lines; they are told apart by colour (amber = the `B03` line returning, cyan = ice) to avoid adding unscripted on-screen text. | open (non-blocking) |
| MK-O4 | — | Dropped in R3 (the depth seam is resolved by draw order) | closed |
| MK-O5 | Editor | `bloop.wav` length | **closed 2026-10-30**: 10.342 s (Boss DEP05); SH01 needs 6.2 s |
| O-1 | Editor | Voice read and re-time | **closed 2026-10-30**: Gemini Charon take 3 picked by the user; sheets re-timed in R8 |
| MK-O6 | Film | SH06 camera: FR03's s 1.04 about (380, 760) puts the head top at y 336, inside label slot 1. R4 uses s 1.02 about (380, 440). Accept, or let the head outline pass behind the slot | open |
| MK-O7 | — | Hydrophone in the rush | **superseded 2026-10-30 by R5** (brief H01: the hydrophone is swallowed in P4, before the push) |
| VD16 | User/Film | Look pick: L-A1, L-B2 (CRD-2), L-CP3 picked 2026-10-30 | closed |

No user storyboard review page exists yet for `BLOOP-SHEETS-R8`; the coordinator publishes it.

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
- 2026-10-30 `BLOOP-SHEETS-R5` (Mark), from `BLOOP-BRIEF-R5` B10 hero ending (H01–H08, user-approved; the user picked the 1.0 s black, H04). SH13 only (`sc01-b09-b10.md` → R5; the other sheets stay R4 and are not yet re-timed to the Gemini read):
  - **Phases:** K03–K06 → P1–P6, VO-relative. The rise is removed; the creature table runs `k` 0.12 → 1.0 with Film's mouth centres. Eye anchors are at the P4 end: all in frame (top y 88) and none in slot 1. Ice goes inside the mouth in P3; the hydrophone at the lip-line frame (≈ P4 + 19).
  - **P5:** s 1 → 3 / dy +270 about (400, 610). CAP-ZONE coverage is 87.4 % at s 3 and 85.0 % at s 2.89, which meets ≥ 85 % with no margin; optional `dx` +100 → 96.5 % (to Film).
  - **Label and black:** label [P1 − 2, P5 end); P6 is 30 f of black.
  - **Duration:** est. 1,840 f.
  - **Closed:** MK-O7 (superseded).
- 2026-10-30 `BLOOP-SHEETS-R6` (Mark), from `BLOOP-FACTCHECK-R7` and `BLOOP-BRIEF-R6`. SH13 only (`sc01-b09-b10.md` → R6):
  - **`R7-R2`:** P1 = [Qs, Qe + 9); first creature frame Qs + 2 (G1631); label [Qs, P5 end) = G[1629,1810). This index and the sheet now agree.
  - **`R7-R1`:** the close gulp runs G1785–G1809.4 (R8-1); drone, whoosh and room tone are at 0 by G1810; the P6 hold is silent.
  - **`R7-C1`–`C3`:** written into the sheet.
  - **Brief R6:** P5 `dx` +100 (coverage 96.5 % / 93.2 %); `shadow` 0.3 → 0 over P3–P4.
- 2026-10-30 `BLOOP-SHEETS-R7` (Mark), from `BLOOP-BRIEF-R7` H09/H10 and Boss pass 4. SH13 only (`sc01-b09-b10.md` → R7):
  - **P1:** profile silhouette swimming left, 230 → 380 px, head (960, 320) → (820, 350).
  - **P2:** turn at f14–24 with the ¾ head at `k` 0.30, then `k` 0.45 at (770, 450).
  - **H10 swallow reads:** the ice is held to ≤ 0.8 × the gum, the hydrophone cable fades, and nothing is painted after P4 end.
  - **Lip-line frame:** P4 + 13.5 (Boss pass 4) → G1758.
  - **Kept:** gulp G1785–G1809.4 (`R8-1`, coordinator). Timing is unchanged.
- 2026-10-30 `BLOOP-SHEETS-R8` (Mark): all four sheets re-timed to Editor's Gemini Charon take 3 knots. The phrase-anchor table now holds the measured onsets (with the R7 estimates kept as a column), and the shot ranges, runtime cues and label windows are moved to match. SH13 is resolved from Qs 1914 / Qe 1965, with the lip-line frame at P4 + 16 (G2047; Boss L293, coordinator call). SH06 gets the R8 H12 reveal at `Lr` = G894 (whisper onset of "สัตว์ยักษ์"). Total 2,127 f; slack options listed, none applied. Superseded: every R7 estimate frame and the ±10 f / 1,740–1,800 return rule.
