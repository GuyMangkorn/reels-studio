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

## Questions for the user (coordinator asks with the structured-question tool)

- **Q1 SH21 ending, mosquito visibility.** At the medium-wide ending the mosquito is about 2 px (true size at 2.4 m). Options: (A, Film's default, applied in R2.1) keep the framing, add a tiny wing glint 4 times plus her gaze and the whine; (B) during the hold (+72–+129) push down to an ankle close like SH19 so the mosquito is about 44 px, losing her face; (C) leave as is (the whine and her glare carry it).

## Change log

| Date | Author | Change |
| --- | --- | --- |
| 2026-11-12 | Film | First fix list from the W5.2 plate review (sheet ROWS-R2.1). |
