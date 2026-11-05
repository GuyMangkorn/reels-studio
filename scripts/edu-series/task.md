# Tasks — EDU-SERIES

Record: [delivery.md](delivery.md) · Updated: 2026-11-04, Editor (W4.1-W4.2, W1.4)

## EDU-EP01-SHORT

**Now:** W5.3 Draft passed 23/23 (user, 2026-11-05). Previously: W5.2 passed (user, 2026-11-04, after 4 repaint rounds on stills; viewer check v3 pass). **Next:** W5.3 Editor Draft: narration Kore v1 + L06 gasp, captions with shade (UT12), tag, name card, SFX/BGM, per-shot draft clips (`clips.mjs --draft`), then user Draft review

- [x] W0 Ideation
  - [x] W0.1 Preaw concepts (concepts.md R1)
  - [x] W0.2 Film annotation (Opus)
  - [x] W0.3 User picks a concept (C2, 2026-11-04)
- [ ] W1 Script lock
  - [x] W1.1 Boat research
  - [x] W1.2 Preaw script (R1)
  - [x] W1.3 Boat fact-check
  - [x] W1.4 Length check: measured read 59.53 s (Achernar, atempo 1.08, gaps tightened, incl. 3.02 s jolt gap) vs target 40-60 s (+5 % = 63 s): pass; recorded after W1.5 because the script was approved on an estimate (Editor, 2026-11-04)
  - [x] W1.5 User approves the script (R1.1, 2026-11-04)
- [ ] W2 Brief and storyboard
  - [x] W2.1 Film brief (text) (EDU-BRIEF-R1)
  - [x] W2.2 Film storyboard rows (SS-R1, 23 shots)
  - [x] W2.3 Storyboard page published
- [x] W3 Look frames and storyboard pass
  - [x] W3.1 Look frames on the page (5/5 locations painted, v2 2026-11-04 after the viewer check: LF01, LF02, LF05 repainted, LF04 dumbbell redrawn, LF03 unchanged; store `projects/EDU/previews/look-frames/ep01/v2/`; rows updated, page rebuilt locally (`out/review-pages/EDU-EP01-SHORT/`), publish pending (coordinator); v1 check: [viewer-check-lf-v1](short/viewer-check-lf-v1.md); v2 check 2026-11-04: [viewer-check-lf-v2](short/viewer-check-lf-v2.md) — LF02 fail (bowed head reads as a helmet), LF01/LF05 pass with notes, LF03/LF04 pass; open findings go in the row notes or a second LF02 repaint (coordinator's call); v2 notes: [build-notes](build-notes.md#w31-look-frames-v2-2026-11-04-film); **LF02 v3 + LF04 v3** 2026-11-04 (user approved the second repaint): references and construction sheet in [build-notes](build-notes.md#w31-lf02-v3-references-back-view-bowed-head-2026-11-04-film), store `projects/EDU/previews/look-frames/ep01/v3/` (LF02, LF04, sheet-v3, construction-sketch, LF02-head-crop); rows LF02/LF04 point at v3, page rebuilt locally, publish pending (coordinator); v3 check 2026-11-04: [viewer-check-lf-v3](short/viewer-check-lf-v3.md) — LF04 pass; LF02 fail on facing direction (helmet fixed, dream feel holds; skin-toned nape notch under a level hem reads as a face under bangs), fixes go in the row note or a repaint (coordinator's/user's call); LF02 v4 dream rework 2026-11-04 tried and dropped by user choice (back to v3; notes [build-notes](build-notes.md#w31-lf02-v4-dream-rework-2026-11-04-film)); row LF02 points at v3 again; **LF02 v5** 2026-11-04 (user approved the repaint): nape in hair shadow, short uneven back hem, curtains closed to ±0.3 K, head rolled 6 degrees toward the edge with the crown lower, crew collar band and centre back seam, opaque lilac only across the shoulder tops, heels under trouser hems; store `projects/EDU/previews/look-frames/ep01/v5/` (LF02, LF02-540, LF02-head-crop, head-crop-v3-v5, sheet-v3-v5, LF02-feet-crop); notes [build-notes](build-notes.md#w31-lf02-v5-back-of-head-fix-2026-11-04-film); row LF02 points at v5, page rebuilt locally, publish pending (coordinator); v5 check 2026-11-04: [viewer-check-lf-v5](short/viewer-check-lf-v5.md) — LF02 **pass**, fit to go to the user (face-under-bangs read fixed, feet acceptable; row notes: the bow does not read in the still, carry it in the lean motion or pitch the head ~15 degrees; shoulder piece partly flat with a projecting corner, UT11 minor, optional)) · published 2026-11-04 (artifact v1793802323-ce27)
  - [x] W3.2 Look frames approved (look lock; user "ผ่าน" in chat, 2026-11-04: LF01 v2, LF02 v5, LF03 v2, LF04 v3, LF05 v2)
  - [x] W3.3 Storyboard passed (23/23 shots; user "ผ่าน" in chat, 2026-11-04)
- [x] W4 Voice lock
  - [x] W4.1 Voice chosen: Gemini TTS Achernar, awake soft style, atempo 1.08 (Editor proposal, pending user W4.3)
  - [x] W4.2 Narration generated and measured: `projects/EDU/audio/voice-lock-v1/EDU-EP01-SHORT-narration-lock-v1.wav`, 59.53 s, -16.2 LUFS, measure file `short/narration-measure.json` (audio-measured)
  - [x] W4.3 User approved the voice: Kore v1 (`projects/EDU/audio/voice-lock-v1/EDU-EP01-SHORT-narration-kore-v1.wav`, 61.97 s, -16.1 LUFS); Achernar kept as alternative (user, 2026-11-04). 3 s gap after L05 left for Film (W5.1)
- [ ] W5 Draft
  - [x] W5.1 Film timed scene sheets: [scene-sheets.md](short/scene-sheets.md) EDU-SHEETS-R1 `ready-for-dev`, 23 shots, 1860 f (62.00 s, limit 63 s), jolt gap kept at 2.99 s (no voice regeneration), L06 = separate character voice, caption-shade ladder 0.5/0.4/0.3 at W5.3; `review-rows.json` start/end timed; review page: pending
  - [x] W5.2 Boss assets and plates (shot groups 5/5 built as stills, 2026-11-04: composition `EDU-EP01-SHORT`, 23 scenes, 69 key stills in `out/edu01/w52/` (G1-G5 sheets); Repaint round 2026-11-04 (Boss) after the viewer check: seated sit-up body, faller `noShadow` + bigger, B01-SH02 recompose, pencil fade, SH02 framing, cool dim (see build-notes); NOT yet done: motion check of the sit-up, caption zone fails on every ground (W5.3 shade), no frame-sequence/seek check beyond stills, viewer check pending (coordinator); tick when the coordinator accepts)
  - [x] W5.3 Draft passed (23/23 shots, user, 2026-11-05, after repaint rounds W5.4-W5.9, caption fade W5.7; viewer checks w54/w56/w58/w59 pass; see delivery.md W5.3 and build-notes). Open, not blocking: sound not listened, LF01 look frame not re-rendered, nits in viewer-check-w59.md
- [x] W6 Final passed (23/23 shots, user, 2026-11-05)
- [x] W7 Pinned (23/23 scenes, 2026-11-05, ending C_seamless)
- [ ] W8 Deliver
  - [x] W8.1 Assembled from the cache, picture lock (23 of 23 scenes reused, commit 4996d9c)
  - [x] W8.2 Delivery render archived: `projects/EDU/renders/EDU-EP01-SHORT/4996d9c4bdb5/EDU-EP01-SHORT.mp4` (1080x1920, 30 fps, 62.00 s, -14.0 LUFS, -1.5 dBTP) + `EDU-EP01-SHORT_cover.png` (cover C, user pick 2026-11-05)
  - [ ] W8.3 Posted to the channel (user, date)
  - [ ] W8.4 Kit intake: new people, outfits, animals, poses, sets filed (KIT-P01)
