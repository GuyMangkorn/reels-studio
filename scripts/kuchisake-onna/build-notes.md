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

## 1 Nov 2026: Draft-tab fix round 5 (Boss, DF Round 10)

- 2 plates changed (IDs, index and timings unchanged): S01-B02-SH01 (elbows 0.05 m lower, upper arms angled out from the torso), S03-B01-SH01 (the closing grin slides down and narrows onto the kit's plain mouth; from f46 only the normal flat mouth; removes the line under the nose the user saw in the S03-B01-SH02 clip pad).
- Editor: no wiring change. Re-render draft clips S01-B02-SH01, S03-B01-SH01 and S03-B01-SH02 (opens on SH01 f25-54); the 1 s pads also touch S01-B01-SH01 (ends on S01-B02-SH01), S01-B02-SH02 (opens on S01-B02-SH01) and S02-B03-SH06 (ends on S03-B01-SH01 f0-29, the mouth starts moving at f10): 6 clips.

## 1 Nov 2026: caption-band check before Final (Editor, KSO-EP01-SHORT)

Owner: Editor. No timeline, caption, plate, audio or cue was edited: 2461 f, voice lock v5, the S02-B01-SH04 murmur, plate IDs and `KSO_SHOT_INDEX` are unchanged. No draft clip was rendered or needs re-rendering from this pass. Nothing in `src/`, `scripts/` or the captions changed; no commit.

Result: no caption-side change closes the failing frames. The fails come from the picture in y 860-980 (lit counter top, pale garment or mask under the chin), and two of the failing frames have no caption on screen. Returned to the user and Boss (questions below).

**Gate and method (recorded for re-runs).**
- Gate: `scripts/caption-zone.py`, band 860-1248, mean <= 0.25, p95 <= 0.40, on caption-free stills. The r9/r10 numbers reproduce exactly on HEAD 9d29ca5 (538: 0.151 / 0.443; 1554: 0.139 / 0.579; 755: 0.161 / 0.462).
- Why caption-free: the default stills (`scripts/render.mjs --stills`, `stills.mjs` without props) draw the caption. White glyphs push p95 above 0.5 even where the background passes (512 with caption 0.623, caption-free 0.441), so a composite with glyphs cannot gate the background. The r10 stills were caption-free (checked: r10 `S01-B02-SH03_026` shows no caption, while global 538 has CAP-05 on).
- Caption-free still: `printf 'KSO-EP01-SHORT-C <frame> <out.png>\n' | node scripts/stills.mjs src/index.ts --props='{"captionStyle":{"preset":"none"}}' --gl=angle`, then `python3 -I scripts/caption-zone.py <pngs>`. Caption on screen per frame follows `captionTrack()` in `src/videos/kuchisake-onna/index.ts` (cue g0 text, g1 blank, cut starts carry the previous text).

**Failing frames on HEAD 9d29ca5 (caption-free; global frame, shot-local frame).**

| Shot | Frames (global / local) | Caption on screen | mean / p95 |
| --- | --- | --- | --- |
| S01-B02-SH03 | 512 / f0 | ON, CAP-04 | 0.151 / 0.441 |
| | 533 / f21, 538 / f26, 542 / f30, 545 / f33 | ON, CAP-05 | 0.152 / 0.446, 0.151 / 0.443, 0.151 / 0.446, 0.152 / 0.450 |
| | 552 / f40, 554 / f42, 575 / f63, 582 / f70, 596 / f84 | ON, CAP-05 | 0.153 / 0.458, 0.153 / 0.459, 0.155 / 0.466, 0.156 / 0.467, 0.156 / 0.468 |
| | 617 / f105 | blank (609-622) | 0.157 / 0.471 |
| S01-B02-SH04 | 700 / f82 | ON, CAP-06 | 0.150 / 0.440 |
| | 728 / f110 | ON, CAP-06 | 0.158 / 0.459 |
| | 755 / f137 | blank (741-766) | 0.161 / 0.462 |
| S02-B03-SH02 | 1538 / f20 | ON, CAP-16 | 0.118 / 0.443 |
| | 1540 / f22, 1545 / f27, 1548 / f30, 1553 / f35 | ON, CAP-16 | 0.125 / 0.539, 0.133 / 0.551, 0.135 / 0.549, 0.135 / 0.547 |
| S02-B03-SH03 | 1554 / f0 | ON, CAP-16 tail | 0.139 / 0.579 |

- Correction to the cause in the r10 note: the bright pixels of the S01-B02-SH03 frames are at x about 478-971, y 860-939. The narrator's back is dark (x < about 400) and is not in that set. They are the lit counter top and the lantern glow.
- The four-shot list omitted S01-B02-SH04 f82 and f110 (r9-cz.json, 0.440 and 0.459). They are caption-on frames and are listed above.
- Controls (untouched, pass): S01-B01-SH01 f60 (global 60, CAP-01 on) 0.154 / 0.196; S03-B02-SH02 f32 (global 2420, CAP-26 on) 0.156 / 0.196.

**Caption-side levers tested (plate-only: glyph colour transparent, so only the backing is measured).**
- Outline at `lower` (current): the gate is the caption-free picture, so no caption-side move changes it.
- Box at `lower` (bottom edge 1240): no change on the checked frames (512 0.441, 1553 0.547, 1554 0.579). The plate sits below the bright rows.
- Box with `bottomEdgeY` 1100: 512 0.433, others unchanged.
- Box at `middle` (centre y 960): passes 512 (0.115 / 0.241), 533 (0.131 / 0.378), 538 (0.131 / 0.368), 542, 545, 552, 554 (all p95 0.36-0.37), 700 (0.118 / 0.227), 728 (0.121 / 0.223). Fails 575 (0.404), 582 (0.412), 596 (0.419); fails 617 and 755 (blank, no plate), and every S02-B03 frame (1538-1554, p95 0.442-0.562). Controls still pass (0.147 / 0.196, 0.148 / 0.196). Real glyph look at 538 and 1553: composite p95 0.533 and 0.583 (glyphs dominate).
- Not applied. `captionStyle` is video-wide (no per-cue or per-shot style in the schema), so this moves all 26 captions and the reveal framing (the plate sits on the blouse under the chin in S02-B03-SH02). It closes only part of the sampled frames and re-keys all 26 draft clips. Recommendation: do not adopt for this episode.

**Picture facts for Boss (measured; the fix is Boss's).**
- Bright pixels (luma > 0.40) in the failing frames lie in y 860-980 (frame 755 has 0.5 % of its strip at y 980-1019, x 555-594): S01-B02-SH03 and S01-B02-SH04 (x about 466-1041) are the lit counter top and lantern glow; S02-B03-SH02 and S02-B03-SH03 (x about 200-790) are the pale garment or mask under the chin.
- Simulated, not rendered: the smallest uniform RGB multiplier k on rows 860-980 only, with p95 <= 0.40 (same luma and index as caption-zone): 538 0.90; 575 0.86; 582 and 596 about 0.85; 617 0.85; 700 0.91; 728 0.87; 755 0.86; 1540 0.74; 1545 0.73; 1553 0.73; 1554 0.69. So S01-B02-SH03 and S01-B02-SH04 need about 10-15 % less brightness in that strip, and S02-B03-SH02 and S02-B03-SH03 need about 25-30 %.
- Dropping the blank-caption frames from the gate (question 1) would leave S01-B02-SH03 (caption-on frames 512-596) and S01-B02-SH04 (f82, f110) failing, so no shot closes on the caption side.

**Draft clips.** None re-rendered from this pass; none needs re-rendering now. After a Boss picture change: the changed shot's clip and the ~1 s pad clips of its neighbours (`clips.mjs --shots=<IDs> --draft`). If box at middle were approved: all 26 clips.

**Checks.** `node --import tsx --test tests/kuchisake-timeline.test.ts tests/kuchisake-shots.test.ts tests/painted.test.ts`: 25/25 pass (`out/logs/kso-cap-r12-tests.log`). eslint: no code file touched, not run. `tsc`: not run.

**Evidence (ignored `out/`, not committed).**
- Sheets: `out/qa/kso-caption-fix/nocap-failing-frames.png` (caption-free, 11 frames), `current-outline-lower-failing-frames.png` (current look, 11 frames), `candidate-box-middle-real-538-1553.png`, `r10-prev-sh03.png`. Filed in the store: `$REELS_STORE/projects/KSO/qa/sheets/` (4 PNG).
- Measurements: `out/kso-caption-r12/cz-*.json` and `out/kso-caption-r12/evidence/measure/`. Stills: `out/kso-caption-r12/nocap-all/`, `plate-mid-all/`, `current/`, `nocap/`, `boxmid-real/`. Logs: `out/logs/kso-cap-r12-*.log`.
- Tools (one-off, not in the repo): `out/kso-caption-r12/evidence/tools/` (`sweep.sh`, `nocap_all.sh`, `plate_mid_all.sh`, `bright_map.py`, `dim_needed.py`, `caption_state.py`).
- Coverage: only the sampled frames above were measured. The full shot range (2461 f) was not scanned.

Open items (Editor → owners):
- User (question 1): should the band gate apply to frames with no caption on screen (617, 755)? Those two frames fail on picture alone.
- User (question 2): approve or decline a video-wide box plate at middle? Recommendation: decline.
- Boss: picture decision for S01-B02-SH03, S01-B02-SH04, S02-B03-SH02, S02-B03-SH03 (numbers above). Smallest change: local shading of the lit counter top and the garment in y 860-980.
- Film (S02-B03-SH02/03): the mask or garment under the chin is in the band. If the pull-down reveal must stay, Film chooses between shading and moving the subject up.

## 1 Nov 2026: B_loop closing hold 90 f → 60 f requested, not applied (Editor)

Owner: Editor. Request (user, 1 Nov 2026): the closing caption of `KSO-EP01-SHORT-B` stays on screen about 2 s instead of about 3 s (B 2551 f → about 2521 f). **Not applied:** the hold cannot be shortened inside `B_loop` without freezing the last shot early or changing the ending kind, so the user chooses the route (see [delivery.md](delivery.md), section "1 Nov 2026: B_loop closing hold request"). Unchanged: `KSO-EP01-SHORT-C` 2461 f, voice lock v5, the S02-B01-SH04 murmur, the fiction marker, plate IDs, `KSO_SHOT_INDEX`, `src/painted/` (Boss's uncommitted `shots/kuchisake.tsx` is not Editor's). No code, caption or test changed; no draft clip, page or commit.

**Why a plain `HOLD_FRAMES = 60` is wrong.**
- The B_loop freeze is `scene length − 3 s` (`endingState` in `src/scenes/endings.ts`, applied to the final scene by `paintedStateAt` in `src/scenes/painted.ts`). With 60 f the final scene `S03-B02-SH02` is 133 f and freezes at local 43, global **2431**, not 2461.
- Measured with the real `paintedStateAt`: frames 0–2445 no longer equal `KSO-EP01-SHORT-C` plates. The shot's motion from 2431 to 2460 would freeze while the closing line is spoken to 2445.
- `validateVideoStyle` (`src/scenes/media.ts`) accepts `endHoldSec` only with `ending: 'A_fade'`, so `B_loop` cannot take a 2 s hold.

**Options (not applied; user decides).**
1. `ending: 'A_fade'`, `endHoldSec: 2`, `endFadeSec: 0` on `KSO-EP01-SHORT-B`. Candidate check: frames 0–2460 equal the current B; the freeze is frame 2461 through 2520 (B 2521 f); opacity 1, no fade. It changes the ending kind in the record. [production-requirements](../../docs/production-requirements.md) defines `_A_fade` as "holds then fades" and `_B_loop` as "holds and uses the shared loop seam", so the change needs a recorded override.
2. Keep `B_loop` and ask Boss to allow `endHoldSec` for `B_loop` in `validateVideoStyle` (shared code, Boss's scope). `endingState` already reads `holdSec` for every non-`C_seamless` ending, so B would become `ending: 'B_loop', endHoldSec: 2`.
3. Keep 90 f (B 2551 f, 3 s hold, the production-requirements default).

**Closing caption timing** (CAP-26 "ถึงตาเธอแล้ว…", composition frames, end-exclusive; onset 2394 = `S03-B02-SH02` local 6; speech ends 2445; C blank from 2446; picture last authored frame 2460):

| Variant | Visible | After picture end (2461) | After speech end (2446) | B length |
| --- | --- | --- | --- | --- |
| now (90 f) | 2394–2550, 157 f (5.23 s) | 90 f (3.0 s) | 105 f (3.5 s) | 2551 f (85.03 s) |
| option, 60 f | 2394–2520, 127 f (4.23 s) | 60 f (2.0 s) | 75 f (2.5 s) | 2521 f (84.03 s) |

"About 30 f" matches counting the 2 s from the picture end. Counted from the end of the speech, 2 s gives B 2506 f (45 f shorter). Asked of the user.

**Checks.** Baseline on the current tree: 10 timeline test files, 148/148 pass (`out/logs/kso-hold-baseline-tests.log`; includes Boss's uncommitted `shots/kuchisake.tsx`). Candidate check (read-only, reproducible): `node --import tsx out/kso-hold/candidate-check.ts`, log `out/logs/kso-hold-candidate-check.log`. Not run because they need the applied change: length and ending tests, eslint on changed files, the last-3-s qa-sheet of B, the B-vs-C still check. The loop seam of the current B is unchanged: a hard cut from the frozen last frame to frame 0 (`loopFadeFrames` is not set, no blend).

**Records to update after the choice (owners named).**
- Film: `scripts/kuchisake-onna/short/film-brief.md` B_loop hold row (line 93, "90 f"), the B_loop note (line 115) and open question 5 (line 158). Film revalidates.
- Editor: `HOLD_FRAMES` and comments in `src/videos/kuchisake-onna/index.ts`; `tests/kuchisake-timeline.test.ts` (2551, 163, the ending pair); `storyboards/kuchisake-onna/short/edit-plan.md` (composition table, decision text, the B hold row, open item 6); the CAP-26 `source` note in `scripts/kuchisake-onna/short/captions.json` ("90 f hold").
- Coordinator/Preaw: the closing-hold rule in `docs/production-requirements.md` ("about 3 seconds"). A 2 s hold needs a recorded override for this deliverable; the rule document is not edited in production work.

## 1 Nov 2026: caption-band fix round 6 (Boss, DF Round 11)

- 4 plates changed in the overlay only (IDs, index, timing, staging, poses unchanged): S01-B02-SH03 (counter-edge shade, whole shot), S01-B02-SH04 (same shade fading in f40-75 with the push), S02-B03-SH02 (chin shade fading in f12-24 as the mask comes down), S02-B03-SH03 (chin shade over the cut, lifting f1-6). Caption-free p95, worst per shot: 0.471 -> 0.389, 0.462 -> 0.383, 0.551 -> 0.383, 0.579 -> 0.383 (all sampled frames pass, the exempt blank-cue frames 617 and 755 too). Controls 60 and 2420 unchanged (0.196); neighbours S01-B02-SH02 (480, 505), S02-B01-SH01 (760), S02-B03-SH01 (1500, 1517), S02-B03-SH04 (1590) unchanged.
- Editor: no wiring change. Re-render draft clips S01-B02-SH03, S01-B02-SH04, S02-B03-SH02, S02-B03-SH03; the 1 s pads also show them in S01-B02-SH02 (ends on SH03 f0-29), S02-B01-SH01 (opens on SH04 f108-137), S02-B03-SH01 (ends on SH02 f0-29: f12-29 changed) and S02-B03-SH04 (opens on SH03 f0-29: f0-5 changed): 8 clips.
