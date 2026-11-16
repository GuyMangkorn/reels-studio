# Voice measure — EDU-EP19-SHORT (EDU-EP19-VOICE-R2)

- **Revision:** EDU-EP19-VOICE-R2 (Editor W4 girl-voice redo, 2026-11-15; R1 = Edge girl, superseded; NAR table unchanged from R1) on script **EDU-EP19-SCRIPT-R4**; machine file [voice-measure.json](voice-measure.json). Timing status **audio-measured** (not listened by Editor; the user picked the take by ear at W1.4b).
- **Narration:** Gemini TTS Kore, user-picked take `t1`, atempo 0.9491, 36.48 s, -16.0 LUFS: `out/ep19-narr/r4_t1_slow8.wav` (raw `r4_raw_t1.wav`, text `full_r4.txt`). **No new Gemini calls.** Times are seconds on that file (take clock); Film places each line with the SHEETS-R2 offsets.
- **Method:** Whisper large-v3-turbo char times aligned to the script text to identify lines; edges = first/last 10 ms peak block >= -32 dBFS around the lowest-energy gap nearest each boundary (about +-0.05 s). Lines cut with 30 ms pad and 20 ms fades, matched to -16 LUFS (EBU R128 per file; alimiter ceiling 0.89).

## NAR lines (L01-L10, text lines in play order; L06/L09 retired)

| Line | Start s | End s | Dur s | LUFS raw | Gain dB | LUFS out | Peak dBFS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | 0.24 | 5.02 | 4.78 | -15.4 | -0.6 | -16.0 | -2.1 |
| L02 | 5.66 | 8.05 | 2.39 | -16.2 | +0.2 | -16.0 | -1.3 |
| L03 | 8.77 | 10.77 | 2.00 | -15.2 | -0.8 | -16.0 | -2.3 |
| L03b | 11.00 | 14.79 | 3.79 | -16.4 | +0.4 | -16.0 | -1.1 |
| L04 | 14.97 | 17.49 | 2.52 | -15.5 | -0.5 | -16.0 | -2.0 |
| L05 | 18.24 | 22.19 | 3.95 | -15.3 | -0.7 | -16.0 | -2.2 |
| L07 | 22.47 | 25.80 | 3.33 | -15.2 | -0.8 | -16.0 | -2.3 |
| L08 | 26.32 | 31.14 | 4.82 | -15.7 | -0.3 | -16.0 | -1.8 |
| L10 | 31.30 | 36.19 | 4.89 | -17.4 | +1.4 | -16.3 | -1.0 |

Spread before 2.2 dB (L03/L07 -15.2 to L10 -17.4), after **0.3 dB** (L10 stops at -16.3: its true peak limits further gain). Whisper puts L03b at 11.12 s; the 11.00 s energy edge is its consonant onset. Gap L03/L03b and L08/L10 are only 0.1-0.2 s, so cut points there are +-0.05 s.

## GIRL lines (V01-V06, Gemini Leda, user-picked 2026-11-15; replaces the R1 Edge `child-girl` lines)

Voice `Leda`, `gemini-3.8-flash-tts`, style `a cheerful playful ten-year-old girl, bright and quick, a little cheeky` (V06: `tense secretive whisper, a cheerful ten-year-old girl whispering a silent cheer`). One take per line, 5 new API calls (V02 reused the cached sample take, 0 calls). Raw take -> silence trim -> atempo -> 20 ms fades, 30 ms pad -> two-pass loudnorm -16 LUFS (TP -1.5). Not listened by Editor.

| Line | TTS text (tags) | Raw s (trimmed) | atempo | File s | Window (SHEETS-R2) | Over window | LUFS | Peak dBFS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V01 | โธ่, เจอจนได้! | 3.00 (2.51) | 1.35 | 1.93 | 36 f = 1.20 s | **+22 f** | -16.0 | -4.9 |
| V02 | แม่ รอยี่สิบนาทีนะ, กลิ่นหายหมดแน่ | 4.16 (3.61) | 1.35 | 2.74 | 66 f = 2.20 s | **+16 f** | -16.0 | -3.2 |
| V03 | ฟุดฟิด, หายเกลี้ยงแล้ว! | 3.76 (3.32) | 1.35 | 2.52 | 45 f = 1.50 s | **+31 f** | -16.0 | -1.6 |
| V04 | ห๊ะ!? ยังได้อีก | 2.28 (1.55) | 1.20 | 1.36 | 39 f = 1.30 s | +2 f | -16.0 | -3.5 |
| V05 | `<giggle>` ฮิ ฮิ | 1.12 (0.77) | 1.30 | 0.65 | 18 f = 0.60 s | +2 f | -16.0 | -4.9 |
| V06 | `<whispering>` เย้! | 1.76 (1.17) | 1.35 | 0.92 | 18 f = 0.60 s | **+10 f** | -16.1 | -1.5 |

Files: `out/ep19-narr/girl_norm_leda/V0n.wav` (final, 48 kHz mono); raw takes and sidecars `out/ep19-narr/girl_leda/`; store `projects/edu/EDU/audio/2026-11-15_ep19-girl-leda-v0n-{norm,raw}.wav` (+ raw `.json`). Atempo capped at 1.35 for naturalness (V04 1.20, V05 1.30 chosen for fit and sound); Leda reads slower than the R1 Edge lines, so **V01, V02, V03 and V06 overshoot their windows** (+22, +16, +31, +10 f, file length incl. 3 f pads). **Film: widen these windows** (or accept the overshoot into the gap after each line; V02 is followed by W-WAIT, V03 by the subtitle ending at G ~717+6) - Editor does not stretch further. V04 +2 f and V05 +2 f are absorbable.
V06 is a whisper in the source take; at -16 LUFS it is as loud as the others, so the mix lowers it (silent cheer in picture). V05 `<giggle>` tag: whether a real giggle came out is a listening judgement (user).

## Totals and video estimate

- NAR speech 32.47 s (first onset 0.24 s, last end 36.19 s); girl speech 9.88 s (R1 6.69 s; files 10.12 s); **total speech 42.35 s**.
- Video estimate: SHEETS-R2 offsets (+0 / +1.03 / +8.05 / +9.20 / +14.28 / +14.79 s) are on the NAR clock and unchanged; the girl lines add up to 83 f (2.77 s) of overshoot, so if every window is widened by its full overshoot the video is **1593 + 83 = 1676 f = 55.9 s** (R1: 1593 f = 53.1 s), inside the 40-60 s target (4.1 s margin to 60 s). If the overshoots partly sit in existing gaps it is shorter; Film sets the final windows.
