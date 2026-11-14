# Storyboard — EDU-EP18-SHORT (timed scene sheet)

Deliverable: `EDU-EP18-SHORT` · Revision: **EDU-EP18-SHEET-R1.1 (timed scene sheet, W3 look-frame revision)** (Film, 2026-11-14; R1 same day).
Inputs: [script.md](script.md) EDU-EP18-SCRIPT R2.2 (user-locked) · Boat's R2 check (recorded in script.md; research in [../ep16/research-r2.md](../ep16/research-r2.md)) · [film-brief.md](film-brief.md) **EDU-EP18-BRIEF-R1** · series decisions in [EP16 brief](../ep16/film-brief.md) · voice lock: EP18 narration R2.2 (`ep18_narration_kore_x1.05.5bfff882.wav`) + R2.2 character takes; W-PHONE 2.0 s, W-SHOP 1.7 s, end hold 2.0 s (user, 14 Nov 2026).
Target: worktree `adoring-panini-24500a`, branch `claude/education-oak-street-dino-23617a` at `d4f0ee2` (uncommitted EP16–18 files) · 30 fps · **durationFrames 1737 (57.90 s)** · 1080×1920 · one scene S01, offset 0.
Evidence: timing measured from the audio files by silence detection (voice-take R2.2/R2.3; `out/voice/ep16-18-r23/est.py` model, re-run in Film's scratch `tl.py`); not listened by Film. Camera numbers are design estimates checked with `scripts/shot-projection.py` (each world-space shot, start and end camera); no look frame, plate, blockout or render exists yet. Readiness: **ready for look frames (W3) and Boss/Ton intake; not ready-for-dev until the user passes the look frames and the new looks** (see Dependencies).
Rows file: [review-rows.json](review-rows.json) **EDU-EP18-ROWS-R1.2** (Thai, timed; look frames v16). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (scene S01, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`. Character takes and W rows are placed by the est.py model: lead 0.25 s, narration gaps as read, +0.2 s padding next to character/W items; W-PHONE 2.0 s and W-SHOP 1.7 s are picture-only gaps; W-KITCHEN 1.2 s; L07 onset to L09 onset kept at 266 f (8.87 s).
- Spaces (brief [projection contract](film-brief.md#projection-contract)): `VIL` village (m; origin on the ground at the yard centre, +x east, +y up, +z south toward the usual camera), `RIV` river (m; origin on the near bank waterline at the fishing spot, +x downstream, +z toward the bank), `SHOP` (m; origin at the shop floor centre, +z toward the door), `UNDER` is the part of `VIL` under the house (same axes). Screen: px, origin top-left, y down.
- Camera lines use the kit yaw camera `camMove(at, yaw, r, eye, {f, hy, pitch})`: camera at `at + r·(sin yaw, 0, cos yaw)` at height `eye`, yaw 0 = camera on +z of the target. `proj` lines are `scripts/shot-projection.py` output (start → end; `band` = touches y 1176–1344, `cropped` = partly out of frame by design unless flagged).
- Caption band y 1176–1344 (edu stroke captions, `captionStyle.position` bottom); faces, contacts, cards and reveals above y 1160; `@TamMaiLa` mark top-left (keep x < 330, y < 140 clear). Lead ≥ 480 px applies to M/MC/CU shots; W/EW shots are named wides and list the lead height for reference.
- Sizes: EW extreme wide, W wide, M medium, MC medium close, CU close, INS insert, MAC macro, OH overhead.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| ยาย (Y) | `woman-elder + new: isan-home (pha sin, loose cotton blouse, pha khao ma at the waist; kitchen-apron over it in morning shots)`, P01/P34/P32, worried/stern/laugh | 1.52 m; voice Gacrux (character takes); four views squared to the lens |
| เก่ง (K) | `boy-school + new: kid-home (faded tee, shorts, flip-flops)`; fallback `boy-school + park-casual` with a recorded reason | 1.30 m, about 10; voice Leda boy |
| Shopkeeper | `woman-bob + new: isan-home`, P16 reach, worried | 1.60 m |
| Hen (K01) | `new: Thai backyard hen (gai ban: red-brown, black tail, small comb)`, peck/trot/head-tilt/huddle/cluck | 0.42 m to the comb; three-toed scaly feet readable in CU |
| Long-necks | `new: long-neck herd far` (sh3), `new: long-neck silhouette` (sh5, sky layer) | props only |

## Shot map

| # | Shot | Beat | Lines | Range | Len | Start s | Size | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 | [0, 92) | 92 | 0.00 | EW | Signature (shared with EP16 shot 1) |
| 2 | S01-B01-SH02 | B01 | L02 | [92, 122) | 30 | 3.07 | W | Morning reveal (held start framing of EP16 shot 2) |
| 3 | S01-B01-SH03 | B01 | L02 | [122, 190) | 68 | 4.07 | W | K01: Keng drinks from the stream; long-necks wade upstream |
| 4 | S01-B01-SH04 | B01 | L02, V01 | [190, 303) | 113 | 6.33 | M | Night: Keng curled on the mat; "แต่อยู่ในครัว"; V01 Grandma's phone |
| 5 | S01-B02-SH05 | B02 | W-PHONE | [303, 369) | 66 | 10.10 | W | W-PHONE: Grandma climbs the ladder, phone held to the sky |
| 6 | S01-B02-SH06 | B02 | L03 | [369, 435) | 66 | 12.30 | INS | L03: the phone screen: full battery, no bars |
| 7 | S01-B02-SH07 | B02 | L03 | [435, 488) | 53 | 14.50 | EW | L03: high wide, the village with no tower on the skyline |
| 8 | S01-B02-SH08 | B02 | L03b | [488, 528) | 40 | 16.27 | M | L03b: Grandma thumbs the phone torch on (K03) |
| 9 | S01-B03-SH09 | B03 | W-SHOP, L04 | [528, 627) | 99 | 17.60 | M | W-SHOP/L04: the village shop at night; a few boxes |
| 10 | S01-B03-SH10 | B03 | L04 | [627, 700) | 73 | 20.90 | CU | L04 "ใช้แล้วหมด": the last box handed over; the shelf bare |
| 11 | S01-B04-SH11 | B04 | V04 | [700, 788) | 88 | 23.33 | M | V04: Grandma scolds while wiping his forehead |
| 12 | S01-B04-SH12 | B04 | V05 | [788, 855) | 67 | 26.27 | CU | V05: weak, eyes half closed, a guilty smile |
| 13 | S01-B04-SH13 | B04 | L05 | [855, 937) | 82 | 28.50 | M | L05: Keng limp and pale on the mat |
| 14 | S01-B04-SH14 | B04 | V02 | [937, 1036) | 99 | 31.23 | CU | V02: "ยาย… หิวน้ำ" whisper |
| 15 | S01-B04-SH15 | B04 | L06 | [1036, 1138) | 102 | 34.53 | INS | L06: the water jug level drops (slow dissolve) |
| 16 | S01-B04-SH16 | B04 | L06b | [1138, 1222) | 84 | 37.93 | M | L06b: by the torch, the low jug, his dry lips; the beam drifts up to the shelf |
| 17 | S01-B05-SH17 | B05 | W-KITCHEN | [1222, 1264) | 42 | 40.73 | CU | W-KITCHEN: the beam lands on the sugar jar and the salt jar |
| 18 | S01-B05-SH18 | B05 | L07 | [1264, 1394) | 130 | 42.13 | OH | L07: overhead, Grandma's hands make the drink; the recipe card |
| 19 | S01-B05-SH19 | B05 | L08, L08b | [1394, 1530) | 136 | 46.47 | M | L08/L08b: cup to his lips; the jug refills; held with the safety text |
| 20 | S01-B06-SH20 | B06 | L09 | [1530, 1623) | 93 | 51.00 | M | L09: morning; Keng sits up sipping by himself; hens in the yard |
| 21 | S01-B06-SH21 | B06 | L09 | [1623, 1659) | 36 | 54.10 | CU | L09 "อยู่ในครัวคุณมาตลอด": push in on the jars |
| 22 | S01-B06-SH22 | B06 | V03 | [1659, 1737) | 78 | 55.30 | M | V03 hen cluck; hold on Keng, Grandma and the cup |

Total 1737 f = 57.90 s; 22 shots; shots tile [0, 1737) with no gap.

## Voice and subtitle cues (global frames)

| Item | Speaker | Item range | Voice | Source |
| --- | --- | --- | --- | --- |
| L01 | ผู้บรรยาย | [8, 104) | [8, 104] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L02 | ผู้บรรยาย | [114, 217) | [114, 217] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| V01 | ยาย | [223, 297) | [233, 289] | `out/voice/ep16-18-r23/send/ep18_V01_grandma.wav` |
| W-PHONE | — | [303, 363) |  | picture only |
| L03 | ผู้บรรยาย | [369, 479) | [369, 479] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L03b | ผู้บรรยาย | [488, 522) | [488, 522] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| W-SHOP | — | [528, 579) |  | picture only |
| L04 | ผู้บรรยาย | [585, 694) | [585, 694] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| V04 | ยาย | [700, 782) | [707, 772] | `out/voice/ep16-18-r23/send/ep18_V04_grandma.wav` |
| V05 | เก่ง | [788, 849) | [792, 838] | `out/voice/ep16-18-r23/send/ep18_V05_boy.wav` |
| L05 | ผู้บรรยาย | [855, 931) | [855, 931] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| V02 | เก่ง | [937, 1030) | [946, 1022] | `out/voice/ep16-18-r23/send/ep18_V02_boy.wav` |
| L06 | ผู้บรรยาย | [1036, 1126) | [1036, 1126] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L06b | ผู้บรรยาย | [1138, 1216) | [1138, 1216] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| W-KITCHEN | — | [1222, 1258) |  | picture only |
| L07 | ผู้บรรยาย | [1264, 1382) | [1264, 1382] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L08 | ผู้บรรยาย | [1394, 1412) | [1394, 1412] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L08b | ผู้บรรยาย | [1426, 1515) | [1426, 1515] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| L09 | ผู้บรรยาย | [1530, 1653) | [1530, 1653] | `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2) |
| V03 | ไก่ | [1659, 1677) | [1659, 1677] | Ton NEEDS-GEN (hen cluck) |
| hold | — | [1677, 1737) | — | end hold 2 s (est.py rule) |

Subtitles: every narration and character line, exactly the script text (Thai unchanged); no subtitle on W rows or the hen cluck. Narration subtitle on the voice range; character subtitles on their voice range.

## Word-pegged key frames

- L02 "ไม่ได้อยู่ร้านยา" f158, "แต่อยู่ในครัว" f196 (measured)
- W-PHONE 2.0 s f303–363; W-SHOP 1.7 s f528–579 (picture holds; L04 at f585)
- L03 phrases ≈ f408 / f435 (est, syllable)
- L04 "ใช้แล้วหมด" f669 (measured)
- L05 f907; L06 f1085, f1105; L06b "เกลือก็ด้วย" f1197 (measured)
- L07 "น้ำต้มสุกหนึ่งลิตร" ends f1294; "น้ำตาลหกช้อนชาปาด" f1302–1342; "เกลือครึ่งช้อนชาปาด" f1352–1382 (measured)
- L08b "ต้องรีบหาหมอ" f1488 (measured)
- L09 "แต่ยาที่ช่วย" f1581, "อยู่ในครัวคุณมาตลอด" f1623 (measured)
- OQ4 window: L07 onset f1264 → L09 onset f1530 = 266 f = 8.87 s (design 8.88 s; frame rounding)

## On-screen text (global ranges)

- Recipe card (slot RCP, crisp SVG over a painted paper card, top of frame): x 120–888, y 160–500 (R1.1: every screen layer stays inside x 120–888, clear of the right rail). Three lines, numerals 88 px bold, words 60 px: line 1 "น้ำต้มสุก 1 ลิตร" on at f1264; line 2 "น้ำตาล 6 ช้อนชาปาด" on at f1302; line 3 "เกลือ ครึ่งช้อนชาปาด" on at f1352 with the footnote "ช้อนชามาตรฐาน" (40 px) under it. Each line pops in over 6 f. Full size to f1394, then shrinks over 10 f to a compact chip (x 528–888, y 160–330, numerals 48 px, words 30 px) and stays to f1530; fades out f1530–1545.
- Safety strip (slot SAF): "ในชีวิตจริง: ดื่มไม่ได้ หรืออาการหนัก ต้องรีบหาหมอ" f1264–1515 on a dark band x 120–888 (R1.1: it does not fit one 48 px line in 768 px, so it breaks into two 44 px lines, "ในชีวิตจริง: ดื่มไม่ได้ หรืออาการหนัก" / "ต้องรีบหาหมอ"; band height 104 px); y 515–619 while the card is full, moving up to y 345–449 with the chip at f1394–1404. Second message "มีซองเกลือแร่ ใช้ซองก่อน" f1426–1515 on its own band directly under it (44 px, y 459–519). Fades with L08b at f1515.
- Decision: the safety strip stays on screen for its whole range even though the L08b subtitle repeats its words at the bottom (open question Q2).
- Phone screen (shot 6): icons only (battery full, empty bars with ✕), no words.

## Rules for every shot

- R01 Truth limits: dinosaurs are hazards or props only (no species name on screen, no film likeness); creatures are partial builds as listed (head/neck, foot/head, silhouettes, far herds).
- R02 Size reference: every shot keeps one known-size reference in frame (K 1.30 m, Y 1.52 m, a hen, the fence 1.2 m, a cup or jar).
- R03 Feet on the ground: planted feet sit on y 0 (or the platform/veranda/granary floor y named in the shot); no float, sink or slide while planted.
- R04 Screen: faces, contacts, cards and reveals above y 1160; the caption band calm (mean ≤ 0.25, p95 ≤ 0.40 on clean frames, `scripts/caption-zone.py`).
- R05 Retention camera (channel): every shot has a small eased yaw arc (6–10°) and a 5–15 % push unless the shot says hold; frame 0 of shot 1 already shows the rippling sky.
- R06 Light marks the chapter (brief visual progression); night shots use the opaque cast base (DF-20261031-painted-opaque-cast).
- R07 Ambient clocks: fire, hens, fronds, water and mosquitoes run on ambient clocks through holds (DF-20261030-painted-story-hold-ambient-clock); event clocks are shot-local.
- R08 Four views squared to the lens: Y, K, villagers and the hen pick the view by the camera yaw (front / 3/4 / side / back), view cues on.
- R09 K02/K03 path: shelf jars dark in sh4 (background) → the torch beam (K03) finds them in sh16–17 → recipe sh18 → morning push-in sh21.
- R10 Recipe accuracy: the hands show exactly 6 level teaspoons of sugar and ½ level teaspoon of salt, each scraped flat with the knife, into 1 L of boiled water that has cooled (no steam). Spoon count on screen must match the card.

## Per-shot staging

Key frames are shot-local `+n`. Every library ID in a Sound line is a candidate only (not listened); Ton checks it against the description, otherwise NEEDS-GEN. Codes (A-, M-, S-, E-) are defined in the [EP16 brief sound direction](../ep16/film-brief.md#sound-direction).

**1. S01-B01-SH01** [0, 92), 92 f. Signature (shared with EP16 shot 1). VO: L01 voice f8–104 (+8–+92).
- Camera: `cam: at (-1, 2, -6), yaw 35→32, r 22→20.5 m, eye 1.6, f 760, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: house_ridge 201 px, x 382, y 728–929 → 215 px, x 365, y 717–932; coop 66 px, x 691, y 880–946 → 70 px, x 710, y 880–950; gate 36 px, x 721, y 892–928 → 38 px, x 724, y 893–931; conifer 555 px, x 810, y 355–910 → 565 px, x 796, y 345–910. Wide: no lead check.
- Staging: Identical to EP16 shot 1 (shared module).
- Key frames: +0 ripple moving; +8 VO; +84 white bloom; cut in white at +92.
- Sound: A-VN; S-WORM (shared). No music.
- Entry → exit: +0 night wide → +91 white.

**2. S01-B01-SH02** [92, 122), 30 f. Morning reveal (held start framing of EP16 shot 2). VO: L02 voice f114–217 (+22–+30).
- Camera: `cam: at (-1, 2, -6) → (1.5, 1.5, -9), yaw 32→22, r 20.5→15 m, eye 1.6→1.5, f 760, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: K_start 49 px, x 410, y 892–941 → 83 px, x 114, y 893–976; K_coop 54 px, x 642, y 893–947 → 88 px, x 497, y 893–981; K_gate 41 px, x 724, y 890–931 → 56 px, x 613, y 889–945; conifer 565 px, x 796, y 345–910 → 651 px, x 680, y 262–913. Wide: no lead check.
- Staging: Hard cut to VIL morning, same framing (EP16 shot 2 start camera, held with a 3° drift). Empty yard; the forest wall beyond the fence.
- Key frames: +0 white → morning; +22 L02 starts; +29 last frame.
- Sound: M18 enters soft: kalimba + phin, two notes (about 72 bpm); A-VM.
- Entry → exit: +0 → +29 morning yard.

**3. S01-B01-SH03** [122, 190), 68 f. K01: Keng drinks from the stream; long-necks wade upstream. VO: L02 voice f114–217 (+0–+68).
- Camera: `cam: at (0, 0.8, 0.2), yaw 75→68, r 3.2→2.8 m, eye 0.8, f 880, hy 940`, ease in-out over the shot (est) (space RIV).
- proj: K_kneel 300 px, x 542, y 893–1193 [band] → 349 px, x 561, y 885–1234 [band]; herd 147 px, x 368, y 803–950 → 152 px, x 256, y 798–950. Lead: K_kneel.
- Staging: SET-RIVER, bright: K kneels at R2 (0.4, 0, 0.3) and drinks straight from his cupped hands; far upstream (≈70 m) a herd of long-necks wades and splashes (`new: long-neck herd far`, flat painted layer).
- Key frames: +0 hands to mouth; +36 "ไม่ได้อยู่ร้านยา"; +40 one long-neck splashes; +67 last frame.
- Sound: M18 under; A-RV; S18-01 slurp from the hands +4 (small, close); far heavy splashing +40 (distant, low).
- Entry → exit: +0 drinking → +67 still drinking, herd behind.

**4. S01-B01-SH04** [190, 303), 113 f. Night: Keng curled on the mat; "แต่อยู่ในครัว"; V01 Grandma's phone. VO: L02 voice f114–217 (+0–+27); V01 voice f233–289 (+43–+99).
- Camera (R1.1, user check of the lying grandson 14 Nov 2026): `cam: at (-4.6, 0.75, -4.5), yaw 12→6, r 2.05→1.9 m, eye 1.05, f 1000, hy 750`, ease in-out over the shot (space VIL). Matches LF18-UNDER (`CAM18_4`, src/painted/survival/look-b.tsx).
- proj (Film probe of the look-frame camera; +0 / +60 / +112): Y_kneel lead 481 / 505 / 525 px, mat contact (knees and shins) y 995 / 1007 / 1017; K_lie (+60) head x 345, y 1001 → feet x 889, y 1074, his mat contact y 1066–1081 along the body; lamp x 946, y 943 (clear of his feet); shelf K02 x 674, y 740 (right of Y's head); jug x 739, y 941; platform mat front edge y 1167–1221 (the only thing in the band). Lead: Y_kneel. Every face and contact is above y 1160 (R1 had Y's knees in the band at y 1179–1208).
- Staging: SET-UNDER (under-house kitchen-living area) at night, one oil lamp on the platform at (−3.72, 0.62, −5.0). Both on the bamboo platform mat (top y 0.46; R1.1 contact height, was 0.45 = 1 cm into the mat). K lies on his side (P37, front view, head to frame left, `sad`, clutching his belly) at (−3.95, 0.46, −4.45), the length of his body along screen x; Y kneels (P34, front view) at (−5.15, 0.46, −4.75) on his head side, holding an old phone to her ear (P20 via the kneeling arm), `worried`, eyes on him. Clay water jug (`JUG`) at (−4.2, 0.46, −4.85) behind them; slippers on the floor at (−4.85, 0, −3.6). Behind her, the kitchen shelf with the sugar jar and the salt jar (K02, background, unlit). R1's basin was removed (too large, read as a tub). Caption band luma (LF18-UNDER): mean 0.551, p95 0.615 (fails the dark-band target; the lit mat edge sits in the band; open).
- Key frames: +0 night (hard cut); +6 "แต่อยู่ในครัว" (K02 shelf in frame left of her head); +43–+99 V01 ("ฮัลโหล…" +43, "ฮัลโหล?" ≈ +80, phone away from the ear and stared at +90); +112 last frame.
- Sound: M18 tender pad; A-IN (crickets outside, lamp flame flutter, K's shallow breathing); S18-02 phone screen wake click +40 (tiny plastic, close).
- Entry → exit: +0 night mat → +112 Y staring at the phone.

**5. S01-B02-SH05** [303, 369), 66 f. W-PHONE: Grandma climbs the ladder, phone held to the sky. VO: W-PHONE voice f303–363 (+0–+60).
- Camera: `cam: at (0.4, 2.2, -5), yaw 110→100, r 4→3.6 m, eye 1, f 850, hy 1100, pitch 22°`, ease in-out over the shot (est) (space VIL).
- proj: Y_ladder 308 px, x 548, y 1088–1396 → 335 px, x 544, y 1056–1391; phone 23 px, x 540, y 911–934 → 25 px, x 540, y 866–891; LN_sil (R1.1: a screen-space sky layer, so it is placed, not projected) 150 px, centre x 600, y 850–1000, base y 1000 for the whole shot (R1 projected it to y 1303–1455 in the band). Lead: Y_ladder.
- Staging: VIL night. Y climbs the stilt-house ladder (foot (0.6, 0, −5.0), top at the veranda edge (−1.0, 2.4, −5.0)) and waves the phone at the sky, arm stretched as high as it goes (phone at (0.4, 3.6, −5.0), screen glow). Far off against the stars, a long-neck silhouette (`new: long-neck silhouette`, sky layer placed in screen space: centre x 600, base y 1000, height 150 px), unbothered.
- Key frames: +0 climbing (two rungs, +0–+20); +24 arm up; +30–+60 waves the phone side to side; +65 last frame.
- Sound: M18 out (no music in the W row); A-VN; S18-03 bamboo ladder creaks +4, +14 (dry bamboo, two creaks); far low long-neck rumble +40 (very distant, soft, NEEDS-GEN).
- Entry → exit: +0 climbing → +65 phone high, waving.

**6. S01-B02-SH06** [369, 435), 66 f. L03: the phone screen: full battery, no bars. VO: L03 voice f369–479 (+0–+66).
- Camera: screen-space insert (no world camera); slow 5 % push over the shot (est).
- Staging: Screen-space crisp SVG phone screen, held in Y's hand (painted fingers on the edges): full battery icon, empty signal bars with a small ✕, no readable UI text. The screen fills x 240–840, y 300–1100.
- Key frames: +0 screen; +39 "แต่โทรไม่ออกแล้ว" (est) bars blink once; +66 "ไม่มีเสาสัญญาณ" (est) → cut at +66.
- Sound: M18 under; S18-04 two soft error beeps +40 (phone, gentle, short).
- Entry → exit: +0 → +65 screen.

**7. S01-B02-SH07** [435, 488), 53 f. L03: high wide, the village with no tower on the skyline. VO: L03 voice f369–479 (+0–+44).
- Camera: `cam: at (-0.2, 3.4, 5), yaw 180→172, r 10 m, eye 3.6, f 780, hy 1000, pitch 4°`, ease in-out over the shot (est) (space VIL).
- proj: roof 212 px, x 370, y 1034–1246 [band] → 220 px, x 328, y 1033–1253 [band]; conifer 505 px, x 711, y 613–1118 → 494 px, x 623, y 622–1116. Wide: no lead check.
- Staging: High wide from the veranda south over the neighbours' roofs (z 8..14) to the skyline: only 30 m conifers, no tower anywhere.
- Key frames: +0 hold; +0–+52 slow 8° pan; +52 last frame.
- Sound: M18 holds; A-VN wide (insects, very far calls).
- Entry → exit: +0 → +52 skyline of conifers.

**8. S01-B02-SH08** [488, 528), 40 f. L03b: Grandma thumbs the phone torch on (K03). VO: L03b voice f488–522 (+0–+34).
- Camera: `cam: at (1.2, 1.2, -3) → (1.2, 1.2, -1.5), yaw 200→190, r 2.6→3.2 m, eye 1.5, f 880, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: Y_start 515 px, x 540, y 933–1448 → 776 px, x 407, y 930–1706; Y_end 321 px, x 683, y 936–1257 [band] → 396 px, x 575, y 935–1331 [band]; beam_spot 5 px, x 776, y 1106–1111 → 6 px, x 650, y 1120–1126. Lead: Y_start.
- Staging: Back down at the ladder foot. Y sighs and thumbs the phone's torch on (K03); the beam (ENV-FOG `paintFogCone`, ENV-GLOW) lights her way toward the gate; she walks off toward camera-right.
- Key frames: +0 sigh (shoulders drop); +8 torch on (beam snaps on); +12–+39 she walks toward the gate.
- Sound: S18-05 torch click +8 (small phone, soft; `foley_flashlight-click_01` likely too springy, Ton tests); A-VN.
- Entry → exit: +0 Y in the dark → +39 beam on the path.

**9. S01-B03-SH09** [528, 627), 99 f. W-SHOP/L04: the village shop at night; a few boxes. VO: W-SHOP voice f528–579 (+0–+51); L04 voice f585–694 (+57–+99).
- Camera: `cam: at (0.6, 1.4, -1.2), yaw 20→8, r 3.2→2.6 m, eye 1.45, f 880, hy 940`, ease in-out over the shot (est) (space SHOP).
- proj: Y 513 px, x 396, y 916–1429 → 692 px, x 406, y 908–1600; keeper 391 px, x 528, y 899–1290 [band] → 471 px, x 499, y 891–1362; cabinet 251 px, x 728, y 804–1055 → 280 px, x 696, y 788–1068. Lead: Y.
- Staging: SET-SHOP: a village grocery with a pharmacy cabinet, one lamp, moths. Y hurries in (0.4, 0, −0.5); the shopkeeper `woman-bob + new: isan-home` (0.4, 0, −1.6) turns to the glass cabinet (1.1, 0.9–2.1, −2.45): a few boxes and one half-empty strip of pills.
- Key frames: +0 Y enters with the torch on; +30 shopkeeper turns; +57 L04 "ร้านยาในหมู่บ้าน"; +98 last frame.
- Sound: A-SH (moths ticking on the lamp glass, crickets); S18-06 shop door/curtain brush +0 (bead curtain, light rattle).
- Entry → exit: +0 Y entering → +98 the cabinet.

**10. S01-B03-SH10** [627, 700), 73 f. L04 "ใช้แล้วหมด": the last box handed over; the shelf bare. VO: L04 voice f585–694 (+0–+67).
- Camera: `cam: at (1, 1.4, -2.2), yaw 15→8, r 1.3→1.15 m, eye 1.4, f 950, hy 940`, ease in-out over the shot (est) (space SHOP).
- proj: cabinet 752 px, x 641, y 501–1253 [band] → 824 px, x 632, y 459–1283 [band]; keeper_hand 135 px, x -98, y 1279–1414 [cropped, band] → 191 px, x -212, y 1416–1607 [cropped]. Lead: cabinet.
- Staging: Close on the cabinet; the shopkeeper's hand enters from frame left and takes the last box; the shelf is bare.
- Key frames: +0 hand enters; +20 box lifted; +42 "ใช้แล้วหมด" the shelf empty; +72 last frame.
- Sound: S18-07 cardboard box slid off glass +20 (light, dry); M18 a single low note +42.
- Entry → exit: +0 last box → +72 bare shelf.

**11. S01-B04-SH11** [700, 788), 88 f. V04: Grandma scolds while wiping his forehead. VO: V04 voice f707–772 (+7–+72).
- Camera: `cam: at (-4.5, 0.7, -4.3), yaw -30→-22, r 1.6→1.4 m, eye 0.95, f 950, hy 860`, ease in-out over the shot (est) (space VIL).
- proj: Y_kneel 554 px, x 760, y 583–1137 → 652 px, x 806, y 534–1186 [band]; K_head 163 px, x 254, y 1022–1185 [band] → 180 px, x 214, y 1039–1219 [band]. Lead: Y_kneel.
- Staging: SET-UNDER night. Y kneels by the mat, scolding and wiping K's forehead with a damp cloth at the same time (`angry` → `worried`); K's head on the pillow frame left.
- Key frames: +7–+72 V04; +10–+70 three wipes; +87 last frame.
- Sound: M18 pad; A-IN; S18-08 cloth wrung over a bowl +2 (water trickle, close).
- Entry → exit: +0 → +87 Y wiping.

**12. S01-B04-SH12** [788, 855), 67 f. V05: weak, eyes half closed, a guilty smile. VO: V05 voice f792–838 (+4–+50).
- Camera: `cam: at (-4.85, 0.6, -4.4), yaw 10→16, r 0.9→0.8 m, eye 0.75, f 1000, hy 900, pitch -10°`, ease in-out over the shot (est) (space VIL).
- proj: K_head 263 px, x 437, y 779–1042 → 290 px, x 429, y 785–1075. Lead: K_head.
- Staging: K close on the pillow, eyes half closed, a guilty little smile (`tired` + new: guilty smile).
- Key frames: +4–+50 V05; +66 last frame.
- Sound: A-IN, quieter.
- Entry → exit: +0 → +66 K close.

**13. S01-B04-SH13** [855, 937), 82 f. L05: Keng limp and pale on the mat. VO: L05 voice f855–931 (+0–+76).
- Camera: `cam: at (-4.6, 0.6, -4.4), yaw 50→42, r 2→1.7 m, eye 1, f 920, hy 940, pitch -8°`, ease in-out over the shot (est) (space VIL).
- proj: K_lie 156 px, x 540, y 903–1059 → 182 px, x 540, y 919–1101; Y_kneel 626 px, x 640, y 514–1140 → 764 px, x 711, y 445–1209 [band]. Lead: Y_kneel.
- Staging: Slightly higher two-shot: K limp and pale on the mat, lips dry; Y fanning slowly.
- Key frames: +0 hold; +52 "ก็อันตรายได้" (f907); +81 last frame.
- Sound: M18 pad darkens; A-IN.
- Entry → exit: +0 → +81.

**14. S01-B04-SH14** [937, 1036), 99 f. V02: "ยาย… หิวน้ำ" whisper. VO: V02 voice f946–1022 (+9–+85).
- Camera: `cam: at (-4.95, 0.6, -4.4), yaw 340→348, r 0.75→0.65 m, eye 0.7, f 1000, hy 900, pitch -6°`, ease in-out over the shot (est) (space VIL).
- proj: K_head 326 px, x 540, y 795–1121 → 374 px, x 540, y 795–1169. Lead: K_head.
- Staging: K close, whispering, eyes half closed.
- Key frames: +9–+85 V02; +98 last frame.
- Sound: M18 nearly out; A-IN low.
- Entry → exit: +0 → +98.

**15. S01-B04-SH15** [1036, 1138), 102 f. L06: the water jug level drops (slow dissolve). VO: L06 voice f1036–1126 (+0–+90).
- Camera: `cam: at (-4.2, 0.6, -4.8), yaw 30→22, r 0.9→0.8 m, eye 0.62, f 1000, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: jug 333 px, x 540, y 796–1129 → 374 px, x 540, y 778–1152. Lead: jug.
- Staging: The clay water jug beside the mat (−4.2, 0.45, −4.8): its water level drops in a slow painted dissolve (three steps; picture of loss, not a body diagram).
- Key frames: +0 full; dissolves at +40 (f1076), +60 ("ยิ่งเป็นเด็ก" f1085 ≈ +49), +75 (f1105 "ยิ่งทรุดเร็ว" ≈ +69); +101 last frame low.
- Sound: M18 descending three-note figure aligned to the dissolves; A-IN.
- Entry → exit: +0 full jug → +101 low.

**16. S01-B04-SH16** [1138, 1222), 84 f. L06b: by the torch, the low jug, his dry lips; the beam drifts up to the shelf. VO: L06b voice f1138–1216 (+0–+78).
- Camera: `cam: at (-4.3, 0.5, -4.6) → (-4.4, 1.1, -7.6), yaw 10→2, r 1.1→3.8 m, eye 0.75→1, f 920, hy 960, pitch -10→4°`, ease in-out over the shot (est) (space VIL).
- proj: jug 213 px, x 633, y 798–1011 → 295 px, x 639, y 1261–1556 [band]; shelf 81 px, x 642, y 639–720 → 80 px, x 542, y 922–1002. Lead: jug.
- Staging: By the phone torch (Y holds it; the oil lamp low): the beam rests on the low jug, then K's dry lips, then drifts up toward the dark kitchen shelf (−4.4, 1.1, −7.85).
- Key frames: +0 beam on the jug; +25 on K's lips; +59 "เกลือก็ด้วย": beam starts drifting up; +83 beam reaches the shelf edge.
- Sound: M18 suspends; A-IN; no SFX.
- Entry → exit: +0 jug → +83 shelf edge.

**17. S01-B05-SH17** [1222, 1264), 42 f. W-KITCHEN: the beam lands on the sugar jar and the salt jar. VO: W-KITCHEN voice f1222–1258 (+0–+36).
- Camera: `cam: at (-4.42, 1.15, -7.85), yaw 6→0, r 1.3→1 m, eye 1.25, f 950, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: sugar 130 px, x 411, y 918–1048 → 170 px, x 369, y 912–1082; salt 111 px, x 665, y 940–1051 → 142 px, x 702, y 940–1082. Lead: sugar.
- Light (B05, R1.1): this is the one B05 shot with the phone torch, because script.md W-KITCHEN requires it ("her torch beam (K03) sweeps the shelf and lands on the sugar jar and the salt jar"); the lamp stays as the dim base light.
- Staging: The beam sweeps the shelf and lands on the sugar jar (−4.6, 1.10, −7.85) and the salt jar (−4.25, 1.10, −7.85) (K02, now lit, clear glass, coarse sugar and white salt).
- Key frames: +0 beam sweeping; +14 lands on the sugar; +24 widens to both jars; +41 last frame.
- Sound: M18 small rising kalimba run +14 (discovery, gentle); S18-09 glass jar faint ring +14 (as if touched by light; very soft, NEEDS-GEN).
- Entry → exit: +0 → +41 both jars lit.

**18. S01-B05-SH18** [1264, 1394), 130 f. L07: overhead, Grandma's hands make the drink; the recipe card. VO: L07 voice f1264–1382 (+0–+118).
- Camera (R1.1; Film proposal applied, user 14 Nov 2026): `cam: at (-4, 0.5, -5), yaw 0→6, r 0.75→0.7 m, eye 1.45, f 950, hy 1180, pitch -58°, near 0.05`, ease in-out over the shot (space VIL). Matches LF18-RECIPE (`CAM18_18`); the lens is ≈ 1 m from the bottle, so both jars stay in frame.
- proj (+100, look frame): bottle base x 501, y 1119; spoon x 505, y 882; sugar jar (−4.3, 0.46, −5.1) and salt jar (−3.78, 0.46, −5.12) either side of the bottle. Lead: bottle (hands). Caption band luma (LF18-RECIPE): mean 0.623, p95 0.806 (fails; the lit mat fills the band; open).
- Light (B05, R1.1): lamp only. The script gives L07 no light and L08b says "by lamplight"; the phone lies face down beside the mat with the torch off.
- Staging: Overhead (pitch −58°) on the mat by the lamp. Y's hands: boiled water that has already cooled (no steam; the pot sits off the fire) poured into a 1-litre bottle (−4.05, 0.5, −5.0); six level teaspoons of sugar (each scraped flat with a knife; `new: teaspoon`, `new: knife`); half a teaspoon of salt scraped flat; stir. Recipe card and safety strip in screen space (see On-screen text).
- Key frames: +0 pour (card line 1 "น้ำต้มสุก 1 ลิตร" on); +38 line 2 "น้ำตาล 6 ช้อนชาปาด" on (f1302), six quick spoon drops +38–+78 (one per 6–7 f, each scraped flat); +88 line 3 "เกลือ ครึ่งช้อนชาปาด" + footnote on (f1352), one half-spoon scraped flat +90–+108; +110–+128 stir.
- Sound: M18 soft pulse; S18-10 cooled water poured into a plastic bottle +0 (glug, 1.5 s; candidate `water_mug-pour-soft_01`, Ton tests); S18-11 six spoon taps and knife scrapes +38–+78 (metal on rim, light, quick); S18-12 one scrape +100; S18-13 stir rattle +110 (spoon in bottle).
- Entry → exit: +0 empty bottle → +129 mixed drink.

**19. S01-B05-SH19** [1394, 1530), 136 f. L08/L08b: cup to his lips; the jug refills; held with the safety text. VO: L08 voice f1394–1412 (+0–+18); L08b voice f1426–1515 (+32–+121).
- Camera (R1.1): `cam: at (-4.5, 0.8, -4.4), yaw 35→28, r 1.9→1.7 m, eye 1, f 920, hy 900, pitch -6°`, ease in-out over the shot (space VIL). Matches LF18-CHIP (`CAM18_19`); hy 960 → 900 so Y's knee contact stays above y 1160.
- proj (Film probe; +0 / +60 / +135): Y_kneel lead 706 / 739 / 791 px, mat contact y 1122 / 1137 / 1159; K_sit lead 416 / 433 / 460 px, contact y 1063 / 1073 / 1089; the cup at K's lips. Lead: Y_kneel. Caption band luma (LF18-CHIP): mean 0.509, p95 0.615 (fails; open).
- Light (B05, R1.1): lamp only (L08b "by lamplight"); no phone light.
- Staging: SET-UNDER night, lamplight. Y (P34 kneel, left of frame, at (−4.05, 0.46, −4.25)) holds the cup to K's lips (P18 offer cup); K sits on the mat at (−4.45, 0.46, −4.5) in P33 (floor sit, hugging his knees; R1.1, Film proposal applied, was "P31-like") and leans in to sip (P19 sip as a head/arm overlay); small sips. Beside him the jug refills in a slow dissolve (the loss reversed). L08b: same shot held, no new action; the safety text gains its second line.
- Key frames: +0 cup at the lips; +0–+18 L08 "ค่อย ๆ จิบนะ"; sips at +10, +40, +70; jug refill dissolves +20, +45, +70; +32 L08b; +94 "ต้องรีบหาหมอ" (f1488); +121 safety line 2 off with L08b end (f1515); +135 last frame.
- Sound: M18 warm resolve begins; A-IN; S18-14 small sips +10, +40, +70 (very soft).
- Entry → exit: +0 cup at lips → +135 jug full again.

**20. S01-B06-SH20** [1530, 1623), 93 f. L09: morning; Keng sits up sipping by himself; hens in the yard. VO: L09 voice f1530–1653 (+0–+93).
- Camera: `cam: at (-4.5, 0.8, -4.4), yaw 160→150, r 2.4→2.1 m, eye 0.95, f 920, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: K_sit 279 px, x 610, y 867–1146 → 314 px, x 612, y 855–1169; Y_kneel 376 px, x 373, y 772–1148 → 444 px, x 342, y 738–1182 [band]; hen_yard 50 px, x 116, y 1028–1078 → 57 px, x -65, y 1038–1095 [cropped]. Lead: K_sit.
- Staging: SET-UNDER morning light. K sits up sipping by himself (P19 drink cup), `relieved` → `happy`; Y fans him, smiling; through the open door the hens peck in the yard (−3, 0, 1.5).
- Key frames: +0 morning (cards fade out +0–+15); +51 "แต่ยาที่ช่วย" (f1581); +92 last frame.
- Sound: M18 warm, fuller (phin melody); A-MM (morning hens, birds of the era: none named; insects); S18-15 hand-fan whoosh loop soft.
- Entry → exit: +0 → +92 K sipping.

**21. S01-B06-SH21** [1623, 1659), 36 f. L09 "อยู่ในครัวคุณมาตลอด": push in on the jars. VO: L09 voice f1530–1653 (+0–+30).
- Camera: `cam: at (-4.42, 1.15, -7.85), yaw 2→0, r 0.9→0.6 m, eye 1.25, f 950, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: sugar 188 px, x 351, y 849–1037 → 286 px, x 255, y 832–1118; salt 159 px, x 721, y 880–1039 → 238 px, x 809, y 880–1118. Lead: sugar.
- Staging: Push in on the sugar jar and the salt jar on the shelf, morning light.
- Key frames: +0 "อยู่ในครัวคุณมาตลอด" (f1623); +30 tightest; +35 last frame.
- Sound: M18 phrase lands on +0.
- Entry → exit: +0 → +35 jars close.

**22. S01-B06-SH22** [1659, 1737), 78 f. V03 hen cluck; hold on Keng, Grandma and the cup. VO: V03 voice f1659–1677 (+0–+18).
- Camera: `cam: at (-4.4, 0.8, -4.35), yaw 40→46, r 2→2.3 m, eye 1, f 920, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: K_sit 309 px, x 458, y 878–1187 [band] → 270 px, x 478, y 888–1158; Y_kneel 544 px, x 613, y 715–1259 [band] → 465 px, x 587, y 751–1216 [band]. Lead: K_sit.
- Staging: Arc back to K and Y with the cup; a hen pokes its head in at the door edge (cluck). Hold 2 s.
- Key frames: +0 V03 cluck (f1659–1677); +18–+77 hold.
- Sound: V03 designed hen cluck +0 (one 'กุ๊ก', NEEDS-GEN); E-TAG series ending (shared with EP16) +18, rings out by +77.
- Entry → exit: +0 → +77 end.

## Acceptance (timed checks for review and integration)

- Shot 4 +6: "แต่อยู่ในครัว" with the shelf jars in frame (dark).
- Shot 8 +8: torch on; beam on the path above y 1160.
- Shot 17: beam lands on the jars by f1236 (+14).
- Shot 18: card line 1 at f1264, line 2 at f1302, line 3 + footnote at f1352; six spoon drops between f1302 and f1342; the hands and bottle between y 695 and 1110 (below the card and strip, above the band).
- Shot 19: safety line 2 on f1426–1515; jug refill dissolves finish by f1464; Y and K heads below the chip and strip (y ≥ 540).
- Window: L07 onset f1264 → L09 onset f1530 = 266 f (8.87 s) unchanged.
- Shot 22: cluck at f1659; hold to f1736; ending tag rings out by f1736.
- Text: numerals ≥ 88 px while the card is full; contrast ≥ 4.5:1; no clash with the @TamMaiLa mark.

## New assets for Boss

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N18-01 | Shared from EP16: N16-01..N16-05, N16-10 props where reused, N16-11 river, N16-06 long-neck parts | shared | — | see EP16 sheet |
| N18-02 | SET-UNDER kitchen-living area under the house at night/morning: bamboo platform (top y 0.45), mat, pillow, oil lamp, shelf with sugar jar + salt jar (K02), clay jug, front slat screen with door and window openings | set (extends SET-VIL) | 4,11–22 | missing |
| N18-03 | SET-SHOP village grocery with a glass pharmacy cabinet, one lamp, moths, bead curtain | set | 9–10 | missing |
| N18-04 | `new: long-neck herd far` layer; `new: long-neck silhouette` sky layer | creature layers | 3,5 | missing |
| N18-05 | Phone torch beam (ENV-FOG `paintFogCone` + ENV-GLOW halo) following the phone in Y's hand | ENV (existing layers, new use) | 8,16–17 | layers existing-integrated; beam-follows-hand unknown |
| N18-06 | Phone screen SVG (battery, empty bars ✕) | screen card | 6 | missing |
| N18-07 | Recipe card RCP + chip state + safety strip SAF (crisp SVG text, Thai) | screen layers | 18–20 | missing |
| N18-08 | Props: 1-litre plastic bottle, teaspoon, knife, cooled pot, cup, damp cloth + bowl, hand fan, pill boxes + half strip | props | 11–22 | missing |
| N18-09 | Poses: lie on side clutching belly (P37 variant), sip held by another (P19 + P18 pair), new: guilty smile | poses/expressions | 4,12,19 | partial (P37, P18, P19 exist) |

## Sound needs for Ton

| Code | Sound (source, action, material, space, length, feel) | Shots (shot-local frame) | Library candidate |
| --- | --- | --- | --- |
| M18 | Music: tender bed in the series family, kalimba + soft phin + low pad, ≈ 72 bpm; out under W-PHONE, darkens L05–L06, discovery run at W-KITCHEN, warm resolve L08–L09 | sh2–21 | NEEDS-GEN |
| E-TAG | Shared series ending tag (EP16) | sh22 +18 | NEEDS-GEN (shared) |
| A-IN / A-SH / A-MM | Under-house night (crickets outside, lamp flutter, shallow breath); shop night (moths on lamp glass); morning yard with hens | sh4–22 | NEEDS-GEN |
| S18-01..S18-05 | Slurp from hands; phone wake click; bamboo ladder creaks; far long-neck rumble; two error beeps; torch click | sh3–8 | torch candidate `foley_flashlight-click_01` (likely too springy) |
| S18-06 / S18-07 | Bead curtain rattle; cardboard box slid off glass | sh9–10 | NEEDS-GEN |
| S18-08 | Damp cloth wrung over a bowl | sh11 +2 | NEEDS-GEN |
| S18-09 | Faint glass ring as the beam lands (very soft) | sh17 +14 | NEEDS-GEN |
| S18-10..S18-13 | Cooled water poured into a plastic bottle (1.5 s glug); six spoon taps + knife scrapes; one salt scrape; stir rattle | sh18 | pour candidate `water_mug-pour-soft_01` |
| S18-14 / S18-15 | Soft sips; hand-fan whoosh loop | sh19–20 | NEEDS-GEN |
| V03 | One hen "กุ๊ก" at the door, 0.6 s | sh22 +0 | NEEDS-GEN |

## Dependencies and open items

- Look frames (W3): LF-UNDER-NIGHT, LF-SHOP, LF-RECIPE (with the card layout), LF-UNDER-MORNING.
- Safety strip duplicates the L08b subtitle (top vs bottom): kept by design, user to confirm (Q2).
- Boat/user: check the recipe card wording against the WHO page once more before publish (numbers unchanged from the locked script).
- Script Q4: the hook pays at ≈ 72 % (L07 f1264 of 1737); unchanged by Film.
- L03 phrase pegs (≈ f408, f435) are syllable estimates.
- Under-house setting for the night scenes is Film's staging choice (script: "his mat"); shop is a grocery with a pharmacy cabinet.

## Change log

- 2026-11-14 R1 (Film): first timed scene sheet from the locked voice (EP18 narration R2.2 (`ep18_narration_kore_x1.05.5bfff882.wav`) + R2.2 character takes; W-PHONE 2.0 s, W-SHOP 1.7 s, end hold 2.0 s (user, 14 Nov 2026)); 22 shots, 1737 f. Brief and sheet written in one invocation by the coordinator's assignment (AI04 exception noted in the handoff).
- 2026-11-14 R1.1 (Film, user verdicts on W3 look frames 14 Nov 2026): shot 4 re-staged and re-cammed (K P37 lying along screen x on the mat, Y P34 + P20 phone on his head side, contacts at mat top y 0.46, lamp moved to (−3.72, 0.62, −5.0), basin removed; all contacts above y 1160); shot 5 LN_sil placed at base y 1000 (out of the band); shot 18 camera r 0.75→0.7, eye 1.45; shot 19 K P33 and hy 900; screen layers inside x 120–888 with the safety text on two 44 px lines; B05 light: torch in shot 17 (script W-KITCHEN), lamp only in shots 18–19. Timing, narration, on-screen Thai words and IDs unchanged.
