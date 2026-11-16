# EP21 — selected-setting length projection

- Revision: **EDU-EP21-TIMING-R2**, 2026-11-16; coordinator mechanically applies Preaw's R1 formula to Editor's user-requested slower derivatives. Syllables, pause budget and narration are unchanged.
- Deliverable: **EDU-EP21-SHORT**; channel `edu`; Short only.
- Exact narration: [script](script.md) **EDU-EP21-SCRIPT-R1**, L01–L12, unchanged; [factual review](fact-check.md) **EDU-EP21-FACT-R1**; [Hook Guide](../hook-guide.md) **EDU-EP21-HOOK-R1**.
- Governing scope and decisions: [delivery](../delivery.md); current production continuation supersedes the earlier writing-only scope. This file records timing evidence, not script approval, voice choice or a voice lock.
- Status: **W1.4 complete — user selected Kore ×1.05**, 2026-11-16: "เลือก 1.05". Selected-setting projection: **43.97 ≈ 44.0 s**, using the episode-local sample, 176 syllables, unchanged 4.35 s authored pauses and 3 s closing hold. This meets the 40–60 s target without padding. W1.5 remains explicitly deferred. No full narration has been generated or measured; Film's integer frames require the later W4 full-read measure. Candidate discussions below preserve their pre-selection history.

## Spoken-syllable recount

Manual Thai pronunciation audit, not a word or character count. Ordinary compound words are counted as spoken syllables (for example, the two syllables in metal and protection), not one token per written word. Punctuation is silent.

| Line | Spoken syllables | Authored ellipsis | Boundary after line |
| --- | ---: | ---: | ---: |
| L01 | 14 | 1 | 1 |
| L02 | 17 | 0 | 1 |
| L03 | 12 | 0 | 1 |
| L04 | 13 | 1 | 1 |
| L05 | 19 | 0 | 1 |
| L06 | 12 | 1 | 1 |
| L07 | 17 | 0 | 1 |
| L08 | 10 | 0 | 1 |
| L09 | 17 | 0 | 1 |
| L10 | 12 | 0 | 1 |
| L11 | 16 | 0 | 1 |
| L12 | 17 | 1 | 0 |
| **Total** | **176** | **4** | **11** |

The R1 estimate counted L10 as 13; its natural reading is 12. This resolves optional Boat note O21-02. Narration, captions, factual implications, beat IDs and the hook are unchanged, so SCRIPT-R1 and FACT-R1 remain the dependencies. The opening sample L01–L02 contains **31 syllables**, one ellipsis and one line boundary inside its speech span.

## Pause and picture budget

The script already allows approximately 4–5 s of pauses plus a **3 s closing hold**. For an explicit projection, distribute that existing allowance as four ellipses at 0.40 s plus eleven line boundaries at 0.25 s: **4.35 s** in total. These are provisional editorial pause targets, not measured gaps or locked event frames. Ordinary spaces within lines are not additional pause slots. The three-second closing hold begins after L12's speech; no second fade/hold allowance is added.

This budget does not add an introduction, wordless padding, new reaction lines or extra mechanisms. Film may stage action during the speech. A different pause interpretation changes the projection and must be recorded rather than silently stretching the video to 40 s.

## Calibration inventory in the active checkout

All entries below were inspected on 2026-11-16. Neither another episode's choice nor the channel default is an EP21 user choice.

| Evidence | Voice / style / pace | Use and limit |
| --- | --- | --- |
| [EP19 voice measure](../../ep19/short/voice-measure.json), EDU-EP19-VOICE-R2; [readable measure](../../ep19/short/voice-measure.md) | Kore, exact channel style `warm, friendly, smiling storyteller, speaking rapidly`, atempo **0.9491**; user-picked take `r4_t1_slow8`, 36.48 s | Latest episode-number matching-style locked-read evidence found. It demonstrates that a later matching-style take/pace differs from the old 5.5/5.9 reference; it is **not** same-pace calibration for either EP21 candidate. |
| [EP17 v2 measure](../../ep17/measure-v2.json), 2026-11-15; [narration notes](../../ep17/narration-notes.md), Step 3 | Kore, exact channel style, atempo **1.05**, user-picked candidate B; 0.231–49.918 s speech span, natural pauses included | Matching style but another pace. The final read supersedes EP17 v1's pause-normalized take. Do not transfer its user choice or add its pauses again. |
| [EP17 narration notes](../../ep17/narration-notes.md), Step 1 | Same Kore style, opening sample at **1.08 / 1.15**; measured gross speech rates **5.47 / 5.82 syllables/s** | Existing same-setting short-sample reference. Its 42-syllable span includes its natural pauses. It is a useful comparison, not a reason to double count EP21's 4.35 s pause budget. Later EP17 takes had different pause timing. |
| [EP16 v2 measure](../../ep16/narration-measure-v2.json), 2026-11-15 | Kore, calm/natural/matter-of-fact **no-smile** style, atempo **1.028571** | Excluded from EP21 calibration: voice name matches, style and pace do not. The channel's earlier EP16 opening reference does not make this later full read equivalent. |

The same-day records do not provide a reliable cross-episode wall-clock ordering; “latest” above means the latest matching-style episode-number evidence found, not a claim that all prior episodes were locked in numerical order. The new episode-local opening sample below is the actual candidate-setting calibration. Earlier reads serve only as drift/context evidence.

## Candidate sample method

Editor owns the episode-local L01–L02 sample and its measurement/manifest. Use one raw take at the exact channel voice/style, with local atempo derivatives at 1.08 and 1.15. Every candidate offered to the user must be at most 10 s. No full-script read belongs at W1.4.

For each candidate let `T` be the measured speech span from the first speech onset to the last speech end, excluding leading and trailing silence. Let `P` be only the measured gaps at the sample's two explicit pause slots: L01's ellipsis and L01→L02. Then:

`baseline syllables/s = 31 / (T - P)`

`projected video seconds = 176 / baseline syllables/s + 4.35 + 3.00`

The baseline retains ordinary within-line phrase timing and word-internal low-energy intervals. Removing only the two explicit slots before adding the whole script's fifteen slots prevents charging sample pauses twice. If the two gap identities are uncertain, keep a visible sensitivity range; do not treat an arbitrary silence threshold as a pronunciation boundary.

For comparison, the gross-span extrapolation is `176 / (31 / T) + 3.00`, with **no additional 4.35 s**. It assumes the sample's pause density applies to the whole read, so it is a sensitivity check rather than the authored-pause projection. A short sample cannot establish that a long take keeps its pace or timbre.

## Episode-local sample results — R1 history

Source: Editor's [voice sample manifest](voice-samples.md), **EDU-EP21-VOICE-SAMPLES-R1**, L01–L02, 2026-11-16. One raw Kore take with the exact channel style; two local atempo derivatives; no full read. The source file is 7.600 s; the candidates are 7.057250 s and 6.623125 s, both below the ten-second audition cap.

| Measure / projection | Kore ×1.08 | Kore ×1.15 |
| --- | ---: | ---: |
| Speech start–end, candidate-file seconds | 0.26–6.83 | 0.24–6.43 |
| Gross speech span `T`, pauses included | 6.57 s | 6.19 s |
| L01→L02 low-energy gap, candidate-file seconds | 2.91–3.19 = 0.28 s | 2.74–3.02 = 0.28 s |
| L01 ellipsis removed from baseline | 0.00 s detected | 0.00 s detected |
| Baseline span `T - P` | 6.29 s | 5.91 s |
| Baseline rate, 31 syllables divided by baseline span | 4.9285 syllables/s | 5.2453 syllables/s |
| Projected 176-syllable baseline duration | 35.71 s | 33.55 s |
| Existing authored pause budget + closing hold | 4.35 + 3.00 s | 4.35 + 3.00 s |
| **Authored-pause video projection** | **43.06 ≈ 43.1 s** | **40.90 ≈ 40.9 s** |
| With original 4–5 s pause-budget range + same hold | 42.7–43.7 s | 40.6–41.6 s |
| Gross-span sensitivity, no extra pause budget | 40.3 s | 38.1 s |

The acoustic measurements use 10 ms RMS blocks at −40 dBFS. The line boundary is supported by the rough ASR order, but quiet consonants can be counted inside a low-energy gap. At −45 dBFS its gap measures 0.26 s at ×1.08 and 0.27 s at ×1.15, moving the main projection by about 0.11 s and 0.06 s respectively. No ellipsis gap of at least 40 ms was detected at −40 dBFS: removal of 0.00 s means **none detected by this method**, not proof of a literally absent pause. The 0.40 s ellipsis allowance remains an editorial target, not a measured property of this take.

Both main projections fit the 40–60 s default without adding material. **Recommend ×1.08 for the user to hear and choose**: its estimate has more lower-bound margin while retaining the same concise script. ×1.15 also fits when the authored pauses are present, but its gross-span sensitivity falls below 40 s. Do not promise a 40 s minimum from the faster sample alone. The 4–5 s ranges model pause-budget variation only; take-to-take pacing and late-read drift remain additional uncertainty until the W4 full read.

Editor reports that ASR confuses two opening words; that is not a pronunciation verdict. The user must hear the candidates. No agent listening or script/voice approval is claimed.

## Requested slower candidates — R2

The user requested ×1.03 and ×1.05 rather than selecting an R1 candidate, and explicitly deferred script approval to read SCRIPT-R1. Editor's **EDU-EP21-VOICE-SAMPLES-R2** derives both candidates locally from the same original take, with no new TTS or transcription. Apply the identical R1 calculation: `176 × (T - P) / 31 + 4.35 + 3.00`.

| Measure / projection | Kore ×1.03 | Kore ×1.05 |
| --- | ---: | ---: |
| WAV duration | 7.384771 s | 7.249375 s |
| Speech start–end, candidate-file seconds | 0.27–7.17 | 0.27–7.03 |
| Gross speech span `T` | 6.90 s | 6.76 s |
| L01→L02 low-energy gap | 3.06–3.36 = 0.30 s | 2.99–3.30 = 0.31 s |
| L01 ellipsis removed from baseline | 0.00 s detected | 0.00 s detected |
| Baseline span `T - P` | 6.60 s | 6.45 s |
| Baseline rate, 31 syllables divided by baseline span | 4.6970 syllables/s | 4.8062 syllables/s |
| **Authored-pause video projection** | **44.82 ≈ 44.8 s** | **43.97 ≈ 44.0 s** |
| Original 4–5 s pause-budget range + same hold | 44.5–45.5 s | 43.6–44.6 s |
| Gross-span sensitivity, no extra pause budget | 42.2 s | 41.4 s |

Both requested candidates fit the 40–60 s default without adding material. These are conditional estimates from short samples, not full-read measurements. The same acoustic gap/quiet-consonant and long-read drift limitations above apply. R1 candidates remain provenance; none of the four paces is selected. W1.4, W1.5 and Film remain pending the user's separate decisions.

## Decision and completion boundary

The default full-video target is **40–60 s**. A projection above 63 s requires trims before approval; a projection below 40 s is an unresolved lower-bound/default-duration choice, not a pass disguised by extra silence. Preserve the concise story. If both candidates project below 40 s, the coordinator can ask for an explicit shorter episode target or a genuine script revision; it must not pad or copy EP20's length.

W1.4 completes only after the episode setting is selected and its resulting projection/target decision is recorded in the delivery record. W1.5 remains the user's explicit approval of SCRIPT-R1 at that projected duration. A voice sample pick alone does not approve the script; “continue” alone approves neither. The first full narration remains after W2.3, and final frame timing comes from its W4 measure.

## Change log

- 2026-11-16, selection synchronization: coordinator records "เลือก 1.05". Selected projection 43.97 s; W1.4 complete. W1.5 stays deferred; no script change, audio regeneration or full-read approval follows from the pace choice.

- 2026-11-16, R2: coordinator for Preaw's unchanged R1 calculation added Editor's ×1.03/×1.05 sample metrics at the user's request. Projections 44.8/44.0 s; no narration, pause-budget or factual change. User explicitly deferred script approval; no pace choice inferred.

- 2026-11-16: Preaw recounted 176 syllables, separated authored pauses from pause-inclusive sample rates, inspected later channel read evidence, and applied Editor's episode-local ≤10 s candidate measurements. Main projections: ×1.08 43.1 s; ×1.15 40.9 s. No Thai narration or factual claim changed; no new factual review was run.
