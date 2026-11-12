# EDU-EP18-SHORT — plate review fix list (W5.2 → W5.3)

Film plate review, 2026-11-12, fresh pass after Boss W5.2 (plates commit 4e49b73) and Ton W5.2s (cue sheet commit caa6b5b). One fix list, one pass per owner ([AI12](../../../docs/delivery-workflow.md#ai12)). Sheet: [storyboard.md](storyboard.md) **EDU-EP18-ROWS-R2.1** (this pass; every number below is also in the sheet). Brief: [film-brief.md](film-brief.md) BRIEF-R1.4 (unchanged).

Evidence: 76 stills rendered by Film on one Chrome (`node scripts/stills.mjs src/painted/edu18/shots-index.ts`, 37 s), 2–7 frames per shot including SH14 +65/+85/+107, SH16 +12/+18/+25 and SH17 +52/+75/+84/+87; viewed as `scripts/qa-sheet.sh` sheets at 270 px plus three 540 px / full-size crops. Store: `projects/edu/EDU/previews/filmsheet-b01a.png` … `filmsheet-b05d.png`, `f-sh14.png`, `crops-sh21-sh19-sh20.png` (frames themselves: `out/edu18/film/<beat-shot>-<frame>.png`, cache). Projections: `scripts/shot-projection.py` (pinhole, f 1000 ⇒ vfov 87.7°, f 1300 ⇒ 72.9°), this pass. Not measured: `scripts/caption-zone.py` (the plates carry no captions yet). Readiness is not user approval, runtime or visual proof.

## Per-shot verdict

| # | Shot | Verdict | Owner | What the plate shows / what is wrong |
| --- | --- | --- | --- | --- |
| 1 | B01-SH01 | **fix** | Boss | Her leg and skirt fill the frame (camera 0.65 m from her); the mosquito is a small dark mark on her skirt; no sense of a run. New camera, mosquito anchor and run path (F-B01) |
| 2 | B01-SH02 | pass (fix speed) | Boss | Reads: runs, tote over head, puff on "ยุง". Entry speed to match SH01 (F-B02) |
| 3 | B01-SH03 | pass (minor) | Boss | Drop size and place match the sheet (bun ≈ 460 px, centre ≈ (568, 690)). She reads as standing on the far-ground band: dangle her feet, soften the band (F-B03) |
| 4 | B01-SH04 | pass | — | Contact +17, carried out by +31, back whole at +53 (A04 reads). Sheet's +0 drop numbers were wrong, the plate is right (D-04) |
| 5 | B01-SH05 | **fix** | Boss | Woman about 1100 px with arms down; the drop sits on her chest; no low angle read. Kit card scaled from the feet depth under a 60° pitch (F-B05) |
| 6 | B01-SH06 | **fix** | Boss | Mosquito's legs hang below the pan and run off the right edge, so it dwarfs her; D1 band too deep (to y ≈ 480) (F-B06) |
| 7 | B02-SH01 | **fix** | Boss | No P45 (arms down); the drop passes 120 px over her head; at +34 the drop and the mosquito are gone, she stands alone (F-B07) |
| 8 | B02-SH02 | pass | — | Both pressed under the face, her ≈ 560 px, the mosquito ≈ 680 px, faces above 1160 |
| 9 | B02-SH03 | pass (motion not verified) | Editor (draft check) | Wide falling drop, passengers small. Upward streaming not judgeable from stills; check in the draft cut |
| 10 | B02-SH04 | **fix** | Boss | Ball ≈ 100 px and feather a white sliver ≈ 120 px in an empty brown frame: the insert does not read on a phone (F-B10) |
| 11 | B02-SH05 | **fix** | Boss | The mosquito card lies flat across her body and hides her (F-B11) |
| 12 | B03-SH01 | **fix** | Boss | +50/+90 show only a green diagonal: no rim, no passengers, no puddle detail. The sheet's own look-at gave an 88° pitch: Film's error, new camera (F-B12) |
| 13 | B03-SH02 | pass | — | Close on her face from below, head ≈ 390 px, hair fanned |
| 14 | B04-SH01 | **fix** | Boss | Freeze works (+65 = +85 = +107). Ruler bar missing at +0/+40 (ticks float alone); tick 20 at the right edge (≈ x 1040); OT03 clipped by the frame edge (F-B14) |
| 15 | B04-SH02 | **fix** | Boss | No visible water (flat grey), so "the puddle rushes up" does not read; the side-view mosquito under a 58° look-down reads flat (F-B15) |
| 16 | B05-SH01 | pass | — | Frozen SH04 +31, rewind (+18 drop rising), contact +25, close ride (body ≈ 960 px) |
| 17 | B05-SH02 | **fix** | Boss | Mosquito flips facing between +0 and +12; after +52 no drop, no mosquito and no splash in frame (the sheet's level camera cannot see a puddle 64 sm below: Film's error) (F-B17) |
| 18 | B05-SH03 | pass (minor) | Boss | Full size, panting, tote, 740 px. Arms down instead of P09 hands on hips (F-B18) |
| 19 | B05-SH04 | **fix** | Boss | Mosquito sits on the dark flip-flop: unreadable; no drip curtain falling around it (F-B19) |
| 20 | B05-SH05 | **fix** | Boss | Mosquito ≈ 20 px; the puddle is a flat olive shape that does not read as water (F-B20) |
| 21 | B05-SH06 | **fix** | Boss | Both hands land on the step beside her feet (no ankle slap); the mosquito is a 5 px dot (F-B21) |

Totals: 7 pass (2 with a minor), 14 fix; every fix is Boss's. Editor: staging notes below, no plate fix.

## Decisions on Boss's and Ton's open items (Film, 2026-11-12)

| ID | Item | Decision | Reason |
| --- | --- | --- | --- |
| D-17 | SH17 landing speed (world forces ≈ 106 sm/s at +87, brief "about 50") | **Accept** Boss's `sh17Fall` (ramp 0.16 → 3.5 sm/f over +52–+87, lands on +87). The sheet's "about 50 sm/s" is replaced | The distance is fixed by the world (contact 22 cm above the puddle; SH19–SH21 use the same set). 106 sm/s is still 1/34 of real speed, so it reads as slow motion ending. A higher contact or longer shot would move the L12 pegs or the set. The new camera (F-B17) sees the fall from above, where 3.5 sm/f at 40–60 sm is a readable 70–110 px per frame |
| D-01 | SH01/SH02 run speed and heel marks | She runs at **1.5 m/s (0.05 m/f)**, footfalls every 10 f; SH01 heel path (1.80, 0, 2.60) → (1.52, 0, 1.15), heel marks at +4 (1.80, 0, 2.40), +14 (1.62, 0, 1.90), +24 (1.62, 0, 1.40), each with a splash crown; SH02 decelerates from 0.05 m/f to rest over +0–+8 (ease-out), (1.47, 0, 1.12) → (1.25, 0, 0.95) | R2.0 had 0.18 m in 30 f (0.18 m/s, a crawl). Toward the awning (−z) keeps her moving screen right → left in both SH01 and SH02 (R2.0 flipped direction across the cut) |
| D-D1 | D1 fall coordinates | One D1 track, below. Pre-contact SH03 5.6 → 3.3, SH05 3.30 → 3.18; SH07 enters at 6.595 falling 0.30 sm/f (contact 2.095 at +15) — a recorded cheat across the SH06 diagram cutaway; after contact a monotonic ride `s` that never passes 32.4 sm (R02) | A05 needs 0.30 sm/f through the hit, H2 pins contact at +15, and R02 caps the ride at 20 units. Boss's per-shot `D1_Y0` put SH12 above the contact and SH11/SH13 past 32.4 sm |
| D-04 | SH04 woman y | **Accept** Boss's `W_M` feet (−0.75, −0.80, 0) (head top 0.82): her centre is the sheet's (−0.75, 0, 0) | Same staging; the sheet now says feet |
| D-10 | Feather x offset | **Accept** `FEATHER_X` 0.0317 m (the ball's front at +23) | The feather must hang where the ball's front reaches it; 3 cm is invisible at the insert scale |
| D-06 | New balance (no EP17 asset) | **Accept** Boss's N9 brass balance as the episode asset (`new: balance`, kit intake at W8.4), with the F-B06 layout fixes | No EP17 asset exists; the story needs a plain equal-arms balance, which N9 is |
| D-50 | 50 px mosquito legibility at SH16/SH17 ends | No 50 px frame remains: SH16 ends at ≈ 960 px; in SH17 the mosquito is ≥ 300 px until it leaves the frame top right (by +66). **Rule:** in `M`/`Dl` the mosquito body is ≥ 90 px whenever it is in frame and is the subject; 40–50 px stays only in the `H` shots SH01, SH19, SH20 (approved 2026-11-11 at LF00); SH21 is the recorded exception (Q1) | The approved small size is for full-size inserts only |
| D-S5 | Ton S5 slide-off 0.28 s vs 0.6 s | **Swap: regenerate** to the cue's description at 0.6 s (shlip 0–0.15 s, then the light air swish to 0.6 s, done by +52) | The slide spans +34–+52 (18 f); a 0.28 s file leaves the roll silent after +42 |
| D-SL | Ton SL slap 0.2 s vs 0.3 s; missing flip-flop scuff | **Accept** SL as is; **drop the scuff** from the cue (sheet, cue sheet description and Thai row updated) | 0.3 s included the 3 f scuff pre-roll; the slap itself is short. The bend is slow (+0–+14) with no step, so a scuff has no picture; it would also blur the slap transient |
| D-T1 | Ton's B04-T1 split into T1, T1-b, T1-c, T1-d (four variations cycling over the 12 marks) + T1-20 | **Accept** | All 12 sheet frames are covered (+0 … +59) and four takes avoid a machine-gun repeat |

### D1 track (supersedes R2.0 per-shot values; `M` sm, centre y; `s` = sm below the contact centre 2.095)

| Shot | D1 centre y over the shot | Notes |
| --- | --- | --- |
| SH03 | 5.6 → 3.3 linear over +0–+85 | as R2.0 |
| SH05 | 3.30 → 3.18 linear over +0–+25 (x −0.15, not her x −0.75) | bottom face 1.1 sm over her palms |
| SH07 | 6.595 − 0.30·L (contact with palms 1.22 at +15) | recorded cheat across SH06: the drop enters from the frame top at ≈ +6 |
| SH08 | s 6.0, centre −3.905, fixed | the far-drop layer scrolls up at 0.30 sm/f (ambient), independent of s |
| SH09 | s 7.0, centre −4.905, fixed | same scroll |
| SH11 | s 8.0, centre −5.905, fixed | same scroll |
| SH12 | s 9.0 + 0.03·L (to 12.2 at +106) | the one shot that shows the ground: puddle ≈ 79 sm below the lens at +75 |
| SH13 | s 12.5, centre −10.405, fixed | same scroll |
| SH14 | s 12.96 + 0.30·min(L, 65) (tick 8 at +0 → tick 20 = s 32.4 at +65) | ruler; freeze from +65 |

## Fix list — Boss (one pass)

Fix in the owning modules (`src/painted/edu18/*`, kit only where named). After the pass: stills of every touched shot at start / key / end through `scripts/stills.mjs`, one `qa-sheet.sh` sheet viewed, numbers below checked by `camPoint`, then hand to Editor.

- **F-B01 SH01** camera `pos (0.85, 0.16, 0.36) → (0.87, 0.165, 0.38), look-at (2.00, 0.40, 1.30) fixed, f 1000, near 0.02`; mosquito `hover`, `left`, at **(0.923, 0.195, 0.398)** (0.085 m from the lens): +0 screen (343, 705), body ≈ 47 px, against the rain-lit lane, not over her. Her run per D-01: +0 heel (1080, 1199), full figure 706 px at the frame right; +24 footfall (802, 1255); +29 heel (731, 1287), figure 1360 px (head leaves the top). Replace `runAt` for SH01; LF00 `look.tsx` HEEL/KNEE/HIP stand-in is not used by the plate.
- **F-B02 SH02** `runAt`: (1.47, 0, 1.12) → (1.25, 0, 0.95) over +0–+8 with ease-out (speed 0.05 m/f → 0), not smoothstep.
- **F-B03 SH03** (minor) hanging read: toes pointed down, feet apart and off any line; the far-ground band soft (blur or haze) and lower than her feet, so she floats.
- **F-B05 SH05** (1) Kit card under a steep pitch: for `|pitch| > 25°` fit the figure card to the projected feet → head span (not the feet-depth `camUnit`), so she is **501 px** (feet (540, 1474), head (540, 973)); this is the root of "woman tiny/huge" and likely SH15's flat mosquito: fix in `woman.ts`/`paintMosquito` (or the kit helper, recorded). (2) P45 hands up, palms at (540, 915). (3) D1 at x −0.15: bottom face (679, 786), bun x 391–979 (593 px), top (642, 689). Mosquito (0.45, 0.05, 0) at the right edge (≈ 1069, 1076).
- **F-B06 SH06** beam **600 px** (pans at x 240 and 840, 240 px wide, 300 px below the beam ends), pivot (540, 640); both figures **260 px** (her height; the mosquito's body length), the mosquito `left` (facing her), legs bent standing with all six tips on the pan surface, leg span ≤ 300 px, nothing past x 1000; D1 soft band only y 0–260.
- **F-B07 SH07** P45 hands up (palms y 1.22); D1 per the track (6.595 − 0.30·L); after contact the camera falls with D1: for L > 15 `pos y = 0.62 − 0.30·(L − 15)`, `look-at y = 0.90 − 0.30·(L − 15)` (cut-on-action into SH08); at +34 both pressed under the face, in frame. Mosquito pressed from +18 and carried (no vanish).
- **F-B10 SH10** camera `pos (0, 0.05, 0.30) → (0.18, 0.05, 0.30), look-at (0, 0, 0) → (0.18, 0, 0)`: ball 6.5 cm ≈ **217 px**, feather 6 cm ≈ 200 px; ball enters frame left ≈ +8, meets the feather at +23 (screen ≈ x 340), exits at ≈ (700, 960) at +45. Feather with a readable quill and vane (soft barbs), not a sliver; out-of-focus drip curtain streaks in the background.
- **F-B11 SH11** place and orient both by projected anchors, not a flat card: her head (415, 1085) → feet (899, 950); mosquito head (209, 988) → tail (780, 759) at +0 (Dl her z −0.42, mosquito z +0.40, as SH08); draw her over the mosquito's legs where they cross her face.
- **F-B12 SH12** camera (Dl of D1, s per the track): hold +0–+20 `pos (1.90, -0.60, 1.40), look-at (0, -1.0, 0)`; **+20–+75 swing to `pos (2.20, 0.30, 1.70), look-at (1.41, -0.89, 1.09)` (pitch −50°)**, hold to +106. At +75: drop rim (557, 515), bottom face (540, 449), her head (492, 367) → feet (864, 560) (419 px, recorded exception: the ground is the subject), mosquito (503, 598), far ground at y ≈ 1200, the lake from y ≈ 650 to the bottom (straight below at (540, 1798)). The lake must read as water: the warm shop reflection streak, ripple rings, the step edge and a crate corner at the far edge, slow drops falling toward it, smaller with distance.
- **F-B14 SH14** ruler bar drawn continuous through every tick in frame at every frame (+0 included); the ruler passes ≈ (887, 920) at the face height as R2.0 (Dl x 2.15), not at the frame edge; OT03 inside x ≤ 1020 (to the left of tick 20 if needed), leader 1 px.
- **F-B15 SH15** camera `+0–+50 pos (1.6, 0.4, 4.4), look-at (0, -2.4, 0)` (pitch 31°); from +50 falls with D2: `pos (1.6, 0.4 − s, 4.4), look-at (0, -2.4 − s − 1.2·smoothstep((n − 50)/63), 0)` (pitch 31° → 40°). Computed: +0 mosquito head (379, 679) → tail (719, 715) (342 px), far water from y 1116; +97 (s 14.23) mosquito lowest (540, 628), the water under it y 1358; **+113 (s 19.075) mosquito head (369, 487), lowest point (540, 585), water directly under it (540, 863)**: a 278 px clear band, water from y ≈ 300 to the bottom. Water drawn visibly (cold reflection, far-drop ripple rings, the D2 reflection growing as it nears; no ring under the mosquito, B-P3). No stray slow drop directly under the mosquito at +0.
- **F-B17 SH17** keep `view: 'left'` from +0 to +54 (no facing flip; the roll is about its right legs). Camera +0–+52 as R2.0; **+52–+70 holds its `M` position (≈ (3.05, −22.4, 2.2)) and tilts down to pitch −80° toward the landing azimuth: look-at = pos + (−0.476, −5.671, −0.879)**, hold to +87. The mosquito flies up-right and leaves the frame top right by ≈ +66 (≥ 300 px while in frame). D0 falls by `sh17Fall` (D-17) and **splashes at (540, 1132) on +87, crown ≈ 124 px** (edge y 1162, clear of the caption band), empty.
- **F-B18 SH18** (minor) P09 hands on hips with `idle-breathe` ×1.8.
- **F-B19 SH19** mosquito anchor **(0.666, 0.206, 0.053)** for SH19–SH21 (≥ 0.198 m above the lane water); camera `pos (0.71, 0.19, 0.13) → (0.74, 0.19, 0.12), look-at (0.55, 0.26, -0.14) → (0.57, 0.26, -0.14), f 1000, near 0.02`: mosquito (560, 1000), 0.09 m, body ≈ 44 px, seen against the lit shop between her calves (ankles ≈ (370, 1216) and (738, 1223)); drip-curtain streams and drops falling past and around it (one stream 2 cm to its left), the lane splashes below.
- **F-B20 SH20** camera `+0 = SH19 end → +50 pos (0.70, 0.25, 0.13), look-at (0.6595, 0.1017, 0.0383)` (pitch 56°), eased +5–+50, hold to +80: mosquito (540, 421), 0.095 m (body ≈ 42 px; move the end ≤ 0.01 m closer if it measures under 44), the step edge (620, 821), her toe (402, 678), water under the mosquito (540, 1226), the water filling y ≈ 830–1920. The puddle as water: rings and crowns where the curtain lands, the warm reflection streak broken by ripples, the cool lamp glints.
- **F-B21 SH21** `slap-ankle`: right palm centre on the left ankle point (0.58, 0.18, −0.12) = screen **(526, 1081)** at +18 (±0.02 m), left hand on her left knee, knees bent with the 35° hip bend; one hand slaps, not both on the step. Mosquito path: (0.666, 0.206, 0.053) (548, 1094) → dodge to (0.726, 0.266, 0.093) (570, 1076) over +12–+22 → back to (0.68, 0.20, 0.07) (552, 1099) over +40–+72, hover to +129. Locator (Q1 default): a soft white wing glint on the mosquito, ≤ 14 px, 4 f each at +23, +46, +74, +100; her gaze on it from +30.

## Fix list — Editor (no plate fix; staging and sound placement at the W5.3 draft)

- SH09: check the upward streaming at 0.30 sm/f in the draft (stills cannot show it).
- SH17: S5 is a new file at 0.6 s (Ton); place at +34 [f1129]. P1 splash on the SH18 cut as before; the splash is now also seen (crown at +87).
- SH21: SL at +18 [f1356] with **no scuff pre-roll**; V03 optional as before.
- Owed from Ton's handoff unchanged (loop seams W1/A2, K1 pan, S3 trim, offsets, F1 low shelf).
- Caption check (`scripts/caption-zone.py`) once captions exist: SH01 heels sit in the band (feet are not hero details), SH17 crown edge 1162, SH19/SH21 mosquito ≥ 14 px above 1160.

## Fix list — Ton (one pass)

- **S5** regenerate to its cue description at 0.6 s (D-S5); keep the cue ID `B05-S5`, update `sound-cues.json` id/length.
- **SL**: no change; the cue's description no longer asks for a scuff (sheet R2.1).

## Fix list — Film (next job)

LF01–LF06 look frames, thumbnails first ([look thumbnails](../../../docs/sequence-workflow.md#look-thumbnails)), painted on Boss's fixed plates in draft mode after F-B pass, so the frames are the shots:

| Location | Look frame (sheet peg) | Thumbnail variants (2–3, flat washes) | Depends on |
| --- | --- | --- | --- |
| Soi, full size | LF01 SH02 +6; LF06 SH19 +24 | A warm shop glow strong / lane cool; B even grey rain light with the lamp as key; C dusk, shutter glow only | F-B01, F-B19 |
| Macro, drop above | LF02 SH03 +78 | A shop bokeh warm behind the drop; B cool sky key, warm only inside the drop; C darker, rim-lit drop | F-B03 |
| Macro, underside | LF03 SH08 +28; LF05 SH17 +32 | A water ceiling bright, figures silhouetted; B figures front-lit through the water (warm) | F-B11, F-B17 |
| Look-down | LF04 SH12 +90 | A lake with a strong warm reflection streak; B cool lake, rings only; C ground and step dominant | F-B12 |

Then the viewer check (fresh Sonnet critic) on the thumbnail sheets, the coordinator asks the user to pick, Film paints the finished LFs and adds `looks`/`look` to review-rows.json. LF00 (mosquito) is approved and not repainted.

## Pass 2

Film plate review of Boss's W5.3 pass (commit 5425b5b) and the kit skirt fix (5bea119), 2026-11-12, fresh invocation. Sheet **EDU-EP18-ROWS-R2.2** (this pass: SH07 layer cheat, SH12 riders through the water, SH15 mirrored reflection; [change log](#change-log)).

Evidence: 67 stills re-rendered by Film from the current checkout on one Chrome (`node scripts/stills.mjs src/painted/edu18/shots-index.ts`, 35 s; Boss's `out/edu18/fix/` frames predate 5bea119 and the SH15 softening, so they were not used), 2–5 frames per shot, viewed as six `scripts/qa-sheet.sh` sheets at 270 px and four at 540 px. Store: `projects/edu/EDU/previews/film2sheet-a.png` … `film2sheet-j.png` (frames: `out/edu18/film2/<beat-shot>-<frame>.png`, cache). Pixel values read off the 540 px sheets are ±20 px. SH15 reflection points computed with `scripts/shot-projection.py` (f 1000 ⇒ vfov 87.7°), this pass. Not checked: motion (SH09 streaming, SH14 freeze, SH16 rewind, SH17 roll and fall) and `scripts/caption-zone.py` (no captions yet): Editor at the W5.3 draft. Readiness is not user approval, runtime or visual proof.

### Per-shot verdict (pass 2)

| # | Shot | Verdict | What the frames show |
| --- | --- | --- | --- |
| 1 | B01-SH01 | pass (minor F2-B01) | Mosquito (≈ 340, 720) against the grey lane, ≥ 47 px; her run right → left, heel marks with crowns, no leg through the skirt. The downpour reads light (≈ 25 streaks, no splashes on the lane) for the hook frame |
| 2 | B01-SH02 | pass | Run, tote, puddle (≈ 400, 1140), puff at +19; skirt hem correct after 5bea119 |
| 3 | B01-SH03 | pass (minor F2-B03) | Bun at +85 x ≈ 344–792, y ≈ 544–836 (sheet 335–798); her 487 px. F-B03 not applied: feet flat together, a hard dark floor band ≈ 60 px below them |
| 4 | B01-SH04 | pass | Unchanged: contact +17, gone +31, back +53 |
| 5 | B01-SH05 | **fix F2-B05** | Her 501 px and P45 are right. The drop is the side-view card centred on the projected centre: x ≈ 408–902 (494 px), top ≈ 543, bottom ≈ 891, **resting on her palms (≈ 913)**, so the contact reads here instead of SH07 +15. Mosquito head at x ≈ 760 crowds her (sheet: centre ≈ 1069, at the right edge) |
| 6 | B01-SH06 | pass | Beam ≈ 620 px, level at +45, both ≈ 260–280 px, six tips on the pan, D1 band at the top |
| 7 | B02-SH01 | **fix F2-B07** | Camera follows the drop, both under the face at +22/+34. The mosquito's splayed legs cross her eyes and face at +22 and +34 |
| 8 | B02-SH02 | pass | Unchanged |
| 9 | B02-SH03 | pass (motion: Editor) | Unchanged |
| 10 | B02-SH04 | pass | Ball ≈ 200 px, feather with quill at x ≈ 344 at +23, ball ≈ (688, 960) at +45; drip-curtain streaks faint behind |
| 11 | B02-SH05 | pass | Anchors within 30 px of the sheet; she is drawn over the mosquito's legs, face clear |
| 12 | B03-SH01 | **fix F2-B12** | Camera, drop, riders and lake placement match (+75 riders ≈ (424, 344) → (784, 484)). The shop reflection is 11 separate warm ovals ("leaves"), rings are faint polygons, the lake edge is a pale wedge with no edge; the bun's opaque cyan rim band cuts across her where she is seen through the water |
| 13 | B03-SH02 | pass | Unchanged |
| 14 | B04-SH01 | pass | Bar continuous from +0, passes ≈ (900, 920), ends at tick 20 (≈ 868, 888) at +65, tick 20 gold, OT03 left of it inside x ≤ 1020 |
| 15 | B04-SH02 | **fix F2-B15** | Camera, hit at +50 and mosquito clearance match (+113 mosquito lowest ≈ y 553–585). The D2 "reflection" is a large pale parallelogram with straight hard edges (+97, +113, still after the softening), and the water has almost no rings: the clear gap under the mosquito (A08) cannot be seen |
| 16 | B05-SH01 | pass (motion: Editor) | +0 frozen SH04 +31, +25 contact, +70 and +114 close ride |
| 17 | B05-SH02 | **fix F2-B12 (shared lake)** | No facing flip, tilt down lands, crown at ≈ (536, 1132), ≈ 110 px. The lake around it is the same warm ovals and pale wedge as SH12, plus dark polygon rings 300–500 px across: the splash does not read as landing in a puddle. Crown width accepted (D-17C) |
| 18 | B05-SH03 | pass | P09 hands on hips, 740 px, tote on the shoulder |
| 19 | B05-SH04 | **fix F2-B19** | Mosquito ≈ (412–560, 1000–1040), ≈ 60 px, between her calves. The curtain is three full-height uniform pale lines with round bead dots: strings, not water |
| 20 | B05-SH05 | **fix F2-B20** | Mosquito (544, 420), step, toe right. The water: the warm reflection is diagonal yellow dashes (reads as road paint), rings faint polygons, no crowns visible; the streams the same strings as SH19 |
| 21 | B05-SH06 | pass | +18 right hand at her left ankle ≈ (564, 1085) (sheet 526, 1081, inside ±0.02 m), glint at +23 ≈ (575, 1070), gaze up from +30. The bend reads as a deep squat rather than 35°: accepted (the slap reads). Mosquito visibility stays Q1 |

Totals: 14 pass (2 with a minor), 7 fix (SH05, SH07, SH12, SH15, SH17, SH19, SH20), all Boss's.

### Decisions on Boss's open items (Film, pass 2)

| ID | Item | Decision | Reason |
| --- | --- | --- | --- |
| D-07L | SH07 legs across her face at +22/+34 | **Layer cheat, same as SH11:** after contact she is drawn over every mosquito leg segment inside her silhouette | By depth the mosquito (z +0.40) is nearer the lens than her (z −0.42), so the legs are in front; but her face at the hit is the beat's read. SH11 already records the same cheat, so the two shots match |
| D-12R | SH12 warm dashes; riders show through the bun | **Dashes: fix** (one continuous streak, F2-B12). **Riders through the bun: accept**, softened (F2-B12 (4)) | From +20 the camera is above the bottom face (pos y 0.30 vs face y −0.875), so riders on the underside are seen through clear water: physically right and it keeps them in the reveal. Separate ovals are not how a light reflects in rippled water (one elongated streak broken by ripples) |
| D-CU | SH19/SH20 curtain streams crude | **Fix** (F2-B19) | At 0.09 m a 2.5 mm stream is a column of falling elongated drops with a thin top thread, not a uniform line; the close streams are out of focus |
| D-17C | SH17 crown 6.5 sm wide vs drop 2.51 sm | **Accept** | A mm-scale drop hitting deep water at near-terminal speed opens a crater and crown several drop diameters wide; 6.5 / 2.51 = 2.6 diameters is inside that and at the small end. At 64 sm it is ≈ 110–124 px, the size that reads from above |
| D-15R | SH15 hard-edged D2 reflection patch | **Replace** with the mirrored drop and mosquito (F2-B15) | With the camera falling over flat water the only cue for "not touching" (A08, R04) is the gap between the mosquito and its reflection; a lit quad gives no gap and its straight edges read as a graphic |

### Fix list — Boss (pass 2, one pass)

Fix in `src/painted/edu18/*` (kit untouched). After the pass: stills of every touched shot (frames named per item) through `scripts/stills.mjs`, one `qa-sheet.sh` sheet viewed, numbers checked by `camPoint`/`scripts/shot-projection.py`, then hand to Editor.

- **F2-B05 SH05** (F-B05 (3) re-issued) Draw D1 from its 3D shape under this up-pitch (an option on `paintBun`, used by SH05 only, so SH12/SH15/SH17 do not move): the bottom face is the projected rim ring (r 1.255 sm at y_c − 0.875) filled as water, the dome's silhouette from the projected ring at y_c plus the top point behind it, the inverted shop glow inside the bottom-face ellipse, the rim highlight on its near edge. Targets at +0: bottom face centre (679, 786), bun x 391–979 (593 px), top (642, 689); **lowest drop pixel ≤ y 870 at +0 and ≤ 880 at +25** (palms y 915: at least 35 px of air until SH07). Mosquito fitted by its projected head → tail span (as the woman, F-B05 (1)) with its centre at ≈ (1069, 1076): most of the body off the right edge, nothing but leg tips at x < 700. Frames +0, +12, +25.
- **F2-B07 SH07** From +16 draw her over the mosquito's legs where they cross her silhouette (D-07L); at +22 and +34 no leg crosses her head or hands. Frames +15, +22, +34.
- **F2-B12 SH12 + SH17** (`paintLakeDetail`/`paintLake`, shared): (1) replace the 11 warm ovals with **one continuous streak** on the water along x = PUDDLE.c.x + 60 + 4·sin(0.08·z + 2t) sm from z = c.z − 0.8·rz to c.z + 0.8·rz: half-width 6 sm at the shop end (−z), 3 sm at the near end, `MC.shop` at 0.35, feather 0.25, cut by 10 ripple gaps of 1.0 sm (±30 % jitter) in the water colour, one brighter core (half-width 1 sm, `#f3d9a0` at 0.5) along its far 40 %; no other warm shapes on the lake. (2) Rings: ≥ 32 segments, always lighter than the water (`#e0eef2`, alpha fading to 0, not mixing toward the puddle colour), 1.4–2 px; no dark outlines (SH17 +87). (3) The lake's outline gets a 3 px wet-edge highlight (`#cfe0e6` at 0.5) so the pale wedge reads as the puddle's edge against the ground. (4) SH12 riders through the bun (D-12R): where the bun's bottom-face rim band crosses a rider it is ≤ 12 px and ≤ 40 % opacity; rider parts inside the bun silhouette at 70 % with a cool tint (`#9fc4d4`, multiply 30 %), parts outside sharp. Frames SH12 +50, +75, +106; SH17 +66, +87.
- **F2-B15 SH15** Remove the quad reflection (`paintWaterPlane` `reflect`, id 42403). Draw D2 and the pressed mosquito **mirrored about the water plane** (`Mh` y′ = −43.9 − y) at 30 % opacity, cool tint (`#cfe0e8`), edges feathered 16 px, cut by 4–6 horizontal ripple bands (2–4 px, water colour). Computed (this pass): **+113** real bottom face centre (540, 488), mosquito lowest (540, 585), water under it (540, 863), **mosquito reflection's lowest point (540, 1056)**, reflected bottom face x 379–717 centred (540, 1099), reflected dome bottom (540, 1243): ≈ 470 px of clear water between the mosquito and its reflection; **+97** water under (540, 1342), mosquito reflection (540, 1610), reflected face (540, 1622). Water surface: 6–10 far-drop rings in frame (lighter than the water, ≥ 32 segments, 1.5 px, 40–120 px across), none within 150 px of the point under the mosquito (B-P3); no straight edge longer than 80 px on the water. Frames +0, +50, +97, +113.
- **F2-B19 SH19–SH21 drip curtain** (`soi.ts` curtain): no continuous full-height line and no round bead dots. Each valley's stream = falling elongated drops (width from the existing `wpx`, length 3 × width, core alpha 0.45, edge 0.15, 2 px highlight on the shop side), 3–5 per stream in frame at irregular spacing on the ambient clock; a thread ≤ 3 px at alpha ≤ 0.18 only within 0.15 m below the lip; streams nearer than 0.06 m to the lens defocused (width × 2, alpha × 0.4, no highlight). Keep one stream ≈ 2 cm left of the mosquito (≈ 180–220 px left of it in SH19) and the landing crowns. Frames SH19 +0, +24, +51; SH21 +18.
- **F2-B20 SH20 puddle** (`soi.ts` rich puddle): the warm reflection as one continuous streak (centre x P.c.x − 0.15 ± 0.006 m sine, z P.c.z − 0.36 → P.c.z, half-width 0.015 m, 6 ripple gaps of 0.005 m, no separate dashes); rings as F2-B12 (2) at 1.8 px; **crowns: ≥ 4 in frame at every frame, each ≥ 18 px tall**, `#e4f0f4` at 0.8, 6–8 f lifetime, on the curtain's landing line and in the puddle; streams per F2-B19. Frames +0, +50, +80.
- **F2-B01 SH01** (minor) Downpour density for the hook: ≥ 50 streaks in frame (near ones 4–6 px), 8–12 splash crowns on the lane at y ≥ 1350, renewed every 4–8 f. Frames +0, +29.
- **F2-B03 SH03** (minor, F-B03 re-issued) Toes pointed down ≈ 30°, feet 0.1 sm apart; the dark floor band blurred (24 px edge) and below y 1500 at +0, or dropped. Frames +0, +85.

### Editor (unchanged from pass 1)

SH09 streaming, SH14 freeze, SH16 rewind and SH17 roll/fall are motion checks for the W5.3 draft; caption check once captions exist (SH15 +113 reflected dome bottom at y 1243 sits in the band at 30 % opacity: measure it).

## Pass 3

Film plate review of Boss's pass 2 (commit ce788bc), 2026-11-12, fresh invocation. Sheet unchanged: **EDU-EP18-ROWS-R2.2**.

Evidence: 30 stills re-rendered by Film from ce788bc on one Chrome (`node scripts/stills.mjs src/painted/edu18/shots-index.ts`, 27 s), viewed as three `qa-sheet.sh` sheets at 270 px plus two 540 px pairs; Boss's `boss-p3-a/b/c` sheets compared. Store: `projects/edu/EDU/previews/film3sheet-a.png` (SH01 +0/+15/+29, SH03 +0/+85, SH05 +0/+12/+25, SH07 +15/+22/+34), `film3sheet-b.png` (SH12 +50/+75/+106, SH15 +0/+50/+97/+113, SH17 +66/+87), `film3sheet-c.png` (SH19 +0/+24/+51, SH20 +0/+20/+35/+36/+50/+80, SH21 +18), `film3-sh05-pair.png` (pass-2 vs pass-3 SH05 +0), `film3-sh17-540.png`. Measured on the SH05 frames (rgb dump): drop pixels y 156–870 at +0 and 156–880 at +25, drop x 380–1008. Other positions are read off the 270/540 px sheets (est., ±10 px at 1080).

### Per-shot verdict (pass 3)

| Shot | Verdict | What the frames show |
| --- | --- | --- |
| SH01 (B01-SH01) | pass | ≈ 50+ streaks, splash puffs on the lane at y ≈ 1380 (≈ 30 px). At phone size they read as rain hitting the lane; their exact shape is not seen |
| SH03 (B01-SH03) | pass | Feet flat: at +0 they sit behind the bubble, at +85 they are ≈ 20 px. The floor edge is at y ≈ 1500 |
| SH05 (B01-SH05) | **fix F3-B05** | Drop: a lens 592 px wide, top ≈ 690, lowest 870 (+0) / 880 (+25), palms ≈ 912. That meets the sheet. Mosquito: head ≈ (724, 1160), thorax ≈ (924, 1120). The proboscis runs down-left to ≈ (484, 1480), **onto her shin**, so it reads as a bite. The F2-B05 target of a centre ≈ (1069, 1076) with only leg tips at x < 700 is not met |
| SH07 (B02-SH01) | pass | From +16 she is drawn over the legs. At +22 and +34 no leg crosses her face or hands |
| SH12 (B03-SH01) | **fix F3-B12** | Rings, wet edge and the riders softened through the bun all pass. The shop streak is one olive band ≈ 120–180 px wide with hard edges, a paler halo band and evenly spaced dark cross-bars. It reads as a segmented road or bamboo stalk, not light on water |
| SH15 (B04-SH02) | pass | The mirrored mosquito and dome sit at 30 % with ripple bands. At +113 the mosquito's lowest point is ≈ 545 and the reflection's top ≈ 1044, so ≈ 500 px of clear water shows the gap (A08). The edges are unfeathered, but a viewer at phone size does not notice that |
| SH17 (B05-SH02) | **fix F3-B12** | Same band as SH12, ≈ 160 px wide, running the full frame height and taking more space than the landing (+87 drop ≈ 60 px with a ≈ 120 px crown) |
| SH19 (B05-SH04) | pass | Streams are falling elongated drops with no strings or beads. The near drops over the skirt are soft pink ovals (defocused), which is acceptable |
| SH20 (B05-SH05) | pass (streak per F3-B12 if the helper is shared) | Crowns ≥ 4 once the puddle is in frame (+35 onward), with ticked rims ≈ 20–25 px. The streak is the same segmented-band style at a smaller size (≈ 60 px) |
| SH21 (B05-SH06) | pass | Unchanged |

Totals: 7 pass, 2 fix items covering 3 shots (SH05, SH12/SH17 shared; SH20 follows the shared helper).

### Decisions on Boss's open items (Film, pass 3)

| ID | Item | Decision | Reason (numbers) |
| --- | --- | --- | --- |
| D3-05 | SH05 true 3D face vs flat lens | **Accept the flat lens; neither the check nor the camera changes** | At this 60–61° up-pitch the dome hides almost entirely behind the bottom face. The sheet's projected dome top (642, 689) and the rendered lens top (≈ 690) agree to within 5 px, so the lens is the 3D projection to a viewer, not a cheat. Lowest 870/880 vs palms ≈ 912 keeps ≥ 32 px of air until SH07 +15, the beat that matters. Changing the camera would undo the 501 px figure fit |
| D3-20 | SH20 no crowns before the puddle is in frame | **Accept** (crowns only while water is in frame) | +0..+34 frames the dry step and ankles. Splashes on dry concrete are not part of the beat, and the falling stream drops already carry the rain |
| D3-03 | SH03 toes down needs a kit foot-angle option | **Accept flat feet; no kit change** | The feet are ≈ 20 px at +85 and hidden by the bubble at +0. One shot does not justify a change to `cast.ts` |
| D3-15 | SH15 reflection without edge feathering | **Accept** | At 30 % opacity with ripple bands the hard edge does not read at phone size. The gap cue (≈ 500 px) works |
| D3-01 | SH01 crowns as ≈ 34 px puffs | **Accept** | In a 30-frame hook they read as splashes. Their shape is below what a viewer notices |
| D3-12 | SH12/SH17 streak reads as a broad ribbon | **Fix** (F3-B12) | Film's F2-B12 spec was wrong: widths given in sm became 120–180 px in these close shots, and painting the gaps over a halo band made dark bars. The fix gives screen-px caps and makes the gaps breaks rather than paint |

### Fix list — Boss (pass 3, one pass)

Fix in `src/painted/edu18/*` (kit untouched). After the pass: stills of the frames named below, one `qa-sheet.sh` sheet viewed, then hand to Editor.

- **F3-B05 SH05 mosquito** (unmet part of F2-B05): refit the mosquito so its head is at x ≥ 900 and thorax centre ≈ (1069, 1076) ± 30 px, mostly off the right edge. **No mosquito pixel (proboscis, legs, wing) inside her silhouette** (her x ≈ 440–630, y ≈ 900–1480 est.). Leg tips may reach x < 700 only below y 1500 or above y 900. Rotate the proboscis to point down-right or forward rather than at her, or let it end before x 700. Leave the drop untouched. Frames +0, +25.
- **F3-B12 shop streak** (SH12, SH17 lake; SH20 puddle if it uses the same helper, else its own streak with the same rules), replacing F2-B12 (1)'s widths:
  - Full width on screen ≤ 40 px at the shop end and ≤ 16 px at the near end in every frame, computed per segment from the projected width with the px cap applied.
  - Peak opacity 0.30–0.35. No halo or outer band.
  - Soft edge without blur: three stacked strokes at width × 1.0 / 0.6 / 0.3, each at alpha ≈ 0.12.
  - **Gaps are breaks, not paint:** leave the streak out over 8–12 irregular lengths (6–24 px on screen, ±40 % spacing). Draw nothing in the water colour over it.
  - Keep the one brighter core on the far 40 % (≤ 4 px wide).
  - Frames SH12 +75, SH17 +66 and +87, SH20 +80.
  - Acceptance: at 270 px no band and no cross-bars are visible, only a thin broken warm line, and the SH17 landing crown is the brightest thing in its area.

### Editor (unchanged)

The SH09/SH14/SH16/SH17 motion checks and the caption check from pass 2 still apply at the W5.3 draft.

## Questions for the user (coordinator asks with the structured-question tool)

- **Q1 SH21 ending, mosquito visibility.** At the medium-wide ending the mosquito is about 2 px (true size at 2.4 m). Options: (A, Film's default, applied in R2.1) keep the framing, add a tiny wing glint 4 times plus her gaze and the whine; (B) during the hold (+72–+129) push down to an ankle close like SH19 so the mosquito is about 44 px, losing her face; (C) leave as is (the whine and her glare carry it).

## Change log

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-12 | Film | First fix list from the W5.2 plate review (sheet ROWS-R2.1). |
| 2026-11-12 | Film | Pass 2 after Boss's W5.3 fixes: 14 pass, 7 fix (F2-B05, F2-B07, F2-B12, F2-B15, F2-B19, F2-B20; minors F2-B01, F2-B03); decisions D-07L, D-12R, D-CU, D-17C, D-15R; sheet ROWS-R2.2. |
| 2026-11-12 | Film | Pass 3 after Boss pass 2 (ce788bc): 7 pass, fix F3-B05 (SH05 mosquito off her shin) and F3-B12 (shop streak px caps, breaks not paint; SH12/SH17/SH20); accepted D3-05 flat lens, D3-20, D3-03, D3-15, D3-01; sheet stays ROWS-R2.2. |
