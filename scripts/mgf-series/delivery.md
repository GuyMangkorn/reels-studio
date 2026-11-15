# MGF-SERIES delivery

- Channel: `fiction` ([channel.md](../../channels/fiction/channel.md)), mark `@mg.fiction`.
- Request (user's words, 2026-11-11): "เราทำ fiction กันดีกว่า แพรวหาเรื่องให้หน่อยเป็นเรื่องยาวได้โดย ความยาว short ยาวได้ถึง 60-90 วิเลย หรือหยิบ world fog มา remake ทีโดย ใช้ flow แบบ hook => question + delay #1 => rehook => question +delay#2 => answer ให้หน่อย remake wordfog ได้เริ่มใหม่หมดเลย"
- Ideation: W0 done. [concepts.md](concepts.md) R1 (Preaw pitch + Film annotation W0.2). User picked **C1 ข้อความจากแม่ (Mom's Texts), remake: WORLD FOG** (structured question, 2026-11-11). C2–C6 stay in concepts.md as the series bank.
- Deliverable: **`MGF-EP01-LONG`** (user, 2026-11-11: "เปลี่ยนเป็น full long video size แทนละกัน"; structured question: **3–5 min, expand the story**). Format: Long, 16:9, 1920×1080, 30 fps per [production requirements](../../docs/production-requirements.md). Replaces `MGF-EP01-LONG` (migration map: SHORT script R1.1, voice picks, samples and the 124 s measured read carry over as inputs; no SHORT is produced). Earlier selection Short 60–90 s is superseded.
- Required structure (user, 2026-11-11): HOOK → QUESTION + DELAY #1 → REHOOK → QUESTION + DELAY #2 → ANSWER.
- Profile from C1: fog thriller, painted 3D camera with SVG phone inserts (Film W0.2, size M); other fields = [project defaults](../../docs/delivery-workflow.md#project-defaults). WORLD FOG remake: only the fog world and the voice-copying threat carry over; plot, characters and twist are new (old record [scripts/world-fog](../world-fog/delivery.md) is reference only).
- Voices (user pick from ≤10 s samples, structured question, 2026-11-11): FON = Gemini TTS **Leda** (pace 1.0, character, not narrator +5 %); MOM = **Sulafat**; RADIO = **Charon** + radio filter (hp 400 / lp 3400 / acrusher 0.25). Samples: `~/ReelsStore/projects/fiction/MGF/samples/`.
- Note (superseded by LONG scope): W1.5 approval (2026-11-11) came before the W1.4 measured read; a measured read > 94.5 s (90 s + 5 %) reopens W1.5 with Preaw trims (cuts listed in script.md Length estimate).
- Pipeline: `Full`.
- Factual claims: none (invented story); Boat research and fact-check `N/A` unless the script borrows a real place, person or event.

| Deliverable | Stage / Next owner | Evidence / open items |
| --- | --- | --- |
| MGF-EP01-LONG | W2.1–W2.2 done (Film, 2026-11-12); next coordinator — publish storyboard page (W2.3); Boss DEP01 16:9 spike before look frames | [ep01/script.md](ep01/script.md) MGF-EP01-SCRIPT-R1, est. ≈84 s (estimated); W1.3 expected N/A; voice audition samples (7 takes + 2 radio-filtered copies, ≤10 s, 2026-11-11): ~/ReelsStore/projects/fiction/MGF/samples/; Film brief [ep01/film-brief.md](ep01/film-brief.md) MGF-EP01-BRIEF-R1 (16:9 rules, pink-glow rule PG01–PG07, VD01–VD14, DEP01–DEP04; size L) and rows [ep01/review-rows.json](ep01/review-rows.json) MGF-EP01-ROWS-R1 (71 shots, untimed, est 281 s from voice-measure R2), 2026-11-12; review page: pending |

- Voice acting (user, 2026-11-11: Fon sounded flat, no shock or suspicion): Fon is a character, not a neutral narrator. Generate Fon line by line with per-line style and tags (gemini-tts, acted dialogue path), Leda stays; sample ≤10 s of the acted style before any full read.
- 2026-11-11 user decisions on script R2 (structured question): R2 approved; keep the old "ลุก" typo text (L07e / P9) as a rewatch clue; ending = **A_fade** (not B_loop), so L47 closes with a fade-out and no loop seam is required (the L47→L01 echo may stay as a story echo). Fon acting samples: `~/ReelsStore/projects/fiction/MGF/samples/` (acting set), pick pending.
- 2026-11-11 user pick "A" from the acting samples = file A `a-opening-acted.wav` (moderate intensity, R2 Acting column styles as written; not the "strong" variant). Full acted read authorized.
- 2026-11-12 storyboard review page published (W2.3): https://claude.ai/artifact/J8pzU8RSTYAoeLBaYPYyMf , slug 8ac32395-d86c-4e6e-8a6c-ae89af650966, version 1794417228-60e7, rows MGF-EP01-ROWS-R1 (71 shots), brief MGF-EP01-BRIEF-R1. Verdicts live in the artifact `db` under `reviews/<shot ID>@board` (fields incl. `rev`). Republish with `python3 -I scripts/storyboard-page/build.py scripts/mgf-series/ep01/review-rows.json` then publish_files to the same slug; local build `out/review-pages/MGF-EP01-LONG/`.

## MGF-EP02 — อย่ายิ้มตอบ (demon, Long + 5 Shorts)

- Request (user's words, 2026-11-15): "ขอเกี่ยวกับ ปีศาจหน่อยได้มะ เป็นปีศาจคล้าย ๆ หนังเรื่อง smile ยิ้มฉีกดำ ๆ ตาโบ๋ดำ ๆ เป็นคลิป long and short เลยนาที / long กี่นาทีก็ได้ ตัดเป็น short 60 วินาที"
- Ideation: W0.1 done, [concepts-demon-2026-11-15.md](concepts-demon-2026-11-15.md) R1 (Preaw). User picked **C1 อย่ายิ้มตอบ** ("ลอง C1 เลย", 2026-11-15). Film annotation W0.2 not run before the pick; Film's visual brief covers it after the script. C2–C6 stay in the file as the bank.
- Deliverables: `MGF-EP02-LONG` (16:9, ~5:00, any length allowed) and `MGF-EP02-SHORT01`–`SHORT05` (9:16, ~60 s each, cut from the Long per the concept's cut plan; each stands alone with HOOK → Q1 + delay → REHOOK → Q2 + delay → ANSWER, series answer only in the last Short and the Long's end).
- Profile from C1: slow-dread horror, painted 3D camera + SVG face inserts (proposed, Film to confirm); other fields = [project defaults](../../docs/delivery-workflow.md#project-defaults). Entity "แขกยิ้ม" is original (wide torn black grin, hollow black eye sockets).
- Factual claims: none (invented); Boat research and fact-check `N/A`.

| Deliverable | Stage / Next owner | Evidence / open items |
| --- | --- | --- |
| MGF-EP02-LONG | W1.2 script done (Preaw, 2026-11-15); W1.1/W1.3 Boat N/A; next coordinator — user review of R1 and voice samples (≤10 s) | [ep02/script.md](ep02/script.md) MGF-EP02-SCRIPT-R1; est. ≈427 s (7:07) at an assumed 2.5 syll/s (≈369 s at 3.0), timing `estimated`, not read aloud; optional trims to ≈6:00 listed in the script; no user approval yet |
| MGF-EP02-SHORT01–05 | W1.2 script done in the same pack (Preaw, 2026-11-15); next coordinator — user review with the Long | [ep02/script.md](ep02/script.md) MGF-EP02-SCRIPT-R1, Shorts section; projected at 2.5 syll/s: SHORT01 58.6 s, SHORT02 55.1 s, SHORT03 57.8 s, SHORT04 55.5 s, SHORT05 58.4 s (`estimated`, no voice sampled) |

- 2026-11-15 user decisions on MGF-EP02 script R1 (structured question): keep the Long at ~7:00 (no trims); ending = **fade** (no loop seam). Voices (เตย, พี่ต้น, แม่, ฝ้าย): pick pending from ≤10 s samples.

## MGF-EP03 — วันทองไม่ได้สองใจ (novel / เสภา, Long + 4 Shorts)

- Request (user's words, 2026-11-15): "fiction เอาใหม่ ... ผมอยากเปลี่ยนเป็นเล่าเรื่องยาว > 9 นาทีแทน + อาจจะมี short ร่วมด้วย เช่น เล่าเรื่องประวัติศาสตร์บุคคลน่าสนใจ เหตุการณ์ประวัติศาสตร์ ... ประวัติศาสตร์ หรือ ประวัติบุคคล จากนิยายก็ได้หรือเรื่องจริงก็ได้ ... 6 หัวข้อ"
- Ideation: W0.1 done, [concepts.md](concepts.md) R1 (Preaw). User picked **C4 วันทองไม่ได้สองใจ** ("อยากทำ C4 ก่อนแฮะ", 2026-11-15). Film annotation W0.2 not run before the pick; Film's brief covers it. The other five stay in concepts.md as the bank.
- Deliverables: `MGF-EP03-LONG` (16:9, ~12 min, >9 min required) and `MGF-EP03-SHORT01`–`SHORT04` (9:16, ~60 s, cut plan in C4: ข่าวตายปลอม / คืนที่ถูกพาหนี / คำถามในท้องพระโรง / นับดูว่าใครเลือก).
- Factual claims: yes (text versions, verses, any historical kernel): Boat researches before Preaw writes and fact-checks the script.

| Deliverable | Stage / Next owner | Evidence / open items |
| --- | --- | --- |
| MGF-EP03-LONG | W1.2 script **approved by user 2026-11-15 (R2 with these fixes)**; fixes applied as R2.1 (Preaw, 2026-11-15: Boat's optional O7–O11, wording only); next coordinator — narrator voice samples (≤10 s), then Film storyboard | [ep03/script.md](ep03/script.md) **MGF-EP03-SCRIPT-R2.1** (change log: O7 `OT11` called a สารบาญ entry in notes/credit, O8 spelling note dropped, O9 "ในวันประหาร", O10 recap lists all seven marks, O11 "แทบไม่มีครั้งไหน"); projected **768.8 s (12:49) at 3.0 syll/s** (898.8 s / 14:59 at 2.5), timing `estimated` (heuristic syllable count, rate from MGF-EP01 measured reads, no EP03 voice sampled); factual status: **ready-for-storyboard** (Boat R2 recheck 2026-11-15, [ep03/fact-check.md](ep03/fact-check.md) section R2); R2.1 Boat recheck: wording-only, no new claim; user decisions applied: title "ใครว่าวันทองสองใจ", narrator reads all verse (one voice), length kept (no trims), "อีแพศยา" spoken; open: narrator sample (≤10 s), subtitle spelling "ละโมภ" vs dictionary "ละโมบ" (editorial) |
| MGF-EP03-SHORT01–04 | W1.2 script **approved by user 2026-11-15 (R2 with these fixes)**; R2.1 changes no Short line (O10 is Long-only; O7 touches only SHORT02's `OT11` style note); next coordinator — with the Long | [ep03/script.md](ep03/script.md) MGF-EP03-SCRIPT-R2.1, Shorts section; projected at 3.0 syll/s, unchanged: SHORT01 ใครทิ้งใครก่อน 56.7 s, SHORT02 ยอมไป จริงหรือ 56.3 s, SHORT03 คำถามต่อหน้าพระที่นั่ง 59.1 s, SHORT04 คำว่าสองใจ อยู่ตรงไหน 57.9 s (`estimated`; 65.4–68.3 s at 2.5, cut-first lines listed); factual status: **ready-for-storyboard** (Boat R2 recheck 2026-11-15, no must-fix) |

- 2026-11-15 Boat research MGF-EP03 R1 done ([ep03/research.md](ep03/research.md), F001–F043, 8 gaps). User decision (structured question): follow the text, not the C4 pitch. Hook and reframe are rewritten to the text-true version: วันทอง declines to choose, and "สองใจ" is in her own mouth (ตอน ๓๕) before it is the king's charge; ขุนช้าง petitions the king, พระไวย (พลายงาม) fetches his mother and pleads for the pardon; no ร.๔/ร.๕ editing claim.

- 2026-11-15 user decisions on MGF-EP03 script R1 (structured question): title **"ใครว่าวันทองสองใจ"**; narrator reads all verse lines (king and วันทอง get no separate voice); if Boat cannot confirm the king's "มีผัวสอง" line from the page image, cut that line. Boat fact-check of R1 started the same day.
- 2026-11-15 Boat fact-check MGF-EP03-SCRIPT-R1 done ([ep03/fact-check.md](ep03/fact-check.md)): verdict revision-required; verses OT01–03, OT06–07, OT08, OT09 confirmed on page images; five must-fix, wording fixes proposed, not applied.

- 2026-11-15 user decisions on MGF-EP03 script R2 (structured question): keep the Long at ~12:48 (no trims); the narrator reads "อีแพศยา" as the text has it. Boat recheck of R2 started the same day; narrator voice pick (≤10 s samples) pending.

- 2026-11-15 user approved MGF-EP03-SCRIPT-R2.1 (R2 + Boat optional wording fixes O7–O11, wording only). Narrator voice picked by ear from ≤10 s samples (structured question): **Achernar** (Gemini TTS, style "low and close storyteller, measured, quietly defiant, steady pace", atempo 1.05); one voice for all verse. Samples: `~/ReelsStore/projects/fiction/MGF/ep03-samples/` (Achernar, Kore, Algenib, Charon; 10.0–10.5 s). Next: Film visual brief (W2); full read waits for the voice lock after the first storyboard page.
