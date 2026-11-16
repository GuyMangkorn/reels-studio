# Sound cue sheet — EDU-EP19-SHORT (EDU-EP19-SOUND-R1)

- **Deliverable:** `EDU-EP19-SHORT` (channel edu) · **Revision:** EDU-EP19-SOUND-R1 (Ton W5.2s, 2026-11-15) on scene sheets **EDU-EP19-SHEETS-R3**, brief EDU-EP19-BRIEF-R2, voice EDU-EP19-VOICE-R2 (narration and girl lines untouched).
- **Machine sheet:** [sound-cues.json](../sound-cues.json) (what `scripts/sound-cues.py` and `scripts/mix-levels.py` read; it carries the same cues plus `levels.checks`). This file is the readable copy Editor places from; if they differ, the JSON wins.
- **Clock:** G = composition frame at 30 fps, 1704 f; `l` = G − shot start. **G start** is the frame the file starts playing (its in-point is the file start unless an in-point is given). Lengths are processed file lengths; **End** is where Editor stops the cue (hard cap), `fade` is the fade-out to bake with that stop.
- **Counts:** 78 cue placements from **38 sound files**: **36 generated** (74 placements) and **2 library** (`bed_comic-pizz-marimba-pulse_01` for M1, `comedy_pluck-question-bend_01` for S09; 4 placements). No NEEDS-GEN left. Every file is filed in the library (`$REELS_STORE/library/sound/`) and locked for `edu-ep19` in [assets.lock.json](../../../../src/videos/edu-ep19/assets.lock.json) (files at `public/sfx/<category>/<id>.wav`, `public/audio/<category>/<id>.wav` for music and ambience).
- **Listening:** every file is `listened: no` (measured only). See "Please listen" below.
- **Layers for the mix and `mix-levels.py` stems:** bed = M1a/M1b/M1c/M2; ambience = A1, A2; texture = S01 S02 S03 S04 S07 S10 S10b S12 S16 S17 S22; accent = every other one-shot. Editor exports `voice`, `bed`, `ambience`, `texture`, `accent` stems into `levels.stems`. Glows are illustration only: **no sound or glow during W-WAIT (G676-721) except S12/S13/S14**, which are not glow tones.

## Cues in play order

| Cue | Sound ID | Shot (l) | G start | Len f | End G (fade) | Layer | Level | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | `nature_training-field-afternoon_01` | B01-SH01 (0) | 0 | 1800 | 1704 (24 f) | ambience | ambience: ~-6 dB under NAR, >=18 LU under the voice; carries the hold | 60 s file, one pass, no loop. Starts G0 and rides A_fade G1680-1704 (fade-out 24 f). Steady wind hush with faint birds; the far kid shout of Film G20 is not in this take (restraint under the voice). |
| S01 | `foley_dog-harness-jingle-trot_01` | B01-SH01 (0) | 0 | 42 | 42 (2 f) | texture | texture: >=18 LU under the voice while it speaks | 1.39 s, four jingle beats at 0.40-0.50 s spacing. Film suggested the library collar jingle (0.27 s tag): not used, a one-shot cannot bounce for 1.5 s. |
| S02 | `foley_dog-paws-patter-walk_01` | B01-SH01 (4) | 4 | 32 | 36 | texture | texture: >=18 LU under the voice while it speaks | 1.04 s, four pad steps at ~0.3 s. |
| M1a | `bed_comic-pizz-marimba-pulse_01 *(library)*` | B01-SH01 (7) | 7 | 1680 | 226 (6 f) | bed | bed: dV 18-20 under the voice (warn above 20); energy 2 = reference level | In-point 8 f (file 0.28 s, the first hit). Plays G7-G226, 6 f fade-out for the L02 pause. Energy plan on this segment: 2 (reference) until G332, see M1b. Bed beat 0.5775 s = 17.3 f, downbeats at file 1.14 s + 2.31 s k. in-point 8 f. |
| S03-1 | `creature_dog-sniff-quick_01` | B01-SH02 (0) | 48 | 9 |  | texture | texture: >=18 LU under the voice while it speaks | One 0.27 s file, same file x5 (Film asked per print; the double-sniff inner spacing is 0.08 s so each hit reads as one effort). Level: sniffs ride above the music but under the voice. |
| G1-print1 | `reveal_glow-tone-c-celesta_01` | B01-SH02 (2) | 50 | 15 | 62 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | Pitched set C6 D6 E6 G6 A6 (C plink resampled, measured): rising pentatonic = the true order. 0.4 s used of the 0.5 s file. |
| S03-2 | `creature_dog-sniff-quick_01` | B01-SH02 (24) | 72 | 9 |  | texture | texture: >=18 LU under the voice while it speaks |  |
| G2-print2 | `reveal_glow-tone-d-celesta_01` | B01-SH02 (26) | 74 | 15 | 86 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S03-3 | `creature_dog-sniff-quick_01` | B01-SH02 (48) | 96 | 9 |  | texture | texture: >=18 LU under the voice while it speaks |  |
| G3-print3 | `reveal_glow-tone-e-celesta_01` | B01-SH02 (50) | 98 | 15 | 110 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S03-4 | `creature_dog-sniff-quick_01` | B01-SH02 (72) | 120 | 9 |  | texture | texture: >=18 LU under the voice while it speaks |  |
| G4-print4 | `reveal_glow-tone-g-celesta_01` | B01-SH02 (74) | 122 | 15 | 134 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S03-5 | `creature_dog-sniff-quick_01` | B01-SH02 (96) | 144 | 9 |  | texture | texture: >=18 LU under the voice while it speaks |  |
| G5-print5 | `reveal_glow-tone-a-celesta_01` | B01-SH02 (98) | 146 | 15 | 158 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S04 | `creature_dog-sniff-slow-trio_01` | B01-SH03 (0) | 162 | 54 | 216 (3 f) | texture | texture: >=18 LU under the voice while it speaks | 1.79 s, three draws. M1 pauses G226 after these; sniffs end G216 so the beat of air before "รู้ได้ไง" (G226) is clean. |
| M1b | `bed_comic-pizz-marimba-pulse_01 *(library)*` | B01-SH04 (0) | 252 | 1680 | 676 (6 f); in 3 f | bed | bed: dV 18-20; energy plan relative to reference: 1.5 = -3 dB, 2 = 0, 2.5 = +1.5, 3 = +3 dB; under NAR/girl lines keep dV >= 18 | In-point 259 f (file 8.64 s, a beat; continuous bed clock would be 253). Plays G252-G676 (file 8.6-22.8 s, inside the C region). Energy ride: G318 +1.5 dB (pizz climbs), G332-399 -3 dB, G399 +3 dB easing to 0 by G443, G448-505 under V01, G508-566 reference, G566-591 -6 dB (sly two-note thinning with S09), G591-676 reference. Editor shapes the gain ride; Ton cannot raise the bed energy inside one file. in-point 259 f. |
| G1-arp | `reveal_glow-tone-c-celesta_01` | B01-SH04 (44) | 296 | 15 | 308 (4 f) | accent | accent over speech (L03 ends G323): >=12 LU; the arpeggio is soft, aim 18+ | Five tones 3 f apart (G296,299,302,305,308), each ~12 f; the whole arpeggio reads as ~0.5 s. |
| G2-arp | `reveal_glow-tone-d-celesta_01` | B01-SH04 (47) | 299 | 15 | 311 (4 f) | accent | accent over speech (L03 ends G323): >=12 LU; the arpeggio is soft, aim 18+ |  |
| G3-arp | `reveal_glow-tone-e-celesta_01` | B01-SH04 (50) | 302 | 15 | 314 (4 f) | accent | accent over speech (L03 ends G323): >=12 LU; the arpeggio is soft, aim 18+ |  |
| G4-arp | `reveal_glow-tone-g-celesta_01` | B01-SH04 (53) | 305 | 15 | 317 (4 f) | accent | accent over speech (L03 ends G323): >=12 LU; the arpeggio is soft, aim 18+ |  |
| G5-arp | `reveal_glow-tone-a-celesta_01` | B01-SH04 (56) | 308 | 15 | 320 (4 f) | accent | accent over speech (L03 ends G323): >=12 LU; the arpeggio is soft, aim 18+ |  |
| S05-turn | `foley_dog-harness-shake_01` | B01-SH04 (62) | 314 | 9 |  | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.28 s. |
| A2 | `city_soi-stall-dusk_01` | B01-SH04 (71) | 323 | 120 | 399 (9 f); in 9 f | ambience | ambience: warm, close, >=18 LU under the voice | Starts G323 so the 9 f fade-in covers the SH04 iris (G323-332); gone with the iris-out G390-399. 4 s file, plays 76 f. |
| S06 | `foley_wok-toss-sizzle-swell_01` | B01-SH05 (34) | 366 | 33 | 399 | accent | accent over speech: >=12 LU under the voice, cue <= 2 s; crest at G388 | MOVED from l50 (G382) to l34 (G366): the swell is 1.1 s with its crest at 0.75 s, so Film's G382 would be cut by the iris-out (G390-399) before the crest. At G366 the crest is G388 and the file ends G399 with the iris. Over L03b speech, keep soft. |
| S07-a | `foley_dog-paws-trot-grass_01` | B01-SH06 (0) | 399 | 37 | 436 (2 f) | texture | texture: >=18 LU under the voice while it speaks | 1.21 s, five beats at ~0.27 s. The library gallop-skid was not used (it ends in a skid; a clean trim of 0.8 s has only three beats). |
| G4-trail | `reveal_glow-tone-g-celesta_01` | B01-SH06 (10) | 409 | 15 | 421 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| G5-trail | `reveal_glow-tone-a-celesta_01` | B01-SH06 (30) | 429 | 15 | 441 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S08 | `creature_dog-pant-lick_01` | B01-SH07 (6) | 452 | 33 | 485 (3 f) | accent | accent over speech (V01): >=12 LU under the voice; keep under V01 | 1.09 s; the lick is the loud event at ~0.6 s (G470), pants around it. |
| S08b | `foley_child-sit-flop-grass_01` | B01-SH07 (44) | 490 | 7 | 497 | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.22 s; one event, no boom. |
| M1-flourish | `comedy_pizz-run-up-c_01` | B01-SH07 (56) | 502 | 24 | 525 (3 f) | accent | accent over silence/gap between V01 (ends G505) and L04: peak -6..3 LU | Four plucked notes C4 E4 C5 G5, the notes rise and land high on the 4th at ~0.5 s. Starts G502 as Film, 3 f before V01 ends: keep it at the voice-gap level, not louder. |
| S09 | `comedy_pluck-question-bend_01 *(library)*` | B02-SH01 (58) | 566 | 12 | 578 (3 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | Marks the "sly two-note figure" of Film: M1 thins -6 dB G566-591 (see M1b notes). One pluck, not two notes; Film may ask for the second note. |
| S10 | `foley_sneakers-patter-grass-sneaky_01` | B02-SH02 (0) | 591 | 87 | 676 (3 f) | texture | texture: >=18 LU under the voice while it speaks | 2.89 s (two takes crossfaded), ~10 steps. Film asked 3 s for l0-85 (2.83 s): file ends G678, Editor ends it G676. |
| S11 | `foley_stopwatch-click-far_01` | B02-SH02 (21) | 612 | 2 |  | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.04 s; a single click with a faint spring tick. Far: the Editor may lowpass 6 kHz -3 dB for distance. |
| S12 | `foley_stopwatch-tick-accelerate_01` | B02-SH03 (0) | 676 | 45 | 721 (3 f) | texture | texture in the W-WAIT gap: set by ear; keep under the whoosh S13 and under A1 swell, never over 6 LU above the voice | 1.47 s: 18 ticks from 0.2 s spacing down to 0.035 s (built from one generated tick; measured). W-WAIT is a designed gap. |
| S13 | `whoosh_time-air-soft_01` | B02-SH03 (2) | 678 | 33 | 711 | accent | accent in the W-WAIT gap: soft | 1.1 s with 0.45 s fade-in and 0.5 s fade-out baked in. No glow during W-WAIT (N4): this cue is audio only. |
| S14 | `vocal_child-yawn-sleepy_01` | B02-SH03 (18) | 694 | 27 | 721 (4 f) | accent | accent in the W-WAIT gap, far and soft; EXPERIMENTAL: not verified by ear | EXPERIMENTAL generated breathy yawn: measured as one smooth falling voiced exhale (~300 to 240 Hz over 0.8 s) with no clear inhale, so it may read as a sigh. User to listen; fallbacks in order: Gemini Leda vocal yawn by Editor (gemini-tts skill), else drop the cue (picture yawn stays). |
| S15 | `ui_toy-bell-smug_01` | B02-SH04 (44) | 765 | 13 | 778 (3 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.42 s. Film offered ui_notification-ding_01 only if soft and toy-like: it is a glassy phone ding (0.85 s) so a toy bell was generated instead. |
| S10b | `foley_sneakers-dash-grass_01` | B02-SH04 (60) | 781 | 12 | 793 | texture | texture: >=18 LU under the voice while it speaks (G781-796 is still under V03 speech) | 0.38 s, four quick taps; the receding feel is in the take (taps die down). |
| S17 | `foley_grass-muzzle-rustle-loop_01` | B02-SH05 (18) | 815 | 186 | 940 (8 f); in 6 f | texture | texture: >=18 LU under the voice while it speaks | 6.2 s loop file (800 ms crossfade); plays 125 f as one pass, no loop seam needed. |
| S05-sniff | `foley_dog-harness-shake_01` | B02-SH05 (20) | 817 | 9 | 826 (3 f) | accent | accent in the W-SNIFF silence: soft, peak at most 12 LU under the voice level; the silence must be felt | Same file as S05 -6 dB under it. |
| S16-1 | `creature_dog-sniff-long-deliberate_01` | B02-SH05 (24) | 821 | 33 | 853 (3 f) | texture | texture: >=18 LU under the voice while it speaks | 1.07 s x4 (same file); take the last two at -3 dB. |
| G1-sniff1 | `reveal_glow-tone-c-celesta_01` | B02-SH05 (26) | 823 | 15 | 835 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s; very soft, aim 20+ |  |
| S16-2 | `creature_dog-sniff-long-deliberate_01` | B02-SH05 (62) | 859 | 33 | 891 (3 f) | texture | texture: >=18 LU under the voice while it speaks |  |
| G2-sniff2 | `reveal_glow-tone-d-celesta_01` | B02-SH05 (64) | 861 | 15 | 873 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s; very soft, aim 20+ |  |
| S16-3 | `creature_dog-sniff-long-deliberate_01` | B02-SH05 (100) | 897 | 33 | 929 (3 f) | texture | texture: >=18 LU under the voice while it speaks; the last two sit under L05a (speech from G869): duck |  |
| G3-sniff3 | `reveal_glow-tone-e-celesta_01` | B02-SH05 (102) | 899 | 15 | 911 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s; very soft, aim 20+ |  |
| S16-4 | `creature_dog-sniff-long-deliberate_01` | B02-SH05 (130) | 927 | 33 | 959 (3 f) | texture | texture: >=18 LU under the voice while it speaks; the last two sit under L05a (speech from G869): duck |  |
| M1c | `bed_comic-pizz-marimba-pulse_01 *(library)*` | B02-SH06 (4) | 944 | 1680 | 1293; in 3 f | bed | bed: dV 18-20; energy 2.5 at G1100, 3 at G1163-1293; dip -12 dB over G1025-1037 (Film "held note" is not available) | In-point 104 f (file 3.45 s, a downbeat; the C/G region replayed because bed time 26-55 s leaves the key). Plays G944-G1293 with a HARD cut at G1293 (0 f fade, the sit). Dips: G989 -6 dB for V04, G1025-1037 -12 dB after "ยังได้อีก" (no held-note asset: the bed ducks instead, proposal to Film). in-point 104 f. |
| G3-climb1 | `reveal_glow-tone-e-celesta_01` | B02-SH06 (8) | 948 | 15 | 960 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S07-b | `foley_dog-paws-trot-grass_01` | B02-SH06 (10) | 950 | 37 | 987 (18 f) | texture | texture: >=18 LU under the voice while it speaks (L05b speech); fade to receding | Same file as S07-a; Editor pans right and fades -12 dB over the 37 f to read as receding. |
| G4-climb2 | `reveal_glow-tone-g-celesta_01` | B02-SH06 (14) | 954 | 15 | 966 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| G5-climb3 | `reveal_glow-tone-a-celesta_01` | B02-SH06 (20) | 960 | 15 | 972 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s |  |
| S18 | `comedy_wood-bonk-deflate_01` | B02-SH07 (34) | 1025 | 12 | 1037 (3 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.37 s; after "ยังได้อีก" (G1012) under the line tail. |
| S19 | `comedy_harp-idea-pluck_01` | B03-SH01 (50) | 1087 | 20 | 1107 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 0.66 s; sparkle tail rings under L07b. |
| S20 | `foley_mat-drag-foam_01` | B03-SH02 (40) | 1140 | 32 | 1170 (4 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | 1.04 s; V05 giggle file starts G1143 (Editor); the scrape runs under the giggle, V05 stays clear: keep S20 -6 dB from G1143. |
| S21-1 | `foley_mat-slap-grass_01` | B03-SH03 (0) | 1163 | 13 | 1176 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU | 0.40 s file, slaps 5 f apart overlap by design; the same file x4 (Editor may vary gain +-1.5 dB). |
| S21-2 | `foley_mat-slap-grass_01` | B03-SH03 (5) | 1168 | 13 | 1181 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU |  |
| S21-3 | `foley_mat-slap-grass_01` | B03-SH03 (10) | 1173 | 13 | 1186 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU |  |
| S21-4 | `foley_mat-slap-grass_01` | B03-SH03 (15) | 1178 | 13 | 1191 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU |  |
| S22 | `foley_sneaker-hops-mats_01` | B03-SH03 (18) | 1181 | 24 | 1205 (3 f) | texture | texture in the W-MATS gap, mid distance, soft; W-MATS has no voice | 0.80 s = 24 f, 13 pats at 62 ms (built from one generated tap). Film wrote 13 taps in l18-42 (0.8 s), which is a pat roll, not 13 distinct steps: flag to Film, the picture may need the hops spread over more frames or the cue reads as a drum roll. |
| S23a | `foley_mat-lift-flop_01` | B03-SH04 (2) | 1207 | 13 | 1220 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU | 0.43 s. |
| S23b | `foley_mat-lift-flop_02` | B03-SH04 (10) | 1215 | 14 | 1229 (3 f) | accent | accent in the W-MATS gap: peak -6..3 LU | 0.44 s; Film listed the same cue twice (G1207, 1215), a second take is used for the second. |
| S03-mats1 | `creature_dog-sniff-quick_01` | B03-SH05 (16) | 1251 | 9 | 1260 | texture | texture in the W-MATS gap: soft |  |
| G5-jumble1 | `reveal_glow-tone-a-celesta_01` | B03-SH05 (18) | 1253 | 15 | 1265 (4 f) | accent | accent in the W-MATS gap: soft, aim 6-12 under the voice level |  |
| S03-mats2 | `creature_dog-sniff-quick_01` | B03-SH05 (24) | 1259 | 9 | 1268 | texture | texture in the W-MATS gap: soft |  |
| G1-jumble2 | `reveal_glow-tone-c-celesta_01` | B03-SH05 (26) | 1261 | 15 | 1273 (4 f) | accent | accent in the W-MATS gap: soft, aim 6-12 under the voice level |  |
| S03-mats3 | `creature_dog-sniff-quick_01` | B03-SH05 (32) | 1267 | 9 | 1276 | texture | texture in the W-MATS gap: soft |  |
| G4-jumble3 | `reveal_glow-tone-g-celesta_01` | B03-SH05 (34) | 1269 | 15 | 1281 (4 f) | accent | accent in the W-MATS gap: soft, aim 6-12 under the voice level |  |
| S05-turn1 | `foley_dog-harness-shake_01` | B03-SH05 (38) | 1273 | 9 | 1282 | accent | accent in the W-MATS gap: soft, -6 dB from S05 | Same file as S05, -6 dB. |
| S05-turn2 | `foley_dog-harness-shake_01` | B03-SH05 (46) | 1281 | 9 | 1290 | accent | accent in the W-MATS gap: soft, -6 dB from S05 |  |
| S05-turn3 | `foley_dog-harness-shake_01` | B03-SH05 (54) | 1289 | 9 | 1298 | accent | accent in the W-MATS gap: soft, -6 dB from S05 |  |
| G4-tick1 | `reveal_glow-tone-g-celesta_01` | B03-SH06 (46) | 1353 | 15 | 1362 (3 f) | accent | very soft tick, aim 20+ under the voice (L08b speech) | Use the tone at -9 dB and 9 f long (the 0.5 s file is trimmed by endFrame). |
| G1-tick2 | `reveal_glow-tone-c-celesta_01` | B03-SH06 (50) | 1357 | 15 | 1366 (3 f) | accent | very soft tick, aim 20+ under the voice (L08b speech) |  |
| G5-tick3 | `reveal_glow-tone-a-celesta_01` | B03-SH06 (54) | 1361 | 15 | 1370 (3 f) | accent | very soft tick, aim 20+ under the voice (L08b speech) |  |
| G2-tick4 | `reveal_glow-tone-d-celesta_01` | B03-SH06 (58) | 1365 | 15 | 1374 (3 f) | accent | very soft tick, aim 20+ under the voice (L08b speech) |  |
| S24 | `creature_dog-whimper-huh_02` | B03-SH07 (12) | 1409 | 45 | 1454 (6 f) | accent | accent over speech: >=12 LU under the voice, cue <= 2 s | FIX 2026-11-15 (dog emotion unreadable): 0.93 s two-note whimper, low ~280 Hz then a rising second note ~600 to ~1200 Hz, reads as 'huh?'. Replaces `creature_dog-whine-question_01`. Alternates filed: `creature_dog-whimper-huh-soft_02`, `creature_dog-yipwhine-puzzled_02`. |
| M2 | `stinger_guitar-pizz-resolve-c_01` | B04-SH02 (46) | 1536 | 165 | 1701 (9 f) | bed | bed: dV 18-20 under L10; the chord ring (G1603-1640) may lift to dV 12 only if the mix stays at <= +2 LU over the voice | MOVED: the generated phrase lands its C major chord at 2.25 s (67 f), so the file starts G1536 (Film G1493) to land the chord at G1603.5. The chord rings ~2 s, under E1's first notes (E1 starts G1640), both in C. File is 5.5 s = 165 f, ends G1701. |
| E1 | `stinger_glow-motif-unscrambled_01` | B04-SH02 (150) | 1640 | 63 | 1703 | accent | accent in the hold gap: peak -6..3 LU; chord lands G1673 | TRIMMED to 2.1 s = 63 f (not 2.4): jumbled A C G D E at G1640-1655, rising C D E G A at G1659-1670, chord at G1673, 0.5 s fade baked in, ends G1703 inside the 64 f hold (before G1704). Its tail does NOT ride A_fade. Designed ending, not the EP02 tag. |

## Placement notes Editor needs

1. **M1 is one library bed played in three segments** on its own beat grid: M1a G7-226 (in-point 8 f), M1b G252-676 (in-point 259 f), M1c G944-1293 (in-point 104 f, hard cut at G1293 on the sit). In-points sit on beats/downbeats (bed 103.4 bpm, beat 17.3 f, downbeat at file 1.14 s + 2.31 s k) so each restart is on the groove. Only bed time 0-26 s is used because the bed leaves C after 26 s (glow tones, M2, E1 are in C).
2. **Moves from Film's frames (all to land a sound on its picture, no timeline change):** S06 G382 to **G366** (crest at G388 before the iris-out); M2 G1493 to **G1536** (its chord lands at 2.25 s into the file, so G1603 is hit); everything else is on Film's G.
3. **E1 length (asked):** trimmed to **2.1 s = 63 f**, G1640-1703, inside the 64 f W-HOLD; it does not ride `A_fade`. Chord at G1673; baked 0.5 s fade. A1 alone carries `A_fade` G1680-1704 (24 f).
4. **S14 yawn:** generated as a sound-effect-style breathy child yawn (`vocal_child-yawn-sleepy_01`, 0.9 s), measured only: one smooth falling voiced exhale (~300 to 240 Hz), no clear inhale, so it may read as a sigh. Order of fallback: user listens; if it fails, Editor makes a Gemini Leda vocal yawn (`gemini-tts` skill); if that fails too, **drop the cue** (the picture yawn stays). The cue is in the sheet so the check passes; mark it swapped or removed through `swaps`/Film if dropped.
5. **Same file placed several times:** S03 (x8), S05 (x5), S16 (x4), S21 (x4), S07 (x2), glow tones. Vary gain by about ±1.5 dB between repeats; no pitch change.
6. **Glow tones** are a pitched set, C6 D6 E6 G6 A6 (G1 to G5); the ladder in picture and sound is C-D-E-G-A in true order, jumbled where Film says (SH05 B03 high, low, high; SH06 B03 four ticks).
7. **Levels:** the cue sheet's `levels.checks` carries one set of rows per speech line (background >= 15 LU, bed warn above 20, ambience >= 18, texture >= 18, accent over speech >= 12), accent gap rows (M1 flourish, mat slaps, mat lifts, E1+huff in the hold) and `drop` rows (W-WAIT, W-SNIFF, the dead stop at G1293). V06 is a whisper: its rows measure against the whisper itself.

## Measured picks (candidates compared)

Each cue was generated with 3-4 candidates (seeds `seed+k`, raw files and sidecars in `library/sound/_raw/e19-*`). Tools: duration, peak, 20 ms RMS onsets and tail, spectral centroid, pitch contour (FFT), chroma for key. Highlights:

- **S01 harness:** v2 of 3, four beats evenly 0.39/0.45/0.42 s, lower centroid (8.2 kHz vs 9.7) than v1; v3 had 6 events.
- **S03 sniff:** v3 of 4 (double sniff at 0.11/0.19 s); trimmed to 0.27 s. **S16:** v4 of 4, long draw at 0.23 s then short ones.
- **S06 wok:** all four decayed instead of rising; v2 (steadiest) was shaped with a 0.7 s fade-in and 0.25 s fade-out to make the swell.
- **S12 ticks:** none of four accelerated; built one 70 ms tick from v2 into 18 ticks at 0.2 to 0.035 s spacing.
- **S22 pats:** Film's 13 taps in 0.8 s: built from one tap at 62 ms spacing (pat roll).
- **S24 whine:** v2 of 4 rises 312 to 845 Hz; the library candidate falls, rejected.
- **G tones:** v1 of 4 (C6, 1046 Hz measured, tail 0.34 s); D/E/G/A made by resampling +2/+4/+7/+9 semitones.
- **M2:** first run landed on G major; regenerated with "C major" in the prompt, v2 lands C-E-G at 2.25 s and rings (C 0.57 / G 0.33 / E 0.09 chroma over the ring).
- **M1:** library bed chosen over a new 46 s generation (3 candidates) because it is steadier (see `fit`).

## Fit notes for the library picks

- **M1 (`bed_comic-pizz-marimba-pulse_01`):** see the M1a `fit` field in the JSON: description match, tempo, steadiness, key limit 0-26 s.
- **S09 (`comedy_pluck-question-bend_01`):** a 0.4 s pizzicato pluck whose tail bends upward, exactly Film's description.
- **Film's other library candidates tested and not used:** `foley_dog-collar-jingle_01` (0.27 s collar tag, cannot carry 1.5 s of bouncing), `foley_fish-grill-sizzle_01` (grill not wok, 5.6 s loop), `creature_dog-sniff-snuffle_01` (carries a snort), `foley_dog-paws-gallop-skid_01` (ends in a skid), `ui_notification-ding_01` (glassy phone ding, not toy), `creature_dog-whine-puzzled_01` (falls, noisy lead-in).

## Open flags for Film or Editor

1. **S22 (B03-SH03):** 13 taps in 24 f is a pat roll; consider spreading the hops over more frames or accept the roll.
2. **"Held note" (B02-SH07 G1025):** no sound for it; M1c ducks -12 dB over G1025-1037 instead.
3. **S09 / "sly two-note figure" (B02-SH01 G566):** realised as one pluck plus M1 thinning -6 dB; say if you want a second note.
4. **HUFF dropped (user, 2026-11-15):** no dog sound at the ending; the cue, its lock entry and the `E1+HUFF` check label are removed (the file stays in the library).
5. **Kid's shout (A1 G20):** not in the take; the field bed is steady wind and faint birds so it stays under the narrator.
6. **Library filings were made before any ear check**; S14 is the only experimental one.
