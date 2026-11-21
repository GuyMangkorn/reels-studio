# EDU-EP32-SHORT sound cue sheet

Deliverable `EDU-EP32-SHORT` · scene sheets `EDU-EP32-SHEET-R1` · voice `EDU-EP32-VOICE-R2` (x1.00) · 30 fps, 1689 f · Ton, W5.2s, 2026-11-21 · machine-readable twin: [../sound-cues.json](../sound-cues.json) (the one `scripts/sound-cues.py` and `scripts/mix-levels.py` read).

Status: sounds made, measured and filed; **none listened to** (agents cannot listen; a measured pick is not an audio approval). Episode lock: `src/videos/edu32-gates/assets.lock.json` (44 files). Editor places exactly these, never edits the files; a different sound needs a swap entry approved by Film or the user.

## How to read

- **Frame** is the composition frame at which the **file starts**; the notes give the internal peak or hit time where the sync point is not the first sample. Files are `trim_silence`d so attacks sit at 0.0-0.1 s unless noted.
- **File** paths are the locked `public/` copies (gitignored; `python3 -I scripts/store.py fetch` fills them). Library IDs live in the asset store `library/sound/`.
- **Level** is the EP08b target, voice minus layer in LU, checked by `python3 -I scripts/mix-levels.py scripts/edu-series/ep32/sound-cues.json` after each draft cut (layers: `music`, `ambience`, `texture`, `accent`; `background` is the sum of all four). Absolute mix gains are Editor's; the files are peak -1 dBFS (sfx) or -14 LUFS (music, ambience).
- Music and effects sit **further under** the narration (EP30 precedent): aim 18 or more dV on music and ambience, not the 15 floor.

## Cue table

| Cue | Shot | Frame | File | Dur (s / f) | Origin | Level | Notes |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| M1 | B01-SH01 | 0 | `public/audio/bed/bed_spy-jazz-theme-full_01.wav` | file 7.63 s, plays 229 f | generated | bed: dV 15-20 over speech (warn above 20) | Section 1 of 6. Plays 0-229 and is CUT DEAD at G229 (file ends there, no fade). Attack on the first frame. Ducks under narration. Not listened. |
| M2a | B02-SH01 | 329 | `public/audio/bed/bed_spy-jazz-sly-bass-brushes_01.wav` | file 6.30 s, plays 189 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 329-518 (189 f exact). Stops for the G518-G527 dead air. Hold low under the line. Not listened. |
| M2b | B02-SH03 | 527 | `public/audio/bed/bed_spy-jazz-sly-bass-brushes_02.wav` | file 1.87 s, plays 56 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 527-583 (56 f exact), stops on "แต่" (B03-SH01 F9 = G583). Start on a bar line (cut at 4 bars of M2a source). Not listened. |
| M3 | B03-SH01 | 614 | `public/audio/bed/bed_spy-jazz-mission-ticks_01.wav` | file 2.77 s, plays 83 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 614-697 (83 f exact), drops out dead at G697 on "มันไป". Source pulse is steady, not rising: Editor may ride the gain up over the 2.8 s. Not listened. |
| M4 | B04-SH01 | 880 | `public/audio/tone/tone_bowed-bass-drone-d_01.wav` | file 6.40 s, plays 192 f | library | bed: dV 15-20 over speech (warn above 20) | Use 6.4 s of the 14 s file from its start; out at G1072 (B04-SH03 L0). Fade-in/out by Editor (EP08). Not listened. |
| M5 | B05-SH01 | 1133 | `public/audio/bed/bed_spy-brass-pompous-swell_01.wav` | file 7.40 s, plays 222 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 1133-1355 (222 f exact); the swell is in the file (1 s RMS -20 dB at 0-3 s to -10 dB at 7 s), so the library chorale was not layered. Cut dead at G1355 on "ว่า…". Not listened. |
| M6 | B06-SH01 | 1415 | `public/audio/bed/bed_spy-trumpet-lone-amused_01.wav` | file 5.60 s, plays 166 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 1415-1581 (166 f = 5.53 s; file 5.6 s with a baked 1.2 s fade-out). Editor pulls back on the "..." L89-L101. Not listened. |
| M7 | B06-SH02 | 1647 | `public/sfx/stinger/stinger_trumpet-lazy-tag-ending_01.wav` | file 0.96 s, plays 40 f (tail stretched in the mix) | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Start the file at G1647. Three notes at about 0.0 / 0.38 / 0.76 s of the processed file (measured on the raw take, lead trimmed), so about G1647 / G1658 / G1670 against Film 1647 / 1657 / 1667; the last bends down and the file is fully decayed at 0.96 s = G1676, 12 f before the end. Shorter than the 1.4 s Film planned. Draft round 1 (21 Nov 2026, user: the end sounds cut off): the file's last note carries a baked 70 ms fade (-6 to -52 dB in 80 ms, ends at 0.96 s = G1676), so the mix keeps it to 0.80 s and slows the last 0.16 s to 0.3x (bend-down and decay over about 0.53 s, 20 ms crossfade; derived file in out/), plays 40 f = G1647-G1687; file unchanged in the library. Not listened. |
| A1-B01 | B01-SH01 | 0 | `public/audio/room/room_office-night-lamp-hum_01.wav` | file 13.00 s, plays 328 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 0-328 (B01 whole; alone for 9 f before "แมว"). 13 s loop, 1 s seam crossfade baked. Source was near the noise floor and was normalized to -14 LUFS: expect hiss, keep it far under the voice. Not listened. |
| A1-B05 | B05-SH01 | 1131 | `public/audio/room/room_office-night-lamp-hum_01.wav` | file 13.00 s, plays 558 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 1131-1689 (557 f = 18.6 s: loop the 13 s file once and a half; the seam is crossfaded). Stays under B06 (no other ambience). Not listened. |
| A2 | B02-SH01 | 329 | `public/audio/outdoor/outdoor_park-birds-breeze_01.wav` | file 13.00 s, plays 285 f | library | bed: dV 15-20 over speech (warn above 20) | Plays 329-614 (fades out F24-F40 = G598-G614; lower in B02-SH02/03). Editor high-passes (about 900 Hz) and keeps it thin. Not listened. |
| A3 | B03-SH01 | 614 | `public/audio/nature/nature_training-field-afternoon_01.wav` | file 60.00 s, plays 379 f | library | bed: dV 15-20 over speech (warn above 20) | Plays 614-993 (379 f = 12.6 s; opens by F40, low in B03-SH04 and B04-SH01). Out at the corridor cut G993. Not listened. |
| A4 | B04-SH02 | 993 | `public/audio/room/room_corridor-fluorescent-hum_01.wav` | file 11.00 s, plays 138 f | generated | bed: dV 15-20 over speech (warn above 20) | Plays 993-1130 (B04-SH02 and SH03, 4.6 s; the 11 s file is not looped). Out on the cut to B05 (G1131); the office tone A1 opens there. Not listened. |
| C01-a | B01-SH02 | 113 | `public/sfx/foley/foley_pen-scratch-ping_01.wav` | file 0.22 s, plays 7 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Take a of 3 (CO1). Plays G113 (candidate v3 of 4). File is 0.22 s, shorter than Film 0.5 s. Not listened. |
| C01-b | B01-SH02 | 146 | `public/sfx/foley/foley_pen-scratch-ping_02.wav` | file 0.22 s, plays 7 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Take b (CO2) at G146 (candidate v1 of 4). Not listened. |
| C01-c | B01-SH02 | 185 | `public/sfx/foley/foley_pen-scratch-ping_03.wav` | file 0.39 s, plays 12 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Take c (CO3) at G185 (candidate v2, brightest of 4: zero-crossing 7.6 kHz vs 5.6-6.5 kHz). Not listened. |
| C02-a | B01-SH03 | 318 | `public/sfx/creature/creature_cat-mrrp-bored_02.wav` | file 0.50 s, plays 15 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G318-G333 (0.50 s = 15 f). Starts on L02's last frame (f318); body (0.22-0.36 s, at peak) ends ~G329 in the L02-L03 gap; soft decay 0.36-0.50 s (-10 to -28 dB re peak, 130 ms fade) runs <=0.17 s into L03 (f328), under -10 dB after 0.375 s. Loosened from 0.36 s by user decision (it ended at its peak). Library candidate `creature_cat-mrrp_01` not used: 0.64 s soft rising trill, tone "soft", not "unbothered, not friendly". New file generated from 4 candidates (ep32_c02c v3, picked by measured decay). Not listened. |
| C02-b | B06-SH02 | 1637 | `public/sfx/creature/creature_cat-mrrp-bored_02.wav` | file 0.50 s, plays 15 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Same 0.5 s soft-decay file as C02-a at G1637 (CL01 callback). Not listened. |
| C04 | B02-SH01 | 328 | `public/sfx/foley/foley_card-folder-slide-felt_01.wav` | file 0.25 s, plays 8 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G328 (L0). File 0.25 s. Not listened. |
| C05 | B02-SH01 | 332 | `public/sfx/foley/foley_card-flaps-popup-snap_01.wav` | file 0.52 s, plays 16 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G332 (L4). Candidate v3 of 3 (two snap events). Not listened. |
| C06 | B02-SH01 | 360 | `public/sfx/foley/foley_card-slot-slide_01.wav` | file 0.28 s, plays 9 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G360 (L32). Not listened. |
| C07 | B02-SH02 | 485 | `public/sfx/comedy/comedy_trumpet-smug-tada_01.wav` | file 0.33 s, plays 10 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G485 after "หรอก"; ends by G495. Hit in the gap, not on a word. Not listened. |
| C08 | B02-SH03 | 540 | `public/sfx/creature/creature_cat-yawn-squeak_01.wav` | file 0.58 s, plays 17 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G540 (L40); ends G557. Not listened. |
| C09 | B03-SH01 | 590 | `public/sfx/whoosh/whoosh_paper-sheet-fall-through_01.wav` | file 0.39 s, plays 12 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G590 (F16); file 0.39 s ends G602 (Film window F16-F32 = G606). Peak at 0.24 s. Not listened. |
| C10 | B03-SH02 | 640 | `public/sfx/electric/electric_radio-keyup-squelch_01.wav` | file 0.25 s, plays 8 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G640 (was G646; Draft round 1, 21 Nov 2026: the new L07 take starts at G648, so the click peak at 0.22 s moves from G652.6 to G646.6 = on the cut and the squelch ends at G648, before the voice; at G646 it sat on the voice onset and the voice+sound sum peaked at +3.8 dBFS), in the gap before the AGENT line. Click is at about 0.06-0.2 s; peak at 0.22 s. Candidate v4 of 4. Not listened. |
| C10b | B03-SH03 | 731 | `public/sfx/electric/electric_radio-squelch-out_01.wav` | file 0.29 s, plays 9 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G731 (2 f after the new L07 take ends at G729; was G739 on the old take, Draft round 1, 21 Nov 2026); ends G740. Not listened. |
| C11 | B03-SH02 | 654 | `public/sfx/electric/electric_radio-static-bed_01.wav` | file 2.65 s, plays 80 f | generated | texture: dV >= 18 over speech | G654-G733 (80 f; Film window G654-G739 = 85 f: 5 f short, the 300 ms fade-out covers it; C10b closes it at G739). Library `electric_radio-static-burst_01` does not fit (bursts decaying to silence after 1 s). Not listened. |
| C12 | B03-SH03 | 691 | `public/sfx/creature/creature_sparrow-flutter-chirp_01.wav` | file 0.53 s, plays 16 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G691 (L2); chirp peak at 0.38 s = G702 (Film chirp L12 = G701). Not listened. |
| C13 | B03-SH03 | 707 | `public/sfx/reveal/reveal_sun-shimmer-soft_01.wav` | file 0.64 s, plays 19 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G707 (L18); file 0.64 s (Film 0.8 s), peak at 0.36 s. 150 ms fade-out baked. Not listened. |
| C14 | B03-SH03 | 729 | `public/sfx/creature/creature_cat-paw-thump-turf_01.wav` | file 0.45 s, plays 13 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G729 (L40); thump at 0.04 s. Not listened. |
| C15-a | B03-SH03 | 769 | `public/sfx/creature/creature_cat-purr_01.wav` | file 5.43 s, plays 163 f | library | texture: dV >= 18 over speech | Use the first 5.43 s of the 9.45 s file, G769-G932 (163 f); fade in/out by Editor. Library purr pulses and dips; not steady. Not listened. |
| C15-b | B06-SH02 | 1583 | `public/sfx/creature/creature_cat-purr_01.wav` | file 3.50 s, plays 105 f | library | texture: dV >= 18 over speech | Use 3.5 s of the same file (source offset 5.0 s onward, away from the first cut), G1583-G1688. Editor raises it toward G1651. Not listened. |
| C16-a | B03-SH04 | 790 | `public/sfx/foley/foley_pencil-dotted-line_01.wav` | file 2.14 s, plays 28 f | generated | texture: dV >= 18 over speech | G790-G818 (L4-L32, 28 f = 0.93 s of the file from 0 s). Stops for L32-L34. Not listened. |
| C16-b | B03-SH04 | 820 | `public/sfx/foley/foley_pencil-dotted-line_01.wav` | file 2.14 s, plays 42 f | generated | texture: dV >= 18 over speech | G820-G862 (L34-L76, 42 f = 1.4 s of the file from 0.5 s). Not listened. |
| C17 | B03-SH04 | 865 | `public/sfx/comedy/comedy_brass-wah-droop-short_01.wav` | file 0.51 s, plays 10 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Start G865 (Film L80 = G866; 1 f earlier so the 0.51 s file ends G880 on the cut). Library `comedy_brass-note-wah-droop_01` is 1.8 s (too long to end by the cut), new file generated. Draft round 1 (21 Nov 2026, user: sounds cut off, make it a hit): the file holds -3 dB to 0.36 s and then falls 20 dB in 40 ms (-4 to -27 dB), a dead cut, with a -27 to -54 dB residue to 0.51 s. The mix now plays only the first 10 f (0.33 s, before the drop) and decays it with a 6 f (0.2 s) fade-out to zero at G875; no picture change. |
| C18 | B04-SH01 | 943 | `public/sfx/foley/foley_cat-steps-turf_01.wav` | file 1.25 s, plays 37 f | generated | texture: dV >= 18 over speech | G943-G980 (L63-L100). Source is quiet (peak -6 dB before normalizing) and the step events are soft; the take has 3 clear steps in 1.25 s. Not listened. |
| C19 | B04-SH02 | 997 | `public/sfx/foley/foley_door-swing-latch-corridor_01.wav` | file 1.10 s, plays 33 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G997 (L4); latch peak at 0.54 s = G1013 (L20). Door shut frame G1013 per sheet. Not listened. |
| C20-a | B04-SH02 | 1015 | `public/sfx/foley/foley_card-tap-wood_01.wav` | file 0.30 s, plays 9 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1015 (L22). Not listened. |
| C20-b | B04-SH02 | 1023 | `public/sfx/foley/foley_card-tap-wood_01.wav` | file 0.30 s, plays 9 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1023 (L30). Not listened. |
| C21 | B04-SH03 | 1078 | `public/sfx/foley/foley_steel-bowl-slide-lino_01.wav` | file 0.61 s, plays 18 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1078 (L6); file 0.61 s (Film 0.5 s). Not listened. |
| C22 | B04-SH03 | 1095 | `public/sfx/foley/foley_kibble-pour-steel-bowl_01.wav` | file 0.75 s, plays 22 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1095 (L23); pour peak at 0.5 s. Not listened. |
| C23 | B05-SH01 | 1201 | `public/sfx/foley/foley_paper-settle-folder_01.wav` | file 0.50 s, plays 15 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1201 (L70); file 0.5 s (Film 0.4 s), 100 ms fade-out. Not listened. |
| C24-a | B05-SH02 | 1214 | `public/sfx/foley/foley_typewriter-keys-run_01.wav` | file 1.10 s, plays 33 f | library | texture: dV >= 18 over speech | Use 1.1 s from the file start, G1214-G1247 (33 f). Not listened. |
| C24-b | B05-SH02 | 1258 | `public/sfx/foley/foley_typewriter-keys-run_01.wav` | file 1.40 s, plays 42 f | library | texture: dV >= 18 over speech | Use 1.4 s from source offset 2.0 s, G1258-G1300 (42 f). Not listened. |
| C25 | B05-SH02 | 1321 | `public/sfx/foley/foley_typewriter-bell-carriage_01.wav` | file 0.55 s, plays 16 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1321 (L111); bell at the first frame; 120 ms fade-out; file 0.55 s (Film 0.4 s). Not listened. |
| C26 | B05-SH03 | 1368 | `public/sfx/foley/foley_stamp-heavy-thud_01.wav` | file 0.95 s, plays 28 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1368 stamp impact: peak at 0.02 s, so start the file at G1368. Room tone only before it (M5 out G1355). Prominent cue: 4 candidates, picked v3 (impact first, tail 0.9 s); alternates in _raw: ep32_c26_stamp_v1, _v4 and the processed foley_stamp-heavy-thud_alt-v1. Library `foley_rubber-stamp-thunk_01` is 0.35 s, "dull thunk" (zero-crossing 0.4 kHz, very low), not weighty with a tail. Not listened. |
| C27 | B05-SH03 | 1397 | `public/sfx/foley/foley_folder-cover-drop_01.wav` | file 0.40 s, plays 12 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1397 (L70). Not listened. |
| C28 | B06-SH01 | 1407 | `public/sfx/foley/foley_printout-drop-desk_01.wav` | file 0.97 s, plays 29 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | Start G1407 so the pat (file 0.80 s) lands at G1431 (L20); the flutter begins 4 f before the cut (G1411). Starting at 1411 puts the pat on G1435. Not listened. |
| C29-a | B06-SH01 | 1470 | `public/sfx/foley/foley_highlighter-squeak_01.wav` | file 0.32 s, plays 10 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1470 (L59). Not listened. |
| C29-b | B06-SH01 | 1551 | `public/sfx/foley/foley_highlighter-squeak_01.wav` | file 0.32 s, plays 10 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1551 (L140). Not listened. |
| C30 | B06-SH03 | 1675 | `public/sfx/foley/foley_cat-tail-paper-brush_01.wav` | file 0.50 s, plays 15 f | generated | accent: dV >= 12 over speech, or -6..3 in a gap | G1675 (L24); brush peak at 0.16 s. Source is very quiet (pre-normalize peak -17 to -23 dB); file 0.5 s (Film 0.3 s) with a 150 ms fade-out. Four candidates, picked v2 (loudest). Not listened. |

## Library candidates: fit and not-fit

| Candidate | Cue | Verdict | Why |
| --- | --- | --- | --- |
| `creature_cat-mrrp_01` | C02 | not fit | 0.64 s soft trill, tail cut at 0.5 s is not a decay; softer than "unbothered, not friendly". New file `creature_cat-mrrp-bored_02`. |
| `outdoor_park-birds-breeze_01` | A2 | **fit, reused** | Steady park birds and breeze; the treatment (thin, high-passed) is Editor's. |
| `nature_training-field-afternoon_01` | A3 | **fit, reused** | Spectrogram checked, no traffic-wash band; steady 60 s. |
| `electric_radio-static-burst_01` | C11 | not fit | Bursts that die after 1 s; the cue needs a steady bed for 2.8 s. New `electric_radio-static-bed_01`. |
| `creature_cat-purr_01` | C15 | **fit, reused** | Cat purr, pulses and dips; two cuts of it. |
| `comedy_brass-note-wah-droop_01` | C17 | not fit | 1.8 s, cannot end by the cut at 0.5 s. New `comedy_brass-wah-droop-short_01`. |
| `tone_bowed-bass-drone-d_01` | M4 | **fit, reused** | Held steady note; three new candidates all decayed in 4 s. |
| `foley_typewriter-keys-run_01` | C24 | **fit, reused** | Steady uneven strikes; two cuts. |
| `bed_brass-chorale-admiring_01` | M5 | not used | M5 was generated with its own swell (7.4 s section); a 3.4 s old-record chorale in an unverified key adds a layer the line does not need. |
| `foley_rubber-stamp-thunk_01` | C26 | not fit | 0.35 s dull thunk; Film wants weighty and final, with a tail into silence. New `foley_stamp-heavy-thud_01`. |
| `foley_door-latch-hinge_01` | C19 | not fit | Open-then-swing (Film's own note). New `foley_door-swing-latch-corridor_01`. |
| `foley_clay-bowl-slide-mat_01` | C21 | not fit | Clay on mat (Film's own note). New `foley_steel-bowl-slide-lino_01`. |

## Counts

- Cue-sheet rows: 51 (sounds filed for the episode: 44 files, 39 generated and 5 reused from the library).
- Cue rows by origin: generated 44, library 7 (a file used twice counts twice).

## Constraints from the sheet, status

- M1 as sections that cut dead: **done** as six separate sections generated in one key and tempo (D minor, 116 bpm; M5 at 80 bpm, a slow restatement), each trimmed to its window with no fade (M6 has a baked fade-out). Keys and tempo are by prompt; the model does not guarantee them. Check the joins by ear (M1 | A1 alone, M2a | M2b, M5 | stamp).
- C02 loosened to 0.5 s (user): **done** (0.50 s file, body in the L02-L03 gap, soft decay <=0.17 s into L03; replaces the 0.36 s `creature_cat-mrrp-bored_01`).
- M7 ending tag decayed by G1688: **done**, the file is 0.96 s; started at G1647 it is fully decayed by G1676, 12 f of margin. Shorter than the 1.4 s Film planned; notes about 0.38 s apart (Film 0.33 s).
- Stamp thud at G1368 in silence: **done** (peak at the first sample; start the file at G1368).
- Radio key-up before the agent line (B03-SH02): **done** (C10 at G646).
- Tail-tip brush (C30, NEEDS-GEN): **done**, 4 candidates, v2 picked.

## Candidates kept for the user (prominent cues)

Raw candidates stay in `$REELS_STORE/library/sound/_raw/` (picked file in bold):

- C26 stamp: `ep32_c26_stamp_v1`, `_v2`, **`_v3`**, `_v4` (and processed `foley_stamp-heavy-thud_alt-v1.wav` from v1).
- M7 ending tag: `ep32_m7b_endtag_v1`, `_v2`, **`_v3`**, `_v4` (and the first 2.0 s run `ep32_m7_endtag_v1`-`_v4`).
- M1 theme: `ep32_m1_theme_v1`, `_v2`, `_v3`, **`_v4`**.

## Raw-to-library map (selection record)

C01 a/b/c = c01b v3 / v1 / v2; C02 = c02c v3; C04 c04 v1; C05 c05b v3; C06 c06 v3; C07 c07b v4; C08 c08b v4; C09 c09b v1; C10 c10c v4; C10b c10b v2; C11 c11 v3; C12 c12b v3; C13 c13b v1; C14 c14 v2; C16 c16 v2; C17 c17b v2; C18 c18 v3; C19 c19 v1; C20 c20 v1; C21 c21 v3; C22 c22 v4; C23 c23 v1; C25 c25 v4; C26 c26 v3; C27 c27 v2; C28 c28 v1; C29 c29 v3; C30 c30 v2; M1 m1 v4; M2 m2 v3; M3 m3 v2; M5 m5 v3; M6 m6 v3; M7 m7b v3; A1 a1 v1; A4 a4 v1. Picks are by measured shape (duration, onset, peak time, event count, tail, brightness); no cue was listened to.
