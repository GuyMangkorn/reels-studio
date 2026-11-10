# Timed scene sheets and index — EDU-EP13-SHORT (EDU-EP13-SHEETS-R2.1)

- **Deliverable:** `EDU-EP13-SHORT` · **Revision:** EDU-EP13-SHEETS-R2.1 (Film, 2026-11-09, W5.1 re-time for the R5 voice re-lock; R2.0 timed the slow6 read; rows move to ROWS-R2.1) · **Status:** `ready-for-dev`, voice-timed: Boss re-times the built plates to these ranges and keys (W5.2), Editor re-places the voice, cues and captions (W5.3), Ton makes the one new cue S24. · **Timing:** `checked-with-audio` for line onsets, the listed anchors and every slot length ([measure.json](measure.json) block `r5b_B_slow10`); anchors marked `est` are word onsets inside a run (Whisper token time + 0.08 s, snapped to an adjacent 10 ms energy dip within 0.08 s; ±3 f, not listened); Editor measures them at W5.3 and moves the tied key by the same frames without a Film revision (PL05).
- **Evidence:** runtime: the R2.0 draft (`out/EDU-EP13-SHORT/draft/EDU-EP13-SHORT_A_fade.mp4`, 1390 f, slow6) exists; nothing is built at R2.1 timing yet · audio: placed on paper from [measure.json](measure.json) `r5b_B_slow10` (EDU-EP13-SCRIPT-R5, `ep13-nar-kore-r5b-B-slow10.wav`, 46.17 s, speech 0.24–45.77 s, `audio-measured`; user picked Take B 2026-11-09); not assembled · projection: unchanged from R2.0 (cameras in `src/painted/edu13/scenes.ts`) · user approval: storyboard 16/16 `ok` (content), looks locked, script R5 and Take B picked by the user; no timing approval.
- **Inputs (by revision):** script **EDU-EP13-SCRIPT-R5** ([script.md](script.md), Thai unchanged; L03/L05 "ดีด", B02-SH01 label "แรงดีด ↑") · [fact-check.md](fact-check.md) incl. the R5 recheck (pass) · brief **EDU-EP13-BRIEF-R1.5** ([film-brief.md](film-brief.md); not edited here; the ending tag sound is replaced by S24 below) · storyboard **EDU-EP13-ROWS-R2.0 → R2.1** ([storyboard.md](storyboard.md), [review-rows.json](review-rows.json)) · [task.md](task.md).
- **Target:** branch `claude/education-ep13-5b4635` at `5216890` · 30 fps · `durationFrames` **1542** (51.40 s; target 40–60 s) · 1080×1920 · composition `EDU-EP13-SHORT` (`src/videos/edu-ep13/`) · ending closed, 2.63 s hold.
- **Baseline (link, not copied):** spaces `R`, `M`, `D`, `S`, axes and units per the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) and set plans. **All room numbers below are the shifted R1.2 values** (OX 0.50 on the chart group and chart-camera targets, DS 0.15 on the sofa group): MAN chart mark (0.50, 0, 0.35), giant feet centre (1.85, 0, 0.35), body x 0.95 → 2.75, chart centre x 0.50, MAN seat (3.30, 0.30, 0.45), dog (4.15, 0.30, 0.45). Street marks MAN (0.20, 0, 0), giant (1.50, 0, −0.60) (brief R1.2). Dog-free zone: every giant-flea room frame stays at x ≤ 2.95 at the actors' plane.
- **Camera lines:** `cam: target (x, y, z), yaw a→b, r, eye, f, hy[, pitch]` = one kit `camMove` (`orbitYCam`; yaw positive swings the camera toward +x). **`hy` is the eye-height (horizon) row** as the kit uses it (`y = hy − f·(Y − eye)/depth`); the storyboard's "row of the target" wording was wrong, its numbers were already eye-row numbers. A move runs linearly over the shot unless `ease [u0, u1]` is given.
- **Clocks:** `G` composition frame; shot-local `L` = G − shot start (written `+n`); ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe).
- **One shot = one timeline scene** (scene ID = shot ID). Every join is a hard cut; the trailer inset in B04-SH02 is a DOM layer inside its shot.

<a id="placement-rules"></a>
## Placement rules

- **PL01 Stable:** shot IDs, order, beats, line-to-shot assignment (the rows' per-shot VO split is kept exactly), casting, looks, clue IDs CL01–CL02, deviations D01–D14, rules R01–R10 and SD01–SD05 stay. R2.1 changes ranges, event frames and the cue frames only, plus the B02-SH01 label text (script R5), the SH05 camera ease fractions (same frames) and the ending cue (S24, [SD08](#sd01)).
- **PL02 Voice is placed, not retimed:** narration = `out/edu13/voice/full/ep13-nar-kore-r5b-B-slow10.wav` (store `projects/EDU-EP13-SHORT/voice/ep13-nar-kore-r5b-B-slow10.wav`). It is cut only at three silent points inside line gaps and each piece is shifted whole; no atempo, no inner cut:

  | Piece | Read range (s) | Shift | Holds |
  | --- | --- | --- | --- |
  | N1 | 0.00–5.58 | +10 f (0.333 s) | L01 |
  | N2 | 5.58–9.97 | +26 f (0.867 s) | L02 |
  | N3 | 9.97–35.20 | +72 f (2.400 s) | L03, L05, L06, L07, L09, L15, L16 |
  | N4 | 35.20–end | +90 f (3.000 s) | L12, L13, L14 |

  G of a narration point = round(read s × 30) + shift. Inserted silence unchanged from R2.0: 10 f lead-in (UT01), 16 f for TR01, 46 f for V01, 18 f for the crouch and V02; 100 f in all. Take B's own line gaps are longer at the three insert points (L01→L02 27 f, was 20; L02→L03 25 f, was 15; L16→L12 26 f, was 14), so TR01 is 43 f, the V01 gap 70 f and the crouch gap 44 f; the picture absorbs the extra frames as listed in [SD06–SD07](#sd01).
- **PL03 Shot starts:** a narration-led cut sits **3 f before the onset frame** of the shot's first word; exceptions with reasons in the shot blocks (SH04C starts at the launch's end, B01-SH05 and B04-SH02 start in a gap, B05-SH02 ends on the hold).
- **PL04 Slots:** V01 and V02 are placed start-anchored at their slot frame. A take shorter than its slot leaves the shot end where it is (the picture holds); a take longer than the slot goes back to Film (retime), never pushes later frames.
- **PL05 Estimated anchors:** a key tied to an `est` word moves with Editor's measured onset (±3 f) without a Film revision; a move of more than 3 f, or one that would cross a shot cut or the rows' VO split, comes back to Film.
- **PL06 Rows:** [review-rows.json](review-rows.json) **EDU-EP13-ROWS-R2.1** carries `start`/`end` (G) and `untimed: false`; title, VO, seen and sound are unchanged on 13 shots (timing is outside the storyboard hash, so their verdicts hold). Three rows change and ask again: B02-SH01 (R5 VO and the "แรงดีด ↑" label), B02-SH03 (R5 VO, picture unchanged) and B05-SH02 (ending sound S24 instead of the pizzicato tag).

<a id="narration-placement"></a>
## Timeline and voice placement (Editor)

| Item | G on | G off | Shot | Word anchors (G; measure file `r5b_B_slow10` unless `est`) |
| --- | --- | --- | --- | --- |
| lead-in | 0 | 17 | B01-SH01 | room tone, S1 dog breathing; no voice |
| L01 | 17 | 164 | SH01 → SH04B | "หมัดกระโดดได้สูงกว่า" 17 · "สูงกว่า" 47 `est` · "หลายสิบเท่า" 66 `est` · "ถ้ามันตัวเท่าคุณ" 99 · "คุณ" 119 `est` · "จะกระโดด" 132 · "ข้ามตึก" 144 `est` · "ได้มั้ย" 155 `est` |
| TR01 | 164 | 207 | SH04B, SH04C | no speech, 43 f (1.43 s): launch, rise, apex hold |
| L02 | 207 | 313 | SH04C, SH04D | "ไม่หรอก" 207 · "มันน่าจะกระโดดได้" 231 · "หลักสิบเซน" 260 `est` · "พอ ๆ กับคุณ" 286 |
| V01 | 321 | ≤ 363 | B01-SH05 | MAN "เฮ้ย… ตัวเท่าเราเลย!" slot 42 f (≤ 1.40 s), picked take A Algenib 1.376 s (41.3 f) |
| L03 | 383 | 468 | B02-SH01 | "ขามันดีดแรงขึ้น" 383 · "ดีด" 397 `est` · "ก็จริง" 412 `est` · "แต่ตัวก็หนักขึ้นตาม" 433 · "หนัก" 445 `est` |
| L05 | 481 | 570 | B02-SH03 | "เหมือนขาคุณดีดแรงสองเท่า" 481 · "แต่แบกเป้หนักสองเท่า" 531 · "แบกเป้" 535 `est` |
| L06 | 597 | 665 | B02-SH03 | "ตัวใหญ่ขึ้น" 597 · "กระโดดไม่ได้สูงขึ้นตาม" 623 `est` (dip-snapped) · "ไม่ได้สูงขึ้นตาม" 634 `est` |
| L07 | 694 | 771 | B03-SH01 | "แต่" 694 · "แล้วหมัดตัวจิ๋ว" 716 |
| L09 | 788 | 891 | B03-SH03 | "มันบีบแผ่นยางยืด" 788 · "บีบ" 794 `est` · "แล้วปล่อยทีเดียว" 849 · "ปล่อย" 856 (run start) · "เหมือนหนังสติ๊ก" 874 `est` · "หนังสติ๊ก" 878 `est` |
| L15 | 920 | 985 | B04-SH01 | "แล้วหมัดยักษ์ล่ะ" 920 · "หมัดยักษ์" 925 `est` · "ยังต้องพึ่งหนังสติ๊กมั้ย" 952 |
| L16 | 1003 | 1115 | B04-SH01 | "ไม่ค่อยต้องแล้ว" 1003 · "ขามันยาว" 1038 · "มีเวลา" 1070 · "กล้าม" 1085 `est` · "ดันพื้น" 1093 `est` |
| V02 | 1143 | ≤ 1155 | B04-SH02 | MAN "ฮึบ!" slot 12 f (≤ 0.40 s), picked take A Algenib 0.396 s, on the take-off |
| L12 | 1159 | 1253 | B04-SH02 | "สูงพอ ๆ กัน" 1159 (run ends 1186) · "แค่หลักสิบเซน" 1194 · "ไม่ใช่ร้อยเมตร" 1226 |
| L13 | 1282 | 1384 | B05-SH01 | "แต่ถ้าวัดเป็นเซน" 1282 · "เซน" 1300 `est` · "ปกติ คุณก็กระโดดสูงกว่า" 1317 · "คุณ" 1331 (run start) · "สูงกว่า" 1350 `est` |
| L14 | 1406 | 1463 | B05-SH02 | "หมัดดูเก่ง" 1406 · "ก็เพราะตัวมันเล็กมาก" 1433 · "เล็กมาก" 1449 `est` |
| V03 | 1474 | 1510 | B05-SH02 | dog sigh, SFX (Ton, `creature_dog-sigh-exhale_01`, 1.2 s), no voice, no subtitle |
| hold | 1463 | 1542 | B05-SH02 | 79 f (2.63 s) after speech end: S24 settle tone, dog, room tone to zero |

- **Total:** speech ends G1463 (48.77 s); hold [1463, 1542) → **1542 f = 51.40 s** (R2.0 1390 f = 46.33 s; inside 40–60 s).
- **Captions:** = VO, one cue per line (Editor splits long lines at the "…" per the series caption rule), on at the line's G on, off at G off + 6 f or the next cue; V01 and V02 subtitled, V03 and TR01 not. Caption band rows 1176–1344 (edu stroke style, no band fill). Editor re-derives every cue from the voiced runs of the new placed narration (the R2.0 `cues.ts` frames are all stale); the R2.0 finding 10 (L12 b shown 30 f before "ไม่ใช่ร้อยเมตร") applies again: split at G1226 if it still shows early.
- **Silent stretches:** TR01 1.43 s (picture and trailer bed carry it) · V01 gap 70 f around a 42 f slot (21 f of air after the take, carried by MAN's look at the leg, SD07) · apex freeze 31 f (NAR only) · end hold 2.63 s.

<a id="voices"></a>
## Character voices (Editor, before W5.3)

- **V01** MAN "เฮ้ย… ตัวเท่าเราเลย!": picked take `out/edu13/voice/man-samples/A_algenib_V01_t1.20.wav` (1.376 s), unchanged. Slot 42 f from **G321** (was G282); the take's 0.33 s breath pre-roll keeps its −20 dB treatment, "เฮ้ย" onset ≈ G331.
- **V02** MAN "ฮึบ!": picked take `A_algenib_V02_t1.40.wav` (0.396 s), unchanged. Slot 12 f from **G1143** (was G1020); L12 starts at G1159, so 4 f of air stay after it.
- **V03** dog sigh: not a voice; Ton's `creature_dog-sigh-exhale_01` (1.2 s), placed by Editor at **G1474**.
- Every gap holds its insert; none needs the read to move.

<a id="sd01"></a>
## Staging deviations from ROWS-R1.5 (Film decisions, W5.1)

- **SD01 Feet out of the caption band (framing only).** With `hy` as the eye row, three chart cameras put the floor inside the caption band (CAM-CHART-2S feet row 1188, CAM-CHART-LOW 1199 → 1233, CAM-FLEA-LEGS giant feet 1259 → 1299). Each now holds the floor row at **1158** by lowering `hy` only (target, yaw, r, f unchanged): CAM-CHART-2S hy 740 at r 6.6 (shot 3), 682 at r 5.8 (shot 8 push end), 716 at r 6.3 (shot 13 end); CAM-CHART-LOW hy 659 → 625; CAM-FLEA-LEGS hy 759 → 719. The picture tilts down 30–141 px; the locked looks F3/F4/F6 keep composition and lens, so no look re-approval is asked. CAM-TRUTH (floor 1150), CAM-INSERT (1138) and the macro cameras are unchanged. CAM-SOFA keeps MAN's feet at ≈ 1395 (LF01 look as locked; no contact beat there), and the street back views stay below the band (R07 exception). **R2.1 frames:** the `hy` values are unchanged; shots 3, 9, 13 and 15 run their tilt linearly over the shot, so it follows the new lengths without a code change (shot 3 fixed at 740; shot 9 759 → 719 over G380–478; shot 13 740 → 716 over G917–1135; shot 15 659 → 625 over G1279–1403). Shot 8 keeps its push on **+6–+14** (G323–331): with the shot now 63 f the ease fractions become **[0.095, 0.222]** (were [0.11, 0.26] of 54 f).
- **SD02 Trailer is shorter.** R2.0: SH04 20 f, SH04C 39 f, hold 9 f. R2.1: see SD06.
- **SD03 Apex freeze 30 f (was 27 f est).** R2.1: **31 f** (+17–+48). "สูงพอ ๆ กัน" (G1159–1186) is spoken over the frozen apex and its last 3 f run under the resumed fall; the landing (+57) falls 2 f before "แค่" (+59) as in R2.0.
- **SD04 Macro rest shorter.** R2.0: rest 16 f. R2.1: **rest 22 f** (Take B says "หลายสิบเท่า" later in the line), so "2 มม." reads longer; counter steps every 5 f; ×50 still shows 4 f while rising (B-P2 kept).
- **SD05 Dog moves sooner.** The ending cue starts at L14's end (+60 in B05-SH02); the dog lifts its head at +65 and sighs at +71; the hold after L14 is 2.63 s (rows say about 2.5 s).
- **SD06 Trailer gap is 43 f (R2.1).** Take B leaves 27 f between "ได้มั้ย" and "ไม่หรอก" (was 20) and the TR01 insert stays 16 f. The 6 extra frames go to SH04B's tail (+3 f, MAN keeps looking up while the grit settles, launch still +18) and the SH04C apex hold (**9 → 13 f**, 0.43 s, inside R09's 15 f and the 0.5 s cap); the rise stays 12 f and every key after the break keeps its distance from "ไม่หรอก" (+4 f in shot-local terms).
- **SD07 Longer gaps around V01 and the crouch (R2.1).** The V01 gap is 70 f (was 61): SH05 keeps all its keys and gains 9 f of tail after the look at the leg, filled with a small antenna twitch and one slow blink (not a frozen frame). The crouch gap is 44 f (was 32): B04-SH02 keeps its crouch, V02 and apex frames relative to "สูงพอ ๆ กัน" (+24, as R2.0), and the 12 extra frames go to the end of B04-SH01 (both stand settled after L16, then settle their weight into the cut).
- **SD08 Ending sound (user, 2026-11-09).** The pizzicato tag `stinger_pizz-tag-ending_01` is dropped (the user does not want an ep02-like string ending). M1 fades out under L14 so no cadence note lands at the end, and one soft felt-mallet vibraphone note (S24, NEEDS-GEN) settles under the dog's head lift; the dog's sigh stays the button. Fallback if S24 competes with the sigh on the draft: drop S24; room tone, collar jingle and sigh only.

## Shot map

| # | Shot | Beat | G range | Len | R2.0 range (len) | Lines | Claims / clues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | [0, 44) | 44 | [0, 27) (27) | L01 a | CL01 (chart) |
| 2 | S01-B01-SH02 | B01 | [44, 96) | 52 | [27, 76) (49) | L01 b | CL04; CL02 (folded legs) |
| 3 | S01-B01-SH03 | B01 | [96, 129) | 33 | [76, 109) (33) | L01 c | VD05 size |
| 4 | S01-B01-SH04 | B01 | [129, 152) | 23 | [109, 129) (20) | L01 d (TR01) | R09 card |
| 5 | S01-B01-SH04B | B01 | [152, 182) | 30 | [129, 156) (27) | L01 tail (TR01) | R09; CL02 echo |
| 6 | S01-B01-SH04C | B01 | [182, 228) | 46 | [156, 195) (39) | TR01, L02 "ไม่หรอก" | R09 hold ≤ 15 f |
| 7 | S01-B01-SH04D | B01 | [228, 317) | 89 | [195, 278) (83) | L02 | CL09 |
| 8 | S01-B01-SH05 | B01 | [317, 380) | 63 | [278, 332) (54) | V01 | CL02 look |
| 9 | S01-B02-SH01 | B02 | [380, 478) | 98 | [332, 425) (93) | L03 | CL10 |
| 10 | S01-B02-SH03 | B02 | [478, 691) | 213 | [425, 611) (186) | L05, L06 | CL08/CL10, B-P6 |
| 11 | S01-B03-SH01 | B03 | [691, 785) | 94 | [611, 697) (86) | L07 | CL02 recall |
| 12 | S01-B03-SH03 | B03 | [785, 917) | 132 | [697, 825) (128) | L09 | CL05, B-P4 |
| 13 | S01-B04-SH01 | B04 | [917, 1135) | 218 | [825, 1012) (187) | L15, L16 | CL11, R10 |
| 14 | S01-B04-SH02 | B04 | [1135, 1279) | 144 | [1012, 1138) (126) | V02, L12 | CL09, N4 e, R04, R05 |
| 15 | S01-B05-SH01 | B05 | [1279, 1403) | 124 | [1138, 1254) (116) | L13 | CL13, B-P3 |
| 16 | S01-B05-SH02 | B05 | [1403, 1542) | 139 | [1254, 1390) (136) | L14, V03, hold | CL13 |

<a id="r21-boss-retime"></a>
### R2.1 re-time for Boss (shot-local keys that change)

Every shot moves its `start`/`len` in `src/painted/edu13/shots.ts` `SHOTS`. Camera moves that run linearly over the shot follow the new length by themselves. Only the keys below change; every other key in the shot blocks keeps its R2.0 shot-local frame.

| # | Shot | Change (R2.0 → R2.1, shot-local) | Paint work |
| --- | --- | --- | --- |
| 1 | SH01 | len 27 → 44; MAN's eye drift +18–+26 unchanged, then he keeps looking up during the VO | range only |
| 2 | SH02 | rest 16 → **22 f**; take-off +16 → **+22**; bar fade +16–+21 → +22–+27; counter ×10…×50 at +21/27/33/39/45 → **+28/33/38/43/48**; ring from +36 → +42; flea ≈ 60 px by +40 → +46; crane +22 → end | keys |
| 3 | SH03 | none (start 76 → 96); grow +4–+26 kept; "คุณ" now `est` +23, full size 3 f after it (inside PL05's ±3 f) | range only |
| 4 | SH04 | len 20 → 23; keys unchanged; 5 f hold after the head tilt (+18–+23) under the VO | range only |
| 5 | SH04B | len 27 → 30; keys unchanged (launch +18); 3 f more of MAN looking up as the grit settles | range only |
| 6 | SH04C | apex hold +12–+21 → **+12–+25 (13 f)**; tape-stop +21 → **+25** (clock to a stop +25–+31); droop +27–+36 → **+31–+40**; card off +36 → **+40**; grey empty sky +40–+46 | keys |
| 7 | SH04D | hop +36–+54 → **+32–+50** (on "หลักสิบเซน" `est`); land +6 and head turn +58–+70 unchanged; holds to +89 under "นี่แหละ" | keys |
| 8 | SH05 | keys unchanged to +44; camera ease → [0.095, 0.222] (same +6–+14); **new +48–+52 giant antenna twitch, +54–+57 MAN slow blink** (SD07) | keys + 2 small motions |
| 9 | B02-SH01 | label text **"แรง ↑" → "แรงดีด ↑"**, pop +11 → **+17** (on "ดีด" `est`); glow +3–+92 → **+3–+97**; dial +49 → **+55**, needle +49–+85 → **+55–+91**; arrow +60 → **+65** | text + keys |
| 10 | B02-SH03 | backpack +55 → **+57**; crouch +85–+90 → **+100–+105**; take-off +90 → **+105**; apex +96 → **+111**; land +102 → **+117**; straighten +104–+112 → **+119–+127**; pulse + front head +145 → **+156**; **new +196–+199 MAN deadpan blink** | keys + 1 blink |
| 11 | B03-SH01 | len 86 → 94; push only | range only |
| 12 | B03-SH03 | `SPRING` release 65 → **71**, gone 66 → **72**, glowEnd 83 → **89**, icon 99 → **93**; squeeze +9–+37 and catch +39 unchanged | keys |
| 13 | B04-SH01 | head tilt +9–+17 → **+8–+16**; "?" off and grey fade +80–+92 → **+84–+96**; head levels +86–+94 → **+90–+98**; leg light +112–+130 → **+121–+139**, faint to +169, out by **+181**; MAN eyes +159–+172 → **+168–+181**; settle +177–+187 → **+208–+218** | keys |
| 14 | B04-SH02 | `JUMP` resume 47 → **48**, land 56 → **57** (crouch, take-off, apex unchanged); inset +86 → **+91**, off +112 → **+123**; band/tag fade +112–+124 → **+123–+135**; MAN glance +100 → **+105** | keys |
| 15 | B05-SH01 | flea mark +27 → **+21**; MAN mark +51 → **+52**; glance +54–+68 → **+55–+69**; smug +69 → **+71**; optional blink +112 | keys |
| 16 | B05-SH02 | `SOFA16` dogLift 62 → **65**, sigh 68 → **71**, sighEnd 104 → **107**, down 118 → **121** (`dogLift` segs 62–72/110–122 → 65–75/113–125); sit-down +0–+54 unchanged | keys |

## Shot sheets

### S01-B01-SH01 · 0–44 · the room (L01 a)

- **Camera:** CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 40→39, r 2.80→2.75, eye 1.15, f 1200, hy 850` (LF01 values; slow push over 44 f).
- **Staging (R m):** MAN `man-parted + home-lounge (cardigan off), P31, neutral` seated front at seat (3.30, 0.30, 0.45), feet (3.30, 0, 0.90), phone face-down on his thigh, eyes on the dog; head ≈ (567, 829), feet ≈ (433, 1395) computed (seated ≈ 570 px). DOG `dog-golden, lie, idle` + `lid: 1`, left profile at (4.15, 0.30, 0.45) ≈ (908, 1288), head toward MAN, breathing. Chart at ≈ (110, 886), background left. Sun patches on the dog and rug.
- **Keys:** +0 frame reads at once (LF01, UT01); +17 L01 starts; +18–+26 MAN's eyes drift up to the window and stay there to the cut +44 (he is thinking while the line runs).
- **VO:** "หมัดกระโดดได้…" (+17 → into SH02).
- **Sound:** room tone from +0 (`city_soi-afternoon-day_01` low + A1 fan); S1 dog breathing +0–+44 (the first slow breath of the 3 s cue); M1 enters at +6, energy 2, under the voice at −14 dB.
- **Entry → exit:** LF01 → MAN still seated, eyes up; dog asleep.
- **Acceptance:** +0 reads "inside, a home, afternoon, man and sleeping dog" at 270 px · no music in +0–+5 · dog never moves.

### S01-B01-SH02 · 44–96 · macro leap and counter (L01 b)

- **Camera:** CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0, r 4.0, eye 0.45, f 1200, hy 900` +0–+21; crane +22–+52: target y rides the flea, r 4.0 → 40 mm, linear, still rising at the cut (no settle, B-P2).
- **Staging (M mm):** FLEA `new: flea` right profile at (0, 0, 0), 2.0 mm, legs folded (CL02), ≈ 600 px long; "2 มม." bar (600 px, y ≈ 1100) and "ภาพจำลอง" in LBL.
- **Keys:** +0–+21 rest (22 f, SD04); **+22 gone** (on "หลายสิบเท่า" G66 `est`; 1-frame take-off, smear streak, contact shadow stays); bar fades +22–+27; flea shrinks with the pull-back to ≈ 60 px by +46, ring marker from +42; counter pill: ×10 +28, ×20 +33, ×30 +38, ×40 +43, ×50 +48 (heights 20…100 mm); ×50 on screen +48–+51 only while ring and camera still rise; no digit past ×50.
- **VO:** "…สูงกว่าตัวมันหลายสิบเท่า…" ("สูงกว่า" +3 `est`, "หลายสิบเท่า" +22 `est`, sentence ends ≈ +34); silence after.
- **Sound:** A2 studio hush replaces room tone at +0; S2 `ui_click-tick_01` (pitched up) at +22: one crisp dry tick, the flea is gone before the eye catches it; S3 `whoosh_air-swish-rising_01` +22 → through the cut (mono); S4 ticks at +28, +33, +38, +43, +48, rising pitch; M1 continues, energy 2 → 3.
- **Entry → exit:** rest pose → empty sweep, ring rising, ×50 pill.
- **Acceptance:** "2 มม." and "ภาพจำลอง" readable +0–+21 · take-off is one frame · ×50 never held (≤ 4 f) · no ruler, fur or skin.

### S01-B01-SH03 · 96–129 · the grow (L01 c)

- **Camera:** CAM-CHART-2S **fixed** `cam: target (1.45, 1.00, 0.35), yaw 0, r 6.6, eye 1.15, f 2400, hy 740` (SD01).
- **Staging (R m, plane z 0.35):** MAN `man-parted + home-lounge, P02, neutral` front at (0.50, 0, 0.35): feet (195, 1158), head (195, 504), **654 px**, left side; eyes up-left, unaware. Ring marker on the floor at (1.85, 0, 0.35) ≈ (685, 1158) +0–+8. Frame right edge at the plane ≈ x 2.94 (dog-free).
- **Keys:** +3 "ถ้ามัน"; **+4 grow starts** about the feet ground point, k(n) = 900^((n − 4)/22) for n in [+4, +26]; **+26 full size** (1.80 m long, 1.05 m tall; head (1013, 776)), 3 f after "คุณ" (G119 `est`, +23; kept inside PL05's ±3 f so the built grow does not change); +28 the giant tilts its head up; MAN still thinking; cut +33 before "จะกระโดด" (G132).
- **VO:** "…ถ้ามันตัวเท่าคุณ…".
- **Sound:** room tone back at +0 (A2 out); S5 grow glissando +4–+30 (0.9 s); M1 lifts to energy 3 and **cuts dead on the last frame** (G128, so G129 is silent of music).
- **Entry → exit:** MAN P02 thinking, empty ring → full giant at rest beside him, head tilted up.
- **Acceptance:** feet of both ≤ y 1160 · giant's feet never leave the floor during the grow · full size by +26.

### S01-B01-SH04 · 129–152 · trailer 1, the shadow (L01 d)

- **Camera:** CAM-TR-SOI `cam: target (1.0, 8.0, −30), yaw 0, r 46→45.7, eye 1.6, pitch +8, f 1100, hy 900` (brief VD27, SP4 computes; creep linear over 23 f).
- **Staging (S m, trailer grade N15):** MAN back view P30 at (0.20, 0, 0), ≈ 124 px (est), tiny; tower cropped by the top edge; textless shophouses; nobody else.
- **Keys:** +0 card "ถ้าคิดแบบง่าย ๆ" fades in in TC over 4 f; **+4–+16 the long soft shadow** (N18) sweeps down the road toward the lens and passes over MAN at +10; +10–+18 MAN's head tilts up; holds looking up to the cut +23 (5 f, the creep keeps it moving).
- **VO:** "…จะกระโดดข้ามตึก…" ("จะกระโดด" +3 measured, "ข้ามตึก" +15 `est`).
- **Sound:** M1 out (dead at G129); **TR1 braam at +0** (fiction bed; −10 dB under the voice); soi bed 30 % + A3 high wind; TR2 shadow pass +4–+16 (0.5 s); `reveal_riser-tension_01` its last **1.37 s** (41 f) from +0 to its dead stop at G170 (SH04B +18; Editor takes a 0.10 s earlier in-point, no new file).
- **Entry → exit:** dusk soi, MAN looking down the road → shadow passed, head tilted up; card on.
- **Acceptance:** card on from +0 (R09) · no damage, crowd, sign text or digits · MAN reads as the size reference.

### S01-B01-SH04B · 152–182 · trailer 2, crouch and launch (L01 tail)

- **Camera:** CAM-MYTH (trailer grade) `cam: target (1.0, 1.4, 0), yaw −6, r 2.6, eye 0.45, pitch +30, f 820, hy 900` (locked; no push).
- **Staging (S m):** MAN back view P30 at (0.20, 0, 0): feet (206, 1591), head (311, 926), 665 px computed. Giant right profile at (1.50, 0, −0.60): feet (678, 1538), head (881, 1196); folds toward the LF04b pose state `crouch`. Near-silhouette, warm rims. Card on in TC.
- **Look:** LF04b at about +10.
- **Keys:** +0–+16 hind legs fold deeper to `crouch`; **+18 launch** (G170; body out of the top edge by +22, smear streak, small grit swirl, no crack or debris); +18–+27 MAN's head tilts up after it; +27–+30 he holds, grit settling (SD06); cut +30.
- **VO:** "…ได้มั้ย" (+3 `est` → L01 ends +12, measured; the cut sits 3 f before Editor's measured "ได้").
- **Sound:** TR3 drum pulse 4 hits at +0, +7, +12, +15; riser dead stop at +18; **TR4 launch whoosh-boom at +18**; A3 wind on.
- **Entry → exit:** giant at rest folding → empty mark, grit settling, MAN looking up.
- **Acceptance:** +10 matches LF04b · launch on one frame · no debris · card on throughout.

### S01-B01-SH04C · 182–228 · trailer 3, money shot and the break (TR01, "ไม่หรอก")

- **Camera:** CAM-TR-SKY **locked** `cam: target (10, 70, −60), yaw −9, r 327, eye 25, pitch +8, f 3600, hy 820` (LF04; ≈ 11 px/m).
- **Staging (S m + skyline N16):** tower centred against the sun disc; giant as `new: flea silhouette` (N17) at true scale (≈ 20 px) inside the ring marker, dotted trail behind it (`skyTrail`, near-vertical with a slight lean from lower left); apex point `SKY_APEX` (10.8, 134, −60) ≈ row 160. Card on in TC (mid-tower). Sky and sun ungraded (look lock).
- **Keys:** +0 silhouette enters low and rises along the LF04 trail; **+12 apex** (LF04 frame; no end marker, tick or "ผล"); **+12–+25 hold (13 f ≤ 15 f, 0.43 s; SD06)**; **+25 "ไม่หรอก": tape-stop** (N19: clock eases to a stop over 6 f, +25–+31, frame sags 2 %, grade drains to flat grey); +31–+40 droop arc drops the silhouette out of the frame bottom, trail fades with it; **+40 card off**; grey empty sky +40–+46; cut +46.
- **VO:** "ไม่หรอก…" at +25 (G207, measured run start; ends ≈ +38); "มันน่าจะ" starts in SH04D.
- **Sound:** TR5 height wind +0–+12 (0.4 s), then near-silence +12–+25 (thin high air only); **TR6 tape-stop at +25** kills the bed; S7 slide-whistle droop from +31 (0.8 s, runs across the cut into SH04D +9); NAR on top.
- **Entry → exit:** empty sky → silhouette gone below, frame grey and sagged.
- **Acceptance:** apex hold ≤ 15 f, broken on the first frame of "ไม่หรอก" (R09) · card on until the silhouette leaves (+40) · no floor count, metre or digit.

### S01-B01-SH04D · 228–317 · plain soi, knee-high hop (L02)

- **Camera:** CAM-MYTH plain (LF03, no grade) `cam: target (1.0, 1.4, 0), yaw −6→−3, r 2.6→2.45, eye 0.45, pitch +30, f 820, hy 900` (slow push over 89 f).
- **Staging (S m):** MAN back view P30 at (0.20, 0, 0) (as SH04B). Giant right profile drops into (1.50, 0, −0.60) from y 3.0 (row ≈ 783) over +0–+6, lands a little deflated (antennae droop); no arc, no card.
- **Keys:** +0–+6 drop, land +6; **+32 one small hop** on "หลักสิบเซน" (G260 `est`): 0.36 m (feet row ≈ 1404 at the apex), airtime 18 f +32–+50, `new: flea-muscle-jump` small amplitude; +58 "พอ ๆ กับคุณ" (G286, measured): MAN's head tips down and turns toward it +58–+70; both hold under "นี่แหละ" (L02 ends +85) to the cut +89.
- **VO:** "…มันน่าจะกระโดดได้แค่หลักสิบเซน… พอ ๆ กับคุณนี่แหละ" (+3 → +85).
- **Sound:** `city_soi-afternoon-day_01` full + A3 breeze from +0; S7 tail to +9; `foley_soft-landing-tap_01` at +6 and small (gain 0.6) at +50; M1 re-enters at +10, energy 1.
- **Entry → exit:** empty mark → giant at its mark after the hop, MAN's head turned to it.
- **Acceptance:** hop apex ≈ knee height of MAN, not higher · captions do not hide the hop apex (Editor `caption-zone.py`; if they do, the hop key stays and Editor lifts the cue as allowed by the series rule) · no card.

### S01-B01-SH05 · 317–380 · "เฮ้ย" (V01)

- **Range note:** starts 4 f after L02 ends (gap-led, PL03); ends 3 f before L03.
- **Camera:** CAM-CHART-2S `cam: target (1.45, 1.00, 0.35), yaw 0, r 6.6→5.8, eye 1.15, f 2400, hy 740→682, ease [0.095, 0.222]` (push +6–+14, then held; floor row 1158 throughout, SD01). At r 5.8: MAN head (147, 413), 745 px; frame right edge ≈ x 2.80 at the plane (dog-free).
- **Staging (R m):** MAN front at (0.50, 0, 0.35); giant right profile at (1.85, 0, 0.35), rest (shot 3 exit).
- **Keys:** +0–+6 MAN `turn-head-right`; +4 V01 starts (G321); +6–+20 `gasp-recoil` with `shock`, V01 lip-sync; +10–+22 giant `front` head looks at the lens, then back to profile; **+36–+44 MAN's eyes drop**, head tips about 10° to the giant's folded near hind leg (gaze target the knee (1.35, 0.50, 0.35)), `shock` softening to wide-eyed `neutral`; **+48–+52 the giant's near antenna twitches once (≈ 8°, back by +52); +54–+57 MAN blinks once, slowly, still on the leg** (SD07); hold to +63. (+36 is tied to V01's "เลย"; Editor moves it with the take.)
- **VO:** MAN "เฮ้ย… ตัวเท่าเราเลย!" +4 → ≈ +45 (subtitled from "เฮ้ย" ≈ +14).
- **Sound:** room tone back at +0 (soi bed out); M1 half-beat dropout +0–+12; S8 flinch sting at +8 (in the take's breath pre-roll, before "เฮ้ย"); no cue on the look, the twitch or the blink.
- **Entry → exit:** shot 3 exit staging → MAN wide-eyed, looking at the leg; leg unlit.
- **Acceptance:** leg stays in frame and unlit (clue CL02) · feet ≤ y 1160 during the push · no dog · the tail +44–+63 is never a frozen frame.

### S01-B02-SH01 · 380–478 · strength up, weight up (L03)

- **Camera:** CAM-FLEA-LEGS `cam: target (1.70, 0.55, 0.35), yaw 6→10, r 3.4→3.1, eye 0.9, f 1500, hy 759→719` (SD01; giant feet row 1158; tail ≈ (218, 931) → (197, 905), head ≈ (1016, 896) → (1072, 873); MAN's shoulder at the left edge ≈ x 32).
- **Staging (R m):** giant at rest at (1.85, 0, 0.35).
- **Keys:** coral glow on the hind-leg muscle 0 → 1 from +3 ("ขามันดีดแรงขึ้น") to +97; **"แรงดีด ↑" beside the leg at +17** (on "ดีด" `est`; script R5, was "แรง ↑"; same anchor (0.95, 0.95, 0.35) ≈ (216, 733) → (197, 696), text left ≈ x 157–176, 54 px; width grows from ≈ 135 to ≈ 215 px est, right edge ≈ x 390, clear of the dial; Boss confirms on a still); glow ≈ 0.6 at "ก็จริง" (+32 `est`); **+55 weight dial** (no numerals) pops in above the back (2 f after "แต่" +53), needle swings up +55–+91 in step with the still-rising glow; small down-arrow under the body at +65 ("หนัก" `est`). No digits, "×" or equal bars (R3).
- **VO:** "ขามันดีดแรงขึ้นก็จริง… แต่ตัวก็หนักขึ้นตาม" (+3 → +88).
- **Sound:** M1 back at energy 2; S9 `reveal_warmth-fwoop_01` at +3; S10 floor groan +65–+95 (1.0 s).
- **Entry → exit:** plain giant → leg glowing, dial up, arrow down.
- **Acceptance:** glow, label and dial carry no figure (Boat R3) · label reads "แรงดีด ↑" whole inside the frame, not on the leg · dial pops after "แต่" (+53) · no dog.

### S01-B02-SH03 · 478–691 · backpack insert and refrain (L05, L06)

- **Camera:** CAM-INSERT `cam: target (0, 0.95, 0), yaw 0→3, r 2.9→2.7, eye 1.0, f 1300, hy 690` (MAN feet (361, 1138), head (361, 331), **807 px** computed at r 2.9).
- **Staging (D m):** MAN right profile at (−0.40, 0, 0); GHOST (MAN at 40 %, no glow, no pack) right profile at (+0.40, 0, 0); chart strip at (0, 0, −0.30). "ภาพจำลอง" in LBL +0 to the end.
- **Keys:** +5 coral glow on MAN's legs + "×2"; **+57 backpack** drops onto his shoulders + "×2" ("แบกเป้" `est`); L05 ends +92; +100–+105 both crouch; **+105 both take off** (0.20 m, 12 f; apex feet row ≈ 1049 at +111, dashed line at that row); **+117 both land** on one frame (2 f before L06 +119); both straighten +119–+127, dashed line stays; **+156 "ไม่ได้สูงขึ้นตาม"** (`est`): dashed line pulses once, MAN swaps to his `front` head, deadpan to the lens, to the end; **+196–+199 one deadpan blink** (SD07: the stare lasts 57 f, 26 f of it after L06).
- **VO:** L05 "เหมือนขาคุณดีดแรงสองเท่า… แต่แบกเป้หนักสองเท่า" (+3 → +92); L06 "ตัวใหญ่ขึ้น… กระโดดไม่ได้สูงขึ้นตาม" (+119 → +187).
- **Sound:** A2 hush; S11 backpack thump at +57; `whoosh_fast-slide_01` at +105; `foley_soft-landing-tap_01` (gain 0.6) at +117 (quieter than shot 14's thud); S12 `stinger_pizz-shrug_01` at +156; nothing on the blink.
- **Entry → exit:** MAN and ghost standing → both landed on one line, MAN front head deadpan.
- **Acceptance:** both feet on the dashed line at +111 within 4 px · landing on one frame · label on throughout (B-P6).

### S01-B03-SH01 · 691–785 · the tiny flea (L07)

- **Camera:** CAM-MACRO `cam: target (0, 0.45, 0) mm, yaw 0→4, r 4.0→3.6, eye 0.5, f 1200, hy 900` (slow push over 94 f).
- **Staging (M mm):** real flea at rest, legs folded (CL02 recall); "2 มม." bar; "ภาพจำลอง" in LBL.
- **Keys:** still; push only. Ends on the exact rest frame shot 12 opens on.
- **VO:** "แต่… แล้วหมัดตัวจิ๋ว กระโดดเก่งได้ยังไง" (+3 → +80).
- **Sound:** A2 hush (room tone out); M1 thins, energy 1.5.
- **Acceptance:** same flea drawing and pose as shot 2 +0 · no fur, skin or floor.

### S01-B03-SH03 · 785–917 · the spring pad (L09)

- **Camera:** CAM-MACRO-THORAX `cam: target (0, 0.55, 0) mm, yaw 0, r 2.9→2.7, eye 0.55, f 1200, hy 900` (F2 still).
- **Staging (M mm):** "ภาพจำลอง" in LBL. Body goes translucent +0–+6 (cut from the matching rest frame).
- **Keys:** **+9 "บีบ"** (`est`): amber pad squeezes (scale-y 1 → 0.7, glow up) to +37; catch icon clicks shut +39; hold to +71; **+71 "ปล่อย"** (measured run start): release, **flea gone at +72** in one frame, smear up, pad glow fading in the air +72–+89; **+93 "หนังสติ๊ก"** (`est`): slingshot icon (the B04 drawing, colour) pops in beside the empty spot; hold to the cut (L09 ends +106). Not slowed (label stays "ภาพจำลอง", FIX-4).
- **VO:** "มันบีบแผ่นยางยืดในตัวไว้… แล้วปล่อยทีเดียว เหมือนหนังสติ๊ก" (+3 → +106).
- **Sound:** S15 squeeze +9–+37; lock `foley_flashlight-click_01` at +39; **S16 snap + whip at +72**; M1 stops dead at +72; A2 hush only to the end.
- **Entry → exit:** rest → empty spot, slingshot icon (colour).
- **Acceptance:** pad compresses, never stretches (B-P4) · gone on one frame · icon drawing identical to shots 13–14.

### S01-B04-SH01 · 917–1135 · does the giant still need it? (L15, L16)

- **Camera:** CAM-CHART-2S `cam: target (1.45, 1.00, 0.35), yaw 0→−3, r 6.6→6.3, eye 1.15, f 2400, hy 740→716` (slow push over 218 f; floor row 1158 held; MAN 654 → 692 px; right edge ≈ x 2.94 → 2.90 at the plane, dog-free).
- **Staging (R m):** MAN front at (0.50, 0, 0.35), `neutral`; giant right profile at (1.85, 0, 0.35), rest (shot 3/8 anchors). Slingshot icon (shot-12 drawing, 90 px, colour) anchored to world (1.70, 1.25, 0.35) ≈ (631, 704) → (635, 678), re-projected each frame (DOM); "?" (ink, 40 px) at its upper right.
- **Keys:** +3 L15; **+5 icon pops in with "?"** (scale 0 → 1.1 → 1 over 6 f); +8–+16 the giant tilts its head up to the icon ("หมัดยักษ์" `est` +8); +30 MAN glances right at the giant; L15 ends +68 (light lift on "มั้ย"). **+84 the "?" pops off (2 f), icon fades colour → grey +84–+96, then stays grey to the cut** (R10; 2 f before "ไม่ค่อยต้องแล้ว" +86); +90–+98 giant's head levels (antennae shrug). **+121 "ขามันยาว": soft white light line** (N21; `#fff6e0` core, `#bfe3ff` glow 50 %, ≈ 10 px) travels along the near hind leg from the hip (1.45, 0.60, 0.35) ≈ (540, 940) through the knee to the foot (1.12, 0, 0.35) ≈ (420, 1158) over +121–+139; even faint glow to +169, out by +181; no figure, ruler, tick or label. +168 "กล้าม" (`est`): MAN's eyes leg → lens → leg by +181. L16 ends +198. **+208–+218 both settle their weight** (2 f anticipation, knees soften ≈ 5°) into the cut +218 before the crouch (SD07).
- **VO:** L15 "แล้วหมัดยักษ์ล่ะ… ยังต้องพึ่งหนังสติ๊กมั้ย" (+3 → +68); L16 "ไม่ค่อยต้องแล้ว… ขามันยาว มีเวลาให้กล้ามดันพื้นทัน" (+86 → +198).
- **Sound:** room tone back at +0 (A2 out); M1 resumes at +0, energy 2.5; **S21 question pluck at +5**; **S23 de-tune blip at +84**; **S22 rising tone +121–+139**, stopping as the light reaches the foot; M1 builds a little from +181 into the cut. SFX in syllable gaps (Editor ±3 f).
- **Entry → exit:** two-shot at rest, no icon → grey icon over the back, both settled, ready.
- **Acceptance:** icon never fades out, pops off or is crossed out (R10) · the light is light only · short flea legs not re-shown · no dog · +181–+208 is a held two-shot under the end of L16, not a frozen frame (the push keeps moving).

### S01-B04-SH02 · 1135–1279 · the truth shot (V02, L12)

- **Range note:** starts 20 f after L16 ends (gap-led): crouch and V02 sit in the inserted 24 f before L12.
- **Camera:** CAM-TRUTH **locked** `cam: target (1.45, 1.00, 0.35), yaw 0, r 10.0, eye 1.0, f 3600, hy 790` (no move; brief VD21).
- **Staging (R m, both on z 0.35):** MAN front at (0.50, 0, 0.35): feet (198, 1150), head (198, 502), **648 px**; giant right profile at (1.85, 0, 0.35): feet (684, 1150), head (1008, 772). **Greyed slingshot icon** 60 px anchored to (1.70, 1.25, 0.35) + the giant's jump height: ≈ (630, 700) at rest, (630, 570) at the apex; on screen to the cut; clear of tag (rows 190–300), band (970–1114) and inset (340–600, shown only after the landing).
- **Keys:** **+0–+8 crouch** (both, matched; MAN `new: standing-jump` crouch, giant legs fold); **+8 take-off** with V02 (G1143); **+17 apex** (MAN feet row 999 at 0.42 m, giant 1020 at 0.36 m); **freeze +17–+48 (31 f, SD03)**: band 0.10–0.50 m (rows 970–1114) fades in +18–+24 with "หลักสิบเซน" at its left end; tag "สูงพอ ๆ กัน" (rows 190–300) with a leader to the band pops at +24 with the word (G1159); **resume +48**, **landing +57** (both on one frame, 2 f before "แค่" +59); +91 "ไม่ใช่": **inset pops in** upper right (x ≈ 600–1040, rows ≈ 340–600; the SH04C apex frame, tape-stopped grey, card "ถ้าคิดแบบง่าย ๆ" inside, no ruler, no number); **+123 inset snaps off** (5 f after L12 ends +118); band and tag fade +123–+135; +105 MAN glances at the giant; both straighten; cut +144.
- **VO:** V02 MAN "ฮึบ!" +8 → ≤ +20 (subtitled); L12 "สูงพอ ๆ กัน… แค่หลักสิบเซน ไม่ใช่ร้อยเมตร" (+24 → +118).
- **Sound:** S17 crouch pair at +0; S18 jump pair + V02 at +8; **silence +17–+48** (music and room tone out, NAR only); S19 landing thud at +57 (Editor may move it earlier, never later than +57), room tone back; M1 back at energy 2 from +57; **TR7 braam echo** +91, cut dead at +123 (1.07 s audible, was 0.87 s; same file, longer slice) with a pitched-down `ui_click-tick_01` at +123.
- **Entry → exit:** settled two-shot (shot 13 exit, flattened by the lens change) → both standing after the landing, grey icon on the back.
- **Acceptance:** camera never moves (R05) · both apex feet inside the band, giant ≥ 15 px below MAN (R04) · tag says only "สูงพอ ๆ กัน" · inset beside, never on, the band, with the card (R09).
- **Cut note:** shot 13 ends at r 6.3, ≈ 381 px/m, floor 1158; this opens at ≈ 360 px/m, floor 1150: a small flattening, not a new angle. If the draft reads it as a jump, shot 13's push ends at r 6.0 (hy 698) instead.

### S01-B05-SH01 · 1279–1403 · the real measure (L13)

- **Camera:** CAM-CHART-LOW `cam: target (0.55, 0.85, 0.30), yaw −8→−4, r 2.75→2.60, eye 1.0, f 1400, hy 659→625` (SD01; MAN feet row 1158; MAN head (738, 260) → (753, 199), ≈ 900 → 960 px).
- **Staging (R m):** MAN front at (0.95, 0, 0.30), chart at screen left of him. Opens on the giant shrinking away about its feet.
- **Keys:** +0–+12 giant shrinks away (sparkle out by +20; no flea remains); **+21 "เซน"** (`est`): flea mark (line + tiny flea icon) ticks on at 0.15 m (row ≈ 1052 → 1037); **+52 "คุณ"** (measured run start): MAN's mark (line + tiny man icon) at 0.42 m (row ≈ 927 → 906); MAN glances down at both +55–+69; **+71 "สูงกว่า"** (`est`): P09 hands on hips, `smug` to the lens; hold to +124 (L13 ends +105); optional: one slow smug blink at +112.
- **VO:** "แต่ถ้าวัดเป็นเซน… ปกติ คุณก็กระโดดสูงกว่าหมัดตัวจริงอีกนะ" (+3 → +105).
- **Sound:** `comedy_shrink-pop-gliss_01` at +0; ticks at +21 (high) and +52 (low); M1 warm, energy 2.
- **Acceptance:** marks carry no digits (B-P3) · MAN's mark clearly higher · feet ≤ y 1160.

### S01-B05-SH02 · 1403–1542 · home, the dog sighs (L14, V03, hold)

- **Camera:** CAM-SOFA `cam: target (3.30, 0.70, 0.55), yaw 37→35, r 2.65→2.55, eye 1.15, f 1200, hy 850` (very slow push to the last frame).
- **Staging (R m):** MAN in front of his seat, feet (3.30, 0, 0.90), standing ≈ 911 px computed → `sit-down` (front, 1.8 s) +0–+54 onto (3.30, 0.30, 0.45), `relieved` → `neutral`. DOG at (4.15, 0.30, 0.45), asleep.
- **Keys:** L14 +3 → +60 as he settles; +65–+75 the dog lifts its head (`new: dog-head-lift-sigh`); **V03 sigh +71–+107**; lies back down +113–+125 (down by +121); hold to +139.
- **VO:** "หมัดดูเก่ง… ก็เพราะตัวมันเล็กมาก" (+3 → +60).
- **Sound:** S20 sofa press at +40; M1 dips under L14 and **fades to silence +30–+60** (no cadence note at the end); **S24 settle tone at +60** (new, NEEDS-GEN, replaces `stinger_pizz-tag-ending_01`, SD08): one soft felt-mallet vibraphone note, motor off, warm low-mid (around A3), struck once lightly with a round attack and no click, clean natural decay of about 2.0 s that thins to nothing by ≈ +120; dry, close in a small living room, quiet (about the room tone's level, well under the voice); the viewer should feel "case closed", a small content smile, not a fanfare; no plucks, no strings, no chord, no melody; ducks 6 dB at +71 so the dog's sigh is the button. S1 collar jingle at +65; dog sigh `creature_dog-sigh-exhale_01` at +71; room tone fades to zero at +138; no loop seam.
- **Acceptance:** dog never scratches and no flea in frame (R01) · the ending tone starts after the last word · no plucked or bowed string in the last 3 s · last frame silent.

## Sound cues for Ton

<a id="sound-cues-for-ton"></a>
All cue descriptions are in the brief's [Sound direction](film-brief.md#sound-direction) and Ton's [sound-cues.json](sound-cues.json); only the timing-driven changes, the G frames and the new S24 are here. `fiction` = trailer bed (Boat R3). R2.1: every cue keeps its file and follows its anchor shot/word; **one new sound (S24)**, one cue dropped (`stinger_pizz-tag-ending_01`); no other regeneration.

| Code | G (R2.1) | G (R2.0) | Change |
| --- | --- | --- | --- |
| M1 pulse | in 6, dead 129; back 238; dropout 317–329; thins 691; dead 857; back 917; builds from 1098; out 1152–1192; back 1192; fades to silence 1433–1463 | in 6, dead 109; back 205; dropout 278–290; thins 611; dead 763; back 825; out 1029–1068; back 1068; ends under the tag | ending: fades out under L14 instead of running under the tag; the 56 s file still covers 51.4 s |
| room/soi, A1, A2, A3 beds | per shot blocks; room fade 1403 → zero at 1541 | 1254 → 1389 | ranges only |
| S1 breathing / jingle | 0–44; jingle 1468 | 0–27; 1316 | longer slice of the same file |
| S2 tick + S3 whoosh | 66 | 43 | — |
| S4 ticks | 72, 77, 82, 87, 92 | 48, 54, 60, 66, 72 | 5 f steps (were 6 f) |
| S5 grow | 100–126 | 80–106 | — |
| TR1 braam (fiction) | 129 | 109 | — |
| TR2 shadow pass (fiction) | 133 | 113 | — |
| riser `reveal_riser-tension_01` | 129–170 | 109–147 | last **1.37 s** (was 1.27 s) of the same file, dead stop on 170 |
| TR3 drum pulse (fiction) | 152, 159, 164, 167 | 129, 136, 141, 144 | — |
| TR4 launch (fiction) | 170 | 147 | — |
| A3 + soi 30 % (trailer) | 129 → 228 | 109 → 195 | — |
| TR5 height wind (fiction) | 182–194, near-silence to 207 | 156–168, to 177 | — |
| TR6 tape-stop | 207 | 177 | — |
| S7 droop | 213–237 | 183–207 | — |
| landing taps | 234, 278 | 201, 249 | — |
| S8 flinch sting | 325 | 286 | — |
| S9 / S10 | 383 / 445–475 | 335 / 392–422 | — |
| S11 / hop whoosh / tap / S12 | 535 / 583 / 595 / 634 | 480 / 515 / 527 / 570 | — |
| S15 / click / S16 + whip | 794–822 / 824 / 857 | 706–734 / 736 / 763 | — |
| S21 / S23 / S22 | 922 / 1001 / 1038–1056 | 830 / 905 / 937–955 | — |
| S17 / S18 + V02 / S19 | 1135 / 1143 / 1192 | 1012 / 1020 / 1068 | — |
| TR7 echo + tick | 1226–1258, tick 1258 | 1098–1124 | **1.07 s** audible (was 0.87 s), same file, cut dead |
| shrink pop / mark ticks | 1279 / 1300, 1331 | 1138 / 1165, 1189 | — |
| S20 sofa | 1443 | 1294 | — |
| ~~tag `stinger_pizz-tag-ending_01`~~ | — | 1311 | **dropped** (user, SD08) |
| **S24 settle tone** (new) | **1463** (B05-SH02 +60), ≈ 2.0 s, ducks −6 dB at 1474 | — | **NEEDS-GEN**, description in the B05-SH02 block |
| V03 dog sigh | 1474 | 1322 | — |

**S24 for Ton (generation brief):** source a vibraphone bar struck with a soft felt mallet, motor (vibrato) off; action one light stroke, round attack without a click, natural decay ≈ 2.0 s fading to nothing, no second note; material warm metal tone, low-mid (around A3), slightly dark, no bright overtones; space dry small living room, close mic, little reverb. Feeling: "case closed", a small content smile under the dog's head lift. Not a pluck, not a string, not a chord. Length 2.0–2.5 s file. Library check by Film (2026-11-09): no vibraphone or felt-mallet one-shot in the library; `tone_soft-sustain-reflective_01` and `stinger_outro-resolve_01` are not listened and were not described as a single struck note, so they do not fit as written.

<a id="pluck-audit"></a>**Plucked-string timbre elsewhere (audit for the user's note, no change made):** M1 itself is a pizzicato + marimba bed (`bed_comic-pizz-marimba-pulse_01`) under every narrated shot; S8 flinch (`comedy_pluck-knock-flinch_01`, one pizz pluck + woodblock, G325); S12 shrug (`stinger_pizz-shrug_01`, two pizz notes, G634); S21 question (`comedy_pluck-question-bend_01`, pizz pluck with a rising bend, G922); S23 (`comedy_blip-detune-sag_01`, a soft synth pluck, G1001). With the tag dropped and M1 faded out under L14, no pluck sounds in the last 3 s. If the user's note was about the pizzicato colour as a whole, M1 is the main carrier and would be the one to change (open question to the user, not decided here).

Library files still "not listened" (Ton confirms by ear before use): `reveal_riser-tension_01`, `whoosh_air-swish-rising_01`, `reveal_warmth-fwoop_01`, `stinger_pizz-shrug_01`, `comedy_shrink-pop-gliss_01`, `foley_soft-landing-tap_01`, `foley_flashlight-click_01`, `ui_click-tick_01`, `whoosh_fast-slide_01`.

## Prop states (pre-handoff check)

| Prop | Entry → exit per shot |
| --- | --- |
| MAN's phone | shot 1 face-down on his right thigh; not seen again (off the sofa during the macro cut, D06); not in shot 16 (on the sofa arm, unseen) |
| Backpack (insert) | shot 10 drops onto both shoulders at +57, worn to the cut; hands free for the crouch (straps only) |
| Slingshot icon | shot 12 colour from +93 → shot 13 colour +5, grey from +96 → shot 14 grey throughout, rides the giant; never removed |
| Trailer card | SH04 +0 → SH04C +40; inside the shot-14 inset +91–+123 |
| Marks (B05) | flea mark +21, MAN's mark +52, both to the cut |

## Boss and Editor handoff (W5.2 / W5.3)

- **Boss:** re-time the built plates to the [R2.1 table](#r21-boss-retime): `SHOTS` start/len for all 16 shots, the listed keys in `shots.ts` / `shot-layers.tsx` (`SPRING`, `JUMP`, `SOFA16`, `dogLift`, `muscleGlowAt`, the SH09 label/dial/arrow pops, the SH02 leap and counter, the SH04C hold/droop/card, the SH04D hop, the shot-10 jump, the shot-13 keys, the shot-15 marks), the SH05 ease fractions in `scenes.ts` `CAM_S8` ([0.095, 0.222]), the label text "แรงดีด ↑" (check its width on a still at +17 and +97), and the three small motions (SH05 antenna twitch + blink, shot-10 blink; shot-15 blink optional). Apex hold in SH04C 13 f (≤ 15 f); trailer card and R09/R10 limits unchanged. Stills for the changed keys: shots 2, 6, 9, 10, 14 (QA sheet).
- **Editor:** re-place the narration from the new read (PL02: cuts 5.58/9.97/35.20 s, shifts +10/+26/+72/+90; V01 G321, V02 G1143) in `narration-place.py` (TOTAL 1542, NAR path, CUTS, TAKES), the 51 cue frames + S24 in `sound-cues.json` / `sound-mix.py` (drop the tag cue, M1 segments as above), captions in `cues.ts` from the new voiced runs, and the composition duration check in `src/videos/edu-ep13/index.ts` (1390 → 1542). Measure the `est` anchors and move tied keys (PL05); run `caption-zone.py` on shots 5, 7 and 16 and on B02-SH01 at +17 (label vs caption band).
- **Draft checks for Film (next review):** SH04C's 13 f apex hold still reads as a hold, not a stall; SH05 and shot 10 tails stay alive; the B04-SH01 → B04-SH02 cut after the longer settle; the S24 ending against the dog sigh.

## Dependencies and open items

| Owner | Item | Status |
| --- | --- | --- |
| Boss | R2.1 re-time of the 16 built plates and the "แรงดีด ↑" label | open |
| Ton | S24 settle tone (NEEDS-GEN, 2.0 s); update the cue sheet frames | open |
| Editor | Re-place narration (Take B), cues, captions; duration 1542 | open |
| User | Whether the pizzicato colour of M1 (and S8/S12/S21) should also change ([audit](#pluck-audit)) | open question |
| Film | Review the next draft against the checks above | after W5.3 |

Element captures: look stills `out/edu13/look-frames/v5/` (LF01–LF03, F1–F6), `v6/LF04.png`, `v7/LF04b.png`; R2.0 draft `out/EDU-EP13-SHORT/draft/EDU-EP13-SHORT_A_fade.mp4` (slow6 timing; shows the built plates, not these frames).

## Change log

| Revision | Date | Author | Change |
| --- | --- | --- | --- |
| EDU-EP13-SHEETS-R2.0 | 2026-11-09 | Film | First timed sheets (W5.1) from the W4 voice lock (`measure.json`, slow6, 41.14 s). Narration cut into four pieces at line gaps, shifted +10/+26/+72/+90 f (lead-in, TR01, V01, crouch + V02). 16 shots, **1390 f = 46.33 s** (R1.5 est 1561 f ≈ 52.0 s). Per-shot VO split of ROWS-R1.5 kept; content unchanged. SD01 `hy` lowered on CAM-CHART-2S (770 → 740/682/716), CAM-CHART-LOW (700 → 659/625), CAM-FLEA-LEGS (860 → 759/719) so feet stay out of the caption band; SD02 trailer SH04 30 → 20 f, SH04C 45 → 39 f, card off +42 → +36; SD03 apex freeze 27 → 30 f; SD04 macro rest 16 f, counter every 6 f; SD05 ending tag +92 → +57, dog +95 → +62. Storyboard camera note "hy = row of the target" corrected to the kit's eye row. Ton cue lengths changed: S5 0.9 s, TR2 0.5 s, riser 1.27 s, TR3 0.53 s, TR5 0.4 s, S10 1.0 s. |
| EDU-EP13-SHEETS-R2.1 | 2026-11-09 | Film | W5.1 re-time for the R5 voice re-lock (Take B, Kore atempo 0.90, 46.17 s; `measure.json` block `r5b_B_slow10`, now the live pointer). Same four-piece placement and inserts (cuts 5.58/9.97/35.20 s, shifts +10/+26/+72/+90); 16 shots, **1542 f = 51.40 s** (was 1390 f). Same cut rules relative to the words; per-shot key changes in the R2.1 re-time table. SD03 freeze 31 f; SD04 rest 22 f, counter 5 f steps; SD06 trailer gap 43 f (SH04B +3 f tail, apex hold 13 f); SD07 longer V01 and crouch gaps (SH05 tail with antenna twitch and blink, shot 10 blink, B04-SH01 settle moved to its end); SD08 ending: pizzicato tag dropped (user), M1 fades under L14, new S24 felt-mallet vibraphone note (NEEDS-GEN). Script R5: L03/L05 "ดีด", B02-SH01 label "แรงดีด ↑" at +17. SH05 camera ease [0.095, 0.222]. All cue frames re-derived; riser slice 1.37 s, TR7 1.07 s. Pluck-timbre audit added. |
