# POOLDEPTH delivery record

**Selection:** Short only. Resolved from the user's request on 27 October 2026 (Asia/Bangkok): "a new short educational Shorts". No Long.

**Style profile (coordinator defaults, user may override):** genre explainer-educational with a safety payoff; medium open for Film (user allows Blender-only or 2D rig); voice Niwat TTS; music/SFX sparse; captions outline; ending `B_loop`; factual claims: general scientific knowledge plus a safety claim, so Boat research and fact-check are required.

**Tier:** Full (Boat research → Preaw script → Boat fact-check → Film → Mark → Boss → Editor). This record covers the editorial stages only; downstream stages are not started.

| Deliverable ID | Target / timing | Script + factual review | Brief + handoff | Runtime binding | Readiness / approval / gaps |
| --- | --- | --- | --- | --- | --- |
| `POOLDEPTH-SHORT` | 40–60s; estimated about 52 s (syllable estimate, not read aloud) | [topic brief](topic-brief.md) R1, research R1, `short/script.md` `POOLDEPTH-SHORT-R2`; `short/fact-check.md` reviewed R2 (R1 was `revision-required`, kept as history): `ready-for-storyboard` (factual only). | Film brief `VB-POOLDEPTH-SHORT-R2`; Mark handoff `POOLDEPTH-SHORT-BOARD-R2` (`ready-for-dev`) | `integrated-unreviewed` (Editor, 2026-10-28, `claude/pool-depth-short` HEAD `1626adb` + uncommitted working tree): composition `POOLDEPTH-SHORT` (1080x1920, 30 fps, 1620 frames, ending `B_loop`), registry `src/videos/pool-depth/index.ts`, timeline input `scripts/pool-depth/short/timeline.json` (8 `Scene.media` clips `public/pool-depth/shot-01..08.mp4`, local and gitignored). Subtitles: script R2 wording and BOARD-R2 caption groups, wired. Audio: **estimated**; narration NOT generated (`edge-tts` not installed; input prepared at `scripts/pool-depth/short/narration-timeline.json`), no SFX, no music. Samples: 8 scene samples under ignored `out/samples/pool-depth/POOLDEPTH-SHORT/BOARD-R2-integration-1/`; full 1620-frame CLI render, contact sheets and cut/seam frames under `out/qa/pool-depth/`. Studio unverified (`DF-20261026-studio-emfile`). Shared additions pending Boss review: `eyebrowStyle`, empty caption cue, `quadTexts` | Script R2 user-approved 2026-10-27 (script only). Runtime bound and CLI-rendered, but no narration/audio validation, no user approval of the handoff or the render, no Studio check, not release-ready. Script header factual-status line still says recheck pending (Preaw to update). |

## User decisions (dated 27 October 2026, Asia/Bangkok)

- **Script approval:** the user approved `POOLDEPTH-SHORT-R2` in chat ("อนุมัติ script R2"). Approval covers the script only, not runtime, audio or visual validation.
- **Visual medium:** the user chose Blender-only ("ใช้ Blender ล้วน"). Recorded as the style-profile visual medium; Film must verify Blender-to-runtime support in the active checkout before promising it.
- **Next stage:** Film visual/technical brief for `POOLDEPTH-SHORT` against script R2 / fact-check R2. Mark, Boss and Editor not started.
