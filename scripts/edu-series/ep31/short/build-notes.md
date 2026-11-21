# EDU-EP31 build notes (Editor)

## W4 voice lock, 2026-11-21 (EDU-EP31-VOICE-R1)

- Record: [voice-lock.md](voice-lock.md). Kore x1.05 one read, 15 lines, speech ends 57.77 s, short 59.82 s with the 2.0 s hold (limit 63 s, no script trim). 5 Gemini requests.
- Build chain: `voice-w4-chars.sh` (character takes) -> `voice-lock-build.py` (fixed cut points from the take's silences, no Whisper) -> `vo-anchors.py`. `voice-words.py` prints Whisper word times of a WAV (used to find the cut points).
- **Finding F1 (tooling):** EDU-EP30's `voice-lock-build.py` cut points came from a Whisper alignment that is not repeatable (two runs on the same take moved two cuts by 0.4 and 0.5 s and one run kept a 0.17 s breath in L12). EP31 uses fixed cut points instead, so a rerun gives the same files. Candidate to script once (second use): fixed-cut builder in `scripts/narration/`; proposal only, no rule change.
- **Finding F2 (tooling):** ffmpeg `silenceremove` with `stop_periods=-1` does not shorten a pause inside a line here (L08 stayed 4.50 s); the 0.93 s pause was cut with `atrim` + `concat` on the raw take instead.
- Store files are immutable: the first filing `ep31-voice-r1/` was superseded by `ep31-voice-r1-1/` after the tail/breath trims.
- Open for W4.3 (user): listen to the three new character voices (Charon, Alnilam, Algenib), the pace x1.05, the L09/L10 join and L14.
