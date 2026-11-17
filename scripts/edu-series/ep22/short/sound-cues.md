# Sound cue sheet: EDU-EP22-SHORT (EDU-EP22-SOUND-R1)

Ton, W5.2s, 2026-11-16. Inputs: scene sheets EDU-EP22-SCENES-R1, narration measure EDU-EP22-NARRATION-MEASURE-R2 (1717 f @ 30 fps, voice locked), Film brief BRIEF-R2 sound direction. Machine-readable twin: `sound-cues.json` (same cues; `levels.stems` empty until Editor exports the draft stems). Every sound is **generated, measured, not listened to by a human**. Library root: `~/ReelsStore/library/sound/`.

Frame = composition frame G at 30 fps. `gain` is a **starting** gain in dB relative to the library master (SFX peak -1 dBFS; beds -14 LUFS), estimated so the layer sits at the EP08b distance under a voice near -16 LUFS; `mix-levels.py` on the draft stems decides. Fades are in ms. `out` is where the sound must be silent by (hard cuts = no tail).

| Cue | Shot | In (G) | Out (G) | File (library id) | Gain dB | Fade in/out ms | Pins to | Notes |
|---|---|---|---|---|---|---|---|---|
| A1-a | B01-SH01 | 0 | 886 | `ambience/room/room_palace-hall-late-morning_01` | -22 | 0/0 | G0 start; loops (12.5 s file, 1.5 s crossfade built in) to the hard cut at the chapter change G886 | Hard cut to A2 at G886 (no fade). Hall bed lives under SH01-SH12. |
| M1-a | B01-SH01 | 0 | 183 | `music/bed/bed_court-pizz-zither-playful-104_01` | -19 | 0/120 | G0 under L01 "คุณต้องชิมก่อนทุกจาน"; cuts to near-silence at G183 on "ไม่แตะ" (L02 onset G183) | File offset 0 s (bar line). Fade out 120 ms ending exactly at G183 so S1 is alone. No intro: narration from frame 8. |
| S2-SH02 | B01-SH02 | 40 | 74 (file end) | `sfx/foley/foley_silver-cover-lift-scrape-ring_01` | -9 | 0/0 | l3 (G40): taster lifts the cover (L01 speech, POV) | Scrape first, ring at +0.7 s. Texture over speech: keep >=18 LU under the voice. |
| S4-SH02 | B01-SH02 | 87 | 115 (file end) | `sfx/foley/foley_spoon-sauce-dip-drip_01` | -9 | 0/0 | l50 (G87): spoon dips on "คุณต้องชิม" (L01 anchor G85) | Dip at +0.0, lift +0.19, drip +0.78 s. |
| S2b-SH02 | B01-SH02 | 121 | 132 (file end) | `sfx/foley/foley_silver-cover-setdown_01` | -9 | 0/0 | l84 (G121): cover set back down at end of L01 |  |
| S1 | B01-SH03 | 183 | 190 (file end) | `sfx/foley/foley_porcelain-spoon-tick_01` | -9 | 0/0 | l43 (G183): dry porcelain tick on "ไม่แตะ" while M1 cuts to near-silence | Tick is 0.21 s; M1-a must be out by G183. |
| S5 | B01-SH03 | 228 | 377 | `sfx/foley/foley_cloth-shoes-trays-approach_01` | -20 | 0/300 | l88 (G228): tray procession starts off-screen right under the end of L02, grows through SH04, ends under SH05 | GAIN AUTOMATION: -20 dB at G228 rising to -9 dB at G274 (SH04 "steps grow"), hold to G364, fade out 300 ms by G377. 8 steps 0.54 s apart: steps at about G244, 261, 277, 293, 310, 326, 342, 359. |
| S7 (reuse) | B02-SH04 | 249 | 261 (file end) | `sfx/comedy/comedy_pluck-question-bend_01` | 0 | 0/0 | l5 (G249): comic question-pluck in the gap before L03 (L03 onset G263), under the child V01 "huh?" | LIBRARY REUSE (0.4 s, rises about 495 to 742 Hz, B4 up to a high G/F#: inside D major). Gap accent; V01 (Editor casting) lands on it. |
| S6-1 | B02-SH05 | 338 | 371 (file end) | `sfx/foley/foley_tray-set-down-a_01` | -9 | 0/0 | l64 (G338): first tray set down | Four different takes (a,b,c,d) at 14-frame spacing; tails overlap; fade 120 ms already in files. |
| S6-2 | B02-SH05 | 352 | 384 (file end) | `sfx/foley/foley_tray-set-down-b_01` | -9 | 0/0 | l78 (G352): second tray |  |
| S6-3 | B02-SH05 | 366 | 387 (file end) | `sfx/foley/foley_tray-set-down-c_01` | -9 | 0/0 | l92 (G366): third tray |  |
| S6-4 | B02-SH05 | 380 | 404 (file end) | `sfx/foley/foley_tray-set-down-d_01` | -9 | 0/0 | l106 (G380): fourth tray |  |
| M1-b | B02-SH06 | 403 | 496 | `music/bed/bed_court-pizz-zither-playful-104_01` | -19 | 150/200 | l3 (G403): M1 returns bouncy on "ราว ๆ" (L04 anchor G406), runs to the M1b crossfade | File offset 0 s (bar line). Crossfade into M1b over G496-502. |
| S8 | B02-SH06 | 413 | 430 (file end) | `sfx/comedy/comedy_pluck-pop-round_01` | -6 | 0/0 | l13 (G413): round comic pop on "ยี่สิบ" (L04 anchor G406 for "ราว ๆ ยี่สิบจาน") | Lands on the number word: it is the story beat but it fights the 20 LU rule for numbers; level kept low (see checks). |
| M1b | B03-SH07 | 496 | 846 | `music/bed/bed_court-ceremonial-brisk-104_01` | -19 | 200/500 | l40-46 (G496-502): M1 to M1b crossfade, established on "โต๊ะยาวนั่น" (L05 anchor G502) | File offset 0 s; file has a 4 dB fade-in ramp in the first 4 s that helps the crossfade. M1b peaks under S3 (G800). Crossfade to M1-d at G846 over 500 ms. |
| S2-SH08 | B03-SH08 | 566 | 600 (file end) | `sfx/foley/foley_silver-cover-lift-scrape-ring_01` | -9 | 0/0 | l4 (G566): cover lifted on "ดูก่อนนะ" (L06 onset G565) |  |
| S4-SH09 | B03-SH09 | 689 | 717 (file end) | `sfx/foley/foley_spoon-sauce-dip-drip_01` | -9 | 0/0 | l15 (G689): spoon dips on "ชิม" | Spoon onto SAU later: no cue (do not echo S1). |
| S2b-SH09 | B03-SH09 | 728 | 739 (file end) | `sfx/foley/foley_silver-cover-setdown_01` | -9 | 0/0 | l54 (G728): cover set back down |  |
| S3 | B03-SH11 | 800 | 866 (file end) | `sfx/foley/foley_silver-covers-ripple-left-to-right_01` | -6 | 0/0 | l0 (G800): lid ripple cascade left to right, on "เปิดฝา!" (L07 anchor G784, voice ends G806) | RECONSTRUCTED sound (research open item 5): no historical record of the sound. Hard pan sweep L 12 dB louder to R 6 dB louder over about 1.6 s is baked in. Peak energy at about +0.3 to +1.2 s. |
| M1-d | B03-SH12 | 846 | 886 | `music/bed/bed_court-pizz-zither-playful-104_01` | -19 | 500/60 | l0 (G846): M1 settles warm and confident out of M1b | File offset 18.46 s (8 bars in, a bar line). Fade out 60 ms ending at G886, with the A1 hard cut. |
| S9 | B03-SH12 | 852 | 884 (file end) | `sfx/ui/ui_checkpoint-chime-rising-three_01` | -6 | 0/0 | l6, 16, 26 (G852, 862, 872): three warm chime ticks rising, one per glint (tag, spoon, lid) | ONE file: three ticks at +0, +0.32, +0.67 s (G852, G862, G872 within 1 frame). Over L08 speech (G823-880): keep it low, accent cue under 2 s. |
| A2 | B04-SH13 | 886 | 1225 | `ambience/room/room_small-clinical-hum_01` | -22 | 0/100 | G886 hard cut A1 to A2 at the chapter change; A2 only through the silence G1211-1225 | Loop (7 s file, 1 s crossfade built in). Hard cut at G1225 to A1-b (5 f after the picture cut). |
| M2 | B04-SH13 | 888 | 1211 | `music/tone/tone_bowed-bass-drone-d_01` | -20 | 150/700 | l2 (G888) single low held bowed-bass note under L09-L12; fades out l46-67 (G1190-1211) after "เงินก็เฉย" | File 14 s: use 0-10 s then fade 700 ms to end G1211 (fade starts at about G1190). Fundamental about 36 Hz (sub-heavy); harmonics carry on phones. |
| S10 | B04-SH14 | 978 | 994 (file end) | `sfx/foley/foley_silver-strip-egg-yolk_01` | -9 | 0/0 | l6 (G978): silver strip into soft yolk (L10 onset G974) |  |
| S11 | B04-SH14 | 990 | 1027 (file end) | `sfx/reveal/reveal_silver-tarnish-dull-fall_01` | -6 | 0/0 | l18 (G990): dull downward shimmer on "ทำเงินดำ" (L10 anchor G990), ends flat at G1031 | File 1.23 s = G990-1027. Hero cue. |
| S12 | B04-SH16 | 1152 | 1156 (file end) | `sfx/foley/foley_silver-strip-water-plink_01` | -14 | 0/0 | l8 (G1152): plink in the syllable gap, then silence after "เงินก็เฉย" (G1190 onset, voice ends G1211) | 0.125 s. Followed by near-silence (A2 only) G1211-1225. |
| A1-b | B04-SH17 | 1225 | 1717 | `ambience/room/room_palace-hall-late-morning_01` | -22 | 0/1000 | G1225 hard cut A2 to A1 (5 f after the picture cut, keeping the measured gap whole); runs to the end | Loop. Fade out over G1697-1717 (l237-257), 1000 ms ending at the last frame. |
| S13 | B04-SH17 | 1232 | 1240 (file end) | `sfx/ui/ui_checkpoint-chime-dimmed_01` | -12 | 0/0 | l12 (G1232): dimmed tag chime (S9 first chime pitched down, muted) under L13 | Derived in post from the S9 chime (same bell, down 2 semitones, low-passed). 0.25 s. |
| M1-frag-1 | B04-SH17 | 1244 | 1275 (file end) | `sfx/stinger/stinger_zither-pluck-d-a_01` | -10 | 0/0 | l24 (G1244): first of two plucks, the sparse M1 fragment |  |
| M1-frag-2 | B04-SH17 | 1256 | 1284 (file end) | `sfx/stinger/stinger_zither-pluck-d-b_01` | -10 | 0/0 | l36 (G1256): second pluck, a step higher | Same pluck +2 semitones. |
| M1-c | B05-SH18 | 1304 | 1537 | `music/bed/bed_court-pizz-zither-playful-104_01` | -19 | 300/400 | l12 (G1304): M1 returns on L14 onset (G1304); thins under the first half of SH20 (G1463-1537), out by G1537 | File offset 9.23 s (4 bars in). GAIN: -19 dB until G1463, ramp to -25 dB by G1537, fade 400 ms ending G1537 (start of the near-silence breath G1537-1552). |
| RISER | B05-SH18 | 1348 | 1525 (file end) | `sfx/stinger/stinger_riser-warm-chord-zither_01` | -12 | 0/300 | riser rises from l40 (G1332 intended; file is silent-ish for 0.5 s) into a warm chord at l49 (G1429) on "ไม่ได้ทำไว้กิน" (L15 anchor) | File chord attack at +2.70 s (81 f): placed at G1348 so the chord lands on G1429. Swell is built from a reversed decay (no generated take rose). Swell runs under L15 speech (G1384-1456): keep it low, then chord at accent level. |
| END1-1 | B05-SH20 | 1602 | 1687 (file end) | `sfx/stinger/stinger_zither-end-note1-d_01` | -4 | 0/0 | l142 (G1602): END1 note 1 on "จานตรงหน้าเขา" (L16 ends G1627) | Zither D4, 2.8 s, rings to G1686. First 0.8 s overlaps the end of L16. |
| S14 | B05-SH20 | 1630 | 1650 (file end) | `sfx/foley/foley_spoon-rice-bowl-taps_01` | -6 | 0/0 | l170 and l178 (G1630, G1638): two spoon-on-bowl taps, before END1 note 2 | One file: taps at +0 and +0.23 s (G1630, G1637). Hold: no speech. |
| END1-2 | B05-SH20 | 1647 | 1743 (file end) | `sfx/stinger/stinger_zither-end-note2-ring_01` | 0 | 0/0 | l187 (G1647): END1 note 2, left ringing to the end; nothing new after it | Single note about B4, 3.2 s with 500 ms fade, rings to G1743: Editor ends it with the A1 fade at G1717 (fade it from G1697). Hero cue. |

## Placement and duck notes for Editor

- **Beds:** A1 under SH01-SH12 and G1225-1717; A2 G886-1225; M1/M1b/M2 per the table. A1 to A2 at G886 is a hard cut; A2 to A1 at G1225 is a hard cut 5 frames after the picture cut (the measured gap G1211-1225 stays whole).
- **Music cut points:** M1-a out exactly at G183 (S1 alone); M1 stays near-silent G183-403 (S5/S6/S7 only); M2 out by G1211; no music G1211-1304 except the two frag plucks; M1-c out by G1537, then near-silence G1537-1552, then only A1 + END1.
- **Ducking:** the cue sheet gains already put beds about 18-20 LU under the voice, so no extra `duckUnderNarration` is needed on beds. SFX over speech (S2, S4, S2b, S10, S12, S13, S9, S11, S8, END1 note 1, riser) are texture/accents at low gain; judge with `mix-levels.py`.
- **Gap accents** (S7 G249, S3 first lifts G800-806, END1 note 2 G1647): near voice level, -6 to +3 LU. These are the only cues that may sit at voice level.
- **Hold G1627-1717:** A1 + END1 + the two S14 taps only. Nothing after note 2 (G1647). A1 fade G1697-1717.
- **Voice cues V01/V02:** not made (Editor's casting at voice lock; V02 dropped by Film).
- **Library files locked** for `edu-ep22` (`src/videos/edu-ep22/assets.lock.json`, 28 entries; the folder held only that file when I locked): run `python3 -I scripts/store.py fetch` in a fresh checkout. `public/` paths are in the JSON `src` field. Command log: `out/logs/ep22-lock.sh`.

## Generated vs library, and what was rejected

27 sound files generated (3 of them finished in post), 1 from the library, 35 cues.

| Cue family | Origin | Picked | Rejected (measured reason) |
|---|---|---|---|
| END1 note 1 | generated (3 takes) | v2: one onset, tail -40 dB at 2.66 s, darkest (centroid 870 Hz), D4 | v1 second onset at 1.96 s; v3 tail 1.82 s |
| END1 note 2 | generated (3 + 3 takes, 2nd round cfg 4) | round 2 v3: one onset, tail -40 dB at 4.89 s, about B4 | round 1 v1 (E5) rang only 1.46 s; round 1 v2/v3 thin (E6, centroid 2.8-3.2 kHz); round 2 v1 several onsets, v2 two onsets |
| S11 tarnish (hero) | generated (4 takes) | v2: spectral centroid falls 5654 to 1475 Hz, dead end at 1.2 s | v1 monotonic but smeared; v3, v4 not monotonic (v4 rises to 7684 Hz) |
| S2 cover lift (hero) | generated (4 takes) | v3: scrape then ring (onsets 0.07, 0.71 s), centroid 3847 to 2004 Hz | v1 low thud (536 Hz); v2, v4 4-6 onsets (busy) |
| S3 ripple | generated (3 + 3 takes, 2nd round cfg 4) | round 2 v3, panned in post (5-6 onsets 0.25 s apart over 1.2 s) | round 1 v1 only 0.89 s after trim, tight 5 onsets; others stereo-flat or one event |
| S5 procession | generated (3) | v1: 8 steps, interval sd 0.01 s, level rises -39 to -30 dB | v2 flat/receding; v3 uneven (sd 0.13 s) |
| S9 three chimes | generated (4) | v1: three onsets at 0/0.32/0.67 s, pitch peaks 3.7, 9.8, 11.7 kHz | v2 one onset, v3 two, v4 0.72/1.12 s |
| Riser + chord | generated (4) + post | v4 chord (loudest), swell = first 3.2 s reversed | none of the 4 takes rose; all decayed |
| M2 drone | generated (3 + 3, 2nd round cfg 4) | round 2 v2: steady -11.6 to -14.8 dB over 14 s | round 1: all decayed 20-27 dB; round 2 v1 swelled in and out; v3 bright |
| M1 / M1b / A1 / A2 | generated (3 each) | steadiest RMS (M1 v3 1.0 dB range, M1b v2 smallest ramp, A1 v2 3.0 dB, A2 v2 2.9 dB) | see library `selection` notes |
| S1, S2b, S4, S6a-d, S8, S10, S12, S14 | generated (3-4 each) | by onset count, tail and centroid; sidecars hold the reasons | |
| S13 | derived from S9 chime 1 (down 2 semitones, low-passed) | Film asked for the same chime pitched down | generated dim chimes rang 0.8-0.9 s (the brief says no ring) |
| S7 | **library reuse** `comedy_pluck-question-bend_01` | 0.4 s, tail bends 495 to 742 Hz, inside D major | no new generation made; fit note in the JSON |

Candidates of the three hero cues (END1, S11, S2) are in `~/ReelsStore/library/sound/_raw/ep22_end1_note1_v1..3.wav`, `ep22_end1_note2_v1..3.wav`, `ep22_end1_note2_b_v1..3.wav`, `ep22_s11_tarnish_v1..4.wav`, `ep22_s2_coverlift_v1..4.wav`. **None listened to.** User listening is still open (`listened: no`).

## Open risks

1. **No human has heard any file.** Measured shape only (onsets, tail, centroid trajectory, level range).
2. **S8 on the number word.** Film pins the pop on "ยี่สิบ"; EP08b wants 20 LU under the voice on a number. The sheet keeps the number-word window (10.7-13.5 s) at 20 LU and gives S8 an `exception` row (accent over speech min 12).
3. **Riser** is built from a reversed decay: its chord attack sits at about 2.7 s but the reversed swell may leave a faint "suck" before the chord. Check on the draft.
4. **M2 fundamental about 36 Hz**: nearly inaudible on phone speakers; its harmonics (centroid about 790 Hz) carry. Could be re-generated an octave up if it vanishes.
5. **A2** was -65 LUFS raw and is boosted +52 dB; its spectrum is mostly broadband air (centroid 8.7 kHz), not a hum. At the sheet's -22 dB it sits about -36 LUFS. Re-make if it sounds like hiss.
6. **S3** reconstructed (no historical record); panned in post; 5-6 distinct lifts, not 8-12.
7. END1 note 1's "low pizzicato root underneath" is not separately audible in the file (single zither note); END1 note 2 is B4, not E, so the interval reads as a sixth up.
8. Gains and `levels.checks` are estimates; `levels.stems` is empty until Editor exports draft stems. Layer names assumed: `bed` (music), `ambience`, `texture` (foley), `accent` (stinger/chime/pluck cues).
9. `src/videos/edu-ep22/` did not exist; I created it holding only `assets.lock.json`. `sources`/`video` in the JSON point there.
