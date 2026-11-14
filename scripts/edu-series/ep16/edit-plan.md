# EDU-EP16 edit plan (Editor, R1.5b draft stage)

Composition: `EDU-EP16-SHORT` (edu, 1080x1920, 30 fps, 2100 f = 70.00 s, 26 shots, ending A_fade, no extra hold).
Inputs: script R2.3 (locked narration), storyboard SHEET-R1.5b, film-brief BRIEF-R1.5b, rows ROWS-R1.5b, Boat guards RV-23..RV-33 (research-r2.md), `sound-cues.json` Ton R1.5b (83 cues), voice takes V01-V10.
Play order: 15 -> 16A -> 16B -> 16C -> 16D -> 16 -> 17. Narration/captions: Thai text unchanged, re-timed only.

## Build
- `src/videos/edu-ep16/clock.ts`: shot table (26 rows tiling [0, 2100)), `cues.ts`: captions re-timed (no caption in 16A-16D, SH22, V06).
- `src/videos/edu-ep16/index.ts`: one plate per shot, key = shot-id suffix (`EP16-16A` ... `EP16-22`).
- `src/videos/edu-ep16/shots.tsx` (shots 1-15, 17-22, plate infrastructure), `shots-river.tsx` (16A, 16B, 16C, 16D, 16), `beasts.ts` (long-neck, ankylosaur, splash helpers on Boss's beast kit).
- `scripts/edu-series/ep16/narration-place.py`: narration + takes at 2100 f (V01 217, V02 443, V03 478, V04 637, V07 781, V05 929, V08 1126, V09 1535, V10 1929; L07 34.127 ... L11 62.467 s). V06 is Ton's cue (f2010).
- `scripts/edu-series/ep16/sound-mix.py`: places all 83 cues (FILES literal), writes `out/stems/{voice,bed,texture,accent}.wav` and the baked `public/audio/edu/EDU-EP16-SHORT-draft-stem-v1.wav`.

## Staging status per shot (what is on the R1.5b sheet and what is not yet)
- Staged to R1.5b with the Boss kit: 11 (ankylosaur wading, splashes, huff, head-shake spray), 12 (sky cycle, calendar, night long-necks), 16A (villager panic scatter into the reeds, flock, shade ramp), 16B (impulse rings), 16C and 16D (T. rex via the planted-foot gait, FC part, vapour sniffs, Keng behind B1), 16 (relief, pterosaur dive/grab/climb/snag/gulp, laugh with `laughFig`/`safeLean`), 22 (camera drop to hen height, step, foot plant with dust and print, flinch, peck, cluck).
- Long-neck volumes added to 2 (LN-A/B/C), 15 (LN-F, stops chewing +48, head swings +52-64), 21 (LN-G, camera yaw -10..-24).
- Still on the earlier plate (R1.1/R1.3 staging, time-shifted): 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 20 (see the round notes: dragonfly, painted card, blossoms+ankylosaur, whole cone, restaged 7, volume long-neck in 8 and 10, granary exterior, two-leg hen are not applied yet).

## Sound defaults chosen (the sheet leaves them open)
- S16-20 laugh vs V09 (f1540-1592): ducked a further 5 dB while the voice speaks (full level after f1592).
- S16-27b (SH21 reuse of the long-neck breath): -30 dB (sheet range -28..-34; by number, not heard).
- A16-VM-b: -6 dB while S16-32 plays (f1024-1128) and in shot 14 (f1202-1283), +3 dB in shots 12-13 for the wind.
- A16-RV silence drop at f1366 goes to -26 dB (sheet -18; the B05 drop row asks 30 LU under the voice), back to 0 dB by f1504; insects return as A16-FE-ret f1494-1504.
- Accent trims against the checks: S16-38a..f -4 dB, S16-42 -4, S16-43a -2, S16-18 -7.5 (B05 river-suspense peak row, RV-23a); S16-34 +2, M16-pizz +2.5 (B05 gulp/pizz row); M16-low and S16-25 -3 (mix true peak).
- S16-13 calendar: placed as the cue sheet has it (one cue at f1052 for six peels in SH12); question open for Film/Ton.

## Open for fix round
- See `editor-progress.log` and the round's `fixlist.md`.
