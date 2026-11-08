# EDU-EP09-SHORT — task

Record: this file. Series context: [concepts.md](../concepts.md) (R5, C28) · series task list: [task.md](../task.md).

**Now:** W3.1 look frames LF01/LF01b/LF02/LF03/LF04 painted (Film, 2026-11-08); LF02 fix round 1 after the viewer check (ROWS-R1.3, BRIEF-R1.3, still `out/edu09/look-frames/v2/LF02.png`); review page: pending. **Next:** coordinator publishes the look-frame review page; user picks/notes, then W4 voice lock

- Deliverable: `EDU-EP09-SHORT`, Short only (Thai), 1080×1920, 30 fps, target 40–60 s (estimate). Profile: educational, painted 2D p5.brush, 4-head cast, Kore narrator (edu default), ending per concept (the user may change it); other fields = project defaults.
- Factual claims for Boat: see the C28 entry in concepts.md R5. All unchecked until research and fact-check. Every try-it-now result needs a real try before scripting.
- Kit gaps (Film R5): see the R5 Film annotation. Shared hand macro (per-finger control in `hands.ts`) is built for EP09 (C28) and reused by EP10 (C25).

- [x] W0 Ideation (C28, user pick 2026-11-08; Short Thai)
- [x] W1 Script lock
  - [x] W1.1 Boat research (2026-11-08, research.md)
  - [x] W1.2 Preaw script (2026-11-08, script.md EDU-EP09-SCRIPT-R1; NAR est. ~48 s, video ~56 s, not read aloud)
  - [x] W1.3 Boat fact-check (2026-11-08, fact-check.md; pass, R-1/R-2 optional)
  - [x] W1.4 Length check (2026-11-08, voice-measure.md; Kore style A + ban1, one read, NAR 45.0 s re-gapped, video ~53-57 s, pass, no cuts)
  - [x] W1.5 User approves the script (EDU-EP09-SCRIPT-R1.2, ending B_loop, user approval 2026-11-08 after hearing the Kore A full read; narration x0.95 slower at user request; L03 to be re-read slower at W4)
- [x] W2 Brief and storyboard — 2026-11-08: W2.1 EDU-EP09-BRIEF-R1 (film-brief.md), W2.2 EDU-EP09-ROWS-R1 (storyboard.md, review-rows.json, 19 shots, est 56.9 s). Open user questions: Q-F1 (separate fingers in macro shots, UT14 exception), Q-F2 (piano + guitar or piano only). Review page: pending (coordinator publishes).
- [ ] W3 Look frames and storyboard pass
  - [x] W3.0 Boss hand macro (`paintHandMacro`, commit abec7e7)
  - [x] W3.1 Film look frames (2026-11-08): stills `out/edu09/look-frames/v1/` (store kind look-frames), code `src/painted/edu09/`, brief R1.2 + rows R1.2; user decisions of 2026-11-08 applied (rig skin, steeper CAM-POV, B02-SH02 f 1250); placeholder: LF04 pianist pose (W5)
  - [x] W3.1 fix round 1 (Film, 2026-11-08): viewer check failed LF02 (class A: plank forearms detached from the sleeves); forearms and hands rebuilt with the kit hand macro from an elbow on the wood, five fingers (Film call: hand about 100 px wide, same `ring-strain` hand as SH01's end), ELDER's laugh brought into frame (yaw 7→6, cx −130); still `out/edu09/look-frames/v2/LF02.png`, store `projects/EDU-EP09-SHORT/look-frames/LF02.c98e9601.png`; brief R1.3, rows R1.3
  - [ ] W3.2 User look-frame review (review page: pending)
- [ ] W4 Voice lock
- [ ] W5 Draft (W5.1 scene sheets, W5.2 Boss assets, W5.3 Editor draft)
- [ ] W6 Final
- [ ] W7 Pinned
- [ ] W8 Deliver (render, cover, posting, kit intake)

- User decision 2026-11-08 (W1.1): **Q2** Schumann cut from the script entirely (Boat recommendation accepted). **Q1** (user tries the fold-middle, fold-index, fold-little, fold-ring variants and reports) open; Preaw waits for it.

- **User real try (2026-11-08, one person, answers Boat Q1):** fold middle, lift ring: cannot lift. Fold index: all other fingers lift. Fold little: all lift. Fold ring, lift middle: lifts. So only the middle-fold/ring-lift pair sticks for this tester; it is one person, not a finding. Script: state the test as the viewer will feel it, hedge that it varies between people.

- User feedback after the full read (2026-11-08): (1) L03 "อย่าเอามืออีกข้างดึง" too fast to follow: re-read L03 separately, slower, at the voice lock (W4), text kept; (2) "แค่" restored in L15 (script R1.2). Everything else OK. W1.5 approval to be confirmed.

- User decisions 2026-11-08 (W2): **Q-F1** macro shots may draw five separate fingers (UT14 exception, macro only; body-scale shots keep mittens); **Q-F2** musicians = piano only (guitar cut, VD20 fallback). Film to apply in rows R1.1.

- 2026-11-08: Film brief R1.1 + rows ROWS-R1.1 (18 shots, ~56.9 s; Q-F1 five-finger macro, Q-F2 piano only applied). Review page (new, private): https://claude.ai/artifact/6fizGegm4Yk5B7gtoHnZqg (slug 2de5d50c-72ad-415d-96fe-027e8567d68f, v1794133738-0e51, `db` declared, empty; verdicts under `reviews/<shot ID>@board`).

- Storyboard pass: user said "ผ่าน" in chat (2026-11-08) for ROWS-R1.1, 18 shots. Per-shot verdicts were not entered on the review page (db empty); chat pass recorded here.

- Review page verdicts read 2026-11-08 (db `reviews/<shot>@board`): 18 of 18 shots `ok` on EDU-EP09-ROWS-R1.1, no notes. Storyboard pass confirmed on the page as well as in chat.
