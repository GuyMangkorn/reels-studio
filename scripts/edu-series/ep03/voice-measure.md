# EDU-EP03-SHORT voice measure (W4.2, revision kore-v1)

- Script EDU-SCRIPT-R1.1; voice Gemini TTS **Kore**, one continuous read of the eleven VO lines L01-L11 (owner lines O1/O2, dog sounds and optional ALT-A not included), ellipses turned into commas in the TTS text only, style identical to EP02: "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging". No atempo.
- Status: `audio-measured`, pending user listen and approval (W4.3).
- File `out/ep03-voice/narration-ep03-kore.wav` (store `projects/EDU/narration/narration-ep03-kore.wav`), 48 kHz mono, **40.76 s** (speech about 0.26-40.56 s), integrated -16.4 LUFS, true peak -1.5 dBTP. Not split or per-line levelled yet (that is the W5 placement pass).
- Length: the script's 46-53 s estimate includes about 6-8 s of non-verbal action, owner lines and the end hold. The VO lines alone were estimated about 37.6 s, so the read is about 3 s longer than estimated; full video is still expected in the 46-53 s range or slightly above (about 50-55 s). Film's timing pass confirms.
- Per-line timing: not Whisper-aligned yet (venv/anchors not set up for EP03). Silence gaps of 0.38 s or more (line breaks likely) at 1.80, 4.72, 7.97, 13.23, 16.55, 21.46, 23.66, 25.10, 27.38, 31.99, 33.71, 34.87, 36.82, 39.46 s; to be mapped to L01-L11 at placement.
- Requests: 2 Gemini requests (the first used a text file that wrongly included table rows after L11 and was discarded; this take is the second).
- Concern: the EP02 style is deadpan and brisk; EP03's mood is affectionate and curious. Judge by ear whether the read is too dry for it.

## Owner lines O1 / O2 (W4.2, revision owner-v1)

- Voice Gemini TTS prebuilt **Algenib** (the project's male voice), one call per line, no atempo, levelled by the script to -16 LUFS. Text verbatim from the script beat table.
- O1 "ไปเลย! เอามา!": style "cheerful, encouraging shout to a running dog, outdoors in a park, energetic". File `out/ep03-voice/owner-o1.wav` (store `projects/EDU/narration/owner-o1.wav`), 48 kHz mono, file 2.08 s (speech about 0.16-0.99 s), -16.0 LUFS, peak -2.2 dBFS. Slot in the script is 1.0 s: fits.
- O2 "ตรงนั้นไง! ข้างหน้าเลย!": style "cheerful, a little coaxing, calling and pointing, outdoors in a park, slightly louder". File `out/ep03-voice/owner-o2.wav` (store `projects/EDU/narration/owner-o2.wav`), file 2.32 s (speech about 0.31-1.05 s), -16.0 LUFS, peak -3.5 dBFS. Slot is 1.2 s: fits.
- Requests: 2 Gemini requests (no retries). Status: `audio-measured`, pending user listen and approval. Not judged by ear by the agent: check that the shout is cheerful rather than angry, and that Algenib is distinct enough from Kore.
