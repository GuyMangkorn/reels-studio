# THE BLOOP delivery

- Deliverable: `BLOOP-EP01-SHORT`; selection: Short only (channel default duration, 1080×1920, 30 fps). Explicit user selection via structured question on 2026-10-29 (“Short อย่างเดียว”).
- Authorized scope: **script/editorial only**, user's structured reply “บทอย่างเดียว” on 2026-10-29. This pass ends with Boat research, Preaw script and Boat exact-revision fact-check. Film/Mark/Boss/Editor are not invoked.
- Profile: `channel-default` mystery-educational; named real case (The Bloop, NOAA hydrophone recording, 1997). Concept from user: the clip may show "the Bloop" as a giant creature, but the reveal is that the sound was ice cracking/icequake picked up by underwater microphones, which people mistook for a giant animal. Niwat TTS default; sparse underwater ambience/SFX ducked under voice; outlined Thai captions; ending `B_loop` default.
- Visual engine: **Painted 2D (p5.brush)**, user's structured reply on 2026-10-29. Runtime status `exists-unintegrated` (spike only); integration is a future Boss dependency before Editor work.
- Tier: Full (named real case with factual claims and a twist); this pass runs only the editorial stages.
- Runtime/audio/captions: not implemented; composition not registered.

| Deliverable | Stage / Next owner | Script / research / review | Brief / scene handoff | Evidence / open items |
| --- | --- | --- | --- | --- |
| BLOOP-EP01-SHORT | Script drafted (`BLOOP-SCRIPT-R1`) — Boat: exact-revision fact-check of `short/script.md` `BLOOP-SCRIPT-R1` against `BLOOP-RESEARCH-R1` | Research: [`research.md`](research.md) `BLOOP-RESEARCH-R1`; script: [`short/script.md`](short/script.md) `BLOOP-SCRIPT-R1` (target 40–60 s, timing **estimated** ≈59.8 s incl. 3 s hold; no read-aloud/TTS); fact-check pending | N/A for script-only scope | All sources lead-only: network policy blocked pmel.noaa.gov, Wikipedia, archives. Unverified: 50°S 100°W + Lovecraft link (`F004`/`F013`), exact NOAA wording, audio licence. Creature = imagination framing only. Script R1 depends on clearing the real NOAA audio (`B01`/`B03`/`B09` wording); user approval: none |

## Handoff log

- 2026-10-29: coordinator recorded selection, profile, engine and script-only scope. Boat research is first.
- 2026-10-29: Boat delivered `BLOOP-RESEARCH-R1` (`scripts/the-bloop/research.md`), status verification-incomplete. No source page could be opened (session network policy). Premise-critical icequake explanation is consistent across leads but primary-unopened. Preaw may draft with the packet's soft wordings. The fact-check cannot reach ready-for-storyboard until `pmel.noaa.gov` (`SRC001`/`SRC002`) is opened.
- 2026-10-29: Preaw delivered `BLOOP-SCRIPT-R1` (`scripts/the-bloop/short/script.md`) from `BLOOP-RESEARCH-R1`: 9 beats `BLOOP-EP01-SHORT-B01`–`B09`, clues `CL01`–`CL06`, claim mapping to F-IDs, sound intent and Film handoff notes. Timing estimated ≈59.8 s. Uses soft wordings only (no Hz, no coordinates, no Lovecraft/R'lyeh, no "8 years later"); `F004`, `F009`, `F013`, `F014` unused. Next: Boat exact-revision fact-check of R1 (all beats; priority `B09` "คือ" vs "consistent with", `B08`, `B04`, `B05`, real-audio licence).
