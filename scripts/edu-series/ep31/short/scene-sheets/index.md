# E31-C01-S01 — timed scene-sheet index (EDU-EP31-SHORT)

Deliverable: `EDU-EP31-SHORT` · Revision: **`EDU-EP31-SCENE-R2`** (B01 retime to L01 c1, VOICE-R1.3; every other shot as SCENE-R1) · Status: **ready-for-dev** · Timing: **checked-with-audio** (measured on the voice-lock files; no blockout yet)
Inputs: script [EDU-EP31-SCRIPT-R2](../script.md) (user-confirmed W1.5; not edited) + fact-check [EDU-EP31-FACT-R1 + Rechecks R2, R3, R5, R6](../fact-check.md) (no must-fix; constraints RC3-01, RC5-01, RC5-02, RC6-01..06 honoured below; RC6-02 declined by the user) · brief [EDU-EP31-BRIEF-R6](../film-brief.md) (VD31-01..VD31-19, set plans K/K2, H, T, V, N, P, R) · storyboard [EDU-EP31-BOARD-R6](../storyboard.md) (24 shots, passed 24/24 by the user on ROWS-R6, locked) · voice lock [EDU-EP31-VOICE-R1](../voice-lock.md) (user-approved W4.3; [voice-timing.json](../voice-timing.json), [voice-anchors-R1.txt](../voice-anchors-R1.txt); L01 replaced by candidate c1, VOICE-R1.3 amendment, [voice-anchors-R2.txt](../voice-anchors-R2.txt)) · delivery record [../../delivery.md](../../delivery.md) · channel `edu` ([channel.md](../../../../../channels/edu/channel.md); no `look.md` or `edit.md`)
Target: branch `claude/ep31-storyboard-publish-1a0b7c` at `96b7851` plus the look code in `src/painted/edu31/` · **30 fps** · **durationFrames 1795** (59.82 s) · 1080 × 1920 · composition offset 0 (one story scene = the whole Short)
Evidence: runtime unverified (no plate, no blockout) · render/samples none · audio sync: every frame below is measured from VOICE-R1 (envelope edges from `voice-anchors-R1.txt`, ±1 f; word onsets inside a phrase from a Whisper word pass on the same line files, [voice-words-R1.txt](../voice-words-R1.txt), ±3 f, marked `±3`) · projection: `scripts/shot-projection.py` run on every world shot ([projection-run.py](../projection-run.py) over [projection-shots.json](../projection-shots.json), output [projection-R1.txt](../projection-R1.txt); SCENE-R2 rerun [projection-R2.txt](../projection-R2.txt), only B01-SH02 changed) · user approval: none recorded for this revision (the storyboard pass covers ROWS-R6 content, not these sheets)

Shot sheets: [b01.md](b01.md) (B01, 4 shots) · [b02.md](b02.md) (B02, 3) · [b03.md](b03.md) (B03, 5) · [b04.md](b04.md) (B04, 3) · [b05.md](b05.md) (B05, 4) · [b06.md](b06.md) (B06, 2) · [b07.md](b07.md) (B07, 3). User rows: [../review-rows.json](../review-rows.json) `EDU-EP31-ROWS-R8` (R6 content unchanged; R8 changes only B01-SH01..SH03 `start`/`end`; review page: pending).

## Units and conventions

- **Clocks.** Composition-global = scene-local (offset 0). Shot-local (`L`) = global − shot start. Ranges are half-open `[start, endExclusive)`. Frame of a time t = `int(t × 30 + 0.5)`.
- **Spaces** (brief: [set plans](../film-brief.md#set-plans-metres-estimates)): K bank lobby (K2 its recolour), H Wheeler's kitchen, T som tam stall today, V TV corner, N news studio (a 4:3 picture inside the TV), P police room and phone-desk insert, R reveal table (tabletop space, y 0 = table top). Metres, +y up, +z toward each space's master camera. Shot blocks add only shot values.
- **Camera lines** use the kit `YCam` (`src/painted/kit/ycam.ts`; scene helper `cam(x, y, z, yawDeg, pitchDeg, f, hy)` in `src/painted/edu31/looks.ts`): `eye (x, y, z)` m, `yaw` deg (0 looks −z, + toward +x; 180 looks +z, −90 looks −x), `pitch` deg (+ up), `f` px at 1080 × 1920, `hy` principal row. A move interpolates every field with ease-in-out unless the block says otherwise. The plate owns the camera; picture-stage effects (CCTV stutter, step zoom crop, CRT roll, whip smear) are screen layers owned by the plate overlay (DF-20261030-painted-screen-layers-overlay).
- **Projection check.** Every world shot's lead and key props were run through `shot-projection.py` at the brief's size baseline (Wheeler 1.78 m standing, seated head top 1.25 m; YOU 1.58 m). Lead px = the tool's feet-to-head span (seated: floor-to-head; waist crop: waist-to-head, marked). Results are recorded per shot; values marked `est` were not run.
- **Screen space**: px, origin top-left, Y down.
- **Captions (user, 2026-11-21; memory [caption-size-ep26-default](../../../../../docs/memory/caption-size-ep26-default.md)).** EDU-EP26 size: `CAPTION_SCALE = 1.4` on the 51 px portrait caption = **71.4 px**, edu outline unchanged; safe box **x 120–888**, bottom edge at or above **y 1344**; shorter, more frequent cards. Planned caption band **y 1100–1344** (a two-line card, about 2 × 118 px); a one-line card sits about y 1226–1344. Faces, hands acting, hero props, the CCTV timestamp, the joke label and the reconstruction label stay out of y 1100–1344 in every shot (projection rows below). Each shot block gives a **suggested card split** (Thai text verbatim from SCRIPT-R2, one line per card unless marked `2 lines`, at most about 18 spacing glyphs, never splitting a word, each card ≥ 15 f, running to the next card's onset); Editor owns the final split and checks the widest card with `scripts/caption-zone.py`. Bold lines (script): L01, L06, L12, L15.
- **Caption-zone measure.** Bright sets failed the 0.25 default at W3 (LF01, LF02, LF03, LF04, LF06); Editor picks the lightest CaptionShade that reads at the Draft and records the band and thresholds used (`--band 1100:1344`). Not a Film value.
- **Chrome** on every frame 0–1794: `@TamMaiLa` top-left and "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ภาพจริง" under it, outside every screen layer (VD31-17); keep picture text and the joke label below y 140. Not repeated in the shot blocks.
- **Joke label** (VD31-12 plate with the VD31-19 text): **"เหตุการณ์สมมุติ: กล้องดันพังพอดี"**, exact (`JOKE_LABEL` in `looks.ts`), cream Thai text on a dark translucent rounded plate with a soft pop-in; only in **B03-SH04** (whole shot) and **B07-SH01** (from the camera's settle, with an arrow). Not in B03-SH01/SH02 (user declined RC6-02, 2026-11-21) and not in B07-SH02/SH03. The wording change from "มุกของเรา" to "สมมุติ" has **not been rechecked by Boat** (open item O1).
- **Clocks for motion**: walks, CCTV stutter and noise band, CRT flicker, fluorescent hum flicker and the lamp hum on the ambient clock; story events (whip, head turns, slam, flash sputter, print develop, zoom steps, freeze, calendar flips, click-on, door shut, slide, cheek touch, camera moves, lemon tip) on the story (shot) clock ([DF-20261030-painted-story-hold-ambient-clock](../../../../../docs/dev-findings.md#df-20261030-painted-story-hold-ambient-clock)).
- **Casting lines** follow [storyboard: cast and continuity](../storyboard.md#cast-and-continuity); shot blocks name the pose and expression per shot.
- **Mix**: NARR on top, music ducked about 14 dB under VO (brief: sound direction); the shot blocks name only state changes. No SFX onset on a key word unless the block says so.

## Voice anchors (measured, VOICE-R1; L01 from VOICE-R1.3)

Global frames. Plain values are envelope edges from `voice-anchors-R1.txt` (±1 f); `±3` marks a Whisper word onset.

| Line | Speech [on, off) | Anchors used by the sheets |
| --- | --- | --- |
| L01 NARR (c1, R2) | [0, 226) | "ปี 1995" 0 · pause 41–46 · "ผู้ชายคนนี้กับเพื่อน" 46 (word 47) · pause 79–86 · "ปล้นธนาคาร" 86 · "สองแห่ง" 103 · "ในวันเดียว" 115 · pause 132–139 · "ไม่ใส่หน้ากาก" 139 (word 140) · "เลย…" 157 · pause 164–172 · "เพราะ" 172 (syllable 174) · "เขา" 177 · "น้ำมะนาว" 190 · "นาว" 197 · "ที่หน้า" 203 / "หน้า" ≈ 205 · "ไว้" 211 · "แล้ว" 215 (word onsets from the VOICE-R1.3 word pass, ±3; R1 values in the change log) |
| L02 NARR | [236, 326) | "น้ำมะนาว" 236 · pause 260–273 · "ใช่" 278 · pause 288–292 · "ที่บีบใส่" 292 / "บีบ" 296 ±3 · "ส้มตำ" 306 ±3 · "นั่นแหละ" 315 ±3 |
| L03 NARR | [335, 492) | "แมคอาเธอร์ วีลเลอร์" 335 · "ได้สูตร" 367 ±3 · pause 392–404 · "น้ำมะนาวเป็นหมึกล่องหน" 404 · pause 440–449 · "ทาหน้าแล้ว" 449 · "กล้อง" 469 · "มองไม่เห็น" 473 ±3 |
| L04 NARR | [506, 594) | "จริงนะ…" 506 · pause 518–521 · "บนกระดาษ" 521 · pause 538–547 · "แต่หน้าคน" 547 · "ไม่ใช่กระดาษ" 564 ±3 · "จ้ะ" 588 |
| L05 NARR | [605, 734) | "ตอนแรกเขาก็ไม่เชื่อหรอก" 605 · pause 635–642 · "เลย" 642 · "ทดสอบ" 644 ±3 ("สอบ" 650 ±3) · pause 665–674 · "ทาน้ำมะนาว" 674 · pause 699–704 · "ถ่ายโพลารอยด์ตัวเอง" 704 |
| L06 NARR | [743, 800) | "รูปออกมา…" 743 · pause 759–768 · "ไม่มี" 768 · "เขา" 778 ±3 · "จริง ๆ" 786 ±3 |
| L07 NARR | [810, 895) | "ผลทดสอบ…" 810 · pause 825–834 · "ผ่าน!" 834 · pause 845–860 · "ได้เวลาไป" 860 · "ปล้น" 873 ±3 |
| L08 NARR | [903, 1022) | "เราเปิดกล้องหน้า" 903 · "ยัง" 926 ±3 · pause 929–936 · "หามุมก่อน…" 936 · pause 950–962 · "เขาให้กล้องธนาคาร" 962 · "ถ่าย" 989 ±3 · "หน้า" 996 ±3 · "เต็ม" 1004 ±3 |
| L09 NARR | [1029, 1145) | "แล้วก็…" 1029 · pause 1041–1058 · "รอดไป" 1058 · "สามเดือนครึ่ง" 1065 ±3 · pause 1086–1099 · "น้ำมะนาวได้ผล" 1099 · "เหรอเนี่ย" 1134 ±3 |
| L10 NARR | [1154, 1232) | "จนเดือนเมษา" 1154 · "ภาพจากกล้องธนาคาร" 1176 ±3 · "ขึ้นข่าว" 1200 ±3 · "ห้าทุ่ม" 1217 ±3 (no pause in the line) |
| L11 ANCHOR | [1243, 1301) | "ใครจำ" 1243 · "ชายคนนี้" 1255 ±3 · pause 1276–1280 · "แจ้งตำรวจเลยครับ" 1280 |
| L12 NARR | [1308, 1367) | "ไม่ถึงชั่วโมง…" 1308 · pause 1329–1337 · "ตำรวจ" 1337 · "จับได้แล้ว" 1349 |
| L13 POLICE | [1377, 1413) | "นี่คุณ" 1377 · pause 1387–1395 · "ใช่ไหม" 1395 |
| L14 WHEELER | [1419, 1516) | "แต่" 1419 · pause 1422–1434 · "ผมทาน้ำมะนาวแล้วนะ…" 1434 · pause 1476–1488 · "ผมทาน้ำมะนาวแล้ว" 1488 |
| L15 NARR | [1523, 1733) | "นักจิตวิทยาคนหนึ่ง" 1523 · "อ่าน" 1554 ±3 · "เรื่องนี้" 1560 ±3 · pause 1573–1579 · "ถึงกับไปวิจัยเลยว่า" 1579 · pause 1612–1615 · "ทำไมคนถึงมั่นใจ" 1615 · "ได้" 1652 ±3 · "ขนาดนี้" 1658 ±3 · pause 1671–1679 · "ทั้งที่เรื่องนั้น…" 1679 · pause 1698–1707 · "ไม่ได้รู้" 1707 · "จริงเลย" 1718 ±3 |

Speech ends 1733 (57.77 s); hold [1735, 1795) = 2.0 s; last frame 1794.

## Shot map

Cuts sit 3 f before the next line's onset unless the shot says otherwise. Claim/clue IDs from SCRIPT-R2 and the fact-check.

| Shot | Line(s) | Global [start, end) | f | Space | Claims / clues | Runtime |
| --- | --- | --- | ---: | --- | --- | --- |
| B01-SH01 | L01a | [0, 83) | 83 | K | F001 (year, two robbers), CL03 plant | planned |
| B01-SH02 | L01b | [83, 169) | 86 | K → K2 | F001 (two banks, one day, no mask) | planned |
| B01-SH03 | L01c | [169, 233) | 64 | K2 | CL03 (lemon on the face) | planned |
| B01-SH04 | L02 | [233, 332) | 99 | T | joke topper | planned |
| B02-SH01 | L03a | [332, 401) | 69 | H | name (subtitle only, FC06), tip from a friend | planned |
| B02-SH02 | L03b | [401, 503) | 102 | H | his belief (marked as imagination) | planned |
| B02-SH03 | L04 | [503, 602) | 99 | H | lemon juice as invisible ink (true on paper) | planned |
| B03-SH01 | L05a | [602, 671) | 69 | H | test; R6 gag plant (camera breaks, no text) | planned |
| B03-SH02 | L05b | [671, 740) | 69 | H | Polaroid self-test | planned |
| B03-SH03 | L06 | [740, 803) | 63 | H | F006 (no him in the print), CL02 | planned |
| B03-SH04 | L07a | [803, 857) | 54 | H | labelled gag (VD31-19) | planned |
| B03-SH05 | L07b | [857, 900) | 43 | H | narrator's heist voice | planned |
| B04-SH01 | L08a | [900, 959) | 59 | T | today comparison | planned |
| B04-SH02 | L08b | [959, 1026) | 67 | K (CCTV) | F009 (bank camera recorded his face), FC07 date | planned |
| B04-SH03 | L09 | [1026, 1151) | 125 | H | three and a half months | planned |
| B05-SH01 | L10 | [1151, 1240) | 89 | V | April, late news (FC01: no clock) | planned |
| B05-SH02 | L11 | [1240, 1305) | 65 | V → N | reconstructed anchor line | planned |
| B05-SH03 | L12a | [1305, 1334) | 29 | P insert | under an hour (FC01) | planned |
| B05-SH04 | L12b | [1334, 1374) | 40 | P | arrest (RC03: one flat thud) | planned |
| B06-SH01 | L13 | [1374, 1416) | 42 | P | reconstructed police line | planned |
| B06-SH02 | L14 | [1416, 1520) | 104 | P | documented line (F011), CL01 | planned |
| B07-SH01 | L15a | [1520, 1576) | 56 | R | FC06 (no link to the research), labelled gag recall | planned |
| B07-SH02 | L15b | [1576, 1676) | 100 | R | CL01 callback (glint) | planned |
| B07-SH03 | L15c + hold | [1676, 1795) | 119 | R | punchline, ending | planned |

Total 1795 f. Runtime mapping (composition, scene array index) is Editor's at blockout.

## Sound plan (index; descriptions live in the shot blocks)

Cue IDs for Ton's cue sheet ([fit beats reuse](../../../../../docs/sound-generation-workflow.md#fit-beats-reuse)). `cand` = a library candidate Ton must fit-check; everything else `NEEDS-GEN`.

- **Music** (one family, brief: sound direction): **MUS-01** heist groove, slick 1970s crime-funk, 98 bpm (B01-SH01 0 → dead at 157; returns sly at 332; out at 602; full again from the B03-SH04 brass hit 835 to 1151, band-limited CCTV version over [959, 1026)); **MUS-02** experiment bed, woodblock tick at 98 bpm + pizzicato ([602, 740)); **MUS-03** mock-heroic brass stab (835); **MUS-04** 1990s local-news sting (1157); **MUS-05** the groove slowed to about 80 bpm, muted horn lead, wistful ([1520, 1698) then pulled back), with the falling "wah-wah" (1560); **END-01** bass two-note tag + one dry finger snap (1740, snap 1768).
- **Ambience / beds**: **AMB-K** 1990s bank lobby ([0, 233)); **AMB-T** Thai street midday ([233, 332), [900, 959)); **AMB-H** kitchen January night ([332, 900), [1026, 1151)); **BED-HISS** analogue tape/video hiss ([959, 1026), [1151, 1305)); **AMB-V** CRT whine + room hum ([1151, 1305)); **AMB-P** fluorescent buzz + HVAC ([1359, 1520) after the tube flicker at 1351, out [1413, 1419)); **AMB-R** near-silent small room, desk-lamp transformer hum ([1520, 1795)); **SFX-CLOCK** sound-only clock tick ([1305, 1329), speeding up, dead stop at 1329; cand `tension_clock-pulse_01`).
- **SFX** (global frame, cand): B01-SH01 door whoosh 0 · B01-SH02 whip 103 (cand `whoosh_air-swish-rising_01`) · B01-SH03 lemon pat 187, glint "ting" 205 (reused 1660) · B01-SH04 lime squeeze 296 · B02-SH01 whisper 367 · B02-SH02 dream shimmer 405, servo + boop 469 · B02-SH03 paper rustle 521, reveal shimmer 523 (cand `reveal_glass-shimmer-soft_01`), dry bonk 595 · B03-SH01 slam 650, lens crack 650, flash wobble 652 · B03-SH02 lemon rub 675, broken shutter + sputter 711, stuttering eject 723 · B03-SH03 print flaps 743, 751, 759 · B03-SH04 broken shutter + sputter 803 (same file), spark fizz + pop 806, label pop 803 (cand `ui_pop_01`) · B03-SH05 snaps 860, 867 (music), canvas zip 873 · B04-SH01 phone shutter 952 (cand `electric_phone-shutter-flash_01`) · B04-SH02 servo clicks 989, 996, 1004, REC beep 1006 · B04-SH03 page flips 1065, 1073, 1081 (cand `whoosh_page-flip-paper_01`), ice clink 1114 (cand `water_ice-settle-tick_01`) · B05-SH01 CRT click-on 1152 · B05-SH02 CRT roll blip 1240 · B05-SH03 phone rings 1305, 1310, 1315 · B05-SH04 steel door thud 1349 (cand `impact_dull-sub-thud-muffled_01`), tube flicker 1351 (cand `electric_light-flicker-buzz_01`) · B06-SH01 print slide 1377 · B07-SH01 label pop 1542 (the B03-SH04 pop, −6 dB) · B07-SH02 glint 1660 (B01-SH03 file) · B07-SH03 lemon tip 1718, kazoo dip 1734.
- **Ending (UT15, Film's choice):** kazoo dip after "ไม่ได้รู้จริงเลย", then END-01 under the hold, ringing out to frame 1794 (b07).
- **Never:** gunshot or gun handling sound, siren, door knock, handcuff click, real station audio (brief; FC07; RC03; RC5-01).

## Boss dependencies

Build lines in each shot block name the start files. Grouped for [Boss batches](../../../../../docs/coordinator.md#boss-batches):

| Group | Work | Shots | Status |
| --- | --- | --- | --- |
| Sets | `new: bank-lobby-1995` (K) + K2 recolour; `new: apartment-kitchen-1995` (H) incl. wall calendar JAN–APR pages, window snow/melt + plant states; `new: somtam-stall-today` (T); `new: tv-corner-1995` (V); `new: news-studio-1995` (N, 1080 × 810 picture); `new: police-room-1995` (P) + phone-desk insert; reveal table (R) | all | look code in `src/painted/edu31/set31.ts` (W3, `exists-unintegrated`); Boss hardens |
| Cast and outfits | WHEELER `man-buzz + new: windbreaker-1995`; POLICE `man-crop + new: us-police-1995`; FRIEND `man-spiky` (own jacket); TELLER, YOU, ANCHOR kit | all with cast | outfits painted at W3 in `set31.ts`; kit intake W8.4 |
| Poses and motions (hard) | `new: whisper-cup` (B02-SH01), `new: lemon-pat` (B01-SH03), `new: lemon-rub`, `new: selfie-hold-offframe` (B03-SH02), `new: camera-slam` (B03-SH01), `new: print-shake` (B03-SH03), `new: selfie-hold-arm` → P08 (B03-SH04), `new: lay-out-row` (B03-SH05), `new: selfie-angles` (B04-SH01), `new: feet-up-lean-back` + toast (B04-SH03), `new: slide-across` (B06-SH01), `new: cheek-touch` (B06-SH02), `new: paper-beside-face` (B02-SH03), `new: lime-squeeze` (B01-SH04), whip in K → K2 with two bags (B01-SH02) | per block | missing |
| Props | `new: lemon` (whole, half, tipping half), `new: lime-half`, `new: krok-somtam`, `new: instant-camera-1995` (intact) and `-broken` (standing, held, lying; flash bar on two wires; crack), `new: instant-print` (develop states), `new: candle`, `new: ink-paper` (doodle reveal), `new: canvas-money-bag`, `new: toy-pistol-cartoon`, `new: cctv-box-camera`, `new: crt-tv-27`, `new: desk-phone-1990s` (×3, line lights, jiggle), `new: photo-print-8x10` (CCTV-STILL-01 mapped) | per block | look code in `set31.ts` and `kit/props.ts` (`paintToyPistol`, `paintShoulderBag`); rest missing |
| Screen layers (VD31-08, VD31-09) | CCTV preset (grade, 270 × 480 downsample, scanlines, noise band, speckle, 10 fps stutter, vignette, timestamp `JAN 06 1995` + `CAM 2` + REC dot, 3-step crop zoom, freeze); CRT preset (scanlines, curvature, glow, click-on, 2-frame roll); 1995 news bumper; CCTV-STILL-01 export (exists: `public/edu31/cctv-still-01.png`, store `projects/edu/EDU/look-frames/ep31-v5/`) | B04-SH02, B05-SH01, B05-SH02, B06, B07 | missing (presets, bumper); still exists |
| Overlays | joke label plate + B07 arrow (look version `TagPlate` in `src/painted/edu31/look.tsx`); thought bubble via `clipPainter` (`src/painted/kit/clip-circle.ts`, existing); whip smear; flash pops, spark, puff | B02-SH02, B01-SH02, B03-SH01/02/04, B07-SH01 | label/bubble partly exist; effects missing |

## Open items

| ID | Owner | Item | Blocks |
| --- | --- | --- | --- |
| O1 | Boat | Recheck the joke-label wording "เหตุการณ์สมมุติ: กล้องดันพังพอดี" (changed from "มุกของเรา: …" after Recheck R6; R6's status says a text change needs a recheck) | Final, not plates |
| O2 | Film / user | B07-SH02: the passed framing cannot keep the lying camera out of frame (projection: it sits at y 117–411, straight above the Polaroid). Film's decision: the SH02 plate leaves the camera and its flash bar out (a continuity cheat on soft, out-of-focus table; the row's "not seen in this shot" holds). Fallback if the Draft reads a gap: the tight low framing `tightC` in [b07](b07.md#b07-sh02--low-across-the-table-the-photo-he-trusted), which drops the CCTV print from the shot | no |
| O3 | Editor | Final caption split and CaptionShade at the Draft (suggested cards per shot) | no |
| O4 | Ton | Fit checks of the named library candidates; every other cue NEEDS-GEN | no |
| O5 | Boss | VD31-08 screen presets and VD31-09 bumper are missing capabilities; fallback for the bumper: a plain blue card with `NEWS` | B04-SH02, B05 plates |
| O6 | coordinator | Review page with ROWS-R8 (B01 timing only; storyboard hashes unchanged) not published by Film | no |

## Element captures

Existing look frames, used as element references (not shot framings): LF01 `out/edu31/looks/v7/LF01.png` (B01-SH01 mid-dolly; store `projects/edu/EDU/look-frames/ep31-v6/` + v7 repaint), LF02 v6 (CCTV-STILL-01), LF03 v7 (kitchen, B02-SH01), LF04 v6 (stall, YOU), LF05/LF05B v6 (TV corner, studio), LF06 v6 (police room), LF07 v10 and PR01 v10 (`out/edu31/looks/v10/`, store `projects/edu/EDU/look-frames/ep31-v10/`; v9 had the shorter "สมมุติ" label; reveal table with the broken camera and the "เหตุการณ์สมมุติ" label; broken camera on the kitchen table), TT01 v6 (WHEELER four views). Limits: CSS approximations of the screen layers, no motion, no lip sync. Editor scene sample proposal: B04-SH02 [959, 1026) (walk, look up, step zoom, freeze = the riskiest new capability).

## Change log

- 2026-11-21, Film: `EDU-EP31-SCENE-R1`, first timed sheets (W5.1) from VOICE-R1 and BOARD-R6. Integer frames from the measure file; camera numbers checked with `shot-projection.py`. Changes against the untimed board, each with its reason in the shot block: B01-SH01 camera end z 2.7 and Wheeler end z 5.0 (face clear of the top at 832 px; board z 4.6 put the head top at y 179); B01-SH02 yaw +6 (lead room; board −6 put him walking toward the edge); B01-SH04 eye raised to (0, 1.55, 0.06) (board values put the krok above the frame); B03-SH01 the camera starts on the table's right corner, the right mitten fetches it from the chin pose; B03-SH02 eye z 0.35 (board z 0.55 gave a 338 px head against the planned 420); B03-SH03 yaw 180 (board yaw 0 looked away from the print); B03-SH04 eye x 2.6, f 1000 → 1050 (the W5.1 check: at f 800 the camera was 35 px wide and its hanging flash did not read; now 65–68 px, flash drop 65 px), label plate moved up to centre y 250; B04-SH02 walk shortened (starts at z 4.4), zoom steps on "ถ่าย", "หน้า", "เต็ม", freeze on "เต็ม"; B04-SH03 eye moved in to (−0.15, 1.25, 1.25) (board values gave a 275 px lead); B05-SH01 bumper 18 f (the read has no gap after "จนเดือนเมษา"), couch arm moved to (−0.40, 0.55, +0.60) so it shows; B05-SH02/SH03 the sound-only clock starts in SH03, not under SH01's end (keeps the silence after "ครับ" hiss only); B05-SH04 push 5 % added (retention camera); B06-SH01 the print stops at (0, 0.68, −0.02) (continuity with SH02); B06-SH02 tighter f 1300 → 1365, hy 540 (the print's CCTV face was in the caption band); B07-SH01 start eye 0.20 / hy 440 (lemon above the band), label at plate centre (825, 245) from local 22 with the arrow tracking the camera, 36 px (RC6-06); B07-SH02 end yaw −12 (the print fully leaves frame) and the camera cheat (O2); B07-SH03 hy 460 (lemon above the band). Caption plan at 71.4 px with short cards (user, 2026-11-21). Rows `EDU-EP31-ROWS-R7` = R6 + `start`/`end`.
- 2026-11-21, Film: `EDU-EP31-SCENE-R2`, retime only. Cause: the user picked L01 candidate c1 (VOICE-R1.3, clearer "มะนาว"); total 1795 f, L02–L15 and every start after L01 unchanged. B01-SH01 [0, 83) (R1 [0, 72)), SH02 [83, 169) (R1 [72, 175)), SH03 [169, 233) (R1 [175, 233)); SH04, the B01 end (332) and B02 on unchanged. Cuts stay 3 f before the envelope edge of their word, as in R1; whip on "สองแห่ง" 103 (R1 94), groove dead on "เลย" 157 (R1 158), head turn 146–156 unchanged, lemon contacts 187/197 (R1 192/200), glint 205 (R1 208). R1 L01 anchors were: "ผู้ชายคนนี้กับเพื่อน" 40 · pause 66–75 · "ปล้นธนาคาร" 75 · "สองแห่ง" 94 · "ในวันเดียว" 108 · pause 128–139 · "เลย…" 158 · pause 170–178 · "เพราะ" 178 · "น้ำมะนาว" 192 · "หน้า" 208. Staging kept: SH01 endpoints at 0.48 m/s, SH02 K2 start x −1.75 (1.2 m/s, end frame unchanged; [projection-R2.txt](../projection-R2.txt)). Rows: ROWS-R8.
