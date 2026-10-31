# HANAKO-SHORT: Editor E-R5 report (sound re-wire for SCENE-R5 I2/I4)

**Status:** E-R5 wiring done in the worktree; uncommitted, not pushed. **Measured, not listened:** no person has heard this mix. Every number below comes from a sound-only render or from the runtime rules. Ear checks stay open (§11).
**Scope:** `src/videos/hanako/index.ts` (`audio` array and the header comment), `src/videos/hanako/assets.lock.json`, `public/audio/NOTICE` (one licence line, outside the stated scope, see O4), this report, `scripts/hanako/build-notes.md`, and three new tools in `scripts/hanako/short/`. No plate, cue, caption, `src/painted/`, or rule document touched.
**Inputs:** scene sheet `HANAKO-SHORT-SCENE-R5` (`draft`; B06-SH02, B07-SH01 to SH03 and B08-SH01 Sound lines; Dependencies row E-R5); sign-offs `signoff-film-r5.md`, `signoff-preaw-r5.md`, `signoff-boat-r5.md`; `editor-e3-report.md`; `mark-fear-proposal.md` I2 and I4; voice lock v3 (`public/narration/HANAKO-SHORT.amplitude.json`, narration starts at F45).

## 1. Result

- Wired as the sheet says: 40 audio tracks (E3 had 43). Removed WP1, MY1, MY2 and TK2 to TK6. CB1 is now piece a, CB1b and CB1c. MN1 and BZ1/BZ2 are added.
- Two deliberate deviations, both a 1-frame trim (§3, §5). The library files start with 52 ms (MN1) and 41 ms (BZ1) of silence. Without the trim the audible onsets land at F1431.6 and F2130.2, outside the sheet's ±1 f.
- MN1 condition: no masking of the first syllable. The narration is 25 dB or more above MN1 at F1430 to F1432, so no delay was needed and the VO was not moved.
- Buzz onsets: F2129.2 (BZ1) and F2136.3 (BZ2), inside ±1 f.
- Joins: no splice at F1778, F1940 or F2046 (the sheet's gain steps only). The level step at F1940 measures +3.2 dB against the sheet's +2.5 dB (O1).
- Range F1340 to F2160, un-normalized: −16.1 LUFS integrated, true peak −2.5 dBTP, zero clipped samples.
- The ducked tracks in the render differ from the documented rule by −1.4 to +1.0 dB per cue. Narration and non-ducked tracks match exactly. The cause is in the renderer's ducked path, not in the duck formula; evidence for Boss in §8.
- Checks: typecheck 0 errors; lint 0 errors (3 warnings, all in Boss-owned `src/painted/hanako/look*.tsx`, pre-existing); tests 248 pass, 0 fail; `store.py verify` 7558 stored, 116 locked, 0 problems.

## 2. Changes (stable IDs)

| ID | Cue | Frames | Source (file offset) | Gain, fade, duck | Sheet |
| --- | --- | --- | --- | --- | --- |
| CB1a | `tension_drone-sparse-piano_01` | F1172–F1784 | file 0 s at F1172, no trim (file 20.2 s at F1778) | 0.10; fade-out F1778–F1784 (6 f); duck BED 0.35 | B06-SH02, B07-SH01 |
| CB1b | same file | F1778–F1940 | file 1.000 s (`trimStartSec` 1.0) | 0.10; fade-in F1778–F1784 (6 f); duck 0.35 | B07-SH02 |
| CB1c | same file | F1940–F2061 | file 6.400 s (`trimStartSec` 6.4) | 0.133; fade-out F2046–F2061 (15 f); duck 0.35 | B07-SH03 |
| MN1 | `tension_music-box-motif-minor_01` | F1430–F1456 | file 1/30 to 0.900 s (`trimStartSec` 1/30) | 0.12; fade-out F1452–F1456 (4 f); duck 0.35 | B06-SH02 |
| BZ1 | `electric_light-flicker-buzz_01` | F2129–F2136 | file 1/30 to 0.267 s (`trimStartSec` 1/30) | 0.30; fade-out F2134–F2136 (2 f); no duck | B08-SH01 |
| BZ2 | same file | F2136–F2147 | file 61/30 s = 2.033 s (`trimStartSec` 61/30) | 0.30; fade-out F2143–F2147 (4 f); no duck | B08-SH01 |

- **Removed:** WP1 `bed_warm-pad-felt-third_01` (F1430–F1588); MY1 `bed_mystery-investigation_01` (F1588–F1940); MY2 (same file, F1940–F2046, trim 11.73 s); TK2 to TK6 `ui_click-tick_01` (F1860, F1874, F1890, F1906, F1922).
- **Kept unchanged:** TK1 (F1264), SH1 (F1391), PG3, PG4, PJ1, RT2, MB2, WH2.
- **File offset (open question 2):** the scene sheet has no numbered open question 2 (grep finds none). The nearest open items are E3 §9 item 2 (B09 pause) and P-R5-5 Q2 (script note); neither concerns CB1. I checked the CB1 offset against the sheet's own numbers instead. E3 wired CB1 at file 0 s at F1172 with no trim. That gives file 5.900 s at F1349, 13.867 s at F1588 and 20.200 s at F1778, the sheet's values. No shift was needed.
- **Lock:** added `public/audio/electric/electric_light-flicker-buzz_01.wav` (store `library/sound/sfx/electric/electric_light-flicker-buzz_01.wav`, sha256 f123f9a5…, same hash as the library copy) with `store.py use --episode hanako`. Removed the WP1 and MY1 entries (no longer used). The `public/audio` cache copies of WP1 and MY1 remain (gitignored).

## 3. MN1 (condition: no masking of the first syllable at F1430)

- The library file starts with 52 ms of silence. Note 1 attacks at 0.052 s. Note 2 rises at 0.91 s, outside the 0.867 s cut (the trimmed cut ends at 0.900 s).
- Audible onset with the 1-frame trim: F1430.7 (sheet F1430 ±1: met). Untrimmed it would be F1431.6.
- Levels (render-independent, from the file and the narration): narration RMS F1430 to F1432 −15.1 dBFS (F1430 alone −28.7 dB, the soft onset); MN1 RMS F1430 to F1432 −40.5 dBFS. Difference 25 dB. Narration peak F1430 to F1440 −3.6 dBFS; MN1 component peak F1430 to F1456 −29.9 dBFS. Difference 26 dB.
- Duck: 0.35 across the whole cue, because the ±8-frame look-ahead sees speech throughout.
- **Verdict (measured, not heard):** MN1 does not compete with the first syllable. No delay. Level risk is in O2.

## 4. CB1 pieces (sheet conditions)

- Crossfade at F1778 as the sheet specifies: CB1a and CB1b each carry a 6-frame ramp. The summed gain is 5/6 (−1.6 dB) for F1778 to F1783, then CB1b alone is at 1.0 from F1784 (+1.6 dB). This is the design, measured in §6.
- CB1b reuses file material 1.0 to 6.4 s. Last heard about 14 s earlier (F1202 to F1364). Repeat and ear check are open (§11).

## 5. BZ onsets and level

- Audible onsets: BZ1 F2129.22, BZ2 F2136.33 (sheet ±1 f: met).
- Library transients: first click at 0.041 s (−15 dB in its 10 ms window), second at 2.047 s (−24 dB in its first 1 ms window). BZ2 snaps to 61/30 s; its measured audible onset is F2136.33.
- Levels: BZ1 component RMS −37.5 dBFS (peak −11.5); BZ2 −39.6 dBFS (peak −12.7). Room tone RT2 over F2100 to F2128: −43.0 dBFS, so BZ1 sits 5.5 dB above it (sheet: "just above room tone"). Music box MB2 over the same frames: −46.9 dBFS.
- Tail: none past F2147 (the cue ends at F2147 by construction). No onset between F2137 and F2147. The BZ2 fade tail runs to F2146 (O6).

## 6. Joins (render minus narration; narration is exact, §8)

| Join | Max sample step within ±2 f | Median step, 1 s baseline | Ratio | Level step (mean J+1..J+4 minus mean J−4..J−1) | Design |
| --- | --- | --- | --- | --- | --- |
| F1778 CB1a to CB1b | 0.00203 | 0.00010 | 21 | +1.45 dB | summed gain 5/6 for 6 f, then +1.6 dB at F1784 |
| F1940 CB1b to CB1c | 0.00463 | 0.00016 | 29 | +3.19 dB | +2.48 dB (0.133 over 0.10) |
| F2046 CB1c fade start | 0.00300 | 0.00018 | 16 | −1.96 dB | fade-out F2046 to F2061 with MB2 and RT2 fading in (intended) |

- **Reading:** the sample-step ratio is driven by per-frame gain changes on low-frequency bed material (a gain change Δg on a signal x gives a step of about Δg·x). Each piece is either file-continuous or fades from zero, so there is no waveform splice. These numbers are not a click verdict. Audibility needs an ear (§11).
- The F1940 level step is larger than designed (O1). The F1778 and F2046 steps are the designed fades.

## 7. Level step at F1940 (open, O1)

- Measured: +3.2 dB (4-frame means of render minus narration). Design: +2.48 dB.
- Per-cue gain fits (§8): CB1c k = 1.117 (+0.96 dB) over F1941 to F1980 with residual −96 dBFS (exact). CB1b k = 0.916 (−0.76 dB) over F1880 to F1939, but the shape fit is poor (residual −10 dB relative). The implied CB1c/CB1b ratio is about +1.7 dB.
- Not compensated. I did not change 0.133 to match a gain that the runtime does not explain. The decision is in O1.

## 8. Render against the documented gain rule (evidence for Boss)

- **Rebuild:** `scripts/hanako/short/measure-sound-range.py` rebuilds the mix from `video.audio` (`dump-audio-tracks.mts`) with the runtime rules: `duckGainAt` (`src/scenes/media.ts`), `trackFadeAt`, per-frame `volume(frame)` in `AudioTracks` (`src/scenes/MediaLayers.tsx`), trim in whole frames. Its duck equals the TypeScript `duckGainAt` exactly (maximum difference 0.0 over F1340 to F2160; the duck is 0.35 on 93% of frames).
- **Range residual:** render minus rebuild is −46.6 dBFS RMS, which is −27 dB relative to the signal. Not zero.
- **Exact matches (render equals model):**
  - narration, k = 1.000, residual −95 dBFS (F1432 to F1452);
  - sub-hit with no duck, k = 1.0000 (F1391 to F1420);
  - CB1a with its duck removed in a temporary variant, k = 0.9998 (F1420 to F1460).
- **Ducked tracks differ:**
  - CB1a and MN1 together over F1432 to F1452: CB1a k = 0.886 (−1.05 dB), MN1 k = 0.976 (−0.21 dB), residual −95 dBFS. Two tracks with the same duck depth and the same narration state come out at different factors, so duck depth alone does not explain it.
  - CB1a over F1700 to F1770: k = 0.850 (−1.4 dB), shape fit poor.
  - CB1b over F1880 to F1939: k = 0.916 (−0.8 dB), shape fit poor.
  - CB1c over F1941 to F1980: k = 1.117 (+1.0 dB), exact.
- **Ruled out:** the duck formula (identical to the TypeScript); the envelope (the narration clock is the same JSON, with no transform in `src/`); the volume and fade path (the no-duck variant is exact); the narration.
- **Not ruled out:** the renderer's path for a ducked, function-valued `volume` on `<Audio>`.
- **Temporary experiment:** `src/videos/hanako/index.ts` was edited once (CB1a duck removed) for a render of F1420 to F1460, then restored. The sha256 (db901b65…) was checked identical afterwards.
- **Reproduce:** `scripts/hanako/short/render-sound-range.mjs` and `measure-sound-range.py` (the `gainFits` block).

## 9. Checks (logs in `out/logs/e-r5-*.log`)

- Preflight: `npx remotion versions` reports all packages at 4.0.538; `npm ls --depth=0` matches.
- `npm run typecheck`: 0 errors.
- `npm run lint`: 0 errors; 3 warnings in Boss-owned `look.tsx`, `look-r3.tsx`, `look-r4.tsx` (pre-existing).
- `npm test`: 248 pass, 0 fail.
- `python3 -I scripts/store.py verify`: 7558 stored, 116 locked, 0 problems.
- Sound-only render, frames 1340 to 2160: `out/HANAKO-SHORT/sound-r5/sound_f1340-2160.wav` (27.367 s, 48 kHz stereo, PCM 16-bit, un-normalized, 36 s to render). This is not a picture review render, so `--preview` does not apply; `render.mjs` would loudness-normalize an MP4 in place and change the levels measured.
- Scene samples: not applicable (audio-only change; no picture changed).

## 10. Range loudness and clipping (F1340 to F2160, un-normalized)

- Integrated −16.1 LUFS, LRA 2.7 LU, true peak −2.5 dBTP, sample peak −2.55 dBFS, zero clipped 16-bit samples.
- Delivery normalization in `render.mjs` (about −14 LUFS, −1.5 dBTP limiter) applies to the exported MP4, not to this range. The full export is checked when it is rendered.

## 11. Unverified (not listened)

- Every audible judgement: CB1b re-entry at F1778 (repeat of material last heard about 14 s earlier; Film condition (a), Preaw condition 2); the CB1c step; MN1 presence and masking; BZ1/BZ2 character and level; the stepped per-frame fades (1/6 per frame) on the cold bed; no-loop and seam behaviour.
- Sample-step ratios are not click verdicts.
- Picture, VO timing and subtitles were not changed and were not checked here.

## 12. Open items (returned to the coordinator; not asked)

- **O1, CB1c step:** the render gives +3.2 dB against the sheet's +2.5 dB. Cause is in the ducked path (§8). Options: Boss diagnoses the duck path; or the user accepts the measured step; or the user asks for a volume change. The Editor did not compensate.
- **O2, MN1 presence:** MN1 sits about 25 dB under the narration (RMS, F1430 to F1432; component peak −29.9 dBFS). It may not register as "the one note" on phone speakers. Film or Mark decides; the sheet's 0.12 and duck 0.35 are unchanged.
- **O3, 1-frame trims:** MN1 and BZ1 start at 1/30 s, not at file 0.000 s as the sheet writes. Confirm the deviation, or revert (onsets then at F1431.6 and F2130.2, outside ±1 f).
- **O4, NOTICE:** one line added to `public/audio/NOTICE` (licence record for the reused buzz). This is outside the stated scope. Confirm, or revert.
- **O5, open question 2:** not found in the sheet (§2). Which question was meant?
- **O6, sound after F2139:** Film condition (a) says "no further sound event after F2139". The BZ2 fade tail runs to F2146 with no onset, as the sheet designs. Confirm.
- **O7, crossfade:** the sheet's 6-frame crossfade at F1778 gives −1.6 dB then +1.6 dB, and the fades step 1/6 per frame. Accepted as designed; needs an ear check.
- **O8, Boss:** the ducked-path finding in §8, with the evidence and reproduction commands.
- **O9, ear checks:** CB1b repeat, CB1c step, MN1, BZ1/BZ2 need a human listen (Preaw, Film, user).

## 13. Reproduction

```
python3 -I scripts/store.py use library/sound/sfx/electric/electric_light-flicker-buzz_01.wav public/audio/electric/electric_light-flicker-buzz_01.wav --episode hanako
python3 -I scripts/store.py verify
node scripts/hanako/short/render-sound-range.mjs HANAKO-SHORT 1340 2160 out/HANAKO-SHORT/sound-r5/sound_f1340-2160.wav
python3 -I scripts/hanako/short/measure-sound-range.py out/HANAKO-SHORT/sound-r5/sound_f1340-2160.wav 1340 2160 out/HANAKO-SHORT/sound-r5/measure-f1340-2160.json
npm run typecheck && npm run lint && npm test
```

- Inputs: the composition's `audio` array (`src/videos/hanako/index.ts`), `public/audio/` (locked), `public/narration/HANAKO-SHORT.mp3` and `.amplitude.json`.
- Outputs: `out/HANAKO-SHORT/sound-r5/` (ignored, not archived: not a deliverable). The track dump is `out/HANAKO-SHORT/sound-r5/measure-f1340-2160.tracks.json`.
- New, untracked: `scripts/hanako/short/render-sound-range.mjs`, `scripts/hanako/short/dump-audio-tracks.mts`, `scripts/hanako/short/measure-sound-range.py`.
