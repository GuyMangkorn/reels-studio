# EP16 sound cue sheet (Ton R1.5b, 2026-11-14)

Deliverable EDU-EP16-SHORT, EDU-EP16-SHEET-R1.5b, 30 fps, **2100 frames (70.0 s)** (R1 sheet re-timed through the R1.4 and R1.5/R1.5b tables; the R1.1 frames in the git history are superseded). Narration locked: ep16_narration_kore_x1.05.b56a7013.wav (not touched). Machine-readable twin: sound-cues.json (levels.checks per EP08b).

Gain column = starting gain in dB from the library master against a -15.5 LUFS voice reference; Editor trims by ear and mix-levels.py. Frame = global in-point of the file start. Nothing was heard by a human: picks are measured (tempo, pitch, onsets, loudness).

## Cues

| Cue | Shot | Frame | s | File (library ID) | Layer | Gain dB | Until f | Notes |
|---|---|---|---|---|---|---|---|---|
| A16-VN | SH01 | 0 | 0.00 | nature_village-night-insects_01 (loop) | B | -19.5 | 92 | crossfade to A-VM at f92 (0.5 s) |
| S16-WORM | SH01 | 0 | 0.00 | whoosh_sky-ripple-wormhole_01 | A | -17.0 |  | hum peak at 2.75 s (f82) vs +86 asked; overlaps L01 (f8-94): it plays 12 dB under the voice, the swell may rise to the voice level only after f94 (1 frame of gap) |
| A16-VM-a | SH02 | 92 | 3.07 | nature_village-morning-hens_01 (loop) | B | -19.5 | 217 | until f217 |
| M16-bed | SH02 | 92 | 3.07 | bed_isan-cheeky-phin-100bpm_01 | B | -19.5 | 1929 | R1.5b: one file from f92, runs to f1929 (file 62 s ends f1952); automation in the music map (stop f487, back f517, bass-only f377-443, SH15 held note f1283, OUT f1350 after fade f1333-1350, back f1624, hard stop f1929). Music-map frames moved: see sound-cues.md |
| S16-01 | SH02 | 97 | 3.23 | foley_flipflop-run-dirt_01 | T | -8.0 |  |  |
| S16-02 | SH02 | 122 | 4.07 | creature_hens-squawk-startled_01 | A | -5.5 |  |  |
| S16-27 | SH02 | 142 | 4.73 | creature_longneck-breath-rumble_01 | T | -22.0 |  | R1.5b catch-up: SH02 +60 = f152 is the swell; file onset 0.32 s so file start f142. Overlaps L02 (f110-211): texture 18 LU under the voice (-22 dB from master, file -11.7 LUFS). Invented creature foley. |
| A16-FE | SH03 | 217 | 7.23 | nature_forest-edge-insects_01 (loop) | B | -19.0 | 929 | f217-929 (R1.4) |
| S16-03 | SH03 | 219 | 7.30 | foley_fern-frond-push_01 | T | -10.5 |  |  |
| S16-28 | SH03 | 231 | 7.70 | creature_dragonfly-giant-pass_01 | A | -6.0 |  | R1.5b catch-up: SH03 +14-+52 = f231-269; file 1.41 s, buzz bursts 0.28-0.62 s (pass/hover) and 0.96-1.08 s (dart); overlaps V01 (f224-269): accent 12 LU under the voice. Peak -1 dBFS before gain; high band (centroid 5.7 kHz) may sit near the voice sibilants, Editor low-pass if it masks. |
| S16-04a | SH04 | 292 | 9.73 | ui_pong-lang-tick_01 | A | 0.0 |  |  |
| S16-04b | SH04 | 310 | 10.33 | ui_pong-lang-tick_01 | A | 0.0 |  |  |
| S16-04c | SH04 | 328 | 10.93 | ui_pong-lang-tick_01 | A | 0.0 |  |  |
| S16-04d | SH04 | 346 | 11.53 | ui_pong-lang-tick_01 | A | 0.0 |  |  |
| S16-30 | SH05 | 377 | 12.57 | creature_ankylosaur-forest-steps_01 | A | -6.0 |  | R1.5b catch-up: SH05 +0 = f377; file 2.74 s, thumps at 0.06, 1.16 and 2.24 s (three, not four; ~1.1 s apart), low band 94 %, little crunch or munch energy above 200 Hz (hi 1 %): the leaf crunch and munch read weak by numbers. Runs to about f459; overlaps L04 (f377-437) and V02 start (f450): 12 LU under the voice. Invented creature foley. |
| S16-05a | SH05 | 411 | 13.70 | whoosh_reverse-shimmer-petal_01 | T | -14.5 |  | shimmer swell peaks at 0.7 s into the file: start the file 21 f before the fade ends if the swell must land on the last frame |
| S16-05b | SH05 | 417 | 13.90 | whoosh_reverse-shimmer-petal_01 | T | -14.5 |  |  |
| S16-05c | SH05 | 423 | 14.10 | whoosh_reverse-shimmer-petal_01 | T | -14.5 |  |  |
| S16-05d | SH05 | 429 | 14.30 | whoosh_reverse-shimmer-petal_01 | T | -14.5 |  |  |
| S16-06 | SH06 | 488 | 16.27 | action_slap-back-of-hand_01 | A | 0.0 |  | M16 stops dead at f487 one frame before this; lands at V03 onset (f488): hold the voice at its level, slap at most 12 LU under it |
| S16-07a | SH06 | 493 | 16.43 | foley_seeds-patter-leaves_01 | T | -3.5 |  |  |
| S16-sleeve | SH07 | 519 | 17.30 | foley_sleeve-swish_01 | T | -13.0 |  |  |
| S16-08 | SH08 | 677 | 22.57 | creature_longneck-chew-leaves_01 (loop) | T | -7.5 | 781 | loop 7.6 s; run to f781, resumes at shot 10 f888 until f909 |
| S16-09 | SH08 | 737 | 24.57 | creature_giant-nasal-breath_01 | A | -18.0 |  |  |
| S16-10 | SH09 | 785 | 26.17 | foley_seeds-rattle-palm_01 | T | -8.5 |  |  |
| M16-run | SH09 | 790 | 26.33 | stinger_phin-upward-run_01 | A | -13.0 |  | music micro-cue; the bed stays under |
| S16-11 | SH10 | 857 | 28.57 | whoosh_seed-toss-small_01 | T | -9.0 |  |  |
| S16-07b | SH10 | 873 | 29.10 | foley_seeds-patter-leaves_01 | T | -3.5 |  |  |
| S16-08b | SH10 | 888 | 29.60 | creature_longneck-chew-leaves_01 (loop) | T | -7.5 | 929 | until f929 (R1.4 SH10 stretch) |
| S16-29 | SH10 | 891 | 29.70 | foley_seedcone-crunch-jaws_01 | A | -7.5 |  | R1.5b catch-up: SH10 +48 = f891; file onset 0.02 s. Overlaps L06b (f843-903): 12 LU under the voice. Bursts from 0.02 to 0.34 s read as one chew; not heard. |
| S16-29b | SH10 | 913 | 30.43 | foley_seedcone-crunch-jaws_01 | A | -9.0 |  | R1.5b catch-up: f913; 3 f before V05 (f916-953), 1.5 dB under the first. Same file (Film allowed same file or variant). |
| A16-VM-b | SH11 | 929 | 30.97 | nature_village-morning-hens_01 (loop) | B | -19.5 | 1350 | f929-1350 (R1.4); shot 14 (granary f1202-1283) -6 dB, shots 12-13 +3 dB for the wind |
| S16-31a | SH11 | 929 | 30.97 | creature_ankylosaur-paddy-step_01 | A | -8.0 |  | R1.5b catch-up: plant at SH11 +6 = f935; file plant 0.2 s (6 f) so file start f929. Overlaps V05 (f916-953): 12 LU under the voice. Invented creature foley. |
| S16-31b | SH11 | 944 | 31.47 | creature_ankylosaur-paddy-step_01 | A | -8.0 |  | R1.5b catch-up: plant f950, file start f944. |
| S16-31c | SH11 | 959 | 31.97 | creature_ankylosaur-paddy-step_01 | A | -8.0 |  | R1.5b catch-up: plant f965, file start f959; L07 starts f968. |
| S16-12 | SH11 | 975 | 32.50 | action_hoe-thunk-mud_01 | A | -4.5 |  | R1.4 re-time (was f949) |
| S16-31e | SH11 | 975 | 32.50 | creature_ankylosaur-huff-shake_01 | A | -6.5 |  | R1.5b catch-up: huff at SH11 +50 = f979, file huff 0.14 s so start f975; the shake lands at file 0.34-0.44 s = f985-988, 10 f EARLIER than the asked f995-1001 (the file is one take): Editor may split or delay it. Overlaps L07: 12 LU under. Invented creature foley. |
| S16-31d | SH11 | 985 | 32.83 | creature_ankylosaur-paddy-step_01 | A | -9.0 |  | R1.5b catch-up: plant f991, file start f985; 1 dB under steps 1-3 (stretch beat). Overlaps the huff tail. |
| S16-32 | SH12 | 1024 | 34.13 | nature_paddy-day-night-cycle_01 | B | -12.5 | 1128 | R1.5b catch-up: SH12 +0-+102 = f1024-1126; file 3.5 s (to f1129), 300 ms fade out. Second attempt (cfg 4) because the first four candidates were all low-frequency rumble with no birds; the pick alternates dark (centroid 0.8-1.1 kHz) and bright (3-3.8 kHz) segments by number only, so night/day alternation and the wind are UNVERIFIED. Overlaps L07/V08: bed row, 15 LU under the voice (file -18.0 LUFS, -12.5 dB). A16-VM-b is still planned through this shot: Editor may duck it -6 dB while this plays. |
| S16-13 | SH12 | 1052 | 35.07 | foley_calendar-page-rips_02 | A | -11.0 |  | R1.4 re-time (was f996) |
| S16-14 | SH13 | 1126 | 37.53 | foley_teak-door-creak_01 | A | -8.5 |  | R1.4 re-time (was f1070) |
| S16-33 | SH13 | 1136 | 37.87 | foley_rice-grain-trickle-sill_01 | T | -6.0 |  | R1.5b catch-up: SH13 +10 = f1136; file 0.82 s, grain ticks from 0.04 to 0.62 s. Falls in the gap f1129-1146 and its tail runs 15 f under L07b (f1146): about 10 LU under the voice peak, texture row applies there. |
| M16-tada | SH13 | 1156 | 38.53 | stinger_pong-lang-tada_01 | A | -8.5 |  | R1.4 re-time (was f1100) |
| S16-15a | SH14 | 1212 | 40.40 | foley_burlap-string-pull_01 | T | -9.0 |  | R1.4 re-time (was f1156) |
| S16-16 | SH14 | 1252 | 41.73 | foley_rice-sack-thud_01 | T | -10.5 |  | R1.4 re-time (was f1196) |
| S16-17 | SH14 | 1262 | 42.07 | foley_rice-pour-shell_01 | T | -11.5 |  | R1.4 re-time (was f1206) |
| A16-RV | SH16A | 1350 | 45.00 | water_river-pebbles-babble_01 (loop) | B | -19.0 | 1624 | R1.5: loop f1350-1624 (274 f); silence-drop automation: from f1366 -18 dB (flow only) until f1494, then back to 0 dB by f1504 |
| S16-18 | SH16A | 1352 | 45.07 | water_net-splash-river_01 | A | 0.0 |  | 16A +2 net lift; second use is S16-18b at f1510 |
| S16-37 | SH16A | 1367 | 45.57 | creature_pterosaur-flock-takeoff_01 | A | -13.0 | 1384 | file 1.41 s, flaps from 0.1 s; starts 1 f after the silence drop (f1366); fade out by f1384 with its own 150 ms fade |
| S16-45 | SH16A | 1378 | 45.93 | foley_reed-wade-scramble_01 | T | -9.0 | 1405 | asked -20 dB under the silence drop: read as the layer about 20 dB under the voice reference (file -26 LUFS -9 dB = about -35 LUFS vs voice about -15.5); fade out by f1405 (0.9 s window) |
| S16-41 | SH16B | 1390 | 46.33 | tension_heartbeat-soft-rise-72_01 | T | -10.0 | 1498 | file 3.8 s, 71 per minute (0.85 s per beat), rises 5 dB across the file; 16B +0 to 16D +38 = f1390-1498 (3.6 s): cut the file at f1498 with a 20 ms fade (stops dead, last beat falls at about f1496); soft ceiling >= 12 dB under V09 |
| S16-38a | SH16B | 1394 | 46.47 | creature_theropod-footfall-mid_01 | A | -8.0 |  | 16B +4 thud 1; invented creature foley; file 0.93 s, hit at 0.1 s so start the file at f1391 to land the hit on f1394 |
| S16-38b | SH16B | 1403 | 46.77 | creature_theropod-footfall-mid_01 | A | -6.0 |  | hit on f1406 (file start f1403) |
| S16-40 | SH16C | 1416 | 47.20 | foley_fern-body-push-far_01 | T | -9.0 |  | 16C +4..+16 (f1416-1428), file 1.06 s |
| S16-42 | SH16C | 1424 | 47.47 | creature_theropod-sniffs-deep_01 | A | -6.0 |  | sniffs at file 0.55 s and 0.95 s (0.4 s apart), exhale from 1.1 s: file start f1424 puts sniff 1 on f1440, sniff 2 on f1452, exhale on f1457 (asked 1456); invented creature foley; own generation, time-stretched x1.3 for the 12 f sniff spacing, never EP17 file |
| S16-38c | SH16C | 1429 | 47.63 | creature_theropod-footfall-mid_01 | A | -6.0 |  | hit on f1432 (est): Editor moves it to the visible plant (file start = plant frame - 3) |
| S16-38d | SH16D | 1471 | 49.03 | creature_theropod-footfall-mid_01 | A | -4.0 |  | hit on f1474 (file start f1471) |
| S16-43a | SH16D | 1487 | 49.57 | foley_boy-relief-exhale_01 | A | -14.0 |  | file 0.97 s, quiet shaky breath 0-0.25 s, main exhale from 0.45 s: start f1487 puts the exhale at f1500; overlaps V09 onset (f1504) for ~12 f, so it sits at -14 dB (about 12 LU under the voice) |
| S16-38e | SH16D | 1491 | 49.70 | creature_theropod-footfall-mid_01 | A | -8.0 |  | hit on f1494 (file start f1491) |
| A16-FE-ret | SH16D | 1494 | 49.80 | nature_forest-edge-insects_01 (loop) | B | -21.0 | 1624 | returns one by one: Editor ramps from -inf to start gain over f1494-1504, plays under SH16 until f1624, where A16-FI takes over |
| S16-38f | SH16D | 1499 | 49.97 | creature_theropod-footfall-mid_01 | A | -12.0 |  | hit on f1502 (file start f1499); V09 starts f1504: this tail is under the voice onset, keep it at -12 dB |
| S16-43b | SH16 | 1504 | 50.13 | foley_villagers-relief-sigh_01 | T | -15.0 | 1536 | SH16 +2 (f1506; file onset about f1507); overlaps V09 so 18 LU under the voice target: -15 dB from master |
| S16-18b | SH16 | 1510 | 50.33 | water_net-splash-river_01 | A | -9.0 |  | R1.5 second use; overlaps V09, so -9 dB from S16-18 master (the 16A use is at 0 dB) |
| S16-19 | SH16 | 1514 | 50.47 | creature_pterosaur-wing-rush_01 | A | 0.0 |  | R1.5: dive only (far circle pass cancelled): start f1514, fade out by f1544 |
| S16-20 | SH16 | 1551 | 51.70 | crowd_villagers-laugh-warm_01 | A | -14.0 |  | R1.5b catch-up: laugh at SH16 +60 = f1564, file onset 0.42 s so file start f1551; file 1.76 s, runs to f1604. Overlaps V09 (f1540-1592): wordless laughter under Thai speech, 14 LU under the voice (file -15.5 LUFS, -14 dB). No gesture or line credits the hiding (RV-26b). Laugh is the relief after the fear, not a tension cue. |
| S16-34 | SH16 | 1583 | 52.77 | creature_pterosaur-gulp-far_01 | A | -2.0 |  | R1.5b catch-up: gulp at SH16 +90 = f1594; file gulp onset 0.38 s (11 f) so file start f1583 (the first 0.38 s of the file is near-silent, overlapping the end of V09 f1592). File -22.4 LUFS, -2 dB so the 0.4 s event peaks inside the -6..+3 band (no speech overlap, 4 f before the M16-pizz button). Invented creature foley. |
| M16-pizz | SH16 | 1598 | 53.27 | stinger_pizz-button-comic_01 | A | -8.5 |  | R1.5: after the gulp; the only music between f1350 and f1624 |
| A16-FI | SH17 | 1624 | 54.13 | nature_campfire-night-crackle_01 (loop) | B | -19.0 | 1753 | f1375-1504 |
| S16-21 | SH17 | 1624 | 54.13 | foley_fish-grill-sizzle_01 (loop) | T | -7.5 | 1753 | f1375-1504 |
| S16-22 | SH17 | 1696 | 56.53 | foley_clay-bowl-slide-mat_01 | T | -8.5 |  |  |
| A16-VM-c | SH18 | 1753 | 58.43 | nature_village-morning-hens_01 (loop) | B | -19.5 | 2100 | f1504-1839 |
| M16-restate | SH18 | 1753 | 58.43 | stinger_phin-upward-run_01 | A | -13.0 |  | morning restatement; bed returns at f1753 in its normal level after the night variant f1624-1753 (-4 dB, low-pass 3 kHz) |
| S16-23 | SH18 | 1753 | 58.43 | creature_hens-content-coop_01 (loop) | T | -11.0 | 1874 | f1753-1874, then -6 dB to f1929 |
| S16-24 | SH18 | 1761 | 58.70 | foley_eggs-clink-apron_01 | T | -8.0 |  |  |
| M16-low | SH20 | 1818 | 60.60 | stinger_phin-low-note_01 | A | -11.0 |  | music micro-cue; bed holds a suspended chord |
| S16-25 | SH20 | 1818 | 60.60 | creature_hen-purr-trill_01 | A | -10.0 |  |  |
| S16-26 | SH20 | 1850 | 61.67 | creature_hen-claw-scratch_01 | T | -11.5 |  |  |
| S16-27b | SH21 | 1904 | 63.47 | creature_longneck-breath-rumble_01 | T | -28.0 |  | R1.5b catch-up: R1.5 f1914 is the swell; file start f1904. -28 dB = 6 dB under the first use (Film asked -12 dB; -22 minus 12 would be -34, a level at which it cannot be heard under L11, so Editor decides by ear between -28 and -34). Same file as SH02. |
| V06-cluck | SH22 | 2010 | 67.00 | creature_hen-cluck-single_02 | A | -8.5 |  | file 0.58 s (single cluck, about the 0.6 s slot f1761-1779), onset at 0.0 s; successor of _01 (0.1 s) |
| S16-41b | SH22 | 2029 | 67.63 | tension_heartbeat-soft-rise-72_01 | T | -14.0 | 2045 | file start f2029: first double beat at f2029-2034 (lub-dub 5 f apart; asked +100/+108); cut at f2045 with a 60 ms fade; the beat then at 2054 is cut; first beat is the quietest of the file |
| S16-38g | SH22 | 2046 | 68.20 | creature_theropod-footfall-mid_01 | A | -16.0 | 2056 | f2049 hit (file start f2046); -8 dB against the river thump, i.e. -16 dB from the master with the Editor low-pass 200 Hz so only the sub remains; fade out from f2052; labelled invented creature foley |
| S16-44 | SH22 | 2057 | 68.57 | foley_hen-beak-peck-single_01 | A | -12.0 |  | file is a 0.04 s tick (shorter than the 0.1 s asked; one peck); loudness LUFS is not measurable (too short), peak -1 dBFS before gain; place at f2057 (SH22 +128) |
| E-TAG | SH22 | 2065 | 68.83 | stinger_isan-series-tag_01 | A | 0.0 |  | R1.5: SH22 +136 = f2065, 35 f (1.17 s) to the end: the 3.5 s file is cut, fade out from f2090 so the first note and part of the ring remain (Editor) |

## Music map (Editor automation on the placed file)

| Where | Treatment | Why |
|---|---|---|
| M16-bed | f92 start, file 0 s | pickup: the file opens on its own three-note figure |
| f377-443 (shot 5) | bass only: low-pass 300 Hz and -6 dB | flowers fade |
| f487-517 | mute (hard cut at f487, 40 ms fade), back in at f517 at -3 dB | slap / comic stop; sh7 quieter |
| f781 | bed at normal level; M16-run on top |  |
| f909 | restart: no gap needed (file continues) | bouncy restart |
| f1146-1294 | keep; shot 15 (f1227) bed thins to one held note: -9 dB, low-pass 800 Hz | sigh beat |
| f1294-1375 | mute (W-RIVER, no music), pizz button at f1364 | comic gag |
| f1375-1504 | night variant: -4 dB, low-pass 3 kHz (same file) |  |
| f1504-1569 | normal; M16-restate at f1504 | morning |
| f1569-1625 | -4 dB, low-pass 1 kHz (suspended) | turn |
| f1625-1680 | normal (resolves) |  |
| f1680 | hard stop; silence under V10 except A-VM |  |

## Duck and silence rules

- Background and bed layers sit at least 15 LU under the voice while speech runs (levels.checks rows B01-B06); accents that overlap speech sit 12 LU under it, textures 18 LU.
- Accents with no speech overlap peak between -6 and +3 LU of the voice.
- Ambience beds crossfade at shot boundaries by 6-12 frames; loops are seamless (library loop files).
- Library files used: 49 (all generated for EP16-18; 10 added in the R1.5b catch-up; library path ~/ReelsStore/library/sound/<type>/<category>/<id>.wav).

## Lock commands (src/videos/edu-ep16 does not exist yet; run once Editor creates it)

```
for id in creature_ankylosaur-forest-steps_01 creature_ankylosaur-huff-shake_01 creature_ankylosaur-paddy-step_01 creature_dragonfly-giant-pass_01 creature_longneck-breath-rumble_01 creature_pterosaur-gulp-far_01 crowd_villagers-laugh-warm_01 foley_rice-grain-trickle-sill_01 foley_seedcone-crunch-jaws_01 nature_paddy-day-night-cycle_01 action_hoe-thunk-mud_01 action_slap-back-of-hand_01 bed_isan-cheeky-phin-100bpm_01 creature_giant-nasal-breath_01 creature_hen-claw-scratch_01 creature_hen-cluck-single_02 creature_hen-purr-trill_01 creature_hens-content-coop_01 creature_hens-squawk-startled_01 creature_longneck-chew-leaves_01 creature_pterosaur-wing-rush_01 foley_burlap-string-pull_01 foley_calendar-page-rips_02 foley_clay-bowl-slide-mat_01 foley_eggs-clink-apron_01 foley_fern-frond-push_01 foley_fish-grill-sizzle_01 foley_flipflop-run-dirt_01 foley_rice-pour-shell_01 foley_rice-sack-thud_01 foley_seeds-patter-leaves_01 foley_seeds-rattle-palm_01 foley_sleeve-swish_01 foley_teak-door-creak_01 nature_campfire-night-crackle_01 nature_forest-edge-insects_01 nature_village-morning-hens_01 nature_village-night-insects_01 stinger_isan-series-tag_01 stinger_phin-low-note_01 stinger_phin-upward-run_01 stinger_pizz-button-comic_01 stinger_pong-lang-tada_01 ui_pong-lang-tick_01 water_net-splash-river_01 water_river-pebbles-babble_01 whoosh_reverse-shimmer-petal_01 whoosh_seed-toss-small_01 whoosh_sky-ripple-wormhole_01; do
  f=$(ls ~/ReelsStore/library/sound/*/*/$id.wav); cat=$(basename $(dirname $f)); typ=$(basename $(dirname $(dirname $f)))
  python3 -I scripts/store.py use library/sound/$typ/$cat/$id.wav public/$( [ $typ = music ] && echo audio || echo sfx )/$cat/$id.wav --episode edu-ep16
done
```

## R1.5b notes (Ton, 2026-11-14)

- **Music map, R1.5b frames** (replaces the R1.1 map above, whose frames are shifted: shot 15 thins at f1283, bed out f1350): bass-only f377-443; mute f487-517 (back f517 at -3 dB); f929 restart; f1202-1283 keep; **f1283 thin to one held note (-9 dB, low-pass 800 Hz), fade out f1333-1350, silent until f1624** except the M16-pizz button at f1598; f1624-1753 night variant (-4 dB, low-pass 3 kHz); f1753-1818 normal with M16-restate at f1753; f1818-1874 -4 dB, low-pass 1 kHz; f1874-1929 normal; **hard stop f1929**.
- **Silence drop f1366 (automation, no file):** insects and chatter cut within 3 f (a cut, not a fade): A16-VM-b has already ended at f1350; A16-RV (the only bed left) goes to -18 dB from f1366 until f1494, then back to 0 by f1504; the insects return one by one as A16-FE-ret f1494-1504.
- **Invented creature foley (RV-27, RV-28b):** S16-38 (`creature_theropod-footfall-mid_01`) and S16-42 (`creature_theropod-sniffs-deep_01`) are made-up sounds, not recordings of a real animal. S16-42 is its own generation: it is not `creature_theropod-sniffs_01` (EP17) and not a pitch-shift of it. It was time-stretched x1.3 (tempo only) from its own raw take to fit the 12 f sniff spacing.
- **Footfall frames (hit frames; file start = hit - 3):** 1394, 1406, 1432 (est), 1474, 1494, 1502; SH22 +120 = 2049 as a low thump only (-16 dB from master, low-pass 200 Hz by Editor, i.e. -8 dB against the river thump; no sniff, breath or growl).
- **Pulse:** `tension_heartbeat-soft-rise-72_01`, 71 per minute, soft, stops dead at f1498; SH22 callback uses the file's first double beat only (f2029-2034), done by f2045 (+116).
- **No roar, no stinger, no jump-scare hit (RV-23a):** the levels `checks` encode it: accents and textures in f1350-1504 peak at least 12 LU under the voice level; the bed row is a `drop` row (>= 30 or silent).
- **Catch-up (2026-11-14):** S16-20, S16-27 (and its SH21 reuse S16-27b), S16-28, S16-29, S16-29b, S16-30, S16-31 R2 (a-e), S16-32, S16-33 and S16-34 are now in the sheet at R1.5b frames, 10 new files (`frame` = file start; the sync frame and the measured onset offset are in each Notes cell). S16-12 (f975), S16-19 (f1514, dive only) and M16-pizz (f1598) were already in the sheet at R1.5b frames. S16-35, S16-36 R2 and the R1.5-cancelled far circle pass stay cancelled. Guards RV-23..RV-33: no roar, stinger or sudden peak was added; the new creature sounds (S16-27, S16-30, S16-31, S16-34) are invented foley and labelled so; the f1350-1504 stretch gets no new file.
- **sound-cues.py:** the 16 new-sound cues report "not in the timeline" until Editor adds them to sound-mix.py/the timeline; nothing else fails.
- **Locks (R1.5b files):** run `python3 -I scripts/store.py use library/sound/sfx/<category>/<id>.wav public/sfx/<category>/<id>.wav --episode edu-ep16` (done for the nine new files; `src/videos/edu-ep16/assets.lock.json` updated).
