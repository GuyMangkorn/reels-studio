# Edit plan: KSO-EP01-SHORT (Editor, Light tier, draft stage)

Owner: Editor. Stage: integration and the Draft tab (W5, [sequence workflow](../../../docs/sequence-workflow.md#painted-shot-by-shot)). Not a final render, not a picture lock, not a user approval. Evidence is in [build notes](../../../scripts/kuchisake-onna/build-notes.md) (Editor section) and the QA paths listed at the end.

## Inputs and revisions

| Input | Revision / evidence |
| --- | --- |
| Deliverable | `KSO-EP01-SHORT`, Short 1080×1920, 30 fps, profile `kso-horror`, Light tier (Mark `N/A`, Boat `N/A`) — [delivery record](../../../scripts/kuchisake-onna/delivery.md) |
| Script | `KSO-SCRIPT-R4` ([script](../../../scripts/kuchisake-onna/short/script.md)); spoken text unchanged since R3 |
| Film brief | `KSO-BRIEF-FILM-R2.2` (timed shot list, 26 shots) — [brief](../../../scripts/kuchisake-onna/short/film-brief.md) |
| Storyboard rows | `SB-R2.2`, all 26 shots marked ok by the user on the page (no re-review asked) — [review-rows.json](../../../scripts/kuchisake-onna/short/review-rows.json) |
| Voice lock | v3, `KSO-EP01-SHORT_narration_voicelock-v3.mp3`, 2461 f (82.03 s), store `projects/legacy/KSO/audio/voice-lock-r3/final/`, sha256 `9e6e7f5fa1ab92bec766033142febe4a88d6376dd7b1ae0d9b426ae133dd8f1c` (from [voice-measure.json](../../../scripts/kuchisake-onna/short/voice-measure.json)); the measure file is the timing source |
| Look | `LF01`–`LF05` approved by the user; plates `KSO-<shot ID>` in `src/painted/shots/kuchisake.tsx` (`KSO_SHOT_INDEX`, 26 contiguous rows 0–2461) |
| Plate code at render | checksums in `out/logs/kso-plate-revision-at-render.sha256` (taken before the draft pass; Boss is revising `S01-B02-SH04` and `S02-B02-SH03` in parallel, see open items) |

## Compositions (Requirement: one assembly per selected deliverable)

| Composition ID | Ending | Frames / length | Use |
| --- | --- | --- | --- |
| `KSO-EP01-SHORT-C` | `C_seamless` (`loopBlendFrames` 15) | 2461 f / 82.03 s | Primary. No hold, no fade; last 15 f crossfade into frame 0 |
| `KSO-EP01-SHORT-B` | `B_loop`, `endHoldSec` 2 | 2521 f / 84.03 s | 2 s hold after the picture end (60 f, 2461–2520); closing caption held to 2520. Per-deliverable override of the ~3 s rule (user, 1 Nov 2026; [delivery record](../../../scripts/kuchisake-onna/delivery.md)) |

**Decision (Editor, recorded): two IDs, one source.** A composition's length is taken from its timeline (`src/Root.tsx` `calculateMetadata`), not from the ending prop, and `render.mjs --endings` only changes the ending prop. So B_loop cannot be made from the 2461 f timeline by a flag. Both timelines come from `buildTimeline(holdFrames)` in [`src/videos/kuchisake-onna/index.ts`](../../../src/videos/kuchisake-onna/index.ts): the shots, captions, cues and narration are the same objects; B_loop only extends the last shot (`S03-B02-SH02`) by 60 f, and its last caption stays up through the hold (Film row `B_loop hold`: "captions stay"). `endHoldSec: 2` on `KSO-EP01-SHORT-B` (user, 1 Nov 2026: 2 s counted from the picture end) makes the shared ending freeze the plate at 2461 (`endingState`: `duration − 60 f`, local 73 of the 133 f shot). `B_loop` accepts `endHoldSec` through Boss's change to `validateVideoStyle` in `src/scenes/media.ts` (uncommitted in this checkout on 1 Nov 2026). Without `endHoldSec` the 3 s default would freeze at 2431. The plate is not ambient-animated.

Cost: B's total length changed (2551 → 2521 f), so the first B_loop render re-paints all 26 B scenes. The C_seamless keys are unchanged (measured 1 Nov 2026; see [build-notes](../../../scripts/kuchisake-onna/build-notes.md#1-nov-2026-b_loop-closing-hold-2-s-applied-editor)).

`narration/KSO-EP01-SHORT.mp3` is one file shared by both IDs (locked once), instead of two copies; the amplitude JSON is `scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json` (copied from the store, 2461 values).

## Scene map (one scene per shot: one render segment and one pin per shot)

Full table with frames: [scene-map.md](../../../out/kso/scene-map.md) (generated from the timeline; regenerate with the scratch dump). Summary: 26 scenes, `[0, 2461)`; every scene holds one painted cue (`KSO-<shot ID>`, `atSec` 0), hard cuts, no in-canvas dissolve, no transition field. Frame boundaries equal `KSO_SHOT_INDEX`.

## Captions

- Style: `captionStyle {preset: 'outline', position: 'lower'}` (block bottom edge at y 1240; Film caption band 860–1248). No scrim plate (the caption band brightness check is measured with real captions, see QA).
- Source: [captions.json](../../../scripts/kuchisake-onna/short/captions.json), 26 cues, Thai verbatim from the script. Japanese line captioned as the transliteration (script rule).
- Onsets: [voice-measure.json](../../../scripts/kuchisake-onna/short/voice-measure.json) anchors where present (`KSO-Axx`); the rest are energy runs measured from the narration amplitude envelope (threshold 0.02, gaps under 8 f merged) inside the Film window. Those are marked `est` in the cue file (about ±10 f, not word anchors).
- Blanks: a blank cue after each caption (silence = no caption); the closing line is blank from 2446 in C_seamless and held in B_loop. Every shot starts with a cue; a caption that crosses a shot boundary is repeated at the boundary (`CAP-17` in `S02-B03-SH03` into `SH04`).
- Line breaks: `scripts/caption-breaks.mjs` on both timelines: 0 bad breaks, 0 `>2` lines, 0 `MAY-WRAP` after six authored `\n` at word boundaries (existing spaces). Cues split on phrase boundaries: `CAP-10`/`CAP-11` (SH04), the long hook-to-`ยืนรอฉันอยู่` line.
- Film line placement: `แล้วเสียงนั้นก็หายไป…` is placed in `S02-B01-SH03` (brief); `SB-R2.2` shows it under `SH04` and `SH03` VO as `-`. Editor follows the brief's timing (speech runs 965–1014, inside SH03). Coordinator/Film to correct the row (open item).

## Mix cue sheet (EP08a: one row per beat; planned voice levels are not in the runtime)

Runtime facts: `video.audio[]` has a static `volume` plus `fadeInSec`/`fadeOutSec` and `duckUnderNarration`; `scene.sfx[]` has a static `volume`; **narration has no gain field** (EP08a runtime gap), so voice levels are planned only: 0 dB hold, 0.7 (−3 dB) intimate or confiding, 1.25 (+2 dB) payoff (`ถึงตาเธอแล้ว`). The narration track is −16.64 LUFS integrated, −1.64 dBTP (measured on the locked file).

| Beat | Frames | Mix intent | Voice (planned) | Bed / ambience (gain, duck) | SFX (gain) | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `S01-B01` hook | 0–195 | `hold` | WOMAN 0 dB; NARR 0.7 | street hum 0.10 (duck 0.5) | none | hum from f0; no music on frame 0 |
| `S01-B02` izakaya | 195–756 | `hold` → `lift` | NARR 0 dB | shop hum 0.12 (duck 0.6); cold drone 0.10 (duck 0.35), fade-in 0.8 s from 195 | none | the drone is the rise |
| `S02-B01` walk | 756–1030 | `drop` (bed out at 756) | NARR 0 dB | street hum 0.10 back at 756 (fade-in 0.5 s) | narrator steps 0.22 (756–899); follower heel clicks 0.18 ×9 (764–892, half beat late) | both steps stop ≈ 900 |
| `S02-B01` riser | 951–1062 | `lift` → `hit` at 1062 | NARR 0 dB | hum 0.10 | riser 0.18 (951, dead end 1062); flicker buzz 0.10 (1030–1180) | riser ends on the woman's first lit frame |
| `S02-B02` question | 1220–1457 | `hold` | WOMAN 0 dB; NARR 0.7 (`ฉันไม่ตอบ`) | hum 0.10 (duck 0.5) | heel click 0.30 (1346) | 1433–1456 silence = hum only |
| `S02-B03` reveal | 1457–1870 | `drop` → `hit` → `hold` → `drop` | NARR gasp/slip 0 dB; WOMAN 0 dB | hum **stops 1518, returns 1554** (drop 1.2 s); heartbeat 0.20 (1700–1852, stops dead) | **stinger 0.55 at 1554** (the one hit); no tear foley | stinger tail runs past SH03 on the composition clock |
| `S03-B01` escape | 1870–2295 | `hold` → `lift` (quiet) | NARR 0.7 (intimate, breath) | room tone 0.10 (duck 0.5) 1870–2388; cold drone 0.07 from 1900 (fade-in 1.0 s) | run 0.25 (1925–1993); door slam 0.35 (1994); deadbolt 0.30 (2003) | smile cut-in 2092: no sting; pass-on sentence on the quiet bed |
| `S03-B02` turn | 2295–2461 | `release` (seam) | NARR 0.7 (apology); WOMAN 1.25 (`ถึงตาเธอแล้ว`, planned) | drone thins out 2295–2340; room tone out at 2388; street hum back 0.10 (fade-in 0.5 s from 2388) | none | last 15 f (2446–2460) speech-free, hum only |
| `B_loop` hold | 2461–2520 (60 f) | `release` | none | street hum 0.10 continues to 2521 | none | hum only, closing caption held to 2520 |

Bed levels: 0.10, 0.12 and 0.07 (at least two distinct); one `drop` → `hit` (1518 → 1554). Accents: one main `hit` (stinger) plus the riser end and the door slam.

Level references (volume → dB): 0.07 ≈ −23 dB, 0.10 = −20 dB, 0.12 ≈ −18 dB, 0.18 ≈ −15 dB, 0.22 ≈ −13 dB, 0.30 ≈ −10.5 dB, 0.55 ≈ −5 dB. Ambience and music masters are at −14 LUFS, SFX peak-normalized to −1 dBFS. The final MP4 is loudness-normalized by `scripts/loudness.mjs` (two-pass to −14 LUFS, TP −1.5) on the full export, not on draft clips.

## Sound inventory (library IDs; full sidecars in the library, not listened to by a person)

Search before generating: the shared library index (`~/ReelsStore/library/sound/INDEX.md`, 128 lines) was checked for each cue. Gaps generated 1 Nov 2026 (audio-studio-mcp, three variations each, measured, one picked):

| Cue | Library ID | Source | Use |
| --- | --- | --- | --- |
| Street hum (loop) | `ambience/electric/electric_streetlamp-hum-loop_01` | **generated** (gap; loop flag, 1 s crossfade; 1-s RMS −11.5 to −11.9 dB after the first second, seam sample step 3e-5) | street bed, hook, seamless return |
| Heel click | `sfx/foley/foley_heel-click-asphalt_01` | **generated** (gap; 0.11 s) | follower steps, woman's step |
| Walking sneakers | `sfx/foley/foley_walk-sneakers-asphalt_01` | **generated** (gap; the library walk file is wet concrete) | narrator steps |
| Running sneakers | `sfx/foley/foley_run-sneakers-asphalt_01` | **generated** (gap; the library run file is an infected corridor) | run insert |
| Shop hum | `ambience/room/room_shop-fridge-hum_01` | library | izakaya |
| Dark room tone | `ambience/room/room_dark-empty-building_01` | library | narrator's room |
| Cold drone bed | `music/tension/tension_drone-sparse-piano_01` | library (narration-safe) | izakaya and return |
| Riser | `sfx/reveal/reveal_riser-tension_01` | library | SH04 dead end |
| Flicker buzz | `sfx/electric/electric_light-flicker-buzz_01` | library | SH04 streetlight |
| Stinger | `sfx/stinger/stinger_horror-screech_01` | library | the one hit, 1554 |
| Heartbeat | `sfx/tension/tension_heartbeat-slow_01` | library | 1700–1852 |
| Door slam | `sfx/impact/impact_door-slam-body_01` | library | 1994 |
| Deadbolt | `sfx/foley/foley_deadbolt-clack_01` | library | 2003 |

Not used: `stinger_outro-resolve_01` (the brief forbids a release chord), `foley_flesh-bite-wet_01` and the infected corridor run (wrong content). **Not generated:** the optional dry tear foley under `S02-B03-SH03` (f1554–1566); the stinger carries the frame, and no gore sound was added. Open for the user if wanted.

Public copies are locked with `store.py use --episode kuchisake-onna` (`src/videos/kuchisake-onna/assets.lock.json`, 14 entries: 13 sounds + the narration). The license lines are in `public/audio/NOTICE` and `public/sfx/NOTICE`.

## Known limits (not verified)

- Nobody has listened to the mix. Levels are design values and proxy measurements. The seam, the bed drop, the heel and walk cues, the stinger and the riser are not checked by ear.
- The C_seamless seam bed is a continuous lamp-hum loop; its phase at 2461 → 0 is not measured.
- Lip-sync is not wired (Boss build note 6); the static mouths are as the brief specifies.
- Gemini TTS commercial terms and SynthID are unchecked (open item from the gemini-tts skill).

## Open items and decisions for the user

1. Length accepted at 82.03 s (user, 1 Nov 2026); both endings match the measure file.
2. Film/coordinator: `SB-R2.2` row `S02-B01-SH03` shows no VO while the brief places `แล้วเสียงนั้นก็หายไป…` there; `SH04` row lists it. Confirm the placement (the timing in this plan follows the brief).
3. Fiction marker position: the top eyebrow sits at about y 163 px, above the caption-safe top (y 288). The channel-label exception does not cover it. Film/user to accept or move it (renderer owns the eyebrow slot).
4. C_seamless blend overlay (renderer behaviour, to confirm on clip frames 2446–2460): the frame-0 overlay also shows frame 0's caption and marker fading in over the last 15 f. Reported to Boss; not changed in shared code.
5. Caption band brightness: the 9 shots from DF Round 6 (16 frames) are still open; measured with real captions below. Plates are not changed.
6. `B_loop` hold: decided (user, 1 Nov 2026): 2 s from the picture end, B 2521 f; frozen picture, hum continues, closing line held to 2520. This overrides the ~3 s rule in [production-requirements](../../../docs/production-requirements.md) for this deliverable (rule not edited). Open for Film: revalidate the 90 f rows in `film-brief.md` (lines 3, 93, 115, 158); see [delivery record](../../../scripts/kuchisake-onna/delivery.md).
7. Gemini TTS commercial terms / SynthID: unchecked (delivery record open item).
8. Boss in parallel: `S01-B02-SH04` smile (COW_RELIEF) and `S02-B02-SH03` camera; the clips in this pass carry the plate code checksums in `out/logs/`. Re-render those two shots when Boss lands.
