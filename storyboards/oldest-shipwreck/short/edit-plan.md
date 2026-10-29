# Edit plan — SHIPWRECK-SHORT (Editor, Light tier)

Deliverable `SHIPWRECK-SHORT`; script `SHIPWRECK-SHORT-R1.1`; brief `VB-SHIPWRECK-SHORT-R1`; Mark `N/A` (the brief's shot list replaces scene sheets). Composition `SHIPWRECK-SHORT` (1080×1920, 30 fps, **1,775 frames = 59.17 s**, ending `B_loop`), registered in `src/videos/oldest-shipwreck/index.ts`. Source of truth for slots, cues, plate cues and SFX: `scripts/oldest-shipwreck/short/narration-timeline.json`. Editor, 29 Oct 2026.

## Narration

Edge TTS `th-TH-PremwadeeNeural`, rate +5% (user choice). Generated per narration slot, not per beat: Edge TTS pauses only 80–130 ms on "…", while the script writes 0.3–0.6 s pauses and a held silence after "ร้อยสองร้อยปี". 21 slots (split only where a pause or an exact picture/sound event needs it); per-slot pause after the speech is authored in the slot duration. Measured: per-beat read 46.2 s of speech; per-slot read 49.6 s of speech; pauses 6.2 s; hold 3.0 s. Total 59.17 s (target 45–60 s), so no trim was applied. Cue offsets inside merged slots come from silence gaps in the clip (`scripts/oldest-shipwreck/short/check-cues.py` reports every cue 17–77 ms before its speech onset; the hook cue is shown from frame 0).

User read notes (29 Oct 2026), R2 of the narration: 22 slots (21 again in R3). "…เคยพบ." and "แล้วจะรู้อายุมันได้ยังไง?" are separate slots (0.36 s pause, was none; "แล้ว" +3 dB via `gains`; B01 length kept by trimming the hook pause 0.46→0.32 s). "แม้แต่": the drawn-out "แม้" vowel and the stop closure are shortened 0.12 s via `cuts`. R3: "…แค่ร้อยสองร้อยปี" is read in one slot with no "…" in the TTS text (the user heard the split as a long pause); the caption keeps "แค่… ร้อยสองร้อยปี". The 0.43 s after "ปี" is the held silence; B05 and every later time are unchanged. "กับไหที่" is fed to TTS as "กับไห…ที่" (the caption is unchanged), because the run-in read dropped "ที่" (checked with faster-whisper).

Regenerate: `npm run narration -- --timeline scripts/oldest-shipwreck/short/narration-timeline.json --name SHIPWRECK-SHORT --voice th-TH-PremwadeeNeural --rate +5%` (writes local `public/narration/SHIPWRECK-SHORT.mp3` and the committed amplitude JSON beside the timeline).

## Shot map (composition frames, half-open)

| Beat / scene | Frames | Shot (plate) | Plate frames | Transition in | Key events (shot-local s) |
| --- | --- | --- | --- | --- | --- |
| B01 / 0 | 0–189 | SH01 `SHIPWRECK-SH01` | 0–189 | open | push 1→1.05 over 6 s |
| B02 / 1 | 189–395 | SH02 `SHIPWRECK-SH02` | 189–395 | cut | pull back 1.08→1.0, tilt; divers, bubbles |
| B03 / 2 | 395–553 | SH03a `SHIPWRECK-SH03a` | 395–468 | hard cut | sail tears 0.6–1.8; label |
| | | SH03b `SHIPWRECK-SH03b` | 468–553 | cut | flash 0.35, sink 0.4–1.27, freeze 1.27 ("หรืออาจไม่ใช่เลย"), drain 1.33–2.8; label |
| B04 / 3 | 553–803 | SH04a `SHIPWRECK-SH04a` | 553–655 | in-canvas dissolve 30 f from the drained paper | sand settles over 3.4 s |
| | | SH04b `SHIPWRECK-SH04b` | 655–803 | cut | traces: base 1.43–1.9, handles 2.3–3.1, lines 3.53–4.4 |
| B05 / 4 | 803–1014 | SH05 `SHIPWRECK-SH05` | 803–1014 | cut | drift to 4.2 s, hold |
| B06 / 5 | 1014–1185 | SH06 `SHIPWRECK-SH06` | 1014–1185 | cut | match mix 0.5–1.75 (lands on "รูปทรงเดียวกัน"), push from 2.3 |
| B07 / 6 | 1185–1416 | SH07a `SHIPWRECK-SH07a` | 1185–1305 | cut | links 1.5–2.6 ("เทียบรูปทรงและลาย"); real-photo card F1245–1305 (see below) |
| | | SH07b `SHIPWRECK-SH07b` | 1305–1416 | in-canvas dissolve 15 f | shafts 0.16→0.30 at 0.6–1.3 (number at 1.13) |
| B08 / 7 | 1416–1581 | SH08 `SHIPWRECK-SH08` | 1416–1581 | cut | pull back 1.3→1.0 over 5.5 s |
| B09 / 8 | 1581–1775 | SH09a `SHIPWRECK-SH09a` | 1581–1631 | cut | push in, vignette |
| | | SH09b `SHIPWRECK-SH09b` | 1631–1775 | in-canvas dissolve 18 f | ease back 1.8 s; reaches SH01 frame-0 framing at F1685 = B_loop hold start (held to F1774) |

Label "ภาพจำลอง" on SH03a and SH03b (every B03 frame and the drained frames; the label goes with the last SH03b frame whose plate alpha is above 0).

### Real-photo card (B07, user request 29 Oct 2026)

On "…กับไหที่รู้อายุแล้ว" (F1245–1305, scene-local 60–120), a still of a dated Early Bronze Age jar sits over the known-jar half of SH07a: `public/images/oldest-shipwreck/arad-jar-card.png` (Arad, ~3000–2650 BC, Israel Museum; Gary Todd, CC0, `NOTICE` beside it). The card (x 464–888, y 291–856) stays inside the caption-safe box and above the caption band. Its dark header reads "ภาพจริง" and its credit band says it is not a Kekova jar. The card is placed with `Scene.media` and `quadTexts` in `src/videos/oldest-shipwreck/index.ts`, with a hard cut in and out. No photo of the Kekova jars has a licence that allows commercial use (Ministry/Akdeniz handouts only), so none is used. Boat has not reviewed the card wording.

## Mix cue sheet (EP08a)

Composition seconds. Gains are the timeline `volume` (0.1 = −20 dB). Duck = `duckUnderNarration`.

| Beat | Mix intent | Voice | Music (`bed_underwater-mystery-sparse_01`) | Ambience | SFX |
| --- | --- | --- | --- | --- | --- |
| B01 | `hold` → `lift` on the question | 0 dB (planned +1 dB hook: missing capability) | in at 4.7 s (on the question), 0.10, fade-in 1.5 s, duck 0.5 | seabed 0.20 from frame 0 (cold open), duck 0.7 | none |
| B02 | `hold` | 0 dB | 0.10 steady | seabed 0.20 | bubbles 0.16 at 8.4 s |
| B03 | `drop` (music out) then hard `drop` on the doubt | 0 dB | out at 13.2 s | seabed out at 13.17 (hard cut); storm wind/waves 0.30 + rain 0.15, 13.17–16.87, stop dead on "หรืออาจไม่ใช่เลย" | thunder 0.45 on the flash (15.95 s) |
| B04 | `hold` (clue) | 0 dB | low pulse 0.09 from 18.9 s, duck 0.5 | seabed 0.13 (thinner) from 18.43 s, fade-in 1 s | three ticks 0.12 on ก้นแบน / หูจับสองข้าง / มีลายขีด (23.23, 24.10, 25.33 s) |
| B05 | `drop` | 0 dB (planned −3 dB confiding: missing capability) | thins to nothing by 31.6 s (fade 1 s), silent through "ร้อยสองร้อยปี" and the 0.6 s after it | seabed 0.20 from 30.17 s | bubbles 0.16 at 27.2 s |
| B06 | `hit` (main) | 0 dB | warm entry 0.13 at 33.8 s | seabed 0.20 | riser 0.22 (trimmed 1.9 s) 33.8 → boom 0.24 at 35.6 s, in the pause after "รูปทรงเดียวกัน" |
| B07 | `lift` → minor `hit` on the number | 0 dB (planned +1 dB payoff: missing capability) | fullest 0.20, duck 0.4 | seabed 0.20 | none (optional outro stinger not used: it would sit on the stressed number) |
| B08 | `hold`, easing | 0 dB | 0.15, then 0.10 from 50.1 s ("แต่ทีมเองบอกว่า") | seabed 0.20 | bubbles 0.12 at 47.5 s |
| B09 | `release` | 0 dB | 0.10, fade-out to 0 by 55.0 s | seabed 0.20 to the end; U3 runs exactly 2 loop periods, so the last sample meets frame 0's | none |

Two distinct bed levels (0.09–0.10 and 0.20) and a `drop` → `hit` (B05 silence → B06 boom). Voice level per beat is a recorded plan only: narration has no gain field (EP08a runtime gap, Boss).

## Captions and chrome

Outline preset, `position: 'middle'` (band y 860–1248), cue text verbatim from R1.1 `ซับ` lines (digits replace spelled numbers). Chrome per channel-default: channel label and progress bar on; the bar has one segment per beat scene. At the B_loop restart the bar and caption change (last frame vs frame 0); the painted picture and the ambience are continuous.

## Open questions

- None blocking. Judgment calls are listed in `scripts/oldest-shipwreck/build-notes.md` (Editor section).
