# Storyboard — EDU-EP16-SHORT (timed scene sheet)

Deliverable: `EDU-EP16-SHORT` · Revision: **EDU-EP16-SHEET-R1.5b (R1.5a plus the user's verdict "the T. rex is not clearly visible": 16C/16D rebuilt with the T. rex as a visible hero, 16B 26→22 f, 16D 40→44 f, 2100 f unchanged; see [R1.5b](#r15b-revision-the-t-rex-as-a-visible-hero-16b16d))**. R1.5a header: **EDU-EP16-SHEET-R1.5a (R1.5 plus Boat's R1.5 visual check RV-23..RV-28 applied: villagers scatter into the reeds, the T. rex never reacts to the hide, sound guards; timing unchanged at 2100 f; see [R1.5a](#r15a-boat-guards-applied-rv-23rv-28))**. R1.5 header: EDU-EP16-SHEET-R1.5 (timed scene sheet; user direction 14 Nov 2026: the "Remember who you are" sky gag is dropped, a light-horror suspense beat is added at the river, SH22 gets a new hen ending)** (Film, 2026-11-14; R1, R1.1, R1.3 and R1.4 same day). The [R1.5 revision](#r15-revision-river-suspense-new-sh22-ending-no-sky-gag) supersedes every earlier section for shots 15, 16 and 22, adds shots 16A–16D, and owns the global timing (shot map and voice table below: **2100 f**). Earlier R1.4 header text follows for history: Revision R1.4 (timed scene sheet; user answers to R1.3 Q1–Q6: stretch, triceratops out, dinosaurs in shots 15 and 21, T. rex sky apparition). The [R1.3 revision](#r13-revision-dinosaur-presence-and-draft-round-1-fixes) section supersedes the per-shot staging for shots 2–13, 16, 20 and 22; the [R1.4 revision](#r14-revision-user-answers-stretch-no-triceratops-t-rex-apparition) supersedes both for shots 10, 11, 15, 16, 21 and 22 and owns the global timing.
Inputs: [script.md](script.md) EDU-EP16-SCRIPT R2.2 (user-locked) · Boat's R2 check (recorded in script.md; research in [../ep16/research-r2.md](../ep16/research-r2.md)) · [film-brief.md](film-brief.md) **EDU-EP16-BRIEF-R1** · series decisions in [EP16 brief](../ep16/film-brief.md) · voice lock: EP16 narration R2.2 (`ep16_narration_kore_x1.05.b56a7013.wav`, 42.37 s, keeps "ไม่เอานะ", user 14 Nov 2026) + R2.2 character takes + V10 from R2.3 (Leda, 2.52 s).
Target: worktree `adoring-panini-24500a`, branch `claude/education-oak-street-dino-23617a` at `d4f0ee2` (uncommitted EP16–18 files) · 30 fps · **durationFrames 2100 (70.00 s)** (R1.5; R1.4 was 2009 f = 66.97 s, R1.3 1839 f = 61.30 s) · 1080×1920 · one scene S01, offset 0.
Evidence: timing measured from the audio files by silence detection (voice-take R2.2/R2.3; `out/voice/ep16-18-r23/est.py` model, re-run in Film's scratch `tl.py`); not listened by Film. Camera numbers are design estimates checked with `scripts/shot-projection.py` (each world-space shot, start and end camera); no look frame, plate, blockout or render exists yet. Readiness (R1.5a): **ready-for-dev for Editor at 2100 f for every shot including 16A–16D, 16 and 22 (Boat R1.5 visual check: no must-fix, guards RV-23a..RV-28c applied below); 16C/16D motion waits for Boss N16-22 R3 and for the user's look-frame approval (LF16R15-SH16C/16D, next Film pass); user forks R15-Q1..Q3 still open.** Readiness (R1.5, superseded): **ready-for-dev for Editor at 2100 f for every shot except 16A–16D, 16 and 22, which wait for Boat's visual recheck (daylight predator, hide staging, hen/T. rex sound-and-camera callback; see the R1.5 section); Boss intake on the R1.5 list (N16-22 R3 T. rex in the world: stalk walk, sniff, head turn; N16-11 R3 river additions; N16-03 footprint); Ton new cues S16-37..S16-44 and the R1.5 re-time list; look frames LF16R15-SH16C/16D are the next Film pass; user forks R15-Q1..Q3 asked with Film's recommendation applied.** Readiness (R1.4, superseded): **ready-for-dev for Editor at 2009 f (re-place narration and character takes per the R1.4 voice table, shots 10, 11, 15, 16, 21, 22 restaged); Boss intake on the R1.4 list (N16-15 R2 ankylosaur in two shots, N16-06 R2 long-neck in shots 15 and 21, N16-22 R2 T. rex apparition); Ton re-time list in the R1.4 section; SH22 text and apparition wait for Boat's recheck; Q4 (feathered small dinosaur, shot 19) still open.** Readiness (R1.3, superseded): **ready-for-dev for Editor re-animation (shots 3, 6, 7, 9, 16 villagers/eyes, 22) and Boss/Ton intake on non-look items (N16-03/04/09/11 R2, N16-17..N16-21, S16-27..S16-36); the new creature looks (N16-06 R2, N16-14..16, N16-22) wait for the user's Q2/Q6 answers; stretch variants wait for Q1/Q6** (R1.1: ready for look frames (W3) and Boss/Ton intake) (see Dependencies).
Rows file: [review-rows.json](review-rows.json) **EDU-EP16-ROWS-R1.5b** (16B–16D updated, look frames LF16R15-* added as question Q11; review page: pending). R1.5a rows: **EDU-EP16-ROWS-R1.5a** (R1.5 rows with 16A, 16C, 16D, 22 updated for Boat's guards; review page: pending). R1.5 rows: **EDU-EP16-ROWS-R1.5** (Thai, timed at 2100 f, 26 shots; open questions Q4, Q7 (R1.4 frames minus the sky T. rex), Q8–Q10 (R1.5 forks)). Review page: pending. R1.4 rows text: **EDU-EP16-ROWS-R1.4** (Thai, timed at 2009 f; R1.4 look frames `out/ep16/r14/looks/v4/`, R1.3 frames `out/ep16/r13/looks/v5/`; open questions Q4 (feathered small dinosaur, shot 19) and Q7 (approval of the R1.4 look frames: ankylosaur in the paddy, long-necks in 15/21, the T. rex apparition, the SH21 camera swing)). Review page: pending.

## Units, clocks and conventions

- Clocks: **global** `f` = composition frame (scene S01, offset 0); **shot-local** `+n` = `f − shot start`. Ranges are half-open `[start, end)`. Character takes and W rows are placed by the est.py model: lead 0.25 s, narration gaps as read, +0.2 s padding next to character/W items; V03 overlaps V02 by −0.3 s; W-HEN plays under L10 (picture f1504–1540, not a sequential gap); V09 sits inside W-RIVER.
- Spaces (brief [projection contract](film-brief.md#projection-contract)): `VIL` village (m; origin on the ground at the yard centre, +x east, +y up, +z south toward the usual camera), `RIV` river (m; origin on the near bank waterline at the fishing spot, +x downstream, +z toward the bank), `SHOP` (m; origin at the shop floor centre, +z toward the door), `UNDER` is the part of `VIL` under the house (same axes). Screen: px, origin top-left, y down.
- Camera lines use the kit yaw camera `camMove(at, yaw, r, eye, {f, hy, pitch})`: camera at `at + r·(sin yaw, 0, cos yaw)` at height `eye`, yaw 0 = camera on +z of the target. `proj` lines are `scripts/shot-projection.py` output (start → end; `band` = touches y 1176–1344, `cropped` = partly out of frame by design unless flagged).
- Caption band y 1176–1344 (edu stroke captions, `captionStyle.position` bottom); faces, contacts, cards and reveals above y 1160; `@TamMaiLa` mark top-left (keep x < 330, y < 140 clear). Lead ≥ 480 px applies to M/MC/CU shots; W/EW shots are named wides and list the lead height for reference.
- Sizes: EW extreme wide, W wide, M medium, MC medium close, CU close, INS insert, MAC macro, OH overhead.

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| ยาย (Y) | `woman-elder + new: isan-home (pha sin, loose cotton blouse, pha khao ma at the waist; kitchen-apron over it in morning shots)`, P01/P34/P32, worried/stern/laugh | 1.52 m; voice Gacrux (character takes); four views squared to the lens |
| เก่ง (K) | `boy-school + new: kid-home (faded tee, shorts, flip-flops)`; fallback `boy-school + park-casual` with a recorded reason | 1.30 m, about 10; voice Leda boy |
| Villagers | PEOPLE (`man-elder`, `man-buzz`, `woman-curly`, `woman-bob`, `man-crop`) + `new: isan-home` colour variants | background crowd; 1.55–1.72 m |
| Neighbour (sh17) | `man-elder + new: isan-home`, P16 reach, smug→sad | 1.62 m |
| Hen (K01) | `new: Thai backyard hen (gai ban: red-brown, black tail, small comb)`, peck/trot/head-tilt/huddle/cluck | 0.42 m to the comb; three-toed scaly feet readable in CU |
| Long-neck | `new: long-neck head/neck` (CR-SAUROPOD, shared with EP17/18), head 0.6 m, neck seen ≈ 7 m | body never shown; munch/chew cycle |
| Pterosaur | `new: pterosaur swoop` (prop, unnamed), span ≈ 3 m, feet grab | one pass, shadow first |
| Long-neck (R1.3/R1.4) | `new: long-neck` volume (N16-06 R2, prototype `buildLongNeck`), 22 m, head up to 14.5 m | shots 2, 8, 10, 12 night, 15 far, 21 forest edge |
| Ankylosaur (R1.3/R1.4) | `new: ankylosaur` (N16-15 R2, `buildAnkylosaur`), 6.5 m, hip 1.7 m | shots 5, 11 (the same animal) |
| Giant dragonfly (R1.3) | `new: giant dragonfly` (N16-16, `buildDragonfly`), span 0.7 m | shot 3 |
| T. rex (R1.5) | kit `TREX` (AS-TREX-R2, `src/painted/survival/beast-trex.ts`, 12 m, hip 3.6 m) at full opacity in the world, plus N16-22 R3 motions `stalk`, `sniff`, head turn | shots 16C–16D only: far river bank, in forest shade, partial (head, chest, arms, tail; legs in the ferns); never crosses the water, never in the village, no roar, no feathers (RV-22b) |
| ~~T. rex apparition (R1.4)~~ | ~~`new: T. rex` volume at opacity 0.5 in the sky~~ | dropped R1.5 (user, 14 Nov 2026), with the line "Remember who you are" |
| Small pterosaur flock (R1.5) | kit `PTERO` (AS-PTERO-R2) scaled to span ≈ 0.9 m, 10 instances, flap only | shot 16A: bursts off the far conifers (the alarm) |
| ~~Triceratops~~ | deferred to a later episode (user Q2, 14 Nov 2026) | — |

## Shot map

| # | Shot | Beat | Lines | Range | Len | Start s | Size | One-line read |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | L01 | [0, 92) | 92 | 0.00 | EW | Signature: night village, the sky ripples, white flash |
| 2 | S01-B01-SH02 | B01 | L01, L02 | [92, 217) | 125 | 3.07 | W | Morning reveal, Keng runs out of the gate past the hens |
| 3 | S01-B02-SH03 | B02 | V01 | [217, 286) | 69 | 7.23 | MC | V01: Keng at the forest edge, looking up for fruit |
| 4 | S01-B02-SH04 | B02 | L03 | [286, 377) | 91 | 9.53 | INS | Insert card: fruit and vegetables with their flowers |
| 5 | S01-B02-SH05 | B02 | L04 | [377, 443) | 66 | 12.57 | W | L04: back to the forest, the flowers fade |
| 6 | S01-B03-SH06 | B03 | V02, V03 | [443, 517) | 74 | 14.77 | M | V02/V03: Keng reaches for the orange seeds, Grandma slaps his hand |
| 7 | S01-B03-SH07 | B03 | L05 | [517, 637) | 120 | 17.23 | MC | L05: Keng rubs his hand, Grandma shakes her head |
| 8 | S01-B03-SH08 | B03 | V04, L06 | [637, 781) | 144 | 21.23 | W | V04/L06: a long-neck lowers its head to eat the same plant |
| 9 | S01-B03-SH09 | B03 | V07 | [781, 843) | 62 | 26.03 | MC | V07: Keng scoops the seeds and mimes stirring a pot |
| 10 | S01-B03-SH10 | B03 | L06b | [843, 929) | 86 | 28.10 | W | L06b: Grandma tosses the cone; the long-neck takes it in its jaws, two crunches (R1.4 stretch) |
| 11 | S01-B04-SH11 | B04 | V05 | [929, 1024) | 95 | 30.97 | W | V05: Keng at the empty paddy with a hoe; an ankylosaur wades the paddy behind him (R1.4) |
| 12 | S01-B04-SH12 | B04 | L07 | [1024, 1126) | 102 | 34.13 | CU | L07: days and nights race across the sky while the paddy ripens (R1.3) |
| 13 | S01-B04-SH13 | B04 | V08 | [1126, 1202) | 76 | 37.53 | M | V08: Keng swings the granary open, arms wide |
| 14 | S01-B04-SH14 | B04 | L07b | [1202, 1283) | 81 | 40.07 | M | L07b: Grandma ties off a seed sack and shelves it |
| 15 | S01-B04-SH15 | B04 | L08 | [1283, 1350) | 67 | 42.77 | W→CU | L08: the village at the empty paddy, a far long-neck browsing beyond it; crane down to the rice bowl; R1.5: the long-neck stops chewing and looks toward the forest (+48–+64) |
| 16A | S01-B05-SH16A | B05 | W-RIVER | [1350, 1390) | 40 | 45.00 | W | R1.5: the river, Keng nets a fish; the insects cut out, a flock bursts off the far trees, everyone stops; R1.5a: the villagers panic into the reeds, Keng is left standing |
| 16B | S01-B05-SH16B | B05 | W-RIVER | [1390, 1412) | 22 | 46.33 | INS | R1.5b: 22 f (see R1.5b). R1.5: rings jump on the water with two unseen footfalls; the fish in the net goes still |
| 16C | S01-B05-SH16C | B05 | W-RIVER | [1412, 1460) | 48 | 47.07 | OTS long lens | R1.5b: long-lens OTS, the T. rex is the subject (see R1.5b). R1.5: across the river a T. rex pushes its head out of the ferns in shade and sniffs; Keng sinks behind a boulder |
| 16D | S01-B05-SH16D | B05 | W-RIVER | [1460, 1504) | 44 | 48.67 | M low 3/4 | R1.5b: full-body step onto the far bank, walks on into the forest (see R1.5b). R1.5: Keng hides, breath held; the T. rex's head over the boulder behind him lifts, turns, it walks away upstream; he exhales |
| 16 | S01-B05-SH16 | B05 | V09 | [1504, 1624) | 120 | 50.13 | W | W-RIVER/V09: sun back, Keng lifts the net in relief and a pterosaur snatches the fish from above, eats it on a snag (R1.5 re-time, no high circle) |
| 17 | S01-B05-SH17 | B05 | L09 | [1624, 1753) | 129 | 54.13 | M | L09: evening fire, Grandma pushes the raw ก้อย toward the fire |
| 18 | S01-B06-SH18 | B06 | L10 | [1753, 1789) | 36 | 58.43 | M | W-HEN: morning, Grandma out of the coop with an apron full of eggs |
| 19 | S01-B06-SH19 | B06 | L10 | [1789, 1818) | 29 | 59.63 | MC | L10: Keng looks from the forest to the hens |
| 20 | S01-B06-SH20 | B06 | L10 | [1818, 1874) | 56 | 60.60 | CU | L10: a hen tilts its head; the three-toed foot |
| 21 | S01-B06-SH21 | B06 | L11 | [1874, 1929) | 55 | 62.47 | M→W | L11: pull back, the family, the hens, a long-neck stepping out at the forest edge (R1.4) |
| 22 | S01-B06-SH22 | B06 | V10, V06 | [1929, 2100) | 171 | 64.30 | MC→low CU | V10/V06: Keng nose to beak with the hen; one cluck; R1.5: the camera drops to hen height, the river pulse returns, the hen's foot lands with a giant's thud, Keng flinches, the hen just pecks |

Total **2100 f = 70.00 s** (R1.5: shots 16A–16D +154, SH16 150→120, SH22 204→171; R1.4 was 2009 f: SH10 +20, SH11 +36, SH16 +69, SH22 +45); 26 shots; shots tile [0, 2100) with no gap; play order 15 → 16A → 16B → 16C → 16D → 16 → 17 (the new shots take the suffix of the shot they lead into, so legacy IDs stay unchanged). R1.4 ranges for 16–22: 16 [1350, 1500), 17 [1500, 1629), 18 [1629, 1665), 19 [1665, 1694), 20 [1694, 1750), 21 [1750, 1805), 22 [1805, 2009). Older note, R1.4: 2009 f; 22 shots; shots tile [0, 2009) with no gap. R1.3 ranges (1839 f) are in the change log and the R1.3 rows; per-shot block headers below keep their R1.1 global ranges, shot-local `+n` frames hold unless R1.3/R1.4 says otherwise.

## Voice and subtitle cues (global frames)

**R1.5 (user direction, 14 Nov 2026): voice words, takes and read lengths unchanged; L01–L08 unchanged; W-RIVER grows to [1350, 1624) with V09 re-placed under the snatch; every item from L09 on shifts +124 f.** The table below is the R1.4 placement; R1.5 replaces these rows:

| Item | Speaker | R1.5 item range | R1.5 voice | Shift vs R1.4 | Place (Editor `narration-place.py`, `TOTAL = 2100`) |
| --- | --- | --- | --- | --- | --- |
| L01–L08, V01–V08, L06b | as R1.4 | as R1.4 | as R1.4 | +0 | unchanged |
| W-RIVER | — | [1350, 1624) | V09 voice [1540, 1592) | restaged | V09 file start f1397 -> **f1535** (onset file +5 f lands on f1540 = SH16 +36) |
| L09 | ผู้บรรยาย | [1624, 1751) | [1624, 1751) | +124 | start_s 50.007 -> **54.133** (f1624) |
| L10 | ผู้บรรยาย | [1764, 1863) | [1764, 1863) | +124 | start_s 54.657 -> **58.800** (f1764) |
| L11 | ผู้บรรยาย | [1874, 1923) | [1874, 1923) | +124 | start_s 58.327 -> **62.467** (f1874) |
| V10 | เก่ง | [1929, 2004) | [1937, 1995) | +124 | file start f1805 -> **f1929** |
| V06 | ไก่ | [2010, 2028) | [2010, 2028) | +124 | Ton cue: f1886 -> **f2010** (SH22 +81) |
| hen gag + tag | — | [2028, 2100) | — | new | SH22 +99..+171; durationFrames 2009 -> **2100** |

R1.4 (user Q1/Q6, 14 Nov 2026): voice content and read ranges unchanged; items after SH10 shift by the inserted frames. Sources as R1.3: narration `~/ReelsStore/projects/edu/EDU/voice/ep16_narration_kore_x1.05.b56a7013.wav` (R2.2), character takes `chars/ep16_V0x_*.wav` (R2.2), V10 `chars/ep16_V10_boy_r23.wav` (R2.3, Leda), V06 Ton.

| Item | Speaker | R1.4 item range | R1.4 voice | Shift | R1.3 item range | Place (Editor `narration-place.py`) |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | ผู้บรรยาย | [8, 94) | [8, 94) | +0 | [8, 94) | unchanged |
| L02 | ผู้บรรยาย | [110, 211) | [110, 211) | +0 | [110, 211) | unchanged |
| V01 | เก่ง | [217, 280) | [224, 269) | +0 | [217, 280) | unchanged |
| L03 | ผู้บรรยาย | [286, 361) | [286, 361) | +0 | [286, 361) | unchanged |
| L04 | ผู้บรรยาย | [377, 437) | [377, 437) | +0 | [377, 437) | unchanged |
| V02 | เก่ง | [443, 487) | [450, 479) | +0 | [443, 487) | unchanged |
| V03 | ยาย | [478, 511) | [488, 504) | +0 | [478, 511) | unchanged |
| L05 | ผู้บรรยาย | [517, 631) | [517, 631) | +0 | [517, 631) | unchanged |
| V04 | เก่ง | [637, 710) | [644, 703) | +0 | [637, 710) | unchanged |
| L06 | ผู้บรรยาย | [716, 775) | [716, 775) | +0 | [716, 775) | unchanged |
| V07 | เก่ง | [781, 837) | [790, 828) | +0 | [781, 837) | unchanged |
| L06b | ผู้บรรยาย | [843, 903) | [843, 903) | +0 | [843, 903) | unchanged |
| V05 | เก่ง | [929, 982) | [936, 973) | +20 | [909, 962) | file start f909 -> **f929** |
| L07 | ผู้บรรยาย | [1024, 1120) | [1024, 1120) | +56 | [968, 1064) | start_s 32.26 -> **34.127** (f1024) |
| V08 | เก่ง | [1126, 1196) | [1135, 1185) | +56 | [1070, 1140) | file start f1070 -> **f1126** |
| L07b | ผู้บรรยาย | [1202, 1273) | [1202, 1273) | +56 | [1146, 1217) | start_s 38.19 -> **40.057** (f1202) |
| L08 | ผู้บรรยาย | [1283, 1344) | [1283, 1344) | +56 | [1227, 1288) | start_s 40.90 -> **42.767** (f1283) |
| W-RIVER | — | [1350, 1494) | V09 voice [1402, 1454) | restaged | [1294, 1369) | V09 file start f1306 -> **f1397** (voice onset file +5 f lands on f1402 = SH16 +52) |
| L09 | ผู้บรรยาย | [1500, 1627) | [1500, 1627) | +125 | [1375, 1502) | start_s 45.84 -> **50.007** (f1500) |
| L10 | ผู้บรรยาย | [1640, 1739) | [1640, 1739) | +125 | [1515, 1614) | start_s 50.49 -> **54.657** (f1640) |
| L11 | ผู้บรรยาย | [1750, 1799) | [1750, 1799) | +125 | [1625, 1674) | start_s 54.16 -> **58.327** (f1750) |
| V10 | เก่ง | [1805, 1880) | [1813, 1871) | +125 | [1680, 1755) | file start f1680 -> **f1805** |
| V06 | ไก่ | [1886, 1904) | [1886, 1904) | +125 | [1761, 1779) | Ton cue (not placed by the script): f1761 -> **f1886** |
| gag + hold | — | [1904, 2009) | — | +125 then +45 | [1779, 1839) | end hold 2 s becomes the T. rex gag (SH22 +99..+204); durationFrames 1839 -> **2009** |

Subtitles: every narration and character line, exactly the script text (Thai unchanged); no subtitle on W rows or the hen cluck. Narration subtitle on the voice range; character subtitles on their voice range. R1.5: no on-screen text besides subtitles (the R1.4 line "Remember who you are" is dropped, user 14 Nov 2026). *Superseded R1.4: one on-screen text line, SH22 +132..+170, in the edu caption stroke.*

## Word-pegged key frames

**R1.5 frames** (L01–L08 pegs unchanged from the R1.4 list below):

- Long-neck alert in SH15 +48–+64 (f1331–1347), after L08's last word
- Silence drop f1366 (SH16A +16); R1.5b: footfalls f1394 (SH16B +4), f1406 (+16); T. rex first reveal f1424 (SH16C +12), step out f1418–1438 (+6–+26); sniffs f1440, f1452; full-body step plant f1474 (SH16D +14); lift/turn away f1484–1490 (+24–+30); walk on from f1490; pulse stops f1498; exhale f1500. (R1.5a: second footfall f1408, head out f1426–1440, sniffs f1444/f1456, turn f1474–1484.)
- Pterosaur grab contact f1532 (SH16 +28); V09 voice f1540–1592 (SH16 +36..+88, file start f1535); gulp f1594; pizz f1598
- L09 "แต่ก้อยปลาดิบ" f1682, "เสี่ยงพยาธิ" ≈ f1733 (est)
- L10 phrase 1 ends f1807; "แต่ไดโนเสาร์…" f1818 (= SH20 start)
- W-HEN picture f1753–1789; hen foot plant (SH20 +32) f1850
- Cluck V06 f2010 (SH22 +81); hen foot thud f2049 (SH22 +120); E-TAG f2065 (SH22 +136); last frame f2099

R1.4 frames (R1.3 in brackets where moved; superseded from L09 on):

- L02 phrase 2 "แต่แทบไม่มี" f165 (sh2 +73, measured pause)
- L04 "ยังไม่มีดอกไม้" f411 (sh5 +34, measured)
- V03 overlap −0.3 s: file f478, voice f488–504
- L05 "บางต้น" f569 (sh7 +52, measured)
- L06b "ต้มแล้ว" f875 (sh10 +32, measured)
- L07 "แต่กว่า" f1052, "ก็ราว ๆ สี่ห้าเดือน" f1086 (measured; R1.3 f996/f1030)
- L07b "แต่ต้องเก็บ" f1232 (measured; R1.3 f1176)
- L08 "กินข้าวกับอะไร" f1319 (measured; R1.3 f1263)
- V09 voice f1402–1454 inside W-RIVER (SH16 +52..+104, file start f1397; R1.3 f1311–1363); pterosaur grab contact f1394 (SH16 +44; R1.3 f1308)
- L09 "แต่ก้อยปลาดิบ" f1558 (measured), "เสี่ยงพยาธิ" ≈ f1609 (est) (R1.3 f1433/f1484)
- L10 phrase 1 ends f1683; "แต่ไดโนเสาร์…" f1694 (measured; R1.3 f1558/f1569)
- W-HEN under L10: picture f1629–1665, hen sounds only
- Hen foot plant f1726 (SH20 +32); cluck V06 f1886 (SH22 +81); T. rex roar f1927–1955; text f1937–1975; E-TAG f1971

## On-screen text (global ranges)

- R1.5: none besides subtitles (the R1.4 SH22 line "Remember who you are", f1937–1975, is dropped by the user, 14 Nov 2026). Shot 4 card has no text; the calendar in shot 12 has no legible text (red dots only); the seed sack in shot 14 has a hand-painted rice-plant mark, no text.

## Rules for every shot

- R01 Truth limits: dinosaurs are hazards or props only (no species name on screen, no film likeness); creatures are partial builds as listed (head/neck, foot/head, silhouettes, far herds).
- R02 Size reference: every shot keeps one known-size reference in frame (K 1.30 m, Y 1.52 m, a hen, the fence 1.2 m, a cup or jar).
- R03 Feet on the ground: planted feet sit on y 0 (or the platform/veranda/granary floor y named in the shot); no float, sink or slide while planted.
- R04 Screen: faces, contacts, cards and reveals above y 1160; the caption band calm (mean ≤ 0.25, p95 ≤ 0.40 on clean frames, `scripts/caption-zone.py`).
- R05 Retention camera (channel): every shot has a small eased yaw arc (6–10°) and a 5–15 % push unless the shot says hold; frame 0 of shot 1 already shows the rippling sky.
- R06 Light marks the chapter (brief visual progression); night shots use the opaque cast base (DF-20261031-painted-opaque-cast).
- R07 Ambient clocks: fire, hens, fronds, water and mosquitoes run on ambient clocks through holds (DF-20261030-painted-story-hold-ambient-clock); event clocks are shot-local.
- R08 Four views squared to the lens: Y, K, villagers and the hen pick the view by the camera yaw (front / 3/4 / side / back), view cues on.
- R09 K02 (sugar and salt jars) stays on the under-house shelf at (−4.4, 1.1, −7.85) in every VIL night shot; never lit or framed as important in EP16 (paid in EP18).

## Per-shot staging

Key frames are shot-local `+n`. Every library ID in a Sound line is a candidate only (not listened); Ton checks it against the description, otherwise NEEDS-GEN. Codes (A-, M-, S-, E-) are defined in the [EP16 brief sound direction](../ep16/film-brief.md#sound-direction).

**1. S01-B01-SH01** [0, 92), 92 f. Signature: night village, the sky ripples, white flash. VO: L01 voice f8–94 (+8–+92).
- Camera (R1.1, paddy in frame; Film proposal applied, user 14 Nov 2026): `cam: at (0, 2, -6), yaw 62→59, r 22→20.5 m, eye 1.6, f 820, hy 880`, ease in-out over the shot (space VIL). Matches LF16-VIL-NIGHT (`CAM16_1`, src/painted/survival/look.tsx).
- proj (end, +91; probe of `CAM16_1`): house_ridge 206 px, x 414, y 724–930; coop 79 px, x 612, y 880–959; gate 45 px, x 774, y 895–940; conifer 749 px, x 1053, y 171–920; flooded paddy fills frame right from y ≈ 996 (NW corner x 1116) down past the band; work corner (firewood stack) 81 px, x 726, y 929–1010. Wide: no lead check.
- Staging: VIL night (moon blue, warm window light from the house). Whole village read at once: stilt house left, coop centre, granary right, fence and gate, paddy edge frame right. The sky is already rippling at +0 (concentric slow rings like water, centred above the forest at screen x 600, y 420; ENV-SKY band warp, new). Nobody in the yard; one warm window; the coop dark. K02 is present in the set (under-house kitchen shelf) but not legible at this scale (by design).
- Key frames: +0 ripple already moving (UT01: strange thing at frame 0); +8 VO starts; +60 ripple speeds up and brightens; +84 white bloom starts from the ripple centre; +86–+91 full white; cut inside the white at +92.
- Sound: A-VN from +0 (crickets, frogs, one far odd call); S-WORM: low swelling hum with a watery warble from +0, rising to a peak at +86, then a soft bright whoosh into the white +84–+92 (NEEDS-GEN, shared by EP16-18). No music.
- Entry → exit: +0 night wide, ripple → +91 white frame.

**2. S01-B01-SH02** [92, 217), 125 f. Morning reveal, Keng runs out of the gate past the hens. VO: L01 voice f8–94 (+0–+2); L02 voice f110–211 (+18–+119).
- Camera (R1.1): `cam: at (0, 2, -6) → (2, 1.5, -10), yaw 59→40, r 20.5→13 m, eye 1.6→1.5, f 820, hy 880`, ease in-out over the shot (space VIL). Matches LF16-VIL-MORN (`CAM16_2`).
- proj (+0 → +124; probe): K_start 44 px, x 398, y 895–939 → 85 px, x −47 (left of frame; he has left the ladder by then); K_coop 54 px, x 566, y 898–952 → 107 px, x 291, y 907–1014; K_gate 45 px, x 774, y 895–940 → 68 px, x 617, y 897–965; conifer 749 px, x 1053, y 171–920 → 831 px, x 854, y 91–922; paddy edge frame right through the push. Wide: no lead check. Known gap: LF16-VIL-MORN caption band luma 0.632 / p95 0.646 (bright morning dirt and the near log seat cross the band); Editor caption stroke carries it, or darken the near ground at plate (open).
- Staging: Hard cut from white to VIL morning at the same framing (camera = shot 1 end). Beyond the fence: wall of tree ferns, cycads and 30 m conifers, all green, no flowers (SET-MESO-FOREST). K `boy-school + new: kid-home`, P38 run, empty basket in the left hand, runs from the ladder foot (−3.5, 0, −3.6) past the coop (2.3, 0, −5.3) to the gate (2.1, 0, −12.0); hens fuss and flap aside as he passes (K01, background). Camera pushes toward the gate while he runs.
- Key frames: +0 white → morning (2 f white tail inside L01 end); +18 VO L02; +30–+40 hens scatter; +73 "แต่แทบไม่มี": he stops at the gate (P01, basket hanging), facing −z (back view, `backQuarter`); +124 last frame.
- Sound: M16 starts +0 with a three-note bright phin pickup (morning); A-VM (hens, buzzing insects, frond rustle, a far low rumble); S16-01 flip-flop run patter +5–+70 on packed dirt; S16-02 hens flap and squawk +30 (three hens, short, comic, 0.8 s).
- Entry → exit: +0 empty morning yard → +124 K at the gate, back to camera, forest beyond.

**3. S01-B02-SH03** [217, 286), 69 f. V01: Keng at the forest edge, looking up for fruit. VO: V01 voice f224–269 (+7–+52).
- Camera: `cam: at (3.4, 1, -16.5), yaw 75→85, r 2.4→2 m, eye 0.95, f 900, hy 1020, pitch 15°`, ease in-out over the shot (est) (space VIL).
- proj: K 562 px, x 540, y 1126–1688 → 686 px, x 540, y 1100–1786. Lead: K.
- Staging: SET-EDGE (forest edge outside the gate). K at E1 (3.4, 0, −16.5) facing −z into the forest, then turning head left/right (`look-around`), `worried`, basket held up empty. Low camera (pitch 15°) so the fronds and conifer trunks fill the top: no fruit anywhere.
- Key frames: +7–+52 V01 voice ("มะม่วงล่ะ?" head left, "กล้วยล่ะ?" head right about +30); +60 basket drops to his side.
- Sound: M16 under; A-FE (thick insect buzz, frond rustle); S16-03 frond push swish at +2 (big fern leaves, dry rustle, 0.5 s).
- Entry → exit: +0 K looking up → +68 basket lowered.

**4. S01-B02-SH04** [286, 377), 91 f. Insert card: fruit and vegetables with their flowers. VO: L03 voice f286–361 (+0–+75).
- Camera: screen-space insert (no world camera); slow 5 % push over the shot (est).
- Staging: Screen-space painted card (crisp SVG frames, painted fills) over a blurred, darkened forest plate. Four tiles in a 2×2 grid, x 150–930, y 300–1100 (tile 370×370, gap 40): mango, banana, chilli, morning glory (ผักบุ้ง). Each tile's flower pops in beside its food. No text on the card.
- Key frames: +0 card slides up (8 f ease-out); flower pops at +6 mango, +24 banana, +42 chilli, +60 morning glory (est, syllable-spread over L03; no internal pause measured); +76–+90 hold.
- Sound: M16 light; S16-04 four soft wooden ticks with a small bloom, one per flower (+6, +24, +42, +60; pong lang mallet on bamboo, bright, dry, 0.2 s each; candidate `ui_pop_01`, Ton tests, else NEEDS-GEN).
- Entry → exit: +0 card in → +90 four foods with flowers.

**5. S01-B02-SH05** [377, 443), 66 f. L04: back to the forest, the flowers fade. VO: L04 voice f377–437 (+0–+60).
- Camera: `cam: at (3.2, 1.5, -18), yaw 20→12, r 7→6 m, eye 1.4, f 820, hy 960, pitch 8°`, ease in-out over the shot (est) (space VIL).
- proj: K 205 px, x 489, y 1090–1295 [band] → 254 px, x 518, y 1094–1348; treefern 391 px, x 494, y 799–1190 [band] → 436 px, x 445, y 768–1204 [band]. Wide: no lead check.
- Staging: SET-EDGE wide, K small at E1 (back view) facing the forest. The four flowers from shot 4 float as painted ghost overlays over the frond wall and fade out one by one; only green fronds and cones remain.
- Key frames: +0 four ghost flowers at the card positions; fades at +34 ("ยังไม่มีดอกไม้"), +40, +46, +52 (8 f each); +60 forest all green.
- Sound: M16 drops to bass only; A-FE; S16-05 four tiny reverse-shimmer fades on the flower fades (soft, airy, 0.3 s, NEEDS-GEN).
- Entry → exit: +0 flowers over the forest → +65 green only.

**6. S01-B03-SH06** [443, 517), 74 f. V02/V03: Keng reaches for the orange seeds, Grandma slaps his hand. VO: V02 voice f450–479 (+7–+36); V03 voice f488–504 (+45–+61).
- Camera: `cam: at (3.4, 0.9, -16.2), yaw 55→62, r 2.8→2.5 m, eye 1, f 950, hy 980`, ease in-out over the shot (est) (space VIL).
- proj: K 490 px, x 521, y 867–1357 → 554 px, x 505, y 852–1406; Y 628 px, x 1037, y 765–1393 → 777 px, x 1120, y 714–1491 [cropped]; seeds 19 px, x 764, y 991–1010 → 22 px, x 787, y 993–1015. Lead: K.
- Staging: SET-EDGE. Cycad C1 at (4.05, 0, −16.7) with a cluster of bright orange seeds at (3.95, 0.92, −16.55) (screen right of K). K at E2 (3.6, 0, −16.0) `3/4 right`, P16 reach toward the seeds, `happy`. Y `woman-elder + new: isan-home`, carrying a knife and a sack, steps in from frame right behind the cycad to (4.5, 0, −16.9) (half-cropped at the right edge by design) and slaps his hand away. After the slap both settle to the shot-7 marks K (3.75, 0, −16.15), Y (4.15, 0, −15.9) across the cut.
- Key frames: +7–+36 V02 (he reaches; fingertips 3 cm from the seeds at +36); +40 Y's hand enters; +45 slap contact (her palm on the back of his hand, at the seeds); V03 "อย่า!" +45–+61; +47–+55 three seeds drop to the ground (contact y 0).
- Sound: M16 stops dead at +44 (comic stop); S16-06 slap at +45 (palm on the back of a small hand, dry skin smack, close, 0.15 s, comic not painful, NEEDS-GEN); S16-07 seeds patter on leaf litter +50 (three light taps, 0.4 s).
- Entry → exit: +0 K reaching → +73 seeds on the ground, K pulling his hand back.

**7. S01-B03-SH07** [517, 637), 120 f. L05: Keng rubs his hand, Grandma shakes her head. VO: L05 voice f517–631 (+0–+114).
- Camera: `cam: at (3.95, 1, -16), yaw 70→78, r 2→1.8 m, eye 1.05, f 1000, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: K 581 px, x 572, y 848–1429 → 641 px, x 592, y 837–1478; Y 855 px, x 526, y 696–1551 → 960 px, x 504, y 663–1623. Lead: K.
- Staging: Two-shot, K front-left 3/4, Y right 3/4 turned to him. K rubs the back of his slapped hand (`new: rub-hand`, `ouch` → `sad`); Y drops the seed she picked up and `shake-head`, stern then softening (`angry` → `worried`).
- Key frames: +0 rub; +10–+40 Y shake-head; +52 "บางต้น": Y holds up one finger (P41 variant, finger up, not pointing at him); +114 last word.
- Sound: M16 back in, quieter; A-FE; no SFX besides a short sleeve rustle at +2.
- Entry → exit: +0 rubbing → +119 Y finger up, K sulking.

**8. S01-B03-SH08** [637, 781), 144 f. V04/L06: a long-neck lowers its head to eat the same plant. VO: V04 voice f644–703 (+7–+66); L06 voice f716–775 (+79–+138).
- Camera (R1.1; Film proposal applied, user 14 Nov 2026): `cam: at (6, 2.3, -20.5), yaw -24→-20, r 8.3→7.6 m, eye 0.8, f 1000, hy 880, pitch 12°`, ease in-out over the shot (space VIL). Matches LF16-LONGNECK (`CAM16_8`, src/painted/survival/look-b.tsx).
- proj (+0 → +143; probe): K 387 px, x 316, y 950–1337 → 474 px, x 145, y 919–1393; Y 475 px, x 450, y 875–1351 → 595 px, x 291, y 822–1418; C1 (seed cycad) 509 → 609 px, x 478 → 369; C2 356 px, x 666, y 872–1228 → 403 px, x 658, y 844–1247; LN_head_high (0.85 m head card, 7.5 m up) 91 px, x 646, y 102–193 → 98 px, y −1–97; LN_head_at_C2 127 px, x 666, y 799–926 → 142 px, x 658, y 762–904. Lead: Y (475 → 595 px). Known gap: both pairs of feet sit in the caption band (y 1337–1418), as in R1; faces and the C2 bite are above y 930 (open: accept feet under the caption, or hy 820 at plate).
- Staging: Low wide (pitch 12°). Beyond them, a second cycad C2 at (5.9, 0, −18.4) (R1.1, was (7.0, 0, −21.0)). The long-neck head card is scaled x1.3 (head ≈ 0.85 m, AS-LONGNECK). A long-neck (`new: long-neck head/neck`, CR-SAUROPOD, only the neck and head in frame, body hidden by the conifers) lowers its head from above to C2 and munches. K points at it (P05 point side) `surprised` → `smug`; Y looks too (`turn-head-right`). At L06 the long-neck chews on, unbothered; K lowers his finger.
- Key frames: +0 head high (screen y 102–193); +7–+66 V04; +12 K points; +40 head at C2 (screen y ≈ 780–915), bites; +79 L06; +95 K lowers his finger (P01, `sad`); +138 last word.
- Sound: M16 under; S16-08 heavy leaf crunch and slow chewing from +40, looping to the end (big animal, wet plant fibre, 4 m away, unhurried, NEEDS-GEN); S16-09 deep breath out through the nose at +100 (huge, soft, 1 s).
- Entry → exit: +0 long-neck head high → +143 chewing, K finger down.

**9. S01-B03-SH09** [781, 843), 62 f. V07: Keng scoops the seeds and mimes stirring a pot. VO: V07 voice f790–828 (+9–+47).
- Camera: `cam: at (3.75, 0.8, -16.15), yaw 40→48, r 1.9→1.7 m, eye 0.95, f 1000, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: K 684 px, x 540, y 756–1440 → 765 px, x 540, y 734–1499. Lead: K.
- Staging: K front 3/4, crouched then up, scoops the dropped seeds into his palm and mimes stirring a pot with the other hand (`new: mime-stir`), `smug`. Y out of frame right (her shadow edge on him).
- Key frames: +0 scoop; +9–+47 V07; +20–+55 stirring circles (2 loops).
- Sound: M16 small upward phin run on +9 (pleased); S16-10 seeds rattle in the palm +4 (0.3 s).
- Entry → exit: +0 crouched → +61 stirring, grinning.

**10. S01-B03-SH10** [843, 909), 66 f. L06b: Grandma tosses the seeds away into the forest. VO: L06b voice f843–903 (+0–+60).
- Camera: `cam: at (5.6, 1.8, -19.5), yaw -20→-8, r 7.6→7 m, eye 1.1, f 820, hy 920, pitch 8°`, ease in-out over the shot (est) (space VIL).
- proj: K 294 px, x 406, y 992–1286 [band] → 329 px, x 194, y 987–1316 [band]; Y 351 px, x 510, y 942–1293 [band] → 405 px, x 289, y 929–1334 [band]; seeds_land 6 px, x 580, y 1143–1149 → 6 px, x 599, y 1153–1159; LN_head 56 px, x 599, y 951–1007 → 61 px, x 629, y 943–1004. Lead: Y.
- Staging: Y takes the seeds out of K's hand and tosses them into the forest toward the long-neck; the seeds land near C2 at (6.2, 0, −20.0); the long-neck's head follows them down. Staging deviation VD16-06: the script says "back over the fence"; they are already outside the fence (E1 is 4.5 m beyond it), so she tosses them deeper into the forest. K `sad` → `surprised` as the long-neck eats them.
- Key frames: +0–+12 take; +14 release; +30 seeds land (screen y 1143–1159, above the band); +18–+45 head follows; +32 "ต้มแล้ว"; +60 K's jaw drops.
- Sound: S16-11 small whoosh of the toss +14; S16-07 patter (reuse) +30; S16-08 crunch resumes +45.
- Entry → exit: +0 seeds in K's hand → +65 the long-neck eats them, K gaping.

**11. S01-B04-SH11** [909, 968), 59 f. V05: Keng at the empty paddy with a hoe. VO: V05 voice f916–953 (+7–+44).
- Camera: `cam: at (15.6, 1, -1), yaw -60→-50, r 4→3.4 m, eye 1, f 900, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: K 293 px, x 540, y 892–1185 [band] → 344 px, x 540, y 881–1225 [band]; paddy_far 17 px, x 933, y 998–1015 → 18 px, x 1117, y 1004–1022 [cropped]. Lead: K.
- Staging: VIL paddy edge (east, outside the yard). K at P1 (15.6, 0, −1.0) with a hoe on his shoulder (`new: hoe`), P09 hands on hips variant, facing the camera 3/4; behind him the empty mud paddy to x 30. Bright humid day.
- Key frames: +0 he runs in from frame left (4 steps) and stops at +6; +7–+44 V05; +40 he thumps the hoe down.
- Sound: M16 bouncy restart on +0; A-VM (open field, insects); S16-12 hoe blade thunk into wet mud +40 (heavy, damp, 0.3 s).
- Entry → exit: +0 running in → +58 hoe planted.

**12. S01-B04-SH12** [968, 1070), 102 f. L07: calendar pages flip while the paddy ripens. VO: L07 voice f968–1064 (+0–+96).
- Camera: `cam: at (-1, 1.5, -1.3), yaw -90→-84, r 0.9→0.75 m, eye 1.5, f 1000, hy 900`, ease in-out over the shot (est) (space VIL).
- proj: cal_bottom 511 px, x 540, y 616–1127 → 616 px, x 537, y 558–1174. Lead: cal_bottom.
- Staging: Calendar on the house's east corner post (−1.02, 1.30–1.75, −1.3), camera looking east (+x) with the paddy soft beyond the fence. Tear-off calendar with plain pages (no legible text; a big red dot per page only). The paddy behind changes by painted dissolve: mud → seedlings → tall green → gold (`painted.shots[].dissolveSec`, DF-20261029-painted-timeline-dissolve).
- Key frames: +0 hold on the calendar; +28 "แต่กว่า": first page tears; pages flip every 12 f to +90 (6 flips); paddy dissolves at +40 seedlings, +62 green ("ก็ราว ๆ สี่ห้าเดือน"), +84 gold; +96 hold gold.
- Sound: M16 ticks along (wood block on the beat); S16-13 page tear/flip, 6 quick paper rips +28 to +88 (one calendar sheet each, dry, close; candidate `whoosh_page-flip-paper_01`, Ton tests); A-VM wind in grass rises with the gold.
- Entry → exit: +0 calendar, mud behind → +101 calendar, gold paddy.

**13. S01-B04-SH13** [1070, 1146), 76 f. V08: Keng swings the granary open, arms wide. VO: V08 voice f1079–1129 (+9–+59).
- Camera: `cam: at (7.75, 1.5, -7.3), yaw 180, r 1.9→1.6 m, eye 1.7, f 900, hy 900, pitch -8°`, ease in-out over the shot (est) (space VIL).
- proj: K 525 px, x 540, y 687–1212 [band] → 604 px, x 540, y 673–1277 [band]; sacks 684 px, x 743, y 774–1458 → 1239 px, x 908, y 774–2013 [cropped]. Lead: K.
- Staging: Inside the granary looking out through the door (camera on the granary floor y 0.6). K swings the door open at +0–+8 and stands in the doorway at (7.75, 0.6, −7.05), backlit by the bright yard, sacks of rice stacked frame right (7.6, 0.6–1.2, −8.6). He spreads his arms (`new: arms-wide ta-da`), `happy`.
- Key frames: +0 door swings (8 f); +9–+59 V08; +30 arms fully out; +75 last frame.
- Sound: M16 "ta-da" pong lang two-note on +30; S16-14 wooden door creak and bump +0 (old teak, dry hinge, 0.6 s, NEEDS-GEN).
- Entry → exit: +0 dark door → +75 K arms wide, sacks.

**14. S01-B04-SH14** [1146, 1227), 81 f. L07b: Grandma ties off a seed sack and shelves it. VO: L07b voice f1146–1217 (+0–+71).
- Camera: `cam: at (7.5, 1.9, -8.8), yaw 20→12, r 1.5→1.3 m, eye 2.2, f 900, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: Y_kneel 553 px, x 507, y 960–1513 → 634 px, x 491, y 960–1594; shelf 42 px, x 414, y 834–876 → 48 px, x 357, y 817–865. Lead: Y_kneel.
- Staging: Inside the granary. Y kneels (P34) at (7.4, 0.6, −8.9) tying a sack's neck with string, the sack marked with a hand-painted rice-plant (no text); she lifts it to the high shelf (7.0, 2.0, −9.3); then scoops a little rice with a coconut-shell scoop (`new: coconut scoop`). K in the doorway soft in the background.
- Key frames: +0–+28 tie; +30 "แต่ต้องเก็บ": lift begins; +50 sack on the shelf; +58–+78 one small scoop into a bowl.
- Sound: M16 under; S16-15 string pulled tight on burlap +10 and +24 (rough fibre, close, 0.3 s); S16-16 sack set on a wooden shelf +50 (soft heavy thud); S16-17 rice poured from a coconut shell +60 (dry grain hiss, 0.6 s).
- Entry → exit: +0 tying → +80 Y with the small scoop.

**15. S01-B04-SH15** [1227, 1294), 67 f. L08: the village at the empty paddy, crane down to the rice bowl. VO: L08 voice f1227–1288 (+0–+61).
- Camera: `cam: at (16, 1.2, -0.4) → (15.3, 1, -0.4), yaw -80→-70, r 5.5→1 m, eye 2.2→1.4, f 850, hy 900, pitch -4→-22°`, ease in-out over the shot (est) (space VIL).
- proj: Y 262 px, x 482, y 962–1224 [band] → 1027 px, x 408, y 428–1455; bowl 11 px, x 508, y 1041–1052 → 46 px, x 488, y 860–906; villager 253 px, x 148, y 917–1170 → 650 px, x -244, y 412–1062 [cropped]. Lead: Y.
- Staging: Paddy edge, the whole village lines it (8–12 villagers, PEOPLE in `new: isan-home` variants, `worried`), looking at the empty mud. Camera cranes down and in to Y's hands at (15.25, 1.0, −0.45): a small bowl with a scoop of rice, nothing beside it.
- Key frames: +0 wide; +10 crane starts (ease in-out); +36 "กินข้าวกับอะไร": camera arrives at the bowl; +36–+66 hold.
- Sound: M16 thins to one plucked note held; A-VM quiet field; one villager's sigh +20 (crowd breath, soft).
- Entry → exit: +0 villagers at the paddy → +66 the bowl close.

**16. S01-B05-SH16** [1294, 1375), 81 f. W-RIVER/V09: a pterosaur snatches Keng's fish. VO: none.
- Camera: `cam: at (1.5, 1.2, 0.4), yaw 185→175, r 3.6→3.2 m, eye 1, f 880, hy 1000, pitch 10°`, ease in-out over the shot (est) (space RIV).
- proj: K 339 px, x 540, y 1081–1420 → 384 px, x 540, y 1071–1455; net_fish 24 px, x 485, y 939–963 → 28 px, x 488, y 909–937. Lead: K.
- Staging: SET-RIVER, bright day, villagers casting nets and lines in the shallows. K at R1 (1.5, 0, 0.4) knee-deep, hauls up his hand net with one fish at (1.7, 1.75, 0.2). A pterosaur (`new: pterosaur swoop`, prop, not named) dives in from top right, takes the fish in its feet and climbs out top left. K shakes his empty net at the sky (P13 punch variant up), `angry`; villagers laugh.
- Key frames: +0–+10 net up, fish flapping; +8 pterosaur enters (shadow sweeps first at +4); +14 snatch contact (feet on fish at the net rim); +26 it exits; +17–+69 V09; +45–+80 villagers laugh (two in the background bend over).
- Sound: M16 out at +0 (W-RIVER plays without music for the gag) then a comic pizz button at +70; A-RV (water over pebbles, splashes); S16-18 net splash +2; S16-19 wing rush over and up +8–+26 (big leathery wings, one beat, close to far, doppler, no call; candidate `action_bird-pass-low_01`, Ton tests, likely too small); S16-20 villagers' laugh +45 (light, warm, several voices, no words).
- Entry → exit: +0 fish up → +80 empty net, laughter.

**17. S01-B05-SH17** [1375, 1504), 129 f. L09: evening fire, Grandma pushes the raw ก้อย toward the fire. VO: L09 voice f1375–1502 (+0–+127).
- Camera: `cam: at (-1, 0.8, 1.5), yaw 15→5, r 3.4→2.9 m, eye 1, f 880, hy 960`, ease in-out over the shot (est) (space VIL).
- proj: Y_squat 328 px, x 274, y 960–1288 [band] → 428 px, x 251, y 960–1388; nb 420 px, x 897, y 905–1325 [band] → 482 px, x 1016, y 897–1379; fire 155 px, x 540, y 1064–1219 [band] → 182 px, x 540, y 1081–1263 [band]; shelf_K02 13 px, x 483, y 940–953 → 14 px, x 359, y 939–953. Lead: Y_squat.
- Staging: VIL yard, evening fire F1 at (−1.0, 0, 1.5): fish grilling on sticks around it. Y squats (P32) left at (−1.6, 0, 2.4); a neighbour `man-elder + new: isan-home` right at (0.2, 0, 2.2) reaches for a bowl of raw ก้อย (raw minced fish with herbs); Y takes the bowl and pushes it toward the fire (cook it). K beside Y, eating grilled fish. Behind: the under-house dark, one lamp; the sugar and salt jars (K02) sit on the kitchen shelf (−4.4, 1.1, −7.85), seen through the front slat screen's window opening (x −2.8..−1.6, z −1.0) — small (about 14 px), a plant only.
- Key frames: +0 grilling; +58 "แต่ก้อยปลาดิบ": neighbour's hand reaches the bowl; +70–+95 Y slides the bowl away toward the fire, `shake-head`; +109 "เสี่ยงพยาธิ": neighbour sheepish (`smug` → `sad`); +128 last frame.
- Sound: M16 night variant, soft; A-FI (fire crackle, low chatter, night insects); S16-21 fish skin sizzle on the fire loop from +0 (small, close); S16-22 clay bowl slid on a mat +72 (0.4 s).
- Entry → exit: +0 fire, fish grilling → +128 bowl beside the fire.

**18. S01-B06-SH18** [1504, 1540), 36 f. W-HEN: morning, Grandma out of the coop with an apron full of eggs. VO: L10 voice f1515–1614 (+11–+36).
- Camera: `cam: at (3.7, 0.35, -4.3), yaw 20→12, r 1.6→1.4 m, eye 0.45, f 950, hy 900, pitch 4°`, ease in-out over the shot (est) (space VIL).
- proj: hen 244 px, x 540, y 996–1240 [band] → 279 px, x 540, y 1001–1280 [band]; Y 588 px, x 913, y 558–1146 → 607 px, x 875, y 545–1152. Lead: hen.
- Staging: VIL morning at the coop door (4.0, 0, −4.6 face). Low camera at hen height. A hen (`new: Thai backyard hen`, K01) in the foreground (3.7, 0, −4.3) trotting; Y steps out of the coop behind (4.3, 0, −5.4) holding her apron up full of eggs (`kitchen-apron` over `new: isan-home`), `happy`.
- Key frames: +0 hen trots in; +6 Y steps out; +11 L10 starts (W-HEN plays under L10); +35 last frame.
- Sound: M16 morning restatement (3 phin notes); A-VM; S16-23 hens clucking contentedly around the coop from +0 (several birds, close, soft); S16-24 eggs knock softly in the apron +8 (two gentle clinks).
- Entry → exit: +0 hen close → +35 Y with the eggs.

**19. S01-B06-SH19** [1540, 1569), 29 f. L10: Keng looks from the forest to the hens. VO: L10 voice f1515–1614 (+0–+29).
- Camera: `cam: at (2.6, 1, -9), yaw 140→150, r 2.3→2.1 m, eye 1.05, f 950, hy 940`, ease in-out over the shot (est) (space VIL).
- proj: K 537 px, x 540, y 837–1374 → 588 px, x 540, y 827–1415; coop 359 px, x -234, y 817–1176 [cropped] → 330 px, x -92, y 827–1157 [cropped]. Lead: K.
- Staging: K at the gate (2.6, 0, −9.0) turning from the forest (−z) back toward the coop (+z): `turn-head-right`, `surprised`; the coop cropped frame left by design.
- Key frames: +0 looking at the forest; +4–+18 turn; +18 looking at the hens; +28 last frame.
- Sound: M16 holds a suspended chord; A-VM hens low; no SFX (the turn reads in silence).
- Entry → exit: +0 back to camera → +28 eyes on the hens.

**20. S01-B06-SH20** [1569, 1625), 56 f. L10: a hen tilts its head; the three-toed foot. VO: L10 voice f1515–1614 (+0–+45).
- Camera: `cam: at (3.4, 0.25, -8.4), yaw 200→190, r 0.8→0.7 m, eye 0.12, f 1000, hy 1100, pitch 14°`, ease in-out over the shot (est) (space VIL).
- proj: hen 530 px, x 540, y 985–1515 → 602 px, x 540, y 938–1540; foot 66 px, x 563, y 1414–1480 → 74 px, x 523, y 1421–1495. Lead: hen.
- Staging: Hen close (3.4, 0, −8.4), camera at hen eye height. The hen tilts its head at K (lens), then steps: the three-toed scaly foot lands close to the lens (3.45, 0, −8.2).
- Key frames: +0 "แต่ไดโนเสาร์…": hen head-tilt (`new: hen head-tilt`); +24 foot lifts; +32 foot plants (contact y 0, screen y 1480, below the band and readable); +55 last frame.
- Sound: M16 a single low note under "ไดโนเสาร์"; S16-25 hen's curious throat purr +0 (soft trill, 0.5 s, NEEDS-GEN); S16-26 claw scratch on dirt +32 (small, crisp).
- Entry → exit: +0 hen face → +55 foot planted.

**21. S01-B06-SH21** [1625, 1680), 55 f. L11: pull back, the family, the hens, the forest wall. VO: L11 voice f1625–1674 (+0–+49).
- Camera: `cam: at (3, 1.2, -8), yaw 10→22, r 3→7.5 m, eye 1.2→2.4, f 850, hy 920, pitch 0→-5°`, ease in-out over the shot (est) (space VIL).
- proj: K 302 px, x 473, y 897–1199 [band] → 131 px, x 525, y 959–1090; Y 418 px, x 712, y 832–1250 [band] → 168 px, x 610, y 946–1114; fence 147 px, x 625, y 920–1067 → 90 px, x 652, y 936–1026; conifer 1033 px, x 672, y -72–961 [cropped] → 1001 px, x 790, y -82–919 [cropped]. Lead: Y.
- Staging: Pull back and up: K (2.6, 0, −8.6) and Y (3.6, 0, −8.2) with the eggs, the hens around them, the coop, the fence, and the green wall of conifers behind.
- Key frames: +0–+49 pull back (ease out); +49 settle; +54 last frame.
- Sound: M16 resolves (full phrase); A-VM; hens cluck light.
- Entry → exit: +0 two-shot → +54 the yard wide with the forest wall.

**22. S01-B06-SH22** [1680, 1839), 159 f. V10/V06: Keng nose to beak with the hen; one cluck; hold. VO: V10 voice f1688–1746 (+8–+66); V06 voice f1761–1779 (+81–+99).
- Camera: `cam: at (3, 0.5, -8.5), yaw 95→100, r 1.6→2.2 m, eye 0.55, f 950, hy 880`, ease in-out over the shot (est) (space VIL).
- proj: K_crouch 437 px, x 551, y 726–1163 → 331 px, x 557, y 763–1094; hen 296 px, x 525, y 971–1267 [band] → 204 px, x 519, y 943–1147; Y 1106 px, x 1325, y 174–1280 [cropped, band] → 797 px, x 1090, y 371–1168 [cropped]. Lead: K_crouch.
- Staging: K crouches (P34 kneel variant, `surprised`) nose to beak with the same hen (3.25, 0, −8.5); Y stands behind right (legs cropped frame right by design), laughs at the cluck (`laugh`). Hold on the hens and the eggs to the end.
- Key frames: +0 K crouching; +8–+66 V10; +81 hen cluck V06 (+81–+99); +85 Y laughs; +100–+158 hold 2 s on the hens and eggs (camera drift continues 100°).
- Sound: M16 out at +0 (silence under V10 except A-VM); V06 cluck at +81 (designed hen sound, one 'กุ๊ก', Ton, NEEDS-GEN); E-TAG series ending: three descending pong lang notes and a soft khaen chord at +100 (NEEDS-GEN, UT15), ringing out by +158.
- Entry → exit: +0 crouch → +158 end on the hens, ending tag.

## R1.3 revision: dinosaur presence and draft-round-1 fixes

**Owner Film, 14 Nov 2026.** *(R1.4: global timing, shots 10, 11, 15, 16, 21 and 22 are superseded by the [R1.4 revision](#r14-revision-user-answers-stretch-no-triceratops-t-rex-apparition); the triceratops is out of EP16.)* Sources: user verdicts in [fixlist.md](fixlist.md) (draft round 1) with the whole-episode brief "dinosaurs and prehistoric animals as visible heroes", the user's species references `~/ReelsStore/projects/edu/EDU/references/user/2026-11-14_*` (UT10), UT16 (volume, not cut-outs), and the coordinator's 14 Nov request for the cloud T. rex gag. The blocks below **supersede** the per-shot staging above for the shots they name; shots 1, 14, 15, 17, 18, 19 and 21 (user pass) are unchanged. Global timing stays **1839 f** (locked voice); the stretch variants are proposals pending the user's answers (rows Q1, Q6) and move no voice onset except as stated there.

**Creature prototypes (Film look-frame code, not production):** `scripts/edu-series/ep16/r13-looks/beasts.ts` (`buildLongNeck`, `buildTriceratops`, `buildAnkylosaur`, `buildDragonfly`, `paintBeast`: lofted Catmull-Rom volumes, ring faces culled to the lens, banded sun Lambert with far-side dim, silhouette ink, ground shadow) and `looks.tsx` (frames). Boss hardens them into `src/painted/survival/` (N16-06 R2, N16-14..16); the numbers below come from these prototypes. Look frames: `out/ep16/r13/looks/v5/` (AS-BEASTS, LF-SH02, LF-SH03, LF-SH05, LF-SH08, LF-SH10A, LF-SH10, LF-SH11, LF-SH16, LF-SH22SKY); sheet `out/ep16/r13/looks/v5-sheet.png`. Proj numbers marked *probe* come from `npx tsx scripts/edu-series/ep16/r13-looks/probe.mts <case>`; *tile* = read off the v5 sheet (±10 px at 270 px tile, ±40 px full frame); *est* = not measured.

**Depth sort (all creature shots, Boss N16-19):** a creature behind near foliage is one item in `paintSorted`, so its body depth hides it behind ferns the head is in front of. The look frames pass a `sortAt` point at the neck/head; production splits each creature into a body item and a neck/head item.

**Era mix:** the series world mixes all eras (script, user 13 Nov 2026), so the giant dragonfly (a Meganeura-like insect) needs no question. No creature is named on screen or in sound (script W-RIVER "prop only" rule extended to all EP16 creatures).

**2R. S01-B01-SH02** [92, 217), 125 f. *Change: a full long-neck at the forest edge beyond the gate (hook).*
- Camera: unchanged (`CAM16_2`).
- Long-neck LN-A (`new: long-neck` volume, N16-06 R2) at VIL (−4, 0, −17), heading toward (8, −24) (body east-south-east, so the neck shows in profile and arcs), head local (7.6, 14.5, 0) = neck up, reference pose. Idle: neck sway ±2° at 0.25 Hz, tail sway ±4°, head turn ±6° slow; the head lifts from browse (local (7.6, 12.5, 0)) to up over +55–+85 as the camera arrives. Haze 0.02. Sort point (−4, 0, −13.0).
- Far long-necks LN-B (−14, 0, −36) haze 0.42, head (7.0, 13.5, −1); LN-C (16, 0, −40) haze 0.5, walking slowly west (walk 0.3, stride 2.2, ≈ 0.6 m/s). Two pterosaurs gliding: (−2, 16, −22) span 3, heading 0.4 rad; (4, 19, −30) span 3, heading 0.9 rad; drift 1.5 m/s, flap one beat per 40 f.
- proj (*probe 02d*): LN-A bounds +10 x 415–988, y 446–927; +73 x 227–896, y 392–933, snout (889, 422). K's path is unchanged from R1.1 (pass); Editor checks that the cart does not hide K at +60–+125 (it hides K at the look-frame position (2.1, −11.6) at +73).
- Sound: add S16-27 long-neck breath-rumble at +60.
- Owner: Boss (N16-06 R2, N16-19); Editor places.

**3R. S01-B02-SH03** [217, 286), 69 f. *Change: basket fixed in the hand; a giant dragonfly hovers at Keng's face.*
- Camera: unchanged (`at (3.4, 1, −16.5), yaw 75→85, r 2.4→2 m, eye 0.95, f 900, hy 1020, pitch 15°`).
- Basket: drawn every frame from K's `lHand` anchor through the `held` callback with a fixed grip angle (sway ±5° with the head turn), never keyed or interpolated on its own (the draft's warp and jump).
- Dragonfly DF (`new: giant dragonfly`, N16-16; body 0.42 m, wingspan ≈ 0.7 m, veined translucent wings): enters from frame right at +14 at (6.2, 1.5, −16.9); arrives at the hover point (5.0, 1.2, −16.35) by +22 (ground 1.2, pitch 0.15 rad, bank −0.55 rad); hovers +22–+46 (bob ±0.03 m at 2 Hz, wings alternate two blur states each frame); darts out screen-left to (2.0, 1.6, −17.5) over +46–+52.
- K: gaze follows DF from +22 to +50 (eyes, then head), `surprised`, between "มะม่วงล่ะ?" and "กล้วยล่ะ?" (V01 +7–+52); look-around otherwise as in R1.1.
- proj (*tile*): DF wings x ≈ 410–1070, y ≈ 520–1000 at +30; K lead ≈ 590 px.
- Sound: S16-28 at +14–+52.
- Owner: Boss (N16-16); Editor (basket, gaze).

**4R. S01-B02-SH04** [286, 377), 91 f. *Change: the card is repainted.* Layout and timing unchanged. Each tile is a painted still with light and shade, not flat SVG: a mango branch with two fruits and a cream flower panicle; a banana hand with its purple bell (ปลี); chillies with a small white flower; morning-glory leaves with a pale violet trumpet. Owner: Boss (N16-09 R2).

**5R. S01-B02-SH05** [377, 443), 66 f. *Change: the flowers are painted blossoms (no square tiles); an ankylosaur browses behind Keng.*
- Camera: unchanged, except hy 960→880 (*est*: lifts the ankylosaur's feet above y 1160; re-probe).
- Flowers: the four blossoms from 4R are cut-out painted shapes with no tile or frame, floating over the frond wall at screen x ≈ 260, 440, 640, 820 and y 520–760 (*est*); each shrinks 1→0.85 and fades over 8 f, starting at +34, +40, +46 and +52.
- Ankylosaur AN (`new: ankylosaur`, N16-15): walks from (2.2, 0, −19.8) at +0 to (1.0, 0, −19.6) by +30 (walk 0.4, stride 1.0 m, heading 0.15 rad). Head down to a fern and munching +30–+66 (head param, jaw 0↔0.3 at 1 Hz). Tail sway ±5°.
- proj (*probe 05*, AN at (1.5, −20.5), hy 960): AN bounds x 81–723, y 985–1225, eye (678, 1123); at hy 880, ≈ y 905–1145.
- Sound: S16-30 at +0–+30 (steps), +32 (munch).
- Owner: Boss (N16-15, N16-09 R2); Editor.

**6R. S01-B03-SH06** [443, 517), 74 f. *Change: the seed cone stays whole.*
- Camera: unchanged.
- Prop: `new: cycad seed cone` (N16-17): one rigid ovoid cluster, 0.22 × 0.16 m, of ~9 glossy orange seeds on a short brown stalk, with a grip anchor and a mouth anchor (used in 10R).
- K: reaches (P16) +0–+14 to the cone at (3.95, 0.92, −16.55); grip contact at +14; plucks it whole +14–+24 (parented to `rHand` from +14); holds it up at chest and looks at it, `happy`, +24–+44.
- Slap: Y's slap contact on the back of K's hand at +45 (V03 onset f488, kept).
- Cone: leaves the hand at +45 and falls in one arc to the ground at (3.9, 0, −16.0) by +55; one 0.04 m bounce at +58; at rest from +60. **No seeds scatter.**
- Y: ends at (4.45, 0, −16.1) facing K (SH07 continuity mark).
- Sound: S16-07 is redefined as a single soft thud of the cone on leaf litter with a faint seed rattle, 0.3 s, at +55.
- Owner: Boss (N16-17); Editor.

**7R. S01-B03-SH07** [517, 637), 120 f. *Change: restaged so neither head is hidden; smooth motion.*
- Camera: `cam: at (3.95, 1.0, −16.0), yaw 4→−4, r 2.2→2.0 m, eye 1.05, f 1000, hy 960`, ease in-out (VIL). Was yaw 70→78, which put Y in line with K and hid his head.
- Positions: K at (3.5, 0, −16.05) facing (0.6, 0.8); Y at (4.45, 0, −16.1) facing (−0.6, 0.8). Both are 3/4 to the lens and turned to each other.
- proj (*est*): K lead ≈ 619 px; Y lead ≈ 724 px.
- K: rub cycle, right hand circling over the back of the left, 1 Hz, +0–+60; `ouch` → `sad` blended over 8 f at +30.
- Y: shake-head, two cycles at 1.2 Hz, +10–+45, eased; finger up at +52 "บางต้น" (P41 variant, kept). She holds nothing (the cone is on the ground).
- Every pose change blends over 6–8 f; no snaps.
- Owner: Editor.

**8R. S01-B03-SH08** [637, 781), 144 f. *Change: a volume long-neck with its body in frame; Keng's arm aims at the head.*
- Camera: unchanged (`CAM16_8`).
- Long-neck LN at body (13, 0, −22) , body behind the conifers frame right. The head travels along the neck bezier from high (out of frame top) at +0 to C2's crown, head target (5.75, 2.35, −18.3), by +40 (acceptance kept). It bites at +40, then chews at 0.8 Hz (jaw 0↔0.35) with a ±0.05 m head bob, +40–+144. Sort point (5.6, 0, −17.9).
- K: facing (1, 0.35), side-on and screen-right. Pointing pose `new: point-up` (N16-18): right arm extended along the line from K's shoulder (≈ K + 1.0 m up) to the head at (5.75, 2.35, −18.3), ≈ 31° above level on screen (*tile*: shoulder ≈ (260, 1010), head ≈ (680, 760)). Raised +7–+15 on V04 onset, held to +79, lowered +79–+110 during L06 (script "lowers his finger"), down by +110.
- P05 cannot serve: it points the left arm to the side, so a back view points screen-left and a side view points into depth (the draft's error).
- Y: unchanged.
- proj (*tile*): LN x ≈ 550–1080, y ≈ 100–1200; head ≈ (680, 760); K lead ≈ 440 px, Y lead ≈ 540 px (W shot, reference only).
- Owner: Boss (N16-06 R2, N16-18, N16-19); Editor.

**9R. S01-B03-SH09** [781, 843), 62 f. *Change: redrawn; the cone stays in his hand.*
- Camera: unchanged; check that K's head is never cropped at the crouch.
- K: crouches at the cone (3.9, 0, −16.0) at +0. Picks it up with `lHand` +4–+12 (contact at +8; parented from +8). Stands +12–+20, holding it at chest in `lHand` to the end. Right hand mime-stir (N16-13): a 0.08 m circle in front of the belly, 1.2 Hz, +20–+56 (three cycles). `smug`. V07 +9–+47.
- No seeds scatter or vanish.
- Owner: Editor (Boss only for the N16-13 pose).

**10R. S01-B03-SH10** [843, 909), 66 f. *Change: the long-neck takes the cone in its jaws in close-up.*
- Camera: one continuous push, `cam: at (5.6, 1.8, −19.5) → (5.4, 0.9, −19.0), yaw −20, r 7.6→2.6 m, eye 1.1, f 820→950, hy 920→900, pitch 8°`. Wide hold +0–+16, push +16–+44 eased, CU +44–+66 (look frames: CAM10A at +14, CAM10 end). If `camMove` does not interpolate `f`, use f 900 throughout and re-probe.
- LN: body at (12, 0, −24).
- Y: takes the cone from K +0–+6 (contact +4); toss (P16) with release at +12. The cone passes (4.6, 2.1, −17.6) at +14 and lands at (5.4, 0, −19.0) at +26, with one bounce at +29.
- Head: from (6.0, 3.2, −20.0) at +14, follows the cone down (script L06b). Mouth at (5.4, 0.15, −19.0) by +38; the jaw closes on the cone at +38. Lifts to mouth height 1.05 m by +46 with the cone in its jaws (parented to the mouth anchor). Crunch at +48; chews to +66.
- proj (*tile*): CU head ≈ 280 px wide, cone ≈ y 1050–1110. Keep it above 1160; Editor measures on the plate.
- VD16-06 stands: the toss goes toward the long-neck, outside the fence.
- Boat check (safety N5/M04): the creature eating the cone sits under "พิษในพืชหลายชนิด… ต้มแล้วก็ยังอยู่นะ". It restates the shot-8 contrast (it can eat it; people cannot) and adds no claim, but Boat confirms.
- Stretch variant (Q1, +20 f): the CU hold extends to +86 for a second crunch and a satisfied head toss.
- Sound: S16-29 at +48; S16-08 chew after.
- Owner: Boss (N16-06 R2 mouth anchor, N16-17); Editor.

**11R. S01-B04-SH11** [909, 968), 59 f. *(Superseded R1.4 by 11R4: ankylosaur, triceratops deferred.)* *Change: a triceratops is the shot's hero, wading in the paddy behind Keng.*
- Camera: `cam: at (15.6, 1.0, −1.0), yaw −125→−115, r 2.6→2.3 m, eye 0.95, f 950, hy 960, pitch 4°, cx −190` (look frame `CAM11`).
- Triceratops TR (`new: triceratops`, N16-14): walks from (22.0, 0, 6.0) at +0 to (20.5, 0, 4.5) by +40 (heading toward K − 0.6 rad, walk cycle 1.0 Hz, stride 1.4 m). Mud splash on each front-foot plant at +6, +21 and +36 (water ring + brown droplets, 0.3 s). Stops; lifts its head +46–+52; snorts at +50 (nostril vapour puff).
- K: walks in from frame left +0–+10 to P1 (15.6, 0, −1.0), hoe on shoulder, then P09. V05 +7–+44. Hoe into the mud at +40–+46 (thunk +46). Freezes at +50, then turns his head to TR +50–+56, `surprised`.
- proj (*tile*, v5): TR x ≈ 430–1080, y ≈ 670–1150, horns cropped at the right edge by design; K lead ≈ 550 px, face ≈ y 880–960.
- Stretch variant (Q1, +36 f): +59–+95 TR takes one step toward K; its foot plants in his paddy at +70; mud splat on K at +72; K looks up at it +75–+95.
- Sound: S16-31.
- Owner: Boss (N16-14, mud splash layer); Editor.

**12R. S01-B04-SH12** [968, 1070), 102 f. *Change: day/night passage by sky, not page flicker.*
- Camera (*est*, re-probe): `cam: at (16, 1.2, −1.0), yaw −88→−86, r 17.6→17.0 m, eye 1.6, f 820, hy 900`, slow push (VIL). From beside the house looking east over the fence to the paddy; the calendar post (−1.02, 1.30–1.75, −1.3) at the left edge.
- Sky cycle (ENV-SKY cycle, N16-20): seven day cycles of 18, 16, 14, 14, 12, 12 and 10 f (= 96 f), ending in day at +96 and holding gold to +102.
- Each cycle runs day 55 %, dusk 10 %, night 25 %, dawn 10 %, as a continuous colour ramp. Night floor luminance 0.35 (navy with stars), never black; no hard frame switch.
- Sun and moon arc across the sky; fence-post shadows sweep with the sun.
- Paddy stages (N16-20; Editor's local asset promoted) change across each dawn segment (6–8 f crossfade): mud (days 1–2), seedlings (3), green (4–5), tall green (6), gold (7).
- One calendar page peels (6 f) at each dawn; no flash.
- Night 3 (*est* +44–+52): three long-neck silhouettes (LN volumes, flat dark with a moon rim) walk left→right along the far forest line at VIL x 28–34, z −10…−20.
- Sound: S16-32; the S16-12 rips are replaced by one soft page peel per dawn.
- Owner: Boss (N16-20); Editor.

**13R. S01-B04-SH13** [1070, 1146), 76 f. *Change: an exterior view of a readable granary and a visible heap of paddy.*
- Camera (*est*, re-probe): `cam: at (7.75, 1.2, −7.6), yaw 8→4, r 3.4→2.6 m, eye 1.3, f 900, hy 940, pitch −4°`, push in (VIL, from the yard looking −z at the door).
- Granary GR (N16-04 R2): a raised Isan granary (ยุ้งข้าว) on posts, floor y 0.6, zinc roof, plank walls. Double doors at z −7.05, x 7.2–8.3, 1.6 m high, opening inward; a three-step ladder at (7.75, 0–0.6, −6.7).
- Inside: a golden heap of unhusked paddy (ข้าวเปลือก) centred (8.0, 0.6, −8.6), 1.8 m wide and 1.0 m high, with a husk texture. A few grains spill onto the sill at (7.75, 0.62, −7.05). Sacks stacked left at (7.3, 0.6–1.2, −8.6). SH14 continuity: the shelf (7.0, 2.0, −9.3) and Y's kneel spot (7.4, 0.6, −8.9) stay clear.
- K: on the top step in back view at +0. Pushes both doors open +2–+10 (hinges at x 7.2 and 8.3); light falls on the heap from +10. Steps left onto the sill to (7.25, 0.6, −7.1) +10–+18. Turns to the lens +14–+20 (front 3/4). `new: arms-wide ta-da` on V08 (+9–+59), peaking ≈ +30, `happy`. The heap stays visible screen-right of him.
- proj (*est*): K lead ≈ 520 px.
- Sound: S16-14 creak at +2; add S16-33 grain trickle at +10.
- Owner: Boss (N16-04 R2); Editor. SH14 (pass) keeps its camera; if the heap enters its frame it is consistent.

**16R. S01-B05-SH16** [1294, 1375), 81 f. *Change: the pterosaur on screen ≈ 2.5 s, a real foot-to-fish grab, calm laughter.*
- Camera: `cam: at (0.8, 1.3, −0.6), yaw −8→−14, r 2.7→2.5 m, eye 1.0, f 900, hy 800, pitch 12°` (RIV; look `CAM16R`; hy 800 keeps K's face above the caption band).
- K: at (0.6, −0.1, −0.5), view front, P07 with the hand net raised in `rHand`. The fish sits at the net rim (hand + (0.1, −0.7)·unit px).
- Timeline (in-time):
  - +0–+6: K hauls the net up, fish flapping.
  - +4–+10: the pterosaur's shadow sweeps across the water.
  - +6–+14: PT dives from top right (≈ (3.5, 6.0, −4.0)).
  - +14 (f1308, acceptance kept): grab pose, feet on the fish; grab 0→1 over +12–+14.
  - +14–+40: climbs past the lens to the left at full 3 m span (heading −2.6 → −2.0, pitch 0.25 → 0.4, two flaps), fish in its feet (parented to the feet anchor).
  - +40–+60: glides to a far snag at (−6.0, 4.5, −14.0); lands at +60 (fold 0→0.8).
  - +62–+70: tosses its head and gulps the fish (gone at +68).
  - Hold to +81.
- On screen +6–+81 = 75 f (draft < 30 f). V09 voice +17–+69 unchanged.
- K: eyes open +14–+60 (no blink at the grab). Shakes the empty net +20–+40, `surprised` → `angry`.
- Villagers (V at (−2.0, −0.1, −2.6) and others): laugh with body lean ≤ 8° at 1.5 Hz and a shoulder bounce. The draft's `fig.lean: 6*sin(f*0.6)` reaches ≈ 90° from vertical ("windmill uncle"); clamp it in degrees.
- K stands knee-deep: the waterline hides his legs below the knee (Boss N16-11 R2).
- proj (*tile*, v5): K lead ≈ 520 px, face y ≈ 960–1080; PT at the grab x ≈ 0–640, y ≈ 0–860 (cropped top-left by design).
- Stretch variant (Q1, 150 f, +69):
  - +0–+20: net up; PT circles high (small, top); shadow at +18.
  - +20–+44: dive. +44: grab.
  - +44–+80: climbs past the lens. +80–+100: lands on the snag. +120: gulp.
  - V09 moves to +52–+104.
- Sound: S16-18..S16-20 as before; add S16-34 gulp at +66.
- Owner: Boss (N16-07 R2 motion set, N16-11 R2); Editor (villager lean, K eyes, timing).

**20R. S01-B06-SH20** [1569, 1625), 56 f. *Change: the hen has two legs in every frame.*
- The draft shows a third leg in the front view (a step-cycle state drawn twice, or the hallux drawn as a leg).
- AS-HEN fix (N16-03 R2): exactly two legs in every view; the step cycle alternates them. The three-toed foot plant at +32 is read from a 3/4 view (≥ 60 px, acceptance kept).
- Owner: Boss; Editor re-renders.

**22R. S01-B06-SH22** [1680, 1839), 159 f. *Change: re-animated; proposed cloud T. rex gag after the cluck.*
- Camera: unchanged for +0–+100.
- K: kneels nose to beak with hen H1 (3.25, 0, −8.5).
- Y: stands behind right, **whole figure in frame** (was cropped), holding the apron of eggs. Laughs on the cluck: `laugh` face plus a shoulder bounce, lean ≤ 4°, two bounces at 2 Hz, +84–+110.
- Fix the draft's bug: Y's head drew detached at ground level and the egg bundle floated. Boss N16-21 checks the `laugh` pose head anchor and the apron prop in this view.
- Only H1 in full plus at most one hen behind; no hen slides in at the frame edge.
- V10 +8–+66 and V06 +81–+99 unchanged.
- In-time end: hold +100–+159 on K, hen and eggs; E-TAG at +100.
- **Cloud T. rex gag (coordinator request 14 Nov; Film verdict: fit with change; Q6).** Placed after V06, the last voice line, so no voice onset moves. It needs **+45 f**: SH22 becomes [1680, 1884), 204 f, and the episode 1884 f (62.8 s; ≈ 67 s with Q1).
  - +99–+104: H1 lifts its head to the sky.
  - +100–+114: camera tilts up, pitch 0° → +60° (ease in-out; the camera stays at its +100 position). K and Y look up with it.
  - +114–+128: the T. rex forms. Cumulus puffs over the conifer tips gather into an original T. rex in front-3/4 (look frame LF-SH22SKY): big skull, jaws open to screen-left, short two-finger arms, heavy legs sunk in a cloud bank, tail curling up. Anatomy is drawn from the user's T. rex refs (UT10); the cloud is a volume with a lit top, mid tone and blue-grey underside (UT16).
  - +126–+156: roar. The jaws open wider, wind streaks blow from the mouth, the puffs shudder.
  - +156–+166: it dissolves back into plain clouds.
  - +160–+174: camera tilts back down to pitch 0°. H1 pecks the ground as if nothing happened; Y laughs again.
  - +174: E-TAG, ringing out to +204.
  - No on-screen text. No film frame, composition, palette (midday sky, not a storm sunset), music or audio is used or imitated, and the film's line does not appear unless the user confirms (Q6).
  - In-time fallback (no stretch): gag +100–+152 with a 0.8 s roar; E-TAG starts at +146 and is cut at +159 (13 f). Film does not recommend it.
  - Tone: comic, like the shot-16 gag. It adds no claim (birds are theropod dinosaurs, R2-F06 `solid`, already said in L10/L11). It is a sky image, not a predator in the village, so the "real predators only in firelight" rule holds. *(R1.5a note: that rule is a Film staging rule for EP17, not a fact, and is not to be quoted as science; RV-24/RV-24a.)* A real T. rex stays out of EP16 (Q5).
  - Boat staging check: the hen-to-T. rex visual link (both theropods) is fine as a picture.
- proj (*tile*, LF-SH22SKY): T. rex x ≈ 0–1060, y ≈ 400–1380; jaws ≈ y 420–720.
- Sound: S16-35 wind swell at +100–+114; S16-36 roar at +126–+156; E-TAG at +174.
- Owner: Boss (N16-21, N16-22); Editor (re-animation, tilt, gag timing); Ton (S16-35, S16-36).

### R1.3 Boss list (added to the table below)

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N16-06 R2 | Volume long-neck, replacing the flat `paintLongNeck` card. Start from `r13-looks/beasts.ts buildLongNeck`; differences from AS-LONGNECK listed below. Motions: head target along the neck bezier, jaw chew, walk cycle, idle sway, mouth-held prop anchor, flat-dark silhouette mode (SH12 night). | creature (look-defining) | 2, 8, 10, 12 (21 if Q3) | prototype; user approval Q2 |
| N16-07 R2 | Pterosaur motion set: circle, dive, grab, climb past the lens, land on a snag (fold), gulp; feet anchor carries the fish | creature motions | 16, 2 | painter exists (`src/painted/survival/pterosaur.ts`); motions missing |
| N16-14 | `new: triceratops` (frill, brow and nose horns, beak); walk, head lift, snort puff; mud splash layer | creature (look-defining) | 11 (15 if Q3) | prototype `buildTriceratops`; Q2 |
| N16-15 | `new: ankylosaur` (plates, side spikes, tail club); walk, browse | creature | 5 | prototype `buildAnkylosaur`; Q2 |
| N16-16 | `new: giant dragonfly` (4 veined translucent wings); hover, dart, two-state wing blur | creature | 3 | prototype `buildDragonfly`; Q2 |
| N16-17 | `new: cycad seed cone`: one rigid prop with grip and mouth anchors | prop | 6, 9, 10 | missing |
| N16-18 | `new: point-up` pose, or an `aim: V3` target on the pointing arm | pose / capability | 8 | missing |
| N16-19 | Creature depth sort: separate body and neck/head items in `paintSorted` | capability | 2, 5, 8, 10, 11 | missing (look frames use a `sortAt` workaround) |
| N16-04 R2 | Granary exterior (posts, zinc roof, double doors, ladder) and interior paddy heap with spill | set | 13 (14 continuity) | missing |
| N16-03 R2 | AS-HEN: two legs in every view and step state | animal fix | 20 (all hen shots) | open (fixlist) |
| N16-09 R2 | Painted fruit/flower tiles and loose painted blossoms | card art | 4, 5 | open (fixlist) |
| N16-11 R2 | River waterline: legs below the knee hidden in water | set | 16 | missing |
| N16-20 | ENV-SKY day/night cycle (continuous ramp, sun/moon arc, stars, night floor 0.35) and paddy growth stages promoted from Editor's local asset | ENV layer | 12 | missing / exists-unintegrated (paddy stages, episode code) |
| N16-21 | `laugh` pose: head detaches to ground level; apron egg bundle floats (SH22 draft) | contact bug | 22 | open |
| N16-22 | Cloud T. rex: cumulus-puff volume creature with form, roar (jaw, wind streaks) and dissolve; start from `looks.tsx paintSh22Sky` | ENV/creature (look-defining) | 22 | prototype; Q6 |

**AS-LONGNECK vs the user's references** (brachiosaur, herd-in-forest), for N16-06 R2:
- The current card is a flat cut-out (fails UT16) with a horse-like box head and an olive palette, and has no body.
- The references show blue-grey skin (`#7d8a90` skin, `#56636a` back, `#bab8a8` belly in the prototype) with wrinkle folds at the neck base.
- Small head with a nasal arch; eyes with catch-lights; nostrils high on the snout.
- Neck near-vertical when browsing high.
- Deep chest; the back slopes down to the hips and a shorter tail.
- Long column front legs taller than the hind legs; pad feet with three dark toe nubs.

### R1.3 Editor notes (per shot)

- SH02: K stays visible past the cart at +60–+125; place LN-A, LN-B, LN-C and the two pterosaurs.
- SH03: basket from the hand anchor each frame (no own keys); DF path and K's gaze.
- SH05: hy 880; flower fades at +34/+40/+46/+52; AN walk and munch.
- SH06: cone parented to the hand from +14; slap at +45; one arc and bounce, no scatter.
- SH07: new camera and marks; blended pose changes; K and Y heads both visible every frame.
- SH08: point-up timing (+7–+15 raise, +79–+110 lower); head reaches C2 at +40.
- SH09: cone in `lHand` from +8; stir cycle.
- SH10: continuous push; cone handover, toss arc, jaw grab at +38, cone above y 1160.
- SH11: TR walk with splashes; hoe thunk at +46; K head turn at +50–+56.
- SH12: sky ramp as a continuous function of frame; no global brightness pulses.
- SH13: new camera; door swing; K's marks.
- SH16: villager lean clamp ≤ 8°; K eyes open +14–+60; the grab at f1308 with feet on the fish (no fish "already in the mouth").
- SH22: Y whole figure; laugh lean ≤ 4°; no stray hen at the edge; gag timing if Q6 passes.

### R1.3 Ton cues (added to the table below)

| Code | Sound (source, action, material, space, length, feel) | Shots (shot-local frame) | Library candidate |
| --- | --- | --- | --- |
| S16-27 | Long-neck presence: a very deep, slow breath-rumble through huge nostrils with a low chest resonance (no call, VD-S07 "size, never roars or calls"), 30 m away at the forest edge, outdoor air, 1.5 s; awe, gentle giant | sh2 +60 | NEEDS-GEN |
| S16-28 | Giant dragonfly: stiff papery wings in a dry, fast rattle-buzz; a close pass in from the right, a hover wobble, then a dart away left, 1.2 s; tickly wonder | sh3 +14–+52 | NEEDS-GEN |
| S16-29 | Seed-cone crunch: a hard cluster of seeds cracked in big blunt jaws, wet and woody, close, 0.4 s; satisfying, comic | sh10 +48 | NEEDS-GEN |
| S16-30 | Ankylosaur: heavy padded steps on soft forest floor (low thumps with a leaf crunch, 4 steps), then a crisp fern munch, 2 s; calm, armoured bulk | sh5 +0–+32 | NEEDS-GEN |
| S16-31 | Triceratops: deep mud sucks and splashes per foot plant (3), then one big nasal snort with a wet flutter, open paddy air, 2 s total; big, curious, not scary | sh11 +6, +21, +36, snort +50 | NEEDS-GEN |
| S16-32 | Day/night cycle: night crickets and morning birds/rooster alternating in quick soft crossfades on each cycle, a light wind rising at the end over gold rice, 3.4 s; time racing by | sh12 +0–+102 | NEEDS-GEN (A-VN candidate for the night bed) |
| S16-33 | Grain trickle: unhusked rice sliding over a wooden sill, dry and rustly, close, 0.6 s; plenty | sh13 +10 | NEEDS-GEN |
| S16-34 | Pterosaur gulp: a throaty swallow with a small beak clack, distant on a snag, 0.4 s; cheeky | sh16 +66 | NEEDS-GEN |
| S16-35 | Sky wind swell: soft rising air with a faint high shimmer as the camera tilts up, 0.5 s; something is coming | sh22 +100–+114 (Q6) | NEEDS-GEN |
| S16-36 | Cloud T. rex roar: a huge, original roar (low growl rising to an open bellow) blended with a rolling thunder tail and a wind gust, high in the sky, wide and reverberant, 1.0 s plus 0.5 s thunder tail; playful awe, not horror. Must not copy any film roar, music or sting. | sh22 +126–+156 (Q6) | NEEDS-GEN |

## R1.4 revision: user answers, stretch, no triceratops, T. rex apparition

**Owner Film, 14 Nov 2026.** Source: the user's answers to rows R1.3 Q1–Q6, relayed by the coordinator:
- **Q1 yes:** stretch SH10 +20, SH11 +36 and SH16 +69 f as proposed; voice content unchanged, later lines shift.
- **Q2:** "triceratops, the scene in the paddy does not need it, save it to appear in another episode; its head is currently detached from the body, fix it now or leave it, either is fine." The triceratops leaves EP16 entirely.
- **Q3 yes:** add dinosaurs to SH15 and SH21.
- **Q6 yes:** +1.5 s for the sky T. rex gag at SH22. The user wants the film's line "Remember who you are" on screen (iconic). The T. rex is drawn normally from the user's refs with volume (UT16), not built from cloud shapes. It shows at reduced opacity as an apparition, face and upper half emerging from the clouds.
- **Q4** (feathered small dinosaur, SH19): not answered, still open.
- **Q5:** dropped (not for this episode).

The user did not object to the long-neck, ankylosaur and dragonfly looks. Film treats them as accepted, but the user gave no explicit verdict on them. Boat's R1.3 visual check (research-r2.md "R1.3 visual check (Boat, 2026-11-14)": SH10 ok, SH22 ok) adds guards **RV-10a**, **RV-10b** and **RV-22a**, applied below.

This section supersedes R1.3 and older staging for shots 10, 11, 15, 16, 21 and 22 and owns the global timing (shot map and voice table above: **2009 f**). Shot-local frames of every other shot are unchanged.

**Triceratops note (for a later episode; nothing deleted):** these are kept as a note for a later episode:
- prototype `buildTriceratops` in `scripts/edu-series/ep16/r13-looks/beasts.ts`;
- the R1.3 frame `out/ep16/r13/looks/v5/LF-SH11.png` (still renderable as `R13-LF-SH11-TRI-R13`);
- the user ref `~/ReelsStore/projects/edu/EDU/references/user/2026-11-14_triceratops-ref.jpg`;
- Boss row N16-14 (now *deferred*).

The user saw the head drawn detached from the body. Fix it when the triceratops is next used: the frill/skull pivot `piv` sits at the end of the body spline with no neck loft between them. Not fixed in R1.4 (the user allowed either).

**Look frames R1.4** (viewed; `scripts/stills.mjs`, one Chrome): `out/ep16/r14/looks/v4/`:
- LF-SH11 (ankylosaur in the paddy, +40);
- LF-SH15 (far long-neck, +4);
- LF-SH21 (long-neck at the forest edge, end +54);
- LF-SH22SKY-R14 (T. rex apparition with the line, +138).

The sheet is `out/ep16/r14/looks/v4-sheet.png`. Code is in `scripts/edu-series/ep16/r13-looks/looks.tsx` (`paintSh11b`, `paintSh15`, `paintSh21`, `Sh22Sky`) and `beasts.ts` (`buildTRex`, ankylosaur foot anchors). Proj numbers marked *probe* come from `npx tsx` on the same builds and cameras (Film scratch `p14.mts`, `trex-probe.mts`); *tile* means read off the v4 sheet (±15 px).

**10R4. S01-B03-SH10** [843, 929), 86 f (+20). *Changed since R1.3: Q1 stretch kept on the animal.*
- +0–+66: as 10R.
- +66–+86: the CU holds on the long-neck's head: a second crunch at +70, then a plain head lift to 1.4 m with the cone still showing in the jaws over +76–+86. The camera stays on the animal and does not cut back to Keng (RV-10b).
- RV-10a: a plain chew and head lift only. No healthy-glow or thumbs-up reading, no sick or collapse gag.
- Sound: S16-29 crunch at +48 and a second time at +70 (S16-29b, same file or a variant); S16-08b chew to +86 (f929).
- Owner: Boss (N16-06 R2 mouth anchor); Editor.

**11R4. S01-B04-SH11** [929, 1024), 95 f (+36). *Changed since R1.3: the ankylosaur replaces the triceratops as the shot's hero; Q1 stretch adapted to it.*
- Camera: as 11R (`CAM11`: `at (15.6, 1.0, −1.0), yaw −125→−115, r 2.6→2.3 m, eye 0.95, f 950, hy 960, pitch 4°, cx −190`, ease over +0–+58), then a hold +58–+95.
- Ankylosaur AN (`new: ankylosaur`, N16-15 R2; read as the same animal as SH05, now in the flooded paddy):
  - Walks from VIL (21.4, 0, 5.8) at +0 to (20.3, 0, 4.6) by +40: heading = toward K − 0.55 rad, walk 1.0 Hz, stride 1.1 m, tail sway ±0.3 m.
  - Mud splash on each front-foot plant at +6, +21 and +36: brown ring wash plus droplets thrown up and out, 0.3 s, drawn under the body.
  - Stops; head up +46–+52; one short nasal huff at +50 (small vapour puff).
- K: as 11R. Walks in +0–+10 to P1 (15.6, 0, −1.0), hoe on shoulder, then P09. V05 +7–+44 (f936–973). Hoe into the mud +40–+46, thunk at +46. Freezes at +50 and turns his head to AN +50–+56, `surprised`.
- Stretch +59–+95 (Q1; was the triceratops foot-plant gag, adapted):
  - +59–+68: AN takes one step closer to (19.4, 0, 3.6), splash at +62.
  - +66–+72: it shakes its head; muddy water sprays off its snout and brow plates.
  - +72: four to six brown drops land on K's cheek and shirt.
  - +72–+75: K blinks.
  - +75–+95: K looks at AN, `surprised` → `sad`, and wipes his cheek with the back of his hand (+82–+90).
  - Comic, no claim.
- proj (*probe*, AN): +0 x 354–742, y 882–1132; +40 x 462–873, y 873–1142, snout (848, 1033); +58 x 495–917, y 870–1146. All above y 1160. K lead ≈ 550 px (*tile*). The splash ring sits around y 1100–1140 (*tile*): Editor keeps it above 1160.
- Sound: S16-31 R2 (ankylosaur in water) at +6, +21, +36, huff +50, step +62, head-shake +66–+72, drops +72; S16-12 hoe thunk at +46 (f975).
- Owner: Boss (N16-15 R2 walk-in-water, head-shake, mud splash and spray layer, foot anchors); Editor.

**15R4. S01-B04-SH15** [1283, 1350), 67 f. *Changed since R1.3: a far long-neck browses beyond the empty paddy (Q3).*
- Camera: unchanged from the R1.1 sheet: `at (16, 1.2, −0.4) → (15.3, 1.0, −0.4), yaw −80→−70, r 5.5→1 m, eye 2.2→1.4, f 850, hy 900, pitch −4→−22°`, ease over +10–+36 (look `CAM15`, ease [0.15, 0.55]). It arrives on the bowl at +36 = f1319 ("กินข้าวกับอะไร").
- Long-neck LN-F (N16-06 R2): body at VIL (42, 0, −9), beyond the paddy's east edge (paddy x 12..30), heading toward (40, −2).
  - Head up in a conifer crown at (41.5, 12.5, −4.2), stripping needles: jaw chew 0↔0.35 at 0.8 Hz, head bob ±0.1 m, tail sway ±4°.
  - Haze 0.3. Sort point at its body.
  - No step, no call. It is part of the land, not an event.
- Villagers, Y and K stand at the paddy edge in back view, as R1.1 (8–12 villagers; the look frame shows 5 plus Y and K).
- Nobody points at or looks toward the long-neck: they look at the mud. This keeps L08 ("แล้วสี่ห้าเดือนนี้… กินข้าวกับอะไร") from reading as "eat that". The picture contrast is that the giant has food all around it while the village has one scoop of rice. The shot adds no claim.
- proj (*probe*, LN-F): +0/+4 x 168–598, y 522–901, snout (559, 553); +15 x 179–612, y 484–874; +25 x 234–707, y 249–727; +36 x 276–817, y 5–607 (snout (760, 68)).
  - It stays in frame through the crane and sits above the bowl (bowl ≈ y 860–906 at +36, R1.1 probe).
  - The bowl stays the subject by size and focus. Editor softens LN-F (haze or blur) from +30 if it competes.
- Sound: unchanged (M16 one held note, A-VM quiet field, a villager's sigh at +20). No creature sound: a far, silent giant suits the quiet question.
- Owner: Boss (N16-06 R2 browse-high pose, flat haze); Editor.

**16R4. S01-B05-SH16** [1350, 1500), 150 f (+69). *Changed since R1.3: the Q1 stretch variant of 16R becomes the shot.*
- Camera: as 16R (`CAM16R`), the move spread over 150 f (ease 0..1).
- Timeline:
  - +0–+20: K hauls the net up, fish flapping; the pterosaur circles high and small (top of frame, span 3 m at ≈ 25 m). Its shadow crosses the water at +18.
  - +20–+44: dive from top right.
  - **+44 (f1394): grab**, feet closing on the fish at the net rim (grab 0→1 over +42–+44).
  - +44–+80: climbs past the lens to the left at full span, two flaps, fish in its feet.
  - +80–+100: glides to the far snag (−6.0, 4.5, −14.0) and lands at +100 (fold 0→0.8).
  - +112–+124: head toss and gulp (fish gone at +120).
  - +124–+150: hold; it settles and preens once.
- V09 voice +52–+104 (f1402–1454; file start f1397).
- K: eyes open +44–+100, no blink at the grab. Shakes the empty net +56–+80, `surprised` → `angry`.
- Villagers: laugh +80–+140, lean ≤ 8°, 1.5 Hz shoulder bounce (the windmill fix from 16R holds).
- On screen +0–+150 (the circle reads from +0; the identifiable body from +20).
- Sound:
  - S16-18 net splash at +2 (f1352).
  - S16-19 wing rush: a soft far wing pass for the circle +0–+18, then the big close→far rush +20–+50 (f1370). Ton re-times.
  - S16-20 villagers' laugh at +80 (f1430).
  - S16-34 gulp at +120 (f1470).
  - M16 comic pizz button at +124 (f1474).
  - A16-RV under the whole shot.
- Owner: Boss (N16-07 R2 incl. circle and preen); Editor.

**21R4. S01-B06-SH21** [1750, 1805), 55 f. *Changed since R1.3: a long-neck steps out at the forest edge (Q3); camera swung west of the coop.*
- Camera: `cam: at (3, 1.2, −8), yaw −10→−24, r 3→7.5 m, eye 1.2→2.4, f 850, hy 920, pitch 0→−5°`, ease over +0–+49 (VIL; look `CAM21`).
  - The R1.1 yaw 10→22 put the coop (x 3..5, z −6..−4.6) between the lens and the family at the end of the pull (the draft frame and the R1.4 v1 look frame both lose K, Y and the hens).
  - At yaw −24 the line of sight passes west of the coop.
  - The pull back, its length and the eased settle are unchanged.
- K (2.6, 0, −8.6) and Y (3.6, 0, −8.2) with the eggs and three hens as R1.1, turned 3/4 to the new lens (K facing (−0.3, 0.95), Y facing (−0.4, 0.92)).
- Long-neck LN-G (N16-06 R2) at VIL (15, 0, −27), heading toward (2, −24), between the forest-edge conifers beyond the fence:
  - Head lifts from browse (local (7.4, 9.0, 1.5)) to up (7.4, 13.2, 1.5) over +20–+40, above the tree ferns, as the camera pulls back.
  - Idle neck sway ±2° after. Haze 0.15. Sort point (10, 0, −22).
- proj (*probe*, LN-G): +0 x 634–1172, head up (640, 398) / browse (640, 580); +30 x 518–952; +54 x 470–869, y 417–921, head (475, 446).
- Family at +54 (*tile*): K ≈ y 960–1090, Y ≈ y 945–1115, hens ≈ y 1090–1110 (W, reference only). The draft and R1.3 SH21 were passed by the user. The camera change is Film's, made to keep the family visible with the added long-neck; the user sees it on the review page.
- L11 ("ออกไข่อยู่ในเล้าบ้านคุณนี่เอง") is not contradicted: the payoff dinosaurs (the hens and eggs) stay in the foreground at the centre of frame. The long-neck is the big, far dinosaur world beyond the fence, the contrast the line turns on.
- Sound: S16-27 (long-neck breath-rumble, the SH02 file) once at +40 (f1790), −12 dB under L11; M16 resolves; hens cluck light.
- Owner: Boss (N16-06 R2); Editor (new camera, marks).

**22R4. S01-B06-SH22** [1805, 2009), 204 f (+45). *Changed since R1.3: the T. rex is a normally drawn volume animal shown as a faded apparition (not cloud shapes); the line "Remember who you are" appears as stroke caption text.*
- +0–+99: as 22R. K kneels nose to beak with H1. Y stands behind right, whole figure, laughing on the cluck. V10 +8–+66 (f1813–1871); V06 +81–+99 (f1886–1904). Y's head and the egg bundle stay attached (N16-21).
- +99–+104: H1 lifts its head to the sky.
- +100–+114: the camera tilts up, pitch 0° → +60° (ease in-out), staying at its +100 position. K and Y look up with it.
- **T. rex apparition TX** (`new: T. rex` volume, N16-22 R2; anatomy from `references/user/2026-11-14_trex-front34-ref.webp` and `_trex-side-ref.png`, UT10/UT16):
  - Drawn as a normal animal: big deep skull, open jaws with teeth and a pink mouth, yellow eye under a brow ridge, thick S neck, deep chest, short two-clawed arms.
  - Front-3/4, facing screen-left, nose up 0.32 rad.
  - Painted on its own layer at **opacity 0.5** (max 0.55), so the far clouds and sky show through it.
  - Its face and upper half rise out of a near cloud bank that hides the hips and legs (the bank sits in front of the TX layer, opaque). It sits above the conifer tips, high in the sky.
  - Keyframes:
    - +108–+126: rises 0.6 m-equivalent out of the bank, opacity 0→0.5.
    - +122–+150: roar: jaw 0.4→0.9, head pushes forward 4 %, wind streaks blow from the mouth to screen-left, and the bank puffs shudder ±6 px.
    - +150–+166: sinks back, opacity 0.5→0.
  - RV-22a: TX is a separate apparition over the conifers. The hen never morphs into it, and TX does not mirror the hen's pose (the hen looks up with its head tilted; TX roars to screen-left).
  - It is not made of clouds and has no film likeness: original pose, midday sky palette, no film frame, composition, lettering, music or audio.
- **Line "Remember who you are"** (user request; English, verbatim as the user named it):
  - Screen-space text, +132–+170 (f1937–1975): fade in 4 f, hold, fade out 4 f.
  - Edu caption stroke style: the runtime caption look (`CAPTION_OUTLINE`: Noto Sans Thai 700, 51 px, white fill, 14 px `#2b1a12` stroke with the outline shadow). Centred, bottom edge y 1344, in the caption band (no subtitle plays there: V10 ended at +66 and V06 has none).
  - Not a subtitle of any voice: no voice says it. It is not the film's typeface, colour, placement or animation.
- +164–+178: the camera tilts back down to pitch 0°.
- +176: H1 pecks the ground as if nothing happened.
- +178–+194: Y laughs again (two bounces, lean ≤ 4°).
- +166: E-TAG starts, 38 f to the end (f2009); Editor fades its tail from +190 if the file rings longer.
- proj:
  - TX (*tile*, LF-SH22SKY-R14 full frame): x ≈ 250–1080 (tail cropped right), y ≈ 330–1180 visible above the bank; snout ≈ (300, 470); jaws ≈ y 450–680; bank top ≈ y 1150–1290.
  - Text (*tile*): ≈ x 175–905, y 1275–1340.
  - Mark area (x < 330, y < 140) clear.
- What the text claims (Boat recheck needed, see below): nothing about hens or birds. It is a movie-quote gag, with no species, ancestry, number or fact. The joke ("the hen should remember it is a dinosaur") leans on L10/L11 (R2-F06 `solid`: birds are dinosaurs).
  - Reading risk: a viewer could take it as "hens descend from T. rex". Both are theropods (cousins, not ancestor and descendant).
  - Guards: RV-22a (no morph, no mirrored pose), the text names no species, and the narration never says T. rex.
- Owners: Boss (N16-22 R2 T. rex volume painter with layer opacity, N16-21, N16-23 caption text line); Editor (re-animation, tilt, gag timing, text timing); Ton (S16-35, S16-36 R2); Boat (recheck of the text and the apparition).
- Sound: S16-35 wind swell +100–+114 (f1905–1919); S16-36 R2 roar +122–+150 (f1927–1955) with ≤ 0.5 s tail; E-TAG +166 (f1971). Silence (A-VM only) under the text after the roar tail.

**Boat recheck (SH22, R1.4):** Boat judged the R1.3 staging (a cloud T. rex, no text). R1.4 changes two things:
- (a) a normally drawn T. rex at reduced opacity;
- (b) the on-screen English line.

Both need Boat's recheck before Editor integrates SH22. Boat's R1.3 verdicts on SH10 (ok) stand with RV-10a/b applied.

### R1.4 Boss list (changes to the R1.3 table)

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N16-14 | ~~triceratops~~ **deferred to a later episode** (user Q2). Keep `buildTriceratops` and the ref; fix the detached head (no neck loft between body and skull pivot) when next used | creature | — (was 11, 15) | deferred |
| N16-15 R2 | Ankylosaur: walk on land (5) **and in shallow paddy water (11)**, browse, head lift, nasal huff, head-shake with spray; foot anchors for splash; mud splash + spray layer (moved here from N16-14) | creature (look-defining) | 5, 11 | prototype `buildAnkylosaur` (+ foot anchors R1.4); accepted by silence, no explicit verdict |
| N16-06 R2 | Volume long-neck (as R1.3) **plus** high-browse pose in a conifer crown (15) and browse→up head lift (21) | creature (look-defining) | 2, 8, 10, 12, **15, 21** | prototype; accepted by silence |
| N16-22 R2 | **T. rex apparition**: a normally drawn volume T. rex (`buildTRex` prototype in `r13-looks/beasts.ts`: skull, jaw 0..1, teeth, mouth, eye, neck raise, arms, legs) painted on **its own layer with opacity 0.5**, a near cloud bank layer in front that hides the hips and legs, rise/roar/sink keys and roar wind streaks. Replaces the R1.3 cumulus-puff creature | creature/ENV layer (look-defining) | 22 | prototype; two BrushCanvas layers did not composite in Film's still (v1 black, v2 lost), so the still fakes 50 % with sky-coloured haze: Boss builds true layer opacity (capability gap) |
| N16-23 | **Caption text line**: one screen-space text item "Remember who you are" in the edu caption stroke (`CAPTION_OUTLINE`, bottom edge y 1344) with a 4 f fade in/out, on the composition's text layer, not the subtitle track (no voice) | screen text / capability check | 22 | unknown: Editor checks whether the runtime has a non-subtitle text item in the caption look; else Boss adds it |
| N16-07 R2 | Pterosaur motion set (as R1.3) **plus** a high circle and a preen on the snag | creature motions | 16, 2 | painter exists; motions missing |

### R1.4 Editor notes (per shot)

- **Global:** durationFrames **2009**. Rebuild `clock.ts` from the R1.4 shot map. Re-place narration and takes per the R1.4 voice table (`narration-place.py`: `TOTAL = 2009`; L07+ `start_s` shifted; V05 f929, V08 f1126, V09 file f1397, V10 f1805). Caption cues follow their voice ranges. Ton's V06 moves to f1886.
- SH10: CU hold to +86, second crunch +70, head lift +76–+86; never cut back to K inside the shot (RV-10b).
- SH11: AN walk, splashes +6/+21/+36, huff +50; stretch step +62, head-shake +66–+72, drops on K +72, K blink/look/wipe; hoe thunk +46.
- SH15: LN-F browsing far; soften it from +30 if it competes with the bowl; nobody looks at it.
- SH16: the 150 f timeline (grab f1394, V09 f1402–1454, gulp +120, pizz +124); villager lean clamp.
- SH21: new camera yaw −10→−24; K, Y, hens visible at the end; LN-G head lift +20–+40.
- SH22: gag keys +99–+204; TX opacity ramp; the text +132–+170 in the caption stroke; E-TAG +166; hold Y attached.

### R1.4 Ton re-time list

Sound cues are in `sound-cues.json` (Ton R1 on SS-R1.1). Global frames move with the stretch: +20 from SH11, +56 from SH12, SH16 restaged, +125 from SH17. **Re-time (content or length)** applies to the rows marked re-time; **shift only** means a frame offset, which Editor can apply. R1.3 cues S16-27..S16-36 are not yet in `sound-cues.json`. Their R1.4 frames:
- S16-27: f152, plus a reuse in SH21 at f1790.
- S16-28: f231–269.
- S16-29: f891, plus S16-29b at f913.
- S16-30: f377–409.
- S16-31 R2: f935 / 950 / 965 / 979 / 991 / 995–1001 / 1001.
- S16-32: f1024–1126.
- S16-33: f1136.
- S16-34: f1470.
- S16-35: f1905–1919.
- S16-36 R2: f1927–1955.

The changed cue table follows:

| Cue | Shot | R1.3 frame (until) | R1.4 frame (until) | Action |
| --- | --- | --- | --- | --- |
| M16-bed | SH02 | 92 (1680) | 92 (1805) | re-time: one file from f92 now runs to f1805 (was f1680, +125 f = +4.2 s); music-map automation shifts (bass-only f377-443 and stop f487/back f517 unchanged; soft f1375->f1500; hard stop f1680->f1805) |
| A16-FE | SH03 | 217 (909) | 217 (929) | until f909->f929 (SH10 stretch) |
| S16-08b | SH10 | 888 (909) | 888 (929) | until f909->f929 (chew through the stretched CU) |
| A16-VM-b | SH11 | 909 (1294) | 929 (1350) | until f1294->f1350 |
| S16-12 | SH11 | 949 | 975 | re-time to the 11R/11R4 thunk at +46 (the cue sheet had +40) |
| S16-13 | SH12 | 996 | 1052 | shift only |
| S16-14 | SH13 | 1070 | 1126 | shift only |
| M16-tada | SH13 | 1100 | 1156 | shift only |
| S16-15a | SH14 | 1156 | 1212 | shift only |
| S16-16 | SH14 | 1196 | 1252 | shift only |
| S16-17 | SH14 | 1206 | 1262 | shift only |
| S16-18 | SH16 | 1296 | 1352 | net splash +2, unchanged in-shot |
| S16-19 | SH16 | 1302 | 1370 | re-time: dive is now +20..+50 (was +8..+26); add a soft far wing pass for the high circle +0..+18 (Ton) |
| A16-RV | SH16 | 1294 (1375) | 1350 (1500) | loop now f1350-1500 (150 f) |
| M16-pizz | SH16 | 1364 | 1474 | re-time: after the gulp (+124), was after V09 |
| A16-FI | SH17 | 1375 (1504) | 1500 (1629) | shift only |
| S16-21 | SH17 | 1375 (1504) | 1500 (1629) | shift only |
| S16-22 | SH17 | 1447 | 1572 | shift only |
| M16-restate | SH18 | 1504 | 1629 | shift only |
| A16-VM-c | SH18 | 1504 (1839) | 1629 (2009) | until f1839->f2009 |
| S16-23 | SH18 | 1504 (1625) | 1629 (1750) | until f1625->f1750, then -6 dB to f1805 (was f1680) |
| S16-24 | SH18 | 1512 | 1637 | shift only |
| S16-25 | SH20 | 1569 | 1694 | shift only |
| M16-low | SH20 | 1569 | 1694 | shift only |
| S16-26 | SH20 | 1601 | 1726 | shift only |
| V06-cluck | SH22 | 1761 | 1886 | shift only |
| E-TAG | SH22 | 1780 | 1971 | re-time: now SH22 +166 = f1971; 38 f (1.27 s) to the end, so the 3.5 s file is cut: fade from f1995 or a shorter tag (Ton/Editor) |

**Redefined cues (R1.4):**
- **S16-31 R2** — *ankylosaur in the flooded paddy* (replaces the triceratops cue). Heavy padded feet slapping into shallow paddy water with a mud suck, three steps (+6, +21, +36), close-mid, open air. Then one short low nasal huff (+50). Stretch: a fourth step splash (+62); a dry rattle of bony plates under a wet head-shake spray (+66–+72); a few small mud drops pattering on cloth (+72). About 3 s in all. Feel: heavy, armoured, comic, not scary. NEEDS-GEN.
- **S16-36 R2** — *T. rex apparition roar*. A huge original roar: a low chest growl rising to an open bellow, high in the sky, wide and reverberant with a soft airy shimmer (it is a ghostly image). 1.0 s plus a ≤ 0.5 s tail; no thunder needed. Feel: playful awe, not horror. It must not copy or imitate any film roar, music or sting. NEEDS-GEN.
- **S16-29b** — the S16-29 crunch again at SH10 +70 (same file or a variant).
- S16-27 reuse at SH21 +40, −12 dB.

## R1.5 revision: river suspense, new SH22 ending, no sky gag

**Owner Film, 14 Nov 2026.** Source: the user's direction relayed by the coordinator (14 Nov 2026):
- (1) Drop the "Remember who you are" meme entirely: the SH22 sky gag, the on-screen line and the T. rex apparition in the clouds. SH22 needs a new ending that still lands "the hen is a dinosaur" as a joke.
- (2) Add a slight horror tone ("แอบ horror นิดนึง") somewhere in the 60–70 s clip: meeting a meat-eating dinosaur, hiding, or a scene that makes the viewer lean in.

Constraints kept: script R2.2 words and the voice lock unchanged; edu channel, family-safe (tension, not violence; no one hurt, no attack, no gore); reuse the approved kit creatures; total within about 60–70 s.

This section supersedes all earlier staging for shots 15, 16 and 22 (15R4, 16R4, 22R4 and older), adds shots 16A–16D, and owns the global timing (shot map and R1.5 voice table above). Shot-local frames of every other shot are unchanged; shots 17–21 shift +124 f globally.

### R1.5 decisions

- **D15-01 Where the scare goes (Film's recommendation; user fork R15-Q1):** the river, inside the wordless W-RIVER window between L08 (ends f1344) and L09. It is the only stretch of the episode with no narration, so no locked line has to share the screen with the scare. The scare then becomes the setup for the comic pterosaur snatch, and the fish theft lands harder after the fear. *Alternatives:* (a) SH11 paddy (V05 on air, and the ankylosaur splash gag is already there; the scare would fight the comedy); (b) the forest edge in shots 3–5 (L03/L04 explain flowers; a predator would pull attention off the lesson); (c) night eyes in the SH12 time-lapse (cheap but too small to be felt).
- **D15-02 Near-miss, no chase (Film's recommendation; user fork R15-Q2):** the predator stays on the far bank, sniffs, loses interest and walks away. Nobody runs, nobody is chased, nothing is attacked. This is family-safe and fits 5 s. A chase would need run cycles for 4–6 figures in water, a predator crossing the river, and more time than the 70 s ceiling allows.
- **D15-03 Keep EP17's climax its own (user fork R15-Q3):** EP17's ending is a predator at night stepping around the fire while the family freezes and ยาย covers เก่ง's mouth (EP17 script W-PRED, VD17-04). EP16 is made different on four counts:
  - daylight, in shade;
  - a different animal (T. rex; EP17 uses the spinosaurus-like animal);
  - the far bank, across 8 m of water;
  - released by a joke, not held.
  - The **hand-over-mouth gesture is reserved for EP17**: in EP16, Keng holds his own breath (`clench` mouth).
  - The user may still prefer a non-predator scare to protect EP17's reveal (question R15-Q3).
- **D15-04 Predator rule amended for EP16 (VD16-11 in the brief):** the R1.3 design rule (a Film staging choice, not a fact; Boat RV-24) "predators firelight-only and partial" becomes, for EP16 only, **one daylight predator beat**: "partial, in deep shade at the forest wall". Nothing in EP16 may say or imply that predators are active only at night or only near fires (RV-24a). The legs stay in the ferns. The animal is never in the sun's full light, never on the near side of the river, and never in the village. It does not roar.
- **D15-05 New SH22 ending: "the dinosaur camera" (VD16-12 in the brief):** after the cluck, the film treats the hen the way it treated the T. rex. The camera drops to hen height, the river's heartbeat pulse returns for two beats, and the hen steps toward the lens. Its three-toed foot lands with the river's giant footfall sound. Keng flinches back with his hands up. The hen just pecks a grain and gives a small cluck, ยาย laughs, and the ending tag plays.
  - The joke is the mismatch: the same grammar (low lens, pulse, thud) on a 0.42 m hen.
  - It lands "the hen is a dinosaur" through the callback, with no text and no claim. The three-toed foot is the SH20 proof seen again, and the footprint stays in the dirt.
  - *Guards (RV-22a carried over):* no morph and no T. rex pose on the hen; it walks, steps and pecks as a hen. No T. rex is in the frame. No text.
  - *Alternative considered:* a hen footprint inside a giant three-toed print. Rejected: the river T. rex never comes near the village, so the giant print has no source, and it needs an extra insert.
- **D15-06 Frame budget:** shots 16A–16D add 154 f. SH16 tightens 150 → 120 (the high circle goes: after the scare the snatch comes as a surprise from above, so the circle setup is no longer needed). SH22 204 → 171 (the 105 f sky gag becomes a 72 f hen gag). Total **2009 + 154 − 30 − 33 = 2100 f = 70.00 s**, the top of the 60–70 s range.
  - The wordless window between L08 and L09 grows from 150 f to 274 f (9.1 s). That is long for a Short, but it is a suspense sequence with a comic payoff, which is what the user asked for.
  - *Shorter fallback (if the user wants under 70 s):* cut 16B (−26 f) and fold the two footfalls into 16A +30 and 16C +4 (2074 f = 69.13 s).

### R1.5 beat map (tension against the locked lines)

Tension 0 = calm, 5 = peak. Global frames; "on air" = the voice playing over the picture.

| Global f (s) | Shot | On air | Tension | Picture | Sound |
| --- | --- | --- | --- | --- | --- |
| 1283–1344 (42.8–44.8) | 15 | L08 "แล้วสี่ห้าเดือนนี้… กินข้าวกับอะไร" | 0→1 | village at the empty paddy, crane to the bowl; far long-neck browsing | M16 single held note, sigh |
| 1331–1350 (44.4–45.0) | 15 +48–+67 | (L08 tail, then nothing) | 1 | the far long-neck stops chewing and turns its head toward the forest; nobody in the village notices | held note fades out by f1350; no creature sound |
| 1350–1366 (45.0–45.5) | 16A | — | 1 | bright river, villagers fishing, Keng nets a flapping fish, grins | river, insects, chatter walla, net splash |
| 1366–1390 (45.5–46.3) | 16A +16–+40 | — | 2→3 | a cloud shadow dims the river; a flock of small pterosaurs bursts off the far conifers; everyone stops, Keng turns to the far bank; R1.5a: +28–+40 the villagers panic and scramble low into the reeds (Y, V1) or out of frame right (V2); Keng alone stays frozen | **silence drop** (insects and chatter cut), flock wing flutter far, river flow only; R1.5a: hushed scramble (S16-45) |
| 1390–1416 (46.3–47.2) | 16B | — | 3 | INS: rings jump on the water around Keng's shins and the net with each thud; the fish goes still | footfall 1, 2 (low, felt); **pulse starts** |
| 1416–1464 (47.2–48.8) | 16C | — | 4 | over Keng's shoulder: ferns part on the far bank; a T. rex's head and chest push out of the shade, head low; it sniffs twice toward the water downstream (G1, not at Keng); R1.5a: Keng glances round at the empty bank (everyone gone), then drops in a panic behind the boulder and pulls the net under; the T. rex does not react | ferns pushed, footfall 3, two deep sniffs, low throat rumble; pulse |
| 1464–1484 (48.8–49.5) | 16D +0–+20 | — | **5** | low on Keng, back to the boulder, trembling, breath held; behind him the T. rex's head over the boulder top holds, still on the water (R1.5a +0–+8: no reaction to the hide), then lifts… and turns away upstream for no visible reason | pulse at its soft peak; footfall +20; nothing else |
| 1484–1504 (49.5–50.1) | 16D +20–+40 | — | 5→2 | it walks off along the far bank, the tail sweeps out; Keng's eyes close, he exhales (comic "phew") | footfall +32 (fainter), insects return one by one, pulse stops dead f1498, boy's exhale |
| 1504–1532 (50.1–51.1) | 16 +0–+28 | — | 2→1 | sun back; Keng stands, lifts the net with the fish, relieved smile; a shadow crosses the water; dive from above | villagers' sigh walla, net splash, wing rush |
| 1532–1624 (51.1–54.1) | 16 +28–+120 | V09 "เฮ้ย! ปลาผม!" f1540–1592 | 0 (release, laugh) | the pterosaur snatches the fish, climbs past the lens, eats it on a snag; villagers laugh | laugh, gulp, pizz button |
| 1624– (54.1–) | 17–21 | L09, L10, L11 | 0 | as R1.4 | as R1.4 |
| 2028–2049 (67.6–68.3) | 22 +99–+120 | — (after V06) | mock 2 | camera drops to hen height, the hen steps toward the lens | the river pulse ×2 (quieter) at +100/+108, done by +116 (R1.5a, RV-27) |
| 2049–2100 (68.3–70.0) | 22 +120–+171 | — | 0 (laugh) | foot lands with a giant thud, Keng flinches, hands up; hen pecks a grain, small cluck; ยาย laughs | thud, peck tick, small cluck, E-TAG f2065 |

No jump-scare stinger anywhere (RV-23a: no sudden loud hit, no jump-scare cut). The T. rex reveal (16C +10–+24) is a slow emergence with no music hit. The loudest event in the sequence is a footfall, mixed below V09 and the laugh.

### Set additions (RIV, metres; est, Film)

Space RIV as the brief: origin on the near-bank waterline at the fishing spot, +x downstream, +y up, +z toward the near bank (camera side). The river runs z −8..0, the far bank z −8..−13, and the forest wall starts at z −13 (N16-11 `paintRiver`).
- **Boulder B1:** centre (0.75, 0, −1.35), 1.2 m wide (x 0.15..1.35), 0.9 m deep, top y 0.95 (0.95 m above the water surface at y 0; its base sits on the bed). It stands between Keng and the far bank. Present in 16A, 16C, 16D and 16 (continuity).
- **Reed bed RD** on the near bank: x −4.0..−1.5, z 0..0.9, 1.3 m tall. Villagers crouch in it in 16C/16D (off-frame there; seen in 16 +0 rising).
- **Fern row FC** at the forest wall: tree-fern and fern clumps x −4..2, z −12.8, tops 4.5 m. They shake +4–+16 and part +10–+16 in 16C (frond push keyed on frames). FC is sorted **in front of** the T. rex legs below y 2.0 and behind its chest and head.
- **Light state "shade" (est):** `RIVER_LIGHT.day` amb `#d6e2c8`, k 0.1 → amb `#a3b2a0`, k 0.05 (a cloud shadow) over 16A +14–+26, held through 16D, back to day over SH16 +0–+10 (relief). A light value only (AI13 if Boss/Editor tune it); no new renderer capability.
- **T. rex marks TX (RIV):** hip H0 (−1.5, 0, −13.0), inside the forest wall. Head positions:
  - hidden (0.2, 3.6, −12.6);
  - low reach (1.0, 3.4, −10.6), out over the bank;
  - up (0.6, 5.4, −11.2).
  - Walk-off heading (−1, 0, −0.15), upstream = screen-left in every R1.5 river lens.

### R1.5 per-shot staging

**15R5. S01-B04-SH15** [1283, 1350), 67 f. *Changed since R1.4: the far long-neck alert at the end.*
- +0–+48: exactly 15R4 (camera `CAM15`, crane to the bowl at +36 = f1319, LN-F browsing, nobody looks at it).
- +48: LN-F stops chewing (jaw holds 0).
- +52–+64: its head swings toward screen-left (the forest, north). This is the N16-06 head target moving along local z, about 1.2 m (est); the head stays at crown height. Hold to +67.
- Snout stays in frame (y ≥ 40, *est*; R1.4 probe snout at +36 = (760, 68)). Editor keeps LN-F soft as 15R4; the bowl stays the subject.
- RV-15 holds: no villager turns to it.
- Sound: M16 held note fades out over +50–+67 (out at f1350). No creature sound.
- Owner: Boss (N16-06 R2 head target, existing pose input); Editor.

**16AR5. S01-B05-SH16A** [1350, 1390), 40 f. *New R1.5.* River, the quiet falls.
- Camera: `cam: at (0.0, 0, −3.0), yaw −6→−12, r 5.5→5.0 m, eye 1.5, f 850, hy 860, pitch 4°`, ease over +0–+40 (RIV). Retention arc 6°, push about 10 %.
- K at (0.6, −0.1, −0.5), knee-deep (waterline y 0 hides below the knee, N16-11 R2), view 3/4 front by yaw. P07 with the hand net raised, a fish flapping at the net rim (net prop in `rHand`, fish parented to the rim).
  - +0–+24: `happy`.
  - +24–+34: face to `worried`, head and then body turn to the far bank; view → back 3/4 by +34.
- Villagers:
  - V1 `man-elder + new: isan-home` at (−1.6, 0, −0.9), casting a line.
  - V2 `woman-curly + new: isan-home` at (2.6, −0.1, −1.4) with a cast net (half-cropped right by design).
  - Y on the near bank at (−0.9, 0, 0.4) with a fish basket.
  - All chat (talk-cycle mouths) +0–+16. They stop +24–+34 and look across: heads first, then bodies.
  - **R1.5a panic scatter (RV-26d) +28–+40:** the villagers break before Keng does, as people who are frightened, not as a drill. `scared` faces, `surprise` mouths, no words. Nobody runs at full stride (no run cycle in water); each one is a stumbling, crouched scramble keyed by Editor (P35 body, 2–3 shuffled steps; *proposed motion*, not a kit entry). Heads stay above the water.
    - Y: grabs the basket to her chest at +28, ducks and scrambles into reed bed RD: (−0.9, 0, 0.4) → (−1.8, 0, 0.5) by +38; the reeds close over her shoulders by +40.
    - V1: drops the line (the rod tips into the water at +30), wades low toward RD: (−1.6, 0, −0.9) → (−2.2, 0, −0.2) by +40, half into the reed edge, looking back once at +36.
    - V2: crouches low and wades out of frame right toward the downstream near bank: (2.6, −0.1, −1.4) → (3.4, −0.1, −0.6) by +40 (already half-cropped; gone by +40).
    - The reed tops shake where Y and V1 went in, +34–+40 (RD sway keyed, Boss N16-11 R3).
  - K does **not** go with them: he stays frozen, back 3/4 toward the far bank, net up. He is the last one standing (comic, and it sets up his own panic in 16C).
- Light: day → shade over +14–+26 (a cloud shadow band sweeps from screen-left).
- +16: silence drop (sound).
- +18–+34: a flock of 10 small pterosaurs (kit `PTERO` at span ≈ 0.9 m, flap 4 Hz, random phase) bursts up from the far conifer crowns around (−1, 22, −17) and scatters up and to screen-right. Out of frame by +34. It never crosses the mark area (x < 330, y < 140).
- +34–+40: hold on K frozen. Only the fish, the shaking reed tops and V1's last steps move (R1.5a).
- proj (*probe*, Film scratch `p15.py`, a copy of kit `camSpace`):
  - K 377 px (y 1003–1380, x ≈ 785) at +0, 436 px (y 1016–1452, x ≈ 900) at +40 (W, reference; K's feet are under the waterline).
  - B1 x 612–868, top y 1040.
  - V1 x ≈ 170, head y 888; V2 x ≈ 1110, head y 879; Y x ≈ 300, head y 911.
  - Far-bank waterline y ≈ 1043; fern row tops y ≈ 754; flock origin ≈ (439, 76).
  - The band (y 1176–1344) holds water, K's shins and Y's skirt: calm, no subtitle on air.
  - R1.5a scatter (*est, not probed*): RD's near edge is inside frame left (x ≈ 0–260); Y and V1 end there at x ≈ 60–220. Editor confirms on the plate that both are seen entering the reeds inside x ≥ 40 and that no head enters the mark area (x < 330, y < 140).
- Sound:
  - +0: A-RV (water over pebbles, insects, villagers' chatter walla).
  - +2: S16-18 net splash (the fish lifted).
  - +16: **silence drop**: insects and chatter cut within 3 f; river flow stays at −18 dB (S16-37 note).
  - +18–+34: **S16-37** flock flutter. Many small leathery wings taking off together, far (25 m), airy, slightly panicked, 1.2 s, no calls. NEEDS-GEN.
  - +28–+40: **S16-45** (R1.5a) hushed scramble. Two or three adults wading fast and low through knee-deep water, reed stems pushed and snapping back, a basket knocking a shin; mid-distance (2–4 m), outdoor, dry; 0.9 s; frightened but hushed, no voices, no gasps. Under the silence drop at −20 dB so the silence still reads. NEEDS-GEN.
  - No music.
- Owner: Boss (N16-11 R3 B1/RD/FC, shade state, RD sway on keyed frames; flock reuse check); Editor (staging, scatter keys, light lerp, ambience automation); Ton (S16-45).

**16BR5. S01-B05-SH16B** [1390, 1416), 26 f. *New R1.5.* Insert: the water.
- Camera: `cam: at (0.62, 0, −0.95), yaw 10, r 0.75, eye 0.42, f 1000, hy 700, pitch −30°` (RIV), held static. The static frame is the tension; it is exempt from R05 for this shot (recorded reason).
- Frame (*est*, not probed): the still eddy between K's shins (left edge, x < 260) and the net rim with the fish (upper right, y 300–600). Pebbles read through the clear water (R1.1 river look).
- Rings: each thud starts concentric rings around **every solid touching the water at once** (K's shins, the net rim, two stones). This is the ground shaking, not a dropped object. Radius 0 → 0.35 m over 12 f; amplitude fades out; the pebble shimmer jitters 2 px for 4 f.
  - +4: thud 1, rings at amplitude 1.0.
  - +18: thud 2, rings at amplitude 1.4.
  - Guard: no glass, cup or dashboard image (no film likeness); it is the river surface only.
- +8: the fish stops flapping and hangs still in the net.
- Sound:
  - **S16-41 pulse** starts at +0. A low, muffled double thump like a heartbeat (lub-dub), about 72 per minute, soft, close and inside-the-head, no musical pitch; 1 cycle per 25 f. It rises slowly in level to 16D +20.
  - **S16-38 footfall** at +4 and +18. A huge padded foot planting on soft forest earth across the water: deep sub thump with a short wet-earth crush, 12 m away, one slapback off the water, 0.6 s. It is felt more than heard; give it a 150–300 Hz layer so it reads on a phone. Candidate `creature_theropod-footfall-sub_01` (EP17; 0.6 s, energy below 150 Hz, needs the mid layer); Ton decides fit, else NEEDS-GEN.
  - River flow −18 dB. No music.
- Owner: Boss (N16-11 R3 impulse rings: rings around every water-contact point on keyed frames); Editor.

**16CR5. S01-B05-SH16C** [1416, 1464), 48 f. *New R1.5.* Over the shoulder: it comes out.
- Camera: `cam: at (0.6, 0, −0.5), yaw 14→8, r 1.5→1.3 m, eye 1.15→0.95, f 820, hy 900, pitch 3→5°, cx −170`, ease over +0–+48 (RIV). A slow creep in; the eye drops with K as he sinks.
- K (0.6, −0.1, −0.5), back view by yaw, frame left.
  - +0–+22: standing, frozen, net held up with the still fish.
  - +22–+28 (R1.5a): his head turns left over his shoulder (neck yaw 0 → +0.35 rad, back view) toward the empty near bank: everyone is gone. Head back to the far bank by +28.
  - +28–+36 (R1.5a, was +28–+42): a **panic drop**, not a drill (RV-26d): his knees buckle into P35 `crouch_hide` in 8 f, a little too fast, and his left hand slaps flat onto B1's near face at +32 to catch himself. In the water the waterline hides him below the hips; his head ends below the boulder top as seen from the far bank by +36. His head never goes under the water (RV-23a).
  - +30–+36: he lowers the net under the surface, fish and all, so nothing splashes (net rim below y 0 by +36).
  - +36–+48: shoulders tremble 1 px at 6 Hz.
- TX (kit `TREX`, full opacity, scaly grey-brown as the kit, no feathers, RV-22b), hip at H0, the whole sequence in shade:
  - +4–+16: the FC fronds in front of it shake; they part +10–+16.
  - +10–+24: the head pushes out from hidden to low reach, neck forward and low, jaw shut (N16-22 R3 `sniff` base pose). Chest and both small arms come out of the ferns; legs stay in FC.
  - +20: a thin slice of sun lands on the snout and the upper teeth line; the eye has one catchlight. That is the only lit part.
  - +26–+44: two sniffs at +28 and +40. Each is a 0.15 m head lift and drop with flared nostrils and a small vapour puff (humid air), 6 f.
  - +44–+48: head still, pointed at the river.
  - **Gaze (R1.5a, RV-23a/RV-26c):** the head and the sniffs aim at the water downstream of Keng, gaze target **G1 (3.5, 0, −4.0)** RIV (*est*), never at Keng or the lens: head yaw stays ≥ 0.3 rad to screen-right of the TX-head→K line in every frame. During Keng's drop (+28–+36) the T. rex does nothing different: no head jerk, no pause in the sniff rhythm, no turn toward the boulder.
  - The sun slice on the snout and teeth stays inside the small far read (teeth line ≤ 60 px wide, *est*); no teeth close-up anywhere (RV-23a). The vapour puff is staging only (humid air), not evidence of smell (RV-25c).
- Villagers are out of frame in this lens (they duck into RD; seen rising in 16 +0).
- proj (*probe*, start → end camera):
  - K head y 916 → 815 standing at x 370; crouched head ≈ y 1165 → 1101. The boulder top line is y ≈ 1015 → 972, x 290–733. K's face is turned away (back view), so the R04 face rule does not apply; his head stays above y 1176.
  - TX head low ≈ (575, 780) → (499, 795); hip ≈ (427, 802) → (350, 818); tail end ≈ (189, 850) → (102, 865); fern tops y ≈ 743–760.
  - TX reads about x 100–600, y 700–1030 (≈ 330 px tall visible): small and far against K's back. The fear comes from the distance closing, not from size.
- Sound:
  - Pulse continues.
  - **S16-40** ferns pushed +4–+16: big fronds and stems bent apart by a heavy body, slow dry-and-wet rustle with a stem creak, far (12 m), 1.0 s.
  - S16-38 footfall at +10 (half hidden under the ferns).
  - **S16-42** sniffs at +28 and +40, then a long huffing exhale with a low throat rumble under it at +44 (−10 dB). A very large animal's deep nasal inhale, wet and slow, heard across water, intimate rather than loud; about 2.2 s for all three. No roar, no growl peak; the rumble is breath texture, not a threat call (RV-23a). **R1.5a: NEEDS-GEN, a deeper and different voice from EP17's `creature_theropod-sniffs_01` (RV-28b): do not use that file or a pitch-shifted copy of it.** Lower, slower, larger chest; the two sniffs keep the +28/+40 spacing (12 f).
  - No music.
- Owner: Boss (N16-22 R3 sniff/push-out, gaze to G1, FC parting and sort, shade); Editor (K look-round and panic drop, tremble); Ton.

**16DR5. S01-B05-SH16D** [1464, 1504), 40 f. *New R1.5.* Behind the boulder: the near miss.
- Camera: `cam: at (0.7, 0, −0.75), yaw 18→12, r 1.25→1.1 m, eye 0.55, f 900, hy 900, pitch 8°`, ease over +0–+40 (RIV). Low, south of K, facing him; the boulder is behind him and the far bank beyond it.
- K at (0.7, −0.1, −0.75) (0.25 m north of his 16C mark; the cut hides the shuffle), P35 front view. His back is to B1. The net is held under the water against his knees.
  - +0–+32: `scared` face with the `clench` mouth (breath held), eyes wide; body tremble 1 px at 6 Hz (R1.5a: frightened, not a calm drill, RV-26d). His eyes cut up and right toward the boulder top at +6. No text, caption or line says to hide, freeze or hold your breath (RV-26a).
  - +32: eyes close.
  - +36: exhales with the `pant` mouth; shoulders drop 0.04 m. A comic-relief "phew", not a gasp of terror (RV-23a).
  - No hand over the mouth (reserved for EP17, D15-03; RV-28a).
- TX beyond the boulder, softened as background (Editor: 2 px blur or haze 0.2):
  - +0–+8 (R1.5a): head holds at low reach, just over the boulder top line, still aimed at the water at G1 as in 16C. Keng has been hidden since 16C +36; the animal shows no reaction to his vanishing (RV-26c).
  - +8–+14 (R1.5a, was +4–+10): head lifts to up, unhurried.
  - +14–+22 (R1.5a, was +10–+20): head turns upstream (screen-left), neck yaw 0 → −0.5 rad (N16-22 R3 head turn). **No visible cause** (RV-25b): no wind gust, no frond sway and no sound before the turn; it simply goes.
  - +18–+40 (R1.5a, was +16–+40): `stalk` walk off along the walk-off heading, 0.55 Hz, stride 2.4 m (≈ 1.3 m/s): hip H0 → (−2.5, 0, −13.15) by +40. *R1.5 had (−3.4, 0, −13.3), which needs ≈ 2.6 m/s at this stride; corrected.* The head passes above and left of K's head about +32; the tail sweeps right→left across the boulder top.
  - At +40 its head and chest are turning into the fern wall. In SH16 it is gone.
  - Gaze: at low reach the head points ≥ 0.35 rad off the camera axis toward screen-right (G1); after the turn it faces screen-left. It never looks at Keng's face or into the lens (RV-23a).
- proj (*probe*, start → end):
  - K crouched x 540, head y 883 → 864 (front face above y 1160 ✓); K card ≥ 650 px including the part under the water; lead ✓.
  - B1 x 386–989, top y ≈ 829 → 815.
  - TX head low ≈ (817, 787); up ≈ (779, 652) → (697, 656); mid-walk head ≈ (567, 781) → (483, 778), about 100 px above K's head. Tail end ≈ (388, 890) → (295, 885), behind the boulder top. TX legs and feet are below the boulder top, so they are hidden.
  - R1.5a: the shorter walk (hip end x −2.5) leaves the head ≈ 80–120 px further right at +40 than the R1.5 probe (*est, not re-probed*); low-reach and up positions are unchanged, only their frames move (+0–+8 low, +14 up).
- Sound:
  - Pulse at its soft peak +0–+20, then it thins. Soft ceiling (RV-23a): at its peak it stays ≥ 12 dB under the later V09 level (*est*), a felt pulse, never a jolt.
  - S16-38 footfalls at +20 and +32 (R1.5a, was +18/+30, following the later walk start), each −4 dB quieter than the last (walking away).
  - Insects return one at a time from +30: one cicada first, the rest by +40 (A-RV automation).
  - Pulse stops dead at +34.
  - **S16-43a** at +36: a boy's long exhale through loose lips, a small wobble at the start and a comic "phew" end, close, dry, 0.8 s. Comic relief, not a gasp of terror (RV-23a). NEEDS-GEN (or a Leda breath take if Editor has one; Ton decides).
- Owner: Boss (N16-22 R3 stalk walk + head turn, the +0–+8 hold); Editor (tremble, TX haze); Ton.

**16R5. S01-B05-SH16** [1504, 1624), 120 f. *Changed since R1.4: re-timed to 120 f; it opens on relief; no high circle.*
- Camera: `CAM16R` (as 16R), the move spread over 120 f (ease 0..1).
- +0–+12: relief.
  - Light back to day over +0–+10.
  - K rises from the crouch at (0.7, −0.1, −0.75) and steps back to (0.6, −0.1, −0.5). He lifts the net out of the water with the fish (it flaps again at +6), `surprised` → `happy`.
  - Villagers rise out of the reeds at frame left (V1 first, then Y); V2 wades back in from frame right (R1.5a, from the 16A scatter). TX is gone; the forest wall sways once at screen-left far +0–+10 (its passing body, not wind: RV-25b).
- +6–+12: the pterosaur's shadow crosses the water (K does not see it).
- +10–+28: dive from top right (`PTERO` dive).
- **+28 (f1532): grab**, feet closing on the fish at the net rim (grab 0→1 over +26–+28).
- +28–+56: climbs past the lens to the left at full span, two flaps, fish in its feet.
- +56–+72: glides to the far snag (−6.0, 4.5, −14.0) and lands at +72 (fold 0→0.8).
- +84–+94: head toss and gulp (fish gone at +92).
- +94–+120: hold; it settles; one preen +100–+116 (optional, Editor may drop it).
- K:
  - eyes open +28–+72, no blink at the grab;
  - shakes the empty net +40–+64, `surprised` → `angry`;
  - V09 voice +36–+88 (f1540–1592; file start f1535).
- Villagers: laugh +60–+110, lean ≤ 8°, 1.5 Hz shoulder bounce (16R windmill fix holds). The laugh plays as relief after the fear and is about the lost fish; no gesture or line credits the hiding (RV-26b).
- Pterosaur on screen: shadow from +6, body +10–+120 = 110 f (≥ 100 ✓).
- Sound:
  - **S16-43b** villagers' relieved sigh walla at +2 (several adults breathing out, a nervous half-laugh, no words, 1 s).
  - A-RV at full level from +0.
  - S16-18 net splash at +6.
  - S16-19 wing rush +10–+40 (big close→far rush; the soft far circle pass is cancelled).
  - S16-20 villagers' laugh at +60.
  - S16-34 gulp at +90.
  - M16 comic pizz button at +94.
- Owner: Boss (N16-07 R2: dive/grab/climb/land/gulp; circle no longer needed); Editor.

**22R5. S01-B06-SH22** [1929, 2100), 171 f. *Changed since R1.4: no sky, no T. rex, no text; the hen gag.*
- +0–+99: as 22R/22R4.
  - K kneels nose to beak with H1 (3.25, 0, −8.5); Y stands behind, whole figure, with the egg apron.
  - V10 +8–+66 (f1937–1995); V06 cluck +81–+99 (f2010–2028).
  - Y laughs +84–+110 (`laugh`, lean ≤ 4°). Y's head and the egg bundle stay attached (N16-21).
- Camera:
  - +0–+100: as 22R: `cam: at (3, 0, −8.5), yaw 95→100, r 1.6→2.2 m, eye 0.55, f 950, hy 880`, ease over +0–+100.
  - +100–+114: **drop to hen height**: at (3.0→3.3, 0, −8.5), r 2.2→1.0, eye 0.55→0.14, yaw 100, hy 880→820, pitch 0→4°, ease in-out.
  - +114–+124: creep in to at (3.35, 0, −8.5), r 0.85, eye 0.12, pitch 6°.
  - +124–+171: static hold.
- H1:
  - +100–+106: turns its head to the lens (front view, a plain hen head-tilt, N16-03).
  - +108–+120: one plain hen step toward the lens, (3.25, 0, −8.5) → (3.5, 0, −8.48), head bobbing. No T. rex posture, silhouette or shadow, no crouch, no open beak, no head tilt mirroring the river T. rex (RV-22a, RV-27a).
  - **+120 (f2049): the right foot plants** in the soft yard dirt, three toes spread toward the lens. A tiny dust puff (0.08 m). The frame jolts 3 px for 2 f.
  - +126: it shifts its weight back; the foot lifts and leaves a three-toed print (N16-03 footprint decal, 0.07 m).
  - +128: pecks a grain beside the print.
  - +134: lifts its head, small content cluck.
  - +134–+171: idle on the hen ambient clock (R07).
- K (as 22R marks; *est* in the low frame, head y ≈ 300–420, behind the hen):
  - +100–+118: watches the hen, grin fading to `worried`.
  - +120–+130: tips back from the kneel (lean back 12°) with P45 hands up beside his head, `surprised`.
  - +134–+150: lowers his hands, laughs (`happy`).
- Y: laughs harder at +122–+140 (two bounces at 2 Hz, lean ≤ 4°).
- proj (*probe*, low camera):
  - H1 at +114: feet y 1015, comb y 636 (379 px).
  - H1 at the plant (+120, end camera): foot y 1086, comb y 529 (557 px); the foot contact is above y 1160 ✓.
  - Print ≈ 95 px wide at (477, 1086), ≥ 80 px ✓.
  - Faces above y 1160 ✓.
  - The mark area (x < 330, y < 140) holds sky or the coop.
- What it claims: nothing new. The hen is shown to be a dinosaur through the film's own grammar (pulse, low lens, the giant footfall sound) and the three-toed foot already shown in SH20 under L10 (R2-F06 `solid`). It does not say or show that hens come from T. rex: no T. rex in the frame, no morph, no shared pose. Boat R1.5 check: ok with guards RV-27a–d (R1.5a):
  - RV-27a no T. rex posture, silhouette, shadow, roar, mirrored head tilt or open beak on the hen;
  - RV-27b the footfall is the giant sub thump only, never the river T. rex's sniff, breath or growl;
  - RV-27c no cut or match pairs 16D's last footfall with SH22 (Editor: no match cut, no repeated framing; they are ≈ 18 s apart in this cut);
  - RV-27d no on-screen or voiced "descends from" wording; V10 and L10–L11 unchanged.
- Sound:
  - Silence under V10 (A-VM only); V06 at +81.
  - **S16-41 pulse** two cycles at +100 and +108 (R1.5a, was +104/+116), each ≤ 8 f, so the callback is done by +116 (RV-27); same file, −6 dB against its river level. The 4 f of silence before the plant is part of the joke.
  - **S16-38 footfall** at +120, −8 dB with its tail cut to 0.3 s: the giant sub thump only, with no sniff, breath or growl layer (RV-27b). The same giant thud on a hen's foot is the joke, so do not make it a "small" sound. Label: invented creature foley, comedy sound, not a recording of a real animal (RV-27).
  - **S16-44** peck tick at +128: a beak tapping a grain on packed dry dirt, tiny, close, dry, 0.1 s.
  - Small content cluck at +134 (`creature_hen-cluck-single_02` if it fits a soft content cluck; it is a different sound from V06).
  - ยาย's laugh walla +122.
  - **E-TAG** at +136 (f2065), 35 f to the end; Editor fades its tail from +160 if the file rings longer.
- Owner: Boss (N16-03 footprint decal and the close foot read in a low lens; N16-21); Editor (camera drop, gag timing; the plant reads as a hen foot with the dust puff and the three-toed print visible, RV-27); Ton (S16-41/38 reuse levels, S16-44, E-TAG trim). Boat: checked R1.5 (RV-27, ok with guards).

### Dropped in R1.5

These are dropped (user, 14 Nov 2026):
- the SH22 sky tilt (+100–+178 of 22R4);
- the T. rex apparition (N16-22 R2 apparition layer, opacity, cloud bank, wind streaks);
- the line "Remember who you are" (N16-23, cancelled; the runtime text-item check is no longer needed);
- Ton cues S16-35 (wind swell) and S16-36 R2 (apparition roar).

Rows question Q7 loses its sky image. The R1.4 look frame `out/ep16/r14/looks/v4/LF-SH22SKY-R14.png` is kept as history only. Boat's RV-22b/RV-22c verdicts (on the apparition and the line) lapse with the content.

### R1.5 Boss list (changes to the R1.4 table)

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N16-22 R3 | **T. rex in the world** (replaces the R2 apparition). Kit `TREX` at full opacity in RIV, sort point at the hip, fern row FC in front of the legs. R1.5a: a head/gaze target input so the head aims at G1 (3.5, 0, −4.0) independent of the body. New motions: **`stalk`** walk cycle (0.55 Hz, stride 2.4 m, head low and level, tail counter-sway, body bob; legs on the existing `ik2` thigh/shin/foot); **`sniff`** (neck lowered below the stand line: a new negative range or a `neckLow` input; nostril flare; 6 f head lift/drop; vapour puff); **head turn** (neck yaw input, ±0.6 rad). Shade light only. No roar, no feathers | creature motions (kit) | 16C, 16D | `buildTRex` has `stand` and `roar` only (inspected `src/painted/survival/beast-trex.ts`, `beast-kit.ts` TREX anims, this checkout): stalk/sniff/turn **missing**. Apparition layer/opacity: not built, now not needed |
| N16-11 R3 | River additions: boulder B1, reed bed RD (R1.5a: reed-top sway keyed where figures enter, 16A +34–+40), forest-wall fern row FC with a keyed part (frond push +4–+16), **impulse rings** (concentric rings around every water-contact point on keyed frames, amplitude input), shade light state or lerp target | set (shared RIV) | 16A–16D, 16 | proposed; `paintRiver` has flow ripples and a ring at each pole foot (inspected), no impulse rings |
| N16-07 R2 | Pterosaur: the high circle is no longer used in EP16 (keep it if built); add a check that `PTERO` reads at span ≈ 0.9 m, 30–60 px, for the 16A flock (10 instances, flap only; instancing is Editor's) | creature motions | 16, 16A | `PTERO` R2 exists (Boss log 15:58) |
| N16-06 R2 | Long-neck: SH15 alert = jaw hold + head target swing toward screen-left (existing `head` target input) | creature pose | 15 | existing input; values only |
| N16-03 R3 | Hen: a three-toed footprint decal in yard dirt (0.07 m, pressed, darker damp edge); the foot read in a low close lens (≥ 80 px print, toes readable) | ANIMALS detail | 22 | small new |
| Poses | K: P35 `crouch_hide` in water (waterline clip as N16-11 R2), P34→P45 lean-back hands up; villagers and Y: P35 in the reeds, R1.5a reached by a crouched 2–3-step scramble (Editor keys on P35; *proposed*, no kit motion); mouths `clench` (breath held) and `pant` (exhale) from the kit activity mouths | kit poses (existing) | 16C, 16D, 16, 22 | existing-integrated per kit README (P35, P45, activity mouths); the waterline clip on a crouch is unverified |
| ~~N16-23~~ | ~~caption text line~~ | — | — | cancelled R1.5 |

No new character, outfit or creature look. The T. rex look is the kit's AS-TREX-R2 (Boss, 14 Nov 2026). The user saw it as the sky apparition, but not yet in daylight shade on a river bank. Film's next pass makes look frames **LF16R15-SH16C** (+24) and **LF16R15-SH16D** (+4) for the user before Boss polishes the motions.

### R1.5 Editor notes (per shot)

- **Global:** durationFrames **2100**. Rebuild `clock.ts` from the R1.5 shot map (26 shots). Re-place takes per the R1.5 voice table:
  - `narration-place.py`: `TOTAL = 2100`; L09 start_s 54.133, L10 58.800, L11 62.467;
  - V09 file f1535, V10 file f1929, V06 f2010.
  - Captions follow their voice ranges.
- SH15: LN-F alert +48–+64; M16 held note out by f1350.
- 16A–16D: new shots; light lerp day→shade (16A +14–+26) and back (16 +0–+10). A-RV automation: insects/chatter out at f1366, back f1494–1504. TX blur/haze in 16D.
- R1.5a (Boat RV-23..RV-28):
  - 16A +28–+40: villagers' panic scatter into RD / out right (RV-26d); K stays frozen.
  - 16C: K look-round +22–+28, panic drop +28–+36 with the hand slap on B1 at +32, tremble from +36; K's head never under water (RV-23a).
  - 16C/16D: TX aims at G1, never at K or the lens; no reaction to the hide; 16D head hold +0–+8, lift +8–+14, turn +14–+22, walk +18–+40 (RV-26c, RV-23a). Nothing on screen explains the turn: no wind, no frond gag (RV-25b).
  - No text, caption or Thai line in 16A–16D, 16 or anywhere in EP16 about hiding, freezing, holding breath, smell, motion vision, or predators being active only at night or near fires (RV-23a, RV-24a, RV-25a, RV-26a/b). No jump-scare cut, no teeth close-up.
  - SH22: no cut or match that pairs 16D with SH22 (RV-27c); the plant reads as a hen foot with dust and the print (RV-27).
- SH16: the 120 f timeline (grab f1532, V09 f1540–1592, gulp +90, pizz +94).
- SH22: remove the sky tilt, apparition and text; camera drop +100–+124; hen step and plant +108–+120 (jolt 3 px, 2 f); K lean-back P45; pulse cycles +100/+108 (R1.5a); E-TAG f2065.
- Shots 17–21: unchanged in-shot; global +124.

### R1.5 Ton list

New cues (descriptions in the shot blocks above; NEEDS-GEN unless Ton's fit test passes a candidate):

| Cue | Shot (local f) | Global f | Sound | Candidate |
| --- | --- | --- | --- | --- |
| silence drop | 16A +16 | 1366 | automation, not a file: insects and chatter out within 3 f, river flow −18 dB, until 16D +30–+40 | — |
| S16-37 | 16A +18–+34 | 1368–1384 | small pterosaur flock taking off, far, airy, 1.2 s | NEEDS-GEN |
| S16-38 | 16B +4, +18; 16C +10; 16D +20, +32 (R1.5a); SH22 +120 | 1394, 1408, 1426, 1484, 1496; 2049 | giant padded footfall across water, felt sub + 150–300 Hz layer, 0.6 s; **invented creature foley, not a recording of a real animal** (RV-27); in SH22 the sub thump only, no sniff/breath/growl (RV-27b) | `creature_theropod-footfall-sub_01` (needs the mid layer) |
| S16-40 | 16C +4–+16 | 1420–1432 | heavy body pushing fronds apart, far, 1.0 s | NEEDS-GEN |
| S16-41 | 16B +0 → 16D +34; SH22 +100, +108 (R1.5a) | 1390–1498; 2029, 2037 | heartbeat-like low muffled double thump, ~72/min, rising but soft (peak ≥ 12 dB under V09, est), stops dead at f1498; SH22 callback done by +116; not music, not a stinger (RV-23a, RV-27) | NEEDS-GEN |
| S16-42 | 16C +28, +40, +44 | 1444, 1456, 1460 | two deep wet sniffs + huffing exhale with a low rumble under it (−10 dB, breath texture, not a threat call), no roar | **NEEDS-GEN (R1.5a, RV-28b):** a deeper, different voice from EP17's `creature_theropod-sniffs_01`; not that file, not a pitch-shift of it |
| S16-43a | 16D +36 | 1500 | boy's comic "phew" exhale through loose lips, small wobble at the start, close, 0.8 s; relief, not a terror gasp (RV-23a) | NEEDS-GEN |
| S16-43b | 16 +2 | 1506 | villagers' relieved sigh walla with a nervous half-laugh, 1 s | NEEDS-GEN |
| S16-44 | 22 +128 | 2057 | beak tapping a grain on dry dirt, 0.1 s | NEEDS-GEN |
| S16-45 (R1.5a) | 16A +28–+40 | 1378–1390 | hushed scramble: 2–3 adults wading fast and low through knee-deep water, reeds pushed and snapping back, a basket knocking a shin; 2–4 m, dry; 0.9 s; frightened, no voices; −20 dB under the silence drop (RV-26d) | NEEDS-GEN |

Cancelled: S16-35, S16-36 R2.

Ton guards (R1.5a, Boat RV-23a, RV-27, RV-28b): no roar, growl peak or sudden loud hit anywhere in 16A–16D; the 16C rumble stays at −10 dB under the exhale; the pulse stays soft and cuts dead at f1498; S16-38 and S16-42 are labelled invented creature foley in the cue sheet; S16-42 is its own voice, not EP17's.

R1.5 re-time (R1.4 frame → R1.5 frame; cues before f1350 unchanged):

| Cue | R1.4 | R1.5 | Action |
| --- | --- | --- | --- |
| M16-bed | 92 (1805); soft f1375→f1500 | 92 (1929); **out f1350** (SH15 held note fades +50–+67), back at f1624 (L09, SH17) | re-time the music map: no music over 16A–16 except the pizz button; hard stop f1805 → f1929 |
| A16-RV | 1350 (1500) | 1350 (1624) | loop length 274 f; automation as "silence drop" |
| S16-18 | 1352 | 1352 (16A +2) and 1510 (16 +6) | two uses: net lift in 16A, net out of the water in 16 |
| S16-19 | 1350–1400 (circle + dive) | 1514–1544 | dive only; far circle pass cancelled |
| S16-20 | 1430 | 1564 | re-time |
| S16-34 | 1470 | 1594 | re-time |
| M16-pizz | 1474 | 1598 | re-time |
| A16-FI, S16-21 | 1500 (1629) | 1624 (1753) | shift +124 |
| S16-22 | 1572 | 1696 | shift +124 |
| M16-restate | 1629 | 1753 | shift +124 |
| A16-VM-c | 1629 (2009) | 1753 (2100) | shift, until end |
| S16-23 | 1629 (1750), −6 dB to 1805 | 1753 (1874), −6 dB to 1929 | shift +124 |
| S16-24 | 1637 | 1761 | shift |
| S16-25, M16-low | 1694 | 1818 | shift |
| S16-26 | 1726 | 1850 | shift |
| S16-27 (SH21 reuse) | 1790 | 1914 | shift |
| V06-cluck | 1886 | 2010 | shift |
| E-TAG | 1971 | 2065 | re-time: SH22 +136, 35 f to the end |

### Boat recheck (R1.5)

**Boat must review before Editor integrates 16A–16D, 16 and 22.** Film's reasons:
- (a) A real predator now appears in daylight. That changes VD-S04's EP16 staging rule (a design rule, not a fact; RV-24) to one daylight predator beat.
- (b) The staging shows behaviour: sniffing, and losing interest. The shot asserts nothing, but it is fiction about a real animal.
- (c) The hiding could be read as a survival tip ("stay still and quiet behind a rock and a predator leaves"). The picture never presents it as a method and no line says it, but Boat should judge it against M05/R2-F18 (the series does not promise protection).
- (d) SH22 links the hen to the river T. rex through sound and camera; this is the RV-22a reading risk ("hens descend from T. rex").
- (e) Family-safe tone check for the channel: tension with no harm, no chase and no stinger.

L09 ("ปลาในแม่น้ำ น่าจะหาง่ายสุด…") now follows a predator scare at the river. Film reads it as fine: the line hedges and is about catching fish. Boat confirms.

**Result (Boat, [R1.5 visual check](research-r2.md#r15-visual-check-boat-2026-11-14), 14 Nov 2026):** RV-23..RV-28 all ok, no must-fix; guards applied in [R1.5a](#r15a-boat-guards-applied-rv-23rv-28).

### R1.5 questions for the user (Film's recommendation applied)

- **R15-Q1 Where the scare goes:** the river before the pterosaur snatch (recommended), the paddy in SH11, or the forest edge in shots 3–5?
- **R15-Q2 Near-miss or chase:** near-miss only, it sniffs and walks away (recommended), or a short run to the bank (needs about +2 s and run cycles in water)?
- **R15-Q3 EP17 overlap:** keep a T. rex near-miss in EP16 (recommended, made different from EP17 by daylight, species, far bank and the comic release), or use a non-predator scare (only footfalls and a moving treeline, never seen) to save the first seen predator for EP17?

### R1.5a: Boat guards applied (RV-23..RV-28)

**Owner Film, 14 Nov 2026.** Source: Boat's [R1.5 visual check](research-r2.md#r15-visual-check-boat-2026-11-14) (RV-23..RV-28, no must-fix). No Thai word, voice placement or shot boundary changes; durationFrames stays **2100**. Staging changed in 16A, 16C, 16D and SH22 (marked "R1.5a" in the shot blocks above); sound guards in the Ton list; Editor items in the Editor notes.

| Guard | Where applied |
| --- | --- |
| RV-23a no roar/growl peak, no jump-scare cut or loud hit, boy's head never under water, comic exhale, no teeth close-up, T. rex never looks at the boy's face or the lens, soft pulse cut dead at 16D +34 | beat map; 16C (gaze G1, teeth ≤ 60 px, K head above water); 16D (gaze, soft pulse ceiling, "phew"); Ton list |
| RV-24 / RV-24a "one daylight predator beat"; nothing says or implies predators hunt only at night or near fires | D15-04; R1.4 shot-22 note; Boat recheck (a); brief VD-S04; Editor notes |
| RV-25a no claim about smell, still prey or motion vision; RV-25b the walk-off has no visible cause; RV-25c vapour puff is staging only | 16C, 16D (+14 turn with no cause), SH16 (wall sway is the body, not wind); Editor notes |
| RV-26a/b no line or caption about hiding, freezing or holding breath, nothing credits the hiding; RV-26c the hiding never visibly works; RV-26d hiding framed as panic, villagers scatter into the reeds | 16A scatter +28–+40; 16C look-round and panic drop; 16C/16D T. rex aimed at G1 with no reaction, 16D +0–+8 hold before the turn; SH16 laugh about the fish |
| RV-27a–d hen gag: no T. rex pose/sound layer on the hen, no 16D↔SH22 match, no "descends from"; S16-38 labelled invented foley; pulse done by +116 | SH22 block; Ton list; Editor notes |
| RV-28a no hand over the mouth, no family frozen in a stilt house; RV-28b S16-42 a deeper, different voice from EP17's file | 16D; 16C sound; Ton list |
| RV-28c EP17 keeps its animal unnamed and different | not EP16 material: handed to the coordinator for EP17's brief |

**Conflict resolved (RV-26c vs RV-26d):** R1.5 showed only Keng hiding, and the T. rex lifted and turned 4 f after its head reached the boulder line, which could read "he hid, so it left". R1.5a: (1) the villagers break first, in a stumbling panic, so hiding is what frightened people do, not a technique; Keng is the slow one left standing, then drops clumsily; (2) the T. rex is aimed at the water downstream (G1) throughout, so it never looks where Keng was; (3) it keeps the same sniffing posture for 20 f after Keng is down (16C +36 → 16D +8) before it lifts and turns with no visible cause. Frame budget: unchanged (all changes inside the existing 16A, 16C, 16D and SH22 frames).

## R1.5b revision: the T. rex as a visible hero (16B–16D)

**Owner Film, 14 Nov 2026.** Source: the user's verdict on Boss's R3 river suspense frames (`out/ep16/assets/sheet-r3a.png`, `sheet-r3b.png`, `r3c-cu.png`), relayed by the coordinator: "the T. rex is not clearly visible" (user, 14 Nov). In R1.5a's 16C the animal was about 330 px of a 1920 px frame, far, partly behind B1 and the fern row, and tilted about 45° as if climbing: its body axis pointed almost at a low, short lens (heading 0.77 rad, f 820, 14 m), so the tail projected low and the head high. The vapour puff was barely visible. Goal: a clear, dark, scary-but-family-safe silhouette that reads at phone size, as the user wants every dinosaur to be a visible hero (VD-S04).

This section supersedes the R1.5/R1.5a staging, camera, proj and sound frames of **16B, 16C and 16D** only. 16A, SH16 and every other shot are unchanged. Boat's guards RV-23..RV-28 stay in force; the R1.5a rules on gaze, panic and "the hiding never works" carry over with the new numbers below.

### R1.5b decisions

- **D15B-01 Long lens, the animal is the subject (16C).** A telephoto over-the-shoulder from the near bank (f 2600, 8.6 → 8.0 m behind Keng) replaces the 1.5 m OTS. The long lens stacks the far bank right behind Keng, so the T. rex looms large while it stays on the far bank (no approach, no crossing). Keng becomes a small back-view figure at frame left; the T. rex fills the upper two thirds. *Alternatives:* (a) bring the T. rex onto the water's edge with the old lens (rejected: it nears the water and Keng, against D15-02's near-miss distance); (b) a reverse shot on the T. rex alone (rejected: loses Keng in the frame, the scale cue and his panic drop).
- **D15B-02 Level and profile.** The camera is level (pitch 0) at eye 1.45 m and 21 m from the animal, and the body is in near profile facing downstream (heading 0.33 rad), so the back reads level and upright instead of climbing. The head aims at G1 (below), in profile to screen-right.
- **D15B-03 Value.** The T. rex is placed with a darker ambient (`amb #3f4a44`, `ambK ≥ 0.42`; placement fields of `BeastPlace`, no renderer change) and no haze after 16C +22: measured luma 0.35 on the animal against 0.70 behind it. Its head and back sit against the pale haze above the fern line.
- **D15B-04 Full-body step (16D).** In 16D the T. rex takes one full step out of the ferns onto the open far bank (legs, feet and body seen, left of B1), stands, lifts its head and **walks on into the forest** (downstream-away). R1.5a's turn back upstream is dropped: continuing on is the least causal exit (RV-25b) and shows again that it never registered Keng (RV-26c). SH16's single forest-wall sway moves to where it went in.
- **D15B-05 G1 moves.** Gaze target **G1 (9.0, 0, −8.0)** RIV (*est*; R1.5a (3.5, 0, −4.0)): the far-side water's edge downstream. From the R1.5b head positions the old G1 lay almost on the line toward the lens; the new one keeps the head in profile, ≥ 0.99 rad off the head→lens line and ≥ 1.01 rad off the head→Keng line in every probed frame.
- **D15B-06 Size and safety.** The head stays under 45 % of frame width and the jaw stays shut with no teeth shown: a medium-wide of the whole animal, never a teeth close-up (RV-23a). The sun slice moves from "snout and upper teeth line" to **brow and snout top**.
- **D15B-07 Budget.** 16B 26 → 22 f (two thuds 12 f apart), 16D 40 → 44 f (the full-body step needs 16 f). 16A, 16C (48 f) and SH16's start f1504 are unchanged; total **2100 f** unchanged. Global events after 16D +30 keep their R1.5a frames (insects f1494, pulse stop f1498, exhale f1500).

### R1.5b shot map rows (replace the 16B–16D rows above)

| # | ID | Beat | Clock | Global [start, end) | Frames | Start s | Size | Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 16B | S01-B05-SH16B | B05 | W-RIVER | [1390, 1412) | 22 | 46.33 | INS | R1.5b: 26 → 22 f; thuds +4, +16 |
| 16C | S01-B05-SH16C | B05 | W-RIVER | [1412, 1460) | 48 | 47.07 | OTS long lens | R1.5b: the T. rex is the subject, ≥ 35 % frame height; Keng small at frame left |
| 16D | S01-B05-SH16D | B05 | W-RIVER | [1460, 1504) | 44 | 48.67 | M low 3/4 | R1.5b: full-body step onto the far bank, walks on into the forest; Keng behind B1 |

### R1.5b per-shot staging

Look-frame geometry is code: [looks-r15/shots.ts](looks-r15/shots.ts) (cameras, marks, pose keys), rendered by [looks-r15/render.sh](looks-r15/render.sh) through `scripts/stills.mjs`; numbers come from [looks-r15/probe.mts](looks-r15/probe.mts) (*probe*, kit `paintBeast` bbox and `camPoint`) and a pixel diff of each frame against the same frame without the T. rex (*measured*, visible pixels including its ground shadow).

**16BR5b. S01-B05-SH16B** [1390, 1412), 22 f. *Changed R1.5b: 22 f.*
- Camera, frame, rings, fish and guards: exactly 16BR5.
- +4 (f1394): thud 1, rings amplitude 1.0. +16 (f1406): thud 2, rings amplitude 1.4 (they carry over the cut at age 0.5; 16C opens on the far bank, so they are not seen there).
- +8: the fish stops flapping.
- Sound: S16-41 pulse from +0; S16-38 footfall at +4 and +16 (description unchanged); river −18 dB; no music.
- Owner: Boss (N16-11 R3 rings on the new frames); Editor; Ton (re-time).

**16CR5b. S01-B05-SH16C** [1412, 1460), 48 f. *Rebuilt R1.5b.* Long-lens over the shoulder: it comes out.
- Camera: `cam: at (0.6, 0, −0.5), yaw 9.5→9.0, r 8.6→8.0 m, eye 1.45, f 2600, hy 1010, pitch 0°, cx −280`, linear over +0–+48 (RIV). Camera position (2.02, 1.45, 7.98) → (1.85, 1.45, 7.40), on the near bank behind Keng. A 0.6 m creep in.
- Set dressing: `paintRiver` `x0 −74` (Editor scene setting; default −75) so no near-bank fern clump crosses the Keng line of sight and only one far tree fern (x 1.4, z −11.5) crosses the T. rex's chest, none its head. The near-bank clump at (2.4, 0, 3.2) stays as a soft foreground at frame bottom right.
- K at (0.6, −0.3, −0.5): R1.5b stands on the bed 0.3 m under the surface (waterline at world y 0; see B-R15B-01). Back view (facing (0, −1)).
  - +0–+22: P07 standing, frozen, net up with the still fish (net prop per 16AR5; the look frame has no net).
  - +22–+28: look-round over his left shoulder (R1.5a, unchanged).
  - +28–+36: panic drop to P35 `crouch_hide`, left hand slaps B1's near face at +32; net under the surface by +36 (R1.5a, unchanged).
  - +36–+48: tremble 1 px at 6 Hz.
  - Screen (*probe*): head top (260, 1148) standing → (260, 1373) crouched (0.32 m above the water, never under); waterline y ≈ 1456–1475; B1 near top (324, 1160). Keng's back is in the caption band, his face is turned away; no subtitle is on air in W-RIVER.
- TX (kit `TREX`, AS-TREX-R2, full opacity, placement `amb #3f4a44`, `ambK max(L.k, 0.42)`, sun direction (0.55, 0.75, 0.6), slabs 4):
  - +0: hip TX-C0 (−2.7, 0, −13.75) inside the fern row FC, heading 0.33 rad, haze 0.3 (a dark mass behind fronds).
  - +4–+20: FC shakes (0.9); fronds part +10–+18 centred at x −0.4.
  - +6–+26: **one step out**: `stalk` phase 0 → 0.5 with the hip eased TX-C0 → **TX-C1 (−1.6, 0, −13.35)** (1.17 m, half a stride), head low (`drop 2.0`), neck yaw 0 → +0.25 toward G1; haze 0.3 → 0 over +6–+22. The legs stay behind FC (z −12.8) clumps; head, neck, chest, arms and thigh are clear.
  - +12: **first reveal** (LF16R15-SH16C-REVEAL): head and chest out of the fronds, a tree-fern trunk across the chest.
  - +26–+48: `sniff(t/48)` stance with neck yaw +0.25 plus its sway; sniffs peak at **+28 (f1440) and +40 (f1452)**: 0.15 m head lift, flared nostrils, a vapour puff from `nostril.L.pivot` toward G1, `vapourItem` scale **1.4 m** (R1.5a default 0.5).
  - Gaze: head direction 0.38 → 0.55 rad (world), off the head→Keng line 1.13–1.23 rad and off the head→lens line 1.02–1.14 rad (*probe*, +12/+28/+40). No reaction to Keng's drop: no pause in the sniff rhythm, no head jerk (RV-26c).
  - Jaw shut, no teeth shown (B-R15B-02); sun slice on brow and snout top only (B-R15B-05).
  - Screen (*probe* bbox → *measured* visible): +12 y 480–1169 (35.9 %) → visible y 494–1197, **703 px (36.6 %)**; +28 y 462–1178 (37.3 %) → visible **741 px (38.6 %)**, x 0–1078; +40 visible **748 px (39.0 %)**. Head (skull joint) ≈ (573, 720) → (669, 686); snout tip x ≈ 900–1010. The tail leaves frame left by design (the body is ≈ 1700–1830 px long at this lens). Luma 0.35 (animal) against 0.70 (same pixels without it).
- Sound: as 16CR5 with frames re-keyed: S16-40 fronds +4–+16 (f1416–1428); S16-38 footfall at +20 (f1432, *est*: Editor moves it to the visible front-foot plant of the step, half hidden in FC; R1.5a +10); S16-42 sniffs +28, +40 and the huffing exhale with the low rumble at +44 (f1440, f1452, f1456); pulse continues; no music. All RV-23a/RV-28b guards unchanged.
- Owner: Editor (camera, x0, staging, K actions); Boss (B-R15B-01..06); Ton (re-time).

**16DR5b. S01-B05-SH16D** [1460, 1504), 44 f. *Rebuilt R1.5b.* Behind the boulder: it steps out, then walks on.
- Camera: `cam: at (0.7, 0, −0.75), yaw −12→−9, r 2.7→2.5 m, eye 0.95, f 1300, hy 730, pitch 2°, cx 140`, linear over +0–+44 (RIV). Camera position (0.14, 0.95, 1.89) → (0.31, 0.95, 1.72), low on the near-bank shallows, south-west of Keng; the far bank is open to the left of B1.
- K at (0.7, −0.12, −0.75) (*est*: the bed is shallower at the boulder; waterline world y 0 at his hips), P35 front view, facing (0.25, 1), back to B1.
  - +0–+36: `scared` face, `clench` mouth (breath held), eyes wide, tremble 1 px at 6 Hz; eyes cut up toward the boulder top behind him at +6.
  - +36 (f1496): eyes close. +40 (f1500): `pant` exhale, shoulders drop 0.04 m (comic "phew", RV-23a). No hand over the mouth (RV-28a).
  - Screen (*probe*): head top (680, 999) → (680, 1009); waterline y ≈ 1250–1273; face ≈ y 1010–1150, above the caption band (y 1176) in every frame; B1 near top (689, 775): his head is below the boulder top as seen from the far bank.
- TX (placement as 16C, haze 0.12):
  - +0–+16: **full-body step out**: hip TX-C1 → **TX-D1 (−0.5, 0, −12.25)**, in front of FC on the open far bank (z −13..−8), heading 0.33 → 0.85, `stalk` phase 0.5 → 1.0, head low (`drop 2.0`, neck yaw −0.1). Front foot plants at **+14 (f1474)**. Legs, feet and body visible left of B1; only the tail tip leaves frame left (LF16R15-SH16D).
  - +16–+24: stands at TX-D1, head low toward G1 (`sniff` pose, yaw −0.15), one slow breath, no puff.
  - +24–+30: head lifts and turns away from the river into the forest (`turn(u, −0.15, −0.6)`): no wind, no frond sway and no sound before it (RV-25b).
  - +30–+44: **walks on into the forest**: `stalk` from phase 0, heading 0.85 → −0.45 eased over +30–+42, hip TX-D1 → **TX-D2 (0.05, 0, −12.6)**; the tail sweeps across the frame behind the boulder line. It is in FC by SH16 +6 (Editor continues the path off screen: heading −0.45 at 1.32 m/s).
  - Gaze: off the head→Keng and head→lens lines 1.01 rad (+14), 1.35 rad (+28), 2.19 rad (+40) (*probe*). It never faces Keng or the lens (RV-23a).
  - Screen (*probe* bbox → *measured* visible): +14 y 290–855 (29.5 %) → visible **590 px (30.7 %)**, x 6–922; +28 (head up) visible **738 px (38.4 %)**; +40 visible **571 px (29.7 %)**. No T. rex pixel in the caption band in 16D.
  - Safety distance (*probe*, [looks-r15/near.mts](looks-r15/near.mts), every 2nd frame of 16C/16D): the nearest point, the nostril at 16D +14, reaches z −8.49, over the far-bank earth strip and 0.5 m short of the water (z −8); 8.4 m from Keng. Its feet stay at z ≤ −11.5. It never enters the water.
- Sound: pulse soft peak +0–+20, thinning, **stops dead at +38 (f1498)**; S16-38 footfalls at **+14 (f1474, the step out, the loudest of 16D but ≥ 12 dB under V09, est), +34 (f1494, −4 dB), +42 (f1502, −8 dB)**; insects return one by one from +34 (f1494); S16-43a "phew" at +40 (f1500). No music.
- Owner: Editor (camera, staging, K, TX path); Boss (B-R15B-01..06); Ton (re-time).

**16R5 change (R1.5b).** +0–+10: the forest wall sways once **where the T. rex went in** (far bank x ≈ 0–2 m, z −13.5; screen position per `CAM16R`, Editor), not at screen-left. Everything else in 16R5 is unchanged.

### R1.5b look frames (Film, viewed)

`scripts/edu-series/ep16/looks-r15/` on one Chrome (`scripts/stills.mjs`), real RIV geometry, kit `beast-trex` `stalk`/`sniff`/`turn`, `river-r3` (B1, RD, FC, shade light), `trex-fx` vapour. Labelled frames and `-CLEAN` copies in `out/ep16/r15/looks/`:

| Look | Shot frame | Global | T. rex visible height | Notes |
| --- | --- | --- | --- | --- |
| LF16R15-SH16C-REVEAL | 16C +12 | 1424 | 703 px (36.6 %) | first reveal, head and chest out of the fronds |
| LF16R15-SH16C | 16C +28 | 1440 | 741 px (38.6 %) | biggest; first sniff and vapour; Keng about to drop |
| LF16R15-SH16C-K | 16C +40 | 1452 | 748 px (39.0 %) | second sniff; Keng crouched in front of B1 |
| LF16R15-SH16D | 16D +14 | 1474 | 590 px (30.7 %) | full-body step onto the bank; Keng's face clear |
| LF16R15-SH16D-TURN | 16D +28 | 1488 | 738 px (38.4 %) | head lifted, turning away |
| LF16R15-SH16D-OFF | 16D +40 | 1500 | 571 px (29.7 %) | walking on into the forest; Keng's exhale |

Caption zone (`scripts/caption-zone.py --band 1176:1344`, clean frames): mean luma 0.52–0.61, fails the outline-caption threshold (bright water), but no subtitle is on air in 16A–16D (W-RIVER). No T. rex feature in the band (16C: only its ground shadow, ≤ 3600 px; 16D: none). Keng's face above y 1176 in 16D.

Look-frame limits (not plan changes): no net prop, the pale waterline box (B-R15B-01), the lower-jaw stick (B-R15B-02), the texture mosaic (B-R15B-03), the round vapour (B-R15B-04), no sun slice (B-R15B-05).

### R1.5b Boss list

| ID | Problem seen in the R1.5b look frames | Fix asked | Acceptance |
| --- | --- | --- | --- |
| B-R15B-01 | Pale box around Keng's legs and B1's foot (also in Boss's `R3-16A-DAY` card). `waterlineItem(at, level)` draws the surface at world y = `level`; the R3 cards pass `kneeLevel('K')` (0.364) with K at y −0.1, which floats the surface 0.36 m above the river plane; even at level 0 the sheet and the surface ellipse read lighter than `paintRiver`'s shaded near-bank water | `water.ts` (N16-11 R2 waterline): sheet and ellipse colours sampled from the same fills `paintRiver` uses at that screen row, including the shade light and the near-bank shallows band; document `level` as world y and fix the R3 cards (K at y −depth, level 0) | no visible edge around Keng in LF16R15-SH16C and SH16D (luma step < 0.02 across the sheet border) |
| B-R15B-02 | Lower jaw reads as a pale stick past the snout tip with `jaw 0` in `sniff`/`stalk`/`turn` (`drop ≥ 1.6`): it reads as an open mouth | `beast-trex.ts`: shut jaw closes flush, lower-jaw tip behind the upper snout tip, belly colour only on the underside, never the brightest part of the head in shade | at 700 px creature height no gap between the jaws and no teeth visible |
| B-R15B-03 | Skin texture cells become 15–25 px squares at 700 px creature height (mosaic look) | texture cell size clamped in screen px (≈ 6–8 px) or blended at large `camUnit` | no visible square grid at f 2600 / 21 m |
| B-R15B-04 | The vapour puff reads as a white ball | `trex-fx.ts`: soft, elongated wisps drifting forward-up along the nostril line, opacity ≤ 0.6, at `scale` 1.4 m | reads as breath, not an object, at 270 px tile size |
| B-R15B-05 | No localized light: the "sun slice" cannot be drawn | a warm light band (≈ 0.6 m) on brow and snout top, sorted with the head (`BeastPlace` field or a `trex-fx` item); optional, value contrast already holds | slice on brow/snout top only, no teeth lit |
| B-R15B-06 | `stalk` → stand pops the feet (16C +26, 16D +16, +30); a heading change while walking (16D +30–+42) skates them | a settle blend that plants both feet as stride goes 0, and a turning walk (heading-rate input, the hip yaws while the planted foot stays) | feet stay planted through each blend; no skating in 16D +30–+44 |
| B-R15B-07 | AS-TREX-R2 measures ≈ 18.2 m snout to tail (snout x +6.0, tail end −12.2) against the "12 m" in its header | check the scale; if the length is unintended, shorten the torso/tail to ≈ 12–13 m at hip 3.6 m | Film re-probes 16C/16D (the tail then fits more of the frame) |

Kit poses used as they are: `stalk`, `sniff`, `turn` (no leaning or joint break seen in these frames; the legs read as a step in 16D +14).

### R1.5b Editor notes

- 16C: new camera and `paintRiver x0 −74`; K at y −0.3 with the waterline at world y 0; TX path TX-C0 → TX-C1 over +6–+26 with `stalk` 0 → 0.5, then `sniff`; vapour scale 1.4 from the nostril toward G1.
- 16D: new camera; K at y −0.12; TX path TX-C1 → TX-D1 (+0–+16), stand, lift/turn (+24–+30), walk on to TX-D2 (+30–+44), continued off screen in SH16.
- SH16: the wall sway where it went in (far bank x ≈ 0–2 m).
- Check the plate against these numbers (± 10 %) and the look frames; do not change the plan to match a defect.

### R1.5b Ton re-time

| Cue | R1.5a frames | R1.5b frames |
| --- | --- | --- |
| S16-38 footfall | 16B +4, +18; 16C +10; 16D +20, +32 (1394, 1408, 1426, 1484, 1496) | 16B +4, +16; 16C +20; 16D +14, +34, +42 (1394, 1406, 1432, 1474, 1494, 1502); SH22 +120 unchanged |
| S16-40 fronds | 16C +4–+16 (1420–1432) | 16C +4–+16 (1416–1428) |
| S16-42 sniffs + exhale | 1444, 1456, 1460 | 1440, 1452, 1456 |
| S16-41 pulse | 1390 → stop 1498 | unchanged (16D +38) |
| S16-43a phew | 1500 | unchanged (16D +40) |

Sound descriptions are unchanged; the 16D step-out footfall at f1474 is the heaviest of the three but stays a felt thud, not a hit (RV-23a).

### R1.5b Boat recheck

Boat rechecks before Editor integrates 16C/16D: the T. rex is now large and close in the frame (telephoto), though it never leaves the far bank. Points to check: the snout now reaches 0.5 m from the far waterline at 16D +14 (R1.5a: 2.6 m), RV-23a (no teeth close-up, jaw shut, never looks at Keng or the lens), RV-25b (walk-on has no visible cause), RV-26c (no reaction to the hide), and whether the bigger animal still reads family-safe at phone size.

## Acceptance (timed checks for review and integration)

- **R1.5b (supersedes the R1.5 16B/16C/16D lines below where they differ):**
  - 16B: rings on f1394/f1406; 22 f.
  - 16C: the T. rex visible height ≥ 35 % of the frame (672 px) from f1430 (+18) to the end of the shot (look frames 38.6–39.0 %); body level (back line within ±15° of horizontal), in near profile to screen-right; luma of the animal ≤ 0.45 against ≥ 0.65 behind it; head ≤ 45 % of frame width; jaw shut, no teeth visible; legs behind FC; it stays on the far bank; head direction ≥ 0.99 rad off the head→lens and head→Keng lines; vapour visible at both sniffs (f1440, f1452).
  - 16D: full body (legs and feet) visible left of B1 at f1474 (+14), ≥ 28 % of frame height; Keng's face above y 1176 and below the B1 top line as seen from the far bank; it walks on into the forest from f1490 with no visible cause; feet planted (no skating); snout never past z −8.4; footfalls f1474/f1494/f1502.
  - SH16: the forest wall sways where it went in.
  - Every R1.5b plate matches the R1.5b look frames' framing (± 10 % on the measured heights).

- **R1.5:**
  - SH15: LN-F stops chewing at f1331 and its head turns toward screen-left by f1347; no villager looks at it.
  - 16A: the silence drop at f1366 is audible as a cut, not a fade, and the flock is out of frame by f1384, never in the mark area.
  - 16B: rings start on the thud frames f1394/f1408 around every water-contact point; the fish hangs still from f1398.
  - 16A (R1.5a): Y and V1 seen entering the reeds inside frame left by f1390, V2 out of frame right by f1390, K still standing at f1389; no villager runs at full stride.
  - 16C: the T. rex head clears the ferns f1426–1440 with the legs hidden by FC in every frame; it stays on the far bank (z ≤ −10.6); one sun slice on the snout; K's head is below the boulder top line by f1452 (R1.5a; R1.5 f1458) and never under the water; the T. rex head yaw stays ≥ 0.3 rad off the TX→K line and its sniff rhythm runs on unchanged through f1444–1452 (K's drop: no head jerk, no turn toward the boulder).
  - 16D: K's face is above y 1160, `clench` mouth to +32, no hand over his mouth; the T. rex head holds at low reach f1464–1472, lifts by f1478, turns away by f1486 (R1.5a; R1.5 by +20), never faces the lens; footfalls f1484/f1496; the pulse stops at f1498; exhale at f1500.
  - SH16: grab contact f1532; V09 f1540–1592; pterosaur body on screen ≥ 100 f.
  - SH22: no sky tilt, no T. rex, no text; pulse cycles f2029/f2037, silent by f2045 (R1.5a); the hen's foot plant at f2049 above y 1160 with the thud and a visible dust puff; the print ≥ 80 px from f2055; no T. rex pose on the hen; E-TAG f2065; last frame f2099.
  - No jump-scare stinger; no roar anywhere in EP16; no figure is touched by the predator; no on-screen or spoken text about hiding, smell, night-only predators or descent (RV-24a, RV-25a, RV-26a, RV-27d).
  - Total 2100 f.

- Shot 1 +0: the sky ripple already moving in the first frame (UT01); white frame at f86–91; the cut to morning lands inside the white at f92.
- Shot 6 +45: slap contact on V03 voice onset (f488), the hand pair above y 1160.
- Shot 8: the long-neck head reaches C2 by +40 and stays above y 1160 while chewing; its body never appears.
- Shot 12 (R1.3): seven sky day/night cycles, smooth ramps, ending in day; the paddy reads gold by f1120 (R1.4; R1.3 f1064). (R1.1 page flips superseded.)
- Shot 15: the camera arrives on the bowl at f1319 ("กินข้าวกับอะไร"; R1.3 f1263). R1.4: LN-F in frame at +0 (≥ 300 px tall) and nobody in frame looks at it.
- Shot 16 (R1.4): snatch contact at f1394 (+44; pterosaur feet on the fish at the net rim); V09 f1402–1454 after the snatch; pterosaur on screen +0–+150 (identifiable body ≥ 100 f), gulp at +120, villager lean ≤ 8°, K's face above y 1160. (R1.3: f1308, on screen +6–+81.)
- R1.3 creature shots: each creature reads as a volume (lit side, shade side, ground shadow; UT16) at the proj sizes in its block; no creature hidden by nearer foliage it should stand in front of; shot 8 pointing arm within 10° of the K-shoulder→head line; shot 10 cone visibly in the jaws by +46; shot 12 no frame-to-frame luminance jump above 15 % outside a dawn/dusk segment.
- Shot 20: hen head-tilt on "แต่ไดโนเสาร์…" f1694; the three-toed foot plant readable (≥ 60 px) at f1726 (R1.3 f1569/f1601).
- Shot 22 (R1.4): one cluck at f1886; the T. rex apparition at opacity 0.45–0.55 (sky and far clouds visible through it), face and upper half only above an opaque bank, no hen morph or mirrored pose (RV-22a); roar f1927–1955; "Remember who you are" f1937–1975 in the edu caption stroke inside y 1176–1344, legible (contrast on the sky) and alone in the band; E-TAG from f1971; last frame f2008. Y's head attached in every frame. (R1.3: cluck f1761, end f1838/f1883.)
- Shot 11 (R1.4): the ankylosaur reads as a volume above y 1160 (probe x 462–873 at +40); splashes under the body at each front-foot plant; mud drops on K at +72; no triceratops anywhere in EP16.
- Shot 21 (R1.4): K, Y and the hens unoccluded at +54; LN-G head above the tree ferns by +40.
- Every shot: lead/hero heights as in the proj lines (± 10 %) on the plate; caption-zone check on clean frames.

## New assets for Boss

| ID | Need | Kind | Shots | Status |
| --- | --- | --- | --- | --- |
| N16-01 | `new: isan-home` outfit set (pha sin, blouse, pha khao ma; men: shirt + pha khao ma; colour variants) | WARDROBE (look-defining) | all EP16-18 | missing; Film still for user approval first |
| N16-02 | `new: kid-home` outfit (tee, shorts, flip-flops) | WARDROBE | all | missing |
| N16-03 | `new: Thai backyard hen` + motions peck, trot, head-tilt, huddle, cluck pose | ANIMALS (look-defining) | 16: 2,18–22; 17: 5,20; 18: 20,22 | missing; Film still for user approval first |
| N16-04 | SET-VIL Isan village: stilt house (floor y 2.4, ladder, veranda), under-house kitchen shelf + jars (K02), coop, granary (floor y 0.6), fence + gate, paddy, neighbours' roofs, calendar post | set plan (Boss builds as a shared painted set module) | all three | missing |
| N16-05 | SET-MESO-FOREST: tree ferns, cycads (one with orange seed cluster), 30 m conifers, no flowers | set layers (shared) | 16: 2–10,19,21; 17; 18 | missing (C61 annotation) |
| N16-06 | `new: long-neck head/neck` + munch cycle (CR-SAUROPOD) | creature (look-defining) | 16: 8,10 | missing; Film still first |
| N16-07 | `new: pterosaur swoop` (one pass, feet grab, shadow) | creature | 16: 16 | missing |
| N16-08 | S-WORM sky ripple + white bloom (ENV-SKY band warp) | ENV layer (new) | all shot 1 | missing |
| N16-09 | Flower-pop insert card (mango, banana, chilli, morning glory + flowers) | screen card | 16: 4–5 | missing |
| N16-10 | Props: basket, hoe, knife, sack, seed sack with rice mark, coconut scoop, rice bowl, hand net, fish, fish on sticks, ก้อย bowl, calendar (no text), eggs in apron | props | 16 | missing (none in the kit rig props) |
| N16-11 | SET-RIVER shallow clear river (pebbles visible), banks, nets | set (shared) | 16: 16; 17: 9–11,16–17; 18: 3 | missing |
| N16-12 | ENV-FIRE: promote the zcpaint balcony flame to a kit layer (fire + smoke + sparks) | ENV layer (promotion) | 16: 17; 17: 12,14,18–23 | exists-unintegrated (episode code `src/painted/zcpaint/balcony.ts`) |
| N16-13 | Poses: `new: mime-stir`, `new: rub-hand`, `new: arms-wide ta-da` | poses | 16: 7,9,13 | missing |

## Sound needs for Ton

| Code | Sound (source, action, material, space, length, feel) | Shots (shot-local frame) | Library candidate |
| --- | --- | --- | --- |
| S-WORM | Wormhole: low swelling hum with a watery warble rising for 2.9 s, then a soft bright whoosh into white (0.3 s); wonder, not threat | 16/17/18 sh1 +0, peak +86 | NEEDS-GEN (shared) |
| M16 | Music: Isan-flavoured cheeky bed, phin plucks + pong lang mallets + soft hand percussion, ≈ 100 bpm; morning pickup, comic stops, night variant | sh2–21 | NEEDS-GEN; fallback `bed_comic-pizz-marimba-pulse_01` |
| E-TAG | Series ending tag: three descending pong lang notes and a soft khaen chord, 2 s ring-out; warm, done | sh22 +100 | NEEDS-GEN (shared with EP18) |
| A-VN / A-VM / A-FE / A-RV / A-FI | Ambiences: village night, village morning (dinosaur world), forest edge, river, evening fire | as listed | A-VN candidate `nature_night-crickets_01` (has an owl: Ton checks); others NEEDS-GEN |
| S16-01 | Flip-flop run patter on packed dirt, 2 s, light, comic | sh2 +5 | NEEDS-GEN |
| S16-02 | Three hens flap and squawk aside, 0.8 s, comic | sh2 +30 | NEEDS-GEN |
| S16-03 / S16-05 | Frond push swish (0.5 s); four reverse-shimmer flower fades (0.3 s each) | sh3 +2; sh5 +34..+52 | NEEDS-GEN |
| S16-04 | Four soft wooden ticks with a bloom (pong lang on bamboo, 0.2 s) | sh4 +6,+24,+42,+60 | candidate `ui_pop_01` |
| S16-06 / S16-07 | Slap on the back of a small hand (dry, comic, 0.15 s); seeds patter on leaf litter (0.4 s) | sh6 +45, +50; sh10 +30 | NEEDS-GEN |
| S16-08 / S16-09 | Long-neck: slow wet leaf crunch and chewing loop; one huge soft breath out (1 s) | sh8 +40.., +100; sh10 +45 | NEEDS-GEN |
| S16-10..S16-17 | Seeds rattle in palm; toss whoosh; hoe thunk in mud; calendar page rips ×6; teak door creak; string on burlap; sack thud on shelf; rice from a coconut shell | sh9–14 | page rips candidate `whoosh_page-flip-paper_01`; others NEEDS-GEN |
| S16-18..S16-20 | Net splash; big leathery wing rush close→far (no call); villagers' warm laugh | sh16 +2, +8, +45 | wing candidate `action_bird-pass-low_01` (likely too small) |
| S16-21 / S16-22 | Fish skin sizzle loop; clay bowl slid on a mat | sh17 | NEEDS-GEN |
| S16-23..S16-26 | Hens clucking contentedly; eggs clink in an apron; hen throat trill; claw scratch | sh18–20 | NEEDS-GEN |
| V06 | One hen "กุ๊ก" answering a boy, round and clear, 0.6 s | sh22 +81 | NEEDS-GEN |

## Dependencies and open items

- Look frames (W3) for LF-VIL-NIGHT, LF-VIL-MORN, LF-EDGE, LF-RIVER, LF-FIRE; the new looks N16-01, N16-03, N16-06 need the user's approval stills before Boss builds (look-asset rule).
- Ear checks pending (voice-take R2.2/R2.3): V10, V08, V03 and the R2.1-flagged takes; timing does not change if they pass.
- Script Q4 (keep V10): kept, as the user-locked R2.2 + R2.3 V10 take implies. Script Q3 (cast): proposed above, needs the user.
- Staging deviation VD16-06 (shot 10): seeds tossed deeper into the forest, not "back over the fence" (they are outside it).
- K02 in EP16 is a 14 px plant in shot 17 (script: background, EP16 does not depend on it).
- Shot 4 flower pops and shot 19/20 split use syllable estimates where no pause was measured.
- R1.5a: Boat recheck done (RV-23..RV-28, no must-fix; guards applied). New Ton cue S16-45; S16-42 now NEEDS-GEN. RV-28c is an EP17 brief item (coordinator). Villager scramble is a proposed Editor-keyed motion on P35 (no kit motion).
- R1.5: ~~Boat recheck of 16A–16D, 16 and 22~~ (done R1.5a); user forks R15-Q1..Q3 (rows Q8–Q10); look frames LF16R15-SH16C/16D (next Film pass); N16-22 R3 T. rex motions missing; N16-11 R3 impulse rings proposed; Preaw: the W-RIVER picture cue in script.md (R2.2 shot-cue column) no longer describes the full sequence (no Thai words change; Preaw decides whether to note it). R1.4 dependencies on the apparition, the English line, N16-23 and true layer opacity are void. Q4 still open.
- R1.4: rows Q4 (feathered small dinosaur in shot 19) still open; Q5 dropped; rows Q7 asks the user to approve the R1.4 look frames (look-asset rule: the T. rex apparition is a new look). Boat recheck of SH22 (opacity T. rex + the English line). N16-23: whether the runtime has a non-subtitle text item in the caption look is unknown (Editor checks). N16-22 R2 needs true layer opacity (Film's stills could not composite two BrushCanvas layers). Triceratops deferred (N16-14).

## Change log

- 2026-11-14 R1 (Film): first timed scene sheet from the locked voice (EP16 narration R2.2 (`ep16_narration_kore_x1.05.b56a7013.wav`, 42.37 s, keeps "ไม่เอานะ", user 14 Nov 2026) + R2.2 character takes + V10 from R2.3 (Leda, 2.52 s)); 22 shots, 1839 f. Brief and sheet written in one invocation by the coordinator's assignment (AI04 exception noted in the handoff).
- 2026-11-14 R1.1 (Film, user verdicts on W3 look frames 14 Nov 2026): shots 1–2 camera to the paddy framing (`CAM16_1/2`, yaw 62→59→40, f 820) with re-probed proj; shot 8 camera r 8.3→7.6, f 1000, hy 880 (lead Y 475→595 px), C2 to (5.9, 0, −18.4), long-neck head card x1.3; the east-yard work corner (brief set plan) appears in every VIL shot. Proj numbers are a Film probe of the look-frame cameras (scratch `probe.mts`), not a plate render.
- 2026-11-14 R1.3 (Film; owner of this file: Film, AI08): user draft-round-1 verdicts (fixlist.md, 15 shots) and the whole-episode brief "dinosaurs as visible heroes"; added the R1.3 revision section (shots 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 20, 22), Boss rows N16-06 R2, N16-07 R2, N16-14..N16-22, N16-03/04/09/11 R2, Editor notes, Ton cues S16-27..S16-36 (S16-07 redefined, S16-12 replaced); acceptance lines for shots 12, 16, 22 and creature shots; cloud T. rex gag (coordinator request 14 Nov) judged fit with change, pending Q6. Superseded: shot 7 camera yaw 70→78, shot 12 calendar page flips, shot 13 interior camera, shot 16 camera at (1.5, 1.2, 0.4) and K at R1, shot 22 Y cropped. Global timing unchanged (1839 f); stretch variants pending Q1/Q6. Rows EDU-EP16-ROWS-R1.3.
- 2026-11-14 R1.4 (Film; owner of this file: Film, AI08): user answers to rows R1.3 Q1–Q6 (coordinator relay 14 Nov). Q1 stretch applied (SH10 +20, SH11 +36, SH16 +69) and Q6 +45 at SH22: durationFrames 1839→2009; shot map, voice table (Editor placement column), word pegs and acceptance recomputed. Q2 triceratops removed from EP16 (SH11 ankylosaur hero, SH15/SH21 long-neck; N16-14 deferred, files kept). Q3 dinosaurs added in SH15 and SH21 (SH21 camera yaw 10→22 → −10→−24 so the coop no longer hides the family). Q6 T. rex drawn as a normal volume animal at opacity 0.5, rising from a cloud bank, with the line "Remember who you are" in the edu caption stroke (N16-22 R2, N16-23). Boat guards RV-10a/b and RV-22a applied. Ton re-time list added. Q4 open, Q5 dropped. Superseded: R1.3 1839 f timing, 11R triceratops, R1.3 cumulus T. rex and its no-text rule, R1.1 SH21 yaw 10→22. Casting rows for the R1.3/R1.4 creatures added. Rows EDU-EP16-ROWS-R1.4; look frames `out/ep16/r14/looks/v4/`.
- 2026-11-14 R1.5 (Film; owner of this file: Film, AI08): user direction relayed by the coordinator (14 Nov): the "Remember who you are" sky gag, its on-screen line and the T. rex apparition are dropped; a light-horror suspense beat is added. Shots 16A–16D (river: silence drop, footfall rings, T. rex sniffing from the far-bank ferns, near miss behind boulder B1) inserted before SH16; SH16 re-timed 150→120 f (relief opening, no high circle); SH15 long-neck alert added; SH22 new ending (camera drops to hen height, the river pulse and footfall on the hen, three-toed print, E-TAG f2065). durationFrames 2009→2100 (70.00 s); L09+ shift +124, V09 file f1535. Boss N16-22 R3 (T. rex stalk/sniff/turn), N16-11 R3, N16-03 R3; N16-23 cancelled; Ton S16-37..S16-44 new, S16-35/S16-36 R2 cancelled, re-time list. Boat recheck required; user forks R15-Q1..Q3 with Film's recommendation applied. Superseded: 15R4 end, 16R4, 22R4 gag/text, R1.4 2009 f timing. Rows EDU-EP16-ROWS-R1.5.
- 2026-11-14 R1.5a (Film; owner of this file: Film, AI08): Boat's R1.5 visual check (research-r2.md, RV-23..RV-28, no must-fix) applied with minimal edits; no Thai word, voice or shot boundary change; 2100 f unchanged. Record fix RV-24 (D15-04, Boat-recheck item (a), R1.4 shot-22 note: "one daylight predator beat", firelight-only is a design rule, not science). RV-26c/d resolved: 16A villagers' panic scatter into reed bed RD (+28–+40), 16C Keng look-round and panic drop (+22–+36, head below B1 by f1452), the T. rex aimed at the water (G1) and not reacting, 16D head hold +0–+8, lift/turn/walk moved later (walk end corrected to (−2.5, 0, −13.15)), footfalls f1484/f1496. SH22 pulse +100/+108 (done by +116), RV-27a–d guards. Ton: S16-42 NEEDS-GEN deeper voice (RV-28b), S16-38 labelled invented foley, S16-43a comic exhale, new S16-45 hushed scramble. New subsection R1.5a, acceptance updated. Rows EDU-EP16-ROWS-R1.5a.
- 2026-11-14 R1.5b (Film; owner of this file: Film, AI08): user verdict "the T. rex is not clearly visible" (coordinator relay 14 Nov, on Boss's R3 sheets). 16C rebuilt as a long-lens OTS with the T. rex as main subject (visible 38.6–39.0 % frame height, luma 0.35 vs 0.70), 16D gives it a full-body step onto the far bank and a walk on into the forest (upstream turn dropped); G1 moved to (9.0, 0, −8.0); 16B 26→22 f, 16D 40→44 f, 2100 f unchanged; Ton re-time table; Boss fixes B-R15B-01..07; look frames LF16R15-* made and viewed; Boat recheck R1.5b required. Shot map rows, key frames, acceptance updated.
