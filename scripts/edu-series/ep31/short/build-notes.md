# EDU-EP31 build notes (Editor)

## W4 voice lock, 2026-11-21 (EDU-EP31-VOICE-R1)

- Record: [voice-lock.md](voice-lock.md). Kore x1.05 one read, 15 lines, speech ends 57.77 s, short 59.82 s with the 2.0 s hold (limit 63 s, no script trim). 5 Gemini requests.
- Build chain: `voice-w4-chars.sh` (character takes) -> `voice-lock-build.py` (fixed cut points from the take's silences, no Whisper) -> `vo-anchors.py`. `voice-words.py` prints Whisper word times of a WAV (used to find the cut points).
- **Finding F1 (tooling):** EDU-EP30's `voice-lock-build.py` cut points came from a Whisper alignment that is not repeatable (two runs on the same take moved two cuts by 0.4 and 0.5 s and one run kept a 0.17 s breath in L12). EP31 uses fixed cut points instead, so a rerun gives the same files. Candidate to script once (second use): fixed-cut builder in `scripts/narration/`; proposal only, no rule change.
- **Finding F2 (tooling):** ffmpeg `silenceremove` with `stop_periods=-1` does not shorten a pause inside a line here (L08 stayed 4.50 s); the 0.93 s pause was cut with `atrim` + `concat` on the raw take instead.
- Store files are immutable: the first filing `ep31-voice-r1/` was superseded by `ep31-voice-r1-1/` after the tail/breath trims.
- Open for W4.3 (user): listen to the three new character voices (Charon, Alnilam, Algenib), the pace x1.05, the L09/L10 join and L14.

## W5.1 timed scene sheets, 2026-11-21 (Film, EDU-EP31-SCENE-R1)

- Sheets [scene-sheets/index.md](scene-sheets/index.md) + b01–b07. Word onsets inside phrases from a Whisper pass on the VOICE-R1 line files with `voice-words.py` ([voice-words-R1.txt](voice-words-R1.txt), ±3 f); envelope edges from `voice-anchors-R1.txt`.
- Projection: [projection-run.py](projection-run.py) (the EP30 runner with the caption band 1100–1344) over [projection-shots.json](projection-shots.json); output [projection-R1.txt](projection-R1.txt). Second use of the runner: a shared `scripts/` version that takes the shots file and the band as arguments would save the copy (proposal, TL rule).
- **Finding (Film):** several untimed board camera estimates did not survive the projection check: B01-SH04 (krok above the frame), B03-SH03 (yaw 0 looked away from the print), B04-SH03 (lead 275 px), B06-SH02 (print face in the caption band), B07-SH01/SH03 (lemon in the band). Board estimates written as `f × H / d` miss the pitch and the lens shift; running the tool on look-frame cameras only (W3) left the others unchecked until W5.1.
- **Finding (Film):** in Space R a 7 cm-tall camera 2.65 cm beyond the Polaroid cannot leave a low (eye 0.11–0.12 m) frame that still shows the Polaroid with room around it: the gap between the Polaroid's top edge and the camera's near edge is about 2° of view. B07-SH02 leaves the camera out of its plate (O2); fallback framing `tightC` in b07.


## W5.2s sounds and cue sheet, 2026-11-21 (Ton, EDU-EP31-SCENE-R1)

- Sheet [sound-cues.json](sound-cues.json): 76 cues, 70 generated, 6 library (whoosh_air-swish-rising_01, reveal_glass-shimmer-soft_01, ui_pop_01 x2, electric_phone-shutter-flash_01, water_ice-settle-tick_01), each with a `fit` note. Lock: `src/videos/edu-ep31/assets.lock.json` (public/audio/<category>/<id>.wav). Previews (Ton, not the mix): store `projects/edu/EDU/sound-preview/`.
- Fit decisions: whoosh_page-flip-paper_01, tension_clock-pulse_01, impact_dull-sub-thud-muffled_01 and electric_light-flicker-buzz_01 were measured and rejected (page flip too long and airy for a card flap, clock pulse too slow for the B05 ring clock, muffled thud too soft for the steel door, flicker buzz too harsh); new files generated instead. The clock is rebuilt from one generated tick.
- Levels: `gainDb` is calibrated against the VOICE-R1 preview (speech about -15.9 LUFS) with ffmpeg ebur128 momentary steps. Preview mix: bed 20.4, texture 21.9, accent 19.4, background 15.7 dV, mix minus voice +0.1 LU, true peak -0.3 dBFS. `mix-levels.py` on the sheet: no FAIL; warns B03 and B05 background (14.2, 14.9), B01 bed above 20, two accent peak rows within 3 LU.
- Row override: B04-SH01-shutter peak row max 3 -> 14. A 0.26 s click at the file peak (-1 dBFS, gain 0 dB) reads 12.7 dV on the 400 ms meter; it cannot get louder without clipping.
- Hits on a word by design (brief): B03-SH01 slam on "สอบ", B03-SH04 MUS-03 on "ผ่าน!", B05-SH04 thud on "จับ", B07 lemon on "จริง". Clustered stacked hits are checked as one row each.
- Finding (tooling): mix-levels needs dithered stems (all-zero windows give nan); dV is higher for QUIETER layers, so lifting an accent lowers both its row and `background`. A momentary meter smears a 2-frame pop across 400 ms, so rows next to a pop start 0.4 s after it.
- Finding (tooling): `sound-library.py file` needs the ID to start with the category (music beds use `bed_`); `store.py use` needs src/videos/<episode>/ to exist.
- Open for the user: listen first to END-01 (bass tag + snap at 1768), MUS-03 on "ผ่าน!", B05 rings and clock stop at 1329, B03-SH05 snaps against the groove, the brief's silences (1329-1349, 1413-1419).
