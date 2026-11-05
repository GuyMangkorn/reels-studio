# EDU-EP02-S01 — scene-sheet index (หัวหอมแก้แค้น)
Deliverable: `EDU-EP02-SHORT` · Revision: **SS-R3** (timed; SS-R3 changes S01-B05-SH03 only, every other shot as SS-R2) · Status: `ready-for-dev` · Timing: checked-with-audio (voice-lock measure, ±0.15 s; interpolated anchors ±0.2 s; syllable-estimated word frames marked `est`)
Inputs: script [EDU-SCRIPT-R1.1](../script.md) + fact-check [R1.1](../fact-check.md) (L01–L18, ALT-A out) · brief [EDU-BRIEF-R1.5](../brief.md) (VD01–VD16, SET-KITCHEN, `CELL`, `EYE`) · voice measure [`gemini-fast`](../voice-measure.md) ([json](../voice-measure.json); store `projects/EDU/narration/ep02/2026-11-05_ep02-narration-kore-fast.wav`, user-approved 2026-11-05) · storyboard rows SS-R1 → [review-rows.json](../review-rows.json) (SS-R2 now) · delivery record [../../delivery.md](../../delivery.md#edu-ep02-short-หัวหอมแก้แค้น-c1) · task file [../../task.md](../../task.md)
Target: branch `claude/education-topic-b84776` at `4b230f9` + uncommitted W5.2 v6 (`src/painted/edu02/kitchen.ts`, `eye.ts`) · 30 fps · **durationFrames 1771 (59.03 s)** · 1080×1920 · one composition, composition offset 0 (composition ID: Editor's choice under `src/videos/<episode>/index.ts`)
Evidence: runtime unverified (no timeline yet) · plates: look frames only (LF01 v6, LF02 v2, LF03 v6; user look lock 2026-11-05) · audio/subtitle sync: frames computed from the measure file, not yet checked in a blockout · user approval: storyboard SS-R1 0/23 verdicts; look frames approved

Scene sheets (one story scene `S01`, 23 shots, one shot = one timeline scene):
- [s01-b01-b02.md](s01-b01-b02.md) — B01-SH01…SH03, B02-SH01…SH02 (kitchen; hook, "only after the cut")
- [s01-b03-b04.md](s01-b03-b04.md) — B03-SH01…SH03 (`CELL`), B04-SH01…SH03 (kitchen, `EYE`)
- [s01-b05.md](s01-b05.md) — B05-SH01…SH05 (trick montage)
- [s01-b06-b07.md](s01-b06-b07.md) — B06-SH01…SH04, B07-SH01…SH03 (goggles payoff, close, `A_fade`)

## Clocks and narration placement

- **Composition clock** `c` (frames from 0). **Shot-local** `l = c − shot start`. **Narration file clock** `n` (seconds in the measure file). Ranges are half-open `[start, endExclusive)`.
- The narration file is placed as **seven segments**; each inserted gap is silence in the VO track for a non-verbal sound, a sting or a deadpan beat (none of these are in the file). Cut points sit inside measured silences on whole file frames; Editor snaps each to the nearest zero crossing (±10 ms) and checks it with a listen.

| Seg | File range `n` (s) | File frames | Placed at `c` | Offset (frames) | Gap inserted before it (reason) |
| --- | --- | --- | --- | --- | --- |
| N1 | 0.000–3.967 | 0–119 | 0 | 0 | — |
| N2 | 3.967–7.467 | 119–224 | 167 | +48 | **G1 48 f (1.60 s)**: chop + cook wail-sob L03 (B01-SH03) |
| N3 | 7.467–32.267 | 224–968 | 284 | +60 | **G2 12 f (0.40 s)**: deadpan pause after L04 (B02-SH01) |
| N4 | 32.267–35.400 | 968–1062 | 1049 | +81 | **G4 21 f (0.70 s)**: wah-wah sting after L11 (B05-SH02) |
| N5 | 35.400–37.767 | 1062–1133 | 1152 | +90 | **G5 9 f (0.30 s)**: shrug sting after L12 (B05-SH03) |
| N6 | 37.767–41.567 | 1133–1247 | 1232 | +99 | **G6 9 f (0.30 s)**: shrug sting after L13 (B05-SH05) |
| N7 | 41.567–54.160 | 1247–1625 | 1354 | +107 | **G7 8 f (0.27 s)**: goggles deadpan before L15 (B06-SH02) |

**Length (computed):** speech end n 53.97 s → c 1726 (57.54 s) = 53.97 s speech + 3.57 s inserted gaps (107 f); + end tail 45 f (1.50 s: live hold c 1726–1748, `A_fade` fade c 1748–1771, `endFadeSec` 0.75 → 23 f) = **1771 frames = 59.03 s ≤ 60 s** (0.97 s margin). The near-silence before L09 (0.38 s) and the beat gaps are the read's own pauses (no insert). If a built sob or sting runs longer than its gap, trim in this order: (1) G1 to 39 f (wail 0.8 s; −9 f), (2) drop L13 with B05-SH04/SH05 (−80 f plus G6, −89 f; script allows; B05 then ends on L12's shrug), never the end tail below 39 f.

## Shot map

| Shot | Beat / lines | `c` range | Frames | Claims / clues | Runtime mapping (planned) |
| --- | --- | --- | --- | --- | --- |
| S01-B01-SH01 | B01 L01 | [0, 57) | 57 | F005 | scene 1, painted plate `EDU2-B01-SH01` |
| S01-B01-SH02 | B01 L02 | [57, 116) | 59 | F001 F004 F005; LF01 | scene 2 |
| S01-B01-SH03 | B01 L03 (wail) | [116, 160) | 44 | dramatization | scene 3 |
| S01-B02-SH01 | B02 L04 | [160, 284) | 124 | F005 ("แทบ"), CL01 | scene 4 |
| S01-B02-SH02 | B02 L05 | [284, 324) | 40 | F001 | scene 5 |
| S01-B03-SH01 | B03 L06 | [324, 458) | 134 | F004 F001; LF02; `ภาพจำลอง` | scene 6 (in-canvas dissolve 15 f) |
| S01-B03-SH02 | B03 L07a | [458, 522) | 64 | F001 F002 | scene 7 |
| S01-B03-SH03 | B03 L07b | [522, 630) | 108 | F002 F003 | scene 8 |
| S01-B04-SH01 | B04 L08a | [630, 683) | 53 | F006 | scene 9 |
| S01-B04-SH02 | B04 L08b | [683, 779) | 96 | F006, CL02; LF03 | scene 10 |
| S01-B04-SH03 | B04 L09 | [779, 875) | 96 | F006 | scene 11 |
| S01-B05-SH01 | B05 L10 | [875, 928) | 53 | — | scene 12 |
| S01-B05-SH02 | B05 L11 | [928, 1050) | 122 | F016 | scene 13 |
| S01-B05-SH03 | B05 L12 | [1050, 1154) | 104 | F015 | scene 14 |
| S01-B05-SH04 | B05 L13a | [1154, 1186) | 32 | F011 | scene 15 (cut-first with SH05) |
| S01-B05-SH05 | B05 L13b | [1186, 1234) | 48 | F011 | scene 16 (cut-first) |
| S01-B06-SH01 | B06 L14a | [1234, 1302) | 68 | F012 | scene 17 |
| S01-B06-SH02 | B06 L14b | [1302, 1355) | 53 | F012 | scene 18 |
| S01-B06-SH03 | B06 L15 | [1355, 1423) | 68 | F012 F006 | scene 19 |
| S01-B06-SH04 | B06 L16 | [1423, 1548) | 125 | F009 F010 | scene 20 |
| S01-B07-SH01 | B07 L17 | [1548, 1606) | 58 | F020, CL03 | scene 21 |
| S01-B07-SH02 | B07 L18a | [1606, 1686) | 80 | F020 (metaphor) | scene 22 |
| S01-B07-SH03 | B07 L18b + end | [1686, 1771) | 85 | F005 F020 | scene 23, `A_fade` |

Sum 1771 frames. Plate IDs are proposals; Editor owns the timeline JSON and Boss the plate modules.

## Baseline (deltas from the brief only)

- Set, axes, targets and macro spaces: [brief set plan](../brief.md#set-plan--set-kitchen-world-metres). **Changed in R1.5 (brief):** hero onion Ø 0.14 m (radius 0.07) at (−0.35, 0.984, 0.00) on the board x −0.62..−0.10, z −0.17..0.15; `T-ONION` = (−0.35, 0.984, 0.00) (`src/painted/edu02/kitchen.ts` `SET`, `T`, W5.2 v6). All five `T-ONION` cameras are re-estimated in the sheets for this size instead of a per-shot hero scale (one projection owner, no scale cheat).
- **Captions (video-level decision, coordinator 2026-11-05):** `captionStyle.bottomEdgeY: 1344`, at most two lines, block band **y 1176–1344** for every shot (supersedes `position: 'middle'` in VD16). Frame zone: faces, the hero onion in onion shots, the eye and every doodle stay out of y 1176–1344 (the middle of the frame is now free). Board, knife hands and the onion in medium shots of the cook may pass under the band (recorded per shot). One-line cues occupy about y 1254–1344.
- Cook anchors used in the projection checks: ground (0, 0, −0.55), head top with curls y 1.66, eyes 1.40, chin 1.215, island far edge (0, 0.90, −0.30) as the visible lead bottom; fridge stand (1.80, 0, −0.45).
- Projection checks: `python3 -I scripts/shot-projection.py` on each world-space shot's start and end camera (yaw camera converted to position, direction with pitch, `vfov = 2·atan(960/f)`, `shift_y = (hy − 960)/1920`); JSON inputs were scratch files, numbers recorded in each shot block. Calibration against Boss's v6 geometry: the onion tip reads 36–50 px lower than Boss's row scan (tip height 1.08 m assumed), so tip clearances are quoted with that margin.

## Assets and capabilities

| ID | Owner path | Status (at `4b230f9` + W5.2 v6, read 2026-11-05) | Consumers / gap |
| --- | --- | --- | --- |
| N1 `kitchen-apron` | `src/painted/edu02/cast.ts` (`COOK`, `paintBibApron`) | exists-unintegrated (look frames) | all kitchen shots |
| N2 SET-KITCHEN | `src/painted/edu02/kitchen.ts` (`paintKitchen`, `SET`, `KITCHEN_LIGHT`) | exists-unintegrated; fridge interior (shelves, inner walls, cold light) **missing** | all kitchen shots; interior for B05-SH04 |
| N3 knife grip + `chop motion` | `kitchen.ts` (knife held up, LF01) | held-up pose exists-unintegrated; chop motion, put-down/pick-up **missing** | B01-SH03, B02-SH02, B04-SH03, B05, B06, B07-SH03 |
| N4 onion whole / halves / frosty / pieces | `kitchen.ts` `paintOnion` (whole, v6) | whole exists-unintegrated; halves (cut face), slice pieces, frosty tint + frost **missing** | B01–B07 |
| N5 cell macro + burst | `src/painted/edu02/macro.ts` (`paintCellMacro`, `burst`) | exists-unintegrated (LF02); timed pulses, orange/violet/lilac steps per shot unverified | B03 |
| N6 eye macro + sparks + tear wave | `src/painted/edu02/eye.ts` (`paintEyeMacro`, v6) | exists-unintegrated; **W5.2 N6 polish open**: LF03 mist (third wisp barely shows, filaments), nerve halo, upper-lid shadow (user accepted LF03 v6 with these carried); f71 tear-wave refraction line over the pupil | B04-SH02 |
| N7 droplets, waterfall tears, lilac mist in the kitchen | — | **missing** (eye mist exists only in `eye.ts`) | B01-SH03, B02-SH02, B04, B05, B06 |
| N8 bread, candle + match, swim goggles | `cast.ts` mentions goggles (colour only) | **missing** | B05-SH02, B05-SH03, B06–B07 |
| N9 doodles "?", red ✗, alarm bell (draw-on, wiggle) | — | **missing** | B05, B07 |
| Cook poses P02, P06, P23, P24, P25, P07 variant | kit `poses.ts`; `views.ts` `squareToCam` | existing-integrated (kit) | per shot casting lines |
| `scene.eyebrow` `ภาพจำลอง`, `painted.shots[].dissolveSec`, `video.ending 'A_fade'` + `endHoldSec`/`endFadeSec`, `captionStyle.bottomEdgeY` | `src/scenes/types.ts`, `painted.ts`, `endings.ts` | existing-integrated | B03–B04, B03-SH01, B07-SH03, all |

Dev findings linked: DF-20261029-painted-timeline-dissolve (B03-SH01), DF-20261030-painted-fog-front-depth-gate (mist in front of the face: B04-SH01, B05, B06-SH03), DF-20261030-painted-glass-sheen-veil (goggles), DF-20261030-painted-arm-depth (chop arms), DF-20261030-painted-story-hold-ambient-clock (end hold), DF-20261030-zcpaint-persp-floor-clip-behind-camera (fridge interior camera), DF-20261030-painted-layer-order (all). Not revalidated in this pass (planning only).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | Groups for W5.2 (3–5 shots each): G-A B01-SH01/SH02/SH03 + B02-SH01/SH02 (N3 chop, N4 halves, N7 droplets); G-B B03-SH01/SH02/SH03 (N5 timed states); G-C B04-SH01/SH02/SH03 (N6 polish, N7 mist + waterfall tears); G-D B05-SH01…SH05 (N8 bread/candle, N2 fridge interior, N4 frosty, N9 "?" ✗); G-E B06-SH01…SH04 (N8 goggles); G-F B07-SH01…SH03 (N9 bell) | open |
| Boss | LF01-derived B01-SH02 plate with the caption fix (`hy 713`, dolly end r 1.14) and a frame check that the onion tip stays ≥ 1350 px | open |
| Editor | Composition, narration segments N1–N7, the vocal takes (L03 wail, sniffs, muffled sob) and stings in the gaps, captions at `bottomEdgeY 1344`; caption shade decision (cream wall p95 ≈ 0.73 in 860–1248; skin p95 ≈ 0.40 in 1176–1344) | open |
| Editor | Word-level check of the `est` word frames (L06, L14 "แว่น", L16) with a listen; Whisper dropped L08–L11 on this read | open |
| Film | Fresh-pass review of Boss/Editor frames against these sheets (W5.3) | later |

Element captures: look frames `projects/EDU/previews/look-frames/ep02/v6/` (`EDU2-LF01_f{0,24,47}`, `EDU2-LF03_f{0…101}`, sheets) and `.../v2/` (`EDU2-LF02`); illustrative only, from `src/painted/edu02/look-index.ts`. Editor scene sample proposal: B01-SH02 c 86 (LF01 framing with the caption block) and B04-SH02 c 735 (eye + bottom caption).

Review page: rows updated to SS-R2 in [../review-rows.json](../review-rows.json) (timed, Thai); **review page: pending** (coordinator builds and republishes to the same URL).

## Change log

- 2026-11-05 **SS-R2** (Film W5.1, timed from voice measure `gemini-fast`): first scene sheets; 23 shots kept with their IDs and order; narration split into N1–N7 with six inserted gaps (107 f); total 1771 f = 59.03 s; video-level bottom caption band 1176–1344; `T-ONION` cameras re-estimated for the Ø 0.14 m onion (B01-SH01, B02-SH01, B02-SH02, B06-SH04, B07-SH01, B07-SH02); B01-SH02 caption fix (`hy 593 → 713`, dolly end r 1.10 → 1.14, yaw end −32 → −34); lead-size fixes B05-SH01 (r 1.80 → 1.70) and B05-SH03 (r 1.60 → 1.45); candle moved off the enlarged board to (−0.02, 0.92, 0.04); B07-SH02's rise replaced by a push (onion base stayed out of the band). SS-R1 was untimed rows only.
- 2026-11-05 **SS-R3** (Film, viewer check Draft r1 `viewer-check-draft-r1.md`): S01-B05-SH03 only, camera r 1.45 → 1.20, pillar candle Ø 0.08 × 0.16 on a saucer Ø 0.13 at (0.00, 0.90, 0.12), matchbox (0.10, 0.90, 0.18), "?" (480, 205) 100 px above her head; details in [s01-b05.md](s01-b05.md#change-log). Applied by Boss W5.3 fix round 2 (AI13, owner Film): measured head 308 px, lead 566 px, candle 83.9 px at c 1072 (sheet ≥ 86) to 89 px at c 1145; also B05-SH04 hand redrawn (user note) and the B05-SH03 left elbow bent (`lBend`), both in the s01-b05.md change log.
- 2026-11-05 **W6 Final fix** (Boss, AI13; owner Film to accept or revise; user N1/N2 on the Final cut): every EDU-EP02 plate paints the Final with the Draft's flat washes (`src/painted/edu02/flat.ts`, no textured bleed or hatching, so the Final no longer shimmers); S01-B05-SH03 hand painted once (see [s01-b05.md](s01-b05.md)). No content, timing or camera change.
- 2026-11-05 **SS-R4** (Film, viewer check Draft r2, build-notes "EP02 W5.3 viewer check r2 (Film)"): AI13 decisions on Boss W5.3 fix rounds 1–4 recorded in s01-b03-b04.md (tag c 333 / labelTop 200, blade from the lower left, tear on the bottom wall), s01-b05.md (candle ≥ 83 px), s01-b06-b07.md (blinks l 45 + l 58, O4 root lens-left, B07-SH03 bell (785, 626) 110 px). Timing, narration and IDs unchanged.
