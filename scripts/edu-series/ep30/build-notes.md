# EP30 build notes

- T10 (2026-11-19, Sonnet medium, 0 fix passes): worktree had no node_modules, symlinked the main checkout; no PIL, so pixel measures run through ffmpeg rawvideo + python (scratch scripts archived with the proof). D30-LF02 baseline has to be rendered from the pre-change dam.ts (newsreel off); the first baseline with the newsreel on does not match a newsreel-off proof.

# EDU-EP30 build notes

## T13 Lewis gun mechanics (Boss, 2026-11-19)
- A far-half tick or flat drawn inside a beast build is hidden by the centre-depth sort (`paintBeast` sorts parts, caps and flats by the depth of their centre; a cap's centre is nearer than the far half of anything on it). Mark a turning part in world space after the build instead (`paintLewisPanTicks`).
- Sheet anchors (muzzle, pan, port) for the Lewis gun were estimated for a longer gun than the locked geometry; see the ticket Result, A1-A2.

## TICKETS-R7 (Film, 2026-11-20)
- **EP18 test debt, outside EP30:** `tests/beast-joints.test.ts` fails `HIPPO.YAWN`, `HIPPO.CHARGE` and `HIPPO.HALT joints hold` on `b581861` and also on `d5a5b82^`, before T37 (`out/logs/film-r7-beast-joints.log`; T08's Result calls it a stack overflow). Owner: Boss, in an EP18 or kit maintenance pass; no EP30 ticket.
- **T37 changed shared creatures visibly:** AS-HIPPO-R1 feet and lower legs are now closed rounded tubes (user kept it, 2026-11-20); LF03's top-left supporter limb lost its kink. A later EP18 re-edit renders with the new feet.
- **Render cost of near-detail emus:** 36 near birds (heads field) > 180 s per still; 9 near fence birds 191 s; one 60-bird scatter frame (40 rig + 20 far) about 13.9 s per `stills.mjs` run. Plates cap near detail (T22, T32 r7 notes). Proposed TL item: a `--scale` option for `scripts/stills.mjs` so half-size cost can be measured (T08 could not).
- **Kit intake items (W8.4):** an open mitten with a thumb for the unshaped kit (T12 note 1); arms behind the back in the kit back view, `kit/back.ts` (T12 note 4, now repainted in `edu30/cast.ts`).

## T33 (Boss, 2026-11-20)
- **Scroll word is not in the plate:** `AUSTRALIA` on the scroll is the DOM overlay `ReliefWord` in `look.tsx`; the plate stack has no hook for it, so B07-SH01/SH02 scrolls are blank. Editor or a later ticket needs a scene-level overlay if the word is wanted in the cut (AV01-AV03 say nothing else is overlaid).
- **Paving under the bed:** B07-SH01 adds `wFill(41790, '#bfae8c')` in front of the wattle bed; without it the crane's first frames showed bare paper below the wall foot.
- **SH02 reel:** `DEFAULT_REEL` has strength 1; plates outside the old filter must return `strength: 0` explicitly.
- **Caption zone:** sunlit sandstone gives caption-zone mean 0.6-0.7 (limit 0.25) in both shots; LF03 is the same locked wall.
- **Render cost under load:** a single SH01 L 100 still took 183 s at load average 15-45 and hit the harness timeout; run stills lists in the background and count only `s*.png` when waiting.

# EP30 build notes

- T10 (2026-11-19, Sonnet medium, 0 fix passes): worktree had no node_modules, symlinked the main checkout; no PIL, so pixel measures run through ffmpeg rawvideo + python (scratch scripts archived with the proof). D30-LF02 baseline has to be rendered from the pre-change dam.ts (newsreel off); the first baseline with the newsreel on does not match a newsreel-off proof.

# EDU-EP30 build notes

## T13 Lewis gun mechanics (Boss, 2026-11-19)
- A far-half tick or flat drawn inside a beast build is hidden by the centre-depth sort (`paintBeast` sorts parts, caps and flats by the depth of their centre; a cap's centre is nearer than the far half of anything on it). Mark a turning part in world space after the build instead (`paintLewisPanTicks`).
- Sheet anchors (muzzle, pan, port) for the Lewis gun were estimated for a longer gun than the locked geometry; see the ticket Result, A1-A2.

## TICKETS-R7 (Film, 2026-11-20)
- **EP18 test debt, outside EP30:** `tests/beast-joints.test.ts` fails `HIPPO.YAWN`, `HIPPO.CHARGE` and `HIPPO.HALT joints hold` on `b581861` and also on `d5a5b82^`, before T37 (`out/logs/film-r7-beast-joints.log`; T08's Result calls it a stack overflow). Owner: Boss, in an EP18 or kit maintenance pass; no EP30 ticket.
- **T37 changed shared creatures visibly:** AS-HIPPO-R1 feet and lower legs are now closed rounded tubes (user kept it, 2026-11-20); LF03's top-left supporter limb lost its kink. A later EP18 re-edit renders with the new feet.
- **Render cost of near-detail emus:** 36 near birds (heads field) > 180 s per still; 9 near fence birds 191 s; one 60-bird scatter frame (40 rig + 20 far) about 13.9 s per `stills.mjs` run. Plates cap near detail (T22, T32 r7 notes). Proposed TL item: a `--scale` option for `scripts/stills.mjs` so half-size cost can be measured (T08 could not).
- **Kit intake items (W8.4):** an open mitten with a thumb for the unshaped kit (T12 note 1); arms behind the back in the kit back view, `kit/back.ts` (T12 note 4, now repainted in `edu30/cast.ts`).

## T16 (Boss, 2026-11-20)
- **Queue gait:** one stride for the whole line (1.5 m of body advance per cycle, stride 0.9) so a step is exactly 0.6 m; phase from distance walked, a standing bird holds a double-support phase (0 to 0.1 or 0.5 to 0.6 of a cycle). Birds hold position through a planted-feet pose only at a double-support phase, otherwise a foot floats.
- **SH03 bunching is not reachable forward-only** (T16 Result, value 1): Film decides whether the tail may step backward.
- **Render cost:** a still with 25 near emus over the dam takes about 3 min under load 15 (183 s `delayRender` timeout under load 29); render one frame at a time and wait for load to drop.

## W5.3 Editor pass 1b (2026-11-20, Sonnet medium)
- **Composition:** `src/videos/edu-ep30/` (`EDU-EP30-SHORT`, short, 28 plates `EDU30-<shot>` = 28 scenes, 1977 f). The first Editor invocation was stopped; its `index.ts`, `cues.ts`, `assets.lock.json` and the narration were re-read against SCENE-R2.2: 36 caption cards match every "VO + subtitles" range of b01-b07, no card in the three mime beats or after G1924, the six title rows are Boss's `TITLES` (B05-SH03 1363-1388 kept as TF59 says), narration sha256 = the store file `projects/edu/EDU/narration/ep30-voice-r2-2/preview.wav` (`store.py use` re-run, lock unchanged). `npx tsc --noEmit` shows no `edu-ep30` error (log `out/logs/ep30-tsc.log`; only the known tests/ errors).
- **Node:** `scripts/render.mjs` needs node >= 22 (`globSync`); the shell default here is 20.19.4, so stills ran with `PATH=~/.nvm/versions/node/v22.18.0/bin:$PATH`.
- **Label collision (changed this pass):** the sheet's one-line label is 952 px at the house size (x 120-1072, y 300-350): it sat on the T02 title boxes (y 300-475) in six shots and ran to 8 px from the right edge. Now the same words in the label's two slots (`labelTop` 180: y 180-290, under the mark, above the title band), the "·" read as the line break, on every shot so nothing jumps at a cut. Open question to Film: accept the split (or shorten/relocate the label).
- **Bold lines:** `Subtitles` has no bold weight; L01a/L14/L17 are drawn at the shared weight (open question to Film, unchanged).
- **Caption zone (TF46 band 1150:1344, plate without captions, `EDU30-SEQ` stills, `--max-mean 0.80 --max-p95 0.99`):** G330 mean 0.740 p95 0.872 pass; G700 0.735/0.833; G960 0.641/0.921; G1243 0.436/0.532; G1600 0.580/0.828; G1760 0.585/0.797, all pass. A captioned composition frame reads p95 1.0 (the white fill itself), so the check is run on the plate. Caption ink centre on the composition: G330 offset -1.0 px, G1243 -7.5, G1760 -1.0 (all within 12).
- **Sound:** not wired to a stem yet. `STEM = null` in `index.ts`; the composition has no audio track, so `scripts/sound-cues.py scripts/edu-series/ep30/sound-cues.json` fails all 90 cues ("not in the timeline") by design until Ton's sound-lock runs and Editor writes `short/sound-mix.py` (adapted from `scripts/edu-series/ep26/short/sound-mix.py`: it needs the locked `public/` sounds, the sheet's endFrame/loop notes and per-cue dV targets). Next step after the lock.
- **Stills:** `out/EDU-EP30-SHORT/stills/*.png`, sheet filed as `EDITOR-P1-*` in the store; samples do not imply approval.
- **Sound lock (Ton, 20 Nov 2026):** `short/sound-lock.py` ran (rc 0): 67 sounds `store.py use` to episode `edu-ep30` (`src/videos/edu-ep30/assets.lock.json` +268 lines; log `out/logs/ep30-sound-lock.log`). Cue frames verified unchanged: no Sound line in `scene-sheets/b01-b07.md` changed between the sheet commit dbd7325 and SCENE-R2.2 (R9-R11 touched other lines). Measured all 67 files (`out/logs/ep30-sound-measure.log`): none above -0.5 dBFS (ceiling -1.0), none with flat-factor clipping, none silent; the 18 "-70 LUFS" rows are clips under 0.4 s, where EBU R128 is undefined, not silence. No sound regenerated, models not loaded this pass. Added the draft stem to the sheet's `exempt`. **Not listened to by a human.** `sound-cues.py` still fails the 90 cues "not in the timeline" because that check reads quoted sound paths in `sources` and `short/sound-mix.py` does not exist: Editor writes it (quoting each cue's file path) and adds it to `sources` in the sheet; then the check passes. `sceneSheets` in the sheet still reads EDU-EP30-SCENE-R2 (Sound lines identical in R2.2).
