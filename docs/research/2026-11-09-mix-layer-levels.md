# Relative layer levels against the voice: research for a mix-targets principle

Researcher: Boat. Checked: 2026-11-09. Scope: rule-document research, not an episode. No claim here is a script claim, so there is no claim ledger. Each finding carries a source ID (S01…) and an evidence class.

**Evidence classes:** `standard` (standard or spec) · `guideline` (published professional or accessibility guideline) · `research` (published study, reported second-hand where marked) · `practitioner` (article or tool vendor, convention not measurement) · `measured` (run by Boat today) · `opinion`.

**Bottom line.** No broadcast standard sets a numeric music-under-voice or SFX-under-voice difference for narrated short-form video. The numbers that exist are:
- a **programme-level** cap on the gap between voice and the whole mix (≤ 5 LU, EBU R 128 s4);
- an **accessibility** floor for background sound (≥ 20 dB below speech, WCAG 1.4.7, AAA);
- **practitioner** conventions of about −18 to −20 dB for music beds and −12 to −18 dB for SFX.

Per-layer, per-beat targets are therefore a project convention built on these anchors. The proposal at the end says which number comes from which source.

## What already exists in the repo (read first)

`docs/editor-principles.md` EP08 and EP08a (read 2026-11-09):
- Default: "Voice carries meaning; music, ambience and SFX support it."
- Beat labels `hold`, `lift`, `drop`, `hit`, `release`.
- Voice rides by beat: −3 dB (`0.7`), 0 dB, up to +2 dB (`1.25`, "measured to stay under −1 dBTP").
- Bed duck gains: `duckUnderNarration` ≈ `0.35` in `hold`, ≈ `0.15` under a must-understand line. These are gain multipliers, not voice-to-bed differences. `0.35` is −9.1 dB and `0.15` is −16.5 dB of *gain change*. The resulting bed-to-voice difference depends on the bed's base level, which is why a measured target is needed.
- Swell in a gap: bed rises 3–6 dB in a pause of ≥ 0.5 s.
- Delivery master: about −14 LUFS integrated, ≤ −1 dBTP.
- EP08a contains **no** relative level targets. EP08 says only "lower or reshape competing music/SFX around speech" and "check consonants… on ordinary listening devices".

## Sources inspected

| ID | Source | Class | Access |
| --- | --- | --- | --- |
| S01 | EBU R 128 (Nov 2023) <https://tech.ebu.ch/docs/r/r128.pdf> | standard | PDF downloaded, text extracted; only headings and front matter read. R 128 figures are taken from S02/S03. |
| S02 | EBU Tech 3343 (2023) <https://tech.ebu.ch/docs/tech/tech3343.pdf>: §3.3 LRA; §9.1 short-form; §9.2 streaming; §9.4 cinematic content | guideline | read in extracted text |
| S03 | EBU R 128 s1 (short-form), <https://tech.ebu.ch/docs/r/r128s1.pdf>; R 128 s4 (cinematic/LDR), <https://tech.ebu.ch/docs/r/r128s4.pdf> | standard | read in extracted text |
| S04 | Netflix Sound Mix Specifications and Best Practices, <https://partnerhelp.netflixstudios.com/hc/en-us/articles/360001794307> (redirects to studiopartner.netflix.net/studio/branded-sound-mix-spec-and-best-practices; page dated 2026-11-04) | guideline (branded delivery spec) | read via a text proxy (r.jina.ai); page is JavaScript-rendered |
| S05 | AES TD1004.1.15-10, Loudness of Audio Streaming and Network File Playback, <https://www.aes.org/wp-content/uploads/2024/01/AESTD1004_1_15_10.pdf> | guideline | read via text proxy |
| S06 | W3C WCAG 2.2 Understanding SC 1.4.7 Low or No Background Audio, <https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html> | standard (AAA, optional level) | read via text proxy |
| S07 | BBC R&D WHP 324, M. Armstrong, *From Clean Audio to Object Based Broadcasting*, <https://downloads.bbc.co.uk/rd/pubs/whp/whp-pdf-files/WHP324.pdf> | research (literature review plus BBC trials) | PDF downloaded, text extracted |
| S08 | BBC Academy, *Why is loudness such an issue for TV viewers?*, <https://www.bbc.com/academy-guides/why-is-loudness-such-an-issue-for-tv-viewers> | guideline (qualitative) | read via text proxy |
| S09 | Apple Podcasts audio requirements, <https://podcasters.apple.com/support/893-audio-requirements> | guideline | read via text proxy |
| S10 | Spotify loudness normalization, <https://support.spotify.com/us/artists/article/loudness-normalization/> | guideline | only the −14 LUFS reference seen; no mix-balance content |
| S11 | Pure Audio Insight, *Background Music Volume: How Loud Should It Be*, <https://pureaudioinsight.com/blogs/content-production/background-music-volume-how-loud-should-it-be> | practitioner | read via text proxy |
| S12 | VividSpark blog, <https://www.vividspark.ai/blog/how-to-optimize-music-volume-for-voiceover-and-dialogue> | practitioner (vendor, weak) | read via text proxy |
| S13 | Neon Audio, voice-music balance tool, <https://www.neonaudiollc.com/tools/voice-music-balance.html> | practitioner (tool vendor) | read via text proxy |
| S14 | Boat measurements, ffmpeg 9.0.2, 2026-11-09 (commands under Q5) | measured | run locally |

**Not inspected, so not relied on:**
- ATSC A/85. The ATSC page returned navigation only and the PDF URLs I tried returned 404.
- AES TD1008 (the AES PDF host returned HTTP 403 and the AES search path returned nothing).
- YouTube's own loudness help page (the URL I tried returned 404).
- Ofcom text on programme sound.
- Any measurement of phone-speaker response.

I recall ATSC A/85 as −24 LKFS ±2 dialogue-gated with true peak ≤ −2 dBTP. Treat that as a **lead only**.

## Q1. Narration/dialogue anchor

- **Dialogue-gated programme loudness.** Netflix sets −27 LKFS ±2 LU, dialogue-gated (ITU-R BS.1770-1), true peak ≤ −2 dBTP and a −2.3 dBFS limiter recommendation. It states the programme target (−24 LKFS ±2) is used instead when dialogue is under 15% of the mix. (S04, guideline.) Netflix normalises every title, so the gating is the lever that keeps *dialogue* at a consistent level while music and effects float around it.
- **EBU is programme-based plus a dialogue-ratio cap.** R 128 targets −23 LUFS programme loudness. For speech-led "cinematic content", R 128 s4 recommends that the Loudness-to-Dialogue Ratio (LDR = programme loudness − dialogue loudness) should **not exceed 5 LU**. If it is within 5 LU no dynamic adaptation is needed, and raising dialogue to equal programme loudness (LDR = 0) "should be avoided". (S03, standard.) The reason, from Tech 3343 §9.4: normalising a dynamic mix to programme loudness can push speech too low and effects too loud (S02). LDR in R 128 s4 is measured on the dialogue stem or the centre channel.
- **Stems need not match.** Tech 3343: individual stems (pre-mixes, M&E, isolated voice-over) "do NOT" all have to sit at the same loudness. Loudness variation is an artistic tool (S02, guideline). AES TD1004 agrees: normalising speech and music to the same loudness "can yield inartistic balances", so balances should be set by the programme's creators (S05).
- **Speech versus music segments.** AES TD1004 notes speech normalised to the same integrated loudness as music "inevitably sounds too loud" and recommends placing **speech segments 2–4 LU (or more) below** other segments. This concerns separate segments in a stream, not music under a voice. (S05, guideline.)
- **Platform references for a voice-led master.** Apple Podcasts: −16 LKFS ±1, true peak ≤ −1 dBFS (S09). Spotify normalises to −14 LUFS (S10). AES streaming: target −20 to −16 LUFS, peak ≤ −1 dBTP (S05). Our −14 LUFS / −1 dBTP master is a project choice (EP08a), above the AES range and equal to Spotify's reference; see the "disagree" notes.
- **Derived (Boat, arithmetic not source):** if the music, ambience and SFX stay well under the voice, the voice stem's speech-gated loudness is within about 1–2 LU of the master, so the voice anchor is **about −14 to −16 LUFS speech-gated** for a −14 LUFS master. The voice level is the reference; the other layers are set relative to it.
- **Short-form measurement note.** For content under about 2 minutes, LRA is not meaningful: "too few data points" because it is built from 3-second windows (S02 §9.1, S03). EBU instead uses **Maximum Short-term Loudness (MSL)**: programme −23 LUFS, MSL ≤ −18 LUFS (+5 LU), true peak ≤ −1 dBTP, LRA not applicable (S03). Tech 3343 §9.2 repeats +5 LU for streamed short-form (< 60 s). The +5 LU rule is therefore a guideline for short-form peaks at 3 s resolution. Applying it to a −14 LUFS master gives MSL ≤ −9 LUFS **by analogy only** (EBU does not define it for −14).
- **Phone speakers (gap).**
  - AES TD1004 gives the mobile rationale for its −20 LUFS floor: some mobile devices lack the gain to play the common −23/−24 LUFS targets at satisfying loudness (S05).
  - Device peak limiters can act unpredictably on high peak-to-loudness material (S05).
  - Tech 3343 §9.2 says devices in noisy or limited-headroom situations may need adapted dynamics (S02).
  - **I found no inspected spec giving a phone-speaker-specific voice-to-music difference.** Practitioner S11 says only that music set too high masks speech "especially on smaller speakers or mobile devices" (practitioner).

## Q2. Music bed under speech

| Number | Meaning | Source / class |
| --- | --- | --- |
| **≥ 20 dB** below foreground speech | Background sound for prerecorded audio-only content that is mainly speech; excludes occasional sounds lasting only 1–2 s. Level AAA. Rationale cites assistive-listening and hearing-aid research. No measurement window is given. | S06, standard (accessibility). Applies to audio-only content; applying it to video is by analogy. |
| **−18 to −20 dB** below speech | "Starting point" for a music bed, "comparing the same kind of average-level measurement", then adjust. "Too high" is −3 to −12 dB (masking). More than −25 dB is "very subtle". Up to −22 dB for complex explanatory content. | S11, practitioner (cites W3C). |
| **−18 to −30 dB** below speech, "at least 12–15 dB" lower | Same family, wider band. | S12, practitioner (vendor, weak). |
| **LSR ≤ 5 LU** | Programme loudness minus speech loudness; this is R 128 s4's LDR restated in a mix-checking tool. | S13 (tool) citing S03 (standard). |
| **4 dB** background louder made 452 online-panel participants find BBC programmes harder to follow in every case; 4 dB quieter was mixed (some improved, one worse). | The BBC reports its own trials. | S07, research. |
| Mathers (BBC R&D, as reported in S07) | Inconclusive on background level versus intelligibility, no statistical analysis. | S07, research (second-hand). |

**Reading.** The sources disagree in scope, not direction: R 128 s4's 5 LU is a *whole-programme* cap that allows music to rise to near voice level between lines, while WCAG's 20 dB and the practitioner −18 to −20 dB apply *while speech is present*. The 20 dB WCAG figure comes from accessibility work. S07 says the often-cited "20 dB below normal" for a clean-audio track was not backed by evidence in the source documents it traced (the claim in the Meares paper referenced the BBC work, which was inconclusive). Treat 20 dB as a defensible accessibility target and a practical ceiling for must-understand lines, not as an evidence-proven intelligibility threshold.

**Ducking depth guidance.** I found no standard giving a ducking depth. Auphonic's multitrack documentation describes automatic ducking (music "softer if someone is speaking") but states no dB value in the pages read (practitioner tool documentation, <https://auphonic.com/help/algorithms/multitrack.html>). The only numbers are the depth *result* above (−18 to −20 dB below speech). S12 adds a ducking-trigger threshold of −25 to −35 dB (a detector setting, not a depth).

**Between speech passages (music up in gaps).** No standard gives a gap level.
- R 128 s4 supports letting the bed rise as long as programme loudness stays within 5 LU of dialogue loudness.
- S11 says music "can rise when no one is speaking; reduce it before speech begins", and that the transition must not force the listener to adjust volume (practitioner).
- EP08a's existing 3–6 dB swell is a repo convention.

## Q3. Ambience / room tone

- **No source gives an ambience-to-voice number.**
- WCAG 1.4.7 covers "background sounds" generally, so ambience belongs to the same ≥ 20 dB class as music. The criterion has no exception for ambience except occasional 1–2 s sounds (S06).
- Netflix groups "Backgrounds" and "Foley" as separate stems (labels "Dialog", "Narration", "Music", "Effects", "Backgrounds", "Foley") but sets no level for them (S04).
- Tech 3343 notes foreground sounds should be set a bit cautiously because **background sounds add to the programme loudness** (S02). Related practical point: levels add, so several quiet layers raise the background total. Two layers at −20 dB each sum to about −17 dB.
- S07 gives speech-in-noise context: listeners with normal hearing need some speech-to-noise ratio for 50% word recognition; mild-to-moderate hearing loss needs about **4–6 dB more**, moderate-to-severe **7–9 dB more**, severe-to-profound up to **18 dB more** (research summary, S07). These are increments over a normal-hearing baseline, not absolute ratios.

## Q4. SFX

- **Accents / hits.** No standard gives accent level against dialogue.
  - S11 (practitioner) lists SFX at −12 to −18 dB relative to speech as a starting guide "set in context", and says a sound effect "should not distract from or overpower main speech".
  - WCAG exempts "occasional sounds that last for only one or two seconds" from the 20 dB rule (S06). That supports a short accent being louder than a background bed. It is a lawful exception for sounds up to 2 s only, and only occasionally.
  - R 128 s4 and S02 caution that mixes with "too loud sound effects" relative to dialogue are the main complaint driver (S02, S08 qualitative). BBC Academy reports audience complaints about background music too loud and dialogue unintelligible (S08).
- **Texture / foley.** Same class as ambience and music bed: background, ≥ about 20 dB below speech while speech is present (S06 by analogy; S11 −12 to −18 for generic SFX is the looser practitioner number).
- **Headroom / true peak.** Delivery specs:
  - Netflix: −2 dBTP, limiter −2.3 (S04).
  - Apple, AES, EBU short-form: −1 dBTP (S09, S05, S03).
  - AES notes that peaks can rise after lossy encoding, so use a −1.0 dBTP safety limiter before the encoder (S05).
  - Loudness measurement barely sees short transients: **measured (S14)** a 0.3 s pink-noise burst gave momentary (400 ms) max −35.8 LUFS but short-term (3 s) max −44.5 LUFS, about **8.7 LU lower** on the short-term meter. Check hits with momentary loudness and true peak, not short-term.
  - The master true peak is dominated by whichever layer peaks highest. Voice at +2 dB (EP08a) and a hit on top both count; the −1 dBTP check is on the mixed master.

## Q5. How to measure each layer per beat

**Method (all steps are reproducible with ffmpeg and a small script).**

1. Render each layer to a separate stem at the same mix gains as the draft mix: voice, music, ambience, SFX-accent, SFX-texture. Netflix requires that DME stems "equal the mix when combined" for deliveries (S04), which is the same discipline.
2. From the mix cue sheet, define per-beat windows (start, end, intent) and per-beat "voice speaking" and "gap" sub-windows from the narration timings.
3. For each stem and each window, measure momentary (M, 400 ms), short-term (S, 3 s) and integrated (I) loudness, and true peak.
4. Compute the differences against the voice.

**Per-sample metadata (measured, ffmpeg 9.0.2, 2026-11-09):**

```
ffmpeg -i stem.wav -af "ebur128=metadata=1:peak=true,ametadata=print:key=lavfi.r128.M:file=m.txt,ametadata=print:key=lavfi.r128.S:file=s.txt" -f null -
```
- Prints `lavfi.r128.M` and `lavfi.r128.S` every 100 ms with timestamps.
- `S` stays near −120 for the first seconds because the 3 s window is not full. Discard the first 3 s of S per stem, or measure S only inside windows ≥ 3 s.
- Integrated loudness and true peak for a whole file or an `atrim`med window: `ffmpeg -i stem.wav -af "atrim=start=S:end=E,ebur128=peak=true" -f null -`. The final summary prints `I`, `LRA`, `Peak`.
- Bursts under 0.4 s: M is the only meaningful loudness number, plus true peak. Do not report S for them (see Q4 measured note).

**Averaging in windows.** Average M and S values in the energy domain (mean of 10^(L/10), then 10·log10), not by averaging the dB numbers. Treat values below −70 LUFS (BS.1770 absolute gate) as silence. A layer with no energy in a window passes any "at least X LU below voice" rule.

**Which window per target.**
- Layer-versus-voice while speech is present: speech-gated integrated loudness of the layer over the "voice speaking" windows against the voice stem's integrated loudness over the same windows. This is the stem-based form of the R 128 s4 dialogue measurement, which uses the dialogue stem or centre channel (S03).
- Gap swells and returns: momentary maximum in the gap against the voice stem's mean M while speaking.
- Whole-mix check: master integrated minus voice speech-gated integrated, the LDR of R 128 s4 (≤ 5 LU, S03).
- LRA is skipped for Shorts (S02, S03); use MSL, momentary max and true peak.

**Tolerance.** Published tolerances are for whole-programme loudness only:
- ±0.5 LU file match (AES, S05)
- ±1 LU (Apple, S09)
- ±2 LU (Netflix, S04)
- ±0.2 LU measurement tolerance for short-form MSL checking (R 128 s1, S03)

**No source gives a per-beat layer tolerance.** A practical figure is **±2 LU on a sustained layer** (matching Netflix's programme tolerance and well inside the 4 dB step BBC listeners noticed, S07) and **±3 LU on single hits**, which depend heavily on window alignment. This is Boat's proposal, confidence low.

## Q6. Accessibility

- **W3C WCAG 1.4.7 (AAA):** background sounds at least **20 dB** lower than foreground speech; occasional sounds of 1–2 s excepted; or provide no background, or let it be turned off (S06, standard). It is an *optional* conformance level, written for audio-only content.
- **BBC R&D (S07):**
  - Background sound reduces speech comprehension, more for listeners with hearing loss.
  - Hearing-impaired listeners need additional speech-to-noise ratio (4–6, 7–9 and up to 18 dB for increasing loss, as above).
  - The BBC found **a 4 dB rise in background level made programmes harder to follow in all eight programmes tested**, and a 4 dB reduction gave mixed results. The BBC concluded in that paper that a separate clean-audio mix is not simply "music and effects −20 dB". The 20 dB claim was not supported by the evidence its sources cited.
- **BBC Academy (S08):** audibility, background music too loud and unintelligible dialogue are among the top audience complaints. The page gives no dB figure.
- **No Ofcom numeric rule was found** (searches returned complaint-handling and access-service pages, not level guidance).
- **Minimum voice-to-background difference.** The only numeric accessibility floor is the 20 dB of WCAG. It is cited as an optional target for Level AAA, not a legal minimum for video.

## Where sources disagree or leave a gap

1. **5 LU versus 20 dB.** R 128 s4 caps the gap between the *whole mix* and the dialogue at 5 LU. WCAG and practitioners ask for 18–20 dB for the background *during speech*. They measure different things; a mix can satisfy both when the music rises only in gaps.
2. **Practitioner ranges differ** between −12 and −30 dB for music (S11 −18 to −20, up to −22; S12 −18 to −30, "at least 12–15"). They have no shared measurement basis (peak, RMS, LUFS and fader dB are mixed).
3. **Netflix dialogue loudness-range figure.** The current official page says Dialog LRA ≤ **10 LU** (checked 2026-11-09). Tool vendor S13 says ≤ 7 LU. Use the official number, and note that the figure may be revised.
4. **Master target.** The project's −14 LUFS is above AES (−16 max), Apple (−16) and Netflix (−27 dialogue-gated, a different gating). That is a platform choice. It does not change relative levels, but it narrows headroom: peak-to-loudness ratio at −14 LUFS with −1 dBTP is 13 dB, so hits cannot rise far above voice peaks.
5. **WCAG 20 dB has no measurement window**, and its rationale references assistive-listening research that I did not open. I treated it as spec text, not as an independently verified threshold.
6. **Ducking depth and gap-swell levels** have no standard source; EP08a's 3–6 dB is repo convention.
7. **Phone speakers:** see Q1 gap.

## Proposed starting table

Notation. **ΔV** = voice stem loudness minus layer loudness (LU; positive means the layer is quieter than the voice). "Voice speaking" windows are the narration word spans from the narration timing. Layer and voice are measured with the same BS.1770 K-weighting.

| Layer | Situation | Target relative to voice | Measure with | Basis | Confidence |
| --- | --- | --- | --- | --- | --- |
| **Whole mix** | Whole video | master integrated minus voice speech-gated integrated ≤ **+5 LU** (hard cap); aim ≤ **+2 LU** | integrated loudness of master and voice stem over speech windows | cap: R 128 s4 (S03, standard); +2 is Boat convention | cap high; +2 low |
| **Music bed** | Voice speaking, `hold` | ΔV **15–20 LU** (aim 18) | integrated over speech windows, or mean S ≥ 3 s | 18–20: S11 (practitioner) and S06 (20 dB, AAA, by analogy); 15 lower bound: practitioner S12 "12–15" | medium |
| | Voice speaking, must-understand line (number, easy-to-mishear Thai word) | ΔV **≥ 20 LU** | same | S06 (accessibility); S11 "up to −22" | medium |
| | Gap between lines (≥ 0.5 s), `lift` swell | momentary max ΔV **6–12 LU** in the gap, back to the speaking-window level before the next word | M max in the gap against voice mean M while speaking | EP08a swell 3–6 dB (repo); keeps programme within S03's 5 LU; the exact gap value is Boat's proposal | low |
| | `drop` | bed and ambience pulled down or out for 0.3–1.5 s (EP08a); target ΔV ≥ 30 LU or silence | M | EP08a (repo) | repo convention |
| | Hit / `release` return | bed momentary max **never above the voice's speaking level** (ΔV ≥ 0 LU) | M | no standard; Boat proposal built on S03 | low |
| **Ambience / room tone** | Voice speaking, as a background under music | ΔV **≥ 20 LU** for the sum of ambience, music bed and texture (budget each layer 3 LU lower when two or more are present) | measure the sum of all non-voice layers and each layer | S06 covers all background sounds; summing is arithmetic; per-layer budget is Boat's | medium for the sum |
| | Ambience as the bed (no music) | ΔV **15–20 LU** | integrated over speech windows | follows the music-bed row; no source separates ambience from music | low |
| | Gap or `drop` | may rise to ΔV **10–15 LU** | M | no source | low |
| **SFX texture / foley** | Voice speaking | ΔV **≥ 18–20 LU** | integrated over the cue span | S06 by analogy; S11 −12 to −18 as the looser practitioner figure | medium-low |
| **SFX accent (hit, stinger, riser)** | Not overlapping speech (in a gap) | momentary max ΔV **0 to +6 LU** louder than voice mean M is the ceiling; typical **−3 to 0 LU** (at or just under voice level); true peak under −1 dBTP | M, true peak | no standard; S11 gives −12 to −18 (practitioner) as a low-intrusion guide; the 0 ceiling is Boat's | low |
| | Overlapping speech (avoid) | if unavoidable: ΔV **≥ 12 LU**, and ≤ 2 s | M | S11 (−12 to −18), S06 1–2 s exception | low |
| | Any | true peak on the master ≤ **−1 dBTP** (Netflix −2 dBTP for its branded delivery) | true peak on the mixed master | project spec EP08a; S05, S09, S03; S04 | high |
| **Voice** | Reference | speech-gated integrated about **−14 to −16 LUFS** for a −14 LUFS master; per-beat ride −3 / 0 / +2 dB (EP08a); peaks under −1 dBTP | integrated over speech windows; true peak | derived arithmetic plus EP08a | medium |

**How to read the confidence column.**
- High: standard or published cap.
- Medium: standard-by-analogy or consistent practitioner convention.
- Low: Boat's proposal with no direct source; adjust after measuring the first draft mixes.

**Tolerance to write with each target.** ±2 LU on sustained layers; ±3 LU on single-hit momentary values; true-peak checks are hard limits (Q5). **Ear check stays mandatory.** The only independent evidence that these ratios give intelligible Thai narration on a phone speaker would be a listening test, which neither this research nor any inspected source provides.

## Limits of this research

- Several sources were read through a text proxy or extracted from PDFs with a simple extractor, so wording is paraphrased and I did not verify figures or layout beyond the quoted phrases.
- ATSC A/85, AES TD1008, YouTube's own loudness page and Ofcom level guidance were not inspected.
- WCAG 1.4.7 and the R 128 s4 5 LU rule are the only standards-level numbers touching relative speech level, and neither was written for 60–120 s phone video.
- Practitioner figures (S11, S12, S13) are convention, not evidence of intelligibility, and S12 and S13 are vendor pages. Every row marked "low" should be revised once Ton measures real draft mixes against this table.
