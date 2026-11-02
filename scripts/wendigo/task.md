# Tasks — WENDIGO

Record: [delivery.md](delivery.md) · Updated: 2026-11-02, Editor (W5.4 assembly, sound, chrome)

## WDG-EP01-SHORT

**Now:** W5.4 Editor assembly built (2 Nov 2026): composition `WDG-EP01-SHORT`, 20 shots (S03-B01-SH03 silhouette included), **2861 frames (95.4 s)** at 30 fps per `WDG-SS-R2.2`, locked narration `pTIGHT3` at N0 = 1262, chrome, captions and sound D17 in place; stills and range checks only, nothing heard by the Editor. **Next:** user listens ([short/edit-plan.md](short/edit-plan.md) lists the ear checks), then Draft review per shot. Earlier text on this line (WDG-SS-R1, 20 shots, 3510 frames, 117.0 s) is superseded.

- [x] W1 Script lock
  - [x] W1.1 Boat research — r1, [research.md](research.md)
  - [x] W1.2 Preaw script — WDG-SCRIPT-R2
  - [x] W1.3 Boat fact-check — pass on R2, lead-only
  - [x] W1.4 User approves the script — WDG-SCRIPT-R2, 2026-11-02 (hook S01-B01 0–3 s confirmed)
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief — WDG-BRIEF-FILM-R1, [short/film-brief.md](short/film-brief.md), 2026-11-02
  - [x] W2.2 Film storyboard rows (review-rows.json) — SB-R1 untimed, 20 shots, [short/review-rows.json](short/review-rows.json); review page: pending (SB-R2 rows written; SB-R1.6 reviewed)
  - [ ] W2.3 Storyboard page published
- [ ] W3 Look frames and storyboard pass
  - [x] W3.1 Look frames on the page — LF-TENT, LF-SNOW, LF-DOC, LF-MAP in [short/review-rows.json](short/review-rows.json) (SB-R1.2: snow tent revised, DOC caption-zone relaxation VD08b, map added VD09a); painted in `src/painted/wendigo/look.ts`, composition `WDG-LOOKS`; review page: rebuilt, publish pending (coordinator), 2026-11-02 SB-R1.3: LF-TENT redrawn as A-frame tent interior (VD03a); review page: pending LF-TENT revised to SB-R1.4 (inside view, `VD03b`; page rebuilt, not published); SB-R1.5 (user: "picture sits too high, black part too much"): scene recomposed to full frame height (`VD03c`), page rebuilt, not published.
  - [x] W3.1a Repaints after SB-R1.6 (Film, SB-R2.1, 2 Nov 2026): `LF-TENT_r6` (lantern, `VD03d`), `LF-ERA` (`VD08c`), wendigo silhouette study `LF-WENDIGO` (`VD13`/`VD13a`); stills in the store `look-frames/`; page rebuild pending (coordinator), user verdict pending
  - [x] W3.1b `LF-TENT_r7` (Film, SB-R2.2, 2 Nov 2026, `VD03e`): user verdict on r6 (black 45 %, lantern light); dark share 44.8 % (luma < 0.10), caption band mean 0.142 / p95 0.366, amber light through seam holes; store `look-frames/LF-TENT_r7.png`; page rebuild pending (coordinator), user verdict pending
  - [x] W3.2 Look frames approved (look lock) — user in chat, 2 Nov 2026: "ผมโอเคนะ ผ่าน ๆ" after SB-R2.2 (LF-TENT_r7, LF-WENDIGO, LF-ERA, LF-SNOW, LF-DOC, LF-MAP)
  - [x] W3.3 Storyboard passed — user chat approval 2 Nov 2026 covers SB-R2.2; page answers: 19 of 20 shots had a verdict, S02-B04-SH01 was unanswered on the page and is covered by the chat approval only
- [ ] W4 Voice lock
  - [x] W4.1 Voice chosen — Editor, 2 Nov 2026: MAN and WHISPER Algenib (same voice ID, CL04); NARR Kore, mysterious storyteller style (v2; user proposal, not an approval); alternate Enceladus for MAN/WHISPER and Achernar for NARR. Not heard by Editor; reasons in [delivery.md](delivery.md) handoff log
  - [x] W4.2 Narration generated and measured — `audio-measured`, lock v1, [voice-measure.json](../../scripts/wendigo/short/voice-measure.json): NARR speech 62.0 s (script 41.5 s), S01 lines 34.9 s (script 18.5 s); over budget; length accepted by the user at about 100 s (2 Nov 2026). Narrator v2 in [voice-measure-v2.json](../../scripts/wendigo/short/voice-measure-v2.json). Store `projects/WDG-EP01-SHORT/audio/voice-lock-v1/` and `voice-lock-v2/`
  - [x] W4.3 User approves the voice — user chat 2 Nov 2026 ("ผมเอา achernar"): narrator Achernar (mysterious, atempo 1.05), MAN and WHISPER Algenib; about 109 s speech before pauses, user accepted "about 100 s" earlier and did not object to 109 s and the length (v2 sample `voice-lock-v2/listen/…listen-Kore-mysterious_Algenib-man.mp3`; alternates: Achernar narrator, Enceladus man; length about 109 s before pauses to confirm). Narrator Achernar is the final choice (the line above names Kore as the v2 default; the user chose Achernar).
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets — `WDG-SS-R1`, [short/scene-index.md](short/scene-index.md) + `scene-S01.md`, `scene-S02.md`, `scene-S03.md`, 2026-11-02; frames from the Achernar measure and Film's S01 clip read; dependencies `D01`–`D17` in the index; `review-rows.json` timed, review page: pending
  - [ ] W5.2 Boss assets and plates (shot groups 0/G)
  - [x] W5.4 Editor assembly, chrome (D15), captions, sound (D17), 7-frame dissolve into S03-B01-SH03 — `WDG-EP01-SHORT`, [short/edit-plan.md](short/edit-plan.md), 2 Nov 2026; stills + range render only, audio not listened
  - [ ] W5.3 Draft passed (0/20 shots)
- [ ] W6 Final passed (0/N shots)
- [ ] W7 Pinned (0/N shots)
- [ ] W8 Deliver
  - [ ] W8.1 Assembled from the cache, picture lock
  - [ ] W8.2 Delivery render archived
