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
