# BLOOP-EP01-SHORT — edit plan (Editor, integration pass 1)

Deliverable `BLOOP-EP01-SHORT` (Short, 1080×1920, 30 fps, Full tier). Composition `BLOOP-EP01-SHORT` (registered in `src/videos/the-bloop/index.ts`). Ending `A_fade` with `endHoldSec: 0`, `endFadeSec: 0` (DEP04; the plate's own black owns the fade).

Inputs (matching revisions): script `BLOOP-SCRIPT-R5` / fact-check `BLOOP-FACTCHECK-R6`; brief `BLOOP-BRIEF-R4`; scene sheets `BLOOP-SHEETS-R4` (index + four sheets); Boss plates `bloop-sh01…sh13` (blockout pass 3, accepted 2026-10-30); narration Edge TTS `th-TH-NiwatNeural` at +5% (`scripts/narration.py`, log `out/logs/bloop-narration-r5.log`).

Status: integration pass 1. Runtime assembled; **timing is measured, not estimated**, and differs from Mark's estimate (see T-table and "Flags for Mark"). Not user-approved. Not a visual or audio sign-off.

## 1. Timing: est G → composition frames

Mark's G values (BLOOP-SHEETS-R4) are mapped through the Niwat phrase knots (`scripts/the-bloop/short/timing.json`, from `tts-measure.py` and `plan-timing.py`). Between knots the map is linear (offsets inside a phrase scale with the phrase length). After the last phrase (`B10-a1` end, est G1678) the est silence, rise, rush, fade and black keep their durations (shift +213 f).

| Beat | Scene start est → comp | Cumulative shift | VO span est (f) | VO span comp (f) | Flag |
| --- | --- | --- | --- | --- | --- |
| B01 | 0 → 0 | 0 (lead 0.27 s before VO) | 181 | 179 | no |
| B02 | 198 → 196 | −2 | 172 | 192 | step −2 |
| B03 | 374 → 397 | +23 | 198 | 229 | step +25 (>10) |
| B04 | 575 → 635 | +60 | 225 | 279 | step +37 (>10) |
| B05 | 801 → 923 | +122 | 97 | 84 | step +62 (>10) |
| B06 | 905 → 1016 | +111 | 143 | 156 | step −11 (>10) |
| B07 | 1055 → 1180 | +125 | 178 | 189 | step +14 (>10) |
| B08 | 1238 → 1378 | +140 | 229 | 262 | step +15 (>10) |
| B09 | 1469 → 1649 | +180 | 140 | 172 | step +40 (>10) |
| B10 | 1629 → 1844 | +215 | 49 | 47 | step +35 (>10) |
| tail | 1678 → 1891; black to 1995 | +213 | 14 f silence, rise 24, rush 42, fade 21, black 3 | same | no |

Total: **1,995 frames (66.5 s)** against est 1,782 and the 1,740–1,800 window. **Out of window by +195 frames.** Cause: the Niwat read at +5% is longer than the syllable estimate (speech +6 %, plus beat tails). No VO was cut and nothing was sped up (production requirements forbid speed-up to reach a range). Flagged to the coordinator and Mark (see open items).

Narration slot plan (`narration-timeline.json`): B01 lead 0.27 s; each beat keeps 0.12 s of head room; tail 0.20 s after each beat; B09 tail 0.67 s (script pause `[1609,1629)`). Verified: each slot's first audible sample lands at slot start + lead + 0.12 s (±1 ms).

## 2. Painted plates and label slots

Cues follow `index.md` "Planned runtime mapping", split at every phrase knot (except inside a dissolve window) and at label-window edges. SH01 runs on the composition clock (its rings follow the real clip, which starts at frame 0); all other plates re-sync to their est plate time at each knot.

| Shot | Est start | Comp start (composition frame) | Dissolve | Notes |
| --- | --- | --- | --- | --- |
| SH01 | 0 | 0 | — | real B01 clip at 0; composition clock |
| SH02 | 216 | 213 | 0.6 s | quake at est 278 (comp 279); pulses at est 345/356/367 (comp 359/…) |
| SH03 | 372 (clip cue 404) | 393 (clip at 435) | — | ring train keyed to clip start |
| SH04 | 468 | 514 | — | "ภาพประกอบ" |
| SH05 | 573 | 629 | — | |
| SH06 | 738 | 827 | 0.6 s | |
| SH07 | 801 | 923 | — | |
| SH08 | 903 | 1013 | — | hum at est 963 (comp 1091) |
| SH09 | 1053 | 1178 | — | |
| SH10 | 1127 | 1245 | — | "ภาพประกอบ" |
| SH11 | 1173 | 1304 | — | crack at est 1222 (comp 1354) |
| SH12 | 1271 | 1413 | — | |
| SH13 | 1467 | 1640 | — | rise at est 1690 (comp 1903); black est 1779 (comp 1992) |

**Label tracks** (two slots, DEP03; texts are verbatim from the sheets):

| Track | Text | Window | Basis |
| --- | --- | --- | --- |
| A (slot 1, y 300) | เสียงจริง เร่ง 16 เท่า | comp [0, 178) | B01 clip audible to 5.93 s (−30 dB); sheet had 186 |
| A | เสียงจริง เร่ง 16 เท่า | comp [435, 487) | B03 clip audible to 1.74 s; sheet had 56 f |
| A | ภาพประกอบ | est [468,573), [1127,1173) | sheet |
| A | จินตนาการ | est [764,903), [1173,1240), [1690,1779) | sheet |
| B (slot 2, y 360) | เสียงจำลอง | comp [crack, crack+62) from est 1222 | crack audible to 2.07 s (−30 dB); sheet estimated to G1300 |
| B | เสียงจำลอง | est [1450,1467) | ice-tick phrase window (tick itself is 0.08 s; see deviations) |

Label slots and dissolves never overlap in the mapping.

## 3. Captions

- Outlined Thai captions (`captionStyle: outline`), position **`middle`** (centred at y 960). Resolves the open item: the sheets reserve CAP-ZONE y 840–1260; the production caption rule allows `middle` for new portrait deliverables; `bottom` (134 px) violates the caption-safe box; `top` (20 %) collides with the label slots.
- Caption text is Mark's subtitle pages verbatim, with four authored line breaks at word boundaries (`มันดังมาก\nจนนัก…`, `ตลอดราวหนึ่งนาที\nฟัง…`, `นักวิทยาศาสตร์บางคน\nก็สงสัย…`, `บลูปสอดคล้องกับเสียง\n"แผ่นดิน…"`). Result: `caption-breaks.mjs` 0 bad, 0 MAY-WRAP.
- The first page starts at frame 0 (production requirement; Mark's window started at G9).
- The caption is cleared at the first black frame (blank cue at est 1779).
- Runtime limit: `Subtitles` centres text in a 6 %–94 % width (950 px), wider than the caption-safe x 120–888. Frame check required (see build notes). Boss item if lines exceed 768 px.

## 4. Sound

Library-first: all six NEEDS-GEN gaps were searched (no match), generated with audio-studio (3 candidates each), measured, processed, and filed to the shared library (IDs unchanged from the brief). Full list with licences in `public/audio/bloop/NOTICE`.

| Cue | Source | Est time (comp) | Level | Notes |
| --- | --- | --- | --- | --- |
| Real clip B01 | NOAA excerpt 0–6.2 s | 0 | 0.90 | AUD-1, "เสียงจริง เร่ง 16 เท่า" |
| Quake rumble | `quake_seafloor-rumble-muffled_01` | 278 (comp 279) | 0.45 | illustrative, generic |
| Pulses ×3 | `pulse_underwater-soft-thump_01` | 345, 356, 367 | 0.35 | no sweep |
| Real clip B03 | NOAA excerpt 2.20–4.07 s | 404 (comp 435) | 0.90 | label 52 f |
| Hum | `hum_low-travelling-flat_01` | 963 | 0.30 | pan not implemented |
| Shimmer | `reveal_glass-shimmer-soft_01` | 876 | 0.25 | under "ทางขั้วโลกใต้" |
| Riser | `reveal_riser-tension_01` | 738, cut at 801 | 0.30 | stops dead on "แต่" |
| Crack (required) | `ice_iceberg-crack-groan-underwater_01` | 1222 | 0.80 | "เสียงจำลอง" |
| Click | `ui_click-tick_01` | 1356 (comp 1528) | 0.50 | callback accent |
| Ice tick | `ui_click-tick_01` | 1452 (comp 1619) | 0.30 | see deviations |
| Whoosh | `whoosh_heavy-cinematic_01` | 1712, cut at 1758 | 0.60 | no fade (SFX has none; hard cut) |
| Swallow | `creature_deep-swallow-gulp_01` | 1756 | 0.80 | fiction, "จินตนาการ" window |

Beds (composition seconds, all ducked under narration unless noted):

| Bed | Sections (est G) | Level | Ducking |
| --- | --- | --- | --- |
| `bed_underwater-mystery-sparse_01` | 60–108 | 0.10 | 0.35 |
| | 108–404 | 0.12 | 0.35 |
| | 404–468 (under clip) | 0.03 | 0.35 |
| | 468–575 | 0.10 | 0.35 |
| | 575–690 | 0.14 | 0.35 |
| | 690–801 (build) | 0.20 | 0.35 |
| | 801–905 (drop after "แต่") | 0.03 | 0.35 |
| | 905–1055 | 0.10 | 0.35 |
| | 1055–1222 | 0.08 | 0.35 |
| | 1222–1238 (lift after crack) | 0.18 | 0.35 |
| | 1238–1469 | 0.12 | 0.35 |
| | 1469–1629 | 0.06 | 0.35 |
| `water_deep-ocean-roomtone_01` (loop) | 0 → swallow (1756) | 0.10 | 0.50 |
| `bed_dark-drone-sub_01` (loop) | 1692 → 1756, swell 0.8 s | 0.22 | none |

Hard silence from the swallow through black (SD05). Mix cue sheet, per beat:

| Beat | Mix intent | Voice | Bed | SFX | Note |
| --- | --- | --- | --- | --- | --- |
| B01 | hold, then hit (clip) | 0 dB (planned; no runtime gain) | 0.10 from 2 s | clip 0.90 | sound before voice |
| B02 | hold | 0 dB | 0.12 | quake 0.45, pulses 0.35 | |
| B03 | drop (under clip), then lift | 0 dB | 0.03 → 0.10 | clip 0.90 | `drop` before the rise line |
| B04 | lift (build) | +0 dB | 0.14 → 0.20 | riser 0.30 (cut on "แต่") | `drop` → "แต่" |
| B05 | drop | 0 dB | 0.03 | shimmer 0.25 | the silence after "แต่" |
| B06 | hold | 0 dB | 0.10 | hum 0.30 | |
| B07 | drop, then hit | 0 dB | 0.08 → 0.18 | crack 0.80 | **main hit** |
| B08 | hold, accent | 0 dB | 0.12 | click 0.50, tick 0.30 | |
| B09 | release/drop | 0 dB | 0.06 | none | 0.67 s pause |
| B10 | drop, hit (creature) | 0 dB | drone 0.22 | whoosh 0.60, swallow 0.80 | hard silence from swallow |

Planned voice level changes (`0.7`/`1.25`) are recorded here but **not applied**: `narration` has no gain field (runtime gap, EP08a). Bed/SFX carry the moves.

Accent count: one main `hit` (crack, B07), minor accents at B02, B06, B08 and B10. At least one `drop → hit` and three bed levels (0.03, 0.10, 0.20). A flat mix is not in the plan.

## 5. Deviations from the sheets (for Mark, Film, Boss)

1. **Clip labels follow the measured audible window**, not the sheet: B01 178 f (sheet 186), B03 52 f (sheet 56).
2. **Crack label** ends at onset + 62 f (measured −30 dB), not the sheet's estimated G1300 (≈ +78 f). −40 dB gives +76 f (the user can choose).
3. **Ice tick** uses `ui_click-tick_01`. SD04 asked for a tick from the crack's tail, but the tail is −45 dB with no transient, so it would not read as a tick. The label keeps the phrase window (17 f), not the 0.08 s tick.
4. **First caption at frame 0** (production rule), Mark's page started at G9.
5. **Hum panning** (SD04, "slow left → right") is not implemented: the runtime has static volume per cue (no pan). Film/Boss: pan or accept.
6. **Whoosh fade**: SFX has no fade; the sheet asks a 2 f fade at its cut. Hard cut at G1758.
7. **Room tone** is one file for the whole picture (no separate colder EQ for B07–B08).

## 6. Flags for Mark (BLOOP-SHEETS-R4 timing does not match the Niwat read)

- Every beat after B01 moves by more than ±10 frames (table §1). Mark to re-time the sheets to the measured knots in `scripts/the-bloop/short/timing.json`. Editor did not edit the sheets.
- Total 1,995 frames vs window 1,740–1,800. Mark and the coordinator need a decision on the script length (see open items).
- SH03 ring-train spacing: the G390 pair finding (Boss) still applies after the shift.

## 7. Open items

- Script length: the user decides between accepting ≈66 s, asking Preaw to trim VO (≈4–6 s needed to reach 60 s), or a recorded per-deliverable rate change (production requirements allow it with a reason). No change applied.
- User listening: crack, tick, quake, real clips and the full mix (Studio check not run).
- Commercial-use eligibility of Stability AI outputs (`NOTICE`).
