# Timed scene sheets and index — EDU-EP04-SHORT (EDU-EP04-SHEETS-R1.2)

- **Deliverable:** `EDU-EP04-SHORT` · **Revision:** EDU-EP04-SHEETS-R1.2 (Film W5.1, 2026-11-05; R1.1 = G2 `PLAN` review, R1.2 = G3 review, see [Change log](#change-log)) · **Status:** `ready-for-dev` · **Timing:** checked-with-audio (narrator segment spans measured by Film on the take-3 file; line mapping by order, see [Voice-lock edit](#voice-lock-edit-request-vl-edit-01-editor)). Picture, runtime, sound and user approval of this revision: none yet. Review page: pending (coordinator rebuilds from [review-rows.json](review-rows.json)).
- **Inputs (by revision):** script EDU-EP04-SCRIPT-R1.3 ([script.md](script.md), user-approved); fact-check R1.3 re-check PASS ([fact-check.md](fact-check.md)); brief EDU-BRIEF-R1.1 ([brief.md](brief.md), VD01–VD17, set plan `SET-CHECKOUT`, `PLAN`, sound direction, technical handoff); storyboard SS-R1 ([storyboard.md](storyboard.md); user 20/20 ok) incl. W3 check **FX-L20-01** and the **W4.x B02 retime**; look frames LF01–LF04 **v2** (user-approved, [look-frames.md](look-frames.md), source `src/painted/edu04/`); voices ([voice-measure.md](voice-measure.md)): narrator Kore R1.3 take 3 `projects/EDU/narration/ep04/2026-11-05_ep04-r13-kore-take3-regap028.wav`, MAN Algenib `projects/EDU/narration/ep04-r13-man-l03-algenib.wav`, `…-man-l05-algenib-take2.wav`, `…-man-l18a-algenib.wav`, CSH Charon `projects/EDU/narration/ep04-r13-csh-l04-charon.wav` (all user-passed 2026-11-05).
- **Content changes vs the passed storyboard:** none to script text, shot IDs, order, lines or approved looks. One review-row text change: the S01-B06-SH03 hold is "ราว 2 วินาที" (was 2.5; coordinator's ~55 s target). Staging corrections forced by the approved LF01 v2 set-up are listed in [Staging deviations](#staging-deviations-from-the-brief-film-decisions).
- **Target:** branch `claude/edu-ep-continuation-d7897d` · 30 fps · `durationFrames` **1657** · 1080×1920 portrait · composition offset 0 (composition not registered yet; Editor).
- **Baseline (link, not copied):** world space `CHECKOUT` (metres; origin floor at lane-2 paying point; +x right from the hero vantage, +y up, +z toward the tills/hero camera; customers face +z) and the camera-line form `cam: target, yaw a→b, r, eye, f, hy` per [brief set plan](brief.md#set-plan--set-checkout-world-metres); kit `ycam.ts` math (picture x = 540 + cx + f·right/depth, y = hy − f·up/depth; `orbitYCam` puts the camera at target + r·(sin yaw, ·, cos yaw)). Positive yaw puts the camera on the +x side. `PLAN` is orthographic 130 px/m, screen x = 540 + 130·x, y = 300 − 130·z (brief). Screen-space layers: px, origin top-left, y down. Shot-local frame `L` = global frame − shot start. Ranges are half-open `[start, end)`.
- **Frame rule:** frame = round(s × 30). Narrator-led shots start 4 f before their line's onset (picture leads voice). Exceptions: f0–f360 keep the W4.x B02 retime frames (voice-lock window B01–B02 + L06, 0–12.00 s), and S01-B06-SH03 starts on L18a's end + 4 f (cut on MAN's step).
- **Projection check:** every world-space camera below was run through the kit `ycam` formula (Film script mirroring `src/painted/kit/ycam.ts`; log `out/logs/ep04-w51-projection.txt`, not committed) at the brief's baseline (MAN 1.80 m, effective head 0.37 m as measured on LF01 v2). Values marked `meas` in the shot blocks come from that run; everything else is `est`.
- **One shot = one timeline scene** (render by scene). Scene ID = shot ID. All joins are hard cuts except S01-B03-SH01 (in-scene dissolve to `PLAN`) and the end fade.

## Totals

- **20 shots, 1657 frames = 55.23 s** at 30 fps. Limit 60 s: **pass** (4.77 s spare). Target ~55 s: +0.23 s.
- Build-up: narrator speech 38.62 s (take 3) + MAN/CSH speech 6.23 s (L03 1.47, L04 1.72, L05 0.90, L18a 2.14) + pauses after VL-EDIT-01 + silent gag 1.20 s + end hold **2.00 s** (was 2.5; applied here).
- **If VL-EDIT-01 is not applied** (take-3 pauses left at 0.28 s): +2.41 s → 1729 f = **57.63 s**, still ≤ 60 s; every frame after f359 shifts and this sheet would need a retime pass. So VL-EDIT-01 is the planned lock, not an option.
- Shortest shots: S01-B02-SH03 and S01-B03-SH02, 36 f each; none under 24 f.
- Ending: `video.ending: 'A_fade'`, `endHoldSec: 0` (live hold), `endFadeSec: 1.0` (brief: VD15). Silence after the last speech: 60 f (f1597–f1657), fade over the last 30 f.

## Voice-lock edit request VL-EDIT-01 (Editor)

A pause edit of the locked takes, not a script change and not a new read. Script wording, take choice and acting stay as approved.

1. **Narrator piece A** (L01, L02): take-3 file 0.000–3.900 s **unchanged** (gap L01→L02 stays 0.28 s). Place file 0.000 at global 0.067 s (2 f), so L01 = f7–f47 and L02 = f56–f115.
2. **Narrator piece B** (L06–L18): take-3 file from 3.900 s to the end of L18 (44.038 s). Keep L06 and the L06→L07 gap (0.28 s) as is. From L07 on: every **in-line** pause (13, inside L09, L10 ×2, L10a, L14, L15, L16 ×3, L17, L18 ×2, L20) → **0.15 s**; every **between-line** pause (L07→L08 … L17→L18, 12) → **0.22 s**. Natural sub-0.18 s gaps inside a phrase (at file 5.04, 8.35, 22.22, 30.20 s) stay. Place so L06 onset (file 4.039) lands at global f317 (10.567 s).
3. **Narrator piece C** (L20): file 44.318–46.742 s with its in-line pause at 0.15 s; onset at global f1528 (50.930 s).
4. **Dialogue** (leading silence trimmed at the cut; gains from [voice-measure](voice-measure.md#r13-man-and-csh-lines-w4x-film-casting-man-algenib-csh-charon)): L03 onset f124 (+4 dB), L04 onset f175 (+3 dB), L05 take 2 onset f275 (0 dB), L18a onset f1452 (+3 dB).
5. Measure the result with Whisper words + `silencedetect -35 dB d 0.12` into a committed measure file `scripts/edu-series/ep04/narration-lock.json` (timing status `audio-measured`), and archive the assembled narration in the store. **Tolerance:** every onset in the table below within ±2 f; if any onset moves more, return the measure file to Film for a retime of the affected shots (do not move picture to fit).
6. Known gap: Film's segment-to-line mapping (30 segments → 17 NAR lines) is by order and matches the 13 in-line / 16 between-line counts, but is not checked by ear or by Whisper (`scripts/transcribe.py` failed here: faster-whisper `av.open(..., metadata_errors=...)` TypeError in the shared `.venv-whisper`; Editor's environment may differ).

**Planned narration placement (global frames, after VL-EDIT-01).** Phrase spans are split at the in-line pauses.

| Line | Speaker | Global frames | Phrase onsets |
| --- | --- | --- | --- |
| L01 | NAR | 7–47 | |
| L02 | NAR | 56–115 | |
| L03 | MAN | 124–168 | |
| L04 | CSH | 175–227 | |
| L05 | MAN | 275–302 | |
| L06 | NAR | 317–351 | |
| L07 | NAR | 359–394 | |
| L08 | NAR | 400–481 | "มีแค่หนึ่งในสาม" ≈ 448 (natural gap) |
| L09 | NAR | 488–552 | 488, 516 |
| L10 | NAR | 558–655 | 558, 587, 629 |
| L10a | NAR | 662–742 | 662, 709 |
| L11 | NAR | 749–798 | |
| L12 | NAR | 804–884 | "ตอนรอ…" ≈ 836 (natural gap) |
| L13 | NAR | 891–952 | |
| L14 | NAR | 958–1021 | 958, 991 |
| L15 | NAR | 1028–1146 | 1028, 1071 |
| L16 | NAR | 1153–1254 | 1153, 1169, 1201, 1229 |
| L17 | NAR | 1260–1339 | 1260, 1294 |
| L18 | NAR | 1345–1444 | 1345, 1391, 1420 |
| L18a | MAN | 1452–1516 | |
| L20 | NAR | 1528–1597 | 1528, 1562 |

## Staging deviations from the brief (Film decisions)

Each is forced by the approved LF01 v2 / LF04 v2 set-up or by a projection result; the brief's `est` values lose to these numbers.

- **SD01 B01 slots:** cast as `b01Cast` in `src/painted/edu04/checkout.ts` (LF01 v2): MAN lane 2 **S2** (0, 0, −1.30); lane 2 S1 empty, `man-elder` S3, `man-shaved` + trolley S5; `woman-curly` lane 3 S3; cashiers at lane x **+1.65**, z −0.20 (brief said +1.50).
- **SD02 B02 lane-3 room:** `woman-curly` leaves lane 3 for lane 2 S4 (0, 0, −3.10) during S01-B02-SH02 (out of the SH02 frame), so MAN lands **behind `man-spiky`** at lane 3 S3 (2.20, 0, −2.20) as the approved row says.
- **SD03 S01-B02-SH02 camera:** brief `T-L1TILL yaw −55` puts MAN off frame (x −269 `meas`); replaced (block below).
- **SD04 S01-B04-SH03/SH04 yaw signs:** the brief's +30 / −30 put lane 3 and lane 1 behind the camera; swapped, with a picture offset `cx` so the passing lane is in frame.
- **SD05 B04 depth:** B04 re-stages MAN at lane 2 **S4** (0, 0, −3.10) so that his one advance in SH04 (to S3) passes `woman-pixie` and ends at S3, the LF03 position used by B05.
- **SD06 crossfade alignment (FG-01):** the approved `PLAN` (LF02) draws the tills at the top (y = 300 − 130·z), which is the mirror of any camera on the +z side. The crane end aligns the **three lane centres at z −2.0** to 254 / 540 / 826 px and y 560 (`meas` 253 / 540 / 827, y 560); the brief's "till line within ±60 px of y 300" cannot be met without mirroring the store and is dropped. The dissolve reads as "same three lanes, now a drawing". Fallback (brief VD10): straight cut on the freeze.
- **SD07 L20 walk:** MAN enters S01-B06-SH03 already through the belt gap at (0, 0, −1.60) (cut on his step out of SH02); the 1.2 m walk to S1 fits 60 f at 0.6 m/s. Brief fallback, no story change.
- **SD08 basket set-down point:** belt end (0.62, 0.85, −0.65), not (0.70, 0.85, −0.70), so the till-2 register does not cover basket or hand (clearance 4 px `meas`, see handoff H2).

## Sound plan (whole video; per-shot cues in the shot blocks)

Library checked 2026-11-05, `~/ReelsStore/library/sound/INDEX.md` (186 lines); every generated entry is "not listened": Editor ear-checks before use. Sound never carries a fact; the `แบบจำลอง` tag covers the plan's sound too (brief: Sound direction).

| Layer | Source | Global use |
| --- | --- | --- |
| Muzak main | **NEEDS-GEN MUZ-A**: bright bossa-lounge supermarket muzak, electric piano, nylon guitar, soft brushes, 110 bpm, 60 s loopable, instrumental | f0–f311, low (−18 dB re narration), ducked under every line |
| Muzak detuned | **NEEDS-GEN MUZ-B**: same tune and seed family, slight pitch wobble/tape detune | f745–f1024; low-passed (~800 Hz) under B05 f1024–f1256 |
| Muzak calm + end chord | **NEEDS-GEN MUZ-C**: same tune, slower feel (~90 bpm), warm, ends on a held resolving chord; layer `stinger_outro-resolve_01` from f1520 only if MUZ-C has no clean final chord | f1256–f1657, chord under L20, rings out, fades with the picture to silence at f1657 |
| Room tone | **NEEDS-GEN RT-STORE**: 12 s loop, fluorescent hum, distant trolley rattle, soft murmur, rare far scanner beeps; `room_shop-fridge-hum_01` as a low partial layer | all store shots; **off f311–f745** (freeze + plan); low-passed in B05 |
| Model bed | `bed_curious-explainer-light_01` (95 bpm, partial fit; fallback `bed_pool-curious-sparse_01`) | f345–f745 only |
| Plucks | `pluck_soft-note-01_01` … `06_01` | lanes appear (B03-SH02) |
| Memory swell | **NEEDS-GEN SFX-MEMSWELL**: soft muffled warm swell, 4 s | B05-SH01 |
| Scanner beep | **NEEDS-GEN SFX-SCAN**: checkout scanner beep, single + fast run (6–8 beeps in 1.3 s) | B01 background, B02-SH02 run, B06-SH03 |
| Coins | **NEEDS-GEN SFX-COIN**: 4 single coin clinks on a steel counter, varied | B02-SH03 |
| Boing | **NEEDS-GEN SFX-BOING**: small soft cartoon boing, 0.4 s | B03-SH04 hop |
| Stamp + crack | **NEEDS-GEN SFX-STAMP** (rubber-stamp thunk) + **SFX-CRACK** (small ceramic crack) | B05-SH02 |
| Library one-shots | `foley_cart-wheel-squeak-scrape_01`, `whoosh_fast-slide_01`, `comedy_record-scratch_01`, `stinger_wahwah-fail_01`, `whoosh_air-swish-rising_01`, `reveal_reverse-swell-airy_01`, `reveal_glass-shimmer-soft_01`, `ui_click-tick_01`, `ui_pop_01`, `stinger_low-muted-hit_01`, `ui_notification-ding_01` | per shot |

**Silence policy (brief):** (1) f311–f327 true silence except L06 (music and room tone cut on the freeze frame, no ramp); (2) no tick on MAN's own overtake (B04-SH04); (3) after L20 (f1597): no speech; chord, low room tone and one soft scanner beep, all fading with the picture to digital silence on f1656.

**Mix intent (EP08a):** B01 hold; B02 lift (comedy hits); f311 drop; B03 hold, small hit on "1/3"; B04 hold with ticks; B05 drop (muffled) and one hit on the red memory; B06 release; end fade.

## Caption plan

- White captions, `captionStyle.bottomEdgeY` 1344, band y 1176–1344, ≤ 2 lines, break after "…" when a line wraps (brief: VD17). Subtitle text = the spoken line verbatim (script: no subtitle differences), incl. MAN and CSH lines; none in the silent gag or the end hold.
- Cue rule: `[onset, end + 6)` capped at the next line's onset; the exact ranges sit in each shot block.
- Shade: caption layer outline + shade per the v2 per-look decision ([look-frames.md](look-frames.md), relaxed cream limit); peak opacity is one value per video, judged at W5.3 at 360 px on, brightest first: B03-SH03 f450 (`PLAN` paper, band luma 0.921), B01-SH01 f30 (LF01, 0.738), B06-SH01 f1300 (LF04, 0.633), B05-SH01 f1100 (LF03, 0.603).
- Nothing else enters y 1160–1344: faces (all chins ≤ y 1055 `meas`), coins, fractions, stamp, bubbles and title stay above.

## Shot map

| Shot | Beat | Frames [start, end) (len) | Lines | Claims / clues |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 | 0–56 (56) | L01 | address |
| S01-B01-SH02 | B01 | 56–121 (65) | L02 | address; title |
| S01-B02-SH01 | B02 | 121–171 (50) | L03 | dramatization |
| S01-B02-SH02 | B02 | 171–233 (62) | L04 | dramatization; **CL01** plant |
| S01-B02-SH03 | B02 | 233–269 (36) | silent gag | dramatization |
| S01-B02-SH04 | B02 | 269–311 (42) | L05 | dramatization |
| S01-B03-SH01 | B03 | 311–360 (49) | L06 | F002/F003 |
| S01-B03-SH02 | B03 | 360–396 (36) | L07 | F002 (model) |
| S01-B03-SH03 | B03 | 396–554 (158) | L08, L09 | F002 (model) |
| S01-B03-SH04 | B03 | 554–658 (104) | L10 | F002, F003 (model) |
| S01-B03-SH05 | B03 | 658–745 (87) | L10a | F002 limits; **CL01** payoff |
| S01-B04-SH01 | B04 | 745–800 (55) | L11 | question |
| S01-B04-SH02 | B04 | 800–887 (87) | L12 | F005 hypothesis; **CL02** |
| S01-B04-SH03 | B04 | 887–954 (67) | L13 | F005 hypothesis |
| S01-B04-SH04 | B04 | 954–1024 (70) | L14 | F005 hypothesis; CL02 payoff |
| S01-B05-SH01 | B05 | 1024–1149 (125) | L15 | F007 |
| S01-B05-SH02 | B05 | 1149–1256 (107) | L16 | F009 hypothesis |
| S01-B06-SH01 | B06 | 1256–1341 (85) | L17 | F014 |
| S01-B06-SH02 | B06 | 1341–1520 (179) | L18, L18a | F012; dramatization |
| S01-B06-SH03 | B06 | 1520–1657 (137) | L20 + hold | F014 restated; closing |

---

## Shot sheets

Picture intent per shot is the row's `seen` text in [review-rows.json](review-rows.json) and its look frame; blocks below add only numbers. Casting lines follow [CP casting-line](../../../docs/character-proportion-principles.md#cp-casting-line). MAN's base line (brief: VD02): **`man-parted + new: rush-hour-blazer, P01, suspicious`**, red `new: shopping-basket` in his right hand (screen left) unless a block says otherwise. Store cast and cashier uniform per brief VD03/VD04.

### S01-B01-SH01 · 0–56 · LF01 queue (opening size)

- **Time:** L01 f7–47 = L 7–47. Eye darts to lane 1: L 10–16 and L 30–36 (look [−0.9, 0], back to [−0.3, 0] between).
- **Staging (`CHECKOUT`, SD01):** as LF01 v2 `b01Cast`; MAN (0, 0, −1.30) facing +z, `suspicious`, headCock −4; idle breath on ambient time. Lane 2 S1 empty; no customer moves in this shot.
- **Camera:** LF01 v2 values: `cam: T-MAN (0, 1.55, −1.30), yaw −6→−4, r 3.8→3.5, eye 1.9, pitch −6, f 860, hy 790, cx −90`, ease-in-out over L 0–56. MAN `meas`: x 450, head 83→90 px, body 390→422 px (below the 480 px lead rule; accepted with the approved LF01 v2 compromise, all three lanes in frame). This end size is the bookend reference for S01-B06-SH03.
- **Sound:** MUZ-A from L0 at −18 dB, ducked; RT-STORE + fridge hum; `foley_cart-wheel-squeak-scrape_01` far back at L 20, −28 dB, 1.2 s trimmed; one far SFX-SCAN single at L 40, −26 dB.
- **Caption:** "คุณเปลี่ยนแถวกี่ครั้ง…" f7–53.
- **Entry → exit:** basket in right hand, arm down, both ends. **Accept:** lanes 1/2/3 named by colour at 270 px; MAN's eyes visibly go left twice; no face in y 1160–1344.

### S01-B01-SH02 · 56–121 · close, title

- **Time:** L02 f56–115 = L 0–59. Title strip wipes on L 0–6, holds, wipes off L 58–64 (off by the cut).
- **Staging:** MAN as SH01 end; squint `suspicious` deepens L 10–30 (brow lower 1 step, headCock −4→−7).
- **Camera:** `cam: T-MAN (0, 1.55, −1.30), yaw −15, r 1.40→1.25 push (linear), eye 1.55, f 1100, hy 760`. `meas`: head 291→326 px, head top y 564→540; title strip (VD16) in y 220–520 stays clear of the head.
- **Sound:** MUZ-A continues; tiny riser `reveal_reverse-swell-airy_01` L 35–59 at −20 dB (its abrupt stop lands on the cut).
- **Caption:** "แถวที่คุณย้ายไปก็ช้าทุกที" f56–121. Title "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ" with the teal/amber/coral underline (VD16).
- **Accept:** title fully legible at 270 px for ≥ 1.5 s; title and head do not overlap.

### S01-B02-SH01 · 121–171 · switch to lane 1

- **Time:** shuffle L 2–14; MAN slide L 2–40; L03 MAN f124–168 = L 3–47; sly grin L 40–50.
- **Staging:** lane-1 shuffle: `woman-pixie` (−2.20, 0, −1.30)→(−2.20, 0, −0.85) and `girl-school` (−2.50, 0, −2.20)→(−2.50, 0, −1.75), one 0.45 m step each (12 f). MAN path (squeezing past `man-elder`, around the lane-1 counter tail at z −2.40): (0, 0, −1.30) L2 → (−0.30, 0, −2.55) L16 → (−1.80, 0, −2.60) L30 → (−2.10, 0, −2.30) L40, ease-out; body faces travel, head turned to lane 1; lands facing +z, `suspicious`→ sly (`happy` mouth, `suspicious` brow). Casting: `woman-pixie + own outfit, P01, neutral` (holding the girl's hand), `girl-school, P01, happy`.
- **Camera:** `cam: T-LANES (0, 1.20, −2.00)→(−1.20, 1.20, −2.00) truck, yaw −35→−45, r 3.0, eye 1.45, f 1000, hy 620`, ease-in-out L 0–50. `meas`: MAN start x 705 (742 px), end x 211 (699 px); girl in front of his legs at the end, his head above hers.
- **Sound:** `whoosh_fast-slide_01` L 2; MUZ-A continues; L03 +4 dB.
- **Caption:** "แถวนั้นไปเร็วกว่า…" f124–174.
- **Props:** basket stays in MAN's right hand through the squeeze. **Accept:** viewer sees him change lanes (amber → teal floor stripe under his feet by L 40).

### S01-B02-SH02 · 171–233 · price check, lane 1 frozen (CL01)

- **Time:** pineapple lift L 0–8; till-1 lamp red flash ×3 L 4–34 (5 f on / 5 f off); L04 CSH f175–227 = L 4–56; lane 2 advances L 6–18 and L 30–42; MAN `shock` L 8, `angry` L 24, glare at lane 2 L 50–62.
- **Staging:** CSH1 **`man-crop + vendor (apron retint #2f8a5e, badge), P07, happy`** at (−0.55, 0, −0.20) facing −x; right hand lifts the unpriced `new: pineapple` from the belt (−1.35, 0.90, −0.45) to (−0.75, 1.75, −0.30), left hand on the till-lamp button. `man-buzz, P25, neutral` paying at lane 1 S1. Lane 2 (two 0.90 m steps): `man-elder` (0, 0, −2.20)→(0, 0, −1.30)→(0, 0, −0.40); `man-shaved` + trolley (0, 0, −4.00)→(0, 0, −2.20). `woman-curly` walks lane 3 S3 → lane 2 S4 (0, 0, −3.10) L 10–40, outside this frame (SD02). MAN at (−2.10, 0, −2.30), head turns right on the glare.
- **Camera (SD03):** `cam: T-L1Q (−1.30, 1.30, −1.20), yaw 0→+4, r 3.4→3.2, eye 1.40, f 1200, hy 600`. `meas`: MAN x 327→341, head 99→102 px, body 480→496 px; pixie head clear of his (x 186 vs 327); CSH1 x 915; pineapple up at (804, 432); lane-2 slots S3/S2 at x 895/986, S1 off frame right, so elder's two steps read as moving out of frame right.
- **Look:** till-1 lamp red, ENV-GLOW ≤ 0.3 on CSH1 and MAN (VD06).
- **Sound:** `comedy_record-scratch_01` L 2 (−10 dB, hard stop of MUZ-A under it for 8 f, then MUZ-A resumes at −22 dB); SFX-SCAN fast run L 10–48 from lane 2 (pan right); L04 +3 dB.
- **Caption:** "เช็กราคาแป๊บนึงนะ" f175–233. No price-check text on screen.
- **Accept (brief spike 2):** lane 2 visibly advances 2 slots while lane 1 holds, readable at 270 px.

### S01-B02-SH03 · 233–269 · silent coin gag

- **Time:** MAN whooshes in from frame left L 0–6; leans out right L 6–10; coins land L 8, 15, 22, 29; till-1 lamp back to green (seen as a reflected green tint on the glass, no lane-1 action in frame) L 6.
- **Staging (SD02):** MAN lands at lane 3 S3 (2.20, 0, −2.20) behind `man-spiky, P01, neutral` (2.20, 0, −1.30), then leans right (head +0.20 m, body lean 8°) to see past him, `suspicious`→`shock`. **`woman-elder, P25, neutral`** at lane 3 S1 (2.20, 0, −0.40) takes coins from `new: coin purse` and stacks them on the counter at (2.70, 0.85, −0.35) with `new: coin-count motion` (hand P25 → counter, one coin per 7 f). Coin size exaggerated ×1.6 (Ø 0.04 m, 0.008 m thick; recorded per brief scale baseline).
- **Camera:** `cam: T-GAG (2.55, 1.00, −1.60), yaw +21.5, r 1.9→1.8, eye 1.20, f 1000, hy 540, cx +150`. `meas`: coins at (560, 882), stack top y 784; coin ≈ 40 px wide (≈ 10 px at 270 px); MAN x 757 (after the lean ≈ 830 est), head 127→132 px, body 618→640 px; elder's head x 249 at the left; spiky x 602 in front of MAN's body (MAN's face clear after the lean).
- **Sound:** `whoosh_fast-slide_01` L 0; SFX-COIN at L 8, 15, 22, 29 (four different clinks, dry, close); MUZ-A low continues; no voice.
- **Caption:** none.
- **Accept (handoff H3):** at 270 px a viewer sees "coins, one by one" and MAN's face in the same frame.

### S01-B02-SH04 · 269–311 · "อ้าว…" turn to camera

- **Time:** head-and-shoulder turn to camera L 0–14 (`turn-head-to-camera`, extended to a 60° body turn); L05 f275–302 = L 6–33; sulk hold L 33–42.
- **Staging:** MAN at (2.20, 0, −2.20), facing +z at L0, turned to the lens by L 14 (`squareToCam`), `sad`, shoulders drop 2 cm. Behind him lane 2 (`man-elder` paying, `woman-curly` at S4) and lane 1 (`woman-pixie` now at S1 paying, `man-buzz` gone) move: one step each in lanes 1 and 2 at L 10–22.
- **Camera:** `cam: T-MAN (2.20, 1.55, −2.20), yaw +60→+55, r 2.3→2.1, eye 1.55, f 1100, hy 700`. `meas`: MAN centred, head 177→194 px, body 861→943 px; `man-spiky` at the left edge (x 77→28), lanes 2/1 behind him at x 184–464.
- **Sound:** `stinger_wahwah-fail_01` (the trombone) at L 26, ducked −6 dB under "อ้าว…" until L 33, then full; it is cut by the hard silence at the f311 cut (handoff H4).
- **Caption:** "อ้าว…" f275–308.
- **Exit:** last frame = the freeze frame of S01-B03-SH01 L0.

### S01-B03-SH01 · 311–360 · freeze and rise (dissolve to `PLAN`)

- **Time:** freeze from L0 (event and ambient clocks stop: no breath, no blink; DF-20261030-painted-story-hold-ambient-clock); crane L 0–34; dissolve to `PLAN` L 34–49 (`dissolveSec` 0.5); L06 f317–351 = L 6–40; L07 onset f359 = L 48 (lands under the end of the dissolve).
- **Staging:** every figure frozen at SH04's last pose.
- **Camera:** from SH04's end camera (3.92, 1.55, −1.00), yaw −55° (`orbitYCam` az +55), f 1100, hy 700 → end `YCam x 0, y 3.00, z 0.40, yaw 0, pitch −70, f 475, hy 720` (blend with `mixYCam`, ease-in-out L 0–34, then held). End `meas`: lane centres at z −2.0 → x 253 / 540 / 827, y 560 = `PLAN` lane centres and `PLAN` y of z −2.0 (SD06); MAN at (1058, 241) at the frame edge. Ceiling (y 3.20) and tube rows are not drawn once pitch < −30° (Boss).
- **Sound:** f311 hard cut of MUZ-A and RT-STORE to silence (no ramp); L06 alone; `whoosh_air-swish-rising_01` L 16 (−16 dB) + `reveal_reverse-swell-airy_01` L 22–46; model bed fades in L 34–49.
- **Caption:** "ไม่ใช่แค่คุณซวยหรอก" f317–357.
- **Accept (brief spike 4, amended by SD06):** at L 34 the three store lanes sit within ±40 px of 254 / 540 / 826 at y 560 ± 60; no motion in any figure during L 0–34.

### S01-B03-SH02 · 360–396 · `PLAN`: equal lanes

- **Time:** L07 f359–394 (L −1–34; onset under the SH01 dissolve end). Lanes settle L 0–14 (each lane's 4 dots ink in, 6 f each, lanes 1, 2, 3 at L 2, 8, 14); "ถ้าทุกแถวเท่ากัน" in the fraction slot from L 4, ~92 px cap height centred x 540 (a phrase, not a fraction; R1.1).
- **Staging (screen px, fixed plane; layers: paper → lanes → counters/till icons → dots → labels → eyebrow → caption):** `PLAN` per LF02 (`src/painted/edu04/plan.ts`), 4 dots per lane at S1–S4 (y 352 / 469 / 586 / 703), MAN's navy dot with a white ring at lane 2 S3 (540, 586). Eyebrow "แบบจำลอง" top-right is the LF02 `ModelEyebrow` pill drawn by the `PLAN` plate on every `PLAN` frame (SH02–SH05); the scene `eyebrow` stays unset (R1.1; VD08 no-fade holds by construction).
- **Camera:** picture-stage scale 1.00→1.02 about (540, 560), linear; owner: `PLAN` plate transform (VD09 recorded exception).
- **Sound:** model bed; `pluck_soft-note-01_01`, `-04_01`, `-02_01` at L 2, 8, 14 (−14 dB).
- **Caption:** "ถ้าทุกแถวเหมือนกันหมด…" f359–399.
- **Accept:** three equal lanes with the same till icon; no dot moves after its ink-in.

### S01-B03-SH03 · 396–554 · 1/3 and 2/3 (LF02)

- **Time:** L08 f400–481 = L 4–85; lane 2 glows `#f2c230` + "คุณ" tag on MAN's dot at L 22 (≈ "แถวของคุณ", est ±4 f); "1/3" + "แบบจำลอง" sub-label at L 61 (≈ "หนึ่งในสาม", est). L09 f488–552 = L 92–156; at L 92 lanes 1 + 3 glow together, "2/3" + "แบบจำลอง" replaces the lockup (cross-fade 6 f), lane 2 dims to 0.78 but stays; at L 140 "2/3" yields back to "1/3 · แบบจำลอง" (6 f) and the glow returns with it (lane 2 lit, lanes 1 + 3 back to 0.78), so SH04 starts in the full L08 "1/3" state (R1.1).
- **Staging:** as SH02; fraction numerals ~180 px tall in y 870–1050, sub-label 56 px in y 1065–1125 (brief `PLAN`). No dot moves.
- **Camera:** scale 1.02→1.05 about (540, 560), linear over L 0–158.
- **Sound:** model bed; `reveal_glass-shimmer-soft_01` chime at L 61 (−12 dB); `pluck_soft-note-03_01` + `-06_01` together at L 92 (−16 dB).
- **Caption:** "โอกาสที่แถวของคุณจะเร็วที่สุด… มีแค่หนึ่งในสาม" f400–487; "อีกสองในสาม… จะมีสักแถวที่เร็วกว่า" f488–557.
- **Accept (brief spike 3):** "1/3", "2/3" and "แบบจำลอง" legible at 270 px; nothing races.

### S01-B03-SH04 · 554–658 · the hop

- **Time:** L10 f558–655: "ถ้าแถวพอ ๆ กัน" L 4–29, "ย้ายไปก็แค่ลุ้นใหม่" L 33–71, "ด้วยโอกาสเท่าเดิม" L 75–101. Hop L 33–45: MAN's dot arcs (540, 586) → (826, 586), apex y 520, ease-in-out; the "1/3 · แบบจำลอง" lockup slides with it L 33–47 to centre x 826 ± its width clamp (keeps ≥ 40 px from the frame edge), unchanged in size and text.
- **Staging:** `manLane` 2 → 3; lane counts stay 4 / 4 / 4: as he leaves, a plain dot (`DOTS[2][2]`) fades in at lane 2 S3, and the plain lane-3 S3 dot fades out under his landing (6 f each). Glow follows: lane 3 `#f2c230`, lane 2 back to its colour.
- **Camera:** scale 1.05 held; drift x +10 px over L 0–104, linear.
- **Sound:** model bed; SFX-BOING at L 36 (−12 dB).
- **Caption:** "ถ้าแถวพอ ๆ กัน ย้ายไปก็แค่ลุ้นใหม่… ด้วยโอกาสเท่าเดิม" f558–661.
- **Accept:** the lockup reads identical before and after the hop.

### S01-B03-SH05 · 658–745 · model caveat (CL01 payoff)

- **Time:** L10a f662–742: "นี่แค่แบบจำลองง่าย ๆ นะ…" L 4–46, "ของจริงไม่ได้เท่ากันเป๊ะ" L 51–84. Paper wobble L 6–42 (lane edges jitter, peak 6 px, two cycles, settle to 0 by L 42; R1.1, was 2–3 px; judged in motion at full size, not on stills). `new: plan icons`: CL01 price-check sign (the red paddle CSH1 lifted, as ink) pops onto the till-1 icon at L 54 (overshoot 110 % → 100 % in 6 f): R1.1 pre-push plate coords: pad centre (364, 186), pad 80 × 64 px (r 40), covering the till-1 lamp (364, 219); stick 4 px ink from (364, 218) down to the register top (364, 267); same `planPush` as the plate (was (254, 250) = lane-1 top, off the icon, pad ~48 px); one big trolley icon (0.9 × 0.6 m footprint = 117 × 78 px, `man-shaved` outfit colour) replaces the lane-2 S2 dot (540, 469) at L 64; R1.1: it must read as a full trolley, not a box: handle = 6 px ink bar across the rear (bottom) edge, 117 px long, 10 px below the body (y ≈ 518 pre-push), replacing the diagonal stroke; 3–4 goods blobs (14–22 px, warm/yellow/green) inside the basket grid. Hold L 70–87.
- **Staging:** SH04 end state (MAN's dot in lane 3 with "1/3 · แบบจำลอง", eyebrow on). No dot moves; no number, "%" or time (VD09a).
- **Camera:** scale 1.05 and the SH04 end drift held (no move).
- **Sound:** model bed; `ui_click-tick_01` at L 54 (pitched +3 st) and L 64 (−2 st), −14 dB; optional NEEDS-GEN soft wobble tick only if these read as UI.
- **Caption:** "นี่แค่แบบจำลองง่าย ๆ นะ… ของจริงไม่ได้เท่ากันเป๊ะ" f662–748.
- **Accept (brief spike 8):** both icons read as icons on the same paper at 270 px; "1/3 · แบบจำลอง" still legible. Fallback: sign only.

### S01-B04-SH01 · 745–800 · back in the store, neck craned

- **Time:** L11 f749–798 = L 4–53. Crane-neck lean L 0–20, hold.
- **Staging (SD05):** MAN at lane 2 S4 (0, 0, −3.10) facing +z: **`man-parted + new: rush-hour-blazer, P30, suspicious`** (left hand at the brow, right arm down with the basket), head right, headCock +6. Lane 3 queue: `man-spiky`, `woman-curly`, `man-buzz` at (2.20, 0, −2.20 / −3.10 / −4.00), standing.
- **Camera:** `cam: T-MAN (0, 1.55, −3.10), yaw +25→+18, r 2.0→1.8, eye 1.50, f 1050, hy 640`. `meas` (same relative set-up): MAN centred, head 194→216 px, body 945→1050 px.
- **Sound:** MUZ-B (detuned) from L0, −18 dB, ducked; RT-STORE back from L0.
- **Caption:** "แต่ทำไมมันรู้สึกเหมือนแพ้ทุกที" f749–803.
- **Accept:** reads as the same store; his gaze is off his own lane.

### S01-B04-SH02 · 800–887 · eyes track lane 3 (CL02)

- **Time:** L12 f804–884 = L 4–84; "ตอนรอ…" ≈ L 36. Eyes track a lane-3 shopper from L 36: look [+0.4, 0] → [+0.9, 0.05] over L 36–84, two small re-catches at L 50 and L 66; no glance toward his own lane.
- **Staging:** MAN as SH01, P01 (hand down from the brow at L 0–8).
- **Camera:** `cam: T-MAN (0, 1.55, −3.10), yaw +10, r 1.05→0.95, eye 1.55, f 1150, hy 720`. `meas`: head 405→448 px, chin y 851→865.
- **Sound:** MUZ-B continues, low.
- **Caption:** "มีคนอธิบายว่า… ตอนรอ เรามักจ้องแถวอื่น" f804–890.
- **Accept:** the eye motion is visible at 270 px (pupil travel ≥ 6 px at 270).

### S01-B04-SH03 · 887–954 · overtakes counted (tallies)

- **Time:** L13 f891–952 = L 4–65. Three lane-3 shoppers walk +z past MAN's depth (z −3.10): heads cross it at L 12, L 30, L 48; red chalk strokes (`new: tally doodle`) draw on over 4 f at L 14, L 32, L 50, grouped as a hand tally in y 220–520 above his head.
- **Staging:** lane 3 walkers `man-spiky`, `woman-curly`, `man-buzz`, each a 0.90 m walk step every 12 f, paths (2.20, 0, −3.90)→(2.20, 0, −2.30); MAN `suspicious`→`angry` at L 32, eyes follow each walker.
- **Camera (SD04):** `cam: T-MAN (0, 1.55, −3.10), yaw −30→−36, r 1.8, eye 1.50, f 900, hy 680, cx −220`. `meas`: MAN x 320, head 185 px, body 900 px; walkers at x 697 → 1260 as they pass, behind him to the right.
- **Sound:** `ui_click-tick_01` at L 16, 34, 52 (one per stroke, −12 dB); MUZ-B low.
- **Caption:** "ใครแซงเราไป… เรามักนับไว้เป็นพิเศษ" f891–957.
- **Accept (brief spike 5):** three strokes on three passes; no digits.

### S01-B04-SH04 · 954–1024 · his own overtake, no tally

- **Time:** L14 f958–1021: "แต่ตอนเราแซงคนอื่น…" L 4–32, "มักไม่ทันสังเกต" L 37–67. Lane 2 advances one step L 8–20: MAN (0, 0, −3.10)→(0, 0, −2.20), passing `woman-pixie` stuck at lane 1 (−2.20, 0, −2.65) at about L 14. His head stays turned right (to lane 3) throughout.
- **Staging:** the three strokes stay above his head, no fourth. `woman-pixie, P01, neutral` + `girl-school` beside her.
- **Camera (SD04):** `cam: T-MAN (0, 1.55, −2.65), yaw +30→+36, r 2.1, eye 1.50, f 900, hy 680, cx +200`. `meas`: MAN x 821→603, head 134→192 px, body 651→933 px; pixie x 204→268 behind-left (lane 1 visible).
- **Sound:** **no tick** (silence policy 2); MUZ-B low.
- **Caption:** "แต่ตอนเราแซงคนอื่น… มักไม่ทันสังเกต" f958–1027.
- **Exit:** MAN at (0, 0, −2.20) = B05 position. **Accept:** three strokes at the last frame; the pass is visible.

### S01-B05-SH01 · 1024–1149 · memory bubbles (LF03)

- **Time:** L15 f1028–1146: "ความจำก็ช่วยซ้ำเติม…" L 4–42, "วันที่รอจนหัวร้อน มักติดอยู่ในความจำ" L 47–122. Pale bubble pops L 8, hot red bubble pops L 14 (trail puffs 3 f apart); red sharpens + MAN-in-bubble steams at L 62 (≈ "หัวร้อน", est); pale fades 100 → 40 % over L 66–122 and **stays** (VD12).
- **Staging:** LF03 v2: MAN at (0, 0, −2.20), `neutral` → `angry` at L 62 (3 f blend), hold to L 100, back to `neutral` by L 106 (R1.2); bubbles (`new: memory-bubble`) in y 220–700: left hot red (`furious` MAN in a long queue), right pale `#c9cfd6` (`happy` MAN at a smooth checkout). No text.
- **Camera:** LF03 v2: `cam: T-MAN (0, 1.55, −2.20), yaw −10→−4, r 1.5→1.4, eye 1.5, f 1100, hy 1000`. `meas`: head top y 780→764, chin y 1051→1055 (above the band).
- **Sound:** MUZ-B low-passed (~800 Hz); RT-STORE low-passed; SFX-MEMSWELL from L 4; `ui_pop_01` L 8, L 14; `stinger_low-muted-hit_01` L 62 (−10 dB); the pale fade has no hit.
- **Caption:** "ความจำก็ช่วยซ้ำเติม… วันที่รอจนหัวร้อน มักติดอยู่ในความจำ" f1028–1152.
- **Accept:** the pale bubble is visible (≥ 40 %) on the last frame; no caption names it.

### S01-B05-SH02 · 1149–1256 · stamp, then crack

- **Time:** L16 f1153–1254: "คำว่า" L 4–15, "ฉันซวยตลอด" L 20–47, "เลยฟังดูจริง…" L 52–75, "ทั้งที่อาจไม่ใช่" L 80–105. `new: stamp text` "ซวยตลอด" thunks on at L 20 (scale 1.3 → 1.0 in 4 f, rotation −6°), over MAN's chest; R1.2: drawn at 0.9 scale, centre y 1038, box ~y 940–1140 (over the jaw, mouth and eyes clear); crack line draws through it L 91–97 (≈ "อาจไม่ใช่", est), halves offset 8 px (R1.2, was 4).
- **Staging:** MAN (0, 0, −2.20) `sad`→`neutral` (a small look-up at the crack, L 92–100).
- **Camera:** `cam: T-MAN (0, 1.55, −2.20), yaw 0, r 1.30→1.20, eye 1.55, f 1100, hy 860`. `meas`: head 313→339 px, chin y 962→970; stamp sits between chin and band.
- **Sound:** SFX-STAMP L 20 (−8 dB); SFX-CRACK L 91; MUZ-B low-passed continues; RT-STORE low.
- **Caption:** "คำว่า "ฉันซวยตลอด" เลยฟังดูจริง… ทั้งที่อาจไม่ใช่" f1153–1259.
- **Accept:** stamp bottom ≤ y 1140; the crack is visible at 270 px.

### S01-B06-SH01 · 1256–1341 · refit wide (LF04)

- **Time:** L17 f1260–1339: "หลายที่ใช้แถวเดียว…" L 4–34, "ช่องไหนว่าง ก็เรียกคนถัดไป" L 38–83. Queue shuffles one 0.45 m step L 40–52 (same rate as B01); till-2 lamp green, steady (no ding here; the one ding calls MAN in SH02).
- **Staging:** LF04 v2 refit, `b06Cast`: MAN (0, 0, −3.05) **`man-parted + new: rush-hour-blazer, P01, new: content`** (eyes shut, small smile), basket in right hand; `woman-long, P01, neutral` next; 9 customers in the serpentine. No clock, timer or display (VD13).
- **Camera:** LF04 v2: `cam: T-HEAD (0, 1.55, −3.00), yaw +4→+2, r 3.5→3.2, eye 2.0, pitch −3, f 1050, hy 640, cx 0`. `meas`: MAN head 109→118 px, body 517→563 px.
- **Look:** B06 warmer grade (−5 % blue).
- **Sound:** MUZ-C (calm) from L0, −18 dB, ducked; RT-STORE.
- **Caption:** "หลายที่ใช้แถวเดียว… ช่องไหนว่าง ก็เรียกคนถัดไป" f1260–1344.
- **Accept (brief spike 6):** one line feeding three tills at 270 px; count = B01 ± 1.

### S01-B06-SH02 · 1341–1520 · calm, "…สบายจัง"

- **Time:** L18 f1345–1444 = L 4–103 (phrases L 4, 50, 79). Ding + till-2 lamp pulse (glow 0.3 → 0.45 → 0.3 over 8 f) at L 105. L18a MAN f1452–1516 = L 111–175. Eyes open L 112–120 (`content` → eyes open, `happy` small smile); exhale shoulders L 118–140; first step toward +z L 170–179 (cut on action).
- **Staging:** MAN (0, 0, −3.05) **P44** hands behind back, basket hanging from both hands behind him (brief VD13); at L 160–170 he brings the basket to his right hand (P01) for the step.
- **Camera:** `cam: T-HEAD (0, 1.55, −3.00), yaw −12→−18, r 1.4→1.25, eye 1.55, f 1100, hy 720`. `meas`: head 281→314 px, chin y 811→822.
- **Sound:** MUZ-C continues; `ui_notification-ding_01` at L 105 (−10 dB, dry); L18a +3 dB, no reverb.
- **Caption:** "ไม่มีแถวข้าง ๆ ให้อิจฉา… หลายคนรู้สึกว่ายุติธรรมกว่า" f1345–1450; "…สบายจัง" f1452–1520.
- **Accept:** eyes shut through L18 read calm, not asleep or laughing (the `content` face is `unknown` on its own; check on this shot).

### S01-B06-SH03 · 1520–1657 · walk to till 2, hold, fade (bookend)

- **Time:** walk L 0–60; turn ~20° to the counter and two-hand set-down of the basket L 60–80; back to facing +z, hands loose, L 80–92; L20 f1528–1597: "ไม่ต้องเปลี่ยนแถวอีกแล้ว…" L 8–37, "แค่รอให้ถึงคิวของเรา" L 42–77. Cashier smile L 70; she lifts the noodles and scans L 95–125. Live hold L 77–137 (2.0 s: breath, blinks at L 90 and L 120, slow scan, push easing out); fade to black L 107–137 (`endFadeSec` 1.0).
- **Staging (SD07, SD08):** MAN `man-parted + new: rush-hour-blazer, P01 → walk → P01, new: content → happy` from (0, 0, −1.60) to lane-2 S1 (0, 0, −0.40) at 0.6 m/s, facing +z; basket set on the belt end at (0.62, 0.85, −0.65). Cashier **`woman-ponytail + vendor (apron retint #2f8a5e, badge), P25, happy`** at (1.65, 0, −0.20) facing −x. `woman-long` next in line at (0, 0, −2.00) behind him, then the queue. Eyes forward or on the cashier only; never toward another lane (brief spike 7). No timer, clock or display.
- **Camera (FX-L20-01):** `cam: T-TILL2 (+0.20, 1.40, −0.50), yaw −25→−18 arc, r 3.9→3.6 push, ease-out reaching 99 % of travel by L 120, eye 1.80, pitch −5, f 860, hy 760`. `meas` at L 137: MAN x 500, head **92 px** (bookend band 81–99 px vs S01-B01-SH01's 90 px), body 433 px; cashier x 875; register spans x 667–764; basket x 571–663 (handoff H2).
- **Look:** till-2 green glow ≤ 0.3 on his shoulder; B06 grade.
- **Sound:** MUZ-C settles on its resolving chord under L20 (or `stinger_outro-resolve_01` layered from L0); SFX-SCAN single at L 105 (−20 dB), one more at L 125 optional; RT-STORE low; everything fades with the picture to digital silence at L 136. No muzak return, no stinger, no end card.
- **Caption:** "ไม่ต้องเปลี่ยนแถวอีกแล้ว… แค่รอให้ถึงคิวของเรา" f1528–1603; none in the hold.
- **Accept:** head 81–99 px on the last pre-fade frame (L 106); basket and hand clear of the register; f1656 full black and silent.

---

## Boss and Editor handoff (W5.2)

**Shot groups for painting (one shot = one scene):** G1 store B01–B02 (LF01 v2): B01-SH01, SH02, B02-SH01–SH04, B03-SH01 (freeze + crane); G2 `PLAN` (LF02): B03-SH02–SH05; G3 store B04 + memory (LF01/LF03): B04-SH01–SH04, B05-SH01, SH02; G4 refit (LF04 v2): B06-SH01–SH03.

| # | Owner | Item | Acceptance |
| --- | --- | --- | --- |
| H1 | Boss (Editor confirms on the draft) | **Head-height measure**, S01-B06-SH03 end vs S01-B01-SH01 end | Measured on rendered frames (S01-B01-SH01 f55, S01-B06-SH03 L 106 = f1626): MAN head within ±10 % (planned 90 vs 92 px). Fallback: keep f 860 and lower yaw to −14 (FX-L20-01) or end r 3.5 |
| H2 | Boss | **Till-2 register** vs MAN's basket hand (S01-B06-SH03 L 60–137) | Register (x 667–764 planned) never covers the basket or his hand; planned clearance only 4 px, so check the rendered set-down frame L 80 at full size. Fallback: basket at x 0.58, or the FX-L20-01 yaw −14 fallback |
| H3 | Boss | **Coin gag at 270 px** (S01-B02-SH03) | On a `qa-sheet.sh` 270 px sheet of L 10, 20, 30: coin stack, the elder's hand and MAN's face all read; stack grows by one coin per frame group. If not: raise coin exaggeration to ×2 (Ø 0.05 m) and record it, or push r to 1.6 |
| H4 | Editor | **Trombone vs "อ้าว…"** (S01-B02-SH04) | Two mixes compared by ear: (A) `stinger_wahwah-fail_01` at L 26, −6 dB under the speech until L 33; (B) sting at L 33, cut by the f311 silence. "อ้าว…" must stay fully intelligible; pick one, record in build-notes. If neither works, NEEDS-GEN a 0.6 s trombone "wah-wah" that ends by L 42 |
| H5 | Editor | **VL-EDIT-01** narration assembly + `narration-lock.json` | All onsets within ±2 f of the placement table; else back to Film |
| H6 | Editor | NEEDS-GEN sounds: MUZ-A/B/C, RT-STORE, SFX-SCAN, SFX-COIN, SFX-BOING, SFX-STAMP, SFX-CRACK, SFX-MEMSWELL | `sound-generation` skill; filed in the library with sidecars; ear-checked |
| H7 | Boss | Crane end + dissolve (S01-B03-SH01, SD06) | Lanes within ±40 px at y 560 ± 60 on the L 34 frame; ceiling hidden for pitch < −30°. Fallback: hard cut on the freeze |
| H8 | Boss | `new:` assets still `missing` (brief N1–N7 minus what LF01–LF04 v2 already built in `src/painted/edu04/`): `new: pineapple`, `new: coin purse + coins`, `new: coin-count motion`, `new: plan icons` (price-check sign, trolley) + paper wobble, dot hop with `manLane` tween, tally draw-on, stamp crack, `new: content` → open-eye transition, basket two-hand set-down, B02 lane-switch path around the counter tail, `woman-curly` lane change (SD02) | Each on its first consuming shot's blockout; kit intake (KIT-P01) at delivery: basket, trolley, coin-count, `SET-CHECKOUT` → `PLATES` |
| H9 | Editor | Composition registration, scene IDs = shot IDs, `durationFrames` 1657, `A_fade` values, caption cues as listed | Timeline seek check; captions only in their ranges |

## Dependencies and open items

| Owner | Item | Status |
| --- | --- | --- |
| Film | Segment-to-line mapping of take 3 (by order) | unverified until H5 |
| Film | FG-01: till-line alignment dropped (SD06); brief acceptance 4 amended here | approved by the user in chat, 2026-11-05 (lane alignment instead of till line y 300; hard cut on the freeze stays the fallback) |
| Film | Lead-size rule (≥ 480 px): S01-B01-SH01 (390–422 px) and S01-B06-SH03 (≤ 433 px) are below it by the approved LF01 v2 framing and the bookend; S01-B03-SH01 crane is a reveal | recorded deviation, not a new decision |
| Boss | `content` face reads calm (S01-B06-SH01/SH02) | unknown |
| Editor | MAN/CSH clips' wording/timbre (user passed by ear 2026-11-05) | done |

Element captures: LF01–LF04 v2 (`out/edu04/look-frames/v2/`, asset-store copy pending per [task.md](task.md)); no new captures for this revision.

## Change log

- **EDU-EP04-SHEETS-R1.2 (2026-11-06, Film G3 review):** S01-B04-SH01/SH02: lane-3 queue off frame right under the sheet cameras is accepted (SD11); gaze carries it, walkers first seen in SH03. S01-B04-SH04: lane 1 as `woman-pixie` + `girl-school` head and shoulders over the rack, `man-shaved` dropped from this shot, walkers held at z −0.5 / −1.4 / −2.3 accepted (SD13). S01-B05-SH01: wince at L 62 read as tired, now `angry` L 62–100, `neutral` by L 106. S01-B05-SH02: stamp 0.9 scale, centre y 1038, box ~940–1140 accepted (SD12; jaw overlap only, band clear); crack halves offset 4 → 8 px for 270 px legibility. Head turn by eye look + 6° cock + quarter body accepted.
- **EDU-EP04-SHEETS-R1.1 (2026-11-05, Film G2 review):** S01-B03-SH02: "ถ้าทุกแถวเท่ากัน" ~92 px accepted; eyebrow = plate-drawn LF02 pill, scene eyebrow unset. SH03: at L 140 the glow returns to lane 2 with the "1/3" lockup. SH05: price-check sign moved onto the till-1 icon (pad centre (364, 186), 80 × 64 px, stick to (364, 267)); paper wobble peak 6 px; trolley handle bar + goods. No script, shot ID, timing or look change.
- **EDU-EP04-SHEETS-R1 (2026-11-05, Film W5.1):** first timed sheet. Timing from the take-3 segment spans plus the planned pause edit VL-EDIT-01 (in-line 0.28 → 0.15 s, between-line 0.28 → 0.22 s from L07; Editor applies). End hold 2.5 → 2.0 s (coordinator, ~55 s target). Total 1657 f = 55.23 s (≤ 60 s). B01–B02 + L06 frames kept from the W4.x retime (f0–f360). FX-L20-01 camera written into S01-B06-SH03. Staging deviations SD01–SD08 from LF01 v2 and the projection run. `review-rows.json`: `start`/`end` set to these frames, `untimed` removed, S01-B06-SH03 `seen` hold "ราว 2.5 วินาที" → "ราว 2 วินาที".
