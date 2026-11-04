# ZCONDO2 delivery record

**Origin:** user, 3 Nov 2026 (Asia/Bangkok, chat): rework the picture of ZCONDO from scratch ("อยาก rework การทำภาพใหม่ของเรื่อง zcondo"). Start with a new storyboard review, a new timeline, and Film re-polishing the scenes. Sound: the user listens first and may redo it later.

**Selection:** Short only, Thai only (EN stays parked). Tier `Full` ([pipeline](../../docs/delivery-workflow.md#pipeline-tiers)).

**Script (carried over, not rewritten):** `ZCONDO-SHORT-TH-R3`, user-approved 28 Oct 2026, copied from [zombie-condo-paint](../zombie-condo-paint/short/script.md) to [short/script.md](short/script.md) with [research.md](research.md) and Boat's [fact-check](short/fact-check.md). W0 and W1 are carried over; story beats B01–B10, clues and ending are unchanged.

**Voice (kept for listening, 3 Nov 2026):** the ZCPAINT TH narration (Gemini Kore +5 %, B09 call) is reused unchanged; inputs copied to [short/](short/) (`vo-TH.json`, `cues-TH.json`, measured lines). The user may ask for a new voice after listening.

**Visual (user, 3 Nov 2026):** `Q-ZC2-1` new project ID, ZCPAINT left untouched as the comparison; `Q-ZC2-2` **a completely new look** (not the ZCPAINT 6-head/cel look, not assumed WORLD FOG): Film designs it from the story first ([story first](../../AGENTS.md#story-first)) and offers look frames to choose from. Visual engine is chosen with the look; painted 2D (p5.brush) with crisp SVG/React layers is the starting assumption (project defaults).

**Look (user, 3 Nov 2026, chat via the coordinator):** `Q-ZC2-F3` answered **LK-A gouache**; then changed to **LK-A for characters, LK-B ink and wash for sets** (rooms, props, backgrounds; mixed layers allowed); then the user also liked LK-B and asked for a variant with less black contour on the characters. Final pick open between `LK-M` (mixed) and `LK-S` (all LK-B, soft figure line), `Q-ZC2-F3b`. Not yet user-approved: the cast, the SH05 seated-MS framing and the cabinet size change (`Q-ZC2-F5`).

**RESET (user, 3 Nov 2026, chat):** the LK-A/B/M/S look work and the SPK-ZC2-01/02 animation spikes are **dropped**. ZCONDO2 now uses the **painted kit look: p5 paint, 4-head cast, original style** (project defaults, [delivery-workflow](../../docs/delivery-workflow.md#project-defaults)), cast and poses picked from the kit by casting line. Lead stays a man; infected has blood on face/mouth; Thai only, existing TH narration; 95.9 s kept. `src/painted/zcondo2/` (look/anim/action files) is parked history, not to be extended.

**Look lock (user, 4 Nov 2026):** kit look approved on proof frames r6 (SH05, SH03, SH04, SH02), with the new user-taste rules UT12 detailed sets, UT13 close camera on a lone character, UT14 simple hands. Infected shirt mustard-olive; cabinet 1.06 m kept.

**ZCPAINT is reference only:** its storyboards, plates and decisions are history. Carry over only what the user asked for again in this record.

## Deliverables

| ID | Stage / Next owner | Notes |
| --- | --- | --- |
| `ZCONDO2-SHORT-TH` | W3.1 Look pick / coordinator (viewer check of the round-9 frames, then publish and ask Q-ZC2-F3b) | Brief `VB-ZC2-SHORT-R1.2` and rows `ZC2-SB-R1.2` by Film 3 Nov 2026 ([visual-brief.md](../../storyboards/zombie-condo2/short/visual-brief.md), [review-rows.json](../../storyboards/zombie-condo2/short/review-rows.json)); review page: pending (built at `out/review-pages/ZCONDO2-SHORT-TH/`, not published). Answered: F1 man, F2 blood on face/mouth, F3 LK-A then mixed (above), F4 keep 95.9 s. Round-9 frames of `ZC2-B02-SH05` (`LK-M`, `LK-S`, earlier LK-A for comparison): store `projects/ZCONDO2/previews/ZC2-B02-SH05-looks-r9/`; Film recommends LK-M. Open: F3b final look, F5 framing/cabinet; the six location look frames wait for F3b (coordinator). |
