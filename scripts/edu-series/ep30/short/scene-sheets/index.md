# E30-C01-S01 — timed scene-sheet index (EDU-EP30-SHORT)

Deliverable: `EDU-EP30-SHORT` · Revision: **`EDU-EP30-SCENE-R2.2`** (R2 + TF35–TF49 amendment lines, TICKETS-R9, + TF50–TF70 amendment lines and a TF01–TF34 pointer line in b01–b07, [TICKETS-R11](../../tickets/index.md); sheets now match the built and accepted plates) · Status: **ready-for-dev** · Timing: **checked-with-audio** (measured on the voice-lock files; no blockout yet)
Inputs: script [EDU-EP30-SCRIPT-R2.2](../script.md) (user-approved W1.11; [R2.2 changes](../script.md#r22-changes), [R2/R2.1 changes](../script.md#r21-changes)) + fact-check [EDU-EP30-FACTCHECK-R1/-R2/-R3](../fact-check.md) (no must-fix; R3 conditions on L07, L15, PB01 honoured below) · voice lock [EDU-EP30-VOICE-R2.2](../voice-lock.md#voice-r22) (user-approved W4.3; 65.90 s; store `projects/edu/EDU/narration/ep30-voice-r2-2/`, `anchors-R2.2.txt`) · Film brief [EDU-EP30-BRIEF-R3](../film-brief.md#r3-changes) (VD30-01–VD30-13; look lock W3.2 kept: LF01a, LF02 R4, LF03, KP-EMU) · storyboard [EDU-EP30-BOARD-R3](../storyboard.md) / rows `EDU-EP30-ROWS-R7` · delivery record [../../delivery.md](../../delivery.md)
Target: branch `claude/ep30-continuation-493a12` at `df8a7fc` plus the look assets in `src/painted/edu30/` · **30 fps** · **durationFrames 1977** (65.90 s) · 1080 × 1920 · composition offset 0 (one story scene = the whole Short)
Evidence: runtime unverified (no plate, no blockout) · render/samples none · audio sync: every frame below measured from VOICE-R2.2 (`anchors-R2.2.txt`, [vo-anchors.py](../vo-anchors.py): 10 ms envelope, speech > 1500) plus, where marked, the SCENE-R1 Whisper/envelope anchors shifted by the exact file offset (the line file is a byte copy of the R1 cut) or a per-frame RMS segment read of the take D lines (L16, L17: marked `est`, no Whisper in this checkout) · projection: [projection-run.py](../projection-run.py) on [projection-shots.json](../projection-shots.json), all 28 shots, output `out/logs/ep30-projection-r2.txt` · user approval: script R2.2, voice R2.2 and the looks approved; this timed revision not yet reviewed (review page: pending)

Shot sheets: [b01.md](b01.md) (B01, 3 shots) · [b02.md](b02.md) (B02, 5) · [b03.md](b03.md) (B03, 4) · [b04.md](b04.md) (B04, 6) · [b05.md](b05.md) (B05, 4) · [b06.md](b06.md) (B06, 4) · [b07.md](b07.md) (B07, 2). User rows: [../review-rows.json](../review-rows.json) `EDU-EP30-ROWS-R7` (timed).

## Units and conventions

- **Clocks.** Composition-global = scene-local (offset 0). Shot-local = global − shot start. Ranges are half-open `[start, endExclusive)`. Frame of a time t = `int(t × 30 + 0.5)`.
- **Spaces** (brief: [set plans](../film-brief.md#set-plans-metres-estimates)): **P** paddock (origin ground at G1 tripod centre, north = −z, east = +x), **D** farm dam (origin outer foot of the south bank, north = −z; R4 marks in [lf02-r4](../film-brief.md#lf02-r4)), **A** arms wall (origin wall foot under the emblem centre, wall plane z 0 facing +z), **T** truck-local (B05: space P axes translated to the truck's ground centre; the truck drives toward +x on the track centre line z 9.5). Metres, +y up, +z toward the master camera.
- **Camera lines** use the kit `YCam` (`src/painted/kit/ycam.ts`): `eye (x, y, z)` m, `yaw` deg (0 looks −z, + toward +x; 180 looks +z), `pitch` deg (+ up), `f` px at 1080 × 1920, `hy` principal row. A move interpolates every field linearly with ease-in-out unless the shot says otherwise. Camera transforms are owned by the plate (`YCam` per frame); picture-stage transforms (newsreel weave, VD30-11 shake) are owned by the plate's screen-space overlay and never move captions, the mark, the label or titles ([DF-20261030-painted-screen-layers-overlay](../../../../../docs/dev-findings.md#df-20261030-painted-screen-layers-overlay)).
- **Screen space**: px, origin top-left, Y down. Caption band (two lines) y 1150–1344; faces, gun actions, emu wing gestures and the relief emu head stay above y 1100 (brief: projection contract). Exception (R2.1, TF44): the B06-SH02 bow head may enter the band (no caption in that shot).
- **Caption-zone check (R2.1, TF46).** EP30 plates measure `scripts/caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99` (B02-SH01 local 0–56: `--max-mean 0.92`; shots without captions N/A). Reason: the captions are white fill with the edu dark stroke, which carries contrast on bright sand and sandstone; the script default (0.25 / 0.40) suits unstroked outline captions on dark interiors. The check catches a blown-out band (halation, flash, white sky) under a caption; the Editor confirms legibility shot by shot in the draft cut (W5.3).
- **Sizes** (brief: [technical handoff](../film-brief.md#technical-handoff)): men 1.70 m (`man-elder` 1.64), seated gunner hat top 1.20 m, kneeling 1.25 m, emu 1.70 m standing / 1.5 m running / back 1.05 m, wing span folded-out about 0.9 m per side from the body centre (estimate), Lewis gun 1.28 m, truck 5.2 × 2.0 m, cab roof 2.1 m, tray deck 1.1 m. Lead px are the projection tool's feet-to-head spans at these sizes (point model); a painted measure, where one exists, is quoted beside it and wins.
- **Clocks for motion**: flock walk/peck/run phases, wheat sway and water ripples on the ambient clock; story events (head turns, nods, wing flicks, the watch check, foot taps, the bow, burst rounds, scatter, jam, time-lapse) on the story (shot) clock ([DF-20261030-painted-story-hold-ambient-clock](../../../../../docs/dev-findings.md#df-20261030-painted-story-hold-ambient-clock)).
- **Casting lines** follow [storyboard: cast and continuity](../storyboard.md#cast-and-continuity); shot blocks name only the pose and expression per shot.
- **Mime beats** (L07, PB01, L15; script R2.2, brief VD30-12): no voice, no caption, no on-screen word, arrow, watch, clock, date or tally; the picture and the sound carry them.
- **Speaking characters** (brief VD30-13): MEREDITH (L22) and the GUNNER (L23) speak in frame or just off it with a `talk` mouth; the EMU (L19, L21) opens its beak on voiced onsets (`new: emu-beak-talk`). Nobody gets a name, rank or speaker label on screen.
- **Chrome** on every frame 0–1976: `@TamMaiLa` top-left and the label "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง" under it, outside the newsreel layer (VD30-10). Not repeated in the shot blocks.

## Voice anchors (measured, VOICE-R2.2)

All values global frames. `env` = envelope edge (±1 f); `R1+Δ` = SCENE-R1 anchor shifted by the exact file offset of the byte-identical cut (±1 f); `±3` = Whisper word time from SCENE-R1, shifted; `est` = per-frame RMS segment read of a take D line (±3–4 f; Editor ear-checks at the draft, O12).

| Line | Speech [on, off) | Anchors used by the sheets |
| --- | --- | --- |
| L01 NARR | [2, 178) | unchanged from SCENE-R1: "ปืนกล" 47 · "นกอีมู" 70 · pause 86–93 · "ถอนทัพ" 106 · pause 117–125 · "ไม่ใช่" 125 · pause 146–152 · "สอง" 152 · "รอบ" 167 |
| L02 NARR | [206, 351) | unchanged: "ปี" 206 · pause 295–300 · "บุฟเฟต์" 335 ±3 |
| L03 FARMER | [358, 431) | unchanged: phrase 1 [358, 394) · "เรียก" 402 env |
| L04 NARR | [450, 588) | unchanged: "เต็มกำลัง" 473 · pause 490–496 · "แมเจอร์เมเรดิธ" 496 · "ทหารอีกสองนาย" 527 · "ปืนกลสองกระบอก" 560 |
| L19 EMU | [597, 667) | "สาม" 599 · "คน" 609 · "เหรอ" 615 est · pause 619–642 · "เรามีสองหมื่นนะ" 642 (onsets 643, 652) |
| L22 MEREDITH | [673, 683) | "ยิง!" 673 (syllable peak 677) |
| L06 NARR | [704, 806) | "แผนแรก" 704 · pause 719–728 · "ยิงใส่ฝูง" 728/729 (R1+Δ 729) · **"…" E = 756** env (pause 756–760) · "นกแตกฝูง" 760 |
| L07 EMU (mime) | slot [815, 860) silent | wing 1 815, wing 2 831 (sheet design) |
| L09 NARR | [875, 985) | pause 917–927 · "นกเป็นพัน" 927 · "เหมือนต่อคิว" 957 · "ต่อคิว" 965 ±3 |
| L10 NARR | [1003, 1055) | **"ยิง" F = 1003** env · **"…" E = 1035** env (pause 1035–1040) · "ปืนกล" 1040 · "ติด" 1052 (R1+Δ) |
| L23 GUNNER | [1069, 1125) | "โธ่เอ๊ย…" 1069–1091 (onsets 1069, 1080) · pause 1091–1093 · "ติด" 1093 est · pause 1096–1099 · "ตอนนี้เนี่ยนะ!" 1099–1125 |
| PB01 (mime) | window [1052, 1150), emu on screen [1086, 1150) | wing up 1094–1102 · taps 1126, 1133, 1140 (sheet design, inside the L23 → L12 gap [1125, 1143)) |
| L12 NARR | [1143, 1282) | "แผนสาม" 1143 · pause 1203–1212 · "รถตามไม่ทัน" 1212 · "ทางกระเด้ง" 1242 · "เล็งไม่ได้" 1263 ±3 |
| L13 NARR | [1301, 1380) | "รัฐมนตรี" 1330 · "ถอนทัพ" 1350 ±3 · pause 1359–1363 · "รอบที่หนึ่ง" 1363 |
| L21 EMU | [1393, 1424) | onset 1394 |
| L14 NARR | [1441, 1542) | pause 1473–1480 · "นกพวกนี้" 1480 · "รถ" 1526 · "ถัง" 1530 (R1+Δ) |
| L15 EMU (mime) | slot [1549, 1576) silent | bow bottom 1563 (sheet design) |
| L16 NARR | [1583, 1733) | take D: "กลับมา" 1607 est · "ภาคสอง" 1619 est · pause 1634–1639 · "ลากยาว" 1639 · "ธันวา…" ends 1674 · pause 1674–1681 · "แล้วก็ถอนอีก" 1681 · pause 1705–1715 · "รอบที่สอง" 1715 |
| L17 NARR | [1741, 1849) | take D: "ส่วนนกอีมู" 1741 · pause 1761–1768 · "อยู่บน…" 1768 · pause 1818–1821 · "มาตั้งแต่ปี" 1821 · year ≈ 1832–1849 est (the whole year is inside L17) |
| L18 NARR | [1857, 1916) | "วันนี้" 1857 · pause 1884–1889 · "ไม่เคยถอยสักรอบ" 1889 · hold [1916, 1977) |

**VD30-11 round frames** (brief [gunfire beats](../film-brief.md#vd30-11)): one round every **3 frames** (600 rounds/min). **B03-SH01: 23 rounds at global 690, 693 … 756** (from the order to L06's "…", SD13; 2.2 s). **B04-SH03: 11 rounds at global 1003, 1006 … 1033**, everything still from E = 1035 (1.0 s, as SCENE-R1). VD30-11 adds no run time.

## Shot map

The per-shot frame table, in play order. Claims follow the brief's [visual progression](../film-brief.md#visual-progression) and the [R3 delta](../film-brief.md#r3-changes).

| Shot | Beat / VO | Global [start, endExclusive) | Frames (s) | Claims / clues | vs SCENE-R1 | Runtime mapping |
| --- | --- | --- | ---: | --- | --- | --- |
| B01-SH01 | B01 / L01a | [0, 90) | 90 (3.00) | F001, F002 | same | planned: `src/painted/edu30/` plate per shot (Editor names the composition) |
| B01-SH02 | B01 / L01b | [90, 149) | 59 (1.97) | F001, CL02 | same | planned |
| B01-SH03 | B01 / L01c | [149, 200) | 51 (1.70) | CL02 plant | same | planned |
| B02-SH01 | B02 / L02 | [200, 355) | 155 (5.17) | F001 year, F003, F004 | same | planned |
| B02-SH02 | B02 / L03 | [355, 440) | 85 (2.83) | — | same | planned |
| B02-SH03 | B02 / L04a | [440, 494) | 54 (1.80) | F002 | same | planned |
| B02-SH04 | B02 / L04b | [494, 592) | 98 (3.27) | F002 | tail −12 f | planned |
| B02-SH06 | B02 / L19 | [592, 667) | 75 (2.50) | CL03 | **new** (replaces retired SH05) | planned |
| B03-SH05 | B03 / L22 | [667, 688) | 21 (0.70) | F002, F007 (act) | **new** | planned |
| B03-SH01 | B03 / L06a | [688, 760) | 72 (2.40) | F007 | re-timed, burst from the order (SD13) | planned |
| B03-SH02 | B03 / L06b | [760, 811) | 51 (1.70) | F007 | re-timed +33 | planned |
| B03-SH03 | B03 / L07 mime | [811, 868) | 57 (1.90) | — | **re-staged** (mime, SD17) | planned |
| B04-SH01 | B04 / L09a | [868, 924) | 56 (1.87) | F005 | re-timed −44 | planned |
| B04-SH02 | B04 / L09b | [924, 993) | 69 (2.30) | F005 | re-timed −44 | planned |
| B04-SH03 | B04 / L10a | [993, 1040) | 47 (1.57) | F005 | re-timed −44 | planned |
| B04-SH04 | B04 / L10b | [1040, 1062) | 22 (0.73) | F005 | re-timed, −2 f | planned |
| B04-SH06 | B04 / L23a | [1062, 1086) | 24 (0.80) | F005 (reaction) | **new** | planned |
| B04-SH05 | B04 / L23b + PB01 + L12 head | [1086, 1150) | 64 (2.13) | — | **re-staged** (PB01, SD14) | planned |
| B05-SH01 | B05 / L12a | [1150, 1210) | 60 (2.00) | F006 | re-timed, −16 f | planned |
| B05-SH02 | B05 / L12b | [1210, 1294) | 84 (2.80) | F006 | re-timed −52 | planned |
| B05-SH03 | B05 / L13 | [1294, 1388) | 94 (3.13) | F001, F011, CL02 | re-timed, −10 f, flap removed (SD16) | planned |
| B05-SH04 | B05 / L21 | [1388, 1434) | 46 (1.53) | CL04 plant | **new** | planned |
| B06-SH01 | B06 / L14 | [1434, 1544) | 110 (3.67) | F010 | re-timed −16 | planned |
| B06-SH02 | B06 / L15 mime | [1544, 1580) | 36 (1.20) | — | **mime** (bow kept, voice gone) | planned |
| B06-SH03 | B06 / L16a | [1580, 1679) | 99 (3.30) | F001, CL04 payoff | re-timed (take D) | planned |
| B06-SH04 | B06 / L16b | [1679, 1737) | 58 (1.93) | F001, CL02 | re-timed, flap → wave (SD16) | planned |
| B07-SH01 | B07 / L17 | [1737, 1855) | 118 (3.93) | F013 (1908) | re-timed (take D) | planned |
| B07-SH02 | B07 / L18 + hold | [1855, 1977) | 122 (4.07) | CL02 payoff | re-timed | planned |

**Total:** 28 shots, contiguous, **1977 frames = 65.90 s** = the voice-lock preview (`preview.wav` 65.904 s). Retired: B02-SH05 (L05), B03-SH04 (L08) — IDs never reused. Longest shots: B02-SH01 (crane, 5.17 s), B07-SH02 (ending + 2.0 s hold), B07-SH01 (crane reveal); every shot of 3 s or longer moves its camera ([retention camera](../../../../../docs/cinematography-principles.md#retention-camera)). Projection: every changed or new shot re-run (log above); unchanged cameras keep their SCENE-R1 values. Lead rule: all new shots ≥ 480 px on the lead except the end of B02-SH06's crane (EMU-HERO 301 px; the field of heads is the subject; added to the brief's wide exceptions, R3).

## Staging deviations

SD01–SD12 (SCENE-R1, still in force where their shots remain): SD01 B01-SH01 arc from LF01 · SD02 corrected yaws (B01-SH03, B02-SH02, B06-SH02) · SD03 B02-SH03 camera on the track · SD04 B02-SH04 line-up south of the track · SD05 retired with B03-SH04 · SD06 dam queue path and crew withdrawal · SD07 B04-SH04 jam close re-derived · SD08 no cooling ticks, 9-frame ring · SD09 boom after "รอบ", fanfare 0.8 s, bugle 1.0 s · SD10 truck returns from the left · SD11 B07-SH01 crane on LF03 · SD12 measured burst lengths (now B04-SH03 only; B03 is SD13). Full SCENE-R1 wording: git history of this file at `df8a7fc`.

| ID | Shot | SCENE-R1 / script → SCENE-R2 | Reason |
| --- | --- | --- | --- |
| SD13 | B03-SH01 | Burst starts on the order (F 690, 2 f after the cut, 7 f after "ยิง!") and runs under "แผนแรก ยิงใส่ฝูง…" to E 756: 23 rounds, 2.2 s (brief VD30-11 est. 1.2–1.6 s; SCENE-R1 began on L06's own "ยิง"); push dropped; title on "แผนแรก" over the burst | The order now comes before L06 (L22); the script's sound intent wants "the order lands dry on the music cut; then the burst". Firing only on L06's "ยิง" (729) would leave 1.9 s between the order and the first round, which reads as a crew not obeying or fumbling (CAT02). Fallback if the review finds it long: rounds from 729 only, with B03-SH05 held to 704 (O9) |
| SD14 | B04-SH05 / SH06 | PB01 (script: about 2.8 s from the jam click) plays as: jam close (to 1062) → gunner 0.8 s → emu on screen 2.13 s (1086–1150); the watch check under the gunner's off-screen "ตอนนี้เนี่ยนะ!", the taps in the clear gap | The gunner must be seen at the dead gun (script must-be-seen) and the queue head and the gun are 7.8 m apart on the line of fire: no framing holds both at a readable size. The off-screen trigger click at 1092 keeps the gunners "working, never lagging" while only the emu waits (FACTCHECK-R3). O8 |
| SD15 | B04-SH06 | The visible cocking-handle rack sounds at 1062–1067, so the script's "about 0.2 s of silence before L23" is 2 f | The gunner is seen working the gun (FACTCHECK-R3), and the visible rack needs its sound. O11 |
| SD16 | B05-SH03, B05-SH04, B06-SH04 | B05-SH03's tiny wing flap on "รอบที่หนึ่ง" removed; the wave moves to B05-SH04 (L21); B06-SH04's flap becomes one wave swing (silent callback) | Two wing gestures inside one second; the wave is L21's picture |
| SD17 | B03-SH03 | Tracking run-past (SCENE-R1, spoken L07) → front medium with the group bunched behind, one wing flick each way, the group splits by halves | The mime must read with no words: front view, big wings, each half leaving in its wing's direction (script R2.2; FACTCHECK-R3: one flick each way, no overlay) |
| SD18 | B02-SH06 | SCENE-R1 B02-SH05's emu heads rising behind the crew move under L19's "เรามีสองหมื่นนะ" as a crane reveal; its woodblock tocks dropped | L05 retired; the script's sound intent allows only a beak click under L19 |

## Sound plan (summary; per-shot cues in the shot blocks)

Music, beds, SFX language, silences and the ending follow the brief's [sound direction](../film-brief.md#sound-direction) with its [R3 delta](../film-brief.md#r3-changes) (UT15 ending: Film's choice, B07-SH02). Cue IDs: `MUS-nn` music, `BED-01` projector whirr, `AMB-P/D/A` ambience, `SFX-<shot>-<n>`. Everything is `NEEDS-GEN` for Ton; no library file was found that fits a cue's description in this pass (the SCENE-R1 record-scratch candidate is retired with B03-SH04). The cue sheet is Ton's after this revision ([cue sheet](../../../../../docs/sound-generation-workflow.md#sound-cue-sheet)).

| Cue | Global range | Notes |
| --- | --- | --- |
| BED-01 projector whirr + crackle | [0, 1737) then wind-down [1737, 1761) | Under every 1932 shot; it is the newsreel's "silence" |
| MUS-01 march intro (snare roll, brass sting) | [0, 106) | Cut dead on "ถอนทัพ" 106 |
| MUS-02 jaunty march | [200, 494); re-enters dipped [592, 673) | Stops for the B02-SH04 drum taps; about 20 dB under L19; snare roll from 660 into a brass-and-snare hit cut dead on "ยิง!" 673 |
| MUS-04 ambush pizzicato vamp | [868, 1035) | Ducks 12 dB at F 1003, stops dead at E 1035 |
| MUS-05 galop | [1150, 1350) | Starts on the B05 cut (no music from 1035 to 1150); tuba slide into "ถอนทัพ" 1350 |
| MUS-06 admiring brass chorale | [1441, 1542) | Swell on "ถัง" 1530, cut at 1542 |
| MUS-06b held chord under the bow | [1549, 1578) | Resolves on the ting at 1563 (script: "the swell holds under the bow and resolves on it") |
| MUS-07 slower detuned march | [1639, 1737) | From "ลากยาว" |
| MUS-08 anthem-style brass pad (full range) | [1741, 1884) | Pulls back at 1884 so "ไม่เคยถอยสักรอบ" lands dry |
| SFX-B07-SH02-2 ending button | [1937, 1977) | Major chord + snare flam, rings to the end |

**Mime beat cues (for Ton; script sound intent R2.2: effects and music only, never a voice or a vocal grunt from the emu):**

| Beat | Shot | Cues (global frame) |
| --- | --- | --- |
| L07 wing signal | B03-SH03 | slide whistle up 815–821 and down 831–837 (the emu's "voice"); wing-flap swish 816 (left) and 832 (right); clawed-feet patter 818 (out left) and 834 (out right); then wind only; no music |
| PB01 invisible watch | B04-SH05 | off-screen dry trigger click 1092; tiny watch tick-tick 1106, 1109 (about 18 dB under the voice; Editor may drop, O10); three patient foot taps 1126, 1133, 1140 (clear of L23 and L12); no music |
| L15 bow | B06-SH02 | whirr-only beat 1542–1549; MUS-06b held chord 1549–1578; feather-and-cloth swish 1549–1563; polite "ting" 1563; faint tiny applause 1563–1575; all out by 1578 |

Planned silences (whirr only): [106, 149) under "ถอนทัพ ไม่ใช่รอบเดียวนะ"; after the B03 burst [758, 774) with the ring; [1035, 1052) from E to the click (ring gone by 1044); [1067, 1069) before L23 (SD15); [1542, 1549) before the bow; [1884, 1916) under "ไม่เคยถอยสักรอบ" (pad out, boom after). No music, effects only: [673, 868) after the order through the L07 mime, and [1035, 1150) from the dam burst's stop through PB01.

## Caption plan

Editor owns line breaks (`scripts/caption-breaks.mjs`) and the [caption look](../../../../../docs/production-requirements.md#caption-look); text is the script's Thai, verbatim, with numerals as written in the script ("1932", "1908"). Bold lines per the script: L01a "ออสเตรเลียเคยส่งทหารพร้อมปืนกลไปรบกับนกอีมู… แล้วต้องถอนทัพ", L14 and L17. Suggested cue ranges = the speech ranges above split at the shots' VO phrases (shot blocks list them); a cue may hold up to 8 frames past its speech, never past the next cue. Character lines (L03, L19, L22, L23, L21) are captioned like narration, with no speaker name or label (FACTCHECK-R2 O1/O2). **Mime beats (L07 [815, 860), PB01, L15 [1549, 1576)) have no caption.** Title overlays (VD30-09) sit at y 260–520 and never overlap a caption.

## Baseline and assets

Baseline, projection, palette, light and fallbacks: brief [technical handoff](../film-brief.md#technical-handoff), [scene decisions](../film-brief.md#scene-decisions) and [R3 changes](../film-brief.md#r3-changes); the sheets add only shot values.

| Asset / capability | Owner path (checkout `df8a7fc`) | Status | Gap / consumer |
| --- | --- | --- | --- |
| Newsreel layer `strength`, `tint`, `tintAmount`, `seed` | `src/painted/edu30/newsreel.tsx` | exists-unintegrated (look asset) | Boss hardens into `kit/screen.tsx`; add exposure-pop input (VD30-11); consumers all B01–B06 shots, B07-SH01 burn-out |
| Emu (stand, walk, peck, run, bow, look), EMU-HERO tuft and bib | `src/painted/edu30/emu.ts` | exists-unintegrated | Missing poses: startle, flap, hop + splash (B03-SH01, B04-SH03), neck-sac boom puff (B01-SH03), blink, nod (B02-SH06), **R2: `new: emu-wing-flick` (B03-SH03), `new: emu-watch-check` + `new: emu-foot-tap` (B04-SH05), `new: emu-wing-wave` front and back (B05-SH04, B06-SH04), `new: emu-beak-talk` (B02-SH06, B05-SH04)**; head-cock no longer needed |
| Flock instancing, far mass | `src/painted/edu30/flock.ts` | exists-unintegrated | Per-bird delayed pose switch (B03-SH01, B03-SH03 halves); queue spacing/shuffle and turn-away (B04-SH02, B04-SH05); heads-only rising members (B02-SH06); 60-bird render time (Boss) |
| Paddock set, dam set, arms wall | `edu30/paddock.ts`, `dam.ts`, `arms.ts` | exists-unintegrated | Eaten-patch growth and stubble state (B02–B06), time-lapse sun/shadow (B06-SH03), track ruts, camp; dam east approach and shore path (SD06); **R2: fence reverse from the track (B05-SH04); dam slope ground under the B04-SH06 camera** |
| 1932 cast outfits, seated-gunner arms | `edu30/cast.ts` | exists-unintegrated | `new: recoil-jolt` (VD30-11), salute P21 back/front check; **R2: `new: order-chop` P07 → P05 (B03-SH05), `new: cocking-pull` (B04-SH06), `talk` + `angry` on `man-crop` three-quarter**; `new: binoculars-at-eyes` no longer needed (B03-SH04 retired) |
| Lewis gun (`magTurn`), bell tent, truck, crew gear | `edu30/props.ts` | exists-unintegrated | Recoil offset, jam action (click/puff), cocking handle travel (B04-SH06), truck pedestal G2, truck as `YCam.body` rider (VD30-08) |
| Gunfire effects (flash, halation, pop, smoke, casings, shake, blast dust, spurts, water spouts) | — | missing (brief [kit check](../film-brief.md#vd30-11)) | Boss; B03-SH01, B04-SH03, B05-SH02 (two pops) |
| Title overlay style (VD30-09) | — | missing | Boss; B02-SH01, B03-SH01, B04-SH01, B05-SH01, B05-SH03, B06-SH04 |
| Yaw camera, `YCam.body`, `squareToCam`, `PEOPLE`, poses P05/P07/P30/P34/P44, expressions `angry`/`talk`/`neutral` | `src/painted/kit/` | existing-integrated | — |

Relevant findings (consulted at the brief, not revalidated here): DF-20261030-painted-screen-layers-overlay, DF-20261030-painted-story-hold-ambient-clock, DF-20261030-p5brush-large-fill-mottle, DF-20261029-painted-timeline-dissolve (B07 burn-out inside one plate), DF-20261116-brush-scale-cumulative, DF-20261031-paint-seed-defer (gunfire marks as plain fills), DF-20261030-qa-plate-overlay-clock (shake on the shot clock).

## Dependencies and open items

| ID | Owner | Dependency / acceptance | Status |
| --- | --- | --- | --- |
| O1 | Editor | SCENE-R1 voice split inside "1908" | **closed**: VOICE-R2 take D holds the whole year inside L17 (voice-lock.md change log) |
| O2 | User / coordinator | GUNNER-2's `man-buzz` beard reads as a dark mask under the full tint (brief open question 5); unchanged until asked. Affects B01-SH01, B02-SH04, B02-SH06 (small), B03-SH05 (edge) | open |
| O3 | Boss | Every `missing` item above with its fallback (brief VD30-01, VD30-11 fallback order, VD30-12/13); proof stills per shot block acceptance | open |
| O4 | Ton | Cue sheet from the Sound lines and the mime-beat table; all cues `NEEDS-GEN` | open |
| O5 | Boat (low) | Lewis ejection side and rate (brief open question 7); a correction changes only the casing arc side and the round spacing | open |
| O6 | Preaw (housekeeping) | Stale script-notes lines (FACTCHECK-R2 O3); captions follow script.md | open |
| O7 | Editor | Commit the final narration and lock the `public/` audio at W5/W8 ([re-editing](../../../../../README.md#re-editing)) | open |
| O8 | User via coordinator | PB01 on-screen length (SD14): the emu is on screen 2.13 s (1086–1150) inside the script's ~2.8 s window; the gunner shot is 0.8 s. Alternatives: longer emu (cut to it at 1076, gunner 0.47 s) or longer gunner (emu 1.8 s from 1096). Film recommends as written | open |
| O9 | User via coordinator | B03-SH01 burst 2.2 s / 23 rounds from the order (SD13). Alternative: rounds from L06's "ยิง" (729) only, 1.0 s, with B03-SH05 held to 704 (1.2 s on MEREDITH after his order). Film recommends as written | open |
| O10 | Editor | PB01 tick-tick (1106, 1109) sits under "ตอนนี้"; keep it about 18 dB under the voice or drop it at the mix | open |
| O11 | Editor / Ton | B04-SH06 rack leaves 2 f of silence before L23 (SD15); Editor may nudge the rack earlier by up to 2 f | open |
| O12 | Editor | L16 and L17 word anchors are RMS segment estimates (`est`, ±3–4 f; no Whisper here): "ภาคสอง" 1619 (trailer hit, B06-SH03), "มาตั้งแต่ปี" 1821 / year 1832–1849 (caption split, B07-SH01). Ear-check at the draft; a correction moves one cue onset, no shot boundary | open |
| O13 | Editor | B06-SH04 → B07-SH01: the reused 1.0 s bugle overruns the cut by 8 f; fade it over 1733–1741 | open |
| O14 | Film (next pass) | Plate tickets for SCENE-R2 (plate-tickets skill) | **closed**: [EDU-EP30-TICKETS-R1](../../tickets/index.md) (33 tickets); its Film fixes TF01–TF15 override named sheet values until the next sheet revision |

Element captures: the locked looks (store `projects/edu/EDU/previews/EDU-EP30-W3-r1/`, `-r2/`, `LF02.58933d6b.png`; brief [look frames](../film-brief.md#look-frames)) are the only captures; no new capture in this pass. Editor scene sample proposal: B04-SH04 → B04-SH06 → B04-SH05 (frames 1040–1150: the click on "ติด", the gunner's groan, the watch check and the three taps in the 18-frame gap), the beat with the tightest sync.

## Change log

- 2026-11-19, Film, `EDU-EP30-SCENE-R1`: first timed sheets from VOICE-R1 (67.07 s, 2012 frames). All 26 BOARD-R2 shots kept; deviations SD01–SD12; voice-lock defect O1 found. Rows ROWS-R6. Review page: pending.
- 2026-11-19, Film, `EDU-EP30-SCENE-R2`: re-boarded and re-timed to SCRIPT-R2.2 and VOICE-R2.2 (65.90 s, **1977 frames**). 28 shots: B02-SH05 (L05) and B03-SH04 (L08) retired; new B02-SH06 (EMU L19), B03-SH05 (MEREDITH L22), B04-SH06 (GUNNER L23), B05-SH04 (EMU L21); B03-SH03 re-staged as the L07 wing-signal mime, B04-SH05 as PB01 (invisible watch, foot taps), B06-SH02 as the silent L15 bow; L11 content gone with its line. Every frame re-measured from `anchors-R2.2.txt`; B01 and B02-SH01–SH03 frames unchanged. Burst B03 from the order (SD13); SD14–SD18 recorded. Projection re-run on the changed shots (`out/logs/ep30-projection-r2.txt`). Mime-beat sound table for Ton. Rows ROWS-R7 (timed). Review page: pending.
- 2026-11-19, Film, `EDU-EP30-SCENE-R2` (status only, no content change): O14 closed by the plate tickets `EDU-EP30-TICKETS-R1`; the ticket index lists Film fixes TF01–TF15 to fold into SCENE-R2.1.
- 2026-11-20, Film, `EDU-EP30-SCENE-R2.1` (TICKETS-R9 bundled look check; user: fix everything together): TF35–TF49 folded as amendment lines under the Projection of B01-SH01–SH03, B02-SH01, SH02, SH04, SH06, B03-SH01, B04-SH02, SH03, SH05, SH06, B05-SH01, SH04, B06-SH01, SH02, SH04, B07-SH01, SH02; caption-zone rule TF46 and the B06-SH02 band exception added to the conventions. Timing, narration, claims, reveals and IDs unchanged; TF01–TF34 still to fold. User rows `review-rows.json` unchanged (no row text changes: each Thai row already describes the corrected picture).
- 2026-11-20, Film, `EDU-EP30-SCENE-R2.2` (TICKETS-R11, the last bundled look check before the Editor; user: bundle everything): TF50–TF70 folded as R2.2 amendment lines under the Projection of B02-SH01, SH04, SH06, B03-SH02, SH03, SH05, B04-SH01, SH02, SH03, SH05, SH06, B05-SH03, SH04, B06-SH03, SH04, B07-SH01, SH02; each b0x.md gets a pointer line naming the TF01–TF34 rows (ticket index wording supersedes the sheet values they name). Global TF16: no `Grade` in the plate stack (the Editor may add one above the plates). B02-SH06 heads count is final with T42 r2 (TF70). Timing, narration, captions, sound cues and IDs unchanged; rows `EDU-EP30-ROWS-R7` unchanged (no story or staging change for the user page). Review page: pending.
