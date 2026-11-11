# EDU-EP03-S01 — scene-sheet index (ลูกบอลสีแดงที่หมามองไม่เห็น)
Deliverable: `EDU-EP03-SHORT` · Revision: **SS-R3.2** (timed; content changes vs SS-R2 only in S01-B02-SH03 and S01-B06-SH02; SS-R3.1 applies the W5.2 findings; SS-R3.2 re-times the B06-SH02 run and adds its pan, see change log) · Status: `ready-for-dev` · Timing: checked-with-audio (silence boundaries of the locked files, ±0.15 s; in-line word anchors marked `est` are syllable-proportional, ±0.2 s)
Inputs: script [EDU-SCRIPT-R1.1](../script.md) (L01–L11, O1, O2, L03a; ALT-A out) · fact-check [R1](../fact-check.md) + [R1.1](../fact-check-r1.1.md) · brief [EDU-BRIEF-R2.2](../brief.md) (VD01–VD12, R2 D1–D8, set plan `PARK`) · voice [voice-measure.md](../voice-measure.md) `kore-v1` + `owner-v1` (user-approved 2026-11-05) · storyboard rows SS-R2 (15/15 user-passed 2026-11-05) → [review-rows.json](../review-rows.json) SS-R3 · task file [../../task.md](../../task.md#edu-ep03-short)
Target: branch `claude/edu-ep-storyboard-7eb1ca` at `31f4966` + uncommitted W5.2 plates · 30 fps · **durationFrames 1571 (52.37 s)** · 1080×1920 · one composition, offset 0 (ID: Editor's choice under `src/videos/edu-ep03/`, not yet created)
Evidence: runtime unverified (no timeline yet) · plates: look frames v5 (`31f4966`) and W5.2 shot plates `src/painted/edu03/shots.tsx` (uncommitted; stills in the store `projects/edu/EDU/previews/shots/ep03/w52-*`; Boss report: [build-notes W5.2](../../build-notes.md#ep03-w52-shot-plates-2026-11-05-boss)) · audio/subtitle sync: frames computed from the locked files, not yet checked in a blockout · user approval: storyboard SS-R2 15/15; voice approved

Scene sheets (one story scene `S01`, 15 shots, one shot = one timeline scene):
- [s01-b01-b02.md](s01-b01-b02.md) — B01-SH01…SH02, B02-SH01…SH04 (hook, throw, miss at `V-BALL`, owner, dog close)
- [s01-b03-b04.md](s01-b03-b04.md) — B03-SH01…SH03 (dog-view flip, wide, split), B04-SH01…SH02 (3 vs 2 cones, `ขาวดำ` struck, flip back)
- [s01-b05-b07.md](s01-b05-b07.md) — B05-SH01 (nose find), B06-SH01…SH02 (blue ball payoff), B07-SH01 (question, hold, `B_loop`)

## Clocks and audio placement

- **Composition clock** `c` (frames from 0). **Shot-local** `l = c − shot start`. **Narration file clock** `n` (seconds in `narration-ep03-kore.wav`). Ranges are half-open `[start, endExclusive)`.
- **Method (no Whisper for EP03):** `ffmpeg silencedetect` on the store files at −35 dB / 0.15 s and −40 dB / 0.15 s (logs `out/logs/ep03-sil-35.log`, `ep03-sil-40.log`) gave 25 speech runs; −30 dB / 0.07 s (`ep03-sil-30-short.log`) gave comma pauses inside runs. The runs were matched to the TTS text phrases (`out/ep03-voice/text.txt`; commas and line breaks) by order and syllable count: every line break falls on a 0.35–0.65 s silence, every comma on a 0.18–0.45 s silence, and all 25 runs are used with no remainder. Line on/off times are run boundaries (±0.15 s); word anchors inside a run are `est`.
- **Measured line map (file `n`, s):** L01 0.27–1.79 · L02 2.14–4.72 · L03 5.37–7.97 · L04 8.46–10.81 · L05 11.22–13.21 · L06 13.79–16.54 · L07 17.19–21.45 · L08 21.97–27.37 · L09 27.93–31.87 · L10 32.43–36.81 (L10a "คราวนี้ลองลูกสีฟ้า" 32.43–33.71, L10b 34.16–36.81) · L11 37.39–40.55.
- **Owner files (Algenib):** each holds **two shouted phrases**, not one: O1 `owner-o1.wav` 2.08 s, speech 0.157–0.973 ("ไปเลย!") + 1.208–1.793 ("เอามา!") = **1.64 s**; O2 `owner-o2.wav` 2.32 s, speech 0.312–1.035 ("ตรงนั้นไง!") + 1.287–2.092 ("ข้างหน้าเลย!") = **1.78 s**. The measure file's "speech about 0.16–0.99 / 0.31–1.05" covers the first phrase only; the slots below use the measured full length. Trim: O1 uses file 0.10–1.85, O2 file 0.25–2.15 (lead/tail padding cut, 0.06 s kept each side).
- The narration is placed as **six segments**; each inserted gap is silence in the VO track for action, owner lines or a sound beat. Cut points sit inside measured silences on whole file frames; Editor snaps each to the nearest zero crossing (±10 ms) and checks it by ear.

| Seg | File range `n` (s) | File frames | Placed at `c` | Offset (f) | Gap inserted before it (reason) |
| --- | --- | --- | --- | --- | --- |
| N1 | 0.000–4.900 | 0–147 | 0 | 0 | — |
| N2 | 5.200–27.667 | 156–830 | 379 | +223 | **G1 223 f (7.43 s, net of 9 f dropped silence)**: throw + O1 (B02-SH01), miss run (B02-SH02), O2 (B02-SH03) |
| N3 | 27.667–32.200 | 830–966 | 1061 | +231 | **G2 8 f (0.27 s)**: 15-f flip back to normal after L08's last word (B04-SH02) |
| N4 | 32.200–34.000 | 966–1020 | 1203 | +237 | **G3 6 f (0.20 s)**: happy snort + tail thumps after L09 (B05-SH01) |
| N5 | 34.000–37.100 | 1020–1113 | 1264 | +244 | **G4 7 f (0.23 s)**: blue-ball throw follow-through, sweep in before L10b (B06-SH01/SH02) |
| N6 | 37.100–40.760 | 1113–1223 | 1377 | +264 | **G5 20 f (0.67 s)**: happy bark + 10-f flip back (B06-SH02) |

| Owner clip | File range (s) | Placed at `c` | Speech `c` | Shot |
| --- | --- | --- | --- | --- |
| O1 | 0.10–1.85 | 164 | 166–215 ("ไปเลย!" 166–190, "เอามา!" 197–215) | B02-SH01 |
| O2 | 0.25–2.15 | 316 | 318–374 ("ตรงนั้นไง!" 318–342, "ข้างหน้าเลย!" 349–374) | B02-SH03 |

**Length (computed):** VO speech end n 40.55 → c 1481; + end hold 90 f (3.00 s, live wag and breath, `B_loop`) = **1571 f = 52.37 s ≤ 60 s; margin 7.63 s (229 f)**. Non-verbal time: G1–G5 264 f (8.80 s) − 9 f dropped silence + 90 f hold. If a built action runs long, spend the margin in this order: (1) B02-SH02 miss run +≤ 20 f, (2) B06-SH02 run/bark +≤ 15 f (SS-R3.2: the +15 f run stretch was taken inside the shot, margin not spent), (3) end hold +≤ 30 f (≤ 4 s); every extension shifts later segments by the same frames and is recorded here. Nothing needs cutting.

## Shot map

| Shot | Beat / lines | `c` range | Frames | Claims / clues | Runtime mapping (planned) |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 L01 | [0, 60) | 60 | F003 F006; LF01 | scene 1, loop seam target |
| S01-B01-SH02 | B01 L02 | [60, 150) | 90 | F003 F006 | scene 2 |
| S01-B02-SH01 | B02 O1 (throw) | [150, 218) | 68 | F011 | scene 3 |
| S01-B02-SH02 | B02 L03a (miss) | [218, 312) | 94 | F011, CL01; `V-BALL` 1/4 | scene 4 |
| S01-B02-SH03 | B02 O2 | [312, 376) | 64 | — | scene 5 |
| S01-B02-SH04 | B02 L03 | [376, 466) | 90 | F012 lead-in | scene 6 |
| S01-B03-SH01 | B03 L04 (flip) | [466, 553) | 87 | F003 F012, CL01→; LF02; `V-BALL` 2/4; tag on | scene 7 |
| S01-B03-SH02 | B03 L05 | [553, 628) | 75 | F005, CL02; LF01-dogview | scene 8 |
| S01-B03-SH03 | B03 L06 | [628, 729) | 101 | F003 F006 (split VD09a) | scene 9 |
| S01-B04-SH01 | B04 L07 | [729, 874) | 145 | F001 | scene 10 |
| S01-B04-SH02 | B04 L08 | [874, 1061) | 187 | F002; LF03; flip back, tag off after c 1060 | scene 11 |
| S01-B05-SH01 | B05 L09 | [1061, 1204) | 143 | F007; `V-BALL` 3/4 | scene 12 |
| S01-B06-SH01 | B06 L10a | [1204, 1260) | 56 | F011 | scene 13 |
| S01-B06-SH02 | B06 L10b + run + bark | [1260, 1376) | 116 | F005 F006 F012, CL02; `V-BALL` 4/4; tag whole shot | scene 14 |
| S01-B07-SH01 | B07 L11 + hold | [1376, 1571) | 195 | CL03 | scene 15, `B_loop` |

Sum 1571 f. Dog-view tag `ภาพจำลอง (โดยประมาณ)` on: **[466, 1061)** and **[1260, 1376)** (every frame with any dog-view colour, from the first flip frame to the last flip-back frame; B07 untagged). Plate IDs are Editor/Boss proposals.

## Baseline (deltas from the brief only)

- Set, axes, targets, light: [brief set plan](../brief.md#set-plan--set-park-world-metres) with R2 values (`D0` (−3.85, 0, −0.85), lamp (+4.80, 0, −5.00), `V-BALL` yaw 44°, hy 910). `src/painted/edu03/park.ts` `POS.D0` = (−3.85, 0, −0.85) since `31f4966` (R2 value; was stale at `b21c402`).
- **New anchors (this pass, `PARK` m):** `B1` first in-frame bounce (−0.25, 0, −0.08) (brief "one low bounce"); `W` B06 turn point (−0.25, 0, −0.95) on the B02 run lane; owner kneel spot `OK` (−4.55, 0, −1.30) and dog sit spot `DS` (−3.75, 0, −1.15) (look.tsx B04 values); **`P6` (−1.65, 0, −0.95)** B06-SH02 off-frame run start, 1.40 m before `W` on the B02 lane (SS-R3.1, user 2026-11-05; **retired in SS-R3.2**: the run starts at `D0` again); `P` (+0.04, 0, −0.42) B06-SH02 stop (body centre, nose at `R0`); dog head target `T-DOG-HEAD` (+2.60, 0.65, −0.72) for B02-SH04.
- **`V-BALL` trucks are along the camera-right axis** (cos 44°, 0, sin 44°) = (0.719, 0, 0.695), written `cr` in metres from the LF02 position (−0.55, 0.20, 0.95). SS-R2's "truck x 0→+0.30" put the ball out of frame left in both readings (world x: ball x −76 px; camera-right: −43 px) and is replaced by `cr −0.25 → 0` (B02-SH02, B06-SH02) and `cr 0 → −0.20` (B05-SH01); B03-SH01 holds `cr 0` (= LF02). Ball, `S1` dog and the in-frame bounce stay inside x 60–1020 throughout.
- **Captions:** `captionStyle.bottomEdgeY: 1344`, ≤ 2 lines, band **y 1176–1344** in every shot (brief VD11). Faces, both balls, the dog's head and the B04 diagram stay out of the band; owner legs and dog legs may pass under it (recorded per shot).
- **Anatomy used in projection (est):** owner `man-crop` 1.76 m + cap: head top 1.80, eyes 1.55, chin 1.33, chest 1.20; kneeling (P34) head top 1.32, eyes 1.12, chin 0.92. `dog-golden` standing: head top 0.82, eyes 0.70, nose 0.60; sitting: head top 0.93, eyes 0.80, mouth 0.66. Ball Ø 0.10.
- **Projection checks:** kit `ycam.ts` formulas (`orbitYCam`, `camSpace` with pitch, x = 540 + f·r/d, y = hy − f·u/d) in a scratch script equivalent to `scripts/shot-projection.py` (the script takes look-at cameras; the yaw/pitch/hy form was projected directly to avoid a conversion error). Numbers are in each shot block. Calibration: my `V-BALL` ball Ø is 103 px where LF02 measured 88 px (painted disc smaller than `camUnit`); ball clearances quote the LF02-measured value where one exists.

## Assets and capabilities

| ID | Owner path | Status (at `31f4966` + uncommitted W5.2 plates, read 2026-11-05) | Consumers / gap |
| --- | --- | --- | --- |
| N1 `SET-PARK` | `src/painted/edu03/park.ts` (`paintPark`, `POS`, `T`, `K`) | exists-unintegrated (look frames v5, W5.2 plates); `POS.D0` = R2 since `31f4966` | all shots |
| N2 `park-casual`, cap, sling bag | `src/painted/edu03/cast.ts` (`OWNER`, `OWNER_B04`, `paintSlingBag(..., open)`) + kit shorts (`31f4966`) | exists-unintegrated; shorts fixed in the kit at `31f4966` (`paintShortsLegs` removed); bag flap open/close exists-unintegrated (W5.2, uncommitted) | all owner shots; flap B06-SH01 |
| N3 ball red/blue + ball path | `park.ts` `paintBallDisc`, `BALL_R`, `OwnerState.held` | disc + held ball exist-unintegrated; ball lane (L1 hit, `B1` touch l 12, rest l 26) exists-unintegrated in `shots.tsx` (W5.2, uncommitted) | B01, B02-SH01/SH02, B06, B07 |
| N4 `overhand-throw`, `ruffle` | `shots.tsx` arm keyframes, `park.ts` `rArm`/`lArm`/`lean` | plate approximations, exists-unintegrated (W5.2); not kit motions (kit intake) | B02-SH01, B06-SH01, B04-SH02 |
| N5 dog motions: `skid-stop`, `run-to-stop` (world path + turn at `W`), `nose-trail`, `pick-up-ball` + mouth anchor, `bark-once`, puzzled whine head pose | kit `animal-motions.ts` (`sniff`, `run-*`, `sit-down`, `happy-wag`, `speak`, `idle`) | run, pick-up, mouth anchor (`DogState.mouth`), bark: plate approximations in `shots.tsx` (W5.2, not kit motions); dog front view fixed in the kit at `31f4966`; **`new: head-low sniff (front)` missing** (Boss building, B02-SH04); front-view leg translucency in B01-SH02 open (W5.2) | B02–B07 |
| N6 dog-view map + radial sweep + split mask | `src/painted/edu03/dogview.ts`, `dog-view-pass.tsx` | full-frame map, sweep, flip-back and VD09a split masks exist-unintegrated (W5.2); S1 (f) seek parity: masked sweep frames identical across two Chrome sessions (B03-SH01 l 6, B06-SH02 l 5) | B03, B04, B06-SH02 |
| N7 chalk bubbles, cones, grey thought bubble | `shots.tsx` | exists-unintegrated (W5.2) | B04 |
| N8 positioned labels, `ขาวดำ` card + strike (screen layer) | `shots.tsx` DOM labels (W5.2) | plate stand-ins only, not the final label system (DF-20261030-painted-label-slots) | B04 |
| Tag label, `captionStyle.bottomEdgeY`, `video.chrome`, `video.ending 'B_loop'` + `endHoldSec`, `dissolveSec` | `src/scenes/types.ts`, `endings.ts` | existing-integrated (EP02 precedent) | all |
| Owner poses P05, P11, P34; expressions; `squareToCam`; `kneel-down`, `point-and-say` | kit | existing-integrated | per casting lines |

Dev findings linked (not revalidated in this pass): DF-20261030-painted-layer-order and DF-20261030-painted-screen-layers-overlay (colour map below screen layers), DF-20261030-painted-label-slots (tag + B04 labels), DF-20261030-ending-hold-option and DF-20261030-painted-story-hold-ambient-clock (B07 hold), DF-20261031-painted-opaque-cast (owner/dog washes), DF-20261030-painted-profile-head-turn (owner head acting), DF-20261030-zcpaint-persp-floor-clip-behind-camera (dog and ball paths that start behind the `V-BALL` camera: draw only when depth ≥ 0.6 m), DF-20261029-painted-timeline-dissolve (VD05 fallback).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | Shot groups (3–5 each): G-A B01-SH01/SH02 + B02-SH01 (N3 held/raised ball, N4 throw, `POS.D0` fix); G-B B02-SH02/SH03/SH04 (N3 ball path, N5 skid/sniff/whine, dog front-view fix); G-C B03-SH01/SH02/SH03 (N6 sweep + split, S1 (f) seek parity); G-D B04-SH01/SH02 (N7, N4 ruffle, flip-back mask); G-E B05-SH01 + B06-SH01/SH02 + B07-SH01 (N5 nose-trail, run-to-stop with `W` turn, pick-up, mouth anchor, bark-once; bag flap) | plated as stills (W5.2, 15/15, uncommitted) |
| Boss | SS-R3.1 re-plates: B02-SH04 `new: head-low sniff (front)` (head low l 0–40); B04-SH01 owner from kneel 0.4 at l 0, label 1 (560, 540); B06-SH02 run: superseded by the SS-R3.2 row below; B06-SH01 dog front all shot (as plated); B04-SH02 left-hand ruffle arm-length check | open |
| Boss | **SS-R3.2 B06-SH02 run re-plate** ([sheet](s01-b05-b07.md#s01-b06-sh02--straight-to-the-blue-ball-v-ball-44)): (1) **entry**: start at `D0`, launch l 34, path s(l) 1.00 m at l 46, 2.62 m at l 56, `W` at l 63, stop `P` l 75 (constant deceleration l 56–75); nose enters frame left mid-stride at l 56, no dog pixel before l 55, no pop-in or fade; (2) **side view**: right profile l 56–66, front only from l 67 (W5.3 plate used front for the whole leg); (3) **stride**: gallop cycle with legs alternately extended and gathered, phase driven by distance (≈ 1.4 m per stride, ≈ 10 f per cycle at 4.9 m/s → ≈ 14 f near the stop), body bob; braking stride l 71–75 (forelegs planted, hind legs under, head dips) at standing height, never the seated silhouette seen at c 1305–1308; (4) **camera**: `V-BALL` yaw term 44° (l 0–34) → 20° (l 34–54, smoothstep) → hold → 30° (l 58–80, smoothstep) → hold, `cr` unchanged; (5) re-timed beats: pick-up l 77–87 (ball in mouth l 83), head up l 87–93, bark mouth open l 96–102, flip-back centre ≈ (550, 450). Acceptance: the sheet's c 1316–1335 row on stills every 2 f + qa-sheet || done (W5.3 Boss, stills `out/edu03/w53c/`; see build-notes) |
| Editor | SS-R3.2: B06-SH02 paws c 1294–1335 (`foley_dog-paws-gallop-skid_01`, off-frame quieter to c 1315, skid c 1331–1335), happy bark c 1352 → **c 1356**; captions, segments and tag unchanged | open |
| Editor | Composition, segments N1–N6 and O1/O2 clips at the frames above, captions at `bottomEdgeY 1344`, tag ranges, B04 labels/card/strike (N8, with Boss), dog vocals and SFX at the shot-local frames in each Sound line, `B_loop` + an `A_fade` sibling | open |
| Editor | Listen check of the `est` word anchors (L07 "สองแบบ", L08 "ขาวดำนะ" and "ความเชื่อผิด ๆ", L10a "ลูกสีฟ้า") and the inserted gaps | open |
| User | Two staging changes from geometry (questions in [review-rows.json](../review-rows.json)): B02-SH03 dog off-screen; B06-SH02 run enters from the B02 lane and turns straight to the ball | decided (commit `2411469`); B06-SH02 start nearer than `D0` and B04-SH01 kneel 0.4 decided 2026-11-05 (SS-R3.1) |
| Film | Fresh-pass review of Boss/Editor frames against these sheets (W5.3) | later |

Element captures: look frames in the store `projects/edu/EDU/previews/look-frames/ep03/` v2 (`LF01.png`), v1 (`LF01-dogview.png`), v3 (`LF02.png`), v4 (`LF03.png`, `LF03-normal.png`, face measures); illustrative only, from `src/painted/edu03/look-index.ts`. Editor scene-sample proposal: B03-SH01 c 500 (dog view settled, ball above the band, tag) and B04-SH02 c 990 ("หมาเห็นสี", dog view faces, bottom caption).

Review page: rows updated to SS-R3 in [../review-rows.json](../review-rows.json) (timed, Thai); **review page: pending** (coordinator builds and republishes to the same URL).

## Change log

- 2026-11-05 **SS-R3** (Film W5.1, timed from voice `kore-v1` + `owner-v1`): first timed scene sheets; 15 shots, IDs, order and Thai unchanged; narration in six segments with five inserted gaps (G1–G5) and two owner clips; total 1571 f = 52.37 s, margin 7.63 s. Found and recorded: owner files carry two phrases each (1.64 s / 1.78 s, not ~0.8 s). Geometry corrections from projection: `V-BALL` trucks along camera-right (`cr −0.25→0`, `0→−0.20`), ball's first impact `L1` is off-frame so the in-frame touch is `B1`; B01-SH02 camera moved to put the dog foreground right (SS-R2 placed it in line with the owner); B02-SH04 orbits the dog's head (SS-R2 r 0.55 about the body put the nose behind the near plane), r end 0.60; B03-SH02 wide re-aimed (SS-R2 camera framed neither owner nor dog; lamp and flame-tree tangents checked); B06-SH01 camera lowered and pulled back (SS-R2 put the dog's eyes in the caption band); B07-SH01 hy 640→660 (blue ball in the dog's mouth clears the band; ends on B01-SH01 frame 0 for the loop). **Content changes:** B02-SH03 shows the owner alone (from any camera that sees his face, the dog at `S1` 7 m ahead of him is behind the lens; sniffing heard off-screen); B06-SH02 dog enters along the B02 lane and turns straight to the settled ball at `W` (a straight `D0`→`R0` line passes 1 m beside the `V-BALL` lens and is off-frame until the last 0.3 m), a deviation from brief VD08's literal path, kept to its intent (run starts after the ball settles, no catch, straight to the ball).
- 2026-11-05 **SS-R3.1** (Film, W5.2 findings, [build-notes](../../build-notes.md#ep03-w52-shot-plates-2026-11-05-boss)): user decisions applied: B06-SH02 run starts off-frame at new anchor `P6` (−1.65, 0, −0.95), 1.40 m before `W`, cruise 5 m/s l 34–40, brake l 40–43, turn at `W` l 43, decelerating leg to the stop at l 60 (SS-R3's `D0` start needed 13 m/s); B04-SH01 owner starts at kneel 0.4; B02-SH04 head-low beat kept with `new: head-low sniff (front)` for Boss. Film decisions: B03-SH02 cap/tee C* ≥ 35 (was ≥ 45; map fixed by S1, costume look approved); B01-SH02 dog at `D0` + 0.30 m x accepted; B06-SH01 dog front all shot accepted; B04-SH02 ruffle with his left hand accepted (+ arm-length check); B04-SH01 dog face read by features (ΔE 6.7 measured, owner 15.4). Stale asset rows (`POS.D0`, `paintShortsLegs`, shorts fix, masks, N7/N8) updated to `31f4966` + W5.2. Shot IDs, ranges, Thai and total 1571 f = 52.37 s unchanged.
- 2026-11-06 **SS-R3.2** (Film, W5.3 Draft finding: B06-SH02 run reads as a front-on, nearly seated pop-in, about 8 f, no stride; user: stretch the run window +15 f from gaps where narration and beats allow): B06-SH02 run window l 34–60 → **l 34–75**, the 15 f taken from the shot's own post-stop gaps (bark l 92 → 96 = c 1356, after L10b ends c 1348); start back at `D0` (`P6` retired, continuity cheat gone; 4.9 m/s cruise); `V-BALL` gets a nodal pan 44° → 20° → 30° after the l 0–34 comparison window so the gallop is seen in profile on the lane (visible run l 56–75 = 20 f). **Unchanged:** all shot ranges, narration segments N1–N6, owner clips, captions, tag ranges, total **1571 f = 52.37 s**, margin 229 f, `B_loop` seam (B07-SH01 untouched). New Boss and Editor rows above; review rows updated to SS-R3.2.
