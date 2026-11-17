# EP21 — build notes

## Editorial assignment — 2026-11-15

- User allocated C83 to EP21 and requested a full script plus portable Hook Guide. Shared research remains `../ab-hook-pilot/research-c83.md` C83-RESEARCH-R1; no source duplication/migration.
- New authoring uses `short/` convention and reserved ID EDU-EP21-SHORT. No runtime module/composition exists for this assignment.
- Preaw owns script/Hook Guide; Boat reviews exact named revisions independently. Coordinator owns records and context-map integration. No concurrent overlap of these file responsibilities.
- Voice pace is not selected; W1.4 remains pending. Channel measured rates are reference-only until the episode's setting is selected; no full read/sample generated.
- Guide is an episode-local production brief, not a new global rule or skill. Another worktree must receive uncommitted dependencies explicitly.

## Verification

Completed: EDU-EP21-SCRIPT-R1 + HOOK-R1, independently reviewed by Boat in EDU-EP21-FACT-R1; ready-for-storyboard, zero must-fix findings. All spoken lines were mechanically matched to the exact-wording review after metadata synchronization. Optional prose notes remain documented; no factual text was changed after review.

Repository checks passed: changed Markdown link check (32 files, 0 problems), context-map check (427 modules, 0 uncovered), JSON parse, and `git diff --check`. Logs: `out/logs/ep20-ep21-links.log`, `out/logs/ep20-ep21-context-map.log`. Documentation-only verification exception applies: no runtime tests, audio or render has a subject.

W1.4/W1.5 remain open: timing uncalibrated for the episode-selected voice and user script approval unrecorded. At the writing handoff, files were local and uncommitted; no push, PR or transfer to another worktree had been performed.

## Tools / document proposals

None.

## Independent production continuation — 2026-11-16

- This session owns only EDU-EP21-SHORT; EP20 has a separate concurrent session/worktree. User authorization extends the earlier writing-only scope to normal production, with explicit script/voice choices and downstream workflow gates still separate.
- Intake `c420a2c` has PR #343 merge `c5326260b3923e669ba53f8a103e34d77f10bc1c` as an ancestor; `scripts/edu-series/ep21/` exists and the checkout was clean. Preserve newer main changes; no reset or recreation of the editorial bundle.
- Coordinator updates delivery to R2 and reopens W2–W8 through `ep.py`. No editorial claim or Thai narration changes are authorized by this bookkeeping.
- Preaw owns the timing-only audit; Editor owns ≤10 s opening samples. Existing ideation, C83 research and FACT-R1 are reused. No full read, frame render, media delivery or publication has occurred in this continuation.

### W1.4 evidence

- Preaw delivered `short/timing-projection.md` EDU-EP21-TIMING-R1: 176 syllables (L10=12), the existing 4–5 s pause allowance made explicit as 4.35 s, and the unchanged 3 s hold. New sample-calibrated projections are 43.06 s / 40.90 s at ×1.08 / ×1.15; gross-span sensitivity without adding pauses twice is 40.3 / 38.1 s. Recommend ×1.08 for margin; no setting selected.
- Only timing metadata changed in SCRIPT-R1; Preaw verified all twelve Thai narration lines byte-match HEAD. FACT-R1's unchanged-claim result is reused; no new factual review or ideation occurred.
- Editor delivered `short/voice-samples.md` and `.json` EDU-EP21-VOICE-SAMPLES-R1. One Gemini call; same take at both paces. Candidate WAV/MP3 durations are 7.057250 / 6.623125 s, below the 10 s cap. Retained assets and reproduction evidence: `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/`; local `out/` is a cache.
- Local transcription encountered PyAV `open(..., metadata_errors='ignore')` incompatibility. Editor used ffmpeg-decoded float32 NumPy input with the already cached Whisper model; no dependency installation, shared-tool fix or extra API call. Adapter and logs are stored. Machine recognition of two words is ambiguous; listening/Thai pronunciation approval remains pending.
- The coordinator presented the two short auditions and requested episode pace plus explicit SCRIPT-R1 approval through structured questions. W1.4/W1.5 and W4.1 remain open until actual answers. No full narration before the pick and W2.3; no Film scene plan, visual validation or production completion is claimed.

### Continuation verification

- Changed Markdown links: eight files, zero problems (`out/logs/ep21-continuation-links.log`). Context map: 434 modules, zero uncovered (`out/logs/ep21-continuation-context-map.log`). Audition JSON parses; `git diff --check` passes.
- Editor verified all six retained audio files are ≤10 s and their cache/store SHA-256 values match. Whole-script metadata changed during timing synchronization; the exact two-line narration text/hash is unchanged, with intake and final identities distinguished in the manifest.
- Documentation-only verification exception applies to tracked changes: no runtime source or composition changed, so typecheck, runtime tests and video/still renders have no subject. Audio duration/storage checks above are separate from user listening approval. No jobs remain running; no commit, push, PR, merge or media posting performed in this continuation.

### Slower auditions requested — 2026-11-16

- Subsequent user reply: "เลือก 1.05". Coordinator records Kore ×1.05 in delivery and audition metadata, completes W1.4 at the existing 43.97 s projection and W4.1 (voice chosen). W1.5 stays explicitly deferred; W4.2/W4.3 and Film remain open. No regenerated speech or new factual/visual work is needed for this mechanical decision synchronization.

- User requested ×1.03 and ×1.05 and explicitly deferred SCRIPT-R1 approval to read it first. Neither original candidate was selected. A fresh Editor pass derives both requested paces from the same preserved Kore take, with no new speech/API generation. Film and the full read remain pending their existing gates.
- Editor delivered VOICE-SAMPLES-R2: ×1.03 = 7.384771 s, ×1.05 = 7.249375 s (each WAV/MP3 separately probed). New canonical derivatives and sidecars: `projects/edu/EDU/samples/ep21/2026-11-16_r1-76603d9a5b7493a3/r2-1.03-1.05/`; original source is reused once, not copied into R2.
- Coordinator mechanically applied Preaw's unchanged R1 formula to the new measured baselines (6.60/6.45 s for 31 syllables): TIMING-R2 projects 44.82/43.97 s, with gross-only sensitivity 42.2/41.4 s. Narration, 176-syllable count, 4.35 s authored pauses and 3 s hold are unchanged. Script approval remains explicitly deferred; no new factual review has a subject.
- R2 verification: four new media files ≤10 s; cache/store hashes match and original source hash unchanged (Editor). Coordinator's six-file link check passed (`out/logs/ep21-samples-r2-links.log`), audition JSON parses, and `git diff --check` passes. Existing context-map entries cover both updated manifests and the timing file; no module or path was added. Tracked changes remain documentation/metadata only; no runtime test or render subject. No jobs remain running.

## Git publication authorization — 2026-11-15

### Continuation publication — 2026-11-16

- User authorized "commit + pr" for the completed EP21 continuation records. Tracking issue: #345; publication branch: `codex/345-ep21-voice-continuation`. This covers commit, push and PR, not merge or media posting, and does not approve SCRIPT-R1.
- Intake branch matches the fetched `origin/main` (0 commits ahead/behind); no previous PR exists for that branch. Final metadata synchronizes the selected ×1.05 setting and keeps W1.5 deferred.
- Listening cache paths in the audition Markdown are code references, not repository links to machine-local media; canonical store paths and JSON reproduction data remain authoritative across checkouts. User-facing chat links remain playable locally. No media binaries are staged.

The user selected "Commit + push + เปิด PR" after reviewing the writing handoff. Issue: #342; publication branch: `codex/342-ep20-ep21-hook-guides`. This authorization covers Git publication, not script approval, media production or posting.

## W3.1 look frames — 2026-11-16 (Film)

- Painted LF01 (B01-SH01 frame 0), LF02 (B01-SH04 start), LF03 (B02-SH06 u 0.85) with new episode code in `src/painted/edu21/`; seven render rounds (`out/edu21/looks/v1`–`v8`, scratch), final frames `w3-final` (guides) and `w3-clean`, archived to store `projects/edu/EDU/ep21-c83-looks-w3/` and `projects/edu/EDU/ep21-c83-looks-w3-clean/`.
- Rounds: v1 car high in frame, interior from behind the passenger headrest unreadable, glow as neon outline; v2 lower horizons, rear-centre cabin camera; v3 wet-road mirror; v4 mirror clipped to the asphalt, lining/visors/mirror in the cabin; v6 glow outline opened along the bottom and sill-to-road curtain; v7 LF03 whole profile in width; v8 explanatory tone dimmed.
- Measures and caption-zone results: brief [Look frames](short/film-brief.md#look-frames-w31). LF02 p95 0.588 and LF03 mean 0.293 exceed the default caption-band limits; left for Editor's legibility check with outline captions.
- Finding (proposal, not a rule edit): the wet-road mirror (`paintWetReflection`, after EDU-EP18 `mirrorCam`) is exact only for a level camera; the brief's pitched SH01 lens was levelled for that reason. A kit `mirrorCam` with pitch support would remove the constraint (TL01 on a second use).
- Finding: the four-head card seated in a 1.46 m sedan needs the hip at y 0.40 and the roof at 1.50 for the crown to clear the lining; future car interiors with the kit cast should start from these numbers.


## W3.1 look frames, round 2 after the viewer check — 2026-11-16 (Film)

- Viewer check on ROWS-R2: LF01 pass, LF02 fail, LF03 fail. Fixes recorded in the brief ([Look frames](short/film-brief.md#look-frames-w31), round 2); rows EDU-EP21-ROWS-R3. Scratch rounds `out/edu21/looks/r3a`–`r3f`; finals `r3-final` (guides + `sheet-270.png`) and `r3-final-clean`, filed with `store.py put` to `projects/edu/EDU/ep21-c83-looks-r3/` and `projects/edu/EDU/ep21-c83-looks-r3-clean/`.
- Store slip (recorded, not repaired): a first `store.py archive --kind looks` filed the same frames flat into `projects/edu/EDU/looks/` (`LF01.png`, `LF0x.<hash>.png`, `sheet-270.png`, beside the unrelated `ep17/`); the store is immutable with a manifest, so they stay. Finding (proposal): `archive --kind` uses the kind as the folder and deduplicates by content, so an episode-named kind (as round 1's `ep21-c83-looks-w3`) is required; a later `archive` to the right kind reports "already stored" and files nothing, so `put` per file was used.
- Finding: a seated four-head card read from the rear seat needs the seat back to reach the shoulder line in projection, not in world height alone: with the lens 0.3 m behind low seat backs (R2) the backs projected far below her shoulders and she read as standing. Lens ~0.6 m behind a shoulder-high back (y 0.92) with a head-height headrest reads as seated.
- Finding: `washAt` bleed does not soften a light pool enough to read as light; soft pooled light and wet-road streaks were moved to the screen layer (SVG Gaussian blur, same camera), as the bloom already was. Boss decides whether this stays screen-side or becomes an in-canvas blur when hardening.
- Finding: `clipPolyPainter` needs a convex clip with ≥ 3 points; a puddle that projects outside the frame returns an empty polygon and crashes `clipConvex`. Guard on the hull's length.
- LF03 caption band now fails harder (mean 0.360, p95 0.474) because the glow's reflection sits in the band under the car; left for Editor's legibility check with outline captions.

## W3.1 look frames, round 3, LF03 only — 2026-11-16 (Film)

- Second viewer check: LF01 pass, LF02 pass, LF03 fail ("neon sticker outline", "thin streaks, not a pool", "car small, lower half empty"). Redesign recorded in the brief ([round 3](short/film-brief.md#look-frames-w31)); rows EDU-EP21-ROWS-R4. Two renders (cap): `out/edu21/looks/r4a` (yaw 26, scratch) and `r4b` (yaw 36, current). Filed with `store.py put` to `projects/edu/EDU/ep21-c83-looks-r4/`. No clean frame this round.
- Finding: a whole car in profile at 1080 width caps the car near 300 px tall; a 30–40° front quarter gains about a third (probe on `carSilhouette`: yaw 0 → 259 px, 28 → 329, 35 → 336, 42 → 378 at eye 0.6, fitted to x 30–1050). Record this before planning a "whole car" shot as the lead.
- Finding: clipping a blurred screen-light layer to the projected metal (SVG `clipPath` of the visible faces) is what removes the halo; a blur alone always reads as an outline glow past the silhouette.
- Finding: a hard SVG clip on the wet-road region draws a straight edge through the mirrored glow at the asphalt line; the wet clip needs a feathered mask (blurred mask, not `clipPath`).
- Finding: a far sugar palm (−40, 15, −60) sits over the roof at yaw 4–30 from this vantage and read as spiky hair on DRIVER in r4a; check far set dressing against the subject's head with a projection probe before choosing the yaw.

## W5.1 timed scene sheets — 2026-11-16 (Film)

- [scene-sheets.md](short/scene-sheets.md) EDU-EP21-SHEETS-R1 from VOICE-R2; [projection-run.py](short/projection-run.py) (EP18 form) run on 26 camera states, log `out/logs/edu21-w5-projection.log`, JSON `out/edu21/w5-projection/`. Rows EDU-EP21-ROWS-R5.
- Word onsets inside lines: faster-whisper large-v3-turbo `word_timestamps` on `out/ep21-narr/full_1.05x0.95.wav` through the main checkout's `.venv-whisper` (scratch script, 407 tokens, about 1 min CPU). Line boundaries from voice-measure agree with the word times within 0.1 s (e.g. "หลังคา" 5.16 s = end of the 4.82+0.33 internal gap).
- Finding: kit `camMove` holds `f` and `hy` static; a planned lens change (brief SH07 f 1250, SH13 f 1000→1150) has to become a second segment or a fixed lens. Write sheet cameras with one f/hy per segment.
- Finding: in a right-hand-drive cabin the centre radio sits on the driver's left; "over the right shoulder" puts her head on the lens axis to the cluster (both projected at x ≈ 749). The rear-centre lens over the left shoulder clears it.
- Finding: with view cues on, a camera yaw that ends near 82° to the character's facing (SH12 yaw 172) crosses the profile cut at 82.5° mid-shot; hold the view or stop the arc short.
- Tool proposal (TL, for user review): `projection-run.py` is now copied per episode (EP17, EP18, EP21) with only the shot table changing; a shared `scripts/projection-run.py <shots.json>` taking the kit `camMove` form would remove the copies.

## W5.2s Ton TG1+TG2 (2026-11-16)

- Sheet: `scripts/edu-series/ep21/sound-cues.json` against EDU-EP21-SHEETS-R1, 15 rows (8 done, 7 `NEEDS-GEN` for TG3/TG4), plus `placements` (bed and music maps) and `levels.checks` (stems empty until Editor's draft; `provisional` rows await TG3/TG4).
- Made (SA3 medium, steps 8; beds cfg 4 with a negative prompt): A1 `weather_car-roof-rain-storm-outside_01` (a1b v2), A2 `room_car-cabin-heavy-rain_01` (a2b v3), M1 `bed_curious-felt-piano-pulse-92_01` (v3), END1 `stinger_storm-passing-piano-chord_01` (v3), S1 `impact_lightning-strike-close_01` (v2), S3 `reveal_glass-glint-tick_01` (v2), S7 `impact_thunder-roll-far-swell_01` (v1). Pick reasons are in each library sidecar `selection`. Locked with `store.py use --episode edu-ep21` (empty `src/videos/edu-ep21/` created for the lock file).
- First bed takes (cfg 1) swung 10-20 dB inside the loop; re-generated at cfg 4 with a negative prompt, picked the steadiest. A1 lost its sparse thunder rumbles for a steady loop.
- Library check: `weather_thunder-roll-distant_01` measured crack at 0.02 s, peak 0.38 s: does not fit S7 (no crack, swell). `weather_rain-thatch-tin-heavy_01` unfit (brief).
- Finding: raw SA3 at cfg 4 on rain peaks +4..+6 dBFS before the safety ceiling (clipped samples possible); the picked takes were measured only by envelope, not for clipping artifacts. Listen to A1/A2 first.
- Finding: numpy/soundfile exist only in the audio-studio venv (`/Users/mangkornkatawong/Developer/audio-studio-mcp/.venv/bin/python`), not system python; measurement scripts ran there.

## W5.2s Ton TG3 (2026-11-16)

- Made (SA3 medium, steps 8, cfg 4 with a negative prompt, 4 variations each): S4 route glow `reveal_breath-chime-glow-rise_01` (2.5 s, v2, seed 1027634685), S4 reprise `reveal_breath-chime-glow-short_01` (1.8 s cut of the same take, 0.4 s fade), S8 inner branch `reveal_glass-filament-sweep-down_01` (1.0 s, v2, seed 171807614). S4 echo reuses the 2.5 s file (Editor sets -6 dB). Filed under `library/sound/sfx/reveal/`, locked in `src/videos/edu-ep21/assets.lock.json` (`public/sfx/reveal/`). Cue sheet: 13 of 15 rows done, S5/S6 (TG4) still `NEEDS-GEN`.
- Fit check: `reveal_glass-shimmer-soft_01` (1.4 s, immediate onset) and `ui_metal-glint-chime_01` (0.5 s) do not give a 2.5 s rising breath; generated new.
- Measured only (100 ms RMS and spectral-centroid envelopes, clip count 0); not listened. S4 v2 swells -36 to -17 dB over 1.1 s with rising centroid. S8 is the weakest: none of the four takes combined a high falling sweep with a dull closing tick; v2 chosen for the sliding-down centroid (4.8 to 2.3 kHz), file is 1.0 s against the 0.8 s sheet, ending tick weak. Listen to S8 first; regenerate on request.
- levels.checks: S4-route-glow and S4-echo no longer provisional (echo min 18 = glow's 12 plus 6 dB, from 39.37 s); added S4-reprise (27.4-29.2 s, min 12) and S8 (28.4-29.4 s, min 15, smaller than S4). S5 and S6 rows stay provisional for TG4.
- Models unloaded after TG3 batch.

## W5.2s Ton TG4 (2026-11-16)

- Made (SA3 medium, steps 8, cfg 4 with a negative prompt, 4 variations each): S5 tyre `vehicle_split-tyre-air-hiss-settle_01` (2.26 s, v1, seed 1467474257) filed under `library/sound/sfx/vehicle/`; S6 radio `electric_radio-press-cutout-blip_01` (0.38 s, v2, seed 1029350719) under `sfx/electric/`. Locked in `src/videos/edu-ep21/assets.lock.json` (`public/sfx/vehicle/`, `public/sfx/electric/`). Cue sheet: 15 of 15 rows done, no `NEEDS-GEN`, W5.2s ticked.
- Fit check S6: `electric_glitch-blip-soft_01` is 0.3 s with one burst in the first 0.1 s (100 ms RMS -13 then -65 dB), no click-tick-falling-two-note shape, no pitch fall; does not fit as well as a new take, so generated new. S5: library search (tyre, hiss, steam, creak) found only a passing bike and a plunger; generated new.
- Measured only (100 ms RMS and centroid envelopes, clip count 0); not listened. S6 is the riskier one: file is 0.38 s against 0.6 s on the sheet and click, tick and falling two-note blip cannot be told apart by measurement (centroid falls 8 -> 11 -> 4.4 -> 0.3 kHz, hard stop at 0.4 s). S5 'steam tick' is not identifiable by measurement. Listen to S6 first, then S5.
- levels.checks: S5 (21.1-21.5 s, peak -6..3) and S6 (26.4-26.9 s, min 12) no longer provisional. The S5 row's `peak` window is unchanged from the sheet; the file is peak-normalised, Editor sets clip gain.
- Models unloaded after TG4.

## W5.2 Boss BG1 exterior and strike — 2026-11-16

Boss, from EDU-EP21-SHEETS-R1, BRIEF-R4, ROWS-R5 and the locked looks `out/edu21/looks/{r3-final,r4b}`. Not committed.

- **Plates:** one file per shot, [B01-SH01](../../../src/painted/edu21/shots/B01-SH01.tsx) (G0–29), [B01-SH02](../../../src/painted/edu21/shots/B01-SH02.tsx) (G29–100) and [B01-SH03](../../../src/painted/edu21/shots/B01-SH03.tsx) (G100–223), with cameras as on the sheet. The shot map is [shots/index.ts](../../../src/painted/edu21/shots/index.ts) (all 13 rows; key frames for groups other than BG1 are placeholders), the adapter is [shot.tsx](../../../src/painted/edu21/shot.tsx) and the inventory is `src/painted/shots/edu21.tsx`, registered in `src/painted/registry.ts` by `new-shot.mjs`. The stills entry is [shots-index.tsx](../../../src/painted/edu21/shots-index.tsx): `EDU21-<id>` per shot, plus `EDU21-SEQ` from G0 to the first shot not yet built.
- **Assets:**
  - N3/N4 [driver.ts](../../../src/painted/edu21/driver.ts): the P31 seat with authored hand states wheel/face/thighs, an FK blend on bone angles and lengths, and the `B01_DRIVER(G)` track shared by SH01 and SH02.
  - N5 near [bolt.tsx](../../../src/painted/edu21/bolt.tsx): a seeded channel, an in-canvas body and an SVG `BoltGlow`. It is `.tsx`, not the `.ts` the brief named, because it holds JSX.
  - The exterior stack [exterior.ts](../../../src/painted/edu21/exterior.ts) holds the LF01 order for motion, plus `paintRain`.
- **LF03 defects at plate stage:**
  - Defect 1: the hard edge of the wet smear is now a feathered mask (`glow.tsx` filter `ep21-wetedge`) plus `paintAsphaltLip` in `road.ts`.
  - Defect 2: verge water (`VERGE_PUDDLES`, sky mirror, rain rings) replaces the grey bands. LF03 uses it in `look.tsx`. In plates it is opt-in (`puddles`), see Q3.
  - Defect 4: palm P1 is moved to x −60, z −200 (SD10).
  - Defect 3 (hue) is left to BG3.
  - Re-rendered looks are in `out/edu21/looks/w5-bg1-r2{,-clean}`. LF01 against r3-final scores PSNR 47.8 dB; it changes only at the palm and the lip.
- **Shared fixes:**
  - `road.ts` `mirrorCam(c)`: the wet mirror was pitch 0. It is now exact for any pitch (`y → −y`, `pitch → −pitch`), and `glow.tsx` uses it too.
  - `car.ts`: for lenses above the beltline (`c.y > 0.94`) the lower body's top face over the cabin is skipped. Instead it draws a dark tub, the far door lip under the driver and the near lip over her, and an outline broken inside the cabin. Lenses at or below 0.92 keep the single hull, so the look frames do not change.
  - **Note to BG3:** `glowFaces` and `shellPolys` still include that belt top for high lenses.
- **Deviations (Boss, recorded):**
  - The bolt tip is 3.8 m high, not 6 m, because 6 m projects off-frame in the SH01 lens.
  - The SH02 lower door is in shade (washes 42100 and 42101) because the flat red door failed the caption band (mean 0.31–0.33).
  - The P12 face targets are raised to cheek height (see the finding below).
  - The SH01 car runs x −22…1190, so "both ends in frame" is not met (the approved LF01 has the same issue).
  - The SH03 car lead is 368–389 px, as the sheet's recorded exception.
- **Measured:**
  - Projection ([bg1-measure.py](short/bg1-measure.py), `python3 -I`):
    - SH01 car roof→FR contact: 492–499 px. DRIVER: 260–263 px.
    - SH02 DRIVER hip→crown: 777–842 px. Face y 600–623.
    - SH03 car: 389→368 px. FR contact max y 1160. P1 is clear of her head.
  - `caption-zone.py --band 1176:1344` on clean frames, all pass:
    - SH01: 0.236–0.240 / p95 0.298.
    - SH02: 0.189–0.226 / 0.323–0.349.
    - SH03: 0.236–0.250 / 0.327–0.341.
    - LF01 re-render: 0.240 / 0.341.
    - LF03 re-render: 0.417 / 0.524, a fail. r4b was 0.426 / 0.527. The cause is the glow pool (BG3/Editor).
  - Seek parity: `EDU21-SEQ` at G0, 12, 28, 29, 53, 99, 100, 153 and 222 against the per-shot stills gives 67.9–77.7 dB.
  - Sheets: `out/qa/edu21/bg1/final/sheet-B01-SH0{1,2,3}.png`.
- **Finding (kit):** on the four-head card the seated shoulder (y ~0.89 m) sits under a car door's beltline (0.92 m). The kit P12 hand targets (0.07–0.14 m over the shoulder) leave both hands hidden behind the door in a side lens. Raise the targets to cheek height, about 0.15–0.17 m. This is a proposal for `poses` P12 seated, for user review.
- **Finding:** blending arm points linearly shortens the arm in the middle of the move. Blend the bone angles and lengths instead (`armFk`).
- **Open questions to Film:**
  - Q1: bolt tip 6 → 3.8 m.
  - Q2: the SH01 "both ends in frame" accept cannot be met with the SD04 camera.
  - Q3: verge puddles in every exterior, or only the SH06/SH10 lens? (Puddles in the SH01/SH03 lenses replace the approved LF01 verge with a mirrored car in the caption band.)
  - Q4: the LF03 band luma still fails.
  - Q5: the SH03 roof sweep is subtle from this lens; it carries on the side-frame top.

## W5.2 Boss BG2 cabin — 2026-11-16

Boss, from EDU-EP21-SHEETS-R1, BRIEF-R4, ROWS-R5, the approved LF02 (`out/edu21/looks/r3-final/LF02.png`) and the BG1 modules. Not committed.

- **Plates:** [B01-SH04](../../../src/painted/edu21/shots/B01-SH04.tsx) (G223–315), [B02-SH05](../../../src/painted/edu21/shots/B02-SH05.tsx) (G315–408), [B04-SH09](../../../src/painted/edu21/shots/B04-SH09.tsx) (G765–822), [B05-SH12](../../../src/painted/edu21/shots/B05-SH12.tsx) (G1011–1105), cameras as on the sheet, scaffolded with `scripts/new-shot.mjs`. Key frames set in [shots/index.ts](../../../src/painted/edu21/shots/index.ts). `EDU21-SEQ` now runs to the end of the last built shot; unbuilt rows play a labelled black placeholder ([shots-index.tsx](../../../src/painted/edu21/shots-index.tsx)).
- **Assets and shared changes** (all opt-in; LF02 and BG1 repaint unchanged, see Measured):
  - [cabin.ts](../../../src/painted/edu21/cabin.ts): `rainRun` (glass streaks slide on t, seek-safe), `sheen` (lining and A-pillars, SH04), `lens: 'side'` (SH12 order: her seat back before her, console after, no passenger seat back), `radio` (screen panel with flicker light and the power button `RADIO_BUTTON` with press travel), `paintCabinFront` (the cabin seen through the windscreen) with `cheat.dashDy`. The wheel and roof furniture moved into `paintWheelUnit`/`paintRoofFurniture` with the same seeds and order.
  - [car.ts](../../../src/painted/edu21/car.ts): `bonnetLens` (lens over the bonnet: no wheels or arches, no lower-body faces behind the greenhouse, greenhouse ink only). The r1 SH05 frames showed the near-clipped FR tyre as a large dark oval over her and the rear deck as a red line across her chin.
  - [driver.ts](../../../src/painted/edu21/driver.ts): `paintDriverAt` takes a held `view` (SH12 `left`), head and lean fields (`lean`, `headYaw`, `headTilt`, `headPitch`, `nod`, `faceState`) and `reachL`. **Bug fix:** `poseFor` returns `view: 'front'` for the arm frame and it was spread into `fig`, which forced every back view to the front card (latent in BG1, whose lenses are front or profile). The view is now dropped from `fig`.
  - N4 `new: radio reach` (`leftShoulderW`, `reachArm`, `B04_DRIVER`): solved in world metres on the kit bones (`BONE` 0.26 m ×2 + hand 0.085 m) from the leaned left shoulder, projected, then inverted through the back three-quarter card (mirror, `quarterGeo` kt·kr, `cardSquash`) so `back.ts` paints the wrist on the projected target.
- **N4 answer (sheet open item):** with the sheet's lean (10° forward, 8° toward −z) the leaned shoulder (−0.071, 0.825, 0.192) is 0.601 m from the button (0.519, 0.85, 0.08); the card arm reaches 0.605 m, elbow 14° off straight. The button stays where the sheet put it; the fallback (0.519, 0.86, +0.11) is not needed (0.597 m, 20°). Without the lean it is 0.691 m (short). Crop `out/qa/edu21/bg2/r3/crop-SH09-press.png`: the hand lands on the button's bezel end at L28–29, the screen flickers at L32, dead at L36.
- **Deviations (Boss, recorded):**
  - SH05 cheat: the dash front edge, cluster hood and wheel are drawn 0.26 m lower for this lens only (`cheat.dashDy`). On the four-head card her chin (y 0.955) is under the wheel top (1.11) and the hood (1.075), and her shoulders (0.87) under the dash top (1.0). At the sheet's eye of 1.15 m the r1 frame showed a floating head cut at the chin, with the wheel and hood across her mouth and about 150 px of figure. At −0.20 the visible figure was 427–493 px. The sheet's "cluster hood below her chin (540, 813)" projected the cluster face, not the hood top (≈ 710, above her chin). Near plane 0.05 m so the bonnet runs to the frame bottom; the bonnet is in a wet shade wash (caption band); the cabin is clipped to the windscreen.
  - SH05 head turn 20° toward +z: the kit front view has no head yaw, so it is a `nod` (−0.07 head) plus the eye look. The right-elbow pull-in L50–60 is authored but hidden under the dash.
  - SH09 forward lean: a back card cannot lean into depth, so the card leans 8° to screen left (−z) and sinks 1.2 cm; the arm is solved with the full 10°/8° lean. The button travel (4 mm) is under her hand; the flicker carries the press.
  - SH12: the lower cabin falls into shade (six full-width washes from y 1010 down). The hands on the thighs were lit in the caption band (p95 0.73). Slight banding shows on the blouse.
  - SH04 sheen tuned to the sheet's +8 %: lining Y 75.7 → 81.8 (+8.1 %) from L67 to L76; the crop over the A-pillar area 73.0 → 76.9.
- **Measured:**
  - Projection ([bg2-measure.py](short/bg2-measure.py), `python3 -I`):
    - SH04 hip→crown 790→745 px; visible (crown → her seat-back top) 445→414 px.
    - SH05 hip→crown 606→668; visible (crown → hood top, with the cheat) 490→568; face y 614→613.
    - SH09 hip→crown 795→915; visible 679→912; radio (439,798)→(431,812), button (481,810)→(476,826), cluster (627,744)→(636,757).
    - SH12 hip→crown 799→870; face y 667→664.
  - `caption-zone.py --band 1176:1344` on 39 clean key frames, all pass:
    - SH04: 0.203–0.204 / p95 0.250.
    - SH05: 0.105–0.188 / 0.150–0.217.
    - SH09: 0.163–0.181 / 0.199–0.250.
    - SH12: 0.141–0.153 / 0.355.
  - Seek parity: `EDU21-SEQ` rendered in shuffled order at G0, 12, 28, 29, 100, 222 (BG1) and G223, 290, 314, 315, 349, 407, 765, 794, 801, 821, 1011, 1054, 1104 (BG2) against the per-shot clean stills: 68.1–87.0 dB ([log](../../../out/logs/edu21-bg2-seq-parity.log)).
  - BG1 regression: all 22 BG1 key stills re-rendered against `out/qa/edu21/bg1/final-clean/` ≥ 67.8 dB. Look frames against their references: LF01 70.7 dB, LF02 (r3-final, approved) 76.9 dB, LF03 71.9 dB.
  - Cuts F−1/F/F+1 at G222–224, 314–316, 765–766, 820–821, 1011–1012 and 1103–1104 from `EDU21-SEQ`: hard cuts only, no pops inside a shot (`out/qa/edu21/bg2/cuts/sheet-cuts.png`).
  - Sheets: `out/qa/edu21/bg2/final/sheet-{B01-SH04,B02-SH05,B04-SH09,B05-SH12}.png` (per second and every key frame).
  - Checks: `tsc` clean for edu21 (15 errors elsewhere, edu18/three and tests, already there before this pass); `eslint src/painted/edu21`: 7 unused-import errors in `look.tsx` and `car.ts` `BODY_C`, already there before this pass, none in BG2 code; `npm test` 431/460 pass, the same 28 failing files as the BG1 run (`@remotion/three` missing), context map 0 uncovered.
- **Finding (kit, proposal for user review):** the four-head seated card in a real-size cabin puts her chin (0.955 m) under the wheel top (1.11) and the dash (1.0). Side and rear lenses hide this. A front lens through the windscreen needs an eye above about 1.43 m, or a per-lens cheat. Record in `docs/dev-findings.md` at delivery.
- **Open questions to Film:**
  - Q6: SH05 dash/hood/wheel cheat of −0.26 m. The world-true alternative is eye about 1.45 m (just under the roof line) with a new `hy`: the windscreen then fills the frame and the bonnet leaves it.
  - Q7: SH04 visible lead 414–445 px (under 480; hip→crown 790→745 passes). The headrest covers most of her head from about L60 on the sheet camera. Accept as the LF02 family, or end at yaw −104→−106?
  - Q8: the SH09 forward lean is a screen-left card lean, and the button press is hidden under the hand. Acceptable?
  - Q9: the SH05 head turn is a nod plus gaze, not a turn of 20°.
  - Q10: the SH12 lap shade falloff (slight banding on the blouse).


## W5.2 Boss BG3 explanatory glow — 2026-11-16

Boss, from EDU-EP21-SHEETS-R1, BRIEF-R4, ROWS-R5, LF03 (`out/edu21/looks/w5-bg2/LF03.png`) and the BG1/BG2 modules. Not committed.

- **Plates:** [B02-SH06](../../../src/painted/edu21/shots/B02-SH06.tsx) (G408–548), [B04-SH10](../../../src/painted/edu21/shots/B04-SH10.tsx) (G822–930), [B05-SH13](../../../src/painted/edu21/shots/B05-SH13.tsx) (G1105–1320), cameras as on the sheet, scaffolded with `scripts/new-shot.mjs`. Key frames set in [shots/index.ts](../../../src/painted/edu21/shots/index.ts). SH06 runs on u = L / (N − 1), so its last frame is exactly the camera SH10 starts on (SD02). SH13 is two segments: the eased pull-back to L125, then the 2 % settle.
- **Assets and shared changes** (all opt-in; BG1, BG2 and LF01–LF03 unchanged, see Measured):
  - New [explain.tsx](../../../src/painted/edu21/explain.tsx): the plate-stage choices the three shots share. `plateGlow` (red-orange flank, tight pool, fresnel keyed to the contact line), `paintNearShade`, `paintFlankShade` with `flankFloorFor` (the flank height that projects at a picture y), `wetPolys`, `EXPLAIN_TUFTS`, `Chip` (text is the Q1 placeholder).
  - [glow.tsx](../../../src/painted/edu21/glow.tsx):
    - `GlowStage` (roof, run, flank, ridge, sill, pool levels for the sheet's timed build) and `GlowPlate` (redOrange `#ff6420`, fresnel, tight pool, flankFloor).
    - `GlowLight` takes `stage`, `plate`, `branch` (SH10 inner branch) and `ids` (SH13 uses its own SVG ids). `flankPart` is exported.
    - For a lens above `HIGH_LENS_Y` (0.94), `glowFaces` drops the belt top and keeps only the near door lip.
  - [car.ts](../../../src/painted/edu21/car.ts):
    - `HIGH_LENS_Y`, `beltLipPts`. `shellPolys` uses the two lips for a high lens, not the whole belt top.
    - `bonnetBehind` (SH10, SH13): the end tops (bonnet x ≥ 1.05, rear deck x ≤ −1.55) are painted before what is inside. The rear deck painted after her ran as a pink line across her face through the glass, the same defect BG2's `bonnetLens` met. With this option, a lens close enough to lose body corners behind it skips the body hull ink (it drew a false straight line across the door at SH13 L0).
  - [exterior.ts](../../../src/painted/edu21/exterior.ts): `underCar`, `overCar`, `inMirror` hooks and `warm` (SH13 horizon). [road.ts](../../../src/painted/edu21/road.ts): `toneMix(k)` (live → `TONE_EXPLAIN`). [cabin.ts](../../../src/painted/edu21/cabin.ts): `box` and `paintWheelUnit` exported (no behaviour change).
- **Deviations (Boss, recorded):**
  - Plate design to pass the caption band (LF03 Q4):
    - The near shoulder and verge are in shade (`paintNearShade`); the base band luma was 0.244 with no pool at all.
    - The pool is tight under the car, and the road's reflection falls off toward the lens (fresnel, from contact +28 px to +173 px). The pool and mirror are therefore shorter than in LF03.
    - In SH10 and SH13 the near lower flank and wheels under the height that projects at y 1120 / 1140 are in shade, with the coat cut there.
    - At SH13 L0–45 the near door top (lip, upper door, window-bottom trim) is in shade, easing out by L45; it filled the band in the close opening.
  - SH10 inner branch starts at the cowl z 0.55, not 0.80: from 0.80 the whole route ran behind the A-pillar from this lens.
  - SH06 pool: the mirrored lit flank in the wet road shows as a warm slab with straight edges under the car (approved LF03 design, kept).
  - Sag 0.06 m is not drawn in SH10/SH13 (BG4 owns the sag transform).
  - SH13 "rain sheeting over the metal" is not drawn (rain marks only).
- **Measured:**
  - Projection ([bg3-measure.ts](short/bg3-measure.ts), `npx tsx`, imports the shot cameras; log `out/logs/edu21-bg3-measure.log`):
    - SH06 roof → contact 381 → 405 px (LF03 lens family, under 480: sheet exception); DRIVER hip → crown 197 → 207.
    - SH10 405 px at L0–30 → 907 px at L107; face (397, 833) → (354, 974).
    - SH10 cluster (0.519, 0.97, 0.38) projects at (510, 864) → (545, 1052), 4–21 px from the A-pillar's inner edge.
    - SH13 roof → contact 1257 px (L0) → 488 (L125, sheet 488) → 476 (L214).
  - `caption-zone.py --band 1176:1344` on 37 clean key frames, all pass (log `out/logs/edu21-bg3-cz.log`):
    - SH06: 0.190–0.218 / 0.243–0.326 (full pool at L139).
    - SH10: 0.128–0.218 / p95 0.194–0.391 (L107 the highest).
    - SH13: L0 0.165 / 0.294, hold 0.243–0.245 / 0.279–0.292.
  - Flank hue: LF03 hue 11°, saturation 0.36 (dull, beige read); BG3 hue 12°, saturation 0.53 (coral red-orange).
  - Seek parity: `EDU21-SEQ` in shuffled order at G408, 414, 482, 547, 822, 852, 883, 891, 929, 1105, 1181, 1230, 1319 against the per-shot clean stills, plus G100, 407, 821, 1104 against BG1/BG2: 69.9–86.6 dB ([log](../../../out/logs/edu21-bg3-seq-parity.log)).
  - Regression:
    - All 62 BG1/BG2 key stills re-rendered (`out/qa/edu21/bg3/regress/`) against their final-clean stills: ≥ 67.9 dB.
    - LF01–LF03 (`out/edu21/looks/w5-bg3/`) against w5-bg2: 70.6 / 76.5 / 72.2 dB ([log](../../../out/logs/edu21-bg3-regress-psnr.log)).
  - Cuts F−1/F/F+1 at G407–409, 547–549, 821–823, 929–931 and 1104–1106 from `EDU21-SEQ`: hard cuts, SH09 → SH10 lands on SH06's end lens (`out/qa/edu21/bg3/cuts/sheet-cuts.png`). SH10 flicker G884–890: `out/qa/edu21/bg3/cuts/sheet-flicker.png`.
  - Sheets: `out/qa/edu21/bg3/final/sheet-{B02-SH06,B04-SH10,B05-SH13}.png` (per second and every key frame); clean stills `out/qa/edu21/bg3/final-clean/`.
  - Checks:
    - `tsc`: 15 errors, all outside edu21 (already there).
    - `eslint src/painted/edu21`: the same 7 unused-import errors as BG2, none in BG3 code.
    - `npm test`: 431/460, the same as BG2; the context map passes.
- **Finding (proposal for dev-findings at delivery):** in a painted car, the end tops (bonnet, rear deck) drawn after the figure seated inside cross the figure through the glass from any lens above the beltline. No line of sight to the open tub crosses them, so paint them before the interior. Seen in BG1 B01-SH02 (thin line, not changed here), BG2 SH05 and BG3 SH10/SH13.
- **Open questions to Film:**
  - Q11 (delivery Q1): chip text "ภาพอธิบายแบบง่าย" is a placeholder in all three shots.
  - Q12: plate design against LF03:
    - near-ground shade;
    - flank and wheel shade in SH10/SH13;
    - SH13 door-top shade L0–45;
    - the fresnel-shortened pool and mirror.
    
    Accept as the BG3 look?
  - Q13: the SH10 inner branch and the dash cluster lie behind the A-pillar on the sheet camera (cluster within 4–21 px of the pillar's inner edge), so the branch reads only faintly through the glass at L78. Options:
    - end yaw 34 → about 28 (more windscreen), or
    - move `at` toward +x.
  - Q14: the SH10 cluster diagram (cyan) at L0–60 reads only as a small bloom at the beltline from eye 0.65–0.8. The flicker L61–68 does not read at sheet size. The live dash stays dark as sheeted.
  - Q15: the SH13 echo coat at 0.25 of SH06's coat (L76–110) is barely visible on the sheet. Raise it to about 0.5?
  - Q16: sag 0.06 m in SH10/SH13 waits on BG4.
  - Q17: the SH06 pool's mirrored flank shows straight edges (LF03 design).
  - Q18: B01-SH02 (BG1) shows the same thin line across her face. `bonnetBehind` is available; BG1's call.

## W5.2 Boss BG4 consequences — 2026-11-17

Boss, from EDU-EP21-SHEETS-R1 (car states, SD05–SD07, SD12), BRIEF-R4, ROWS-R5 and the BG1–BG3 modules. Not committed.

- **Plates:** [B03-SH07](../../../src/painted/edu21/shots/B03-SH07.tsx) (G548–636), [B03-SH08](../../../src/painted/edu21/shots/B03-SH08.tsx) (G636–765), [B05-SH11](../../../src/painted/edu21/shots/B05-SH11.tsx) (G930–1011), cameras as on the sheet, scaffolded with `scripts/new-shot.mjs`. Key frames set in [shots/index.ts](../../../src/painted/edu21/shots/index.ts); every row now has its keys. All 13 shots are built: `EDU21-SEQ` runs G0–1320 with no placeholder.
- **Assets and shared changes** (all opt-in; BG1, BG2, B02-SH06 and LF01–LF03 unchanged, see Measured):
  - Kit [ycam.ts](../../../src/painted/kit/ycam.ts): optional `YCam.body` (`YBody`, `bodyPoint`), a rigid pre-transform of every world point the camera sees, applied in `camSpace`. Absent = unchanged. Everything drawn through such a camera (projection, `wp`, `camUnit`, the figure anchor) moves as one body.
  - [car.ts](../../../src/painted/edu21/car.ts):
    - Sag transform `sagBody(s)` / `sagCam(c, s)` about the rear-left contact (−1.30, 0, −0.75); `SAG_FULL` 0.06. `CarOpts.sag`: the body, greenhouse, glass, the arches and everything `inside` (cabin, dash, DRIVER) are painted through the sagged camera, so they stay rigid together; the road, the contact shadow and the tyres stay on the road camera. Measured rigidity: max distance error 8.9e−16 m between hip, roof corners, glass, cluster and the FR corner; corner drops FR 0.060, RR 0.032, FL 0.028, RL 0 m; her hip moves (4, −37, 8) mm.
    - FR damage `frDamage` (`FrDamage`: `scorch` 0..1 readability, `split` opening m, flattening from `sag`) replaces the unused W3 prototype `damagedFR`. Scorch on the outer sidewall's lower-rear quadrant (232°, r 0.20–0.30 m): ragged ashy halo `#3a2a22`, darker char core, a tapered split under a thin raised lip; matte, no glow. Flattening: the hub drops with the body, the lower tyre spreads up to 26 % at the road, a pale bulge crescent and a wet contact line. `FR_DONE` = SH08's end state (SH10, SH11, SH13). Intact wheels draw exactly as before (same 29-point ring).
    - `inkBreakWheels`: the car outline is broken where it crosses the visible-side tyres (the hull's lower edge ran as a straight dark-red line across the FR tyre in the SH07/SH08 close lenses).
  - [glow.tsx](../../../src/painted/edu21/glow.tsx): `GlowPlate.coatMaxY`, the coat on the metal cut under a picture y (screen 40 px fade, canvas clip).
  - **Sag in SH10 and SH13** (the sheet's "CAR21 sag 0.06 m" / "the whole sagging car", Q16): both opt in with `sag: SAG_FULL, frDamage: FR_DONE`; the coat, body shades, flank floor and dash bloom take the sagged camera, the road, near-ground and wheel shades and the fresnel line stay on the road camera. SH10 needed `coatMaxY: 1165`: the sagged nose brought the lit bonnet into the band at L102–107 (p95 0.59). Interiors (SH04, SH05, SH09, SH12) are not changed: they ride with the car (no visible tilt), as the sheet says.
- **Per shot:**
  - SH07: held on her right profile to L46, descent L47–82 on the sheet's ease (first movement L47, "ดู" L50). `worried` L0–3, `relieved` L4–43 with the breath (shoulders −2 cm L4–30) and eyes shut L10–18, `neutral` from L44. Sag 0 → 0.02 m L47–82. Scorch readability 0 → 1 over L62–72 (the FR enters the frame at L64; readable from L70, so the B03 reveal is not spent before the descent lands); split a 2 mm hairline. B01-SH02's door shade, stopped at x 0.93 (short of the arch) and easing out L47–75; near ground in shade from L55 (band).
  - SH08: sag 0.02 → 0.06 m over L0–100 ease-out, split 2 mm → 1 cm L20–60, scorch full from L0 (GD1: the damage reads with no caption). Steam: seven slim seeded wisps from the split, `#c9d0d6` at most 30 %, rising 0.05–0.32 m on a 1.6 s cycle, thinning to 45 % by L128; no column. Puddle r 0.6 m round the tyre (dark water, sky sheen, rain rings, none drawn under y 1160).
  - SH11: sagging car, `FR_DONE`, no steam ("nothing burns or smokes"), dash dark; DRIVER `neutral`, tint 0.45 (a dim figure), still; `warm` 0.05; far sky flicker L30 (full) and L31 (trailing): a screen-lit cloud base left of the car, above the horizon only, no bolt.
- **Deviations (Boss, recorded):**
  - Sag angles: the sheet's "est roll 1.6°, pitch 0.8° at 0.06 m" drop the FR corner 0.078 m. The sheet's 0.06 m wins; the angles keep its 2:1 ratio (roll 1.23°, pitch 0.61°).
  - SH07 view `right` held (as SD08): the lens moves forward past her, and the eight views popped her to a front three-quarter at L48 in the r1 frames.
  - SH07 scorch fades in (L62–72) rather than sitting in a contact shade: the tyre is off frame until L64, so the fade is never seen as a change of the object.
  - SH08 camera on u = L / 129 (the sheet's run: contact 1112 → 1171 at L128); on L / 128 the last contact fell to 1176.
  - SH01–SH06 do not draw the damage at all (unreadable = absent; BG1–BG3 untouched).
  - The DRIVER card is moved by the sag (anchor, size) but not rolled 1.23° (sub-pixel to 6 px at these leads).
  - The road pool under SH10/SH13's glow is drawn through the sagged camera (≤ 0.04 m, inside a 46 px blur).
- **Measured:**
  - Projection ([bg4-measure.ts](short/bg4-measure.ts), `npx tsx`, imports the shot cameras and tracks; log `out/logs/edu21-bg4-measure.log`):
    - SH07: start face (540, 620), hip → crown 562 px (sheet 561); end FR top 620 → contact 968 at x 520 (tyre 348 px, hub (520, 800)), above y 1000; scorch centre (438, 907); her face leaves at (42, 408). The scorch is off frame to L60 and enters at L64 (level 0.10), (620, 1018) at L70 (0.90).
    - SH08: tyre 554 → 591 px, contact 1115 → 1175, hub 848 → 911 (the flat), scorch centre 1010 → 1097 (above 1160).
    - SH11: car (sagged silhouette top → lowest contact) 582 → 599 px (≥ 480); FR contact 1149 → 1126; her face (447, 705) → (449, 667).
    - SH10 with the sag: 395 px at L0 (BG3 405); her face (395, 840) (BG3 (397, 833)).
    - SH13 with the sag: 476 px at L125 → 464 at L214 (BG3 488 → 476; sheet ≥ 480 from L125), see Q20.
  - `caption-zone.py --band 1176:1344` on 57 clean key frames, all pass (log `out/logs/edu21-bg4-cz.log`):
    - SH07: 0.095–0.239 / p95 0.150–0.289.
    - SH08: 0.158–0.189 / 0.229.
    - SH11: 0.207–0.212 / 0.291–0.298.
    - SH10 (sagged): 0.137–0.223 / 0.249–0.353.
    - SH13 (sagged): 0.116–0.245 / 0.176–0.361.
  - Seek parity: `EDU21-SEQ` in shuffled order at 28 frames over all 13 shots (G0, 29, 100, 222, 223, 315, 408, 547, 548, 558, 618, 635, 636, 646, 736, 764, 765, 821, 822, 929, 930, 960, 1010, 1011, 1104, 1105, 1230, 1319) against the per-shot clean stills: 67.4–87.3 dB ([log](../../../out/logs/edu21-bg4-seq-parity.log)).
  - Regression ([log](../../../out/logs/edu21-bg4-regress-psnr.log)):
    - 73 BG1/BG2/SH06 key stills against `out/qa/edu21/bg3/{regress,final-clean}`: 67.5–88.0 dB (unchanged).
    - SH10 15 stills 22.0–28.9 dB and SH13 11 stills 19.1–26.2 dB: changed by intent (the sag opt-in).
    - LF01–LF03 (`out/edu21/looks/w5-bg4/`) against w5-bg3: 70.6 / 77.3 / 72.1 dB ([log](../../../out/logs/edu21-bg4-looks-psnr.log)).
  - Cuts F−1/F/F+1 at all 12 boundaries (G28–30, 99–101, 222–224, 314–316, 407–409, 547–549, 635–637, 764–766, 821–823, 929–931, 1010–1012, 1104–1106) from `EDU21-SEQ`: hard cuts, no placeholder, no pop inside a shot (`out/qa/edu21/bg4/cuts/sheet-cuts-{1,2}.png`).
  - Sheets: `out/qa/edu21/bg4/final/sheet-{B03-SH07,B03-SH08,B05-SH11,B04-SH10,B05-SH13}.png` (every key frame plus every 15 f for the BG4 shots); clean stills `out/qa/edu21/bg4/final-clean/`.
  - Checks: see the task line (tsc, eslint, npm test, context map).
- **Finding (proposal for dev-findings at delivery):** a prop that tilts as one rigid body (a sagging car with a figure inside) is cheapest as a camera pre-transform (`YCam.body`): every painter that projects through the camera follows, with no per-part transforms, while parts that must stay on the ground (tyres, contact shadow) keep the plain camera.
- **Finding:** a 2D figure card's view follows the lens; a lens that travels past a seated figure crosses an eight-view cut mid-move (SH07 at L48). Hold the view for the move (as SD08).
- **Open questions to Film:**
  - Q19: SH11 reads the sag and the flat mostly through the rim close to the road, the pale bulge and the scorch (tyre 156 px; 6 cm is about 15 px). Accept, or a stronger cheat for this lens only (e.g. 0.09 m)?
  - Q20: with the sag, SH13's car is 476 px at L125 and 464 px at L214 (sheet ≥ 480; BG3 without the sag was already 476 at L214). Accept, or segment B ends at r 3.9 (or eye 0.95)?
  - Q21: SH07's scorch readability fade L62–72 (off frame until L64). Accept as "scorch readable from L70"?
  - Q22: SH08 steam is seven faint wisps (≤ 30 %), barely visible at sheet size; stronger?
  - Q16 (BG3): closed by this pass, the sag is drawn in SH10 and SH13.

## W5.2 Film plate review — 2026-11-17 (Film)

- Answers to Boss Q2–Q22 (Q1/Q11 chip wording with Preaw/Boat; Q16 closed) and the sound questions S1/S8/M1: [scene-sheets.md decision log](short/scene-sheets.md#plate-review-decisions-w52-sheets-r2), **EDU-EP21-SHEETS-R2** (no voice retime, IDs and G ranges unchanged); rows EDU-EP21-ROWS-R6.
- Judged on the QA sheets `out/qa/edu21/bg{1,2,3,4}/final/sheet-*.png` (viewed at sheet size and 480 px crops of SH02 L24, SH03 L56/60, SH06 L139, SH10 L78/107, SH08 L10, SH11 L60, SH13 L90) plus Boss's measured numbers. Accept: Q2, Q3, Q4, Q6, Q8, Q9, Q12, Q17, Q20, Q21. Change: Q5, Q7, Q10, Q13, Q14, Q15, Q18, Q19, Q22.
- Boss fix batches: **FX1** B01-SH02, B01-SH03, B01-SH04, B05-SH12; **FX2** B04-SH10, B05-SH11, B05-SH13, B03-SH08.
- SH10 yaw estimate: a level pinhole of the sheet form (`/private` scratch script, not the kit `camMove`) put the cluster (0.519, 0.97, 0.38) about 61 px left of the near A-pillar centreline at end yaw 34 and about 92 px at yaw 28 (eye 1.25); smaller yaw = more door glass, larger = behind the pillar then through the windscreen (≥ 52). Estimate only; Boss measures with `bg3-measure.ts`.
- Finding: Ton's S1 level row window 0.10–0.30 s (G3–9) sits before the strike (G12); level windows for a hit must be taken from the cue's frame, not the beat start.

## W5.2s Ton cue sheet, SHEETS-R2 notes - 2026-11-17 (Ton)

- `sound-cues.json` only, no generation: S1 `levels.checks` rows replaced by 0.40-0.60 s dV >= 4 (S1 exception) and 0.60-2.0 s dV >= 12; S8 note (plays whole, G852-882); M1 placement gets `offsetRule` and `states` (D-M1), "major colour" dropped from its map.

## W5.2f Boss FX1 — 2026-11-17

Boss, from EDU-EP21-SHEETS-R2 (decision log D-Q5, D-Q7, D-Q10, D-Q18; SD14) and the Film plate review above. Base revision 28bc641 plus the uncommitted W5.2 plates. Not committed. FX2 (SH08, SH10, SH11, SH13) untouched.

- **Changes** (shot files only; no shared module changed):
  - [B01-SH02](../../../src/painted/edu21/shots/B01-SH02.tsx) (D-Q18): `car.bonnetBehind: true` (the BG3 option): the end tops are painted before her, so the rear deck edge seen through the cabin stays behind her. Crop `out/qa/edu21/fx1/crop-SH02-face-base-vs-r1.png` (top R1, bottom FX1, L8/24/54/70): the red line across her cheek/chin is gone; it now shows only in the glass beside her head.
  - [B01-SH03](../../../src/painted/edu21/shots/B01-SH03.tsx) (D-Q5): the roof sweep is one 0.7 m highlight travelling a 2.66 m path, across the windscreen header (TF z −0.64 → +0.64) then down the near drip rail (TF → TR at z +0.64). Each piece is 0.2 m across the edge on the face the lens sees (windscreen / side-frame top, v 0.775–1 of the 0.88 m slant), twice the other sweeps (0.1 m), with a thin roof strip and an 8-weight core on the edge (others 4). Level cap 0.8, frames L53–67 + 6 f fade unchanged; S3 tick frames unchanged.
  - [B01-SH04](../../../src/painted/edu21/shots/B01-SH04.tsx) (D-Q7, SD14): `camMove(..., [-104, -106], ...)`; `CAM` exported for the measure.
  - [B05-SH12](../../../src/painted/edu21/shots/B05-SH12.tsx) (D-Q10): the six stepped washes are replaced by one SVG `linearGradient` overlay from y 1010 (alpha 0) to 1300 (0.70, held below), stops following the R1 stack's summed cover.
- **Measured:**
  - SH04 ([fx1-measure.ts](short/fx1-measure.ts), `npx tsx`, every frame L0–91; log `out/logs/edu21-fx1-measure.log`): head outline clear of the headrest **75–76 %** on every frame (R1 72–75 %), head area clear 79–82 % (R1 down to 71 %); the headrest's left edge stays right of her head centre (x 701–709 vs head x 691; R1 reached 637 vs 661). Lead ([bg2-measure.py](short/bg2-measure.py), yaw updated): hip→crown 790 → 731 px; **visible crown → seat-back top 445 → 402 px** (L67 413, L91 402): the sheet's accepted 414–445 is not held for the last ~25 frames (open question).
  - SH03 roof read (`caption-zone.py --band 745:795 --x 300:650` as a region luma probe on the roof edge): L56 mean/p95 0.379/0.801 → **0.430/0.920**, L60 0.346/0.795 → 0.443/0.923, L64 0.385/0.915. On the 270 px tiles of `sheet-r2-SH03.png` the white top edge reads at L56–64 (viewed). [bg1-measure.py](short/bg1-measure.py) unchanged: car 389 → 368 px, FR contact max y 1160; SH02 hip→crown 777–842 px, face y 601–623.
  - SH12 band luma vs R1 (`caption-zone.py --band 1176:1344`, L0/40/47/70/93): mean 0.140–0.149 (R1 0.141–0.153), p95 0.317–0.322 (R1 0.355): not lighter. Sub-bands at L47 are all darker than R1 (1010–1060 0.230 vs 0.238; 1110–1176 0.181 vs 0.194).
  - `caption-zone.py --band 1176:1344` on the FX1 clean key frames, all pass: SH02 0.190–0.226 / 0.323–0.349; SH03 0.236–0.250 / 0.327–0.341; SH04 0.203–0.205 / 0.250; SH12 0.140–0.149 / 0.317–0.322.
  - Regression: 140 clean key stills of all 13 shots rendered before the edits (`out/qa/edu21/fx1/base-clean/`) and after (`final-clean/`), PSNR log `out/logs/edu21-fx1-regress-psnr.log`: untouched shots SH01 70.8–71.7, SH05 72.2–76.4, SH06 70.8–74.1, SH07 72.2–76.2, SH08 73.6–75.5, SH09 75.2–77.5, SH10 71.5–73.8, SH11 67.3–68.0, SH13 70.1–74.4 dB; SH03 outside the roof sweep (L0, 20, 74, 95, 122) 67.5–69.4 dB. Changed as intended: SH02 44–55, SH03 L53–66 31–41, SH04 L10–91 24.6–30.6 (L0 76.9), SH12 38.6–39.4 dB.
  - Seek parity: `EDU21-SEQ` at G28, 29, 53, 99, 100, 156, 160, 222, 223, 290, 314, 315, 1010, 1011, 1058, 1104, 1105 rendered in shuffled job order against the per-shot clean stills: **67.5–86.6 dB** (`out/logs/edu21-fx1-seq-parity.log`).
  - Cuts F−1/F/F+1 at G28–30, 99–101, 222–224, 314–316, 1010–1012, 1104–1106 from `EDU21-SEQ` (labelled): hard cuts only, no pop inside a shot (`out/qa/edu21/fx1/cuts/sheet-cuts-{a,b}.png`, viewed).
  - Sheets (labelled, key frames + every second, viewed): `out/qa/edu21/fx1/final/sheet-{B01-SH02,B01-SH03,B01-SH04,B05-SH12}.png`; before/after `out/qa/edu21/fx1/sheet-r1-SH04.png`, `sheet-r1-SH12.png`, `sheet-r1-SH03.png` (R1 first try, too thin) and `sheet-r2-SH03.png`.
  - Checks: `tsc` 15 errors, none in edu21 (same as BG2); `eslint` on the four shot files and `fx1-measure.ts` clean; `npm test` 431/460 pass, 29 failing files as BG4 (`@remotion/three` missing); `context-map.py` 0 problems, 448 modules, 0 uncovered (entry added for `fx1-measure.ts`).
- **First try (R1, recorded):** the roof sweep with 0.1 m on the roof plane plus 0.1 m on the face read as a faint wash at L56 (the roof plane is edge-on from the eye at ~1.5 m); all 0.2 m moved to the face the lens sees.
- **Open questions to Film:**
  - FX1-Q1: SH04 visible lead at yaw −106 is 445 → 402 px (under the accepted 414 from about L67). Measured alternatives at L91 (bg2-measure math): −105 gives 404 px, R1 −100 gave 414; holding 414 needs the R1 yaw, which the head-clearance fix rules out, or a shorter pull-back (r end < 1.42). Recommend accepting 402–445 as the SD14 exception (her hip→crown stays 731–790 px).
  - FX1-Q2: SH03 roof band at L53 is zero length (it enters at L53 and covers the header from L54); the base had a band already at L53. "หลังคา" is G155 (L55), so it lands at L54–56, within ±3 f.

## W5.2f Boss FX2 — 2026-11-17

Boss, from EDU-EP21-SHEETS-R2 (decision log D-Q13, D-Q14, D-Q15, D-Q19, D-Q22; SD16, SD17) and the Film plate review above. Base revision 28bc641 plus the uncommitted W5.2 plates and FX1. Not committed. FX1 shots (SH02, SH03, SH04, SH12) not touched.

- **Changes:**
  - [B04-SH10](../../../src/painted/edu21/shots/B04-SH10.tsx) (D-Q13, D-Q14, SD16):
    - End yaw 34 → **28**. The sheet's fallback was measured and not used: moving the end `at` +x by 0.05–0.15 m puts the cluster behind the pillar (cluster end −12 to −15 px at L78).
    - The branch is its own screen layer, [glow.tsx](../../../src/painted/edu21/glow.tsx) `BranchLight`. It replaces the near-white 6 px stroke inside `GlowLight` (the `branch` prop is removed; SH10 was the only user). Coat hue `GLOW.band` at alpha 0.62, 5 px with a 0.8 px blur. It has an arrival bloom r 20 px at the route end (L50–61, full L53–57) and is clipped to the near side windows and the windscreen, so where it passes behind the A-pillar foot the metal hides it.
    - `BRANCH` route lifted 4–7 cm over the dash top: (1.0, 0.98, 0.52) → (0.84, 1.03, 0.48) → (0.66, 1.06, 0.43) → (0.52, 1.04, 0.38). With the eye at 0.78–1.07 m over L51–78, the R1 route on the dash top projected onto the door glass's lower edge (L51) and then under it, behind the door. That is why it never read.
    - Diagram cluster and radio wash 128 → 204 (cyan 80 %). `DashBloom` is now a radial bloom r 30 px at the cluster top (0.519, 1.0, 0.38) plus r 18 on the radio, clipped to the glass, opacity 0.85 × `clusterLit`, so the flicker L61–68 switches it and it is off from L69. DRIVER is not lit: no change to her painter.
  - [B05-SH11](../../../src/painted/edu21/shots/B05-SH11.tsx) (D-Q19, SD17): `SAG_SH11` 0.09 m body sag. The tread spreads for 0.09 m (uncapped scale, 39 % at the road). The hub drops only `HUB_SH11` 0.03 m (new [car.ts](../../../src/painted/edu21/car.ts) `FrDamage.hub`, absent = `sag`; the contact line's spread is now `sag / SAG_FULL`, identical up to 0.06). With a physical hub drop (= sag) the arch-to-tyre gap does not change, so the arch has to come down onto the tyre to read. Other shots are unchanged (SH10/SH13 keep 0.06, no `hub`).
  - [B05-SH13](../../../src/painted/edu21/shots/B05-SH13.tsx) (D-Q15): echo coat 0.25 → 0.5 of SH06's.
  - [B03-SH08](../../../src/painted/edu21/shots/B03-SH08.tsx) (D-Q22): steam coefficient 77 → 115 (45 %) held L0–60, thinning to 20 % at L128. Wisps are 1.5× wider and rise 0.05 → 0.45 m (was 0.32). The envelope `sin(π ph)^0.8 (1 − 0.45 ph)` keeps them visible over the whole rise (R1 faded out by 0.33 m). Sideways sway is ±0.1 m and aft drift 0.12 m so stacked wisps sit apart.
  - Chip N7: "ภาพอธิบายแบบง่าย" is final (user, 2026-11-17). The placeholder marking is removed from the comments in explain.tsx, glow.tsx, SH06, SH10 and SH13; the text and box are unchanged. Measured in frame (SH10 L60): border and text at x 60–386, y 196–255 (327 × 60 px; the sheet's ~360 × 56: same width class, 4 px taller, as LF03), no clipping (`out/qa/edu21/fx2/chip-crop.png`, viewed).
- **Measured:**
  - [fx2-measure.ts](short/fx2-measure.ts), `npx tsx`, log `out/logs/edu21-fx2-measure.log`. SH10 over L51–78, sagged camera:
    - The route crosses the near A-pillar's foot from every candidate (route vs pillar hull −24 to −25 px at L78 for yaw 34, 28 and `at` +x 0.05/0.10/0.15). Its windscreen end is seen through the windscreen and the cluster through the door glass.
    - Route end (cluster top) vs pillar: yaw 28 −2 px at L51, yaw 34 −11, `at` +x −12 to −15.
    - Cluster face centre (0.97) vs pillar: yaw 28 9 / 11 / 13 / 15 px at L51 / 60 / 69 / 78, yaw 34 5 / 5 / 4 / 2. Lower yaws scanned: yaw 14 with `at` −x 0.15 reaches 17 / 26 / 37 / 48. No end camera of this move gives ≥ 30 px at L51, where the push has hardly started.
    - Head clearance ≥ 123 px (accept ≥ 60): pass.
  - SH10 branch value (render with alpha 0.62 against alpha 0, diff mask, `out/qa/edu21/fx2/vprobe/`). Branch p90 V 0.678 / 0.698 / 0.702 at L55 / 69 / 78, against the warm coat's peak 0.804 / 0.808 / 0.773: **0.84–0.91**. Against the frame's brightest pixel (rain included, 0.87–0.91): ≥ 0.78. Width: 7 px per column including the blur halo (5 px core); the coat's ridge stroke is 30 px, so the branch is ≤ ¼ of it.
  - [bg3-measure.ts](short/bg3-measure.ts) (log `out/logs/edu21-fx2-bg3-measure.log`): SH10 at yaw 28 roof → contact 405 px at L0–30 (unchanged) → 882 px at L107 (BG3 907); her face (397, 833) → (341, 975) (sheet end (354, 971)); cluster (549, 1052) vs pillar inner (599, 1081) at L107.
  - SH11 (fx2-measure, R1 → FX2):
    - Arch gap FR 15.5 → −3.5 px (the arch now sits on the tyre top); RR 4.6 → 0.6 px.
    - FR width near the top 86 px; at the road 104 → 100 px at L40.
    - FR lowest tyre-ring point y 1174 → 1169 at L40 (1159 at L80).
    - [bg4-measure.ts](short/bg4-measure.ts) (updated to `SAG_SH11`; log `out/logs/edu21-fx2-bg4-measure.log`) gives the FR road contact centre at 1149 → 1126, above 1160 (accept pass), and the car at roof → contact 581 → 599 px. Its FR top and hub lines assume hub = sag, so they read 0.06 m low for SH11.
    - Crop R1 vs FX2: `out/qa/edu21/fx2/r3-sh11-crop-r1-vs-fx2.png`. Tiles: `out/qa/edu21/fx2/r4-sh11-tiles.png` (viewed): the FR sits up in its arch and the car leans visibly further onto the nose.
  - SH13 L90 (`out/qa/edu21/fx2/r1-sh13-l90.png`, viewed): the warm coat on the roof frame and flank reads on the 270 px tile, faint. Flank box mean RGB (0.484, 0.254, 0.252) → (0.499, 0.272, 0.264); clearly there by L105–110 on the sheet.
  - `caption-zone.py --band 1176:1344` on 48 clean frames (log `out/logs/edu21-fx2-cz.log`), all pass:
    - SH08 0.158–0.189 / p95 0.229.
    - SH10 0.128–0.223 / 0.194–0.353.
    - SH11 0.209–0.214 / 0.292–0.298.
    - SH13 0.116–0.246 / 0.176–0.361.
  - Regression: all 142 FX1 clean key stills re-rendered (`out/qa/edu21/fx2/final-clean/`) against `out/qa/edu21/fx1/final-clean/`, log `out/logs/edu21-fx2-regress-psnr.log`.
    - Untouched shots: SH01 70.9–72.0, SH02 74.1–78.2, SH03 67.9–69.4, SH04 76.0–77.8, SH05 72.0–77.0, SH06 70.6–74.0, SH07 72.2–76.1, SH09 75.3–77.1, SH12 86.2–87.6 dB.
    - Changed by intent: SH08 28–35; SH10 L0–27 53–57 (cyan 80 % bloom), L30–107 23–45; SH11 25.7–25.8; SH13 L90–125 35–52, elsewhere 70.1–74.4 dB.
    - LF01–LF03 (`out/edu21/looks/w5-fx2/`) against w5-bg4: 70.7 / 77.5 / 71.9 dB (`out/logs/edu21-fx2-looks-psnr.log`).
  - Seek parity: `EDU21-SEQ` at 17 frames (G636, 646, 696, 764, 822, 852, 873, 882, 891, 900, 929, 930, 970, 1010, 1105, 1195, 1319), rendered in shuffled job order, against the per-shot clean stills: **67.5–74.1 dB** (`out/logs/edu21-fx2-seq-parity.log`).
  - Cuts F−1/F/F+1 at G635–637, 764–766, 821–823, 929–931, 1010–1012, 1104–1106 (labelled): hard cuts only (`out/qa/edu21/fx2/cuts/sheet-cuts-{a,b}.png`, viewed).
  - Sheets (labelled, key frames + every 15 f, viewed): `out/qa/edu21/fx2/final/sheet-{B03-SH08,B04-SH10,B05-SH11,B05-SH13}.png`. SH10 accept strip L30/40/51/60/65/68/69/78: `out/qa/edu21/fx2/final/sheet-SH10-accept.png`. Its 3× zoom of the 270 px tiles: `out/qa/edu21/fx2/sh10-tile-zoom3x.png`. In the zoom the branch reads L40–78 (it starts at L30 with travel 0), the cyan bloom reads at L51/L60 and is gone at L68/L69. On the plain 270 px tile the 5 px branch is about 1 px and reads only faintly.
  - Checks:
    - `tsc` 15 errors, none in edu21/ep21 (same as FX1).
    - `eslint` on the edited files: only the existing `BODY_C` unused in car.ts (not FX2 code).
    - `npm test` 431/460, the same 29 failing files as FX1.
    - `context-map.py` 0 problems, 448 modules (entry added for `fx2-measure.ts`).
- **Finding (proposal for dev-findings at delivery):** a line drawn on a car's dash top cannot be seen through the side glass from a lens at or below dash height. The dash top projects onto the glass's lower edge and then behind the door. An explanatory path inside a car needs a lens above it, or a route lifted to the visible band of the glass, and it needs clipping to the glass so it never paints over the pillar or the door metal.
- **Open questions to Film:**
  - FX2-Q1 (SH10, D-Q13 accept): "branch route ≥ 30 px clear of the A-pillar's inner edge over L51–78" is not reachable with this move. The route runs from the windscreen base (seen through the windscreen) to the cluster (seen through the door glass), so it always crosses the pillar foot. Even the cluster itself is only 9–15 px clear at yaw 28. Built as: the branch is hidden behind the pillar foot for about 25 px and reads on both sides. Options:
    - accept as built;
    - a much lower end yaw (≈ 14) with `at` −x 0.15, which gives the cluster ≥ 30 px from about L60 (not at L51) and changes the end framing;
    - a windscreen-side view (yaw ≥ 52), where the whole route sits in the windscreen.
  - FX2-Q2 (SH11): the FL is hidden from this lens. Built and measured against the RR, the only other visible wheel. Both arch gaps are now small, because the RR also drops 0.048 m with the rigid roll. The FR difference reads as the tyre sitting up in its arch and the nose lower. Accept, or keep a visible RR gap? A non-rigid sag would be needed for that.
  - FX2-Q3 (SH08): the 45 % wisps rise as separate soft blobs along the tyre's rear edge, not joined (`out/qa/edu21/fx2/r5-sh08.png`). They read as fresh steam at L0–60; confirm they do not read as bulges on the tyre.

## W5.2f Film decisions on FX1/FX2 — 2026-11-17 (Film)

- Decisions in [scene-sheets.md fix-batch log](short/scene-sheets.md#fix-batch-decisions-w52f-sheets-r3), **EDU-EP21-SHEETS-R3** (no voice retime, IDs and G ranges unchanged); rows stay EDU-EP21-ROWS-R6 (no seen text changed).
- Judged on `out/qa/edu21/fx1/final/sheet-B01-SH03.png`, `sheet-B01-SH04.png`, `out/qa/edu21/fx2/final/sheet-B04-SH10.png`, `sheet-SH10-accept.png`, `sheet-B03-SH08.png`, `out/qa/edu21/fx2/sh10-tile-zoom3x.png`, `r4-sh11-tiles.png`, `r5-sh08.png` (viewed) and Boss's numbers above.
- Accept: FX1-Q1 (SH04 lead 402–445, SD14 widened), FX1-Q2 (SH03 roof band L54), FX2-Q1 (SH10 as built; the R2 "≥ 30 px clear of the A-pillar" clause came from Film's own level pinhole, which put the cluster 61–92 px clear where Boss measured 9–15 px: replaced by a 3× zoom (phone-scale) read with ≤ 30 px pillar occlusion allowed), FX2-Q2 (SH11 compared with the RR). Change: FX2-Q3, the SH08 wisps sit on the tyre's front edge as pale lumps (bulge misread) → **FX3** (Boss, B03-SH08 only): spawn 0.06 m aft of the tyre silhouette, fade in over the first 0.12 m of rise.
- Finding: an accept clause that needs "visible on a 270 px tile" fails by design for a deliberately thin element (a 5 px line at 1080 is ~1 px on the tile); for thin explanatory marks the visibility check should be at phone scale (3× zoom of the tile or the 0.75 frame), and accept numbers from a Film estimate must be marked estimate-dependent until Boss measures.


## W5.2f Boss FX3 — 2026-11-17

Boss, from EDU-EP21-SHEETS-R3 D-FX2-Q3 (B03-SH08 block). Base revision 3f050e1 plus the uncommitted W5.2 plates, FX1 and FX2. Not committed. Only [B03-SH08](../../../src/painted/edu21/shots/B03-SH08.tsx) changed; no shared module touched.

- **Change:** each wisp is born `WISP_GAP` 0.06 m aft of the tyre's rear silhouette edge (`tyreRearX`: the lens-side sidewall z 0.86 at the birth height, with car.ts's tread spread below the hub; from this front-quarter lens the outer ring is the rear silhouette) at the split's height + 0.05 m, z 0.89 (lens side). Its alpha is multiplied by a linear fade-in from 0 over the first `WISP_FADE` 0.12 m of rise. Unchanged: peak 45 %, rise 0.45 m, sway ±0.1 m, aft drift 0.12 m, 1.5× width, thinning to 20 % by L128. The wisp maths moved into the exported `steamWisps` (same values, used by the painter and the measure).
- **Measured** ([fx3-measure.ts](short/fx3-measure.ts), log `out/logs/edu21-fx3-measure.log`): steam opacity per pixel from the clean FX3 still against a no-steam probe render (STEAM_PEAK 0, reverted; `out/qa/edu21/fx3/nosteam/`), L0–60 every 5 f, inside the tyre outline below the arch-lip line:
  - worst 2.3 % (accept ≤ 15 %), 0 pixels above 15 % on any frame: **pass**.
  - every wisp centre outside the outline (centres x 125–267 px against the outline's rear edge at 293–317 px); the frame's brightest steam pixel outside on all 13 frames: **pass**.
  - Visual: `out/qa/edu21/fx3/tyre-crop-2x-L0-60.png` (2× the 270 px tile scale; L0/15/30/45/60 left to right) against `tyre-crop-2x-fx2-before.png` (FX2 L0/20/40/60), viewed. The wisps now rise beside the tyre's rear edge, over the arch shadow and the red sill, and leave the tread and sidewall clean.
- `caption-zone.py --band 1176:1344`, 22 SH08 frames: mean 0.158–0.189, p95 0.229, all pass (`out/logs/edu21-fx3-cz.log`).
- Seek parity `EDU21-SEQ` G636 / 646 / 696 / 764 against the shot's clean stills: 73.1 / 73.0 / 73.5 / 72.8 dB (`out/logs/edu21-fx3-seq-parity.log`).
- Cuts F−1/F/F+1 G635–637, G764–766: hard cuts SH07→SH08 and SH08→SH09 only (`out/qa/edu21/fx3/cuts/sheet-cuts.png`, viewed).
- Regression: 148 clean key stills against FX2 (`out/logs/edu21-fx3-regress-psnr.log`): every other shot 67.6–87.6 dB (SH01 71.0–71.7, SH02 73.9–78.5, SH03 68.2–69.9, SH04 76.4–77.9, SH05 72.0–76.9, SH06 70.8–73.9, SH07 72.2–76.1, SH09 75.8–76.8, SH10 71.6–73.9, SH11 67.6–68.1, SH12 85.7–87.6, SH13 70.3–74.6); SH08 25.3–33.5 by intent, the difference confined to the steam area (`out/qa/edu21/fx3/diffs.png`).
- Sheet (labelled, key frames + every 15 f, viewed): `out/qa/edu21/fx3/final/sheet-B03-SH08.png`.
- Checks: `tsc` 15 errors, none in edu21/ep21 (as FX2); `eslint` on the edited files clean; `context-map.py` 0 problems (entry added for `fx3-measure.ts`, `fx3-crop.sh`); `npm test` 12 failing files, none edu21 (`out/logs/edu21-fx3-npmtest-fails.txt`): the FX2 set minus the files the fast suite no longer runs, plus `tests/scene-assembly.test.ts` (`Cannot find module '@remotion/three'`, an install gap, not this change).
- **Open question to Film (FX3-Q1):** born 0.06 m aft of the tyre, the steam no longer starts at the split (the scorch sits about 0.1 m further forward, low on the sidewall), so it reads as steam rising from behind the tyre rather than out of the wound. Accept as built (D-FX2-Q3 asked for it), or bring the birth height down toward the split so the link reads more directly?

## W5.3 Editor Draft cut — 2026-11-17

Editor. Base 3f050e1 plus the uncommitted EP21 tree (W5.2 plates, FX1-FX3; B03-SH08 mtime 09:00 includes FX3 `WISP_GAP`; the draft used it). Not committed. Stage named before each render (`Render stage: ...`). Handoffs: SHEETS-R3, SCRIPT-R1, VOICE-R2, cue sheet `sound-cues.json`.

- **Preflight:** package pins `@remotion/*` 4.0.538; `node_modules` lacked `@remotion/three` (declared, used by edu18), so `render.mjs` failed at bundling. Fixed locally with `npm install --no-save --no-package-lock --ignore-scripts @remotion/three@4.0.538` (no package.json/lock change; any fresh checkout needs `npm ci`). `store.py fetch` listed unrelated legacy items missing from the store; the EP21 locks (12 sounds) were present. `node scripts/test.mjs tests/videos.test.ts` 4/4 pass; `context-map.py` 0 problems.
- **Composition:** [index.ts](../../../src/videos/edu-ep21/index.ts) via `assemblePaintedTimeline` from the shot index (13 scenes), `A_fade` over 24 f (the sheet says only "A_fade"; Editor's choice), `captionStyle` outline, `bottomEdgeY` 1344, mark `outline` look as EP20; no overlay (chip is painted in SH06/SH10/SH13). [cues.ts](../../../src/videos/edu-ep21/cues.ts) = the 21 caption cues of the sheet verbatim, empty events in the gaps and after G1236. Four cues carry one authored `\n` at a word boundary: C03, C05a, C10 (caption-breaks MAY-WRAP) and C02b (measured ink x177-903, 15 px past the x888 safe edge; now x329-751). Text unchanged.
- **Narration:** [narration-place.py](narration-place.py) cuts the VOICE-R2 file at 21.135 s, +10 f GD1 filled with room tone (quietest 0.08 s of the gap, -51.8 dB mean-square, 40 ms equal-power tiles, 25 ms joins), tail room tone G1238-1320. Placed onsets measured on the output: L01 G3.0, L07 G645.9 (sheet 646.0), L12 end G1230.3 (sheet 1230.1); GD1 G634-644 -53.4 dBFS rms (not digital silence), tail -66 dBFS.
- **Sound:** [sound-mix.py](sound-mix.py) + [sound-mix-gains.json](sound-mix-gains.json): the 15 cues at the sheet's frames, D-S1 (S1 file start G8, crack G12), D-S8 (whole 1.0 s G852-882), D-M1 (entries at bar-snapped file offsets: G410 -> file 13.04 s, G822 -> 26.09 s, 92 bpm bar 2.609 s, file onsets at 10.43/20.86/31.30 s), GD1 room tone, ambience A1/A2/A3 with 3 f crossfades, END1 G1230. Cue sheet `levels.stems` filled, `exempt` lists the stems and baked stem, `sources` lists sound-mix.py; `sound-cues.py` passes (15 cues). Gains are the Editor's (the sheet has no per-cue level): ambience -20, bed -17.5, S1 -13, S3 -6, S7 -16, S4 -14 (echo -20), S4r -16, S5 -2.5, S6 -12, S8 -22, END1 -2 (dB on the file as stored).
- **Mix deviations from the sheet, each by a cue-sheet row:** (1) M1 first fade-out G298-306, not from G315: the B02 `drop` row (10.6-13.5 s, dV >= 30) measured 19.7 with the sheet's G315 fade because the 400 ms meter still sees bed; now silent in the window. (2) "low under L08" (music map) = bed down 10 dB G765-778 so the B04 `drop` row (G802 cut) passes: 34.8 (was 18.7). (3) G548-765 lighter state -2 dB instead of -4 (the 180 Hz high-pass already costs about 4 dB; -4 gave B03 bed dV 26.9). (4) S5 ducked 14 dB from G641-648 (L07 starts G646) and set so its check row stays inside tolerance. (5) S7 lowered to -16 because the voice + S7 sum clipped at G361 (+0.1 dBFS true peak before, -0.5 after).
- **Measured** (`out/logs/edu21-mix-levels.log`; `python3 -I scripts/mix-levels.py scripts/edu-series/ep21/sound-cues.json`, exit 0, no FAIL): voice speech -15.8 LUFS (M), mix integrated -15.8 LUFS, mix true peak -0.5 dBFS, mix minus voice 0.0 LU; layers dV speech: bed 19.4, ambience 20.6, accent 20.7, background 15.4; five warnings, all inside tolerance: B02 bed 20.6 (> 20), B03 background 14.6 (< 15), B03 bed 23.4 (> 20), B04 accent S8 13.5 (< 15), plus the two exception rows ok* (S1 over "ใช่" dV 13.5 at G12-18 vs row >= 4; S3 ticks 16.6). Final cut audio (AAC, `ebur128`): I -15.8 LUFS, LRA 3.8 LU. **Not listened:** none of the cues, the mix, the room-tone joins, the M1 bar-snapped entries, the S1 over "ใช่" intelligibility (EP08a ear check), END1 or the fade were heard; D-S1 says raise to dV >= 8 if the ear loses "ใช่", currently 13.5.
- **Picture:** half-size draft `clips.mjs --full --draft`: 13 of 13 scenes painted, 187.9 s (log `out/logs/edu21-draft-cut.log`); a second run repainted 0 of 13 (cache). `ffprobe`: 540x960, 30 fps, 1320 frames, 44.000 s, AAC 48 kHz stereo. Sheets (viewed): `out/qa/edu21/draft/sheet-1.png`, `sheet-2.png` (18 stills), `sheet-seconds-a.png`, `sheet-seconds-b.png` (every second of the draft cut), `sheet-cuts.png` (G-1 and G at the 12 hard cuts: all clean hard cuts, no flash, caption off/on correct, e.g. G28 no caption, G29 C01b), `samples-4.png`. Stills are full size. Backward-seek parity (frames 1290, 880, 800, 460, 14 rendered again in reverse order): PSNR 70.8-76.1 dB against the first render, not bit-identical.
- **Caption legibility over the warm pool:** `caption-zone.py --band 1176:1344` on caption-free frames: SH06 G488 mean 0.193 / p95 0.243; SH10 G823 0.196 / 0.249, G870 0.203 / 0.264; SH13 G1170 0.146 / 0.282, G1250 0.245 / 0.291; all pass (limits 0.25 / 0.40). Thresholds were met with Boss's plate fixes (LF03 was 0.426 / 0.527). On the caption frames the white fill over its dark stroke reads on all 21 cues (viewed at 270 px tiles). Ink extent, all 21 cue mid-frames: x 177-903 for C02b before the `\n`, everything else x 193-885; after: all inside x120-888, y 1180-1329.
- **Samples:** [manifest](../../../out/samples/edu21/EDU-EP21-SHORT/draft-r1/manifest.md) (ignored out/): SH01 G13, SH06 G460, SH09 G800, SH13 G1215, native 1080x1920. Last frame G1319 is black by `A_fade`.
- **Open for Film/user:** (a) `A_fade` length 24 f chosen by Editor; (b) the sheet's S1 first row may need dV >= 8 after an ear check; (c) `clips.mjs` rewrote `short/review-rows.json` (added `clips.draft` keys per shot; backup of the earlier copy at `out/logs/edu21-review-rows-before.json`); the review page is not republished (coordinator).

## W5.2f Boss FX4 — 2026-11-17

Boss, from EDU-EP21-SHEETS-R4 (D-U1–D-U3, SD19/SD20, B01-SH01 and B05-SH13 blocks, "R4 build brief — Boss fix batch FX4"). Base 3f050e1 plus the uncommitted EP21 tree (W5.2, FX1–FX3, Editor W5.3). Not committed. Changed: [bolt.tsx](../../../src/painted/edu21/bolt.tsx), [B01-SH01](../../../src/painted/edu21/shots/B01-SH01.tsx), [B05-SH13](../../../src/painted/edu21/shots/B05-SH13.tsx), new [fx4-measure.ts](short/fx4-measure.ts) (context-map entry added). No timing, narration, caption, other shot or shared kit module touched. No fallback needed.

- **bolt.tsx (N5 owner):**
  - `BoltOpts.path` (tip first) and `branches` (fork point + points). Each segment is split in three with a seeded perpendicular jitter ≤ 0.05 m (`jitterPath`). The BG1 random walk stays only as the default when no path is given.
  - Widths per call (`BoltWidths`, SH01 defaults `BOLT_W` core 8→6, body 20, halo 56; branches 3→1 / 8 / 24).
  - The tip pool (`BoltGlow`) and the in-canvas `paintBolt` are removed. The whole bolt is a screen layer (`Bolt`: halo screen blur σ 12 at 0.7, body, tapered core), then `BoltFlare` (core disc, #e6eeff screen glow, four seeded rays 30–50 px). Shots draw it after the kit `Flash`, so the order is Flash → halo/body/core → flare.
  - `boltEnv('single' | 'double', d)` gives the brief's envelopes as pure functions of d = L − strike. The leader is drawn from the frame top to 45 % / 85 % of the visible channel at 0.5 / 0.6, core #c9d6ff 3 px with ≤ 3 stubs (the first 30 % of each branch forking on the drawn part).
  - `paintStrikeRim(p, c, contactPx, level, edge)` paints the silhouette outline and wash (moved from the SH01 inline rim, same ids 41700/41701), plus the struck edge #ffffff 5 px, full within 120 px of the contact and 0 by 300 px. The edges are `ROOF_EDGE_NEAR` and `BONNET_EDGE`. **Interface note:** the brief's signature had no edge argument; a fifth optional `edge` (default the near roof edge) was added, because the bonnet strike lights a different edge.
- **B01-SH01:** T = (−0.70, 1.49, 0.62) (0.02 m inside the roof's near edge z 0.64), the sheet's eight waypoints and four branches, `double` on STRIKE 12. Flash 0.40 / 0.15 / 0.30, then linear to 0 by G21, under the bolt. Rim and lit rain on G12–13 and G15–16. Camera, driver track, far fork and frame 0 unchanged (L0, L7 and L28 are 71.0–71.5 dB against FX3).
  - Projected T is (247, 732) at L0 and (235, 727) at L29, as on the sheet. Her crown is (390, 754), 145 px away.
- **B05-SH13:** E1 `single` at L143 (BOLT1, T1 (−0.75, 1.49, 0.62)) and E2 `double` at L161 (BOLT2, three +x branches), both through `cb`. Flash per the sheet. Flinch track `driverAt`: lift 3 cm, back 1.5 cm, `surprised` L143–158 and L161–178, then `neutral`. The breath out (shoulders down 2 cm, L179–191) is held to the end: the sheet does not say whether it recovers, Boss chose hold. Rain 100 → 55 % and `warm` on L167–215. Chip and tone untouched.
  - **Deviation T2:** z 0.55 → **0.70**, i.e. T2 = (1.60, 0.873, 0.70) (bonnet top y at x 1.60 from car.ts PROF). At z 0.55 the flare core overlapped the bonnet edge line by only 5.8 px (accept ≥ 6). The bonnet top is a ~5 px sliver from this eye height. Projected T2 moves (824, 796) → about (799, 798).
  - **Deviation E1 body:** 18 → **19 px**. With 18 the measured core+body was 17.0–17.2 px, under the 18–24 accept; it is now 19.0.
- **Measured** ([fx4-measure.ts](short/fx4-measure.ts), log `out/logs/edu21-fx4-measure.log`; clean stills `out/qa/edu21/fx4/clean/`; probe stills with the bolt switched off, temporary edit since reverted, `out/qa/edu21/fx4/probe/`). Frames SH01 G12/13/15/16 and SH13 L143/144/161/162/164/165:
  - (a) max channel gap **0 px** on every frame.
  - (b) tip to projected T 0.0 px (the path starts at T). Flare core over the struck edge line: 16.0 (SH01), 15.1 (E1), 11.6 px (E2).
  - (c) core luma ≥ 0.95 on **100 %** of samples (162–210 per frame).
  - (c) sky 70 px either side: mean 0.297–0.352, p95 0.374–0.495, 96–100 % of samples ≤ 0.60. The max (0.78–0.85) falls on lit rain streaks (#eef4ff, by design on the full frames), checked on a 2× crop (`out/qa/edu21/fx4/sky-max-l12.png`).
  - (d) luma > 0.85 outside the bolt, flare and rim: 133–328 px² (limit 2000).
  - (e) SH01 core 6.9–8.8, core+body 18.6–19.8 px. E1 core 6.3–7.0, core+body 19.0. E2 core 7.3–7.9, core+body 18.8–20.0. For E1 the second row is y 556 (tip − 80), because the tip is at y 636.
  - (f) max added luma in the face box: SH01 +0.020–0.024 (±60 px), SH13 +0.001–0.017 (±50 px); limit 0.15.
  - (g) **0** bolt pixels in the `@TamMaiLa` box x 112–258, y 122–162, measured from the label on the Draft v1 sample `B01-SH01_G0013` plus 4 px. The SH01 branch from waypoint 6 starts above the frame and crosses y 140 at x ≈ 301, 43 px right of the label; the channel crosses at x ≈ 386.
  - (h) body mean luma SH01 0.327–0.330 (G0 0.277), SH13 0.343–0.367 (L140 0.288). Hue within 0.3–1.9° of the reference (red, no whiteout).
- `caption-zone.py --band 1176:1344` on all 10 strike frames: mean 0.238–0.248, p95 ≤ 0.298, all pass (`out/logs/edu21-fx4-cz.log`). The same band on the no-strike frames G10/G20/L140/L150 is 0.236–0.247, so the Flash adds ≤ 0.002 there: its gradient ends at y 1100. FR contact and camera unchanged.
- Seek parity: `EDU21-SEQ` G10–21 and G1244–1275 (44 frames, rendered in shuffled job order) against the shot's clean stills: **69.7–71.8 dB** (`out/logs/edu21-fx4-seq-parity.log`).
- Cut F−1/F/F+1 G28–30 from `EDU21-SEQ`: clean hard cut SH01 → SH02 (`out/qa/edu21/fx4/cuts/sheet-cut-G28-30.png`, viewed).
- Regression: the 148 FX3 key stills re-rendered clean (`out/qa/edu21/fx4/final-clean/`, log `out/logs/edu21-fx4-regress-psnr.log`).
  - Untouched shots 67.3–87.6 dB: SH02 73.8–78.4, SH03 67.9–69.8, SH04 76.2–77.7, SH05 71.9–76.7, SH06 70.8–74.0, SH07 72.1–76.1, SH08 72.2–74.0, SH09 75.8–76.7, SH10 71.7–73.9, SH11 67.3–68.1, SH12 86.0–87.6.
  - SH01 differs by intent at L12–20 (16.6–38.2); L0/7/28 are ≥ 71.0. SH13 differs by intent at L110–214 (31.6–42.8: warm and rain now start at L167, plus the strikes); its keys before L95 are ≥ 70.
- Sheets (labelled, viewed):
  - `out/qa/edu21/fx4/final/sheet-B01-SH01.png` (the brief's 12 frames) and `sheet-B01-SH01-G8-21.png` (every frame).
  - `sheet-B05-SH13.png` (the brief's 16 frames), `sheet-B05-SH13-G1244-1259.png` and `sheet-B05-SH13-G1260-1275.png` (every frame).
  - Contact 2× crops (full-res 480 px → 240): `out/qa/edu21/fx4/crops/sheet-contacts-2x.png` (G12, G15, L143, L161).
  - (j) on the 270 px tiles the bolt reads as a bright line from the tile top to the roof edge (SH01, E1) and to the bonnet (E2). The leader frames are faint by design (3 px at 0.5/0.6 is about 1 px on the tile).
- Checks:
  - `tsc` 6 errors, none in edu21/ep21 (`out/logs/edu21-fx4-tsc.log`).
  - `eslint` on the four files: clean.
  - `context-map.py` 0 problems, 455 modules.
  - `tests/videos.test.ts` 4/4. The full `npm test` was not run.
- Not verified: Studio scrub (stills and seek parity only); the Editor re-cut of SH01/SH13 and its sound (Ton TG5) are not built; the half-size draft look of the bolt is not rendered (expected core 3–4 px, body 10).
- **Open questions to Film:**
  - FX4-Q1: accept T2 at z 0.70 (0.15 m inside the near bonnet edge) instead of the sheet's 0.55?
  - FX4-Q2: E1 body 19 px instead of 18, so it meets (e)?
  - FX4-Q3: in the hold the breath out (shoulders down 2 cm from L179) is held to the end, not recovered. Keep it?
  - Note for Film: the cold rim outline is the car's picture hull (as in R3). On the strike frames of the SH13 close-up framing it draws a straight line from the roof's rear over to the nose, across the sky above the bonnet (visible at L143/161 on the sheet). Change it to the body outline only?

## W5.3 Editor Draft v2 — 2026-11-17

Editor, fresh invocation. Base 3f050e1 plus the uncommitted EP21 tree (FX4 plates, Ton TG5 cue sheet). Not committed. Handoffs: SHEETS-R4, cue sheet 17 cues. Changed: [sound-mix.py](sound-mix.py), [sound-mix-gains.json](sound-mix-gains.json) (S9a -15, S9b -14 dB on file = S1 -13 minus 2 / 1; the baked stem keeps its file name `EDU-EP21-SHORT-draft-stem-v1.wav` so index.ts and the cue sheet are untouched, content is v2). Narration not rebuilt (unchanged).

- **Placement (frames G):** S9a = S1 file start G1244 (crack lands G1248); S9b file start G1266 (crack 0.02 s in), envelope -6 dB from G1272 (2 f ramp); END1 file start G1272 (was G1230), linear fade 0 to -60 dB G1296-1320 (Editor: the file rings 3.35 s, cut at 1320, so it fades with the rain under `A_fade`); M1 pulse stops G1171 as before, tail now holds to G1230 and fades out G1230-1244 (amplitude, 14 f), bed measured -90 dBFS after G1244 (v1 faded G1171-1260); ambience: A3-light G1178-1240 only, plain A1 G1240-1272 (rain alone before E1), then plain to low-passed (1.4 kHz) over 24 f with -6 dB easing G1272-1320, still faded out G1296-1320. v1 had the low-pass through G1178-1320.
- **Cue sheet:** `sound-cues.py` 17 cues, 16 generated, 1 library, 0 swaps, exit 0 (log in this run). `mix-levels.py` (`out/logs/edu21-mix-levels-v2.log`): voice -15.8 LUFS, mix -15.8 LUFS, mix true peak -0.5 dBFS, mix minus voice 0.0 LU; unchanged v1 warnings (B02 bed 20.6, B03 bed 23.4, B03 background 14.6, B04 S8 13.5, two ok* rows). **Two new FAIL rows, both Ton's row bounds, not a mix error:** B05 S9a peak dV 14.5 and S9b peak dV 13.2 against `min -6 max 3`. The same rows say "peak <= S1 peak"; S1's own peak dV is 12.5, so the two rows cannot both hold. END1 row ok at 1.3. Proposed bounds (Ton): S9a `min 12`, S9b `min 11`. Not edited here (the cue sheet is Ton's); goes back to Ton as a row defect.
- **Stem peaks (accent stem sample peaks, dBFS):** S1 G8-60 -11.0; S9a G1248-1265 -13.1 (2.1 under S1); S9b G1266-1271 -11.9 (0.9 under S1); END1 + tails G1272-1290 -1.3 (END1 is by its own row -6..3 louder than every strike, about 10 dB over S1 in sample peak, 11 dB in 400 ms momentary; Ton's brief "nothing in the hold above S1" conflicts with the END1 row, same defect class). END1 vs rain (accent M minus ambience M) G1275 15.8, G1278 17.2, G1284 20.1, G1290 22.1, G1295 22.6 dB (need >= 6).
- **Picture:** `clips.mjs --full --draft`: repaint 2 of 13 (B01-SH01 scene 1 and B05-SH13 scene 13), 11 reused, 53 s (`out/logs/edu21-draft-cut-v2.log`); only SH01 and SH13 repainted. Cut file ffprobe: h264 540x960 30 fps 1320 f 44.000 s, AAC; ebur128 I -15.8 LUFS, LRA 3.9 LU. Backup of review-rows before the run `out/logs/edu21-review-rows-before-v2.json`; `clips.mjs` rewrote `short/review-rows.json` (clips.draft keys), page not republished.
- **QA sheets (viewed, from the DRAFT file):** `out/qa/edu21/draft-v2/sh01.png` (G8-21 every frame, 270 px tiles; bolt reads as a bright white line from the frame top to the roof edge on G12-13 and G15-16, fainter G17-19, gone G21; leader G10-11 faint by design), `sh13.png` (22 frames G1240-1319: E1 G1248-1250 and E2 G1266-1270 both land and read, the cold outline hull shows on the strike frames (Boss's note), G1296 normal, G1310 dim, G1319 black), `cuts.png` (G-1 and G at all 12 hard cuts: clean, captions off/on correct), caption crop strip `capstrip.png` (SH01 G12/13/15/16).
- **Captions on strikes:** SH13 G1248-1270 carries no caption (the cues end G1236 by the sheet, hold has none), so there is nothing to read there. SH01 G12-16 carries C01a "ไม่ใช่ยางนะ..." : white fill with dark stroke, crisp on every strike frame (crop viewed). Band luma with caption ink included, half-size frames, band 588:672: mean 0.302 (G10), 0.374 (G12), 0.372 (G13), 0.327 (G14), 0.360 (G15), 0.359 (G16), 0.309 (G20); p95 0.343, 0.641, 0.637, 0.428, 0.626, 0.629, 0.353: the lit rain streaks (the plate's #eef4ff) lift the p95 to about 0.63 on the strike frames; the pass limits (0.25 / 0.40) were set on caption-free frames and are not applicable with ink (Boss's caption-free measure of the same frames: 0.238-0.248 / <= 0.298). Full-size G13 still with caption: mean 0.251, p95 0.327 (flag false by 0.001 on mean, ink included). Not a defect by eye; Film/Boss may say whether the lit rain in the band on G12-13/15-16 is acceptable.
- **A_fade and END1:** `A_fade` 24 f: G1310 is dim, G1319 black after the strike hold (the fade still reads), END1 and the rain fade with it. END1 starts at G1272, 6 f after E2's crack, inside the S9b tail (ducked -6 dB).
- **Samples:** [manifest](../../../out/samples/edu21/EDU-EP21-SHORT/draft-r2/manifest.md) (ignored out/): SH01 G13, SH06 G460, SH09 G800 (unchanged), SH13 G1249 (E1) and G1267 (E2), native size, sheet `sheet-270.png` viewed.
- **Checks:** store: draft v2 `store.py put` ok; stems filed under `audio/ep21-draft-v2-stems/` (the `archive --kind audio` call first filed four files flat into `audio/`; moved by hand into the folder; the voice and narration were already stored by content). `context-map.py` 0 problems; no new modules or files in Git (this pass edits two Editor files and three notes).
- **Needs an ear check (not listened):** (1) S1 over "ใช่" (dV 13.5; raise to >= 8 if the word is lost); (2) S9a as a copy of S1 (-2 dB, 4 f of silence before it): does it read as a deliberate rhyme or a repeated clip, if a copy make a sibling take; (3) S9b: steel crack, restrike audible 70 ms later, not horror, same family as S1; (4) END1 over the S9b tail (END1 attack lands G1276, 4 f after the crack of E2; S9a tail 1.6 s also runs to G1292 under it): is the chord clean and does it read as the answer; (5) the gap after the M1 fade: bed silent G1244 to G1272, rain alone G1244-1248 (breath before E1); (6) A1 easing and low-pass G1272-1320 (is the plain-to-muffled change audible as a step at G1272-1296); (7) END1 fade under G1296-1320 (Editor's choice).
- **Not verified:** Studio scrub; random/backward seek of the v2 cut (the FX4 seek parity was Boss's, stills only); the five audio ear checks above.


## W5.3 Editor Draft v3 — 2026-11-17

Editor, fresh invocation, audio only, not committed. **User decision (2026-11-17, after listening to v2): "เสียงฟ้าผ่าตอนเริ่มไม่ได้ยินเลย"** overrides the D-S1 level rows: the opening crack is the hook and must read as lightning on G12.

- **Changed:** [sound-mix-gains.json](sound-mix-gains.json) (S1 -13 to -4.5 dB on file, S9a -15 to -6.5, S9b -14 to -5.0), [sound-mix.py](sound-mix.py) (S1 tail envelope -4 dB G20-24; header), [narration-place.py](narration-place.py) (voice dip), [sound-cues.json](sound-cues.json) (three levels.checks rows, each relation says `user 2026-11-17 audibility override`).
- **S1:** accent stem sample peak G12-20 -11.0 to -2.5 dBFS; voice peak G12-20 undipped -3.6, so S1 is 1.1 dB over the voice peak (target 0..+3). 400 ms RMS: accent -15.8 over G12-15 vs voice -21.1 (dipped). mix-levels row 0.4-0.6 s dV 11.1 to 2.6 (row now -6..3).
- **Tail:** the S1 file has a second rumble at G22-24 (-10.7 dBFS) that met a voice peak of -1.5 and pushed the mix to -0.2 dBFS true peak; S1 tail -4 dB from G20 (ramp to G24) restores -0.5. The 1.6 s tail keeps its shape; S1 tail now -8..-11 dB under the crack.
- **Voice dip:** voice only, baked into `public/narration/EDU-EP21-SHORT-narration-v1.wav` by `narration-place.py` (same file name, generated, not in Git; the narration is its own track so the stem sum cannot dip it): -5 dB, 40 ms attack G10.8-12, hold to G15.5, 150 ms release to G20, linear in dB. Measured voice peak G12-20 -3.6 to -8.0 (-4.4 on the peak; -5.0 at full depth), RMS G12-18 -12.6 to -16.8. Word 'ใช่' (G12-18, 0.4-0.6 s) vs S1: 0.4-0.5 s voice -21.1 vs S1 -15.8 RMS (crack over the word onset), 0.5-0.6 s voice -14.7 vs S1 -24.0 (word 9 dB over the S1 tail), 0.6-0.8 s voice -12.6 vs -27.2.
- **End strikes:** sample peaks S1 -2.5, S9a -4.5 (2.0 under), S9b -2.9 after a +0.5 dB bump (0.4 under; first pass -3.4 and 2.5 dB under S1 in 400 ms RMS); 400 ms RMS momentary S1 -19.2, S9a -21.0, S9b -21.2 (2.0 under S1 after the +0.5), END1 -15.9. END1 vs rain at G1275-1295: accent -17.5 vs ambience -40.8 RMS = 23 dB (>= 6). Rows S9a/S9b (dV against the voice) 12..20 became 3..10 (measured 6.0 and 4.2). END1 row -6..3 unchanged, measured 1.2.
- **Levels:** `out/logs/edu21-mix-levels-v3.log`: voice and mix -15.8 LUFS, mix true peak -0.5 dBFS (mix-levels); draft cut audio sample peak -0.5 (after AAC), 0.3-0.8 s -0.6; exit 0, no FAIL. `sound-cues.py` 17 cues, 16 generated, 1 library, 0 swaps, exit 0 (`out/logs/edu21-sound-cues-v3.log`). Remaining warns are v1 and v2 (B01 background 13.7, bed rows).
- **Render (stage: draft cut, half size):** `clips.mjs --full --draft` repainted 0 of 13, 13 reused, 35 s (`out/logs/edu21-draft-cut-v3.log`); it rewrote `short/review-rows.json` (untracked, review page not republished). Cut: h264 540x960 30 fps 44.000 s, AAC, -15.8 LUFS. Filed as `projects/edu/EDU/draft/EDU-EP21-SHORT-draft-v3.mp4`; stems, baked sound stem and dipped narration copied to `projects/edu/EDU/audio/ep21-draft-v3-stems/` by hand (not manifest entries).
- **Needs an ear check (not listened):** (1) S1 at G12 now clearly lightning, not too harsh as a startle (peak is 1 dB over the voice); (2) 'ใช่' under the dip: clear, dip not pumping; (3) the -4 dB S1 tail from G20 still natural; (4) S9a/S9b now rival S1 and END1 (momentary only 3 dB over S1): the end strikes still land and END1 still reads over their tails.
- **Not verified:** Studio, seek parity (picture and audio gain only), listening. ebur128 over the AAC cut prints a 'True peak' summary of -3.5 dBFS that conflicts with the -0.5 sample peak measured from the decoded file; the decoded sample peak is the number reported.

## W5.3 Editor Draft v4 — 2026-11-17

Editor, fresh invocation, audio only, not committed. **User decision (2026-11-17, after hearing v3): "ขอดังกว่านี้ได้ไหม breakrule ได้"**: louder opening lightning, breaking the mix rules is allowed (the -0.5 dBFS true-peak ceiling, the D-S1 rows, the -5 dB dip limit, the quiet S1 tail). Reference for loudness only (never its audio): `~/ReelsStore/projects/edu/EDU/ep21-sound-ref/references/user/2026-11-17_thunder-sfx-yt-short.mp3`, mean -5.3 dB first loud second, -7.3 LUFS, peak 0 dBFS.

- **Changed:** [sound-mix.py](sound-mix.py) (S1/S9b `SHAPE` chain, master limiter, reads the unlimited dipped narration and rewrites the public narration limited, S1 tail envelope removed), [sound-mix-gains.json](sound-mix-gains.json) (`shape_push_db` 12, `master_ceiling_db` -0.1, S1 0 / S9a -2 / S9b -1 relative to the shaped file peak-normalised to 0 dBFS; END1 unchanged -2), [narration-place.py](narration-place.py) (dip -5 to -9 dB, same G10.8-12 attack, hold to G15.5, release to G20; also writes `out/EDU-EP21-SHORT/audio/narration-dipped-unlimited.wav`, which sound-mix.py reads, so re-running sound-mix.py never limits twice), [sound-cues.json](sound-cues.json) rows (B01 background min 6, S1 0.6-2.0 s min 0, S1 0.4-0.6 relation, S9a/S9b peak -6..3; each relation says `user 2026-11-17 breakrule: louder strike`).
- **Shape chain (ffmpeg, in sound-mix.py):** `acompressor=threshold=0.05:ratio=8:attack=3:release=500:makeup=4, bass=g=5:f=130, volume=+12dB, asoftclip=tanh`, then peak-normalised. Run order is fixed: `narration-place.py`, `sound-mix.py`, `mix-levels.py`, `sound-cues.py`.
- **Master limiter:** per-sample gain = min over +-15 ms of ceiling/|sum| then a 30 ms moving average, applied equally to voice, bed, ambience, accent, the baked stem and the public narration. Max gain reduction 4.2 dB at G10-12, G21-23, G33-34 (S1 crack, tail rumbles meeting voice peaks) and G1266 (S9b crack); everywhere else 0 dB. Decoded sample peak of the draft cut and of the baked stem -0.10 dBFS, 0 samples over 1.0. True peak (ebur128) of the stem sum and mix-levels 0.5 dBFS (inter-sample overs of about +0.6 dB around the crack frames and S9b; sample peak is clean); ebur128 on the AAC cut prints -2.6 (again at odds with the decoded sample peak, as in v3).
- **Numbers (accent stem, post limiter):** S1 crack peak -1.7 dBFS (v3 -2.5); mean over 0.4-1.4 s -14.5 dBFS vs v3 -24.6 (+10.1 dB) and the reference -5.3 (9.2 dB under, goal 8-10); first 0.1 s window -10.7, 0.5-0.6 s -15.8, 0.6-0.8 s -14.5, 0.8-1.4 s -15.4 (the ring now holds about -15, no longer decaying to -27).
- **Voice dip -9 dB** (planned), measured voice RMS 0.4-0.5 s -25.5, 0.5-0.6 s -17.8, 0.6-0.8 s -13.2 (dip released at G20); voice peak 0.4-0.5 s -16.5, 0.5-0.6 s -11.4. **'ใช่' vs S1:** 0.5-0.6 s voice -17.8 vs S1 -15.8 RMS (2.0 dB under the crack body; v3 had the word 9 dB over the S1 tail), 0.6-0.8 s voice -13.2 vs S1 -14.5 (word 1.3 dB over).
- **Mix:** `mix-levels` exit 0, 0 FAIL: voice -15.9 LUFS, mix -15.6 LUFS (v3 -15.8; +0.2 LU mix over voice). Whole cut audio -15.6 LUFS, +0.2 over v3. B01 accent 0.4-0.6 dV -5.5, 0.6-2.0 s 2.0, B01 background 8.1, B05 S9a -1.8, S9b -3.8 (peak dV vs the voice), END1 row -3.9 (row -6..3 ok; v3 1.2). S9a/S9b vs S1, 400 ms momentary: S1 -12.1, S9a -13.0 (0.9 under), S9b -11.7 (0.4 over): within 2 dB. END1 over rain G1275-1295: accent -16.8 vs ambience -40.8 (24 dB, >= 6); END1 is now about 5 dB under S9b momentary; a +3 dB END1 try was reduced by the limiter at G1275 and reverted. `sound-cues.py` exit 0 (17 cues, 16 generated, 1 library, 0 swaps). Logs: `out/logs/edu21-mix-levels-v4.log`, `edu21-sound-cues-v4.log`.
- **Render (stage: draft cut, half size):** `clips.mjs --full --draft`: 0 of 13 repainted, 13 reused, 33 s (`out/logs/edu21-draft-cut-v4.log`); cut h264 540x960 30 fps 44.000 s, AAC. Filed `projects/edu/EDU/draft/EDU-EP21-SHORT-draft-v4.mp4`; stems, baked stem and limited narration in `projects/edu/EDU/audio/ep21-draft-v4-stems/` (by hand, not manifest entries). Review page not republished; `short/review-rows.json` was rewritten by clips.mjs (untracked).
- **Needs an ear check (not listened):** (1) S1 crack at G12: does it read as lightning, and is the soft clip too buzzy or harsh; (2) the ring G15-42 f, now flat at about -15 dBFS instead of decaying: still thunder or a wall of noise; (3) voice dip -9 dB: 'ใช่' intelligible, no pumping when the limiter bites at G10-12 and at the tail rumbles G21-23, G33-34 (up to -4.2 dB on the voice); (4) S9a/S9b strikes equal S1; END1 chord still readable after them (it was not raised); (5) loudness jump between the opening and the narration at G20+.
- **Not verified:** Studio, seek parity, listening.

## W6 Editor Final cut — 2026-11-17

Editor, fresh invocation, not committed, no pin, no delivery render. Base 3f050e1 plus the uncommitted EP21 tree; nothing changed in picture or sound since Draft v4 (rows ROWS-R7, cue sheet `sound-cues.json`).

- **Render (stage: final cut, full size, all 13 shots, gate: W5.3 13/13):** `node scripts/storyboard-page/clips.mjs EDU-EP21-SHORT scripts/edu-series/ep21/short/review-rows.json --full`: 13 of 13 scenes painted (the full-size variant had never been rendered, so 0 reused), 216.1 s (`out/logs/edu21-final-cut.log`). Segments now cached for a later delivery. Cut `out/EDU-EP21-SHORT/clips/_final_cut.full.mp4` (the page gets the 540x960 proxy `_final_cut.mp4`, 10 MB, every shot's `clips.final.src`); `short/review-rows.json` rewritten by clips.mjs (backup `out/logs/edu21-review-rows-before-final.json`).
- **ffprobe (full):** h264 1080x1920, 30 fps, 1320 frames, 44.000 s; AAC 48 kHz stereo (2064 packets, stream 44.01 s).
- **Filed:** `projects/edu/EDU/final/EDU-EP21-SHORT-final-v1.mp4` (`store.py put`, 49.8 MB, sha256 d51dbcd0...). Not published (`store.py publish` is W8.2).
- **Audio vs Draft v4:** ebur128 on both: I -15.6 LUFS, LRA 3.5 LU, true peak -2.6 dBFS; volumedetect decoded max -3.1 dB, mean -18.6 dB; decoded PCM of the final and the draft v4 cut compare byte-identical (`cmp`). The decoded peak is -3.1, not the -0.10 dBFS the v4 notes give for the baked stem before AAC; the AAC pass and its resample/ordering account for the gap (not investigated further).
- **Picture checks (viewed):** sheets in `out/qa/edu21/final/`: `sheet-seconds-a.png`, `sheet-seconds-b.png` (every second, frames 0..1290 and 1319), `sheet-cuts.png` (G-1 and G at the 12 hard cuts 29, 100, 223, 315, 408, 548, 636, 765, 822, 930, 1011, 1105: all hard cuts, no flash, no dissolve), `sheet-zone.png` (strike and zone frames). Mark `@TamMaiLa` top-left on every frame; chip "ภาพอธิบายแบบง่าย" on SH06, SH10, SH13 only; captions inside the safe area and off in the cue gaps; A_fade: G1319 black.
- **caption-zone 1176:1344 (stills of the composition, captions as authored):** SH06 G488 0.193 / 0.243; SH10 G823 0.196 / 0.249, G870 0.203 / 0.264; SH13 G1170 0.146 / 0.282, G1250 0.246 / 0.291: all pass (0.25 / 0.40), same values as the draft. SH01 strike frames (the caption "ไม่ใช่ยางนะ..." is on screen): G12 0.252 / 0.327 FAIL by 0.002 on the mean (strike flash plus text ink in the band), G14 0.249 / 0.326, G18 0.248 / 0.308, G24 0.249 / 0.316 pass. The white fill over its dark stroke reads in the viewed frame. A 0.002 miss on one frame of a lightning flash; reported, not tuned.
- **Seek parity:** stills of frames 1290, 880, 800, 460, 14 rendered once in a batch, then each alone in descending order, then 1290, 880, 14 again: PSNR against the first render 70.7-76.0 dB (not bit-identical, as in the draft); no visible difference.
- **To lock at W7/W8, not done now:** `public/narration/EDU-EP21-SHORT-narration-v1.wav` and `public/audio/edu/EDU-EP21-SHORT-draft-stem-v1.wav` (both untracked, generated by narration-place.py and sound-mix.py), plus the 12 sound locks already made; commit the final narration; `store.py publish` at W8.2.
- **Not verified:** listening (no ear: S1 strike, dip, END1, fade are unheard), Studio, a backward seek in Studio itself.

