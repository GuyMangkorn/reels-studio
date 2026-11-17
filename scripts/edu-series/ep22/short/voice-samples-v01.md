# EP22 V01 child "หืม?" audition

- Revision: **EDU-EP22-VOICE-SAMPLES-V01-R1**, Editor, 2026-11-17. Scope: EDU-EP22-SHORT, channel `edu`, cue V01 (B02-SH04, G 247–259, 0.4 s, not subtitled) under S7 `comedy_pluck-question-bend_01` (G 249). A pick is a voice pick only; the timeline is unchanged.
- Engine: Edge TTS via `scripts/voice-preset.py` child presets (child-girl = Premwadee, child-boy = Niwat; Praat child resynthesis; user-picked presets 2026-10-29). Gemini refuses child voice design, so **no API calls**. Text "หืม?", pitch +0 Hz. Raw takes are 0.40–0.63 s of speech, so the slot (12 f) sets the speed.
- Processing: leading silence trimmed, `atempo` as listed, 80 ms fade-out, 0.55 s file; in context the onset is at G 247 (8.233 s of narration) and S7 at G 249 at 0 dB (library file, as the cue sheet). Context clips = narration `EP22_narration_kore_x0.9025.wav` 5.0–11.5 s (G 150–345) + S7 + V01. M1 near-silent and A1/S5 steps are not in these clips (they are the bake's job), so the mix is not final. V01 sits near −15 LUFS, about narration level.

| ID | Preset / rate / atempo | Speech length | Bare | In context |
| --- | --- | ---: | --- | --- |
| A | child-girl, +5%, x1.2 | ~0.45 s | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/bare_A_girl_p5_x1.2.wav | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/context_A_girl_p5_x1.2.wav |
| B | child-girl, −10%, x1.35 | ~0.47 s | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/bare_B_girl_m10_x1.35.wav | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/context_B_girl_m10_x1.35.wav |
| C | child-boy, +5%, x1.0 | ~0.40 s | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/bare_C_boy_p5.wav | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/context_C_boy_p5.wav |
| D | child-boy, −10%, x1.0 | ~0.46 s | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/bare_D_boy_m10.wav | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/context_D_boy_m10.wav |
| ref | no V01 (S7 + narration only) | | | /Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/context_0_no-voice.wav |

Narration is silent from about G 247 to G 262 (L03 "อ้าว" starts G 263), so V01 plus S7 sit in the gap. Raw takes: `out/ep22-v01/c*.wav` (not kept). Store: `projects/edu/EDU/samples/`.

**Recommendation:** C (boy, +5%) — natural 0.40 s fit with no time-stretch, a short curious rise that matches S7's rising bend. A is the girl alternative if the cast should be a girl (stretched ×1.2, slightly less natural). Choice pending the user's ear.
