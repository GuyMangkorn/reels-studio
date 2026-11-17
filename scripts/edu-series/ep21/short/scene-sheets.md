# Timed scene sheets and index — EDU-EP21-SHORT (EDU-EP21-SHEETS-R4)

- **Deliverable:** `EDU-EP21-SHORT` (channel **edu**), one story scene `EDU-EP21-SHORT-S01`, beats B01–B05 · **Revision:** EDU-EP21-SHEETS-R4 (Film, user request after Draft v1, 2026-11-17: a visible bolt landing on the car in B01-SH01 and two more live strikes in the B05-SH13 hold, see the [R4 decisions](#user-request-revision-draft-v1-sheets-r4); R3 = Film W5.2f fix-batch decisions on Boss FX1/FX2, 2026-11-17; R2 = Film W5.2 plate-review decisions, 2026-11-17; R1 = Film W5.1 timed pass, 2026-11-16; no voice retime, no shot ID or range change) · **Status:** `ready-for-dev`, voice-timed to the approved narration VOICE-R2 · **Timing:** `checked-with-audio` on paper: line onsets/ends and internal gaps are `meas` from [voice-measure.json](voice-measure.json) (EDU-EP21-VOICE-R2, ±0.1 s at L08|L09 and L10|L11); word onsets inside a line are `meas-w`: faster-whisper large-v3-turbo word times on the same take (`full_1.05x0.95.wav`, Film run 2026-11-16, ±3 f; Thai ASR mishears words but its times track the audio).
- **Evidence:** runtime: none · render/samples: none at this timing (look frames LF01 r3, LF02 r3, LF03 r4b only) · projection: every world-space shot's start/end camera through `scripts/shot-projection.py` by [projection-run.py](projection-run.py) (log `out/logs/edu21-w5-projection.log`, JSON per state `out/edu21/w5-projection/`) · audio/subtitle sync: unverified until the Editor's blockout · user approval: SCRIPT-R1, looks (LF01–LF03), Q2 casting, Q4 oblique family, VOICE-R2 (all 2026-11-16); this sheet itself is not user-approved.
- **Inputs (by revision):** script **EDU-EP21-SCRIPT-R1** ([script.md](script.md)); fact-check **EDU-EP21-FACT-R1** ([fact-check.md](fact-check.md)); brief **EDU-EP21-BRIEF-R5** (R5 = truth limit 2 amended for the visible live strikes; [film-brief.md](film-brief.md): VD01–VD10, N1–N7, truth limits 1–8, [projection contract](film-brief.md#projection-contract-and-scale-baseline), [set plan](film-brief.md#set-plan--set-road21-space-r-metres-est) with the [W3.1 revisions](film-brief.md#look-frames-w31), [sound direction](film-brief.md#sound-direction)); rows **EDU-EP21-ROWS-R4** → R5; delivery record [delivery.md](../delivery.md) EDU-EP21-DELIVERY-R2; task [task.md](../task.md).
- **Target:** this worktree, branch `claude/episode-21-continuation-33d2a4` at `28bc641` + uncommitted EP21 files · 30 fps · `durationFrames` **1320** (44.00 s) · 1080×1920 · composition `EDU-EP21-SHORT` (to be registered by the Editor, never in `src/Root.tsx`) · ending closed: 90 f hold, END1, `A_fade`, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP21-ROWS-R7** (timed, `start`/`end` in G frames; R7 = SHEETS-R4 text for B01-SH01 and B05-SH13 only; R6 = SHEETS-R2 notes). Review page: pending.
- **Plate evidence (R2 decisions):** Boss BG1–BG4 plates and QA sheets `out/qa/edu21/bg{1,2,3,4}/final/sheet-*.png`, measured numbers in [build-notes](../build-notes.md#w52-boss-bg4-consequences--2026-11-17); decisions D-Q2…D-Q22 and D-S1/D-S8/D-M1 in the [plate-review decision log](#plate-review-decisions-w52-sheets-r2).
- **Plate evidence (R3 decisions):** Boss FX1/FX2 QA sheets `out/qa/edu21/fx1/final/sheet-*.png`, `out/qa/edu21/fx2/final/sheet-*.png`, `out/qa/edu21/fx2/sh10-tile-zoom3x.png`, `r4-sh11-tiles.png`, `r5-sh08.png` (viewed) and the measured numbers in [build-notes](../build-notes.md#w52f-boss-fx2--2026-11-17); decisions D-FX1-Q1…D-FX2-Q3 in the [fix-batch decision log](#fix-batch-decisions-w52f-sheets-r3).

## Units and conventions

- **Space R** (SET-ROAD21), metres, origin on the road under the car centre, +x along the road toward the car's nose, +y up, +z toward the verge and the driver's side (right-hand drive). Set and car as the brief's [set plan](film-brief.md#set-plan--set-road21-space-r-metres-est) with the W3.1 build values, which win: shoulder to z +2.4 (verge 2.4–4.0, ditch 4.0–5.2); CAR21 roof y 1.49, greenhouse corners TF (0.40, 1.49, ±0.64), TR (−0.98, 1.49, ±0.64), beltline F (1.05, 0.92, ±0.80), R (−1.55, 0.96, ±0.80); body z ±0.85; wheels (±1.30, 0.31, ±0.75) r 0.31; FR = front-right tyre (+1.30, 0.31, +0.75), outer sidewall at z +0.85; cluster face x 0.519, y 0.90–1.04, z 0.24–0.52; radio screen x 0.519, y 0.82–0.94, z −0.10…+0.10; radio power button (0.519, 0.85, +0.08) (est, new); wheel centre (+0.30, 0.95, +0.38) (`src/painted/edu21/car.ts`, `cabin.ts`).
- **One set change (SD10):** sugar-palm clump P1 moves from (−40, 0, −60) to **(−60, 0, −200)**, 15 m tall.
- **Camera lines** use the kit form `cam(at, yaw, r, eye, f, hy[, pitch])` = `camMove(at, [yaw0, yaw1], [r0, r1], [eye0, eye1], {f, hy, pitch, ease})` (`src/painted/kit/cam-moves.ts`): the camera stands at at + r·(sin yaw, 0, cos yaw) at absolute height `eye`, kit yaw = −yaw, level, then tilted by `pitch` (deg, + looks up). yaw 0 = camera on +z looking −z. `f` and `hy` are static inside one `camMove`; a lens or horizon change needs a second segment. Picture x = 540 + f·right/depth, y = hy − f·up/depth. Boss types these numbers into `camMove` unchanged.
- **Clocks:** `G` = composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Every event is a pure function of G or L (seek-safe). Rain, wind and far-sky flicker run on G through cuts and the hold (DF-20261030-painted-story-hold-ambient-clock).
- **One shot = one timeline scene** (scene ID = the shot ID). Every cut is hard; no dissolve (DF-20261029-painted-timeline-dissolve).
- **Frame zones** (brief): caption band y 1176–1344 (stroke-only edu captions, caption-safe x 120–888); faces, the tyre damage, the dash and radio, the glow's key turns and the label chip above y 1160; `@TamMaiLa` top-left; chip under the mark (est x 60–420, y 200–260, Editor fixes the box).
- **DRIVER anchors** (cast.ts): hip H (−0.15, 0.40, +0.38), crown H + 0.97 m (y 1.37), chin y 0.955, face centre y 1.16; four-head card, view cues on (`pitchCue`, `quarterFollow`, `backQuarter`). **Lead size:** DRIVER hip→crown ≥ 480 px when she is the subject; in exterior car shots the car is the lead (vertical roof → nearest tyre contact ≥ 480 px). Recorded exceptions are named in the shot blocks.
- **Car states by shot:** `dashGlow` on G0–12 only. FR damage (scorched split on the lower-rear quadrant of the outer sidewall, near the contact) and sag (FR corner down, rigid body transform about the rear-left contact (−1.30, 0, −0.75), est roll 1.6° toward +z and pitch 0.8° nose down at 0.06 m): SH01–SH06 damage present but unreadable (in the contact shade, no sag, SD13); SH07 end sag 0.02 m, scorch readable; SH08 sag 0.02 → 0.06 m; SH10–SH13 sag 0.06 m. Interiors (SH04, SH05, SH09, SH12) ride with the car: no visible tilt.

## Casting, props and hands

Casting per brief VD02/VD03 (user-approved, Q2): **DRIVER** `woman-ponytail + new: commuter (mustard short-sleeve blouse, navy trousers, dark flats), new: car-seat sit (P31 body on the seat cushion)`; expressions `worried`, `surprised`, `neutral`, `suspicious`, `relieved` (kit); poses `new: car-seat sit` (hands on the wheel at 9-and-3), P12 (hands near the face), P31 arms (hands on the thighs), `new: radio reach` (left hand to the radio button). **CAR21** `new: compact hard-top sedan (generic, metallic red)`, every window closed in every shot. No other people or vehicles.

| Prop / hand | State by G | Possible? |
| --- | --- | --- |
| Hands | Both on the wheel rim at 9-and-3 G0–13; lift off at the strike (G14) to near the face (P12) by G37; lowered to the thighs G69–95 and there through G773; left hand reaches the radio button G774–793, presses G794–804, returns to the left thigh G805–821; both on the thighs to the end | yes; nothing carried, the wheel and button are fixed cabin parts |
| Steering wheel, radio button | Fixed in the cabin; the button is pressed once (G794) | yes |
| Door frame, pillars | Never touched; her right elbow pulls in from the door panel at G365 (conservative staging, F06, not advice) | yes |

## Narration placement (Editor)

The approved narration is **one continuous read** (`full_1.05x0.95.wav`, 40.945 s; store `projects/edu/EDU/narration/ep21/2026-11-16_kore-x0.9975-r2/`). The Editor splits it once, at the centre of the L06>L07 gap (file 21.135 s), and places two segments; the 10 added frames are filled with crossfaded room tone from that gap (the EP17 [narration-place.py](../../ep17/narration-place.py) method), never digital silence. Placement **G = 30·t_file + c**.

| Segment | Lines | File in → out (s) | c (f) | Added before it (f) | First onset G | Last end G |
| --- | --- | --- | --- | --- | --- | --- |
| A | L01–L06 | 0.000 → 21.135 | 0 | 0 (the file's own 0.10 s lead) | 3.0 (L01) | 632.1 (L06) |
| B | L07–L12 | 21.135 → 40.945 | +10 | 10 (GD1, the look at the tyre) | 646.0 (L07) | 1230.1 (L12) |

Line ranges on G (`meas`): L01 3.0–95.4 · L02 102.9–216.0 · L03 228.3–305.7 · L04 320.1–398.4 · L05 413.4–543.6 · L06 552.3–632.1 · L07 646.0–753.1 · L08 770.8–819.1 · L09 824.5–924.1 · L10 935.8–1008.7 · L11 1012.6–1095.7 · L12 1110.1–1230.1.

**Gap decisions** (timeline gaps, never a re-read):
- **GD1 — L06>L07 widened +10 f** (0.13 → 0.47 s). "ดูยางก่อน" tells the viewer to look; the cut to the damaged tyre (B03-SH08) gets 10 frames with only the hiss before L07 names the damage.
- **GD2 — L10>L11 kept at 0.13 s.** "ไม่ได้แปลว่า… แล้วก็ไม่ได้…" is one list; the SH11→SH12 cut lands inside the 4-frame gap (G1011).
- **GD3 — L01 comma kept without a pause.** The SH01→SH02 cut on "ที่" (G29) marks the turn; inserting a gap there would cut inside continuous speech.

## Total runtime

| Part | Frames | Notes |
| --- | --- | --- |
| Head before L01 | 3.0 | the file's own lead; frame 0 is the pre-strike storm, the strike lands at G12 |
| Narration span L01 onset → L12 end | 1227.1 | the read (1217.1 f) + 10 f GD1 |
| Hold after L12 | 89.9 | end strikes E1 (G1248) and E2 (G1266), END1 (G1272) + `A_fade` (R4) |
| **Total** | **1320** | **44.00 s**, inside 40–60 s (VOICE-R2 measured 43.57 s with a 3 s hold + GD1 0.33 s + rounding) |

## Staging deviations (Film decisions from the projection run)

Every number is already in its shot block; the reasons live here. Projected values are from `out/logs/edu21-w5-projection.log`.

| ID | Shot | Change (brief → sheet) | Reason |
| --- | --- | --- | --- |
| SD01 | B01-SH03 | side profile `at (0, 0.75, 0), yaw 0→8, r 6.2→6.4, eye 1.2→2.4, f 1100, hy 760` → oblique `cam((0.3, 0.75, 0), 34→40, 4.4→4.6, 0.9→2.3, 880, 900, pitch 0→−20)` | Q4 (user 2026-11-16): the oblique front-three-quarter family for SH03/SH06/SH10. Car 389 → 367 px (was ~300 in profile); pitch −20 at the top keeps the FR contact at y 1133 (at −14 it fell to 1235, in the band) |
| SD02 | B04-SH10 | profile start → starts on SH06's end camera `cam((0.4, 0.7, 0), 36, 4.1, 0.65, 880, 940)` and pushes to `cam((0.45, 0.95, 0.30), 34, 2.3, 1.25, 880, 940)` | Q4; the same vantage as SH06 so only the inner branch is new. Eye 1.25 at the end so the ray to the cluster passes the door glass 0.11 m above the beltline (cluster y 1052, beltline y 1112 on screen) |
| SD03 | B04-SH09 | over the **right** shoulder `at (0.30, 0.95, 0.25), yaw −95→−90` → over the **left** shoulder from the rear-seat centre `cam((0.52, 0.92, 0.20), −102→−98, 1.34→1.24, 1.28, 700, 760, −14)` | right-hand drive: the radio sits at z 0, to her left; from behind the right shoulder her head covered the cluster on the lens axis (head and cluster both at screen x ≈ 749). Now head x 843–878, cluster 627–708, radio 431–439, button 476–481. Same rear vantage family as SH04 (LF02) but higher and tighter on the console |
| SD04 | B01-SH01 | `yaw 40→34, r 4.6→4.2, pitch +4, f 1250, hy 700` (W3: `40→34, 3.8→3.5`) → `yaw 40→38, r 3.8→3.75, eye 0.45, f 1150, hy 1000` | the shot is 29 f; a 6° arc in under a second whips. At r 3.5 the FR contact entered the band (1184); at 3.75 it sits at 1175 |
| SD05 | B03-SH07 | f 1250, end pitch −8 → f 1100 throughout, level, end `cam((1.30, 0.40, 0.75), 18, 2.0, 0.60, 1100, 620)` | f is static in a `camMove`; with pitch −8 the tyre sat at y 454–804 (top of frame), level it sits at 608–966 with the wheel arch above |
| SD06 | B03-SH08 | hy 760 → 700 | at hy 760 the end contact fell to y 1231 (band); now 1112 → 1171 |
| SD07 | B05-SH11 | `r 5.6→5.3, yaw 38→46, eye 1.8, pitch −8` → `cam((0.2, 0.7, 0.2), 48→54, 4.6→4.5, 2.4, 1200, 720, −16→−18)` | the brief's camera projected the car at ~420 px (< 480); higher so the roof and the sag read; at yaw 56/r 4.4 the FR contact fell into the band (1193) |
| SD08 | B05-SH12 | yaw 180→172 → 180→175, view `left` held | at 172 her facing angle crosses the 82.5° profile cut (view pop mid-shot) |
| SD09 | B05-SH13 | `f 1000→1150, hy 700, r 0.9→5.2` → f 1000 fixed, hy 800, `pitch −8→−2`, end `r 4.0, eye 0.9`, plus a hold segment | no zoom (one lens per `camMove`); car 488 px at the end (≥ 480), FR contact 1085; the whole car fits except the far nose corner |
| SD10 | set | palm clump P1 (−40, 0, −60) → (−60, 0, −200) | LF03 known defect 4 and the W3 finding (a palm over the roof read as spiky hair on her head at yaw 26–36). Projected P1 top now clear of the roof and her head in every exterior: SH01 (977, 916), SH03 (807, 839) → (942, 514), SH06/SH10 (840–874, 877), SH13 end (1004, 692) |
| SD11 | B01-SH02, B02-SH05, B03-SH07, B05-SH12 | targets on the brief's hip (−0.30, 0.52) → the W3 hip (−0.15, 0.40) | the brief predates the W3 look-frame hip |
| SD12 | B03-SH08 → B05-SH13 | sag and readable damage start at SH07's end, not at the strike | the FR tyre is in frame in SH01, SH03 and SH06; drawing the scorch there spends the B03 reveal (CL21-01). The scorch sits on the lower-rear sidewall in the contact shade; a slow leak (truth limit 5: a possible consequence) |
| SD13 | B04-SH10 | the cluster is drawn lit at the start and flickers out when the branch arrives | a re-enactment inside the labelled explanatory state (chip on); the live dash stays dark |
| SD14 | B01-SH04 | end yaw −100 → **−106** (`cam((0.3, 1.0, 0.3), −104→−106, 1.35→1.42, 1.08, 760, 820)`) | D-Q7: from about L60 on −100 the headrest covered her head and read as a grey block on it; holding the arc on the same side keeps her head beside the headrest. R3 (D-FX1-Q1): visible lead 402–445 px accepted (was 414–445) |
| SD15 | B02-SH05 | dash front edge, cluster hood and wheel drawn 0.26 m lower for this lens only (`cheat.dashDy −0.26`), head turn = nod + eye look | D-Q6, D-Q9 (Boss BG2 record): the four-head card's chin sits under the real wheel top; the world-true eye 1.45 m loses the bonnet that says "the lens is outside the glass" |
| SD16 | B04-SH10 | end yaw 34 → **28**; branch and cluster drawn to read at phone size (see the shot block) | D-Q13, D-Q14: on yaw 34 the cluster sat 4–21 px from the A-pillar's inner edge and neither the branch nor the flicker read on the QA sheet, so CK21-09 was not shown. Film estimate (own level pinhole, not the kit): the cluster moves from about 61 to about 92 px clear of the near A-pillar centreline at yaw 28; Boss measures. R3 (D-FX2-Q1): Boss measured 9–15 px (the estimate was wrong); built as is, the branch crosses the A-pillar foot (~25 px hidden) and reads on both sides |
| SD17 | B05-SH11 | sag **0.09 m** for this lens only (FR corner), flattening scaled with it | D-Q19: at 0.06 m the sag is about 15 px here and the FR tyre read as intact on the sheet; L10 says the car is damaged. SH10, SH12 and SH13 keep 0.06 m (no cut joins SH11 to a matching tyre view). R3 (D-FX2-Q2): hub drop 0.03 m (arch onto the tyre), compared with the RR because the FL is hidden from this lens |
| SD18 | B05-SH13 | car lead 476 px at L125 → 464 px at L214 accepted | D-Q20: 3 % under 480 after the sag; the whole sagging car still reads and a closer segment B would cut more of the nose |
| SD19 | B01-SH01 | bolt tip hidden in the bloom ~500 px above the roof (BG1 tip y 3.8 m) → **visible bolt landing on the near rear roof edge T (−0.70, 1.49, 0.62)**, leader G10–11, strokes G12–13 and G15–16, `Flash` 0.85 → 0.40, bolt drawn over the Flash | D-U1 (user, Draft v1: "ไม่เห็นฟ้าผ่าเลย"); truth limit 2 amended in BRIEF-R5 |
| SD20 | B05-SH13 | hold: rain/warm easing from L95 and END1 at G1230 → **two live strikes E1 G1248 (rear roof edge), E2 G1266 (bonnet)**, easing and warm lift L167–215, END1 G1272 | D-U2 (user: "ตอนจบอาจจะโดนอีก 2 เส้น") |

## Sound plan (whole video; per-shot cues in the shot blocks)

Cue designs are the brief's [sound direction](film-brief.md#sound-direction) (A1–A3, M1, S1–S6, END1); this sheet adds frames, two cues and one omission. Ton makes every NEEDS-GEN item and checks every library ID by ear; Editor places exactly these frames (±3 f into syllable gaps).

- **New S7** library candidate `weather_thunder-roll-distant_01`: one far thunder roll rolling across the paddy behind rain / single roll, slow swell and decay / low air rumble, no crack / far, wide, outdoors / ≈3 s / unease under the question. B02-SH05 L8 (G323), well under L04. Fits only if it sits behind rain without a crack; else NEEDS-GEN.
- **New S8** NEEDS-GEN inner branch: one thin, high, glassy filament sweep, much smaller than S4, sliding inward and down, ending on a soft dull tick / one gesture / fine glass, felt-damped / close, small, centre / 0.8 s / "a little gets in". B04-SH10 L30 (G852). **R2 (D-S8):** the made file is 1.0 s with its peak at 0.93 s; play it whole, untrimmed, G852–882 (ends L60, one frame before the cluster flicker L61); the late peak lands as the branch reaches the dash, just before "ทำลาย" G881. The dull end tick is optional; the falling sweep carries the beat.
- **S2 startle breath: omitted.** No driver voice is cast (script has no dialogue).
- **Music map (G):** M1 fades in over 10 f at G29 (SH02 cut, after the strike) at energy 1.5 → steady through B01 → fades out over 8 f from G315 (L04 rests on rain) → back with the pulse at G410 (energy 2) → lighter texture G548–765 (piano and pad, pulse thinned) → low under L08 → **cut dead at G802 with the S6 blip** → silence G802–822 → sparse re-entry on the SH10 cut G822 → warmer from G930 (pad opens) → major colour on L12 G1110 → pulse stops at G1171 ("กลับเป็น") → tail fades out G1230–1244 (R4; R3: handed over to END1 at G1230, gone by G1260), so the hold has rain alone before the end strikes. **R2 (D-M1), one file `bed_curious-felt-piano-pulse-92_01`:** every entry after G29 starts at file offset (G − 29)/30 s (as if the bed had played on under the rests), moved to the nearest bar start within ±1 bar (92 bpm ≈ 2.61 s per 4/4 bar; Editor reads the bar grid from the file's onsets), 3 f fade-in except where the map gives one. Texture states become gain/EQ only: "lighter, pulse thinned" G548–765 = −4 dB and a high-pass at about 180 Hz; "sparse re-entry" G822 = −6 dB fading up to −3 dB by G852; "warmer" G930 = the plain bed (no filter); "major colour" G1110 is dropped (END1 carries the major resolution); "pulse stops" G1171 = the 180 Hz high-pass back on and a fade to silence by G1260. No stem is needed.
- **Ambience map (G):** the room follows the camera's side of the shell, hard-switched on the cut with 3 f crossfades: A1 exterior G0–223 (SH01–SH03), A2 cabin G223–315 (SH04), A1 G315–408 (SH05, lens on the bonnet), A3 = A1 low-passed −8 dB G408–548 (SH06), A1 G548–765 (SH07–SH08), A2 G765–822 (SH09), A3 G822–930 (SH10), A1 G930–1011 (SH11), A2 G1011–1105 (SH12), A1 G1105–1320 (SH13; A3-light G1178–1240 for the echo; rain eases −6 dB and low-passes G1272–1320 (R4; R3: G1200–1320), fades out under `A_fade`).
- **END1** "storm passing" (brief) at **G1272** (R4; R3: G1230, the first frame after L12), 6 f after the last strike E2, so the warm chord and its far roll answer the two cracks; rings into `A_fade` by G1320.
- **New S9a/S9b (R4, end strikes):** S9a G1248 = the S1 file reused (a deliberate rhyme with the hook: same car, same edge, same crack), file start G1244, peak 2 dB under S1; S9b G1266 NEEDS-GEN, the nearer bonnet strike (design in the [Ton brief](#user-request-revision-draft-v1-sheets-r4)). No voice in the hold, so no ducking against speech; nothing in the hold peaks above S1.
- **Ducking:** brief values (music −8 dB, A1 −6 dB, A2 −8 dB under narration; S1 4 dB above music, VO on top after its first 6 frames).
- **S1 level exception (R2, D-S1):** the S1 rows in `levels.checks` measure the strike where it actually meets the voice: **0.40–0.60 s (G12–18) `speech` dV ≥ 4** with `exception` "brief S1 strike over 'ใช่', 6 f" (the one startle of this Short; EP08b's scare-hit exception, which asks a drop before it: G0–11 has no music, only rain), then **0.60–2.0 s dV ≥ 12** (the standard over-speech row). Ton's current 0.10–0.30 s window sits before the strike (G3–9) and measures nothing. "ใช่" carries the negation of the hook ("ไม่ใช่ยาง"); if the ear check (EP08a) hears "ไม่…ยาง" without "ใช่", raise the first row to dV ≥ 8 rather than move the strike.

## Caption plan

Subtitles are the VO verbatim (script text, "…" kept where the script has it), stroke-only edu captions in the band; one cue per phrase, displayed from the phrase onset to the line end + 6 f, clipped to 2 f before the next onset. Phrase splits follow the read's own gaps or `meas-w` word onsets. The label chip (N7) is not a subtitle. No caption during the hold.

| Cue | Text | G range |
| --- | --- | --- |
| C01a | ไม่ใช่ยางนะ... | [3, 27) |
| C01b | ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า | [29, 101) |
| C02a | ต้องเป็นรถปิดมิดชิด | [103, 153) |
| C02b | หลังคากับตัวถังโลหะ ปิดกระจกด้วย | [155, 222) |
| C03 | ตัวที่ช่วยป้องกัน กลับเป็นเปลือกโลหะรอบคุณ | [228, 312) |
| C04a | เดี๋ยว...โลหะนำไฟฟ้า | [320, 363) |
| C04b | แล้วมันจะช่วยได้ยังไง? | [365, 404) |
| C05a | เพราะกระแสไฟไหลไปตามเปลือกโลหะด้านนอก | [413, 487) |
| C05b | รอบคนข้างใน แล้วลงดิน | [489, 550) |
| C06a | แต่ถ้าคิดว่ารถไม่เป็นอะไร... | [552, 596) |
| C06b | ดูยางก่อน | [598, 638) |
| C07a | ฟ้าผ่ายังทำให้ยางเสียหายได้ | [646, 708) |
| C07b | มันไม่ได้หยุดอยู่เหนือยางนะ | [710, 759) |
| C08 | งั้นทำไมไฟหน้าปัดถึงดับไปด้วย? | [771, 822) |
| C09a | เพราะกระแสไฟบางส่วน | [825, 869) |
| C09b | อาจเข้าไปทำลายระบบไฟของรถได้ | [871, 930) |
| C10 | ช่วยป้องกันคน ไม่ได้แปลว่ารถจะไม่พัง | [936, 1011) |
| C11a | แล้วก็ไม่ได้รับประกันว่า | [1013, 1050) |
| C11b | คนข้างในจะปลอดภัยทุกครั้ง | [1052, 1102) |
| C12a | โลหะที่คุณกลัวว่านำไฟ... | [1110, 1169) |
| C12b | กลับเป็นทางให้ไฟผ่านรอบตัวคุณ | [1171, 1236) |

## Shot map

| Shot | Beat | G range [start, end) | Lines | Claims / clues | Runtime mapping |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | B01 | [0, 29) | L01a | CK21-01/02; CL21-01, CL21-02, CL21-03 plant | planned: scene 1 |
| B01-SH02 | B01 | [29, 100) | L01b | CK21-01 | planned: scene 2 |
| B01-SH03 | B01 | [100, 223) | L02 | CK21-02; CL21-02 declared | planned: scene 3 |
| B01-SH04 | B01 | [223, 315) | L03 | CK21-03 | planned: scene 4 |
| B02-SH05 | B02 | [315, 408) | L04 | CK21-04 | planned: scene 5 |
| B02-SH06 | B02 | [408, 548) | L05 | CK21-05 (labelled simplification) | planned: scene 6 |
| B03-SH07 | B03 | [548, 636) | L06 | CK21-06 | planned: scene 7 |
| B03-SH08 | B03 | [636, 765) | L07 | CK21-07; CL21-01 paid | planned: scene 8 |
| B04-SH09 | B04 | [765, 822) | L08 | CK21-08 (hypothetical); CL21-03 paid | planned: scene 9 |
| B04-SH10 | B04 | [822, 930) | L09 | CK21-09 (labelled; inner branch) | planned: scene 10 |
| B05-SH11 | B05 | [930, 1011) | L10 | CK21-10 | planned: scene 11 |
| B05-SH12 | B05 | [1011, 1105) | L11 | CK21-11 | planned: scene 12 |
| B05-SH13 | B05 | [1105, 1320) | L12 + hold | CK21-12 (labelled echo) | planned: scene 13 |

## Shot sheets

### B01-SH01 · 0–29 · the strike (L01a)

- **Time:** frame 0 pre-strike: far fork at full G0–2, dim G3–5, second flicker G7–8, gone G9. **R4 strike (D-U1, user request after Draft v1):** stepped leader G10 (frame top → screen y ≈ 330) and G11 (→ y ≈ 640, about 90 px above the roof edge), dim, silent; **return stroke 1 lands on the car G12–13** (full channel frame top → near rear roof edge, branches, contact flare, car rim, rain lit); dark gap G14 (channel 0.30, no core, branches 0, flare 0.30); **restrike G15–16** in the same channel (channel and flare 1.0, branches 0.35, rim, rain lit); afterglow G17 0.55, G18 0.30, G19 0.12 (no flare after G18), off G20. Kit `Flash` **0.40** G12–13, 0.15 G14, 0.30 G15–16, linear to 0 by G21 (R3: 0.85/1.0 G12–13, which washed the bolt out). `dashGlow` off from G13. L01 onset G3, "ใช่" G13 (`meas-w`), "ยาง" G19.
- **VO + subs:** "ไม่ใช่ยางนะ..." (L01 first phrase, continues over the cut); C01a [3, 27).
- **Staging (R):** CAR21 at the origin, nose +x, every window closed; DRIVER `facing +x` (front three-quarter through the front door glass), hands on the wheel, `worried`, cyan dash wash on her face (13 %, `#9cc8f0`, LF01) until G12; jolt G14–20 (shoulders up 3 cm, head back 2 cm, `surprised` from G14). Far fork high left (LF01: x 200, y 250–560), gone before the strike. **Near bolt (N5, R4):** contact **T = (−0.70, 1.49, +0.62)** est, the near (lens-side) rear roof edge above the rear door, 0.55 m behind her crown; Boss snaps T to the painted roof-edge surface of `car.ts` at x −0.70 (≤ 0.04 m inside the edge, so the tip touches the visible rim). Channel waypoints (R, m): T → (−0.62, 1.95, 0.60) → (−0.78, 2.45, 0.55) → (−0.50, 2.95, 0.50) → (−0.58, 3.45, 0.40) → (−0.25, 4.00, 0.30) → (−0.30, 4.60, 0.20) → (0.05, 5.40, 0.10) → (0.20, 6.50, 0.00) → on up to the cloud base (70 m, off frame); 3 subdivisions per segment, seeded perpendicular jitter ≤ 0.05 m. Branches from waypoint 3: → (−1.15, 2.25, 0.55) → (−1.35, 1.95, 0.50) (ends in air 0.46 m above the rear roof corner, never touches the car); from waypoint 5: → (−0.10, 3.25, 0.40) → (0.20, 2.95, 0.35) → (0.35, 2.70, 0.35); from waypoint 6: → (−0.85, 3.85, 0.30) → (−1.20, 3.55, 0.30); from waypoint 7: → (0.40, 4.45, 0.20) → (0.80, 4.10, 0.20) (mostly off frame). Projected at L0 / L29: T (247, 732) / (235, 727); channel (264, 611), (250, 497), (305, 351), (312, 243), (387, 77), crosses the frame top at x ≈ 395 / 385; branch ends (180, 653), (494, 353), (240, 292); her crown (390, 754) / (383, 750), face (390, 810) / (383, 807): T is **≥ 145 px** from her crown, the nearest branch end ≥ 210 px from her face. Damage unreadable (SD12).
- **Bolt look (R4):** white core `#ffffff` **8 px** at T tapering to 6 px at the frame top; body `#e6eeff` **20 px**; halo `#b9ccff` **56 px**, screen blend, blur σ 12 (all at 1080×1920; at 540×960 core 3–4, body 10, halo 28; on the 270 px QA tile core ≈ 2, body 5). Branches: core 3 → 1 px taper, body 8 px, halo 24 px. Leader G10–11: core `#c9d6ff` 3 px, opacity 0.5/0.6, no halo, 2–3 short stubs. **Contact flare** centred on T: white core disc r **18 px**, `#e6eeff` glow to r **80 px** (screen, smooth falloff), four spark rays 30–50 px; it overlaps the painted roof edge by ≥ 6 px so the bolt is seen to touch the metal. **Car rim** G12–13 and G15–16: the existing cold outline (`#f4f8ff` 3.2 px + wash 0.2) plus the near roof edge lit `#ffffff` 5 px, full within 120 px of T, fading to 0 by 300 px; nothing moves along the body (not a route, truth limit 2 R5). Rain lit `#eef4ff` on G12–13 and G15–16. Draw order: kit `Flash` first, then the bolt halo/body/core and the flare **above** it (R3 drew the Flash over the bolt).
- **Camera (R):** `cam((0.6, 0.55, 0.4), 40→38, 3.8→3.75, 0.45, 1150, 1000)` over L0–29 (start = LF01), unchanged; no shake (a shake smears the line on the four frames it is at full; the jolt is hers). Run: car roof 681 → FR contact 1172 (**491 px**) → 675 → 1175 (500 px); her face (390, 810) → (381, 805); FR centre (656, 1052) lower right; P1 palm (977, 916) over the bonnet. Frame top at the car's depth ≈ 4.5 m, so ≈ 3 m of channel (≈ 730 px) is on screen from the top edge to the roof. Lead: car ≥ 480.
- **Look:** LF01 (approved r3) for G0–9 unchanged. Strike G10–20 as above (sheet R4, not a look frame; first viewed at the FX4 QA sheet). Post-strike G20–28: the same cool key, cabin a shade darker, no dash glow.
- **Sound:** A1 from L0 (rain on asphalt and roof, wind); **S1** strike L12 (G12), **unchanged frame**: the picture lands on G12 (the leader G10–11 is silent pre-light, the crack belongs to the landing); `impact_lightning-strike-close_01`, crack at file 0.13 s, file start G8; the restrike G15–16 sits inside its tearing tail (Ton notes by ear whether a second snap near +0.1 s is there; not required). Peak ducked under "ใช่" so the word reads (R2 D-S1 windows unchanged). Mix: hit → VO on top from G18.
- **Cut:** hard at L29 (G29) on "ที่", VO continuous.
- **Entry → exit:** storm, far fork, lit face, hands on the wheel → a bold bolt hits the car's roof edge twice in one flash → cool storm, her jolt, dash dark.
- **Accept:** frame 0 shows the storm, the closed red hard-top body (R2, D-Q2: the whole greenhouse, both doors and both wheels in frame; the tail and nose may touch the frame edges, as the approved LF01), her face behind closed glass and the far fork, no caption. **R4 strike (measured on G12, G13, G15, G16 at 1080×1920; FX4 measure script):** (a) the channel is one unbroken line from y 0 to the tip, no gap > 4 px; (b) the tip lies within 6 px of the projected T and the flare core overlaps the painted roof edge by ≥ 6 px; (c) core luma (Rec. 709) ≥ 0.95 on ≥ 90 % of samples along the visible channel; sky luma 70 px either side of the channel ≤ 0.60 (contrast ≥ 0.35); (d) nothing outside the bolt, flare and rim exceeds luma 0.85 over > 2000 px²; (e) widths measured across the channel at y 300 and y 600: core 6–9 px, core+body 18–24 px; (f) no bolt, branch or flare pixel adds > 0.15 luma inside her face box (projected face ± 60 px each frame); (g) no bolt pixel inside the `@TamMaiLa` box (Boss reads the box; channel crosses y 140 at x ≥ 330); (h) car body mean luma ≤ 0.75 and mean hue within 15° of G0 (red, no whiteout); (i) `scripts/caption-zone.py` 1176:1344 pass at G12, G13, G15, G16, `Flash` adds ≤ 0.10 luma in the band; FR contact ≤ y 1176; (j) on the 270 px QA tile the bolt reads as a bright line from the tile top to the roof (viewed). Seek parity at G10–21.

### B01-SH02 · 29–100 · she startles (L01b)

- **Time:** match on action: hands rising L0–8, near the face (P12) L8–40, lowered to the thighs L40–66; `surprised` → `worried` at L44; a short breath (shoulders drop 2 cm) L48–60. "ที่" L0, "ฟ้าผ่า" L48 (G77).
- **VO + subs:** "ที่ช่วยป้องกันคนในรถถูกฟ้าผ่า"; C01b [29, 101).
- **Staging (R):** DRIVER `facing +x` (right front three-quarter, 65°→72° to her facing), seated H (−0.15, 0.40, 0.38); the closed front door glass between her and the lens with rain streaks (sheen ≤ 25 %, painted after her, DF-20261030-painted-glass-sheen-veil); door beltline at screen y ≈ 874 (hands near the face stay above it).
- **Camera (R):** `cam((−0.10, 1.05, 0.38), 25→18, 1.35→1.25, 1.12, 1100, 640)` over L0–71. Run: crown (504, 439) → (499, 423), face y 608 → 605, chin 772 → 783; hip→crown **779 → 843 px** (hip hidden by the door).
- **Look:** dash dark; her face lit by the cool sky key only; outside rain lit grey.
- **Sound:** A1 (S1's tail rolls away under the cut); **M1** fades in over 10 f from L0 (G29) at energy 1.5. Mix: release → hold.
- **Cut:** hard at L71 (G100), 3 f before L02.
- **Entry → exit:** jolt mid-rise → hands lowered, worried face, breathing.
- **Accept:** her face above y 800 the whole shot; no open window or gap in the glass; hands never touch the door frame; (R2, D-Q18) no body line crosses her face or chin through the glass (end tops painted before the interior, `bonnetBehind`).

### B01-SH03 · 100–223 · the whole closed car (L02)

- **Time:** crane over L0–123 (linear); sweeps (VD05), each one painted specular band `#f2f4f6` at ≤ 0.8 travelling 14 f then fading 6 f: **roof edge** (TF → TR along z +0.64, y 1.49) L53–67 (G153, 2 f before "หลังคา" G155; R2, D-Q5: the band starts across the windscreen header TF z −0.64 → +0.64, then turns down the drip rail, and is twice the width of the other two sweeps, so the top edge reads as a lid from this near-level lens; R3, D-FX1-Q2: the band enters at L53 with zero length and covers the header from L54, within ±3 f of G155), **body shoulder line** (nose → tail at y 0.92, z +0.85) L68–82 (G168; "ตัวถัง" G170), **side glass** (front door glass → rear door glass) L89–101 (G189; "ปิดกระจก" G191). Far fork flickers once at L20 (G120) on the horizon left.
- **VO + subs:** "ต้องเป็นรถปิดมิดชิด หลังคากับตัวถังโลหะ ปิดกระจกด้วย"; C02a [103, 153), C02b [155, 222).
- **Staging (R):** CAR21 whole; DRIVER `facing +x`, small through the glass, still, `worried`. No text labels.
- **Camera (R):** `cam((0.3, 0.75, 0), 34→40, 4.4→4.6, 0.9→2.3, 880, 900, pitch 0→−20)` over L0–123 (SD01). Run: start roof 764 → FR contact 1153 (**389 px**), x 95–1004; end roof 766 → contact 1133 (**367 px**), roof plane visible from above; her crown (421, 805) → (428, 767). **Exception** (car < 480): L02 needs the whole enclosure in one view (brief).
- **Look:** live tone, post-strike.
- **Sound:** A1; **S3** glint ticks at L53, L68, L89 (G153, G168, G189): three tiny soft glassy ticks, one per sweep, 0.15 s each, close and soft, "look here", NEEDS-GEN (brief S3); M1 energy 1.5. Mix: hold, ticks 10 dB under VO.
- **Cut:** hard at L123 (G223), 5 f before L03.
- **Entry → exit:** low oblique whole car → high oblique, roof read.
- **Accept:** every sweep lands on its named part within ±3 f of its word; the roof sweep reads as a bright line along the car's top edge on a 270 px QA tile at L56; the roof, the continuous body and all closed windows read; the FR contact stays above 1160; no sweep suggests a strike path.

### B01-SH04 · 223–315 · the shell around her (L03)

- **Time:** pull-back over L0–92; rain sheets down the windscreen on G; she sits still; on "รอบคุณ" (G290, L67) the roof lining and both A-pillars catch a faint cool sheen (+8 % value, L67–80), no glow.
- **VO + subs:** "ตัวที่ช่วยป้องกัน กลับเป็นเปลือกโลหะรอบคุณ"; C03 [228, 312).
- **Staging (R):** DRIVER `facing +x`, back view (seat back and headrest between her and the lens), hands on the thighs (hidden), `neutral`; dash and cluster dark, small (cluster (552, 873)), unremarked (CL21-03).
- **Camera (R):** `cam((0.3, 1.0, 0.3), −104→−106, 1.35→1.42, 1.08, 760, 820)`, near 0.12 (start = LF02; R2 SD14, end yaw was −100). Run (R1 at −100): crown (692, 584) → (660, 598); hip→crown **790 → 744 px**; radio (364, 922); end values at −106 to be re-measured by Boss. **Exception** (R2, D-Q7; R3, D-FX1-Q1): visible lead (crown → her seat-back top) 402–445 px < 480 (FX1 at −106: 445 → 402, L67 413, L91 402; hip→crown 790 → 731); the shell is the subject, as the approved LF02.
- **Look:** LF02 (approved r3), cabin tint 0.12 toward `#3a4656`.
- **Sound:** **A2** cabin from L0 (muffled roof drumming, water on glass, 3 f crossfade from A1), M1 continues. Mix: drop (the room closes in).
- **Cut:** hard at L92 (G315), 5 f before L04.
- **Entry → exit:** rear-seat view, still → slightly wider, shell framing her.
- **Accept:** lining, pillars and closed glass enclose her in the frame; her seat back reads as a seat; the band holds only the seat backs; (R2) at least half of her head's outline stays clear of the headrest on every frame.

### B02-SH05 · 315–408 · "wait…" (L04)

- **Time:** looks up at the roof lining on "เดี๋ยว" L5–15 (G320–330, head pitch up 15°, eyes up); glance to the door frame on "นำไฟฟ้า" L30–45 (G345–360, head turn 20° toward +z, eyes to (−0.10, 1.10, 0.80)); right elbow pulls in from the door panel on "แล้วมัน" L50–60 (G365–375); `suspicious` L5–50 → `worried` L50–93.
- **VO + subs:** "เดี๋ยว...โลหะนำไฟฟ้า แล้วมันจะช่วยได้ยังไง?"; C04a [320, 363), C04b [365, 404).
- **Staging (R):** DRIVER front view through the windscreen (rain streaks on the glass, painted after her); the wheel rim crosses her lower chest; cluster hood below her chin. R2 (SD15, D-Q6/D-Q9): dash front edge, hood and wheel 0.26 m lower for this lens only; the 20° head turn is a nod plus the eye look to the door frame.
- **Camera (R):** `cam((−0.15, 1.10, 0.38), 90→84, 1.6→1.45, 1.15, 1000, 620)` (lens over the bonnet, outside the glass). Run: crown (540, 482) → (540, 468), face y 614 → 613; hip→crown **607 → 669 px**.
- **Look:** cabin darker than pre-strike; the windscreen sheen ≤ 25 %.
- **Sound:** A1 (lens outside: rain on the windscreen and bonnet); **M1 fades out** over 8 f from L0; **S7** far thunder roll L8 (G323), library candidate `weather_thunder-roll-distant_01`, −20 dB under VO. Mix: drop → hold on the question.
- **Cut:** hard at L93 (G408), 5 f before L05.
- **Entry → exit:** neutral face, hands in the lap → elbow tucked, worried.
- **Accept:** each look lands within ±3 f of its word; no hand on the door or pillar; face above 700.

### B02-SH06 · 408–548 · the route around her (L05)

- **Time:** world tone live → `TONE_EXPLAIN` L0–6 (G408–414); chip fades in L6–12; coat (N6, LF03 design) top-down: roof and greenhouse frame ramp on "กระแสไฟ" L11–28 (G419–436); the front runs along the roof rails and the near shoulder line nose → tail on "ไหลไปตาม" L28–62 (G436–470); flank and ends fill on "เปลือกโลหะด้านนอก" L44–74 (G452–482, full coat at G482); greenhouse ridges around her window +20 % on "รอบคนข้างใน" L81–109 (G489–517), she stays unlit in full colour; flank gradient extends to the sill and the road pool grows 0 → full with its mirror on "แล้วลงดิน" L115–140 (G523–548).
- **VO + subs:** "เพราะกระแสไฟไหลไปตามเปลือกโลหะด้านนอก รอบคนข้างใน แล้วลงดิน"; C05a [413, 487), C05b [489, 550).
- **Staging (R):** CAR21 whole, DRIVER `facing +x` small, unlit; label chip N7 "ภาพอธิบายแบบง่าย" (**pending Q1**) top-left under the mark L6–140.
- **Camera (R):** `cam((0.4, 0.7, 0), 38→36, 4.3→4.1, 0.65, 880, 940)` (LF03). Run: roof 745 → contact 1126 (**381 px**) → 734 → 1138 (**404 px**), x 72–1020; her crown (405, 794) → (397, 786). **Exception** (whole car, brief).
- **Look:** LF03 r4b plus the prepared fixes for its known defects 1, 2 and 4: feathered wet clip for the mirror smear (no straight edge at z 2.4), verge puddles re-laid inside this lens's footprint (x 0.4–3.0, z 2.4–3.1) mirroring the storm sky, tufts at x 1.1–2.0 / 2.5–3.3, P1 moved (SD10). Defect 3: the lit flank keeps a red-orange hue (not beige).
- **Sound:** A3 (A1 low-passed, −8 dB) from L0; **M1 back** with the pulse at L2 (G410); **S4** route glow L11 (G419): a soft airy rising shimmer like a breath through fine wind chimes, warm, no electric buzz, travelling left → right, 2.5 s, curious and clear, NEEDS-GEN (brief S4). Mix: lift.
- **Cut:** hard at L140 (G548), 4 f before L06.
- **Entry → exit:** live storm → toned world, whole skin warm, pool under the car, chip on.
- **Accept:** no outline anywhere; no single line, no entry point on the roof, no four-tyre exit (one broad pool under the whole car); she is never lit; chip visible on every frame from L12; the coat stays clipped to the metal (no glass, no halo past the silhouette).

### B03-SH07 · 548–636 · relief, then the tyre (L06)

- **Time:** relieved breath L4–30 (shoulders drop 2 cm, eyes close L10–18, `relieved`); `neutral` from L44; camera descent on "ดูยางก่อน" with ease [0.53, 0.93] (L47–82; "ดู" G598 = L50). Sag 0 → 0.02 m L47–82 (the descent arrives on a slightly low tyre); scorch readable from L70.
- **VO + subs:** "แต่ถ้าคิดว่ารถไม่เป็นอะไร...ดูยางก่อน"; C06a [552, 596), C06b [598, 638).
- **Staging (R):** DRIVER right profile (84° to her facing) through the closed driver glass, live colour; FR wheel, arch and door bottom at the end.
- **Camera (R):** `camMove(at (−0.15, 1.0, 0.38) → (1.30, 0.40, 0.75), yaw 6→18, r 1.9→2.0, eye 1.15→0.60, f 1100, hy 620, ease [0.53, 0.93])` (SD05). Run: start face (540, 614), hip→crown **561 px**; end FR top 608 → bottom 966 at x 522 (tyre 358 px, centre (540, 780)), her face leaves at top-left (43, 400).
- **Look:** live tone; the scorch dark and matte `#3a2a22`, no glow.
- **Sound:** A1; M1 lighter (pulse thinned) from L0. Mix: release → hold.
- **Cut:** hard at L88 (G636), 4 f after L06 ends.
- **Entry → exit:** relieved face at the window → the FR tyre, slightly low, scorch just visible.
- **Accept:** the descent starts within ±3 f of "ดู"; the tyre is centred and above y 1000 at the end; no fire, smoke or shattered glass.

### B03-SH08 · 636–765 · the damaged tyre (L07)

- **Time:** GD1: L0–10 (G636–646) image and hiss only; sag 0.02 → 0.06 m over L0–100 (ease-out); steam wisp rising in the rain L0–129 (`#c9d0d6`, seeded; R2, D-Q22: peak 45 % L0–60, each wisp 1.5× wider and rising to 0.45 m, thinning to 20 % by L128, never joined into a column; R3, D-FX2-Q3 / FX3: each wisp is born clear of the tyre: spawn 0.06 m aft of the tyre's rear silhouette edge on the lens side and fade in from 0 over its first 0.12 m of rise, so no opaque blob sits on the tread or sidewall); split edge opens 1 cm L20–60. "เสียหาย" L44 (G680), "มันไม่ได้หยุด" L74 (G710).
- **VO + subs:** "ฟ้าผ่ายังทำให้ยางเสียหายได้ มันไม่ได้หยุดอยู่เหนือยางนะ"; C07a [646, 708), C07b [710, 759).
- **Staging (R):** FR tyre close: scorched split blister on the outer sidewall's lower-rear quadrant, the tread flattening onto the wet road, puddle r 0.6 m around it with rain rings; no person.
- **Camera (R):** `cam((1.30, 0.31, 0.85), 30→22, 1.2→1.05, 0.45, 1100, 700)` (SD06). Run: tyre top 544 → 522, contact 1112 → **1171**; tyre 568 → 649 px, centre x 540.
- **Look:** storm light; scorch matte, no glow.
- **Sound:** A1 (closer road splash); **S5** tyre L0 (G636): a slow thin air hiss from a split tyre, rubber settling with a soft creak onto wet asphalt, a faint steam tick in rain, small, close, dry, 2.5 s, "oh, it did get hurt", NEEDS-GEN (brief S5); M1 lighter. Mix: hit (small) → hold.
- **Cut:** hard at L129 (G765), 6 f before L08.
- **Entry → exit:** slightly low tyre → visibly flatter, steam thinning.
- **Accept:** the damage reads on L0–10 with no caption; the scorch and split stay above y 1160; no flame or smoke column. R3 (FX3): on the 270 px QA tiles L0–60 no wisp is drawn at more than 15 % opacity inside the tyre's outline below the arch lip; each wisp's brightest part sits outside the tyre silhouette (aft of it or above the arch lip), so the wisps read as rising vapour, not as lumps on the tyre.

### B04-SH09 · 765–822 · pressed, dead (L08)

- **Time:** left hand leaves the thigh L9 (G774), reaches L9–28, contact with the button L29 (G794), held to L39, returns L40–56; screen flicker 20 % L32–33 (G797–798) and L35 (G800), dead from L36 (G801; "ดับ" G802); `suspicious`, head turned down-left toward the radio L5–57.
- **VO + subs:** "งั้นทำไมไฟหน้าปัดถึงดับไปด้วย?"; C08 [771, 822).
- **Staging (R):** DRIVER `facing +x`, back three-quarter over her left shoulder (144° to her facing); torso leans 10° forward and 8° toward −z during the reach (est; Boss confirms the four-head arm reaches (0.519, 0.85, 0.08), N4); right hand stays on the right thigh. Cluster and radio dark.
- **Camera (R):** `cam((0.52, 0.92, 0.20), −102→−98, 1.34→1.24, 1.28, 700, 760, −14)` (SD03). Run: her face (843, 704) → (850, 727), hip→crown **794 → 917 px**; cluster (627, 744) → (636, 757), its right end (692–708) at her head's edge; radio (439, 798) → (431, 812), button (481, 810) → (476, 826).
- **Look:** cabin a shade darker than pre-strike; the flicker is the only light change.
- **Sound:** A2; **S6** radio press + cutout: a soft plastic button click L29 (G794), a tiny relay tick L32 (G797), a falling two-note blip dying mid-note L33–41 (G798–806), close and intimate, 0.6 s, eerie, NEEDS-GEN (brief S6; library candidate `electric_glitch-blip-soft_01` for the blip only if it dies cleanly); **M1 cut dead at L37 (G802)**, silence of music L37–57. Mix: drop → silence.
- **Cut:** hard at L57 (G822), 3 f before L09.
- **Entry → exit:** hands in the lap, dark dash → finger leaving the button, dead screen, music gone.
- **Accept:** the press contact on the button at L29 ±2 f; the dash and radio are not hidden by her head; no engine-start attempt. (R2, D-Q8: the lean is a screen-left card lean and the 4 mm button travel is under her hand; the flicker carries the press.)

### B04-SH10 · 822–930 · some gets in (L09)

- **Time:** cut straight into `TONE_EXPLAIN`, chip on at L0; coat recall top-down L0–10 to full, pool full by L18; cluster and radio drawn lit (diagram state, cyan 50 %) L0–60 (SD13); **inner branch** (≤ 25 % of the band, thin, dim) leaves the cowl at the windscreen base (1.05, 0.92, 0.80) on "บางส่วน" L30 (G852), runs inward along the dash top to the cluster wiring L30–51 ("เข้าไป" G873); cluster flicker L61–62, L67–68, dark from L69 ("ทำลาย" G881, "ระบบไฟ" G889); branch fades L78–102. Push with ease [0.25, 1.0] (L27–108). **R2 (SD16, D-Q13/D-Q14):** the branch core is the coat's hue at ≥ 0.7 of the outer coat's peak value, 4–6 px wide at the end lens (still at most a quarter of the coat's lit rim width), with a small arrival bloom (r ≈ 20 px) at the cluster L51–60; the diagram-state cluster and radio are cyan at 80 % (was 50 %) with a soft bloom r ≈ 30 px on the dash top and the inside of the glass base, and the flicker L61–68 switches that bloom. DRIVER stays unlit: no cyan on her face or body (a lit face would read as current reaching her).
- **VO + subs:** "เพราะกระแสไฟบางส่วนอาจเข้าไปทำลายระบบไฟของรถได้"; C09a [825, 869), C09b [871, 930).
- **Staging (R):** CAR21 sag 0.06 m; DRIVER `facing +x`, unlit, small, `neutral`; chip N7 (pending Q1).
- **Camera (R):** `camMove(at (0.4, 0.7, 0) → (0.45, 0.95, 0.30), yaw 36→28, r 4.1→2.3, eye 0.65→1.25, f 880, hy 940, ease [0.25, 1])` (SD02; R2 SD16: end yaw was 34). Boss fallback when yaw 28 fails the accept below: keep yaw 34 and move the end `at` toward +x by up to 0.15 m; pick by measurement. Run: start = SH06 end (car **404 px**); end cluster (545, 1052), radio (619, 1070), door beltline (546, 1112), her face (354, 971). **Exception** at the start (whole car, as SH06); the end subject is the dash.
- **Look:** SH06's explanatory look; the outer coat unchanged so only the branch is new.
- **Sound:** A3; **M1** sparse re-entry at L0; **S4** reprise L0 (G822), shorter 1.8 s; **S8** inner branch L30 (G852) (new cue above). Mix: lift → hold.
- **Cut:** hard at L108 (G930), 6 f before L10.
- **Entry → exit:** toned whole car with full coat → pushed in on the dash through the door glass, branch fading, cluster dark.
- **Accept:** the branch is visibly thinner and dimmer than the outer coat and the outer coat stays on (no "all current goes inside"); chip on every frame; dash above y 1160 at the end. R2: on 270 px QA tiles the branch is visible L30–78 and the cluster bloom visibly switches off at L69; the branch route (cowl → cluster) is ≥ 30 px clear of the A-pillar's inner edge over L51–78 and its nearest point ≥ 60 px from her head outline; R3 (D-FX2-Q1, replaces the two R2 visibility clauses): the branch reads L40–78 on a 3× zoom of the 270 px tiles (= 0.75 of the delivered size, the phone scale), the cyan bloom reads at L51/L60 and is gone from L69; the route may pass behind the A-pillar foot for ≤ 30 px provided it reads on both sides of the pillar and is clipped to the glass (never painted over the metal); the cluster face stays visible (≥ 9 px clear of the pillar over L51–78); head ≥ 60 px; she is never lit; caption band 1176–1344 passes.

### B05-SH11 · 930–1011 · damaged car, person inside (L10)

- **Time:** arc over L0–81; far sky flicker once at L30 (G960, no bolt); she sits still.
- **VO + subs:** "ช่วยป้องกันคน ไม่ได้แปลว่ารถจะไม่พัง"; C10 [936, 1011).
- **Staging (R):** CAR21 sagging on the flat FR (R2, SD17, D-Q19: **0.09 m for this lens only**, the tyre's flattening scaled with it), dash dark; DRIVER `facing +x`, a dim figure through the glass, `neutral`.
- **Camera (R):** `cam((0.2, 0.7, 0.2), 48→54, 4.6→4.5, 2.4, 1200, 720, −16→−18)` (SD07). Run: roof 643 → FR contact 1148 (**505 px**) → 606 → 1125 (**519 px**); nose near (895, 1154) → (825, 1154); her crown (449, 642).
- **Look:** live tone, a little warmer in the low sky band (+5 % toward `#b8a48a`).
- **Sound:** A1; M1 warmer (pad opens). Mix: hold.
- **Cut:** hard at L81 (G1011), inside the 4 f L10>L11 gap (GD2).
- **Entry → exit:** high oblique, sagging car → arc toward the nose, same state.
- **Accept:** the sag and the flat FR read (R2: on a 270 px QA tile the FR arch-to-tyre gap is visibly smaller than the FL's and the FR tyre's bottom is visibly wider than its top; R3, D-FX2-Q2: the FL is hidden from this lens, so the comparison is with the RR and the nose: the FR arch sits on the tyre top while the RR shows its arch line, the car leans visibly onto the nose and the FR bottom is wider than its top; a non-rigid RR gap is not required); she is visibly inside; nothing burns or smokes; FR contact above y 1160.

### B05-SH12 · 1011–1105 · no guarantee (L11)

- **Time:** push over L0–94; slow blink L40–46; gaze straight ahead out the windscreen; no smile at any frame.
- **VO + subs:** "แล้วก็ไม่ได้รับประกันว่าคนข้างในจะปลอดภัยทุกครั้ง"; C11a [1013, 1050), C11b [1052, 1102).
- **Staging (R):** DRIVER view `left` held (squareToCam), sober `neutral`, hands on the thighs (hidden); the streaming driver window behind her.
- **Camera (R):** `cam((−0.15, 1.10, 0.38), 180→175, 0.85→0.78, 1.12, 700, 700)` (lens in the passenger seat, SD08). Run: face (540, 667) → (540, 664); hip→crown **799 → 870 px**.
- **Look:** cabin dark; her face lit by the grey window behind. R2 (D-Q10): the lap shade is one smooth vertical gradient from y ≈ 1010 down (no stepped washes, no visible bands on the blouse), at least as dark in the caption band as the R1 plate.
- **Sound:** A2; M1 warm, low. Mix: hold.
- **Cut:** hard at L94 (G1105), 5 f before L12.
- **Entry → exit:** sober profile → slightly closer, same.
- **Accept:** profile without cupid's-bow lips (plain mouth); no grin; face above 900.

### B05-SH13 · 1105–1320 · the metal is the route (L12 + hold)

- **Time:** pull-back with ease [0.023, 0.58] (L5–125, over L12); glow echo on "ทางให้ไฟผ่านรอบตัวคุณ": `TONE_EXPLAIN` at 40 % L73–135 (G1178–1240, ramps out L129–135), chip L73–135, faint coat (SH06 coat at **0.5**, R2 D-Q15) runs once roof → sill L76–110 (G1181–1215) and fades by L130; hold L125–215. **R4 end strikes (D-U2, user request after Draft v1)**, live, after the echo and chip are fully gone (G1240): **E1** stepped leader L141–142 (G1246–1247), lands **L143–144 (G1248–1249)** on the near rear roof edge, 0.50 L145, 0.20 L146, off L147 (the `single` envelope); **E2** leader L159–160 (G1264–1265), lands **L161–162 (G1266–1267)** on the bonnet, gap L163 (0.30), restrike L164–165 (G1269–1270), 0.55 L166, 0.30 L167, 0.12 L168, off L169 (G1274) (the `double` envelope, same as B01-SH01). Kit `Flash`: 0.30 on E1 L143–144 → 0 by L148; 0.35 on E2 L161–162, 0.12 L163, 0.30 L164–165 → 0 by L170. Rain density 100 % to L166, then **100 % → 55 % L167–215 (G1272–1320)**; low horizon band lifts to `#b8a48a` **L167–215** (R3: both L95–215; the storm moves off after its last strike).
- **VO + subs:** "โลหะที่คุณกลัวว่านำไฟ...กลับเป็นทางให้ไฟผ่านรอบตัวคุณ"; C12a [1110, 1169), C12b [1171, 1236). No caption in the hold.
- **Staging (R):** close on the wet roof edge and A-pillar with rain sheeting over the metal; her face visible through the glass at left (317, 889); end the whole sagging car, DRIVER `facing +x` small, `neutral`, hands on the thighs. **R4 DRIVER in the hold:** flinch on E1 (shoulders up 3 cm, head back 1.5 cm L143–146, eased back by L155), `surprised` L143–158; flinch on E2 (same, L161–164, back by L181), `surprised` L161–178; `neutral` from L179 with one breath out (shoulders down 2 cm L179–191). She stays seated, hands on the thighs, never touches the door, never smiles. **E1 bolt:** contact **T1 = (−0.75, 1.49, +0.62)** est (car body coordinates, near rear roof edge above the rear door, the same edge the hook strike hit: a rhyme, not a claim), waypoints T1 → (−0.66, 1.95, 0.60) → (−0.84, 2.45, 0.55) → (−0.55, 2.95, 0.50) → (−0.66, 3.45, 0.40) → (−0.35, 4.00, 0.30) → (−0.45, 4.60, 0.20) → (−0.20, 5.40, 0.10) → cloud base; two branches (from waypoints 3 and 6, as SH01's first and third, shifted −0.05 m in x); projected at L143: T1 **(312, 628)**, channel (327, 518), (311, 413), (361, 280), (363, 179), (427, 27), crosses the frame top at x ≈ 430; her crown (447, 650), face (447, 702): T1 **≥ 135 px** from her crown. **E2 bolt:** contact **T2 = (1.60, 0.86, +0.55)** est on the bonnet top, lens side, mid-front (Boss snaps to the painted bonnet top at x 1.60), waypoints T2 → (1.70, 1.30, 0.55) → (1.55, 1.75, 0.50) → (1.85, 2.25, 0.45) → (1.75, 2.80, 0.40) → (2.05, 3.40, 0.30) → (1.95, 4.00, 0.20) → (2.30, 4.80, 0.10) → cloud base; three branches, all heading +x / up (none toward her: every branch pixel ≥ 250 px from her face); projected at L161: T2 **(823, 779)**, channel (858, 621), (817, 471), (931, 267), (904, 85), crosses the frame top at x ≈ 945; P1 palm (1004, 692) ≥ 150 px right of the channel. Both bolts and flares project through the sagged camera `cb` (car.ts `sagCam`) so the tips stay on the sagged body. **Car state on the strikes:** cold rim flash (`#f4f8ff` outline + wash 0.2, plus the struck roof edge or bonnet edge lit `#ffffff` 5 px within 120 px of the contact, fading by 300 px) on E1 L143–144, E2 L161–162 and L164–165 only; rain lit those frames; no warm light, no coat, no chip, no travelling light, no new damage, sag 0.06 m and FR damage as before, dash dark.
- **Bolt look (R4):** as B01-SH01 (`bolt.tsx` shared), E1 core **7 px**, body 18, halo 50; E2 core **8 px**, body 20, halo 56 (E2 is the nearer strike and the last word); contact flare core r 16 / glow r 70 px (E1) and r 18 / 80 px (E2); leaders as SH01.
- **Camera (R):** segment A `camMove(at (0.42, 1.40, 0.70) → (0.2, 0.7, 0.2), yaw 30→42, r 0.9→4.0, eye 1.5→0.9, pitch −8→−2, f 1000, hy 800, ease [0.023, 0.58])`; segment B L125–215 r 4.0 → 4.08 linear (2 % settle), the rest held (SD09); unchanged, no shake. Run: start roof edge (553, 670); end roof 597 → FR contact 1085 (**488 px**), x 103–1055 (far nose corner just past the right edge); P1 palm (1004, 692) in the sky right; frame top at the car's depth ≈ 4.2 m.
- **Look:** live → light explanatory (L73–135) → **live storm, struck twice (L141–169)** → live and warming (L167–215).
- **Sound:** A1 (closer rain on the roof at the start); M1 major colour at L5, pulse stops at L66 (G1171), **tail fades out L125–139 (G1230–1244)** (R3: gone by G1260); **S4** echo L76 (G1181), faint (−6 dB on SH06's); rain alone L139–143; **S9a** E1 crack L143 (G1248): the S1 file reused (`impact_lightning-strike-close_01`, file start G1244 so the crack lands G1248), peak 2 dB under S1's measured peak; **S9b** E2 crack L161 (G1266), NEEDS-GEN (see the [Ton brief](#user-request-revision-draft-v1-sheets-r4)); **END1** moved to **L167 (G1272)** (R3: G1230): one warm open felt-piano chord (major ninth) over the last rain and a far, receding thunder roll fading left, a soft high glass-like harmonic, relief and understanding (`stinger_storm-passing-piano-chord_01`, 3.35 s; 48 f audible before the end, `A_fade` G1296–1320 takes its ring); S9b tail ducked −6 dB from G1272 under END1; A1 eases −6 dB and low-passes **G1272–1320** (R3: G1200), fades under `A_fade` by L215. Mix: release → strike, strike → release.
- **Cut:** end of the video at L215 (G1320), `A_fade` (Editor).
- **Entry → exit:** close wet metal → whole car, labelled echo → struck twice more for real, she flinches and stays put → the storm moves off, warm horizon, silence of narration.
- **Accept:** the echo carries the chip and the coat is visible on a 270 px QA tile at L90 (fainter than SH06, clearly there); no caption after G1236; the car ≥ 460 px from L125 (R2, SD18); she never smiles at camera; the last frame shows the car with the storm moving off. **R4 end strikes:** chip opacity 0 and `TONE_EXPLAIN` 0 on every frame G1240–1320; on L143, L144, L161, L162, L164, L165 the B01-SH01 strike criteria (a)–(e), (h), (j) hold for the bolt landing (tips within 6 px of projected T1/T2, flare core on the painted edge), (f) with her face box (projected face ± 50 px), (g) nothing inside the `@TamMaiLa` box; `caption-zone.py` 1176:1344 pass on those frames; car state on G1290 equals G1240 (same `sag`, `frDamage` and dark-dash inputs in code; compared side by side on the QA sheet: no new mark, glow or break on the body); seek parity at G1244–1275.

## Boss, Ton and Editor handoff

**Boss shot groups** (AI01: one invocation per group, 3–5 shots; plates only from this sheet; each group hardens the W3 prototypes in `src/painted/edu21/` into the shots):

| Group | Shots | Assets / capability | Depends on |
| --- | --- | --- | --- |
| BG1 exterior and strike | B01-SH01, B01-SH02, B01-SH03 | CAR21 exterior (N1), SET-ROAD21 (N2) incl. SD10, bolt N5 (near + far), kit `Flash`, the three sweeps (VD05), DRIVER through glass (N3, N4) | — |
| BG2 cabin | B01-SH04, B02-SH05, B04-SH09, B05-SH12 | CAR21 cabin (N1), front view through the windscreen, radio button and the `new: radio reach` pose (N4), flicker | BG1's DRIVER/outfit |
| BG3 explanatory glow | B02-SH06, B04-SH10, B05-SH13 | route glow N6 (LF03 design + defect fixes), inner branch, chip N7 (Q1 text), tone ramps, rain easing, warm horizon, two-segment camera | BG1 car + set; Q1 for the final text only |
| BG4 consequences | B03-SH07, B03-SH08, B05-SH11 | FR damage variant + sag transform (SD12), steam wisp, descent camera | BG1 car + set |

**Ton cue groups** (W5.2s, in parallel with Boss; cue sheet `scripts/edu-series/ep21/sound-cues.json` against EDU-EP21-SHEETS-R1):

| Group | Cues (frame G) | Origin |
| --- | --- | --- |
| TG1 beds | A1 (0), A2 (223), M1 (29), END1 (1230 → **1272**, R4) | NEEDS-GEN ×4 |
| TG5 end strikes (R4) | S9a (1248, S1 file reused), S9b (1266) | S9b NEEDS-GEN; S9a reuse checked by ear |
| TG2 B01 events | S1 strike (12), S3 ticks (153, 168, 189), S7 far roll (323) | S1, S3 NEEDS-GEN; S7 library candidate `weather_thunder-roll-distant_01` |
| TG3 explanatory | S4 glow (419), S4 reprise (822), S8 inner branch (852), S4 echo (1181) | NEEDS-GEN (S4 once, three placements; S8) |
| TG4 consequences | S5 tyre (636), S6 press + cutout (794) | NEEDS-GEN; S6 blip library candidate `electric_glitch-blip-soft_01` |

Fifteen placements, ten sounds to make, two library candidates. **Editor:** narration placement and GD1 above; captions per the caption plan (check legibility over the warm pool in SH06/SH10, LF03 band luma fail 0.426/0.527); scene samples: SH01 (strike timing), SH06 (glow on the words), SH09 (press + cutout), SH13 (ending).

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Preaw/Boat → user | **Q1** label chip wording "ภาพอธิบายแบบง่าย" (SH06, SH10, SH13) | done (final, user 2026-11-17; Boss FX2 removed the placeholder comments, text and box unchanged) |
| Boss | N4 reach: the four-head arm reaches the button (0.519, 0.85, 0.08) with the 10° lean (SH09); fallback: move the button to the radio's right bezel (0.519, 0.86, +0.11) | done (BG2: 0.601 m to the button, arm 0.605 m; fallback not used) |
| Boss | LF03 defects 1, 2, 4 fixed at plate (SH06/SH10/SH13); defect 3 hue check | done (BG1, BG3; flank hue 12°, sat 0.53) |
| Boss | Sag transform keeps DRIVER, glass and cabin rigid with the body (SH10–SH13) | done (BG4 `sagCam`, max error 8.9e−16 m) |
| Boss | **R2 fix batches** FX1 (B01-SH02, B01-SH03, B01-SH04, B05-SH12) and FX2 (B04-SH10, B05-SH11, B05-SH13, B03-SH08), see the [decision log](#plate-review-decisions-w52-sheets-r2) | done (FX1, FX2 2026-11-17; open questions decided in the [R3 log](#fix-batch-decisions-w52f-sheets-r3)) |
| Boss | **R3 fix batch FX3**: B03-SH08 steam wisps born clear of the tyre (D-FX2-Q3) | done (Boss 2026-11-17, task W5.2f) |
| Boss | **R4 fix batch FX4**: `bolt.tsx` + B01-SH01 + B05-SH13 per the [R4 build brief](#user-request-revision-draft-v1-sheets-r4) | open |
| Ton | **R4**: S9b NEEDS-GEN, S9a reuse by ear, END1 → G1272, cue sheet rows | open |
| Editor | **R4**: END1 G1272, M1 tail G1230–1244, A1 easing G1272–1320, S9a/S9b placements; re-cut SH01 and SH13 after FX4 | open |
| Boat → coordinator | **R4 check F1/F2** (end strikes vs L11 and fact-check line 40; visible live attach vs "no exact roof entry") | open |
| Editor | the 10-frame room-tone fill at GD1; S1 ducking under "ใช่" (R2 D-S1 windows); M1 offsets and gain/EQ states (R2 D-M1); S8 whole 1.0 s (R2 D-S8) | open |
| Ton | every cue above; S7/S6 library candidates confirmed by ear or regenerated | open |

Element captures: the approved look frames only (store `projects/edu/EDU/ep21-c83-looks-r3-clean/` LF01/LF02, `projects/edu/EDU/ep21-c83-looks-r4/LF03.png`); no new captures this pass.

## Plate-review decisions (W5.2, SHEETS-R2)

Film, 2026-11-17, from Boss's BG1–BG4 questions in [build-notes](../build-notes.md#w52-boss-bg1-exterior-and-strike--2026-11-16) and the QA sheets `out/qa/edu21/bg{1,2,3,4}/final/sheet-*.png` (viewed) with Boss's measured numbers. Q1/Q11 (chip wording) stay with Preaw/Boat and the user; Q16 was closed by BG4. Accepted deviations change no plate.

| ID | Shot | Decision | Story reason | Fix (owner Boss) |
| --- | --- | --- | --- | --- |
| D-Q2 | B01-SH01 | accept | the strike, the closed hard-top and her face behind glass all read in 29 f; the clipped tail and nose are the approved LF01 framing | none; accept text amended |
| D-Q3 | exteriors | accept as built: verge puddles only in B02-SH06 and B04-SH10 | puddles belong to the explanatory "into the ground" shots; in SH01/SH03 a mirrored car in the caption band would add noise to the hook | none |
| D-Q4 | LF03 | accept | LF03 is the approved look reference, not a shipped frame; every SH06/SH10/SH13 plate passes the band | none (no LF03 re-render) |
| D-Q5 | B01-SH03 | change | "หลังคา" is the first part of the enclosure; at L53 the eye (≈1.5 m) is at roof height and the band barely reads | FX1: roof sweep across the windscreen header then down the drip rail, 2× width, value cap 0.8 unchanged, frames unchanged |
| D-Q6 | B02-SH05 | accept the −0.26 m dash cheat (SD15) | her face asking "wait" is the subject; the bonnet in frame says the lens is outside the shell | none |
| D-Q7 | B01-SH04 | change | "รอบคุณ" needs her inside the shell; from L60 the headrest sat on her head as a grey block | FX1: end yaw −100 → −106 (SD14); visible lead 414–445 px accepted as an exception |
| D-Q8 | B04-SH09 | accept | the reach to the button and the dying screen read; the flicker carries the press | none |
| D-Q9 | B02-SH05 | accept | the glance to the door frame reads by the eyes on the word; a head yaw needs a new kit capability | none |
| D-Q10 | B05-SH12 | change | L11 is the sober line; stepped bands on her blouse pull the eye from her face | FX1: lap shade as one smooth gradient from y ≈ 1010 down, band luma not lighter than R1 |
| D-Q12 | SH06, SH10, SH13 | accept all four (near-ground shade, flank/wheel shade, SH13 door-top shade L0–45, fresnel pool) | the glow is about the metal skin; the ground and the band are support and the captions must read | none |
| D-Q13 | B04-SH10 | change | CK21-09 ("some gets in") is the shot; on yaw 34 the branch and cluster sit behind the A-pillar and do not read | FX2: end yaw 34 → 28 (SD16), fallback `at` +x ≤ 0.15 m; branch ≥ 0.7 of coat value, 4–6 px, arrival bloom |
| D-Q14 | B04-SH10 | change | "ทำลายระบบไฟ" needs the dash to visibly die | FX2: diagram cluster/radio cyan 80 % with a bloom r ≈ 30 px on the dash and glass base; the flicker switches the bloom; DRIVER never lit |
| D-Q15 | B05-SH13 | change | the echo of "ทางให้ไฟผ่านรอบตัวคุณ" is the payoff; at 0.25 it is invisible while the chip shows | FX2: echo coat 0.25 → 0.5 |
| D-Q17 | B02-SH06 | accept | the slab under the whole car is the approved LF03 "one broad pool" and reads as "into the ground" | none |
| D-Q18 | B01-SH02 | change | a red line across her chin through the glass reads as a mark on her face in the reaction shot | FX1: `bonnetBehind` on SH02 (or the equivalent end-top order); BG1 regression on SH01/SH03 |
| D-Q19 | B05-SH11 | change | L10 "รถจะไม่พัง" needs the broken car; at 0.06 m the FR tyre read intact | FX2: sag 0.09 m for this lens only, flattening scaled (SD17) |
| D-Q20 | B05-SH13 | accept 476 → 464 px | the whole sagging car reads; a closer end would cut more of the nose | none; exception SD18 |
| D-Q21 | B03-SH07 | accept the scorch fade L62–72 | the fade happens while the tyre enters the frame, so it never reads as a change; the reveal is kept for SH08 | none |
| D-Q22 | B03-SH08 | change | the steam says the damage is fresh; at 30 % it does not read | FX2: peak 45 % L0–60, wisps 1.5× wider, rising to 0.45 m, thinning to 20 % by L128, no joined column |
| D-S1 | B01-SH01 | exception kept, window corrected: G12–18 dV ≥ 4, G18–60 dV ≥ 12 | the strike must startle once, but "ใช่" holds the hook's negation | Ton: fix the two S1 rows in `levels.checks`; Editor mixes; ear check may raise the first row to ≥ 8 |
| D-S8 | B04-SH10 | accept the 1.0 s file whole, G852–882 | its late peak lands as the branch reaches the dash; it ends before the flicker | Ton: `lengthSec` note; Editor: no trim |
| D-M1 | M1 | offsets = (G − 29)/30 s snapped to a bar, texture states as gain/EQ, "major colour" dropped | the bed should feel continuous under the rests; END1 carries the major resolution | Editor; no stem from Ton |

**Boss fix batches** (one invocation each, AI01):
- **FX1 (BG1/BG2 re-open, 4 shots):** B01-SH02 (D-Q18), B01-SH03 (D-Q5), B01-SH04 (D-Q7), B05-SH12 (D-Q10).
- **FX2 (BG3/BG4 re-open, 4 shots):** B04-SH10 (D-Q13, D-Q14), B05-SH11 (D-Q19), B05-SH13 (D-Q15), B03-SH08 (D-Q22).
- Each batch re-runs its shots' measure script, caption-zone 1176:1344, `EDU21-SEQ` seek parity and the F−1/F/F+1 cuts at the touched boundaries, and returns per-shot QA sheets.

## Fix-batch decisions (W5.2f, SHEETS-R3)

Film, 2026-11-17, from Boss's open questions in [build-notes W5.2f Boss FX1](../build-notes.md#w52f-boss-fx1--2026-11-17) and [FX2](../build-notes.md#w52f-boss-fx2--2026-11-17), judged on `out/qa/edu21/fx1/final/sheet-B01-SH03.png`, `sheet-B01-SH04.png`, `out/qa/edu21/fx2/final/sheet-B04-SH10.png`, `sheet-SH10-accept.png`, `sheet-B03-SH08.png`, `out/qa/edu21/fx2/sh10-tile-zoom3x.png`, `r4-sh11-tiles.png`, `r5-sh08.png` (all viewed) with Boss's measured numbers. The FX1/FX2 changes without a question (SH02 bonnet order, SH12 lap gradient, SH13 echo 0.5, SH10 cyan 80 % bloom, chip N7 final) stand as delivered.

| ID | Shot | Decision | Story reason | Fix (owner Boss) |
| --- | --- | --- | --- | --- |
| D-FX1-Q1 | B01-SH04 | accept 402–445 px (SD14 exception widened) | "รอบคุณ" needs the shell around her; on the sheet her head sits clear beside the headrest on every tile and lining, pillars and glass enclose her; 12 px less lead does not change the read | none; SD14 and the shot block amended |
| D-FX1-Q2 | B01-SH03 | accept: roof band visible from L54 | "หลังคา" is G155 (L55); the band lands L54–56, within ±3 f, and the white header edge reads on the L54–64 tiles | none; timing note in the shot block |
| D-FX2-Q1 | B04-SH10 | accept as built (yaw 28, branch clipped to the glass, ~25 px hidden by the A-pillar foot) | CK21-09 "some gets in" reads: on the 3× zoom (phone scale) the thin warm line runs from the windscreen base past the pillar to the cluster on both sides, the cyan cluster blooms and dies; the thinness is the meaning ("บางส่วน"). A metal pillar briefly hiding a line drawn inside the car is true to the geometry. Yaw 14 changes the approved end framing and still fails at L51; a windscreen view breaks the SH06 explanatory-family match | none; SH10 accept text replaced (the R2 ≥ 30 px pillar clause was based on Film's wrong pinhole estimate) |
| D-FX2-Q2 | B05-SH11 | accept (RR comparison, rigid roll) | L10 "รถจะไม่พัง" needs the broken car: on the tiles the FR tyre sits up in its arch and the nose leans down onto it; the damage itself was shown close in SH08, SH11 only has to carry it | none; SH11 accept text amended (FL hidden) |
| D-FX2-Q3 | B03-SH08 | change (FX3) | the steam is there to say "fresh damage"; on the sheet the wisps sit on the tyre's front edge as pale lumps, and a lump on a damaged tyre reads as a bulge, which muddles "flattened" | FX3: spawn each wisp 0.06 m aft of the tyre's rear silhouette edge on the lens side; alpha 0 at birth rising to its envelope over the first 0.12 m of rise; peak 45 %, rise 0.45 m, sway/drift, thinning to 20 % by L128 unchanged; accept: no wisp > 15 % opacity inside the tyre outline below the arch lip on L0–60 tiles, brightest part outside the silhouette |

**Boss fix batch FX3** (one invocation, AI01; 1 shot): B03-SH08 (D-FX2-Q3). Re-run `fx2-measure.ts` for SH08 (or a wisp-overlap probe: wisp alpha inside the tyre-outline mask, L0–60), caption-zone 1176:1344, `EDU21-SEQ` seek parity at G636, 646, 696, 764 and the F−1/F/F+1 cuts at G635–637 and G764–766; return `out/qa/edu21/fx3/final/sheet-B03-SH08.png` plus a 2× crop of the tyre at L0/15/30/45/60. No other shot changes.

## User-request revision (Draft v1, SHEETS-R4)

Film, 2026-11-17. The user's words after Draft v1 (coordinator relay): "เปิดคลิปด้วยรถโดนฟ้าผ่าได้ไหม ตอนนี้ไม่เห็นฟ้าผ่าเลย เอาแบบเห็นเป็นเส้นลงมาใส่รถเลย แบบเด่น ๆ เพื่อเป็น hook ตอนจบอาจจะโดนอีก 2 เส้น". Evidence of the defect: `out/samples/edu21/EDU-EP21-SHORT/draft-r1/B01-SH01_G0013.png` (viewed at 270 px): a faint streak at the top edge and a sky glow; the R3 build (BG1 deviation) put the tip at y 3.8 m, ~500 px above the roof, hid it in a 230 px pool and drew the kit `Flash` (top opacity 0.85) over the bolt. No narration, caption, G range or shot ID changes; VOICE-R2 and SCRIPT-R1 untouched.

| ID | Shot | Decision | Story reason |
| --- | --- | --- | --- |
| D-U1 | B01-SH01 | a bold bolt seen from the frame top to the car, landing on the near rear roof edge (T, behind her head, ≥ 145 px from her crown) on G12, dark gap G14, restrike G15–16; leader G10–11; `Flash` cut to 0.40 and drawn under the bolt; S1 stays on G12 | the hook is "this car was just struck"; the viewer has to see the line touch the car. The rear roof edge is the car's visible top edge through this tyre-height lens, keeps the strike off her face and the caption band, and leaves the front tyre (CL21-01) clear. A restrike in the same channel is how real flashes flicker and doubles the time the line is on screen (4 full frames, 8 lit) without stretching the shot |
| D-U2 | B05-SH13 | two live strikes in the hold, after the echo and chip are fully gone: E1 G1248 rear roof edge (rhymes with the hook), E2 G1266 bonnet (a different place, nearer the lens, with a restrike); she flinches and stays seated; then the storm moves off (rain and warm lift from G1272) and END1 answers at G1272 | the ending re-reads the hook: the same car is hit again and the shell carries it again. Landing them during L12 would put a live strike under the labelled echo and blur what is real and what is the diagram; after G1240 the picture is fully live. Two places (roof edge, bonnet) keep the picture from implying one fixed entry point |
| D-U3 | both | live strikes show only a 2-frame cold rim flash on the body; no warm glow, coat, chip or travelling light; no new damage | the labelled warm glow stays the one explanatory picture (truth limit 3); a live strike that lit a path along the body would be an unlabelled route graphic |
| D-U4 | sound | S1 unchanged at G12; S9a = the S1 file reused at G1248 (rhyme); S9b NEEDS-GEN at G1266; END1 G1230 → G1272; M1 tail out by G1244 | each crack sits on its landing frame; rain alone for 4 frames before E1 so the crack lands in a held breath; END1's warm chord and far roll become the answer to "struck again" |
| D-U5 | brief | truth limit 2 amended in BRIEF-R5 for the live strikes | the R1–R4 rule (contact hidden in bloom) is what made the bolt invisible; the script constraint binds the B02 route graphic |

**Fallback** (if FX4 cannot meet SH01 accept (c) or (f)): keep T and the timing, drop the branches and the restrike, keep the core/flare; the visible landing is the part that cannot be dropped. If Boat rules F1 a must-fix, the coordinator asks the user between (a) keeping the two end strikes as designed, or (b) a single end strike E2; Film's recommendation is (a).

**Script and fact flags for the coordinator** (no script edit; Boat to check):
- **F1 — L11 / ending scope.** L11 "แล้วก็ไม่ได้รับประกันว่าคนข้างในจะปลอดภัยทุกครั้ง", the script's Film constraint "Do not prove protection by an unharmed grin…" and fact-check line 40 ("No grin or undamaged occupant is offered as empirical proof"): two more strikes with her unharmed can read as a demonstration. Design mitigations: she flinches and stays sober, no smile, no caption or graphic, the sag and dead dash stay in frame, no claim is spoken over the strikes. No spoken line is contradicted.
- **F2 — visible attach point.** The script's "No … exact roof entry" (B02 route graphic) and fact-check line 41 ("exact roof entry/four-tire exit"): SH01 and E1 now show a live strike landing on the roof edge and E2 on the bonnet. Film reads the constraint as binding the explanatory route; the live strikes land at two different places and no route starts from them.
- **F3 — B05 sound intent.** The script's B05 handoff ("Warm resolved accent, no victory fanfare; space for channel ending sound and hold") now has two cracks before the warm accent. Not a line contradiction; recorded as a deviation.

### R4 build brief — Boss fix batch FX4 (one invocation, AI01; 2 shots + the module)

1. **`src/painted/edu21/bolt.tsx`** (owner module for N5): `BoltOpts` takes an explicit world path (`path: V3[]`, tip first) and `branches: V3[][]` (fork point + points), with seeded perpendicular jitter ≤ 0.05 m on 3 subdivisions per segment; the random walk stays only as the default when no path is given. Widths per call (`core: [atTip, atTop]`, `body`, `halo`, branch widths) with the SH01 defaults 8→6 / 20 / 56 and branches 3→1 / 8 / 24 px at 1080 px. Remove the tip pool that hides the contact; add `BoltFlare` (core disc r, glow r, four rays 30–50 px) on the projected tip. Envelopes as pure functions of `d = L − strike`: `single` = leader d −2 (path drawn to 45 % of its screen length from the top), d −1 (85 %), stroke 1, 1, 0.5, 0.2, 0; `double` = leader as `single`, then 1, 1, 0.30 (no core, branches 0), 1, 1 (branches 0.35), 0.55, 0.30, 0.12, 0 (flare 0 from d +6). Leader core `#c9d6ff` 3 px, opacity 0.5/0.6, no halo. A shared `paintStrikeRim(p, c, contactPx, level)`: car silhouette outline `#f4f8ff` 3.2 px + wash 0.2 and the struck top edge `#ffffff` 5 px, full within 120 px of the contact, 0 by 300 px (moves the SH01 inline rim here). The core must sit **above** the kit `Flash` in the final picture (overlay order Flash → bolt halo/body/core → flare); one projection owner (the shot's `YCam`; `cb` in SH13).
2. **`src/painted/edu21/shots/B01-SH01.tsx`**: the shot block above (T, waypoints, four branches, `double` envelope on STRIKE 12, `Flash` 0.40/0.15/0.30 → 0 by G21, rim and lit rain on G12–13 and G15–16); camera, driver track, far fork and frame 0 unchanged.
3. **`src/painted/edu21/shots/B05-SH13.tsx`**: the shot block above (E1 `single` at L143, E2 `double` at L161 through `cb`; flinch track; rain 100 % → 55 % and warm lift on L167–215; chip/tone untouched, already 0 after L135); camera unchanged.
4. **Measure and QA:** a `scripts/edu-series/ep21/short/fx4-measure.ts` (context-map entry in the same commit) that reports per frame: channel continuity (max gap), tip-to-T distance, core luma samples (share ≥ 0.95), sky luma 70 px either side, core and core+body widths at y 300/600, added luma inside the face box, bolt pixels inside the mark box, car body mean luma/hue vs frame 0 (SH01) or L140 (SH13); `caption-zone.py` 1176:1344 on G12, 13, 15, 16 and SH13 L143, 144, 161, 162, 164, 165; seek parity G10–21 and G1244–1275; F−1/F/F+1 at the SH01→SH02 cut G28–30. QA sheets `out/qa/edu21/fx4/final/sheet-B01-SH01.png` (G0, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 28) and `sheet-B05-SH13.png` (L125, 135, 141, 142, 143, 144, 147, 159, 161, 162, 163, 164, 165, 170, 190, 214), plus 2× crops of the contact at G12, L143 and L161, all viewed. **Pass numbers** are the SH01 accept (a)–(j) and the SH13 R4 accept; on the 540×960 draft the core reads 3–4 px and core+body 9–12 px.

### R4 Ton brief (one invocation; cue sheet `sound-cues.json` against SHEETS-R4)

- **S1** stays `impact_lightning-strike-close_01` at G12 (file start G8); listen that the crack lands with the picture; a second snap near +0.1 s would match the G15 restrike but is not required.
- **S9a** (new placement, no new file): the S1 file at G1248 (file start G1244), gain 2 dB under the S1 placement. Listen in the open hold: if it reads as an obvious copy of the opening, make a sibling take of S1 instead (same brief, new seed).
- **S9b** NEEDS-GEN, G1266: source a lightning bolt hitting a car's steel bonnet a few metres away; action an instant tearing crack with a second snap about 0.1 s later (the restrike), bright sizzle, a short sharp ring of struck sheet steel, a quick rolling tail thinning out by 1.2 s; material crisp bright top, a solid low thud under it, wet; space outdoors in heavy rain, close, slightly wide; length 1.2 s, crack within the first 0.1 s; feel "again, and the car takes it", the same family as S1, a touch brighter and closer, no horror boom. Peak 1 dB under S1.
- **END1** moves G1230 → **G1272**; check that the chord is audible within 0.15 s of the file start (trim the head if not); S9b tail −6 dB from G1272. **M1** tail fades out G1230–1244. **A1** eases −6 dB and low-passes G1272–1320.
- `levels.checks` rows for the hold: S9a and S9b peaks ≤ the S1 peak; END1 ≥ 6 dB over the rain G1275–1295. Placements become 17 (15 + S9a + S9b).

## Change log

- 2026-11-16 **EDU-EP21-SHEETS-R1** (Film W5.1): first timed sheets from VOICE-R2 (user-approved), BRIEF-R4 and ROWS-R4. 13 shots on 1320 frames (44.00 s); one timeline gap GD1 (+10 f after L06); GD2/GD3 keep the read. Q4 applied: SH03 and SH10 in the oblique front-three-quarter family (SD01, SD02). Projection run on every world-space shot (SD03–SD11 camera and set changes, SD12–SD13 damage and diagram states). Sound: frames for every cue, new S7 and S8, S2 omitted. Rows EDU-EP21-ROWS-R5 timed.
- 2026-11-17 **EDU-EP21-SHEETS-R2** (Film W5.2 plate review): decisions on Boss BG1–BG4 questions Q2–Q22 (Q1/Q11 chip wording excluded, Q16 closed) and sound S1/S8/M1 in the [decision log](#plate-review-decisions-w52-sheets-r2). Sheet text changes: SH04 end yaw −106 (SD14), SH05 cheat recorded (SD15), SH10 end yaw 28 and branch/cluster read (SD16), SH11 sag 0.09 m lens-only (SD17), SH13 echo 0.5 and lead ≥ 460 (SD18), SH03 roof sweep, SH08 steam, SH12 lap gradient, SH01/SH02/SH09 accept text, S1 level windows, S8 whole file, M1 offsets and gain/EQ states. No voice retime; shot IDs and G ranges unchanged. Rows EDU-EP21-ROWS-R6.
- 2026-11-17 **EDU-EP21-SHEETS-R3** (Film W5.2f): decisions on Boss FX1/FX2 open questions in the [fix-batch decision log](#fix-batch-decisions-w52f-sheets-r3). Accept FX1-Q1 (SH04 lead 402–445, SD14), FX1-Q2 (SH03 roof band L54), FX2-Q1 (SH10 as built; accept clause replaced, SD16 note), FX2-Q2 (SH11 RR comparison; accept amended, SD17 note); change FX2-Q3 (SH08 wisps born clear of the tyre, Boss batch FX3, 1 shot). Q1 chip wording closed (user). No voice retime, IDs and G ranges unchanged; review rows stay EDU-EP21-ROWS-R6 (no seen text changed).
- 2026-11-17 **EDU-EP21-SHEETS-R4** (Film, user request after Draft v1): B01-SH01 strike redesigned so a bold bolt is seen landing on the car's near rear roof edge (leader G10–11, strokes G12–13 and G15–16, `Flash` 0.40 under the bolt; S1 unchanged at G12; SD19); B05-SH13 hold gains two live strikes E1 G1248 (rear roof edge) and E2 G1266 (bonnet), driver flinch, rain/warm easing and END1 moved to G1272, M1 tail out by G1244, A1 easing G1272 (SD20); new S9a (S1 reuse) and S9b (NEEDS-GEN); Boss FX4, Ton TG5, Boat flags F1–F3 in the [R4 decisions](#user-request-revision-draft-v1-sheets-r4). Brief → BRIEF-R5 (truth limit 2), rows → ROWS-R7 (B01-SH01, B05-SH13 text). No voice retime; IDs, G ranges, narration and captions unchanged.
