# EDU-EP19-SHORT — task

Record: this file. Series context: [concepts.md](../concepts.md) (R10, C55) · series task list: [task.md](../task.md).

**Now:** W2.1 brief and W2.2 rows done (2026-11-12, Film); review page pending **Next:** Coordinator — publish the storyboard page (W2.3); then Boss look frames LF01/LF02 (W3) and Editor voice lock W4

- Decisions (user, 2026-11-12): picked C55 "คนที่กำลังจมน้ำ ดูเหมือนกำลังเล่นน้ำ" ("ทำ c55"). User worried the word "ตาย" could be banned on YouTube: Boat checks the policy in W1.1 (title/cover wording, narration use).
- Deliverable: `EDU-EP19-SHORT`, Short only (Thai), 1080×1920, 30 fps, target 40–60 s (estimate). Profile: educational, painted 2D, edu defaults (Kore narrator, pace picked per episode). Scope assumed from EP01–EP18.
- Factual claims for Boat: see the C55 entry in concepts.md R10 (hook claim: a drowning person looks like they are playing; silent, upright, arms pressing down, under a minute; rescue picture from the edge, not diving in). Film notes: R10 Film annotation, C55 (M, high end; new assets: swimwear, condo pool, waterline cut, splash, crowd).

- [ ] W1 Script lock
  - [x] W1.1 Boat research
  - [x] W1.2 Preaw script: [script.md](script.md) EDU-EP19-SCRIPT-R1, 2026-11-12 (est. raw ≈ 46.1 s, video ≈ 52.5 s; longest answer ≈ 6.9 s; open decisions D1–D4, Boat Q1–Q4)
  - [x] W1.3 Boat fact-check: [fact-check.md](fact-check.md) EDU-EP19-SCRIPT-R1 ready-for-storyboard, 2026-11-12 (no must-fix; optional O1–O8)
  - [x] W1.4 Length check (2026-11-12, EDU-EP19-SCRIPT-R1 + R1.1 coordinator change log): **PASS**. One Gemini Kore read of the 14 NAR rows (L01-L14; 1 request, no retry by Editor; the primary key answered 429 and the script's single switch to GEMINI_API_KEY_REEL_EXTRA served it; no atempo; style = channel default "warm, friendly, smiling storyteller, speaking rapidly", one style for the whole read so the N3 no-smile proposal is not applied; "…" sent as ","). Store `projects/edu/EDU/audio/2026-11-12_ep19-nar-kore-fullread.wav` (+ `.json`, `2026-11-12_ep19-nar-lines.txt`). Raw **43.24 s** (N1 estimate 46.1 s, 6 % over-estimate), integrated -16.0 LUFS, true peak -1.5 dBFS, LRA 2.1 LU (ffmpeg ebur128). Video by the N1 non-narration add-on (+6.4 s, kept fixed under atempo): x1.00 **49.6 s**, x1.08 **46.4 s** (raw 40.0 s), x1.15 **44.0 s** (raw 37.6 s); target 40-60 s, limit 63 s, all inside. Not listened (length check, not the voice lock); V01-V05 and W-THROW not generated. Pace pick stays with the user at the W4 sample.
  - [x] W1.5 User approves the script (2026-11-12, structured question, EDU-EP19-SCRIPT-R1 + R1.1; title T1, L01 keeps ตาย)
- [ ] W2 Film brief and rows (W2.1 Film brief [EDU-EP19-BRIEF-R1](film-brief.md) [x] 2026-11-12; W2.2 rows [EDU-EP19-ROWS-R1.0](storyboard.md) + [review-rows.json](review-rows.json), 18 shots, est ≈ 49 s at x1.08, untimed, Q-F1–Q-F2 open (recommendations apply if unanswered), new assets N1–N12 for Boss, sound cues A1–E1 for Ton [x] 2026-11-12; W2.3 review page: pending (coordinator))
- [ ] W3–W8 per pipeline (see [EP18 task](../ep18/task.md) for the shape)
