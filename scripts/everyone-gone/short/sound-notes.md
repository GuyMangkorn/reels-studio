# EG-EP01-SHORT sound notes (Editor, 3 Nov 2026)

Status: sound stage built from Film's Sound lines (index.md audio spine, sc01-sc04). Measured and render-checked only; `listened: no`, not user-approved.
Preview (offline ffmpeg mirror of `audio[]`, no narration ducking): `out/EG-EP01-SHORT/sound/EG-EP01-SHORT_sound-preview.{wav,mp3}`; filter in `out/logs/eg-sound-mix-filter.txt`.
Runtime check: `node scripts/render.mjs EG-EP01-SHORT --range=1646-1700 --gl=angle --timeout=300000` OK (segment f1638-1727, mp4 has audio; log out/logs/eg-sound-render.log). `tsc` shows one error in tests/loudness.test.ts, not in this change.

## Generated (library `$REELS_STORE/library/sound/`, candidate v1 of 3 picked by measured shape, raw kept in `_raw/`)
| Cue | Library ID | Notes |
| --- | --- | --- |
| SND-NG01 | sfx/ui/ui_entry-chime-two-tone_01 | 1.2 s; one file for soft (vol 0.2 / 0.07) and dry (0.45) variants, no reverb baked in |
| SND-NG02 | sfx/mechanical/mechanical_sliding-door-glide_01 | 2.6 s |
| SND-NG03 | sfx/vehicle/vehicle_bts-viaduct-passby_01 | 3.7 s, peak early (0.5 s) |
| SND-NG04 | ambience/room/room_soi-morning-quiet_01 | 9 s loop |
| SND-NG05 | ambience/room/room_pot-steam-hiss_01 | 7 s loop |
| SND-NG06 | sfx/water/water_ice-settle-tick_01 | 0.19 s |
| SND-NG07 | sfx/foley/foley_jump-scuff-sneakers_01 | 1.2 s, two hits 0.8 s apart; only hit 1 used twice |
| SND-NG08 | sfx/ui/ui_card-tick-sweep_01 + music/bed/bed_clean-pulse-95bpm_01 | tick (0.25 s in) and sweep (1.0 s in) taken from one file; pulse bed 10 s loop |

## Timeline (global frames; volume = Remotion gain)
hum 0-789 0.3, 789-1140 0.4, 1140-1884 0.15, 1884-end 0.3 | pad `tone_soft-sustain-reflective_01` 0-530 0.15 | felt `bed_warm-pad-felt-third_01` 160-789 0.12 (fade out ends at 789, silence to L10 at 800) | soi tone 20-230 0.06 | steam 530-789 0.07 | heartbeat 819-1140 0.14 | pulse bed 1166-1500 0.12 | drone 1456-1878 0.25 | riser 1382 0.5.
Walk (vol 0.3): 160-220 (S01-B02-SH01), 791-833 (S02-B01-SH01), 1730-1746 (S04-B01-SH03). BTS 288-374 0.28 (S01-B02-SH02). Doors: glide+chime at open 380/1018/1653 (+3 f chime): glide 0.3/0.35/0.12, chime 0.2/0.45/0.07. Ice ticks 663, 725. Jump scuffs 907, 921 (S02-B01-SH02 f62, f76). Card: ticks 1180+24n (12), sweep 1252.
Beds (pad, felt, pulse) carry `duckUnderNarration` 0.6. Narration alone -18.6 LUFS; preview mix -17.2 LUFS integrated.

## Not done / open
- Not listened to. Chime reverb, "distant" variant, BTS rise (sheet wants peak f78, file peaks at 0.5 s, so placed to peak about f81), pulse bed 95 bpm vs card timing all need the user's ear.
- Hum not ducked -3/-4 dB under steps and BTS; no hum swell on `ตู้เย็น`; hum is not cross-faded (plain loop) as before.
- Felt notes play as the 8 s bed loop, not placed as single notes at the sheet frames; pad has no energy curve.
- Footsteps are one cut of an irregular 3.8 s take, not frame-synced to each step. Latch sound at the end of the door glide is whatever the model made.
- Drone low-pass (-3 dB from SH03 f35) not applied; hum rise over dissolve not applied.
