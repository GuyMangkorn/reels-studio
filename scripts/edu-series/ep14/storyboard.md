# Storyboard — EDU-EP14-SHORT (timed scene sheet)

Deliverable: `EDU-EP14-SHORT` · Revision: **EDU-EP14-ROWS-R4.1 (timed scene sheet on the slowed read)** (Film 2026-11-10: every per-shot range and shot-local key frame re-pegged to the R4.0 re-lock by the Editor; staging, cameras and sound designs are the R3.1 text) · Status: **ready-for-dev (timing)**: Boss retimes the shot code and Ton the cue sheet per the [R4.1 retime list](#r41-retime-list-boss-and-ton); the 0.50 s over the 40–60 s target is a user decision (Film recommends accepting 60.50 s, [Open questions](#open-questions)) · Timing: **audio-measured** on the user-picked slowed read (speech atempo 0.90, gaps 0.95; not listened, not checked with a blockout). Previous timing R3.0/R3.1 (1674 f) is kept in [measure.json](measure.json) `previous.lock_R3.0`.
Inputs: [script.md](script.md) EDU-EP14-SCRIPT-R4 (user-approved 2026-11-09) · [fact-check.md](fact-check.md) R4 recheck + W3 picture check (PC-1) · [film-brief.md](film-brief.md) **EDU-EP14-BRIEF-R1.4** · [measure.json](measure.json) `lock` (storyboard `EDU-EP14-ROWS-R4.0`; R3.0 kept under `previous.lock_R3.0`, R2.0 under `previous.lock_R2.0`), reproduce `python3 -I scripts/edu-series/ep14/measure-lock.py --write` (`--read r4` reproduces R3.0) · narration `projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav` built by [narration-slow.py](narration-slow.py) from the locked R4 read · delivery record [../delivery.md](../delivery.md) · task [task.md](task.md).
Target: worktree `agent-voice-gen-limits-364db3`, branch `claude/education-concept-todo-fb6515` at `227dabe` (+ uncommitted EP14 work) · 30 fps · **durationFrames 1815 (60.50 s)** · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: W5.2 Boss draft built (21 shot compositions `EDU14-<shot id>`, stills only: `out/edu14/build/v8/sheet.png`, SH19/SH21 fix `out/edu14/build/ep14-sh19-21-fix.png` and `fix3/`; no seek-parity render, no caption-zone measure); Ton cue sheet [sound-cues.json](sound-cues.json) (46 cues, not listened) · render/samples none · audio sync: frames measured from the audio (line edges ±0.03 s, word onsets ±0.1 s Whisper, not listened) · user approval: storyboard 21/21, Q-F1–Q-F4, SP1 drop look and look frames LF01–LF05 (v8) passed on the review page 2026-11-09 (review of R1.0/R1.1 content; R3.0 timing not yet shown). Girl voice picked by the user: V01 and V02 = Leda take a.
Rows file: [review-rows.json](review-rows.json) is ROWS-R3.0 (published 2026-11-09, version 1794236818-3990); R3.1 rewrote the text of SH01, SH03, SH08, SH09, SH12, SH19, SH20 and SH21 and R4.1 moves every shot's frames; the rows file was left untouched in this pass (caller scope: the coordinator retimes it from this sheet). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (= scene-local, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`; a shot's last frame is `+len−1`. Read time `t` (seconds in the narration WAV) → global frame = `round((t + offset) · 30)`, offset 0.35 s before the W700 cut, 0.8567 s between the W700 and V01 cuts, **2.14 s after the V01 cut** (no beat gaps; read time = the slowed read; [measure-lock.py](measure-lock.py)).
- Picture beats inserted into the read: lead-in 0.35 s; W700 [535, 565) (slam f553, white frame f564); V01 slot (shot f644, L04 onset pinned to f690); V02 shot = L15 end + 4 f. The R3.0 pins are kept as offsets: W700 slot 30 f from the L02c end, L03 onset +4 f, V01 shot = L03 end + 13 f (42 f), L04 onset = V01 shot + 46 f.
- Spaces and axes as in the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline): `B` bus stop (m; origin on the pavement under the centre of the roof's front lip, +x right along the kerb seen from the road, +y up, +z toward the road), `C` sky column (m), `K` cloud-base macro (mm), `F` fall follow (m, drop-relative), `A` forearm macro (mm), `M` drop macro (mm, drop-relative), `H` palm (cm). Camera lines use the kit form `cam: target (x, y, z), yaw, r, eye, pitch, f, hy` (hy = picture row of the target; yaw 0 looks toward −z, positive yaw swings the camera toward +x; positive pitch looks up); `ycam:` gives the camera position. Camera transforms are owned by the shot's camera line (no picture-stage moves unless a shot says so); actor motion is separate and owned by the casting line's pose/motion.
- Screen: pixels, origin top-left, y down. Caption band y 1176–1344; faces, contact, gauges, labels and diagram text above y 1160; label slot LBL (816–1020, 148–204) for "ภาพจำลอง"; gauge slots G1 centre (790, 860) r 160 and G2 centre (540, 470) r 230; `@TamMaiLa` top-left (x < 330, y < 140 kept clear). Lead sizes are computed (px/m = f / distance), not rendered.
- In shot headers `VO C05 +7–+48` means shot-local voice range [7, 48) of cue C05; word onsets in brackets.
- Values in Camera/Staging are design `est` unless marked `measured`; every frame number below is an integer on the measured timeline.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| GIRL | `girl-school + student-th-skirt, P30, tired` + `gear.pack` (red `#b8483c` backpack) | 1.24 m, about 9; one mark (0.25, 0, 0.02) at the drip line in every bus-stop shot except SH12 (half a step back, see there); **LEFT forearm (rig `lArm`) = visor arm = sting arm = hand-out arm** (user, 2026-11-09): screen right in `front`, the near arm in the `left` profile. Poses: P30 (shading her eyes) → P30 frozen → `new: flinch-clutch-forearm` → P01 (back view) → P02 → P11 via `new: hand-out-palm-up` → P11 held. Faces: `tired` → `neutral` (frozen) → `ouch` → `suspicious` (curious squint) → `neutral` → `happy` → `laugh` → `happy` |
| GIRL voice | V01 `projects/EDU/audio/2026-11-09_ep14-girl-v01-a-leda.wav` (0.88 s; voice 0.204–0.625 s `measured`, 13 f; a 54 ms blip at 0.000–0.054 s: trim the head to 0.17 s) · V02 `…/2026-11-09_ep14-girl-v02-a-leda.wav` (2.12 s; giggle 0.190–0.678 s `measured`, 15 f; a 34 ms blip at 1.239–1.273 s: Editor listens, cuts it if it is a click, keeps it if it is a breath) | user pick 2026-11-09 |
| GIRL hand (macro) | kit hand macro `new: palm-up-open`, `new: MACRO_TONES.girl` | B05-SH02 only (UT14 macro exception); her LEFT hand, palm up |
| RIDER | `man-spiky + new: cycling kit (dark rain shell, black bib shorts, white helmet, clear glasses), new: racing-tuck, neutral` on `new: road bike` | `right` profile; B02-SH03 only; picture only, never labelled |
| DROP | `new: drop` in [src/painted/edu14/drop.ts](../../../src/painted/edu14/drop.ts) (states pendant, sphere, bun, bag, burst; SP1 passed) | hero 5 mm (no-air sphere); real small 2 mm round; bun 4 mm; bag from 5 mm; burst = 16 pieces 0.3–3.5 mm (2 large, 5 rim, 9 film; Boat PC-1) |
| BB | `new: bb ghost` 6 mm orange ball, translucent | B01-SH08 only |

## Shot map

| # | Shot | Beat | Lines | Range (global) | Len | Start s | Camera | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 a | [0, 68) | 68 | 0.00 | lip close → pull-back | Teardrop drops hang from a dripping tin lip; pull back to the girl; on "ไม่มีอากาศ" colour, rain and sound die |
| 2 | S01-B01-SH02 | B01 | L01 b | [68, 197) | 129 | 2.27 | low close, looking up | Her frozen face under the grey sky; gauge snaps to 700 "แบบจำลอง", rewinds |
| 3 | S01-B01-SH03 | B01 | L02a | [197, 285) | 88 | 6.57 | slow crane up | Silent grey world; up past the roof to a motionless cloud base |
| 4 | S01-B01-SH04 | B01 | L02 a | [285, 331) | 46 | 9.50 | cloud macro (mm) | One drop swells under the cloud and lets go |
| 5 | S01-B01-SH05 | B01 | L02 b | [331, 392) | 61 | 11.03 | long-lens elevation | Cloud base "~2 กม." above the city; dotted line to the bus stop |
| 6 | S01-B01-SH06 | B01 | L02b | [392, 458) | 66 | 13.07 | fall follow | A clean sphere falls through still grey air; gauge climbs |
| 7 | S01-B01-SH07 | B01 | L02c, W700 | [458, 565) | 107 | 15.27 | drop-eye, straight down | City rushes up, "1 กม." flicks past, 500+, roof, her face; slam 700, white flash |
| 8 | S01-B01-SH08 | B01 | L03 | [565, 644) | 79 | 18.83 | bullet-time arc (mm) | Drop frozen over her forearm beside a BB ball; same sting glyph |
| 9 | S01-B01-SH09 | B01 | V01 | [644, 686) | 42 | 21.47 | medium, knees-up | Hit, she flinches and clutches her arm: "โอ๊ย!" |
| 10 | S01-B02-SH01 | B02 | L04 | [686, 751) | 65 | 22.87 | cloud macro (shot 4 replayed) | Hard cut to colour and rain roar; the same drop leaves again |
| 11 | S01-B02-SH02 | B02 | L05, L06 | [751, 929) | 178 | 25.03 | fall follow down a condo | Up-arrow grows, meets "น้ำหนัก"; scroll stops speeding; needle holds at 32 |
| 12 | S01-B02-SH03 | B02 | L07 | [929, 1039) | 110 | 30.97 | from inside the shelter, pan | Split gauge; a road rider tucks past; needle A just over 30, needle B lower |
| 13 | S01-B03-SH01 | B03 | L10 a | [1039, 1076) | 37 | 34.63 | drop macro | A small falling drop is round; teardrop icon crossed out |
| 14 | S01-B03-SH02 | B03 | L10 b | [1076, 1113) | 37 | 35.87 | lip close (shot 1 +0 again) | The teardrops are on the roof edge; one lets go and rounds (K01 paid) |
| 15 | S01-B03-SH03 | B03 | L11 | [1113, 1221) | 108 | 37.10 | drop macro | Bigger drop, flat bottom, arrows press; bun outline |
| 16 | S01-B04-SH01 | B04 | L08 | [1221, 1332) | 111 | 40.70 | low medium | She squints up; a ball-sized drop wobbles in a thought bubble |
| 17 | S01-B04-SH02 | B04 | L12 | [1332, 1432) | 100 | 44.40 | into the bubble → drop macro | Underside hollows into an upside-down bag; bag outline |
| 18 | S01-B04-SH03 | B04 | L13 | [1432, 1520) | 88 | 47.73 | drop macro, wider | Ruler "ส่วนใหญ่ไม่เกินราวครึ่งเซน"; the bag bursts into 16 pieces |
| 19 | S01-B05-SH01 | B05 | L14 | [1520, 1605) | 85 | 50.67 | side view | She slowly puts her open hand out past the drip line |
| 20 | S01-B05-SH02 | B05 | L15 | [1605, 1742) | 137 | 53.50 | palm macro | Small drops pat her palm and splash; tag lands |
| 21 | S01-B05-SH03 | B05 | V02, hold | [1742, 1815) | 73 | 58.07 | close, slow push | Her wet palm and her smile; small laugh; rain softens; hold |

Total 1815 f = 60.50 s (limit 63 s: pass; target 40–60 s: **0.50 s over: Q-F5, Film recommends accepting it**; R3.1 was 1674 f = 55.80 s, +141 f). Speech ends f1738; V02 [1745, 1760); closed hold [1760, 1815) = 55 f = 1.83 s. Shot starts moved +0 to +141 f (change log).

## Voice and subtitle cues (global, measured)

Captions = VO, Thai verbatim; one cue per voice run below (Editor's caption rules set holds and any split; split only at a word boundary). V02 and W700 have no caption.

| Cue | Line | Text | Voice [start, end) | Shot(s) |
| --- | --- | --- | --- | --- |
| C01 | L01 a | สมมติว่าฝนตกโดยไม่มีอากาศ… | [15, 65) | 1 |
| C02 | L01 b | เม็ดฝนจะพุ่งใส่หัวคุณ เร็วถึงราวเจ็ดร้อยกิโลต่อชั่วโมง | [71, 185) | 2 |
| C03 | L02a | ไม่มีลม ไม่มีเสียง… ฟ้าเงียบสนิท | [202, 271) | 3 |
| C04 | L02 a | เม็ดฝนหลุดจากเมฆ | [292, 323) | 4 |
| C05 | L02 b | ที่ลอยสูงได้ถึงสองกิโล | [339, 385) | 5 |
| C06 | L02b | ไม่มีอะไรขวาง มันเร่งไม่หยุด | [397, 446) | 6 |
| C07 | L02c | ตกมาแค่กิโลเดียว ห้าร้อยกว่าแล้ว | [470, 535) | 7 |
| C08 | L03 | เม็ดใหญ่ ๆ จะแสบเหมือนโดนบีบีกันยิง | [569, 631) | 8 |
| C09 | V01 | โอ๊ย! | [653, 666) (caption may hold to 661 for reading) | 9 |
| C10 | L04 | แต่… โลกจริงมีอากาศ | [690, 739) | 10 |
| C11 | L05 | ยิ่งตกเร็ว… อากาศยิ่งดันกลับแรง | [756, 818) | 11 |
| C12 | L06 | ดันจนสู้น้ำหนักมันได้พอดี มันก็เลิกเร่ง | [836, 914) | 11 |
| C13 | L07 | เม็ดใหญ่ที่สุด ถึงพื้นแค่สามสิบกว่ากิโลต่อชั่วโมง | [934, 1028) | 12 |
| C14 | L10 | เม็ดฝนไม่ได้เป็นหยดน้ำตานะ | [1053, 1101) (runs across the 13→14 cut at 1076) | 13, 14 |
| C15 | L11 | อากาศดันเม็ดใหญ่จนก้นแบน เหมือนขนมปังเบอร์เกอร์ | [1118, 1210) | 15 |
| C16 | L08 | แต่… ทำไมไม่มีเม็ดฝนใหญ่เท่าลูกบอลล่ะ | [1234, 1317) | 16 |
| C17 | L12 | ยิ่งใหญ่ อากาศยิ่งดันก้นบุ๋มเหมือนถุงคว่ำ | [1339, 1422) | 17 |
| C18 | L13 | พอใหญ่ราวครึ่งเซน ก็แตกเป็นเม็ดเล็ก ๆ | [1436, 1507) | 18 |
| C19 | L14 | ยิ่งตกเร็ว… อากาศยิ่งดันกลับแรง | [1532, 1597) | 19 |
| C20 | L15 | ทุกเม็ดที่ตกใส่มือคุณ… ถูกอากาศเบรกไว้ไม่ให้เร็วไปกว่านี้ | [1610, 1738) | 20 |
| — | V02 | [small breathy laugh] (no caption) | [1745, 1760) | 21 |

V01 placement: the file starts at f647 with its head trimmed to 0.17 s → voice onset f653. V02: file placed so its voice onset is f1745 (file start f1739 = shot 20 +134, inside shot 20's tail; the first 0.19 s = 6 f of the file is silence. R4.1 fix: R4.0 said f1742, which would put the voice at f1748).

## Word-pegged key frames (measured, R4.0)

Every key frame that sits on a spoken word, re-pegged to the slowed read. Word onsets: R3.x Whisper anchors mapped between the old and new line edges (uniform 1/0.90 stretch) and checked on the new file with faster-whisper (nearest token within 0.02 s for 29 of 38 anchors and 0.07 s for 36; +0.17 s at "แสบ" and +0.19 s at "โลกจริง", where Whisper's token starts mid-word), ±0.1 s; line onsets from speech energy; [measure.json](measure.json) `lock.words` / `lock.lines`. R4.0 locals are the word's shot-local frame; Film's R4.1 re-pegged every other shot-local key frame in the staging blocks to these. Where a key frame spans a word (bracket draw), its R3.0 length around the word is kept.

| Shot | Key frame | Word | R3.0 local | R4.0 local | Global (R4.0) |
| --- | --- | --- | --- | --- | --- |
| 1 SH01 | hit: grade, rain and ambience die | "อากาศ" | +51 | +55 | 55 |
| 2 SH02 | needle snaps 0 → 700 | "เจ็ดร้อย" | +68 | +76 | 144 |
| 4 SH04 | drop lets go | "หลุด" | +16 | +17 | 302 |
| 5 SH05 | bracket draws (word mid-draw) | "ลอยสูง" | +6–+16 (word +12) | +8–+18 (word +14) | 345 |
| 5 SH05 | label "~2 กม." | "สองกิโล" | +29 | +33 | 364 |
| 7 SH07 | "1 กม." marker flicks past | "กิโลเดียว" | +25 | +26 | 484 |
| 7 SH07 | needle passes 500 | "ห้าร้อย" | +41 | +43 | 501 |
| 8 SH08 | sting glyphs 1 | "แสบ" | +22 | +24 | 589 |
| 8 SH08 | sting glyphs 2 | "ยิง" | +51 | +56 | 621 |
| 10 B02-SH01 | drop lets go again | "โลกจริง" | +22 | +24 | 710 |
| 11 B02-SH02 | "น้ำหนัก" arrow in | "น้ำหนัก" | +93 | +101 | 852 |
| 11 B02-SH02 | arrows equal; scroll constant | "พอดี" | +109 | +119 | 870 |
| 11 B02-SH02 | needle holds at 32 | "เลิกเร่ง" | +135 | +148 | 899 |
| 12 B02-SH03 | needle A at 32; rider centre | "สามสิบ" | +49 | +54 | 983 |
| 13 B03-SH01 | red cross | "ไม่ได้" | +26 | +27 | 1066 |
| 15 B03-SH03 | flat bottom 0.35 reached | "ก้นแบน" | +38 | +41 | 1154 |
| 15 B03-SH03 | bun outline | "เบอร์เกอร์" | +72 | +80 | 1193 |
| 16 B04-SH01 | S13 shrug | "แต่…" (line onset) | +13 | +13 | 1234 |
| 16 B04-SH01 | thought bubble | "ใหญ่เท่าลูกบอล" | +65 | +71 | 1292 |
| 17 B04-SH02 | hollow ≈ 0.35 | "บุ๋ม" | +49 | +53 | 1385 |
| 17 B04-SH02 | bag outline | "ถุงคว่ำ" | +66 | +72 | 1404 |
| 18 B04-SH03 | ruler + label | "ครึ่งเซน" | +22 | +25 | 1457 |
| 18 B04-SH03 | burst (inflate +40–+46) | "แตก" | +46 | +52 | 1484 |
| 20 B05-SH02 | ending tag E1 | "…ไปกว่านี้" | +106 | +118 | 1723 |

Unpegged picture beats: W700 slam f553 (shot 7 +95), white frame f564, V01 voice f653, V02 voice f1745, end f1815.

## On-screen text (global ranges)

Exactly brief VD27 (R04 below); positions in the shot blocks.

| Text | Range | Shot(s) |
| --- | --- | --- |
| "ภาพจำลอง" (LBL) | [56, 686) · [1039, 1076) · [1113, 1221) · [1340, 1520) | 1 (+56) – 9; 13; 15; 17 (+8) – 18 |
| G1 no-air dial: numerals 0–700 every 100, "กม./ชม.", "แบบจำลอง" | [78, 197) · [197, 203) fading · [392, 565) | 2 (+10 on); 3 (+0–+5 fade); 6–7 |
| "~2 กม." bracket label | [364, 392) | 5 (+33, on the word) |
| "1 กม." dashed ring | [458, 486) | 7 (+0–+28; flicks past +26 on the word) |
| G1 real dial: "30", "กม./ชม." | [751, 929) | 11 |
| "น้ำหนัก" arrow label | [852, 929) | 11 (+101 on the word) |
| G2 split dial: "30", "กม./ชม." | [934, 1039) | 12 (+5 on) |
| "เม็ดใหญ่ที่สุด" (needle A) | [983, 1039) | 12 (+54 on the word) |
| "เม็ดทั่วไป" (needle B) | [1027, 1039) | 12 (end −12) |
| "ส่วนใหญ่ไม่เกินราวครึ่งเซน" (ruler) | [1457, 1520) | 18 (+25 on the word) |

## Rules for every shot

- **R01 Model labels.** "ภาพจำลอง" ranges as in the table above (R4.0). Every no-air dial reading carries "แบบจำลอง" (shots 2, 6, 7).
- **R02 Drop shapes.** A falling drop is never tear-shaped. The only teardrops are the pendant drops on the lip (shots 1, 14) and the crossed-out icon (shot 13). The no-air drop is a perfect sphere; real drops are round (2 mm), bun (4 mm), bag then burst (5 mm). In shot 11 the drop is too small to read its shape (ring marker).
- **R03 Nothing damaged.** No leaf, roof, car, skin mark or wound anywhere; the sting is a small flash and a rub. No train.
- **R04 Text.** On-screen text is exactly brief VD27: no signs (all textless), no digital speed readout, no digit on needle B, no "terminal velocity"/"แรงต้านอากาศ". The rider is never labelled.
- **R05 Size reference.** Every shot keeps one size reference in frame: GIRL and the shelter (bus stop), the bracket and the city (column), the drop (cloud macro, no-air fall), the condo storeys (real fall), the forearm and the BB (bullet time), the drop and the ruler (macro), the hand (palm).
- **R06 No-air world.** f55 to f686 (shot 1 +55 to the end of shot 9): mean saturation 0.078 (absolute HSV mean, LF02 measure), no ambient motion (rain off, mist frozen, pendant drops frozen); only the hero drop, the camera and the gauge move; the drop keeps its cyan edge. No ambience in the mix.
- **R07 Screen.** Faces, contacts, gauges and diagram text above y 1160; each label in its own slot; the bracket, arrows, outlines, ruler and glyphs track their projected world points; captions per the cue table.
- **R08 Continuity.** GIRL on the mark (0.25, 0, 0.02) in every bus-stop shot except SH12 ((0.35, 0, −0.10), half a step back under the roof; no cut-adjacent shot shows her), backpack on, the LEFT forearm (rig `lArm`) the visor, sting and hand-out arm in every shot; the hero drop identity shots 4–9 and its colour twin 10–11; the gauge in G1 shots 2–11, then G2 in shot 12; shot 14 +0 repeats shot 1 +0 exactly; light constant except the B05 warm grade (+3 %).

## Per-shot staging

**R4.1 (Film, 2026-11-10):** every shot range, length and shot-local key frame below is re-pegged to the R4.0 shot map and the measured slowed read (shot map, cue table, word-pegged table). Rule used for frames that do not sit on a word: a frame tied to a word or a picture beat keeps its R3.1 distance to it; a frame that paces a camera move or a hold scales with the shot or the line it covers (noted per shot). Staging, cameras (positions, yaws, lenses), casting and sound designs are the R3.1 text unchanged; the frame changes Boss and Ton must make are listed in [R4.1 retime list](#r41-retime-list-boss-and-ton).

Key frames shot-local `+n` (global in brackets where it helps). Sound lines give the shot-local frame and the brief's code or library ID (brief [Sound direction](film-brief.md#sound-direction)); every library ID is "not listened" and Ton checks it against the description before use. Mix intent per the brief's sound arc; Editor sets levels.

**1. S01-B01-SH01** [0, 68), 68 f. VO C01 +15–+65 ("ไม่มี" ≈ +47 `est`, "อากาศ" +55).
- Camera: `cam: target (0.25, 2.38, 0.10) → (0.25, 1.20, 0.05), yaw 14→12, r 0.10→3.00 (ease +16–+50), eye 2.36→1.20, f 1200, hy 700→670`; `near` 0.02 m. At the end ≈ 400 px/m: GIRL 496 px, feet ≈ y 1150, lip ≈ y 182 (LF01 `measured` 499 px, feet 1145, lip 182).
- Staging: B, real colour. +0–+16 three pendant teardrops (6 × 4.2 mm, ≈ 70 px tall at r 0.10) hang from the wet fascia, the middle one swelling; the bus stop soft beyond. +16–+50 the camera pulls back and down: the lip line, the drip curtain, then GIRL `front` at her mark, P30 (left hand shading her eyes: rig `lArm`, screen right in `front`; forearm past the drip line at z 0.12–0.24), `tired`, backpack on; rain streaks (ENV-FALL, `captionBand [1176, 1344]`). **+55 the hit on "อากาศ"**: rain marks gone on one frame, the no-air grade drains +55–+63; the drip curtain stops mid-air as frozen beads; "ภาพจำลอง" in LBL from +56.
- Key frames: +0 reads "rain dripping off a shelter" at once (UT01); +50 pull-back lands (LF01 at +52); +55 hit; +63 fully grey. (R3.1 → R4.1: ease end +46 → +50 and LF01 +48 → +52 keep their 5 f / 3 f lead on the hit.)
- Sound: A1 rain on tin + A2 wet road from +0 (no music); S11 plip on the middle drop at +10; **A1 and A2 cut on +55 [f55]** (one frame, no tail; mix: hit → drop); D1 drone fades in from +58 at −24 dB.
- Entry → exit: +0 pendant close, colour, rain → +67 GIRL frozen at the mark, grey, silent but D1.

**2. S01-B01-SH02** [68, 197), 129 f. VO C02 +3–+117 ("เร็วถึง" +50, "เจ็ดร้อย" +76).
- Camera: `cam: target (0.25, 1.05, 0.05), yaw 8→4, r 1.20→1.05, eye 0.75, pitch +22, f 1000, hy 980`; ≈ 830–950 px/m, head ≈ 260–295 px.
- Staging: B, grey. Low close on GIRL frozen mid-glance (P30, `neutral`, eyes up), the lip edge with its frozen beads across the top third, the flat grey sky above. G1 no-air dial (0–700, numerals every 100, "กม./ชม.", "แบบจำลอง") pops in at +10 reading 0.
- Key frames: +10 dial in; **+76 "เจ็ดร้อย": needle snaps 0 → 700 in 4 f** (+76–+80; red past 500), holds +80–+90; rewinds to 0 +90–+103; dial stays at 0 to the cut (+128).
- Sound: D1 under; S9 `ui_pop_01` dial in at +10; S1 `ui_click-tick_01` fast run +76–+80; S2 `reveal_rewind-whirr_01` at +90.

**3. S01-B01-SH03** [197, 285), 88 f. VO C03 +5–+74.
- Camera: `cam: target (0.25, 1.20 → 7.0, 0.05), yaw 12→10, r 3.0→3.4, eye 1.20→3.60, pitch 0→+62 (ease in-out over +0–+82), f 1200, hy 670→760`; +0 = shot 1's end framing (G1 fades out +0–+5). SP3 checks the roof passing the lens. (The crane scales with the shot, × 88/80.)
- Staging: B, grey, nothing moving: GIRL frozen (P30, `neutral`), the frozen drip beads, glassy puddles, the empty food cart across the road; the camera cranes up past the lip and the corrugated roof to the flat cloud base filling the top of frame by +82, held to +87.
- Key frames: +22 LF02; +56 roof edge passes the lens; +82 cloud base fills the frame.
- Sound: near silence: D1 at −30 dB only under NAR (silence policy 3); no SFX.

**4. S01-B01-SH04** [285, 331), 46 f. VO C04 +7–+38 ("หลุด" +17).
- Camera: `cam: target (0, −3, 0) mm, yaw 0→3, r 25 mm, eye −3, f 1200, hy 760`; `near` 0.3 mm; 48 px/mm.
- Staging: K, grey. The wet underside of the cloud at the top; frozen mist dots at depth; the hero drop swells at the attachment point 1 → 5 mm (48 → 240 px) +0–+15, neck thins, **lets go on "หลุด" (+17)**, falls out of the frame bottom by +29, accelerating; a frozen mist field after it to the cut (+45).
- Key frames: +15 full size; +17 release; +29 gone.
- Sound: D1; S3 glass pluck at +17.

**5. S01-B01-SH05** [331, 392), 61 f. VO C05 +8–+54 ("ลอยสูง" +14, "สองกิโล" +33).
- Camera: `cam: target (0, 1000, 0), yaw 0, r 8370→7900 (linear +0–+60), eye 1000, f 3600, hy 690`; 0.43 → 0.46 px/m: cloud base y 260 → 234, ground y 1120 → 1146 (LF03 `measured` base y 251, ground 1129).
- Staging: C, grey. Cloud deck across the top, haze bands, city strip at the bottom (condos, shophouse rows, a river glint). Bracket on the left (x ≈ 120–180) from the base to the ground; dotted fall line from the base down to a pin with a ring marker on the bus stop (x 540); a small ring marker (the drop) slides down the first tenth of the line +0–+60.
- Key frames: +8–+18 bracket draws down from the base ("ลอยสูง" +14); +18–+29 dotted line draws to the pin; +29 pin; **+33 label "~2 กม." on "สองกิโล"**, held to the cut; +34 LF03 (label in; Boss checks it against LF03 v8).
- Sound: D1; soft S1 `ui_click-tick_01` at +29 (pin); S1 tick at +33 (label).

**6. S01-B01-SH06** [392, 458), 66 f. VO C06 +5–+54.
- Camera: follows the drop: `cam: target (0, 0, 0), yaw 0→6, r 0.04 m, eye 0, f 1200, hy 760`; 30 px/mm: drop 150 px.
- Staging: F, no-air. A clean sphere at frame centre (cyan edge, scene refracted inside); grey void; the cloud base receding above; three still mist shreds at 3–30 m passing up, each faster than the last; the city far below in haze. G1 dial back in at +0 reading 0, climbing linearly to 350 at +65 (never slowing).
- Key frames: +0 dial 0; +33 dial ≈ 178; +65 dial 350.
- Sound: D1; **R1 riser starts at +19 [f411]** (R4.1: the file is 142.5 f and must stop dead at its own peak on the slam, now f553 = shot 7 +95; f553 − 142 = f411, no time-stretch; +0–+18 D1 only. R3.1's +7 [f365] shifted by the shot's +34 would land at f399 and peak 12 f early); S1 tick run accelerating with the needle (one tick per 25 km/h).

**7. S01-B01-SH07** [458, 565), 107 f. VO C07 +12–+77 ("กิโลเดียว" +26, "ห้าร้อย" +43); W700 picture beat +77–+107.
- Camera: `ycam: (0.25, h(t), 0.20), yaw 0, pitch −89, f 1100, hy 960` (camera = the drop); h(t) = 1150 · (2.40 / 1150)^e(u), u = +0 → +95; e(u) monotonic ease-in fitted so **h(+26) = 1000 m, h(+76) ≈ 30 m (LF04), h(+95) = 2.40 m** (SP2 owns the curve; R4.1 anchors: the marker on its word, LF04 and the lip keep their R3.1 distance to the slam, 19 f and 0 f); at h 2.40 ≈ 815 px/m at her face 1.35 m below (head ≈ 250 px). Lead-size exception: she is the target.
- Staging: B (altitude), no-air. Straight down: the city blocks (LOD 1 km) → shophouse roofs and the road with the shelter roof as a small rectangle (LOD 100 m) → the corrugated roof with frozen beads (LOD 10 m), in-canvas blends; a "1 กม." dashed ring floats at altitude 1,000 m and **flicks past at +26** ("กิโลเดียว"); the lip slides by at +95; under it GIRL's `front` card from above, face up, P30 forearm at her brow, grows toward the lens. G1 needle from ≈ 355 at +0, **passes 500 at +43** ("ห้าร้อย"), red past 500.
- Key frames: +26 marker; +43 500; +76 LF04 (h ≈ 30 m; roof 160 × 72 px `measured`); **+95 slam 700** [f553], G1 scales ×1.5 toward frame centre (+95–+99); +96–+105 hold, nothing moves; **+106 one white frame** [f564]; hard cut.
- Sound: R1 builds; S1 tick run accelerating; S4 low double tick at +26; R1 sub pulse at full rate by +86; **+95 R1 stops dead with a hard S1 tick** (Editor cuts R1 hard at the f553/f554 boundary, no fade; the file's last half frame is dropped); **+96–+106 dead silence** (D1 out too; silence policy 4).

**8. S01-B01-SH08** [565, 644), 79 f. VO C08 +4–+66 ("แสบ" +24, "ยิง" +56).
- Camera: `cam: target (0, 0, 0) mm, yaw 50→15 (bullet-time arc, eased +0–+78), r 25 mm, eye +6 mm, f 1200, hy 700`; `near` 0.3 mm; 48 px/mm: drop 240 px, BB 288 px.
- Staging: A, no-air, time frozen. The hero drop (5 mm sphere) hangs 30 mm above her left forearm (a soft skin band across the frame bottom, above y 1160); at +9 mm beside it the BB ghost (6 mm, orange, flat ink, 85 %); small 1–2 mm drops faint and frozen around; her face far up and soft. Sting glyphs (starburst, `#fff1a8`) flash on the drop and the BB together.
- Key frames: **+24 "แสบ" glyphs** (+24–+29); **+56 "ยิง" glyphs** (+56–+61); the arc ends at +78.
- Sound: D1 thin only; S5 BB tick at +24 and +56.

**9. S01-B01-SH09** [644, 686), 42 f (unchanged length and locals). V01 "โอ๊ย!" voice +9–+22 [f653–f666] (caption C09).
- Camera: `cam: target (0.25, 0.95, 0.05), yaw 6, r 1.40→1.30 (jolt +6–+9, then hold), eye 1.00, f 1200, hy 640`; ≈ 857 → 923 px/m: head top ≈ y 434, knees at the frame bottom.
- Staging: B, grey. Time resumes: the drop streaks down onto her left forearm (screen right) at +6 (one small white flash at the contact, no mark); `new: flinch-clutch-forearm`: the left forearm snaps to her chest, the right hand covers the spot, shoulders up, `ouch` +6–+30, then a rub +30–+41.
- Key frames: +6 hit; +9 "โอ๊ย!"; +30 rub.
- Sound: D1; S6 skin sting at +6; V01 file from +3 [f647] (head trimmed to 0.17 s), voice +9 [f653]; no ambience (user decision: in the silence).

**10. S01-B02-SH01** [686, 751), 65 f. VO C10 +4–+53 ("โลกจริง" +24).
- Camera: `cam: target (0, −3, 0) mm, yaw 3→0, r 25 mm, eye −3, f 1200, hy 760` (shot 4 replayed).
- Staging: K, **hard cut to colour** on +0; "ภาพจำลอง" off. The same cloud underside in colour, mist drifting, other drops forming and falling at depth; the hero drop repeats shot 4's R4.1 states shifted +7: swells +7–+22, **lets go on "โลกจริง" (+24)**, gone +36.
- Key frames: +0 colour and sound back; +24 release; +36 gone.
- Sound: **A1 + A2 back on +0 [f686] at full gap level** (mix: release), then −12 dB under NAR; M1 enters at +0 [f686] (energy 2); S3 pluck at +24 (warmer, Editor adds a little room).

**11. S01-B02-SH02** [751, 929), 178 f. VO C11 +5–+67 ("อากาศ" +31, "ดันกลับแรง" +45), C12 +85–+163 ("น้ำหนัก" +101, "พอดี" +119, "เลิกเร่ง" +148).
- Camera: follows the drop: `cam: target (0, 0, 0), yaw 0→4, r 0.15 m, eye 0, f 1200, hy 700`; 8000 px/m at the drop (5 mm = 40 px); façade at 6.15 m ≈ 195 px/m (storey 585 px; at 9 m/s ≈ 58 px/f).
- Staging: F, real. The drop small at frame centre with a white ring marker; a 40-storey condo façade behind scrolls up (balconies, plants, laundry, AC units, lit windows), its speed rising through C11 (+0 slow → +67 fast, the line's end); rain streaks around; an up-arrow under the drop grows with the speed (strong by "ดันกลับแรง" +45). A down arrow "น้ำหนัก" (amber, full length) appears above the drop on **"น้ำหนัก" (+101)**; the up-arrow reaches the same length on **"พอดี" (+119)**; from there the scroll speed is constant. G1 now the real dial (0–50, "30" only, "กม./ชม."): the needle climbs fast, then slower, and **holds at 32 from "เลิกเร่ง" (+148)**. The street appears at the bottom +156–+177 (the last 22 f).
- Key frames: +0 scroll slow; +67 scroll fast; +101 "น้ำหนัก" arrow; +119 arrows equal; +130 LF05; +148 needle holds.
- Sound: M1; A1 −10 dB; `whoosh_shaft-fall-air-rush_01` from +0, gain riding up through C11, steady from +119; S9 `ui_pop_01` at +101 (arrow); S1 ticks slowing +0–+148; S7 brake whoosh-out at +148.

**12. S01-B02-SH03** [929, 1039), 110 f. VO C13 +5–+99 ("สามสิบ" +54). Tail after the line +99–+109 = 11 f (R3.1 11 f: the 10 f the shot grew are inside the line).
- Camera (R3.1 form, as built by Boss W5.2 `camSH12`, re-centred on the word): `ycam: pos (0.0, 1.10, −0.60), f 1100, hy 760`, **yaw tracks the rider: yaw = 180° − 0.75 · atan2(x_rider, 3.8 m)** (yaw 180 = looking at the road, +z; from inside, world +x is screen left); **x_rider = −9.7 m/s · (n − 54)/30** (`riderX`, clock.ts; R3.1 centred at 49) → yaw ≈ 122° at +0, 129° at +27, **180° at +54**, 230° at +82, 238° at +109 (`est` from the formula; the pan is symmetric about the word and spans the same 122° → 238°).
- Staging: B, real. From inside the shelter: GIRL `back` at **(+0.35, 0, −0.10)**, half a step back from her mark under the roof, ≈ 0.6 m from the lens, P01 watching the road (backpack). Because the camera pans past her, she is a foreground wipe: right of centre at +0–+27 (x ≈ 830–990 `est`), **head and shoulders cropped at the left edge at +54**, out of frame left by ≈ +65; the drip curtain at the lip, the road and shophouses beyond. The RIDER (`right` profile) crosses the near lane (z 3.2) left → right on screen (world +x → −x) in a racing tuck at 9.7 m/s, painted +19–+91, centre at +54, spray off both wheels. G2 split dial at the top (0–50, "30", "กม./ชม.", from +5): needle A (amber) rises from +5, **settles at 32 on "สามสิบ" (+54)** with label "เม็ดใหญ่ที่สุด" outside its tip; needle B (pale blue) rises +65–+98 to about 20, label "เม็ดทั่วไป" at +98, no digit; hold +98–+109.
- Key frames: +5 needle A starts; +54 needle A at 32, rider centre (the v8 frame at R3.1 +49 is this frame); +98 needle B settled. Boss frame-checks +0, +27, +82, +95 and +109: road and shophouses in frame, no shelter wall filling it, G2 and both labels on top of the girl's head. Fallback if an end frame fails: halve the tracking (0.375) and hold the yaw outside +27–+82.
- Sound: M1; A1 + A2 under NAR; S8 bike pass +27–+63 (centre +54); S1 ticks on needle A +5–+54 and needle B +65–+98 (softer).

**13. S01-B03-SH01** [1039, 1076), 37 f. VO C14 from +14 ("ไม่ได้" +27; the line runs on into shot 14).
- Camera: follows the drop: `cam: target (0, 0, 0) mm, yaw 0→4 (over the shot), r 12 mm, eye 0, f 1200, hy 760`; 100 px/mm: drop 200 px.
- Staging: M, real; "ภาพจำลอง" in LBL. A small 2 mm drop, round, held in frame; soft bus-stop bokeh behind (white blouse, green posts, lightbox, warm shop light); rain streaks at other depths. A white teardrop icon beside the drop from +0; **red cross on "ไม่ได้" (+27)** (draws +27–+33).
- Key frames: +0 icon; +27 cross.
- Sound: M1 thinned (energy 1.5); macro hush (A1 low-passed −10 dB); S9 `ui_pop_01` at +0; S10 "nope" pluck at +27.

**14. S01-B03-SH02** [1076, 1113), 37 f. VO C14 continues +0–+25 ("หยดน้ำตานะ" from +0).
- Camera: `cam: target (0.25, 2.38, 0.10), yaw 14→16 (over the shot), r 0.10, eye 2.36, f 1200, hy 700` (shot 1 +0 again); `near` 0.02 m.
- Staging: B, real. The pendant teardrops on the fascia, exactly as shot 1 +0; the middle one lets go at +12 and rounds into a ball as it falls out of frame (+12–+24); the rest swell again to the cut (+36).
- Key frames: +0 identical to shot 1 +0; +12 release; +20 round. (Unchanged: the release sits mid-word in "หยดน้ำตานะ", which now runs to +25.)
- Sound: M1; A1 + A2 (closer tin drumming); S11 plip at +28 (off-screen landing).

**15. S01-B03-SH03** [1113, 1221), 108 f. VO C15 +5–+97 ("ก้นแบน" +41, "เบอร์เกอร์" +80). Tail after the line +97–+107 = 11 f (R3.1 11 f; the 9 f the shot grew are inside the line).
- Camera: follows the drop: `cam: target (0, 0, 0) mm, yaw 4→8, r 12→14 mm (both over +0–+107), eye 0.5, f 1200, hy 760`; 100 → 86 px/mm: drop 400 → 343 px.
- Staging: M, real; "ภาพจำลอง" in LBL. A 4 mm drop, round top; three up-arrows rise under it from +10 and press; its bottom flattens (flatness 0 → 0.35 over +10–+41, **reached on "ก้นแบน" (+41)**); a burger-bun outline (white dashed) flashes beside it on **"เบอร์เกอร์" (+80)** and holds to the cut (+107, 28 f).
- Key frames: +10 arrows in; +41 flat bottom; +64 SP1 bun still; +80 bun outline.
- Sound: M1; macro hush; S12 squash +17–+43; S9 `ui_pop_01` at +80.

**16. S01-B04-SH01** [1221, 1332), 111 f. VO C16 +13–+96 ("แต่…" +13, "ใหญ่เท่าลูกบอล" +71, "ลูกบอล" +82).
- Camera: `cam: target (0.25, 1.00, 0.05), yaw −10→−6, r 1.80→1.65 (over the shot), eye 0.80, pitch +12, f 1100, hy 800`; ≈ 611 → 667 px/m: GIRL 758 → 827 px (cut at the shins).
- Staging: B, real, heavier rain (ENV-FALL density ×1.4). GIRL `front` at her mark, P02 (hand to chin), `suspicious` (curious squint), looking up past the lip. **On "ใหญ่เท่าลูกบอล" (+71)** a thought bubble (three small dotted circles from her head to a soft outline; pop +71–+78) shows a 0.22 m ball-sized drop wobbling in the rain over the road at (0.9, 2.1, 1.3), ≈ 140 px.
- Key frames: +13 P02 settles; +71 bubble; +72–+110 the drop wobbles (3 damped wobbles).
- Sound: M1 (pizzicato curiosity, energy 2); A1 + A2 a little louder (heavier rain, +2 dB in gaps); S13 `stinger_pizz-shrug_01` at +13 (on "แต่…"); S9 `ui_pop_01` at +71; S14 wobble +72–+102.

**17. S01-B04-SH02** [1332, 1432), 100 f. VO C17 +7–+90 ("บุ๋ม" +53, "ถุงคว่ำ" +72).
- Camera: +0–+8 push into the bubble (continuation of shot 16's camera, r 1.65 → 1.2 toward the bubble), match-cut at +8 to `cam: target (0, 0, 0) mm, yaw −6→−2 (+8–+99), r 16 mm, eye 1, f 1200, hy 760`; 75 px/mm: drop 375 px.
- Staging: M, real; "ภาพจำลอง" in LBL from +8. A 5 mm drop; stronger up-arrows; its underside hollows up into a bag with a thick rim (hollow 0 → 0.6 of its height +20–+76, ≈ 0.35 on **"บุ๋ม" (+53)**), the film thinning (lighter, more transparent at the dome); an upside-down bag outline (white dashed) flashes beside it on **"ถุงคว่ำ" (+72)** and holds to the cut (+99).
- Key frames: +8 match cut; +53 hollow ≈ 0.35; +72 bag outline; +76 SP1 bag still.
- Sound: M1; macro hush from +8; S15 hollowing creak +20–+64; S9 `ui_pop_01` at +72.

**18. S01-B04-SH03** [1432, 1520), 88 f. VO C18 +4–+75 ("ครึ่งเซน" +25, "ก็" +40, "แตก" +52). Tail after the line +75–+87 = 13 f (R3.1 13 f; the 8 f the shot grew are inside the line).
- Camera: follows the drop until the burst, then holds: `cam: target (0, 0, 0) mm, yaw 0, r 24→27 mm (+0–+52, then held), eye 0, f 1200, hy 700`; 50 → 44 px/mm: ruler 250 → 222 px.
- Staging: M, real; "ภาพจำลอง" in LBL. A 5 mm drop (slightly hollowed, 0.12, before inflating); a white 5 mm ruler bar with end ticks under it at its plane, label **"ส่วนใหญ่ไม่เกินราวครึ่งเซน"** under the bar, both appearing on **"ครึ่งเซน" (+25)** (pop +25–+31); the drop's width matches the bar. The underside balloons into a thin bag +46–+52 (≤ 1.6× width) and **bursts on "แตก" (+52)** into 16 round pieces (`burstFragments`: 2 large node pieces 3.4/3.1 mm, 5 rim drops 1.7–2.3 mm, 9 film droplets 0.3–1.0 mm) that fall away toward the wet pavement plane (±15 mm spread); bar and label stay to the cut.
- Key frames: +25 ruler; +46 inflate starts; +52 burst (SP1 burst still = burst frame); +52–+87 pieces fall (36 f).
- Sound: M1 (lift to 2.5 at the burst); macro hush; S17 `ui_click-tick_01` at +25; **S16 burst at +52 [f1484]** (`water_film-burst-scatter_01`, brief R1.3: one soft wet snap of the film, then about 12 resolved pieces, heavier blips first, brighter plips, the tiny film droplets merging into a fine glassy patter, spreading outward over about 0.4 s, close and dry, no bubbling; a satisfying break). The picture keeps 16 pieces: the ear cannot count 16 events in 0.4 s, so the sound need not match the count.

**19. S01-B05-SH01** [1520, 1605), 85 f. VO C19 +12–+77 ("อากาศ" +39, "ดันกลับแรง" +56).
- Camera: `cam: target (0.25, 0.95, 0.10), yaw +90→+84 (camera at +x looking along −x), r 1.80→1.65 (over the shot), eye 1.00, f 1100, hy 700`; ≈ 611 → 667 px/m: GIRL 758 → 827 px; feet below the band (cut at the shins).
- Staging: B, real, full colour, grade +3 % warmer from +0. GIRL `left` profile at her mark facing the road (screen left); the rain curtain beyond the lip on the left half only (falling rain limited to screen x 0–540, `rainX`, as built), the dry shelter (posts, bench, lightbox glow) on the right; she slowly extends her LEFT arm (the near arm, rig `lArm`), palm up, past the drip line +15–+69 (`new: hand-out-palm-up` → P11); `neutral` → `happy` as the first drop lands at +64.
- Key frames: +15 the hand starts; +42 crossing the drip line (just after "อากาศ" +39, as R3.1 +40 after +37); +64 first drop (8 f after "ดันกลับแรง", as R3.1); +69 P11 held to the cut (+84).
- Sound: M1 (energy 2.5 lift on the refrain); A1 + A2; S19 sleeve at +15 [f1535] (`foley_cotton-sleeve-rustle_01`, a quiet file: Editor checks it is heard under NAR C19 from +12, lifts it up to +6 dB, drops it if it still muddies the line; texture only); S18 first single pat at +64.

**20. S01-B05-SH02** [1605, 1742), 137 f. VO C20 +5–+133 ("มือคุณ" +36, "ถูก" +63, "เบรก" +82, "…ไปกว่านี้" +118).
- Camera: `cam: target (0, 0, 0) cm, yaw 20→26, r 22→20 cm (over the shot), eye +14 cm, pitch −32, f 1200, hy 820`; ≈ 5450 → 6000 px/m: hand ≈ 650 px.
- Staging: H, real, warm. Her open LEFT palm up (`new: palm-up-open`, girl tone; Boss checks the handedness against SH19/SH21: thumb on the hand's outer side), the rain soft beyond with warm bokeh; small drops land irregularly (3–5/s, seeded) from +5, each with a small splash crown; beads stay and gather in the palm.
- Key frames: +5 drops start; +36 splash crowns read clearly ("มือคุณ"); **+118 "…ไปกว่านี้": ending tag starts** [f1723].
- Sound: M1 resolves under the line and ends on a phrase end at **+118–+123 [f1723–f1728]** (≤ 5 f under E1's onset, as R3.1's 5 f overlap; "M1 ends under it"; no fade). **Ton retime needed:** the R3.1 file (34.4 s; phrase end at file 31.88 s) started on f686 reaches that phrase end at f1642 (+37) and runs out at f1718 (+113), 5 f before the tag; Ton extends M1 by one 4-bar phrase (or regenerates it ≥ 37 s, brief R1.4) so a phrase end falls at file 34.57–34.73 s; no time-stretch of the music. Fallback if no phrase end lands: fade M1 out over f1708–f1716 (+103–+111). A1 −4 dB, A2 lower; S18 palm pats +5–+136; **E1 ending tag at +118** (runs into shot 21, rings to ≈ f1794); V02 file starts at +134 [f1739] (0.19 s silent head; voice f1745).

**21. S01-B05-SH03** [1742, 1815), 73 f (unchanged length and locals). V02 giggle +3–+18 [f1745–f1760] (no caption); closed hold +18–+72 (55 f = 1.83 s).
- Camera: `cam: target (0.30, 0.95, 0.15), yaw 15→12, r 1.00→0.94, eye 1.00, pitch −5, f 1100, hy 760` (very slow push over the whole shot); ≈ 1100 → 1170 px/m: head ≈ 340 px.
- Staging: B, real, warm, the rain softening. GIRL `front`; **her own LEFT arm (rig `lArm`, screen right, `palmHeldOut`) held forward from the shoulder, forearm level, the open mitten hand in front of her** with the wet sheen and 3–4 beads (2–3.5 mm) painted on that hand's anchor (`wetBeads`), no separate macro hand (Boss fix 2026-11-09, user bug); the right arm hangs. The palm-up turn is not readable from the front on the mitten hand and is not required here: SH20 has just shown the open wet palm; this shot needs *a hand held out in front of her, visibly wet, and her eyes on it*. Hand position (R3.1, brief's GIRL mark): ≈ (0.35, 0.85, 0.45) m, screen y ≈ 900–1000 `est`, clear of the band by ≥ 160 px; the `fix3` build holds it lower, in front of her belly (≈ 80 px above the band at +70), which reads as a hand on her tummy: Boss raises it toward chest height and forward. Her face above; she looks at the hand, `happy` → `laugh` (shoulders lift) +3–+18 → back to `happy` by +24; the rain keeps falling, lighter, through the hold (plate-owned motion, no freeze).
- Key frames: +3 laugh; +24 back to `happy`; +72 last frame (closed).
- Sound: E1 rings out (to ≈ +52); V02 voice +3–+18 (Editor TTS take, picked); S18 pats sparser; A1 and A2 fade to zero by +72; no loop seam.
- Entry → exit: +0 smile at the wet palm, rain → +72 same pose, `happy`, sound at zero.

## Acceptance (timed checks for W5.3/W6)

| Frame (global / shot-local) | Observable | Evidence |
| --- | --- | --- |
| f55 / SH01 +55 | grade, rain and A1/A2 die on "อากาศ" | draft frame + waveform |
| f144 / SH02 +76 | needle starts its 4 f snap on "เจ็ดร้อย" | frame pair 143/144 |
| f553 / SH07 +95 | slam 700, R1 stops; f554–f563 silent; f564 white | frames + audio |
| f653 / SH09 +9 | V01 voice onset; flinch from +6 | waveform |
| f686 / SH10 +0 | colour and rain back on one frame | frame pair 685/686 |
| f870 / SH11 +119 | arrows equal; f899 (+148) needle holds at 32 | frames |
| f929–f1038 / SH12 | rider left → right with the pan, centre and needle A at 32 on "สามสิบ" +54 [f983]; G2 readable; frames +0, +27, +54, +82, +95, +109 | frames |
| f1484 / SH18 +52 | burst frame; 16 pieces; S16 onset | frame + waveform |
| f1520–f1604 / SH19 | road and rain on screen left, her near (left) arm goes out; first drop +64 | frames +15, +42, +75 |
| f411 / SH06 +19 | R1 onset (R4.1: 142 f before the slam; R3.1 cue sheet f365, retime by Ton); f553/f554 R1 cut dead | waveform |
| f1723 / SH20 +118 | E1 tag onset on "…ไปกว่านี้"; M1 phrase end in f1723–f1728 under it (needs Ton's M1 extension, R3.1 f1589) | waveform |
| f1742–f1814 / SH21 | held-out left hand wet and above y 1160 (≈ 900–1000), her eyes on it | frames +5, +40, +70 + `caption-zone.py` |
| f1745 / SH21 +3 | V02 onset; f1814 last frame, sound at zero | waveform |
| all | no caption overlaps faces/diagram text (y ≤ 1160); `scripts/caption-zone.py` within defaults | qa-sheet + caption-zone |

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss (W5.2) | N1–N15 in the brief ([New assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies-w52)); **N16 vendor dropped** (user, 2026-11-09): remove `paintVendor` from the shot compositions (shots-d.tsx imports and paints it) and leave the food cart empty; spikes SP2–SP4 | built (draft, not user-approved, 2026-11-09) |
| Boss (W5.2) | `dropStateFor` retimed to R3.0 (bun `smooth(10, 38)`, burst +46) | done 2026-11-09 |
| Boss (fix) | SH12 frame check at +0, +22, +77, +90, +99 (SH12 Key frames) | open |
| Boss (fix) | SH21: raise the held-out left hand to ≈ (0.35, 0.85, 0.45) m, screen y ≈ 900–1000, beads readable in a 540 px view (SH21 Staging) | open |
| Boss (check) | SH20 macro hand is a LEFT hand; LF03 v8 label at SH05 +30 | open |
| Ton (W5.2s) | cue sheet [sound-cues.json](sound-cues.json) for ROWS-R3.0 (frames unchanged in R3.1; **R4.0/R4.1 move every frame after f0: the cue sheet needs Ton's retime to the R4.1 sound lines and has not been touched; M1 needs a one-phrase extension, see the retime list**). R3.1 decisions (frames are R3.1; R4.1 equivalents in the retime list): Q-T1 M1 end f1589 accepted (SH20); Q-T2 R1 at f365 accepted, hard cut at f507 (SH06/SH07); Q-T3 S16 ≈ 12 pieces over 0.4 s accepted, brief R1.3 (SH18); Q-T4 S19 is an Editor mix check (SH19). Nothing to regenerate | done (not listened) |
| Editor (W5.3) | see **W5.3 build list** below | open |
| Editor / Boss | R4.1 retime of what was built on R3.1: `src/videos/edu-ep14` timeline and `public/narration/EDU-EP14-SHORT-narration-v1.wav` (1674 f; [narration-place.py](narration-place.py) hardcodes TOTAL, f594, f1598 and the unslowed read; V02 file start is f1739), Boss shot code per the [R4.1 retime list](#r41-retime-list-boss-and-ton) | open (R4.1 ready) |
| Film | R4.1 re-peg of R4.0 | done 2026-11-10 (ROWS-R4.1, BRIEF-R1.4) |
| User | Q-F5: accept 60.50 s or trim the closed hold 15 f to 60.00 s ([Open questions](#open-questions)) | open |
| Coordinator | retime review-rows.json to ROWS-R4.1 (all 21 shots' frames) and update the text of SH01, SH03, SH08, SH09, SH12, SH19, SH20, SH21 to R3.1/R4.1; republish with the next review round; ask Q-F5 | open |
| Boat | picture checks B-P1–B-P8 (brief, Handoff) | open |

### W5.3 build list (Editor)

1. Create `src/videos/edu-ep14` (timeline, 1815 f, 30 fps, 1080×1920) and register it per [README](../../../README.md#videos-and-parallel-work); place the 21 Boss shot compositions `EDU14-<shot id>` on the shot map ranges exactly; hard cuts only (f55 grade hit and f686 colour cut live inside shots 1 and 10).
2. Narration: the **slowed** Kore read (`projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav`, 56.15 s) placed by [measure.json](measure.json) `lock` (offsets 0.35 / 0.8567 / 2.14 s; cut at the W700 and V01 silences, mid-gap read 17.7925 s and 20.5125 s); V01 Leda a from f647 (head trimmed to 0.17 s, voice f653); V02 Leda a from f1739 (SH20 +134, 0.19 s silent head; voice f1745; listen to the 1.24 s blip, cut it if a click). Captions = the cue table (C01–C20 incl. C09 for V01), edu stroke style; no caption for V02 or W700.
3. On-screen text per the global ranges and R01–R04 (Boss's compositions carry the gauges and labels; Editor checks the ranges, it does not repaint them).
4. Sound: run [lock-sounds.sh](lock-sounds.sh) once the folder exists, then place all 46 cues of Ton's **R4.1-retimed** [sound-cues.json](sound-cues.json) as written, with the R4.1 frames: R1 from f411, hard cut at the f553/f554 boundary, D1 and all layers out f554–f564; M1 from f686 (Ton's extended file), ending on a phrase end in f1723–f1728 (no fade; fallback fade f1708–f1716 if no phrase end lands or it clashes with E1); S16 at f1484; S19 at f1535 checked in the mix (lift ≤ +6 dB or drop); A1/A2 hard cut at f55, back at f686, fade to zero by f1814.
5. Proof: the half-size draft cut through `scripts/render.mjs` scene by scene ([render stage](../../../docs/render-rules.md#render-stage)), then the acceptance table above checked with a `scripts/qa-sheet.sh` sheet, `scripts/caption-zone.py` and waveforms; listen to the whole mix once (nothing has been listened yet).

Element captures: SP1 stills `~/ReelsStore/projects/EDU-EP14-SHORT/look-frames/` and LF01–LF05 v8 `projects/EDU/previews/look-frames/ep14/` (store); W5.2 build frames `out/edu14/build/v8/` (sheet archived to the store by Boss), SH19/SH21 fix `out/edu14/build/ep14-sh19-21-fix.png` and `out/edu14/build/fix3/` (worktree only; viewed in this pass at 480–900 px). Limits: SH12 seen at +49 only after the camera fix; SH21 seen at +5/+40/+70 (crop at +70).

### R4.1 retime list (Boss and Ton)

Shot-local frames R3.1 → R4.1 that the built code or the cue sheet carries (code names from `src/painted/edu14/` at this checkout, read only; Boss owns the edit). Every shot also takes its new length from the shot map (`clock.ts` `SHOT_TABLE`, `TOTAL_FRAMES` 1674 → 1815) and any `L / (len − 1)` camera normalisation (e.g. `camSH01` `L / 62` → `L / 67`, `camSH03` `L / 79` → `L / 87`). SH09 and SH21 have no frame change.

| Shot | Picture (Boss) | Sound (Ton) |
| --- | --- | --- |
| 1 | `HIT` 51 → 55 (grade +55–+63, LBL from +56); pull-back ease 16–46 → 16–50 (`moveSH01` ease, `camSH01` hy) | A1/A2 cut f51 → f55; D1 in +54 → +58 |
| 2 | `noairSH02` snap 68–72 → 76–80, rewind 82–95 → 90–103 | S1 run +76–+80; S2 +90 |
| 3 | crane ease 0–74 → 0–82; the `up` ramp 30–70 → 33–77 | none |
| 4 | swell to full +14 → +15, release +16 → +17, gone +28 → +29 (`drop.ts` pendant states) | S3 +17 |
| 5 | `SH05` bracket 6–16 → 8–18, dotted 16–26 → 18–29, pin 26 → 29, label 29 → 33, ring 54 → 60; `camSH05` lin 0–54 → 0–60 | S1 +29, +33 |
| 6 | `noairSH06` 350 at 59 → 65 | **R1 f365 → f411 (+19)** |
| 7 | `H_KEYS` [[0,1150],[26,1000],[76,30],[95,2.4]], clamp 89 → 95; `noairSH07` 41 → 43, 89 → 95; `slamScale` 89–93 → 95–99; white frame 100 → 106 | S4 +26; R1 hard cut f553/f554; silence +96–+106 |
| 8 | sting glyphs 22–28 → 24–30, 51–57 → 56–62; arc end 71 → 78 | S5 +24, +56 |
| 10 | hero states shift +6 → +7 (release 22 → 24, gone 34 → 36) | A1/A2 + M1 in at f686; S3 +24 |
| 11 | `SH11` weightAt 93 → 101, equalAt 109 → 119, holdAt 135 → 148; `upArrow` 0–109 → 0–119; `scrollSpeed` 0–60 → 0–67; `realSH11` 0–135 → 0–148; street 143–162 → 156–177 | S9 +101; whoosh steady +119; S7 +148 |
| 12 | `riderX` centre 49 → 54; rider painted 14–86 → 19–91; `splitA` 5–49 → 5–54; `splitB` 60–88 → 65–98, `showB` from 65; frame checks +0, +27, +54, +82, +95, +109 | S8 +27–+63; ticks +5–+54, +65–+98 |
| 13 | cross 26–32 → 27–33; yaw ramp 0–34 → 0–36 | S10 +27 |
| 14 | none (release +12 kept); camera normalisation to 37 f | S11 +28 (unchanged local) |
| 15 | `dropStateFor` bun `smooth(10, 38)` → `smooth(10, 41)`; outline 72 → 80 (pop 80–86); scale/yaw ramps 0–98 → 0–107 | S12 +17–+43; S9 +80 |
| 16 | bubble pop 65–72 → 71–78; wobble from +66 → +72 | S9 +71; S14 +72–+102 |
| 17 | `dropStateFor` bag `smooth(20, 70)` → `smooth(20, 76)`; outline 66 → 72 (pop 72–78); macro yaw 8–91 → 8–99 | S15 +20–+64; S9 +72 |
| 18 | `dropStateFor` inflate `smooth(40, 46)` → `smooth(46, 52)`, burst 46 → 52 (`burstF = L − 52`); zoom 0–46 → 0–52; ruler 22–28 → 25–31 | S17 +25; S16 f1364 → f1484 (+52) |
| 19 | `hand-out-palm-up` +15–+65 → +15–+69, drip-line crossing +40 → +42, first drop +60 → +64 (`girl-motions.ts`) | S19 f1535; S18 +64 |
| 20 | length only (seeded drops run to +136) | **M1**: extend by one 4-bar phrase or regenerate ≥ 37 s so a phrase end falls at file 34.57–34.73 s (f1723–f1728); E1 f1584 → f1723; V02 file f1598 → f1739 |

### Open questions

User-owned, answered 2026-11-09 (recommended options; kept for the record): Q-F1 open on the lip close; Q-F2 the hit on "ไม่มีอากาศ"; Q-F3 the time freeze with the BB; Q-F4 Thai school uniform with a red backpack.

**Q-F5 (open, user; for the coordinator to ask): 60.50 s is 0.50 s over the 40–60 s Short target (limit 63 s passes).**
- **(a) Accept 60.50 s (Film recommends).** The target is a Default and the rule forbids speeding narration to fit ([production requirements](../../../docs/production-requirements.md), duration defaults); the overrun is the user's own slowed read. The closing beat (tag on "…ไปกว่านี้" f1723) holds 92 f = 3.07 s to the end, matching the ~3 s closing-hold rule, and the closed hold after the giggle stays 55 f = 1.83 s (brief ~2 s).
- **(b) Trim the closed hold 15 f: SH21 73 → 58 f, total 1800 f = 60.00 s.** Nothing else moves (no narration gap, no story beat). Cost: the closing beat holds 77 f = 2.57 s, the hold after the giggle 40 f = 1.33 s, E1 rings to ≈ f1794 with 6 f spare, and A1/A2 must reach zero by f1799.
- Not offered: trimming shot tails inside the read (SH12/SH15/SH18 tails are the read's own pauses, 11/11/13 f; cutting them means re-cutting the narration gaps the user just chose).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP14-ROWS-R1.0 | 2026-11-09 | Film | First storyboard pass (W2) from script R4, brief R1 and the W1.4 measured read: 21 shots, est 56.70 s (1701 f), rules R01–R08, per-shot camera, staging, key frames and sound; rows file untimed; open questions Q-F1–Q-F4. |
| EDU-EP14-ROWS-R2.0 | 2026-11-09 | Editor | W4 voice lock: frames, start s and lengths of all 21 shots measured from the locked R4 read (reused W1.4 read, no new request); word-pegged key-frame table; line placement measured. Staging, cameras, text and sound untouched. Total 1701 f. |
| EDU-EP14-ROWS-R3.0 | 2026-11-09 | Film | W5.1 timed scene sheet. **Timing decision:** the three 0.30 s beat gaps (B02→B03, B03→B04, B04→B05) removed: the read's own pauses there are 0.79–0.85 s, enough for each beat change, and the user asked for shorter pauses; −27 f, **1701 → 1674 f (56.70 → 55.80 s)**; shots 13–21 move −9/−18/−27 f; SH12 109 → 100 f, SH15 108 → 99 f, SH18 89 → 80 f (each loses only tail hold: needle B hold 11 f, bun hold 26 f, pieces fall 33 f). Ending kept at 73 f: with the measured V02 take (15 f, not the planned 21 f) the closed hold after the giggle is 55 f = 1.83 s (brief ~2 s), enough for E1 to ring out. **Key frames:** every word-sitting key frame set from the measured read, including ones R2.0 missed: SH07 500 +48 → +41, SH10 release +20 → +22 on "โลกจริง", SH11 "น้ำหนัก" arrow +79 → +93 (now on its word), "พอดี" +117 → +109, "เลิกเร่ง" +138 → +135, SH12 needle A/rider +47 → +49; R2.0 values applied to SH02 (+59 → +68 and the hold/rewind after it), SH04 (+20 → +16, swell and exit moved with it), SH05 (label +38 → +29; bracket, line and pin compressed to +6–+16, +16–+26, +26), SH08, SH13, SH15 (flat +41 → +38, squash S12 +17–+40), SH16 (+61 → +65), SH17, SH18 (burst +44 → +46 on "แตก", inflate +40–+46), SH20 (tag +113 → +106, M1 phrase end +110 → +103). Out-of-range R1.0 frames fixed: SH03 roof +55 → +51, cloud fill +86 → +74 (shot is 80 f); SH06 dial 350 at +59; SH07 hold +90–+99 and white +100; SH08 arc end +71. SH07 altitude curve now constrained by h(+25) = 1000 m and h(+70) ≈ 30 m. **New sections:** voice and subtitle cue table, on-screen text ranges, acceptance table; girl takes measured (V01 13 f, V02 15 f) with placement and head trims. S18 staging and S16 sound now describe the 16 burst pieces (were "8–12 small round drops", R1 leftover). R06 saturation stated as the measured absolute 0.078 (user, LF02). [measure-lock.py](measure-lock.py) and [measure.json](measure.json) `lock` updated to R3.0 (R2.0 lock kept under `previous.lock_R2.0`; 18 more word anchors from a re-run of the same Whisper pass). Staging, cameras, casting and on-screen text otherwise unchanged. |
| EDU-EP14-ROWS-R3.1 | 2026-11-09 | Film | W5.2 fold-in, **timing unchanged (1674 f)**. User decisions applied: the sting arm is the girl's **LEFT** arm (rig `lArm`; visor, sting and hand-out arm; screen right in `front`, the near arm in the `left` profile): casting, R08, SH01, SH08, SH09 (now the right hand covers the spot), SH19, SH20, SH21; **N16 vendor dropped**: casting row removed, R06 and SH03 no longer mention her, Boss removes `paintVendor`. Boss's staging accepted as the new plan: **SH12** girl at (+0.35, 0, −0.10) and the camera yaw tracking the rider (180° − 0.75 · atan2(x, 3.8), ≈ 123° → 238°), because R3.0 was self-contradictory (−0.35 is screen right from inside the shelter, and yaw 205→155 pans against a left → right rider); the girl becomes a foreground wipe as the camera pans past her; no continuity break (no cut-adjacent shot shows her; half a step from her mark, recorded as the R08 exception). **SH19** yaw +90→+84: the R3.0 text said "camera at +x" but −90 is at −x and puts the road on screen right; +90 gives road left, her left profile and her left arm as the near arm, matching the LEFT decision; rain limited to the left half as already planned. **SH21** her own held-out left arm (no overlay) accepted; mitten palm-up not required in this shot (SH20 shows it); the hand must sit at the brief's ≈ (0.35, 0.85, 0.45) m, higher than the fix3 build (Boss fix). Ton: R1 start +7 [f365] accepted with a hard cut at f507; M1 phrase end f1589 accepted (5 f under E1); S16 ≈ 12 audible pieces over 0.4 s accepted (picture stays 16; brief R1.3); S19 left to the Editor's mix check. New W5.3 build list; acceptance rows for SH06/R1, SH12, SH19, SH21; brief → R1.3. review-rows.json not edited in this pass. |
| EDU-EP14-ROWS-R4.0 | 2026-11-10 | Editor | W4 re-lock on the user-picked slowed read (locked R4 Kore read, speech atempo 0.90, gaps and lead-in 0.95, no new Gemini request; [narration-slow.py](narration-slow.py), store `projects/EDU/audio/2026-11-09_ep14-r4-nar-kore-s090-g095.wav`, 56.15 s). Line edges and word anchors re-measured/mapped ([measure.json](measure.json), method in `lock.method`); old lock kept in `previous.lock_R3.0`. Structure kept: lead-in 0.35 s, W700 slot 30 f, V01 slot 42 f, V02 shot L15 end + 4 f (73 f), beat gaps 0, girl takes unchanged (Leda a). **1674 → 1815 f (55.80 → 60.50 s)**, +141 f. Shot starts (R3.1 → R4.0, shift): SH01 0 → 0 (+0), SH02 63 → 68 (+5), SH03 180 → 197 (+17), SH04 260 → 285 (+25), SH05 303 → 331 (+28), SH06 358 → 392 (+34), SH07 418 → 458 (+40), SH08 519 → 565 (+46), SH09 591 → 644 (+53), SH10 633 → 686 (+53), SH11 693 → 751 (+58), SH12 856 → 929 (+73), SH13 956 → 1039 (+83), SH14 991 → 1076 (+85), SH15 1025 → 1113 (+88), SH16 1124 → 1221 (+97), SH17 1226 → 1332 (+106), SH18 1318 → 1432 (+114), SH19 1398 → 1520 (+122), SH20 1478 → 1605 (+127), SH21 1601 → 1742 (+141). Cue table, word-pegged table, on-screen ranges, acceptance and build list re-timed; Film's staging, cameras, sound lines and shot-local key frames untouched (R3.1 text), the review rows and cue sheet untouched. |
| EDU-EP14-ROWS-R4.1 | 2026-11-10 | Film | Re-peg of R4.0 (timing unchanged: 1815 f = 60.50 s). Every per-shot staging block now uses the R4.0 shot ranges and shot-local frames: word-sitting frames from the word-pegged table; frames tied to a word or beat keep their R3.1 distance to it (SH01 ease end +50 and LF01 +52 before the hit +55; SH07 LF04 +76 and the lip/slam +95 keep 19 f / 0 f to the slam; SH19 drip-line crossing +42 and first drop +64 keep 3 f / 8 f after their words); frames pacing a camera move or ramp scale with their shot or line (SH03 crane +0–+82, roof +56, LF02 +22; SH05 ring +60; SH11 street +156–+177; SH17 hollow +20–+76). Checked: shots 12, 15 and 18 grew 10/9/8 f **inside the spoken line**; their tail holds after the line are unchanged (11/11/13 f); the closed hold stays 55 f; voice pins V01 f653 (SH09 +9) and V02 f1745 (SH21 +3) kept. Fixes to R4.0: V02 cue row [1604, 1619) → [1745, 1760); V02 file start f1742 → **f1739** (0.19 s head = 6 f, else the voice lands at f1748); R1 onset f399 → **f411** (the 142.5 f file must peak on the slam f553; the slam moved +46, not +34); SH12 rider centre +49 → +54 with the frame checks +0/+27/+54/+82/+95/+109; acceptance and W5.3 sound frames retimed (A1/A2 f55/f686, R1 cut f553/f554, S16 f1484, S19 f1535, fade by f1814). New: [R4.1 retime list](#r41-retime-list-boss-and-ton) for Boss's shot code and Ton's cue sheet; **M1 is 81 f short** (its 31.88 s phrase end now falls at f1642) and needs a one-phrase extension (brief R1.4). Q-F5 (60.50 s vs 60.00 s) added for the user. Nothing listened. review-rows.json, sound-cues.json, measure.json, src/ and the script not touched. Brief → R1.4. |
