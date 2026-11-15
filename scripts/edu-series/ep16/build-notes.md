# EDU-EP16-SHORT build notes (Boss W5.2)

Progress, open items and evidence for W5.2 (shared assets and plates G1–G7 from timed sheet EDU-EP16-SHEETS-R1). Round 3 (2026-11-15) plated G4–G7. Nothing committed. No video rendered.

## Status: groups done 7 / 7 (round 3, 2026-11-15)

Hardening items 1–4 are done. All 24 shots are plated from the timed sheet as stills and measured: G1–G3 in round 2, G4 (SH13–SH15S), G5 (SH16, SH17, SH19–SH21), G6 (SH18) and G7 (SH22, SH23) in round 3. Nothing committed. No video rendered (the draft cut is Editor's W5.3 stage).

## Done

| ID | What | Files | Evidence |
| --- | --- | --- | --- |
| D1 seat | `woman()` default seat is `SH01_AT` (0.04, 0, −0.02) in every roof shot (`AT0 = SH01_AT`) | `src/painted/edu16/scenes-roof.ts` | `out/edu16/w52/h1/SH23.png` vs approved `out/edu16/w52/appr/SH23.png`: PSNR 43.3 dB (the expected shift of about 4 px, not yet confirmed by eye) |
| SEAM | Curled-finger ink hooks on the SH03 pianist hand, fixed **episode-locally**: `paintHandSealed` wraps the Painter and drops the middle/ring/little outline points that lie within `cut = 0.18` of the MCP→PIP segment. kit `hands.ts` is unchanged. | `scenes-roof.ts` | crops `out/edu16/w52/h1/sh03-curl3x.png` (new) vs `out/edu16/w52/h1/sh03-curl3x-appr.png` (approved); full-frame PSNR vs the approved frame 42.3 dB at cut 0.18 (41.0 at 0.55; only the hand differs) |
| woman opts | `woman()` exported with `fig`, `t`, `faceState`, `noGear` options; `paintSH03(p, {cam, off, state})`; `paintForearm03` offset; `lowFalloff` exported | `scenes-roof.ts` | tsc clean (non-test) |
| ENV-STARS | Promoted copy of `edu07/stars.ts` (EP07 keeps its own copy, so its pinned scenes do not repaint) | `src/painted/kit/stars.ts`; roof/thought/forest import it | baseline stills PSNR 70–82 vs approved |
| GEAR-HEADPHONES | `paintHeadphones` moved to the kit (re-exported from `edu16/cast.ts`) | `src/painted/kit/headphones.ts` | same |
| poses | `seated-reach-hover`, `withdraw-to-chest`, `look-up` as world targets and FigPose fields in a new file (outside `poses-seated.ts`, which EP06/EP09 pinned scenes import) | `src/painted/kit/poses-seated-reach.ts` | tsc only; not yet used in a plate |
| blip clock | `spikeAt` / `traceAt` / `traceLevelAt` from one JSON shared with Ton/Editor (spikes f = 21n, n 0..31, flat from f654, missing f672, dim 30 % over f672–678) | `src/painted/edu16/clock.ts`, `scripts/edu-series/ep16/blip-clock.json` | module-load validation throw |
| clocks | shot ranges, easing, `labelOn`, `COOL` grade per shot, `STK_KEYS`, `beadAt` (0 → 0.11 at f915 → 0.40 at f1024) | `clock.ts` | — |
| scaffold | `makeShot` adapter (L, G, Grain overlay), QA entry `EDU16-<shotId>` with `label`/`guides`/`tag` props, 24 shot stubs registered through `scripts/new-shot.mjs` (no `src/Root.tsx` edit) | `src/painted/edu16/shot.tsx`, `build-index.tsx`, `shots/*.tsx`, `src/painted/shots/edu16.tsx`, `src/painted/registry.ts` | — |

## Round 2 (2026-11-15)

| ID | What | Files | Evidence |
| --- | --- | --- | --- |
| SEAM r2 | `paintHandSealed(p, c, h, cut = 0.18, tol = 0.7)`: a silent first pass records the back-of-hand fill polygon (seed base + 60), then each curled-finger ink drops the points inside it or within 0.7 × MCP→PIP of it. kit `hands.ts` unchanged | `scenes-roof.ts` | `out/edu16/w52/g1/SH03_L04-540.png`; ticks gone at 3× crop |
| RIM21 | SH21 crate city-side edge moved before the mitten (it crossed her forearm, the orange cast) | `scenes-roof.ts` | code order; SH21 plate is G6, so not yet viewed in a timed plate |
| MITT | `MittKind` 'point' / 'rest' / 'fist'; aim non-finite or closer than 0.02 U falls back to the forearm direction; explicit lobe clamped 0.015–0.08, computed lobe keeps 0.02–0.07 (LF-ROOF identical, 74.2 dB) | `cast.ts` | PSNR vs `out/edu16/w52/appr/LF-ROOF.png` |
| ROOFSTATE | `spike?` / `traceLv?` in `paintScreen` (undefined = old look) | `roof.ts` | LF-ROOF 74.2 dB |
| STAGE | `orbit`, `orbitMix` (mixes orbit parameters), `roofState(id, G)`, `localOf`, `LF_WOMAN`, `paintRoofWoman` (`relight` repaints the lit button cap over the falloff), `relightButton` | `src/painted/edu16/stage.ts` (new, context map updated) | tsc clean (non-test); `npm test` pass |
| SH07 split | `paintSH07Back` / `paintSH07Bust` / `paintSH07Mist`; `paintSH07Age` composes them (73.5 dB vs `roof/v7/clean/SH07-A50`); `paintFarStar` exported; measure mode drops the bust tint | `scenes-roof.ts` | PSNR |
| MEASURE | `measure` prop on the QA entry: yellow head-centre and cyan chin markers | `build-index.tsx`, `scenes-roof.ts` | measure stills |
| G1 | SH01 (camSH01 push, gasp +8), SH02 (orbit A→B, left-hand cup press), SH03 (fingertip stop at +4) | `shots/S01-B01-SH01..03.tsx` | `out/edu16/w52/g1/sheet-g1.png`, `measure.txt`, `caption-zone.txt` |
| G2 | SH04, SH05, SH08 (custom back/shoulder mass, world arm), SH09 (both layers sharp), SH10/SH11 (screen push, flat line), SH12 | `shots/S01-B02-SH04..S01-B04-SH12.tsx` | `out/edu16/w52/g2/sheet-g2.png`, `measure.txt`, `caption-zone.txt` |
| G3 | SH06 (thCam tilt 0.10→0.71, light 440→1140, star lands (600, 300) at +74, rim), SH07 (cx 110→90, beads, a21→a50→a81 dissolves through `p.layer`, rim) | `shots/S01-B02-SH06.tsx`, `S01-B02-SH07.tsx` | `out/edu16/w52/g3/sheet-g3.png`, `measure.txt`, `caption-zone.txt` |

Measured (clean stills, caption band 1176:1344, captioned frames only): every G1–G3 frame passes (mean 0.09–0.24, p95 0.27–0.39). SH12 +67 is outside its caption (C10 +4–+57) and reads p95 0.48. Leads are lower bounds where the falloff or mist clips the magenta at y ~1150: SH01 890–908, SH02 966–1142, SH04 706–756, SH05 758–782, SH09 920–982, SH12 776–948, SH07 ≥ 682–744 (bust to the frame bottom). SH03 (hand macro), SH06 (no figure), SH08/SH10/SH11 (no face in frame) N/A. UT03 dark share (<20/255): roof shots 0.1–17 %, SH03 18 %, SH07 30–32 % (approved baseline 30.3 %), SH06 61–73 % (LF-THOUGHT 49 %; the city silhouette fills the lower frame at the start).

**Boss feasibility re-keys (for Film to confirm, AI13).** The kit woman stands taller in picture than the sheet's `est` (LF-ROOF eye at sheet (628, 534), rig head centre (804, 396)):
- SH05 B hy 860 → 1110 (head top and the thought dots stay in frame);
- SH09 f 1050 → 715, hy 520 → 720, cx −84 (her face in frame);
- SH12 B hy 540 → 590 (head top clears the label);
- per-shot `fall` values (falloff y0/alpha) chosen to pass the caption zone.

**Known limits.**
- SH02 end frames: the label overlaps her hair (the sheet camera is kept so the button stays above the band).
- SH04/SH05: two grey mittens at the frame bottom (the rig clamps the reach).
- SH08: her head projects off-frame right (x ~1600); the custom mass reads as her back and shoulder at 270 px.
- SH09: no rack focus in the kit, both layers sharp.
- The lower halves of the roof shots are dark navy from the falloff, not black.

**User decisions (15 Nov, via coordinator):** SH02 label over hair, SH08 off-frame head and custom mass, SH09 no rack focus, SH04/SH05 mittens and the camera re-keys (SH05, SH09, SH12, falloff values) accepted as they are.

**ARM-OVER-THIGH (user fix, 15 Nov).** In the `left` profile the reaching right arm is the far arm, and the pose library (`poses.ts`) sets `farArmUnder: true` for every profile, so kit `cast.ts` painted it before the legs and it read as under her thigh. `woman()` in `scenes-roof.ts` now passes `farArmUnder: false` when `reach` is set and `view === 'left'`: legs, then the far arm, then the torso (the arm stays under the torso; the near left arm and mittens are unchanged). Kit untouched. Front-view shots (SH04, SH05) are not affected. It also reaches every other `left` reaching call of `woman()`: LF-ROOF (`paintLFRoof`, so the approved LF-ROOF still now differs at the forearm) and SH21 (`paintSH21`, G6, owned by the round-3 Boss). Re-stamped SH01, SH02, SH04, SH05, SH09, SH12 into `out/edu16/w52/arm/` and copied them into `g1/` and `g2/` (sheets rebuilt). Evidence: `out/edu16/w52/arm/sheet-arm.png` (270 px, viewed), `arm/before-after-crops.png` (left before, right after), `arm/SH01_L08-540.png`, `arm/measure.txt`, `arm/caption-zone.txt`. Caption zone and leads unchanged from round 2 (all captioned frames pass; SH12 +67 is outside its caption).

## Round 3 (2026-11-15)

| ID | What | Files | Evidence |
| --- | --- | --- | --- |
| STAGEMOVE | `withStage(p, c, s, d, draw)`: picture-stage scale about `c` then shift `d` (brush push/translate/scale), for the TH shots; star dust and rim stay outside it | `stage.ts` | used by SH13–SH15S, SH18 |
| IM-CARDS | `paintSH13Cards(p, L, t, {fold, hersR, theirsR})`: SH13's timed blooms, mirror, kind flicker (recede +45..+51, card +51..+69, swallow +69..+79, eyes +79..+83) and SH14's fold, from the W3 LF-THOUGHT / SH13-KIND staging | `scenes-im.ts` (new) | `g4/sheet-sh13.png` |
| FARGLOW | `paintFarGlow` exported (no pixel change) | `scenes.ts` | — |
| SH21T | `paintSH21(p, {on, pool, glow})`: `pool` and `glow` options for the timed click (defaults = the approved click frame) | `scenes-roof.ts` | — |
| SH22SPLIT | `paintSH22Pages(p, c)` split out of `paintSH22`; `LB_QUAD(c = camSH22)`; `LogbookText` moved to `logbook.tsx` with a camera prop; look still unchanged | `scenes-roof.ts`, `logbook.tsx` (new), `look-roof.tsx` | W3 SH22 look still vs `out/edu16/roof/v8/clean/SH22.png`: PSNR 78.2 dB |
| OVERLAY | `makeShot` takes `overlay?: (L) => ReactNode` (DOM under the grain; SH22 logbook rows through the pan camera) | `shot.tsx` | — |
| G4 | SH13 (iris-in, blooms +6/+23, claws frozen +35, kind flicker), SH14 (fold, lights 78/64 → 58/29, thread, bead from +12, truck 60 px), SH15 (tiny far light, swell +54..+84, rise +59..+89 easeOut, arm lift +74..+92, dolly back 1.12 → 1.00), SH15S (W3 strip + 4 % push) | `shots/S01-B04-SH13..SH15S.tsx` | `out/edu16/w52/g4/sheet-g4.png`, `sheet-sh13.png`, `sheet-sh1415.png`, `sheet-sh15c.png`, `measure.txt`, `caption-zone.txt`, `stk/` (24 SH15S frames) |
| G5 | SH16 (front close-up, swallow +14..+22), SH17 (6 % push, dots top-left +28..+40, bubble +42), SH19 (30 % push, tremble +94..+96), SH20 (withdraw-to-chest, fist +12..+16, leaves toward the switch +17..+21), SH21 (lit +0..+5, click +6, pool 1 → 0.3 and filament 0.85 → 0 over +6..+13) | `shots/S01-B05-SH16,17,19,20,21.tsx` | `out/edu16/w52/g5/sheet-g5.png`, `sheet-sh21-arm.png` (2× crops +5/+13/+22), `measure.txt`, `caption-zone.txt` |
| G6 | SH18 (void dust under the forest, forest layer fades in and rises 120 px +4..+30, forestCam k 0 → 1 +14..+143) | `shots/S01-B05-SH18.tsx` | `out/edu16/w52/g6/sheet-g6.png`, `measure.txt`, `caption-zone.txt` |
| G7 | SH22 (full roof tinted 0.45 toward the W3 start, pages + DOM rows through the pan camera, pan-tilt +60..+100, look-up +70..+80), SH23 (orbit-parameter crane +0..+122, 60 f ambient hold) | `shots/S01-B05-SH22.tsx`, `S01-B05-SH23.tsx` | `out/edu16/w52/g7/sheet-g7.png`, `sheet-sh22.png`, `sh22-face-540.png`, `sheet-sh23.png`, `measure.txt`, `m2/measure.txt`, `caption-zone.txt` |

Measured round 3 (clean stills, caption band 1176:1344, captioned frames):
- G4: SH13 +6/+30/+60/+76/+95, SH14 +6/+20/+52, SH15 +2/+64/+70/+80/+100: mean 0.10–0.16, p95 0.363 (the rim), all pass. UT03 dark 33–52 % (approved LF-THOUGHT baseline 49 %). No figure (lead N/A; the kind card is a small inset).
- SH15S acceptance: frame-mean luminance (0..1, 270 px) rise +8 −0.0013, +9 +0.0038, +10 −0.0030 (limit 0.08): pass; one flash only; black +18..+23 at 0.042.
- G5: SH16 +8/+18/+26 mean 0.172 p95 0.39 pass, lead ≥ 672 px (head top y 518, clipped by the falloff at 1190), head centre (554, 833); SH17 +3/+20/+36 mean 0.16–0.17 p95 0.344 pass; SH19 +6/+60/+118 mean 0.17–0.23 p95 0.344 pass; SH20 (no caption) +0/+14/+21 mean 0.23 p95 0.46–0.52 (would fail, N/A: W-OFF has no caption), lead 976–1050 px (head top y 48–68, head centre (708–716, 231–243)); SH21 (no caption) +0/+6/+22 mean 0.19–0.22 p95 0.19–0.27, lead 512 px (y 400–910; sheet v11 511). UT03 dark 0.1–18 %.
- G6: SH18 +6/+20/+40/+72/+110/+134 mean 0.11–0.19, p95 0.363 pass; UT03 dark 22–55 % (54 % at +6 is the void before the forest).
- G7: SH22 +2/+61/+85/+100/+110 mean 0.18 p95 0.20–0.32 pass; end lead from head top y 710, head centre (585, 897), chin 1112 (sheet 664/914/1122); SH23 +4/+60/+122/+181 mean 0.16–0.22 p95 0.24–0.37 pass; lead +4 618 px (sheet 603), end 78 px at y 1368–1444 (sheet ≈ 98 px at 1352–1451). UT03 dark ≤ 0.2 %.
- UT04: no translucent warm over cold added (warm pool and kind card stay opaque premixed fills as in W3).

RIM21 / farArmUnder check (SH21, by eye at 2× crops +5/+13/+22): the crate's orange city-side top edge passes behind the mitten and no longer crosses the hand or forearm; with the coordinator's round-2 `farArmUnder: false` line, the right forearm draws over her thigh and knee and reads as reaching in front of them, finger on the rocker. Not reverted.

**Boss feasibility re-keys round 3 (for Film to confirm, AI13):**
- SH13 push centre (540, 760) → (540, 1150) (same 1.00 → 1.12 scale): about the gap her light's centre reached y 1197 in the band while C11 shows; now it stays at y 1150. SH14 keeps the same stage.
- SH16 hy 780 → 1090 (eyes at y ~840 instead of ~540; same camera position, direction and lens).
- SH22 end: pan end yaw +40 → +43, hy 800 → 1040, and the lens eases f 1050 → 580 during the pan (at f 1050 her head filled the frame, top cropped). This adds a zoom-out to a pan-tilt.
- SH15: the monster's near arm is held at chest height (claw ≈ (330, 1050)) before the +74 lift, and the rise eases out, so claws stay above the band while C13 shows.

**Known limits round 3.**
- SH20 keeps the sheet camera: her head top sits at y 48–68 and the head centre at x ~710 (sheet: head top 205, eye x 531); the button lands on the sheet's (≈ 392, 1084). The label clears her hair by about 80 px.
- SH15 +62..+66: the faint rising arm's elbow dips into the band (claws above it).
- SH13 kind beat: the swallow is a param mix of the receded and standoff monsters drawn over the fading card; reads at 270 px but is not a designed transition.
- SH18's trunk rise is the whole forest layer moving 120 px with the fade, not individual trunks.
- SH22: the face is front-on with the eyes and chin up (look-up `front`); at 270 px it reads as looking up a little, not a strong up-turn.

## Open items (next session, in order)

1. Film confirms the round-2 and round-3 re-keys above, or returns new values.
2. Editor W5.3: half-size draft cut through `scripts/render.mjs` (seek parity and sequence QA of the plated shots have not been run; stills only).
3. W5.2 ticked in `scripts/edu-series/task.md` (round 3).

## Shared-code impact

- **kit `hands.ts` unchanged.** A kit-level seam fix would repaint every pinned scene that draws a macro hand. That includes all 18 EP09 pins under `B_loop`: S01-B01-SH01–SH04, B02-SH01–SH03, B03-SH01–SH04, B03-SH07–SH09, B04-SH01, B05-SH01–SH03. Many other painted episodes also import `hands.ts`. A kit fix needs the user's decision.
- The new kit files (`stars.ts`, `headphones.ts`, `poses-seated-reach.ts`) are imported only by edu16, so no other episode repaints.
- Round 3 changed only edu16 files (`stage.ts`, `scenes.ts`, `scenes-roof.ts`, `scenes-im.ts`, `logbook.tsx`, `look-roof.tsx`, `shot.tsx`, shot files) and the context map; kit `hands.ts` untouched. `npm test` pass (log `out/logs/npm-test-r3.log`); tsc clean outside `tests/`.

## Notes

- Pre-existing tsc errors in `tests/` (arm-depth, loudness, render-options) are not from this work.
- Compare helper used: ffmpeg `psnr` filter between the approved copies in `out/edu16/w52/appr/` and new stills.

## Editor W5.3 Draft (2026-11-15, EDU-EP16-SHEETS-R1, nothing committed, final cut not rendered)

**Render stage: draft cut** (half size 540x960, `clips.mjs EDU-EP16-SHORT review-rows.json --full --draft`): 24 of 24 scenes rendered, 0 reused, 445 s, `out/EDU-EP16-SHORT/clips/_draft_cut.mp4` (1737 f, 57.90 s, audio muxed), log `out/logs/ep16-draft-clips.log`; `review-rows.json` now carries `clips.draft` per shot (the review page is not rebuilt or published here).

Files: `src/videos/edu-ep16/index.ts` (composition `EDU-EP16-SHORT`, auto-registered), `cues.ts` (C01-C18), `scripts/edu-series/ep16/narration-place.py` (N1-N4 -> `public/narration/EDU-EP16-SHORT-narration-placed-v1.wav`, the locked v1 file untouched), `sound-mix.py` (38 cues -> `out/stems/{voice,bed,texture,accent}.wav` mono + baked `public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav` stereo). `sound-cues.json`: only `sources` (+ `sound-mix.py`) and `exempt` (stems) edited, as EP15 did; the file was re-serialised with indent 2.

Timeline: 24 scenes at the sheet ranges; dissolves = `painted.shots[].dissolveSec` on SH06 12 f, SH07 8, SH08 12, SH13 12 (iris-in), SH14 8, SH16 12 (iris-out), SH18 14, SH19 12; label cue on SH01-SH03 and SH06-SH21 (`labelTop` 148); captions `captionStyle` outline, bottom edge 1344, no band; mark = chrome default. `caption-breaks.mjs`: 0 bad breaks (4 long cues C15-C18 got authored breaks, read 2 lines in frames).

**Mix numbers** (`python3 -I scripts/mix-levels.py scripts/edu-series/ep16/sound-cues.json`, log `out/logs/ep16-mix-levels-7.log`): voice speech -15.9 LUFS (integrated -16.1, TP -1.5); dV in speech: bed 19.7, texture 23.7, accent 19.8, background 16.0; mix integrated -16.1, TP -0.5, mix minus voice -0.2 LU. Rows: 42 total, 1 FAIL, 6 warn, rest ok. `python3 -I scripts/sound-cues.py`: pass (38 cues, 34 generated, 4 library, 0 swaps). Draft mp4 audio RMS: f1042-1048 -71 dB (dead; stems -92), f672-703 -24 dB (drone + A1 hum, as decided), f1722-1737 -26 dB (hum).
- FAIL `S02-blip` B01 peak (f126, window 4.15-4.30 s, needs -6..3, measured 17.3 then 14.8): the row assumes f126 is in the L02>V01 gap (3.95-4.54 s) but those are unplaced file times; placed, L02 speaks f118-143 (C02), so the blip is under speech. Placed soft (EP08b); the row needs Ton's fix (timing in composition seconds or drop the row).
- warn: B01 background 14.7 (15), B02 bed 20.6 and B04 bed 21.3 (above 20, bed quieter than target; M1 -3 dB step at f703 is the user's), B03 background 13.1 (blips 12.5 under, user's floor vs the 15 background row), S20 peak 4.7 (needs -6..3; mix gain is the user's -6 dB; Ton's note computes -15 LUFS at +1 LU but the 400 ms meter reads 4.7 under), S08-head-air-3 ok after retune.
- Interpretations: blips measure ~5 dB quieter than the set dV (0.15 s vs the 400 ms meter), so B01/B02 blips are set at dV 14.5 and B03 speech blips at 12.5 so the checker reads >= 12; gap blips (none left after the 0.25 s look-ahead) would be dV 3; S01 PING at dV 0 and S03 gasp at dV 8 (both land in the W-PING silence, before L01 at f31, not under it as the cue note says); S25/S26 rustle/breath dV 6 and S27 click dV 3 in the W-OFF silence (no speech; click capped at -3 dBFS peak); M1 fades in over f118-148 instead of starting at f118 (sheet silence f116-156), and goes dead f1042-1048 (ramp 1034-1042 out, 1048-1062 in); S12 dead at f672 (1 ms fade); S07/S13/S17 ends f312/f779/f850 and S11/S21 4 f / 2 f fades; S14/S15 panned (mono sum equal); M1 loop seam xf 1.5 s; narration cut edges get 3 ms fades inside the silences. Nothing listened.

**Shot-by-shot check** (draft frames, qa sheets in `out/EDU-EP16-SHORT/qa/`: `sheet-B01.png`, `sheet-B02a.png`, `sheet-B02b.png`, `sheet-B03.png`, `sheet-B04a.png`, `sheet-STK.png`, `sheet-B05a.png`, `sheet-B05b.png`, `overview.png`, `sheet-dis1263.png`; frames `qa/f/fNNNN.png`): cuts land on the sheet frames; D8 SH04/SH05 (f221-226) and SH10/SH11 (f651-656) show no visible cut; last spike f651-653 then flat from f654; SH15S contact f1032, black f1046, iris-out to the face f1048-1060; click f1412-1420 lamp pool leaves; label on at f1429, off at f1430; captions end with the sheet ranges (C09 +5 f over SH11, no caption f1385-1431, none in W-STOP).
Mismatches / defects (nothing fixed in plates):
1. Label position: the shared `Label.tsx` fixes x = 120 (left); the sheet's slot is top-right (x 816-1020, y 148-204) and the QA plates' `Lbl` used that. Draft puts it left under the mark at y 148. Boss: add a position/side option, or Film accepts left.
2. SH09-SH11 (f544-698): the clip lamp (cream, top-left) sits behind the mark and label; the `@TamMaiLa` mark is close to unreadable there (label has its stroke). Film/Boss.
3. SH13 f864 (SH14 starts f866): both monsters read translucent olive-pale in the draft, not opaque black; check at full size (DF painted-opaque-cast). Boss.
4. SH15S flash (f1032-1037) is a small amber ring brightening, readable but quiet at half size.
5. Label sits directly under the mark (about 10 px gap), reads tight.
Sample (one story scene S01): SH13 f816, `out/samples/edu-ep16/EDU-EP16-SHORT/SHEETS-R1/S01_SH13_f816.png` (1080x1920, composition EDU-EP16-SHORT frame 816, shot-local +49, integration sample, uncommitted tree on `79e111f`; repro `node scripts/render.mjs EDU-EP16-SHORT --stills --frames=816 --gl=angle`).

## Boss W5.4 fix round (2026-11-15, uncommitted tree on `79e111f`, no video rendered)

User decisions 15 Nov 2026: label to the sheet's top-right slot; check the mark over the SH09-SH11 lamp; check SH13 monster opacity. Evidence in `out/EDU-EP16-SHORT/qa/w54/` (composition stills `render.mjs EDU-EP16-SHORT --stills --gl=angle`, clean plates `stills.mjs src/painted/edu16/build-index.tsx --props='{"guides":false,"tag":false,"label":false}'`).

| ID | Change | Files | Evidence |
| --- | --- | --- | --- |
| LBL-SIDE | New opt-in timeline cue field `painted.shots[].labelSide: 'left' \| 'right'` (types + validation + span/plate + `PaintedStage` + `PaintedLabel side`). `right` right-aligns the label box to `LABEL_BOX.short.right` 60 (edge x 1020; long 144). Default left is unchanged: plates without the field carry no `labelSide` key, so pinned episodes do not repaint. EP16 cues use `labelTop: 148, labelSide: 'right'`. | `src/painted/Label.tsx`, `src/painted/PaintedStage.tsx`, `src/scenes/types.ts`, `src/scenes/painted.ts`, `src/videos/edu-ep16/index.ts`, `tests/painted.test.ts` (new test) | White fill measured x 841-1016, y 153-183 on f60/340/630/820/1200 (stroke about 3 px more): inside the sheet slot x 816-1020, y 148-204. `sheet-w54-after.png` |
| MARK-LAMP | Not changed (measured readable). Mark ink `#49445c` (chrome default, scenes have no `time: 'night'`). Contrast of the ink against the background inside the mark box (x 118-248, y 122-156): f60 1.76, f340 2.06, f575 1.95, f1200 2.16 (median, every other shot); SH10/SH11 f630-698 median 7.1-7.2 with 62-86 % of the box on the cream bulb, the rest 1.4-1.6 (same as elsewhere); f610 median 1.57 (17 % bulb). The bulb edge crosses "@Ta" from f610 to f640, which is busy, not unreadable. Moving the label right cleared the label from the lamp. | none | `mark-before.png` (f60, f560, f630, f680), `mark-sh10-sh11.png` (f610, f630, f640, f698) |
| SH14-CUT | SH13 holding frames are opaque black (f820, f864 full size; draft f0864 too). The pale olive monsters are the SH13 -> SH14 8 f dissolve f866-873: the incoming SH14 plate paints at alpha < 1 (`makePainter` `brush.fill(color, opacity * alpha)`), so its overlapping monster parts glaze translucent over SH13's black (DF-20261031-painted-opaque-cast, DF-20261029-painted-timeline-dissolve). SH14 +0 repaints SH13's end state (stage 1.12 about `SH13_PUSH_C`, `thCam(0.16, 0.20)`, cards at +99, fold 0), so the boundary is a continuous run: the dissolve is dropped from `DISSOLVE_IN` and f865 -> f866 shows no visible cut. **Plan change for Film/Editor:** storyboard row 14 "dissolve 8 -> cut" and the Editor W5.3 dissolve list now read "hard boundary (continuous run, as D8)". | `src/videos/edu-ep16/index.ts` | before `sheet-sh13-sh14-dissolve.png` (f864-874), after `sheet-sh13-sh14-after.png` (f864-874) |

Caption zone (`caption-zone.py --band 1176:1344`, clean plates, no captions): SH06 f340 mean 0.090 p95 0.363, SH09 f575 0.154/0.334, SH10 f630 0.152/0.296, SH11 f680 0.134/0.293, SH13 f820 0.155/0.363, SH13 f864 0.136/0.363, SH18 f1200 0.187/0.363: all pass (log `out/logs/ep16-w54-capzone.json`). Caption ink on the composition stills (`--shade-centre 1260`): f575 1189-1316, f630 1180-1329, f820 1182-1329, f340 1189-1329, f1200 1180-1316, all centred and in the safe zone (f680, f864 carry no caption); log `out/logs/ep16-w54-capink.json`.

Checks: `npm test` 683/683 pass (`out/logs/ep16-w54-npm-test.log`); `tsc --noEmit` 4 errors, all in untouched test files (`arm-depth`, `loudness`, `render-options`; `out/logs/ep16-w54-tsc.log`). Not verified: seek parity and the re-rendered draft (Editor re-renders); other shots with the label were checked only on f60, f340, f1200.

## Boss W5.5 re-time to EDU-EP16-SHEETS-R2 (2026-11-15, uncommitted tree on `79e111f`, no video rendered)

The read was slowed 5 % (user, 15 Nov 2026); every plate key in `src/painted/edu16` now follows the storyboard's "R2 re-time: old → new" and "Frame-driven numbers in code" tables (1800 f = 60.00 s, end hold 45 f, blip clock D9 from `blip-clock.json` R2, SH14 hard boundary at length 104). Repeatable edit: one exact-string replace script with per-string counts (0 mismatches).

| ID | Change | Files |
| --- | --- | --- |
| RT-CLOCK | `TOTAL` 1800; `SHOT_RANGES` R2; blip guard 33 spikes, last f672 (flat f675, missing f693, dim f693-699); `labelOn` 163/316/1495; `beadAt` 919/958/1073; comments (STK contact f1081) | `clock.ts`, `stage.ts` and `shot.tsx` (comments only) |
| RT-SHOTS | Every key in the code table: SH02, SH04, SH05, SH06, SH07, SH08, SH09, SH10 (`L / 36`), SH12, SH13 + `scenes-im.ts` (push/slide 6-103, hers, theirs, flicker 47/53/72/75/83/87), SH14 (cards at 104, truck 0-21/21-51, thCam 0-51), SH15 (dolly 42-97, swell 56-88, rise 62-93, arm 78-97, glow from 56, their light 56-73, opacity 62-78), SH16, SH17, SH18, SH19 (TREMBLE 98/99/100), SH22 (pan and lens 63-105, look-up 73-84), SH23 (crane 0-127); header comments carry R2 ranges and keys. SH01, SH03, SH20, SH21 code unchanged (comments only). | `shots/*.tsx`, `scenes-im.ts` |

Evidence (clean plates, `stills.mjs src/painted/edu16/build-index.tsx --props='{"guides":false,"tag":false,"label":false}'`, `out/edu16/w55/`):
- Identity: R1 end keys (rendered before the edit on the R1 clock) vs R2 end keys, same picture at 270 px, differences only the ambient clock: SH13 L98 vs f906 31.5 dB, SH14 L49 vs f958 30.6, SH15 L92 vs f1056 32.9, SH10 L44 vs f672 37.1, SH05 L82 vs L85 44.6, SH22 L100 vs f1600 43.3, SH23 L122 vs f1755 48.7. Sheet `sheet-identity.png` (before/after pairs).
- SH10/SH11 (`sheet-sh1011.png`: f665, 671, 672, 673, 674, 675, 692, 699): no spike f665-671, last spike f672-674 (1, 0.62, 0.28) with the push stopped dead on it, flat from f675, glow dimmed at f699.
- SH13/SH14 boundary (`sheet-sh1314.png`: f850, 900, 906, 907, 908): mean abs grey diff f906→f907 0.033 of 255 (f900→f906 0.223, f907→f908 0.309): continuous, no jump; monsters opaque black.
- SH15S (`sheet-sh15s.png`, 24 frames f1073-1096, `stk/`): frame-mean luminance (270 px) rise +8 −0.0013, +9 +0.0038, +10 −0.0030 (limit 0.08, max rise in the shot 0.0038), black +18..+23 at 0.043; contact f1081; identical to R1's numbers.
- SH22/SH23 (`sheet-sh22-23.png`): pan still at f1558 (+63), starts f1568, mid f1579, arrives f1600 (+105) and holds to f1627; crane end f1755 (+127) = hold f1778/f1799.
- Caption zone (`caption-zone.py --band 1176:1344`, log `out/logs/ep16-w55-capzone.txt`): 24 captioned frames (SH02 f90, SH10 f665, SH11 f690, SH13 f850/900/906, SH14 f919/940/958, SH15 f1000/1015/1037/1060, SH17 f1169, SH18 f1246, SH19 f1422, SH22 f1558/1600/1612, SH23 f1628/1692/1700/1755) pass, mean 0.108-0.227, p95 ≤ 0.368. **Fail: SH22 f1569-1581 (mid-pan, +74..+86), p95 0.67 (f1571-1576), 0.596 (f1579)**, mean up to 0.41 (`sheet-sh22-band.png`): the white logbook page sweeps through the band during the pan while C17 shows. Inherited from W5.2 r3 (R1 +70..+82 had the same picture, k is identical by ratio; round 3 measured only +61/+85/+100). Fixed by SH22-PANFALL below.
- `npm test` 681/683 (`out/logs/ep16-w55-npm-test.log`): the 2 failures are `src/videos/edu-ep16/index.ts` line 16 `TOTAL !== 1737` guard (Editor's file). `tsc --noEmit`: 5 errors, the same guard (TS2367) plus the 4 pre-existing test-file errors (`out/logs/ep16-w55-tsc.log`).

Editor must change in `src/videos/edu-ep16/` (not touched by Boss): `index.ts` guard `1737` → `1800` (message too), `labelOn` 156/302/1430 → 163/316/1495, header comment (R2, 1800 f, 60.00 s, 45 f hold), narration file → the re-locked placed R2 read; `DISSOLVE_IN` unchanged (SH06 12, SH07 8, SH08 12, SH13 12, SH16 12, SH18 14, SH19 12; SH14 none); `cues.ts` C01-C18 → the R2 cue table; `review-rows.json`/`narration-place.py`/`sound-mix.py` frames and the R1 draft cut are stale.

Not verified: seek parity, half-size draft cut, composition stills with captions and label (the composition does not load until the Editor guard changes); frames other than those listed.

**SH22-PANFALL (W5.5, coordinator: Requirement, fix):** `shots/S01-B05-SH22.tsx` paints `lowFalloff(p, 53090, 1100, fa)` after the pages, `fa = 110 * ramp(L, 66, 73) * (1 - ramp(L, 88, 98))` (off in measure mode). The falloff is 0 through +66 (approved start and the +63 pan start untouched) and from +98 (before the +105 arrival). Pan 63-105, lens, look-up 73-84 unchanged. Tried alpha 140 (band 0.05, too dark) and 80 (p95 0.453 at f1571-1573, fail).
- Caption zone (`--band 1176:1344`, log `out/logs/ep16-w55-sh22fix-capzone.txt`): f1495, f1560-1599 every 3 f, plus f1571-1576 and f1627. All 21 pass: worst p95 0.307 (f1571), mean 0.068-0.177.
- Unchanged frames: f1495 fixed vs unfixed 82.2 dB, f1627 87.6 dB. The approved W3 still `out/edu16/roof/v8/clean/SH22.png` vs f1495 is 24.5 dB both before and after the fix: the timed start was never pixel-equal to v8 (the W5.2 r3 full-roof plate tinted 0.45). The 78.2 dB in round 3 is the look still, not the timed shot. The fix does not change it.
- Sheet `out/edu16/w55/sheet-sh22-fix.png` (f1495, 1560, 1566, 1569, 1573, 1576, 1579, 1584, 1587, 1590, 1593, 1599, 1627, then unfixed f1574 for comparison).
- Visible side effect for Film: the falloff's wavy edge near y 1100 crosses the page as a shadow line (f1569-1579). Her lower body comes back up from dark over f1587-1597 while the camera still moves. Same falloff language as SH02/SH04/SH10.
- `npm test` 681/683 (`out/logs/ep16-w55-npm-test-2.log`; the 2 failures are the Editor guard). tsc unchanged (guard + 4 test-file errors).

## Editor W5.3 Draft re-render on EDU-EP16-SHEETS-R2 (2026-11-15, uncommitted tree on `79e111f`, final cut not rendered)

**Render stage: draft cut** (half size 540x960, `clips.mjs EDU-EP16-SHORT review-rows.json --full --draft`): 24 of 24 scenes repainted, 0 reused, 329 s, `out/EDU-EP16-SHORT/clips/_draft_cut.mp4` (1800 f = 60.00 s, audio muxed; log `out/logs/ep16-r2-draft-clips.log`); `review-rows.json` clips updated (page not rebuilt/published). W5.3 stays NOT passed (user's verdict).

Changes: `src/videos/edu-ep16/index.ts` (guard 1800, `labelOn` 163/316/1495, header, narration `narration-placed-v2.wav`, stem `draft-stem-v2.wav`); `cues.ts` (C01-C18 = R2 table, ranges verbatim; Thai unchanged; C09 +16 f over SH11, C12 +2 f into SH15); `narration-place.py` (v2 file 55.045 s cut at 22.412/33.899/45.854 s, offsets +0.80/+1.90/+2.60/+3.80 s -> `public/narration/EDU-EP16-SHORT-narration-placed-v2.wav`); `sound-mix.py` (every cue at Ton's R2 frame, TOTAL 1800, S02 n=1..32 muted f316-489 (24 blips sound), B03 blips from f571, S28 `_02` at f1497 with 1 f click guard only, M1 -3 dB step f735, dead f1091-1097 with M1 ramp 1083-1091 out and 1097-1111 in, S12 ends dead f693, S19/S18 end f1081, S20 f1081 -6 dB, A1-hum alone from f1785); `sound-cues.json` (`exempt` stem path -> v2; checks relaxed, see below). The R1 placed-v1 and stem-v1 files are untouched.

Narration check: placed file 2,880,000 samples = 1800.0 f; speech ends f1755.15. Source peak within +-0.15 s of each cut point 167 / 107 / 166 of 32767 (speech threshold 300): all three cuts sit in silence (L14|L18 gap 22.22-22.61, L10|L08 33.57-34.23, L13|L15 45.59-46.12 s).

Checks: `npm test` 683/683 (`out/logs/ep16-r2-npm-test.log`; the 2 guard failures cleared); `sound-cues.py` pass (38 cues, 34 generated, 4 library, 0 swaps); `mix-levels.py` (`out/logs/ep16-r2-mix-levels.log`): voice speech -15.9 LUFS (integrated -16.1, TP -1.5); dV in speech bed 19.8, texture 23.8, accent 20.0, background 16.1; mix integrated -16.1, TP -0.3, mix minus voice -0.2 LU; 0 FAIL, 5 warn: B01 bed 20.4, B02 bed 20.7, B04 bed 21.6 (above 20, bed quieter than target, M1 -3 dB step is the user's), B03 background 13.3 (blips 12 under, user's floor vs the 15 row), B05 S20 peak 4.8 (mix gain -6 dB is the user's). Capped to -3 dBFS peak: S25 (f1452, -1.5 dB), S27 (f1478, -12.2 dB). Draft mp4 audio RMS (`qa/r2/draft-audio.wav`): f1091-1097 -70.5 dBFS (stems -92, mp4 dither/codec), f693-735 -24.6 (drone + hum), f1785-1800 -25.9 (hum alone). Nothing listened.

Sheet rows edited by Editor in `sound-cues.json` checks (Ton to confirm or re-set): S21 peak max 3 -> 18 (measured 15.8), S25/S26 peak max 3 -> 6 (3.9), S27 peak max 3 -> 15 (12.6), all "stay soft as the first draft" (user, 15 Nov); S02 f21 gap row min 12 -> 6 (the S01 ping dV 0, f0-27, and the S03 gasp still ring in that 0.7-0.87 s window, so the row can never read "blip alone"; blip itself dV 14.5). S02 blip f126 mixed at dV 17.8 (not 14.5): the L02 onset makes the 400 ms meter read it 2.7 LU louder than set; at 14.5 the row (min 15) read 11.8. All other blips: dV 14.5 before f588 (B01/B02), 12.5 in speech from f588 (B03).

**Shot-by-shot check** (draft frames; sheets in `out/EDU-EP16-SHORT/qa/r2/`: `cuts-a.png`, `cuts-b.png` (every cut, last frame of old shot + first of new), `sh15s.png`, `wstop.png`, `sh22.png`, `caps.png` (C01-C18 mid frames), frames `qa/r2/f/fNNNN.png`): every cut lands on the R2 frame (30/119/163/234/316/400/489/571/636/675/731/803/907/959/1073/1097/1125/1171/1323/1450/1472/1495/1628); D8 SH04/SH05 (f233/234) and SH10/SH11 (f674/675) identical, no visible cut; SH13->SH14 (f906/907) identical, monsters opaque black, no dissolve; SH15S: arm reaches the light f1079-1081, ring brightens f1082, black from f1091 to f1096 (6 f), SH16 iris-in face f1097; W-STOP: last spike f672, decay f673-674, flat f675, trace dims f699, C09 ends f691, no caption f692-734, C10 starts f735; label top-right on f0-162 and f316-1494 only (off f163-315 and from f1495); captions C01-C18 each match their beat and phrase break (2-line breaks readable, C15-C18 authored breaks); SH22 pan f1566-1599: page sweeps down, falloff shadow line crosses it, C17 text stays legible over the lower dark part; SH23 crane with C18, hold to f1799.
Not verified: continuous neighbour review of every shot pair beyond the cut pairs above, seek parity (random/backward) in Studio, full-size frames other than the sample, listening. Possible defect for the user's eye: the "ป่านนี้…" C09 reads small at half size (not measured).
Sample (one story scene S01): SH13 f850, `out/samples/edu-ep16/EDU-EP16-SHORT/SHEETS-R2/S01_SH13_f850.png` (1080x1920; 540 px view `..._small.png`; composition EDU-EP16-SHORT frame 850, shot-local +47, integration sample, uncommitted tree on `79e111f`; repro `node scripts/render.mjs EDU-EP16-SHORT --stills --frames=850 --gl=angle`); label top-right, caption C11, mark top-left, monsters opaque. Not an approval.
