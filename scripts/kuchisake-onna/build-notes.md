# KSO-EP01-SHORT build notes

Owner: Boss. Scope of this file: findings from building the shot plates (W5 draft) that the Editor and the coordinator need. Rule documents and this episode's script and brief are not edited here.

## 1 Nov 2026: W5 draft build (26 shot plates)

- Plates: `src/painted/shots/kuchisake.tsx` (one `PaintedShot` per storyboard shot, IDs `KSO-<short ID>`), registered in `src/painted/registry.ts`. Frame index for Editor: `KSO_SHOT_INDEX` (start/end frames, contiguous, 2461 f). Timeline cues (`painted.shots[]`), the `B_loop` hold, audio, captions and the composition registration are Editor's.
- Look code: `src/painted/kuchisake/` shot files are new (`shot-woman.ts` mouth tear, `shot-art.tsx` shared shot art, `shot-index.tsx` standalone stills entry). LF01–LF05 look files and `src/painted/kit` are unchanged.
- Verification entry: `printf 'KSO-SH-S02-B03-SH03 12 out/x.png\n' | node scripts/stills.mjs src/painted/kuchisake/shot-index.tsx`. Draft: add `--props='{"paintDraft":true}'`.
- Findings, measured numbers and per-shot status: `docs/dev-findings/DF-20261101-kso-look-stills.md` (Round 6).
- Editor notes: the caption-band fails are listed there (16 frames, 9 shots). Decisions needed from the user or Film before final grade: smile reading (S01-B02-SH04), waist-up legs (S02-B02-SH03), mask edge in the band (S02-B03-SH02/SH03), head size of the hero (S02-B03-SH05).
- Timing reminder: the reveal (`S02-B03-SH03`) must start at the stinger frame f1554 and its tear is shot-local f0–12; `S02-B02-SH05` is the silent reaction (f1433–1456 silence).

## 1 Nov 2026: user decisions on S01-B02-SH04 and S02-B02-SH03 (Boss)

- `S01-B02-SH04` draws `drawCoworkerKnowing` (`COW_KNOW`, `knowingMouth()` in `src/painted/kuchisake/shot-art.tsx`): a knowing half smile, one corner higher. `S03-B01-SH04` (the `CL01` payoff) still draws `COW_RELIEF`; decide whether it should match.
- `S02-B02-SH03` is a close-up of the masked face on the reveal's CU lens (`CU_GROUND`, `CU_UNIT`), push 1.00 → 1.06 about the face with a fixed −40 px camera offset, CU backdrop, falloff 850–960 at 0.95 (shot-only). The street and the 560 px/m step (`G560`) are gone from this plate. Caption band passes (p95 0.150–0.165, was 0.50–0.56).
- Editor: plate IDs, `KSO_SHOT_INDEX` rows and frame timings are unchanged. The head centre moves 40 px at the `S02-B02-SH02` → `SH03` and `SH03` → `SH05` cuts (head size within 4% and 6%). Check those cuts in the composed timeline.
- Film: revise the `S02-B02-SH03` and `S01-B02-SH04` brief rows (DF Round 6 addendum).
- Evidence: `out/kuchisake/r7/` (stills, sheets); DF `DF-20261101-kso-look-stills` Round 6 addendum. Checks: `tests/kuchisake-shots.test.ts` 11/11, eslint clean, `tsc` one pre-existing error (`tests/loudness.test.ts`).

## 1 Nov 2026: Editor integration and Draft tab (W5), KSO-EP01-SHORT

Owner of this section: Editor. Plates, look and `KSO_SHOT_INDEX` are Boss's and were not edited. Evidence paths are under `out/` (ignored) and the store.

- Compositions (`src/videos/kuchisake-onna/index.ts`, auto-registered): `KSO-EP01-SHORT-C` (C_seamless, 2461 f / 82.03 s, `loopBlendFrames` 15) and `KSO-EP01-SHORT-B` (B_loop, 2551 f / 85.03 s). Two IDs because the composition length comes from the timeline, not the ending prop; both come from one `buildTimeline`. Decision and reasons: [edit plan](../../storyboards/kuchisake-onna/short/edit-plan.md#compositions-requirement-one-assembly-per-selected-deliverable).
- Timeline: 26 scenes, one per shot (`KSO_SHOT_INDEX`), hard cuts, `assemblePaintedTimeline`; narration `narration/KSO-EP01-SHORT.mp3` (store `projects/KSO/audio/voice-lock-r3/final/`, locked) with amplitude `scripts/kuchisake-onna/short/KSO-EP01-SHORT.amplitude.json`.
- Captions: `scripts/kuchisake-onna/short/captions.json` (26 cues, Thai verbatim, outline, `lower`). `caption-breaks.mjs` on both timelines: 0 bad breaks, 0 MAY-WRAP after six authored `\n`.
- Audio: 13 library/generated sounds and the narration locked in `src/videos/kuchisake-onna/assets.lock.json` (14 entries). Generated this episode (not listened to): `ambience/electric/electric_streetlamp-hum-loop_01`, `sfx/foley/foley_heel-click-asphalt_01`, `sfx/foley/foley_walk-sneakers-asphalt_01`, `sfx/foley/foley_run-sneakers-asphalt_01`. NOTICE lines added to `public/audio/NOTICE` and `public/sfx/NOTICE`.
- Tests: `tests/kuchisake-timeline.test.ts` 6/6; `tests/kuchisake-shots.test.ts` + `tests/painted.test.ts` 16/16; eslint clean on the new files; `tsc --noEmit`: only the pre-existing `tests/loudness.test.ts` error.
- Draft clips (W5, `clips.mjs --draft`): 26 clips `out/KSO-EP01-SHORT-C/clips/<shot>_draft.mp4` (360×640 proxy, ~1 s padding, audio from the sound pass). Recorded in `scripts/kuchisake-onna/short/review-rows.json` (`clips.draft`). The clip pass ran before the bed-drop audio change, so all 26 were re-run after it (video segments reused from cache; audio refreshed). Proxy loudness of three sample clips: −15.5 to −19.2 LUFS integrated, peaks −4 to −4.7 dBFS (ebur128; not a delivery measurement).
- Plate code at render: checksums in `out/logs/kso-plate-revision-at-render.sha256`. Boss is revising `S01-B02-SH04` and `S02-B02-SH03`; those two draft clips must be re-rendered when Boss lands (`clips.mjs --shots=S01-B02-SH04,S02-B02-SH03 --draft`).
- Still-frame QA (`out/qa/kuchisake-onna/C/`, 187 full-size stills labelled `<shot>_F<frame>_f<local>.png`): every second, every cut F−1/F/F+1, every caption midpoint, reveal and seam frames. Contact sheets and the cut sheet in `out/qa/kuchisake-onna/C/sheets/`.
- Caption band (`scripts/caption-zone.py`, band 860–1248): on the 26 caption midpoints, 9 fail (izakaya lit table wood in S01-B02-SH01–SH04, mask edge S02-B03-SH02, grin reaching the band S02-B03-SH05, narrator head in the band S03-B01-SH05, street S02-B01-SH01). Over all 187 QA frames: 58 fail, 12 shots. Consistent with DF Round 6; plates not changed.
- Seam (C_seamless): the blend overlay draws frame 0 again, so the frame-0 caption `ฉัน… สวยไหม?` and the fiction marker fade in over frames 2446–2460 (frames 2446, 2447, 2452, 2460 checked). Renderer behaviour, not changed in shared code; reported to Boss.
- Seek parity: 12 frames rendered in three cold processes (ascending, descending, shuffled). 184 of 189 compared files byte-identical; the other 5 frames (0, 195, 2394, 2445, 2460) differ at 106–113 dB PSNR (rounding level, no visible change). Studio GUI was not driven; this is still-render parity only.
- B_loop hold: frames 2461, 2505, 2550 identical within 106–108 dB (picture frozen, closing caption held); B frame 2445 matches C frame 2445 (105 dB).
- Bed drop before the stinger: street hum stops 1518, returns 1554 (EP08a drop → hit).
- Storyboard page: `scripts/storyboard-page/build.py` on the rows passes (26 shots, 31 media files) and writes `out/review-pages/KSO-EP01-SHORT/`. The coordinator publishes; Editor did not publish.
- Samples: 7 beat samples with manifest in `out/samples/kuchisake-onna/short/SB-R2.2-C/` (labelled integration sample, not approval). Archived to the store with the clips and sheets (`store.py archive`).

Open items (Editor → owners):
- Film/coordinator: SB-R2.2 row `S02-B01-SH03` shows no VO while the brief places `แล้วเสียงนั้นก็หายไป…` there; `SH04` row lists it. The timing follows the brief.
- Film/user: the fiction marker sits at about y 163 px, above the caption-safe top (288). Accept or move.
- Boss (renderer): C_seamless blend overlay draws frame-0 captions and eyebrow over frames 2446–2460 (evidence: still set above).
- Film/Boss (plate art, not changed): caption over the narrator's head in S03-B01-SH05; band failures listed above.
- User: confirm the held closing caption in B_loop (Film row "captions stay"); Gemini TTS commercial terms and SynthID unchecked.
- Not verified: no one has listened to the mix; the stinger, riser, walk and heel cues and the loop seam are timing-checked from data only. Lead height not pixel-measured by Editor. Tear foley not generated (optional).
- Voice lock v4 (1 Nov 2026, Editor): pitch fix on โทษ in NARR ขอโทษนะ. Finding for Boss: `scripts/segments.mjs` keeps `narration.amplitude` in the scene cache key (only `narration.src` is excluded) and the amplitude drives the mouth (`SceneRenderer`) and ducking (`MediaLayers`), so any amplitude change re-keys every scene (the v4 draft re-render: 3 of 3 segments rendered, 0 reused). A pinned scene whose picture is unchanged then needs `--keep-pinned` at delivery. Decide whether the key should cover only the amplitude frames a scene reads. Evidence: `out/kso-ep01-short/voice-lock-v4/logs/`, `qa/v4-check.json`.
- Voice lock v5 (1 Nov 2026, Editor): +3.0 st on โทษ from v3 (v4 +1.5 st; user: not sharp enough). Scripts in `voice-lock/`: `pitch-fix-v5.py` (v4 copy, `--st`, and a length-matched lag probe: the +3.0 st shifter output is 22 ms shorter than the context), `v5-check.py`, `v5-spectrum.py`, `update-measure-v5.py`. Proxy: vowel F0 211 Hz, rising end 270 Hz, splice residual -35.7 / -42.7 dBFS. Finding (shared, Boss to note): the source is band-limited near 13.5 kHz; the shift moves that edge up to about 16 kHz inside the shifted word (14-16 kHz band -26.5 dB in v3, +9.6 dB in v5; no narrow tone, 8-16 kHz peak-to-median 19.5 dB against 29.3 dB in v3). Listen for brightness. The amplitude change re-keyed all 3 segments of the S03-B02-SH01 draft (36 s, 0 reused), as in v4. Evidence: `out/kso-ep01-short/voice-lock-v5/qa/` (store `projects/KSO/audio/voice-lock-v5/qa/`), `out/logs/kso-v5-clip-S03-B02-SH01-draft.log`.
- Tool note (log only, not edited): `scripts/narration/assemble-narration.py` prints speech-start offsets in samples under a seconds label (e.g. "28800.020 s" = 0.6 s). The track is correct. Shared tool, not edited here.

## 1 Nov 2026: Draft-tab fixes (Boss, DF Round 7)

- 12 shots changed in the plates only (IDs, index, timings unchanged): S01-B01-SH01 band slides with fingers; S01-B02-SH01/02/03 coworker gestures + mouth; S01-B02-SH04 smile curls in (f18-102); S02-B01-SH01/02 walk away from behind, side turn; S02-B03-SH02/03 two-mass hand on the mask, free arms, no stray strokes; SH05 neck-only tilt; SH06 mouth; S03-B01-SH01 no tilt, mask put back; SH02 run; SH05 front crouch zoomed 2.2-2.4.
- Editor: no wiring needed if the plates sit at `KSO_SHOT_INDEX` starts (mouths read the amplitude at start + local frame). A re-timed mix: set `KSO_AMP.amp` (src/painted/kuchisake/shot-motion.ts). Re-render the 12 draft clips.
- Open: S02-B01-SH03 (POV back down the street) now follows a side turn, not a look back.

## 1 Nov 2026: Draft-tab fix round 3 (Boss, DF Round 8)

- 11 shots changed in the plates only (IDs, index and timings unchanged): S01-B01-SH01, S01-B02-SH01/02/03/04, S02-B01-SH01/02, S02-B03-SH02/03/05 and S03-B01-SH01/02. The SH03/SH05 mouth cleanup also covers what the user flagged on S02-B03-SH04 (its clip opens on SH03).
- Editor: no wiring change. The S02-B03-SH02 camera has a fixed `dy -60`. The S03-B01-SH02 insert A no longer has the lamp cone. Re-render these 12 draft clips: the 11 shots plus S02-B03-SH04 for its SH03 lead-in.
- Open: S01-B01-SH01 stays abstract (an LF01 extreme close-up). If the user still cannot read it, the remedy is a framing change in the look, not a plate fix.

## 1 Nov 2026: S02-B01-SH04 appearance murmur (Editor, Draft note)

- User note on the Draft clip (Thai, translated): when the woman appears, add a small background eerie sound like Hanako's.
- Library check (sound-generation step 1, `scripts/sound-library.py search eerie|whisper|ghost|haunt|breath`): no ghost or haunt entry. Reused `tension_whispers-children-murmur_01` (sfx/tension, 4.0 s, unintelligible murmur, generated 31 Oct for HANAKO-SHORT WH1, `listened: no`). Considered and not used: `nature_wind-eerie-street_01` (ambience loop, eerie wind on an empty street). No gap, so no audio-studio call and no new NOTICE licence entry.
- Cue (`src/videos/kuchisake-onna/index.ts`, `video.audio[]`, composition clock): f1062–f1152 (3.0 s), volume 0.12 (WH1), fadeIn 0.2 s, fadeOut 0.3 s, `duckUnderNarration` 0.35 (EP08a `hold`). Start: the woman's first lit frame (film brief f1062 est.; stills confirm, below) and the riser stop (951 + 3.692 s). Duck 0.35, not Hanako's WHISPER 0.2: the ±8-frame narration window keeps the duck fully on for all 90 frames, so 0.2 would leave the cue almost inaudible.
- Lock: `store.py use library/sound/sfx/tension/tension_whispers-children-murmur_01.wav public/audio/tension/… --episode kuchisake-onna` (+4 lines in `assets.lock.json`). `public/audio/NOTICE` KSO section names the ID. Licence: Stability AI Community License; commercial-use eligibility is the user's decision (`NOTICE.md`).
- Picture check (stills of the draft clip, `out/KSO-EP01-SHORT-C/cue-diff/sh04-appearance-sheet.png`): f1058 and f1061 no woman; f1062 first visible; f1063, f1068, f1075 held.
- Audio timing (Remotion sound-only renders with and without the cue, same `renderMedia` soundOnly path as `scripts/segments.mjs`; scratch `out/KSO-EP01-SHORT-C/cue-diff/render-cue-diff.mjs`, `diff_env.py`): first audible sample f1063, one frame after the picture. The fade-in gain is 0 on its first frame, so the onset lands on the next frame boundary. Accepted: the cue is soft and the riser stop stays on f1062. Last audible sample f1150; cue contribution peak −28.7 dBFS (predicted −28.5 = file peak −1 dBFS × 0.12 × 0.35); cue window −44.5 LUFS integrated (3.0 s). Mix with and without the cue over the shot: −16.3 LUFS both (0.1 LU).
- Draft clip: `out/KSO-EP01-SHORT-C/clips/S02-B01-SH04_draft.mp4` (proxy 360×640) and `_draft.full.mp4` (1080×1920), f1000–1249 (shot f1030–1219 plus 1 s either side). Shot window −15.7 LUFS integrated, LRA 2.3 LU, sample peak −4.0 dBFS: no clipping.
- Picture cache: the first render after the cue repainted segments 9 (S02-B01-SH04) and 10 (S02-B02-SH01); the cause (cache state) is not isolated. The render after the duck change reused all 3 segments (0 repainted): the audio is outside the picture key (`segments.mjs` drops `audio`), so the cue does not repaint pictures.
- Concurrent edits, not Editor's: `src/painted/kuchisake/coworker-tell.ts`, `ghost-hand.ts` and `shots/kuchisake.tsx` changed in this checkout at 18:03:35–18:04:22, after the clip render (18:03:14). Editor did not touch `src/painted/`. The draft clip's picture predates those edits; re-render S02-B01-SH04 after that work lands.
- Tests: `node --import tsx --test tests/kuchisake-shots.test.ts tests/kuchisake-timeline.test.ts`, 20 of 20 pass, including the new test that the murmur starts on the riser stop inside S02-B01-SH04. Composition length 2461 f unchanged. Voice lock v5 unchanged (`public/narration/KSO-EP01-SHORT.mp3` sha256 c25dc1b5… matches the lock).
- Listened: no (proxy measures only). Human check to do on the draft clip with narration: is the murmur audible under the line? If it is too faint, raise `volume` (0.20 gives about +4.4 dB); if it fights the voice, lower it.

## 1 Nov 2026: Draft-tab fix round 4 (Boss, DF Round 9)

- 5 plates changed (IDs, index and timings unchanged): S01-B02-SH01 (elbows at the waist), SH02 (arms at the sides), SH03 (one hand reaches to and holds the glass, rounded curled grip, the other at the side), S02-B03-SH03 (released hand closes to a fist), S03-B01-SH01 (grin closes to a plain mouth, brows relax; the face the user saw in the S03-B01-SH02 clip pad).
- Editor: no wiring change. Re-render draft clips S01-B02-SH01, SH02, SH03, S02-B03-SH03, S02-B03-SH04 (opens on SH03), S03-B01-SH01 and S03-B01-SH02 (opens on SH01). The 1 s pads also touch S01-B01-SH01 (ends on S01-B02-SH01), S01-B02-SH04 (opens on SH03) and S02-B03-SH02 (ends on S02-B03-SH03 f0-29, the fist closes at f5-11): 10 clips.
