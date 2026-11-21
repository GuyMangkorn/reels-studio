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

