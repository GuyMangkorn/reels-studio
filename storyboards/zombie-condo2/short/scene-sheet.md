# ZCONDO2-SHORT-TH: timed scene sheets (SS-ZC2-R1)
Deliverable: ZCONDO2-SHORT-TH · Revision: SS-ZC2-R1 · Status: ready-for-dev (see Boss dependencies; plates are blocked only where a G-item is listed) · Timing: checked-with-audio (measure file, not yet with blockout)
Inputs: script ZCONDO-SHORT-TH-R5 + fact-check (`scripts/zombie-condo2/short/script.md`, `fact-check.md`) · Film brief `VB-ZC2-SHORT-R2` (`storyboards/zombie-condo2/short/visual-brief.md`; decision IDs VD-ZC2-00..10, CL01..CL05) · rows `ZC2-SB-R3.1` (30 shots, user-approved 4 Nov 2026 incl. the B04-SH02 split; `review-rows.json`) · voice lock `scripts/zombie-condo2/short/voice-lock.md` (W4.2, user-approved W4.3) and measure file `ZCPAINT-SHORT-TH.lines.json` (40 lines) · caption shade table `$REELS_STORE/projects/ZCONDO2/previews/ZC2-SB-R3/shade/caption-shade-table.md` · delivery record `scripts/zombie-condo2/delivery.md`
Target: worktree `check-project-pipeline-4ec3f9` (uncommitted) · 30 fps · durationFrames 2877 (95.9 s) · 1080x1920 · composition offset 0 · narration `public/narration/ZCPAINT-SHORT-TH.mp3` (93.151 s, speech 0.000-92.870 s)
Evidence: runtime unverified (no timeline yet) · render/samples none (blockout stills only, `ZC2-SB-R3`) · audio sync: window cuts placed on the measured line onsets; word-level times inside a line are Film estimates (no word-level measure exists) and say `est.` · user approval of this sheet: none required beyond the page verdicts already given

## Intent and continuity
Intent, beats and visual progression are in the brief (link, not copied). This sheet adds the timing, the camera numbers, the animation beats and the sound cues. One shot = one timeline scene (AGENTS.md render-by-scene). Every cut is a hard cut (DF-20261029-painted-timeline-dissolve); the two sub-1 s shots B02-SH01/SH02 are an intentional rapid pair (27 f each, 0.90 s).
Continuity props (state at each shot is in the shot block; these are the invariants):
| Item | Rule |
| --- | --- |
| Trash bag | In the lead's right hand in B01-SH01; leaves the hand at the slam (B02-SH01); lies by the door in every later door-vantage shot (B02-SH05, B03, B09-SH03, B10) |
| Shoe cabinet | Absent until B02-SH04; from the end of pull 3 it covers the door from the left jamb, under the deadbolt, with open shelves and one fallen shoe, in every later shot that shows the door |
| Deadbolt | Locked from B02-SH02 on; no peephole at any time (CL05) |
| Light | Day 1 morning bands (B02) -> daylight only after the cut (B03) -> flat grey day 3 (B09-B10); B08 night |
| Lead | `man-crop` clean-shaven until B09-SH01; stubble (`head.facial stubble`) from B09-SH02 |
| Stove | Never lit; no ignition sound |
| Neighbours | Nobody outside is ever shown after B01 |

## Baseline and assets
Baseline, units and spaces: brief "Technical handoff" (scale baseline, `W-UNIT`, `W-CORR`, `D`, `S`); link, not copied. Scene constants:
- **Screen space `S`:** pixels, 1080x1920, origin top-left, +x right, +y down. Camera values use the kit `Camera` {s, fx, fy, dx, dy} (`src/painted/kit/camera.tsx`: `pushCamera(tl, len, {s0, s1, fx, fy})`, focus (fx, fy) in `S`, picture-stage transform). No shot moves a world camera; every move is a picture-stage push/pan of the painted plate (plate must be painted larger than the frame by the s1 factor: Boss).
- **Projection check:** `scripts/shot-projection.py` takes a world-space timeline shot and does not apply: all 30 shots are screen-plane kit frames (no world-space camera). Replaced by the measured caption-zone check on the approved blocking stills (shade table) and the lead-size estimates in the shot blocks (`est.`: read from the blockout still, Boss/Editor confirm on the first plate).
- **Captions:** `captions` come from `lines.json` (`caption` field), white, thick outline, inside x 120-888, bottom edge <= y 1344, channel mark `@TamMaiLa` top-left (project default). Shade: kit `CaptionShade`, cue-gated, `band` mode, peak per shot from the shade table (band 1080:1248; mean limit 0.25, p95 limit 0.40; rows list the peak). Cue frames below are shot-local = global - shot start; the shade follows the same cue [start, end) (ramp as the kit component defaults).
- **Findings applied:** see the brief; revalidate on the first Draft plates (DF-20261031-painted-opaque-cast for B01 infected, B08 silhouettes; DF-20261030-painted-arm-depth for B06-SH02; DF-20261031-povhand-wrist-corner for B02-SH02; DF-20261030-p5brush-large-fill-mottle for large washes).
- **Sound library:** every `sfx/...` and `audio/...` ID below is from `$REELS_STORE/library/sound/` and already used in the old ZCPAINT cue set (`cues-TH.json`) unless marked retimed. Sounds named `NEEDS-GEN`: none. (The old B04-SH02 pump label cue used no sound; a pump hum from `sfx/hum` is optional.)

### Boss work list for W5.2 (pose gaps first)
Each pose is designed from the beat, then checked against P01-P45 and the kit motions (story first); the nearest kit entry is the fallback if Boss cannot deliver it.
| ID | Pose / gap | Shot(s) | Beat it must carry | Nearest kit entry / fallback |
| --- | --- | --- | --- | --- |
| G1 | `drag`: profile facing right, leaning back, both hands gripping the cabinet near edge, knees bent, back foot pushing; 3-pull cycle (8 f each) | B02-SH04 | Desperate effort to block the door while still thinking "I must undo it fast" | P16 as the base; fallback: `walk-out-to-left` with the cabinet carried by the picture stage |
| G2 | `hand_to_mouth_sit`: P33 + right fist pressed to the mouth (P12 right hand on P33), left arm round the shins, eyes up to the lock; thumb flaw from the r6 frame must not be worse | B02-SH05 | Fear, holding the breath; stillness is the content | P33 plain with the hand drawn by the shot (approved r6 frame already shows it) |
| G3 | `reach_shelf`: P08 one arm up, profile, slides a case onto the top shelf | B07-SH02 | Putting the danger away; the room closes up | P08 held, picture-stage slide of the case |
| G4 | `pour`: P26 carry variant, bucket at belly then tipped to ~100 deg over a bowl, both hands on handle and base, wrist angle follows the bucket | B05-SH02 | One strong pour, the confident act | P26 held, tilt of the bucket prop alone |
| G5 | `fists_on_door`: P15 profile variant, both fists and the near shoulder on the door leaf, then recoil (`gasp-recoil` 0.4 s) | B02-SH01 | Slamming the door shut in panic | P15 open palms |
| G6 | `bag_carry_back`: back-view P01, right hand low carrying the trash bag (`new: trash-bag` prop, ~0.3 m); bag release at the slam | B01-SH01, B02-SH01 | Ordinary chore, then the world changes | back-view P01, bag drawn as a hand prop |
| G7 | `seated_blanket`: P33 profile on the floor by the sofa, thin blanket over shoulders and lap (`new: blanket`), stubble head; `turn-head-left/right` toward the door | B09-SH02 | Day-3 exhaustion; hears the voice | P33 + blanket as a prop |
| G8 | `rail_lean_back`: back-view P01, forearms on the balcony rail, flat silhouette | B08-SH01, SH02 | A person alone against a burning city | P01 back view standing; rail prop in front |
| G9 | `palm_on_fridge`: P11 profile, palm flat on a vertical door; verify P11 reads as palm-on-surface | B06-SH01 | Wanting to open it, not opening | P11 as is; else new |
| G10 | `reach_toCam` with held items: P16 front, depth arm `toCam` holding yoghurt/milk/bread/box one after another | B06-SH02 | Taking the fresh food, handing it to the viewer | P16 `toCam` without items; items as separate props |
| G11 | Infected neighbour: `man-shaved` base (no glasses), grey-green skin, house polo, blood at mouth, chin, collar, silhouette variant for far shots, P01 profile with slow sway, `turn-head-to-camera` retimed (x1.14) | B01-SH01/02/03 | A neighbour who is wrong: dread by implication (UT09) | approved proof frame B01-SH03 (r6) is the look; Boss hardens (look asset) |

Sets and props (`new:`, none in the kit; blockout code for most exists in `src/painted/zc2kit/sb-a.tsx`, `sb-b.tsx`, `sets.ts`, throwaway, to be hardened into the episode module): sets S1 corridor (`W-CORR`), S2 unit door vantage (day 1, day 3, dark variant), S3 unit side/seated MS (cabinet), S4 kitchen tap/sink, S5 diagram tower, S6 diagram pump room, S7 kitchen top-down, S8 bathroom MW, S9 bathroom top-down (cistern+bowl), S10 fridge front, S11 fridge interior, S12 counter eye-level (B06-SH03, B07-SH01, B07-SH03 share one with prop swaps), S13 unit wide (B07-SH02), S14 night balcony + city layers, S15 top-down day-3 floor, S16 sofa corner. Props: trash bag, deadbolt, door (with swing), shoe cabinet, shoes, bucket (15 L), pot, bottle, lids, red bucket + scoop, cistern lid, food items (yoghurt, milk, bread, rice box, banana, nuts, bag), fish can, stove case, gas canister, blanket, light overlays (ceiling, AC LED, fridge LED, door strip), smoke columns, fires. Text, marks, tick/cross, clock rings and counters are Remotion overlays (Editor), not plates.

## Shot map
| Shot | Beat | Global [start, endExclusive) | Frames | Seconds | VO lines | Caption shade peak |
| --- | --- | --- | --- | --- | --- | --- |
| ZC2-B01-SH01 | B01 | [0, 75) | 75 | 0.00-2.50 | TH-01 | 0.67 |
| ZC2-B01-SH02 | B01 | [75, 160) | 85 | 2.50-5.33 | TH-02 | 0.70 |
| ZC2-B01-SH03 | B01 | [160, 206) | 46 | 5.33-6.87 | TH-03 | 0.57 (measured W5.2 sign-off, mean 0.237) |
| ZC2-B02-SH01 | B02 | [206, 233) | 27 | 6.87-7.77 | TH-04 | 0.53 |
| ZC2-B02-SH02 | B02 | [233, 260) | 27 | 7.77-8.67 | TH-05 | 0.58 |
| ZC2-B02-SH03 | B02 | [260, 305) | 45 | 8.67-10.17 | TH-06 | 0.62 |
| ZC2-B02-SH04 | B02 | [305, 419) | 114 | 10.17-13.97 | TH-07, TH-08 | 0.54 |
| ZC2-B02-SH05 | B02 | [419, 511) | 92 | 13.97-17.03 | TH-09 | 0.47 |
| ZC2-B03-SH01 | B03 | [511, 568) | 57 | 17.03-18.93 | TH-10 | 0.64 |
| ZC2-B04-SH01 | B04 | [568, 617) | 49 | 18.93-20.57 | TH-11 | 0.73 |
| ZC2-B04-SH02 | B04 | [617, 731) | 114 | 20.57-24.37 | TH-12 | 0.78 |
| ZC2-B04-SH02b | B04 | [731, 912) | 181 | 24.37-30.40 | TH-13, TH-14, TH-15 | 0.79 |
| ZC2-B04-SH03 | B04 | [912, 1066) | 154 | 30.40-35.53 | TH-16 | 0.71 |
| ZC2-B05-SH01 | B05 | [1066, 1151) | 85 | 35.53-38.37 | TH-17 | 0.77 |
| ZC2-B05-SH02 | B05 | [1151, 1231) | 80 | 38.37-41.03 | TH-18 | 0.72 |
| ZC2-B05-SH03 | B05 | [1231, 1351) | 120 | 41.03-45.03 | TH-19 | 0.77 |
| ZC2-B05-SH04 | B05 | [1351, 1468) | 117 | 45.03-48.93 | TH-20, TH-21 | 0.69 |
| ZC2-B06-SH01 | B06 | [1468, 1672) | 204 | 48.93-55.73 | TH-22, TH-23 | 0.62 |
| ZC2-B06-SH02 | B06 | [1672, 1750) | 78 | 55.73-58.33 | TH-24 | 0.73 |
| ZC2-B06-SH03 | B06 | [1750, 1799) | 49 | 58.33-59.97 | TH-25 | 0.76 |
| ZC2-B07-SH01 | B07 | [1799, 1882) | 83 | 59.97-62.73 | TH-26 | 0.58 |
| ZC2-B07-SH02 | B07 | [1882, 1979) | 97 | 62.73-65.97 | TH-27 | 0.64 |
| ZC2-B07-SH03 | B07 | [1979, 2047) | 68 | 65.97-68.23 | TH-28 | 0.66 |
| ZC2-B08-SH01 | B08 | [2047, 2147) | 100 | 68.23-71.57 | TH-29 | 0.00 |
| ZC2-B08-SH02 | B08 | [2147, 2278) | 131 | 71.57-75.93 | TH-30, TH-31 | 0.38 |
| ZC2-B09-SH01 | B09 | [2278, 2476) | 198 | 75.93-82.53 | TH-32, TH-33, TH-34, TH-35 | 0.64 |
| ZC2-B09-SH02 | B09 | [2476, 2543) | 67 | 82.53-84.77 | TH-36 | 0.60 |
| ZC2-B09-SH03 | B09 | [2543, 2620) | 77 | 84.77-87.33 | TH-36a | 0.44 |
| ZC2-B09-SH04 | B09 | [2620, 2675) | 55 | 87.33-89.17 | TH-37 | 0.63 |
| ZC2-B10-SH01 | B10 | [2675, 2877) | 202 | 89.17-95.90 | TH-38, TH-39 | 0.61 |
| **Total** | | [0, 2877) | **2877** | 95.90 | 40 lines | |

Runtime mapping (planned): `src/videos/zombie-condo2/` one `Scene` per shot in this order, `from` = Global start; narration on the timeline unchanged; Editor owns it. Window rule used: a shot starts at its first line onset minus min(0.4 s, half the gap before it) (voice-lock proposal) rounded to the nearest frame; the only deviation is B02-SH02 starting at f 233 (7.767 s) so the two hard-cut shots are equal at 27 f (the proposal had 26/28). Frame = floor(seconds x 30 + 0.5).

## ZC2-B01-SH01: Door opens on the corridor
Range: global [0, 75) · 75 f (2.50 s) · shot-local f 0 = global f 0 (0.000 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-01 0.000-2.312 s (local f 0-69): คุณเปิดประตูห้อง จะเอาขยะไปทิ้ง
Cast: `man-crop, P01, neutral` back view, right hand low with `new: trash-bag` prop (Boss G6); infected far at the corridor end = `new: infected neighbour` (`man-shaved` base, grey-green skin, house polo, blood at mouth/chin/collar), silhouette, P01
Set: `new:` corridor, `W-CORR`, seen through the door gap from inside the unit; the door is a `new:` prop (0.90 x 2.10 m, swings inward away from camera)
Light: cold fluorescent, one tube flickering; bright end window behind the infected so it is darker than the window (VD-ZC2-02, DF-20261031-painted-opaque-cast)
Camera: UT13 close: over the lead's right shoulder, lead ~1.2 m from camera, head at about y 700, bag hand low right. Push `pushCamera` s 1.00 -> 1.10, focus (540, 820), over the whole shot [0,75). Door leaf swings open 0..28 (ease-out); corridor visible in the gap from f 14; infected readable by f 36 (1.2 s, brief).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 0 (0.000 s): door latch, leaf starts to swing
- f 15 (0.500 s): corridor opens in the gap; fluorescent flicker (one tube, 2 flickers f 30 and f 52)
- f 36 (1.200 s): infected silhouette readable at the far end (brief: by 1.2 s, figure on screen by 2.0 s)
- f 48 (1.600 s): bag hand rises a few px with the step forward (idle-breathe)
Captions + shade: TH-01 "คุณเปิดประตูห้อง จะเอาขยะไปทิ้ง": local [0, 73) (global [0, 73)) · shade peak 0.67 (re-measured at the cue frames, W5.2 sign-off)
Sound: ambience/music state: corridor fluorescent hum `sfx/electric/electric_light-flicker-buzz_01` loop, vol 0.08, runs 0 -> 17.567 s (cues-TH.json); no music · cues: f 0 (global 0): sfx/foley/foley_door-latch-hinge_01 · vol 0.6 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 36: infected silhouette visible and darker than the end window; f 0-28 door motion reads as opening toward the room.
Boss dependencies: G6 (trash bag), G11 (infected), corridor set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B01-SH02: The still figure at the corridor end
Range: global [75, 160) · 85 f (2.83 s) · shot-local f 0 = global f 75 (2.500 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-02 2.665-4.965 s (local f 5-74): ปลายทางเดิน มีคนยืนนิ่งอยู่
Cast: `new: infected neighbour` (as above), `P01` profile facing its own door, sleepy, silhouette, ~25 m away; lead off screen (POV)
Set: `new:` corridor, long-lens view along `W-CORR` +z; shoes outside doors, closed doors left/right
Light: cold fluorescent along the ceiling, one tube flickers; end window bright
Camera: Deliberate wide (brief; Q-ZC2-S2): long lens, whole corridor with the figure small at the far end. `pushCamera` s 1.00 -> 1.12, focus (540, 760), [0,85) slow and constant.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 5 (2.665 s): push is already running; figure sways 2-3 px (idle-breathe, slow)
- f 27 (3.400 s): tube flicker
- f 51 (4.200 s): figure does not turn (restraint: the turn is SH03)
Captions + shade: TH-02 "ปลายทางเดิน มีคนยืนนิ่งอยู่": local [5, 78) (global [80, 153)) · shade peak 0.70 (measured at the cue frames, W5.2 sign-off 4 Nov 2026)
Sound: ambience/music state: corridor hum continues; low bass swell comes from the riser · cues: f 5 (global 80): sfx/reveal/reveal_riser-tension_01 · vol 0.25, 3.867 s, rising under the line (old cue, kept) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 0: whole corridor and the far figure readable; push ends at s 1.12 with the figure still < 1/8 of frame height.
Boss dependencies: G11, corridor set (shared with SH01) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B01-SH03: It turns
Range: global [160, 206) · 46 f (1.53 s) · shot-local f 0 = global f 160 (5.333 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-03 5.676-6.543 s (local f 10-36): แล้วมันก็หันมา
Cast: `new: infected neighbour`, `P01`, tired (profile -> front), MCU; `motion: turn-head-to-camera` retimed (Boss: speed factor 1.14 so the head swap lands at 0.55 x 1.4 s = f 23 of the shot) 
Set: `new:` corridor background, soft; own door edge behind
Light: face in shadow, eyes catch a pale light; blood at mouth and chin visible; approved proof frame B01-SH03 (r6)
Camera: MCU on the head and shoulders (~1400 px/m, kit `talkingCloseUp` scale, UT13). Static with a 2 % push (s 1.00 -> 1.02, focus on the face) to the end; hold the last 12 frames.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 10 (5.676 s): profile, still (VO "แล้วมันก็"); neck creak onset
- f 23 (6.100 s): head swap profile -> front (word "หันมา", estimated word onset 6.1 s)
- f 32 (6.400 s): hold, eyes toward camera until the cut
Captions + shade: TH-03 "แล้วมันก็หันมา": local [10, 40) (global [170, 200)) · shade peak 0.57 (measured at the cue frames, W5.2 sign-off 4 Nov 2026: mean 0.237, p95 0.30)
Sound: ambience/music state: corridor hum continues · cues: f 10 (global 170): sfx/creature/creature_neck-creak-wet_01 · vol 0.5 ; f 36 (global 196): sfx/foley/foley_footsteps-run-slam_01 · vol 0.45, trimStart 0.58 s; the lead runs and slams the door in the next shots, so the clip starts here and runs over the cut · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 23: head faces camera; f 40: blood at mouth and chin readable, face still dark; no jump scare (UT09).
Boss dependencies: G11 infected blood layer (look-defining; approved proof frame, Boss hardens) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B02-SH01: Close! (door slammed)
Range: global [206, 233) · 27 f (0.90 s) · shot-local f 0 = global f 206 (6.867 s) · clip note: hard cut in and out, under 1 s on purpose
VO (Thai, verbatim, measured): TH-04 7.227-7.433 s (local f 11-17): ปิด
Cast: `man-crop, P15, scared`, profile, fists and shoulder on the door leaf instead of open palms (Boss G5); trash bag leaves the hand and drops on the floor
Set: `new:` unit, `W-UNIT`: door vantage from the side, door leaf at the right of frame, hall tile floor
Light: Day 1 warm morning light, flat translucent sun bands from camera-left (VD-ZC2-03)
Camera: MS side, lead ~1.76 m at ~800 px/m (estimated), door leaf right. Impact shake: picture-stage offset on the hit f 11 (word "ปิด" onset 7.227 s): 6 frames, amplitude 14 px decaying to 0, y-dominant; no scale change.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 4 (7.000 s): lead already pushing the door (frame 0 = leaf nearly shut, 6 px open)
- f 11 (7.227 s): leaf closes: slam; lead recoils (`gasp-recoil`, first 0.4 s only)
- f 16 (7.400 s): bag lands on the floor, keeps lying there until B10
Captions + shade: TH-04 "ปิด! ล็อก!": local f 11-end of the next shot (global [217, 254), the cue crosses the hard cut; shade follows each shot's own peak) · shade peak 0.53
Sound: ambience/music state: unit room tone + fridge hum, corridor fluorescent ends at the cut · cues: f 12 (global 218): sfx/impact/impact_door-slam-body_01 · vol 0.6 ; f 16 (global 222): sfx/foley/foley_bag-drop-tile_01 · vol 0.25 ; f 13 (global 219): sfx/tension/tension_heartbeat-slow_01 loop · vol 0.18, 7.3 -> 15.6 s ; f 10 (global 216): sfx/room/room_shop-fridge-hum_01 · vol 0.18, 7.2 -> 17.567 s (room tone with the fridge) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 11: slam and picture shake in the same frame as the word onset; bag lies on the floor at the bag-drop cue.
Boss dependencies: G5, G6 (bag release), unit set (door vantage) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B02-SH02: Lock! (POV deadbolt)
Range: global [233, 260) · 27 f (0.90 s) · shot-local f 0 = global f 233 (7.767 s) · clip note: hard cut in and out, under 1 s on purpose
VO (Thai, verbatim, measured): TH-05 8.058-8.318 s (local f 9-17): ล็อก
Cast: hand only: `man-crop` skin mitten hand (UT14, `openHandParts`; `paintPovHand` not used); `new: deadbolt` set piece
Set: `new:` door close-up, solid door, deadbolt thumb-turn at 1.15 m, lever 1.00 m; no peephole (CL05)
Light: same morning light; slight hand shadow on the door
Camera: Close POV, fixed. Hand enters from the right frame edge (x 1080 -> 700) f 0-7, thumb-turn rotates 90 deg from the word onset (8.058 s), 6 frames, hand holds 4 frames.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 9 (8.058 s): thumb-turn rotates (bolt slides)
- f 13 (8.200 s): hand rests on the bolt
Captions + shade: continuation of TH-04's cue from the previous shot (local f 0-21); shade peak 0.58
Sound: ambience/music state: room tone; 0.6 s knock gap follows (natural room for the pounding start, see SH03) · cues: f 9 (global 242): sfx/foley/foley_deadbolt-clack_01 · vol 0.5 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: From the word onset: bolt rotates in sync with the word; hand is a mitten, no drawn fingers; hand stays above the caption band (y < 1080).
Boss dependencies: deadbolt set piece, door close-up plate · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B02-SH03: It pounds the door
Range: global [260, 305) · 45 f (1.50 s) · shot-local f 0 = global f 260 (8.667 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-06 8.974-9.872 s (local f 9-36): มันทุบประตูไม่หยุด
Cast: `man-crop, P15 -> P01, scared`, back view, steps back from the door (`motion: gasp-recoil` 0.8 s then 2 backward steps)
Set: `new:` unit, door vantage ~3.2 m from the door, eye height 1.5 m (brief VD-ZC2-03); this angle returns in B03, B09-SH03
Light: morning light from camera-left bands; door sits in cooler shade
Camera: MS, door fills the frame centre, lead in the left third at ~700 px/m (est.). Static with 3 % push (s 1.00 -> 1.03, focus door centre (600, 760)). Door shake: leaf rattles in the frame, 3 px at 4-6 irregular beats; dust falls from the lintel from f 9.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 9 (8.974 s): first pound (word "มันทุบ"), lead flinches
- f 19 (9.300 s): 2nd pound, irregular, dust from the top edge
- f 28 (9.600 s): 3rd pound, lead has stepped back 0.3 m
Captions + shade: TH-06 "มันทุบประตูไม่หยุด": local [9, 40) (global [269, 300)) · shade peak 0.62
Sound: ambience/music state: heartbeat loop continues; fridge hum · cues: f 9 (global 269): sfx/foley/foley_door-pound-wood_01 · fist-heavy, irregular (CL01); NEEDS CHECK of onset against the file ; f 22 (global 282): sfx/foley/foley_fist-blow-door_01 · vol 0.5, 2nd and 3rd blows (offset +0.3 s each) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 0-12: 3 pounds visible as door shake with different spacing; lead goes from 0 to ~0.3 m back, ends in P01 stand.
Boss dependencies: dust layer (kit ENV-FALL optional) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B02-SH04: Drag the cabinet against the door
Range: global [305, 419) · 114 f (3.80 s) · shot-local f 0 = global f 305 (10.167 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-07 10.442-11.383 s (local f 8-36): ลากตู้มาดัน | TH-08 11.875-13.766 s (local f 51-108): แต่ต้องรื้อออกได้เร็ว เผื่อไฟไหม้
Cast: `man-crop, worried`, profile facing right (toward the cabinet and the door; approved storyboard still ZC2-SB-R3, W5.2 sign-off 4 Nov 2026), **new pose `drag`** (Boss G1): leaning back, both hands on the cabinet edge, feet pushing; the other end of the cabinet touches the door
Set: `new:` unit side view, door left, shoe cabinet 0.77 w x 1.06 h x 0.35 d m, open shelves (CL02), not fixed; tile floor scrape marks; one shoe falls
Light: morning bands from camera-left across the cabinet; lead shadow flat on the cabinet
Camera: UT13 close-ish MS: lead + cabinet ~700 px/m (r3 log), lead ~1230 px tall (est.). Picture-stage pan with the drag: dx 0 -> -20 from the first pull to the last (a larger pan pushes the leaning head out of the left edge; W5.2 sign-off), then static; 2 % push. Cabinet moves 0.7 m on screen (490 px; 0.9 m would start the cabinet and the grip outside the 1080 px frame, W5.2 sign-off) along W-UNIT +x in three pulls timed to the three words "ลาก / ตู้ / มาดัน" (10.44, 10.8, 11.1 s): 8-frame pulls starting at the word onsets; stops on the door, jamb-left; covers the lever.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 8 (10.442 s): pull 1 on "ลากตู้มาดัน" (word onsets 10.44 / 10.8 / 11.1 s)
- f 34 (11.300 s): cabinet reaches the door, shoe falls from the lower shelf
- f 51 (11.875 s): "แต่ต้องรื้อออกได้เร็ว": lead eases off, hand on the shelf edge, the cabinet is seen light (shaking hand test: tip 3 px)
- f 85 (13.000 s): pounding continues in the background; hold
Captions + shade: TH-07 "ลากตู้มาดัน": local [8, 40) (global [313, 345)) ; TH-08 "แต่ต้องรื้อออกได้เร็ว เผื่อไฟไหม้": local [51, 112) (global [356, 417)) · shade peak 0.54 (re-measured at the cue frames, W5.2 sign-off)
Sound: ambience/music state: heartbeat loop; fridge hum; pounding under VO, ducked · cues: f 5 (global 310): sfx/foley/foley_cabinet-scrape-thud_01 · vol 0.6 (old cue, 0.1 s before the first pull) ; f 37 (global 342): sfx/foley/foley_door-pound-wood_01 · vol 0.25 under the line · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the end of pull 3 (11.1 s + 0.27 s): cabinet covers the door from its left jamb with the deadbolt (1.15 m) above and the lever tip behind the cabinet edge; shoe lies on the tile; shelves still open.
Boss dependencies: G1 `drag` pose, cabinet prop (look-defining, approved r6 proof), shoe prop · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B02-SH05: Quiet. They follow sound.
Range: global [419, 511) · 92 f (3.07 s) · shot-local f 0 = global f 419 (13.967 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-09 14.127-16.485 s (local f 5-76): ในโลกนี้ พวกมันตามเสียง
Cast: `man-crop, scared`, `P33` sit + right fist at the mouth (**new pose `hand_to_mouth_sit`**, Boss G2; known flaw: thumb up close); left arm round the shins
Set: `new:` unit seated MS: cabinet set diagonal at the door with scrape marks and the fallen shoe; trash bag still on the floor by the door (continuity)
Light: morning sun bands from camera-left over cabinet and door; his shadow on the cabinet (VD-ZC2-09); music stops at the pause
Camera: Seated MS, full figure, feet in frame (approved r6 proof, `Q-ZC2-F5` pending), floor line y 1330. Static; 3 % push in the last second (s 1.00 -> 1.03 f 60-92, focus on his eyes (560, 800)). Eyes lift to the lock (deadbolt) at f 8, hold.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 5 (14.127 s): figure still, eyes up to the lock; breath only (idle-breathe)
- f 31 (15.000 s): "พวกมันตามเสียง" (word onset est. 15.0 s): breathing stops, figure freezes
- f 76 (16.485 s): line ends: 0.6 s freeze, nothing moves except the pounding SFX (to 17.085 s, runs 2 frames into B03)
Captions + shade: TH-09 "ในโลกนี้... พวกมันตามเสียง": local [5, 80) (global [424, 499)) · shade peak 0.47
Sound: ambience/music state: fridge hum; the near-silence is the point (silence policy) · cues: f 49 (global 468): sfx/tension/tension_heartbeat-slow_01 loop ends (cues-TH.json); no score in B02 ; f 76 (global 495): pounding only for 0.6 s: sfx/foley/foley_door-pound-wood_01 vol 0.3 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Whole shot: his hand covers the mouth with the thumb off the lip line; eyes read as looking up at the lock; cabinet, deadbolt and bag all visible.
Boss dependencies: G2, cabinet/shoe/bag continuity props · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B03-SH01: Blackout
Range: global [511, 568) · 57 f (1.90 s) · shot-local f 0 = global f 511 (17.033 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-10 17.423-18.381 s (local f 12-40): แล้วไฟก็ดับทั้งตึก
Cast: `man-crop, worried, P33`, small, still seated against the cabinet (door vantage wide); `idle-breathe`
Set: unit door vantage (same as B02-SH03), widened: ceiling light, AC standby LED, fridge LED, corridor strip under the door; pound-free
Light: morning to daylight-only: the four sources cut in turn, then the room goes to the soft window light
Camera: Door vantage wide, lead small left (deliberate wide: building loses power; lone-character UT13 exception recorded). Static. Lights cut as 2-frame snaps at the times in the beats list (ceiling 17.567 s, AC LED 17.8, fridge LED 18.0, door strip 18.2); room light drops about 20 % at the first cut.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 16 (17.567 s): ceiling light off with the power cut
- f 23 (17.800 s): AC LED off
- f 29 (18.000 s): fridge LED off
- f 35 (18.200 s): corridor light under the door off; hold on the dim room
Captions + shade: TH-10 "แล้วไฟก็ดับทั้งตึก": local [12, 44) (global [523, 555)) · shade peak 0.64
Sound: ambience/music state: fridge hum and corridor hum both stop at 17.567 s: about 0.9 s near-silence; `room_dark-empty-building_01` fades in at 19.0 s (cues-TH.json) · cues: f 16 (global 527): sfx/impact/impact_power-cut-whoomp_01 · vol 0.5 ; f 16 (global 527): fridge hum `audio/room/room_shop-fridge-hum_01` and corridor hum end with the cut (fadeOut 0.05 s) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: The four lights go off in the named order; after the last, only daylight; lead is still seated.
Boss dependencies: ceiling light, AC LED, fridge LED overlays (`new:` light overlays) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B04-SH01: Tap still running
Range: global [568, 617) · 49 f (1.63 s) · shot-local f 0 = global f 568 (18.933 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-11 19.318-20.170 s (local f 12-37): แต่ก๊อกน้ำยังไหล
Cast: none (no person)
Set: `new:` kitchen sink close-up: tap, steel sink, water jet, a sponge, a cup; daylight reflecting on the water
Light: bright day through the window (very bright: caption shade 0.73)
Camera: Close, eye level on the tap. Static; sun glint travels over the water 40 px across [0,49). Water jet loops (3-frame cycle).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (19.318 s): water running into the sink (starts on the first frame); glint passes at the word "ไหล" (est. 19.9 s)
Captions + shade: TH-11 "แต่ก๊อกน้ำยังไหล": local [12, 41) (global [580, 609)) · shade peak 0.73
Sound: ambience/music state: `audio/room/room_dark-empty-building_01` loop vol 0.10 from 19.0 s (duckUnderNarration 0.4); `audio/bed/bed_dark-drone-sub_01` from 19.0 s, vol 0.12 · cues: f 12 (global 580): sfx/water/water_tap-fill-containers_01 · vol 0.12 for 6.0 s (old cue) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 0: running water; no person; sun reflection on the water readable.
Boss dependencies: kitchen tap/sink set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B04-SH02: Water comes from the roof tank
Range: global [617, 731) · 114 f (3.80 s) · shot-local f 0 = global f 617 (20.567 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-12 20.926-24.091 s (local f 11-106): คอนโดสูงหลายแห่ง ปั๊มน้ำขึ้นไปเก็บในถังบนดาดฟ้า
Cast: none (diagram on paper)
Set: `D` plane: cut-away tower on plain paper, painter lines; pump at the base, pipe up the right side to the rooftop tank, water falls down every floor
Light: plain paper; water cyan (VD-ZC2-05)
Camera: Picture-stage tilt up the tower: dy +260 px -> 0 over f 6-90, ease in-out; no world camera. Labels in Remotion: "ปั๊ม" at the pump when the line says pump (22.2 s est., f 49), "ถังบนดาดฟ้า" at the tank (23.2 s est., f 79).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 11 (20.926 s): tower enters, water level in the tank full
- f 49 (22.200 s): pump label; water pushes up the pipe
- f 79 (23.200 s): tank label; water falls floor by floor
Captions + shade: TH-12 "คอนโดสูงหลายแห่ง ปั๊มน้ำขึ้นไป / เก็บในถังบนดาดฟ้า": local [11, 110) (global [628, 727)) · shade peak 0.78
Sound: ambience/music state: drone bed + empty-building tone, ducked under VO · cues: f 49 (global 666): NEEDS-GEN: sfx/water pump-hum? -> use `sfx/hum/hum_low-travelling-flat_01` vol 0.1 as pump hum (library; no new file) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 49 and f 79: labels appear on their objects; text is Thai, verbatim, outside the caption band (y < 1080).
Boss dependencies: diagram set A (tower), labels in Remotion · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B04-SH02b: Power off, pump stops, tank empties
Range: global [731, 912) · 181 f (6.03 s) · shot-local f 0 = global f 731 (24.367 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-13 24.642-26.233 s (local f 8-56): ไฟดับ ปั๊มก็หยุด | TH-14 26.639-28.795 s (local f 68-133): น้ำที่ยังไหล คือน้ำที่เหลือในถัง | TH-15 29.140-30.286 s (local f 143-178): หมดแล้วไม่มีใครเติม
Cast: none (diagram)
Set: `D` plane close-up of the pump room at the tower base (cut-away): cut cable with a red cross, red lightning symbol, the pump grey and still, pipes emptying; labels "ปั๊ม" and "ไฟดับ" (red)
Light: plain paper; power-off red; pipes empty at the end
Camera: Static close, small push s 1.00 -> 1.05 (focus pump). Sequence: red cross + lightning at "ไฟดับ" (24.642 s, f 8); pump greys at "ปั๊มก็หยุด" (25.3 s est., f 28); water drains from the pipes during TH-14 (26.64-28.80 s, f 68-133); pipes fully empty when "หมดแล้วไม่มีใครเติม" lands (29.14 s, f 143).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 8 (24.642 s): red cross on the cable
- f 28 (25.300 s): pump greys, stops
- f 68 (26.639 s): water level starts to drop in the pipes
- f 143 (29.140 s): pipes empty; hold to the cut
Captions + shade: TH-13 "ไฟดับ ปั๊มก็หยุด": local [8, 60) (global [739, 791)) ; TH-14 "น้ำที่ยังไหล คือน้ำที่เหลือในถัง": local [68, 137) (global [799, 868)) ; TH-15 "หมดแล้วไม่มีใครเติม": local [143, 181) (global [874, 913)) · shade peak 0.79
Sound: ambience/music state: drone bed; clock pulse begins on the last line · cues: f 143 (global 874): sfx/tension/tension_clock-pulse_01 loop · vol 0.15, duckUnderNarration 0.5, starts at "หมดแล้วไม่มีใครเติม" and runs to 63.067 s · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 143: pipes visibly empty; clock pulse audible; both labels are over the diagram, not the band.
Boss dependencies: diagram set B (pump room) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B04-SH03: Fill everything, then close the lids
Range: global [912, 1066) · 154 f (5.13 s) · shot-local f 0 = global f 912 (30.400 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-16 30.529-34.992 s (local f 4-138): รองใส่ทุกอย่าง ถัง หม้อ ขวด แล้วปิดฝา
Cast: none (top-down)
Set: `new:` kitchen floor from above, orthographic (VD-ZC2-06): bucket, pot, bottle, lids; daylight from one side; tap at the top edge of the frame
Light: day from the left; flat shadows
Camera: Orthographic top-down, static; slow drift dx -12 px over the shot. Fill events (word onsets estimated, no word-level measure): bucket "ถัง" 32.2 s, pot "หม้อ" 32.9 s, bottle "ขวด" 33.5 s (each fills over 0.6 s); lids close at 34.467 / 34.6 / 34.733 s (from the old cue set) on "แล้วปิดฝา".
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 4 (30.529 s): empty vessels placed (all three visible, empty)
- f 54 (32.200 s): bucket fills
- f 75 (32.900 s): pot fills
- f 93 (33.500 s): bottle fills
- f 122 (34.467 s): lid 1 (bucket)
- f 126 (34.600 s): lid 2 (pot)
- f 130 (34.733 s): lid 3 (bottle cap)
Captions + shade: TH-16 "รองใส่ทุกอย่าง ถัง หม้อ ขวด แล้วปิดฝา": local [4, 142) (global [916, 1054)) · shade peak 0.71 (camera pan moves the band; measured at the cue frames, W5.2 sign-off)
Sound: ambience/music state: drone bed, tone, clock pulse · cues: f 0 (global 912): sfx/water/water_tap-fill-containers_01 · vol 0.22, 5 s (old cue) ; f 122 (global 1034): sfx/foley/foley_lid-snaps-three_01 trim 0.08 s dur 0.12 · vol 0.6 ; f 126 (global 1038): same clip · vol 0.6 ; f 130 (global 1042): same clip · vol 0.6 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Three lids close on the three lid beats; each vessel reads as full before its lid.
Boss dependencies: top-down plate, props: bucket 15 L, pot, bottle, lids · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B05-SH01: Bottles for drinking, buckets for flushing
Range: global [1066, 1151) · 85 f (2.83 s) · shot-local f 0 = global f 1066 (35.533 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-17 35.938-38.312 s (local f 12-83): ขวดไว้ดื่ม ถังไว้ราดชักโครก
Cast: none
Set: `new:` bathroom, MW from the door (shower only, no bath): bottles on the basin counter, red bucket and scoop beside the toilet, bidet hose; layout reference `PL-ZCPAINT-BATHROOM` (reference only, ENV-P02)
Light: window light, bright (shade 0.75)
Camera: MW from the door, `pushCamera` s 1.00 -> 1.04, focus (540, 900). Bottle row highlighted by a light pass at "ขวดไว้ดื่ม" (35.94 s, f 12), bucket highlighted at "ถังไว้ราด" (est. 36.9 s, f 41).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (35.938 s): bottles on the counter catch light
- f 41 (36.900 s): bucket and scoop catch light
Captions + shade: TH-17 "ขวดไว้ดื่ม ถังไว้ราดชักโครก": local [12, 85) (global [1078, 1152)) · shade peak 0.77 (re-measured at the cue frames, W5.2 sign-off)
Sound: ambience/music state: bathroom echo = tone with 0.3 s reverb tail; clock pulse · cues: f 14 (global 1080): bathroom reverb tone + soft clock pulse (continues, vol 0.15) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Highlight moves from bottles to bucket at the two beats; no bath in the room.
Boss dependencies: bathroom set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B05-SH02: One strong pour
Range: global [1151, 1231) · 80 f (2.67 s) · shot-local f 0 = global f 1151 (38.367 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-18 38.422-40.938 s (local f 2-77): เทแรงทีเดียว ถ้าท่อยังดี มันลงเอง
Cast: `man-crop, neutral, P26` carry, profile; **new variant `pour`** (Boss G4): bucket at the belly then tipped over the bowl, both hands on the handle and the base
Set: bathroom side view: toilet bowl left, cistern; bucket `new:` (15 L)
Light: window light from camera-right
Camera: UT13 MS on lead + bowl (~800 px/m est.). Static. Pour: bucket lifts f 2-14, tips 0 -> 100 deg f 14-28; stream visible from 39.3 s (f 28); gurgle at 39.633 s; swirl at "มันลงเอง" (est. 40.0 s, f 49).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 2 (38.422 s): bucket at the belly
- f 25 (39.200 s): tipped, stream into the bowl
- f 49 (40.000 s): swirl: the bowl drains by itself
Captions + shade: TH-18 "เทแรงทีเดียว ถ้าท่อยังดี มันลงเอง": local [2, 80) (global [1153, 1232)) · shade peak 0.72
Sound: ambience/music state: bathroom tone, clock pulse · cues: f 38 (global 1189): sfx/water/water_bucket-pour-gurgle_01 · vol 0.7 (old cue); stream visible 0.35 s earlier at 39.3 s · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 28: bucket fully tipped with both hands on it; f 49: swirl starts.
Boss dependencies: G4 `pour`, bucket prop, toilet bowl set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B05-SH03: Clean water in the cistern
Range: global [1231, 1351) · 120 f (4.00 s) · shot-local f 0 = global f 1231 (41.033 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-19 41.129-44.814 s (local f 3-113): ส่วนน้ำสะอาดสำรอง อยู่ในถังพักน้ำหลังชักโครก
Cast: hands only: two mitten hands (`openHandParts`, UT14), lifting the cistern lid by its ends
Set: close on the cistern top, ceramic lid, window reflection on the clear water inside
Light: window light, bright; water translucent (shade 0.77)
Camera: Close, static; s 1.00 -> 1.05 push, focus the lid gap. Lid lifts 90 px and slides left from 41.9 s (f 27) to 42.7 s (f 51), word "ถังพักน้ำ" est.; water revealed from f 51; ripple.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 14 (41.500 s): hands take the lid ends
- f 50 (42.700 s): lid slides off, clear water seen
- f 77 (43.600 s): ripple settles; hold on clear water
Captions + shade: TH-19 "ส่วนน้ำสะอาดสำรอง อยู่ในถังพัก / น้ำหลังชักโครก": local [3, 117) (global [1234, 1348)) · shade peak 0.77
Sound: ambience/music state: bathroom tone, clock pulse · cues: f 29 (global 1260): sfx/foley/foley_cistern-lid-tap_01 · vol 0.6, trimStart 0.7 s (retimed from the old 36.967 s to the lid motion) ; f 53 (global 1284): sfx/reveal/reveal_glass-shimmer-soft_01 · vol 0.5 (retimed from 41.133 s to the reveal) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: From the reveal beat (42.7 s): clear water and window reflection seen inside the cistern; no fingers drawn.
Boss dependencies: cistern close-up plate (props) · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B05-SH04: Not the bowl
Range: global [1351, 1468) · 117 f (3.90 s) · shot-local f 0 = global f 1351 (45.033 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-20 45.228-45.936 s (local f 6-27): ไม่ใช่ในโถ | TH-21 46.180-48.407 s (local f 34-101): ถ้าน้ำใส และไม่ได้ใส่น้ำยา
Cast: none (top-down)
Set: orthographic top-down on the toilet: cistern open at the top, bowl below; a tick on the cistern and a cross on the bowl (Remotion marks); small label "น้ำใส" / "ไม่ได้ใส่น้ำยา" beside the cistern
Light: window light from one side
Camera: Orthographic, static. Cross on the bowl at "ไม่ใช่ในโถ" (45.228 s); tick on the cistern at 45.5 s est.; labels "น้ำใส" at "ถ้าน้ำใส" (46.18 s) and "ไม่ได้ใส่น้ำยา" (47.1 s est.).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 6 (45.228 s): red cross on the bowl
- f 14 (45.500 s): green tick on the cistern
- f 34 (46.180 s): label: น้ำใส
- f 62 (47.100 s): label: ไม่ได้ใส่น้ำยา
Captions + shade: TH-20 "ไม่ใช่ในโถ": local [6, 31) (global [1357, 1382)) ; TH-21 "ถ้าน้ำใส และไม่ได้ใส่น้ำยา": local [34, 105) (global [1385, 1456)) · shade peak 0.69
Sound: ambience/music state: clock pulse; tone · cues: f 5 (global 1356): silent; clock pulse only · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Cross then tick; both marks in place before the labels; labels are Thai and outside the caption band.
Boss dependencies: top-down toilet plate · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B06-SH01: The closed fridge
Range: global [1468, 1672) · 204 f (6.80 s) · shot-local f 0 = global f 1468 (48.933 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-22 49.334-52.084 s (local f 12-95): ตู้เย็นถ้าไม่เปิด จะเย็นได้ราวสี่ชั่วโมง | TH-23 52.587-55.393 s (local f 110-194): ช่องแช่แข็งที่อัดแน่น อย่างมากราวสองวัน
Cast: `man-crop, worried, P11` profile, palm flat on the fridge door (Boss G9: confirm P11 as palm-on-vertical-surface; else new)
Set: `new:` kitchen, two-door fridge 1.45 x 0.55 m, dark and off; the door as a diegetic chart
Light: daylight from the left, dark fridge face; clock chips painted on the doors
Camera: UT13 MS, lead + fridge, `pushCamera` s 1.00 -> 1.05, focus the door (600, 760). Clock draws on the lower door at "สี่ชั่วโมง" (51.2 s), chip "ตู้เย็น (ไม่เปิด) ราว 4 ชม."; the upper door chip "ช่องแช่แข็งอัดแน่น อย่างมากราว 2 วัน" at 54.27 s. Text carried from cues-TH.json overlays (pending label check).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (49.334 s): palm flat on the door
- f 68 (51.200 s): clock ring draws on the lower door
- f 160 (54.270 s): second ring on the upper door
Captions + shade: TH-22 "ตู้เย็นถ้าไม่เปิด / จะเย็นได้ราวสี่ชั่วโมง": local [12, 99) (global [1480, 1567)) ; TH-23 "ช่องแช่แข็งที่อัดแน่น / อย่างมากราวสองวัน": local [110, 198) (global [1578, 1666)) · shade peak 0.62
Sound: ambience/music state: fridge silent; clock pulse; drone bed · cues: f 98 (global 1566): sfx/ui/ui_click-tick_01 · vol 0.5 ; f 190 (global 1658): sfx/ui/ui_click-tick_01 · vol 0.5 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the two chip beats: the two chips and rings appear on the right doors; the hand stays flat on the door through the shot.
Boss dependencies: G9, fridge set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B06-SH02: Eat the fresh food first
Range: global [1672, 1750) · 78 f (2.60 s) · shot-local f 0 = global f 1672 (55.733 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-24 56.042-58.110 s (local f 9-71): ของในตู้เย็นที่กินได้เลย กินก่อน
Cast: `man-crop, neutral, P16` front, reaching to the viewer, depth arm `toCam` (DF-20261030-painted-arm-depth)
Set: fridge interior seen from the shelf, door open, daylight floods in; door shelf: yoghurt, milk, bread, packed rice; no raw meat or eggs
Light: dark interior; daylight from the open door onto the lead's face (shade 0.73)
Camera: View from inside the dark fridge, static; reach: the arm comes in from f 6 and holds the items toward the lens f 30-55. Items taken in order yoghurt, milk, bread, box at 56.3 / 56.7 / 57.2 / 57.6 s est.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 9 (56.042 s): door opens, light floods in
- f 23 (56.500 s): hand picks items
- f 50 (57.400 s): items held toward camera
Captions + shade: TH-24 "ของในตู้เย็นที่กินได้เลย กินก่อน": local [9, 75) (global [1681, 1747)) · shade peak 0.73
Sound: ambience/music state: tone; clock pulse · cues: f 9 (global 1681): sfx/foley/foley_fridge-seal-pop_01 · vol 0.6 ; f 24 (global 1696): sfx/foley/foley_packaging-rustle_01 · vol 0.6 ; f 50 (global 1722): sfx/foley/foley_fridge-seal-thump_01 · vol 0.6 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 0-12: light flood on opening; arm foreshortening believable; items readable.
Boss dependencies: G10, fridge interior plate, food props · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B06-SH03: Canned fish last
Range: global [1750, 1799) · 49 f (1.63 s) · shot-local f 0 = global f 1750 (58.333 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-25 58.561-59.421 s (local f 7-33): กระป๋องไว้ท้ายสุด
Cast: hand only: `man-crop` mitten fist (`fistParts`) setting the can
Set: counter eye-level, fresh items lined up; red can of fish `new:`
Light: daylight from the left (bright, shade 0.76)
Camera: Eye-level on the counter, static. The can is set at the end of the row at "ท้ายสุด" (est. 59.0 s).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 20 (59.000 s): can set at the row end
Captions + shade: TH-25 "กระป๋องไว้ท้ายสุด": local [7, 37) (global [1757, 1787)) · shade peak 0.76
Sound: ambience/music state: tone; clock pulse · cues: f 20 (global 1770): sfx/foley/foley_can-setdown-laminate_01 · vol 0.6 (retimed from 58.667 s to the word "ท้ายสุด") · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the can beat: can lands last in the row, label side to camera.
Boss dependencies: can, food props · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B07-SH01: The picnic stove stays unlit
Range: global [1799, 1882) · 83 f (2.77 s) · shot-local f 0 = global f 1799 (59.967 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-26 60.348-62.422 s (local f 11-74): เตาแก๊สปิกนิก ห้ามจุดในห้อง
Cast: hand only: mitten fist (`fistParts`) holding the gas canister (`new: gas canister`)
Set: counter close, stove case open, never lit
Light: daylight; shade 0.58
Camera: Close, static; canister rises from 60.95 s and is held mid-air from the canister cue (61.4 s) to the end of the shot; no ignition animation. The word "ห้ามจุดในห้อง" starts about 61.2 s (est.).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 37 (61.200 s): canister held up; stove untouched
Captions + shade: TH-26 "เตาแก๊สปิกนิก ห้ามจุดในห้อง": local [11, 78) (global [1810, 1877)) · shade peak 0.58
Sound: ambience/music state: clock pulse thins to vol 0.06 from 63.067 s · cues: f 43 (global 1842): sfx/mechanical/mechanical_canister-handling_01 · vol 0.6 ; f 51 (global 1850): sfx/stinger/stinger_low-muted-hit_01 · vol 0.5; no ignition sound ever · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Stove never lit; canister clearly shown.
Boss dependencies: stove case, gas canister · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B07-SH02: A closed-up room
Range: global [1882, 1979) · 97 f (3.23 s) · shot-local f 0 = global f 1882 (62.733 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-27 63.056-65.881 s (local f 10-94): คาร์บอนมอนอกไซด์ ฆ่าคุณได้ก่อนซอมบี้
Cast: `man-crop, neutral, P08` one arm up, profile, sliding the stove case onto the top shelf (**new pose `reach_shelf`**, Boss G3)
Set: `new:` unit wide: balcony glass door shut, cabinet still across the door under the deadbolt, shelf above the fridge
Light: daylight, flat (shade 0.64)
Camera: Deliberate wide pull-out (Q-ZC2-S2): whole room as a closed box, lead small. `pushCamera` s 1.10 -> 1.00, focus (540, 960), whole shot. Case slides onto the top shelf from 63.7 s to 64.4 s.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 10 (63.056 s): room reads closed
- f 38 (64.000 s): case onto the top shelf
Captions + shade: TH-27 "คาร์บอนมอนอกไซด์ / ฆ่าคุณได้ก่อนซอมบี้": local [10, 97) (global [1892, 1980)) · shade peak 0.64
Sound: ambience/music state: drone bed; clock pulse low · cues: f 11 (global 1893): music thins to a single low hum: `sfx/hum/hum_low-travelling-flat_01` vol 0.06 (library) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: First and last frame: door cabinet, balcony door and lead all in frame; case on the shelf by 64.4 s.
Boss dependencies: G3, unit wide plate · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B07-SH03: Eat what needs no cooking
Range: global [1979, 2047) · 68 f (2.27 s) · shot-local f 0 = global f 1979 (65.967 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-28 66.050-67.576 s (local f 3-48): กินของที่ไม่ต้องปรุงแทน
Cast: hands only: two mitten fists (`fistParts`) tearing the bread bag
Set: low table close: bread, banana, nuts, can
Light: daylight (shade 0.66)
Camera: Close, static. Bag torn at "ที่ไม่ต้องปรุง" (est. 66.9 s).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 28 (66.900 s): bread bag torn open
Captions + shade: TH-28 "กินของที่ไม่ต้องปรุงแทน": local [3, 52) (global [1982, 2031)) · shade peak 0.66
Sound: ambience/music state: tone; clock pulse low · cues: f 12 (global 1991): sfx/foley/foley_packaging-rustle_01 · vol 0.35 (old cue) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: After the tear beat: bag open, banana, nuts, can all visible.
Boss dependencies: bread, banana, nuts props · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B08-SH01: That night, the balcony
Range: global [2047, 2147) · 100 f (3.33 s) · shot-local f 0 = global f 2047 (68.233 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-29 68.631-71.341 s (local f 12-93): คืนนั้นที่ระเบียง ทั้งเมืองมืดสนิท
Cast: `man-crop, neutral, P01` back view, leaning on the rail, flat silhouette (Boss G8)
Set: `new:` night balcony seen through the glass door from the dark room; ENV-SKY night, ENV-GLOW fire under-light; city layers dark but orange-lit from below (no dead black, UT03)
Light: blue night, orange fire under-light; silhouette
Camera: Through the glass door, static; 2 % push. UT13 lone-character close: lead at MS ~1.5 m.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (68.631 s): lead at the rail, still; wind
- f 53 (70.000 s): distant fire flicker
Captions + shade: TH-29 "คืนนั้นที่ระเบียง ทั้งเมืองมืดสนิท": local [12, 97) (global [2059, 2144)) · shade peak 0.00
Sound: ambience/music state: night wind + fire; clock pulse cut before this shot (63.067-68.133 s thin) · cues: f -3 (starts 3 f before the shot) (global 2044): audio/city/city_distant-fire-crackle_01 vol 0.25 and audio/nature/nature_wind-eerie-street_01 vol 0.2, from 68.133 s, fadeIn 0.5 s, loop (old cues); sound begins 0.5 s before the first word · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: f 0: night city readable with orange glow; lead silhouette readable; no sirens, voices or helicopters.
Boss dependencies: G8, balcony night set, city layers · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B08-SH02: No one is coming
Range: global [2147, 2278) · 131 f (4.37 s) · shot-local f 0 = global f 2147 (71.567 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-30 71.802-73.283 s (local f 7-51): มีแต่ควันกับเปลวไฟ | TH-31 73.655-74.980 s (local f 63-102): ไม่มีใครมาช่วยแน่
Cast: `man-crop, P01` back view small, flat silhouette at the rail
Set: wide across the railing: dark towers, smoke columns, several pointed flames (`new:` smoke, fires), ENV-FOG
Light: blue night; orange fire; shade peak 0.38 (fire/window lights in the band, p95 limit; W5.2 sign-off)
Camera: Deliberate wide (Q-ZC2-S2). Slow pull-out `pushCamera` s 1.15 -> 1.00 over the shot, focus (540, 1000); lead small at the end.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 7 (71.802 s): smoke columns visible
- f 63 (73.655 s): "ไม่มีใครมาช่วยแน่": pull-out ends on the small lead
Captions + shade: TH-30 "มีแต่ควันกับเปลวไฟ": local [7, 55) (global [2154, 2202)) ; TH-31 "ไม่มีใครมาช่วยแน่": local [63, 106) (global [2210, 2253)) · shade peak 0.38
Sound: ambience/music state: wind + fire; ends at 76.333 s · cues: f 13 (global 2160): wind and fire continue; add a cold low tone `sfx/hum/hum_low-travelling-flat_01` vol 0.1 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: First vs last frame: lead shrinks from MS to small without a cut; no sirens, voices or helicopters.
Boss dependencies: smoke columns, fires · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B09-SH01: Day 3: count what is left
Range: global [2278, 2476) · 198 f (6.60 s) · shot-local f 0 = global f 2278 (75.933 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-32 76.344-77.039 s (local f 12-33): วันที่สาม | TH-33 77.546-78.652 s (local f 48-82): น้ำเหลือสองถัง | TH-34 79.145-80.414 s (local f 96-134): ปลากระป๋องสี่กระป๋อง | TH-35 80.874-82.149 s (local f 148-186): แบตเตอรี่สิบสองเปอร์เซ็นต์
Cast: none (top-down)
Set: top-down room floor, day 3 card "วันที่ 3", two buckets, four cans, phone with battery 12% (kit phone prop); numerals in Remotion
Light: flat grey day-3 light (shade 0.64)
Camera: Orthographic, static. Counters tick up on the word: "วันที่ 3" 76.344 s (f 12), "2" 77.546 s (f 48), "4" 79.145 s (f 96), "12%" 80.874 s (f 148). Objects appear one at a time with each count (buckets at f 48, cans at f 96, phone at f 148).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (76.344 s): day card
- f 48 (77.546 s): two buckets + 2
- f 96 (79.145 s): four cans + 4
- f 148 (80.874 s): phone + 12%
Captions + shade: TH-32 "วันที่สาม": local [12, 37) (global [2290, 2315)) ; TH-33 "น้ำเหลือสองถัง": local [48, 86) (global [2326, 2364)) ; TH-34 "ปลากระป๋องสี่กระป๋อง": local [96, 138) (global [2374, 2416)) ; TH-35 "แบตเตอรี่สิบสองเปอร์เซ็นต์": local [148, 190) (global [2426, 2468)) · shade peak 0.64
Sound: ambience/music state: `audio/room/room_dark-empty-building_01` vol 0.1 from 76.333 s · cues: f 12 (global 2290): sfx/ui/ui_click-tick_01 x4 at 76.333 / 77.533 / 79.133 / 80.867 s, vol 0.5 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the four beats: one new item and numeral per line; four tick marks each match a numeral frame.
Boss dependencies: top-down plate, buckets x2, cans x4, phone · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B09-SH02: A voice at the door
Range: global [2476, 2543) · 67 f (2.23 s) · shot-local f 0 = global f 2476 (82.533 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-36 82.918-84.516 s (local f 12-59): แล้วก็มีเสียงเรียกหน้าประตู
Cast: `man-crop` with `head.facial stubble`, `P33`, tired, profile on the floor beside the sofa, thin blanket (`new:` blanket, Boss G7); `motion: turn-head-left/right` toward the door (retime so the swap lands at "เสียงเรียก" est. 83.7 s, f 35)
Set: unit sofa corner, day-3 grey light
Light: grey; music out; shade 0.60
Camera: UT13 close MS ~900 px/m, static, 2 % push.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 35 (83.700 s): head turns to the door
- f 50 (84.200 s): hold; the voice comes on the next shot
Captions + shade: TH-36 "แล้วก็มีเสียงเรียกหน้าประตู": local [12, 63) (global [2488, 2539)) · shade peak 0.60
Sound: ambience/music state: music out; room tone only · cues: f 74 (after the shot end; lands in the next shot) (global 2550): `audio/bed/bed_dark-drone-sub_01` ends at 85.0 s (cues-TH.json, fadeOut 0.5 s); B09-SH02 carries room tone only · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the turn beat (83.7 s): head faces the door.
Boss dependencies: G7 sofa corner/blanket · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B09-SH03: Is anyone there?
Range: global [2543, 2620) · 77 f (2.57 s) · shot-local f 0 = global f 2543 (84.767 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-36a 85.000-86.222 s (local f 7-44): มีใครอยู่ไหม
Cast: none (no person)
Set: unit door vantage (same camera as B02-SH03), day 3: cabinet across the door, trash bag still on the floor, thin line of corridor light under the door
Light: grey
Camera: Door vantage, nothing moves. `pushCamera` s 1.00 -> 1.04 over the shot (slow). Caption: none (TH-36a has no caption; voice from the other side). The call is one soft voice at 85.0 s, then true silence 1.5 s (to 87.5 s).
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 7 (85.000 s): call: a soft human voice through the door
- f 44 (86.222 s): silence starts at the end of the call
Captions + shade: none (TH-36a is spoken through the door and has no caption); shade peak in the table is 0.44 but stays off while no caption shows
Sound: ambience/music state: true silence 86.222 -> 87.726 s · cues: f 7 (global 2550): soft human call (VO TH-36a, as spoken in the narration file) + `audio/room/room_dark-empty-building_01` ducked to 0 from 86.222 s for 1.5 s · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: Whole shot: no motion except the push; the trash bag is on the floor.
Boss dependencies: none beyond shared set · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B09-SH04: They do not talk
Range: global [2620, 2675) · 55 f (1.83 s) · shot-local f 0 = global f 2620 (87.333 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-37 87.726-88.793 s (local f 12-44): พวกมันไม่พูด
Cast: `man-crop` with stubble, `P01`, tired, MCU; eyes slide to the door (`talkingCloseUp` no talk)
Set: soft room
Light: grey; shade 0.63
Camera: UT13 close-up ~1400 px/m, static; eyes move to the door side over 6 frames ending on the sub-hit (87.733 s), hold.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 12 (87.726 s): impact on "พวกมัน": eyes slide to the door
- f 32 (88.400 s): hold
Captions + shade: TH-37 "พวกมันไม่พูด": local [12, 48) (global [2632, 2668)) · shade peak 0.63
Sound: ambience/music state: tone returns at 87.733 s · cues: f 12 (global 2632): sfx/impact/impact_sub-hit-short_01 · vol 0.5 (old cue) · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: At the sub-hit: eyes at the door side; no drawn lip sync.
Boss dependencies: none · Status: ready-for-dev (timing checked-with-audio)

## ZC2-B10-SH01: What will you do?
Range: global [2675, 2877) · 202 f (6.73 s) · shot-local f 0 = global f 2675 (89.167 s) · clip note: hard cut in and out
VO (Thai, verbatim, measured): TH-38 89.543-91.723 s (local f 11-77): คุณจะเปิดประตู ส่งเสียงตอบ | TH-39 92.168-92.870 s (local f 90-111): หรือเงียบไว้?
Cast: `man-crop` with stubble, `P33`, worried, profile facing the door, foreground left
Set: two-layer wide: lead front-left; door, cabinet and trash bag deeper; labels in Remotion (x 480-880, y 250-438)
Light: grey day-3
Camera: Deliberate wide (Q-ZC2-S2). Static to the end; push 1.00 -> 1.02 over the last 100 frames. Labels at 89.867 s "เปิดประตู", 90.933 s "ส่งเสียงตอบ", 92.4 s "เงียบไว้" (existing overlay times, cues-TH.json); they stay to the end.
Beats (shot-local frame; times are measured line onsets unless `est.`):
- f 21 (89.867 s): label เปิดประตู
- f 53 (90.933 s): label ส่งเสียงตอบ
- f 97 (92.400 s): label เงียบไว้
- f 133 (93.600 s): knock 1
- f 147 (94.050 s): knock 2
- f 160 (94.500 s): knock 3, then hold to the end 95.9 s
Captions + shade: TH-38 "คุณจะเปิดประตู ส่งเสียงตอบ": local [11, 81) (global [2686, 2756)) ; TH-39 "หรือเงียบไว้?": local [90, 115) (global [2765, 2790)) · shade peak 0.61
Sound: ambience/music state: near-silent hold after the last word (92.87 s) with `room_dark-empty-building_01` vol 0.08 fading out from 95.4 s; ends unresolved · cues: f 133 (global 2808): sfx/impact/impact_knuckle-rap_01 · vol 0.6 ; f 147 (global 2822): same · vol 0.6 ; f 160 (global 2835): same · vol 0.6 · duck: ambience, bed and clock pulse duck 0.4-0.5 under the narration (cues-TH.json); Editor sets levels
Cut: hard cut at the end; no dissolve.
Acceptance: From 92.4 s: three labels on screen; knocks at the three named frames; last frame still (loop seam: no motion).
Boss dependencies: none · Status: ready-for-dev (timing checked-with-audio)

## Dependencies and open items
| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | W5.2: G1-G11 poses and the sets/props list above, plates one per shot; plate must be larger than the frame by each shot's s1 factor | open |
| Editor | Timeline from this sheet: shot order and `from` = Global start; caption cues from `lines.json`; shade cues per shot; sound cues at the global frames listed (all library IDs listed) | open |
| Editor | Check the 2 sub-1 s shots as an on-screen pair; B09-SH03 has no caption; B10 final hold has no motion (loop seam) | open |
| Film | Word-level times marked `est.` are not measured; if Editor measures word onsets, tell Film to move the beats | open |
| User | `Q-ZC2-S2` wide shots (B01-SH02, B07-SH02, B08-SH02, B10) and `Q-ZC2-K1/K2/F5` were answered or carried by the page verdicts; nothing new is asked here | n/a |

Element captures: blockout stills `$REELS_STORE/projects/ZCONDO2/previews/ZC2-SB-R3/<shot>-sb-r3.png` (one per shot, not plates); approved look frames r6 in `previews/ZC2-kit-frames-r6/`. Editor scene sample: propose B02-SH04 (the drag, a G1 pose) and B10-SH01 (labels + knocks).

## Change log
- 4 Nov 2026 SS-ZC2-R1 (Film, W5.1): first timed sheet over rows ZC2-SB-R3.1 and the voice lock (95.9 s, 2877 f). Windows taken from the voice-lock proposal at integer frames; B02-SH01/SH02 equalised to 27 f; the freeze after B02-SH05 follows the line end (16.485 s), not the shot start; B05-SH03 cistern SFX and B06-SH03 can SFX retimed from the old ZCPAINT cue set to the visual beats; no deviation from the approved story, reveals or IDs.
