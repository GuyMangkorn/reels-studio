# EG-EP01-SHORT — sequence index (timed scene sheets)

Deliverable: `EG-EP01-SHORT` · Revision: `EG-SC-R5` (timed, W5.1; plate-matched) · Status: **ready-for-dev** · Timing: **checked-with-audio** (voice lock, measured ±0.1 s; two words marked `est` below are not in the measure file)
Inputs: script [script.md](script.md) `EG-SCRIPT-R1.2` (L16 removed; Boat recheck L14–L15 pass, weak-source caveat F001) · fact-check [fact-check.md](fact-check.md) · brief [film-brief.md](film-brief.md) `EG-BRIEF-FILM-R1.3` (VD01–VD14) · timing [voice-timing.md](voice-timing.md) (`EG-EP01-SHORT-narration-lock.wav`, 64.81 s) · delivery [../delivery.md](../delivery.md) · task [../task.md](../task.md)
Target: 30 fps · `durationFrames` **1945** · 1080×1920 · composition offset 0 (all global frames below are composition frames; narration starts at frame 0)
Evidence: runtime unverified (nothing built yet) · render/samples none · audio sync = voice-timing.md · user approval: storyboard SS-R2 18/18 ok, look lock ok, voice lock ok; this timed revision is not yet user-reviewed (review page: pending)

Scene sheets (one shot = one timeline scene by default, [AGENTS.md](../../../AGENTS.md)): [sc01.md](sc01.md) S01 (7 shots) · [sc02.md](sc02.md) S02 (4) · [sc03.md](sc03.md) S03 (2) · [sc04.md](sc04.md) S04 (4). **17 shots** (SS-R2 had 18; `S03-B01-SH02` the siren panel is retired with L16, its ID is not reused).

## Shot map

Half-open global ranges `[start, endExclusive)`; every cut sits in a narration gap or inside the quiet lead of a line. `Cut rule` says why that frame.

| Shot | Beat | Range (global) | Frames | VO lines (global frames, voice-timing x30) | Cut rule | Clues |
| --- | --- | --- | --- | --- | --- | --- |
| `S01-B01-SH01` | S01-B01 | [0, 160) | 160 | L01 8–69 · L02 78–152 | mid-gap L02→L03 | CL06 |
| `S01-B02-SH01` | S01-B02 | [160, 228) | 68 | L03 167–218 | 10 f before L04 | — |
| `S01-B02-SH02` | S01-B02 | [228, 375) | 147 | L04 238–375 | at L04 end | CL02 |
| `S01-B02-SH03` | S01-B02 | [375, 530) | 155 | L05 397–475 · L06 490–518 | mid-gap L06→L07; door opens in the L04→L05 gap | CL01 |
| `S01-B03-SH01` | S01-B03 | [530, 611) | 81 | L07 541–604 | mid-gap | CL03 |
| `S01-B03-SH02` | S01-B03 | [611, 695) | 84 | L08 618–686 | mid-gap | CL03 |
| `S01-B03-SH03` | S01-B03 | [695, 789) | 94 | L09 704–778 (+22 f pause) | 11 f before L10 | CL03, CL07 plant |
| `S02-B01-SH01` | S02-B01 | [789, 845) | 56 | L10 800–838 | mid-gap L10→L11 | — |
| `S02-B01-SH02` | S02-B01 | [845, 955) | 110 | L11 851–945 | mid-gap L11→L12 | CL07 |
| `S02-B01-SH03` | S02-B01 | [955, 1015) | 60 | L12 963–1015 | at L12 end (door opens in the gap) | CL04 |
| `S02-B01-SH04` | S02-B01 | [1015, 1140) | 125 | L13 1034–1138 | 2 f after L13 end | CL05 |
| `S03-B01-SH01` | S03-B01 | [1140, 1396) | 256 | L14 1166–1279 · L15 1295–1390 | 6 f after L15 end | fact F001 |
| `S03-B01-SH03` | S03-B01 | [1396, 1512) | 116 | L17 1402–1493 | 4 f before L18 | fact F002 |
| `S04-B01-SH01` | S04-B01 | [1512, 1638) | 126 | L18 1516–1633 | 5 f after L18 end | CL04, CL07 |
| `S04-B01-SH02` | S04-B01 | [1638, 1728) | 90 | L19a "มันไม่ได้เสีย… มันแค่เปิดให้ใครบางคน" 1644–`est` 1728 | 6 f before L19 | CL01 payoff |
| `S04-B01-SH03` | S04-B01 | [1728, 1776) | 48 | L19b "ที่เดินผ่านคุณไป" `est` 1728–1763 | 5 f before L20a | CL05 payoff |
| `S04-B01-SH04` | S04-B01 | [1776, 1945) | 169 | L20a 1781–1820 · L20b 1845–1904 · silence 1904–1945 | 5 f before L20a | CL04, CL07 payoff |

Sum of frames = 1945. Gaps used for beat changes: L13→L14 (0.94 s, frames 1138–1166: push-in to the sensor box, `SC03`), L17→L18 (0.77 s, 1493–1516: card dissolves back to the painted door), L20a→L20b (0.85 s, 1820–1845: the pull-back is already finished, still wide, one breath), tail 1.35 s (1904–1945: the hold and the fade).

**`est` words.** `voice-timing.md` has line-level timing only. The L19 internal split (end of "…ใครบางคน" / start of "ที่เดินผ่านคุณไป") is estimated at **frame 1728 (57.6 s), ±8 f** from syllable count and the `เสีย…` pause. The `SH02`/`SH03` boundary is the only picture cut that depends on it. Editor: measure the onset of `ที่` on `EG-EP01-SHORT-narration-lock.wav` and move the boundary to that frame, **but never earlier than 1728** (the door must be closed at the cut, `SC04` SH02). Likewise the `โบกมือ`/`กระโดด` word edges inside L11 (est global 880 and 893) drive the wave and hop frames in `S02-B01-SH02`; snap them the same way (±8 f).

## Shared contracts (one home; sheets link here)

**Baseline and projection:** brief [Technical handoff](film-brief.md#technical-handoff) and decisions `VD04` (stations), `VD05` (glass stack), `VD06` (door clock), `VD13` (shadows), `VD14` (captions); not copied. Units metres, origin on the ground line at the door centre, +X right from station A, +Y up, +Z toward the street camera. Screen space is pixels, origin top-left, Y down, 1080×1920. Stations (brief VD04/VD11): A camera (0.5, 1.6, 5.5), f 950, horizon y 744; B (0.2, 1.6, 1.5) (R4; brief VD04 says (0.3, 1.6, 2.2)), f 587, horizon y 744; G (0.3, 1.6, 0.8); C (0.5, 1.6, 9.0), f 950, horizon y 960 (lens shift). Door opening on screen: A x 298..609, y 640..1020; B est x 108..812, y 509..1370 (R4, was x 220..700, y 584..1171); both centre x 460.

**Door clock `DOOR_CLOCK` (Film, scene-sheet constant; owner of `doorOpen(t)` is Boss, `VD06`):** `t` counts frames from the open command. `doorOpen`: 0 closed at t=0; rises to 1 at t=15 (ease-in-out); 1 on [15, 60); falls to 0 at t=75 (ease-in-out); 0 afterwards. Chime onset at t=3. Total 75 f (2.5 s). **The same function in all three openings** (S01-B02-SH03, S02-B01-SH04, S04-B01-SH02). Open commands (global): **380**, **1018**, **1653** (closed again at 1728, the earliest allowed SH02/SH03 cut).

**Casting (kit [README](../../../src/painted/kit/README.md), [CP-casting line](../../../docs/character-proportion-principles.md#cp-casting-line)):** the only cast member is `man-crop` (PEOPLE), seen as `man-crop right hand + bare forearm, P07 wave (first person)` (`S02-B01-SH02`), `man-crop right hand + bare forearm, P16 reach (first person, fingertips on the glass)` (`S04-B01-SH03`) and `man-crop, back view, P16 reach, small` (`S04-B01-SH04`, at the glass `YOU_GLASS` (0.3, 0, 0.8), no ground shadow, no reflection). No other person anywhere. Jump = camera hop. No animal.

**Captions (verbatim from the script, `…` as written; editor builds cues from the line frames above):** outline, high band, block bottom edge about y 560, inside the caption-safe box (x 120–888, y 288–1248) (brief: VD14). A caption cue runs from the line start to its end + 6 f; L19 is one cue across the `SH02`→`SH03` cut. Per-shot blocks give the cue frames. The stage keeps door, hand and figure below y 560.

**Audio spine (Editor builds at the voice lock; levels are Editor's):**
- Narration `EG-EP01-SHORT-narration-lock.wav`, offset 0, already post-processed (atempo 1.05, +3 dB curve from "คนที่หายไป"); no re-gap.
- Fridge/shop hum `room_shop-fridge-hum_01` (11.0 s, **not a loop**: cross-fade two copies) under the whole video from frame 0, the loudest thing in S01-B01; ducks −6 dB under S03; returns by frame 1884; is the only bed under the final fade (continuity with the video's first sound).
- Music: pad `tone_soft-sustain-reflective_01` (12.0 s) frames 0–530 energy 1–2; sparse felt-piano notes `bed_warm-pad-felt-third_01` (8.0 s) frames 160–789, low; **nothing** frames 779–800 (pause after L09, music to almost zero); S02 only the optional slow heartbeat; S03 a clean light pulse (NEEDS-GEN `SND-NG08` or candidate `bed_curious-explainer-light_01`, to be auditioned, 95 bpm vs a quiet card); drone `bed_dark-drone-sub_01` (18.5 s, loop) fading in from frame 1456 (under the riser) and full from 1493, fading out over [1846, 1878) (starts at the onset of L20b, true quiet before "คือ" at 1884).
- Riser `reveal_riser-tension_01` (3.69 s), end placed on frame **1493** (its peak stops dead at the end of L17, then the drone takes over).
- No stinger on the reveal. Silence policy: true quiet (fridge hum only) from frame 1884 to the end, including the 1.2 s after "คือคุณ".

**NEEDS-GEN list (not in the sound library, checked 2026-11-03):** `SND-NG01` generic two-tone entry chime (soft/distant/reverberant variant for S01-B02 and S04 echo; dry/close variant of the same sound for S02) · `SND-NG02` automatic sliding-door motor glide (open + close, 2.5 s, with the soft latch at the stop) · `SND-NG03` BTS viaduct pass-by (elevated rail hum, 3 cars, 3 s, no announcement) · `SND-NG04` quiet morning soi room tone with faint distant birds (6–12 s) · `SND-NG05` pot steam hiss (low) · `SND-NG06` ice settle tick (single, soft) · `SND-NG07` jump scuff on pavement (sneaker, two landings) · `SND-NG08` card wave tick/sweep + clean pulse bed. Existing and reusable: `foley_walk-sneakers-asphalt_01` (footsteps, S01-B02-SH01 and S02-B01-SH01/S04-B01-SH03 step-in), `tension_heartbeat-slow_01`, `reveal_riser-tension_01`, `bed_dark-drone-sub_01`, `room_shop-fridge-hum_01`. Brand rule: the chime is generic, not a chain's ([F107/F108](../research.md)).

## Items (dependencies, status)

| Owner | Item | Status |
| --- | --- | --- |
| Boss | Shared assets per brief table: `drawSoi`, `drawStorefront`, `drawViaductTrain`, pot/stool/glass, FPOV hand, small back-view figure, `SensorCard`, `doorOpen(t)` with the `DOOR_CLOCK` above, cast-shadow pass; `endHoldSec`/`endFadeSec` status unknown at this checkout (SC04 SH04 needs a 31 f fade-to-black) | missing / exists-unintegrated per brief; not started |
| Boss | Shot groups for painting (W5.2): G1 S01-B01…S01-B02 (4 shots), G2 S01-B03 (3), G3 S02 (4), G4 S03 (2), G5 S04 (4); station A and B plates share the door | proposal |
| Editor | Snap the two `est` word boundaries (L19 split, L11 words) to the lock wav; builds the audio spine; captions | open |
| Film | After Draft: revalidate CL04/CL07 on the first plates | open |
| Coordinator | Publish `review-rows.json` `SS-R3` (timed) to the existing page URL; record URL in delivery.md | pending |

Element captures: look stills only (`$REELS_STORE/projects/EG/previews/look-frames/ss-r2/`: LF01 + LF01-WAVE + LF01-REACH + LF05-START + LF05-GLASS; `LF02` soi, `LF03` stall, `LF04` card); they are look evidence, not plate evidence. Editor scene sample proposal: frame 1018 (S02-B01-SH04 open door at B) and frame 1881 (S04-B01-SH04 end of pull-back).

## Change log

- `EG-SC-R2` (2026-11-03, Film, user decisions after Boss plates; DF-20261103-eg-shot-plates): door centre at B is **x 460** (approved LF01), A is 453.6, so the A-to-B cut offsets the door by 6 px (accepted); wave uses the approved `LF01-WAVE` pose (wrist y 930, lift clock); hops are 0.2 m; `S01-B03-SH02` camera 0.42 m from the glass; `S01-B03-SH03` ends on the `LF03` framing; walk-in yaw is a lens shift; `S01-B02-SH02` uses a far-sky viaduct card tied to the tilt (frame range unchanged), train angle under Boss revision. Narration, audio, timing and IDs unchanged.
- Film opinion for Boss (S01-B02-SH02 train angle): the train should read side-on, running parallel to the viaduct deck (cars foreshortened only by the tilt, no yaw toward the camera), travelling left to right as specified; keep the 62 deg elevation card and the 3-car, no-silhouette rule.
- `EG-SC-R1` (2026-11-03, Film, W5.1): first timed revision from the voice lock. Shots 18 → 17 (siren shot `S03-B01-SH02` retired with L16). Q2 confirmed as proposed (user ok): cut at 1776 to station A with you at the glass, pull-back A to C over [1781, 1880), hold, fade. Pull-back length 99 f (3.3 s, brief said about 3 s) so it lands before "คือ" (1884). `S01-B02-SH03` door opens in the 0.72 s L04→L05 gap (not the script's 0.6 s: measured). `S04-B01-SH02/SH03` cut mid-L19 now at estimated 1728. `review-rows.json` SS-R3 timed. Nothing in script, narration or reveals changed.
- `EG-SC-R4` (2026-11-03, Film; user: closer to the door before the mechanism explanation): point B moves from 2.2 m to 1.5 m from the door: station B (0.3, 1.6, 2.2) -> (0.2, 1.6, 1.5) (x 0.3 -> 0.2 is an estimate that keeps the door centre at x 460 with f 587: 0.2 x 587 / 1.5 = 78 px, was 80 px). Wave/jump at B, door-B centre x 460, durations, frames and IDs unchanged. `S04-B01-SH03` still ends 0.8 m from the door; its step-in is now 0.7 m (was 1.4 m) over the same 18 f. Open: the bollard at (0.55, 0, 1.25) is 0.25 m ahead of the lens at 1.5 m and falls off the right edge of frame (see Door framing at 1.5 m).
- `EG-SC-R5` (2026-11-03, Film; user, page verdict on `S02-B01-SH01@draft`: "still standing a little far, move closer a bit, and the pole stays still, we must move closer to the pole"; chat: real door sensors detect at close range): point B moves from 1.5 m to **1.1 m** from the door and the walk now passes the bollard. Station B (0.2, 1.6, 1.5) -> (0.16, 1.6, 1.1), **f 587 -> 540** (estimate: at 1.1 m the door is x1.36 larger, opening would be x -20..940, 20 px cropped at the left; f 540 gives x ~18..902, y ~449..1530, sensor box top ~y 362, all inside 1080x1920; x 0.16 = 0.16 x 540 / 1.1 = 79 px keeps door centre x 460). Bollard moves (0.55, 0, 1.25) -> **(0.45, 0, 0.55)** (at z 1.25 it would be behind a camera at z 1.1): 0.62 m from the viewer at B, lower right (top ~x 825, y 1431; base below the frame edge; its long shadow runs right and away toward the door and is visible beyond ~0.73 m of ground depth); at the walk start (z 2.4) it is 1.87 m away, top ~(625, 948), so it visibly grows ~x3 over f 0-44. `S02-B01-SH01` walk z 2.4 -> 1.1 (1.3 m, was 0.9 m) over the same f 0-44. `S04-B01-SH01` same station. `S04-B01-SH03` keeps G at z 0.8 (`S04-B01-SH04` unchanged): the step-in is only 0.3 m (was 0.7 m); the f 540 -> G lens change over the same 18 f adds a ~x1.09 push, which should keep the move readable, but flag: weak if the Draft reads static. Open for Boss: re-check `LF01` / `LF01-WAVE` framing for f 540 and the new pole (wave hand and pole share the lower right: hand in front); pole at G is ~0.38 m from the lens at the right edge, its reflection beside the touch is to be re-checked. Durations, frames, IDs, narration unchanged.
